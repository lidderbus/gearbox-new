// 齿轮箱完整数据库
// 更新日期: 2026-02-17 (价格依据杭齿集公[2026]30号文件, 2026-01-01起执行)
// 总型号数: 595
// 数据来源: 杭齿厂选型手册2025版5月版 + enhanced_data.json
// 合并说明: React版536 + HTML版独有59 = 595个型号
// 图片修复: 为536个型号匹配了专属图片
// 价格修复: 价格覆盖率91.4%

const completeGearboxData = [
    {
        "model": "06",
        "series": "other",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            2.52,
            3.05,
            3.5
        ],
        "transmissionCapacityPerRatio": [
            0.004,
            0.004,
            0.004
        ],
        "thrust": 1.8,
        "centerDistance": 124,
        "dimensions": "350×316×482",
        "weight": 58,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 8000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 8,
        "minPower": 4,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/06-16A-26.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/06-16A-26.webp"
    },
    {
        "model": "120B",
        "series": "HC",
        "minSpeed": 750,
        "maxSpeed": 1800,
        "ratios": [
            2.03,
            2.81,
            3.73
        ],
        "thrust": 25,
        "centerDistance": 190,
        "dimensions": "605×744×770",
        "weight": 400,
        "maxPower": 158,
        "minPower": 33,
        "powerSource": "选型手册2025",
        "price": 12520,
        "discountRate": 0.1,
        "applications": [
            "拖网渔船",
            "运输船",
            "工作船"
        ],
        "certifications": [
            "CCS"
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "domestic": [
                "φ405"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ12.5",
                "8-φ11",
                "8-φ12.5",
                "8-φ14",
                "8-φ48"
            ]
        },
        "transmissionCapacityPerRatio": [
            0.088,
            0.088,
            0.044
        ],
        "image": "/images/gearbox/Advance-135.webp",
        "priceSource": "2026官方出厂价"
    },
    {
        "model": "120C",
        "series": "HC",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            1.48,
            1.61,
            1.94,
            2.45,
            2.96,
            3.35
        ],
        "thrust": 25,
        "centerDistance": 180,
        "dimensions": "432×440×650",
        "weight": 225,
        "maxPower": 250,
        "minPower": 80,
        "powerSource": "选型手册2025",
        "price": 13420,
        "discountRate": 0.1,
        "applications": [
            "拖网渔船",
            "运输船",
            "工作船"
        ],
        "certifications": [
            "CCS"
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "domestic": [
                "φ405"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ12.5",
                "8-φ11",
                "8-φ12.5",
                "8-φ14",
                "8-φ48"
            ]
        },
        "transmissionCapacityPerRatio": [
            0.1,
            0.1,
            0.1,
            0.1,
            0.09,
            0.08
        ],
        "image": "/images/gearbox/Advance-120C-HCV120.webp",
        "priceSource": "2026官方出厂价"
    },
    {
        "model": "135",
        "series": "HC",
        "minSpeed": 750,
        "maxSpeed": 2000,
        "ratios": [
            2.03,
            2.59,
            3.04,
            3.62,
            4.11,
            4.65,
            5.06,
            5.47,
            5.81
        ],
        "thrust": 29.4,
        "centerDistance": 225,
        "dimensions": "578×792×830",
        "weight": 470,
        "maxPower": 200,
        "minPower": 53,
        "powerSource": "选型手册2025",
        "price": 18360,
        "discountRate": 0.1,
        "applications": [
            "拖网渔船",
            "运输船",
            "工程船"
        ],
        "certifications": [
            "CCS"
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "sae": [
                "SAE1#4寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ11.5",
                "8-φ17.75"
            ]
        },
        "transmissionCapacityPerRatio": [
            0.1,
            0.1,
            0.1,
            0.1,
            0.1,
            0.093,
            0.088,
            0.077,
            0.07
        ],
        "image": "/images/gearbox/Advance-135.webp",
        "priceSource": "2026官方出厂价"
    },
    {
        "model": "16A",
        "series": "other",
        "minSpeed": 1000,
        "maxSpeed": 2000,
        "ratios": [
            2.07,
            2.48,
            2.95,
            3.35,
            3.83
        ],
        "transmissionCapacityPerRatio": [
            0.012,
            0.012,
            0.012,
            0.012,
            0.012
        ],
        "thrust": 3.5,
        "centerDistance": 135,
        "dimensions": "422×325×563",
        "weight": 84,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 12000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 24,
        "minPower": 12,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/06-16A-26.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/06-16A-26.webp"
    },
    {
        "model": "26",
        "series": "other",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            2.5,
            3,
            3.5,
            4
        ],
        "transmissionCapacityPerRatio": [
            0.0199,
            0.0199,
            0.019,
            0.0177
        ],
        "thrust": 5,
        "centerDistance": 135,
        "dimensions": "473.5×365×830",
        "weight": 92,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 15000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 50,
        "minPower": 18,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/06-16A-26.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/06-16A-26.webp"
    },
    {
        "model": "2GWH1060",
        "series": "other",
        "minSpeed": 400,
        "maxSpeed": 900,
        "ratios": [
            2.53,
            3.54,
            4.55,
            5.56
        ],
        "transmissionCapacityPerRatio": [
            1.12,
            0.935,
            0.935,
            0.75
        ],
        "thrust": 175,
        "centerDistance": 1460,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 280000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 1008,
        "minPower": 300,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/06-16A-26.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-2GWH.webp"
    },
    {
        "model": "2GWH1830",
        "series": "other",
        "minSpeed": 400,
        "maxSpeed": 900,
        "ratios": [
            2.53,
            3.54,
            4.55,
            5.56
        ],
        "transmissionCapacityPerRatio": [
            1.921,
            1.596,
            1.596,
            1.271
        ],
        "thrust": 270,
        "centerDistance": 1760,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 380000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 1729,
        "minPower": 508,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-2GWH.webp"
    },
    {
        "model": "2GWH3140",
        "series": "other",
        "minSpeed": 400,
        "maxSpeed": 800,
        "ratios": [
            2.53,
            3.54,
            4.55,
            5.56
        ],
        "transmissionCapacityPerRatio": [
            3.282,
            2.7265,
            2.7265,
            2.171
        ],
        "thrust": 300,
        "centerDistance": 2080,
        "dimensions": "3285×3000×2840",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 520000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 2626,
        "minPower": 868,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-2GWH.webp"
    },
    {
        "model": "2GWH400",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
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
        "weight": 1500
    },
    {
        "model": "2GWH4100",
        "series": "other",
        "minSpeed": 400,
        "maxSpeed": 700,
        "ratios": [
            2.53,
            3.54,
            4.55,
            5.56
        ],
        "transmissionCapacityPerRatio": [
            4.243,
            3.5675,
            3.5675,
            2.892
        ],
        "thrust": 450,
        "centerDistance": 2300,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 680000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 2970,
        "minPower": 1157,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-2GWH.webp"
    },
    {
        "model": "2GWH5410",
        "series": "other",
        "minSpeed": 400,
        "maxSpeed": 600,
        "ratios": [
            2.53,
            3.54,
            4.55,
            5.56
        ],
        "transmissionCapacityPerRatio": [
            5.774,
            4.8035,
            4.8035,
            3.833
        ],
        "thrust": 550,
        "centerDistance": 2560,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 850000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 3464,
        "minPower": 1533,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-2GWH.webp"
    },
    {
        "model": "2GWH600",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
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
        "weight": 2200
    },
    {
        "model": "2GWH7050",
        "series": "other",
        "minSpeed": 400,
        "maxSpeed": 600,
        "ratios": [
            2.53,
            3.54,
            4.55,
            5.56
        ],
        "transmissionCapacityPerRatio": [
            7.435,
            6.1445,
            6.1445,
            4.854
        ],
        "thrust": 750,
        "centerDistance": 2700,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 1050000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 4461,
        "minPower": 1942,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-2GWH.webp"
    },
    {
        "model": "2GWH800",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
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
        "weight": 2800
    },
    {
        "model": "2GWH9250",
        "series": "other",
        "minSpeed": 400,
        "maxSpeed": 600,
        "ratios": [
            2.53,
            3.54,
            4.55,
            5.56
        ],
        "transmissionCapacityPerRatio": [
            9.917,
            8.206,
            8.206,
            6.495
        ],
        "thrust": 1000,
        "centerDistance": 3080,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 1350000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 5950,
        "minPower": 2598,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-2GWH.webp"
    },
    {
        "model": "300",
        "series": "other",
        "minSpeed": 750,
        "maxSpeed": 2500,
        "ratios": [
            1.87,
            2.04,
            2.54,
            3,
            3.53,
            4.1,
            4.47,
            4.61,
            4.94,
            5.44
        ],
        "transmissionCapacityPerRatio": [
            0.257,
            0.257,
            0.257,
            0.243,
            0.221,
            0.184,
            0.184,
            0.184,
            0.147,
            0.125
        ],
        "thrust": 50,
        "centerDistance": 264,
        "dimensions": "786×930×864",
        "weight": 740,
        "controlType": "推拉软轴/电控/气控",
        "price": 23600,
        "discountRate": 0.16,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 643,
        "minPower": 94,
        "powerSource": "传动能力计算",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "sae": [
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ12.5",
                "12-φ13",
                "16-φ14",
                "6-φ17",
                "6-φ17.5",
                "8-φ13.8",
                "8-φ15"
            ]
        },
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "40A",
        "series": "other",
        "minSpeed": 750,
        "maxSpeed": 2000,
        "ratios": [
            2.07,
            2.96,
            3.44,
            3.83
        ],
        "transmissionCapacityPerRatio": [
            0.0294,
            0.0294,
            0.0235,
            0.02
        ],
        "thrust": 8.8,
        "centerDistance": 142,
        "dimensions": "490×670×620",
        "weight": 225,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 8560,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "maxPower": 59,
        "minPower": 15,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/40A.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "plainFlange": true,
            "boltPatterns": [
                "12-φ11",
                "12-φ13",
                "6-φ13.7",
                "8-φ11",
                "8-φ14"
            ]
        },
        "image": "/images/gearbox/40A.webp"
    },
    {
        "model": "D300A",
        "series": "other",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            4,
            4.48,
            5.05,
            5.52,
            5.9,
            6.56,
            7.06,
            7.63
        ],
        "transmissionCapacityPerRatio": [
            0.257,
            0.243,
            0.221,
            0.184,
            0.184,
            0.184,
            0.147,
            0.125
        ],
        "thrust": 60,
        "centerDistance": 355,
        "dimensions": "786×1010×1041",
        "weight": 940,
        "controlType": "推拉软轴/电控/气控",
        "price": 32420,
        "discountRate": 0.22,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 643,
        "minPower": 125,
        "powerSource": "传动能力计算",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "sae": [
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ12.5",
                "12-φ13",
                "16-φ14",
                "6-φ17",
                "8-φ13.8",
                "8-φ15",
                "8-φ25.8"
            ]
        },
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
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
        "dataSource": "dwgTechParams_estimated",
        "image": "/images/gearbox/Advance-DT.webp",
        "price": 613000,
        "priceSource": "系统估算",
        "discountRate": 0.1
    },
    {
        "model": "DT1400",
        "series": "DT",
        "minSpeed": 750,
        "maxSpeed": 1500,
        "ratios": [
            1.47,
            1.96,
            2.48,
            3.04,
            3.44,
            4.09,
            4.44,
            4.95,
            5.53,
            6.08
        ],
        "thrust": 90,
        "centerDistance": 290,
        "dimensions": "720×1104×1066",
        "weight": 900,
        "controlType": "推拉软轴/电控",
        "price": 100000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 1200,
        "minPower": 204,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1500
        ],
        "transmissionCapacityPerRatio": [
            0.8,
            0.77,
            0.663,
            0.566,
            0.519,
            0.451,
            0.416,
            0.333,
            0.3,
            0.272
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-dt.png",
        "introduction": "DT系列工业齿轮箱适用于各类工业机械的减速传动。采用硬齿面齿轮,承载能力强,使用寿命长。",
        "inputInterfaces": {
            "sae": [
                "SAE24寸"
            ],
            "type": "电动机推进",
            "note": "大型电推齿轮箱"
        },
        "image": "/images/gearbox/Advance-DT.webp"
    },
    {
        "model": "DT1500",
        "series": "DT",
        "minSpeed": 750,
        "maxSpeed": 1500,
        "ratios": [
            1.54,
            1.96,
            2.52,
            3.05,
            3.47,
            3.95,
            4.45,
            5,
            5.49,
            6.03
        ],
        "thrust": 100,
        "centerDistance": 310,
        "dimensions": "789×1104×985",
        "weight": 1100,
        "controlType": "推拉软轴/电控",
        "price": 120000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 1688,
        "minPower": 194,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1500
        ],
        "transmissionCapacityPerRatio": [
            1.125,
            0.967,
            0.813,
            0.713,
            0.637,
            0.537,
            0.41,
            0.313,
            0.285,
            0.259
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-dt.png",
        "introduction": "DT系列工业齿轮箱适用于各类工业机械的减速传动。采用硬齿面齿轮,承载能力强,使用寿命长。",
        "inputInterfaces": {
            "sae": [
                "SAE24寸",
                "SAE30寸"
            ],
            "type": "电动机推进",
            "note": "大型电推齿轮箱"
        },
        "image": "/images/gearbox/Advance-DT.webp"
    },
    {
        "model": "DT180",
        "series": "DT",
        "minSpeed": 750,
        "maxSpeed": 1500,
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
        "thrust": 14.7,
        "centerDistance": 142,
        "dimensions": "325×380×544",
        "weight": 130,
        "controlType": "推拉软轴/电控",
        "price": 23000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 125,
        "minPower": 11,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            750,
            1500
        ],
        "transmissionCapacityPerRatio": [
            0.083,
            0.083,
            0.067,
            0.056,
            0.047,
            0.042,
            0.033,
            0.03,
            0.024,
            0.014
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-dt.png",
        "introduction": "DT系列工业齿轮箱适用于各类工业机械的减速传动。采用硬齿面齿轮,承载能力强,使用寿命长。",
        "inputInterfaces": {
            "sae": [
                "SAE14寸"
            ],
            "type": "电动机推进",
            "note": "小型电推齿轮箱"
        },
        "image": "/images/gearbox/Advance-DT.webp"
    },
    {
        "model": "DT210",
        "series": "DT",
        "minSpeed": 750,
        "maxSpeed": 1500,
        "ratios": [
            1.54,
            2.03,
            2.48,
            3.04,
            3.52,
            3.91,
            4.42,
            4.92,
            5.48,
            6.02
        ],
        "thrust": 16,
        "centerDistance": 146,
        "dimensions": "365×551×656",
        "weight": 150,
        "controlType": "推拉软轴/电控",
        "price": 35000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 150,
        "minPower": 20,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            750,
            1500
        ],
        "transmissionCapacityPerRatio": [
            0.1,
            0.1,
            0.086,
            0.073,
            0.061,
            0.055,
            0.041,
            0.033,
            0.029,
            0.026
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-dt.png",
        "introduction": "DT系列工业齿轮箱适用于各类工业机械的减速传动。采用硬齿面齿轮,承载能力强,使用寿命长。",
        "inputInterfaces": {
            "sae": [
                "SAE14寸"
            ],
            "type": "电动机推进",
            "note": "小型电推齿轮箱"
        },
        "image": "/images/gearbox/Advance-DT.webp"
    },
    {
        "model": "DT240",
        "series": "DT",
        "minSpeed": 750,
        "maxSpeed": 1500,
        "ratios": [
            1.5,
            2.03,
            2.48,
            2.95,
            3.57,
            4.05,
            4.52,
            4.99,
            5.5,
            5.94
        ],
        "thrust": 25,
        "centerDistance": 165,
        "dimensions": "641×619×715",
        "weight": 240,
        "controlType": "推拉软轴/电控",
        "price": 39000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 240,
        "minPower": 15,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            750,
            1500
        ],
        "transmissionCapacityPerRatio": [
            0.16,
            0.16,
            0.15,
            0.134,
            0.092,
            0.073,
            0.05,
            0.04,
            0.022,
            0.02
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-dt.png",
        "introduction": "DT系列工业齿轮箱适用于各类工业机械的减速传动。采用硬齿面齿轮,承载能力强,使用寿命长。",
        "inputInterfaces": {
            "boltPatterns": [
                "8-φ16.5"
            ],
            "sae": [
                "SAE14寸",
                "SAE16寸"
            ],
            "type": "电动机推进",
            "note": "小型电推齿轮箱"
        },
        "image": "/images/gearbox/Advance-DT.webp"
    },
    {
        "model": "DT2400",
        "series": "DT",
        "minSpeed": 750,
        "maxSpeed": 1500,
        "ratios": [
            1.52,
            2.04,
            2.43,
            2.9,
            3.48,
            4,
            4.45,
            5,
            5.35,
            5.5,
            5.96
        ],
        "thrust": 110,
        "centerDistance": 340,
        "dimensions": "920×1210×1210",
        "weight": 1430,
        "controlType": "推拉软轴/电控",
        "price": 155000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 2199,
        "minPower": 170,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            750,
            1500
        ],
        "transmissionCapacityPerRatio": [
            1.466,
            1.466,
            1.306,
            1.146,
            1,
            0.82,
            0.58,
            0.434,
            0.36,
            0.373,
            0.226
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-dt.png",
        "introduction": "DT系列工业齿轮箱适用于各类工业机械的减速传动。采用硬齿面齿轮,承载能力强,使用寿命长。",
        "inputInterfaces": {
            "sae": [
                "SAE30寸"
            ],
            "type": "电动机推进",
            "note": "超大型电推齿轮箱"
        },
        "image": "/images/gearbox/Advance-DT.webp"
    },
    {
        "model": "DT2500",
        "series": "DT",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 3600
    },
    {
        "model": "DT280",
        "series": "DT",
        "minSpeed": 750,
        "maxSpeed": 1500,
        "ratios": [
            1.53,
            2.03,
            2.5,
            2.95,
            3.55,
            4,
            4.53,
            5.05
        ],
        "thrust": 30,
        "centerDistance": 190,
        "dimensions": "479×792×820",
        "weight": 350,
        "controlType": "推拉软轴/电控",
        "price": 45000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 306,
        "minPower": 57,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            750,
            1500
        ],
        "transmissionCapacityPerRatio": [
            0.204,
            0.204,
            0.17,
            0.15,
            0.128,
            0.117,
            0.087,
            0.076
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-dt.png",
        "introduction": "DT系列工业齿轮箱适用于各类工业机械的减速传动。采用硬齿面齿轮,承载能力强,使用寿命长。",
        "inputInterfaces": {
            "sae": [
                "SAE16寸"
            ],
            "type": "电动机推进",
            "note": "中小型电推齿轮箱"
        },
        "image": "/images/gearbox/Advance-DT.webp"
    },
    {
        "model": "DT4000",
        "series": "DT",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 5000
    },
    {
        "model": "DT4300",
        "series": "DT",
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
        "thrust": 120,
        "centerDistance": 370,
        "dimensions": "923×1230×1180",
        "weight": 1550,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 165500,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2261,
        "minPower": 330,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            750,
            1500
        ],
        "transmissionCapacityPerRatio": [
            1.507,
            1.507,
            1.507,
            1.364,
            1.243,
            1.103,
            0.787,
            0.66,
            0.52,
            0.44
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-dt.png",
        "introduction": "DT系列工业齿轮箱适用于各类工业机械的减速传动。采用硬齿面齿轮,承载能力强,使用寿命长。",
        "inputInterfaces": {
            "sae": [
                "SAE36寸"
            ],
            "type": "电动机推进",
            "note": "超大型电推齿轮箱"
        },
        "image": "/images/gearbox/Advance-DT.webp"
    },
    {
        "model": "DT580",
        "series": "DT",
        "minSpeed": 750,
        "maxSpeed": 1500,
        "ratios": [
            1.46,
            2.05,
            2.55,
            2.95,
            3.48,
            3.96,
            4.52,
            4.94,
            5.41,
            5.83
        ],
        "thrust": 40,
        "centerDistance": 203,
        "dimensions": "630×741×780",
        "weight": 370,
        "controlType": "推拉软轴/电控",
        "price": 52000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 504,
        "minPower": 65,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            750,
            1500
        ],
        "transmissionCapacityPerRatio": [
            0.336,
            0.27,
            0.25,
            0.21,
            0.16,
            0.14,
            0.123,
            0.112,
            0.102,
            0.086
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-dt.png",
        "introduction": "DT系列工业齿轮箱适用于各类工业机械的减速传动。采用硬齿面齿轮,承载能力强,使用寿命长。",
        "inputInterfaces": {
            "sae": [
                "SAE18寸"
            ],
            "type": "电动机推进",
            "note": "中型电推齿轮箱"
        },
        "image": "/images/gearbox/Advance-DT.webp"
    },
    {
        "model": "DT770",
        "series": "DT",
        "minSpeed": 750,
        "maxSpeed": 1500,
        "ratios": [
            1.54,
            1.96,
            2.5,
            3.05,
            3.47,
            3.95,
            4.57,
            5.03
        ],
        "thrust": 50,
        "centerDistance": 220,
        "dimensions": "532×900×800",
        "weight": 480,
        "controlType": "电控",
        "price": 58000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 720,
        "minPower": 119,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            750,
            1500
        ],
        "transmissionCapacityPerRatio": [
            0.48,
            0.443,
            0.4,
            0.327,
            0.27,
            0.214,
            0.186,
            0.158
        ],
        "transferCapacity": [
            0.52,
            0.48,
            0.42,
            0.36,
            0.32,
            0.28,
            0.24,
            0.21,
            0.18
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-dt.png",
        "introduction": "DT系列工业齿轮箱适用于各类工业机械的减速传动。采用硬齿面齿轮,承载能力强,使用寿命长。",
        "inputInterfaces": {
            "boltPatterns": [
                "8-φ20.8"
            ],
            "sae": [
                "SAE18寸",
                "SAE21寸"
            ],
            "type": "电动机推进",
            "note": "中型电推齿轮箱"
        },
        "image": "/images/gearbox/Advance-DT.webp"
    },
    {
        "model": "DT900",
        "series": "DT",
        "minSpeed": 750,
        "maxSpeed": 1500,
        "ratios": [
            1.52,
            2,
            2.39,
            3,
            3.44,
            3.96,
            4.57,
            5.05,
            5.4,
            5.98
        ],
        "thrust": 60,
        "centerDistance": 264,
        "dimensions": "705×856×870",
        "weight": 700,
        "controlType": "电控",
        "price": 63000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 951,
        "minPower": 100,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            750,
            1800
        ],
        "transmissionCapacityPerRatio": [
            0.634,
            0.528,
            0.527,
            0.446,
            0.408,
            0.332,
            0.243,
            0.206,
            0.173,
            0.133
        ],
        "transferCapacity": [
            0.634,
            0.528,
            0.527,
            0.446,
            0.408,
            0.332,
            0.243,
            0.206,
            0.173,
            0.133
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-dt.png",
        "introduction": "DT系列工业齿轮箱适用于各类工业机械的减速传动。采用硬齿面齿轮,承载能力强,使用寿命长。",
        "inputInterfaces": {
            "sae": [
                "SAE21寸"
            ],
            "type": "电动机推进",
            "note": "中大型电推齿轮箱"
        },
        "image": "/images/gearbox/Advance-DT.webp"
    },
    {
        "model": "GC1000",
        "series": "GC配变距桨",
        "minSpeed": null,
        "maxSpeed": null,
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
        "weight": 1800
    },
    {
        "model": "GC1400",
        "series": "GC配变距桨",
        "minSpeed": null,
        "maxSpeed": null,
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
        "weight": 2500
    },
    {
        "model": "GC600",
        "series": "GC配变距桨",
        "minSpeed": null,
        "maxSpeed": null,
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
        "weight": 850
    },
    {
        "model": "GC800",
        "series": "GC配变距桨",
        "minSpeed": null,
        "maxSpeed": null,
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
        "weight": 1200
    },
    {
        "model": "GCH1000",
        "series": "GC配变距桨",
        "minSpeed": 200,
        "maxSpeed": 800,
        "ratios": [
            2,
            2.54,
            2.96,
            3.5,
            3.95
        ],
        "transmissionCapacityPerRatio": [
            17.5,
            17.5,
            17.5,
            17.5,
            17.5
        ],
        "thrust": 1400,
        "centerDistance": 1018,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 3500,
        "maxPower": 14000,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCH320",
        "series": "GCH",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            1.97,
            2.52,
            2.96,
            3.52,
            4
        ],
        "maxPower": 1026,
        "minPower": 228,
        "powerSource": "传动能力计算",
        "price": 160000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.57,
            0.57,
            0.57,
            0.57,
            0.57
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCH系列齿轮箱是GC系列的重型版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 100,
        "centerDistance": 320
    },
    {
        "model": "GCH350",
        "series": "GCH",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            2,
            3,
            3.57,
            4.05
        ],
        "maxPower": 1296,
        "minPower": 288,
        "powerSource": "传动能力计算",
        "price": 160000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.72,
            0.72,
            0.72,
            0.72
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCH系列齿轮箱是GC系列的重型版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 113,
        "centerDistance": 350
    },
    {
        "model": "GCH390",
        "series": "GCH",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            2.03,
            2.48,
            2.92,
            3.48,
            3.95
        ],
        "maxPower": 1728,
        "minPower": 384,
        "powerSource": "传动能力计算",
        "price": 160000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.96,
            0.96,
            0.96,
            0.96,
            0.96
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCH系列齿轮箱是GC系列的重型版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 140,
        "centerDistance": 390
    },
    {
        "model": "GCH410",
        "series": "GCH",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            2,
            2.54,
            2.96,
            3.5,
            3.95
        ],
        "maxPower": 2067,
        "minPower": 517,
        "powerSource": "传动能力计算",
        "price": 160000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.292,
            1.292,
            1.292,
            1.292,
            1.292
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCH系列齿轮箱是GC系列的重型版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 175,
        "centerDistance": 410
    },
    {
        "model": "GCH490",
        "series": "GC配变距桨",
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
            2.12,
            2.12,
            2.12,
            2.12,
            2.12
        ],
        "thrust": 270,
        "centerDistance": 490,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 848,
        "maxPower": 2968,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCH540",
        "series": "GC配变距桨",
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
            2.825,
            2.825,
            2.825,
            2.825,
            2.825
        ],
        "thrust": 290,
        "centerDistance": 540,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 1130,
        "maxPower": 3390,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCH590",
        "series": "GC配变距桨",
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
            3.64,
            3.64,
            3.64,
            3.64,
            3.64
        ],
        "thrust": 360,
        "centerDistance": 590,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 1456,
        "maxPower": 4368,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCH660",
        "series": "GC配变距桨",
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
            5.05,
            5.05,
            5.05,
            5.05,
            5.05
        ],
        "thrust": 540,
        "centerDistance": 668,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 2020,
        "maxPower": 6060,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCH750",
        "series": "GCH",
        "minSpeed": 300,
        "maxSpeed": 950,
        "ratios": [
            1.97,
            2.47,
            3,
            3.52,
            3.95,
            4.48,
            4.96,
            5.43,
            6
        ],
        "maxPower": 7705,
        "minPower": 2433,
        "powerSource": "传动能力计算",
        "price": 160000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            8.111,
            8.111,
            8.111,
            8.111,
            8.111,
            8.111,
            8.111,
            8.111,
            8.111
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCH系列齿轮箱是GC系列的重型版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 730,
        "centerDistance": 750
    },
    {
        "model": "GCH760",
        "series": "GCH",
        "minSpeed": 300,
        "maxSpeed": 900,
        "ratios": [
            1.94,
            2.54,
            3,
            3.95
        ],
        "maxPower": 7300,
        "minPower": 2433,
        "powerSource": "传动能力计算",
        "price": 160000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            8.111,
            8.111,
            8.111,
            8.111
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCH系列齿轮箱是GC系列的重型版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 750,
        "centerDistance": 768
    },
    {
        "model": "GCH850",
        "series": "GCH",
        "minSpeed": 300,
        "maxSpeed": 800,
        "ratios": [
            1.97,
            2.47,
            3,
            3.52,
            3.95
        ],
        "maxPower": 7680,
        "minPower": 2880,
        "powerSource": "传动能力计算",
        "price": 160000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            9.6,
            9.6,
            9.6,
            9.6,
            9.6
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCH系列齿轮箱是GC系列的重型版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 800,
        "centerDistance": 855
    },
    {
        "model": "GCH880",
        "series": "GCH",
        "minSpeed": 200,
        "maxSpeed": 650,
        "ratios": [
            3.5,
            3.95
        ],
        "maxPower": 7841,
        "minPower": 2413,
        "powerSource": "传动能力计算",
        "price": 160000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            12.063,
            12.063
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCH系列齿轮箱是GC系列的重型版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 1000,
        "centerDistance": 880
    },
    {
        "model": "GCH900",
        "series": "GCH",
        "minSpeed": 200,
        "maxSpeed": 800,
        "ratios": [
            2.52,
            3.08,
            3.43,
            4.1
        ],
        "maxPower": 9650,
        "minPower": 2413,
        "powerSource": "传动能力计算",
        "price": 160000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            12.063,
            12.063,
            12.063,
            12.063
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCH系列齿轮箱是GC系列的重型版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 980,
        "centerDistance": 900
    },
    {
        "model": "GCH950",
        "series": "GC配变距桨",
        "minSpeed": 200,
        "maxSpeed": 650,
        "ratios": [
            2,
            2.54,
            2.96,
            3.5,
            3.95
        ],
        "transmissionCapacityPerRatio": [
            14,
            14,
            14,
            14,
            14
        ],
        "thrust": 1000,
        "centerDistance": 965,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 2800,
        "maxPower": 9100,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHE11",
        "series": "GCHE",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            1.64,
            1.97,
            2.55,
            2.93,
            3.58,
            4,
            6.5,
            8
        ],
        "maxPower": 19301,
        "minPower": 4825,
        "powerSource": "传动能力计算",
        "price": 180000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            12.063,
            12.063,
            12.063,
            12.063,
            12.063,
            12.063,
            12.063,
            12.063
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCHE系列齿轮箱是GC系列的增强版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 270,
        "centerDistance": 735
    },
    {
        "model": "GCHE15",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            6.5,
            7,
            7.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            1.64,
            1.64,
            1.64,
            1.64
        ],
        "thrust": 300,
        "centerDistance": 810,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "名义速比6.50-8.00",
        "minPower": 656,
        "maxPower": 2624,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHE20",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1400,
        "ratios": [
            6.5,
            7,
            7.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            2.12,
            2.12,
            2.12,
            2.12
        ],
        "thrust": 350,
        "centerDistance": 875,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "名义速比6.50-8.00",
        "minPower": 848,
        "maxPower": 2968,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHE26",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            6.5,
            7,
            7.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            2.825,
            2.825,
            2.825,
            2.825
        ],
        "thrust": 450,
        "centerDistance": 960,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "名义速比6.50-8.00",
        "minPower": 1130,
        "maxPower": 3390,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHE33",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            6.5,
            7,
            7.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            3.64,
            3.64,
            3.64,
            3.64
        ],
        "thrust": 550,
        "centerDistance": 1055,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "名义速比6.50-8.00",
        "minPower": 1456,
        "maxPower": 4368,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHE44",
        "series": "GCHE",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            2,
            2.55,
            3,
            3.52,
            5.05,
            6.5,
            8
        ],
        "maxPower": 9600,
        "minPower": 3200,
        "powerSource": "传动能力计算",
        "price": 180000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            8,
            8,
            8,
            8,
            8,
            8,
            8
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCHE系列齿轮箱是GC系列的增强版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 700,
        "centerDistance": 1185
    },
    {
        "model": "GCHE5",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            6.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            0.57,
            0.57
        ],
        "thrust": 170,
        "centerDistance": 570,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 664820,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1026,
        "minPower": 228,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHE6",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            6.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            0.72,
            0.72
        ],
        "thrust": 200,
        "centerDistance": 615,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 760805,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1296,
        "minPower": 288,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHE9",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            6.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            0.96,
            0.96
        ],
        "thrust": 270,
        "centerDistance": 700,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 962000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1728,
        "minPower": 384,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHT108",
        "series": "GCHT",
        "minSpeed": 200,
        "maxSpeed": 800,
        "ratios": [
            3.5,
            3.95
        ],
        "maxPower": 9650,
        "minPower": 2413,
        "powerSource": "传动能力计算",
        "price": 200000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            12.063,
            12.063
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCHT系列齿轮箱是GC系列的特殊版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 1400,
        "centerDistance": 1230
    },
    {
        "model": "GCHT11",
        "series": "GCHT",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            4.52,
            5.04,
            5.52,
            5.95,
            6.5,
            8
        ],
        "maxPower": 12800,
        "minPower": 3200,
        "powerSource": "传动能力计算",
        "price": 200000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            8,
            8,
            8,
            8,
            8,
            8
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCHT系列齿轮箱是GC系列的特殊版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 220,
        "centerDistance": 570
    },
    {
        "model": "GCHT115",
        "series": "GC配变距桨",
        "minSpeed": 200,
        "maxSpeed": 650,
        "ratios": [
            4.5,
            5,
            5.5,
            6
        ],
        "transmissionCapacityPerRatio": [
            12.063,
            12.063,
            12.063,
            12.063
        ],
        "thrust": 1400,
        "centerDistance": 1260,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 2413,
        "maxPower": 7841,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHT135",
        "series": "GC配变距桨",
        "minSpeed": 200,
        "maxSpeed": 650,
        "ratios": [
            4.5,
            5,
            5.5,
            6
        ],
        "transmissionCapacityPerRatio": [
            14,
            14,
            14,
            14
        ],
        "thrust": 1400,
        "centerDistance": 1350,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 2800,
        "maxPower": 9100,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHT15",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            4.46,
            5.08,
            5.46,
            5.96
        ],
        "transmissionCapacityPerRatio": [
            1.64,
            1.64,
            1.64,
            1.64
        ],
        "thrust": 270,
        "centerDistance": 630,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 656,
        "maxPower": 2624,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHT170",
        "series": "GC配变距桨",
        "minSpeed": 200,
        "maxSpeed": 800,
        "ratios": [
            4.5,
            5,
            5.5,
            6
        ],
        "transmissionCapacityPerRatio": [
            17.5,
            17.5,
            17.5,
            17.5
        ],
        "thrust": 1400,
        "centerDistance": 1430,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 3500,
        "maxPower": 14000,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHT20",
        "series": "GC配变距桨",
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
        "thrust": 300,
        "centerDistance": 680,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 848,
        "maxPower": 2968,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHT26",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.58,
            5.04,
            5.59,
            5.95
        ],
        "transmissionCapacityPerRatio": [
            2.825,
            2.825,
            2.825,
            2.825
        ],
        "thrust": 360,
        "centerDistance": 750,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 1130,
        "maxPower": 3390,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHT33",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.54,
            5.04,
            5.6,
            5.95
        ],
        "transmissionCapacityPerRatio": [
            3.64,
            3.64,
            3.64,
            3.64
        ],
        "thrust": 540,
        "centerDistance": 820,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 1456,
        "maxPower": 4368,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHT44",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.52,
            5,
            5.57,
            5.96
        ],
        "transmissionCapacityPerRatio": [
            5.05,
            5.05,
            5.05,
            5.05
        ],
        "thrust": 600,
        "centerDistance": 924,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 2020,
        "maxPower": 6060,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHT5",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            4.5,
            5,
            5.55,
            5.95
        ],
        "transmissionCapacityPerRatio": [
            0.57,
            0.57,
            0.57,
            0.57
        ],
        "thrust": 120,
        "centerDistance": 445,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 436445,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1026,
        "minPower": 228,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHT6",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            4.5,
            5,
            5.55,
            5.95
        ],
        "transmissionCapacityPerRatio": [
            0.72,
            0.72,
            0.72,
            0.72
        ],
        "thrust": 170,
        "centerDistance": 480,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 494720,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1296,
        "minPower": 288,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHT66",
        "series": "GCHT",
        "minSpeed": 300,
        "maxSpeed": 900,
        "ratios": [
            1.94,
            2.54,
            3,
            3.95,
            4.48,
            4.96,
            5.43,
            6
        ],
        "maxPower": 7300,
        "minPower": 2433,
        "powerSource": "传动能力计算",
        "price": 200000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            8.111,
            8.111,
            8.111,
            8.111,
            8.111,
            8.111,
            8.111,
            8.111
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCHT系列齿轮箱是GC系列的特殊版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 1000,
        "centerDistance": 1064,
        "dimensions": "3609×2639×2370"
    },
    {
        "model": "GCHT77",
        "series": "GCHT",
        "minSpeed": 300,
        "maxSpeed": 900,
        "ratios": [
            1.97,
            2.47,
            3,
            3.52,
            3.95
        ],
        "maxPower": 10154,
        "minPower": 3385,
        "powerSource": "传动能力计算",
        "price": 200000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            11.282,
            11.282,
            11.282,
            11.282,
            11.282
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCHT系列齿轮箱是GC系列的特殊版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 1000,
        "centerDistance": 1100
    },
    {
        "model": "GCHT9",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            4.5,
            5,
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
        "centerDistance": 545,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 614645,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1728,
        "minPower": 384,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCHT91",
        "series": "GCHT",
        "minSpeed": 300,
        "maxSpeed": 800,
        "ratios": [
            2.52,
            3.08,
            3.43,
            4.1
        ],
        "maxPower": 9650,
        "minPower": 3619,
        "powerSource": "传动能力计算",
        "price": 200000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            12.063,
            12.063,
            12.063,
            12.063
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCHT系列齿轮箱是GC系列的特殊版本。",
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 1000,
        "centerDistance": 1190
    },
    {
        "model": "GCS1000",
        "series": "GC配变距桨",
        "minSpeed": 200,
        "maxSpeed": 800,
        "ratios": [
            2,
            2.54,
            2.96,
            3.5,
            3.95
        ],
        "transmissionCapacityPerRatio": [
            17.5,
            17.5,
            17.5,
            17.5,
            17.5
        ],
        "thrust": 1400,
        "centerDistance": 1018,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 3500,
        "maxPower": 14000,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCS320",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            1.97,
            2.52,
            2.96,
            3.52,
            4
        ],
        "transmissionCapacityPerRatio": [
            0.57,
            0.57,
            0.57,
            0.57,
            0.57
        ],
        "thrust": 100,
        "centerDistance": 320,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 264320,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1026,
        "minPower": 228,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCS350",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            2,
            2.56,
            3.03,
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
        "thrust": 113,
        "centerDistance": 350,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 300500,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1296,
        "minPower": 288,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCS390",
        "series": "GCS",
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
            0.96,
            0.96,
            0.96,
            0.96,
            0.96
        ],
        "thrust": 140,
        "centerDistance": 390,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 353780,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1728,
        "minPower": 384,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCS410",
        "series": "GCS",
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
            1.292,
            1.292,
            1.292,
            1.292,
            1.292
        ],
        "thrust": 175,
        "centerDistance": 410,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 382580,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2067,
        "minPower": 517,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCS450",
        "series": "GCS",
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
            1.64,
            1.64,
            1.64,
            1.64,
            1.64
        ],
        "thrust": 220,
        "centerDistance": 455,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 452645,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2624,
        "minPower": 656,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCS490",
        "series": "GC配变距桨",
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
            2.12,
            2.12,
            2.12,
            2.12,
            2.12
        ],
        "thrust": 270,
        "centerDistance": 490,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 848,
        "maxPower": 2968,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCS540",
        "series": "GC配变距桨",
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
            2.825,
            2.825,
            2.825,
            2.825,
            2.825
        ],
        "thrust": 290,
        "centerDistance": 540,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 1130,
        "maxPower": 3390,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCS590",
        "series": "GC配变距桨",
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
            3.64,
            3.64,
            3.64,
            3.64,
            3.64
        ],
        "thrust": 360,
        "centerDistance": 590,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 1456,
        "maxPower": 4368,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCS660",
        "series": "GC配变距桨",
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
            5.05,
            5.05,
            5.05,
            5.05,
            5.05
        ],
        "thrust": 540,
        "centerDistance": 668,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 2020,
        "maxPower": 6060,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCS700B",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            2,
            2.55,
            3,
            3.52,
            4,
            4.47
        ],
        "maxPower": 6516,
        "minPower": 2172,
        "powerSource": "传动能力计算",
        "price": 160000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            5.43,
            5.43,
            5.43,
            5.43,
            5.43,
            5.43
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 450,
        "centerDistance": 700
    },
    {
        "model": "GCS750",
        "series": "GCS",
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
            7.2,
            7.2,
            7.2,
            7.2,
            7.2
        ],
        "thrust": 730,
        "centerDistance": 750,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 1092500,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 6840,
        "minPower": 2160,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCS760",
        "series": "GCS",
        "minSpeed": 300,
        "maxSpeed": 900,
        "ratios": [
            1.94,
            2.54,
            3,
            3.53,
            3.95
        ],
        "transmissionCapacityPerRatio": [
            8.111,
            8.111,
            8.111,
            8.111,
            8.111
        ],
        "thrust": 750,
        "centerDistance": 768,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 1141683,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 7300,
        "minPower": 2433,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCS850",
        "series": "GCS",
        "minSpeed": 300,
        "maxSpeed": 800,
        "ratios": [
            1.97,
            2.47,
            3,
            3.52,
            3.95
        ],
        "transmissionCapacityPerRatio": [
            9.6,
            9.6,
            9.6,
            9.6,
            9.6
        ],
        "thrust": 800,
        "centerDistance": 855,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 1395845,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 7680,
        "minPower": 2880,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCS880",
        "series": "GCS",
        "minSpeed": 200,
        "maxSpeed": 650,
        "ratios": [
            3.5,
            3.95
        ],
        "maxPower": 7841,
        "minPower": 2413,
        "powerSource": "传动能力计算",
        "price": 160000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            12.063,
            12.063
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 1000,
        "centerDistance": 880
    },
    {
        "model": "GCS900",
        "series": "GCS",
        "minSpeed": 200,
        "maxSpeed": 800,
        "ratios": [
            2.52,
            3.08,
            3.43,
            4.1
        ],
        "maxPower": 9650,
        "minPower": 2413,
        "powerSource": "传动能力计算",
        "price": 160000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            12.063,
            12.063,
            12.063,
            12.063
        ],
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp",
        "thrust": 980,
        "centerDistance": 900
    },
    {
        "model": "GCS950",
        "series": "GC配变距桨",
        "minSpeed": 200,
        "maxSpeed": 650,
        "ratios": [
            2,
            2.54,
            2.96,
            3.5,
            3.95
        ],
        "transmissionCapacityPerRatio": [
            14,
            14,
            14,
            14,
            14
        ],
        "thrust": 1000,
        "centerDistance": 965,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 2800,
        "maxPower": 9100,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCSE11",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            6.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            1.292,
            1.292
        ],
        "thrust": 270,
        "centerDistance": 735,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 1052405,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2067,
        "minPower": 517,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCSE15",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            6.5,
            7,
            7.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            1.64,
            1.64,
            1.64,
            1.64
        ],
        "thrust": 300,
        "centerDistance": 810,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "名义速比6.50-8.00",
        "minPower": 656,
        "maxPower": 2624,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCSE20",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1400,
        "ratios": [
            6.5,
            7,
            7.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            2.12,
            2.12,
            2.12,
            2.12
        ],
        "thrust": 350,
        "centerDistance": 875,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "名义速比6.50-8.00",
        "minPower": 848,
        "maxPower": 2968,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCSE26",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            6.5,
            7,
            7.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            2.825,
            2.825,
            2.825,
            2.825
        ],
        "thrust": 450,
        "centerDistance": 960,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "名义速比6.50-8.00",
        "minPower": 1130,
        "maxPower": 3390,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCSE33",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            6.5,
            7,
            7.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            3.64,
            3.64,
            3.64,
            3.64
        ],
        "thrust": 550,
        "centerDistance": 1055,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "名义速比6.50-8.00",
        "minPower": 1456,
        "maxPower": 4368,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCSE44",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            6.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            5.05,
            5.05
        ],
        "thrust": 700,
        "centerDistance": 1185,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 2500000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 6060,
        "minPower": 2020,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCSE5",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            6.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            0.57,
            0.57
        ],
        "thrust": 170,
        "centerDistance": 570,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 664820,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1026,
        "minPower": 228,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCSE6",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            6.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            0.72,
            0.72
        ],
        "thrust": 200,
        "centerDistance": 615,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 760805,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1296,
        "minPower": 288,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCSE9",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            6.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            0.96,
            0.96
        ],
        "thrust": 270,
        "centerDistance": 700,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 962000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1728,
        "minPower": 384,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST108",
        "series": "GCS",
        "minSpeed": 200,
        "maxSpeed": 800,
        "ratios": [
            4.5,
            5,
            5.5,
            6
        ],
        "transmissionCapacityPerRatio": [
            11.282,
            11.282,
            11.282,
            11.282
        ],
        "thrust": 1400,
        "centerDistance": 1230,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 2500000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 9026,
        "minPower": 2256,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST11",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            4.52,
            5.04,
            5.52,
            5.95
        ],
        "transmissionCapacityPerRatio": [
            1.292,
            1.292,
            1.292,
            1.292
        ],
        "thrust": 220,
        "centerDistance": 570,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 664820,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2067,
        "minPower": 517,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST115",
        "series": "GC配变距桨",
        "minSpeed": 200,
        "maxSpeed": 650,
        "ratios": [
            4.5,
            5,
            5.5,
            6
        ],
        "transmissionCapacityPerRatio": [
            12.063,
            12.063,
            12.063,
            12.063
        ],
        "thrust": 1400,
        "centerDistance": 1260,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 2413,
        "maxPower": 7841,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST135",
        "series": "GC配变距桨",
        "minSpeed": 200,
        "maxSpeed": 650,
        "ratios": [
            4.5,
            5,
            5.5,
            6
        ],
        "transmissionCapacityPerRatio": [
            14,
            14,
            14,
            14
        ],
        "thrust": 1400,
        "centerDistance": 1350,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 2800,
        "maxPower": 9100,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST15",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            4.46,
            5.08,
            5.46,
            5.96
        ],
        "transmissionCapacityPerRatio": [
            1.64,
            1.64,
            1.64,
            1.64
        ],
        "thrust": 270,
        "centerDistance": 630,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 656,
        "maxPower": 2624,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST170",
        "series": "GC配变距桨",
        "minSpeed": 200,
        "maxSpeed": 800,
        "ratios": [
            4.5,
            5,
            5.5,
            6
        ],
        "transmissionCapacityPerRatio": [
            17.5,
            17.5,
            17.5,
            17.5
        ],
        "thrust": 1400,
        "centerDistance": 1430,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 3500,
        "maxPower": 14000,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST20",
        "series": "GC配变距桨",
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
        "thrust": 300,
        "centerDistance": 680,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 848,
        "maxPower": 2968,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST26",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.58,
            5.04,
            5.59,
            5.95
        ],
        "transmissionCapacityPerRatio": [
            2.825,
            2.825,
            2.825,
            2.825
        ],
        "thrust": 360,
        "centerDistance": 750,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 1130,
        "maxPower": 3390,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST33",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.54,
            5.04,
            5.6,
            5.95
        ],
        "transmissionCapacityPerRatio": [
            3.64,
            3.64,
            3.64,
            3.64
        ],
        "thrust": 540,
        "centerDistance": 820,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 1456,
        "maxPower": 4368,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST44",
        "series": "GC配变距桨",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.52,
            5,
            5.57,
            5.96
        ],
        "transmissionCapacityPerRatio": [
            5.05,
            5.05,
            5.05,
            5.05
        ],
        "thrust": 600,
        "centerDistance": 924,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 2020,
        "maxPower": 6060,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST5",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            4.5,
            5,
            5.55,
            5.95
        ],
        "transmissionCapacityPerRatio": [
            0.57,
            0.57,
            0.57,
            0.57
        ],
        "thrust": 120,
        "centerDistance": 445,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 436445,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1026,
        "minPower": 228,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST6",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            4.5,
            5,
            5.55,
            5.95
        ],
        "transmissionCapacityPerRatio": [
            0.72,
            0.72,
            0.72,
            0.72
        ],
        "thrust": 170,
        "centerDistance": 480,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 494720,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1296,
        "minPower": 288,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST66",
        "series": "GCS",
        "minSpeed": 300,
        "maxSpeed": 900,
        "ratios": [
            4.48,
            4.96,
            5.43,
            6
        ],
        "transmissionCapacityPerRatio": [
            7.2,
            7.2,
            7.2,
            7.2
        ],
        "thrust": 1000,
        "centerDistance": 1064,
        "dimensions": "3609×2639×2370",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 2117773,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 6480,
        "minPower": 2160,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST77",
        "series": "GCS",
        "minSpeed": 300,
        "maxSpeed": 900,
        "ratios": [
            4.55,
            5.56
        ],
        "transmissionCapacityPerRatio": [
            8.111,
            8.111
        ],
        "thrust": 1000,
        "centerDistance": 1100,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 2258000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 7300,
        "minPower": 2433,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST9",
        "series": "GCS",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            4.5,
            5,
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
        "centerDistance": 545,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 614645,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1728,
        "minPower": 384,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GCST91",
        "series": "GCS",
        "minSpeed": 300,
        "maxSpeed": 800,
        "ratios": [
            4.55,
            5.56
        ],
        "transmissionCapacityPerRatio": [
            9.6,
            9.6
        ],
        "thrust": 1000,
        "centerDistance": 1190,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 2500000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 7680,
        "minPower": 2880,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-gc.png",
        "introduction": "GCS系列齿轮箱是GC系列的标准版本。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#14寸"
            ],
            "domestic": [
                "φ640",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GC.webp"
    },
    {
        "model": "GWC20.34",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            2.04
        ],
        "transmissionCapacityPerRatio": [
            0.18
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 125
    },
    {
        "model": "GWC20.54",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            2.04
        ],
        "transmissionCapacityPerRatio": [
            0.22
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 148
    },
    {
        "model": "GWC26.58",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            2.6
        ],
        "transmissionCapacityPerRatio": [
            0.22
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 198
    },
    {
        "model": "GWC28.30",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 2000,
        "ratios": [
            2.06,
            2.51,
            3.08,
            3.54,
            4.05,
            4.54,
            5.09,
            5.59,
            6.14
        ],
        "transmissionCapacityPerRatio": [
            0.865,
            0.711,
            0.578,
            0.504,
            0.44,
            0.393,
            0.35,
            0.319,
            0.29
        ],
        "thrust": 80,
        "centerDistance": null,
        "dimensions": null,
        "weight": 1230,
        "controlType": "推拉软轴/电控/气控",
        "price": 72500,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 1730,
        "minPower": 116,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC28.30P",
        "series": "GW",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            2.55,
            3.04,
            3.52,
            4.55,
            6.02,
            7.97,
            9.26
        ],
        "maxPower": 25725,
        "minPower": 10290,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            10.29,
            10.29,
            10.29,
            10.29,
            10.29,
            10.29,
            10.29
        ],
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
        "image": "/images/gearbox/Advance-GWC.webp",
        "thrust": 80,
        "weight": 1230
    },
    {
        "model": "GWC30.32",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 2000,
        "ratios": [
            2.03,
            2.55,
            3.04,
            3.52,
            4,
            4.55,
            5.05,
            5.64,
            6.05
        ],
        "transmissionCapacityPerRatio": [
            1.122,
            0.894,
            0.75,
            0.647,
            0.57,
            0.501,
            0.451,
            0.404,
            0.376
        ],
        "thrust": 100,
        "centerDistance": null,
        "dimensions": "1433×1200×888",
        "weight": 1460,
        "controlType": "推拉软轴/电控/气控",
        "price": 90800,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 2244,
        "minPower": 150,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "inputInterfaces": {
            "sae": [
                "SAE1#14寸",
                "SAE1#8寸"
            ],
            "plainFlange": true,
            "domestic": [
                "φ405",
                "φ450"
            ]
        },
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC30.32P",
        "series": "GW",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            2.55,
            3.04,
            3.52,
            4.55,
            5.94,
            6.88,
            8.89,
            9.92
        ],
        "maxPower": 24800,
        "minPower": 9920,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            9.92,
            9.92,
            9.92,
            9.92,
            9.92,
            9.92,
            9.92,
            9.92
        ],
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "inputInterfaces": {
            "sae": [
                "SAE1#14寸",
                "SAE1#8寸"
            ],
            "plainFlange": true,
            "domestic": [
                "φ405",
                "φ450"
            ]
        },
        "image": "/images/gearbox/Advance-GWC.webp",
        "thrust": 100,
        "dimensions": "1433×1200×888",
        "weight": 1460
    },
    {
        "model": "GWC32.35",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 2000,
        "ratios": [
            2.06,
            2.54,
            3.02,
            3.58,
            4.05,
            4.59,
            5.09,
            5.57,
            6.08
        ],
        "transmissionCapacityPerRatio": [
            1.4175,
            1.1481,
            0.9659,
            0.816,
            0.72,
            0.6353,
            0.5733,
            0.5236,
            0.48
        ],
        "thrust": 120,
        "centerDistance": null,
        "dimensions": "1405×1240×920",
        "weight": 2490,
        "controlType": "推拉软轴/电控/气控",
        "price": 103800,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 2835,
        "minPower": 192,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "inputInterfaces": {
            "plainFlange": true,
            "boltPatterns": [
                "12-φ21",
                "12-φ25",
                "16-φ21"
            ],
            "sae": [
                "SAE1#14寸"
            ],
            "domestic": [
                "φ405",
                "φ450"
            ]
        },
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC32.35P",
        "series": "GW",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            2.54,
            3.02,
            3.58,
            4.05,
            4.59,
            5.96,
            6.93,
            8.11,
            9.04
        ],
        "maxPower": 25325,
        "minPower": 10130,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            10.13,
            10.13,
            10.13,
            10.13,
            10.13,
            10.13,
            10.13,
            10.13,
            10.13
        ],
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "inputInterfaces": {
            "plainFlange": true,
            "boltPatterns": [
                "12-φ21",
                "12-φ25",
                "16-φ21"
            ],
            "sae": [
                "SAE1#14寸"
            ],
            "domestic": [
                "φ405",
                "φ450"
            ]
        },
        "image": "/images/gearbox/Advance-GWC.webp",
        "thrust": 120,
        "dimensions": "1405×1240×920",
        "weight": 2490
    },
    {
        "model": "GWC36.39",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1900,
        "ratios": [
            1.97,
            2.45,
            2.98,
            3.47,
            3.95,
            4.4,
            5.01,
            5.47,
            5.97
        ],
        "transmissionCapacityPerRatio": [
            2.045,
            1.644,
            1.352,
            1.161,
            1.02,
            0.916,
            0.804,
            0.737,
            0.675
        ],
        "thrust": 140,
        "centerDistance": null,
        "dimensions": "1645×1331×1060",
        "weight": 3200,
        "controlType": "推拉软轴/电控/气控",
        "price": 123800,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 3886,
        "minPower": 270,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
                "16-φ21",
                "16-φ25"
            ],
            "domestic": [
                "φ405",
                "φ450"
            ]
        },
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC36.39P",
        "series": "GW",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            1.09,
            2.45,
            2.98,
            3.47,
            3.95,
            4.4,
            5.86,
            6.78,
            7.89,
            8.77,
            9.95
        ],
        "maxPower": 24875,
        "minPower": 9950,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            9.95,
            9.95,
            9.95,
            9.95,
            9.95,
            9.95,
            9.95,
            9.95,
            9.95,
            9.95,
            9.95
        ],
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
                "16-φ21",
                "16-φ25"
            ],
            "domestic": [
                "φ405",
                "φ450"
            ]
        },
        "image": "/images/gearbox/Advance-GWC.webp",
        "thrust": 140,
        "dimensions": "1645×1331×1060",
        "weight": 3200
    },
    {
        "model": "GWC36.58",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            3.42
        ],
        "transmissionCapacityPerRatio": [
            0.3
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 205
    },
    {
        "model": "GWC36.59",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            3.47
        ],
        "transmissionCapacityPerRatio": [
            0.38
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 270
    },
    {
        "model": "GWC39.41",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1700,
        "ratios": [
            1.98,
            2.47,
            3.05,
            3.48,
            4.05,
            4.48,
            5,
            5.51,
            5.99
        ],
        "transmissionCapacityPerRatio": [
            2.872,
            2.297,
            1.858,
            1.63,
            1.4,
            1.265,
            1.135,
            1.03,
            0.947
        ],
        "thrust": 175,
        "centerDistance": null,
        "dimensions": null,
        "weight": 3980,
        "controlType": "推拉软轴/电控/气控",
        "price": 153800,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 4882,
        "minPower": 379,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC39.41P",
        "series": "GW",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            1.26,
            2.47,
            3.05,
            3.48,
            4.05,
            4.48,
            5.93,
            6.95,
            7.75,
            8.69,
            9.79
        ],
        "maxPower": 24475,
        "minPower": 9790,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            9.79,
            9.79,
            9.79,
            9.79,
            9.79,
            9.79,
            9.79,
            9.79,
            9.79,
            9.79,
            9.79
        ],
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
        "image": "/images/gearbox/Advance-GWC.webp",
        "thrust": 175,
        "weight": 3980
    },
    {
        "model": "GWC42.45",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            2,
            2.55,
            3.02,
            3.58,
            4,
            4.47,
            5,
            5.6,
            5.93
        ],
        "transmissionCapacityPerRatio": [
            3.62,
            2.844,
            2.394,
            2.023,
            1.81,
            1.619,
            1.448,
            1.293,
            1.221
        ],
        "thrust": 220,
        "centerDistance": null,
        "dimensions": null,
        "weight": 4700,
        "controlType": "推拉软轴/电控/气控",
        "price": 185800,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 5792,
        "minPower": 488,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC42.45P",
        "series": "GW",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1.64,
            2.55,
            3.02,
            3.58,
            4,
            4.47,
            6.19,
            6.9,
            8.15,
            9.17
        ],
        "maxPower": 21756,
        "minPower": 10360,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            10.36,
            10.36,
            10.36,
            10.36,
            10.36,
            10.36,
            10.36,
            10.36,
            10.36,
            10.36
        ],
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
        "image": "/images/gearbox/Advance-GWC.webp",
        "thrust": 220,
        "weight": 4700
    },
    {
        "model": "GWC45.49",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            1.97,
            2.47,
            2.89,
            3.47,
            3.95,
            4.37,
            4.85,
            5.5,
            5.98
        ],
        "transmissionCapacityPerRatio": [
            4.46,
            3.568,
            3.041,
            2.54,
            2.23,
            2.012,
            1.815,
            1.6,
            1.471
        ],
        "thrust": 270,
        "centerDistance": null,
        "dimensions": null,
        "weight": 6030,
        "controlType": "推拉软轴/电控/气控",
        "price": 275800,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 7136,
        "minPower": 588,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "inputInterfaces": {
            "sae": [
                "SAE1#14寸",
                "SAE1#8寸",
                "SAE2#11.5寸",
                "SAE2#1寸"
            ],
            "domestic": [
                "φ450",
                "φ480",
                "φ530",
                "φ570",
                "φ608",
                "φ640",
                "φ755",
                "φ770",
                "φ820",
                "φ908"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "16-φ31"
            ]
        },
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC45.49P",
        "series": "GW",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            2.12,
            2.47,
            2.89,
            3.47,
            3.95,
            4.37,
            5.92,
            6.68,
            8.07,
            8.61,
            9.61
        ],
        "maxPower": 20181,
        "minPower": 9610,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            9.61,
            9.61,
            9.61,
            9.61,
            9.61,
            9.61,
            9.61,
            9.61,
            9.61,
            9.61,
            9.61
        ],
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "inputInterfaces": {
            "sae": [
                "SAE1#14寸",
                "SAE1#8寸",
                "SAE2#11.5寸",
                "SAE2#1寸"
            ],
            "domestic": [
                "φ450",
                "φ480",
                "φ530",
                "φ570",
                "φ608",
                "φ640",
                "φ755",
                "φ770",
                "φ820",
                "φ908"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "16-φ31"
            ]
        },
        "image": "/images/gearbox/Advance-GWC.webp",
        "thrust": 270,
        "weight": 6030
    },
    {
        "model": "GWC45.52",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1400,
        "ratios": [
            1.97,
            2.52,
            2.99,
            3.47,
            4.01,
            4.64,
            4.98,
            5.51,
            6.04
        ],
        "transmissionCapacityPerRatio": [
            4.845,
            3.815,
            3.185,
            2.748,
            2.435,
            2.146,
            1.915,
            1.73,
            1.609
        ],
        "thrust": 270,
        "centerDistance": null,
        "dimensions": "2056×1705×1300",
        "weight": 6500,
        "controlType": "推拉软轴/电控/气控",
        "price": 320000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 6783,
        "minPower": 644,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "inputInterfaces": {
            "sae": [
                "SAE1#14寸",
                "SAE1#8寸",
                "SAE2#11.5寸",
                "SAE2#1寸"
            ],
            "domestic": [
                "φ450",
                "φ480",
                "φ530",
                "φ570",
                "φ608",
                "φ640",
                "φ755",
                "φ770",
                "φ820",
                "φ908"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "16-φ31"
            ]
        },
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC46.59",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            4.47
        ],
        "transmissionCapacityPerRatio": [
            0.3
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 270
    },
    {
        "model": "GWC46.60",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            4.47
        ],
        "transmissionCapacityPerRatio": [
            0.42
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 355
    },
    {
        "model": "GWC49.54",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1400,
        "ratios": [
            1.94,
            2.46,
            2.92,
            3.45,
            3.95,
            4.53,
            4.91,
            5.48,
            6
        ],
        "transmissionCapacityPerRatio": [
            5.88,
            4.628,
            3.901,
            3.303,
            2.88,
            2.51,
            2.318,
            2.076,
            1.898
        ],
        "thrust": 290,
        "centerDistance": null,
        "dimensions": "2126×1989×1340",
        "weight": 7900,
        "controlType": "推拉软轴/电控/气控",
        "price": 402600,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 8232,
        "minPower": 759,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC49.54P",
        "series": "GW",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            2.46,
            2.92,
            3.45,
            3.95,
            4.53,
            5.93,
            7.11,
            8.08,
            8.73,
            9.88
        ],
        "maxPower": 20748,
        "minPower": 9880,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            9.88,
            9.88,
            9.88,
            9.88,
            9.88,
            9.88,
            9.88,
            9.88,
            9.88,
            9.88
        ],
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
        "image": "/images/gearbox/Advance-GWC.webp",
        "thrust": 290,
        "dimensions": "2126×1989×1340",
        "weight": 7900
    },
    {
        "model": "GWC49.59",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            2.03,
            2.49,
            3.04,
            3.49,
            4,
            4.48,
            5.01,
            5.51,
            6.01
        ],
        "transmissionCapacityPerRatio": [
            6.409,
            5.226,
            4.288,
            3.735,
            3.26,
            2.913,
            2.603,
            2.366,
            2.171
        ],
        "thrust": 290,
        "centerDistance": null,
        "dimensions": null,
        "weight": 8500,
        "controlType": "推拉软轴/电控/气控",
        "price": 460000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 7691,
        "minPower": 868,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC52.59",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            1.93,
            2.48,
            2.96,
            3.53,
            3.95,
            4.43,
            4.97,
            5.4,
            5.93
        ],
        "transmissionCapacityPerRatio": [
            7.779,
            6.063,
            5.076,
            4.268,
            3.807,
            3.395,
            3.026,
            2.785,
            2.538
        ],
        "thrust": 300,
        "centerDistance": null,
        "dimensions": "2291×1400×1290",
        "weight": 10700,
        "controlType": "推拉软轴/电控/气控",
        "price": 545000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 9335,
        "minPower": 1015,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "inputInterfaces": {
            "domestic": [
                "φ1025",
                "φ570",
                "φ640",
                "φ770",
                "φ820",
                "φ908",
                "φ950"
            ],
            "plainFlange": true,
            "sae": [
                "SAE2#11.5寸"
            ]
        },
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC52.59P",
        "series": "混合动力",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1.93,
            2.48,
            2.96,
            3.53,
            3.95,
            4.43,
            4.97,
            5.4,
            5.93
        ],
        "transmissionCapacityPerRatio": [
            7.438,
            5.797,
            4.853,
            4.081,
            3.64,
            3.246,
            2.893,
            2.663,
            2.426
        ],
        "thrust": 300,
        "centerDistance": 360,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "混合动力齿轮箱，支持柴电双动力输入",
        "minPower": 2426,
        "maxPower": 15620,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GWC.webp",
        "dimensions": "2291×1400×1290",
        "weight": 10700
    },
    {
        "model": "GWC52.62",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            2.02,
            2.46,
            3.02,
            3.45,
            4.06,
            4.52,
            5.04,
            5.46,
            5.95,
            6.49,
            6.94
        ],
        "thrust": 300,
        "centerDistance": 300,
        "maxPower": 9358,
        "minPower": 908,
        "powerSource": "传动能力计算",
        "price": 575000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            7.798,
            6.404,
            5.216,
            4.566,
            3.88,
            3.485,
            3.126,
            2.885,
            2.648,
            2.427,
            2.27
        ],
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "inputInterfaces": {
            "domestic": [
                "φ1025",
                "φ570",
                "φ640",
                "φ770",
                "φ820",
                "φ908",
                "φ950"
            ],
            "plainFlange": true,
            "sae": [
                "SAE2#11.5寸"
            ]
        },
        "weight": 11000,
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC52.62GWL52.62",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 565,
        "ratios": [
            2.02,
            2.46,
            3.02,
            3.45,
            4.06,
            4.52,
            5.04,
            5.46,
            5.95,
            6.49,
            6.94
        ],
        "transmissionCapacityPerRatio": [
            7.798,
            6.404,
            5.216,
            4.566,
            3.88,
            3.485,
            3.126,
            2.885,
            2.648,
            2.427,
            2.27
        ],
        "thrust": 300,
        "centerDistance": 119,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 908,
        "maxPower": 4406,
        "powerSource": "传动能力计算"
    },
    {
        "model": "GWC56.61",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            5.63
        ],
        "transmissionCapacityPerRatio": [
            0.42
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 360
    },
    {
        "model": "GWC60.66",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            2.01,
            2.5,
            3.07,
            3.57,
            4.05,
            4.48,
            5.08,
            5.51,
            6.12,
            6.52,
            6.97
        ],
        "transmissionCapacityPerRatio": [
            10.026,
            8.073,
            6.567,
            5.645,
            4.98,
            4.5,
            3.973,
            3.664,
            3.299,
            3.06,
            3
        ],
        "thrust": 450,
        "centerDistance": null,
        "dimensions": null,
        "weight": 14690,
        "controlType": "推拉软轴/电控/气控",
        "price": 800000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 12031,
        "minPower": 1200,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "inputInterfaces": {
            "domestic": [
                "φ1025",
                "φ1110",
                "φ650",
                "φ770",
                "φ908"
            ],
            "plainFlange": true
        },
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC60.66P",
        "series": "混合动力",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            2.01,
            2.5,
            3.07,
            3.57,
            4.05,
            4.48,
            5.08,
            5.51,
            6.12,
            6.52,
            6.97
        ],
        "transmissionCapacityPerRatio": [
            9.913,
            7.982,
            6.492,
            5.581,
            4.923,
            4.448,
            3.927,
            3.622,
            3.261,
            3.06,
            3
        ],
        "thrust": 450,
        "centerDistance": 540,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "混合动力齿轮箱，支持柴电双动力输入",
        "minPower": 3000,
        "maxPower": 20817,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GWC.webp",
        "weight": 14690
    },
    {
        "model": "GWC60.74",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            1.99,
            2.53,
            3.06,
            3.51,
            4.02,
            4.5,
            5.04,
            5.51,
            6.04,
            6.5,
            6.94
        ],
        "transmissionCapacityPerRatio": [
            11.6,
            9.344,
            7.723,
            6.726,
            5.87,
            5.246,
            4.688,
            4.282,
            3.909,
            3.632,
            3.4
        ],
        "thrust": 550,
        "centerDistance": null,
        "dimensions": "2540×1855×1736",
        "weight": 16600,
        "controlType": "推拉软轴/电控/气控",
        "price": 920000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 13920,
        "minPower": 1360,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "inputInterfaces": {
            "domestic": [
                "φ1025",
                "φ1110",
                "φ650",
                "φ770",
                "φ908"
            ],
            "plainFlange": true
        },
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC61.65",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            6.13
        ],
        "transmissionCapacityPerRatio": [
            0.55
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 560
    },
    {
        "model": "GWC63.71",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 1200,
        "ratios": [
            2.01,
            2.51,
            3.03,
            3.45,
            4.11,
            4.55,
            5.04,
            5.47,
            5.95,
            6.48,
            6.96,
            7.48
        ],
        "transmissionCapacityPerRatio": [
            13.148,
            10.535,
            8.725,
            7.67,
            6.45,
            5.818,
            5.256,
            4.837,
            4.448,
            4.243,
            3.954,
            3.678
        ],
        "thrust": 710,
        "centerDistance": null,
        "dimensions": "2645×2381×1740",
        "weight": 17500,
        "controlType": "推拉软轴/电控/气控",
        "price": 950000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 15778,
        "minPower": 1103,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC63.71P",
        "series": "混合动力",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            2.01,
            2.51,
            3.03,
            3.45,
            4.11,
            4.55,
            5.04,
            5.47,
            5.95,
            6.48,
            6.96,
            7.48
        ],
        "transmissionCapacityPerRatio": [
            12.23,
            9.8,
            8.117,
            7.135,
            6,
            5.411,
            4.888,
            4.5,
            4.137,
            3.8,
            3.541,
            3.294
        ],
        "thrust": 710,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "混合动力齿轮箱，支持柴电双动力输入",
        "minPower": 3294,
        "maxPower": 25683,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GWC.webp",
        "dimensions": "2645×2381×1740",
        "weight": 17500
    },
    {
        "model": "GWC66.75",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 950,
        "ratios": [
            2.05,
            2.55,
            2.99,
            3.48,
            3.95,
            4.49,
            4.97,
            5.51,
            6.12,
            6.59,
            6.95
        ],
        "transmissionCapacityPerRatio": [
            14.406,
            11.582,
            9.9,
            8.491,
            7.48,
            6.59,
            5.95,
            5.366,
            4.831,
            4.488,
            4.253
        ],
        "thrust": 730,
        "centerDistance": null,
        "dimensions": null,
        "weight": 20500,
        "controlType": "推拉软轴/电控/气控",
        "price": 1050000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 13686,
        "minPower": 1276,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC70.76",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 950,
        "ratios": [
            2.05,
            2.53,
            3.09,
            3.58,
            3.95,
            4.57,
            5.05,
            5.58,
            5.77,
            6.17,
            6.54,
            6.94
        ],
        "transmissionCapacityPerRatio": [
            15.718,
            12.734,
            10.414,
            8.986,
            8.15,
            7.039,
            6.378,
            5.773,
            5.562,
            5.216,
            4.934,
            4.5
        ],
        "thrust": 750,
        "centerDistance": null,
        "dimensions": null,
        "weight": 22500,
        "controlType": "推拉软轴/电控/气控",
        "price": 1100000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 14932,
        "minPower": 1350,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC70.82",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 465,
        "ratios": [
            2.05,
            2.53,
            3.09,
            3.58,
            3.95,
            4.57
        ],
        "thrust": 780,
        "centerDistance": 780,
        "maxPower": 8205,
        "minPower": 2371,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            17.646,
            14.297,
            11.692,
            10.088,
            9.15,
            7.902
        ],
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "dimensions": "2876×2151×1970",
        "inputInterfaces": {
            "domestic": [
                "φ1025",
                "φ1110",
                "φ650",
                "φ770",
                "φ908"
            ]
        },
        "weight": 23000,
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC70.82GWL70.82",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 465,
        "ratios": [
            2.05,
            2.53,
            3.09,
            3.58,
            3.95,
            4.57,
            5.04,
            5.58,
            6.17,
            6.5,
            6.98,
            7.49
        ],
        "transmissionCapacityPerRatio": [
            17.646,
            14.297,
            11.692,
            10.088,
            9.15,
            7.902,
            7.161,
            6.481,
            5.878,
            5.57,
            5.193,
            4.84
        ],
        "thrust": 780,
        "centerDistance": 2320,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 26,
        "maxPower": 4255,
        "powerSource": "传动能力计算"
    },
    {
        "model": "GWC70.85",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 425,
        "ratios": [
            1.98,
            2.45,
            3.01,
            3.49,
            3.95
        ],
        "thrust": 800,
        "centerDistance": 800,
        "maxPower": 9112,
        "minPower": 3216,
        "powerSource": "传动能力计算",
        "price": 1470000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            21.441,
            17.291,
            14.089,
            12.131,
            10.72
        ],
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
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
        "weight": 27000,
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC75.90",
        "series": "GW",
        "minSpeed": 200,
        "maxSpeed": 465,
        "ratios": [
            2.01,
            2.51,
            3.01,
            3.51,
            4
        ],
        "thrust": 980,
        "centerDistance": null,
        "maxPower": 10427,
        "minPower": 2256,
        "powerSource": "传动能力计算",
        "price": 1800000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            22.423,
            17.966,
            15,
            12.833,
            11.282
        ],
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "dimensions": "3000×2828×2120",
        "inputInterfaces": {
            "domestic": [
                "φ1025",
                "φ1110",
                "φ650",
                "φ770",
                "φ908"
            ]
        },
        "weight": 34000,
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC75.90GWL75.90",
        "series": "GW",
        "minSpeed": 200,
        "maxSpeed": 465,
        "ratios": [
            2.01,
            2.51,
            3.01,
            3.51,
            4,
            4.43,
            5.04,
            5.47,
            6.02,
            6.51,
            6.99
        ],
        "transmissionCapacityPerRatio": [
            22.423,
            17.966,
            15,
            12.833,
            11.282,
            10.171,
            8.945,
            8.239,
            7.485,
            6.922,
            6.448
        ],
        "thrust": 980,
        "centerDistance": 3431,
        "source": "杭齿厂选型手册2025版5月版",
        "minPower": 200,
        "maxPower": 3704,
        "powerSource": "传动能力计算"
    },
    {
        "model": "GWC78.88",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 950,
        "ratios": [
            2.04,
            2.49,
            2.98,
            3.48,
            3.95,
            4.49,
            5.01,
            5.47,
            6.09
        ],
        "transmissionCapacityPerRatio": [
            23.372,
            19.099,
            15.983,
            13.708,
            12.063,
            10.615,
            9.511,
            8.712,
            7.83
        ],
        "thrust": 1000,
        "centerDistance": null,
        "dimensions": "3135×2945×2158",
        "weight": 35000,
        "controlType": "推拉软轴/电控/气控",
        "price": 1670000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 22203,
        "minPower": 2349,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "inputInterfaces": {
            "plainFlange": true,
            "boltPatterns": [
                "12-φ45"
            ],
            "domestic": [
                "φ1025",
                "φ1110",
                "φ650",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC78.96",
        "series": "GW",
        "minSpeed": 200,
        "maxSpeed": 900,
        "ratios": [
            4.97,
            5.46,
            6,
            6.47,
            6.93,
            7.5,
            8
        ],
        "transmissionCapacityPerRatio": [
            11.78,
            10.72,
            9.75,
            9.04,
            8.4,
            7.8,
            7.31
        ],
        "thrust": 1100,
        "centerDistance": 38,
        "dimensions": null,
        "weight": 38000,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 1630000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 10602,
        "minPower": 1462,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "inputInterfaces": {
            "plainFlange": true,
            "boltPatterns": [
                "12-φ45"
            ],
            "domestic": [
                "φ1025",
                "φ1110",
                "φ650",
                "φ770",
                "φ908"
            ]
        },
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC80.95",
        "series": "GW",
        "minSpeed": 200,
        "maxSpeed": 800,
        "ratios": [
            1.98,
            2.49,
            2.94,
            3.46,
            3.95,
            4.51,
            5.03,
            5.48,
            5.93
        ],
        "transmissionCapacityPerRatio": [
            28,
            22.2,
            18.81,
            16,
            14,
            12.25,
            11,
            10.09,
            9.33
        ],
        "thrust": 1200,
        "centerDistance": null,
        "dimensions": null,
        "weight": 40000,
        "controlType": "推拉软轴/电控/气控",
        "price": 2000000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 22400,
        "minPower": 1866,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWC85.100",
        "series": "GW",
        "minSpeed": 150,
        "maxSpeed": 1425,
        "ratios": [
            1.98,
            2.55,
            2.98,
            3.48,
            3.95,
            4.48,
            4.97,
            5.51,
            5.99,
            6.45,
            7.05
        ],
        "transmissionCapacityPerRatio": [
            35,
            27.429,
            23.445,
            20.108,
            17.5,
            15.605,
            14.091,
            12.708,
            11.684,
            10.845,
            9.92
        ],
        "thrust": 1400,
        "centerDistance": null,
        "dimensions": null,
        "weight": 56500,
        "controlType": "推拉软轴/电控/气控",
        "price": 2500000,
        "discountRate": 0.1,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 49875,
        "minPower": 1488,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWC.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "image": "/images/gearbox/Advance-GWC.webp"
    },
    {
        "model": "GWCD26.70",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            2.7
        ],
        "transmissionCapacityPerRatio": [
            0.6
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 495
    },
    {
        "model": "GWCD36.70",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            3.75
        ],
        "transmissionCapacityPerRatio": [
            0.7
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 550
    },
    {
        "model": "GWCD46.71",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            4.92
        ],
        "transmissionCapacityPerRatio": [
            0.8
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 600
    },
    {
        "model": "GWCD56.72",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            5.71
        ],
        "transmissionCapacityPerRatio": [
            0.85
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 700
    },
    {
        "model": "GWCD67.80",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            6.54
        ],
        "transmissionCapacityPerRatio": [
            0.9
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 850
    },
    {
        "model": "GWCD79.85",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            7.92
        ],
        "transmissionCapacityPerRatio": [
            0.95
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 970
    },
    {
        "model": "GWCD90.100",
        "series": "GW",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            9.4
        ],
        "transmissionCapacityPerRatio": [
            1.1
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 1350
    },
    {
        "model": "GWD28.30",
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
        "thrust": 80,
        "centerDistance": 100,
        "maxPower": 792,
        "minPower": 176,
        "powerSource": "传动能力计算",
        "price": 68875,
        "discountRate": 0.1,
        "priceSource": "GWC28.30×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.44,
            0.44,
            0.44,
            0.44,
            0.44
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 1230,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD30.32A",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            1.97,
            2.52,
            2.96,
            3.52,
            4
        ],
        "thrust": 100,
        "centerDistance": 100,
        "maxPower": 1026,
        "minPower": 208,
        "powerSource": "传动能力计算",
        "price": 86260,
        "discountRate": 0.1,
        "priceSource": "GWC30.32×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.57,
            0.57,
            0.57,
            0.56,
            0.52
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 1350,
        "image": "/images/gearbox/Advance-GWD.webp",
        "dimensions": "1433×1200×888"
    },
    {
        "model": "GWD32.35",
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
        "thrust": 120,
        "centerDistance": 120,
        "maxPower": 1296,
        "minPower": 288,
        "powerSource": "传动能力计算",
        "price": 98610,
        "discountRate": 0.1,
        "priceSource": "GWC32.35×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.72,
            0.72,
            0.72,
            0.72,
            0.72
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 2080,
        "image": "/images/gearbox/Advance-GWD.webp",
        "dimensions": "1405×1240×920"
    },
    {
        "model": "GWD36.39",
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
        "thrust": 140,
        "centerDistance": 140,
        "maxPower": 1836,
        "minPower": 408,
        "powerSource": "传动能力计算",
        "price": 117610,
        "discountRate": 0.1,
        "priceSource": "GWC36.39×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.02,
            1.02,
            1.02,
            1.02,
            1.02
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 2450,
        "image": "/images/gearbox/Advance-GWD.webp",
        "dimensions": "1645×1331×1060"
    },
    {
        "model": "GWD36.54",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            4.46,
            4.95,
            5.55,
            5.95
        ],
        "thrust": 220,
        "centerDistance": 220,
        "maxPower": 1728,
        "minPower": 384,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.96,
            0.96,
            0.96,
            0.96
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 2960,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD39.41",
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
        "thrust": 175,
        "centerDistance": 175,
        "maxPower": 2240,
        "minPower": 560,
        "powerSource": "传动能力计算",
        "price": 146110,
        "discountRate": 0.1,
        "priceSource": "GWC39.41×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.4,
            1.4,
            1.4,
            1.4,
            1.4
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
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
        "weight": 2960,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD39.57",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            4.52,
            5.04,
            5.52,
            5.95
        ],
        "thrust": 270,
        "centerDistance": 270,
        "maxPower": 2064,
        "minPower": 516,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.29,
            1.29,
            1.29,
            1.29
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
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
        "weight": 3630,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD42.45",
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
        "thrust": 220,
        "centerDistance": 220,
        "maxPower": 2896,
        "minPower": 724,
        "powerSource": "传动能力计算",
        "price": 176510,
        "discountRate": 0.1,
        "priceSource": "GWC42.45×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.81,
            1.81,
            1.81,
            1.81,
            1.81
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 3630,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD42.63",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            4.46,
            5.08,
            5.46,
            5.95
        ],
        "thrust": 290,
        "centerDistance": 290,
        "maxPower": 2624,
        "minPower": 656,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.64,
            1.64,
            1.64,
            1.64
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 5560,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD45.49",
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
        "thrust": 270,
        "centerDistance": 270,
        "maxPower": 3122,
        "minPower": 892,
        "powerSource": "传动能力计算",
        "price": 262010,
        "discountRate": 0.1,
        "priceSource": "GWC45.49×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.23,
            2.23,
            2.23,
            2.23,
            2.23
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 5560,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD45.68",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1400,
        "ratios": [
            4.5,
            5,
            5.55,
            5.95
        ],
        "thrust": 360,
        "centerDistance": 360,
        "maxPower": 2968,
        "minPower": 848,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.12,
            2.12,
            2.12,
            2.12
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 7300,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD49.54",
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
        "thrust": 290,
        "centerDistance": 290,
        "maxPower": 3912,
        "minPower": 1304,
        "powerSource": "传动能力计算",
        "price": 382470,
        "discountRate": 0.1,
        "priceSource": "GWC49.54×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            3.26,
            3.26,
            3.26,
            3.26,
            3.26
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 7300,
        "image": "/images/gearbox/Advance-GWD.webp",
        "dimensions": "2126×1989×1340"
    },
    {
        "model": "GWD49.74",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.58,
            5.04,
            5.59,
            5.95
        ],
        "thrust": 540,
        "centerDistance": 540,
        "maxPower": 3396,
        "minPower": 1132,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.83,
            2.83,
            2.83,
            2.83
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 8900,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD52.59",
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
        "thrust": 300,
        "centerDistance": 300,
        "maxPower": 4568,
        "minPower": 1523,
        "powerSource": "传动能力计算",
        "price": 517750,
        "discountRate": 0.1,
        "priceSource": "GWC52.59×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            3.8067,
            3.8067,
            3.8067,
            3.8067,
            3.8067
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 8900,
        "image": "/images/gearbox/Advance-GWD.webp",
        "dimensions": "2291×1400×1290"
    },
    {
        "model": "GWD52.82",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.58,
            5.04,
            5.59,
            5.95
        ],
        "thrust": 710,
        "centerDistance": 710,
        "maxPower": 4368,
        "minPower": 1456,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            3.64,
            3.64,
            3.64,
            3.64
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 14000,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD60.66",
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
        "thrust": 450,
        "centerDistance": 450,
        "maxPower": 6108,
        "minPower": 2036,
        "powerSource": "传动能力计算",
        "price": 760000,
        "discountRate": 0.1,
        "priceSource": "GWC60.66×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            5.09,
            5.09,
            5.09,
            5.09,
            5.09
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 14000,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD60.92",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.52,
            5.04,
            5.52,
            5.95
        ],
        "thrust": 750,
        "centerDistance": 750,
        "maxPower": 6060,
        "minPower": 2020,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            5.05,
            5.05,
            5.05,
            5.05
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD63.71",
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
        "thrust": 710,
        "centerDistance": 710,
        "maxPower": 6450,
        "minPower": 1935,
        "powerSource": "传动能力计算",
        "price": 902500,
        "discountRate": 0.1,
        "priceSource": "GWC63.71×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            6.45,
            6.45,
            6.45,
            6.45,
            6.45
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWD.webp",
        "dimensions": "2645×2381×1740"
    },
    {
        "model": "GWD63.95",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1000,
        "ratios": [
            4.5,
            5,
            5.55,
            5.95
        ],
        "thrust": 800,
        "centerDistance": 800,
        "maxPower": 6000,
        "minPower": 2400,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            6,
            6,
            6,
            6
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD66.106",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 950,
        "ratios": [
            4.52,
            4.96,
            5.48,
            6.05
        ],
        "maxPower": 6840,
        "minPower": 2880,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            7.2,
            7.2,
            7.2,
            7.2
        ],
        "imageUrl": "/images/gearbox/06-16A-26.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWD.webp",
        "thrust": 980
    },
    {
        "model": "GWD66.75",
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
        "thrust": 730,
        "centerDistance": 730,
        "maxPower": 7106,
        "minPower": 2244,
        "powerSource": "传动能力计算",
        "price": 997500,
        "discountRate": 0.1,
        "priceSource": "GWC66.75×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            7.48,
            7.48,
            7.48,
            7.48,
            7.48
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 19000,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD70.111",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 900,
        "ratios": [
            4.58,
            5.04,
            5.59,
            5.95
        ],
        "maxPower": 7299,
        "minPower": 3244,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            8.11,
            8.11,
            8.11,
            8.11
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWD.webp",
        "thrust": 1200
    },
    {
        "model": "GWD70.76",
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
        "thrust": 750,
        "centerDistance": 750,
        "maxPower": 7335,
        "minPower": 2445,
        "powerSource": "传动能力计算",
        "price": 1045000,
        "discountRate": 0.1,
        "priceSource": "GWC70.76×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            8.15,
            8.15,
            8.15,
            8.15,
            8.15
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 21500,
        "image": "/images/gearbox/Advance-GWD.webp"
    },
    {
        "model": "GWD70.82",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 900,
        "ratios": [
            1.94,
            2.54,
            3,
            3.5,
            3.95,
            4.25
        ],
        "thrust": 780,
        "centerDistance": 780,
        "maxPower": 8235,
        "minPower": 2520,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            9.15,
            9.15,
            9.15,
            9.15,
            9.15,
            8.4
        ],
        "imageUrl": "/images/gearbox/Advance-GWD.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 8400,
        "image": "/images/gearbox/Advance-GWD.webp",
        "dimensions": "2876×2151×1970"
    },
    {
        "model": "GWH28.30",
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
        "thrust": 80,
        "centerDistance": 100,
        "maxPower": 792,
        "minPower": 176,
        "powerSource": "传动能力计算",
        "price": 68875,
        "discountRate": 0.1,
        "priceSource": "GWC28.30×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.44,
            0.44,
            0.44,
            0.44,
            0.44
        ],
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 1230,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH30.32A",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            1.97,
            2.52,
            2.96,
            3.52,
            4
        ],
        "maxPower": 1026,
        "minPower": 208,
        "powerSource": "传动能力计算",
        "price": 86260,
        "discountRate": 0.1,
        "priceSource": "GWC30.32×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.57,
            0.57,
            0.57,
            0.56,
            0.52
        ],
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 1350,
        "image": "/images/gearbox/Advance-GWH.webp",
        "dimensions": "1433×1200×888",
        "thrust": 100
    },
    {
        "model": "GWH32.35",
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
        "thrust": 120,
        "centerDistance": 120,
        "maxPower": 1296,
        "minPower": 288,
        "powerSource": "传动能力计算",
        "price": 98610,
        "discountRate": 0.1,
        "priceSource": "GWC32.35×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.72,
            0.72,
            0.72,
            0.72,
            0.72
        ],
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 2080,
        "image": "/images/gearbox/Advance-GWH.webp",
        "dimensions": "1405×1240×920"
    },
    {
        "model": "GWH36.39",
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
        "thrust": 140,
        "centerDistance": 140,
        "maxPower": 1836,
        "minPower": 408,
        "powerSource": "传动能力计算",
        "price": 117610,
        "discountRate": 0.1,
        "priceSource": "GWC36.39×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.02,
            1.02,
            1.02,
            1.02,
            1.02
        ],
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 2450,
        "image": "/images/gearbox/Advance-GWH.webp",
        "dimensions": "1645×1331×1060"
    },
    {
        "model": "GWH36.54",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            4.46,
            4.95,
            5.55,
            5.95
        ],
        "thrust": 220,
        "centerDistance": 220,
        "maxPower": 1728,
        "minPower": 384,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.96,
            0.96,
            0.96,
            0.96
        ],
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 2960,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH39.41",
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
        "thrust": 175,
        "centerDistance": 175,
        "maxPower": 2240,
        "minPower": 560,
        "powerSource": "传动能力计算",
        "price": 146110,
        "discountRate": 0.1,
        "priceSource": "GWC39.41×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.4,
            1.4,
            1.4,
            1.4,
            1.4
        ],
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
        "weight": 2960,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH39.57",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            4.52,
            5.04,
            5.52,
            5.95
        ],
        "thrust": 270,
        "centerDistance": 270,
        "maxPower": 2064,
        "minPower": 516,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.29,
            1.29,
            1.29,
            1.29
        ],
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
        "weight": 3630,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH42.45",
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
        "thrust": 220,
        "centerDistance": 220,
        "maxPower": 2896,
        "minPower": 724,
        "powerSource": "传动能力计算",
        "price": 176510,
        "discountRate": 0.1,
        "priceSource": "GWC42.45×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.81,
            1.81,
            1.81,
            1.81,
            1.81
        ],
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
        "weight": 3630,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH42.63",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            4.46,
            5.08,
            5.46,
            5.95
        ],
        "thrust": 290,
        "centerDistance": 290,
        "maxPower": 2624,
        "minPower": 656,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.64,
            1.64,
            1.64,
            1.64
        ],
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
        "weight": 5560,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH45.49",
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
        "thrust": 270,
        "centerDistance": 270,
        "maxPower": 3122,
        "minPower": 892,
        "powerSource": "传动能力计算",
        "price": 262010,
        "discountRate": 0.1,
        "priceSource": "GWC45.49×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.23,
            2.23,
            2.23,
            2.23,
            2.23
        ],
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
        "weight": 5560,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH45.68B",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1400,
        "ratios": [
            4.5,
            5,
            5.55,
            5.95
        ],
        "thrust": 360,
        "centerDistance": 360,
        "maxPower": 2968,
        "minPower": 848,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.12,
            2.12,
            2.12,
            2.12
        ],
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
        "weight": 7300,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH49.54",
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
        "thrust": 290,
        "centerDistance": 290,
        "maxPower": 3912,
        "minPower": 1304,
        "powerSource": "传动能力计算",
        "price": 382470,
        "discountRate": 0.1,
        "priceSource": "GWC49.54×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            3.26,
            3.26,
            3.26,
            3.26,
            3.26
        ],
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
        "weight": 7300,
        "image": "/images/gearbox/Advance-GWH.webp",
        "dimensions": "2126×1989×1340"
    },
    {
        "model": "GWH49.74",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.58,
            5.04,
            5.59,
            5.95
        ],
        "thrust": 540,
        "centerDistance": 540,
        "maxPower": 3396,
        "minPower": 1132,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.83,
            2.83,
            2.83,
            2.83
        ],
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
        "weight": 8900,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH52.59",
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
        "thrust": 300,
        "centerDistance": 300,
        "maxPower": 4568,
        "minPower": 1523,
        "powerSource": "传动能力计算",
        "price": 517750,
        "discountRate": 0.1,
        "priceSource": "GWC52.59×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            3.8067,
            3.8067,
            3.8067,
            3.8067,
            3.8067
        ],
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
        "weight": 8900,
        "image": "/images/gearbox/Advance-GWH.webp",
        "dimensions": "2291×1400×1290"
    },
    {
        "model": "GWH52.82",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.58,
            5.04,
            5.59,
            5.95
        ],
        "thrust": 710,
        "centerDistance": 710,
        "maxPower": 4368,
        "minPower": 1456,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            3.64,
            3.64,
            3.64,
            3.64
        ],
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
        "weight": 14000,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH60.66",
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
        "thrust": 450,
        "centerDistance": 450,
        "maxPower": 6108,
        "minPower": 2036,
        "powerSource": "传动能力计算",
        "price": 760000,
        "discountRate": 0.1,
        "priceSource": "GWC60.66×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            5.09,
            5.09,
            5.09,
            5.09,
            5.09
        ],
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 14000,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH60.92",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.52,
            5.04,
            5.52,
            5.95
        ],
        "thrust": 750,
        "centerDistance": 750,
        "maxPower": 6060,
        "minPower": 2020,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            5.05,
            5.05,
            5.05,
            5.05
        ],
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH63.71",
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
        "thrust": 710,
        "centerDistance": 710,
        "maxPower": 6450,
        "minPower": 1935,
        "powerSource": "传动能力计算",
        "price": 902500,
        "discountRate": 0.1,
        "priceSource": "GWC63.71×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            6.45,
            6.45,
            6.45,
            6.45,
            6.45
        ],
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWH.webp",
        "dimensions": "2645×2381×1740"
    },
    {
        "model": "GWH63.95",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1000,
        "ratios": [
            4.5,
            5,
            5.55,
            5.95
        ],
        "thrust": 800,
        "centerDistance": 800,
        "maxPower": 6000,
        "minPower": 2400,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            6,
            6,
            6,
            6
        ],
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH66.106",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 950,
        "ratios": [
            4.52,
            4.96,
            5.48,
            6.05
        ],
        "maxPower": 6840,
        "minPower": 2880,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            7.2,
            7.2,
            7.2,
            7.2
        ],
        "imageUrl": "/images/gearbox/06-16A-26.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWH.webp",
        "thrust": 980
    },
    {
        "model": "GWH66.75",
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
        "thrust": 730,
        "centerDistance": 730,
        "maxPower": 7106,
        "minPower": 2244,
        "powerSource": "传动能力计算",
        "price": 997500,
        "discountRate": 0.1,
        "priceSource": "GWC66.75×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            7.48,
            7.48,
            7.48,
            7.48,
            7.48
        ],
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 19000,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH70.111",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 900,
        "ratios": [
            4.58,
            5.04,
            5.59,
            5.95
        ],
        "maxPower": 7299,
        "minPower": 3244,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            8.11,
            8.11,
            8.11,
            8.11
        ],
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWH.webp",
        "thrust": 1200
    },
    {
        "model": "GWH70.76",
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
        "thrust": 750,
        "centerDistance": 750,
        "maxPower": 7335,
        "minPower": 2445,
        "powerSource": "传动能力计算",
        "price": 1045000,
        "discountRate": 0.1,
        "priceSource": "GWC70.76×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            8.15,
            8.15,
            8.15,
            8.15,
            8.15
        ],
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 21500,
        "image": "/images/gearbox/Advance-GWH.webp"
    },
    {
        "model": "GWH70.82",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 900,
        "ratios": [
            1.94,
            2.54,
            3,
            3.5,
            3.95,
            4.25
        ],
        "thrust": 780,
        "centerDistance": 780,
        "maxPower": 8235,
        "minPower": 2520,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            9.15,
            9.15,
            9.15,
            9.15,
            9.15,
            8.4
        ],
        "imageUrl": "/images/gearbox/Advance-GWH.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 8400,
        "image": "/images/gearbox/Advance-GWH.webp",
        "dimensions": "2876×2151×1970"
    },
    {
        "model": "GWK28.30",
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
        "thrust": 80,
        "centerDistance": 100,
        "maxPower": 792,
        "minPower": 176,
        "powerSource": "传动能力计算",
        "price": 66700,
        "discountRate": 0.1,
        "priceSource": "GWC28.30×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.44,
            0.44,
            0.44,
            0.44,
            0.44
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 1130,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK30.32A",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            1.97,
            2.52,
            2.96,
            3.52,
            4
        ],
        "maxPower": 1026,
        "minPower": 208,
        "powerSource": "传动能力计算",
        "price": 83536,
        "discountRate": 0.1,
        "priceSource": "GWC30.32×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.57,
            0.57,
            0.57,
            0.56,
            0.52
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 1300,
        "image": "/images/gearbox/Advance-GWK.webp",
        "dimensions": "1433×1200×888"
    },
    {
        "model": "GWK32.35",
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
        "thrust": 120,
        "centerDistance": 120,
        "maxPower": 1296,
        "minPower": 288,
        "powerSource": "传动能力计算",
        "price": 95496,
        "discountRate": 0.1,
        "priceSource": "GWC32.35×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.72,
            0.72,
            0.72,
            0.72,
            0.72
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 2080,
        "image": "/images/gearbox/Advance-GWK.webp",
        "dimensions": "1405×1240×920"
    },
    {
        "model": "GWK36.39",
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
        "thrust": 140,
        "centerDistance": 140,
        "maxPower": 1836,
        "minPower": 408,
        "powerSource": "传动能力计算",
        "price": 113896,
        "discountRate": 0.1,
        "priceSource": "GWC36.39×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.02,
            1.02,
            1.02,
            1.02,
            1.02
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 2250,
        "image": "/images/gearbox/Advance-GWK.webp",
        "dimensions": "1645×1331×1060"
    },
    {
        "model": "GWK36.54",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            4.46,
            4.95,
            5.55,
            5.95
        ],
        "thrust": 220,
        "centerDistance": 220,
        "maxPower": 1728,
        "minPower": 384,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.96,
            0.96,
            0.96,
            0.96
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 2960,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK39.41",
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
        "thrust": 175,
        "centerDistance": 175,
        "maxPower": 2240,
        "minPower": 560,
        "powerSource": "传动能力计算",
        "price": 141496,
        "discountRate": 0.1,
        "priceSource": "GWC39.41×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.4,
            1.4,
            1.4,
            1.4,
            1.4
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
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
        "weight": 2960,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK42.45",
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
        "thrust": 220,
        "centerDistance": 220,
        "maxPower": 2896,
        "minPower": 724,
        "powerSource": "传动能力计算",
        "price": 170936,
        "discountRate": 0.1,
        "priceSource": "GWC42.45×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.81,
            1.81,
            1.81,
            1.81,
            1.81
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
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
        "weight": 3630,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK42.63",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            4.46,
            5.08,
            5.46,
            5.95
        ],
        "thrust": 270,
        "centerDistance": 270,
        "maxPower": 2624,
        "minPower": 656,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.64,
            1.64,
            1.64,
            1.64
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
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
        "weight": 5560,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK45.49",
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
        "thrust": 270,
        "centerDistance": 270,
        "maxPower": 3122,
        "minPower": 892,
        "powerSource": "传动能力计算",
        "price": 253736,
        "discountRate": 0.1,
        "priceSource": "GWC45.49×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.23,
            2.23,
            2.23,
            2.23,
            2.23
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
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
        "weight": 5560,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK45.68",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1400,
        "ratios": [
            4.5,
            5,
            5.55,
            5.95
        ],
        "thrust": 360,
        "centerDistance": 360,
        "maxPower": 2968,
        "minPower": 848,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.12,
            2.12,
            2.12,
            2.12
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
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
        "weight": 7300,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK49.54",
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
        "thrust": 290,
        "centerDistance": 290,
        "maxPower": 3912,
        "minPower": 1304,
        "powerSource": "传动能力计算",
        "price": 370392,
        "discountRate": 0.1,
        "priceSource": "GWC49.54×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            3.26,
            3.26,
            3.26,
            3.26,
            3.26
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
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
        "weight": 7300,
        "image": "/images/gearbox/Advance-GWK.webp",
        "dimensions": "2126×1989×1340"
    },
    {
        "model": "GWK49.74",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.58,
            5.04,
            5.59,
            5.95
        ],
        "thrust": 540,
        "centerDistance": 540,
        "maxPower": 3396,
        "minPower": 1132,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.83,
            2.83,
            2.83,
            2.83
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
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
        "weight": 7220,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK52.59",
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
        "thrust": 300,
        "centerDistance": 300,
        "maxPower": 4568,
        "minPower": 1523,
        "powerSource": "传动能力计算",
        "price": 501400,
        "discountRate": 0.1,
        "priceSource": "GWC52.59×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            3.8067,
            3.8067,
            3.8067,
            3.8067,
            3.8067
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
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
        "weight": 7220,
        "image": "/images/gearbox/Advance-GWK.webp",
        "dimensions": "2291×1400×1290"
    },
    {
        "model": "GWK52.82",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.58,
            5.04,
            5.59,
            5.95
        ],
        "thrust": 710,
        "centerDistance": 710,
        "maxPower": 4368,
        "minPower": 1456,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            3.64,
            3.64,
            3.64,
            3.64
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
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
        "weight": 14000,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK60.66",
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
        "thrust": 450,
        "centerDistance": 450,
        "maxPower": 7200,
        "minPower": 2400,
        "powerSource": "传动能力计算",
        "price": 736000,
        "discountRate": 0.1,
        "priceSource": "GWC60.66×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            5.09,
            5.09,
            5.09,
            5.09,
            5.09
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 14000,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK60.92",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.52,
            5.04,
            5.52,
            5.95
        ],
        "thrust": 750,
        "centerDistance": 750,
        "maxPower": 7740,
        "minPower": 2580,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            5.05,
            5.05,
            5.05,
            5.05
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK63.71",
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
        "thrust": 710,
        "centerDistance": 710,
        "maxPower": 7480,
        "minPower": 2244,
        "powerSource": "传动能力计算",
        "price": 874000,
        "discountRate": 0.1,
        "priceSource": "GWC63.71×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            6.45,
            6.45,
            6.45,
            6.45,
            6.45
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWK.webp",
        "dimensions": "2645×2381×1740"
    },
    {
        "model": "GWK63.95",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1000,
        "ratios": [
            4.5,
            5,
            5.55,
            5.95
        ],
        "thrust": 800,
        "centerDistance": 800,
        "maxPower": 7480,
        "minPower": 2992,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            6,
            6,
            6,
            6
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK66.106",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 950,
        "ratios": [
            4.52,
            4.96,
            5.48,
            6.05
        ],
        "maxPower": 8693,
        "minPower": 3660,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            7.2,
            7.2,
            7.2,
            7.2
        ],
        "imageUrl": "/images/gearbox/06-16A-26.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK66.75",
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
        "thrust": 730,
        "centerDistance": 730,
        "maxPower": 7743,
        "minPower": 2445,
        "powerSource": "传动能力计算",
        "price": 966000,
        "discountRate": 0.1,
        "priceSource": "GWC66.75×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            7.48,
            7.48,
            7.48,
            7.48,
            7.48
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 19000,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK70.111",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 900,
        "ratios": [
            4.58,
            5.04,
            5.59,
            5.95
        ],
        "maxPower": 7299,
        "minPower": 3244,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            8.11,
            8.11,
            8.11,
            8.11
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK70.76",
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
        "thrust": 750,
        "centerDistance": 750,
        "maxPower": 8235,
        "minPower": 2745,
        "powerSource": "传动能力计算",
        "price": 1012000,
        "discountRate": 0.1,
        "priceSource": "GWC70.76×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            8.15,
            8.15,
            8.15,
            8.15,
            8.15
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 21500,
        "image": "/images/gearbox/Advance-GWK.webp"
    },
    {
        "model": "GWK70.82",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 900,
        "ratios": [
            1.94,
            2.54,
            3,
            3.5,
            3.95,
            4.25
        ],
        "thrust": 780,
        "centerDistance": 780,
        "maxPower": 8235,
        "minPower": 2745,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            9.15,
            9.15,
            9.15,
            9.15,
            9.15,
            8.4
        ],
        "imageUrl": "/images/gearbox/Advance-GWK.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 8400,
        "image": "/images/gearbox/Advance-GWK.webp",
        "dimensions": "2876×2151×1970"
    },
    {
        "model": "GWL28.30",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 900,
        "ratios": [
            2.06,
            2.51,
            3.08,
            3.54,
            4.05,
            4.54,
            5.09,
            5.59,
            6.14
        ],
        "thrust": 80,
        "maxPower": 779,
        "minPower": 116,
        "powerSource": "传动能力计算",
        "price": 66700,
        "discountRate": 0.1,
        "priceSource": "GWC28.30×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.865,
            0.711,
            0.578,
            0.504,
            0.44,
            0.393,
            0.35,
            0.319,
            0.29
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 1070,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL30.32",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 900,
        "ratios": [
            2.03,
            2.55,
            3.04,
            3.52,
            4,
            4.55,
            5.05,
            5.64,
            6.05
        ],
        "thrust": 100,
        "centerDistance": 100,
        "maxPower": 1010,
        "minPower": 150,
        "powerSource": "传动能力计算",
        "price": 83536,
        "discountRate": 0.1,
        "priceSource": "GWC30.32×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.122,
            0.894,
            0.75,
            0.647,
            0.57,
            0.501,
            0.451,
            0.404,
            0.376
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 1240,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL32.35",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 900,
        "ratios": [
            2.06,
            2.54,
            3.02,
            3.58,
            4.05,
            4.59,
            5.09,
            5.57,
            6.08
        ],
        "thrust": 120,
        "centerDistance": 120,
        "maxPower": 1276,
        "minPower": 192,
        "powerSource": "传动能力计算",
        "price": 95496,
        "discountRate": 0.1,
        "priceSource": "GWC32.35×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.4175,
            1.1481,
            0.9659,
            0.816,
            0.72,
            0.6353,
            0.5733,
            0.5236,
            0.48
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 2240,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL36.39",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 900,
        "ratios": [
            1.97,
            2.45,
            2.98,
            3.47,
            3.95,
            4.4,
            5.01,
            5.47,
            5.97
        ],
        "thrust": 140,
        "centerDistance": 140,
        "maxPower": 1841,
        "minPower": 270,
        "powerSource": "传动能力计算",
        "price": 113896,
        "discountRate": 0.1,
        "priceSource": "GWC36.39×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.045,
            1.644,
            1.352,
            1.161,
            1.02,
            0.916,
            0.804,
            0.737,
            0.675
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 2700,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL39.41",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 800,
        "ratios": [
            1.98,
            2.47,
            3.05,
            3.48,
            4.05,
            4.48,
            5,
            5.51,
            5.99
        ],
        "thrust": 175,
        "centerDistance": 175,
        "maxPower": 2298,
        "minPower": 379,
        "powerSource": "传动能力计算",
        "price": 141496,
        "discountRate": 0.1,
        "priceSource": "GWC39.41×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.872,
            2.297,
            1.858,
            1.63,
            1.4,
            1.265,
            1.135,
            1.03,
            0.947
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 3550,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL42.45",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 800,
        "ratios": [
            2,
            2.55,
            3.02,
            3.58,
            4,
            4.47,
            5,
            5.6,
            5.93
        ],
        "thrust": 220,
        "centerDistance": 220,
        "maxPower": 2896,
        "minPower": 488,
        "powerSource": "传动能力计算",
        "price": 170936,
        "discountRate": 0.1,
        "priceSource": "GWC42.45×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            3.62,
            2.844,
            2.394,
            2.023,
            1.81,
            1.619,
            1.448,
            1.293,
            1.221
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 4190,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL45.49",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 700,
        "ratios": [
            1.97,
            2.47,
            2.89,
            3.47,
            3.95,
            4.37,
            4.85,
            5.5,
            5.98
        ],
        "thrust": 270,
        "centerDistance": 270,
        "maxPower": 3122,
        "minPower": 588,
        "powerSource": "传动能力计算",
        "price": 253736,
        "discountRate": 0.1,
        "priceSource": "GWC45.49×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            4.46,
            3.568,
            3.041,
            2.54,
            2.23,
            2.012,
            1.815,
            1.6,
            1.471
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 5350,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL45.52",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 630,
        "ratios": [
            1.97,
            2.52,
            2.99,
            3.47,
            4.01,
            4.64,
            4.98,
            5.51,
            6.04
        ],
        "thrust": 270,
        "centerDistance": 270,
        "maxPower": 3805,
        "minPower": 2416,
        "powerSource": "传动能力计算",
        "price": 294400,
        "discountRate": 0.1,
        "priceSource": "GWC45.52×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            4.845,
            3.815,
            3.185,
            2.748,
            2.435,
            2.146,
            1.915,
            1.73,
            1.609
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL49.54",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 600,
        "ratios": [
            1.94,
            2.46,
            2.92,
            3.45,
            3.95,
            4.53,
            4.91,
            5.48,
            6
        ],
        "thrust": 290,
        "centerDistance": 290,
        "maxPower": 3528,
        "minPower": 759,
        "powerSource": "传动能力计算",
        "price": 370392,
        "discountRate": 0.1,
        "priceSource": "GWC49.54×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            5.88,
            4.628,
            3.901,
            3.303,
            2.88,
            2.51,
            2.318,
            2.076,
            1.898
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 7000,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL49.59",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 550,
        "ratios": [
            2.03,
            2.49,
            3.04,
            3.49,
            4,
            4.48,
            5.01,
            5.51,
            6.01
        ],
        "thrust": 290,
        "centerDistance": 290,
        "maxPower": 3525,
        "minPower": 868,
        "powerSource": "传动能力计算",
        "price": 423200,
        "discountRate": 0.1,
        "priceSource": "GWC49.59×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            6.409,
            5.226,
            4.288,
            3.735,
            3.26,
            2.913,
            2.603,
            2.366,
            2.171
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL52.59",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 600,
        "ratios": [
            1.93,
            2.48,
            2.96,
            3.53,
            3.95,
            4.43,
            4.97,
            5.4,
            5.93
        ],
        "thrust": 300,
        "centerDistance": 300,
        "maxPower": 4667,
        "minPower": 1015,
        "powerSource": "传动能力计算",
        "price": 501400,
        "discountRate": 0.1,
        "priceSource": "GWC52.59×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            7.779,
            6.063,
            5.076,
            4.268,
            3.807,
            3.395,
            3.026,
            2.785,
            2.538
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 8955,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL52.62",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 565,
        "ratios": [
            2.02,
            2.46,
            3.02,
            3.45,
            4.06,
            4.52,
            5.04,
            5.46,
            5.95,
            6.49,
            6.94
        ],
        "thrust": 300,
        "centerDistance": 300,
        "maxPower": 4406,
        "minPower": 908,
        "powerSource": "传动能力计算",
        "price": 529000,
        "discountRate": 0.1,
        "priceSource": "GWC52.62×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            7.798,
            6.404,
            5.216,
            4.566,
            3.88,
            3.485,
            3.126,
            2.885,
            2.648,
            2.427,
            2.27
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 9300,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL60.66",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 600,
        "ratios": [
            2.01,
            2.5,
            3.07,
            3.57,
            4.05,
            4.48,
            5.08,
            5.51,
            6.12,
            6.52,
            6.97
        ],
        "thrust": 450,
        "centerDistance": 450,
        "maxPower": 6016,
        "minPower": 2258,
        "powerSource": "传动能力计算",
        "price": 736000,
        "discountRate": 0.1,
        "priceSource": "GWC60.66×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            10.026,
            8.073,
            6.567,
            5.645,
            4.98,
            4.5,
            3.973,
            3.664,
            3.299,
            3.06,
            3
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 13290,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL60.74",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 530,
        "ratios": [
            1.99,
            2.53,
            3.06,
            3.51,
            4.02,
            4.5,
            5.04,
            5.51,
            6.04,
            6.5,
            6.94
        ],
        "thrust": 550,
        "centerDistance": 550,
        "maxPower": 6148,
        "minPower": 1360,
        "powerSource": "传动能力计算",
        "price": 846400,
        "discountRate": 0.1,
        "priceSource": "GWC60.74×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            11.6,
            9.344,
            7.723,
            6.726,
            5.87,
            5.246,
            4.688,
            4.282,
            3.909,
            3.632,
            3.4
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 15100,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL66.75",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 490,
        "ratios": [
            2.05,
            2.55,
            2.99,
            3.48,
            3.95,
            4.49,
            4.97,
            5.51,
            6.12,
            6.59,
            6.95
        ],
        "thrust": 730,
        "centerDistance": 730,
        "maxPower": 7059,
        "minPower": 2547,
        "powerSource": "传动能力计算",
        "price": 966000,
        "discountRate": 0.1,
        "priceSource": "GWC66.75×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            14.406,
            11.582,
            9.9,
            8.491,
            7.48,
            6.59,
            5.95,
            5.366,
            4.831,
            4.488,
            4.253
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17500,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL70.76",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 465,
        "ratios": [
            2.05,
            2.53,
            3.09,
            3.58,
            3.95,
            4.57,
            5.05,
            5.58,
            5.77,
            6.17,
            6.54,
            6.94
        ],
        "thrust": 750,
        "centerDistance": 750,
        "maxPower": 7309,
        "minPower": 2445,
        "powerSource": "传动能力计算",
        "price": 1012000,
        "discountRate": 0.1,
        "priceSource": "GWC70.76×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            15.718,
            12.734,
            10.414,
            8.986,
            8.15,
            7.039,
            6.378,
            5.773,
            5.562,
            5.216,
            4.934,
            4.5
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 20000,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL70.82",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 465,
        "ratios": [
            2.05,
            2.53,
            3.09,
            3.58,
            3.95,
            4.57
        ],
        "thrust": 780,
        "centerDistance": 780,
        "maxPower": 8205,
        "minPower": 2371,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            17.646,
            14.297,
            11.692,
            10.088,
            9.15,
            7.902
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 20500,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL70.85",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 425,
        "ratios": [
            1.98,
            2.45,
            3.01,
            3.49,
            3.95
        ],
        "thrust": 800,
        "centerDistance": 800,
        "maxPower": 9112,
        "minPower": 3216,
        "powerSource": "传动能力计算",
        "price": 1352400,
        "discountRate": 0.1,
        "priceSource": "GWC70.85×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            21.441,
            17.291,
            14.089,
            12.131,
            10.72
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 24200,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL75.90",
        "series": "GW",
        "minSpeed": 200,
        "maxSpeed": 465,
        "ratios": [
            2.01,
            2.51,
            3.01,
            3.51,
            4
        ],
        "thrust": 980,
        "centerDistance": 980,
        "maxPower": 10427,
        "minPower": 2256,
        "powerSource": "传动能力计算",
        "price": 1656000,
        "discountRate": 0.1,
        "priceSource": "GWC75.90×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            22.423,
            17.966,
            15,
            12.833,
            11.282
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 31500,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL78.88",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 335,
        "ratios": [
            2.04,
            2.49,
            2.98,
            3.48,
            3.95,
            4.49,
            5.01,
            5.47,
            6.09
        ],
        "thrust": 1000,
        "maxPower": 7830,
        "minPower": 2349,
        "powerSource": "传动能力计算",
        "price": 1536400,
        "discountRate": 0.1,
        "priceSource": "GWC78.88×92%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            23.372,
            19.099,
            15.983,
            13.708,
            12.063,
            10.615,
            9.511,
            8.712,
            7.83
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 32000,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL80.95",
        "series": "GW",
        "minSpeed": 200,
        "maxSpeed": 350,
        "ratios": [
            1.98,
            2.49,
            2.94,
            3.46,
            3.95,
            4.51,
            5.03,
            5.48,
            5.93
        ],
        "thrust": 1200,
        "maxPower": 9800,
        "minPower": 2800,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            28,
            22.2,
            18.81,
            16,
            14,
            12.25,
            11,
            10.09,
            9.33
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 37000,
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWL85.100",
        "series": "GW",
        "minSpeed": 150,
        "maxSpeed": 400,
        "ratios": [
            1.98,
            2.55,
            2.98,
            3.48,
            3.95,
            4.48,
            4.97,
            5.51,
            5.99,
            6.45,
            7.05
        ],
        "maxPower": 14000,
        "minPower": 1488,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            35,
            27.429,
            23.445,
            20.108,
            17.5,
            15.605,
            14.091,
            12.708,
            11.684,
            10.845,
            9.92
        ],
        "imageUrl": "/images/gearbox/Advance-GWL.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "image": "/images/gearbox/Advance-GWL.webp"
    },
    {
        "model": "GWS28.30",
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
        "thrust": 80,
        "centerDistance": 100,
        "maxPower": 792,
        "minPower": 176,
        "powerSource": "传动能力计算",
        "price": 68875,
        "discountRate": 0.1,
        "priceSource": "GWC28.30×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.44,
            0.44,
            0.44,
            0.44,
            0.44
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "dimensions": "1183×1050×970",
        "inputInterfaces": {
            "sae": [
                "SAE1#14寸"
            ],
            "domestic": [
                "φ405",
                "φ450"
            ]
        },
        "weight": 1230,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": 1,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS28.30P",
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
            1.359,
            1.359,
            1.359,
            1.359,
            1.359
        ],
        "thrust": 0.155,
        "centerDistance": 1000,
        "dimensions": "相同",
        "weight": 1230,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 68875,
        "discountRate": 0.1,
        "priceSource": "GWC28.30×95%",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "minPower": 544,
        "maxPower": 2446,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS30.32A",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            1.97,
            2.52,
            2.96,
            3.52,
            4
        ],
        "maxPower": 1026,
        "minPower": 208,
        "powerSource": "传动能力计算",
        "price": 86260,
        "discountRate": 0.1,
        "priceSource": "GWC30.32×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.57,
            0.57,
            0.57,
            0.56,
            0.52
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 1460,
        "image": "/images/gearbox/Advance-GWS.webp",
        "dimensions": "1433×1200×888",
        "thrust": 100
    },
    {
        "model": "GWS30.32P",
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
            1.351,
            1.351,
            1.351,
            1.351,
            1.351
        ],
        "thrust": 0.225,
        "centerDistance": 1000,
        "dimensions": "相同",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 86260,
        "discountRate": 0.1,
        "priceSource": "GWC30.32×95%",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "minPower": 540,
        "maxPower": 2432,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS32.35",
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
        "thrust": 120,
        "centerDistance": 120,
        "maxPower": 1296,
        "minPower": 288,
        "powerSource": "传动能力计算",
        "price": 98610,
        "discountRate": 0.1,
        "priceSource": "GWC32.35×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.72,
            0.72,
            0.72,
            0.72,
            0.72
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "dimensions": "1437×1210×1110",
        "inputInterfaces": {
            "sae": [
                "SAE1#14寸"
            ],
            "domestic": [
                "φ405",
                "φ450"
            ]
        },
        "weight": 2250,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": 2,
        "dimensions": "1405×1240×920",
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS32.35P",
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
            1.4,
            1.4,
            1.4,
            1.4,
            1.4
        ],
        "thrust": 0.27,
        "centerDistance": 1000,
        "dimensions": "1437×1210×1110",
        "weight": 2250,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 98610,
        "discountRate": 0.1,
        "priceSource": "GWC32.35×95%",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "minPower": 560,
        "maxPower": 2520,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS36.39",
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
        "thrust": 140,
        "centerDistance": 140,
        "maxPower": 1836,
        "minPower": 408,
        "powerSource": "传动能力计算",
        "price": 117610,
        "discountRate": 0.1,
        "priceSource": "GWC36.39×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.02,
            1.02,
            1.02,
            1.02,
            1.02
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "dimensions": "1563×1330×1230",
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
        "weight": 2450,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": 2,
        "dimensions": "1645×1331×1060",
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS36.39P",
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
            1.351,
            1.351,
            1.351,
            1.351,
            1.351
        ],
        "thrust": 0.28,
        "centerDistance": 1000,
        "dimensions": "1563×1330×1230",
        "weight": 2450,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 117610,
        "discountRate": 0.1,
        "priceSource": "GWC36.39×95%",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "minPower": 540,
        "maxPower": 2432,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS36.54",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1800,
        "ratios": [
            4.46,
            4.95,
            5.55,
            5.95
        ],
        "thrust": 220,
        "centerDistance": 220,
        "maxPower": 1728,
        "minPower": 384,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.96,
            0.96,
            0.96,
            0.96
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 3230,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": null,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS39.41",
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
        "thrust": 175,
        "centerDistance": 175,
        "maxPower": 2240,
        "minPower": 560,
        "powerSource": "传动能力计算",
        "price": 146110,
        "discountRate": 0.1,
        "priceSource": "GWC39.41×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.4,
            1.4,
            1.4,
            1.4,
            1.4
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 3230,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": 3,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS39.41P",
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
            1.353,
            1.353,
            1.353,
            1.353,
            1.353
        ],
        "thrust": 0.44,
        "centerDistance": 1000,
        "dimensions": null,
        "weight": 3230,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 146110,
        "discountRate": 0.1,
        "priceSource": "GWC39.41×95%",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "minPower": 541,
        "maxPower": 2165,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS39.57",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            4.52,
            5.04,
            5.52,
            5.95
        ],
        "thrust": 270,
        "centerDistance": 270,
        "maxPower": 2064,
        "minPower": 516,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.29,
            1.29,
            1.29,
            1.29
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 3960,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": null,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS42.45",
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
        "thrust": 220,
        "centerDistance": 220,
        "maxPower": 2896,
        "minPower": 724,
        "powerSource": "传动能力计算",
        "price": 176510,
        "discountRate": 0.1,
        "priceSource": "GWC42.45×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.81,
            1.81,
            1.81,
            1.81,
            1.81
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "dimensions": "1613×1460×1360",
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
        "weight": 3960,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": 3,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS42.45P",
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
            1.394,
            1.394,
            1.394,
            1.394,
            1.394
        ],
        "thrust": 0.6,
        "centerDistance": 1000,
        "dimensions": "相同",
        "weight": 3960,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 176510,
        "discountRate": 0.1,
        "priceSource": "GWC42.45×95%",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "minPower": 558,
        "maxPower": 2230,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS42.63",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            4.46,
            5.08,
            5.46,
            5.95
        ],
        "thrust": 290,
        "centerDistance": 290,
        "maxPower": 2624,
        "minPower": 656,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            1.64,
            1.64,
            1.64,
            1.64
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 6030,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": null,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS45.49",
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
        "thrust": 270,
        "centerDistance": 270,
        "maxPower": 3122,
        "minPower": 892,
        "powerSource": "传动能力计算",
        "price": 262010,
        "discountRate": 0.1,
        "priceSource": "GWC45.49×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.23,
            2.23,
            2.23,
            2.23,
            2.23
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 6030,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": 6,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS45.49P",
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
            1.333,
            1.333,
            1.333,
            1.333,
            1.333
        ],
        "thrust": 0.67,
        "centerDistance": 1000,
        "dimensions": "相同",
        "weight": 6030,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 262010,
        "discountRate": 0.1,
        "priceSource": "GWC45.49×95%",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "minPower": 533,
        "maxPower": 1866,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS45.68",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1400,
        "ratios": [
            4.5,
            5,
            5.55,
            5.95
        ],
        "thrust": 360,
        "centerDistance": 360,
        "maxPower": 2968,
        "minPower": 848,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.12,
            2.12,
            2.12,
            2.12
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 7900,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": null,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS49.54",
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
        "thrust": 290,
        "centerDistance": 290,
        "maxPower": 3912,
        "minPower": 1304,
        "powerSource": "传动能力计算",
        "price": 382470,
        "discountRate": 0.1,
        "priceSource": "GWC49.54×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            3.26,
            3.26,
            3.26,
            3.26,
            3.26
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "dimensions": "2189×1892×1750",
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
        "weight": 7900,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": 7,
        "dimensions": "2126×1989×1340",
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS49.54P",
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
            1.333,
            1.5,
            1.5,
            1.5,
            1.5
        ],
        "thrust": 0.85,
        "centerDistance": 1000,
        "dimensions": "相同",
        "weight": 7900,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 382470,
        "discountRate": 0.1,
        "priceSource": "GWC49.54×95%",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "minPower": 533,
        "maxPower": 1800,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS49.61",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.45,
            5,
            5.26,
            5.5
        ],
        "transmissionCapacityPerRatio": [
            2.825,
            2.72,
            2.53,
            2.47
        ],
        "thrust": 290,
        "centerDistance": 8,
        "dimensions": "2217×1846×1750",
        "weight": 8500,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 8077,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 3390,
        "minPower": 988,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS49.74",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.58,
            5.04,
            5.59,
            5.95
        ],
        "thrust": 540,
        "centerDistance": 540,
        "maxPower": 3396,
        "minPower": 1132,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.83,
            2.83,
            2.83,
            2.83
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 8900,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": null,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS52.59",
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
        "thrust": 300,
        "centerDistance": 300,
        "maxPower": 4568,
        "minPower": 1523,
        "powerSource": "传动能力计算",
        "price": 517750,
        "discountRate": 0.1,
        "priceSource": "GWC52.59×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            3.8067,
            3.8067,
            3.8067,
            3.8067,
            3.8067
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 8900,
        "image": "/images/gearbox/Advance-GWS.webp",
        "dimensions": "2291×1400×1290"
    },
    {
        "model": "GWS52.59P",
        "series": "混合动力",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1.97,
            2.47,
            3,
            3.52,
            3.95
        ],
        "transmissionCapacityPerRatio": [
            3.64,
            3.64,
            3.64,
            3.64,
            3.64
        ],
        "thrust": 300,
        "centerDistance": 360,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "混合动力齿轮箱，支持柴电双动力输入",
        "minPower": 3640,
        "maxPower": 7644,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GWS.webp",
        "weight": 8900,
        "price": 517750,
        "priceSource": "GWC52.59×95%",
        "discountRate": 0.1
    },
    {
        "model": "GWS52.71",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.58,
            5
        ],
        "transmissionCapacityPerRatio": [
            3.806,
            3.806
        ],
        "thrust": 540,
        "centerDistance": 12,
        "dimensions": "2406×2123×1970",
        "weight": 12300,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 8173,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 4567,
        "minPower": 1522,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS52.82",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.58,
            5.04,
            5.59,
            5.95
        ],
        "thrust": 710,
        "centerDistance": 710,
        "maxPower": 4368,
        "minPower": 1456,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            3.64,
            3.64,
            3.64,
            3.64
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 15000,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": null,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS60.66",
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
        "thrust": 450,
        "centerDistance": 450,
        "maxPower": 6108,
        "minPower": 2036,
        "powerSource": "传动能力计算",
        "price": 760000,
        "discountRate": 0.1,
        "priceSource": "GWC60.66×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            5.09,
            5.09,
            5.09,
            5.09,
            5.09
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "dimensions": "2324×2080×1920",
        "inputInterfaces": {
            "domestic": [
                "φ1025",
                "φ1110",
                "φ650",
                "φ770",
                "φ908"
            ]
        },
        "weight": 15000,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": 15141414,
        "dimensions": null,
        "weight": null,
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
        "discountRate": 0.1
    },
    {
        "model": "GWS60.66P",
        "series": "混合动力",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            2,
            2.54,
            2.96,
            3.5,
            3.95
        ],
        "transmissionCapacityPerRatio": [
            5.05,
            5.05,
            5.05,
            5.05,
            5.05
        ],
        "thrust": 450,
        "centerDistance": 540,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "混合动力齿轮箱，支持柴电双动力输入",
        "minPower": 5050,
        "maxPower": 10605,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-GWS.webp",
        "dimensions": "2324×2080×1920",
        "weight": 15000,
        "price": 760000,
        "priceSource": "GWC60.66×95%",
        "discountRate": 0.1
    },
    {
        "model": "GWS60.75",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            5,
            5.42,
            6
        ],
        "thrust": 700,
        "centerDistance": 700,
        "maxPower": 6108,
        "minPower": 1700,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            5.09,
            5.09,
            4.25
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 18300,
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS60.92",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1200,
        "ratios": [
            4.52,
            5.04,
            5.52,
            5.95
        ],
        "thrust": 750,
        "centerDistance": 750,
        "maxPower": 6060,
        "minPower": 2020,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            5.05,
            5.05,
            5.05,
            5.05
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": null,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS63.71",
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
        "thrust": 710,
        "centerDistance": 710,
        "maxPower": 6450,
        "minPower": 1935,
        "powerSource": "传动能力计算",
        "price": 902500,
        "discountRate": 0.1,
        "priceSource": "GWC63.71×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            6.45,
            6.45,
            6.45,
            6.45,
            6.45
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWS.webp",
        "dimensions": "2645×2381×1740"
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
        "centerDistance": 17,
        "dimensions": "2645×2381×1740",
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS63.95",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 1000,
        "ratios": [
            4.5,
            5,
            5.55,
            5.95
        ],
        "thrust": 800,
        "centerDistance": 800,
        "maxPower": 6000,
        "minPower": 2400,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            6,
            6,
            6,
            6
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": null,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS66.106",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 950,
        "ratios": [
            4.52,
            4.96,
            5.48,
            6.05
        ],
        "maxPower": 6840,
        "minPower": 2880,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            7.2,
            7.2,
            7.2,
            7.2
        ],
        "imageUrl": "/images/gearbox/06-16A-26.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWS.webp",
        "thrust": 980
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
        "centerDistance": null,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS66.75",
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
        "thrust": 730,
        "centerDistance": 730,
        "maxPower": 7106,
        "minPower": 2244,
        "powerSource": "传动能力计算",
        "price": 997500,
        "discountRate": 0.1,
        "priceSource": "GWC66.75×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            7.48,
            7.48,
            7.48,
            7.48,
            7.48
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/6456f9b9-ff78-40d7-80f0-c4c8e5b3aac5.png",
        "introduction": "GW系列渔用齿轮箱是杭州前进齿轮箱集团为拖网渔船设计的专用齿轮箱。除具有倒顺车、减速及承受螺旋桨推力功能外,还具有取力功能,可输出动力带动液压泵、发电机等辅助设备。",
        "weight": 20000,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": 20191919,
        "dimensions": null,
        "weight": null,
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
        "discountRate": 0.1
    },
    {
        "model": "GWS70.111",
        "series": "GW",
        "minSpeed": 400,
        "maxSpeed": 900,
        "ratios": [
            4.58,
            5.04,
            5.59,
            5.95
        ],
        "maxPower": 7299,
        "minPower": 3244,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            8.11,
            8.11,
            8.11,
            8.11
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 17000,
        "image": "/images/gearbox/Advance-GWS.webp",
        "thrust": 1200
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
        "centerDistance": null,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS70.76",
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
        "thrust": 750,
        "centerDistance": 750,
        "maxPower": 7335,
        "minPower": 2445,
        "powerSource": "传动能力计算",
        "price": 1045000,
        "discountRate": 0.1,
        "priceSource": "GWC70.76×95%",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            8.15,
            8.15,
            8.15,
            8.15,
            8.15
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 22500,
        "image": "/images/gearbox/Advance-GWS.webp"
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
        "centerDistance": 22,
        "dimensions": null,
        "weight": null,
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
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "GWS70.82",
        "series": "GW",
        "minSpeed": 300,
        "maxSpeed": 900,
        "ratios": [
            1.94,
            2.54,
            3,
            3.5,
            3.95,
            4.25
        ],
        "thrust": 780,
        "centerDistance": 780,
        "maxPower": 8235,
        "minPower": 2520,
        "powerSource": "传动能力计算",
        "price": 450000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            9.15,
            9.15,
            9.15,
            9.15,
            9.15,
            8.4
        ],
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
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
        "weight": 23000,
        "image": "/images/gearbox/Advance-GWS.webp",
        "dimensions": "2876×2151×1970"
    },
    {
        "model": "HC038A",
        "series": "HC",
        "minSpeed": 1500,
        "maxSpeed": 3200,
        "ratios": [
            1.51,
            2.03,
            2.52,
            2.92,
            3.45
        ],
        "thrust": 9,
        "centerDistance": 115,
        "dimensions": "392×480×480",
        "weight": 70,
        "maxPower": 90,
        "minPower": 30,
        "powerSource": "传动能力计算",
        "price": 16380,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1500,
            3200
        ],
        "transmissionCapacityPerRatio": [
            0.028,
            0.028,
            0.028,
            0.025,
            0.02
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "sae": [
                "SAE3#11.5寸",
                "SAE4#10寸"
            ],
            "boltPatterns": [
                "8-φ11"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HC1000",
        "series": "HC",
        "minSpeed": 600,
        "maxSpeed": 2100,
        "ratios": [
            2,
            2.17,
            2.5,
            2.64,
            2.83,
            3.04,
            3.23,
            3.48,
            3.59,
            4.06
        ],
        "thrust": 110,
        "centerDistance": 335,
        "dimensions": "1082×1120×990",
        "weight": 1500,
        "controlType": "推拉软轴/电控/气控",
        "price": 81200,
        "discountRate": 0.06,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 1544,
        "minPower": 390,
        "powerSource": "传动能力计算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHB5",
                "series": "HGTHB"
            },
            "withCover": {
                "model": "HGTHJB5",
                "series": "HGTHJB"
            },
            "detachable": {
                "model": "HGTHB5/X",
                "series": "HGTHB"
            },
            "interfaces": {
                "sae": [
                    "18\"",
                    "21\""
                ],
                "domestic": [
                    "φ505",
                    "φ518",
                    "φ640"
                ]
            },
            "detailedOptions": {
                "standard": [
                    {
                        "model": "HGTHB5/18",
                        "interface": "配SAE18\""
                    },
                    {
                        "model": "HGTHB5/21",
                        "interface": "配SAE21\""
                    },
                    {
                        "model": "HGTHB5/φ505",
                        "interface": "配国内机505"
                    },
                    {
                        "model": "HGTHB5/φ518",
                        "interface": "配国内机518"
                    },
                    {
                        "model": "HGTHB5/φ640",
                        "interface": "配国内机640"
                    },
                    {
                        "model": "HGTHB5/φ640A",
                        "interface": "配国内机640"
                    }
                ],
                "withCover": [
                    {
                        "model": "HGTHJB5/18",
                        "interface": "配SAE18\"，带罩"
                    },
                    {
                        "model": "HGTHJB5/21",
                        "interface": "配SAE21\"，带罩"
                    }
                ],
                "detachable": [],
                "gearTooth": []
            }
        },
        "inputSpeedRange": [
            600,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.735,
            0.735,
            0.735,
            0.735,
            0.735,
            0.735,
            0.735,
            0.735,
            0.735,
            0.65
        ],
        "imageUrl": "/images/gearbox/Advance-800-1000.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "sae": [
                "SAE0#0寸",
                "SAE1#8寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ17.5",
                "16-φ14",
                "6-φ17.5",
                "8-φ28"
            ],
            "domestic": [
                "φ505",
                "φ518",
                "φ640"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HC1200",
        "series": "HC",
        "minSpeed": 600,
        "maxSpeed": 1900,
        "ratios": [
            1.6,
            2.03,
            2.48,
            2.5,
            2.96,
            3.18,
            3.33,
            3.55
        ],
        "thrust": 120,
        "centerDistance": 380,
        "dimensions": "1082×1200×1130",
        "weight": 1870,
        "controlType": "推拉软轴/电控/气控",
        "price": 92000,
        "discountRate": 0.14,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 1957,
        "minPower": 618,
        "powerSource": "传动能力计算",
        "couplingConfig": {
            "standard": {
                "model": "HGTQ1215ⅠD",
                "series": "HGTQ1215",
                "alternatives": [
                    "HGTHB6.3"
                ]
            },
            "withCover": {
                "model": "HGTHJB6.3",
                "series": "HGTHJB"
            },
            "detachable": {
                "model": "HGTHB6.3/X",
                "series": "HGTHB"
            },
            "interfaces": {
                "sae": [
                    "16\"",
                    "18\"",
                    "21\""
                ],
                "domestic": [
                    "φ290",
                    "φ518",
                    "φ640",
                    "φ640A",
                    "φ800"
                ]
            },
            "detailedOptions": {
                "standard": [
                    {
                        "model": "HGTQ1215ⅠD",
                        "interface": "配SAE16\""
                    },
                    {
                        "model": "HGTQ1215ⅠD",
                        "interface": "配SAE18\""
                    },
                    {
                        "model": "HGTQ1210ⅠW",
                        "interface": ""
                    },
                    {
                        "model": "HGTQ1215ⅠD",
                        "interface": "配SAE21\""
                    },
                    {
                        "model": "HGTQ1210ⅠW",
                        "interface": ""
                    },
                    {
                        "model": "HGTQ1215ⅠD",
                        "interface": "配国内机518"
                    },
                    {
                        "model": "HGTQ1210ⅠW",
                        "interface": ""
                    },
                    {
                        "model": "HGTQ1215ⅠD/φ640",
                        "interface": "配国内机640"
                    },
                    {
                        "model": "HGTQ1210ⅠW",
                        "interface": ""
                    },
                    {
                        "model": "HGTQ1215ⅠD/φ640A",
                        "interface": "配国内机640"
                    },
                    {
                        "model": "HGTQ1210ⅠW",
                        "interface": ""
                    },
                    {
                        "model": "HGTQ1215ⅡW",
                        "interface": "配国内机290"
                    },
                    {
                        "model": "HGTQ1215ⅠD",
                        "interface": "配国内机800"
                    },
                    {
                        "model": "HGTHB6.3/16",
                        "interface": "配SAE16\""
                    },
                    {
                        "model": "HGTHB6.3/18",
                        "interface": "配SAE18\""
                    },
                    {
                        "model": "HGTHB6.3/21",
                        "interface": "配SAE21\""
                    },
                    {
                        "model": "HGTHB6.3/φ518",
                        "interface": "配国内机518"
                    },
                    {
                        "model": "HGTHB6.3/φ640",
                        "interface": "配国内机640"
                    },
                    {
                        "model": "HGTHB6.3/φ640A",
                        "interface": "配国内机640"
                    },
                    {
                        "model": "HGTHB6.3/φ290",
                        "interface": "配国内机290"
                    }
                ],
                "withCover": [
                    {
                        "model": "HGTHJB6.3/16",
                        "interface": "配SAE16\"，带罩"
                    },
                    {
                        "model": "HGTHJB6.3/18",
                        "interface": "配SAE18\"，带罩"
                    },
                    {
                        "model": "HGTHJB6.3/21",
                        "interface": "配SAE21\"，带罩"
                    }
                ],
                "detachable": [],
                "gearTooth": []
            }
        },
        "inputSpeedRange": [
            600,
            1900
        ],
        "transmissionCapacityPerRatio": [
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            1.03
        ],
        "imageUrl": "/images/gearbox/Advance-1100-1200.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "sae": [
                "SAE0#0寸",
                "SAE1#8寸",
                "SAE16寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "domestic": [
                "φ290",
                "φ518",
                "φ640",
                "φ800",
                "φ820"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ17.5",
                "16-φ14",
                "16-φ22",
                "24-φ18",
                "4-φ15"
            ]
        },
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HC1200/1",
        "series": "HC",
        "minSpeed": 600,
        "maxSpeed": 1900,
        "ratios": [
            3.7,
            3.74,
            3.95,
            4.14,
            4.45,
            5,
            5.25,
            5.58
        ],
        "thrust": 140,
        "centerDistance": 450,
        "maxPower": 1957,
        "minPower": 441,
        "powerSource": "传动能力计算",
        "price": 108200,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            600,
            1900
        ],
        "transmissionCapacityPerRatio": [
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            0.93,
            0.809,
            0.735
        ],
        "imageUrl": "/images/gearbox/Advance-1100-1200.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "sae": [
                "SAE0#0寸",
                "SAE1#8寸",
                "SAE16寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "domestic": [
                "φ290",
                "φ518",
                "φ640",
                "φ800",
                "φ820"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ17.5",
                "16-φ14",
                "16-φ22",
                "24-φ18",
                "4-φ15"
            ]
        },
        "weight": 2500,
        "image": "/images/gearbox/Advance-200-201-230.webp",
        "dimensions": "1096×1260×1270"
    },
    {
        "model": "HC1200/1P",
        "series": "混合动力",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            3.7,
            3.74,
            3.95,
            4.14,
            4.45,
            5,
            5.25,
            5.58
        ],
        "transmissionCapacityPerRatio": [
            0.93,
            0.92,
            0.75,
            0.69,
            0.62,
            0.62,
            0.62,
            0.62
        ],
        "thrust": 140,
        "centerDistance": 450,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "混合动力齿轮箱，支持柴电双动力输入，PTI输入1000-2500rpm",
        "minPower": 620,
        "maxPower": 2325,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-1100-1200.webp",
        "weight": 2500
    },
    {
        "model": "HC1200P",
        "series": "混合动力",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            1.6,
            2.03,
            2.48,
            2.5,
            2.96,
            3.18,
            3.33,
            3.55,
            3.79,
            4.06,
            4.2,
            4.47
        ],
        "transmissionCapacityPerRatio": [
            0.93,
            0.93,
            0.93,
            0.9,
            0.85,
            0.75,
            0.695,
            0.65,
            0.65,
            0.65,
            0.65,
            0.65
        ],
        "thrust": 120,
        "centerDistance": 380,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "混合动力齿轮箱，支持柴电双动力输入，PTI输入1000-2500rpm",
        "minPower": 650,
        "maxPower": 2325,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-1100-1200.webp",
        "dimensions": "1082×1200×1130",
        "weight": 1870
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
        "dataSource": "dwgTechParams_estimated",
        "image": "/images/gearbox/Advance-200-201-230.webp",
        "price": 266000,
        "priceSource": "系统估算",
        "discountRate": 0.1
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
        "dataSource": "dwgTechParams_estimated",
        "image": "/images/gearbox/Advance-1100-1200.webp",
        "price": 277000,
        "priceSource": "系统估算",
        "discountRate": 0.1
    },
    {
        "model": "HC138",
        "series": "HC",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            2,
            2.52,
            3,
            3.57,
            4.05,
            4.45
        ],
        "thrust": 30,
        "centerDistance": 225,
        "dimensions": "520×792×760",
        "weight": 360,
        "controlType": "推拉软轴/电控/气控",
        "price": 18200,
        "discountRate": 0.16,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 275,
        "minPower": 110,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.11,
            0.11,
            0.11,
            0.11,
            0.11,
            0.11
        ],
        "imageUrl": "/images/gearbox/Advance-HC138-.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "sae": [
                "SAE1#1.5寸",
                "SAE1#4寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "8-φ17.5"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HC138-.webp"
    },
    {
        "model": "HC1600",
        "series": "HC",
        "minSpeed": 500,
        "maxSpeed": 1650,
        "ratios": [
            2.03,
            2.5,
            2.96,
            3.55,
            4
        ],
        "thrust": 170,
        "centerDistance": 415,
        "dimensions": "1345×1500×1300",
        "weight": 3000,
        "controlType": "推拉软轴/电控/气控",
        "price": 150000,
        "discountRate": 0.06,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 2079,
        "minPower": 450,
        "powerSource": "传动能力计算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHB10",
                "series": "HGTHB"
            },
            "withCover": {
                "model": "HGTHJB10",
                "series": "HGTHJB"
            },
            "detachable": {
                "model": "HGTHB10/X",
                "series": "HGTHB"
            },
            "interfaces": {
                "sae": [
                    "18\"",
                    "21\""
                ],
                "domestic": [
                    "φ518",
                    "φ540"
                ]
            },
            "detailedOptions": {
                "standard": [
                    {
                        "model": "HGTHB10/18",
                        "interface": "配SAE18\""
                    },
                    {
                        "model": "HGTHB10/21",
                        "interface": "配SAE21\""
                    },
                    {
                        "model": "HGTHB10/φ518",
                        "interface": "配国内机518"
                    },
                    {
                        "model": "HGTHB10/φ540",
                        "interface": "配国内机540"
                    }
                ],
                "withCover": [
                    {
                        "model": "HGTHJB10/18",
                        "interface": "配SAE18\"，带罩"
                    }
                ],
                "detachable": [],
                "gearTooth": []
            }
        },
        "inputSpeedRange": [
            500,
            1650
        ],
        "transmissionCapacityPerRatio": [
            1.26,
            1.2,
            1.1,
            1,
            0.9
        ],
        "imageUrl": "/images/gearbox/Advance-1600.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE18寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "domestic": [
                "φ518",
                "φ540"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HC1600P",
        "series": "HC",
        "minSpeed": 500,
        "maxSpeed": 1650,
        "ratios": [
            2.03,
            2.5,
            2.96,
            3.55,
            4
        ],
        "thrust": 0.44,
        "centerDistance": 1000,
        "dimensions": "相同",
        "weight": 3000,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 130000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHB10",
                "series": "HGTHB"
            },
            "withCover": {
                "model": "HGTHJB10",
                "series": "HGTHJB"
            },
            "detachable": {
                "model": "HGTHB10/X",
                "series": "HGTHB"
            },
            "interfaces": {
                "sae": [
                    "18\"",
                    "21\""
                ],
                "domestic": [
                    "φ518",
                    "φ540"
                ]
            }
        },
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            1.353,
            1.5,
            1.759,
            1.759,
            1.759
        ],
        "imageUrl": "/images/gearbox/Advance-1600.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸"
            ],
            "plainFlange": true,
            "domestic": [
                "φ770"
            ]
        },
        "minPower": 677,
        "maxPower": 2902,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HC200",
        "series": "HC",
        "minSpeed": 1000,
        "maxSpeed": 2200,
        "ratios": [
            1.48,
            1.94,
            2.45,
            2.96,
            3.35,
            4,
            4.53,
            5.06,
            5.47
        ],
        "thrust": 27.5,
        "centerDistance": 190,
        "dimensions": "424×792×754",
        "weight": 280,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 27200,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "maxPower": 288,
        "minPower": 87,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            750,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.131,
            0.131,
            0.131,
            0.131,
            0.131,
            0.118,
            0.106,
            0.094,
            0.087
        ],
        "imageUrl": "/images/gearbox/Advance-200-201-230.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "sae": [
                "SAE1#1.5寸",
                "SAE1#4寸"
            ],
            "boltPatterns": [
                "12-φ11",
                "12-φ12.5",
                "12-φ14",
                "8-φ14"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HC2000",
        "series": "HC",
        "minSpeed": 600,
        "maxSpeed": 1500,
        "ratios": [
            1.97,
            2.28,
            2.52,
            3.13,
            3.52,
            3.91,
            4.4,
            4.5
        ],
        "thrust": 190,
        "centerDistance": 450,
        "dimensions": "1600×1500×1400",
        "weight": 3700,
        "controlType": "推拉软轴/电控/气控",
        "price": 180000,
        "discountRate": 0.06,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 2430,
        "minPower": 840,
        "powerSource": "传动能力计算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHB12.5",
                "series": "HGTHB"
            },
            "detachable": {
                "model": "HGTHB12.5/X",
                "series": "HGTHB"
            },
            "interfaces": {
                "sae": [
                    "18\"",
                    "21\""
                ],
                "domestic": [
                    "φ518",
                    "φ640",
                    "φ700",
                    "φ770"
                ]
            },
            "detailedOptions": {
                "standard": [
                    {
                        "model": "HGTHB12.5/18",
                        "interface": "配SAE18\""
                    },
                    {
                        "model": "HGTHB12.5/21",
                        "interface": "配SAE21\""
                    },
                    {
                        "model": "HGTHB12.5/",
                        "interface": "配国内机518"
                    },
                    {
                        "model": "HGTHB12.5/",
                        "interface": "配国内机640"
                    },
                    {
                        "model": "HGTHB12.5/",
                        "interface": "配国内机640"
                    },
                    {
                        "model": "HGTHB12.5/",
                        "interface": "配国内机700"
                    },
                    {
                        "model": "HGTHB12.5/φ770",
                        "interface": "配国内机770"
                    }
                ],
                "withCover": [],
                "detachable": [],
                "gearTooth": []
            }
        },
        "inputSpeedRange": [
            600,
            1500
        ],
        "transmissionCapacityPerRatio": [
            1.62,
            1.62,
            1.62,
            1.62,
            1.62,
            1.62,
            1.45,
            1.4
        ],
        "imageUrl": "/images/gearbox/Advance-2000.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "domestic": [
                "φ518",
                "φ640",
                "φ700",
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HC2000P",
        "series": "HC",
        "minSpeed": 600,
        "maxSpeed": 1500,
        "ratios": [
            1.97,
            2.5,
            2.96,
            3.5,
            4,
            4.5
        ],
        "thrust": 0.58,
        "centerDistance": 1000,
        "dimensions": "相同",
        "weight": 3700,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 158000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHB12.5",
                "series": "HGTHB"
            },
            "detachable": {
                "model": "HGTHB12.5/X",
                "series": "HGTHB"
            },
            "interfaces": {
                "sae": [
                    "18\"",
                    "21\""
                ],
                "domestic": [
                    "φ518",
                    "φ640",
                    "φ700",
                    "φ770"
                ]
            }
        },
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            1.375,
            1.533,
            1.714,
            1.714,
            1.714,
            1.714
        ],
        "imageUrl": "/images/gearbox/Advance-2000.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE2#1寸"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "minPower": 825,
        "maxPower": 2571,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HC201",
        "series": "HC",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            2.48,
            2.96,
            3.53
        ],
        "thrust": 30,
        "centerDistance": 205,
        "dimensions": "488×691×758",
        "weight": 350,
        "maxPower": 368,
        "minPower": 132,
        "powerSource": "传动能力计算",
        "price": 30600,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.147,
            0.147,
            0.132
        ],
        "imageUrl": "/images/gearbox/Advance-200-201-230.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HC2400",
        "series": "HC",
        "minSpeed": 600,
        "maxSpeed": 1500,
        "ratios": [
            1.97,
            2.48,
            3,
            3.5,
            4
        ],
        "thrust": 240,
        "centerDistance": 470,
        "dimensions": "1350×1520×1370",
        "weight": 4000,
        "maxPower": 2700,
        "minPower": 1080,
        "powerSource": "传动能力计算",
        "price": 105000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            600,
            1500
        ],
        "transmissionCapacityPerRatio": [
            1.8,
            1.8,
            1.8,
            1.8,
            1.8
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HC2700",
        "series": "HC",
        "minSpeed": 500,
        "maxSpeed": 1600,
        "ratios": [
            1.54,
            2.03,
            2.58,
            3.09,
            3.48,
            3.95,
            4.47
        ],
        "thrust": 270,
        "centerDistance": 490,
        "dimensions": "1613×1670×1650",
        "weight": 4700,
        "controlType": "推拉软轴/电控/气控",
        "price": 230000,
        "discountRate": 0.06,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 3280,
        "minPower": 650,
        "powerSource": "传动能力计算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHB16",
                "series": "HGTHB"
            },
            "interfaces": {
                "domestic": [
                    "φ770"
                ]
            },
            "detailedOptions": {
                "standard": [
                    {
                        "model": "HGTHB16/φ770",
                        "interface": "配国内机770"
                    }
                ],
                "withCover": [],
                "detachable": [],
                "gearTooth": []
            }
        },
        "inputSpeedRange": [
            500,
            1600
        ],
        "transmissionCapacityPerRatio": [
            2.05,
            2,
            1.9,
            1.75,
            1.6,
            1.45,
            1.3
        ],
        "imageUrl": "/images/gearbox/Advance-2700.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HC2700P",
        "series": "HC",
        "minSpeed": 500,
        "maxSpeed": 1600,
        "ratios": [
            1.54,
            2.03,
            2.58,
            3.09,
            3.48,
            3.95,
            4.47
        ],
        "thrust": 0.67,
        "centerDistance": 1000,
        "dimensions": "相同",
        "weight": 4700,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 207000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            1.371,
            1.515,
            1.767,
            1.767,
            1.767,
            1.767,
            1.767
        ],
        "imageUrl": "/images/gearbox/Advance-2700.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "minPower": 686,
        "maxPower": 2827,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HC300",
        "series": "HC",
        "minSpeed": 700,
        "maxSpeed": 2500,
        "ratios": [
            1.5,
            1.87,
            2.04,
            2.23,
            2.54,
            3,
            3.53,
            4.1,
            4.47,
            4.61,
            4.94,
            5.44
        ],
        "thrust": 50,
        "centerDistance": 264,
        "dimensions": "680×930×880",
        "weight": 680,
        "controlType": "推拉软轴/电控/气控",
        "price": 24600,
        "discountRate": 0.16,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 643,
        "minPower": 91,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.257,
            0.257,
            0.257,
            0.257,
            0.257,
            0.257,
            0.257,
            0.2,
            0.2,
            0.184,
            0.147,
            0.13
        ],
        "imageUrl": "/images/gearbox/Advance-300.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "sae": [
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ12.5",
                "16-φ14",
                "6-φ17",
                "6-φ17.5",
                "8-φ13.8",
                "8-φ15",
                "8-φ21.75"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "HC350-1",
        "series": "HC",
        "minSpeed": 750,
        "maxSpeed": 2500,
        "ratios": [
            2.96,
            3.48,
            3.68,
            4.1,
            4.42,
            5
        ],
        "thrust": 50,
        "centerDistance": 264,
        "dimensions": "604×886×880",
        "weight": 520,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 42500,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 650,
        "minPower": 118,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            750,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.26,
            0.257,
            0.257,
            0.223,
            0.186,
            0.157
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "HC400",
        "series": "HC",
        "minSpeed": 1000,
        "maxSpeed": 1800,
        "ratios": [
            1.5,
            1.77,
            2.04,
            2.5,
            2.86,
            3,
            3.25,
            3.33,
            3.42,
            3.6,
            4.06,
            4.61,
            4.94
        ],
        "thrust": 82,
        "centerDistance": 264,
        "dimensions": "820×950×890",
        "weight": 820,
        "controlType": "推拉软轴/电控/气控",
        "price": 32150,
        "discountRate": 0.22,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 596,
        "minPower": 190,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            1800
        ],
        "transmissionCapacityPerRatio": [
            0.331,
            0.331,
            0.331,
            0.331,
            0.331,
            0.331,
            0.331,
            0.331,
            0.331,
            0.331,
            0.279,
            0.19,
            0.19
        ],
        "imageUrl": "/images/gearbox/Advance-HCD400A.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "sae": [
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸"
            ],
            "plainFlange": true,
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HC400P",
        "series": "HC",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            1.5,
            1.77,
            2.04,
            2.5,
            2.86,
            3,
            3.25
        ],
        "thrust": 60,
        "centerDistance": 264,
        "dimensions": "604×886×880",
        "weight": 600,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 46000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.331,
            0.331,
            0.331,
            0.331,
            0.279,
            0.279,
            0.19
        ],
        "imageUrl": "/images/gearbox/Advance-HCD400A.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "sae": [
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸"
            ],
            "plainFlange": true,
            "domestic": [
                "φ770"
            ]
        },
        "minPower": 190,
        "maxPower": 828,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HC4500P",
        "series": "HCP",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 7500
    },
    {
        "model": "HC500",
        "series": "HC",
        "minSpeed": 800,
        "maxSpeed": 2100,
        "ratios": [
            1.5,
            1.77,
            2.04,
            2.5,
            2.86,
            3,
            3.48
        ],
        "thrust": 82,
        "centerDistance": 264,
        "dimensions": "900×897×680",
        "weight": 800,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 53000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 840,
        "minPower": 320,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            800,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.4,
            0.4,
            0.4,
            0.4,
            0.4,
            0.4,
            0.4
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HC5000P",
        "series": "HCP",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 8500
    },
    {
        "model": "HC6000P",
        "series": "HCP",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            2.04,
            2.52
        ],
        "transmissionCapacityPerRatio": [
            3.8,
            3.8
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 10000
    },
    {
        "model": "HC600A",
        "series": "HC",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            2,
            2.48,
            2.63,
            3,
            3.58,
            3.89
        ],
        "thrust": 90,
        "centerDistance": 320,
        "dimensions": "745×1214×1126",
        "weight": 1300,
        "controlType": "推拉软轴/电控/气控",
        "price": 57200,
        "discountRate": 0.12,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 1029,
        "minPower": 490,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.49,
            0.49,
            0.49,
            0.49,
            0.49,
            0.49
        ],
        "imageUrl": "/images/gearbox/Advance-HC600A.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HC600A.webp"
    },
    {
        "model": "HC600P",
        "series": "HC",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            2,
            2.48,
            2.63,
            3,
            3.58,
            3.89
        ],
        "thrust": 0.155,
        "centerDistance": 1000,
        "dimensions": "相同",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 60000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            1.359,
            1.486,
            1.706,
            1.706,
            1.706,
            1.706
        ],
        "imageUrl": "/images/gearbox/Advance-HC600A.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "minPower": 1359,
        "maxPower": 3583,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HC65",
        "series": "HC",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            2,
            2.5,
            3,
            3.5,
            4
        ],
        "maxPower": 93,
        "minPower": 24,
        "powerSource": "传动能力计算",
        "price": 12000,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2800
        ],
        "weight": 130,
        "transmissionCapacityPerRatio": [
            0.037,
            0.034,
            0.03,
            0.027,
            0.024
        ],
        "imageUrl": "/images/gearbox/Advance-HC65.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HC系列船用齿轮箱适用于渔船、工作艇等使用的额定转速3000转/分以下的柴油机。产品具有倒顺车、减速及承受螺旋桨推力功能。",
        "dimensions": "351×380×544",
        "inputInterfaces": {
            "boltPatterns": [
                "12-φ11",
                "8-φ11"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HC65.webp",
        "thrust": 14.7,
        "centerDistance": 142
    },
    {
        "model": "HC85",
        "series": "HC",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 52
    },
    {
        "model": "HCA1000",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            2.96
        ],
        "maxPower": 1380,
        "minPower": 600,
        "powerSource": "传动能力计算",
        "price": 150000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            0.6
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 1100,
        "image": "/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp"
    },
    {
        "model": "HCA1000(倾角10°)",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            1,
            2.96
        ],
        "thrust": 100,
        "centerDistance": null,
        "dimensions": "1030×1104×1050",
        "weight": 1100,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 80000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1380,
        "minPower": 600,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            0.6,
            0.6
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp"
    },
    {
        "model": "HCA138",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2600,
        "ratios": [
            1.1,
            1.5,
            2.03,
            2.52,
            2.95
        ],
        "maxPower": 7696,
        "minPower": 2960,
        "powerSource": "传动能力计算",
        "price": 34000,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2600
        ],
        "transmissionCapacityPerRatio": [
            2.96,
            2.96,
            2.96,
            2.96,
            2.96
        ],
        "imageUrl": "/images/gearbox/HCQ138-HCA138-.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "dimensions": "625×567×530",
        "inputInterfaces": {
            "sae": [
                "SAE1#1.5寸",
                "SAE1#4寸"
            ],
            "boltPatterns": [
                "8-φ11",
                "8-φ14",
                "8-φ14.8"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "weight": 200,
        "image": "/images/gearbox/HCQ138-HCA138-.webp"
    },
    {
        "model": "HCA138(倾角5°)",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2600,
        "ratios": [
            2.95
        ],
        "thrust": 25,
        "centerDistance": 183,
        "dimensions": "530×660×616",
        "weight": 200,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 28280,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 221,
        "minPower": 85,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2600
        ],
        "transmissionCapacityPerRatio": [
            0.085
        ],
        "imageUrl": "/images/gearbox/HCQ138-HCA138-.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "sae": [
                "SAE1#1.5寸",
                "SAE1#4寸"
            ],
            "boltPatterns": [
                "8-φ11",
                "8-φ14",
                "8-φ14.8"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/HCQ138-HCA138-.webp"
    },
    {
        "model": "HCA138(倾角7°)",
        "series": "HCA",
        "ratios": [
            1.1,
            1.28,
            1.5,
            2.03,
            2.52,
            2.95
        ],
        "transmissionCapacityPerRatio": [
            0.11,
            0.11,
            0.11,
            0.11,
            0.11,
            0.085
        ],
        "minSpeed": 1000,
        "maxSpeed": 2600,
        "price": 20000,
        "source": "2025选型手册第13页",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "sae": [
                "SAE1#1.5寸",
                "SAE1#4寸"
            ],
            "boltPatterns": [
                "8-φ11",
                "8-φ14",
                "8-φ14.8"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "weight": 200,
        "minPower": 85,
        "maxPower": 286,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/HCQ138-HCA138-.webp",
        "priceSource": "系统估算",
        "discountRate": 0.1,
        "thrust": 25,
        "centerDistance": 185,
        "dimensions": "530×660×616"
    },
    {
        "model": "HCA1400",
        "series": "HCA",
        "minSpeed": 1600,
        "maxSpeed": 2100,
        "ratios": [
            1.03,
            1.52,
            2.03,
            2.5,
            2.53,
            2.93,
            3
        ],
        "maxPower": 6300,
        "minPower": 4800,
        "powerSource": "传动能力计算",
        "price": 360000,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1600,
            2100
        ],
        "transmissionCapacityPerRatio": [
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "dimensions": "1290×1170×850",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE2#1寸"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "weight": 1600,
        "image": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp"
    },
    {
        "model": "HCA1400(倾角7°)",
        "series": "HCA",
        "minSpeed": 1600,
        "maxSpeed": 2100,
        "ratios": [
            2.5,
            2.93,
            3
        ],
        "thrust": 110,
        "centerDistance": null,
        "dimensions": "826×1300×1250",
        "weight": 1600,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 104000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2163,
        "minPower": 1648,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1600,
            2100
        ],
        "transmissionCapacityPerRatio": [
            1.03,
            1.03,
            1.03
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE2#1寸"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp"
    },
    {
        "model": "HCA1401",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1.52,
            2.03,
            2.53,
            2.93
        ],
        "maxPower": 6153,
        "minPower": 2930,
        "powerSource": "传动能力计算",
        "price": 412000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            2.93,
            2.93,
            2.93,
            2.93
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "dimensions": "1300×1170×850",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 1600,
        "image": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp"
    },
    {
        "model": "HCA1401(倾角5°)",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1.52,
            2.03,
            2.53,
            2.93
        ],
        "thrust": 110,
        "centerDistance": null,
        "dimensions": "756×1300×1285",
        "weight": 1600,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 104060,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2165,
        "minPower": 880,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            1.031,
            1.031,
            0.93,
            0.88
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp"
    },
    {
        "model": "HCA300",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            1.5,
            1.52,
            1.96,
            2.5,
            2.57,
            2.95
        ],
        "thrust": 40,
        "centerDistance": 278,
        "dimensions": "620×585×753",
        "weight": 370,
        "maxPower": 6785,
        "minPower": 2950,
        "powerSource": "传动能力计算",
        "price": 66900,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95
        ],
        "imageUrl": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "HCA300(倾角10°)",
        "series": "HCA",
        "ratios": [
            1.52,
            1.96,
            2.5,
            2.95
        ],
        "transmissionCapacityPerRatio": [
            0.25,
            0.25,
            0.25,
            0.235
        ],
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "price": 45000,
        "source": "2025选型手册第13页",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 370,
        "minPower": 235,
        "maxPower": 575,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
        "priceSource": "系统估算",
        "discountRate": 0.1,
        "thrust": 40,
        "centerDistance": 278,
        "dimensions": "620×585×753"
    },
    {
        "model": "HCA301",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            1,
            1.12,
            1.25,
            1.41,
            1.5,
            1.52,
            1.76,
            1.96,
            2.04,
            2.5,
            2.57,
            2.95
        ],
        "thrust": 40,
        "centerDistance": 265,
        "dimensions": "618×585×824",
        "weight": 370,
        "maxPower": 6785,
        "minPower": 2950,
        "powerSource": "传动能力计算",
        "price": 66900,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95
        ],
        "imageUrl": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "boltPatterns": [
                "16-φ14",
                "8-φ13.8",
                "8-φ21"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "HCA301(倾角5°)",
        "series": "HCA",
        "ratios": [
            1.5,
            1.96,
            2.57,
            2.95
        ],
        "transmissionCapacityPerRatio": [
            0.25,
            0.25,
            0.25,
            0.235
        ],
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "price": 45000,
        "source": "2025选型手册第13页",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "boltPatterns": [
                "16-φ14",
                "8-φ13.8",
                "8-φ21"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "weight": 370,
        "minPower": 235,
        "maxPower": 575,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
        "priceSource": "系统估算",
        "discountRate": 0.1,
        "thrust": 40,
        "centerDistance": 265,
        "dimensions": "618×585×824"
    },
    {
        "model": "HCA302",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            1.52,
            1.96,
            2.57,
            2.95
        ],
        "maxPower": 575,
        "minPower": 235,
        "powerSource": "传动能力计算",
        "price": 66900,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            0.25,
            0.25,
            0.25,
            0.235
        ],
        "imageUrl": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "dimensions": "759×688×572",
        "inputInterfaces": {
            "boltPatterns": [
                "8-φ13.8"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "weight": 370,
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "HCA302(倾角7°)",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            1.52,
            1.96,
            2.57,
            2.95
        ],
        "thrust": 40,
        "centerDistance": 267,
        "dimensions": "560×585×764 (不含支架)",
        "weight": 370,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 38120,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 575,
        "minPower": 235,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            0.25,
            0.25,
            0.235,
            0.235
        ],
        "imageUrl": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "boltPatterns": [
                "8-φ13.8"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "HCA700",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            1.18,
            1.51,
            1.97,
            2.5,
            2.73,
            2.84,
            2.92
        ],
        "thrust": 90,
        "centerDistance": 100,
        "dimensions": "835×1104×1156",
        "weight": 1100,
        "maxPower": 7300,
        "minPower": 2920,
        "powerSource": "传动能力计算",
        "price": 163000,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            2.92,
            2.92,
            2.92,
            2.92,
            2.92,
            2.92,
            2.92
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp"
    },
    {
        "model": "HCA700(倾角8°)",
        "series": "HCA",
        "ratios": [
            1.51,
            1.97,
            2.5,
            2.73,
            2.92
        ],
        "transmissionCapacityPerRatio": [
            0.554,
            0.554,
            0.554,
            0.514,
            0.49
        ],
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "price": 101000,
        "source": "2025选型手册第14页",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 1100,
        "minPower": 490,
        "maxPower": 1385,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
        "priceSource": "系统估算",
        "discountRate": 0.1,
        "thrust": 90,
        "dimensions": "835×1104×1156"
    },
    {
        "model": "HCA701",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            1.18,
            2.84
        ],
        "maxPower": 7400,
        "minPower": 2960,
        "powerSource": "传动能力计算",
        "price": 163000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            2.96,
            2.96
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp"
    },
    {
        "model": "HCA701(倾角5°)",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            0.77
        ],
        "thrust": 27.5,
        "centerDistance": null,
        "dimensions": "939×1130×1035",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 62060,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1385,
        "minPower": 554,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.554
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp"
    },
    {
        "model": "HCAG1090",
        "series": "HCAG",
        "minSpeed": 1500,
        "maxSpeed": 4500,
        "ratios": [
            1,
            1.57,
            1.75,
            1.96,
            2.48,
            2.5,
            2.9,
            3
        ],
        "thrust": 16,
        "centerDistance": 160,
        "maxPower": 13500,
        "minPower": 4500,
        "powerSource": "传动能力计算",
        "price": 600000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1500,
            4500
        ],
        "transmissionCapacityPerRatio": [
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 106,
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCAG3050",
        "series": "HCAG",
        "minSpeed": 1000,
        "maxSpeed": 2600,
        "ratios": [
            1.35,
            1.36,
            1.53,
            2.03,
            2.47,
            2.5,
            2.96,
            3
        ],
        "thrust": 50,
        "centerDistance": 326,
        "maxPower": 7800,
        "minPower": 3000,
        "powerSource": "传动能力计算",
        "price": 600000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2600
        ],
        "transmissionCapacityPerRatio": [
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 570,
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCAG5050",
        "series": "HCAG",
        "minSpeed": 1500,
        "maxSpeed": 2500,
        "ratios": [
            2.03,
            2.47,
            2.96
        ],
        "thrust": 110,
        "centerDistance": 110,
        "maxPower": 2359,
        "minPower": 1120,
        "powerSource": "传动能力计算",
        "price": 600000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1500,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.9435,
            0.9157,
            0.7466
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 870,
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCAG6400",
        "series": "HCAG",
        "minSpeed": 1600,
        "maxSpeed": 2100,
        "ratios": [
            2.93,
            3
        ],
        "thrust": 110,
        "centerDistance": 110,
        "maxPower": 2163,
        "minPower": 1648,
        "powerSource": "传动能力计算",
        "price": 600000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1600,
            2100
        ],
        "transmissionCapacityPerRatio": [
            1.03,
            1.03
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 1200,
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCAG7650",
        "series": "HCAG",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1.76,
            2.03,
            2.25,
            2.46,
            2.54,
            2.75
        ],
        "thrust": 135,
        "centerDistance": 135,
        "maxPower": 5775,
        "minPower": 2750,
        "powerSource": "传动能力计算",
        "price": 600000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            2.75,
            2.75,
            2.75,
            2.75,
            2.75,
            2.75
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 1300,
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCAG7650(倾角8°)",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1.76,
            2.03,
            2.25,
            2.46,
            2.54,
            2.75,
            2.96
        ],
        "thrust": 1.403,
        "centerDistance": 1,
        "dimensions": "1.204",
        "weight": 1300,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 479000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2946,
        "minPower": 1403,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            1.403,
            1.403,
            1.403,
            1.403,
            1.403,
            1.403,
            1.403
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCAG9055",
        "series": "HCAG",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1.66,
            1.97,
            2.46,
            2.95
        ],
        "thrust": 225,
        "centerDistance": 225,
        "maxPower": 6195,
        "minPower": 2950,
        "powerSource": "传动能力计算",
        "price": 600000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            2.95,
            2.95,
            2.95,
            2.95
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 1570,
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCAG9055(倾角8°)",
        "series": "HCA",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1.97,
            2.46,
            2.95
        ],
        "thrust": 1.7381,
        "centerDistance": 1,
        "dimensions": "1.356",
        "weight": 1570,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 563300,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 3694,
        "minPower": 1660,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            1.759,
            1.7095,
            1.66
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCA系列船用齿轮箱适用于中型船舶推进系统。产品具有换向、减速及承受螺旋桨推力功能。采用液压湿式多片离合器。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
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
        "dataSource": "dwgTechParams_estimated",
        "image": "/images/gearbox/Advance-1100-1200.webp",
        "price": 142000,
        "priceSource": "系统估算",
        "discountRate": 0.1
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
        "dataSource": "dwgTechParams_estimated",
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
        "price": 360000,
        "priceSource": "2026官方出厂价",
        "discountRate": 0.1
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
        "dataSource": "dwgTechParams_estimated",
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
        "price": 34000,
        "priceSource": "系统估算",
        "discountRate": 0.1
    },
    {
        "model": "HCAM303",
        "series": "HCAM",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            1,
            1.03,
            1.1,
            1.16,
            1.19,
            1.2,
            1.49
        ],
        "thrust": 290,
        "centerDistance": 290,
        "maxPower": 3427,
        "minPower": 1490,
        "powerSource": "传动能力计算",
        "price": 240000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            1.49,
            1.49,
            1.49,
            1.49,
            1.49,
            1.49,
            1.49
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 290,
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "HCAM403",
        "series": "HCAM",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            1.1,
            1.2,
            1.51
        ],
        "thrust": 50,
        "centerDistance": 224,
        "dimensions": "712×586×619",
        "weight": 390,
        "oilCapacity": 18,
        "clutchType": "液压湿式多片摩擦离合器",
        "gearType": "圆柱斜齿轮",
        "transmissionType": "三轴五齿轮传动",
        "workingPressure": "1.8-2.0",
        "maxOilTemp": 85,
        "coolingWaterFlow": 2.5,
        "overhaulPeriod": 10000,
        "efficiency": 0.97,
        "controlType": "推拉软轴/电控",
        "inputShaftType": "SAE1#14/SAE2#11.5",
        "outputShaftDia": 100,
        "applications": [
            "拖网渔船",
            "运输船",
            "工程船"
        ],
        "certifications": [
            "CCS",
            "ZC"
        ],
        "source": "HCAM403型船用齿轮箱使用说明书v2025",
        "price": 50000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 593,
        "minPower": 181,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            0.258,
            0.232,
            0.181
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
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
        "dataSource": "dwgTechParams_estimated",
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
        "price": 57000,
        "priceSource": "系统估算",
        "discountRate": 0.1
    },
    {
        "model": "HCD0FM",
        "series": "HCDF",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 28
    },
    {
        "model": "HCD1000",
        "series": "HCD",
        "minSpeed": 600,
        "maxSpeed": 2100,
        "ratios": [
            2.04,
            2.5,
            3.04,
            3.57,
            4,
            4.47,
            5.05,
            5.56
        ],
        "thrust": 140,
        "centerDistance": 450,
        "dimensions": "1082×1280×1345",
        "weight": 2200,
        "maxPower": 1544,
        "minPower": 320,
        "powerSource": "传动能力计算",
        "price": 89800,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            600,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.735,
            0.735,
            0.735,
            0.735,
            0.735,
            0.661,
            0.588,
            0.533
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
        "inputInterfaces": {
            "sae": [
                "SAE0#0寸",
                "SAE1#8寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "8-φ31.7"
            ],
            "domestic": [
                "φ505",
                "φ518",
                "φ640"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCD1000/2",
        "series": "HCD",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            2.04,
            2.52,
            3.04,
            3.57,
            4,
            4.47
        ],
        "transmissionCapacityPerRatio": [
            0.74,
            0.74,
            0.74,
            0.74,
            0.74,
            0.66
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 2000
    },
    {
        "model": "HCD1200",
        "series": "HCD",
        "minSpeed": 700,
        "maxSpeed": 1900,
        "ratios": [
            2.5,
            3,
            3.43,
            3.7,
            3.74,
            3.95,
            4.14,
            4.45,
            5,
            5.25,
            5.58
        ],
        "thrust": 140,
        "centerDistance": 450,
        "dimensions": "962×1300×1290",
        "weight": 1850,
        "maxPower": 1957,
        "minPower": 515,
        "powerSource": "传动能力计算",
        "price": 255000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            700,
            1900
        ],
        "transmissionCapacityPerRatio": [
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            0.93,
            0.809,
            0.735
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCD138",
        "series": "HCD",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            5.05,
            5.63,
            6.06,
            6.47
        ],
        "thrust": 40,
        "centerDistance": 296,
        "dimensions": "494×800×870",
        "weight": 415,
        "controlType": "推拉软轴/电控/气控",
        "price": 19400,
        "discountRate": 0.16,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 275,
        "minPower": 93,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.11,
            0.11,
            0.099,
            0.093
        ],
        "imageUrl": "/images/gearbox/Advance-HC138-.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
        "inputInterfaces": {
            "sae": [
                "SAE1#1.5寸",
                "SAE1#4寸",
                "SAE14寸",
                "SAE16寸",
                "SAE18寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "8-φ25.5"
            ],
            "domestic": [
                "φ505",
                "φ518"
            ]
        },
        "image": "/images/gearbox/Advance-HCD400A.webp"
    },
    {
        "model": "HCD1400",
        "series": "HCD",
        "minSpeed": 600,
        "maxSpeed": 1900,
        "ratios": [
            3.5,
            3.83,
            4.04,
            4.27,
            4.32,
            4.52,
            4.8,
            5.05
        ],
        "thrust": 175,
        "centerDistance": 485,
        "dimensions": "1260×1380×1360",
        "weight": 2800,
        "maxPower": 2054,
        "minPower": 649,
        "powerSource": "传动能力计算",
        "price": 139000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            600,
            1900
        ],
        "transmissionCapacityPerRatio": [
            1.081,
            1.081,
            1.081,
            1.081,
            1.081,
            1.081,
            1.081,
            1.081
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
        "inputInterfaces": {
            "sae": [
                "SAE0#0寸",
                "SAE1#8寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ17.5",
                "16-φ14",
                "16-φ22",
                "24-φ18"
            ],
            "domestic": [
                "φ518",
                "φ640"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCD1400P",
        "series": "HCD",
        "minSpeed": 600,
        "maxSpeed": 1900,
        "ratios": [
            3.5,
            3.83,
            4.04,
            4.27,
            4.32,
            4.52,
            4.8,
            5.05
        ],
        "thrust": 0.41,
        "centerDistance": 1000,
        "dimensions": "相同",
        "weight": 2800,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 146000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHB8",
                "series": "HGTHB"
            },
            "withCover": {
                "model": "HGTHJB8",
                "series": "HGTHJB"
            },
            "interfaces": {
                "sae": [
                    "18\"",
                    "21\""
                ],
                "domestic": [
                    "φ518",
                    "φ640"
                ]
            }
        },
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            1.364,
            1.516,
            1.786,
            1.8832,
            2.25,
            2.5,
            2.5,
            2.5
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
        "inputInterfaces": {
            "sae": [
                "SAE0#0寸",
                "SAE1#8寸",
                "SAE14寸",
                "SAE16寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ17.5",
                "16-φ14",
                "16-φ22",
                "24-φ18"
            ],
            "domestic": [
                "φ505",
                "φ518"
            ]
        },
        "minPower": 818,
        "maxPower": 4750,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCD1500",
        "series": "HCD",
        "minSpeed": 600,
        "maxSpeed": 1900,
        "ratios": [
            3.5,
            3.83,
            4.04,
            4.27,
            4.65,
            5.06,
            5.47
        ],
        "thrust": 175,
        "centerDistance": 485,
        "dimensions": "1260×1380×1360",
        "weight": 2800,
        "controlType": "推拉软轴/电控/气控",
        "inputShaftType": "按主机飞轮配",
        "rotationDirection": "相反",
        "source": "杭齿厂选型手册2025版5月版",
        "price": 155000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2052,
        "minPower": 580,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1650
        ],
        "transmissionCapacityPerRatio": [
            1.08,
            1.08,
            1.08,
            1.08,
            1.08,
            1.08,
            0.967
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCD1580",
        "series": "HCD",
        "minSpeed": 600,
        "maxSpeed": 1650,
        "ratios": [
            3.5,
            3.83,
            4.04,
            4.27,
            4.32,
            4.8,
            5.05,
            5.5,
            5.86
        ],
        "thrust": 175,
        "centerDistance": 485,
        "dimensions": "1260×1380×1360",
        "weight": 2800,
        "controlType": "推拉软轴/电控/气控",
        "inputShaftType": "按主机飞轮配",
        "rotationDirection": "相反",
        "source": "杭齿厂选型手册2025版5月版",
        "price": 168000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2030,
        "minPower": 627,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1650
        ],
        "transmissionCapacityPerRatio": [
            1.23,
            1.23,
            1.23,
            1.23,
            1.23,
            1.23,
            1.23,
            1.23,
            1.045
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-1400.webp"
    },
    {
        "model": "HCD1600",
        "series": "HCD",
        "minSpeed": 500,
        "maxSpeed": 1650,
        "ratios": [
            2.97,
            3.5,
            3.96,
            4.48,
            4.95,
            5.25,
            5.58,
            5.94
        ],
        "thrust": 200,
        "centerDistance": 520,
        "dimensions": "1291×1620×1590",
        "weight": 4000,
        "controlType": "推拉软轴/电控/气控",
        "inputShaftType": "按主机飞轮配",
        "rotationDirection": "相反",
        "source": "杭齿厂选型手册2025版5月版",
        "price": 165400,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "maxPower": 2129,
        "minPower": 525,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1800
        ],
        "transmissionCapacityPerRatio": [
            1.29,
            1.29,
            1.29,
            1.29,
            1.29,
            1.29,
            1.25,
            1.05
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE18寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "domestic": [
                "φ518",
                "φ540"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCD1600P",
        "series": "HCD",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            4.95,
            5.25,
            5.58,
            5.94
        ],
        "maxPower": 3150,
        "minPower": 980,
        "powerSource": "传动能力计算",
        "price": 255000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            1.26,
            1.2,
            1.06,
            0.98
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE14寸",
                "SAE16寸",
                "SAE18寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "domestic": [
                "φ505",
                "φ518"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
        "thrust": 200,
        "centerDistance": 520,
        "dimensions": "1291×1620×1590",
        "weight": 4000
    },
    {
        "model": "HCD1FM",
        "series": "HCDF",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 38
    },
    {
        "model": "HCD2000",
        "series": "HCD",
        "minSpeed": 600,
        "maxSpeed": 1500,
        "ratios": [
            3,
            3.58,
            3.96,
            4.45,
            4.95,
            5.26
        ],
        "thrust": 220,
        "centerDistance": 560,
        "dimensions": "1600×1620×1645",
        "weight": 4200,
        "maxPower": 2430,
        "minPower": 972,
        "powerSource": "传动能力计算",
        "price": 206000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            600,
            1500
        ],
        "transmissionCapacityPerRatio": [
            1.62,
            1.62,
            1.62,
            1.62,
            1.62,
            1.62
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "domestic": [
                "φ518",
                "φ640",
                "φ700",
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCD2000/2",
        "series": "HCD",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            2.04,
            2.52,
            3,
            3.5
        ],
        "transmissionCapacityPerRatio": [
            1.5,
            1.5,
            1.5,
            1.5
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 4200
    },
    {
        "model": "HCD2000P",
        "series": "HCD",
        "minSpeed": 600,
        "maxSpeed": 1500,
        "ratios": [
            3,
            3.58,
            3.96,
            4.45,
            4.95,
            5.26
        ],
        "thrust": 1000,
        "centerDistance": 560,
        "dimensions": "1600×1620×1645",
        "weight": 4200,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 185000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHB12.5",
                "series": "HGTHB"
            },
            "detachable": {
                "model": "HGTHB12.5/X",
                "series": "HGTHB"
            },
            "interfaces": {
                "sae": [
                    "18\"",
                    "21\""
                ],
                "domestic": [
                    "φ518",
                    "φ640"
                ]
            }
        },
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            1.58,
            1.58,
            1.58,
            1.58,
            1.58,
            1.58
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE14寸",
                "SAE16寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "domestic": [
                "φ505",
                "φ518"
            ]
        },
        "minPower": 948,
        "maxPower": 2370,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCD2400",
        "series": "HCD",
        "minSpeed": 600,
        "maxSpeed": 1600,
        "ratios": [
            3,
            3.46,
            3.96,
            4.59,
            4.95,
            5.53
        ],
        "thrust": 250,
        "centerDistance": 580,
        "dimensions": "1450×1720×1670",
        "weight": 4300,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 211000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2880,
        "minPower": 1080,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1600
        ],
        "transmissionCapacityPerRatio": [
            1.8,
            1.8,
            1.8,
            1.8,
            1.8,
            1.8
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCD2700",
        "series": "HCD",
        "minSpeed": 500,
        "maxSpeed": 1600,
        "ratios": [
            3.65,
            4.04,
            4.5,
            5.05,
            5.48,
            6.11
        ],
        "thrust": 280,
        "centerDistance": 630,
        "dimensions": "1400×1780×1530",
        "weight": 4930,
        "maxPower": 3360,
        "minPower": 900,
        "powerSource": "传动能力计算",
        "price": 280800,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            500,
            1600
        ],
        "transmissionCapacityPerRatio": [
            2.1,
            2.1,
            2.1,
            2.1,
            2.01,
            1.8
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCD2700P",
        "series": "HCD",
        "minSpeed": 500,
        "maxSpeed": 1600,
        "ratios": [
            3.65,
            4.04,
            4.5,
            5.05,
            5.48,
            6.11
        ],
        "thrust": 1000,
        "centerDistance": 630,
        "dimensions": "1400×1780×1530",
        "weight": 4930,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 230500,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHB16",
                "series": "HGTHB"
            },
            "detachable": {
                "model": "HGTHB16/X",
                "series": "HGTHB"
            },
            "interfaces": {
                "domestic": [
                    "φ770"
                ]
            }
        },
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            2.1,
            2.1,
            2.1,
            2.1,
            2.1,
            2.1
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "minPower": 1050,
        "maxPower": 3360,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCD2FM",
        "series": "HCDF",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 45
    },
    {
        "model": "HCD350",
        "series": "HCD",
        "minSpeed": 750,
        "maxSpeed": 2500,
        "ratios": [
            4.08,
            4.55,
            4.81,
            5.1,
            5.47,
            6.2
        ],
        "thrust": 50,
        "centerDistance": 315,
        "dimensions": "610×915×987",
        "weight": 590,
        "maxPower": 650,
        "minPower": 118,
        "powerSource": "传动能力计算",
        "price": 255000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            750,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.26,
            0.245,
            0.245,
            0.223,
            0.186,
            0.157
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "HCD3800",
        "series": "HCD",
        "minSpeed": 500,
        "maxSpeed": 1200,
        "ratios": [
            2.97,
            3.54,
            4.08,
            4.52,
            5.05,
            5.45,
            6.05
        ],
        "thrust": 340,
        "centerDistance": 660,
        "dimensions": "1665×1810×1800",
        "weight": 8000,
        "maxPower": 3390,
        "minPower": 1188,
        "powerSource": "传动能力计算",
        "price": 255000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            500,
            1200
        ],
        "transmissionCapacityPerRatio": [
            2.825,
            2.825,
            2.825,
            2.825,
            2.825,
            2.8,
            2.375
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCD400",
        "series": "HCD",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 620
    },
    {
        "model": "HCD400A",
        "series": "HCD",
        "minSpeed": 1000,
        "maxSpeed": 1800,
        "ratios": [
            1.5,
            1.96,
            2.45,
            2.96,
            3.55,
            3.94,
            4.47,
            5.05,
            5.56
        ],
        "thrust": 82,
        "centerDistance": 355,
        "dimensions": null,
        "weight": 1100,
        "controlType": "推拉软轴/电控/气控",
        "price": 38150,
        "discountRate": 0.22,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 490,
        "minPower": 196,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.272,
            0.272,
            0.272,
            0.272,
            0.272,
            0.272,
            0.245,
            0.216,
            0.196
        ],
        "imageUrl": "/images/gearbox/Advance-HCD400A.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
        "inputInterfaces": {
            "sae": [
                "SAE0#0寸",
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸",
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
        "image": "/images/gearbox/Advance-HCD400A.webp"
    },
    {
        "model": "HCD400P",
        "series": "HCD",
        "minSpeed": 1000,
        "maxSpeed": 3000,
        "ratios": [
            3.96,
            4.43,
            4.7
        ],
        "maxPower": 993,
        "minPower": 331,
        "powerSource": "传动能力计算",
        "price": 255000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            3000
        ],
        "transmissionCapacityPerRatio": [
            0.331,
            0.331,
            0.331
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
        "inputInterfaces": {
            "sae": [
                "SAE0#0寸",
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸",
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
        "image": "/images/gearbox/Advance-HCD400A.webp",
        "weight": 620
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
        "dataSource": "dwgTechParams_estimated",
        "image": "/images/gearbox/Advance-HCD400A.webp",
        "price": 85000,
        "priceSource": "系统估算",
        "discountRate": 0.1
    },
    {
        "model": "HCD450",
        "series": "HCD",
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
        "thrust": 82,
        "centerDistance": 355,
        "dimensions": "761×984×1040",
        "weight": 800,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 84250,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 756,
        "minPower": 279,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.36,
            0.331,
            0.331,
            0.331,
            0.294,
            0.279
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE14寸",
                "SAE16寸",
                "SAE18寸",
                "SAE21寸"
            ],
            "boltPatterns": [
                "8-φ27.5"
            ],
            "domestic": [
                "φ505",
                "φ518"
            ]
        },
        "image": "/images/gearbox/Advance-HCD400A.webp"
    },
    {
        "model": "HCD450P",
        "series": "HCD",
        "minPower": 360,
        "maxPower": 756,
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
        "thrust": 82,
        "weight": 800,
        "centerDistance": 355,
        "transmissionCapacityPerRatio": [
            0.36,
            0.36,
            0.36,
            0.36,
            0.36,
            0.36
        ],
        "dataSource": "dwgTechParams",
        "image": "/images/gearbox/Advance-HCD400A.webp",
        "price": 87000,
        "priceSource": "系统估算",
        "discountRate": 0.1,
        "dimensions": "761×984×1040"
    },
    {
        "model": "HCD600/2",
        "series": "HCD",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 950
    },
    {
        "model": "HCD600A",
        "series": "HCD",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            4.18,
            4.43,
            4.7,
            5,
            5.44,
            5.71
        ],
        "thrust": 90,
        "centerDistance": 415,
        "dimensions": "745×1214×1271",
        "weight": 1550,
        "controlType": "推拉软轴/电控/气控",
        "price": 60600,
        "discountRate": 0.12,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 1029,
        "minPower": 430,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.49,
            0.49,
            0.49,
            0.49,
            0.45,
            0.43
        ],
        "imageUrl": "/images/gearbox/Advance-HC600A.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
                "12-φ12.5",
                "12-φ17.5",
                "16-φ14",
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
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCD600P",
        "series": "HCD",
        "minSpeed": 1000,
        "maxSpeed": 3000,
        "ratios": [
            4.43,
            5,
            5.44,
            5.71,
            6.06
        ],
        "maxPower": 1350,
        "minPower": 324,
        "powerSource": "传动能力计算",
        "price": 255000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            3000
        ],
        "transmissionCapacityPerRatio": [
            0.45,
            0.41,
            0.364,
            0.338,
            0.324
        ],
        "imageUrl": "/images/gearbox/Advance-HC600A.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
                "12-φ12.5",
                "12-φ17.5",
                "16-φ14",
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
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCD68",
        "series": "HCD",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 48
    },
    {
        "model": "HCD700",
        "series": "HCD",
        "minSpeed": 600,
        "maxSpeed": 1800,
        "ratios": [
            3.96,
            4.25,
            4.41,
            4.48,
            4.95,
            5.56,
            5.94
        ],
        "thrust": 90,
        "centerDistance": 430,
        "dimensions": "741×1182×1186",
        "weight": 1328,
        "maxPower": 990,
        "minPower": 300,
        "powerSource": "传动能力计算",
        "price": 255000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            600,
            1800
        ],
        "transmissionCapacityPerRatio": [
            0.55,
            0.55,
            0.53,
            0.53,
            0.515,
            0.515,
            0.5
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCD800",
        "series": "HCD",
        "minSpeed": 600,
        "maxSpeed": 2100,
        "ratios": [
            2.04,
            2.52,
            3.04,
            3.57,
            4,
            4.47,
            5.05,
            5.5
        ],
        "thrust": 110,
        "centerDistance": 450,
        "dimensions": "1056×1280×1341",
        "weight": 2250,
        "maxPower": 1092,
        "minPower": 228,
        "powerSource": "传动能力计算",
        "price": 86100,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            900,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.52,
            0.52,
            0.52,
            0.52,
            0.52,
            0.468,
            0.414,
            0.38
        ],
        "imageUrl": "/images/gearbox/Advance-800-1000.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCD800/2",
        "series": "HCD",
        "minSpeed": null,
        "maxSpeed": null,
        "ratios": [
            2.04,
            2.52,
            3.04,
            3.57,
            4,
            4.47
        ],
        "transmissionCapacityPerRatio": [
            0.52,
            0.52,
            0.52,
            0.52,
            0.52,
            0.47
        ],
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 1350
    },
    {
        "model": "HCD800P",
        "series": "HCD",
        "minSpeed": 600,
        "maxSpeed": 2100,
        "ratios": [
            2.04,
            2.52,
            3.04,
            3.57,
            4,
            4.47,
            5.05,
            5.5
        ],
        "thrust": 0.225,
        "centerDistance": 1000,
        "dimensions": "相同",
        "weight": 2250,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 107000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHT8.6",
                "series": "HGTHT",
                "alternatives": [
                    "HGTLX8.6"
                ]
            },
            "detachable": {
                "model": "HGTHT8.6/X",
                "series": "HGTHT"
            },
            "interfaces": {
                "sae": [
                    "14\"",
                    "16\"",
                    "18\"",
                    "21\""
                ],
                "domestic": [
                    "φ505",
                    "φ518"
                ]
            }
        },
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            1.351,
            1.486,
            1.718,
            1.8514,
            2.222,
            2.48,
            2.48,
            2.48
        ],
        "imageUrl": "/images/gearbox/Advance-800-1000.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "minPower": 811,
        "maxPower": 5208,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCDS1200",
        "series": "HCD",
        "minSpeed": 600,
        "maxSpeed": 1900,
        "ratios": [
            3.95,
            4.45,
            5,
            5.58
        ],
        "thrust": 0.93,
        "centerDistance": 140,
        "dimensions": "450",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 133000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1767,
        "minPower": 390,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1900
        ],
        "transmissionCapacityPerRatio": [
            0.93,
            0.93,
            0.833,
            0.65
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCDS1400",
        "series": "HCD",
        "minSpeed": 600,
        "maxSpeed": 1800,
        "ratios": [
            4.04,
            4.52,
            5.05,
            5.5,
            5.86
        ],
        "thrust": 1.03,
        "centerDistance": 175,
        "dimensions": "485",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 146000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1854,
        "minPower": 570,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1800
        ],
        "transmissionCapacityPerRatio": [
            1.03,
            1.03,
            1.03,
            1.03,
            0.95
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCDS1600",
        "series": "船用双速",
        "minSpeed": 500,
        "maxSpeed": 1650,
        "ratios": [
            2.97,
            3.5,
            3.96,
            4.48,
            4.95,
            5.25
        ],
        "transmissionCapacityPerRatio": [
            1.213,
            1.213,
            1.213,
            1.213,
            1.213,
            1.164
        ],
        "thrust": 200,
        "centerDistance": 520,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "双速齿轮箱，具有顺快、顺慢、倒车功能",
        "minPower": 582,
        "maxPower": 2001,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-1600.webp"
    },
    {
        "model": "HCDS2000",
        "series": "船用双速",
        "minSpeed": 600,
        "maxSpeed": 1500,
        "ratios": [
            3,
            3.58,
            3.96,
            4.45,
            4.95,
            5.26,
            5.43,
            5.75,
            6.05
        ],
        "transmissionCapacityPerRatio": [
            1.48,
            1.48,
            1.48,
            1.48,
            1.42,
            1.34,
            1.23,
            1.19,
            1.19
        ],
        "thrust": 220,
        "centerDistance": 560,
        "source": "杭齿厂选型手册2025版5月版",
        "note": "双速齿轮箱，具有顺快、顺慢、倒车功能",
        "minPower": 714,
        "maxPower": 2220,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-HCD400A.webp"
    },
    {
        "model": "HCDS2700",
        "series": "HCD",
        "minSpeed": 500,
        "maxSpeed": 1400,
        "ratios": [
            3.65,
            4.04,
            4.5,
            5.05,
            5.48,
            6.11
        ],
        "thrust": 2.05,
        "centerDistance": 280,
        "dimensions": "630",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 230500,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2870,
        "minPower": 850,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            500,
            1400
        ],
        "transmissionCapacityPerRatio": [
            2.05,
            2.05,
            2.05,
            2.05,
            1.96,
            1.7
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCDS302",
        "series": "HCD",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            4,
            4.48,
            5.05,
            5.52,
            5.9,
            6.56,
            7.06,
            7.63
        ],
        "thrust": 0.257,
        "centerDistance": 60,
        "dimensions": "355",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 74630,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 643,
        "minPower": 130,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.257,
            0.257,
            0.257,
            0.221,
            0.2,
            0.184,
            0.147,
            0.13
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "HCDS400",
        "series": "HCD",
        "minSpeed": 1000,
        "maxSpeed": 1800,
        "ratios": [
            3.96,
            4.43,
            5,
            5.53,
            5.89
        ],
        "thrust": 0.331,
        "centerDistance": 82,
        "dimensions": "355",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 81000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 596,
        "minPower": 280,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            1800
        ],
        "transmissionCapacityPerRatio": [
            0.331,
            0.331,
            0.331,
            0.3,
            0.28
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCDS600",
        "series": "HCD",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            4.18,
            4.43,
            5,
            5.44,
            5.71
        ],
        "thrust": 0.48,
        "centerDistance": 90,
        "dimensions": "415",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 94000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1008,
        "minPower": 380,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.48,
            0.48,
            0.45,
            0.41,
            0.38
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCDS800",
        "series": "HCD",
        "minSpeed": 600,
        "maxSpeed": 1800,
        "ratios": [
            3.96,
            4.39,
            4.9,
            5.47,
            5.89
        ],
        "thrust": 0.625,
        "centerDistance": 110,
        "dimensions": "450",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 107000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1125,
        "minPower": 300,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1800
        ],
        "transmissionCapacityPerRatio": [
            0.625,
            0.625,
            0.58,
            0.54,
            0.5
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/e1c6f75e-8c4b-4cfc-9c73-b4ff4c9cd5b8.png",
        "introduction": "HCD系列船用齿轮箱适用于大中型船舶推进系统。该系列产品具有大功率传递能力,可承受较大的螺旋桨推力。采用液压湿式多片离合器,换向平稳。",
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCDX300",
        "series": "HCDX",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 180
    },
    {
        "model": "HCDX400",
        "series": "HCDX",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 260
    },
    {
        "model": "HCDX600",
        "series": "HCDX",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 400
    },
    {
        "model": "HCDX800",
        "series": "HCDX",
        "minSpeed": null,
        "maxSpeed": null,
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
        "thrust": null,
        "centerDistance": null,
        "source": "杭齿厂选型手册2025版5月版",
        "weight": 550
    },
    {
        "model": "HCG1068",
        "series": "HCG",
        "minSpeed": 1500,
        "maxSpeed": 4000,
        "ratios": [
            1.26,
            1.51,
            1.93,
            2.48,
            2.78
        ],
        "maxPower": 11600,
        "minPower": 4350,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1500,
            4000
        ],
        "transmissionCapacityPerRatio": [
            2.9,
            2.9,
            2.9,
            2.9,
            2.9
        ],
        "imageUrl": "/images/gearbox/06-16A-26.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCG系列船用齿轮箱适用于各类船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 46,
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCG1220",
        "series": "HCG",
        "minSpeed": 1500,
        "maxSpeed": 4500,
        "ratios": [
            1,
            1.96,
            2.48,
            3
        ],
        "thrust": 0.0887,
        "centerDistance": 0,
        "dimensions": "0.0603",
        "weight": 63,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 126500,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 441,
        "minPower": 128,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1500,
            4500
        ],
        "transmissionCapacityPerRatio": [
            0.098,
            0.0915,
            0.085,
            0.0915
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCG系列船用齿轮箱适用于各类船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCG1280-1",
        "series": "HCG",
        "minSpeed": 1500,
        "maxSpeed": 3600,
        "ratios": [
            1,
            1.3,
            2,
            2.48,
            3
        ],
        "thrust": 0.1162,
        "centerDistance": 0,
        "dimensions": "0.0775",
        "weight": 73,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 131000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 500,
        "minPower": 171,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1500,
            3600
        ],
        "transmissionCapacityPerRatio": [
            0.139,
            0.1243,
            0.12,
            0.1243,
            0.114
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCG系列船用齿轮箱适用于各类船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-1400.webp"
    },
    {
        "model": "HCG1305-3",
        "series": "HCG",
        "minSpeed": 1500,
        "maxSpeed": 3000,
        "ratios": [
            1.22,
            1.97,
            2.5,
            2.92
        ],
        "thrust": 0.1864,
        "centerDistance": 0,
        "dimensions": "0.1296",
        "weight": 120,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 132875,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 657,
        "minPower": 267,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1500,
            3000
        ],
        "transmissionCapacityPerRatio": [
            0.219,
            0.1985,
            0.178,
            0.1985
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCG系列船用齿轮箱适用于各类船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-1400.webp"
    },
    {
        "model": "HCG1400",
        "series": "HCG",
        "minSpeed": 1500,
        "maxSpeed": 3000,
        "ratios": [
            1,
            1.11,
            1.53,
            1.78,
            2.03,
            2.21,
            2.6
        ],
        "maxPower": 8880,
        "minPower": 4440,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1500,
            3000
        ],
        "transmissionCapacityPerRatio": [
            2.96,
            2.96,
            2.96,
            2.96,
            2.96,
            2.96,
            2.96
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCG系列船用齿轮箱适用于各类船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 160,
        "image": "/images/gearbox/Advance-1400.webp"
    },
    {
        "model": "HCG1500",
        "series": "HCG",
        "minSpeed": 1500,
        "maxSpeed": 3000,
        "ratios": [
            1.11,
            1.13,
            1.26,
            1.5,
            1.74,
            1.97,
            2
        ],
        "maxPower": 7770,
        "minPower": 3885,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1500,
            3000
        ],
        "transmissionCapacityPerRatio": [
            2.59,
            2.59,
            2.59,
            2.59,
            2.59,
            2.59,
            2.59
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCG系列船用齿轮箱适用于各类船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 185,
        "image": "/images/gearbox/Advance-1400.webp"
    },
    {
        "model": "HCG1665",
        "series": "HCG",
        "minSpeed": 1500,
        "maxSpeed": 3000,
        "ratios": [
            1.11,
            1.26,
            1.74,
            2,
            2.59
        ],
        "maxPower": 7770,
        "minPower": 3885,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1500,
            3000
        ],
        "transmissionCapacityPerRatio": [
            2.59,
            2.59,
            2.59,
            2.59,
            2.59
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCG系列船用齿轮箱适用于各类船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 248,
        "image": "/images/gearbox/Advance-1600.webp"
    },
    {
        "model": "HCG2050",
        "series": "HCG",
        "minSpeed": 1500,
        "maxSpeed": 2600,
        "ratios": [
            1.5,
            2.03,
            2.04,
            2.5,
            2.52
        ],
        "maxPower": 7800,
        "minPower": 4500,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1500,
            2600
        ],
        "transmissionCapacityPerRatio": [
            3,
            3,
            3,
            3,
            3
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCG系列船用齿轮箱适用于各类船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 342,
        "image": "/images/gearbox/Advance-2000.webp"
    },
    {
        "model": "HCG3050",
        "series": "HCG",
        "minSpeed": 1000,
        "maxSpeed": 2600,
        "ratios": [
            1.35,
            1.5,
            2.03,
            2.04,
            2.5
        ],
        "maxPower": 7800,
        "minPower": 3000,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2600
        ],
        "transmissionCapacityPerRatio": [
            3,
            3,
            3,
            3,
            3
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCG系列船用齿轮箱适用于各类船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 570,
        "image": "/images/gearbox/Advance-2700.webp"
    },
    {
        "model": "HCG5050",
        "series": "HCG",
        "minSpeed": 1500,
        "maxSpeed": 2500,
        "ratios": [
            1.53,
            2.03,
            2.5,
            2.96
        ],
        "thrust": 0.9157,
        "centerDistance": 0,
        "dimensions": "0.6319",
        "weight": 950,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 413750,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2500,
        "minPower": 1355,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1500,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.943,
            0.9487,
            0.903,
            1
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCG系列船用齿轮箱适用于各类船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCG6400",
        "series": "HCG",
        "minSpeed": 1600,
        "maxSpeed": 2100,
        "ratios": [
            1.48,
            2.02,
            2.55,
            3.07
        ],
        "maxPower": 2165,
        "minPower": 1424,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1600,
            2100
        ],
        "transmissionCapacityPerRatio": [
            1.031,
            1.031,
            1.031,
            0.89
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCG系列船用齿轮箱适用于各类船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 950,
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCG7650",
        "series": "HCG",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1.55,
            1.83,
            2.04,
            2.23
        ],
        "maxPower": 5817,
        "minPower": 2770,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            2.77,
            2.77,
            2.77,
            2.77
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCG系列船用齿轮箱适用于各类船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 1230,
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCG9060",
        "series": "HCG",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1.58,
            1.66,
            2.04,
            2.54,
            2.74
        ],
        "maxPower": 6216,
        "minPower": 2960,
        "powerSource": "传动能力计算",
        "price": 300000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            2.96,
            2.96,
            2.96,
            2.96,
            2.96
        ],
        "imageUrl": "/images/gearbox/06-16A-26.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCG系列船用齿轮箱适用于各类船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 1575,
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL100",
        "series": "HCL",
        "minSpeed": 1000,
        "maxSpeed": 2000,
        "ratios": [
            1
        ],
        "maxPower": 210,
        "thrust": 20,
        "centerDistance": null,
        "dimensions": "570×420×535",
        "weight": 156,
        "controlType": "推拉软轴/电控",
        "price": 6760,
        "discountRate": 0.12,
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            750,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.105
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "sae": [
                "SAE1#0寸",
                "SAE1#1.5寸",
                "SAE1#4寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "8-φ12.5"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "minPower": 105,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL1000",
        "series": "HCL",
        "minSpeed": 750,
        "maxSpeed": 1000,
        "transmissionCapacity": 3,
        "maxPower": 1047,
        "minPower": 785,
        "powerSource": "传动能力计算",
        "price": 100000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            750,
            1800
        ],
        "ratios": [
            1
        ],
        "weight": 800,
        "dimensions": "915×800×1005",
        "transmissionCapacityPerRatio": [
            1.047
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL1000F",
        "series": "HCL",
        "minSpeed": 1000,
        "maxSpeed": 1800,
        "transmissionCapacity": 3,
        "maxPower": 1885,
        "minPower": 1047,
        "powerSource": "传动能力计算",
        "price": 100000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            1800
        ],
        "ratios": [
            1
        ],
        "weight": 800,
        "dimensions": "915×800×1005",
        "transmissionCapacityPerRatio": [
            1.047
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL1000S",
        "series": "HCL",
        "minSpeed": 750,
        "maxSpeed": 1000,
        "transmissionCapacity": 3,
        "maxPower": 1047,
        "minPower": 785,
        "powerSource": "传动能力计算",
        "price": 100000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            750,
            1000
        ],
        "ratios": [
            1
        ],
        "weight": 800,
        "dimensions": "915×800×1005",
        "transmissionCapacityPerRatio": [
            1.047
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL100F",
        "series": "HCL",
        "minSpeed": 1500,
        "maxSpeed": 2500,
        "transmissionCapacity": 0.628,
        "thrust": 210,
        "centerDistance": 210,
        "maxPower": 263,
        "minPower": 158,
        "powerSource": "传动能力计算",
        "price": 45000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1500,
            2500
        ],
        "ratios": [
            1
        ],
        "weight": 156,
        "dimensions": "570×420×535",
        "transmissionCapacityPerRatio": [
            0.105
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "sae": [
                "SAE1#0寸",
                "SAE1#1.5寸",
                "SAE1#4寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "8-φ12.5"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL100S",
        "series": "HCL",
        "minSpeed": 750,
        "maxSpeed": 1500,
        "transmissionCapacity": 0.335,
        "thrust": 156,
        "centerDistance": 156,
        "maxPower": 158,
        "minPower": 79,
        "powerSource": "传动能力计算",
        "price": 36000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            750,
            1500
        ],
        "ratios": [
            1
        ],
        "weight": 156,
        "dimensions": "570×420×535",
        "transmissionCapacityPerRatio": [
            0.105
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "sae": [
                "SAE1#0寸",
                "SAE1#1.5寸",
                "SAE1#4寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "8-φ12.5"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
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
        "centerDistance": null,
        "dimensions": "554×425×635",
        "weight": 210,
        "controlType": "推拉软轴/电控",
        "price": 8800,
        "discountRate": 0.12,
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            750,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.262
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL250A",
        "series": "HCL",
        "minSpeed": 750,
        "maxSpeed": 2500,
        "ratios": [
            1
        ],
        "thrust": null,
        "centerDistance": null,
        "dimensions": "554×425×635",
        "weight": 210,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 28000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "inputSpeedRange": [
            750,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.262
        ],
        "transferCapacity": [
            0.262
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
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
        "minPower": 197,
        "maxPower": 655,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL250F",
        "series": "HCL",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "transmissionCapacity": 0.837,
        "thrust": 210,
        "centerDistance": 210,
        "maxPower": 655,
        "minPower": 262,
        "powerSource": "传动能力计算",
        "price": 60000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "ratios": [
            1
        ],
        "weight": 210,
        "dimensions": "554×425×635",
        "transmissionCapacityPerRatio": [
            0.262
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL250S",
        "series": "HCL",
        "minSpeed": 750,
        "maxSpeed": 1000,
        "transmissionCapacity": 0.628,
        "thrust": 210,
        "centerDistance": 210,
        "maxPower": 262,
        "minPower": 197,
        "powerSource": "传动能力计算",
        "price": 36000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            750,
            1000
        ],
        "ratios": [
            1
        ],
        "weight": 210,
        "dimensions": "554×425×635",
        "transmissionCapacityPerRatio": [
            0.262
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL30",
        "series": "HCL",
        "minSpeed": 1000,
        "maxSpeed": 2000,
        "ratios": [
            1
        ],
        "maxPower": 62,
        "thrust": 10,
        "centerDistance": null,
        "dimensions": "345×310×455",
        "weight": 100,
        "controlType": "推拉软轴/电控",
        "price": 5320,
        "discountRate": 0.12,
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            750,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.031
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "sae": [
                "SAE1#0寸",
                "SAE1#1.5寸",
                "SAE3#11.5寸",
                "SAE4#10寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ11",
                "8-φ11"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "minPower": 31,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL30F",
        "series": "HCL",
        "minSpeed": 1500,
        "maxSpeed": 2500,
        "transmissionCapacity": 0.335,
        "thrust": 156,
        "centerDistance": 156,
        "maxPower": 78,
        "minPower": 47,
        "powerSource": "传动能力计算",
        "price": 36000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1500,
            2500
        ],
        "ratios": [
            1
        ],
        "weight": 100,
        "dimensions": "345×310×455",
        "transmissionCapacityPerRatio": [
            0.031
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "sae": [
                "SAE1#0寸",
                "SAE1#1.5寸",
                "SAE3#11.5寸",
                "SAE4#10寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ11",
                "8-φ11"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL30S",
        "series": "HCL",
        "minSpeed": 750,
        "maxSpeed": 1500,
        "transmissionCapacity": 0.262,
        "thrust": 100,
        "centerDistance": 100,
        "maxPower": 47,
        "minPower": 23,
        "powerSource": "传动能力计算",
        "price": 30000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            750,
            1500
        ],
        "ratios": [
            1
        ],
        "weight": 100,
        "dimensions": "345×310×455",
        "transmissionCapacityPerRatio": [
            0.031
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "sae": [
                "SAE1#0寸",
                "SAE1#1.5寸",
                "SAE3#11.5寸",
                "SAE4#10寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ11",
                "8-φ11"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL320",
        "series": "HCL",
        "minSpeed": 1000,
        "maxSpeed": 2000,
        "ratios": [
            1
        ],
        "maxPower": 670,
        "thrust": 45,
        "centerDistance": null,
        "dimensions": "554×425×635",
        "weight": 210,
        "controlType": "推拉软轴/电控",
        "price": 9100,
        "discountRate": 0.12,
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            500,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.335
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "sae": [
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
        "minPower": 335,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL320F",
        "series": "HCL",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "transmissionCapacity": 1.047,
        "thrust": 450,
        "centerDistance": 450,
        "maxPower": 838,
        "minPower": 335,
        "powerSource": "传动能力计算",
        "price": 60000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "ratios": [
            1
        ],
        "weight": 210,
        "dimensions": "554×425×635",
        "transmissionCapacityPerRatio": [
            0.335
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "sae": [
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL320S",
        "series": "HCL",
        "minSpeed": 500,
        "maxSpeed": 1000,
        "transmissionCapacity": 0.837,
        "thrust": 210,
        "centerDistance": 210,
        "maxPower": 335,
        "minPower": 168,
        "powerSource": "传动能力计算",
        "price": 36000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            500,
            1000
        ],
        "ratios": [
            1
        ],
        "weight": 210,
        "dimensions": "554×425×635",
        "transmissionCapacityPerRatio": [
            0.335
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "sae": [
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL600",
        "series": "HCL",
        "minSpeed": 1000,
        "maxSpeed": 2000,
        "ratios": [
            1
        ],
        "maxPower": 1256,
        "thrust": 70,
        "centerDistance": null,
        "dimensions": "746×560×688",
        "weight": 450,
        "controlType": "推拉软轴/电控",
        "price": 21600,
        "discountRate": 0.12,
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            750,
            1600
        ],
        "transmissionCapacityPerRatio": [
            0.628
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "sae": [
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸",
                "SAE2#1寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "10-φ20",
                "8-φ13.8",
                "8-φ15"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "minPower": 628,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL600F",
        "series": "HCL",
        "minSpeed": 1000,
        "maxSpeed": 1600,
        "transmissionCapacity": 1.047,
        "thrust": 450,
        "centerDistance": 450,
        "maxPower": 1005,
        "minPower": 628,
        "powerSource": "传动能力计算",
        "price": 45000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            1600
        ],
        "ratios": [
            1
        ],
        "weight": 450,
        "dimensions": "746×560×688",
        "transmissionCapacityPerRatio": [
            0.628
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "sae": [
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸",
                "SAE2#1寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "10-φ20",
                "8-φ13.8",
                "8-φ15"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL600S",
        "series": "HCL",
        "minSpeed": 750,
        "maxSpeed": 1000,
        "transmissionCapacity": 1.047,
        "thrust": 450,
        "centerDistance": 450,
        "maxPower": 628,
        "minPower": 471,
        "powerSource": "传动能力计算",
        "price": 45000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            750,
            1000
        ],
        "ratios": [
            1
        ],
        "weight": 450,
        "dimensions": "746×560×688",
        "transmissionCapacityPerRatio": [
            0.628
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "sae": [
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸",
                "SAE2#1寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "10-φ20",
                "8-φ13.8",
                "8-φ15"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
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
        "dataSource": "dwgTechParams_estimated",
        "image": "/images/gearbox/Advance-800-1000.webp",
        "price": 804000,
        "priceSource": "系统估算",
        "discountRate": 0.1
    },
    {
        "model": "HCL800",
        "series": "HCL",
        "minSpeed": 750,
        "maxSpeed": 1800,
        "ratios": [
            1
        ],
        "thrust": null,
        "centerDistance": null,
        "dimensions": "746×560×688",
        "weight": 450,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 83000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "inputSpeedRange": [
            750,
            1800
        ],
        "transmissionCapacityPerRatio": [
            0.837
        ],
        "transferCapacity": [
            0.837
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "minPower": 628,
        "maxPower": 1507,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL800F",
        "series": "HCL",
        "minSpeed": 1000,
        "maxSpeed": 1800,
        "ratios": [
            1.5,
            1.77,
            2.04,
            2.5,
            2.86,
            3
        ],
        "thrust": 10,
        "centerDistance": 800,
        "maxPower": 5400,
        "minPower": 3000,
        "powerSource": "传动能力计算",
        "price": 90000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            1800
        ],
        "transmissionCapacityPerRatio": [
            3,
            3,
            3,
            3,
            3,
            3
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 450,
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCL800S",
        "series": "HCL",
        "minSpeed": 750,
        "maxSpeed": 1000,
        "ratios": [
            1.5,
            1.77,
            2.04,
            2.5,
            2.86,
            3
        ],
        "thrust": 450,
        "centerDistance": 450,
        "maxPower": 3000,
        "minPower": 2250,
        "powerSource": "传动能力计算",
        "price": 60000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            750,
            1000
        ],
        "transmissionCapacityPerRatio": [
            3,
            3,
            3,
            3,
            3,
            3
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCL系列船用齿轮箱是轻型船用齿轮箱,适用于小型船舶和快艇。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 450,
        "image": "/images/gearbox/Advance-800-1000.webp"
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
        "dataSource": "dwgTechParams_estimated",
        "image": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp",
        "price": 412000,
        "priceSource": "2026官方统一售价",
        "discountRate": 0
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
        "dataSource": "dwgTechParams_estimated",
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
        "price": 48000,
        "priceSource": "系统估算",
        "discountRate": 0.1
    },
    {
        "model": "HCM165",
        "series": "HCM",
        "minSpeed": 1500,
        "maxSpeed": 3600,
        "ratios": [
            1.18,
            1.22,
            1.24,
            1.97,
            2.5,
            2.92
        ],
        "thrust": 146,
        "centerDistance": 146,
        "maxPower": 10512,
        "minPower": 4380,
        "powerSource": "传动能力计算",
        "price": 120000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1500,
            3600
        ],
        "transmissionCapacityPerRatio": [
            2.92,
            2.92,
            2.92,
            2.92,
            2.92,
            2.92
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCM系列船用齿轮箱是中型船用齿轮箱系列。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 130.5,
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCM303",
        "series": "HCM",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1,
            1.03,
            1.15,
            1.16,
            1.19,
            1.49
        ],
        "thrust": 190,
        "centerDistance": 190,
        "maxPower": 3129,
        "minPower": 1490,
        "powerSource": "传动能力计算",
        "price": 80000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            1.49,
            1.49,
            1.49,
            1.49,
            1.49,
            1.49
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCM系列船用齿轮箱是中型船用齿轮箱系列。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 290,
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "HCM403",
        "series": "HCM",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            1,
            1.1,
            1.11,
            1.2,
            1.51,
            1.53,
            1.78,
            2.03,
            2.21,
            2.6
        ],
        "thrust": 200,
        "centerDistance": 200,
        "maxPower": 5980,
        "minPower": 2600,
        "powerSource": "传动能力计算",
        "price": 120000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            2.6,
            2.6,
            2.6,
            2.6,
            2.6,
            2.6,
            2.6,
            2.6,
            2.6,
            2.6
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCM系列船用齿轮箱是中型船用齿轮箱系列。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 390,
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCN120",
        "series": "HCN",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            1.48,
            1.61,
            1.94,
            2.45,
            2.96,
            3.35
        ],
        "thrust": 25,
        "centerDistance": 180,
        "dimensions": "432×440×650",
        "weight": 225,
        "maxPower": 250,
        "minPower": 80,
        "powerSource": "传动能力计算",
        "price": 75000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.1,
            0.1,
            0.1,
            0.1,
            0.09,
            0.08
        ],
        "imageUrl": "/images/gearbox/HCN120.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/HCN120.webp"
    },
    {
        "model": "HCNM280T",
        "series": "HCNM",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1,
            1.03,
            1.15,
            1.16,
            1.19,
            1.49,
            2.48
        ],
        "thrust": 180,
        "centerDistance": 180,
        "maxPower": 5208,
        "minPower": 2480,
        "powerSource": "传动能力计算",
        "price": 150000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            2.48,
            2.48,
            2.48,
            2.48,
            2.48,
            2.48,
            2.48
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 260,
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCQ100",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 3500,
        "ratios": [
            1.64,
            2.03,
            2.52,
            3,
            3.53,
            4,
            4.48,
            4.95,
            5.56
        ],
        "thrust": 16,
        "centerDistance": 146,
        "dimensions": "546×551×656",
        "weight": 150,
        "maxPower": 224,
        "minPower": 30,
        "powerSource": "传动能力计算",
        "price": 28000,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2600
        ],
        "transmissionCapacityPerRatio": [
            0.064,
            0.064,
            0.058,
            0.051,
            0.046,
            0.041,
            0.037,
            0.034,
            0.03
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ100-MV100A.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ100-MV100A.webp"
    },
    {
        "model": "HCQ1000",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            1.18,
            2.84
        ],
        "thrust": 100,
        "centerDistance": 310,
        "dimensions": "994×1104×985",
        "weight": 1100,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 184000,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "maxPower": 1691,
        "minPower": 650,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            0.735,
            0.65
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE0#18寸",
                "SAE1#8寸"
            ],
            "plainFlange": true,
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp"
    },
    {
        "model": "HCQ1001",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            2.88,
            3,
            3.23
        ],
        "thrust": 100,
        "centerDistance": 335,
        "dimensions": "809×1120×1003",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 205000,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "maxPower": 1691,
        "minPower": 735,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            0.735,
            0.735,
            0.735
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp"
    },
    {
        "model": "HCQ138",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2600,
        "ratios": [
            1.64,
            2.03,
            2.52,
            3.04,
            3.57,
            4,
            4.48,
            5.05,
            5.56
        ],
        "thrust": 25,
        "centerDistance": 165,
        "dimensions": "504×619×616",
        "weight": 240,
        "maxPower": 226,
        "minPower": 45,
        "powerSource": "传动能力计算",
        "price": 27600,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.087,
            0.087,
            0.087,
            0.078,
            0.07,
            0.063,
            0.056,
            0.05,
            0.045
        ],
        "imageUrl": "/images/gearbox/HCQ138-HCA138-.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "plainFlange": true,
            "boltPatterns": [
                "12-φ12.5",
                "8-φ11",
                "8-φ14",
                "8-φ14.8"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/HCQ138-HCA138-.webp"
    },
    {
        "model": "HCQ1400",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1.03,
            1.52,
            2,
            2.03,
            2.48,
            2.5,
            2.53,
            2.93,
            3
        ],
        "thrust": 110,
        "centerDistance": 340,
        "dimensions": "938×1210×1027",
        "weight": 1430,
        "maxPower": 6300,
        "minPower": 3000,
        "powerSource": "传动能力计算",
        "price": 210000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3,
            3
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE2#1寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "16-φ20"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp"
    },
    {
        "model": "HCQ1600",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            1.51,
            1.97,
            2.48,
            2.76
        ],
        "thrust": 120,
        "centerDistance": 340,
        "dimensions": "1106×1190×1056",
        "weight": 1500,
        "maxPower": 2528,
        "minPower": 1000,
        "powerSource": "传动能力计算",
        "price": 249000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            1.204,
            1.204,
            1.204,
            1
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCQ1601",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            3.04,
            3.24
        ],
        "thrust": 120,
        "centerDistance": 370,
        "dimensions": "1106×1230×1180",
        "weight": 1550,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 307000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "maxPower": 2528,
        "minPower": 1000,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            1.204,
            1
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-1600.webp"
    },
    {
        "model": "HCQ300",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            1.06,
            1.21,
            1.36,
            1.46,
            1.5,
            1.52,
            1.74,
            1.96,
            2.05,
            2.38,
            2.5,
            2.55,
            2.57,
            2.95
        ],
        "thrust": 40,
        "centerDistance": 203,
        "dimensions": "630×521×680",
        "weight": 370,
        "maxPower": 6785,
        "minPower": 2950,
        "powerSource": "传动能力计算",
        "price": 42000,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95
        ],
        "imageUrl": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸"
            ],
            "boltPatterns": [
                "12-φ12.5",
                "12-φ14",
                "16-φ14",
                "6-φ17",
                "8-φ13.8"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "HCQ400",
        "series": "HCQ",
        "inputSpeedRange": [
            1000,
            2100
        ],
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
        "thrust": null,
        "dimensions": null,
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
        "discountRate": 0.1
    },
    {
        "model": "HCQ401",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            1,
            1.12,
            1.25,
            1.41,
            1.5,
            1.76,
            2.04,
            2.5
        ],
        "thrust": 50,
        "centerDistance": 220,
        "dimensions": "640×900×800",
        "weight": 552,
        "maxPower": 761,
        "minPower": 294,
        "powerSource": "传动能力计算",
        "price": 63500,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            0.331,
            0.331,
            0.331,
            0.331,
            0.331,
            0.331,
            0.331,
            0.294
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "boltPatterns": [
                "6-φ17",
                "8-φ13.8",
                "8-φ20.8"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCQ402",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            2.82,
            3,
            3.2,
            3.47
        ],
        "thrust": 50,
        "centerDistance": 285,
        "dimensions": "611×890×1080",
        "weight": 650,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 75300,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "maxPower": 761,
        "minPower": 331,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            0.331,
            0.331,
            0.331,
            0.331
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCQ501",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            1.48,
            2.04,
            2.52,
            3.04,
            3.57,
            4,
            4.47,
            5.05,
            5.56,
            5.95
        ],
        "thrust": 55,
        "centerDistance": 235,
        "dimensions": "742×856×950",
        "weight": 570,
        "maxPower": 828,
        "minPower": 243,
        "powerSource": "传动能力计算",
        "price": 76000,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.36,
            0.36,
            0.36,
            0.36,
            0.36,
            0.36,
            0.324,
            0.288,
            0.261,
            0.243
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "boltPatterns": [
                "12-φ12.5",
                "16-φ14",
                "8-φ13.8",
                "8-φ20.8"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCQ502",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            1.58,
            2.03,
            2.48,
            2.96,
            3.46,
            3.94,
            4.39
        ],
        "thrust": 60,
        "centerDistance": 264,
        "dimensions": "742×856×980",
        "weight": 700,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 78800,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "maxPower": 867,
        "minPower": 305,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            900,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.377,
            0.377,
            0.377,
            0.377,
            0.377,
            0.339,
            0.305
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "boltPatterns": [
                "12-φ12.5",
                "16-φ14",
                "8-φ13.8",
                "8-φ22.8"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCQ700",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            1.3,
            1.51,
            1.75,
            2,
            2.25,
            2.5,
            2.78,
            2.96
        ],
        "thrust": 90,
        "centerDistance": 290,
        "dimensions": "898×1104×1066",
        "weight": 980,
        "oilCapacity": 30,
        "clutchType": "液压湿式多片摩擦离合器",
        "gearType": "圆柱斜齿轮",
        "transmissionType": "三轴五齿轮传动",
        "workingPressure": "1.4-1.6",
        "lubricationPressure": "0.2-0.45",
        "maxOilTemp": 80,
        "coolingWaterFlow": 4,
        "directionChangeTime": 10,
        "overhaulPeriod": 10000,
        "efficiency": 0.97,
        "controlType": "推拉软轴/电控",
        "inputShaftType": "SAE0#18/SAE1#14",
        "outputShaftDia": 130,
        "applications": [
            "拖网渔船",
            "运输船",
            "工程船",
            "大型渔船"
        ],
        "certifications": [
            "CCS",
            "ZC",
            "BV"
        ],
        "source": "HCQ700型船用齿轮箱使用说明书发407",
        "price": 118000,
        "discountRate": 0,
        "priceSource": "2026官方统一售价",
        "maxPower": 1450,
        "minPower": 490,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.58,
            0.58,
            0.58,
            0.58,
            0.58,
            0.58,
            0.514,
            0.49
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp"
    },
    {
        "model": "HCQ700A",
        "series": "HCQ",
        "inputSpeedRange": [
            1000,
            2500
        ],
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
        "thrust": null,
        "dimensions": null,
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
        "discountRate": 0.1
    },
    {
        "model": "HCQ701",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            2.9,
            3.48,
            3.62
        ],
        "thrust": 95,
        "centerDistance": 340,
        "dimensions": "868×1104×1146",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 163000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "maxPower": 1385,
        "minPower": 490,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.554,
            0.514,
            0.49
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp"
    },
    {
        "model": "HCQ800A",
        "series": "HCQ",
        "inputSpeedRange": [
            1000,
            2100
        ],
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
        "thrust": null,
        "dimensions": null,
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
        "discountRate": 0.1
    },
    {
        "model": "HCQH1000",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            2.26
        ],
        "thrust": null,
        "centerDistance": null,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 184000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "maxPower": 1691,
        "minPower": 735,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2300
        ],
        "transmissionCapacityPerRatio": [
            0.735
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE2#1寸"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp"
    },
    {
        "model": "HCQH1600",
        "series": "HCQ",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            2.48
        ],
        "thrust": 120,
        "centerDistance": 340,
        "dimensions": "1035×1110×1038",
        "weight": 1500,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 249000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "maxPower": 2528,
        "minPower": 1204,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            1.204
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/gearbox-hcq.png",
        "introduction": "HCQ系列船用齿轮箱是船舶推进系统的主力产品。产品具有倒顺车、减速及承受螺旋桨推力功能。采用液压湿式多片离合器,换向平稳可靠。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCQH700",
        "series": "HCQH",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            1.3,
            1.51,
            1.75,
            2,
            2.25,
            2.5,
            2.78,
            2.96
        ],
        "thrust": 90,
        "centerDistance": 290,
        "dimensions": "895×1014×1100",
        "weight": 920,
        "maxPower": 1450,
        "minPower": 490,
        "powerSource": "传动能力计算",
        "price": 118000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.58,
            0.58,
            0.58,
            0.58,
            0.58,
            0.58,
            0.514,
            0.49
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp"
    },
    {
        "model": "HCS1000",
        "series": "HCS",
        "minSpeed": 600,
        "maxSpeed": 1900,
        "ratios": [
            2.5,
            3.04,
            3.48,
            4.06
        ],
        "thrust": 0.735,
        "centerDistance": 110,
        "dimensions": "335",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 110000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 3363,
        "minPower": 954,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1900
        ],
        "transmissionCapacityPerRatio": [
            1.59,
            1.68,
            1.72,
            1.77
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCS系列船用齿轮箱是标准型船用齿轮箱,应用广泛。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCS1200",
        "series": "HCS",
        "minSpeed": 600,
        "maxSpeed": 1900,
        "ratios": [
            2.03,
            2.5,
            2.96,
            3.55,
            4.06,
            4.47
        ],
        "thrust": 0.93,
        "centerDistance": 120,
        "dimensions": "380",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 126000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 3857,
        "minPower": 966,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1900
        ],
        "transmissionCapacityPerRatio": [
            1.61,
            1.69,
            1.74,
            1.79,
            1.85,
            2.03
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCS系列船用齿轮箱是标准型船用齿轮箱,应用广泛。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCS138",
        "series": "HCS",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            2.52,
            3.57,
            4.05,
            4.45
        ],
        "thrust": 0.11,
        "centerDistance": 30,
        "dimensions": "225",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 41040,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 4450,
        "minPower": 1600,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            1.6,
            1.64,
            1.73,
            1.78
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCS系列船用齿轮箱是标准型船用齿轮箱,应用广泛。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "HCS1600",
        "series": "HCS",
        "minSpeed": 500,
        "maxSpeed": 1650,
        "ratios": [
            2.03,
            2.54,
            3,
            3.5,
            4
        ],
        "thrust": 1.213,
        "centerDistance": 170,
        "dimensions": "415",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 158000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 3069,
        "minPower": 815,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            500,
            1650
        ],
        "transmissionCapacityPerRatio": [
            1.63,
            1.68,
            1.76,
            1.81,
            1.86
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCS系列船用齿轮箱是标准型船用齿轮箱,应用广泛。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
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
        "weight": null,
        "centerDistance": 190,
        "transmissionCapacityPerRatio": [
            2.06,
            2.06,
            2.06,
            2.06,
            2.06,
            2.06
        ],
        "dataSource": "dwgTechParams",
        "image": "/images/gearbox/Advance-200-201-230.webp",
        "price": 109000,
        "priceSource": "系统估算",
        "discountRate": 0.1
    },
    {
        "model": "HCS2000",
        "series": "HCS",
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
        "thrust": 1.48,
        "centerDistance": 190,
        "dimensions": "450",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 190000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 3090,
        "minPower": 1098,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1500
        ],
        "transmissionCapacityPerRatio": [
            1.83,
            1.89,
            1.94,
            1.93,
            2.06,
            1.93
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCS系列船用齿轮箱是标准型船用齿轮箱,应用广泛。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCS201",
        "series": "HCS",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            2.48,
            2.95,
            3.53
        ],
        "thrust": 0.147,
        "centerDistance": 40,
        "dimensions": "205",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 46080,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 5350,
        "minPower": 2070,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            2.105,
            2.07,
            2.14
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCS系列船用齿轮箱是标准型船用齿轮箱,应用广泛。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCS2700",
        "series": "HCS",
        "minSpeed": 500,
        "maxSpeed": 1400,
        "ratios": [
            1.54,
            2.03,
            2.58,
            3.09,
            3.48,
            3.95,
            4.47
        ],
        "thrust": 2.05,
        "centerDistance": 270,
        "dimensions": "490",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 246000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2380,
        "minPower": 620,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            500,
            1400
        ],
        "transmissionCapacityPerRatio": [
            1.24,
            1.27,
            1.33,
            1.36,
            1.43,
            1.62,
            1.7
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCS系列船用齿轮箱是标准型船用齿轮箱,应用广泛。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCS302",
        "series": "HCS",
        "minSpeed": 750,
        "maxSpeed": 2500,
        "ratios": [
            2.54,
            3,
            3.59,
            4.14,
            4.3
        ],
        "thrust": 0.257,
        "centerDistance": 50,
        "dimensions": "264",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 54160,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 4600,
        "minPower": 1215,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            750,
            2500
        ],
        "transmissionCapacityPerRatio": [
            1.62,
            1.66,
            1.74,
            1.79,
            1.84
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCS系列船用齿轮箱是标准型船用齿轮箱,应用广泛。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "HCS400",
        "series": "HCS",
        "minSpeed": 1000,
        "maxSpeed": 1800,
        "ratios": [
            1.5,
            2.04,
            2.5,
            3,
            3.42,
            4.06
        ],
        "thrust": 0.331,
        "centerDistance": 82,
        "dimensions": "264",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 55000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 2934,
        "minPower": 1210,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            1800
        ],
        "transmissionCapacityPerRatio": [
            1.21,
            1.24,
            1.31,
            1.34,
            1.38,
            1.63
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCS系列船用齿轮箱是标准型船用齿轮箱,应用广泛。",
        "inputInterfaces": {
            "sae": [
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCS600",
        "series": "HCS",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            2.48,
            3,
            3.58,
            3.89
        ],
        "thrust": 0.48,
        "centerDistance": 90,
        "dimensions": "320",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 78000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 3696,
        "minPower": 1610,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            1.61,
            1.66,
            1.71,
            1.76
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "HCS系列船用齿轮箱是标准型船用齿轮箱,应用广泛。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCT1000",
        "series": "HCT",
        "inputSpeedRange": [
            600,
            2100
        ],
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
        "thrust": null,
        "dimensions": null,
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
        "discountRate": 0.1
    },
    {
        "model": "HCT1100",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 1900,
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
        "thrust": 150,
        "centerDistance": 500,
        "dimensions": "1150×1350×1547",
        "weight": 3200,
        "maxPower": 1862,
        "minPower": 391,
        "powerSource": "传动能力计算",
        "price": 128960,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            600,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.98,
            0.98,
            0.98,
            0.98,
            0.98,
            0.98,
            0.882,
            0.79,
            0.71,
            0.651
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE0#0寸",
                "SAE1#8寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "10-φ31.7",
                "12-φ17.5",
                "16-φ14"
            ],
            "domestic": [
                "φ518"
            ]
        },
        "image": "/images/gearbox/Advance-1100-1200.webp"
    },
    {
        "model": "HCT1200",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 1900,
        "ratios": [
            2.04,
            2.48,
            2.95,
            3.45,
            3.96,
            4.39,
            4.89,
            5.44,
            5.94
        ],
        "thrust": 150,
        "centerDistance": 500,
        "dimensions": "1188×1350×1547",
        "weight": 3200,
        "maxPower": 1976,
        "minPower": 415,
        "powerSource": "传动能力计算",
        "price": 143000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            600,
            1800
        ],
        "transmissionCapacityPerRatio": [
            1.04,
            1.04,
            1.04,
            1.04,
            1.04,
            0.936,
            0.838,
            0.754,
            0.691
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE0#0寸",
                "SAE1#8寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "domestic": [
                "φ518",
                "φ640",
                "φ820"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ17.5",
                "16-φ14",
                "16-φ31.7",
                "24-φ18"
            ]
        },
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCT1200/1",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 1900,
        "ratios": [
            8.55,
            9.16,
            9.57,
            10.08
        ],
        "thrust": 220,
        "centerDistance": 580,
        "dimensions": "1056×1430×1670",
        "weight": 3850,
        "maxPower": 1927,
        "minPower": 608,
        "powerSource": "传动能力计算",
        "price": 157000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            600,
            1900
        ],
        "transmissionCapacityPerRatio": [
            1.014,
            1.014,
            1.014,
            1.014
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE0#0寸",
                "SAE1#8寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "domestic": [
                "φ518",
                "φ640",
                "φ820"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ17.5",
                "16-φ14",
                "16-φ31.7",
                "24-φ18"
            ]
        },
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCT1200P",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 1900,
        "ratios": [
            2.04,
            2.48,
            2.95,
            3.45,
            3.96,
            4.39,
            4.89,
            5.44,
            5.94
        ],
        "thrust": 1000,
        "centerDistance": 500,
        "dimensions": "1188×1350×1547",
        "weight": 3200,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 135000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "couplingConfig": {
            "standard": {
                "model": "HGTQ1215ⅠD",
                "series": "HGTQ1215",
                "alternatives": [
                    "HGTHB6.3"
                ]
            },
            "withCover": {
                "model": "HGTHJB6.3",
                "series": "HGTHJB"
            },
            "detachable": {
                "model": "HGTHB6.3/X",
                "series": "HGTHB"
            },
            "interfaces": {
                "sae": [
                    "18\"",
                    "21\""
                ],
                "domestic": [
                    "φ518"
                ]
            }
        },
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.93,
            0.93,
            0.93,
            0.93,
            0.93,
            0.93,
            0.93,
            0.93,
            0.93
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE0#0寸",
                "SAE1#8寸",
                "SAE14寸",
                "SAE16寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "domestic": [
                "φ505",
                "φ518",
                "φ640",
                "φ820"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ17.5",
                "16-φ14",
                "16-φ31.7",
                "24-φ18"
            ]
        },
        "minPower": 558,
        "maxPower": 1767,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCT1280/2",
        "series": "HCT",
        "minSpeed": 700,
        "maxSpeed": 1900,
        "ratios": [
            8.04,
            8.46,
            8.9,
            9.38,
            9.88,
            10.43,
            11.03,
            11.98,
            12.36
        ],
        "thrust": 240,
        "centerDistance": 680,
        "dimensions": "1290×1520×1775",
        "weight": 4300,
        "maxPower": 1767,
        "minPower": 651,
        "powerSource": "传动能力计算",
        "price": 165000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            700,
            1900
        ],
        "transmissionCapacityPerRatio": [
            0.93,
            0.93,
            0.93,
            0.93,
            0.93,
            0.93,
            0.93,
            0.93,
            0.93
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
        "image": "/images/gearbox/Advance-1400.webp"
    },
    {
        "model": "HCT1400",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 1900,
        "ratios": [
            4.06,
            4.51,
            5.03,
            5.52,
            5.97,
            6.48,
            7.03,
            7.5,
            8.01
        ],
        "thrust": 220,
        "centerDistance": 550,
        "dimensions": "1306×1380×1750",
        "weight": 3800,
        "maxPower": 2054,
        "minPower": 649,
        "powerSource": "传动能力计算",
        "price": 162500,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            600,
            1800
        ],
        "transmissionCapacityPerRatio": [
            1.081,
            1.081,
            1.081,
            1.081,
            1.081,
            1.081,
            1.081,
            1.081,
            1.081
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "domestic": [
                "φ518",
                "φ540",
                "φ720"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCT1400/2",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 1900,
        "transmissionCapacity": 19.07,
        "thrust": 220,
        "centerDistance": 722,
        "maxPower": 2054,
        "minPower": 360,
        "powerSource": "传动能力计算",
        "price": 205000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            750,
            2100
        ],
        "ratios": [
            10.47,
            11.15,
            11.5,
            12.01,
            12.43,
            12.96,
            13.41,
            14.02,
            14.53,
            15.1,
            15.53,
            16,
            16.52,
            17.01,
            17.6,
            17.99,
            18.41,
            19.07
        ],
        "transmissionCapacityPerRatio": [
            1.081,
            1.081,
            1.081,
            1.081,
            0.996,
            0.933,
            0.922,
            0.883,
            0.853,
            0.758,
            0.737,
            0.715,
            0.693,
            0.673,
            0.65,
            0.636,
            0.621,
            0.6
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE18寸",
                "SAE2#1寸"
            ]
        },
        "weight": 5500,
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCT1400/5",
        "series": "HCT",
        "minSpeed": 700,
        "maxSpeed": 1800,
        "ratios": [
            8.98,
            9.47,
            10,
            10.58,
            11.2,
            11.88,
            12.42,
            12.96,
            13.45,
            13.89,
            14.36,
            14.93
        ],
        "thrust": 190,
        "centerDistance": 680,
        "dimensions": "1220×1400×1650",
        "weight": 3850,
        "maxPower": 1863,
        "minPower": 536,
        "powerSource": "传动能力计算",
        "price": 285000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            700,
            1800
        ],
        "transmissionCapacityPerRatio": [
            1.035,
            1.035,
            1.035,
            1.035,
            1.035,
            0.93,
            0.93,
            0.9,
            0.86,
            0.833,
            0.812,
            0.765
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE14寸",
                "SAE16寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "domestic": [
                "φ505",
                "φ518"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCT1400P",
        "series": "HCT",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            4.06,
            4.51,
            5.03,
            5.52,
            5.97,
            6.48,
            7.03,
            7.5
        ],
        "maxPower": 2703,
        "minPower": 1081,
        "powerSource": "传动能力计算",
        "price": 285000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            1.081,
            1.081,
            1.081,
            1.081,
            1.081,
            1.081,
            1.081,
            1.081
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE14寸",
                "SAE16寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "domestic": [
                "φ505",
                "φ518"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
        "thrust": 220,
        "centerDistance": 550,
        "dimensions": "1306×1380×1750",
        "weight": 3800
    },
    {
        "model": "HCT1600",
        "series": "HCT",
        "minSpeed": 500,
        "maxSpeed": 1650,
        "ratios": [
            2.04,
            2.52,
            3,
            3.57,
            4,
            4.48,
            5.05,
            5.5
        ],
        "thrust": 250,
        "centerDistance": 585,
        "dimensions": "1246×1500×1750",
        "weight": 5000,
        "maxPower": 2538,
        "minPower": 564,
        "powerSource": "传动能力计算",
        "price": 194800,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            600,
            1800
        ],
        "transmissionCapacityPerRatio": [
            1.538,
            1.538,
            1.538,
            1.538,
            1.538,
            1.384,
            1.23,
            1.128
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ37.5"
            ],
            "domestic": [
                "φ518",
                "φ540"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCT1600/1",
        "series": "HCT",
        "minSpeed": 500,
        "maxSpeed": 1650,
        "ratios": [
            8.02,
            8.41,
            9.12,
            9.58,
            10.08,
            10.6,
            11.2,
            11.94
        ],
        "thrust": 270,
        "centerDistance": 680,
        "dimensions": "1280×1704×2040",
        "weight": 5500,
        "maxPower": 2129,
        "minPower": 645,
        "powerSource": "传动能力计算",
        "price": 223000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            500,
            1650
        ],
        "transmissionCapacityPerRatio": [
            1.29,
            1.29,
            1.29,
            1.29,
            1.29,
            1.29,
            1.29,
            1.29
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ37.5"
            ],
            "domestic": [
                "φ518",
                "φ540"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCT1600P",
        "series": "HCT",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            7.44,
            7.92,
            8.46,
            9,
            9.53,
            10.17,
            10.87,
            11.65,
            12.52
        ],
        "maxPower": 3150,
        "minPower": 811,
        "powerSource": "传动能力计算",
        "price": 285000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            1.26,
            1.213,
            1.13,
            1.01,
            0.95,
            0.9,
            0.9,
            0.867,
            0.811
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE14寸",
                "SAE16寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "boltPatterns": [
                "12-φ37.5"
            ],
            "domestic": [
                "φ505",
                "φ518"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
        "thrust": 250,
        "centerDistance": 585,
        "dimensions": "1246×1500×1750",
        "weight": 5000
    },
    {
        "model": "HCT2000",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 1500,
        "ratios": [
            5.19,
            5.49,
            5.94,
            6.58,
            7.01,
            7.48,
            7.76,
            8
        ],
        "thrust": 270,
        "centerDistance": 625,
        "dimensions": "1284×1600×1835",
        "weight": 5600,
        "maxPower": 2430,
        "minPower": 972,
        "powerSource": "传动能力计算",
        "price": 238000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            500,
            1600
        ],
        "transmissionCapacityPerRatio": [
            1.62,
            1.62,
            1.62,
            1.62,
            1.62,
            1.62,
            1.62,
            1.62
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "domestic": [
                "φ518",
                "φ640",
                "φ700",
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCT2000/1",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 1500,
        "ratios": [
            6.96,
            7.54,
            7.94,
            8.57,
            9.06,
            9.59,
            10.16,
            10.4
        ],
        "thrust": 340,
        "centerDistance": 690,
        "dimensions": "1500×1760×2010",
        "weight": 7000,
        "maxPower": 2430,
        "minPower": 972,
        "powerSource": "传动能力计算",
        "price": 280000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            600,
            1500
        ],
        "transmissionCapacityPerRatio": [
            1.62,
            1.62,
            1.62,
            1.62,
            1.62,
            1.62,
            1.62,
            1.62
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "domestic": [
                "φ700",
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCT2000P",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 1500,
        "ratios": [
            5.19,
            5.49,
            5.94,
            6.58,
            7.01,
            7.48,
            7.76,
            8
        ],
        "thrust": 1000,
        "centerDistance": 625,
        "dimensions": "1284×1600×1835",
        "weight": 3600,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 195000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHB12.5",
                "series": "HGTHB"
            },
            "detachable": {
                "model": "HGTHB12.5/X",
                "series": "HGTHB"
            },
            "interfaces": {
                "sae": [
                    "18\"",
                    "21\""
                ]
            }
        },
        "inputSpeedRange": [
            500,
            1400
        ],
        "transmissionCapacityPerRatio": [
            1.58,
            1.58,
            1.58,
            1.58,
            1.58,
            1.58,
            1.58,
            1.58
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE14寸",
                "SAE16寸",
                "SAE18寸",
                "SAE2#1寸",
                "SAE21寸"
            ],
            "plainFlange": true,
            "domestic": [
                "φ505",
                "φ518"
            ]
        },
        "minPower": 948,
        "maxPower": 2370,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCT2700",
        "series": "HCT",
        "minSpeed": 500,
        "maxSpeed": 1600,
        "ratios": [
            4.92,
            5.43,
            6.16,
            6.58,
            7.03,
            7.53,
            8.01,
            8.54,
            9.12,
            9.42,
            10.05,
            10.68,
            11.43
        ],
        "thrust": 340,
        "centerDistance": 680,
        "dimensions": "1900×2000×1970",
        "weight": 7200,
        "maxPower": 3360,
        "minPower": 750,
        "powerSource": "传动能力计算",
        "price": 340000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            500,
            1600
        ],
        "transmissionCapacityPerRatio": [
            2.1,
            2.1,
            2.1,
            2.1,
            2.1,
            2.1,
            2.1,
            2.035,
            1.906,
            1.844,
            1.73,
            1.627,
            1.5
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCT2700/1",
        "series": "HCT",
        "minSpeed": 500,
        "maxSpeed": 1600,
        "ratios": [
            7.91,
            8.44,
            8.84,
            9.47,
            9.89,
            10.55,
            11.26,
            11.64,
            12.41
        ],
        "thrust": 450,
        "centerDistance": 800,
        "dimensions": "1900×2250×1950",
        "weight": 9000,
        "maxPower": 3360,
        "minPower": 865,
        "powerSource": "传动能力计算",
        "price": 390000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            500,
            1600
        ],
        "transmissionCapacityPerRatio": [
            2.1,
            2.1,
            2.1,
            2.1,
            2.1,
            2.035,
            1.906,
            1.844,
            1.73
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCT2700P",
        "series": "HCT",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            4.92,
            5.43,
            6.16,
            6.58,
            7.03,
            7.53,
            8.01,
            8.54,
            9.12,
            9.42,
            10.05,
            10.68,
            11.54
        ],
        "maxPower": 4410,
        "minPower": 1500,
        "powerSource": "传动能力计算",
        "price": 285000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            2.1,
            2.1,
            2.035,
            2.035,
            1.812,
            1.812,
            1.75,
            1.75,
            1.575,
            1.575,
            1.5,
            1.5,
            1.5
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
        "image": "/images/gearbox/Advance-800-1000.webp",
        "thrust": 340,
        "centerDistance": 680,
        "dimensions": "1900×2000×1970",
        "weight": 7200
    },
    {
        "model": "HCT3800",
        "series": "HCT",
        "minSpeed": 500,
        "maxSpeed": 1200,
        "ratios": [
            5.08,
            5.55,
            5.98,
            6.58,
            6.98,
            7.55,
            8.03,
            8.56,
            8.98,
            9.57,
            9.86,
            10.51,
            11.06,
            11.67,
            12.01
        ],
        "thrust": 450,
        "centerDistance": 720,
        "dimensions": "1681×1750×2100",
        "weight": 10500,
        "maxPower": 3390,
        "minPower": 900,
        "powerSource": "传动能力计算",
        "price": 285000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            500,
            1200
        ],
        "transmissionCapacityPerRatio": [
            2.825,
            2.825,
            2.825,
            2.825,
            2.69,
            2.525,
            2.451,
            2.451,
            2.301,
            2.186,
            2.186,
            2,
            2,
            1.8,
            1.8
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/bf8ebc03-6d35-44db-94c9-e3af23be9de5.png",
        "introduction": "HCT系列船用齿轮箱主要用于中大型船舶推进系统。具有高效率、低噪音、维护方便等特点。采用液压湿式多片离合器,操纵平稳可靠。",
        "inputInterfaces": {
            "boltPatterns": [
                "12-φ44",
                "16-φ22"
            ],
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
        "image": "/images/gearbox/Advance-800-1000.webp"
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
        "dataSource": "dwgTechParams",
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
        "price": 87000,
        "priceSource": "系统估算",
        "discountRate": 0.1
    },
    {
        "model": "HCT400A",
        "series": "HCT",
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
        "thrust": 82,
        "centerDistance": 375,
        "dimensions": "800×1052×1182",
        "weight": 1450,
        "controlType": "推拉软轴/电控/气控",
        "price": 51000,
        "discountRate": 0.16,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 695,
        "minPower": 279,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.331,
            0.331,
            0.331,
            0.331,
            0.309,
            0.294,
            0.279,
            0.279
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
            "boltPatterns": [
                "8-φ31.7"
            ],
            "domestic": [
                "φ505",
                "φ518"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCT400A/1",
        "series": "HCT",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            8.15,
            8.69,
            9.27,
            9.94,
            10.6,
            11.37,
            12,
            12.5,
            13.96
        ],
        "thrust": 82,
        "centerDistance": 375,
        "dimensions": "800×1052×1182",
        "weight": 1500,
        "maxPower": 695,
        "minPower": 204,
        "powerSource": "传动能力计算",
        "price": 60000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.331,
            0.331,
            0.331,
            0.316,
            0.297,
            0.274,
            0.262,
            0.262,
            0.204
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
            "boltPatterns": [
                "8-φ31.7"
            ],
            "domestic": [
                "φ505",
                "φ518"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCT400P",
        "series": "HCT",
        "minSpeed": 1000,
        "maxSpeed": 3000,
        "ratios": [
            6.09,
            6.49,
            6.93
        ],
        "maxPower": 993,
        "minPower": 331,
        "powerSource": "传动能力计算",
        "price": 285000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            3000
        ],
        "transmissionCapacityPerRatio": [
            0.331,
            0.331,
            0.331
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
            "boltPatterns": [
                "8-φ31.7"
            ],
            "domestic": [
                "φ505",
                "φ518"
            ]
        },
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
        "thrust": 90,
        "centerDistance": 390,
        "weight": 1450
    },
    {
        "model": "HCT600",
        "series": "HCT",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "ratios": [
            1.59,
            2.03,
            2.48,
            2.95,
            3.45,
            3.94
        ],
        "weight": 800,
        "thrust": null,
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
        "discountRate": 0.1
    },
    {
        "model": "HCT600A",
        "series": "HCT",
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
        "thrust": 90,
        "centerDistance": 415,
        "dimensions": null,
        "weight": 1650,
        "controlType": "推拉软轴/电控/气控",
        "price": 70900,
        "discountRate": 0.12,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 1029,
        "minPower": 310,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.49,
            0.46,
            0.43,
            0.4,
            0.37,
            0.34,
            0.31
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
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCT600A/1",
        "series": "HCT",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            6.09,
            6.48,
            7.04,
            7.69,
            8.23,
            8.82,
            9.47,
            10.1,
            10.8,
            11.65,
            12.57,
            13.64,
            14.44,
            15.91
        ],
        "thrust": 140,
        "centerDistance": 500,
        "dimensions": "878×1224×1346",
        "weight": 1700,
        "maxPower": 1029,
        "minPower": 268,
        "powerSource": "传动能力计算",
        "price": 75000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.49,
            0.485,
            0.45,
            0.45,
            0.423,
            0.395,
            0.395,
            0.367,
            0.367,
            0.34,
            0.313,
            0.296,
            0.296,
            0.268
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
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCT600P",
        "series": "HCT",
        "minSpeed": 1000,
        "maxSpeed": 3000,
        "ratios": [
            6.06
        ],
        "maxPower": 1350,
        "minPower": 450,
        "powerSource": "传动能力计算",
        "price": 285000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            3000
        ],
        "transmissionCapacityPerRatio": [
            0.45
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
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
        "dimensions": "1223×1136×899",
        "weight": 800
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
        "dataSource": "dwgTechParams_estimated",
        "image": "/images/gearbox/Advance-800-1000.webp",
        "price": 129000,
        "priceSource": "系统估算",
        "discountRate": 0.1
    },
    {
        "model": "HCT650/2",
        "series": "HCT",
        "minSpeed": 1000,
        "maxSpeed": 2100,
        "ratios": [
            9.51,
            10.06,
            10.45,
            11.03,
            11.46,
            11.98,
            12.52,
            13.09,
            13.64,
            14.1,
            14.48,
            15.01,
            15.55,
            15.98,
            16.42,
            16.97,
            17.44,
            18.06
        ],
        "thrust": 160,
        "centerDistance": 550,
        "dimensions": "966×1224×1515",
        "weight": 2230,
        "maxPower": 1029,
        "minPower": 290,
        "powerSource": "传动能力计算",
        "price": 285000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.49,
            0.49,
            0.483,
            0.483,
            0.452,
            0.452,
            0.445,
            0.445,
            0.414,
            0.414,
            0.402,
            0.389,
            0.366,
            0.329,
            0.32,
            0.309,
            0.301,
            0.29
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCT700",
        "series": "HCT",
        "inputSpeedRange": [
            1000,
            2100
        ],
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
        "thrust": null,
        "dimensions": null,
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
        "discountRate": 0.1
    },
    {
        "model": "HCT800",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 2100,
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
        "thrust": 140,
        "centerDistance": 450,
        "dimensions": "1056×1280×1425",
        "weight": 2500,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 98000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "maxPower": 1512,
        "minPower": 287,
        "powerSource": "传动能力计算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHT8.6",
                "series": "HGTHT",
                "alternatives": [
                    "HGTLX8.6"
                ]
            },
            "detachable": {
                "model": "HGTHT8.6/X",
                "series": "HGTHT"
            },
            "interfaces": {
                "sae": [
                    "14\"",
                    "16\"",
                    "18\"",
                    "21\""
                ],
                "domestic": [
                    "φ505",
                    "φ518"
                ]
            },
            "detailedOptions": {
                "standard": [
                    {
                        "model": "HGTHT8.6/14",
                        "interface": "配SAE14\""
                    },
                    {
                        "model": "HGTHT8.6/16",
                        "interface": "配SAE16\""
                    },
                    {
                        "model": "HGTHT8.6/18",
                        "interface": "配SAE18\""
                    },
                    {
                        "model": "HGTHT8.6/21",
                        "interface": "配SAE21\""
                    },
                    {
                        "model": "HGTHT8.6/φ505",
                        "interface": "配国内机505"
                    },
                    {
                        "model": "HGTHT8.6/φ518",
                        "interface": "配国内机518"
                    }
                ],
                "withCover": [],
                "detachable": [
                    {
                        "model": "HGTHT8.6/18X",
                        "interface": "可拆式，SAE18\""
                    },
                    {
                        "model": "HGTHT8.6/21X",
                        "interface": "可拆式，SAE21\""
                    },
                    {
                        "model": "HGTLX8.6/16",
                        "interface": ""
                    },
                    {
                        "model": "HGTLX8.6/18",
                        "interface": ""
                    },
                    {
                        "model": "HGTLX8.6/21",
                        "interface": ""
                    }
                ],
                "gearTooth": []
            }
        },
        "inputSpeedRange": [
            600,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.72,
            0.72,
            0.72,
            0.72,
            0.72,
            0.72,
            0.648,
            0.58,
            0.523,
            0.478
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCT800/1",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 2100,
        "ratios": [
            6.91,
            7.28,
            7.69,
            8.13,
            8.6,
            9.12,
            9.68
        ],
        "thrust": 220,
        "centerDistance": 582,
        "dimensions": "1152×1360×1557",
        "weight": 3300,
        "maxPower": 1512,
        "minPower": 432,
        "powerSource": "传动能力计算",
        "price": 137200,
        "discountRate": 0.08,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            600,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.72,
            0.72,
            0.72,
            0.72,
            0.72,
            0.72,
            0.72
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCT800/2",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 2100,
        "ratios": [
            1.59,
            1.77,
            1.97,
            2.11,
            2.29,
            2.48,
            2.71,
            2.95,
            3.17,
            3.45,
            4.39
        ],
        "thrust": 220,
        "centerDistance": 666,
        "dimensions": "1190×1490×1707",
        "weight": 3960,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 150200,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "maxPower": 1512,
        "minPower": 389,
        "powerSource": "传动能力计算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHT8.6",
                "series": "HGTHT",
                "alternatives": [
                    "HGTLX8.6"
                ]
            },
            "detachable": {
                "model": "HGTHT8.6/X",
                "series": "HGTHT"
            },
            "interfaces": {
                "sae": [
                    "14\"",
                    "16\"",
                    "18\"",
                    "21\""
                ],
                "domestic": [
                    "φ505",
                    "φ518"
                ]
            },
            "detailedOptions": {
                "standard": [
                    {
                        "model": "HGTHT8.6/14",
                        "interface": "配SAE14\""
                    },
                    {
                        "model": "HGTHT8.6/16",
                        "interface": "配SAE16\""
                    },
                    {
                        "model": "HGTHT8.6/18",
                        "interface": "配SAE18\""
                    },
                    {
                        "model": "HGTHT8.6/21",
                        "interface": "配SAE21\""
                    },
                    {
                        "model": "HGTHT8.6/φ505",
                        "interface": "配国内机505"
                    },
                    {
                        "model": "HGTHT8.6/φ518",
                        "interface": "配国内机518"
                    }
                ],
                "withCover": [],
                "detachable": [
                    {
                        "model": "HGTHT8.6/18X",
                        "interface": "可拆式，SAE18\""
                    },
                    {
                        "model": "HGTHT8.6/21X",
                        "interface": "可拆式，SAE21\""
                    },
                    {
                        "model": "HGTLX8.6/16",
                        "interface": ""
                    },
                    {
                        "model": "HGTLX8.6/18",
                        "interface": ""
                    },
                    {
                        "model": "HGTLX8.6/21",
                        "interface": ""
                    }
                ],
                "gearTooth": []
            }
        },
        "inputSpeedRange": [
            600,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.72,
            0.72,
            0.72,
            0.72,
            0.72,
            0.72,
            0.72,
            0.72,
            0.72,
            0.72,
            0.648
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCT800/2A",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 1900,
        "ratios": [
            13.12,
            13.81,
            14.55,
            15.33,
            16.16,
            17.04,
            17.99,
            20.27,
            22.18
        ],
        "thrust": 220,
        "centerDistance": 666,
        "dimensions": "1190×1490×2040",
        "weight": 4000,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 105000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1295,
        "minPower": 261,
        "powerSource": "传动能力计算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHT8.6",
                "series": "HGTHT",
                "alternatives": [
                    "HGTLX8.6"
                ]
            },
            "detachable": {
                "model": "HGTHT8.6/X",
                "series": "HGTHT"
            },
            "interfaces": {
                "sae": [
                    "14\"",
                    "16\"",
                    "18\"",
                    "21\""
                ],
                "domestic": [
                    "φ505",
                    "φ518"
                ]
            }
        },
        "inputSpeedRange": [
            600,
            1900
        ],
        "transmissionCapacityPerRatio": [
            0.6816,
            0.6474,
            0.6147,
            0.5834,
            0.5534,
            0.525,
            0.497,
            0.441,
            0.435
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCT800/3",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 2100,
        "ratios": [
            16.56,
            17.95,
            20.19,
            21.94
        ],
        "thrust": 240,
        "centerDistance": 736,
        "dimensions": "1235 ×1570 ×1789",
        "weight": 4540,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 170800,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "maxPower": 1348,
        "minPower": 291,
        "powerSource": "传动能力计算",
        "couplingConfig": {
            "standard": {
                "model": "HGTHT8.6",
                "series": "HGTHT",
                "alternatives": [
                    "HGTLX8.6"
                ]
            },
            "detachable": {
                "model": "HGTHT8.6/X",
                "series": "HGTHT"
            },
            "interfaces": {
                "sae": [
                    "14\"",
                    "16\"",
                    "18\"",
                    "21\""
                ],
                "domestic": [
                    "φ505",
                    "φ518"
                ]
            },
            "detailedOptions": {
                "standard": [
                    {
                        "model": "HGTHT8.6/14",
                        "interface": "配SAE14\""
                    },
                    {
                        "model": "HGTHT8.6/16",
                        "interface": "配SAE16\""
                    },
                    {
                        "model": "HGTHT8.6/18",
                        "interface": "配SAE18\""
                    },
                    {
                        "model": "HGTHT8.6/21",
                        "interface": "配SAE21\""
                    },
                    {
                        "model": "HGTHT8.6/φ505",
                        "interface": "配国内机505"
                    },
                    {
                        "model": "HGTHT8.6/φ518",
                        "interface": "配国内机518"
                    }
                ],
                "withCover": [],
                "detachable": [
                    {
                        "model": "HGTHT8.6/18X",
                        "interface": "可拆式，SAE18\""
                    },
                    {
                        "model": "HGTHT8.6/21X",
                        "interface": "可拆式，SAE21\""
                    },
                    {
                        "model": "HGTLX8.6/16",
                        "interface": ""
                    },
                    {
                        "model": "HGTLX8.6/18",
                        "interface": ""
                    },
                    {
                        "model": "HGTLX8.6/21",
                        "interface": ""
                    }
                ],
                "gearTooth": []
            }
        },
        "inputSpeedRange": [
            600,
            2100
        ],
        "transmissionCapacityPerRatio": [
            0.642,
            0.592,
            0.527,
            0.485
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCT800P",
        "series": "HCT",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            4.95,
            5.57,
            5.93,
            6.43
        ],
        "maxPower": 1563,
        "minPower": 625,
        "powerSource": "传动能力计算",
        "price": 285000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.625,
            0.625,
            0.625,
            0.625
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
        "image": "/images/gearbox/Advance-800-1000.webp",
        "thrust": 140,
        "centerDistance": 450,
        "dimensions": "1056×1280×1425",
        "weight": 2500
    },
    {
        "model": "HCTS1200",
        "series": "HCT",
        "minSpeed": 700,
        "maxSpeed": 1800,
        "ratios": [
            5.05,
            5.6,
            5.98,
            6.39,
            6.85,
            7.35,
            7.9
        ],
        "thrust": 0.93,
        "centerDistance": 150,
        "dimensions": "705",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 135000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1674,
        "minPower": 651,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            700,
            1800
        ],
        "transmissionCapacityPerRatio": [
            0.93,
            0.93,
            0.93,
            0.93,
            0.93,
            0.93,
            0.93
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
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCTS1400",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 1800,
        "ratios": [
            4.06,
            4.51,
            5.03,
            5.52,
            5.97,
            6.48,
            7.03,
            7.5,
            8.01,
            8.47,
            8.98,
            9.55
        ],
        "thrust": 1.03,
        "centerDistance": 220,
        "dimensions": "775",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 150000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1854,
        "minPower": 618,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1800
        ],
        "transmissionCapacityPerRatio": [
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            1.03,
            1.03
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
        "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
    },
    {
        "model": "HCTS1600",
        "series": "HCT",
        "minSpeed": 500,
        "maxSpeed": 1650,
        "ratios": [
            5.55,
            5.97,
            6.59,
            6.99,
            7.44,
            7.92,
            8.46,
            9,
            9.53
        ],
        "thrust": 1.213,
        "centerDistance": 250,
        "dimensions": "815",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 165000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2001,
        "minPower": 465,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            500,
            1650
        ],
        "transmissionCapacityPerRatio": [
            1.213,
            1.213,
            1.213,
            1.213,
            1.213,
            1.213,
            1.104,
            1.104,
            0.93
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
        "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
    },
    {
        "model": "HCTS2000",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 1500,
        "ratios": [
            5.19,
            5.49,
            5.94,
            6.58,
            7.01,
            7.48,
            8,
            8.57,
            8.84,
            9.43,
            10.04,
            11
        ],
        "thrust": 1.48,
        "centerDistance": 270,
        "dimensions": "870",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 195000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2220,
        "minPower": 660,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1500
        ],
        "transmissionCapacityPerRatio": [
            1.48,
            1.48,
            1.48,
            1.48,
            1.48,
            1.48,
            1.48,
            1.42,
            1.42,
            1.26,
            1.26,
            1.1
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
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCTS2700",
        "series": "HCT",
        "minSpeed": 500,
        "maxSpeed": 1400,
        "ratios": [
            4.92,
            5.43,
            6.16,
            6.58,
            7.03,
            7.53,
            8.01,
            8.54,
            9.12,
            9.42,
            10.05
        ],
        "thrust": 2.05,
        "centerDistance": 340,
        "dimensions": "945",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 247500,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 2870,
        "minPower": 770,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            500,
            1400
        ],
        "transmissionCapacityPerRatio": [
            2.05,
            2.05,
            2.05,
            2.05,
            2.05,
            2.05,
            2.05,
            1.92,
            1.83,
            1.76,
            1.54
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCTS800",
        "series": "HCT",
        "minSpeed": 600,
        "maxSpeed": 1800,
        "ratios": [
            4.95,
            5.57,
            5.68,
            5.93,
            6.43,
            6.86,
            7.33,
            7.84,
            8.4
        ],
        "thrust": 0.625,
        "centerDistance": 140,
        "dimensions": "645",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 105000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 1125,
        "minPower": 288,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            600,
            1800
        ],
        "transmissionCapacityPerRatio": [
            0.625,
            0.625,
            0.625,
            0.625,
            0.625,
            0.588,
            0.551,
            0.515,
            0.48
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
        "image": "/images/gearbox/Advance-800-1000.webp"
    },
    {
        "model": "HCV100",
        "series": "HCV",
        "inputSpeedRange": [
            1200,
            2600
        ],
        "ratios": [
            2.02,
            2.48,
            2.95,
            3.45,
            4
        ],
        "weight": 70,
        "thrust": null,
        "dimensions": null,
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
        "discountRate": 0.1
    },
    {
        "model": "HCV120",
        "series": "HCV",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            1.64,
            2.03,
            2.5,
            3,
            3.57,
            4,
            4.45
        ],
        "maxPower": 193,
        "minPower": 50,
        "powerSource": "传动能力计算",
        "price": 33500,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2100
        ],
        "weight": 300,
        "transmissionCapacityPerRatio": [
            0.077,
            0.077,
            0.077,
            0.069,
            0.062,
            0.055,
            0.05
        ],
        "imageUrl": "/images/gearbox/Advance-120C-HCV120.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCV系列船用齿轮箱是V型布置的船用齿轮箱,适用于特殊安装空间要求的船舶。",
        "dimensions": "861×660×600",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-120C-HCV120.webp"
    },
    {
        "model": "HCV120(倾角7°)",
        "series": "HCV",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            1.51,
            2.02,
            2.52
        ],
        "thrust": 25,
        "centerDistance": 393,
        "dimensions": "502×600×847",
        "weight": 300,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 38800,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 250,
        "minPower": 76,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            0.1,
            0.1,
            0.076
        ],
        "imageUrl": "/images/gearbox/Advance-120C-HCV120.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCV系列船用齿轮箱是V型布置的船用齿轮箱,适用于特殊安装空间要求的船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-120C-HCV120.webp"
    },
    {
        "model": "HCV230",
        "series": "HCV",
        "minSpeed": 1000,
        "maxSpeed": 2200,
        "ratios": [
            1.06,
            1.21,
            1.36,
            1.46,
            1.49,
            1.74,
            1.96,
            2.05,
            2.38,
            2.48
        ],
        "maxPower": 6490,
        "minPower": 2950,
        "powerSource": "传动能力计算",
        "price": 51000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2200
        ],
        "transmissionCapacityPerRatio": [
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95
        ],
        "imageUrl": "/images/gearbox/Advance-200-201-230.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCV系列船用齿轮箱是V型布置的船用齿轮箱,适用于特殊安装空间要求的船舶。",
        "dimensions": "1029×820×760",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 450,
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCV230(倾角7°)",
        "series": "HCV",
        "minSpeed": 1000,
        "maxSpeed": 2200,
        "ratios": [
            1.49,
            1.96,
            2.48
        ],
        "thrust": 27.5,
        "centerDistance": 480,
        "dimensions": "568×820×1020",
        "weight": 450,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 48700,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "maxPower": 405,
        "minPower": 146,
        "powerSource": "传动能力计算",
        "inputSpeedRange": [
            1000,
            2200
        ],
        "transmissionCapacityPerRatio": [
            0.184,
            0.17,
            0.146
        ],
        "imageUrl": "/images/gearbox/Advance-200-201-230.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/96c2d20d-b18b-453f-9f72-17ba24c00a57.png",
        "introduction": "HCV系列船用齿轮箱是V型布置的船用齿轮箱,适用于特殊安装空间要求的船舶。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCVG3710",
        "series": "HCVG",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            1.36,
            1.48,
            1.53,
            2.02,
            2.03,
            2.47,
            2.5,
            2.55,
            2.96
        ],
        "thrust": 90,
        "centerDistance": 600,
        "maxPower": 7400,
        "minPower": 2960,
        "powerSource": "传动能力计算",
        "price": 540000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1000,
            2500
        ],
        "transmissionCapacityPerRatio": [
            2.96,
            2.96,
            2.96,
            2.96,
            2.96,
            2.96,
            2.96,
            2.96,
            2.96
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "domestic": [
                "φ770"
            ]
        },
        "weight": 600,
        "image": "/images/gearbox/Advance-200-201-230.webp"
    },
    {
        "model": "HCW1100",
        "series": "HCW",
        "minSpeed": 1500,
        "maxSpeed": 1800,
        "ratios": [
            15.88,
            16.38,
            17.24,
            17.97,
            18.74,
            19.55,
            20.4,
            21.99
        ],
        "thrust": 300,
        "centerDistance": 625,
        "dimensions": "1567×1630×2550",
        "weight": 6900,
        "maxPower": 1676,
        "minPower": 1052,
        "powerSource": "传动能力计算",
        "price": 257500,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "inputSpeedRange": [
            1500,
            1800
        ],
        "transmissionCapacityPerRatio": [
            0.931,
            0.931,
            0.894,
            0.857,
            0.822,
            0.788,
            0.756,
            0.701
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "sae": [
                "SAE1#8寸",
                "SAE2#1寸"
            ],
            "domestic": [
                "φ770"
            ]
        },
        "image": "/images/gearbox/Advance-1100-1200.webp"
    },
    {
        "model": "J300",
        "series": "other",
        "minSpeed": 750,
        "maxSpeed": 2500,
        "ratios": [
            2.04,
            2.54,
            3,
            3.47,
            3.95
        ],
        "transmissionCapacityPerRatio": [
            0.28,
            0.28,
            0.28,
            0.28,
            0.257
        ],
        "thrust": 60,
        "centerDistance": 264,
        "dimensions": "786×930×864",
        "weight": 740,
        "controlType": "推拉软轴/电控/气控",
        "price": 26680,
        "discountRate": 0.22,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 700,
        "minPower": 193,
        "powerSource": "传动能力计算",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "MA100",
        "series": "MA",
        "minSpeed": 1500,
        "maxSpeed": 3000,
        "ratios": [
            1.6,
            2,
            2.55,
            3.11,
            3.59,
            3.88
        ],
        "thrust": 3,
        "centerDistance": 100,
        "dimensions": "236×390×420",
        "weight": 75,
        "maxPower": 27,
        "minPower": 9,
        "powerSource": "传动能力计算",
        "price": 24000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.009,
            0.009,
            0.007,
            0.007,
            0.006,
            0.006
        ],
        "imageUrl": "/images/gearbox/MA.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "MA系列船用齿轮箱适用于中小型船舶。",
        "image": "/images/gearbox/MA.webp"
    },
    {
        "model": "MA125",
        "series": "MA",
        "minSpeed": 1500,
        "maxSpeed": 3000,
        "ratios": [
            2.03,
            2.46,
            3.04,
            3.57,
            4.05,
            4.39,
            4.7
        ],
        "thrust": 5.5,
        "centerDistance": 125,
        "dimensions": "291×454×485",
        "weight": 115,
        "maxPower": 60,
        "minPower": 17,
        "powerSource": "传动能力计算",
        "price": 24000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.02,
            0.02,
            0.018,
            0.016,
            0.014,
            0.013,
            0.011
        ],
        "imageUrl": "/images/gearbox/MA.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "MA系列船用齿轮箱适用于中小型船舶。",
        "image": "/images/gearbox/MA.webp"
    },
    {
        "model": "MA142",
        "series": "MA",
        "minSpeed": 1500,
        "maxSpeed": 2500,
        "ratios": [
            1.97,
            2.52,
            3.03,
            3.54,
            3.95,
            4.5,
            5.06,
            5.47
        ],
        "thrust": 8.5,
        "centerDistance": 142,
        "dimensions": "308×520×540",
        "weight": 140,
        "maxPower": 75,
        "minPower": 20,
        "powerSource": "传动能力计算",
        "price": 24000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.03,
            0.03,
            0.03,
            0.026,
            0.023,
            0.019,
            0.016,
            0.013
        ],
        "imageUrl": "/images/gearbox/MA.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "MA系列船用齿轮箱适用于中小型船舶。",
        "image": "/images/gearbox/MA.webp"
    },
    {
        "model": "MB170",
        "series": "MB",
        "minSpeed": 1500,
        "maxSpeed": 2500,
        "ratios": [
            1.97,
            2.52,
            3.04,
            3.54,
            3.96,
            4.5,
            5.06,
            5.47,
            5.88
        ],
        "thrust": 16,
        "centerDistance": 170,
        "dimensions": "510×670×656",
        "weight": 240,
        "maxPower": 98,
        "minPower": 41,
        "powerSource": "传动能力计算",
        "price": 10950,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.039,
            0.039,
            0.039,
            0.039,
            0.039,
            0.031,
            0.031,
            0.027,
            0.027
        ],
        "imageUrl": "/images/gearbox/Advance-MB.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "MB系列船用齿轮箱适用于中型船舶。",
        "inputInterfaces": {
            "sae": [
                "SAE1#1.5寸",
                "SAE1#14寸",
                "SAE1#4寸",
                "SAE2#11.5寸",
                "SAE3#11.5寸"
            ],
            "plainFlange": true
        },
        "image": "/images/gearbox/Advance-MB.webp"
    },
    {
        "model": "MB242",
        "series": "MB",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            2,
            2.54,
            3.04,
            3.52,
            3.95,
            4.53,
            5.12,
            5.56,
            5.88
        ],
        "thrust": 30,
        "centerDistance": 242,
        "dimensions": "442×774×763",
        "weight": 385,
        "maxPower": 258,
        "minPower": 74,
        "powerSource": "传动能力计算",
        "price": 21300,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.103,
            0.103,
            0.103,
            0.103,
            0.103,
            0.103,
            0.1,
            0.094,
            0.074
        ],
        "imageUrl": "/images/gearbox/Advance-MB.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "MB系列船用齿轮箱适用于中型船舶。",
        "inputInterfaces": {
            "sae": [
                "SAE1#1.5寸",
                "SAE1#4寸"
            ]
        },
        "image": "/images/gearbox/Advance-MB.webp"
    },
    {
        "model": "MB270A",
        "series": "MB",
        "minSpeed": 1000,
        "maxSpeed": 2500,
        "ratios": [
            3,
            4.05,
            4.53,
            5.12,
            5.5,
            5.95,
            6.39,
            6.82
        ],
        "thrust": 39.2,
        "centerDistance": 270,
        "dimensions": "594×810×868",
        "weight": 675,
        "maxPower": 368,
        "minPower": 88,
        "powerSource": "传动能力计算",
        "price": 36000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            0.147,
            0.147,
            0.147,
            0.147,
            0.134,
            0.11,
            0.088,
            0.088
        ],
        "imageUrl": "/images/gearbox/Advance-MB.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "MB系列船用齿轮箱适用于中型船舶。",
        "inputInterfaces": {
            "sae": [
                "SAE0#16寸",
                "SAE0#18寸",
                "SAE1#14寸",
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸"
            ],
            "plainFlange": true
        },
        "image": "/images/gearbox/Advance-MB.webp"
    },
    {
        "model": "MV100A",
        "series": "MV",
        "minSpeed": 1000,
        "maxSpeed": 3000,
        "ratios": [
            1.23,
            1.28,
            1.62,
            2.07,
            2.56,
            2.87
        ],
        "maxPower": 8850,
        "minPower": 2950,
        "powerSource": "传动能力计算",
        "price": 100000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            2.95,
            2.95,
            2.95,
            2.95,
            2.95,
            2.95
        ],
        "imageUrl": "/images/gearbox/Advance-HCQ100-MV100A.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "MV系列船用齿轮箱是V型布置版本。",
        "dimensions": "668×630×586",
        "inputInterfaces": {
            "sae": [
                "SAE1#1.5寸",
                "SAE1#4寸"
            ],
            "boltPatterns": [
                "10-φ12",
                "12-φ11",
                "12-φ12.5",
                "8-φ11",
                "8-φ14"
            ]
        },
        "weight": 220,
        "image": "/images/gearbox/Advance-HCQ100-MV100A.webp"
    },
    {
        "model": "MV100A(倾角7°)",
        "series": "MV",
        "ratios": [
            1.23,
            1.28,
            1.62,
            2.07,
            2.56,
            2.87
        ],
        "transmissionCapacityPerRatio": [
            0.1,
            0.1,
            0.1,
            0.1,
            0.09,
            0.08
        ],
        "minSpeed": 1000,
        "maxSpeed": 3000,
        "price": null,
        "source": "2025选型手册第13页",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "MV系列船用齿轮箱是V型布置版本。",
        "inputInterfaces": {
            "sae": [
                "SAE1#1.5寸",
                "SAE1#4寸"
            ],
            "boltPatterns": [
                "10-φ12",
                "12-φ11",
                "12-φ12.5",
                "8-φ11",
                "8-φ14"
            ]
        },
        "weight": 220,
        "minPower": 80,
        "maxPower": 300,
        "powerSource": "传动能力计算",
        "image": "/images/gearbox/Advance-HCQ100-MV100A.webp",
        "thrust": 20,
        "centerDistance": 0,
        "dimensions": "485×508×580"
    },
    {
        "model": "SGW30.32",
        "series": "other",
        "minSpeed": 400,
        "maxSpeed": 870,
        "ratios": [
            2.33,
            3.52
        ],
        "transmissionCapacityPerRatio": [
            1.94,
            2.91
        ],
        "thrust": 1.109,
        "centerDistance": 100,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 45000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 2532,
        "minPower": 776,
        "powerSource": "传动能力计算",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "SGW32.35",
        "series": "other",
        "minSpeed": 400,
        "maxSpeed": 760,
        "ratios": [
            1.92,
            2.17
        ],
        "transmissionCapacityPerRatio": [
            1.62,
            1.81
        ],
        "thrust": 1.604,
        "centerDistance": 113,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 52000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 1376,
        "minPower": 648,
        "powerSource": "传动能力计算",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "SGW39.41",
        "series": "other",
        "minSpeed": 400,
        "maxSpeed": 1700,
        "ratios": [
            4.16
        ],
        "transmissionCapacityPerRatio": [
            3.57
        ],
        "thrust": 1.427,
        "centerDistance": 175,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 245000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "maxPower": 6069,
        "minPower": 1428,
        "powerSource": "传动能力计算",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "SGW42.45",
        "series": "other",
        "minSpeed": 400,
        "maxSpeed": 1600,
        "ratios": [
            5.6
        ],
        "transmissionCapacityPerRatio": [
            5
        ],
        "thrust": 1.243,
        "centerDistance": 220,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 273000,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "maxPower": 8000,
        "minPower": 2000,
        "powerSource": "传动能力计算",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "SGW49.54",
        "series": "other",
        "minSpeed": 400,
        "maxSpeed": 880,
        "ratios": [
            3.39
        ],
        "transmissionCapacityPerRatio": [
            2.92
        ],
        "thrust": 3.588,
        "centerDistance": 284,
        "dimensions": null,
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 520000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 2570,
        "minPower": 1168,
        "powerSource": "传动能力计算",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "SGWS49.54",
        "series": "other",
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
            1.57,
            1.64,
            1.73,
            1.77,
            1.82
        ],
        "thrust": 2.647,
        "centerDistance": 290,
        "dimensions": "540",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 116000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 2184,
        "minPower": 628,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "SGWS52.59",
        "series": "other",
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
            1.57,
            1.64,
            1.73,
            1.77,
            1.82
        ],
        "thrust": 3.448,
        "centerDistance": 360,
        "dimensions": "590",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 155000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 2184,
        "minPower": 628,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "SGWS60.66",
        "series": "other",
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
            1.61,
            1.65,
            1.74,
            1.78,
            1.83
        ],
        "thrust": 4.625,
        "centerDistance": 540,
        "dimensions": "668",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 210000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 2196,
        "minPower": 644,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "SGWS66.75",
        "series": "other",
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
            1.57,
            1.64,
            1.73,
            1.77,
            1.82
        ],
        "thrust": 6.99,
        "centerDistance": 730,
        "dimensions": "750",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 280000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 1729,
        "minPower": 471,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "SGWS70.76",
        "series": "other",
        "minSpeed": 300,
        "maxSpeed": 950,
        "ratios": [
            1.94,
            2.54,
            3,
            3.5,
            3.95
        ],
        "transmissionCapacityPerRatio": [
            1.57,
            1.61,
            1.69,
            1.73,
            1.78
        ],
        "thrust": 8.111,
        "centerDistance": 750,
        "dimensions": "768",
        "weight": null,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 350000,
        "discountRate": 0.1,
        "priceSource": "精确价格",
        "maxPower": 1691,
        "minPower": 471,
        "powerSource": "传动能力计算",
        "imageUrl": "/images/gearbox/Advance-GWS.webp",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-GWS.webp"
    },
    {
        "model": "T300",
        "series": "other",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            4.73,
            4.95,
            5.51,
            6.03,
            6.65,
            7.04,
            7.54,
            8.02,
            8.47
        ],
        "transmissionCapacityPerRatio": [
            0.243,
            0.243,
            0.243,
            0.243,
            0.243,
            0.243,
            0.221,
            0.221,
            0.2
        ],
        "thrust": 70,
        "centerDistance": 355,
        "dimensions": "772×980×1106",
        "weight": 1120,
        "controlType": "推拉软轴/电控/气控",
        "price": 43900,
        "discountRate": 0.16,
        "source": "杭齿厂选型手册2025版5月版",
        "maxPower": 559,
        "minPower": 200,
        "powerSource": "传动能力计算",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "sae": [
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸"
            ],
            "plainFlange": true
        },
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "T300/1",
        "series": "other",
        "minSpeed": 1000,
        "maxSpeed": 2300,
        "ratios": [
            8.94,
            9.45
        ],
        "transmissionCapacityPerRatio": [
            0.196,
            0.196
        ],
        "thrust": 70,
        "centerDistance": 355,
        "dimensions": "772×980×1106",
        "weight": 1120,
        "source": "杭齿厂选型手册2025版5月版",
        "price": 46900,
        "discountRate": 0.1,
        "priceSource": "2026官方出厂价",
        "maxPower": 451,
        "minPower": 196,
        "powerSource": "传动能力计算",
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "inputInterfaces": {
            "sae": [
                "SAE1#4寸",
                "SAE1#6寸",
                "SAE1#8寸"
            ],
            "plainFlange": true
        },
        "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
    },
    {
        "model": "X6110C",
        "series": "X6",
        "minSpeed": 750,
        "maxSpeed": 1800,
        "ratios": [
            2.03,
            2.81,
            3.73
        ],
        "maxPower": 6714,
        "minPower": 2798,
        "powerSource": "传动能力计算",
        "price": 100000,
        "discountRate": 0.1,
        "priceSource": "系统估算",
        "source": "杭齿厂选型手册2025版5月版",
        "transmissionCapacityPerRatio": [
            3.73,
            3.73,
            3.73
        ],
        "officialImage": "https://omo-oss-image.thefastimg.com/portal-saas/new2023060514535358518/cms/image/4bc80648-8b88-4adf-a3f9-8f4d3fc920e4.png",
        "introduction": "杭州前进齿轮箱集团船用齿轮箱产品。",
        "image": "/images/gearbox/Advance-GC.webp"
    }
];

export default completeGearboxData;
