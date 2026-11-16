import { useState, useEffect, useCallback } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  listar,
  atualizar,
  remover,
  summarizeCycles,
  calculatePeriodDays,
} from "../../services/api";

const PAGE_SIZE = 3;
const SEQUENCIA_FLUXO = ["Leve", "Moderado", "Intenso"];

export default function CycleHistoryScreen({ navigation, currentUser }) {
  const userId = currentUser?.id || 1;
  const [userCycles, setUserCycles] = useState([]);
  const [page, setPage] = useState(1);
  const [warningMessage, setWarningMessage] = useState("");

  const carregarCiclos = useCallback(async () => {
    try {
      const lista = await listar("cycles", userId);
      setUserCycles(Array.isArray(lista) ? lista : []);
    } catch (erro) {
      setWarningMessage("Não foi possível carregar os ciclos da API (http://localhost:3333).");
    }
  }, [userId]);

  useEffect(() => {
    carregarCiclos();
    if (!navigation?.addListener) return;
    const unsubscribe = navigation.addListener("focus", () => {
      setWarningMessage("");
      carregarCiclos();
    });
    return unsubscribe;
  }, [navigation, carregarCiclos]);

  const summary = summarizeCycles(userCycles);
  const totalPages = Math.max(1, Math.ceil(userCycles.length / PAGE_SIZE));
  const paginaSegura = Math.min(page, totalPages);
  const startIndex = (paginaSegura - 1) * PAGE_SIZE;
  const paginatedCycles = userCycles.slice(startIndex, startIndex + PAGE_SIZE);

  function handlePressNewCycle() {
    if (summary.openCycle) {
      setWarningMessage("Você não pode iniciar um novo ciclo enquanto houver um ciclo em aberto.");
      return;
    }
    setWarningMessage("");
    navigation.navigate("NewCycle");
  }

  async function handleAlternarFluxoOuEncerrar(item) {
    try {
      setWarningMessage("");
      if (!item.endDate) {
        await atualizar("cycles", item.id, { endDate: "22/10/2026" });
      } else {
        const atualIdx = SEQUENCIA_FLUXO.indexOf(item.flow);
        const proximoFluxo = SEQUENCIA_FLUXO[(atualIdx + 1) % SEQUENCIA_FLUXO.length];
        await atualizar("cycles", item.id, { flow: proximoFluxo });
      }
      await carregarCiclos();
    } catch (erro) {
      setWarningMessage(erro.message || "Falha ao atualizar o ciclo na API.");
    }
  }

  async function handleRemoverCiclo(id) {
    try {
      setWarningMessage("");
      await remover("cycles", id);
      await carregarCiclos();
    } catch (erro) {
      setWarningMessage(erro.message || "Falha ao excluir o ciclo na API.");
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryCard}>
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary.avgPeriodDays} dias</Text>
          <Text style={styles.summaryLabel}>Média dos períodos</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary.predominantMood}</Text>
          <Text style={styles.summaryLabel}>Humor frequente</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryItem}>
          <Text style={styles.summaryValue}>{summary.totalCyclesRecorded}</Text>
          <Text style={styles.summaryLabel}>Registros</Text>
        </View>
      </View>

      {Boolean(warningMessage) && (
        <View style={styles.warningBanner}>
          <Ionicons name="warning" size={20} color="#B26A00" />
          <Text style={styles.warningText}>{warningMessage}</Text>
          <TouchableOpacity onPress={() => setWarningMessage("")}>
            <Ionicons name="close" size={18} color="#B26A00" />
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        data={paginatedCycles}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => {
          const isCurrent = !item.endDate;
          const duration = calculatePeriodDays(item.startDate, item.endDate);

          return (
            <TouchableOpacity
              style={styles.card}
              onPress={() => handleAlternarFluxoOuEncerrar(item)}
              onLongPress={() => handleRemoverCiclo(item.id)}
              activeOpacity={0.88}
            >
              <View style={styles.cardHeader}>
                <View style={styles.dateRow}>
                  <Ionicons name="calendar" size={18} color="#EC5F7B" />
                  <Text style={styles.dateText}>
                    {item.startDate} {item.endDate ? `até ${item.endDate}` : "— Em aberto"}
                  </Text>
                </View>
                <View style={[styles.badge, isCurrent ? styles.badgeActive : styles.badgeClosed]}>
                  <Text style={[styles.badgeText, isCurrent && styles.badgeTextActive]}>
                    {isCurrent ? `Dia ${duration} (Aberto)` : `${duration} dias`}
                  </Text>
                </View>
              </View>

              <View style={styles.cardFooterRow}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoText}>Fluxo: {item.flow}</Text>
                  <Text style={styles.infoTextSeparator}>·</Text>
                  <Text style={styles.infoText}>Humor: {item.mood}</Text>
                </View>

                <View style={styles.crudButtonsRow}>
                  <TouchableOpacity
                    style={styles.updateChip}
                    onPress={() => handleAlternarFluxoOuEncerrar(item)}
                  >
                    <Ionicons name="create-outline" size={14} color="#EC5F7B" />
                    <Text style={styles.updateChipText}>
                      {isCurrent ? "Encerrar" : "Fluxo"}
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteChip}
                    onPress={() => handleRemoverCiclo(item.id)}
                  >
                    <Ionicons name="trash-outline" size={14} color="#C0392B" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        }}
        ListFooterComponent={
          <View style={styles.paginationRow}>
            <TouchableOpacity
              style={[styles.pageButton, paginaSegura === 1 && styles.pageButtonDisabled]}
              disabled={paginaSegura === 1}
              onPress={() => setPage(paginaSegura - 1)}
            >
              <Ionicons
                name="chevron-back"
                size={16}
                color={paginaSegura === 1 ? "#C8A6B0" : "#EC5F7B"}
              />
              <Text
                style={[
                  styles.pageButtonText,
                  paginaSegura === 1 && styles.pageButtonTextDisabled,
                ]}
              >
                Anterior
              </Text>
            </TouchableOpacity>

            <Text style={styles.pageIndicator}>
              Página {paginaSegura} de {totalPages}
            </Text>

            <TouchableOpacity
              style={[
                styles.pageButton,
                paginaSegura === totalPages && styles.pageButtonDisabled,
              ]}
              disabled={paginaSegura === totalPages}
              onPress={() => setPage(paginaSegura + 1)}
            >
              <Text
                style={[
                  styles.pageButtonText,
                  paginaSegura === totalPages && styles.pageButtonTextDisabled,
                ]}
              >
                Próxima
              </Text>
              <Ionicons
                name="chevron-forward"
                size={16}
                color={paginaSegura === totalPages ? "#C8A6B0" : "#EC5F7B"}
              />
            </TouchableOpacity>
          </View>
        }
      />

      <TouchableOpacity
        style={styles.newButton}
        onPress={handlePressNewCycle}
        activeOpacity={0.85}
      >
        <Text style={styles.newButtonText}>+ Iniciar Ciclo</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
  },
  summaryCard: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 20,
    marginTop: 16,
    paddingVertical: 18,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FAD2DC",
  },
  summaryItem: {
    alignItems: "center",
  },
  summaryValue: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#EC5F7B",
  },
  summaryLabel: {
    fontSize: 12,
    color: "#8E5B6B",
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 32,
    backgroundColor: "#FAD2DC",
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    borderWidth: 1,
    borderColor: "#FFB300",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginHorizontal: 20,
    marginTop: 12,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#8D5300",
    marginHorizontal: 10,
  },
  list: {
    padding: 20,
    paddingBottom: 110,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#FAD2DC",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4A1D2C",
    marginLeft: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeActive: {
    backgroundColor: "#EC5F7B",
  },
  badgeClosed: {
    backgroundColor: "#FCE4EC",
  },
  badgeText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#EC5F7B",
  },
  badgeTextActive: {
    color: "#FFFFFF",
  },
  cardFooterRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  infoText: {
    fontSize: 13,
    color: "#8E5B6B",
  },
  infoTextSeparator: {
    fontSize: 13,
    color: "#C8A6B0",
    marginHorizontal: 6,
  },
  crudButtonsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  updateChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F4",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F48FB1",
    marginRight: 6,
  },
  updateChipText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#EC5F7B",
    marginLeft: 4,
  },
  deleteChip: {
    backgroundColor: "#FDEDEC",
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F5B7B1",
  },
  paginationRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    paddingHorizontal: 4,
  },
  pageButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F48FB1",
  },
  pageButtonDisabled: {
    borderColor: "#E8D5DC",
    backgroundColor: "#FAF0F3",
  },
  pageButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EC5F7B",
    marginHorizontal: 4,
  },
  pageButtonTextDisabled: {
    color: "#C8A6B0",
  },
  pageIndicator: {
    fontSize: 13,
    fontWeight: "600",
    color: "#8E5B6B",
  },
  newButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#EC5F7B",
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: "center",
  },
  newButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});
