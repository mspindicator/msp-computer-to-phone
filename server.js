const express=require('express');
const webpush=require('web-push');
const path=require('path');

const app=express();
app.use(express.json());
app.use(express.static('public'));

let keys;
if(process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY){
  keys={publicKey:process.env.VAPID_PUBLIC_KEY,privateKey:process.env.VAPID_PRIVATE_KEY};
}else{
  keys=webpush.generateVAPIDKeys();
  console.warn('VAPID keys are temporary. Set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY in Render for stable subscriptions.');
}

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:msp@example.com',
  keys.publicKey,
  keys.privateKey
);

let subs=[];

app.get('/api/public-key',(q,r)=>r.json({publicKey:keys.publicKey}));

app.post('/api/subscribe',(q,r)=>{
  const s=q.body?.subscription;
  if(!s?.endpoint) return r.status(400).json({error:'Invalid subscription'});
  subs=subs.filter(x=>x.endpoint!==s.endpoint);
  subs.push(s);
  console.log('Push subscription registered. Total:',subs.length);
  r.json({ok:true});
});

async function send(p){
  if(!subs.length) throw new Error('Connect the phone first.');

  const results=await Promise.allSettled(
    subs.map(s=>webpush.sendNotification(s,JSON.stringify(p),{TTL:3600}))
  );

  const dead=[];
  const errors=[];
  results.forEach((result,i)=>{
    if(result.status==='rejected'){
      const e=result.reason;
      if(e.statusCode===404||e.statusCode===410) dead.push(i);
      else errors.push(e.statusCode ? `Push failed (${e.statusCode})` : (e.message||'Push failed'));
    }
  });

  subs=subs.filter((_,i)=>!dead.includes(i));

  if(errors.length) throw new Error(errors[0]);
}

app.post('/api/send',async(q,r)=>{
  try{
    const p=q.body||{};
    const d=Math.max(0,+p.delay||0);

    if(d){
      setTimeout(()=>send(p).catch(e=>console.error('Scheduled push failed:',e.message)),d*1000);
      return r.json({ok:true});
    }

    await send(p);
    r.json({ok:true});
  }catch(e){
    console.error('Push send failed:',e.message);
    r.status(500).json({error:e.message||'Push notification failed'});
  }
});

app.get('/{*splat}',(q,r)=>r.sendFile(path.resolve('public/index.html')));

app.listen(process.env.PORT||3000,'0.0.0.0',()=>console.log('MSP server running'));
