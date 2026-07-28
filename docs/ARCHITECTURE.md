# 아키텍처

## 한 줄 요약

프론트엔드는 완성돼 있고, 백엔드는 스키마까지만 있다. 화면은 `src/data/`의 목 데이터를 읽고, 사용자가 만든 상태(분양 내역, 고객 CRUD)는 localStorage에 쓴다.

## 데이터 흐름

```
src/data/*.ts (읽기 전용 목 데이터)
        │
        ├── getFarmsWithLiveAvailability(adoptedTreeIds)  ← 분양 상태 합성
        │
src/lib/my-tree-adoptions.ts   localStorage: "my-tree-adoptions"
src/lib/admin-customers.ts     localStorage: "admin-customers"
        │  useSyncExternalStore
        ▼
    라우트 컴포넌트
```

두 스토어 모두 같은 패턴이다. 모듈 스코프에 리스너 `Set`과 파싱 캐시를 두고, `useSyncExternalStore`로 구독한다. SSR에서는 `canUseDOM()` 가드로 빈 값/기본값을 반환하므로 하이드레이션이 깨지지 않는다. `JSON.parse` 결과는 타입 가드로 필터링하기 때문에 저장소가 오염돼도 죽지 않는다.

### 분양 상태 합성

목 데이터의 나무는 `status: 'available' | 'adopted'`를 갖는다. 여기에 localStorage의 분양 내역을 덮어써서 최종 상태를 만든다 — [`resolveTreeStatus`](../src/data/farms.ts). 그래서 목록·상세·지도 어디서나 분양 직후 상태가 일관되게 보인다.

```
getFarmsWithLiveAvailability(adoptedTreeIds)  # 농장 목록 + 잔여 그루 수
getFarmById(farmId, adoptedTreeIds)           # 농장 상세
```

### 스토어 API

**`src/lib/my-tree-adoptions.ts`**
- `useMyTreeAdoptions()` — 구독 훅
- `adoptTree({ treeId, farmId })` — 분양 추가 (중복 방지)
- `getTreeAdoptions()` — 스냅샷

**`src/lib/admin-customers.ts`**
- `useAdminCustomers()` — 구독 훅
- `createAdminCustomer(input)` / `updateAdminCustomer(id, updater)` / `deleteAdminCustomer(id)`
- 초기값은 `src/data/customers.ts`

## 도메인 모델 (Convex, `convex/schema.ts`)

목 데이터보다 앞서 나간 정식 스키마. 7개 테이블:

| 테이블 | 핵심 필드 | 인덱스 |
|--------|----------|--------|
| `users` | role(`user`/`farmer`/`admin`), farmId, address | by_email, by_role |
| `farms` | ownerId, location(lat/lng), facilities, images | by_owner |
| `trees` | farmId, treeNumber, variety, status(available/reserved/adopted/harvested), price 3종, 예상 수확 | by_farm, by_status, by_adoptedBy, by_farm_status |
| `adoptions` | treeId·userId·farmId, 결제(toss/transfer), 계약기간, 수령방식 | by_user, by_tree, by_status, by_user_status |
| `growthLogs` | treeId, type(photo/video/note), growthStage, weather | by_tree, by_tree_date |
| `harvests` | adoptionId, 실수확량, 배송정보(운송장) | by_adoption, by_user, by_date |
| `notifications` | userId, type, isRead | by_user, by_user_read |

가격은 나무 단위로 `adoptionFee`(분양비) / `annualManagementFee`(연 관리비) / `deliveryFeePerKg`(kg당 배송비)로 쪼개져 있다.

작성된 함수: `convex/trees/{queries,mutations}.ts`, `convex/farms/{queries,mutations}.ts`, `convex/adoptions/mutations.ts`, `convex/growthLogs/mutations.ts`.

## Convex를 실제로 붙이려면

지금 [`src/providers/ConvexProvider.tsx`](../src/providers/ConvexProvider.tsx)는 `children`만 렌더링하는 스텁이다. 연결 순서:

1. `bunx convex dev` — `convex/_generated/` 생성 (없으면 `api.*` 타입이 안 나온다)
2. `ConvexProvider`를 `convex/react`의 실제 `ConvexProvider`로 교체 (`src/lib/convex.ts`의 `convexClient` 사용)
3. 목 데이터 읽는 자리를 `useQuery(api.farms.queries.list)` 등으로 치환
4. `adoptTree` / `createAdminCustomer` 등 localStorage 쓰기를 뮤테이션으로 치환
5. `src/lib/auth.ts`의 Better Auth 설정에 Convex 클라이언트 주입 — 현재 `users` 테이블을 채우는 경로가 없다

localStorage 스토어는 그때 지우면 된다. 목 데이터(`src/data/`)는 시드 스크립트 소스로 재활용 가능하다.

## 알아둘 것

- **경로 별칭**: `#/*` → `./src/*`. `@/*`가 아니다 (shadcn 기본값과 다르니 컴포넌트 추가 후 import 확인).
- **테마 FOUC 방지**: `__root.tsx`의 `THEME_INIT_SCRIPT`가 hydration 전에 `<html>` 클래스를 세팅한다. next-themes와 함께 동작.
- **지도는 lazy**: `FarmDiscoveryMap`은 `React.lazy`로 로드한다. Leaflet이 `window`를 요구하므로 SSR에 그대로 올리면 안 된다.
- **Vite watch 제외**: `vite.config.ts`에서 `package.json`, `bun.lock`, `.output`, `.tanstack`을 감시 제외 — macOS에서 무한 리로드가 나던 문제 때문.
- **i18n은 부분 적용**: 프로바이더와 로케일 파일은 있으나 화면 문구 상당수는 한국어 하드코딩 상태.
