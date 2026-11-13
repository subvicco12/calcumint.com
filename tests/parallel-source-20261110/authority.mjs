/** Filled only after independent review of an actual committed candidate. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
// Independently reviewed immutable cold prerequisites; populated after freezing pair code.
export const additionalBootstrapPairProducer='e1db536aa4f46b07fadcbf3fcadb92ff8dcb59da';
export const additionalStage6BootstrapRefs=Object.freeze([
  "0180f2f3c70e16f2a26972a74b32d672c468e2ef",
  "0213788bec5fddf89e72d5c4abe2a10f799f5c50",
  "022a22bd84687c0197e4c362b33fea4da4f4876f",
  "02d1a7eac0d7853197a4410520f548f0ce8b335f",
  "07868e7a9a062ba796d0fbabfbe61918840a90b5",
  "07cea5ec95b83134f71245100a1d04ef7db862cf",
  "0940648d05dce0d53788aac7f66e852936cb0bd2",
  "0b0e9c25c888463d2bbe5937eb1059cf10cdf7b8",
  "0b40146584ebb8ac99cb1d0c65ff6e0442c37a4a",
  "0cc135444d449a8e251ea23bbf7ce199743b0127",
  "0e809980b294368584e1aa6340c3155c98440851",
  "0e86e1cfbda14afcef6945c80e6eef3292ea4289",
  "13d5ea4adcee1814ba9973c3525a05ac3d809744",
  "16cb2804fa3e9731a7f39a761de9a7a27ee87e67",
  "17982a51eb164314bd01c22aa1c2768aced52bd9",
  "18fc0bdc24c81b36588c708eac284bc991379b53",
  "1c48fe0852f35a45ce4b6fa1a2f2c05983d1fda2",
  "1d228dd49d54ff275c6bbbf58a625407abc0b948",
  "1ec2b50f5beb321e4577fe1fb7f20325d62901fd",
  "224b9f6684d7e27a923c69d140ddc0104f1e58e7",
  "257546f29b7915b10b6dcc7b6b0d3195f55db73d",
  "25ceef56c09b365969f014f9ec9d713f2faf1e74",
  "262d95b65369e913085ceb93ba821de69f7fef67",
  "26546039ff0501b9fe5ba82f939398d667349054",
  "29dd0aaee461e6ac1510cce6e92917545b3852d3",
  "2aaa0a6320e41b33868c362e33f22795435a8fc8",
  "2b835b7758db537a5710b4b29a53253e28443d69",
  "2d96ff8775586ad0ae6683b4e71f06b16401a70e",
  "31734690ed2121f381ed7f3186ca727b6185ae06",
  "3267e2ae2ca2e23ab939fcb8f4287c22cc86c1ff",
  "32f6c2a11efd9daf3207def406b1f2f8452c92d7",
  "346c314af8ae4593eb83ccffa6cbd06353617790",
  "365991f460d43e3725959bb58e89e20bcb8ae900",
  "41d23a8128e3eaf80c311cc39e7c9ff3feb7d155",
  "433233ef9bce02579199517fa11a185daa3b0276",
  "4637daac2dc9ad60b4be93fe39c0373e0899b289",
  "469e856824c4f752be1024b96519a0571a1a7632",
  "46e1c764d121a964f5d840982829460bf4e45bd6",
  "471fcde43fb64be784220e9e4a3e5cc92f80b04f",
  "48cea0dd5a18a7b814dfe5d62ad0a671e6d49b95",
  "5008aa4cadd77f7a9a5dc1523cace694f3bbdf47",
  "50ac069ef8be504db29658d729339b4f3f1cf39b",
  "50f2d0776c710e879981ee795416d0fa4e72c3b8",
  "5160fa5eb01527a446dbcc666a71bdc354f51ff8",
  "5416f8b4d169bf8579b3e502c1d31b0191735803",
  "5692dd074713e75236ed7595460abad035acc388",
  "5dc5f4518be37225cac49dd82da3874e86e719f8",
  "5e4dbdb88957bffb9676362b4c69f4621553f62f",
  "5f91c9f3837cef79edfa96b562e489b3c4d7db14",
  "61bcbae72341a2f4979d9a1abee2cdf154554a19",
  "64fbafa674bc3a41017abe60ce95e50e42fbbaa4",
  "681c8b5a6138268649a9ae0aee21300601ac71d4",
  "691d2f82218d329881512f4128a413021ef7bf06",
  "69e6dfc33df698a55166d88a5c2409acca7994be",
  "6a88426160fdd4341b26dd1784097581da2a5158",
  "6afbe0325dfefedb869d17cf9bba0a19bfb77b23",
  "6d049eed9a059c14713b56dc05fa9f1902590fa7",
  "6e41a56f5da0750f17620afec10e78c3f171cdc9",
  "6fad73b53a86ea3581763b7b4afb154089e1aa08",
  "700da412ecb784b3b5cdc028af3a5a5f76d9bad7",
  "7125bf30922a2ad1c6f38ccf00b333e41ef437de",
  "723cb62594d17a2d055b3237a528ac504176c57e",
  "7249c290180cccabde898e02e2234fe5ec7064d4",
  "744a465bbd23b74d8401793ab2dff6cdff3cde1c",
  "77daa61b6e0c7de717416bd3a8a49315f7919eb9",
  "79b090f73d696c592663726b0c26b3f6596ec52a",
  "79eb54a70bd7ec2e98bf058501d95f039e59966c",
  "8109cb74c214ef0592f6cec259f601f208e9dafe",
  "8365022206cb78c81ff513784e541924e27a34df",
  "83d2e209e4e27af5b209a506065195fab9b4ea03",
  "859d349a0d35d22e5ea69739cd7a9b3e2a49753e",
  "86337ec8219325e59f7ec16db8861459119ac4eb",
  "89aa138eec173fef8284bcc6575eca8edfd4a729",
  "89dc87cbb786982bc45239af0b48e12accd4a33e",
  "8ba5c83d683bd2eba743053fd347802a7ccbd980",
  "8ca2fcee34ab5947f814b953d97a5866a7bcb03f",
  "8d8c6b8de74387dcec483687ce205a4578773375",
  "8e46f2b9fa48285595dfe583bc45b454956abbca",
  "90610915bf5820174195ba3cb1551e011302c8d2",
  "936ba16e9f7c4b204fe315d982b8af6e8b9d540f",
  "94f5844c7084eda0cb886b4e68c2b20758622d2e",
  "966acaaa1a7e02ff6503a8a6c9d2f4e11ab4a19d",
  "99158edc6201fff303f49f88cc3d9718912f3ba2",
  "9a1e759832a7f0ec1b3bf9a076f58a27f462a50a",
  "9ad7e75641322696f75a018e53513c8158c39870",
  "9aef014bbbc5f08cc2e6f03b557b2fe9636758cd",
  "9e82c27f1c9c3c0edb92f209bcbd987cd5d9d7a8",
  "a1014a3914977af8a8d9e85aa2bf08269fccf504",
  "a1531e10a1a959d63c30639d4a3e48305d2e3ce2",
  "a3c00204a5b8a503c7e231ea10796bc02774b7dc",
  "a4b3a560af11dedc65dd6f7a97c5c6829c91de59",
  "a4eea816bdf7b7adcb2e70a8774cd5cc69083e5c",
  "a5cfb96af4564d90c6367ba0ee1f7c773e0f201b",
  "a6a1b24e5c68a7dff39be5fbb4d30bc1d1dc84f1",
  "a7461fc6014c7d93c49412fbd949c1b58ad9b25e",
  "a7957e7dcdbf240526f8776f5b37932af8ba5dc3",
  "b2f12b04b6ded9e84bb07d4d6c170ac157f8cad3",
  "b341acdcea02d56abe10da52db1dfffe60196ec7",
  "b3f0844e8ec09010464afa3ea33306bc4f384c41",
  "b4767feb202b946519a999bda87324b432815b0f",
  "b5ff704c4125e28afd6b7427bd3b5437216d444b",
  "b8bfc995040678cc8298793ba523281e2cae0fff",
  "b925f8d32d0fc36e9a64f19f5e40b88e5346e870",
  "bad868f1d64aad7688d3758741ff61cc4b2b8b89",
  "bbf0a1f8b4c8f06e7ff508298099fc2cd17177df",
  "c4372902a6664cd3adafb98cce9e5e15ff9e5e4d",
  "c4db7cb135bee10bee85d0d36b2aa672520f3d3c",
  "c50ddd7d41d7f2cf3412d2401b33d5ea477a5bd6",
  "c7b25d34566a6a206acf07ef2cb4c9bed71a212e",
  "cc9c6b834e26b2cdf5369949d2dc5abc798e2bba",
  "cdfecd5edeca9a2d58df70dc18f47a6c1070ac5e",
  "ce1c1b023f7065a528b9ec6189b198392b405b90",
  "cef0352fca135b252b981b959c3529170b1f0c81",
  "d19788388bf011e59ad1c739f8dd5b68cceae3f6",
  "d602c8187c7f926661f822c3ef7aed4996ec324b",
  "d660b64669e960da672807080ce90a8ffdb0896d",
  "d77ec9376be228d13780abddcb048717a94d50ea",
  "d7eb23e22d2357af838b6d4ba983971090ed8713",
  "dde2a1fbd5f2f00e11568f8543ca143202b28e11",
  "de71a9bb2efbf697e2a7548c292378953b5c5316",
  "e1db536aa4f46b07fadcbf3fcadb92ff8dcb59da",
  "e31add1e32a8e38a5576558e7b33b47507129858",
  "e4a5602d719cf42e990e22db6a0382cfc735d907",
  "e52f5d01105d8c357bc663fbec65659a6a1ec132",
  "e608a5d2b4a2d37195b6f359d68519ee92cebce0",
  "eb547dacbbd032537ff09a73f9bf3ca781230a3f",
  "ec8fdbe0ab3ef1e8c4484c0456b12497423a076c",
  "ecc70fa5b6532b3b1794132d35adc75b2626cd60",
  "ecf6eeb84354c01b93e08c21fc01c4981665ff8f",
  "f18c1b476ead99c58a24d8c6af5982193504d651",
  "f41a510170877b9932ee9268c0bacc69e9dba839",
  "f4fa576cb070a31a3408f46c267c13b1e7b1f4eb",
  "f58995c1823e985ea494facc84e9d5000c8c3e5d",
  "f75693d0d9987964ea105464050aa3966e377c55",
  "f79a6dc7166fb2284cd5884d82c1007813a1ffdf",
  "f9ffecc5bbe105e15724494048c737b79e3fe963",
  "fcadd96cee240b6352fbbf05e3d61eb17ea81192",
  "ff227a2d369036b877ba4222964735f04c3de7cf"
]);
export const additionalStage7BootstrapRefs=Object.freeze([
  "0e47958a48f73433a821cbf6387029be0ec6825f",
  "2d5d105892134f8af46fc2a02edd5932c431b845",
  "8ecc4d72020228deaa4d8528b1e1e75cd28d6eb6"
]);
export const additionalBootstrapRefs=additionalStage6BootstrapRefs;
export const acceptedStage6=Object.freeze([
  {
    "path": "docs/parallel-source-20261110/capture-revision39.json",
    "blob": "eb661248ffe7626b55b54e5a628bd73bf84427d1",
    "sha256": "adcfa3cf4a82a0bf6cfa7a183454a2fc1c5d0c1eee3e70444924f85bc89ced8c"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "f621bc31cc16952d0f8852fb63cfb9e203dc659c",
    "sha256": "0226d2ebe2111c7812c7d7cfdc65405f5040ed74c4cbcc73d797244f7f812bd1"
  },
  {
    "path": "tests/parallel-source-20261110/baseline-runtime.mjs",
    "blob": "f1606d1b7e8a9fe1f437477d899c6b3175fbdf2f",
    "sha256": "f8c26450aaa067ff22dda8058c7ecd9bb6a80ca2b2e847835dcb9eeb5ed805c0"
  },
  {
    "path": "tests/parallel-source-20261110/baseline-probe.mjs",
    "blob": "5aa7324b1bef1c902c3b2c2b878a1da5bac58527",
    "sha256": "a172e54eb4ded89123ccaff6123e0621d7314429a9b81ddea1863fd337100479"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "feb87e7331b12e6317980f0594fe26b37eb2a8f5",
    "sha256": "931a19ff2747bb99860f02a1a1d563ed05db3c5c3592b8c06200094d14282055"
  },
  {
    "path": "tests/parallel-source-20261110/historical-tests.mjs",
    "blob": "8583a431639658fbe8068da96e265ce0b39f6ecb",
    "sha256": "2de75d7f3eeba173e1deea9d05de76d58c03653e6d9b80d3960a8887cbec4869"
  },
  {
    "path": "tests/next-five-20261110/source/current-proof.mjs",
    "blob": "82d2b9f5d7e2f34e456853fabecf09494daf5767",
    "sha256": "9e2f8d19eefcce788c2303472c0a130f400fac7519cc51bfd506dfdaeff16715"
  },
  {
    "path": "scripts/product-completion-lineage.mjs",
    "blob": "cff5431eed6807c0ad909ba6272d3f4ec6f3a423",
    "sha256": "aba3d146ed6d60368336d7134fe0f42f81d6faa095bc9f3c624f15cc98f8b012"
  },
  {
    "path": "tests/publication-workflows-20261109/business-caller-successor.mjs",
    "blob": "b2672458b8e82e26a167f9334b53425203228916",
    "sha256": "8e1f2324eaa9d5a94e61e5f6f3894945441768400d9f7f6770b839b40cf4014c"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "99666fd1d09a2b7f782b05d4dbd9f9656be08eea",
    "sha256": "a6b0b939f5e5cee3072cc2776bc3dbf6663a7c70731419a3905d7904a2f87f0c"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-current-anchor.mjs",
    "blob": "1bdf498f3c01628929b0a5a71fd85400c86120c7",
    "sha256": "03ae8d10a78d30d3d9707a32ebf1ecaee29783985abe21caedbe536a3353b33d"
  },
  {
    "path": "tests/parallel-source-20261110/git-reader.mjs",
    "blob": "3071b7f0292a0fe8f116ec0bd9eedf4b6353c22c",
    "sha256": "7dca4c4f43c3b4d78792f22261af3e006c8e6491c46af96e8847bc335373e439"
  },
  {
    "path": "tests/parallel-source-20261110/retained-vitest.mjs",
    "blob": "922adf4265ae9983f4192affce31f14e61146b1c",
    "sha256": "aef7321e2e25fd914287d7a4b3644b4e8749c7dc9c6674a070cfcabcde57b321"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "5146f713d6e4466c550826d12cdfe4426d4203c6",
    "sha256": "e870d8f4d49591cfdf471bed129d9a628b254fa06cdf25de6a03b0fc373d0f8d"
  },
  {
    "path": "tests/calculator-factory-source-20261112/policy.mjs",
    "blob": "98738e205b69d63563e37f09c0c224f8d2608342",
    "sha256": "36d88f72076804a5c8cb91b62586f34bc3cbffd358a270d335b5d855f6ad4288"
  },
  {
    "path": "tests/calculator-factory-source-20261112/exact-stage.mjs",
    "blob": "0fa53e03c0e06d1ec800c3b37ca66b6ab390faab",
    "sha256": "427dcad7727bd28d26ecfe40df5b780b79c94a7b2a35930b40417e07d5ac347a"
  },
  {
    "path": "tests/calculator-factory-source-20261112/exact-stage.test.mjs",
    "blob": "c4b349b9a90a66fbc85f37e57d68010f96a406b7",
    "sha256": "1f946cfa9de9ad1b3c8637e09d94fdaa0b0148003c3e7c14b1449c2a775c88d4"
  },
  {
    "path": "tests/calculator-factory-source-20261112/objects.mjs",
    "blob": "1f0c797f93aa6c9671143e7f7d85b559a5e576ac",
    "sha256": "6577f703a4556d4dba055236e50d23891a05e93c5083f2b1e78c2ea9e63e5a23"
  },
  {
    "path": "docs/calculator-factory/source-stage-20261112.json",
    "blob": "b7ef922126e2d62ef4d728b22cdfd612b9336b71",
    "sha256": "101889b6b9c1f058976f498c57bdd41951a72f9c7b7b763bc550e658bd11e207"
  },
  {
    "path": "docs/calculator-factory/source-stage-20261112-revision2.json",
    "blob": "4120dd284d1d27f0922f23d98d505502366b0c8c",
    "sha256": "3e519facdcfde768083e3fd9d9c0a8d29d475d6b87cf19c59ba33e6709425b5a"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision32.json",
    "blob": "e801d200628c8d6dd5955cb915f3c38ad1524d97",
    "sha256": "bd440c60f7f81b5904c5f073a2a9099873991f6a1e9a741cc3fda2140373f6a8"
  },
  {
    "path": "docs/calculator-factory/source-stage-20261112-revision3.json",
    "blob": "1459df53cf78768e03cb8958a9fa5518db4e9277",
    "sha256": "39daa9dbed96c489ff8503ed2b5451c6e9a5afb1bc0e86cb9557b300e8a5263a"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision33.json",
    "blob": "d0fb682725afb5a3adcc0332963ac3dcb4ef2828",
    "sha256": "9237758bae472bdc0cd7bb2ba63054e422dfb2797e803d9130920f95ddfc7bf3"
  },
  {
    "path": "docs/calculator-factory/source-stage-20261112-revision4.json",
    "blob": "9be741daf821fef814710fb9870ad7e5ab2fe83b",
    "sha256": "0076baf5662eae521306b71053e4603b8469986980a031d9f484ad1b6adc42cb"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision34.json",
    "blob": "ff14c45f7feeb63e28ee96dc176f850ec6252e94",
    "sha256": "0f4fb4a682b01c5ab5042d6d0378206b2ca211e69dbe9aff6918648318607ed5"
  },
  {
    "path": "docs/calculator-factory/source-stage-20261112-revision5.json",
    "blob": "198b9458cfb588de4b8903c60e4f43b79ada63d1",
    "sha256": "f58877dd162faf6c3ab7430d937436f67194d781058398deb7cc7631d2828da6"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision35.json",
    "blob": "027465966b828104142b39ac484be76d67fd5798",
    "sha256": "2c8b2f38ced90f0eaf257c057b9655d92df9ade4035c8c6831c9730772117791"
  },
  {
    "path": "tests/calculator-factory-source-20261112/policy.d.mts",
    "blob": "17197468e0421056026b3b3fb01fb1b72ebd78a6",
    "sha256": "80387c926c5a29f0f26fc5608057e9fefc0bbcf725261282764ad0c1b085634c"
  },
  {
    "path": "docs/calculator-factory/source-stage-20261112-revision6.json",
    "blob": "fc797da9378b47703c481410723c8593d90a95ea",
    "sha256": "54c5f2799cec646d160a3a67793d9bd30ce49d75a39c7b513f1b1337140d62d9"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision36.json",
    "blob": "eebcc669f22971233daf41df1f9783436ad97a59",
    "sha256": "4c8cb211b31fd3c3d17f735c20c1681cc6083e20a7d5227df392d37a94639dfa"
  },
  {
    "path": "vitest.config.ts",
    "blob": "ab88ef354102d823c7e0ee474a0b9672297f5a3b",
    "sha256": "2009fa342160d4539d41811a0dc09eab07ec1ae0f3a31ce8efcd58b64a94aa6e"
  },
  {
    "path": "docs/calculator-factory/unit-scheduler-successor.json",
    "blob": "b6c075bfc60bc19c43be8133e1cf66457f3c6823",
    "sha256": "4f647ea5bd51db95df01f94f332205cce134b0ebe8e2f4b3cfc5857adefa87ea"
  },
  {
    "path": "tests/completion-first-20261112/current-stage.test.mjs",
    "blob": "e1828d818ac32545fdedead6d9e6500377a73089",
    "sha256": "f54c146fee1c651652bd9ce625a6bc7450fb4070bd2639d0b729771121805c65"
  },
  {
    "path": "tests/completion-first-20261112/stage.mjs",
    "blob": "b07064947f8dc960293c38ec8483dc9ff35d9b8a",
    "sha256": "016165696e79152b2183b81389cc808ac19e98e029324b12bcb955dd2eeb43c4"
  },
  {
    "path": "tests/completion-first-20261112/policy.mjs",
    "blob": "9f3d1747b9cb7f006d6ff17de7111cfb5e3f3ed1",
    "sha256": "45e81e0a4b6f896ec2137bd3ebc92b8c9a8126bacd85124a058c60fde5abc16d"
  },
  {
    "path": "docs/completion-first-20261112/source-stage.json",
    "blob": "a051c791e08ff96f1e8a81cf2f60258cd23d5131",
    "sha256": "d6e6d63a35cbdfa096fcbc468987076608f14d2c38cbaddaf3e0d17e2cc8ad42"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision37.json",
    "blob": "f124b9617cdef72c8ea161378653ad901ef63d9f",
    "sha256": "b6dd6494b2a1d03963adcb57314d1650f0c96f3fb2fe8c36d5ede076a0d69119"
  },
  {
    "path": "tests/completion-first-20261112/workflows-stage.mjs",
    "blob": "0e8322c3352d0a252d8b906c60384d864567b58a",
    "sha256": "f16ae4b15ddc18e7210a9afda1e96bd0982c4fd7cfc5e599d6a8a48a8bbd6dfe"
  },
  {
    "path": "tests/completion-first-20261112/workflows-policy.mjs",
    "blob": "1834309617feef36123525c0a6a35a3596c09071",
    "sha256": "8b5fcd1def0d30dc1c5444532aa1c826b9c74ef936505711cc92ac6cfa0c5147"
  },
  {
    "path": "tests/completion-first-20261112/workflows-stage.test.mjs",
    "blob": "fc279392883d9377fdca2410c3b9cf3a703f437d",
    "sha256": "c08432f80337125f04ccc5192428ce8d3c40810c286c4647099ddf90dd052a86"
  },
  {
    "path": "tests/completion-first-20261112/retained-stage1-tests.mjs",
    "blob": "91438e691d2f468ad450e978ff041ada394236d0",
    "sha256": "a9c3cc58801358e2bda3eb9ce8d84ea700ef2a3851860562c9bb5a5c2c73a16d"
  },
  {
    "path": "docs/completion-first-20261112/source-stage2.json",
    "blob": "4ddb9e1fef1faec79babcc04bd37e4cee000d72b",
    "sha256": "ab96b2e6e88044f5cd117021b18d2f2a4a5ae3e54558c21031b5ee2d8b4f7118"
  },
  {
    "path": "tests/completion-first-20261112/non-source-stage2.mjs",
    "blob": "4cc0f4ca2faafef59419e57d81a5026f28a32f75",
    "sha256": "3d99f5c6bdef2468d454af5f5bc983c03ba82ff6cce1d6a2bff5bc91b4b46d1e"
  },
  {
    "path": "tests/completion-first-20261112/non-source-policy.mjs",
    "blob": "57430b53ba5ec6abf48052093c6457b1408e3ad7",
    "sha256": "90a70bf5b5f6f487e5f8648de803005311198fdc37db5f9cbc3eceb638410667"
  },
  {
    "path": "docs/completion-first-20261112/non-source-stage2.json",
    "blob": "9e32aa7febe8f20395f8f5ac4a21e0c245974044",
    "sha256": "c667b49755de80add4302f3cedeb7464befeb75c5d78d9b125e860d264d027e2"
  },
  {
    "path": "tests/completion-first-20261112/retained-runtime-stage2.mjs",
    "blob": "66eaf0bbab36cc618efce156668c48cedc8f03a6",
    "sha256": "73f2e444ef6d80f37e36f8b993e77cab069b685a397d1607b3b821763b9ef49e"
  },
  {
    "path": "tests/full-product-batch13/workflow.test.mjs",
    "blob": "ace54035f9ad48b57e331b29ca63d6a5f3dd621d",
    "sha256": "cbe05dd0a8c0bd7c81b0ff05451ce6329fb93d9b68c9dcfd84801f7df81b7c20"
  },
  {
    "path": "tests/full-product-batch17/workflow.test.mjs",
    "blob": "757970bba28d22dd97d326ab25d4f3380f010dfc",
    "sha256": "5783934c2fe14c990b68d7667abd1eecc390681ceecfbb2f8fa2c2d148b29d91"
  },
  {
    "path": ".github/workflows/ci.yml",
    "blob": "657433d3a71a5ece42819edfa5cf2707d9465c7d",
    "sha256": "d5b6e2d5562a0385362ffd0f01b012d869b0771134193626bb12754b8b667632"
  },
  {
    "path": "tests/gotrue-runtime/acceptance.mjs",
    "blob": "601c9c1a9c359184d2653188f4c1a55e112addd2",
    "sha256": "2b537eee5d51eddddd9fcde15ed28b062f899d459bb8e24943f3f8ea168e2cdc"
  },
  {
    "path": "tests/gotrue-runtime/login-diagnostics.mjs",
    "blob": "9d75b49b3beacd70464ae3c5c24fb8ab36e54993",
    "sha256": "34d2484e41e7da6ced41281c2215528b71acf4faf89000d11ce5c07764b5a24e"
  },
  {
    "path": "tests/gotrue-runtime/login-diagnostics.test.mjs",
    "blob": "6abd02b73cf502fbbbbb7696a8d0d62d17e26dab",
    "sha256": "8c594340d1c5f657cb1c9ed600e1b1cc39f0a74cc569f99614199913f2cd2fab"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision38.json",
    "blob": "ca7440c9483c617492db58690cacc3a0047dc39e",
    "sha256": "f4ac754c0561527d74a6384248b9aeb3ed549f6f0a8f3d9a873ea1006ce9c583"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision40.json",
    "blob": "faf946b89d56fc23aa4236efa0991fe646e4433a",
    "sha256": "18232a1f698f1b875861ddcc238750f635f25dcf50f9006b4f3603d0c302d0f4"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "18ff6de5bf20ac09d6577e8fe5859a18ce28ec6a",
    "sha256": "088a132759e159ade5a3f60465cd00cec4112d8029968e7dbf853146ada2102b"
  },
  {
    "path": "tests/completion-first-20261112/personal-policy.mjs",
    "blob": "a146c4a563d72c1d47d486623361786fd722a97a",
    "sha256": "9e4b16266c1529c5346e45d1e2660e4b61470482446df9e85536022d76e55574"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "b753b18fed4c1c1c7668283eeae2f9bf321a9b52",
    "sha256": "215160ac064375dc9bd0df1129cb0c7164bdd9d87b6aaea6878d2fef3861d24c"
  },
  {
    "path": "docs/completion-first-20261112/source-stage3.json",
    "blob": "da74f9e616c8ae69caa44cc422d0d46a6fd7daa9",
    "sha256": "96f2da88cfb8bae7c70150973be26b3b6651c840642c071296f82c519ec45476"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision41.json",
    "blob": "5c6341bc483938e2f68e899a43982465d589baec",
    "sha256": "e92682af295adaf8f205f7ef9f13604cf0e4a1e05ef77ca3e2089be456893e4d"
  },
  {
    "path": "tests/parallel-source-20261110/git-reader.test.mjs",
    "blob": "f2637ee773ffd1d3b80379db18373bb13924d9da",
    "sha256": "78082c242a3b5263cbea0c99a7039026279ba28cbb2976efcb11d7c473f34213"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision42.json",
    "blob": "6786610ab5e4ed4dddda62ef7345dbd37a204b3c",
    "sha256": "1de2f25043b156d26457378765f5a5bf03754b0c4250ab8c6c17caff0d69067f"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision43.json",
    "blob": "2eb705f87115d46ec0a61487bf4dcf5124c6648a",
    "sha256": "5756781caaf71ec39a4426fe69c7e0a111db644b064f29d071e77d67a26e7284"
  },
  {
    "path": "tests/parallel-five-20261110/test-only-successor.mjs",
    "blob": "6f39ccd115f933dab15abbf3f38b559cc5b70030",
    "sha256": "257ce91bf57edf158c2ff29835413a0853103efd12239f1f77288f0678462f6d"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision44.json",
    "blob": "d49ab45bede2f911207002328a9dbce536a40444",
    "sha256": "a077d5afbbd4353f46e49af452a7ccdbb1aac9b4b235c51623e805f377a4fab5"
  },
  {
    "path": "src/lib/ci-retained-workflow-availability.test.ts",
    "blob": "0fe806151ac60b509323e192863e92463157153c",
    "sha256": "cd8b74bf37566ecd782ca6692f10b58dbc17f8f65810bd1678bd0232a2f21b6a"
  },
  {
    "path": "src/lib/thirteen-program-evidence.test.ts",
    "blob": "eec1656acc29e69ae8ed5b720840b69384756bfd",
    "sha256": "625903e718b17eeb967c42b535e1b390cbefdf91fb70eaacd74ee6786d7c5e94"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/async-verifier.mjs",
    "blob": "7b9c56390e02e319f23fd8a558b12f68598cbc2b",
    "sha256": "c9aece4566f35d0cd697b4377817eb068635bde4db242989789e4038255d6cf3"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/async-verifier.test.mjs",
    "blob": "4a5a749cecd349a337740bd37d2f6e452f5d18f7",
    "sha256": "9ae0eb14f65ebe737ff3b849b131c6e02b22b4e67f5360900b03308bc86b56a2"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/retained-case.mjs",
    "blob": "a9a0dfc14adf6873432fc089f8a19eb91b6bb883",
    "sha256": "ee250e132ff345f932f5c71b2299bb6c027d6c6587095cc423db4b4b35b1ba4d"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "f8f8d56987b148a24ff058e8eba5366bc0608316",
    "sha256": "f081bd3d51477e38a2ebae37893a421cd1ac0456a037cd1b3612f7dde560be19"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision45.json",
    "blob": "d63f4b27191bfff8d247c37ac1cb4502893abe28",
    "sha256": "e10809269673ca33a65ba83bb4215c754eb71d50d6897cffcd701737000cda47"
  },
  {
    "path": "docs/completion-first-20261112/source-stage4-tests-revision2.json",
    "blob": "2d3f906161b2ea62eb2664126ff5f0e39beab18d",
    "sha256": "1a3749dd373e127bdbcf239e1147c2b85af2b6bc5cc04c7f04c8f3280887bd3e"
  },
  {
    "path": "docs/completion-first-20261112/source-stage4-tests.json",
    "blob": "11685028df12ab8cb8b7446174de8268bfbaea20",
    "sha256": "67597e11c1807b30fb240793f23088a5228232ace71871757327a0456a58c236"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/async-verifier.d.mts",
    "blob": "51b657d7ff918ed7cceacf28357d25f447d58281",
    "sha256": "09660a2ebe4572e2d4b33395ec1fca2bf412838708ee1e786849530b4ac722f8"
  },
  {
    "path": "tests/completion-first-20261112/test-stage-policy.mjs",
    "blob": "60a8129e23162d11c8e423dee10076f4dbff305d",
    "sha256": "2d765fdaaa525c99e862e98ce8ddb34b575dc40cba3bb692947ffe7d43181e9a"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.mjs",
    "blob": "b4347a20d81d970ce8bb172432790791f3b1f293",
    "sha256": "babcaed215df2c7bdb8944c9923b5953b851e14d2d31c26a9b3e2eb39ca66331"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "9d0aaebb5fd47a2306de56e97584e2c52a9ac927",
    "sha256": "ebe8b27a63ba859afffd697f21688d3c50749618663b30ccda68f0e9daf1b773"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision46.json",
    "blob": "d6bc567bd181cf84bdd441b270518a6eafd028c8",
    "sha256": "25143212e476c7fdb09abb944e77fdce6447b6dc0b3b7a32727e6b0c3f481cda"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision47.json",
    "blob": "8c803b4ff61825e39e22f9d52b57c6ea997b0103",
    "sha256": "d65fd387d501db11c36a80d0dea9f75e74a3f7198fe60b557bf3d45d1ee7cf50"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision48.json",
    "blob": "b630916eea3130a22bb49ea971e647dab218fd53",
    "sha256": "eed5623be446577e37917994a0b9471351b4fb47838967f1763a9b18ef5d6bac"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision49.json",
    "blob": "f941a23fcf408d5976bf2479ce9ecd95c920b497",
    "sha256": "d36cd35fe1d8bd9ebab5e2692a47963fe11915f673f8a187551c367097941692"
  },
  {
    "path": "docs/ci-balance-20261113/workflow-source.json",
    "blob": "c7e27ba49f258085e3d7bb8507ad40d9440cf66e",
    "sha256": "35f0c4fec861553cc28b7f738e7b3629b02a0ef4c6739ed7b9c6515f2c4bd24c"
  },
  {
    "path": "tests/ci-balance-20261113/policy.mjs",
    "blob": "e61cb9345397984f51f13fd8d81af1de13e48970",
    "sha256": "83fd8541ad5563b2832b558e95f98d0ed84607386d12e6c5a1086c422727a5ff"
  },
  {
    "path": "tests/ci-balance-20261113/workflow.mjs",
    "blob": "b38b8831f94a36780154856aee1d9b2d587fe0b6",
    "sha256": "015fe6503e497362109e3afb8277556a43a87d880ff4dead087bf6a965f1750b"
  },
  {
    "path": "tests/ci-gate-recovery/balanced-workflow.test.mjs",
    "blob": "8baee25d99ac510d884382e1d776d3410ae81c5a",
    "sha256": "fa291d41d59ab7e238ef58400115bf12a45b54276beca212d75b7e63cc27348f"
  },
  {
    "path": "tests/ci-gate-recovery/balanced-yaml.test.mjs",
    "blob": "d56cdd4604284c9efeace6e7056c48a13ba23515",
    "sha256": "8b5ac923e14bf33e56216a14dee1703239f6666d11e67dc8de4abba3c3a560d7"
  },
  {
    "path": "tests/ci-gate-recovery/pdf-tools-contract.mjs",
    "blob": "5fbb538c41423d38acd03bd853ffd2a96fa5d776",
    "sha256": "e0f0657dc23193e1db90bc6d950bd8d00bd6e2e9c53df2740417e57a458bed57"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision51.json",
    "blob": "75255eb6db6a5f01e9a095188213745d02e34428",
    "sha256": "ad32720fc8c499312e40074c1d7c9fdaa147af28ec75f02c0474a515666c5dd3"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision52.json",
    "blob": "62fda2b086a8965cc33194ae952e0b8b36b5676d",
    "sha256": "05ffb5df0a02cd8f1ffa128ead807a68490e46799335a83eb7c6a080300c36d8"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision53.json",
    "blob": "d2db1496ae088e7f9719f36341076f953fe9347d",
    "sha256": "f5e3281d50590d99fe1e7890f148a0e4c832c07bccf608325213ec4772bfb2f5"
  },
  {
    "path": "docs/completion-wave-20261113/held-business-reverse.sql",
    "blob": "d990211f5083a0be3491efee8cbba703b8d9f6a7",
    "sha256": "169858355922c76cac0bb98b91d7bd9ece4883878f07a20d53739b80a826f02b"
  },
  {
    "path": "docs/completion-wave-20261113/held-business-successor.sql",
    "blob": "89604b2bd3e1b1894bcec0209876ef73d55b7268",
    "sha256": "deb431b7e21a194e27f66e3b3ea06e575a8fe057ea739cb487403302b19ee8a8"
  },
  {
    "path": "docs/completion-wave-20261113/source-app-stage5-revision2.json",
    "blob": "68304b5e2008caa485763f28e6aa875d771ba6a9",
    "sha256": "07f59d591a5ed9a1de1b4bdc8483a0d4f2074552be5583055326da9ed5b6b397"
  },
  {
    "path": "docs/completion-wave-20261113/source-app-stage5.json",
    "blob": "a65ee2b8c15ef226dcf8acee6c6a142bc8f7d60c",
    "sha256": "5ed5112f1d046ed8df77d57434353b215584f133ec3142b58bd09f3f94a01799"
  },
  {
    "path": "docs/completion-wave-20261113/source-attempts.json",
    "blob": "8257559ab635f923294c5c3ccad0691dfbe15ee4",
    "sha256": "12663fb0b81e0be09c8826e37a798cb2e88ee50e8087a72ccf727368246671f1"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision54.json",
    "blob": "e8c742d4ed5e0345857f7b7a4e41ca8248841c98",
    "sha256": "c021b550033f3c6ceba5f7a8a12c3f41cbfa4f2d25b2a964b2796a3541805dce"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision55.json",
    "blob": "1552475fe4132151ed74f27315eb7574efc48669",
    "sha256": "0f37f8c5b8d820bfee24f2c7876b47ce661f0ced41e86b8bdf3002d0fddb55f4"
  },
  {
    "path": "src/components/completion-wave-analysis.test.tsx",
    "blob": "e5c6ea3c25f4f4f8be1e633589824a667e5a0a7e",
    "sha256": "d77994c3197e3f439440dd22d891f048eb8c28c90d242eb3b155e5d4f16c8b36"
  },
  {
    "path": "src/components/completion-wave-analysis.tsx",
    "blob": "62b1ce93cf1b24cdda22720fe345fdd8e0ec0cd3",
    "sha256": "467ad4a17356b35f92255993284d04696861ff8c6c08f4f4fa6ad1f74ae15a5c"
  },
  {
    "path": "src/lib/completion-wave-20261113/business-cases.test.ts",
    "blob": "365880cc1fb83c70583bae8093ea552b3c097ab0",
    "sha256": "3af216f2019d8ef2879ddac13cc7b5036f4213c9c97d7b920c2811ae5ade5698"
  },
  {
    "path": "src/lib/completion-wave-20261113/business-cases.ts",
    "blob": "4844eb02a2ab214fc011c5c5f28529a0b89d36ce",
    "sha256": "f207d4517b4d79222fd8dde15f51fa5b77526a216707cf12cae9a32c823b4dd4"
  },
  {
    "path": "src/lib/completion-wave-20261113/conversion-workflows.ts",
    "blob": "17a451559ed0940b18807487f469876974177b77",
    "sha256": "ddc998f3f8ce6bb95f57b465cf663bf8861a9c6aff00c4c0c322109051e159e5"
  },
  {
    "path": "src/lib/completion-wave-20261113/engine-evidence.test.ts",
    "blob": "948c1f36007e213c1dd0d1c402897a24f4f39038",
    "sha256": "74fb11e67c4c08d81364d271090a12a6a3f9e1e8104d07ea9302cd80c41fabbf"
  },
  {
    "path": "src/lib/completion-wave-20261113/math-analysis.ts",
    "blob": "cb439f62d0e1529e717e353142eab6e4815a086d",
    "sha256": "d65ec76fe393ffdbb3c5aabf8084e03c7763218878b25463d6730eaf47a44ab0"
  },
  {
    "path": "src/lib/completion-wave-20261113/native-wave.test.ts",
    "blob": "a1d25cf972c6bc0e5397a71aa0eebd50260a4fb7",
    "sha256": "40397748a1cd9ce9b318582bcab276c38ef61dbf4ef8aa0ebe0609ea2466f5bd"
  },
  {
    "path": "src/lib/completion-wave-20261113/physics.ts",
    "blob": "98bf1a2dfa24058c1cd9c5a0b607335e426f938c",
    "sha256": "d675805de50a163d14a2ac0809edb0b9ad1ab4d1806b0f1f6fb71cbfa3d8aefa"
  },
  {
    "path": "src/lib/completion-wave-20261113/retained-nine-tuples.ts",
    "blob": "e59960ed20f50da2d4f39db00324763fd8631cd7",
    "sha256": "e84284138514b4267953fed4eb642db73323058d4329c9762a1b3e326bd18b78"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "5a6c1698541635ae5f06f4c487f98872bc278c90",
    "sha256": "15f479cacb572a9b625f5522fb8961cd198dc5945f5f88298141651ff709869f"
  },
  {
    "path": "tests/completion-delivery-20261112/acceptance.mjs",
    "blob": "b7bd02a40932529e47eae86decac0790cdb113ca",
    "sha256": "1c1a8cdab6212ad6e48bd533139ce5ebe3d3c8d424f2b230d181434ad5d3681e"
  },
  {
    "path": "tests/completion-delivery-20261112/runtime.mjs",
    "blob": "316c496d43b2f2c040d9ec8e6f0baa4dbd5a6926",
    "sha256": "56fe8ccc5817ee19ccafc9c71a9a9f0bea417934447fe7889dd12441549f9be8"
  },
  {
    "path": "tests/completion-wave-20261113/business-acceptance.mjs",
    "blob": "9705299853a50def9022ce0db6696f2e28b29af1",
    "sha256": "de9f8268cb44d47cfbb6a3a2eb834c8e479e7dd1114a5576e34d711ef74fc618"
  },
  {
    "path": "tests/completion-wave-20261113/business-automation.mjs",
    "blob": "19793b0e1901b177f64ca10a3f38a27dd031200b",
    "sha256": "cca2a485849385991e4dd50235e6b1a4ca1ce2a5708376ee80dae7957f512a28"
  },
  {
    "path": "tests/completion-wave-20261113/business-capture.mjs",
    "blob": "b38168915cadd614b719edc9b23c90f84ff1ae61",
    "sha256": "512bd3e9bba512a69a57b3ed5315fc7f01e2303568121bae2c046a773d1cb908"
  },
  {
    "path": "tests/completion-wave-20261113/conversion-workflows.test.ts",
    "blob": "8d7bfa0365b000a87515cb0cf8753f14c5a15cc3",
    "sha256": "64d04d977e99be5125541fc807288fbb615b2d443993b916e175ccf172fea710"
  },
  {
    "path": "tests/completion-wave-20261113/math-analysis.test.ts",
    "blob": "bd59998dd212a1eb9b7988cc13938b3bb5a71927",
    "sha256": "e37c82b8610bd6da20ecb4c57c2fa9fe586d07714be4aeff81383be993553c5b"
  },
  {
    "path": "tests/completion-wave-20261113/physics.test.ts",
    "blob": "9f1b946291dbce7daa34408e89d5db1ee38da394",
    "sha256": "1e177a9ff100304217ef10bdca919b6d4849ec9a6a833f75f5db6325a8d8235d"
  },
  {
    "path": "tests/completion-wave-20261113/physics.tsconfig.json",
    "blob": "ab053d023fb2df2daa98a53a5bb3f145990c2dfd",
    "sha256": "6bcaf6fe8f61f2c91414045b0807714de09bd1151fdd8fb059c6c8187699eb0b"
  },
  {
    "path": "tests/completion-wave-20261113/physics.vitest.config.ts",
    "blob": "570df26fea674458ea887070af15b1c50456108c",
    "sha256": "232ca90ad3492928b5475d21a25d0373f5004b88171b0d4d7346a1ca3d58ebbc"
  },
  {
    "path": "tests/completion-wave-20261113/source-app-stage5-policy-template.mjs",
    "blob": "961515e198e33ac1669ad9706393974d9dc15d70",
    "sha256": "0a8f0199fcafde68a1cf2954d1d5c9ae42df35b9762ab51081dffc15f17efea2"
  },
  {
    "path": "tests/completion-wave-20261113/source-app-stage5-policy.mjs",
    "blob": "b85e2ac6985b3c803bacc44cbd0101c27ccbb4f8",
    "sha256": "95e56f682bede4567909f34f4e39b69d23365707737b7ee5d476b68bb41285e4"
  },
  {
    "path": "tests/completion-wave-20261113/source-app-stage5.mjs",
    "blob": "0e7bb0951acddf147a2b2b8db77b13911a5ff691",
    "sha256": "7552276bd5aaa3abe9a10f370ac5c6248fa39a46f43ca337e648106044e7bb2c"
  },
  {
    "path": "tests/completion-wave-20261113/source-app-stage5.test.mjs",
    "blob": "99290ad72734be7db420c18cbf81ceab148b8322",
    "sha256": "1a90bf08aed71316f575e24816da8ebf4bb0a6a814359b62ff752c52e9417fd3"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision56.json",
    "blob": "d0adfe8df7282dd438d9173312244c137c33988e",
    "sha256": "489ddae1474975640d4e9cc80fc956b17ec1a6b616253c9e1bf390d2a573553f"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision57.json",
    "blob": "223e37134b50a5c2622caa0635c5b27b7a42a0ca",
    "sha256": "591205afdb3d9653229bc067bf41a9e618ea2c98aab22f68d4a55585ecc70d15"
  },
  {
    "path": "tests/completion-wave-20261113/source-app-stage5-availability.test.mjs",
    "blob": "49f63565134876df43b81d6e1b755a8142a254dd",
    "sha256": "fc8f590a171aba07cbfa23bac916537c9e7cbfa656b25ae268d923ab55618f4c"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision58.json",
    "blob": "fc837816df5123d5efb54bdda39f1c108eecfaa0",
    "sha256": "1e6a1061f8b87dfd9838089612f363e32728d150a391d26035f0b8d03eab8bd3"
  },
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "04a340db5e088d660a144b34f949b691070f0498",
    "sha256": "fa2fe617581d7e439516884f326fce3d92607693c0a12622f47774f2f2b7ac41"
  },
  {
    "path": "docs/completion-wave-20261113/source-preflight-revision2.json",
    "blob": "c4ca1425e4876a6b931432c799cffa0d3b9b8f40",
    "sha256": "9607adadb65c1248903a09c5cd53159ccf3f627e85130e864b657e325286852f"
  },
  {
    "path": "docs/completion-wave-20261113/source-preflight.json",
    "blob": "12b15cd5c6407d601c10f67c712ee5091c8c6642",
    "sha256": "ee324b7a4a93e963f490f736eaf4816f70cafbccea81b0dffc9e79205295a707"
  },
  {
    "path": "docs/completion-wave-20261113/source-test-stage6.json",
    "blob": "190935aec27f51349731a971f2b4bc98f9b7c501",
    "sha256": "7ed3397cbd13f6c876fa878ffee73d06380fe58575d897a0c2ebbc4419f8a186"
  },
  {
    "path": "docs/execution-recovery-20261109/source-successors/governed-bootstrap/capture.json",
    "blob": "c5464a2b647abe717afce9b45631bfc5951d9dd4",
    "sha256": "637785a092e2eb9131bd2c5a0b19ac947c81010b8a95cb28bc1ef1ad0766f229"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision59.json",
    "blob": "a2ca0930f9ddaf44a96b72461b05f11b4be094b2",
    "sha256": "805a9bd785f7ad2447d7b0108504bfca642d9d7775fa3cb8fc70f505123da02a"
  },
  {
    "path": "docs/product-completion-20261108/implementation-manifest.json",
    "blob": "459f358b1766fd5ef7e10aca069f51de271fdb52",
    "sha256": "c6dffa496f6498715e84807903475c4a2741601200d964b2b0320de64841abd2"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "f1307a118fe0d3fcbcd30416058fe31c9397746d",
    "sha256": "652c458a844c82a5e468702e9d9acf2e6a7afce3875c7808d82661bfb8dfcda9"
  },
  {
    "path": "tests/completion-wave-20261113/pro-gates.mjs",
    "blob": "047f7dba6aabf5f1fec2eb8bef71753b2e18aeb0",
    "sha256": "fde8e0c06b00f4efddf20c929e5ad2edadc2a35a74ce728f8c81ca7e7e925c6b"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight-original92.json",
    "blob": "ff6b2ffcb45832a83b3023a0f3297b723dcf02e4",
    "sha256": "c5ac0f43c36ac90220ab19739c96ebf98d950128ebff1635390d0035c6ae821b"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight-policy.mjs",
    "blob": "839acd436d97575bb5e897503d47ca1ab40c993f",
    "sha256": "3be7fb8dd41f9fb709012daa6b01729592f33ab612508318b9d09a5a25a1e875"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight-stage.mjs",
    "blob": "5f1d46fd33c93898494335e79ba13e605fd106f9",
    "sha256": "3784a5b12a8f845d3822dd7e270f124711bad9ebf4b51c4ffd1e88044140d504"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight-stage.test.mjs",
    "blob": "4ba3931398bb4b84270740d7a0174be54102af57",
    "sha256": "cd06d950b76ac430041401576c5fd4002f392da754420d9fa546ccdc4e9640fc"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight.test.mjs",
    "blob": "d60c8deb240b33ff603b9c3bd2b41a32dc849fca",
    "sha256": "971ea19d09327dbb2d5618a70ae3caa2a0b35574dee1a1f512933f24cba28f06"
  },
  {
    "path": "tests/completion-wave-20261113/source-test-stage6-policy.mjs",
    "blob": "02fdd943f10103e11fa80c4e33e7c0196c54c52b",
    "sha256": "87da337a61c1f796e7488ee11d3b1bbd51d0e61ad251e6869c380eec8c800092"
  },
  {
    "path": "tests/completion-wave-20261113/source-test-stage6.mjs",
    "blob": "f051cc3e9c153e04ed3d3e4d4de5393c49a9fb59",
    "sha256": "ac7f4ea637e6c0e4c2054c75b20dca5c703f5a7e369977107e8b8ea92d561252"
  },
  {
    "path": "tests/completion-wave-20261113/source-test-stage6.test.mjs",
    "blob": "4e76ddb0ec3a816d89741cc6b31b3d86323f0eb2",
    "sha256": "cf2fa2f2556ed4d0c9906ba7bcc594c62106c65781292a685fe52577df025e1c"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "413bd7b6bd607945bd2f70f094d1b85ed9188ff0",
    "sha256": "a2da675f9413324e0c6cadd05362d488be67c11946cc726dbc42796319d11b68"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision60.json",
    "blob": "c3e4aecefaf2520b648e5dc1d7c7e03491654aa0",
    "sha256": "5683d1294b53e950209ad83433a5824860f2e6e6b68c7bee344448ae9112ca54"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision61.json",
    "blob": "a39c98411bb37cd5833327e5c700e97c59e2cbc0",
    "sha256": "c442dadafa050b6e9bbb84941412153dedda121a35041f037ae06e4581cb7e34"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight-additional136.json",
    "blob": "fa75c797b67ca7a1b2ac484d0c748f902de94bf1",
    "sha256": "e5b12926c727144d9f1f5531b61ba1ea46227db19be97373c0b7508b70d52ba2"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision62.json",
    "blob": "e671c12ad583f8714de50d62c46656de449781a4",
    "sha256": "3961a6783bf142bf278c851dcb3c52a75604c7e6c3d13b80e5f4f4962c23a926"
  }
]);
/** Additive independently reviewed successor records. Historical Stage6 literals stay above. */
export const acceptedStage7=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "6274b1d944e65533eec9fb677cffd089e4f8e693",
    "sha256": "882b8eabc8c1351e27513e666c2972c36c640d377b13e8f6f9714642bc5824d0"
  },
  {
    "path": "scripts/product-completion-lineage.mjs",
    "blob": "9844bc357162efc69feea8dc686be29ff4da0ee5",
    "sha256": "7da2dc899905e188b8e1671e6f61476bc8bdcbdf1f37709a3607ec36ab5e8195"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight-stage.mjs",
    "blob": "b82f178aaa66bbf4d93dbfa1a9cac0f2afbbaf0e",
    "sha256": "ece5588e24150548788bd6fd26da12986038c67343bfc9abf35b9e871bffd14c"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight.test.mjs",
    "blob": "34662320c9ef0f78bd3392a75a390bd247125314",
    "sha256": "d8b7c9d9b66bd824808b8ce29e98a73023375c1c49a1417305f565eef697d575"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "ebdd8d308d95d2bf423516af0f5f97f83076cf21",
    "sha256": "67ee90bca9042cf5453aee3c26d0382a1c528abac58a0effcbc71702076f20e2"
  },
  {
    "path": "tests/milestone60-20261113/source-preflight-retained-stage6.mjs",
    "blob": "738703fc7a50af92403ad4afd50126eba898d1d3",
    "sha256": "c493d787390de65afdcb1c74b3205b459f81002bffceb3405e8cde0675e65b90"
  },
  {
    "path": "tests/completion-wave-20261113/source-test-stage6.mjs",
    "blob": "b8b59f192947a80fccf955266b3d1628435053f0",
    "sha256": "2e84aeaad3707cae9682691e9a9588323da53a71912ac41a3e3b0fa4bfbf66c4"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "598b447ae7c882b9c461a2135d45713078eeca34",
    "sha256": "530982429007c0c278cded46ad6e7e156d3596f3d7fe9666aba18cb20462f7b8"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "1357953a09235948302688665ddf28cffb13559d",
    "sha256": "8af6a1cecb73c7568a85a4ec72567d74d6dd45ed8a73d177091c229cd404adb8"
  },
  {
    "path": "tests/parallel-source-20261110/git-reader.mjs",
    "blob": "0bbc751f8c9a19f824febbf7ddf621e51541d25a",
    "sha256": "4bff3631e35eda40e96c69894c7744897b00c5318fec4e066752036d1415d02e"
  },
  {
    "path": "tests/milestone60-20261113/source-capture-stage7.mjs",
    "blob": "1e13a01cd9b437bf91ebf6e3efe8a68c90846934",
    "sha256": "4071fb882d1c907a70a06aeb2553bc48c0b84a1378010e6e930c5c3356ed8729"
  },
  {
    "path": "tests/milestone60-20261113/source-lineage-stage7.mjs",
    "blob": "821665f2034dcc621378b34841db5f349e27467c",
    "sha256": "3508150d365e31290305cf4478bc73c30c7f66fcec3c78502e99693f770fada6"
  },
  {
    "path": "tests/milestone60-20261113/source-proof-capture-stage7.mjs",
    "blob": "8ce579355626ae4fa179f0834bbcad0d100a6670",
    "sha256": "b75a012d815249ac1df35fc9db5837eae907920a803dcd65395aa1a78b45ceac"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7.mjs",
    "blob": "02d66281215fac5a24cc04374d099168be1725b0",
    "sha256": "2b365fe74d5de1a6b8a82dbdf4a275894db95da7733af95b71d35564427e55ae"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-historical.mjs",
    "blob": "2ae4d353da7298d4d22e7bd57086afcb811aff2e",
    "sha256": "070db29356791231b8222a356c6a1af3b70e198e0016bc616c144a2b3df7e8fa"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision62.json",
    "blob": "e671c12ad583f8714de50d62c46656de449781a4",
    "sha256": "3961a6783bf142bf278c851dcb3c52a75604c7e6c3d13b80e5f4f4962c23a926"
  },
  {
    "path": "docs/milestone60-20261113/source-attempts/local-only-capture63-inactive.json",
    "blob": "cadc4e8c0072ab78b39aa43cd71d6e68f1be1dda",
    "sha256": "ec95d3c9156108ed3047b1d76eac2ae3d76dbcaaaa461a5ca1dd731d135ef63d"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-v5.json",
    "blob": "306c1f3dc87975c6b089656cc4a0bbdf20f59a75",
    "sha256": "5117ea0488e074f378068fc2cb384004c2cc7d54fbd3a829de7699f80fcb28c9"
  },
  {
    "path": "docs/milestone60-20261113/source-attempts/app6-local-only-stage7-policy-v5.mjs",
    "blob": "aa50466155e88d3414b55f065fcced070f2c2d4b",
    "sha256": "76021c2420512171111647e019fb1b422fece42af9851a4156e83d11af754eeb"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-activation.mjs",
    "blob": "06660c0112320e23765d9be1307c1a4def0ef4cd",
    "sha256": "3aa0ea3177741019002d291d1d1bd83c419136c337e88b0adc933cf4dc6d9c84"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-policy.mjs",
    "blob": "9fb1cd747d6bfce599862e03a8e502c8fe34a0e3",
    "sha256": "c265099079a9bc3a715a75dd5535fc1b65c78661c04b24c44e54cd43eb4ff52f"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7.test.mjs",
    "blob": "12bf3c254eb949a8fde0308faedd80f6fe147e16",
    "sha256": "5fcb0b8ab0688a1ac9be7fcfe509571ec6c0fcc7df4157f9cbf064d190b819f4"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-live.test.mjs",
    "blob": "d56fb662dae03797495243c945a62647e311b8e2",
    "sha256": "7ea13efaf750b4dfe1431365c3daeeb346f9b7139ecd82b840eda6f7ee2891ee"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-preservation.test.mjs",
    "blob": "dd6d974e9f5f8238f822c305b5858a7b41fa88ee",
    "sha256": "7fcee047f2d92a26ba04f6bfa5450ece03d6af4837c8ddaabe1628a183cafb59"
  },
  {
    "path": "tests/milestone60-20261113/math-vectors.json",
    "blob": "9c58e3305f3459256d516a45a7e1c4836847cfb7",
    "sha256": "47160ad0da2f09f2a8e2409f3ffef1e6a8ebd736fe4692dd888ddde9549cdd04"
  },
  {
    "path": "docs/milestone60-20261113/math-next-extra-cases.json",
    "blob": "24c894c193566e7b7f75617221f6632387f019fa",
    "sha256": "497cd31cd4b6dfce064e4dcc6142ccfdd07c71710447f7715c4f4c37a1373410"
  },
  {
    "path": "docs/milestone60-20261113/business-account-cases.json",
    "blob": "509f1d7b5aeb6e53ed23ed6c1f61cf6e4ed7a9e1",
    "sha256": "436c201162ad9683c46394054f00c3141548ce2af9c7d251404f71fe7fde8af5"
  },
  {
    "path": "docs/milestone60-20261113/business-browser-cases.json",
    "blob": "26bdf2094529daffa00235c8b76222a7ab157bf3",
    "sha256": "371a79df92c447dacd5f5626c5e3680cc070efbd12e7c56d1d0de03ca0d2be2b"
  },
  {
    "path": "docs/milestone60-20261113/sources/nist-international-acre.html",
    "blob": "09879524563f844973f1e115f41c39922e162061",
    "sha256": "9f3a70faef0fc6039f9fb3c5731251eedcde1a7eb98265dea3e0891ed7aa93ef"
  },
  {
    "path": "docs/milestone60-20261113/sources/nist-international-acre.md",
    "blob": "14da24966bad2a2f0566202ce4fd611f91fdfb1f",
    "sha256": "6ea093748e6d206a6a133f1ad70f05d760b04b73fcdecafc95409b0e57c926cf"
  },
  {
    "path": "docs/milestone60-20261113/sources/nist-international-acre-manifest.json",
    "blob": "633734f01f6dd498ad3c2cb9b5e638d043604160",
    "sha256": "dd1361cae3b3e91e8fc47e58f0c33a973f607c4a34c33128e3f2bcfe8e86af8f"
  },
  {
    "path": "docs/milestone60-20261113/sources/nist-international-acre-metadata.json",
    "blob": "4bdc0bb4d3117ba5595a689086148b7eb83b81f0",
    "sha256": "7126320f07b399101115fb198609e277738e9ede3676744bb11b6b9ebcb03945"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7.json",
    "blob": "c11694a779be726415cbdc32c0a8b7aa48efb258",
    "sha256": "599f8d6d88519cd0051d656dd9756b8880d19008ed5bc0f28a99ac1f1fc467a7"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-v1.json",
    "blob": "cfc74214ad644a50195090805619c1426da5bfb9",
    "sha256": "cb694c0e4d562ed58e807a5c969223cd723380349648acbac741fba843cb83db"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-v2.json",
    "blob": "2ef8bc03791fad07bd7e6c9e35e79c237e3c8daa",
    "sha256": "6fd28281fca50833b00af771d44c7c369a4a970a4dd7b257fa6e597c591dad1c"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-v3.json",
    "blob": "821840c9e2fb9ef2df95928ba8c67b9f0df51043",
    "sha256": "f3bcdf197dcc5a32b5b8340f3fc780db9b8b9fb5de749aa894d9020a44b75489"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-v4.json",
    "blob": "0c138c2348564549ee44a20bdd080e969637d534",
    "sha256": "a1f50f89cb301a5ddc15040d3dd06869119af3d669a2ade4044ff920013265f7"
  },
  {
    "path": "docs/milestone60-20261113/source-attempts/app5-g2-capture63-unqualified.json",
    "blob": "fda4268d91c11ff843a17067df56960d634c4371",
    "sha256": "e655127af42348972128a97eacfd4415cd3922fb192c437a61a9b65cccb93b0b"
  },
  {
    "path": "docs/milestone60-20261113/source-attempts/app5-g2-authority-candidate-unqualified.mjs",
    "blob": "5aa12d11e8dfaa431757a6c1b5317f548d75b9dd",
    "sha256": "3583f921817b41da9f9b9e90d730f7672810ff3881776240289a4cc85ee7beee"
  },
  {
    "path": "docs/milestone60-20261113/source-attempts/app5-stage7-policy-v4.mjs",
    "blob": "fa53df0058e3b75a0840aac626e97c6d2dfc9735",
    "sha256": "1e8b2df26bc4ffb4b72b4ac1a19bf1e42f1bc542e0e3ee6919014a3ebea5b304"
  },
  {
    "path": "docs/milestone60-20261113/source-attempts/app4-g1-capture63-unqualified.json",
    "blob": "1e9d5f5120760184143dbb0bdf71f55a0ea03c82",
    "sha256": "6a2a011f49cd33af30d05db732c4d63f960b63ac73bf10cd1c1a1e56b1526e71"
  },
  {
    "path": "docs/milestone60-20261113/source-attempts/app4-g1-authority-candidate-unqualified.mjs",
    "blob": "84702c2d1acae04f0ee7b302b51cc852e377eb1d",
    "sha256": "99c0d02b6784cc44e958a87a52bdffdb5047c8248d69e42efeff66a0978504c4"
  },
  {
    "path": "docs/milestone60-20261113/source-attempts/app4-stage7-policy-v3.mjs",
    "blob": "d0cab31fed6e81ce76fc86d9e4b6a36d47e33fc7",
    "sha256": "5f2bc49afecdc02f9e9e10b18010cdbcd976fae795943a1955d1a2d72fec459b"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-policy-v1.mjs",
    "blob": "fb10d27a432f0be8570b4b1c3d92d03add0210fb",
    "sha256": "060adf0a832705234498e8dbf89a191c1f881a2c581ce8136b6c9d376d914b3a"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "b248df2fe674c5dcd2c70e193dbb328f92e7423f",
    "sha256": "f3d99ef0b2439f65189f4331c052301459fdf38d7f1c45327b588bd8c86c6e4c"
  },
  {
    "path": "src/components/milestone-calculator-analysis.test.tsx",
    "blob": "b44ec1fb507ba7ba71da54f24448fcaeb2139940",
    "sha256": "548cc5bed7e39ef9da812dc4f8dbe7615a48ddd7411f3128af2fc02534dd3f6c"
  },
  {
    "path": "src/components/milestone-calculator-analysis.tsx",
    "blob": "7425a5d3fec9e9eaeeec5737bab240c9be318bea",
    "sha256": "ce30d5dccb97f9d8d01266a43a8c0361ae41659eb6a38b211e941fc264cf46ff"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "014a4cf380ca2bd195a6aac422a640a7d379bfd0",
    "sha256": "87f59ea7f2f36fbec2aa637df21a351397d352eab00a2ffc6104e4867749b675"
  },
  {
    "path": "src/lib/calculator-factory/completion/conversion-next.test.ts",
    "blob": "0d66783db8aaaba9695fa6777f3ebfcba57dbf76",
    "sha256": "3517e30f9733cb9ec1d74208c6c353dc28346b5bf4bb819c4c30e0aa220120e1"
  },
  {
    "path": "src/lib/calculator-factory/completion/conversion-next.ts",
    "blob": "b2d63c323ed5c98403b7d85fb50b367efc5de117",
    "sha256": "5897a8e0ac464df7cc715fe50018644e8729f4a98d12b1dd68437ae5f7855350"
  },
  {
    "path": "src/lib/calculator-factory/completion/math-next.test.ts",
    "blob": "cd5b0300920efce030f877038665b31c42bf41e4",
    "sha256": "34a97da945503b43d93b43279db6fd411444aff5dc1f82d36739c46f9c459ac3"
  },
  {
    "path": "src/lib/calculator-factory/completion/math-next.ts",
    "blob": "8786923ff309d03afb8e92e4c17b69e36e564c5d",
    "sha256": "1c30d83f9e82ca111feb129dae95c27b39e5f1902e5aed81f293abc557ba8201"
  },
  {
    "path": "src/lib/calculator-factory/completion/milestone-native.test.ts",
    "blob": "8f8baeb3a678172bd2617134387b81182a56cad1",
    "sha256": "f596b9ce4f12489bb74099faac4bf087c98239e6f548d6b38ffa3fb71e71fad6"
  },
  {
    "path": "src/lib/calculator-factory/completion/milestone-registry.test.ts",
    "blob": "04587e352d28553869891fa8d8051783018bdbf0",
    "sha256": "4f55590d644ded84427c8a41b0c3e2c8d8b66406613ee07280396bff4d1a4eed"
  },
  {
    "path": "src/lib/calculator-factory/completion/milestone-source.test.ts",
    "blob": "19379698a8ce3e6c35fab44d5346210d4551165e",
    "sha256": "7167a873b7679df3181e11fd527ae5e05a1dcf495649369a04416dbba4c4fb8f"
  },
  {
    "path": "src/lib/calculator-factory/completion/physics-domain.ts",
    "blob": "e91bac9670bd578cc259bfbcd99ca3ed8a8c01db",
    "sha256": "95aacbc7352d634ec58980eb8ccb7bcd3130325fcc313a033df0e32ea0b3d59a"
  },
  {
    "path": "src/lib/calculator-factory/completion/physics.ts",
    "blob": "403b0c7c1038d3489bf7ce13d9c367c3d76662ec",
    "sha256": "3af55773af7700ac2995bdc46d90714ff55bd1a2914dc4d082cf8b75b5798a30"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "83b86d665f191a9b4a004f546d67ef8b9e7a476f",
    "sha256": "1aa8e998e89990e4ac06cef1a75ffb5c870d69e8b0a5c0ee565724b42358d032"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "fd0267ce1a7cb017f940b172888a96568c8d01e6",
    "sha256": "7c214aeabc271bcbe4a5c25621fc5c6c678b74fec51a35933026e68c8d066f96"
  },
  {
    "path": "src/lib/completion-wave-20261113/conversion-workflows.ts",
    "blob": "513d226e17132f44236b6a76ab42684d0c5646ae",
    "sha256": "87e62d2ca3340b1243bb1dcb14f546fd053533a8198a8937f448c4a5af835215"
  },
  {
    "path": "src/lib/cooking-snapshot-verification.test.ts",
    "blob": "83d7f9127075cdcf02a8f11d8f792e0e5c0af22c",
    "sha256": "3bdbf8a7f86c57d2b09ad500964c80324eb519f873955ac220b7b906c233570d"
  },
  {
    "path": "src/lib/cooking-snapshot-verification.ts",
    "blob": "3a01d2eb63fe9086925228c8b3ab0905c9fb93cf",
    "sha256": "a3591c9ece41e7fb6bccf2756dca8e025fe06d5c41683c8ca9db3478dd2a3170"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "0bb4a09821ffc21ca47f1819e468c11d46a930a2",
    "sha256": "171aa03828ca3adb5880123d0c303ca6b98d598c70ab906baef3c59ef5ed61c9"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "4c598859b6a2aeaab317b91aaf0a489f5e343264",
    "sha256": "331dfd6108b7028dbb5799c7f2b8e5e002da5b8a5ab06d2d1e02461f63115102"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "2abab8b66397fa0a0a0a73c0aef7d57dce473bca",
    "sha256": "0d96f1463c62163d8e070276f5dd5445e9ccd024ba6312f94333dc425167578a"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision64.json",
    "blob": "faed97347c251db594d80536daefb38122e09d26",
    "sha256": "3e4f6533559a95760c3c035a9b74a6b54d7b019ebd68829ce605706af8a47466"
  }
]);
export const accepted=Object.freeze([...new Map([...acceptedStage6,...acceptedStage7].map(row=>[row.path,row])).values()]);
export function verifyParallelAuthority(read,git){
 assert(accepted.length>0,'Reviewed parallel source authority is not installed');
 // Static independently pinned objects only; all live checks below still execute.
 if(typeof git.preloadBlobs==='function')git.preloadBlobs(accepted.map(record=>record.blob));
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[0-9a-f]{40}$/);
 if(typeof git.preloadPaths==='function')git.preloadPaths(accepted.map(record=>({ref:head,path:record.path,blob:record.blob})));
 for(const record of accepted){assert.equal(git(['rev-parse',head+':'+record.path]).toString().trim(),record.blob,'Independent parallel HEAD authority differs: '+record.path);const bytes=git(['cat-file','blob',record.blob]);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);assert(read(record.path).equals(bytes),'Independent current target bytes differ: '+record.path);}
 return true;
}
