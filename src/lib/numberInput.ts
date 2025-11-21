const suffixMultipliers: Record<string, number> = {
  k: 1_000,
  m: 1_000_000,
  b: 1_000_000_000,
  t: 1_000_000_000_000,
};

export function normalizeNumberInput(value: string): string {
  const trimmedValue = value.trim();
  const normalizedValue = trimmedValue.toLowerCase();
  const match = normalizedValue.match(/^(-?\d+(?:\.\d+)?)([kmbt])$/);

  if (match) {
    const [, numberPart, suffix] = match;
    const multiplier = suffixMultipliers[suffix];
    const numericValue = parseFloat(numberPart) * multiplier;

    if (!Number.isNaN(numericValue) && Number.isFinite(numericValue)) {
      return numericValue.toString();
    }
  }

  const withoutCommas = normalizedValue.replace(/,/g, '');
  if (withoutCommas !== normalizedValue && !Number.isNaN(Number(withoutCommas))) {
    return withoutCommas;
  }

  return trimmedValue;
}
