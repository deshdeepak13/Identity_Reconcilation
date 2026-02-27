import React, { useState } from "react";
import axios from "axios";
import { ShieldCheck, Database as DatabaseIcon, Lightbulb } from "lucide-react";
import { Link } from "react-router-dom";
import ContactForm from "../components/ContactForm";
import ContactResult from "../components/ContactResult";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

function Home() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [apiError, setApiError] = useState("");

  const handleIdentify = async (payload) => {
    setLoading(true);
    setApiError("");
    setResult(null);

    try {
      const response = await API.post("/identify", payload);
      setResult(response.data);
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          err.message ||
          "An error occurred while identifying the contact.",
      );

      //    MOCK DATA
      console.warn("API request failed. Falling back to mock data.");
      setTimeout(() => {
        setResult({
          contact: {
            primaryContactId: 101,
            emails: payload.email
              ? [payload.email, "alex@bitespeed.co"]
              : ["alex@bitespeed.co"],
            phoneNumbers: payload.phoneNumber
              ? [payload.phoneNumber, "9876543210"]
              : ["9876543210"],
            secondaryContactIds: [23, 45, 67],
          },
        });
        setApiError("API Failed - Mock Data for UI testing");
        setLoading(false);
      }, 800);
      return;
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-white selection:bg-orange-500/30 selection:text-white relative">
      {/* Approach Dashboard Callout (Desktop Only) */}
      <div className="hidden xl:flex absolute left-8 top-1/3 -translate-y-12 flex-col items-end w-72 animate-in fade-in slide-in-from-left-8 duration-700 delay-500 fill-mode-both z-10">
        {/* Playful Curving Arrow pointing towards the Top Right (Navbar) */}
        <div className="relative w-full flex justify-end mb-2 pr-8">
          <svg
            className="w-32 h-24 text-orange-500/60 drop-shadow-lg"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              d="M10,90 Q40,20 100,5"
              strokeDasharray="6 6"
              className="animate-[dash_3s_linear_infinite]"
            />
            <polyline points="85,-5 102,4 85,15" />
          </svg>
        </div>

        <div className="bg-zinc-900/90 backdrop-blur-md border border-zinc-800 p-5 rounded-2xl shadow-2xl relative w-full">
          <div className="absolute -inset-0.5 bg-linear-to-r from-orange-500/20 to-orange-600/20 rounded-2xl blur-sm -z-10"></div>
          <p className="text-zinc-300 text-sm leading-relaxed mb-4">
            Please check out the thought process behind the solution
          </p>
          <Link
            to="/explanation"
            className="inline-flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white text-sm font-semibold py-2.5 px-4 rounded-xl transition-all hover:scale-105 active:scale-95 shadow-[0_0_15px_rgba(234,88,12,0.4)]"
          >
            <Lightbulb className="w-4 h-4" />
            My Approach
          </Link>
        </div>
      </div>

      <div className="w-full max-w-xl bg-zinc-900 rounded-3xl shadow-2xl sm:p-10 p-6 border border-zinc-800 transition-all relative overflow-hidden z-20">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-linear-to-r from-orange-400 to-orange-600"></div>

        <div className="text-center mb-10 mt-2">
          <div className="mx-auto bg-orange-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-orange-500/20">
            <ShieldCheck className="w-8 h-8 text-orange-500" />
          </div>
          {/* <h1 className="text-3xl font-extrabold text-white tracking-tight mb-3">
            Identity Reconciliation
          </h1> */}
          <h1 className="text-zinc-400 text-2xl font-medium">
            Identify and consolidate customer contact records
          </h1>
        </div>

        <ContactForm onSubmit={handleIdentify} isLoading={loading} />

        {apiError && !result && (
          <div className="mt-6 bg-red-500/10 text-red-400 px-4 py-3 rounded-xl text-sm font-medium border border-red-500/20 text-center animate-in fade-in zoom-in duration-300">
            {apiError}
          </div>
        )}

        <ContactResult data={result} />

        {apiError && result && (
          <div className="mt-4 text-center text-xs text-orange-400 font-medium">
            {apiError}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
