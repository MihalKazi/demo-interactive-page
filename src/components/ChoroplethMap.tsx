'use client';

import React, { useMemo, useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import Papa from 'papaparse';

// Reliable GeoJSON for Bangladesh Districts (Loaded from your public folder)
const geoUrl = "/bangladesh.json";

export const ChoroplethMap = ({ title, description, mapData }: any) => {
  // --- THIS IS THE NEW PART: Tooltip State ---
  const [tooltip, setTooltip] = useState<{ name: string; value: number; x: number; y: number } | null>(null);

  // 1. Parse and sanitize the CSV data
  const data = useMemo(() => {
    if (!mapData) return {};
    const parsed = Papa.parse(mapData, { header: false, skipEmptyLines: true }).data as string[][];
    const stats: Record<string, number> = {};
    
    parsed.forEach(([name, val]) => {
      if (name) {
        // Sanitize: lowercase, remove the word "district", and trim spaces
        const cleanName = name.toLowerCase().replace(' district', '').trim();
        stats[cleanName] = parseInt(val) || 0;
      }
    });
    return stats;
  }, [mapData]);

  // 2. Find the highest value to set the scale limit
  const maxVal = useMemo(() => {
    const values = Object.values(data);
    return values.length > 0 ? Math.max(...values) : 10;
  }, [data]);

  // 3. Define the Color Scale (Matching the sleek red theme)
  const colorScale = scaleLinear<string>()
    .domain([0, maxVal])
    .range(["#f9fafb", "#7f1d1d"]); 

  return (
    <div className="relative my-16 p-8 sm:p-10 max-w-4xl mx-auto bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
      
      {/* Header Section */}
      <div className="mb-8">
        <h3 className="text-xs font-black font-sans text-gray-500 mb-2 uppercase tracking-[0.2em] flex items-center gap-4">
          <span className="w-8 h-[2px] bg-red-600"></span>
          {title || "District-Level Pattern"}
        </h3>
        <p className="text-gray-500 font-serif text-lg italic">
          {description}
        </p>
      </div>
      
      {/* Map Container */}
      <div className="w-full h-auto bg-gray-50/50 rounded-xl overflow-hidden border border-gray-100">
        <ComposableMap 
          projection="geoMercator" 
          projectionConfig={{ scale: 5000, center: [90.3, 23.9] }}
          className="w-full h-auto"
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                
                // Sanitize the map's district names
                const rawName = geo.properties.NAME_2 || geo.properties.District || geo.properties.Shape_Name || geo.properties.ADM2_EN || geo.properties.name || "";
                const cleanGeoName = rawName.toLowerCase().replace(' district', '').trim();
                
                // Match the data
                const value = data[cleanGeoName] || 0;
                
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={colorScale(value)}
                    stroke="#ffffff"
                    strokeWidth={0.5}
                    // --- THIS IS THE NEW PART: Mouse Hover Events ---
                    onMouseEnter={(e) => {
                      setTooltip({
                        name: rawName || "Unknown",
                        value: value,
                        x: e.clientX,
                        y: e.clientY
                      });
                    }}
                    onMouseMove={(e) => {
                      setTooltip({
                        name: rawName || "Unknown",
                        value: value,
                        x: e.clientX,
                        y: e.clientY
                      });
                    }}
                    onMouseLeave={() => {
                      setTooltip(null);
                    }}
                    style={{
                      default: { outline: "none", transition: "all 250ms" },
                      hover: { fill: "#dc2626", outline: "none", cursor: "pointer", transition: "all 250ms" },
                      pressed: { outline: "none" }
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
      
      {/* Legend */}
      <div className="mt-6 flex items-center justify-end gap-4 text-[10px] font-sans font-bold uppercase tracking-widest text-gray-400">
         <span>Low</span>
         <div className="h-2 w-32 bg-gradient-to-r from-[#f9fafb] to-[#7f1d1d] rounded-full"></div>
         <span>High ({maxVal})</span>
      </div>

      {/* --- THIS IS THE NEW PART: The Floating Tooltip Box --- */}
      {tooltip && (
        <div 
          className="fixed z-50 pointer-events-none bg-black/90 text-white px-4 py-3 rounded-lg shadow-xl backdrop-blur-sm border border-white/10"
          style={{ 
            top: tooltip.y + 15, 
            left: tooltip.x + 15,
            transform: "translate(0, 0)" 
          }}
        >
          <div className="font-sans text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">District</div>
          <div className="font-serif text-xl leading-none mb-2">{tooltip.name}</div>
          <div className="font-sans text-sm font-bold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            {tooltip.value} Incidents
          </div>
        </div>
      )}

    </div>
  );
};