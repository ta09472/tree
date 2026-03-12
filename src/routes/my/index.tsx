import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronRight, Package, TreePine } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { buttonVariants } from '#/components/ui/button';
import { farmsById } from '#/data/farms';
import { getTreeDetail, growthStages } from '#/data/tree-details';
import { useMyTreeAdoptions } from '#/lib/my-tree-adoptions';

const DAY_IN_MS = 24 * 60 * 60 * 1000;

export const Route = createFileRoute('/my/')({
  component: MyTreePage,
});

function MyTreePage() {
  const treeAdoptions = useMyTreeAdoptions();
  const myTrees = treeAdoptions
    .map((adoption) => {
      const tree = getTreeDetail(adoption.treeId);
      const farm = farmsById[adoption.farmId];

      if (!farm) {
        return null;
      }

      const daysToHarvest = Math.max(
        0,
        Math.ceil((tree.estimatedHarvestDate - Date.now()) / DAY_IN_MS)
      );

      return {
        adoption,
        tree: {
          ...tree,
          growthStage: growthStages[tree.currentStage]?.label ?? '성장 중',
          progressPercent: Math.round((tree.currentStage / (growthStages.length - 1)) * 100),
        },
        farm: {
          _id: farm._id,
          name: farm.name,
        },
        stats: {
          daysToHarvest,
          estimatedYield: tree.estimatedYield,
        },
      };
    })
    .filter((tree): tree is NonNullable<typeof tree> => Boolean(tree));

  const activeTree = myTrees[0];

  const handleHarvestReservation = () => {
    if (!activeTree) {
      return;
    }

    if (activeTree.stats.daysToHarvest > 30) {
      toast.info(
        `수확 예약은 30일 전부터 가능합니다. 지금은 수확 ${activeTree.stats.daysToHarvest}일 전입니다.`
      );
      return;
    }

    toast.success('수확 예약 요청을 받았습니다. 방문 또는 택배 안내는 알림으로 보내드릴게요.');
  };

  if (myTrees.length === 0) {
    return (
      <main className="page-wrap py-8">
        <h1 className="mb-8 text-xl font-bold text-foreground">마이트리</h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-12 text-center"
        >
          <TreePine className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-lg font-bold text-foreground">아직 내 나무가 없습니다</h2>
          <p className="mb-6 text-muted-foreground">
            나만의 나무를 분양받고 생육 기록과 수확 일정을 받아보세요.
          </p>
          <Link to="/" className={buttonVariants({ size: 'lg' })}>
            농장 둘러보기
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="page-wrap py-8">
      <h1 className="mb-8 text-xl font-bold text-foreground">마이트리</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 overflow-hidden rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 p-6 text-white shadow-lg"
      >
        <div className="mb-4 flex items-start justify-between">
          <div>
            <p className="mb-1 text-sm opacity-90">{activeTree.farm.name}</p>
            <h2 className="text-2xl font-bold">
              {activeTree.tree.variety} {activeTree.tree.treeNumber}
            </h2>
            <p className="mt-2 text-sm opacity-90">현재 {activeTree.tree.growthStage} 단계</p>
          </div>
          <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white shadow-md">
            <img src={activeTree.tree.image} alt="" className="h-full w-full object-cover" />
          </div>
        </div>

        <div className="mb-4">
          <div className="mb-1 flex items-baseline gap-1">
            <span className="text-4xl font-bold">{activeTree.stats.daysToHarvest}</span>
            <span className="text-lg">일</span>
          </div>
          <p className="text-sm opacity-90">수확까지 남은 기간</p>
        </div>

        <div className="mb-2">
          <div className="mb-1 flex justify-between text-sm">
            <span>성장 진행률</span>
            <span>{activeTree.tree.progressPercent}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-white/30">
            <div
              className="h-full rounded-full bg-white transition-all duration-1000"
              style={{ width: `${activeTree.tree.progressPercent}%` }}
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 grid grid-cols-2 gap-4"
      >
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-2xl">🍊</span>
            <span className="text-sm text-muted-foreground">예상 수확량</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {activeTree.stats.estimatedYield}kg
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-2xl">📦</span>
            <span className="text-sm text-muted-foreground">예상 박스</span>
          </div>
          <div className="text-2xl font-bold text-foreground">
            {Math.round(activeTree.stats.estimatedYield * 0.7)}박스
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <Link
          to="/trees/$treeId"
          params={{ treeId: activeTree.adoption.treeId }}
          className="group flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 text-xl">
              📸
            </div>
            <div>
              <p className="font-medium text-foreground">성장 기록 보기</p>
              <p className="text-sm text-muted-foreground">농장주가 올린 사진과 기록 확인</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>

        <button
          type="button"
          onClick={handleHarvestReservation}
          className="group flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <Package className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">수확 예약하기</p>
              <p className="text-sm text-muted-foreground">방문 또는 택배 일정 접수</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>

      <section className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">내가 분양한 나무</h2>
          <span className="text-sm text-muted-foreground">{myTrees.length}그루</span>
        </div>

        <div className="space-y-3">
          {myTrees.map((item, index) => (
            <motion.div
              key={item.adoption._id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + index * 0.05 }}
            >
              <Link
                to="/trees/$treeId"
                params={{ treeId: item.tree._id }}
                className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-md"
              >
                <div className="h-16 w-16 overflow-hidden rounded-xl bg-muted">
                  <img
                    src={item.tree.image}
                    alt={item.tree.treeNumber}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-foreground">
                        {item.tree.variety} {item.tree.treeNumber}
                      </p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.farm.name}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-muted px-2.5 py-1">
                      {item.tree.growthStage}
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1">
                      수확까지 {item.stats.daysToHarvest}일
                    </span>
                    <span className="rounded-full bg-muted px-2.5 py-1">
                      분양일 {new Date(item.adoption.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
