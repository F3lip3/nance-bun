import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

type numberFormatStyle = 'decimal' | 'currency' | 'percent' | 'unit';

const locale = () => {
  return navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(
  value: number,
  currency: string = '',
  style: numberFormatStyle = 'decimal',
  decimalDigits: number = 2
): string {
  const currentLocale = locale();

  if (currency) {
    const currencyFormatter = new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency
    });

    return currencyFormatter.format(value).replace(/^(\D+)/, '$1 ');
  }

  const numberFormatter = new Intl.NumberFormat(currentLocale, {
    style,
    maximumFractionDigits: decimalDigits
  });

  return numberFormatter.format(value);
}
