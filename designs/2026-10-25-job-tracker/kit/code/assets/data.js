/* Orbit UI Kit · demo content.
   17 applications for "Aarav", a final-year CS student hunting internships + new-grad roles in India (all companies are fictional).
   The demo clock is fixed so screenshots are repeatable: set ORBIT_DATA.demoNow = null to use the real date. */
window.ORBIT_DATA = {
  demoNow: '2026-10-25T10:00:00',
  user: { name: 'Aarav Mehta', first: 'Aarav', email: 'aarav@student.dev' },
  statuses: [
    { id: 'wishlist', label: 'Wishlist' },
    { id: 'applied', label: 'Applied' },
    { id: 'interview', label: 'Interview' },
    { id: 'offer', label: 'Offer' },
    { id: 'rejected', label: 'Rejected' },
  ],
  sources: ['LinkedIn', 'Referral', 'Company site', 'Wellfound', 'Internshala', 'Naukri', 'Campus', 'Other'],
  /* monogram colours stay inside the palette: forest, steel, coral, lime, ink, sand */
  logoColors: ['#1F4D3A', '#5B7C99', '#E07A5F', '#C6F35E', '#14181A', '#B8A57A'],
  applications: [
    { id: 'northwind', company: 'Northwind', role: 'Frontend Intern', type: 'Internship', mode: 'Hybrid', location: 'Bengaluru', salary: 45000, per: 'mo', status: 'interview', applied: '2026-10-14', source: 'LinkedIn', link: 'https://northwind.example/careers/frontend-intern', color: 0,
      interview: { at: '2026-10-27T10:30', kind: 'Technical interview', where: 'Google Meet' },
      notes: 'Revise React hooks, useMemo vs useCallback.\nPrepare the Orbit project demo (drag-and-drop + localStorage).\nAsk about mentorship + team size.',
      contacts: [{ name: 'Priya Nair', role: 'Recruiter', email: 'priya@northwind.example' }, { name: 'Rahul Verma', role: 'Engineering Manager', email: 'rahul@northwind.example' }],
      timeline: [{ date: '2026-10-12', label: 'Saved to wishlist' }, { date: '2026-10-14', label: 'Applied via LinkedIn' }, { date: '2026-10-20', label: 'Recruiter call with Priya' }, { date: '2026-10-21', label: 'Moved to Interview' }] },
    { id: 'quanta', company: 'Quanta', role: 'SDE I', type: 'Full-time', mode: 'On-site', location: 'Hyderabad', salary: 1400000, per: 'yr', status: 'interview', applied: '2026-10-08', source: 'Referral', link: 'https://quanta.example/jobs/sde-1', color: 1,
      interview: { at: '2026-10-29T15:00', kind: 'System design round', where: 'Zoom' },
      notes: 'Referral from Kavya (batch of 2025).\nOA cleared: 3/3 questions.', contacts: [{ name: 'Kavya Iyer', role: 'SDE II · referrer', email: 'kavya@quanta.example' }] },
    { id: 'lumen', company: 'Lumen', role: 'Product Designer', type: 'Full-time', mode: 'Remote', location: 'Remote', salary: 1100000, per: 'yr', status: 'interview', applied: '2026-10-16', source: 'Wellfound', link: 'https://lumen.example/careers', color: 3,
      interview: { at: '2026-11-02T11:00', kind: 'Portfolio review', where: 'Google Meet' }, notes: 'Walk through 2 case studies, 10 min each.' },
    { id: 'pixelcraft', company: 'Pixelcraft', role: 'UI Engineer Intern', type: 'Internship', mode: 'Remote', location: 'Remote', salary: 35000, per: 'mo', status: 'offer', applied: '2026-09-22', source: 'Company site', link: 'https://pixelcraft.example/jobs', color: 2,
      notes: 'Offer letter received 19 Oct. Reply by 30 Oct.', interview: { at: '2026-10-09T16:00', kind: 'Final round', where: 'Zoom' } },
    { id: 'fernwood', company: 'Fernwood', role: 'Full-stack Intern', type: 'Internship', mode: 'Hybrid', location: 'Pune', salary: 30000, per: 'mo', status: 'applied', applied: '2026-10-21', source: 'Internshala', color: 0 },
    { id: 'brightpath', company: 'Brightpath', role: 'React Developer', type: 'Full-time', mode: 'On-site', location: 'Bengaluru', salary: 900000, per: 'yr', status: 'applied', applied: '2026-10-19', source: 'LinkedIn', color: 4 },
    { id: 'kite', company: 'Kite Labs', role: 'Software Engineer Intern', type: 'Internship', mode: 'Remote', location: 'Remote', salary: 40000, per: 'mo', status: 'applied', applied: '2026-10-23', source: 'Company site', color: 3 },
    { id: 'arcadia', company: 'Arcadia', role: 'Frontend Engineer', type: 'Full-time', mode: 'Hybrid', location: 'Gurugram', salary: 1200000, per: 'yr', status: 'applied', applied: '2026-10-12', source: 'Referral', color: 5 },
    { id: 'orchid', company: 'Orchid Pay', role: 'Backend Intern', type: 'Internship', mode: 'On-site', location: 'Bengaluru', salary: 50000, per: 'mo', status: 'applied', applied: '2026-10-02', source: 'LinkedIn', color: 2 },
    { id: 'zephyr', company: 'Zephyr AI', role: 'ML Engineer Intern', type: 'Internship', mode: 'Remote', location: 'Remote', salary: 60000, per: 'mo', status: 'applied', applied: '2026-09-29', source: 'Wellfound', color: 1 },
    { id: 'tidewater', company: 'Tidewater', role: 'Web Developer', type: 'Full-time', mode: 'On-site', location: 'Chennai', salary: 700000, per: 'yr', status: 'applied', applied: '2026-09-15', source: 'Naukri', color: 5 },
    { id: 'saffron', company: 'Saffron Labs', role: 'SDE Intern', type: 'Internship', mode: 'Hybrid', location: 'Mumbai', salary: 40000, per: 'mo', status: 'applied', applied: '2026-10-06', source: 'Campus', color: 0 },
    { id: 'cobalt', company: 'Cobalt Health', role: 'Frontend Intern', type: 'Internship', mode: 'Remote', location: 'Remote', salary: 25000, per: 'mo', status: 'rejected', applied: '2026-09-03', source: 'LinkedIn', color: 1, notes: 'Rejected after OA. Practise DP + graphs.' },
    { id: 'halo', company: 'Halo Learning', role: 'Junior Developer', type: 'Full-time', mode: 'On-site', location: 'Pune', salary: 600000, per: 'yr', status: 'rejected', applied: '2026-09-10', source: 'Naukri', color: 2 },
    { id: 'ridgeline', company: 'Ridgeline', role: 'Platform Engineer', type: 'Full-time', mode: 'Hybrid', location: 'Bengaluru', salary: 1600000, per: 'yr', status: 'wishlist', applied: '', source: 'LinkedIn', color: 4 },
    { id: 'monsoon', company: 'Monsoon Studio', role: 'Creative Developer', type: 'Internship', mode: 'Remote', location: 'Remote', salary: 30000, per: 'mo', status: 'wishlist', applied: '', source: 'Other', color: 2 },
    { id: 'vertex', company: 'Vertex Cloud', role: 'DevOps Intern', type: 'Internship', mode: 'On-site', location: 'Hyderabad', salary: 35000, per: 'mo', status: 'wishlist', applied: '', source: 'Company site', color: 1 },
  ],
};
