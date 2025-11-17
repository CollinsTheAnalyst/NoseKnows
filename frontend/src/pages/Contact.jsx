import React, { useState } from "react";
import { FaWhatsapp, FaFacebookF, FaInstagram, FaTwitter } from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Message submitted! We will get back to you shortly.");
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section className="bg-[#FDECEF] py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-playfair font-bold text-[#042540] mb-12 text-center">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-[#042540]">Get in touch</h2>
            <p className="text-[#042540] font-montserrat text-lg">
              Have questions or inquiries? We’re here to help! Reach out via email, phone, social media, or our contact form.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#7B6IFF]">Email:</span>
                <a href="mailto:info@noseknows.com" className="hover:underline text-[#042540]">
                  info@noseknows.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#7B6IFF]">Phone:</span>
                <a href="tel:+254700000000" className="hover:underline text-[#042540]">
                  +254 700 000000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold text-[#7B6IFF]">Address:</span>
                <span className="text-[#042540]">Nairobi, Kenya</span>
              </div>
            </div>

            {/* Social Media & WhatsApp */}
            <div className="flex items-center gap-4 mt-6">
              <a
                href="https://wa.me/254700000000"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-green-500 text-white hover:bg-green-600 transition"
              >
                <FaWhatsapp />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition"
              >
                <FaFacebookF />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-pink-500 text-white hover:bg-pink-600 transition"
              >
                <FaInstagram />
              </a>
              <a
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-12 h-12 rounded-full bg-sky-500 text-white hover:bg-sky-600 transition"
              >
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-md flex flex-col gap-4"
          >
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B6IFF] transition"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B6IFF] transition"
              required
            />
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7B6IFF] transition"
              required
            ></textarea>
            <button
              type="submit"
              className="bg-[#7B6IFF] text-white font-semibold py-3 rounded-lg hover:bg-[#5e52d4] transition"
            >
              Send Message
            </button>
          </form>
        </div>

        {/* Embedded Google Map */}
        <div className="mt-12 w-full h-80 rounded-xl overflow-hidden shadow-md">
          <iframe
            title="NoseKnows Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15955.486043934095!2d36.7744!3d-1.2921!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1a4fcd1e3d3f%3A0x5f0f53f5f7c2e8e8!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1698489500000!5m2!1sen!2sus"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Contact;
