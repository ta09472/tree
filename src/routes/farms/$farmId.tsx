import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, MapPin, TreePine } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';

const farmsData: Record<
  string,
  {
    name: string;
    location: { address: string };
    description: string;
    image: string;
    facilities: string[];
    trees: Array<{
      _id: string;
      treeNumber: string;
      variety: string;
      age: number;
      image: string;
      price: { adoptionFee: number; annualManagementFee: number };
      estimatedYield: number;
      status: string;
    }>;
  }
> = {
  farm_1: {
    name: '제주 햇살 농장',
    location: { address: '제주특별자치도 서귀포시 안덕면' },
    description:
      '제주의 깨끗한 공기와 풍부한 일조량으로 자라는 프리미엄 천혜향을 만나보세요. 30년 전통의 농장에서 정성껏 키운 나무들을 분양합니다.',
    image: 'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=800&q=80',
    facilities: ['주차장', '화장실', '카페'],
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
  farm_2: {
    name: '고흥 레몬 팜',
    location: { address: '전라남도 고흥군' },
    description:
      '국내 최대 레몬 생산지 고흥에서 직접 키운 신선한 레몬나무를 분양합니다. 향긋한 레몬을 직접 수확해 보세요.',
    image: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?w=800&q=80',
    facilities: ['주차장', '화장실', '카페'],
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
  farm_3: {
    name: '영천 복숭아 마을',
    location: { address: '경상북도 영천시' },
    description:
      '달콤한 복숭아를 직접 수확하는 즐거움을 느껴 보세요. 햇살 가득한 영천에서 자란 복숭아입니다.',
    image: 'https://images.unsplash.com/photo-1629753250291-979952613877?w=800&q=80',
    facilities: ['주차장', '화장실', '캠핑장'],
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
  farm_4: {
    name: '상주 사과원',
    location: { address: '경상북도 상주시' },
    description: '경북 상주의 일교차 큰 기후에서 자라 당도 높은 사과를 생산합니다.',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=80',
    facilities: ['주차장', '화장실', '체험장'],
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
  farm_5: {
    name: '여수 한라봉 농장',
    location: { address: '전라남도 여수시' },
    description: '여수 바다의 해풍을 맞고 자라 더욱 달콤한 한라봉을 맛보세요.',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&q=80',
    facilities: ['주차장', '화장실', '카페', '바베큐장'],
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
  farm_6: {
    name: '청도 딸기 마을',
    location: { address: '경상북도 청도군' },
    description: '딸기의 고장 청도에서 직접 키운 딸기를 수확해 보세요.',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80',
    facilities: ['주차장', '화장실', '체험관'],
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
  farm_7: {
    name: '무주 배나무원',
    location: { address: '전라북도 무주군' },
    description: '무주의 맑은 물과 공기에서 자란 달콤한 배를 분양합니다.',
    image: 'https://images.unsplash.com/photo-1514756331096-7f14285e2e3d?w=800&q=80',
    facilities: ['주차장', '화장실', '산책로'],
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
  farm_8: {
    name: '남해 유자 농장',
    location: { address: '경상남도 남해군' },
    description: '남해의 따뜻한 기후에서 자란 향긋한 유자를 만나보세요.',
    image: 'https://images.unsplash.com/photo-1596451190630-186aff535bf2?w=800&q=80',
    facilities: ['주차장', '화장실', '카페'],
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
};

export const Route = createFileRoute('/farms/$farmId')({
  component: FarmDetailPage,
});

function FarmDetailPage() {
  const { farmId } = Route.useParams();
  const farm = farmsData[farmId] || farmsData['farm_1'];

  return (
    <main className="page-wrap py-8">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          뒤로
        </Link>

        <div className="relative mb-6 max-h-48 overflow-hidden rounded-xl sm:max-h-56">
          <img 
            src={farm.image} 
            alt={farm.name} 
            className="h-full w-full object-cover max-h-48 sm:max-h-56" 
          />
        </div>

        <h1 className="mb-2 text-2xl font-bold text-foreground">{farm.name}</h1>
        <div className="mb-4 flex items-center gap-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          {farm.location.address}
        </div>
        <p className="mb-4 text-muted-foreground">{farm.description}</p>

        <div className="mb-8 flex flex-wrap gap-2">
          {farm.facilities.map((facility: string) => (
            <span
              key={facility}
              className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
            >
              {facility}
            </span>
          ))}
        </div>

        <h2 className="mb-4 text-lg font-bold text-foreground">분양 가능한 나무</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          {farm.trees
            .filter((t: { status: string }) => t.status === 'available')
            .map((tree, index) => (
              <motion.div
                key={tree._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-md">
                  <div className="aspect-square">
                    {tree.image ? (
                      <img
                        src={tree.image}
                        alt={tree.treeNumber}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-muted">
                        <TreePine className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <div>
                        <h3 className="font-bold text-foreground">{tree.variety}</h3>
                        <p className="text-sm text-muted-foreground">{tree.treeNumber}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">
                          {tree.price.adoptionFee.toLocaleString()}원
                        </p>
                      </div>
                    </div>

                    <p className="mb-3 text-sm text-muted-foreground">
                      예상 수확량 {tree.estimatedYield}kg · 연 관리비{' '}
                      {tree.price.annualManagementFee.toLocaleString()}원
                    </p>

                    <Link to="/trees/$treeId" params={{ treeId: tree._id }}>
                      <Button className="w-full">상세 보기</Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </motion.div>
    </main>
  );
}
