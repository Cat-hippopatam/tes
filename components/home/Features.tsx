import React from 'react';

interface FeaturesProps {
  features: {
    title: string;
    description: string;
    icon?: string;
  }[];
}

export const Features = ({ features }: FeaturesProps) => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#264653] mb-4">
            Почему выбирают нас
          </h2>
          <p className="text-xl text-[#6C757D] max-w-2xl mx-auto">
            Мы создаем качественный образовательный контент, который действительно работает
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-[#F8F9FA] rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 bg-[#F4A261]/10">
                {feature.icon || '✨'}
              </div>
              <h3 className="text-xl font-bold text-[#264653] mb-3">{feature.title}</h3>
              <p className="text-[#6C757D]">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};