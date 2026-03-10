export type FarmTree = {
  _id: string;
  treeNumber: string;
  variety: string;
  age: number;
  image: string;
  price: {
    adoptionFee: number;
    annualManagementFee: number;
  };
  estimatedYield: number;
  status: 'available' | 'adopted';
};

export type Farm = {
  _id: string;
  name: string;
  location: {
    address: string;
    latitude: number;
    longitude: number;
  };
  description: string;
  image: string;
  facilities: string[];
  stats: {
    availableTrees: number;
    totalTrees: number;
  };
  trees: FarmTree[];
};

function resolveTreeStatus(tree: FarmTree, adoptedTreeIds: Set<string>): FarmTree['status'] {
  if (tree.status === 'adopted' || adoptedTreeIds.has(tree._id)) {
    return 'adopted';
  }

  return 'available';
}

function toAdoptedTreeIdSet(adoptedTreeIds: Iterable<string>) {
  return adoptedTreeIds instanceof Set ? adoptedTreeIds : new Set(adoptedTreeIds);
}

const FARM_SHOWCASE_IMAGES = {
  citrusLane:
    'https://images.pexels.com/photos/19459905/pexels-photo-19459905.jpeg?cs=srgb&dl=pexels-drphotographer152-19459905.jpg&fm=jpg&w=1200&h=900&fit=crop&crop=entropy&auto=compress',
  lemonOrchard:
    'https://images.pexels.com/photos/14410454/pexels-photo-14410454.jpeg?cs=srgb&dl=pexels-mavimiro-14410454.jpg&fm=jpg&w=1200&h=900&fit=crop&crop=entropy&auto=compress',
  peachTree:
    'https://images.pexels.com/photos/8754400/pexels-photo-8754400.jpeg?cs=srgb&dl=pexels-nc-farm-bureau-mark-8754400.jpg&fm=jpg&w=1200&h=900&fit=crop&crop=entropy&auto=compress',
  appleOrchard:
    'https://images.pexels.com/photos/29448705/pexels-photo-29448705.jpeg?cs=srgb&dl=pexels-couleur-29448705.jpg&fm=jpg&w=1200&h=900&fit=crop&crop=entropy&auto=compress',
  strawberryField:
    'https://images.pexels.com/photos/7457184/pexels-photo-7457184.jpeg?cs=srgb&dl=pexels-kindelmedia-7457184.jpg&fm=jpg&w=1200&h=900&fit=crop&crop=entropy&auto=compress',
  pearOrchard:
    'https://images.pexels.com/photos/32243851/pexels-photo-32243851.jpeg?cs=srgb&dl=pexels-jean-paul-wettstein-677916508-32243851.jpg&fm=jpg&w=1200&h=900&fit=crop&crop=entropy&auto=compress',
  tangerineTree:
    'https://images.pexels.com/photos/33313006/pexels-photo-33313006.jpeg?cs=srgb&dl=pexels-marcelo-mora-203572590-33313006.jpg&fm=jpg&w=1200&h=900&fit=crop&crop=entropy&auto=compress',
} as const;

