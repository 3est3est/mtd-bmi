import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-mocha relative overflow-hidden">
      <Navbar />
      
      {/* Decorative blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mauve/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue/10 rounded-full blur-[120px] pointer-events-none" />

      <main className="max-w-6xl mx-auto py-24 px-8 text-center relative z-10">
        <div className="inline-block px-4 py-1.5 mb-6 rounded-full bg-mauve/10 border border-mauve/20 text-mauve font-bold text-sm animate-fade-in">
          ✨ Health & Wellness Tracker
        </div>
        
        <h1 className="text-7xl md:text-8xl font-black text-gradient-mauve mb-8 tracking-tighter">
          BMI Tracker
        </h1>
        
        <p className="text-xl md:text-2xl text-subtext1 mb-16 max-w-3xl mx-auto leading-relaxed">
          The simple way to track your health journey. Calculate BMI, save progress, 
          and gain insights with our advanced analytical reports.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Link href="/dashboard" className="card hover:scale-[1.02] active:scale-[0.98] transition-all group border-mauve/10 hover:border-mauve/30 cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-mauve/10 flex items-center justify-center text-4xl mb-6 mx-auto group-hover:bg-mauve/20 transition-colors">📊</div>
            <h3 className="text-2xl font-bold text-text mb-3">Track BMI</h3>
            <p className="text-subtext0 leading-relaxed">Instantly calculate your BMI and get personalized health status updates.</p>
          </Link>
          <Link href="/history" className="card hover:scale-[1.02] active:scale-[0.98] transition-all group border-blue/10 hover:border-blue/30 cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-blue/10 flex items-center justify-center text-4xl mb-6 mx-auto group-hover:bg-blue/20 transition-colors">🕒</div>
            <h3 className="text-2xl font-bold text-text mb-3">History Log</h3>
            <p className="text-subtext0 leading-relaxed">Keep a secure history of your measurements to monitor your progress over time.</p>
          </Link>
          <Link href="/reports" className="card hover:scale-[1.02] active:scale-[0.98] transition-all group border-teal/10 hover:border-teal/30 cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-teal/10 flex items-center justify-center text-4xl mb-6 mx-auto group-hover:bg-teal/20 transition-colors">📈</div>
            <h3 className="text-2xl font-bold text-text mb-3">MIS Reports</h3>
            <p className="text-subtext0 leading-relaxed">Visualize your health data with daily, weekly, and monthly trend analysis.</p>
          </Link>
        </div>

        <div className="flex justify-center">
          {session ? (
            <Link href="/dashboard" className="btn-primary text-xl px-12 py-4 rounded-2xl flex items-center gap-3">
              Go to Dashboard <span>→</span>
            </Link>
          ) : (
            <Link href="/register" className="btn-primary text-xl px-12 py-4 rounded-2xl">
              Get Started for Free
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
