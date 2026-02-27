import React, { useState } from "react";
import { Mail, Phone, Loader2 } from "lucide-react";

export default function ContactForm({ onSubmit, isLoading }) {
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim() && !phoneNumber.trim()) {
      setError("Please provide either an email or a phone number.");
      return;
    }
    setError("");
    onSubmit({ email: email.trim(), phoneNumber: phoneNumber.trim() });
  };

  const isSubmitDisabled = (!email.trim() && !phoneNumber.trim()) || isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && (
        <div className="bg-red-500/10 text-red-500 px-4 py-3 rounded-xl text-sm font-medium border border-red-500/20 flex items-center">
          {error}
        </div>
      )}

      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-zinc-300 mb-1.5 shadow-sm"
        >
          Email Address
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all duration-200 bg-zinc-900/50 text-white focus:bg-zinc-900 placeholder:text-zinc-600 outline-none"
            placeholder="tim@apple.com"
          />
        </div>
      </div>

      <div>
        <label
          htmlFor="phoneNumber"
          className="block text-sm font-medium text-zinc-300 mb-1.5 shadow-sm"
        >
          Phone Number
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-zinc-500" />
          </div>
          <input
            type="tel"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-zinc-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all duration-200 bg-zinc-900/50 text-white focus:bg-zinc-900 placeholder:text-zinc-600 outline-none"
            placeholder="1234567890"
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        {isLoading ? (
          <span className="flex items-center">
            <Loader2 className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
            Processing...
          </span>
        ) : (
          "Identify Contact"
        )}
      </button>
    </form>
  );
}
