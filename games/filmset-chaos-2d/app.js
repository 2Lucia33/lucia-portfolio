(() => {
  'use strict';
  const E=window.FilmsetEngine,$=s=>document.querySelector(s);
  const canvas=$('#world'),ctx=canvas.getContext('2d'),dialog=$('#dialog'),content=$('#dialog-content');
  let state=E.createState(),path=[],pending=null,keys=new Set(),nearest=null,last=0,clock=0,shootTime=0,returnFocus=null,dialogKind='intro',floating=[];
  const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const completed=id=>state.history.some(h=>h.id===id);
  function toast(text){$('#feedback').textContent=text;}
  function clearMovement(){keys.clear();path=[];pending=null;}
  function show(html,kind){clearMovement();dialogKind=kind;returnFocus=document.activeElement;content.innerHTML=html;if(!dialog.open)dialog.showModal();content.querySelector('button')?.focus();}
  function close(){dialog.close();clearMovement();if(returnFocus?.isConnected&&returnFocus!==document.body&&!returnFocus.disabled)returnFocus.focus();else canvas.focus({preventScroll:true});}
  function top(label,closable=true){return `<div class="dialog-top"><p class="eyebrow">${label}</p>${closable?'<button class="close" type="button" aria-label="返回片场">×</button>':''}</div>`;}
  function bindClose(){content.querySelector('.close')?.addEventListener('click',close);}
  function deltaHTML(delta){return `<div class="deltas">${Object.entries(delta).map(([k,v])=>`<span class="delta ${v>0?'plus':v<0?'minus':''}">${E.names[k]} ${v>0?'+':''}${v}</span>`).join('')}</div>`;}
  function intro(){
    show(`${top('DIRECTOR’S FIRST DAY',false)}<div class="intro-board"><span>SCENE 01 / TAKE 01</span><strong>《最后一次告别》· 重逢</strong></div><h2 class="dialog-title" id="dialog-title">欢迎来到你的片场。</h2><p class="dialog-copy">演员进不了状态，窗外下起了雨，摄影机快没电了。作为导演，你要把这些意外，变成一场值得留下的重逢。</p><div class="intro-steps"><span>01 走进片场</span><span>02 处理五件待办</span><span>03 开拍与结算</span></div><p class="dialog-copy">方向键 / WASD 移动，靠近后按 E 互动。手机点地面走动、点人物互动。也可直接使用「片场待办」。走动不扣时间。</p><div class="dialog-actions"><button class="primary" id="start">戴上导演帽，进场 →</button></div>`,'intro');
    $('#start').addEventListener('click',()=>{state.phase='explore';close();update();toast('你是戴红色帽子的导演。先找头顶「！」的人聊聊吧。');});
  }
  function openEvent(id){
    if(state.phase!=='explore'||state.paused||dialog.open)return;
    if(completed(id)){toast('这项准备已经完成。看看其他人的情况吧。');return;}
    const event=E.events.find(e=>e.id===id);
    show(`${top(event.person+' / '+event.role)}<h2 class="dialog-title" id="dialog-title">${event.title}</h2><p class="dialog-copy">${event.copy}</p><div class="choices">${event.choices.map((c,i)=>`<button class="choice" data-choice="${i}"><strong>${String.fromCharCode(65+i)} / ${c.label}</strong><small>${c.note}</small>${deltaHTML(Object.fromEntries(Object.keys(E.names).map((k,j)=>[k,c.delta[j]])))}</button>`).join('')}</div><p class="result-note">数值限制在 0–100；反馈显示实际变化。</p>`,'event');
    bindClose();content.querySelectorAll('[data-choice]').forEach(b=>b.addEventListener('click',()=>select(id,Number(b.dataset.choice))));
  }
  function select(id,index){
    const outcome=E.choose(state,id,index);if(!outcome)return;
    const event=E.events.find(e=>e.id===id);floating.push({x:event.x,y:event.y-70,text:'准备完成 ✓',age:0});update();
    content.innerHTML=`${top('场记 / 决定已记录',false)}<h2 class="dialog-title" id="dialog-title">${outcome.choice.label}</h2><p class="dialog-copy">${outcome.choice.feedback}</p>${deltaHTML(outcome.delta)}<p class="dialog-copy">${state.history.length===5?'所有部门准备就绪。回到片场，点击「开始拍摄」。':'片场画面也改变了。继续和其他人聊聊吧。'}</p><div class="dialog-actions"><button class="primary" id="continue">回到片场 →</button></div>`;dialogKind='feedback';$('#continue').focus();$('#continue').addEventListener('click',()=>{close();toast(outcome.choice.feedback);});
  }
  function update(){
    for(const k of Object.keys(E.names)){$('#stat-'+k).textContent=state.stats[k];$('#bar-'+k).value=state.stats[k];}
    $('#task-count').textContent=`${state.history.length} / 5`;
    $('#tasks').innerHTML=E.events.map(e=>`<button class="task ${completed(e.id)?'done':''}" data-task="${e.id}" ${completed(e.id)||state.phase!=='explore'||state.paused?'disabled':''}><span class="badge">${completed(e.id)?'✓':'!'}</span><span><span class="task-name">${e.person}</span><small>${completed(e.id)?'准备完成':e.role}</small></span><span class="task-arrow">↗</span></button>`).join('');
    document.querySelectorAll('[data-task]').forEach(b=>b.addEventListener('click',()=>openEvent(b.dataset.task)));
    $('#shoot').disabled=state.history.length<5||state.phase!=='explore'||state.paused;$('#shoot').textContent=state.phase==='shooting'?'正在拍摄…':state.phase==='result'?'本场拍摄完成':state.history.length===5?'各部门就位，开始拍摄 →':`处理 ${5-state.history.length} 件待办后开拍`;
    $('#pause').disabled=!['explore','shooting'].includes(state.phase);$('#pause').textContent=state.paused?'继续':'暂停';$('#pause-cover').hidden=!state.paused;refreshNearby();
  }
  function refreshNearby(){
    nearest=E.events.filter(e=>!completed(e.id)||e.id==='camera'&&state.history.length===5).map(e=>({event:e,d:Math.hypot(e.x-state.player.x,e.y-state.player.y)})).filter(v=>v.d<105).sort((a,b)=>a.d-b.d)[0]?.event||null;
    const enabled=nearest&&state.phase==='explore'&&!state.paused&&!dialog.open;
    $('#interact').disabled=!enabled;$('#interact').innerHTML=enabled?`${completed(nearest.id)?'开始拍摄':'与'+nearest.person.split(' · ')[0]+'互动'} <kbd>E</kbd>`:'靠近人物互动 <kbd>E</kbd>';
  }
  function interact(){if(!nearest||state.phase!=='explore'||state.paused||dialog.open)return;if(completed(nearest.id)&&state.history.length===5)shoot();else openEvent(nearest.id);}
  function togglePause(){if(!['explore','shooting'].includes(state.phase)||dialog.open)return;state.paused=!state.paused;clearMovement();update();if(!state.paused)canvas.focus({preventScroll:true});}
  function shoot(){
    if(state.history.length!==5||state.phase!=='explore'||state.paused||dialog.open)return;
    state.phase='shooting';shootTime=0;clearMovement();$('#scene-caption').hidden=false;update();toast('安静，准备，Action！看你的五个决定如何进入镜头。');canvas.focus({preventScroll:true});
  }
  function result(){
    state.phase='result';$('#scene-caption').hidden=true;const report=E.report(state);update();
    show(`${top('CUT! / 第一场拍摄完成',false)}<h2 class="dialog-title" id="dialog-title">这一场重逢，由你完成。</h2><div class="result-score">${report.score}<small> / 100</small></div><p class="dialog-copy">${report.score>=75?'情绪与画面都找到了落点。':report.score>=60?'重逢成立了，也留下了一点遗憾。':'这场戏还有打磨空间，再试一种选择吧。'}</p><dl class="report"><dt>${report.style}</dt><dd>由本场最常采用的决策方向决定；平票依次优先表演、视觉、叙事、执行。</dd><dt>成片质量 ${state.stats.quality} · 演员状态 ${state.stats.acting} · 资源控制 ${report.resource}</dt><dd>本场评分 = 质量 × 55% + 表演 × 25% + 资源控制 × 20%。资源控制为剩余时间与预算的平均值。</dd></dl><h3>你的五个决定</h3><ol class="history">${state.history.map(h=>`<li>${h.title}：${h.label}</li>`).join('')}</ol><p class="result-note">这是单场原型评分，与文字版三场完整评分不同。当前五个事件固定，重玩可比较不同选择。</p><div class="dialog-actions"><button class="primary" id="restart">再导一次 →</button><button id="review">回看片场</button></div>`,'result');
    $('#restart').addEventListener('click',restart);$('#review').addEventListener('click',()=>{close();$('#shoot').textContent='再次查看成片报告';$('#shoot').disabled=false;toast('拍摄完成。可以欣赏片场，或点击按钮再次查看报告。');});
  }
  function restart(){close();state=E.createState();state.phase='explore';floating=[];shootTime=0;update();toast('新的一条开始了。试试不同的决定，看看片场会如何变化。');}
  $('#shoot').addEventListener('click',()=>state.phase==='result'?result():shoot());$('#interact').addEventListener('click',interact);$('#pause').addEventListener('click',togglePause);$('#resume').addEventListener('click',togglePause);
  dialog.addEventListener('cancel',e=>{if(['intro','result'].includes(dialogKind))e.preventDefault();else clearMovement();});
  dialog.addEventListener('close',()=>{clearMovement();refreshNearby();});
  canvas.addEventListener('keydown',e=>{
    const key=e.key.toLowerCase();if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d','e',' '].includes(key))e.preventDefault();
    if(dialog.open||state.paused||state.phase!=='explore')return;
    if(key==='e'||key===' '){if(!e.repeat)interact();return;}
    if(['arrowup','arrowdown','arrowleft','arrowright','w','a','s','d'].includes(key)){keys.add(key);path=[];pending=null;}
  });
  window.addEventListener('keyup',e=>keys.delete(e.key.toLowerCase()));canvas.addEventListener('blur',()=>keys.clear());window.addEventListener('blur',()=>keys.clear());
  document.addEventListener('visibilitychange',()=>{clearMovement();if(document.hidden&&['explore','shooting'].includes(state.phase)&&!dialog.open&&!state.paused){state.paused=true;update();}});
  let pointerStart=null;
  canvas.addEventListener('pointerdown',e=>{pointerStart={x:e.clientX,y:e.clientY};});
  canvas.addEventListener('pointercancel',()=>pointerStart=null);
  canvas.addEventListener('pointerup',e=>{
    if(!pointerStart)return;const distance=Math.hypot(e.clientX-pointerStart.x,e.clientY-pointerStart.y);pointerStart=null;
    if(distance>12||state.phase!=='explore'||state.paused||dialog.open)return;
    canvas.focus({preventScroll:true});keys.clear();const rect=canvas.getBoundingClientRect(),p={x:(e.clientX-rect.left)*960/rect.width,y:(e.clientY-rect.top)*640/rect.height};
    const hit=E.events.filter(event=>Math.abs(p.x-event.x)<(event.id==='camera'?75:50)&&p.y>=event.y-135&&p.y<=event.y+42).sort((a,b)=>Math.abs(p.x-a.x)-Math.abs(p.x-b.x))[0];
    if(hit){pending=hit;path=E.route(state.player,pending.stand);toast(`走向${pending.person}…`);}else{pending=null;path=E.route(state.player,p);}
  });
  function tick(dt){
    if(state.paused||dialog.open)return;
    floating.forEach(f=>f.age+=dt);floating=floating.filter(f=>f.age<2);
    if(state.phase==='shooting'){
      shootTime+=dt;const rain=state.effects.light==='rain',silent=state.effects.actor==='silent';
      const captions=['场记：第一场，第一条。Action！',rain?'雨声落在窗沿，两个人迟迟没有开口。':'一束暖光落下，信终于递到了她手里。',silent?'他们没有道歉，只是静静看着对方。':state.effects.producer==='natural'?'一杯水递过去，他终于说出那句迟来的道歉。':'“对不起，我来晚了。”',state.effects.actress==='back'?'镜头退远，留下两个靠近的背影。':'她抬起眼睛。重逢，终于有了答案。'];
      $('#scene-caption').textContent=captions[Math.min(3,Math.floor(shootTime/1.8))];if(shootTime>=7.2)result();return;
    }
    if(state.phase!=='explore')return;
    let dx=(keys.has('d')||keys.has('arrowright')?1:0)-(keys.has('a')||keys.has('arrowleft')?1:0),dy=(keys.has('s')||keys.has('arrowdown')?1:0)-(keys.has('w')||keys.has('arrowup')?1:0);
    const speed=190*dt;
    if(dx||dy){const length=Math.hypot(dx,dy);dx=dx/length*speed;dy=dy/length*speed;if(E.walkable(state.player.x+dx,state.player.y))state.player.x+=dx;if(E.walkable(state.player.x,state.player.y+dy))state.player.y+=dy;}
    else if(path.length){const target=path[0],dist=Math.hypot(target.x-state.player.x,target.y-state.player.y);if(dist<=speed){state.player.x=target.x;state.player.y=target.y;path.shift();}else{state.player.x+=(target.x-state.player.x)/dist*speed;state.player.y+=(target.y-state.player.y)/dist*speed;}}
    if(!path.length&&pending){const target=pending;pending=null;if(completed(target.id)){if(target.id==='camera'&&state.history.length===5)shoot();else toast('这项准备已经完成。');}else openEvent(target.id);}
    refreshNearby();
  }
  // Paper-cut scenery is drawn locally: no image downloads, fonts, or runtime dependencies.
  function rect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(x,y,w,h);}
  function line(x1,y1,x2,y2,color,width=2){ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();}
  function ellipse(x,y,rx,ry,color){ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill();}
  function text(t,x,y,size=15,color='#3d5147',align='center'){ctx.fillStyle=color;ctx.font=`${size}px "PingFang SC",sans-serif`;ctx.textAlign=align;ctx.fillText(t,x,y);}
  function person(x,y,color,label,director=false,mood='neutral',moving=false){
    const bob=moving&&!reduced?Math.sin(clock*12)*2:0;y+=bob;
    ellipse(x+2,y+7,22,8,'#283d3622');
    line(x-7,y-13,x-10,y+2,'#3c4940',7);line(x+7,y-13,x+10,y+2,'#3c4940',7);
    ctx.fillStyle='#fff9e7';ctx.beginPath();ctx.moveTo(x-19,y-17);ctx.lineTo(x-14,y-51);ctx.lineTo(x+13,y-51);ctx.lineTo(x+19,y-17);ctx.closePath();ctx.fill();
    ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x-16,y-19);ctx.lineTo(x-12,y-48);ctx.lineTo(x+11,y-48);ctx.lineTo(x+16,y-19);ctx.closePath();ctx.fill();
    line(x-13,y-42,x-23,y-23,color,6);line(x+13,y-42,x+23,y-23,color,6);
    ellipse(x,y-61,17,19,'#fff9e7');ellipse(x,y-61,14,16,'#dfb98d');
    ctx.fillStyle='#45433c';ctx.beginPath();ctx.arc(x,y-65,14,Math.PI,Math.PI*2);ctx.fill();
    if(director){rect(x-17,y-81,34,10,'#ad4d36');rect(x-14,y-88,26,13,'#ad4d36');rect(x+8,y-44,16,20,'#e8d7a7');line(x+10,y-39,x+22,y-39,'#777358',2);}
    if(mood!=='back'){ellipse(x-5,y-61,1.5,2,'#484539');ellipse(x+5,y-61,1.5,2,'#484539');line(x-3,y-54,x+3,y-54,'#865f46',1.5);if(['smile','rehearsed','improv'].includes(mood)){ctx.strokeStyle='#865f46';ctx.beginPath();ctx.arc(x,y-56,5,0,Math.PI);ctx.stroke();}if(mood==='tears')ellipse(x+9,y-54,2,4,'#78b4c2');}
    if(label){rect(x-49,y+17,98,23,'#faf5e5e8');text(label,x,y+33,13);}
  }
  function marker(e){
    const done=completed(e.id),float=reduced?0:Math.sin(clock*2.5+e.x)*3;
    ellipse(e.x,e.y-112+float,16,17,done?'#647d5c':'#b45a3d');text(done?'✓':'!',e.x,e.y-106+float,19,'#fff8df');
    if(nearest?.id===e.id&&state.phase==='explore'){ctx.strokeStyle='#a55737';ctx.lineWidth=2;ctx.setLineDash([5,5]);ctx.beginPath();ctx.ellipse(e.x,e.y+7,36,14,0,0,Math.PI*2);ctx.stroke();ctx.setLineDash([]);}
  }
  function draw(){
    if(!ctx)return;
    const scale=Math.min(devicePixelRatio||1,2);if(canvas.width!==960*scale){canvas.width=960*scale;canvas.height=640*scale;}ctx.setTransform(scale,0,0,scale,0,0);
    rect(0,0,960,640,'#e8e0c7');rect(20,20,920,600,'#d4ceb6');rect(35,35,890,565,'#ebe5ce');
    rect(35,35,890,140,'#bcc7b4');rect(35,168,890,12,'#6c7e67');
    for(let y=205;y<600;y+=48){line(36,y,924,y,'#c5bea15c',1);for(let x=(y%96?55:140);x<925;x+=160)line(x,y,x,y+48,'#c5bea14d',1);}
    // Paper grain: deterministic small strokes, not external textures.
    for(let i=0;i<120;i++){const x=(i*137)%890+35,y=(i*83)%565+35;line(x,y,x+3,y+1,'#8e916315',1);}
    const rain=!state.effects.light||state.effects.light==='rain';
    [125,590].forEach(x=>{rect(x-8,42,248,118,'#f3efda');rect(x,50,232,102,rain?'#829b9e':'#dcc687');rect(x,120,232,32,rain?'#617b7a':'#a6af7b');
      if(rain){ctx.save();ctx.beginPath();ctx.rect(x,50,232,102);ctx.clip();for(let i=0;i<22;i++){const offset=reduced?0:clock*70;const yy=50+(i*29+offset)%110;line(x+(i*37)%232,yy,x+(i*37)%232-5,yy+12,'#cbdce08c',2);}ctx.restore();}else ellipse(x+173,77,22,22,'#f4dda2');
      line(x+116,50,x+116,152,'#eee9d2',6);line(x,101,x+232,101,'#eee9d2',5);
    });
    rect(399,72,130,54,'#ede8d4');text('旧车站',464,105,24);text('最后一次告别 / 重逢',480,203,13,'#76816a');
    rect(38,40,45,127,'#a36f57');rect(876,40,46,127,'#a36f57');for(let x of [45,60,79,884,900,916])line(x,40,x-3,167,'#83574055',3);
    const warm=state.effects.light==='sun'||state.effects.light==='studio';ctx.fillStyle=warm?'#f7cf6c35':'#c4d9da28';ctx.beginPath();ctx.moveTo(800,210);ctx.lineTo(390,480);ctx.lineTo(315,210);ctx.closePath();ctx.fill();
    // Bench and floor marks.
    rect(396,321,160,38,'#a68459');rect(390,312,172,18,'#bca074');rect(402,345,11,23,'#655d45');rect(539,345,11,23,'#655d45');line(400,334,551,334,'#8c704d',2);
    for(const x of [369,600]){line(x-13,258,x+13,258,'#b05a4177',4);line(x,248,x,268,'#b05a4177',4);}
    // Gear cases and prop table.
    rect(90,495,135,63,'#50675b');rect(100,501,115,8,'#708477');rect(147,491,28,8,'#31483f');text('PROPS',158,535,16,'#e8e1c4');
    rect(804,371,86,56,'#ba9c6f');rect(810,426,8,26,'#7c7053');rect(878,426,8,26,'#7c7053');rect(819,380,28,19,'#e8dcb8');line(821,384,842,393,'#baac88',2);
    // Lighting tripod and control case.
    line(790,183,790,229,'#495e51',5);line(790,214,765,235,'#495e51',3);line(790,214,815,235,'#495e51',3);ellipse(790,169,25,23,'#40564e');ellipse(790,169,18,17,warm?'#efd17c':'#bdccba');text('灯光台',790,265,13);
    // Camera tripod and operator.
    line(695,414,668,456,'#344b40',4);line(695,414,720,456,'#344b40',4);line(695,414,695,459,'#344b40',4);rect(670,390,48,30,'#334f46');rect(716,397,18,15,'#243d34');ellipse(681,384,11,11,'#5a7563');ellipse(706,384,11,11,'#5a7563');rect(674,398,8,4,state.effects.camera?'#c4d58c':'#bd6045');
    if(state.effects.camera==='dolly'){line(647,471,752,471,'#77836b',3);line(647,480,752,480,'#77836b',3);}
    const shooting=state.phase==='shooting',approach=shooting?Math.min(1,shootTime/4):0;
    const actors=[{e:E.events[0],x:370+approach*63},{e:E.events[1],x:600-approach*60}];
    actors.forEach(({e,x})=>person(x,e.y,e.color,shooting?'':e.person.split(' · ')[0],false,state.effects[e.id]||'neutral',shooting&&shootTime<4));
    person(172,414,'#8b8770','制片人');person(749,456,'#577365','摄影师');
    if(['natural','advert'].includes(state.effects.producer)){const cx=state.effects.producer==='advert'?475:state.phase==='shooting'?532:555;rect(cx,278,13,20,'#f8f1dc');rect(cx,283,13,8,'#ae5b42');}
    if(state.effects.actor==='rehearsed'){rect(621,228,17,22,'#fff6d8');line(624,235,635,235,'#8c9279',1);}
    if(state.phase!=='shooting')E.events.forEach(marker);
    if(path.length&&state.phase==='explore'&&!reduced){ctx.setLineDash([2,8]);ctx.strokeStyle='#ac6a4680';ctx.lineWidth=3;ctx.beginPath();ctx.moveTo(state.player.x,state.player.y);path.forEach(p=>ctx.lineTo(p.x,p.y));ctx.stroke();ctx.setLineDash([]);const end=path[path.length-1];ellipse(end.x,end.y,7,4,'#ac6a4680');}
    person(state.player.x,state.player.y,'#b29150','你 · 导演',true,'neutral',!!path.length||!!keys.size);
    // Taped scene notes.
    ctx.save();ctx.translate(62,577);ctx.rotate(-.03);rect(0,0,185,30,'#f9f4df');rect(55,-5,60,12,'#d2b98277');text('SET A · 导演工作区',92,21,12);ctx.restore();
    text('出口 / 休息区',817,582,13,'#7b856b');
    floating.forEach(f=>{ctx.globalAlpha=Math.max(0,1-f.age/2);text(f.text,f.x,f.y-(reduced?0:f.age*22),17,'#435f42');ctx.globalAlpha=1;});
    if(shooting){rect(35,35,890,18,'#273d35');rect(35,582,890,18,'#273d35');text('● REC',860,76,17,'#b74735');ctx.strokeStyle='#f7f0d6';ctx.lineWidth=2;ctx.strokeRect(285,185,400,125);}
  }
  function frame(time){const dt=Math.min((time-last)/1000||0,.04);last=time;if(!document.hidden){if(!state.paused)clock+=dt;tick(dt);draw();}requestAnimationFrame(frame);}
  update();intro();requestAnimationFrame(frame);
})();
