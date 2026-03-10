export const growthStages = [
  { id: 'dormant', label: '휴면기', icon: '💤' },
  { id: 'bloom', label: '개화', icon: '🌸' },
  { id: 'fruit', label: '착과', icon: '🍃' },
  { id: 'ripen', label: '성숙', icon: '🍎' },
  { id: 'harvest', label: '수확', icon: '🧺' },
] as const;

export type GrowthLog = {
  _id: string;
  type: string;
  content: string;
  growthStage: string;
  createdAt: number;
  image?: string;
};

export type TreeDetail = {
  _id: string;
  treeNumber: string;
  variety: string;
  age: number;
  location: { row: number; col: number };
  status: 'available' | 'adopted';
  price: { adoptionFee: number; annualManagementFee: number };
  description: string;
  image: string;
  estimatedYield: number;
  estimatedHarvestDate: number;
  farmId: string;
  farmName: string;
  currentStage: number;
  growthLogs: GrowthLog[];
};

export const treeDetailsById: Record<string, TreeDetail> = {
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
    currentStage: 2,
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
    currentStage: 3,
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
  tree_7: {
    _id: 'tree_7',
    treeNumber: 'S-12',
    variety: '딸기',
    age: 1,
    location: { row: 4, col: 12 },
    status: 'available',
    price: { adoptionFee: 150000, annualManagementFee: 30000 },
    description: '청도의 비닐하우스에서 안정적으로 자라는 딸기 나무입니다.',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80',
    estimatedYield: 5,
    estimatedHarvestDate: Date.now() + 55 * 24 * 60 * 60 * 1000,
    farmId: 'farm_6',
    farmName: '청도 딸기 마을',
    currentStage: 3,
    growthLogs: [
      {
        _id: 'log_8',
        type: 'photo',
        content: '딸기 색이 올라오고 있어 첫 수확 시기가 가까워졌습니다.',
        growthStage: '성숙',
        createdAt: Date.now() - 8 * 24 * 60 * 60 * 1000,
      },
    ],
  },
  tree_8: {
    _id: 'tree_8',
    treeNumber: 'R-03',
    variety: '배',
    age: 8,
    location: { row: 2, col: 3 },
    status: 'available',
    price: { adoptionFee: 320000, annualManagementFee: 48000 },
    description: '무주의 일교차 덕분에 과즙과 당도가 좋은 배나무입니다.',
    image: 'https://images.unsplash.com/photo-1514756331096-7f14285e2e3d?w=800&q=80',
    estimatedYield: 28,
    estimatedHarvestDate: Date.now() + 110 * 24 * 60 * 60 * 1000,
    farmId: 'farm_7',
    farmName: '무주 배나무원',
    currentStage: 2,
    growthLogs: [
      {
        _id: 'log_9',
        type: 'note',
        content: '배 봉지 작업을 마쳐 과실 품질을 안정적으로 관리하고 있습니다.',
        growthStage: '착과',
        createdAt: Date.now() - 12 * 24 * 60 * 60 * 1000,
      },
    ],
  },
  tree_9: {
    _id: 'tree_9',
    treeNumber: 'Y-07',
    variety: '유자',
    age: 6,
    location: { row: 1, col: 7 },
    status: 'available',
    price: { adoptionFee: 290000, annualManagementFee: 42000 },
    description: '남해의 바람을 머금은 향이 진한 유자를 수확할 수 있는 나무입니다.',
    image: 'https://images.unsplash.com/photo-1596451190630-186aff535bf2?w=800&q=80',
    estimatedYield: 16,
    estimatedHarvestDate: Date.now() + 130 * 24 * 60 * 60 * 1000,
    farmId: 'farm_8',
    farmName: '남해 유자 농장',
    currentStage: 2,
    growthLogs: [
      {
        _id: 'log_10',
        type: 'photo',
        content: '유자 열매가 고르게 달려 향이 짙어지고 있습니다.',
        growthStage: '착과',
        createdAt: Date.now() - 18 * 24 * 60 * 60 * 1000,
      },
    ],
  },
};

export function getTreeDetail(treeId: string) {
  return treeDetailsById[treeId] ?? treeDetailsById.tree_1;
}
