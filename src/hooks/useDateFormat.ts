import { format, formatDistance, formatRelative, isValid, parseISO } from 'date-fns';
import { enUS, ko } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

type DateInput = Date | string | number;

export function useDateFormat() {
  const { i18n } = useTranslation();

  const locale = i18n.language === 'ko' ? ko : enUS;

  const toDate = (date: DateInput): Date | null => {
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

  const formatDate = (date: DateInput, formatStr = 'PPP'): string => {
    const d = toDate(date);
    if (!d) return '';
    return format(d, formatStr, { locale });
  };

  const formatDistanceToNow = (date: DateInput, addSuffix = true): string => {
    const d = toDate(date);
    if (!d) return '';
    return formatDistance(d, new Date(), { locale, addSuffix });
  };

  const formatRelativeDate = (date: DateInput): string => {
    const d = toDate(date);
    if (!d) return '';
    return formatRelative(d, new Date(), { locale });
  };

  const formatTime = (date: DateInput): string => {
    return formatDate(date, 'p');
  };

  const formatDateTime = (date: DateInput): string => {
    return formatDate(date, 'PPp');
  };

  return {
    formatDate,
    formatDistanceToNow,
    formatRelativeDate,
    formatTime,
    formatDateTime,
    locale,
  };
}
