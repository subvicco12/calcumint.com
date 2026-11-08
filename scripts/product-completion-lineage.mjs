/** Exact test/presentation successors; no mathematical or certification approval. */
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
const bindings=[
  {
    "path": "src/calculators/finance/compound-interest.test.ts",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "40097d77fb84dca53207534d528e7ed8f888b99a",
    "predecessorBlob": "e765f88bb6e044c5ac435219c3274aac862556d3",
    "successorBlob": "7db9bd7c2d375d2af0df6a26a1664ef877c6ff5c",
    "predecessorSHA256": "9a27c9647e5f862950db6ba9146fc6ec2431c92b14680377ee8cf5a38b6e9ef1",
    "successorSHA256": "fa94cbe3a73c8cfb9c608a028150d61b3dd9f0a5f902b01a96d98ec063f98343"
  },
  {
    "path": "src/components/full-six/candidate-workbench.tsx",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "e5542ff7e60351e46a352cebd12210b498d5ad00",
    "predecessorBlob": "d88adcfd7720525f4f961c59ab97eb5681d0d544",
    "successorBlob": "c940bb22c1255fbbf1dc7ddb99436762e2cc7cf2",
    "predecessorSHA256": "b83e078d3d5a5701d29673c30548a9fff35f155d23d6d6f6f3019a5c3ebf37d8",
    "successorSHA256": "18648add28ee8a25849d7e9025ff42791dcdbfa29043150337cc53f24701bc50",
    "intermediateSources": [
      {
        "ref": "4c0f33f290fc64cd17df984816f6e075bc146532",
        "blob": "8b2af39e33be7eb65be3728f72c74dc26b159526",
        "sha256": "dd73799575a00c1a02fd8b138f0611c58525fc94f534cf89110fd75c0138f4db"
      },
      {
        "ref": "154d28f5d879856b02636c192ea2a81f334e7836",
        "blob": "b1c67797cead938c3af7b5d37b0fa15a5b15784e",
        "sha256": "3b2481dc4a4c9ec39857da730ea4ee087b08228601872342ffe2b1ec8b70a2b7"
      }
    ],
    "supplementalSources": [
      {
        "path": "src/lib/full-six/candidate/scenario-comparison.ts",
        "ref": "e5542ff7e60351e46a352cebd12210b498d5ad00",
        "blob": "435b6e2537a3d6d0154ee576f51dbd80b12bda68",
        "sha256": "fe18e9d55edbda907b93e014a314c8e63968276e859a9a3acc6f50737c2e52c4"
      },
      {
        "path": "src/components/full-six/candidate-scenario-comparison.tsx",
        "ref": "e5542ff7e60351e46a352cebd12210b498d5ad00",
        "blob": "a41456a8ceb632bfe0dad64beb7f5e37c7539652",
        "sha256": "5346ef207b92e7cb21fb489c4f9576e93f823620841ba8d17978f72e871b7e7f"
      }
    ]
  },
  {
    "path": ".github/workflows/ci.yml",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "e5542ff7e60351e46a352cebd12210b498d5ad00",
    "predecessorBlob": "938281abbbf9bbea928d6844d71b06f9dc423f7f",
    "successorBlob": "2b83bd30acf6dfd091f8a7532b5b97ad6ecfd476",
    "predecessorSHA256": "6556a6d89c583ea1bb8ccd82ff47f379606850399da7600b59e274567b6d0416",
    "successorSHA256": "b8c9d0eece648d72f20390b0a33b3f02ef972c7ec880a91a97f7ece4f2e27c8f",
    "intermediateSources": [
      {
        "ref": "fb2531218dbf71e1116dbc90fc17367692213bdc",
        "blob": "81f68542a0757edffc604a30f8ad99df8d00b65d",
        "sha256": "68e4dc64f8edcea69bdc1c56d3666f82f1ed1d113954dc548801293ea0daacfa"
      },
      {
        "ref": "154d28f5d879856b02636c192ea2a81f334e7836",
        "blob": "d5f2177aefa880af46cdf37d9f67dd12d26d8332",
        "sha256": "e7b9610f21acc7eef52c032a034b2af89e72eeef62b0e3037ec4dbaa59b865df"
      },
      {
        "ref": "a342492a6da420b64a2cf63aa2ef8d8496633def",
        "blob": "f7ab19ff8905da2544d01165acaffd7f596aab14",
        "sha256": "28c35736999fd50d6e5f4cab98c56cc08d2c73eff39e1ea8da74c682d312d951"
      }
    ]
  },
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "40097d77fb84dca53207534d528e7ed8f888b99a",
    "predecessorBlob": "7ece608dadea02c3c668623d80931c2598829e99",
    "successorBlob": "a9a69fed092d47e1e1273a79c3c520fb4ae32716",
    "predecessorSHA256": "64368f3b10b838bea51ee4a53f4b0e89b0b2828654ef84f2cd9e68825344367e",
    "successorSHA256": "1541d7d337eaa27545276cd29a09220a78b4a0cfb41660fd31f89699fa372722"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "e5542ff7e60351e46a352cebd12210b498d5ad00",
    "predecessorBlob": "dac8a031f378cf4a9f218b1498a20df654f24624",
    "successorBlob": "38e2fc0045f9d53f29c14e9d1f3f1153fff274c2",
    "predecessorSHA256": "aaf61d46b2bfbc317642b3f18f88289230dda610334744835fc632511b563be3",
    "successorSHA256": "2daa2a1cc7a64dc065accbbc5964796302926ea6d1dcf45c2c315902176f7978"
  },
  {
    "path": "src/calculators/source-acceptance-evidence.test.ts",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "685aefc70066d3f95562b3c90b9af58ab857812c",
    "predecessorBlob": "28ebceb093778a2e1e2153529a7f0ba4dcbb615f",
    "successorBlob": "4e3c70a83144ab6b4d6aa34417ec9de656b87045",
    "predecessorSHA256": "9e507e33364953a3cdc0a5391004d66be100556238bfe5b700ac7677cedf3ea9",
    "successorSHA256": "559b719ccb62849b6c91a9215efb7ea6841d4bbc8144cc55e3fab82179618fa0"
  },
  {
    "path": "src/calculators/source-driven-evidence.test.ts",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "fdd2e943328e175cb40b29cb546391bec2e06f3d",
    "predecessorBlob": "292d0863e5a1c81510ff7c0ffe911f8b03d951be",
    "successorBlob": "73c1243e04d84f3988002568700fb44ebc0e3152",
    "predecessorSHA256": "e3ecbcb0cdde1dc8e42cac893d3fe9b046336a4c87adb48da15fa70fbc25a555",
    "successorSHA256": "ca068fa7bd87f3119a8aaeb6bc86995d3cc05281f338bfcc51e3e9aa717525a0"
  }
];
export const completionSourceRefs=Object.freeze([...new Set(bindings.flatMap(b=>[b.predecessorRef,b.successorRef,...(b.intermediateSources??[]).map(m=>m.ref),...(b.supplementalSources??[]).map(m=>m.ref)]))]);
const hash=b=>createHash('sha256').update(b).digest('hex');
export function verifyCompletionBinding(name,bytes,claim,git,read=readFileSync){
 const b=bindings.find(x=>x.path===name);if(!b)return false;
 if(claim!==b.predecessorSHA256)throw Error('Completion predecessor claim differs: '+name);
 for(const dep of b.supplementalSources??[]){
  if(git(['rev-parse','--verify',dep.ref+'^{commit}']).toString().trim()!==dep.ref)throw Error('Completion supplemental source revision unavailable');
  if(git(['rev-parse',dep.ref+':'+dep.path]).toString().trim()!==dep.blob)throw Error('Completion supplemental source object differs');
  const source=git(['cat-file','blob',dep.blob]);
  if(hash(source)!==dep.sha256||!read(dep.path).equals(source))throw Error('Completion supplemental source bytes differ: '+dep.path);
 }
 for(const middle of b.intermediateSources??[]){
  if(git(['rev-parse','--verify',middle.ref+'^{commit}']).toString().trim()!==middle.ref)throw Error('Completion exact source revision unavailable');
  if(git(['rev-parse',middle.ref+':'+name]).toString().trim()!==middle.blob)throw Error('Completion intermediate source object differs');
  if(hash(git(['cat-file','blob',middle.blob]))!==middle.sha256)throw Error('Completion intermediate source bytes differ');
 }
 for(const stage of ['predecessor','successor']){
  const ref=b[stage+'Ref'];if(git(['rev-parse','--verify',ref+'^{commit}']).toString().trim()!==ref)throw Error('Completion exact source revision unavailable');
  const blob=git(['rev-parse',ref+':'+name]).toString().trim();if(blob!==b[stage+'Blob'])throw Error('Completion source object differs');
  const source=git(['cat-file','blob',blob]);if(hash(source)!==b[stage+'SHA256'])throw Error('Completion source bytes differ');
  if(stage==='successor'&&(!bytes.equals(source)||hash(bytes)!==b.successorSHA256))throw Error('Completion current successor differs');
 }return true;
}
