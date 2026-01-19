import Link from "next/link";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-base">
      <Navbar />
      <main className="max-w-4xl mx-auto py-20 px-8 text-center">
        <h1 className="text-6xl font-extrabold text-mauve mb-6 animate-fade-in">
          BMI Tracker
        </h1>
        <p className="text-xl text-subtext1 mb-12 max-w-2xl mx-auto">
          Track your health journey with ease. Calculate your BMI, save your history, 
          and view detailed reports all in one place.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="card hover:border-mauve transition-all group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📊</div>
            <h3 className="text-xl font-bold text-blue mb-2">Track BMI</h3>
            <p className="text-subtext0">Quickly calculate and save your Body Mass Index.</p>
          </div>
          <div className="card hover:border-green transition-all group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">🕒</div>
            <h3 className="text-xl font-bold text-green mb-2">History</h3>
            <p className="text-subtext0">Keep a detailed log of your progress over time.</p>
          </div>
          <div className="card hover:border-red transition-all group">
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">📈</div>
            <h3 className="text-xl font-bold text-red mb-2">MIS Reports</h3>
            <p className="text-subtext0">View daily, weekly, monthly, and yearly insights.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard" className="btn-primary text-lg px-8 py-3">
            Go to Dashboard
          </Link>
          <Link href="/history" className="bg-surface0 text-text font-bold py-3 px-8 rounded hover:bg-surface1 transition-colors text-lg">
            View History
          </Link>
        </div>
      </main>
    </div>
  );
}
