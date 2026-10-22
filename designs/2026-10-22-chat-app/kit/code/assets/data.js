/* Natter UI Kit · data.js — all demo content in one place. Edit freely. */
window.NATTER = {
  me: { id: 'me', name: 'Aarav Kumar', handle: '@aarav', initials: 'AK', grad: ['#5B3FD0', '#B39BFF'], status: 'Available', bio: 'Front-end dev · coffee · late-night commits' },
  statuses: ['Available', 'Busy', 'At class', 'Coding', 'Away'],
  /* gradient pairs for initials avatars */
  people: {
    maya:  { name: 'Maya Chen',  initials: 'MC', grad: ['#FF5C8A', '#FF9F43'], online: true,  about: 'Product designer' },
    arjun: { name: 'Arjun Rao',  initials: 'AR', grad: ['#7B61FF', '#5BC0EB'], online: false, about: 'Backend · Go + Postgres', seen: 'last seen 9:40' },
    zoe:   { name: 'Zoe Lee',    initials: 'ZL', grad: ['#B39BFF', '#FF7AA0'], online: true,  about: 'UX research' },
    dev:   { name: 'Dev Patel',  initials: 'DP', grad: ['#FF9F43', '#FFC46B'], online: false, about: 'Mobile dev', seen: 'last seen yesterday' },
    priya: { name: 'Priya Nair', initials: 'PN', grad: ['#5B3FD0', '#FF5C8A'], online: true,  about: 'Data science' },
    leo:   { name: 'Leo Park',   initials: 'LP', grad: ['#36C2B4', '#7B61FF'], online: true,  about: 'Full-stack · Node' },
    sara:  { name: 'Sara Ali',   initials: 'SA', grad: ['#FF7AA0', '#B39BFF'], online: false, about: 'Illustrator', seen: 'last seen 2h ago' },
  },
  stories: [
    { id: 'maya', img: 'img/sunset-hike.svg', text: 'Sunday hike, 14 km!', t: '2h' },
    { id: 'arjun', img: 'img/desk-setup.svg', text: 'New desk setup', t: '3h' },
    { id: 'zoe', img: 'img/coffee-run.svg', text: 'Coffee before research', t: '5h' },
    { id: 'dev', img: 'img/night-city.svg', text: 'Shipping at midnight', t: '8h' },
    { id: 'priya', img: 'img/beach-day.svg', text: 'Beach day', t: '10h' },
    { id: 'sara', img: 'img/concert.svg', text: 'Best concert ever', t: '12h' },
  ],
  reactions: ['❤️', '😂', '👍', '😮', '🔥', '🙏'],
  /* chats: kind 'dm' (with person) or 'group' (members). Messages: from 'me' or a person id. */
  chats: [
    { id: 'maya', kind: 'dm', unread: 2, pinned: true, messages: [
      { id: 'm1', from: 'maya', text: 'Hey! Did you see the new design brief?', t: '10:02' },
      { id: 'm2', from: 'me', text: 'Yes! Working on the chat screens now', t: '10:03', status: 'read' },
      { id: 'm3', from: 'maya', type: 'image', src: 'img/brief-moodboard.svg', text: 'Moodboard for the bubbles', t: '10:05', reactions: { '❤️': ['me', 'maya'] } },
      { id: 'm4', from: 'me', type: 'voice', dur: 42, t: '10:08', status: 'read', reactions: { '🔥': ['maya'] } },
      { id: 'm5', from: 'maya', text: 'Love it, ship it today?', t: '10:24', replyTo: 'm2' },
    ], replies: ['Perfect, send me the link when it is up', 'Haha yes 🙌', 'Can we add a dark mode too?', 'Sounds good! Call at 5?'] },
    { id: 'squad', kind: 'group', name: 'Design Squad', initials: 'DS', grad: ['#5B3FD0', '#FF9F43'], members: ['zoe', 'dev', 'maya', 'leo'], admin: 'zoe', unread: 5, messages: [
      { id: 'g1', from: 'dev', text: 'Standup moved to 5 pm', t: '09:40' },
      { id: 'g2', from: 'leo', type: 'image', src: 'img/wireframes.svg', text: 'Wireframes v2', t: '09:44', reactions: { '👍': ['zoe', 'dev'] } },
      { id: 'g3', from: 'me', text: 'Nice, the chat list looks clean', t: '09:50', status: 'read' },
      { id: 'g4', from: 'zoe', text: 'see you at 5!', t: '09:58' },
    ], replies: ['Agreed 👍', 'Pushing the fix now', 'Who is booking the room?'] },
    { id: 'arjun', kind: 'dm', unread: 0, messages: [
      { id: 'a1', from: 'arjun', text: 'API is up on staging', t: '09:05' },
      { id: 'a2', from: 'me', text: 'Ran it with the new socket events, works', t: '09:10', status: 'read' },
      { id: 'a3', from: 'arjun', text: "haha that's perfect", t: '09:12' },
    ], replies: ['Merging it then', 'Nice 🚀'] },
    { id: 'priya', kind: 'dm', unread: 0, messages: [
      { id: 'p1', from: 'priya', type: 'image', src: 'img/beach-day.svg', text: '', t: 'Yesterday' },
    ], replies: ['Miss this already', 'Next weekend?'] },
    { id: 'leo', kind: 'dm', unread: 1, typing: true, messages: [
      { id: 'l1', from: 'leo', text: 'Can you review my PR?', t: '08:30' },
    ], replies: ['Thanks! Left two comments', 'Merging after lunch'] },
    { id: 'hack', kind: 'group', name: "Hackathon '26", initials: 'H26', grad: ['#FF5C8A', '#7B61FF'], members: ['arjun', 'priya', 'sara'], admin: 'me', unread: 0, muted: true, messages: [
      { id: 'h1', from: 'sara', text: 'Logo drafts are in the drive', t: 'Mon' },
    ], replies: ['On it', 'Love the second one'] },
    { id: 'sara', kind: 'dm', unread: 0, messages: [
      { id: 's1', from: 'me', text: 'The illustrations are 🔥', t: 'Sun', status: 'read' },
    ], replies: ['Thank you!! ✨'] },
  ],
  calls: [
    { id: 'c1', who: 'maya', dir: 'in', video: false, t: 'Today, 10:30', dur: '4:12' },
    { id: 'c2', who: 'squad', dir: 'out', video: true, t: 'Today, 09:00', dur: '18:40' },
    { id: 'c3', who: 'arjun', dir: 'missed', video: false, t: 'Yesterday, 21:14' },
    { id: 'c4', who: 'zoe', dir: 'out', video: true, t: 'Yesterday, 18:02', dur: '7:55' },
    { id: 'c5', who: 'dev', dir: 'missed', video: true, t: 'Mon, 11:20' },
    { id: 'c6', who: 'priya', dir: 'in', video: false, t: 'Sun, 16:45', dur: '1:03' },
  ],
  intro: [
    { title: 'Talk more,<br>type less.', text: 'Voice notes, reactions and group calls for your whole crew.' },
    { title: 'React to<br>every moment.', text: 'Tap and hold any message to react, reply or copy it.' },
    { title: 'Your circle,<br>always close.', text: 'Stories, presence and read receipts, all in one calm app.' },
  ],
};
