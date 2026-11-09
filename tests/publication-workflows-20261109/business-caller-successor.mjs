/** Reviewed current UI bytes only; no writer, role, schema or publication adoption. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {verifyCallerSuccessor as verifyRetainedCallerSuccessor} from '../p0-decision-contracts/caller-successor-retained.mjs';
export const businessCallerPaths=Object.freeze(['src/app/business/page.tsx','src/app/business/api/page.tsx']);
const historical={
 'src/app/business/page.tsx':{commit:'b1c606efd06930ae8363e98aa369298ed0c404aa',blob:'4d228d04b012423875af5a203763264aa0433dee',sha256:'14b1181d3aaff740281badef0164125a0353082bf6fc9240a30bcbcf81cb5bca'},
 'src/app/business/api/page.tsx':{commit:'b1c606efd06930ae8363e98aa369298ed0c404aa',blob:'28802b1b1655421ba90dbd3c78aa54d893d9e851',sha256:'9139a6fb155ae56b37b3b48738faf50197d1e3c5b1f7872391b53f495b2dcbc4'}
};
// Exact immutable blobs from the frozen application capture, independently
// reviewed for this current source stage; no calculator approval is implied.
const currentSources=Object.freeze([
  {
    "path": "src/app/api/business/technology-embeds/route.ts",
    "blob": "2605175172cddedf0d54172c50ee691ac2447b0a",
    "sha256": "7a53c8d5aa5cda67c766be654d2f730de5053d7cbff9cbe925572a50feb87183"
  },
  {
    "path": "src/app/api/business/technology-five-shares/route.ts",
    "blob": "1172bc2e1c727f757ae9a6d42d17ccd5f412db6a",
    "sha256": "424b0bb4b18285f0ddc5c2595ce44c1333f3769336a7d77dd79f5f543aabea02"
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
    "blob": "49609b0fe469029b1ad0896da4a850cb6823b337",
    "sha256": "b40b03b4f1eb40ca58f8ca680580bdb07c91be4c5e1bc5cbf595ad5033ba3236"
  },
  {
    "path": "src/app/business/page.tsx",
    "blob": "1583e8c953394645609f201dbb8918c97042dc33",
    "sha256": "9dd6577974cfd09cb821d9e3aaf26725ccc89b5f47fa58773010a1dd3f4d4911"
  },
  {
    "path": "src/app/business/projects/[id]/page.tsx",
    "blob": "b192f124fa479a49f0705d820dca464b23c2a1d4",
    "sha256": "6184d508becee7a7b441e310cd28d04af2c88fdc7e45716c78440030d5f45ec8"
  },
  {
    "path": "src/app/business/shared/[id]/page.tsx",
    "blob": "5df917f847cd38d22ba3693d958b5387f220da6f",
    "sha256": "bb6a888c9a9c1bcad3d36bbf6f924b9e372324a48243af1842bd7e9c04ca8a1f"
  },
  {
    "path": "src/app/embed/technology/[grant]/page.tsx",
    "blob": "ecb0eee3960a08a243e6cf7e2b42517ebe5f62fd",
    "sha256": "2d680c9e7dfbf5fbf444eb6c6b5d1d2991177ebb48235929fdcf5d7d7bdd09a5"
  },
  {
    "path": "src/components/technology-five-delivery.tsx",
    "blob": "8f4fb84f49912a6778037342bca560361debc249",
    "sha256": "d6d4b90c8d07e395c03e356d789fe31d76c166fa86b2c2df578b15f0bcb1b1c1"
  },
  {
    "path": "src/components/technology-five-embed.tsx",
    "blob": "407a1a6b6bb2585fbea9c9b506cb5bba77212c68",
    "sha256": "5fa2686c41f1fccd73f6b669a5c7e751a5cbdc201cc4c2209402d90dad97482e"
  },
  {
    "path": "src/components/technology-five-share-form.tsx",
    "blob": "26e6f534e5c2a6e2f2ed85e8bf76af51625b9e9e",
    "sha256": "93f0039d5fda3fe8fbef21c2e153fbb7beaa94468a66620f5e54e9c9871ebb78"
  },
  {
    "path": "src/components/technology-five-shared-comparison.tsx",
    "blob": "7974e8aef2dadc65f9ac51f7b529deb3fa0a8772",
    "sha256": "90fed180975a18bb6a3e7bce85b6a2514c90ef143144250e0574a7fb8b2b1c91"
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
    "path": "src/lib/draft-history-pagination.ts",
    "blob": "d688d9d6e95af32c67e82f8fb238fdf9ddf047ff",
    "sha256": "46d906eb07088af5c3a5f1cd184ba330036182983e6dc6b2bac71fb54283b5d4"
  },
  {
    "path": "src/lib/native-delivery/technology-five-catalog.ts",
    "blob": "d8ee6e7b7bf7d4fca972649ab9bbed8be9ef4dad",
    "sha256": "b3e88df8cd5458b8ec42fa424aff822407d34379e5f7f43354e1a0e2749e8854"
  },
  {
    "path": "src/lib/native-delivery/technology-five-contract.ts",
    "blob": "0c74e3599a4cbecae6e229a15c3298de286f013f",
    "sha256": "cab680f4b3429f7631d7c655971db6607d488e2d94590d98015a5b233ecabe4a"
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
    "blob": "652ac1ba00d49f2324635f2a33615abd6b63662e",
    "sha256": "6e1a32f28790efdd8510b731693359822d6191f7fa348b0967d5e06234ad9eee"
  },
  {
    "path": "src/lib/native-delivery/technology-five-job-storage.ts",
    "blob": "9831531b3c87bdadd8146ce566451d86f140bdd1",
    "sha256": "32ae836e0ab3dfa6e3ce7bc82107e05bc89a031fe1c04f7e371b9f0ef11c32f0"
  },
  {
    "path": "src/lib/native-delivery/technology-five-jobs.ts",
    "blob": "8290635ce04e86b7211d78c2d682e25bc96350db",
    "sha256": "a30a1f516bddb2b6b7fbd428ee9f957c473126b121fc9bf5b0b6ad4d403deb5b"
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
    "path": "src/proxy.ts",
    "blob": "c86a0ffbf4fec60d7dead7e422fbd229e9eabb24",
    "sha256": "d33f443cd16136ec8ec402cd717db3896deee6c14728b568dbc691fc9b517599"
  }
]);
const root=new URL('../../',import.meta.url);
const hash=bytes=>createHash('sha256').update(bytes).digest('hex');
const readSource=path=>readFileSync(new URL(path,root));
const sourceGit=args=>execFileSync('git',args,{cwd:root,stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
export function verifyCurrentBusinessCaller(path,bytes,claimedHistoricalHash,read=readSource,git=sourceGit){
 assert(businessCallerPaths.includes(path),'Explicit current Business caller required');
 const previous=historical[path];
 assert.equal(claimedHistoricalHash,previous.sha256,'Original decision caller binding');
 assert.equal(git(['rev-parse',previous.commit+':'+path]).toString().trim(),previous.blob,'Historical Business source object differs');
 assert.equal(hash(git(['cat-file','blob',previous.blob])),previous.sha256,'Historical Business source bytes differ');
 if(path==='src/app/business/api/page.tsx')verifyRetainedCallerSuccessor(path,git(['show','a9f17d4f010355eb490318c3a868d445bf38f72f:'+path]),claimedHistoricalHash);
 // Only literal independently reviewed records select current source identity.
 assert(currentSources.some(source=>source.path===path),'Exact draft-safety caller successor: missing reviewed current source');
 for(const source of currentSources){
  assert.equal(git(['rev-parse','HEAD:'+source.path]).toString().trim(),source.blob,'Exact draft-safety caller successor: current HEAD source object differs');
  const expected=git(['cat-file','blob',source.blob]);
  assert.equal(hash(expected),source.sha256,'Exact draft-safety caller successor: current Git bytes differ');
  const actual=source.path===path?Buffer.from(bytes):read(source.path);
  assert(actual.equals(expected),'Exact draft-safety caller successor: current target bytes differ: '+source.path);
 }
 return true;
}
