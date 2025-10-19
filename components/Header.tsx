
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#7AC943] to-[#A066A6]">
          Dr. Hayam's Clinic Social Post Generator
        </h1>
        <p className="text-gray-500 mt-1">
          أداة الذكاء الاصطناعي لإنشاء محتوى يومي لعيادة د. هيام لأمراض المخ والأعصاب
        </p>
      </div>
    </header>
  );
};
