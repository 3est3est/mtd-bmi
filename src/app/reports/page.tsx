"use client";

import { useState, useEffect, useCallback } from "react";
import Navbar from "@/components/Navbar";
import { getReportData } from "@/actions/reports";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

type Period = "daily" | "weekly" | "monthly" | "yearly";

export default function ReportsPage() {
  const [period, setPeriod] = useState<Period>("weekly");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getReportData(period);
      setData(result);
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-base">
      <Navbar />
      <div className="p-8 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-mauve">MIS Reports</h1>
          <div className="flex gap-2 bg-mantle p-1 rounded-lg border border-surface0">
            {(["daily", "weekly", "monthly", "yearly"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-md transition-all ${
                  period === p
                    ? "bg-mauve text-base font-bold"
                    : "text-subtext0 hover:text-text hover:bg-surface0"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-mauve"></div>
          </div>
        ) : data && data.chartData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="card h-[400px]">
                <h2 className="text-xl font-semibold text-blue mb-4">BMI Trend</h2>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#313244" />
                    <XAxis dataKey="name" stroke="#bac2de" />
                    <YAxis stroke="#bac2de" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e1e2e", border: "1px solid #313244" }}
                      itemStyle={{ color: "#cba6f7" }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="bmi"
                      stroke="#cba6f7"
                      strokeWidth={3}
                      dot={{ r: 6, fill: "#cba6f7" }}
                      activeDot={{ r: 8 }}
                      name="BMI Index"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="card h-[400px]">
                <h2 className="text-xl font-semibold text-green mb-4">Weight Changes (kg)</h2>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#313244" />
                    <XAxis dataKey="name" stroke="#bac2de" />
                    <YAxis stroke="#bac2de" />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#1e1e2e", border: "1px solid #313244" }}
                      itemStyle={{ color: "#a6e3a1" }}
                    />
                    <Legend />
                    <Bar dataKey="weight" fill="#a6e3a1" name="Weight (kg)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="space-y-6">
              <div className="card">
                <h2 className="text-lg font-semibold text-blue mb-4">Summary Stats</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-surface0 rounded-lg">
                    <span className="text-subtext1">Average BMI</span>
                    <span className="text-xl font-bold text-mauve">{data.summary.avgBmi}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-surface0 rounded-lg">
                    <span className="text-subtext1">Max BMI</span>
                    <span className="text-xl font-bold text-red">{data.summary.maxBmi}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-surface0 rounded-lg">
                    <span className="text-subtext1">Min BMI</span>
                    <span className="text-xl font-bold text-green">{data.summary.minBmi}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-surface0 rounded-lg">
                    <span className="text-subtext1">Total Records</span>
                    <span className="text-xl font-bold text-blue">{data.summary.count}</span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h2 className="text-lg font-semibold text-peach mb-4">BMI Reference</h2>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-subtext1">Underweight</span>
                    <span className="text-yellow">&lt; 18.5</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-subtext1">Normal</span>
                    <span className="text-green">18.5 - 24.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-subtext1">Overweight</span>
                    <span className="text-red">25.0 - 29.9</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-subtext1">Obese</span>
                    <span className="text-red font-bold">&ge; 30.0</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="card text-center py-20">
            <p className="text-xl text-subtext0 mb-4">No data available for this period</p>
            <p className="text-subtext1">Try adding some BMI logs in the Dashboard first!</p>
          </div>
        )}
      </div>
    </div>
  );
}
