import React from 'react';
import type { GeneratedContent } from '../types';

// --- Helper Components defined in-file for simplicity ---

const ImageIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
    <circle cx="9" cy="9" r="2"></circle>
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
  </svg>
);

const SimpleLoader: React.FC = () => (
    <div className="flex justify-center items-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#A066A6]"></div>
    </div>
);

const ImageDisplayCard: React.FC<{ imageUrl: string | null; isLoading: boolean; error: string | null; title: string; }> = ({ imageUrl, isLoading, error, title }) => {
  return (
    <div dir="ltr" className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200 flex flex-col items-center justify-center aspect-square min-h-[300px]">
      {isLoading && <SimpleLoader />}
      
      {!isLoading && error && (
        <div className="text-center text-red-600 p-4">
          <p className="font-bold">Image Generation Failed</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
      )}

      {!isLoading && !error && imageUrl && (
        <div className="w-full h-full flex flex-col">
            <img src={imageUrl} alt={title || 'Generated social media visual'} className="w-full h-full object-cover rounded-lg flex-grow" />
            <a 
              href={imageUrl} 
              download={`${title.replace(/\s+/g, '_') || 'generated_image'}.jpg`}
              className="mt-4 w-full bg-[#7AC943] hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-200 text-center"
            >
              Download Image
            </a>
        </div>
      )}

      {!isLoading && !error && !imageUrl && (
        <div className="text-center text-gray-400">
          <ImageIcon className="w-16 h-16 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600">Image Preview</h3>
          <p className="text-gray-500">Generate an image from the prompt to see it here.</p>
        </div>
      )}
    </div>
  );
};


// --- Main Component ---

interface ContentDisplayProps {
  content: GeneratedContent;
  onGenerateImage: (prompt: string) => void;
  isGeneratingImage: boolean;
  generatedImageUrl: string | null;
  imageGenerationError: string | null;
}

export const ContentDisplay: React.FC<ContentDisplayProps> = ({ 
  content, 
  onGenerateImage, 
  isGeneratingImage, 
  generatedImageUrl, 
  imageGenerationError 
}) => {
  return (
    <div dir="rtl" className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto animate-fade-in">
      <PostCard post={content.post} />
      <div className="space-y-8">
        <ImagePromptCard 
            imagePrompt={content.image.image_prompt} 
            onGenerateImage={() => onGenerateImage(content.image.image_prompt)}
            isGeneratingImage={isGeneratingImage}
        />
        <ImageDisplayCard 
            imageUrl={generatedImageUrl}
            isLoading={isGeneratingImage}
            error={imageGenerationError}
            title={content.post.title}
        />
      </div>
    </div>
  );
};

const PostCard: React.FC<{ post: GeneratedContent['post'] }> = ({ post }) => (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{post.title}</h2>
        <div className="text-gray-700 space-y-4 whitespace-pre-wrap text-lg leading-relaxed">
            {post.caption.split('\n\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
            ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-2">
            {post.hashtags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
                    {tag}
                </span>
            ))}
        </div>
    </div>
);

const ImagePromptCard: React.FC<{ 
    imagePrompt: string; 
    onGenerateImage: () => void;
    isGeneratingImage: boolean;
}> = ({ imagePrompt, onGenerateImage, isGeneratingImage }) => {
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(imagePrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div dir="ltr" className="bg-gray-800 text-gray-200 p-6 rounded-2xl shadow-lg flex flex-col">
            <h3 className="text-xl font-bold text-white mb-4">🖼️ Image Generation Prompt</h3>
            <p className="font-mono text-base bg-gray-900 p-4 rounded-lg flex-grow">{imagePrompt}</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                 <button
                    onClick={onGenerateImage}
                    disabled={isGeneratingImage}
                    className="w-full bg-gradient-to-r from-[#7AC943] to-[#A066A6] hover:opacity-90 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:opacity-50 disabled:cursor-wait flex items-center justify-center"
                >
                    {isGeneratingImage ? 'Generating...' : 'Generate Image'}
                </button>
                <button
                    onClick={handleCopy}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
                >
                    {copied ? 'Copied!' : 'Copy Prompt'}
                </button>
            </div>
        </div>
    );
};