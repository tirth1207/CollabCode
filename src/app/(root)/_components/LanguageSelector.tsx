"use client";

import React, { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {  Check, Globe } from "lucide-react";
import { useCodeEditorStore } from "@/store/useCodeEditorStore";

const LANGUAGES = [
  { id: "javascript", label: "JavaScript", icon: "🟨" },
  { id: "python", label: "Python", icon: "🐍" },
  { id: "java", label: "Java", icon: "☕" },
  { id: "cpp", label: "C++", icon: "🔵" },
  { id: "csharp", label: "C#", icon: "♯" },
  { id: "typescript", label: "TypeScript", icon: "🔷" },
  { id: "go", label: "Go", icon: "🐹" },
  { id: "rust", label: "Rust", icon: "🦀" },
];

function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useCodeEditorStore();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentLanguage = LANGUAGES.find((lang) => lang.id === language);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2.5 bg-[#1e1e2e]/80 hover:bg-[#262637] 
        rounded-lg transition-all duration-200 border border-gray-800/50 hover:border-gray-700"
      >
        <Globe className="w-4 h-4 text-gray-400" />
        <span className="text-gray-300 min-w-[80px] text-left">{currentLanguage?.label}</span>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-screen bg-[#1e1e2e]/95 backdrop-blur-xl 
            rounded-xl border border-[#313244] shadow-2xl py-2 z-50"
          >
            <div className="px-4 pb-2 mb-2 border-b border-gray-800/50">
              <p className="text-xs font-medium text-gray-400">Select Language</p>
            </div>

            <div className="max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700">
              {LANGUAGES.map((lang, index) => (
                <motion.button
                  key={lang.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative w-full flex items-center gap-3 px-4 py-3 hover:bg-[#262637] 
                  transition-all duration-200 ${language === lang.id ? "bg-blue-500/10 text-blue-400" : "text-gray-300"}`}
                  onClick={() => {
                    setLanguage(lang.id);
                    setIsOpen(false);
                  }}
                >
                  <span className="text-lg">{lang.icon}</span>
                  <span className="flex-1 text-left">{lang.label}</span>
                  {language === lang.id && <Check className="w-4 h-4 text-blue-400" />}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default LanguageSelector;
