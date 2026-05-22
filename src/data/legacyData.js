// 历史型号 — 不在 2025年5月版 PDF 选型手册中
// V80 (2026-05-03) 从 completeGearboxData.js 迁出 (89 个)
//
// 用途: 备件订货 / 旧船维修 / 历史项目查询
// 注意: 主选型 UI 不加载本文件, 业务上需显式 import

export const legacyGearboxData = [
  {
    "model": "2GWH400",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1000,
    "ratios": [
      2.04,
      2.52,
      3.04,
      3.57
    ],
    "transmissionCapacityPerRatio": [
      0.28,
      0.28,
      0.28,
      0.28
    ],
    "thrust": 80,
    "centerDistance": 1200,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 1500,
    "controlType": "气控/电控",
    "rotationDirection": "相同",
    "dimensions": "1036×1280×950",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "内河运输船",
      "工作船",
      "拖船"
    ],
    "maxPower": 280,
    "minPower": 112,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 85000,
    "discountRate": 0.1,
    "introduction": "2GWH400是杭州前进齿轮箱集团生产的中小功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比2.04~3.57，适用输入转速400~1000r/min，额定推力80kN。适用于内河运输船、工作船、拖船等船舶。",
    "image": "/images/gearbox/Advance-2GWH.webp",
    "imageUrl": "/images/gearbox/Advance-2GWH.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "2GWH600",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1000,
    "ratios": [
      2.04,
      2.52,
      3.04,
      3.57
    ],
    "transmissionCapacityPerRatio": [
      0.42,
      0.42,
      0.42,
      0.42
    ],
    "thrust": 100,
    "centerDistance": 1400,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 2200,
    "controlType": "气控/电控",
    "rotationDirection": "相同",
    "dimensions": "1198×1376×1298",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "内河运输船",
      "工作船",
      "拖船"
    ],
    "maxPower": 420,
    "minPower": 168,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 115000,
    "discountRate": 0.1,
    "introduction": "2GWH600是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比2.04~3.57，适用输入转速400~1000r/min，额定推力100kN。适用于内河运输船、工作船、拖船等船舶。",
    "image": "/images/gearbox/Advance-2GWH.webp",
    "imageUrl": "/images/gearbox/Advance-2GWH.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "2GWH800",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 900,
    "ratios": [
      2.04,
      2.52,
      3.04,
      3.57
    ],
    "transmissionCapacityPerRatio": [
      0.52,
      0.52,
      0.52,
      0.52
    ],
    "thrust": 140,
    "centerDistance": 1460,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 2800,
    "controlType": "气控/电控",
    "rotationDirection": "相同",
    "dimensions": "1238×1472×1315",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "内河运输船",
      "工作船",
      "拖船"
    ],
    "maxPower": 468,
    "minPower": 208,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 135000,
    "discountRate": 0.1,
    "introduction": "2GWH800是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比2.04~3.57，适用输入转速400~900r/min，额定推力140kN。适用于内河运输船、工作船、拖船等船舶。",
    "image": "/images/gearbox/Advance-2GWH.webp",
    "imageUrl": "/images/gearbox/Advance-2GWH.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "DT10000",
    "series": "DT",
    "minPower": 2629,
    "maxPower": 5258,
    "minSpeed": 750,
    "maxSpeed": 1500,
    "ratios": [
      1.5,
      1.96,
      2.48,
      3.05,
      3.5,
      4,
      4.45,
      4.95,
      5.55,
      5.95
    ],
    "thrust": 279,
    "weight": 3605,
    "centerDistance": 564,
    "transmissionCapacityPerRatio": [
      3.505,
      3.505,
      3.505,
      3.505,
      3.505,
      3.505,
      3.505,
      3.505,
      3.505,
      3.505
    ],
    "image": "/images/gearbox/Advance-DT.webp",
    "price": 613000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "电控",
    "rotationDirection": "相反",
    "dimensions": "1200×1500×1500",
    "certifications": [
      "CCS",
      "BV",
      "DNV"
    ],
    "applications": [
      "大型运输船",
      "集装箱船",
      "散货船"
    ],
    "powerSource": "传动能力计算",
    "source": "杭齿厂选型手册2025版5月版",
    "introduction": "DT10000是杭州前进齿轮箱集团生产的大功率电力推进船用齿轮箱，采用电控操纵方式，减速比1.50~5.95，适用输入转速750~1500r/min，额定推力279kN。适用于大型运输船、集装箱船、散货船等船舶。",
    "imageUrl": "/images/gearbox/Advance-DT.webp",
    "inputInterfaces": {
      "sae": [
        "SAE24寸",
        "SAE30寸"
      ],
      "plainFlange": true
    }
  },
  {
    "model": "DT2500",
    "series": "DT",
    "minSpeed": 750,
    "maxSpeed": 1500,
    "ratios": [
      1.48,
      1.86,
      2.04,
      2.14
    ],
    "transmissionCapacityPerRatio": [
      1.67,
      1.67,
      1.46,
      1.36
    ],
    "thrust": 110,
    "centerDistance": 350,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 3600,
    "controlType": "电控",
    "rotationDirection": "相反",
    "dimensions": "920×1210×1210",
    "certifications": [
      "CCS",
      "BV",
      "DNV"
    ],
    "applications": [
      "大型运输船",
      "集装箱船",
      "散货船"
    ],
    "maxPower": 2505,
    "minPower": 1020,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 150000,
    "discountRate": 0.1,
    "introduction": "DT2500是杭州前进齿轮箱集团生产的中大功率电力推进船用齿轮箱，采用电控操纵方式，减速比1.48~2.14，适用输入转速750~1500r/min，额定推力110kN。适用于大型运输船、集装箱船、散货船等船舶。",
    "image": "/images/gearbox/Advance-DT.webp",
    "imageUrl": "/images/gearbox/Advance-DT.webp",
    "inputInterfaces": {
      "sae": [
        "SAE24寸",
        "SAE30寸"
      ],
      "plainFlange": true
    }
  },
  {
    "model": "DT4000",
    "series": "DT",
    "minSpeed": 750,
    "maxSpeed": 1500,
    "ratios": [
      1.48,
      1.86,
      2.04
    ],
    "transmissionCapacityPerRatio": [
      2.5,
      2.5,
      2.2
    ],
    "thrust": 120,
    "centerDistance": 365,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 5000,
    "controlType": "电控",
    "rotationDirection": "相反",
    "dimensions": "923×1230×1180",
    "certifications": [
      "CCS",
      "BV",
      "DNV"
    ],
    "applications": [
      "大型运输船",
      "集装箱船",
      "散货船"
    ],
    "maxPower": 3750,
    "minPower": 1650,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 160000,
    "discountRate": 0.1,
    "introduction": "DT4000是杭州前进齿轮箱集团生产的大功率电力推进船用齿轮箱，采用电控操纵方式，减速比1.48~2.04，适用输入转速750~1500r/min，额定推力120kN。适用于大型运输船、集装箱船、散货船等船舶。",
    "image": "/images/gearbox/Advance-DT.webp",
    "imageUrl": "/images/gearbox/Advance-DT.webp",
    "inputInterfaces": {
      "sae": [
        "SAE24寸",
        "SAE30寸"
      ],
      "plainFlange": true
    }
  },
  {
    "model": "GC1000",
    "series": "GC配变距桨",
    "minSpeed": 400,
    "maxSpeed": 1400,
    "ratios": [
      1.5,
      2,
      2.5,
      3
    ],
    "transmissionCapacityPerRatio": [
      0.83,
      0.83,
      0.75,
      0.67
    ],
    "thrust": 1400,
    "centerDistance": 1018,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 1800,
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "dimensions": "2500×2100×2300",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "渔船",
      "工作船",
      "巡逻艇"
    ],
    "maxPower": 1162,
    "minPower": 268,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 1500000,
    "discountRate": 0.1,
    "introduction": "GC1000是杭州前进齿轮箱集团生产的中大功率配变距桨船用齿轮箱，采用气控/电控操纵方式，减速比1.50~3.00，适用输入转速400~1400r/min，额定推力1400kN。适用于渔船、工作船、巡逻艇等船舶。",
    "image": "/images/gearbox/Advance-GC.webp",
    "imageUrl": "/images/gearbox/Advance-GC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ640"
      ]
    }
  },
  {
    "model": "GC1400",
    "series": "GC配变距桨",
    "minSpeed": 400,
    "maxSpeed": 1200,
    "ratios": [
      1.5,
      2,
      2.5,
      3
    ],
    "transmissionCapacityPerRatio": [
      1.1,
      1.1,
      1,
      0.88
    ],
    "thrust": 1400,
    "centerDistance": 1350,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 2500,
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "dimensions": "3500×2940×3220",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "渔船",
      "工作船",
      "巡逻艇"
    ],
    "maxPower": 1320,
    "minPower": 352,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 2500000,
    "discountRate": 0.1,
    "introduction": "GC1400是杭州前进齿轮箱集团生产的中大功率配变距桨船用齿轮箱，采用气控/电控操纵方式，减速比1.50~3.00，适用输入转速400~1200r/min，额定推力1400kN。适用于渔船、工作船、巡逻艇等船舶。",
    "image": "/images/gearbox/Advance-GC.webp",
    "imageUrl": "/images/gearbox/Advance-GC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ640"
      ]
    }
  },
  {
    "model": "GC600",
    "series": "GC配变距桨",
    "minSpeed": 400,
    "maxSpeed": 1800,
    "ratios": [
      1.5,
      2,
      2.5,
      3
    ],
    "transmissionCapacityPerRatio": [
      0.47,
      0.47,
      0.42,
      0.38
    ],
    "thrust": 360,
    "centerDistance": 590,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 850,
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "dimensions": "1500×1260×1380",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "渔船",
      "工作船",
      "巡逻艇"
    ],
    "maxPower": 846,
    "minPower": 152,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 400000,
    "discountRate": 0.1,
    "introduction": "GC600是杭州前进齿轮箱集团生产的中功率配变距桨船用齿轮箱，采用气控/电控操纵方式，减速比1.50~3.00，适用输入转速400~1800r/min，额定推力360kN。适用于渔船、工作船、巡逻艇等船舶。",
    "image": "/images/gearbox/Advance-GC.webp",
    "imageUrl": "/images/gearbox/Advance-GC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ640"
      ]
    }
  },
  {
    "model": "GC800",
    "series": "GC配变距桨",
    "minSpeed": 400,
    "maxSpeed": 1600,
    "ratios": [
      1.5,
      2,
      2.5,
      3
    ],
    "transmissionCapacityPerRatio": [
      0.63,
      0.63,
      0.57,
      0.5
    ],
    "thrust": 800,
    "centerDistance": 855,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 1200,
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "dimensions": "2000×1680×1840",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "渔船",
      "工作船",
      "巡逻艇"
    ],
    "maxPower": 1008,
    "minPower": 200,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 850000,
    "discountRate": 0.1,
    "introduction": "GC800是杭州前进齿轮箱集团生产的中大功率配变距桨船用齿轮箱，采用气控/电控操纵方式，减速比1.50~3.00，适用输入转速400~1600r/min，额定推力800kN。适用于渔船、工作船、巡逻艇等船舶。",
    "image": "/images/gearbox/Advance-GC.webp",
    "imageUrl": "/images/gearbox/Advance-GC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ640"
      ]
    }
  },
  {
    "model": "GCH1002L",
    "series": "GC配变距桨",
    "minSpeed": 400,
    "maxSpeed": 600,
    "ratios": [
      3.939
    ],
    "transmissionCapacityPerRatio": [
      20
    ],
    "thrust": 800,
    "centerDistance": 1000,
    "minPower": 5000,
    "maxPower": 10000,
    "powerSource": "项目跟踪数据",
    "source": "项目跟踪记录-芜湖造船厂试验舰",
    "note": "特殊型号，左型，8800kW/520rpm，减速比3.939:1，水平异心距1000mm，J检",
    "image": "/images/gearbox/Advance-GC.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "dimensions": "2545×2138×2341",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "大型运输船",
      "海工船",
      "工程船",
      "军辅船"
    ],
    "weight": 1734,
    "priceSource": "估算价格",
    "price": 1428221,
    "discountRate": 0.1,
    "introduction": "GCH1002L是杭州前进齿轮箱集团生产的超大功率配变距桨船用齿轮箱，采用气控/电控操纵方式，减速比3.94~3.94，适用输入转速400~600r/min，额定推力800kN。适用于大型运输船、海工船、工程船等船舶。",
    "imageUrl": "/images/gearbox/Advance-GC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE0#18寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ640",
        "φ770",
        "φ908"
      ]
    }
  },
  {
    "model": "GCH1002R",
    "series": "GC配变距桨",
    "minSpeed": 400,
    "maxSpeed": 600,
    "ratios": [
      3.939
    ],
    "transmissionCapacityPerRatio": [
      20
    ],
    "thrust": 800,
    "centerDistance": 1000,
    "minPower": 5000,
    "maxPower": 10000,
    "powerSource": "项目跟踪数据",
    "source": "项目跟踪记录-芜湖造船厂试验舰",
    "note": "特殊型号，右型，8800kW/520rpm，减速比3.939:1，水平异心距1000mm，J检",
    "image": "/images/gearbox/Advance-GC.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "dimensions": "2545×2138×2341",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "大型运输船",
      "海工船",
      "工程船",
      "军辅船"
    ],
    "weight": 1734,
    "priceSource": "估算价格",
    "price": 1428221,
    "discountRate": 0.1,
    "introduction": "GCH1002R是杭州前进齿轮箱集团生产的超大功率配变距桨船用齿轮箱，采用气控/电控操纵方式，减速比3.94~3.94，适用输入转速400~600r/min，额定推力800kN。适用于大型运输船、海工船、工程船等船舶。",
    "imageUrl": "/images/gearbox/Advance-GC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE0#18寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ640",
        "φ770",
        "φ908"
      ]
    }
  },
  {
    "model": "GWC20.34",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1400,
    "ratios": [
      2.04
    ],
    "transmissionCapacityPerRatio": [
      0.18
    ],
    "thrust": 50,
    "centerDistance": 70,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 125,
    "controlType": "气控/电控",
    "rotationDirection": "相同",
    "dimensions": "400×350×500",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "内河运输船",
      "工作船",
      "拖船"
    ],
    "maxPower": 252,
    "minPower": 72,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 25000,
    "discountRate": 0.1,
    "introduction": "GWC20.34是杭州前进齿轮箱集团生产的中小功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比2.04~2.04，适用输入转速400~1400r/min，额定推力50kN。适用于内河运输船、工作船、拖船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWC20.54",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1400,
    "ratios": [
      2.04
    ],
    "transmissionCapacityPerRatio": [
      0.22
    ],
    "thrust": 50,
    "centerDistance": 70,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 148,
    "controlType": "气控/电控",
    "rotationDirection": "相同",
    "dimensions": "420×370×520",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "内河运输船",
      "工作船",
      "拖船"
    ],
    "maxPower": 308,
    "minPower": 88,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 28000,
    "discountRate": 0.1,
    "introduction": "GWC20.54是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比2.04~2.04，适用输入转速400~1400r/min，额定推力50kN。适用于内河运输船、工作船、拖船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWC26.58",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1400,
    "ratios": [
      2.6
    ],
    "transmissionCapacityPerRatio": [
      0.22
    ],
    "thrust": 60,
    "centerDistance": 80,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 198,
    "controlType": "气控/电控",
    "rotationDirection": "相同",
    "dimensions": "450×580×600",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "内河运输船",
      "工作船",
      "拖船"
    ],
    "maxPower": 308,
    "minPower": 88,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 35000,
    "discountRate": 0.1,
    "introduction": "GWC26.58是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比2.60~2.60，适用输入转速400~1400r/min，额定推力60kN。适用于内河运输船、工作船、拖船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWC36.58",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1200,
    "ratios": [
      3.42
    ],
    "transmissionCapacityPerRatio": [
      0.3
    ],
    "thrust": 140,
    "centerDistance": 220,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 205,
    "controlType": "气控/电控",
    "rotationDirection": "相同",
    "dimensions": "1645×1331×1060",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "运输船",
      "拖船",
      "工程船"
    ],
    "maxPower": 360,
    "minPower": 120,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 45000,
    "discountRate": 0.1,
    "introduction": "GWC36.58是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比3.42~3.42，适用输入转速400~1200r/min，额定推力140kN。适用于运输船、拖船、工程船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWC36.59",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1200,
    "ratios": [
      3.47
    ],
    "transmissionCapacityPerRatio": [
      0.38
    ],
    "thrust": 140,
    "centerDistance": 220,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 270,
    "controlType": "气控/电控",
    "rotationDirection": "相同",
    "dimensions": "1645×1331×1060",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "运输船",
      "拖船",
      "工程船"
    ],
    "maxPower": 456,
    "minPower": 152,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 50000,
    "discountRate": 0.1,
    "introduction": "GWC36.59是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比3.47~3.47，适用输入转速400~1200r/min，额定推力140kN。适用于运输船、拖船、工程船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWC46.59",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1200,
    "ratios": [
      4.47
    ],
    "transmissionCapacityPerRatio": [
      0.3
    ],
    "thrust": 270,
    "centerDistance": 290,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 270,
    "controlType": "气控/电控",
    "rotationDirection": "相同",
    "dimensions": "1550×1200×1680",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ],
    "maxPower": 360,
    "minPower": 120,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 55000,
    "discountRate": 0.1,
    "introduction": "GWC46.59是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比4.47~4.47，适用输入转速400~1200r/min，额定推力270kN。适用于运输船、散货船、工程船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWC46.60",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1200,
    "ratios": [
      4.47
    ],
    "transmissionCapacityPerRatio": [
      0.42
    ],
    "thrust": 270,
    "centerDistance": 290,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 355,
    "controlType": "气控/电控",
    "rotationDirection": "相同",
    "dimensions": "1600×1250×1700",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ],
    "maxPower": 504,
    "minPower": 168,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 60000,
    "discountRate": 0.1,
    "introduction": "GWC46.60是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比4.47~4.47，适用输入转速400~1200r/min，额定推力270kN。适用于运输船、散货船、工程船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWC56.61",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1000,
    "ratios": [
      5.63
    ],
    "transmissionCapacityPerRatio": [
      0.42
    ],
    "thrust": 300,
    "centerDistance": 300,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 360,
    "controlType": "气控/电控",
    "rotationDirection": "相同",
    "dimensions": "2350×1500×2100",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ],
    "maxPower": 420,
    "minPower": 168,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 65000,
    "discountRate": 0.1,
    "introduction": "GWC56.61是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比5.63~5.63，适用输入转速400~1000r/min，额定推力300kN。适用于运输船、散货船、工程船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWC61.65",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1000,
    "ratios": [
      6.13
    ],
    "transmissionCapacityPerRatio": [
      0.55
    ],
    "thrust": 450,
    "centerDistance": 450,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 560,
    "controlType": "气控/电控",
    "rotationDirection": "相同",
    "dimensions": "2500×1650×2200",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ],
    "maxPower": 550,
    "minPower": 220,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 80000,
    "discountRate": 0.1,
    "introduction": "GWC61.65是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比6.13~6.13，适用输入转速400~1000r/min，额定推力450kN。适用于运输船、散货船、工程船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWCD26.70",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1400,
    "ratios": [
      2.7
    ],
    "transmissionCapacityPerRatio": [
      0.6
    ],
    "thrust": 60,
    "centerDistance": 400,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 495,
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "dimensions": "1238×920×1315",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "内河运输船",
      "工作船",
      "拖船"
    ],
    "maxPower": 840,
    "minPower": 240,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 50000,
    "discountRate": 0.1,
    "introduction": "GWCD26.70是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比2.70~2.70，适用输入转速400~1400r/min，额定推力60kN。适用于内河运输船、工作船、拖船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWCD36.70",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1200,
    "ratios": [
      3.75
    ],
    "transmissionCapacityPerRatio": [
      0.7
    ],
    "thrust": 140,
    "centerDistance": 500,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 550,
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "dimensions": "1645×1331×1060",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "运输船",
      "拖船",
      "工程船"
    ],
    "maxPower": 840,
    "minPower": 280,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 65000,
    "discountRate": 0.1,
    "introduction": "GWCD36.70是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比3.75~3.75，适用输入转速400~1200r/min，额定推力140kN。适用于运输船、拖船、工程船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWCD46.71",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1200,
    "ratios": [
      4.92
    ],
    "transmissionCapacityPerRatio": [
      0.8
    ],
    "thrust": 270,
    "centerDistance": 600,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 600,
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "dimensions": "1688×1230×1710",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ],
    "maxPower": 960,
    "minPower": 320,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 85000,
    "discountRate": 0.1,
    "introduction": "GWCD46.71是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比4.92~4.92，适用输入转速400~1200r/min，额定推力270kN。适用于运输船、散货船、工程船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWCD56.72",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1000,
    "ratios": [
      5.71
    ],
    "transmissionCapacityPerRatio": [
      0.85
    ],
    "thrust": 300,
    "centerDistance": 700,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 700,
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "dimensions": "2126×1989×1340",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ],
    "maxPower": 850,
    "minPower": 340,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 100000,
    "discountRate": 0.1,
    "introduction": "GWCD56.72是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比5.71~5.71，适用输入转速400~1000r/min，额定推力300kN。适用于运输船、散货船、工程船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWCD67.80",
    "series": "GW",
    "minSpeed": 300,
    "maxSpeed": 900,
    "ratios": [
      6.54
    ],
    "transmissionCapacityPerRatio": [
      0.9
    ],
    "thrust": 710,
    "centerDistance": 850,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 850,
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "dimensions": "2445×1600×2215",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ],
    "maxPower": 810,
    "minPower": 270,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 350000,
    "discountRate": 0.1,
    "introduction": "GWCD67.80是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比6.54~6.54，适用输入转速300~900r/min，额定推力710kN。适用于运输船、散货船、工程船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWCD79.85",
    "series": "GW",
    "minSpeed": 200,
    "maxSpeed": 800,
    "ratios": [
      7.92
    ],
    "transmissionCapacityPerRatio": [
      0.95
    ],
    "thrust": 1000,
    "centerDistance": 1000,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 970,
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "dimensions": "2876×2151×1970",
    "certifications": [
      "CCS",
      "BV",
      "DNV"
    ],
    "applications": [
      "大型运输船",
      "集装箱船",
      "散货船",
      "油轮"
    ],
    "maxPower": 760,
    "minPower": 190,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 500000,
    "discountRate": 0.1,
    "introduction": "GWCD79.85是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比7.92~7.92，适用输入转速200~800r/min，额定推力1000kN。适用于大型运输船、集装箱船、散货船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWCD90.100",
    "series": "GW",
    "minSpeed": 200,
    "maxSpeed": 600,
    "ratios": [
      9.4
    ],
    "transmissionCapacityPerRatio": [
      1.1
    ],
    "thrust": 1400,
    "centerDistance": 1200,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 1350,
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "dimensions": "3135×2945×2158",
    "certifications": [
      "CCS",
      "BV",
      "DNV"
    ],
    "applications": [
      "大型运输船",
      "集装箱船",
      "散货船",
      "油轮"
    ],
    "maxPower": 660,
    "minPower": 220,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 800000,
    "discountRate": 0.1,
    "introduction": "GWCD90.100是杭州前进齿轮箱集团生产的中功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比9.40~9.40，适用输入转速200~600r/min，额定推力1400kN。适用于大型运输船、集装箱船、散货船等船舶。",
    "image": "/images/gearbox/Advance-GWC.webp",
    "imageUrl": "/images/gearbox/Advance-GWC.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE1#14寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ405",
        "φ450"
      ]
    }
  },
  {
    "model": "GWS28.30G/GWH28.30G",
    "aliases": [
      "GWS28.30G",
      "GWH28.30G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1800,
    "ratios": [
      2,
      2.56,
      3,
      3.57,
      4.05
    ],
    "transmissionCapacityPerRatio": [
      0.44,
      0.44,
      0.44,
      0.44,
      0.44
    ],
    "thrust": 80,
    "centerDistance": 100,
    "dimensions": "968×1050×1370",
    "weight": 1230,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 68875,
    "discountRate": 0.1,
    "priceSource": "GWC28.30×95%",
    "maxPower": 792,
    "minPower": 176,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸"
      ],
      "domestic": [
        "φ405",
        "φ450"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "内河运输船",
      "工作船",
      "拖船"
    ]
  },
  {
    "model": "GWS32.35G/GWH32.35G",
    "aliases": [
      "GWS32.35G",
      "GWH32.35G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1800,
    "ratios": [
      2,
      2.56,
      3,
      3.57,
      4.05
    ],
    "transmissionCapacityPerRatio": [
      0.72,
      0.72,
      0.72,
      0.72,
      0.72
    ],
    "thrust": 120,
    "centerDistance": 120,
    "dimensions": "1405×1240×920",
    "weight": 2035,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 98610,
    "discountRate": 0.1,
    "priceSource": "GWC32.35×95%",
    "maxPower": 1296,
    "minPower": 288,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸"
      ],
      "domestic": [
        "φ405",
        "φ450"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "运输船",
      "拖船",
      "工程船"
    ]
  },
  {
    "model": "GWS36.39G/GWH36.39G",
    "aliases": [
      "GWS36.39G",
      "GWH36.39G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1800,
    "ratios": [
      2.03,
      2.48,
      2.92,
      3.48,
      3.95
    ],
    "transmissionCapacityPerRatio": [
      1.02,
      1.02,
      1.02,
      1.02,
      1.02
    ],
    "thrust": 140,
    "centerDistance": 140,
    "dimensions": "1645×1331×1060",
    "weight": 2245,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 117610,
    "discountRate": 0.1,
    "priceSource": "GWC36.39×95%",
    "maxPower": 1836,
    "minPower": 408,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸",
        "SAE1#8寸",
        "SAE2#1寸"
      ],
      "plainFlange": true,
      "boltPatterns": [
        "12-φ25",
        "16-φ21"
      ],
      "domestic": [
        "φ405",
        "φ450"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "运输船",
      "拖船",
      "工程船"
    ]
  },
  {
    "model": "GWS36.54G/GWH36.54G",
    "aliases": [
      "GWS36.54G",
      "GWH36.54G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1800,
    "ratios": [
      4.46,
      4.95,
      5.55,
      5.95
    ],
    "transmissionCapacityPerRatio": [
      0.96,
      0.96,
      0.96,
      0.96
    ],
    "thrust": 220,
    "centerDistance": 220,
    "dimensions": "1563×1330×1230",
    "weight": 3230,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 9555,
    "discountRate": 0.1,
    "priceSource": "系统估算",
    "maxPower": 1728,
    "minPower": 384,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸",
        "SAE1#8寸",
        "SAE2#1寸"
      ],
      "plainFlange": true,
      "boltPatterns": [
        "12-φ25",
        "16-φ21"
      ],
      "domestic": [
        "φ405",
        "φ450"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "运输船",
      "拖船",
      "工程船"
    ]
  },
  {
    "model": "GWS39.41G/GWH39.41G",
    "aliases": [
      "GWS39.41G",
      "GWH39.41G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1600,
    "ratios": [
      2,
      2.54,
      2.96,
      3.5,
      3.95
    ],
    "transmissionCapacityPerRatio": [
      1.4,
      1.4,
      1.4,
      1.4,
      1.4
    ],
    "thrust": 175,
    "centerDistance": 175,
    "dimensions": "1393×1400×1630",
    "weight": 3230,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 146110,
    "discountRate": 0.1,
    "priceSource": "GWC39.41×95%",
    "maxPower": 2240,
    "minPower": 560,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸",
        "SAE2#11.5寸"
      ],
      "domestic": [
        "φ405",
        "φ450",
        "φ480"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "运输船",
      "拖船",
      "工程船"
    ]
  },
  {
    "model": "GWS39.57G/GWH39.57G",
    "aliases": [
      "GWS39.57G",
      "GWH39.57G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1600,
    "ratios": [
      4.52,
      5.04,
      5.52,
      5.95
    ],
    "transmissionCapacityPerRatio": [
      1.29,
      1.29,
      1.29,
      1.29
    ],
    "thrust": 270,
    "centerDistance": 270,
    "dimensions": "1393×1400×1630",
    "weight": 3230,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 9825,
    "discountRate": 0.1,
    "priceSource": "系统估算",
    "maxPower": 2064,
    "minPower": 516,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸",
        "SAE2#11.5寸"
      ],
      "domestic": [
        "φ405",
        "φ450",
        "φ480"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "运输船",
      "拖船",
      "工程船"
    ]
  },
  {
    "model": "GWS42.45G/GWH42.45G",
    "aliases": [
      "GWS42.45G",
      "GWH42.45G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1600,
    "ratios": [
      1.97,
      2.55,
      2.93,
      3.58,
      4
    ],
    "transmissionCapacityPerRatio": [
      1.81,
      1.81,
      1.81,
      1.81,
      1.81
    ],
    "thrust": 220,
    "centerDistance": 220,
    "dimensions": "1425×1460×1630",
    "weight": 3960,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 176510,
    "discountRate": 0.1,
    "priceSource": "GWC42.45×95%",
    "maxPower": 2896,
    "minPower": 724,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸",
        "SAE1#8寸",
        "SAE2#11.5寸",
        "SAE2#1寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ450",
        "φ480",
        "φ530",
        "φ570",
        "φ608"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "运输船",
      "拖船",
      "工程船"
    ]
  },
  {
    "model": "GWS42.63G/GWH42.63G",
    "aliases": [
      "GWS42.63G",
      "GWH42.63G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1600,
    "ratios": [
      4.46,
      5.08,
      5.46,
      5.95
    ],
    "transmissionCapacityPerRatio": [
      1.64,
      1.64,
      1.64,
      1.64
    ],
    "thrust": 290,
    "centerDistance": 290,
    "dimensions": "1613×1460×1360",
    "weight": 3960,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 10117,
    "discountRate": 0.1,
    "priceSource": "系统估算",
    "maxPower": 2624,
    "minPower": 656,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸",
        "SAE1#8寸",
        "SAE2#11.5寸",
        "SAE2#1寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ450",
        "φ480",
        "φ530",
        "φ570",
        "φ608"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "运输船",
      "拖船",
      "工程船"
    ]
  },
  {
    "model": "GWS45.49G/GWH45.49G",
    "aliases": [
      "GWS45.49G",
      "GWH45.49G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1400,
    "ratios": [
      2.03,
      2.48,
      3.09,
      3.48,
      3.95
    ],
    "transmissionCapacityPerRatio": [
      2.23,
      2.23,
      2.23,
      2.23,
      2.23
    ],
    "thrust": 270,
    "centerDistance": 270,
    "dimensions": "1594×1590×1860",
    "weight": 5275,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 262010,
    "discountRate": 0.1,
    "priceSource": "GWC45.49×95%",
    "maxPower": 3122,
    "minPower": 892,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸",
        "SAE2#11.5寸"
      ],
      "domestic": [
        "φ450",
        "φ480",
        "φ530",
        "φ570",
        "φ608"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ]
  },
  {
    "model": "GWS45.68G/GWH45.68B/GWD45.68",
    "aliases": [
      "GWS45.68G",
      "GWH45.68B",
      "GWD45.68"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1400,
    "ratios": [
      4.5,
      5,
      5.55,
      5.95
    ],
    "transmissionCapacityPerRatio": [
      2.12,
      2.12,
      2.12,
      2.12
    ],
    "thrust": 360,
    "centerDistance": 360,
    "dimensions": "1594×1590×1860",
    "weight": 6030,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 10430,
    "discountRate": 0.1,
    "priceSource": "系统估算",
    "maxPower": 2968,
    "minPower": 848,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWD.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸",
        "SAE2#11.5寸"
      ],
      "domestic": [
        "φ450",
        "φ480",
        "φ530",
        "φ570",
        "φ608"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ]
  },
  {
    "model": "GWS49.54G/GWH49.54G",
    "aliases": [
      "GWS49.54G",
      "GWH49.54G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1200,
    "ratios": [
      1.97,
      2.47,
      3,
      3.52,
      3.95
    ],
    "transmissionCapacityPerRatio": [
      3.26,
      3.26,
      3.26,
      3.26,
      3.26
    ],
    "thrust": 290,
    "centerDistance": 290,
    "dimensions": "2126×1989×1340",
    "weight": 6900,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 382470,
    "discountRate": 0.1,
    "priceSource": "GWC49.54×95%",
    "maxPower": 3912,
    "minPower": 1304,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "sae": [
        "SAE2#11.5寸"
      ],
      "domestic": [
        "φ570",
        "φ640",
        "φ770",
        "φ820",
        "φ908",
        "φ950"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ]
  },
  {
    "model": "GWS49.74G/GWH49.74G",
    "aliases": [
      "GWS49.74G",
      "GWH49.74G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1200,
    "ratios": [
      4.58,
      5.04,
      5.59,
      5.95
    ],
    "transmissionCapacityPerRatio": [
      2.83,
      2.83,
      2.83,
      2.83
    ],
    "thrust": 540,
    "centerDistance": 540,
    "dimensions": "2189×1892×1750",
    "weight": 8500,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 10881,
    "discountRate": 0.1,
    "priceSource": "系统估算",
    "maxPower": 3396,
    "minPower": 1132,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "sae": [
        "SAE2#11.5寸"
      ],
      "domestic": [
        "φ570",
        "φ640",
        "φ770",
        "φ820",
        "φ908",
        "φ950"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ]
  },
  {
    "model": "GWS52.82G/GWH52.82G",
    "aliases": [
      "GWS52.82G",
      "GWH52.82G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1200,
    "ratios": [
      4.58,
      5.04,
      5.59,
      5.95
    ],
    "transmissionCapacityPerRatio": [
      3.64,
      3.64,
      3.64,
      3.64
    ],
    "thrust": 710,
    "centerDistance": 710,
    "dimensions": "2291×1400×1290",
    "weight": 12300,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 11245,
    "discountRate": 0.1,
    "priceSource": "系统估算",
    "maxPower": 4368,
    "minPower": 1456,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "sae": [
        "SAE2#11.5寸"
      ],
      "domestic": [
        "φ570",
        "φ640",
        "φ770",
        "φ820",
        "φ908",
        "φ950"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ]
  },
  {
    "model": "GWS60.66G/GWH60.66G",
    "aliases": [
      "GWS60.66G",
      "GWH60.66G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1200,
    "ratios": [
      2,
      2.54,
      2.96,
      3.5,
      3.95
    ],
    "transmissionCapacityPerRatio": [
      5.09,
      5.09,
      5.09,
      5.09,
      5.09
    ],
    "thrust": 450,
    "centerDistance": 450,
    "dimensions": "2340×2080×2520",
    "weight": 12100,
    "source": "杭齿厂选型手册2025版5月版",
    "maxPower": 6108,
    "minPower": 2036,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "domestic": [
        "φ1025",
        "φ1110",
        "φ650",
        "φ770",
        "φ908"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "price": 760000,
    "priceSource": "GWC60.66×95%",
    "discountRate": 0.1,
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ]
  },
  {
    "model": "GWS60.92G/GWH60.92G",
    "aliases": [
      "GWS60.92G",
      "GWH60.92G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1200,
    "ratios": [
      4.52,
      5.04,
      5.52,
      5.95
    ],
    "transmissionCapacityPerRatio": [
      5.05,
      5.05,
      5.05,
      5.05
    ],
    "thrust": 750,
    "centerDistance": 750,
    "dimensions": "2324×2080×1920",
    "weight": 18300,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 12320,
    "discountRate": 0.1,
    "priceSource": "系统估算",
    "maxPower": 6060,
    "minPower": 2020,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "domestic": [
        "φ1025",
        "φ1110",
        "φ650",
        "φ770",
        "φ908"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ]
  },
  {
    "model": "GWS63.78A",
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 800,
    "ratios": [
      3.5,
      4,
      4.5,
      5,
      5.5,
      6
    ],
    "transmissionCapacityPerRatio": [
      7,
      7,
      7,
      7,
      7,
      7
    ],
    "thrust": 500,
    "centerDistance": 750,
    "minPower": 2000,
    "maxPower": 5000,
    "powerSource": "项目跟踪数据",
    "source": "项目跟踪记录-九江1000TEU集装箱船",
    "note": "新型号，数据待完善，3676kW/650rpm",
    "image": "/images/gearbox/Advance-GW.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "weight": 17000,
    "dimensions": "2645×2381×1740",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ],
    "priceSource": "估算价格",
    "price": 900000,
    "discountRate": 0.1,
    "introduction": "GWS63.78A是杭州前进齿轮箱集团生产的大功率大功率低速船用齿轮箱，采用气控/电控操纵方式，减速比3.50~6.00，适用输入转速400~800r/min，额定推力500kN。适用于运输船、散货船、工程船等船舶。",
    "imageUrl": "/images/gearbox/Advance-GW.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸",
        "SAE2#1寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ480",
        "φ530"
      ]
    }
  },
  {
    "model": "GWS63.71/GWK63.71/GWH63.71/GWD63.71",
    "aliases": [
      "GWS63.71",
      "GWK63.71",
      "GWH63.71",
      "GWD63.71"
    ],
    "series": "GW",
    "minSpeed": 300,
    "maxSpeed": 1000,
    "ratios": [
      2,
      2.5,
      2.96,
      3.5,
      4.11
    ],
    "transmissionCapacityPerRatio": [
      6.45,
      6.45,
      6.45,
      6.45,
      6.45
    ],
    "thrust": 710,
    "centerDistance": 710,
    "dimensions": "2645×2381×1740",
    "weight": 17000,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 902500,
    "discountRate": 0.1,
    "priceSource": "GWC63.71×95%",
    "maxPower": 6450,
    "minPower": 1935,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWD.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "domestic": [
        "φ1025",
        "φ1110",
        "φ650",
        "φ770",
        "φ908"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ]
  },
  {
    "model": "GWS63.95/GWK63.95/GWH63.95/GWD63.95",
    "aliases": [
      "GWS63.95",
      "GWK63.95",
      "GWH63.95",
      "GWD63.95"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 1000,
    "ratios": [
      4.5,
      5,
      5.55,
      5.95
    ],
    "transmissionCapacityPerRatio": [
      6,
      6,
      6,
      6
    ],
    "thrust": 800,
    "centerDistance": 800,
    "dimensions": "2645×2381×1740",
    "weight": 19000,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 12763,
    "discountRate": 0.1,
    "priceSource": "系统估算",
    "maxPower": 6000,
    "minPower": 2400,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWD.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "domestic": [
        "φ1025",
        "φ1110",
        "φ650",
        "φ770",
        "φ908"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ]
  },
  {
    "model": "GWS66.106G/GWH66.106G",
    "aliases": [
      "GWS66.106G",
      "GWH66.106G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 950,
    "ratios": [
      4.52,
      4.96,
      5.48,
      6.05
    ],
    "transmissionCapacityPerRatio": [
      7.2,
      7.2,
      7.2,
      7.2
    ],
    "thrust": 980,
    "centerDistance": 1060,
    "dimensions": "2750×2500×1800",
    "weight": 21000,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 13227,
    "discountRate": 0.1,
    "priceSource": "系统估算",
    "maxPower": 6840,
    "minPower": 2880,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/06-16A-26.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ],
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸",
        "SAE2#1寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ480",
        "φ530"
      ]
    }
  },
  {
    "model": "GWS66.75G/GWH66.75G",
    "aliases": [
      "GWS66.75G",
      "GWH66.75G"
    ],
    "series": "GW",
    "minSpeed": 300,
    "maxSpeed": 950,
    "ratios": [
      1.97,
      2.47,
      3,
      3.52,
      3.95
    ],
    "transmissionCapacityPerRatio": [
      7.48,
      7.48,
      7.48,
      7.48,
      7.48
    ],
    "thrust": 730,
    "centerDistance": 730,
    "dimensions": "2750×2500×1800",
    "weight": 20000,
    "source": "杭齿厂选型手册2025版5月版",
    "maxPower": 7106,
    "minPower": 2244,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "image": "/images/gearbox/Advance-GWS.webp",
    "price": 997500,
    "priceSource": "GWC66.75×95%",
    "discountRate": 0.1,
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ],
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸",
        "SAE2#1寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ480",
        "φ530"
      ]
    }
  },
  {
    "model": "GWS70.111G/GWH70.111G",
    "aliases": [
      "GWS70.111G",
      "GWH70.111G"
    ],
    "series": "GW",
    "minSpeed": 400,
    "maxSpeed": 900,
    "ratios": [
      4.58,
      5.04,
      5.59,
      5.95
    ],
    "transmissionCapacityPerRatio": [
      8.11,
      8.11,
      8.11,
      8.11
    ],
    "thrust": 1200,
    "centerDistance": 1110,
    "dimensions": "2876×2151×1970",
    "weight": 25000,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 13880,
    "discountRate": 0.1,
    "priceSource": "系统估算",
    "maxPower": 7299,
    "minPower": 3244,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "domestic": [
        "φ1025",
        "φ1110",
        "φ650",
        "φ770",
        "φ908"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "BV",
      "DNV"
    ],
    "applications": [
      "大型运输船",
      "集装箱船",
      "散货船",
      "油轮"
    ]
  },
  {
    "model": "GWS70.76G/GWH70.76G",
    "aliases": [
      "GWS70.76G",
      "GWH70.76G"
    ],
    "series": "GW",
    "minSpeed": 300,
    "maxSpeed": 900,
    "ratios": [
      1.94,
      2.54,
      3,
      3.5,
      3.95
    ],
    "transmissionCapacityPerRatio": [
      8.15,
      8.15,
      8.15,
      8.15,
      8.15
    ],
    "thrust": 750,
    "centerDistance": 750,
    "dimensions": "2876×2151×1970",
    "weight": 22500,
    "source": "杭齿厂选型手册2025版5月版",
    "price": 1045000,
    "discountRate": 0.1,
    "priceSource": "GWC70.76×95%",
    "maxPower": 7335,
    "minPower": 2445,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/Advance-GWH.webp",
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
    "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
    "inputInterfaces": {
      "domestic": [
        "φ1025",
        "φ1110",
        "φ650",
        "φ770",
        "φ908"
      ]
    },
    "image": "/images/gearbox/Advance-GWS.webp",
    "controlType": "气控/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "BV",
      "DNV"
    ],
    "applications": [
      "大型运输船",
      "集装箱船",
      "散货船",
      "油轮"
    ]
  },
  {
    "model": "HC1201",
    "series": "HC",
    "minPower": 558,
    "maxPower": 1767,
    "minSpeed": 600,
    "maxSpeed": 1900,
    "ratios": [
      1.6,
      2.03,
      2.5,
      2.96,
      3.55,
      4.06,
      4.47
    ],
    "thrust": 120,
    "weight": 1872,
    "centerDistance": 400,
    "transmissionCapacityPerRatio": [
      0.93,
      0.93,
      0.93,
      0.93,
      0.93,
      0.93,
      0.93
    ],
    "image": "/images/gearbox/Advance-200-201-230.webp",
    "price": 266000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "1082×1200×1130",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "工程船",
      "拖船",
      "大型渔船"
    ],
    "powerSource": "传动能力计算",
    "source": "杭齿厂选型手册2025版5月版",
    "introduction": "HC1201是杭州前进齿轮箱集团生产的中大功率船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比1.60~4.47，适用输入转速600~1900r/min，额定推力120kN。适用于运输船、工程船、拖船等船舶。",
    "imageUrl": "/images/gearbox/Advance-200-201-230.webp",
    "inputInterfaces": {
      "sae": [
        "SAE18寸",
        "SAE21寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ505",
        "φ518",
        "φ640"
      ]
    }
  },
  {
    "model": "HC1250",
    "series": "HC",
    "minPower": 581,
    "maxPower": 1841,
    "minSpeed": 600,
    "maxSpeed": 1900,
    "ratios": [
      1.6,
      2.03,
      2.5,
      2.96,
      3.55,
      4.06,
      4.47
    ],
    "thrust": 125,
    "weight": 1948,
    "centerDistance": 408,
    "transmissionCapacityPerRatio": [
      0.969,
      0.969,
      0.969,
      0.969,
      0.969,
      0.969,
      0.969
    ],
    "image": "/images/gearbox/Advance-1100-1200.webp",
    "price": 277000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "1082×1200×1130",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "工程船",
      "拖船",
      "大型渔船"
    ],
    "powerSource": "传动能力计算",
    "source": "杭齿厂选型手册2025版5月版",
    "introduction": "HC1250是杭州前进齿轮箱集团生产的中大功率船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比1.60~4.47，适用输入转速600~1900r/min，额定推力125kN。适用于运输船、工程船、拖船等船舶。",
    "imageUrl": "/images/gearbox/Advance-1100-1200.webp",
    "inputInterfaces": {
      "sae": [
        "SAE18寸",
        "SAE21寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ505",
        "φ518",
        "φ640"
      ]
    }
  },
  {
    "model": "HC4500P",
    "series": "HCP",
    "minSpeed": 500,
    "maxSpeed": 1200,
    "ratios": [
      2.04,
      2.52,
      3
    ],
    "transmissionCapacityPerRatio": [
      2.8,
      2.8,
      2.5
    ],
    "thrust": 340,
    "centerDistance": 720,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 7500,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "2100×2300×2000",
    "certifications": [
      "CCS",
      "BV",
      "DNV"
    ],
    "applications": [
      "运输船",
      "工程船",
      "海工船",
      "环保船"
    ],
    "maxPower": 3360,
    "minPower": 1250,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 450000,
    "discountRate": 0.1,
    "introduction": "HC4500P是杭州前进齿轮箱集团生产的大功率混合动力船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比2.04~3.00，适用输入转速500~1200r/min，额定推力340kN。适用于运输船、工程船、海工船等船舶。",
    "image": "/images/gearbox/Advance-800-1000.webp",
    "imageUrl": "/images/gearbox/Advance-800-1000.webp",
    "inputInterfaces": {
      "sae": [
        "SAE18寸",
        "SAE21寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ640",
        "φ820"
      ]
    }
  },
  {
    "model": "HC5000P",
    "series": "HCP",
    "minSpeed": 500,
    "maxSpeed": 1200,
    "ratios": [
      2.04,
      2.52,
      3
    ],
    "transmissionCapacityPerRatio": [
      3.2,
      3.2,
      2.8
    ],
    "thrust": 400,
    "centerDistance": 750,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 8500,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "2300×2500×2200",
    "certifications": [
      "CCS",
      "BV",
      "DNV"
    ],
    "applications": [
      "运输船",
      "工程船",
      "海工船",
      "环保船"
    ],
    "maxPower": 3840,
    "minPower": 1400,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 520000,
    "discountRate": 0.1,
    "introduction": "HC5000P是杭州前进齿轮箱集团生产的大功率混合动力船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比2.04~3.00，适用输入转速500~1200r/min，额定推力400kN。适用于运输船、工程船、海工船等船舶。",
    "image": "/images/gearbox/Advance-800-1000.webp",
    "imageUrl": "/images/gearbox/Advance-800-1000.webp",
    "inputInterfaces": {
      "sae": [
        "SAE18寸",
        "SAE21寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ640",
        "φ820"
      ]
    }
  },
  {
    "model": "HC6000P",
    "series": "HCP",
    "minSpeed": 500,
    "maxSpeed": 1000,
    "ratios": [
      2.04,
      2.52
    ],
    "transmissionCapacityPerRatio": [
      3.8,
      3.8
    ],
    "thrust": 450,
    "centerDistance": 800,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 10000,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "2500×2800×2400",
    "certifications": [
      "CCS",
      "BV",
      "DNV"
    ],
    "applications": [
      "运输船",
      "工程船",
      "海工船",
      "环保船"
    ],
    "maxPower": 3800,
    "minPower": 1900,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 650000,
    "discountRate": 0.1,
    "introduction": "HC6000P是杭州前进齿轮箱集团生产的大功率混合动力船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比2.04~2.52，适用输入转速500~1000r/min，额定推力450kN。适用于运输船、工程船、海工船等船舶。",
    "image": "/images/gearbox/Advance-800-1000.webp",
    "imageUrl": "/images/gearbox/Advance-800-1000.webp",
    "inputInterfaces": {
      "sae": [
        "SAE18寸",
        "SAE21寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ640",
        "φ820"
      ]
    }
  },
  {
    "model": "HC85",
    "series": "HC",
    "minSpeed": 1000,
    "maxSpeed": 2500,
    "ratios": [
      2.04,
      2.59,
      3.11,
      3.58,
      4.12
    ],
    "transmissionCapacityPerRatio": [
      0.052,
      0.047,
      0.043,
      0.039,
      0.035
    ],
    "thrust": 1.8,
    "centerDistance": 130,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 52,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "351×380×544",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "小型渔船",
      "内河船",
      "工作艇"
    ],
    "maxPower": 130,
    "minPower": 35,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 10000,
    "discountRate": 0.1,
    "introduction": "HC85是杭州前进齿轮箱集团生产的中小功率船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比2.04~4.12，适用输入转速1000~2500r/min，额定推力1.8kN。适用于小型渔船、内河船、工作艇等船舶。",
    "image": "/images/gearbox/06-16A-26.webp",
    "imageUrl": "/images/gearbox/06-16A-26.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#4寸",
        "SAE1#6寸"
      ],
      "plainFlange": true,
      "boltPatterns": [
        "12-φ12.5",
        "12-φ13"
      ]
    }
  },
  {
    "model": "HCAM1250",
    "series": "HCAM",
    "minPower": 800,
    "maxPower": 1840,
    "minSpeed": 1000,
    "maxSpeed": 2300,
    "ratios": [
      1.1,
      1.2,
      1.51
    ],
    "thrust": 155,
    "weight": 1086,
    "centerDistance": 395,
    "transmissionCapacityPerRatio": [
      0.8,
      0.8,
      0.8
    ],
    "image": "/images/gearbox/Advance-1100-1200.webp",
    "price": 142000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控",
    "rotationDirection": "相反",
    "dimensions": "960×640×800",
    "certifications": [
      "CCS",
      "ZC"
    ],
    "applications": [
      "高速渔船",
      "快艇",
      "巡逻艇"
    ],
    "powerSource": "传动能力计算",
    "source": "杭齿厂选型手册2025版5月版",
    "introduction": "HCAM1250是杭州前进齿轮箱集团生产的中大功率铝合金倾角船用齿轮箱，采用推拉软轴/电控操纵方式，减速比1.10~1.51，适用输入转速1000~2300r/min，额定推力155kN。适用于高速渔船、快艇、巡逻艇等船舶。",
    "imageUrl": "/images/gearbox/Advance-1100-1200.webp",
    "inputInterfaces": {
      "plainFlange": true,
      "domestic": [
        "φ770"
      ]
    }
  },
  {
    "model": "HCAM1400",
    "series": "HCAM",
    "minPower": 896,
    "maxPower": 2061,
    "minSpeed": 1000,
    "maxSpeed": 2300,
    "ratios": [
      1.1,
      1.2,
      1.51
    ],
    "thrust": 174,
    "weight": 1216,
    "centerDistance": 418,
    "transmissionCapacityPerRatio": [
      0.896,
      0.896,
      0.896
    ],
    "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
    "price": 360000,
    "priceSource": "2026官方出厂价",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控",
    "rotationDirection": "相反",
    "dimensions": "1050×700×875",
    "certifications": [
      "CCS",
      "ZC"
    ],
    "applications": [
      "高速渔船",
      "快艇",
      "巡逻艇"
    ],
    "powerSource": "传动能力计算",
    "source": "杭齿厂选型手册2025版5月版",
    "introduction": "HCAM1400是杭州前进齿轮箱集团生产的中大功率铝合金倾角船用齿轮箱，采用推拉软轴/电控操纵方式，减速比1.10~1.51，适用输入转速1000~2300r/min，额定推力174kN。适用于高速渔船、快艇、巡逻艇等船舶。",
    "imageUrl": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
    "inputInterfaces": {
      "plainFlange": true,
      "domestic": [
        "φ770"
      ]
    }
  },
  {
    "model": "HCAM302",
    "series": "HCAM",
    "minPower": 193,
    "maxPower": 444,
    "minSpeed": 1000,
    "maxSpeed": 2300,
    "ratios": [
      1.1,
      1.2,
      1.51
    ],
    "thrust": 37,
    "weight": 262,
    "centerDistance": 194,
    "transmissionCapacityPerRatio": [
      0.193,
      0.193,
      0.193
    ],
    "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
    "price": 34000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控",
    "rotationDirection": "相反",
    "dimensions": "570×380×475",
    "certifications": [
      "CCS",
      "ZC"
    ],
    "applications": [
      "高速渔船",
      "快艇",
      "巡逻艇"
    ],
    "powerSource": "传动能力计算",
    "source": "杭齿厂选型手册2025版5月版",
    "introduction": "HCAM302是杭州前进齿轮箱集团生产的中功率铝合金倾角船用齿轮箱，采用推拉软轴/电控操纵方式，减速比1.10~1.51，适用输入转速1000~2300r/min，额定推力37kN。适用于高速渔船、快艇、巡逻艇等船舶。",
    "imageUrl": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
    "inputInterfaces": {
      "plainFlange": true,
      "domestic": [
        "φ770"
      ]
    }
  },
  {
    "model": "HCAM500",
    "series": "HCAM",
    "minPower": 320,
    "maxPower": 736,
    "minSpeed": 1000,
    "maxSpeed": 2300,
    "ratios": [
      1.1,
      1.2,
      1.51
    ],
    "thrust": 62,
    "weight": 434,
    "centerDistance": 250,
    "transmissionCapacityPerRatio": [
      0.32,
      0.32,
      0.32
    ],
    "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
    "price": 57000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控",
    "rotationDirection": "相反",
    "dimensions": "680×453×566",
    "certifications": [
      "CCS",
      "ZC"
    ],
    "applications": [
      "高速渔船",
      "快艇",
      "巡逻艇"
    ],
    "powerSource": "传动能力计算",
    "source": "杭齿厂选型手册2025版5月版",
    "introduction": "HCAM500是杭州前进齿轮箱集团生产的中功率铝合金倾角船用齿轮箱，采用推拉软轴/电控操纵方式，减速比1.10~1.51，适用输入转速1000~2300r/min，额定推力62kN。适用于高速渔船、快艇、巡逻艇等船舶。",
    "imageUrl": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
    "inputInterfaces": {
      "plainFlange": true,
      "domestic": [
        "φ770"
      ]
    }
  },
  {
    "model": "HCD0FM",
    "series": "HCDF",
    "minSpeed": 1000,
    "maxSpeed": 2100,
    "ratios": [
      1.09,
      1.52,
      1.97,
      2.48
    ],
    "transmissionCapacityPerRatio": [
      0.036,
      0.036,
      0.03,
      0.025
    ],
    "thrust": 3,
    "centerDistance": 80,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 28,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "680×930×880",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "小型渔船",
      "内河船",
      "游艇"
    ],
    "maxPower": 76,
    "minPower": 25,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 5000,
    "discountRate": 0.1,
    "introduction": "HCD0FM是杭州前进齿轮箱集团生产的中小功率法兰输出小型船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比1.09~2.48，适用输入转速1000~2100r/min，额定推力3kN。适用于小型渔船、内河船、游艇等船舶。",
    "image": "/images/gearbox/06-16A-26.webp",
    "imageUrl": "/images/gearbox/06-16A-26.webp",
    "inputInterfaces": {
      "plainFlange": true,
      "boltPatterns": [
        "6-φ11",
        "8-φ11"
      ]
    }
  },
  {
    "model": "HCD1FM",
    "series": "HCDF",
    "minSpeed": 1000,
    "maxSpeed": 2000,
    "ratios": [
      1.09,
      1.52,
      1.97,
      2.48
    ],
    "transmissionCapacityPerRatio": [
      0.05,
      0.05,
      0.042,
      0.035
    ],
    "thrust": 5,
    "centerDistance": 100,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 38,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "820×950×890",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "小型渔船",
      "内河船",
      "游艇"
    ],
    "maxPower": 100,
    "minPower": 35,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 6500,
    "discountRate": 0.1,
    "introduction": "HCD1FM是杭州前进齿轮箱集团生产的中小功率法兰输出小型船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比1.09~2.48，适用输入转速1000~2000r/min，额定推力5kN。适用于小型渔船、内河船、游艇等船舶。",
    "image": "/images/gearbox/06-16A-26.webp",
    "imageUrl": "/images/gearbox/06-16A-26.webp",
    "inputInterfaces": {
      "plainFlange": true,
      "boltPatterns": [
        "6-φ11",
        "8-φ11"
      ]
    }
  },
  {
    "model": "HCD2FM",
    "series": "HCDF",
    "minSpeed": 1000,
    "maxSpeed": 2500,
    "ratios": [
      1.55,
      2,
      2.5,
      3
    ],
    "transmissionCapacityPerRatio": [
      0.058,
      0.058,
      0.048,
      0.04
    ],
    "thrust": 8.5,
    "centerDistance": 120,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 45,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "1082×1120×990",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "小型渔船",
      "内河船",
      "游艇"
    ],
    "maxPower": 145,
    "minPower": 40,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 8000,
    "discountRate": 0.1,
    "introduction": "HCD2FM是杭州前进齿轮箱集团生产的中小功率法兰输出小型船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比1.55~3.00，适用输入转速1000~2500r/min，额定推力8.5kN。适用于小型渔船、内河船、游艇等船舶。",
    "image": "/images/gearbox/06-16A-26.webp",
    "imageUrl": "/images/gearbox/06-16A-26.webp",
    "inputInterfaces": {
      "plainFlange": true,
      "boltPatterns": [
        "6-φ11",
        "8-φ11"
      ]
    }
  },
  {
    "model": "HCD400",
    "series": "HCD",
    "minSpeed": 1000,
    "maxSpeed": 1800,
    "ratios": [
      1.48,
      1.94,
      2.45,
      2.96,
      3.55,
      3.95,
      4.45,
      5.05,
      5.54
    ],
    "transmissionCapacityPerRatio": [
      0.28,
      0.28,
      0.28,
      0.28,
      0.28,
      0.28,
      0.252,
      0.222,
      0.201
    ],
    "thrust": 82,
    "centerDistance": 355,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 620,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "820×950×890",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "渔船",
      "运输船",
      "工作船"
    ],
    "maxPower": 504,
    "minPower": 201,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 38000,
    "discountRate": 0.1,
    "introduction": "HCD400是杭州前进齿轮箱集团生产的中功率船用齿轮箱（带离合器），采用推拉软轴/电控/气控操纵方式，减速比1.48~5.54，适用输入转速1000~1800r/min，额定推力82kN。适用于渔船、运输船、工作船等船舶。",
    "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
    "imageUrl": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#6寸",
        "SAE1#8寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ505",
        "φ518"
      ]
    }
  },
  {
    "model": "HCD440",
    "series": "HCD",
    "minPower": 352,
    "maxPower": 739,
    "minSpeed": 1000,
    "maxSpeed": 2100,
    "ratios": [
      4,
      4.48,
      4.75,
      5.05,
      5.52,
      6
    ],
    "thrust": 80,
    "weight": 782,
    "centerDistance": 351,
    "transmissionCapacityPerRatio": [
      0.352,
      0.352,
      0.352,
      0.352,
      0.352,
      0.352
    ],
    "image": "/images/gearbox/Advance-HCD400A.webp",
    "price": 85000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "820×950×890",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "运输船",
      "拖网渔船",
      "工程船"
    ],
    "powerSource": "传动能力计算",
    "source": "杭齿厂选型手册2025版5月版",
    "introduction": "HCD440是杭州前进齿轮箱集团生产的中功率船用齿轮箱（带离合器），采用推拉软轴/电控/气控操纵方式，减速比4.00~6.00，适用输入转速1000~2100r/min，额定推力80kN。适用于运输船、拖网渔船、工程船等船舶。",
    "imageUrl": "/images/gearbox/Advance-HCD400A.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#6寸",
        "SAE1#8寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ505",
        "φ518"
      ]
    }
  },
  {
    "model": "HCD600/2",
    "series": "HCD",
    "minSpeed": 1000,
    "maxSpeed": 2100,
    "ratios": [
      2.04,
      2.96,
      3.45,
      3.94,
      4.45,
      4.89
    ],
    "transmissionCapacityPerRatio": [
      0.42,
      0.42,
      0.42,
      0.38,
      0.34,
      0.31
    ],
    "thrust": 90,
    "centerDistance": 415,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 950,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "745×1214×1271",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "渔船",
      "运输船",
      "工作船"
    ],
    "maxPower": 882,
    "minPower": 310,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 72000,
    "discountRate": 0.1,
    "introduction": "HCD600/2是杭州前进齿轮箱集团生产的中功率船用齿轮箱（带离合器），采用推拉软轴/电控/气控操纵方式，减速比2.04~4.89，适用输入转速1000~2100r/min，额定推力90kN。适用于渔船、运输船、工作船等船舶。",
    "image": "/images/gearbox/Advance-800-1000.webp",
    "imageUrl": "/images/gearbox/Advance-800-1000.webp",
    "inputInterfaces": {
      "sae": [
        "SAE18寸",
        "SAE21寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ518",
        "φ640"
      ]
    }
  },
  {
    "model": "HCD68",
    "series": "HCD",
    "minSpeed": 1000,
    "maxSpeed": 2500,
    "ratios": [
      2.05,
      2.45,
      2.96,
      3.55
    ],
    "transmissionCapacityPerRatio": [
      0.038,
      0.035,
      0.031,
      0.027
    ],
    "thrust": 14.7,
    "centerDistance": 142,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 48,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "351×380×544",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "渔船",
      "运输船",
      "工作船"
    ],
    "maxPower": 95,
    "minPower": 27,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 15000,
    "discountRate": 0.1,
    "introduction": "HCD68是杭州前进齿轮箱集团生产的中小功率船用齿轮箱（带离合器），采用推拉软轴/电控/气控操纵方式，减速比2.05~3.55，适用输入转速1000~2500r/min，额定推力14.7kN。适用于渔船、运输船、工作船等船舶。",
    "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
    "imageUrl": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#4寸",
        "SAE1#6寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ505"
      ]
    }
  },
  {
    "model": "HCDX300",
    "series": "HCDX",
    "minSpeed": 1000,
    "maxSpeed": 2500,
    "ratios": [
      2.04,
      2.48,
      2.95,
      3.45,
      3.96
    ],
    "transmissionCapacityPerRatio": [
      0.21,
      0.21,
      0.21,
      0.189,
      0.165
    ],
    "thrust": 60,
    "centerDistance": 300,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 180,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "680×930×880",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "渔船",
      "运输船",
      "工作船"
    ],
    "maxPower": 525,
    "minPower": 165,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 25000,
    "discountRate": 0.1,
    "introduction": "HCDX300是杭州前进齿轮箱集团生产的中功率多档位船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比2.04~3.96，适用输入转速1000~2500r/min，额定推力60kN。适用于渔船、运输船、工作船等船舶。",
    "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
    "imageUrl": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#6寸",
        "SAE1#8寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ505",
        "φ518"
      ]
    }
  },
  {
    "model": "HCDX400",
    "series": "HCDX",
    "minSpeed": 1000,
    "maxSpeed": 1800,
    "ratios": [
      2.04,
      2.48,
      2.95,
      3.45,
      3.96,
      4.48
    ],
    "transmissionCapacityPerRatio": [
      0.28,
      0.28,
      0.28,
      0.28,
      0.252,
      0.222
    ],
    "thrust": 82,
    "centerDistance": 355,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 260,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "820×950×890",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "渔船",
      "运输船",
      "工作船"
    ],
    "maxPower": 504,
    "minPower": 222,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 50000,
    "discountRate": 0.1,
    "introduction": "HCDX400是杭州前进齿轮箱集团生产的中功率多档位船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比2.04~4.48，适用输入转速1000~1800r/min，额定推力82kN。适用于渔船、运输船、工作船等船舶。",
    "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
    "imageUrl": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#6寸",
        "SAE1#8寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ505",
        "φ518"
      ]
    }
  },
  {
    "model": "HCDX600",
    "series": "HCDX",
    "minSpeed": 1000,
    "maxSpeed": 2100,
    "ratios": [
      2.04,
      2.52,
      3,
      3.57,
      4,
      4.48,
      5.05
    ],
    "transmissionCapacityPerRatio": [
      0.452,
      0.452,
      0.452,
      0.452,
      0.452,
      0.407,
      0.36
    ],
    "thrust": 90,
    "centerDistance": 415,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 400,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "745×1214×1126",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "渔船",
      "运输船",
      "工作船"
    ],
    "maxPower": 949,
    "minPower": 360,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 95000,
    "discountRate": 0.1,
    "introduction": "HCDX600是杭州前进齿轮箱集团生产的中功率多档位船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比2.04~5.05，适用输入转速1000~2100r/min，额定推力90kN。适用于渔船、运输船、工作船等船舶。",
    "image": "/images/gearbox/Advance-800-1000.webp",
    "imageUrl": "/images/gearbox/Advance-800-1000.webp",
    "inputInterfaces": {
      "sae": [
        "SAE18寸",
        "SAE21寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ518",
        "φ640"
      ]
    }
  },
  {
    "model": "HCDX800",
    "series": "HCDX",
    "minSpeed": 600,
    "maxSpeed": 2100,
    "ratios": [
      2.04,
      2.48,
      3,
      3.5,
      4,
      4.47,
      5.05
    ],
    "transmissionCapacityPerRatio": [
      0.52,
      0.52,
      0.52,
      0.52,
      0.52,
      0.468,
      0.414
    ],
    "thrust": 110,
    "centerDistance": 450,
    "source": "杭齿厂选型手册2025版5月版",
    "weight": 550,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相反",
    "dimensions": "1056×1280×1341",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "渔船",
      "运输船",
      "工作船"
    ],
    "maxPower": 1092,
    "minPower": 248,
    "powerSource": "传动能力计算",
    "priceSource": "估算价格",
    "price": 116000,
    "discountRate": 0.1,
    "introduction": "HCDX800是杭州前进齿轮箱集团生产的中大功率多档位船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比2.04~5.05，适用输入转速600~2100r/min，额定推力110kN。适用于渔船、运输船、工作船等船舶。",
    "image": "/images/gearbox/Advance-800-1000.webp",
    "imageUrl": "/images/gearbox/Advance-800-1000.webp",
    "inputInterfaces": {
      "sae": [
        "SAE18寸",
        "SAE21寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ518",
        "φ640"
      ]
    }
  },
  {
    "model": "HCL250",
    "series": "HCL",
    "minSpeed": 1000,
    "maxSpeed": 2000,
    "ratios": [
      1
    ],
    "maxPower": 524,
    "thrust": 35,
    "centerDistance": 160,
    "dimensions": "554×425×635",
    "weight": 210,
    "controlType": "推拉软轴/电控",
    "price": 8800,
    "discountRate": 0.12,
    "source": "杭齿厂选型手册2025版5月版",
    "transmissionCapacityPerRatio": [
      0.262
    ],
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
    "introduction": "HCL系列液压离合器，减速比1:1直驱，适用于辅机驱动、发电机组、泵组驱动等。",
    "inputInterfaces": {
      "sae": [
        "SAE1#1.5寸",
        "SAE1#4寸",
        "SAE1#6寸",
        "SAE1#8寸"
      ],
      "plainFlange": true,
      "boltPatterns": [
        "8-φ14.5"
      ],
      "domestic": [
        "φ770"
      ]
    },
    "minPower": 262,
    "powerSource": "传动能力计算",
    "image": "/images/gearbox/Advance-800-1000.webp",
    "rotationDirection": "不适用",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "辅机驱动",
      "发电机组",
      "泵组驱动"
    ],
    "priceSource": "估算价格",
    "imageUrl": "/images/gearbox/Advance-800-1000.webp"
  },
  {
    "model": "HCL7000",
    "series": "HCL",
    "minPower": 2915,
    "maxPower": 6996,
    "minSpeed": 500,
    "maxSpeed": 1200,
    "ratios": [
      1
    ],
    "thrust": 700,
    "weight": 7000,
    "centerDistance": 2207,
    "transmissionCapacityPerRatio": [
      5.83
    ],
    "image": "/images/gearbox/Advance-800-1000.webp",
    "price": 804000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "机械控制/电控",
    "rotationDirection": "不适用",
    "dimensions": "1200×900×1100",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "辅机驱动",
      "发电机组",
      "泵组驱动"
    ],
    "powerSource": "传动能力计算",
    "source": "杭齿厂选型手册2025版5月版",
    "introduction": "HCL7000是杭州前进齿轮箱集团生产的大功率液压离合器，采用机械控制/电控操纵方式，减速比1.00~1.00，适用输入转速500~1200r/min，额定推力700kN。适用于辅机驱动、发电机组、泵组驱动等船舶。",
    "imageUrl": "/images/gearbox/Advance-800-1000.webp",
    "inputInterfaces": {
      "sae": [
        "SAE2#1寸",
        "SAE3#11.5寸"
      ],
      "plainFlange": true
    }
  },
  {
    "model": "HCM1400",
    "series": "HCM",
    "minPower": 952,
    "maxPower": 1999,
    "minSpeed": 1000,
    "maxSpeed": 2100,
    "ratios": [
      1.5,
      2,
      2.5,
      3
    ],
    "thrust": 150,
    "weight": 1400,
    "centerDistance": 400,
    "transmissionCapacityPerRatio": [
      0.952,
      0.952,
      0.952,
      0.952
    ],
    "image": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp",
    "price": 412000,
    "priceSource": "2026官方统一售价",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控",
    "rotationDirection": "相反",
    "dimensions": "525×350×438",
    "certifications": [
      "CCS",
      "ZC"
    ],
    "applications": [
      "高速渔船",
      "快艇",
      "巡逻艇"
    ],
    "powerSource": "传动能力计算",
    "source": "杭齿厂选型手册2025版5月版",
    "introduction": "HCM1400是杭州前进齿轮箱集团生产的中大功率铝合金船用齿轮箱，采用推拉软轴/电控操纵方式，减速比1.50~3.00，适用输入转速1000~2100r/min，额定推力150kN。适用于高速渔船、快艇、巡逻艇等船舶。",
    "imageUrl": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp",
    "inputInterfaces": {
      "plainFlange": true,
      "domestic": [
        "φ770"
      ]
    }
  },
  {
    "model": "HCM1600",
    "series": "HCM",
    "minPower": 1190,
    "maxPower": 2499,
    "minSpeed": 1000,
    "maxSpeed": 2100,
    "ratios": [
      1.5,
      2,
      2.1,
      2.5,
      3
    ],
    "thrust": 180,
    "weight": 1600,
    "centerDistance": 450,
    "transmissionCapacityPerRatio": [
      1.19,
      1.19,
      1.19,
      1.19,
      1.19
    ],
    "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
    "price": 48000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控",
    "rotationDirection": "相反",
    "dimensions": "600×400×500",
    "certifications": [
      "CCS",
      "ZC"
    ],
    "applications": [
      "高速渔船",
      "快艇",
      "巡逻艇"
    ],
    "powerSource": "传动能力计算",
    "source": "杭齿厂选型手册2025版5月版",
    "introduction": "HCM1600是杭州前进齿轮箱集团生产的中大功率铝合金船用齿轮箱，采用推拉软轴/电控操纵方式，减速比1.50~3.00，适用输入转速1000~2100r/min，额定推力180kN。适用于高速渔船、快艇、巡逻艇等船舶。",
    "imageUrl": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
    "inputInterfaces": {
      "plainFlange": true,
      "domestic": [
        "φ770"
      ]
    }
  },
  {
    "model": "HCQ400",
    "series": "HCQ",
    "ratios": [
      1.53,
      2.03,
      2.5,
      2.96,
      3.54,
      3.96,
      4.48,
      4.96,
      5.52,
      5.98
    ],
    "weight": 650,
    "thrust": 50,
    "dimensions": "640×900×800",
    "transmissionCapacityPerRatio": [
      0.28,
      0.28,
      0.28,
      0.28,
      0.28,
      0.28,
      0.252,
      0.227,
      0.204,
      0.188
    ],
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
    "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
    "inputInterfaces": {
      "domestic": [
        "φ770"
      ]
    },
    "minPower": 188,
    "maxPower": 560,
    "powerSource": "传递能力计算",
    "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
    "price": 77000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "ZC"
    ],
    "applications": [
      "渔船",
      "运输船",
      "工作船"
    ],
    "centerDistance": 220,
    "minSpeed": 1000,
    "maxSpeed": 2500,
    "source": "杭齿厂选型手册2025版5月版",
    "imageUrl": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
  },
  {
    "model": "HCQ700A",
    "series": "HCQ",
    "ratios": [
      1.24,
      1.46,
      1.72,
      2.03,
      2.26,
      2.48,
      2.78,
      2.96
    ],
    "weight": 980,
    "thrust": 90,
    "dimensions": "898×1104×1066",
    "transmissionCapacityPerRatio": [
      0.554,
      0.554,
      0.554,
      0.554,
      0.554,
      0.554,
      0.514,
      0.49
    ],
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
    "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
    "inputInterfaces": {
      "domestic": [
        "φ770"
      ]
    },
    "minPower": 490,
    "maxPower": 1108,
    "powerSource": "传递能力计算",
    "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
    "price": 181000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "ZC",
      "BV"
    ],
    "applications": [
      "拖网渔船",
      "运输船",
      "工程船",
      "大型渔船"
    ],
    "centerDistance": 290,
    "minSpeed": 1000,
    "maxSpeed": 2500,
    "source": "杭齿厂选型手册2025版5月版",
    "imageUrl": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp"
  },
  {
    "model": "HCQ800A",
    "series": "HCQ",
    "ratios": [
      1.28,
      1.46,
      1.72,
      2.04,
      2.26,
      2.48,
      2.75
    ],
    "weight": 1400,
    "thrust": 95,
    "dimensions": "898×1104×1066",
    "transmissionCapacityPerRatio": [
      0.7,
      0.7,
      0.7,
      0.7,
      0.7,
      0.7,
      0.63
    ],
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
    "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
    "inputInterfaces": {
      "domestic": [
        "φ770"
      ]
    },
    "minPower": 630,
    "maxPower": 1400,
    "powerSource": "传递能力计算",
    "image": "/images/gearbox/Advance-800-1000.webp",
    "price": 192000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "ZC",
      "BV"
    ],
    "applications": [
      "拖网渔船",
      "运输船",
      "工程船",
      "大型渔船"
    ],
    "centerDistance": 340,
    "minSpeed": 1000,
    "maxSpeed": 2500,
    "source": "杭齿厂选型手册2025版5月版",
    "imageUrl": "/images/gearbox/Advance-800-1000.webp"
  },
  {
    "model": "HCS200",
    "series": "HCS",
    "minPower": 1236,
    "maxPower": 3090,
    "minSpeed": 600,
    "maxSpeed": 1500,
    "ratios": [
      2.28,
      2.52,
      3.13,
      3.52,
      3.91,
      4.4
    ],
    "thrust": 148,
    "weight": 280,
    "centerDistance": 190,
    "transmissionCapacityPerRatio": [
      2.06,
      2.06,
      2.06,
      2.06,
      2.06,
      2.06
    ],
    "image": "/images/gearbox/Advance-200-201-230.webp",
    "price": 109000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相同",
    "dimensions": "424×792×754",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "拖网渔船",
      "拖船",
      "工程船"
    ],
    "powerSource": "传动能力计算",
    "source": "杭齿厂选型手册2025版5月版",
    "introduction": "HCS200是杭州前进齿轮箱集团生产的大功率双速船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比2.28~4.40，适用输入转速600~1500r/min，额定推力148kN。适用于拖网渔船、拖船、工程船等船舶。",
    "imageUrl": "/images/gearbox/Advance-200-201-230.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#6寸",
        "SAE1#8寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ518"
      ]
    }
  },
  {
    "model": "HCT1000",
    "series": "HCT",
    "ratios": [
      1.59,
      2.03,
      2.48,
      2.95,
      3.45,
      3.94,
      4.39,
      4.89,
      5.44,
      5.94
    ],
    "weight": 1600,
    "thrust": 110,
    "dimensions": "1150×1350×1547",
    "transmissionCapacityPerRatio": [
      0.857,
      0.857,
      0.857,
      0.857,
      0.857,
      0.857,
      0.771,
      0.69,
      0.621,
      0.569
    ],
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
    "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
    "inputInterfaces": {
      "sae": [
        "SAE14寸",
        "SAE16寸",
        "SAE18寸",
        "SAE21寸"
      ],
      "domestic": [
        "φ505",
        "φ518"
      ]
    },
    "minPower": 569,
    "maxPower": 1714,
    "powerSource": "传递能力计算",
    "image": "/images/gearbox/Advance-800-1000.webp",
    "price": 225000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相同",
    "certifications": [
      "CCS",
      "BV",
      "DNV"
    ],
    "applications": [
      "运输船",
      "工程船",
      "拖船"
    ],
    "centerDistance": 500,
    "minSpeed": 600,
    "maxSpeed": 1900,
    "source": "杭齿厂选型手册2025版5月版",
    "imageUrl": "/images/gearbox/Advance-800-1000.webp"
  },
  {
    "model": "HCTH2650",
    "series": "HCT",
    "minSpeed": 600,
    "maxSpeed": 1500,
    "ratios": [
      6.2
    ],
    "transmissionCapacityPerRatio": [
      3
    ],
    "thrust": 400,
    "centerDistance": 490,
    "minPower": 1500,
    "maxPower": 3500,
    "powerSource": "项目跟踪数据",
    "source": "项目跟踪记录-芜湖造船厂2#3#栈桥作业船固桨",
    "note": "特殊型号，三机三桨，配PTO，2940kW/1500rpm，速比6.2:1",
    "image": "/images/gearbox/Advance-HCT.webp",
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相同",
    "dimensions": "1900×2000×1970",
    "weight": 8000,
    "certifications": [
      "CCS",
      "BV",
      "DNV"
    ],
    "applications": [
      "大型运输船",
      "工程船",
      "拖船",
      "海工船"
    ],
    "priceSource": "估算价格",
    "price": 310000,
    "discountRate": 0.1,
    "introduction": "HCTH2650是杭州前进齿轮箱集团生产的大功率大功率船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比6.20~6.20，适用输入转速600~1500r/min，额定推力400kN。适用于大型运输船、工程船、拖船等船舶。",
    "imageUrl": "/images/gearbox/Advance-HCT.webp",
    "inputInterfaces": {
      "sae": [
        "SAE18寸",
        "SAE21寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ518",
        "φ640",
        "φ820"
      ]
    }
  },
  {
    "model": "HCTH2650P",
    "series": "HCT",
    "minSpeed": 600,
    "maxSpeed": 1500,
    "ratios": [
      1
    ],
    "transmissionCapacityPerRatio": [
      3
    ],
    "thrust": 400,
    "centerDistance": 490,
    "minPower": 1500,
    "maxPower": 3000,
    "powerSource": "项目跟踪数据",
    "source": "项目跟踪记录-芜湖造船厂2#3#栈桥作业船PTO",
    "note": "PTO版本，2600kW/1500rpm，速比1:1",
    "image": "/images/gearbox/Advance-HCT.webp",
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相同",
    "dimensions": "1900×2000×1970",
    "weight": 8000,
    "certifications": [
      "CCS",
      "BV",
      "DNV"
    ],
    "applications": [
      "大型运输船",
      "工程船",
      "拖船",
      "海工船"
    ],
    "priceSource": "估算价格",
    "price": 310000,
    "discountRate": 0.1,
    "introduction": "HCTH2650P是杭州前进齿轮箱集团生产的大功率大功率船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比1.00~1.00，适用输入转速600~1500r/min。适用于大型运输船、工程船、拖船等船舶。",
    "imageUrl": "/images/gearbox/Advance-HCT.webp",
    "inputInterfaces": {
      "sae": [
        "SAE18寸",
        "SAE21寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ518",
        "φ640",
        "φ820"
      ]
    }
  },
  {
    "model": "HCT400",
    "series": "HCT",
    "minPower": 54,
    "maxPower": 113,
    "minSpeed": 1000,
    "maxSpeed": 2100,
    "ratios": [
      6.09,
      6.49,
      6.93,
      7.42,
      7.96,
      8.4,
      9,
      9.47
    ],
    "thrust": 90,
    "weight": 1450,
    "centerDistance": 390,
    "transmissionCapacityPerRatio": [
      0.054,
      0.054,
      0.054,
      0.054,
      0.054,
      0.054,
      0.054,
      0.054
    ],
    "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
    "price": 87000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相同",
    "dimensions": "800×1052×1182",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "拖网渔船",
      "工程船"
    ],
    "powerSource": "传动能力计算",
    "source": "杭齿厂选型手册2025版5月版",
    "introduction": "HCT400是杭州前进齿轮箱集团生产的中小功率大功率船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比6.09~9.47，适用输入转速1000~2100r/min，额定推力90kN。适用于运输船、拖网渔船、工程船等船舶。",
    "imageUrl": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#8寸",
        "SAE18寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ505",
        "φ518"
      ]
    }
  },
  {
    "model": "HCT600",
    "series": "HCT",
    "ratios": [
      1.59,
      2.03,
      2.48,
      2.95,
      3.45,
      3.94
    ],
    "weight": 800,
    "thrust": 90,
    "dimensions": "1223×1136×899",
    "transmissionCapacityPerRatio": [
      0.46,
      0.46,
      0.46,
      0.46,
      0.414,
      0.363
    ],
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
    "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
    "inputInterfaces": {
      "sae": [
        "SAE0#0寸",
        "SAE1#4寸",
        "SAE1#6寸",
        "SAE1#8寸",
        "SAE14寸",
        "SAE16寸",
        "SAE18寸",
        "SAE2#1寸",
        "SAE21寸"
      ],
      "plainFlange": true,
      "boltPatterns": [
        "10-φ20",
        "24-φ15",
        "6-φ17.5",
        "8-φ13.8",
        "8-φ15",
        "8-φ27.7"
      ],
      "domestic": [
        "φ505",
        "φ518"
      ]
    },
    "minPower": 363,
    "maxPower": 920,
    "powerSource": "传递能力计算",
    "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
    "price": 121000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相同",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "拖网渔船",
      "工程船"
    ],
    "centerDistance": 415,
    "minSpeed": 1000,
    "maxSpeed": 2100,
    "source": "杭齿厂选型手册2025版5月版",
    "imageUrl": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
  },
  {
    "model": "HCT601P",
    "series": "HCT",
    "minPower": 491,
    "maxPower": 1031,
    "minSpeed": 1000,
    "maxSpeed": 2100,
    "ratios": [
      6.06,
      6.49,
      6.93,
      7.42,
      7.96,
      8.54,
      9.35
    ],
    "thrust": 110,
    "weight": 1653,
    "centerDistance": 420,
    "transmissionCapacityPerRatio": [
      0.491,
      0.491,
      0.491,
      0.491,
      0.491,
      0.491,
      0.491
    ],
    "image": "/images/gearbox/Advance-800-1000.webp",
    "price": 129000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相同",
    "dimensions": "821×1214×1271",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "工程船",
      "拖船"
    ],
    "powerSource": "传动能力计算",
    "source": "杭齿厂选型手册2025版5月版",
    "introduction": "HCT601P是杭州前进齿轮箱集团生产的中大功率大功率船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比6.06~9.35，适用输入转速1000~2100r/min，额定推力110kN。适用于运输船、工程船、拖船等船舶。",
    "imageUrl": "/images/gearbox/Advance-800-1000.webp",
    "inputInterfaces": {
      "sae": [
        "SAE18寸",
        "SAE21寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ518",
        "φ640"
      ]
    }
  },
  {
    "model": "HCT700",
    "series": "HCT",
    "ratios": [
      1.59,
      2.05,
      2.48,
      2.95,
      3.45,
      3.94,
      4.44,
      4.89
    ],
    "weight": 850,
    "thrust": 90,
    "dimensions": "1056×1280×1425",
    "transmissionCapacityPerRatio": [
      0.49,
      0.49,
      0.49,
      0.49,
      0.49,
      0.441,
      0.392,
      0.356
    ],
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
    "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
    "inputInterfaces": {
      "sae": [
        "SAE14寸",
        "SAE16寸",
        "SAE18寸",
        "SAE21寸"
      ],
      "domestic": [
        "φ505",
        "φ518"
      ]
    },
    "minPower": 356,
    "maxPower": 980,
    "powerSource": "传递能力计算",
    "image": "/images/gearbox/Advance-800-1000.webp",
    "price": 129000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相同",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "拖网渔船",
      "工程船"
    ],
    "centerDistance": 430,
    "minSpeed": 600,
    "maxSpeed": 2100,
    "source": "杭齿厂选型手册2025版5月版",
    "imageUrl": "/images/gearbox/Advance-800-1000.webp"
  },
  {
    "model": "HCV100",
    "series": "HCV",
    "ratios": [
      2.02,
      2.48,
      2.95,
      3.45,
      4
    ],
    "weight": 70,
    "thrust": 16,
    "dimensions": "485×508×580",
    "transmissionCapacityPerRatio": [
      0.06,
      0.054,
      0.049,
      0.044,
      0.04
    ],
    "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
    "introduction": "HCV系列船用齿轮箱是V型布置的船用齿轮箱,适用于特殊安装空间要求的船舶。",
    "inputInterfaces": {
      "domestic": [
        "φ770"
      ]
    },
    "minPower": 40,
    "maxPower": 120,
    "powerSource": "传递能力计算",
    "image": "/images/gearbox/Advance-200-201-230.webp",
    "price": 31000,
    "priceSource": "系统估算",
    "discountRate": 0.1,
    "controlType": "推拉软轴/电控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS",
      "ZC"
    ],
    "applications": [
      "游艇",
      "快艇",
      "巡逻艇"
    ],
    "centerDistance": 146,
    "minSpeed": 1000,
    "maxSpeed": 3500,
    "source": "杭齿厂选型手册2025版5月版",
    "imageUrl": "/images/gearbox/Advance-200-201-230.webp"
  },
  {
    "model": "SGWL49.54",
    "series": "GW",
    "minSpeed": 600,
    "maxSpeed": 1500,
    "ratios": [
      1.88,
      2.05
    ],
    "transmissionCapacityPerRatio": [
      5,
      5
    ],
    "thrust": 300,
    "centerDistance": 290,
    "minPower": 1500,
    "maxPower": 3500,
    "powerSource": "项目跟踪数据",
    "source": "项目跟踪记录-芜湖造船厂2#3#栈桥作业船",
    "note": "特殊型号，配舵桨，双速比1.88:1/2.05:1，2940kW/1500rpm",
    "image": "/images/gearbox/Advance-GW.webp",
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相同",
    "weight": 7000,
    "dimensions": "2126×1989×1340",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ],
    "priceSource": "估算价格",
    "price": 370000,
    "discountRate": 0.1,
    "introduction": "SGWL49.54是杭州前进齿轮箱集团生产的大功率大功率低速船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比1.88~2.05，适用输入转速600~1500r/min，额定推力300kN。适用于运输船、散货船、工程船等船舶。",
    "imageUrl": "/images/gearbox/Advance-GW.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸",
        "SAE2#1寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ480",
        "φ530"
      ]
    }
  },
  {
    "model": "SGWL52.59",
    "series": "GW",
    "minSpeed": 600,
    "maxSpeed": 1000,
    "ratios": [
      1.022,
      1.145
    ],
    "transmissionCapacityPerRatio": [
      6,
      6
    ],
    "thrust": 350,
    "centerDistance": 300,
    "minPower": 2000,
    "maxPower": 4500,
    "powerSource": "项目跟踪数据",
    "source": "项目跟踪记录-芜湖造船厂4#运输船",
    "note": "特殊型号，配舵桨，双速比1.022:1/1.145:1，3600kW/800rpm",
    "image": "/images/gearbox/Advance-GW.webp",
    "controlType": "推拉软轴/电控/气控",
    "rotationDirection": "相同",
    "weight": 8900,
    "dimensions": "2291×1400×1290",
    "certifications": [
      "CCS",
      "BV"
    ],
    "applications": [
      "运输船",
      "散货船",
      "工程船"
    ],
    "priceSource": "估算价格",
    "price": 430000,
    "discountRate": 0.1,
    "introduction": "SGWL52.59是杭州前进齿轮箱集团生产的大功率大功率低速船用齿轮箱，采用推拉软轴/电控/气控操纵方式，减速比1.02~1.15，适用输入转速600~1000r/min，额定推力350kN。适用于运输船、散货船、工程船等船舶。",
    "imageUrl": "/images/gearbox/Advance-GW.webp",
    "inputInterfaces": {
      "sae": [
        "SAE1#14寸",
        "SAE2#1寸"
      ],
      "plainFlange": true,
      "domestic": [
        "φ480",
        "φ530"
      ]
    }
  }
];

export default legacyGearboxData;
