const SS=(()=>{
  const $s=q=>document.querySelector(q);
  let rt=null,post=null,postScene=null,postCam=null,R=null,cv=null,scene=null,cam=null,vmScene=null,vmCam=null,vm=null,on=false;
  let solids=[],rayMeshes=[],terrainFn=()=>0,killY=-1e9,fx=[],shots=[],items=[],enemies=[];
  const keysS={};let mdx=0,mdy=0,fireHeld=false,aimHeld=false,aimTouch=false,locked=false,joyX=0,joyY=0;
  const ray=new THREE.Raycaster();
  let SR=()=>0.5;function seedRng(n){let a=(n*7919+104729)%2147483647||1;SR=()=>{a=(a*16807)%2147483647;return a/2147483647}}seedRng(1);
  // ---------- armas ----------
  const SW={
    pistol:{name:'Pistola',ammo:4,cd:.35,pel:1,spr:.006,spd:30,kick:.8},
    shotgun:{name:'Escopeta',ammo:2,cd:.9,pel:6,spr:.07,spd:26,kick:1.5},
    rifle:{name:'Fusil',ammo:8,cd:.13,pel:1,spr:.018,spd:34,auto:true,kick:.55},
    knife:{name:'Cuchillo',ammo:1,melee:true,range:2.2,arc:.5,cd:.35,sw:.25,tspd:24,tgrav:3,vr:{pts:[-.27],r:.42,fast:.9}},
    axe:{name:'Hacha',ammo:1,melee:true,range:2.8,arc:.3,cd:.6,sw:.4,tspd:20,tgrav:6,vr:{pts:[-.36],r:.5,fast:1.1}},
    katana:{name:'Katana',ammo:1,melee:true,range:3.4,arc:-.05,cd:.5,sw:.32,multi:true,tspd:16,tgrav:7,vr:{pts:[-.32,-.58,-.84],r:.4,fast:1,multi:true}}
  };
  const FISTS={range:1.6,arc:.5,cd:.45,sw:.25};
  const EW={pistol:{int:1.7,pel:1,spr:.02},shotgun:{int:2.3,pel:5,spr:.09},rifle:{int:2.1,pel:1,spr:.03,burst:3},none:{}};
  // ---------- misiones ----------
  // walls/blocks: [x0,z0,x1,z1,alto]; ramps: [x0,z0,x1,z1,eje,desde,hasta]; plats: [x0,z0,x1,z1,y]; enemies: [x,z,arma,demora,yPiso]; items: [x,z,arma,y]
  const box=(x0,z0,x1,z1,h)=>[x0,z0,x1,z1,h||3.6];
  const room=(w,d)=>[box(-w,-d,w,-d+.5),box(-w,d-.5,w,d),box(-w,-d,-w+.5,d),box(w-.5,-d,w,d)];
  const MIS=[
    {name:'Despertar',intro:'Dos rojos. Movete y el mundo se mueve.',spawn:[0,7,0],w:'pistol',walls:room(9,9),blocks:[box(-4,-1,-2.5,1,2),box(2.5,-1,4,1,2)],enemies:[[-5,-6,'pistol'],[5,-6,'pistol']],items:[]},
    {name:'Pasillo',intro:'Arrancás sin arma. La pistola está adelante.',spawn:[0,16,0],w:null,walls:[box(-2.5,-18,-2,-4),box(-2.5,-1,-2,18),box(2,-18,2.5,-10),box(2,-7.5,2.5,18),box(-2.5,-18.5,2.5,-18),box(-2.5,18,2.5,18.5),box(-9,-6,-2.5,-5.5),box(-9,0,-2.5,.5),box(-9,-6,-8.5,.5),box(2.5,-12,9,-11.5),box(2.5,-6,9,-5.5),box(8.5,-12,9,-5.5)],blocks:[],enemies:[[0,-14,'pistol'],[-6,-3,'pistol',3],[6,-9,'none',2]],items:[[0,9,'pistol'],[0,13,'knife']]},
    {name:'La oficina',intro:'Escritorios para cubrirse. Hay una escopeta.',spawn:[-10,10,Math.PI*.25],w:'pistol',walls:room(13,13),blocks:[box(-7,-7,-4,-6,1.1),box(-1,-7,2,-6,1.1),box(5,-7,8,-6,1.1),box(-7,-1,-4,0,1.1),box(5,-1,8,0,1.1),box(-1,4,2,5,1.1),box(9,6,12.5,12.5,2.4)],enemies:[[-5,-10,'pistol'],[1,-10,'pistol'],[7,-10,'shotgun'],[10,-3,'pistol']],items:[[-9,4,'shotgun'],[-11,8,'knife']]},
    {name:'Escalera',intro:'Están arriba. Subí por las rampas.',spawn:[0,12,0],w:'pistol',walls:room(14,14).map(b=>(b[4]=6.5,b)),blocks:[],plats:[[-13.5,-13.5,13.5,-5,3]],ramps:[[-12,-5,-8,4,'z',3,0],[8,-5,12,4,'z',3,0]],blocks2:[box(-3,-7,3,-6,4)],enemies:[[-6,-10,'pistol',0,3],[6,-10,'pistol',0,3],[0,-12,'rifle',0,3],[0,-2,'none',1]],items:[[-10,8,'rifle']]},
    {name:'Ascensor',intro:'Se abren las puertas. Estás rodeado.',spawn:[0,0,0],w:'pistol',walls:[box(-12,-12,12,-11.5),box(-12,11.5,12,12),box(-12,-12,-11.5,12),box(11.5,-12,12,12),box(-1.6,-1.6,-1.2,-.6),box(1.2,-1.6,1.6,-.6),box(-1.6,.6,-1.2,1.6),box(1.2,.6,1.6,1.6)],blocks:[box(-8,-8,-6,-6,2),box(6,-8,8,-6,2),box(-8,6,-6,8,2),box(6,6,8,8,2)],enemies:[[0,-5,'pistol'],[0,5,'pistol'],[-5,0,'pistol'],[5,0,'shotgun'],[-9,-9,'pistol',4],[9,9,'rifle',5]],items:[]},
    {name:'Galpón',intro:'Mucho espacio y poca cobertura. Llegan refuerzos.',spawn:[-14,14,Math.PI*.25],w:'pistol',walls:room(17,17),blocks:[box(-10,-10,-7,-7,2.4),box(-2,-12,1,-10,1.2),box(6,-11,9,-8,2.4),box(-11,-2,-9,2,1.2),box(-1,-2,2,1,2.4),box(8,0,10,4,1.2),box(-6,7,-3,9,2.4),box(4,8,7,11,1.2)],enemies:[[-8,-14,'rifle'],[0,-14,'pistol'],[8,-14,'pistol'],[12,-4,'shotgun'],[14,10,'pistol',4],[-14,-14,'rifle',6]],items:[[-12,6,'rifle'],[12,13,'shotgun']]},
    {name:'El bar',intro:'Escopetas de cerca. Arrancás con las manos.',spawn:[0,9,Math.PI],w:null,walls:room(11,11),blocks:[box(-9,-10.5,9,-8.5,1.2),box(-7,-3,-5,-1,.9),box(-1,-3,1,-1,.9),box(5,-3,7,-1,.9),box(-7,3,-5,5,.9),box(5,3,7,5,.9)],enemies:[[-6,-6,'shotgun'],[6,-6,'shotgun'],[0,-6,'pistol'],[-8,1,'none'],[8,1,'none']],items:[[-3,7,'pistol'],[0,7,'knife'],[3,7,'knife']]},
    {name:'Azotea',intro:'Techos sobre el vacío. Si caés, perdés.',spawn:[0,13,0],w:'pistol',void:true,walls:[],plats:[[-4,8,4,16,0],[-14,-4,-6,6,0],[6,-4,14,6,0],[-4,-16,4,-6,0],[-1,6,1,8,0],[-6,0,-4,2,0],[4,0,6,2,0],[-1,-6,1,-4,0],[-4,-4,4,4,0]],blocks:[box(-12,0,-10,2,1.2),box(10,0,12,2,1.2),box(-2,-12,2,-11,1.2),box(-1,-1,1,1,2.4)],enemies:[[-10,4,'pistol'],[10,4,'pistol'],[-2,-14,'rifle'],[2,-14,'pistol'],[0,-3,'shotgun',3]],items:[[3,2.5,'rifle'],[-2,10,'knife']]},
    {name:'Laberinto',intro:'Paredes por todos lados. Algunos vienen corriendo.',spawn:[-13,13,0],w:'pistol',walls:room(15,15).concat([box(-10,-15,-9.5,8),box(-5,-8,-4.5,15),box(0,-15,.5,6),box(5,-6,5.5,15),box(10,-15,10.5,9),box(-9.5,-2,-5,-1.5),box(.5,2,5,2.5),box(5.5,-6,10,-5.5)]),blocks:[],enemies:[[-12,-12,'pistol'],[-7,10,'none'],[-2,-12,'shotgun'],[2,10,'none',2],[7,-12,'rifle'],[12,12,'pistol'],[12,-3,'none',4]],items:[[-7,-4,'shotgun'],[8,6,'rifle'],[-12,11,'knife']]},
    {name:'Final',intro:'Tres oleadas. Esto es todo.',spawn:[0,0,0],w:'rifle',walls:room(16,16),blocks:[box(-9,-9,-7,-7,3),box(7,-9,9,-7,3),box(-9,7,-7,9,3),box(7,7,9,9,3),box(-2,-12,2,-11,1.2),box(-2,11,2,12,1.2),box(-12,-2,-11,2,1.2),box(11,-2,12,2,1.2)],enemies:[[0,-14,'pistol'],[0,14,'pistol'],[-14,0,'shotgun'],[14,0,'shotgun'],[-13,-13,'rifle',5],[13,-13,'rifle',5],[-13,13,'none',5],[13,13,'none',5],[0,-14,'shotgun',10],[0,14,'rifle',10],[-14,0,'pistol',10],[14,0,'none',10]],items:[[-5,-5,'shotgun'],[5,5,'pistol'],[2,-2,'knife'],[-2,2,'knife']]}
  ];
  // ---------- audio propio ----------
  let AC=null,mg=null,nb=null;
  function au(){if(AC){if(AC.state==='suspended')AC.resume();return}try{AC=new (window.AudioContext||window.webkitAudioContext)();mg=AC.createGain();mg.gain.value=.55*(typeof cfg!=='undefined'?cfg.vol:1);mg.connect(AC.destination);nb=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=SR()*2-1;ambInit()}catch(e){AC=null}}
  function snd(k,v,pos){if(!AC)return;v=v==null?1:v;const t=AC.currentTime;const out=sndOut(pos),pf=WORLD_S.has(k)?.55+.45*Math.min(1,G.ts||1):1;
    const tone=(f1,f2,dur,type,vol,dl)=>{const t0=t+(dl||0),o=AC.createOscillator(),g=AC.createGain();o.type=type;o.frequency.setValueAtTime(f1*pf,t0);o.frequency.exponentialRampToValueAtTime(Math.max(20,f2*pf),t0+dur);g.gain.setValueAtTime(.0001,t0);g.gain.exponentialRampToValueAtTime(vol*v,t0+.005);g.gain.exponentialRampToValueAtTime(.0001,t0+dur);o.connect(g);g.connect(out);o.start(t0);o.stop(t0+dur+.02)};
    const noise=(f,dur,vol,type,f2)=>{const s=AC.createBufferSource();s.buffer=nb;const fl=AC.createBiquadFilter();fl.type=type||'lowpass';fl.frequency.setValueAtTime(f*pf,t);if(f2)fl.frequency.exponentialRampToValueAtTime(f2*pf,t+dur);const g=AC.createGain();g.gain.setValueAtTime(vol*v,t);g.gain.exponentialRampToValueAtTime(.0001,t+dur);s.connect(fl);fl.connect(g);g.connect(out);s.start(t);s.stop(t+dur+.02)};
    if(k==='shot'){noise(5000,.03,.5,'highpass');noise(2200,.16,.7,'lowpass',300);tone(120,40,.14,'sine',.6)}
    else if(k==='sg'){noise(1400,.35,.9,'lowpass',200);tone(80,30,.3,'sine',.8)}
    else if(k==='eshot'){noise(1600,.12,.25,'lowpass',300);tone(200,60,.1,'sine',.2)}
    else if(k==='shatter'){noise(6000,.35,.5,'highpass',2500);tone(2400,1800,.2,'triangle',.12);tone(3100,2600,.25,'triangle',.08,.03)}
    else if(k==='punch'){noise(900,.08,.6,'lowpass',200);tone(150,60,.1,'sine',.5)}
    else if(k==='swing')noise(700,.18,.35,'bandpass',2000);
    else if(k==='throw')noise(500,.25,.3,'bandpass',1500);
    else if(k==='pick'){tone(660,990,.1,'triangle',.22);tone(990,1320,.1,'triangle',.18,.07)}
    else if(k==='empty')tone(1000,700,.03,'square',.1);
    else if(k==='super'){tone(196,392,.3,'square',.18);tone(294,587,.35,'square',.14,.1)}
    else if(k==='whiz'){noise(4200,.3,.5,'bandpass',800);tone(1100,420,.22,'sine',.07)}
    else if(k==='slash'){noise(3000,.12,.55,'highpass',6000);noise(900,.1,.5,'lowpass',200)}
    else if(k==='clank'){tone(1300,1100,.09,'triangle',.18);tone(2100,1900,.07,'square',.05);noise(3000,.05,.25,'highpass')}
    else if(k==='die'){tone(300,60,.6,'sawtooth',.25);noise(800,.5,.3)}}
  // ---------- choques ----------
  const cl=(v,a,b)=>v<a?a:v>b?b:v;
  function topAt(s,x,z){if(!s.ramp)return s.y1;const r=s.ramp,t=r.ax==='x'?(x-s.x0)/(s.x1-s.x0):(z-s.z0)/(s.z1-s.z0);return r.a+(r.b-r.a)*cl(t,0,1)}
  function collideH(b){const r=b.r,feet=b.pos.y,h=b.h;
    for(const s of solids){const cx=cl(b.pos.x,s.x0,s.x1),cz=cl(b.pos.z,s.z0,s.z1);let dx=b.pos.x-cx,dz=b.pos.z-cz;const d2=dx*dx+dz*dz;if(d2>=r*r)continue;const top=topAt(s,cx,cz);if(feet>=top-.45||feet+h<=s.y0)continue;let nx,nz;
      if(d2>1e-9){const d=Math.sqrt(d2);nx=dx/d;nz=dz/d;b.pos.x+=nx*(r-d);b.pos.z+=nz*(r-d)}else{const L=[b.pos.x-s.x0,s.x1-b.pos.x,b.pos.z-s.z0,s.z1-b.pos.z],m=Math.min(...L),i=L.indexOf(m);nx=i===0?-1:i===1?1:0;nz=i===2?-1:i===3?1:0;b.pos.x+=nx*(m+r);b.pos.z+=nz*(m+r)}
      const vn=b.vel.x*nx+b.vel.z*nz;if(vn<0){b.vel.x-=vn*nx;b.vel.z-=vn*nz}b.blocked=true}}
  function groundAt(x,z,feet,r){let g=terrainFn(x,z);const rr=r*.7;for(const s of solids){const cx=cl(x,s.x0,s.x1),cz=cl(z,s.z0,s.z1);if((x-cx)**2+(z-cz)**2>rr*rr)continue;const top=topAt(s,cx,cz);if(top<=feet+.45&&top>g)g=top}return g}
  function moveBody(b,dt){b.blocked=false;const st=Math.ceil(Math.hypot(b.vel.x,b.vel.z)*dt/.25)||1;for(let i=0;i<st;i++){b.pos.x+=b.vel.x*dt/st;b.pos.z+=b.vel.z*dt/st;collideH(b)}
    b.vel.y-=24*dt;let ny=b.pos.y+b.vel.y*dt;const gh=groundAt(b.pos.x,b.pos.z,b.pos.y,b.r);if(b.onGround&&b.vel.y<=0&&gh>=b.pos.y-.4)ny=gh;if(ny<=gh){ny=gh;if(b.vel.y<0)b.vel.y=0;b.onGround=true}else b.onGround=false;
    if(b.vel.y>0)for(const s of solids){const cx=cl(b.pos.x,s.x0,s.x1),cz=cl(b.pos.z,s.z0,s.z1);if((b.pos.x-cx)**2+(b.pos.z-cz)**2>=b.r*b.r)continue;if(b.pos.y+b.h<=s.y0+.01&&ny+b.h>s.y0){ny=s.y0-b.h;b.vel.y=0}}b.pos.y=ny}
  function insideSolid(p){if(p.y<terrainFn(p.x,p.z))return true;for(const s of solids)if(p.x>=s.x0&&p.x<=s.x1&&p.z>=s.z0&&p.z<=s.z1&&p.y>=s.y0&&p.y<=topAt(s,p.x,p.z))return true;return false}
  function los(a,b){const d=b.clone().sub(a),L=d.length();ray.set(a,d.normalize());ray.far=L;const h=ray.intersectObjects(rayMeshes,false);return !h.length||h[0].distance>L-.3}
  // ---------- materiales ----------
  const WM=()=>new THREE.MeshStandardMaterial({color:'#f2f3f5',roughness:.92});
  const RED=()=>new THREE.MeshStandardMaterial({color:'#e2311e',roughness:.25,metalness:.15,emissive:'#3a0500',emissiveIntensity:.6,flatShading:true});
  const BLK=new THREE.MeshStandardMaterial({color:'#121316',roughness:.35,metalness:.2});
  const BULLET=new THREE.MeshBasicMaterial({color:'#0c0d0f'});const TOPC=new THREE.Color('#b4bbc6'),EDGE=new THREE.LineBasicMaterial({color:'#6b727c'});
  function addSolid(x0,y0,z0,x1,y1,z1,opt){opt=opt||{};const s={x0:Math.min(x0,x1),x1:Math.max(x0,x1),y0:Math.min(y0,y1),y1:Math.max(y0,y1),z0:Math.min(z0,z1),z1:Math.max(z0,z1),ramp:opt.ramp||null};solids.push(s);
    let m;if(s.ramp){const r=s.ramp,P=[],v=(x,z,top)=>[x,top?(r.ax==='x'?(x===s.x0?r.a:r.b):(z===s.z0?r.a:r.b)):s.y0,z],c=[[s.x0,s.z0],[s.x1,s.z0],[s.x1,s.z1],[s.x0,s.z1]],T=c.map(q=>v(q[0],q[1],1)),B_=c.map(q=>v(q[0],q[1],0)),q4=(a,b,cc,dd)=>P.push(...a,...b,...cc,...a,...cc,...dd);
      q4(T[0],T[3],T[2],T[1]);q4(B_[0],B_[1],B_[2],B_[3]);q4(B_[0],T[0],T[1],B_[1]);q4(B_[1],T[1],T[2],B_[2]);q4(B_[2],T[2],T[3],B_[3]);q4(B_[3],T[3],T[0],B_[0]);const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(P,3));g.computeVertexNormals();m=new THREE.Mesh(g,WM());m.material.side=THREE.DoubleSide}
    else{m=new THREE.Mesh(new THREE.BoxGeometry(Math.max(.01,s.x1-s.x0),Math.max(.01,s.y1-s.y0),Math.max(.01,s.z1-s.z0)),WM());m.position.set((s.x0+s.x1)/2,(s.y0+s.y1)/2,(s.z0+s.z1)/2)}
    m.castShadow=m.receiveShadow=true;m.material.color.lerp(TOPC,Math.min(1,Math.max(0,s.y1/9))*.6);m.add(new THREE.LineSegments(new THREE.EdgesGeometry(m.geometry,25),EDGE));scene.add(m);rayMeshes.push(m);return s}
  // ---------- modelos ----------
  const WG={},WMAT=new THREE.MeshStandardMaterial({vertexColors:true,roughness:.35,metalness:.2,flatShading:true,side:THREE.DoubleSide});
  function wgeo(w){return wGeo(w,true)}
  function gunModel(w,scale){const geo=wgeo(w);if(geo){const g=new THREE.Group(),m=new THREE.Mesh(geo,WMAT);m.castShadow=true;g.add(m);if(scale)g.scale.setScalar(scale);return g}
    const g=new THREE.Group(),a=(x,y,z,sx,sy,sz)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),BLK);m.position.set(x,y,z);m.castShadow=true;g.add(m)};
    if(w==='knife'){a(0,0,.02,.05,.07,.16);a(0,.005,-.16,.018,.06,.22);a(0,.02,-.29,.016,.03,.06)}
    else if(w==='pistol'){a(0,0,-.12,.07,.1,.32);a(0,-.11,0,.06,.16,.08)}else if(w==='shotgun'){a(0,0,-.3,.09,.1,.8);a(0,-.06,-.35,.07,.06,.3);a(0,-.05,.12,.08,.14,.28)}else{a(0,0,-.25,.08,.11,.66);a(0,-.13,-.12,.06,.18,.08);a(0,-.04,.15,.07,.12,.24);a(0,.09,-.2,.05,.05,.16)}
    if(scale)g.scale.setScalar(scale);return g}
  function enemyModel(w){const g=new THREE.Group(),hit=[],add=(geo,x,y,z,p)=>{const m=new THREE.Mesh(geo,RED());m.position.set(x,y,z);m.castShadow=true;(p||g).add(m);return m};
    const legL=new THREE.Group(),legR=new THREE.Group();legL.position.set(-.14,.9,0);legR.position.set(.14,.9,0);g.add(legL,legR);
    add(new THREE.CylinderGeometry(.1,.07,.88,5),0,-.44,0,legL);add(new THREE.CylinderGeometry(.1,.07,.88,5),0,-.44,0,legR);
    const b=add(new THREE.CylinderGeometry(.27,.17,.8,5),0,1.3,0);hit.push(b);const h=add(new THREE.IcosahedronGeometry(.22,0),0,1.86,0);hit.push(h);
    const arm=new THREE.Group();arm.position.set(.3,1.55,0);g.add(arm);const am=add(new THREE.CylinderGeometry(.07,.05,.62,5),0,0,-.3,arm);am.rotation.x=Math.PI/2;
    const armL=new THREE.Group();armL.position.set(-.32,1.55,0);g.add(armL);const al=add(new THREE.CylinderGeometry(.07,.05,.62,5),0,0,w==='none'?-.3:0,armL);if(w==='none')al.rotation.x=Math.PI/2;else{al.position.y=-.3;armL.rotation.z=.15}
    let gun=null;if(w!=='none'){gun=gunModel(w);gun.position.set(0,.04,-.62);arm.add(gun)}
    return{g,hit,legs:[legL,legR],gun,arm}}
  function vmModel(w){const g=new THREE.Group(),hand=new THREE.MeshStandardMaterial({color:'#e9eaec',roughness:.6});
    if(!w){for(const s of [-1,1]){const f=new THREE.Mesh(new THREE.BoxGeometry(.11,.11,.16),hand);f.position.set(s*.2,-.2,-.38);f.userData.fist=s;g.add(f)}g.userData.fists=true;return g}
    const gg=gunModel(w);if(SW[w].melee){g.userData.melee=w;if(w==='knife')gg.rotation.set(.35,-.25,0);else if(w==='axe')gg.rotation.set(.25,-.1,0);else gg.rotation.set(.22,-.1,0)}g.add(gg);gg.add(makeHands(w,'#e9eaec','#c9cdd3'));if(w==='pistol')gg.position.set(0,.07,-.02);g.position.set(.24,-.22,-.42);return g}
  function setVM(w){if(vm)vmScene.remove(vm);vm=vmModel(w);vmScene.add(vm);setGunVR(w)}
  // ---------- estado ----------
  const P={pos:new THREE.Vector3(),vel:new THREE.Vector3(),r:.35,h:1.75,onGround:false,yaw:0,pitch:0,alive:true,w:null,ammo:0,cd:0,kick:0,punch:0,jumpQ:false};
  const G={i:0,ts:.03,pulse:0,over:false,clearT:0,done:false,t0:0,elapsed:0,paused:false,menu:true,spawnQ:[],gameT:0};
  // ---------- efectos ----------
  const shardGeo=new THREE.TetrahedronGeometry(.16),chipGeo=new THREE.BoxGeometry(.07,.07,.07);
  function burst(p,col,n,spd,o){o=o||{};const mat=new THREE.MeshStandardMaterial({color:col,flatShading:true,roughness:.4});for(let i=0;i<n;i++){const m=new THREE.Mesh(o.chip?chipGeo:shardGeo,mat);m.position.copy(p).add(new THREE.Vector3((SR()-.5)*.7,(SR()-.5)*(o.sy||.6),(SR()-.5)*.7));m.rotation.set(SR()*6,SR()*6,SR()*6);m.scale.setScalar(.5+SR()*(o.size||1));scene.add(m);const kv=o.dir&&o.dir.lengthSq()>1e-6?o.dir.clone().setY(0).normalize().multiplyScalar(spd*.5*SR()):new THREE.Vector3();fx.push({o:m,v:new THREE.Vector3((SR()-.5)*spd,SR()*spd*.8,(SR()-.5)*spd).add(kv),r:SR()*8,t:o.life||1.4,max:o.life||1.4})}}
  // chispazo: estrella roja que crece y se apaga, con anillo de humo
  const flashes=[],FLG=new THREE.OctahedronGeometry(.16,0),RNG=new THREE.RingGeometry(.12,.2,10);
  function muzzle(p,sc){const m=new THREE.Mesh(FLG,new THREE.MeshBasicMaterial({color:'#ff3b1f',transparent:true,opacity:1,depthWrite:false}));m.position.copy(p);m.rotation.set(SR()*3,SR()*3,SR()*3);scene.add(m);
    const r=new THREE.Mesh(RNG,new THREE.MeshBasicMaterial({color:'#2a2d33',transparent:true,opacity:.5,side:THREE.DoubleSide,depthWrite:false}));r.position.copy(p);r.lookAt(eyeW());scene.add(r);
    flashes.push({m,r,t:0,max:.32,sc:sc||1})}
  function updFlash(dt){for(let i=flashes.length-1;i>=0;i--){const f=flashes[i];f.t+=dt;const k=f.t/f.max;f.m.scale.setScalar(f.sc*(1+k*2.2));f.m.material.opacity=Math.max(0,1-k);f.m.rotation.y+=dt*6;f.r.scale.setScalar(f.sc*(1+k*5));f.r.material.opacity=Math.max(0,.5*(1-k));f.r.lookAt(eyeW());
    if(k>=1){scene.remove(f.m);scene.remove(f.r);f.m.material.dispose();f.r.material.dispose();flashes.splice(i,1)}}}
  function updFx(dt){for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.t-=dt;const k=f.t/f.max;f.v.y-=18*dt;f.o.position.addScaledVector(f.v,dt);f.o.rotation.x+=f.r*dt;const g=groundAt(f.o.position.x,f.o.position.z,f.o.position.y+.05,.05);if(f.o.position.y<g+.05&&g>-100){f.o.position.y=g+.05;f.v.multiplyScalar(.4);f.v.y=Math.abs(f.v.y)*.3}if(k<.25)f.o.scale.multiplyScalar(Math.max(.6,1-dt*4));if(f.t<=0){scene.remove(f.o);fx.splice(i,1)}}}
  // ---------- proyectiles (siempre negros) ----------
  const bulletGeo=new THREE.SphereGeometry(.06,6,4),trailGeo=new THREE.CylinderGeometry(.035,0,1,5);trailGeo.rotateX(-Math.PI/2);trailGeo.translate(0,0,-.5);
  const TRAIL=new THREE.MeshBasicMaterial({color:'#0c0d0f',transparent:true,opacity:.45});
  function shoot(from,dir,speed,owner,kind){const g=new THREE.Group();if(kind){const m=gunModel(kind,1.2);g.add(m)}else{g.add(new THREE.Mesh(bulletGeo,BULLET));const t=new THREE.Mesh(trailGeo,TRAIL);t.scale.z=Math.min(1.4,speed*.03);g.add(t)}
    g.position.copy(from);g.lookAt(from.clone().add(dir));scene.add(g);shots.push({o:g,pos:from.clone(),vel:dir.clone().multiplyScalar(speed),base:speed,trav:0,owner,thrown:!!kind,kind,life:10,spin:kind?12:0})}
  function updShots(dt){for(let i=shots.length-1;i>=0;i--){const s=shots[i];s.life-=dt;let dead=s.life<=0;
    if(!s.thrown){const f=1+.6*Math.max(0,1-s.trav/.5);s.vel.setLength(s.base*f);s.trav+=s.base*f*dt}const L=s.vel.length()*dt,n=Math.max(1,Math.ceil(L/.2));
    if(s.thrown){s.vel.y-=(s.grav||9)*dt}
    for(let k=0;k<n&&!dead;k++){s.pos.addScaledVector(s.vel,dt/n);
      if(insideSolid(s.pos)){dead=true;burst(s.pos,'#16181b',3,2.5,{chip:true,life:.3});if(s.thrown){const bp=backOff(s);if(SW[s.kind].melee){snd('clank',.8,s.pos.clone());dropItem(s.kind,bp.x,bp.z,bp.y,{ammo:1,vel:new THREE.Vector3(-s.vel.x*.12,.4,-s.vel.z*.12)})}else gunBreak(bp,s.vel.clone().negate())}break}
      if(s.owner==='e'&&!s.whiz){const ew=eyeW();if(Math.hypot(s.pos.x-ew.x,s.pos.y-ew.y,s.pos.z-ew.z)<1.1){s.whiz=true;snd('whiz',.9,s.pos.clone())}}
      if(s.owner==='e'&&P.alive){const f=P.pos.y,t=Math.max(f+.25,Math.min(f+P.h-.15,s.pos.y)),lk=(P.leanOff||0)*cl((t-f-.8)/Math.max(.3,P.h-.8),0,1),bx=P.pos.x+Math.cos(P.yaw)*lk,bz=P.pos.z-Math.sin(P.yaw)*lk;if(Math.hypot(s.pos.x-bx,s.pos.z-bz,s.pos.y-t)<.4){dead=true;playerDie()}}
      if(s.owner==='p')for(const e of enemies){if(!e.alive)continue;const ey=e.pos.y+1.1;if(Math.abs(s.pos.y-ey)<1&&Math.hypot(s.pos.x-e.pos.x,s.pos.z-e.pos.z)<(s.thrown?.6:.45)){dead=true;killEnemy(e,s.vel);if(s.thrown){if(SW[s.kind].melee)dropItem(s.kind,e.pos.x,e.pos.z,e.pos.y+1.2,{ammo:1,vel:new THREE.Vector3(s.vel.x*.08,1.5,s.vel.z*.08)});else gunBreak(s.pos.clone(),s.vel.clone())}break}}}
    s.o.position.copy(s.pos);if(s.spin)s.o.rotation.x+=s.spin*dt;if(dead){scene.remove(s.o);shots.splice(i,1)}}}
  // ---------- armas en el piso ----------
  function dropItem(w,x,z,y,src){const m=gunModel(w,1.3);const it={w,x,z,y:y||0,m,ammo:src&&src.ammo!=null?src.ammo:(SW[w].melee?1:1+Math.floor(SR()*Math.ceil(SW[w].ammo*.6)))};m.position.set(x,(y||0)+.35,z);scene.add(m);if(src&&(src.toss||src.vel||src.fall)){const d=src.vel||(src.toss&&src.toss.lengthSq()>1e-6?src.toss.clone().setY(0).normalize().multiplyScalar(1.4):new THREE.Vector3());it.vx=d.x+(SR()-.5)*.6;it.vz=d.z+(SR()-.5)*.6;it.vy=src.vel?src.vel.y:2.6;it.falling=true;it.spin=(SR()-.5)*14}items.push(it);return it}
  function pickNear(force,ox,oz){if(!P.alive)return;const px=ox==null?P.pos.x:ox,pz=oz==null?P.pos.z:oz;let best=null,bd=1.4;for(const it of items){const d=Math.hypot(it.x-px,it.z-pz);if(d<bd&&Math.abs(it.y-P.pos.y)<1.5&&(it.ammo>0||force)){bd=d;best=it}}
    if(!best)return false;if(P.w&&!force)return false;if(P.w&&P.ammo>0)dropItem(P.w,P.pos.x+Math.sin(P.yaw)*.6,P.pos.z+Math.cos(P.yaw)*.6,P.pos.y,{ammo:P.ammo});
    P.w=best.w;P.ammo=best.ammo;scene.remove(best.m);items.splice(items.indexOf(best),1);setVM(P.w);snd('pick');return true}
  // ---------- jugador ----------
  function playerDie(){if(!P.alive||G.clearT>0)return;P.alive=false;G.deaths=(G.deaths||0)+1;G.over=true;snd('die');msg('MUERTO<small>clic o R para reintentar</small>',99)}
  function killEnemy(e,dir){if(!e.alive)return;e.alive=false;snd('shatter',1,e.pos.clone().setY(e.pos.y+1.2));burst(e.pos.clone().setY(e.pos.y+1.2),'#e2311e',44,7,{life:2.4,sy:1.6,size:1.2,dir:dir});scene.remove(e.g);
    if(e.w!=='none'){const dx=P.pos.x-e.pos.x,dz=P.pos.z-e.pos.z,dd=Math.hypot(dx,dz)||1,hs=Math.min(8,dd*.75/.6);dropItem(e.w,e.pos.x,e.pos.z,e.pos.y+1.3,{vel:new THREE.Vector3(dx/dd*hs,3,dz/dd*hs)})}
    checkClear()}
  function fire(){
    if(!P.alive||G.over||G.clearT>0)return;
    if(!P.w||SW[P.w].melee){if(X.on)return;if(P.cd>0)return;const M=P.w?SW[P.w]:FISTS;P.cd=M.cd;P.punch=M.sw;P.sw=M.sw;snd(P.w==='katana'?'slash':'swing');
      const fwd=new THREE.Vector3(-Math.sin(P.yaw),0,-Math.cos(P.yaw));for(const e of enemies){if(!e.alive)continue;const dx=e.pos.x-P.pos.x,dz=e.pos.z-P.pos.z,d=Math.hypot(dx,dz)||.01;if(d<M.range&&Math.abs(e.pos.y-P.pos.y)<1.6&&(dx*fwd.x+dz*fwd.z)/d>M.arc){snd(P.w?'slash':'punch',1,e.pos.clone().setY(e.pos.y+1.2));killEnemy(e,fwd);if(!M.multi)break}}return}
    if(P.ammo<=0){if(P.cd<=0){snd('empty');P.cd=.22;const el=$s('#sspips');el.classList.remove('flash');void el.offsetWidth;el.classList.add('flash')}return}
    const W=SW[P.w];if(P.cd>0)return;P.cd=W.cd;P.ammo--;P.kick=1;G.pulse=.14;snd(P.w==='shotgun'?'sg':'shot',.8);
    const ar=aimRay(),base=ar.dir,from=ar.from;
    const spr=W.spr*(1-.75*(P.aim||0));for(let i=0;i<W.pel;i++){const d=base.clone();d.x+=(SR()-.5)*spr*2;d.y+=(SR()-.5)*spr*2;d.z+=(SR()-.5)*spr*2;shoot(from,d.normalize(),W.spd,'p')}
    if(!W.auto)fireHeld=false;
  }
  function throwWeapon(){if(!P.w||!P.alive)return;const ar=aimRay(),dir=ar.dir,from=ar.from;
    const M=SW[P.w],kn=!!M.melee;shoot(from,dir.add(new THREE.Vector3(0,kn?.02:.08,0)).normalize(),kn?M.tspd:18,'p',P.w);shots[shots.length-1].grav=kn?M.tgrav:9;snd('throw');P.w=null;P.ammo=0;setVM(null);P.cd=.25;fireHeld=false}
  // ---------- enemigos ----------
  function spawnEnemy(x,z,w,y){const m=enemyModel(w),e={g:m.g,hit:m.hit,legs:m.legs,arm:m.arm,kick:0,w,pos:new THREE.Vector3(x,y||0,z),vel:new THREE.Vector3(),r:.4,h:1.9,onGround:true,alive:true,fireCd:(1.1-.45*(G.k||0))+SR()*.7,burst:0,burstCd:0,losT:0,sees:false,walk:0,yaw:0,strafe:SR()*6};m.g.position.copy(e.pos);scene.add(m.g);enemies.push(e);burst(e.pos.clone().setY(e.pos.y+1),'#e2311e',6,2,{chip:true,life:.5});return e}
  function enemyAI(e,dt){
    const eye=e.pos.clone();eye.y+=1.55;const pe=P.pos.clone();pe.y+=P.h-.15;if(P.leanOff){pe.x+=Math.cos(P.yaw)*P.leanOff;pe.z-=Math.sin(P.yaw)*P.leanOff}const dx=P.pos.x-e.pos.x,dz=P.pos.z-e.pos.z,d=Math.hypot(dx,dz)||1;
    e.losT-=dt;if(e.losT<=0){e.losT=.2;e.sees=P.alive&&los(eye,pe)}
    const k=G.k||0,rush=e.w==='none',keep=rush?0:e.w==='shotgun'?4:7,sp=(rush?3.1:1.8)+k*1.4,sa=.45+k*.6;let tx=0,tz=0;const s=Math.sin(G.gameT*(1.4+k)+e.strafe);
    if(P.alive&&(e.sees||rush)){const adv=d>keep?1:d<keep*.5?-.5:0;tx=(dx/d)*adv-(dz/d)*s*(rush?0:sa);tz=(dz/d)*adv+(dx/d)*s*(rush?0:sa)}
    e.vel.x+=(tx*sp-e.vel.x)*Math.min(1,dt*6);e.vel.z+=(tz*sp-e.vel.z)*Math.min(1,dt*6);
    // no caminar hacia un borde con caída
    if(e.onGround){const ax=e.pos.x+e.vel.x*.4,az=e.pos.z+e.vel.z*.4;if(groundAt(ax,az,e.pos.y,e.r)<e.pos.y-1.1){e.vel.x=0;e.vel.z=0}}
    const p0=e.pos.clone();moveBody(e,dt);if(rush&&e.blocked&&e.onGround&&e.pos.y<.5&&SR()<.04)e.vel.y=7;
    e.yaw=Math.atan2(-dx,-dz);e.g.position.copy(e.pos);e.g.rotation.y=e.yaw;e.walk+=Math.hypot(e.vel.x,e.vel.z)*dt*2.2;e.legs[0].rotation.x=Math.sin(e.walk)*.6;e.legs[1].rotation.x=-Math.sin(e.walk)*.6;if(e.arm){e.kick=Math.max(0,e.kick-dt*3);e.arm.rotation.x=e.kick*.7}
    if(e.pos.y<killY){e.alive=false;scene.remove(e.g);checkClear();return}
    if(rush){if(d<1.1&&Math.abs(P.pos.y-e.pos.y)<1.4)playerDie();return}
    const W=EW[e.w];e.fireCd-=dt;e.burstCd-=dt;
    if(e.burst>0&&e.burstCd<=0){e.burst--;e.burstCd=.18;eShot(e,eye,pe,W)}
    if(e.sees&&e.fireCd<=0&&P.alive){e.fireCd=W.int*(1.2-.5*(G.k||0))*(.8+SR()*.4);if(W.burst){e.burst=W.burst-1;e.burstCd=.18}eShot(e,eye,pe,W)}
  }
  function eShot(e,eye,pe,W){const from=eye.clone().add(new THREE.Vector3(-Math.sin(e.yaw)*.65,-.02,-Math.cos(e.yaw)*.65));e.kick=1;muzzle(from,W.pel>1?1.5:1);const tt=pe.distanceTo(from)/(7+4*(G.k||0)),base=pe.clone().addScaledVector(new THREE.Vector3(P.vel.x,0,P.vel.z),Math.min(.3,tt*.15)).sub(from).normalize();
    for(let i=0;i<W.pel;i++){const d=base.clone();d.x+=(SR()-.5)*W.spr*2;d.y+=(SR()-.5)*W.spr*2;d.z+=(SR()-.5)*W.spr*2;shoot(from,d.normalize(),7+4*(G.k||0),'e')}snd('eshot',.6,from)}
  // ---------- carga de misión ----------
  function clear(){if(typeof flashes!=='undefined'&&scene){for(const f of flashes){scene.remove(f.m);scene.remove(f.r)}flashes.length=0}if(scene){for(const s of shots)scene.remove(s.o);for(const f of fx)scene.remove(f.o)}shots=[];fx=[];items=[];enemies=[];solids=[];rayMeshes=[]}
  function bounds(M){let x0=1e9,z0=1e9,x1=-1e9,z1=-1e9;for(const w of (M.walls||[])){x0=Math.min(x0,w[0]);z0=Math.min(z0,w[1]);x1=Math.max(x1,w[2]);z1=Math.max(z1,w[3])}return[x0+1,z0+1,x1-1,z1-1]}
  function sample(M,B){for(let t=0;t<80;t++){let x,z;
      if(M.void){const p=M.plats[(SR()*M.plats.length)|0];if(p[2]-p[0]<3&&p[3]-p[1]<3)continue;x=p[0]+.7+SR()*(p[2]-p[0]-1.4);z=p[1]+.7+SR()*(p[3]-p[1]-1.4)}else{x=B[0]+SR()*(B[2]-B[0]);z=B[1]+SR()*(B[3]-B[1])}
      const y=groundAt(x,z,10,.4);if(y<-1)continue;let ok=true;for(const [ox,oy,oz] of [[0,.6,0],[0,1.6,0],[.5,1,0],[-.5,1,0],[0,1,.5],[0,1,-.5]])if(insideSolid(new THREE.Vector3(x+ox,y+oy,z+oz)))ok=false;if(ok)return[x,z,y]}return null}
  // etapas 2 a 5: armadas con semilla fija a partir del mapa de la misión
  function genStage(M,i,st,k){
    const B=M.void?null:bounds(M),sp=sample(M,B)||[M.spawn[0],M.spawn[1],0];
    const n=M.enemies.length+st+Math.floor(k*2),firstWave=Math.ceil(n*.6),en=[];let cx=0,cz=0;
    for(let j=0;j<n;j++){let q=null;for(let t=0;t<30;t++){const c=sample(M,B);if(c&&Math.hypot(c[0]-sp[0],c[1]-sp[1])>=7.5){q=c;break}}if(!q)continue;
      const r=SR(),w=r<.12+.06*st?'none':r<.62-.15*k?'pistol':r<.82?'shotgun':'rifle';en.push({x:q[0],z:q[1],y:q[2],w,t:j>=firstWave?2+(j-firstWave)*2.2:0});cx+=q[0];cz+=q[1]}
    cx/=Math.max(1,en.length);cz/=Math.max(1,en.length);
    const items=[];for(let t=0;t<2;t++){let q=null;for(let u=0;u<30;u++){const c=sample(M,B);const d=c&&Math.hypot(c[0]-sp[0],c[1]-sp[1]);if(c&&d>3&&d<10){q=c;break}}if(q)items.push({w:t===0?['pistol','shotgun','rifle'][(SR()*3)|0]:'knife',x:q[0],z:q[1],y:q[2]})}
    return{spawn:[sp[0],sp[1],Math.atan2(sp[0]-cx,sp[1]-cz),sp[2]],w:[null,'knife',null,'pistol','knife'][st],enemies:en,items};
  }
  // ---------- niveles: 5 salas conectadas por puertas, cada misión con su estilo ----------
  const THEMES=[
    {name:'Búnker',intro:'Salas de hormigón y pasillos angostos. Limpiá cada sala y se abre la puerta.',w:'pistol',rw:[9,12],rd:[9,12],cor:[5,8],gen:'rooms',cover:'pillar',n:2,wallH:3.6},
    {name:'Shopping',intro:'Patios abiertos con tres pisos de balcones y escaleras mecánicas. Mirá para arriba.',w:'pistol',rw:[26,30],rd:[24,28],cor:[4,6],gen:'atrium',n:4,wallH:10.5,fog:[45,130]},
    {name:'Oficinas',intro:'Escritorios para cubrirse.',w:'pistol',rw:[12,15],rd:[10,13],cor:[3,5],gen:'rooms',cover:'desk',n:3,wallH:3.6},
    {name:'Estacionamiento',intro:'Desniveles con rampas, columnas y autos. Hay rojos en cada piso.',w:'pistol',rw:[26,30],rd:[22,26],cor:[4,6],gen:'parking',n:4,wallH:8,fog:[40,120]},
    {name:'Ascensores',intro:'Cuartos chicos y muchos rojos cerca.',w:'knife',rw:[7,8.5],rd:[7,8.5],cor:[5,8],gen:'rooms',cover:'none',n:3,wallH:3.6},
    {name:'Puerto',intro:'Contenedores apilados y distancias largas. Ojo con los de arriba.',w:'rifle',rw:[30,34],rd:[28,32],cor:[4,6],gen:'port',n:5,wallH:6,fog:[50,140]},
    {name:'El bar',intro:'Mesas, barras y escopetas de cerca.',w:null,rw:[11,13],rd:[10,12],cor:[3,4],gen:'rooms',cover:'table',n:3,wallH:3.6},
    {name:'Azotea',intro:'Techos a distintas alturas sobre el vacío, unidos por rampas. Si caés, perdés.',w:'pistol',rw:[12,15],rd:[11,14],cor:[6,9],gen:'roofs',n:4,void:true,fog:[45,130]},
    {name:'Obra',intro:'Una construcción a medio hacer: losas con agujeros y rampas.',w:'pistol',rw:[22,26],rd:[22,26],cor:[4,6],gen:'obra',n:4,wallH:9,fog:[40,120]},
    {name:'Final',intro:'Patios enormes de varios pisos. Todo lo aprendido.',w:'rifle',rw:[30,34],rd:[28,32],cor:[4,6],gen:'atrium',pillars:true,n:5,wallH:10.5,fog:[50,140]}
  ];
  MIS.length=0;THEMES.forEach(t=>MIS.push(t));
  let secs=[],sunL=null;
  const rr=(a)=>a[0]+SR()*(a[1]-a[0]);
  function wall(x0,z0,x1,z1,h,y0){return addSolid(x0,y0||0,z0,x1,(y0||0)+(h||3.6),z1)}
  function wallGap(x0,x1,z,gx,h){const g=1.25;if(gx==null){wall(x0,z-.25,x1,z+.25,h);return}if(gx-g>x0)wall(x0,z-.25,gx-g,z+.25,h);if(gx+g<x1)wall(gx+g,z-.25,x1,z+.25,h)}
  function inSec(sec,x,z,m){m=m||0;return x>sec.x0-m&&x<sec.x1+m&&z>sec.z0-m&&z<sec.z1+m}
  let allLevels=[0];
  function freeAt(x,z,sec){const lv=sec?sec.levels:allLevels,top=Math.max(...lv)+.1,y=groundAt(x,z,top,.4);if(y<-1)return null;if(!lv.some(l=>Math.abs(y-l)<.06))return null;
    for(const [ox,oy,oz] of [[0,.6,0],[0,1.6,0],[.5,1,0],[-.5,1,0],[0,1,.5],[0,1,-.5]])if(insideSolid(new THREE.Vector3(x+ox,y+oy,z+oz)))return null;return y}
  function samplePt(sec,T,cond){for(let t=0;t<120;t++){const x=sec.x0+1+SR()*(sec.x1-sec.x0-2),z=sec.z0+1+SR()*(sec.z1-sec.z0-2);if(cond&&!cond(x,z))continue;const y=freeAt(x,z,sec);if(y!=null)return[x,z,y]}return null}
  // piezas de construcción
  function slab(x0,z0,x1,z1,y){addSolid(x0,y-.4,z0,x1,y,z1)}
  function ramp(x0,z0,x1,z1,ax,a,b){addSolid(x0,Math.min(a,b)-.4,z0,x1,Math.max(a,b),z1,{ramp:{ax,a,b}})}
  function rail(x0,z0,x1,z1,y){// baranda baja con huecos para tirar
    const alongX=Math.abs(x1-x0)>Math.abs(z1-z0),L=alongX?x1-x0:z1-z0,seg=4,gap=1.6;for(let t=0;t<L-.5;t+=seg+gap){const e=Math.min(L,t+seg);if(alongX)addSolid(x0+t,y,z0,x0+e,y+1.05,z1);else addSolid(x0,y,z0+t,x1,y+1.05,z0+e)}}
  function coverIn(sec,T,clear){
    const W_=sec.x1-sec.x0,D_=sec.z1-sec.z0,placed=[],blk=[];
    const rmp=(x0,z0,x1,z1,ax,a,b)=>{const X0=Math.min(x0,x1),X1=Math.max(x0,x1),Z0=Math.min(z0,z1),Z1=Math.max(z0,z1);if(Math.min(a,b)<.1)for(const c of clear)if(X1>c[0]-1.6&&X0<c[0]+1.6&&Z1>c[1]-3&&Z0<c[1]+3)return;ramp(x0,z0,x1,z1,ax,a,b);blk.push([Math.min(x0,x1),Math.min(z0,z1),Math.max(x0,x1),Math.max(z0,z1)])};
    const ok=(x0,z0,x1,z1,by)=>{for(const q of blk)if(x1>q[0]-.7&&x0<q[2]+.7&&z1>q[1]-.7&&z0<q[3]+.7)return false;if(!by)for(const c of clear)if(x1>c[0]-1.4&&x0<c[0]+1.4&&z1>c[1]-2.6&&z0<c[1]+2.6)return false;for(const p of placed)if(p[4]===(by||0)&&x1>p[0]-1.1&&x0<p[2]+1.1&&z1>p[1]-1.1&&z0<p[3]+1.1)return false;return x0>sec.x0+.6&&x1<sec.x1-.6&&z0>sec.z0+.6&&z1<sec.z1-.6};
    const put=(w,d,h,tries,by,area)=>{by=by||0;const A=area||[sec.x0,sec.z0,sec.x1,sec.z1];for(let t=0;t<(tries||30);t++){const x=A[0]+w/2+SR()*(A[2]-A[0]-w),z=A[1]+d/2+SR()*(A[3]-A[1]-d),b=[x-w/2,z-d/2,x+w/2,z+d/2,by];if(ok(b[0],b[1],b[2],b[3],by)&&(!by||groundAt(x,z,by+.1,.3)>=by-.05)){placed.push(b);addSolid(b[0],by,b[1],b[2],by+h,b[3]);return b}}return null};
    const g=T.gen,c=T.cover,x0=sec.x0,x1=sec.x1,z0=sec.z0,z1=sec.z1;
    if(g==='rooms'){
      if(c==='pillar')for(let k=0;k<3+((SR()*3)|0);k++)put(1,1,3.6);
      else if(c==='desk')for(let k=0;k<5+((SR()*3)|0);k++)put(2,1,1);
      else if(c==='table'){put(W_*.55,1,1.2,40);for(let k=0;k<5;k++)put(1.4,1.4,.9)}
    }
    else if(g==='atrium'){const L1=3.5,L2=7,bd=4.2;
      // balcones del primer piso alrededor y del segundo a los costados
      slab(x0,z0,x1,z0+bd,L1);slab(x0,z1-bd,x1,z1,L1);slab(x0,z0+bd,x0+bd,z1-bd,L1);slab(x1-bd,z0+bd,x1,z1-bd,L1);
      slab(x0,z0,x0+bd,z1,L2);slab(x1-bd,z0,x1,z1,L2);
      rail(x0+bd+2.7,z0+bd-.3,x1-bd,z0+bd,L1);rail(x0+bd,z1-bd,x1-bd-2.7,z1-bd+.3,L1);rail(x0+bd-.3,z0+bd+2.4,x0+bd,z1-bd-2.4,L1);rail(x1-bd,z0+bd+2.4,x1-bd+.3,z1-bd-2.4,L1);
      rail(x0+bd-.3,z0+2.6,x0+bd,z1-2.6,L2);rail(x1-bd,z0+2.6,x1-bd+.3,z1-2.6,L2);
      // escaleras mecánicas: planta baja al 1º y del 1º al 2º
      rmp(x0+bd+.1,z0+bd,x0+bd+2.3,z0+bd+7,'z',L1,0);rmp(x1-bd-2.3,z1-bd-7,x1-bd-.1,z1-bd,'z',0,L1);
      rmp(x0+bd,z0+.2,x0+bd+7,z0+2.3,'x',L2,L1);rmp(x1-bd-7,z1-2.3,x1-bd,z1-.2,'x',L1,L2);
      // planta baja: kioscos y canteros; arriba, bancos
      const inner=[x0+bd+2.6,z0+bd+2,x1-bd-2.6,z1-bd-2];for(let k=0;k<4;k++)put(2.2,2.2,2.4,30,0,inner);for(let k=0;k<4;k++)put(1.4,1.4,1,30,0,inner);
      for(let k=0;k<3;k++)put(1.6,.6,1,20,L1,[x0+bd+8,z0,x1-bd,z0+bd]);for(let k=0;k<3;k++)put(1.6,.6,1,20,L1,[x0+bd,z1-bd,x1-bd-8,z1]);
      if(T.pillars)for(let k=0;k<4;k++)put(1.2,1.2,T.wallH,30,0,inner);
    }
    else if(g==='parking'){const xm=x0+W_*.6,PL=2.5,DK=5,zc=(z0+z1)/2;
      slab(xm,z0,x1,z1,PL);rmp(xm-6,z0+4.2,xm,z0+6.6,'x',0,PL);rmp(xm-6,zc-1.2,xm,zc+1.2,'x',0,PL);
      const dx0=xm+6;slab(dx0,z1-D_*.38,x1,z1,DK);rmp(xm+.6,z1-D_*.38+.4,dx0,z1-D_*.38+2.8,'x',PL,DK);rail(dx0,z1-D_*.38-.3,x1,z1-D_*.38,DK);
      for(let px=x0+5;px<x1-2;px+=7)for(let pz=z0+5;pz<z1-2;pz+=7)put(.9,.9,T.wallH,3,0,[px-.5,pz-.5,px+.5,pz+.5]);
      for(let k=0;k<4;k++)put(2.1,4.2,1.35,30,0,[x0,z0,xm-.5,z1]);for(let k=0;k<3;k++)put(2.1,4.2,1.35,30,PL,[xm,z0,x1,z1-D_*.4]);
      rail(xm-.3,z0+6.9,xm,zc-1.6,PL);rail(xm-.3,zc+1.6,xm,z1-1,PL);
    }
    else if(g==='port'){// contenedores sueltos y apilados con escaleras
      const cont=[];for(let k=0;k<9;k++){const rot=SR()<.5,b=put(rot?6:2.5,rot?2.5:6,2.5,40);if(b)cont.push(b)}
      for(let k=0;k<cont.length;k++){const b=cont[k];if(k%4===1){const w=b[2]-b[0],d=b[3]-b[1];addSolid(b[0]+(w>d?1.5:0),2.5,b[1]+(w>d?0:1.5),b[2]-(w>d?1.5:0),5,b[3]-(w>d?0:1.5))}
        if(k%2===0){const w=b[2]-b[0],d=b[3]-b[1];if(w>d){if(b[3]+3.2<z1-.6)rmp(b[0]+1,b[3],b[0]+3,b[3]+3.2,'z',2.5,0)}else{if(b[2]+3.2<x1-.6)rmp(b[2],b[1]+1,b[2]+3.2,b[1]+3,'x',2.5,0)}}}
      for(let k=0;k<4;k++)put(1.2,1.2,1.1,30);
    }
    else if(g==='obra'){const L1=3.5,L2=7,fz=z0+D_*.62,tz=z0+D_*.3;
      // losa del 1º piso por partes, con dos agujeros
      const nx=4,nz=3,tw=W_/nx,td=(fz-z0)/nz,holes=new Set([((SR()*nx)|0)+','+((SR()*nz)|0),((SR()*nx)|0)+','+((SR()*nz)|0)]);
      for(let a=0;a<nx;a++)for(let b2=0;b2<nz;b2++)if(!holes.has(a+','+b2))slab(x0+a*tw,z0+b2*td,x0+(a+1)*tw,z0+(b2+1)*td,L1);
      rmp(x0+W_*.15,fz,x0+W_*.15+2.4,fz+7,'z',L1,0);rmp(x1-W_*.15-2.4,fz,x1-W_*.15,fz+7,'z',L1,0);
      slab(x0,z0,x1,tz,L2);rmp(x0+W_*.45,tz,x0+W_*.45+2.4,tz+6.5,'z',L2,L1);
      for(let a=1;a<nx;a++)for(const zz of [z0+td*.5,fz-.6])put(.7,.7,T.wallH,3,0,[x0+a*tw-.4,zz-.4,x0+a*tw+.4,zz+.4]);
      for(let k=0;k<4;k++)put(1.5,1,1.1,30,0,[x0,fz+1,x1,z1]);for(let k=0;k<3;k++)put(1.5,1,1.1,30,L1,[x0,tz,x1,fz]);
    }
    else if(g==='roofs'){const Y=sec.y;for(let k=0;k<3;k++)put(1.6,1.6,1.2,30,Y);const hut=put(3,3,2.5,30,Y);if(hut){const by=Y+2.5;rmp(hut[0],hut[3],hut[0]+1.6,hut[3]+3.2,'z',by,Y)}}
  }
  function buildLevel(i){
    const T=MIS[i],k=G.k=.3+.7*i/(MIS.length-1);seedRng(1000+i*17);secs=[];const H=T.wallH||3.6;
    const LV={rooms:[0],atrium:[0,3.5,7],parking:[0,2.5,5],port:[0,2.5,5],obra:[0,3.5,7]}[T.gen]||[0];
    const roofY=[0,2.5,5,2,4.5];
    let cx=0,cz=0,w=rr(T.rw),d=rr(T.rd);
    const rooms=[];for(let s=0;s<5;s++){rooms.push({cx,cz,w,d,y:T.void?roofY[s]:0});if(s<4){const wn=rr(T.rw),dn=rr(T.rd),off=(SR()-.5)*Math.min(w,wn)*.55,L=rr(T.cor);const ncz=cz-d/2-L-dn/2;cx+=off;cz=ncz;w=wn;d=dn}}
    for(let s=0;s<5;s++){const r=rooms[s];r.x0=r.cx-r.w/2;r.x1=r.cx+r.w/2;r.z0=r.cz-r.d/2;r.z1=r.cz+r.d/2}
    for(let s=0;s<4;s++){const a=rooms[s],b2=rooms[s+1],lo=Math.max(a.x0,b2.x0)+1.6,hi=Math.min(a.x1,b2.x1)-1.6,mid=(lo+hi)/2;a.doorX=lo<hi?mid+(SR()-.5)*Math.min(hi-lo,6):(Math.max(a.x0,b2.x0)+Math.min(a.x1,b2.x1))/2;b2.backX=a.doorX}
    allLevels=[];
    for(let s=0;s<5;s++){const r=rooms[s],sec={x0:r.x0,x1:r.x1,z0:r.z0,z1:r.z1,i:s,gate:null,y:r.y,levels:T.void?[r.y,r.y+2.5]:LV.slice()};secs.push(sec);for(const l of sec.levels)if(!allLevels.includes(l))allLevels.push(l);
      if(T.void){addSolid(r.x0,r.y-1,r.z0,r.x1,r.y,r.z1)}
      else{wallGap(r.x0-.25,r.x1+.25,r.z1,s>0?r.backX:null,H);wallGap(r.x0-.25,r.x1+.25,r.z0,s<4?r.doorX:null,H);wall(r.x0-.5,r.z0-.25,r.x0,r.z1+.25,H);wall(r.x1,r.z0-.25,r.x1+.5,r.z1+.25,H)}
      if(s<4){const nz=rooms[s+1].z1,dx=r.doorX,ny=rooms[s+1].y;
        if(T.void)ramp(dx-1.1,nz,dx+1.1,r.z0,'z',ny,r.y);else{wall(dx-1.75,nz,dx-1.25,r.z0,H);wall(dx+1.25,nz,dx+1.75,r.z0,H)}
        // la puerta: se abre cuando limpiás la sala
        const gs=addSolid(dx-1.25,r.y,r.z0-.3,dx+1.25,r.y+(T.void?2.2:Math.min(H,3.6)),r.z0+.3);gs.mesh=rayMeshes[rayMeshes.length-1];gs.mesh.material=gs.mesh.material.clone();gs.mesh.material.color.set('#2a2d33');sec.gate=gs;
        if(!T.void&&H>3.6)wall(dx-1.25,r.z0-.25,dx+1.25,r.z0+.25,H-3.6,3.6)}
    }
    for(let s=0;s<5;s++){const r=rooms[s],clear=[];if(s>0)clear.push([r.backX,r.z1]);if(s<4)clear.push([r.doorX,r.z0]);if(s===0)clear.push([r.cx,r.z1-1.5]);coverIn(secs[s],T,clear)}
    // rojos y armas de cada sala (siempre iguales)
    for(let s=0;s<5;s++){const sec=secs[s],r=rooms[s],entry=s===0?[r.cx,r.z1-1.5]:[r.backX,r.z1];
      const n=T.n+Math.floor(s*.6)+Math.floor(k*1.5);sec.en=[];
      for(let j=0;j<n;j++){const md=Math.min(7,Math.min(r.w,r.d)*.45),q=samplePt(sec,T,(x,z)=>Math.hypot(x-entry[0],z-entry[1])>md);if(!q)continue;const rv=SR();
        let w_=rv<.12?'none':rv<.6-.15*k?'pistol':rv<.8?'shotgun':'rifle';if(T.cover==='table'&&w_==='pistol'&&SR()<.5)w_='shotgun';if(q[2]>1&&w_==='none')w_='pistol';if(sec.levels.length>1&&w_==='shotgun'&&SR()<.5)w_='rifle';
        sec.en.push({x:q[0],z:q[1],y:q[2],w:w_,t:j>=n-1&&s>0?3+SR()*2:0})}
      sec.items=[];const q=samplePt(sec,T,(x,z)=>Math.hypot(x-entry[0],z-entry[1])<9);if(q)sec.items.push({w:(r_=>r_<.45?(r_<.2?'knife':r_<.33?'axe':'katana'):['pistol','shotgun','rifle'][(SR()*3)|0])(SR()),x:q[0],z:q[1],y:q[2]})}
    return rooms;
  }
  function activate(s){G.sec=s;const sec=secs[s];for(const e of sec.en){if(e.t)G.spawnQ.push({t:G.gameT+e.t,x:e.x,z:e.z,w:e.w,y:e.y});else spawnEnemy(e.x,e.z,e.w,e.y)}for(const it of sec.items)dropItem(it.w,it.x,it.z,it.y,{ammo:SW[it.w].ammo});checkClear()}
  function near0(){for(const it of items)if(Math.hypot(it.x-P.pos.x,it.z-P.pos.z)<1.4)return true;return false}
  function checkClear(){if(!enemies.every(x=>!x.alive)||G.spawnQ.length||G.open||G.clearT>0)return;
    const sec=secs[G.sec];if(G.sec>=4){G.clearT=2.4;snd('super');return}
    if(sec.gate){const g=sec.gate;solids.splice(solids.indexOf(g),1);rayMeshes.splice(rayMeshes.indexOf(g.mesh),1);g.mesh.userData.sink=true;G.sinking.push(g.mesh)}
    G.open=true;snd('pick');msg('SALA '+(G.sec+1)+' LIMPIA<small>se abrió la puerta · avanzá</small>',1.6)}
  function load(i){
    clear();scene=new THREE.Scene();scene.background=new THREE.Color('#eceef1');scene.fog=new THREE.Fog('#eceef1',30,75);
    scene.add(new THREE.HemisphereLight('#ffffff','#8f96a3',.75));const sun=new THREE.DirectionalLight('#ffffff',.85);sun.castShadow=R.shadowMap.enabled;Object.assign(sun.shadow.camera,{left:-26,right:26,top:26,bottom:-26,near:1,far:120});sun.shadow.mapSize.set(2048,2048);sun.shadow.bias=-.0005;scene.add(sun,sun.target);sunL=sun;scene.add(rig);scene.add(X.msgMesh);X.first=true;X.align=true;
    const M=MIS[i];G.i=i;G.stage=0;G.over=false;G.clearT=0;G.done=false;G.ts=.03;G.gameT=0;G.t0=performance.now();const wasRetry=!!G.retry;if(!G.retry)G.elapsed=0;G.retry=false;G.waiting=false;G.open=false;G.sinking=[];G.spawnQ=[];
    if(M.void){terrainFn=()=>-1000;killY=-12;const g=new THREE.Mesh(new THREE.PlaneGeometry(600,600),new THREE.MeshBasicMaterial({color:'#dfe2e7'}));g.rotation.x=-Math.PI/2;g.position.set(0,-30,-60);scene.add(g)}
    else{terrainFn=()=>0;killY=-1e9;const fl=new THREE.Mesh(new THREE.PlaneGeometry(500,500),new THREE.MeshStandardMaterial({color:'#e3e5e9',roughness:.95}));fl.rotation.x=-Math.PI/2;fl.position.set(0,0,-80);fl.receiveShadow=true;scene.add(fl);rayMeshes.push(fl);const gr=new THREE.GridHelper(400,200,'#cdd2d9','#d6dae0');gr.position.set(0,.01,-80);scene.add(gr)}
    const rooms=buildLevel(i);seedRng(5000+i*31);
    Object.assign(P,{alive:true,w:M.w,ammo:M.w?SW[M.w].ammo:0,cd:0,crouch:false,crTouch:false,h:1.75,kick:0,punch:0,aim:0,onGround:false});P.pos.set(rooms[0].cx,rooms[0].y||0,rooms[0].z1-1.5);if(M.fog){scene.fog.near=M.fog[0];scene.fog.far=M.fog[1]}P.vel.set(0,0,0);P.yaw=0;P.pitch=0;setVM(P.w);
    activate(0);
    if(X.on&&!wasRetry){G.waiting=true;const w0=P.w;P.w=null;P.ammo=0;setVM(null);if(w0){const it=dropItem(w0,P.pos.x,P.pos.z-.55,P.pos.y+.75,{ammo:SW[w0].ammo});it.start=true}msg((w0?'AGARRÁ EL ARMA':'APRETÁ EL GRIP')+'<small>Misión '+(i+1)+' · '+M.name+': empieza cuando '+(w0?'la tomás':'cerrás la mano')+'</small>',99);return}
    msg('MISIÓN '+(i+1)+' · '+M.name.toUpperCase()+'<small>'+M.intro+'</small>',2.4);
  }
  // ================= VR (WebXR) =================
  const X={swing:0,bob:0,runK:0,on:false,supported:false,wantVR:false,first:true,align:true,headL:new THREE.Vector3(0,1.6,0),lastL:new THREE.Vector3(),headQ:new THREE.Quaternion(),lastQ:new THREE.Quaternion(),headW:new THREE.Vector3(),headQW:new THREE.Quaternion(),yaw:0,ctl:[],snap:0,
    msgMesh:null,msgCtx:null,msgTex:null,msgDirty:false,msgHtml:'',wrist:null,wristCtx:null,wristTex:null,wristKey:'',
    hand:{right:{w:null,ammo:0,cd:0,kick:0,gun:null,tip:null},left:{w:null,ammo:0,cd:0,kick:0,gun:null,tip:null}}};
  let rig=null;const tmpV=new THREE.Vector3(),tmpV2=new THREE.Vector3(),tmpQ=new THREE.Quaternion();
  const eyeW=()=>X.on?X.headW:cam.position;
  function xrInit(){
    rig=new THREE.Group();rig.add(cam);R.xr.enabled=true;
    const handMat=new THREE.MeshStandardMaterial({color:'#e9eaec',roughness:.6});
    for(let i=0;i<2;i++){const ray=R.xr.getController(i),grip=R.xr.getControllerGrip(i);rig.add(ray,grip);
      const c={ray,grip,src:null,last:new THREE.Vector3(),vel:new THREE.Vector3(),sp:0,cd:0,prev:{},tipLast:new THREE.Vector3(),tipOk:false};
      ray.addEventListener('connected',e=>{c.src=e.data});ray.addEventListener('disconnected',()=>{c.src=null});
      const hm=new THREE.Mesh(new THREE.BoxGeometry(.07,.09,.13),handMat);hm.position.set(0,-.01,.03);grip.add(hm);c.hm=hm;X.ctl.push(c)}
    const mc=document.createElement('canvas');mc.width=1024;mc.height=384;X.msgCtx=mc.getContext('2d');X.msgTex=new THREE.CanvasTexture(mc);
    X.msgMesh=new THREE.Mesh(new THREE.PlaneGeometry(1.8,.675),new THREE.MeshBasicMaterial({map:X.msgTex,transparent:true,depthTest:false,depthWrite:false}));X.msgMesh.renderOrder=999;X.msgMesh.visible=false;
    const wc=document.createElement('canvas');wc.width=512;wc.height=256;X.wristCtx=wc.getContext('2d');X.wristTex=new THREE.CanvasTexture(wc);
    X.wrist=new THREE.Mesh(new THREE.PlaneGeometry(.17,.085),new THREE.MeshBasicMaterial({map:X.wristTex,transparent:true}));X.wrist.position.set(0,.045,.1);X.wrist.rotation.x=-1.05;
  }
  function rrect(c,x,y,w,h,r){c.beginPath();c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath()}
  function wrapText(c,t,x,y,maxW,lh){const words=t.split(' ');let line='';for(const w of words){const test=line?line+' '+w:w;if(c.measureText(test).width>maxW&&line){c.fillText(line,x,y);line=w;y+=lh}else line=test}if(line)c.fillText(line,x,y)}
  function drawMsg(h){const c=X.msgCtx,W=1024,H=384;c.clearRect(0,0,W,H);
    const title=h.split('<small>')[0].replace(/<[^>]+>/g,''),m=h.match(/<small>([\s\S]*?)<\/small>/);let sub=m?m[1]:'';
    sub=sub.replace('clic o R para reintentar','gatillo para reintentar').replace('clic para volver','Y para salir');
    c.fillStyle='rgba(250,250,251,.88)';rrect(c,8,8,W-16,H-16,28);c.fill();
    c.textAlign='center';c.fillStyle='#e2311e';let fs=118;c.font='700 '+fs+'px Silkscreen, "Courier New", monospace';while(c.measureText(title).width>W-80&&fs>40){fs-=6;c.font='700 '+fs+'px Silkscreen, "Courier New", monospace'}
    c.textBaseline='middle';c.fillText(title,W/2,sub?140:H/2);
    if(sub){c.fillStyle='#16181b';c.font='500 40px "Chakra Petch", system-ui, sans-serif';c.textBaseline='alphabetic';wrapText(c,sub,W/2,262,W-110,48)}
    X.msgTex.needsUpdate=true}
  const handTxt=h=>!h.w?'—':SW[h.w].melee?SW[h.w].name.toUpperCase():SW[h.w].name.toUpperCase()+' '+h.ammo;
  function drawWrist(){const left=enemies.filter(e=>e.alive).length+G.spawnQ.length,L=X.hand.left,Rh=X.hand.right;
    const key=G.i+'|'+(G.sec||0)+'|'+left+'|'+handTxt(L)+'|'+handTxt(Rh)+'|'+Math.round(G.ts*20);if(key===X.wristKey)return;X.wristKey=key;
    const c=X.wristCtx;c.clearRect(0,0,512,256);c.fillStyle='rgba(22,24,27,.86)';rrect(c,4,4,504,248,26);c.fill();
    c.textBaseline='top';c.textAlign='left';c.fillStyle='#ff5a3c';c.font='700 30px Silkscreen, monospace';c.fillText('M'+(G.i+1)+' · SALA '+((G.sec||0)+1)+'/5',26,20);
    c.textAlign='right';c.fillStyle='#f2f3f5';c.font='600 34px "Chakra Petch", sans-serif';c.fillText('ROJOS '+left,486,20);
    c.textAlign='left';c.font='600 32px "Chakra Petch", sans-serif';
    const row=(lab,h,y)=>{c.fillStyle='#9aa1ab';c.fillText(lab,26,y);c.fillStyle=h.w&&!SW[h.w].melee&&h.ammo<=0?'#ff5a3c':'#f2f3f5';c.fillText(handTxt(h),80,y)};
    row('IZQ',L,82);row('DER',Rh,130);
    c.fillStyle='rgba(255,255,255,.18)';c.fillRect(26,200,460,16);c.fillStyle='#e2311e';c.fillRect(26,200,460*Math.min(1,G.ts),16);
    X.wristTex.needsUpdate=true}
  function ctlOf(side){return X.ctl.find(q=>q.src&&(side==='left'?q.src.handedness==='left':q.src.handedness!=='left'))||null}
  function aimRay(c){
    if(X.on){c=c||ctlOf('right')||X.ctl[0];c.ray.getWorldQuaternion(tmpQ);const side=c.src&&c.src.handedness==='left'?'left':'right',hw=X.hand[side].w,gq=hw&&!SW[hw].melee&&wGeo(hw,true),dist=gq?Math.max(.15,-(gq.userData.mn[2]+.05)):.3;const dir=new THREE.Vector3(0,0,-1).applyQuaternion(tmpQ),from=c.ray.getWorldPosition(new THREE.Vector3()).addScaledVector(dir,dist);return{dir,from}}
    const a_=P.aim||0,fwd_=new THREE.Vector3(0,0,-1).applyEuler(cam.rotation),mz={pistol:.6,shotgun:.97,rifle:.9}[P.w]||.7,from=new THREE.Vector3(.22*(1-a_),-.2+.09*a_,-.7-(mz-.7)*a_).applyEuler(cam.rotation).add(cam.position);let dir=fwd_;
    if(a_>.05){ray.set(cam.position,fwd_);ray.far=200;const h=ray.intersectObjects(rayMeshes,false),tgt=cam.position.clone().addScaledVector(fwd_,h.length?Math.max(2,h[0].distance):60);dir=fwd_.clone().lerp(tgt.sub(from).normalize(),a_).normalize()}
    return{dir,from}}
  // modelo del arma de cada mano; el cuchillo lleva un punto en la punta de la hoja
  function gripHand(left,melee){const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:'#e9eaec',roughness:.6,flatShading:true,side:THREE.DoubleSide}),B=(w,hh,d,x,y,z,rx)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,hh,d),m);b.position.set(x,y,z);if(rx)b.rotation.x=rx;g.add(b);return b};
    B(.03,.085,.062,.028,-.055,.012);B(.06,.08,.022,.004,-.058,.036);                       // palma y dorso, del lado de afuera y atrás
    for(let k=0;k<3;k++){const y=-.035-k*.022;B(.056,.017,.018,.004,y,-.03);B(.016,.017,.04,-.025,y,-.012)}   // tres dedos rodeando el frente
    B(.014,.015,.05,-.024,-.008,-.03);                                                       // índice estirado hacia el gatillo
    B(.015,.016,.05,-.025,.0,.01,-.25);                                                       // pulgar al costado, debajo de la corredera
    B(.05,.06,.05,.02,-.1,.05);                                                              // muñeca
    if(left)g.scale.x=-1;return g}
  // mano para armas blancas: el puño rodea el mango (eje z) y la muñeca sale hacia abajo
  function bladeHand(left){const g=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:'#e9eaec',roughness:.6,flatShading:true,side:THREE.DoubleSide}),B=(w,hh,d,x,y,z)=>{const b=new THREE.Mesh(new THREE.BoxGeometry(w,hh,d),m);b.position.set(x,y,z);g.add(b)};
    B(.022,.06,.1,.027,-.004,.005);for(let k=0;k<4;k++){const z=-.035+k*.024;B(.052,.015,.02,.002,-.026,z);B(.015,.044,.02,-.025,-.008,z)}B(.014,.014,.045,-.012,.021,-.012);B(.05,.075,.05,.012,-.07,.012);
    if(left)g.scale.x=-1;return g}
  const GH={pistol:[0,.005,.02],rifle:[0,.03,-.03],shotgun:[0,.035,0]};
  function setHandGun(h,w){if(h.gun&&h.gun.parent)h.gun.parent.remove(h.gun);h.gun=null;h.tip=null;h.pts=null;c_reset(h);h.lab=null;h.w=w;if(!w)return;h.gun=gunModel(w);h.gun.position.set(0,SW[w].melee?-.03:-.06,.05);h.gy=h.gun.position.y;h.rx=SW[w].melee?1.05:0;h.gun.rotation.x=h.rx;const sx=h===X.hand.left?1:-1;{const lf=h===X.hand.left;if(SW[w].melee)h.gun.add(bladeHand(lf));else{const gh=gripHand(lf,false),o=GH[w]||[0,0,0];gh.position.set(o[0],o[1],o[2]);h.gun.add(gh)}}
    if(!SW[w].melee){const cv_=document.createElement('canvas');cv_.width=128;cv_.height=64;const tx=new THREE.CanvasTexture(cv_);const pl=new THREE.Mesh(new THREE.PlaneGeometry(.064,.032),new THREE.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false}));{const uq=wGeo(w,true).userData;pl.position.set(sx*(uq.mx[0]+.022),Math.max(.012,uq.mx[1]*.4),Math.min(.035,uq.mx[2]-.05));pl.rotation.set(-.35,sx*.75,0);pl.renderOrder=3}h.gun.add(pl);h.lab={ctx:cv_.getContext('2d'),tex:tx,key:null};}
    if(SW[w].melee){const sh={knife:.015,axe:.045,katana:.07}[w]||0,ms=h.gun.children[0];ms.position.z+=sh;if(w==='katana')ms.rotation.z=Math.PI;h.pts=SW[w].vr.pts.map(z=>{const o=new THREE.Object3D();o.position.set(0,.01,z+sh);h.gun.add(o);return o});h.tip=h.pts[h.pts.length-1]}}
  function drawLab(h){if(!h.lab)return;const key=h.ammo+'/'+SW[h.w].ammo;if(key===h.lab.key)return;h.lab.key=key;const c=h.lab.ctx;c.clearRect(0,0,128,64);
    c.fillStyle=h.ammo>0?'rgba(22,24,27,.9)':'rgba(226,49,30,.95)';rrect(c,2,2,124,60,14);c.fill();c.fillStyle='#fff';c.textAlign='center';c.textBaseline='middle';
    if(h.ammo>0){c.font='700 46px Silkscreen, monospace';c.fillText(String(h.ammo),64,35)}else{c.font='700 26px Silkscreen, monospace';c.fillText('VACÍA',64,34)}h.lab.tex.needsUpdate=true}
  function c_reset(h){for(const c of X.ctl)c.tipOk=false}
  function backOff(s){const d=s.vel.clone().normalize(),p=s.pos.clone().addScaledVector(d,-.35);for(let k=0;k<6&&insideSolid(p);k++)p.addScaledVector(d,-.2);return p}
  // un arma tirada estalla en esquirlas negras al pegar en algo
  function gunBreak(p,dir){snd('shatter',.85,p.clone());burst(p,'#16181b',26,5.5,{life:2,sy:1,size:.8,dir:dir})}
  function syncP(){P.w=X.hand.right.w;P.ammo=X.hand.right.ammo}
  function setGunVR(w){if(!X.on)return;const h=X.hand.right;if(h.w!==w)setHandGun(h,w);h.ammo=P.ammo}
  function xrPick(side,c,force){const h=X.hand[side],o=X.hand[side==='left'?'right':'left'];c.ray.getWorldPosition(tmpV);
    let best=null,bd=.95;for(const it of items){const d=Math.hypot(it.x-tmpV.x,it.z-tmpV.z);if(d<bd&&tmpV.y-it.y<2.2&&tmpV.y-it.y>-.6&&(it.ammo>0||force)){bd=d;best=it}}
    if(best){if(h.w&&(h.ammo>0||SW[h.w].melee))dropItem(h.w,tmpV.x,tmpV.z,tmpV.y,{ammo:h.ammo,fall:true});
      setHandGun(h,best.w);h.ammo=best.ammo;scene.remove(best.m);items.splice(items.indexOf(best),1);snd('pick');syncP();if(best.start)startNow();return true}
    // pasar el arma de una mano a la otra: juntá las manos y apretá el grip de la que recibe
    const oc=ctlOf(side==='left'?'right':'left');if(o.w&&oc){oc.ray.getWorldPosition(tmpV2);if(tmpV.distanceTo(tmpV2)<.35){const w1=h.w,a1=h.ammo;setHandGun(h,o.w);h.ammo=o.ammo;setHandGun(o,w1);o.ammo=a1;snd('pick');syncP();return true}}
    return false}
  function xrFire(side,c){const h=X.hand[side];if(!h.w||SW[h.w].melee)return;
    if(h.ammo<=0){if(h.cd<=0){snd('empty');h.cd=.22}return}
    const W=SW[h.w];if(h.cd>0)return;h.cd=W.cd;h.ammo--;h.kick=1;G.pulse=.14;const ar=aimRay(c);snd(h.w==='shotgun'?'sg':'shot',.8,ar.from);
    for(let i=0;i<W.pel;i++){const d=ar.dir.clone();d.x+=(SR()-.5)*W.spr*2;d.y+=(SR()-.5)*W.spr*2;d.z+=(SR()-.5)*W.spr*2;shoot(ar.from,d.normalize(),W.spd,'p')}syncP()}
  // soltar el grip: si la mano viene rápida, el arma sale volando con ese envión; si no, se cae
  function startNow(){if(!G.waiting)return;G.waiting=false;msgT=0;snd('super');msg('MISIÓN '+(G.i+1)+' · '+MIS[G.i].name.toUpperCase()+'<small>'+MIS[G.i].intro+'</small>',2.4)}
  function xrRelease(side,c){const h=X.hand[side];if(!h.w)return;const from=c.grip.getWorldPosition(new THREE.Vector3()),Hh=c.hist||[],Lh=Hh[Hh.length-1];let v=new THREE.Vector3();if(Lh){let k=Hh.length-1;while(k>0&&Lh.t-Hh[k-1].t<.1)k--;const A=Hh[k];if(Lh.t-A.t>.01)v=Lh.p.clone().sub(A.p).divideScalar(Lh.t-A.t)}const sp=v.length(),M=SW[h.w];
    if(sp>1.5){const spd=Math.min(24,Math.max(6,sp*(M.melee?1.9:1.6)));shoot(from,v.normalize(),spd,'p',h.w);shots[shots.length-1].grav=M.melee?M.tgrav:9;snd('throw',1,from)}
    else dropItem(h.w,from.x,from.z,from.y-.3,{ammo:M.melee?1:h.ammo,vel:v.multiplyScalar(.6)});
    setHandGun(h,null);h.ammo=0;h.cd=.2;syncP()}
  function xrThrow(side,c){const h=X.hand[side];if(!h.w)return;const ar=aimRay(c),M=SW[h.w],kn=!!M.melee;
    const sp=(kn?M.tspd:18)+Math.min(8,c.sp*2);shoot(ar.from,ar.dir.add(new THREE.Vector3(0,kn?.02:.08,0)).normalize(),sp,'p',h.w);shots[shots.length-1].grav=kn?M.tgrav:9;snd('throw',1,ar.from);setHandGun(h,null);h.ammo=0;h.cd=.25;syncP()}
  // golpe: barrido entre el cuadro anterior y este, desde la punta del cuchillo o desde el puño
  function xrMelee(side,c){const h=X.hand[side],M=h.w?SW[h.w]:null,kn=!!(M&&M.melee);if(h.w&&!kn){c.tipOk=false;return}
    const V=kn?M.vr:{pts:[0],r:.4,fast:1.5},pts=kn&&h.pts?h.pts.map(o=>o.getWorldPosition(new THREE.Vector3())):[c.ray.getWorldPosition(new THREE.Vector3())];
    if(!c.tipOk||!c.ptsLast||c.ptsLast.length!==pts.length){c.ptsLast=pts;c.tipOk=true;return}
    // la velocidad que cuenta es la de la punta de la hoja, no la de la mano
    const tsp=pts[pts.length-1].distanceTo(c.ptsLast[pts.length-1])/Math.max(X.dt||.016,1e-3),fast=Math.max(c.sp,tsp*.7)>V.fast;
    if(fast&&c.cd<=0&&P.alive&&!G.over){let any=false;
      for(const e of enemies){if(!e.alive)continue;let hit=false;
        for(let j=0;j<pts.length&&!hit;j++){const a=c.ptsLast[j],b=pts[j];for(let k=0;k<=6&&!hit;k++){const t=k/6,x=a.x+(b.x-a.x)*t,y=a.y+(b.y-a.y)*t,z=a.z+(b.z-a.z)*t,dy=y-e.pos.y;
          if(dy>.15&&dy<2.15&&Math.hypot(x-e.pos.x,z-e.pos.z)<V.r)hit=true}}
        if(hit){snd(kn?'slash':'punch',1,e.pos.clone().setY(e.pos.y+1.2));const dir=pts[pts.length-1].clone().sub(c.ptsLast[pts.length-1]);killEnemy(e,dir.lengthSq()>1e-6?dir:c.vel.clone());any=true;if(!V.multi)break}}
      if(any)c.cd=h.w==='axe'?.4:.25}
    c.ptsLast=pts}
  function itemsStep(dt){for(let i=items.length-1;i>=0;i--){const it=items[i];if(it.start){it.m.rotation.y+=.02;it.m.position.set(it.x,it.y+.35+Math.sin(performance.now()/400)*.03,it.z);continue}
      if(it.falling){it.vy-=18*dt;const ox=it.x,oz=it.z;it.x+=it.vx*dt;it.z+=it.vz*dt;it.y+=it.vy*dt;
        if(insideSolid(new THREE.Vector3(it.x,it.y+.15,it.z))){it.x=ox;it.z=oz;it.vx*=-.25;it.vz*=-.25}
        const g=groundAt(it.x,it.z,it.y+.35,.12);
        if(it.y<=g){it.y=g;if(it.vy<-3){it.vy=-it.vy*.32;it.vx*=.55;it.vz*=.55;snd('clank',Math.min(1,-it.vy*.12),new THREE.Vector3(it.x,it.y,it.z))}else{it.falling=false;it.vx=it.vz=it.vy=0}}
        if(it.y<-40){scene.remove(it.m);items.splice(i,1);continue}
        it.m.position.set(it.x,it.y+.15,it.z);it.m.rotation.x+=it.spin*dt;it.m.rotation.z+=it.spin*.6*dt}
      else{it.m.rotation.x*=Math.max(0,1-dt*6);it.m.rotation.z*=Math.max(0,1-dt*6);it.m.rotation.y+=dt*1.5;it.m.position.set(it.x,it.y+.35+Math.sin(G.gameT*2+it.x)*.06,it.z)}}}
  function xrStep(dt,xf){
    const sess=R.xr.getSession(),right=ctlOf('right'),left=ctlOf('left');X.dt=dt;X.time=(X.time||0)+dt;
    const gp=c=>c&&c.src&&c.src.gamepad;
    const pressed=(c,i)=>{const g=gp(c);return !!(g&&g.buttons[i]&&g.buttons[i].pressed)};
    const edge=(c,i)=>{if(!c)return false;const v=pressed(c,i),was=c.prev[i];c.prev[i]=v;return v&&!was};
    const axes=c=>{const g=gp(c);if(!g)return[0,0];const a=g.axes;return a.length>=4?[a[2],a[3]]:[a[0]||0,a[1]||0]};
    const rS=edge(right,3),rT=edge(right,0),rTh=pressed(right,0),rG=edge(right,1),rA=edge(right,4),rB=edge(right,5);/* A tira · B salta */
    const lT=edge(left,0),lTh=pressed(left,0),lG=edge(left,1),lX=edge(left,4),lY=edge(left,5),lS=pressed(left,3);X.sprint=lS;
    // cabeza
    const pose=xf&&xf.getViewerPose(R.xr.getReferenceSpace());
    if(pose){const p=pose.transform.position,o=pose.transform.orientation;X.headL.set(p.x,p.y,p.z);X.headQ.set(o.x,o.y,o.z,o.w)}
    const eul=new THREE.Euler().setFromQuaternion(X.headQ,'YXZ');
    if(X.align){X.yaw=-eul.y;X.align=false}
    if(X.first){X.lastL.copy(X.headL);X.lastQ.copy(X.headQ);for(const c of X.ctl){c.last.copy(c.ray.position);c.tipOk=false}
      setHandGun(X.hand.right,P.w);X.hand.right.ammo=P.ammo;X.hand.right.grace=!!P.w;setHandGun(X.hand.left,null);X.hand.left.ammo=0;X.first=false}
    const dL=X.headL.clone().sub(X.lastL),headSp=dL.length()/Math.max(dt,1e-3),ang=X.headQ.angleTo(X.lastQ)/Math.max(dt,1e-3);X.lastL.copy(X.headL);X.lastQ.copy(X.headQ);
    if(lY&&sess){sess.end();return}
    if(G.done&&(rT||lT)){if(sess)sess.end();return}
    if(G.over&&(rT||lT||rA||lX)){G.retry=true;load(G.i);return}
    // giro por pasos con el stick derecho
    {const rx=axes(right)[0];if(Math.abs(rx)>.7){if(!X.snap){X.yaw-=Math.sign(rx)*Math.PI/6;X.snap=1}}else if(Math.abs(rx)<.3)X.snap=0}
    let cy=Math.cos(X.yaw),sy=Math.sin(X.yaw);
    // lo que caminás de verdad en el cuarto mueve el cuerpo (y choca contra las paredes)
    P.pos.x+=dL.x*cy+dL.z*sy;P.pos.z+=-dL.x*sy+dL.z*cy;collideH(P);
    P.h=cl(X.headL.y+.1,.8,2.1);
    const hyaw=X.yaw+eul.y;
    // braceo: las dos manos subiendo y bajando (y el rebote de la cabeza) aceleran
    {let vy=1e9;for(const c of [left,right]){if(!c){vy=0;break}vy=Math.min(vy,Math.abs(c.vel.y))}if(!isFinite(vy))vy=0;const bob=Math.abs(dL.y)/Math.max(dt,1e-3);
      X.swing+=(vy-X.swing)*Math.min(1,dt*5);X.bob+=(bob-X.bob)*Math.min(1,dt*5)}
    if(P.alive){const [ax,ay]=axes(left);let f=Math.abs(ay)>.15?-ay:0,s=Math.abs(ax)>.15?ax:0;const l=Math.hypot(f,s);if(l>1){f/=l;s/=l}
      const calm=G.open||(!enemies.some(e=>e.alive)&&!G.spawnQ.length);P.sf=1;P.calm=calm;
      const runK=Math.max(Math.min(1,Math.max(0,(X.swing-.35)/1.1)),Math.min(1,Math.max(0,(X.bob-.18)/.45)));X.runK=runK;
      if(!(f||s)&&(runK>.15||lS))f=1;const L2=Math.hypot(f,s)||1;
      const spd=(f||s)?Math.max((calm?2.5:.7)+runK*(calm?4.5:2.1),lS?(calm?8:3.2):0):0;
      const hs_=Math.sin(hyaw),hc=Math.cos(hyaw),tx=(-hs_*f/L2+hc*s/L2)*spd,tz=(-hc*f/L2-hs_*s/L2)*spd,acc=P.onGround?8:3;P.vel.x+=(tx-P.vel.x)*Math.min(1,acc*dt);P.vel.z+=(tz-P.vel.z)*Math.min(1,acc*dt);
      if((rB||rS)&&P.onGround){P.vel.y=6.5;P.onGround=false}moveBody(P,dt);
      if(P.pos.y<killY){P.alive=false;G.over=true;snd('die');msg('CAÍSTE<small>clic o R para reintentar</small>',99)}}
    else{P.vel.set(0,0,0)}
    // el rig sigue al cuerpo: la cabeza queda donde está el jugador
    cy=Math.cos(X.yaw);sy=Math.sin(X.yaw);
    rig.rotation.set(0,X.yaw,0);rig.position.set(P.pos.x-(X.headL.x*cy+X.headL.z*sy),P.pos.y,P.pos.z-(-X.headL.x*sy+X.headL.z*cy));rig.updateMatrixWorld(true);
    X.headW.set(P.pos.x,P.pos.y+X.headL.y,P.pos.z);X.headQW.copy(rig.quaternion).multiply(X.headQ);P.yaw=hyaw;P.pitch=eul.x;
    // manos
    let handSp=0;for(const c of X.ctl){if(!c.src)continue;c.vel.copy(c.ray.position).sub(c.last).divideScalar(Math.max(dt,1e-3));c.last.copy(c.ray.position);c.sp=c.vel.length();handSp=Math.max(handSp,c.sp);c.cd-=dt;c.vs=(c.vs||new THREE.Vector3()).lerp(c.vel,.5);const gp=c.grip.getWorldPosition(new THREE.Vector3());(c.hist||(c.hist=[])).push({p:gp,t:X.time});if(c.hist.length>12)c.hist.shift()}
    for(const [side,c] of [['right',right],['left',left]]){const h=X.hand[side];if(c&&h.gun&&h.gun.parent!==c.ray)c.ray.add(h.gun);if(c&&c.hm)c.hm.visible=!h.w}
    if(left&&X.wrist.parent!==left.grip)left.grip.add(X.wrist);
    // armas: cada mano la suya
    if(P.alive&&!G.over&&G.clearT<=0){
      for(const [side,c,T,Th] of [['right',right,rT,rTh],['left',left,lT,lTh]]){if(!c)continue;const h=X.hand[side],gh=pressed(c,1),was=!!c.gWas;c.gWas=gh;
        if(gh&&!was){if(G.waiting&&!items.some(it=>it.start))startNow();if(h.w)h.grace=false;else xrPick(side,c,true)}
        if(!gh&&was&&h.w&&!h.grace)xrRelease(side,c);
        if(T||(Th&&h.w&&SW[h.w].auto))xrFire(side,c)}}
    for(const [side,c] of [['right',right],['left',left]])if(c)xrMelee(side,c);
    // el tiempo: tu cuerpo, tu cabeza y tus manos lo mueven
    const hs=Math.hypot(P.vel.x,P.vel.z);
    let want=.01+Math.min(1,hs/3)*.97+Math.min(.75,Math.max(0,headSp-.06)*.9)+Math.min(.4,Math.max(0,ang-.15)*.15)+Math.min(.85,Math.max(0,handSp-.12)*.55)+(P.onGround?0:.35);
    if(G.pulse>0){G.pulse-=dt;want=Math.max(want,.55)}
    if(!P.alive)want=.006;if(G.clearT>0)want=.3;if(G.waiting){want=0;G.ts=0}{const tw=Math.min(1,want);G.ts+=(tw-G.ts)*Math.min(1,dt*(tw>G.ts?4.5:10))}const gdt=dt*G.ts;G.gameT+=gdt;
    if(P.alive&&G.clearT<=0)G.elapsed+=dt;
    for(const k of ['right','left']){const h=X.hand[k];h.cd-=gdt;h.kick=Math.max(0,h.kick-gdt/(((h.w&&SW[h.w].cd)||.3)*.9));if(h.gun){const kk=h.kick*h.kick*((h.w&&SW[h.w].kick)||1);h.gun.position.z=.05+kk*.03;h.gun.position.y=(h.gy||0)+kk*.03;h.gun.rotation.x=(h.rx||0)+kk*.3}}
    if(G.open&&G.sec<4&&P.alive&&inSec(secs[G.sec+1],P.pos.x,P.pos.z,-.6)){G.open=false;activate(G.sec+1)}
    for(const m_ of G.sinking){m_.position.y-=dt*5;if(m_.position.y<-4){scene.remove(m_);m_.userData.gone=true}}G.sinking=G.sinking.filter(m_=>!m_.userData.gone);
    for(let k=G.spawnQ.length-1;k>=0;k--){const q=G.spawnQ[k];if(G.gameT>=q.t){spawnEnemy(q.x,q.z,q.w,q.y);G.spawnQ.splice(k,1)}}
    for(const e of enemies)if(e.alive)enemyAI(e,gdt);
    updShots(gdt);updFx(gdt);updFlash(gdt);itemsStep(gdt);
    if(G.clearT>0){G.clearT-=dt;const k=Math.floor(G.clearT*2.5)%2;msg(k?'SUPER':'SLOW',.3);if(G.clearT<=0){saveProgress();if(G.i<MIS.length-1)load(G.i+1);else{G.done=true;msg('SUPERSLOW<small>completaste las 10 misiones · clic para volver</small>',99)}}}
    // carteles
    if(msgT>0){msgT-=dt;if(msgT<=0)$s('#ssmsg').hidden=true}
    if(X.msgDirty){drawMsg(X.msgHtml);X.msgDirty=false;X.msgPlace=true}
    X.msgMesh.visible=msgT>0;
    if(X.msgMesh.visible){const tgt=new THREE.Vector3(-Math.sin(hyaw),0,-Math.cos(hyaw)).multiplyScalar(2).add(X.headW);tgt.y=X.headW.y+.15;
      if(X.msgPlace){X.msgMesh.position.copy(tgt);X.msgPlace=false}else X.msgMesh.position.lerp(tgt,Math.min(1,dt*1.6));X.msgMesh.lookAt(X.headW)}
    drawWrist();drawLab(X.hand.right);drawLab(X.hand.left);
    if(!X.tsBar){const g=new THREE.Group(),bg=new THREE.Mesh(new THREE.PlaneGeometry(.3,.012),new THREE.MeshBasicMaterial({color:'#16181b',transparent:true,opacity:.22,depthTest:false,depthWrite:false})),fl=new THREE.Mesh(new THREE.PlaneGeometry(.3,.012),new THREE.MeshBasicMaterial({color:'#e2311e',transparent:true,opacity:.9,depthTest:false,depthWrite:false}));
      bg.renderOrder=fl.renderOrder=998;g.add(bg,fl);X.tsBar=g;X.tsFill=fl;X.tsD=G.ts}
    if(X.tsBar.parent!==scene)scene.add(X.tsBar);X.tsD+=(Math.min(1,G.ts)-X.tsD)*Math.min(1,dt*3.5);const kf=Math.max(.002,X.tsD);X.tsFill.scale.x=kf;X.tsFill.position.x=-.15*(1-kf);X.tsFill.material.opacity=.55+.4*X.tsD;
    X.tsBar.position.copy(X.headW).add(new THREE.Vector3(0,-.21,-.75).applyQuaternion(X.headQW));X.tsBar.quaternion.copy(X.headQW);
    R.setRenderTarget(null);R.render(scene,cam);
  }
  // ---------- sonido en el espacio ----------
  let amb=null;
  function ambInit(){return;try{const s=AC.createBufferSource();s.buffer=nb;s.loop=true;const f=AC.createBiquadFilter();f.type='bandpass';f.Q.value=.7;f.frequency.value=300;const g=AC.createGain();g.gain.value=0;s.connect(f);f.connect(g);const o_=mg;g.connect(o_);s.start();amb={f,g}}catch(e){amb=null}}
  const fwdV=new THREE.Vector3(),upV=new THREE.Vector3();
  function audioStep(){if(!AC||!cam)return;const L=AC.listener,p=eyeW(),q=X.on?X.headQW:cam.quaternion;fwdV.set(0,0,-1).applyQuaternion(q);upV.set(0,1,0).applyQuaternion(q);
    try{if(L.positionX){L.positionX.value=p.x;L.positionY.value=p.y;L.positionZ.value=p.z;L.forwardX.value=fwdV.x;L.forwardY.value=fwdV.y;L.forwardZ.value=fwdV.z;L.upX.value=upV.x;L.upY.value=upV.y;L.upZ.value=upV.z}else{L.setPosition(p.x,p.y,p.z);L.setOrientation(fwdV.x,fwdV.y,fwdV.z,upV.x,upV.y,upV.z)}}catch(e){}
    if(amb){const playing=!G.menu&&!G.paused&&scene,ts=Math.min(1,G.ts||0);amb.f.frequency.setTargetAtTime(220+1700*ts,AC.currentTime,.08);amb.g.gain.setTargetAtTime(playing?.03+.16*ts:0,AC.currentTime,.12)}}
  function sndOut(pos){if(!pos||!AC)return mg;try{const pn=AC.createPanner();pn.panningModel='HRTF';pn.distanceModel='inverse';pn.refDistance=2.2;pn.rolloffFactor=1;pn.maxDistance=80;
      if(pn.positionX){pn.positionX.value=pos.x;pn.positionY.value=pos.y;pn.positionZ.value=pos.z}else pn.setPosition(pos.x,pos.y,pos.z);pn.connect(mg);setTimeout(()=>{try{pn.disconnect()}catch(e){}},2500);return pn}catch(e){return mg}}
  const WORLD_S=new Set(['shot','sg','eshot','shatter','punch','slash','swing','throw','whiz','clank']);
  function vrStatus(t){const el=$s('#vrstat');if(el)el.textContent=t}
  async function detectVR(){let pol=null;try{if(document.featurePolicy&&document.featurePolicy.allowsFeature)pol=document.featurePolicy.allowsFeature('xr-spatial-tracking')}catch(e){}
    if(!navigator.xr){X.supported=false;vrStatus('Este navegador no tiene WebXR. Abrí este link en el navegador del Quest, o jugá en pantalla.')}
    else{let ok=false;try{ok=await navigator.xr.isSessionSupported('immersive-vr')}catch(e){}X.supported=ok;
      vrStatus(ok?'Visor listo. Elegí una misión y se abre en VR.':pol===false?'El visor está, pero esta página no tiene permiso de VR dentro de Claude (el marco lo bloquea). Avisale a Claude: código XR-POLICY.':'Hay WebXR pero no aparece un visor. En la compu es normal; en el Quest, avisale a Claude: código XR-NOVR.')}
    X.wantVR=X.supported;markMode()}
  function markMode(){document.querySelectorAll('#vrmode button').forEach(b=>{const v=b.dataset.v==='vr';b.classList.toggle('on',v===X.wantVR);if(v)b.disabled=!X.supported})}
  function startMission(i){G.deaths=0;
    if(X.wantVR&&X.supported){au();navigator.xr.requestSession('immersive-vr',{optionalFeatures:['local-floor','bounded-floor']}).then(async s=>{
        R.xr.setReferenceSpaceType('local-floor');await R.xr.setSession(s);X.on=true;R.autoClear=true;R.shadowMap.enabled=false;$s('#ssmenu').hidden=true;G.menu=false;load(i);
        s.addEventListener('end',()=>{X.on=false;R.autoClear=false;R.shadowMap.enabled=!touchMode;rig.position.set(0,0,0);rig.rotation.set(0,0,0);for(const k of ['right','left'])setHandGun(X.hand[k],null);showMenu();resize()})})
      .catch(err=>vrStatus('No se pudo abrir el visor: '+((err&&err.message)||err)+'. Avisale a Claude con este texto.'));return}
    $s('#ssmenu').hidden=true;G.menu=false;load(i);lock()}
  // ---------- HUD ----------
  let msgT=0;function msg(h,d){const el=$s('#ssmsg');el.innerHTML=h;el.hidden=false;msgT=d||1.5;if(h!==X.msgHtml||!X.msgMesh||!X.msgMesh.visible){X.msgHtml=h;X.msgDirty=true}}
  function saveProgress(){const st=store.get(),ss=st.ss||{u:0,best:{}};const secs=Math.round(G.elapsed*10)/10;ss.u=Math.max(ss.u||0,Math.min(MIS.length-1,G.i+1));if(!ss.best)ss.best={};if(!ss.best[G.i]||secs<ss.best[G.i])ss.best[G.i]=secs;st.ss=ss;store.set(st)}
  function progress(){const s=store.get().ss;return s||{u:0,best:{}}}
  function renderMenu(){const box=$s('#ssgrid');box.textContent='';const pr=progress();
    MIS.forEach((m,i)=>{const b=document.createElement('button');b.type='button';b.className='ssm';const lockd=i>(pr.u||0);b.disabled=lockd;
      const n=document.createElement('b');n.textContent=(i+1)+' · '+m.name;const s=document.createElement('span');s.textContent=lockd?'Bloqueada':(pr.best&&pr.best[i]?'5 salas · mejor: '+pr.best[i]+' s':m.intro);b.append(n,s);
      b.addEventListener('click',()=>{if(!lockd)startMission(i)});box.appendChild(b)})}
  // ---------- entrada ----------
  function lock(){if(touchMode)return;try{const p=cv.requestPointerLock();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
  function bind(){
    addEventListener('keydown',e=>{if(!on)return;keysS[e.code]=true;if(e.code==='Space'){P.jumpQ=true;e.preventDefault()}
      if(e.code==='KeyR'||e.code==='Enter'){if(G.over)(G.retry=true,load(G.i));else if(G.done){G.done=false;showMenu()}}
      if(e.code==='KeyG')pickNear(true);if(e.code==='KeyF')throwWeapon();if(e.code==='Escape'&&!locked)showPause(true)});
    addEventListener('keyup',e=>{keysS[e.code]=false});
    addEventListener('mousemove',e=>{if(on&&locked){mdx+=e.movementX||0;mdy+=e.movementY||0}});
    cv.addEventListener('mousedown',e=>{if(!on)return;au();if(!locked&&!touchMode&&!G.menu){lock();return}if(G.over){(G.retry=true,load(G.i));return}if(G.done){G.done=false;showMenu();return}if(e.button===0){fireHeld=true;fire()}if(e.button===2)aimHeld=true});
    addEventListener('mouseup',e=>{if(e.button===0)fireHeld=false;if(e.button===2)aimHeld=false});
    cv.addEventListener('contextmenu',e=>e.preventDefault());
    document.addEventListener('pointerlockchange',()=>{if(!on)return;locked=document.pointerLockElement===cv;if(!locked&&!G.menu&&!G.over&&!G.done&&!touchMode)showPause(true)});
    // táctil
    const tj=$s('#ssjoy'),tk=$s('#ssknob');let jid=null,lid=null,jx=0,jy=0,lx=0,ly=0;
    cv.addEventListener('touchstart',e=>{if(!on)return;au();for(const t of e.changedTouches){if(t.clientX<innerWidth*.45&&jid===null){jid=t.identifier;jx=t.clientX;jy=t.clientY;tj.style.display='block';tj.style.left=(jx-55)+'px';tj.style.top=(jy-55)+'px'}else if(lid===null){lid=t.identifier;lx=t.clientX;ly=t.clientY}}if(G.over)(G.retry=true,load(G.i));e.preventDefault()},{passive:false});
    cv.addEventListener('touchmove',e=>{for(const t of e.changedTouches){if(t.identifier===jid){let dx=t.clientX-jx,dy=t.clientY-jy;const l=Math.hypot(dx,dy);if(l>45){dx*=45/l;dy*=45/l}joyX=dx/45;joyY=dy/45;tk.style.transform='translate('+dx+'px,'+dy+'px)'}else if(t.identifier===lid){mdx+=(t.clientX-lx)*1.6;mdy+=(t.clientY-ly)*1.6;lx=t.clientX;ly=t.clientY}}e.preventDefault()},{passive:false});
    const end=e=>{for(const t of e.changedTouches){if(t.identifier===jid){jid=null;joyX=joyY=0;tj.style.display='none';tk.style.transform=''}if(t.identifier===lid)lid=null}};cv.addEventListener('touchend',end);cv.addEventListener('touchcancel',end);
    const tb=(id,f,up)=>{const el=$s(id);el.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();au();f()},{passive:false});if(up)el.addEventListener('touchend',e=>{e.preventDefault();up()},{passive:false})};
    tb('#sstFire',()=>{if(G.over){(G.retry=true,load(G.i));return}fireHeld=true;fire()},()=>{fireHeld=false});tb('#sstJump',()=>{P.jumpQ=true});tb('#sstThrow',()=>throwWeapon());tb('#sstPick',()=>pickNear(true));tb('#sstAim',()=>{aimTouch=!aimTouch;$s('#sstAim').classList.toggle('on',aimTouch)});tb('#sstCrouch',()=>{P.crTouch=!P.crTouch;$s('#sstCrouch').classList.toggle('on',P.crTouch)});tb('#sstMenu',()=>showPause(true));
    $s('#sspgo').addEventListener('click',()=>{showPause(false);lock()});
    $s('#sspmis').addEventListener('click',()=>{showPause(false);showMenu()});
    $s('#ssexit').addEventListener('click',()=>exit());$s('#sspexit').addEventListener('click',()=>exit());
    addEventListener('resize',()=>{if(on)resize()});
  }
  function showPause(v){G.paused=v;$s('#sspause').hidden=!v;if(v){fireHeld=false;if(document.pointerLockElement)document.exitPointerLock()}}
  function showMenu(){G.menu=true;G.paused=false;$s('#sspause').hidden=true;$s('#ssmsg').hidden=true;renderMenu();$s('#ssmenu').hidden=false;if(document.pointerLockElement)document.exitPointerLock()}
  function resize(){if(R.xr&&R.xr.isPresenting)return;const w=innerWidth,h=innerHeight;R.setSize(w,h,false);if(rt){const pr=R.getPixelRatio();rt.setSize(Math.round(w*pr),Math.round(h*pr))}cam.aspect=w/h;cam.updateProjectionMatrix();vmCam.aspect=w/h;vmCam.updateProjectionMatrix()}
  // ---------- ciclo ----------
  function frame(dt,xf){
    if(!R)return;audioStep();
    if(X.on&&R.xr.isPresenting){xrStep(dt,xf);return}
    if(!G.menu&&!G.paused&&scene){
      const prevAim=P.aim||0;P.aim=prevAim+(((aimHeld||aimTouch)&&P.alive?1:0)-prevAim)*Math.min(1,dt*9);const aimMove=Math.abs(P.aim-prevAim)/Math.max(dt,1e-3);
      const tsNow=G.ts||.03,sens=(typeof cfg!=='undefined'?cfg.sens:1)*(touchMode?.0045:.0016)*(1-.45*P.aim)*(P.calm?1:.4+.45*tsNow);P.yaw-=mdx*sens;P.pitch=cl(P.pitch-mdy*sens*((typeof cfg!=='undefined'&&cfg.invert)?-1:1),-1.5,1.5);const look=Math.hypot(mdx,mdy);mdx=mdy=0;
      // jugador (tiempo real)
      if(P.alive){let f=0,s=0;if(keysS.KeyW||keysS.ArrowUp)f++;if(keysS.KeyS||keysS.ArrowDown)f--;if(keysS.KeyD||keysS.ArrowRight)s++;if(keysS.KeyA||keysS.ArrowLeft)s--;f-=joyY;s+=joyX;const l=Math.hypot(f,s);if(l>1){f/=l;s/=l}
        const wantC=!!(keysS.KeyC||P.crTouch);
        if(wantC)P.crouch=true;else if(P.crouch){let room=true;for(const so of solids){if(P.pos.x>so.x0-.3&&P.pos.x<so.x1+.3&&P.pos.z>so.z0-.3&&P.pos.z<so.z1+.3&&so.y0>P.pos.y+.5&&so.y0<P.pos.y+1.8)room=false}if(room)P.crouch=false}
        P.h+=((P.crouch?1.1:1.75)-P.h)*Math.min(1,dt*12);const slow=!!(keysS.ShiftLeft||keysS.ShiftRight),vslow=!!keysS.KeyZ,calm=G.open||(!enemies.some(e=>e.alive)&&!G.spawnQ.length),sf=calm?1:.4+.6*(G.ts||.03);P.sf=sf;P.calm=calm;const spd=calm?(P.crouch?2.4:5):(P.crouch||vslow?.7:slow?1.1:1.6)*sf;
        const sy=Math.sin(P.yaw),cy=Math.cos(P.yaw),tx=(-sy*f+cy*s)*spd,tz=(-cy*f-sy*s)*spd,acc=P.onGround?12:3;P.vel.x+=(tx-P.vel.x)*Math.min(1,acc*dt);P.vel.z+=(tz-P.vel.z)*Math.min(1,acc*dt);
        if(P.jumpQ&&P.onGround){P.vel.y=7.5;P.onGround=false}P.jumpQ=false;moveBody(P,dt);
        if(P.pos.y<killY){P.alive=false;G.over=true;snd('die');msg('CAÍSTE<small>clic o R para reintentar</small>',99)}
        if(!P.w)pickNear(false)}
      // el tiempo: caminar lo mueve todo; mirar, apenas
      const hs=Math.hypot(P.vel.x,P.vel.z),lookRate=look/Math.max(dt,1e-3);let want=.01+Math.min(1,hs/(1.6*(P.sf||.8)))*.97+Math.min(.8,lookRate/1300)+Math.min(.6,aimMove*.25)+Math.min(.5,(P.leanRate||0)*.25)+(P.onGround?0:.35);if(G.pulse>0){G.pulse-=dt;want=Math.max(want,.55)}
      if(!P.alive)want=.006;if(G.clearT>0)want=.3;{const tw=Math.min(1,want);G.ts+=(tw-G.ts)*Math.min(1,dt*(tw>G.ts?4.5:10))}const gdt=dt*G.ts;G.gameT+=gdt;
      if(P.alive&&G.clearT<=0)G.elapsed+=dt;
      P.cd-=gdt;P.punch=Math.max(0,P.punch-dt);if(fireHeld&&P.w&&SW[P.w].auto)fire();
      if(G.open&&G.sec<4&&P.alive&&inSec(secs[G.sec+1],P.pos.x,P.pos.z,-.6)){G.open=false;activate(G.sec+1)}
      for(const m_ of G.sinking){m_.position.y-=dt*5;if(m_.position.y<-4){scene.remove(m_);m_.userData.gone=true}}G.sinking=G.sinking.filter(m_=>!m_.userData.gone);
      if(sunL){sunL.position.set(P.pos.x-20,P.pos.y+40,P.pos.z+15);sunL.target.position.copy(P.pos)}
      for(let k=G.spawnQ.length-1;k>=0;k--){const q=G.spawnQ[k];if(G.gameT>=q.t){spawnEnemy(q.x,q.z,q.w,q.y);G.spawnQ.splice(k,1)}}
      for(const e of enemies)if(e.alive)enemyAI(e,gdt);
      updShots(gdt);updFx(gdt);updFlash(gdt);
      itemsStep(gdt);
      if(G.clearT>0){G.clearT-=dt;const k=Math.floor(G.clearT*2.5)%2;msg(k?'SUPER':'SLOW',.3);if(G.clearT<=0){{saveProgress();if(G.i<MIS.length-1)load(G.i+1);else{G.done=true;msg('SUPERSLOW<small>completaste las 10 misiones · clic para volver</small>',99)}}}}
      P.kick=Math.max(0,P.kick-gdt/(((P.w&&SW[P.w].cd)||.3)*.9));
      {const lw=P.alive?((keysS.KeyE?1:0)-(keysS.KeyQ?1:0)):0,prev=P.lean||0;P.lean=prev+(lw-prev)*Math.min(1,dt*9);let L=P.lean*.55;const rx=Math.cos(P.yaw),rz=-Math.sin(P.yaw),hy=P.pos.y+P.h-.12;
        // no atravesar paredes al asomarse
        for(let k=0;k<6&&Math.abs(L)>.02;k++){if(insideSolid(new THREE.Vector3(P.pos.x+rx*L*1.25,hy,P.pos.z+rz*L*1.25)))L*=.6;else break}
        P.leanOff=L;P.leanRate=Math.abs(P.lean-prev)/Math.max(dt,1e-3);
        cam.position.set(P.pos.x+rx*L,hy-Math.abs(L)*.12,P.pos.z+rz*L);cam.rotation.set(P.pitch,P.yaw,-P.lean*.22)}cam.fov=100-45*P.aim;cam.updateProjectionMatrix();
      $s('#ssinfot').textContent='SUPERSLOW · MISIÓN '+(G.i+1)+' DE '+MIS.length+' · SALA '+((G.sec||0)+1)+'/5';$s('#ssinfos').textContent=MIS[G.i].name+' · rojos: '+(enemies.filter(e=>e.alive).length+G.spawnQ.length)+' · '+G.elapsed.toFixed(1)+' s';
      $s('#ssam').textContent=P.w&&SW[P.w].melee?'1':P.w?P.ammo:'—';$s('#ssaw').textContent=P.w&&SW[P.w].melee?SW[P.w].name.toUpperCase()+' · CLIC CORTA · F LO TIRA':P.w?SW[P.w].name.toUpperCase()+(P.ammo<=0?' · VACÍA · F PARA TIRARLA':''):'MANOS · G AGARRA';
      $s('#ssts b').style.width=(G.ts*100)+'%';
      {const key=P.alive?(P.w&&!SW[P.w].melee?P.w+':'+P.ammo:''):'';if(key!==G.pipKey){G.pipKey=key;const el=$s('#sspips');el.textContent='';if(key){if(P.ammo<=0)el.textContent='VACÍA · F';else for(let q=0;q<Math.min(P.ammo,12);q++)el.appendChild(document.createElement('i'))}}}
      // arma cerca
      let near=null;for(const it of items)if(Math.hypot(it.x-P.pos.x,it.z-P.pos.z)<1.4){near=it;break}$s('#sshint').hidden=!(near||G.open)||!P.alive;if(!near&&G.open)$s('#sshint').textContent='Puerta abierta: avanzá a la sala '+(G.sec+2);if(near)$s('#sshint').textContent=(P.w?'G: cambiar por ':'Agarrá: ')+SW[near.w].name.toLowerCase()+(near.ammo<=0&&!SW[near.w].melee?' (vacía)':'');
    }
    if(msgT>0){msgT-=dt;if(msgT<=0)$s('#ssmsg').hidden=true}
    if(scene){R.setRenderTarget(rt);R.clear();R.render(scene,cam);if(vm&&P.alive&&!G.menu){R.clearDepth();
      if(vm.userData.fists){const p=P.punch>0?Math.sin((1-P.punch/.25)*Math.PI):0;vm.children.forEach(f=>{f.position.z=-.38-(f.userData.fist>0?p*.3:0);f.position.y=-.2+(f.userData.fist>0?p*.05:0)})}
      else if(vm.userData.melee){const w=vm.userData.melee,sw=P.sw||.25,q=P.punch>0?1-P.punch/sw:0,p=P.punch>0?Math.sin(q*Math.PI):0;
        if(w==='knife'){vm.position.set(.24-p*.12,-.22+p*.04,-.42-p*.28);vm.rotation.set(-p*.6,p*.5,0)}
        else if(w==='axe'){const r=P.punch>0?(q<.3?.7*q/.3:.7-2.1*(q-.3)/.7):0;vm.position.set(.26-p*.1,-.26+p*.08,-.42-p*.22);vm.rotation.set(r,p*.25,0)}
        else{const r=P.punch>0?q:0;vm.position.set(.3-.45*p,-.26+.06*p,-.46-.12*p);vm.rotation.set(P.punch>0?-.45:0,P.punch>0?-1.1+2.3*r:.22,P.punch>0?-.5:-.4)}}
      else{const a=P.aim||0,kk=P.kick*P.kick*((P.w&&SW[P.w].kick)||1);vm.position.set(.24*(1-a),-.22+.06*a+kk*.035,-.42+.05*a+kk*.025);vm.rotation.set(kk*.18,0,0)}
      R.render(vmScene,vmCam)}
      R.setRenderTarget(null);R.clear();const u=post.material.uniforms;u.asp.value=cam.aspect;u.tanH.value=Math.tan(cam.fov*Math.PI/360);u.amt.value=.62*(1-.7*(P.aim||0));R.render(postScene,postCam)}
  }
  // ---------- entrar / salir ----------
  function initPost(){rt=new THREE.WebGLRenderTarget(4,4,{minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter});postScene=new THREE.Scene();postCam=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
    post=new THREE.Mesh(new THREE.PlaneGeometry(2,2),new THREE.ShaderMaterial({uniforms:{t:{value:rt.texture},asp:{value:1},tanH:{value:1},amt:{value:.6}},depthTest:false,depthWrite:false,
      vertexShader:'varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.,1.);}',
      fragmentShader:'uniform sampler2D t;uniform float asp,tanH,amt;varying vec2 vUv;void main(){vec2 p=vUv*2.-1.;p.x*=asp;float r=length(p);vec2 q=p;float rd=sqrt(asp*asp+1.);if(r>1e-4){float tm=atan(rd*tanH);float th=r*tm/rd;q=p/r*(tan(th)/tanH);}q=mix(p,q,amt);q.x/=asp;vec3 c=texture2D(t,q*.5+.5).rgb;c*=1.-.22*smoothstep(.55,1.,r/rd);gl_FragColor=vec4(c,1.);}'}));
    postScene.add(post)}
  function init(){cv=$s('#ssc');R=new THREE.WebGLRenderer({canvas:cv,antialias:true,powerPreference:'high-performance'});R.setPixelRatio(Math.min(window.devicePixelRatio||1,touchMode?1.25:1.75));R.autoClear=false;R.shadowMap.enabled=!touchMode;R.shadowMap.type=THREE.PCFSoftShadowMap;
    cam=new THREE.PerspectiveCamera(100,1,.05,300);initPost();cam.rotation.order='YXZ';vmScene=new THREE.Scene();vmScene.add(new THREE.HemisphereLight('#ffffff','#555566',1));const l=new THREE.DirectionalLight('#ffffff',.7);l.position.set(-.5,1,.6);vmScene.add(l);vmCam=new THREE.PerspectiveCamera(60,1,.01,10);bind();xrInit();let last=0;R.setAnimationLoop((t,xf)=>{const dt=last?Math.min(.05,Math.max(0,(t-last)/1000)):.016;last=t;if(X.on)frame(dt,xf)});detectVR();
    document.querySelectorAll('#vrmode button').forEach(b=>b.addEventListener('click',()=>{if(b.disabled)return;X.wantVR=b.dataset.v==='vr';markMode()}))}
  function enter(){if(!R)init();on=true;window.SSON=true;au();document.body.classList.add('ssmode');$s('#sswrap').hidden=false;resize();showMenu()}
  function exit(){on=false;window.SSON=false;G.menu=true;G.paused=false;clear();scene=null;document.body.classList.remove('ssmode');$s('#sswrap').hidden=true;if(document.pointerLockElement)document.exitPointerLock();if(typeof ssExitHook==='function')ssExitHook()}
  return{enter,exit,frame,X,startMission,get R(){return R},get on(){return on},_dbg:{P,G,killAll(){enemies.forEach(e=>killEnemy(e))},get enemies(){return enemies},get items(){return items},load,fire,throwWeapon,keys:keysS,MIS}};
})();

