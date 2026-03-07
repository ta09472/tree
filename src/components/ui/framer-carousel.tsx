import type { ReactNode } from 'react';
import { useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { animate, motion, useMotionValue } from 'motion/react';
import { cn } from '#/lib/utils';

export type FramerCarouselItem = {
  id: string;
  title: string;
  description: string;
  image?: string;
};

type FramerCarouselProps<TItem extends FramerCarouselItem> = {
  items: TItem[];
  className?: string;
  renderAction?: (item: TItem) => ReactNode;
};

export function FramerCarousel<TItem extends FramerCarouselItem>({
  items,
  className,
  renderAction,
}: FramerCarouselProps<TItem>) {
  const [index, setIndex] = useState(0);
  const [slideWidth, setSlideWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const indicatorLabelId = useId();
  const x = useMotionValue(0);

  useEffect(() => {
    if (!containerRef.current) {
      return;
    }

    const updateWidth = () => {
      setSlideWidth(containerRef.current?.offsetWidth ?? 0);
    };

    updateWidth();

    const resizeObserver = new ResizeObserver(updateWidth);
    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  useEffect(() => {
    animate(x, -index * slideWidth, {
      duration: 0.2,
      ease: 'easeInOut',
    });
  }, [index, slideWidth, x]);

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    setIndex((currentIndex) => Math.min(currentIndex, items.length - 1));
  }, [items.length]);

  if (items.length === 0) {
    return null;
  }

  const activeItem = items[index];

  return (
    <section className={cn('overflow-hidden rounded-lg border border-border bg-card', className)}>
      <div ref={containerRef} className="overflow-hidden">
        <motion.div className="flex" style={{ x }}>
          {items.map((item) => (
            <article key={item.id} className="w-full shrink-0">
              <div className="grid min-h-60 md:grid-cols-[minmax(0,1.2fr)_320px]">
                <div className="flex flex-col justify-between gap-5 p-5 md:p-6">
                  <div className="space-y-2">
                    <p className="text-base font-semibold text-foreground">{item.title}</p>
                    <p className="max-w-xl text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                  </div>

                  {renderAction ? renderAction(item) : null}
                </div>

                <div className="border-t border-border bg-muted md:border-l md:border-t-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="h-full w-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="h-full min-h-48 bg-muted" aria-hidden="true" />
                  )}
                </div>
              </div>
            </article>
          ))}
        </motion.div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIndex((currentIndex) => Math.max(0, currentIndex - 1))}
            disabled={index === 0}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground"
            aria-label="이전 배너"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            type="button"
            onClick={() => setIndex((currentIndex) => Math.min(items.length - 1, currentIndex + 1))}
            disabled={index === items.length - 1}
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground"
            aria-label="다음 배너"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="flex min-w-0 items-center justify-end gap-3">
          <div className="flex items-center gap-1.5" role="tablist" aria-labelledby={indicatorLabelId}>
            {items.map((item, itemIndex) => {
              const isActive = itemIndex === index;

              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`${itemIndex + 1}번째 배너 보기`}
                  onClick={() => setIndex(itemIndex)}
                  className={cn(
                    'h-2 rounded-sm transition-colors',
                    isActive ? 'w-8 bg-foreground' : 'w-4 bg-border hover:bg-muted-foreground'
                  )}
                />
              );
            })}
          </div>
          <span id={indicatorLabelId} className="text-sm text-muted-foreground">
            {index + 1} / {items.length}
          </span>
        </div>
      </div>

      <div className="sr-only" aria-live="polite">
        {activeItem.title}
      </div>
    </section>
  );
}
