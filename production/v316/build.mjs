/** Build the v3.16 overlay only. The repository-root Worker is NOT the production baseline. */
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';
const root=path.dirname(fileURLToPath(import.meta.url));
const output=process.argv[2] ? path.resolve(process.argv[2]) : path.join(root,'dist');
const source=await readFile(path.join(root,'atlas-v316.js'),'utf8');
const hash=createHash('sha256').update(source).digest('hex');
const expected='c0ace20753509000210a18814f85e8d524afce16632fd6524e7355f32358cfb6';
if(hash!==expected)throw new Error(`Release integrity mismatch: ${hash}`);
new vm.Script(source,{filename:'atlas-v316.js'});
const items=[...source.matchAll(/\[\s*'(dar-[a-f0-9]+)','(cb-[a-z]+)'/g)];
if(items.length!==24||new Set(items.map(m=>m[2])).size!==24)throw new Error('Expected 24 distinct card recipes');
await mkdir(output,{recursive:true});
await writeFile(path.join(output,'atlas-v316.js'),source,'utf8');
console.log(JSON.stringify({file:path.join(output,'atlas-v316.js'),bytes:Buffer.byteLength(source),sha256:hash,recipes:24}));
