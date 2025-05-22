// src/utils/optimizedDataImport.test.js
import { processGearboxData, processCouplingData, processPumpData } from './optimizedDataImport';

describe('processGearboxData - Factory Price Calculation', () => {
    const baseGearboxItem = {
        '型号': 'TestGearbox',
        '减速比': '1,2,3', // valid ratios
        '额定推力(kN)': '100', // valid thrust
        '输入转速范围(r/min)': '1000,2000',
        '传递能力(kW/r/min)': '0.1,0.2',
    };

    it('1. should use factoryPrice from input if present and positive', () => {
        const item = { ...baseGearboxItem, '出厂价': 120, '成本价': 100, '下浮率(%)': 10 };
        const result = processGearboxData([item])[0];
        expect(result.factoryPrice).toBe(120);
        expect(result.discountRate).toBe(10); // Also check discountRate is present
    });

    it('2. should calculate factoryPrice if not present in input (and basePrice, discountRate valid)', () => {
        const item = { ...baseGearboxItem, '成本价': 100, '下浮率(%)': 10 };
        const result = processGearboxData([item])[0];
        expect(result.factoryPrice).toBe(90);
        expect(result.discountRate).toBe(10);
    });

    it('3. should calculate factoryPrice if discountRate is 0', () => {
        const item = { ...baseGearboxItem, '成本价': 100, '下浮率(%)': 0 };
        const result = processGearboxData([item])[0];
        expect(result.factoryPrice).toBe(100);
        expect(result.discountRate).toBe(0);
    });

    it('4. should not include factoryPrice if calculation results in negative (floored to 0)', () => {
        const item = { ...baseGearboxItem, '成本价': 100, '下浮率(%)': 110 };
        const result = processGearboxData([item])[0];
        expect(result.factoryPrice).toBeUndefined();
        expect(result.discountRate).toBe(110);
    });

    it('5. should not include factoryPrice if basePrice is missing/invalid', () => {
        const item = { ...baseGearboxItem, '下浮率(%)': 10 }; // No '成本价'
        const result = processGearboxData([item])[0];
        expect(result.factoryPrice).toBeUndefined();
        expect(result.discountRate).toBe(10);
    });

    it('6. should not include factoryPrice if discountRate is missing/invalid', () => {
        const item = { ...baseGearboxItem, '成本价': 100 }; // No '下浮率(%)'
        const result = processGearboxData([item])[0];
        expect(result.factoryPrice).toBeUndefined();
        expect(result.discountRate).toBeUndefined();
    });

    it('7. should calculate factoryPrice if input factoryPrice is 0 (and calculation possible)', () => {
        const item = { ...baseGearboxItem, '出厂价': 0, '成本价': 100, '下浮率(%)': 10 };
        const result = processGearboxData([item])[0];
        expect(result.factoryPrice).toBe(90);
        expect(result.discountRate).toBe(10);
    });

    it('8. should not include factoryPrice if basePrice is 0 and calculation attempted', () => {
        const item = { ...baseGearboxItem, '成本价': 0, '下浮率(%)': 10 };
        const result = processGearboxData([item])[0];
        expect(result.factoryPrice).toBeUndefined();
        expect(result.discountRate).toBe(10);
    });
});

describe('processCouplingData - Factory Price Calculation', () => {
    const baseCouplingItem = {
        '型号': 'TestCoupling',
        '额定扭矩(kN.m)': '100', // valid torque
        '重量(kg)': '50', // valid weight
        // '成本价' is the base for price, so for validation it should be > 0 if other price fields are not.
    };

    it('1. should use factoryPrice from input if present and positive', () => {
        const item = { ...baseCouplingItem, '出厂价': 220, '成本价': 200, '下浮率(%)': 10 };
        const result = processCouplingData([item])[0];
        expect(result.factoryPrice).toBe(220);
        expect(result.price).toBe(200); // Ensure basePrice is also set as 'price'
        expect(result.discountRate).toBe(10);
    });

    it('2. should calculate factoryPrice if not present in input', () => {
        const item = { ...baseCouplingItem, '成本价': 200, '下浮率(%)': 15 };
        const result = processCouplingData([item])[0];
        expect(result.factoryPrice).toBe(170); // 200 * (1 - 0.15)
        expect(result.price).toBe(200);
        expect(result.discountRate).toBe(15);
    });

    it('3. should calculate factoryPrice if discountRate is 0', () => {
        const item = { ...baseCouplingItem, '成本价': 200, '下浮率(%)': 0 };
        const result = processCouplingData([item])[0];
        expect(result.factoryPrice).toBe(200);
        expect(result.discountRate).toBe(0);
    });

    it('4. should not include factoryPrice if calculation results in negative (floored to 0)', () => {
        const item = { ...baseCouplingItem, '成本价': 200, '下浮率(%)': 120 };
        const result = processCouplingData([item])[0];
        expect(result.factoryPrice).toBeUndefined();
        expect(result.discountRate).toBe(120);
    });
    
    it('5. should not include factoryPrice if basePrice is missing/invalid (and item becomes invalid)', () => {
        // If '成本价' (price) is 0 or missing, the item itself might be invalid due to `processed.price <= 0`
        const item = { ...baseCouplingItem, '下浮率(%)': 10 }; // No '成本价', so price will be 0
        const results = processCouplingData([item]); // item will be filtered out
        expect(results.length).toBe(0); 
    });

    it('5b. should not include factoryPrice if basePrice is missing/invalid (item valid due to other price)', () => {
        // Test case where item is valid due to marketPrice, but factoryPrice calculation is still skipped
        const itemValid = { ...baseCouplingItem, '下浮率(%)': 10, '市场价': 300, '成本价': 0 }; // '成本价' is 0
        const result = processCouplingData([itemValid])[0];
        expect(result.factoryPrice).toBeUndefined(); // No base for calculation
        expect(result.discountRate).toBe(10);
        expect(result.price).toBe(0); // basePrice is 0
    });


    it('6. should not include factoryPrice if discountRate is missing/invalid', () => {
        const item = { ...baseCouplingItem, '成本价': 200 };
        const result = processCouplingData([item])[0];
        expect(result.factoryPrice).toBeUndefined();
        expect(result.discountRate).toBeUndefined();
    });

    it('7. should calculate factoryPrice if input factoryPrice is 0 (and calculation possible)', () => {
        const item = { ...baseCouplingItem, '出厂价': 0, '成本价': 200, '下浮率(%)': 15 };
        const result = processCouplingData([item])[0];
        expect(result.factoryPrice).toBe(170);
        expect(result.discountRate).toBe(15);
    });

    it('8. should not include factoryPrice if basePrice is 0 and calculation attempted', () => {
        const item = { ...baseCouplingItem, '成本价': 0, '下浮率(%)': 15, '市场价': 10 }; // marketPrice > 0 ensures item is valid
        const result = processCouplingData([item])[0];
        expect(result.factoryPrice).toBeUndefined();
        expect(result.discountRate).toBe(15);
    });
});

