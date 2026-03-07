import { Check, Globe } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHaptics } from '../hooks/useHaptics';
import { Button } from './ui/button';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation();
  const { triggerLight } = useHaptics();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleLanguageChange = (langCode: string) => {
    triggerLight();
    void i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
        aria-label={t('language')}
      >
        <Globe className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-50 mt-2 min-w-[160px] overflow-hidden rounded-md border border-border bg-card p-1 shadow-lg"
          >
            {languages.map((lang) => (
              <button
                type="button"
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className="flex w-full items-center gap-2 rounded-sm px-3 py-2 text-left text-sm transition-colors hover:bg-secondary"
              >
                <motion.div
                  initial={false}
                  animate={{ scale: i18n.language === lang.code ? 1.1 : 1 }}
                  className="flex flex-1 items-center gap-2"
                >
                  <span>{lang.flag}</span>
                  <span className={i18n.language === lang.code ? 'font-semibold' : ''}>
                    {lang.name}
                  </span>
                </motion.div>
                {i18n.language === lang.code && <Check className="h-4 w-4 text-primary" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
