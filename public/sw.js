self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil(self.clients.claim()));

self.addEventListener('push',event=>{
  let d={};
  try{d=event.data?event.data.json():{}}catch(_){}
  const i=d.signal==='BUY'?'🟢':d.signal==='SELL'?'🔴':'🔔';
  const title='MSP — Market Signal Pro';
  const body=`${i} ${d.signal||'CUSTOM'} SIGNAL — ${d.symbol||''} • ${d.tf||''}
SL: ${d.sl||''} points
TP: ${d.tp||''} points
Lot Size: ${d.lot||''}
⏱️ ${d.timing||'Now'}
${d.message||''}`;
  event.waitUntil(
    self.registration.showNotification(title,{
      body,
      tag:'msp-'+Date.now(),
      renotify:true,
      requireInteraction:false,
      vibrate:[150,80,150],
      data:{url:self.location.origin+'/'}
    })
  );
});

self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const client of list) if('focus' in client) return client.focus();
    return clients.openWindow('/');
  }));
});