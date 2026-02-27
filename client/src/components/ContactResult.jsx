import React from "react";
import { User, Mail, Phone, Link } from "lucide-react";
import Badge from "./Badge";

export default function ContactResult({ data }) {
  if (!data || !data.contact) return null;

  const { contact } = data;
  const primaryId = contact.primaryContactId || contact.primaryContatctId;

  return (
    <div className="mt-6 pt-6 border-t border-zinc-800 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <User className="h-5 w-5 text-orange-500" />
        Consolidated Identity Profile
      </h3>

      <div className="bg-zinc-950 rounded-xl border border-zinc-800 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 space-y-5">
          {/* Primary ID Section */}
          <div>
            <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 block">
              Primary Contact ID
            </span>
            <div className="flex items-center">
              <span className="bg-orange-500/10 text-orange-500 border border-orange-500/20 text-lg font-bold px-3 py-1 rounded-lg">
                #{primaryId}
              </span>
            </div>
          </div>

          {/* Emails Section */}
          {contact.emails && contact.emails.length > 0 && (
            <div>
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Mail className="h-3.5 w-3.5" /> Emails
              </span>
              <div className="flex flex-wrap gap-2">
                {contact.emails.map((email, idx) => (
                  <Badge key={idx} variant="default">
                    {email}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Phone Numbers Section */}
          {contact.phoneNumbers && contact.phoneNumbers.length > 0 && (
            <div>
              <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Phone className="h-3.5 w-3.5" /> Phone Numbers
              </span>
              <div className="flex flex-wrap gap-2">
                {contact.phoneNumbers.map((phone, idx) => (
                  <Badge key={idx} variant="success">
                    {phone}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* Secondary IDs Section */}
          {contact.secondaryContactIds &&
            contact.secondaryContactIds.length > 0 && (
              <div>
                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Link className="h-3.5 w-3.5" /> Linked Profiles (Secondary
                  IDs)
                </span>
                <div className="flex flex-wrap gap-2">
                  {contact.secondaryContactIds.map((id, idx) => (
                    <Badge key={idx} variant="secondary">
                      #{id}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
