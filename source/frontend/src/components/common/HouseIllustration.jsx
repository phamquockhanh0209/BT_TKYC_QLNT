import React from 'react';

export default function HouseIllustration({ width = "100%", height = "180px", className = "", imageUrl }) {
  const defaultImage = '/anhphongtrodemo.jpg';

  return (
    <div className={`d-flex align-items-center justify-content-center ${className}`} style={{ width, height, overflow: 'hidden' }}>
      <img
        src={imageUrl || defaultImage}
        alt="Ảnh nhà trọ"
        onError={(event) => {
          if (event.currentTarget.src !== `${window.location.origin}${defaultImage}`) {
            event.currentTarget.src = defaultImage;
          }
        }}
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
      />
    </div>
  );
}
