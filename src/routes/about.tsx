import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Droplets,
  Leaf,
  ShieldCheck,
  Sparkles,
  Sprout,
} from 'lucide-react';
import { Badge } from '#/components/ui/badge';
import { buttonVariants } from '#/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '#/components/ui/card';

const FEATURED_FARM_ID = 'farm_1';
const GUIDE_IMAGES = {
  hero: '/citrus-landscape.png',
  orchard: '/citrus-tree.png',
  harvest: '/citrus-harvest.png',
} as const;

const GUIDE_METRICS = [
  { label: '개화 시기', value: '4월 중순 안팎', note: '제주 작형 기준' },
  { label: '평균 과중', value: '282.1g', note: '편구형 과실' },
  { label: '평균 당도', value: '12.6 °Bx', note: '산 함량 0.94%' },
  { label: '수확 판단', value: '완전 착색 후 약 10일', note: '출하 기준 별도 적용' },
] as const;

const CULTIVATION_POINTS = [
  {
    title: '봄철 수분 관리',
    description:
      '제주농업기술원 자료에서는 2~3월 물 부족이 잎, 꽃, 과실 비대에 악영향을 주고 생리 낙과를 키울 수 있다고 안내합니다.',
    icon: Droplets,
  },
  {
    title: '열매솎기 마감 시점',
    description:
      '최종 열매솎기는 6월 상중순에 하고, 엽과비는 100~120:1 수준으로 맞춘 뒤 7월 상순 이전에 마무리하는 흐름이 권장됩니다.',
    icon: Sprout,
  },
  {
    title: '품질 판정 기준',
    description:
      '서귀포농업기술센터 안내 기준으로는 수확 적기를 과피 완전 착색 후 약 10일로 보고, 출하 시 과실 너비 61mm 이상, 당도 13브릭스 이상, 산 함량 1.1% 이하를 핵심 기준으로 제시합니다.',
    icon: BadgeCheck,
  },
  {
    title: '병해충 체크 포인트',
    description:
      '총채벌레, 응애, 진딧물, 깍지벌레 피해를 집중 점검해야 하고, 겨울철 보온과 봄철 수분 관리가 과실 균일도에 직접 영향을 줍니다.',
    icon: ShieldCheck,
  },
] as const;

const QUALITY_ROWS = [
  ['국내 유통명', '천혜향'],
  ['일본 품종명', '세토카(Setoka)'],
  ['육성 계통', '청견 × 앙콜 F1에 머코트(Murcott)를 교배한 계통으로 소개됨'],
  ['과형', '편구형'],
  ['껍질 특성', '향이 강하고 비교적 얇은 편으로 정리됨'],
  ['평균 과중', '282.1g'],
  ['평균 당도', '12.6 °Bx'],
  ['평균 산 함량', '0.94%'],
  ['출하 판정 예시', '너비 61mm 이상, 당도 13 °Bx 이상, 산 함량 1.1% 이하'],
] as const;

const FAQS = [
  {
    question: '천혜향은 언제쯤 수확하고 안내받게 되나요?',
    answer:
      '세부 일정은 작형과 해걸이 상태에 따라 달라지지만, 현장에서는 겨울철 착색과 산도 저하 추이를 보며 수확 적기를 판단합니다. 이 사이트에서는 농장이 직접 생육 소식과 수확 일정을 안내하는 흐름으로 운영합니다.',
  },
  {
    question: '왜 농장 페이지에서 먼저 구역을 고르게 했나요?',
    answer:
      '천혜향은 과실 상태뿐 아니라 위치, 생육 균일도, 주변 수세까지 같이 봐야 판단이 쉽습니다. 그래서 상세 페이지보다 농장 페이지에서 전체 구역을 먼저 보게 구성했습니다.',
  },
  {
    question: '안내 페이지의 수치가 모든 나무에 그대로 적용되나요?',
    answer:
      '아닙니다. 안내 페이지의 수치는 공식 자료에 나온 품종 특성과 출하 기준을 요약한 값이고, 실제 과중·당도·산도는 작형, 해거리, 수세, 착과량, 기상에 따라 달라질 수 있습니다.',
  },
] as const;

const SOURCES = [
  {
    title: '제주특별자치도 농업기술원, 2021년 천혜향 재배기술',
    href: 'https://agri.jeju.go.kr/agri/reference/technology.htm?act=view&seq=50097',
    note: '봄철 수분 관리, 열매솎기 시기, 병해충 관리 포인트 참고',
  },
  {
    title: '서귀포시 농업기술센터, 천혜향 재배의 핵심! 꽃 관리와 열매솎기',
    href: 'https://www.seogwipo.go.kr/agriculture/farmingcenter/technology_tutoring/technology_tutoring_4.htm?act=view&seq=152691&page=7',
    note: '출하 기준, 착색 후 수확 적기, 적과와 꽃 관리 참고',
  },
  {
    title: '제주특별자치도, 새콤달콤 천혜향 속에 이런 비밀이?',
    href: 'https://www.jeju.go.kr/news/healthnews.htm?act=view&seq=1111674',
    note: '품종명, 육성 계통, 평균 과중·당도·산 함량 및 감귤 기능성 성분 소개 참고',
  },
] as const;

