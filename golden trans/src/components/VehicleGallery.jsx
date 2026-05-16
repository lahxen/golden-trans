const galleryImages = {
  sedan: [
    'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&q=80',
    'https://images.unsplash.com/photo-1550355291-bbee04a92027?w=600&q=80',
    'https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&q=80',
  ],
  suv: [
    'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80',
    'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=600&q=80',
    'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&q=80',
  ],
  van: [
    'https://images.unsplash.com/photo-1554713914-0b8c8f7e4a2b?w=600&q=80',
    'https://images.unsplash.com/photo-1594567875730-34b15f78f35a?w=600&q=80',
    'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=600&q=80',
  ],
  luxury: [
    'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?w=600&q=80',
    'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80',
    'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=600&q=80',
  ],
  minibus: [
    'https://images.unsplash.com/photo-1601998012213-c1933c2d16fe?w=600&q=80',
    'https://images.unsplash.com/photo-1550305080-4e029753abcf?w=600&q=80',
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&q=80',
  ],
}

const typeMap = {
  Sedan: 'sedan',
  SUV: 'suv',
  Van: 'van',
  'Luxury Van': 'luxury',
  Minibus: 'minibus',
}

export default function VehicleGallery({ type = 'Sedan' }) {
  const key = typeMap[type] || 'sedan'
  const images = galleryImages[key] || galleryImages.sedan

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
      {images.map((src, i) => (
        <a key={i} href={src.replace('w=600', 'w=1200')} target="_blank" rel="noopener noreferrer"
          style={{ borderRadius: 8, overflow: 'hidden', display: 'block' }}>
          <img src={src} alt={`${type} view ${i + 1}`}
            style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8, transition: 'transform 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
          />
        </a>
      ))}
    </div>
  )
}