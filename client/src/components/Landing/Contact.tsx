// components/Landing/Contact.tsx
import React from "react";
import { Phone, Mail, MapPin, Clock } from "lucide-react";

const Contact: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>

          <div className="space-y-4">
            <div className="flex items-start">
              <MapPin className="h-5 w-5 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Address</h3>
                <p className="text-gray-600">
                  Via S.Gottardo 100, 6596 Gordola, Switzerland
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-5 w-5 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Phone</h3>
                <p className="text-gray-600">+41 91 929 29 29</p>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-5 w-5 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-gray-600">info@saidauto.ch</p>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-5 w-5 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium">Business Hours</h3>
                <p className="text-gray-600">
                  Monday-Friday: 9:00 AM - 6:00 PM
                  <br />
                  Saturday: 9:00 AM - 4:00 PM
                  <br />
                  Sunday: Closed
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Send Us a Message</h2>
          <form className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Subject
              </label>
              <input
                type="text"
                id="subject"
                className="w-full p-2 border border-gray-300 rounded"
                required
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Message
              </label>
              <textarea
                id="message"
                rows={4}
                className="w-full p-2 border border-gray-300 rounded"
                required
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Send Message
            </button>
          </form>
        </div> */}
      </div>
    </div>
  );
};

export default Contact;
