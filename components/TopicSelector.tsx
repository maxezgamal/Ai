import React from 'react';

interface TopicSelectorProps {
  topics: string[];
  isLoading: boolean;
  error: string | null;
  onSelectTopic: (topic: string) => void;
  onRefreshTopics: () => void;
}

const RefreshIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
        <path d="M21 3v5h-5" />
        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
        <path d="M3 21v-5h5" />
    </svg>
);


export const TopicSelector: React.FC<TopicSelectorProps> = ({
  topics,
  isLoading,
  error,
  onSelectTopic,
  onRefreshTopics,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A066A6] mx-auto"></div>
        <p className="mt-4 text-gray-600">جاري البحث عن أفكار إبداعية...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
        <p className="font-bold">حدث خطأ أثناء اقتراح المواضيع</p>
        <p>{error}</p>
        <button
          onClick={onRefreshTopics}
          className="mt-4 bg-red-500 text-white font-bold py-2 px-4 rounded hover:bg-red-700"
        >
          حاول مرة أخرى
        </button>
      </div>
    );
  }

  return (
    <div dir="rtl" className="max-w-4xl mx-auto text-center animate-fade-in">
        <h2 className="text-3xl font-bold text-gray-800 mb-4">اختر موضوعًا للبدء</h2>
        <p className="text-lg text-gray-600 mb-8">
            اختر أحد المواضيع المقترحة التالية لإنشاء منشور متكامل عنه.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-right">
            {topics.map((topic, index) => (
                <button
                    key={index}
                    onClick={() => onSelectTopic(topic)}
                    className="p-6 bg-white rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transform transition-all duration-300 border-r-4 border-[#7AC943]"
                >
                    <p className="text-lg font-semibold text-gray-800">{topic}</p>
                </button>
            ))}
        </div>
        <div className="mt-8">
             <button
                onClick={onRefreshTopics}
                className="inline-flex items-center justify-center px-6 py-3 bg-gray-200 text-gray-700 font-bold text-lg rounded-full shadow-sm hover:bg-gray-300 transition-all duration-300"
            >
                <RefreshIcon className="w-5 h-5 ml-2" />
                اقتراح مواضيع جديدة
            </button>
        </div>
    </div>
  );
};