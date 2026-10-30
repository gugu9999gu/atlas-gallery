/** Build only the v3.13 production overlay. Do not deploy the repository root over production. */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const output=process.argv[2] ? path.resolve(process.argv[2]) : path.join(root,'dist');
await mkdir(output,{recursive:true});
const source=await readFile(path.join(root,'atlas-v313.js'),'utf8');
// Correct the single truncated color token in the committed release source.
const style=source.replace('#53691','#536e91');
const ui=await readFile(path.join(root,'card-tools-v313.js'),'utf8');
const expected={
 'atlas-v313.js':'ebebbce16f4b4e7cc26112a97a3d3db60f48c05b46631bafefc67156cf5e4150',
 'card-tools-v313.js':'3f2f3b856696c6ad5be0ea3004005ee38f9ec86ee86766cbcb97ed0b5a1d039e'
};
for(const [name,content] of [['atlas-v313.js',style],['card-tools-v313.js',ui]]){
 const hash=createHash('sha256').update(content).digest('hex');
 if(hash!==expected[name])throw new Error(`Integrity mismatch for ${name}: ${hash}`);
 await writeFile(path.join(output,name),content,'utf8');
 console.log(`${name}: ${hash}`);
}
