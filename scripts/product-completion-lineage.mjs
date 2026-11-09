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
    "successorRef": "b2d72aa66293b752739b7924745a57a51c4b5acb",
    "predecessorBlob": "938281abbbf9bbea928d6844d71b06f9dc423f7f",
    "successorBlob": "2e146967e59f77ab662dab1b18d60db5e852d823",
    "predecessorSHA256": "6556a6d89c583ea1bb8ccd82ff47f379606850399da7600b59e274567b6d0416",
    "successorSHA256": "934bf945aa864691a3fba7307484a7996eaf407f49b61f83c98c281780a420c9",
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
      }
    ]
  },
  {
    "path": "scripts/publication20-caller-lineage.mjs",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "80d18305104a9db4a015ea26199f8b916370467c",
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
        "ref": "2b3ce39a3670028601491baadf9b2b2c3462be89",
        "blob": "af6c6de02ed7e94436468a1449aac1731e56a693",
        "sha256": "4484ea7b8a58d61d91ec293c247d6faccfe618fda0d1f9f79fa00f535b10d577"
      },
      {
        "path": "tests/execution-recovery-20261109/source-lineage.test.mjs",
        "ref": "2b3ce39a3670028601491baadf9b2b2c3462be89",
        "blob": "a8d13371138a634f26c35d2f3f81bf25633f6c4f",
        "sha256": "57605fc5d7a70fa51658950cff9bf9ef5555edf1682ca8271941ee3f49974780"
      },
      {
        "path": "tests/acceptance-closure-20261108/converter-final-source.test.mjs",
        "ref": "80d18305104a9db4a015ea26199f8b916370467c",
        "blob": "0d1bbeea5a3b06875da27cb874cf6e399a8ba4f5",
        "sha256": "09d311c2c253d0b6f75d3074052f5c3e1d5a97a594f0ba5fe0011629ade5274c"
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
    "successorRef": "b6b1a72127d40712f0d3c212188d8ca84063721b",
    "predecessorBlob": "c1a16424bfbc813f8cd2dd66f0018804c11866d0",
    "successorBlob": "f79a506706fde50d489d5f33d8f81c6d4705ba08",
    "predecessorSHA256": "e010d1e134c239cb6bb583365a442c64415f687233f94fd08088c4959936eb20",
    "successorSHA256": "12b7cff0408cf72462529a5e9dd154757ba9b0f33af05e8cc2e92cbee5b81cbe",
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
    "successorRef": "95ad56ea67fcce8ef18d55a0a386d97e3ddd9061",
    "predecessorBlob": "c1a8be2fbd29ec3b5e822fad3b4ca93878e60fa0",
    "successorBlob": "9bfad6e34e158f6e6e86a1f3405d539abb66e63b",
    "predecessorSHA256": "4c5ad7ad371345c640f420e5fc5492ef4df7b2ada11468f54e74cf31cc07e589",
    "successorSHA256": "3e09bccce11aa71a0057d9617d12199ecc0185a133bffed5a4a90799e08719c5",
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
        "ref": "95ad56ea67fcce8ef18d55a0a386d97e3ddd9061",
        "blob": "9bfad6e34e158f6e6e86a1f3405d539abb66e63b",
        "sha256": "3e09bccce11aa71a0057d9617d12199ecc0185a133bffed5a4a90799e08719c5"
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
        "ref": "d19b8de7d74c5f85cd296946bdb69a2e3b271167",
        "blob": "9bfad6e34e158f6e6e86a1f3405d539abb66e63b",
        "sha256": "3e09bccce11aa71a0057d9617d12199ecc0185a133bffed5a4a90799e08719c5"
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
        "ref": "877aa7584392bdde8530dbf6eae1aae30eab6c7b",
        "blob": "9bfad6e34e158f6e6e86a1f3405d539abb66e63b",
        "sha256": "3e09bccce11aa71a0057d9617d12199ecc0185a133bffed5a4a90799e08719c5"
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
        "ref": "4c67272e2c6b7ddcbdf59398b02e066c34456e78",
        "blob": "9bfad6e34e158f6e6e86a1f3405d539abb66e63b",
        "sha256": "3e09bccce11aa71a0057d9617d12199ecc0185a133bffed5a4a90799e08719c5"
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
    "successorRef": "811bbd67bfcc635808101a351fa15eb133331369",
    "predecessorBlob": "eda303b5e09abb3ab1ac4147b431fb455d3a2c9d",
    "successorBlob": "0e2929a7e2d8eac6065e3797372fab8d8c42daa3",
    "predecessorSHA256": "46903cd272e5e8a9b7ff37e338a6d9e149bf8956c4d5bed7afec7f9539d2c123",
    "successorSHA256": "43b49715779e5b3eb5f4046aa72bd078d3ba239614b879164bce96ca0e54a419",
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
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "145e126cb85a52fa64396b74a5d30fe23d325e68",
        "sha256": "7a288d92b16613f4208b43de2ef7b2b52d2c111a4457b1677e7b0df9a9031cf8"
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
      }
    ],
    "intermediateSources": [
      {
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "68ba0847e88f64dde70f0cadd9b023a700fee935",
        "sha256": "91e5cc8ac9e1fdf11ed5b617b6ad3604fcb43b9b862d26a1510f59716e79bc3e"
      }
    ]
  },
  {
    "path": "src/lib/registered-snapshot-verification.ts",
    "predecessorRef": "a7a656f71b04b50192485a49b0b56b3fa6bd86b9",
    "successorRef": "7086b85437b025225f5736fb6b849415e518dc08",
    "predecessorBlob": "df44d2b717ec5ed647360cfbdb955c9b814b211b",
    "successorBlob": "145e126cb85a52fa64396b74a5d30fe23d325e68",
    "predecessorSHA256": "a6ce5fdb736ccd748c99b703169ad5d931aea9ccb8460feb2b3cbab80a68bda6",
    "successorSHA256": "7a288d92b16613f4208b43de2ef7b2b52d2c111a4457b1677e7b0df9a9031cf8",
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
      }
    ]
  },
  {
    "path": "tests/acceptance-closure-20261108/receipt-source-path.mjs",
    "predecessorRef": "7086b85437b025225f5736fb6b849415e518dc08",
    "successorRef": "2b3ce39a3670028601491baadf9b2b2c3462be89",
    "predecessorBlob": "9a01a45f92397de7ca5b9c05b6d466990c5dc3a4",
    "successorBlob": "af6c6de02ed7e94436468a1449aac1731e56a693",
    "predecessorSHA256": "693e7d370154642bc9de8e40c80e3b684da291f318dc9d3fcc6cc714c5e50339",
    "successorSHA256": "4484ea7b8a58d61d91ec293c247d6faccfe618fda0d1f9f79fa00f535b10d577",
    "supplementalSources": [
      {
        "path": "tests/execution-recovery-20261109/source-lineage.test.mjs",
        "ref": "2b3ce39a3670028601491baadf9b2b2c3462be89",
        "blob": "a8d13371138a634f26c35d2f3f81bf25633f6c4f",
        "sha256": "57605fc5d7a70fa51658950cff9bf9ef5555edf1682ca8271941ee3f49974780"
      },
      {
        "path": "src/lib/registered-snapshot-verification.ts",
        "ref": "7086b85437b025225f5736fb6b849415e518dc08",
        "blob": "145e126cb85a52fa64396b74a5d30fe23d325e68",
        "sha256": "7a288d92b16613f4208b43de2ef7b2b52d2c111a4457b1677e7b0df9a9031cf8"
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
