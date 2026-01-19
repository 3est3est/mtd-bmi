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
    <div className="min-h-screen bg-base">
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-mauve mb-8">BMI History</h1>

        <div className="card overflow-x-auto">
          {logs.length === 0 ? (
            <p className="text-center text-subtext0 py-8">No history found. Start by calculating your BMI!</p>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-surface1 text-blue">
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Weight (kg)</th>
                  <th className="py-4 px-4">Height (cm)</th>
                  <th className="py-4 px-4">BMI</th>
                  <th className="py-4 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface0">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-surface0 transition-colors">
                    <td className="py-4 px-4 text-subtext1">
                      {new Date(log.date).toLocaleDateString()} {new Date(log.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                    <td className="py-4 px-4 text-text">{log.weight}</td>
                    <td className="py-4 px-4 text-text">{log.height}</td>
                    <td className="py-4 px-4 font-bold text-mauve">{log.bmi}</td>
                    <td className={`py-4 px-4 font-medium ${getStatusColor(log.bmi)}`}>
                      {getStatusText(log.bmi)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
