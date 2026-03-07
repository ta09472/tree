import { createFileRoute, Link } from '@tanstack/react-router';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { farms } from '#/data/farms';

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
        {farms.map((farm, index) => (
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
