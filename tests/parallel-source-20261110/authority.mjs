import {lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
import {provePinnedSourceStage8} from '../milestone100-20261114/source-stage8-activation.mjs';
import {sourceStage8HistoricalView} from '../milestone100-20261114/source-stage8.mjs';
import {accepted as retainedStage8Authority} from '../../docs/milestone100-20261114/source-qualified-authority68.mjs';
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
export const additionalStage7V1BootstrapRefs=Object.freeze([
  "0e47958a48f73433a821cbf6387029be0ec6825f",
  "2d5d105892134f8af46fc2a02edd5932c431b845",
  "8ecc4d72020228deaa4d8528b1e1e75cd28d6eb6"
]);
export const additionalStage7V6BootstrapRefs=Object.freeze([
  "0e47958a48f73433a821cbf6387029be0ec6825f",
  "2d5d105892134f8af46fc2a02edd5932c431b845",
  "8ecc4d72020228deaa4d8528b1e1e75cd28d6eb6",
  "9c1a6cae1dd5b8b922cbb23585956b69e5e57d14",
  "a251c3b8a60faf7bc77fe456581ecd54bda01bd0",
  "afceea875f7c29c8db75b2b4784b659dcf172b1f",
  "f00acbfdb882688eb1d0c22bc68305eb4984ac41"
]);
export const additionalStage7V7BootstrapRefs=Object.freeze([
  "0e47958a48f73433a821cbf6387029be0ec6825f",
  "2d5d105892134f8af46fc2a02edd5932c431b845",
  "49cac9941e81646aca6ef4a7e70acd7374e15d92",
  "8ecc4d72020228deaa4d8528b1e1e75cd28d6eb6",
  "9c1a6cae1dd5b8b922cbb23585956b69e5e57d14",
  "a251c3b8a60faf7bc77fe456581ecd54bda01bd0",
  "afceea875f7c29c8db75b2b4784b659dcf172b1f",
  "f00acbfdb882688eb1d0c22bc68305eb4984ac41",
  "f35d489f32f72b465fdf3f548e918bc89a9a2350"
]);
export const additionalStage7V8BootstrapRefs=Object.freeze([
  "0e47958a48f73433a821cbf6387029be0ec6825f",
  "2d5d105892134f8af46fc2a02edd5932c431b845",
  "36434788baf38632ca6e04d9b8867dc92e7ef1b8",
  "49cac9941e81646aca6ef4a7e70acd7374e15d92",
  "8ecc4d72020228deaa4d8528b1e1e75cd28d6eb6",
  "9c1a6cae1dd5b8b922cbb23585956b69e5e57d14",
  "a251c3b8a60faf7bc77fe456581ecd54bda01bd0",
  "afceea875f7c29c8db75b2b4784b659dcf172b1f",
  "c3aaff5bf19f2d073cf3aeb7ba9d0cdf74719b1c",
  "f00acbfdb882688eb1d0c22bc68305eb4984ac41",
  "f35d489f32f72b465fdf3f548e918bc89a9a2350"
]);
export const additionalStage7V9BootstrapRefs=Object.freeze([
  "00cc3b859dfd7db79c3ebe475ce95b9e67a492a2",
  "0e47958a48f73433a821cbf6387029be0ec6825f",
  "2d5d105892134f8af46fc2a02edd5932c431b845",
  "36434788baf38632ca6e04d9b8867dc92e7ef1b8",
  "49cac9941e81646aca6ef4a7e70acd7374e15d92",
  "63d2214c731332540c48d2c64c3793294d515980",
  "8ecc4d72020228deaa4d8528b1e1e75cd28d6eb6",
  "9c1a6cae1dd5b8b922cbb23585956b69e5e57d14",
  "a251c3b8a60faf7bc77fe456581ecd54bda01bd0",
  "afceea875f7c29c8db75b2b4784b659dcf172b1f",
  "c3aaff5bf19f2d073cf3aeb7ba9d0cdf74719b1c",
  "f00acbfdb882688eb1d0c22bc68305eb4984ac41",
  "f35d489f32f72b465fdf3f548e918bc89a9a2350"
]);
export const additionalStage7BootstrapRefs=Object.freeze([...new Set([...additionalStage7V1BootstrapRefs,...additionalStage7V6BootstrapRefs,...additionalStage7V7BootstrapRefs,...additionalStage7V8BootstrapRefs,...additionalStage7V9BootstrapRefs])]);
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
export const acceptedStage7V6=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "06a041bbaa9e76ff81cbf7d7562a1493fd61d16f",
    "sha256": "88d633bc2167f69c6a394e10b1a53c15c79af666ac9404b34fafc0491ec61637"
  },
  {
    "path": "scripts/product-completion-lineage.mjs",
    "blob": "447d12af4d80f65fe51d4e3fc9cb5bb81d427ff8",
    "sha256": "7792ebaaa6d9cf1ffe073155a3ab2814cb41c654d5079fb7ef67baf209f33b29"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight-stage.mjs",
    "blob": "158d3fc765be6aaace80a59ab5c40b7f199d1cf5",
    "sha256": "bf0e02bdf837549b05e58e7fcbf074508f5d04a30e0e49961dd4884b40eaae74"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight.test.mjs",
    "blob": "34662320c9ef0f78bd3392a75a390bd247125314",
    "sha256": "d8b7c9d9b66bd824808b8ce29e98a73023375c1c49a1417305f565eef697d575"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "fd55e6ce39308bcaaef7ab84963f57b9501c65b4",
    "sha256": "bb9fd8a35b21848bc8deaeb37d2c1d121c5190fa15092dd0e7582bdba0960324"
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
    "blob": "7ecaa493a5fa562dd8b3c8cc731eeb6420dfdd8a",
    "sha256": "d8d8fdcdf7085094b4146c0e157421fc84432cdce86a3a03952da96094e7cfb5"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "f28bc7c9118562dabc4f3461a005153770c5aac3",
    "sha256": "7720b90e778ed83d80858b71a4f877d6f46b471d1271d17a961a8fb7c360341a"
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
    "blob": "8f88d28b98f3b1da1d6362bfbb7633249d9fd545",
    "sha256": "2aac1222726b3cd49c5345b0ea3569da24bd49c7e2bc1b6bb6c321642557ba2e"
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
    "blob": "38ab5539565819a8de1898708931b2938cd7df65",
    "sha256": "a076bf0d798badd5f4c84def1309946c9da497e8a997220ca5d2aa94bc557bb5"
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
    "path": "tests/milestone60-20261113/source-proof-capture-stage7-v6.mjs",
    "blob": "e50a72d3f3aab6cd3cbf466cb7ec41d464827040",
    "sha256": "c604db4b425f65db8419f25bc845b501c7985e3f790297111f5dfef07ce1670c"
  },
  {
    "path": "tests/milestone60-20261113/source-capture-stage7-v6.mjs",
    "blob": "6a887b3b4229b69daf1fe684dc1b6519938c5608",
    "sha256": "3a232c867f4d8f1dc669a7c08fc2a2df2555d4b010435df6e828f0fedfcdd5fb"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-policy-v6.mjs",
    "blob": "36cea5e476b5f315ed7b2568105c2234ec0b1573",
    "sha256": "21da6a71487742520b3a19e6724ef9fd01adb0d4bd6a6fb07e50b566a19fc2d7"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-v6-preservation.test.mjs",
    "blob": "664074165e3abb8ebcd45fcf773cadf004ce2584",
    "sha256": "f396b56db3ea72f95f55db2ed58b25aec8eab1ba945cbc24cf3241a441192acf"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-v6.json",
    "blob": "60a1768be99f8ac71545dd32f474db3d074a92e8",
    "sha256": "566f198270a3e33a20ffce457ed4caa6c070e10aa9ec78a8c6ada7b67dcac261"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-qualified-authority64.mjs",
    "blob": "398e63f1f3e7c465856ea9958095d2f5269f046d",
    "sha256": "c4a951c795d43b20715d5b1ffeb1afd8d5fcea295bb3d72ffb3a56b7676813f2"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision64.json",
    "blob": "faed97347c251db594d80536daefb38122e09d26",
    "sha256": "3e4f6533559a95760c3c035a9b74a6b54d7b019ebd68829ce605706af8a47466"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.test.mjs",
    "blob": "cac4de7d68886880726e0cfa1753ae4dd817f615",
    "sha256": "eeb388e769d43344e0fedb08873d3c9700b659d829c6399d2f94d4449fb9b92a"
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
    "blob": "c62503b27346cd82dfa5cc58171d7234360e0b8d",
    "sha256": "29e220ade77b6ca5bfc0715e261fbe71190b15b983aeb2fa78303effed79e14b"
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
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "32c051c63b2a12da77366e64bfc3d41606358354",
    "sha256": "c29305d172e6010148a527154f2bf983f578893ccd108c85264029aa04612674"
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
    "path": "docs/parallel-source-20261110/capture-revision65.json",
    "blob": "ed9e03abfaefc51e940d06b6d49b36ba24ffdaed",
    "sha256": "ce3894d2ceab616e21a7f424867c128bbdd981583a5b7c2070131ac55a74875c"
  }
]);
export const acceptedStage7V7=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "06a041bbaa9e76ff81cbf7d7562a1493fd61d16f",
    "sha256": "88d633bc2167f69c6a394e10b1a53c15c79af666ac9404b34fafc0491ec61637"
  },
  {
    "path": "scripts/product-completion-lineage.mjs",
    "blob": "447d12af4d80f65fe51d4e3fc9cb5bb81d427ff8",
    "sha256": "7792ebaaa6d9cf1ffe073155a3ab2814cb41c654d5079fb7ef67baf209f33b29"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight-stage.mjs",
    "blob": "158d3fc765be6aaace80a59ab5c40b7f199d1cf5",
    "sha256": "bf0e02bdf837549b05e58e7fcbf074508f5d04a30e0e49961dd4884b40eaae74"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight.test.mjs",
    "blob": "34662320c9ef0f78bd3392a75a390bd247125314",
    "sha256": "d8b7c9d9b66bd824808b8ce29e98a73023375c1c49a1417305f565eef697d575"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "fd55e6ce39308bcaaef7ab84963f57b9501c65b4",
    "sha256": "bb9fd8a35b21848bc8deaeb37d2c1d121c5190fa15092dd0e7582bdba0960324"
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
    "blob": "7ecaa493a5fa562dd8b3c8cc731eeb6420dfdd8a",
    "sha256": "d8d8fdcdf7085094b4146c0e157421fc84432cdce86a3a03952da96094e7cfb5"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "befca1f90412d49dd55f4ccdea70756bd0eb82cf",
    "sha256": "4b4245c38702fd41b3833d1555711e9ea705046ae5458c3d72891d967304b06f"
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
    "blob": "8f88d28b98f3b1da1d6362bfbb7633249d9fd545",
    "sha256": "2aac1222726b3cd49c5345b0ea3569da24bd49c7e2bc1b6bb6c321642557ba2e"
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
    "blob": "38ab5539565819a8de1898708931b2938cd7df65",
    "sha256": "a076bf0d798badd5f4c84def1309946c9da497e8a997220ca5d2aa94bc557bb5"
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
    "path": "tests/milestone60-20261113/source-proof-capture-stage7-v6.mjs",
    "blob": "e50a72d3f3aab6cd3cbf466cb7ec41d464827040",
    "sha256": "c604db4b425f65db8419f25bc845b501c7985e3f790297111f5dfef07ce1670c"
  },
  {
    "path": "tests/milestone60-20261113/source-capture-stage7-v6.mjs",
    "blob": "6a887b3b4229b69daf1fe684dc1b6519938c5608",
    "sha256": "3a232c867f4d8f1dc669a7c08fc2a2df2555d4b010435df6e828f0fedfcdd5fb"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-policy-v6.mjs",
    "blob": "36cea5e476b5f315ed7b2568105c2234ec0b1573",
    "sha256": "21da6a71487742520b3a19e6724ef9fd01adb0d4bd6a6fb07e50b566a19fc2d7"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-v6-preservation.test.mjs",
    "blob": "fa46eadbe734e8604ed3f212446f72c54071580b",
    "sha256": "67e2f32ac952f270fba3a6ca1f28a1e47cd26f1fd509f37dfcb1e4c039c2998b"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-v6.json",
    "blob": "60a1768be99f8ac71545dd32f474db3d074a92e8",
    "sha256": "566f198270a3e33a20ffce457ed4caa6c070e10aa9ec78a8c6ada7b67dcac261"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-qualified-authority64.mjs",
    "blob": "398e63f1f3e7c465856ea9958095d2f5269f046d",
    "sha256": "c4a951c795d43b20715d5b1ffeb1afd8d5fcea295bb3d72ffb3a56b7676813f2"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision64.json",
    "blob": "faed97347c251db594d80536daefb38122e09d26",
    "sha256": "3e4f6533559a95760c3c035a9b74a6b54d7b019ebd68829ce605706af8a47466"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.test.mjs",
    "blob": "cac4de7d68886880726e0cfa1753ae4dd817f615",
    "sha256": "eeb388e769d43344e0fedb08873d3c9700b659d829c6399d2f94d4449fb9b92a"
  },
  {
    "path": "tests/milestone60-20261113/source-proof-capture-stage7-v7.mjs",
    "blob": "ce8fac0f850188a2725bf265e44a42e8ce53f9da",
    "sha256": "7fb760aec49492e0206d17a3ceb7e6eb54d9d202408c2920b1511f632d52df7a"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-qualified-authority65.mjs",
    "blob": "b2a71dd91b5d34c1e3271556004e258559fe7ef9",
    "sha256": "7df9a80f58991d4cbd4b68758de242e62161088e01878ce318ed0273eca76691"
  },
  {
    "path": "docs/milestone60-20261113/source-immutable-prefetch-hints.json",
    "blob": "b0d496e9f6ced294cdecc175321bc8abec618dd2",
    "sha256": "a954aa0522f24041919d1589942a6ef5c71054765e0a594a56d1adc45978b99f"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision65.json",
    "blob": "ed9e03abfaefc51e940d06b6d49b36ba24ffdaed",
    "sha256": "ce3894d2ceab616e21a7f424867c128bbdd981583a5b7c2070131ac55a74875c"
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
    "blob": "c62503b27346cd82dfa5cc58171d7234360e0b8d",
    "sha256": "29e220ade77b6ca5bfc0715e261fbe71190b15b983aeb2fa78303effed79e14b"
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
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "32c051c63b2a12da77366e64bfc3d41606358354",
    "sha256": "c29305d172e6010148a527154f2bf983f578893ccd108c85264029aa04612674"
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
    "path": "docs/parallel-source-20261110/capture-revision66.json",
    "blob": "15666b09d784c9e72ac45dbec7f02c7577b283ec",
    "sha256": "d7ef794bebb51be6d27cd17432db51ee13fd73d19c47ab9f6e53740de06a4a4b"
  }
]);
export const acceptedStage7V8=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "06a041bbaa9e76ff81cbf7d7562a1493fd61d16f",
    "sha256": "88d633bc2167f69c6a394e10b1a53c15c79af666ac9404b34fafc0491ec61637"
  },
  {
    "path": "scripts/product-completion-lineage.mjs",
    "blob": "447d12af4d80f65fe51d4e3fc9cb5bb81d427ff8",
    "sha256": "7792ebaaa6d9cf1ffe073155a3ab2814cb41c654d5079fb7ef67baf209f33b29"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight-stage.mjs",
    "blob": "158d3fc765be6aaace80a59ab5c40b7f199d1cf5",
    "sha256": "bf0e02bdf837549b05e58e7fcbf074508f5d04a30e0e49961dd4884b40eaae74"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight.test.mjs",
    "blob": "34662320c9ef0f78bd3392a75a390bd247125314",
    "sha256": "d8b7c9d9b66bd824808b8ce29e98a73023375c1c49a1417305f565eef697d575"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "fd55e6ce39308bcaaef7ab84963f57b9501c65b4",
    "sha256": "bb9fd8a35b21848bc8deaeb37d2c1d121c5190fa15092dd0e7582bdba0960324"
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
    "blob": "7ecaa493a5fa562dd8b3c8cc731eeb6420dfdd8a",
    "sha256": "d8d8fdcdf7085094b4146c0e157421fc84432cdce86a3a03952da96094e7cfb5"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "b869bf34ab0f5efba2c76e111da1974b6f7789b4",
    "sha256": "77c4b23b120de7f2eef9fd2ebec554e540924abbf660d41b933d17fbc0675a57"
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
    "blob": "8f88d28b98f3b1da1d6362bfbb7633249d9fd545",
    "sha256": "2aac1222726b3cd49c5345b0ea3569da24bd49c7e2bc1b6bb6c321642557ba2e"
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
    "blob": "38ab5539565819a8de1898708931b2938cd7df65",
    "sha256": "a076bf0d798badd5f4c84def1309946c9da497e8a997220ca5d2aa94bc557bb5"
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
    "path": "tests/milestone60-20261113/source-proof-capture-stage7-v6.mjs",
    "blob": "e50a72d3f3aab6cd3cbf466cb7ec41d464827040",
    "sha256": "c604db4b425f65db8419f25bc845b501c7985e3f790297111f5dfef07ce1670c"
  },
  {
    "path": "tests/milestone60-20261113/source-capture-stage7-v6.mjs",
    "blob": "6a887b3b4229b69daf1fe684dc1b6519938c5608",
    "sha256": "3a232c867f4d8f1dc669a7c08fc2a2df2555d4b010435df6e828f0fedfcdd5fb"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-policy-v6.mjs",
    "blob": "36cea5e476b5f315ed7b2568105c2234ec0b1573",
    "sha256": "21da6a71487742520b3a19e6724ef9fd01adb0d4bd6a6fb07e50b566a19fc2d7"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-v6-preservation.test.mjs",
    "blob": "d36e3ca42290d01de8180e85509950199a038866",
    "sha256": "7e89214b46b6e9616cc3551b526ddda93cfe6362c6cfac6e9a121aed974720c0"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-v6.json",
    "blob": "60a1768be99f8ac71545dd32f474db3d074a92e8",
    "sha256": "566f198270a3e33a20ffce457ed4caa6c070e10aa9ec78a8c6ada7b67dcac261"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-qualified-authority64.mjs",
    "blob": "398e63f1f3e7c465856ea9958095d2f5269f046d",
    "sha256": "c4a951c795d43b20715d5b1ffeb1afd8d5fcea295bb3d72ffb3a56b7676813f2"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision64.json",
    "blob": "faed97347c251db594d80536daefb38122e09d26",
    "sha256": "3e4f6533559a95760c3c035a9b74a6b54d7b019ebd68829ce605706af8a47466"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.test.mjs",
    "blob": "75a277b676fcca60266a8c6bd4966252f80d300c",
    "sha256": "89c25a8b04e303e3a61a9b089873f5007d8c33185bb03e42fe337a07b050e140"
  },
  {
    "path": "tests/milestone60-20261113/source-proof-capture-stage7-v7.mjs",
    "blob": "ce8fac0f850188a2725bf265e44a42e8ce53f9da",
    "sha256": "7fb760aec49492e0206d17a3ceb7e6eb54d9d202408c2920b1511f632d52df7a"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-qualified-authority65.mjs",
    "blob": "b2a71dd91b5d34c1e3271556004e258559fe7ef9",
    "sha256": "7df9a80f58991d4cbd4b68758de242e62161088e01878ce318ed0273eca76691"
  },
  {
    "path": "docs/milestone60-20261113/source-immutable-prefetch-hints.json",
    "blob": "b0d496e9f6ced294cdecc175321bc8abec618dd2",
    "sha256": "a954aa0522f24041919d1589942a6ef5c71054765e0a594a56d1adc45978b99f"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision65.json",
    "blob": "ed9e03abfaefc51e940d06b6d49b36ba24ffdaed",
    "sha256": "ce3894d2ceab616e21a7f424867c128bbdd981583a5b7c2070131ac55a74875c"
  },
  {
    "path": "tests/milestone60-20261113/source-proof-capture-stage7-v8.mjs",
    "blob": "deb6fdec559827f3b47ad556e2fc6730b213c8ec",
    "sha256": "bbbfd4220324e1f5d6e33b5ef9e5adc4b13bfbf4c76a69f6fd151915363d0b44"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-qualified-authority66.mjs",
    "blob": "b17ad92955b8f15479bc5a6c0c80aef10f26c623",
    "sha256": "6d7592f29200b26a498c333b0876452fe9a305660d9caf245b72243ac9d232e2"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.mjs",
    "blob": "0f057d302dd0f273037779f72ba91e73999aaf2a",
    "sha256": "333cf6162faae87d5cdd7a521183f5574f87399c50925ea2f0c8dbe2b79cfa81"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision66.json",
    "blob": "15666b09d784c9e72ac45dbec7f02c7577b283ec",
    "sha256": "d7ef794bebb51be6d27cd17432db51ee13fd73d19c47ab9f6e53740de06a4a4b"
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
    "blob": "c62503b27346cd82dfa5cc58171d7234360e0b8d",
    "sha256": "29e220ade77b6ca5bfc0715e261fbe71190b15b983aeb2fa78303effed79e14b"
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
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "32c051c63b2a12da77366e64bfc3d41606358354",
    "sha256": "c29305d172e6010148a527154f2bf983f578893ccd108c85264029aa04612674"
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
    "path": "docs/parallel-source-20261110/capture-revision67.json",
    "blob": "b67f03ff047d2324ae007307ab3b39f4d8da4f55",
    "sha256": "1d25a08384eefc54eb822598f78962e4a0120e681f3168683be6274fa0089e38"
  }
]);
export const acceptedStage7V9=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "06a041bbaa9e76ff81cbf7d7562a1493fd61d16f",
    "sha256": "88d633bc2167f69c6a394e10b1a53c15c79af666ac9404b34fafc0491ec61637"
  },
  {
    "path": "scripts/product-completion-lineage.mjs",
    "blob": "7fb5c6fe7ff77528e1189dd1b7782c5be58373ef",
    "sha256": "fa97a31d682036ad16a7276d1d4eed6650904306150ece122577ad4d373adbc9"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight-stage.mjs",
    "blob": "158d3fc765be6aaace80a59ab5c40b7f199d1cf5",
    "sha256": "bf0e02bdf837549b05e58e7fcbf074508f5d04a30e0e49961dd4884b40eaae74"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight.test.mjs",
    "blob": "34662320c9ef0f78bd3392a75a390bd247125314",
    "sha256": "d8b7c9d9b66bd824808b8ce29e98a73023375c1c49a1417305f565eef697d575"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "fd55e6ce39308bcaaef7ab84963f57b9501c65b4",
    "sha256": "bb9fd8a35b21848bc8deaeb37d2c1d121c5190fa15092dd0e7582bdba0960324"
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
    "blob": "7ecaa493a5fa562dd8b3c8cc731eeb6420dfdd8a",
    "sha256": "d8d8fdcdf7085094b4146c0e157421fc84432cdce86a3a03952da96094e7cfb5"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "1ff1a98833eada6ae3f0a16d338427e364376d17",
    "sha256": "a99bdb859ccac867c2f5ac48d6b08989baa985c1ade1d734b2c352a4168a2c73"
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
    "blob": "8f88d28b98f3b1da1d6362bfbb7633249d9fd545",
    "sha256": "2aac1222726b3cd49c5345b0ea3569da24bd49c7e2bc1b6bb6c321642557ba2e"
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
    "blob": "38ab5539565819a8de1898708931b2938cd7df65",
    "sha256": "a076bf0d798badd5f4c84def1309946c9da497e8a997220ca5d2aa94bc557bb5"
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
    "path": "tests/milestone60-20261113/source-proof-capture-stage7-v6.mjs",
    "blob": "e50a72d3f3aab6cd3cbf466cb7ec41d464827040",
    "sha256": "c604db4b425f65db8419f25bc845b501c7985e3f790297111f5dfef07ce1670c"
  },
  {
    "path": "tests/milestone60-20261113/source-capture-stage7-v6.mjs",
    "blob": "6a887b3b4229b69daf1fe684dc1b6519938c5608",
    "sha256": "3a232c867f4d8f1dc669a7c08fc2a2df2555d4b010435df6e828f0fedfcdd5fb"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-policy-v6.mjs",
    "blob": "36cea5e476b5f315ed7b2568105c2234ec0b1573",
    "sha256": "21da6a71487742520b3a19e6724ef9fd01adb0d4bd6a6fb07e50b566a19fc2d7"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-v6-preservation.test.mjs",
    "blob": "495a3ae76d278999490f4bd517586c0f40439141",
    "sha256": "6b2d4b765872c7ff20e8627d1f648bd5cfb95c029faa39b3f3023f3bc69a4b13"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-v6.json",
    "blob": "60a1768be99f8ac71545dd32f474db3d074a92e8",
    "sha256": "566f198270a3e33a20ffce457ed4caa6c070e10aa9ec78a8c6ada7b67dcac261"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-qualified-authority64.mjs",
    "blob": "398e63f1f3e7c465856ea9958095d2f5269f046d",
    "sha256": "c4a951c795d43b20715d5b1ffeb1afd8d5fcea295bb3d72ffb3a56b7676813f2"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision64.json",
    "blob": "faed97347c251db594d80536daefb38122e09d26",
    "sha256": "3e4f6533559a95760c3c035a9b74a6b54d7b019ebd68829ce605706af8a47466"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.test.mjs",
    "blob": "75a277b676fcca60266a8c6bd4966252f80d300c",
    "sha256": "89c25a8b04e303e3a61a9b089873f5007d8c33185bb03e42fe337a07b050e140"
  },
  {
    "path": "tests/milestone60-20261113/source-proof-capture-stage7-v7.mjs",
    "blob": "ce8fac0f850188a2725bf265e44a42e8ce53f9da",
    "sha256": "7fb760aec49492e0206d17a3ceb7e6eb54d9d202408c2920b1511f632d52df7a"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-qualified-authority65.mjs",
    "blob": "b2a71dd91b5d34c1e3271556004e258559fe7ef9",
    "sha256": "7df9a80f58991d4cbd4b68758de242e62161088e01878ce318ed0273eca76691"
  },
  {
    "path": "docs/milestone60-20261113/source-immutable-prefetch-hints.json",
    "blob": "b0d496e9f6ced294cdecc175321bc8abec618dd2",
    "sha256": "a954aa0522f24041919d1589942a6ef5c71054765e0a594a56d1adc45978b99f"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision65.json",
    "blob": "ed9e03abfaefc51e940d06b6d49b36ba24ffdaed",
    "sha256": "ce3894d2ceab616e21a7f424867c128bbdd981583a5b7c2070131ac55a74875c"
  },
  {
    "path": "tests/milestone60-20261113/source-proof-capture-stage7-v8.mjs",
    "blob": "deb6fdec559827f3b47ad556e2fc6730b213c8ec",
    "sha256": "bbbfd4220324e1f5d6e33b5ef9e5adc4b13bfbf4c76a69f6fd151915363d0b44"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-qualified-authority66.mjs",
    "blob": "b17ad92955b8f15479bc5a6c0c80aef10f26c623",
    "sha256": "6d7592f29200b26a498c333b0876452fe9a305660d9caf245b72243ac9d232e2"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.mjs",
    "blob": "0f057d302dd0f273037779f72ba91e73999aaf2a",
    "sha256": "333cf6162faae87d5cdd7a521183f5574f87399c50925ea2f0c8dbe2b79cfa81"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision66.json",
    "blob": "15666b09d784c9e72ac45dbec7f02c7577b283ec",
    "sha256": "d7ef794bebb51be6d27cd17432db51ee13fd73d19c47ab9f6e53740de06a4a4b"
  },
  {
    "path": "tests/milestone60-20261113/source-proof-capture-stage7-v9.mjs",
    "blob": "84bb295166d78813cd388bb2278ee7f1780c9a70",
    "sha256": "25633361085ce8796c64a4b83eddd85cb69c1f4be4a0b9024582e279a081f259"
  },
  {
    "path": "tests/milestone60-20261113/source-receipt-lineage.mjs",
    "blob": "d4ddd05089a387c33471af41ced891863b7046d1",
    "sha256": "67defe0377dc54248db2c20afdcf06dee410f7b6e1854994544cedd0a10c66d1"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-qualified-authority67.mjs",
    "blob": "9b8a853a577ffe5b424d955a732715c22569c11f",
    "sha256": "5ff20f1e234aeb17670529b66577cef1b3e6b4d85a58a0e5ea22a48571779f5a"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision67.json",
    "blob": "b67f03ff047d2324ae007307ab3b39f4d8da4f55",
    "sha256": "1d25a08384eefc54eb822598f78962e4a0120e681f3168683be6274fa0089e38"
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
    "blob": "c62503b27346cd82dfa5cc58171d7234360e0b8d",
    "sha256": "29e220ade77b6ca5bfc0715e261fbe71190b15b983aeb2fa78303effed79e14b"
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
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "32c051c63b2a12da77366e64bfc3d41606358354",
    "sha256": "c29305d172e6010148a527154f2bf983f578893ccd108c85264029aa04612674"
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
    "path": "docs/parallel-source-20261110/capture-revision68.json",
    "blob": "e2efd2425c1ac191ae95c8a96f0fbac7699932e7",
    "sha256": "e9bc59cd40b54da57bef70ccba322b22fc2bab255b31261a3a65d72cd2744fd3"
  }
]);
export const acceptedBeforeStage8=Object.freeze([...new Map([...acceptedStage6,...acceptedStage7,...acceptedStage7V6,...acceptedStage7V7,...acceptedStage7V8,...acceptedStage7V9].map(row=>[row.path,row])).values()]);
export const additionalStage8BootstrapRefs=Object.freeze(["11d38597565922ac12d1a06678288ee7d6daf863"]);
export const acceptedStage8=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "26ef2c7abc9ca54aec16e15186fec13615bf1ce9",
    "sha256": "9451144b33b3d7cb4b4e0385261c9b6612b3addda7e1a84c4761bdb75c971542"
  },
  {
    "path": "scripts/product-completion-lineage.mjs",
    "blob": "7fb5c6fe7ff77528e1189dd1b7782c5be58373ef",
    "sha256": "fa97a31d682036ad16a7276d1d4eed6650904306150ece122577ad4d373adbc9"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight-stage.mjs",
    "blob": "158d3fc765be6aaace80a59ab5c40b7f199d1cf5",
    "sha256": "bf0e02bdf837549b05e58e7fcbf074508f5d04a30e0e49961dd4884b40eaae74"
  },
  {
    "path": "tests/completion-wave-20261113/source-preflight.test.mjs",
    "blob": "34662320c9ef0f78bd3392a75a390bd247125314",
    "sha256": "d8b7c9d9b66bd824808b8ce29e98a73023375c1c49a1417305f565eef697d575"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "45e3e7f2662a5f92a96a1497077b066ab9d59c2b",
    "sha256": "ca8cbd93b132f4aff80d6dd61d4292f5e790a3ea99411b53b7f445b16983a246"
  },
  {
    "path": "tests/milestone60-20261113/source-preflight-retained-stage6.mjs",
    "blob": "738703fc7a50af92403ad4afd50126eba898d1d3",
    "sha256": "c493d787390de65afdcb1c74b3205b459f81002bffceb3405e8cde0675e65b90"
  },
  {
    "path": "tests/completion-wave-20261113/source-test-stage6.mjs",
    "blob": "c5eb99c346388f89fed89cbcd852d15a2fe4572c",
    "sha256": "6f10f57a0f0d717cfdc3237e902e4c6028c657fa8f8bb6beeb66479792d88460"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "e1a05a507a1c8c62418a74425beacfb7b65ca3a3",
    "sha256": "b3f1784df1ae6eef83b2680fb0d57e3b1ab60af32cfd4a7d6be681c81289186d"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "94acd3fdc5881513fe16538a76268d14eaf38376",
    "sha256": "042167917b820e1e03f27e881e34833f1fd7aa5deb3cd298fc91547bb21b4c9b"
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
    "blob": "37a37e8cde1b3e25f55810db0618939b549041d2",
    "sha256": "753ead473e2af2cc17b004ea308388abcdea0511f5e33b1d3d622bbe5db41157"
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
    "blob": "b55215e39056b777a510d75e7a868f4396f1b4f8",
    "sha256": "a335692142d03661a1dafeb9e2c112a9626e3c0e651140a3c6f049b8d5622805"
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
    "path": "tests/milestone60-20261113/source-proof-capture-stage7-v6.mjs",
    "blob": "e50a72d3f3aab6cd3cbf466cb7ec41d464827040",
    "sha256": "c604db4b425f65db8419f25bc845b501c7985e3f790297111f5dfef07ce1670c"
  },
  {
    "path": "tests/milestone60-20261113/source-capture-stage7-v6.mjs",
    "blob": "6a887b3b4229b69daf1fe684dc1b6519938c5608",
    "sha256": "3a232c867f4d8f1dc669a7c08fc2a2df2555d4b010435df6e828f0fedfcdd5fb"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-policy-v6.mjs",
    "blob": "36cea5e476b5f315ed7b2568105c2234ec0b1573",
    "sha256": "21da6a71487742520b3a19e6724ef9fd01adb0d4bd6a6fb07e50b566a19fc2d7"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-v6-preservation.test.mjs",
    "blob": "495a3ae76d278999490f4bd517586c0f40439141",
    "sha256": "6b2d4b765872c7ff20e8627d1f648bd5cfb95c029faa39b3f3023f3bc69a4b13"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-v6.json",
    "blob": "60a1768be99f8ac71545dd32f474db3d074a92e8",
    "sha256": "566f198270a3e33a20ffce457ed4caa6c070e10aa9ec78a8c6ada7b67dcac261"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-qualified-authority64.mjs",
    "blob": "398e63f1f3e7c465856ea9958095d2f5269f046d",
    "sha256": "c4a951c795d43b20715d5b1ffeb1afd8d5fcea295bb3d72ffb3a56b7676813f2"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision64.json",
    "blob": "faed97347c251db594d80536daefb38122e09d26",
    "sha256": "3e4f6533559a95760c3c035a9b74a6b54d7b019ebd68829ce605706af8a47466"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.test.mjs",
    "blob": "85fe8034cf51aee85a799dadd6c215b9933db9c8",
    "sha256": "337f6767687676e8016dedeefb052a22aa483f5b42bda0d879677bc1a8d13ca2"
  },
  {
    "path": "tests/milestone60-20261113/source-proof-capture-stage7-v7.mjs",
    "blob": "ce8fac0f850188a2725bf265e44a42e8ce53f9da",
    "sha256": "7fb760aec49492e0206d17a3ceb7e6eb54d9d202408c2920b1511f632d52df7a"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-qualified-authority65.mjs",
    "blob": "b2a71dd91b5d34c1e3271556004e258559fe7ef9",
    "sha256": "7df9a80f58991d4cbd4b68758de242e62161088e01878ce318ed0273eca76691"
  },
  {
    "path": "docs/milestone60-20261113/source-immutable-prefetch-hints.json",
    "blob": "b0d496e9f6ced294cdecc175321bc8abec618dd2",
    "sha256": "a954aa0522f24041919d1589942a6ef5c71054765e0a594a56d1adc45978b99f"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision65.json",
    "blob": "ed9e03abfaefc51e940d06b6d49b36ba24ffdaed",
    "sha256": "ce3894d2ceab616e21a7f424867c128bbdd981583a5b7c2070131ac55a74875c"
  },
  {
    "path": "tests/milestone60-20261113/source-proof-capture-stage7-v8.mjs",
    "blob": "deb6fdec559827f3b47ad556e2fc6730b213c8ec",
    "sha256": "bbbfd4220324e1f5d6e33b5ef9e5adc4b13bfbf4c76a69f6fd151915363d0b44"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-qualified-authority66.mjs",
    "blob": "b17ad92955b8f15479bc5a6c0c80aef10f26c623",
    "sha256": "6d7592f29200b26a498c333b0876452fe9a305660d9caf245b72243ac9d232e2"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.mjs",
    "blob": "0f057d302dd0f273037779f72ba91e73999aaf2a",
    "sha256": "333cf6162faae87d5cdd7a521183f5574f87399c50925ea2f0c8dbe2b79cfa81"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision66.json",
    "blob": "15666b09d784c9e72ac45dbec7f02c7577b283ec",
    "sha256": "d7ef794bebb51be6d27cd17432db51ee13fd73d19c47ab9f6e53740de06a4a4b"
  },
  {
    "path": "tests/milestone60-20261113/source-proof-capture-stage7-v9.mjs",
    "blob": "84bb295166d78813cd388bb2278ee7f1780c9a70",
    "sha256": "25633361085ce8796c64a4b83eddd85cb69c1f4be4a0b9024582e279a081f259"
  },
  {
    "path": "tests/milestone60-20261113/source-receipt-lineage.mjs",
    "blob": "d4ddd05089a387c33471af41ced891863b7046d1",
    "sha256": "67defe0377dc54248db2c20afdcf06dee410f7b6e1854994544cedd0a10c66d1"
  },
  {
    "path": "docs/milestone60-20261113/source-stage7-qualified-authority67.mjs",
    "blob": "9b8a853a577ffe5b424d955a732715c22569c11f",
    "sha256": "5ff20f1e234aeb17670529b66577cef1b3e6b4d85a58a0e5ea22a48571779f5a"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision67.json",
    "blob": "b67f03ff047d2324ae007307ab3b39f4d8da4f55",
    "sha256": "1d25a08384eefc54eb822598f78962e4a0120e681f3168683be6274fa0089e38"
  },
  {
    "path": "tests/five-full-contract-20261109/verify-batch.mjs",
    "blob": "abe910b712a837e8eb1bd9b4a7d63a5277b906a7",
    "sha256": "8b9d3b57a2814f99924aca5ac0236e445bd8ab69aebefde88dd6d49d97bfe09c"
  },
  {
    "path": "tests/next-cohort-auth-20261110/verify-current-successor.mjs",
    "blob": "c2c8ce6280b099d100334db0536ca7a658201d0e",
    "sha256": "58ab037e5ca7e0a4fca13ce787f04c2f365b5e53be1e4f240688634dbf97907e"
  },
  {
    "path": "tests/cohort22-closure-20261109/caller-source.test.mjs",
    "blob": "a327d556182b30912d2ea7fba0cef256e3dddca7",
    "sha256": "5c4927b18bf93c529f72a6a1fc1bafe626f69e2f084691b5bd5f252ff5370793"
  },
  {
    "path": "tests/execution-recovery-20261109/source-lineage.test.mjs",
    "blob": "32eee95f25bc65b45bebca56ba9c257be916c918",
    "sha256": "525b189319aea2f96d44b8277a1cfa5561dbff2ed8696d4b2427be726446cc80"
  },
  {
    "path": "tests/acceptance-closure-20261108/first-two-receipt.test.mjs",
    "blob": "2dadc1872941c3e1b6167bae201bde8649e29bca",
    "sha256": "ea53df16c4595003c2bce614dee66cd04cda2cac0a55eb585d555bd29b3f231a"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-consumer.test.mjs",
    "blob": "ae02aac2c84b650734740f1841f5496831d9d260",
    "sha256": "88387d0b79c91ffc450f3786e679dcfcf1e7cd3c52129e3c53d9f679aa7ad6e7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-phase.test.mjs",
    "blob": "a617cb403c071b0e73153eb19b1fd1c84921aa0c",
    "sha256": "ab633a495e4ea3f6ed44c2277c793fe67da9e6d7b311408b4b23b53cec6b3a1f"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "809fe04acd8c294a779791a8cf0bf2d24cd23e19",
    "sha256": "7e6939e384368db1000aceca512d98199b43c106082c73ca11cfa27fd166e031"
  },
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "blob": "8bcb488eda7e9260f2828bc1f17d5613b1a4cf8f",
    "sha256": "aef53bec807925ca43639b80b4f50cdc14dae5e1a768e13a7e07b29071632c4c"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "blob": "519c027d68ed9fef507827980f02ccb3c001f35a",
    "sha256": "124c3bf815f83df63bb613564844f6ebd80f2e5071665d5e4a47a71503743a72"
  },
  {
    "path": "scripts/check-current-six-candidate-evidence.mjs",
    "blob": "c7de60e11853f010fdea4b9d768bd9ede707675a",
    "sha256": "87e63317b293db1b13b2249502741d5450d32da941d942b0c684b712fd46bd35"
  },
  {
    "path": "scripts/software-closure-evidence.mjs",
    "blob": "6dee3a91b377a32f5d97258dd8033b1c32aad803",
    "sha256": "c2192974274bb587797ab85e459ea99b46a02f84b5ff01640ba047e9b4088233"
  },
  {
    "path": "tests/milestone100-20261114/receipt-source-path-stage8.mjs",
    "blob": "94927a9ef72055c1f0a29588347213de5f6c5d35",
    "sha256": "455b9f8eb654a44c83e3160be87110bba61b2a76f6dae6896c712b4518ef2700"
  },
  {
    "path": "tests/milestone100-20261114/receipt-source-path-stage8.d.mts",
    "blob": "f048163a3036de24f9e0ad0ee5f2bb8cc8d679f3",
    "sha256": "503fd703fd97941bd54e2a24d0fd685dfe5e62ec35988d140fa2f76928b1aa00"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "04d35fec1af0e7e69f8e45939551954e8e7d00d5",
    "sha256": "09d846a02989476d642a5674783be9d78c419e350444cba8dc84717e3fc98328"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-activation.mjs",
    "blob": "3fac735f00a5cb8778f56000a2b98f9fc714d7b7",
    "sha256": "6c76d5e6d9a2171c3ec2b2bb8666c3a6d8f3009fd8a74e67b58f89a52857d76d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-policy.mjs",
    "blob": "0ff93fe6b0a91c3a6936301c187a38d5e66f32d3",
    "sha256": "9002640bb5afe81b01b28a26af938166b76dcb0d653e9f4254cdb6d8b8e77806"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.test.mjs",
    "blob": "088819b49e5d59833bcdf051571662979e7e16e7",
    "sha256": "6833e02406a3bb75ba009b8d0286a872c44d0553a967b92ca9c492c0a20a4a9f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-live.test.mjs",
    "blob": "494ca1e4b05628fc39b73c21ae1ea73784fd9ea8",
    "sha256": "3a447c4eef185412da8234284cf1e6ba1d86d92874b2cc3aa14e13de66e41584"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8.mjs",
    "blob": "aa832e71cb6420ac9c87c67ef6a1459e443bd622",
    "sha256": "bd64748631509be7cab074ab9294f60c0b4cda18ab90f13da2d2f4f4d08b98d8"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.mjs",
    "blob": "3e244bfe9fcdeeeb4569314d7655d4bb38533935",
    "sha256": "37e96513847e49589ded0b6851ba5737b7fc4eba0a7576be340ef0a9fd6bd2e1"
  },
  {
    "path": "tests/completion-first-20261112/non-source-stage2.mjs",
    "blob": "090306b6335190ccf97a0b846ebb5547bbd7dbb2",
    "sha256": "ded4dae888630f1036e0a18e1756088d900de2c5942f98d17666b06bb53fa38a"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority68.mjs",
    "blob": "75fd2d0ca34e940a865013a9e3d78e3908c00fdf",
    "sha256": "786081f5301987911d4cfccd53cd5b7df31464ff511307c323e583e2a30d68b0"
  },
  {
    "path": "docs/milestone100-20261114/source-stage7-live-retained.mjs",
    "blob": "38ab5539565819a8de1898708931b2938cd7df65",
    "sha256": "a076bf0d798badd5f4c84def1309946c9da497e8a997220ca5d2aa94bc557bb5"
  },
  {
    "path": "docs/milestone100-20261114/source-current-retained.mjs",
    "blob": "3dd0050ce91c65e30597e4903f28677de669e3e9",
    "sha256": "3354576b6b05b2922477caf292fea9a3c579e1c1141914d1ced8a64861a9cbf6"
  },
  {
    "path": "docs/milestone100-20261114/source-stage8.json",
    "blob": "9353541c662310a32d87de13f77b819ac91ee557",
    "sha256": "909eb0ba738631baf9f54e28f630c539aef487234e1571cc5c25c3126eabe66c"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision68.json",
    "blob": "e2efd2425c1ac191ae95c8a96f0fbac7699932e7",
    "sha256": "e9bc59cd40b54da57bef70ccba322b22fc2bab255b31261a3a65d72cd2744fd3"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "12ac545532e9b73c34f46824ac0ddd08e52d9395",
    "sha256": "135445f9256afa56fff817e9ca9ef434ef52f74f05da1d80dd8ff2f081848f2d"
  },
  {
    "path": "src/components/saved-calculation-actions.tsx",
    "blob": "6ed37e10bc37e802ccc2aaf03a7a9b8e9af8eb52",
    "sha256": "c93c78822427b99490cec057f0b62abd2c22a55b03f56ef38682c15caedbd994"
  },
  {
    "path": "src/components/wave100-calculator-analysis.test.tsx",
    "blob": "2a8580450cf2f425b8f0dc573930d4105acfff61",
    "sha256": "c4a0204f95d6d9d42df1da544c17d638c2d136c3ef069f840b8629470c6588d0"
  },
  {
    "path": "src/components/wave100-calculator-analysis.tsx",
    "blob": "111e1ddc66e6847b82a555ac569820339faf54a7",
    "sha256": "186c3e302b7c09e667f20a4f42ea351a719987ff3f408b24d6ed2538e18268a3"
  },
  {
    "path": "src/components/wave100-history-recovery.test.tsx",
    "blob": "dfbf0f6e505f87079559f1cc00bbe61a12551dfd",
    "sha256": "99ced389b4e318a1a8265d59e34127de36cede44388a90195c7cf158d550d247"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "24a32aec0d1f5323499131406b65f7f9ca951800",
    "sha256": "1d8f22e8ee60dd0f8d5247aa1bdf7eb05e1c16e84a2d85346579868002e413df"
  },
  {
    "path": "src/lib/calculator-factory/completion/geometry-next100.test.ts",
    "blob": "112e3535911e0565b41309b159ef0423b08d5ee7",
    "sha256": "766366cf059d0bd1b8a86c736a2e97292955cb3b69bcc045a83742914f7694cc"
  },
  {
    "path": "src/lib/calculator-factory/completion/geometry-next100.ts",
    "blob": "acaeac2186f0bf3c98338e04727b9712afeed168",
    "sha256": "14c87d6620be3acbe8177444759f3cb6648634181b5ec1f52cc01804f5c92a35"
  },
  {
    "path": "src/lib/calculator-factory/completion/math-next100.test.ts",
    "blob": "81ac30fe9a42656ad5925860bb9a7469124e6fc4",
    "sha256": "6dbcd78f0247152511e242ee6725b7ba3169275ae15403facfc191a60b2bbf54"
  },
  {
    "path": "src/lib/calculator-factory/completion/math-next100.ts",
    "blob": "6781156e0192af2075a4c8af9f377172d4e3e160",
    "sha256": "8d9a40dccb383f9e4ff3898bb8cec3bcd422444485893005ee021d6745631599"
  },
  {
    "path": "src/lib/calculator-factory/completion/science-next100.test.ts",
    "blob": "6ea990e5d5321e3433a9f4405bc023daacda91e7",
    "sha256": "874aac63a8566d76aee0b91f946f369e4472ad16b0afd402abbde0a3cfa57874"
  },
  {
    "path": "src/lib/calculator-factory/completion/science-next100.ts",
    "blob": "1f907dcf556071b54b2d51ebb1aed34214ac9875",
    "sha256": "98f992fa52442c19813b87e62c51bfd51b98a8aaf8efdcd984c6a2a92c58acd3"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "04dc0b17fdfc131caa1ae97941f968e6b795a54b",
    "sha256": "423295f460100cf2dc1f70b024a3ce46417c0900e22a4a43d30757affa537584"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "7427dcd131a418e5ae776bbc3b2b929186227f35",
    "sha256": "dc8a6ce716ae2c23ad9f5b082093cc9e42daa10221edb277c82eadf68c856cb3"
  },
  {
    "path": "src/lib/cohort22-closure-evidence.test.ts",
    "blob": "713e1f9104d91410d41e832ceee173a85322f3ba",
    "sha256": "6765566485439e27e8fe321a89e545aa6fc2909ba00d1e3c2f11c206196902d8"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "1470bfec720013074c76472a971933ca377c9943",
    "sha256": "e5e67def0a809ddea13b5d2b116d128737a579336f3e3db9da9b4c1df4d1a595"
  },
  {
    "path": "src/lib/first-five-engineering-evidence.test.ts",
    "blob": "68e643ed61af4b42593479b9b7e8ad858e14eca0",
    "sha256": "d5dbfe4de18355d595b0ea0ca5563e33440b79fb4472b889fffaa1bef1c7a879"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "e12e1ef0e7ebc06ff0163c3d3412cc306ac4c02e",
    "sha256": "425b40815e864e058a362b4be335b742b2c939c48025308cbb5aa40e7cc084dc"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "54ada48ed1a836fca00fcf2a4b8e6019a38c1f8d",
    "sha256": "5cb71dd5380c47e6cac6d8b076b10047d93afef20543c4aff4f15ef1ed037842"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "1482ad7d6ea65062e662039a2d400302bbb85387",
    "sha256": "21f45f158b045b5cde625fb963922d00d3b620099556d4b84cbb7347a9de9df0"
  },
  {
    "path": "src/lib/wave100-history-verification.test.ts",
    "blob": "2d9b6a6cb523ca9e90b102fb3551be0aec78b2d2",
    "sha256": "96dfcc1523e9c898549728158d20bf21a17c1c49d38a343ed9fd6cd7a9b7c1cf"
  },
  {
    "path": "src/lib/wave100-history-verification.ts",
    "blob": "4800a0e0689d414676b825b82cbf9f128a69849e",
    "sha256": "8605c525d7f8b60638b12ff13545aebc1843d08617ba26204feacdb5f8d9fb6d"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision69.json",
    "blob": "c61d27807fe1ef6c097f2af5d2b85fa2950056df",
    "sha256": "6254e8783ce1ae8cb16fd64c30f19664c48970a15171a2b8b39238c0cbd1f2da"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-policy.mjs",
    "blob": "4fd20fede33c841a74fa9ee15a11d081fb459ae3",
    "sha256": "427a82483c05b757d490a12345c8823fe4c7267597d820fc7b1983d3242eb004"
  }
]); // Guard producer fills only after immutable candidate and independent review.
export const additionalStage8V3BootstrapRefs=Object.freeze(["6c7a166959aaaddb81c46110b8570e7ed3de97b9","b5a07bb4b7023dd9427e2edca36c36aebe665737"]);
export const acceptedStage8V3=Object.freeze([
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "f4bffd1489d7dde5ec81c86b06819f215679bc8c",
    "sha256": "14c52b52382423faffd7a8e4e8a893dd7b9fe7e19b8ed8a59e22ad27f863f23d"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "d0476caeaa3e53990c5e23a28f4bb1dd0e11d914",
    "sha256": "b8c4fbf9d0a46ccfafef9ef720ba113354beb815f9be01c7b8184c047aca32a8"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "a001f16dbb13b712f976a972c3ca99c9d8dc38d4",
    "sha256": "723fb13cacfa1cd69b5ef2c41b3dcfaa51ea23e710064f6c162fe2a6fe7cb098"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "d8eacfe06d776ba4493e591083cac014bd73e187",
    "sha256": "ca94e68b94454762a24b82e4befcd4b5c8fb777feab4f4613f7f119b39c2c634"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "0470b63186f22afb1130b43559c3ce189a97f4e1",
    "sha256": "280cbfbb1daafecf59900ce20c944007b42254b0cac7f545986ecd33aa315f02"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "5d3ab345f17b09f70468e2fdf7428dd6bb090ccd",
    "sha256": "f6ce7d73f6ed2006b865cc5b59b927719ebb164a70f9774a5e53d0d4e12e821d"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v3.mjs",
    "blob": "dc1fe7f1a38507d43e3ad9a9e5adad48d9c16587",
    "sha256": "2c16de5af5d5a9eb481c844a2e0eafff0d0618673c9c8d0477ec961dd379818e"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority69.mjs",
    "blob": "b797600afd2608566b717bd0ca1cedd727e92080",
    "sha256": "b23f60a4e6b19a73a5eda7f276618a800b53d555707f9095616fd4006cf85ca2"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision70.json",
    "blob": "88258d09fe55401f7f1bf909d950c1f412e863d4",
    "sha256": "a8a53519a679ae4cb820c12bd2818906759d08da21b8d7e67c8df1e87234f1dc"
  }
]);
export const additionalStage8V4BootstrapRefs=Object.freeze(["1f8898e4afdc88f0c13f49f5fb41c9891517efc7","f181294c69b9cb750b184fbf0c826e9efd3e79d6"]);
export const acceptedStage8V4=Object.freeze([
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "e806b0d76fca32407f4e4db70d32c7adab43503a",
    "sha256": "ebb6e8bbcdc6117bd4ad30b4733cb1bc7bcb6ba13d7563f05ddd62892e764775"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "b7f09a7b01d9741b8934f7771d10c69a4d3aee2a",
    "sha256": "ffca53e4d44b066eb5ed7f2c8849851eea850d9f36f387a89f2142e1bb8ac718"
  },
  {
    "path": "tests/milestone100-20261114/source-immutable-queries.mjs",
    "blob": "5fab2abe53c67405e9563f322bb3068ee9be7169",
    "sha256": "6b4bcd6d72d0ea831a3699aeb67296f9ef6cc5b6a027b2c427cabdac11f6c412"
  },
  {
    "path": "tests/milestone100-20261114/source-immutable-queries.test.mjs",
    "blob": "b6d28ff9c131e11e892ca4f7bc1db0b462cc0f40",
    "sha256": "82939ffc823cccb8df4e134ca1778e5b53f4742498565ad604ac291054aa342f"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v4.mjs",
    "blob": "11b588c84a28e369858d6e889af67c26f46b8cc8",
    "sha256": "0edd3e7e5208d9e5e12e63f156ad53fdb21c73e910365c1624d3c8639ea0b98d"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority70.mjs",
    "blob": "bd1ae56560eb444a765976b5dd5ffd9f7e391c73",
    "sha256": "f05dc7722cacc7c5f1734689e3fb8e801fc3e32d2d42d5ae0584d4608f85f50b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "202a85fbc2e3b9a6ab8da7c8fe5f51303e5e2bb8",
    "sha256": "c9cd7783042b72146a9c7338c6294e840de7e61ba341c00dcc794a287b0c0fa4"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "e81a0a046b241ab3202b541ace83368269fb9b9b",
    "sha256": "0b314d4b78b45e0f982ad999ffd3c759046bf149439130a3e1e9b4cc2735a2a3"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "f102b2c663efe8805abc11b059d63e533e08ced3",
    "sha256": "d495a5267dfef6c1cc766a63661458ff73ad5d7a9f4f27471d383bd698eb004a"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "0a4ff823ae582da9306886b08d9afe492f8376cd",
    "sha256": "fab2a2cb123637bed85a160761a0db97aee916626a4e3cdd103708d0a61fcffb"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision71.json",
    "blob": "6e7a2cd2a1f92597abcdae75f5a83ea212514588",
    "sha256": "7869617bcc27fe17938f48a471f7b1b7489006515d3ddeb161cb42364297a74d"
  }
]);
export const additionalStage8V5BootstrapRefs=Object.freeze(["41df815fd22b225ec54903ef5a3368eda7fb1723","a058ff261af1678854c79ecc725c54f2fc2273a1"]);
export const acceptedStage8V5=Object.freeze([
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "8a1cd37d5470de4189b1fd9958c003d61c3f2c1d",
    "sha256": "1bccdd5fe7a3e7190a269373ed0c86533dc831ad7aae1aba41389051c6929a94"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "3484aa032ac8cb176f23c5b6f458e8c282c719c2",
    "sha256": "8e05db29f071ecaa579464769899879260f6fb39ddb529b87528786ef8ef52b3"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-live.test.mjs",
    "blob": "68d0dd2c344d13d76479bfe3b36b09834c30bf5c",
    "sha256": "0655731c74de99f04e8f4ff11728fd7734c0ff7ecf2f6e8809bc6566d76e4452"
  },
  {
    "path": "tests/milestone100-20261114/source-immutable-queries.mjs",
    "blob": "be956656774e3d91755f42f7a231bb66d7a965e6",
    "sha256": "d0e017f7cd274bcf38917c7558f9b1cad187d61d390f86fc8070e58f86b17268"
  },
  {
    "path": "tests/milestone100-20261114/source-immutable-queries.test.mjs",
    "blob": "11e62ea1d63d9c3910230d95a4d5e8333ad38136",
    "sha256": "24427ec08b0d382aac8f3d74ed5ae366e5455cf66b8e222529a7bef063b13ed8"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v5.mjs",
    "blob": "17303084179a0ad69bc029f2507542ccfc3eaf58",
    "sha256": "88d7fe639143e106d1275c015e418ed02b20f5a2bfc0465facb320d9879290da"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority71.mjs",
    "blob": "54908614adff483d03d364e157eb10db6c0b507d",
    "sha256": "ce5085cee2bda7b18858c7a902c9f7a1cffe54207fb54b74ae0b2db187b63250"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "2cdab20a682a4942e67c39668b422a2560f6579b",
    "sha256": "632cc3607a5122f80fa48aefa00b72e6ba20341961a07b5dd371aad622f24619"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "4c73c225503073a73afd7d0f815d8bc8e5ff8dba",
    "sha256": "ec238702f7546250e61c6e4c2a030fe5c3beb33984d265d632bfcd293df864cf"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "25a2b2215de2abc3a6ee0b02e3188dbbf35d5a0b",
    "sha256": "240705e81fb1d3a6a98cec8f6c4045134ad01f6c60e841ff71c84a9e8c083848"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "15b349cac0a0744268f63cdbd5f5ba7d0ba00839",
    "sha256": "0185c9a4c2c2f8efd2d5caddb37a74fa325bbb53c6af09ab9357299af5c6b924"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision72.json",
    "blob": "d43e220cdaf25492b4d7517e9b93095aa3ea38f8",
    "sha256": "09969f98fba97a655a471073b35d35ba4dbef7ee802a5da4f332aab26cd0c2d4"
  }
]);
export const additionalStage8V6BootstrapRefs=Object.freeze(["27e2483b7d2ed1ad0269e7832b026e2f23509225","4beb54069f0946ddf9a92328e2b252af371a02ea"]);
export const acceptedStage8V6=Object.freeze([
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-guard.test.mjs",
    "blob": "a63e39d14fd16807a2a089d1d36bfdf6408d25dd",
    "sha256": "e93e40b7a6697ccf5cd0fc6c13c137242731b6106148d70bdb27ca994a9f0a94"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "af0d14b71cce4df5a4f8ac3875052d8bf3e4baa2",
    "sha256": "c2b0cff974e0bd44a548bbea20acf5a95b96e22b57fc19533999e039109cbf37"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "d2b2cecf8e42a6743c53bb61ea0599c1613fb09a",
    "sha256": "e66bde476703f0f59be7e533e1e0711989568b4b8d4a013337dbfc6fcc52159e"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.test.mjs",
    "blob": "53f4edd0d9cf958541d93c1d48170b88e9b11505",
    "sha256": "2ab53dd36635ca38b9f9708c91cb24c50accca13ec70a8853bb6f603f5732303"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/shortest-publication-20/caller-lineage.test.mjs",
    "blob": "27d798911f52ed77c5959a463eeab63f46a37a73",
    "sha256": "84c8d20a6a2be781351ce00580a1cee6b810a4acec71e9fd94f95b0513765585"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "fd0b09d89cd83590680447e3fbc86b9af3120cb2",
    "sha256": "c9ea12df281ce8bf6919536fd7735375fe23c7ebdccbdc66a44833b99a23131a"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "8baabf4c61ac0c161ea3b450e27e0171e7f791d8",
    "sha256": "e401046dfdff0ec0db87d33cda24e88e156ebc6bba112b9abb27cba9dc15c177"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "d19cdf09e801340a434ab1065ddf29ebb8be28dc",
    "sha256": "51d0a2e48a4dac5b84085f84a8af2c112c93b55a2f63a21bdeb0b92b747f3f2a"
  },
  {
    "path": "tests/milestone100-20261114/receipt-source-path-stage8.mjs",
    "blob": "7584952e6b68ea5635d0b3b71ae183f03f594136",
    "sha256": "6969e72605430d829d5bfff4318469a763a4a1096275950a11aab099b8af76af"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "3f1bffb561edd60dc07d9c67baba5deb6cf140ed",
    "sha256": "0b5df1a02e211c08d5485ec81298d383627b0e670f73b167a34adc10f992a31f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-saved-actions-claim.mjs",
    "blob": "0f4b8553a9ac93762799474c8306398a1d1982ef",
    "sha256": "da663c0bdf63178c71fcf2e85c6d0004cf576a014561bfb7584aafbbdb1cfa92"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-saved-actions-claim.test.mjs",
    "blob": "c2468e973ef2cfa09894c1b5114de2a0c988fa0c",
    "sha256": "868d51a2cae6b0fab1a557152c43b3c0f6ec8f7ef58c55605bf551c3a85436ab"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-test-only-successor.mjs",
    "blob": "67bc087d74b00d6f02cb0c0d7440869035aebc72",
    "sha256": "32c0a55e71d52ec45c3ffc2ec5cec999bb136ff0bf8cc373b64c4909beb755d8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-test-only-successor.test.mjs",
    "blob": "ddad03c4a54ef258fda4807507f49dc31b1a06a7",
    "sha256": "0b4e3e7a4b815caa5d368ebf0ebd9ad5c3bcb3ec45f5564999dc482f4d7d33e3"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v6.mjs",
    "blob": "3d028355a19383ceaea9455ad3bf7091e0a0f79f",
    "sha256": "0b91f58fe6920ccea6af19a1e2085e23ada943ab12e70d09bda2e8dcd4b0f6fc"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority72.mjs",
    "blob": "1746d74804984bb1caf8c506545b1b36f2285068",
    "sha256": "ada789af2ea5af7f53815a6d423b4e4ad6a721f16e00dc89ea59c1a40ef0fd1f"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "2070b2b3aea1948df4940b1b22cf160f4327b951",
    "sha256": "5df17535b7041b4897e9f66dd8dad6e1238faad73480f122758548e940f9b657"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "4f6120aae1ba09191353312009129b8934e8f2f1",
    "sha256": "f1838f0a54e0ba4f22ad63e9573e4367db94f80f2f153bbed54eeb8a906557d7"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "b71ecff5eec835413dd805a8618a81c993d5fe39",
    "sha256": "6c336b5bfa583b1b830643a76ea2a0f4081e7bef40a89bf14a805207cbf66663"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision73.json",
    "blob": "53c91c9aea56e764be3ed5a53ef5c8f7006a2199",
    "sha256": "e8db6d2370a932666f88e85dbc1f7e4acc21ef99443d698b6930a0f5cbbba76d"
  }
]);
export const additionalStage8V7BootstrapRefs=Object.freeze(["b4e862e7bceec5cc445b09e44296e266efd131de","f3d53bb69754646618d56cb47e42727ed712fa59"]);
export const acceptedStage8V7=Object.freeze([
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "fe4b52d10905b939f3a54b3f12e98766c46d7580",
    "sha256": "6269b5cc61d9390a95e749b3d512701dd1126e0360a832245dfe24ddfbe2f38a"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "9ffedd561f37152196391cfc5697b93d1238c01e",
    "sha256": "168f8fde21d942a6c48f9196891df5298c0a4f1c423b70951c0e3074ae5d8654"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "16d7b99a62c6e6b7f09e1a023585f980b5f46cfc",
    "sha256": "dfbb1b54e9a95d4e85f266337b8fe665da2a49f564e5a9b69b6336090c6476fa"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "fb649b859b949e5ed50952c86985376104f78a7a",
    "sha256": "7a6ee3f8247c7067106cc0ac84905f2c1244c365ac327635e3b35aca2e7f3ec8"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "dda20454cae141857f5f83a04ebfd6791f78b3db",
    "sha256": "0448607c999c8c140869d27661ce99dc8b165018347df59eebf8e24c75139d11"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v7.mjs",
    "blob": "4cf4a0cdfd186694a11a08cd8ac991d77b6d8e55",
    "sha256": "da53cb9a21abee9607fe0c4b6c8a52968691a8e82727200ac310057dfe1bbd4b"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority73.mjs",
    "blob": "cd51f5bd1c2b95f1bf2fd2eccd27d8b628a0ea07",
    "sha256": "77a1f01b8d4e98501065a12aa3f07743e45ab37b3143e083d8ff675db4e788b1"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "1cd55fd7a2b727f66011d9d376b9a14f48d76e49",
    "sha256": "9a3d57a435c7ecd18fb0f7150d085fcee59111b18ce2a58adc8e6df7e3f720d3"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "4d31e6fcb385b865184d89a1caac7929405f6fcf",
    "sha256": "2c149562c03251ad152f46e6b9c8a29d5f363a564aa3c41d732c7ee30e3e403c"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "5615c89bb40f14146d8afc2562a32ed1a7bf8b13",
    "sha256": "a694f7ee4d36dbee67d2d9566dcccde046c2b7571cb9210a98e6387f200d17e6"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision74.json",
    "blob": "18e26a6d227a1db582beae28d4fe9b9b8678f4ff",
    "sha256": "94f42b25bfe3edce93d046a47dac6431ad11d90896a95754d6fa4e35c2d0a9b8"
  }
]);
export const additionalStage8V8BootstrapRefs=Object.freeze(["53514d75971e67b08703af6fe7c1aa77e810ee3c","9821db428b4b5c4c52d112fa846c13e0227b6699"]);
export const acceptedStage8V8=Object.freeze([
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "0076595b2205cc67fd7d303a1046983957247ab7",
    "sha256": "b75bf9921b3c578261b7307b001186b548354d994b903c49894d197fcbf49bbc"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "175a200a85bf619b3b7501c91a1326602492fd4b",
    "sha256": "a89e9f273e553a0ac9fa2f1bd858544c9537e9f445fba03aba2a493c5eae7478"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "13665ed942e2e888a1de845a0e4562e07b2aedae",
    "sha256": "fce12281410753c9d0baef072351ff453db8eb957dc653ea72c9914f0085abfd"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "de19460a1db873cbadb098cf90d6dff158a2c46d",
    "sha256": "61bce96c3a42705fee8ae48b53776ae79c132dc5174a42197547a199d4ac1d23"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "4fbbd8505fde3a2ef584043b857ad9582f21ed5f",
    "sha256": "8b6dce91cce3901524706ac6cd7b6afc2a92caa83e87284afb0824c0f5562e47"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v8.mjs",
    "blob": "5a1fc2ea0d82c0c70b4d0a66fe77df965de8e762",
    "sha256": "00aa436a35b886a5bf11dcc80b43796cbd4a126f8b8b1d9e81599cf06f9f8726"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority74.mjs",
    "blob": "18ccc3522d12394a414751d4251c0cede8322cdb",
    "sha256": "02bc4aea2ea7cf111ac172b0e2ef32288c773028fc0812d495c5130ab57382b1"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "8ba9b9a04b810b73d8a7f245b49305b81510d23b",
    "sha256": "5a523460b51be7ec20f0ccaa1686360b45750e8c7d776175e5b65bf82d4ac02b"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "911645c5d07b2d66dc16bd71a3ded9b578255ab6",
    "sha256": "e99713a6c30b696a06e63c8d40dc0fe95559b1c64c95db7f94e124bfa0bf2a9c"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "c16b496dc1b137c6a7619d239ffbc5413c61860d",
    "sha256": "1f4d13ad729ac939fdf5e4e5d3c511cd9394a3ac62b97e91c4fb41e94e0b4758"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision75.json",
    "blob": "800e92d85581589dad05c33b8c0fdf8bc7a56245",
    "sha256": "8c5c8170c3f9af6bc15b30aebf6d7125fede00e7a8a08f0f75af132b2bc9da49"
  }
]);
export const additionalStage8V9BootstrapRefs=Object.freeze(["34a22620e62c4321dfbeda2a8fe0a6cea032daed","689a9d40deb03c21122b58e7fc6dd0fcb0153472"]);
export const acceptedStage8V9=Object.freeze([
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-fixture.mjs",
    "blob": "d8102f7fc645e0fa741cde1af0d7ac0dbce64ada",
    "sha256": "23b05002a9a060318b2657b42f4b4ad5b24d8c0067c36f331cf9273b466ca4f3"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-fixture.test.mjs",
    "blob": "69f5fcf97b7dec8f274a83cb60a454ff1cd0b5dd",
    "sha256": "c6dd528b54f90b16ce7e016fb9cff9dee853782c0293cf4ca6fe0a58d07245b1"
  },
  {
    "path": "tests/shortest-publication-20/caller-lineage.test.mjs",
    "blob": "d2e39af5db165249f245459f7c40c5be1495a2f7",
    "sha256": "274643b2825bf2a9e5d2009440eb5d251791b8514743d2ac3d19b9b71a23a14c"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "8305971c0ba8b6dfd1b6bf77f2898696203f0274",
    "sha256": "81ec7d54853a0c1683513fa5fedaed0cd6717aacd9a8bec11af4a27f33c26865"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "175a200a85bf619b3b7501c91a1326602492fd4b",
    "sha256": "a89e9f273e553a0ac9fa2f1bd858544c9537e9f445fba03aba2a493c5eae7478"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "9d1abb4cb9c9e2397061ca6391d0ff34b837ce13",
    "sha256": "fca2a10ba42a9cc487c3e2a5e344843ae448fc62c28d11f9584e6b947168d02a"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "16783b9f279084c874f4ffb0d0615dffbb0e8eb8",
    "sha256": "319836e434483338f58d5ba6a719e6cc7149db7d828f8e7002c611ae1ad1abd4"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "2ded6a97b23a760a895df44a2a8e5a11307876ef",
    "sha256": "fd33330e6a72bc9aef6ff5ad619c226c8f4da7ec85110db99525d4b60c79d5e1"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v9.mjs",
    "blob": "279488026687129c0046b4b95d183be374325d69",
    "sha256": "bb4772667d7a0b2d6d9454aad43bf481345d23a04bb3e828cc579f2e78d0353a"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority75.mjs",
    "blob": "48e6d4d432ac337ad63c38742a33fcbbdf2cfaa7",
    "sha256": "e5578b7fdc8ab69fbedd627b643b0addeb0a610555b6167790be9ec46840545c"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "7de917c3198b6361611013d9c2f69b8627ea4d41",
    "sha256": "92c8772ff1e2bdcc912e5c6dd6940db869f96b4caf7c0441726ed28c6fb1d077"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "333208d0be9ee306ea06cb20faa4539b06bc5f2f",
    "sha256": "f9505c488b743f5863a43d2b241303f2ad8cd1d210c4079e3e2b2dc08d491065"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "3bb4eae3a06ed7d861dfdd761f74c4a1117cddd0",
    "sha256": "084feb1ff787adea0ad91bc0e184c67dd733e058c4136846e787ea633f314230"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision76.json",
    "blob": "63efb28910e9c3221c201530e0f4dce5b5a23403",
    "sha256": "f6a25bbbaea71ef01d003e5cc07834be88e627dab77455858c7486d28abdd274"
  }
]);
export const additionalStage8V10BootstrapRefs=Object.freeze(["70e1b89f9a0bb7e18cfedec56b556b390a712535","e72175a5db717fe1d4ee1cb0f3c2fefcee4ce428"]);
export const acceptedStage8V10=Object.freeze([
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "blob": "bc4126be4b92d75375c2696650afaacf1ad7c32c",
    "sha256": "99a2943227d9b0c0e7b88cf3e3b0cb214af5dab9c5dfe4001634c48ef303fba4"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "5a036f7010488354551d2eda2d379da22c15e549",
    "sha256": "4f4507c4850221b930b10cad795f6382d72cf893b54e642aa2289764a348a864"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-publication-transport.mjs",
    "blob": "0ef47199c6acac092f6fbae9d802084b6f55fb02",
    "sha256": "95cbcfaab101f8fd55cdc138bcf5c71c1b86e3aae3c02cf8b799d3d106052670"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-publication-transport.test.mjs",
    "blob": "825dbb6daed6810b80fa4de6d0a7033b2e1cf37f",
    "sha256": "245b82a5b2cbdc0fdad5ee4b9947b938523a51248a5c8842d2b68dabf83ae0bf"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "fb4525e9f1ef958591637ea9d7728a9c69ad51f2",
    "sha256": "30dd9da1c0ecf99a006b8556d3f8d1fd03df8070d418edb130605b4798a74284"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "7e62a3e10ba90c5aaeeaeccc9ab37ae6d09ea184",
    "sha256": "293690bf3d80986c035ee0c75a50b77f4731e5bf91820d1d4449e40e61d8ebf0"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "68d5ab79a68f87ed3af3c30ea29dcaa64e58c0ae",
    "sha256": "18eda96d184ce163b1721633933217e87feaca5f1cb9432783f8c3f5401208b7"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v10.mjs",
    "blob": "0b20e23b1f861b72cdad377d76c366765dbaeba5",
    "sha256": "aef769f35c98f108b82f9be06d3bbe05c8565de86bd445c842c5dfe1ee28a5c6"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority76.mjs",
    "blob": "455f9ea2b4cf14f0b576124b7ec0b50291872500",
    "sha256": "afbb92d0a38489af94e9961ff7eaac9f40e292628be6c36f664fa6633488c7b7"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "6ca598162455c3094f99a40857399bbe8beed12a",
    "sha256": "20e2589e77afb9e09cdeec615b77e5084087827bf80859f0a346219ee814346e"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "de4bb3ff38ae3e64bf64e605e2a1ad6e0d362872",
    "sha256": "a7501c0fd55fef3554980a349d45edaae4298dda88aa71f34a587b8d109e272f"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "fcbcede03f5383c528c0ec05722bdcb6f206c021",
    "sha256": "b57e09fd45bd840d0ddb6c17845332b2e7ef346245d15e5a95737ebd3a09a405"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision77.json",
    "blob": "59a2f63a0135dd9ae68da742de22b55d4b9bfe6a",
    "sha256": "6d1a759b2c15b3ef10e9995be8633ec614c4edd3e19dbfc4df2a18a0268f9528"
  }
]);
export const additionalStage8V11BootstrapRefs=Object.freeze(["80a29e843722e435155a0073f90202b3c41d1aa7","c5eaec43175b98f153486aef8c5a73c2354693e1"]);
export const acceptedStage8V11=Object.freeze([
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "blob": "4fd5ac7353f50cb8f57f3a593826da22a5399e87",
    "sha256": "783e4f5f5d55ae38d2ce39a3e181ab953937b36edb5e48f649c4a17ba8018831"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "5a036f7010488354551d2eda2d379da22c15e549",
    "sha256": "4f4507c4850221b930b10cad795f6382d72cf893b54e642aa2289764a348a864"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-publication-transport.mjs",
    "blob": "706533f8b065eca1842e128364dc9a93e119645e",
    "sha256": "38b1013f680f223fdaa1a8655477b804b6ec720dfd677a531068234647a9968d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-publication-transport.test.mjs",
    "blob": "3ec101ca81211c5a5abc548a7529c88b075cc220",
    "sha256": "dc71bce3f9d622a0216183aabd20e6c2012d95cabb9b938ae4c33863354349dc"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "17cc1dea5e540568b353c1acb6f40276c2a203f6",
    "sha256": "be5f26db5570dd8219f81a12fd2853532e38dc79305b3f269ae6824f14fb428c"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "911d2e906a4fbf6297e551eab46036467b627569",
    "sha256": "f9c28f0e6d115601e47bf598c971489d160e3322434cda4397d8ae5ef33452c4"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "eb0ca78c95cf1eeb7d422a595738194e4c594ac2",
    "sha256": "88495a5523d6d0365a09fbe5a27f4b17a7b84f7665e8a2816cb938d64b872ee6"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v11.mjs",
    "blob": "f1e6684d5716318c6b86b2a51c65c6a5b7aac2a9",
    "sha256": "117c02a27b3a824192eafe8cf107034b04afde472f19010f5a04d647281eecb2"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority77.mjs",
    "blob": "b87d073d73a431f2057c35270ca057fe608293a4",
    "sha256": "dccd2b6a3bd5f8c12757726ed1673ff14da381b39295304ab2834d6b2fb85bab"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "e0456cab5fe1eb3538a67c26808c8a2ea308365e",
    "sha256": "aeb5e1dee87145037b32cdc70f5c5cbeeef2351c0c470e2fbccdb2eaecd6037e"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "afa54202b2b7777f97913440a8bc9807f8652746",
    "sha256": "cefe83e13294b34cbd544e8ba63ca8c342c37bf463b1ff92894d9289cc784ab7"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "6801664b50d52a0e3a96593d251bf401ff466423",
    "sha256": "0e2e5ca06880542246ff96650055e5e2f4e1c71b316e2de9a98ced3a161cf9a4"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision78.json",
    "blob": "f1c04fe843a8645a3941907ca8905fc430feb58a",
    "sha256": "96f89c6a74fbb3d1ce2db33d21b52f76496723511474c4af96cb70124c8b830c"
  }
]);
export const additionalStage8V12BootstrapRefs=Object.freeze(["0d25c657424e9aa66d253d43f45f2c27e9b44d0f","d4411d6054fb4973b7e45a4be493eb2f3e9bb39c"]);
export const acceptedStage8V12=Object.freeze([
  {
    "path": "tests/parallel-source-20261110/git-reader.mjs",
    "blob": "4059f6cd3f50463302f4ea36c134b1a7f9dacc82",
    "sha256": "8394e0a05c825a7ec3b4d250917581a8204eaaad1551bfed257de855af345d7a"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-direct-commit-cache.test.mjs",
    "blob": "45a6aa7d46ec24c1f66a3a126ffa6a88b5791181",
    "sha256": "8790cd6b396b9ee6a8617b48f3237d8261152f545421554ae37bc48ab594ef56"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "01441b17714836b4b8ec10cf26306b38f20775ec",
    "sha256": "f9fb1c94878d62447fa2f1ba19e2ee4dd369950bbcc5db5b4ada6df234c674f6"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "e0661cb15a238b95385c8e69d61983b907c4b0c6",
    "sha256": "f604d62933c730f290d1366c71003ff4fe11853245b04714be0ffe331fe25d7c"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "dd160da57e358562ed1236670a2a54d6b9bcb40c",
    "sha256": "30e5b0ec124532d7d1aebf8260fb023206d405d4c2d7e5a849ab999e6de67e8e"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v12.mjs",
    "blob": "82be3348688a40278df7a72a697868f7ec76bc80",
    "sha256": "ea261f3acabdd026897d67e437abc94d069523c6867be69b7ca3bb642639dd1b"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority78.mjs",
    "blob": "90a3df69c4feec64e25e96262cb1d9e5632270d3",
    "sha256": "0bb8d4c4ed6dc1a62aed07cfd01f06f15de68e8fc03313d4cfcd6c3559071890"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "fe37366cdbd0e569c9a42a216a251905a2541f15",
    "sha256": "fe50691091033ff4308e06c193de21b4363ba8993fe07be4f2de16a911c858c7"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "81bcfc2f09a328bd3e3dcc3459ec3ff645cf0010",
    "sha256": "454336b97d2e6900098653e9ed0e66fb057f9859c9e541563465f0269a262ab9"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "fbb03f1d02e2b5aa365cb27b37bb0e75e231c9d9",
    "sha256": "e1780019f752ec34c9bf2eb5d0899ab7cb8b7a7ac6ce3a6a9b46a96e488e74e0"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision79.json",
    "blob": "9d480cdf3a1a5cfa6b34d7a043d9b3062eceb303",
    "sha256": "45eb2808887ae25b14f1dd618b78c6cdcf00ab194f916eca5666d60c98e563c4"
  }
]);
export const additionalStage8V13BootstrapRefs=Object.freeze(["4f0af1d23c2622f067912f74e8baaea46597e5e3","5448d902ee954bf0d2929d835b28a0df23fae282"]);
export const acceptedStage8V13=Object.freeze([
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "878f22e0663a29e42c568337c78c06794b44aa81",
    "sha256": "cb2c70a09293daa092bf7194e0205607ea3b5e6148d931f96a97e4b56f083759"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-authority.test.mjs",
    "blob": "e74c168864ed8128c35a69d5b48325857effeaaf",
    "sha256": "bd912abaa194b1d23edad04dda0011afd078d09f3372fe5ed398457f94027a05"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "40421abe4efaea3b4000c41352e1ffbcbf643ff6",
    "sha256": "dc4437e6b12bf3c770ded3fcb1699335e404a4ea7db879ab4fc83869c3b0e8f1"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "399ebafdbe8f152ced930bf40bd5903ea25bba49",
    "sha256": "ea5419df07ce8aaa152811a4c25d2d4a1d873b8bb071efef669aa9165c2f4dd7"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v13.mjs",
    "blob": "3e7f7e70332b46370e26c02e5eba6d6d48fde4af",
    "sha256": "feb80b71876c46a902e94be7e45fe2760b77425797676098783debe044fd0bdc"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority79.mjs",
    "blob": "ed4d92a8134232385d3d39d12cbd20d8b5bcc007",
    "sha256": "c0db7d4b8b45aa4cfca0fa9a27cb6c90ebced32d59c995ceaec525d5fb8c61dd"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "436c8a0284c20c48d82d3c2b1f9884e66badd8e0",
    "sha256": "b641a7b1168d85c8ba45986a748884a862805bec41e5ecec6232607d0c2eb786"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "ab5081e55c8e59b3effb6a862a375c7ff03a661b",
    "sha256": "93ae68b3fd95ff68404e91f7ae2883f7789255d122b467a75d1ec8c3ba4cb4a2"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "6dc42c109c5fdc506d9739654ea1b8ea32138de3",
    "sha256": "8ebfba9fc8482fb5bad3e88e9bf5105dce8d9bd0765036e0bd0c6c5ead6a8f71"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision80.json",
    "blob": "c055ac3131862e94f3cb1efbf8bf2f048e59c306",
    "sha256": "3b948671a63b9202c39404d4dffd0c4ef83ffcd84b7a60c66407ab897ebcb111"
  }
]);
export const additionalStage8V14BootstrapRefs=Object.freeze(["101bdd56f6c5d195c85c340ac9ab4ff0cb643fa3","746e74b8661637fc381ae51f7970e62d3ad0cff1"]);
export const acceptedStage8V14=Object.freeze([
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "6b31b6813a9ec422d162357a05f081f807e4e55d",
    "sha256": "341d3fe3c7f3e178dd4bd362cab20e560e20afb21e9a2e3f8b7e16c51f5e3403"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-availability.mjs",
    "blob": "7f63c80693023ba206aff69f7dc3ad129f823360",
    "sha256": "6d5c8037167caf99321a6a10580a2c37b3c7279893525f95a187ade829b01013"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-availability.test.mjs",
    "blob": "925b664312b8f0e0fa4a879fc80d231a0579c0f2",
    "sha256": "63813ed54be52690f55b58cd2c407b299388c543cea3fbfdfa3b427a5d88947a"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-supplied-lock.test.mjs",
    "blob": "8d93ca77c262318db5b6b3f01dffffec26b7d20c",
    "sha256": "d48956f6ce5115bfad97be1d1a4e1597eef7a8e7007ccae769b9f3e58f2a51d7"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "797bc3f71e49b9fef56fa4064725358de5add354",
    "sha256": "ca68dc85d8e5e5d778dd7be4acbc7302abe9ad797864a247d66e6bfd9df0f22b"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "31e3a4bbb496198196429ea23b8194a78951f074",
    "sha256": "9fd4e4954b865a24e35b4d0cdf76d4a7b7eb830bc71fed4db86e7285751dcafd"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "125a784d479e66ea4cdbefa22b4f0334f61840be",
    "sha256": "63eab4c6a249b8e48067be23ec516297699252b20ae0db502aa60f47400daa03"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v14.mjs",
    "blob": "686b07a26fba12aa2383526f22942f190435b43d",
    "sha256": "2b1b69f5c88aa7d60943e6e2e93144bc20f23841b3123f1d41dc1975369c3bbc"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority80.mjs",
    "blob": "c230f9727903ddec8337bb4f966576b48ab234ec",
    "sha256": "184fb36421da43b6ee6eb10da7edba6834f7770fec3c6bba598f09304a2415bb"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "cfc087b83bcd0a12b0f0c729fb9837e55643978a",
    "sha256": "6b621043ffd70217d7e26183ad4d1f89f9b57af846a2e8127f1c5937c15867b4"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "995a0ecf7ffb6f50d8670b6d2385918402f81cf1",
    "sha256": "9251fb69e3f3780894ebff2b8b8bcc1a3384adca704d4c1e7502e9c7d23002aa"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision81.json",
    "blob": "0874188de61d76ead58e8387525201a5db94663a",
    "sha256": "41f015c69c50e517690a646e28d9e443e8c0cf2c52a890ac89127a0e92d93d4d"
  }
]);
export const additionalStage8V15BootstrapRefs=Object.freeze(["7ef48c91767b955269a481ef3fa1822d80dfd1d3","e3cae23068f0310c31ed3c2d06e1b38cf02a83a9"]);
export const acceptedStage8V15=Object.freeze([
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-availability.test.mjs",
    "blob": "673b7eb4236390f66f6ec7ef9739f63cd0d26f2b",
    "sha256": "4a00802b8b5ce60b0e7880bbfacc244d21de2bffffebe963b7634d527e24ae5a"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "2b1fdfb508029cc8245e66cfe3e14d5d2fe79e80",
    "sha256": "5e5c17ee5bd76215d71b52221482e5b48e4138083ae5cbef769184dc384896bd"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "608bd076dacdf69575027af112e0dba715689854",
    "sha256": "62d3cdc9a8b50cd876d2d2cec0ec7fb3ad4df095cb30105683280e672df39086"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "56b534271082c0d572b575899c2450ecab98300c",
    "sha256": "ef3d7a0792d7e1e263ce671f18b6117bc779018ea5ee385cee540d77846e8f2d"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v15.mjs",
    "blob": "ee37615afc8000433ce9d55d712a94c1ad1c50fe",
    "sha256": "d16f14e28d2541494931ff755640aa6ad0af14486e80cf1f6923cfdd42f0530b"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority81.mjs",
    "blob": "a1e984a7255bddd0d7a0e0e9a15c93341df193e5",
    "sha256": "d9d2726a697022f6ba6618e303a22fcccdafd334b0421404c7c8be50b5415b34"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "51c47039bcf537e80033ff6c4c7a8863959a16a3",
    "sha256": "0edc266510772c89ca9b7444f30a220320ac950a485febcb16de8ad620a67404"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "a9236c583bc767b5d44605a4e29672e923c09b29",
    "sha256": "2441cc299813cfe5fad23f8864a2d2a100773f02a21f1739db08a9ce695f26a7"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "bb5e96ad1cd86c6e0b671ce5df2d9c1fec6b4d66",
    "sha256": "be09251e6a710dfb67965c97c36eba47890913caa07f4fd281e6aff90101d816"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision82.json",
    "blob": "3ef861f4fd41b13eda9951cc775a0dff64031f93",
    "sha256": "329d78ac427278582b45c6c59b8a38b730eb29a29ac3cef8086ebbf95b25a130"
  }
]);
export const additionalStage8V16BootstrapRefs=Object.freeze(["4fb1b82927264f432c16521b1d6437e62a45411d","a15407efeae97c37c4b2b11b92dfc46beede4609"]);
export const acceptedStage8V16=Object.freeze([
  {
    "path": "src/lib/parallel-source-evidence.test.ts",
    "blob": "747ef388b83dec175a7308fc875c9357b6a1a527",
    "sha256": "ec3995aecc4adcba57dd739d73db8a7eb8bdc7dd6fedf39ec326ac55dd466290"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "15ba13c6dda37bf18bb5ecee22e948daeefc4280",
    "sha256": "6556bcf9ffb5bcaf7873a6d66718933343cf46c311f8895b27aee3386bcf6676"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-evidence-batch.mjs",
    "blob": "f91592d1b6e549b5352fa9bd76a3d87215a7a4a9",
    "sha256": "955ec02f94d67f280eacb6c4ca7d97eb83ed4537428f795ec8df5f13e1e588e4"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-evidence-batch.test.mjs",
    "blob": "796096cb154dcb1f7dd9013186973d79fcf81981",
    "sha256": "0b0586be0d30343626cf001c0ef5c04ae9ce1e40599f6895bef2d9836b63915b"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-evidence-batch-api.mjs",
    "blob": "84bccc320449fc2031e56c4dd6a2f9226e55b397",
    "sha256": "0e0b0bb42051eef14bca8477e669bf4c6b38c551b9e892afe48f01aea9b09d23"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-evidence-batch-api.d.mts",
    "blob": "37e627e9eecb4cf056d8a7dccf58f6511ea9a126",
    "sha256": "c1fe5293ccfd061ac78559b9172965e71eb4b59106e6ce915d2e87e7ff6a0ed0"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-current-anchor.mjs",
    "blob": "31b9695dfe2dc35ee9fd6d0239faaef106ae2ced",
    "sha256": "6cbd97e240652a1e6d3a7989f9fc79db67c40e5d16c2e70f5e465b1f43dd7fcc"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "e6784845ab78c29bbf9dae82566b85478785b636",
    "sha256": "f66859d162af242f1dc993b58a855c1bb6e20916ba49e28b0896ac1241afa619"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "1c07b6d82e186532c65024013c0aa563ecb266c7",
    "sha256": "dbae60775978679356f8a19baf924c0d5d84cb20d14b57d62de1e96e35a7ec6f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-policy-v3.mjs",
    "blob": "3dfaf304a0ff01c2d42aeb31f0aafa28988bbcdd",
    "sha256": "4dac4b2fa397d8c3444c081afa389c0b9d0a276cdb2b01687f99848ce5006f4b"
  },
  {
    "path": "docs/milestone100-20261114/source-stage8-v3.json",
    "blob": "c2756a0c27b35bc700e00a61d0d64d8041b57c89",
    "sha256": "eb175c257d4b452a036fe1be355b717364b0802eb1c7d3af614972331da02cd7"
  },
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "44478b3797b40e16b55b478454a2f1d399f0bbe8",
    "sha256": "2112fbaa5a45f865b1c855ad68784a65f3805d3db3bea3d140a952459037395f"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "5df3c42bb11f10bc44dcc62b0df843c1d9850642",
    "sha256": "0252581b6bb21917a6c00ba55b37b1c8f3bf207bd1bf07c1819b123cb5f2b8d3"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.d.mts",
    "blob": "6933ec06094cf35ff6e2ed36b07c22cd5ba5bd9f",
    "sha256": "bb932fe30c33f27d4fac76965e0f27fb08fd4771c4b876dc9bdd8219f47d6c90"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.test.mjs",
    "blob": "a93f380776d84ac917c435671cb3727da3532edb",
    "sha256": "68faae81453ce1a35d2af575405884cf27f1703396cd9553cd56fcda62eaad9f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-policy-v2.mjs",
    "blob": "f052d009fd7648499d8c45290478a680bca25429",
    "sha256": "bfd9b168495a163909e34792dbc71381c11a718b493661bbf403a3899a0637d5"
  },
  {
    "path": "docs/milestone100-20261114/source-stage8-v2.json",
    "blob": "e3b3c4c4263088f100753a51fd7c382ab424334d",
    "sha256": "5bee449be348296caf0a24925c2e631b576b55e34b3ff87f1c5baacedf998f42"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-activation.mjs",
    "blob": "c4b48a4deac5018e25e9f2a0db4866fc54910ff6",
    "sha256": "f35d697417076a42c9185076a87ccf896463fef831dcabe0fa8301a1cc7fa023"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-live.test.mjs",
    "blob": "12a4b7a988f0c27e7235f9184d7332f317cf5cd7",
    "sha256": "fee9a3a51ebe2b53e99054be68e610e8cbcdf1f3e54294e1e1b2fc9dc1f36f44"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-ref-join.mjs",
    "blob": "5ac0dd87af04688295748789384e2f903f2c1d86",
    "sha256": "fe9acd6a2088eef768f0271cd46bc74e71deb287b2ce22962878ca4f88d58ee8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-saved-actions-claim.mjs",
    "blob": "80b3245e5efff72ac925613e6160e7e7e58bb89d",
    "sha256": "4bd3df036f4f8ee92d50a76dc04b9729af001621c84df43e67011f9b5c885a2c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-saved-actions-claim.test.mjs",
    "blob": "d7a5643e6745d5970d4d854cdaf7f1a9b80e493d",
    "sha256": "070b4091a4e45bd676aefedfd7c191d57a9ef62aca1f40041114d9603f282067"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-test-only-successor.mjs",
    "blob": "bbe9e93e9a0d9a24b31d63ab60dac32621670089",
    "sha256": "1d70cf8f9427c529d9dd111044c899fc122089c95e8d27e26affc6e301ccd370"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-test-only-successor.test.mjs",
    "blob": "e1ebc73f3e6242e49af8f6c0b7eca413450f9261",
    "sha256": "b9164a85294763df7d0506e5e6c352f25b6005df25041bc6cafcda8c8b0928e8"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "e319854c727715c86bcbeb2d9cd0380768cdfbd6",
    "sha256": "7d80872a3cabe97a4e3d48469c29c287f1e41cee04dead7839679dc8e775cd2f"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "26cbc1eaa018813850ab88fcc8760c2aa9d7d7d1",
    "sha256": "91a90eb27fbf1a680d4b102118d9ec0628bf482767c77cae7d561160ae34fe80"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "7d4feab7ecd98d6567786d29cd6a393edb726e00",
    "sha256": "758479da21fd0f1b3f499bc2c18a184c2f9d313f5961308a034708ec621a9f4c"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "061c60b54373e127e4abfcdcda08e1ddc10cfc23",
    "sha256": "f518cda64675e084eaa559d100b535453bb9e62ec0fa36228d59382ce6078f95"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v16.mjs",
    "blob": "824f7efac48c88c61bf6e24e6ecc779b8e345c79",
    "sha256": "7aa76b1ef25888b003cc87027cadc63851a0012de961fa59e7f4cafd0a9b1bd0"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority82.mjs",
    "blob": "67f3ca10a49991b7a09cc7eafd25c7f97b9bbf26",
    "sha256": "c2bfaeb61ad809f39430ef8e547a220fcebae9bad2b9f3cf8e3935a0765acdd1"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "bdfc072b8a5414841965c73fcb093d2cf6c5e335",
    "sha256": "2d86fd13af0470c834d6f04c73b8179ed2b42ad2a9461524212eb7b2aea82dc1"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "c51adb5738c2852184ab6ecf6a4f8d79369b3047",
    "sha256": "742483992007dd5b1850896c0cc7d5e274b871fc962389407ed9f09e6889abbd"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "6fcd7aecc57d86569d5d9ad2bb190bc88e9d795b",
    "sha256": "4d89b6b8089306df8f1588197713db9e6d56318935077f406cd932805b7a16d4"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "blob": "9cca36d6924a508b2894b36480976aecf0188c9a",
    "sha256": "f80688080e71f9e07e8489fea1785ff2c5398943db7be792a0a2df5abf71d9fd"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision83.json",
    "blob": "6573b63a591882449829a12b8f148aacd2437131",
    "sha256": "fd7cc896ae2f1dfc92c28d7017ba3302450f4ea600015decc69c1f679937320d"
  }
]);
export const additionalStage8V17BootstrapRefs=Object.freeze(["0c2221df406558a8d0017913ae3b621ccd51f655","bccbd61e1ec73687ccd0736c14f82fc0daf66e66"]);
export const acceptedStage8V17=Object.freeze([
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "75b88961b7b9650eba3de8b9926b99c131962e3b",
    "sha256": "bcdab09b5b710dc38edab318be1dc6f287bd22f89a12404ce696012616fa9265"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "1cd9865758a814a175a3bd9041f7d8b5189f8c36",
    "sha256": "ffc6c164f8a0452907d86cc5c3b83cd4072107be2dea6e881ae40350572bd4c1"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "03a7eca458a4dbd4e3655d64a2880e24a8da60fe",
    "sha256": "524fc8a8b6eb8f8f2f91c87554df02a97d1cfd2ca947d882f0a93407d8c9fe1d"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "f506b7ff756de77627b5d7fcbdc98851ec1a651a",
    "sha256": "9c97f1711fb1cae35c9321d2f89214ea1be3cf1347ae666d2323a169596e8605"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "e15169611da03f3fa581e017f33955e3e53f279d",
    "sha256": "d347a72ef49840f9dbb68b1b57ae294b811b2b5d9d0057ad860b67537b1b7516"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "d04fd81deeb419543d6b1bc8b4b669147b6043c7",
    "sha256": "0675d40a8c87a5031d823f4937de2831a221f64f295b539aea212d7527505094"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v17.mjs",
    "blob": "f137d80365aceda9d3ad3477de4ce57d10d4e2f2",
    "sha256": "b9e0d5ec9e5c8a5ee27824f1237c2e9e341e71c2b4352a3eedc506a8d43de8aa"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority83.mjs",
    "blob": "49225451a774e1078b728661a17c67db730b15a2",
    "sha256": "fc786dd109037fefe0076bc221f7b0de2f2a33f3d6da20cff7d520d262db9755"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "4e55287bdbce182be34ab927a86d71f78a62ae46",
    "sha256": "a5703ca6d4c0b2c3fa97211d8356edd8c911da3500c9bd9fc4fde4d403519597"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "270f111a32c3d888b8d0ae17ca4af74491306c3b",
    "sha256": "492a6a89cea763582ee5d6162b256b9cb64fb980416badafddecdbb2926708bb"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "6a4d22552f3227a5185993af0ed1cc58ebaa8037",
    "sha256": "3afcfaf0f242e190afad683cecb832f9b526d0cf64da0fb23c6fec01f77ae03d"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision84.json",
    "blob": "d583caf5e65484cc0b6bfb071bde29edd1874aad",
    "sha256": "be695aa1f970058df2e7aa66408ad033707df77b901f4c3edd69762c748d33af"
  }
]);
export const additionalStage8V18BootstrapRefs=Object.freeze(["7fc8c4b561dbc2a3f41f0811576e6105b8099abc","84893ba0a13186407cb0d85e0556a7c463144446"]);
export const acceptedStage8V18=Object.freeze([
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "01dff750616b283decd4d15fa32e2d78b8201a26",
    "sha256": "2851ce67be9f5fd28370d9ba256d00229f6b33797f7289fade84ba4673ab0346"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "983aaea80de85ebd5953a50cbdefc706e1433677",
    "sha256": "8214665027f1489a986ff748d80852331e69e5f43b06e5b5d71c9b9a143f6a75"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "03a7eca458a4dbd4e3655d64a2880e24a8da60fe",
    "sha256": "524fc8a8b6eb8f8f2f91c87554df02a97d1cfd2ca947d882f0a93407d8c9fe1d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "0d4cb7709c0329c70e9b0c89b4ba68f97d1c2d4c",
    "sha256": "1bd746c63c47fb58441339bfd772cf4924acd8c13e214730525fdbe5e2454595"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "b0834d8ae22bc53586ba2ce3daeaca8cbbd0a6b2",
    "sha256": "6acba0ea67eae5f2c05718426c8496d0921b2433a4247072a0174a7d12402cd4"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "551b85503c377d42bef996086cffa190ca60e539",
    "sha256": "d1e53e9db49c3a048208e1a8f4af7929e1c64feab5bab47f30d1bff41eb40e32"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v18.mjs",
    "blob": "01eca4b69add9cf9881714767fea74bc54744bea",
    "sha256": "1f937e6b7eae8e11478ac689ae9dc912e8c00dabed7aa95a556afa38cde190f3"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority84.mjs",
    "blob": "aa01c1b64fcedab86c79995a7c4054583e058979",
    "sha256": "21c735f94f003635b9465f6955fe17ca7b559bb36e109e1fc81c1988f0838b77"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "90eaecd6a7202f4d8d48dec2a88d06fb4b290655",
    "sha256": "be9a23c92cd8fd7045d2988525830057809e4e978184d2a907146002734383e7"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "17a7ef9d78f0af4f8e1a209f66a98aa0290e5678",
    "sha256": "981b42fe894acfd4cada8585417203ccf01f87a189fdc8f94a92f61233326258"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "75b26883332c9ee42ad6521bd956eccdd4125930",
    "sha256": "16f078dbee55c957274f1db43146589b57e6958ccc94e274a7ee37dfa98b07b2"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision85.json",
    "blob": "4e4c663245bd4fb8d941260d2c66f96cdf628f16",
    "sha256": "4145f350d792951f6d9d353cf3e4a665444408e2b6f9f4bb5b6fd7588137f185"
  }
]);
export const acceptedStage8V19=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "c729ed47e4feb489bc3eea33db8b6cef518c6154",
    "sha256": "7a436834029725c7922bb8ee0500c4fd033d6ad00c3d56a301568ba9b2cd524e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "9c3215f47d56896a7544590e61484567d9f50089",
    "sha256": "616ba20939a08f5d3e787ecc604589531f0997ec014b7f1fc573bbccbb30448c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "01dff750616b283decd4d15fa32e2d78b8201a26",
    "sha256": "2851ce67be9f5fd28370d9ba256d00229f6b33797f7289fade84ba4673ab0346"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "592f6151c4f09577c5970225779a42283f873496",
    "sha256": "fdc2e3a45025a485f761bf2661b6d9b29742215adb73ee1b3d19a095f4bc1ebb"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "5cbf9a53995c45ead93577b868df5b758f2d3d6e",
    "sha256": "24707ab330efa3159908c1ecc9ec3810e76d45c7adc9eca05d9712d45acbd8b1"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "a68c66f20160a295b93e9dcbc595e5011afaf01b",
    "sha256": "0e6aa961e952a1d36f44ab83ed46cb7add53f407604d5869ab4bfd9a7551f546"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "987ef8aa77b5841b0f98e90b20284df5570bdb75",
    "sha256": "7c6613c97c8ba1a05bec219d08e582e5469858050882b0802b669a9fa0faa686"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "a889b7ae113960298f3f96a1ae65691ff02a7917",
    "sha256": "b5d775ec7bdaa4be7992127413614aef9fdd105a83d188f49b29ac6d50f6a8b4"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "a598e06f006cf7b9528d5431a10d13c42707c3f2",
    "sha256": "ce3e3a2102e4487a70db4979876acef146b650ffe8782c90bec1026dedd4ea40"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v19.mjs",
    "blob": "c601b4bf8ba198314c38ae12291c91fb8ac690ca",
    "sha256": "48ad6fd4a97e818d0700f3a95009720f1e88976a6e2561a2ada307c27dc73176"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority85.mjs",
    "blob": "bc089b70e76f0a93501db985bb4439090bef6354",
    "sha256": "4102ee4601c51c197f1867af6bc7e9a97ea2e3bb8c28505b7f4b0a57671d8b09"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "705ec416828bcaa6d8fa2f6c339c885c868b3982",
    "sha256": "f050626f778bcf714555507e23b24065997d0b76aa684d3a08e7b0739f841656"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "1c8f52406d482b9a3ea648cad5ad18f4f9a131b3",
    "sha256": "130d4f4faa140697873482b6e01ab0a4a970de735bc598aa7989e90b0c25fa66"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "9e6d09b8eb49306c6462d30de571a371733ea673",
    "sha256": "455c3da69797ce270472f30cc606f52fb7a7fd005d4b2409a6b1c437552c6d45"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision86.json",
    "blob": "3dd5b832e62dbc716148a5862e3f855b60e5e72a",
    "sha256": "efecf83588a04b34efbe3f7d21daff711b9be671dfe7a8bfe7002c363bbdbb62"
  }
]);
export const additionalStage8V19BootstrapRefs=Object.freeze(["3deafda9a9c10ccc26b1fb4372883e8ced5c2d4d","56be9b837561861d267e9ea62a14d10883755b1e"]);
export const acceptedStage8V20=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "777f9b68d5a0b41d5c21d2650f7199867d1dc503",
    "sha256": "e0f6a8da85bbb125270670cecaecf9ce98d7aa5eff6ae72c28bac9f91bd42455"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "14c874f234ff9c7012c5cf7b54a8ba44b0cf623a",
    "sha256": "3cbd61882d5422763d7d78def36f87ab813ec13fc150f2dee99f0b541ed5c0ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "01dff750616b283decd4d15fa32e2d78b8201a26",
    "sha256": "2851ce67be9f5fd28370d9ba256d00229f6b33797f7289fade84ba4673ab0346"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "bc286b6a8d185149ef204f90b52a52c94fbecd6a",
    "sha256": "bb95dec4561498fece3c47e92a41ae4d6eb776ee62331fa1fc8e14eeab1d32cc"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "03bdaa698545e5cab2de22d384e1b922902cbfa3",
    "sha256": "9bb9417562318625fd07fd1ad971e7c1d007f4aeef7da0d803ceaadbcf83f068"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "88086663d7f9d0103c1e0b05f2a9786c6ed46915",
    "sha256": "32216adc3828c73ad4b64d6ef991a79cf066c02ce0047504ce73c7c007c8a81d"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "1429cd017937e31d9dafba0d3f2df16be1f54e08",
    "sha256": "1b390d59474af276d09e1870380ea905905784da9ba086eb8106f49ec73a0293"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "830de7caf2891e754376cd7bd9944effd949c3af",
    "sha256": "26abd67a8f9358f884eb25bf3a1c73a2392570adee05947878fb536f7923f452"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "82198116158fb0ca4b70c244928b938469139756",
    "sha256": "7e3d3f692f6b7489e577a56fbe03c789ed863ffaf3aee27c662e26a5bc3beae3"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v20.mjs",
    "blob": "9841c67f6e587b66ee025cf2b2709a3ec0618244",
    "sha256": "d95fbe0394c3e3173263c039ccb90e67bcc942c85b070fff2063d3fc5d399b00"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority86.mjs",
    "blob": "a397a741d8f19499daa7af42984682fb199e2831",
    "sha256": "8e1be88ddf532801b7c1938aac61b8b761f378f89d1921fd366122bcf3b47d2d"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "0c51d440c8e838a42e39b93beb7e65e3002f447b",
    "sha256": "99da27d2914a50dc31be552e0fbe85ca9f8a2323ca9ea912e7a97193fe6e4092"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "42ac6adaa0349f5ac1aeaddb264b62ce0bed819a",
    "sha256": "ffe430db8395fd51616ebb0483dccbf40e75b155aafe5f6f1fe1723e20e156d1"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "c09a19bc76100d181d2fd32499d628c4e3a826a4",
    "sha256": "3d4a4b8e273e70953f494e87b670e48535ea3845c3c6eec12f3efeb9e1ee83f8"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision87.json",
    "blob": "539cb4ab9463f49275a6aab0ee1f066ccd3d8721",
    "sha256": "bc5c4ecb62aff2b47ea92a652fbc78d7fa98470c477bdc10619bff7072e261c4"
  }
]);
export const additionalStage8V20BootstrapRefs=Object.freeze(["3ba261b877000eadbffff7ce5cbc3f478763775d","affcbe385b2dbf62dd9658851680c349b3e69513"]);
export const acceptedStage8V21=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "777f9b68d5a0b41d5c21d2650f7199867d1dc503",
    "sha256": "e0f6a8da85bbb125270670cecaecf9ce98d7aa5eff6ae72c28bac9f91bd42455"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "14c874f234ff9c7012c5cf7b54a8ba44b0cf623a",
    "sha256": "3cbd61882d5422763d7d78def36f87ab813ec13fc150f2dee99f0b541ed5c0ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "01dff750616b283decd4d15fa32e2d78b8201a26",
    "sha256": "2851ce67be9f5fd28370d9ba256d00229f6b33797f7289fade84ba4673ab0346"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "bc286b6a8d185149ef204f90b52a52c94fbecd6a",
    "sha256": "bb95dec4561498fece3c47e92a41ae4d6eb776ee62331fa1fc8e14eeab1d32cc"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "03bdaa698545e5cab2de22d384e1b922902cbfa3",
    "sha256": "9bb9417562318625fd07fd1ad971e7c1d007f4aeef7da0d803ceaadbcf83f068"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "7c1c4d3213003638196abfc1312a7d3be1ae8689",
    "sha256": "0042e31f1df5cc3010d2d071256396bdd58a4ae32b4193e875ba7e80ebad1292"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "61fa6f7411e2a6768f9edcc5adcc0fc707700afb",
    "sha256": "10c39e54739c35bcb07092bdacf89684f01f8273e38220013578532fb47a1dbf"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "26cc3244b41563f7f3c7c0c18f0c9d9220f31c7f",
    "sha256": "b26ef0cf69c52451b19fa28d53954adc39904b31aea092f3300ad9edf0bd142f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "82198116158fb0ca4b70c244928b938469139756",
    "sha256": "7e3d3f692f6b7489e577a56fbe03c789ed863ffaf3aee27c662e26a5bc3beae3"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v21.mjs",
    "blob": "111e75f181a0ff8f6a032e732755a7ff719f86ca",
    "sha256": "b2296f34256d1353dcbbaf1a2414cdab5f1a20a75e6d1da85f569484042ed8b9"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority87.mjs",
    "blob": "bca14f2489ef074ac6558ac173aebd4147da4600",
    "sha256": "2814b32cda60b6b068061e51b7767433d8c0b0319f91f3b2c1b96c57c7934312"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "aca73ab2d8c8757bb7a93e95381cb0ecb6348373",
    "sha256": "9ea139c1e3c7eef2d0a5a0ad4df1f0211db57fda4b6726c2c3f80eeaf0a9728d"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "2f0c6882353e48a210fb74cdb802ce1219817d5f",
    "sha256": "e53ce29ccb8be7528183d6e05d5e06ab97a2178cb6c719a42cb61adb013c0166"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "4624a87e71dddd2dffafee7492cbda91d5704898",
    "sha256": "e31d7dd2158a8e71ff533d5e8b52d972226f7b14764ab0659b48f3660076c296"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision88.json",
    "blob": "0f45abbc6dda194ff3d86f0603b5119ccad9122b",
    "sha256": "6b5498f9598bf70c11b7ddefe94856db2076f3936cca41975b7c708646d68eff"
  }
]);
export const additionalStage8V21BootstrapRefs=Object.freeze(["c68e764f4add773661a3fd3bb24401139f16ec80","cdb2642d18c193394687f15d044e36cf712cdabc"]);
export const acceptedStage8V22=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "777f9b68d5a0b41d5c21d2650f7199867d1dc503",
    "sha256": "e0f6a8da85bbb125270670cecaecf9ce98d7aa5eff6ae72c28bac9f91bd42455"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "14c874f234ff9c7012c5cf7b54a8ba44b0cf623a",
    "sha256": "3cbd61882d5422763d7d78def36f87ab813ec13fc150f2dee99f0b541ed5c0ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "01dff750616b283decd4d15fa32e2d78b8201a26",
    "sha256": "2851ce67be9f5fd28370d9ba256d00229f6b33797f7289fade84ba4673ab0346"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "bc286b6a8d185149ef204f90b52a52c94fbecd6a",
    "sha256": "bb95dec4561498fece3c47e92a41ae4d6eb776ee62331fa1fc8e14eeab1d32cc"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "03bdaa698545e5cab2de22d384e1b922902cbfa3",
    "sha256": "9bb9417562318625fd07fd1ad971e7c1d007f4aeef7da0d803ceaadbcf83f068"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "51088455cefabc39161f931a90bf82cc1bddf02a",
    "sha256": "6f9fdacf17a15d1441eb173e176918dd19f59d0383e880df85eee1f3da788cb6"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "8f8113db98714dfae455624c801a91ffb6b6a2d4",
    "sha256": "6e06e4c591455f49ab02ee64e33c6712cd6939543b32a532cf003c6c91ce9769"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "08842bd16ecf3994d8dee175295f2974a655608c",
    "sha256": "469929103a6ed5f9ea9e69e0483ca4febcd6079d0b2c7f58db1b46b2b0ac9748"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "96f24f4fd64e518a9d761116bd669fb5ed6d7f1c",
    "sha256": "c7113f1b02928703626c33885782722f26531fae87318b165528ba9cdf29bb26"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "82198116158fb0ca4b70c244928b938469139756",
    "sha256": "7e3d3f692f6b7489e577a56fbe03c789ed863ffaf3aee27c662e26a5bc3beae3"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v22.mjs",
    "blob": "030564650d65a0c0b4f6c550b99dd88e8b6d60d3",
    "sha256": "bcd37fd802e8bd128e13d5d5f273cd11f06394d4933f1f67ec65116def2785ae"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority88.mjs",
    "blob": "374681cc1db460734301aeba6b6ae52a18b53122",
    "sha256": "3ada91ea9af64f8e73e3b061cc6e13ba10a35a0686d9664b1c86910f85985f86"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "a63e604da917550f9cc1e3679b7573c4b10dea80",
    "sha256": "53514926dd67f3f7f5f9b53e07d227255ec7468669f11fd1dca057d638a40457"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "7865f855189d4ad6348ed9e19015bdb74ad17195",
    "sha256": "eb8a6dfd400cd7e3a5cd0469793b79e3779219925426ddc2ce9b14805ff59894"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "a151cb611ec7765814f7955d3b8df18c50ce5c2f",
    "sha256": "a7565241e38fc9c0e1d7df14e1e4c975e9d346646e554bc965faef975a6f985a"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision89.json",
    "blob": "fc04e080c4e7c0854acd9458964a3d68e636f13e",
    "sha256": "e2b8099c5d79e8e8cf72e06dfe2237e9a6ad95110f186649361d4f76ccd71712"
  }
]);
export const additionalStage8V22BootstrapRefs=Object.freeze(["9082899332cd5bafce60cf6114fb4a23ffb5ffc5","d1d0773aa5cf2a8fe8bd36ffd2608f7ed2bf2433"]);
export const acceptedStage8V23=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "777f9b68d5a0b41d5c21d2650f7199867d1dc503",
    "sha256": "e0f6a8da85bbb125270670cecaecf9ce98d7aa5eff6ae72c28bac9f91bd42455"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "14c874f234ff9c7012c5cf7b54a8ba44b0cf623a",
    "sha256": "3cbd61882d5422763d7d78def36f87ab813ec13fc150f2dee99f0b541ed5c0ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "01dff750616b283decd4d15fa32e2d78b8201a26",
    "sha256": "2851ce67be9f5fd28370d9ba256d00229f6b33797f7289fade84ba4673ab0346"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "bc286b6a8d185149ef204f90b52a52c94fbecd6a",
    "sha256": "bb95dec4561498fece3c47e92a41ae4d6eb776ee62331fa1fc8e14eeab1d32cc"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "03bdaa698545e5cab2de22d384e1b922902cbfa3",
    "sha256": "9bb9417562318625fd07fd1ad971e7c1d007f4aeef7da0d803ceaadbcf83f068"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "a9260a23dfe4245cf9d929ab8da90f6915dd9e2c",
    "sha256": "71f164c006599b573022994ace3268059f2cc8f401c767b1f5aaef65ab2faeb1"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "78213832395266789f45f807c0bee6d686ad446f",
    "sha256": "295b47e11fa9835f70061e513bd0d15165966c8965e87dfe0a37c896610b6bfe"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "8f8113db98714dfae455624c801a91ffb6b6a2d4",
    "sha256": "6e06e4c591455f49ab02ee64e33c6712cd6939543b32a532cf003c6c91ce9769"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "3f071c2005f44a062147b5b150a43828143a173f",
    "sha256": "88475c2ecdcdfe51550abd214992b0a79495c32464713d76dd3eabde5d6ede00"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "740ea81cd19a8c90558c379110763543a402dd8f",
    "sha256": "941847e9a8eb64f22eff2bbc73b04ae11011f404b44d64527d2c8a6348a05b57"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "82198116158fb0ca4b70c244928b938469139756",
    "sha256": "7e3d3f692f6b7489e577a56fbe03c789ed863ffaf3aee27c662e26a5bc3beae3"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v23.mjs",
    "blob": "997f05cabf6da56d37136c30f53aaa14e49e1304",
    "sha256": "b10b2b8dcf08392cd4c9254568948d8e99f554d4f4bcf622c14fa4cdc03b0282"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority89.mjs",
    "blob": "4cb373801a379faac3c8bc2f3c2d3fb5b766817e",
    "sha256": "7cf7bee8b9e3b54a5aa7dfa42d72f42ff73f3e80f02d137a0b027e0922c64bf8"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "d45a4146eae00427671da9c76e950c8e64151723",
    "sha256": "36e95c579ff61fce8c9636a8e826ffd7c04461d6201c73b9a402d10b4b46aed0"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "fc37e5b1049da7df0bfe4979720b8b211aac3db2",
    "sha256": "e44ab0cdda0244e6fe2384a5f901ac0f564de22fd3a8815e97fa1e974fc6a624"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "b12ea3a33be001d0bc92da81f340fa91ae8513df",
    "sha256": "546728347d7927cdacee4d398659b8280e1f8ef29be11cd34245b2da5cc1b9d4"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision90.json",
    "blob": "6002ef55cc83635e144a26c53d5b2c75c32bb1c8",
    "sha256": "afa8952497304904851bb6725c22b2270966827c7b62ede0fa5412abcd654486"
  }
]);
export const additionalStage8V23BootstrapRefs=Object.freeze(["dc81b1be779009caa4e9f5c763f64245b3871a03","f8bde88653c923c932eb3248c0c6fc4e50280c09"]);
export const acceptedStage8V24=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "777f9b68d5a0b41d5c21d2650f7199867d1dc503",
    "sha256": "e0f6a8da85bbb125270670cecaecf9ce98d7aa5eff6ae72c28bac9f91bd42455"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "14c874f234ff9c7012c5cf7b54a8ba44b0cf623a",
    "sha256": "3cbd61882d5422763d7d78def36f87ab813ec13fc150f2dee99f0b541ed5c0ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "01dff750616b283decd4d15fa32e2d78b8201a26",
    "sha256": "2851ce67be9f5fd28370d9ba256d00229f6b33797f7289fade84ba4673ab0346"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "bc286b6a8d185149ef204f90b52a52c94fbecd6a",
    "sha256": "bb95dec4561498fece3c47e92a41ae4d6eb776ee62331fa1fc8e14eeab1d32cc"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "03bdaa698545e5cab2de22d384e1b922902cbfa3",
    "sha256": "9bb9417562318625fd07fd1ad971e7c1d007f4aeef7da0d803ceaadbcf83f068"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "bbdbb7e4b3f211ed3d370c8a81e03bcd6107beda",
    "sha256": "2d9fb1d9d6066be78e8c43ebfdee40bbe1d69443533b91f5a13f81846ee33b74"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "2b43d582e61c0376ba2766d5ffc7af72b0bcb7db",
    "sha256": "57183b18187476c2d8a9f4b9fe4e653490c85c38d43e1b82ce3769fd19e8687c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "78213832395266789f45f807c0bee6d686ad446f",
    "sha256": "295b47e11fa9835f70061e513bd0d15165966c8965e87dfe0a37c896610b6bfe"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "5a26510c980b05ef1407c16f5945fbcf06bc95f5",
    "sha256": "58d31c7e19deed7c5d33a236014242a4084098c736b5771d5d10d5047fa37a13"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "1a58f35c1387a805951c398696b3fbd752fa0cb5",
    "sha256": "232adaa74c30a2b2866d9ca30479cfcb8e6df8994868fdcfada508b7a311505d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "82198116158fb0ca4b70c244928b938469139756",
    "sha256": "7e3d3f692f6b7489e577a56fbe03c789ed863ffaf3aee27c662e26a5bc3beae3"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v24.mjs",
    "blob": "33db2c83aef3faa47d87979dd97a9010d91ea48e",
    "sha256": "e47aa81231bf069c617cba4df6fce480fe4180ce01f53ebf8ab707b22858accb"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority90.mjs",
    "blob": "a4dc95abedb21ff6f7f6882f4c1a71d41b692440",
    "sha256": "07b7e792dba55ade6407a8125684b3b4a7733ec838ea85055429c7625191e8fa"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "38486c3b933d27699c25df5159483869bb76874b",
    "sha256": "5c18ceb7c06b14cfbbabd75a7c2d5281d0cad6ea97dfff2805e0170dbc671964"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "fdaa565f0224d884d4399a1f8ab8d2777e224cb7",
    "sha256": "c07650ebb5ed4675c373a11901c8b75b823ac8b0999120f34070c2be20c8d2c6"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "b0d41a866b1a2ead8d06c4faa48dd4ae3c7c3a66",
    "sha256": "71a261b3b22d1624f6450cdc012f57a40df609062a09858e54c907e0c9d59d49"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision91.json",
    "blob": "72afd8997aec98e4465bd21f5a17668903171f3e",
    "sha256": "ddb8802ec0eb495ba1ffac41e6e548a9187f6dd7283d10ab6f60cb6613cc2f0e"
  }
]);
export const additionalStage8V24BootstrapRefs=Object.freeze(["0ce040a63cc488e7a6e983441829f4e5c6b6587e","2759a75ab1e12effcc8798aacaa11e294b4dfb0f"]);
export const acceptedStage8V25=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "777f9b68d5a0b41d5c21d2650f7199867d1dc503",
    "sha256": "e0f6a8da85bbb125270670cecaecf9ce98d7aa5eff6ae72c28bac9f91bd42455"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "14c874f234ff9c7012c5cf7b54a8ba44b0cf623a",
    "sha256": "3cbd61882d5422763d7d78def36f87ab813ec13fc150f2dee99f0b541ed5c0ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "01dff750616b283decd4d15fa32e2d78b8201a26",
    "sha256": "2851ce67be9f5fd28370d9ba256d00229f6b33797f7289fade84ba4673ab0346"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "bc286b6a8d185149ef204f90b52a52c94fbecd6a",
    "sha256": "bb95dec4561498fece3c47e92a41ae4d6eb776ee62331fa1fc8e14eeab1d32cc"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "03bdaa698545e5cab2de22d384e1b922902cbfa3",
    "sha256": "9bb9417562318625fd07fd1ad971e7c1d007f4aeef7da0d803ceaadbcf83f068"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "4a4b17fdfe06deedb2f5b87774b8a2286de8c42b",
    "sha256": "7948ed489a3fe4333b500b7f82c11ad54f8e4ad36a296be1e85935577827c70a"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "3ebd00f216737a47f92ebf30b2c352c6be2251d8",
    "sha256": "447e2ea074e885cb2f82ee24ed6bcc21b533db784ce356bd2e6891462002c8ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "78213832395266789f45f807c0bee6d686ad446f",
    "sha256": "295b47e11fa9835f70061e513bd0d15165966c8965e87dfe0a37c896610b6bfe"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "73af473a5f7994ecbd536fba28ad71b3e6cae581",
    "sha256": "b326d42203ab3cb6a4496018cee2034b72d713cd1ce6e4e2d9ec80847bb64972"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "807068f520c3d05d945a3b1d96f1a7b60f6c47e9",
    "sha256": "14aeacd5b90c93ad3a8058d7b64218cb8a216933c0270935cb366d38ef22d53a"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "82198116158fb0ca4b70c244928b938469139756",
    "sha256": "7e3d3f692f6b7489e577a56fbe03c789ed863ffaf3aee27c662e26a5bc3beae3"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v25.mjs",
    "blob": "c1a57945195bb98c8d93a1eae1835d7ac8a534ee",
    "sha256": "744f2e926f7a92de3ef7f931153c9f76cbf603746c2e2748e215f685e2b7b4f9"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority91.mjs",
    "blob": "bb430eee794819333c24c9df2bcc1f0a94f06428",
    "sha256": "5e20461a9be0888b4e3f9d835216d73017f8af8e85b7c187966ec6f5730db198"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "1c90f070bc7252b323ad046234388d4b703bc9d1",
    "sha256": "3da30df77bf49f7f43fcd114d60ca27b6f12f5d55bb849fb2adadb576408942f"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "91207415422350d574d1ecbfa783e8c8d300a20b",
    "sha256": "0ca60fb17193c28dd681a81124b30815e3dbc1c5657513900199280146c423cf"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "0a887c4c01fe1db0eb42caa9a628fe44987137bb",
    "sha256": "de5bc42f2f9e79b32c463fb357c3618dc00442ecc57336844a0417a1f8867ada"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision92.json",
    "blob": "269ebc7859a3c7cec6a84b60e8299f3f02d5a9e7",
    "sha256": "a45aa414e9572ea4f3ec13f9f693568ede5cce762185551d5614467af246b1d9"
  }
]);
export const additionalStage8V25BootstrapRefs=Object.freeze(["62b011de1d288dbeb83749d4e50d6a47cfa98542","e0abee1f8940ee0f352db60ffe338bde869c2f83"]);
export const acceptedStage8V26=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "777f9b68d5a0b41d5c21d2650f7199867d1dc503",
    "sha256": "e0f6a8da85bbb125270670cecaecf9ce98d7aa5eff6ae72c28bac9f91bd42455"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "14c874f234ff9c7012c5cf7b54a8ba44b0cf623a",
    "sha256": "3cbd61882d5422763d7d78def36f87ab813ec13fc150f2dee99f0b541ed5c0ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "249efa4d7e13dd61cfea8e76b98e2e9bb44f6d35",
    "sha256": "5c3751b9faa4d709b0ffc4eebb543e6563cd0ae68d560804b73cb8ede20cf535"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "bc286b6a8d185149ef204f90b52a52c94fbecd6a",
    "sha256": "bb95dec4561498fece3c47e92a41ae4d6eb776ee62331fa1fc8e14eeab1d32cc"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "03bdaa698545e5cab2de22d384e1b922902cbfa3",
    "sha256": "9bb9417562318625fd07fd1ad971e7c1d007f4aeef7da0d803ceaadbcf83f068"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "45bb3caeef918914c27da56e907c10f5ae8e550c",
    "sha256": "c9c8be0b4f5f172ce5037cb2410183197f901a2034d7eac586b414c52a29407b"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "3ebd00f216737a47f92ebf30b2c352c6be2251d8",
    "sha256": "447e2ea074e885cb2f82ee24ed6bcc21b533db784ce356bd2e6891462002c8ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "5e44a96e209099c5627b3dfb5de6a8d7ccd638f6",
    "sha256": "b5f86a570cd28c313d0f655ae24f4de1d026775eba2225d87e15316ce377f72c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "78213832395266789f45f807c0bee6d686ad446f",
    "sha256": "295b47e11fa9835f70061e513bd0d15165966c8965e87dfe0a37c896610b6bfe"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "3d42eede60d304beda736f3a55336cb4f6ca9257",
    "sha256": "53d9d333ff1e2856d6e027fec4778966c825ca92a61b7f0dab62fdc0de263d4e"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "beb0af8a5f5b003d164251de6fb34a5971c06d8d",
    "sha256": "e5738245761d7404e6e555d1b1f2e64fbc3a875a66899f1bd020a9a74435b9a9"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "82198116158fb0ca4b70c244928b938469139756",
    "sha256": "7e3d3f692f6b7489e577a56fbe03c789ed863ffaf3aee27c662e26a5bc3beae3"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v26.mjs",
    "blob": "7097819b91d25e6e55db7d228c4e9a4dde6d35cf",
    "sha256": "0d21d1a72b135cfca5e1901338a077c148ac2f2855fc5d9231217c617955d3f7"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority92.mjs",
    "blob": "4afa73a54ee6c9aee9ea04c9f75281a9a5ae71c0",
    "sha256": "ad00806463d05b38d8d64048d26ca2182ee0bc67e5fb8c6723ee1879d5db9cda"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "e7477952b4b492a3e9bd631d0be79f44c20e5cf8",
    "sha256": "485fcc6ccb19a9e9d2aa985f19cc86e949ecb2775be8fd70e350f9737a02140f"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "90f97453dec3b436e9c42ff9fcce3b672283f185",
    "sha256": "9140b00bfe196e92ef908716a448637ce0a8a6a43310766c071d46f450acbdeb"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "859137ca3263090c2d84afe28219c60ef02b9a68",
    "sha256": "5fed5dfc15cf5180844798ed0edbe3126e0302bab035492014b22e96ef356bd2"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision93.json",
    "blob": "90e7b1be7914524f9b5d30d6127970fdd1320e55",
    "sha256": "6060746fddf6b320e12355568e707f5626fc1928096e0aa23ff0e96011d06ddb"
  }
]);
export const additionalStage8V26BootstrapRefs=Object.freeze(["5fd4e819150321152d14d9b7de6e8ca42853799a","8ca7982a47763ada58eba9eeb381d8893ff47dcb"]);
export const acceptedStage8V27=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "92c537d1fcc2b307f1799c4b474627de49e0358b",
    "sha256": "f9f1a86538710d60b49baa562a198226cf5f005f32e8b6c85b3bb3203ed96fb4"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "0646a3bc361b98b1067b32f38b9b94e6c43d6210",
    "sha256": "cd39d2abdb7430015a1cb40b6b50fa2ba28d0955dc58cdcf34be016583d19e86"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "249efa4d7e13dd61cfea8e76b98e2e9bb44f6d35",
    "sha256": "5c3751b9faa4d709b0ffc4eebb543e6563cd0ae68d560804b73cb8ede20cf535"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "b4880f00bf18a79da285bb45575d58ee89173304",
    "sha256": "11c6141d7f7fae1f0850afb1dee804d480717c1cf0c79f8fbea4da668f30a004"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "7cc6a0c0e98cdd2f421627766abcb6a199cba2f0",
    "sha256": "f3b43fdf8a8cf9e704fe3ab921373cd7d246042a2143e43ede74fadffce90d95"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "689decccb3aeaf8c7cd55899a02ea596cd34401f",
    "sha256": "2c961b9d2421012aac68c7b4da02e7632b658c525a6be64d757e45ba1b84645a"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "3ebd00f216737a47f92ebf30b2c352c6be2251d8",
    "sha256": "447e2ea074e885cb2f82ee24ed6bcc21b533db784ce356bd2e6891462002c8ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "5e44a96e209099c5627b3dfb5de6a8d7ccd638f6",
    "sha256": "b5f86a570cd28c313d0f655ae24f4de1d026775eba2225d87e15316ce377f72c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "78213832395266789f45f807c0bee6d686ad446f",
    "sha256": "295b47e11fa9835f70061e513bd0d15165966c8965e87dfe0a37c896610b6bfe"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "dc904b948355c0377284439bc7e598f8196d4af9",
    "sha256": "69b97199bd7581b9d07926b349fd70444747fd988eff1791eaca5658638ff96f"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "7e50f1cb37b01954649f2f022e73842ce6ebc76d",
    "sha256": "7372624bda6b92f51b2f766ca9dd136a4496246b22c22c942a0bb4417de399b0"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "504c5a75cb3bc5591fa5351ff546473f277b41de",
    "sha256": "3948676ff29db58ea6b4266b70f92b4318f50398d815be1ad73c9abc4dfb72e0"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v27.mjs",
    "blob": "7810d41c6c59ea416c4c9323591cda1d6cfd6d75",
    "sha256": "a342915399cbf0cdd562b23cd8384501e9dec535ff123d1049575e4de4fa108b"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority93.mjs",
    "blob": "f56dafb34ba988f2c8de4b8de55adae768dbb40a",
    "sha256": "866326ff5a50990a87f0a9d5834c05d0bbeee2f0362f2a28ce89d349ed4f14bf"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "dc078c48931dfe2cef4fc5a8229a3c9d262a776c",
    "sha256": "406d688cd19b49baed4f7dcfa31f72c40aa9a91f5fc56a26eff88f7fe0f626f6"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "1c098db216aa745ff80c6b5d6e68f3600411c1b7",
    "sha256": "99d7fe8d8ec48966048bd16013b984d6dd5bbde6b351013d726957d48052eff0"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "fe7d0bad06d8ae4ad332c66b7573bfd842be6d60",
    "sha256": "39d9960820c01762501165691a05b4944920dc8d7d847aac012b81188b5f75f9"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision94.json",
    "blob": "a59caa24ef41ac2b6f2e95ea959921f04fc4cfc5",
    "sha256": "0481b56fc82014faf2ab0d4dd484fd48e495f365aa312fa9097e1a91dcd03108"
  }
]);
export const additionalStage8V27BootstrapRefs=Object.freeze(["1ad5524bdcecb105173170b7d29125a672bc9ee3","9cc1cf6c67062bc418be1b77de88de79fc5012fe"]);
export const acceptedStage8V28=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "249efa4d7e13dd61cfea8e76b98e2e9bb44f6d35",
    "sha256": "5c3751b9faa4d709b0ffc4eebb543e6563cd0ae68d560804b73cb8ede20cf535"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ef7c668a7160b640c61a1fd4aa6a4cb07b3b370d",
    "sha256": "84997808d8b24d7036bdf7a2faa34759644e94bdd7d41836c7e2d4e3f754dfb0"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "879b9cc16942347cd7df91c47db4ab157fc8dc90",
    "sha256": "e6e83c25c8e56ffea9870f1605412cf4cc2d5f24e7dbee6686c8e42befa701ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "d22969c7de710b655c6e3d37677b93d5295f1cd0",
    "sha256": "8880a30ea30e10b1c0670a0f18ad80db3c1a0d46555d193d9f7d2a839381217c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "3ebd00f216737a47f92ebf30b2c352c6be2251d8",
    "sha256": "447e2ea074e885cb2f82ee24ed6bcc21b533db784ce356bd2e6891462002c8ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "5e44a96e209099c5627b3dfb5de6a8d7ccd638f6",
    "sha256": "b5f86a570cd28c313d0f655ae24f4de1d026775eba2225d87e15316ce377f72c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "78213832395266789f45f807c0bee6d686ad446f",
    "sha256": "295b47e11fa9835f70061e513bd0d15165966c8965e87dfe0a37c896610b6bfe"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "20d80a90f1e1116508736a0730409c8ae463dc73",
    "sha256": "4299905effa65c18afec836a49700b9a768b37253ca6ec6c3d1735fa62f1e372"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "617b68bb38fb7734a0cf5721acb4b0ccd5cbb875",
    "sha256": "46de4acf316108ce61b4c80899f24df697f165ef9ba7af40be4c63a063a6e55c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v28.mjs",
    "blob": "e8e66d01f69e5d4de4ab679e6a363eedcb6f3e3a",
    "sha256": "87336a8beca0a34e84f4dc8fce3240734df774ebf5f3cc06c824360cf6125bbe"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority94.mjs",
    "blob": "12e19e7b41937406416aec63af9199a9d32eb3fe",
    "sha256": "ef5cd432173098fcb21286cb917249305f1ba6d05068d675bf800a15fbe5c527"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "86a6c349a7884c3b4cf696653ee78c0669d84cdd",
    "sha256": "98eb94f4f184b78bd447a5c5d1c7859532aaf016d7f220551f4fa36be787b21e"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "4338ef6d044503238f8b2ab6668563bbdac28741",
    "sha256": "e8f5cc7ea3bb90ce95c9b71e9a2a1fb934173ee23a402d9c9b64ad2a624e991a"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "7d2e1c383681a0e98d5caa89e17ff6e8d0388bc8",
    "sha256": "2a29e6e6b6477325e3dde211e0d501b2092d2627a0f6e0753b956c5115c136f1"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision95.json",
    "blob": "e466f7db79b4342af31fc3989d5377790bacf731",
    "sha256": "97400e5d767dd820fc80078497721cd130243ead307f50083ffdd4e43cb4206f"
  }
]);
export const additionalStage8V28BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","609307e285b35f95ea8306c6ab257711974ae2da","64c86e4fe5f77816f2b5b45ea2177ed56520b292","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","f85bb169056489b27e4bf245f56df70e30adef95"]);
export const acceptedStage8V29=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "2667c2d6c4d0758847a5b512700c66738483296f",
    "sha256": "116c19f9521d22bb30c097eb23d10b9f447a31faaeceee3851a05319de2c13ac"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "bd6a5241880b2911c31d9bb97cbbbe6fd9a2bb65",
    "sha256": "92560cdce1262a7e083ef04ab38b5131f1839b536bced2b210d7c948adce165e"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "249efa4d7e13dd61cfea8e76b98e2e9bb44f6d35",
    "sha256": "5c3751b9faa4d709b0ffc4eebb543e6563cd0ae68d560804b73cb8ede20cf535"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "35fe9d126c796dd955e97a944de101e20a9cc7fb",
    "sha256": "7da35ed068e184ceb1930ba0daf57794bd31cc24a33de0070493fc43b5b8fca4"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "3ebd00f216737a47f92ebf30b2c352c6be2251d8",
    "sha256": "447e2ea074e885cb2f82ee24ed6bcc21b533db784ce356bd2e6891462002c8ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "5e44a96e209099c5627b3dfb5de6a8d7ccd638f6",
    "sha256": "b5f86a570cd28c313d0f655ae24f4de1d026775eba2225d87e15316ce377f72c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "78213832395266789f45f807c0bee6d686ad446f",
    "sha256": "295b47e11fa9835f70061e513bd0d15165966c8965e87dfe0a37c896610b6bfe"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "8ed78ca48e7a01adf0a8d50a17d161e544b73597",
    "sha256": "cf3625305813654d2ef48d5f05ab681b988c22903120327a055452f0ae16bd8d"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "115d4f74acac5b23c21b7d296af2b2abadfa9728",
    "sha256": "dabce2d6e8da6d457ff584d01066fdd2236ed3964175e644dc9ee6e7bca31b67"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v29.mjs",
    "blob": "549eefd18e50079f3754ed3e996c1057ac419897",
    "sha256": "72c2cbfa2099bc826bb27f79364bbece105dd03985514c926eb9bebb033c39ef"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority95.mjs",
    "blob": "ece7a0aff0e17d0d9d7220e791194c91030c6edb",
    "sha256": "ff337149a2bc48a217421c324fe9625d622aeb8718dbbfaa01f60370d8cdde11"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "8d10cd0b712a41b76427b25954a52c75fcbe998e",
    "sha256": "4e6b9938520c172749934cc0e63d8dd354636ba9b5c76759ecd5ac288305b38b"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "d61d491225584a677def74c75a131ad4ef093d8f",
    "sha256": "919e0029acfa83accb0cc803082338054b381decb0f3e643f6be53bd997887ad"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "534ca68059f55fef5b02fbf356abefd8c7e6b7ae",
    "sha256": "f002fc462891f6b479611b799c0071f773a0c9b27569f8f27fef7e16f1590460"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision96.json",
    "blob": "941da3174647cd3fff27260e72a454a971a6244a",
    "sha256": "32ca653bdadb605738e4a6b48d0389cd28896a6666e8146d688625c375900473"
  }
]);
export const additionalStage8V29BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","1d942daadeee2ba7cc8e228b21b92e57ddb159d4","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","5300429c005c68e7bbc65fb4e9778f756e95cb63","64c86e4fe5f77816f2b5b45ea2177ed56520b292","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47"]);
export const acceptedStage8V30=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "68bc22d7f1f7723d48f5ffd01a7ee484bbf5f800",
    "sha256": "9fac1fd2720461d7158b1f9a330073394c39a9bfbf580ff3dc5221c0eeea2bcd"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "b0926041316e982d647c21a138a0c45b6b5ade08",
    "sha256": "2ea40f7db204c9e747cb1233ce97a380a350ba5106b0fcf2e0f7d305ee5e1c9f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "249efa4d7e13dd61cfea8e76b98e2e9bb44f6d35",
    "sha256": "5c3751b9faa4d709b0ffc4eebb543e6563cd0ae68d560804b73cb8ede20cf535"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "526fba0015333b7e8691949a1f44cfbd69f58ea6",
    "sha256": "6b304d9493f19586482277841bfd0474cb36505561ed04f3d28ba427bbb93a0f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "3ebd00f216737a47f92ebf30b2c352c6be2251d8",
    "sha256": "447e2ea074e885cb2f82ee24ed6bcc21b533db784ce356bd2e6891462002c8ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "5e44a96e209099c5627b3dfb5de6a8d7ccd638f6",
    "sha256": "b5f86a570cd28c313d0f655ae24f4de1d026775eba2225d87e15316ce377f72c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "78213832395266789f45f807c0bee6d686ad446f",
    "sha256": "295b47e11fa9835f70061e513bd0d15165966c8965e87dfe0a37c896610b6bfe"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "240efd4d2054e37f8a4e2a53f56efe4747759c54",
    "sha256": "eaf38988f3aab6be285cd540257201a5756058161b1a443fdebcdc2329ef71f9"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "c10f95b8e584f7d3b2550dd03dd3093b929d0f1e",
    "sha256": "204826a662aebcf7f923a627e6dbd9deecaf656ff4d234b59478b1608ddc1081"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v30.mjs",
    "blob": "3c5eeb33c9c0e642810260e7f713d30e110b4d37",
    "sha256": "bf4b9863b372bfcd24afabcc13018da91def23945c9cae30ef21a41067d993c3"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority96.mjs",
    "blob": "4af7ccd801bf145bcaae61057cfda31ba8ee3a0f",
    "sha256": "0abf65235770d5042f56c31127cb5a0c1cd41726852d85c42a1fe73b8e3ef013"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "687b73cd0bd7dc1e05fa27f1f74e3eef3d064986",
    "sha256": "369f298c8ee318b1d0f29bdeb077385282e631c5a3ba88b6bcd35117f737135a"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "504bcf3260c21d878844c5b3456bfd548ba57873",
    "sha256": "58c66b44fcaee05a568973fdc4eb494283f2ed23c0deb3e35fe831d0170f9c23"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "c6e00cf6d002d18bc48ca0ca49680e1e9adfdbbc",
    "sha256": "a922253fdb00b26fbda9849fd79d2a07cd2c1857a660ede8837d55eb2d41ca6d"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision97.json",
    "blob": "fcb08ab809fdd017feea877403ab8fbef1f347a7",
    "sha256": "49074274094cadb3983a0a487e00dbe24d4c0c6b5342a932861c51cdc6bcf4dc"
  }
]);
export const additionalStage8V30BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","3c33f2d57145225c59d6c5068b0fe25254bd95fc","64c86e4fe5f77816f2b5b45ea2177ed56520b292","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","eeb12afabb0132a915e0735f638344fe82f6cf85"]);
export const acceptedStage8V31=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "68bc22d7f1f7723d48f5ffd01a7ee484bbf5f800",
    "sha256": "9fac1fd2720461d7158b1f9a330073394c39a9bfbf580ff3dc5221c0eeea2bcd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "b0926041316e982d647c21a138a0c45b6b5ade08",
    "sha256": "2ea40f7db204c9e747cb1233ce97a380a350ba5106b0fcf2e0f7d305ee5e1c9f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "249efa4d7e13dd61cfea8e76b98e2e9bb44f6d35",
    "sha256": "5c3751b9faa4d709b0ffc4eebb543e6563cd0ae68d560804b73cb8ede20cf535"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "e3c8d994c799b07ce066c7b1d53c2717d8746693",
    "sha256": "b66e4c853281bb55c0e7d4c217e565664ff09e0063bc60ef225b691b6547ed26"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "3ebd00f216737a47f92ebf30b2c352c6be2251d8",
    "sha256": "447e2ea074e885cb2f82ee24ed6bcc21b533db784ce356bd2e6891462002c8ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "5e44a96e209099c5627b3dfb5de6a8d7ccd638f6",
    "sha256": "b5f86a570cd28c313d0f655ae24f4de1d026775eba2225d87e15316ce377f72c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "78213832395266789f45f807c0bee6d686ad446f",
    "sha256": "295b47e11fa9835f70061e513bd0d15165966c8965e87dfe0a37c896610b6bfe"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "dc9f0f60e529dae18f0be0c8c84f9ba9392b2bed",
    "sha256": "bff66d2baa996ecb61a3ea5edb33ae77aea883c5272e061f2fbe0d3030594cee"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "9ac2ce8dcd26171060b15e222a73887b4304b634",
    "sha256": "5b2fec67564937373daf183ed583fdb42c8302c46c6779c256303b4542cad4d5"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v31.mjs",
    "blob": "9fc052e29bc90778606f8ec1b7804fea64e6ef08",
    "sha256": "ff3b1399fa8b899174fa2b97f11dcbe861057c95cf66004f78b8fa933a3c2f84"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority97.mjs",
    "blob": "69d68485caed3c9320c46b0e32e0fe5c7e994c2c",
    "sha256": "7771822d3e3e195da09e29351a49cadee571d0d58fd1a4b12f2208a048c9babd"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "dd5439b9708323e400aafb0ee71f5d5d1f54c644",
    "sha256": "c22f50fee3674e442309413e533cbc145a9bbb85fce2cad54f279482ede02284"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "93f1278f106117de5debe5ac62f965dbee4fedfa",
    "sha256": "d5babdc421c2541f6752f70356628357fec10339c9e03f7c710f2165c1c00440"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "7e98a8053e8eec66dfc73ceb22f0caaf2db81929",
    "sha256": "134f886bab3080bee8cacf1dbe5b825ca33f5405155b976cff04b36c029b7f22"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision98.json",
    "blob": "9908485fdd5868e30ba96494ce30a52102d54a72",
    "sha256": "33d7fe8613a1db26e418ce9b9d477474a2905bd682b4d36c7acb5b964d9ed180"
  }
]);
export const additionalStage8V31BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","257a18f2ebab091410129a2fcd58bd7edff843e9","27dd582b915d5ca1aae093c41ada6170e66f8d14","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","64c86e4fe5f77816f2b5b45ea2177ed56520b292","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","cd1b2d7a26dadc0c6bc5fc41449db8b8cf695adf"]);
export const acceptedStage8V32=Object.freeze([
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "68bc22d7f1f7723d48f5ffd01a7ee484bbf5f800",
    "sha256": "9fac1fd2720461d7158b1f9a330073394c39a9bfbf580ff3dc5221c0eeea2bcd"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.mjs",
    "blob": "cc099cfff14c79cd57558e6a8c873a8c13dc98cd",
    "sha256": "60a4153d25a84758e0f418f639a54df083ab4fe050eb6fb57142eb7c56333e9f"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.d.mts",
    "blob": "a8aea9fff6eeb37ac205a4383532e14895437256",
    "sha256": "bae4908bfb29bd5cd3c3480c76c12e913f8946dd3d93f155529b85c54ada0b62"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.test.mjs",
    "blob": "883fc969ac6fa9ce4ff43f0c09c0326bfa02e0d9",
    "sha256": "946f1b3e1996c62a8d2a790d244732a1f44571be10ee3d68b4b6eb190cb2d39e"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "2bf9db9747fd26b4e9d4fb03c512a12df514b3fa",
    "sha256": "cee4d541c258f9053122467e2ee6be7a2ffde4a86f983755f7e31fe435daf183"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "c6aff9eb7f8cbf3f26cc78fdab35430f1d7ff327",
    "sha256": "305b63aa47572deae71c1ae19dc33b0150ab8c2f717a210150a3c699dc0ae378"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs",
    "blob": "887f8c7e7b144c2d0e3e1973876a448ee68a032c",
    "sha256": "d8b1597ad1490d992eb82f84601bf0dd069634998ca005de0ed1679d91e11b38"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "0bc2f6b1bdca507b4a035169a4286f14ce8b4696",
    "sha256": "7902d0f3d3ccb57809181857a2b34a9476d1148e96f9ee03ff870aee017e962f"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "12d39ae6e52ba1d71d883f9658ad6a39d8dd2190",
    "sha256": "9f0c6c952cddf8f8c5e470d5b3f1c2630191b89a5bd491c19942010d12e12343"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "b0926041316e982d647c21a138a0c45b6b5ade08",
    "sha256": "2ea40f7db204c9e747cb1233ce97a380a350ba5106b0fcf2e0f7d305ee5e1c9f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "249efa4d7e13dd61cfea8e76b98e2e9bb44f6d35",
    "sha256": "5c3751b9faa4d709b0ffc4eebb543e6563cd0ae68d560804b73cb8ede20cf535"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "383776f30cd2085ba8b93e1515dd8632cb98bcae",
    "sha256": "89e874fd0c4262e5ddac0bbd620c881679c1dce25cbb098e4a1079b2eb232e8c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "3ebd00f216737a47f92ebf30b2c352c6be2251d8",
    "sha256": "447e2ea074e885cb2f82ee24ed6bcc21b533db784ce356bd2e6891462002c8ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "5e44a96e209099c5627b3dfb5de6a8d7ccd638f6",
    "sha256": "b5f86a570cd28c313d0f655ae24f4de1d026775eba2225d87e15316ce377f72c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "78213832395266789f45f807c0bee6d686ad446f",
    "sha256": "295b47e11fa9835f70061e513bd0d15165966c8965e87dfe0a37c896610b6bfe"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "c7544b7bf1954d32e59097c293f6b6b90a36e120",
    "sha256": "d7b42b6e35c18163ca569c675b6a77949fd97e3e5f5579cbaa2edcbcdd457451"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "cbe22a2d4b330b5d224dffd95899935c1bfe188a",
    "sha256": "2275bad08d34e98fd698b5c27424fb65667ede60f5518f5a39787233498e5ba3"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v32.mjs",
    "blob": "acc081a359d99c9b34a6dfe2faa427cceff1eb7e",
    "sha256": "2ea9cb1892e83461d3d693042e24d6657f91c7928500226bc355b9d14c709562"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority98.mjs",
    "blob": "586d88bbe101ead2f04d17075498614cbc750689",
    "sha256": "e30e7c5d6ca341783996458ab19bf1646e6eb0be85ee9bcdf24ed3d5158746aa"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "4d26e2392b6385e7b3dfc1bb3541635e28d00711",
    "sha256": "dbdc06315d62d779527dd1f76eb8c5ff0f77a497c2790e893d55095fbaa36924"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "9097787c34b317053ef1e7393db301cf9f918d8d",
    "sha256": "9ba5e30b16bf22778ec771557a07f3790b446151c7f6e9cf2c2739bbd33664e7"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "df1e81534436be111263f03994b35ed345726329",
    "sha256": "b21d869e069719df1c1ba3226c7aa0c11196c2e83fce99ea43bbc94b63b3a619"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision99.json",
    "blob": "3f8ff8a8a82074055730e8e1c1aa61512027142a",
    "sha256": "3e20545de52dcca7b807f18260a790d162d2bcd865f32575e7874abc06073cee"
  }
]);
export const additionalStage8V32BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","3fdb834723d31382a87099c8f305fe8972b76643","64c86e4fe5f77816f2b5b45ea2177ed56520b292","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","f5742221390721e3250b2371c34c3070de9efe79"]);
export const acceptedStage8V33=Object.freeze([
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-claims.mjs",
    "blob": "1d38f116c6329c1d0896d904f9e2599aa3db2770",
    "sha256": "c085049403c9df4c8e675f7a8cf9d6b89459ac5572dc6a21d1f23bd2513c6e50"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-batch.test.mjs",
    "blob": "4a0755885d17f7e341738188d679f2ea451c52a9",
    "sha256": "d41130285b42a4c434816bfe9d980a47967beeb4c81351e0d0a3bf53445cb514"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.mjs",
    "blob": "795d410ae5f2c7bd25b75ceacee3ddcf51f40e29",
    "sha256": "8bebf8a26af22f7504a1c6d5e73246665d7ad2fdbcdc120335595f612f045b76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.test.mjs",
    "blob": "69cef14708013bbe99fc7755f8d65e857084c5c8",
    "sha256": "8a8a83e2dacd48b58f03c4e2210e8b869663af6863a70553aaf6b4737646c891"
  },
  {
    "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
    "blob": "3deaa239636e36c09e09a92374ca07aefb54e733",
    "sha256": "a93ff0eb81234ad29512ac46fb22935d338a015ef4485f653d25d9a33ffd963d"
  },
  {
    "path": "tests/shortest-publication-20/frequency-presentation-lineage.test.mjs",
    "blob": "1cd34a3f06c548f220f18c71e0d28fffd719706d",
    "sha256": "28bda8bdfbf6b261387e89b745e47ee8aaa12574d04190ddafdfaedc12cdf21f"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "blob": "12bb63c142fe39b43323beb82c066a30e8d4dca2",
    "sha256": "ce1a8594dd771d3593a2599f6dc682b179791de7b70a7e055434032d10165c24"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "68bc22d7f1f7723d48f5ffd01a7ee484bbf5f800",
    "sha256": "9fac1fd2720461d7158b1f9a330073394c39a9bfbf580ff3dc5221c0eeea2bcd"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.mjs",
    "blob": "cc099cfff14c79cd57558e6a8c873a8c13dc98cd",
    "sha256": "60a4153d25a84758e0f418f639a54df083ab4fe050eb6fb57142eb7c56333e9f"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.d.mts",
    "blob": "a8aea9fff6eeb37ac205a4383532e14895437256",
    "sha256": "bae4908bfb29bd5cd3c3480c76c12e913f8946dd3d93f155529b85c54ada0b62"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.test.mjs",
    "blob": "883fc969ac6fa9ce4ff43f0c09c0326bfa02e0d9",
    "sha256": "946f1b3e1996c62a8d2a790d244732a1f44571be10ee3d68b4b6eb190cb2d39e"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "2bf9db9747fd26b4e9d4fb03c512a12df514b3fa",
    "sha256": "cee4d541c258f9053122467e2ee6be7a2ffde4a86f983755f7e31fe435daf183"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "c6aff9eb7f8cbf3f26cc78fdab35430f1d7ff327",
    "sha256": "305b63aa47572deae71c1ae19dc33b0150ab8c2f717a210150a3c699dc0ae378"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs",
    "blob": "887f8c7e7b144c2d0e3e1973876a448ee68a032c",
    "sha256": "d8b1597ad1490d992eb82f84601bf0dd069634998ca005de0ed1679d91e11b38"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "0bc2f6b1bdca507b4a035169a4286f14ce8b4696",
    "sha256": "7902d0f3d3ccb57809181857a2b34a9476d1148e96f9ee03ff870aee017e962f"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "12d39ae6e52ba1d71d883f9658ad6a39d8dd2190",
    "sha256": "9f0c6c952cddf8f8c5e470d5b3f1c2630191b89a5bd491c19942010d12e12343"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "b0926041316e982d647c21a138a0c45b6b5ade08",
    "sha256": "2ea40f7db204c9e747cb1233ce97a380a350ba5106b0fcf2e0f7d305ee5e1c9f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "249efa4d7e13dd61cfea8e76b98e2e9bb44f6d35",
    "sha256": "5c3751b9faa4d709b0ffc4eebb543e6563cd0ae68d560804b73cb8ede20cf535"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "8b63559ba51b2572c494d574f81621d4d415b61d",
    "sha256": "b668815fdc74e2d4dc74bc596d538b08dfcc7a727b00769f3fe0fc8d2de69cc8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "c448f3ef12ce3555204b0a1afd7ffb01070d619c",
    "sha256": "d6475cfdf00c6612b7a24501186ed14fb96cdc45f2a4de5b4c07eb92c69cd992"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "5e44a96e209099c5627b3dfb5de6a8d7ccd638f6",
    "sha256": "b5f86a570cd28c313d0f655ae24f4de1d026775eba2225d87e15316ce377f72c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "39cede02fecf9217d9c758c015681279fe7fdc9d",
    "sha256": "6bee4dc30f337d7ee4d5bfead9e795ec99c1192cdc968a0a00e412e4fb5c2e41"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "e9109887536798a36a71a9ce7159141f7a2085cc",
    "sha256": "ea97d81f5958d170a4d37242e161323887abe3be57797eeeb133036f34ca1be5"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "e2e6899e747a52f3fded19f9eaf9916799377e16",
    "sha256": "7246d8bd6edf5f65944c39b1ed019f7a6fc688d578156cd4e672e59a0a0bbc3a"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v33.mjs",
    "blob": "257d504f5437f4de2e0a47d828e56cd991e270d6",
    "sha256": "7e0936ac496befb395f55e7e375ce2bcf12d27ac32588e70b0902f42e1868c72"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority99.mjs",
    "blob": "3c90cad2e910ac9f842955f1cec4611a3287c70e",
    "sha256": "94f4c029d26799cb699dc93d4c8caba411fb85bdc32130d6a5ca1c5304631e26"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "a9eca110b72eb77f333b8fa73e1de735ad4cd9d0",
    "sha256": "031080da9761c0f5ab3eeecc7c200cc07616e6804f9dcc18f5fe606f7dac2ab4"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "e2c629c57ea62a4761ef448f26e4523bedcf211f",
    "sha256": "7f5232be94cd813319e4f4e7ddddba6659687603b2cd951156730b2e031c95c8"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "99764f159b14c8fc4714cbc0f3781ff1205a61f0",
    "sha256": "5aa0bf91382605f4456636c32b027eac4b6bf220176b0bae30ed2dc22d6460b4"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision100.json",
    "blob": "9afce874ba1f6bd5412067792aa2ba5b8d49edfe",
    "sha256": "31a0715ef933faf43e21fb0c5c292f557e7d8095c2933af60bf2214367a9a101"
  }
]);
export const additionalStage8V33BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","64c86e4fe5f77816f2b5b45ea2177ed56520b292","71c1ce57dd86675ed8bfdd498e7a4103e61c0a5d","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","ee37d115e7415bbb0bafb88fe1cdd6f8520c3930"]);
export const acceptedStage8V34=Object.freeze([
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-claims.mjs",
    "blob": "1d38f116c6329c1d0896d904f9e2599aa3db2770",
    "sha256": "c085049403c9df4c8e675f7a8cf9d6b89459ac5572dc6a21d1f23bd2513c6e50"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-batch.test.mjs",
    "blob": "4a0755885d17f7e341738188d679f2ea451c52a9",
    "sha256": "d41130285b42a4c434816bfe9d980a47967beeb4c81351e0d0a3bf53445cb514"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.mjs",
    "blob": "7dc137f3a5305921d36f5f837f6f33f6c8538c72",
    "sha256": "a4a397782d1d267656f3320e54a2079f795be68046539f7efcbafe84610b88b7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.test.mjs",
    "blob": "cc207ca303f37100c1715e6b93fee43c4e5b117b",
    "sha256": "995fb96ae6cc48cc052c130657f84539c716f9557fdad83fc5124b7ed9217ff6"
  },
  {
    "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
    "blob": "3deaa239636e36c09e09a92374ca07aefb54e733",
    "sha256": "a93ff0eb81234ad29512ac46fb22935d338a015ef4485f653d25d9a33ffd963d"
  },
  {
    "path": "tests/shortest-publication-20/frequency-presentation-lineage.test.mjs",
    "blob": "1cd34a3f06c548f220f18c71e0d28fffd719706d",
    "sha256": "28bda8bdfbf6b261387e89b745e47ee8aaa12574d04190ddafdfaedc12cdf21f"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "blob": "12bb63c142fe39b43323beb82c066a30e8d4dca2",
    "sha256": "ce1a8594dd771d3593a2599f6dc682b179791de7b70a7e055434032d10165c24"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "68bc22d7f1f7723d48f5ffd01a7ee484bbf5f800",
    "sha256": "9fac1fd2720461d7158b1f9a330073394c39a9bfbf580ff3dc5221c0eeea2bcd"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.mjs",
    "blob": "cc099cfff14c79cd57558e6a8c873a8c13dc98cd",
    "sha256": "60a4153d25a84758e0f418f639a54df083ab4fe050eb6fb57142eb7c56333e9f"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.d.mts",
    "blob": "a8aea9fff6eeb37ac205a4383532e14895437256",
    "sha256": "bae4908bfb29bd5cd3c3480c76c12e913f8946dd3d93f155529b85c54ada0b62"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.test.mjs",
    "blob": "883fc969ac6fa9ce4ff43f0c09c0326bfa02e0d9",
    "sha256": "946f1b3e1996c62a8d2a790d244732a1f44571be10ee3d68b4b6eb190cb2d39e"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "2bf9db9747fd26b4e9d4fb03c512a12df514b3fa",
    "sha256": "cee4d541c258f9053122467e2ee6be7a2ffde4a86f983755f7e31fe435daf183"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "c6aff9eb7f8cbf3f26cc78fdab35430f1d7ff327",
    "sha256": "305b63aa47572deae71c1ae19dc33b0150ab8c2f717a210150a3c699dc0ae378"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs",
    "blob": "887f8c7e7b144c2d0e3e1973876a448ee68a032c",
    "sha256": "d8b1597ad1490d992eb82f84601bf0dd069634998ca005de0ed1679d91e11b38"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "0bc2f6b1bdca507b4a035169a4286f14ce8b4696",
    "sha256": "7902d0f3d3ccb57809181857a2b34a9476d1148e96f9ee03ff870aee017e962f"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "12d39ae6e52ba1d71d883f9658ad6a39d8dd2190",
    "sha256": "9f0c6c952cddf8f8c5e470d5b3f1c2630191b89a5bd491c19942010d12e12343"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "b0926041316e982d647c21a138a0c45b6b5ade08",
    "sha256": "2ea40f7db204c9e747cb1233ce97a380a350ba5106b0fcf2e0f7d305ee5e1c9f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "249efa4d7e13dd61cfea8e76b98e2e9bb44f6d35",
    "sha256": "5c3751b9faa4d709b0ffc4eebb543e6563cd0ae68d560804b73cb8ede20cf535"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "a5c6ac132eb327dcc6e79273094ae9791dff89b9",
    "sha256": "6f25b13234e666cedc31392fb04c0dc732bb8941ded2b3b0d15388b9c4718d92"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "c448f3ef12ce3555204b0a1afd7ffb01070d619c",
    "sha256": "d6475cfdf00c6612b7a24501186ed14fb96cdc45f2a4de5b4c07eb92c69cd992"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "5e44a96e209099c5627b3dfb5de6a8d7ccd638f6",
    "sha256": "b5f86a570cd28c313d0f655ae24f4de1d026775eba2225d87e15316ce377f72c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "2aba37f567019a0cc51e474532290f9c7bfb4118",
    "sha256": "06ac00bde3f708a743c079d6df4810225a9dd5d43bfe0c1696c143f498571387"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "55a363bec26eb670a46e9df30477a8baeeb6a1f6",
    "sha256": "8847893207ed79a013bfe622df81faf6ec97d845ceaae9a28403df17d2a91cf2"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "1d98b0172fc1c16055714d1e0e30248ca1b6aef1",
    "sha256": "8d31222a39c9cd677489292904287daac328d14eb97ba5d8d8fa7915cb5f0005"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v34.mjs",
    "blob": "12152e3907bc14e63b770c066e1d6eaf92a98c1f",
    "sha256": "c03fd22031c74014d46af6baab5f3f32cfeb4445679177fab95d194de418cef8"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority100.mjs",
    "blob": "bd5f5fdc43a504974eebb729f7dd52e11110d64b",
    "sha256": "603489cfa92fb45786dd0d6f6448d688424ed3aae3d2ccf0b5aa462aafcb9a76"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "c167e20884efc2e8493b8efd3edf5fdb317cba03",
    "sha256": "a52ead249533d01c7e6e62a20d2ce61eea860fe6ed4bab27b59cdf54078bff8a"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "24f6b69bcc60591dba345bd05646b30f12f9acf5",
    "sha256": "c00c9ce33db099b5f124aaa6f8c3d1658acfa2877785b76004c88e9de9a7740b"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "2c8886c7ca1d5f120d06aa80afae38d596007d19",
    "sha256": "1dc5653f14c15ddb4d1677ef0d34107379b1fbdadb626a2adc245cc281d83028"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision101.json",
    "blob": "e6131ed59c6cf2b5316d7520ecedfb2b7323f6ed",
    "sha256": "0169105976b6b150d34d94348758f98a3fba0da5c9fe31b95fcf50eff903e4ec"
  }
]);
export const additionalStage8V34BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","09d5af6f7343db1173bd71fb9b1f2ecc0f916c0a","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","64c86e4fe5f77816f2b5b45ea2177ed56520b292","80fc173c4746cb518ef90ade39864605002a3ee4","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47"]);
export const acceptedStage8V35=Object.freeze([
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-claims.mjs",
    "blob": "1d38f116c6329c1d0896d904f9e2599aa3db2770",
    "sha256": "c085049403c9df4c8e675f7a8cf9d6b89459ac5572dc6a21d1f23bd2513c6e50"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-batch.test.mjs",
    "blob": "4a0755885d17f7e341738188d679f2ea451c52a9",
    "sha256": "d41130285b42a4c434816bfe9d980a47967beeb4c81351e0d0a3bf53445cb514"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.mjs",
    "blob": "9f3bc42e6a5edb49d112ce1478ba56b88cc2039c",
    "sha256": "89fe7acc03016088fce6b5dc78fc64d81977339d336e1e6062124a8b6c77839f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.test.mjs",
    "blob": "4ec46f02291e512921136e51845ead72c3314c1c",
    "sha256": "85306d5f684ec063551ebce8f0597537c3c70957b8667dbeb48f28b9d1fa87bf"
  },
  {
    "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
    "blob": "c122d7962c2a4f93e2209f4b5b0304c341c04a0e",
    "sha256": "944a142a786b356361f93bd3f1de72e8982d3075615de392f0d22b6dff3fbb9b"
  },
  {
    "path": "tests/shortest-publication-20/frequency-presentation-lineage.test.mjs",
    "blob": "16251d9a2becba514c7c78977907a8cdfc35e32f",
    "sha256": "d8933b891a2b8d74f4ae71dc0360a4ba3b7a37dfad13cbde07672c9f59f37199"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "blob": "83b6233bf5fc03bc98525d16dbdbc9c1478e38e8",
    "sha256": "3460587b2da10feca6c8893a270ed5cd457811ed191a08f6b07a12183e8bdd0f"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "68bc22d7f1f7723d48f5ffd01a7ee484bbf5f800",
    "sha256": "9fac1fd2720461d7158b1f9a330073394c39a9bfbf580ff3dc5221c0eeea2bcd"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.mjs",
    "blob": "cc099cfff14c79cd57558e6a8c873a8c13dc98cd",
    "sha256": "60a4153d25a84758e0f418f639a54df083ab4fe050eb6fb57142eb7c56333e9f"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.d.mts",
    "blob": "a8aea9fff6eeb37ac205a4383532e14895437256",
    "sha256": "bae4908bfb29bd5cd3c3480c76c12e913f8946dd3d93f155529b85c54ada0b62"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.test.mjs",
    "blob": "883fc969ac6fa9ce4ff43f0c09c0326bfa02e0d9",
    "sha256": "946f1b3e1996c62a8d2a790d244732a1f44571be10ee3d68b4b6eb190cb2d39e"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "2bf9db9747fd26b4e9d4fb03c512a12df514b3fa",
    "sha256": "cee4d541c258f9053122467e2ee6be7a2ffde4a86f983755f7e31fe435daf183"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "c6aff9eb7f8cbf3f26cc78fdab35430f1d7ff327",
    "sha256": "305b63aa47572deae71c1ae19dc33b0150ab8c2f717a210150a3c699dc0ae378"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs",
    "blob": "887f8c7e7b144c2d0e3e1973876a448ee68a032c",
    "sha256": "d8b1597ad1490d992eb82f84601bf0dd069634998ca005de0ed1679d91e11b38"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "0bc2f6b1bdca507b4a035169a4286f14ce8b4696",
    "sha256": "7902d0f3d3ccb57809181857a2b34a9476d1148e96f9ee03ff870aee017e962f"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "12d39ae6e52ba1d71d883f9658ad6a39d8dd2190",
    "sha256": "9f0c6c952cddf8f8c5e470d5b3f1c2630191b89a5bd491c19942010d12e12343"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "b0926041316e982d647c21a138a0c45b6b5ade08",
    "sha256": "2ea40f7db204c9e747cb1233ce97a380a350ba5106b0fcf2e0f7d305ee5e1c9f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "249efa4d7e13dd61cfea8e76b98e2e9bb44f6d35",
    "sha256": "5c3751b9faa4d709b0ffc4eebb543e6563cd0ae68d560804b73cb8ede20cf535"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "afe64a0edbcd6a379ab6787e6f7642ab41aa2e5b",
    "sha256": "7d696badb3e54f645edaaf0c602bf257e2cab8ed6e6fb78af7d963cb466b1d39"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "c448f3ef12ce3555204b0a1afd7ffb01070d619c",
    "sha256": "d6475cfdf00c6612b7a24501186ed14fb96cdc45f2a4de5b4c07eb92c69cd992"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "5e44a96e209099c5627b3dfb5de6a8d7ccd638f6",
    "sha256": "b5f86a570cd28c313d0f655ae24f4de1d026775eba2225d87e15316ce377f72c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "2aba37f567019a0cc51e474532290f9c7bfb4118",
    "sha256": "06ac00bde3f708a743c079d6df4810225a9dd5d43bfe0c1696c143f498571387"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "2a442ed3209f24f1699ccd3621bfa8e378299b63",
    "sha256": "664e81a391ef56e3646825c7d92a7ce50ed3f056a1868a12f1aec76e6d554c77"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "843e0a96d6cfe9f459f8021a41704dbeb49c12d8",
    "sha256": "33ca2aa9f377e0f765ed6f5e55df1e491f1aba58076f3e105b1dd48926254238"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v35.mjs",
    "blob": "adc95a447eef417fe7395671ad10f5378fc05600",
    "sha256": "e794bf5df0875c6a06a25f70378aeb7b36d206ee034b54510d2dc01e7283404a"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority101.mjs",
    "blob": "5b001ff89f7b42090b57331f2a7d6150bd8ef0ca",
    "sha256": "64d0494f134456dbbf935bad35658e6afc4a5389ac78e170ba27e76b3b04a259"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "1d92b014c1bae060d407312908429827b530301c",
    "sha256": "bdd23c46408a18e5781645a6f1ed55ab4707a6152ac14d086c262e57c7fb61ed"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "3fad00b820fb6067fa5bfddbc49e7d0987144a76",
    "sha256": "75b7ff5a5a801ec28a365e7551b83ae44e07f95073b32e6fd2e05ad215cd76db"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "032c0bb85fb1a4d05e4d95de2780569b34d67d4b",
    "sha256": "c05daab5a1c50b5c3be2e9f663990f39c9ffe4bbebb7a79d5a2a68461a308ff5"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision102.json",
    "blob": "06ed1861a659f80acb5b5ea1dd2e3cda3f01212b",
    "sha256": "22be862ec5ff1b85419101f2713b7f61629547ef9e930d911df56bd0bd7fe7d1"
  }
]);
export const additionalStage8V35BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","61d181156946365b9193d9db91bbcd28c29c411d","64c86e4fe5f77816f2b5b45ea2177ed56520b292","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","da35b2dc249bb0312094eb6e56f52c90772c61cf"]);
export const acceptedStage8V36=Object.freeze([
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-claims.mjs",
    "blob": "1d38f116c6329c1d0896d904f9e2599aa3db2770",
    "sha256": "c085049403c9df4c8e675f7a8cf9d6b89459ac5572dc6a21d1f23bd2513c6e50"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-batch.test.mjs",
    "blob": "4a0755885d17f7e341738188d679f2ea451c52a9",
    "sha256": "d41130285b42a4c434816bfe9d980a47967beeb4c81351e0d0a3bf53445cb514"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.mjs",
    "blob": "0de686169f940425a46253bba4927a5c7b0a03e2",
    "sha256": "38df96a9ee234e6abfd3a8605a5f64883ac24485ca3a87f11c983a271eecd956"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.test.mjs",
    "blob": "ff56978337dfd54caf33382ff203dbbb318d6d6e",
    "sha256": "fed2e3f595b363699381c42a42491b7e2e81fee15ea9f363fc1066f3c9e90715"
  },
  {
    "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
    "blob": "c122d7962c2a4f93e2209f4b5b0304c341c04a0e",
    "sha256": "944a142a786b356361f93bd3f1de72e8982d3075615de392f0d22b6dff3fbb9b"
  },
  {
    "path": "tests/shortest-publication-20/frequency-presentation-lineage.test.mjs",
    "blob": "16251d9a2becba514c7c78977907a8cdfc35e32f",
    "sha256": "d8933b891a2b8d74f4ae71dc0360a4ba3b7a37dfad13cbde07672c9f59f37199"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "blob": "83b6233bf5fc03bc98525d16dbdbc9c1478e38e8",
    "sha256": "3460587b2da10feca6c8893a270ed5cd457811ed191a08f6b07a12183e8bdd0f"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "68bc22d7f1f7723d48f5ffd01a7ee484bbf5f800",
    "sha256": "9fac1fd2720461d7158b1f9a330073394c39a9bfbf580ff3dc5221c0eeea2bcd"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.mjs",
    "blob": "cc099cfff14c79cd57558e6a8c873a8c13dc98cd",
    "sha256": "60a4153d25a84758e0f418f639a54df083ab4fe050eb6fb57142eb7c56333e9f"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.d.mts",
    "blob": "a8aea9fff6eeb37ac205a4383532e14895437256",
    "sha256": "bae4908bfb29bd5cd3c3480c76c12e913f8946dd3d93f155529b85c54ada0b62"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.test.mjs",
    "blob": "883fc969ac6fa9ce4ff43f0c09c0326bfa02e0d9",
    "sha256": "946f1b3e1996c62a8d2a790d244732a1f44571be10ee3d68b4b6eb190cb2d39e"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "2bf9db9747fd26b4e9d4fb03c512a12df514b3fa",
    "sha256": "cee4d541c258f9053122467e2ee6be7a2ffde4a86f983755f7e31fe435daf183"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "c6aff9eb7f8cbf3f26cc78fdab35430f1d7ff327",
    "sha256": "305b63aa47572deae71c1ae19dc33b0150ab8c2f717a210150a3c699dc0ae378"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs",
    "blob": "887f8c7e7b144c2d0e3e1973876a448ee68a032c",
    "sha256": "d8b1597ad1490d992eb82f84601bf0dd069634998ca005de0ed1679d91e11b38"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "0bc2f6b1bdca507b4a035169a4286f14ce8b4696",
    "sha256": "7902d0f3d3ccb57809181857a2b34a9476d1148e96f9ee03ff870aee017e962f"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "12d39ae6e52ba1d71d883f9658ad6a39d8dd2190",
    "sha256": "9f0c6c952cddf8f8c5e470d5b3f1c2630191b89a5bd491c19942010d12e12343"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "b0926041316e982d647c21a138a0c45b6b5ade08",
    "sha256": "2ea40f7db204c9e747cb1233ce97a380a350ba5106b0fcf2e0f7d305ee5e1c9f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "249efa4d7e13dd61cfea8e76b98e2e9bb44f6d35",
    "sha256": "5c3751b9faa4d709b0ffc4eebb543e6563cd0ae68d560804b73cb8ede20cf535"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "d50881f3e1090da682343d06c9711b3ad7457357",
    "sha256": "904bf3e4443bebf2db624ea727fa1ad46d98f608cef0101b69f1704fc3d953c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "c448f3ef12ce3555204b0a1afd7ffb01070d619c",
    "sha256": "d6475cfdf00c6612b7a24501186ed14fb96cdc45f2a4de5b4c07eb92c69cd992"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "5e44a96e209099c5627b3dfb5de6a8d7ccd638f6",
    "sha256": "b5f86a570cd28c313d0f655ae24f4de1d026775eba2225d87e15316ce377f72c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "32b8a6e99b8eb0270b7fe79f14ab5c912267f3d4",
    "sha256": "27e4561fb026888e9808fa73b407d9cf2ae5eb1c07dc62ff1769f46533bc85c1"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "3cc9a9833e3b6870802cf162762efca54e0fae29",
    "sha256": "cb63ea3593e4a08d0fca6d63508d43e3fe1311f93cbd236c679602518825f538"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "4d6f49f3606a589f4698780c41694f519fb0cde7",
    "sha256": "e10539d64cc06758debe4090ec0c63391c6b18e71775e643a578447f034b8b41"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v36.mjs",
    "blob": "ac7b8eca98a2e4b9572e230fbfe35b1ec5f7ea8f",
    "sha256": "b34794e5242878704ed935398632eec8ba9b50b5f1cd38f70c433ff9e5a08f35"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority102.mjs",
    "blob": "138605981b36b57b36fed7635db4153791da62b5",
    "sha256": "2cde31808c4855163b42f2c88eb6b3ad3d88a28373cfe4e2cdbcdf261f5a461c"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "63abe2297d403a1ccf613ad540ad1531b7b08d11",
    "sha256": "64adfe4427c24a09573f60eba1cef3af7a351ccb218bee53aa215978c25d5552"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "03660db9ede578f81877dfbc6348e2dffcd52a79",
    "sha256": "dbe0ff6ac813a179354316aec12f0e1b8b19baf7a19065347cddbf38a20ecb4b"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "b3f02b768494e12058d10648c5c4cd4a7fe427ee",
    "sha256": "71ede32ec82fabde9593839f8df5cb68a4f67e5674736e78f7d0deff5bb09910"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision103.json",
    "blob": "1b4cf085524f33b57d0d9ad57949017df152b225",
    "sha256": "bf345f08ba54d174830b958bb3e7f40cc3fb42639b8fd75ded35fdb74619cdac"
  }
]);
export const additionalStage8V36BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","0a1701f7674b642d3e37cf7b7963b37e8a5ae3a8","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","64c86e4fe5f77816f2b5b45ea2177ed56520b292","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","daca66a304151db5691caf08456344eb41d0bde4"]);
export const acceptedStage8V37=Object.freeze([
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "blob": "22b12551c55b8f500f38ddabfb7bba5381575539",
    "sha256": "018ac07149492c2e788362b6c0d03ce6a4c407bb504bca91615a96daf803370b"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-publication-transport.mjs",
    "blob": "cdcc32bf183e8adb395a3b294455ed9657add750",
    "sha256": "281c590fe73cff1fd466fb428286d8a885ef3117ab61e4b652fe77642e3d32ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.mjs",
    "blob": "51894528599103dd5341d229bbefa18e46e395f3",
    "sha256": "6cf61baf387cbaf12fc24618e94e9279f65ccf3f55af47993aedd55ea5022d92"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.test.mjs",
    "blob": "498301c9581d3110467ffb07bdf8821565213d65",
    "sha256": "0ff59e5258f722bbb0e309856aba4dd82ba3df8ebcff8f425ba1327b6cd6c60f"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-claims.mjs",
    "blob": "1d38f116c6329c1d0896d904f9e2599aa3db2770",
    "sha256": "c085049403c9df4c8e675f7a8cf9d6b89459ac5572dc6a21d1f23bd2513c6e50"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-batch.test.mjs",
    "blob": "4a0755885d17f7e341738188d679f2ea451c52a9",
    "sha256": "d41130285b42a4c434816bfe9d980a47967beeb4c81351e0d0a3bf53445cb514"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.mjs",
    "blob": "0de686169f940425a46253bba4927a5c7b0a03e2",
    "sha256": "38df96a9ee234e6abfd3a8605a5f64883ac24485ca3a87f11c983a271eecd956"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.test.mjs",
    "blob": "ff56978337dfd54caf33382ff203dbbb318d6d6e",
    "sha256": "fed2e3f595b363699381c42a42491b7e2e81fee15ea9f363fc1066f3c9e90715"
  },
  {
    "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
    "blob": "c122d7962c2a4f93e2209f4b5b0304c341c04a0e",
    "sha256": "944a142a786b356361f93bd3f1de72e8982d3075615de392f0d22b6dff3fbb9b"
  },
  {
    "path": "tests/shortest-publication-20/frequency-presentation-lineage.test.mjs",
    "blob": "16251d9a2becba514c7c78977907a8cdfc35e32f",
    "sha256": "d8933b891a2b8d74f4ae71dc0360a4ba3b7a37dfad13cbde07672c9f59f37199"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "blob": "83b6233bf5fc03bc98525d16dbdbc9c1478e38e8",
    "sha256": "3460587b2da10feca6c8893a270ed5cd457811ed191a08f6b07a12183e8bdd0f"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "68bc22d7f1f7723d48f5ffd01a7ee484bbf5f800",
    "sha256": "9fac1fd2720461d7158b1f9a330073394c39a9bfbf580ff3dc5221c0eeea2bcd"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.mjs",
    "blob": "cc099cfff14c79cd57558e6a8c873a8c13dc98cd",
    "sha256": "60a4153d25a84758e0f418f639a54df083ab4fe050eb6fb57142eb7c56333e9f"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.d.mts",
    "blob": "a8aea9fff6eeb37ac205a4383532e14895437256",
    "sha256": "bae4908bfb29bd5cd3c3480c76c12e913f8946dd3d93f155529b85c54ada0b62"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.test.mjs",
    "blob": "883fc969ac6fa9ce4ff43f0c09c0326bfa02e0d9",
    "sha256": "946f1b3e1996c62a8d2a790d244732a1f44571be10ee3d68b4b6eb190cb2d39e"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "2bf9db9747fd26b4e9d4fb03c512a12df514b3fa",
    "sha256": "cee4d541c258f9053122467e2ee6be7a2ffde4a86f983755f7e31fe435daf183"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "c6aff9eb7f8cbf3f26cc78fdab35430f1d7ff327",
    "sha256": "305b63aa47572deae71c1ae19dc33b0150ab8c2f717a210150a3c699dc0ae378"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs",
    "blob": "887f8c7e7b144c2d0e3e1973876a448ee68a032c",
    "sha256": "d8b1597ad1490d992eb82f84601bf0dd069634998ca005de0ed1679d91e11b38"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "0bc2f6b1bdca507b4a035169a4286f14ce8b4696",
    "sha256": "7902d0f3d3ccb57809181857a2b34a9476d1148e96f9ee03ff870aee017e962f"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "12d39ae6e52ba1d71d883f9658ad6a39d8dd2190",
    "sha256": "9f0c6c952cddf8f8c5e470d5b3f1c2630191b89a5bd491c19942010d12e12343"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "b0926041316e982d647c21a138a0c45b6b5ade08",
    "sha256": "2ea40f7db204c9e747cb1233ce97a380a350ba5106b0fcf2e0f7d305ee5e1c9f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "adb042a35db9c11418fd1f4154907000b90c3dd7",
    "sha256": "09c70ed064f6f442860a60f500551950ff1b5b913a07a795db773ffc807b117c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "249efa4d7e13dd61cfea8e76b98e2e9bb44f6d35",
    "sha256": "5c3751b9faa4d709b0ffc4eebb543e6563cd0ae68d560804b73cb8ede20cf535"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "955c24f9e29eb08c6d726278a1fd43c60e6cccac",
    "sha256": "ba78a407c7f90885dad8d5ede343cb4a7785fa1fea8d5ffc9afc28287c2e290d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "c448f3ef12ce3555204b0a1afd7ffb01070d619c",
    "sha256": "d6475cfdf00c6612b7a24501186ed14fb96cdc45f2a4de5b4c07eb92c69cd992"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "5e44a96e209099c5627b3dfb5de6a8d7ccd638f6",
    "sha256": "b5f86a570cd28c313d0f655ae24f4de1d026775eba2225d87e15316ce377f72c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "32b8a6e99b8eb0270b7fe79f14ab5c912267f3d4",
    "sha256": "27e4561fb026888e9808fa73b407d9cf2ae5eb1c07dc62ff1769f46533bc85c1"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "9a211e88a73f1609569cb987124274f323d7e5c3",
    "sha256": "ae84df635376f9a43606d93ab516f6e11e33d1300c6ef87358c1c59e6b935a1a"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "6b40f8e05251e85db428c662948e473a34e7405f",
    "sha256": "6973e56186d4bcad1d8a92b5a9d69228c73217bfb90421f552e19dcf3eb130b7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v37.mjs",
    "blob": "9931d8a861f78aebad3b5b0fdbabf70f3dad64bf",
    "sha256": "770dbb19b740834a5da19db8bf63494c76f5814fd550f91cd4005bd593b2aa3a"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority103.mjs",
    "blob": "81637dca09fae3b6f2c0295ca564440e5353f292",
    "sha256": "092e36419062bf5ef9759c0aedf8b768a33c1ad641cfecae3120ca28b1da0477"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "03fce2ba677c800a4fadc9286248df258c691947",
    "sha256": "c2ce08f2e93b71db9905d8572c0068998bee09be5afc387ac3616e45fd1f4a94"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "a0247edea86369985fa1abbd6a60f2aea8311117",
    "sha256": "f01b86c490381bbee92affbf10fbd3f50bd406625ee37c0976af17d750b60a2f"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "33229ce50408de9bcea5e4a4541217a2484f306e",
    "sha256": "a3ae9a770ac7c8c60a23c9833a14f31d4f4ae839a256bfbf6874123b4a07b11d"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision104.json",
    "blob": "5f380dd57f019991d689ed4d252ede99921feb4c",
    "sha256": "eedc968e38317c0ff6b38415ec3993058f5cd985a1848bd990bad3c112b4ab3d"
  }
]);
export const additionalStage8V37BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","214823a82bcd8c077be517cfb97c0c87d831986e","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","64c86e4fe5f77816f2b5b45ea2177ed56520b292","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","aeeace285aba6758031407a89048b856a00a7d4f"]);
export const acceptedStage8V38=Object.freeze([
  {
    "path": "tests/milestone100-20261114/source-stage8-activation.mjs",
    "blob": "b5548921fd9d1c2c543859f91d0a4275781e6e6e",
    "sha256": "fe0ff7c13cd11f699bb8c33ac98563268bd5864aaff0c8f6511271bfd78596f3"
  },
  {
    "path": "docs/four-worker-integration-20261115/source-stage9.json",
    "blob": "de0c966029ffae0917c65395dedf7d7adda8b4f5",
    "sha256": "1aa535186df0687954816b388378b36dcb2297deedf8e3a56e0d956da7609afd"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9-policy.mjs",
    "blob": "b3e130c437283263ac7369d1b631243bcbccb98b",
    "sha256": "6ddf247c69569a88ac37361f29b2094f39ce2ae0cbcc82f0687b4bda4dbfb1b6"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.mjs",
    "blob": "bd1ebca6b32d65f1688aa885f333135e7533d5cd",
    "sha256": "3420af35205889aea7e0a430841bc05db6712917ba2320792da4b01106f9b5b8"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.test.mjs",
    "blob": "d987555561d27c68ac8edd6d69fe9cb12dd14aa4",
    "sha256": "be8a44944545f564b25f2193f407af6c6a89d90506c0e36c8b45fa3d7c45c1c2"
  },
  {
    "path": "tests/worker-a-intake-20261115/auth-browser.mjs",
    "blob": "b318ba753fa5360ac289dac92d7028b8c0c6864b",
    "sha256": "67c494e2071dc59f5aae626ee7fb52790833d0fedfc057627973c1f8494a06ae"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/actions.ts",
    "blob": "8cca4bb5b500872c86691852bf829ef25a1324cd",
    "sha256": "5d346d8615f8351b429cbcedb2817d55808ade7fe4c5ac4e93f9be56f1e20c9c"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/client.tsx",
    "blob": "afea2ec06e87737393d0ce46b19ce636cfc42b22",
    "sha256": "da9b638a304347da1da8dedb29c2fcc8709b866f4d728d9a9add3a5f190fe7ff"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/page.tsx",
    "blob": "e153c73b257971f38d2bd18f108c622fdf297aa0",
    "sha256": "c70a0c461f4aa461a5fc732a5d4a142c78d29d7e5e9948f4e9bab4c3e589a994"
  },
  {
    "path": "tests/worker-a-intake-20261115/source-and-compatibility.mjs",
    "blob": "e08d469c6a76c0532e47dbf73e1b0cd7d88496ed",
    "sha256": "772ca0dbc0c96bf19bd6ee27eeaf94265e28c13fc07ea276cab39c127f474e1c"
  },
  {
    "path": "tests/worker-a-intake-20261115/successor-admission.mjs",
    "blob": "3ef9dc6b00a7daf757a799ba9ad42050a388e26e",
    "sha256": "6bf3b64542ec0f64cecdbd2f500f47234cf3a8ca603a1ba26bddcea8e9617a7b"
  },
  {
    "path": "tests/worker-d-shared-delivery-20261115/acceptance.mjs",
    "blob": "61d67a7acaecad4ecece913dcf130c49b81b967f",
    "sha256": "2eff8ae85e08de3c542a7b31fb0bc9836b90ee7de3487d5835a51114a55063b4"
  },
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "blob": "22b12551c55b8f500f38ddabfb7bba5381575539",
    "sha256": "018ac07149492c2e788362b6c0d03ce6a4c407bb504bca91615a96daf803370b"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-publication-transport.mjs",
    "blob": "cdcc32bf183e8adb395a3b294455ed9657add750",
    "sha256": "281c590fe73cff1fd466fb428286d8a885ef3117ab61e4b652fe77642e3d32ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.mjs",
    "blob": "51894528599103dd5341d229bbefa18e46e395f3",
    "sha256": "6cf61baf387cbaf12fc24618e94e9279f65ccf3f55af47993aedd55ea5022d92"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.test.mjs",
    "blob": "498301c9581d3110467ffb07bdf8821565213d65",
    "sha256": "0ff59e5258f722bbb0e309856aba4dd82ba3df8ebcff8f425ba1327b6cd6c60f"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-claims.mjs",
    "blob": "1d38f116c6329c1d0896d904f9e2599aa3db2770",
    "sha256": "c085049403c9df4c8e675f7a8cf9d6b89459ac5572dc6a21d1f23bd2513c6e50"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-batch.test.mjs",
    "blob": "4a0755885d17f7e341738188d679f2ea451c52a9",
    "sha256": "d41130285b42a4c434816bfe9d980a47967beeb4c81351e0d0a3bf53445cb514"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.mjs",
    "blob": "0de686169f940425a46253bba4927a5c7b0a03e2",
    "sha256": "38df96a9ee234e6abfd3a8605a5f64883ac24485ca3a87f11c983a271eecd956"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.test.mjs",
    "blob": "ff56978337dfd54caf33382ff203dbbb318d6d6e",
    "sha256": "fed2e3f595b363699381c42a42491b7e2e81fee15ea9f363fc1066f3c9e90715"
  },
  {
    "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
    "blob": "c122d7962c2a4f93e2209f4b5b0304c341c04a0e",
    "sha256": "944a142a786b356361f93bd3f1de72e8982d3075615de392f0d22b6dff3fbb9b"
  },
  {
    "path": "tests/shortest-publication-20/frequency-presentation-lineage.test.mjs",
    "blob": "16251d9a2becba514c7c78977907a8cdfc35e32f",
    "sha256": "d8933b891a2b8d74f4ae71dc0360a4ba3b7a37dfad13cbde07672c9f59f37199"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "blob": "83b6233bf5fc03bc98525d16dbdbc9c1478e38e8",
    "sha256": "3460587b2da10feca6c8893a270ed5cd457811ed191a08f6b07a12183e8bdd0f"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "581a5cd64f4530c83c5c2609d94496d33f465c70",
    "sha256": "8f20689d63e01e58a2cdcb96ca4eb63e4a5e9da8118a68752234b4ed940330b6"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.mjs",
    "blob": "cc099cfff14c79cd57558e6a8c873a8c13dc98cd",
    "sha256": "60a4153d25a84758e0f418f639a54df083ab4fe050eb6fb57142eb7c56333e9f"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.d.mts",
    "blob": "a8aea9fff6eeb37ac205a4383532e14895437256",
    "sha256": "bae4908bfb29bd5cd3c3480c76c12e913f8946dd3d93f155529b85c54ada0b62"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.test.mjs",
    "blob": "883fc969ac6fa9ce4ff43f0c09c0326bfa02e0d9",
    "sha256": "946f1b3e1996c62a8d2a790d244732a1f44571be10ee3d68b4b6eb190cb2d39e"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "2bf9db9747fd26b4e9d4fb03c512a12df514b3fa",
    "sha256": "cee4d541c258f9053122467e2ee6be7a2ffde4a86f983755f7e31fe435daf183"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "c6aff9eb7f8cbf3f26cc78fdab35430f1d7ff327",
    "sha256": "305b63aa47572deae71c1ae19dc33b0150ab8c2f717a210150a3c699dc0ae378"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs",
    "blob": "887f8c7e7b144c2d0e3e1973876a448ee68a032c",
    "sha256": "d8b1597ad1490d992eb82f84601bf0dd069634998ca005de0ed1679d91e11b38"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "0bc2f6b1bdca507b4a035169a4286f14ce8b4696",
    "sha256": "7902d0f3d3ccb57809181857a2b34a9476d1148e96f9ee03ff870aee017e962f"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "12d39ae6e52ba1d71d883f9658ad6a39d8dd2190",
    "sha256": "9f0c6c952cddf8f8c5e470d5b3f1c2630191b89a5bd491c19942010d12e12343"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "b0926041316e982d647c21a138a0c45b6b5ade08",
    "sha256": "2ea40f7db204c9e747cb1233ce97a380a350ba5106b0fcf2e0f7d305ee5e1c9f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "a7c373f6f7bba7208c9f057ef21eabf4064fb910",
    "sha256": "7be5b394b7323c78c0d056178a3d7b3c4f06c081ffe64a0bb975aed6262470c2"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "249efa4d7e13dd61cfea8e76b98e2e9bb44f6d35",
    "sha256": "5c3751b9faa4d709b0ffc4eebb543e6563cd0ae68d560804b73cb8ede20cf535"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "8759fe322086188472af6349b2918c38822023a7",
    "sha256": "d60acbd468da34a50aa1b1f0728e58b07ee82a8cb22db4861e6201e8bde81ca0"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "c448f3ef12ce3555204b0a1afd7ffb01070d619c",
    "sha256": "d6475cfdf00c6612b7a24501186ed14fb96cdc45f2a4de5b4c07eb92c69cd992"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "5e44a96e209099c5627b3dfb5de6a8d7ccd638f6",
    "sha256": "b5f86a570cd28c313d0f655ae24f4de1d026775eba2225d87e15316ce377f72c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "b5a331dd21bf20579a4935f9172d7da6a03bcc1c",
    "sha256": "3894dc21a1f05312f53ea95099a16e05c96e241a7bf4f94d77d50d5e7256c8ca"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "ac9687e46992736a686de92fba12ab1450260e0f",
    "sha256": "3f26f014f0f768fc95814d47e88904f9eb93226ba0c0c5fecd3192b05e126901"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "8cdf7b7cf5db3383dc808a6ca5b4a79e9f7387cd",
    "sha256": "192bdfdef1f5422fca8bbcd4688fe1654a83296d77f5b8a36c3d29d6bbe2e2e7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "6599c687953b671ba70f904dd71570c57549a40e",
    "sha256": "f68e4d90ea9eb9a20c0b86697e111bbbcbb4ff867b8aaa92f28ccf3f5105c919"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v38.mjs",
    "blob": "d7e6c4e3f7985c69799bc6cabae8fc818a090e59",
    "sha256": "7b8cce3eab710a72c8eb7d2e705e8e0709640b62f0d3f6dfd42b1df393c9f637"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority104.mjs",
    "blob": "3fe48b5fe5e51ca7f2e3edb07021501b7e9846d5",
    "sha256": "90e1229b6ef7505692c20d8f04d7e8b28a4bf8b8f8bb370d2f4f579b270c02e8"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "1ab56a34a3a1222ec3a38ee36f44cc033d013e9d",
    "sha256": "ced2572584fdf43725292c7f492ca43baf200e39526a626bc4e2fd6a76be6a0c"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "0a894347bbdf3e5fca99ae9218b1511f173a7e43",
    "sha256": "07fd8536e2ab0db460766b566f87d57893dfbb937424647880874cc407e501a1"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "f033e740ddc43f7c87970f15bbc6fb0843098a0a",
    "sha256": "702fcbdfe93e39dc254dab33bd79a704a7b73f2df2cff52139ba5ac72483685a"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision105.json",
    "blob": "8ce3a85587212e7ebf3deaca41e41ab3ab350083",
    "sha256": "c332562854ddb04609ae800db6af74f6f3548d837913e6563c442de22cb17db0"
  },
  {
    "path": "src/components/geometry-worker-b.test.tsx",
    "blob": "8b95ca0396d4376fc150e89d1ae2d933f21fd320",
    "sha256": "f4486dee66b972f2f810ba22a0060a35d01723db0dac068666c7a4220963248d"
  },
  {
    "path": "src/components/remainder-capture-successor.test.tsx",
    "blob": "4b65125f8150a3ad81e56f4483d6eecd455c33e1",
    "sha256": "e0f78569a7c6d86660920cd5bb10edf1347ac592b439e553c8f1370b9d61c90e"
  },
  {
    "path": "src/components/remainder-capture-successor.tsx",
    "blob": "6131ce1ecfe23ebd2923e064d83222aa6c093cd9",
    "sha256": "7f357fa76eb011cb02ddaf02fbf05535345be9ccac08444920e0f86c3cac8728"
  },
  {
    "path": "src/components/science-worker-c.test.tsx",
    "blob": "d8a89253ac37857777b2de1c38c48c6a7089c02f",
    "sha256": "3005f17b71724434f7f5e6e6ac7193a643c50a615a661188f6f9c3f94aa36fa6"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.test.ts",
    "blob": "9a61627b6d28b0d0f4d49dcc4343df0652a99e72",
    "sha256": "492eaeb5d6832f8c5f3c0537639e2624438bb9566dc62f567b95e653e0075649"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.ts",
    "blob": "10f8a1d423c591db269763c8f7dceb39a597f22c",
    "sha256": "b68c3fd1147c8ae4c74c41c621edcae6b8bf053cd93ee68a5788445269f2424c"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "b14e4db26be870018a9990b4a76b4783b9bba1b9",
    "sha256": "06826390c1577889f9967cefea723d953266f450555c9dcfc6705d35c940e313"
  },
  {
    "path": "src/lib/calculator-factory/completion/geometry-worker-b.integration.test.ts",
    "blob": "e5eef2029d4ebb095f741b81bed8615bdb3b7820",
    "sha256": "8dd4e8541c92119ce6961c224de883fec9d6c93e9331d2aeaf2565b3d2232f7d"
  },
  {
    "path": "src/lib/calculator-factory/completion/math-worker-a.integration.test.ts",
    "blob": "df828587bc6816011447650d1be40ec8df5f006f",
    "sha256": "4e04f82f080c8d881dff9a542c1efffd29fefce56fb5df17e82838a1e13946f1"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-business-recovery.test.ts",
    "blob": "28bf203a165a45be0b45c6b81f7db8ebe6973e5b",
    "sha256": "ba57742167183f93c47dbd733ae4671d02328d0a791acf55199998bb95931b26"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.test.ts",
    "blob": "4635e5a3eeca48dc68395e95a39ef543f183ff74",
    "sha256": "ad70b27149948394142983a684208ef359d1cef84af391a599b1e4a5818b2288"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.ts",
    "blob": "944e516bf4455b28ee36f9fbf421d249b9bf7165",
    "sha256": "7f13a8e54c2424f55266c9be9f582a28f8de7a2eea279b16fb3203e470a26305"
  },
  {
    "path": "src/lib/calculator-factory/completion/science-worker-c.integration.test.ts",
    "blob": "b14ed8a511ad3b506236e55ca166c2ff755253b9",
    "sha256": "6e29656b7b47389c10b87bd81e5c60fe054297d91bf05cb9f388f73efaabb104"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "50610b57009a29566b55b07a1a15da884d905238",
    "sha256": "cb9633181f361c1a17f1d8399be51d94c4ca633f2689622bcf48c92a37147a9f"
  },
  {
    "path": "src/lib/science-dispatch.test.ts",
    "blob": "126f5715739e1da84fb75035925f717958cbd6db",
    "sha256": "0265483737849a2f24c9f87cf2acdfa6d94007f2945ccc2c1e682c084a786e42"
  },
  {
    "path": "src/lib/science-worker-c-snapshot-verification.ts",
    "blob": "570db1a786743d707e76dd78907eae118b19a4b9",
    "sha256": "061c0b884ccbc6653c1760d78cfbf0ec5997d33e5ed609d3845f40de8a6d11e6"
  },
  {
    "path": "src/lib/surface-area-dispatch.test.ts",
    "blob": "623ad60fd2a0570deb8ec4231107647139515c81",
    "sha256": "4b80f99464536258ad7ea3b7e68fa452747798460ad92bb85881edb41383d0f0"
  },
  {
    "path": "src/lib/surface-area-snapshot-verification.ts",
    "blob": "27b4c02d01bb6c0534ce4081a2793fcafd76cbcd",
    "sha256": "41dc30b33754f903bdd7a05c8663b36140ed42707868c148ed8afeced5872f9a"
  }
]);
export const additionalStage8V38BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","0eb375bc79c8331f4b6250848c64d9036831e20c","103fe68fa45bedf708b6880bdc6f085eec3e31b5","180b31865ab46379cb1a53b2533feea024a1e293","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","4f998c5bf59a4ac13e9a22bfae539b0bee3955fe","56844ec40292b010bc89ad7371c2d0340340bafe","64c86e4fe5f77816f2b5b45ea2177ed56520b292","66d0bd6a24d816ddb77d72a5f17334aa48d3e86c","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","b4de3253bae372b7a0565c2ad8cd2bd1c5236efd","b9b0ae266d6c11cfc36cccbf010919f93fa5657e","d9b017f46616ee632f622e1bca29b1910cc87f4d","dc8544422dbb4ebccfc96e03431e64ebcf871fc9","f3cac16a17e99fa1ce9fd80475806436440239b9"]);
export const acceptedStage8V39=Object.freeze([
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "c8f43ce6524170d6274b09d0b9210ec58dc3d44e",
    "sha256": "6a7db26f8834f6553c29499606121656e8e5d8400ef9f37501718b62ba23ed6f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-activation.mjs",
    "blob": "b64340c616cc22d41ec219a9cd6c0fdc84fa175f",
    "sha256": "fec15c82852b4deebc48d65959613e70cdb4a47b0e24c967845c1131a965a961"
  },
  {
    "path": "docs/four-worker-integration-20261115/source-stage9.json",
    "blob": "de0c966029ffae0917c65395dedf7d7adda8b4f5",
    "sha256": "1aa535186df0687954816b388378b36dcb2297deedf8e3a56e0d956da7609afd"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9-policy.mjs",
    "blob": "b3e130c437283263ac7369d1b631243bcbccb98b",
    "sha256": "6ddf247c69569a88ac37361f29b2094f39ce2ae0cbcc82f0687b4bda4dbfb1b6"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.mjs",
    "blob": "2f21ef2dae041de975eed5f4b3f7f08f93e01ac4",
    "sha256": "315b066f493704ce9613c36a4c41f53d209eb983f43e64ba386b1c8b8b71f5cb"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.test.mjs",
    "blob": "d987555561d27c68ac8edd6d69fe9cb12dd14aa4",
    "sha256": "be8a44944545f564b25f2193f407af6c6a89d90506c0e36c8b45fa3d7c45c1c2"
  },
  {
    "path": "tests/worker-a-intake-20261115/auth-browser.mjs",
    "blob": "b318ba753fa5360ac289dac92d7028b8c0c6864b",
    "sha256": "67c494e2071dc59f5aae626ee7fb52790833d0fedfc057627973c1f8494a06ae"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/actions.ts",
    "blob": "8cca4bb5b500872c86691852bf829ef25a1324cd",
    "sha256": "5d346d8615f8351b429cbcedb2817d55808ade7fe4c5ac4e93f9be56f1e20c9c"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/client.tsx",
    "blob": "afea2ec06e87737393d0ce46b19ce636cfc42b22",
    "sha256": "da9b638a304347da1da8dedb29c2fcc8709b866f4d728d9a9add3a5f190fe7ff"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/page.tsx",
    "blob": "e153c73b257971f38d2bd18f108c622fdf297aa0",
    "sha256": "c70a0c461f4aa461a5fc732a5d4a142c78d29d7e5e9948f4e9bab4c3e589a994"
  },
  {
    "path": "tests/worker-a-intake-20261115/source-and-compatibility.mjs",
    "blob": "e08d469c6a76c0532e47dbf73e1b0cd7d88496ed",
    "sha256": "772ca0dbc0c96bf19bd6ee27eeaf94265e28c13fc07ea276cab39c127f474e1c"
  },
  {
    "path": "tests/worker-a-intake-20261115/successor-admission.mjs",
    "blob": "3ef9dc6b00a7daf757a799ba9ad42050a388e26e",
    "sha256": "6bf3b64542ec0f64cecdbd2f500f47234cf3a8ca603a1ba26bddcea8e9617a7b"
  },
  {
    "path": "tests/worker-d-shared-delivery-20261115/acceptance.mjs",
    "blob": "61d67a7acaecad4ecece913dcf130c49b81b967f",
    "sha256": "2eff8ae85e08de3c542a7b31fb0bc9836b90ee7de3487d5835a51114a55063b4"
  },
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "blob": "22b12551c55b8f500f38ddabfb7bba5381575539",
    "sha256": "018ac07149492c2e788362b6c0d03ce6a4c407bb504bca91615a96daf803370b"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-publication-transport.mjs",
    "blob": "cdcc32bf183e8adb395a3b294455ed9657add750",
    "sha256": "281c590fe73cff1fd466fb428286d8a885ef3117ab61e4b652fe77642e3d32ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.mjs",
    "blob": "51894528599103dd5341d229bbefa18e46e395f3",
    "sha256": "6cf61baf387cbaf12fc24618e94e9279f65ccf3f55af47993aedd55ea5022d92"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.test.mjs",
    "blob": "498301c9581d3110467ffb07bdf8821565213d65",
    "sha256": "0ff59e5258f722bbb0e309856aba4dd82ba3df8ebcff8f425ba1327b6cd6c60f"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-claims.mjs",
    "blob": "1d38f116c6329c1d0896d904f9e2599aa3db2770",
    "sha256": "c085049403c9df4c8e675f7a8cf9d6b89459ac5572dc6a21d1f23bd2513c6e50"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-batch.test.mjs",
    "blob": "4a0755885d17f7e341738188d679f2ea451c52a9",
    "sha256": "d41130285b42a4c434816bfe9d980a47967beeb4c81351e0d0a3bf53445cb514"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.mjs",
    "blob": "0de686169f940425a46253bba4927a5c7b0a03e2",
    "sha256": "38df96a9ee234e6abfd3a8605a5f64883ac24485ca3a87f11c983a271eecd956"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.test.mjs",
    "blob": "ff56978337dfd54caf33382ff203dbbb318d6d6e",
    "sha256": "fed2e3f595b363699381c42a42491b7e2e81fee15ea9f363fc1066f3c9e90715"
  },
  {
    "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
    "blob": "c122d7962c2a4f93e2209f4b5b0304c341c04a0e",
    "sha256": "944a142a786b356361f93bd3f1de72e8982d3075615de392f0d22b6dff3fbb9b"
  },
  {
    "path": "tests/shortest-publication-20/frequency-presentation-lineage.test.mjs",
    "blob": "16251d9a2becba514c7c78977907a8cdfc35e32f",
    "sha256": "d8933b891a2b8d74f4ae71dc0360a4ba3b7a37dfad13cbde07672c9f59f37199"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "blob": "83b6233bf5fc03bc98525d16dbdbc9c1478e38e8",
    "sha256": "3460587b2da10feca6c8893a270ed5cd457811ed191a08f6b07a12183e8bdd0f"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "aec721c3835418559a6046d36157513122882e62",
    "sha256": "40186e034f0f6c679f271deee5746afbf62f58ba2bf4e0228b58178f9c84f552"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.mjs",
    "blob": "cc099cfff14c79cd57558e6a8c873a8c13dc98cd",
    "sha256": "60a4153d25a84758e0f418f639a54df083ab4fe050eb6fb57142eb7c56333e9f"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.d.mts",
    "blob": "a8aea9fff6eeb37ac205a4383532e14895437256",
    "sha256": "bae4908bfb29bd5cd3c3480c76c12e913f8946dd3d93f155529b85c54ada0b62"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.test.mjs",
    "blob": "883fc969ac6fa9ce4ff43f0c09c0326bfa02e0d9",
    "sha256": "946f1b3e1996c62a8d2a790d244732a1f44571be10ee3d68b4b6eb190cb2d39e"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "2bf9db9747fd26b4e9d4fb03c512a12df514b3fa",
    "sha256": "cee4d541c258f9053122467e2ee6be7a2ffde4a86f983755f7e31fe435daf183"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "c6aff9eb7f8cbf3f26cc78fdab35430f1d7ff327",
    "sha256": "305b63aa47572deae71c1ae19dc33b0150ab8c2f717a210150a3c699dc0ae378"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs",
    "blob": "887f8c7e7b144c2d0e3e1973876a448ee68a032c",
    "sha256": "d8b1597ad1490d992eb82f84601bf0dd069634998ca005de0ed1679d91e11b38"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "0bc2f6b1bdca507b4a035169a4286f14ce8b4696",
    "sha256": "7902d0f3d3ccb57809181857a2b34a9476d1148e96f9ee03ff870aee017e962f"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "12d39ae6e52ba1d71d883f9658ad6a39d8dd2190",
    "sha256": "9f0c6c952cddf8f8c5e470d5b3f1c2630191b89a5bd491c19942010d12e12343"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "68db41805b5daa9508a884cbb032e1ffe4eb02a1",
    "sha256": "a91146bba31575f41121f5d51bd1df1a201230c5c864a4db042d7cad12e03fce"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "a7c373f6f7bba7208c9f057ef21eabf4064fb910",
    "sha256": "7be5b394b7323c78c0d056178a3d7b3c4f06c081ffe64a0bb975aed6262470c2"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "401688f1d38abb17af88275661b0478ed3f9dd61",
    "sha256": "e7e69fe4f56e1f8af32dc508c1f9994cf2bf9f30ba40c049efbe6c4c8ca4ada3"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "80298fc5261e33a5cc23bc9a4e9c1b90a198c1d4",
    "sha256": "cb4ee1be3054987567b00383d3b930dcb75ef756d542b99982fec283b7666aad"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "c448f3ef12ce3555204b0a1afd7ffb01070d619c",
    "sha256": "d6475cfdf00c6612b7a24501186ed14fb96cdc45f2a4de5b4c07eb92c69cd992"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "0f82e7a009270dd975eca27d2c4886a7576c2d90",
    "sha256": "e22fc316c003be79adb7b9c545651123aef00e39bb0a3265d9004a78b05233ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "b5a331dd21bf20579a4935f9172d7da6a03bcc1c",
    "sha256": "3894dc21a1f05312f53ea95099a16e05c96e241a7bf4f94d77d50d5e7256c8ca"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "8c646aae9fc1b3a87776265e994192e5ff8d7af7",
    "sha256": "928230a0115e65a0d2ec8c9fb3603661310a8e6f4b7fb3a09c49abb6c12036fb"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "8cdf7b7cf5db3383dc808a6ca5b4a79e9f7387cd",
    "sha256": "192bdfdef1f5422fca8bbcd4688fe1654a83296d77f5b8a36c3d29d6bbe2e2e7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "271e106dbe676ddff716c029eb3bf7bfc7dcf088",
    "sha256": "ae6d534eef638a302f22b1aa2baffd323eeb8a6705f69e269860db57e8da3e7e"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v39.mjs",
    "blob": "33246a8700d1023e03fb76fe43b4efe480b28ff6",
    "sha256": "da392cd028decdb3775d29c2238233c716994bc025adfa2c33e6fe3b5d8389ac"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority105.mjs",
    "blob": "fa143e4227d04d4ed65fa0cd29e6a27ddc0837a0",
    "sha256": "08b4f8ac96efe9aa86771084eab31246447e8d6b4877add492e1d0028a8c585d"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "02983f76e103533dc800848184a6efb714afca3b",
    "sha256": "6a66c5e93e8102b1f5d655453c8570c53dbb218a0a30d8aba77752e851fc3801"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "3f6a246a7d26d81c20dfa3e61f401817c596063e",
    "sha256": "ffdb0414105c2f58f96a69bdf3f6449f776c2589c18d85dd0ce56e59a59b1e8a"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "ef64f51b8b0e796589e84e7e8021637356fd9d8b",
    "sha256": "3508507976521af85cb762bbaaf735dd49a39ab607ec15344d7173ca01889373"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision106.json",
    "blob": "bd5417adb178a80958fb6c1a6b1dc49f5e4346c9",
    "sha256": "401e52a5b815bf44f635e299b7930753f6ca4e0b9f8cdf8d5a62443cbfd1cb9b"
  },
  {
    "path": "src/components/geometry-worker-b.test.tsx",
    "blob": "8b95ca0396d4376fc150e89d1ae2d933f21fd320",
    "sha256": "f4486dee66b972f2f810ba22a0060a35d01723db0dac068666c7a4220963248d"
  },
  {
    "path": "src/components/remainder-capture-successor.test.tsx",
    "blob": "4b65125f8150a3ad81e56f4483d6eecd455c33e1",
    "sha256": "e0f78569a7c6d86660920cd5bb10edf1347ac592b439e553c8f1370b9d61c90e"
  },
  {
    "path": "src/components/remainder-capture-successor.tsx",
    "blob": "6131ce1ecfe23ebd2923e064d83222aa6c093cd9",
    "sha256": "7f357fa76eb011cb02ddaf02fbf05535345be9ccac08444920e0f86c3cac8728"
  },
  {
    "path": "src/components/science-worker-c.test.tsx",
    "blob": "d8a89253ac37857777b2de1c38c48c6a7089c02f",
    "sha256": "3005f17b71724434f7f5e6e6ac7193a643c50a615a661188f6f9c3f94aa36fa6"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.test.ts",
    "blob": "9a61627b6d28b0d0f4d49dcc4343df0652a99e72",
    "sha256": "492eaeb5d6832f8c5f3c0537639e2624438bb9566dc62f567b95e653e0075649"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.ts",
    "blob": "10f8a1d423c591db269763c8f7dceb39a597f22c",
    "sha256": "b68c3fd1147c8ae4c74c41c621edcae6b8bf053cd93ee68a5788445269f2424c"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "b14e4db26be870018a9990b4a76b4783b9bba1b9",
    "sha256": "06826390c1577889f9967cefea723d953266f450555c9dcfc6705d35c940e313"
  },
  {
    "path": "src/lib/calculator-factory/completion/geometry-worker-b.integration.test.ts",
    "blob": "e5eef2029d4ebb095f741b81bed8615bdb3b7820",
    "sha256": "8dd4e8541c92119ce6961c224de883fec9d6c93e9331d2aeaf2565b3d2232f7d"
  },
  {
    "path": "src/lib/calculator-factory/completion/math-worker-a.integration.test.ts",
    "blob": "df828587bc6816011447650d1be40ec8df5f006f",
    "sha256": "4e04f82f080c8d881dff9a542c1efffd29fefce56fb5df17e82838a1e13946f1"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-business-recovery.test.ts",
    "blob": "28bf203a165a45be0b45c6b81f7db8ebe6973e5b",
    "sha256": "ba57742167183f93c47dbd733ae4671d02328d0a791acf55199998bb95931b26"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.test.ts",
    "blob": "4635e5a3eeca48dc68395e95a39ef543f183ff74",
    "sha256": "ad70b27149948394142983a684208ef359d1cef84af391a599b1e4a5818b2288"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.ts",
    "blob": "944e516bf4455b28ee36f9fbf421d249b9bf7165",
    "sha256": "7f13a8e54c2424f55266c9be9f582a28f8de7a2eea279b16fb3203e470a26305"
  },
  {
    "path": "src/lib/calculator-factory/completion/science-worker-c.integration.test.ts",
    "blob": "b14ed8a511ad3b506236e55ca166c2ff755253b9",
    "sha256": "6e29656b7b47389c10b87bd81e5c60fe054297d91bf05cb9f388f73efaabb104"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "50610b57009a29566b55b07a1a15da884d905238",
    "sha256": "cb9633181f361c1a17f1d8399be51d94c4ca633f2689622bcf48c92a37147a9f"
  },
  {
    "path": "src/lib/science-dispatch.test.ts",
    "blob": "126f5715739e1da84fb75035925f717958cbd6db",
    "sha256": "0265483737849a2f24c9f87cf2acdfa6d94007f2945ccc2c1e682c084a786e42"
  },
  {
    "path": "src/lib/science-worker-c-snapshot-verification.ts",
    "blob": "570db1a786743d707e76dd78907eae118b19a4b9",
    "sha256": "061c0b884ccbc6653c1760d78cfbf0ec5997d33e5ed609d3845f40de8a6d11e6"
  },
  {
    "path": "src/lib/surface-area-dispatch.test.ts",
    "blob": "623ad60fd2a0570deb8ec4231107647139515c81",
    "sha256": "4b80f99464536258ad7ea3b7e68fa452747798460ad92bb85881edb41383d0f0"
  },
  {
    "path": "src/lib/surface-area-snapshot-verification.ts",
    "blob": "27b4c02d01bb6c0534ce4081a2793fcafd76cbcd",
    "sha256": "41dc30b33754f903bdd7a05c8663b36140ed42707868c148ed8afeced5872f9a"
  }
]);
export const additionalStage8V39BootstrapRefs=Object.freeze(["032298bee22dcd6ba2bd7f9997f01c7a923092ab","054854bceed263ba59e8cd0052f1f3e9b1ea8e30","0eb375bc79c8331f4b6250848c64d9036831e20c","103fe68fa45bedf708b6880bdc6f085eec3e31b5","178cf2e6f9bde8da9f486cc0cdb627c111718f8e","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","56844ec40292b010bc89ad7371c2d0340340bafe","64c86e4fe5f77816f2b5b45ea2177ed56520b292","66d0bd6a24d816ddb77d72a5f17334aa48d3e86c","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","b4de3253bae372b7a0565c2ad8cd2bd1c5236efd","b9b0ae266d6c11cfc36cccbf010919f93fa5657e","d9b017f46616ee632f622e1bca29b1910cc87f4d","dc8544422dbb4ebccfc96e03431e64ebcf871fc9","f3cac16a17e99fa1ce9fd80475806436440239b9"]);
export const acceptedStage8V40=Object.freeze([
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "c8f43ce6524170d6274b09d0b9210ec58dc3d44e",
    "sha256": "6a7db26f8834f6553c29499606121656e8e5d8400ef9f37501718b62ba23ed6f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-activation.mjs",
    "blob": "14831f5376c3e1c91b9a8850f29f1a69c80d48f5",
    "sha256": "50dda9370da8b118892054f51deb274d5328f527e726b8bbc282b70ea160664c"
  },
  {
    "path": "docs/four-worker-integration-20261115/source-stage9.json",
    "blob": "de0c966029ffae0917c65395dedf7d7adda8b4f5",
    "sha256": "1aa535186df0687954816b388378b36dcb2297deedf8e3a56e0d956da7609afd"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9-policy.mjs",
    "blob": "b3e130c437283263ac7369d1b631243bcbccb98b",
    "sha256": "6ddf247c69569a88ac37361f29b2094f39ce2ae0cbcc82f0687b4bda4dbfb1b6"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.mjs",
    "blob": "2f21ef2dae041de975eed5f4b3f7f08f93e01ac4",
    "sha256": "315b066f493704ce9613c36a4c41f53d209eb983f43e64ba386b1c8b8b71f5cb"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.test.mjs",
    "blob": "d987555561d27c68ac8edd6d69fe9cb12dd14aa4",
    "sha256": "be8a44944545f564b25f2193f407af6c6a89d90506c0e36c8b45fa3d7c45c1c2"
  },
  {
    "path": "tests/worker-a-intake-20261115/auth-browser.mjs",
    "blob": "b318ba753fa5360ac289dac92d7028b8c0c6864b",
    "sha256": "67c494e2071dc59f5aae626ee7fb52790833d0fedfc057627973c1f8494a06ae"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/actions.ts",
    "blob": "8cca4bb5b500872c86691852bf829ef25a1324cd",
    "sha256": "5d346d8615f8351b429cbcedb2817d55808ade7fe4c5ac4e93f9be56f1e20c9c"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/client.tsx",
    "blob": "afea2ec06e87737393d0ce46b19ce636cfc42b22",
    "sha256": "da9b638a304347da1da8dedb29c2fcc8709b866f4d728d9a9add3a5f190fe7ff"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/page.tsx",
    "blob": "e153c73b257971f38d2bd18f108c622fdf297aa0",
    "sha256": "c70a0c461f4aa461a5fc732a5d4a142c78d29d7e5e9948f4e9bab4c3e589a994"
  },
  {
    "path": "tests/worker-a-intake-20261115/source-and-compatibility.mjs",
    "blob": "e08d469c6a76c0532e47dbf73e1b0cd7d88496ed",
    "sha256": "772ca0dbc0c96bf19bd6ee27eeaf94265e28c13fc07ea276cab39c127f474e1c"
  },
  {
    "path": "tests/worker-a-intake-20261115/successor-admission.mjs",
    "blob": "3ef9dc6b00a7daf757a799ba9ad42050a388e26e",
    "sha256": "6bf3b64542ec0f64cecdbd2f500f47234cf3a8ca603a1ba26bddcea8e9617a7b"
  },
  {
    "path": "tests/worker-d-shared-delivery-20261115/acceptance.mjs",
    "blob": "61d67a7acaecad4ecece913dcf130c49b81b967f",
    "sha256": "2eff8ae85e08de3c542a7b31fb0bc9836b90ee7de3487d5835a51114a55063b4"
  },
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "blob": "22b12551c55b8f500f38ddabfb7bba5381575539",
    "sha256": "018ac07149492c2e788362b6c0d03ce6a4c407bb504bca91615a96daf803370b"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-publication-transport.mjs",
    "blob": "cdcc32bf183e8adb395a3b294455ed9657add750",
    "sha256": "281c590fe73cff1fd466fb428286d8a885ef3117ab61e4b652fe77642e3d32ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.mjs",
    "blob": "51894528599103dd5341d229bbefa18e46e395f3",
    "sha256": "6cf61baf387cbaf12fc24618e94e9279f65ccf3f55af47993aedd55ea5022d92"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.test.mjs",
    "blob": "498301c9581d3110467ffb07bdf8821565213d65",
    "sha256": "0ff59e5258f722bbb0e309856aba4dd82ba3df8ebcff8f425ba1327b6cd6c60f"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-claims.mjs",
    "blob": "1d38f116c6329c1d0896d904f9e2599aa3db2770",
    "sha256": "c085049403c9df4c8e675f7a8cf9d6b89459ac5572dc6a21d1f23bd2513c6e50"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-batch.test.mjs",
    "blob": "4a0755885d17f7e341738188d679f2ea451c52a9",
    "sha256": "d41130285b42a4c434816bfe9d980a47967beeb4c81351e0d0a3bf53445cb514"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.mjs",
    "blob": "0de686169f940425a46253bba4927a5c7b0a03e2",
    "sha256": "38df96a9ee234e6abfd3a8605a5f64883ac24485ca3a87f11c983a271eecd956"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.test.mjs",
    "blob": "ff56978337dfd54caf33382ff203dbbb318d6d6e",
    "sha256": "fed2e3f595b363699381c42a42491b7e2e81fee15ea9f363fc1066f3c9e90715"
  },
  {
    "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
    "blob": "c122d7962c2a4f93e2209f4b5b0304c341c04a0e",
    "sha256": "944a142a786b356361f93bd3f1de72e8982d3075615de392f0d22b6dff3fbb9b"
  },
  {
    "path": "tests/shortest-publication-20/frequency-presentation-lineage.test.mjs",
    "blob": "16251d9a2becba514c7c78977907a8cdfc35e32f",
    "sha256": "d8933b891a2b8d74f4ae71dc0360a4ba3b7a37dfad13cbde07672c9f59f37199"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "blob": "83b6233bf5fc03bc98525d16dbdbc9c1478e38e8",
    "sha256": "3460587b2da10feca6c8893a270ed5cd457811ed191a08f6b07a12183e8bdd0f"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "aec721c3835418559a6046d36157513122882e62",
    "sha256": "40186e034f0f6c679f271deee5746afbf62f58ba2bf4e0228b58178f9c84f552"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.mjs",
    "blob": "cc099cfff14c79cd57558e6a8c873a8c13dc98cd",
    "sha256": "60a4153d25a84758e0f418f639a54df083ab4fe050eb6fb57142eb7c56333e9f"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.d.mts",
    "blob": "a8aea9fff6eeb37ac205a4383532e14895437256",
    "sha256": "bae4908bfb29bd5cd3c3480c76c12e913f8946dd3d93f155529b85c54ada0b62"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.test.mjs",
    "blob": "883fc969ac6fa9ce4ff43f0c09c0326bfa02e0d9",
    "sha256": "946f1b3e1996c62a8d2a790d244732a1f44571be10ee3d68b4b6eb190cb2d39e"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "2bf9db9747fd26b4e9d4fb03c512a12df514b3fa",
    "sha256": "cee4d541c258f9053122467e2ee6be7a2ffde4a86f983755f7e31fe435daf183"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "c6aff9eb7f8cbf3f26cc78fdab35430f1d7ff327",
    "sha256": "305b63aa47572deae71c1ae19dc33b0150ab8c2f717a210150a3c699dc0ae378"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs",
    "blob": "887f8c7e7b144c2d0e3e1973876a448ee68a032c",
    "sha256": "d8b1597ad1490d992eb82f84601bf0dd069634998ca005de0ed1679d91e11b38"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "0bc2f6b1bdca507b4a035169a4286f14ce8b4696",
    "sha256": "7902d0f3d3ccb57809181857a2b34a9476d1148e96f9ee03ff870aee017e962f"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "12d39ae6e52ba1d71d883f9658ad6a39d8dd2190",
    "sha256": "9f0c6c952cddf8f8c5e470d5b3f1c2630191b89a5bd491c19942010d12e12343"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "68db41805b5daa9508a884cbb032e1ffe4eb02a1",
    "sha256": "a91146bba31575f41121f5d51bd1df1a201230c5c864a4db042d7cad12e03fce"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "a7c373f6f7bba7208c9f057ef21eabf4064fb910",
    "sha256": "7be5b394b7323c78c0d056178a3d7b3c4f06c081ffe64a0bb975aed6262470c2"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "401688f1d38abb17af88275661b0478ed3f9dd61",
    "sha256": "e7e69fe4f56e1f8af32dc508c1f9994cf2bf9f30ba40c049efbe6c4c8ca4ada3"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "bf8e361a3bce099742fc43d4d5519b056af2a7ec",
    "sha256": "ea6a473feb1672a412ebf007b8f7356728f7cba34a356cb0d653f58f85965c92"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "c448f3ef12ce3555204b0a1afd7ffb01070d619c",
    "sha256": "d6475cfdf00c6612b7a24501186ed14fb96cdc45f2a4de5b4c07eb92c69cd992"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "0f82e7a009270dd975eca27d2c4886a7576c2d90",
    "sha256": "e22fc316c003be79adb7b9c545651123aef00e39bb0a3265d9004a78b05233ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "b5a331dd21bf20579a4935f9172d7da6a03bcc1c",
    "sha256": "3894dc21a1f05312f53ea95099a16e05c96e241a7bf4f94d77d50d5e7256c8ca"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "f12430cebe4e7b7efe2ede199a325f90927b84e2",
    "sha256": "17b59893f61d76b1824927863b4799bebc0bed637a61eece2e6f52f93cc50660"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "f529b4eaabb75c9d6e3608894b46aa1f25827ff2",
    "sha256": "315cc33b483fe0346832b5184103880b08edb658d5335dfd3a9f77b5159fa710"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "8f1575ba878fd8f084044eeaee68cb28f64cf361",
    "sha256": "9a70566f30bb3308a6a5408fade3d9f5957736188e9c18c20e60676fcd7d2aeb"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v40.mjs",
    "blob": "ae8e6c02659baed83593e2f9592d8bbe272fa0fc",
    "sha256": "2e60aa4e87c6f53963eda064c101b69c4c5c7fcf35dffcc3ae6fa46e8fc0a388"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority106.mjs",
    "blob": "511721bf47aa96e0b0abb639103d2b3b9d11b8b4",
    "sha256": "158cbd5e53c2fa7067577589d80f5eaf7653b4928633b354b8eaa98f9879cbb2"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "c82be9bd8d271fd642eb4a2509d5c49cc968a6a5",
    "sha256": "86cd70edc92f2586638d21d822a42152bf607156a7614db44719943a1df09bd1"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "c3cd7db89b876c3f8e8ad59818ab3a780e165287",
    "sha256": "b1add526aed4b43aed3c2e5ce455b947af2845f530cae18b9d38abfd7bc93df7"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "15cb187dcb94ae9ef6c7038d48d0d4fe3dbd66c4",
    "sha256": "2a4521f4a3ffdb91a54e5e795d1b28c15481c6c1c907b066a67ca13e0ca23017"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision107.json",
    "blob": "bbea22116ee4c6c9e0d7c4a3ba1bbe84d369d6f6",
    "sha256": "16335d7d63e2af02421ae77b5951a6292089984be1c3bc655405e508df4f2ee1"
  },
  {
    "path": "src/components/geometry-worker-b.test.tsx",
    "blob": "8b95ca0396d4376fc150e89d1ae2d933f21fd320",
    "sha256": "f4486dee66b972f2f810ba22a0060a35d01723db0dac068666c7a4220963248d"
  },
  {
    "path": "src/components/remainder-capture-successor.test.tsx",
    "blob": "4b65125f8150a3ad81e56f4483d6eecd455c33e1",
    "sha256": "e0f78569a7c6d86660920cd5bb10edf1347ac592b439e553c8f1370b9d61c90e"
  },
  {
    "path": "src/components/remainder-capture-successor.tsx",
    "blob": "6131ce1ecfe23ebd2923e064d83222aa6c093cd9",
    "sha256": "7f357fa76eb011cb02ddaf02fbf05535345be9ccac08444920e0f86c3cac8728"
  },
  {
    "path": "src/components/science-worker-c.test.tsx",
    "blob": "d8a89253ac37857777b2de1c38c48c6a7089c02f",
    "sha256": "3005f17b71724434f7f5e6e6ac7193a643c50a615a661188f6f9c3f94aa36fa6"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.test.ts",
    "blob": "9a61627b6d28b0d0f4d49dcc4343df0652a99e72",
    "sha256": "492eaeb5d6832f8c5f3c0537639e2624438bb9566dc62f567b95e653e0075649"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.ts",
    "blob": "10f8a1d423c591db269763c8f7dceb39a597f22c",
    "sha256": "b68c3fd1147c8ae4c74c41c621edcae6b8bf053cd93ee68a5788445269f2424c"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "b14e4db26be870018a9990b4a76b4783b9bba1b9",
    "sha256": "06826390c1577889f9967cefea723d953266f450555c9dcfc6705d35c940e313"
  },
  {
    "path": "src/lib/calculator-factory/completion/geometry-worker-b.integration.test.ts",
    "blob": "e5eef2029d4ebb095f741b81bed8615bdb3b7820",
    "sha256": "8dd4e8541c92119ce6961c224de883fec9d6c93e9331d2aeaf2565b3d2232f7d"
  },
  {
    "path": "src/lib/calculator-factory/completion/math-worker-a.integration.test.ts",
    "blob": "df828587bc6816011447650d1be40ec8df5f006f",
    "sha256": "4e04f82f080c8d881dff9a542c1efffd29fefce56fb5df17e82838a1e13946f1"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-business-recovery.test.ts",
    "blob": "28bf203a165a45be0b45c6b81f7db8ebe6973e5b",
    "sha256": "ba57742167183f93c47dbd733ae4671d02328d0a791acf55199998bb95931b26"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.test.ts",
    "blob": "4635e5a3eeca48dc68395e95a39ef543f183ff74",
    "sha256": "ad70b27149948394142983a684208ef359d1cef84af391a599b1e4a5818b2288"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.ts",
    "blob": "944e516bf4455b28ee36f9fbf421d249b9bf7165",
    "sha256": "7f13a8e54c2424f55266c9be9f582a28f8de7a2eea279b16fb3203e470a26305"
  },
  {
    "path": "src/lib/calculator-factory/completion/science-worker-c.integration.test.ts",
    "blob": "b14ed8a511ad3b506236e55ca166c2ff755253b9",
    "sha256": "6e29656b7b47389c10b87bd81e5c60fe054297d91bf05cb9f388f73efaabb104"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "50610b57009a29566b55b07a1a15da884d905238",
    "sha256": "cb9633181f361c1a17f1d8399be51d94c4ca633f2689622bcf48c92a37147a9f"
  },
  {
    "path": "src/lib/science-dispatch.test.ts",
    "blob": "126f5715739e1da84fb75035925f717958cbd6db",
    "sha256": "0265483737849a2f24c9f87cf2acdfa6d94007f2945ccc2c1e682c084a786e42"
  },
  {
    "path": "src/lib/science-worker-c-snapshot-verification.ts",
    "blob": "570db1a786743d707e76dd78907eae118b19a4b9",
    "sha256": "061c0b884ccbc6653c1760d78cfbf0ec5997d33e5ed609d3845f40de8a6d11e6"
  },
  {
    "path": "src/lib/surface-area-dispatch.test.ts",
    "blob": "623ad60fd2a0570deb8ec4231107647139515c81",
    "sha256": "4b80f99464536258ad7ea3b7e68fa452747798460ad92bb85881edb41383d0f0"
  },
  {
    "path": "src/lib/surface-area-snapshot-verification.ts",
    "blob": "27b4c02d01bb6c0534ce4081a2793fcafd76cbcd",
    "sha256": "41dc30b33754f903bdd7a05c8663b36140ed42707868c148ed8afeced5872f9a"
  }
]);
export const additionalStage8V40BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","0eb375bc79c8331f4b6250848c64d9036831e20c","103fe68fa45bedf708b6880bdc6f085eec3e31b5","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","56844ec40292b010bc89ad7371c2d0340340bafe","64c86e4fe5f77816f2b5b45ea2177ed56520b292","66d0bd6a24d816ddb77d72a5f17334aa48d3e86c","888642012e24bd7f2041aaa7def5e17bd7182d95","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","a440a7fab73350df4d48e39f95543a23fd82e390","b4de3253bae372b7a0565c2ad8cd2bd1c5236efd","b9b0ae266d6c11cfc36cccbf010919f93fa5657e","d9b017f46616ee632f622e1bca29b1910cc87f4d","dc8544422dbb4ebccfc96e03431e64ebcf871fc9","f3cac16a17e99fa1ce9fd80475806436440239b9"]);
export const acceptedStage8V41=Object.freeze([
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "c8f43ce6524170d6274b09d0b9210ec58dc3d44e",
    "sha256": "6a7db26f8834f6553c29499606121656e8e5d8400ef9f37501718b62ba23ed6f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-activation.mjs",
    "blob": "14831f5376c3e1c91b9a8850f29f1a69c80d48f5",
    "sha256": "50dda9370da8b118892054f51deb274d5328f527e726b8bbc282b70ea160664c"
  },
  {
    "path": "docs/four-worker-integration-20261115/source-stage9.json",
    "blob": "de0c966029ffae0917c65395dedf7d7adda8b4f5",
    "sha256": "1aa535186df0687954816b388378b36dcb2297deedf8e3a56e0d956da7609afd"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9-policy.mjs",
    "blob": "b3e130c437283263ac7369d1b631243bcbccb98b",
    "sha256": "6ddf247c69569a88ac37361f29b2094f39ce2ae0cbcc82f0687b4bda4dbfb1b6"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.mjs",
    "blob": "0436798b76dc1371578f0e7560592a27a018bdcc",
    "sha256": "46bf9b4b109db763c38c19260919ddb17a0492f5e186b24b05177fd89bf9188c"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.test.mjs",
    "blob": "50d22ee660f08da9f6757b1627dcc657ee2eed56",
    "sha256": "78cdb2a01519dcb46495c8c5e32363457622cd0fa1744ffd33cf604c3541f901"
  },
  {
    "path": "tests/worker-a-intake-20261115/auth-browser.mjs",
    "blob": "b318ba753fa5360ac289dac92d7028b8c0c6864b",
    "sha256": "67c494e2071dc59f5aae626ee7fb52790833d0fedfc057627973c1f8494a06ae"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/actions.ts",
    "blob": "8cca4bb5b500872c86691852bf829ef25a1324cd",
    "sha256": "5d346d8615f8351b429cbcedb2817d55808ade7fe4c5ac4e93f9be56f1e20c9c"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/client.tsx",
    "blob": "afea2ec06e87737393d0ce46b19ce636cfc42b22",
    "sha256": "da9b638a304347da1da8dedb29c2fcc8709b866f4d728d9a9add3a5f190fe7ff"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/page.tsx",
    "blob": "e153c73b257971f38d2bd18f108c622fdf297aa0",
    "sha256": "c70a0c461f4aa461a5fc732a5d4a142c78d29d7e5e9948f4e9bab4c3e589a994"
  },
  {
    "path": "tests/worker-a-intake-20261115/source-and-compatibility.mjs",
    "blob": "e08d469c6a76c0532e47dbf73e1b0cd7d88496ed",
    "sha256": "772ca0dbc0c96bf19bd6ee27eeaf94265e28c13fc07ea276cab39c127f474e1c"
  },
  {
    "path": "tests/worker-a-intake-20261115/successor-admission.mjs",
    "blob": "3ef9dc6b00a7daf757a799ba9ad42050a388e26e",
    "sha256": "6bf3b64542ec0f64cecdbd2f500f47234cf3a8ca603a1ba26bddcea8e9617a7b"
  },
  {
    "path": "tests/worker-d-shared-delivery-20261115/acceptance.mjs",
    "blob": "61d67a7acaecad4ecece913dcf130c49b81b967f",
    "sha256": "2eff8ae85e08de3c542a7b31fb0bc9836b90ee7de3487d5835a51114a55063b4"
  },
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "blob": "22b12551c55b8f500f38ddabfb7bba5381575539",
    "sha256": "018ac07149492c2e788362b6c0d03ce6a4c407bb504bca91615a96daf803370b"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-publication-transport.mjs",
    "blob": "cdcc32bf183e8adb395a3b294455ed9657add750",
    "sha256": "281c590fe73cff1fd466fb428286d8a885ef3117ab61e4b652fe77642e3d32ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.mjs",
    "blob": "51894528599103dd5341d229bbefa18e46e395f3",
    "sha256": "6cf61baf387cbaf12fc24618e94e9279f65ccf3f55af47993aedd55ea5022d92"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.test.mjs",
    "blob": "498301c9581d3110467ffb07bdf8821565213d65",
    "sha256": "0ff59e5258f722bbb0e309856aba4dd82ba3df8ebcff8f425ba1327b6cd6c60f"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-claims.mjs",
    "blob": "1d38f116c6329c1d0896d904f9e2599aa3db2770",
    "sha256": "c085049403c9df4c8e675f7a8cf9d6b89459ac5572dc6a21d1f23bd2513c6e50"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-batch.test.mjs",
    "blob": "4a0755885d17f7e341738188d679f2ea451c52a9",
    "sha256": "d41130285b42a4c434816bfe9d980a47967beeb4c81351e0d0a3bf53445cb514"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.mjs",
    "blob": "0de686169f940425a46253bba4927a5c7b0a03e2",
    "sha256": "38df96a9ee234e6abfd3a8605a5f64883ac24485ca3a87f11c983a271eecd956"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.test.mjs",
    "blob": "ff56978337dfd54caf33382ff203dbbb318d6d6e",
    "sha256": "fed2e3f595b363699381c42a42491b7e2e81fee15ea9f363fc1066f3c9e90715"
  },
  {
    "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
    "blob": "c122d7962c2a4f93e2209f4b5b0304c341c04a0e",
    "sha256": "944a142a786b356361f93bd3f1de72e8982d3075615de392f0d22b6dff3fbb9b"
  },
  {
    "path": "tests/shortest-publication-20/frequency-presentation-lineage.test.mjs",
    "blob": "16251d9a2becba514c7c78977907a8cdfc35e32f",
    "sha256": "d8933b891a2b8d74f4ae71dc0360a4ba3b7a37dfad13cbde07672c9f59f37199"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "blob": "83b6233bf5fc03bc98525d16dbdbc9c1478e38e8",
    "sha256": "3460587b2da10feca6c8893a270ed5cd457811ed191a08f6b07a12183e8bdd0f"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "aec721c3835418559a6046d36157513122882e62",
    "sha256": "40186e034f0f6c679f271deee5746afbf62f58ba2bf4e0228b58178f9c84f552"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.mjs",
    "blob": "cc099cfff14c79cd57558e6a8c873a8c13dc98cd",
    "sha256": "60a4153d25a84758e0f418f639a54df083ab4fe050eb6fb57142eb7c56333e9f"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.d.mts",
    "blob": "a8aea9fff6eeb37ac205a4383532e14895437256",
    "sha256": "bae4908bfb29bd5cd3c3480c76c12e913f8946dd3d93f155529b85c54ada0b62"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.test.mjs",
    "blob": "883fc969ac6fa9ce4ff43f0c09c0326bfa02e0d9",
    "sha256": "946f1b3e1996c62a8d2a790d244732a1f44571be10ee3d68b4b6eb190cb2d39e"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "2bf9db9747fd26b4e9d4fb03c512a12df514b3fa",
    "sha256": "cee4d541c258f9053122467e2ee6be7a2ffde4a86f983755f7e31fe435daf183"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "c6aff9eb7f8cbf3f26cc78fdab35430f1d7ff327",
    "sha256": "305b63aa47572deae71c1ae19dc33b0150ab8c2f717a210150a3c699dc0ae378"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs",
    "blob": "887f8c7e7b144c2d0e3e1973876a448ee68a032c",
    "sha256": "d8b1597ad1490d992eb82f84601bf0dd069634998ca005de0ed1679d91e11b38"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "0bc2f6b1bdca507b4a035169a4286f14ce8b4696",
    "sha256": "7902d0f3d3ccb57809181857a2b34a9476d1148e96f9ee03ff870aee017e962f"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "12d39ae6e52ba1d71d883f9658ad6a39d8dd2190",
    "sha256": "9f0c6c952cddf8f8c5e470d5b3f1c2630191b89a5bd491c19942010d12e12343"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "68db41805b5daa9508a884cbb032e1ffe4eb02a1",
    "sha256": "a91146bba31575f41121f5d51bd1df1a201230c5c864a4db042d7cad12e03fce"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "a7c373f6f7bba7208c9f057ef21eabf4064fb910",
    "sha256": "7be5b394b7323c78c0d056178a3d7b3c4f06c081ffe64a0bb975aed6262470c2"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "401688f1d38abb17af88275661b0478ed3f9dd61",
    "sha256": "e7e69fe4f56e1f8af32dc508c1f9994cf2bf9f30ba40c049efbe6c4c8ca4ada3"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "e5bc3290662e38a59d1de952e58652779afd3e60",
    "sha256": "f8a3450a4c29bbd05ddd7c64100451b6eaef2c3c45f38ff4fb11359aee81922b"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "c448f3ef12ce3555204b0a1afd7ffb01070d619c",
    "sha256": "d6475cfdf00c6612b7a24501186ed14fb96cdc45f2a4de5b4c07eb92c69cd992"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "0f82e7a009270dd975eca27d2c4886a7576c2d90",
    "sha256": "e22fc316c003be79adb7b9c545651123aef00e39bb0a3265d9004a78b05233ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "b5a331dd21bf20579a4935f9172d7da6a03bcc1c",
    "sha256": "3894dc21a1f05312f53ea95099a16e05c96e241a7bf4f94d77d50d5e7256c8ca"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "07aaa203253d7134fae87c5bd29bdeab4bcac184",
    "sha256": "219e3eabbc9449086601e2a204021f9ea75f8e9ebac2ead588ecc205a8528123"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "ecc01664da9c894b37b206ce6b86f0c8c995553b",
    "sha256": "e78c099838568d0077d7a2c34de18a58851e94f2cc578f46196d823b14b2d597"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v41.mjs",
    "blob": "e71e6693f8fb880d7f9930939df9f43aa0378ac0",
    "sha256": "636e6c9ec78567e708aad08a4dea0fdde83d1663f670b4cd75624616c6ebfccd"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority107.mjs",
    "blob": "2ce6c91dc680d8db8be396969ab17819cb77fece",
    "sha256": "3f11302e23689fc70c5d9b12b9a3cc0edd763d97cb6be521d4c6e290afa1800a"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "4d2b376c3853f52479174a49d3dd528d5a4d66ab",
    "sha256": "1c8aba199a623b38f781c62351a883bb048313d4c3c8065ccbc3bf6f5ff33e2e"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "ff952c697a02ec282f83a8ba93367db0ee128c25",
    "sha256": "bdf131729754d4d96a7de71d5a1a4e79e2a17bcb157da37a49a267ae365a8a7c"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "f01667d1b4224caac7293cb5b286510ad364a9d1",
    "sha256": "e9eaa56e07f0d6367b6ec5213e189b49c1590ce4091c4abda6441fa51b9fb21f"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision108.json",
    "blob": "8feb0a1937eab198bb7d89ef678d331cc10c00b3",
    "sha256": "51560eaeb548eb65eb55e0cfab7eb92894cfd7d151c5387636417ccdd6d0c26b"
  },
  {
    "path": "src/components/geometry-worker-b.test.tsx",
    "blob": "8b95ca0396d4376fc150e89d1ae2d933f21fd320",
    "sha256": "f4486dee66b972f2f810ba22a0060a35d01723db0dac068666c7a4220963248d"
  },
  {
    "path": "src/components/remainder-capture-successor.test.tsx",
    "blob": "4b65125f8150a3ad81e56f4483d6eecd455c33e1",
    "sha256": "e0f78569a7c6d86660920cd5bb10edf1347ac592b439e553c8f1370b9d61c90e"
  },
  {
    "path": "src/components/remainder-capture-successor.tsx",
    "blob": "6131ce1ecfe23ebd2923e064d83222aa6c093cd9",
    "sha256": "7f357fa76eb011cb02ddaf02fbf05535345be9ccac08444920e0f86c3cac8728"
  },
  {
    "path": "src/components/science-worker-c.test.tsx",
    "blob": "d8a89253ac37857777b2de1c38c48c6a7089c02f",
    "sha256": "3005f17b71724434f7f5e6e6ac7193a643c50a615a661188f6f9c3f94aa36fa6"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.test.ts",
    "blob": "9a61627b6d28b0d0f4d49dcc4343df0652a99e72",
    "sha256": "492eaeb5d6832f8c5f3c0537639e2624438bb9566dc62f567b95e653e0075649"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.ts",
    "blob": "10f8a1d423c591db269763c8f7dceb39a597f22c",
    "sha256": "b68c3fd1147c8ae4c74c41c621edcae6b8bf053cd93ee68a5788445269f2424c"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "b14e4db26be870018a9990b4a76b4783b9bba1b9",
    "sha256": "06826390c1577889f9967cefea723d953266f450555c9dcfc6705d35c940e313"
  },
  {
    "path": "src/lib/calculator-factory/completion/geometry-worker-b.integration.test.ts",
    "blob": "e5eef2029d4ebb095f741b81bed8615bdb3b7820",
    "sha256": "8dd4e8541c92119ce6961c224de883fec9d6c93e9331d2aeaf2565b3d2232f7d"
  },
  {
    "path": "src/lib/calculator-factory/completion/math-worker-a.integration.test.ts",
    "blob": "df828587bc6816011447650d1be40ec8df5f006f",
    "sha256": "4e04f82f080c8d881dff9a542c1efffd29fefce56fb5df17e82838a1e13946f1"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-business-recovery.test.ts",
    "blob": "28bf203a165a45be0b45c6b81f7db8ebe6973e5b",
    "sha256": "ba57742167183f93c47dbd733ae4671d02328d0a791acf55199998bb95931b26"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.test.ts",
    "blob": "4635e5a3eeca48dc68395e95a39ef543f183ff74",
    "sha256": "ad70b27149948394142983a684208ef359d1cef84af391a599b1e4a5818b2288"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.ts",
    "blob": "944e516bf4455b28ee36f9fbf421d249b9bf7165",
    "sha256": "7f13a8e54c2424f55266c9be9f582a28f8de7a2eea279b16fb3203e470a26305"
  },
  {
    "path": "src/lib/calculator-factory/completion/science-worker-c.integration.test.ts",
    "blob": "b14ed8a511ad3b506236e55ca166c2ff755253b9",
    "sha256": "6e29656b7b47389c10b87bd81e5c60fe054297d91bf05cb9f388f73efaabb104"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "50610b57009a29566b55b07a1a15da884d905238",
    "sha256": "cb9633181f361c1a17f1d8399be51d94c4ca633f2689622bcf48c92a37147a9f"
  },
  {
    "path": "src/lib/science-dispatch.test.ts",
    "blob": "126f5715739e1da84fb75035925f717958cbd6db",
    "sha256": "0265483737849a2f24c9f87cf2acdfa6d94007f2945ccc2c1e682c084a786e42"
  },
  {
    "path": "src/lib/science-worker-c-snapshot-verification.ts",
    "blob": "570db1a786743d707e76dd78907eae118b19a4b9",
    "sha256": "061c0b884ccbc6653c1760d78cfbf0ec5997d33e5ed609d3845f40de8a6d11e6"
  },
  {
    "path": "src/lib/surface-area-dispatch.test.ts",
    "blob": "623ad60fd2a0570deb8ec4231107647139515c81",
    "sha256": "4b80f99464536258ad7ea3b7e68fa452747798460ad92bb85881edb41383d0f0"
  },
  {
    "path": "src/lib/surface-area-snapshot-verification.ts",
    "blob": "27b4c02d01bb6c0534ce4081a2793fcafd76cbcd",
    "sha256": "41dc30b33754f903bdd7a05c8663b36140ed42707868c148ed8afeced5872f9a"
  }
]);
export const additionalStage8V41BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","0eb375bc79c8331f4b6250848c64d9036831e20c","103fe68fa45bedf708b6880bdc6f085eec3e31b5","10b2f67e949724565e6057fe9a1e44fbf050d61a","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","45321f7d00a0170db3a78088328afe2df821b649","56844ec40292b010bc89ad7371c2d0340340bafe","64c86e4fe5f77816f2b5b45ea2177ed56520b292","66d0bd6a24d816ddb77d72a5f17334aa48d3e86c","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","b4de3253bae372b7a0565c2ad8cd2bd1c5236efd","b9b0ae266d6c11cfc36cccbf010919f93fa5657e","d9b017f46616ee632f622e1bca29b1910cc87f4d","dc8544422dbb4ebccfc96e03431e64ebcf871fc9","f3cac16a17e99fa1ce9fd80475806436440239b9"]);
export const acceptedStage8V42=Object.freeze([
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.test.mjs",
    "blob": "d4338c298759417ea142a8732711a57d287e32f1",
    "sha256": "cc23bb1d6218b11d9d870db8bea7bb37daa79ace326503a5b6d1823ab5668a5a"
  },
  {
    "path": "tests/milestone100-20261114/receipt-source-path-stage8.mjs",
    "blob": "5f3d4ff0b831ad8435ee789632c1e14a16f4fdc7",
    "sha256": "e6e1729a15ba6e39a55a23a36647fd30a12b52c59e2e651f6c3693ca7cffc661"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-availability.test.mjs",
    "blob": "9891d6b007360880887dca4b5f5d0c43f58afcb2",
    "sha256": "0dbb7f2f36931d195cc3acc48c8119a05192ee4c5938a85927ed901b5be901cc"
  },
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "c8f43ce6524170d6274b09d0b9210ec58dc3d44e",
    "sha256": "6a7db26f8834f6553c29499606121656e8e5d8400ef9f37501718b62ba23ed6f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-activation.mjs",
    "blob": "14831f5376c3e1c91b9a8850f29f1a69c80d48f5",
    "sha256": "50dda9370da8b118892054f51deb274d5328f527e726b8bbc282b70ea160664c"
  },
  {
    "path": "docs/four-worker-integration-20261115/source-stage9.json",
    "blob": "de0c966029ffae0917c65395dedf7d7adda8b4f5",
    "sha256": "1aa535186df0687954816b388378b36dcb2297deedf8e3a56e0d956da7609afd"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9-policy.mjs",
    "blob": "b3e130c437283263ac7369d1b631243bcbccb98b",
    "sha256": "6ddf247c69569a88ac37361f29b2094f39ce2ae0cbcc82f0687b4bda4dbfb1b6"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.mjs",
    "blob": "0436798b76dc1371578f0e7560592a27a018bdcc",
    "sha256": "46bf9b4b109db763c38c19260919ddb17a0492f5e186b24b05177fd89bf9188c"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.test.mjs",
    "blob": "50d22ee660f08da9f6757b1627dcc657ee2eed56",
    "sha256": "78cdb2a01519dcb46495c8c5e32363457622cd0fa1744ffd33cf604c3541f901"
  },
  {
    "path": "tests/worker-a-intake-20261115/auth-browser.mjs",
    "blob": "b318ba753fa5360ac289dac92d7028b8c0c6864b",
    "sha256": "67c494e2071dc59f5aae626ee7fb52790833d0fedfc057627973c1f8494a06ae"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/actions.ts",
    "blob": "8cca4bb5b500872c86691852bf829ef25a1324cd",
    "sha256": "5d346d8615f8351b429cbcedb2817d55808ade7fe4c5ac4e93f9be56f1e20c9c"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/client.tsx",
    "blob": "afea2ec06e87737393d0ce46b19ce636cfc42b22",
    "sha256": "da9b638a304347da1da8dedb29c2fcc8709b866f4d728d9a9add3a5f190fe7ff"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/page.tsx",
    "blob": "e153c73b257971f38d2bd18f108c622fdf297aa0",
    "sha256": "c70a0c461f4aa461a5fc732a5d4a142c78d29d7e5e9948f4e9bab4c3e589a994"
  },
  {
    "path": "tests/worker-a-intake-20261115/source-and-compatibility.mjs",
    "blob": "e08d469c6a76c0532e47dbf73e1b0cd7d88496ed",
    "sha256": "772ca0dbc0c96bf19bd6ee27eeaf94265e28c13fc07ea276cab39c127f474e1c"
  },
  {
    "path": "tests/worker-a-intake-20261115/successor-admission.mjs",
    "blob": "3ef9dc6b00a7daf757a799ba9ad42050a388e26e",
    "sha256": "6bf3b64542ec0f64cecdbd2f500f47234cf3a8ca603a1ba26bddcea8e9617a7b"
  },
  {
    "path": "tests/worker-d-shared-delivery-20261115/acceptance.mjs",
    "blob": "61d67a7acaecad4ecece913dcf130c49b81b967f",
    "sha256": "2eff8ae85e08de3c542a7b31fb0bc9836b90ee7de3487d5835a51114a55063b4"
  },
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "blob": "22b12551c55b8f500f38ddabfb7bba5381575539",
    "sha256": "018ac07149492c2e788362b6c0d03ce6a4c407bb504bca91615a96daf803370b"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-publication-transport.mjs",
    "blob": "cdcc32bf183e8adb395a3b294455ed9657add750",
    "sha256": "281c590fe73cff1fd466fb428286d8a885ef3117ab61e4b652fe77642e3d32ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.mjs",
    "blob": "51894528599103dd5341d229bbefa18e46e395f3",
    "sha256": "6cf61baf387cbaf12fc24618e94e9279f65ccf3f55af47993aedd55ea5022d92"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.test.mjs",
    "blob": "498301c9581d3110467ffb07bdf8821565213d65",
    "sha256": "0ff59e5258f722bbb0e309856aba4dd82ba3df8ebcff8f425ba1327b6cd6c60f"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-claims.mjs",
    "blob": "1d38f116c6329c1d0896d904f9e2599aa3db2770",
    "sha256": "c085049403c9df4c8e675f7a8cf9d6b89459ac5572dc6a21d1f23bd2513c6e50"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-batch.test.mjs",
    "blob": "4a0755885d17f7e341738188d679f2ea451c52a9",
    "sha256": "d41130285b42a4c434816bfe9d980a47967beeb4c81351e0d0a3bf53445cb514"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.mjs",
    "blob": "0de686169f940425a46253bba4927a5c7b0a03e2",
    "sha256": "38df96a9ee234e6abfd3a8605a5f64883ac24485ca3a87f11c983a271eecd956"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.test.mjs",
    "blob": "ff56978337dfd54caf33382ff203dbbb318d6d6e",
    "sha256": "fed2e3f595b363699381c42a42491b7e2e81fee15ea9f363fc1066f3c9e90715"
  },
  {
    "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
    "blob": "c122d7962c2a4f93e2209f4b5b0304c341c04a0e",
    "sha256": "944a142a786b356361f93bd3f1de72e8982d3075615de392f0d22b6dff3fbb9b"
  },
  {
    "path": "tests/shortest-publication-20/frequency-presentation-lineage.test.mjs",
    "blob": "16251d9a2becba514c7c78977907a8cdfc35e32f",
    "sha256": "d8933b891a2b8d74f4ae71dc0360a4ba3b7a37dfad13cbde07672c9f59f37199"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "blob": "83b6233bf5fc03bc98525d16dbdbc9c1478e38e8",
    "sha256": "3460587b2da10feca6c8893a270ed5cd457811ed191a08f6b07a12183e8bdd0f"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "aec721c3835418559a6046d36157513122882e62",
    "sha256": "40186e034f0f6c679f271deee5746afbf62f58ba2bf4e0228b58178f9c84f552"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.mjs",
    "blob": "cc099cfff14c79cd57558e6a8c873a8c13dc98cd",
    "sha256": "60a4153d25a84758e0f418f639a54df083ab4fe050eb6fb57142eb7c56333e9f"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.d.mts",
    "blob": "a8aea9fff6eeb37ac205a4383532e14895437256",
    "sha256": "bae4908bfb29bd5cd3c3480c76c12e913f8946dd3d93f155529b85c54ada0b62"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.test.mjs",
    "blob": "883fc969ac6fa9ce4ff43f0c09c0326bfa02e0d9",
    "sha256": "946f1b3e1996c62a8d2a790d244732a1f44571be10ee3d68b4b6eb190cb2d39e"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "2bf9db9747fd26b4e9d4fb03c512a12df514b3fa",
    "sha256": "cee4d541c258f9053122467e2ee6be7a2ffde4a86f983755f7e31fe435daf183"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "c6aff9eb7f8cbf3f26cc78fdab35430f1d7ff327",
    "sha256": "305b63aa47572deae71c1ae19dc33b0150ab8c2f717a210150a3c699dc0ae378"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs",
    "blob": "887f8c7e7b144c2d0e3e1973876a448ee68a032c",
    "sha256": "d8b1597ad1490d992eb82f84601bf0dd069634998ca005de0ed1679d91e11b38"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "0bc2f6b1bdca507b4a035169a4286f14ce8b4696",
    "sha256": "7902d0f3d3ccb57809181857a2b34a9476d1148e96f9ee03ff870aee017e962f"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "12d39ae6e52ba1d71d883f9658ad6a39d8dd2190",
    "sha256": "9f0c6c952cddf8f8c5e470d5b3f1c2630191b89a5bd491c19942010d12e12343"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "68db41805b5daa9508a884cbb032e1ffe4eb02a1",
    "sha256": "a91146bba31575f41121f5d51bd1df1a201230c5c864a4db042d7cad12e03fce"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "a7c373f6f7bba7208c9f057ef21eabf4064fb910",
    "sha256": "7be5b394b7323c78c0d056178a3d7b3c4f06c081ffe64a0bb975aed6262470c2"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "401688f1d38abb17af88275661b0478ed3f9dd61",
    "sha256": "e7e69fe4f56e1f8af32dc508c1f9994cf2bf9f30ba40c049efbe6c4c8ca4ada3"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "1988e334b275c7e9f593d85bd1ad958998e9cb57",
    "sha256": "3560db6814ca2b1a3a3b5cffa94d6406590f9acb51ea98ff13f2c45242b261c1"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "c448f3ef12ce3555204b0a1afd7ffb01070d619c",
    "sha256": "d6475cfdf00c6612b7a24501186ed14fb96cdc45f2a4de5b4c07eb92c69cd992"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "0f82e7a009270dd975eca27d2c4886a7576c2d90",
    "sha256": "e22fc316c003be79adb7b9c545651123aef00e39bb0a3265d9004a78b05233ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "b5a331dd21bf20579a4935f9172d7da6a03bcc1c",
    "sha256": "3894dc21a1f05312f53ea95099a16e05c96e241a7bf4f94d77d50d5e7256c8ca"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "04f4a0f44c1fd0f5690b1858d98261764406342f",
    "sha256": "018de4b84e58479ac5ce34f85451ded9ed74e944f841ece232b79d6b38738d34"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "138dc5ee11681fec8e49e7adb1a47e1912a7332a",
    "sha256": "906317aa64153a93d4b22806b81b3b5ac40365aa327263020ef8420be57f3110"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v42.mjs",
    "blob": "bb24a72925e4d3d9e0bee9ed81bbb7b19d41fda0",
    "sha256": "06399572ce237726aa1a144d7da9d57904611eae50d2bfdfe72e1f6e9c4ff878"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority108.mjs",
    "blob": "8bbd84efb8c6d94f2e04038881dfa5c028caf4f4",
    "sha256": "a18b07fe82e56764d8689d9ee5efe4d64d91e1e0228879285d2cec515d2c4161"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "657b8dbaec263e3e5186ed4f3a9af9cecf354781",
    "sha256": "0b550eb19e637f5ff6a80f99df6daa12e20d4e3d60c1bd82ebf03cb0225acbe9"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "ee9db47b7902a5872dc1710a3bf2843cd95c305a",
    "sha256": "1505946a3486f95548af7a8232b4c39d066121eefc10e56cde25b81392b75113"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "4364c211f4987194f974565bbbb040d56e15c7b4",
    "sha256": "1937a236d5ee876e344cc509a4ab9344eb9df292f8b98df531f8f8fd1f276838"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision109.json",
    "blob": "d26add08fd9f6f8e288820ee4080bd9c38329031",
    "sha256": "85c81a658601ddd172ff8670a7fbb9c82f198d742099f81f9eefe4fec2018b65"
  },
  {
    "path": "src/components/geometry-worker-b.test.tsx",
    "blob": "8b95ca0396d4376fc150e89d1ae2d933f21fd320",
    "sha256": "f4486dee66b972f2f810ba22a0060a35d01723db0dac068666c7a4220963248d"
  },
  {
    "path": "src/components/remainder-capture-successor.test.tsx",
    "blob": "4b65125f8150a3ad81e56f4483d6eecd455c33e1",
    "sha256": "e0f78569a7c6d86660920cd5bb10edf1347ac592b439e553c8f1370b9d61c90e"
  },
  {
    "path": "src/components/remainder-capture-successor.tsx",
    "blob": "6131ce1ecfe23ebd2923e064d83222aa6c093cd9",
    "sha256": "7f357fa76eb011cb02ddaf02fbf05535345be9ccac08444920e0f86c3cac8728"
  },
  {
    "path": "src/components/science-worker-c.test.tsx",
    "blob": "d8a89253ac37857777b2de1c38c48c6a7089c02f",
    "sha256": "3005f17b71724434f7f5e6e6ac7193a643c50a615a661188f6f9c3f94aa36fa6"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.test.ts",
    "blob": "9a61627b6d28b0d0f4d49dcc4343df0652a99e72",
    "sha256": "492eaeb5d6832f8c5f3c0537639e2624438bb9566dc62f567b95e653e0075649"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.ts",
    "blob": "10f8a1d423c591db269763c8f7dceb39a597f22c",
    "sha256": "b68c3fd1147c8ae4c74c41c621edcae6b8bf053cd93ee68a5788445269f2424c"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "b14e4db26be870018a9990b4a76b4783b9bba1b9",
    "sha256": "06826390c1577889f9967cefea723d953266f450555c9dcfc6705d35c940e313"
  },
  {
    "path": "src/lib/calculator-factory/completion/geometry-worker-b.integration.test.ts",
    "blob": "e5eef2029d4ebb095f741b81bed8615bdb3b7820",
    "sha256": "8dd4e8541c92119ce6961c224de883fec9d6c93e9331d2aeaf2565b3d2232f7d"
  },
  {
    "path": "src/lib/calculator-factory/completion/math-worker-a.integration.test.ts",
    "blob": "df828587bc6816011447650d1be40ec8df5f006f",
    "sha256": "4e04f82f080c8d881dff9a542c1efffd29fefce56fb5df17e82838a1e13946f1"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-business-recovery.test.ts",
    "blob": "28bf203a165a45be0b45c6b81f7db8ebe6973e5b",
    "sha256": "ba57742167183f93c47dbd733ae4671d02328d0a791acf55199998bb95931b26"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.test.ts",
    "blob": "4635e5a3eeca48dc68395e95a39ef543f183ff74",
    "sha256": "ad70b27149948394142983a684208ef359d1cef84af391a599b1e4a5818b2288"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.ts",
    "blob": "944e516bf4455b28ee36f9fbf421d249b9bf7165",
    "sha256": "7f13a8e54c2424f55266c9be9f582a28f8de7a2eea279b16fb3203e470a26305"
  },
  {
    "path": "src/lib/calculator-factory/completion/science-worker-c.integration.test.ts",
    "blob": "b14ed8a511ad3b506236e55ca166c2ff755253b9",
    "sha256": "6e29656b7b47389c10b87bd81e5c60fe054297d91bf05cb9f388f73efaabb104"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "50610b57009a29566b55b07a1a15da884d905238",
    "sha256": "cb9633181f361c1a17f1d8399be51d94c4ca633f2689622bcf48c92a37147a9f"
  },
  {
    "path": "src/lib/science-dispatch.test.ts",
    "blob": "126f5715739e1da84fb75035925f717958cbd6db",
    "sha256": "0265483737849a2f24c9f87cf2acdfa6d94007f2945ccc2c1e682c084a786e42"
  },
  {
    "path": "src/lib/science-worker-c-snapshot-verification.ts",
    "blob": "570db1a786743d707e76dd78907eae118b19a4b9",
    "sha256": "061c0b884ccbc6653c1760d78cfbf0ec5997d33e5ed609d3845f40de8a6d11e6"
  },
  {
    "path": "src/lib/surface-area-dispatch.test.ts",
    "blob": "623ad60fd2a0570deb8ec4231107647139515c81",
    "sha256": "4b80f99464536258ad7ea3b7e68fa452747798460ad92bb85881edb41383d0f0"
  },
  {
    "path": "src/lib/surface-area-snapshot-verification.ts",
    "blob": "27b4c02d01bb6c0534ce4081a2793fcafd76cbcd",
    "sha256": "41dc30b33754f903bdd7a05c8663b36140ed42707868c148ed8afeced5872f9a"
  }
]);
export const additionalStage8V42BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","0eb375bc79c8331f4b6250848c64d9036831e20c","103fe68fa45bedf708b6880bdc6f085eec3e31b5","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","56844ec40292b010bc89ad7371c2d0340340bafe","64c86e4fe5f77816f2b5b45ea2177ed56520b292","66d0bd6a24d816ddb77d72a5f17334aa48d3e86c","76d2ff2a394344696cdd1b116a5124961f952f07","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","acb86da4949545f16a0de969803f66f0496ecb2d","b4de3253bae372b7a0565c2ad8cd2bd1c5236efd","b9b0ae266d6c11cfc36cccbf010919f93fa5657e","d9b017f46616ee632f622e1bca29b1910cc87f4d","dc8544422dbb4ebccfc96e03431e64ebcf871fc9","f3cac16a17e99fa1ce9fd80475806436440239b9"]);
export const acceptedStage8V43=Object.freeze([
  {
    "path": "tests/calculator-sprint-20261108/first-two-packet.test.mjs",
    "blob": "b99bf3bfc6e15addedb882b472a1fd809bd0fe8a",
    "sha256": "e7cc5d76bf20d514bc5d47032fd38fb7204653ad157cccafa1dfbcbdbede430c"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-live.test.mjs",
    "blob": "9a0f0e3b074e4f1028f3e697a6aec3152ec90eb5",
    "sha256": "61bf13105fd6f36fe1d98f5e55f118dff206e5db25f101d11b907163ed9c92a1"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-live.test.mjs",
    "blob": "339b7559e06328d987e86ae5d4c26576fbdacd16",
    "sha256": "c4a5dc7ecaed134bcd197bbcb345069569ce6f8193db112b51867c49301cc2dd"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.test.mjs",
    "blob": "d4338c298759417ea142a8732711a57d287e32f1",
    "sha256": "cc23bb1d6218b11d9d870db8bea7bb37daa79ace326503a5b6d1823ab5668a5a"
  },
  {
    "path": "tests/milestone100-20261114/receipt-source-path-stage8.mjs",
    "blob": "5f3d4ff0b831ad8435ee789632c1e14a16f4fdc7",
    "sha256": "e6e1729a15ba6e39a55a23a36647fd30a12b52c59e2e651f6c3693ca7cffc661"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-availability.test.mjs",
    "blob": "9891d6b007360880887dca4b5f5d0c43f58afcb2",
    "sha256": "0dbb7f2f36931d195cc3acc48c8119a05192ee4c5938a85927ed901b5be901cc"
  },
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "c8f43ce6524170d6274b09d0b9210ec58dc3d44e",
    "sha256": "6a7db26f8834f6553c29499606121656e8e5d8400ef9f37501718b62ba23ed6f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-activation.mjs",
    "blob": "14831f5376c3e1c91b9a8850f29f1a69c80d48f5",
    "sha256": "50dda9370da8b118892054f51deb274d5328f527e726b8bbc282b70ea160664c"
  },
  {
    "path": "docs/four-worker-integration-20261115/source-stage9.json",
    "blob": "de0c966029ffae0917c65395dedf7d7adda8b4f5",
    "sha256": "1aa535186df0687954816b388378b36dcb2297deedf8e3a56e0d956da7609afd"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9-policy.mjs",
    "blob": "b3e130c437283263ac7369d1b631243bcbccb98b",
    "sha256": "6ddf247c69569a88ac37361f29b2094f39ce2ae0cbcc82f0687b4bda4dbfb1b6"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.mjs",
    "blob": "0436798b76dc1371578f0e7560592a27a018bdcc",
    "sha256": "46bf9b4b109db763c38c19260919ddb17a0492f5e186b24b05177fd89bf9188c"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.test.mjs",
    "blob": "50d22ee660f08da9f6757b1627dcc657ee2eed56",
    "sha256": "78cdb2a01519dcb46495c8c5e32363457622cd0fa1744ffd33cf604c3541f901"
  },
  {
    "path": "tests/worker-a-intake-20261115/auth-browser.mjs",
    "blob": "b318ba753fa5360ac289dac92d7028b8c0c6864b",
    "sha256": "67c494e2071dc59f5aae626ee7fb52790833d0fedfc057627973c1f8494a06ae"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/actions.ts",
    "blob": "8cca4bb5b500872c86691852bf829ef25a1324cd",
    "sha256": "5d346d8615f8351b429cbcedb2817d55808ade7fe4c5ac4e93f9be56f1e20c9c"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/client.tsx",
    "blob": "afea2ec06e87737393d0ce46b19ce636cfc42b22",
    "sha256": "da9b638a304347da1da8dedb29c2fcc8709b866f4d728d9a9add3a5f190fe7ff"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/page.tsx",
    "blob": "e153c73b257971f38d2bd18f108c622fdf297aa0",
    "sha256": "c70a0c461f4aa461a5fc732a5d4a142c78d29d7e5e9948f4e9bab4c3e589a994"
  },
  {
    "path": "tests/worker-a-intake-20261115/source-and-compatibility.mjs",
    "blob": "e08d469c6a76c0532e47dbf73e1b0cd7d88496ed",
    "sha256": "772ca0dbc0c96bf19bd6ee27eeaf94265e28c13fc07ea276cab39c127f474e1c"
  },
  {
    "path": "tests/worker-a-intake-20261115/successor-admission.mjs",
    "blob": "3ef9dc6b00a7daf757a799ba9ad42050a388e26e",
    "sha256": "6bf3b64542ec0f64cecdbd2f500f47234cf3a8ca603a1ba26bddcea8e9617a7b"
  },
  {
    "path": "tests/worker-d-shared-delivery-20261115/acceptance.mjs",
    "blob": "61d67a7acaecad4ecece913dcf130c49b81b967f",
    "sha256": "2eff8ae85e08de3c542a7b31fb0bc9836b90ee7de3487d5835a51114a55063b4"
  },
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "blob": "22b12551c55b8f500f38ddabfb7bba5381575539",
    "sha256": "018ac07149492c2e788362b6c0d03ce6a4c407bb504bca91615a96daf803370b"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-publication-transport.mjs",
    "blob": "cdcc32bf183e8adb395a3b294455ed9657add750",
    "sha256": "281c590fe73cff1fd466fb428286d8a885ef3117ab61e4b652fe77642e3d32ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.mjs",
    "blob": "51894528599103dd5341d229bbefa18e46e395f3",
    "sha256": "6cf61baf387cbaf12fc24618e94e9279f65ccf3f55af47993aedd55ea5022d92"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.test.mjs",
    "blob": "498301c9581d3110467ffb07bdf8821565213d65",
    "sha256": "0ff59e5258f722bbb0e309856aba4dd82ba3df8ebcff8f425ba1327b6cd6c60f"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-claims.mjs",
    "blob": "1d38f116c6329c1d0896d904f9e2599aa3db2770",
    "sha256": "c085049403c9df4c8e675f7a8cf9d6b89459ac5572dc6a21d1f23bd2513c6e50"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-batch.test.mjs",
    "blob": "4a0755885d17f7e341738188d679f2ea451c52a9",
    "sha256": "d41130285b42a4c434816bfe9d980a47967beeb4c81351e0d0a3bf53445cb514"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.mjs",
    "blob": "0de686169f940425a46253bba4927a5c7b0a03e2",
    "sha256": "38df96a9ee234e6abfd3a8605a5f64883ac24485ca3a87f11c983a271eecd956"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.test.mjs",
    "blob": "ff56978337dfd54caf33382ff203dbbb318d6d6e",
    "sha256": "fed2e3f595b363699381c42a42491b7e2e81fee15ea9f363fc1066f3c9e90715"
  },
  {
    "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
    "blob": "c122d7962c2a4f93e2209f4b5b0304c341c04a0e",
    "sha256": "944a142a786b356361f93bd3f1de72e8982d3075615de392f0d22b6dff3fbb9b"
  },
  {
    "path": "tests/shortest-publication-20/frequency-presentation-lineage.test.mjs",
    "blob": "16251d9a2becba514c7c78977907a8cdfc35e32f",
    "sha256": "d8933b891a2b8d74f4ae71dc0360a4ba3b7a37dfad13cbde07672c9f59f37199"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "blob": "83b6233bf5fc03bc98525d16dbdbc9c1478e38e8",
    "sha256": "3460587b2da10feca6c8893a270ed5cd457811ed191a08f6b07a12183e8bdd0f"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "aec721c3835418559a6046d36157513122882e62",
    "sha256": "40186e034f0f6c679f271deee5746afbf62f58ba2bf4e0228b58178f9c84f552"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.mjs",
    "blob": "cc099cfff14c79cd57558e6a8c873a8c13dc98cd",
    "sha256": "60a4153d25a84758e0f418f639a54df083ab4fe050eb6fb57142eb7c56333e9f"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.d.mts",
    "blob": "a8aea9fff6eeb37ac205a4383532e14895437256",
    "sha256": "bae4908bfb29bd5cd3c3480c76c12e913f8946dd3d93f155529b85c54ada0b62"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.test.mjs",
    "blob": "883fc969ac6fa9ce4ff43f0c09c0326bfa02e0d9",
    "sha256": "946f1b3e1996c62a8d2a790d244732a1f44571be10ee3d68b4b6eb190cb2d39e"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "2bf9db9747fd26b4e9d4fb03c512a12df514b3fa",
    "sha256": "cee4d541c258f9053122467e2ee6be7a2ffde4a86f983755f7e31fe435daf183"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "c6aff9eb7f8cbf3f26cc78fdab35430f1d7ff327",
    "sha256": "305b63aa47572deae71c1ae19dc33b0150ab8c2f717a210150a3c699dc0ae378"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs",
    "blob": "887f8c7e7b144c2d0e3e1973876a448ee68a032c",
    "sha256": "d8b1597ad1490d992eb82f84601bf0dd069634998ca005de0ed1679d91e11b38"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "0bc2f6b1bdca507b4a035169a4286f14ce8b4696",
    "sha256": "7902d0f3d3ccb57809181857a2b34a9476d1148e96f9ee03ff870aee017e962f"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "12d39ae6e52ba1d71d883f9658ad6a39d8dd2190",
    "sha256": "9f0c6c952cddf8f8c5e470d5b3f1c2630191b89a5bd491c19942010d12e12343"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "68db41805b5daa9508a884cbb032e1ffe4eb02a1",
    "sha256": "a91146bba31575f41121f5d51bd1df1a201230c5c864a4db042d7cad12e03fce"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "a7c373f6f7bba7208c9f057ef21eabf4064fb910",
    "sha256": "7be5b394b7323c78c0d056178a3d7b3c4f06c081ffe64a0bb975aed6262470c2"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "401688f1d38abb17af88275661b0478ed3f9dd61",
    "sha256": "e7e69fe4f56e1f8af32dc508c1f9994cf2bf9f30ba40c049efbe6c4c8ca4ada3"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "51962ee5f0991837bd0ef938165d5a453763d5fc",
    "sha256": "ab981ad16500024fc35a4044578b91182a69e92190ceb2b0ae64845934f07c7a"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "c448f3ef12ce3555204b0a1afd7ffb01070d619c",
    "sha256": "d6475cfdf00c6612b7a24501186ed14fb96cdc45f2a4de5b4c07eb92c69cd992"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "0f82e7a009270dd975eca27d2c4886a7576c2d90",
    "sha256": "e22fc316c003be79adb7b9c545651123aef00e39bb0a3265d9004a78b05233ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "b5a331dd21bf20579a4935f9172d7da6a03bcc1c",
    "sha256": "3894dc21a1f05312f53ea95099a16e05c96e241a7bf4f94d77d50d5e7256c8ca"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "ac1ecedc40f3104307ca8a8e4ce6f92398a2a164",
    "sha256": "f31250c7a2e16a2b6aab298eb745c2988ef2b6bd01e524fd6ac0f997300e9ec5"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "b19538ec4f3f5f53712890e5ba22b0838efba02a",
    "sha256": "96c7fa0a0723e3deaaf5d173d7c343e7a462bfc026f639260d97655cba78d561"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v43.mjs",
    "blob": "4cb69214616b07052c8f07893079e66609cbd9a3",
    "sha256": "b464c69acfce413228c12245a5db0adacb943a29bee1ba96e98ec70b8a0d9271"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority109.mjs",
    "blob": "e59490eca5a323f246fa48d6886496f597966b22",
    "sha256": "80f3aa6c272b147a5ae5b6df42e7cb7979300a8d98b1a4721831264a61441345"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "7222f6a28dd01b3d17c3d638ab0228d5c965ccbc",
    "sha256": "2c9eb7279e2ffe4851dcb52fe6ff1fc406c118e55f5d8e9e8363987ad063530e"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "711102ff80afe4b8610029a3d70de03dc868b58b",
    "sha256": "b489974596ba6ee80fbe998696911b9758d2feb60d35bab525d1892ba0a76432"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "a15e20e120f8c0be998df89f06ca93ba54fa5b6d",
    "sha256": "5bc764945fc2367735cbef15d17b9b370380e532c23054cec6c80c0e5072528b"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision110.json",
    "blob": "b5cc86639bffac740f9b909d48cb5584137fe642",
    "sha256": "60c81fceac12c9adbae3604423c2c6803ba5c5fec51baca2546e57f49e06aa2e"
  },
  {
    "path": "src/components/geometry-worker-b.test.tsx",
    "blob": "8b95ca0396d4376fc150e89d1ae2d933f21fd320",
    "sha256": "f4486dee66b972f2f810ba22a0060a35d01723db0dac068666c7a4220963248d"
  },
  {
    "path": "src/components/remainder-capture-successor.test.tsx",
    "blob": "4b65125f8150a3ad81e56f4483d6eecd455c33e1",
    "sha256": "e0f78569a7c6d86660920cd5bb10edf1347ac592b439e553c8f1370b9d61c90e"
  },
  {
    "path": "src/components/remainder-capture-successor.tsx",
    "blob": "6131ce1ecfe23ebd2923e064d83222aa6c093cd9",
    "sha256": "7f357fa76eb011cb02ddaf02fbf05535345be9ccac08444920e0f86c3cac8728"
  },
  {
    "path": "src/components/science-worker-c.test.tsx",
    "blob": "d8a89253ac37857777b2de1c38c48c6a7089c02f",
    "sha256": "3005f17b71724434f7f5e6e6ac7193a643c50a615a661188f6f9c3f94aa36fa6"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.test.ts",
    "blob": "9a61627b6d28b0d0f4d49dcc4343df0652a99e72",
    "sha256": "492eaeb5d6832f8c5f3c0537639e2624438bb9566dc62f567b95e653e0075649"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.ts",
    "blob": "10f8a1d423c591db269763c8f7dceb39a597f22c",
    "sha256": "b68c3fd1147c8ae4c74c41c621edcae6b8bf053cd93ee68a5788445269f2424c"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "b14e4db26be870018a9990b4a76b4783b9bba1b9",
    "sha256": "06826390c1577889f9967cefea723d953266f450555c9dcfc6705d35c940e313"
  },
  {
    "path": "src/lib/calculator-factory/completion/geometry-worker-b.integration.test.ts",
    "blob": "e5eef2029d4ebb095f741b81bed8615bdb3b7820",
    "sha256": "8dd4e8541c92119ce6961c224de883fec9d6c93e9331d2aeaf2565b3d2232f7d"
  },
  {
    "path": "src/lib/calculator-factory/completion/math-worker-a.integration.test.ts",
    "blob": "df828587bc6816011447650d1be40ec8df5f006f",
    "sha256": "4e04f82f080c8d881dff9a542c1efffd29fefce56fb5df17e82838a1e13946f1"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-business-recovery.test.ts",
    "blob": "28bf203a165a45be0b45c6b81f7db8ebe6973e5b",
    "sha256": "ba57742167183f93c47dbd733ae4671d02328d0a791acf55199998bb95931b26"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.test.ts",
    "blob": "4635e5a3eeca48dc68395e95a39ef543f183ff74",
    "sha256": "ad70b27149948394142983a684208ef359d1cef84af391a599b1e4a5818b2288"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.ts",
    "blob": "944e516bf4455b28ee36f9fbf421d249b9bf7165",
    "sha256": "7f13a8e54c2424f55266c9be9f582a28f8de7a2eea279b16fb3203e470a26305"
  },
  {
    "path": "src/lib/calculator-factory/completion/science-worker-c.integration.test.ts",
    "blob": "b14ed8a511ad3b506236e55ca166c2ff755253b9",
    "sha256": "6e29656b7b47389c10b87bd81e5c60fe054297d91bf05cb9f388f73efaabb104"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "50610b57009a29566b55b07a1a15da884d905238",
    "sha256": "cb9633181f361c1a17f1d8399be51d94c4ca633f2689622bcf48c92a37147a9f"
  },
  {
    "path": "src/lib/science-dispatch.test.ts",
    "blob": "126f5715739e1da84fb75035925f717958cbd6db",
    "sha256": "0265483737849a2f24c9f87cf2acdfa6d94007f2945ccc2c1e682c084a786e42"
  },
  {
    "path": "src/lib/science-worker-c-snapshot-verification.ts",
    "blob": "570db1a786743d707e76dd78907eae118b19a4b9",
    "sha256": "061c0b884ccbc6653c1760d78cfbf0ec5997d33e5ed609d3845f40de8a6d11e6"
  },
  {
    "path": "src/lib/surface-area-dispatch.test.ts",
    "blob": "623ad60fd2a0570deb8ec4231107647139515c81",
    "sha256": "4b80f99464536258ad7ea3b7e68fa452747798460ad92bb85881edb41383d0f0"
  },
  {
    "path": "src/lib/surface-area-snapshot-verification.ts",
    "blob": "27b4c02d01bb6c0534ce4081a2793fcafd76cbcd",
    "sha256": "41dc30b33754f903bdd7a05c8663b36140ed42707868c148ed8afeced5872f9a"
  }
]);
export const additionalStage8V43BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","0eb375bc79c8331f4b6250848c64d9036831e20c","103fe68fa45bedf708b6880bdc6f085eec3e31b5","19d017f9e34228e8e59a744bf6f5f4f970235bf8","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","56844ec40292b010bc89ad7371c2d0340340bafe","64c86e4fe5f77816f2b5b45ea2177ed56520b292","66d0bd6a24d816ddb77d72a5f17334aa48d3e86c","7d76c01533944bd6b904f44939693f7795913880","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","b4de3253bae372b7a0565c2ad8cd2bd1c5236efd","b9b0ae266d6c11cfc36cccbf010919f93fa5657e","d9b017f46616ee632f622e1bca29b1910cc87f4d","dc8544422dbb4ebccfc96e03431e64ebcf871fc9","f3cac16a17e99fa1ce9fd80475806436440239b9"]);
export const acceptedStage8V44=Object.freeze([
  {
    "path": "tests/calculator-sprint-20261108/first-two-packet.test.mjs",
    "blob": "b99bf3bfc6e15addedb882b472a1fd809bd0fe8a",
    "sha256": "e7cc5d76bf20d514bc5d47032fd38fb7204653ad157cccafa1dfbcbdbede430c"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-live.test.mjs",
    "blob": "9a0f0e3b074e4f1028f3e697a6aec3152ec90eb5",
    "sha256": "61bf13105fd6f36fe1d98f5e55f118dff206e5db25f101d11b907163ed9c92a1"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-live.test.mjs",
    "blob": "339b7559e06328d987e86ae5d4c26576fbdacd16",
    "sha256": "c4a5dc7ecaed134bcd197bbcb345069569ce6f8193db112b51867c49301cc2dd"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.test.mjs",
    "blob": "d4338c298759417ea142a8732711a57d287e32f1",
    "sha256": "cc23bb1d6218b11d9d870db8bea7bb37daa79ace326503a5b6d1823ab5668a5a"
  },
  {
    "path": "tests/milestone100-20261114/receipt-source-path-stage8.mjs",
    "blob": "582d5123a3f02874b0e4211e97230426a661e7b3",
    "sha256": "40a0ec37ea2ae4002a53210092b37145eca010c9d42bc7f0c0ae1f3d4133820f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-availability.test.mjs",
    "blob": "9891d6b007360880887dca4b5f5d0c43f58afcb2",
    "sha256": "0dbb7f2f36931d195cc3acc48c8119a05192ee4c5938a85927ed901b5be901cc"
  },
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "c8f43ce6524170d6274b09d0b9210ec58dc3d44e",
    "sha256": "6a7db26f8834f6553c29499606121656e8e5d8400ef9f37501718b62ba23ed6f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-activation.mjs",
    "blob": "14831f5376c3e1c91b9a8850f29f1a69c80d48f5",
    "sha256": "50dda9370da8b118892054f51deb274d5328f527e726b8bbc282b70ea160664c"
  },
  {
    "path": "docs/four-worker-integration-20261115/source-stage9.json",
    "blob": "de0c966029ffae0917c65395dedf7d7adda8b4f5",
    "sha256": "1aa535186df0687954816b388378b36dcb2297deedf8e3a56e0d956da7609afd"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9-policy.mjs",
    "blob": "b3e130c437283263ac7369d1b631243bcbccb98b",
    "sha256": "6ddf247c69569a88ac37361f29b2094f39ce2ae0cbcc82f0687b4bda4dbfb1b6"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.mjs",
    "blob": "0436798b76dc1371578f0e7560592a27a018bdcc",
    "sha256": "46bf9b4b109db763c38c19260919ddb17a0492f5e186b24b05177fd89bf9188c"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.test.mjs",
    "blob": "50d22ee660f08da9f6757b1627dcc657ee2eed56",
    "sha256": "78cdb2a01519dcb46495c8c5e32363457622cd0fa1744ffd33cf604c3541f901"
  },
  {
    "path": "tests/worker-a-intake-20261115/auth-browser.mjs",
    "blob": "b318ba753fa5360ac289dac92d7028b8c0c6864b",
    "sha256": "67c494e2071dc59f5aae626ee7fb52790833d0fedfc057627973c1f8494a06ae"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/actions.ts",
    "blob": "8cca4bb5b500872c86691852bf829ef25a1324cd",
    "sha256": "5d346d8615f8351b429cbcedb2817d55808ade7fe4c5ac4e93f9be56f1e20c9c"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/client.tsx",
    "blob": "afea2ec06e87737393d0ce46b19ce636cfc42b22",
    "sha256": "da9b638a304347da1da8dedb29c2fcc8709b866f4d728d9a9add3a5f190fe7ff"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/page.tsx",
    "blob": "e153c73b257971f38d2bd18f108c622fdf297aa0",
    "sha256": "c70a0c461f4aa461a5fc732a5d4a142c78d29d7e5e9948f4e9bab4c3e589a994"
  },
  {
    "path": "tests/worker-a-intake-20261115/source-and-compatibility.mjs",
    "blob": "e08d469c6a76c0532e47dbf73e1b0cd7d88496ed",
    "sha256": "772ca0dbc0c96bf19bd6ee27eeaf94265e28c13fc07ea276cab39c127f474e1c"
  },
  {
    "path": "tests/worker-a-intake-20261115/successor-admission.mjs",
    "blob": "3ef9dc6b00a7daf757a799ba9ad42050a388e26e",
    "sha256": "6bf3b64542ec0f64cecdbd2f500f47234cf3a8ca603a1ba26bddcea8e9617a7b"
  },
  {
    "path": "tests/worker-d-shared-delivery-20261115/acceptance.mjs",
    "blob": "61d67a7acaecad4ecece913dcf130c49b81b967f",
    "sha256": "2eff8ae85e08de3c542a7b31fb0bc9836b90ee7de3487d5835a51114a55063b4"
  },
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "blob": "22b12551c55b8f500f38ddabfb7bba5381575539",
    "sha256": "018ac07149492c2e788362b6c0d03ce6a4c407bb504bca91615a96daf803370b"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-publication-transport.mjs",
    "blob": "cdcc32bf183e8adb395a3b294455ed9657add750",
    "sha256": "281c590fe73cff1fd466fb428286d8a885ef3117ab61e4b652fe77642e3d32ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.mjs",
    "blob": "51894528599103dd5341d229bbefa18e46e395f3",
    "sha256": "6cf61baf387cbaf12fc24618e94e9279f65ccf3f55af47993aedd55ea5022d92"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.test.mjs",
    "blob": "498301c9581d3110467ffb07bdf8821565213d65",
    "sha256": "0ff59e5258f722bbb0e309856aba4dd82ba3df8ebcff8f425ba1327b6cd6c60f"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-claims.mjs",
    "blob": "1d38f116c6329c1d0896d904f9e2599aa3db2770",
    "sha256": "c085049403c9df4c8e675f7a8cf9d6b89459ac5572dc6a21d1f23bd2513c6e50"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-batch.test.mjs",
    "blob": "4a0755885d17f7e341738188d679f2ea451c52a9",
    "sha256": "d41130285b42a4c434816bfe9d980a47967beeb4c81351e0d0a3bf53445cb514"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.mjs",
    "blob": "0de686169f940425a46253bba4927a5c7b0a03e2",
    "sha256": "38df96a9ee234e6abfd3a8605a5f64883ac24485ca3a87f11c983a271eecd956"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.test.mjs",
    "blob": "ff56978337dfd54caf33382ff203dbbb318d6d6e",
    "sha256": "fed2e3f595b363699381c42a42491b7e2e81fee15ea9f363fc1066f3c9e90715"
  },
  {
    "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
    "blob": "c122d7962c2a4f93e2209f4b5b0304c341c04a0e",
    "sha256": "944a142a786b356361f93bd3f1de72e8982d3075615de392f0d22b6dff3fbb9b"
  },
  {
    "path": "tests/shortest-publication-20/frequency-presentation-lineage.test.mjs",
    "blob": "16251d9a2becba514c7c78977907a8cdfc35e32f",
    "sha256": "d8933b891a2b8d74f4ae71dc0360a4ba3b7a37dfad13cbde07672c9f59f37199"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "blob": "83b6233bf5fc03bc98525d16dbdbc9c1478e38e8",
    "sha256": "3460587b2da10feca6c8893a270ed5cd457811ed191a08f6b07a12183e8bdd0f"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "aec721c3835418559a6046d36157513122882e62",
    "sha256": "40186e034f0f6c679f271deee5746afbf62f58ba2bf4e0228b58178f9c84f552"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.mjs",
    "blob": "cc099cfff14c79cd57558e6a8c873a8c13dc98cd",
    "sha256": "60a4153d25a84758e0f418f639a54df083ab4fe050eb6fb57142eb7c56333e9f"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.d.mts",
    "blob": "a8aea9fff6eeb37ac205a4383532e14895437256",
    "sha256": "bae4908bfb29bd5cd3c3480c76c12e913f8946dd3d93f155529b85c54ada0b62"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.test.mjs",
    "blob": "883fc969ac6fa9ce4ff43f0c09c0326bfa02e0d9",
    "sha256": "946f1b3e1996c62a8d2a790d244732a1f44571be10ee3d68b4b6eb190cb2d39e"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "2bf9db9747fd26b4e9d4fb03c512a12df514b3fa",
    "sha256": "cee4d541c258f9053122467e2ee6be7a2ffde4a86f983755f7e31fe435daf183"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "c6aff9eb7f8cbf3f26cc78fdab35430f1d7ff327",
    "sha256": "305b63aa47572deae71c1ae19dc33b0150ab8c2f717a210150a3c699dc0ae378"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs",
    "blob": "887f8c7e7b144c2d0e3e1973876a448ee68a032c",
    "sha256": "d8b1597ad1490d992eb82f84601bf0dd069634998ca005de0ed1679d91e11b38"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "0bc2f6b1bdca507b4a035169a4286f14ce8b4696",
    "sha256": "7902d0f3d3ccb57809181857a2b34a9476d1148e96f9ee03ff870aee017e962f"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "12d39ae6e52ba1d71d883f9658ad6a39d8dd2190",
    "sha256": "9f0c6c952cddf8f8c5e470d5b3f1c2630191b89a5bd491c19942010d12e12343"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "68db41805b5daa9508a884cbb032e1ffe4eb02a1",
    "sha256": "a91146bba31575f41121f5d51bd1df1a201230c5c864a4db042d7cad12e03fce"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "a7c373f6f7bba7208c9f057ef21eabf4064fb910",
    "sha256": "7be5b394b7323c78c0d056178a3d7b3c4f06c081ffe64a0bb975aed6262470c2"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "401688f1d38abb17af88275661b0478ed3f9dd61",
    "sha256": "e7e69fe4f56e1f8af32dc508c1f9994cf2bf9f30ba40c049efbe6c4c8ca4ada3"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "bc3980cdbbd0f5a4b74f1277522d942a4f12c86b",
    "sha256": "ed9a98e3bdf0b84879764a997e0f945f973cd5d92625034871b67f6abed6e1e8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "c448f3ef12ce3555204b0a1afd7ffb01070d619c",
    "sha256": "d6475cfdf00c6612b7a24501186ed14fb96cdc45f2a4de5b4c07eb92c69cd992"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "0f82e7a009270dd975eca27d2c4886a7576c2d90",
    "sha256": "e22fc316c003be79adb7b9c545651123aef00e39bb0a3265d9004a78b05233ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "b5a331dd21bf20579a4935f9172d7da6a03bcc1c",
    "sha256": "3894dc21a1f05312f53ea95099a16e05c96e241a7bf4f94d77d50d5e7256c8ca"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "cee0d8f2b61b5448992f4aad21f0083f5fd48ea8",
    "sha256": "d18b216cc7f062b8167423b826b4580c1d23b66d2ba306b1ff517b1d70f8bcab"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "0518d1ad29770456c0e3029aa64247c1868b1646",
    "sha256": "ca5e8f568cdf9b841d40a14aaf03c4dd16778e8990ea9ebacecd06618ea8c29a"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v44.mjs",
    "blob": "dd6284ffb78b0d850ebc4f5dbf4521d7ee0f638c",
    "sha256": "83b5a238483973d1f532671cd4c62faf8ddf80ff5227ea914254947ee16c1c7e"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority110.mjs",
    "blob": "66d7e12999c4e41d91cacf1c8c8dd58db02cf54e",
    "sha256": "f886066f8c9118c27b5cdd160a7591e3ff8d352fe9732e94c6b3d41a89decb89"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "98bc441b3a5b8d49d3b006f735f3b5774a7b11b3",
    "sha256": "806fbe83435a8cb94c6ed257cb899fda34fa28c94e92ba49cb49ba8366bff23a"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "dd7c33740eb85ca75780a7773440b4ccb56ec073",
    "sha256": "cf0cc8575cc39518a4d62608dd118d7cf966c26d8d4046cfa74f9e44a5f2c08a"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "ef9d269377a971ce27bd83ecbd4e1e4879fd1351",
    "sha256": "027f9ceaf7f282db8383d0b2af1eca6e85131159003207930d60451e8bc9a6bc"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision111.json",
    "blob": "f8ed64838490f7b6becbab0475af850a3809d7fe",
    "sha256": "346c68d4cde5accdceb143e9be93272ea0bed5c31db0a725ba979ac2c54a787b"
  },
  {
    "path": "src/components/geometry-worker-b.test.tsx",
    "blob": "8b95ca0396d4376fc150e89d1ae2d933f21fd320",
    "sha256": "f4486dee66b972f2f810ba22a0060a35d01723db0dac068666c7a4220963248d"
  },
  {
    "path": "src/components/remainder-capture-successor.test.tsx",
    "blob": "4b65125f8150a3ad81e56f4483d6eecd455c33e1",
    "sha256": "e0f78569a7c6d86660920cd5bb10edf1347ac592b439e553c8f1370b9d61c90e"
  },
  {
    "path": "src/components/remainder-capture-successor.tsx",
    "blob": "6131ce1ecfe23ebd2923e064d83222aa6c093cd9",
    "sha256": "7f357fa76eb011cb02ddaf02fbf05535345be9ccac08444920e0f86c3cac8728"
  },
  {
    "path": "src/components/science-worker-c.test.tsx",
    "blob": "d8a89253ac37857777b2de1c38c48c6a7089c02f",
    "sha256": "3005f17b71724434f7f5e6e6ac7193a643c50a615a661188f6f9c3f94aa36fa6"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.test.ts",
    "blob": "9a61627b6d28b0d0f4d49dcc4343df0652a99e72",
    "sha256": "492eaeb5d6832f8c5f3c0537639e2624438bb9566dc62f567b95e653e0075649"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.ts",
    "blob": "10f8a1d423c591db269763c8f7dceb39a597f22c",
    "sha256": "b68c3fd1147c8ae4c74c41c621edcae6b8bf053cd93ee68a5788445269f2424c"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "b14e4db26be870018a9990b4a76b4783b9bba1b9",
    "sha256": "06826390c1577889f9967cefea723d953266f450555c9dcfc6705d35c940e313"
  },
  {
    "path": "src/lib/calculator-factory/completion/geometry-worker-b.integration.test.ts",
    "blob": "e5eef2029d4ebb095f741b81bed8615bdb3b7820",
    "sha256": "8dd4e8541c92119ce6961c224de883fec9d6c93e9331d2aeaf2565b3d2232f7d"
  },
  {
    "path": "src/lib/calculator-factory/completion/math-worker-a.integration.test.ts",
    "blob": "df828587bc6816011447650d1be40ec8df5f006f",
    "sha256": "4e04f82f080c8d881dff9a542c1efffd29fefce56fb5df17e82838a1e13946f1"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-business-recovery.test.ts",
    "blob": "28bf203a165a45be0b45c6b81f7db8ebe6973e5b",
    "sha256": "ba57742167183f93c47dbd733ae4671d02328d0a791acf55199998bb95931b26"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.test.ts",
    "blob": "4635e5a3eeca48dc68395e95a39ef543f183ff74",
    "sha256": "ad70b27149948394142983a684208ef359d1cef84af391a599b1e4a5818b2288"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.ts",
    "blob": "944e516bf4455b28ee36f9fbf421d249b9bf7165",
    "sha256": "7f13a8e54c2424f55266c9be9f582a28f8de7a2eea279b16fb3203e470a26305"
  },
  {
    "path": "src/lib/calculator-factory/completion/science-worker-c.integration.test.ts",
    "blob": "b14ed8a511ad3b506236e55ca166c2ff755253b9",
    "sha256": "6e29656b7b47389c10b87bd81e5c60fe054297d91bf05cb9f388f73efaabb104"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "50610b57009a29566b55b07a1a15da884d905238",
    "sha256": "cb9633181f361c1a17f1d8399be51d94c4ca633f2689622bcf48c92a37147a9f"
  },
  {
    "path": "src/lib/science-dispatch.test.ts",
    "blob": "126f5715739e1da84fb75035925f717958cbd6db",
    "sha256": "0265483737849a2f24c9f87cf2acdfa6d94007f2945ccc2c1e682c084a786e42"
  },
  {
    "path": "src/lib/science-worker-c-snapshot-verification.ts",
    "blob": "570db1a786743d707e76dd78907eae118b19a4b9",
    "sha256": "061c0b884ccbc6653c1760d78cfbf0ec5997d33e5ed609d3845f40de8a6d11e6"
  },
  {
    "path": "src/lib/surface-area-dispatch.test.ts",
    "blob": "623ad60fd2a0570deb8ec4231107647139515c81",
    "sha256": "4b80f99464536258ad7ea3b7e68fa452747798460ad92bb85881edb41383d0f0"
  },
  {
    "path": "src/lib/surface-area-snapshot-verification.ts",
    "blob": "27b4c02d01bb6c0534ce4081a2793fcafd76cbcd",
    "sha256": "41dc30b33754f903bdd7a05c8663b36140ed42707868c148ed8afeced5872f9a"
  }
]);
export const additionalStage8V44BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","0eb375bc79c8331f4b6250848c64d9036831e20c","103fe68fa45bedf708b6880bdc6f085eec3e31b5","257a18f2ebab091410129a2fcd58bd7edff843e9","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","56844ec40292b010bc89ad7371c2d0340340bafe","64c86e4fe5f77816f2b5b45ea2177ed56520b292","66d0bd6a24d816ddb77d72a5f17334aa48d3e86c","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","b4de3253bae372b7a0565c2ad8cd2bd1c5236efd","b9b0ae266d6c11cfc36cccbf010919f93fa5657e","d4a3f238e5142d168f86e7d1551a9fb262e7a968","d9b017f46616ee632f622e1bca29b1910cc87f4d","dc8544422dbb4ebccfc96e03431e64ebcf871fc9","eb0303469e1ad30017c11a053a43ecbb2b9889bd","f3cac16a17e99fa1ce9fd80475806436440239b9"]);
export const acceptedStage8V45=Object.freeze([
  {
    "path": "tests/calculator-sprint-20261108/historical-source.test.mjs",
    "blob": "dfaab5f9549ea7bc96e74938e2491cd3cbc0b208",
    "sha256": "f8de4a68a21a1aeeb92b96ad7989461ca99d9aadb41f9ea415595fee89ac443a"
  },
  {
    "path": "tests/calculator-sprint-20261108/first-two-packet.test.mjs",
    "blob": "b99bf3bfc6e15addedb882b472a1fd809bd0fe8a",
    "sha256": "e7cc5d76bf20d514bc5d47032fd38fb7204653ad157cccafa1dfbcbdbede430c"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-live.test.mjs",
    "blob": "9a0f0e3b074e4f1028f3e697a6aec3152ec90eb5",
    "sha256": "61bf13105fd6f36fe1d98f5e55f118dff206e5db25f101d11b907163ed9c92a1"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-live.test.mjs",
    "blob": "339b7559e06328d987e86ae5d4c26576fbdacd16",
    "sha256": "c4a5dc7ecaed134bcd197bbcb345069569ce6f8193db112b51867c49301cc2dd"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.test.mjs",
    "blob": "d4338c298759417ea142a8732711a57d287e32f1",
    "sha256": "cc23bb1d6218b11d9d870db8bea7bb37daa79ace326503a5b6d1823ab5668a5a"
  },
  {
    "path": "tests/milestone100-20261114/receipt-source-path-stage8.mjs",
    "blob": "582d5123a3f02874b0e4211e97230426a661e7b3",
    "sha256": "40a0ec37ea2ae4002a53210092b37145eca010c9d42bc7f0c0ae1f3d4133820f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-availability.test.mjs",
    "blob": "9891d6b007360880887dca4b5f5d0c43f58afcb2",
    "sha256": "0dbb7f2f36931d195cc3acc48c8119a05192ee4c5938a85927ed901b5be901cc"
  },
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "c8f43ce6524170d6274b09d0b9210ec58dc3d44e",
    "sha256": "6a7db26f8834f6553c29499606121656e8e5d8400ef9f37501718b62ba23ed6f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-activation.mjs",
    "blob": "14831f5376c3e1c91b9a8850f29f1a69c80d48f5",
    "sha256": "50dda9370da8b118892054f51deb274d5328f527e726b8bbc282b70ea160664c"
  },
  {
    "path": "docs/four-worker-integration-20261115/source-stage9.json",
    "blob": "de0c966029ffae0917c65395dedf7d7adda8b4f5",
    "sha256": "1aa535186df0687954816b388378b36dcb2297deedf8e3a56e0d956da7609afd"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9-policy.mjs",
    "blob": "b3e130c437283263ac7369d1b631243bcbccb98b",
    "sha256": "6ddf247c69569a88ac37361f29b2094f39ce2ae0cbcc82f0687b4bda4dbfb1b6"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.mjs",
    "blob": "0436798b76dc1371578f0e7560592a27a018bdcc",
    "sha256": "46bf9b4b109db763c38c19260919ddb17a0492f5e186b24b05177fd89bf9188c"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.test.mjs",
    "blob": "50d22ee660f08da9f6757b1627dcc657ee2eed56",
    "sha256": "78cdb2a01519dcb46495c8c5e32363457622cd0fa1744ffd33cf604c3541f901"
  },
  {
    "path": "tests/worker-a-intake-20261115/auth-browser.mjs",
    "blob": "b318ba753fa5360ac289dac92d7028b8c0c6864b",
    "sha256": "67c494e2071dc59f5aae626ee7fb52790833d0fedfc057627973c1f8494a06ae"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/actions.ts",
    "blob": "8cca4bb5b500872c86691852bf829ef25a1324cd",
    "sha256": "5d346d8615f8351b429cbcedb2817d55808ade7fe4c5ac4e93f9be56f1e20c9c"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/client.tsx",
    "blob": "afea2ec06e87737393d0ce46b19ce636cfc42b22",
    "sha256": "da9b638a304347da1da8dedb29c2fcc8709b866f4d728d9a9add3a5f190fe7ff"
  },
  {
    "path": "tests/worker-a-intake-20261115/fixtures/page.tsx",
    "blob": "e153c73b257971f38d2bd18f108c622fdf297aa0",
    "sha256": "c70a0c461f4aa461a5fc732a5d4a142c78d29d7e5e9948f4e9bab4c3e589a994"
  },
  {
    "path": "tests/worker-a-intake-20261115/source-and-compatibility.mjs",
    "blob": "e08d469c6a76c0532e47dbf73e1b0cd7d88496ed",
    "sha256": "772ca0dbc0c96bf19bd6ee27eeaf94265e28c13fc07ea276cab39c127f474e1c"
  },
  {
    "path": "tests/worker-a-intake-20261115/successor-admission.mjs",
    "blob": "3ef9dc6b00a7daf757a799ba9ad42050a388e26e",
    "sha256": "6bf3b64542ec0f64cecdbd2f500f47234cf3a8ca603a1ba26bddcea8e9617a7b"
  },
  {
    "path": "tests/worker-d-shared-delivery-20261115/acceptance.mjs",
    "blob": "61d67a7acaecad4ecece913dcf130c49b81b967f",
    "sha256": "2eff8ae85e08de3c542a7b31fb0bc9836b90ee7de3487d5835a51114a55063b4"
  },
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "blob": "22b12551c55b8f500f38ddabfb7bba5381575539",
    "sha256": "018ac07149492c2e788362b6c0d03ce6a4c407bb504bca91615a96daf803370b"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-publication-transport.mjs",
    "blob": "cdcc32bf183e8adb395a3b294455ed9657add750",
    "sha256": "281c590fe73cff1fd466fb428286d8a885ef3117ab61e4b652fe77642e3d32ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.mjs",
    "blob": "51894528599103dd5341d229bbefa18e46e395f3",
    "sha256": "6cf61baf387cbaf12fc24618e94e9279f65ccf3f55af47993aedd55ea5022d92"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-publication-caller.test.mjs",
    "blob": "498301c9581d3110467ffb07bdf8821565213d65",
    "sha256": "0ff59e5258f722bbb0e309856aba4dd82ba3df8ebcff8f425ba1327b6cd6c60f"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-claims.mjs",
    "blob": "1d38f116c6329c1d0896d904f9e2599aa3db2770",
    "sha256": "c085049403c9df4c8e675f7a8cf9d6b89459ac5572dc6a21d1f23bd2513c6e50"
  },
  {
    "path": "tests/milestone100-20261114/workflow-source-evidence-batch.test.mjs",
    "blob": "4a0755885d17f7e341738188d679f2ea451c52a9",
    "sha256": "d41130285b42a4c434816bfe9d980a47967beeb4c81351e0d0a3bf53445cb514"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.mjs",
    "blob": "0de686169f940425a46253bba4927a5c7b0a03e2",
    "sha256": "38df96a9ee234e6abfd3a8605a5f64883ac24485ca3a87f11c983a271eecd956"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-native-driver.test.mjs",
    "blob": "ff56978337dfd54caf33382ff203dbbb318d6d6e",
    "sha256": "fed2e3f595b363699381c42a42491b7e2e81fee15ea9f363fc1066f3c9e90715"
  },
  {
    "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
    "blob": "c122d7962c2a4f93e2209f4b5b0304c341c04a0e",
    "sha256": "944a142a786b356361f93bd3f1de72e8982d3075615de392f0d22b6dff3fbb9b"
  },
  {
    "path": "tests/shortest-publication-20/frequency-presentation-lineage.test.mjs",
    "blob": "16251d9a2becba514c7c78977907a8cdfc35e32f",
    "sha256": "d8933b891a2b8d74f4ae71dc0360a4ba3b7a37dfad13cbde07672c9f59f37199"
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "blob": "83b6233bf5fc03bc98525d16dbdbc9c1478e38e8",
    "sha256": "3460587b2da10feca6c8893a270ed5cd457811ed191a08f6b07a12183e8bdd0f"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "9994a48ea83a831a0159123da5bc377901fbe5ce",
    "sha256": "1c64dd97bee245a7b08e5e1b3fc9b32e8f6370fadd8619b8c213fa0e33a33c22"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "aec721c3835418559a6046d36157513122882e62",
    "sha256": "40186e034f0f6c679f271deee5746afbf62f58ba2bf4e0228b58178f9c84f552"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.mjs",
    "blob": "cc099cfff14c79cd57558e6a8c873a8c13dc98cd",
    "sha256": "60a4153d25a84758e0f418f639a54df083ab4fe050eb6fb57142eb7c56333e9f"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.d.mts",
    "blob": "a8aea9fff6eeb37ac205a4383532e14895437256",
    "sha256": "bae4908bfb29bd5cd3c3480c76c12e913f8946dd3d93f155529b85c54ada0b62"
  },
  {
    "path": "tests/parallel-source-20261110/source-lock-scope.test.mjs",
    "blob": "883fc969ac6fa9ce4ff43f0c09c0326bfa02e0d9",
    "sha256": "946f1b3e1996c62a8d2a790d244732a1f44571be10ee3d68b4b6eb190cb2d39e"
  },
  {
    "path": "tests/parallel-source-20261110/source-object-lock.mjs",
    "blob": "2bf9db9747fd26b4e9d4fb03c512a12df514b3fa",
    "sha256": "cee4d541c258f9053122467e2ee6be7a2ffde4a86f983755f7e31fe435daf183"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node.mjs",
    "blob": "c6aff9eb7f8cbf3f26cc78fdab35430f1d7ff327",
    "sha256": "305b63aa47572deae71c1ae19dc33b0150ab8c2f717a210150a3c699dc0ae378"
  },
  {
    "path": "tests/ci-rpc-recovery-20261113/source-node-owned-lock.test.mjs",
    "blob": "887f8c7e7b144c2d0e3e1973876a448ee68a032c",
    "sha256": "d8b1597ad1490d992eb82f84601bf0dd069634998ca005de0ed1679d91e11b38"
  },
  {
    "path": "tests/completion-first-20261112/test-stage.test.mjs",
    "blob": "0bc2f6b1bdca507b4a035169a4286f14ce8b4696",
    "sha256": "7902d0f3d3ccb57809181857a2b34a9476d1148e96f9ee03ff870aee017e962f"
  },
  {
    "path": "tests/completion-first-20261112/non-source-availability.test.mjs",
    "blob": "12d39ae6e52ba1d71d883f9658ad6a39d8dd2190",
    "sha256": "9f0c6c952cddf8f8c5e470d5b3f1c2630191b89a5bd491c19942010d12e12343"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.mjs",
    "blob": "15a5b84d5d765d93efc8994fab8e112cebb17bd1",
    "sha256": "2298f050e4e821379e13a9f256ee675b4ead53c57e7964f41216babe2f660c84"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow-claim.test.mjs",
    "blob": "e99d85cd0afc668ee7250ed129ceaef3aee43869",
    "sha256": "c6c0fcd84487fc79587a9013c4b57e2409b6e211c1f018263901f39866b52246"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "8164b0149375f55ee3fd0fbb89a1279eaeca1201",
    "sha256": "5aa3a850ccac4edf08069c2eba76562f7d9701d59f880cdda2cf30b3bd2fe7e8"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "535daf76cea94afcc56794e2dc4e3e085cd3f3c2",
    "sha256": "5d89c87bc9abffec6827f1f62abd0db06c4fda57cc1bc5d43a4b32c90cfdf3a5"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.test.mjs",
    "blob": "2d6fa0a4a60bd8d65885ebdaba8a268afd98281e",
    "sha256": "00607e87275356e89654a28601348bf147fadec569f298f3186b33bd202a4bfe"
  },
  {
    "path": "tests/milestone100-20261114/retained-stage7-preflight.mjs",
    "blob": "07ee678ef7c2057dda6363ec22977ab28b527275",
    "sha256": "3e40f5910ed554d01bbd668cab01651f11bdcba878c31f35f727cc6223f9029f"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "9f0e67c1d44f445167b989156fe43af55192182b",
    "sha256": "bb1bd8fc97638bc5c3ef6fc3674159a0d7ddcf8e128ffb7921e4f0f991e276c7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "68db41805b5daa9508a884cbb032e1ffe4eb02a1",
    "sha256": "a91146bba31575f41121f5d51bd1df1a201230c5c864a4db042d7cad12e03fce"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-prime-coalescing.test.mjs",
    "blob": "c2fbbb8d218a4b83dfc788082c7bc4b404f693d0",
    "sha256": "cceab224f239bd95db102145db81dd51c38fef43c7ec242135eb44e7e2ee3a1e"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-stage2-batch.test.mjs",
    "blob": "5ed0881aad6b561209c2b9dc8b09137b44dcbe03",
    "sha256": "c4c92772fe13b015e8837360a626c1eed37dc887c4fbc69720b31d8a38c5e914"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "031a4aa47f4a36260c298f78abb5adddc550f1be",
    "sha256": "40af65f2644a28bcbf6c51f8938e4dcf54dc15e790c97de0f36809b67f7c1a76"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "a7c373f6f7bba7208c9f057ef21eabf4064fb910",
    "sha256": "7be5b394b7323c78c0d056178a3d7b3c4f06c081ffe64a0bb975aed6262470c2"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.mjs",
    "blob": "18debb2fa853a67d9339b0af0bbead86f4c21e06",
    "sha256": "c194fdd88512e4f8f85e4133aa12701dd1c5ba2faada37240394aabd52175f08"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-authority-scope.test.mjs",
    "blob": "a37974f676035aea19f5ed0dfc987fb1edef931c",
    "sha256": "8b160625b887a10a661df15997ab11228448587324c72aac30ac309030a04f77"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.mjs",
    "blob": "4df2b52ee22a12879fac319d75eb53c1395b78d6",
    "sha256": "2ab8b586acfc016598a6bea3ea1a668e8034ac813e2f2b616a4702c9a905b2e0"
  },
  {
    "path": "tests/milestone100-20261114/authority-observation-collector.test.mjs",
    "blob": "62966545c468fb05e2776a1e2caa4c44a0c3b3fe",
    "sha256": "a2197ae2cb43f53d3e52dda60bfb8e30d32bfd8fe21f656992d7a5ea57858d67"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "401688f1d38abb17af88275661b0478ed3f9dd61",
    "sha256": "e7e69fe4f56e1f8af32dc508c1f9994cf2bf9f30ba40c049efbe6c4c8ca4ada3"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "ee9df73d4067f9010fc47a492a8ffba4d87f55f4",
    "sha256": "f298759f6b63826b0f2a9847b4865601c7f98c29312ff11cca8ad73015e31303"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.test.mjs",
    "blob": "6c33cb7530715cba08f20113ab5397805541e21e",
    "sha256": "f2cd2e2422482ebbee20bb03918c388371331ef4178ae9bf40b6ca4954e3fde8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.mjs",
    "blob": "8417f5de9c8f1cd822acba5469458fc5a60f82a4",
    "sha256": "0e079d63bd1db16385563f3b48c3e6d0575d6e65d944dcfaa93d4e9909f156fd"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-api-runtime-anchor.test.mjs",
    "blob": "c6f46080037c3eb692bfc569f15d92284765766f",
    "sha256": "29d1f797552adbddfacfbb2704c94f15e44e2d20349564fefd9f4f53fa855b7b"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "7673a9fba0b63d5778b49cb48fb186548cc9efa4",
    "sha256": "729d1d6004fbb569f1cb80433b9606120d6a202384c9873dafa5174068fb0f2f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-immutable-prime.test.mjs",
    "blob": "24b6ea53e70131cac14ab2e19f227d0ca9c40ab2",
    "sha256": "83e6e2aa897741878dfd40ee492ab51aba77249a21e331cff30294282fcc1d52"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-chain-prefetch.test.mjs",
    "blob": "b9c3e90c0ba82e313f7427214f382600eaed63b4",
    "sha256": "4223e360ef771c86b888e849aa505d92de2a506b3318a5cda1e44ba9ec84df6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-current-guard-scope.test.mjs",
    "blob": "5c8e635c32bd8f12deb9ca6f7bc313069aed2bbc",
    "sha256": "c97488cd3232f58ddc83ab5c0561cdf5ace437dcb2c3c2b0645ac100b04067dc"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.test.mjs",
    "blob": "c448f3ef12ce3555204b0a1afd7ffb01070d619c",
    "sha256": "d6475cfdf00c6612b7a24501186ed14fb96cdc45f2a4de5b4c07eb92c69cd992"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "0f82e7a009270dd975eca27d2c4886a7576c2d90",
    "sha256": "e22fc316c003be79adb7b9c545651123aef00e39bb0a3265d9004a78b05233ee"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "0071a25ec80b688d2de42a03385b17938003cce3",
    "sha256": "84f06ad635f357dcc85cc594f647d0a74f70b11eac869388ca3ed9fa396548f0"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "b5a331dd21bf20579a4935f9172d7da6a03bcc1c",
    "sha256": "3894dc21a1f05312f53ea95099a16e05c96e241a7bf4f94d77d50d5e7256c8ca"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-named-dependencies.test.mjs",
    "blob": "0b2949d615bb306f3c31ef8154be57c540e38150",
    "sha256": "a30c18ce93ba9c703483167bfb2fe0c9b6bcca16729decf08d7fb3472fe8c567"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-stage5-scope.test.mjs",
    "blob": "37f2b56e953937e8dff7ad4114292e8c04e5bbdb",
    "sha256": "923e2c75fdae7b59eddd71ff9d97d9e81c0114415818a20d2e1347edcd92f0ed"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "54c9b57a1a1754a9a42d9f4d2b62dcaecb1e3a2e",
    "sha256": "423bd3d87967f14a1068c5d118a2126aee9b712fde14c74c766a31fe1c42ddca"
  },
  {
    "path": "tests/source-lineage-bootstrap.test.mjs",
    "blob": "3dffa81756891cba9fded2adc8a813193a7a6bae",
    "sha256": "702c4c206e58c5bb7c0e6a406725a13afe5fc5ba8339d4a5722819560861d659"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "ebf7cd6c50bce555492afdc70b4029fed65dec3d",
    "sha256": "d941cadc609fa4749c56ad9e0b66a2d0278e7582711de2c186580276bf5e9ab2"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "45ba5823fe5782b9213926d1b557dd3358f9b1d6",
    "sha256": "d9950ea280aab2963e2e4faf9f5edbb8e3f9336fd3987ce918dec05d90572193"
  },
  {
    "path": "tests/milestone100-20261114/source-proof-capture-stage8-v45.mjs",
    "blob": "3c492164a90302c6ecde6dcde7e527129f4501af",
    "sha256": "f75faf40e1d67f4f32c869e9e14f97c746a26978d36a2fad8d8cdb2460cfa028"
  },
  {
    "path": "docs/milestone100-20261114/source-qualified-authority111.mjs",
    "blob": "a61efa9117e6d406fc7da9f7563fc7cf6a1f3a66",
    "sha256": "2936b041fdefb49a11216d0123bc5e1c9801ff346bb5dc9c796067c02872b52e"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "a489a9c5b935aeff355e5332f2263b8221213f14",
    "sha256": "b64b17224f7bf30b540c632809042767fb4054e9e6259f2df2df7b14b5146123"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "23b5bdfafafafc93eda7aea6bcdc0927c3dd7958",
    "sha256": "3fae408cbca7ac5600e6b9daf2a701123e98c2187de5b27e9115132c97ef5dbf"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "78bda32ddad0dbb23f569524d01a84706dce338a",
    "sha256": "0072c2e2c1a9b6df2d113f3a47afbb49a109473b40333d3e2425f4f763f5493d"
  },
  {
    "path": "docs/parallel-source-20261110/capture-revision112.json",
    "blob": "2ea875ed78ca4bc04e713ba34c6b9929c48dbae9",
    "sha256": "a69347d709e6bd525762bce0f50fce511e148ac6cface32ee1937c45912ce6d1"
  },
  {
    "path": "src/components/geometry-worker-b.test.tsx",
    "blob": "8b95ca0396d4376fc150e89d1ae2d933f21fd320",
    "sha256": "f4486dee66b972f2f810ba22a0060a35d01723db0dac068666c7a4220963248d"
  },
  {
    "path": "src/components/remainder-capture-successor.test.tsx",
    "blob": "4b65125f8150a3ad81e56f4483d6eecd455c33e1",
    "sha256": "e0f78569a7c6d86660920cd5bb10edf1347ac592b439e553c8f1370b9d61c90e"
  },
  {
    "path": "src/components/remainder-capture-successor.tsx",
    "blob": "6131ce1ecfe23ebd2923e064d83222aa6c093cd9",
    "sha256": "7f357fa76eb011cb02ddaf02fbf05535345be9ccac08444920e0f86c3cac8728"
  },
  {
    "path": "src/components/science-worker-c.test.tsx",
    "blob": "d8a89253ac37857777b2de1c38c48c6a7089c02f",
    "sha256": "3005f17b71724434f7f5e6e6ac7193a643c50a615a661188f6f9c3f94aa36fa6"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.test.ts",
    "blob": "9a61627b6d28b0d0f4d49dcc4343df0652a99e72",
    "sha256": "492eaeb5d6832f8c5f3c0537639e2624438bb9566dc62f567b95e653e0075649"
  },
  {
    "path": "src/lib/business/factory-nine-sharing-server.ts",
    "blob": "10f8a1d423c591db269763c8f7dceb39a597f22c",
    "sha256": "b68c3fd1147c8ae4c74c41c621edcae6b8bf053cd93ee68a5788445269f2424c"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "b14e4db26be870018a9990b4a76b4783b9bba1b9",
    "sha256": "06826390c1577889f9967cefea723d953266f450555c9dcfc6705d35c940e313"
  },
  {
    "path": "src/lib/calculator-factory/completion/geometry-worker-b.integration.test.ts",
    "blob": "e5eef2029d4ebb095f741b81bed8615bdb3b7820",
    "sha256": "8dd4e8541c92119ce6961c224de883fec9d6c93e9331d2aeaf2565b3d2232f7d"
  },
  {
    "path": "src/lib/calculator-factory/completion/math-worker-a.integration.test.ts",
    "blob": "df828587bc6816011447650d1be40ec8df5f006f",
    "sha256": "4e04f82f080c8d881dff9a542c1efffd29fefce56fb5df17e82838a1e13946f1"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-business-recovery.test.ts",
    "blob": "28bf203a165a45be0b45c6b81f7db8ebe6973e5b",
    "sha256": "ba57742167183f93c47dbd733ae4671d02328d0a791acf55199998bb95931b26"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.test.ts",
    "blob": "4635e5a3eeca48dc68395e95a39ef543f183ff74",
    "sha256": "ad70b27149948394142983a684208ef359d1cef84af391a599b1e4a5818b2288"
  },
  {
    "path": "src/lib/calculator-factory/completion/remainder-capture-successor.ts",
    "blob": "944e516bf4455b28ee36f9fbf421d249b9bf7165",
    "sha256": "7f13a8e54c2424f55266c9be9f582a28f8de7a2eea279b16fb3203e470a26305"
  },
  {
    "path": "src/lib/calculator-factory/completion/science-worker-c.integration.test.ts",
    "blob": "b14ed8a511ad3b506236e55ca166c2ff755253b9",
    "sha256": "6e29656b7b47389c10b87bd81e5c60fe054297d91bf05cb9f388f73efaabb104"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "50610b57009a29566b55b07a1a15da884d905238",
    "sha256": "cb9633181f361c1a17f1d8399be51d94c4ca633f2689622bcf48c92a37147a9f"
  },
  {
    "path": "src/lib/science-dispatch.test.ts",
    "blob": "126f5715739e1da84fb75035925f717958cbd6db",
    "sha256": "0265483737849a2f24c9f87cf2acdfa6d94007f2945ccc2c1e682c084a786e42"
  },
  {
    "path": "src/lib/science-worker-c-snapshot-verification.ts",
    "blob": "570db1a786743d707e76dd78907eae118b19a4b9",
    "sha256": "061c0b884ccbc6653c1760d78cfbf0ec5997d33e5ed609d3845f40de8a6d11e6"
  },
  {
    "path": "src/lib/surface-area-dispatch.test.ts",
    "blob": "623ad60fd2a0570deb8ec4231107647139515c81",
    "sha256": "4b80f99464536258ad7ea3b7e68fa452747798460ad92bb85881edb41383d0f0"
  },
  {
    "path": "src/lib/surface-area-snapshot-verification.ts",
    "blob": "27b4c02d01bb6c0534ce4081a2793fcafd76cbcd",
    "sha256": "41dc30b33754f903bdd7a05c8663b36140ed42707868c148ed8afeced5872f9a"
  }
]);
export const additionalStage8V45BootstrapRefs=Object.freeze(["054854bceed263ba59e8cd0052f1f3e9b1ea8e30","0eb375bc79c8331f4b6250848c64d9036831e20c","103fe68fa45bedf708b6880bdc6f085eec3e31b5","257a18f2ebab091410129a2fcd58bd7edff843e9","27f16b2db22d3953ff88b344f5842b98f92ed47e","28370a4c3f06f707a5cde46bb9f444f4eeecc542","2a59a85c6e935c43e9a5a71ae15c9954e4fcab42","56844ec40292b010bc89ad7371c2d0340340bafe","64c86e4fe5f77816f2b5b45ea2177ed56520b292","66d0bd6a24d816ddb77d72a5f17334aa48d3e86c","88de7068ba2674aab85df5611840c4b029ef68c0","9fa7614e903ef0027298ee6ac63be93bbae5eb47","b4de3253bae372b7a0565c2ad8cd2bd1c5236efd","b9b0ae266d6c11cfc36cccbf010919f93fa5657e","d9b017f46616ee632f622e1bca29b1910cc87f4d","dc8544422dbb4ebccfc96e03431e64ebcf871fc9","f3cac16a17e99fa1ce9fd80475806436440239b9"]);
export const acceptedStage10=Object.freeze([
  {
    "path": "docs/next-engineering-20261115/source/authority-retained.mjs",
    "blob": "0caf235df5312b62e950064057357f66593f29a2",
    "sha256": "81b736eadfccbf601b3780e70ad3d4134d889cf50cd4dc02e522fdb3a5ceb7b8"
  },
  {
    "path": "docs/next-engineering-20261115/source/stage10.json",
    "blob": "180fa2326628bdf82ea2563042161013e905475a",
    "sha256": "2d1a94b3134909d279b64195a7ba2da59cbfb47f3e6c20e9e21403feacb8f422"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "f4b3adeef257ca5fd3d997797f56999474dfd436",
    "sha256": "c0a070d557cd9b08aa08a29f7f381935c6260a04ee82cecf069c3b81365821b1"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.mjs",
    "blob": "c9ea0822620d4e1bec09f182392fb3dc3224d0f5",
    "sha256": "b26621da8ef5c78ab18849edaa4e45c9388276d403f7375365c707e81375e5f7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.mjs",
    "blob": "e753003d32276a39fd33b85f46e21e7eecbb2883",
    "sha256": "8aae6cb97feb7b6d22e7fedcbe653566ad06710bb5fd0aaca04776f3e2c36416"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-live.test.mjs",
    "blob": "61572e88721656b7e07443fc3bbdc6c8b4266a6f",
    "sha256": "9d1a784a7a8a43d3ce0c723080fd8f069e46688784056f6c9ac2fe33adb59b96"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission.mjs",
    "blob": "39d48e075c47222bd5a1d434de669fc46de9fa84",
    "sha256": "bfd54196d7687287b24ba2a3e6e3032ef12acc3f78c98391e8aa1cdfc01e816e"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10-policy.mjs",
    "blob": "e31cf599140ce1cf47e6edb754067b32a07b6e46",
    "sha256": "de7da063f8f835922111d1b0fc4b32802224b25531a5ae83ccadb4067df26a5b"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.mjs",
    "blob": "3d35871d0803ed8ac023e41ad018beb39bef1115",
    "sha256": "aae6ddc836a89a3b8fc1833627e2a3322c450b60eea7d274cd7cdb472af1b2c6"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.test.mjs",
    "blob": "d186e39d4f0bf82c97c46628fd7053bdb50a83b7",
    "sha256": "db74dd53e93224ffafd4293218bd810532881385fe9897d428a51e6e1026e2ca"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "cc626aba220552fc749f8be505e5d73e39e49c76",
    "sha256": "5d8f4c195f00114c53299c3c652e6796cbb7af8ea7cfb22629a147a4ad27ba55"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "386e8a9cd35dad416aa48b30e40b58b32e86ae3d",
    "sha256": "8ee21a2880c010b9239684782a176e5fcca53b1761a5a278fd98873779d23079"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture.json",
    "blob": "d5afa88a9e7ec07fd3aae8ac8bbd4b99981389e5",
    "sha256": "ec02b0fa2eddc4ff76909ede53cdc3246a0a02de5982a7998a19b4024af36a3a"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10BootstrapRefs=Object.freeze(["1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864"]);
export const acceptedStage10Review2=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "555cdb249c53d585186a9225efc1ed6b9bd50f4c",
    "sha256": "038e36a10664567f49fce9c1e8ae4c0ce35d7ca2f83949922078827ff1cfb4c2"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "2aec951b057898dcd297a47b7e7140e5fd8c5939",
    "sha256": "c3b1aefa06a983802c288e7090f3f80e9f7112d39b7c43d4b0d49e7938b222a7"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.mjs",
    "blob": "69458b16b689348dd95f3464fd5db2b635e4fa06",
    "sha256": "67b90ed8285ac050f97ca00525e03cda4cfa8130b58467a976016310d9d958d3"
  },
  {
    "path": "tests/milestone100-20261114/receipt-source-path-stage8.mjs",
    "blob": "e13cae911fe72a8ecb158230561fa2baa9e7a717",
    "sha256": "db26828b3ec33f23ddb1320bf92a2f744781bd7a09ed7651b7891bd282d2ff39"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "74cd0bc7e39c501c6b06f49b5a7a9b8076f6c01f",
    "sha256": "b7c479398f0edae2c98794921a80b8f0106efaad664ecb3a2640e30cadd9194d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-live.test.mjs",
    "blob": "c40b2cbaa7abc666db708b4342b6f7e62925d96f",
    "sha256": "7687529e4fe8e2a23f6bf9a45112513e1ee9757dc6a46ea7b45186d837acd023"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "f74237232f8b3928bd3d73afaaf686ef235aa52f",
    "sha256": "42f04d9d6a8a9c8b9af61e4db03a65781a960f55a6edb3efb67861900dec1e14"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-review2.mjs",
    "blob": "38951f08cd245fd52e6067644d26af742826140e",
    "sha256": "6a0d573bdb2934f52b018d9ebee0c30c8573696004ab2c3f0f10deb99d0bcdb2"
  },
  {
    "path": "tests/next-engineering-20261115/source-named-current.test.mjs",
    "blob": "6ddd655115f9e5ecdf5dea1e96be605df0ce0083",
    "sha256": "0d3cb40b41a657c69b19b86bb406feee54439b01913711580c5f270c21fdeaa7"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.mjs",
    "blob": "7f3fe31ac24866512b8f9388529b83a8d770e13d",
    "sha256": "034b30251dcc082910a15bb3fbb8d5069f39003f4f582a395246764785d42285"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.test.mjs",
    "blob": "e51a1b6d5c238940a82282eb628ff55e0f70f99b",
    "sha256": "4b0e0b2df070eef1235625c70ca0098f577388f8cbb17ad2077aa17b101d028c"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "79b0adc6c4e40297eaa83db56cd2ef5ab9184091",
    "sha256": "6e2a00d8fd8b64a09f6cc392fcb550de441838620e6da30b85607c516066b670"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "d87d5fda2cc1f9199e66223c34e889c556023e67",
    "sha256": "00a3ae1bf7a5e0c8c0afb420f280decabefbd342d2eff6d9c58d0b9fdf30dab0"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-review2.json",
    "blob": "1e7c33b4ab2a2f6053e8b7f6f82d33734602f61b",
    "sha256": "1597ab94e3b5f29e036c4a4e11040f7c4c8cf91c53259cc5662e87c09b0ab663"
  }
]);
export const additionalStage10Review2BootstrapRefs=Object.freeze(["38a495e4277fb7ec8423e9fd0107b4ccc599848e"]);
export const acceptedStage10Availability=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "b4e259bdaa539e0e49389ae897b1fc8c3d23af51",
    "sha256": "1eee101c5337ffeb6f2fa108cc39e684ab96ecbddf63010b9b3582955b201081"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "67d073d26bbc79bfec2a5254c1926568d2a3319d",
    "sha256": "a2f28b85b1c43cfd8c0649d8cd830f667b94f2f137d95409b07100fc47a541f5"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "f080fb680dc594b6f8b8910d9f0497468ac535d2",
    "sha256": "0e0b1a7e03d1add2b64af5c56f6f7a55097c012c9031cfca574d36689ab19ab7"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-availability.mjs",
    "blob": "9e500dd749a4b8776fdfeb7d9aba1e3fd19c71c6",
    "sha256": "d5891dec083a81ce0554ebac4e289f9d920c7bd28f0a37e3999f2efe3c5c2025"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "eb5b37a1c6a1847e91b888b7ed661da8e652fe85",
    "sha256": "b120b9e76b9f0dae9651fb0b9c980e7d87a17404ef4012b800b4f09f353b3c71"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "15b1d559d6e95348d811f1d03da09d18e27a770e",
    "sha256": "49a20b395380367ece803faab9eb72843a0533f12b5a2e1ab4cfb7c8868b9056"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "5a97fc3692572cdb2aae2ce5270e3af7dbff3232",
    "sha256": "32158e234d3e429da668d323eaa20e80e3eb1b91a74751538d04c04de54bc37d"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-availability.json",
    "blob": "241e50f5c57f7b474e42dd65b1276db89f410cf3",
    "sha256": "e3d1ed21bf620b8b6a78365f7e564aef6be91353bc8b21cbf00af8fe446224aa"
  }
]);
export const additionalStage10AvailabilityBootstrapRefs=Object.freeze(["8aaa1886a0dee4b7ae1bd6349078731139afd46a","31a5322591af546b732096008dea8408cca23f9b","7e65c1fe521116d247688b8f11edd4bab4af6f4e","2b74b7a5c81bbae7625451df4f7f082b5452093b"]);
export const acceptedStage10Deadline=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "8a6c7dc8218d28f8f1b71f6179001c7d99d73d87",
    "sha256": "a8a1dd748c9c9a4bbc096b14b5f44b4d6b54dd774d8de934b082a1d2d9578853"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "72d5500e09f255b69f5bb3bef234de597acd01f9",
    "sha256": "69d50ba17f4aafeefab21afd03a25a3ec5aa90598a4be91c389b7c7b75360b46"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-deadline.mjs",
    "blob": "4eae90eb8d0b86e3fe8ee38ab6ba319666dc9c23",
    "sha256": "c48fe42947a37bc84dfcf7b52b679411d87a563f997295905e45646fdb1cdcd9"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "a60f2b24f65681498c1b6b167a607b18052f21c6",
    "sha256": "d28e30326a83a8c6760f96d0bdf383d97a2d6a14bafc515f620bce812c6c35de"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.mjs",
    "blob": "243ec23af25796495e5de63821f931b02706b164",
    "sha256": "4222ae1f871c230e303999e78a5582c7fb05b4a3da1948f5f07b4f9f1ee25af8"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "ca3c537328e3b86756e7a8f45134a2c47c252030",
    "sha256": "39d138595fc8c208cd9212908b60f23e0909609536f4b71dd4d68fa0087efcb5"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "e496c76c1ca2ed933b8c55bc53083814bc309fbb",
    "sha256": "9032ae1e664da8ed6560054106ddc649025a6c39f218103d668c6b71c4371e0c"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-deadline.json",
    "blob": "f828617bd54644e65a0a5ae3d7cc0b6ee3ea41dc",
    "sha256": "d53434f4684acff7fbec5a1fc90f04c87e44fb7c147fa9e5d888b1ede6860894"
  }
]);
export const additionalStage10DeadlineBootstrapRefs=Object.freeze(["8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272"]);
export const acceptedStage10Lint=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "8bd29f814474610b395a44c22ae1a51d0efb0a50",
    "sha256": "71ba9e039104f92ef8a35a904cee5371b06b9219874fce4ceb15afd67ff1f8d5"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "2981bad70d492bbf3beef49348cd87b98eaada83",
    "sha256": "b28589c222aa6f751a862f48ce5fa6ea1b93fe1e4ad4fbc9c52a38dcae858a98"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-lint.mjs",
    "blob": "77642faa9fad85c39f285d9f153383c1e16b0888",
    "sha256": "9bd55d9c942c916622a83de91fe0c92a9fc0f20d8783e8dd87d82479f7241b79"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "5d6dafb0d6cc2126d2094aef7aaa7090d5ee9055",
    "sha256": "d50a54a3be6b4d77be148db2f9b41a687fd24f8cd0311b48acbde183f49d2d2e"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.test.mjs",
    "blob": "810e9559da00254048a88127bc726876037268b1",
    "sha256": "92d7b3ca5f209ca68ccb2e3baf2adf317cee77edbcac43a08655afa47b193b9b"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "601b22d4f9f908cad260203389992a2469e9cbb4",
    "sha256": "696818e4b419c1a790474d3524d5656412dbf8dc375412f799cf6cc934e799e2"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "1fe70360315d3601c128827dab4f0d6ce6715cb9",
    "sha256": "3dbd75ce86f1a21bfecf18e8ee2f881c5c05a25be6c25b821f71e6d1efbeb2d2"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-lint.json",
    "blob": "88052ef2b17951873a4cdf656231fdf5d6b187dd",
    "sha256": "bb090db0fbd62b285d04cfbad6b938c135be695b0c785f471f4d9e016ff398c6"
  }
]);
export const additionalStage10LintBootstrapRefs=Object.freeze(["e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","13298943d7357e4593c25772c3e7d9db118db623"]);
export const acceptedStage10Selector=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "16dbd5b771536af3015cec9abc88ce01d74df5e2",
    "sha256": "24be15b79feb2c1f7d15d5861b389fd36d3f41800c3955e8c85c82569acfd14e"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "fd2ce00ded12377e7770d84adec894a6b3df0b4b",
    "sha256": "d75858f47ea5402b36147675f22c2eb70c4db7a9c4f0e7e121b467a2e380aca7"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "b3f470bb6c6f05b7b81fdb1b27dc250473184297",
    "sha256": "abff56b798583c7b2bde30fb8f13179c998bdf921f7ca8f8989d0b3c404bf194"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "386a7f7336fa81dabc82220c5e430c31a631841d",
    "sha256": "b258019ce4ce6d1d27f945b501fb89f44bdfdb416f66cabbdfc09574e94216ec"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "17c0658a2fc0b120ea64adc5e96373e5df6c6174",
    "sha256": "e1401c13ca4f48eefc47ae3e4f68b6e9ba8926d09f9888e33a68f5965c024296"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "a35cedc14885d882c8569d42dad1b445e327c3a1",
    "sha256": "91c832b64246c87cba5a7fae568d6d108bf2efb35b83732fb45194078066aa29"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-selector.mjs",
    "blob": "ba8915f2f2c81aa4cd61f647a1c5cde5c0a5670a",
    "sha256": "59f8a3c6539d889b1bc3df12612195fdcf35d3eefc2581380114e8a2832ac438"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "dcf044c0800d223c2202d91a2253db449823e622",
    "sha256": "34d965ae3138720386553ebc054aceeabec0dbdca4c866edfbf018a02c29f59d"
  },
  {
    "path": "tests/next-engineering-20261115/source-current-consumers.test.mjs",
    "blob": "e5e594f2d33418112d01c5d0e67643befdc347fb",
    "sha256": "69585c6c7e4c8c5ab8f2f3ad285c4e3160e770cd527824c46851ce6072269c84"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "6e8b4c28e9f01849693f118203361a5c4d5eef84",
    "sha256": "350dc114658635d64edde0cfb3b527849776147943ced862a427b71645adedbb"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "f8ae2eea489482ee5b720263912128eefd624059",
    "sha256": "8a03e23813b1a4d7bf16d5fba1e893680108a55cbfd5a16d025ec6e39befcb4e"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-selector.json",
    "blob": "168625197aea0da4d4cafcf9ee4096d76d396ae2",
    "sha256": "9e1d98bc001874ff1472a932777b7ef6dea17a445655793693a362880ec1e134"
  }
]);
export const additionalStage10SelectorBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","379997d86b163f5dc7e95de76e26fa055361a2d1"]);
export const acceptedStage10Current24=Object.freeze([
  {
    "path": "docs/next-engineering-20261115/source/stage10-current24.json",
    "blob": "e2893cf2f8d2a89101b453fb0d08fa9d14597b66",
    "sha256": "45138ebbb7f879c74259f312395604365ac0411fa743e7f548f8faa71380fc7f"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "c881ae8963c6e7c2b13dd1f2c33921fc91def88f",
    "sha256": "d01b8104e0a8abc366551eb79f1bc9a69e50bfeed914d932205ca6adfc842390"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "64c0a0a944da33af686f727646083fd7feaf6207",
    "sha256": "1ef1855bb8ab780ce6a08055871c86eb887254cc4fcd23baa9c3999d1a0eacc2"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.mjs",
    "blob": "998908a1ffd61f8b28d84e4e5948e63c102ffe71",
    "sha256": "e99473e0487aa86887116f42f484c7626536f2f15abf6b22ee51f0e11ee35aae"
  },
  {
    "path": "tests/milestone100-20261114/receipt-source-path-stage8.mjs",
    "blob": "5b327a1b4738753e8d8cff9a7e5c6af3e59b78aa",
    "sha256": "48fab46d6c521a152caded073179cfb8adaef4e4fe5ceee03e3a30ae3bd434d7"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "ef3e4fa4ba9f8638b9014305d8d9ce1087b34bb0",
    "sha256": "4a839c55e9bf7417906a996f493fbd3572cb24112cb4b6ac6efc90811f947a2c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-live.test.mjs",
    "blob": "bdff224a624cd25c3295fe5ae2d95eea227fedbf",
    "sha256": "ed9dee7532b1f21886b43aed17a5f479a5643966f217a3ea4b9a9c02cd1292d7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "7b68584f5af188c71ac17aefcbc660d1f192a83d",
    "sha256": "4c6af61c75354372b29a2e3ecece2dd99812ed03b322bb3587944414fa4b80f0"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "1ab0e54f7b0ce7946539d8dbf1548a0f36caac24",
    "sha256": "8f129236b9f5aa0274b5e93353cc5ddfc3bc5612b10f287ee3778b658d2bd1d7"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "c1acfeb38fc57b4bfcb01d4c162b00726f28bcbb",
    "sha256": "8d45ae23bf03eba6c09dd485cff87df057af8d6788de1067dd632838b3955584"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "65f1d6130ccedf1976566fd4d4f405d990f5a58d",
    "sha256": "270e11a94fa34763a5e8b1b877377097da0a0ba6b4f30f277b90254ac0ba34ba"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-current24.mjs",
    "blob": "49e805addcb9eef1e19d898762002cc561be16e1",
    "sha256": "8e12b52912fae119c74351b598bc02233728ebe1417af970e8e546ea6e762bb8"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "353bc292022ba08c5a714d1d0a47f85cc87b5257",
    "sha256": "5ac12b1db7a8bee6b7594823b4c7744f5903c853dcca333eb340cc27a7090021"
  },
  {
    "path": "tests/next-engineering-20261115/source-named-current.test.mjs",
    "blob": "bb0c8540812121ef3420f679a7f4e83d24f990fd",
    "sha256": "32234d93f2b8619d213f6b9438980f45bab43d5ccda7e29c35d510d25003ad61"
  },
  {
    "path": "tests/next-engineering-20261115/source-stability-reuse.test.mjs",
    "blob": "3d89be0ad14daa474725ac621287fdc6aee0dc46",
    "sha256": "9277c3fa0976cf4a98a48e34f5598e9915679adb543e4388e16afce70efe4f66"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10-current-policy.mjs",
    "blob": "0ca4d8d91de91887bb93c909a09e1ca0cb92ca42",
    "sha256": "c6de1a71fa522b494c6f7b4ce13529b5abaff9fb3923c0b7740074033e049acc"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.mjs",
    "blob": "0291bb53d520de973579f4970817581734a07cb1",
    "sha256": "fb5b01ae3f01d04bb704fdb223bc4af37d1eed8287ca761b18a530819cfa2729"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.test.mjs",
    "blob": "7f6b0092cd9098cce3fddd4e17fcc8c9d810709a",
    "sha256": "574c1413d0899553c9c6bbd937704b894f2db5f3181908963b095b97676532e8"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "c2b6caacf26db70a883bdbd95eaaae930196efdf",
    "sha256": "00e903e34f5a0c30e9d1dd6f2c1234e254e48dac801b3d67cc85ffb4262ce503"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "c622fb27635b810a6274aabca47ec51a09e654ae",
    "sha256": "e0ff2e851af21b21d8000a4d44c14c314bf6b4078df78f422782fc82a461ec2f"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-current24.json",
    "blob": "0a0b763870b8f00a3c18ef1a0ad2dbab97547aab",
    "sha256": "2e85aeb3938bddba509a6505daabeac6fef36e748ac1edd472503b313dfb7165"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10Current24BootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a0c6ca7350d09f9b2d4c990871822567fd8b7586","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10NativeBatch=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "795eba024795c1753131a496b33f00539b0cb503",
    "sha256": "1d4a10785ccd19825e065820b9d78338a70311a57af229821e6e416d626f166f"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "4ee5fcafd2ed572a8b3b76991091f36a119f8af8",
    "sha256": "7f1e12b36b6b40880987a1e0707acc73fbf87f44b8bd403fa256e22a55d7c90b"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-native-batch.mjs",
    "blob": "e7a2803cfeb309d2dcba617a0a9f990add571a0b",
    "sha256": "9cc8180b13a6dbeb89dbaea31a838a09d5f3310a25abe2a8f1312e90f4687c7f"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "b9a13ad9d86b2a89737dc0b42329e60a77185dac",
    "sha256": "663cec54b515118ef84e2e9cdcf364d471f93844b18c3fac3356397ecdb506b4"
  },
  {
    "path": "tests/next-engineering-20261115/source-native-batch.test.mjs",
    "blob": "110e58af11940686e177481aaca95d3cdf4ad0a6",
    "sha256": "dd0e98971b9968f4ac0c992d0cace53d4da3992c9f3f3008ffdaf573d318ba08"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.mjs",
    "blob": "a6cd047e7f87cf9f6d3438c1819c068e5df1d988",
    "sha256": "e282ee592d2a2b943236abe4522bced7c5a4e4dd8cb131689ee0d7410860e231"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.test.mjs",
    "blob": "e4f57901cbed96d824bf3d5172cf6712931f8d72",
    "sha256": "a7221b0564a722cdce4faf641524cabf615af38acc7d68ffa4ce386711857834"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "e330044c51c072abd41524610d753952dc9544ed",
    "sha256": "77a13dd32c86c541abf626070dbd41fba7d65739d97fe4ff41888871161c5958"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "9e5850ea3a65f2d756ddb0fd5ebea4ee19b8390a",
    "sha256": "a82722f3749de8507a6c90a954a5511e6e5eac87c012ef23cfd852c580976417"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-native-batch.json",
    "blob": "be3a792cb81bc3ace497b0fb3d752a0c6eb66028",
    "sha256": "376bb595abbc7c7abd8dea4f71818a8633282a7cd73ae4d9eff9abe484943d22"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10NativeBatchBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","364497e6054e6d569464e217d2995bcf5709c822","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","90e046190c1a33717cebf488f8016567f12275e3","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10Wrappers=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "7848a0758264c0ef96329e97ce75910a650291b7",
    "sha256": "150ec5f621de8f270735ab7df294e661f973ce3a34e6db7ffbd18311dac8bbbb"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "34c2a5aaf4560eb4bd3b52916c578cd23f012583",
    "sha256": "d99851cbff782cc9e0b3d0e9e2112869468771bc6791cd8202c2f026fdec617b"
  },
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "4f53d01db0f3eec6fe767f5cf8f24f92c1032e5e",
    "sha256": "0e50ed0ac318ea0c60ea457060613174d10f280d70b8a1a5da5c0ad214d539a1"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "0e2f3757894c12b19e92d09a984aa154645f1c4c",
    "sha256": "94a3ccadd60377e589e7946b8b373a82339bcbec0a1d18aa6488765075bcee5c"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-wrappers.mjs",
    "blob": "479d93fc375f45675b2e3ea259c79e9830097d31",
    "sha256": "4000d5fd94afa36f31fcf730c1b4906b17f59e8929813059d1b6b5dea8d5425e"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "471d7882ee03af6f588600dc9a8fc2b2602d0961",
    "sha256": "cd247ddf657fa56e42c5d146996954b701126c8b13a0d3571a2d5aac12df5026"
  },
  {
    "path": "tests/next-engineering-20261115/source-native-batch.test.mjs",
    "blob": "0b79bce4d8ba8ff0dcfcb0af79186cc8e3d0cc4a",
    "sha256": "3dcbc5a02a7aaf0627689627275f2798742210780fba4891885dd7a4052a1116"
  },
  {
    "path": "tests/next-engineering-20261115/source-personal-preflight.test.mjs",
    "blob": "96f803dde32b604623c9ca091f9b66ab47414d8d",
    "sha256": "d2a121923eb58d2ff74db9068b16fe403139190e7e972c0aad091797955813ca"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.mjs",
    "blob": "a8c3268619969dff3f28fda6a20cb63d3cebe170",
    "sha256": "905aaadde170ab36b67fdd0028f19302995111c65c048b0480f5bec4c18e07fa"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "018660b6737ff2b8451379fca0d287521ac9f7d4",
    "sha256": "e1b165c80c99eb2f0f562e6f5e1c11c68aabd1d1d2fd595ad5aad283193a9675"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "b3712a6c32ffe7c1c0336874f7b079c4b03a1a0a",
    "sha256": "8be4a04ecd46c3fd7de7257bed2dd643d4960a88bb2eec1185073bbb62440dbf"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-wrappers.json",
    "blob": "51bceed51eb44c59f6aee83351938b0ae240388c",
    "sha256": "a4f5abe6ec417eaa8b9e22f105e52e8e446057088af56194edceb210ed7b4da3"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10WrappersBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","638d57b582ef62763f14f499d36092fb9a3025b3","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b2926982b5167c68814154268f937f2d76ab89b3","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10Private8=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "420d0c74a4c60d82d2f75bbd9972627a74db9083",
    "sha256": "e03c784a8cae615d51cf0e937b32389f05b8338e2826132ff04989d91c3e7456"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "c115597f667cc96279a39796e7e14ee77f03a33f",
    "sha256": "4c6d652b08d26fa43db46e61e229d4c2ab5fdb58ff3cf989072eed9d9a8ae951"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-activation.mjs",
    "blob": "e9132cd4d15f854dbf9ffe2ae4e17ec82343c5db",
    "sha256": "49bb8000ce96011610fdd601203920844e39b4e8e83e2e9a88bb7ee2525dd6c8"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "fd618805b837ba10ca4b122b91e125a452860b6e",
    "sha256": "ea3e487a05c03312e84dab37bb6bf721dad17db94d85bba0495270f4960e88c4"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-private8.mjs",
    "blob": "3d9e4d78c3208c2906c0c5aaa0619b54d9a10cc1",
    "sha256": "45e893504882eaf01c5ec79d42de629f43271bb5ab43316c355356f48e44e034"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "55db651ab08c9d68f520ba19a5e76537f2997007",
    "sha256": "f26b93af93fa413c5e6f07f309520ef9da1143844efe42a8b14f88f147622db6"
  },
  {
    "path": "tests/next-engineering-20261115/source-private-stage8.test.mjs",
    "blob": "c0bed8c36f9bbb5006750245be94da48c9f607ac",
    "sha256": "fc17b7d551de59b1674df2b190b10e5e936b56855769b1ed1a7079a27800e8bd"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "ed3cc38902bc88939cea7a65bfb05031d2880aa6",
    "sha256": "5f8b68bba4f1c954a31f5b795258103ef2424b825c00d43ebdbd60daa0d926d2"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "b503898f8aa4e924791ff1eb0b876e786644be2a",
    "sha256": "c7611eaff519e2a92113e34ffb0d590d6c6f4cb94f70d5f8513755b51783c0b5"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-private8.json",
    "blob": "74f262fa920f235234d4b9a4d6cb4092de5ed367",
    "sha256": "95825cc7a2a6c2bc162947d69198af908dc0fd7518e3d2abafc0c579c8789279"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10Private8BootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","6b0efd6624792292d5c03d8c3256bf09ca5d82a5","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","9f2967b566889bf8aac2ed7ce0c459adf706764a","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10FreshAuthority=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "1ad40bbb07918503ef9c452db031b5d1be739cfa",
    "sha256": "afe2732cd342dc8068c7febe3a1d90e47523a6af43d6024b84533245271b4642"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "0fd28a297d76669bc561dd0ab5b085164e97301d",
    "sha256": "ed218ff84b4253d7a210ab3ee8087728343e0b7648e442bb58a3095feb04e9f1"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "c79aa2029551ebac11eb4b1b1b9e2c48013e66cf",
    "sha256": "b7cd6a3ea3588e5433e49761cf7957ec84a1fc60251dbc0d206ffcc16faa28a0"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-fresh-authority.mjs",
    "blob": "40fa2f6b3fd0d19da9b52852095234f1e26b7ccf",
    "sha256": "da2aea3a641b3fe4e3e3634d60fbc4ea1b073ce906b4456693adca56b8ef79fb"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "184df4b792125e9520af2a1cc2beecbab3ea9278",
    "sha256": "280992ef0e1df612a50d394a7e2da210edf97606757d87aa3af02d14904e8dd2"
  },
  {
    "path": "tests/next-engineering-20261115/source-fresh-authority.test.mjs",
    "blob": "f973c85ad8af2aa2231d1db722f8c94d567cce3e",
    "sha256": "33b1aeee05aba09bd1ad84e64019777f076bb5fc367132933360ea0e3c822905"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "5d7b8ccedbe7aee86fb94d15023689d8f2d7a254",
    "sha256": "eb683581bd9c27d223e00349c147bbe42524c4f738051158f672defede0e85e2"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "a1a093c9e4a89bf7ab1b146aec4d04ddf592c036",
    "sha256": "c25a4918de86c7009d3a34ae5bc44947a8b2e1d495abbdc9d31ee9971c230f88"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-fresh-authority.json",
    "blob": "a858f062df2277673c71f2aeaf012c5923b14347",
    "sha256": "dc5ec593951378c14f6f3297f20c76db7df71fdce04ff17822e8f558fb320b79"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10FreshAuthorityBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","2764df86eeffbc7a6e6874450897e128adf1edf7","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","47e47282414aa1e91804456e290193f4cbdbd579","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10FreshAdapter=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "2e06636d044d8dbe72a19d186711caa7a871bbae",
    "sha256": "0c88e61e3dc495a364861f319a2d5df400b71332101760b6c06f525115df399b"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "2c02de0b87903940539fba041659fe8424fda7b9",
    "sha256": "c56bfcda937b2b3abec703119b01fc6ebcb3aa6413a08bf2ed144fc7720178d4"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "affe2aa5f1c6109bf85d645fb43797d3ac966f19",
    "sha256": "e6f259f81c204b5c4670b8def52d28578023a67da07647d3a9b2bda593e76a05"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-fresh-adapter.mjs",
    "blob": "ca4765053abc06cec06136fb6f725822c454b9c7",
    "sha256": "736e1b7ca853b1366f1af8c8638831452910024e392d98a39373c9d8d55ea4f7"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "45485d44e8ea1632e7b93bf3222bfcbc52e4bf7a",
    "sha256": "de0244e509c1965145bee51cd0a3020127557cf7348f062761123b2286c6cf50"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "f78d7006323c01085cb0a27afc09fcadceb76604",
    "sha256": "1be5dffa863b452e734e5a910e2dd16e757f0b51db01b84713f14ebfe8b29db3"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "5041466a65105046a0370dbe8673d5a2e7cce908",
    "sha256": "c3c9ce27915d25d5e1d62b11ebfafa87c5fd066b58ee1607ed7f32879a2e51f9"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-fresh-adapter.json",
    "blob": "33ef959400f3919d474471094e1b83e15fe6254c",
    "sha256": "f5b1557a2def8d635714ca7bb4b0c09f9444cc0f8267895619b4803c6d9f4f19"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10FreshAdapterBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","48f80ecd41ca57e139cb5db694afa8da4add09ef","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","ba5b1e5d854d137c9fabfeb782fd91ec43e7d2e0","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10ReaderFixture=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "97e05f6568ac66767363513c68bb49f3cb610104",
    "sha256": "ce6233bf2b286d52db2a21251e4a7c04f6ba3b7ee5c10ffe443d96172712cce4"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "dd8227cb0685fd27f1e24a1361579b064f86ab88",
    "sha256": "1c898afcc83c86c0ae5899812c62b980a797b07de0a981e5990a4e939597947a"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-reader-order.test.mjs",
    "blob": "e6152b90734742e9953c13bacdc00a71325fd5e9",
    "sha256": "e61165ace4b8813dbbd8b469395974746325f53aeb4d626ac3e4d5d38b690a9d"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-reader-fixture.mjs",
    "blob": "cdbd2802281cba684976fcd45cdf74018848dc04",
    "sha256": "844fc9fbb575e94ff17f2bdaa08f0e43af8e33df833cf910a5f0489fb05310ad"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "ce9710709fa9fcbaa2daf06de0758ce087d1bb90",
    "sha256": "4fb3ef0cb6de772d79aa8e732569c7b8506c79daddfef55e845b8d6cb5f80cd8"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "86a3060dd6fa88125128638afe924a043648605c",
    "sha256": "514c7169183236296498c11c6fed367d0ea610caa352cbd055d18abdfe1d6676"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "622803a7bcf48af14b55c290c7ea038fa2d761a1",
    "sha256": "736355b9975f2c53d2d356b9169903792c211375e12fb4dea60790b2fdba0aa7"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-reader-fixture.json",
    "blob": "a07ea59376e448c25b5d44c098479d22109261d8",
    "sha256": "b1e563a3b3fbae983fdc9c26098e33be9ee70740932af869a4a5d90e9e29f0b4"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10ReaderFixtureBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","5293f51bb282d6f4cfc97c5c6a170340c7810c12","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","bd852c1459109c120e60c7fcc8b9221ac1d02dd9","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10ImmutablePreload=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "725ee348ae7463fdcf6f49ec83a11ceb93664a6a",
    "sha256": "2bcb3ce7333e4824e62eae83d1cd359c99bcf8c8d4fa92f74b3ad5949ee8e1e7"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "2a4c08df4258ebae20b6a0c25e9233557107192e",
    "sha256": "257270b757789d1e23504641f01face8f96f98baa1e3c6c68296695ce5278789"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-immutable-preload.mjs",
    "blob": "097f8cc1d0b2312a32947acba4ca992df8b13eda",
    "sha256": "6f7e009f7f07d8f4de15dadb713afe59305a234dbae189dc76c84b3d06e50e6a"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "1d6bbb2c94fe8d5d756d6982c5a0888b4235912c",
    "sha256": "f023515c9010b7a843e94e287751a0c8344d2fa02f48c18c83cfc6e025110a14"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10-preload.test.mjs",
    "blob": "7d7e7d8d4c091e7cc9b1d4964f0a959c713e97c3",
    "sha256": "828bac9681bc157c2d56b1f79cd0abfdd4431003391dd53ec60cf472fbf1c88c"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.mjs",
    "blob": "983eaa0541c2a9b582a9277574c3b3946e3c4297",
    "sha256": "2d52e8445df7dbe527ca61f3b0728315de78489cdc4c5dfdd78a7241affeac9d"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "a9910255b57e91cae2bc9ba9f35712885e4ea561",
    "sha256": "6003dc0cb811e5578b76705e53cae731f8bfbaabb3c4b965ad9084314154e15a"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "2c210c6d75705a6f4b47249cee6a2ea0276513c8",
    "sha256": "814a2829b883c7876bd13d1f81e8f36b379af89f08ae55a6e26d721b79ce8a06"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-immutable-preload.json",
    "blob": "9c8ded7abc66dbea26b58ca99ec814bd00a87328",
    "sha256": "447b99581f789412a6cd9fca7fc447dff9b4a9faf81a5016c33c07c1f23a8474"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10ImmutablePreloadBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","241f8c2e7f0f1fdc0a3e1ddada6e243beef491db","26c222457278bf69b4f351d0cc100de47ca9eb33","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","724a7ce88843ac74b6136952c27f38e0b38f00a8","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10CanonicalHandoff=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "cc8670e346b2bfd6911899aef6494d4be9e3dd6a",
    "sha256": "a75e83afa116c9fdfaa02026ed66ac8b6091c2cd8c07882737addbbc8ea0bf4d"
  },
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "ec618b419b1f2e1169bdc5fcaac045df6d0203fa",
    "sha256": "ad1e1a720897adcc0286922eb8fb9c64658ef3de3bb80a83aee351a70c1c7298"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "1fa854cde019a710cfc0be4f14eb514d71cbdc7e",
    "sha256": "350023c104ce0bf6a4a80c823f9b91d4df8bc0e80179478247f2ee711606a598"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-activation.mjs",
    "blob": "1d9fa9ac4fed3d3b319f72e820115d21dcd82986",
    "sha256": "d30b999f99ecaf16e63d71d01b3874c3055563acb91187663d4088aa5a3563b4"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "64f7aeba4f784ddd68eff4ee215d895e538f0409",
    "sha256": "9d1b98ec34260fd880c1f42747e7d3e68226a85329545be5d7a96b45372785ba"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-canonical-handoff.mjs",
    "blob": "1080c26aea8dea474f8a121a4c8d47d5b7d620f9",
    "sha256": "5b0a192ce7e159e0c7f0e61fa47461190061a7cd178758cde0f8c0e3b4300dee"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "f5d6968e2dda1bda326569c5df5c5628db4e664b",
    "sha256": "fc04ef68a56767579e252441e067fbb31e3f3de388773155c47e2e391cf9672a"
  },
  {
    "path": "tests/next-engineering-20261115/source-canonical-handoff.test.mjs",
    "blob": "8c795c41be8bfc40dcaddf31ce0c4525188db2ab",
    "sha256": "2ff0a58d4e4114c0460905b01701b1ea1b3f003a4608478d38fb2be653d1ddc9"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "f5e5a7a4b28e48ceef4103a825d9fbd9898bd000",
    "sha256": "10e06d792d57b9f7677085c3465645821cc59a7848051b86b9fa671e009ac829"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "701ea1036c001cba91a23454f0f2188dac7c2e17",
    "sha256": "bf0a1b2a6c73ea89c0c2c4008a7fddbf4bd9f0bebcf6874867686f4fb41dd31d"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-canonical-handoff.json",
    "blob": "8d19b22692fed607d8ac405c52e996ce8b435dda",
    "sha256": "9b3b4caa4b5986ba3a8c8d46929b2ff1413f02b786b7da7b99b18d1454da01d0"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10CanonicalHandoffBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","4b7f9158393f6f6b52867e38582c6d019956a296","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","c235845c549bf5deb22bb0715a054e8e9059f5af","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10HeadBoundary=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "9b378358f9395eace1c1dac839e142bf47c9aeba",
    "sha256": "357218c4e8dd496ace89068b9e4c536d48efb7214e21f010023c29110b858dc9"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.mjs",
    "blob": "18c0fbff1e6a428a3047dd1bc4b07533b82d52c6",
    "sha256": "58dc366eaebe91a9490be1d229b8c30177d6a449b27db5ccc9db20418bb48907"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "3adc048751760056e07d9c435a7b28f63f7d6594",
    "sha256": "19ac7afa9553f517c2aa4717889eb80ddfc51442012825d69cb17108b3039f36"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8.mjs",
    "blob": "ac07833f91e7f7187933179abc28b9c8bbb7ca74",
    "sha256": "dcad3218923ad3d469896185f88f0dc2c0abe767579f8f51577e30d14bd59b58"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-head-boundary.mjs",
    "blob": "6c97ea92545b06595a8f17c9402f868499e5d336",
    "sha256": "0d399db814f6dd9b4c82587cfef5883d931fff2a167a844141debae9d649dfa3"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "d872173c10d91abf91812d3eb58cbe9b464069fe",
    "sha256": "083cd2980fd12851b9637cd4d226c9c028507d4d00057373828cda5c24adfde5"
  },
  {
    "path": "tests/next-engineering-20261115/source-stable-head-boundary.test.mjs",
    "blob": "d93335fa316052bb21478e94838e2cd577e0b5a9",
    "sha256": "6dda7f038598acf18515aa2b7c15f0fe0b360fc9d751422c0a65c58262fd5ed9"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.mjs",
    "blob": "ed8c092da6d1d4202fa03e03f7057c586c7116a0",
    "sha256": "55c4145d6fb33a6e0c9c8e184e4f227d18ebd17db96e1eed7af5c6d3ca3ae9ae"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "68438ed602432d2ffee7c898ae53d348180f3b29",
    "sha256": "8c64b21bf0402ec4ab8082ff540c7a9bcdaba706850c7f78caae62abe6b1230c"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "ff2a43f187be61202c3500494f67e034e8d9ab37",
    "sha256": "753b32cb0921f0b33ebbb480d687ad8961e687de81b02d933152a288282d3492"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-head-boundary.json",
    "blob": "c530e6a10e21f6512a3918f3944ae6eaf0e944c0",
    "sha256": "e03fd8d0ec72fe792df608ab86151e30198d8420a08ac7a8e0b5bb03991e3a16"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10HeadBoundaryBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","d35f8233383fd57ab44fa39fe93001190628d2df","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf","f0d5368895508ffbde2d69db0414001e6a5ab3b1"]);
export const acceptedStage10Stage5Negative=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "d3c8256f0bff07862c9a94baa3c09225b7f65449",
    "sha256": "3968ca37be5cfe83c32a19879f966f97e270f70d7f9c4389fe89131afeab1c9f"
  },
  {
    "path": "tests/completion-wave-20261113/source-test-stage6.mjs",
    "blob": "f0e1f2cc7d45edef5a781510f894162667e12245",
    "sha256": "37e1cf4c81a18ec18b5f728d138f86b771e7874f2bcd780f40037a26e693bb7f"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "178efa6d73a9af90e9516dcac103d5188be9ad1e",
    "sha256": "7c1628a71f030d46c8adb6362c0ab30de0cdab11a710cb39e59f5a76dc61fe5c"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-stage5-negative.mjs",
    "blob": "0f6a16e0de9761487d90c4265ce711a772a59575",
    "sha256": "fe4f79f1f8b03330498d3bb33c69e7b001d166b3d9e52187c28a58c932f52888"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "65d29d111d7b094670ea89b76f624585e240945a",
    "sha256": "86931f6478972b3719b6709eb4979eb4f7749387b7abe9bbc3805eee922df80e"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage5-negative-current.mjs",
    "blob": "c62c2cd1594666a648affe33546af737ac280a2f",
    "sha256": "ddae697c461805eae02895a829c6acfc8344738aba0b5466f5bb1976d4a3d4d9"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage5-negative-current.test.mjs",
    "blob": "3feacd0bbc77b9790c8480405b7b6c7dcc2024fa",
    "sha256": "4a6e07e8819dbd9ce3711aebc5fd67397fe219f741ba448c7fc920ac168fedac"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "9f1ab1b61e67c995bc59e6cddc49d175cc79712a",
    "sha256": "4f462d185e3e8fc31d3728f7ff0361a19ec6732c623c7b49088dcc032b6cf0c2"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "16be7950283133a0195e3f3ae578cc41a29999d8",
    "sha256": "ecd5a0832eb01ac33f1833ef00cd4cd4ccd02661b46ef4369500067cee45edd8"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-stage5-negative.json",
    "blob": "71d7e02fd8a7dbd4ca6ea4ab26558ef121b02c28",
    "sha256": "ae24df888a310066b10976669473981e8d2b0e75b748be2546697e2f8e95a895"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10Stage5NegativeBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","5c42a86018f9cce4ced359e5df4479c011d36b4b","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","bdb8d124a3861ec348ef06cf3c3b0e027e291cc2","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10SevenNegative=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "22691d64890df209804a2128daa4ac83985a5b13",
    "sha256": "2e07fe8f48ba8986a4282c33ee0d7874064c2702fa382f3214a1c7a03ad4aea9"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "c44b8924504c5aed3c9585fdf74fe306a4839293",
    "sha256": "017970053023993ee5b2a58af7538e57680ff9e71502bf146665f17aeff050f4"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-seven-negative.mjs",
    "blob": "e71e7fbb4c8bb98f75a97add24d6adab96ea8eb1",
    "sha256": "5255e4ddcba629db048a693a7525faa8cc92b3d5d09a77b3fa0340c031b86565"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "a16caa4db7309e561234ba7a318c7d488c5e9d01",
    "sha256": "ed0ceddf04d9a2feb202dba5f94618a3fce02b8a4c44e4a6a05d65a659d892ea"
  },
  {
    "path": "tests/next-engineering-20261115/source-seven-test-negative.mjs",
    "blob": "46d935830cbed0f26562b0f7de4ce93ac2fc3c6f",
    "sha256": "aa72c28d3c4f98b00b51345942efc078f7f4d16050ec0ea64c262f30c3e120f5"
  },
  {
    "path": "tests/next-engineering-20261115/source-seven-test-negative.test.mjs",
    "blob": "69f83dc3c677a8e08f66fdfa5f6f1f57ee9ec4d6",
    "sha256": "6def66b92f71f1816a940d850e5798552e5bb3993a3039573fdbcccaa63ce476"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "fdd330aa43c238e171528121737f12a979b57b15",
    "sha256": "4966ce3cdec3fac3930f8366f6b2b5d491ed00555b4df5325ac6e251526dd713"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "229c632f57eedcf9d6f6b13a4e152f01ec458336",
    "sha256": "4e3cabefea62f9834c3911647aed157a61a678ad249028c01bae1411a10d9110"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-seven-negative.json",
    "blob": "4528998d1779cc9ac2ea0a614b7af4a30275e196",
    "sha256": "0de6b6a6446a80ea00a92a1e56f9243d69976f84f23298de7d54d7fbc27aea39"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10SevenNegativeBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a5cf3d55983806b274108ab18661ccdf79e9e05b","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","b8c50672beffda239af1d49b48e099a2ac07ff8d","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10InteractiveNegative=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "d82879fa535301f030c96d68743ef0c70d7da571",
    "sha256": "447c1949ed1d6e5c36141ac3875267366792159f25a025bd2b6af06fc8568f99"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "9ab9b62cfebea5b466a911a38d400eb56b2db0ff",
    "sha256": "770d30b69ec7204889a001504b1ff15e4b2c937dc39b41003109818bfddc5cca"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-interactive-negative.mjs",
    "blob": "dc48598674fcdcaa16fa926bf2009ffb4821829d",
    "sha256": "d605f63fa61f3de98f6cee319b6b1285aa4fe82b9df27e65ed25d6b8ba36bb8c"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "7d171801928ca524a7fa64969af633dbeaad3285",
    "sha256": "acfa7d5b0ab29fe9dbf06f9ccb67a598428aa3809adb792dc00ea6a8b7af4129"
  },
  {
    "path": "tests/next-engineering-20261115/source-interactive-negative.mjs",
    "blob": "74163d82cc781e038edca647ad8584a8339e4cee",
    "sha256": "cac63aa8e7db76722911d1f4f43c44b6aae734097364e5fd6a7955dcb08ffe19"
  },
  {
    "path": "tests/next-engineering-20261115/source-interactive-negative.test.mjs",
    "blob": "9da0b660564923cea425967252911d03bb229b1d",
    "sha256": "0237b6b4f6c8930299d9898548ff8d17858992c96458468c0b17b98b4329f8cd"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "ead52b9a8d28ef3c6a75f76e00aff7b5900d4f9c",
    "sha256": "1dd160fe71a272f9d678b9ef8efe4d8d72dd03f46045930ded603b46dfc85bc2"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "ae2e6453f47557901d06a754b7a5d1974ff5ca98",
    "sha256": "ad4e656b02fe9b5c10782a0d839aeab72c027658788ffce87112d0cf08761d42"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-interactive-negative.json",
    "blob": "5be51cc028f8eecea7afc6866b165e3be5db52f8",
    "sha256": "7d60d6187bd000d1d6b2d336c47dabaa40bba7b39c19e092ef88b7b4651e2ad3"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10InteractiveNegativeBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","603d4bafdb3a4f4728eabceb8f7716b4dec0809e","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","e98481f6dc9f31e73a4526c14546f10375d41984","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10FixturePrewarm=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "9fc95157fa824cf732375dfa1e856e5c2dadb8e7",
    "sha256": "0c2592afc73dab430ac34fc26beeb37136992a3afaa41568bd94ace3c2f59037"
  },
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "fba90c6f7ae58b7fc27f38d035c54e3251534c3a",
    "sha256": "3f1ec72881c188c27eacc59ab374e322701af5605933f5ecff165c9696ef684a"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "ff544c6fee9ec3ffb829057e8ca73470624e24a5",
    "sha256": "2d4e985a3ed2d4cbefe2a08353c034d4fda393d377f953fe676b3410579b2325"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-fixture-prewarm.mjs",
    "blob": "e99469d2a412679269c47ffd248e2c3df153d7d6",
    "sha256": "eeb48020aa007cecedc19a1500d8b1b0b4e19387c9dc4f57d056e2b0f1cd7acb"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "0f2724f97f796cc506809ba075fcea21127fa6cf",
    "sha256": "ed1691481f319cbb3af2df48c52b0d326499163dad08c51426d090d7cb6336d5"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "db6f5660c35f3f0743f5d85db7d45e3e3f4cded6",
    "sha256": "4bf0f992313e03c6b192e2bb8ae7c76541981de3d071e2955ee4b94e11cf170f"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "3462f990f6786602fc558ed5fe00396838a2b5a0",
    "sha256": "9d450b40c87e2588ee4f1ada0dc02999bd5754d3ac0f4903893135053170788f"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-fixture-prewarm.json",
    "blob": "a3e19cd96ab2376a6781f3e062ef00d922dcc85c",
    "sha256": "e2a1ed8f4d565991a143ad458f20688f8708fcbf801b9630fa7b4ab1f5da21ef"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10FixturePrewarmBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","87e1cd53a08a411bba7506431dfb2800360984d7","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b7e2786c81a9ccfe218c2db72b29b934a1e5736b","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10SprintFixture=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "e49a0c44fca27585a504c9a9673a9165407df1d2",
    "sha256": "4df1e719e1f39a504f89b57a44617f950fd23395d850dbb355fb54e432ab1cab"
  },
  {
    "path": "tests/calculator-sprint-20261108/historical-source.test.mjs",
    "blob": "bd8d218aaeab52ce284e626889ed32b81f5a1ac1",
    "sha256": "350307a4b52760c348aa84cc68017f35bb2e978cdae184fba2c3b803bebfaa10"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "67ff73858da5354ff8cb005239abf6c9b3c6198f",
    "sha256": "973e706793788080dac45039229d303aa04ef1a9d49b21b54f9fa092c2b43297"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-sprint-fixture.mjs",
    "blob": "630396d109950830563048e86cf277b98c42bbcd",
    "sha256": "6b896e937599e04925edf6e63042ae4913a723d3e6329740de9c881fac936f05"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "7695c6c766765cea5d7372db6c9ffe4dafe324c4",
    "sha256": "0664d03ded61db2e9d3adbaa2fa6e16fd45f4f4f25f65199a415f83d9f44da94"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "d2f5214380a3fc66274d2dc30775e8225315dd07",
    "sha256": "eddaadf9441426bf7907140e592b990ee46d8af9318b26b4088bfeea462067b6"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "7131b0c6fd50da104d8ff97d6c7ce0e4e5ec38cc",
    "sha256": "5e1d64874dade871aad827ed642aa34bd11d1af0f642bc7bd4eece64b827b82f"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-sprint-fixture.json",
    "blob": "361cf2d70535f38509443bb289e23997c17f17c6",
    "sha256": "d863a040a13d5da1fcd44389410d76dd23fb28330cb679c452a3d2db25838534"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10SprintFixtureBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8aeb4716b732697d8387f4f2cc7100a5fba4bfd8","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","d7eb3c1ad0f534db30881d33a8cedd1810f68d73","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10Current26=Object.freeze([
  {
    "path": "docs/next-engineering-20261115/source/stage10-current26.json",
    "blob": "a13975d31655865a5b21244ea3a6ef9d560829e0",
    "sha256": "eeb2c07d359fcdd634053d65b36a74afa49de7a26a6ea51da481308bae49d05a"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "0acce95e51d8a272bbd211a4b8717ab899021d1a",
    "sha256": "d5a0460a3c9c678c59c3b6c1ea2dce6252e1e34d7ce811bac4281539ec8e94c6"
  },
  {
    "path": "scripts/product-completion-lineage.mjs",
    "blob": "5cfcfdd66ac2f937f3d9cc3d8b53b22c84786040",
    "sha256": "62162e043d99153bbe4fc1077352ca14da0bf3307eea725b5916e8ab5508f588"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.test.mjs",
    "blob": "2e31979081b85da70bfe1937f5609596251a2755",
    "sha256": "3351a9a62190afa44b9b18df7b82ab51fcc732f1a7cee55b1392935cf1d7c532"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "1b3863564170a982c0d1b5c0b1533d99a00dab2d",
    "sha256": "3b5d8d2ab36add89d58d34e19e2274022ade0032ea33be6be6b1aecd6b4bc839"
  },
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "1d30534c8b6693d51e341bb72b0f12933a483fb7",
    "sha256": "ed7dc41a60ead9e8b59f3d7e4a7c7ef27df187053712d29a3497f028cf8dda9c"
  },
  {
    "path": "tests/milestone100-20261114/receipt-source-path-stage8.mjs",
    "blob": "16905b2c20527d89f8333ae985b357c9f0b5e1a0",
    "sha256": "190265fc54f458e2d67f4ea48ec4fa4fc7709d516b8c66302d1bb46b94afe7d2"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "62400c98b2b3e63905df147caee9560598e52a52",
    "sha256": "5ef2af289c9d6fb2dcee37955a9cd96b739255dd0408043bbb99f99580c3bc9c"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-live.test.mjs",
    "blob": "7ddf0582bcf04cef068f7d4e2172a3889c742b12",
    "sha256": "b3e64cda31e10ca256d2f7fa49ba942f844bb6b22fe7ef48993db9cadcbf8e47"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "18ac0224e1f2fc47102badea12fb129ba5fb0b6b",
    "sha256": "29f4eb2a611bcb1c4167256dba5eb3e51ca2fd6321d2cb63881ccf01467947c0"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "9b8611148efa2dbd00c2451fe3d1b9d1eef07d06",
    "sha256": "9d190e93ca61bad71debf1b599483855a5fac6f027fec8347473796403d9c7fc"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "11b60ce7219fc593ae6fa4a3b74cc7ac7f824be4",
    "sha256": "9544cdc6f585fb53b528696832c067a72f97a17b15aa4e4205f05f48e18ac1a5"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "1a4d3d72636d08e3eb8a3e724332f9075a69781b",
    "sha256": "3ae074ed2fe88a823b9adee30b226cb5d6599d6512f84602095f91ff2ec848c9"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-live.test.mjs",
    "blob": "f2a491f00037b9ea2c82791c21f8515c896306ed",
    "sha256": "34d0fb9f154e4290af03e79b279c5121cb9a40fc79130c77c2c943ad1fd1e770"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-current26.mjs",
    "blob": "8ff85679490702546ac0f6fff7de1d0dda5220b1",
    "sha256": "8812f764eac0f493e10e706f1eff278f558c74a85c3bfd6657e3d950bdb00c46"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "c0c93da2f74b223d52799d05d9134275cd73a89f",
    "sha256": "9380d87a41ca0c83f84aa10a4672dd7a8a39dbe8642fabc9cb873e87d0db18d6"
  },
  {
    "path": "tests/next-engineering-20261115/source-canonical-handoff.test.mjs",
    "blob": "baf4c217b78be3b152cf9a74dfff81cc0ef40f95",
    "sha256": "15ceab99bd3558a538fe98ef9dd37a24a89ea8f11552017039015dac87a3c4e8"
  },
  {
    "path": "tests/next-engineering-20261115/source-completion-prewarm.test.mjs",
    "blob": "e88cb384d8e8dc7b2a892792c386c479b8806373",
    "sha256": "c7a7e79fb3d28d0ee7c37d813ef3e1c899e29acc50ced2605f32e9e6af00ac2e"
  },
  {
    "path": "tests/next-engineering-20261115/source-current26.test.mjs",
    "blob": "2d934d68b8515c13ec89edd81b4ea80d1c7b2d03",
    "sha256": "8ca1f205b9a71bb2b8b0e46bba07cf364a44a2e6856cea0dc7c464657fd8cc68"
  },
  {
    "path": "tests/next-engineering-20261115/source-exact-current26.mjs",
    "blob": "272372b8e06a9d0c023c3e2783a3e63f15677475",
    "sha256": "3bf1c626a8c150aa9bf014b8f5fda646c9ac7b5f0dce2e11e0f5afeb414ca120"
  },
  {
    "path": "tests/next-engineering-20261115/source-named-current.test.mjs",
    "blob": "58a535a022d446c716f3dedc89ca6fd802776fb4",
    "sha256": "2acaf58cbeed7ff8e0414bbd36dfe8201eb56db501d98e24d4bf6ba1358328b5"
  },
  {
    "path": "tests/next-engineering-20261115/source-private-stage8.test.mjs",
    "blob": "325cf260d3dd5a8479026c4f19011bc4ad2d78eb",
    "sha256": "d33fbac4b70eaefc729106f3afdbe2b2533b603cf362447b7f33842c61c0c8ac"
  },
  {
    "path": "tests/next-engineering-20261115/source-seven-test-negative.test.mjs",
    "blob": "b696782a4cf0a17440c376375d1e1f7af4fdcabb",
    "sha256": "3feaa3d13e276476b7da6291eff79be81bc6f6cca4d89c59f9ca01064bbfc80c"
  },
  {
    "path": "tests/next-engineering-20261115/source-stability-reuse.test.mjs",
    "blob": "01f71e11c41a658e8a8cb8f2b8b39e0fc36082c6",
    "sha256": "d14fc218e110e146fbc751c2a4801ded51420a33b31d2943aabe9c43cd0919d4"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10-current26-policy.mjs",
    "blob": "dcba3acf97ac62aeb6b8cf6c1b0dff90be34e552",
    "sha256": "7589adad4dca587330ffab36929d176ed0cf6010148edb8bdf4ad08e63364ed5"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10-preload.test.mjs",
    "blob": "aed45a37846225fde16ad0941b19a19b938cce4c",
    "sha256": "516a18ddddd669fed546d2eb39c71191bf9087df0bd9c1747a2484634cdf912b"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.mjs",
    "blob": "48bacf77858931915bc24e50a4e934a75608df8e",
    "sha256": "43b82d0752e26e09bd34655916e202040ffeaba4ebc72fed27d3ff63ee9d915c"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.test.mjs",
    "blob": "840742def360063790b0417f2af95520f9633d7b",
    "sha256": "5059a866f2e40b178d5c3d7644e4d665d6826d1a557b0de35dcab1702aecf7d4"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage5-negative-current.test.mjs",
    "blob": "efdcb9aaddd9d9c0e0f12d572bacb2e1f5739d2f",
    "sha256": "1b14496af7ee30fa8b4d0c8dca8aa875ed28a93cfbad9c94a38bb2e9334a453a"
  },
  {
    "path": "tests/parallel-five-20261110/verify-composition.mjs",
    "blob": "ffe15f4033bc2117087aeed274f431badb30d5fa",
    "sha256": "817bfa11673ca6310b583dac05588e42d87c3dfb37d963ff60f874988730f919"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "4d205610b0d00ca582a0e2e0d9af694e7c47f5e5",
    "sha256": "8f8f4cbfccc691f5f81fc0be09041dba466749efd4bf9712480a9a2d61b23144"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "07dd660e483a109bb2140cd3dc765dca724c62b9",
    "sha256": "489c550f99e21a07c5b807c72c8d25613c558ea92c6dd2c99d8cd5ba28e56f2a"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-current26.json",
    "blob": "69df4fd52c2a59a7e86456b42af0f4fc9f9cb4db",
    "sha256": "b57dca9ba1e0c694e4d8e24a20616c4c86fd240b4fe6112705ee5b75498eb4a5"
  },
  {
    "path": "src/calculators/catalog-reviewed-standard-evidence.test.ts",
    "blob": "4e49783b788cfc46129407bbfe79ea79e5245529",
    "sha256": "b0acca517d28ba8bf10b52c921c9db23cad63e0b86b14b78c9e38df2a2d8a726"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "blob": "3d25a974c6c821504d1c9df1b3540be1fed6d410",
    "sha256": "57e4fea16e8d8402b231f7ce52d7518aba64c66a1bfaeeaf43fa6e39b6e18150"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10Current26BootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0d497eb2683b88418c4820a73f2bf1d3f99810d7","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","1f4b9885c7f483c5ec2282e50d72a1fefe3e4a19","26c222457278bf69b4f351d0cc100de47ca9eb33","29bbd941128fe79c825450f0541f630b45b995d8","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","3374da0e4421c30bd34d5b93b9ac71746f6fc699","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","c9c9431da2ca2615ec7ebe7ab798280cc1cdea33","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10RuntimeAvailability=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "628e34cc8671f32dc9d81178ea25620d9a11c874",
    "sha256": "586f52e182bd1916c2b8794452c43ca04a7dfc30b690a359cdf4d9b4fdc9fa52"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "39a73f5d76165f1b69fc9ec79da28a6230bb9238",
    "sha256": "504293c3c612cf65a98615787ebfd138dc6828076c129006b3df42f707112c71"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "4ac5c3193ec1c4e620a8bfcec3a13b9f65f19e43",
    "sha256": "156529752cd830af8e6ed6ea79b8473e55847b91b92ad2b79b3de41c3c09e303"
  },
  {
    "path": "tests/milestone60-20261113/source-receipt-lineage.mjs",
    "blob": "f3bfeea5ff3c54aeed7d1d7c222357a65518819c",
    "sha256": "3d6826802550b95472b4949817c5488d458ce473b87ae17220e224cfc65cd046"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "3658e6f25095b8bc091b838b114bd2da56603c30",
    "sha256": "01ca21d3269706c7824e9cad24fc9858fe130880af7f1de56136d66e274c8eb1"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-evidence-batch-api.mjs",
    "blob": "bc2a14febb90c71ff68479f7beef0f6a76bbb09f",
    "sha256": "f27935e83f9ed84762065cce05dcb52bc668eea23ff6011cdc96735dcf66a36a"
  },
  {
    "path": "tests/next-cohort-20261110/source/runtime-head-bound-batch.test.mjs",
    "blob": "f1ec209000c8b7e260d012ab6f77f5ba8d06e931",
    "sha256": "5f90d85e45125d3ec430a3d9e1c8bcb41d2af0ea6448658ac456d4110c086f35"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-runtime-availability.mjs",
    "blob": "548a7c4e6bcf7513fc678f77fa401f5e8d72cc8a",
    "sha256": "0b0c9844a65a5e12e64cbbae9c11013f535f1d18cf9c1f66b80b962d2a0e6cd0"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "1c7e08fd35e1d67b3004107dd29e766982bcb082",
    "sha256": "0c1497506af32e3267734258892a3a602ac887d817a62b979547218b4912dcc3"
  },
  {
    "path": "tests/next-engineering-20261115/source-completion-prewarm-admission.mjs",
    "blob": "f4054fba440717f6e7f9942570bf5d8d74b3d532",
    "sha256": "0dcc90cbd39e8370462464bf6017f8d840ac3379bbff2ecd79c81e2575e32fdc"
  },
  {
    "path": "tests/next-engineering-20261115/source-completion-prewarm-admission.test.mjs",
    "blob": "db56038f84d4f54719e30023c1f1cf012e38e5d6",
    "sha256": "d001fef36312c7bcd53aa9256cf0ac9c854f8710743fc8918f7e56b6891e55f4"
  },
  {
    "path": "tests/next-engineering-20261115/source-runtime-availability-hook.test.mjs",
    "blob": "d9f4ff02b63e0f5323fa1f99849a198f2d71f9e1",
    "sha256": "f2eb6004965b9d01a6236d43e60994a102528e8b393bf076b7dd979cea719440"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "12e8cb83aac357bbbcde3e9b6feb5482c0263784",
    "sha256": "9431aa897823ef6890e89fa0af6e25a1baaa4f59d9e87291b694b9d235f90c12"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "e62335cd8dbebf9ee7f0f0c316f1a825f80b5f4f",
    "sha256": "1207a1b17d00baddaa29938b49442337e27b03afedf2e11facaa2e725ae105ac"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-runtime-availability.json",
    "blob": "71ca7f87e7a3639c1f8ced0eebbeb2999a2208c4",
    "sha256": "8021c0dbba68612623fc1cfe548f5c296d3c9f2a14a1f2c290315ff0612de0bb"
  },
  {
    "path": "src/calculators/catalog-reviewed-standard-evidence.test.ts",
    "blob": "4e49783b788cfc46129407bbfe79ea79e5245529",
    "sha256": "b0acca517d28ba8bf10b52c921c9db23cad63e0b86b14b78c9e38df2a2d8a726"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "blob": "3d25a974c6c821504d1c9df1b3540be1fed6d410",
    "sha256": "57e4fea16e8d8402b231f7ce52d7518aba64c66a1bfaeeaf43fa6e39b6e18150"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10RuntimeAvailabilityBootstrapRefs=Object.freeze(["01e9844f4dd631f075a1f7ee2ed47ddd76fef7f2","09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","163b61353a095adda6f3062b7a52ef1589fead6c","26c222457278bf69b4f351d0cc100de47ca9eb33","29bbd941128fe79c825450f0541f630b45b995d8","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","3374da0e4421c30bd34d5b93b9ac71746f6fc699","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","d26c8753bc75b79d09fe26a951e93bd66b971fd1","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10RuntimeTrees=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "8438e815d5dabc95a65f3735f6cb85bb8921c601",
    "sha256": "070daafaba1967148e2509dacd3eec130b65fd105204548b35809061a0237d47"
  },
  {
    "path": "scripts/product-completion-stage8.mjs",
    "blob": "c8651992267a5e430c5ecc329fdefcdd3f56d4da",
    "sha256": "7cd569f2cb43d6d014844f30abacd838244c5e804f89a0d671bf070cb8dca64a"
  },
  {
    "path": "scripts/software-closure-evidence.mjs",
    "blob": "878d9ef9a2a3193bfb1e6aad1a7847ec3cd84a95",
    "sha256": "30899749ce7ca1f61703315c082bb22301bc3033f08cfb822af28ba0491040cb"
  },
  {
    "path": "tests/milestone100-20261114/composition-source-evidence-batch.mjs",
    "blob": "d130765fe23c6a02ff5b58ee51ad93c32e61f736",
    "sha256": "ab455c041996da86f9e26a17a071a3dc7002cbf36dd79471e2d737b2553f90e0"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "c6c1147e631f81a247925372f4c1af8726910112",
    "sha256": "a6660a955688c95d759b9816ceef7f33556a8b10fc3050a886065e1eba496159"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-auxiliary.mjs",
    "blob": "e3ff76ff1f3960f0977b074705ae0ffa893b2a60",
    "sha256": "16242eae77742b2e1aa0adf4e268958eb11867afa5f4e30775dea3d7944d44d9"
  },
  {
    "path": "tests/next-cohort-20261110/source/retained-runtime.mjs",
    "blob": "b1435076f4a2beaa1afeb66f77101a73408e26e9",
    "sha256": "b54326e23b282e98de779f7e25da8a40fbdb2ace71f655ce5c033f60fe322e67"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-runtime-trees.mjs",
    "blob": "7579390c44be3cac6bd17c24d3890b27f0af2bcf",
    "sha256": "b571a5859f63c5ddeb9fb19ba3b756ba610c6ad9a1067ab94912c2ccb6f336fd"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "346340d63441322212955fd0817c881b80ca5adb",
    "sha256": "761c2645db348e9fa05c060827ae1b272a0aedc7fb32d87fad512a474a68e0f0"
  },
  {
    "path": "tests/next-engineering-20261115/source-composition-current26.test.mjs",
    "blob": "15558375905164f840f15eb0d4db2f2699773101",
    "sha256": "a2667839ad201cbdf0a22f7d3d8b735162604e6a44381556ddb14aad3736a9b1"
  },
  {
    "path": "tests/next-engineering-20261115/source-runtime-availability-hook.test.mjs",
    "blob": "79560b57e5ced4cf6af28c8e59c1894bd9aa0b2e",
    "sha256": "3950d0f66d3d2365126aea544ccd5d2cf21742342d71ca430ca790d7dda707f0"
  },
  {
    "path": "tests/next-engineering-20261115/source-runtime-immutable-trees.mjs",
    "blob": "afc38f4f7c449a4d06471f657c0e4616eb21703a",
    "sha256": "3a968b9e098ef825711bd2a534679f69598bed800267e455740246884c776151"
  },
  {
    "path": "tests/next-engineering-20261115/source-runtime-immutable-trees.test.mjs",
    "blob": "f000a70a1fac2236b732f3c42b70318cbb8ec25b",
    "sha256": "ac123bf19efc0436bd9d05eff26cbf792fc264ffb3270786da098657f3a1f7f0"
  },
  {
    "path": "tests/next-engineering-20261115/source-runtime-native-git.mjs",
    "blob": "3136d2e6106858e192aa10a9004cd0162dec5747",
    "sha256": "9c7443074fa59d937e486ff745fe577d5f969cd48a70ccee942012b6deb214b5"
  },
  {
    "path": "tests/next-engineering-20261115/source-runtime-native-git.test.mjs",
    "blob": "78ffdc1eb193921c590ee1163f0974fc9f69f92b",
    "sha256": "52c125a729f4fc64479b5ef24831810ef983126fd1a4ba500e5f46f269412f94"
  },
  {
    "path": "tests/next-engineering-20261115/source-software-catalog-preservation.test.mjs",
    "blob": "7137bcc724255a2c6405c2b673babc6f57fe4783",
    "sha256": "8f8aa54519d0c26e1c90d7a7a7e0ac760de5200f1dcd3f3996e18e0c312dc9ab"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "251edd3770fc959b1b34cd86f827f935bfab7de2",
    "sha256": "c9f4f7c74ebf0dd1e9f8265cb903d2db62a8cec16bc8368e246b5eb8eb961bbd"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "500c7d3d31fb693ad0b60e8865761278fe466809",
    "sha256": "64bd6a872140c40a79f466f3363e5ad5c5b2cf03ae5536d57ac9c70774b0824a"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-runtime-trees.json",
    "blob": "0d3071710b7cb84c52f3d59ba9a9654a9da26118",
    "sha256": "07bd07ac5636c781449c8f6d98d14b688dd86dd7bac8d1bd9a7497c9e95cc435"
  },
  {
    "path": "src/calculators/catalog-reviewed-standard-evidence.test.ts",
    "blob": "4e49783b788cfc46129407bbfe79ea79e5245529",
    "sha256": "b0acca517d28ba8bf10b52c921c9db23cad63e0b86b14b78c9e38df2a2d8a726"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "blob": "3d25a974c6c821504d1c9df1b3540be1fed6d410",
    "sha256": "57e4fea16e8d8402b231f7ce52d7518aba64c66a1bfaeeaf43fa6e39b6e18150"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10RuntimeTreesBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","14f13fa8ddd79b13fbf44a331e0485ffb1716871","26c222457278bf69b4f351d0cc100de47ca9eb33","29bbd941128fe79c825450f0541f630b45b995d8","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","3374da0e4421c30bd34d5b93b9ac71746f6fc699","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7881c915a47f898e26ca9f85a6c62dbd236a0db3","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","cf6c1f0457adc86c181dad23d7df780039ec2011","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10ColdFixture=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "294d303415fd9c6d3cb4edec97f2ea0e22fdb8cf",
    "sha256": "e83ca2cbdd0b4421527fcc6e8c864264a0395602b09364250177ece390b5bf5c"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "df333f86d19f30edfacb60abdf5a19abf0595a91",
    "sha256": "a8bcc9399a9859b2bcd0e8984c98eed02316d866ac78992292fe72c99c7712ff"
  },
  {
    "path": "tests/milestone60-20261113/source-cold-preflight.test.mjs",
    "blob": "8f6addaaa405bc61cf494ef685bbb421034f5067",
    "sha256": "64548673e8a40364bd0543fbdbaf22ca4694f51b10e3ff23a30f5fbe3df1da57"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-cold-fixture.mjs",
    "blob": "ec330141e995feac23cea4e73e29c4a99ba91c22",
    "sha256": "d10848186412c7a99f374388c8a7ad7afd8969347cbe48a246fd4c9a2d3a8a48"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "4cb3b6c543c657987b17668e9d2123036adc0223",
    "sha256": "7f4dc03662bcf1b53e852e8b83c7e6a826f2e16d9f9ab0e8d743696af9644ce4"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "22a5534b2339db8d672aa1e1f9db21f1ef126249",
    "sha256": "b6ef71cc04eb9c041c1eac77bc9a56a97410734ed395d48b6ecf3e2be5018117"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "d7256a7d35d6cd53a51ac95ab3f9f36a223b3669",
    "sha256": "47d5f595b63a55d2fd9c83580fa8ccdd6c359a278b7169b7ce0cf3c27b11bbf7"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-cold-fixture.json",
    "blob": "0e851b1eb076ed252e533525744562ebd26a5191",
    "sha256": "9e8e287414a85aa45181b1dd5fb8286bd54e5865636d195ee78e36432381a864"
  },
  {
    "path": "src/calculators/catalog-reviewed-standard-evidence.test.ts",
    "blob": "4e49783b788cfc46129407bbfe79ea79e5245529",
    "sha256": "b0acca517d28ba8bf10b52c921c9db23cad63e0b86b14b78c9e38df2a2d8a726"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "blob": "3d25a974c6c821504d1c9df1b3540be1fed6d410",
    "sha256": "57e4fea16e8d8402b231f7ce52d7518aba64c66a1bfaeeaf43fa6e39b6e18150"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10ColdFixtureBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","29bbd941128fe79c825450f0541f630b45b995d8","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","3374da0e4421c30bd34d5b93b9ac71746f6fc699","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","52d47bdff29e0c10d5def7e2b5118badd74f2b4d","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","d55d49f5eca08db001cdf3ef32e547c0560d1f31","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10ReceiptFixture=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "6656ff9cf9889aee34927aff09636e78d517c0d8",
    "sha256": "400ab356ecbdc098cc3ee264be6de3eba8440b95119df11afed7f0b1af654ca3"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.test.mjs",
    "blob": "165eaf03fef93b33bedd6223e76fdc27f267d5f3",
    "sha256": "aef79577916ea502782da680067c99095b4aea56cae38c6d71bf3d4ed78341f2"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "020fe8b86865a470cf1c964be07c8096fefd093f",
    "sha256": "437f65503275b52d01dd54df6c3887899fc86800ac06bf670d5ad30bd18ffc8e"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-receipt-fixture.mjs",
    "blob": "316ef3b084484c793a47dd814391a6d690e204de",
    "sha256": "25c77453604b8675653f49ff8e24bd5b1a7f9ec4d068aa0f8df4198f5f15b510"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "933c200ae58f33875c980124ad7e4f2359ddbddf",
    "sha256": "983db9df14148e4073eb8739ed8db185f626309be4b277e47f6c8ff2c434f7bf"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "ce38cb049dbd98905ab25b933ac562466d0d02ea",
    "sha256": "c7be4e245cabf98e9885024e7ecd51641f772d122e4f28cd23fd0848889172e9"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "98938873cf4097f4951121a7c2db32cce1b125b5",
    "sha256": "24eecdfd505e5dcaa166c9de44f975f4bb1ae45f38d9af414c5548cafbcd0738"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-receipt-fixture.json",
    "blob": "7b5be4628168cdd886049e252e80506f57956650",
    "sha256": "2e2b2e12684d152b3641a8670768a9a861bdec984138e9b0d7d8110850c2f4ea"
  },
  {
    "path": "src/calculators/catalog-reviewed-standard-evidence.test.ts",
    "blob": "4e49783b788cfc46129407bbfe79ea79e5245529",
    "sha256": "b0acca517d28ba8bf10b52c921c9db23cad63e0b86b14b78c9e38df2a2d8a726"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "blob": "3d25a974c6c821504d1c9df1b3540be1fed6d410",
    "sha256": "57e4fea16e8d8402b231f7ce52d7518aba64c66a1bfaeeaf43fa6e39b6e18150"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10ReceiptFixtureBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","174c42d16f0eaad9ced52069a17c239d73337b4d","26c222457278bf69b4f351d0cc100de47ca9eb33","29bbd941128fe79c825450f0541f630b45b995d8","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","3374da0e4421c30bd34d5b93b9ac71746f6fc699","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf","fb34d77390d8a0059718687b50c8625504962daa"]);
export const acceptedStage10PreflightJoin=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "563a7edb29a798115cc30aee7a46fdfdf1698fef",
    "sha256": "8db7346ab1bd0fe3d660ff1c362de1d4520e471ef0594b2ee543ae8a52bb2a4b"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "76cc05ed3878101d099cec8811200878c86e7b9f",
    "sha256": "368b788fd44bd12d03d60db466af3dd1dd4def849a33e0792089bc077c58c29b"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-preflight-join.mjs",
    "blob": "c2ed240a6fa627d6ddee6e8948f9c16b099007f1",
    "sha256": "8c3290f33f3ad687e68babf1dcaa80369514bad2651eb273caa55418f5908b3c"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "857b144df2936badc231b4b8a7dd8f23267b96a3",
    "sha256": "476dde7f76d67f8a2d0c418b9ff2dd103395254428bcd8254425193c317dcbe4"
  },
  {
    "path": "tests/next-engineering-20261115/source-preflight-join.test.mjs",
    "blob": "a2be1792702f2dac4b1d8e27359a390ecb47b62c",
    "sha256": "51804b55a9eeee04bedefd67cc107de8ca5fe6b85508b4dcde5d29a2c24baae0"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "da2e202215985225c3ad5a73f36d997825227ced",
    "sha256": "608a9f97a5eee66a4a0c503ebf266791ab5d8b23b8cebe8998dcbaed8dde28cd"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "6dac01c1c48ccb55b64b63e118c95656833da295",
    "sha256": "71e9011e2bb1d0507c729c23f2de74c8a7eae46c647d74702dbb815a7b589bba"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-preflight-join.json",
    "blob": "bcf42f6669a0feba5e206c2788cc6f3206535b66",
    "sha256": "7881c5e665c2c8c8bf064b89c485d0809fe7013ed65e1a0a3eaaf97e1d0b7e67"
  },
  {
    "path": "src/calculators/catalog-reviewed-standard-evidence.test.ts",
    "blob": "4e49783b788cfc46129407bbfe79ea79e5245529",
    "sha256": "b0acca517d28ba8bf10b52c921c9db23cad63e0b86b14b78c9e38df2a2d8a726"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "0af71d8b9d3447279a17be51258d89420e1ea1af",
    "sha256": "e6f5adecb9e49668791caefb36f02ac99d4c42cd509a74854f5439cbaf764c0d"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "37b2aa94913ffea8a7416bf24957173ccfbc78f7",
    "sha256": "85653a120bc3be44867cbec29319e895d9fcf78d5fe27e83d7a96ee0cdf4b925"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "blob": "3d25a974c6c821504d1c9df1b3540be1fed6d410",
    "sha256": "57e4fea16e8d8402b231f7ce52d7518aba64c66a1bfaeeaf43fa6e39b6e18150"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10PreflightJoinBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0d8d39fafed1f95c928e91f825e6978a6ec73fab","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","29bbd941128fe79c825450f0541f630b45b995d8","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","3374da0e4421c30bd34d5b93b9ac71746f6fc699","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","df2e0543901caa55886c87980049a38d737c6a96","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10Current32=Object.freeze([
  {
    "path": "docs/next-engineering-20261115/source/stage10-current32.json",
    "blob": "41dcb7e6d85c84b78a9e0d5086a802c2e96b06bd",
    "sha256": "b1151d655a9e44f8a304c0d81f4c94d3e0a974a12d12a4d51955b4eb8f54488d"
  },
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "90c244704c6b949cce5866fbe0b5192b31083aa2",
    "sha256": "0a292490b037bd24bca87dd9ef306c3e6bd4455b10cd20f69fc8c026743febf8"
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.test.mjs",
    "blob": "95b402a1f13616f1070efca2ca477afd91b13350",
    "sha256": "efb4af278a4b1f66d69750ffbc04650fef5e53735a668450643da8de0f6956e1"
  },
  {
    "path": "tests/completion-first-20261112/personal-stage.mjs",
    "blob": "4225fb3afb250b837009f39870029ca1b74c3d57",
    "sha256": "965d764834368849386cf7465408a90737819c677031938eb2fa14f0dc64a109"
  },
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "1bcc3008d8035c242c925612d99c38109cab5b0e",
    "sha256": "ff45e03465a39efc12772134780141ec91f647c0f6bf436012134d06fc97d29e"
  },
  {
    "path": "tests/milestone100-20261114/receipt-source-path-stage8.mjs",
    "blob": "b8565a83ec3b308ef9792c9ebac028938ecec1c2",
    "sha256": "40ca5391368283ebfd94c5562ed350bb7f4ce217579332287172ddbfaca0059a"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "8522da26ebbff4b1bc13e4f68537df4267ee909b",
    "sha256": "dc298e2408531d7a30745f5630c39a8072f16f4e6cdd4fa4dae0e6eb7837e60e"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-live.test.mjs",
    "blob": "86e70d063036e24e1d1f54037f0fcf7d6e417bb5",
    "sha256": "35e63d66095427587dba5af80593dbd8951b910cadb7ec78da2261f3530989f9"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.mjs",
    "blob": "fe71c4506ef59195ec29a2ce9ef4eaddfb06a273",
    "sha256": "6e93c4f1d9bd618e37d5803e0708f391532256255765016ce34bef6a5005b831"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-current-src.test.mjs",
    "blob": "91d7f19ca3f417916bf1026da9133c8bca4f7525",
    "sha256": "9976e5380362443865d0bf5cf1df6174d00e982a0cd84720794a527a4807d381"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-workflow.test.mjs",
    "blob": "1b2cb4d520e524b7805805eddd513e2eef90a7f9",
    "sha256": "836cb42dc4b8098776accf1eeda00ec51c8f3828766eae375be7aa5a0557fab4"
  },
  {
    "path": "tests/milestone60-20261113/source-stage7-live.test.mjs",
    "blob": "7fc5276eabeb4d56fd988e3700c3a396b6e94a6c",
    "sha256": "8cff1ed57105eaca377b0fe0780f2ca856eb3d1941ac8a364ab1de7e4c9b2c3e"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-current32.mjs",
    "blob": "a0d585994ad9fb7bbec953b1c9a3a8b9e49f6cb6",
    "sha256": "3359506a7a3ff192632e66c3a130c3dbf089bb23f119b8fc33269b598efd2881"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "abd28f7061b34a2ea98fef355afa1b6c550af46b",
    "sha256": "647c7c44640c370a478a387a5dab70d2e45cc8da38a1c6eb6e2743b57b6ad6d6"
  },
  {
    "path": "tests/next-engineering-20261115/source-canonical-handoff.test.mjs",
    "blob": "40da53581279ae2f2509a55dbb6647cd225c7ca3",
    "sha256": "96ab7a411e967558f1189cac071cb448cef0b0efa403e560f221c4fd03388d66"
  },
  {
    "path": "tests/next-engineering-20261115/source-current26-historical-audit.mjs",
    "blob": "c6cff8ac3a3986c33264918efda626dbe7f8c7e4",
    "sha256": "59fe9745d34ba4ff43288bc20087b45dbe417cc6f269e35a7cf227dd51f467ec"
  },
  {
    "path": "tests/next-engineering-20261115/source-current26.test.mjs",
    "blob": "d2625c147ae53e5fa7695c7f8f98315aca300aae",
    "sha256": "5931db8e0f91bfe9393da4b95fd5f970a0d7fa2e089ab91711858943d88a7f02"
  },
  {
    "path": "tests/next-engineering-20261115/source-current32.test.mjs",
    "blob": "fb14359d694e11c53974279194d86b7974fcf02f",
    "sha256": "dce9ab31f02577cc410559d559fcec9bbb376ccc1326c513412c69d2677de52d"
  },
  {
    "path": "tests/next-engineering-20261115/source-exact-current32.mjs",
    "blob": "2f47d12c01316afda637de9bda230d617a3b0e32",
    "sha256": "f710b899c52d1981211da97b1a0544d0c114b3b3bef2c15730aa0c933638a695"
  },
  {
    "path": "tests/next-engineering-20261115/source-named-current.test.mjs",
    "blob": "2b082facb209c85287f5834394e60b31fb0ee8f8",
    "sha256": "2d3f716b172c4e3f1766781df8cf2c5db2cfcb67fc9a8fc4a9abfc9e33c475d5"
  },
  {
    "path": "tests/next-engineering-20261115/source-private-stage8.test.mjs",
    "blob": "f92d31f8decfd4cd666bb89e114d1afdfdb20033",
    "sha256": "321f7c691211f4f048976b038b2dd12ab7681442182b7898b88a929b44708b7a"
  },
  {
    "path": "tests/next-engineering-20261115/source-seven-test-negative.test.mjs",
    "blob": "29d2c534a2dc590c2f077f4f743647e42b3bc954",
    "sha256": "26157ef84972edfb39de687f6f9e582ac4ef7ce6fab818dd3b80a16192abdb5e"
  },
  {
    "path": "tests/next-engineering-20261115/source-stability-reuse.test.mjs",
    "blob": "7a3dff959b47febfd3b1704219ed2d9f11874b41",
    "sha256": "b9e67d533c79d240155d6f740e7f4bf558bec07ff361d133cd82fca7508d3154"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10-current32-policy.mjs",
    "blob": "929f9675e9228ae4c7c4af167a9c306839657eff",
    "sha256": "09ba2a4f06a95f5d66138ddc4d21d51193f4cbc851c73b2577eaba4ee2c78bf3"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10-preload.test.mjs",
    "blob": "1b2de50202aa59b73abc7789f5174b80b4dcb0a3",
    "sha256": "714d7eb901ed6cf0726d6892e25e0031c669aa1f5c23a0eb2bcfa701336093ed"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.mjs",
    "blob": "99c111794de1821c12a9860e58a1e5cfcd27ce07",
    "sha256": "6e16ab92532f49e89d56fc5c69f32889e4ae500282f264c18505a1437fd0f22a"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.test.mjs",
    "blob": "59f853cb107463091b6ef96d39170ddf17d40408",
    "sha256": "e4c433da98d60a069117e67eaabaeea96712d6c3c9e06e226da095d81c8cca98"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage5-negative-current.test.mjs",
    "blob": "3592245eb5e61edaaef785f84098c040aeb09652",
    "sha256": "7760639d71a18d7ea94ca47d93e0a22375bdc0c33ec95275e0bb6802e4a71d68"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "ae276d21be53c4997855767965d938dbf7bda965",
    "sha256": "3cc6f756b8b9c336ae7fcc975172684f191e42221d4cd0f98945cf2f39656736"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "b5287021e7d29bf718736f68f7175ba10db4788a",
    "sha256": "6c940f0b2860efb83f1dda5c3b79089c601188df293b8dd90e0fc85aab64a8f1"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-current32.json",
    "blob": "5ed78fdce8bfcf3133a42ea7964b76184e4904ba",
    "sha256": "3fffd3b1bb7f2eb040c410d4d085162a084b31d60653089ecf46463127cbb3a5"
  },
  {
    "path": "src/calculators/catalog-reviewed-standard-evidence.test.ts",
    "blob": "4e49783b788cfc46129407bbfe79ea79e5245529",
    "sha256": "b0acca517d28ba8bf10b52c921c9db23cad63e0b86b14b78c9e38df2a2d8a726"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/exports.ts",
    "blob": "3d4cd9e61fa404e8fac8ee13f3e41d6add04c614",
    "sha256": "2ee65284cfd31a6924a86afd66aad070ed6abb8c021d3c68e3962e8c056d6240"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/completion/scoped-engineering-delivery.test.ts",
    "blob": "85a5099f0eddac9ed86cc657eaee7b5b7eec79d5",
    "sha256": "79643aff70c0fa1b8bfe46ae19fb833180328dd9c8931eaa7f4fee68a7ecceb8"
  },
  {
    "path": "src/lib/calculator-factory/completion/scoped-engineering-metadata.ts",
    "blob": "6f7ce95e24b0c2fb11c55cb553b658006fad90e0",
    "sha256": "775f343f4ab27930ddc52e0b34108e600177e0c7a0df6e268ac1050ad2f999dc"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "933613d419c1c70b64ffafd275fde6b7c3fae592",
    "sha256": "9d7e7acadaada029ecd733465ea11bcde3c215bb3e18ea6c434ff46c9ffedac8"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "b0e76cbbf3e7de8e895136e52a3b608f65b73a15",
    "sha256": "4b8f2e679ce59962a3e5d47e732c104f75776857984c36b0c59082148869cca6"
  },
  {
    "path": "src/lib/calculator-factory/workflows.ts",
    "blob": "51cdfb37b131959494e462c00d8b7a89ec958bd5",
    "sha256": "fd85e9a03a46aeea2149a08bdc70553779a72f9470c7a1949a4914692d4fb833"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "blob": "3d25a974c6c821504d1c9df1b3540be1fed6d410",
    "sha256": "57e4fea16e8d8402b231f7ce52d7518aba64c66a1bfaeeaf43fa6e39b6e18150"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.ts",
    "blob": "dd6579a7b67c9b31385e4f10f427d1e0b1b02be1",
    "sha256": "a5d8128d8b2eb7d2baa8de9c2457484c5bcedd8b9e6624eb93526e2f00e063b0"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.ts",
    "blob": "ee418262e6ad475460bd7c17f048bbde33147802",
    "sha256": "bae60431f261b98f58cafe75e4909e93488ea93fab197c17a2d4895850701dd8"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10Current32BootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","128aefddb8409f3eff9b4e8f6e5e1ab82b631b9c","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","29bbd941128fe79c825450f0541f630b45b995d8","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","3374da0e4421c30bd34d5b93b9ac71746f6fc699","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","41dd08636532c4930666c76b109526d293186699","50240fb1d59a1f8d298718f85e58bd55b4b990c2","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","baf80e18e0fb7a6a961006ee6fea507539363756","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","d4267f2011fbfc3f36ac0e10b277dbf42c27a9c3","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10FreshGit=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "dd6905c9e786da791b8a0d519e4eefc876ffa71d",
    "sha256": "dd9ce548363f44a43fcb074ae487ddc3b8de5b9e510064ec5a28a3988700ebfb"
  },
  {
    "path": "tests/completion-wave-20261113/source-authority-preload.test.mjs",
    "blob": "79e04abc17e392544bbfe309594da08476a5f924",
    "sha256": "c41ac9b007b51cdb7644e2a100961f6082e38242999b40a503b0758112c9a437"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "46043973c61b7c7cfc094018d9d35dd3936290b3",
    "sha256": "8deb240ca2fa468408bf43a789fa6508ebae23640e30398357765cb7e19abff4"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-live.test.mjs",
    "blob": "543feb04030471636e9815feb76a7c8df58e2e80",
    "sha256": "2aa4f7f3d2bc83b391ced2a3170a63e5060cf697f4295c23e2f67bbc767a40da"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-fresh-git.mjs",
    "blob": "8733487229f747330ce03acb7a69b7da0ebb0a94",
    "sha256": "0a8db06201b73371c366d9d1d0405e7d76f3c1e3643cec64609fcc1abe54f265"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "d8048c10bc97e1338b6ff30f47016419d19bef65",
    "sha256": "e7fcd19bcf5e235002d0053cc8678468787244c62c62357681843b191c5573d4"
  },
  {
    "path": "tests/next-engineering-20261115/source-fresh-git-mandatory-children.mjs",
    "blob": "73070e176b9e91a07c952216c4025beab580b48c",
    "sha256": "c3d8456fa038d01a9990753d96e8409124c861c36a7bd74ae5700a035255eaf3"
  },
  {
    "path": "tests/next-engineering-20261115/source-private-git-broker.py",
    "blob": "cf196c6a0964ab84877f40c03ab3f9a3b2d645f3",
    "sha256": "7f5f8b8846e6b2baa1f89168020ebad70271792aa33f27c640b6e34c5f1c7c07"
  },
  {
    "path": "tests/next-engineering-20261115/source-private-git-images.mjs",
    "blob": "5dd453f5897cdbcfe67d45ae9ea3321f27b100a5",
    "sha256": "65d49219eda00d73a4b008487699e94d256beb342f4943933dc22246a6a421c2"
  },
  {
    "path": "tests/next-engineering-20261115/source-private-git-lifecycle.test.mjs",
    "blob": "dce31d9503b59f4b6d0b206f70b97f81d6cd2e0e",
    "sha256": "0ab3980bcb16153b622204540ef2ca0aba782ea9473781c5760fed47e27585ca"
  },
  {
    "path": "tests/next-engineering-20261115/source-private-git-stream.test.mjs",
    "blob": "b05fdcabae01db5aec35c78dde3e1630f7376607",
    "sha256": "25cdec82569bbaca309cc987c39a251e3850454e82e2d20fa4d55f8082fa6218"
  },
  {
    "path": "tests/next-engineering-20261115/source-private-git-transport.mjs",
    "blob": "5892f76a76ba3c98cd1bf7d82574537e35067036",
    "sha256": "162b5c6445726f994a9c031c3a7651ecfe9efbc1044c56ce9bf18d12f809db61"
  },
  {
    "path": "tests/next-engineering-20261115/source-private-git-transport.test.mjs",
    "blob": "a09af773f5548fae3f93e17ccd8bdc79f2beda42",
    "sha256": "011dbdadce6dee1d7845b1480d94478772da4c18e7f89402ee7a219efa43fe5d"
  },
  {
    "path": "tests/next-engineering-20261115/source-private-git-worker.mjs",
    "blob": "c43f7aa24463464b2a3ede6332d22368431d58a1",
    "sha256": "3738a31a1a551918a3c568dcd50c77bc77d24b186b57f27e17550a2b72b0bc8a"
  },
  {
    "path": "tests/next-engineering-20261115/source-runtime-native-git.mjs",
    "blob": "92b3f10a8a827d5a2f6d0db30823f289f57d7333",
    "sha256": "fc7072dea3d04e4db1d2c53e3b7ae1edc8aa42596af5810d483f229537fad7ce"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage10.mjs",
    "blob": "b207118938bbde265f4bd1409a6c290fccb99196",
    "sha256": "a2a0822fb44f513811745b4ce9ce07fe00bb6263348f2684173e1411ce9dda48"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "c287453d176a5da1fcce7ff17e1fc30f403d646c",
    "sha256": "ae97579bfd7aef6d140b413c39d95aebb1b503193b5c43dec6f01cdf09ff7a77"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "27bb55bfeb223d37349d5db512a0bf1186e412ad",
    "sha256": "e88438779977dfd65a863f38df17026afa80a7217d44a526c6d8696963eb9cc1"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-fresh-git.json",
    "blob": "2e01e6572ef68294764b9c3a23dfb556631bfbab",
    "sha256": "37d2ed908f64ea6107e3f6734fb6356a77b5ff731c5b640674807a9e5e8f8f65"
  },
  {
    "path": "src/calculators/catalog-reviewed-standard-evidence.test.ts",
    "blob": "4e49783b788cfc46129407bbfe79ea79e5245529",
    "sha256": "b0acca517d28ba8bf10b52c921c9db23cad63e0b86b14b78c9e38df2a2d8a726"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/exports.ts",
    "blob": "3d4cd9e61fa404e8fac8ee13f3e41d6add04c614",
    "sha256": "2ee65284cfd31a6924a86afd66aad070ed6abb8c021d3c68e3962e8c056d6240"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/completion/scoped-engineering-delivery.test.ts",
    "blob": "85a5099f0eddac9ed86cc657eaee7b5b7eec79d5",
    "sha256": "79643aff70c0fa1b8bfe46ae19fb833180328dd9c8931eaa7f4fee68a7ecceb8"
  },
  {
    "path": "src/lib/calculator-factory/completion/scoped-engineering-metadata.ts",
    "blob": "6f7ce95e24b0c2fb11c55cb553b658006fad90e0",
    "sha256": "775f343f4ab27930ddc52e0b34108e600177e0c7a0df6e268ac1050ad2f999dc"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "933613d419c1c70b64ffafd275fde6b7c3fae592",
    "sha256": "9d7e7acadaada029ecd733465ea11bcde3c215bb3e18ea6c434ff46c9ffedac8"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "b0e76cbbf3e7de8e895136e52a3b608f65b73a15",
    "sha256": "4b8f2e679ce59962a3e5d47e732c104f75776857984c36b0c59082148869cca6"
  },
  {
    "path": "src/lib/calculator-factory/workflows.ts",
    "blob": "51cdfb37b131959494e462c00d8b7a89ec958bd5",
    "sha256": "fd85e9a03a46aeea2149a08bdc70553779a72f9470c7a1949a4914692d4fb833"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "blob": "3d25a974c6c821504d1c9df1b3540be1fed6d410",
    "sha256": "57e4fea16e8d8402b231f7ce52d7518aba64c66a1bfaeeaf43fa6e39b6e18150"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.ts",
    "blob": "dd6579a7b67c9b31385e4f10f427d1e0b1b02be1",
    "sha256": "a5d8128d8b2eb7d2baa8de9c2457484c5bcedd8b9e6624eb93526e2f00e063b0"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.ts",
    "blob": "ee418262e6ad475460bd7c17f048bbde33147802",
    "sha256": "bae60431f261b98f58cafe75e4909e93488ea93fab197c17a2d4895850701dd8"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10FreshGitBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","128aefddb8409f3eff9b4e8f6e5e1ab82b631b9c","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","29bbd941128fe79c825450f0541f630b45b995d8","2b74b7a5c81bbae7625451df4f7f082b5452093b","2eec0252f1d9e948b8efd16fe65588d3dc96cb39","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","3374da0e4421c30bd34d5b93b9ac71746f6fc699","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","50240fb1d59a1f8d298718f85e58bd55b4b990c2","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7daa22baccfcb52761d43ad8bd6f58636a977def","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","d86baf8d3fb8def0d322a40949b883b89a17d18c","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10Binding32=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "a945362991553fa682b1b9b101050ebc26df23e7",
    "sha256": "f811f32bfc307bbc61d43fe735c826f099685c3701111ea939dcc064d52913c7"
  },
  {
    "path": "scripts/software-closure-evidence.mjs",
    "blob": "54057111b36916e7cc6a4de34f75757a5bef5ee7",
    "sha256": "92592286eae0f2ee268cdf7d4f78ccef46115655b5430f785d5de3fcca25494d"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "29150688274c3b5edaccefbcca1070e8b74a0e82",
    "sha256": "4a936bff5ea8f736ff3dbd1f51e9b41f23ce304f3e3f256c90be34b6d4767c6d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-negative-factory.test.mjs",
    "blob": "f772e7681a20a21d41408e2f6bdff47261e486eb",
    "sha256": "fcd1266ecaa400cb07da5ff8098fb7f94b6d2eba1c70b062315c8f0f00942e59"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-binding32.mjs",
    "blob": "8e55a3327bc162dc33387013a27336c7912b50bc",
    "sha256": "2b08e56eb6a44da23946719db0dbf600bb4c80cdfa90475c2d73c9720e2ace06"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "8a3525a04de02b079e3cf8a9030bcee2748a74a7",
    "sha256": "827b89b6ce01313fb68a5d687b79f031616a1cef5470733f01be61575a21c295"
  },
  {
    "path": "tests/next-engineering-20261115/source-binding-current32.test.mjs",
    "blob": "78a855afd3c764fbac6c3ae7d0ed5b23f04fa28a",
    "sha256": "8554ea9ce7a0257ad9f404f3b50b011e1b826ee5bee2ad7560df3c191ea047d6"
  },
  {
    "path": "tests/next-engineering-20261115/source-fresh-git-mandatory-children.mjs",
    "blob": "9ec7a247dcc08feab895555bee77a5e4af63ebea",
    "sha256": "99c57c419afacca23e8fd95acf7025992cf3f83f3c10c0fc45983fcdeed4bc3f"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "85269e515e218c10a3dd7ae160f8ef7b8cc5c6ef",
    "sha256": "d9e81de75dd4a1254a0285978cd9cd9e137164739af0ef21e46619648a536d09"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "92af4d0bf2fad28a9d644e92108f030e416debec",
    "sha256": "e3cd74ca9e69441e14090733e94ecd69ede7537f771987059d390ca96f7a6a38"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-binding32.json",
    "blob": "4675b917ef334f495f8fb976a75b4c1cfc73a638",
    "sha256": "b3bca7842206e25f67760269a41da09b174ef53a2f8d5b98e12c7c073247e72c"
  },
  {
    "path": "src/calculators/catalog-reviewed-standard-evidence.test.ts",
    "blob": "4e49783b788cfc46129407bbfe79ea79e5245529",
    "sha256": "b0acca517d28ba8bf10b52c921c9db23cad63e0b86b14b78c9e38df2a2d8a726"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/exports.ts",
    "blob": "3d4cd9e61fa404e8fac8ee13f3e41d6add04c614",
    "sha256": "2ee65284cfd31a6924a86afd66aad070ed6abb8c021d3c68e3962e8c056d6240"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/completion/scoped-engineering-delivery.test.ts",
    "blob": "85a5099f0eddac9ed86cc657eaee7b5b7eec79d5",
    "sha256": "79643aff70c0fa1b8bfe46ae19fb833180328dd9c8931eaa7f4fee68a7ecceb8"
  },
  {
    "path": "src/lib/calculator-factory/completion/scoped-engineering-metadata.ts",
    "blob": "6f7ce95e24b0c2fb11c55cb553b658006fad90e0",
    "sha256": "775f343f4ab27930ddc52e0b34108e600177e0c7a0df6e268ac1050ad2f999dc"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "933613d419c1c70b64ffafd275fde6b7c3fae592",
    "sha256": "9d7e7acadaada029ecd733465ea11bcde3c215bb3e18ea6c434ff46c9ffedac8"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "b0e76cbbf3e7de8e895136e52a3b608f65b73a15",
    "sha256": "4b8f2e679ce59962a3e5d47e732c104f75776857984c36b0c59082148869cca6"
  },
  {
    "path": "src/lib/calculator-factory/workflows.ts",
    "blob": "51cdfb37b131959494e462c00d8b7a89ec958bd5",
    "sha256": "fd85e9a03a46aeea2149a08bdc70553779a72f9470c7a1949a4914692d4fb833"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "blob": "3d25a974c6c821504d1c9df1b3540be1fed6d410",
    "sha256": "57e4fea16e8d8402b231f7ce52d7518aba64c66a1bfaeeaf43fa6e39b6e18150"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.ts",
    "blob": "dd6579a7b67c9b31385e4f10f427d1e0b1b02be1",
    "sha256": "a5d8128d8b2eb7d2baa8de9c2457484c5bcedd8b9e6624eb93526e2f00e063b0"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.ts",
    "blob": "ee418262e6ad475460bd7c17f048bbde33147802",
    "sha256": "bae60431f261b98f58cafe75e4909e93488ea93fab197c17a2d4895850701dd8"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10Binding32BootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","128aefddb8409f3eff9b4e8f6e5e1ab82b631b9c","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","29bbd941128fe79c825450f0541f630b45b995d8","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","3374da0e4421c30bd34d5b93b9ac71746f6fc699","33a13a926c8d0b15cf34a3ff8d5cb86ff150fb81","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","50240fb1d59a1f8d298718f85e58bd55b4b990c2","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","9331292abc6a342b2e8004e23ce8e40468aca045","939ea3b6ab204b0b5c12d3724949f0d85b62e0c8","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","aaf369e67096718fd3bfff3d86c9c8e861a1cd42","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf","f94521a5c3a038dfd725c870cc27061ecf3376b5"]);
export const acceptedStage10Stage9Fixture=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "41a40afe7b62219fcdf59867190844acb4ea34b5",
    "sha256": "d741ef6e13c7b228b96794b4d4adb390aa2695e544ce2b328296665a0fb114fd"
  },
  {
    "path": "tests/four-worker-integration-20261115/source-stage9.test.mjs",
    "blob": "c55dbd5e38bdec48d55baa8d86f31a2df583ef54",
    "sha256": "2ceae86734edcc53070688d8e4a1a87e9c5195df216d1881f9cfe1118266d7b5"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "36f20250bc0a945901e0d8a2c0747caebf021bae",
    "sha256": "2444ca5d043c060d5659dc7de43856785f462def4a2b5e6454c9e9088d1ebad9"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-stage9-fixture.mjs",
    "blob": "3c5e7325ef15ce0283c3b502a3f5500663ae7e8e",
    "sha256": "788a8f339ed001eae774163dfd0c3fccbba5809054a2a524be20951252d48501"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "87e49f9ad27443b974013984a44ad8cbc16f2847",
    "sha256": "028f55c39773a461c3b7f35dd4e960857cd9dd54c6e963905657af83b6093e03"
  },
  {
    "path": "tests/next-engineering-20261115/source-fresh-git-mandatory-children.mjs",
    "blob": "494d8890eeb05c73b262b0a22988ce518fc44d10",
    "sha256": "f14fa543e88943c3006d20d6f551d74f7b9e9b6dfeb48df788ef271db677ddcb"
  },
  {
    "path": "tests/next-engineering-20261115/source-stage9-fixture.test.mjs",
    "blob": "a4cffcdef66716cb069014fead91d06620bd68d7",
    "sha256": "07c0e539635a1244e1c8c93e1b7948e84a7b83103b12d6040f886b241274e464"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "df7da4b8888177ad717f75e5a2afdebfc6f08df2",
    "sha256": "dfe1e59a7f835b44daeb33ce7054f1d0434b5f3f022102f6718046b5821ef19e"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "f835cd2c280d00011619434f560fe921c3a0c0d5",
    "sha256": "bdb022726f8fea35ab7f6655d1df64ba28e8c48cc2048d22ccf197424aad663e"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-stage9-fixture.json",
    "blob": "f51571b32bf21707982e9cf6196fbaab80c407f4",
    "sha256": "727c4a68dd6473d5ced8d1b1b6f54613af7119a978e21923050df8d334601bdd"
  },
  {
    "path": "src/calculators/catalog-reviewed-standard-evidence.test.ts",
    "blob": "4e49783b788cfc46129407bbfe79ea79e5245529",
    "sha256": "b0acca517d28ba8bf10b52c921c9db23cad63e0b86b14b78c9e38df2a2d8a726"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/exports.ts",
    "blob": "3d4cd9e61fa404e8fac8ee13f3e41d6add04c614",
    "sha256": "2ee65284cfd31a6924a86afd66aad070ed6abb8c021d3c68e3962e8c056d6240"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/completion/scoped-engineering-delivery.test.ts",
    "blob": "85a5099f0eddac9ed86cc657eaee7b5b7eec79d5",
    "sha256": "79643aff70c0fa1b8bfe46ae19fb833180328dd9c8931eaa7f4fee68a7ecceb8"
  },
  {
    "path": "src/lib/calculator-factory/completion/scoped-engineering-metadata.ts",
    "blob": "6f7ce95e24b0c2fb11c55cb553b658006fad90e0",
    "sha256": "775f343f4ab27930ddc52e0b34108e600177e0c7a0df6e268ac1050ad2f999dc"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "933613d419c1c70b64ffafd275fde6b7c3fae592",
    "sha256": "9d7e7acadaada029ecd733465ea11bcde3c215bb3e18ea6c434ff46c9ffedac8"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "b0e76cbbf3e7de8e895136e52a3b608f65b73a15",
    "sha256": "4b8f2e679ce59962a3e5d47e732c104f75776857984c36b0c59082148869cca6"
  },
  {
    "path": "src/lib/calculator-factory/workflows.ts",
    "blob": "51cdfb37b131959494e462c00d8b7a89ec958bd5",
    "sha256": "fd85e9a03a46aeea2149a08bdc70553779a72f9470c7a1949a4914692d4fb833"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "blob": "3d25a974c6c821504d1c9df1b3540be1fed6d410",
    "sha256": "57e4fea16e8d8402b231f7ce52d7518aba64c66a1bfaeeaf43fa6e39b6e18150"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.ts",
    "blob": "dd6579a7b67c9b31385e4f10f427d1e0b1b02be1",
    "sha256": "a5d8128d8b2eb7d2baa8de9c2457484c5bcedd8b9e6624eb93526e2f00e063b0"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.ts",
    "blob": "ee418262e6ad475460bd7c17f048bbde33147802",
    "sha256": "bae60431f261b98f58cafe75e4909e93488ea93fab197c17a2d4895850701dd8"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10Stage9FixtureBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","128aefddb8409f3eff9b4e8f6e5e1ab82b631b9c","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","29bbd941128fe79c825450f0541f630b45b995d8","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","3374da0e4421c30bd34d5b93b9ac71746f6fc699","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","50240fb1d59a1f8d298718f85e58bd55b4b990c2","50c282932739f2eef6885a0929f8aaf87f1d0abb","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","5b2b88ca5d96a449e81172e248164762e6ae60ce","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b3f19a897bc564e0bee079ae5d7c80b6b6a5e8ae","b809c807f645029814921b51f015a998e86869a8","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10FixtureBindings=Object.freeze([
  {
    "path": "scripts/fetch-source-lineage.mjs",
    "blob": "6fdd7550440c1c901fa2c3039bc5c6fe5cc8893e",
    "sha256": "c5c4739f09235232d3681c3de166c9937d0ad9fe6120dd25fe3ee58ee5dd3666"
  },
  {
    "path": "tests/execution-recovery-20261109/source-lineage.test.mjs",
    "blob": "6df550e6f20142ce54abb61d6054eed96d19749b",
    "sha256": "c9c38742eb1b0c714dbce70d82401eb504510406f2caa8c562f23d21721ccefc"
  },
  {
    "path": "tests/milestone100-20261114/source-preflight-stage8.mjs",
    "blob": "e9c0e1cf10562302c0d3073c192111853997bbf0",
    "sha256": "a76fb84ab3d3e9e4cebe094b02e42f8c9de3a8d36701244e3fd1dbf8b91b679d"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-guard-selection.test.mjs",
    "blob": "02ac5f3d0fb9ed823abadb8d2b9bee6500bcf787",
    "sha256": "0396ac440bda19c8f83fe9a07e5c34cc9106d9c21a67a7a3d91b6631498a0226"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-current-selection.mjs",
    "blob": "73c08c28e7003f03fd61863ddc857cfbc31deb84",
    "sha256": "6f117bab3763009f38cc8553e41463e27724a6f37e6173c78655c42f0480724f"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-runtime-current-selection.test.mjs",
    "blob": "479c0b9300fae7c77405786b60ecc0670ed7ad77",
    "sha256": "88fe7b6857a7754f227fc58554e80e4843f19101d62362492c7037aa8471a98e"
  },
  {
    "path": "tests/milestone100-20261114/source-stage8-shortest-guard.test.mjs",
    "blob": "ead43f8bd0865e9b93c519fcc42b84ef437604b7",
    "sha256": "8c686b5d21f5314085dc4fd8d958577c7ad04e698c587dc7a3996ed13c5b0981"
  },
  {
    "path": "tests/next-engineering-20261115/source-admission-fixture-bindings.mjs",
    "blob": "ce7dd445668ad20367928e2762bec010551507e3",
    "sha256": "422c9e53f94b5bfea57449f9efb5403fbeb8cc17d9c5ac6e409cca5e53a50bb7"
  },
  {
    "path": "tests/next-engineering-20261115/source-availability.test.mjs",
    "blob": "1634bc8613a8dd470fcc603b3778e419ee6e64b6",
    "sha256": "6e62cffff34df52305fb84f2e1a20c7bd0e0bca012cdf678c25294f75d4b3f5c"
  },
  {
    "path": "tests/next-engineering-20261115/source-fresh-git-mandatory-children.mjs",
    "blob": "3bc74594ba78d3ac3a6c6c11cbefc7d8c0122bb9",
    "sha256": "14fd62e63426fefa31cea6c3f3bb10046982340416baad1c3eafee28441805fb"
  },
  {
    "path": "tests/next-engineering-20261115/source-lineage-fixture.test.mjs",
    "blob": "a81b6b6f6520594af47fd2e32627c2f8da2d20ca",
    "sha256": "a921d857df590afef64f7ed64a43b00f5241026158a2d07978539691e370a9cb"
  },
  {
    "path": "tests/parallel-source-20261110/bootstrap.mjs",
    "blob": "b881ff81a6ffb2bcba32e26589ad3c2ff0ac9b21",
    "sha256": "93f875063bb1a707c55260efac91f1f6d6b1cc539da42111a9daec57df82602c"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "d6ee2b154f7363e7db25102eacb3937645e7f77b",
    "sha256": "6ba29828632e402f79dad0f28872e9b347c30ff4a88c23d2e5615e3eea7e9bd5"
  },
  {
    "path": "docs/next-engineering-20261115/source/guard-capture-fixture-bindings.json",
    "blob": "e7a3418e2ca5eab3b51f902138f517e3b218aeb0",
    "sha256": "137bdb62b7fe11ff609b3121c74cc6ef9ec9ef280a80de337970e53dd31eab59"
  },
  {
    "path": "src/calculators/catalog-reviewed-standard-evidence.test.ts",
    "blob": "4e49783b788cfc46129407bbfe79ea79e5245529",
    "sha256": "b0acca517d28ba8bf10b52c921c9db23cad63e0b86b14b78c9e38df2a2d8a726"
  },
  {
    "path": "src/components/calculator-factory-portal.tsx",
    "blob": "897b31ce2bf64e94031b3004fa8b01123ce56043",
    "sha256": "3e6c088ded6f0bc05e2893fc830e166b3149c9f5578f157698944aa0a3609320"
  },
  {
    "path": "src/components/next-engineering-analysis.test.tsx",
    "blob": "1f6c6a9664cc29e9de76af4b8fea3139b964bd80",
    "sha256": "99b7a1065acc24e7810c2771f93c769155023b0e6650a145ed2ab91f69d3ecf8"
  },
  {
    "path": "src/components/next-engineering-analysis.tsx",
    "blob": "3b6034b058488a14ffdd8d2982ed7b8eb15191ec",
    "sha256": "7a3358c374a3ae1d6d81b7fa97e0cab26f7bfb80a785de8f6aac6f7b0ef0ec2c"
  },
  {
    "path": "src/lib/business/factory-nine-sharing.test.ts",
    "blob": "e9d2548dd59a4d3eb66eba5ab720752672197f63",
    "sha256": "a65f9576fbbb391ce14e21cefd68e75572028bd4900bdcb6cca3751f4ede3273"
  },
  {
    "path": "src/lib/calculator-factory/completion/business.ts",
    "blob": "472c79202852618e27cc3af19d801b41cebc8ce2",
    "sha256": "a92bf9b766442834deb217c65ee14c0c8c36594f02c75f8f0a863414d3f215ea"
  },
  {
    "path": "src/lib/calculator-factory/completion/exports.ts",
    "blob": "3d4cd9e61fa404e8fac8ee13f3e41d6add04c614",
    "sha256": "2ee65284cfd31a6924a86afd66aad070ed6abb8c021d3c68e3962e8c056d6240"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.test.ts",
    "blob": "30a9522fad7f0e8b7795af9ba70e844e22d966fe",
    "sha256": "b9dbfe201541b15175dbc9043ec2cfae0839f1503b4600626cbfada4c1d006eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-a.ts",
    "blob": "434023f3f8ba88c4e9c7477751f935b9e1ab898f",
    "sha256": "d03e9bb0c3a59f5b232b68ffea3205297a07c49b0016fae1b04bf0b9d9ded37a"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.test.ts",
    "blob": "f001871a1cab16ce1a5b3755a1e4bedace179f68",
    "sha256": "464aef407d0f024d76401adf232114d32e4c0a971b007d0d24288331c87aba46"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-chemistry-b.ts",
    "blob": "b688d2646831bf922a197131741cb6d654ff42c5",
    "sha256": "835435adab7b7c2caab0c8e045e041f94009d779cfe4a59d9d99717502444580"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.test.ts",
    "blob": "706908108d8967f2efa78fd08f0d7064b78d4dc8",
    "sha256": "045d1b30bdf9144ee31673665da1879359bdb90d86c25be031bdacbb9dc9a2eb"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-core.ts",
    "blob": "8fe50d2a203e228dfb9285c08c887604218a55b7",
    "sha256": "b50db1e836a0a0858281005dc384cf312ea7fba117a14257020cc962e1ce33ec"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-integration.test.ts",
    "blob": "e4e7641c64fd603adc886adb0b4bef98d7142bba",
    "sha256": "73e69998be3678a787cbaaf016a8a980fe267ec958acf472c7eaeddd86ce6d24"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.test.ts",
    "blob": "190ea72b11ff688b6f818518f9e24ff3d6da43fd",
    "sha256": "1424ba796264a7bce6cea3b0bb8a6fc747a192f351b0be43c159ca4344fc7b21"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-a.ts",
    "blob": "599eef3451d3c6e985437fc1d1aab2a1efc3788a",
    "sha256": "3fcbab24b57ff249d77477370ae4dca301e729245ef2591e01719b34962eb755"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.test.ts",
    "blob": "3154c6b181efb63851e0725d4351ac6d95285622",
    "sha256": "4957ce204c5d16eb3a202664c28ca8c4fabe79f6b0ac6c025fd3744cac361808"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering-statistics-b.ts",
    "blob": "2d0a6175d9a7c07a6f1b3f5c7accd648529d7a25",
    "sha256": "3ac2447f87852d50ba76f51aa852964116fab7a9cf7e3269df932d35e0204b5b"
  },
  {
    "path": "src/lib/calculator-factory/completion/next-engineering.ts",
    "blob": "3467dca9540bdcae09b692ae6bd87d321e6f03c2",
    "sha256": "82ba8f13c54e165b2a4d56420a7e65df4d99da453329f7040cff7d162cea1ad4"
  },
  {
    "path": "src/lib/calculator-factory/completion/scoped-engineering-delivery.test.ts",
    "blob": "85a5099f0eddac9ed86cc657eaee7b5b7eec79d5",
    "sha256": "79643aff70c0fa1b8bfe46ae19fb833180328dd9c8931eaa7f4fee68a7ecceb8"
  },
  {
    "path": "src/lib/calculator-factory/completion/scoped-engineering-metadata.ts",
    "blob": "6f7ce95e24b0c2fb11c55cb553b658006fad90e0",
    "sha256": "775f343f4ab27930ddc52e0b34108e600177e0c7a0df6e268ac1050ad2f999dc"
  },
  {
    "path": "src/lib/calculator-factory/registry.test.ts",
    "blob": "933613d419c1c70b64ffafd275fde6b7c3fae592",
    "sha256": "9d7e7acadaada029ecd733465ea11bcde3c215bb3e18ea6c434ff46c9ffedac8"
  },
  {
    "path": "src/lib/calculator-factory/registry.ts",
    "blob": "b0e76cbbf3e7de8e895136e52a3b608f65b73a15",
    "sha256": "4b8f2e679ce59962a3e5d47e732c104f75776857984c36b0c59082148869cca6"
  },
  {
    "path": "src/lib/calculator-factory/workflows.ts",
    "blob": "51cdfb37b131959494e462c00d8b7a89ec958bd5",
    "sha256": "fd85e9a03a46aeea2149a08bdc70553779a72f9470c7a1949a4914692d4fb833"
  },
  {
    "path": "src/lib/completion-wave-20261113/sql-successor.test.ts",
    "blob": "c44d3a8d434e84287a88980800a31503472eb67f",
    "sha256": "acf845d5b44140a490157c75dcfa9adc6d7b2a45facdefdae1d930b922c4ce99"
  },
  {
    "path": "src/lib/five-full-contract-evidence.test.ts",
    "blob": "3d25a974c6c821504d1c9df1b3540be1fed6d410",
    "sha256": "57e4fea16e8d8402b231f7ce52d7518aba64c66a1bfaeeaf43fa6e39b6e18150"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.test.ts",
    "blob": "648d6da59de72e2c9776e3b814db517796d2e678",
    "sha256": "bd53184b4f10c10f29c6ba4f7c1e1149a03388a2264655bce8ab1e1385525676"
  },
  {
    "path": "src/lib/native-delivery/factory-automation-contract.ts",
    "blob": "dd6579a7b67c9b31385e4f10f427d1e0b1b02be1",
    "sha256": "a5d8128d8b2eb7d2baa8de9c2457484c5bcedd8b9e6624eb93526e2f00e063b0"
  },
  {
    "path": "src/lib/native-delivery/factory-delivery-catalog.ts",
    "blob": "c6d7c371a962e8b1d01f0a725e3651786a426385",
    "sha256": "761c1a546635d3a4ab34302d3a7326d3b0a5bea7769181d876ab27d8b274a9be"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.test.ts",
    "blob": "0557d900af11db5ab634461bb5ace0642dce5824",
    "sha256": "e9886a19526a02743646ef9ed85771a438b4e27ba04c91ba0de09fadc1fca538"
  },
  {
    "path": "src/lib/native-delivery/factory-embed-contract.ts",
    "blob": "ee418262e6ad475460bd7c17f048bbde33147802",
    "sha256": "bae60431f261b98f58cafe75e4909e93488ea93fab197c17a2d4895850701dd8"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "f01ce77d1e69e537e0c11a94204f3730d021cda8",
    "sha256": "7858d334f0abaf70b91bab8ae1f8681ace559f49a16c7b334867d4ab48c576b9"
  }
]);
export const additionalStage10FixtureBindingsBootstrapRefs=Object.freeze(["09cf034d0a5f8f2ac82352cb3118ae8374e56294","0ec51bf308caa466840d3344a7572dc79c67d089","1034034ddb3c106eb7695f90f8f7d429b6dfc9c7","128aefddb8409f3eff9b4e8f6e5e1ab82b631b9c","13298943d7357e4593c25772c3e7d9db118db623","26c222457278bf69b4f351d0cc100de47ca9eb33","29bbd941128fe79c825450f0541f630b45b995d8","2b74b7a5c81bbae7625451df4f7f082b5452093b","2f74af87d1ce41b5aa229a401baa55ac7a3c0d22","3374da0e4421c30bd34d5b93b9ac71746f6fc699","347c9e6569d6b6a9c141c926042e3cf7ecc3e641","3674ec4b0dcdb909b8b00d6b3dccc892ab95e01d","379997d86b163f5dc7e95de76e26fa055361a2d1","38a495e4277fb7ec8423e9fd0107b4ccc599848e","3990380c589ee377a77f32cf3fc69703c679e8ec","3ccdd6d026ca0ec51063ff4501901ac92e8ace6a","50240fb1d59a1f8d298718f85e58bd55b4b990c2","550ae67dfdf8fcfa8fb0ac68ccbe2ac68e13fb0f","568ea8520dbf58f1e7823f095e32d2cc57333c33","5a29f5341bebab0dda2165a49d3fed9e6109e6f1","7629d5a032f516a3c7f1bec5fb6e991c2f7a992f","77eb196e5606bf87ee3cf67326d9fc4354cfef45","7e65c1fe521116d247688b8f11edd4bab4af6f4e","7fd9e40cb69ccfee70924e6dd6c2bc393a0043f8","80e52c5cd5d89cd88826ad5b06378431f4cf693b","822743dd987bc2f07e52ab07a3c2ef4ab05f625f","8aaa1886a0dee4b7ae1bd6349078731139afd46a","8bcca5a9b3e9eab62f77a7051c0e4f532d35ddfa","8f8b9b03f070d3279351c02d6573ce528e99a1b4","955f860712e938c9d1140e4fda41ff1535c53272","99e7bd0de151456e78fe49dfbf55511e7df98c5f","9cb48d726ae3754393b90d2c8afae1e9218f9079","9d00f1ef8690f7bf8a23b6b7860f78f9b67838ca","a1763782389314a209be4fbf89f7224cd4faaf12","a931482f3972bda57dcf966fce9a3bbe9b4d8320","b8694256532a2f13a5808c426e0c54e104d1775b","cb652516a1e8b1dc4f908f3cb6f85a6cae02d864","e84aba4ed0624aaac53f80df0ddcc380e4ff653d","e8b7fb2df91dbd1b0efc77ae3a120754295c68e3","ebf9553952e51c8ef2b534c5e30007621938d9cf"]);
export const acceptedStage10LineageContract=Object.freeze([]);
export const additionalStage10LineageContractBootstrapRefs=Object.freeze([]);
export const accepted=Object.freeze([...new Map([...acceptedBeforeStage8,...acceptedStage8,...acceptedStage8V3,...acceptedStage8V4,...acceptedStage8V5,...acceptedStage8V6,...acceptedStage8V7,...acceptedStage8V8,...acceptedStage8V9,...acceptedStage8V10,...acceptedStage8V11,...acceptedStage8V12,...acceptedStage8V13,...acceptedStage8V14,...acceptedStage8V15,...acceptedStage8V16,...acceptedStage8V17,...acceptedStage8V18,...acceptedStage8V19,...acceptedStage8V20,...acceptedStage8V21,...acceptedStage8V22,...acceptedStage8V23,...acceptedStage8V24,...acceptedStage8V25,...acceptedStage8V26,...acceptedStage8V27,...acceptedStage8V28,...acceptedStage8V29,...acceptedStage8V30,...acceptedStage8V31,...acceptedStage8V32,...acceptedStage8V33,...acceptedStage8V34,...acceptedStage8V35,...acceptedStage8V36,...acceptedStage8V37,...acceptedStage8V38,...acceptedStage8V39,...acceptedStage8V40,...acceptedStage8V41,...acceptedStage8V42,...acceptedStage8V43,...acceptedStage8V44,...acceptedStage8V45,...acceptedStage10,...acceptedStage10Review2,...acceptedStage10Availability,...acceptedStage10Deadline,...acceptedStage10Lint,...acceptedStage10Selector,...acceptedStage10Current24,...acceptedStage10NativeBatch,...acceptedStage10Wrappers,...acceptedStage10Private8,...acceptedStage10FreshAuthority,...acceptedStage10FreshAdapter,...acceptedStage10ReaderFixture,...acceptedStage10ImmutablePreload,...acceptedStage10CanonicalHandoff,...acceptedStage10HeadBoundary,...acceptedStage10Stage5Negative,...acceptedStage10SevenNegative,...acceptedStage10InteractiveNegative,...acceptedStage10FixturePrewarm,...acceptedStage10SprintFixture,...acceptedStage10Current26,...acceptedStage10RuntimeAvailability,...acceptedStage10RuntimeTrees,...acceptedStage10ColdFixture,...acceptedStage10ReceiptFixture,...acceptedStage10PreflightJoin,...acceptedStage10Current32,...acceptedStage10FreshGit,...acceptedStage10Binding32,...acceptedStage10Stage9Fixture,...acceptedStage10FixtureBindings,...acceptedStage10LineageContract].map(row=>[row.path,row])).values()]);
for(const record of accepted)Object.freeze(record);
export function verifyParallelAuthority(read,git){
 assert(acceptedStage8.length>0,'Independently reviewed Stage8 authority is not installed');
 const view=sourceStage8HistoricalView(git);
 provePinnedSourceStage8({read,git,root:process.cwd()});
 const actual=view?.actualInput??{read,git};
 const records=view?[...accepted.filter(row=>!row.path.startsWith('src/')),...retainedStage8Authority.filter(row=>row.path.startsWith('src/'))]:accepted;
 // Symbolic identities are live once per invocation, never cached across calls.
 const actualHead=actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(actualHead,/^[0-9a-f]{40}$/);
 const historicalHead=view?git(['rev-parse','--verify','HEAD^{commit}']).toString().trim():actualHead;assert.match(historicalHead,/^[0-9a-f]{40}$/);
 // Only an originally supplied capability may batch immutable objects/paths.
 if(typeof actual.git.preloadBlobs==='function')actual.git.preloadBlobs(records.map(row=>row.blob));
 if(typeof actual.git.preloadPaths==='function')actual.git.preloadPaths(records.map(row=>({ref:view&&row.path.startsWith('src/')?historicalHead:actualHead,path:row.path,blob:row.blob})));
 for(const record of records){
  const input=view&&record.path.startsWith('src/')?{read,git}:actual,head=view&&record.path.startsWith('src/')?historicalHead:actualHead;
  assert.equal(input.git(['rev-parse',head+':'+record.path]).toString().trim(),record.blob,'Independent parallel HEAD authority differs: '+record.path);
  if(!record.path.startsWith('src/')){const target=resolve(actual.root??process.cwd(),record.path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink(),'Regular current guard required: '+record.path);assert.equal(realpathSync(target),target,'Redirected current guard: '+record.path);}
  const bytes=input.git(['cat-file','blob',record.blob]);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);
  const current=input.read(record.path);assert(current.equals(bytes),'Independent current target bytes differ: '+record.path);assert.equal(createHash('sha256').update(current).digest('hex'),record.sha256);
 }
 return true;
}

/** Fixed current-authority mode; no caller-provided proof, record selection or skip option. */
export function verifyCurrentParallelAuthorityAndSourceView(input){
 assert(acceptedStage8.length>0,'Independently reviewed Stage8 authority is not installed');
 assert.deepEqual(Object.keys(input).sort(),['git','read','root'],'Only explicit source read/Git/root inputs allowed');
 const sourceProof=provePinnedSourceStage8(input),actual=sourceProof.actualInput;
 const actualHead=actual.git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(actualHead,/^[0-9a-f]{40}$/);
 if(typeof actual.git.preloadBlobs==='function')actual.git.preloadBlobs(accepted.map(row=>row.blob));
 if(typeof actual.git.preloadPaths==='function')actual.git.preloadPaths(accepted.map(row=>({ref:actualHead,path:row.path,blob:row.blob})));
 for(const record of accepted){
  assert.equal(actual.git(['rev-parse',actualHead+':'+record.path]).toString().trim(),record.blob,'Independent parallel HEAD authority differs: '+record.path);
  if(!record.path.startsWith('src/')){const target=resolve(actual.root??process.cwd(),record.path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink(),'Regular current guard required: '+record.path);assert.equal(realpathSync(target),target,'Redirected current guard: '+record.path);}
  const bytes=actual.git(['cat-file','blob',record.blob]);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);
  const current=actual.read(record.path);assert(current.equals(bytes),'Independent current target bytes differ: '+record.path);assert.equal(createHash('sha256').update(current).digest('hex'),record.sha256);
 }
 return sourceProof;
}
