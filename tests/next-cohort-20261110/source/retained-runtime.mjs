import {nonSourceRecords} from '../../completion-first-20261112/non-source-stage2.mjs';
import {runClosedSynchronousBatch,assertAPIEvidencePaths} from './runtime-evidence-batch.mjs';
import {proveNamedCurrentContext,preloadRetainedImmutableObjects} from '../../parallel-source-20261110/core.mjs';
import {readStage2HistoricalRuntime} from '../../completion-first-20261112/retained-runtime-stage2.mjs';
import {completionGitReader} from '../../parallel-source-20261110/git-reader.mjs';
/** Historical receipts retain their exact byte claims; current successors prove separately. */
import assert from 'node:assert/strict';
import {readFileSync,lstatSync,realpathSync} from 'node:fs';
import {resolve} from 'node:path';
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
  },
  {
    "path": "src/app/api/business/technology-five-shares/route.test.ts",
    "blob": "c79d519d89b28126e35f02c63bc1531f98614f92",
    "sha256": "14b78e888973182d1f0b3bc8c5b9078f7fe8818948cacf7674e3351f4018794a"
  },
  {
    "path": "src/app/business/projects/[id]/page.test.tsx",
    "blob": "afd6bfc41e6e9c9b11828fc9ba3bfb088abeae11",
    "sha256": "f0635df7a7fa341835e14aae0022f03f4396a9a14233fa2c60f1a7b09f32e6ef"
  },
  {
    "path": "src/components/catalog-engineering-review.tsx",
    "blob": "7fd8ee287cb05baea756f76639d5da9d8492057d",
    "sha256": "aefd1a3896b2dec7b65a248cf863b953c1e89c2d745d08df7cbe37e38a54f5b3"
  },
  {
    "path": "src/components/converter-cohort-20261110-examples.tsx",
    "blob": "379f1265a13539923cf6940ca133d2ee7cc4ffec",
    "sha256": "a8a1bd507958034117b192729d737ae70752487fbe8e9cf8f64e071607bf1023"
  },
  {
    "path": "src/components/parallel-completion-integration.test.tsx",
    "blob": "55d74d274f658443453461c8c37c07cddddde618",
    "sha256": "3452fd9961bd32b2fb9c578162ed4da3b350e500bfa78e84104d7b9dc29f9dd4"
  },
  {
    "path": "src/components/parallel-converters-evidence.test.tsx",
    "blob": "b87fbbcddff99fad931a79e71c12fa38cbea9895",
    "sha256": "1b533de27ff8a9ab1f545a8f6e8b97a099abe3458a6b6d6d9c147ef655d554c9"
  },
  {
    "path": "src/components/parallel-guided-business-evidence.test.tsx",
    "blob": "c02141ce81b93ac5f02c1bb89094f4e808e1d41f",
    "sha256": "89c15c204e4ce4ea9484c735141a7f85e02fe2bc0297e5316ac8bbb0b930c645"
  },
  {
    "path": "src/components/publication20-tool.tsx",
    "blob": "e04f45cf07ae73e801520bf975488d06c433e9ac",
    "sha256": "8b33b466dbe902dfe2f16e580f78c11482d3a960165e3649c3a20033cd51cb02"
  },
  {
    "path": "src/components/specialist-general-20261110-business-input.tsx",
    "blob": "14674af3689d1a59e30a16681a517d35c74195a3",
    "sha256": "aa913519a890a953d47b4515cb12ec1d83c913ba6e446ba102943d0acced15d2"
  },
  {
    "path": "src/lib/business/technology-next-sharing.test.ts",
    "blob": "e8758f162963a63e65ac2746d07f0b50f94edde5",
    "sha256": "0337b9b88ade20d62099911fe1e799e8d7239ba0a83885f79e1a973ceed10672"
  },
  {
    "path": "src/lib/converter-cohort-20261110.ts",
    "blob": "83bb23b30c8d3cefea8c644ec10c8760ac54c136",
    "sha256": "9f39796be584514de0b8f580a684df4f1314b211f92f3c584dea3222ed5244f5"
  },
  {
    "path": "src/lib/finance-cohort-20261110-annuity.ts",
    "blob": "6e66fe59ee7a08ab779021fecf2b765e1a37067d",
    "sha256": "2935e66dc51bc997c89c17f3a616a208d47b041e8b5dec342c97cd3861adc49e"
  },
  {
    "path": "src/lib/native-delivery/technology-five-publication.test.ts",
    "blob": "743d71ac91891ffcdb41d1017eb925a4664e24e4",
    "sha256": "aa4bbb70f4da137b081718b3dbc3453e4906c9330dbade179b8aa8bb630b6aa3"
  },
  {
    "path": "src/lib/native-delivery/technology-next-composition.test.ts",
    "blob": "1939e5cd6261505d30b07143cd79da035b751c1b",
    "sha256": "b34138e4006fb27130ea80a2f54fe7688f9edd3fdee41fffcf4f9f1a6cc66625"
  },
  {
    "path": "src/lib/native-delivery/technology-next-five-composition.test.ts",
    "blob": "4258a08d23002eed23d677cafbe8ffa82f36143d",
    "sha256": "f60e7e35c8e4b76e790081ce9f4d24fc07082246af1f31e9876e2eefbcff8d4d"
  },
  {
    "path": "src/lib/parallel-finance-qualification.test.ts",
    "blob": "670a6e22351eb44c925f6ba50a2acf1d85fa0fa4",
    "sha256": "bec9018b9fb417419b1edbb297d087a830f9b6f795a158d83ae3326bb5ece5d4"
  },
  {
    "path": "src/lib/parallel-readiness-evidence.test.ts",
    "blob": "81d9126f601663e3c440b566b20fb4112b4e2c00",
    "sha256": "0d9034cb913aebc163ff310ab9a70d4e1b9e84633e07e68f8eace398e1dab990"
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "blob": "3b376f0481a59a2e897ea01a8033ca2f5c857972",
    "sha256": "24bf6f31ef7283d9fc319598268c1047ff1c58cd95bda787d55b396e9e3bde4c"
  },
  {
    "path": "src/lib/specialist-general-20261110-business-input.ts",
    "blob": "5489fff91141eec20649eaccc1f73823624f2027",
    "sha256": "9b1d7909b33a4d2b7048d365b9bc37ab5487f9a4d4c327e6fc7af01e1270e7de"
  },
  {
    "path": "src/lib/technology-cidr-snapshot-verification.test.ts",
    "blob": "62fc5da2d11eee138bb3b5631e6183386e6e5a10",
    "sha256": "e8b9ce90da7f73435336d879a5ad66528b0ab7e2571eeab884e564d36b1d4fe3"
  },
  {
    "path": "src/lib/technology-cidr-snapshot-verification.ts",
    "blob": "266ace55e8cd40eb1d3d9141e684fc30d3c0208b",
    "sha256": "d045b50ed69dd3c906a7d7a622f9df63630e56860812c676b3869eccc6a7aec9"
  },
  {
    "path": "src/components/technology-bounded-analysis.test.tsx",
    "blob": "cde343cf5103a9097f0e35ba1221e107299d3753",
    "sha256": "78b4136a77477d4964bd427cd186a90d3522f9803fabbba1568dd42699f6b6c0"
  },
  {
    "path": "src/components/technology-bounded-analysis.tsx",
    "blob": "831ef43e286a3220afbaae23819897f6bb3abbe7",
    "sha256": "ee696f0d2368e8149bae17d62cfab4d54f79c7af80d84a5eca613d43d517ff4f"
  },
  {
    "path": "src/components/technology-next-five-integration.test.tsx",
    "blob": "a1bb196a567915d95243052d1f94c69247cf263d",
    "sha256": "16641ee70ea24a8d91bb466ce75655c754fe7748a15ab291342ad1f49b897849"
  },
  {
    "path": "src/lib/native-delivery/technology-next-five-catalog.ts",
    "blob": "596f0b625f14406a8e3a3a0a92c9221b1a78d657",
    "sha256": "7a76dc3cc73ded01ac33266b9a1736a5318769095840d770ae11ce336f79f586"
  },
  {
    "path": "src/lib/native-delivery/technology-next-five-contract.test.ts",
    "blob": "817095f13271b82f30cff6dbd900979f1d1fc8e7",
    "sha256": "477318fbe5c77be6c50fbcd27b593f4452f8db74f714a2927835d28ec9fa9bfa"
  },
  {
    "path": "src/lib/native-delivery/technology-next-five-contract.ts",
    "blob": "f315a72d4ac8570503899e800fe16e1bb9e1c2ff",
    "sha256": "59bb8f5dfe8cccdae8615600cb6acbeacbbf66f756e460578a465e36f14e658c"
  },
  {
    "path": "src/lib/technology-next-five-analysis.test.ts",
    "blob": "3c62c71f142254a30f91711b23c20543bb28c357",
    "sha256": "b55e55da35a5dd0458024cbcadc53847b72333dd4b6ef9bad7edee04b31106af"
  },
  {
    "path": "src/lib/technology-next-five-analysis.ts",
    "blob": "f3155670788906829c8a078c6eb693f63175a633",
    "sha256": "30f5410307616bb08e2c707044c538f7df7ebdf2769767ec526c6d0e8aa64b80"
  }
]);
const immutableObjects=new WeakMap();
const hash=b=>createHash('sha256').update(b).digest('hex');
const git=completionGitReader((args,options={})=>execFileSync('git',args,{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024,...options}));
let immutableObjectsPreloaded=false;
export function verifyCurrentRuntimeContext(read=readFileSync,sourceGit=git){
 assert(currentContext.length>0,'Missing reviewed current runtime context');
 const head=sourceGit(['rev-parse','--verify','HEAD^{commit}']).toString().trim();assert.match(head,/^[a-f0-9]{40}$/);
 let objects=immutableObjects.get(sourceGit);if(!objects){objects=new Map();immutableObjects.set(sourceGit,objects);}
 const immutable=args=>{const key=JSON.stringify(args);if(!objects.has(key))objects.set(key,sourceGit(args));return objects.get(key);};
 let admitted;
 for(const row of currentContext){const currentObject=immutable(['rev-parse',head+':'+row.path]).toString().trim();const blob=immutable(['cat-file','blob',row.blob]);assert.equal(hash(blob),row.sha256,'Retained evidence current context Git bytes differ: '+row.path);
  if(currentObject!==row.blob){try{admitted??=proveNamedCurrentContext(read,sourceGit);assert.equal(admitted.get(row.path)?.recordedSHA256,row.sha256,'Only the exact recorded context claim may advance');}catch(cause){throw new Error('Retained evidence current context target differs: '+row.path,{cause});}}
  else assert(read(row.path).equals(blob),'Retained evidence current context target differs: '+row.path);
 }
 return admitted??new Map();
}
export function retainedRuntimeBytes(path,read=readFileSync,sourceGit=git){
 const row=sources.find(source=>source.path===path);
 if(sourceGit===git&&!immutableObjectsPreloaded&&(row||["src/lib/native-delivery/technology-five-job-storage.ts","src/lib/native-delivery/technology-five-webhook-worker.ts","tests/gotrue-runtime/acceptance.mjs"].includes(path))){preloadRetainedImmutableObjects(read,git);immutableObjectsPreloaded=true;}
 if(!row){const retained=readStage2HistoricalRuntime(path,read,sourceGit);return retained??read(path);}
 const admitted=verifyCurrentRuntimeContext(read,sourceGit);
 return retainedMappedRuntimeBytes(path,row,read,sourceGit,admitted);
}
function retainedMappedRuntimeBytes(path,row,read,sourceGit,admitted){
 const current=read(path);
 const blob=sourceGit(['cat-file','blob',row.currentBlob]);assert.equal(hash(blob),row.currentSHA256,'Retained evidence current Git bytes differ: '+path);
 if(sourceGit(['rev-parse','HEAD:'+path]).toString().trim()===row.currentBlob)assert(current.equals(blob),'Retained evidence current target bytes differ: '+path);
 else {const proof=admitted.get(path);assert.equal(proof?.recordedSHA256,row.currentSHA256,'Exact retained runtime source claim required');assert(current.equals(sourceGit(['cat-file','blob',proof.current.blob])),'Retained evidence current target bytes differ: '+path);}
 const predecessor=sourceGit(['show',prior+':'+path]);assert.equal(hash(predecessor),row.priorSHA256,'Retained evidence predecessor bytes differ: '+path);
 return predecessor;
}
export function readRuntimeEvidenceFile(path,encoding){const bytes=retainedRuntimeBytes(path);return encoding===undefined?bytes:bytes.toString(encoding);}

