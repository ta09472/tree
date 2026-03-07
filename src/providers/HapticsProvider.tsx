import { type ReactNode, useEffect, useRef } from 'react';
import { WebHaptics } from 'web-haptics';

interface HapticsProviderProps {
  children: ReactNode;
}

export function HapticsProvider({ children }: HapticsProviderProps) {
  const hapticsRef = useRef<WebHaptics | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      hapticsRef.current = new WebHaptics({
        // Haptic feedback configuration
      });
    }

    return () => {
      hapticsRef.current?.destroy();
    };
  }, []);

  return <>{children}</>;
}
