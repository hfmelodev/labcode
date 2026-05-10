'use client'

import { format } from 'date-fns'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

type StatsChartsProps = {
  newUsersStats: StatsChartData[]
  purchasedCoursesStats: StatsChartData[]
}

const newAccountsChartConfig = {
  count: {
    label: 'Usuários',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

const coursesPurchasesChartConfig = {
  count: {
    label: 'Cursos',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig

export default function StatsCharts({ newUsersStats, purchasedCoursesStats }: StatsChartsProps) {
  return (
    <div className="grid w-full gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Novos Usuários</CardTitle>
          <CardDescription>Últimos 7 dias</CardDescription>

          <CardContent>
            <ChartContainer config={newAccountsChartConfig}>
              <AreaChart
                accessibilityLayer
                data={newUsersStats}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={value => format(value, 'dd/MM')}
                  interval="preserveStartEnd"
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillAcounts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="count"
                  type="monotone"
                  fill="url(#fillAcounts)"
                  fillOpacity={0.4}
                  stroke="var(--primary)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </CardHeader>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cursos Comprados</CardTitle>
          <CardDescription>Últimos 7 dias</CardDescription>

          <CardContent>
            <ChartContainer config={coursesPurchasesChartConfig}>
              <AreaChart
                accessibilityLayer
                data={purchasedCoursesStats}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={value => format(value, 'dd/MM')}
                  interval="preserveStartEnd"
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <defs>
                  <linearGradient id="fillValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  dataKey="count"
                  type="monotone"
                  fill="url(#fillValue)"
                  fillOpacity={0.4}
                  stroke="var(--primary)"
                  stackId="a"
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </CardHeader>
      </Card>
    </div>
  )
}
