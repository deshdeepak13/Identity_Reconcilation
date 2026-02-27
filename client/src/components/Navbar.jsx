import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ShieldCheck, Database as DatabaseIcon, Lightbulb } from "lucide-react";

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo / Title */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-orange-500/20 p-1.5 rounded-lg text-orange-500 group-hover:bg-orange-600 group-hover:text-white transition-colors">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="font-bold text-white tracking-tight text-lg group-hover:text-orange-500 transition-colors">
              Identity Reconcilation
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* <Link
              to="/explanation"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive("/explanation")
                  ? "bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white border border-transparent"
              }`}
            >
              <Lightbulb
                className={`w-4 h-4 ${isActive("/explanation") ? "text-orange-500" : "text-zinc-500"}`}
              />
              <span className="hidden sm:inline">My Approach</span>
            </Link> */}

            <Link
              to="/database"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                isActive("/database")
                  ? "bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-sm"
                  : "text-zinc-400 hover:bg-zinc-800/80 hover:text-white border border-amber-50"
              }`}
            >
              <DatabaseIcon
                className={`w-4 h-4 ${isActive("/database") ? "text-orange-500" : "text-zinc-500"}`}
              />
              <span className="hidden sm:inline">View Database</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
