/** Historical receipts retain their exact byte claims; current successors prove separately. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const prior='1ec63cd11626df15063546c7e5bfedecec33f6ee';
// Populated only by independently reviewed final frozen-app source records.
const sources=Object.freeze([
  {
    "path": "src/app/api/business/technology-embeds/route.ts",
    "priorSHA256": "7a53c8d5aa5cda67c766be654d2f730de5053d7cbff9cbe925572a50feb87183",
    "currentBlob": "4b89880ac46b91641175bb3b4d6cdd3a6375732b",
    "currentSHA256": "44bacb14cb8c86c6ce7b207b7cdda570527c1f9663b78e90be2513db0163fe25"
  },
  {
    "path": "src/app/api/business/technology-five-shares/route.ts",
    "priorSHA256": "424b0bb4b18285f0ddc5c2595ce44c1333f3769336a7d77dd79f5f543aabea02",
    "currentBlob": "bc1276d24757d44d8311573d0228bae49c03866f",
    "currentSHA256": "d32a0b98f4b1c9daa14cacdb6b575b30c57aca87d03d4bafd2bcf74a822f41d9"
  },
  {
    "path": "src/app/business/projects/[id]/page.tsx",
    "priorSHA256": "6184d508becee7a7b441e310cd28d04af2c88fdc7e45716c78440030d5f45ec8",
    "currentBlob": "e10077a017b7215f49789db7782a7419635d065c",
    "currentSHA256": "91b2546a1469aa40bec4a042f21aa4560ca2c1bc0bef1a30d6013d3ddc970b2e"
  },
  {
    "path": "src/app/business/shared/[id]/page.tsx",
    "priorSHA256": "bb6a888c9a9c1bcad3d36bbf6f924b9e372324a48243af1842bd7e9c04ca8a1f",
    "currentBlob": "4b3b22f116c3b1460ae1175895c36b504d800cf3",
    "currentSHA256": "e020d51eed26293dc846a5049a82b45489d178c8fb772a41b5b733bba04e29b3"
  },
  {
    "path": "src/components/calculator-interactive.tsx",
    "priorSHA256": "8f033f08da04fddfcedf6a230dc4a93aaff97d9c8f69b20bf4e1be0341ddebb6",
    "currentBlob": "f21d8bb8b627639c0d55782478b786b1a763748d",
    "currentSHA256": "c6296c137d66ab2a731f9144ab58efb3cb2f25dce2f7f31223b0b9a508d93755"
  },
  {
    "path": "src/components/technology-five-analysis.tsx",
    "priorSHA256": "52951de9c42770e75613a4e4803fcd5b3f1b6c8a5d4de2a9bc2fbf8e52650022",
    "currentBlob": "29fdf234270b65f76100f2b15f27bd9e6a706a61",
    "currentSHA256": "137ff472c20404e12e1e402c9c994cc75559f8f59bc54f70a8dd3bd6920fbc72"
  },
  {
    "path": "src/components/technology-five-delivery.tsx",
    "priorSHA256": "d6d4b90c8d07e395c03e356d789fe31d76c166fa86b2c2df578b15f0bcb1b1c1",
    "currentBlob": "afa812a69636effd83aca02224d83c99adc4c630",
    "currentSHA256": "1780cfb914e3c893e43d7493c81a727aaef12e706944536b3bec5322ccb53b22"
  },
  {
    "path": "src/components/technology-five-embed.tsx",
    "priorSHA256": "5fa2686c41f1fccd73f6b669a5c7e751a5cbdc201cc4c2209402d90dad97482e",
    "currentBlob": "b31580ad6909194d62396815a14fc445dc640ae3",
    "currentSHA256": "22b14b98203501372e3ef5b9b53977c2c4afc57cf8367e22b8d47d23dfe59e98"
  },
  {
    "path": "src/components/technology-five-share-form.tsx",
    "priorSHA256": "93f0039d5fda3fe8fbef21c2e153fbb7beaa94468a66620f5e54e9c9871ebb78",
    "currentBlob": "972a48ec512bf44ba9960365c1254f1b7d26ae3a",
    "currentSHA256": "7ed40e28d9dbbba689e9fd71c5b935dffad49fc490f2249f8daf0a9c9cd3404d"
  },
  {
    "path": "src/components/technology-five-shared-comparison.tsx",
    "priorSHA256": "90fed180975a18bb6a3e7bce85b6a2514c90ef143144250e0574a7fb8b2b1c91",
    "currentBlob": "a46d530fc868b38600c5263264f68c86da70925a",
    "currentSHA256": "21f8d4eb2cb0d455e420234e831f1754e9dba720d5497cd7cadc550982e4cefa"
  },
  {
    "path": "src/lib/native-delivery/technology-five-catalog.ts",
    "priorSHA256": "b3e88df8cd5458b8ec42fa424aff822407d34379e5f7f43354e1a0e2749e8854",
    "currentBlob": "064f6559f6282267cf87152b0873a30ef09e3cbc",
    "currentSHA256": "9c043fbdb5cca8dbd3bc79ebc2356225551719b03e4dd495321ca7019d4a460d"
  },
  {
    "path": "src/lib/native-delivery/technology-five-contract.ts",
    "priorSHA256": "cab680f4b3429f7631d7c655971db6607d488e2d94590d98015a5b233ecabe4a",
    "currentBlob": "ed0ffd6908e681409d245ca360ebc0e0d5d00e3d",
    "currentSHA256": "1df758ea71a6f86e4db51290e959ee305c8a426b497ba87ad97f7230f72c25cf"
  },
  {
    "path": "src/lib/native-delivery/technology-five-grant.ts",
    "priorSHA256": "6e1a32f28790efdd8510b731693359822d6191f7fa348b0967d5e06234ad9eee",
    "currentBlob": "d586304b762def8e94db21f55eeb2eb1c3abe673",
    "currentSHA256": "f685409d2bb325d5c401e5444584021d7fc25ebd65f9364afa3aafcbd2ae3ee3"
  },
  {
    "path": "src/lib/native-delivery/technology-five-jobs.ts",
    "priorSHA256": "a30a1f516bddb2b6b7fbd428ee9f957c473126b121fc9bf5b0b6ad4d403deb5b",
    "currentBlob": "eaa728320c467cb7b76b8ae750a725b68296d983",
    "currentSHA256": "d64c696c07dace1c989c00dc041986c1b3a48b9fbb8f2c0a230385a4798c8569"
  },
  {
    "path": "src/lib/scenario-set-recovery.ts",
    "priorSHA256": "c031ccad177baba9a3babf0a85488fe0513d9ac32b73f62371e45a6c2337f0c5",
    "currentBlob": "a2d20491d8fe33ae38feca27a6f3bd5fe832cb37",
    "currentSHA256": "5454b551650cdce18fb9ba2d0af78e777c233dcd9b41660a8e85f5bd28b1cd53"
  }
]);
const currentContext=Object.freeze([
  {
    "path": "src/app/api/business/technology-embeds/route.ts",
    "blob": "4b89880ac46b91641175bb3b4d6cdd3a6375732b",
    "sha256": "44bacb14cb8c86c6ce7b207b7cdda570527c1f9663b78e90be2513db0163fe25"
  },
  {
    "path": "src/app/api/business/technology-five-shares/route.ts",
    "blob": "bc1276d24757d44d8311573d0228bae49c03866f",
    "sha256": "d32a0b98f4b1c9daa14cacdb6b575b30c57aca87d03d4bafd2bcf74a822f41d9"
  },
  {
    "path": "src/app/api/internal/technology-webhooks/process/route.ts",
    "blob": "6ad719e85b35a8c521f68c80e4f8167c60b27903",
    "sha256": "1846fbe6ee282ce58f3d3e1ec85180f19f1f2ee2b4deace26ee2fabfa1e14e4f"
  },
  {
    "path": "src/app/api/technology-embed/[grant]/calculate/route.ts",
    "blob": "04d90236a4b453325e19c14a56397c4b96507c59",
    "sha256": "bf2e949b220f90dc5eca883fd78f93373d4c8cc155c0ed423afb305c85a56f81"
  },
  {
    "path": "src/app/api/v1/technology/batch/route.ts",
    "blob": "e22a26772e6edd5834e151c859baed1c0379d558",
    "sha256": "4204d7aaa92f744ce49f0f307cb9da6b51699c8154873f38ac2e6a4187f4f374"
  },
  {
    "path": "src/app/api/v1/technology/calculate/route.ts",
    "blob": "bd8467a3e1e3af27812bd47f36ebc13044c44689",
    "sha256": "a1bfa26572d53c8909539a60aadea8b6e7ef4c6282f059046636c353b74e038a"
  },
  {
    "path": "src/app/business/api/page.tsx",
    "blob": "5fe101433c97dd6b26ca1747e0d64345b33fbc84",
    "sha256": "61db8cf167d1c727e1cae52f33c35e5e62b799cd30b3c8c0c66288c99fa056c3"
  },
  {
    "path": "src/app/business/page.tsx",
    "blob": "1583e8c953394645609f201dbb8918c97042dc33",
    "sha256": "9dd6577974cfd09cb821d9e3aaf26725ccc89b5f47fa58773010a1dd3f4d4911"
  },
  {
    "path": "src/app/business/projects/[id]/page.tsx",
    "blob": "e10077a017b7215f49789db7782a7419635d065c",
    "sha256": "91b2546a1469aa40bec4a042f21aa4560ca2c1bc0bef1a30d6013d3ddc970b2e"
  },
  {
    "path": "src/app/business/shared/[id]/page.tsx",
    "blob": "4b3b22f116c3b1460ae1175895c36b504d800cf3",
    "sha256": "e020d51eed26293dc846a5049a82b45489d178c8fb772a41b5b733bba04e29b3"
  },
  {
    "path": "src/app/embed/technology/[grant]/page.tsx",
    "blob": "ecb0eee3960a08a243e6cf7e2b42517ebe5f62fd",
    "sha256": "2d680c9e7dfbf5fbf444eb6c6b5d1d2991177ebb48235929fdcf5d7d7bdd09a5"
  },
  {
    "path": "src/components/calculator-interactive.tsx",
    "blob": "f21d8bb8b627639c0d55782478b786b1a763748d",
    "sha256": "c6296c137d66ab2a731f9144ab58efb3cb2f25dce2f7f31223b0b9a508d93755"
  },
  {
    "path": "src/components/technology-five-analysis.tsx",
    "blob": "29fdf234270b65f76100f2b15f27bd9e6a706a61",
    "sha256": "137ff472c20404e12e1e402c9c994cc75559f8f59bc54f70a8dd3bd6920fbc72"
  },
  {
    "path": "src/components/technology-five-delivery.tsx",
    "blob": "afa812a69636effd83aca02224d83c99adc4c630",
    "sha256": "1780cfb914e3c893e43d7493c81a727aaef12e706944536b3bec5322ccb53b22"
  },
  {
    "path": "src/components/technology-five-embed.tsx",
    "blob": "b31580ad6909194d62396815a14fc445dc640ae3",
    "sha256": "22b14b98203501372e3ef5b9b53977c2c4afc57cf8367e22b8d47d23dfe59e98"
  },
  {
    "path": "src/components/technology-five-share-form.tsx",
    "blob": "972a48ec512bf44ba9960365c1254f1b7d26ae3a",
    "sha256": "7ed40e28d9dbbba689e9fd71c5b935dffad49fc490f2249f8daf0a9c9cd3404d"
  },
  {
    "path": "src/components/technology-five-shared-comparison.tsx",
    "blob": "a46d530fc868b38600c5263264f68c86da70925a",
    "sha256": "21f8d4eb2cb0d455e420234e831f1754e9dba720d5497cd7cadc550982e4cefa"
  },
  {
    "path": "src/components/technology-next-analysis.tsx",
    "blob": "c40931952b18569fc25cf643d1568c148fb35468",
    "sha256": "4c1bb64adc75daf2e4702d75ab90525167e0666f780edef2476c7e35e4f87c61"
  },
  {
    "path": "src/components/technology-next-batch.tsx",
    "blob": "264e354d1c61a0aedd494eb8d7a21a7d312e1512",
    "sha256": "cded7113eb80c983e39c5ca3c5c50d099e8734a89a71f933dc1b980742b993ab"
  },
  {
    "path": "src/lib/business/technology-five-sharing-server.ts",
    "blob": "d7f0abbd8b5e65cfd7703e1ebf1f9b309a18508e",
    "sha256": "a87c59dffe1b61d9374533e10dfadee1c0d6758fb723ebd1ea4b105bac7abc43"
  },
  {
    "path": "src/lib/business/technology-five-sharing.ts",
    "blob": "9ad216738b6435d5086678f94a4b75bbdf7d2cde",
    "sha256": "c3bfc92d9931e6b52917ebe31a32e30e351aa363fcc2c229a0f88ed46cc95a18"
  },
  {
    "path": "src/lib/business/technology-next-sharing-server.ts",
    "blob": "2476a2d5d7fac92fd4046260e5b2ee4b1bedaab7",
    "sha256": "f31775fd30611577a9e2714c385b1277c1ab479f3cb5e53476c322bcb7bd8b40"
  },
  {
    "path": "src/lib/business/technology-next-sharing.ts",
    "blob": "748efaed09ddac09f65d8013859a7e8bf432b672",
    "sha256": "55fb98218fd867a88344fcaee43f546f010515f18114ac14e6d5f0c4d938545f"
  },
  {
    "path": "src/lib/draft-history-pagination.ts",
    "blob": "d688d9d6e95af32c67e82f8fb238fdf9ddf047ff",
    "sha256": "46d906eb07088af5c3a5f1cd184ba330036182983e6dc6b2bac71fb54283b5d4"
  },
  {
    "path": "src/lib/native-delivery/technology-five-catalog.ts",
    "blob": "064f6559f6282267cf87152b0873a30ef09e3cbc",
    "sha256": "9c043fbdb5cca8dbd3bc79ebc2356225551719b03e4dd495321ca7019d4a460d"
  },
  {
    "path": "src/lib/native-delivery/technology-five-contract.ts",
    "blob": "ed0ffd6908e681409d245ca360ebc0e0d5d00e3d",
    "sha256": "1df758ea71a6f86e4db51290e959ee305c8a426b497ba87ad97f7230f72c25cf"
  },
  {
    "path": "src/lib/native-delivery/technology-five-embed-request.ts",
    "blob": "6f7e496133491e8043f5e52d65a1ab5f55d6a4b5",
    "sha256": "953b96bcb7794ed70f2a883eb9946bb7858d1d6db565eaa8654f4cca80c20867"
  },
  {
    "path": "src/lib/native-delivery/technology-five-frame-policy.ts",
    "blob": "5d94bb8e05b76f527474c706a8bb8c8c7908209a",
    "sha256": "ae71ed0ca811c62c455cd2e7d99ddc01f87cf00e7223d20bf78d2af84bb48666"
  },
  {
    "path": "src/lib/native-delivery/technology-five-grant.ts",
    "blob": "d586304b762def8e94db21f55eeb2eb1c3abe673",
    "sha256": "f685409d2bb325d5c401e5444584021d7fc25ebd65f9364afa3aafcbd2ae3ee3"
  },
  {
    "path": "src/lib/native-delivery/technology-five-job-storage.ts",
    "blob": "9831531b3c87bdadd8146ce566451d86f140bdd1",
    "sha256": "32ae836e0ab3dfa6e3ce7bc82107e05bc89a031fe1c04f7e371b9f0ef11c32f0"
  },
  {
    "path": "src/lib/native-delivery/technology-five-jobs.ts",
    "blob": "eaa728320c467cb7b76b8ae750a725b68296d983",
    "sha256": "d64c696c07dace1c989c00dc041986c1b3a48b9fbb8f2c0a230385a4798c8569"
  },
  {
    "path": "src/lib/native-delivery/technology-five-metering.ts",
    "blob": "7b29472a6b83d33e2a31d695b6a9d6674890e31a",
    "sha256": "e613d9fe3c45933d123abea2f4b7a1d008f2eea4261deff480a2ea7f110ac3cf"
  },
  {
    "path": "src/lib/native-delivery/technology-five-publication.ts",
    "blob": "c37fd44b76b4c32f9387f62418dc17689abc7d22",
    "sha256": "82dac8f425f19b052626230a58fdfd3a077def95710f676c7a3c5bfa253ccda6"
  },
  {
    "path": "src/lib/native-delivery/technology-five-webhook-storage.ts",
    "blob": "0df2cc257de7050229dc8591c168e701319256de",
    "sha256": "4eff39b848cfbbd1f8680ffcf8c8f53b0cece568f46c1f63e3a1235ecdd87b73"
  },
  {
    "path": "src/lib/native-delivery/technology-five-webhook-transport.ts",
    "blob": "99ead59dfb6c0276469231cf2f86bc4f0dc8922b",
    "sha256": "9771e81edd8c3d3761339e7eebfab36b68cc448807662e526e1ea21b3635f43d"
  },
  {
    "path": "src/lib/native-delivery/technology-five-webhook-worker.ts",
    "blob": "55072e75b8246480639d842ded1a7cd05a71bdcf",
    "sha256": "9ea8e2235cce7924a58fffee2eaa8c5e71f4c0090fb80f3ced4ec734d15ecea1"
  },
  {
    "path": "src/lib/native-delivery/technology-native-schema.ts",
    "blob": "a884b7b019a69336f719cbde80ef52c69d7aef72",
    "sha256": "e1a7d88868b956857b9b66a5ed5a37066716ce42fd5f61d170a4e665853d008d"
  },
  {
    "path": "src/lib/native-delivery/technology-next-catalog.ts",
    "blob": "5a0e0ac3212df3e7b039feb8ccdb91a6a91fe716",
    "sha256": "6e6c0cdca34a7d084c3baeaa64e639aba790853ca2ef0ecfa17faae800369cc6"
  },
  {
    "path": "src/lib/native-delivery/technology-next-contract.ts",
    "blob": "59fdcf27155aa2d1355e938921ed9f0e5991a632",
    "sha256": "7d1958c83e1ae8ca1440304222433f9c58ff7455f757ac4d60bd4ccb15f4bee8"
  },
  {
    "path": "src/lib/scenario-set-recovery.ts",
    "blob": "a2d20491d8fe33ae38feca27a6f3bd5fe832cb37",
    "sha256": "5454b551650cdce18fb9ba2d0af78e777c233dcd9b41660a8e85f5bd28b1cd53"
  },
  {
    "path": "src/lib/storage-scenario-context.ts",
    "blob": "43df6bf717b3f509ce0bc2172edb71de75960006",
    "sha256": "6f076a49301c13598c7bb4cd730bdfe9199d669de1b16c4d94253b392cbb861c"
  },
  {
    "path": "src/lib/technology-current-presentation.ts",
    "blob": "129542639d2de6329be1b7c413d19e1301ed547f",
    "sha256": "57461c97356fa79a69bb3a8e4d3e1edd50c798a1f8fa9bed3da41d05f406d3c5"
  },
  {
    "path": "src/lib/technology-next-analysis.ts",
    "blob": "257b9818c43d053cdcc493c942b9896ec60afc96",
    "sha256": "7f9a698de33a9fbe87dafb758061fadb830af2722cf8bd06df258c037ff38784"
  },
  {
    "path": "src/lib/technology-next-batch.ts",
    "blob": "d237294823478072e1fee82dc041ffa5481ba602",
    "sha256": "e484171805140fb6ed95f31829d82217446fac6f34981994a183eaf76889a481"
  },
  {
    "path": "src/lib/technology-next-capture-trust.ts",
    "blob": "57c26c62aa91611d448fe6d32df07d49182c073f",
    "sha256": "7d26d1d359895f15bb8f0bdf121dcd23b2bfb3871842124ea8b951dee9e36e22"
  },
  {
    "path": "src/proxy.ts",
    "blob": "c86a0ffbf4fec60d7dead7e422fbd229e9eabb24",
    "sha256": "d33f443cd16136ec8ec402cd717db3896deee6c14728b568dbc691fc9b517599"
  }
]);
const immutableObjects=new WeakMap();
const hash=b=>createHash('sha256').update(b).digest('hex');
const git=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
export function verifyCurrentRuntimeContext(read=readFileSync,sourceGit=git){
 assert(currentContext.length>0,'Missing reviewed current runtime context');
 const head=sourceGit(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[a-f0-9]{40}$/);
 let objects=immutableObjects.get(sourceGit);if(!objects){objects=new Map();immutableObjects.set(sourceGit,objects);}
 const immutable=args=>{const key=JSON.stringify(args);if(!objects.has(key))objects.set(key,sourceGit(args));return objects.get(key);};
 for(const row of currentContext){assert.equal(immutable(['rev-parse',head+':'+row.path]).toString().trim(),row.blob,'Retained evidence current context object differs: '+row.path);const blob=immutable(['cat-file','blob',row.blob]);assert.equal(hash(blob),row.sha256,'Retained evidence current context Git bytes differ: '+row.path);assert(read(row.path).equals(blob),'Retained evidence current context target differs: '+row.path);}
}
export function retainedRuntimeBytes(path,read=readFileSync,sourceGit=git){
 const row=sources.find(source=>source.path===path);
 if(!row)return read(path);
 verifyCurrentRuntimeContext(read,sourceGit);
 const current=read(path);
 assert.equal(sourceGit(['rev-parse','HEAD:'+path]).toString().trim(),row.currentBlob,'Retained evidence current HEAD object differs: '+path);
 const blob=sourceGit(['cat-file','blob',row.currentBlob]);assert.equal(hash(blob),row.currentSHA256,'Retained evidence current Git bytes differ: '+path);
 assert(current.equals(blob),'Retained evidence current target bytes differ: '+path);
 const predecessor=sourceGit(['show',prior+':'+path]);assert.equal(hash(predecessor),row.priorSHA256,'Retained evidence predecessor bytes differ: '+path);
 return predecessor;
}
export function readRuntimeEvidenceFile(path,encoding){const bytes=retainedRuntimeBytes(path);return encoding===undefined?bytes:bytes.toString(encoding);}
