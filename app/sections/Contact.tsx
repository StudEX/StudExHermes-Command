'use client';

import React, { useState } from 'react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitMessage('Message sent successfully! I\'ll get back to you soon.');
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitMessage('Error sending message. Please try again.');
      }
    } catch (error) {
      setSubmitMessage('Error sending message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20 px-8 bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-black text-gray-900 mb-4">Get In Touch</h2>
          <p className="text-lg text-gray-600">
            Have a project idea or want to collaborate? I'd love to hear from you.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white p-12 rounded-lg shadow-lg border-t-4 border-orange-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded focus:border-orange-600 focus:outline-none transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded focus:border-orange-600 focus:outline-none transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-900 mb-2">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded focus:border-orange-600 focus:outline-none transition-colors"
              placeholder="What's this about?"
            />
          </div>

          <div className="mb-8">
            <label className="block text-sm font-bold text-gray-900 mb-2">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded focus:border-orange-600 focus:outline-none transition-colors"
              placeholder="Your message..."
            />
          </div>

          {submitMessage && (
            <div className={`p-4 rounded mb-6 text-sm font-bold ${
              submitMessage.includes('successfully')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}>
              {submitMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-orange-600 text-white font-black text-lg py-4 rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="text-center">
            <div className="text-3xl font-black text-orange-600 mb-2">Email</div>
            <p className="text-gray-600">t.ramaphosa@studex.dev</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-orange-600 mb-2">Location</div>
            <p className="text-gray-600">South Africa / Global</p>
          </div>
          <div className="text-center">
            <div className="text-3xl font-black text-orange-600 mb-2">Response Time</div>
            <p className="text-gray-600">Within 24 hours</p>
          </div>
        </div>
      </div>
    </section>
  );
}
