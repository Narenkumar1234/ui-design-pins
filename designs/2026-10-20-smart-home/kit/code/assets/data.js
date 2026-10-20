/* Hearth UI Kit · demo content. Edit freely: rooms, devices, scenes and energy numbers all live here. */
window.HEARTH = {
  user: { name: 'Aarav', home: 'Home, Chennai', initials: 'A' },
  climate: { inside: 24, humidity: 58, outside: 31 },
  rooms: [
    { id: 'living', name: 'Living room', icon: 'sofa' },
    { id: 'bedroom', name: 'Bedroom', icon: 'bed' },
    { id: 'kitchen', name: 'Kitchen', icon: 'pot' },
    { id: 'office', name: 'Office', icon: 'desk' },
  ],
  /* type: light | ac | tv | wifi | plug | purifier | speaker | fridge
     hero: true = this card turns full orange while it is on (one per screen keeps the accent special)
     kw = typical kWh per week, used by the Energy page */
  devices: [
    { id: 'living-lights', name: 'Living lights', type: 'light', room: 'living', on: true, hero: true, lamps: 4, brightness: 80, temp: 2700, kw: 14 },
    { id: 'living-ac', name: 'Air conditioner', type: 'ac', room: 'living', on: true, target: 22, mode: 'cool', fan: 2, kw: 48 },
    { id: 'living-tv', name: 'Smart TV', type: 'tv', room: 'living', on: false, kw: 9 },
    { id: 'router', name: 'Wi-Fi router', type: 'wifi', room: 'office', on: true, clients: 8, kw: 2 },
    { id: 'bed-lamp', name: 'Bedside lamp', type: 'light', room: 'bedroom', on: false, lamps: 2, brightness: 35, temp: 2700, kw: 3 },
    { id: 'bed-ac', name: 'Bedroom AC', type: 'ac', room: 'bedroom', on: false, target: 24, mode: 'cool', fan: 1, kw: 36 },
    { id: 'purifier', name: 'Air purifier', type: 'purifier', room: 'bedroom', on: true, kw: 4 },
    { id: 'kitchen-lights', name: 'Kitchen lights', type: 'light', room: 'kitchen', on: true, lamps: 3, brightness: 60, temp: 4000, kw: 6 },
    { id: 'fridge', name: 'Refrigerator', type: 'fridge', room: 'kitchen', on: true, kw: 11 },
    { id: 'kettle', name: 'Kettle plug', type: 'plug', room: 'kitchen', on: false, kw: 3 },
    { id: 'office-lamp', name: 'Desk lamp', type: 'light', room: 'office', on: false, lamps: 1, brightness: 70, temp: 4000, kw: 2 },
    { id: 'speaker', name: 'Speaker', type: 'speaker', room: 'office', on: false, kw: 1 },
  ],
  /* each scene sets devices on/off when you tap it */
  scenes: [
    { id: 'morning', name: 'Good morning', icon: 'sun', note: '4 devices', set: { 'kitchen-lights': true, 'living-lights': true, 'kettle': true, 'purifier': true } },
    { id: 'movie', name: 'Movie night', icon: 'film', note: 'Lights 20%', set: { 'living-tv': true, 'living-lights': true, 'living-ac': true, 'kitchen-lights': false }, dim: { 'living-lights': 20 } },
    { id: 'away', name: 'Away', icon: 'lock', note: 'All off', set: '*off', keep: ['router', 'fridge'] },
    { id: 'sleep', name: 'Sleep', icon: 'moon', note: 'AC 24°', set: { 'bed-ac': true, 'bed-lamp': false, 'living-lights': false, 'living-tv': false }, target: { 'bed-ac': 24 } },
  ],
  /* energy in kWh: day = 8 x 3-hour blocks, week = Mon..Sun, month = 4 weeks */
  energy: {
    day:   { labels: ['12a', '3a', '6a', '9a', '12p', '3p', '6p', '9p'], values: [0.4, 0.3, 0.6, 0.9, 0.8, 1.1, 1.3, 0.8], prev: 6.9, rate: 8 },
    week:  { labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], values: [18.2, 19.6, 17.4, 24.8, 20.1, 22.3, 20.2], prev: 162.0, rate: 8 },
    month: { labels: ['Wk 1', 'Wk 2', 'Wk 3', 'Wk 4'], values: [151.3, 168.4, 159.0, 142.6], prev: 640.0, rate: 8 },
  },
  temps: [
    { k: 2700, name: 'Warm', hex: '#FFB46B' },
    { k: 3500, name: 'Soft', hex: '#FFD3A1' },
    { k: 4000, name: 'Neutral', hex: '#FFF1DC' },
    { k: 6500, name: 'Daylight', hex: '#DCEBFF' },
  ],
  modes: [
    { id: 'cool', name: 'Cool', icon: 'snow', status: 'Cooling' },
    { id: 'heat', name: 'Heat', icon: 'flame', status: 'Heating' },
    { id: 'dry', name: 'Dry', icon: 'drop', status: 'Drying' },
    { id: 'fan', name: 'Fan', icon: 'fan', status: 'Fan only' },
  ],
  onboarding: [
    { title: 'Your home,<br>on one tap', text: 'Lights, climate and energy in one calm app.' },
    { title: 'Set the mood<br>in a second', text: 'Scenes switch every device in a room at once.' },
    { title: 'Spend less<br>on power', text: 'See what uses the most energy, week by week.' },
  ],
};
