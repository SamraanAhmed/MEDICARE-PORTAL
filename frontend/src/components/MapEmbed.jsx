import React from 'react';

const MapEmbed = () => {
  // Coordinates for Ibadat International University, Japan Road, Sihala, Islamabad, Pakistan
  // Latitude: 33.5222, Longitude: 73.1818
  const mapUrl = "https://www.openstreetmap.org/export/embed.html?bbox=73.1618%2C33.5022%2C73.2018%2C33.5422&layer=mapnik&marker=33.5222%2C73.1818";

  return (
    <div className="relative w-full h-[400px] rounded-2xl overflow-hidden border border-slate-100 shadow-md">
      <iframe
        title="MediCare Center Location Map"
        width="105%"
        height="100%"
        frameBorder="0"
        scrolling="no"
        marginHeight="0"
        marginWidth="0"
        src={mapUrl}
        className="grayscale-[15%] contrast-[110%] brightness-[95%] filter transition-all hover:grayscale-0 duration-300"
      />
      <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs px-3 py-1 rounded-md text-xs font-semibold text-teal-805 shadow-xs border border-slate-100 flex items-center gap-1.5 pointer-events-none">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        MediCare Campus (Islamabad)
      </div>
    </div>
  );
};

export default MapEmbed;
