import React from 'react';
import { personalInfo } from '../data/portfolioData';
import { CheckSquare } from 'lucide-react';

export default function Footer({ onNavigate }) {
  const handleExamClick = (e) => {
    e.preventDefault();
    if (onNavigate) {
      onNavigate('/exam');
    } else {
      window.location.href = '/exam';
    }
  };

  return (
    <footer className="py-8 border-t border-neutral-800 text-xs text-neutral-500">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-neutral-400 font-medium">{personalInfo.name}</span>
          <span className="text-neutral-600">•</span>
          <span>ECE Undergrad Portfolio</span>
        </div>
        
        <div className="flex items-center gap-4">
          <a
            href="/exam"
            onClick={handleExamClick}
            className="inline-flex items-center gap-1.5 text-neutral-400 hover:text-emerald-400 transition-colors"
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Sem 5 Exam Checklist</span>
          </a>
          <span className="text-neutral-700">•</span>
          <span>© {new Date().getFullYear()} Ayush Sachan</span>
        </div>
      </div>
    </footer>
  );
}
