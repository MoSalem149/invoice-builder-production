// components/Landing/TermsConditions.tsx
import React from "react";

const TermsConditions: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold">Terms & Conditions</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
        <p className="mb-6">
          Welcome to Boxcars.com. These Terms & Conditions govern your use of
          our website and services. By accessing or using our services, you
          agree to be bound by these Terms.
        </p>

        <h2 className="text-2xl font-semibold mb-4">2. Use of the Website</h2>
        <p className="mb-6">
          You agree to use this website only for lawful purposes and in a way
          that does not infringe the rights of, restrict or inhibit anyone
          else's use and enjoyment of the website.
        </p>

        <h2 className="text-2xl font-semibold mb-4">
          3. Intellectual Property
        </h2>
        <p className="mb-6">
          All content on this website, including text, graphics, logos, and
          images, is the property of Boxcars.com or its content suppliers and is
          protected by international copyright laws.
        </p>

        <h2 className="text-2xl font-semibold mb-4">4. Vehicle Listings</h2>
        <p className="mb-6">
          While we strive for accuracy, we do not warrant that vehicle
          descriptions or other content on this site is accurate, complete,
          reliable, current, or error-free.
        </p>

        <h2 className="text-2xl font-semibold mb-4">
          5. Limitation of Liability
        </h2>
        <p className="mb-6">
          Boxcars.com shall not be liable for any indirect, incidental, special,
          or consequential damages resulting from the use of or inability to use
          our services.
        </p>

        <h2 className="text-2xl font-semibold mb-4">6. Changes to Terms</h2>
        <p className="mb-6">
          We reserve the right to modify these Terms at any time. Your continued
          use of the website after such changes constitutes your acceptance of
          the new Terms.
        </p>

        <h2 className="text-2xl font-semibold mb-4">7. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the
          laws of Switzerland, without regard to its conflict of law provisions.
        </p>
      </div>
    </div>
  );
};

export default TermsConditions;