const stage2BatchRows=Object.freeze([
  {
    "path": "src/lib/native-delivery/technology-five-job-storage.ts",
    "ref": "5008aa4cadd77f7a9a5dc1523cace694f3bbdf47",
    "blob": "9831531b3c87bdadd8146ce566451d86f140bdd1",
    "sha256": "32ae836e0ab3dfa6e3ce7bc82107e05bc89a031fe1c04f7e371b9f0ef11c32f0",
    "bytes": 3900
  },
  {
    "path": "src/lib/native-delivery/technology-five-webhook-worker.ts",
    "ref": "5008aa4cadd77f7a9a5dc1523cace694f3bbdf47",
    "blob": "55072e75b8246480639d842ded1a7cd05a71bdcf",
    "sha256": "9ea8e2235cce7924a58fffee2eaa8c5e71f4c0090fb80f3ced4ec734d15ecea1",
    "bytes": 3380
  },
  {
    "path": "tests/gotrue-runtime/acceptance.mjs",
    "ref": "5008aa4cadd77f7a9a5dc1523cace694f3bbdf47",
    "blob": "b44449b723be709c560ef7e6c1e207705cdbae67",
    "bytes": 9053,
    "sha256": "95fae5857935bae8098fa390df33f62342f06f4bf335640b9e19e124edbf6276"
  }
].map(Object.freeze));
function retainedStage2BatchBytes(path,row,admitted){
 let currentRecord;
 if(path==='tests/gotrue-runtime/acceptance.mjs'){
  // The successful sealed global proof validates NS records; this path is not
  // an application-map entry. Preserve the original explicit NS predecessor route.
  const ns=nonSourceRecords(readFileSync).get(path),predecessor=ns?.predecessor;assert(predecessor&&ns.current,'Exact NS current and predecessor required');for(const field of ['path','ref','blob','bytes','sha256'])assert.equal(predecessor[field],row[field],'Exact NS predecessor differs: '+field);currentRecord=ns.current;
 }else{const proof=admitted.get(path);assert(proof,'Explicit current Stage2 batch proof required');assert.equal(proof.recordedSHA256,row.sha256,'Exact retained Stage2 source claim required');currentRecord=proof.current;}
 const current=readFileSync(path),currentGit=git(['cat-file','blob',currentRecord.blob]);assert.equal(hash(currentGit),currentRecord.sha256,'Current Stage2 Git digest differs');assert(current.equals(currentGit),'Current Stage2 source changed after proof');assert.equal(git(['rev-parse','HEAD:'+path]).toString().trim(),currentRecord.blob,'Current Stage2 HEAD differs');
 assert.equal(git(['rev-parse','--verify',row.ref+'^{commit}']).toString().trim(),row.ref,'Exact Stage2 old commit differs');assert.equal(git(['rev-parse',row.ref+':'+path]).toString().trim(),row.blob,'Exact Stage2 old path-to-blob differs');
 const historical=git(['cat-file','blob',row.blob]);assert.equal(historical.length,row.bytes,'Exact Stage2 old bytes differ');assert.equal(hash(historical),row.sha256,'Exact Stage2 old SHA differs');return Buffer.from(historical);
}
// End private Stage2 batch resolver.
function assertRegularBatchCurrentPath(path){
 const target=resolve(path),stat=lstatSync(target);assert(stat.isFile()&&!stat.isSymbolicLink(),'Regular current batch source required');assert.equal(realpathSync(target),target,'Redirected current batch source');
}
// End per-read batch physical source fence.

