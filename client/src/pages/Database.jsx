import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Database,
  Loader2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

export default function DatabasePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const currentPage = parseInt(searchParams.get("page")) || 1;

  useEffect(() => {
    fetchContacts(currentPage);
  }, [currentPage]);

  const fetchContacts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await API.get(`/contacts?page=${page}&limit=${limit}`);
      setContacts(response.data.contacts || response.data);
      if (response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      }
      setError(null);
    } catch (err) {
      console.error("Failed to fetch database:", err);
      // Mock data if backend fails.
      setContacts([
        {
          id: 1,
          phoneNumber: "123456",
          email: "lorraine@bcf.com",
          linkedId: null,
          linkPrecedence: "primary",
          createdAt: "2023-04-01T00:00:00.000Z",
          updatedAt: "2023-04-01T00:00:00.000Z",
        },
        {
          id: 2,
          phoneNumber: "123456",
          email: "mcfly@bcf.com",
          linkedId: 1,
          linkPrecedence: "secondary",
          createdAt: "2023-04-11T00:00:00.000Z",
          updatedAt: "2023-04-11T00:00:00.000Z",
        },
        {
          id: 3,
          phoneNumber: "987654",
          email: "doc@brown.com",
          linkedId: null,
          linkPrecedence: "primary",
          createdAt: "2023-04-21T00:00:00.000Z",
          updatedAt: "2023-04-21T00:00:00.000Z",
        },
      ]);
      setError(
        "Note: Running with Mock Data because backend connection failed.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      if (!window.confirm(`Are you sure you want to delete contact #${id}?`)) {
        return;
      }
      
      setContacts((prev) => prev.filter((c) => c.id !== id));
      await API.delete(`/contacts/${id}`);
    } catch (err) {
      console.error("Failed to delete contact:", err);
      setError(
        "Failed to delete contact. It might already be removed, or backend connection failed.",
      );
      
      fetchContacts(currentPage);
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center p-4 sm:p-8 lg:p-12 font-sans text-white selection:bg-orange-500/30">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-zinc-900 p-2 rounded-xl shadow-sm border border-zinc-800 flex items-center justify-center">
              <Database className="w-6 h-6 text-orange-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Contact Database
              </h1>
              <p className="text-sm text-zinc-400 font-medium">
                Viewing all records in the Contact table
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-orange-500/10 text-orange-400 px-4 py-3 rounded-xl text-sm font-medium border border-orange-500/20">
            {error}
          </div>
        )}

        <div className="bg-zinc-900 rounded-2xl shadow-sm border border-zinc-800 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-orange-500" />
              <p className="font-medium text-sm">Loading Database Records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-950 border-b border-zinc-800 text-xs uppercase tracking-wider text-zinc-500 font-semibold">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4">Precedence</th>
                    <th className="px-6 py-4">Linked ID</th>
                    <th className="px-6 py-4">Created At</th>
                    <th className="px-6 py-4 relative">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {contacts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-zinc-500 font-medium"
                      >
                        No contacts found in the database.
                      </td>
                    </tr>
                  ) : (
                    contacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="hover:bg-zinc-800/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-white">
                          #{contact.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                          {contact.email || (
                            <span className="text-zinc-600 italic">null</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400">
                          {contact.phoneNumber || (
                            <span className="text-zinc-600 italic">null</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              contact.linkPrecedence === "primary"
                                ? "bg-orange-500/10 text-orange-400 border border-orange-500/30"
                                : "bg-zinc-800 text-zinc-400 border border-zinc-700"
                            }`}
                          >
                            {contact.linkPrecedence}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-400 font-mono">
                          {contact.linkedId ? (
                            `#${contact.linkedId}`
                          ) : (
                            <span className="text-zinc-600 italic">null</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-500">
                          {new Date(contact.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="text-zinc-500 hover:text-red-500 hover:bg-red-500/10 p-2 rounded-lg transition-colors"
                            title="Delete Contact"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination*/}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 bg-zinc-900 px-6 py-4 border border-zinc-800 rounded-2xl shadow-sm">
            <button
              onClick={() =>
                setSearchParams({ page: Math.max(1, currentPage - 1) })
              }
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-sm text-zinc-400 font-medium">
              Page <span className="font-bold text-white">{currentPage}</span>{" "}
              of <span className="font-bold text-white">{totalPages}</span>
            </span>
            <button
              onClick={() =>
                setSearchParams({ page: Math.min(totalPages, currentPage + 1) })
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-zinc-300 bg-zinc-800 border border-zinc-700 rounded-lg hover:bg-zinc-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
