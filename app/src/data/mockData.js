
export const users = [
  {
    id: 1,
    name: "Selena",
    email: "selena@gmail.com",
    password: "$2b$10$hashFicticioSelene2026",
    pin: "1800",
  },
];

export const cycles = [
  {
    id: 1,
    userId: 1,
    startDate: "2026-10-20",
    flow: "Moderado",
    mood: "Sensível",
    endDate: null,
  },
  {
    id: 2,
    userId: 1,
    startDate: "2026-09-22",
    flow: "Intenso",
    mood: "Com cólica",
    endDate: "2026-09-27",
  },
  {
    id: 3,
    userId: 1,
    startDate: "2026-08-25",
    flow: "Moderado",
    mood: "Sensível",
    endDate: "2026-08-29",
  },
  {
    id: 4,
    userId: 1,
    startDate: "2026-07-28",
    flow: "Leve",
    mood: "Bem",
    endDate: "2026-08-01",
  },
];

export const contacts = [
  {
    id: 1,
    userId: 1,
    name: "Mariana",
    phone: "43999123456",
  },
  {
    id: 2,
    userId: 1,
    name: "Mãe",
    phone: "43998765432",
  },
  {
    id: 3,
    userId: 1,
    name: "Camila",
    phone: "43997112233",
  },
];

export const emergencyChannels = [
  {
    id: "180",
    name: "Central da Mulher (Ligue 180)",
    phone: "180",
    description: "Atendimento 24h gratuito e confidencial",
  },
  {
    id: "190",
    name: "Polícia Militar (190)",
    phone: "190",
    description: "Emergência policial imediata",
  },
  {
    id: "deam",
    name: "Delegacia da Mulher — Londrina",
    phone: "4333221633",
    description: "Atendimento especializado e medida protetiva",
  },
];

export function findUserById(id = 1) {
  return users.find(user => user.id === id);
}

export function findCyclesByUserId(id = 1) {
  return cycles.filter(cycle => cycle.userId === id);
}

export function findContactsByUserId(id = 1) {
  return contacts.filter(contact => contact.userId === id);
}

export function calculatePeriodDays(startDate, endDate) {
  if (!endDate) return 1;

  const start = new Date(startDate);
  const end = new Date(endDate);
  const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  return Math.max(1, Math.round(days) + 1);
}

export function findCycleSummaryByUserId(id = 1) {
  const cycles = findCyclesByUserId(id);
  const currentCycle = cycles.find(cycle => !cycle.endDate) || cycles[0];
  const finishedCycles = cycles.filter(cycle => cycle.endDate);
  const totalDays = finishedCycles.reduce((acc, c) => acc + calculatePeriodDays(c.startDate, c.endDate), 0);
  const avgPeriodDays = finishedCycles.length > 0 ? Math.round(totalDays / finishedCycles.length) : 5;
  const predominantMood = calculateMoodModeByUserId(id);

  return {
    currentCycle,
    avgPeriodDays,
    predominantMood,
    totalCyclesRecorded: cycles.length,
  };
}

function calculateMoodModeByUserId(id = 1) {
  const cycles = findCyclesByUserId(id);
  const moodCount = {};

  let predominantMood = cycles.find(cycle => !cycle.endDate)?.mood ?? "Normal";
  let maxCount = 0;

  cycles.forEach(cycle => {
    if (moodCount[cycle.mood]) {
      moodCount[cycle.mood] = moodCount[cycle.mood] + 1;
    } else {
      moodCount[cycle.mood] = 1;
    }

    if (moodCount[cycle.mood] > maxCount) {
      maxCount = moodCount[cycle.mood];
      predominantMood = cycle.mood;
    }
  });

  return predominantMood;
}
