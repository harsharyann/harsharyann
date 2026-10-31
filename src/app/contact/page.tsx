"use client";

import React, { useState } from "react";
import Link from "next/link";
import { portfolioData } from "@/data/portfolioData";
import { Check, Send, Copy, Mail, MapPin, Calendar, ArrowUp } from "lucide-react";
import { GithubIcon, LinkedinIcon, LeetCodeIcon } from "@/components/SocialIcons";
import { ThemeToggle } from "@/components/ThemeToggle";

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
      <div className="pb-6 border-b-2 border-black dark:border-stone-800 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="sketch-stamp mb-2 bg-indigo-600 text-white dark:bg-white dark:text-black">
            CONTACT &amp; CORRESPONDENCE
          </div>
          <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-black dark:text-white">
            Contact Desk
          </h1>
          <p className="mt-2 text-xs sm:text-sm font-mono text-stone-600 dark:text-stone-400 max-w-xl">
            Open to Summer 2026 early internship roles, collegiate hackathon teams, research mentorship, and open-source collaborations.
          </p>
        </div>

        <div className="text-xs font-mono font-bold text-stone-700 dark:text-stone-300 uppercase bg-stone-100 dark:bg-stone-900 p-2 rounded border border-black dark:border-stone-700">
          RESPONSE WINDOW • &lt; 24 HOURS
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Direct Info & Coordinates */}
        <div className="lg:col-span-5 space-y-6">
          {/* Direct Email Card */}
          <div className="sketch-box p-6 space-y-4">
            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-stone-400 uppercase block">
              OFFICIAL ELECTRONIC MAIL:
            </span>
            <div className="font-mono text-sm sm:text-base font-bold text-black dark:text-white break-all">
              {personal.email}
            </div>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="w-full sketch-button-outline text-xs py-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
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
            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-stone-400 uppercase block pb-2 border-b border-black dark:border-stone-800">
              CURRENT STATUS &amp; COORDINATES:
            </span>

            <div className="space-y-3 font-mono text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-600 dark:text-white shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-500 dark:text-stone-400 uppercase block text-[10px]">BASE LOCATION</span>
                  <span className="font-bold text-black dark:text-white">{personal.location}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-white shrink-0 mt-0.5" />
                <div>
                  <span className="text-stone-500 dark:text-stone-400 uppercase block text-[10px]">SEEKING / OPPORTUNITIES</span>
                  <span className="font-bold text-black dark:text-white">{personal.availability}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Channels List */}
          <div className="sketch-box p-6 space-y-3">
            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-stone-400 uppercase block pb-2 border-b border-black dark:border-stone-800">
              CONNECTED NETWORKS:
            </span>

            <div className="space-y-2">
              <a
                href={socialLinks.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-2.5 border-2 border-black dark:border-stone-700 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-mono text-xs font-bold"
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
                className="flex items-center justify-between p-2.5 border-2 border-black dark:border-stone-700 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-mono text-xs font-bold"
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
                  className="flex items-center justify-between p-2.5 border-2 border-black dark:border-stone-700 rounded hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all font-mono text-xs font-bold"
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
            <div className="flex items-center justify-between pb-3 border-b-2 border-black dark:border-stone-800">
              <div>
                <span className="sketch-stamp bg-indigo-600 text-white dark:bg-white dark:text-black">DISPATCH FORM</span>
                <h2 className="text-xl font-black uppercase text-black dark:text-white mt-2">
                  Send a Direct Message
                </h2>
              </div>
              <Send className="w-5 h-5 text-indigo-600 dark:text-white" />
            </div>

            {submitted ? (
              <div className="p-6 border-2 border-black dark:border-stone-700 bg-stone-50 dark:bg-stone-900 text-center space-y-3 rounded">
                <span className="text-3xl">✈️</span>
                <h3 className="text-lg font-black uppercase text-black dark:text-white">
                  Dispatch Sent Successfully!
                </h3>
                <p className="text-xs text-stone-700 dark:text-stone-300 font-mono">
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
                    className="block font-mono text-xs font-bold uppercase text-stone-700 dark:text-stone-300"
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
                    className="w-full p-3 border-2 border-black dark:border-stone-700 rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white dark:bg-stone-800 text-black dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="email"
                    className="block font-mono text-xs font-bold uppercase text-stone-700 dark:text-stone-300"
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
                    className="w-full p-3 border-2 border-black dark:border-stone-700 rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white dark:bg-stone-800 text-black dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="category"
                    className="block font-mono text-xs font-bold uppercase text-stone-700 dark:text-stone-300"
                  >
                    Inquiry Intent / Classification:
                  </label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full p-3 border-2 border-black dark:border-stone-700 rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white dark:bg-stone-800 text-black dark:text-white"
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
                    className="block font-mono text-xs font-bold uppercase text-stone-700 dark:text-stone-300"
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
                    className="w-full p-3 border-2 border-black dark:border-stone-700 rounded font-mono text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600 bg-white dark:bg-stone-800 text-black dark:text-white"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full sketch-button-solid py-3 text-sm flex items-center justify-center gap-2 cursor-pointer"
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

      {/* Editorial Contact Footer */}
      <footer className="mt-16 pt-10 border-t-2 border-black dark:border-stone-800 space-y-8 font-mono text-xs">
        {/* Upper tier: Colophon Details & Social Channels */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
          <div>
            <span className="bg-indigo-600 dark:bg-white text-white dark:text-black px-2.5 py-0.5 text-[11px] font-black uppercase rounded tracking-wider inline-block mb-2">
              SKETCHBOOK COLOPHON
            </span>
            <h4 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-black dark:text-white">
              {personal.name}
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 mt-1 max-w-md">
              Personal Portfolio • Handcrafted with Code, Math &amp; Models.
            </p>
          </div>

          {/* Social Channels */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noreferrer"
              className="sketch-pill"
            >
              <GithubIcon className="w-3.5 h-3.5" />
              <span>GitHub</span>
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noreferrer"
              className="sketch-pill"
            >
              <LinkedinIcon className="w-3.5 h-3.5" />
              <span>LinkedIn</span>
            </a>
            <a
              href={`mailto:${personal.email}`}
              className="sketch-pill"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>{personal.email}</span>
            </a>
          </div>
        </div>

        {/* Lower tier: Small Return-to-Cover Button, Theme Switcher & Copyright */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Small button to return to Cover Page */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/"
              className="sketch-button-solid text-xs py-1.5 px-3.5 inline-flex items-center gap-1.5 shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff] cursor-pointer"
              title="Return to Cover Page"
            >
              <span>← Cover Page</span>
            </Link>

            <span className="text-stone-500 dark:text-stone-400 font-bold text-[11px]">
              © 2026 Harsh Aryan • Handcrafted Edition
            </span>
          </div>

          {/* Theme Switcher ("colour change krne wla") + Back to Top */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-stone-500 dark:text-stone-400 font-bold text-[11px] uppercase">
                Theme:
              </span>
              <ThemeToggle showLabel />
            </div>

            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center gap-1 border-2 border-black dark:border-white px-2.5 py-1.5 rounded-full text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors font-bold cursor-pointer text-xs shadow-[2px_2px_0_#000] dark:shadow-[2px_2px_0_#fff]"
              title="Scroll to Top"
            >
              <span>Top</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
