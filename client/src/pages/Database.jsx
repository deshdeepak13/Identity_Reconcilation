import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
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
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

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
      // Mock data for UI presentation if backend isn't linked
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
      // Optimistically remove from UI, or just set loading
      setContacts((prev) => prev.filter((c) => c.id !== id));
      await API.delete(`/contacts/${id}`);
    } catch (err) {
      console.error("Failed to delete contact:", err);
      setError(
        "Failed to delete contact. It might already be removed, or backend connection failed.",
      );
      // Fetch again to revert pessimistic update failure or grab next page items
      fetchContacts(currentPage);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-8 lg:p-12 font-sans text-gray-900 selection:bg-blue-100">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-sm border border-gray-100 flex items-center justify-center">
              <Database className="w-6 h-6 text-indigo-500" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                Contact Database
              </h1>
              <p className="text-sm text-gray-500 font-medium">
                Viewing all records in the Contact table
              </p>
            </div>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 shadow-sm transition-all hover:shadow"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-amber-50 text-amber-700 px-4 py-3 rounded-xl text-sm font-medium border border-amber-200">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Loader2 className="w-8 h-8 animate-spin mb-4 text-blue-500" />
              <p className="font-medium text-sm">Loading Database Records...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-semibold">
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
                <tbody className="divide-y divide-gray-100">
                  {contacts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-12 text-center text-gray-500 font-medium"
                      >
                        No contacts found in the database.
                      </td>
                    </tr>
                  ) : (
                    contacts.map((contact) => (
                      <tr
                        key={contact.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          #{contact.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {contact.email || (
                            <span className="text-gray-400 italic">null</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {contact.phoneNumber || (
                            <span className="text-gray-400 italic">null</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                              contact.linkPrecedence === "primary"
                                ? "bg-blue-100 text-blue-800 border border-blue-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            {contact.linkPrecedence}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-mono">
                          {contact.linkedId ? (
                            `#${contact.linkedId}`
                          ) : (
                            <span className="text-gray-400 italic">null</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(contact.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleDelete(contact.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
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

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 bg-white px-6 py-4 border border-gray-200 rounded-2xl shadow-sm">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" /> Previous
            </button>
            <span className="text-sm text-gray-600 font-medium">
              Page{" "}
              <span className="font-bold text-gray-900">{currentPage}</span> of{" "}
              <span className="font-bold text-gray-900">{totalPages}</span>
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-4 py-2 text-sm font-semibold text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
