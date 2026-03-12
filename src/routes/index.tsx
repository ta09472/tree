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

const PROCESS_STEPS = [
  {
    title: '상담 및 안내',
    description: '분양 가능한 나무와 수확 시즌, 방문 일정을 먼저 안내해 드립니다.',
    icon: Phone,
  },
  {
    title: '나무 선택',
    description: '품종과 예상 수확량을 비교해 우리 가족에게 맞는 나무를 고릅니다.',
    icon: TreePine,
  },
  {
    title: '분양 신청',
    description: '원하는 나무를 선택한 뒤 분양비를 결제하면 신청이 완료됩니다.',
    icon: CreditCard,
  },
  {
    title: '관리 및 수확',
    description: '생육 소식과 수확 시기를 안내받고 현장에서 직접 수확을 경험합니다.',
    icon: CheckCircle2,
  },
] as const;

const BRAND_METRICS = [
  { label: '현재 분양 가능', valueKey: 'available' },
  { label: '대표 품종', valueKey: 'variety' },
  { label: '예상 수확량', valueKey: 'yield' },
] as const;

const FARMER_HIGHLIGHTS = [
  {
    title: '재배 철학',
    description: '일조량과 토양 상태를 기준으로 나무마다 관리 밀도를 다르게 가져갑니다.',
    icon: Leaf,
  },
  {
    title: '운영 신뢰',
    description: '분양 이후에도 생육 소식, 수확 일정, 방문 가능일을 직접 안내합니다.',
    icon: Medal,
  },
  {
    title: '브랜드 경험',
    description: '단순 판매가 아니라 농장 방문 경험과 농부의 기준이 함께 기억되도록 설계합니다.',
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
        '메인에서 실제 농장 전경을 먼저 보여주면, 방문자는 판매 문구보다 운영 상태를 먼저 신뢰하게 됩니다.',
      image: farm.image,
      alt: `${farm.name} 전경`,
    },
    {
      eyebrow: '대표 천혜향',
      title: `${heroTree?.treeNumber ?? '대표'} ${heroTree?.variety ?? '천혜향'} 컨디션`,
      description: `현재 소개 중인 대표 나무입니다. 예상 수확량 ${heroTree?.estimatedYield ?? 0}kg 기준으로 안내해 드리고, 분양 이후에도 생육 소식을 이어서 전달합니다.`,
      image: heroTree?.image ?? farm.image,
      alt: `${heroTree?.variety ?? '천혜향'} 대표 나무`,
    },
    ...showcaseTrees.slice(1).map((tree) => ({
      eyebrow: '선택 가능한 구역',
      title: `${tree.treeNumber} 자리의 현재 상태`,
      description: `${tree.age}년생 ${tree.variety} 나무입니다. 메인에서도 남은 구역 분위기와 과실 컨디션을 한눈에 파악할 수 있게 구성했습니다.`,
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
              <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                햇살 농장의 천혜향
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                여러 업체를 비교하는 장터가 아니라, 농부가 자신의 재배 철학과 운영 기준을 직접
                소개하고 그 신뢰를 바탕으로 천혜향나무를 분양하는 브랜드형 메인입니다. 누구의
                농장인지, 어떻게 키우는지, 왜 믿을 수 있는지가 먼저 보이도록 구성했습니다.
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
                  천혜향나무 분양 신청
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
                  가격 보기
                </Link>
              </div>

              <Link
                to="/about"
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                천혜향 품종·재배안내 보기
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
                  src={farm.image}
                  alt={farm.name}
                  className="h-[420px] w-full object-cover sm:h-[520px]"
                  loading="eager"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />

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
                  <div className="rounded-3xl  bg-transparent p-5 "></div>

                  <div className="rounded-3xl bg-foreground/92 p-5 text-background shadow-md backdrop-blur">
                    <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-background/70 uppercase">
                      <CalendarDays className="h-4 w-4" />
                      운영 약속
                    </p>
                    <p className="mt-2 text-lg font-semibold">생육 소식부터 수확 일정까지</p>
                    <p className="mt-2 text-sm leading-6 text-background/75">
                      판매만 끝나는 구조가 아니라, 분양 이후 경험까지 책임지는 농장 운영 방식을
                      메인에서 분명하게 전달합니다.
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
                Orchard message
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">
                농장을 소개하고, 기준을 설득하고, 그다음에 판매합니다
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-primary-foreground/90 sm:text-base">
                {farm.description} 이 메인은 상품 리스트보다 농부의 얼굴과 기준이 먼저 보이도록
                설계했습니다. 방문자는 천혜향을 사기 전에 어떤 사람의 농장을 선택하는지부터 이해하게
                됩니다.
              </p>
            </div>

            <div className="rounded-3xl bg-background p-7 text-foreground shadow-lg">
              <p className="text-sm font-semibold tracking-[0.16em] text-primary uppercase">
                Farmer note
              </p>
              <p className="mt-3 text-2xl font-semibold leading-8">
                좋은 천혜향은 좋은 소개에서 시작됩니다
              </p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                생산자 PR이 약하면 가격 경쟁만 남습니다. 그래서 이 화면은 농장 소개, 관리 기준, 분양
                유도까지 한 흐름으로 이어지도록 잡았습니다.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to="/farms/$farmId"
                  params={{ farmId: farm._id }}
                  className={buttonVariants({
                    className: 'h-11 rounded-full px-5 text-sm font-semibold',
                  })}
                >
                  분양신청 GO
                </Link>
                <Link
                  to="/"
                  hash="grower"
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'h-11 rounded-full px-5 text-sm font-semibold',
                  })}
                >
                  농부 소개 보기
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
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                농부 소개가 곧 이 농장의 경쟁력입니다
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                제주 햇살 농장은 천혜향을 단순히 판매하지 않습니다. 어떤 기준으로 나무를 선별하고,
                어떤 관리 루틴으로 품질을 유지하는지까지 함께 보여줍니다. 방문자가 분양을 결정하는
                이유가 가격이 아니라 생산자의 기준이 되도록 메인을 설계했습니다.
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

            <div className="rounded-3xl bg-foreground p-6 text-background shadow-sm">
              <p className="text-sm font-semibold tracking-[0.18em] text-background/60 uppercase">
                Self PR point
              </p>
              <blockquote className="mt-4 text-2xl leading-9 font-semibold">
                “좋은 과일을 파는 것보다,
                <br />
                어떻게 키웠는지 설명할 수 있는 농장이 오래 갑니다.”
              </blockquote>
              <p className="mt-6 text-sm leading-6 text-background/75">
                메인에서 이 메시지를 먼저 주면, 방문자는 상품 페이지에 들어가기 전부터 이 농장의
                운영 태도와 신뢰도를 인지하게 됩니다.
              </p>
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
                  자기 PR이 되는 사이트여야 하므로, 신청 절차도 단순 안내가 아니라 운영 방식의
                  신뢰를 보여주는 흐름으로 정리했습니다.
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
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                    천혜향을 어떻게 키우는지까지 보이는 브랜드 소개
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                    {farm.description} 분양 후에는 단순 결제 내역만 남는 것이 아니라, 수확 시기와
                    관리 상황을 지속적으로 확인할 수 있도록 운영합니다. 즉, 이 섹션은 “농장이 무엇을
                    파는가”보다 “어떤 운영자와 기준을 선택하는가”를 보여주는 용도입니다.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {farm.facilities.map((facility) => (
                      <div
                        key={facility}
                        className="rounded-2xl border border-border bg-muted/40 px-4 py-4"
                      >
                        <p className="text-sm font-semibold text-foreground">{facility}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          방문 고객 경험까지 고려한 운영 포인트를 메인에서 바로 보여줍니다.
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
                      <dt className="text-sm text-background/60">주소</dt>
                      <dd className="mt-1 text-lg font-semibold">{farm.location.address}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-background/60">운영 나무</dt>
                      <dd className="mt-1 text-lg font-semibold">{farm.stats.totalTrees}그루</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-background/60">대표 품종</dt>
                      <dd className="mt-1 text-lg font-semibold">{heroTree?.variety ?? '-'}</dd>
                    </div>
                  </dl>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-muted/30 p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Contact
              </p>
              <h3 className="mt-4 text-2xl font-semibold text-foreground">농부에게 직접 문의</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                상담 후 원하는 나무를 함께 정리해 드립니다. 판매 문의이면서 동시에 농장의 운영
                철학을 확인하는 접점이 되도록 구성했습니다.
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
                내 분양 나무 보기
              </Link>
            </div>
          </div>
        </section>

        <FeatureWithImageCarousel
          badge="Farm portfolio"
          title="글보다 먼저 신뢰를 만드는 농장 캐러셀"
          slides={portfolioSlides}
        />

        <section id="location" className="bg-muted/30 py-16">
          <div className="page-wrap grid gap-6 lg:grid-cols-[360px_minmax(0,1fr)] lg:items-start">
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
              <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Orchard location
              </p>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                실제 위치가 보이는 농장 소개
              </h2>
              <p className="mt-4 text-sm leading-7 text-muted-foreground">
                포트폴리오 성격이 있으려면 실제 운영 장소가 보여야 합니다. 지도는 이 농장이 온라인
                소개용 껍데기가 아니라, 직접 방문 가능한 실제 농장이라는 점을 증명하는 역할을
                합니다.
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
                  hash="orchard-picker"
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
                  분양 가능한 나무 보기
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
                  Available trees
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-foreground">
                  지금 신청 가능한 대표 나무
                </h2>
              </div>
              <Link
                to="/farms/$farmId"
                params={{ farmId: farm._id }}
                className="inline-flex items-center gap-2 text-sm font-semibold text-primary"
              >
                전체 분양 보기
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
                      이 나무 상세 보기
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
