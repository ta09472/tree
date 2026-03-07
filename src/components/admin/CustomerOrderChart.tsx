import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '#/components/ui/chart';

const currencyFormatter = new Intl.NumberFormat('ko-KR');

const orderAmountChartConfig = {
  amount: {
    label: '주문 금액',
    color: 'var(--foreground)',
  },
} satisfies ChartConfig;

export default function CustomerOrderChart({
  data,
}: {
  data: Array<{
    key: string;
    label: string;
    amount: number;
  }>;
}) {
  return (
    <ChartContainer
      config={orderAmountChartConfig}
      className="h-48 w-full [&_.recharts-cartesian-axis-tick_text]:text-xs"
    >
      <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis
          tickLine={false}
          axisLine={false}
          width={40}
          tickFormatter={(value) => `${Math.round(Number(value) / 10000)}만`}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              formatter={(value) => (
                <span className="font-medium text-foreground">
                  {currencyFormatter.format(Number(value))}원
                </span>
              )}
            />
          }
        />
        <Bar dataKey="amount" fill="var(--color-amount)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
