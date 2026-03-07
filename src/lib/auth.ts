// Better-Auth 설정 (Convex와 연동)
// 참고: 실제 Convex 연동은 convex dev 실행 후 _generated/api 생성 후 작동합니다
import { betterAuth } from 'better-auth';

export const auth = betterAuth({
  database: {
    provider: 'convex',
    // Convex 클라이언트는 런타임에 주입됩니다
  },
  socialProviders: {
    google: {
      clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID || '',
      clientSecret: import.meta.env.VITE_GOOGLE_CLIENT_SECRET || '',
    },
  },
});

export type Auth = typeof auth;
