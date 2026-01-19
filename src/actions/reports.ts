"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { startOfDay, startOfWeek, startOfMonth, startOfYear, endOfDay, endOfWeek, endOfMonth, endOfYear, format } from "date-fns";

export async function getReportData(period: "daily" | "weekly" | "monthly" | "yearly") {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) throw new Error("User not found");

  const now = new Date();
  let start: Date;
  let end: Date;

  switch (period) {
    case "daily":
      start = startOfDay(now);
      end = endOfDay(now);
      break;
    case "weekly":
      start = startOfWeek(now);
      end = endOfWeek(now);
      break;
    case "monthly":
      start = startOfMonth(now);
      end = endOfMonth(now);
      break;
    case "yearly":
      start = startOfYear(now);
      end = endOfYear(now);
      break;
  }

  const logs = await prisma.bMILog.findMany({
    where: {
      userId: user.id,
      date: {
        gte: start,
        lte: end,
      },
    },
    orderBy: { date: "asc" },
  });

  // Group by date for the chart
  const chartData = logs.map((log) => ({
    name: format(new Date(log.date), period === "daily" ? "HH:mm" : "dd/MM"),
    bmi: log.bmi,
    weight: log.weight,
  }));

  const avgBmi = logs.length > 0 ? logs.reduce((acc, log) => acc + log.bmi, 0) / logs.length : 0;
  const maxBmi = logs.length > 0 ? Math.max(...logs.map((l) => l.bmi)) : 0;
  const minBmi = logs.length > 0 ? Math.min(...logs.map((l) => l.bmi)) : 0;

  return {
    chartData,
    summary: {
      avgBmi: Math.round(avgBmi * 100) / 100,
      maxBmi: Math.round(maxBmi * 100) / 100,
      minBmi: Math.round(minBmi * 100) / 100,
      count: logs.length,
    },
  };
}
