// Continuing the update for embeddedData.js

export const embeddedGearboxData = {
  "hcGearboxes": [
    // ... (HC entries updated in the previous response) ...
      {
      "model": "40A", // Found on OCR P3
      "inputSpeedRange": [750, 2000], "ratios": [2.07, 2.96, 3.44, 3.83], "transferCapacity": [0.0294, 0.0294, 0.0235, 0.02], "thrust": 8.8, "centerDistance": 142, "weight": 225, "controlType": "推拉软轴", "dimensions": "490x670x620",
      "basePrice": 8560, "price": 8560, "discountRate": 0.16, "factoryPrice": 7190.4, "packagePrice": 7190.4, "marketPrice": 8170.91
    },
    {
      "model": "120C", // Found on OCR P3
      "inputSpeedRange": [1000, 2500], "ratios": [1.48, 1.61, 1.94, 2.45, 2.96, 3.35], "transferCapacity": [0.1, 0.1, 0.1, 0.1, 0.09, 0.08], "thrust": 25, "centerDistance": 180, "weight": 225, "controlType": "推拉软轴/电控", "dimensions": "432x440x650",
      "basePrice": 13420, "price": 13420, "discountRate": 0.12, "factoryPrice": 11809.6, "packagePrice": 11809.6, "marketPrice": 13420
    },
     {
      "model": "HCN120", // Assumed alias for 120C
      "inputSpeedRange": [1000, 2500], "ratios": [1.48, 1.61, 1.94, 2.45, 2.96, 3.35], "transferCapacity": [0.1, 0.1, 0.1, 0.1, 0.09, 0.08], "thrust": 25, "centerDistance": 180, "weight": 225, "controlType": "推拉软轴/电控", "dimensions": "432x440x650",
       "basePrice": 13420, "price": 13420, "discountRate": 0.12, "factoryPrice": 11809.6, "packagePrice": 11809.6, "marketPrice": 13420
    },
    {
      "model": "120B", // Found on OCR P3
      "inputSpeedRange": [750, 1800], "ratios": [2.03, 2.81, 3.73], "transferCapacity": [0.088, 0.088, 0.044], "thrust": 25, "centerDistance": 190, "weight": 400, "controlType": "推拉软轴/电控", "dimensions": "605x744x770",
      "basePrice": 12520, "price": 12520, "discountRate": 0.12, "factoryPrice": 11017.6, "packagePrice": 11017.6, "marketPrice": 12520
    },
    {
      "model": "MB170", // Found on OCR P3
      "inputSpeedRange": [1500, 2500], "ratios": [1.97, 2.52, 3.04, 3.54, 3.96, 4.5, 5.06, 5.47, 5.88], "transferCapacity": [0.039, 0.039, 0.039, 0.039, 0.039, 0.031, 0.031, 0.027, 0.027], "thrust": 16, "centerDistance": 170, "weight": 240, "controlType": "推拉软轴/电控", "dimensions": "510x670x656",
      "basePrice": 10950, "price": 10950, "discountRate": 0.12, "factoryPrice": 9636, "packagePrice": 9636, "marketPrice": 10950
    },
     {
      "model": "MB242", // Found on OCR P3
      "inputSpeedRange": [1000, 2500], "ratios": [2, 2.54, 3.04, 3.52, 3.95, 4.53, 5.12, 5.56, 5.88], "transferCapacity": [0.103, 0.103, 0.103, 0.103, 0.103, 0.103, 0.1, 0.094, 0.074], "thrust": 30, "centerDistance": 242, "weight": 385, "controlType": "推拉软轴/电控/气控", "dimensions": "442x774x763",
       "basePrice": 21300, "price": 21300, "discountRate": 0.12, "factoryPrice": 18744, "packagePrice": 18744, "marketPrice": 21300
    },
    {
      "model": "MB270A", // Found on OCR P3 (Prices differ by ratio)
      "inputSpeedRange": [1000, 2500], "ratios": [3, 4.05, 4.53, 5.12, 5.5, 5.95, 6.39, 6.82], "transferCapacity": [0.147, 0.147, 0.147, 0.147, 0.134, 0.11, 0.088, 0.088], "thrust": 39.2, "centerDistance": 270, "weight": 675, "controlType": "推拉软轴/电控/气控", "dimensions": "594x810x868",
      "basePrice": 28600, "price": 28600, "discountRate": 0.12, "factoryPrice": 25168, "packagePrice": 25168, "marketPrice": 28600 // Using 3-5.5:1 price
    },
     {
      "model": "135", // Found on OCR P3
      "inputSpeedRange": [750, 2000], "ratios": [2.03, 2.59, 3.04, 3.62, 4.11, 4.65, 5.06, 5.47, 5.81], "transferCapacity": [0.1, 0.1, 0.1, 0.1, 0.1, 0.093, 0.088, 0.077, 0.07], "thrust": 29.4, "centerDistance": 225, "weight": 470, "controlType": "推拉软轴/电控", "dimensions": "578x792x830",
       "basePrice": 18360, "price": 18360, "discountRate": 0.16, "factoryPrice": 15422.4, "packagePrice": 15422.4, "marketPrice": 17525.45
    },
    {
      "model": "135A", // Found on OCR P3
      "inputSpeedRange": [750, 2000], "ratios": [2.03, 2.59, 3.04, 3.62, 4.11, 4.65, 5.06, 5.47, 5.81], "transferCapacity": [0.1, 0.1, 0.1, 0.1, 0.1, 0.093, 0.088, 0.077, 0.07], "thrust": 29.4, "centerDistance": 225, "weight": 470, "controlType": "推拉软轴/电控", "dimensions": "578x792x830",
      "basePrice": 19200, "price": 19200, "discountRate": 0.16, "factoryPrice": 16128, "packagePrice": 16128, "marketPrice": 18327.27
    },
    {
      "model": "HC138", // Found on OCR P3
      "inputSpeedRange": [1000, 2500], "ratios": [2, 2.52, 3, 3.57, 4.05, 4.45], "transferCapacity": [0.11], "thrust": 30, "centerDistance": 225, "weight": 460, "controlType": "推拉软轴/电控/气控", "dimensions": "520x792x760",
      "basePrice": 18200, "price": 18200, "discountRate": 0.16, "factoryPrice": 15288, "packagePrice": 15288, "marketPrice": 17372.73
    },
    {
      "model": "HCD138", // Found on OCR P3
      "inputSpeedRange": [1000, 2500], "ratios": [5.05, 5.63, 6.06, 6.47], "transferCapacity": [0.11, 0.11, 0.099, 0.093], "thrust": 40, "centerDistance": 296, "weight": 415, "controlType": "推拉软轴/电控/气控", "dimensions": "494x800x870",
      "basePrice": 19400, "price": 19400, "discountRate": 0.16, "factoryPrice": 16296, "packagePrice": 16296, "marketPrice": 18518.18
    },
     {
      "model": "300", // Found on OCR P3 (Prices differ by ratio)
      "inputSpeedRange": [750, 2500], "ratios": [1.87, 2.04, 2.54, 3, 3.53, 4.1, 4.47, 4.61, 4.94, 5.44], "transferCapacity": [0.257, 0.257, 0.257, 0.243, 0.221, 0.184, 0.184, 0.184, 0.147, 0.125], "thrust": 50, "centerDistance": 264, "weight": 740, "controlType": "推拉软轴/电控/气控", "dimensions": "786x930x880",
      "basePrice": 23000, "price": 23000, "discountRate": 0.16, "factoryPrice": 19320, "packagePrice": 19320, "marketPrice": 21954.55 // Using 1.87-3:1 price
    },
    {
      "model": "J300", // Found on OCR P3
      "inputSpeedRange": [750, 2500], "ratios": [2.04, 2.54, 3, 3.47, 3.95], "transferCapacity": [0.28, 0.28, 0.28, 0.28, 0.257], "thrust": 60, "centerDistance": 264, "weight": 740, "controlType": "推拉软轴/电控/气控", "dimensions": "786x930x864",
      "basePrice": 26680, "price": 26680, "discountRate": 0.22, "factoryPrice": 20810.4, "packagePrice": 20810.4, "marketPrice": 23648.18
    },
    {
      "model": "HC300", // Found on OCR P3 (Prices differ by ratio)
      "inputSpeedRange": [750, 2500], "ratios": [1.87, 2.04, 2.54, 3, 3.53, 4.1, 4.47, 4.61, 4.94, 5.44], "transferCapacity": [0.5542, 0.5567, 0.5567, 0.5542, 0.5492, 0.5417, 0.5318, 0.5193, 0.5044, 0.4870], "thrust": 90, "centerDistance": 0, "weight": 1100, "controlType": "推拉软轴/电控", "dimensions": "-",
      "basePrice": 24600, "price": 24600, "discountRate": 0.16, "factoryPrice": 20664, "packagePrice": 20664, "marketPrice": 23481.82 // Using 1.5-4.61 price
    },
    {
      "model": "D300A", // Found on OCR P3 (Prices differ by ratio)
      "inputSpeedRange": [1000, 2500], "ratios": [4, 4.48, 5.05, 5.52, 5.9, 6.56, 7.06, 7.63], "transferCapacity": [0.257, 0.243, 0.221, 0.184, 0.184, 0.184, 0.147, 0.125], "thrust": 60, "centerDistance": 355, "weight": 940, "controlType": "推拉软轴/电控/气控", "dimensions": "786x1010x1041",
      "basePrice": 32420, "price": 32420, "discountRate": 0.22, "factoryPrice": 25287.6, "packagePrice": 25287.6, "marketPrice": 28735.91 // Using 4-5.5:1 price
    },
    {
      "model": "T300", // Found on OCR P3
      "inputSpeedRange": [1000, 2300], "ratios": [4.73, 4.95, 5.51, 6.03, 6.65, 7.04, 7.54, 8.02, 8.47], "transferCapacity": [0.243, 0.243, 0.243, 0.243, 0.243, 0.243, 0.221, 0.221, 0.2], "thrust": 70, "centerDistance": 355, "weight": 1120, "controlType": "推拉软轴/电控/气控", "dimensions": "770x980x1106",
      "basePrice": 43900, "price": 43900, "discountRate": 0.16, "factoryPrice": 36876, "packagePrice": 36876, "marketPrice": 41904.55
    },
    {
      "model": "T300/1", // Found on OCR P3
      "inputSpeedRange": [1000, 2300], "ratios": [8.94, 9.45], "transferCapacity": [0.196, 0.196], "thrust": 70, "centerDistance": 355, "weight": 1120, "controlType": "推拉软轴/电控/气控", "dimensions": "770x980x1106",
      "basePrice": 46900, "price": 46900, "discountRate": 0.16, "factoryPrice": 39396, "packagePrice": 39396, "marketPrice": 44768.18
    },
    {
      "model": "HC400", // Found on OCR P4
      "inputSpeedRange": [1000, 1800], "ratios": [1.5, 1.77, 2.04, 2.5, 2.86, 3, 3.25, 3.33, 3.42, 3.6, 3.96, 4.33, 4.43, 4.7, 5], "transferCapacity": [0.331, 0.3258, 0.3199, 0.3132, 0.3058, 0.2976, 0.2887, 0.279, 0.2686, 0.2573, 0.2454, 0.2327, 0.2192, 0.205, 0.19], "thrust": 82, "centerDistance": 264, "weight": 820, "controlType": "推拉软轴/电控/气控", "dimensions": "-",
      "basePrice": 32150, "price": 32150, "discountRate": 0.22, "factoryPrice": 25077, "packagePrice": 25077, "marketPrice": 28496.59
    },
    {
      "model": "HCD400A", // Found on OCR P4
      "inputSpeedRange": [1000, 1800], "ratios": [3.96, 4.33, 4.43, 4.7, 5, 5.53, 5.71, 5.89, 6], "transferCapacity": [0.331, 0.331, 0.331, 0.331, 0.331, 0.293, 0.272, 0.272, 0.267], "thrust": 82, "centerDistance": 355, "weight": 1100, "controlType": "推拉软轴/电控/气控", "dimensions": "641x1010x988",
      "basePrice": 38150, "price": 38150, "discountRate": 0.22, "factoryPrice": 29757, "packagePrice": 29757, "marketPrice": 33814.77
    },
     {
      "model": "HCT400A", // Found on OCR P4
      "inputSpeedRange": [1000, 2100], "ratios": [6.09, 6.49, 6.93, 7.42, 7.96, 8.4, 9, 9.47], "transferCapacity": [0.331, 0.331, 0.331, 0.331, 0.309, 0.294, 0.279, 0.279], "thrust": 82, "centerDistance": 375, "weight": 1450, "controlType": "推拉软轴/电控/气控", "dimensions": "784x992x1130",
       "basePrice": 51000, "price": 51000, "discountRate": 0.16, "factoryPrice": 42840, "packagePrice": 42840, "marketPrice": 48681.82
    },
    {
      "model": "HCT400A/1", // Found on OCR P4
      "inputSpeedRange": [1000, 2100], "ratios": [8.15, 8.69, 9.27, 9.94, 10.6, 11.37, 12, 12.5, 13.96], "transferCapacity": [0.331, 0.331, 0.331, 0.316, 0.297, 0.274, 0.262, 0.262, 0.204], "thrust": 120, "centerDistance": 465, "weight": 1500, "controlType": "推拉软轴/电控/气控", "dimensions": "869x1100x1275",
      "basePrice": 60000, "price": 60000, "discountRate": 0.16, "factoryPrice": 50400, "packagePrice": 50400, "marketPrice": 57272.73
    },
    {
      "model": "HC600A", // Found on OCR P4
      "inputSpeedRange": [1000, 2100], "ratios": [2, 2.48, 2.63, 3, 3.58, 3.89], "transferCapacity": [0.49], "thrust": 90, "centerDistance": 320, "weight": 1300, "controlType": "推拉软轴/电控/气控", "dimensions": "-",
      "basePrice": 57200, "price": 57200, "discountRate": 0.12, "factoryPrice": 50336, "packagePrice": 50336, "marketPrice": 57200
    },
    {
      "model": "HCD600A", // Found on OCR P4
      "inputSpeedRange": [1000, 2100], "ratios": [4.18, 4.43, 4.7, 5, 5.44, 5.71], "transferCapacity": [0.49, 0.49, 0.49, 0.49, 0.45, 0.43], "thrust": 90, "centerDistance": 415, "weight": 1550, "controlType": "推拉软轴/电控/气控", "dimensions": "745x1214x1271",
      "basePrice": 60600, "price": 60600, "discountRate": 0.12, "factoryPrice": 53328, "packagePrice": 53328, "marketPrice": 60600
    },
     {
      "model": "HCT600A", // Found on OCR P4
      "inputSpeedRange": [1000, 2100], "ratios": [6.06, 6.49, 6.97, 7.51, 8.04, 8.66, 9.35], "transferCapacity": [0.45, 0.419, 0.39, 0.363, 0.338, 0.314, 0.291], "thrust": 90, "centerDistance": 415, "weight": 1650, "controlType": "推拉软轴/电控/气控", "dimensions": "821x1214x1271",
       "basePrice": 70900, "price": 70900, "discountRate": 0.12, "factoryPrice": 62392, "packagePrice": 62392, "marketPrice": 70900
    },
    {
      "model": "HCT600A/1", // Found on OCR P4
      "inputSpeedRange": [1000, 2100], "ratios": [6.09, 6.48, 7.04, 7.69, 8.23, 8.82, 9.47, 10.1, 10.8, 11.65, 12.57, 13.64, 14.44, 15.91], "transferCapacity": [0.49, 0.49, 0.49, 0.49, 0.49, 0.485, 0.45, 0.423, 0.395, 0.367, 0.34, 0.313, 0.296, 0.268], "thrust": 140, "centerDistance": 500, "weight": 1700, "controlType": "推拉软轴/电控/气控", "dimensions": "878x1224x1346",
      "basePrice": 75000, "price": 75000, "discountRate": 0.12, "factoryPrice": 66000, "packagePrice": 66000, "marketPrice": 75000
    },
    {
      "model": "HCD800", // Found on OCR P4
      "inputSpeedRange": [600, 2100], "ratios": [3, 3.43, 3.96, 4.17, 4.39, 4.9, 5.47, 5.89], "transferCapacity": [0.625, 0.625, 0.625, 0.625, 0.625, 0.588, 0.551, 0.515], "thrust": 110, "centerDistance": 450, "weight": 2250, "controlType": "推拉软轴/电控/气控", "dimensions": "1056x1280x1341",
      "basePrice": 86100, "price": 86100, "discountRate": 0.08, "factoryPrice": 79212, "packagePrice": 79212, "marketPrice": 90013.64
    },
     {
      "model": "HCT800", // Found on OCR P4
      "inputSpeedRange": [600, 2100], "ratios": [4.95, 5.57, 5.68, 5.93, 6.43, 6.86, 7.33, 7.84, 8.4, 9], "transferCapacity": [0.625, 0.625, 0.625, 0.625, 0.625, 0.588, 0.551, 0.515, 0.48, 0.48], "thrust": 140, "centerDistance": 450, "weight": 2500, "controlType": "推拉软轴/电控/气控", "dimensions": "1056x1280x1425",
       "basePrice": 98000, "price": 98000, "discountRate": 0.08, "factoryPrice": 90160, "packagePrice": 90160, "marketPrice": 102454.55
    },
    {
        "model": "HCT800/1", // Found on OCR P4 (Using higher price line)
        "inputSpeedRange": [600, 2100], "ratios": [6.91, 7.28, 7.69, 8.13, 8.6, 9.12, 9.68, 10.3, 10.98, 11.76, 12.43, 13.17, 13.97, 14.85, 15.82, 16.58, 17.91, 20.12, 22.11], "transferCapacity": [0.625, 0.625, 0.625, 0.625, 0.625, 0.625, 0.625, 0.609, 0.575, 0.549, 0.52, 0.491, 0.463, 0.435, 0.408, 0.382, 0.378, 0.278, 0.278], "thrust": 220, "centerDistance": 582, "weight": 3300, "controlType": "推拉软轴/电控/气控", "dimensions": "1152x1360x1557",
        "basePrice": 137200, "price": 137200, "discountRate": 0.08, "factoryPrice": 126224, "packagePrice": 126224, "marketPrice": 143436.36
    },
    {
      "model": "HCT800/2", // Found on OCR P4
      "inputSpeedRange": [600, 2100], "ratios": [11.52, 12.21, 11.97, 14.08, 14.48, 14.88, 15.48, 15.76, 16.72, 17.78, 18.94], "transferCapacity": [0.6, 0.6, 0.6, 0.553, 0.549, 0.52, 0.503, 0.491, 0.463, 0.435, 0.382], "thrust": 220, "centerDistance": 666, "weight": 3960, "controlType": "推拉软轴/电控", "dimensions": "1190x1490x1707",
      "basePrice": 150200, "price": 150200, "discountRate": 0.08, "factoryPrice": 138184, "packagePrice": 138184, "marketPrice": 157027.27
    },
    {
      "model": "HCT800/3", // Found on OCR P4
      "inputSpeedRange": [600, 2100], "ratios": [16.56, 17.95, 20.19, 21.94], "transferCapacity": [0.597, 0.551, 0.491, 0.414], "thrust": 240, "centerDistance": 736, "weight": 4540, "controlType": "推拉软轴/电控/气控", "dimensions": "1235x1570x1789",
      "basePrice": 170800, "price": 170800, "discountRate": 0.08, "factoryPrice": 157136, "packagePrice": 157136, "marketPrice": 178563.64
    },
     {
      "model": "HCW800", // Found on OCR P2
      "inputSpeedRange": [1000, 1800], "ratios": [4, 5, 6], "transferCapacity": [0.6], "thrust": 150, "centerDistance": 500, "weight": 3000, "controlType": "推拉软轴/电控/气控", "dimensions": "-",
       "basePrice": 173900, "price": 173900, "discountRate": 0.08, "factoryPrice": 159988, "packagePrice": 159988, "marketPrice": 181804.55
    },
    {
      "model": "HC1000", // Found on OCR P2
      "inputSpeedRange": [600, 2100], "ratios": [2, 2.17, 2.5, 2.64, 3.04, 3.23, 3.48, 3.59, 4.06, 5.47, 5.83], "transferCapacity": [0.735, 0.7265, 0.718, 0.7095, 0.701, 0.6925, 0.684, 0.6755, 0.667, 0.6585, 0.65], "thrust": 110, "centerDistance": 335, "weight": 1500, "controlType": "推拉软轴/电控/气控", "dimensions": "-",
      "basePrice": 81200, "price": 81200, "discountRate": 0.06, "factoryPrice": 76328, "packagePrice": 76328, "marketPrice": 86736.36
    },
     {
      "model": "HCD1000", // Found on OCR P2
      "inputSpeedRange": [600, 2100], "ratios": [3.43, 3.96, 4.39, 4.45, 4.9, 5.06, 5.47, 5.83], "transferCapacity": [0.735, 0.735, 0.735, 0.735, 0.735, 0.735, 0.68, 0.65], "thrust": 140, "centerDistance": 450, "weight": 2200, "controlType": "推拉软轴/电控/气控", "dimensions": "1082x1120x990",
       "basePrice": 89800, "price": 89800, "discountRate": 0.06, "factoryPrice": 84412, "packagePrice": 84412, "marketPrice": 95922.73
    },
    {
      "model": "HCT1100", // Found on OCR P2
      "inputSpeedRange": [600, 1900], "ratios": [4.94, 5.6, 5.98, 6.39, 6.85, 7.35, 7.9, 8.53, 8.9], "transferCapacity": [0.846, 0.846, 0.846, 0.846, 0.835, 0.772, 0.736, 0.682, 0.653], "thrust": 150, "centerDistance": 500, "weight": 3200, "controlType": "推拉软轴/电控/气控", "dimensions": "1150x1350x1547",
      "basePrice": 128960, "price": 128960, "discountRate": 0.06, "factoryPrice": 121222.4, "packagePrice": 121222.4, "marketPrice": 137752.73
    },
     {
      "model": "HCW1100", // Found on OCR P2
      "inputSpeedRange": [1500, 1800], "ratios": [15.88, 16.38, 17.24, 17.97, 18.74, 19.55, 20.4, 21.99], "transferCapacity": [0.931, 0.931, 0.894, 0.857, 0.822, 0.788, 0.756, 0.701], "thrust": 300, "centerDistance": 625, "weight": 6900, "controlType": "推拉软轴/电控/气控", "dimensions": "1567x1630x2550",
       "basePrice": 257500, "price": 257500, "discountRate": 0.06, "factoryPrice": 242050, "packagePrice": 242050, "marketPrice": 275056.82
    },
     {
      "model": "HC1200", // Found on OCR P2
      "inputSpeedRange": [600, 1900], "ratios": [1.6, 2.03, 2.48, 2.5, 2.96, 3.18, 3.33, 3.55, 3.79, 4.06, 4.2, 4.47], "transferCapacity": [0.9379, 0.9122, 0.8862, 0.86, 0.8335, 0.8067, 0.7796, 0.7522, 0.7245, 0.6966, 0.6684, 0.6399], "thrust": 120, "centerDistance": 380, "weight": 1870, "controlType": "推拉软轴/电控/气控", "dimensions": "-",
      "basePrice": 92000, "price": 92000, "discountRate": 0.14, "factoryPrice": 79120, "packagePrice": 79120, "marketPrice": 89909.09
    },
    {
      "model": "HC1200/1", // Found on OCR P2
      "inputSpeedRange": [600, 1900], "ratios": [3.7, 3.74, 3.95, 4.14, 4.45, 5, 5.25, 5.58], "transferCapacity": [0.93, 0.93, 0.93, 0.93, 0.93, 0.833, 0.695, 0.65], "thrust": 140, "centerDistance": 450, "weight": 2500, "controlType": "推拉软轴/电控/气控", "dimensions": "1096x1260x1270",
      "basePrice": 108200, "price": 108200, "discountRate": 0.10, "factoryPrice": 97380, "packagePrice": 97380, "marketPrice": 110659.09
    },
    {
      "model": "HCT1200", // Found on OCR P2
      "inputSpeedRange": [600, 1900], "ratios": [5.05, 5.26, 5.6, 5.98, 6.39, 6.85, 7.35, 7.9], "transferCapacity": [0.93], "thrust": 150, "centerDistance": 500, "weight": 3200, "controlType": "推拉软轴/电控/气控", "dimensions": "1188x1350x1547",
      "basePrice": 143000, "price": 143000, "discountRate": 0.06, "factoryPrice": 134420, "packagePrice": 134420, "marketPrice": 152750
    },
    {
      "model": "HCT1200/1", // Found on OCR P2
      "inputSpeedRange": [600, 1900], "ratios": [8.55, 9.16, 9.57, 10.08, 10.74, 11.05, 11.45, 12.17, 12.53, 12.92, 13.65, 14, 14.54], "transferCapacity": [0.93, 0.93, 0.93, 0.93, 0.83, 0.82, 0.78, 0.74, 0.72, 0.7, 0.65, 0.625, 0.6], "thrust": 220, "centerDistance": 580, "weight": 3600, "controlType": "推拉软轴/电控/气控", "dimensions": "1056x1430x1670",
      "basePrice": 157000, "price": 157000, "discountRate": 0.06, "factoryPrice": 147580, "packagePrice": 147580, "marketPrice": 167704.55
    },
     {
      "model": "HCT1280/2", // Found on OCR P2
      "inputSpeedRange": [700, 1800], "ratios": [8.04, 8.46, 8.9, 9.38, 9.88, 10.43, 11.03, 11.98, 12.36, 13.13, 13.54, 13.96, 14.32, 15.21, 16.19, 17.27, 18.47], "transferCapacity": [0.93, 0.93, 0.93, 0.93, 0.93, 0.93, 0.93, 0.93, 0.93, 0.886, 0.859, 0.833, 0.812, 0.765, 0.718, 0.673, 0.63], "thrust": 240, "centerDistance": 680, "weight": 4600, "controlType": "推拉软轴/电控/气控", "dimensions": "1290x1520x1775",
       "basePrice": 165000, "price": 165000, "discountRate": 0.06, "factoryPrice": 155100, "packagePrice": 155100, "marketPrice": 176250
    },
    {
      "model": "HCD1400", // Found on OCR P2
      "inputSpeedRange": [600, 1900], "ratios": [3.5, 3.83, 4.04, 4.27, 4.32, 4.52, 4.8, 5.05, 5.5, 5.86], "transferCapacity": [1.081, 1.081, 1.081, 1.081, 1.081, 1.081, 1.081, 1.081, 1.03, 0.95], "thrust": 175, "centerDistance": 485, "weight": 2800, "controlType": "推拉软轴/电控/气控", "dimensions": "1260x1380x1360",
      "basePrice": 139000, "price": 139000, "discountRate": 0.06, "factoryPrice": 130660, "packagePrice": 130660, "marketPrice": 148477.27
    },
     {
      "model": "HCT1400", // Found on OCR P2
      "inputSpeedRange": [600, 1900], "ratios": [4.06, 4.51, 5.03, 5.52, 5.97, 6.48, 7.03, 7.5, 8.01, 8.47, 8.59, 8.98, 9.12, 9.55, 11.06], "transferCapacity": [1.081, 1.081, 1.081, 1.081, 1.081, 1.081, 1.081, 1.081, 1.081, 1, 0.96, 0.93, 0.9, 0.85, 0.737], "thrust": 220, "centerDistance": 550, "weight": 3800, "controlType": "推拉软轴/电控/气控", "dimensions": "1306x1380x1750",
       "basePrice": 162500, "price": 162500, "discountRate": 0.06, "factoryPrice": 152750, "packagePrice": 152750, "marketPrice": 173579.55
    },
     {
      "model": "HCT1400/2", // Found on OCR P2
      "inputSpeedRange": [600, 1900], "ratios": [10.47, 11.15, 11.5, 12.01, 12.43, 12.96, 13.41, 14.02, 14.53, 15.1, 15.53, 16, 16.52, 17.01, 17.6, 17.99, 18.41, 19.07], "transferCapacity": [1.081, 1.081, 1.081, 1.081, 0.996, 0.933, 0.922, 0.883, 0.853, 0.758, 0.737, 0.715, 0.693, 0.673, 0.65, 0.636, 0.621, 0.6], "thrust": 220, "centerDistance": 722, "weight": 5500, "controlType": "推拉软轴/电控/气控", "dimensions": "1279x1600x2100",
       "basePrice": 205000, "price": 205000, "discountRate": 0.06, "factoryPrice": 192700, "packagePrice": 192700, "marketPrice": 219000
    },
     {
      "model": "HCW1400", // Found on OCR P2
      "inputSpeedRange": [1000, 1800], "ratios": [15, 16, 17], "transferCapacity": [1.0], "thrust": 250, "centerDistance": 700, "weight": 6000, "controlType": "推拉软轴/电控/气控", "dimensions": "-",
       "basePrice": 204000, "price": 204000, "discountRate": 0.06, "factoryPrice": 191760, "packagePrice": 191760, "marketPrice": 217909.09
    },
    {
      "model": "HC1600", // Found on OCR P2
      "inputSpeedRange": [500, 1650], "ratios": [2.03, 2.54, 3, 3.5, 4], "transferCapacity": [1.26], "thrust": 170, "centerDistance": 415, "weight": 3000, "controlType": "推拉软轴/电控/气控", "dimensions": "-",
      "basePrice": 150000, "price": 150000, "discountRate": 0.06, "factoryPrice": 141000, "packagePrice": 141000, "marketPrice": 160227.27
    },
     {
      "model": "HCD1600", // Found on OCR P2
      "inputSpeedRange": [500, 1650], "ratios": [2.97, 3.5, 3.96, 4.48, 4.95, 5.25, 5.58, 5.94], "transferCapacity": [1.26, 1.26, 1.26, 1.26, 1.26, 1.26, 1.12, 1.05], "thrust": 200, "centerDistance": 520, "weight": 4000, "controlType": "推拉软轴/电控/气控", "dimensions": "1291x1620x1590",
       "basePrice": 165400, "price": 165400, "discountRate": 0.06, "factoryPrice": 155476, "packagePrice": 155476, "marketPrice": 176677.27
    },
    {
      "model": "HCT1600", // Found on OCR P2
      "inputSpeedRange": [500, 1650], "ratios": [5.55, 5.97, 6.59, 6.99, 7.44, 7.65, 7.92, 8.46, 9, 9.53, 10.17, 10.87, 11.65, 12.52], "transferCapacity": [1.26, 1.26, 1.26, 1.26, 1.26, 1.26, 1.26, 1.18, 1.122, 1.06, 0.998, 0.924, 0.867, 0.811], "thrust": 250, "centerDistance": 585, "weight": 5000, "controlType": "推拉软轴/电控/气控", "dimensions": "1246x1500x1750",
      "basePrice": 194800, "price": 194800, "discountRate": 0.06, "factoryPrice": 183112, "packagePrice": 183112, "marketPrice": 208081.82
    },
     {
      "model": "HCT1600/1", // Found on OCR P2
      "inputSpeedRange": [500, 1650], "ratios": [8.02, 8.41, 9.12, 9.58, 10.08, 10.6, 11.2, 12, 12.5, 13.43, 14.24, 15.12, 16.1, 16.9], "transferCapacity": [1.26, 1.26, 1.26, 1.26, 1.26, 1.26, 1.26, 1.26, 1.218, 1.134, 1.069, 1.007, 0.946, 0.78], "thrust": 270, "centerDistance": 680, "weight": 5500, "controlType": "推拉软轴/电控/气控", "dimensions": "1280x1704x2040",
       "basePrice": 223000, "price": 223000, "discountRate": 0.06, "factoryPrice": 209620, "packagePrice": 209620, "marketPrice": 238204.55
    },
     {
      "model": "HC2000", // Found on OCR P2
      "inputSpeedRange": [600, 1500], "ratios": [1.97, 2.28, 2.52, 3.13, 3.52, 3.91, 4.4, 4.5], "transferCapacity": [1.58, 1.5388, 1.5008, 1.4661, 1.4347, 1.4065, 1.3816, 1.36], "thrust": 190, "centerDistance": 450, "weight": 3700, "controlType": "推拉软轴/电控/气控", "dimensions": "-",
      "basePrice": 180000, "price": 180000, "discountRate": 0.06, "factoryPrice": 169200, "packagePrice": 169200, "marketPrice": 192272.73
    },
    {
      "model": "HCD2000", // Found on OCR P2
      "inputSpeedRange": [600, 1500], "ratios": [3, 3.58, 3.96, 4.45, 4.95, 5.26, 5.43, 5.75, 6.05], "transferCapacity": [1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.57, 1.48, 1.36], "thrust": 220, "centerDistance": 560, "weight": 4200, "controlType": "推拉软轴/电控/气控", "dimensions": "1600X1620X1645",
      "basePrice": 206000, "price": 206000, "discountRate": 0.06, "factoryPrice": 193640, "packagePrice": 193640, "marketPrice": 220045.45
    },
     {
      "model": "HCT2000", // Found on OCR P2
      "inputSpeedRange": [600, 1500], "ratios": [5.19, 5.49, 5.94, 6.58, 7.01, 7.48, 7.76, 8, 8.57, 8.71, 8.84, 9.05, 9.32, 9.43, 9.643, 10.04, 11], "transferCapacity": [1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.55, 1.55, 1.41, 1.38, 1.34, 1.3, 1.287, 1.18], "thrust": 270, "centerDistance": 625, "weight": 5600, "controlType": "推拉软轴/电控/气控", "dimensions": "1284x1600x1835",
       "basePrice": 238000, "price": 238000, "discountRate": 0.06, "factoryPrice": 223720, "packagePrice": 223720, "marketPrice": 254227.27
    },
    {
      "model": "HCT2000/1", // Found on OCR P2 (renamed from HCT2000-1)
      "inputSpeedRange": [600, 1500], "ratios": [6.96, 7.54, 7.94, 8.57, 9.06, 9.59, 10.16, 10.4, 11.11, 11.49, 12.08, 12.42, 12.97, 13.51, 13.92], "transferCapacity": [1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.48, 1.43, 1.4, 1.246, 1.18, 1.18, 1.18], "thrust": 340, "centerDistance": 690, "weight": 7000, "controlType": "推拉软轴/电控/气控", "dimensions": "1500x1760x1835",
      "basePrice": 280000, "price": 280000, "discountRate": 0.06, "factoryPrice": 263200, "packagePrice": 263200, "marketPrice": 299090.91
    },
     {
      "model": "HC2700", // Found on OCR P2
      "inputSpeedRange": [500, 1600], "ratios": [1.54, 2.03, 2.58, 3.09, 3.48, 3.95, 4.47], "transferCapacity": [2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 1.85], "thrust": 270, "centerDistance": 490, "weight": 4700, "controlType": "推拉软轴/电控/气控", "dimensions": "1613x1670x1650",
       "basePrice": 230000, "price": 230000, "discountRate": 0.06, "factoryPrice": 216200, "packagePrice": 216200, "marketPrice": 245681.82
    },
    {
      "model": "HCD2700", // Found on OCR P2
      "inputSpeedRange": [500, 1600], "ratios": [3.65, 4.04, 4.5, 5.05, 5.48, 6.11], "transferCapacity": [2.1, 2.1, 2.1, 2.1, 2.01, 1.8], "thrust": 280, "centerDistance": 630, "weight": 4930, "controlType": "推拉软轴/电控/气控", "dimensions": "1400x1780x1530",
      "basePrice": 280800, "price": 280800, "discountRate": 0.06, "factoryPrice": 263952, "packagePrice": 263952, "marketPrice": 299945.45
    },
     {
      "model": "HCT2700", // Found on OCR P2
      "inputSpeedRange": [500, 1600], "ratios": [4.92, 5.43, 6.16, 6.58, 7.03, 7.53, 8.01, 8.54, 9.12, 9.42, 10.05, 10.68, 11.54], "transferCapacity": [2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.1, 2.035, 1.906, 1.844, 1.73, 1.627, 1.5], "thrust": 340, "centerDistance": 680, "weight": 7200, "controlType": "推拉软轴/电控/气控", "dimensions": "1900x2000x1970",
       "basePrice": 340000, "price": 340000, "discountRate": 0.06, "factoryPrice": 319600, "packagePrice": 319600, "marketPrice": 363181.82
    },
     {
      "model": "HCT2700/1", // Found on OCR P2
      "inputSpeedRange": [500, 1600], "ratios": [7.91, 8.44, 8.84, 9.47, 9.89, 10.55, 11.26, 11.64, 12.41], "transferCapacity": [2.1, 2.1, 2.1, 2.1, 2.1, 2.035, 1.906, 1.844, 1.73], "thrust": 450, "centerDistance": 800, "weight": 9000, "controlType": "推拉软轴/电控/气控", "dimensions": "1900x2250x1950",
       "basePrice": 390000, "price": 390000, "discountRate": 0.06, "factoryPrice": 366600, "packagePrice": 366600, "marketPrice": 416590.91
    },
    // ... Add other HC models from original file if they were missed and not in OCR ...
    {
        "model": "HCT650/2", // Not in OCR, keeping old data
        "inputSpeedRange": [1000, 2100], "ratios": [9.51, 10.06, 10.45, 11.03, 11.46, 11.98, 12.52, 13.09, 13.64, 14.1, 14.48, 15.01, 15.55, 15.98, 16.42, 16.97, 17.44, 18.06], "transferCapacity": [0.49, 0.49, 0.483, 0.483, 0.452, 0.452, 0.445, 0.445, 0.414, 0.414, 0.402, 0.389, 0.366, 0.329, 0.32, 0.309, 0.301, 0.29], "thrust": 160, "centerDistance": 550, "weight": 2230, "controlType": "推拉软轴/电控/气控", "dimensions": "966x1224x1515",
        "basePrice": 0, "price": 0, "discountRate": 0.12, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0 // Assuming 12% discount
    },
    {
        "model": "HCT800/2A", // Not in OCR, keeping old data
        "inputSpeedRange": [600, 1900], "ratios": [13.12, 13.81, 14.55, 15.33, 16.16, 17.04, 17.99, 20.27, 22.18], "transferCapacity": [0.6816, 0.6474, 0.6147, 0.5834, 0.5534, 0.525, 0.497, 0.441, 0.435], "thrust": 220, "centerDistance": 666, "weight": 4000, "controlType": "推拉软轴/电控", "dimensions": "1190x1490x2040",
        "basePrice": 0, "price": 0, "discountRate": 0.08, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0 // Assuming 8% discount
    },
    {
        "model": "HC1201", // Not in OCR, keeping old data
        "inputSpeedRange": [700, 1500], "ratios": [2.5, 3, 3.43, 3.96, 4.17, 4.39, 4.9, 5.47], "transferCapacity": [0.93, 0.93, 0.93, 0.93, 0.93, 0.93, 0.83, 0.73], "thrust": 140, "centerDistance": 450, "weight": 1850, "controlType": "推拉软轴/电控/气控", "dimensions": "963x1300x1290",
        "basePrice": 0, "price": 0, "discountRate": 0.10, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0 // Assuming 10% discount
    },
    {
        "model": "HCT1400/5", // Not in OCR, keeping old data
        "inputSpeedRange": [700, 1800], "ratios": [8.98, 9.47, 10, 10.58, 11.2, 11.88, 12.42, 12.96, 13.45, 13.89, 14.36, 14.93], "transferCapacity": [1.035, 1.035, 1.035, 1.035, 1.035, 0.93, 0.93, 0.9, 0.86, 0.833, 0.812, 0.765], "thrust": 190, "centerDistance": 680, "weight": 3850, "controlType": "推拉软轴/电控/气控", "dimensions": "1220x1400x1650",
        "basePrice": 0, "price": 0, "discountRate": 0.06, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0 // Assuming 6% discount
    },
    {
        "model": "HCD1500", // Not in OCR, keeping old data
        "inputSpeedRange": [600, 1900], "ratios": [3.5, 3.83, 4.04, 4.27, 4.32, 4.52], "transferCapacity": [1.2], "thrust": 175, "centerDistance": 485, "weight": 2800, "controlType": "推拉软轴/电控/气控", "dimensions": "1260X1380X1360",
        "basePrice": 0, "price": 0, "discountRate": 0.06, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0 // Assuming 6% discount
    }
  ],
  "gwGearboxes": [ // Update GWC based on OCR Pages 2, 3, 6, 7
    {
      "model": "GWC28.30", // Found on OCR P2/6
      "inputSpeedRange": [400, 2000], "ratios": [2.06, 2.51, 3.08, 3.54, 4.05, 4.54, 5.09, 5.59, 6.14], "transferCapacity": [0.865, 0.711, 0.578, 0.504, 0.44, 0.393, 0.35, 0.319, 0.29], "thrust": 80, "centerDistance": 280, "weight": 1230, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 72500, "price": 72500, "discountRate": 0.10, "factoryPrice": 65250, "packagePrice": 65250, "marketPrice": 74147.73, "priceWarning": false
    },
    {
      "model": "GWC30.32", // Found on OCR P2/6
      "inputSpeedRange": [400, 2000], "ratios": [2.03, 2.55, 3.04, 3.52, 4, 4.55, 5.05, 5.64, 6.05], "transferCapacity": [1.122, 0.894, 0.75, 0.647, 0.57, 0.501, 0.451, 0.404, 0.376], "thrust": 100, "centerDistance": 300, "weight": 1460, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 90800, "price": 90800, "discountRate": 0.10, "factoryPrice": 81720, "packagePrice": 81720, "marketPrice": 92863.64, "priceWarning": false
    },
    {
      "model": "GWC32.35", // Found on OCR P2/6
      "inputSpeedRange": [400, 2000], "ratios": [2.06, 2.54, 3.02, 3.58, 4.05, 4.59, 5.09, 5.57, 6.08], "transferCapacity": [1.4175, 1.1481, 0.9659, 0.816, 0.72, 0.6353, 0.5733, 0.5236, 0.48], "thrust": 120, "centerDistance": 320, "weight": 3200, "controlType": "气控/电控", "dimensions": "1238*920*1315", // Added Centre Dist and Dims
      "basePrice": 103800, "price": 103800, "discountRate": 0.10, "factoryPrice": 93420, "packagePrice": 93420, "marketPrice": 106159.09, "priceWarning": false
    },
    {
      "model": "GWC36.39", // Found on OCR P2/6
      "inputSpeedRange": [400, 1900], "ratios": [1.97, 2.45, 2.98, 3.47, 3.95, 4.4, 5.01, 5.47, 5.97], "transferCapacity": [1.92, 1.546, 1.272, 1.09, 0.96, 0.862, 0.756, 0.693, 0.634], "thrust": 140, "centerDistance": 360, "weight": 2080, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 123800, "price": 123800, "discountRate": 0.10, "factoryPrice": 111420, "packagePrice": 111420, "marketPrice": 126613.64, "priceWarning": false
    },
    {
      "model": "GWC39.41", // Found on OCR P3/6
      "inputSpeedRange": [400, 1700], "ratios": [1.98, 2.47, 3.05, 3.48, 4.05, 4.48, 5, 5.51, 5.99], "transferCapacity": [2.585, 2.068, 1.672, 1.467, 1.26, 1.138, 1.022, 0.927, 0.852], "thrust": 175, "centerDistance": 390, "weight": 3980, "controlType": "气控/电控", "dimensions": "1454*1010*1425",
      "basePrice": 153800, "price": 153800, "discountRate": 0.10, "factoryPrice": 138420, "packagePrice": 138420, "marketPrice": 157295.45, "priceWarning": false
    },
    {
      "model": "GWC42.45", // Found on OCR P3/6
      "inputSpeedRange": [400, 1600], "ratios": [2, 2.55, 3.02, 3.58, 4, 4.47, 5, 5.6, 5.93], "transferCapacity": [3.28, 2.577, 2.169, 1.832, 1.64, 1.467, 1.312, 1.171, 1.106], "thrust": 220, "centerDistance": 420, "weight": 4700, "controlType": "气控/电控", "dimensions": "1486*1181*1650",
      "basePrice": 185800, "price": 185800, "discountRate": 0.10, "factoryPrice": 167220, "packagePrice": 167220, "marketPrice": 190022.73, "priceWarning": false
    },
     {
      "model": "GWC45.49", // Found on OCR P3/6
      "inputSpeedRange": [400, 1600], "ratios": [1.97, 2.47, 2.89, 3.47, 3.95, 4.37, 4.85, 5.5, 5.98], "transferCapacity": [4.24, 3.392, 2.89, 2.414, 2.12, 1.913, 1.725, 1.52, 1.398], "thrust": 270, "centerDistance": 450, "weight": 5500, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 275800, "price": 275800, "discountRate": 0.10, "factoryPrice": 248220, "packagePrice": 248220, "marketPrice": 282068.18, "priceWarning": false
    },
    {
      "model": "GWC45.52", // Found on OCR P3/6
      "inputSpeedRange": [400, 1400], "ratios": [1.97, 2.52, 2.99, 3.47, 4.01, 4.64, 4.98, 5.51, 6.04], "transferCapacity": [4.648, 3.62, 3.055, 2.64, 2.279, 1.97, 1.84, 1.66, 1.51], "thrust": 270, "centerDistance": 450, "weight": 6500, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 320000, "price": 320000, "discountRate": 0.10, "factoryPrice": 288000, "packagePrice": 288000, "marketPrice": 327272.73, "priceWarning": false
    },
    {
      "model": "GWC49.54", // Found on OCR P3/6
      "inputSpeedRange": [400, 1400], "ratios": [1.94, 2.46, 2.92, 3.45, 3.95, 4.53, 4.91, 5.48, 6], "transferCapacity": [5.5, 4.54, 3.827, 3.24, 2.825, 2.462, 2.273, 2.036, 1.861], "thrust": 290, "centerDistance": 490, "weight": 7900, "controlType": "气控/电控", "dimensions": "1783*1340*1925",
      "basePrice": 402600, "price": 402600, "discountRate": 0.10, "factoryPrice": 362340, "packagePrice": 362340, "marketPrice": 411750, "priceWarning": false
    },
    {
      "model": "GWC49.59", // Found on OCR P3/6
      "inputSpeedRange": [400, 1200], "ratios": [2.03, 2.49, 3.04, 3.49, 4, 4.48, 5.01, 5.51, 6.01], "transferCapacity": [5.55, 5.06, 4.15, 3.62, 3.16, 2.82, 2.52, 2.29, 2.1], "thrust": 290, "centerDistance": 490, "weight": 8500, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 460000, "price": 460000, "discountRate": 0.10, "factoryPrice": 414000, "packagePrice": 414000, "marketPrice": 470454.55, "priceWarning": false
    },
     {
      "model": "GWC49.59A", // Found on OCR P3/6 GWC49.59A(带PTO)
      "inputSpeedRange": [400, 1200], "ratios": [2.03, 2.49, 3.04, 3.49, 4, 4.48, 5.01, 5.51, 6.01], "transferCapacity": [5.55, 5.06, 4.15, 3.62, 3.16, 2.82, 2.52, 2.29, 2.1], "thrust": 290, "centerDistance": 490, "weight": 8700, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 495000, "price": 495000, "discountRate": 0.10, "factoryPrice": 445500, "packagePrice": 445500, "marketPrice": 506250, "priceWarning": false
    },
    {
      "model": "GWC52.59", // Found on OCR P3/6
      "inputSpeedRange": [400, 1200], "ratios": [1.93, 2.48, 2.96, 3.53, 3.95, 4.43, 4.97, 5.4, 5.93], "transferCapacity": [7.438, 5.797, 4.853, 4.081, 3.64, 3.246, 2.893, 2.663, 2.426], "thrust": 300, "centerDistance": 520, "weight": 11000, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 545000, "price": 545000, "discountRate": 0.10, "factoryPrice": 490500, "packagePrice": 490500, "marketPrice": 557386.36, "priceWarning": false
    },
    {
        "model": "GWC52.59A", // Found on OCR P3/6 (滑动轴承)
        "inputSpeedRange": [400, 1200], "ratios": [1.93, 2.48, 2.96, 3.53, 3.95, 4.43, 4.97, 5.4, 5.93], "transferCapacity": [7.438, 5.797, 4.853, 4.081, 3.64, 3.246, 2.893, 2.663, 2.426], "thrust": 300, "centerDistance": 520, "weight": 11200, "controlType": "气控/电控", "dimensions": "-",
        "basePrice": 575000, "price": 575000, "discountRate": 0.10, "factoryPrice": 517500, "packagePrice": 517500, "marketPrice": 588068.18, "priceWarning": false
    },
    {
      "model": "GWC52.62", // Found on OCR P3/6
      "inputSpeedRange": [400, 1200], "ratios": [2.02, 2.46, 3.02, 3.45, 4.06, 4.52, 5.04, 5.46, 5.96, 6.49, 6.94], "transferCapacity": [7.756, 6.353, 5.18, 4.534, 3.852, 3.458, 3.102, 2.867, 2.631, 2.41, 2.254], "thrust": 300, "centerDistance": 620, "weight": 10700, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 575000, "price": 575000, "discountRate": 0.10, "factoryPrice": 517500, "packagePrice": 517500, "marketPrice": 588068.18, "priceWarning": false
    },
     {
      "model": "GWC60.66", // Found on OCR P3/6
      "inputSpeedRange": [400, 1200], "ratios": [2.01, 2.5, 3.07, 3.57, 3.95, 4.49, 5.04, 5.51, 6.04, 6.5, 6.94], "transferCapacity": [9.913, 7.982, 6.492, 5.581, 4.923, 4.448, 3.927, 3.622, 3.261, 3.06, 3], "thrust": 450, "centerDistance": 600, "weight": 14500, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 800000, "price": 800000, "discountRate": 0.10, "factoryPrice": 720000, "packagePrice": 720000, "marketPrice": 818181.82, "priceWarning": false
    },
     {
        "model": "GWC60.66A", // Found on OCR P3/6 (滑动轴承)
        "inputSpeedRange": [400, 1200], "ratios": [2.01, 2.5, 3.07, 3.57, 3.95, 4.49, 5.04, 5.51, 6.04, 6.5, 6.94], "transferCapacity": [9.913, 7.982, 6.492, 5.581, 4.923, 4.448, 3.927, 3.622, 3.261, 3.06, 3], "thrust": 450, "centerDistance": 600, "weight": 14700, "controlType": "气控/电控", "dimensions": "-",
        "basePrice": 830000, "price": 830000, "discountRate": 0.10, "factoryPrice": 747000, "packagePrice": 747000, "marketPrice": 848863.64, "priceWarning": false
    },
    {
      "model": "GWC60.74", // Found on OCR P3/6
      "inputSpeedRange": [400, 1200], "ratios": [1.99, 2.53, 3.06, 3.51, 4.02, 4.5, 5.04, 5.51, 6.04, 6.5, 6.94], "transferCapacity": [9.913, 8.3641, 7.4347, 6.8628, 6.3726, 5.05, 4.5128, 4.1224, 3.7627, 3.4962, 3.375], "thrust": 540, "centerDistance": 740, "weight": 18000, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 920000, "price": 920000, "discountRate": 0.10, "factoryPrice": 828000, "packagePrice": 828000, "marketPrice": 940909.09, "priceWarning": false
    },
     {
        "model": "GWC60.74B", // Found on OCR P3/7 (带 PTO)
        "inputSpeedRange": [400, 1200], "ratios": [1.99, 2.53, 3.06, 3.51, 4.02, 4.5, 5.04, 5.51, 6.04, 6.5, 6.94], "transferCapacity": [9.913, 8.3641, 7.4347, 6.8628, 6.3726, 5.05, 4.5128, 4.1224, 3.7627, 3.4962, 3.375], "thrust": 540, "centerDistance": 740, "weight": 18300, "controlType": "气控/电控", "dimensions": "-",
        "basePrice": 1010000, "price": 1010000, "discountRate": 0.10, "factoryPrice": 909000, "packagePrice": 909000, "marketPrice": 1032954.55, "priceWarning": false
    },
    {
      "model": "GWC63.71", // Found on OCR P3/7
      "inputSpeedRange": [300, 1200], "ratios": [2.01, 2.51, 3.03, 3.45, 4.11, 4.55, 5.04, 5.47, 5.95, 6.48, 6.96, 7.48], "transferCapacity": [12.23, 9.8, 8.117, 7.135, 6, 5.411, 4.888, 4.5, 4.137, 3.8, 3.541, 3.294], "thrust": 710, "centerDistance": 630, "weight": 17500, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 950000, "price": 950000, "discountRate": 0.10, "factoryPrice": 855000, "packagePrice": 855000, "marketPrice": 971590.91, "priceWarning": false
    },
     {
        "model": "GWC63.71 (带 PTO)", // Found on OCR P3/7
        "inputSpeedRange": [300, 1200], "ratios": [2.01, 2.51, 3.03, 3.45, 4.11, 4.55, 5.04, 5.47, 5.95, 6.48, 6.96, 7.48], "transferCapacity": [12.23, 9.8, 8.117, 7.135, 6, 5.411, 4.888, 4.5, 4.137, 3.8, 3.541, 3.294], "thrust": 710, "centerDistance": 630, "weight": 17800, "controlType": "气控/电控", "dimensions": "-",
        "basePrice": 1030000, "price": 1030000, "discountRate": 0.10, "factoryPrice": 927000, "packagePrice": 927000, "marketPrice": 1053409.09, "priceWarning": false
    },
    {
      "model": "GWC66.75", // Found on OCR P3/7
      "inputSpeedRange": [300, 950], "ratios": [2.05, 2.55, 2.99, 3.48, 3.95, 4.49, 4.97, 5.51, 6.12, 6.59, 6.96], "transferCapacity": [13.8667, 11.1484, 9.5294, 8.173, 7.2, 6.3429, 5.7273, 5.1652, 4.315, 4.65, 4.086], "thrust": 730, "centerDistance": 660, "weight": 22000, "controlType": "气控/电控", "dimensions": "2762*2230*2410", // Added Centre Dist and Dims
      "basePrice": 1050000, "price": 1050000, "discountRate": 0.10, "factoryPrice": 945000, "packagePrice": 945000, "marketPrice": 1073863.64, "priceWarning": false
    },
    {
      "model": "GWC70.76", // Found on OCR P3/7
      "inputSpeedRange": [300, 950], "ratios": [2.05, 2.53, 3.09, 3.58, 3.95, 4.57, 5.05, 5.58, 6.17], // Ratios from GWC70.85 as placeholder
      "transferCapacity": [15.643, 12.673, 10.364, 8.943, 8.111, 7.005, 6.348, 5.745, 5.191], // Capacity from GWC70.85 as placeholder
      "thrust": 750, "centerDistance": 700, "weight": 20000, // Updated weight, using 70.85 thrust/center
      "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 1100000, "price": 1100000, "discountRate": 0.10, "factoryPrice": 990000, "packagePrice": 990000, "marketPrice": 1125000, "priceWarning": false
    },
     {
        "model": "GWC70.76C (带 PTO)", // Found on OCR P3/7
        "inputSpeedRange": [300, 950], "ratios": [2.05, 2.53, 3.09, 3.58, 3.95, 4.57], // Ratios from GWC70.85 (partial)
        "transferCapacity": [15.643, 12.673, 10.364, 8.943, 8.111, 7.005], // Capacity from GWC70.85 (partial)
        "thrust": 750, "centerDistance": 700, "weight": 20300, "controlType": "气控/电控", "dimensions": "-",
        "basePrice": 1150000, "price": 1150000, "discountRate": 0.10, "factoryPrice": 1035000, "packagePrice": 1035000, "marketPrice": 1176136.36, "priceWarning": false
    },
    {
      "model": "GWC70.85", // Found on OCR P3/7
      "inputSpeedRange": [300, 950], "ratios": [2.05, 2.53, 3.09, 3.58, 3.95, 4.57, 5.05, 5.58, 6.17], "transferCapacity": [15.643, 12.673, 10.364, 8.943, 8.111, 7.005, 6.348, 5.745, 5.191], "thrust": 750, "centerDistance": 700, "weight": 22500, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 1620000, "price": 1620000, "discountRate": 0.10, "factoryPrice": 1458000, "packagePrice": 1458000, "marketPrice": 1656818.18, "priceWarning": false
    },
     {
        "model": "GWC70.85A (带 PTO)", // Found on OCR P3/7
        "inputSpeedRange": [300, 950], "ratios": [2.05, 2.53, 3.09, 3.58, 3.95, 4.57, 5.05, 5.58, 6.17], "transferCapacity": [15.643, 12.673, 10.364, 8.943, 8.111, 7.005, 6.348, 5.745, 5.191], "thrust": 750, "centerDistance": 700, "weight": 22800, "controlType": "气控/电控", "dimensions": "-",
        "basePrice": 1670000, "price": 1670000, "discountRate": 0.10, "factoryPrice": 1503000, "packagePrice": 1503000, "marketPrice": 1707954.55, "priceWarning": false
    },
     {
      "model": "GWC75.90", // Found on OCR P3/7
      "inputSpeedRange": [300, 950], "ratios": [2.05, 2.53, 3.09, 3.58, 3.95, 4.57, 5.05, 5.58, 6.17], "transferCapacity": [15.643, 12.673, 10.364, 8.943, 8.111, 7.005, 6.348, 5.745, 5.191], // Copied GWC70.85 data
      "thrust": 750, "centerDistance": 700, "weight": 22500, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 1800000, "price": 1800000, "discountRate": 0.10, "factoryPrice": 1620000, "packagePrice": 1620000, "marketPrice": 1840909.09, "priceWarning": false
    },
     {
        "model": "GWC75.90 (带 PTO)", // Found on OCR P3/7
        "inputSpeedRange": [300, 950], "ratios": [2.05, 2.53, 3.09, 3.58, 3.95, 4.57, 5.05, 5.58, 6.17], "transferCapacity": [15.643, 12.673, 10.364, 8.943, 8.111, 7.005, 6.348, 5.745, 5.191], "thrust": 750, "centerDistance": 700, "weight": 22800, "controlType": "气控/电控", "dimensions": "-",
        "basePrice": 1850000, "price": 1850000, "discountRate": 0.10, "factoryPrice": 1665000, "packagePrice": 1665000, "marketPrice": 1892045.45, "priceWarning": false
    },
    {
      "model": "GWC78.88", // Found on OCR P3/7
      "inputSpeedRange": [300, 950], "ratios": [2.05, 2.53, 3.09, 3.58, 3.95, 4.57, 5.05, 5.58, 6.17], "transferCapacity": [15.643, 12.673, 10.364, 8.943, 8.111, 7.005, 6.348, 5.745, 5.191], // Copied GWC70.85 data
      "thrust": 750, "centerDistance": 700, "weight": 22500, "controlType": "气控/电控", "dimensions": "-",
      "basePrice": 1670000, "price": 1670000, "discountRate": 0.10, "factoryPrice": 1503000, "packagePrice": 1503000, "marketPrice": 1707954.55, "priceWarning": false
    },
     {
        "model": "GWC78.88A (带 PTO)", // Found on OCR P3/7
        "inputSpeedRange": [300, 950], "ratios": [2.05, 2.53, 3.09, 3.58, 3.95, 4.57, 5.05, 5.58, 6.17], "transferCapacity": [15.643, 12.673, 10.364, 8.943, 8.111, 7.005, 6.348, 5.745, 5.191], "thrust": 750, "centerDistance": 700, "weight": 22800, "controlType": "气控/电控", "dimensions": "-",
        "basePrice": 1740000, "price": 1740000, "discountRate": 0.10, "factoryPrice": 1566000, "packagePrice": 1566000, "marketPrice": 1779545.45, "priceWarning": false
    },
    // --- SGW Models (Referencing GWC prices with 95% rule from OCR P7 footnote 2) ---
    {
      "model": "SGW39.41", // Found on OCR P7
      "inputSpeedRange": [400, 1700], "ratios": [1.98, 2.47, 3.05, 3.48, 4.05, 4.48, 5, 5.51, 5.99], "transferCapacity": [2.585, 2.068, 1.672, 1.467, 1.26, 1.138, 1.022, 0.927, 0.852], "thrust": 175, "centerDistance": 390, "weight": 3980, "controlType": "气控/电控", "dimensions": "1454*1010*1425",
      "basePrice": 146110, // 153800 * 0.95
      "price": 146110,
      "discountRate": 0.10, // Assuming same discount as GWC
      "factoryPrice": 131500, // 138420 * 0.95 (approx) or 146110 * 0.9
      "packagePrice": 131500,
      "marketPrice": 149431.82 // Recalculated: 131500 / (1 - 0.12)
    },
    {
      "model": "SGW42.45", // Found on OCR P7
      "inputSpeedRange": [400, 1600], "ratios": [2, 2.55, 3.02, 3.58, 4, 4.47, 5, 5.6, 5.93], "transferCapacity": [3.28, 2.577, 2.169, 1.832, 1.64, 1.467, 1.312, 1.171, 1.106], "thrust": 220, "centerDistance": 420, "weight": 4700, "controlType": "气控/电控", "dimensions": "1486*1181*1650",
      "basePrice": 176510, // 185800 * 0.95
      "price": 176510,
      "discountRate": 0.10, // Assuming same discount as GWC
      "factoryPrice": 158859, // 167220 * 0.95
      "packagePrice": 158859,
      "marketPrice": 180521.59 // Recalculated
    },
    {
      "model": "SGW49.54", // Found on OCR P7
      "inputSpeedRange": [400, 1400], "ratios": [1.94, 2.46, 2.92, 3.45, 3.95, 4.53, 4.91, 5.48, 6], "transferCapacity": [5.5, 4.54, 3.827, 3.24, 2.825, 2.462, 2.273, 2.036, 1.861], "thrust": 290, "centerDistance": 490, "weight": 7900, "controlType": "气控/电控", "dimensions": "1783*1340*1925",
      "basePrice": 382470, // 402600 * 0.95
      "price": 382470,
      "discountRate": 0.10, // Assuming same discount as GWC
      "factoryPrice": 344223, // 362340 * 0.95
      "packagePrice": 344223,
      "marketPrice": 391162.5 // Recalculated
    },
    // --- GWC85.100, GWS28.30, 2GWH not found in price lists ---
     {
      "model": "GWC85.100", // Not in OCR price list
      "inputSpeedRange": [200, 1425], "ratios": [1.98, 2.55, 2.98, 3.48, 3.95, 4.48, 4.97, 5.51, 5.99, 6.45, 7.05], "transferCapacity": [35], "thrust": 1400, "weight": 56500, "controlType": "气控/电控", "centerDistance": 850, // Corrected weight, added center distance
      "basePrice": 1000000, "price": 1000000, "discountRate": 0.1, "factoryPrice": 900000, "packagePrice": 900000, "marketPrice": 1022727.27, "dimensions": "-", "priceWarning": false // Keep original prices
    },
    {
      "model": "GWS28.30", // Not in OCR price list, use 95% rule applied to GWC28.30
      "inputSpeedRange": [400, 1800], "ratios": [2, 2.56, 3, 3.57, 4.05], "transferCapacity": [0.44], "thrust": 80, "weight": 1230, "controlType": "气控/电控", "centerDistance": 280,
      "basePrice": 68875, // 72500 * 0.95
      "price": 68875,
      "discountRate": 0.10, // Assuming same discount as GWC
      "factoryPrice": 61987.5, // 65250 * 0.95
      "packagePrice": 61987.5,
      "marketPrice": 70440.34, // Recalculated
      "dimensions": "-", "priceWarning": false
    },
     {
      "model": "2GWH1060", // Not in OCR price list
      "inputSpeedRange": [400, 2000], "ratios": [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6], "transferCapacityPerEngine": 1.12, "thrust": 175, "standardCenterDistance": 1460, "controlType": "双机并车", "transferCapacity": [1.12], "weight": 14500, // Added weight estimate
      "basePrice": 850000, "price": 850000, "discountRate": 0.1, "factoryPrice": 765000, "marketPrice": 869318.18, "dimensions": "-", "packagePrice": 765000 // Keep original prices
    },
    {
      "model": "2GWH4100", // Not in OCR price list
      "inputSpeedRange": [400, 1600], "ratios": [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6], "transferCapacityPerEngine": 4.24, "thrust": 450, "standardCenterDistance": 2300, "controlType": "双机并车", "transferCapacity": [4.24], "weight": 22500, // Added weight estimate
      "basePrice": 1250000, "price": 1250000, "discountRate": 0.1, "factoryPrice": 1125000, "marketPrice": 1278409.09, "dimensions": "-", "packagePrice": 1125000 // Keep original prices
    },
    {
      "model": "2GWH7050", // Not in OCR price list
      "inputSpeedRange": [400, 1200], "ratios": [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6], "transferCapacityPerEngine": 7.43, "thrust": 750, "standardCenterDistance": 2700, "controlType": "双机并车", "transferCapacity": [7.43], "weight": 25000, // Added weight estimate
      "basePrice": 1800000, "price": 1800000, "discountRate": 0.1, "factoryPrice": 1620000, "marketPrice": 1840909.09, "dimensions": "-", "packagePrice": 1620000 // Keep original prices
    },
    { // GCSE20 already present in gcGearboxes, keeping that entry
      "model": "GCSE20",
      "weight": 1800, "basePrice": 20000, "price": 20000, "inputSpeedRange": [400, 1400], "ratios": [6.5, 8], "transferCapacity": [2.12], "thrust": 350, "centerDistance": 875, "controlType": "特殊变距", "discountRate": 0.1, "factoryPrice": 18000, "dimensions": "-", "marketPrice": 20454.55, "packagePrice": 18000, "priceWarning": false
    }
    // Note: GCS models are in gcGearboxes, not gwGearboxes. No price updates from OCR.
    // Note: GWC models listed in gcGearboxes in the original JSON were removed as they belong here in gwGearboxes and are updated.
  ],
  // ... (Keep standbyPumps, hcmGearboxes, dtGearboxes, hcqGearboxes updated from previous steps) ...
   "standbyPumps": [ // Kept existing data as OCR did not cover these
    { "model": "2CY7.5/2.5D", "flow": 7.5, "pressure": 2.5, "motorPower": 3, "weight": 45, "price": 5800, "basePrice": 5800, "discountRate": 0.1, "factoryPrice": 5220, "packagePrice": 5220, "marketPrice": 5931.82 },
    { "model": "2CY14.2/2.5D", "flow": 14.2, "pressure": 2.5, "motorPower": 5.5, "weight": 65, "price": 8500, "basePrice": 8500, "discountRate": 0.1, "factoryPrice": 7650, "packagePrice": 7650, "marketPrice": 8693.18 },
    { "model": "2CY19.2/2.5D", "flow": 19.2, "pressure": 2.5, "motorPower": 7.5, "weight": 80, "price": 10800, "basePrice": 10800, "discountRate": 0.1, "factoryPrice": 9720, "packagePrice": 9720, "marketPrice": 11045.45 },
    { "model": "2CY24.8/2.5D", "flow": 24.8, "pressure": 2.5, "motorPower": 11, "weight": 110, "price": 14500, "basePrice": 14500, "discountRate": 0.1, "factoryPrice": 13050, "packagePrice": 13050, "marketPrice": 14829.55 },
    { "model": "2CY34.5/2.5D", "flow": 34.5, "pressure": 2.5, "motorPower": 15, "weight": 150, "price": 19500, "basePrice": 19500, "discountRate": 0.1, "factoryPrice": 17550, "packagePrice": 17550, "marketPrice": 19943.18 },
    { "model": "2CY48.2/2.5D", "flow": 48.2, "pressure": 2.5, "motorPower": 22, "weight": 215, "price": 26800, "basePrice": 26800, "discountRate": 0.1, "factoryPrice": 24120, "packagePrice": 24120, "marketPrice": 27409.09 },
    { "model": "2CY10/3.0", "flow": 10, "pressure": 3, "weight": 75, "price": 10000, "basePrice": 10000, "discountRate": 0.1, "factoryPrice": 9000, "packagePrice": 9000, "marketPrice": 10227.27 },
    { "model": "2CY16/4.0", "flow": 16, "pressure": 4, "weight": 120, "price": 15000, "basePrice": 15000, "discountRate": 0.1, "factoryPrice": 13500, "packagePrice": 13500, "marketPrice": 15340.91, "applicationRange": "大型船舶", "controlType": "机械驱动" },
    { "model": "2CY25/6.3", "flow": 25, "pressure": 6.3, "weight": 210, "price": 22000, "basePrice": 22000, "discountRate": 0.1, "factoryPrice": 19800, "packagePrice": 19800, "marketPrice": 22500, "applicationRange": "大型工程船", "controlType": "电动/机械驱动" }
 ],
 "hcmGearboxes": [ // Updated based on OCR Pages 8/9 & previous response
    { "model": "HCM70", "inputSpeedRange": [1500, 4000], "ratios": [1, 1.3, 2, 2.48, 2.78, 2.9, 3], "transferCapacity": [0.0887, 0.0591, 0.0365, 0.0294, 0.0275, 0.0265, 0.0258], "thrust": 14, "centerDistance": 127, "weight": 46, "controlType": "电控", "dimensions": "-", "price": 56000, "basePrice": 56000, "factoryPrice": 47040, "discountRate": 0.16, "packagePrice": 47040, "marketPrice": 53454.55 },
    { "model": "HCM160", "inputSpeedRange": [1500, 3600], "ratios": [1, 1.57, 1.75, 1.96, 2.5, 2.48, 2.78, 2.9, 3], "transferCapacity": [0.1783, 0.1136, 0.1021, 0.0914, 0.0718, 0.0726, 0.0653, 0.0625, 0.0603], "thrust": 25, "centerDistance": 155, "weight": 98, "controlType": "电控", "dimensions": "-", "price": 75000, "basePrice": 75000, "factoryPrice": 63000, "discountRate": 0.16, "packagePrice": 63000, "marketPrice": 71590.91 },
    { "model": "HCM250", "inputSpeedRange": [1500, 3000], "ratios": [1.22, 1.97, 2.92], "transferCapacity": [0.2192, 0.1423, 0.1084], "thrust": 30, "centerDistance": 180, "weight": 180, "controlType": "电控", "dimensions": "-", "price": 89000, "basePrice": 89000, "factoryPrice": 74760, "discountRate": 0.16, "packagePrice": 74760, "marketPrice": 84954.55 },
    { "model": "HCM435", "inputSpeedRange": [1500, 3000], "ratios": [0.85, 0.93, 1, 1.11, 1.23, 1.53, 1.78, 2.03, 2.21, 2.6, 2.96], "transferCapacity": [0.3196, 0.2917, 0.2714, 0.2449, 0.221, 0.178, 0.1529, 0.1338, 0.1232, 0.1048, 0.0924], "thrust": 27.5, "centerDistance": 175, "weight": 160, "controlType": "电控", "dimensions": "-", "price": 118000, "basePrice": 118000, "factoryPrice": 99120, "discountRate": 0.16, "packagePrice": 99120, "marketPrice": 112636.36 },
    { "model": "HCM600", "inputSpeedRange": [1500, 3000], "ratios": [1.11, 1.26, 1.74, 2, 2.59], "transferCapacity": [0.4476, 0.3997, 0.3107, 0.2694, 0.2141], "thrust": 40, "centerDistance": 200, "weight": 248, "controlType": "电控", "dimensions": "-", "price": 138000, "basePrice": 138000, "factoryPrice": 115920, "discountRate": 0.16, "packagePrice": 115920, "marketPrice": 131727.27 },
    { "model": "HCM1250", "inputSpeedRange": [1500, 2500], "ratios": [1.53, 2.03, 2.5, 2.96], "transferCapacity": [0.9435, 0.9157, 0.7466, 0.6319], "thrust": 110, "centerDistance": 340, "weight": 950, "controlType": "电控", "dimensions": "-", "price": 260000, "basePrice": 260000, "factoryPrice": 218400, "discountRate": 0.16, "packagePrice": 218400, "marketPrice": 248181.82 },
    { "model": "HCM1600", "inputSpeedRange": [1000, 2100], "ratios": [1.55, 1.83, 2.04, 2.23, 2.57, 2.77, 2.91, 3.17], "transferCapacity": [1.4031, 1.2984, 1.1518, 1.0584, 0.9183, 0.8535, 0.8053, 0.7386], "thrust": 135, "centerDistance": 340, "weight": 1230, "controlType": "电控", "dimensions": "-", "price": 320000, "basePrice": 320000, "factoryPrice": 268800, "discountRate": 0.16, "packagePrice": 268800, "marketPrice": 305454.55 },
    { "model": "HCM1400", "inputSpeedRange": [1000, 2600], "ratios": [1.5, 2.0, 2.5, 3.0], "transferCapacity": [1.2], "thrust": 120, "centerDistance": 300, "weight": 1100, "controlType": "电控", "dimensions": "-", "price": 412000, "basePrice": 412000, "marketPrice": 412000, "discountRate": 0, "factoryPrice": 412000, "packagePrice": 412000 },
    { "model": "HCM120", "inputSpeedRange": [1500, 4500], "ratios": [1, 1.96, 2.48, 3], "transferCapacity": [0.0985], "thrust": 16, "centerDistance": 135, "weight": 63, "controlType": "推拉软轴", "_sourceType": "hcmAluminumGearboxes", "basePrice": 0, "price": 0, "discountRate": 0.16, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "dimensions": "-" },
    { "model": "HCM500", "inputSpeedRange": [1000, 2600], "ratios": [1.5, 2.04, 2.5], "transferCapacity": [0.5062], "thrust": 50, "centerDistance": 255, "weight": 570, "controlType": "气控/电控", "_sourceType": "hcmAluminumGearboxes", "basePrice": 0, "price": 0, "discountRate": 0.16, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "dimensions": "-" }
  ],
  "dtGearboxes": [ // Updated from previous response
    { "model": "DT180", "inputSpeedRange": [750, 1500], "ratios": [1.53, 2.03, 2.5, 2.96, 3.54, 3.96, 4.48, 4.96, 5.52, 5.98], "transferCapacity": [0.0801, 0.0699, 0.0606, 0.052, 0.0442, 0.0373, 0.0311, 0.0257, 0.0211, 0.0173], "thrust": 14.7, "centerDistance": 142, "weight": 130, "controlType": "电控", "dimensions": "-", "basePrice": 23000, "price": 23000, "discountRate": 0.10, "factoryPrice": 20700, "packagePrice": 20700, "marketPrice": 23522.73 },
    { "model": "DT210", "inputSpeedRange": [750, 1500], "ratios": [1.5, 2.0, 2.5, 3.0], "transferCapacity": [0.12], "thrust": 20, "centerDistance": 150, "weight": 180, "controlType": "电控", "dimensions": "-", "basePrice": 35000, "price": 35000, "discountRate": 0.10, "factoryPrice": 31500, "packagePrice": 31500, "marketPrice": 35795.45 },
    { "model": "DT240", "inputSpeedRange": [750, 1500], "ratios": [1.53, 2.03, 2.5, 2.96, 3.55, 4, 4.53, 5.05], "transferCapacity": [0.1705, 0.1398, 0.1119, 0.0868, 0.0644, 0.0448, 0.028, 0.0139], "thrust": 30, "centerDistance": 165, "weight": 240, "controlType": "电控", "dimensions": "-", "basePrice": 39000, "price": 39000, "discountRate": 0.10, "factoryPrice": 35100, "packagePrice": 35100, "marketPrice": 39886.36 },
    { "model": "DT280", "inputSpeedRange": [750, 1500], "ratios": [1.5, 2.0, 2.5, 3.0], "transferCapacity": [0.18], "thrust": 35, "centerDistance": 180, "weight": 300, "controlType": "电控", "dimensions": "-", "basePrice": 45000, "price": 45000, "discountRate": 0.10, "factoryPrice": 40500, "packagePrice": 40500, "marketPrice": 46022.73 },
    { "model": "DT580", "inputSpeedRange": [750, 1500], "ratios": [1.46, 2.05, 2.55, 2.95, 3.48, 3.96, 4.52, 4.94, 5.41, 5.83], "transferCapacity": [0.336, 0.27, 0.25, 0.21, 0.16, 0.14, 0.123, 0.112, 0.102, 0.086], "thrust": 40, "centerDistance": 203, "weight": 370, "controlType": "电控", "dimensions": "-", "basePrice": 52000, "price": 52000, "discountRate": 0.10, "factoryPrice": 46800, "packagePrice": 46800, "marketPrice": 53181.82 },
    { "model": "DT770", "inputSpeedRange": [750, 1500], "ratios": [1.54, 1.96, 2.5, 3.05, 3.47, 3.95, 4.57, 5.1, 5.62, 5.98], "transferCapacity": [0.48, 0.443, 0.4, 0.327, 0.283, 0.214, 0.186, 0.166, 0.134, 0.106], "thrust": 50, "centerDistance": 220, "weight": 480, "controlType": "电控", "dimensions": "-", "basePrice": 58000, "price": 58000, "discountRate": 0.10, "factoryPrice": 52200, "packagePrice": 52200, "marketPrice": 59318.18 },
    { "model": "DT900", "inputSpeedRange": [750, 1500], "ratios": [1.5, 2.03, 2.48, 2.96, 3.57, 4.05, 4.52, 4.99, 5.5, 5.94], "transferCapacity": [0.6269, 0.5483, 0.4757, 0.4089, 0.348, 0.293, 0.2439, 0.2008, 0.1635, 0.1321], "thrust": 60, "centerDistance": 264, "weight": 700, "controlType": "电控", "dimensions": "-", "basePrice": 63000, "price": 63000, "discountRate": 0.10, "factoryPrice": 56700, "packagePrice": 56700, "marketPrice": 64431.82 },
    { "model": "DT1400", "inputSpeedRange": [750, 1500], "ratios": [1.47, 1.96, 2.48, 3.04, 3.44, 4.09, 4.44, 4.95, 5.53, 6.08], "transferCapacity": [0.8, 0.77, 0.663, 0.566, 0.519, 0.451, 0.416, 0.333, 0.3, 0.272], "thrust": 90, "centerDistance": 290, "weight": 900, "controlType": "电控", "dimensions": "-", "basePrice": 100000, "price": 100000, "discountRate": 0.10, "factoryPrice": 90000, "packagePrice": 90000, "marketPrice": 102272.73 },
    { "model": "DT1500", "inputSpeedRange": [750, 1500], "ratios": [1.54, 1.96, 2.52, 3.05, 3.47, 3.95, 4.45, 5, 5.49, 6.03], "transferCapacity": [1.125, 0.967, 0.813, 0.713, 0.637, 0.537, 0.41, 0.313, 0.285, 0.259], "thrust": 100, "centerDistance": 310, "weight": 1100, "controlType": "电控", "dimensions": "-", "basePrice": 120000, "price": 120000, "discountRate": 0.10, "factoryPrice": 108000, "packagePrice": 108000, "marketPrice": 122727.27 },
    { "model": "DT2400", "inputSpeedRange": [750, 1500], "ratios": [1.52, 2.04, 2.43, 2.9, 3.48, 4, 4.45, 5, 5.35, 5.5, 5.96], "transferCapacity": [1.466], "thrust": 110, "centerDistance": 340, "weight": 1430, "controlType": "电控", "dimensions": "-", "basePrice": 155000, "price": 155000, "discountRate": 0.10, "factoryPrice": 139500, "packagePrice": 139500, "marketPrice": 158522.73 },
    { "model": "DT4300", "inputSpeedRange": [750, 1500], "ratios": [1.5, 2.0, 2.5, 3.0, 3.5], "transferCapacity": [2.0], "thrust": 150, "centerDistance": 400, "weight": 2000, "controlType": "电控", "dimensions": "-", "basePrice": 175000, "price": 175000, "discountRate": 0.10, "factoryPrice": 157500, "packagePrice": 157500, "marketPrice": 178977.27 }
  ],
  "hcqGearboxes": [ // Updated based on OCR Pages 8/9
    { "model": "HC038A", "inputSpeedRange": [1500, 3200], "ratios": [1.51, 2.03, 2.52, 2.92, 3.45], "transferCapacity": [0.028, 0.028, 0.028, 0.025, 0.02], "thrust": 9, "centerDistance": 115, "weight": 70, "controlType": "推拉软轴", "dimensions": "392x480x480", "price": 16380, "basePrice": 16380, "marketPrice": 16380, "discountRate": 0, "factoryPrice": 16380, "packagePrice": 16380 },
    { "model": "HC65", "inputSpeedRange": [1000, 2500], "ratios": [1.53, 2.03, 2.5, 2.96], "transferCapacity": [0.048, 0.048, 0.048, 0.044], "thrust": 14.7, "centerDistance": 142, "weight": 130, "controlType": "推拉软轴", "dimensions": "351x380x544", "price": 12000, "basePrice": 12000, "marketPrice": 12000, "discountRate": 0, "factoryPrice": 12000, "packagePrice": 12000 },
    { "model": "HC200", "inputSpeedRange": [1000, 2200], "ratios": [1.48, 2, 2.28], "transferCapacity": [0.147], "thrust": 27.5, "centerDistance": 190, "weight": 280, "controlType": "推拉软轴/电控/气控", "dimensions": "424x792x754", "price": 27200, "basePrice": 27200, "marketPrice": 27200, "discountRate": 0, "factoryPrice": 27200, "packagePrice": 27200 },
    { "model": "HC200P", "inputSpeedRange": [1000, 2200], "ratios": [1.48, 2, 2.28], "transferCapacity": [0.147], "thrust": 27.5, "centerDistance": 190, "weight": 290, "controlType": "推拉软轴/电控/气控", "dimensions": "424x792x754", "price": 31700, "basePrice": 31700, "marketPrice": 31700, "discountRate": 0, "factoryPrice": 31700, "packagePrice": 31700 },
    { "model": "HC201", "inputSpeedRange": [1000, 2500], "ratios": [2.48, 2.96, 3.53], "transferCapacity": [0.147, 0.147, 0.132], "thrust": 30, "centerDistance": 205, "weight": 350, "controlType": "推拉软轴/电控", "dimensions": "488x691x758", "price": 30600, "basePrice": 30600, "marketPrice": 30600, "discountRate": 0, "factoryPrice": 30600, "packagePrice": 30600 },
    { "model": "HCV120", "inputSpeedRange": [1000, 2500], "ratios": [1.51, 2.02, 2.52], "transferCapacity": [0.1, 0.1, 0.076], "thrust": 25, "centerDistance": 393, "weight": 300, "controlType": "推拉软轴/电控", "dimensions": "502x600x847", "price": 33500, "basePrice": 33500, "marketPrice": 33500, "discountRate": 0, "factoryPrice": 33500, "packagePrice": 33500 },
    { "model": "HCV230", "inputSpeedRange": [1000, 2200], "ratios": [1.49, 1.96, 2.48], "transferCapacity": [0.184, 0.17, 0.146], "thrust": 27.5, "centerDistance": 480, "weight": 450, "controlType": "推拉软轴/电控/气控", "dimensions": "568x820x1020", "price": 51000, "basePrice": 51000, "marketPrice": 51000, "discountRate": 0, "factoryPrice": 51000, "packagePrice": 51000 },
    { "model": "MV100A", "inputSpeedRange": [1000, 3000], "ratios": [1.23, 1.28, 1.62, 2.07, 2.56, 2.87], "transferCapacity": [0.1, 0.1, 0.1, 0.1, 0.09, 0.08], "thrust": 20, "centerDistance": 0, "weight": 220, "controlType": "推拉软轴", "dimensions": "485x508x580", "price": 31700, "basePrice": 31700, "marketPrice": 31700, "discountRate": 0, "factoryPrice": 31700, "packagePrice": 31700 },
    { "model": "HCQ100", "inputSpeedRange": [1000, 3500], "ratios": [1.49, 2.07, 2.54, 3], "transferCapacity": [0.079, 0.077, 0.069, 0.062], "thrust": 16, "centerDistance": 146, "weight": 150, "controlType": "电控", "dimensions": "546x551x656", "price": 28000, "basePrice": 28000, "marketPrice": 28000, "discountRate": 0, "factoryPrice": 28000, "packagePrice": 28000 },
    { "model": "HCA138", "inputSpeedRange": [1000, 2600], "ratios": [1.1, 1.28, 1.5, 2.03, 2.52, 2.95], "transferCapacity": [0.11, 0.11, 0.11, 0.11, 0.11, 0.085], "thrust": 25, "centerDistance": 185, "weight": 200, "controlType": "推拉软轴/电控", "dimensions": "530x660x616", "price": 34000, "basePrice": 34000, "marketPrice": 34000, "discountRate": 0, "factoryPrice": 34000, "packagePrice": 34000 },
    { "model": "HCQ138", "inputSpeedRange": [1000, 2600], "ratios": [1.03, 1.25, 1.5, 2.03, 2.48, 2.95], "transferCapacity": [0.1, 0.1, 0.1, 0.1, 0.1, 0.098], "thrust": 25, "centerDistance": 165, "weight": 240, "controlType": "推拉软轴/电控", "dimensions": "504x619x616", "price": 27600, "basePrice": 27600, "marketPrice": 27600, "discountRate": 0, "factoryPrice": 27600, "packagePrice": 27600 },
    { "model": "HCQ300", "inputSpeedRange": [1000, 2300], "ratios": [1.06, 1.21, 1.36, 1.46, 1.74, 2.05, 2.38, 2.55], "transferCapacity": [0.25, 0.25, 0.25, 0.25, 0.25, 0.25, 0.235, 0.23], "thrust": 40, "centerDistance": 203, "weight": 370, "controlType": "推拉软轴/电控", "dimensions": "630×521×680", "price": 42000, "basePrice": 42000, "marketPrice": 42000, "discountRate": 0, "factoryPrice": 42000, "packagePrice": 42000 },
    { "model": "HCA300", "inputSpeedRange": [1000, 2300], "ratios": [1.52, 1.96, 2.5, 2.95], "transferCapacity": [0.25, 0.25, 0.25, 0.235], "thrust": 40, "centerDistance": 278, "weight": 370, "controlType": "推拉软轴/电控", "dimensions": "620×585×753", "price": 66900, "basePrice": 66900, "marketPrice": 66900, "discountRate": 0, "factoryPrice": 66900, "packagePrice": 66900 },
    { "model": "HCA301", "inputSpeedRange": [1000, 2300], "ratios": [1.5, 1.96, 2.57, 2.95], "transferCapacity": [0.25, 0.25, 0.25, 0.235], "thrust": 40, "centerDistance": 265, "weight": 370, "controlType": "推拉软轴/电控", "dimensions": "618×585×824", "price": 66900, "basePrice": 66900, "marketPrice": 66900, "discountRate": 0, "factoryPrice": 66900, "packagePrice": 66900 },
    { "model": "HCA302", "inputSpeedRange": [1000, 2300], "ratios": [1.5, 1.96, 2.57, 2.95], "transferCapacity": [0.25, 0.25, 0.25, 0.235], "thrust": 40, "centerDistance": 267.5, "weight": 380, "controlType": "推拉软轴/电控", "dimensions": "560×585×764(不含支架)", "price": 66900, "basePrice": 66900, "marketPrice": 66900, "discountRate": 0, "factoryPrice": 66900, "packagePrice": 66900 },
    { "model": "HCQ401", "inputSpeedRange": [1000, 2300], "ratios": [1, 1.12, 1.25, 1.41, 1.5, 1.76, 2.04, 2.5], "transferCapacity": [0.331, 0.331, 0.331, 0.331, 0.331, 0.331, 0.331, 0.294], "thrust": 50, "centerDistance": 220, "weight": 480, "controlType": "推拉软轴/电控", "dimensions": "640×900×800", "price": 63500, "basePrice": 63500, "marketPrice": 63500, "discountRate": 0, "factoryPrice": 63500, "packagePrice": 63500 },
    { "model": "HCQ402", "inputSpeedRange": [1000, 2300], "ratios": [2.82, 3, 3.2, 3.47], "transferCapacity": [0.331], "thrust": 50, "centerDistance": 285, "weight": 650, "controlType": "推拉软轴/电控", "dimensions": "611×890×1080", "price": 75300, "basePrice": 75300, "marketPrice": 75300, "discountRate": 0, "factoryPrice": 75300, "packagePrice": 75300 },
    { "model": "HCQ501", "inputSpeedRange": [1000, 2300], "ratios": [1.03, 1.46, 1.56, 1.88, 2, 2.45], "transferCapacity": [0.404, 0.404, 0.404, 0.404, 0.404, 0.382], "thrust": 55, "centerDistance": 235, "weight": 650, "controlType": "推拉软轴/电控", "dimensions": "742×856×950", "price": 76000, "basePrice": 76000, "marketPrice": 76000, "discountRate": 0, "factoryPrice": 76000, "packagePrice": 76000 },
    { "model": "HCQ502", "inputSpeedRange": [1000, 2300], "ratios": [2.71, 2.95], "transferCapacity": [0.404], "thrust": 60, "centerDistance": 264, "weight": 700, "controlType": "推拉软轴/电控", "dimensions": "742×856×980", "price": 78800, "basePrice": 78800, "marketPrice": 78800, "discountRate": 0, "factoryPrice": 78800, "packagePrice": 78800 },
    { "model": "HCQ700", "inputSpeedRange": [1000, 2500], "ratios": [1.3, 1.51, 1.75, 2, 2.25, 2.5, 2.78, 2.96], "transferCapacity": [0.58, 0.58, 0.58, 0.58, 0.58, 0.58, 0.514, 0.49], "thrust": 90, "centerDistance": 290, "weight": 980, "controlType": "推拉软轴/电控", "dimensions": "898×1104×1066", "price": 118000, "basePrice": 118000, "marketPrice": 118000, "discountRate": 0, "factoryPrice": 118000, "packagePrice": 118000 },
    { "model": "HCQH700", "inputSpeedRange": [1000, 2500], "ratios": [1.3, 1.51, 1.75, 2, 2.25, 2.5, 2.78, 2.96], "transferCapacity": [0.554, 0.554, 0.554, 0.554, 0.554, 0.554, 0.514, 0.49], "thrust": 90, "centerDistance": 290, "weight": 920, "controlType": "推拉软轴/电控", "dimensions": "895×1014×1100", "price": 118000, "basePrice": 118000, "marketPrice": 118000, "discountRate": 0, "factoryPrice": 118000, "packagePrice": 118000 },
    { "model": "HCQ701", "inputSpeedRange": [1000, 2500], "ratios": [2.9, 3.48, 3.62], "transferCapacity": [0.554, 0.514, 0.49], "thrust": 95, "centerDistance": 340, "weight": 1000, "controlType": "推拉软轴/电控", "dimensions": "868×1104×1146", "price": 163000, "basePrice": 163000, "marketPrice": 163000, "discountRate": 0, "factoryPrice": 163000, "packagePrice": 163000 },
    { "model": "HCA700", "inputSpeedRange": [1000, 2500], "ratios": [1.51, 1.97, 2.5, 2.73, 2.92], "transferCapacity": [0.554, 0.554, 0.554, 0.514, 0.49], "thrust": 90, "centerDistance": null, "weight": 1100, "controlType": "推拉软轴/电控", "dimensions": "835×1104×1156", "price": 163000, "basePrice": 163000, "marketPrice": 163000, "discountRate": 0, "factoryPrice": 163000, "packagePrice": 163000 },
    { "model": "HCA701", "inputSpeedRange": [1000, 2500], "ratios": [0.77], "transferCapacity": [0.554], "thrust": 27.5, "centerDistance": null, "weight": 380, "controlType": "推拉软轴/电控/气控", "dimensions": "939×1130×1035", "price": 163000, "basePrice": 163000, "marketPrice": 163000, "discountRate": 0, "factoryPrice": 163000, "packagePrice": 163000 },
    { "model": "HCA1000", "inputSpeedRange": [1000, 2300], "ratios": [2.96], "transferCapacity": [0.6], "thrust": 100, "centerDistance": null, "weight": 1100, "controlType": "推拉软轴/电控/气控", "dimensions": "1030×1104×1050", "price": 0, "basePrice": 0, "marketPrice": 0, "discountRate": 0, "factoryPrice": 0, "packagePrice": 0 }, // Price not found
    { "model": "HCQ1000", "inputSpeedRange": [800, 1800], "ratios": [2.5, 3, 3.5, 4], "transferCapacity": [0.735], "thrust": 120, "centerDistance": 310, "weight": 1100, "controlType": "推拉软轴/电控", "dimensions": "800x900x1000", "price": 184000, "basePrice": 184000, "marketPrice": 184000, "discountRate": 0, "factoryPrice": 184000, "packagePrice": 184000 },
    { "model": "HCQH1000", "inputSpeedRange": [1000, 2300], "ratios": [2.26], "transferCapacity": [0.735], "thrust": 100, "centerDistance": null, "weight": 1100, "controlType": "特殊配置", "dimensions": "-", "price": 184000, "basePrice": 184000, "marketPrice": 184000, "discountRate": 0, "factoryPrice": 184000, "packagePrice": 184000 },
    { "model": "HCQ1001", "inputSpeedRange": [1000, 2300], "ratios": [2.88, 3, 3.23], "transferCapacity": [0.735], "thrust": 100, "centerDistance": 335, "weight": 1200, "controlType": "推拉软轴/电控", "dimensions": "809×1120×1003", "price": 205000, "basePrice": 205000, "marketPrice": 205000, "discountRate": 0, "factoryPrice": 205000, "packagePrice": 205000 },
    { "model": "HCQ1400", "inputSpeedRange": [1000, 2100], "ratios": [1.52, 2, 2.48, 3], "transferCapacity": [1.03], "thrust": 110, "centerDistance": 340, "weight": 1430, "controlType": "推拉软轴/电控", "dimensions": "938×1210×1027", "price": 210000, "basePrice": 210000, "marketPrice": 210000, "discountRate": 0, "factoryPrice": 210000, "packagePrice": 210000 },
    { "model": "HCA1400", "inputSpeedRange": [1600, 2100], "ratios": [2.5, 2.93, 3], "transferCapacity": [1.03], "thrust": 110, "centerDistance": 0, "weight": 1600, "controlType": "推拉软轴/电控", "dimensions": "826×1300×1250", "price": 360000, "basePrice": 360000, "marketPrice": 360000, "discountRate": 0, "factoryPrice": 360000, "packagePrice": 360000 },
    { "model": "HCAM1400", "inputSpeedRange": [1600, 2100], "ratios": [2.5, 2.93, 3], "transferCapacity": [1.03], "thrust": 110, "centerDistance": 0, "weight": 1650, "controlType": "推拉软轴/电控", "dimensions": "826x1300x1250", "price": 360000, "basePrice": 360000, "marketPrice": 360000, "discountRate": 0, "factoryPrice": 360000, "packagePrice": 360000 },
    { "model": "HCA1401", "inputSpeedRange": [1000, 2100], "ratios": [1.52, 2.03, 2.53, 2.93], "transferCapacity": [1.031, 1.031, 0.93, 0.88], "thrust": 110, "centerDistance": 0, "weight": 1600, "controlType": "推拉软轴/电控/气控", "dimensions": "756×1300×1285", "price": 412000, "basePrice": 412000, "marketPrice": 412000, "discountRate": 0, "factoryPrice": 412000, "packagePrice": 412000 },
    { "model": "HCQH1600", "inputSpeedRange": [1000, 2100], "ratios": [2.48], "transferCapacity": [1.204], "thrust": 120, "centerDistance": 340, "weight": 1500, "controlType": "推拉软轴/电控", "dimensions": "1035×1110×1038", "price": 249000, "basePrice": 249000, "marketPrice": 249000, "discountRate": 0, "factoryPrice": 249000, "packagePrice": 249000 },
    { "model": "HCQ1600", "inputSpeedRange": [1000, 2100], "ratios": [1.51, 1.97, 2.48, 2.76], "transferCapacity": [1.204], "thrust": 120, "centerDistance": 340, "weight": 1500, "controlType": "推拉软轴/电控", "dimensions": "1106×1190×1056", "price": 249000, "basePrice": 249000, "marketPrice": 249000, "discountRate": 0, "factoryPrice": 249000, "packagePrice": 249000 },
    { "model": "HCQ1601", "inputSpeedRange": [1000, 2100], "ratios": [3.04, 3.24], "transferCapacity": [1.204, 1], "thrust": 120, "centerDistance": 370, "weight": 1550, "controlType": "推拉软轴/电控", "dimensions": "1106×1230×1180", "price": 307000, "basePrice": 307000, "marketPrice": 307000, "discountRate": 0, "factoryPrice": 307000, "packagePrice": 307000 },
     // HC Hybrid/Two-speed models (prices updated in hcGearboxes)
    { "model": "HC400P", "thrust": 80, "controlType": "混合动力", "_sourceType": "hybridGearboxes", "_isHybrid": true, "ratios": [1.5, 1.77, 2.04, 2.5, 2.86, 3, 3.25, 3.33, 3.42, 4.06, 4.61, 4.94], "_mainRatios": [1.5, 1.77, 2.04, 2.5, 2.86, 3, 3.25, 3.33, 3.42, 4.06, 4.61, 4.94], "_ptiRatios": ["x1.368", "x1.571", "x1.727", "x2", "x2.214", "x2.462", "x2.6"], "_ptiTransferCapacity": 0.13, "_ptiInputSpeedRange": [1000, 3000], "transferCapacity": [0.331], "_mainTransferCapacity": 0.331, "inputSpeedRange": [1000, 2500], "weight": 900, "centerDistance": 264, "basePrice": 90000, "price": 90000, "discountRate": 0.16, "factoryPrice": 75600, "marketPrice": 85909.09, "dimensions": "-", "packagePrice": 75600 },
    { "model": "HC600P", "thrust": 120, "controlType": "混合动力", "_sourceType": "hybridGearboxes", "_isHybrid": true, "ratios": [2, 2.48, 3, 3.58, 3.89], "_mainRatios": [2, 2.48, 3, 3.58, 3.89], "_ptiRatios": ["x1.359", "x1.486", "x1.706", "x1.968", "x2.286", "x2.538", "x2.68"], "_ptiTransferCapacity": 0.155, "_ptiInputSpeedRange": [1000, 3000], "transferCapacity": [0.49], "_mainTransferCapacity": 0.49, "inputSpeedRange": [1000, 2500], "weight": 1500, "centerDistance": 320, "basePrice": 120000, "price": 120000, "discountRate": 0.12, "factoryPrice": 105600, "marketPrice": 120000, "dimensions": "-", "packagePrice": 105600 },
    { "model": "HC1200P", "thrust": 180, "controlType": "混合动力", "_sourceType": "hybridGearboxes", "_isHybrid": true, "ratios": [1.6, 2.03, 2.48, 2.5, 2.96, 3.18, 3.33, 3.55, 3.79, 4.06, 4.2, 4.47], "_mainRatios": [1.6, 2.03, 2.48, 2.5, 2.96, 3.18, 3.33, 3.55, 3.79, 4.06, 4.2, 4.47], "_ptiRatios": ["x1.4", "x1.471", "x1.710", "x2", "x2.231", "x2.5", "x2.652"], "_ptiTransferCapacity": 0.28, "_ptiInputSpeedRange": [1000, 2500], "transferCapacity": [0.93], "_mainTransferCapacity": 0.93, "inputSpeedRange": [1000, 2500], "weight": 2100, "centerDistance": 380, "basePrice": 150000, "price": 150000, "discountRate": 0.16, "factoryPrice": 126000, "marketPrice": 143181.82, "dimensions": "-", "packagePrice": 126000 },
    { "model": "HCS138", "inputSpeedRange": [1000, 2500], "transferCapacity": [0.11], "thrust": 30, "centerDistance": 225, "controlType": "双速", "_sourceType": "twoSpeedGearboxes", "_isTwoSpeed": true, "ratios": [2, 2.52, 3, 3.57, 4.05, 4.45], "_fastRatios": [ [1.6, 1.64, 1.73, 1.78, 1.83], [2, 2.06, 2.19, 2.27, 2.34], [2.4, 2.48, 2.57, 2.67, 2.77], [2.88, 3, 3.13, 3.26], [3.21, 3.35, 3.5, 3.67], [3.56, 3.71, 3.87, 4.05] ], "weight": 400, "basePrice": 0, "price": 0, "discountRate": 0.16, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "dimensions": "-" },
    { "model": "HCS302", "inputSpeedRange": [750, 2500], "transferCapacity": [0.257], "thrust": 50, "centerDistance": 264, "controlType": "双速", "_sourceType": "twoSpeedGearboxes", "_isTwoSpeed": true, "ratios": [2, 2.54, 3, 3.59, 4.1, 4.43], "_fastRatios": [ [1.62, 1.66, 1.74, 1.79, 1.84], [2.06, 2.13, 2.2, 2.28, 2.36], [2.38, 2.46, 2.56, 2.65, 2.76], [2.82, 3.04, 3.16, 3.29], [3.28, 3.42, 3.57, 3.73], [3.58, 3.72, 3.88, 4.04] ], "weight": 700, "basePrice": 0, "price": 0, "discountRate": 0.16, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "dimensions": "-" }

  ],
  "backupPumps": [], // Keep empty if no data
  "dualEngineGearboxes": [], // Keep empty if no data
  "hybridGearboxes": [] // Keep empty if no data (HCxP models are listed under hcqGearboxes or hcGearboxes per structure)
};

