import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  Leaf,
  MapPin,
  Medal,
  Phone,
  Star,
  TreePine,
} from 'lucide-react';
import { domAnimation, LazyMotion, m } from 'motion/react';
import { lazy, Suspense } from 'react';
import { buttonVariants } from '#/components/ui/button';
import { FeatureWithImageCarousel } from '#/components/ui/feature-with-image-carousel';
import { getFarmById } from '#/data/farms';
import { useMyTreeAdoptions } from '#/lib/my-tree-adoptions';

const FEATURED_FARM_ID = 'farm_1';
const currencyFormatter = new Intl.NumberFormat('ko-KR');
const FarmDiscoveryMap = lazy(() => import('#/components/farms/FarmDiscoveryMap'));
const HOMEPAGE_IMAGES = {
  hero: '/citrus-landscape.png',
  grower: '/citrus-tree.png',
  harvest: '/citrus-harvest.png',
} as const;

const PROCESS_STEPS = [
  {
    title: '상담 및 안내',
    description: '분양 가능한 나무 상태와 예상 수확 시기, 방문 일정을 먼저 안내해 드립니다.',
    icon: Phone,
  },
  {
    title: '나무 선택',
    description: '남은 구역을 비교하며 수세와 예상 수확량을 보고 마음에 드는 나무를 고릅니다.',
    icon: TreePine,
  },
  {
    title: '분양 신청',
    description: '선택한 나무를 예약하고 분양비 결제를 마치면 내 나무로 확정됩니다.',
    icon: CreditCard,
  },
  {
    title: '관리 및 수확',
    description: '계절별 생육 소식과 수확 안내를 받아보고, 시즌이 오면 직접 수확을 경험합니다.',
    icon: CheckCircle2,
  },
] as const;

const BRAND_METRICS = [
  { label: '이번 시즌 분양 가능', valueKey: 'available' },
  { label: '대표 품종', valueKey: 'variety' },
  { label: '대표 나무 예상 수확', valueKey: 'yield' },
] as const;

