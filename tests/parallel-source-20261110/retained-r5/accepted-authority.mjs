/** Independent literal pin for installed R4 authority, never chosen by candidate data. */
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {createHash} from 'node:crypto';
export const reviewedSourceCommit='0ab51febb4b2985cdaae1d822f444c71e846d61d';
const accepted=Object.freeze([
  {
    "path": "tests/next-five-20261110/source/fixed-anchor.mjs",
    "blob": "beff85ff82e87879abf5fd203fb3e6d112c029c3",
    "sha256": "ba3577c7549e075ab09fa0220f669b257e775e1a855a0f70eed4b2df1d78f510"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-current-anchor.mjs",
    "blob": "cb44e478fae1391b4cae39ac95a5d196b5bdeaf9",
    "sha256": "c73114f011685d640bda5c1ae857b0c98dfb0e14fda7744f2b0c016eb9e4fc9d"
  },
  {
    "path": "tests/next-five-20261110/source/current-proof.mjs",
    "blob": "79ba518669e2f810b6db8a528a84adcd41a587a0",
    "sha256": "14a23b2ed85129fa3ff302f77a5d0f19043f9c591a6188cc768a9dcda98e08ea"
  },
  {
    "path": "tests/next-cohort-20261110/source/current-caller-stage.mjs",
    "blob": "67eefee71a8e18406bd704502a7b0c5dbd4c6e38",
    "sha256": "e9a105cf49ab4862c9178b517312d518d4a0f8a71133b4e52ecae8110845a71a"
  },
  {
    "path": "tests/next-cohort-20261110/source/current-anchor.mjs",
    "blob": "46a4d6f5b0630bdf82427edb43a1c2bffd4e179d",
    "sha256": "a6145b2eb161aac5c5bb773ba8419281871e5faef345b8280ed2ce02cb536306"
  },
  {
    "path": "tests/next-five-20261110/source/retained-r3-stage.mjs",
    "blob": "b2fe64fd1170a947bcd6f9e75b3f2e967898c698",
    "sha256": "95b5c47d9b88f9b202045b0113a5c1d8b3298e2592ac47091767cdd09b316c17"
  },
  {
    "path": "tests/next-five-20261110/source/retained-r3-anchor.mjs",
    "blob": "3d7f3a0e3f3f67e6e8340ba11c10b91957645b88",
    "sha256": "2f92fd4568a085c7bc54de8b340c5215490bee58bc4bdb74dc9afcd934fb02ca"
  },
  {
    "path": "tests/next-five-20261110/retained23-proof.mjs",
    "blob": "b656f3cd02472a01f6e789a2409a7203d86cbb21",
    "sha256": "01f21cb3a513115ba7a9b4e34c5cac69a595a41ddac48f06622bee60a2001587"
  },
  {
    "path": "tests/next-five-20261110/retained23-proof.d.mts",
    "blob": "b65a565e898eb59fb1a39b406a7b6124fa3f80ff",
    "sha256": "c628c13ebcce6dc975a72148695c4f024c35b4dc2d9fdeff92a5931cb8e33670"
  },
  {
    "path": "src/lib/next-cohort-evidence.test.ts",
    "blob": "73355ad338bc56f71d8df2f93924e6876874a44b",
    "sha256": "2e4287b3efe6ca868ad1602dc01dc63266a7e94115f4caf6ab4bfe992ccfd7c2"
  },
  {
    "path": "src/lib/remaining-five-evidence.test.ts",
    "blob": "4199af29e38c8de257cc5ef6b363258c5b58883c",
    "sha256": "3126d42c4e6e254614ff7625b95110c0f09b3b43f7a38b12b5e1fd983ae5f158"
  },
  {
    "path": "tests/p0-decision-contracts/next-five-runtime-successor.test.mjs",
    "blob": "25927857a6a5882880a34403a394e8232c46a261",
    "sha256": "2cc1ee1f396f0591027550ccaf368d475f46876c0836b4340b977e91469dcb70"
  }
]);
const sourceGit=args=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024});
export function verifyAcceptedR4Authority(read=readFileSync,git=sourceGit){
 assert(accepted.length>0,'Independent reviewed R4 authority is not installed');
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[a-f0-9]{40}$/,'Independent R4 authority provenance differs');
 for(const record of accepted){assert.equal(git(['rev-parse',head+':'+record.path]).toString().trim(),record.blob,'Independent R4 authority object differs');const bytes=git(['cat-file','blob',record.blob]);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256,'Independent R4 authority Git bytes differ');assert(read(record.path).equals(bytes),'Fixed next caller target bytes differ; Independent current target bytes differ: '+record.path);}
 return true;
}
