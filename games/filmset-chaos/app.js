/* 片场失控：数据与规则分开书写，便于在作品集面试中讲解和迭代。 */
const SCENES = [
  { title: "第一场：重逢", subtitle: "让久别重逢保持克制，并在最后释放情绪。", target: "表演与情绪", note: "建立角色关系 · 熟悉片场决策", refill: { time: 0, budget: 0 }, events: [
    ["第一条的眼泪", "女主迟迟进不了状态。摄影和灯光都已就位，剧组在等你的决定。", [
      ["再拍一条", "稳妥争取表演，但消耗时间和经费。", [-14,-9,12,5], "actor", "她终于找到情绪，现场响起轻轻的掌声。"],
      ["让演员自由发挥", "给表演空间，成片可能更鲜活。", [-5,-3,8,4], "actor", "演员改了停顿方式，重逢有了真实的呼吸。"],
      ["改用远景与背影", "节省拍摄资源，用画面承担情绪。", [-4,-2,-3,7], "visual", "镜头保留了克制感，但演员的情绪被隐藏了一部分。"]]],
    ["男主忘了台词", "一句重要的道歉词反复卡住，场地只允许再拍两次。", [
      ["带他逐句排练", "多花时间，改善表演。", [-12,-4,10,3], "actor", "排练后，道歉说得更自然。"],
      ["允许即兴道歉", "快速拍摄，保留意外的真实感。", [-5,-2,4,5], "actor", "台词变了，但人物关系更可信。"],
      ["删去道歉台词", "用沉默和剪辑处理。", [-3,-2,-4,4], "visual", "画面更简洁，人物的动机却稍显含糊。"]]],
    ["窗外突然下雨", "本来需要温暖夕阳的镜头，如今变成灰蓝色雨景。", [
      ["等雨停", "维持原定视觉方案。", [-16,-7,1,8], "visual", "夕阳终于出现，画面符合分镜。"],
      ["把雨写进情节", "现场改写，让天气成为角色。", [-7,-3,3,7], "story", "雨水让重逢多了一层迟疑。"],
      ["在棚内补拍", "控制画面，增加费用。", [-5,-13,0,5], "visual", "光线可控，却失去了部分现场质感。"]]],
    ["制片人要露出品牌", "品牌水杯必须在本场出现，否则赞助款会缩水。", [
      ["设计自然的递水动作", "多做调度，兼顾商业与人物。", [-8,5,2,2], "producer", "植入进入人物互动，没有打断情绪。"],
      ["拍一个清晰特写", "预算宽裕，但观感突兀。", [-2,9,-3,-6], "producer", "品牌方满意，看片时却有人出戏。"],
      ["拒绝植入", "保护叙事，放弃一部分资金。", [-2,-11,2,5], "story", "这场戏保持完整，制片部门开始计算缺口。"]]],
    ["群众演员迟到", "站台背景显得过于空旷，主角已经化好妆。", [
      ["等人到齐", "保持原分镜。", [-12,-7,0,6], "visual", "站台重新热闹起来，镜头层次完整。"],
      ["收紧构图", "用近景避开空位。", [-4,-1,2,3], "visual", "视线集中在主角身上，空间感弱了一些。"],
      ["改成空站台设定", "让冷清服务于故事。", [-6,-2,1,7], "story", "空荡的站台强化了两人的距离。"]]],
    ["道具信件不见了", "信件是重逢戏的重要线索，道具组找不到备用件。", [
      ["现场重做信件", "保留原叙事。", [-11,-6,0,6], "story", "手写信赶上了拍摄，也保住了伏笔。"],
      ["改成手机语音", "迅速调整信息载体。", [-5,-2,0,4], "story", "故事还能理解，但年代气质发生变化。"],
      ["用演员眼神交代", "减少解释，依赖演出。", [-4,-1,5,1], "actor", "眼神很动人，部分观众可能错过线索。"]]],
    ["摄影机电池告急", "离计划中的最后一个推进镜头只差一条。", [
      ["借备用电池", "花钱保住镜头。", [-7,-8,0,7], "visual", "推进镜头顺利完成。"],
      ["改拍固定机位", "快速完成，画面更克制。", [-3,-1,0,2], "visual", "固定镜头稳定，但少了一个情绪推进。"],
      ["先拍演员特写", "把有限电量给表演。", [-4,-2,5,3], "actor", "最有力量的眼神被拍了下来。"]]],
    ["主角对人物动机有疑问", "演员认为重逢时不该立刻拥抱，剧本却写了拥抱。", [
      ["一起讨论动机", "投入时间，换取表演信任。", [-10,-2,10,4], "actor", "讨论后，拥抱有了更清楚的理由。"],
      ["按剧本执行", "节约时间，演员略显迟疑。", [-2,-1,-5,2], "producer", "场面完成了，情绪却显得有点被安排。"],
      ["删掉拥抱", "将留白变成新的表达。", [-5,-2,2,5], "story", "两人没有拥抱，距离反而更耐人寻味。"]]]
  ]},
  { title: "第二场：失控", subtitle: "一场夜戏逐渐超支；你要在执行压力中保住叙事。", target: "资源与画面", note: "预算收紧 · 冲突升级", refill: { time: 55, budget: 35 }, events: [
    ["夜戏灯光故障", "主灯忽明忽暗，租赁设备的更换费用高于预期。", [
      ["紧急更换主灯", "花钱维持既定画面。", [-8,-16,0,10], "visual", "新的主灯恢复了夜景层次。"],
      ["利用闪烁拍摄", "把故障设计成不安感。", [-7,-3,0,6], "story", "闪烁让冲突更紧张，也改变了原风格。"],
      ["降低布光要求", "快速推进，画质会受影响。", [-2,-1,0,-5], "producer", "拍摄继续，画面却失去不少质感。"]]],
    ["场地只剩半小时", "场地方通知必须准时撤场，原计划还有三组镜头。", [
      ["加钱延时", "买回拍摄时间。", [8,-16,0,5], "producer", "剧组获得延时，预算压力随之加重。"],
      ["删掉过渡镜头", "保留冲突高潮。", [-5,-2,0,2], "story", "叙事更快，场景转换稍显突然。"],
      ["一镜到底完成", "要求演员与摄影同步发挥。", [-10,-3,-4,8], "visual", "长镜头很有力量，也让演员疲惫。"]]],
    ["配角临时请假", "揭露秘密的关键对手戏没有搭档。", [
      ["调整日程补拍", "成本上升，保留完整戏份。", [-12,-12,0,8], "producer", "对手戏后来补齐了。"],
      ["改成电话争执", "保留信息，降低表演张力。", [-5,-3,-2,3], "story", "剧情清晰，但正面冲突减少。"],
      ["让主角独白", "突出角色内心，考验演员。", [-7,-2,4,5], "actor", "演员撑起独白，秘密变成私人伤口。"]]],
    ["临时演员抱怨等待", "夜戏延误，群演状态下降并开始离场。", [
      ["增加夜餐和补贴", "稳住团队，增加支出。", [-5,-11,3,5], "producer", "大家留下来，后半夜的镜头得以完成。"],
      ["先拍群演镜头", "调整顺序，牺牲主角休息。", [-8,-3,-3,5], "producer", "背景镜头完成，主角的疲惫也写在脸上。"],
      ["缩小群演规模", "低成本处理场面。", [-3,-1,0,-3], "visual", "场面略显单薄，但拍摄得以继续。"]]],
    ["雨机出了问题", "雨量过大，原本安静的争执变成嘈杂的暴雨戏。", [
      ["停机修雨机", "恢复剧本气质。", [-12,-9,0,7], "visual", "雨势回到预期，细节重新可控。"],
      ["将争执升级", "顺势改为情绪爆发。", [-7,-2,3,6], "story", "冲突更激烈，角色关系也变了。"],
      ["拍无声画面后配音", "省现场时间，后期负担增加。", [-3,-4,-2,2], "producer", "画面拍到了，但口型与声音不够贴合。"]]],
    ["摄影师提出复杂运镜", "新方案很漂亮，却要重新铺轨并占用时间。", [
      ["采用运镜", "视觉收益高，消耗较多资源。", [-14,-10,0,10], "visual", "镜头成为整场戏的记忆点。"],
      ["保留原分镜", "稳妥执行。", [-5,-3,0,4], "producer", "节奏稳定，没有额外惊喜。"],
      ["改成手持跟拍", "省钱，但画面不稳定。", [-6,-1,-1,5], "visual", "手持增加了临场感。"]]],
    ["剧本出现逻辑漏洞", "角色此时不该知道秘密，继续拍会影响整部电影的可信度。", [
      ["停机修改台词", "消耗时间，修复因果。", [-11,-4,0,9], "story", "信息顺序理顺了，后续剧情更扎实。"],
      ["补拍一个发现线索", "用镜头解释信息来源。", [-9,-8,0,8], "visual", "补充镜头让转折成立。"],
      ["留给后期解释", "眼前最省资源，留下叙事风险。", [-2,-1,0,-7], "producer", "剧组按时收工，但漏洞留在粗剪里。"]]],
    ["男主精力透支", "连续夜戏后，重要的争吵戏明显缺少爆发力。", [
      ["安排休息后再拍", "恢复状态，消耗时间。", [-14,-4,11,5], "actor", "短暂休息后，演员重新找到力量。"],
      ["调整成压抑的低声争执", "顺应状态，修改表达。", [-6,-2,5,6], "story", "低声争执比吼叫更有压迫感。"],
      ["直接保留这一条", "省资源，但表演不够到位。", [-2,-1,-8,-5], "producer", "这条能用，却少了冲突应有的重量。"]]]
  ]},
  { title: "第三场：最后一次告别", subtitle: "最终场决定整部电影如何落幕。所有积累将在这里兑现。", target: "结局与整体完成度", note: "终局决策 · 成片定调", refill: { time: 50, budget: 30 }, events: [
    ["结局有两个版本", "编剧想保留开放结局，制片人希望明确和解。", [
      ["拍两个版本", "给剪辑更多选择，成本最高。", [-13,-12,0,8], "story", "两种结尾都拍到了，最终选择权留在剪辑室。"],
      ["坚持开放结局", "保留余味，承担观众分歧。", [-5,-2,1,7], "story", "角色的未来留给观众想象。"],
      ["明确和解", "结尾更易理解，情绪更直接。", [-4,-2,2,4], "producer", "观众得到答案，余味略短。"]]],
    ["最后一场戏要日出", "天空阴云密布，日出可能无法如期拍到。", [
      ["继续等云开", "赌天气，争取最佳画面。", [-15,-6,0,9], "visual", "云缝透出光，结尾终于有了层次。"],
      ["用室内晨光替代", "增加布光费用，保证进度。", [-7,-11,0,6], "visual", "晨光可控，真实空间感略弱。"],
      ["改成阴天告别", "接受现实，让结局更冷静。", [-4,-2,1,5], "story", "阴天赋予告别另一种诚实。"]]],
    ["女主要求改最后一句台词", "她觉得原台词太像宣言，人物此刻应该更沉默。", [
      ["让她试拍新版", "相信演员，花时间验证。", [-9,-4,8,6], "actor", "新的台词更轻，却更能击中人。"],
      ["坚持原台词", "保持剧本结构，拍摄迅速。", [-3,-1,-4,3], "story", "主题说清楚了，人物稍显用力。"],
      ["完全删掉台词", "用表演与画面收尾。", [-5,-2,3,5], "visual", "沉默留给观众更多解释空间。"]]],
    ["剪辑师发现缺一个反应镜头", "没有这个镜头，离别的情绪转换有些跳跃。", [
      ["召回演员补拍", "解决衔接，消耗资源。", [-12,-11,2,9], "producer", "补拍镜头缝合了情绪断点。"],
      ["用旧素材重组", "节省资源，效果依赖剪辑。", [-6,-3,0,4], "visual", "节奏顺了，表情却并非完全对应。"],
      ["保留跳切", "形成风格化处理。", [-2,-1,0,1], "story", "跳切有记忆点，也让部分观众困惑。"]]],
    ["音乐版权超出预算", "原定的告别曲很合适，但授权费突然上涨。", [
      ["购买授权", "情绪最稳定，挤压预算。", [-2,-17,0,8], "producer", "熟悉的旋律托住了结尾。"],
      ["委托原创短曲", "需要沟通与修改，成本适中。", [-7,-8,0,7], "story", "原创旋律给电影留下自己的声音。"],
      ["用环境音收尾", "低成本，更克制。", [-3,-1,0,4], "visual", "列车声代替音乐，告别显得更真实。"]]],
    ["试映观众看不懂伏笔", "两组试映观众都没注意到第一场的信件。", [
      ["补一个信件特写", "解释清晰，可能略显直白。", [-9,-8,0,8], "story", "线索被观众看见，结尾的回收更有效。"],
      ["加一句回忆台词", "快速补充信息。", [-5,-3,-1,4], "story", "信息到位，表达稍显解释性。"],
      ["相信观众自己发现", "保持留白，接受理解门槛。", [-2,-1,0,1], "visual", "少数观众很喜欢，多数人没接上伏笔。"]]],
    ["制片方要求缩短片长", "目前粗剪超时三分钟，结尾必须压缩。", [
      ["删掉重复解释", "优化节奏，细修费时。", [-8,-4,0,8], "story", "叙事更紧，核心信息仍在。"],
      ["删一段演员独白", "迅速达标，人物层次受损。", [-3,-1,-5,2], "producer", "片长达标了，角色内心却少了一层。"],
      ["申请保留片长", "增加发行压力，保住完整表达。", [-4,-10,1,5], "story", "电影保住了呼吸感，宣发预算更紧。"]]],
    ["杀青前最后一条", "所有人都已疲惫，导演监视器里却出现一个可以更好的瞬间。", [
      ["再拍一条", "争取最佳状态，时间和预算都吃紧。", [-13,-9,5,9], "actor", "最后一条真的更好，剧组也真正完成了这部电影。"],
      ["保留现有版本", "尊重团队，稳妥收工。", [-2,-1,2,3], "producer", "这版足以成立，所有人终于能休息。"],
      ["改拍一个空镜", "用空间表达告别。", [-5,-3,0,6], "visual", "空镜成为电影最后的呼吸。"]]]
  ]}
];

