import {mkdir,readdir,stat,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {pages} from './src/site.mjs';
const generated=['style.css','responsive.css','evidence.css','editorial.css','penn.css','layout.css','app.js','motion.js'];
await mkdir('dist',{recursive:true});
async function copyAssets(source,destination,top=false){
  await mkdir(destination,{recursive:true});
  for(const entry of await readdir(source,{withFileTypes:true})){
    if(top&&(entry.name.endsWith('.html')||generated.includes(entry.name)))continue;
    const from=join(source,entry.name),to=join(destination,entry.name);
    if(entry.isDirectory()){await copyAssets(from,to);continue;}
    if(!entry.isFile())continue;
    let previous;try{previous=await stat(to);}catch{}
    const current=await stat(from);
    // Media files are immutable; a new logo or a changed-size asset is copied.
    if(previous?.size===current.size)continue;
    await writeFile(to,await readFile(from));
  }
}
await copyAssets('public','dist',true);
for(const name of generated){const bytes=await readFile('src/'+name);await writeFile('dist/'+name,bytes);await writeFile('public/'+name,bytes);}
for(const [name,html] of Object.entries(pages)){await writeFile('dist/'+name,html);await writeFile('public/'+name,html);}
console.log(`Built ${Object.keys(pages).length} pages.`);
