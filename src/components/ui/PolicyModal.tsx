"use client";

import React, { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { useMarkdown } from "@/lib/useMarkdown";

type PolicyModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAgree: () => void;
  markdownPath: string;
  title: string;
};

export default function PolicyModal({
  isOpen,
  onClose,
  onAgree,
  markdownPath,
  title,
}: PolicyModalProps) {
  const { content, isLoading, error } = useMarkdown(markdownPath);
  const [hasReachedBottom, setHasReachedBottom] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setHasReachedBottom(false);
      // If content is very short and doesn't require scrolling, we should enable the button
      setTimeout(() => {
        if (scrollRef.current) {
          const { scrollHeight, clientHeight } = scrollRef.current;
          if (scrollHeight <= clientHeight) {
            setHasReachedBottom(true);
          }
        }
      }, 100); // Wait a bit for render
    }
  }, [isOpen, content]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 8) {
      setHasReachedBottom(true);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-[#1a1025] border border-fuchsia-900/50 rounded-xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden text-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-fuchsia-900/30 flex justify-between items-center bg-[#251535]">
          <h2 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-400">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-xl font-semibold px-2"
          >
            ✕
          </button>
        </div>
        
        <div 
          className="p-6 overflow-y-auto flex-1 prose prose-invert prose-pink max-w-none text-sm md:text-base leading-relaxed"
          onScroll={handleScroll}
          ref={scrollRef}
        >
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-48 space-y-4">
              <span className="spinner w-8 h-8 border-4" />
              <p className="text-purple-300">読み込み中...</p>
            </div>
          ) : error ? (
            <div className="text-red-400 p-4 bg-red-900/20 rounded-lg">
              読み込みエラー: {error}
            </div>
          ) : (
            <ReactMarkdown>{content}</ReactMarkdown>
          )}
        </div>
        
        <div className="p-4 border-t border-fuchsia-900/30 bg-[#251535] flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium border border-gray-600 hover:bg-gray-800 transition-colors"
          >
            閉じる
          </button>
          <button
            onClick={onAgree}
            disabled={!hasReachedBottom}
            className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${
              hasReachedBottom 
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-400 hover:to-purple-500 text-white shadow-lg shadow-purple-900/20' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            同意する
          </button>
        </div>
      </div>
    </div>
  );
}
