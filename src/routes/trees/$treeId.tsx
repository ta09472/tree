import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, Calendar, Check, MapPin, Ruler, Weight } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';

// 성장 단계 정의
const growthStages = [
  { id: 'dormant', label: '휴면기', icon: '💤' },
  { id: 'bloom', label: '개화', icon: '🌸' },
  { id: 'fruit', label: '착과', icon: '🍃' },
  { id: 'ripen', label: '성숙', icon: '🍎' },
  { id: 'harvest', label: '수확', icon: '🧺' },
];

const treesData: Record<
  string,
  {
    _id: string;
    treeNumber: string;
    variety: string;
    age: number;
    location: { row: number; col: number };
    status: string;
    price: { adoptionFee: number; annualManagementFee: number };
    description: string;
    image: string;
    estimatedYield: number;
    estimatedHarvestDate: number;
    farmId: string;
    farmName: string;
    currentStage: number; // 현재 단계 인덱스
    growthLogs: Array<{
      _id: string;
      type: string;
      content: string;
      growthStage: string;
      createdAt: number;
      image?: string;
    }>;
  }
> = {
  tree_1: {
    _id: 'tree_1',
    treeNumber: 'A-15',
    variety: '천혜향',
    age: 5,
    location: { row: 1, col: 15 },
    status: 'available',
    price: { adoptionFee: 350000, annualManagementFee: 50000 },
    description:
      '제주의 햇살을 가장 많이 받는 위치에 있는 건강한 천혜향 나무입니다. 작년에도 풍년을 맞았으며 올핸 더욱 달콤한 열과를 기대할 수 있습니다.',
    image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800&q=80',
    estimatedYield: 20,
    estimatedHarvestDate: Date.now() + 180 * 24 * 60 * 60 * 1000,
    farmId: 'farm_1',
    farmName: '제주 햇살 농장',
    currentStage: 2, // 착과 단계
    growthLogs: [
      {
        _id: 'log_1',
        type: 'photo',
        content: '개화가 시작되었습니다. 작년보다 꽃이 많이 폈어요!',
        growthStage: '개화',
        createdAt: Date.now() - 30 * 24 * 60 * 60 * 1000,
        image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=400&q=80',
      },
      {
        _id: 'log_2',
        type: 'note',
        content: '유기농 비료를 주었습니다. 나무 상태가 아주 좋습니다.',
        growthStage: '생육',
        createdAt: Date.now() - 60 * 24 * 60 * 60 * 1000,
      },
    ],
  },
  tree_2: {
    _id: 'tree_2',
    treeNumber: 'A-16',
    variety: '천혜향',
    age: 5,
    location: { row: 1, col: 16 },
    status: 'available',
    price: { adoptionFee: 350000, annualManagementFee: 50000 },
    description: '햇볕이 잘 드는 언덕에 위치한 건강한 천혜향 나무입니다.',
    image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=800&q=80',
    estimatedYield: 22,
    estimatedHarvestDate: Date.now() + 175 * 24 * 60 * 60 * 1000,
    farmId: 'farm_1',
    farmName: '제주 햇살 농장',
    currentStage: 2,
    growthLogs: [
      {
        _id: 'log_3',
        type: 'photo',
        content: '꽃이 만개했습니다.',
        growthStage: '개화',
        createdAt: Date.now() - 25 * 24 * 60 * 60 * 1000,
      },
    ],
  },
  tree_3: {
    _id: 'tree_3',
    treeNumber: 'L-01',
    variety: '레몬',
    age: 4,
    location: { row: 2, col: 5 },
    status: 'available',
    price: { adoptionFee: 280000, annualManagementFee: 40000 },
    description: '고흥의 따뜻한 햇살 아래 자란 향긋한 레몬나무입니다.',
    image: 'https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?w=800&q=80',
    estimatedYield: 15,
    estimatedHarvestDate: Date.now() + 120 * 24 * 60 * 60 * 1000,
    farmId: 'farm_2',
    farmName: '고흥 레몬 팜',
    currentStage: 3,
    growthLogs: [
      {
        _id: 'log_4',
        type: 'photo',
        content: '레몬 열과가 시작되었습니다.',
        growthStage: '착과',
        createdAt: Date.now() - 20 * 24 * 60 * 60 * 1000,
      },
    ],
  },
  tree_4: {
    _id: 'tree_4',
    treeNumber: 'P-05',
    variety: '복숭아',
    age: 6,
    location: { row: 3, col: 8 },
    status: 'available',
    price: { adoptionFee: 300000, annualManagementFee: 45000 },
    description: '달콤한 복숭아를 맛볼 수 있는 6년생 복숭아나무입니다.',
    image: 'https://images.unsplash.com/photo-1623227866882-c005c207758f?w=800&q=80',
    estimatedYield: 18,
    estimatedHarvestDate: Date.now() + 90 * 24 * 60 * 60 * 1000,
    farmId: 'farm_3',
    farmName: '영천 복숭아 마을',
    currentStage: 3,
    growthLogs: [
      {
        _id: 'log_5',
        type: 'photo',
        content: '복숭아가 크고 있습니다.',
        growthStage: '성숙',
        createdAt: Date.now() - 15 * 24 * 60 * 60 * 1000,
      },
    ],
  },
  tree_5: {
    _id: 'tree_5',
    treeNumber: 'A-10',
    variety: '사과',
    age: 7,
    location: { row: 1, col: 10 },
    status: 'available',
    price: { adoptionFee: 400000, annualManagementFee: 60000 },
    description: '상주의 일교차 큰 기후에서 당도 높은 사과를 생산합니다.',
    image: 'https://images.unsplash.com/photo-1568702846914-96b305d2ebb2?w=800&q=80',
    estimatedYield: 25,
    estimatedHarvestDate: Date.now() + 100 * 24 * 60 * 60 * 1000,
    farmId: 'farm_4',
    farmName: '상주 사과원',
    currentStage: 3, // 성숙 단계
    growthLogs: [
      {
        _id: 'log_6',
        type: 'photo',
        content: '사과가 빨갛게 물들고 있습니다.',
        growthStage: '성숙',
        createdAt: Date.now() - 10 * 24 * 60 * 60 * 1000,
      },
    ],
  },
  tree_6: {
    _id: 'tree_6',
    treeNumber: 'H-08',
    variety: '한라봉',
    age: 5,
    location: { row: 2, col: 8 },
    status: 'available',
    price: { adoptionFee: 380000, annualManagementFee: 55000 },
    description: '여수 바다의 해풍을 맞고 자라 더욱 달콤한 한라봉입니다.',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&q=80',
    estimatedYield: 22,
    estimatedHarvestDate: Date.now() + 160 * 24 * 60 * 60 * 1000,
    farmId: 'farm_5',
    farmName: '여수 한라봉 농장',
    currentStage: 2,
    growthLogs: [
      {
        _id: 'log_7',
        type: 'photo',
        content: '한라봉이 크고 있습니다.',
        growthStage: '착과',
        createdAt: Date.now() - 35 * 24 * 60 * 60 * 1000,
      },
    ],
  },
};

export const Route = createFileRoute('/trees/$treeId')({
  component: TreeDetailPage,
});

function TreeDetailPage() {
  const { treeId } = Route.useParams();
  const tree = treesData[treeId] || treesData['tree_1'];
  const isAvailable = tree.status === 'available';
  const currentStageIndex = tree.currentStage;

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
          <img
            src={tree.image}
            alt={tree.treeNumber}
            className="h-full w-full object-cover"
          />
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

        {/* 성장 단계 스테퍼 */}
        <div className="mb-8 rounded-xl border border-border bg-card p-5">
          <h2 className="mb-4 text-sm font-medium text-foreground">성장 단계</h2>

          <div className="relative">
            {/* 진행 바 배경 */}
            <div className="absolute left-0 top-4 h-0.5 w-full bg-muted" />
            {/* 진행 바 채움 */}
            <div
              className="absolute left-0 top-4 h-0.5 bg-primary transition-all duration-500"
              style={{ width: `${(currentStageIndex / (growthStages.length - 1)) * 100}%` }}
            />

            {/* 스테퍼 아이템들 */}
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

          {/* 현재 단계 설명 */}
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

        {isAvailable && (
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
            <Button size="lg" className="w-full">
              이 나무 분양받기
            </Button>
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
