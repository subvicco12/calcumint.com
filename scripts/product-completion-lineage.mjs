/** Exact test/presentation successors; no mathematical or certification approval. */
import {createHash} from 'node:crypto';
import {readFileSync} from 'node:fs';
export const completionBindingDependencies=name=>Object.freeze((bindings.find(row=>row.path===name)?.supplementalSources??[]).map(row=>row.path));
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
        "ref": "df82f28340d58e058d17e74937cd512283ccaed6",
        "blob": "d1c1ef2fd3905dc6776a700da9a34d17e9b477c9",
        "sha256": "e3eb52da0ddbcc3ff2aea0a6c2d005197f3d0b68e2ce844e0c5067fa06b7bf9d"
      }
    ]
  },
  {
    "path": ".github/workflows/ci.yml",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "00651cc382be5dcbd596882071787fd6702c13d3",
    "predecessorBlob": "938281abbbf9bbea928d6844d71b06f9dc423f7f",
    "successorBlob": "5f1156c52ae6926860a61d529faaed825661bba4",
    "predecessorSHA256": "6556a6d89c583ea1bb8ccd82ff47f379606850399da7600b59e274567b6d0416",
    "successorSHA256": "39703e767294bee42f65f6495f2f9c3c8807c2f237cef79d1a48659196aca243",
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
      },
      {
        "ref": "e5542ff7e60351e46a352cebd12210b498d5ad00",
        "blob": "2b83bd30acf6dfd091f8a7532b5b97ad6ecfd476",
        "sha256": "b8c9d0eece648d72f20390b0a33b3f02ef972c7ec880a91a97f7ece4f2e27c8f"
      },
      {
        "ref": "df82f28340d58e058d17e74937cd512283ccaed6",
        "blob": "7cfa77dd804d48a3b5d2027127af0812e931c7d2",
        "sha256": "988d90c87c69ab09aab0748124471381341dd1fe7e50c62ef957f1e64563a36e"
      },
      {
        "ref": "e80a691e86b5bb996a0cd0863fc810b432d7303d",
        "blob": "8953c23d35cc88e660816276eb652ab6fb68d6e5",
        "sha256": "f963ba821baac73c93bbf16915e27c344c5db022c7b4e11420505778c172007c"
      },
      {
        "ref": "b6b1a72127d40712f0d3c212188d8ca84063721b",
        "blob": "d3538f2cfd277b6877efc083ecef59a17ec3554f",
        "sha256": "4c50fb082caac20a87df605934d693632be91b5194282467161b596a5b7a2cdb"
      },
      {
        "ref": "606c44e09799a89922e4c575d24a7798d33ee33b",
        "blob": "360179f221fee30409658eb9be1bba63864a3729",
        "sha256": "1b34d38604e057d2e28e650fd3806fc66b6d38c5fcfa46d08f36eef4ec4318e3"
      },
      {
        "ref": "b2d72aa66293b752739b7924745a57a51c4b5acb",
        "blob": "2e146967e59f77ab662dab1b18d60db5e852d823",
        "sha256": "934bf945aa864691a3fba7307484a7996eaf407f49b61f83c98c281780a420c9"
      }
    ]
  },
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "eecc1b853e2ca6c160c999442d78836993565a83",
    "predecessorBlob": "7ece608dadea02c3c668623d80931c2598829e99",
    "successorBlob": "64e9c37928d3a211fb080a9d0bec12d6ec6f3183",
    "predecessorSHA256": "64368f3b10b838bea51ee4a53f4b0e89b0b2828654ef84f2cd9e68825344367e",
    "successorSHA256": "f742e161e6eb256e7265a290e2fd46980d7816aa3ea6936384f295112b333f0e",
    "intermediateSources": [
      {
        "ref": "40097d77fb84dca53207534d528e7ed8f888b99a",
        "blob": "a9a69fed092d47e1e1273a79c3c520fb4ae32716",
        "sha256": "1541d7d337eaa27545276cd29a09220a78b4a0cfb41660fd31f89699fa372722"
      },
      {
        "ref": "d19b8de7d74c5f85cd296946bdb69a2e3b271167",
        "blob": "1a5fd17ea04218060de9d1fe3952bc23561297d6",
        "sha256": "e1282ad0141bb46fa87a7bab6fc8ad2dcc78e83b02d6b2c6f3b23b04fc7f8d06"
      },
      {
        "ref": "2b3ce39a3670028601491baadf9b2b2c3462be89",
        "blob": "64e9c37928d3a211fb080a9d0bec12d6ec6f3183",
        "sha256": "f742e161e6eb256e7265a290e2fd46980d7816aa3ea6936384f295112b333f0e"
      },
      {
        "ref": "80d18305104a9db4a015ea26199f8b916370467c",
        "blob": "64e9c37928d3a211fb080a9d0bec12d6ec6f3183",
        "sha256": "f742e161e6eb256e7265a290e2fd46980d7816aa3ea6936384f295112b333f0e"
      },
      {
        "ref": "fc45ff9c99ad8dad4ede7b780e34f1ba963efa21",
        "blob": "64e9c37928d3a211fb080a9d0bec12d6ec6f3183",
        "sha256": "f742e161e6eb256e7265a290e2fd46980d7816aa3ea6936384f295112b333f0e"
      },
      {
        "ref": "17a8715276ab514c9a0c6340fc8bf67318f547d6",
        "blob": "64e9c37928d3a211fb080a9d0bec12d6ec6f3183",
        "sha256": "f742e161e6eb256e7265a290e2fd46980d7816aa3ea6936384f295112b333f0e"
      },
      {
        "ref": "719a104663c10154ad945051a6dd54093fc4b284",
        "blob": "64e9c37928d3a211fb080a9d0bec12d6ec6f3183",
        "sha256": "f742e161e6eb256e7265a290e2fd46980d7816aa3ea6936384f295112b333f0e"
      },
      {
        "ref": "c0f994d109ae7a5e13062ff9755d2f7937ed9655",
        "blob": "64e9c37928d3a211fb080a9d0bec12d6ec6f3183",
        "sha256": "f742e161e6eb256e7265a290e2fd46980d7816aa3ea6936384f295112b333f0e"
      }
    ],
    "supplementalSources": [
      {
        "path": "scripts/n1-publication-lineage.mjs",
        "ref": "d19b8de7d74c5f85cd296946bdb69a2e3b271167",
        "blob": "066bbf558aeaba1bf74072a7984ad4913918dc62",
        "sha256": "4a6f9418054eb4df0248d1171e695bd57d1e58d94d6edbcc14cc68493ef0370e"
      },
      {
        "path": "scripts/frequency-presentation-lineage.mjs",
        "ref": "d19b8de7d74c5f85cd296946bdb69a2e3b271167",
        "blob": "0c93293d0a3653bcc6411bad26ad9111ea88806c",
        "sha256": "be6ce5031756352037cfa7b5e8c3a34ad2208df8e8a360d07f4b550c1766a92e"
      },
      {
        "path": "tests/acceptance-closure-20261108/receipt-source-path.mjs",
        "ref": "cb90a94fbe1827c1be494edd55549dff72d24405",
        "blob": "64060b94b70930054535db085c0f87100204b549",
        "sha256": "91f271a96272ad6e7e73fda5f6bd31db936667ee1c9315bd0650a7242db6e7c8"
      },
      {
        "path": "tests/execution-recovery-20261109/source-lineage.test.mjs",
        "ref": "719a104663c10154ad945051a6dd54093fc4b284",
        "blob": "a12994a4457c43c2f47afe12d989b662743b64ae",
        "sha256": "8db922ae4e5f2d3b60876712011afdb7697e3538e09c9276370fe49e9642d363"
      },
      {
        "path": "tests/acceptance-closure-20261108/converter-final-source.test.mjs",
        "ref": "3cc17e80924a502a67d8696e60ad6592ec631f4a",
        "blob": "7c69021c8cf584823d96c0cfa26a4b7b7c5c8a3d",
        "sha256": "122ac5c5db0884964a7a319ea8f2e62212019cea6088379464dd04bb5a510721"
      },
      {
        "path": "tests/shortest-publication-20/caller-lineage.test.mjs",
        "ref": "2b3ce39a3670028601491baadf9b2b2c3462be89",
        "blob": "982d59e9105d8b727f7ddb2709a5f4586a5227fd",
        "sha256": "361910419777e0c9e729c32e1b00693804c7e86eec5b05f769c68fb772de4552"
      },
      {
        "path": "tests/adoption1535/lineage.test.mjs",
        "ref": "2b3ce39a3670028601491baadf9b2b2c3462be89",
        "blob": "33edc17dcdb50379f2c587ba2babe2fbf91e8ac3",
        "sha256": "d4b50a2650c99a123b6b34135a3ea4e9145a9a5b206d508f7c6e2c7ed00c5243"
      },
      {
        "path": "tests/execution-recovery-20261109/reader-forwarding.test.mjs",
        "ref": "d4b81fa30d0aab558ef5df7c67a76abf7e6a656d",
        "blob": "bc37fea717b39d2db60fa0b83829370d127d41f6",
        "sha256": "38ae2fec0bf151b80cf923ab7e9fa50d3a943ad9d2cdd8eb98931ffd84a5e28e"
      },
      {
        "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
        "ref": "80d18305104a9db4a015ea26199f8b916370467c",
        "blob": "fc1cb0e2caabcd7ca814d3f2305833e802f23ef5",
        "sha256": "af234ca45348e71d04d046af11de30db5119f84f0f71191ed4c413d300559468"
      },
      {
        "path": "src/lib/historical-canonical-evidence.ts",
        "ref": "fc45ff9c99ad8dad4ede7b780e34f1ba963efa21",
        "blob": "927042ce5578c3c72bb4c6e8eec0ded1ce3a623e",
        "sha256": "72b594a5b95767afc89d1f6ab5421104a24e3030fdc4c020be0495d60c321b2d"
      },
      {
        "path": "src/lib/historical-canonical-evidence.test.ts",
        "ref": "fc45ff9c99ad8dad4ede7b780e34f1ba963efa21",
        "blob": "012aa638c12ba66bd62e1ab2a842de55e1c4367b",
        "sha256": "cdf1417a7e36277f4bc97f3df9062d6cee4c2df3b5d16a6973210de5f2f35996"
      },
      {
        "path": "tests/software-closure/preservation.test.mjs",
        "ref": "17a8715276ab514c9a0c6340fc8bf67318f547d6",
        "blob": "9360ae0bdca742bbb09e50d75a11f69f2786ce24",
        "sha256": "8e4055e6003608b05e780401b0f851756aac203b16dba4e67fdd362d939c3b21"
      },
      {
        "path": "tests/acceptance-closure-20261108/receipt-source-path.d.mts",
        "ref": "719a104663c10154ad945051a6dd54093fc4b284",
        "blob": "f048163a3036de24f9e0ad0ee5f2bb8cc8d679f3",
        "sha256": "503fd703fd97941bd54e2a24d0fd685dfe5e62ec35988d140fa2f76928b1aa00"
      },
      {
        "path": "tests/cohort22-closure-20261109/caller-source.test.mjs",
        "ref": "eecc1b853e2ca6c160c999442d78836993565a83",
        "blob": "9fe11a6e7d7093a92dc7696fef2be995b99e9102",
        "sha256": "0efce8569b5f0a47e35cb74c3f7e4dd731b33639a8cf584c9efaee9be2e41cb1"
      },
      {
        "path": "src/lib/execution-recovery-evidence.test.ts",
        "ref": "346c314af8ae4593eb83ccffa6cbd06353617790",
        "blob": "20c28061f8c8fdf5d020d49902a33fb3f03ffc98",
        "sha256": "1686f5a9df0175c12762a1cecbe5cdf32186bc592732a56a946234da7e44f38a"
      },
      {
        "path": "tests/next-cohort-20261110/source/current-caller-stage.mjs",
        "ref": "cb90a94fbe1827c1be494edd55549dff72d24405",
        "blob": "67eefee71a8e18406bd704502a7b0c5dbd4c6e38",
        "sha256": "e9a105cf49ab4862c9178b517312d518d4a0f8a71133b4e52ecae8110845a71a"
      },
      {
        "path": "tests/publication-workflows-20261109/source-evolution.test.mjs",
        "ref": "3cc17e80924a502a67d8696e60ad6592ec631f4a",
        "blob": "7fd4f8575858836e7bb3eaa3d4fcd68715dba84e",
        "sha256": "405f1536d959a4e3bd2d42ad0db44bc5a87f3d8571cde8b054bdba1e72d3ed6e"
      },
      {
        "path": "tests/first-five-20261109/crossed-dependency-source.test.mjs",
        "ref": "3cc17e80924a502a67d8696e60ad6592ec631f4a",
        "blob": "9ce252f0af27da8700b3990cd8e443548229f114",
        "sha256": "d512b20bd0074d20ac8d525d7766ecbbaf5379fb42184346a90a53b89763ab2e"
      },
      {
        "path": "tests/next-five-20261110/source/current-proof.mjs",
        "ref": "cb90a94fbe1827c1be494edd55549dff72d24405",
        "blob": "79ba518669e2f810b6db8a528a84adcd41a587a0",
        "sha256": "14a23b2ed85129fa3ff302f77a5d0f19043f9c591a6188cc768a9dcda98e08ea"
      },
      {
        "path": "tests/next-five-20261110/source/retained-r3-stage.mjs",
        "ref": "cb90a94fbe1827c1be494edd55549dff72d24405",
        "blob": "b2fe64fd1170a947bcd6f9e75b3f2e967898c698",
        "sha256": "95b5c47d9b88f9b202045b0113a5c1d8b3298e2592ac47091767cdd09b316c17"
      },
      {
        "path": "tests/next-five-20261110/source/retained-r3-anchor.mjs",
        "ref": "cb90a94fbe1827c1be494edd55549dff72d24405",
        "blob": "3d7f3a0e3f3f67e6e8340ba11c10b91957645b88",
        "sha256": "2f92fd4568a085c7bc54de8b340c5215490bee58bc4bdb74dc9afcd934fb02ca"
      }
    ]
  },
  {
    "path": "scripts/check-shortest-publication20.mjs",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "d4b81fa30d0aab558ef5df7c67a76abf7e6a656d",
    "predecessorBlob": "dac8a031f378cf4a9f218b1498a20df654f24624",
    "successorBlob": "3672925a913f79c4be4ca413ae57acd94742cf5c",
    "predecessorSHA256": "aaf61d46b2bfbc317642b3f18f88289230dda610334744835fc632511b563be3",
    "successorSHA256": "2d8a5596b3c2076ab2acd57ae84444a6a11b4fdd539de62982dd81da65618d4f",
    "intermediateSources": [
      {
        "ref": "e5542ff7e60351e46a352cebd12210b498d5ad00",
        "blob": "38e2fc0045f9d53f29c14e9d1f3f1153fff274c2",
        "sha256": "2daa2a1cc7a64dc065accbbc5964796302926ea6d1dcf45c2c315902176f7978"
      }
    ],
    "supplementalSources": [
      {
        "path": "tests/execution-recovery-20261109/reader-forwarding.test.mjs",
        "ref": "d4b81fa30d0aab558ef5df7c67a76abf7e6a656d",
        "blob": "bc37fea717b39d2db60fa0b83829370d127d41f6",
        "sha256": "38ae2fec0bf151b80cf923ab7e9fa50d3a943ad9d2cdd8eb98931ffd84a5e28e"
      },
      {
        "path": "tests/shortest-publication-20/completion-lineage.test.mjs",
        "ref": "80d18305104a9db4a015ea26199f8b916370467c",
        "blob": "fc1cb0e2caabcd7ca814d3f2305833e802f23ef5",
        "sha256": "af234ca45348e71d04d046af11de30db5119f84f0f71191ed4c413d300559468"
      }
    ]
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
  },
  {
    "path": "src/components/final-private-workbench.tsx",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "e80a691e86b5bb996a0cd0863fc810b432d7303d",
    "predecessorBlob": "77cb5fe21d87bdf04d1ed1ab8ff1e7138961b140",
    "successorBlob": "eb3e3c7e611bcf9ae7e67d9fa0a41ea9adff43e9",
    "predecessorSHA256": "40dba7f7c7699f6634a1cfe53c8370c8137f235f877b46d645d442ec2006e626",
    "successorSHA256": "81ec299c787f73ffa374717320f84b6e22b4ecbf9e2377c2d2ea83f4e8b41367",
    "supplementalSources": [
      {
        "path": "src/lib/final-private-snapshot-text.ts",
        "ref": "e80a691e86b5bb996a0cd0863fc810b432d7303d",
        "blob": "24b01e628505fda5127b6de8f33563c7bab0f3c3",
        "sha256": "f23931b6e7f8ad3d8236b0e23bdf275bb521f9e3cac103cdaf2114249df106e2"
      },
      {
        "path": "src/lib/publication-factory-contracts-input.ts",
        "ref": "e80a691e86b5bb996a0cd0863fc810b432d7303d",
        "blob": "1e3f689af1f5e5e4069a2c611791d812a6cd0003",
        "sha256": "d0c5d00cc0c5d024420f11f21c27534f5b38dc681cbd53d22e750eb4a8dd281f"
      }
    ]
  },
  {
    "path": "src/calculators/completion-manifest.test.ts",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "e80a691e86b5bb996a0cd0863fc810b432d7303d",
    "predecessorBlob": "68a6abff3d86e1435188ca3bc13046ec33078de1",
    "successorBlob": "689cf37cb434ad7749bb4e91e87fb5bb21afb842",
    "predecessorSHA256": "a5957281266e0fb06795b2beb20251cbba93d0cabeafbbe3c6ca7a73c138ab85",
    "successorSHA256": "0c54ae0dbe7dc8d61dc5faf7d2420e39870415f3874e43544e3fb8f031c26f25"
  },
  {
    "path": "src/components/catalog-engineering-review.tsx",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
    "predecessorBlob": "c1a16424bfbc813f8cd2dd66f0018804c11866d0",
    "successorBlob": "7fd8ee287cb05baea756f76639d5da9d8492057d",
    "predecessorSHA256": "e010d1e134c239cb6bb583365a442c64415f687233f94fd08088c4959936eb20",
    "successorSHA256": "aefd1a3896b2dec7b65a248cf863b953c1e89c2d745d08df7cbe37e38a54f5b3",
    "supplementalSources": [
      {
        "path": "src/lib/final-private-snapshot-text.ts",
        "ref": "b6b1a72127d40712f0d3c212188d8ca84063721b",
        "blob": "24b01e628505fda5127b6de8f33563c7bab0f3c3",
        "sha256": "f23931b6e7f8ad3d8236b0e23bdf275bb521f9e3cac103cdaf2114249df106e2"
      },
      {
        "path": "src/lib/publication-factory-contracts-input.ts",
        "ref": "b6b1a72127d40712f0d3c212188d8ca84063721b",
        "blob": "1e3f689af1f5e5e4069a2c611791d812a6cd0003",
        "sha256": "d0c5d00cc0c5d024420f11f21c27534f5b38dc681cbd53d22e750eb4a8dd281f"
      },
      {
        "path": "src/components/parallel-completion-integration.test.tsx",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "55d74d274f658443453461c8c37c07cddddde618",
        "sha256": "3452fd9961bd32b2fb9c578162ed4da3b350e500bfa78e84104d7b9dc29f9dd4"
      },
      {
        "path": "src/components/parallel-guided-business-evidence.test.tsx",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "c02141ce81b93ac5f02c1bb89094f4e808e1d41f",
        "sha256": "89c15c204e4ce4ea9484c735141a7f85e02fe2bc0297e5316ac8bbb0b930c645"
      },
      {
        "path": "src/components/specialist-general-20261110-business-input.tsx",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "14674af3689d1a59e30a16681a517d35c74195a3",
        "sha256": "aa913519a890a953d47b4515cb12ec1d83c913ba6e446ba102943d0acced15d2"
      },
      {
        "path": "src/lib/finance-cohort-20261110-annuity.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "6e66fe59ee7a08ab779021fecf2b765e1a37067d",
        "sha256": "2935e66dc51bc997c89c17f3a616a208d47b041e8b5dec342c97cd3861adc49e"
      },
      {
        "path": "src/lib/parallel-finance-qualification.test.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "670a6e22351eb44c925f6ba50a2acf1d85fa0fa4",
        "sha256": "bec9018b9fb417419b1edbb297d087a830f9b6f795a158d83ae3326bb5ece5d4"
      },
      {
        "path": "src/lib/parallel-readiness-evidence.test.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "81d9126f601663e3c440b566b20fb4112b4e2c00",
        "sha256": "0d9034cb913aebc163ff310ab9a70d4e1b9e84633e07e68f8eace398e1dab990"
      },
      {
        "path": "src/lib/specialist-general-20261110-business-input.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "5489fff91141eec20649eaccc1f73823624f2027",
        "sha256": "9b1d7909b33a4d2b7048d365b9bc37ab5487f9a4d4c327e6fc7af01e1270e7de"
      }
    ],
    "intermediateSources": [
      {
        "ref": "b6b1a72127d40712f0d3c212188d8ca84063721b",
        "blob": "f79a506706fde50d489d5f33d8f81c6d4705ba08",
        "sha256": "12b7cff0408cf72462529a5e9dd154757ba9b0f33af05e8cc2e92cbee5b81cbe"
      }
    ]
  },
  {
    "path": "src/components/remaining-engineering-review.tsx",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "b2d72aa66293b752739b7924745a57a51c4b5acb",
    "predecessorBlob": "d10fdb101386fded8fcda14ccf8898a704602d16",
    "successorBlob": "100f4c18dfeac8f26fca189e84c161f3162c1505",
    "predecessorSHA256": "35dc0885d2445eea44fb2294641186537ba9e4c8d88f5d02c13ee8d04b5a047a",
    "successorSHA256": "1b50b9a87edb78f05bc4bcd86cd81737317b08875867a34c0bdea54c27f7296d",
    "supplementalSources": [
      {
        "path": "src/lib/final-private-snapshot-text.ts",
        "ref": "b2d72aa66293b752739b7924745a57a51c4b5acb",
        "blob": "24b01e628505fda5127b6de8f33563c7bab0f3c3",
        "sha256": "f23931b6e7f8ad3d8236b0e23bdf275bb521f9e3cac103cdaf2114249df106e2"
      },
      {
        "path": "src/lib/publication-factory-contracts-input.ts",
        "ref": "b2d72aa66293b752739b7924745a57a51c4b5acb",
        "blob": "1e3f689af1f5e5e4069a2c611791d812a6cd0003",
        "sha256": "d0c5d00cc0c5d024420f11f21c27534f5b38dc681cbd53d22e750eb4a8dd281f"
      },
      {
        "path": "src/calculators/remaining-contracts.ts",
        "ref": "b2d72aa66293b752739b7924745a57a51c4b5acb",
        "blob": "753681899f66682c982c8241efb2c04d21b5c864",
        "sha256": "604a4cd8b166888a9a4a84e153e543a2d81ba7631411b337554a3ab08157c32f"
      }
    ]
  },
  {
    "path": "src/components/remaining-engineering-review.lossless.test.tsx",
    "predecessorRef": "b2d72aa66293b752739b7924745a57a51c4b5acb",
    "successorRef": "91b19c36521943a5423c37f2754480e654f884f5",
    "predecessorBlob": "fb82caccd4f2979a3563730b2811f88426b61ba6",
    "successorBlob": "59b98ae6587aac6a48610bee268f1f69a6fc5f52",
    "predecessorSHA256": "746b6b811e3af7653c19fec130f32b179dc16000bdef319a42c82a552174f3e7",
    "successorSHA256": "1b01187c20de99aeff324f45532088423ed4fa1a540ca512742058d7b0d15304",
    "supplementalSources": [
      {
        "path": "src/components/remaining-engineering-review.tsx",
        "ref": "b2d72aa66293b752739b7924745a57a51c4b5acb",
        "blob": "100f4c18dfeac8f26fca189e84c161f3162c1505",
        "sha256": "1b50b9a87edb78f05bc4bcd86cd81737317b08875867a34c0bdea54c27f7296d"
      },
      {
        "path": "src/lib/final-private-snapshot-text.ts",
        "ref": "b2d72aa66293b752739b7924745a57a51c4b5acb",
        "blob": "24b01e628505fda5127b6de8f33563c7bab0f3c3",
        "sha256": "f23931b6e7f8ad3d8236b0e23bdf275bb521f9e3cac103cdaf2114249df106e2"
      },
      {
        "path": "src/lib/publication-factory-contracts-input.ts",
        "ref": "b2d72aa66293b752739b7924745a57a51c4b5acb",
        "blob": "1e3f689af1f5e5e4069a2c611791d812a6cd0003",
        "sha256": "d0c5d00cc0c5d024420f11f21c27534f5b38dc681cbd53d22e750eb4a8dd281f"
      }
    ]
  },
  {
    "path": "src/components/component-engineering-review.tsx",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "e71294ac0f6521fed7f0841f1d59206dc3c72262",
    "predecessorBlob": "a75cfab7c0bdd523275afd86b0b8ffc67c6a8522",
    "successorBlob": "d05f80a40e2e9869e12173dd842d0ecb2fc001a8",
    "predecessorSHA256": "2964a31b596030a2dde40ea8633603dcdfb3f8f523b63ba4f2715824a0550929",
    "successorSHA256": "6c9ea935a9e4ff3951372ae836ad5ece3825e2cf8bde50dca15f99e984eb0835",
    "supplementalSources": [
      {
        "path": "src/lib/final-private-snapshot-text.ts",
        "ref": "e71294ac0f6521fed7f0841f1d59206dc3c72262",
        "blob": "24b01e628505fda5127b6de8f33563c7bab0f3c3",
        "sha256": "f23931b6e7f8ad3d8236b0e23bdf275bb521f9e3cac103cdaf2114249df106e2"
      },
      {
        "path": "src/lib/publication-factory-contracts-input.ts",
        "ref": "e71294ac0f6521fed7f0841f1d59206dc3c72262",
        "blob": "1e3f689af1f5e5e4069a2c611791d812a6cd0003",
        "sha256": "d0c5d00cc0c5d024420f11f21c27534f5b38dc681cbd53d22e750eb4a8dd281f"
      },
      {
        "path": "src/calculators/component-contracts.ts",
        "ref": "e71294ac0f6521fed7f0841f1d59206dc3c72262",
        "blob": "6a3a8d163727db6b2b754b24f31338d4543623a5",
        "sha256": "a82cc28e5cf744095fcdc4ff209a80a7f6a34b702ef22c363998a02e94652bda"
      }
    ]
  },
  {
    "path": "src/components/private-workflow-review.tsx",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "1a15d4cb83163fa1e7b39f5559e0507ef115ea31",
    "predecessorBlob": "6201412990f6315d0213dd6fc948998d174ae817",
    "successorBlob": "39a03f562600c68906a8b90ea3d47076f9edb4dc",
    "predecessorSHA256": "ba6d21416e55a22138d4fa47e75886c75b8e10e91bb0ed56e46d8f678c515afc",
    "successorSHA256": "b80d107171eaf3fc3b020f0b35166171702a1ee39a09f81d3809258eee1dc7fe",
    "supplementalSources": [
      {
        "path": "src/calculators/private-scenario-workflows.ts",
        "ref": "1a15d4cb83163fa1e7b39f5559e0507ef115ea31",
        "blob": "1b5222e7a6a643a45c7daea19faca737911d8747",
        "sha256": "6e96315b71e151519b996497f41f80fab21e4d58db173f7e9bfb5b2a29ddbfa7"
      },
      {
        "path": "src/calculators/private-supplied-contracts.ts",
        "ref": "1a15d4cb83163fa1e7b39f5559e0507ef115ea31",
        "blob": "7082f58262a70db0949d261ec7fc6e0ed8ca90a3",
        "sha256": "9fcad868dc9b2d73940aa1731b1bf73db4d7dcd21662f230866deba6325c749c"
      },
      {
        "path": "src/lib/calculation-snapshot.ts",
        "ref": "1a15d4cb83163fa1e7b39f5559e0507ef115ea31",
        "blob": "1a2cab16a52d88249fc33103881d6873a1da3f92",
        "sha256": "8e390f0e23bf4b91b95889c5f94083b0342c0683a1d8895b6939ee05b68af73c"
      }
    ]
  },
  {
    "path": "src/components/source-profile-review.tsx",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "1a15d4cb83163fa1e7b39f5559e0507ef115ea31",
    "predecessorBlob": "2b7a6ef8e244bd88b966c286ae598f072a32b689",
    "successorBlob": "d35f5b7af8e07ce1bb6483d9c03ee177aca7a788",
    "predecessorSHA256": "c4e2d0611c43541d07b5e15a1cfb39479b112b6b970bc037a7bd6530c2475fdd",
    "successorSHA256": "708b84db803aa78c0ebe223015d4dc6a632b2a056b5d0a2c7c1454bcf248477b",
    "supplementalSources": [
      {
        "path": "src/calculators/source-profile-snapshot.ts",
        "ref": "1a15d4cb83163fa1e7b39f5559e0507ef115ea31",
        "blob": "bbb35255770a9d0904bf67830040f4d9bc06981c",
        "sha256": "119f57f1468bd2d05fd2ea2e37e64621eaffff4a9bcfc0aeaa87ce89077da97f"
      },
      {
        "path": "src/calculators/source-bound-profiles.ts",
        "ref": "1a15d4cb83163fa1e7b39f5559e0507ef115ea31",
        "blob": "8858406d2fe7df744d9e1653a4800bf5e8710ec8",
        "sha256": "f704f2e5d54097847da282ed0d3e97cb846dcb55d6d82cb5c3b07cb07d4a748d"
      },
      {
        "path": "src/calculators/exact-rational.ts",
        "ref": "1a15d4cb83163fa1e7b39f5559e0507ef115ea31",
        "blob": "30bfe208ccf03c8898decd6c81c9ee2e3d365ff8",
        "sha256": "cccb4e1366200c799eb82f3542d4f90ecfc0341d8678db29f93d347f39af806a"
      },
      {
        "path": "src/lib/calculation-snapshot.ts",
        "ref": "1a15d4cb83163fa1e7b39f5559e0507ef115ea31",
        "blob": "1a2cab16a52d88249fc33103881d6873a1da3f92",
        "sha256": "8e390f0e23bf4b91b95889c5f94083b0342c0683a1d8895b6939ee05b68af73c"
      }
    ]
  },
  {
    "path": "src/components/financial-contract-review.tsx",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "1a15d4cb83163fa1e7b39f5559e0507ef115ea31",
    "predecessorBlob": "7785e258494c7a3bdc1bba6700d7a452e71ca4fe",
    "successorBlob": "a61bd0e0a35e0c6dc2ce62146db69bbf1626d294",
    "predecessorSHA256": "22662ca9f8fd95e16a170ec9a2ca942a6c29d61a2d1cbc9e3f66656377f4d5fd",
    "successorSHA256": "833effd06789d7636a27d6b7b069c1e928cb42b61d68d7bb0810640caa63285d",
    "supplementalSources": [
      {
        "path": "src/calculators/financial-contracts.ts",
        "ref": "1a15d4cb83163fa1e7b39f5559e0507ef115ea31",
        "blob": "20799a7374b2d35e4ce34793582f6753ac118c78",
        "sha256": "d1d17ba463325175ce1214eb3d695bb998f492767b82c5bace76beecda501d2a"
      },
      {
        "path": "src/calculators/financial-contract-core.ts",
        "ref": "1a15d4cb83163fa1e7b39f5559e0507ef115ea31",
        "blob": "af727f5083e1784b98c0e2097caecea24da544f4",
        "sha256": "3cae37f855a8ef6f4b99424b20619936e94fd861dff4d00fb26ef748d3c72ab0"
      },
      {
        "path": "src/lib/calculation-snapshot.ts",
        "ref": "1a15d4cb83163fa1e7b39f5559e0507ef115ea31",
        "blob": "1a2cab16a52d88249fc33103881d6873a1da3f92",
        "sha256": "8e390f0e23bf4b91b95889c5f94083b0342c0683a1d8895b6939ee05b68af73c"
      }
    ]
  },
  {
    "path": "src/components/publication20-tool.tsx",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
    "predecessorBlob": "c1a8be2fbd29ec3b5e822fad3b4ca93878e60fa0",
    "successorBlob": "e04f45cf07ae73e801520bf975488d06c433e9ac",
    "predecessorSHA256": "4c5ad7ad371345c640f420e5fc5492ef4df7b2ada11468f54e74cf31cc07e589",
    "successorSHA256": "8b33b466dbe902dfe2f16e580f78c11482d3a960165e3649c3a20033cd51cb02",
    "supplementalSources": [
      {
        "path": "src/components/final-calculator-renderer.tsx",
        "ref": "95ad56ea67fcce8ef18d55a0a386d97e3ddd9061",
        "blob": "f5a032087a13b9a065bb43500a4b4ad837f497c0",
        "sha256": "95acb3ca32311c3e843371e2e39c3f74d311d99997706d866b1629957796e4b6"
      },
      {
        "path": "src/calculators/final-framework/unit-conversion-presentation.ts",
        "ref": "95ad56ea67fcce8ef18d55a0a386d97e3ddd9061",
        "blob": "679ee3f381d13762979699d4c781eb1cfa598eda",
        "sha256": "84f5cbfa414e40c80d4e6cd18a9946b720148a8a3fde9abc51c679146f17f48e"
      },
      {
        "path": "src/calculators/final-framework/renderer-display.ts",
        "ref": "95ad56ea67fcce8ef18d55a0a386d97e3ddd9061",
        "blob": "ced3c075199b6e166661195afad525b8a2ebc174",
        "sha256": "5e7af832955bddb26b080daab4261d0ba6d384c76a85164e545f0767fcb91ac3"
      },
      {
        "path": "src/calculators/final-framework/renderer-trust-surface.ts",
        "ref": "95ad56ea67fcce8ef18d55a0a386d97e3ddd9061",
        "blob": "e28e049d9b4ad884cd43f742236f0b495e2f61a4",
        "sha256": "2695c622adb40733cc60b61dc45dfcefb1cb7e2bd7c06267a8cf88ada55ee96a"
      },
      {
        "path": "src/calculators/final-framework/result-inspection.ts",
        "ref": "95ad56ea67fcce8ef18d55a0a386d97e3ddd9061",
        "blob": "dba73a796ae5d4e0e67e77166023eaf90f347d6d",
        "sha256": "0d10f74c3d5572a13e66db85ff3064a72bbe436860542b2d804bfe67b1848572"
      },
      {
        "path": "src/calculators/final-framework/analysis-surface-policy.ts",
        "ref": "95ad56ea67fcce8ef18d55a0a386d97e3ddd9061",
        "blob": "054c8d38c60c8df33989b26280d4985e66b47677",
        "sha256": "5fbc0ac497a44826163017f6b18ff743f8720a9ada9165678abc19d1fd9b1cc2"
      },
      {
        "path": "src/lib/n1-publication-methodology.ts",
        "ref": "95ad56ea67fcce8ef18d55a0a386d97e3ddd9061",
        "blob": "8e05a821decc75f066f4f77d60c89409915b2130",
        "sha256": "45758a400444cb578cef0ea20b1640d1f06b7eb1c18b3ac9f2092cec1da1a9dd"
      },
      {
        "path": "src/lib/frequency-presentation.ts",
        "ref": "95ad56ea67fcce8ef18d55a0a386d97e3ddd9061",
        "blob": "b2be37990725e83dfbedce4ebc3dcef3b874677e",
        "sha256": "b9c0015f7a6ca30426c2963a10384c05cc99b3cd5d08dc1d1782af48ddfabb05"
      },
      {
        "path": "src/lib/publication20/conversions.ts",
        "ref": "95ad56ea67fcce8ef18d55a0a386d97e3ddd9061",
        "blob": "e5eb250090125c4c1746628ebaeb0ade9eb2de4c",
        "sha256": "33294ef227aa6e4a4a14f4282dcda1834a03396e62c6a0dbc5d4fb932472ec8c"
      },
      {
        "path": "src/components/converter-cohort-20261110-examples.tsx",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "379f1265a13539923cf6940ca133d2ee7cc4ffec",
        "sha256": "a8a1bd507958034117b192729d737ae70752487fbe8e9cf8f64e071607bf1023"
      },
      {
        "path": "src/components/parallel-converters-evidence.test.tsx",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "b87fbbcddff99fad931a79e71c12fa38cbea9895",
        "sha256": "1b533de27ff8a9ab1f545a8f6e8b97a099abe3458a6b6d6d9c147ef655d554c9"
      },
      {
        "path": "src/lib/converter-cohort-20261110.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "83bb23b30c8d3cefea8c644ec10c8760ac54c136",
        "sha256": "9f39796be584514de0b8f580a684df4f1314b211f92f3c584dea3222ed5244f5"
      }
    ],
    "intermediateSources": [
      {
        "ref": "95ad56ea67fcce8ef18d55a0a386d97e3ddd9061",
        "blob": "9bfad6e34e158f6e6e86a1f3405d539abb66e63b",
        "sha256": "3e09bccce11aa71a0057d9617d12199ecc0185a133bffed5a4a90799e08719c5"
      }
    ]
  },
  {
    "path": "src/components/publication20-tool.test.tsx",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "95ad56ea67fcce8ef18d55a0a386d97e3ddd9061",
    "predecessorBlob": "dd859012e464accaf4b45bfcb0902b6f7711927c",
    "successorBlob": "abf86ca5e7ce69579a509ed9707a661e3da23f80",
    "predecessorSHA256": "cda92b43f598f64ec5bb113c080d53979f8af611aded35633fc63b502dbda091",
    "successorSHA256": "a8e3c3ef7de15439c464b8bec21206360ecf53b985335f0671933285be37401c",
    "supplementalSources": [
      {
        "path": "src/components/publication20-tool.tsx",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "e04f45cf07ae73e801520bf975488d06c433e9ac",
        "sha256": "8b33b466dbe902dfe2f16e580f78c11482d3a960165e3649c3a20033cd51cb02"
      }
    ]
  },
  {
    "path": "tests/adoption1535/lineage.test.mjs",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "2b3ce39a3670028601491baadf9b2b2c3462be89",
    "predecessorBlob": "4520c58b720a69f3f60682c8e5eeb4554e3dca3a",
    "successorBlob": "33edc17dcdb50379f2c587ba2babe2fbf91e8ac3",
    "predecessorSHA256": "a5690cee2d5a2341dde8a0f4aef8524a0519821aba2c4883ff642509bdc0fe6a",
    "successorSHA256": "d4b50a2650c99a123b6b34135a3ea4e9145a9a5b206d508f7c6e2c7ed00c5243",
    "supplementalSources": [
      {
        "path": "scripts/publication20-caller-lineage.mjs",
        "ref": "2b3ce39a3670028601491baadf9b2b2c3462be89",
        "blob": "64e9c37928d3a211fb080a9d0bec12d6ec6f3183",
        "sha256": "f742e161e6eb256e7265a290e2fd46980d7816aa3ea6936384f295112b333f0e"
      },
      {
        "path": "scripts/n1-publication-lineage.mjs",
        "ref": "d19b8de7d74c5f85cd296946bdb69a2e3b271167",
        "blob": "066bbf558aeaba1bf74072a7984ad4913918dc62",
        "sha256": "4a6f9418054eb4df0248d1171e695bd57d1e58d94d6edbcc14cc68493ef0370e"
      },
      {
        "path": "src/components/publication20-tool.tsx",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "e04f45cf07ae73e801520bf975488d06c433e9ac",
        "sha256": "8b33b466dbe902dfe2f16e580f78c11482d3a960165e3649c3a20033cd51cb02"
      }
    ],
    "intermediateSources": [
      {
        "ref": "d19b8de7d74c5f85cd296946bdb69a2e3b271167",
        "blob": "80dbfecae5fa1aa7083f9f814905e7b61bb150a7",
        "sha256": "10325a313d476a298b2a6096e06296673e51336dc774d03f4a570065d4b546c7"
      }
    ]
  },
  {
    "path": "tests/shortest-publication-20/caller-lineage.test.mjs",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "2b3ce39a3670028601491baadf9b2b2c3462be89",
    "predecessorBlob": "4db35005636145474cb7e53c75a0faeae9dd596f",
    "successorBlob": "982d59e9105d8b727f7ddb2709a5f4586a5227fd",
    "predecessorSHA256": "2c6296e886bc8a58f60b6c8c4ecd7e942301a6dc5479f43aa3cd3b21df1afb03",
    "successorSHA256": "361910419777e0c9e729c32e1b00693804c7e86eec5b05f769c68fb772de4552",
    "supplementalSources": [
      {
        "path": "scripts/publication20-caller-lineage.mjs",
        "ref": "2b3ce39a3670028601491baadf9b2b2c3462be89",
        "blob": "64e9c37928d3a211fb080a9d0bec12d6ec6f3183",
        "sha256": "f742e161e6eb256e7265a290e2fd46980d7816aa3ea6936384f295112b333f0e"
      },
      {
        "path": "scripts/n1-publication-lineage.mjs",
        "ref": "877aa7584392bdde8530dbf6eae1aae30eab6c7b",
        "blob": "066bbf558aeaba1bf74072a7984ad4913918dc62",
        "sha256": "4a6f9418054eb4df0248d1171e695bd57d1e58d94d6edbcc14cc68493ef0370e"
      },
      {
        "path": "src/components/publication20-tool.tsx",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "e04f45cf07ae73e801520bf975488d06c433e9ac",
        "sha256": "8b33b466dbe902dfe2f16e580f78c11482d3a960165e3649c3a20033cd51cb02"
      }
    ],
    "intermediateSources": [
      {
        "ref": "877aa7584392bdde8530dbf6eae1aae30eab6c7b",
        "blob": "3f435b99d732c75082508e8d0a8daa0e2081631c",
        "sha256": "c7963a31a40b4b49324b7c7d6d722577beba66c4bb0033a7af24859add6725f6"
      }
    ]
  },
  {
    "path": "tests/calculator-sprint-20261108/first-two-packet.test.mjs",
    "predecessorRef": "4573902dde62f607ba33acd24e16837805559e02",
    "successorRef": "4c67272e2c6b7ddcbdf59398b02e066c34456e78",
    "predecessorBlob": "943d0ccfe59c8b229d89e6b179a2c55131c3dd8e",
    "successorBlob": "f391899d863f28f61f63c3ccdb2482364b00e2d6",
    "predecessorSHA256": "547e3a2b43e74b74e0c47ad141c6ddae76ab2cd56dd16e03c0e96745aeaa24d5",
    "successorSHA256": "3bd8f4ff257a0d5bbfd998ddf51d9ef8187f81f683d93bb7145fba49a037d5e2",
    "supplementalSources": [
      {
        "path": "docs/calculator-sprint-20261108/first-two-packet.json",
        "ref": "4c67272e2c6b7ddcbdf59398b02e066c34456e78",
        "blob": "9df9d88c76524664f006759aee92d65de8504dd8",
        "sha256": "d034b179e5255b18d0ec7b0fba5c80d57c92b7c638c95acb709c1162f11df363"
      },
      {
        "path": "src/components/publication20-tool.tsx",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "e04f45cf07ae73e801520bf975488d06c433e9ac",
        "sha256": "8b33b466dbe902dfe2f16e580f78c11482d3a960165e3649c3a20033cd51cb02"
      },
      {
        "path": "docs/calculator-sprint-20261108/first-two-packet.json",
        "ref": "9c0b5dc3e3aec18ed03fb6849562ebddc854db06",
        "blob": "9df9d88c76524664f006759aee92d65de8504dd8",
        "sha256": "d034b179e5255b18d0ec7b0fba5c80d57c92b7c638c95acb709c1162f11df363"
      }
    ]
  },
  {
    "path": "src/components/calculator-interactive.tsx",
    "predecessorRef": "a7a656f71b04b50192485a49b0b56b3fa6bd86b9",
    "successorRef": "5c3d38e9454b9dbeb9b8d1220ea8b68532fa4e01",
    "predecessorBlob": "eda303b5e09abb3ab1ac4147b431fb455d3a2c9d",
    "successorBlob": "f21d8bb8b627639c0d55782478b786b1a763748d",
    "predecessorSHA256": "46903cd272e5e8a9b7ff37e338a6d9e149bf8956c4d5bed7afec7f9539d2c123",
    "successorSHA256": "c6296c137d66ab2a731f9144ab58efb3cb2f25dce2f7f31223b0b9a508d93755",
    "supplementalSources": [
      {
        "path": "data/verification/codex-a-standard-risk-goldens-2026-10-15.json",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "3703b3d0ccc59614a7f865687f49b434a03aeef8",
        "sha256": "e5a9b33a487bfa5c083dffd45bb039df459393b1a46a11346d000e11ca1c1ec6"
      },
      {
        "path": "src/calculators/advanced-math/catalog-batch-10.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "ac5f6afd1704fc90ae2672c5ff10b49bef77c28b",
        "sha256": "78370a3240b98b4339d88fdaa95cf57ff963f7b780b0956d6fc541909a0f93de"
      },
      {
        "path": "src/calculators/advanced-math/expression-engine.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "1a24b517ea1eaae6f9d7528e4df89e45989a4fd8",
        "sha256": "52af6dda5267eeeeb34830776a054e1ad1e5051560e99f2483bd7879bedf3d24"
      },
      {
        "path": "src/calculators/advanced-math/graph-example-fixtures.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "c53c6f0aa8c55de457fa8681f13576614d65bf0b",
        "sha256": "c1e5490bf9fd7da179e5138d687f25938370481ea58a40753fd4413e606cd666"
      },
      {
        "path": "src/calculators/business/break-even.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "019513aa43a089d3bbc9963044a27530b204e87e",
        "sha256": "7f9cc4da38039323d768d4576c3054d151706aaf4c3734d1f0fe2045754ec5f9"
      },
      {
        "path": "src/calculators/conversion/catalog-batch-1.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "e4624450fd76ec4b975bc0191dea7dad3bc8fe6e",
        "sha256": "e4c01d7544568d9ce3900b54b50895d3212824ec5ec6dbfcf3e49c92bb014da9"
      },
      {
        "path": "src/calculators/conversion/catalog-batch-2.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "99ea9f4b5b9931ef08122599f5eac0f5c227c733",
        "sha256": "8c8021714b27b2399ea4d27a6bec595e446426ca2e6ad846815e60a9a5b35467"
      },
      {
        "path": "src/calculators/conversion/catalog-batch-3.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "d8f5cb0153a0ae773c0fbd0dd9c999ae8cfb96a3",
        "sha256": "8605a98cbc051450fbd71089d77f174f961ea56d5ee6b743e38c8a473b87c165"
      },
      {
        "path": "src/calculators/core/percentage.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "ae31ae86ff2649fb1c0d0af61c6cf07340dcbfbd",
        "sha256": "abb6d4dfce62afce867ceaa5ea209ec3f9f6ba885016ecd9b5aed452668b21cc"
      },
      {
        "path": "src/calculators/core/unit-conversion.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "6f106ebe1ec6259b51eef820e19edcbd3cd2290b",
        "sha256": "b323d7311c94a07c3da809af6293e775cf97e634e7c5f352fad0710a7a7e174a"
      },
      {
        "path": "src/calculators/decimal-fraction-goldens.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "41df25911c09c8c1c8611c76c6a25d488f41abb9",
        "sha256": "29a5f87e07817fed990d1efa116b4daf1c06b3c91bd00114eee15e6dde406bc5"
      },
      {
        "path": "src/calculators/engine.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "a31d5677039e51f480c975c5b77ce59af13e3b5e",
        "sha256": "41da900c997cdf101aa4d45d336d6319772ddddd0f254c24cb413ff3553b67c6"
      },
      {
        "path": "src/calculators/final-framework/adapters.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "d4268391f4da7984fcab3886a8ad038ae50c8f3c",
        "sha256": "f4749489bbc133a9bb7ca4a89e1dff5809ec2d760979dea833473e10ffc2bfc7"
      },
      {
        "path": "src/calculators/final-framework/analysis-surface-policy.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "054c8d38c60c8df33989b26280d4985e66b47677",
        "sha256": "5fbc0ac497a44826163017f6b18ff743f8720a9ada9165678abc19d1fd9b1cc2"
      },
      {
        "path": "src/calculators/final-framework/analysis.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "0f4c3120d361837b24692319a9aa6656f628d1bf",
        "sha256": "225af2ddbba2bb3aa3f571acc8e4a8eb263f6b553e25fbc7db3bf69254185013"
      },
      {
        "path": "src/calculators/final-framework/capability-presentation.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "7ef9c2e60ff3ee74f9db6d42351f1470b20e9748",
        "sha256": "052187b7cf1d1b06aa6701f5ff7c9f80b7baa733add74242470a8e834e355ad4"
      },
      {
        "path": "src/calculators/final-framework/investment-periods.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "046244762d6e0588ce749fff2636be32cf5247b0",
        "sha256": "d2cfb48822b17ca40c91a35578f53e5c4cb31f8ae1a4e30cbcec6aecca331eba"
      },
      {
        "path": "src/calculators/final-framework/mortgage-rate-analysis.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "4061cd309f50c819d62a4bd5a57e4e20d8f18f5e",
        "sha256": "250c05582df44869d3ec103339774465f61e35a7b649e6f13d6ae01a37605a7e"
      },
      {
        "path": "src/calculators/final-framework/presentation-families.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "9e3d6883e38cf9db848103a08d4ce4787a086346",
        "sha256": "49d3757fcc70950f7b4cfc20bba9fc1b21188c088289774488c25a7e5c032bff"
      },
      {
        "path": "src/calculators/final-framework/product-capabilities.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "507b5faec15f06faaccafff3ba641f624b2ab701",
        "sha256": "9afc4fa5c40c5b3e9fe1cc2409348748dc6534accbe02331932f346322b966c1"
      },
      {
        "path": "src/calculators/final-framework/registered-rate-analysis.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "7e7f310e641da5a1aa354f693c13e6504b4a1f42",
        "sha256": "97cebcf2a1efb21369667d5a2e5aea016bd63e5af05a4b3374a13a82b82295bc"
      },
      {
        "path": "src/calculators/final-framework/registered-value-result.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "53a018a22bb756ef7a7a68781c3141790e87ce08",
        "sha256": "8f8657d8f9e150828aca4e7cf785d597ad9725ce632e3874cb0d03d20551a3c3"
      },
      {
        "path": "src/calculators/final-framework/renderer-display.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "ced3c075199b6e166661195afad525b8a2ebc174",
        "sha256": "5e7af832955bddb26b080daab4261d0ba6d384c76a85164e545f0767fcb91ac3"
      },
      {
        "path": "src/calculators/final-framework/renderer-trust-surface.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "e28e049d9b4ad884cd43f742236f0b495e2f61a4",
        "sha256": "2695c622adb40733cc60b61dc45dfcefb1cb7e2bd7c06267a8cf88ada55ee96a"
      },
      {
        "path": "src/calculators/final-framework/result-inspection.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "dba73a796ae5d4e0e67e77166023eaf90f347d6d",
        "sha256": "0d10f74c3d5572a13e66db85ff3064a72bbe436860542b2d804bfe67b1848572"
      },
      {
        "path": "src/calculators/final-framework/schedule-contract.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "d638f916a31addf2c7b732fde2c0c315f447d1c5",
        "sha256": "49e5b9aca48a755926a43326da6ee01423e63d68ac2932c6be18505bd1c98c37"
      },
      {
        "path": "src/calculators/final-framework/technology-scalar-presentation.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "d0d4a738021a84e08984bad3b45333c57a8030e1",
        "sha256": "bb82638b8347e696e9276fa5e9b062696b1808d3fe8ff82a001538af7c0d5330"
      },
      {
        "path": "src/calculators/final-framework/types.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "4c2c78a9fb5551a80d1f1bc6fb93fe91e7147034",
        "sha256": "b32ace6cd558c56d3036661fb00ec1b0692c93724d3a185fe9fd79136827f8e1"
      },
      {
        "path": "src/calculators/finance/compound-interest-independent-goldens.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "fb19df26bb56e2f43a9e59e666860b469daed50f",
        "sha256": "636f1be17ad0b4597ec0a05cfe0d6f558575cb2b8ebd49a531a80366cbc7bdd8"
      },
      {
        "path": "src/calculators/finance/compound-interest.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "b905832a35146c6233cf4d522c2c1efd36cabf74",
        "sha256": "7c948d1deec2565b9386f9978f1ef6f81c33993354065e9d8a393aeb5cf28b8d"
      },
      {
        "path": "src/calculators/finance/debt-aggregate-independent-goldens.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "e321ca7e31faf1333b76d3bfd433171438479f8a",
        "sha256": "b430852558318dc73083fdb8acf62fb5e2f7e7c54e98b35f0cf1a188d5303109"
      },
      {
        "path": "src/calculators/finance/debt-payoff-independent-goldens.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "85badd8704168e24ee0688949513a903c014b2f0",
        "sha256": "a71ef994534e2ffa35c2d4bba721ddf2b39e67674f69fdf340fb9d944faa7277"
      },
      {
        "path": "src/calculators/finance/loan-analysis.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "21d7cf6d81f35d3528fc0ca48c31d93ca8da5596",
        "sha256": "92d37f5d5219b794d4dde2fa48d77a605fa344501964ae853549981ff81746ef"
      },
      {
        "path": "src/calculators/finance/loan-payment.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "9153ea4b9ef3f28567f07c06ed93ad65f8e73459",
        "sha256": "c4347c6d8d5cc7ea7d95bc2eda914a3f9eb4faba37f373d4be521f71dd2923f5"
      },
      {
        "path": "src/calculators/finance/mortgage.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "85166726e8f4f751e4de9e5decd4c8f17a89287f",
        "sha256": "8f4c7b87637df8e401582493a7ae3ec94b9a252ac08bee0cce00f825bb5d21bd"
      },
      {
        "path": "src/calculators/finance/simple-interest-independent-goldens.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "7c77224f8f74e4fbfbc5fa0eea422cc2085615b3",
        "sha256": "e7380cbb67f037566961e3ca278a4194c9b26dc9aec3a128ea90a08b4ec44036"
      },
      {
        "path": "src/calculators/finance/simple-interest.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "0d54982add07e5c872bf8769f66bfd329b4f96d5",
        "sha256": "602ea32c413f5ed632bb697b4f1583aaa70f4ebe68fadf6a6dac0ae5ef82c773"
      },
      {
        "path": "src/calculators/finance/sip-independent-goldens.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "49f9e15d242c3451c23723763baad78ff680a6af",
        "sha256": "a8ebbac118762b2860d137cb4282f508b510c34912486c8d7082ad365b297a89"
      },
      {
        "path": "src/calculators/finance/sip.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "2c0a3fa5e0837c976e2327a0115473143dafc21f",
        "sha256": "d829448f8d9fa930b5744dcf0128e7ea5e7139c2306e23df83cf622ce134310a"
      },
      {
        "path": "src/calculators/geometry/catalog-completion.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "806c3f2358e3fdd556d3f286cf8ae5ae109a3deb",
        "sha256": "784b527d4380facf78f20092642a70001e83c259d1916f78af44e996a3d344ff"
      },
      {
        "path": "src/calculators/health/bmi.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "cca9a8f44be5d263d323b980e4504cde18f2874a",
        "sha256": "e2597d2b3db50ce3a17c55d558f2b1f64ae48ce49a3815ee0c717127ee1105d6"
      },
      {
        "path": "src/calculators/launch-portfolio.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "ca42438b0193ca6ecc205f4bbab748eef0772881",
        "sha256": "dfb7ffe1547cf96f7608a11e3ef03a95cc8186ce91760dc3bf8754995cff868f"
      },
      {
        "path": "src/calculators/physics/catalog-batch-3.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "286f6a6315a739af3d635ebc89fdf4874b91c511",
        "sha256": "b5c1870d729cbbd32db6eac439c7b6aa2b90f54c3677879bf0a05120a5f0faf6"
      },
      {
        "path": "src/calculators/precision.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "20224230a5011fdc198dcd04c5cb4f3cdb35f8c4",
        "sha256": "139319afc73ef22c45dd46ef94b56b85f3442ed57b239cd6a0e59f92cd68643a"
      },
      {
        "path": "src/calculators/statistics/catalog-batch-1.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "32bcaac6edbe68d220109ce6f9cde62694bcf429",
        "sha256": "172db736ce7c991e0b11cf99612578d7c25374bda0f95e009167e9fa887ba52f"
      },
      {
        "path": "src/calculators/technology-computing/catalog-batch-1.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "a613d01505870f23971c532ecda58703e47f0f18",
        "sha256": "31f347fc286cc0b22cd888b9f53719e4733ffa17ab8323aa4f6dc5bc497079f6"
      },
      {
        "path": "src/calculators/technology-computing/catalog-batch-2.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "07aaf76819064d530a8ad44c497804a63daf283c",
        "sha256": "d352f40f8aef2cbd22afd8c09e577f28fc4eda1b925a928ec65c1ea25f4393d7"
      },
      {
        "path": "src/calculators/types.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "383ec49ebcc653c6d1c464c6b6756c68c0456532",
        "sha256": "a8b9a16ab7d9c63e3918ae93587aace30c5d322a006226cce3d945022ba8b2d8"
      },
      {
        "path": "src/calculators/units.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "ff1ae8f06371eaecd3067bfb8d05e30638215751",
        "sha256": "74e92b7afeb83f53e31e0eed710e5afecb8716df0735556c8fac229793d142ec"
      },
      {
        "path": "src/components/analysis-pagination.tsx",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "c8186e871c295f165298ee7948d76f798de7d6e5",
        "sha256": "160fa330d270a60c4cd35207252c35669a0ea1e83315c0dee5085276f81748bc"
      },
      {
        "path": "src/components/final-analysis-panels.css",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "7193e31f28fd6f6ee12c102bd6282ea83bf124ae",
        "sha256": "b68e79c639418dbb9066817526c84887ae0b4b19a5b92f2e70ccf05a419bd4d9"
      },
      {
        "path": "src/components/final-calculator-renderer.tsx",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "f5a032087a13b9a065bb43500a4b4ad837f497c0",
        "sha256": "95acb3ca32311c3e843371e2e39c3f74d311d99997706d866b1629957796e4b6"
      },
      {
        "path": "src/components/final-schedule-table.css",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "ac92a4107d088e34c55a1efd842ab9a81678bf29",
        "sha256": "0c92d9bbc91b9c0952a4bb59f1dea1e80b3efe0c986e8222cf90bec255686bfc"
      },
      {
        "path": "src/components/final-schedule-table.tsx",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "698d6bdbfcc99a941d5ed823a5a81e0d8f197c1b",
        "sha256": "8dbc8d9143cf526ad8097c997c2e0f5538e6d6574678b08904e476ee5c4b306c"
      },
      {
        "path": "src/components/result-data-error.tsx",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "941e41226c7d9c1d835868f79af03aa49777f981",
        "sha256": "1896fc030991c96dade094def31600240f938cbfbb29a30d399c94edc8ffbbe0"
      },
      {
        "path": "src/components/result-overview-panels.tsx",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "23cdaf289d8cfb5a7f1234fd5fc43b66e3a652f8",
        "sha256": "049c2bde9d7da5a8ecc372833fdab35587ffd4412115bd2a075f5bf56b4332e5"
      },
      {
        "path": "src/components/result-series-panel.tsx",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "b3c1c206e332f456c5704e7751135c018182ace2",
        "sha256": "ee4dc36d15f259a66e4fe9da8fcbd4c2766597e71cb2e56ff6a12d1b53d8b39b"
      },
      {
        "path": "src/components/technology-input-field.tsx",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "7d0d92279bb85d79026c40a87f8ba63403409c1e",
        "sha256": "82e931a240ffb6192553e1154b14df26fbed5852eff41e82b808a0c0ae4badb6"
      },
      {
        "path": "src/lib/batch21-snapshot-replay.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "fd121f20aa0cb67888e231c51158ed3b5843b3ec",
        "sha256": "bbdfd0512ed1b790753c62e01e287bc7d648729179b39bf1182d387845cdcef8"
      },
      {
        "path": "src/lib/batch22-physics-replay.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "6d0a29857a7c746afbf0761c0f1a87fc413be96a",
        "sha256": "97c42822733670f5a215fa5ce51ef929ae1b902ec163d3ec676aa43586d1ef43"
      },
      {
        "path": "src/lib/calculation-snapshot.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "1a2cab16a52d88249fc33103881d6873a1da3f92",
        "sha256": "8e390f0e23bf4b91b95889c5f94083b0342c0683a1d8895b6939ee05b68af73c"
      },
      {
        "path": "src/lib/entitlements.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "26ea79ea3990c5fb61e9cf4a1466ecfe041d27ba",
        "sha256": "16227499beb299e6cf02c2f8485b5804294c97e4da446ac7934b55aedbd1f731"
      },
      {
        "path": "src/lib/launch-snapshot-verification.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "ff9f6799137929a86073b9e98b56298b895071da",
        "sha256": "1418dcda1a71424f34062787ad62bb716e1e96d24fc18d3b45de834affcd196f"
      },
      {
        "path": "src/lib/publication-factory-contracts-input.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "1e3f689af1f5e5e4069a2c611791d812a6cd0003",
        "sha256": "d0c5d00cc0c5d024420f11f21c27534f5b38dc681cbd53d22e750eb4a8dd281f"
      },
      {
        "path": "src/lib/publication20/conversions.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "e5eb250090125c4c1746628ebaeb0ade9eb2de4c",
        "sha256": "33294ef227aa6e4a4a14f4282dcda1834a03396e62c6a0dbc5d4fb932472ec8c"
      },
      {
        "path": "src/lib/publication20/index.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "b87270b0624139410fc1c51facf5f9c3f840d7c6",
        "sha256": "b6b25b6307770a8a3185fe5b72366bdb139d31d33aa7b82a850e7deeab0afd0e"
      },
      {
        "path": "src/lib/publication20/network.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "eeab58837f0d72d37f15f9ec791d41a04989fd1f",
        "sha256": "18ba9ac37cdb9f2634388bde49cff591186e9ed48160aacf340fb19a75432976"
      },
      {
        "path": "src/lib/publication20/result-trust.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "c60f673d6f543cf6fb2254194237823890775455",
        "sha256": "c1e21a0f680f4245424c1542fa59012b9d83347ef4da3e1309b4b61eba6cbbd9"
      },
      {
        "path": "src/lib/publication20/types.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "2e42fd0271f28ab2f038a126f1c8af2665ef692e",
        "sha256": "382d11b9368e24c80985aef7c73c7c05a610d594ddbfa1e51f67584eb04e0f3b"
      },
      {
        "path": "src/lib/recorded-json-equality.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "7c938f6983eae11a352c2cfb67dc428d0fa635f0",
        "sha256": "59fda934bec9e573c970d5a451b3d3e3ba14292838a9c6544cafbd10e71f0fcc"
      },
      {
        "path": "src/lib/registered-input-successor.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "5942ee6b030b5ebd22cbe26c89952052a88d4b3e",
        "sha256": "509826a3de1c3cf91afcf992ebed422019bfc489fd387f250f6706ea18ad28d9"
      },
      {
        "path": "src/lib/registered-snapshot-replay.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "8985adadcd1e50a3fc97113c7525b58934756b6d",
        "sha256": "4d6a168ff5072e1ad0f2cfb051a69750d6a2fb0f360164038597fb24ed0128d6"
      },
      {
        "path": "src/lib/registered-snapshot-verification.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "3b376f0481a59a2e897ea01a8033ca2f5c857972",
        "sha256": "24bf6f31ef7283d9fc319598268c1047ff1c58cd95bda787d55b396e9e3bde4c"
      },
      {
        "path": "src/lib/scenario-display-metadata.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "bdf3ff13a0ac05f65b9798e146da05284d6d6d64",
        "sha256": "6eb96f8a21f938f7cd97c0f011b1f67461da47c95203fcf625821da86a76508e"
      },
      {
        "path": "src/lib/technology-snapshot-verification.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "4276012566e6c4732fac71548365d73c6ca4f731",
        "sha256": "276ad7ee37203fa90b65571a3bab1b3dde271f13c1f323a1e8d330a6bab9e521"
      },
      {
        "path": "package-lock.json",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "dd368ceb52d75eb3998241a001b9e533373146c5",
        "sha256": "b564e5ff97f9dad6c934e6a2eb0977871b2ee3f0b36a23325f1715b241114273"
      },
      {
        "path": "src/components/technology-worked-example.tsx",
        "ref": "3c2b768ecc9e6e0821df8e74c779d134e99c4f48",
        "blob": "3e00400a9f2a1523b3e69b0e39e87fc5a8df7c8e",
        "sha256": "cb1a00a76008105dc439c803c8f2c8ea44fe59cd778affb0816dc2dacbc5abf7"
      },
      {
        "path": "src/lib/presentation-entitlements.ts",
        "ref": "3c2b768ecc9e6e0821df8e74c779d134e99c4f48",
        "blob": "0f9cbc2bbf634ea5430a52b30877db556547bd1b",
        "sha256": "ca2e6ccd90b731cd24c474eeafa7d16d6dc588e85881b8f8f68369b4a627c7dd"
      },
      {
        "path": "src/lib/technology-capture-trust.ts",
        "ref": "3c2b768ecc9e6e0821df8e74c779d134e99c4f48",
        "blob": "c167228a6cf2b5fce861d7abd3b913c6af592e1f",
        "sha256": "364a0d58de1a63828128a8407e0a4ff58d2ae750ba72f11431124c8e12e3e408"
      },
      {
        "path": "src/lib/technology-five-analysis.ts",
        "ref": "00651cc382be5dcbd596882071787fd6702c13d3",
        "blob": "b892dafbbc6a564e5954512d4cd16f84abb24279",
        "sha256": "3313a27f4956e195532da03185d1f61a3e9861456edc1bc64a3ca924a5fde99e"
      },
      {
        "path": "src/lib/technology-five-analysis.test.ts",
        "ref": "00651cc382be5dcbd596882071787fd6702c13d3",
        "blob": "21e7e892e09d78f0088161e5f183ae8968f84197",
        "sha256": "09ddbc3ef8d987dbd54d306731934a9062cb6131851f2c093ea90202b35f5e1e"
      },
      {
        "path": "src/components/technology-five-analysis.tsx",
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "29fdf234270b65f76100f2b15f27bd9e6a706a61",
        "sha256": "137ff472c20404e12e1e402c9c994cc75559f8f59bc54f70a8dd3bd6920fbc72"
      },
      {
        "path": "src/components/technology-five-analysis.test.tsx",
        "ref": "00651cc382be5dcbd596882071787fd6702c13d3",
        "blob": "80a1dc9577a8802cf64436f34fc8f243c6575e9b",
        "sha256": "daa068fb778878430f85e635a0687478c5a2627f275d257efc7ca44bde65b876"
      },
      {
        "path": "src/lib/technology-five-batch.ts",
        "ref": "b282c57cc6b1e72adf7435fac1e849b2bdddd85a",
        "blob": "9f2a487ffd55bdc74440dd6440df7df007d1bdd2",
        "sha256": "5e894682ca6b12f58c9ec0eb52b3ce5a0a3395683e434bb7df4c7de7e72cb03f"
      },
      {
        "path": "src/lib/technology-five-batch.test.ts",
        "ref": "b282c57cc6b1e72adf7435fac1e849b2bdddd85a",
        "blob": "8137e891c77652b2d1c2932a5d52d1f62a8b2c22",
        "sha256": "62378531a9e42660fdac42a08c63347c6ec6631140f5edf0b85bff6c522b2a70"
      },
      {
        "path": "src/components/technology-five-batch.tsx",
        "ref": "b282c57cc6b1e72adf7435fac1e849b2bdddd85a",
        "blob": "e462dd8acda589ae065fcf3727d031c1daeaaa23",
        "sha256": "d0dbaffa0ebdb55bfa884e25ba413592aa65901d3e99700c5dca426f36bbc5eb"
      },
      {
        "path": "src/components/technology-five-batch.test.tsx",
        "ref": "b282c57cc6b1e72adf7435fac1e849b2bdddd85a",
        "blob": "5848f6a3e0c27af125ef4f1949e89de8261bfe0e",
        "sha256": "969f2894029f3ce7b93ed762f29d350d7a686cb36685ffb1e8f289b76bcd022b"
      },
      {
        "path": "src/components/technology-next-analysis.test.tsx",
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "6123d5630d0ac6fcaaf030f1aa3b1918c7d2127b",
        "sha256": "4192ad972f773fba37c3ffb0362a867e0059f0faa98178f05a0793324a4d7968"
      },
      {
        "path": "src/components/technology-next-analysis.tsx",
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "c40931952b18569fc25cf643d1568c148fb35468",
        "sha256": "4c1bb64adc75daf2e4702d75ab90525167e0666f780edef2476c7e35e4f87c61"
      },
      {
        "path": "src/components/technology-next-batch.tsx",
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "264e354d1c61a0aedd494eb8d7a21a7d312e1512",
        "sha256": "cded7113eb80c983e39c5ca3c5c50d099e8734a89a71f933dc1b980742b993ab"
      },
      {
        "path": "src/components/technology-next-integration.test.tsx",
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "99594cd49ea3e797c46681b32424a0e48326adaa",
        "sha256": "cb9c699da78af1facf12cc01df7ca33878b0f31827599c133e6ff0dc7d24cdfb"
      },
      {
        "path": "src/lib/native-delivery/technology-next-catalog.ts",
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "5a0e0ac3212df3e7b039feb8ccdb91a6a91fe716",
        "sha256": "6e6c0cdca34a7d084c3baeaa64e639aba790853ca2ef0ecfa17faae800369cc6"
      },
      {
        "path": "src/lib/technology-next-analysis.test.ts",
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "fe7a911972faf685e5681fd8ac0a73e29bae2b86",
        "sha256": "01299f5dbf16a1e14bd63e51dbf09ba191859bad782bd5074a43e83f3a00d27f"
      },
      {
        "path": "src/lib/technology-next-analysis.ts",
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "257b9818c43d053cdcc493c942b9896ec60afc96",
        "sha256": "7f9a698de33a9fbe87dafb758061fadb830af2722cf8bd06df258c037ff38784"
      },
      {
        "path": "src/lib/technology-next-batch.test.ts",
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "7ec01d8ee7fc9068afe4b5fc69ed6c3fa47a8bf8",
        "sha256": "46d7a6be31abcb8e5df4532d332294fc81d1007933c5b6c66fb66c897537c37d"
      },
      {
        "path": "src/lib/technology-next-batch.ts",
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "d237294823478072e1fee82dc041ffa5481ba602",
        "sha256": "e484171805140fb6ed95f31829d82217446fac6f34981994a183eaf76889a481"
      },
      {
        "path": "src/lib/technology-next-capture-trust.test.ts",
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "b4c316c28c5b043892fdefcae670c5e29c997ef3",
        "sha256": "18deccf2ff8ebc99a3d4aca3772a15d63c4caf85ec8e2884ec4f6040ac814e13"
      },
      {
        "path": "src/lib/technology-next-capture-trust.ts",
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "57c26c62aa91611d448fe6d32df07d49182c073f",
        "sha256": "7d26d1d359895f15bb8f0bdf121dcd23b2bfb3871842124ea8b951dee9e36e22"
      },
      {
        "path": "src/lib/technology-current-presentation.ts",
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "129542639d2de6329be1b7c413d19e1301ed547f",
        "sha256": "57461c97356fa79a69bb3a8e4d3e1edd50c798a1f8fa9bed3da41d05f406d3c5"
      },
      {
        "path": "src/lib/technology-current-presentation.test.ts",
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "f0192563de42b7d4bda286e2f433202d91fdb216",
        "sha256": "fa3836a0e0cf0a897fa6916f9644ca9ac14f2ab104c3c3b2d4c010ba473baf40"
      },
      {
        "path": "src/components/technology-bounded-analysis.test.tsx",
        "ref": "5c3d38e9454b9dbeb9b8d1220ea8b68532fa4e01",
        "blob": "cde343cf5103a9097f0e35ba1221e107299d3753",
        "sha256": "78b4136a77477d4964bd427cd186a90d3522f9803fabbba1568dd42699f6b6c0"
      },
      {
        "path": "src/components/technology-bounded-analysis.tsx",
        "ref": "5c3d38e9454b9dbeb9b8d1220ea8b68532fa4e01",
        "blob": "831ef43e286a3220afbaae23819897f6bb3abbe7",
        "sha256": "ee696f0d2368e8149bae17d62cfab4d54f79c7af80d84a5eca613d43d517ff4f"
      },
      {
        "path": "src/components/technology-next-five-integration.test.tsx",
        "ref": "5c3d38e9454b9dbeb9b8d1220ea8b68532fa4e01",
        "blob": "a1bb196a567915d95243052d1f94c69247cf263d",
        "sha256": "16641ee70ea24a8d91bb466ce75655c754fe7748a15ab291342ad1f49b897849"
      },
      {
        "path": "src/lib/native-delivery/technology-next-five-catalog.ts",
        "ref": "5c3d38e9454b9dbeb9b8d1220ea8b68532fa4e01",
        "blob": "596f0b625f14406a8e3a3a0a92c9221b1a78d657",
        "sha256": "7a76dc3cc73ded01ac33266b9a1736a5318769095840d770ae11ce336f79f586"
      },
      {
        "path": "src/lib/native-delivery/technology-next-five-contract.test.ts",
        "ref": "5c3d38e9454b9dbeb9b8d1220ea8b68532fa4e01",
        "blob": "817095f13271b82f30cff6dbd900979f1d1fc8e7",
        "sha256": "477318fbe5c77be6c50fbcd27b593f4452f8db74f714a2927835d28ec9fa9bfa"
      },
      {
        "path": "src/lib/native-delivery/technology-next-five-contract.ts",
        "ref": "5c3d38e9454b9dbeb9b8d1220ea8b68532fa4e01",
        "blob": "f315a72d4ac8570503899e800fe16e1bb9e1c2ff",
        "sha256": "59bb8f5dfe8cccdae8615600cb6acbeacbbf66f756e460578a465e36f14e658c"
      },
      {
        "path": "src/lib/technology-next-five-analysis.test.ts",
        "ref": "5c3d38e9454b9dbeb9b8d1220ea8b68532fa4e01",
        "blob": "3c62c71f142254a30f91711b23c20543bb28c357",
        "sha256": "b55e55da35a5dd0458024cbcadc53847b72333dd4b6ef9bad7edee04b31106af"
      },
      {
        "path": "src/lib/technology-next-five-analysis.ts",
        "ref": "5c3d38e9454b9dbeb9b8d1220ea8b68532fa4e01",
        "blob": "f3155670788906829c8a078c6eb693f63175a633",
        "sha256": "30f5410307616bb08e2c707044c538f7df7ebdf2769767ec526c6d0e8aa64b80"
      },
      {
        "path": "src/app/api/business/technology-five-shares/route.test.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "c79d519d89b28126e35f02c63bc1531f98614f92",
        "sha256": "14b78e888973182d1f0b3bc8c5b9078f7fe8818948cacf7674e3351f4018794a"
      },
      {
        "path": "src/app/business/projects/[id]/page.test.tsx",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "afd6bfc41e6e9c9b11828fc9ba3bfb088abeae11",
        "sha256": "f0635df7a7fa341835e14aae0022f03f4396a9a14233fa2c60f1a7b09f32e6ef"
      },
      {
        "path": "src/app/business/projects/[id]/page.tsx",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "e10077a017b7215f49789db7782a7419635d065c",
        "sha256": "91b2546a1469aa40bec4a042f21aa4560ca2c1bc0bef1a30d6013d3ddc970b2e"
      },
      {
        "path": "src/components/technology-five-share-form.tsx",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "972a48ec512bf44ba9960365c1254f1b7d26ae3a",
        "sha256": "7ed40e28d9dbbba689e9fd71c5b935dffad49fc490f2249f8daf0a9c9cd3404d"
      },
      {
        "path": "src/lib/business/technology-next-sharing.test.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "e8758f162963a63e65ac2746d07f0b50f94edde5",
        "sha256": "0337b9b88ade20d62099911fe1e799e8d7239ba0a83885f79e1a973ceed10672"
      },
      {
        "path": "src/lib/business/technology-next-sharing.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "748efaed09ddac09f65d8013859a7e8bf432b672",
        "sha256": "55fb98218fd867a88344fcaee43f546f010515f18114ac14e6d5f0c4d938545f"
      },
      {
        "path": "src/lib/native-delivery/technology-five-catalog.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "064f6559f6282267cf87152b0873a30ef09e3cbc",
        "sha256": "9c043fbdb5cca8dbd3bc79ebc2356225551719b03e4dd495321ca7019d4a460d"
      },
      {
        "path": "src/lib/native-delivery/technology-five-contract.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "ed0ffd6908e681409d245ca360ebc0e0d5d00e3d",
        "sha256": "1df758ea71a6f86e4db51290e959ee305c8a426b497ba87ad97f7230f72c25cf"
      },
      {
        "path": "src/lib/native-delivery/technology-five-publication.test.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "743d71ac91891ffcdb41d1017eb925a4664e24e4",
        "sha256": "aa4bbb70f4da137b081718b3dbc3453e4906c9330dbade179b8aa8bb630b6aa3"
      },
      {
        "path": "src/lib/native-delivery/technology-native-schema.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "a884b7b019a69336f719cbde80ef52c69d7aef72",
        "sha256": "e1a7d88868b956857b9b66a5ed5a37066716ce42fd5f61d170a4e665853d008d"
      },
      {
        "path": "src/lib/native-delivery/technology-next-composition.test.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "1939e5cd6261505d30b07143cd79da035b751c1b",
        "sha256": "b34138e4006fb27130ea80a2f54fe7688f9edd3fdee41fffcf4f9f1a6cc66625"
      },
      {
        "path": "src/lib/native-delivery/technology-next-five-composition.test.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "4258a08d23002eed23d677cafbe8ffa82f36143d",
        "sha256": "f60e7e35c8e4b76e790081ce9f4d24fc07082246af1f31e9876e2eefbcff8d4d"
      }
    ],
    "intermediateSources": [
      {
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "68ba0847e88f64dde70f0cadd9b023a700fee935",
        "sha256": "91e5cc8ac9e1fdf11ed5b617b6ad3604fcb43b9b862d26a1510f59716e79bc3e"
      },
      {
        "ref": "811bbd67bfcc635808101a351fa15eb133331369",
        "blob": "0e2929a7e2d8eac6065e3797372fab8d8c42daa3",
        "sha256": "43b49715779e5b3eb5f4046aa72bd078d3ba239614b879164bce96ca0e54a419"
      },
      {
        "ref": "3c2b768ecc9e6e0821df8e74c779d134e99c4f48",
        "blob": "f6b335e7176496c06b613274080c3869f52be1e1",
        "sha256": "4d0052350bab20261b7e6ef2f6c5718a6a3b3dfbf2c239b4e15e92140bd472eb"
      },
      {
        "ref": "56763645c091743508c1b7a163c7c59dcb7f4b7d",
        "blob": "ef3c87fa0c649ca276a26ebafcc4bf7fe8acdec1",
        "sha256": "37fc960bff233089d8ffe66c85bc113723d8fd9b3551b48792f7c72686e9186a"
      },
      {
        "ref": "d1ea2fd979fa02e1d107e48aedcba72086115f6e",
        "blob": "13ec2a7c55d2b7bda3e5a732f92ae46b29966e7a",
        "sha256": "00961551ea2a8d7e5750a67741f1b64f23d8e5b3237bc6e5b229d43b10fc85de"
      },
      {
        "ref": "955e2ed5df93e646275c4d94d33548cac5925380",
        "blob": "b5977fef07773c4eda98f1bb430c698681f45ab3",
        "sha256": "ae8462ecc006a8125c42f3ed92627e7cb39a9b73bb4cd9e92a1c9eb869def435"
      },
      {
        "ref": "00651cc382be5dcbd596882071787fd6702c13d3",
        "blob": "5fc7d34fee30fec986f1b7169925e2dc1169a5b6",
        "sha256": "8f033f08da04fddfcedf6a230dc4a93aaff97d9c8f69b20bf4e1be0341ddebb6"
      },
      {
        "ref": "d416617b5c0533fe5d4d8a3f9fa5b15b9b539cbb",
        "blob": "5fc7d34fee30fec986f1b7169925e2dc1169a5b6",
        "sha256": "8f033f08da04fddfcedf6a230dc4a93aaff97d9c8f69b20bf4e1be0341ddebb6"
      },
      {
        "ref": "1ec63cd11626df15063546c7e5bfedecec33f6ee",
        "blob": "5fc7d34fee30fec986f1b7169925e2dc1169a5b6",
        "sha256": "8f033f08da04fddfcedf6a230dc4a93aaff97d9c8f69b20bf4e1be0341ddebb6"
      },
      {
        "ref": "6a8f10cb628b6f2735b184c1ca17c92b947b1b52",
        "blob": "901fb2805642607791b86b018dadf8c62aa6e1d5",
        "sha256": "6d69eefc01ad532d052736cc6ffa7b78d5a4a5ccb00c449d4fc2907a4e41e2a7"
      },
      {
        "ref": "1b2b0ca2b373dd654ecb19e2a456754f7209c9ce",
        "blob": "901fb2805642607791b86b018dadf8c62aa6e1d5",
        "sha256": "6d69eefc01ad532d052736cc6ffa7b78d5a4a5ccb00c449d4fc2907a4e41e2a7"
      },
      {
        "ref": "3dede6fa4c084594c4f35b5b4b17dd469436d208",
        "blob": "4ab46f5b42589e89099eba00068295d57e8f4ed6",
        "sha256": "a1e28af69cb2ee1b5e3cafcc66111b9baba3ae8f09e4287968e1f6fcb6c17a87"
      },
      {
        "ref": "f0da9eb0d35ef0e7f95b566ac875716edf4fd276",
        "blob": "4ab46f5b42589e89099eba00068295d57e8f4ed6",
        "sha256": "a1e28af69cb2ee1b5e3cafcc66111b9baba3ae8f09e4287968e1f6fcb6c17a87"
      },
      {
        "ref": "2d0e2622292930d1992813998608d933ddf5024e",
        "blob": "45e102f0d97e8db360dc2a09efcb0e3867df8275",
        "sha256": "af625bb001afe2cc52eea383f6e6462a5eb728b74de321f84d436611729ea5ad"
      },
      {
        "ref": "23f2860c16310385f6c37f7a2bc3c86890631c98",
        "blob": "45e102f0d97e8db360dc2a09efcb0e3867df8275",
        "sha256": "af625bb001afe2cc52eea383f6e6462a5eb728b74de321f84d436611729ea5ad"
      },
      {
        "ref": "2188237e0900b27620bc832ade902d895d085cec",
        "blob": "8dd7607740d9bbaa3033a5708554ac53e452cc67",
        "sha256": "b2ba543cacf4a9b617addcab427cb875b82a2d4f8eb37bf029130b57356a5ef8"
      },
      {
        "ref": "7a50c124fd46f0f356affd8defde535ab7c2594c",
        "blob": "8dd7607740d9bbaa3033a5708554ac53e452cc67",
        "sha256": "b2ba543cacf4a9b617addcab427cb875b82a2d4f8eb37bf029130b57356a5ef8"
      }
    ]
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "predecessorRef": "a7a656f71b04b50192485a49b0b56b3fa6bd86b9",
    "successorRef": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
    "predecessorBlob": "df44d2b717ec5ed647360cfbdb955c9b814b211b",
    "successorBlob": "3b376f0481a59a2e897ea01a8033ca2f5c857972",
    "predecessorSHA256": "a6ce5fdb736ccd748c99b703169ad5d931aea9ccb8460feb2b3cbab80a68bda6",
    "successorSHA256": "24bf6f31ef7283d9fc319598268c1047ff1c58cd95bda787d55b396e9e3bde4c",
    "supplementalSources": [
      {
        "path": "data/verification/codex-a-standard-risk-goldens-2026-10-15.json",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "3703b3d0ccc59614a7f865687f49b434a03aeef8",
        "sha256": "e5a9b33a487bfa5c083dffd45bb039df459393b1a46a11346d000e11ca1c1ec6"
      },
      {
        "path": "src/calculators/advanced-math/catalog-batch-10.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "ac5f6afd1704fc90ae2672c5ff10b49bef77c28b",
        "sha256": "78370a3240b98b4339d88fdaa95cf57ff963f7b780b0956d6fc541909a0f93de"
      },
      {
        "path": "src/calculators/advanced-math/expression-engine.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "1a24b517ea1eaae6f9d7528e4df89e45989a4fd8",
        "sha256": "52af6dda5267eeeeb34830776a054e1ad1e5051560e99f2483bd7879bedf3d24"
      },
      {
        "path": "src/calculators/advanced-math/graph-example-fixtures.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "c53c6f0aa8c55de457fa8681f13576614d65bf0b",
        "sha256": "c1e5490bf9fd7da179e5138d687f25938370481ea58a40753fd4413e606cd666"
      },
      {
        "path": "src/calculators/business/break-even.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "019513aa43a089d3bbc9963044a27530b204e87e",
        "sha256": "7f9cc4da38039323d768d4576c3054d151706aaf4c3734d1f0fe2045754ec5f9"
      },
      {
        "path": "src/calculators/conversion/catalog-batch-1.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "e4624450fd76ec4b975bc0191dea7dad3bc8fe6e",
        "sha256": "e4c01d7544568d9ce3900b54b50895d3212824ec5ec6dbfcf3e49c92bb014da9"
      },
      {
        "path": "src/calculators/conversion/catalog-batch-2.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "99ea9f4b5b9931ef08122599f5eac0f5c227c733",
        "sha256": "8c8021714b27b2399ea4d27a6bec595e446426ca2e6ad846815e60a9a5b35467"
      },
      {
        "path": "src/calculators/conversion/catalog-batch-3.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "d8f5cb0153a0ae773c0fbd0dd9c999ae8cfb96a3",
        "sha256": "8605a98cbc051450fbd71089d77f174f961ea56d5ee6b743e38c8a473b87c165"
      },
      {
        "path": "src/calculators/core/percentage.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "ae31ae86ff2649fb1c0d0af61c6cf07340dcbfbd",
        "sha256": "abb6d4dfce62afce867ceaa5ea209ec3f9f6ba885016ecd9b5aed452668b21cc"
      },
      {
        "path": "src/calculators/core/unit-conversion.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "6f106ebe1ec6259b51eef820e19edcbd3cd2290b",
        "sha256": "b323d7311c94a07c3da809af6293e775cf97e634e7c5f352fad0710a7a7e174a"
      },
      {
        "path": "src/calculators/decimal-fraction-goldens.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "41df25911c09c8c1c8611c76c6a25d488f41abb9",
        "sha256": "29a5f87e07817fed990d1efa116b4daf1c06b3c91bd00114eee15e6dde406bc5"
      },
      {
        "path": "src/calculators/engine.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "a31d5677039e51f480c975c5b77ce59af13e3b5e",
        "sha256": "41da900c997cdf101aa4d45d336d6319772ddddd0f254c24cb413ff3553b67c6"
      },
      {
        "path": "src/calculators/final-framework/adapters.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "d4268391f4da7984fcab3886a8ad038ae50c8f3c",
        "sha256": "f4749489bbc133a9bb7ca4a89e1dff5809ec2d760979dea833473e10ffc2bfc7"
      },
      {
        "path": "src/calculators/final-framework/analysis-surface-policy.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "054c8d38c60c8df33989b26280d4985e66b47677",
        "sha256": "5fbc0ac497a44826163017f6b18ff743f8720a9ada9165678abc19d1fd9b1cc2"
      },
      {
        "path": "src/calculators/final-framework/analysis.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "0f4c3120d361837b24692319a9aa6656f628d1bf",
        "sha256": "225af2ddbba2bb3aa3f571acc8e4a8eb263f6b553e25fbc7db3bf69254185013"
      },
      {
        "path": "src/calculators/final-framework/capability-presentation.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "7ef9c2e60ff3ee74f9db6d42351f1470b20e9748",
        "sha256": "052187b7cf1d1b06aa6701f5ff7c9f80b7baa733add74242470a8e834e355ad4"
      },
      {
        "path": "src/calculators/final-framework/investment-periods.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "046244762d6e0588ce749fff2636be32cf5247b0",
        "sha256": "d2cfb48822b17ca40c91a35578f53e5c4cb31f8ae1a4e30cbcec6aecca331eba"
      },
      {
        "path": "src/calculators/final-framework/mortgage-rate-analysis.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "4061cd309f50c819d62a4bd5a57e4e20d8f18f5e",
        "sha256": "250c05582df44869d3ec103339774465f61e35a7b649e6f13d6ae01a37605a7e"
      },
      {
        "path": "src/calculators/final-framework/presentation-families.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "9e3d6883e38cf9db848103a08d4ce4787a086346",
        "sha256": "49d3757fcc70950f7b4cfc20bba9fc1b21188c088289774488c25a7e5c032bff"
      },
      {
        "path": "src/calculators/final-framework/product-capabilities.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "507b5faec15f06faaccafff3ba641f624b2ab701",
        "sha256": "9afc4fa5c40c5b3e9fe1cc2409348748dc6534accbe02331932f346322b966c1"
      },
      {
        "path": "src/calculators/final-framework/registered-rate-analysis.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "7e7f310e641da5a1aa354f693c13e6504b4a1f42",
        "sha256": "97cebcf2a1efb21369667d5a2e5aea016bd63e5af05a4b3374a13a82b82295bc"
      },
      {
        "path": "src/calculators/final-framework/registered-value-result.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "53a018a22bb756ef7a7a68781c3141790e87ce08",
        "sha256": "8f8657d8f9e150828aca4e7cf785d597ad9725ce632e3874cb0d03d20551a3c3"
      },
      {
        "path": "src/calculators/final-framework/renderer-display.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "ced3c075199b6e166661195afad525b8a2ebc174",
        "sha256": "5e7af832955bddb26b080daab4261d0ba6d384c76a85164e545f0767fcb91ac3"
      },
      {
        "path": "src/calculators/final-framework/renderer-trust-surface.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "e28e049d9b4ad884cd43f742236f0b495e2f61a4",
        "sha256": "2695c622adb40733cc60b61dc45dfcefb1cb7e2bd7c06267a8cf88ada55ee96a"
      },
      {
        "path": "src/calculators/final-framework/result-inspection.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "dba73a796ae5d4e0e67e77166023eaf90f347d6d",
        "sha256": "0d10f74c3d5572a13e66db85ff3064a72bbe436860542b2d804bfe67b1848572"
      },
      {
        "path": "src/calculators/final-framework/schedule-contract.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "d638f916a31addf2c7b732fde2c0c315f447d1c5",
        "sha256": "49e5b9aca48a755926a43326da6ee01423e63d68ac2932c6be18505bd1c98c37"
      },
      {
        "path": "src/calculators/final-framework/technology-scalar-presentation.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "d0d4a738021a84e08984bad3b45333c57a8030e1",
        "sha256": "bb82638b8347e696e9276fa5e9b062696b1808d3fe8ff82a001538af7c0d5330"
      },
      {
        "path": "src/calculators/final-framework/types.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "4c2c78a9fb5551a80d1f1bc6fb93fe91e7147034",
        "sha256": "b32ace6cd558c56d3036661fb00ec1b0692c93724d3a185fe9fd79136827f8e1"
      },
      {
        "path": "src/calculators/finance/compound-interest-independent-goldens.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "fb19df26bb56e2f43a9e59e666860b469daed50f",
        "sha256": "636f1be17ad0b4597ec0a05cfe0d6f558575cb2b8ebd49a531a80366cbc7bdd8"
      },
      {
        "path": "src/calculators/finance/compound-interest.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "b905832a35146c6233cf4d522c2c1efd36cabf74",
        "sha256": "7c948d1deec2565b9386f9978f1ef6f81c33993354065e9d8a393aeb5cf28b8d"
      },
      {
        "path": "src/calculators/finance/debt-aggregate-independent-goldens.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "e321ca7e31faf1333b76d3bfd433171438479f8a",
        "sha256": "b430852558318dc73083fdb8acf62fb5e2f7e7c54e98b35f0cf1a188d5303109"
      },
      {
        "path": "src/calculators/finance/debt-payoff-independent-goldens.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "85badd8704168e24ee0688949513a903c014b2f0",
        "sha256": "a71ef994534e2ffa35c2d4bba721ddf2b39e67674f69fdf340fb9d944faa7277"
      },
      {
        "path": "src/calculators/finance/loan-analysis.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "21d7cf6d81f35d3528fc0ca48c31d93ca8da5596",
        "sha256": "92d37f5d5219b794d4dde2fa48d77a605fa344501964ae853549981ff81746ef"
      },
      {
        "path": "src/calculators/finance/loan-payment.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "9153ea4b9ef3f28567f07c06ed93ad65f8e73459",
        "sha256": "c4347c6d8d5cc7ea7d95bc2eda914a3f9eb4faba37f373d4be521f71dd2923f5"
      },
      {
        "path": "src/calculators/finance/mortgage.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "85166726e8f4f751e4de9e5decd4c8f17a89287f",
        "sha256": "8f4c7b87637df8e401582493a7ae3ec94b9a252ac08bee0cce00f825bb5d21bd"
      },
      {
        "path": "src/calculators/finance/simple-interest-independent-goldens.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "7c77224f8f74e4fbfbc5fa0eea422cc2085615b3",
        "sha256": "e7380cbb67f037566961e3ca278a4194c9b26dc9aec3a128ea90a08b4ec44036"
      },
      {
        "path": "src/calculators/finance/simple-interest.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "0d54982add07e5c872bf8769f66bfd329b4f96d5",
        "sha256": "602ea32c413f5ed632bb697b4f1583aaa70f4ebe68fadf6a6dac0ae5ef82c773"
      },
      {
        "path": "src/calculators/finance/sip-independent-goldens.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "49f9e15d242c3451c23723763baad78ff680a6af",
        "sha256": "a8ebbac118762b2860d137cb4282f508b510c34912486c8d7082ad365b297a89"
      },
      {
        "path": "src/calculators/finance/sip.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "2c0a3fa5e0837c976e2327a0115473143dafc21f",
        "sha256": "d829448f8d9fa930b5744dcf0128e7ea5e7139c2306e23df83cf622ce134310a"
      },
      {
        "path": "src/calculators/geometry/catalog-completion.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "806c3f2358e3fdd556d3f286cf8ae5ae109a3deb",
        "sha256": "784b527d4380facf78f20092642a70001e83c259d1916f78af44e996a3d344ff"
      },
      {
        "path": "src/calculators/health/bmi.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "cca9a8f44be5d263d323b980e4504cde18f2874a",
        "sha256": "e2597d2b3db50ce3a17c55d558f2b1f64ae48ce49a3815ee0c717127ee1105d6"
      },
      {
        "path": "src/calculators/launch-portfolio.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "ca42438b0193ca6ecc205f4bbab748eef0772881",
        "sha256": "dfb7ffe1547cf96f7608a11e3ef03a95cc8186ce91760dc3bf8754995cff868f"
      },
      {
        "path": "src/calculators/physics/catalog-batch-3.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "286f6a6315a739af3d635ebc89fdf4874b91c511",
        "sha256": "b5c1870d729cbbd32db6eac439c7b6aa2b90f54c3677879bf0a05120a5f0faf6"
      },
      {
        "path": "src/calculators/precision.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "20224230a5011fdc198dcd04c5cb4f3cdb35f8c4",
        "sha256": "139319afc73ef22c45dd46ef94b56b85f3442ed57b239cd6a0e59f92cd68643a"
      },
      {
        "path": "src/calculators/statistics/catalog-batch-1.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "32bcaac6edbe68d220109ce6f9cde62694bcf429",
        "sha256": "172db736ce7c991e0b11cf99612578d7c25374bda0f95e009167e9fa887ba52f"
      },
      {
        "path": "src/calculators/technology-computing/catalog-batch-1.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "a613d01505870f23971c532ecda58703e47f0f18",
        "sha256": "31f347fc286cc0b22cd888b9f53719e4733ffa17ab8323aa4f6dc5bc497079f6"
      },
      {
        "path": "src/calculators/technology-computing/catalog-batch-2.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "07aaf76819064d530a8ad44c497804a63daf283c",
        "sha256": "d352f40f8aef2cbd22afd8c09e577f28fc4eda1b925a928ec65c1ea25f4393d7"
      },
      {
        "path": "src/calculators/types.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "383ec49ebcc653c6d1c464c6b6756c68c0456532",
        "sha256": "a8b9a16ab7d9c63e3918ae93587aace30c5d322a006226cce3d945022ba8b2d8"
      },
      {
        "path": "src/calculators/units.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "ff1ae8f06371eaecd3067bfb8d05e30638215751",
        "sha256": "74e92b7afeb83f53e31e0eed710e5afecb8716df0735556c8fac229793d142ec"
      },
      {
        "path": "src/components/analysis-pagination.tsx",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "c8186e871c295f165298ee7948d76f798de7d6e5",
        "sha256": "160fa330d270a60c4cd35207252c35669a0ea1e83315c0dee5085276f81748bc"
      },
      {
        "path": "src/components/final-analysis-panels.css",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "7193e31f28fd6f6ee12c102bd6282ea83bf124ae",
        "sha256": "b68e79c639418dbb9066817526c84887ae0b4b19a5b92f2e70ccf05a419bd4d9"
      },
      {
        "path": "src/components/final-calculator-renderer.tsx",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "f5a032087a13b9a065bb43500a4b4ad837f497c0",
        "sha256": "95acb3ca32311c3e843371e2e39c3f74d311d99997706d866b1629957796e4b6"
      },
      {
        "path": "src/components/final-schedule-table.css",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "ac92a4107d088e34c55a1efd842ab9a81678bf29",
        "sha256": "0c92d9bbc91b9c0952a4bb59f1dea1e80b3efe0c986e8222cf90bec255686bfc"
      },
      {
        "path": "src/components/final-schedule-table.tsx",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "698d6bdbfcc99a941d5ed823a5a81e0d8f197c1b",
        "sha256": "8dbc8d9143cf526ad8097c997c2e0f5538e6d6574678b08904e476ee5c4b306c"
      },
      {
        "path": "src/components/result-data-error.tsx",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "941e41226c7d9c1d835868f79af03aa49777f981",
        "sha256": "1896fc030991c96dade094def31600240f938cbfbb29a30d399c94edc8ffbbe0"
      },
      {
        "path": "src/components/result-overview-panels.tsx",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "23cdaf289d8cfb5a7f1234fd5fc43b66e3a652f8",
        "sha256": "049c2bde9d7da5a8ecc372833fdab35587ffd4412115bd2a075f5bf56b4332e5"
      },
      {
        "path": "src/components/result-series-panel.tsx",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "b3c1c206e332f456c5704e7751135c018182ace2",
        "sha256": "ee4dc36d15f259a66e4fe9da8fcbd4c2766597e71cb2e56ff6a12d1b53d8b39b"
      },
      {
        "path": "src/components/technology-input-field.tsx",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "7d0d92279bb85d79026c40a87f8ba63403409c1e",
        "sha256": "82e931a240ffb6192553e1154b14df26fbed5852eff41e82b808a0c0ae4badb6"
      },
      {
        "path": "src/lib/batch21-snapshot-replay.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "fd121f20aa0cb67888e231c51158ed3b5843b3ec",
        "sha256": "bbdfd0512ed1b790753c62e01e287bc7d648729179b39bf1182d387845cdcef8"
      },
      {
        "path": "src/lib/batch22-physics-replay.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "6d0a29857a7c746afbf0761c0f1a87fc413be96a",
        "sha256": "97c42822733670f5a215fa5ce51ef929ae1b902ec163d3ec676aa43586d1ef43"
      },
      {
        "path": "src/lib/calculation-snapshot.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "1a2cab16a52d88249fc33103881d6873a1da3f92",
        "sha256": "8e390f0e23bf4b91b95889c5f94083b0342c0683a1d8895b6939ee05b68af73c"
      },
      {
        "path": "src/lib/entitlements.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "26ea79ea3990c5fb61e9cf4a1466ecfe041d27ba",
        "sha256": "16227499beb299e6cf02c2f8485b5804294c97e4da446ac7934b55aedbd1f731"
      },
      {
        "path": "src/lib/launch-snapshot-verification.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "ff9f6799137929a86073b9e98b56298b895071da",
        "sha256": "1418dcda1a71424f34062787ad62bb716e1e96d24fc18d3b45de834affcd196f"
      },
      {
        "path": "src/lib/publication-factory-contracts-input.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "1e3f689af1f5e5e4069a2c611791d812a6cd0003",
        "sha256": "d0c5d00cc0c5d024420f11f21c27534f5b38dc681cbd53d22e750eb4a8dd281f"
      },
      {
        "path": "src/lib/publication20/conversions.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "e5eb250090125c4c1746628ebaeb0ade9eb2de4c",
        "sha256": "33294ef227aa6e4a4a14f4282dcda1834a03396e62c6a0dbc5d4fb932472ec8c"
      },
      {
        "path": "src/lib/publication20/index.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "b87270b0624139410fc1c51facf5f9c3f840d7c6",
        "sha256": "b6b25b6307770a8a3185fe5b72366bdb139d31d33aa7b82a850e7deeab0afd0e"
      },
      {
        "path": "src/lib/publication20/network.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "eeab58837f0d72d37f15f9ec791d41a04989fd1f",
        "sha256": "18ba9ac37cdb9f2634388bde49cff591186e9ed48160aacf340fb19a75432976"
      },
      {
        "path": "src/lib/publication20/result-trust.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "c60f673d6f543cf6fb2254194237823890775455",
        "sha256": "c1e21a0f680f4245424c1542fa59012b9d83347ef4da3e1309b4b61eba6cbbd9"
      },
      {
        "path": "src/lib/publication20/types.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "2e42fd0271f28ab2f038a126f1c8af2665ef692e",
        "sha256": "382d11b9368e24c80985aef7c73c7c05a610d594ddbfa1e51f67584eb04e0f3b"
      },
      {
        "path": "src/lib/recorded-json-equality.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "7c938f6983eae11a352c2cfb67dc428d0fa635f0",
        "sha256": "59fda934bec9e573c970d5a451b3d3e3ba14292838a9c6544cafbd10e71f0fcc"
      },
      {
        "path": "src/lib/registered-input-successor.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "5942ee6b030b5ebd22cbe26c89952052a88d4b3e",
        "sha256": "509826a3de1c3cf91afcf992ebed422019bfc489fd387f250f6706ea18ad28d9"
      },
      {
        "path": "src/lib/registered-snapshot-replay.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "8985adadcd1e50a3fc97113c7525b58934756b6d",
        "sha256": "4d6a168ff5072e1ad0f2cfb051a69750d6a2fb0f360164038597fb24ed0128d6"
      },
      {
        "path": "src/lib/scenario-display-metadata.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "bdf3ff13a0ac05f65b9798e146da05284d6d6d64",
        "sha256": "6eb96f8a21f938f7cd97c0f011b1f67461da47c95203fcf625821da86a76508e"
      },
      {
        "path": "src/lib/technology-snapshot-verification.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "4276012566e6c4732fac71548365d73c6ca4f731",
        "sha256": "276ad7ee37203fa90b65571a3bab1b3dde271f13c1f323a1e8d330a6bab9e521"
      },
      {
        "path": "package-lock.json",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "dd368ceb52d75eb3998241a001b9e533373146c5",
        "sha256": "b564e5ff97f9dad6c934e6a2eb0977871b2ee3f0b36a23325f1715b241114273"
      },
      {
        "path": "src/lib/technology-cidr-snapshot-verification.test.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "62fc5da2d11eee138bb3b5631e6183386e6e5a10",
        "sha256": "e8b9ce90da7f73435336d879a5ad66528b0ab7e2571eeab884e564d36b1d4fe3"
      },
      {
        "path": "src/lib/technology-cidr-snapshot-verification.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "266ace55e8cd40eb1d3d9141e684fc30d3c0208b",
        "sha256": "d045b50ed69dd3c906a7d7a622f9df63630e56860812c676b3869eccc6a7aec9"
      }
    ],
    "intermediateSources": [
      {
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "145e126cb85a52fa64396b74a5d30fe23d325e68",
        "sha256": "7a288d92b16613f4208b43de2ef7b2b52d2c111a4457b1677e7b0df9a9031cf8"
      }
    ]
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.mjs",
    "predecessorRef": "7086b85437b025225f5736fb6b849415e518dc08",
    "successorRef": "cb90a94fbe1827c1be494edd55549dff72d24405",
    "predecessorBlob": "9a01a45f92397de7ca5b9c05b6d466990c5dc3a4",
    "successorBlob": "64060b94b70930054535db085c0f87100204b549",
    "predecessorSHA256": "693e7d370154642bc9de8e40c80e3b684da291f318dc9d3fcc6cc714c5e50339",
    "successorSHA256": "91f271a96272ad6e7e73fda5f6bd31db936667ee1c9315bd0650a7242db6e7c8",
    "supplementalSources": [
      {
        "path": "tests/execution-recovery-20261109/source-lineage.test.mjs",
        "ref": "719a104663c10154ad945051a6dd54093fc4b284",
        "blob": "a12994a4457c43c2f47afe12d989b662743b64ae",
        "sha256": "8db922ae4e5f2d3b60876712011afdb7697e3538e09c9276370fe49e9642d363"
      },
      {
        "path": "src/lib/registered-snapshot-verification.ts",
        "ref": "f042748d08caa4f51c19b7cf6fc675a3a1fb5dd5",
        "blob": "3b376f0481a59a2e897ea01a8033ca2f5c857972",
        "sha256": "24bf6f31ef7283d9fc319598268c1047ff1c58cd95bda787d55b396e9e3bde4c"
      },
      {
        "path": "tests/acceptance-closure-20261108/receipt-source-path.d.mts",
        "ref": "719a104663c10154ad945051a6dd54093fc4b284",
        "blob": "f048163a3036de24f9e0ad0ee5f2bb8cc8d679f3",
        "sha256": "503fd703fd97941bd54e2a24d0fd685dfe5e62ec35988d140fa2f76928b1aa00"
      },
      {
        "path": "tests/cohort22-closure-20261109/caller-source.test.mjs",
        "ref": "eecc1b853e2ca6c160c999442d78836993565a83",
        "blob": "9fe11a6e7d7093a92dc7696fef2be995b99e9102",
        "sha256": "0efce8569b5f0a47e35cb74c3f7e4dd731b33639a8cf584c9efaee9be2e41cb1"
      },
      {
        "path": "src/lib/execution-recovery-evidence.test.ts",
        "ref": "346c314af8ae4593eb83ccffa6cbd06353617790",
        "blob": "20c28061f8c8fdf5d020d49902a33fb3f03ffc98",
        "sha256": "1686f5a9df0175c12762a1cecbe5cdf32186bc592732a56a946234da7e44f38a"
      },
      {
        "path": "src/components/calculator-interactive.tsx",
        "ref": "5c3d38e9454b9dbeb9b8d1220ea8b68532fa4e01",
        "blob": "f21d8bb8b627639c0d55782478b786b1a763748d",
        "sha256": "c6296c137d66ab2a731f9144ab58efb3cb2f25dce2f7f31223b0b9a508d93755"
      }
    ],
    "intermediateSources": [
      {
        "ref": "2b3ce39a3670028601491baadf9b2b2c3462be89",
        "blob": "af6c6de02ed7e94436468a1449aac1731e56a693",
        "sha256": "4484ea7b8a58d61d91ec293c247d6faccfe618fda0d1f9f79fa00f535b10d577"
      },
      {
        "ref": "719a104663c10154ad945051a6dd54093fc4b284",
        "blob": "ff22a6d41358e1fcf36e3222c54b063e814e09dd",
        "sha256": "4a77494bdf40c8f42d15acfc52df7e7875e53c60c40a508000e07269490f3f82"
      },
      {
        "ref": "c0f994d109ae7a5e13062ff9755d2f7937ed9655",
        "blob": "1116e05689573c5cafc12f2556de536c19bb288c",
        "sha256": "444ab171a5c28eff1b4d66a3a333562e29692641a6e2df4a7e653d7cacb72421"
      },
      {
        "ref": "eecc1b853e2ca6c160c999442d78836993565a83",
        "blob": "2fa3ee8dee5d0b26deb5123ffe5f310afedb8eec",
        "sha256": "afaf384c94b5981ccae3b062d158aaa1215da69d209c60316739f653d69d9410"
      },
      {
        "ref": "4467b5960ce73cd7851332f7248e4d2673dad70b",
        "blob": "958188aab571cadcdb1e5d27af618a25355da9ab",
        "sha256": "b1f1c087026cd35877878533384cd17c2c14b2dfb6b69882727ad27d437be293"
      },
      {
        "ref": "47c1297eee9ff8e61620c29957f4d55a014614e0",
        "blob": "aa4fe52e54d9e128746d57b9b9c67dd559efe701",
        "sha256": "4687e8dd24f12ae54df04722559d215b40cc44b9111b3e7fa5b46a54f9ae5413"
      },
      {
        "ref": "3d6a12a8b7df35929a16368ae5e1bbf7c6cf1353",
        "blob": "4e1d47d7f762de30c2bff1994cda40becaff6cd1",
        "sha256": "02c2a9cafb9401f5ad8449344dd59bb7e86081cd9d43c55acdf62014acb5da35"
      },
      {
        "ref": "d73ccb4811787793fc25cbf5b2b2f618a41b1318",
        "blob": "2bfc56c5025f131bf1c0b0002b192ec3f2d9b771",
        "sha256": "c83edf26f67fa5462021257e416ece81a91733f6aa899c030ea517b940d7e58a"
      },
      {
        "ref": "3cc17e80924a502a67d8696e60ad6592ec631f4a",
        "blob": "688615271a1d0fc76efe5efa440f290d4c8a4f92",
        "sha256": "91c98790a4b42062698cbf94eb460d3d4cf8c414db686568b2e719e0b41ba277"
      },
      {
        "ref": "23f2860c16310385f6c37f7a2bc3c86890631c98",
        "blob": "688615271a1d0fc76efe5efa440f290d4c8a4f92",
        "sha256": "91c98790a4b42062698cbf94eb460d3d4cf8c414db686568b2e719e0b41ba277"
      },
      {
        "ref": "4ef258cdd52aebf6c6aa1da11e94b2530223bfeb",
        "blob": "fc7294a3d969d22125ba334a625decdea6b5faaf",
        "sha256": "7079a9f3aeb36ea93a2ecf3d48bc1cd3bcfcbfb92d82f0e17091accf010e5318"
      }
    ]
  },
  {
    "path": "scripts/check-current-six-candidate-evidence.mjs",
    "predecessorRef": "a7a656f71b04b50192485a49b0b56b3fa6bd86b9",
    "successorRef": "d4b81fa30d0aab558ef5df7c67a76abf7e6a656d",
    "predecessorBlob": "334979a91f007d0fda6fd26f912128a3b31cc9fd",
    "successorBlob": "0a9e8db6bbdab3636475be4d49d28c71bcea74fc",
    "predecessorSHA256": "1e941a928522af24bdbb13ef0aa9f57281a5e6ec48ec1602c714981b217d8674",
    "successorSHA256": "bfbfef28847e5fe06c758d41e8c09d8c1482945330d9707a8ab0bd674ab0f77c",
    "supplementalSources": [
      {
        "path": "tests/execution-recovery-20261109/reader-forwarding.test.mjs",
        "ref": "d4b81fa30d0aab558ef5df7c67a76abf7e6a656d",
        "blob": "bc37fea717b39d2db60fa0b83829370d127d41f6",
        "sha256": "38ae2fec0bf151b80cf923ab7e9fa50d3a943ad9d2cdd8eb98931ffd84a5e28e"
      },
      {
        "path": "scripts/financial-safety-lineage.mjs",
        "ref": "d4b81fa30d0aab558ef5df7c67a76abf7e6a656d",
        "blob": "5ed4ee3e1c1d51ebded715394bc4ca1ae3c5e70a",
        "sha256": "ee52bd85f871ed9a042ef20f1a11be9b0effa0615c680bf0757cf18f304468fc"
      },
      {
        "path": "tests/product-completion-lineage.test.mjs",
        "ref": "80d18305104a9db4a015ea26199f8b916370467c",
        "blob": "4667824f066c32c03303d0c1c454675451bc3f7d",
        "sha256": "d32d67b95091149c2d5b1d579fa8d7b41043a3f0bc474d633081e51dfb8132b1"
      }
    ]
  },
  {
    "path": "src/calculators/final-framework/legacy-final-presentation-convergence-inventory.test.ts",
    "predecessorRef": "b96b1ac89971cb8418d2389fbd7c9571a57491f1",
    "successorRef": "811bbd67bfcc635808101a351fa15eb133331369",
    "predecessorBlob": "c47012a0ab012abef4e35a4658ac2a216de0eaf2",
    "successorBlob": "72270f4f15aef62d97f4a0103b5f8a16556e5575",
    "predecessorSHA256": "22159c30fac63178179a23651c06dd9c53536ee2b2d58da13665aaa8039bab71",
    "successorSHA256": "f41be82f704527f80aaa6b75facc43579c0b109ea88be6d6cdc82b72d358e1f5",
    "intermediateSources": [
      {
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "7e0017d9c4c7e2bc3ecde6539d1120a31be0072f",
        "sha256": "d28487f25da2e0931f3f5eb9b57dab4fd57e3a225d44d09fbe2516ee456f760d"
      }
    ],
    "supplementalSources": [
      {
        "path": "src/components/calculator-interactive.tsx",
        "ref": "5c3d38e9454b9dbeb9b8d1220ea8b68532fa4e01",
        "blob": "f21d8bb8b627639c0d55782478b786b1a763748d",
        "sha256": "c6296c137d66ab2a731f9144ab58efb3cb2f25dce2f7f31223b0b9a508d93755"
      },
      {
        "path": "src/calculators/final-framework/technology-scalar-presentation.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "d0d4a738021a84e08984bad3b45333c57a8030e1",
        "sha256": "bb82638b8347e696e9276fa5e9b062696b1808d3fe8ff82a001538af7c0d5330"
      }
    ]
  },
  {
    "path": "tests/full-product-batch17/workflow.test.mjs",
    "predecessorRef": "cab705d4f13e17a5ec0bb3450df704c9c226e817",
    "successorRef": "f51685f193fd411f0ebd2f341ec7dac3ce4914ed",
    "predecessorBlob": "a6239ce7f996aa97c0b8e46c2ede7643bc6cfdcc",
    "successorBlob": "ee479d4d9cf6f502064a51b65d5c4d2fcf22022c",
    "predecessorSHA256": "bb7cb82814f2ee9fdd5567912d15605626acfa9397ad510c44c73d9dfe9e02b7",
    "successorSHA256": "bc316a24b0a0d0b0b2e03d4fb3dc7d0e3e6a608cb10cfc0950be31fd0bbbc960",
    "intermediateSources": [
      {
        "ref": "591969f7f1f968e8bf0a45d16defb2c1b59043d6",
        "blob": "5be9342e5c7a60f5ee9ddf415efa60a53a0c3644",
        "sha256": "2ce0580d47e349d3b278152d10c272c5ff0c1d088da82161c3b923f75686efd1"
      },
      {
        "ref": "a9f17d4f010355eb490318c3a868d445bf38f72f",
        "blob": "718a3215e521be02a30d6ec6455d9bf4f2492ef6",
        "sha256": "ed7776767d7280b447ae45eef57df8f55e7ce0970dce7e7e7b570a9c1dfbbb8d"
      },
      {
        "ref": "e40e4f6f3e56859e72059d840c244319ece67eb2",
        "blob": "bbbec865f2bf8fe005332998c2662e6a7312424e",
        "sha256": "83a3686b90c62bd995bb33926eeae950f472b2905c62011887a53391e62cde32"
      },
      {
        "ref": "b6bef87acdb24b14c355ad9523abc5ed77fb1958",
        "blob": "bbbec865f2bf8fe005332998c2662e6a7312424e",
        "sha256": "83a3686b90c62bd995bb33926eeae950f472b2905c62011887a53391e62cde32"
      },
      {
        "ref": "98fc0bfcba9379bee299450c4f73ca49d346921e",
        "blob": "68022e4d24853410d3a30f689477965c4ea14272",
        "sha256": "2654a91d07d0098b76479938bdaad4fa6823c077c50c3d101bcf2305a9f885c0"
      }
    ],
    "supplementalSources": [
      {
        "path": ".github/workflows/ci.yml",
        "ref": "00651cc382be5dcbd596882071787fd6702c13d3",
        "blob": "5f1156c52ae6926860a61d529faaed825661bba4",
        "sha256": "39703e767294bee42f65f6495f2f9c3c8807c2f237cef79d1a48659196aca243"
      },
      {
        "path": "tests/ci-gate-recovery/verification-jobs-contract.mjs",
        "ref": "98fc0bfcba9379bee299450c4f73ca49d346921e",
        "blob": "4b866780342b99baeea24383ae2b527b811ef1c2",
        "sha256": "af5cf0a70f1477868d16d6b31e2bbac5a7bb27fa36880b04587a901935924e80"
      }
    ]
  },
  {
    "path": "src/components/technology-five-analysis.tsx",
    "predecessorRef": "00651cc382be5dcbd596882071787fd6702c13d3",
    "predecessorBlob": "918f939b3d1f92ee815dcf8937628f971ec00055",
    "predecessorSHA256": "59ec341b97cb9f6ece1735636dd192fa4ab045ac7f7d7ee8fdaba415c0258af8",
    "successorRef": "2d0e2622292930d1992813998608d933ddf5024e",
    "successorBlob": "29fdf234270b65f76100f2b15f27bd9e6a706a61",
    "successorSHA256": "137ff472c20404e12e1e402c9c994cc75559f8f59bc54f70a8dd3bd6920fbc72",
    "intermediateSources": [
      {
        "ref": "f41f3255facac47406be9c94912edade5cce760f",
        "blob": "918f939b3d1f92ee815dcf8937628f971ec00055",
        "sha256": "59ec341b97cb9f6ece1735636dd192fa4ab045ac7f7d7ee8fdaba415c0258af8"
      },
      {
        "ref": "9fe66f65cd7da2536f9f2f21d32fbc771bee0892",
        "blob": "918f939b3d1f92ee815dcf8937628f971ec00055",
        "sha256": "59ec341b97cb9f6ece1735636dd192fa4ab045ac7f7d7ee8fdaba415c0258af8"
      },
      {
        "ref": "b282c57cc6b1e72adf7435fac1e849b2bdddd85a",
        "blob": "406075b3231eb21a899261ac57e81b679db03537",
        "sha256": "52951de9c42770e75613a4e4803fcd5b3f1b6c8a5d4de2a9bc2fbf8e52650022"
      }
    ],
    "supplementalSources": [
      {
        "path": "src/lib/technology-five-analysis.ts",
        "ref": "00651cc382be5dcbd596882071787fd6702c13d3",
        "blob": "b892dafbbc6a564e5954512d4cd16f84abb24279",
        "sha256": "3313a27f4956e195532da03185d1f61a3e9861456edc1bc64a3ca924a5fde99e"
      },
      {
        "path": "src/lib/technology-five-batch.ts",
        "ref": "b282c57cc6b1e72adf7435fac1e849b2bdddd85a",
        "blob": "9f2a487ffd55bdc74440dd6440df7df007d1bdd2",
        "sha256": "5e894682ca6b12f58c9ec0eb52b3ce5a0a3395683e434bb7df4c7de7e72cb03f"
      },
      {
        "path": "src/lib/technology-five-batch.test.ts",
        "ref": "b282c57cc6b1e72adf7435fac1e849b2bdddd85a",
        "blob": "8137e891c77652b2d1c2932a5d52d1f62a8b2c22",
        "sha256": "62378531a9e42660fdac42a08c63347c6ec6631140f5edf0b85bff6c522b2a70"
      },
      {
        "path": "src/components/technology-five-batch.tsx",
        "ref": "b282c57cc6b1e72adf7435fac1e849b2bdddd85a",
        "blob": "e462dd8acda589ae065fcf3727d031c1daeaaa23",
        "sha256": "d0dbaffa0ebdb55bfa884e25ba413592aa65901d3e99700c5dca426f36bbc5eb"
      },
      {
        "path": "src/components/technology-five-batch.test.tsx",
        "ref": "b282c57cc6b1e72adf7435fac1e849b2bdddd85a",
        "blob": "5848f6a3e0c27af125ef4f1949e89de8261bfe0e",
        "sha256": "969f2894029f3ce7b93ed762f29d350d7a686cb36685ffb1e8f289b76bcd022b"
      }
    ]
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
