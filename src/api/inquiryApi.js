// src/api/inquiryApi.js
// 技术询单 API 接口

const API_BASE = '/api/inquiries';

/**
 * 提交技术询单
 * @param {Object} inquiryData - 询单数据
 * @returns {Promise<Object>} - 返回 { success: boolean, inquiryId: string, inquiry: Object }
 */
export async function submitInquiry(inquiryData) {
  const response = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...inquiryData,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || '提交询单失败');
  }

  return response.json();
}

/**
 * 获取询单历史列表
 * @param {Object} params - 查询参数 { page, limit, status }
 * @returns {Promise<Object>} - 返回 { success: boolean, inquiries: Array, total: number }
 */
export async function getInquiryHistory(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_BASE}?${query}`);

  if (!response.ok) {
    throw new Error('获取询单历史失败');
  }

  return response.json();
}

/**
 * 获取单个询单详情
 * @param {string} id - 询单ID
 * @returns {Promise<Object>} - 返回 { success: boolean, inquiry: Object }
 */
export async function getInquiryById(id) {
  const response = await fetch(`${API_BASE}/${id}`);

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('询单不存在');
    }
    throw new Error('获取询单详情失败');
  }

  return response.json();
}

/**
 * 更新询单状态
 * @param {string} id - 询单ID
 * @param {string} status - 新状态 (pending | processing | completed | cancelled)
 * @returns {Promise<Object>} - 返回 { success: boolean, inquiry: Object }
 */
export async function updateInquiryStatus(id, status) {
  const response = await fetch(`${API_BASE}/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  });

  if (!response.ok) {
    throw new Error('更新询单状态失败');
  }

  return response.json();
}

/**
 * 删除询单
 * @param {string} id - 询单ID
 * @returns {Promise<Object>} - 返回 { success: boolean }
 */
export async function deleteInquiry(id) {
  const response = await fetch(`${API_BASE}/${id}`, {
    method: 'DELETE'
  });

  if (!response.ok) {
    throw new Error('删除询单失败');
  }

  return response.json();
}

export default {
  submitInquiry,
  getInquiryHistory,
  getInquiryById,
  updateInquiryStatus,
  deleteInquiry
};
