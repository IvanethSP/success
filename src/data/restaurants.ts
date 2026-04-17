export interface Restaurant {
  id: string;
  name: string;
  type: string;
  address: string;
  rating: number;
  distance: string;
  imageColor: string;
  mapsUrl: string;
  tags: string[];
}

export const healthyRestaurants: Restaurant[] = [
  {
    id: 'r1',
    name: 'El Árbol de la Vida',
    type: 'Vegetariano / Vegano',
    address: 'Av. Larco 123, Miraflores',
    rating: 4.8,
    distance: '1.2 km',
    imageColor: '#86efac',
    mapsUrl: 'https://maps.google.com/?q=-12.122,-77.031',
    tags: ['Saludable', 'Menú', 'Ensaladas']
  },
  {
    id: 'r2',
    name: 'Quinoa Café',
    type: 'Healthy / Bowls',
    address: 'Calle Miguel Dasso 150, San Isidro',
    rating: 4.6,
    distance: '2.5 km',
    imageColor: '#fef08a',
    mapsUrl: 'https://maps.google.com/?q=-12.100,-77.037',
    tags: ['Bowls', 'Wraps', 'Postres fit']
  },
  {
    id: 'r3',
    name: 'Armónica Café',
    type: 'Natural / Sin Gluten',
    address: 'Av. La Mar 1100, Miraflores',
    rating: 4.7,
    distance: '3.0 km',
    imageColor: '#fca5a5',
    mapsUrl: 'https://maps.google.com/?q=-12.112,-77.045',
    tags: ['Sin Gluten', 'Vanguardia', 'Superfoods']
  },
  {
    id: 'r4',
    name: 'Raw Café',
    type: 'Vegano / Raw',
    address: 'Calle Independencia 596, Miraflores',
    rating: 4.5,
    distance: '1.8 km',
    imageColor: '#bbf7d0',
    mapsUrl: 'https://maps.google.com/?q=-12.115,-77.030',
    tags: ['Raw', 'Detox', 'Planchas']
  },
  {
    id: 'r5',
    name: 'La Bodega Verde',
    type: 'Saludable / Orgánico',
    address: 'Sucre 335, Barranco',
    rating: 4.6,
    distance: '4.2 km',
    imageColor: '#a7f3d0',
    mapsUrl: 'https://maps.google.com/?q=-12.147,-77.022',
    tags: ['Orgánico', 'Jardín', 'Desayunos']
  }
];
