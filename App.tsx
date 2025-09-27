import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';
import History from './components/History';
import { generatePrompt } from './services/geminiService';
import { OutputFormat, TemplateName, HistoryItem as HistoryItemType } from './types';
import { useTheme } from './hooks/useTheme';
import { TEMPLATES } from './constants';


const App: React.FC = () => {
  const [inputText, setInputText] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateName>(TemplateName.GENERAL);
  const [outputFormat, setOutputFormat] = useState<OutputFormat>(OutputFormat.TEXT);
  const [output, setOutput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isPremium, setIsPremium] = useState<boolean>(false);
  const [history, setHistory] = useState<HistoryItemType[]>([]);
  const [isHistoryVisible, setIsHistoryVisible] = useState<boolean>(true);
  
  const [theme, toggleTheme] = useTheme();

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const savedHistory = localStorage.getItem('promptHistory');
      if (savedHistory) {
        setHistory(JSON.parse(savedHistory));
      }
    } catch (e) {
      console.error("Failed to parse history from localStorage", e);
    }
  }, []);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('promptHistory', JSON.stringify(history));
  }, [history]);

  const generateLocalDraft = useCallback((text: string, templateName: TemplateName, format: OutputFormat): string => {
    const template = TEMPLATES.find(t => t.id === templateName);
    if (!template) return text;
  
    let draft = text;
    switch(templateName) {
      case TemplateName.IMAGE:
        draft = `${text}, highly detailed, cinematic lighting, 4K, trending on ArtStation`;
        break;
      case TemplateName.BLOG:
        draft = `Write a blog post about "${text}" in an engaging tone with an introduction, body, and conclusion.`;
        break;
      case TemplateName.CODING:
        draft = `// Task: ${text}\n// Write clean code with comments and explanations in JavaScript/React.`;
        break;
      case TemplateName.VIDEO:
        draft = `Video prompt for: ${text}. Generate cinematic camera movements, realistic lighting, high resolution.`;
        break;
      case TemplateName.ADS:
        draft = `Ad copy for: ${text}. Write a catchy ad copy highlighting benefits, with a clear call-to-action and a sense of urgency.`;
        break;
      case TemplateName.GENERAL:
      default:
        draft = `**Role**: AI Assistant\n**Task**: Fulfill the user's request.\n**Context**: The user has provided the following input: "${text}"`;
        break;
    }

    if (format === OutputFormat.JSON) {
      const jsonOutput = {
        type: templateName,
        subject: text,
        details: draft
      };
      return JSON.stringify(jsonOutput, null, 2);
    }

    return draft;
  }, []);

  const handleConvert = async () => {
    if (!inputText.trim()) {
      setError('Please enter some text to convert.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setOutput(''); // Clear previous output

    // Generate and display local draft immediately
    const draft = generateLocalDraft(inputText, selectedTemplate, outputFormat);
    setOutput(draft);

    try {
      const geminiResult = await generatePrompt(inputText, selectedTemplate, outputFormat);
      setOutput(geminiResult);
    } catch (err) {
      console.error(err);
      setError('Failed to get a response from the AI. Please check your API key and try again. Displaying local draft.');
      // Keep the local draft in case of API error
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSavePrompt = (prompt: string) => {
    const newItem: HistoryItemType = {
      id: Date.now(),
      prompt: prompt,
      timestamp: new Date().toISOString(),
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handleDeletePrompt = (id: number) => {
    setHistory(prev => prev.filter(item => item.id !== id));
  };


  return (
    <div className="flex flex-col h-screen w-full max-w-2xl mx-auto">
      <Header 
        theme={theme}
        toggleTheme={toggleTheme}
        isPremium={isPremium}
        setIsPremium={setIsPremium}
      />
      <main className="flex-1 overflow-y-auto p-4 space-y-6">
          <InputSection
            inputText={inputText}
            setInputText={setInputText}
            selectedTemplate={selectedTemplate}
            setSelectedTemplate={setSelectedTemplate}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            onConvert={handleConvert}
            isLoading={isLoading}
            isPremium={isPremium}
          />
          <OutputSection
            output={output}
            isLoading={isLoading}
            error={error}
            onSavePrompt={handleSavePrompt}
          />
          <History 
            items={history}
            isVisible={isHistoryVisible}
            toggleVisibility={() => setIsHistoryVisible(prev => !prev)}
            onDelete={handleDeletePrompt}
          />
      </main>
    </div>
  );
};

export default App;