describe('processPumpData - Factory Price Calculation', () => {
    const basePumpItem = {
        '型号': 'TestPump',
        '流量(m³/h)': '10', // valid flow
        '压力(MPa)': '1',   // valid pressure
        '电机功率(kW)': '5', // valid motorPower
        // '成本价' is the base for price for validation if other price fields are not present
    };

    it('1. should use factoryPrice from input if present and positive', () => {
        const item = { ...basePumpItem, '出厂价': 350, '成本价': 300, '下浮率(%)': 10 };
        const result = processPumpData([item])[0];
        expect(result.factoryPrice).toBe(350);
        expect(result.price).toBe(300);
        expect(result.discountRate).toBe(10);
    });

    it('2. should calculate factoryPrice if not present in input', () => {
        const item = { ...basePumpItem, '成本价': 300, '下浮率(%)': 20 };
        const result = processPumpData([item])[0];
        expect(result.factoryPrice).toBe(240); // 300 * (1 - 0.20)
        expect(result.discountRate).toBe(20);
    });

    it('3. should calculate factoryPrice if discountRate is 0', () => {
        const item = { ...basePumpItem, '成本价': 300, '下浮率(%)': 0 };
        const result = processPumpData([item])[0];
        expect(result.factoryPrice).toBe(300);
        expect(result.discountRate).toBe(0);
    });

    it('4. should not include factoryPrice if calculation results in negative (floored to 0)', () => {
        const item = { ...basePumpItem, '成本价': 300, '下浮率(%)': 150 };
        const result = processPumpData([item])[0];
        expect(result.factoryPrice).toBeUndefined();
        expect(result.discountRate).toBe(150);
    });

    it('5. should not include factoryPrice if basePrice is missing/invalid (and item becomes invalid)', () => {
        const item = { ...basePumpItem, '下浮率(%)': 10 }; // No '成本价', so price will be 0
        const results = processPumpData([item]);
        expect(results.length).toBe(0); // Item filtered out due to price <= 0
    });
    
    it('5b. should not include factoryPrice if basePrice is missing/invalid (item valid due to other price)', () => {
        const itemValid = { ...basePumpItem, '下浮率(%)': 10, '市场价': 400, '成本价': 0 }; // '成本价' is 0
        const result = processPumpData([itemValid])[0];
        expect(result.factoryPrice).toBeUndefined();
        expect(result.discountRate).toBe(10);
        expect(result.price).toBe(0);
    });

    it('6. should not include factoryPrice if discountRate is missing/invalid', () => {
        const item = { ...basePumpItem, '成本价': 300 };
        const result = processPumpData([item])[0];
        expect(result.factoryPrice).toBeUndefined();
        expect(result.discountRate).toBeUndefined();
    });

    it('7. should calculate factoryPrice if input factoryPrice is 0 (and calculation possible)', () => {
        const item = { ...basePumpItem, '出厂价': 0, '成本价': 300, '下浮率(%)': 20 };
        const result = processPumpData([item])[0];
        expect(result.factoryPrice).toBe(240);
        expect(result.discountRate).toBe(20);
    });

    it('8. should not include factoryPrice if basePrice is 0 and calculation attempted', () => {
        const item = { ...basePumpItem, '成本价': 0, '下浮率(%)': 20, '市场价': 10 }; // marketPrice > 0 ensures item is valid
        const result = processPumpData([item])[0];
        expect(result.factoryPrice).toBeUndefined();
        expect(result.discountRate).toBe(20);
    });
});
