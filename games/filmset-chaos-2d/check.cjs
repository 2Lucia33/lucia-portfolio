const assert=require('node:assert/strict');
const E=require('./engine.js');
assert.equal(E.events.length,5);
// Every possible one-scene playthrough stays bounded and gives a valid report.
for(let n=0;n<3**5;n++){
  const s=E.createState();s.phase='explore';let code=n;
  for(const e of E.events){const choice=code%3;code=Math.floor(code/3);assert(E.choose(s,e.id,choice));const before=JSON.stringify(s);assert.equal(E.choose(s,e.id,choice),null);assert.equal(JSON.stringify(s),before);}
  assert.equal(s.history.length,5);assert(Object.values(s.stats).every(n=>n>=0&&n<=100));
  const r=E.report(s);assert(r.score>=0&&r.score<=100);assert(Object.values(E.styles).includes(r.style));
}
const s=E.createState();assert.equal(E.choose(s,'actor',0),null);s.phase='explore';s.paused=true;assert.equal(E.choose(s,'actor',0),null);s.paused=false;
assert.equal(E.choose(s,'actor',99),null);assert.equal(E.choose(s,'missing',0),null);
// All interaction points connect both ways without crossing furniture.
const points=[s.player,...E.events.map(e=>e.stand)];
for(const from of points)for(const to of points){const path=E.route(from,to);assert(path.length);assert(path.every(p=>E.walkable(p.x,p.y)));const end=path.at(-1);assert(Math.hypot(end.x-to.x,end.y-to.y)<20);for(let i=1;i<path.length;i++)assert.equal(Math.hypot(path[i].x-path[i-1].x,path[i].y-path[i-1].y),20);}
for(const to of [{x:475,y:340},{x:-20,y:-20},{x:1100,y:800}])assert(E.route(s.player,to).every(p=>E.walkable(p.x,p.y)));
const sun=E.createState();sun.phase='explore';const choice=E.choose(sun,'producer',1);assert.equal(choice.delta.budget,0);assert.equal(sun.stats.budget,100);
console.log('PASS: 243 playthroughs, bounds, duplicate/invalid choice guards, pause, 36 routes, obstructed targets, clamped feedback.');
