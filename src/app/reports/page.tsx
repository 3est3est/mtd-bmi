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
    <div className="min-h-screen bg-gradient-mocha">
      <Navbar />
      <div className="p-8 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-gradient-mauve mb-2">MIS Reports</h1>
            <p className="text-subtext0">Analytical insights of your health journey.</p>
          </div>
          <div className="flex gap-1 bg-surface0/50 p-1 rounded-xl border border-surface1/50 backdrop-blur-sm">
            {(["daily", "weekly", "monthly", "yearly"] as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-bold text-sm ${
                  period === p
                    ? "bg-gradient-to-r from-mauve to-blue text-base shadow-lg"
                    : "text-subtext1 hover:text-text hover:bg-surface1/50"
                }`}
              >
                {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-96 gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-mauve/20 rounded-full"></div>
              <div className="absolute top-0 left-0 w-full h-full border-4 border-mauve border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-mauve font-medium animate-pulse">Generating your report...</p>
          </div>
        ) : data && data.chartData.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-8 space-y-8">
              <div className="card h-[450px] p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-mauve/10 flex items-center justify-center text-mauve">📈</div>
                  <h2 className="text-2xl font-bold text-text">BMI Progress Trend</h2>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <LineChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#313244" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#bac2de" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#bac2de" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: "#1e1e2e", 
                        border: "1px solid #45475a",
                        borderRadius: "12px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.5)"
                      }}
                      itemStyle={{ color: "#cba6f7", fontWeight: "bold" }}
                    />
                    <Line
                      type="monotone"
                      dataKey="bmi"
                      stroke="url(#lineGradient)"
                      strokeWidth={4}
                      dot={{ r: 4, fill: "#cba6f7", strokeWidth: 2, stroke: "#1e1e2e" }}
                      activeDot={{ r: 8, strokeWidth: 0 }}
                      name="BMI Index"
                    />
                    <defs>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#cba6f7" />
                        <stop offset="100%" stopColor="#89b4fa" />
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="card h-[450px] p-8">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-green/10 flex items-center justify-center text-green">⚖️</div>
                  <h2 className="text-2xl font-bold text-text">Weight Variance</h2>
                </div>
                <ResponsiveContainer width="100%" height="80%">
                  <BarChart data={data.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#313244" vertical={false} />
                    <XAxis 
                      dataKey="name" 
                      stroke="#bac2de" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dy={10}
                    />
                    <YAxis 
                      stroke="#bac2de" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      dx={-10}
                    />
                    <Tooltip
                      contentStyle={{ 
                        backgroundColor: "#1e1e2e", 
                        border: "1px solid #45475a",
                        borderRadius: "12px"
                      }}
                    />
                    <Bar 
                      dataKey="weight" 
                      fill="url(#barGradient)" 
                      radius={[6, 6, 0, 0]}
                      name="Weight (kg)"
                    />
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#a6e3a1" />
                        <stop offset="100%" stopColor="#94e2d5" />
                      </linearGradient>
                    </defs>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="lg:col-span-4 space-y-8">
              <div className="card bg-gradient-to-br from-surface0/50 to-surface1/30">
                <h3 className="text-xl font-bold text-mauve mb-6">Summary Metrics</h3>
                <div className="space-y-6">
                  <div className="p-4 rounded-xl bg-base/50 border border-surface1/30">
                    <p className="text-subtext0 text-sm mb-1">Average BMI</p>
                    <p className="text-3xl font-black text-text tabular-nums">{data.summary.avgBmi}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-base/50 border border-surface1/30">
                    <p className="text-subtext0 text-sm mb-1">Max Weight</p>
                    <p className="text-3xl font-black text-text tabular-nums">{data.summary.maxWeight} <span className="text-sm font-normal text-subtext0">kg</span></p>
                  </div>
                  <div className="p-4 rounded-xl bg-base/50 border border-surface1/30">
                    <p className="text-subtext0 text-sm mb-1">Min Weight</p>
                    <p className="text-3xl font-black text-text tabular-nums">{data.summary.minWeight} <span className="text-sm font-normal text-subtext0">kg</span></p>
                  </div>
                  <div className="p-4 rounded-xl bg-base/50 border border-surface1/30">
                    <p className="text-subtext0 text-sm mb-1">Total Logs</p>
                    <p className="text-3xl font-black text-text tabular-nums">{data.summary.totalLogs}</p>
                  </div>
                </div>
              </div>

              <div className="card bg-mauve/5 border-mauve/20">
                <h3 className="text-lg font-bold text-mauve mb-3">Health Tip 💡</h3>
                <p className="text-sm text-subtext1 leading-relaxed">
                  Consistency is key! Regular tracking helps you identify patterns in your health journey. 
                  Aim for a balanced diet and regular physical activity to maintain a healthy BMI.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="card py-20 flex flex-col items-center justify-center text-center">
            <div className="text-7xl mb-6 grayscale opacity-30">📊</div>
            <h2 className="text-2xl font-bold text-text mb-2">No Data for this Period</h2>
            <p className="text-subtext0 max-w-sm">
              We couldn't find any BMI records for the selected {period} period. 
              Try selecting a different timeframe or record some new data!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
