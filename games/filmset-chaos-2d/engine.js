/* Standalone game rules and navigation, shared by the UI and smoke tests. */
(() => {
  const names = {time:'时间', budget:'预算', acting:'演员状态', quality:'成片质量'};
  const styles = {actor:'演员型导演', visual:'视觉型导演', story:'叙事型导演', producer:'执行型导演'};
  const events = [
    {id:'actress',person:'女主 · 林夏',role:'表演沟通',x:370,y:242,stand:{x:350,y:300},color:'#bd775d',title:'第一条的眼泪',copy:'女主迟迟进不了状态。摄影和灯光都已就位，剧组在等你的决定。',choices:[
      {label:'再拍一条',note:'给演员多一次找回情绪的机会。',delta:[-14,-9,12,5],style:'actor',feedback:'她终于找到情绪，现场响起轻轻的掌声。',effect:'tears'},
      {label:'让演员自由发挥',note:'让停顿和眼神，代替预设的哭点。',delta:[-5,-3,8,4],style:'actor',feedback:'她改了停顿方式，重逢有了真实的呼吸。',effect:'smile'},
      {label:'改用远景与背影',note:'用画面承担情绪，保留一点距离。',delta:[-4,-2,-3,7],style:'visual',feedback:'镜头保留了克制感，但表情被隐藏了一部分。',effect:'back'}]},
    {id:'actor',person:'男主 · 陈默',role:'台词排练',x:600,y:242,stand:{x:620,y:300},color:'#6b8791',title:'男主忘了台词',copy:'一句重要的道歉词反复卡住。演员攥着信，迟迟没能开口。',choices:[
      {label:'带他逐句排练',note:'花时间理清台词背后的动机。',delta:[-12,-4,10,3],style:'actor',feedback:'排练后，道歉说得更自然了。',effect:'rehearsed'},
      {label:'允许即兴道歉',note:'保留人物关系，给语言一点自由。',delta:[-5,-2,4,5],style:'actor',feedback:'台词变了，人物关系却更可信。',effect:'improv'},
      {label:'删去道歉台词',note:'用沉默和剪辑处理这次见面。',delta:[-3,-2,-4,4],style:'visual',feedback:'画面更简洁，人物的动机稍显含糊。',effect:'silent'}]},
    {id:'light',person:'灯光台',role:'场景布光',x:790,y:226,stand:{x:750,y:290},color:'#c5a14e',title:'窗外突然下雨',copy:'本来需要温暖夕阳的镜头，如今变成灰蓝色雨景。你要保住原方案，还是接受意外？',choices:[
      {label:'等雨停',note:'维持原定视觉方案。',delta:[-16,-7,1,8],style:'visual',feedback:'夕阳终于出现，暖光重新照进旧车站。',effect:'sun'},
      {label:'把雨写进情节',note:'现场改写，让天气成为角色。',delta:[-7,-3,3,7],style:'story',feedback:'雨水让重逢多了一层迟疑。',effect:'rain'},
      {label:'在棚内补拍',note:'启用棚灯，换取可控的画面。',delta:[-5,-13,0,5],style:'visual',feedback:'灯光恢复稳定，少了一点自然的质感。',effect:'studio'}]},
    {id:'producer',person:'制片人 · 周姐',role:'预算协调',x:172,y:414,stand:{x:238,y:422},color:'#8b8770',title:'制片人要露出品牌',copy:'品牌水杯必须在本场出现，否则赞助款会缩水。眼前这段脆弱的重逢，容得下一个水杯吗？',choices:[
      {label:'设计自然的递水动作',note:'兼顾商业与人物，多做一次调度。',delta:[-8,5,2,2],style:'producer',feedback:'水杯进入人物互动，没有打断情绪。',effect:'natural'},
      {label:'拍一个清晰特写',note:'获得赞助，但会打断叙事节奏。',delta:[-2,9,-3,-6],style:'producer',feedback:'品牌方满意，看片时却有人出戏。',effect:'advert'},
      {label:'拒绝植入',note:'保护叙事，放弃一部分资金。',delta:[-2,-11,2,5],style:'story',feedback:'这场戏保持完整，制片人记下了资金缺口。',effect:'none'}]},
    {id:'camera',person:'摄影师 · 阿远',role:'摄影准备',x:705,y:444,stand:{x:640,y:455},color:'#577365',title:'摄影机电池告急',copy:'离计划中的最后一个推进镜头只差一条。你想把剩下的电量留给什么？',choices:[
      {label:'借备用电池',note:'花钱保住情绪推进的镜头。',delta:[-7,-8,0,7],style:'visual',feedback:'备用电池就位，推进镜头可以开拍了。',effect:'dolly'},
      {label:'改拍固定机位',note:'节省资源，让画面更克制。',delta:[-3,-1,0,2],style:'visual',feedback:'摄影机固定下来，安静等待人物相遇。',effect:'fixed'},
      {label:'先拍演员特写',note:'把有限电量给最有力量的眼神。',delta:[-4,-2,5,3],style:'actor',feedback:'摄影师把镜头对准了演员的眼睛。',effect:'closeup'}]}
  ];
  // World is 960 × 640. Navigation is a 20px grid; obstacles include clearance.
  const obstacles = [{x:396,y:322,w:160,h:48},{x:90,y:495,w:135,h:63},{x:800,y:360,w:95,h:92}];
  function walkable(x,y){return x>=45&&x<=915&&y>=185&&y<=595&&!obstacles.some(o=>x>o.x-16&&x<o.x+o.w+16&&y>o.y-16&&y<o.y+o.h+16);}
  function route(from,to){
    const cols=48,rows=32,point=i=>({x:(i%cols)*20+10,y:Math.floor(i/cols)*20+10});
    const valid=i=>i>=0&&i<cols*rows&&walkable(point(i).x,point(i).y);
    const nearest=p=>{let best=-1,d=Infinity;for(let i=0;i<cols*rows;i++){if(!valid(i))continue;const q=point(i),n=(p.x-q.x)**2+(p.y-q.y)**2;if(n<d){d=n;best=i;}}return best;};
    const start=nearest(from),end=nearest(to);if(start<0||end<0)return [];
    const queue=[start],prev=new Map([[start,null]]);
    for(let head=0;head<queue.length&&!prev.has(end);head++){
      const i=queue[head];for(const n of [i-cols,i+cols,...(i%cols>0?[i-1]:[]),...(i%cols<cols-1?[i+1]:[])]){
        if(valid(n)&&!prev.has(n)){prev.set(n,i);queue.push(n);}
      }
    }
    if(!prev.has(end))return [];
    const result=[];for(let i=end;i!==null;i=prev.get(i))result.push(point(i));return result.reverse();
  }
  function createState(){return {stats:{time:100,budget:100,acting:55,quality:45},history:[],effects:{},player:{x:475,y:535},phase:'intro',paused:false};}
  function choose(state,id,index){
    const event=events.find(e=>e.id===id),choice=event?.choices[index];
    if(state.phase!=='explore'||state.paused||!choice||state.history.some(h=>h.id===id))return null;
    const delta={};Object.keys(names).forEach((key,i)=>{const before=state.stats[key];state.stats[key]=Math.max(0,Math.min(100,before+choice.delta[i]));delta[key]=state.stats[key]-before;});
    state.effects[id]=choice.effect;state.history.push({id,index,label:choice.label,title:event.title,style:choice.style});return {choice,delta};
  }
  function report(state){const s=state.stats,resource=Math.round((s.time+s.budget)/2);const counts=Object.fromEntries(Object.keys(styles).map(k=>[k,state.history.filter(h=>h.style===k).length]));const best=Object.keys(styles).sort((a,b)=>counts[b]-counts[a])[0];return {score:Math.round(s.quality*.55+s.acting*.25+resource*.2),resource,style:styles[best]};}
  const api={names,styles,events,obstacles,walkable,route,createState,choose,report};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;else window.FilmsetEngine=api;
})();
