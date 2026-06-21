import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const WatchProviders = ({ providers }) => {
  const { t } = useLanguage();
  if (!providers) return null;

  // TMDB's US region providers are generally found at providers.US
  const usProviders = providers?.US;
  
  if (!usProviders || (!usProviders.flatrate && !usProviders.rent && !usProviders.buy)) {
    return null;
  }

  const renderProviderSection = (title, items) => {
    if (!items || items.length === 0) return null;
    return (
      <div className="mb-4 last:mb-0">
        <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">{title}</h4>
        <div className="flex flex-wrap gap-3">
          {items.map(provider => (
            <div key={provider.provider_id} className="relative group cursor-help">
              <img 
                src={`https://image.tmdb.org/t/p/original${provider.logo_path}`} 
                alt={provider.provider_name} 
                className="w-10 h-10 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 transition-transform group-hover:scale-110"
              />
              <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                {provider.provider_name}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-md">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{t('whereToWatch')}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">Available providers in the US</p>
      </div>
      
      {renderProviderSection('Stream', usProviders.flatrate)}
      {renderProviderSection('Rent', usProviders.rent)}
      {renderProviderSection('Buy', usProviders.buy)}
      
      {usProviders.link && (
        <a 
          href={usProviders.link} 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mt-4 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline"
        >
          View all options on TMDB →
        </a>
      )}
    </div>
  );
};

export default WatchProviders;
