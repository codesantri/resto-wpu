"use client";
import { LineCharts } from "@/components/common/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import createClientRealtime from "@/lib/supabase/realtime";
import { useQuery } from "@tanstack/react-query";
import MyChart from "./dash";

// ✅ Definisikan tipe row orders (sesuai dengan field di DB)
interface OrderRow {
  created_at: string;
}

// ✅ Tipe data hasil olahan untuk chart
interface OrderCount {
  name: string;
  total: number;
}

export default function Dashboard() {
  const supabase = createClientRealtime();

  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 6);
  lastWeek.setHours(0, 0, 0, 0);

  const {
    data: orders = [], // default [] supaya nggak undefined
    isLoading,
  } = useQuery<OrderCount[]>({
    queryKey: ["order-per-day"],
    queryFn: async (): Promise<OrderCount[]> => {
      const { data, error } = await supabase
        .from<OrderRow>("orders") // ✅ kasih generic biar typed
        .select("created_at")
        .gte("created_at", lastWeek.toISOString())
        .order("created_at");

      if (error) throw error;

      const counts: Record<string, number> = {};

      (data ?? []).forEach((order: OrderRow) => {
        const date = new Date(order.created_at).toISOString().slice(0, 10);
        counts[date] = (counts[date] || 0) + 1;
      });

      return Object.entries(counts).map(([name, total]) => ({
        name,
        total,
      }));
    },
  });

  return (
    <div className="w-full p-4">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Line Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Orders in this week</CardTitle>
            <CardDescription>
              Showing reports from {lastWeek.toLocaleDateString()} until{" "}
              {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full h-80 p-4">
            {isLoading ? (
              <p className="text-neutral-500">Loading chart...</p>
            ) : orders.length > 0 ? (
              <LineCharts data={orders} />
            ) : (
              <p className="text-neutral-500">No orders found this week</p>
            )}
          </CardContent>
        </Card>

        {/* Bar Chart */}
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Orders in this week</CardTitle>
            <CardDescription>
              Showing reports from {lastWeek.toLocaleDateString()} until{" "}
              {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="w-full p-4">
            <MyChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
