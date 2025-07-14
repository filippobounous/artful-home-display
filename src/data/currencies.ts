import data from 'currency-codes/data';
import getSymbolFromCurrency from 'currency-symbol-map';

export interface CurrencyOption {
  code: string;
  symbol: string | undefined;
}

export const currencyOptions: CurrencyOption[] = data
  .map((item) => ({
    code: item.code,
    symbol: getSymbolFromCurrency(item.code) || '',
  }))
  .sort((a, b) => a.code.localeCompare(b.code));
