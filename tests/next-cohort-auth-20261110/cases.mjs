export const cases = [
  {
    "catalogId": 374,
    "engine": "technology.storage-conversion",
    "slug": "storage-conversion-calculator",
    "title": "Storage Conversion Calculator",
    "input": {
      "value": "1",
      "fromUnit": "GiB",
      "toUnit": "MiB"
    },
    "expected": 1024,
    "version": 1
  },
  {
    "catalogId": 377,
    "engine": "technology.aspect-ratio",
    "slug": "aspect-ratio-calculator",
    "title": "Aspect Ratio Calculator",
    "input": {
      "width": "1920",
      "height": "1080"
    },
    "expected": 1.7777777777777777,
    "version": 1
  },
  {
    "catalogId": 378,
    "engine": "technology.resolution",
    "slug": "resolution-calculator",
    "title": "Resolution Calculator",
    "input": {
      "widthPixels": "1920",
      "heightPixels": "1080"
    },
    "expected": 2073600,
    "version": 1
  },
  {
    "catalogId": 379,
    "engine": "technology.dpi",
    "slug": "dpi-calculator",
    "title": "DPI Calculator",
    "input": {
      "pixels": "3000",
      "lengthInches": "10"
    },
    "expected": 300,
    "version": 1
  },
  {
    "catalogId": 382,
    "engine": "technology.power-supply",
    "slug": "power-supply-calculator",
    "title": "Power Supply Calculator",
    "input": {
      "systemLoadWatts": "500",
      "headroomPercent": "20"
    },
    "expected": 600,
    "version": 1
  },
  {
    "catalogId": 383,
    "engine": "technology.website-bandwidth",
    "slug": "website-bandwidth-calculator",
    "title": "Website Bandwidth Calculator",
    "input": {
      "pageSizeMb": "2",
      "monthlyPageViews": "100000"
    },
    "expected": 200,
    "version": 2
  },
  {
    "catalogId": 384,
    "engine": "technology.cloud-storage-cost",
    "slug": "cloud-storage-cost-calculator",
    "title": "Cloud Storage Cost Calculator",
    "input": {
      "storageGb": "1000",
      "pricePerGbMonth": "0.02"
    },
    "expected": 20,
    "version": 1
  },
  {
    "catalogId": 385,
    "engine": "technology.cloud-data-transfer-cost",
    "slug": "cloud-data-transfer-cost-calculator",
    "title": "Cloud Data Transfer Cost Calculator",
    "input": {
      "transferGb": "500",
      "pricePerGb": "0.09"
    },
    "expected": 45,
    "version": 1
  }
];
