import React, { useState } from "react";
import axios from "axios";
import { ShieldCheck, Database as DatabaseIcon } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] sm:p-10 p-6 border border-gray-100 transition-all relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500"></div>

        {/* View DB Button */}
        <div className="absolute top-4 right-4 z-10">
          <Link
            to="/database"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium transition-colors"
          >
            <DatabaseIcon className="w-3.5 h-3.5" />
            View Database
          </Link>
        </div>

        <div className="text-center mb-10 mt-2">
          <div className="mx-auto bg-blue-50/50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-blue-100/50">
            <ShieldCheck className="w-8 h-8 text-blue-600" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
            Identity Reconciliation
          </h1>
          <p className="text-gray-500 text-sm font-medium">
            Identify and consolidate customer contact records
          </p>
        </div>

        <ContactForm onSubmit={handleIdentify} isLoading={loading} />

        {apiError && !result && (
          <div className="mt-6 bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm font-medium border border-red-100 text-center animate-in fade-in zoom-in duration-300">
            {apiError}
          </div>
        )}

        <ContactResult data={result} />

        {apiError && result && (
          <div className="mt-4 text-center text-xs text-amber-600 font-medium">
            {apiError}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
