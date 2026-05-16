import { CITIES_DATA } from '../config/cities'

const CITY_IMAGES = Object.fromEntries(
  Object.values(CITIES_DATA).map(c => [c.slug, c.image])
)

export function getCityImage(slug) {
  return CITY_IMAGES[slug] || null
}

export function slugFromCityName(name) {
  const map = {
    'Casablanca': 'casablanca', 'Rabat': 'rabat', 'Marrakech': 'marrakech',
    'Fes': 'fes', 'Fès': 'fes', 'Tangier': 'tangier', 'Tanger': 'tangier',
    'Agadir': 'agadir', 'Chefchaouen': 'chefchaouen', 'Essaouira': 'essaouira',
    'Meknes': 'meknes', 'Meknès': 'meknes', 'Ouarzazate': 'ouarzazate',
    'Tetouan': 'tetouan', 'Tétouan': 'tetouan', 'Asilah': 'asilah',
    'El Jadida': 'eljadida', 'Ifrane': 'ifrane', 'Dakhla': 'dakhla',
    'Oujda': 'oujda', 'Merzouga': 'merzouga',
  }
  return map[name] || null
}
