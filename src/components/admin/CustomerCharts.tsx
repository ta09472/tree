import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '#/components/ui/chart';

type MonthlyJoinItem = {
  key: string;
  label: string;
  customers: number;
};

type ManagerSalesItem = {
  name: string;
  sales: number;
};

const currencyFormatter = new Intl.NumberFormat('ko-KR');

const customerTrendChartConfig = {
  customers: {
    label: '신규 고객',
    color: 'var(--foreground)',
  },
} satisfies ChartConfig;

const managerSalesChartConfig = {
  sales: {
    label: '누적 결제',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export default function CustomerCharts({
  monthlyJoinData,
  managerSalesData,
}: {
  monthlyJoinData: MonthlyJoinItem[];
  managerSalesData: ManagerSalesItem[];
}) {
  return (
    <section className="mt-6 grid gap-4 lg:grid-cols-2">
      <ChartPanel
        title="월별 신규 고객"
        description="가입일 기준 최근 6개월"
        chart={
          <ChartContainer
            config={customerTrendChartConfig}
            className="h-56 w-full [&_.recharts-cartesian-axis-tick_text]:text-xs"
          >
            <LineChart data={monthlyJoinData} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={24} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent labelKey="customers" />} />
              <Line
                type="monotone"
                dataKey="customers"
                stroke="var(--color-customers)"
                strokeWidth={2}
                dot={{ r: 3, fill: 'var(--color-customers)' }}
                activeDot={{ r: 4 }}
              />
            </LineChart>
          </ChartContainer>
        }
      />

      <ChartPanel
        title="담당자별 누적 결제"
        description="현재 고객 기준 합계"
        chart={
          <ChartContainer
            config={managerSalesChartConfig}
            className="h-56 w-full [&_.recharts-cartesian-axis-tick_text]:text-xs"
          >
            <BarChart
              data={managerSalesData}
              layout="vertical"
              margin={{ top: 8, right: 12, left: 8, bottom: 0 }}
            >
              <CartesianGrid horizontal={false} />
              <XAxis
                type="number"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${Math.round(value / 10000)}만`}
              />
              <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} width={52} />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    hideLabel
                    formatter={(value) => (
                      <span className="font-medium text-foreground">
                        {currencyFormatter.format(Number(value))}원
                      </span>
                    )}
                  />
                }
              />
              <Bar dataKey="sales" fill="var(--color-sales)" radius={4} />
            </BarChart>
          </ChartContainer>
        }
      />
    </section>
  );
}

function ChartPanel({
  title,
  description,
  chart,
}: {
  title: string;
  description: string;
  chart: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-4">
      <div className="mb-4">
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>
      {chart}
    </section>
  );
}
