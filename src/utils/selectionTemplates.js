// src/utils/selectionTemplates.js
// 用户自定义选型模板管理

const STORAGE_KEY = 'gearbox_selection_templates';
const MAX_TEMPLATES = 20;

export function getTemplates() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  } catch {
    return [];
  }
}

export function saveTemplate(name, params) {
  const templates = getTemplates();
  const template = {
    id: Date.now().toString(36),
    name,
    params: { ...params },
    createdAt: new Date().toISOString(),
    usageCount: 0
  };
  templates.unshift(template);
  if (templates.length > MAX_TEMPLATES) templates.pop();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
  return template;
}

export function deleteTemplate(id) {
  const templates = getTemplates().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function incrementUsage(id) {
  const templates = getTemplates();
  const t = templates.find(item => item.id === id);
  if (t) {
    t.usageCount = (t.usageCount || 0) + 1;
    t.lastUsed = new Date().toISOString();
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}

export function renameTemplate(id, newName) {
  const templates = getTemplates();
  const t = templates.find(item => item.id === id);
  if (t) t.name = newName;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
}
