import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

const locale = () => {
  return navigator.languages && navigator.languages.length
    ? navigator.languages[0]
    : navigator.language;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumber(value: number, currency: string = ''): string {
  const currentLocale = locale();

  if (currency) {
    const currencyFormatter = new Intl.NumberFormat(currentLocale, {
      style: 'currency',
      currency
    });

    return currencyFormatter.format(value);
  }

  const numberFormatter = new Intl.NumberFormat(currentLocale);

  return numberFormatter.format(value);
}
