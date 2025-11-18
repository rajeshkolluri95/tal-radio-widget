import React, { useState, useEffect } from "react";
import playlistItemImage from "../assets/default_playlist.jpg" // ✅ imported fallback image

interface SafeImageProps {
  src?: string;
  fallback?: string;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
}

const SafeImage: React.FC<SafeImageProps> = ({
  src,
  fallback = playlistItemImage, // ✅ use imported default image
  alt = "image",
  className,
  style,
}) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);
  const [loaded, setLoaded] = useState(false);

  // Update when src changes
  useEffect(() => {
    if (src) {
      setImgSrc(src);
      setLoaded(false);
    } else {
      setImgSrc(fallback);
    }
  }, [src, fallback]);

  const handleError = () => {
    if (imgSrc !== fallback) {
      setImgSrc(fallback);
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt}
      onError={handleError}
      onLoad={() => setLoaded(true)}
      className={`${className || ""} ${
        loaded ? "opacity-100" : "opacity-0"
      } transition-opacity duration-500`}
      style={style}
      loading="lazy"
    />
  );
};

export default SafeImage;
