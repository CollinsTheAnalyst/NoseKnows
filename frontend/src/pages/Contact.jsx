import React from "react";

const Contact = () => {
  return (
    <section className="bg-[#FDECEF] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-playfair font-bold text-[#042540] mb-6 text-center">
          Contact Us
        </h1>
        <div className="text-center space-y-4 text-[#042540] font-montserrat text-lg">
          <p>Email: <a href="mailto:info@noseknows.com" className="text-[#7B6IFF] hover:underline">info@noseknows.com</a></p>
          <p>Phone: <a href="tel:+254700000000" className="text-[#7B6IFF] hover:underline">+254 700 000000</a></p>
        </div>
      </div>
    </section>
  );
};

export default Contact;
