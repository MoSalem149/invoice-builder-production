// components/Landing/PrivacyNotice.tsx
import React from "react";

const PrivacyNotice: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold">Privacy Notice</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">
          1. Information We Collect
        </h2>
        <p className="mb-6">
          We collect personal information you provide when using our services,
          including name, contact details, and vehicle preferences. We also
          collect technical data like IP addresses and browser information for
          analytics.
        </p>

        <h2 className="text-2xl font-semibold mb-4">
          2. How We Use Your Information
        </h2>
        <p className="mb-6">
          Your information is used to provide and improve our services, process
          inquiries, communicate with you, and (with your consent) for marketing
          purposes. We may use aggregated data for business analytics.
        </p>

        <h2 className="text-2xl font-semibold mb-4">3. Data Sharing</h2>
        <p className="mb-6">
          We may share your information with trusted third-party service
          providers who assist us in operating our business, but only to the
          extent necessary. We do not sell your personal information to third
          parties.
        </p>

        <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
        <p className="mb-6">
          We implement appropriate security measures to protect your personal
          information against unauthorized access, alteration, or destruction.
          However, no internet transmission is completely secure.
        </p>

        <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
        <p className="mb-6">
          You have the right to access, correct, or delete your personal
          information. You may also object to or restrict certain processing
          activities. To exercise these rights, please contact us at
          info@saidauto.ch.
        </p>

        <h2 className="text-2xl font-semibold mb-4">6. Cookies</h2>
        <p className="mb-6">
          Our website uses cookies to enhance your experience. You can control
          cookies through your browser settings, but disabling them may affect
          website functionality.
        </p>

        <h2 className="text-2xl font-semibold mb-4">
          7. Changes to This Notice
        </h2>
        <p>
          We may update this Privacy Notice periodically. Significant changes
          will be communicated through our website or via email when
          appropriate.
        </p>
      </div>
    </div>
  );
};

export default PrivacyNotice;
