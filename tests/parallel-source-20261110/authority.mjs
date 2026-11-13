/** Filled only after independent review of an actual committed candidate. */
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
export const accepted=Object.freeze([
  {
    "path": "docs/parallel-source-20261110/capture-revision39.json",
    "blob": "eb661248ffe7626b55b54e5a628bd73bf84427d1",
    "sha256": "adcfa3cf4a82a0bf6cfa7a183454a2fc1c5d0c1eee3e70444924f85bc89ced8c"
  },
  {
    "path": "tests/parallel-source-20261110/core.mjs",
    "blob": "b32be276e215d2312f1229fe22948b4cdaba1b3a",
    "sha256": "5e096e36a2cf5202a63de16166d03f1e9a3b6ccdcd3f3f522906c1e5224f96c8"
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
    "blob": "ef7d8331b47e52c19f7c816620ae6d41cd6c7437",
    "sha256": "44a0d995bdfcdc3a2623ab8293d00138d33476e6bb4d4e755424d01c52ddd2b6"
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
    "blob": "b99536197099d5aebbf6f75641866558fc3afbfe",
    "sha256": "6ee2d6b5d4bf4fb7c6db9e56f6858db96c117a7a95e106d39a85726eef3935b7"
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
    "blob": "3acc1a2b7ecd0c044d12ba00b7ce0196edcde844",
    "sha256": "c30c3f79c034e646c11cb61a3a0b29bde3bbd0c8771abd298c9ae8f612f016b3"
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
  }
]);
export function verifyParallelAuthority(read,git){
 assert(accepted.length>0,'Reviewed parallel source authority is not installed');
 const head=git(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[0-9a-f]{40}$/);
 for(const record of accepted){assert.equal(git(['rev-parse',head+':'+record.path]).toString().trim(),record.blob,'Independent parallel HEAD authority differs: '+record.path);const bytes=git(['cat-file','blob',record.blob]);assert.equal(createHash('sha256').update(bytes).digest('hex'),record.sha256);assert(read(record.path).equals(bytes),'Independent current target bytes differ: '+record.path);}
 return true;
}