export const Route = createFileRoute('/about')({
  component: CheonhyehyangGuidePage,
});

function CheonhyehyangGuidePage() {
  return (
    <main className="pb-20">
      <section className="border-b border-border bg-muted/30">
        <div className="page-wrap grid gap-8 py-14 sm:py-16 lg:grid-cols-[minmax(0,1fr)_440px] lg:items-center">
          <div>
            <Badge variant="outline">Cheonhyehyang guide</Badge>
            <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-foreground text-balance sm:text-5xl lg:text-6xl">
              천혜향 분양안내,
              <br className="hidden sm:block" />
              고르기 전에 꼭 알아두세요
            </h1>
            <p className="mt-5 max-w-4xl text-base leading-8 text-muted-foreground sm:text-lg">
              제주 햇살 농장은 천혜향을 단순히 판매하지 않습니다.
              <br className="hidden sm:block" />
              품종 특성, 착과 관리, 출하 기준, 수확 판단 포인트까지 함께 안내해 안심하고 고르실 수
              있게 돕습니다.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/farms/$farmId"
                params={{ farmId: FEATURED_FARM_ID }}
                hash="orchard-picker"
                className={buttonVariants({
                  className: 'h-12 rounded-full px-6 text-sm font-semibold',
                })}
              >
                분양 구역 바로 보기
              </Link>
              <Link
                to="/"
                hash="location"
                className={buttonVariants({
                  variant: 'outline',
                  className: 'h-12 rounded-full px-6 text-sm font-semibold',
                })}
              >
                농장 위치 확인
              </Link>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <img
              src={GUIDE_IMAGES.hero}
              alt="제주 천혜향 농장 전경"
              className="h-[320px] w-full object-cover sm:h-[380px]"
              loading="eager"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <p className="text-xs font-semibold tracking-[0.16em] uppercase text-white/70">
                Orchard overview
              </p>
              <p className="mt-2 text-2xl font-semibold">
                실제 재배 환경과 기준을 먼저 보고 고르는 분양 안내
              </p>
              <p className="mt-2 max-w-md text-sm leading-6 text-white/80">
                나무 한 그루를 고르기 전에 농장 분위기, 작형, 수확 흐름을 먼저 이해할 수 있게
                정리했습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="page-wrap grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {GUIDE_METRICS.map((metric) => (
            <Card key={metric.label} className="border border-border shadow-sm">
              <CardHeader>
                <CardDescription className="text-xs font-semibold tracking-[0.18em] uppercase">
                  {metric.label}
                </CardDescription>
                <CardTitle className="text-3xl font-semibold tracking-tight">
                  {metric.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{metric.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="pb-14">
        <div className="page-wrap grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_360px]">
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Leaf className="h-4 w-4" />
                <span className="text-sm font-semibold">품종 개요</span>
              </div>
              <CardTitle className="text-3xl font-semibold tracking-tight">
                천혜향은 향과 당산비가
                <br className="hidden sm:block" />
                안정적인 만감류입니다
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground sm:text-base">
              <p>
                제주도 공식 자료에서는 천혜향을 국내 유통명으로, 일본 품종명은 세토카로 소개합니다.
                청견과 앙콜의 교배 계통에 머코트를 다시 교배한 품종으로 설명되며, 향이 강하고 과중이
                큰 만감류라는 점이 핵심입니다.
              </p>
              <p>
                같은 감귤류라도 천혜향은 단순히 달기만 한 과일로 보지 않고, 착색 시점과 산도 저하,
                과실 균일도, 착과량 관리를 함께 봐야 품질이 안정됩니다. 그래서 분양 페이지에서도
                나무 개별 정보보다 재배 기준과 구역 상태를 같이 보여주는 쪽이 더 맞습니다.
              </p>
            </CardContent>
          </Card>

          <div className="relative overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <img
              src={GUIDE_IMAGES.orchard}
              alt="천혜향 나무를 가까이서 본 모습"
              className="h-full min-h-[320px] w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-6 text-white">
              <div className="flex items-center gap-2 text-white/80">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">포인트</span>
              </div>
              <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                기준을 먼저 보여줄수록
                <br className="hidden sm:block" />더 안심하고 고를 수 있습니다
              </h3>
              <p className="mt-3 text-sm leading-7 text-white/80">
                좋은 천혜향이라고 말하는 것만으로는 부족합니다. 어떤 품종인지, 언제 수확하는지, 어떤
                기준으로 품질을 보는지까지 설명해야 농장의 전문성이 드러납니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-muted/30 py-14">
        <div className="page-wrap">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              Cultivation notes
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              천혜향 재배에서 먼저 봐야 할
              <br className="hidden sm:block" />
              핵심 포인트
            </h2>
            <p className="mt-4 text-sm leading-7 text-muted-foreground sm:text-base">
              제주 지역 공식 재배 자료에서 반복적으로 강조하는 항목만 추려 정리했습니다.
              <br className="hidden sm:block" />
              실제 농장에서도 이 기준을 운영 설명의 핵심으로 삼을 수 있습니다.
            </p>
          </div>

          <div className="mt-8 overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-stretch">
              <img
                src={GUIDE_IMAGES.harvest}
                alt="수확한 천혜향을 담아둔 모습"
                className="h-64 w-full object-cover lg:h-full"
                loading="lazy"
                decoding="async"
              />
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <p className="text-xs font-semibold tracking-[0.16em] text-muted-foreground uppercase">
                  Harvest cue
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
                  수확은 색만 보고 하지 않고,
                  <br className="hidden sm:block" />
                  착색 이후 흐름까지 봅니다
                </h3>
                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  과피가 완전히 올라온 뒤에도 당도와 산도, 과실 균일도를 같이 봐야 출하 품질이
                  안정됩니다. 이 페이지의 재배 포인트는 그 판단 기준을 먼저 이해하도록 돕습니다.
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {CULTIVATION_POINTS.map((point) => {
              const Icon = point.icon;

              return (
                <Card key={point.title} className="border border-border shadow-sm">
                  <CardHeader>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/12 text-primary">
                      <Icon className="h-5 w-5" />
                    </div>
                    <CardTitle className="text-xl font-semibold tracking-tight">
                      {point.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm leading-7 text-muted-foreground">{point.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="page-wrap grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <CalendarDays className="h-4 w-4" />
                <span className="text-sm font-semibold">품질 기준 요약</span>
              </div>
              <CardTitle className="text-3xl font-semibold tracking-tight">
                한눈에 보는 천혜향 품종 정보
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse text-left text-sm">
                  <tbody>
                    {QUALITY_ROWS.map(([label, value]) => (
                      <tr key={label} className="border-b border-border last:border-b-0">
                        <th className="w-40 py-4 pr-4 font-semibold text-foreground">{label}</th>
                        <td className="py-4 text-muted-foreground">{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <Sparkles className="h-4 w-4" />
                <span className="text-sm font-semibold">기능성 메모</span>
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight">
                감귤류 고유 성분도
                <br className="hidden sm:block" />
                함께 설명할 수 있습니다
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                제주도 공식 자료에서는 감귤류에 플라보노이드와 카로티노이드 같은 기능성 성분이 많이
                알려져 있다고 설명합니다.
              </p>
              <p>
                다만 건강 효능을 직접 단정하기보다, 품종 소개 페이지에서는 향, 당산비, 과육감,
                감귤류 고유 성분 같은 수준으로 소개하는 편이 안전합니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="bg-muted/30 py-14">
        <div className="page-wrap">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold tracking-[0.18em] text-muted-foreground uppercase">
              FAQ
            </p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground">
              분양 전에 많이 묻는 질문
            </h2>
          </div>

          <div className="mt-8 grid gap-4">
            {FAQS.map((faq) => (
              <Card key={faq.question} className="border border-border shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold tracking-tight">
                    {faq.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-7 text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="page-wrap grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary">
                <ShieldCheck className="h-4 w-4" />
                <span className="text-sm font-semibold">공식 자료</span>
              </div>
              <CardTitle className="text-3xl font-semibold tracking-tight">
                참고한 공식 출처
              </CardTitle>
              <CardDescription>
                공식 자료를 함께 보면 재배 기준과 품질 판단 근거가 더 분명해집니다.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {SOURCES.map((source) => (
                <div key={source.href} className="rounded-2xl border border-border bg-muted/30 p-4">
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noreferrer"
                    className="font-semibold text-foreground underline-offset-4 hover:underline"
                  >
                    {source.title}
                  </a>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{source.note}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border border-border bg-primary text-primary-foreground shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2 text-primary-foreground/80">
                <ArrowRight className="h-4 w-4" />
                <span className="text-sm font-semibold">다음 단계</span>
              </div>
              <CardTitle className="text-2xl font-semibold tracking-tight text-primary-foreground">
                기준을 확인했다면,
                <br className="hidden sm:block" />
                이제 남은 구역을 고를 차례입니다
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-primary-foreground/90">
              <p>
                품종과 품질 기준을 확인했다면,
                <br className="hidden sm:block" />
                이제 농장 페이지에서 남은 구역을 직접 비교해 보세요.
              </p>
              <Link
                to="/farms/$farmId"
                params={{ farmId: FEATURED_FARM_ID }}
                hash="orchard-picker"
                className={buttonVariants({
                  variant: 'secondary',
                  className: 'mt-2 h-11 w-full rounded-full text-sm font-semibold',
                })}
              >
                천혜향 구역 선택하러 가기
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
