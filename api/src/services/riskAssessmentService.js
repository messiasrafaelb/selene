import { userRepository } from "../repositories/userRepository.js";
import { cycleRepository } from "../repositories/cycleRepository.js";
import { contactRepository } from "../repositories/contactRepository.js";

export const ACADEMIC_DISCLAIMER =
  "Estimativa estatística acadêmica (modelo Regressão Logística sobre base sintética inspirada no Ligue 180/ONDH). Não substitui avaliação profissional, policial ou jurídica. Em emergência, ligue 190 ou 180.";

export const riskAssessmentService = {
  calculateRepetitionRisk(input = {}) {
    const vinculo = input.vinculoAutor || "Conhecido";
    const tipo = input.tipoViolencia || "Psicológica";
    const local = input.localOcorrencia || "Residência";
    const dias = Number.isFinite(Number(input.diasAteNotificacao))
      ? Math.max(0, Number(input.diasAteNotificacao))
      : 5;

    let logit = -1.65;

    if (vinculo === "Parceiro atual") logit += 1.35;
    else if (vinculo === "Ex-parceiro") logit += 1.15;
    else if (vinculo === "Familiar") logit += 0.45;
    else if (vinculo === "Desconhecido") logit -= 0.45;
    else logit -= 0.65;

    if (local === "Residência") logit += 0.55;
    else if (local === "Ambiente virtual") logit -= 0.25;
    else logit -= 0.15;

    if (tipo === "Sexual" || tipo === "Física") logit += 0.35;
    else if (tipo === "Patrimonial" || tipo === "Psicológica") logit += 0.15;

    logit += Math.min(dias, 90) * 0.042;

    const rawProbability = 1 / (1 + Math.exp(-logit));
    const probabilidadeRisco = Number(rawProbability.toFixed(2));

    let riscoRepeticao = "Baixo";
    if (probabilidadeRisco >= 0.65) {
      riscoRepeticao = "Alto";
    } else if (probabilidadeRisco >= 0.35) {
      riscoRepeticao = "Médio";
    }

    return {
      vinculoAutor: vinculo,
      tipoViolencia: tipo,
      localOcorrencia: local,
      diasAteNotificacao: dias,
      probabilidadeRisco,
      riscoRepeticao,
    };
  },

  evaluateAndPersist(payload = {}) {
    const assessment = this.calculateRepetitionRisk(payload);
    if (payload.cycleId !== undefined && payload.cycleId !== null) {
      const existing = cycleRepository.findById(payload.cycleId);
      if (existing) {
        cycleRepository.update(existing.id, assessment);
      }
    }

    return {
      ...assessment,
      modelo: "Regressão Logística (Validação Cruzada 5 Folds · ROC-AUC 0.805)",
      avisoAcademico: ACADEMIC_DISCLAIMER,
    };
  },

  buildDashboard(userId) {
    const users = userRepository.findAll();
    const cycles =
      userId !== undefined
        ? cycleRepository.findByUserId(userId)
        : cycleRepository.findAll();
    const contacts =
      userId !== undefined
        ? contactRepository.findByUserId(userId)
        : contactRepository.findAll();

    const latestCycle = cycles[0] || null;
    const openCycle = cycles.find((cycle) => !cycle.endDate) || null;

    const distribuicaoRisco = {
      Baixo: cycles.filter((c) => c.riscoRepeticao === "Baixo").length,
      Médio: cycles.filter((c) => c.riscoRepeticao === "Médio").length,
      Alto: cycles.filter((c) => c.riscoRepeticao === "Alto").length,
    };

    return {
      totalUsuarios: users.length,
      totalCiclos: cycles.length,
      totalContatos: contacts.length,
      possuiCicloAberto: Boolean(openCycle),
      indicadorRecente: latestCycle
        ? {
            cycleId: latestCycle.id,
            startDate: latestCycle.startDate,
            riscoRepeticao: latestCycle.riscoRepeticao || "Baixo",
            probabilidadeRisco: latestCycle.probabilidadeRisco ?? 0.1,
            vinculoAutor: latestCycle.vinculoAutor || "Conhecido",
            tipoViolencia: latestCycle.tipoViolencia || "Moral",
            localOcorrencia: latestCycle.localOcorrencia || "Ambiente virtual",
            diasAteNotificacao: latestCycle.diasAteNotificacao ?? 3,
          }
        : {
            riscoRepeticao: "Baixo",
            probabilidadeRisco: 0.1,
          },
      distribuicaoRisco,
      canaisOficiais: [
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
      ],
      atualizadoEm: new Date().toLocaleTimeString("pt-BR"),
      avisoAcademico: ACADEMIC_DISCLAIMER,
    };
  },
};
