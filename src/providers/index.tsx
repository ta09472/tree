import type { ReactNode } from 'react';
import { HapticsProvider } from './HapticsProvider';
import { I18nProvider } from './I18nProvider';
import { MotionProvider } from './MotionProvider';
import { ThemeProvider } from './ThemeProvider';

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <I18nProvider>
        <MotionProvider>
          <HapticsProvider>{children}</HapticsProvider>
        </MotionProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
