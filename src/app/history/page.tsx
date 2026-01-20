import Navbar from "@/components/Navbar";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HistoryPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    redirect("/login");
  }

  const logs = await prisma.bMILog.findMany({
    where: { userId: user.id },
    orderBy: { date: "desc" },
  });

  const getStatusColor = (bmi: number) => {
    if (bmi < 18.5) return "text-yellow";
    if (bmi < 25) return "text-green";
    if (bmi < 30) return "text-red";
    return "text-red font-bold";
  };

  const getStatusText = (bmi: number) => {
    if (bmi < 18.5) return "Underweight";
    if (bmi < 25) return "Normal";
    if (bmi < 30) return "Overweight";
    return "Obese";
  };

  return (
    <div className="min-h-screen bg-gradient-mocha">
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gradient-mauve mb-2">BMI History</h1>
          <p className="text-subtext0">Review your past measurements and track your progress.</p>
        </header>

        <div className="card overflow-hidden border-none shadow-2xl p-0">
          {logs.length === 0 ? (
            <div className="flex flex-col items-center gap-4 py-20">
              <div className="text-6xl grayscale opacity-50">📅</div>
              <p className="text-center text-subtext0 italic text-lg">No history found. Start by calculating your BMI in the dashboard!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface0/50">
                    <th className="p-6 text-mauve font-bold uppercase tracking-wider text-sm">Date</th>
                    <th className="p-6 text-mauve font-bold uppercase tracking-wider text-sm text-center">Weight (kg)</th>
                    <th className="p-6 text-mauve font-bold uppercase tracking-wider text-sm text-center">Height (cm)</th>
                    <th className="p-6 text-mauve font-bold uppercase tracking-wider text-sm text-center">BMI Score</th>
                    <th className="p-6 text-mauve font-bold uppercase tracking-wider text-sm text-center">Health Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface1/30">
                  {logs.map((log) => {
                    const status = getStatusText(log.bmi);
                    return (
                      <tr key={log.id} className="hover:bg-surface0/30 transition-colors group">
                        <td className="p-6 text-subtext1 font-medium tabular-nums">
                          <div className="flex flex-col">
                            <span className="text-text font-bold">
                              {new Date(log.date).toLocaleDateString(undefined, {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                            <span className="text-xs text-subtext0">
                              {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </td>
                        <td className="p-6 text-center text-text tabular-nums font-semibold">{log.weight}</td>
                        <td className="p-6 text-center text-text tabular-nums font-semibold">{log.height}</td>
                        <td className="p-6 text-center">
                          <span className="text-2xl font-black text-gradient-mauve tabular-nums">{log.bmi}</span>
                        </td>
                        <td className="p-6 text-center">
                          <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${
                            status === "Normal" ? "bg-green/10 text-green" : 
                            status === "Underweight" ? "bg-yellow/10 text-yellow" : "bg-red/10 text-red"
                          }`}>
                            {status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
