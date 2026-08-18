import React from 'react';

const MapEmbed = () => {
  // Coordinates for a central, premium hospital mock location (e.g. New York Manhattan Medical Center area)
  // Let's use OpenStreetMap standard export iframe src
  const mapUrl = "https://www.openstreetmap.org/export/embed.html?bbox=-74.0048%2C40.7380%2C-73.9848%2C40.7580&layer=mapnik&marker=40.7484%2C-73.9948";

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-100 shadow-md">
      <iframe
        title="MediCare Center Location Map"
        width="100%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={mapUrl}
        className="grayscale-[15%] contrast-[110%] brightness-[95%] filter transition-all hover:grayscale-0 duration-300"
      />
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-md text-xs font-semibold text-teal-800 shadow-xs border border-slate-100 flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        MediCare Plaza (NYC)
      </div>
    </div>
  );
};

export default MapEmbed;
