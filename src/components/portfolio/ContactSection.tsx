import React, { useState } from 'react';
import { Send, Mail, MapPin, Check, Copy, ExternalLink, Globe, Twitter, Linkedin } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const directEmail = 'alex.vance@chrono-spatial.io';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSubmitted(false), 4000);
    }, 1000);
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(directEmail);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section id="contact" className="w-full py-20 border-t border-neutral-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left info column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 text-indigo-400 font-mono-code text-xs font-semibold uppercase">
              <Send className="w-4 h-4" />
              <span>Initiate Transmission</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
              Let's Build Something Dimensional
            </h2>

            <p className="text-sm text-neutral-400 leading-relaxed">
              Available for full-time spatial engineering, 3D interactive web experiences, and high-precision systems consulting.
            </p>

            <div className="space-y-4 pt-4">
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[11px] font-mono-code text-neutral-400">Direct Email</div>
                    <div className="text-sm font-mono-code text-white">{directEmail}</div>
                  </div>
                </div>

                <button
                  onClick={handleCopyEmail}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
                  title="Copy email"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-[11px] font-mono-code text-neutral-400">Timezone Operations</div>
                  <div className="text-sm font-mono-code text-white">Global Remote / UTC-4 to UTC+9</div>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-4 flex items-center gap-3">
              {[
                { icon: Globe, label: 'Global Spatial Network', href: '#' },
                { icon: Twitter, label: 'Twitter / X', href: 'https://x.com' },
                { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com' },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 rounded-xl bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700 transition-colors"
                    title={s.label}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Right form column */}
          <div className="lg:col-span-7">
            <div className="p-6 md:p-8 rounded-2xl bg-neutral-900/80 border border-neutral-800 shadow-2xl">
              <h3 className="text-xl font-bold font-display text-white mb-2">Send Direct Message</h3>
              <p className="text-xs text-neutral-400 mb-6">
                Fill out the transmission form below for inquiries, collaborations, or 3D architectural reviews.
              </p>

              {submitted ? (
                <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-in fade-in">
                  <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="font-bold text-white text-base">Transmission Dispatched</h4>
                  <p className="text-xs text-neutral-300">
                    Thank you! Your message has been logged into the communication queue. Expect a response within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono-code text-neutral-400 mb-1">Your Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Elena Rostova"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono-code text-neutral-400 mb-1">Email Address</label>
                      <input
                        type="email"
                        required
                        placeholder="elena@company.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono-code text-neutral-400 mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      placeholder="3D WebGL Architectural Consultation"
                      value={form.subject}
                      onChange={(e) => setForm({ ...form, subject: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono-code text-neutral-400 mb-1">Message</label>
                    <textarea
                      rows={4}
                      required
                      placeholder="Describe your project, timeline, and spatial requirements..."
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 px-6 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-mono-code text-xs font-semibold transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span>Transmitting Payload...</span>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Dispatch Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
