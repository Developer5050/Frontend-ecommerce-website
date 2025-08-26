import React, { useState } from "react";
import { MdOutlineEmail } from "react-icons/md";
import { FiPhoneCall, FiMapPin } from "react-icons/fi";
import Footer from "../../components/footer/Footer";

const Contact = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form); 
    alert("Your message has been submitted!");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="mt-16 font-poppins">
      {/* Header */}
      <div className="text-center py-5 px-4">
        <h1 className="text-xl sm:text-3xl md:text-2xl md:font-semibold font-semibold font-ubuntu text-center mb-5">
          Contact Us
        </h1>
        <p className="text-gray-600 max-w-xl mx-auto text-base font-ubuntu">
          Have any questions or suggestions? We'd love to hear from you!
        </p>
      </div>

      {/* Contact Info + Form */}
      <div className="max-w-6xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 gap-10 mb-20 mt-6">
        {/* Contact Info */}
        <div className="space-y-6 font-ubuntu">
          <div className="flex items-start gap-3">
            <FiPhoneCall className="text-black w-5 h-5 mt-1" />
            <div>
              <h3 className="font-semibold">Phone</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                +92 345 460 5682
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MdOutlineEmail className="text-black w-5 h-5 mt-1" />
            <div>
              <h3 className="font-semibold">Email</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                ahmadshoukat7766@gmail.com
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <FiMapPin className="text-black w-5 h-5 mt-1" />
            <div>
              <h3 className="font-semibold">Address</h3>
              <p className="text-gray-600 text-sm sm:text-base">
                123 Main Street, Lahore, Pakistan
              </p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-ubuntu">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={form.message}
            onChange={handleChange}
            rows="5"
            required
            className="w-full border border-gray-300 rounded-md p-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-black"
          />
          <button
            type="submit"
            className="bg-black text-white py-2 px-6 rounded-sm hover:bg-gray-800 transition text-sm sm:text-base"
          >
            Send Message
          </button>
        </form>
      </div>

      {/* Newsletter (Already Added by You) */}
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-black text-white rounded-xl px-4 py-8 mt-10 mx-4 sm:mx-6 md:mx-10 flex flex-col md:flex-row md:justify-between md:items-center gap-6">
          <div className="text-center md:text-left text-lg sm:text-xl font-extrabold font-ubuntu leading-tight w-full md:w-[48%]">
            STAY UP TO DATE <br className="hidden sm:block" />
            ABOUT OUR LATEST OFFERS
          </div>

          <div className="w-full md:w-[48%] flex flex-col gap-2">
            <div className="flex items-center bg-white rounded-full py-2 px-3">
              <MdOutlineEmail className="w-5 h-5 text-gray-500 mr-2" />
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 text-black text-sm sm:text-base font-ubuntu outline-none bg-transparent"
              />
            </div>
            <button className="bg-white text-black font-semibold font-ubuntu rounded-full px-6 py-2 text-sm sm:text-base hover:bg-gray-100 transition">
              Subscribe to Email
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 w-full">
        <Footer />
      </div>
    </div>
  );
};

export default Contact;
