/* Lumo UI Kit · data.js — demo content. Swap this file for a real API later. */
window.LUMO = {
  user: { name: 'Aarav', initial: 'A', goal: 20 },

  /* tone = pastel tile colour token (peach | cream | lav | sky) */
  categories: [
    { id: 'coding',    name: 'Coding',    img: 'laptop',  tone: 'peach', tags: ['popular', 'free'] },
    { id: 'design',    name: 'Design',    img: 'pencil',  tone: 'cream', tags: ['popular', 'new'] },
    { id: 'science',   name: 'Science',   img: 'flask',   tone: 'lav',   tags: ['new'] },
    { id: 'languages', name: 'Languages', img: 'globe',   tone: 'sky',   tags: ['popular', 'free'] },
    { id: 'writing',   name: 'Writing',   img: 'books',   tone: 'cream', tags: ['free'] },
    { id: 'exams',     name: 'Exam prep', img: 'gradcap', tone: 'lav',   tags: ['new'] },
  ],

  courses: [
    { id: 'js-basics', cat: 'coding', title: 'JavaScript for Beginners', teacher: 'Riya Sharma', rating: 4.9, img: 'laptop', tone: 'lav',
      lessons: ['Hello, JavaScript', 'Variables and types', 'Functions', 'Arrays and loops', 'Objects', 'The DOM', 'Events', 'Fetch and JSON', 'Async / await', 'Local storage', 'Mini project: to-do app', 'Recap + quiz'],
      mins: [8, 10, 13, 10, 11.5, 14, 11, 12, 13, 9, 18, 7], resumeAt: 252 },
    { id: 'html-css', cat: 'coding', title: 'HTML & CSS from Zero', teacher: 'Kabir Mehta', rating: 4.8, img: 'laptop', tone: 'peach',
      lessons: ['How the web works', 'Your first page', 'Text and links', 'Images', 'The box model', 'Flexbox', 'Grid', 'Responsive design', 'Forms', 'Ship a portfolio'],
      mins: [6, 9, 10, 8, 12, 14, 14, 13, 11, 16] },
    { id: 'ui-design', cat: 'design', title: 'UI Design Basics', teacher: 'Meera Iyer', rating: 4.9, img: 'pencil', tone: 'cream',
      lessons: ['What makes UI good', 'Layout and spacing', 'Type scale', 'Colour basics', 'Buttons and states', 'Cards and lists', 'Icons', 'Forms that work', 'Dark mode', 'Prototyping', 'Hand-off to code', 'Case study'],
      mins: [7, 11, 9, 12, 10, 9, 8, 12, 10, 13, 9, 15] },
    { id: 'figma-101', cat: 'design', title: 'Figma in a Weekend', teacher: 'Meera Iyer', rating: 4.7, img: 'pencil', tone: 'peach',
      lessons: ['Frames and layers', 'Auto layout', 'Components', 'Variants', 'Styles and tokens', 'Prototype flows', 'Share and inspect'],
      mins: [9, 13, 12, 11, 10, 12, 8] },
    { id: 'chem-101', cat: 'science', title: 'Chemistry Made Easy', teacher: 'Dr. Ananya Rao', rating: 4.8, img: 'flask', tone: 'lav',
      lessons: ['Atoms and elements', 'The periodic table', 'Bonds', 'Reactions', 'Acids and bases', 'Moles', 'Lab safety', 'Revision'],
      mins: [10, 12, 11, 13, 12, 14, 6, 10] },
    { id: 'physics', cat: 'science', title: 'Physics of Everyday Things', teacher: 'Arjun Nair', rating: 4.7, img: 'flask', tone: 'sky',
      lessons: ['Motion', 'Forces', 'Energy', 'Waves and sound', 'Light', 'Electricity', 'Magnets', 'Revision'],
      mins: [11, 12, 10, 12, 11, 13, 9, 10] },
    { id: 'spanish', cat: 'languages', title: 'Spanish for Starters', teacher: 'Lucia Gomez', rating: 4.9, img: 'globe', tone: 'sky',
      lessons: ['Hola! Greetings', 'Numbers', 'Ordering food', 'Directions', 'Present tense', 'Daily routine', 'Travel phrases', 'Speaking practice'],
      mins: [7, 8, 10, 9, 12, 10, 9, 14] },
    { id: 'essays', cat: 'writing', title: 'Essay Writing That Works', teacher: 'Sana Kapoor', rating: 4.8, img: 'books', tone: 'cream',
      lessons: ['Find your argument', 'Outline in 10 min', 'Strong intros', 'Paragraph flow', 'Evidence', 'Conclusions', 'Editing checklist'],
      mins: [9, 10, 8, 11, 10, 8, 12] },
    { id: 'quant', cat: 'exams', title: 'Quant Basics for Exams', teacher: 'Vikram Shah', rating: 4.6, img: 'gradcap', tone: 'lav',
      lessons: ['Number sense', 'Percentages', 'Ratios', 'Speed and time', 'Algebra warm-up', 'Data reading', 'Mock test'],
      mins: [10, 11, 10, 12, 13, 11, 25] },
  ],

  /* Demo progress for first open: lessons already completed per course */
  seedProgress: { 'ui-design': 3, 'js-basics': 4, 'chem-101': 2 },

  /* Demo minutes per weekday (Mon..Sun). Days before today are pre-filled, today starts at 0 and grows as you finish lessons. */
  week: [18, 25, 12, 30, 22, 16, 20],

  quiz: {
    'js-basics': [
      { q: 'Which keyword declares a value that should not be reassigned?', a: ['var', 'let', 'const'], ok: 2 },
      { q: 'What does [1, 2, 3].length return?', a: ['2', '3', '4'], ok: 1 },
      { q: 'Which method turns a JSON string into an object?', a: ['JSON.parse()', 'JSON.stringify()', 'Object.from()'], ok: 0 },
    ],
    default: [
      { q: 'What is the best way to remember a new idea?', a: ['Read it once', 'Explain it in your own words', 'Skip the practice'], ok: 1 },
      { q: 'How long is a good focused study block?', a: ['5 hours', '25-45 minutes', '2 minutes'], ok: 1 },
      { q: 'What keeps a streak alive?', a: ['A little every day', 'One long session a month', 'Only weekends'], ok: 0 },
    ],
  },

  badges: [
    { id: 'first',  name: 'First lesson',  img: 'bulb' },
    { id: 'streak', name: '5-day streak',  img: 'trophy' },
    { id: 'quiz',   name: 'Quiz ace',      img: 'gradcap' },
    { id: 'reader', name: '10 lessons',    img: 'books' },
  ],
};
