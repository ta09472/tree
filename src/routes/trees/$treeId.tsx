import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  Check,
  Clock3,
  MapPin,
  Ruler,
  ShieldCheck,
  Sparkles,
  TreePine,
  Weight,
} from 'lucide-react';
import { domAnimation, LazyMotion, m } from 'motion/react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '#/components/ui/button';
import { getTreeDetail, growthStages } from '#/data/tree-details';
import { adoptTree, useMyTreeAdoptions } from '#/lib/my-tree-adoptions';

export const Route = createFileRoute('/trees/$treeId')({
  component: TreeDetailPage,
});

const currencyFormatter = new Intl.NumberFormat('ko-KR');
const SALES_POINTS = [
  {
    title: '수확 기대감이 높은 대표 개체',
    description: '햇빛이 좋은 위치에 있어 당도와 수확 경험을 함께 기대할 수 있습니다.',
    icon: Sparkles,
  },
  {
    title: '생육 과정을 계속 확인 가능',
    description: '분양 후에도 기록이 쌓여 단순 구매가 아니라 관리 경험까지 이어집니다.',
    icon: BadgeCheck,
  },
  {
    title: '방문형 체험과 연결되는 분양',
    description: '온라인 결제로 끝나지 않고 농장 방문과 수확 일정까지 연결됩니다.',
    icon: TreePine,
  },
] as const;

const TRUST_POINTS = [
  { label: '농장 직접 관리', icon: ShieldCheck },
  { label: '생육 기록 제공', icon: BadgeCheck },
  { label: '수확 일정 안내', icon: Clock3 },
] as const;

