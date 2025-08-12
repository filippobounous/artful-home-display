import type { DecorItem } from '@/types/inventory';
import { defaultHouses } from '@/types/inventory';

export const generateTestData = (): DecorItem[] => {
  const creators = [
    'Auguste Rodin', 'Pablo Picasso', 'Leonardo da Vinci', 'Vincent van Gogh',
    'Claude Monet', 'Salvador Dalí', 'Frida Kahlo', 'Jackson Pollock',
    'Andy Warhol', 'Georgia O\'Keeffe', 'Henri Matisse', 'Edgar Degas',
    'Pierre-Auguste Renoir', 'Paul Cézanne', 'Wassily Kandinsky',
    'Joan Miró', 'Gustav Klimt', 'Edvard Munch', 'Caravaggio',
    'Johannes Vermeer', 'Rembrandt van Rijn', 'Michelangelo Buonarroti',
    'Raphael Sanzio', 'Sandro Botticelli', 'El Greco', 'Francisco Goya',
    'Jean-Auguste-Dominique Ingres', 'Eugène Delacroix', 'Théodore Géricault',
    'Caspar David Friedrich', 'John Constable', 'J.M.W. Turner',
    'Unknown Master', 'Workshop of', 'Circle of', 'After', 'Attributed to'
  ];

  const categories = [
    { id: 'art', name: 'Art', subcategories: ['painting', 'sculpture', 'photography', 'print'] },
    { id: 'furniture', name: 'Furniture', subcategories: ['chair', 'table', 'sofa', 'cabinet', 'rug'] },
    { id: 'decorative', name: 'Decorative', subcategories: ['vase', 'basket', 'mirror', 'lighting'] },
    { id: 'kitchenware', name: 'Kitchenware', subcategories: ['tea-set'] }
  ];

  // Use only houses and rooms from defaultHouses
  const validHouses = defaultHouses.map(house => ({
    id: house.id,
    name: house.name,
    rooms: house.rooms.map(room => ({
      id: room.id,
      name: room.name
    }))
  }));

  const regions = [
    'France', 'Italy', 'England', 'Germany', 'Spain', 'Netherlands', 'Belgium',
    'Austria', 'Russia', 'Greece', 'Portugal', 'Switzerland', 'Denmark',
    'Sweden', 'Norway', 'Poland', 'Czech Republic', 'Hungary', 'Romania',
    'Bulgaria', 'Turkey', 'Egypt', 'Morocco', 'Tunisia', 'India', 'China',
    'Japan', 'Korea', 'Thailand', 'Indonesia', 'Vietnam', 'Cambodia',
    'Mexico', 'Peru', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Ecuador',
    'United States', 'Canada', 'Australia', 'New Zealand'
  ];

  const materials = [
    'Oil on canvas', 'Oil on wood', 'Watercolor on paper', 'Acrylic on canvas',
    'Tempera on wood', 'Fresco', 'Pastel on paper', 'Charcoal on paper',
    'Bronze', 'Marble', 'Limestone', 'Sandstone', 'Granite', 'Alabaster',
    'Ceramic', 'Porcelain', 'Earthenware', 'Stoneware', 'Terracotta',
    'Wood (oak)', 'Wood (walnut)', 'Wood (mahogany)', 'Wood (pine)', 'Wood (ebony)',
    'Silver', 'Gold', 'Bronze', 'Copper', 'Brass', 'Pewter', 'Iron',
    'Glass', 'Crystal', 'Venetian glass', 'Stained glass',
    'Silk', 'Wool', 'Cotton', 'Linen', 'Velvet', 'Damask', 'Brocade',
    'Ivory', 'Mother of pearl', 'Jade', 'Amber', 'Coral', 'Lapis lazuli'
  ];

  const periods = [
    '15th century', '16th century', '17th century', '18th century', '19th century',
    'Early 20th century', 'Mid 20th century', 'Late 20th century',
    'Renaissance', 'Baroque', 'Rococo', 'Neoclassical', 'Romantic',
    'Impressionist', 'Post-Impressionist', 'Modern', 'Contemporary',
    'Medieval', 'Gothic', 'Art Nouveau', 'Art Deco', 'Victorian',
    'Edwardian', 'Georgian', 'Regency', 'Empire', 'Biedermeier'
  ];

  const currencies = ['EUR', 'USD', 'GBP', 'CHF', 'JPY'];

  const descriptions = [
    'A magnificent example of period craftsmanship, showcasing exceptional attention to detail and artistic mastery.',
    'This exquisite piece demonstrates the artistic traditions of its era, featuring intricate workmanship and fine materials.',
    'A remarkable work that captures the essence of its historical period, displaying superb technical execution.',
    'An outstanding example of decorative arts, combining aesthetic beauty with functional design.',
    'This elegant piece reflects the sophisticated taste and cultural refinement of its time.',
    'A rare and valuable addition to any collection, representing the pinnacle of artistic achievement.',
    'This beautiful work exemplifies the artistic movements and cultural influences of its era.',
    'A striking piece that demonstrates the evolution of artistic styles and techniques.',
    'This exceptional work showcases the mastery of traditional craftsmanship and artistic vision.',
    'A captivating example of period artistry, featuring distinctive stylistic elements and superior quality.'
  ];

  const notes = [
    'Acquired from a private European collection with excellent provenance.',
    'Previously exhibited at major museums, with detailed documentation.',
    'Underwent professional restoration in 2019, now in excellent condition.',
    'Part of a significant collection assembled over several decades.',
    'Features original frame and mounting, adding to its historical value.',
    'Documented in several scholarly publications on the period.',
    'Comes with detailed conservation report and authentication.',
    'Originally commissioned for a prominent historical residence.',
    'Represents a rare example of the artist\'s mature style.',
    'Includes original artist\'s signature and date, confirming authenticity.'
  ];

  const getRandomElement = <T>(array: T[]): T => 
    array[Math.floor(Math.random() * array.length)];

  const getRandomNumber = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const getRandomDate = (startYear: number, endYear: number): string => {
    const year = getRandomNumber(startYear, endYear);
    const month = getRandomNumber(1, 12).toString().padStart(2, '0');
    const day = getRandomNumber(1, 28).toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const conditions: ('mint' | 'excellent' | 'very good' | 'good')[] = ['mint', 'excellent', 'very good', 'good'];

  const generateItem = (id: number): DecorItem => {
    const category = getRandomElement(categories);
    const subcategory = getRandomElement(category.subcategories);
    const creator = getRandomElement(creators);
    const material = getRandomElement(materials);
    const region = getRandomElement(regions);
    const period = getRandomElement(periods);
    const house = getRandomElement(validHouses);
    const room = getRandomElement(house.rooms);
    const currency = getRandomElement(currencies);
    
    // Generate realistic dimensions based on category
    let width, height, depth, weight;
    if (category.id === 'art') {
      width = getRandomNumber(30, 200);
      height = getRandomNumber(20, 150);
      depth = getRandomNumber(2, 8);
      weight = getRandomNumber(1, 15);
    } else if (category.id === 'furniture') {
      width = getRandomNumber(40, 200);
      height = getRandomNumber(60, 180);
      depth = getRandomNumber(30, 100);
      weight = getRandomNumber(10, 150);
    } else {
      width = getRandomNumber(10, 80);
      height = getRandomNumber(10, 60);
      depth = getRandomNumber(10, 40);
      weight = getRandomNumber(0.5, 25);
    }

    // Remove currency symbols - store as numbers only
    const acquisitionValue = getRandomNumber(500, 50000);
    const valuationValue = Math.round(acquisitionValue * (0.8 + Math.random() * 0.4));

    const itemNames = {
      art: ['Portrait', 'Landscape', 'Still Life', 'Abstract Composition', 'Study'],
      furniture: ['Chair', 'Table', 'Cabinet', 'Chest', 'Desk'],
      decorative: ['Vase', 'Bowl', 'Ornament', 'Decorative Panel', 'Centerpiece'],
      kitchenware: ['Plate', 'Bowl', 'Figurine', 'Tile', 'Vessel']
    };

    const baseName = getRandomElement(itemNames[category.id as keyof typeof itemNames] || ['Object']);
    const title = Math.random() > 0.3 ? 
      `${baseName} ${getRandomNumber(1, 999)}` : 
      `${getRandomElement(['Elegant', 'Antique', 'Ornate', 'Classical', 'Decorative', 'Fine', 'Rare'])} ${baseName}`;

    return {
      id,
      code: `${category.id.toUpperCase().slice(0, 3)}${id.toString().padStart(4, '0')}`,
      title,
      artist: creator,
      originRegion: region,
      category: category.id,
      subcategory,
      material,
      widthCm: width,
      heightCm: height,
      depthCm: depth,
      weightKg: weight,
      provenance: `${region}, ${period}`,
      image: '/placeholder.svg',
      description: 'A magnificent example of period craftsmanship, showcasing exceptional attention to detail and artistic mastery.',
      house: house.id,
      room: room.id,
      yearPeriod: period,
      quantity: getRandomNumber(1, 3),
      acquisitionDate: getRandomDate(2010, 2023),
      acquisitionValue,
      acquisitionCurrency: currency,
      valuation: valuationValue,
      valuationDate: getRandomDate(2020, 2024),
      valuationPerson: getRandomElement([
        'Christie\'s Appraisals', 'Sotheby\'s Valuations', 'Bonhams Assessment',
        'Phillips Evaluation', 'Heritage Auctions', 'Freeman\'s Appraisals',
        'Dr. Elizabeth Morrison', 'Prof. James Richardson', 'Margaret St. Claire',
        'European Art Consultants', 'Fine Arts Appraisal Services'
      ]),
      valuationCurrency: currency,
      notes: 'Acquired from a private European collection with excellent provenance.',
      condition: getRandomElement(conditions),
      deleted: false,
      history: [],
    };
  };

  return Array.from({ length: 150 }, (_, i) => generateItem(i + 1));
};

export const testDecorItems = generateTestData();
