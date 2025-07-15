// components/Landing/Services.tsx
import React from "react";
import { Wrench, Car, ShieldCheck, CreditCard, Clock } from "lucide-react";

const Services: React.FC = () => {
  const services = [
    {
      icon: <Car className="h-8 w-8" />,
      title: "Vehicle Sales",
      description:
        "Wide selection of new and pre-owned vehicles from top brands.",
    },
    {
      icon: <Wrench className="h-8 w-8" />,
      title: "Maintenance & Repairs",
      description:
        "Expert service for all makes and models using genuine parts.",
    },
    {
      icon: <ShieldCheck className="h-8 w-8" />,
      title: "Extended Warranties",
      description: "Comprehensive protection plans for your peace of mind.",
    },
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Financing Options",
      description: "Flexible payment plans tailored to your budget.",
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "24/7 Roadside Assistance",
      description: "Help whenever you need it, day or night.",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <h1 className="text-3xl font-bold mb-8">Our Services</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center mb-4">
              <div className="bg-blue-100 p-2 rounded-full mr-4">
                {service.icon}
              </div>
              <h2 className="text-xl font-semibold">{service.title}</h2>
            </div>
            <p className="text-gray-600">{service.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
