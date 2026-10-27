import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
const exec=promisify(execFile);
/** Apply the platform's actual owner-only permission mechanism BEFORE writing secrets. */
export async function protectPreviewDirectory(directory){
 if(process.platform!=='win32')return;
 const {stdout}=await exec('whoami.exe',['/user','/fo','csv','/nh'],{windowsHide:true});
 const sid=stdout.match(/S-1-\d+(?:-\d+)+/)?.[0];
 if(!sid)throw new Error('Cannot identify preview credential owner');
 await exec('icacls.exe',[directory,'/inheritance:r','/grant:r',`*${sid}:(OI)(CI)F`],{windowsHide:true});
}