// Explicit synchronous opt-in only. Default per-read entry points above remain unchanged.
const rawActualState=()=>({head:execFileSync('git',['rev-parse','--verify','HEAD^{commit}'],{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024}),status:execFileSync('git',['status','--porcelain=v1','--untracked-files=all'],{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024})});
function assertActualState(before){const after=rawActualState();assert(before.head.equals(after.head),'Evidence batch actual HEAD changed');assert(before.status.equals(after.status),'Evidence batch actual status changed');}
function assertActualHead(before){assert(before.head.equals(execFileSync('git',['rev-parse','--verify','HEAD^{commit}'],{stdio:['ignore','pipe','pipe'],maxBuffer:8*1024*1024})),'Evidence batch actual HEAD changed');}
export function withRuntimeEvidenceBatch(paths,run,...extra){
 return runClosedSynchronousBatch(paths,run,{
  begin(declared){
   assert.equal(extra.length,0,'Custom evidence batch readers or arguments are forbidden');assertAPIEvidencePaths(declared);
   const before=rawActualState();let admitted;
   try{
    if(!immutableObjectsPreloaded){preloadRetainedImmutableObjects(readFileSync,git);immutableObjectsPreloaded=true;}
    admitted=verifyCurrentRuntimeContext();
   }finally{assertActualState(before);}
   return {before,admitted};
  },
  read(path,state){
   const row=sources.find(source=>source.path===path),stage2=stage2BatchRows.find(source=>source.path===path);if(!row&&!stage2)return retainedRuntimeBytes(path);
   assertActualHead(state.before);
   try{assertRegularBatchCurrentPath(path);return row?retainedMappedRuntimeBytes(path,row,readFileSync,git,state.admitted):retainedStage2BatchBytes(path,stage2,state.admitted);}
   finally{assertActualHead(state.before);}
  },
  end(state){try{verifyCurrentRuntimeContext();}finally{assertActualState(state.before);}}
 });
}
