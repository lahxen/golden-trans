const MODELS = {
  sedan: 'https://cdn.jsdelivr.net/npm/threebox-plugin@2.1.9/examples/models/vehicles/car.glb',
  suv: 'https://cdn.jsdelivr.net/npm/threebox-plugin@2.1.9/examples/models/vehicles/car.glb',
  van: 'https://cdn.jsdelivr.net/npm/threebox-plugin@2.1.9/examples/models/vehicles/car.glb',
  luxury: 'https://cdn.jsdelivr.net/npm/threebox-plugin@2.1.9/examples/models/vehicles/car.glb',
  minibus: 'https://cdn.jsdelivr.net/npm/threebox-plugin@2.1.9/examples/models/vehicles/car.glb',
}

export default function CarViewer3D({ type = 'sedan' }) {
  const src = MODELS[type] || MODELS.sedan
  return (
    <model-viewer
      src={src}
      alt={`Golden Trans ${type} vehicle`}
      style={{ width: '100%', height: 320, display: 'block' }}
      auto-rotate
      auto-rotate-delay="200"
      rotation-per-second="30deg"
      camera-controls
      camera-orbit="45deg 55deg 4m"
      shadow-intensity="0.8"
      exposure="0.8"
      environment-image="neutral"
      loading="lazy"
      ar-status="not-presenting"
    />
  )
}