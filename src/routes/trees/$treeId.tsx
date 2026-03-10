import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { ArrowLeft, Calendar, Check, MapPin, Ruler, Weight } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Button, buttonVariants } from '#/components/ui/button';
import { getTreeDetail, growthStages } from '#/data/tree-details';
import { adoptTree, useMyTreeAdoptions } from '#/lib/my-tree-adoptions';

export const Route = createFileRoute('/trees/$treeId')({
  component: TreeDetailPage,
});

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
    <main className="page-wrap py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link
          to="/farms/$farmId"
          params={{ farmId: tree.farmId }}
          className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {tree.farmName}으로 돌아가기
        </Link>

        <div className="mb-6 aspect-square w-full overflow-hidden rounded-xl">
          <img src={tree.image} alt={tree.treeNumber} className="h-full w-full object-cover" />
        </div>

        <div className="mb-4 flex items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${isAvailable ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}
          >
            {isAvailable ? '분양 가능' : '분양 완료'}
          </span>
          <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
            {tree.variety}
          </span>
        </div>

        <h1 className="mb-4 text-2xl font-bold text-foreground">{tree.treeNumber}번 나무</h1>

        <div className="mb-6 grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Ruler className="h-5 w-5" />
            <span>{tree.age}년생</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="h-5 w-5" />
            <span>
              {tree.location.row}열 {tree.location.col}번
            </span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Weight className="h-5 w-5" />
            <span>예상 {tree.estimatedYield}kg 수확</span>
          </div>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-5 w-5" />
            <span>
              수확 예상: {new Date(tree.estimatedHarvestDate).toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>

        <p className="mb-6 text-muted-foreground">{tree.description}</p>

        <div className="mb-8 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-medium text-foreground">성장 단계</h2>

          <div className="relative">
            <div className="absolute left-0 top-4 h-0.5 w-full bg-muted" />
            <div
              className="absolute left-0 top-4 h-0.5 bg-primary transition-all duration-500"
              style={{ width: `${(currentStageIndex / (growthStages.length - 1)) * 100}%` }}
            />

            <div className="relative flex justify-between">
              {growthStages.map((stage, index) => {
                const isCompleted = index < currentStageIndex;
                const isCurrent = index === currentStageIndex;

                return (
                  <div key={stage.id} className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm transition-all duration-300 ${
                        isCompleted
                          ? 'border-primary bg-primary text-white'
                          : isCurrent
                            ? 'border-primary bg-background text-primary'
                            : 'border-muted bg-background text-muted-foreground'
                      }`}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : stage.icon}
                    </div>
                    <span
                      className={`mt-2 text-xs font-medium ${
                        isCurrent
                          ? 'text-primary'
                          : isCompleted
                            ? 'text-foreground'
                            : 'text-muted-foreground'
                      }`}
                    >
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 rounded-lg bg-muted p-3">
            <p className="text-sm text-muted-foreground">
              현재{' '}
              <span className="font-medium text-foreground">
                {growthStages[currentStageIndex].label}
              </span>{' '}
              단계입니다.
              {currentStageIndex < growthStages.length - 1 && (
                <>
                  {' '}
                  다음{' '}
                  <span className="font-medium text-foreground">
                    {growthStages[currentStageIndex + 1].label}
                  </span>{' '}
                  단계까지 진행 중이에요.
                </>
              )}
            </p>
          </div>
        </div>

        {isAvailable ? (
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <div className="mb-1 text-sm text-muted-foreground">분양비</div>
                <div className="text-3xl font-bold text-primary">
                  {tree.price.adoptionFee.toLocaleString()}원
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">연 관리비</div>
                <div className="font-bold">{tree.price.annualManagementFee.toLocaleString()}원</div>
              </div>
            </div>
            <Button size="lg" className="w-full" onClick={handleAdopt}>
              이 나무 분양받기
            </Button>
            <p className="mt-3 text-xs text-muted-foreground">
              분양이 완료되면 마이트리에 등록되고, 이후 성장 기록과 수확 일정을 확인할 수 있습니다.
            </p>
          </div>
        ) : (
          <div className="mb-8 rounded-xl border border-border bg-card p-6">
            <p className="text-lg font-semibold text-foreground">
              {isAlreadyAdopted
                ? '이미 분양한 나무입니다.'
                : '이 나무는 현재 분양이 완료되었습니다.'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {isAlreadyAdopted
                ? '마이트리에서 성장 기록과 수확 일정을 계속 확인할 수 있습니다.'
                : '같은 농장의 다른 나무를 둘러보거나 첫 화면에서 다른 농장을 찾아보세요.'}
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              {isAlreadyAdopted ? (
                <Link to="/my" className={buttonVariants({ className: 'sm:flex-1' })}>
                  마이트리에서 보기
                </Link>
              ) : (
                <Link
                  to="/farms/$farmId"
                  params={{ farmId: tree.farmId }}
                  className={buttonVariants({ className: 'sm:flex-1' })}
                >
                  같은 농장 둘러보기
                </Link>
              )}
              <Link
                to="/"
                className={buttonVariants({ variant: 'outline', className: 'sm:flex-1' })}
              >
                다른 농장 보기
              </Link>
            </div>
          </div>
        )}

        <h2 className="mb-4 text-lg font-bold text-foreground">성장 기록</h2>

        <div className="space-y-4">
          {tree.growthLogs.map((log, index) => (
            <motion.div
              key={log._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex gap-4 rounded-xl border border-border bg-card p-4"
            >
              <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
                {log.image ? (
                  <img src={log.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl">📝</div>
                )}
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="text-xs font-bold text-primary">{log.growthStage}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.createdAt).toLocaleDateString('ko-KR')}
                  </span>
                </div>
                <p className="text-sm text-foreground">{log.content}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </main>
  );
}
