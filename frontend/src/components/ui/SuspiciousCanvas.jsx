import React, { useRef, useEffect } from 'react';

export const SuspiciousCanvas = ({ imageUrl, regions = [] }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      canvas.width = img.naturalWidth || 600;
      canvas.height = img.naturalHeight || 400;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Draw bounding boxes for suspicious regions
      regions.forEach((reg, idx) => {
        const { x, y, width, height, label = `Region #${idx+1}` } = reg;

        // Bounding box border
        ctx.strokeStyle = '#ef4444';
        ctx.lineWidth = Math.max(3, Math.floor(canvas.width / 250));
        ctx.setLineDash([6, 3]);
        ctx.strokeRect(x, y, width, height);

        // Semi-transparent overlay fill
        ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
        ctx.fillRect(x, y, width, height);

        // Text label pill
        ctx.setLineDash([]);
        ctx.fillStyle = '#ef4444';
        const fontSize = Math.max(12, Math.floor(canvas.width / 40));
        ctx.font = `bold ${fontSize}px sans-serif`;
        const textWidth = ctx.measureText(label).width;

        ctx.fillRect(x, Math.max(0, y - fontSize - 8), textWidth + 12, fontSize + 8);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, x + 6, Math.max(fontSize, y - 6));
      });
    };
  }, [imageUrl, regions]);

  return (
    <div className="relative overflow-hidden rounded-xl border border-slate-700 bg-slate-900/60 shadow-2xl flex items-center justify-center p-2">
      <canvas ref={canvasRef} className="max-w-full max-h-[500px] object-contain rounded-lg" />
      {regions.length > 0 && (
        <div className="absolute top-4 right-4 bg-red-950/80 border border-red-500/50 text-red-300 text-xs px-3 py-1.5 rounded-full backdrop-blur-md font-medium shadow-lg animate-pulse flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          {regions.length} Tampered Region(s) Highlighted
        </div>
      )}
    </div>
  );
};
