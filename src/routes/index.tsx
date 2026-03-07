import { createFileRoute, Link } from '@tanstack/react-router';
import { LayoutGrid, Map as MapIcon, MapPin } from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { FramerCarousel } from '#/components/ui/framer-carousel';
import type { Farm } from '#/data/farms';
import { farms } from '#/data/farms';
import { cn } from '#/lib/utils';

const FarmDiscoveryMap = lazy(() => import('#/components/farms/FarmDiscoveryMap'));

type ViewMode = 'card' | 'map';

const VIEW_OPTIONS: Array<{
  value: ViewMode;
  label: string;
  icon: typeof LayoutGrid;
}> = [
  { value: 'card', label: '카드뷰', icon: LayoutGrid },
  { value: 'map', label: '맵뷰', icon: MapIcon },
];

const currencyFormatter = new Intl.NumberFormat('ko-KR');
const BANNER_ITEMS = [
  {
    id: 'banner-farm',
    title: '제주 햇살 농장 분양 접수 중',
    description: '이번 달 분양 가능 수량이 가장 많은 농장입니다.',
    image: farms[0]?.image,
    cta: '제휴 농장 보기',
    to: '/farms' as const,
  },
  {
    id: 'banner-map',
    title: '지역별 농장 위치를 지도에서 바로 확인',
    description: '거리와 이동 동선을 기준으로 농장을 비교할 수 있습니다.',
    image: farms[4]?.image ?? farms[0]?.image,
    cta: '맵뷰로 보기',
    to: '/' as const,
    viewMode: 'map' as ViewMode,
  },
  {
    id: 'banner-my',
    title: '분양 후에는 마이트리에서 성장 기록을 확인',
    description: '수확 일정과 관리 이력을 한 곳에서 볼 수 있습니다.',
    image: farms[3]?.image ?? farms[0]?.image,
    cta: '마이트리 보기',
    to: '/my' as const,
  },
] satisfies Array<{
  id: string;
  title: string;
  description: string;
  image?: string;
  cta: string;
  to: '/' | '/farms' | '/my';
  viewMode?: ViewMode;
}>;

export const Route = createFileRoute('/')({
  component: FarmsPage,
});

function FarmsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?._id ?? '');

  const selectedFarm = farms.find((farm) => farm._id === selectedFarmId) ?? farms[0];

  return (
    <main className="page-wrap py-8">
      <FramerCarousel
        items={BANNER_ITEMS}
        renderAction={(item) =>
          item.viewMode ? (
            <button
              type="button"
              onClick={() => setViewMode(item.viewMode)}
              className="inline-flex h-9 w-fit items-center rounded-md border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {item.cta}
            </button>
          ) : (
            <Link
              to={item.to}
              className="inline-flex h-9 w-fit items-center rounded-md border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              {item.cta}
            </Link>
          )
        }
      />

      <section className="border-b border-border pb-4">
        <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">농장 둘러보기</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              등록된 농장 {farms.length}곳을 카드뷰와 맵뷰로 전환해서 볼 수 있습니다.
            </p>
          </div>

          <div
            className="inline-flex w-full rounded-lg border border-border p-1 md:w-auto"
            role="tablist"
            aria-label="농장 보기 방식"
          >
            {VIEW_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = viewMode === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setViewMode(option.value)}
                  className={cn(
                    'flex flex-1 items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors md:min-w-28',
                    isActive
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {viewMode === 'card' ? (
        <section className="pt-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {farms.map((farm) => (
              <FarmCard key={farm._id} farm={farm} />
            ))}
          </div>
        </section>
      ) : (
        <section className="pt-6">
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              <Suspense fallback={<MapLoadingPlaceholder />}>
                <FarmDiscoveryMap
                  farms={farms}
                  selectedFarmId={selectedFarm._id}
                  onSelectFarm={setSelectedFarmId}
                />
              </Suspense>
            </div>

            <div className="space-y-4">
              <FarmSummary farm={selectedFarm} />

              <div className="overflow-hidden rounded-lg border border-border bg-card">
                <ul className="divide-y divide-border">
                  {farms.map((farm) => {
                    const representativeTree = farm.trees[0];
                    const isSelected = farm._id === selectedFarm._id;

                    return (
                      <li key={farm._id}>
                        <button
                          type="button"
                          onClick={() => setSelectedFarmId(farm._id)}
                          aria-pressed={isSelected}
                          className={cn(
                            'flex w-full items-start gap-3 px-4 py-3 text-left transition-colors',
                            isSelected ? 'bg-muted' : 'hover:bg-muted/60'
                          )}
                        >
                          <img
                            src={farm.image}
                            alt={farm.name}
                            className="h-14 w-14 rounded-md object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start justify-between gap-3">
                              <p className="font-medium text-foreground">{farm.name}</p>
                              <span className="text-xs text-muted-foreground">
                                {farm.stats.availableTrees}그루
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
                              {farm.location.address}
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">
                              {representativeTree?.variety ?? '나무'} · {farm.stats.totalTrees}그루
                              운영
                            </p>
                          </div>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

function FarmCard({ farm }: { farm: Farm }) {
  const representativeTree = farm.trees[0];

  return (
    <Link
      to="/farms/$farmId"
      params={{ farmId: farm._id }}
      className="block overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-foreground/20"
    >
      <div className="aspect-[4/3] overflow-hidden border-b border-border bg-muted">
        <img src={farm.image} alt={farm.name} className="h-full w-full object-cover" />
      </div>

      <div className="p-4">
        <div>
          <h2 className="text-lg font-semibold text-foreground">{farm.name}</h2>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{farm.location.address}</span>
          </p>
        </div>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-muted-foreground">
          {farm.description}
        </p>

        <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-border pt-4 text-sm">
          <div>
            <dt className="text-muted-foreground">대표 품종</dt>
            <dd className="mt-1 font-medium text-foreground">
              {representativeTree?.variety ?? '-'}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">분양 가능</dt>
            <dd className="mt-1 font-medium text-foreground">{farm.stats.availableTrees}그루</dd>
          </div>
          <div>
            <dt className="text-muted-foreground">대표 분양가</dt>
            <dd className="mt-1 font-medium text-foreground">
              {formatPrice(representativeTree?.price.adoptionFee)}
            </dd>
          </div>
          <div>
            <dt className="text-muted-foreground">편의시설</dt>
            <dd className="mt-1 line-clamp-1 font-medium text-foreground">
              {farm.facilities.join(', ')}
            </dd>
          </div>
        </dl>
      </div>
    </Link>
  );
}

function FarmSummary({ farm }: { farm: Farm }) {
  const representativeTree = farm.trees[0];

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <p className="text-base font-semibold text-foreground">{farm.name}</p>
      <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
        <MapPin className="h-4 w-4" />
        <span>{farm.location.address}</span>
      </p>

      <p className="mt-3 text-sm leading-6 text-muted-foreground">{farm.description}</p>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt className="text-muted-foreground">대표 품종</dt>
          <dd className="mt-1 font-medium text-foreground">{representativeTree?.variety ?? '-'}</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">분양 가능</dt>
          <dd className="mt-1 font-medium text-foreground">{farm.stats.availableTrees}그루</dd>
        </div>
        <div>
          <dt className="text-muted-foreground">대표 분양가</dt>
          <dd className="mt-1 font-medium text-foreground">
            {formatPrice(representativeTree?.price.adoptionFee)}
          </dd>
        </div>
        <div>
          <dt className="text-muted-foreground">편의시설</dt>
          <dd className="mt-1 line-clamp-2 font-medium text-foreground">
            {farm.facilities.join(', ')}
          </dd>
        </div>
      </dl>

      <Link
        to="/farms/$farmId"
        params={{ farmId: farm._id }}
        className="mt-4 inline-flex h-9 items-center rounded-md border border-border px-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
      >
        상세 보기
      </Link>
    </div>
  );
}

function MapLoadingPlaceholder() {
  return (
    <div className="flex h-[420px] w-full items-center justify-center bg-muted/30 md:h-[560px]">
      <p className="text-sm text-muted-foreground">지도를 불러오는 중입니다.</p>
    </div>
  );
}

function formatPrice(value?: number) {
  if (!value) {
    return '-';
  }

  return `${currencyFormatter.format(value)}원`;
}
