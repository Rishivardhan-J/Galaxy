export const profile = {
  name: 'Rishivardhan J',
  role: 'Full-stack & mobile developer',
  tagline: 'Computer Science student who ships end to end, from the data model to the last pixel.',
  availability: 'Open to internships and full-time roles',
  email: 'rishivardhan.j2024cse@sece.ac.in',
  github: 'https://github.com/Rishivardhan-J',
  linkedin: 'https://www.linkedin.com/in/rishivardhan-j-ba9469399/',
  resume: '/resume/Rishivardhan-J-Resume.pdf',
  college: 'Sri Eshwar College of Engineering',
  timezone: 'Asia/Kolkata',
  leetcode: { rating: 1649, solved: '600+' },
} as const

export const timeline = [
  { year: '2024–2028', tag: 'Education', title: 'B.E. Computer Science', detail: 'Sri Eshwar College of Engineering.', chips: ['CGPA 7.91', 'IV sem'], now: true },
  { year: '2025', tag: 'Internship', title: 'Aptitude Guru', detail: 'Feastly, a full-stack food delivery system with role-based access, secure auth, orders and payments.', chips: ['MongoDB', 'Express', 'React', 'Node.js'], now: false },
  { year: '2026', tag: 'Internship', title: 'Algotutor · Flutter', detail: 'CampusHub, a student assistant app for schedules, resources and announcements.', chips: ['Flutter', 'Dart'], now: false },
  { year: '2026', tag: 'Achievement', title: 'Finalist, twice', detail: 'Google Developer Groups TechSprint 2026, and HCL Foundations + StartUp TN AI for Social Impact Challenge 2026.', chips: ['GDG TechSprint', 'AI for Social Impact'], now: false },
  { year: 'Always', tag: 'Practice', title: 'LeetCode', detail: 'Steady problem solving to sharpen data structures and algorithms.', chips: ['Max rating 1649', '600+ solved'], now: false },
]

export const credentials = [
  { issuer: 'IIT Bombay', mark: 'IITB', courses: [{ name: 'Intro to C programming', year: 2024 }, { name: 'Intro to C++ programming', year: 2024 }] },
  { issuer: 'Udemy', mark: 'UD', courses: [{ name: 'Mastering DSA in C and C++', year: 2025 }] },
  { issuer: 'HackerRank', mark: 'HR', track: true, courses: [{ name: 'SQL Basics', year: 2025 }, { name: 'SQL Intermediate', year: 2025 }] },
]

export const roleCycle = ['Full-stack & mobile developer', 'Flutter · React · Node.js'] as const

// Launchpad credibility strip. `value` is counted up to; `suffix` is appended.
export const launchStats = [
  { value: 3, suffix: '', label: 'Flagship projects' },
  { value: profile.leetcode.rating, suffix: '', label: 'LeetCode max rating' },
  { value: 600, suffix: '+', label: 'Problems solved' },
  { value: 2, suffix: '×', label: 'Hackathon finalist' },
] as const
