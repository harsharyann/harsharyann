"use client";

import React, { useState } from "react";
import Link from "next/link";
import { portfolioData } from "@/data/portfolioData";
import { Check, Send, Copy, Mail, MapPin, Calendar, ArrowLeft } from "lucide-react";
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from "@/components/SocialIcons";
import { AutoPageTurn } from "@/components/AutoPageTurn";

export default function ContactPage() {
  const { personal, socialLinks } = portfolioData;
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    category: "Summer 2026 Internship Opportunity",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        category: "Summer 2026 Internship Opportunity",
        message: "",
      });
    }, 600);
  };

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 max-w-6xl xl:max-w-7xl mx-auto space-y-12">
      {/* Page Header */}
      <div className="pb-6 border-b-2 border-black flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="sketch-stamp mb-2">
            CONTACT &amp; CORRESPONDENCE
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black">
            Contact Desk
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-stone-600 max-w-xl">
            Open to Summer 2026 early internship roles, collegiate hackathon teams, research mentorship, and open-source collaborations.
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-stone-700 uppercase bg-stone-100 p-2 rounded border border-black">
          RESPONSE WINDOW • &lt; 24 HOURS
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Info & Coordinates */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Email Card */}
          <div className="sketch-box p-6 space-y-4">
            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block">
              OFFICIAL ELECTRONIC MAIL:
            </span>
            <div className="font-mono text-sm sm:text-base font-bold text-black break-all">
              {personal.email}
            </div>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="w-full sketch-button-outline text-xs py-2"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Email Address</span>
                </>
              )}
            </button>
          </div>

          {/* Availability & Location Card */}
          <div className="sketch-box p-6 space-y-4">
            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block pb-2 border-b border-black">
              CURRENT STATUS &amp; COORDINATES:
            </span>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-500 uppercase block text-[10px]">BASE LOCATION</span>
                  <span className="font-bold text-black">{personal.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-black shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-500 uppercase block text-[10px]">SEEKING / OPPORTUNITIES</span>
                  <span className="font-bold text-black">{personal.availability}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Channels List */}
          <div className="sketch-box p-6 space-y-3">
            <span className="text-[10px] font-mono font-bold text-stone-500 uppercase block pb-2 border-b border-black">
              CONNECTED NETWORKS:
            </span>

            <div className="space-y-2">
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 border-2 border-black rounded hover:bg-black hover:text-white transition-all font-mono text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <GithubIcon className="w-4 h-4" />
                  <span>GitHub Profile</span>
                </div>
                <span>↗</span>
              </a>

              <a
                href={socialLinks.linkedin}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 border-2 border-black rounded hover:bg-black hover:text-white transition-all font-mono text-xs font-bold"
              >
                <div className="flex items-center gap-2">
                  <LinkedinIcon className="w-4 h-4" />
                  <span>LinkedIn Network</span>
                </div>
                <span>↗</span>
              </a>

              {socialLinks.leetcode && (
                <a
                  href={socialLinks.leetcode}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-between p-2.5 border-2 border-black rounded hover:bg-black hover:text-white transition-all font-mono text-xs font-bold"
                >
                  <div className="flex items-center gap-2">
                    <LeetCodeIcon className="w-4 h-4" />
                    <span>LeetCode Practice</span>
                  </div>
                  <span>↗</span>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Sketchbook Mailbox Form */}
        <div className="lg:col-span-7">
          <div className="sketch-box p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between pb-3 border-b-2 border-black">
              <div>
                <span className="sketch-stamp">DISPATCH FORM</span>
                <h2 className="text-xl font-black uppercase text-black mt-2">
                  Send a Direct Message
                </h2>
              </div>
              <Send className="w-5 h-5 text-black" />
            </div>

            {submitted ? (
              <div className="p-6 border-2 border-black bg-stone-50 text-center space-y-3 rounded">
                <span className="text-3xl">✈️</span>
                <h3 className="text-lg font-black uppercase text-black">
                  Dispatch Sent Successfully!
                </h3>
                <p className="text-xs text-stone-700 font-mono">
                  Thank you for reaching out. Harsh will review your note and respond back promptly.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="sketch-button-solid text-xs mt-2"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label
                    htmlFor="name"
                    className="block font-mono text-xs font-bold uppercase text-stone-700"
                  >
                    Your Full Name / Organization:
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g. Alex Morgan / Tech Team"
                    className="w-full p-3 border-2 border-black rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs font-bold uppercase text-stone-700"
                  >
                    Your Return Email:
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="e.g. alex@company.com"
                    className="w-full p-3 border-2 border-black rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="category"
                    className="block font-mono text-xs font-bold uppercase text-stone-700"
                  >
                    Inquiry Intent / Classification:
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full p-3 border-2 border-black rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  >
                    <option value="Summer 2026 Internship Opportunity">
                      Summer 2026 Early Internship Opportunity
                    </option>
                    <option value="Hackathon Team Collaboration">
                      Hackathon Team / Open Source Collaboration
                    </option>
                    <option value="Research Mentorship">
                      Research &amp; AI Mentorship
                    </option>
                    <option value="General Conversation / Connect">
                      General Connection / Coffee Chat
                    </option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="message"
                    className="block font-mono text-xs font-bold uppercase text-stone-700"
                  >
                    Note / Message:
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Tell me about the role, hackathon project, or problem you are exploring..."
                    className="w-full p-3 border-2 border-black rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-black bg-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sketch-button-solid py-3 text-sm flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  <span>
                    {submitting ? "Launching Dispatch..." : "Send Paper Plane Message ✈️"}
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Automatic Page Turn to Cover */}
      <AutoPageTurn
        nextPath="/"
        nextTitle="Cover Page"
        subtitle="Cycle complete • Returning to the interactive doodle cover..."
        isReturnToStart={true}
      />
    </div>
  );
}
