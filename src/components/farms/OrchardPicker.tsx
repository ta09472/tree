import { Link } from '@tanstack/react-router';
import type { Farm } from '#/data/farms';
import { treeDetailsById } from '#/data/tree-details';
import { cn } from '#/lib/utils';

type OrchardPickerProps = {
  className?: string;
  description?: string;
  farm: Farm;
  selectedTreeId?: string;
  title?: string;
};

function OrchardPicker({
  className,
  description = '영화관 좌석처럼 남은 구역을 바로 보면서 원하는 나무를 고를 수 있습니다. 선택 가능한 칸을 누르면 해당 나무 상세로 이어집니다.',
  farm,
  selectedTreeId,
  title = '남은 구역을 보고 원하는 나무를 고르세요',
}: OrchardPickerProps) {
  const orchardTrees = farm.trees
    .map((farmTree) => {
      const detail = treeDetailsById[farmTree._id];

      if (!detail) {
        return null;
      }

      return {
        ...farmTree,
        location: detail.location,
      };
    })
    .filter(
      (
        orchardTree
      ): orchardTree is Farm['trees'][number] & {
        location: { row: number; col: number };
      } => orchardTree !== null
    );

  const orchardRows = Array.from(
    new Set(orchardTrees.map((orchardTree) => orchardTree.location.row))
  )
    .sort((a, b) => a - b)
    .map((row) => ({
      row,
      items: orchardTrees
        .filter((orchardTree) => orchardTree.location.row === row)
        .sort((a, b) => a.location.col - b.location.col),
    }));
  return null;
  // biome-ignore lint/correctness/noUnreachable: <explanation>
  return (
    <section
      id="orchard-picker"
      className={cn('rounded-3xl border border-border bg-card p-6 shadow-sm lg:p-8', className)}
    >
      <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Orchard picker</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground">{title}</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {selectedTreeId ? (
            <LegendChip
              label="현재 선택"
              className="border-primary bg-primary text-primary-foreground"
            />
          ) : null}
          <LegendChip label="선택 가능" className="border-border bg-card text-foreground" />
          <LegendChip label="분양 완료" className="border-border bg-muted text-muted-foreground" />
        </div>
      </div>

      <div className="mt-8 space-y-4">
        {orchardRows.map((row) => (
          <div
            key={row.row}
            className="grid gap-3 md:grid-cols-[48px_minmax(0,1fr)] md:items-center"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-muted/40 text-sm font-semibold text-foreground">
              {toRowLabel(row.row)}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {row.items.map((orchardTree) => {
                const isSelectedTree = orchardTree._id === selectedTreeId;
                const isSelectable = orchardTree.status === 'available';

                if (!isSelectable) {
                  return (
                    <button
                      key={orchardTree._id}
                      type="button"
                      disabled
                      className="rounded-2xl border border-border bg-muted px-3 py-4 text-left opacity-70"
                    >
                      <p className="text-sm font-semibold text-muted-foreground">
                        {orchardTree.treeNumber}
                      </p>
                      <p className="mt-2 text-xs text-muted-foreground">분양 완료</p>
                    </button>
                  );
                }

                return (
                  <Link
                    key={orchardTree._id}
                    to="/trees/$treeId"
                    params={{ treeId: orchardTree._id }}
                    className={
                      isSelectedTree
                        ? 'rounded-2xl border border-primary bg-primary px-3 py-4 text-left text-primary-foreground shadow-sm'
                        : 'rounded-2xl border border-border bg-card px-3 py-4 text-left transition-colors hover:border-primary hover:bg-muted/40'
                    }
                  >
                    <p
                      className={
                        isSelectedTree
                          ? 'text-sm font-semibold'
                          : 'text-sm font-semibold text-foreground'
                      }
                    >
                      {orchardTree.treeNumber}
                    </p>
                    <p
                      className={
                        isSelectedTree
                          ? 'mt-2 text-xs text-primary-foreground/80'
                          : 'mt-2 text-xs text-muted-foreground'
                      }
                    >
                      예상 {orchardTree.estimatedYield}kg
                    </p>
                    <p
                      className={
                        isSelectedTree
                          ? 'mt-1 text-xs text-primary-foreground/80'
                          : 'mt-1 text-xs text-muted-foreground'
                      }
                    >
                      분양가 {orchardTree.price.adoptionFee.toLocaleString()}원
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function LegendChip({ label, className }: { className: string; label: string }) {
  return (
    <span className={cn('rounded-full border px-3 py-1 font-medium', className)}>{label}</span>
  );
}

function toRowLabel(row: number) {
  return String.fromCharCode(64 + row);
}

export { OrchardPicker };
