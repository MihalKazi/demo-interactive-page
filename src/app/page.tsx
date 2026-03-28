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
        backgroundColor: '#dc2626', // Switched to a deep red to match the theme
        borderRadius: 4, // Softer edges on bars
        hoverBackgroundColor: '#991b1b'
      }],
    });
  }, [csvData]);

  if (!chartData) return null;
  return (
    <div className="my-16 p-8 sm:p-10 max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      <h3 className="text-xs font-black font-sans text-gray-500 mb-8 uppercase tracking-[0.2em] flex items-center gap-4">
        <span className="w-8 h-[2px] bg-red-600"></span>
        {title}
      </h3>
      <div className="relative h-64 sm:h-96 w-full">
        <Bar 
          data={chartData} 
          options={{ 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { 
              legend: { display: false },
              tooltip: {
                backgroundColor: 'rgba(0,0,0,0.9)',
                titleFont: { family: 'sans-serif', size: 13 },
                bodyFont: { family: 'sans-serif', size: 14, weight: 'bold' },
                padding: 12,
                cornerRadius: 8,
              }
            },
            scales: {
              y: { beginAtZero: true, grid: { color: '#f3f4f6' }, border: { display: false } },
              x: { grid: { display: false }, border: { display: false } }
            }
          }} 
        />
      </div>
    </div>
  );
};

// --- 2. INCIDENT ACCORDION COMPONENT ---
const IncidentList = ({ incidents }: { incidents: any[] }) => {
  const [openId, setOpenId] = useState<number | null>(null);
  if (!incidents) return null;

  return (
    <div className="max-w-4xl mx-auto my-20">
      <div className="flex items-center gap-4 mb-8">
        <h3 className="text-sm font-black font-sans text-red-600 uppercase tracking-[0.2em]">
          Incident Database
        </h3>
        <div className="flex-1 h-px bg-gray-200"></div>
      </div>
      
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {incidents.map((incident, i) => (
          <div key={i} className={`border-b border-gray-100 last:border-0 transition-colors ${openId === i ? 'bg-gray-50' : 'hover:bg-gray-50'}`}>
            <button 
              onClick={() => setOpenId(openId === i ? null : i)}
              className="w-full py-5 px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between text-left focus:outline-none"
            >
               <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 w-full font-sans text-sm items-center">
                  <span className="text-gray-400 font-mono text-xs">{incident.date}</span>
                  <span className="font-bold text-gray-900 truncate">{incident.name}</span>
                  <span className="text-gray-500 text-xs">Age: {incident.age || '—'}</span>
                  <span className={`font-bold text-xs uppercase tracking-wider ${incident.outcome?.toLowerCase().includes('death') || incident.outcome?.toLowerCase().includes('killed') ? 'text-red-600' : 'text-orange-500'}`}>
                    {incident.outcome}
                  </span>
               </div>
               <span className={`text-2xl font-light text-gray-400 transition-transform duration-300 ml-4 ${openId === i ? 'rotate-45 text-red-600' : ''}`}>
                 +
               </span>
            </button>
            
            {/* Smooth height transition wrapper */}
            <div className={`grid transition-all duration-300 ease-in-out ${openId === i ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
              <div className="overflow-hidden">
                <div className="p-6 pt-0 pb-8 ml-0 sm:ml-6">
                  <div className="pl-4 border-l-2 border-red-200 font-serif text-gray-600 text-base leading-relaxed">
                    <p className="mb-2 font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest">Incident Details</p>
                    {incident.details}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- 3. MAIN PAGE PAGE ---
export default function FullInteractiveStory() {
  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    client.fetch(`*[_type == "story"] | order(_createdAt desc)[0]`).then(setStory);
  }, []);

  if (!story) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
        <div className="font-sans text-xs tracking-[0.3em] uppercase text-gray-400">Loading Investigation...</div>
      </div>
    </div>
  );

  let hasFoundFirstText = false; // Used to only apply drop-cap to the first paragraph

  return (
    <main className="min-h-screen bg-[#FDFDFD] pb-32 selection:bg-red-100">
      
      {/* Sleek Glassmorphism Top Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200/50 py-4 px-6 mb-16 flex justify-between items-center shadow-sm transition-all">
        <span className="font-black font-sans text-xs tracking-tighter uppercase text-gray-900">
          ActivateRights <span className="text-red-600">Interactive</span>
        </span>
        <span className="text-[10px] font-sans font-bold text-gray-400 uppercase tracking-widest hidden sm:block bg-gray-100 px-3 py-1 rounded-full">
          Special Report: 2025 Mob Violence
        </span>
      </nav>

      <article className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Modern Header Section */}
        <header className="mb-24 max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-sans text-gray-900 tracking-tight mb-8 leading-[1.05] uppercase text-balance">
            {story.title}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-x-6 gap-y-3 pt-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300"></div> {/* Avatar Placeholder */}
              <div className="text-gray-500 text-xs font-sans uppercase tracking-[0.1em] font-bold">
                By <span className="text-gray-900">{story.author}</span>
              </div>
            </div>
            <div className="hidden sm:block text-gray-300">•</div>
            <div className="text-gray-400 text-xs font-sans uppercase tracking-[0.1em]">
              {new Date(story._createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </header>

        {/* Dynamic Content Loop */}
        <div className="story-content">
          {story.content?.map((block: any, index: number) => {
            
            // Text Blocks
            if (block._type === 'block') {
              const isFirstText = !hasFoundFirstText;
              hasFoundFirstText = true;

              return (
                <div 
                  key={index} 
                  className={`text-lg sm:text-xl text-gray-700 leading-relaxed font-serif max-w-2xl mx-auto mb-8 
                  ${isFirstText ? 'first-letter:text-6xl first-letter:font-black first-letter:text-red-600 first-letter:mr-4 first-letter:float-left first-letter:leading-[0.8] mt-12' : ''}`}
                >
                  <PortableText value={[block]} />
                </div>
              );
            }

            // Interactive Map Block
            if (block._type === 'choroplethMap') {
              return <div key={index} className="my-20"><ChoroplethMap {...block} /></div>;
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

        {/* Modern Footer Credits */}
        <footer className="max-w-3xl mx-auto mt-32 pt-12 border-t border-gray-200 flex flex-col items-center">
          <div className="w-12 h-1 bg-red-600 mb-8"></div>
          <h2 className="font-black font-sans text-xl uppercase tracking-tighter mb-2">ActivateRights</h2>
          <p className="font-sans text-xs text-gray-400 tracking-[0.1em] mb-8 text-center max-w-sm">
            Investigating and reporting on human rights violations across Bangladesh.
          </p>
          <p className="font-sans text-[10px] text-gray-400 uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} All Rights Reserved
          </p>
        </footer>
      </article>
    </main>
  );
}