'use client';

import React, { useEffect, useState } from 'react';
import Papa from 'papaparse';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title as ChartTitle, Tooltip } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { client } from '@/lib/sanity';
import { PortableText } from '@portabletext/react';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTitle, Tooltip);

// --- NETRA NEWS STYLE CHART ---
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
        backgroundColor: 'rgba(220, 38, 38, 0.9)', // Stark investigative red
        borderRadius: 2 
      }],
    });
  }, [csvData]);

  if (!chartData) return null;
  return (
    <div className="my-14 p-8 border-t-4 border-b-4 border-gray-900 max-w-3xl mx-auto">
      <h3 className="text-xl font-bold font-sans text-gray-900 mb-6 uppercase tracking-wider">{title}</h3>
      <Bar data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
    </div>
  );
};

// --- NETRA NEWS STYLE INCIDENT ACCORDION ---
const IncidentList = ({ incidents }: { incidents: any[] }) => {
  const [openId, setOpenId] = useState<number | null>(null);
  if (!incidents) return null;

  return (
    <div className="max-w-3xl mx-auto my-16 border-t-2 border-gray-900">
      <h3 className="text-lg font-bold font-sans mt-4 mb-6 text-red-600 uppercase tracking-wide">Incident Database</h3>
      {incidents.map((incident, i) => (
        <div key={i} className="border-b border-gray-300">
          <button 
            onClick={() => setOpenId(openId === i ? null : i)}
            className="w-full py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-left hover:bg-gray-50 transition-colors"
          >
             <div className="flex flex-wrap gap-x-6 gap-y-2 w-full font-sans text-sm text-gray-900">
                <span className="text-gray-500 font-mono">{incident.date}</span>
                <span className="font-bold w-32">{incident.name}</span>
                <span className="text-gray-500">Age: {incident.age || 'Unknown'}</span>
                <span className="w-24">{incident.accusation}</span>
                <span className="text-red-600 font-bold">{incident.outcome}</span>
             </div>
             <span className="text-2xl text-gray-400 font-light ml-4">{openId === i ? '−' : '+'}</span>
          </button>
          {openId === i && (
            <div className="p-5 bg-gray-50 font-serif text-gray-800 text-base leading-relaxed border-l-4 border-red-600 mb-4 shadow-inner">
              {incident.details}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// --- MAIN PAGE ---
export default function DemoStoryPage() {
  const [story, setStory] = useState<any>(null);

  useEffect(() => {
    client.fetch(`*[_type == "story"] | order(_createdAt desc)[0]`).then(setStory);
  }, []);

  if (!story) return <div className="min-h-screen flex items-center justify-center font-sans tracking-widest uppercase text-gray-400">Loading Data...</div>;

  return (
    <main className="min-h-screen bg-[#FDFDFD] py-16 selection:bg-red-200">
      <article className="max-w-4xl mx-auto px-4">
        <header className="mb-16 border-b-2 border-gray-900 pb-12 max-w-3xl mx-auto">
          <h1 className="text-5xl sm:text-6xl font-black font-sans text-gray-900 tracking-tight mb-6 leading-none">
            {story.title}
          </h1>
          <div className="text-gray-500 text-sm font-sans uppercase tracking-widest font-bold">
            By <span className="text-gray-900">{story.author}</span>
          </div>
        </header>

        <div className="story-content space-y-8">
          {story.content?.map((block: any, index: number) => {
            if (block._type === 'block') {
              return (
                <div key={index} className="text-xl text-gray-900 leading-[1.8] font-serif max-w-2xl mx-auto prose prose-lg prose-p:mb-6">
                  <PortableText value={[block]} />
                </div>
              );
            }
            if (block._type === 'chartBlock') return <ChartBlock key={index} {...block} />;
            if (block._type === 'incidentList') return <IncidentList key={index} incidents={block.incidents} />;
            return null;
          })}
        </div>
      </article>
    </main>
  );
}