export const farms: Farm[] = [
  {
    _id: 'farm_1',
    name: '제주 햇살 농장',
    location: {
      address: '제주특별자치도 서귀포시 안덕면',
      latitude: 33.2578,
      longitude: 126.3497,
    },
    description:
      '제주의 깨끗한 공기와 풍부한 일조량으로 자라는 프리미엄 천혜향을 만나보세요. 30년 전통의 농장에서 정성껏 키운 나무들을 분양합니다.',
    image: FARM_SHOWCASE_IMAGES.citrusLane,
    facilities: ['주차장', '화장실', '카페'],
    stats: { availableTrees: 12, totalTrees: 50 },
    trees: [
      {
        _id: 'tree_1',
        treeNumber: 'A-15',
        variety: '천혜향',
        age: 5,
        image: 'https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=400&q=80',
        price: { adoptionFee: 350000, annualManagementFee: 50000 },
        estimatedYield: 20,
        status: 'available',
      },
      {
        _id: 'tree_2',
        treeNumber: 'A-16',
        variety: '천혜향',
        age: 5,
        image: 'https://images.unsplash.com/photo-1590502593747-42a996133562?w=400&q=80',
        price: { adoptionFee: 350000, annualManagementFee: 50000 },
        estimatedYield: 22,
        status: 'available',
      },
    ],
  },
  {
    _id: 'farm_2',
    name: '고흥 레몬 팜',
    location: {
      address: '전라남도 고흥군',
      latitude: 34.6112,
      longitude: 127.286,
    },
    description:
      '국내 최대 레몬 생산지 고흥에서 직접 키운 신선한 레몬나무를 분양합니다. 향긋한 레몬을 직접 수확해 보세요.',
    image: FARM_SHOWCASE_IMAGES.lemonOrchard,
    facilities: ['주차장', '화장실', '카페'],
    stats: { availableTrees: 8, totalTrees: 30 },
    trees: [
      {
        _id: 'tree_3',
        treeNumber: 'L-01',
        variety: '레몬',
        age: 4,
        image: 'https://images.unsplash.com/photo-1568569350062-ebfa3cb195df?w=400&q=80',
        price: { adoptionFee: 280000, annualManagementFee: 40000 },
        estimatedYield: 15,
        status: 'available',
      },
    ],
  },
  {
    _id: 'farm_3',
    name: '영천 복숭아 마을',
    location: {
      address: '경상북도 영천시',
      latitude: 35.9733,
      longitude: 128.9386,
    },
    description:
      '달콤한 복숭아를 직접 수확하는 즐거움을 느껴 보세요. 햇살 가득한 영천에서 자란 복숭아입니다.',
    image: FARM_SHOWCASE_IMAGES.peachTree,
    facilities: ['주차장', '화장실', '캠핑장'],
    stats: { availableTrees: 5, totalTrees: 25 },
    trees: [
      {
        _id: 'tree_4',
        treeNumber: 'P-05',
        variety: '복숭아',
        age: 6,
        image: 'https://images.unsplash.com/photo-1623227866882-c005c207758f?w=400&q=80',
        price: { adoptionFee: 300000, annualManagementFee: 45000 },
        estimatedYield: 18,
        status: 'available',
      },
    ],
  },
  {
    _id: 'farm_4',
    name: '상주 사과원',
    location: {
      address: '경상북도 상주시',
      latitude: 36.4109,
      longitude: 128.1591,
    },
    description: '경북 상주의 일교차 큰 기후에서 자라 당도 높은 사과를 생산합니다.',
    image: FARM_SHOWCASE_IMAGES.appleOrchard,
    facilities: ['주차장', '화장실', '체험장'],
    stats: { availableTrees: 15, totalTrees: 80 },
    trees: [
      {
        _id: 'tree_5',
        treeNumber: 'A-10',
        variety: '사과',
        age: 7,
        image: 'https://images.unsplash.com/photo-1568702846914-96b305d2ebb2?w=400&q=80',
        price: { adoptionFee: 400000, annualManagementFee: 60000 },
        estimatedYield: 25,
        status: 'available',
      },
    ],
  },
  {
    _id: 'farm_5',
    name: '여수 한라봉 농장',
    location: {
      address: '전라남도 여수시',
      latitude: 34.7604,
      longitude: 127.6622,
    },
    description: '여수 바다의 해풍을 맞고 자라 더욱 달콤한 한라봉을 맛보세요.',
    image: FARM_SHOWCASE_IMAGES.citrusLane,
    facilities: ['주차장', '화장실', '카페', '바베큐장'],
    stats: { availableTrees: 20, totalTrees: 60 },
    trees: [
      {
        _id: 'tree_6',
        treeNumber: 'H-08',
        variety: '한라봉',
        age: 5,
        image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=400&q=80',
        price: { adoptionFee: 380000, annualManagementFee: 55000 },
        estimatedYield: 22,
        status: 'available',
      },
    ],
  },
  {
    _id: 'farm_6',
    name: '청도 딸기 마을',
    location: {
      address: '경상북도 청도군',
      latitude: 35.6482,
      longitude: 128.7364,
    },
    description: '딸기의 고장 청도에서 직접 키운 딸기를 수확해 보세요.',
    image: FARM_SHOWCASE_IMAGES.strawberryField,
    facilities: ['주차장', '화장실', '체험관'],
    stats: { availableTrees: 30, totalTrees: 100 },
    trees: [
      {
        _id: 'tree_7',
        treeNumber: 'S-12',
        variety: '딸기',
        age: 1,
        image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&q=80',
        price: { adoptionFee: 150000, annualManagementFee: 30000 },
        estimatedYield: 5,
        status: 'available',
      },
    ],
  },
  {
    _id: 'farm_7',
    name: '무주 배나무원',
    location: {
      address: '전라북도 무주군',
      latitude: 35.9314,
      longitude: 127.6602,
    },
    description: '무주의 맑은 물과 공기에서 자란 달콤한 배를 분양합니다.',
    image: FARM_SHOWCASE_IMAGES.pearOrchard,
    facilities: ['주차장', '화장실', '산책로'],
    stats: { availableTrees: 10, totalTrees: 40 },
    trees: [
      {
        _id: 'tree_8',
        treeNumber: 'R-03',
        variety: '배',
        age: 8,
        image: 'https://images.unsplash.com/photo-1514756331096-7f14285e2e3d?w=400&q=80',
        price: { adoptionFee: 320000, annualManagementFee: 48000 },
        estimatedYield: 28,
        status: 'available',
      },
    ],
  },
  {
    _id: 'farm_8',
    name: '남해 유자 농장',
    location: {
      address: '경상남도 남해군',
      latitude: 34.8377,
      longitude: 127.8925,
    },
    description: '남해의 따뜻한 기후에서 자란 향긋한 유자를 만나보세요.',
    image: FARM_SHOWCASE_IMAGES.tangerineTree,
    facilities: ['주차장', '화장실', '카페'],
    stats: { availableTrees: 18, totalTrees: 55 },
    trees: [
      {
        _id: 'tree_9',
        treeNumber: 'Y-07',
        variety: '유자',
        age: 6,
        image: 'https://images.unsplash.com/photo-1596451190630-186aff535bf2?w=400&q=80',
        price: { adoptionFee: 290000, annualManagementFee: 42000 },
        estimatedYield: 16,
        status: 'available',
      },
    ],
  },
];

export function getFarmsWithLiveAvailability(adoptedTreeIds: Iterable<string> = []) {
  const adoptedTreeIdSet = toAdoptedTreeIdSet(adoptedTreeIds);

  return farms.map((farm) => {
    const trees = farm.trees.map((tree) => ({
      ...tree,
      status: resolveTreeStatus(tree, adoptedTreeIdSet),
    }));
    const availableTrees = trees.filter((tree) => tree.status === 'available').length;

    return {
      ...farm,
      trees,
      stats: {
        ...farm.stats,
        availableTrees,
      },
    };
  });
}

export function getFarmById(farmId: string, adoptedTreeIds: Iterable<string> = []) {
  const liveFarms = getFarmsWithLiveAvailability(adoptedTreeIds);

  return liveFarms.find((farm) => farm._id === farmId) ?? liveFarms[0];
}

export const farmsById = Object.fromEntries(farms.map((farm) => [farm._id, farm])) as Record<
  string,
  Farm
>;
