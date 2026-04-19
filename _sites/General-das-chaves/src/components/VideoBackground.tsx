import React, { useEffect, useRef } from "react";

/**
 * VideoBackground component that renders a background video with an overlay.
 * @param src - The source URL of the video.
 * @param overlayOpacity - The opacity of the dark overlay (0 to 1).
 * @param children - Optional children to render over the video.
 */
export const VideoBackground: React.FC<{
  src: string;
  overlayOpacity?: number;
  children?: React.ReactNode;
}> = ({ src, overlayOpacity = 0.5, children }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Video autoplay failed:", error);
      });
    }
  }, [src]);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <video
        ref={videoRef}
        key={src}
        src={src}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        poster="https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=1920&auto=format&fit=crop"
        className="absolute top-1/2 left-1/2 min-w-full min-h-full w-auto h-auto -translate-x-1/2 -translate-y-1/2 object-cover"
      >
        Your browser does not support the video tag.
      </video>
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black/90"
      />
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
};
