import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {verifyCallerSuccessor,verifyRetainedCallerSuccessor} from '../p0-decision-contracts/caller-successor.mjs';
const root=new URL('../../',import.meta.url);
const read=path=>readFileSync(new URL(path,root));
const git=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const claims={
 'src/app/business/page.tsx':'14b1181d3aaff740281badef0164125a0353082bf6fc9240a30bcbcf81cb5bca',
 'src/app/business/api/page.tsx':'9139a6fb155ae56b37b3b48738faf50197d1e3c5b1f7872391b53f495b2dcbc4'
};
// Separate literal review target; never inferred from verifier exports or labels.
const independentlyReviewedSources=Object.freeze([
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
    "blob": "8639153d02a282d86462c1889feb2815d77c4ad8",
    "sha256": "ea32badd3a5e4049963747ea018f5b399bb9a1953053dab03d88150f14423db4"
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
    "blob": "45e102f0d97e8db360dc2a09efcb0e3867df8275",
    "sha256": "af625bb001afe2cc52eea383f6e6462a5eb728b74de321f84d436611729ea5ad"
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
    "blob": "8fcded87df1e3772e944203656088093ea5b5b9a",
    "sha256": "0928d46624a3764c7e141e0984b26f3f93dc132522441e7c179b63f81ffc7444"
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
    "blob": "5e5ea359d83c158d1a321c35f4bb53bb02c79ce4",
    "sha256": "e4c40c9d4eb571c265d7024d3b95888c13b10714a98b421bfbe93930c7bc30ab"
  },
  {
    "path": "src/lib/draft-history-pagination.ts",
    "blob": "d688d9d6e95af32c67e82f8fb238fdf9ddf047ff",
    "sha256": "46d906eb07088af5c3a5f1cd184ba330036182983e6dc6b2bac71fb54283b5d4"
  },
  {
    "path": "src/lib/native-delivery/technology-five-catalog.ts",
    "blob": "a1f1e07b6ae9b544f4743c99d559b857772ad802",
    "sha256": "fcc6b45bae08481719169304e78b09c93c4c7d5eb516b22fb003dbf7a45afcfd"
  },
  {
    "path": "src/lib/native-delivery/technology-five-contract.ts",
    "blob": "adbdc167575c5dbf969c412c80f6fd0dfc3824f6",
    "sha256": "893eddce635142c343a5b0a050b13c526eede4644fa11f30c0939c5f6da7b15d"
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
    "blob": "288f61953cf42c53668973c36eea6de4c15d5d84",
    "sha256": "473de779e987cf101311ff5b1d189c818b8101b625216c9e1109a9c57823ea32"
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
test('retained P0 validator preserves its complete exact original source and frequency proof',()=>{
 const retained='tests/p0-decision-contracts/caller-successor-retained.mjs';
 assert(read(retained).equals(git(['show','9fe66f65cd7da2536f9f2f21d32fbc771bee0892:tests/p0-decision-contracts/caller-successor.mjs'])));
 const path='src/app/business/api/page.tsx',original=git(['show','a9f17d4f010355eb490318c3a868d445bf38f72f:'+path]);
 verifyRetainedCallerSuccessor(path,original,claims[path]);
 assert.throws(()=>verifyRetainedCallerSuccessor(path,Buffer.concat([original,Buffer.from('tamper')]),claims[path]),/Exact draft-safety caller successor/);
});
test('independent current source objects require concrete reviewed UI paths and exact HEAD bytes',()=>{
 for(const path of Object.keys(claims))assert(independentlyReviewedSources.some(source=>source.path===path),'Missing independent current source '+path);
 assert.equal(new Set(independentlyReviewedSources.map(source=>source.path)).size,independentlyReviewedSources.length);
 for(const source of independentlyReviewedSources){assert.equal(git(['rev-parse','HEAD:'+source.path]).toString().trim(),source.blob);assert.equal(hash(git(['cat-file','blob',source.blob])),source.sha256);assert.equal(hash(read(source.path)),source.sha256);}
});
for(const [path,claim] of Object.entries(claims)){
 test('current Business UI requires exact current tracked source '+path,()=>assert.equal(verifyCallerSuccessor(path,read(path),claim),true));
 test('current Business UI rejects changed bytes and rewritten historical claims '+path,()=>{const changed=Buffer.concat([read(path),Buffer.from('tamper')]);assert.throws(()=>verifyCallerSuccessor(path,changed,claim),/Exact draft-safety caller successor/);assert.throws(()=>verifyCallerSuccessor(path,changed,hash(changed)),/Original decision caller binding/);});
 test('current Business UI rejects historically valid source reversion '+path,()=>{const previous=git(['show',(path.endsWith('/api/page.tsx')?'a9f17d4f010355eb490318c3a868d445bf38f72f':'b1c606efd06930ae8363e98aa369298ed0c404aa')+':'+path]);assert.throws(()=>verifyCallerSuccessor(path,previous,claim),/Exact draft-safety caller successor/);});
 test('current Business UI requires actual HEAD object identity and available Git provenance '+path,()=>{assert.throws(()=>verifyCallerSuccessor(path,read(path),claim,read,()=>{throw Error('Missing Business source Git provenance');}),/Missing Business source Git provenance/);assert.throws(()=>verifyCallerSuccessor(path,read(path),claim,read,args=>args[0]==='rev-parse'&&args[1].startsWith('HEAD:')?Buffer.from('0'.repeat(40)):git(args)),/current HEAD source object differs/);});
}
for(const source of independentlyReviewedSources)test('current Business proof rejects dependency drift '+source.path,()=>{
 const path='src/app/business/api/page.tsx';
 assert.throws(()=>verifyCallerSuccessor(path,source.path===path?Buffer.from('tamper'):read(path),claims[path],name=>name===source.path?Buffer.from('tamper'):read(name)),/current target bytes differ/);
});

test('automation integration rejects the previously reviewed valid66 API page without rewriting its source packet',()=>{
 const path='src/app/business/api/page.tsx';
 const packetBytes=read('docs/publication-workflows-20261109/source-successors/business/source-capture.json');
 assert.equal(hash(packetBytes),'4626d70e90e65d3164925e8adcb0386e4779941cc324ba33d886dda0423d65a9');
 const old=JSON.parse(packetBytes).records.find(row=>row.path===path);
 const previous=read('tests/publication-workflows-20261109/fixtures/business-api-66a8.fixture');
 assert.equal(hash(previous),old.sha256);
 assert.throws(()=>verifyCallerSuccessor(path,previous,claims[path]),/current target bytes differ/);
});