const app = document.querySelector("#app");
const names = { time: "时间", budget: "预算", acting: "演员状态", quality: "成片质量" };
const styleNames = { actor: "演员型导演", visual: "视觉型导演", story: "叙事型导演", producer: "执行型导演" };
let state = null;
const clamp = n => Math.max(0, Math.min(100, n));
const shuffle = items => { const copy = [...items]; for (let i=copy.length-1;i>0;i--) { const j=Math.floor(Math.random()*(i+1)); [copy[i],copy[j]]=[copy[j],copy[i]]; } return copy; };
const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[c]));

function start() {
  state = { scene: 0, step: 0, decks: SCENES.map(s => shuffle(s.events).slice(0,5)), stats: {time:100,budget:100,acting:55,quality:45}, styles: {actor:0,visual:0,story:0,producer:0}, history: [], last: null };
  render();
}
function choose(index) {
  if (!state || state.last) return;
  const event = state.decks[state.scene][state.step];
  const choice = event[2][index];
  if (!choice) return;
  const before = {...state.stats};
  ["time","budget","acting","quality"].forEach((key,i) => state.stats[key] = clamp(state.stats[key] + choice[2][i]));
  state.styles[choice[3]]++;
  state.history.push({scene:state.scene, event:event[0], choice:choice[0]});
  state.last = {choice, before};
  render();
  document.querySelector("#outcome")?.scrollIntoView({behavior:"smooth",block:"nearest"});
}
function next() {
  if (!state?.last) return;
  state.last = null;
  state.step++;
  if (state.step === 5) {
    state.step = 0;
    state.scene++;
    if (state.scene < 3) {
      const refill = SCENES[state.scene].refill;
      state.stats.time = clamp(state.stats.time + refill.time);
      state.stats.budget = clamp(state.stats.budget + refill.budget);
    }
  }
  render();
  window.scrollTo({top:0,behavior:"smooth"});
}
function metric(key) {
  const value = state.stats[key];
  return `<div class="metric"><div class="metric-top"><span>${names[key]}</span><strong>${value}</strong></div><div class="bar" role="progressbar" aria-label="${names[key]}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${value}"><span class="${value < 25 ? "low" : ""}" style="width:${value}%"></span></div></div>`;
}
function intro() {
  app.innerHTML = `<section class="hero"><div class="eyebrow">片场策略 · 互动叙事 · 作品集 Demo</div><h1>你的电影，<br><span>由你决定。</span></h1><p class="lead">你是电影《最后一次告别》的现场导演。三场关键戏里，演员、天气、预算和制片要求不断冲突。每次选择都要付出代价，也会改变最终的电影。</p><div class="intro-grid"><article><strong>03</strong><p>三个场景，从重逢到告别，压力逐步升级。</p></article><article><strong>24</strong><p>种片场事件，每次体验随机抽取十五种。</p></article><article><strong>04</strong><p>项核心数值，决定成片表现与导演风格。</p></article></div><button class="primary" id="start">开始拍摄 →</button><p class="hint">无需注册或安装。选择后可查看即时反馈；结束时获得评分和决策回顾。</p></section>`;
  document.querySelector("#start").addEventListener("click", start);
}
function game() {
  const scene = SCENES[state.scene], event = state.decks[state.scene][state.step];
  const choices = state.last ? "" : `<div class="choice-list">${event[2].map((c,i) => `<button class="choice" data-choice="${i}"><strong>${String.fromCharCode(65+i)} · ${escapeHTML(c[0])}</strong><small>${escapeHTML(c[1])}</small></button>`).join("")}</div>`;
  const outcome = state.last ? `<div class="outcome" id="outcome"><h3>场记反馈 · ${escapeHTML(state.last.choice[0])}</h3><p>${escapeHTML(state.last.choice[4])}</p><div class="delta-list">${Object.keys(names).map(k=>{const d=state.stats[k]-state.last.before[k];return `<span class="delta ${d>=0?"good":"bad"}">${names[k]} ${d>=0?"+":""}${d}</span>`}).join("")}</div><button class="primary" id="next">${state.scene===2&&state.step===4?"查看最终成片 →":state.step===4?"进入下一场 →":"继续拍摄 →"}</button></div>` : "";
  app.innerHTML = `<div class="game-head"><div><div class="eyebrow">场次 ${state.scene+1} / 3 · ${scene.note}</div><h1>${scene.title}</h1><p class="scene-desc">${scene.subtitle}</p></div><div class="progress">本场事件 <strong>${state.step+1} / 5</strong></div></div><section class="metrics" aria-label="当前状态">${Object.keys(names).map(metric).join("")}</section><div class="game-grid"><section class="panel"><div class="scene-note">事件 ${state.step+1} · ${scene.target}</div><h2 class="event-title">${escapeHTML(event[0])}</h2><p class="event-copy">${escapeHTML(event[1])}</p>${choices}${outcome}</section><aside class="panel side"><h2 class="side-title">导演备忘录</h2><p>目标：${scene.subtitle}</p><div class="scene-count" aria-label="本场进度">${Array.from({length:5},(_,i)=>`<i class="${i<state.step?"done":""}"></i>`).join("")}</div><hr><h2 class="side-title">规则</h2><ul><li>每个选择立即改变四项状态。</li><li>时间、预算在新场次会得到部分补充，上限为 100。</li><li>最终评分综合成片质量、表演与资源控制。</li><li>导演风格由你最常采用的决策方向决定。</li></ul>${state.stats.time<25||state.stats.budget<25?`<hr><p>⚠ 资源告急。下一场会有少量补充，但本场仍需控制消耗。</p>`:""}</aside></div>`;
  document.querySelectorAll("[data-choice]").forEach(b=>b.addEventListener("click",()=>choose(Number(b.dataset.choice))));
  document.querySelector("#next")?.addEventListener("click",next);
}
function result() {
  const s=state.stats;
  const resource=Math.round((s.time+s.budget)/2);
  const score=Math.round(s.quality*.55+s.acting*.25+resource*.2);
  const grade=score>=75?"口碑佳作":score>=60?"值得一看":score>=45?"有亮点，也有遗憾":"制作艰难的一部电影";
  const style=Object.keys(state.styles).sort((a,b)=>state.styles[b]-state.styles[a])[0];
  const styleCopy={actor:"你经常把时间留给演员。表演更细腻，也要留意拍摄进度。",visual:"你相信镜头能讲故事。画面有记忆点，也需确认叙事线索清楚。",story:"你擅长顺势改写。故事保持弹性，也要守住人物动机。",producer:"你能让剧组继续运转。执行稳定，也要为创作留出空间。"}[style];
  const vals=[["成片质量",s.quality],["演员表现",s.acting],["资源控制",resource]];
  app.innerHTML=`<section class="result"><div class="eyebrow">杀青 · 最终成片报告</div><h1>《最后一次告别》</h1><p class="result-lead">十五次决定之后，你的电影完成了。这个分数来自你的实际选择，并非随机评价。</p><div class="score-hero"><div class="score">${score}<small style="font-size:20px;color:#aeb8c7"> / 100</small></div><div><div class="grade">${grade}</div><div class="hint">综合评分</div></div></div><div class="result-grid"><article class="result-card"><h2>导演风格</h2><strong>${styleNames[style]}</strong><p>${styleCopy}</p></article><article class="result-card"><h2>最终资源</h2><strong>时间 ${s.time} · 预算 ${s.budget}</strong><p>资源控制取两项剩余值的平均数。新场次的补充已计入。</p></article><article class="result-card wide"><h2>评分构成</h2><div class="breakdown">${vals.map(([label,val])=>`<div class="break-row"><span>${label}</span><div class="bar"><span style="width:${val}%"></span></div><strong>${val}</strong></div>`).join("")}</div><p>综合评分 = 成片质量 × 55% + 演员表现 × 25% + 资源控制 × 20%。</p></article><article class="result-card wide"><h2>你的关键决策</h2><ol class="history">${state.history.filter((_,i)=>[0,4,5,9,10,14].includes(i)).map(h=>`<li>${escapeHTML(h.event)}：${escapeHTML(h.choice)}</li>`).join("")}</ol></article></div><div class="actions"><button class="primary" id="restart">重新拍摄 →</button><button class="secondary" id="copy">复制成片报告</button></div><p class="hint" id="copy-status" aria-live="polite">再玩一次会重新抽取事件，尝试另一种导演风格。</p></section>`;
  document.querySelector("#restart").addEventListener("click",start);
  document.querySelector("#copy").addEventListener("click",async()=>{
    const report=`《最后一次告别》｜片场失控 Demo\n评分：${score}/100（${grade}）\n导演风格：${styleNames[style]}\n成片质量 ${s.quality} / 演员表现 ${s.acting} / 资源控制 ${resource}\n关键决策：\n${state.history.filter((_,i)=>[0,4,5,9,10,14].includes(i)).map(h=>`- ${h.event}：${h.choice}`).join("\n")}`;
    try{await navigator.clipboard.writeText(report);document.querySelector("#copy-status").textContent="报告已复制，可以粘贴分享。"}catch{document.querySelector("#copy-status").textContent="当前浏览器无法复制；可直接查看上方报告。"}
  });
}
function render(){ if(!state) intro(); else if(state.scene>=3) result(); else game(); }
render();
