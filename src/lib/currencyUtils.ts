
const currencyFormats: Record<string, { locale: string; symbol: string }> = {
  GBP: { locale: 'en-GB', symbol: '£' },
  EUR: { locale: 'en-GB', symbol: '€' },
  USD: { locale: 'en-US', symbol: '$' },
  CHF: { locale: 'en-GB', symbol: 'CHF ' },
  JPY: { locale: 'ja-JP', symbol: '¥' },
};

export function formatCurrency(amount: number, currencyCode: string): string {
  const format = currencyFormats[currencyCode];

  if (!format) {
    return `${currencyCode} ${amount.toLocaleString('en-GB', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return new Intl.NumberFormat(format.locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

interface FormatCurrencySafeOptions {
  fallbackCurrency?: string;
}

export function formatCurrencySafe(
  amount?: number | null,
  currencyCode?: string | null,
  options: FormatCurrencySafeOptions = {},
): string {
  if (typeof amount !== 'number' || !Number.isFinite(amount)) {
    return '-';
  }

  const providedCurrency =
    typeof currencyCode === 'string' && currencyCode.trim().length > 0
      ? currencyCode
      : undefined;

  const fallbackCurrency =
    typeof options.fallbackCurrency === 'string' &&
    options.fallbackCurrency.trim().length > 0
      ? options.fallbackCurrency
      : undefined;

  const resolvedCurrency = providedCurrency ?? fallbackCurrency ?? 'EUR';

  if (!resolvedCurrency) {
    return '-';
  }

  return formatCurrency(amount, resolvedCurrency);
}

export function formatNumber(value: number, decimals: number = 0): string {
  return value.toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatDate(date: string | Date): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}
