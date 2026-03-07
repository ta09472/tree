import type { ReactNode } from 'react';
import { ConvexProvider } from './ConvexProvider';
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
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange={false}
    >
      <I18nProvider>
        <MotionProvider>
          <ConvexProvider>
            <HapticsProvider>{children}</HapticsProvider>
          </ConvexProvider>
        </MotionProvider>
      </I18nProvider>
    </ThemeProvider>
  );
}
