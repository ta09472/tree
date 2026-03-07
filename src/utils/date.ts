import { format, formatDistance, formatRelative, isValid, parseISO } from 'date-fns';
import { enUS, ko, type Locale } from 'date-fns/locale';

type DateInput = Date | string | number;

const getLocale = (lang: string): Locale => {
  return lang === 'ko' ? ko : enUS;
};

export const toDate = (date: DateInput): Date | null => {
  if (date instanceof Date) return isValid(date) ? date : null;
  if (typeof date === 'string') {
    const parsed = parseISO(date);
    return isValid(parsed) ? parsed : null;
  }
  if (typeof date === 'number') {
    const parsed = new Date(date);
    return isValid(parsed) ? parsed : null;
  }
  return null;
};

export const formatDate = (date: DateInput, formatStr = 'PPP', lang = 'en'): string => {
  const d = toDate(date);
  if (!d) return '';
  return format(d, formatStr, { locale: getLocale(lang) });
};

export const formatDistanceToNow = (date: DateInput, lang = 'en', addSuffix = true): string => {
  const d = toDate(date);
  if (!d) return '';
  return formatDistance(d, new Date(), { locale: getLocale(lang), addSuffix });
};

export const formatRelativeDate = (date: DateInput, lang = 'en'): string => {
  const d = toDate(date);
  if (!d) return '';
  return formatRelative(d, new Date(), { locale: getLocale(lang) });
};

export const formatTime = (date: DateInput, lang = 'en'): string => {
  return formatDate(date, 'p', lang);
};

export const formatDateTime = (date: DateInput, lang = 'en'): string => {
  return formatDate(date, 'PPp', lang);
};
