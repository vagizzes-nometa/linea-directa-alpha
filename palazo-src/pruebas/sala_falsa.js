// Sala de mentira para probar el juego en línea sin Claude: todas las pestañas del mismo navegador (mismo origen http)
// se ven entre sí por BroadcastChannel. Se inyecta antes de cargar la página (add_init_script).
window.claude={use:async n=>{if(n!=='room')return null;const bc=new BroadcastChannel('fakeroom');const me=Math.random().toString(36).slice(2,10);const peers=new Map();const pres={};const hs=[];
 const self=()=>({peer:me,sameTab:true,isMe:true,kind:'viewer',guest:false,by:null,presence:JSON.parse(JSON.stringify(pres))});
 const snap=()=>[self(),...peers.values()];const fire=ch=>hs.forEach(h=>h(Object.assign({peers:snap(),joined:[],updated:[],left:[]},ch)));
 bc.onmessage=e=>{const m=e.data;if(m.t==='p'){const ex=peers.has(m.peer);const p={peer:m.peer,sameTab:false,isMe:false,kind:'viewer',guest:false,by:null,presence:m.pres};peers.set(m.peer,p);fire(ex?{updated:[p]}:{joined:[p]})}
   else if(m.t==='hello')bc.postMessage({t:'p',peer:me,pres});else if(m.t==='bye'){const p=peers.get(m.peer);if(p){peers.delete(m.peer);fire({left:[p]})}}};
 addEventListener('beforeunload',()=>bc.postMessage({t:'bye',peer:me}));window.__fakeBye=()=>bc.postMessage({t:'bye',peer:me});
 return{peers:()=>snap(),connected:()=>true,onConnection:f=>{setTimeout(()=>f(true),0);return()=>{}},onPeers:f=>{hs.push(f);setTimeout(()=>{f({peers:snap(),joined:snap(),updated:[],left:[]});bc.postMessage({t:'hello'})},0);return()=>{}},
  presence:async patch=>{for(const k in patch){if(patch[k]===null)delete pres[k];else pres[k]=patch[k]}bc.postMessage({t:'p',peer:me,pres:JSON.parse(JSON.stringify(pres))})}}}};
