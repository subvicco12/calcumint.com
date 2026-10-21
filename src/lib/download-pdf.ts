/** A local PDF download request; browser acceptance is not proof of disk completion. */
export function downloadPdfBytes(filename:string,bytes:Uint8Array):void{
 const url=URL.createObjectURL(new Blob([new Uint8Array(bytes).buffer],{type:'application/pdf'}));
 const anchor=document.createElement('a');
 try{anchor.href=url;anchor.download=filename;document.body.append(anchor);anchor.click();}
 finally{anchor.remove();const revoke=URL.revokeObjectURL.bind(URL);setTimeout(()=>revoke(url),1000);}
}
