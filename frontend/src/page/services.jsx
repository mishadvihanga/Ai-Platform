import React from 'react';

const Services = () => {
  const servicesList = [
    {
      title: "AI Resume Matching",
      desc: "Our smart AI algorithms match your profile with the best-fitting jobs automatically.",
      color: "border-blue-500"
    },
    {
      title: "Talent Acquisition",
      desc: "For employers, find verified top-tier AI and Machine Learning professionals effortlessly.",
      color: "border-green-500"
    },
    {
      title: "Skill Assessments",
      desc: "Test your AI knowledge with our automated skill badges to stand out to employers.",
      color: "border-blue-500"
    }
  ];

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
          Our <span className="text-blue-600">AI-Powered</span> Services
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-gray-500">
          We bridge the gap between brilliant minds and cutting-edge tech companies.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {servicesList.map((service, index) => (
            <div key={index} className={`bg-white p-8 rounded-2xl shadow-md border-t-4 ${service.color} hover:shadow-lg transition-shadow`}>
              <h3 className="text-xl font-bold text-gray-800 mb-3">{service.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{service.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;