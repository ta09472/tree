import { createFileRoute, Link } from '@tanstack/react-router';
import { ArrowLeft, MapPin, TreePine } from 'lucide-react';
import { domAnimation, LazyMotion, m } from 'motion/react';
import { OrchardPicker } from '#/components/farms/OrchardPicker';
import { getFarmById } from '#/data/farms';
import { useMyTreeAdoptions } from '#/lib/my-tree-adoptions';
import { Button } from '#/components/ui/button';

export const Route = createFileRoute('/farms/$farmId')({
  component: FarmDetailPage,
});

function FarmDetailPage() {
  const { farmId } = Route.useParams();
  const myAdoptions = useMyTreeAdoptions();
  const adoptedTreeIds = new Set(myAdoptions.map((adoption) => adoption.treeId));
  const farm = getFarmById(farmId, adoptedTreeIds);
  const availableTrees = farm.trees.filter((tree) => tree.status === 'available');

  return (
    <LazyMotion features={domAnimation}>
      <main className="page-wrap py-8">
        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Link
          to="/"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          홈으로 돌아가기
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

        <div className="mb-8">
          <OrchardPicker
            farm={farm}
            description="남은 구역을 한눈에 보고 원하는 자리를 고르세요. 마음에 드는 칸을 누르면 해당 나무 상세와 분양 안내로 이어집니다."
          />
        </div>

        <div id="available-trees" className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-foreground">분양 가능한 나무</h2>
          <span className="text-sm text-muted-foreground">{availableTrees.length}그루 남음</span>
        </div>

        {availableTrees.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border bg-card px-6 py-10 text-center">
            <TreePine className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-base font-semibold text-foreground">
              지금은 분양 가능한 나무가 없습니다
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              이미 선택한 나무는 마이트리에서 확인하실 수 있고,
              다른 농장은 홈에서 둘러보실 수 있습니다.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link to="/my">
                <Button variant="outline">마이트리 보기</Button>
              </Link>
              <Link to="/">
                <Button>다른 농장 보기</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {availableTrees.map((tree, index) => (
              <m.div
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
                      <Button className="w-full">상세 보고 고르기</Button>
                    </Link>
                  </div>
                </div>
              </m.div>
            ))}
          </div>
        )}
        </m.div>
      </main>
    </LazyMotion>
  );
}
