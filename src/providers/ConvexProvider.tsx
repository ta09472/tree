import type { ReactNode } from 'react';

// Convex 없이 프론트엔드만 동작하도록 스텁 처리
interface ConvexProviderProps {
  children: ReactNode;
}

export function ConvexProvider({ children }: ConvexProviderProps) {
  // Convex 연동 전까지는 children만 렌더링
  return <>{children}</>;
}
