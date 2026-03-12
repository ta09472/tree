import { Camera, Leaf, MapPin } from 'lucide-react';
import { Badge } from '#/components/ui/badge';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '#/components/ui/carousel';
import { cn } from '#/lib/utils';

export type FeatureCarouselSlide = {
  alt: string;
  description: string;
  eyebrow: string;
  image: string;
  title: string;
};

type FeatureWithImageCarouselProps = {
  badge?: string;
  className?: string;
  description?: string;
  eyebrow?: string;
  slides?: FeatureCarouselSlide[];
  title?: string;
};

const DEFAULT_SLIDES: FeatureCarouselSlide[] = [
  {
    eyebrow: '대표 하우스',
    title: '실제 재배 환경을 먼저 확인하세요',
    description: '처음 보는 순간부터 농장의 분위기와 관리 상태를 확인할 수 있습니다.',
    image:
      'https://images.unsplash.com/photo-1464226184884-fa280b87c399?auto=format&fit=crop&w=1200&q=80',
    alt: '농장 하우스 전경',
  },
  {
    eyebrow: '생육 상태',
    title: '과실 컨디션이 곧 분양 신뢰입니다',
    description: '광택, 색감, 수세 같은 디테일을 직접 보며 안심하고 고를 수 있습니다.',
    image:
      'https://images.unsplash.com/photo-1590502593747-42a996133562?auto=format&fit=crop&w=1200&q=80',
    alt: '생육 중인 감귤 과실',
  },
  {
    eyebrow: '현장 동선',
    title: '방문과 수확의 분위기까지 미리 보입니다',
    description: '어디에서 어떤 분위기로 수확하게 될지 미리 떠올릴 수 있습니다.',
    image:
      'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80',
    alt: '방문 동선이 보이는 농장 풍경',
  },
];

const SUPPORT_POINTS = [
  {
    title: '현장 공개',
    description: '실제 재배 환경을 먼저 보여드려 처음 방문한 분도 안심하고 고를 수 있습니다.',
    icon: Camera,
  },
  {
    title: '생육 상태',
    description: '광택, 색감, 수세를 직접 확인하며 분양할 나무를 비교할 수 있습니다.',
    icon: Leaf,
  },
  {
    title: '방문 경험',
    description: '어디에서 어떤 분위기로 수확하게 될지 미리 그려볼 수 있습니다.',
    icon: MapPin,
  },
] as const;

function FeatureWithImageCarousel({
  badge = 'Portfolio',
  className,
  description = '농장 전경, 과실 컨디션, 방문 분위기를 먼저 확인하면 한 그루를 고르는 기준이 훨씬 분명해집니다.',
  eyebrow = 'Orchard portfolio',
  slides = DEFAULT_SLIDES,
  title = '사진으로 먼저 확인하는 농장 분위기',
}: FeatureWithImageCarouselProps) {
  return (
    <section className={cn('w-full py-16 lg:py-24', className)}>
      <div className="page-wrap">
        <div className="overflow-hidden ">
          <div className="grid lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
            <div className="flex flex-col justify-between gap-8 border-b border-border  p-6 sm:p-8 lg:border-r lg:border-b-0 lg:p-10">
              <div>
                <Badge variant="outline">{badge}</Badge>
                <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                  {eyebrow}
                </p>
                <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                  {title}
                </h2>
                <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
                  {description}
                </p>
              </div>

              <div className="grid gap-3">
                {SUPPORT_POINTS.map((point) => {
                  const Icon = point.icon;

                  return (
                    <div
                      key={point.title}
                      className="rounded-3xl border border-border bg-background/85 p-4 shadow-sm"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/12 text-primary">
                          <Icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{point.title}</p>
                          <p className="mt-1 text-sm leading-6 text-muted-foreground">
                            {point.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            <div className="min-w-0 p-4 sm:p-6 lg:p-8">
              <Carousel className="w-full" opts={{ align: 'start', loop: true }}>
                <CarouselContent>
                  {slides.map((slide, index) => (
                    <CarouselItem key={`${slide.title}-${slide.image}`}>
                      <article className="overflow-hidden rounded-[1.75rem] border border-border bg-background shadow-sm">
                        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                          <img
                            src={slide.image}
                            alt={slide.alt}
                            className="h-full w-full object-cover"
                            loading={index === 0 ? 'eager' : 'lazy'}
                            decoding="async"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/15 to-transparent" />
                          <div className="absolute inset-x-5 bottom-5 flex items-center justify-between gap-3">
                            <Badge className="border-0 bg-background/92 text-foreground shadow-sm hover:bg-background/92">
                              {slide.eyebrow}
                            </Badge>
                            <span className="rounded-full bg-background/15 px-3 py-1 text-xs font-semibold text-background backdrop-blur">
                              {index + 1} / {slides.length}
                            </span>
                          </div>
                        </div>

                        <div className="p-5 sm:p-6">
                          <h3 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
                            {slide.title}
                          </h3>
                          <p className="mt-3 text-sm leading-7 text-muted-foreground sm:text-base">
                            {slide.description}
                          </p>
                        </div>
                      </article>
                    </CarouselItem>
                  ))}
                </CarouselContent>

                <CarouselPrevious className="top-[calc(50%-1.5rem)] left-4 border-border bg-background/92 shadow-sm backdrop-blur" />
                <CarouselNext className="top-[calc(50%-1.5rem)] right-4 border-border bg-background/92 shadow-sm backdrop-blur" />
              </Carousel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureDemo() {
  return (
    <div className="w-full">
      <FeatureWithImageCarousel />
    </div>
  );
}

const Feature = FeatureWithImageCarousel;

export { FeatureWithImageCarousel, Feature, FeatureDemo };
