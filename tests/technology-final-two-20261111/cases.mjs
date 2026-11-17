/** Literal independent witnesses; no canonical/source approval or publication grant. */
export const cases=[
 {catalogId:368,engine:'technology.ip-subnet',slug:'ip-subnet-calculator',title:'IP Subnet Calculator',version:1,unit:'addresses',input:{address:'192.168.1.10',prefixLength:'24'},expected:256,alternateInput:{address:'192.168.1.10',prefixLength:'23'},alternateExpected:512,axis:'prefixLength',limitations:['Total IPv4 address count only; no host list/network/broadcast/routability/IPv6 claim.']},
 {catalogId:376,engine:'technology.screen-ppi',slug:'screen-ppi-calculator',title:'Screen PPI Calculator',version:1,unit:'pixels/inch',input:{widthPixels:'1920',heightPixels:'1080',diagonalInches:'15.6'},expected:141.21199808219862,alternateInput:{widthPixels:'1920',heightPixels:'1080',diagonalInches:'31.2'},alternateExpected:70.60599904109931,axis:'diagonalInches',limitations:['Supplied pixel dimensions and physical diagonal in inches; no panel/manufacturer/measurement/clinical applicability inference.']},
];
export const typedInput=c=>Object.fromEntries(Object.entries(c.input).map(([key,value])=>[key,key==='address'?value:Number(value)]));
