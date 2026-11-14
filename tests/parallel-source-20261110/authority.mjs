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
export const acceptedStage8V26=Object.freeze([]);
export const additionalStage8V26BootstrapRefs=Object.freeze([]);
export const accepted=Object.freeze([...new Map([...acceptedBeforeStage8,...acceptedStage8,...acceptedStage8V3,...acceptedStage8V4,...acceptedStage8V5,...acceptedStage8V6,...acceptedStage8V7,...acceptedStage8V8,...acceptedStage8V9,...acceptedStage8V10,...acceptedStage8V11,...acceptedStage8V12,...acceptedStage8V13,...acceptedStage8V14,...acceptedStage8V15,...acceptedStage8V16,...acceptedStage8V17,...acceptedStage8V18,...acceptedStage8V19,...acceptedStage8V20,...acceptedStage8V21,...acceptedStage8V22,...acceptedStage8V23,...acceptedStage8V24,...acceptedStage8V25,...acceptedStage8V26].map(row=>[row.path,row])).values()]);
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
