export const BOOKING_MODES = [
  {
    id: 'with_driver',
    label: 'Avec chauffeur',
    img: '/images/chauffeur.jpg',
    desc: 'Transfert privé avec chauffeur — prise en charge à votre adresse',
  },
  {
    id: 'without_driver',
    label: 'Sans chauffeur',
    img: '/images/selfdrive.jpg',
    desc: 'Location de voiture — liberté de conduire par vous-même',
  },
]

export const VEHICLES = [
  { id: 'sedan',   label: 'SEDAN',      capacity: '1-3 pers.' },
  { id: 'suv',     label: 'SUV',        capacity: '1-5 pers.' },
  { id: '4x4',     label: '4x4',        capacity: '1-5 pers.' },
  { id: 'van',     label: 'VAN',        capacity: '1-7 pers.' },
  { id: 'minibus', label: 'MINIBUS',    capacity: '8-15 pers.' },
  { id: 'luxury',  label: 'LUXE',       capacity: '1-5 pers.' },
]

export const CITIES = [
  'Agadir', 'Al Hoceima', 'Asilah', 'Azilal', 'Azrou',
  'Beni Mellal', 'Berkane', 'Berrechid',
  'Casablanca', 'Chefchaouen',
  'Dakhla',
  'El Jadida', 'Errachidia', 'Essaouira',
  'Fes',
  'Ifrane',
  'Jerada',
  'Kenitra', 'Khemisset', 'Khouribga',
  'Laayoune', 'Larache',
  'Marrakech', 'Martil', 'Meknes', 'Mohammedia', 'M\'diq',
  'Nador',
  'Oujda', 'Ouarzazate',
  'Rabat',
  'Safi', 'Sale', 'Settat', 'Sidi Kacem', 'Skhirat',
  'Tangier', 'Taza', 'Taroudant', 'Temara', 'Tetouan', 'Tiznit',
  'Zagora',
]

export const TOURIST_DESTINATIONS = [
  'Ait Ben Haddou',
  'Cascades d\'Ouzoud',
  'Dades Gorge',
  'Merzouga (Erg Chebbi)',
  'Paradise Valley (Taghazout)',
  'Todra Gorge',
  'Volubilis',
]

export const ALL_DESTINATIONS = [...CITIES, ...TOURIST_DESTINATIONS].sort()

export const AIRPORTS = [
  'CMN - Casablanca Mohammed V',
  'RAK - Marrakech Menara',
  'RBA - Rabat Salé',
  'TNG - Tangier Ibn Battouta',
  'FEZ - Fes Saïss',
  'AGA - Agadir Al Massira',
  'OUD - Oujda Angads',
  'NDR - Nador Al Aroui',
  'ERH - Errachidia Moulay Ali Cherif',
  'EUN - Laayoune Hassan I',
  'VIL - Dakhla',
]