// Helper function to apply updates (can be placed in a utility file)
function applyPriceUpdates(data, priceList) {
    const priceMap = new Map();
    priceList.forEach(item => {
        // Handle ratio-specific keys if necessary, e.g., "MB270A (3-5.5:1)"
        const modelKey = item.model.includes('(') ? item.model.split(' ')[0] : item.model;
        if (!priceMap.has(modelKey)) {
            priceMap.set(modelKey, []);
        }
        priceMap.get(modelKey).push(item);
    });

    const updatedData = JSON.parse(JSON.stringify(data)); // Deep copy

    Object.keys(updatedData).forEach(category => {
        if (Array.isArray(updatedData[category])) {
            updatedData[category].forEach(gearbox => {
                if (priceMap.has(gearbox.model)) {
                    // Find the best matching price entry (simple match for now)
                    const prices = priceMap.get(gearbox.model);
                    const priceInfo = prices[0]; // Take the first match for simplicity

                    gearbox.basePrice = priceInfo.basePrice;
                    gearbox.price = priceInfo.basePrice; // Set price = basePrice
                    gearbox.discountRate = priceInfo.discountRate;
                    gearbox.factoryPrice = priceInfo.discountedPrice;
                    gearbox.packagePrice = priceInfo.discountedPrice; // Set packagePrice = factoryPrice

                    // Recalculate marketPrice based on factoryPrice
                    if (gearbox.factoryPrice > 0) {
                       gearbox.marketPrice = parseFloat((gearbox.factoryPrice / (1 - 0.12)).toFixed(2)); // Example recalc
                    } else {
                       gearbox.marketPrice = 0;
                    }
                     // Add priceWarning if needed
                    gearbox.priceWarning = false;
                } else {
                     // Optionally mark items not found in the price list
                     // gearbox.priceWarning = true;
                }
            });
        }
    });
    return updatedData;
}

// Example usage (You'd import gearboxPriceData from gearboxPricing.js)
// const updatedEmbeddedData = applyPriceUpdates(embeddedGearboxData, gearboxPriceData);
// console.log(JSON.stringify(updatedEmbeddedData, null, 2));