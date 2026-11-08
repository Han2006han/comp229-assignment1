/**
 * File name: data/portfolio.js
 * Student's Name: Han
 * Student ID: 2024110006
 * Date: 2026-11-08
 *
 * Single source of truth for the portfolio content. Routes import these values
 * and pass them to the views, which keeps the route file focused on behaviour.
 */

// ---------------------------------------------------------------------------
// Profile
// ---------------------------------------------------------------------------
const profile = {
  fullName: 'Han',
  headline: 'Web Developer & Computer Programming Student',
  location: 'Toronto, ON, Canada',
  email: 'han@example.com',
  phone: '(416) 555-0142',
  github: 'https://github.com/Han2006han',
  school: 'Centennial College',
  program: 'Software Engineering Technology',
  mission:
    'I build clean, accessible web applications that make everyday tasks a little lighter. ' +
    'My goal is to keep learning in public, ship work I can stand behind, and write code that ' +
    'the next person can read without a map.',
  bio:
    'I am a software engineering technology student at Centennial College in Toronto, currently ' +
    'in my second year of the program. I started out building small static pages for friends and ' +
    'ended up hooked on the whole stack: layout, state, APIs, deployment and the debugging that ' +
    'happens in between. Most of my work is JavaScript, Node.js and Express, with React on the ' +
    'front end and MongoDB or PostgreSQL behind it. Outside of class I maintain a small study ' +
    'planner that a few dozen classmates actually use, which has taught me more about edge cases ' +
    'than any tutorial. I care about readable code, honest documentation and interfaces that work ' +
    'with a keyboard.',
};

// ---------------------------------------------------------------------------
// Projects (at least three, each with an image, role and outcome)
// ---------------------------------------------------------------------------
const projects = [
  {
    id: 'course-planner',
    title: 'Campus Course Planner',
    year: '2026',
    role: 'Full-stack developer (team of three)',
    stack: ['Node.js', 'Express', 'MongoDB', 'EJS'],
    image: '/images/project-planner.svg',
    imageAlt: 'Course Planner interface showing a weekly timetable with coloured course blocks',
    summary:
      'A planning tool that lets students build a conflict-free timetable before registration opens.',
    description:
      'I designed the data model and built the Express API that checks every proposed course ' +
      'against lecture and lab time slots. The planner highlights clashes before a student commits, ' +
      'and exports the final schedule as a calendar file.',
    outcome:
      'Adopted by roughly 200 students in its first term; timetable conflicts reported by testers ' +
      'dropped from 31% to 4% between the first and final prototype.',
  },
  {
    id: 'taskflow',
    title: 'TaskFlow Board',
    year: '2025',
    role: 'Front-end developer and UI designer',
    stack: ['JavaScript', 'HTML5', 'CSS Grid', 'localStorage'],
    image: '/images/project-taskflow.svg',
    imageAlt: 'TaskFlow kanban board with To Do, In Progress and Done columns',
    summary:
      'A keyboard-friendly kanban board that keeps working when the Wi-Fi does not.',
    description:
      'Drag-and-drop between columns is implemented with the native HTML drag events, and every ' +
      'change is persisted to localStorage so a refresh never loses work. Cards can be moved with ' +
      'the keyboard alone, which was the accessibility goal for the project.',
    outcome:
      'Passed an accessibility review with no critical issues and became the demo project I use ' +
      'when explaining state management to first-year students.',
  },
  {
    id: 'weather-dashboard',
    title: 'Weather Dashboard',
    year: '2025',
    role: 'Solo developer',
    stack: ['JavaScript', 'OpenWeather API', 'Chart.js'],
    image: '/images/project-weather.svg',
    imageAlt: 'Weather dashboard with current conditions and a seven day temperature chart',
    summary:
      'A single-page dashboard that turns a week of forecast data into one readable chart.',
    description:
      'The app geolocates the visitor, fetches current conditions and a seven-day forecast, then ' +
      'renders the temperature trend with Chart.js. Requests are cached for ten minutes so repeated ' +
      'lookups do not burn through the free API quota.',
    outcome:
      'Cut average load time to 0.9 seconds on a throttled 3G profile and reduced API calls by 60% ' +
      'through caching.',
  },
];

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------
const services = [
  {
    icon: 'code',
    title: 'Web Development',
    description:
      'Responsive marketing sites and web apps built with semantic HTML, modern CSS and vanilla ' +
      'JavaScript or React.',
    points: ['Responsive layouts', 'Accessibility checks', 'Performance budgets'],
  },
  {
    icon: 'server',
    title: 'Backend & APIs',
    description:
      'Express services with clean route structure, input validation and sensible error handling.',
    points: ['REST endpoints', 'Data modelling', 'Authentication basics'],
  },
  {
    icon: 'mobile',
    title: 'Mobile Apps',
    description:
      'Cross-platform prototypes with React Native, from first wireframe to a build you can install.',
    points: ['iOS and Android', 'Offline-first storage', 'Store-ready builds'],
  },
  {
    icon: 'spark',
    title: 'Code Review & Tutoring',
    description:
      'Readable feedback on student projects: structure, naming, comments and the small bugs that ' +
      'only show up in a demo.',
    points: ['Line-by-line review', 'Refactoring help', 'Debugging sessions'],
  },
];

// ---------------------------------------------------------------------------
// Home page highlights
// ---------------------------------------------------------------------------
const highlights = [
  { value: '3', label: 'Shipped projects' },
  { value: '2', label: 'Years writing code' },
  { value: '200+', label: 'Students using my planner' },
];

module.exports = { profile, projects, services, highlights };
