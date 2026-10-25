/* Folio UI Kit · demo data. Every book, author and line of text here is invented for the demo (no real titles or covers).
   cover: which CSS cover design to draw (see Folio.cover in app.js). Change anything you like; Settings → Reset demo restores it. */
window.FOLIO_DATA = {
  demoNow: '2026-10-27T19:30:00',          // fixed demo clock so screenshots are repeatable; set to null to use the real date
  user: { name: 'Riya Kapoor', first: 'Riya', handle: '@riya.reads', following: 128, followers: 96, yearGoal: 30 },
  books: [
    { id: 'quiet-orbit', title: 'Quiet Orbit', author: 'Mira Sol', genre: 'Sci-fi', pages: 312, rating: 4.4, hours: 8, cover: 'sun',
      about: 'A night-shift engineer on a lonely relay station starts hearing a second voice on the maintenance channel. Quiet Orbit is a slow, warm space story about routines, radio static and choosing who you talk to when nobody is listening.' },
    { id: 'salt-signal', title: 'Salt & Signal', author: 'Dev Rao', genre: 'Sci-fi', pages: 286, rating: 4.6, hours: 7, cover: 'split',
      about: 'In a coastal city that runs on tide power, a teenage radio hacker finds a signal hidden inside the salt-flat weather reports. A fast, clever mystery about networks, families and the price of being heard.' },
    { id: 'long-noon', title: 'The Long Noon', author: 'Ana Kade', genre: 'Fiction', pages: 260, rating: 4.2, hours: 6, cover: 'arc',
      about: 'One summer afternoon in a hill town stretches for an impossible week. Three friends use the extra hours to fix what went wrong between them, before the sun finally moves.' },
    { id: 'paper-tigers', title: 'Paper Tigers', author: 'Leo Marsh', genre: 'History', pages: 344, rating: 4.1, hours: 9, cover: 'stripe',
      about: 'A readable history of the printing presses, pamphlets and street posters that shaped five small revolutions, told through the printers who set the type by hand.' },
    { id: 'small-gods', title: 'Small Gods of Code', author: 'Ira Bose', genre: 'Design', pages: 198, rating: 4.8, hours: 5, cover: 'grid',
      about: 'Short essays on the tiny decisions that make software feel kind: default values, empty states, error messages and the one button you put first. Funny, practical and very quotable.' },
    { id: 'ninety-lanterns', title: 'Ninety Lanterns', author: 'Zoya Iqbal', genre: 'Poetry', pages: 132, rating: 4.5, hours: 3, cover: 'dots',
      about: 'Ninety short poems written one per night during a festival month, about light, old streets and the people who keep the lamps going.' },
    { id: 'field-notes', title: 'Field Notes on Focus', author: 'Kabir Sen', genre: 'Self-help', pages: 224, rating: 4.3, hours: 5, cover: 'type',
      about: 'A pocket guide to deep work for students: how to plan a study block, protect it from your phone and come back when you drift. Built from small experiments you can try tonight.' },
    { id: 'iron-ivy', title: 'Iron & Ivy', author: 'Nora Pike', genre: 'Fantasy', pages: 410, rating: 4.0, hours: 10, cover: 'mono',
      about: 'A blacksmith’s apprentice and a botanist-thief are hired to break the same enchanted gate. A cosy-meets-heist fantasy with forged keys, living walls and a very opinionated cat.' },
  ],
  // your library: status 'reading' | 'want' | 'done', page = last page read, mine = your rating, shelf = on "My shelf", hl = highlighted paragraphs
  library: {
    'quiet-orbit':     { status: 'reading', page: 184, shelf: true,  started: '2026-10-14' },
    'salt-signal':     { status: 'reading', page: 92,  shelf: false, started: '2026-10-22' },
    'long-noon':       { status: 'reading', page: 143, shelf: true,  started: '2026-10-19', hl: { 143: [1] } },
    'paper-tigers':    { status: 'want',    page: 0,   shelf: true },
    'small-gods':      { status: 'done',    page: 198, shelf: true,  mine: 5 },
    'ninety-lanterns': { status: 'done',    page: 132, shelf: true,  mine: 4 },
    'field-notes':     { status: 'want',    page: 0,   shelf: false },
    'iron-ivy':        { status: 'want',    page: 0,   shelf: true },
  },
  current: 'quiet-orbit',
  // minutes read per day (ending on the demo date): makes a 12-day streak
  log: { '2026-10-04': 25, '2026-10-05': 40, '2026-10-06': 18, '2026-10-08': 30, '2026-10-09': 22, '2026-10-10': 45, '2026-10-11': 12,
         '2026-10-12': 0, '2026-10-13': 0, '2026-10-14': 0, '2026-10-15': 0,
         '2026-10-16': 28, '2026-10-17': 35, '2026-10-18': 52, '2026-10-19': 31, '2026-10-20': 20, '2026-10-21': 44, '2026-10-22': 26,
         '2026-10-23': 38, '2026-10-24': 60, '2026-10-25': 47, '2026-10-26': 33, '2026-10-27': 22 },
  stats: { booksRead: 24, pages: 6480, hours: 112, longest: 31, perMonth: [2, 3, 1, 2, 3, 2, 1, 3, 2, 3, 0, 0], monthNow: 9 },
  dailyGoal: 30,
  genres: ['Sci-fi', 'Fantasy', 'Fiction', 'Self-help', 'Poetry', 'History', 'Design'],
  favGenres: ['Sci-fi', 'Design'],
  // reader text: original placeholder prose, cycled per page
  prose: [
    'The light came in sideways, the way it only did in the last week of the season, and lay across the table like something that had been left there on purpose.',
    'Nobody in the house said the word noon anymore. It had stopped meaning a time and started meaning a place, somewhere between lunch and the moment you notice you are tired.',
    'She counted the steps from the gate to the well. Forty-one, the same as yesterday. The sameness was a comfort, and then, without warning, it was the opposite of one.',
    'Somewhere below the hill a radio was playing an old song, the kind you know the shape of before you know the words. It came and went with the wind.',
    'He had a theory that every afternoon has one exact minute where it decides what kind of afternoon it will be. The trick was to be paying attention when it happened.',
    'They walked to the edge of town where the road gave up and turned into a path, and the path gave up and turned into grass, and the grass went on without asking anyone.',
    'It is strange how a place can hold a feeling for you, the way a drawer holds a letter. You open it years later and the feeling is still folded exactly as you left it.',
    'By the time the shadows finally moved, all three of them had said the thing they came to say. Nobody clapped. The kettle clicked off. That was enough.',
    'Reading, she decided, was just listening with your eyes to someone who had decided to be patient with you. She turned the page and let them be patient a little longer.',
    'The map on the wall was wrong in four places. Nobody fixed it. The wrong places had become the parts of town they liked best.',
  ],
};
