export const MAX_OPEN_PERIOD_DAYS = 7;

export const flowOptions = [
  { code: "LIGHT", description: "Leve" },
  { code: "MODERATE", description: "Moderado" },
  { code: "HEAVY", description: "Intenso" },
];

export const moodOptions = [
  { code: "WELL", description: "Bem" },
  { code: "SENSITIVE", description: "Sensível" },
  { code: "CRAMPS", description: "Com cólica" },
  { code: "TIRED", description: "Cansada" },
];

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
    startDate: "20/10/2026",
    flow: "Moderado",
    mood: "Sensível",
    endDate: null,
  },
  {
    id: 2,
    userId: 1,
    startDate: "22/09/2026",
    flow: "Intenso",
    mood: "Com cólica",
    endDate: "27/09/2026",
  },
  {
    id: 3,
    userId: 1,
    startDate: "25/08/2026",
    flow: "Moderado",
    mood: "Sensível",
    endDate: "29/08/2026",
  },
  {
    id: 4,
    userId: 1,
    startDate: "28/07/2026",
    flow: "Leve",
    mood: "Bem",
    endDate: "01/08/2026",
  },
  {
    id: 5,
    userId: 1,
    startDate: "30/06/2026",
    flow: "Moderado",
    mood: "Cansada",
    endDate: "04/07/2026",
  },
  {
    id: 6,
    userId: 1,
    startDate: "02/06/2026",
    flow: "Leve",
    mood: "Sensível",
    endDate: "06/06/2026",
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
];

export function formatPhone(value = "") {
  const digits = String(value).replace(/\D/g, "").slice(0, 11);
  if (digits.length === 0) return "";
  if (digits.length <= 2) return `(${digits}`;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
}

export function formatDateInput(value = "") {
  const digits = String(value).replace(/\D/g, "").slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4, 8)}`;
}

function parseBrDate(dateStr) {
  if (!dateStr) return null;
  const parts = dateStr.split("/");
  if (parts.length !== 3) return new Date(dateStr);
  return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
}

function formatBrDate(dateObj) {
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}

function addDaysToBrDate(dateStr, daysToAdd) {
  const date = parseBrDate(dateStr);
  date.setDate(date.getDate() + daysToAdd);
  return formatBrDate(date);
}

export function applyAutoCloseRule(id = 1, referenceDateStr = "22/10/2026") {
  const userCycles = cycles.filter((cycle) => cycle.userId === id);
  const referenceDate = parseBrDate(referenceDateStr);

  userCycles.forEach((cycle) => {
    if (!cycle.endDate) {
      const start = parseBrDate(cycle.startDate);
      const elapsedDays =
        Math.round((referenceDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

      if (elapsedDays > MAX_OPEN_PERIOD_DAYS) {
        cycle.endDate = addDaysToBrDate(cycle.startDate, MAX_OPEN_PERIOD_DAYS - 1);
      }
    }
  });
}

export function findUserById(id = 1) {
  return users.find((user) => user.id === id);
}

export function findCyclesByUserId(id = 1) {
  applyAutoCloseRule(id);
  return cycles.filter((cycle) => cycle.userId === id);
}

export function findOpenCycleByUserId(id = 1) {
  const userCycles = findCyclesByUserId(id);
  return userCycles.find((cycle) => !cycle.endDate) || null;
}

export function canOpenNewCycle(id = 1) {
  return findOpenCycleByUserId(id) === null;
}

export function closeCurrentCycle(id = 1, closeDateStr = "22/10/2026") {
  const openCycle = findOpenCycleByUserId(id);
  if (!openCycle) return null;
  openCycle.endDate = closeDateStr;
  return openCycle;
}

export function openNewCycle({ userId = 1, startDate = "22/10/2026", flowCode, moodCode }) {
  const flowDesc = flowOptions.find((f) => f.code === flowCode)?.description || "Moderado";
  const moodDesc = moodOptions.find((m) => m.code === moodCode)?.description || "Bem";

  const newCycle = {
    id: cycles.length + 1,
    userId,
    startDate: startDate || "22/10/2026",
    flow: flowDesc,
    mood: moodDesc,
    endDate: null,
  };

  cycles.unshift(newCycle);
  return newCycle;
}

export function findContactsByUserId(id = 1) {
  return contacts.filter((contact) => contact.userId === id);
}

export function calculatePeriodDays(startDate, endDate, referenceDateStr = "22/10/2026") {
  const start = parseBrDate(startDate);
  const end = endDate ? parseBrDate(endDate) : parseBrDate(referenceDateStr);
  const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);

  return Math.max(1, Math.round(days) + 1);
}

export function findCycleSummaryByUserId(id = 1) {
  const userCycles = findCyclesByUserId(id);
  const openCycle = findOpenCycleByUserId(id);
  const latestCycle = openCycle || userCycles[0];
  const finishedCycles = userCycles.filter((cycle) => cycle.endDate);
  const totalDays = finishedCycles.reduce(
    (acc, c) => acc + calculatePeriodDays(c.startDate, c.endDate),
    0
  );
  const avgPeriodDays =
    finishedCycles.length > 0 ? Math.round(totalDays / finishedCycles.length) : 5;
  const predominantMood = calculateMoodModeByUserId(id);
  const activeDayNumber = openCycle ? calculatePeriodDays(openCycle.startDate, null) : null;

  return {
    openCycle,
    currentCycle: latestCycle,
    activeDayNumber,
    avgPeriodDays,
    predominantMood,
    totalCyclesRecorded: userCycles.length,
  };
}

function calculateMoodModeByUserId(id = 1) {
  const userCycles = findCyclesByUserId(id);
  const moodCount = {};

  let predominantMood = userCycles.find((cycle) => !cycle.endDate)?.mood ?? "Normal";
  let maxCount = 0;

  userCycles.forEach((cycle) => {
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