function TreeDetailPage() {
  const { treeId } = Route.useParams();
  const navigate = useNavigate();
  const tree = getTreeDetail(treeId);
  const myAdoptions = useMyTreeAdoptions();
  const adoptedTreeIds = new Set(myAdoptions.map((adoption) => adoption.treeId));
  const isAlreadyAdopted = adoptedTreeIds.has(tree._id);
  const isAvailable = tree.status === 'available' && !isAlreadyAdopted;
  const currentStageIndex = tree.currentStage;

  const handleAdopt = () => {
    const result = adoptTree({ treeId: tree._id, farmId: tree.farmId });

    if (result.created) {
      toast.success(`${tree.variety} ${tree.treeNumber} 분양이 완료되었습니다.`);
    } else {
      toast.info('이미 분양한 나무입니다. 마이트리로 이동합니다.');
    }

    void navigate({ to: '/my' });
  };

  return (
    <LazyMotion features={domAnimation}>
      <main className="page-wrap py-8 lg:py-12">
        <m.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <Link
          to="/farms/$farmId"
          params={{ farmId: tree.farmId }}
          hash="orchard-picker"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {tree.farmName}으로 돌아가기
        </Link>

        <section className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_380px] lg:items-start">
          <div className="space-y-6">
            <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
              <div className="aspect-[4/3] w-full bg-muted lg:aspect-[16/11]">
                <img src={tree.image} alt={tree.treeNumber} className="h-full w-full object-cover" />
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className={
                    isAvailable
                      ? 'rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground'
                      : 'rounded-full bg-muted px-3 py-1 text-sm font-semibold text-muted-foreground'
                  }
                >
                  {isAvailable ? '분양 가능' : '분양 완료'}
                </span>
                <span className="rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground">
                  {tree.variety}
                </span>
                <span className="rounded-full border border-border px-3 py-1 text-sm font-medium text-muted-foreground">
                  {tree.treeNumber}
                </span>
              </div>

              <div className="mt-5 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Signature Tree</p>
                  <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    {tree.variety} {tree.treeNumber}
                  </h1>
                </div>
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 text-primary" />
                  {tree.farmName} · {tree.location.row}열 {tree.location.col}번
                </p>
              </div>

              <p className="mt-6 max-w-3xl text-base leading-7 text-muted-foreground">
                {tree.description}
              </p>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {SALES_POINTS.map((point) => {
                  const Icon = point.icon;

                  return (
                    <div key={point.title} className="rounded-2xl border border-border bg-muted/30 p-4">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/12 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h2 className="mt-4 text-base font-semibold text-foreground">{point.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {point.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <dl className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <FeatureCard
                  icon={<Ruler className="h-4 w-4 text-primary" />}
                  label="수령"
                  value={`${tree.age}년생`}
                />
                <FeatureCard
                  icon={<Weight className="h-4 w-4 text-primary" />}
                  label="예상 수확량"
                  value={`${tree.estimatedYield}kg`}
                />
                <FeatureCard
                  icon={<Calendar className="h-4 w-4 text-primary" />}
                  label="예상 수확일"
                  value={new Date(tree.estimatedHarvestDate).toLocaleDateString('ko-KR')}
                />
                <FeatureCard
                  icon={<TreePine className="h-4 w-4 text-primary" />}
                  label="위치"
                  value={`${tree.location.row}열 ${tree.location.col}번`}
                />
              </dl>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              <p className="text-sm font-medium text-muted-foreground">Selection flow</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                구역 선택은 농장 페이지에서 먼저 확인하세요
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                이 상세 페이지는 선택한 나무의 컨디션과 분양 조건을 설득하는 역할에 집중하고,
                전체 블록 비교는 농장 페이지에서 먼저 보게 바꿨습니다. 그래서 사용자는 농장 단위로
                자리를 고른 뒤, 여기서 최종 판단만 하면 됩니다.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/farms/$farmId"
                  params={{ farmId: tree.farmId }}
                  hash="orchard-picker"
                  className={buttonVariants({ className: 'h-11 rounded-full px-5 text-sm font-semibold' })}
                >
                  농장 전체 구역 보기
                </Link>
                <Link
                  to="/farms/$farmId"
                  params={{ farmId: tree.farmId }}
                  hash="available-trees"
                  className={buttonVariants({
                    variant: 'outline',
                    className: 'h-11 rounded-full px-5 text-sm font-semibold',
                  })}
                >
                  같은 농장의 다른 나무 비교
                </Link>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Growth timeline</p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                    성장 단계
                  </h2>
                </div>
                <div className="rounded-full bg-muted px-3 py-1 text-sm text-muted-foreground">
                  현재 {growthStages[currentStageIndex].label}
                </div>
              </div>

              <div className="mt-8 overflow-x-auto">
                <div className="relative min-w-[620px]">
                  <div className="absolute left-0 right-0 top-4 h-0.5 bg-muted" />
                  <div
                    className="absolute left-0 top-4 h-0.5 bg-primary transition-all duration-500"
                    style={{ width: `${(currentStageIndex / (growthStages.length - 1)) * 100}%` }}
                  />

                  <div className="relative grid grid-cols-5 gap-3">
                    {growthStages.map((stage, index) => {
                      const isCompleted = index < currentStageIndex;
                      const isCurrent = index === currentStageIndex;

                      return (
                        <div key={stage.id} className="flex flex-col items-center text-center">
                          <div
                            className={
                              isCompleted
                                ? 'flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-primary text-primary-foreground'
                                : isCurrent
                                  ? 'flex h-9 w-9 items-center justify-center rounded-full border-2 border-primary bg-background text-primary'
                                  : 'flex h-9 w-9 items-center justify-center rounded-full border-2 border-muted bg-background text-muted-foreground'
                            }
                          >
                            {isCompleted ? <Check className="h-4 w-4" /> : stage.icon}
                          </div>
                          <span
                            className={
                              isCurrent
                                ? 'mt-3 text-sm font-semibold text-primary'
                                : isCompleted
                                  ? 'mt-3 text-sm font-semibold text-foreground'
                                  : 'mt-3 text-sm font-semibold text-muted-foreground'
                            }
                          >
                            {stage.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl bg-muted/50 p-4">
                <p className="text-sm leading-6 text-muted-foreground">
                  현재 <span className="font-semibold text-foreground">{growthStages[currentStageIndex].label}</span>{' '}
                  단계입니다.
                  {currentStageIndex < growthStages.length - 1 && (
                    <>
                      {' '}
                      다음 <span className="font-semibold text-foreground">{growthStages[currentStageIndex + 1].label}</span>{' '}
                      단계로 진행 중입니다.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <aside className="lg:sticky lg:top-24">
            {isAvailable ? (
              <div className="rounded-3xl border border-border bg-card p-6 shadow-lg lg:p-7">
                <div className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                  지금 바로 분양 가능
                </div>
                <p className="text-sm font-medium text-muted-foreground">Adoption summary</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  이 나무를 분양받을 수 있습니다
                </h2>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  단순히 과일을 사는 것이 아니라, 내 이름으로 관리되는 천혜향나무와 수확 경험을
                  확보하는 선택입니다.
                </p>

                <div className="mt-6 rounded-2xl bg-muted/50 p-5">
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">분양비</p>
                      <p className="mt-2 text-3xl font-semibold text-primary">
                        {formatPrice(tree.price.adoptionFee)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">연 관리비</p>
                      <p className="mt-2 text-lg font-semibold text-foreground">
                        {formatPrice(tree.price.annualManagementFee)}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 space-y-3 rounded-2xl border border-border p-4">
                  <SummaryRow label="품종" value={tree.variety} />
                  <SummaryRow label="예상 수확량" value={`${tree.estimatedYield}kg`} />
                  <SummaryRow
                    label="예상 수확일"
                    value={new Date(tree.estimatedHarvestDate).toLocaleDateString('ko-KR')}
                  />
                </div>

                <div className="mt-5 grid gap-2">
                  {TRUST_POINTS.map((item) => {
                    const Icon = item.icon;

                    return (
                      <div
                        key={item.label}
                        className="flex items-center gap-2 rounded-2xl bg-muted/40 px-3 py-3 text-sm text-foreground"
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        <span>{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                <Button size="lg" className="mt-6 h-12 w-full rounded-full" onClick={handleAdopt}>
                  이 나무 분양받기
                </Button>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  분양이 완료되면 마이트리에 등록되고, 이후 성장 기록과 수확 일정을 계속 확인할 수
                  있습니다. 좋은 개체는 빠르게 선택되기 때문에 관심 있다면 지금 확보하는 편이
                  유리합니다.
                </p>
              </div>
            ) : (
              <div className="rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-7">
                <p className="text-sm font-medium text-muted-foreground">Current status</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                  {isAlreadyAdopted ? '이미 분양한 나무입니다' : '현재 분양이 완료된 나무입니다'}
                </h2>
                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  {isAlreadyAdopted
                    ? '마이트리에서 성장 기록과 수확 일정을 계속 확인할 수 있습니다.'
                    : '같은 농장의 다른 나무를 둘러보거나 첫 화면에서 다른 농장을 살펴보세요.'}
                </p>
                <div className="mt-6 flex flex-col gap-3">
                  {isAlreadyAdopted ? (
                    <Link to="/my" className={buttonVariants({ className: 'h-11 rounded-full' })}>
                      마이트리에서 보기
                    </Link>
                  ) : (
                    <Link
                      to="/farms/$farmId"
                      params={{ farmId: tree.farmId }}
                      hash="available-trees"
                      className={buttonVariants({ className: 'h-11 rounded-full' })}
                    >
                      같은 농장 둘러보기
                    </Link>
                  )}
                  <Link
                    to="/"
                    className={buttonVariants({ variant: 'outline', className: 'h-11 rounded-full' })}
                  >
                    다른 농장 보기
                  </Link>
                </div>
              </div>
            )}
          </aside>
        </section>

        <section className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-sm lg:mt-10 lg:p-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Growth logs</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">
                성장 기록
              </h2>
            </div>
            <div className="rounded-full border border-border px-3 py-1 text-sm text-muted-foreground">
              총 {tree.growthLogs.length}개
            </div>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-2">
            {tree.growthLogs.map((log, index) => (
              <m.article
                key={log._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex gap-4 rounded-2xl border border-border bg-background p-4"
              >
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-muted sm:h-28 sm:w-28">
                  {log.image ? (
                    <img src={log.image} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full items-center justify-center text-2xl">📝</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-semibold text-secondary-foreground">
                      {log.growthStage}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(log.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-foreground">{log.content}</p>
                </div>
              </m.article>
            ))}
          </div>
        </section>
        </m.div>
      </main>
    </LazyMotion>
  );
}

function FeatureCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-muted/30 p-4">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <p className="mt-3 text-lg font-semibold text-foreground">{value}</p>
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground">{value}</span>
    </div>
  );
}

function formatPrice(value: number) {
  return `${currencyFormatter.format(value)}원`;
}
