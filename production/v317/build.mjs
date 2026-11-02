// Build the v3.17 overlay only. The repository-root Worker is not the production baseline.
import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {Script} from 'node:vm';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const source=await readFile(path.join(root,'atlas-v317.js'),'utf8');
new Script(source,{filename:'atlas-v317.js'});
const entries=[...source.matchAll(/\[\s*'(dar-[a-f0-9]+)','(ai-[a-z]+)'/g)].map(m=>[m[1],m[2]]);
if(entries.length!==24||new Set(entries.map(x=>x[0])).size!==24||new Set(entries.map(x=>x[1])).size!==24)throw Error('Expected 24 unique existing entries and recipes');
const hash=createHash('sha256').update(source).digest('hex');
const expected='8f2cc5e2289309b055d7f22dbcbefb86d39c8958c5e6df995d0a65ce982c595e';
if(hash!==expected)throw Error('Source differs from the tested release: '+hash);
const output=process.argv[2]?path.resolve(process.argv[2]):path.join(root,'dist');
await mkdir(output,{recursive:true});
await writeFile(path.join(output,'atlas-v317.js'),source,'utf8');
console.log(JSON.stringify({version:'3.17.0',recipes:24,sha256:hash,bytes:Buffer.byteLength(source),output}));
