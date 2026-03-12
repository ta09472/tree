import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  CreditCard,
  MapPin,
  Phone,
  Sprout,
  TreePine,
} from 'lucide-react';
import { domAnimation, LazyMotion, m } from 'motion/react';
import { buttonVariants } from '#/components/ui/button';
import { getFarmById } from '#/data/farms';
import { useMyTreeAdoptions } from '#/lib/my-tree-adoptions';

const FEATURED_FARM_ID = 'farm_1';
const currencyFormatter = new Intl.NumberFormat('ko-KR');

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

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  const myAdoptions = useMyTreeAdoptions();
  const adoptedTreeIds = new Set(myAdoptions.map((adoption) => adoption.treeId));
  const farm = getFarmById(FEATURED_FARM_ID, adoptedTreeIds);
  const availableTrees = farm.trees.filter((tree) => tree.status === 'available');
  const heroTree = availableTrees[0] ?? farm.trees[0];
  const showcaseTrees = availableTrees.length > 0 ? availableTrees.slice(0, 3) : farm.trees.slice(0, 3);

  return (
    <LazyMotion features={domAnimation}>
      <main className="pb-16">
        <section className="border-b border-border bg-muted/30">
          <div className="page-wrap grid gap-8 py-8 md:py-12 lg:grid-cols-2 lg:items-center">
            <m.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
                <Sprout className="h-3.5 w-3.5" />
                Single Orchard Membership
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                제주 햇살 농장 한 곳만
                <br />
                깊게 경험하는
                <br />
                천혜향나무 분양 홈페이지
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                여러 업체를 고르는 플랫폼이 아니라, 한 농장의 재배 방식과 나무 상태를 신뢰하고
                분양받는 전용 메인입니다. 계절 소식, 분양 신청, 현장 수확 경험까지 한 흐름으로
                안내합니다.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/farms/$farmId"
                  params={{ farmId: farm._id }}
                  className={buttonVariants({
                    className: 'h-12 rounded-full px-6 text-sm font-semibold',
                  })}
                >
                  천혜향나무 분양 신청
                </Link>
                <a
                  href="#process"
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'h-12 rounded-full px-6 text-sm font-semibold',
                  })}
                >
                  신청 절차 보기
                </a>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { label: '현재 분양 가능', value: `${farm.stats.availableTrees}그루` },
                  { label: '대표 품종', value: heroTree?.variety ?? '-' },
                  { label: '예상 수확량', value: `${heroTree?.estimatedYield ?? 0}kg` },
                ].map((stat, index) => (
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
                    <p className="mt-2 text-2xl font-semibold text-foreground">{stat.value}</p>
                  </m.div>
                ))}
              </div>
            </m.div>

            <m.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
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
                  <div className="rounded-3xl border border-border bg-card/95 p-5 shadow-md backdrop-blur">
                    <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                      분양 기준 안내
                    </p>
                    <p className="mt-2 text-lg font-semibold leading-7 text-foreground">
                      {formatPrice(heroTree?.price.adoptionFee)}부터,
                      <br />
                      연 관리비 {formatPrice(heroTree?.price.annualManagementFee)}
                    </p>
                  </div>

                  <div className="rounded-3xl bg-foreground/92 p-5 text-background shadow-md backdrop-blur">
                    <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-background/70 uppercase">
                      <CalendarDays className="h-4 w-4" />
                      수확 시즌
                    </p>
                    <p className="mt-2 text-lg font-semibold">9월 말부터 10월 중순</p>
                    <p className="mt-2 text-sm leading-6 text-background/75">
                      생육 상황을 수시로 전달하고, 현장 수확 가능일을 개별 안내합니다.
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
              <h2 className="mt-3 text-3xl font-semibold tracking-tight">천혜향 분양 신청</h2>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-primary-foreground/90 sm:text-base">
                {farm.description} 여러 업체를 비교하는 대신, 이 농장의 재배 철학과 관리 기준을 충분히
                보고 신청할 수 있도록 메인을 단순화했습니다.
              </p>
            </div>

            <div className="rounded-3xl bg-background p-7 text-foreground shadow-lg">
              <p className="text-sm font-semibold tracking-[0.16em] text-primary uppercase">
                신청 바로가기
              </p>
              <p className="mt-3 text-2xl font-semibold leading-8">천혜향 분양 신청하기</p>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                남은 나무와 분양 금액을 확인한 뒤 원하는 나무를 바로 선택할 수 있습니다.
              </p>
              <Link
                to="/farms/$farmId"
                params={{ farmId: farm._id }}
                className={buttonVariants({
                  className: 'mt-6 h-11 rounded-full px-5 text-sm font-semibold',
                })}
              >
                분양신청 GO
              </Link>
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
                  복잡한 비교 화면 대신, 한 농장의 분양 흐름을 한 번에 이해할 수 있게 정리했습니다.
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
                      <p className="mt-3 text-sm leading-6 text-muted-foreground">{step.description}</p>
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
                    Orchard story
                  </p>
                  <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
                    천혜향 농장 소개
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                    {farm.description} 분양 후에는 단순 결제 내역만 남는 것이 아니라, 수확 시기와 관리
                    상황을 지속적으로 확인할 수 있도록 운영합니다.
                  </p>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {farm.facilities.map((facility) => (
                      <div key={facility} className="rounded-2xl border border-border bg-muted/40 px-4 py-4">
                        <p className="text-sm font-semibold text-foreground">{facility}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          방문 고객이 편하게 머무를 수 있도록 기본 동선을 갖췄습니다.
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
              <h3 className="mt-4 text-2xl font-semibold text-foreground">분양 문의</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                상담 후 원하는 나무를 함께 정리해 드립니다. 사이트는 단일 농장 기준으로 운영되므로
                문의 동선도 짧습니다.
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
                        <h3 className="mt-1 text-2xl font-semibold text-foreground">{tree.variety}</h3>
                      </div>
                      <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                        {tree.age}년생
                      </span>
                    </div>

                    <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-muted/40 p-3">
                        <dt className="text-muted-foreground">예상 수확량</dt>
                        <dd className="mt-1 font-semibold text-foreground">{tree.estimatedYield}kg</dd>
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
