import { createFileRoute, Link } from '@tanstack/react-router';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';

const mockFarms = [
  {
    _id: 'farm_1',
    name: '제주 햇살 농장',
    location: { address: '제주특별자치도 서귀포시' },
    description: '제주의 깨끗한 공기와 풍부한 일조량으로 자라는 프리미엄 천혜향을 만나보세요.',
    image: 'https://images.unsplash.com/photo-1590419690008-905895e8fe0d?w=800&q=80',
    facilities: ['주차장', '화장실', '카페'],
    stats: { availableTrees: 12, totalTrees: 50 },
  },
  {
    _id: 'farm_2',
    name: '고흥 레몬 팜',
    location: { address: '전라남도 고흥군' },
    description: '국내 최대 레몬 생산지 고흥에서 직접 키운 신선한 레몬나무를 분양합니다.',
    image: 'https://images.unsplash.com/photo-1514326640560-7d063ef2aed5?w=800&q=80',
    facilities: ['주차장', '화장실'],
    stats: { availableTrees: 8, totalTrees: 30 },
  },
  {
    _id: 'farm_3',
    name: '영천 복숭아 마을',
    location: { address: '경상북도 영천시' },
    description: '달콤한 복숭아를 직접 수확하는 즐거움을 느껴 보세요.',
    image: 'https://images.unsplash.com/photo-1629753250291-979952613877?w=800&q=80',
    facilities: ['주차장', '화장실', '캠핑장'],
    stats: { availableTrees: 5, totalTrees: 25 },
  },
  {
    _id: 'farm_4',
    name: '상주 사과원',
    location: { address: '경상북도 상주시' },
    description: '경북 상주의 일교차 큰 기후에서 자라 당도 높은 사과를 생산합니다.',
    image: 'https://images.unsplash.com/photo-1567306226416-28f0efdc88ce?w=800&q=80',
    facilities: ['주차장', '화장실', '체험장'],
    stats: { availableTrees: 15, totalTrees: 80 },
  },
  {
    _id: 'farm_5',
    name: '여수 한라봉 농장',
    location: { address: '전라남도 여수시' },
    description: '여수 바다의 해풍을 맞고 자라 더욱 달콤한 한라봉을 맛보세요.',
    image: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?w=800&q=80',
    facilities: ['주차장', '화장실', '카페', '바베큐장'],
    stats: { availableTrees: 20, totalTrees: 60 },
  },
  {
    _id: 'farm_6',
    name: '청도 딸기 마을',
    location: { address: '경상북도 청도군' },
    description: '딸기의 고장 청도에서 직접 키운 딸기를 수확해 보세요.',
    image: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=800&q=80',
    facilities: ['주차장', '화장실', '체험관'],
    stats: { availableTrees: 30, totalTrees: 100 },
  },
  {
    _id: 'farm_7',
    name: '무주 배나무원',
    location: { address: '전라북도 무주군' },
    description: '무주의 맑은 물과 공기에서 자란 달콤한 배를 분양합니다.',
    image: 'https://images.unsplash.com/photo-1514756331096-7f14285e2e3d?w=800&q=80',
    facilities: ['주차장', '화장실', '산책로'],
    stats: { availableTrees: 10, totalTrees: 40 },
  },
  {
    _id: 'farm_8',
    name: '남해 유자 농장',
    location: { address: '경상남도 남해군' },
    description: '남해의 따뜻한 기후에서 자란 향긋한 유자를 만나보세요.',
    image: 'https://images.unsplash.com/photo-1596451190630-186aff535bf2?w=800&q=80',
    facilities: ['주차장', '화장실', '카페'],
    stats: { availableTrees: 18, totalTrees: 55 },
  },
];

export const Route = createFileRoute('/')({
  component: FarmsPage,
});

function FarmsPage() {
  return (
    <main className="page-wrap py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="mb-2 text-2xl font-bold text-foreground">나만의 나무를 분양받아보세요</h1>
        <p className="text-muted-foreground">
          전국 각지의 우수한 농장에서 건강한 과일나무를 분양받고, 신선한 과일을 집까지 배송받으세요.
        </p>
      </motion.div>

      <div className="grid items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {mockFarms.map((farm, index) => (
          <motion.div
            key={farm._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              to="/farms/$farmId"
              params={{ farmId: farm._id }}
              className="group block overflow-hidden rounded-xl border border-border bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg"
            >
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={farm.image}
                  alt={farm.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white shadow-md">
                  {farm.stats.availableTrees}그루 분양가능
                </div>
              </div>

              <div className="flex flex-1 flex-col p-4">
                <h2 className="mb-1 text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                  {farm.name}
                </h2>
                <div className="mb-2 flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {farm.location.address}
                </div>
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                  {farm.description}
                </p>
                <div className="mt-auto flex flex-wrap gap-2">
                  {farm.facilities.map((facility: string) => (
                    <span
                      key={facility}
                      className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                    >
                      {facility}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
