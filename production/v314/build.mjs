import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const dir=path.dirname(fileURLToPath(import.meta.url));
const output=process.argv[2]?path.resolve(process.argv[2]):path.join(dir,'dist');
// Normalize the Signal and Slot display label to the existing canonical catalog.
const raw=await readFile(path.join(dir,'atlas-v314.js'),'utf8');
const source=raw.replace("'ax-signals','Signal and Slot','시그니파이어'","'ax-signals','Signal and Slot','시그널·슬롯'");
const expected='fc9c6d03cb845435c126bf2be3a5bd7c9ed1578873040e18d8ce41756e58fba2';
const actual=createHash('sha256').update(source).digest('hex');
if(actual!==expected)throw Error(`Deployment source mismatch: ${actual}`);
await mkdir(output,{recursive:true});
await writeFile(path.join(output,'atlas-v314.js'),source);
console.log(JSON.stringify({output,sha256:actual,bytes:Buffer.byteLength(source)}));
// This builds an overlay only. Never deploy the old repository-root Worker over production.
