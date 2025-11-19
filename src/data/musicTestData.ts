
import type { MusicItem } from '@/types/inventory';
import { musicCategoryConfigs } from '@/types/inventory';

export const generateMusicTestData = (): MusicItem[] => {
  const artists = [
    'The Beatles', 'Bob Dylan', 'Miles Davis', 'John Coltrane', 'Joni Mitchell',
    'Led Zeppelin', 'Pink Floyd', 'Radiohead', 'Nirvana', 'Prince',
    'Stevie Wonder', 'Aretha Franklin', 'Ray Charles', 'Elvis Presley',
    'The Rolling Stones', 'David Bowie', 'Queen', 'The Who'
  ];

  const visibleCategories = musicCategoryConfigs.filter((category) => category.visible);

  const getFormatsForSubcategory = (subcategoryId?: string): string[] => {
    switch (subcategoryId) {
      case 'vinyl':
        return ['Vinyl LP', '12" Single'];
      case 'cd':
        return ['CD', 'CD Box Set'];
      case 'cassette':
        return ['Cassette', 'Demo Tape'];
      case 'orchestral':
      case 'chamber':
      case 'vocal':
        return ['Full Score', 'Study Score'];
      case 'posters':
      case 'programs':
      case 'merchandise':
        return ['Collectible'];
      default:
        return ['Vinyl LP', 'CD', 'Cassette', '7" Single', '12" Single'];
    }
  };

  const getRandomElement = <T>(array: T[]): T => 
    array[Math.floor(Math.random() * array.length)];

  const getRandomNumber = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const generateMusicItem = (id: number): MusicItem => {
    const artist = getRandomElement(artists);

    const category = getRandomElement(visibleCategories);
    const visibleSubcategories = category.subcategories.filter(
      (subcategory) => subcategory.visible,
    );
    const subcategory =
      visibleSubcategories.length > 0
        ? getRandomElement(visibleSubcategories)
        : undefined;
    const format = getRandomElement(getFormatsForSubcategory(subcategory?.id));
    const genre = [category.name, subcategory?.name].filter(Boolean).join(' • ');
    
    const albums = [
      'Abbey Road', 'Highway 61 Revisited', 'Kind of Blue', 'A Love Supreme',
      'Blue', 'Led Zeppelin IV', 'The Dark Side of the Moon', 'OK Computer',
      'Nevermind', 'Purple Rain', 'Songs in the Key of Life', 'Respect',
      'Modern Sounds in Country and Western Music', 'Elvis Presley',
      'Exile on Main St.', 'The Rise and Fall of Ziggy Stardust'
    ];

    return {
      id,
      title: getRandomElement(albums),
      artist,
      album: getRandomElement(albums),
      format,
      category: category.id,
      subcategory: subcategory?.id,
      genre,
      releaseYear: getRandomNumber(1950, 2024),
      trackCount: getRandomNumber(8, 20),
      description: 'A classic recording that showcases exceptional musical artistry.',
      quantity: getRandomNumber(1, 2),
      yearPeriod: getRandomNumber(1950, 2024).toString(),
      image: '/placeholder.svg',
      valuation: getRandomNumber(15, 300),
      valuationDate: '2024-01-01',
      valuationCurrency: 'USD',
      house: 'main-house',
      room: 'living-room',
      notes: 'Part of the vinyl collection.',
      deleted: false,
      history: [],
    };
  };

  return Array.from({ length: 50 }, (_, i) => generateMusicItem(i + 1));
};

export const testMusic = generateMusicTestData();
