// components/Landing/Terms.tsx
import React from "react";

const Terms: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-12">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold">Terms of Service</h1>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">1. General Terms</h2>
        <p className="mb-4">
          By accessing and using our services, you accept and agree to be bound
          by these Terms. If you do not agree, please refrain from using our
          services.
        </p>

        <h2 className="text-2xl font-semibold mb-4">2. Vehicle Purchases</h2>
        <p className="mb-4">
          All vehicle sales are subject to availability. Prices are subject to
          change without notice. Taxes, registration, and other fees are
          additional unless otherwise stated.
        </p>

        <h2 className="text-2xl font-semibold mb-4">3. Payment</h2>
        <p className="mb-4">
          Full payment is required before vehicle delivery unless financing is
          arranged. We accept various payment methods as outlined in our payment
          policy.
        </p>

        <h2 className="text-2xl font-semibold mb-4">4. Warranties</h2>
        <p className="mb-4">
          New vehicles come with manufacturer warranties. Pre-owned vehicles may
          come with limited warranties as specified at the time of purchase.
        </p>

        <h2 className="text-2xl font-semibold mb-4">
          5. Limitation of Liability
        </h2>
        <p>
          Our liability is limited to the maximum extent permitted by law. We
          are not responsible for any indirect, incidental, or consequential
          damages.
        </p>
      </div>
    </div>
  );
};

export default Terms;
