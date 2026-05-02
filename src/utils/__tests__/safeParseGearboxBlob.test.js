// src/utils/__tests__/safeParseGearboxBlob.test.js
import { safeParseGearboxBlob, safeExtractAndParse } from '../safeParseGearboxBlob';

describe('safeParseGearboxBlob', () => {
  test('合法 JSON 直接解析', () => {
    const out = safeParseGearboxBlob('{"hcGearboxes":[{"model":"HC400","power":100}]}');
    expect(out.hcGearboxes[0].model).toBe('HC400');
  });

  test('JS 对象字面量(未引用 key)可解析', () => {
    const out = safeParseGearboxBlob('{ hcGearboxes: [{ model: "HC400", ratio: 2.5 }] }');
    expect(out.hcGearboxes[0].ratio).toBe(2.5);
  });

  test('单引号字符串可解析', () => {
    const out = safeParseGearboxBlob("{ note: 'hello world' }");
    expect(out.note).toBe('hello world');
  });

  test('尾随逗号容错', () => {
    const out = safeParseGearboxBlob('{ a: 1, b: [1, 2, 3,], }');
    expect(out.a).toBe(1);
    expect(out.b).toEqual([1, 2, 3]);
  });

  test('行注释与块注释剥离', () => {
    const input = `{
      // 这是注释
      "model": "HC400" /* 块注释 */, "ratio": 3.0
    }`;
    const out = safeParseGearboxBlob(input);
    expect(out.model).toBe('HC400');
  });

  test('undefined 转 null', () => {
    const out = safeParseGearboxBlob('{ a: undefined, b: 1 }');
    expect(out.a).toBeNull();
    expect(out.b).toBe(1);
  });

  test('拒绝含 eval 的内容', () => {
    expect(() => safeParseGearboxBlob('{ x: eval("1+1") }')).toThrow(/禁止/);
  });

  test('拒绝含 Function 构造器', () => {
    expect(() => safeParseGearboxBlob('{ x: Function("return 1")() }')).toThrow(/禁止/);
  });

  test('拒绝含箭头函数', () => {
    expect(() => safeParseGearboxBlob('{ x: () => 1 }')).toThrow(/禁止/);
  });

  test('拒绝含 require', () => {
    expect(() => safeParseGearboxBlob('{ x: require("fs") }')).toThrow(/禁止/);
  });

  test('拒绝含 window 访问', () => {
    expect(() => safeParseGearboxBlob('{ x: window.location }')).toThrow(/禁止/);
  });

  test('拒绝模板字符串插值', () => {
    expect(() => safeParseGearboxBlob('{ x: `hello ${user}` }')).toThrow(/禁止/);
  });

  test('拒绝 \\u 编码绕过 (如 \\u0065val)', () => {
    expect(() => safeParseGearboxBlob('{ x: "\\u0065val(1)" }')).toThrow(/禁止/);
  });

  test('拒绝过大输入', () => {
    const huge = '"' + 'x'.repeat(9 * 1024 * 1024) + '"';
    expect(() => safeParseGearboxBlob(huge)).toThrow(/过大/);
  });

  test('safeExtractAndParse 从 export const 提取对象', () => {
    const code = `// header comment
      export const embeddedGearboxData = {
        hcGearboxes: [{ model: "HC400" }]
      };
      // tail
    `;
    const out = safeExtractAndParse(code, 'embeddedGearboxData');
    expect(out.hcGearboxes[0].model).toBe('HC400');
  });

  test('safeExtractAndParse 找不到对象返回 null', () => {
    const out = safeExtractAndParse('export const other = {}', 'embeddedGearboxData');
    expect(out).toBeNull();
  });
});
