export const cases = [
  {
    "catalogId": 369,
    "engine": "technology.cidr",
    "slug": "cidr-calculator",
    "title": "CIDR Calculator",
    "input": {
      "prefixLength": "24"
    },
    "expected": 256,
    "version": 1
  },
  {
    "catalogId": 375,
    "engine": "technology.raid-capacity",
    "slug": "raid-capacity-calculator",
    "title": "RAID Capacity Calculator",
    "input": {
      "diskCount": "4",
      "diskSizeGb": "1000",
      "raidLevel": "10"
    },
    "expected": 2000,
    "version": 1
  },
  {
    "catalogId": 380,
    "engine": "technology.battery-runtime",
    "slug": "battery-runtime-calculator",
    "title": "Battery Runtime Calculator",
    "input": {
      "capacityWh": "1000",
      "loadWatts": "200",
      "efficiencyPercent": "90"
    },
    "expected": 4.5,
    "version": 1
  },
  {
    "catalogId": 381,
    "engine": "technology.ups-runtime",
    "slug": "ups-runtime-calculator",
    "title": "UPS Runtime Calculator",
    "input": {
      "batteryWh": "600",
      "loadWatts": "300",
      "efficiencyPercent": "90"
    },
    "expected": 1.8,
    "version": 1
  },
  {
    "catalogId": 387,
    "engine": "technology.password-entropy",
    "slug": "password-entropy-calculator",
    "title": "Password Entropy Calculator",
    "input": {
      "length": "16",
      "characterPoolSize": "94"
    },
    "expected": 104.8734216268422,
    "version": 1
  }
];
