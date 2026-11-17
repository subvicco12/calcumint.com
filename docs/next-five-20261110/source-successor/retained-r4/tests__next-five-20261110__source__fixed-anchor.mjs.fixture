/** Literal authority is populated only after separate source-object review. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const fixed=Object.freeze([
  {
    "path": "tests/acceptance-closure-20261108/converter-final-source.test.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "7c69021c8cf584823d96c0cfa26a4b7b7c5c8a3d",
    "sha256": "122ac5c5db0884964a7a319ea8f2e62212019cea6088379464dd04bb5a510721"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "fc7294a3d969d22125ba334a625decdea6b5faaf",
    "sha256": "7079a9f3aeb36ea93a2ecf3d48bc1cd3bcfcbfb92d82f0e17091accf010e5318"
  },
  {
    "path": "tests/next-cohort-20261110/source/current-caller-stage.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "67eefee71a8e18406bd704502a7b0c5dbd4c6e38",
    "sha256": "e9a105cf49ab4862c9178b517312d518d4a0f8a71133b4e52ecae8110845a71a"
  },
  {
    "path": "tests/publication-workflows-20261109/source-evolution.test.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "7fd4f8575858836e7bb3eaa3d4fcd68715dba84e",
    "sha256": "405f1536d959a4e3bd2d42ad0db44bc5a87f3d8571cde8b054bdba1e72d3ed6e"
  },
  {
    "path": "tests/first-five-20261109/crossed-dependency-source.test.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "9ce252f0af27da8700b3990cd8e443548229f114",
    "sha256": "d512b20bd0074d20ac8d525d7766ecbbaf5379fb42184346a90a53b89763ab2e"
  },
  {
    "path": "tests/next-cohort-20261110/source/caller-stage.test.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "bb31e36f092cb96f377aa622091f9ae1a36de34e",
    "sha256": "8dfd3d137a0ee90d5f490077297ab0b7a2da08ae3eea74570f3214d7dc4a6dde"
  },
  {
    "path": "tests/next-cohort-20261110/source/current-anchor.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "46a4d6f5b0630bdf82427edb43a1c2bffd4e179d",
    "sha256": "a6145b2eb161aac5c5bb773ba8419281871e5faef345b8280ed2ce02cb536306"
  },
  {
    "path": "tests/next-five-20261110/source/current-proof.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "aead1fb7b5c1c8b21e194f06db513d8895e908c9",
    "sha256": "ee4442137cf51f286eb59718489de263be4935d1ffbccfdb2b0074ed7277746f"
  },
  {
    "path": "tests/next-five-20261110/source/retained-r3-stage.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "b2fe64fd1170a947bcd6f9e75b3f2e967898c698",
    "sha256": "95b5c47d9b88f9b202045b0113a5c1d8b3298e2592ac47091767cdd09b316c17"
  },
  {
    "path": "tests/next-five-20261110/source/retained-r3-anchor.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "3d7f3a0e3f3f67e6e8340ba11c10b91957645b88",
    "sha256": "2f92fd4568a085c7bc54de8b340c5215490bee58bc4bdb74dc9afcd934fb02ca"
  },
  {
    "path": "tests/next-five-20261110/source/current-proof.test.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "06308731a43e145e1e1a57aa373f680d6053e443",
    "sha256": "5add50f976097fab19049666009fa12ef98ec8f573a87647bf614bec7bddeb94"
  },
  {
    "path": "tests/next-five-20261110/source/accepted-authority.test.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "89ef04636e8ec04252a8e1548954276f6eae2451",
    "sha256": "5bfe5130c9591e2ba82d745c76074b66314d58942b310b32c40b0a72c70dfbb6"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "4b488298de35c71ed419be2be3b2e30f6e747075",
    "sha256": "fca71854793c8f3b20b78353235e189b60fb126c2612b36db99237600608e5d2"
  },
  {
    "path": "tests/publication-workflows-20261109/business-caller-successor.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "3d736175a89005d6aa8335eba0bded7ffd35f157",
    "sha256": "380491a4aa852e55ef55af81e48c961b6ec4cb99e79d5a97d561c10ca89860c3"
  },
  {
    "path": "tests/publication-workflows-20261109/business-source-successor.test.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "67a22430a96d2ab5c3e7c2be3e001d2d9448f6b3",
    "sha256": "05643023df5023cb75569b53ee22808567059c9b48381641e41e16bf2e44d369"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.test.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "36af9595c81f7b69619e5392b5b7d5dc612149bf",
    "sha256": "6195b73331f1247961200eb39d9ad68278bbd17409b4231d4b0e6170045f5d49"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.d.mts",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "af83c9b6b3dfe44707cebccd93b5c8178d489909",
    "sha256": "c1300e0c0eaf273fc455dcee6794ef3ed227635f8ddb1ec64a017db177ce0748"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "20658ed565a31a389d3aaac1a21abb68b851e942",
    "sha256": "1efda4fdcfeb758603e9d2c546a243c3f2684a421d4c071a77624c98677c3313"
  },
  {
    "path": "tests/p0-decision-contracts/next-five-runtime-successor.test.mjs",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "25927857a6a5882880a34403a394e8232c46a261",
    "sha256": "2cc1ee1f396f0591027550ccaf368d475f46876c0836b4340b977e91469dcb70"
  },
  {
    "path": "tests/next-five-20261110/retained23-proof.d.mts",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "b65a565e898eb59fb1a39b406a7b6124fa3f80ff",
    "sha256": "c628c13ebcce6dc975a72148695c4f024c35b4dc2d9fdeff92a5931cb8e33670"
  },
  {
    "path": "src/lib/next-cohort-evidence.test.ts",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "73355ad338bc56f71d8df2f93924e6876874a44b",
    "sha256": "2e4287b3efe6ca868ad1602dc01dc63266a7e94115f4caf6ab4bfe992ccfd7c2"
  },
  {
    "path": "src/lib/remaining-five-evidence.test.ts",
    "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
    "blob": "4199af29e38c8de257cc5ef6b363258c5b58883c",
    "sha256": "3126d42c4e6e254614ff7625b95110c0f09b3b43f7a38b12b5e1fd983ae5f158"
  }
]);
const captureSHA256='eb8aa3bd7311ad5e1839b8880f79c9ff65534c588925a652329c4cca61178fe7';
export function verifyFixedR4Anchor(capture,read,git){
 assert(fixed.length>0,'Reviewed R4 source authority is not installed');
 assert.equal(createHash('sha256').update(JSON.stringify(capture)).digest('hex'),captureSHA256,'Fixed R4 capture differs');
 for(const path of ['tests/publication-workflows-20261109/current-source-evolution.mjs','tests/publication-workflows-20261109/accepted-current-source-guard.mjs','tests/first-five-20261109/accepted-evolution-guard.mjs'])assert(read(path).equals(git(['show','1ec63cd11626df15063546c7e5bfedecec33f6ee:'+path])),'Historical fixed source anchor changed: '+path);
 for(const row of fixed){assert.equal(git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref);assert.equal(git(['rev-parse',row.ref+':'+row.path]).toString().trim(),row.blob);const bytes=git(['cat-file','blob',row.blob]);assert.equal(createHash('sha256').update(bytes).digest('hex'),row.sha256);assert(read(row.path).equals(bytes),'Fixed next caller target bytes differ; Independent current target bytes differ: '+row.path);}
 return true;
}
