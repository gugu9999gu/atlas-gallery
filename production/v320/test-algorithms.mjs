/* Reproducible v3.20 algorithm, catalogue and standalone-export checks. */
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';
const file=join(dirname(fileURLToPath(import.meta.url)),'atlas-v320.js');
const source=await readFile(file,'utf8');
const context={window:{},document:{getElementById:()=>null,createElement:()=>({}),head:{append:()=>{}}},MutationObserver:undefined};
runInNewContext(source,context,{filename:'atlas-v320.js'});
const lab=context.window.AtlasPerf320;
let checks=0;function check(value,label){checks++;assert.ok(value,label);}
check(lab.ITEMS.length===16&&lab.byId.size===16&&lab.byKey.size===16,'Exactly 16 unique term IDs and recipe keys');
for(const [id,key,en,ko] of lab.ITEMS){
 check(lab.markup(key,'ko').includes('data-p320-key="'+key+'"'),'KO card '+key);
 const exportHtml=lab.code({id},'en');
 check(exportHtml.startsWith('<!doctype html>')&&exportHtml.includes('AtlasPerf320.mount'),'EN standalone '+key);
}
for(let n=0;n<=4;n++){
 const set=lab.rules.reach(n).used;
 check(set.size>=6&&set.size<=11&&set.has('App')&&set.has('router'),'tree-shake reach '+n);
 check(lab.rules.critical(n,false).filter(x=>x.done).length===n+1,'critical path '+n);
}
for(let task=10;task<=500;task+=10){
 const base=lab.rules.inp(task,false),split=lab.rules.inp(task,true);
 check(split.total<=base.total&&base.total===task+40,'INP synthetic arithmetic '+task);
}
for(let px=0;px<=70;px+=5){
 const shifted=lab.rules.cls(px,false),reserved=lab.rules.cls(px,true);
 check(shifted.score>=0&&reserved.score===0,'CLS reserved space '+px);
}
for(let budget=100;budget<=900;budget+=50){
 const heavy=lab.rules.budget(budget,false,true),optimized=lab.rules.budget(budget,true,false);
 check(optimized.total<=heavy.total&&optimized.over===(optimized.total>budget),'Budget arithmetic '+budget);
}
for(let n=0;n<=100;n++){
 const x=n/100;
 const curve=lab.rules.curve(x,36,false);
 check(curve>=0&&curve<=1,'Curve bounds '+n);
 const frame=lab.rules.keyframe(x,n%2===0);
 check([frame.x,frame.y,frame.rotation].every(Number.isFinite),'Keyframe finite '+n);
}
check(lab.rules.curve(0,30,false)===0&&lab.rules.curve(1,30,false)===1,'Bezier endpoints');
console.log(JSON.stringify({version:lab.version,passed:true,assertions:checks,items:lab.ITEMS.length,sourceBytes:Buffer.byteLength(source)}));
