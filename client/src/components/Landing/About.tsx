// components/Landing/About.tsx
import React from "react";

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-6">About Us</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
        <p className="mb-4">
          Founded in 2005, Said Auto has grown from a small local dealership to
          one of the most trusted names in the automotive industry in
          Switzerland. Our commitment to quality vehicles and exceptional
          customer service has been the driving force behind our success.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
        <p className="mb-4">
          We strive to provide our customers with the best selection of vehicles
          at competitive prices, along with transparent and hassle-free
          purchasing experience. Our team of experts is dedicated to helping you
          find the perfect vehicle to match your needs and budget.
        </p>

        <h2 className="text-2xl font-semibold mb-4">Our Team</h2>
        <p>
          Our knowledgeable staff brings decades of combined experience in the
          automotive industry. From sales to service, every team member is
          committed to your complete satisfaction.
        </p>
      </div>
    </div>
  );
};

export default About;