const FARMER_HIGHLIGHTS = [
  {
    title: '재배 철학',
    description: '당도만이 아니라 향, 과형, 수세까지 보고 분양 가능한 나무를 직접 선별합니다.',
    icon: Leaf,
  },
  {
    title: '운영 신뢰',
    description: '분양 후에도 생육 사진, 방문 가능일, 수확 시기를 농장에서 직접 안내합니다.',
    icon: Medal,
  },
  {
    title: '브랜드 경험',
    description: '분양에서 끝나지 않도록 농장 방문과 수확 경험까지 자연스럽게 이어지게 운영합니다.',
    icon: Star,
  },
] as const;

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const myAdoptions = useMyTreeAdoptions();
  const adoptedTreeIds = new Set(myAdoptions.map((adoption) => adoption.treeId));
  const farm = getFarmById(FEATURED_FARM_ID, adoptedTreeIds);
  const availableTrees = farm.trees.filter((tree) => tree.status === 'available');
  const heroTree = availableTrees[0] ?? farm.trees[0];
  const showcaseTrees =
    availableTrees.length > 0 ? availableTrees.slice(0, 3) : farm.trees.slice(0, 3);
  const portfolioSlides = [
    {
      eyebrow: '대표 농장 전경',
      title: `${farm.name}의 오전 풍경`,
      description:
        '제주 햇살과 바람을 받는 실제 재배 환경입니다. 처음 보는 순간부터 농장의 분위기와 관리 상태를 확인할 수 있습니다.',
      image: farm.image,
      alt: `${farm.name} 전경`,
    },
    {
      eyebrow: '대표 천혜향',
      title: `${heroTree?.treeNumber ?? '대표'} ${heroTree?.variety ?? '천혜향'} 컨디션`,
      description: `현재 분양 안내 중인 대표 나무입니다. 예상 수확량 ${heroTree?.estimatedYield ?? 0}kg를 기준으로 비교할 수 있고, 분양 후에는 계절별 생육 소식도 받아보실 수 있습니다.`,
      image: heroTree?.image ?? farm.image,
      alt: `${heroTree?.variety ?? '천혜향'} 대표 나무`,
    },
    ...showcaseTrees.slice(1).map((tree) => ({
      eyebrow: '선택 가능한 구역',
      title: `${tree.treeNumber} 자리의 현재 상태`,
      description: `${tree.age}년생 ${tree.variety} 나무로, 구역 분위기와 과실 컨디션을 함께 확인하고 선택할 수 있습니다.`,
      image: tree.image,
      alt: `${tree.treeNumber} ${tree.variety} 나무`,
    })),
  ];

  return (
    <LazyMotion features={domAnimation}>
      <main className="pb-16">
        <section className="border-b border-border bg-muted/30">
          <div className="page-wrap grid gap-8 py-8 md:py-12 lg:grid-cols-2 lg:items-center">
            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="order-2 lg:order-1"
            >
              <h1 className="text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl lg:text-5xl">
                제주에서 키운 천혜향,
                <br className="hidden sm:block" />
                우리 가족 이름으로 한 그루
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                제주 햇살 농장은 향이 또렷하고 당산비가 안정된 천혜향만 골라 분양합니다.
                <br className="hidden sm:block" />
                나무 선택부터 생육 소식, 수확 시기 안내까지 농장이 직접 챙깁니다.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/farms/$farmId"
                  params={{ farmId: farm._id }}
                  hash="orchard-picker"
                  className={buttonVariants({
                    className: 'h-12 rounded-full px-6 text-lg font-semibold',
                  })}
                >
                  분양 가능한 나무 보기
                  <span className="pl-2">
                    <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
                <Link
                  to="/"
                  hash="process"
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'h-12 rounded-full px-6 text-sm font-semibold',
                  })}
                >
                  분양 절차 보기
                </Link>
              </div>

              <Link
                to="/about"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                품종과 재배 기준 확인하기
                <ArrowRight className="h-4 w-4" />
              </Link>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {BRAND_METRICS.map((stat, index) => (
                  <m.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.12 + index * 0.08 }}
                    className="rounded-3xl border border-border bg-card p-4 shadow-sm"
                  >
                    <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-2xl font-semibold text-foreground">
                      {stat.valueKey === 'available' && `${farm.stats.availableTrees}그루`}
                      {stat.valueKey === 'variety' && (heroTree?.variety ?? '-')}
                      {stat.valueKey === 'yield' && `${heroTree?.estimatedYield ?? 0}kg`}
                    </p>
                  </m.div>
                ))}
              </div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="order-1 lg:order-2"
            >
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
                <img
                  src={HOMEPAGE_IMAGES.hero}
                  alt={farm.name}
                  className="h-[420px] w-full object-cover sm:h-[520px]"
                  loading="eager"
                  decoding="async"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                <div className="absolute left-5 top-5 rounded-3xl border border-border bg-background/95 px-5 py-4 shadow-md backdrop-blur">
                  <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                    Signature orchard
                  </p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{farm.name}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {farm.location.address}
                  </p>
                </div>

                <div className="absolute inset-x-5 bottom-5 grid gap-3 sm:grid-cols-2">
                  <div className="hidden rounded-3xl bg-transparent p-5 sm:block" />

                  <div className="rounded-3xl bg-foreground/92 p-5 text-background shadow-md backdrop-blur">
                    <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-background/70 uppercase">
                      <CalendarDays className="h-4 w-4" />
                      분양 후 운영 안내
                    </p>
                    <p className="mt-2 text-lg font-semibold">생육 소식부터 수확 안내까지</p>
                    <p className="mt-2 text-sm leading-6 text-background/75">
                      분양 후에도 생육 사진과 수확 시기를 꾸준히 안내해 드려, 기다리는 시간까지
                      즐거운 경험이 되도록 운영합니다.
                    </p>
                  </div>
                </div>
              </div>
            </m.div>
          </div>
        </section>

        <section className="bg-primary py-8 text-primary-foreground">
          <div className="page-wrap grid gap-6 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold tracking-[0.22em] text-primary-foreground/75 uppercase">
                Season offer
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-balance">
                한 번 맛보면 다시 찾는 천혜향,
                <br className="hidden sm:block" />
                이번 시즌 분양을 시작합니다
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-primary-foreground/90 sm:text-base">
                {farm.description}
                <br className="hidden sm:block" />
                지금 분양하시면 나무 선택부터 수확 시즌 안내까지 농장이 직접 관리합니다.
              </p>
            </div>

            <div className="rounded-3xl bg-background p-7 text-foreground shadow-lg">
              <p className="text-sm font-semibold tracking-[0.16em] text-primary uppercase">
                Why now
              </p>
              <p className="mt-3 text-2xl font-semibold leading-8">좋은 자리는 먼저 나갑니다</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                천혜향은 나무마다 수세와 위치가 조금씩 다릅니다.
                <br className="hidden sm:block" />
                먼저 고를수록 선택 폭이 넓고, 좋은 자리를 잡을 가능성도 높습니다.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/farms/$farmId"
                  params={{ farmId: farm._id }}
                  hash="orchard-picker"
                  className={buttonVariants({
                    className: 'h-11 rounded-full px-5 text-sm font-semibold',
                  })}
                >
                  남은 구역 확인하기
                </Link>
                <Link
                  to="/"
                  hash="grower"
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'h-11 rounded-full px-5 text-sm font-semibold',
                  })}
                >
                  농부 이야기 보기
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="grower" className="py-16">
          <div className="page-wrap grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_380px]">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Grower profile
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground text-balance">
                누가, 어떻게 키우는지 알수록
                <br className="hidden sm:block" />더 안심되는 분양
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                제주 햇살 농장은 보기 좋은 사진보다 실제 재배 기준을 먼저 보여드립니다.
                <br className="hidden sm:block" />
                어떤 나무를 분양 가능한 상태로 판단하는지, 수확 시즌까지 어떻게 관리하는지 직접
                설명드리는 것이 이 농장의 방식입니다.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {FARMER_HIGHLIGHTS.map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="rounded-2xl border border-border bg-muted/30 p-4"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/12 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-foreground">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
                <img
                  src={HOMEPAGE_IMAGES.grower}
                  alt="천혜향 나무를 살피는 제주 농장 풍경"
                  className="h-64 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                  <p className="text-xs font-semibold tracking-[0.16em] uppercase text-white/70">
                    Farmer&apos;s eye
                  </p>
                  <p className="mt-2 text-xl font-semibold">
                    분양 전에 먼저 확인하는 건 사진보다 나무 컨디션입니다
                  </p>
                </div>
              </div>

              <div className="rounded-3xl bg-foreground p-6 text-background shadow-sm">
                <p className="text-sm font-semibold tracking-[0.18em] text-background/60 uppercase">
                  Why choose us
                </p>
                <blockquote className="mt-4 text-2xl leading-9 font-semibold">
                  “과일만 보내는 게 아니라,
                  <br className="hidden sm:block" />한 시즌의 기대까지 함께 보냅니다.”
                </blockquote>
                <p className="mt-6 text-sm leading-6 text-background/75">
                  분양은 결국 사람을 믿고 맡기는 일입니다. 그래서 이 농장은 나무보다 먼저 운영
                  기준을 보여드립니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="process" className="bg-muted/30 py-16">
          <div className="page-wrap">
            <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start">
              <div>
                <p className="text-sm font-semibold tracking-[0.2em] text-muted-foreground uppercase">
                  Process
                </p>
                <h2 className="mt-4 text-4xl font-semibold tracking-tight text-foreground">
                  분양신청절차
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground">
                  처음 신청하셔도 어렵지 않게,
                  <br className="hidden sm:block" />
                  상담부터 수확 안내까지 한 흐름으로 이어집니다.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {PROCESS_STEPS.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <m.article
                      key={step.title}
                      initial={{ opacity: 0, y: 18 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.35 }}
                      transition={{ delay: index * 0.08 }}
                      className="relative rounded-3xl border border-border bg-card px-6 pb-7 pt-12 text-center shadow-sm"
                    >
                      <div className="absolute left-1/2 top-0 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-foreground text-background text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-muted text-primary">
                        <Icon className="h-10 w-10" />
                      </div>
                      <h3 className="mt-5 text-xl font-semibold text-foreground">{step.title}</h3>
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">
                        {step.description}
                      </p>
                    </m.article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="story" className="py-16">
          <div className="page-wrap grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_240px]">
                <div>
                  <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                    Brand story
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground text-balance">
                    향과 당도,
                    <br className="hidden sm:block" />
                    방문 경험까지 기억에 남는 천혜향
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                    {farm.description}
                    <br className="hidden sm:block" />
                    나무를 고르는 순간부터 수확을 기다리는 시간까지, 농장 소식과 방문 정보를 꾸준히
                    전해드립니다.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {farm.facilities.map((facility) => (
                      <div
                        key={facility}
                        className="rounded-2xl border border-border bg-muted/40 px-4 py-4"
                      >
                        <p className="text-sm font-semibold text-foreground">{facility}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          방문객이 편하게 머물 수 있도록 기본 편의 공간을 준비했습니다.
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl bg-foreground p-5 text-background">
                  <p className="text-xs font-semibold tracking-[0.16em] text-background/60 uppercase">
                    Quick facts
                  </p>
                  <dl className="mt-5 space-y-5">
                    <div>
                      <dt className="text-sm text-background/60">재배지</dt>
                      <dd className="mt-1 text-lg font-semibold">{farm.location.address}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-background/60">운영 규모</dt>
                      <dd className="mt-1 text-lg font-semibold">{farm.stats.totalTrees}그루</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-background/60">주력 품종</dt>
                      <dd className="mt-1 text-lg font-semibold">{heroTree?.variety ?? '-'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border bg-muted/30 shadow-sm">
              <div className="relative">
                <img
                  src={HOMEPAGE_IMAGES.harvest}
                  alt="수확한 천혜향을 담은 장면"
                  className="h-52 w-full object-cover"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute left-5 bottom-5 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-foreground">
                  Harvest season
                </div>
              </div>

              <div className="p-6">
                <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Contact
                </p>
                <h3 className="mt-4 text-2xl font-semibold text-foreground text-balance">
                  궁금한 점은
                  <br className="hidden sm:block" />
                  농부에게 바로 물어보세요
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  분양 시기, 남은 자리, 방문 일정이 궁금하시면 바로 문의하세요.
                  <br className="hidden sm:block" />
                  나무 상태를 설명드리고, 맞는 자리를 함께 골라드립니다.
                </p>

                <div className="mt-6 rounded-3xl border border-border bg-card p-5">
                  <div className="flex items-center gap-3 text-foreground">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="text-lg font-semibold">063-000-0000</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">평일 09:00 - 18:00 상담 가능</p>
                </div>

                <Link
                  to="/my"
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'mt-5 h-11 w-full rounded-full text-sm font-semibold',
                  })}
                >
                  내 분양 현황 보기
                </Link>
              </div>
            </div>
          </div>
        </section>

        <FeatureWithImageCarousel
          badge="Season highlight"
          title="사진으로 먼저 확인하는 제주 햇살 농장"
          description="천혜향은 말보다 상태가 먼저 믿음을 줍니다. 농장 전경, 과실 컨디션, 남은 구역 분위기를 슬라이드로 확인해 보세요."
          slides={portfolioSlides}
        />

        <section id="location" className="bg-muted/30 py-16">
          <div className="page-wrap grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Orchard location
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground text-balance">
                지도로 먼저 확인하는
                <br className="hidden sm:block" />
                실제 농장 위치
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                제주 서귀포 안덕면에서 실제로 운영 중인 농장입니다.
                <br className="hidden sm:block" />
                온라인으로 고른 뒤 일정에 맞춰 직접 방문하실 수 있습니다.
              </p>

              <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-4">
                <p className="text-sm font-semibold text-foreground">{farm.name}</p>
                <p className="mt-2 flex items-start gap-2 text-sm text-muted-foreground">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span>{farm.location.address}</span>
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/farms/$farmId"
                  params={{ farmId: farm._id }}
                  className={buttonVariants({
                    className: 'h-11 rounded-full px-5 text-sm font-semibold',
                  })}
                >
                  농장 상세 보기
                </Link>
                <Link
                  to="/farms/$farmId"
                  params={{ farmId: farm._id }}
                  hash="available-trees"
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'h-11 rounded-full px-5 text-sm font-semibold',
                  })}
                >
                  남은 나무 보기
                </Link>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <Suspense fallback={<MapLoadingPlaceholder />}>
                <FarmDiscoveryMap
                  farms={[farm]}
                  selectedFarmId={farm._id}
                  onSelectFarm={() => {}}
                />
              </Suspense>
            </div>
          </div>
        </section>

        <section id="adoption" className="pb-8">
          <div className="page-wrap">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  Season selection
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground text-balance">
                  이번 시즌 바로 선택 가능한
                  <br className="hidden sm:block" />
                  천혜향 나무
                </h2>
              </div>
              <Link
                to="/farms/$farmId"
                params={{ farmId: farm._id }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                전체 분양 나무 보기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-3">
              {showcaseTrees.map((tree, index) => (
                <m.article
                  key={tree._id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{ delay: index * 0.08 }}
                  className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm"
                >
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <img
                      src={tree.image}
                      alt={`${tree.variety} ${tree.treeNumber}`}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.04]"
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">{tree.treeNumber}</p>
                        <h3 className="mt-1 text-2xl font-semibold text-foreground">
                          {tree.variety}
                        </h3>
                      </div>
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                        {tree.age}년생
                      </span>
                    </div>

                    <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-muted/40 p-3">
                        <dt className="text-muted-foreground">예상 수확량</dt>
                        <dd className="mt-1 font-semibold text-foreground">
                          {tree.estimatedYield}kg
                        </dd>
                      </div>
                      <div className="rounded-2xl bg-muted/40 p-3">
                        <dt className="text-muted-foreground">분양가</dt>
                        <dd className="mt-1 font-semibold text-foreground">
                          {formatPrice(tree.price.adoptionFee)}
                        </dd>
                      </div>
                    </dl>

                    <Link
                      to="/trees/$treeId"
                      params={{ treeId: tree._id }}
                      className={buttonVariants({
                        className: 'mt-5 h-11 w-full rounded-full text-sm font-semibold',
                      })}
                    >
                      상세 보고 선택하기
                    </Link>
                  </div>
                </m.article>
              ))}
            </div>
          </div>
        </section>
      </main>
    </LazyMotion>
  );
}

function formatPrice(value?: number) {
  if (!value) {
    return '-';
  }

  return `${currencyFormatter.format(value)}원`;
}

function MapLoadingPlaceholder() {
  return (
    <div className="flex h-[420px] w-full items-center justify-center bg-muted/30 md:h-[560px]">
      <p className="text-sm text-muted-foreground">지도를 불러오는 중입니다.</p>
    </div>
  );
}
