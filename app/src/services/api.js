export const URL_BASE = "http://localhost:3333";

export const MAX_OPEN_PERIOD_DAYS = 7;

let authToken = null;

export function setAuthToken(token) {
  authToken = token || null;
}

export function getAuthToken() {
  return authToken;
}

export function clearAuthToken() {
  authToken = null;
}

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

export const AVISO_ACADEMICO =
  "Estimativa estatística acadêmica (modelo Regressão Logística sobre base sintética inspirada no Ligue 180/ONDH). Não substitui avaliação profissional, policial ou jurídica. Em emergência, ligue 190 ou 180.";

async function requisitar(caminho, opcoes = {}) {
  const headers = {
    "Content-Type": "application/json",
    ...(opcoes.headers || {}),
  };

  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const resposta = await fetch(`${URL_BASE}${caminho}`, {
    ...opcoes,
    headers,
  });

  const corpo = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(corpo.erro || `Erro HTTP ${resposta.status}`);
  }
  return corpo;
}

export function listar(recurso, userId) {
  const sufixo = userId !== undefined ? `?userId=${encodeURIComponent(userId)}` : "";
  return requisitar(`/${recurso}${sufixo}`);
}

export function buscarPorId(recurso, id) {
  return requisitar(`/${recurso}/${id}`);
}

export function criar(recurso, dados) {
  return requisitar(`/${recurso}`, {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

export function atualizar(recurso, id, dados) {
  return requisitar(`/${recurso}/${id}`, {
    method: "PUT",
    body: JSON.stringify(dados),
  });
}

export function remover(recurso, id) {
  return requisitar(`/${recurso}/${id}`, {
    method: "DELETE",
  });
}

export async function loginUserApi({ email = "", password = "" }) {
  const resposta = await requisitar("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  if (resposta.token) {
    setAuthToken(resposta.token);
  }
  return resposta.user || resposta;
}

export async function registerUserApi({ name = "", email = "", password = "", pin = "" }) {
  const resposta = await requisitar("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, pin }),
  });
  if (resposta.token) {
    setAuthToken(resposta.token);
  }
  return resposta.user || resposta;
}

export function resetPasswordApi({ email = "", pin = "", newPassword = "" }) {
  return requisitar("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify({ email, pin, newPassword }),
  });
}

export function buscarPainel(userId = 1) {
  return requisitar(`/painel/${userId}`);
}

export function avaliarRiscoApi(dados) {
  return requisitar("/avaliacao-risco", {
    method: "POST",
    body: JSON.stringify(dados),
  });
}

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

export function parseBrDate(dateStr) {
  if (!dateStr) return null;
  const parts = String(dateStr).split("/");
  if (parts.length !== 3) return new Date(dateStr);
  return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
}

export function calculatePeriodDays(startDate, endDate, referenceDateStr = "22/10/2026") {
  const start = parseBrDate(startDate);
  const end = endDate ? parseBrDate(endDate) : parseBrDate(referenceDateStr);
  if (!start || !end) return 1;
  const days = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
  return Math.max(1, Math.round(days) + 1);
}

export function summarizeCycles(userCycles = []) {
  const openCycle = userCycles.find((cycle) => !cycle.endDate) || null;
  const latestCycle = openCycle || userCycles[0] || {
    flow: "Moderado",
    mood: "Sensível",
    riscoRepeticao: "Baixo",
    probabilidadeRisco: 0.1,
  };
  const finishedCycles = userCycles.filter((cycle) => cycle.endDate);
  const totalDays = finishedCycles.reduce(
    (acc, c) => acc + calculatePeriodDays(c.startDate, c.endDate),
    0
  );
  const avgPeriodDays =
    finishedCycles.length > 0 ? Math.round(totalDays / finishedCycles.length) : 5;

  const moodCount = {};
  let predominantMood = openCycle?.mood || userCycles[0]?.mood || "Sensível";
  let maxCount = 0;

  userCycles.forEach((cycle) => {
    const m = cycle.mood || "Sensível";
    moodCount[m] = (moodCount[m] || 0) + 1;
    if (moodCount[m] > maxCount) {
      maxCount = moodCount[m];
      predominantMood = m;
    }
  });

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
