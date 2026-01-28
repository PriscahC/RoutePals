// data/routesData.js - Central data store for routes and commuter information

const routes = [
  {
    id: 1,
    name: 'CBD - Westlands',
    from: 'CBD',
    to: 'Westlands',
    fare: { min: 50, max: 80 },
    estimatedTime: { min: 20, max: 30 },
    distance: '8 km',
    vehicles: ['Matatu', 'Bus', 'Uber'],
    saccos: ['City Hoppa', 'Citi Shuttle', 'Double M'],
    landmarks: ['Kencom', 'Museum Hill', 'ABC Place', 'Westlands Roundabout'],
    peakHours: ['7:00-9:00', '17:00-19:00'],
    trafficStatus: 'moderate',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 2,
    name: 'CBD - Eastlands',
    from: 'CBD',
    to: 'Eastlands',
    fare: { min: 50, max: 70 },
    estimatedTime: { min: 30, max: 45 },
    distance: '12 km',
    vehicles: ['Matatu', 'Bus'],
    saccos: ['Super Metro', 'Citi Hoppa', 'KBS'],
    landmarks: ['Kencom', 'Globe Roundabout', 'Donholm', 'Buruburu'],
    peakHours: ['6:30-9:00', '17:00-19:30'],
    trafficStatus: 'heavy',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 3,
    name: 'CBD - South B/C',
    from: 'CBD',
    to: 'South B/C',
    fare: { min: 60, max: 100 },
    estimatedTime: { min: 25, max: 40 },
    distance: '10 km',
    vehicles: ['Matatu', 'Bus', 'Uber'],
    saccos: ['Compliant', 'Rembo', 'Embassava'],
    landmarks: ['Kencom', 'Bunyala Road', 'Industrial Area', 'Bellevue'],
    peakHours: ['7:00-9:00', '17:00-19:00'],
    trafficStatus: 'light',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 4,
    name: 'CBD - Ngong Road',
    from: 'CBD',
    to: 'Ngong Road',
    fare: { min: 50, max: 80 },
    estimatedTime: { min: 20, max: 35 },
    distance: '7 km',
    vehicles: ['Matatu', 'Bus'],
    saccos: ['Forward Travellers', 'Prestige', 'Ngong Road Matatus'],
    landmarks: ['Kencom', 'Railways', 'Ngong Road', 'Dagoretti Corner'],
    peakHours: ['7:00-9:00', '17:00-19:00'],
    trafficStatus: 'moderate',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 5,
    name: 'CBD - Thika Road',
    from: 'CBD',
    to: 'Thika Road',
    fare: { min: 50, max: 100 },
    estimatedTime: { min: 30, max: 60 },
    distance: '15 km',
    vehicles: ['Matatu', 'Bus'],
    saccos: ['Super Metro', 'Double M', 'Thika Road Matatus'],
    landmarks: ['Kencom', 'Kenyatta University', 'Kasarani', 'Thika'],
    peakHours: ['6:30-9:00', '17:00-19:30'],
    trafficStatus: 'heavy',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 6,
    name: 'CBD - Kibera',
    from: 'CBD',
    to: 'Kibera',
    fare: { min: 30, max: 50 },
    estimatedTime: { min: 15, max: 25 },
    distance: '5 km',
    vehicles: ['Matatu'],
    saccos: ['Kibera Shuttle', 'Forward'],
    landmarks: ['Kencom', 'Railways', 'Kibera Drive', 'Olympic'],
    peakHours: ['7:00-9:00', '17:00-19:00'],
    trafficStatus: 'light',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 7,
    name: 'CBD - Rongai',
    from: 'CBD',
    to: 'Rongai',
    fare: { min: 80, max: 120 },
    estimatedTime: { min: 40, max: 70 },
    distance: '20 km',
    vehicles: ['Matatu', 'Bus'],
    saccos: ['Super Metro', 'Prestige', 'Rongai Shuttle'],
    landmarks: ['Kencom', 'Bomas', 'Magadi Road', 'Rongai'],
    peakHours: ['6:00-9:00', '17:00-20:00'],
    trafficStatus: 'heavy',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 8,
    name: 'CBD - Kasarani',
    from: 'CBD',
    to: 'Kasarani',
    fare: { min: 60, max: 90 },
    estimatedTime: { min: 30, max: 50 },
    distance: '12 km',
    vehicles: ['Matatu', 'Bus'],
    saccos: ['Super Metro', 'Double M', 'Mwiki Sacco'],
    landmarks: ['Kencom', 'Pangani', 'Mwiki Road', 'Kasarani'],
    peakHours: ['7:00-9:00', '17:00-19:00'],
    trafficStatus: 'moderate',
    lastUpdated: new Date().toISOString()
  }
];

// Issues/Reports storage (in production, use a database)
let reports = [];
let reportIdCounter = 1;

// Traffic updates
const trafficUpdates = [
  {
    id: 1,
    route: 'Thika Road',
    status: 'heavy',
    description: 'Heavy traffic at Kasarani area',
    timestamp: new Date().toISOString()
  },
  {
    id: 2,
    route: 'Mombasa Road',
    status: 'moderate',
    description: 'Slow moving traffic near Industrial Area',
    timestamp: new Date().toISOString()
  },
  {
    id: 3,
    route: 'Ngong Road',
    status: 'light',
    description: 'Traffic flowing smoothly',
    timestamp: new Date().toISOString()
  }
];

// Statistics
const stats = {
  totalRoutes: routes.length,
  totalReports: 0,
  activeUsers: 0,
  averageRating: 4.2
};

module.exports = {
  routes,
  reports,
  reportIdCounter,
  trafficUpdates,
  stats
};
