import { useCallback, useRef } from 'react';
import { type HapticInput, WebHaptics } from 'web-haptics';

export function useHaptics() {
  const hapticsRef = useRef<WebHaptics | null>(null);

  if (!hapticsRef.current && typeof window !== 'undefined') {
    hapticsRef.current = new WebHaptics();
  }

  const vibrate = useCallback(async (input?: HapticInput) => {
    if (hapticsRef.current) {
      await hapticsRef.current.trigger(input);
    }
  }, []);

  const triggerLight = useCallback(() => vibrate('light'), [vibrate]);
  const triggerMedium = useCallback(() => vibrate('medium'), [vibrate]);
  const triggerHeavy = useCallback(() => vibrate('heavy'), [vibrate]);
  const triggerSuccess = useCallback(() => vibrate('success'), [vibrate]);
  const triggerError = useCallback(() => vibrate('error'), [vibrate]);
  const triggerWarning = useCallback(() => vibrate('warning'), [vibrate]);

  return {
    vibrate,
    isSupported: WebHaptics.isSupported,
    triggerLight,
    triggerMedium,
    triggerHeavy,
    triggerSuccess,
    triggerError,
    triggerWarning,
  };
}
