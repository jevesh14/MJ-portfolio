import {mkdir,readdir,stat,readFile,writeFile,rename} from 'node:fs/promises';
import {join} from 'node:path';
import {pages} from './src/site.mjs';
const generated=['style.css','layout.css','app.js'];
await mkdir('dist',{recursive:true});
async function writeGenerated(path,bytes){
  const temporary=path+'.buildtmp-'+process.pid;
  await writeFile(temporary,bytes);
  await rename(temporary,path);
}
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
for(const name of generated){const bytes=await readFile('src/'+name);await writeGenerated('dist/'+name,bytes);await writeGenerated('public/'+name,bytes);}
for(const [name,html] of Object.entries(pages)){await writeGenerated('dist/'+name,html);await writeGenerated('public/'+name,html);}
console.log(`Built ${Object.keys(pages).length} pages.`);
