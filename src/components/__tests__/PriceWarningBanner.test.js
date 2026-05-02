// src/components/__tests__/PriceWarningBanner.test.js
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('../../utils/priceVersioning', () => ({
  getPriceWarning: jest.fn(),
  formatPriceVersion: jest.fn(() => '2026-04'),
  checkPriceUpdate: jest.fn(() => Promise.resolve({ needsUpdate: false })),
  PriceVersionManager: {
    getVersionInfo: jest.fn(() => ({ version: '2026-04', status: 'valid', effectiveDate: '2026-04-01', expiryDate: '2026-12-31', source: 'official' })),
    getQuotationDisclaimer: jest.fn(() => 'price ref')
  }
}));

import PriceWarningBanner, { PriceVersionInfo, QuotationPriceDisclaimer } from '../PriceWarningBanner';
import { getPriceWarning, checkPriceUpdate, PriceVersionManager, formatPriceVersion } from '../../utils/priceVersioning';

describe('PriceWarningBanner', () => {
  beforeEach(() => { jest.clearAllMocks(); localStorage.clear(); checkPriceUpdate.mockResolvedValue({ needsUpdate: false }); formatPriceVersion.mockReturnValue('2026-04'); });

  test('no warning => null', () => {
    getPriceWarning.mockReturnValue(null);
    const { container } = render(<PriceWarningBanner />);
    expect(container.firstChild).toBeNull();
  });

  test('warning level => alert with title and message', async () => {
    getPriceWarning.mockReturnValue({ level: 'warning', title: 'AAA', message: 'BBB', action: 'OK' });
    render(<PriceWarningBanner />);
    await waitFor(() => {
      expect(screen.getByText(/AAA/)).toBeInTheDocument();
      expect(screen.getByText('BBB')).toBeInTheDocument();
    });
  });

  test('error level => danger alert', async () => {
    getPriceWarning.mockReturnValue({ level: 'error', title: 'CCC', message: 'DDD' });
    const { container } = render(<PriceWarningBanner />);
    await waitFor(() => { expect(screen.getByText(/CCC/)).toBeInTheDocument(); });
    expect(container.querySelector('.alert-danger')).toBeInTheDocument();
  });

  test('updateAvailable => refresh button', async () => {
    getPriceWarning.mockReturnValue({ level: 'warning', title: 'X', message: 'Y' });
    checkPriceUpdate.mockResolvedValue({ needsUpdate: true });
    render(<PriceWarningBanner />);
    await waitFor(() => { expect(screen.getByText(/刷新获取更新/)).toBeInTheDocument(); });
  });

  test('dismiss button => onDismiss + localStorage', async () => {
    getPriceWarning.mockReturnValue({ level: 'warning', title: 'X', message: 'Y', action: 'KNOW' });
    const onDismiss = jest.fn();
    render(<PriceWarningBanner onDismiss={onDismiss} />);
    await waitFor(() => { expect(screen.getByText('KNOW')).toBeInTheDocument(); });
    fireEvent.click(screen.getByText('KNOW'));
    expect(onDismiss).toHaveBeenCalled();
    expect(localStorage.getItem('_priceWarningDismissed_2026-04')).toBe('true');
  });
});

describe('PriceVersionInfo', () => {
  beforeEach(() => jest.clearAllMocks());
  test('valid status', () => {
    PriceVersionManager.getVersionInfo.mockReturnValue({ version: '2026-04', status: 'valid', effectiveDate: '2026-04-01', expiryDate: '2026-12-31', source: 'official' });
    render(<PriceVersionInfo />);
    expect(screen.getByText('2026-04')).toBeInTheDocument();
    expect(screen.getByText('有效')).toBeInTheDocument();
  });
  test('expired status', () => {
    PriceVersionManager.getVersionInfo.mockReturnValue({ version: '2025-01', status: 'expired', effectiveDate: '2025-01-01', expiryDate: '2025-12-31', source: 'old' });
    render(<PriceVersionInfo />);
    expect(screen.getByText('已过期')).toBeInTheDocument();
  });
  test('showDetails', () => {
    PriceVersionManager.getVersionInfo.mockReturnValue({ version: '2026-04', status: 'valid', effectiveDate: '2026-04-01', expiryDate: '2026-12-31', source: 'official' });
    render(<PriceVersionInfo showDetails />);
    expect(screen.getByText(/生效日期/)).toBeInTheDocument();
    expect(screen.getByText(/有效期至/)).toBeInTheDocument();
    expect(screen.getByText(/数据来源/)).toBeInTheDocument();
  });
});

describe('QuotationPriceDisclaimer', () => {
  beforeEach(() => jest.clearAllMocks());
  test('valid disclaimer', () => {
    PriceVersionManager.getVersionInfo.mockReturnValue({ status: 'valid' });
    PriceVersionManager.getQuotationDisclaimer.mockReturnValue('p ref');
    render(<QuotationPriceDisclaimer />);
    expect(screen.getByText(/p ref/)).toBeInTheDocument();
  });
  test('expired disclaimer', () => {
    PriceVersionManager.getVersionInfo.mockReturnValue({ status: 'expired' });
    PriceVersionManager.getQuotationDisclaimer.mockReturnValue('expired');
    render(<QuotationPriceDisclaimer />);
    expect(screen.getByText(/实际价格请以最新报价为准/)).toBeInTheDocument();
  });
});
