'use client';

import React, { useMemo } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps';
import { scaleLinear } from 'd3-scale';
import Papa from 'papaparse';

// Reliable GeoJSON for Bangladesh Districts (Loaded from your public folder)
const geoUrl = "/bangladesh.json";

export const ChoroplethMap = ({ title, description, mapData }: any) => {
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

  // 3. Define the Color Scale (Netra News style: Light Grey to Black)
  const colorScale = scaleLinear<string>()
    .domain([0, maxVal])
    .range(["#f3f4f6", "#000000"]); 

  return (
    <div className="my-16 max-w-3xl mx-auto px-4">
      <div className="border-t border-gray-200 pt-8">
        
        {/* Header Section */}
        <h3 className="text-sm font-black font-sans uppercase tracking-[0.2em] text-gray-900 mb-1">
          {title || "District-Level Pattern"}
        </h3>
        <p className="text-gray-600 font-serif text-lg mb-8 italic">
          {description}
        </p>
        
        {/* Map Container */}
        <div className="bg-white p-4 rounded-sm">
          <ComposableMap 
            projection="geoMercator" 
            projectionConfig={{ scale: 5000, center: [90.3, 23.9] }}
            className="w-full h-auto"
          >
            <Geographies geography={geoUrl}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  
                  // --- DEVELOPER TRICK: PRINT THE PROPERTIES TO THE CONSOLE ---
                  // Open your browser inspector (Right Click -> Inspect -> Console) 
                  // to see exactly what the map calls its districts!
                  console.log("Map District Info:", geo.properties);

                  // Sanitize the map's district names (The Catch-All approach)
                  const rawName = geo.properties.NAME_2 || geo.properties.District || geo.properties.Shape_Name || geo.properties.ADM2_EN || geo.properties.name || "";
                  const cleanGeoName = rawName.toLowerCase().replace(' district', '').trim();
                  
                  // Match the data
                  const value = data[cleanGeoName] || 0;
                  
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={colorScale(value)}
                      stroke="#FFFFFF"
                      strokeWidth={0.5}
                      style={{
                        default: { outline: "none" },
                        hover: { fill: "#dc2626", outline: "none", cursor: "pointer", transition: "all 250ms" },
                        pressed: { outline: "none" }
                      }}
                    />
                  );
                })
              }
            </Geographies>
          </ComposableMap>
          
          {/* Legend */}
          <div className="mt-4 flex items-center justify-start gap-4 text-[10px] font-sans font-bold uppercase tracking-widest text-gray-500">
             <span>Low</span>
             <div className="h-2 w-32 bg-gradient-to-r from-[#f3f4f6] to-[#000000] border border-gray-200"></div>
             <span>High ({maxVal})</span>
          </div>

        </div>
      </div>
    </div>
  );
};