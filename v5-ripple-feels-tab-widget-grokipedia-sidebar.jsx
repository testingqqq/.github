// V5: Feels Tab Widget – Grokipedia Sidebar Prototype (#11)
import React from 'react';

const FeelsTabWidget = ({ articleTitle }) => (
  <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl shadow-xl border-l-4 border-purple-500 mb-6">
    <div className="flex items-center gap-3 mb-4">
      <span role="img" aria-label="sparkles">✨</span>
      <h3 className="text-xl font-bold text-purple-700">
        💫 Feels on "{articleTitle}"?
      </h3>
    </div>
    <iframe 
      src="https://claude.ai/public/artifacts/3b4df2bf-479a-43bb-aa69-77493d18f13b" 
      width="100%" 
      height="450" 
      className="rounded-xl border-2 border-purple-200 shadow-md"
      title="Ripple Feels Widget"
      frameBorder="0"
    />
    <p className="text-sm text-gray-500 mt-3 text-center italic">
      Fog → Grok Score → Facts → Mars Badge 🚀
    </p>
  </div>
);

export default FeelsTabWidget;
