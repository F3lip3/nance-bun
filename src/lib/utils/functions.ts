import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type numberFormatStyle = 'decimal' | 'currency' | 'percent' | 'unit';

type formatNumberOpts = {
  currency?: string;
  style?: numberFormatStyle;
  decimalDigits?: number;
};

const locale = () => {
  return navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: Date) {
  const currentLocale = locale();
  return new Intl.DateTimeFormat(currentLocale).format(value);
}

export function formatNumber(
  value: number,
  opts: formatNumberOpts = {
    currency: '',
    decimalDigits: 2,
    style: 'decimal'
  }
): string {
  const currentLocale = locale();
  const { currency, decimalDigits, style } = opts;

  if (currency) {
    try {
      const currencyFormatter = new Intl.NumberFormat(currentLocale, {
        style: 'currency',
        currency
      });

      return currencyFormatter.format(value).replace(/^(\D+)/, '$1 ');
    } catch (ex) {
      if ((ex as Error).message.includes('Invalid currency code')) {
        return formatNumber(value, { ...opts, currency: 'USD' });
      }
      throw ex;
    }
  }

  const numberFormatter = new Intl.NumberFormat(currentLocale, {
    style,
    maximumFractionDigits: decimalDigits
  });

  return numberFormatter.format(value);
}

export function sleep(time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time));
}
