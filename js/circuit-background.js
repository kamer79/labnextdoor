const canvas = document.getElementById('circuitField');
const ctx = canvas && canvas.getContext('2d');
if (canvas && ctx) {
  let width, height, paths = [], pulses = [];
  const resize = () => { width = canvas.width = innerWidth * devicePixelRatio; height = canvas.height = innerHeight * devicePixelRatio; ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0); width=innerWidth; height=innerHeight; paths=[]; for(let i=0;i<18;i++){ const y=Math.random()*height, x=Math.random()*width*.8; paths.push({x,y,points:[{x,y},{x:x+40+Math.random()*120,y},{x:x+40+Math.random()*120,y:y+(Math.random()-.5)*100},{x:width+40,y:y+(Math.random()-.5)*100}]}); } };
  const draw = () => { ctx.clearRect(0,0,width,height); paths.forEach(p => { ctx.strokeStyle='rgba(55,138,221,.16)'; ctx.lineWidth=1; ctx.beginPath(); p.points.forEach((q,i)=>i?ctx.lineTo(q.x,q.y):ctx.moveTo(q.x,q.y)); ctx.stroke(); p.points.forEach(q=>{ctx.fillStyle='rgba(55,138,221,.35)';ctx.fillRect(q.x-2,q.y-2,4,4);}); }); pulses=pulses.filter(p=>p.life<1); pulses.forEach(p=>{p.life+=.018;ctx.fillStyle=`rgba(245,128,10,${1-p.life})`;ctx.beginPath();ctx.arc(p.x+(width-p.x)*p.life,p.y,3,0,Math.PI*2);ctx.fill();}); requestAnimationFrame(draw); };
  addEventListener('resize', resize); addEventListener('click', e => { if(e.target.closest('a,button')) return; const p=paths[Math.floor(Math.random()*paths.length)]; if(p) pulses.push({x:p.x,y:p.y,life:0}); }); resize(); draw();
}
