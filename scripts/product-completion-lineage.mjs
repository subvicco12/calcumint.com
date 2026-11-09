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
    "successorRef": "d19b8de7d74c5f85cd296946bdb69a2e3b271167",
    "predecessorBlob": "7ece608dadea02c3c668623d80931c2598829e99",
    "successorBlob": "1a5fd17ea04218060de9d1fe3952bc23561297d6",
    "predecessorSHA256": "64368f3b10b838bea51ee4a53f4b0e89b0b2828654ef84f2cd9e68825344367e",
    "successorSHA256": "e1282ad0141bb46fa87a7bab6fc8ad2dcc78e83b02d6b2c6f3b23b04fc7f8d06",
    "intermediateSources": [
      {
        "ref": "40097d77fb84dca53207534d528e7ed8f888b99a",
        "blob": "a9a69fed092d47e1e1273a79c3c520fb4ae32716",
        "sha256": "1541d7d337eaa27545276cd29a09220a78b4a0cfb41660fd31f89699fa372722"
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
      }
    ]
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
    "successorRef": "d19b8de7d74c5f85cd296946bdb69a2e3b271167",
    "predecessorBlob": "4520c58b720a69f3f60682c8e5eeb4554e3dca3a",
    "successorBlob": "80dbfecae5fa1aa7083f9f814905e7b61bb150a7",
    "predecessorSHA256": "a5690cee2d5a2341dde8a0f4aef8524a0519821aba2c4883ff642509bdc0fe6a",
    "successorSHA256": "10325a313d476a298b2a6096e06296673e51336dc774d03f4a570065d4b546c7",
    "supplementalSources": [
      {
        "path": "scripts/publication20-caller-lineage.mjs",
        "ref": "d19b8de7d74c5f85cd296946bdb69a2e3b271167",
        "blob": "1a5fd17ea04218060de9d1fe3952bc23561297d6",
        "sha256": "e1282ad0141bb46fa87a7bab6fc8ad2dcc78e83b02d6b2c6f3b23b04fc7f8d06"
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
    ]
  },
  {
    "path": "tests/shortest-publication-20/caller-lineage.test.mjs",
    "predecessorRef": "a955cdad7019a645b7ed2950299d0603ba1784a7",
    "successorRef": "877aa7584392bdde8530dbf6eae1aae30eab6c7b",
    "predecessorBlob": "4db35005636145474cb7e53c75a0faeae9dd596f",
    "successorBlob": "3f435b99d732c75082508e8d0a8daa0e2081631c",
    "predecessorSHA256": "2c6296e886bc8a58f60b6c8c4ecd7e942301a6dc5479f43aa3cd3b21df1afb03",
    "successorSHA256": "c7963a31a40b4b49324b7c7d6d722577beba66c4bb0033a7af24859add6725f6",
    "supplementalSources": [
      {
        "path": "scripts/publication20-caller-lineage.mjs",
        "ref": "877aa7584392bdde8530dbf6eae1aae30eab6c7b",
        "blob": "1a5fd17ea04218060de9d1fe3952bc23561297d6",
        "sha256": "e1282ad0141bb46fa87a7bab6fc8ad2dcc78e83b02d6b2c6f3b23b04fc7f8d06"
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
