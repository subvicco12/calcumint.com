import {spawnSync} from 'node:child_process';
const versions={};
for(const tool of ['pdftotext','pdffonts','pdftoppm','pdfinfo']){
 const result=spawnSync(tool,['-v'],{encoding:'utf8'});
 if(result.error||result.status!==0)throw Error(`Required independent PDF tool unavailable: ${tool}`);
 versions[tool]=(result.stderr||result.stdout).trim().split('\n')[0];
}
console.log(JSON.stringify({independentPdfTools:versions}));
