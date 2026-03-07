import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, MapPin, TreePine } from 'lucide-react';
import { motion } from 'motion/react';
import { farmsById } from '#/data/farms';
import { Button } from '../../components/ui/button';

export const Route = createFileRoute('/farms/$farmId')({
  component: FarmDetailPage,
});

function FarmDetailPage() {
  const { farmId } = Route.useParams();
  const farm = farmsById[farmId] || farmsById.farm_1;

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
