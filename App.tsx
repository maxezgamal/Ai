import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { ContentDisplay } from './components/ContentDisplay';
import { Loader } from './components/Loader';
import { SparklesIcon } from './components/icons/SparklesIcon';
import { TopicSelector } from './components/TopicSelector';
import { generateContent, generateImage, generateTopicSuggestions } from './services/geminiService';
import type { GeneratedContent } from './types';

type View = 'topicSelection' | 'contentDisplay';

const App: React.FC = () => {
  // View management
  const [view, setView] = useState<View>('topicSelection');

  // Topic generation state
  const [topics, setTopics] = useState<string[]>([]);
  const [isGeneratingTopics, setIsGeneratingTopics] = useState<boolean>(true);
  const [topicError, setTopicError] = useState<string | null>(null);
  
  // Content generation state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Image generation state
  const [isGeneratingImage, setIsGeneratingImage] = useState<boolean>(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [imageGenerationError, setImageGenerationError] = useState<string | null>(null);

  // Function to load topics
  const loadTopics = useCallback(async () => {
    setIsGeneratingTopics(true);
    setTopicError(null);
    try {
      const suggestedTopics = await generateTopicSuggestions();
      setTopics(suggestedTopics);
    } catch (err) {
      console.error(err);
      setTopicError(err instanceof Error ? err.message : 'An unexpected error occurred while fetching topics.');
    } finally {
      setIsGeneratingTopics(false);
    }
  }, []);

  // Load topics on initial mount or when returning to topic selection
  useEffect(() => {
    if (view === 'topicSelection') {
      loadTopics();
    }
  }, [view, loadTopics]);

  // Function to generate the full post from a selected topic
  const handleGenerateContent = useCallback(async (topic: string) => {
    setView('contentDisplay');
    setIsLoading(true);
    setError(null);
    setGeneratedContent(null);
    setGeneratedImageUrl(null);
    setImageGenerationError(null);

    try {
      const content = await generateContent(topic);
      setGeneratedContent(content);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Function for generating image (remains the same)
  const handleGenerateImage = useCallback(async (prompt: string) => {
    if (!prompt) return;
    setIsGeneratingImage(true);
    setGeneratedImageUrl(null);
    setImageGenerationError(null);
    try {
      const base64Image = await generateImage(prompt);
      const imageUrl = `data:image/jpeg;base64,${base64Image}`;
      setGeneratedImageUrl(imageUrl);
    } catch (err) {
      console.error(err);
      setImageGenerationError(err instanceof Error ? err.message : 'An unexpected error occurred while generating the image.');
    } finally {
      setIsGeneratingImage(false);
    }
  }, []);
  
  // Function to go back to the topic selection screen
  const handleStartOver = () => {
    setGeneratedContent(null);
    setError(null);
    setTopics([]); // Clear old topics to show loader
    setView('topicSelection');
  };

  const renderContent = () => {
    if (view === 'topicSelection') {
      return (
        <TopicSelector
          topics={topics}
          isLoading={isGeneratingTopics}
          error={topicError}
          onSelectTopic={handleGenerateContent}
          onRefreshTopics={loadTopics}
        />
      );
    }
    
    // view === 'contentDisplay'
    return (
      <>
        <div className="max-w-4xl mx-auto text-center mb-12">
           <button
            onClick={handleStartOver}
            className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#7AC943] to-[#A066A6] text-white font-bold text-xl rounded-full shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
          >
            <SparklesIcon className="w-6 h-6 ml-3" />
            إنشاء منشور جديد
          </button>
        </div>
        
        {isLoading && <Loader />}
        {error && (
          <div className="max-w-2xl mx-auto bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md" role="alert">
            <p className="font-bold">حدث خطأ</p>
            <p>{error}</p>
          </div>
        )}
        {generatedContent && !isLoading && (
           <ContentDisplay 
            content={generatedContent}
            onGenerateImage={handleGenerateImage}
            isGeneratingImage={isGeneratingImage}
            generatedImageUrl={generatedImageUrl}
            imageGenerationError={imageGenerationError}
          />
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      <Header />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;