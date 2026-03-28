'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title as ChartTitle, 
  Tooltip 
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { client } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';
import { ChoroplethMap } from '@/components/ChoroplethMap';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip);

// --- 1. BAR CHART COMPONENT ---
const ChartBlock = ({ title, csvData }: { title: string; csvData: string }) => {
  const [chartData, setChartData] = useState<any>(null);
  
  useEffect(() => {
    if(!csvData) return;
    const results = Papa.parse(csvData, { header: true, skipEmptyLines: true });
    const data = results.data as Record<string, string>[];
    if(data.length === 0) return;
    const keys = Object.keys(data[0]);
    
    setChartData({
      labels: data.map((row) => row[keys[0]]),
      datasets: [{ 
        label: keys[1], 
        data: data.map((row) => parseFloat(row[keys[1]])), 
        backgroundColor: 'rgba(0, 0, 0, 0.9)', // Stark black for investigative look
        borderRadius: 0 
      }],
    });
  }, [csvData]);

  if (!chartData) return null;
  return (
    <div className="my-14 p-8 border-t border-b border-gray-200 max-w-3xl mx-auto bg-gray-50">
      <h3 className="text-sm font-black font-sans text-gray-900 mb-6 uppercase tracking-[0.2em]">{title}</h3>
      <Bar 
        data={chartData} 
        options={{ 
          responsive: true, 
          plugins: { legend: { display: false } },
          scales: {
            y: { beginAtZero: true, grid: { display: false } },
            x: { grid: { display: false } }
          }
        }} 
      />
    </div>
  );
};

// --- 2. INCIDENT ACCORDION COMPONENT ---
const IncidentList = ({ incidents }: { incidents: any[] }) => {
  const [openId, setOpenId] = useState<number | null>(null);
  if (!incidents) return null;

  return (
    <div className="max-w-3xl mx-auto my-16 border-t-2 border-gray-900">
      <h3 className="text-xs font-black font-sans mt-4 mb-6 text-red-600 uppercase tracking-[0.3em]">
        Incident Database
      </h3>
      {incidents.map((incident, i) => (
        <div key={i} className="border-b border-gray-200">
          <button 
            onClick={() => setOpenId(openId === i ? null : i)}
            className="w-full py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-left hover:bg-gray-50 transition-colors px-2"
          >
             <div className="flex flex-wrap gap-x-6 gap-y-2 w-full font-sans text-[13px] text-gray-900">
                <span className="text-gray-400 font-mono w-24">{incident.date}</span>
                <span className="font-bold w-40 uppercase tracking-tight">{incident.name}</span>
                <span className="text-gray-500 w-16 text-xs italic">Age: {incident.age || '—'}</span>
                <span className="text-red-600 font-bold">{incident.outcome}</span>
             </div>
             <span className="text-xl text-gray-300 font-light ml-4">{openId === i ? '−' : '+'}</span>
          </button>
          {openId === i && (
            <div className="p-6 bg-white font-serif text-gray-700 text-lg leading-relaxed border-l-4 border-black mb-4 mx-2 shadow-sm">
              <p className="mb-2 font-sans text-xs font-bold text-gray-400 uppercase tracking-widest">Details:</p>
              {incident.details}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// --- 3. MAIN PAGE PAGE ---
export default function FullInteractiveStory() {
  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    // Fetches the most recent "story" document
    client.fetch(`*[_type == "story"] | order(_createdAt desc)[0]`).then(setStory);
  }, []);

  if (!story) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="animate-pulse font-sans text-xs tracking-[0.5em] uppercase text-gray-400">
        Loading Investigation...
      </div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-32 selection:bg-red-100">
      {/* Article Navigation / Top Bar */}
      <nav className="border-b border-gray-100 py-4 px-6 mb-12 flex justify-between items-center bg-white sticky top-0 z-50">
        <span className="font-black font-sans text-xs tracking-tighter uppercase">ActivateRights <span className="text-red-600">Interactive</span></span>
        <span className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest hidden sm:block">Special Report: 2025 Mob Violence</span>
      </nav>

      <article className="max-w-5xl mx-auto px-4">
        {/* Header Section */}
        <header className="mb-20 max-w-3xl mx-auto text-center sm:text-left">
          <h1 className="text-5xl sm:text-7xl font-black font-sans text-gray-900 tracking-tight mb-8 leading-[0.9] uppercase">
            {story.title}
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 border-t border-gray-200 pt-6">
            <div className="text-gray-400 text-[10px] font-sans uppercase tracking-[0.3em] font-bold">
              Reporting by <span className="text-gray-900">{story.author}</span>
            </div>
            <div className="hidden sm:block text-gray-200">|</div>
            <div className="text-gray-400 text-[10px] font-sans uppercase tracking-[0.3em]">
              Published {new Date(story._createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Dynamic Content Loop */}
        <div className="story-content">
          {story.content?.map((block: any, index: number) => {
            
            // Text Blocks
            if (block._type === 'block') {
              return (
                <div key={index} className="text-xl text-gray-800 leading-[1.85] font-serif max-w-2xl mx-auto mb-10 first-letter:text-5xl first-letter:font-black first-letter:mr-3 first-letter:float-left">
                  <PortableText value={[block]} />
                </div>
              );
            }

            // Interactive Map Block
            if (block._type === 'choroplethMap') {
              return <ChoroplethMap key={index} {...block} />;
            }

            // Bar Chart Block
            if (block._type === 'chartBlock') {
              return <ChartBlock key={index} {...block} />;
            }

            // Accordion / Database Block
            if (block._type === 'incidentList') {
              return <IncidentList key={index} incidents={block.incidents} />;
            }

            return null;
          })}
        </div>

        {/* Footer Credits */}
        <footer className="max-w-2xl mx-auto mt-32 pt-12 border-t border-gray-200 text-center">
          <p className="font-sans text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-4">
            A project by ActivateRights &copy; 2026
          </p>
          <div className="flex justify-center gap-8 opacity-30">
             {/* Simple visual placeholders for social sharing */}
             <div className="w-4 h-4 bg-black rounded-full"></div>
             <div className="w-4 h-4 bg-black rounded-full"></div>
             <div className="w-4 h-4 bg-black rounded-full"></div>
          </div>
        </footer>
      </article>
    </main>
  );
}