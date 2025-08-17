import { Bar, BarChart, XAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const chartData = [
  { month: "January", desktop: 186, mobile: 80 },
  { month: "February", desktop: 305, mobile: 200 },
  { month: "March", desktop: 237, mobile: 120 },
  { month: "April", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "June", desktop: 214, mobile: 140 },
]

export default function MyChart() {
  return (
    <ChartContainer
      config={{
        desktop: { label: "Desktop", color: "#2563eb" },
        mobile: { label: "Mobile", color: "#60a5fa" },
      }}
    >
      <BarChart data={chartData}>
        <XAxis dataKey="month" />
        <Bar dataKey="desktop" fill="#2563eb" radius={4} />
        <Bar dataKey="mobile" fill="#60a5fa" radius={4} />
        <ChartTooltip content={<ChartTooltipContent />} />
      </BarChart>
    </ChartContainer>
  )
}
