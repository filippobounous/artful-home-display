
import type { BookItem } from '@/types/inventory';
import { bookDefaultHouses } from '@/types/inventory';

export const generateBooksTestData = (): BookItem[] => {
  const authors = [
    'Jane Austen', 'Charles Dickens', 'William Shakespeare', 'Ernest Hemingway',
    'Virginia Woolf', 'James Joyce', 'Marcel Proust', 'Leo Tolstoy',
    'Fyodor Dostoevsky', 'Gabriel García Márquez', 'Jorge Luis Borges',
    'Toni Morrison', 'Maya Angelou', 'Chinua Achebe', 'Haruki Murakami'
  ];

  const publishers = [
    'Penguin Classics', 'Oxford University Press', 'Cambridge University Press',
    'Vintage Books', 'Faber & Faber', 'Harcourt Brace', 'Random House',
    'Macmillan', 'HarperCollins', 'Scribner', 'Knopf', 'Norton'
  ];

  const genres = [
    'Literary Fiction', 'Classic Literature', 'Philosophy', 'History',
    'Biography', 'Poetry', 'Drama', 'Essays', 'Travel', 'Art History',
    'Science', 'Mystery', 'Fantasy', 'Memoir'
  ];

  const valuationCurrencies = ['USD', 'GBP', 'EUR'];

  const getRandomElement = <T>(array: T[]): T => 
    array[Math.floor(Math.random() * array.length)];

  const getRandomNumber = (min: number, max: number): number =>
    Math.floor(Math.random() * (max - min + 1)) + min;

  const generateBook = (id: number): BookItem => {
    const author = getRandomElement(authors);
    const publisher = getRandomElement(publishers);
    const genre = getRandomElement(genres);
    
    const titles = [
      'Pride and Prejudice', 'Great Expectations', 'Hamlet', 'The Sun Also Rises',
      'To the Lighthouse', 'Ulysses', 'In Search of Lost Time', 'War and Peace',
      'Crime and Punishment', 'One Hundred Years of Solitude', 'Labyrinths',
      'Beloved', 'I Know Why the Caged Bird Sings', 'Things Fall Apart',
      'Norwegian Wood', 'The Great Gatsby', 'Moby Dick', 'Jane Eyre'
    ];

    const publicationYear = getRandomNumber(1850, 2024);
    const house = getRandomElement(bookDefaultHouses);
    const room =
      house.rooms && house.rooms.length > 0
        ? getRandomElement(house.rooms).id
        : undefined;
    const valuationCurrency = getRandomElement(valuationCurrencies);

    return {
      id,
      title: getRandomElement(titles),
      author,
      publisher,
      isbn: `978-${getRandomNumber(1000000000, 9999999999)}`,
      genre,
      pageCount: getRandomNumber(150, 800),
      publicationYear,
      description: 'A remarkable literary work that has influenced generations of readers.',
      quantity: getRandomNumber(1, 3),
      yearPeriod: publicationYear.toString(),
      image: '/placeholder.svg',
      valuation: getRandomNumber(20, 500),
      valuationDate: '2024-01-01',
      valuationCurrency,
      house: house.id,
      room,
      notes: 'Part of the literary collection.',
      deleted: false,
      history: [],
    };
  };

  return Array.from({ length: 50 }, (_, i) => generateBook(i + 1));
};

export const testBooks = generateBooksTestData();
