import { createFileRoute, Link } from '@tanstack/react-router';
import { MapPin, TreePine } from 'lucide-react';
import { motion } from 'motion/react';
import { Button } from '../../components/ui/button';

// 목업 데이터 (Convex 연동 전까지 사용)
const mockFarms = [
  {
    _id: 'farm_1',
    name: '제주 햇살 농장',
    location: { address: '제주특별자치도 서귀포시' },
    description: '제주의 깨끗한 공기와 풍부한 일조량으로 자라는 프리미엄 천혜향을 만나보세요.',
    images: [],
    facilities: ['주차장', '화장실', '카페'],
    stats: { availableTrees: 12, totalTrees: 50 },
  },
  {
    _id: 'farm_2',
    name: '고흥 레몬 팜',
    location: { address: '전라남도 고흥군' },
    description: '국내 최대 레몬 생산지 고흥에서 직접 키운 신선한 레몬나무를 분양합니다.',
    images: [],
    facilities: ['주차장', '화장실'],
    stats: { availableTrees: 8, totalTrees: 30 },
  },
  {
    _id: 'farm_3',
    name: '영천 복숭아 마을',
    location: { address: '경상북도 영천시' },
    description: '달콤한 복숭아를 직접 수확하는 즐거움을 느껴보세요.',
    images: [],
    facilities: ['주차장', '화장실', '캠핑장'],
    stats: { availableTrees: 5, totalTrees: 25 },
  },
];

export const Route = createFileRoute('/farms/')({
  component: FarmsPage,
});

function FarmsPage() {
  const farms = mockFarms;

  return (
    <main className="page-wrap px-4 pb-8 pt-8">
      {/* Hero Section */}
      <section className="mb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl">
            나만의 나무를 분양받아보세요
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
            전국 각지의 우수한 농장에서 건강한 과일나무를 분양받고, 신선한 과일을 집까지
            배송받으세요.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="mb-12 grid grid-cols-3 gap-4">
        {[
          { label: '등록 농장', value: '50+' },
          { label: '분양된 나무', value: '1,200+' },
          { label: '누적 수확', value: '10t+' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-border bg-card p-4 text-center"
          >
            <div className="text-2xl font-bold text-primary">{stat.value}</div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </motion.div>
        ))}
      </section>

      {/* Farms List */}
      <section>
        <h2 className="mb-6 text-2xl font-bold text-foreground">제휴 농장</h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {farms.map((farm, index) => (
            <motion.div
              key={farm._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to="/farms/$farmId"
                params={{ farmId: farm._id }}
                className="group block overflow-hidden rounded-2xl border border-border bg-card transition hover:border-primary/30 hover:shadow-lg"
              >
                {/* Farm Image */}
                <div className="relative aspect-video bg-muted">
                  {farm.images?.[0] ? (
                    <img
                      src={farm.images[0]}
                      alt={farm.name}
                      className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-muted-foreground">
                      <TreePine className="h-16 w-16" />
                    </div>
                  )}
                  <div className="absolute right-3 top-3 rounded-full bg-primary px-3 py-1 text-xs font-bold text-white">
                    {farm.stats.availableTrees}그루 분양가능
                  </div>
                </div>

                {/* Farm Info */}
                <div className="p-4">
                  <h3 className="mb-1 text-lg font-bold text-foreground group-hover:text-primary">
                    {farm.name}
                  </h3>
                  <div className="mb-3 flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {farm.location.address}
                  </div>
                  <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                    {farm.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {farm.facilities?.slice(0, 3).map((facility: string) => (
                      <span
                        key={facility}
                        className="rounded-full bg-secondary px-2 py-1 text-xs text-secondary-foreground"
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
      </section>

      {/* CTA */}
      <section className="mt-16 text-center">
        <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
          <h3 className="mb-2 text-xl font-bold text-foreground">농장주이신가요?</h3>
          <p className="mb-4 text-muted-foreground">
            여러분의 농장을 등록하고 새로운 수익 창출 기회를 만나보세요.
          </p>
          <Button size="lg">농장 등록하기</Button>
        </div>
      </section>
    </main>
  );
}
