import { AppError } from "../errors/AppError.js";
import { userRepository } from "../repositories/userRepository.js";
import { cycleRepository } from "../repositories/cycleRepository.js";
import { riskAssessmentService } from "./riskAssessmentService.js";

const MAX_OPEN_PERIOD_DAYS = 7;
const DEFAULT_REFERENCE_DATE = "22/10/2026";
const ALLOWED_FLOWS = ["Leve", "Moderado", "Intenso"];
const ALLOWED_MOODS = [
  "Bem",
  "Sensível",
  "Com cólica",
  "Cansada",
  "Estável",
  "Ansiosa",
  "Bem-disposta",
];

function parseDate(dateStr) {
  if (!dateStr) return null;
  const text = String(dateStr).trim();
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(text)) {
    const [day, month, year] = text.split("/").map(Number);
    return new Date(year, month - 1, day);
  }
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const [year, month, day] = text.split("-").map(Number);
    return new Date(year, month - 1, day);
  }
  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

function formatBrDate(dateObj) {
  const day = String(dateObj.getDate()).padStart(2, "0");
  const month = String(dateObj.getMonth() + 1).padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
}

function addDaysToBrDate(dateStr, daysToAdd) {
  const date = parseDate(dateStr);
  if (!date) return dateStr;
  date.setDate(date.getDate() + daysToAdd);
  return formatBrDate(date);
}

export const cycleService = {
  applyAutoCloseRule(referenceDateStr = DEFAULT_REFERENCE_DATE) {
    const cycles = cycleRepository.findAll();
    const referenceDate = parseDate(referenceDateStr) || new Date();
    let modified = false;

    const updated = cycles.map((cycle) => {
      if (cycle.endDate) return cycle;
      const start = parseDate(cycle.startDate);
      if (!start) return cycle;
      const elapsedDays =
        Math.round((referenceDate.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
      if (elapsedDays > MAX_OPEN_PERIOD_DAYS) {
        modified = true;
        return {
          ...cycle,
          endDate: addDaysToBrDate(cycle.startDate, MAX_OPEN_PERIOD_DAYS - 1),
        };
      }
      return cycle;
    });

    if (modified) {
      cycleRepository.saveAll(updated);
    }
    return updated;
  },

  validatePayload(payload = {}, ignoredId = null) {
    const flow = payload.flow || payload.flowLevel;
    if (!payload.userId || !payload.startDate || !flow || !payload.mood) {
      throw new AppError(
        "Informe userId, data de início, intensidade do fluxo e humor.",
        400
      );
    }

    const userExists = userRepository.findById(payload.userId);
    if (!userExists) {
      throw new AppError(
        "A usuária informada em userId não existe na base de dados.",
        400
      );
    }

    const startDateObj = parseDate(payload.startDate);
    if (!startDateObj) {
      throw new AppError("Informe uma data de início válida (DD/MM/AAAA).", 400);
    }

    if (payload.endDate) {
      const endDateObj = parseDate(payload.endDate);
      if (!endDateObj) {
        throw new AppError("Informe uma data de término válida (DD/MM/AAAA).", 400);
      }
      if (endDateObj < startDateObj) {
        throw new AppError(
          "A data de término não pode ser anterior à data de início.",
          400
        );
      }
    }

    if (!ALLOWED_FLOWS.includes(flow)) {
      throw new AppError(
        "Intensidade de fluxo inválida (use Leve, Moderado ou Intenso).",
        400
      );
    }

    if (!ALLOWED_MOODS.includes(payload.mood)) {
      throw new AppError("Humor inválido.", 400);
    }

    const cycles = this.applyAutoCloseRule();
    if (!payload.endDate) {
      const openCycle = cycles.find(
        (c) =>
          String(c.userId) === String(payload.userId) &&
          !c.endDate &&
          String(c.id) !== String(ignoredId)
      );
      if (openCycle) {
        throw new AppError(
          "Você não pode iniciar um novo ciclo enquanto houver um ciclo em aberto.",
          400
        );
      }
    }
  },

  list(userId) {
    const cycles = this.applyAutoCloseRule();
    if (userId !== undefined) {
      return cycles.filter((cycle) => String(cycle.userId) === String(userId));
    }
    return cycles;
  },

  getById(id) {
    this.applyAutoCloseRule();
    const cycle = cycleRepository.findById(id);
    if (!cycle) {
      throw new AppError("Ciclo não encontrado.", 404);
    }
    return cycle;
  },

  create(payload = {}) {
    this.validatePayload(payload, null);
    const assessment = riskAssessmentService.calculateRepetitionRisk(payload);
    const flow = payload.flow || payload.flowLevel || "Moderado";

    return cycleRepository.create({
      userId: Number(payload.userId) || payload.userId,
      startDate: String(payload.startDate).trim(),
      endDate: payload.endDate ? String(payload.endDate).trim() : null,
      flow,
      mood: payload.mood,
      vinculoAutor: assessment.vinculoAutor,
      tipoViolencia: assessment.tipoViolencia,
      localOcorrencia: assessment.localOcorrencia,
      diasAteNotificacao: assessment.diasAteNotificacao,
      probabilidadeRisco: payload.probabilidadeRisco ?? assessment.probabilidadeRisco,
      riscoRepeticao: payload.riscoRepeticao || assessment.riscoRepeticao,
    });
  },

  update(id, payload = {}) {
    const current = this.getById(id);
    const merged = {
      ...current,
      ...payload,
      flow: payload.flow || payload.flowLevel || current.flow,
    };

    this.validatePayload(merged, current.id);

    if (
      payload.vinculoAutor !== undefined ||
      payload.tipoViolencia !== undefined ||
      payload.localOcorrencia !== undefined ||
      payload.diasAteNotificacao !== undefined
    ) {
      const assessment = riskAssessmentService.calculateRepetitionRisk(merged);
      Object.assign(merged, assessment);
    }

    return cycleRepository.update(id, merged);
  },

  remove(id) {
    this.getById(id);
    const removed = cycleRepository.remove(id);
    return {
      mensagem: "Registro removido com sucesso.",
      removido: removed,
    };
  },
};
