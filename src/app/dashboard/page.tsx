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
    <div className="min-h-screen bg-base">
      <Navbar />
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-mauve mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h2 className="text-xl font-semibold text-blue mb-4">Calculate BMI</h2>
            <form onSubmit={calculateBMI} className="space-y-4">
              <div>
                <label className="block text-subtext1 mb-1">Weight (kg)</label>
                <input
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
                <label className="block text-subtext1 mb-1">Height (cm)</label>
                <input
                  type="number"
                  step="0.1"
                  className="input-field"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  placeholder="e.g. 175"
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full">
                Calculate
              </button>
            </form>
          </div>

          <div className="card flex flex-col items-center justify-center text-center">
            {bmi !== null ? (
              <>
                <h2 className="text-xl font-semibold text-blue mb-2">Your Result</h2>
                <div className="text-6xl font-bold text-mauve my-4">{bmi}</div>
                <div className={`text-2xl font-semibold mb-6 ${
                  status === "Normal" ? "text-green" : 
                  status === "Underweight" ? "text-yellow" : "text-red"
                }`}>
                  {status}
                </div>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="btn-primary bg-green hover:bg-teal text-base w-full"
                >
                  {loading ? "Saving..." : "Save Result"}
                </button>
                {message && <p className="mt-2 text-sm text-subtext1">{message}</p>}
              </>
            ) : (
              <p className="text-subtext0 italic">Enter your details to calculate BMI</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
