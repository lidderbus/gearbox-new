// src/utils/__tests__/sanitize.test.js
import { sanitizeHtml, sanitizeInline, escapeHtml } from '../sanitize';

describe('sanitize utilities', () => {
  describe('sanitizeHtml', () => {
    test('保留正常 HTML 结构', () => {
      const dirty = '<div><h1>标题</h1><p>段落</p></div>';
      expect(sanitizeHtml(dirty)).toBe('<div><h1>标题</h1><p>段落</p></div>');
    });

    test('剥离 <script> 标签', () => {
      const dirty = '<p>hello</p><script>alert("xss")</script>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('alert');
      expect(clean).toContain('<p>hello</p>');
    });

    test('剥离 onerror 事件处理器', () => {
      const dirty = '<img src="x" onerror="alert(1)" />';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('onerror');
      expect(clean).not.toContain('alert');
    });

    test('剥离 <iframe> (FORBID_TAGS)', () => {
      const dirty = '<p>ok</p><iframe src="evil.com"></iframe>';
      const clean = sanitizeHtml(dirty);
      expect(clean).not.toContain('<iframe');
    });

    test('null/undefined 返回空字符串', () => {
      expect(sanitizeHtml(null)).toBe('');
      expect(sanitizeHtml(undefined)).toBe('');
    });

    test('保留 colspan/rowspan/target 属性', () => {
      const dirty = '<table><tr><td colspan="2">x</td></tr></table>';
      expect(sanitizeHtml(dirty)).toContain('colspan="2"');
    });
  });

  describe('sanitizeInline', () => {
    test('保留 b/i/em/strong/mark/span', () => {
      const dirty = '<b>粗</b><i>斜</i><em>强</em><mark>高亮</mark><span>span</span>';
      const clean = sanitizeInline(dirty);
      expect(clean).toContain('<b>粗</b>');
      expect(clean).toContain('<mark>高亮</mark>');
      expect(clean).toContain('<span>span</span>');
    });

    test('剥离非允许标签 (div/h1/script)', () => {
      const dirty = '<div>div</div><h1>h1</h1><script>x</script>';
      const clean = sanitizeInline(dirty);
      expect(clean).not.toContain('<div>');
      expect(clean).not.toContain('<h1>');
      expect(clean).not.toContain('<script>');
    });
  });

  describe('escapeHtml', () => {
    test('转义 < > & " 单引号', () => {
      expect(escapeHtml('<script>')).toBe('&lt;script&gt;');
      expect(escapeHtml('a & b')).toBe('a &amp; b');
      expect(escapeHtml('"hello"')).toBe('&quot;hello&quot;');
      expect(escapeHtml("it's")).toBe('it&#39;s');
    });

    test('null/undefined 返回空字符串', () => {
      expect(escapeHtml(null)).toBe('');
      expect(escapeHtml(undefined)).toBe('');
    });

    test('数字转字符串再转义', () => {
      expect(escapeHtml(42)).toBe('42');
    });

    test('安全用于 HTML 模板字符串拼接', () => {
      const customerName = '<script>alert("xss")</script>';
      const html = `<h1>${escapeHtml(customerName)}</h1>`;
      expect(html).toBe('<h1>&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;</h1>');
      // 这串 HTML 即使被 dangerouslySetInnerHTML 渲染, 也不会执行脚本
    });
  });
});
