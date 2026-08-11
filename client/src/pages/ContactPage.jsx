import React, { useState } from 'react';
import SectionTitle from '../components/ui/SectionTitle';
import { useToast } from '../components/common/Toast';

const ContactPage = () => {
  const toast = useToast();
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1200));
    toast('Your message has been sent! We\'ll get back to you within 24 hours. 👑', 'success');
    setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    setLoading(false);
  };

  const contactInfo = [
    { icon: '📍', title: 'Visit Us', details: ['14 Gulberg III', 'Lahore, Punjab 54000', 'Pakistan'] },
    { icon: '📞', title: 'Call Us', details: ['+92 336 7947525', 'Mon-Sat 10AM - 8PM'] },
    { icon: '✉️', title: 'Email Us', details: ['saimlinkedin0000@gmail.com'] },
    { icon: '💬', title: 'WhatsApp', details: ['+92 336 7947525', 'Chat with us anytime', 'Quick responses'] },
  ];

  return (
    <div className="pt-20 bg-cream-50 dark:bg-navy-900 min-h-screen">
      {/* Header */}
      <div className="relative h-56 overflow-hidden">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #0A0F1E, #1A1F35)' }} />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, rgba(201,169,110,0.15) 0%, transparent 70%)' }} />
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-5xl font-bold text-white mb-3 animate-slide-up">Contact Us</h1>
          <p className="text-gray-300 animate-fade-in">We'd love to hear from you</p>
        </div>
      </div>

      <div className="container-custom py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-4">
            {contactInfo.map((info) => (
              <div key={info.title} className="bg-white dark:bg-navy-800 rounded-2xl p-6 shadow-card hover-lift">
                <div className="text-3xl mb-3">{info.icon}</div>
                <h3 className="font-display text-lg font-bold text-gray-900 dark:text-white mb-2">{info.title}</h3>
                {info.details.map((d, i) => (
                  <p key={i} className="text-sm text-gray-500 dark:text-gray-400">{d}</p>
                ))}
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-navy-800 rounded-2xl p-8 shadow-card">
              <h2 className="font-display text-2xl font-bold text-gray-900 dark:text-white mb-6">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Your Name *</label>
                    <input name="name" value={form.name} onChange={handleChange} required placeholder="Muhammad Ali" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                    <input type="email" name="email" value={form.email} onChange={handleChange} required placeholder="ali@example.com" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                    <input name="phone" value={form.phone} onChange={handleChange} placeholder="+92 300 1234567" className="form-input" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject *</label>
                    <select name="subject" value={form.subject} onChange={handleChange} required className="form-input cursor-pointer">
                      <option value="">Select a subject...</option>
                      <option>Order Inquiry</option>
                      <option>Product Question</option>
                      <option>Return / Exchange</option>
                      <option>Wholesale / B2B</option>
                      <option>General Feedback</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5} placeholder="Write your message here..." className="form-input resize-none" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary px-10 py-4 text-base">
                  {loading ? (
                    <><svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Sending...</>
                  ) : '📩 Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Map placeholder */}
        <div className="mt-12 rounded-3xl overflow-hidden shadow-luxury h-64 bg-gray-200 dark:bg-navy-800 flex items-center justify-center">
          <div className="text-center">
            <div className="text-5xl mb-3">📍</div>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Lahore, Punjab, Pakistan</p>
            <p className="text-gray-400 text-sm mt-1">Royal Zone Headquarters — Gulberg III</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
