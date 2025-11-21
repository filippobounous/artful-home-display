export function normalizeNumberInput(value: string): string {
  if (!value) return '';

  const standardized = value.replace(/,/g, '.');
  const sanitized = standardized.replace(/[^0-9.]/g, '');
  const parts = sanitized.split('.');

  if (parts.length <= 2) return sanitized;

  return `${parts.shift()}.${parts.join('')}`;
}
