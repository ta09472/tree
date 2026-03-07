import { createFileRoute, Link } from '@tanstack/react-router';
import { Compass, LayoutGrid, Map as MapIcon, MapPin, Sparkles, Trees } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { lazy, Suspense, startTransition, useState } from 'react';
import { Button, buttonVariants } from '#/components/ui/button';
import type { Farm } from '#/data/farms';
import { farms } from '#/data/farms';
import { cn } from '#/lib/utils';

const FarmDiscoveryMap = lazy(() => import('#/components/farms/FarmDiscoveryMap'));

type ViewMode = 'card' | 'map';

const VIEW_OPTIONS: Array<{
  value: ViewMode;
  label: string;
  description: string;
  icon: typeof LayoutGrid;
}> = [
  {
    value: 'card',
    label: '카드뷰',
    description: '사진과 소개를 빠르게 비교',
    icon: LayoutGrid,
  },
  {
    value: 'map',
    label: '맵뷰',
    description: '위치 중심으로 농장 탐색',
    icon: MapIcon,
  },
];

export const Route = createFileRoute('/farms/')({
  component: FarmsPage,
});

function FarmsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [selectedFarmId, setSelectedFarmId] = useState(farms[0]?._id ?? '');
  const selectedFarm = farms.find((farm) => farm._id === selectedFarmId) ?? farms[0];
  const totalAvailableTrees = farms.reduce((sum, farm) => sum + farm.stats.availableTrees, 0);
  const totalTrees = farms.reduce((sum, farm) => sum + farm.stats.totalTrees, 0);

  const handleViewChange = (nextView: ViewMode) => {
    startTransition(() => {
      setViewMode(nextView);
    });
  };

  const handleFarmSelect = (farmId: string) => {
    startTransition(() => {
      setSelectedFarmId(farmId);
    });
  };

  return (
    <main className="page-wrap px-4 pb-10 pt-8">
      <section className="relative overflow-hidden rounded-[32px] border border-border/70 bg-[linear-gradient(135deg,color-mix(in_oklab,var(--background)_78%,white),color-mix(in_oklab,var(--primary)_12%,var(--background))_55%,color-mix(in_oklab,var(--background)_84%,white))] px-5 py-6 shadow-sm sm:px-8 sm:py-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(245,158,11,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(34,197,94,0.12),transparent_35%)]" />

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative"
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-border/70 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur">
            <Compass className="h-3.5 w-3.5 text-primary" />
            원하는 방식으로 농장을 고르세요
          </div>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                카드로 훑어보거나, 지도에서 바로 찾는 농장 탐색
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
                사진 중심 카드뷰와 위치 중심 맵뷰를 오가며 내 취향과 이동 동선에 맞는 분양 농장을
                골라보세요.
              </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
              {VIEW_OPTIONS.map((option) => {
                const Icon = option.icon;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleViewChange(option.value)}
                    aria-pressed={viewMode === option.value}
                    className={cn(
                      'min-w-[180px] rounded-[24px] border px-4 py-3 text-left transition-all',
                      viewMode === option.value
                        ? 'border-primary/40 bg-foreground text-background shadow-lg shadow-primary/10'
                        : 'border-border/70 bg-background/80 text-foreground hover:border-primary/30 hover:bg-background'
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      <span className="font-semibold">{option.label}</span>
                    </div>
                    <p
                      className={cn(
                        'mt-1 text-xs',
                        viewMode === option.value ? 'text-background/75' : 'text-muted-foreground'
                      )}
                    >
                      {option.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: '등록 농장', value: `${farms.length}곳` },
              { label: '지금 분양 중', value: `${totalAvailableTrees}그루` },
              { label: '관리 중인 전체 나무', value: `${totalTrees}그루` },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.08 }}
                className="rounded-[24px] border border-border/70 bg-background/75 p-4 backdrop-blur"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">{stat.value}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      <AnimatePresence mode="wait">
        {viewMode === 'card' ? (
          <motion.section
            key="card-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">제휴 농장 카드뷰</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  사진, 소개, 편의시설을 한 번에 비교할 수 있습니다.
                </p>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground md:inline-flex">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                호버하면 사진이 확대됩니다
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {farms.map((farm, index) => (
                <FarmCard key={farm._id} farm={farm} index={index} />
              ))}
            </div>
          </motion.section>
        ) : (
          <motion.section
            key="map-view"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="mt-8"
          >
            <div className="mb-5 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">제휴 농장 맵뷰</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  마커를 눌러 지역별 농장을 고르고, 오른쪽 패널에서 바로 비교하세요.
                </p>
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs text-muted-foreground md:inline-flex">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                마커 숫자는 현재 분양 가능한 나무 수입니다
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_360px]">
              <div className="overflow-hidden rounded-[32px] border border-border bg-card shadow-sm">
                <div className="relative">
                  <Suspense fallback={<MapLoadingPlaceholder />}>
                    <FarmDiscoveryMap
                      farms={farms}
                      selectedFarmId={selectedFarm._id}
                      onSelectFarm={handleFarmSelect}
                    />
                  </Suspense>

                  <div className="pointer-events-none absolute left-4 top-4 z-[400] max-w-[220px] rounded-2xl border border-white/60 bg-background/88 px-4 py-3 shadow-lg backdrop-blur">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                      선택된 지역
                    </p>
                    <p className="mt-1 text-base font-semibold text-foreground">
                      {selectedFarm.location.address}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {selectedFarm.name} · {selectedFarm.stats.availableTrees}그루 분양 가능
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-4">
                <div className="rounded-[28px] border border-border bg-card p-5 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    선택된 농장
                  </p>
                  <h3 className="mt-2 text-2xl font-bold text-foreground">{selectedFarm.name}</h3>
                  <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {selectedFarm.location.address}
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {selectedFarm.description}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl bg-muted/70 p-3">
                      <p className="text-xs text-muted-foreground">분양 가능</p>
                      <p className="mt-1 text-xl font-bold text-foreground">
                        {selectedFarm.stats.availableTrees}그루
                      </p>
                    </div>
                    <div className="rounded-2xl bg-muted/70 p-3">
                      <p className="text-xs text-muted-foreground">전체 운영</p>
                      <p className="mt-1 text-xl font-bold text-foreground">
                        {selectedFarm.stats.totalTrees}그루
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {selectedFarm.facilities.map((facility) => (
                      <span
                        key={facility}
                        className="rounded-full border border-border bg-background px-3 py-1 text-xs text-muted-foreground"
                      >
                        {facility}
                      </span>
                    ))}
                  </div>

                  <Link
                    to="/farms/$farmId"
                    params={{ farmId: selectedFarm._id }}
                    className={cn(buttonVariants({ size: 'lg' }), 'mt-5 flex w-full')}
                  >
                    상세 페이지 보기
                  </Link>
                </div>

                <div className="rounded-[28px] border border-border bg-card p-3 shadow-sm">
                  <div className="mb-3 flex items-center justify-between gap-3 px-2 pt-2">
                    <div>
                      <p className="text-sm font-semibold text-foreground">지도에 표시된 농장</p>
                      <p className="text-xs text-muted-foreground">
                        버튼을 눌러 중심 농장을 바꿀 수 있습니다
                      </p>
                    </div>
                    <div className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-1 text-xs text-muted-foreground">
                      <Trees className="h-3.5 w-3.5" />
                      {farms.length}곳
                    </div>
                  </div>

                  <div className="grid max-h-[420px] gap-3 overflow-y-auto px-2 pb-2">
                    {farms.map((farm) => (
                      <button
                        key={farm._id}
                        type="button"
                        onClick={() => handleFarmSelect(farm._id)}
                        aria-pressed={farm._id === selectedFarm._id}
                        className={cn(
                          'rounded-[22px] border p-3 text-left transition-all',
                          farm._id === selectedFarm._id
                            ? 'border-primary/40 bg-primary/8 shadow-sm'
                            : 'border-border hover:border-primary/30 hover:bg-muted/50'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <img
                            src={farm.image}
                            alt={farm.name}
                            className="h-16 w-16 rounded-2xl object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-3">
                              <p className="truncate font-semibold text-foreground">{farm.name}</p>
                              <span className="rounded-full bg-background px-2 py-1 text-[11px] text-muted-foreground">
                                {farm.stats.availableTrees}그루
                              </span>
                            </div>
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">{farm.location.address}</span>
                            </p>
                            <p className="mt-2 line-clamp-2 text-xs leading-5 text-muted-foreground">
                              {farm.description}
                            </p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      <section className="mt-16 text-center">
        <div className="rounded-[28px] border border-border bg-gradient-to-br from-primary/10 via-background to-secondary/80 p-8">
          <h3 className="mb-2 text-xl font-bold text-foreground">농장주이신가요?</h3>
          <p className="mx-auto mb-4 max-w-xl text-muted-foreground">
            카드뷰와 맵뷰에서 모두 돋보이도록 농장을 등록하고 새로운 고객을 만나보세요.
          </p>
          <Button size="lg">농장 등록하기</Button>
        </div>
      </section>
    </main>
  );
}

function FarmCard({ farm, index }: { farm: Farm; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
    >
      <Link
        to="/farms/$farmId"
        params={{ farmId: farm._id }}
        className="group block overflow-hidden rounded-[28px] border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10"
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={farm.image}
            alt={farm.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/45 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
            {farm.stats.availableTrees}그루 분양 가능
          </div>
        </div>

        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                {farm.name}
              </h3>
              <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                {farm.location.address}
              </div>
            </div>
            <div className="rounded-2xl bg-muted px-3 py-2 text-right">
              <p className="text-[11px] text-muted-foreground">전체 나무</p>
              <p className="text-sm font-semibold text-foreground">{farm.stats.totalTrees}그루</p>
            </div>
          </div>

          <p className="mt-4 line-clamp-3 text-sm leading-6 text-muted-foreground">
            {farm.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {farm.facilities.slice(0, 4).map((facility) => (
              <span
                key={facility}
                className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground"
              >
                {facility}
              </span>
            ))}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function MapLoadingPlaceholder() {
  return (
    <div className="flex h-[420px] w-full items-center justify-center bg-[linear-gradient(135deg,color-mix(in_oklab,var(--muted)_88%,white),color-mix(in_oklab,var(--primary)_8%,var(--muted)))] md:h-[560px]">
      <div className="rounded-[24px] border border-border/70 bg-background/85 px-5 py-4 text-center shadow-sm backdrop-blur">
        <p className="text-sm font-semibold text-foreground">지도를 불러오는 중</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Leaflet 타일과 마커를 준비하고 있습니다
        </p>
      </div>
    </div>
  );
}
