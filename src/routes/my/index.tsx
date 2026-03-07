import { createFileRoute, Link } from '@tanstack/react-router';
import { ChevronRight, Package, TreePine } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';

const mockMyTrees = [
  {
    adoption: {
      _id: 'adoption_1',
      treeId: 'tree_1',
      createdAt: Date.now() - 90 * 24 * 60 * 60 * 1000,
      status: 'active',
    },
    tree: {
      _id: 'tree_1',
      treeNumber: 'A-15',
      variety: '천혜향',
      image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&q=80',
      growthStage: '착과',
      progressPercent: 65,
    },
    farm: {
      _id: 'farm_1',
      name: '제주 햇살 농장',
    },
    stats: {
      daysToHarvest: 45,
      estimatedYield: 20,
    },
  },
];

export const Route = createFileRoute('/my/')({
  component: MyTreePage,
});

function MyTreePage() {
  const myTrees = mockMyTrees;
  const activeTree = myTrees[0];

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
          <h2 className="mb-2 text-lg font-bold text-foreground">아직 분양받은 나무가 없습니다</h2>
          <p className="mb-6 text-muted-foreground">
            나만의 나무를 분양받고 신선한 과일을 받아보세요.
          </p>
          <Link to="/">
            <Button size="lg">농장 둘러보기</Button>
          </Link>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="page-wrap py-8">
      <h1 className="mb-8 text-xl font-bold text-foreground">마이트리</h1>

      {/* Hero Card */}
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
          <p className="text-sm opacity-90">수확까지 남았어요!</p>
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

      {/* Stats Grid */}
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

      {/* Actions */}
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
              <p className="text-sm text-muted-foreground">농장주가 올린 사진/영상</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>

        <button
          type="button"
          className="group flex w-full items-center justify-between rounded-xl border border-border bg-card p-4 transition-all duration-300 hover:border-primary/50 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100">
              <Package className="h-5 w-5 text-orange-600" />
            </div>
            <div>
              <p className="font-medium text-foreground">수확 예약하기</p>
              <p className="text-sm text-muted-foreground">방문 또는 택배 선택</p>
            </div>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </button>
      </motion.div>

      {/* Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-8 text-center text-sm text-muted-foreground"
      >
        분양일: {new Date(activeTree.adoption.createdAt).toLocaleDateString('ko-KR')}
      </motion.div>
    </main>
  );
}
