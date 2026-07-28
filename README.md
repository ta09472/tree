# 제주 햇살 농장 — 천혜향 나무 분양

제주 감귤(천혜향) 농장의 **나무 분양** 서비스 웹사이트. 방문자가 농장을 둘러보고, 지도에서 과수원 위치를 확인하고, 개별 나무를 골라 분양받고, 생육 소식을 확인하는 흐름을 담았다. 농장 운영자를 위한 고객 관리 어드민도 포함한다.

TanStack Start(React 19 + SSR) 기반이며, 현재 화면은 **목 데이터 + localStorage**로 동작한다. Convex 백엔드 스키마와 쿼리/뮤테이션은 작성돼 있지만 아직 UI에 연결되지 않았다. (자세한 내용은 [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md))

## 화면

| 경로 | 설명 |
|------|------|
| `/` | 랜딩. 히어로, 분양 절차 4단계, 농장 소개, 지도, 대표 나무 |
| `/about` | 농장·농부 소개, 천혜향 안내 |
| `/farms` | 농장 목록 + 과수원 지도(Leaflet)에서 나무 고르기 |
| `/farms/$farmId` | 농장 상세, 분양 가능한 나무 목록 |
| `/trees/$treeId` | 나무 상세. 수세·예상 수확량·생육 로그, 분양 신청 |
| `/my` | 내가 분양받은 나무 목록 |
| `/admin/customers` | 고객 목록, 상태별 필터 |
| `/admin/customers/$customerId` | 고객 상세, 주문 차트, 액션 센터(수정/삭제/메모) |

## 기술 스택

| 분류 | 사용 |
|------|------|
| 런타임 / 패키지 | Bun |
| 프레임워크 | TanStack Start (SSR, 파일 기반 라우팅) + Nitro |
| UI | React 19, Tailwind CSS v4, shadcn/ui + Base UI |
| 애니메이션 | Motion |
| 지도 | Leaflet + react-leaflet |
| 차트 | Recharts |
| 백엔드(미연결) | Convex, Better Auth |
| i18n | i18next (ko / en) |
| 린트·포맷 | Biome |
| 테스트 | Vitest + Testing Library |

## 시작하기

```bash
bun install
bun dev
```

http://localhost:1971 에서 확인. (`.env`에 `CONVEX_DEPLOYMENT`, `VITE_CONVEX_URL`이 있으나 현재 UI는 사용하지 않는다)

## 스크립트

```bash
bun dev           # 개발 서버 (포트 1971)
bun run build     # 프로덕션 빌드
bun run preview   # 빌드 결과 미리보기
bun run check     # Biome 린트 + 포맷 (자동 수정)
bun run typecheck # tsc --noEmit
bun test          # Vitest
```

## 프로젝트 구조

```
convex/           # Convex 스키마 + 쿼리/뮤테이션 (아직 UI 미연결)
src/
├── routes/       # 파일 기반 라우트 (위 화면 표 참고)
├── components/
│   ├── ui/       # shadcn/ui 컴포넌트
│   ├── farms/    # FarmDiscoveryMap, OrchardPicker
│   └── admin/    # CustomerActionCenter, 차트
├── data/         # 목 데이터 (farms, tree-details, customers)
├── lib/          # localStorage 스토어(분양·고객), i18n, axios, utils
├── hooks/        # useHaptics, useTheme, useDateFormat, useMobile
├── providers/    # Theme / I18n / Motion / Haptics / Convex(스텁)
└── i18n/locales/ # ko.json, en.json
```

경로 별칭은 `#/*` → `./src/*` (package.json `imports`).

## 문서

- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) — 데이터 흐름, 도메인 모델, Convex 연결 시 해야 할 일

## 라이선스

MIT
