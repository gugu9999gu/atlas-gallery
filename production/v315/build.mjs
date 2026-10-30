import {readFile, mkdir, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
const source=await readFile(path.join(root,'atlas-v315.js'),'utf8');
const expected='884eb9e28000410a768749fb239ee96554e533b5b8191c17f68d79048fcee2a2';
const sha=createHash('sha256').update(source).digest('hex');
if(sha!==expected)throw Error(`Unexpected source SHA-256: ${sha}`);
const output=process.argv[2]?path.resolve(process.argv[2]):path.join(root,'dist');
await mkdir(output,{recursive:true});
await writeFile(path.join(output,'atlas-v315.js'),source,'utf8');
console.log(JSON.stringify({file:'atlas-v315.js',bytes:Buffer.byteLength(source),sha256:sha}));
// This builds the v3.15 overlay only. The repository-root Worker is NOT the production baseline.
