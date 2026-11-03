import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import {fileURLToPath} from 'node:url';
import {dirname,join} from 'node:path';

const root=dirname(fileURLToPath(import.meta.url));
const source=await readFile(join(root,'atlas-v319.js'),'utf8');
const context={
 window:{},document:{getElementById:()=>null,createElement:()=>({}),head:{append:()=>{}}},
 MutationObserver:undefined
};
runInNewContext(source,context,{filename:'atlas-v319.js'});
const lab=context.window.AtlasMap319;
let count=0;
function check(ok,message){count++;assert.ok(ok,message);}
check(lab.ITEMS.length===16 && lab.byId.size===16 && lab.byKey.size===16,'canonical keys');
for(const item of lab.ITEMS){
 check(lab.markup(item[1],'ko').includes('data-map-key="'+item[1]+'"'),'markup '+item[1]);
 const html=lab.code({id:item[0]},'en');
 check(html.startsWith('<!doctype html>')&&html.includes('AtlasMap319.mount'),'export '+item[1]);
}
for(let seed=1;seed<=70;seed++){
 const wang=lab.rules.wang(7,5,2+(seed%3),seed);
 check(lab.rules.wangValid(wang,7,5)===0,'Wang edges '+seed);
 check(JSON.stringify(lab.rules.sample(seed,9))===JSON.stringify(lab.rules.sample(seed,9)),'seed deterministic '+seed);
 const noise=lab.rules.simplex(seed*.03,seed*.17,13);
 check(Number.isFinite(noise)&&Math.abs(noise)<=1,'simplex bounded '+seed);
}
for(let z=0;z<=6;z++)for(const lon of [-180,-100,0,150,179.5])for(const lat of [-80,0,45,80]){
 const tile=lab.rules.xyz(lon,lat,z),n=2**z;
 check(tile.x>=0&&tile.y>=0&&tile.x<n&&tile.y<n,'XYZ '+[z,lon,lat]);
}
let heights=Array.from({length:84},(_,i)=>i*.53+(i%9)*3);
for(let n=0;n<50;n++){
 const next=lab.rules.thermal(heights,12,7,3);
 check(Math.abs(heights.reduce((a,b)=>a+b,0)-next.reduce((a,b)=>a+b,0))<1e-8,'erosion mass '+n);
 heights=next;
}
const initial=lab.rules.wfcInitial();
check(initial.length===24&&initial.every(x=>x.length>=1),'WFC boundary initialization');
let successes=0;
for(let k=0;k<25;k++){
 let domain=lab.rules.wfcInitial();
 for(let i=0;i<30;i++){
  const step=lab.rules.wfcAdvance(domain,100+k*143+i,k%3*50);
  check(step.ok,'WFC propagation '+k+':'+i);
  domain=step.domains;
  if(step.done){
   successes++;
   let correct=true;
   for(let y=0;y<4;y++)for(let x=0;x<6;x++){
    const value=domain[y*6+x][0];
    if(x<5&&lab.rules.edge(value,1)!==lab.rules.edge(domain[y*6+x+1][0],3))correct=false;
    if(y<3&&lab.rules.edge(value,2)!==lab.rules.edge(domain[(y+1)*6+x][0],0))correct=false;
   }
   check(correct,'WFC adjacency '+k);
   break;
  }
 }
}
check(successes===25,'WFC solved all deterministic seeds');
const geo=lab.rules.geojson([{x:150,y:88,value:7}]);
check(geo.type==='FeatureCollection'&&geo.features.length===3,'GeoJSON structure');
const ring=geo.features[0].geometry.coordinates[0];
check(JSON.stringify(ring[0])===JSON.stringify(ring.at(-1)),'GeoJSON polygon closure');
console.log(JSON.stringify({pass:true,assertions:count,scenarios:{wang:70,seed:70,simplex:70,xyz:140,erosion:50,wfc:25},sourceBytes:Buffer.byteLength(source)}));
