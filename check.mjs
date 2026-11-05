import {readFileSync,existsSync,statSync,readdirSync} from 'node:fs';import {resolve,dirname} from 'node:path';
const root=resolve('dist'), errors=[];let references=0;const pages=readdirSync(root).filter(f=>f.endsWith('.html'));
for(const file of pages){const html=readFileSync(root+'/'+file,'utf8');if(!html.includes('<html lang="en">'))errors.push(file+': missing language');if((html.match(/<h1[ >]/g)||[]).length!==1)errors.push(file+': needs one h1');if(/Ariana|aagarwal|farhan-haque|Plas-Stick|ariana-portrait/.test(html))errors.push(file+': template content');
 const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(m=>m[1]);if(new Set(ids).size!==ids.length)errors.push(file+': duplicate IDs');
 for(const m of html.matchAll(/(?:href|src|poster)="([^"]+)"/g)){let url=m[1];if(/^(https?:|mailto:|tel:|data:)/.test(url))continue;references++;const [path,hash]=url.split('#');const target=resolve(root,path||file);if(!existsSync(target)){errors.push(file+': missing '+url);continue;}if(statSync(target).size===0)errors.push(file+': empty '+url);if(hash&&target.endsWith('.html')){const other=readFileSync(target,'utf8');if(!other.includes(`id="${hash}"`))errors.push(file+': missing anchor '+url);}}
 for(const m of html.matchAll(/<img\b[^>]*>/g))if(!/\balt=/.test(m[0]))errors.push(file+': image lacks alt');
}
for(const name of ['app.js'])if(!statSync(root+'/'+name).size)errors.push('Empty script '+name);
for(const m of readFileSync(root+'/fonts/fonts.css','utf8').matchAll(/url\(\.\/([^)]+)\)/g))if(!existsSync(root+'/fonts/'+m[1]))errors.push('Missing font '+m[1]);
if(errors.length){console.error(errors.join('\n'));process.exit(1);}console.log(`PASS: ${pages.length} pages; ${references} local references and anchors; source identity, image alternatives, fonts, and file presence.`);
