'use client';

import { useState, useRef, DragEvent, ChangeEvent, useEffect } from 'react';

export default function Home() {
  const [image, setImage] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Support 10 MB file size limit
  const SUPPORTED_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  const MAX_FILE_SIZE = 10 * 1024 * 1024;


  // System theme 
  useEffect(() => {
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(darkModeQuery.matches);
    const handler = (e: MediaQueryListEvent) => setIsDark(e.matches);
    darkModeQuery.addEventListener('change', handler);
    return () => darkModeQuery.removeEventListener('change', handler);
  }, []);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };


   // Check file type
  const validateFile = (file: File): string | null => {
    if (!SUPPORTED_FORMATS.includes(file.type)) {
      const supportedExtensions = SUPPORTED_FORMATS.map(format => 
        format.split('/')[1].toUpperCase()
      ).join(', ');
      return `Unsupported file format. Please upload: ${supportedExtensions}`;
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      const maxSizeMB = MAX_FILE_SIZE / (1024 * 1024);
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(2);
      return `File size (${fileSizeMB}MB) exceeds maximum limit of ${maxSizeMB}MB`;
    }

    return null;
  };

  const handleFile = (file: File) => {
   
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setFileName(file.name);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result as string);
    };
    reader.onerror = () => {
      setError('Failed to read file. Please try again.');
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    setImage(null);
    setError(null);
    setFileName('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 p-8 flex items-center justify-center relative overflow-hidden ${
      isDark 
        ? 'bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900' 
        : 'bg-gradient-to-br from-sky-100 via-cyan-50 to-blue-100'
    }`}>
 
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl opacity-20 animate-blob ${
          isDark ? 'bg-cyan-500' : 'bg-cyan-400'
        }`} />
        <div className={`absolute top-40 right-10 w-96 h-96 rounded-full blur-3xl opacity-20 animate-blob animation-delay-2000 ${
          isDark ? 'bg-blue-500' : 'bg-blue-400'
        }`} />
        <div className={`absolute -bottom-8 left-1/3 w-80 h-80 rounded-full blur-3xl opacity-20 animate-blob animation-delay-4000 ${
          isDark ? 'bg-teal-500' : 'bg-teal-400'
        }`} />
      </div>


      <button
        onClick={toggleDarkMode}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full transition-all duration-300 shadow-lg hover:scale-110 ${
          isDark 
            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
            : 'bg-gray-800 text-yellow-300 hover:bg-gray-700'
        }`}
        aria-label="Toggle dark mode"
      >
        {isDark ? (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        )}
      </button>

      <div className="w-full max-w-2xl relative z-10">
        
        <div className="text-center mb-8">
          <div className="inline-block relative mb-4">
            <h1 className={`text-6xl font-black tracking-tight ${
              isDark 
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400' 
                : 'text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600'
            }`}>
              Creativion
            </h1>
            <div className={`absolute -bottom-2 left-0 right-0 h-1 rounded-full ${
              isDark 
                ? 'bg-gradient-to-r from-cyan-400 via-blue-400 to-teal-400' 
                : 'bg-gradient-to-r from-cyan-600 via-blue-600 to-teal-600'
            }`} />
          </div>
          <p className={`text-lg font-medium ${
            isDark ? 'text-cyan-200' : 'text-blue-700'
          }`}>
            Where images come to life 🌊
          </p>
        </div>

       
        <div className={`rounded-3xl shadow-2xl p-8 transition-all duration-300 ${
          isDark 
            ? 'bg-slate-800/50 backdrop-blur-xl border border-slate-700/50' 
            : 'bg-white/60 backdrop-blur-xl border border-white/50'
        }`}>
         
          {error && (
            <div className={`mb-6 p-4 rounded-xl border-2 flex items-start gap-3 animate-shake ${
              isDark 
                ? 'bg-red-900/30 border-red-500/50 text-red-300' 
                : 'bg-red-50 border-red-300 text-red-700'
            }`}>
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="flex-1">
                <p className="font-semibold">Upload Failed</p>
                <p className="text-sm mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="flex-shrink-0 hover:opacity-70 transition-opacity"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          )}

          {!image ? (
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleClick}
              className={`
                relative overflow-hidden
                border-3 border-dashed rounded-2xl p-16 text-center cursor-pointer
                transition-all duration-300 ease-out
                ${
                  isDragging
                    ? isDark
                      ? 'border-cyan-400 bg-cyan-900/30 scale-[1.02] shadow-lg shadow-cyan-500/50'
                      : 'border-cyan-500 bg-cyan-50 scale-[1.02] shadow-lg shadow-cyan-500/30'
                    : isDark
                      ? 'border-slate-600 hover:border-cyan-400 hover:bg-cyan-900/20'
                      : 'border-blue-300 hover:border-cyan-500 hover:bg-cyan-50/50'
                }
              `}
            >
             
              <div className={`absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 ${
                isDark 
                  ? 'bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-teal-500/10' 
                  : 'bg-gradient-to-br from-cyan-400/10 via-blue-400/10 to-teal-400/10'
              }`} />
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
              
              <div className="relative z-10 flex flex-col items-center justify-center space-y-6">
                
                <div className="relative">
                  <div className={`absolute inset-0 rounded-full blur-xl opacity-50 animate-pulse ${
                    isDark ? 'bg-gradient-to-br from-cyan-400 to-blue-400' : 'bg-gradient-to-br from-cyan-500 to-blue-500'
                  }`} />
                  <div className={`relative p-6 rounded-full shadow-lg transform transition-transform hover:scale-110 duration-300 ${
                    isDark ? 'bg-gradient-to-br from-cyan-500 to-blue-500' : 'bg-gradient-to-br from-cyan-600 to-blue-600'
                  }`}>
                    <svg
                      className="w-16 h-16 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                      />
                    </svg>
                  </div>
                </div>

                <div>
                  <p className={`text-2xl font-bold mb-2 ${
                    isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                    Drop your image here
                  </p>
                  <p className={`mb-4 ${
                    isDark ? 'text-cyan-300' : 'text-blue-600'
                  }`}>
                    or click to browse
                  </p>
                  <div className="flex items-center justify-center gap-2 text-sm">
                    <span className={`px-3 py-1 rounded-full ${
                      isDark ? 'bg-slate-700 text-cyan-300' : 'bg-blue-100 text-blue-700'
                    }`}>JPG</span>
                    <span className={`px-3 py-1 rounded-full ${
                      isDark ? 'bg-slate-700 text-cyan-300' : 'bg-blue-100 text-blue-700'
                    }`}>PNG</span>
                    <span className={`px-3 py-1 rounded-full ${
                      isDark ? 'bg-slate-700 text-cyan-300' : 'bg-blue-100 text-blue-700'
                    }`}>GIF</span>
                    <span className={`px-3 py-1 rounded-full ${
                      isDark ? 'bg-slate-700 text-cyan-300' : 'bg-blue-100 text-blue-700'
                    }`}>WebP</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              
              <div className="relative rounded-2xl overflow-hidden border-2 border-purple-200 dark:border-purple-700 shadow-xl group animate-fadeIn">
                <img
                  src={image}
                  alt="Uploaded preview"
                  className="w-full h-auto max-h-[500px] object-contain bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800"
                />
                
                
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                  <button
                    onClick={handleRemove}
                    className="opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 bg-red-500 hover:bg-red-600 text-white rounded-full p-4 shadow-xl"
                    aria-label="Remove image"
                  >
                    <svg
                      className="w-8 h-8"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              
             
              <button
                onClick={handleClick}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-[1.02] flex items-center justify-center gap-2"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                  />
                </svg>
                Upload Different Image
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          )}
        </div>

        
        <p className={`text-center text-sm mt-6 ${
          isDark ? 'text-cyan-300' : 'text-blue-600'
        }`}>
          Maximum file size: 10MB • Supported formats: JPG, PNG, GIF, WebP
        </p>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }
        
        .animate-blob {
          animation: blob 7s ease-in-out infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes shake {
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-5px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(5px);
          }
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
}