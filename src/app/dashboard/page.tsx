"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { saveBMILog } from "@/actions/bmi";

export default function DashboardPage() {
  const [weight, setWeight] = useState<string>("");
  const [height, setHeight] = useState<string>("");
  const [bmi, setBmi] = useState<number | null>(null);
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const calculateBMI = (e: React.FormEvent) => {
    e.preventDefault();
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100; // cm to m

    if (w > 0 && h > 0) {
      const bmiValue = w / (h * h);
      const roundedBMI = Math.round(bmiValue * 100) / 100;
      setBmi(roundedBMI);
      determineStatus(roundedBMI);
    }
  };

  const determineStatus = (bmiValue: number) => {
    if (bmiValue < 18.5) setStatus("Underweight");
    else if (bmiValue < 25) setStatus("Normal");
    else if (bmiValue < 30) setStatus("Overweight");
    else setStatus("Obese");
  };

  const handleSave = async () => {
    if (bmi === null) return;
    setLoading(true);
    setMessage("");
    try {
      await saveBMILog(parseFloat(weight), parseFloat(height), bmi);
      setMessage("Saved successfully!");
      setWeight("");
      setHeight("");
      setBmi(null);
      setStatus("");
    } catch (error) {
      setMessage("Error saving data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mocha">
      <Navbar />
      <div className="p-8 max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-gradient-mauve mb-2">Health Dashboard</h1>
          <p className="text-subtext0">Track and monitor your body mass index progress.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
            <div className="card h-full">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center text-blue">⚖️</div>
                <h2 className="text-2xl font-bold text-text">Calculate BMI</h2>
              </div>
              <form onSubmit={calculateBMI} className="space-y-6">
                <div>
                  <label htmlFor="weight" className="block text-subtext1 font-medium mb-2">Weight (kg)</label>
                  <input
                    id="weight"
                    type="number"
                    step="0.1"
                    className="input-field"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 70"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="height" className="block text-subtext1 font-medium mb-2">Height (cm)</label>
                  <input
                    id="height"
                    type="number"
                    step="0.1"
                    className="input-field"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    placeholder="e.g. 175"
                    required
                  />
                </div>
                <button type="submit" className="btn-primary w-full py-4 text-lg">
                  Calculate Now
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-7">
            <div className="card h-full flex flex-col items-center justify-center text-center relative overflow-hidden">
              {bmi !== null ? (
                <>
                  <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-mauve via-blue to-teal" />
                  <h2 className="text-xl font-bold text-subtext1 mb-4">Your BMI Score</h2>
                  <div className="text-8xl font-black text-gradient-mauve mb-4 tabular-nums">{bmi}</div>
                  <div className={`px-6 py-2 rounded-full text-xl font-bold mb-8 shadow-sm ${
                    status === "Normal" ? "bg-green/10 text-green" : 
                    status === "Underweight" ? "bg-yellow/10 text-yellow" : "bg-red/10 text-red"
                  }`}>
                    {status}
                  </div>
                  <div className="w-full max-w-sm">
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className={`btn-primary w-full py-3 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      style={{ background: 'linear-gradient(135deg, var(--color-green) 0%, var(--color-teal) 100%)', color: 'var(--color-base)' }}
                    >
                      {loading ? "Saving Result..." : "Save to History"}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center gap-4 py-12">
                  <div className="text-6xl grayscale opacity-50">📏</div>
                  <p className="text-subtext0 text-lg italic max-w-xs">Enter your details on the left to see your BMI result here.</p>
                </div>
              )}
              {message && (
                <div className="mt-6 px-4 py-2 rounded-lg bg-surface0/50 text-mauve font-medium animate-bounce">
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
