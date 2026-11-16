import React, { useState, useEffect, useCallback } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  StyleSheet,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  buscarPorId,
  listar,
  atualizar,
  remover,
  summarizeCycles,
  parseBrDate,
} from "../../services/api";

const WEEK_DAYS = [
  { id: "1", label: "S", day: "19", active: false, period: false },
  { id: "2", label: "T", day: "20", active: false, period: true },
  { id: "3", label: "Q", day: "21", active: false, period: true },
  { id: "4", label: "Q", day: "22", active: true, period: true },
  { id: "5", label: "S", day: "23", active: false, period: true },
  { id: "6", label: "S", day: "24", active: false, period: true },
  { id: "7", label: "D", day: "25", active: false, period: false },
];

const CALENDAR_HEADERS = ["D", "S", "T", "Q", "Q", "S", "S"];

const MONTH_NAMES = [
  "Janeiro",
  "Fevereiro",
  "Março",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];

function isDateInCycle(year, monthIndex, dayNumber, userCycles) {
  const target = new Date(year, monthIndex, dayNumber);

  return userCycles.some((cycle) => {
    const start = parseBrDate(cycle.startDate);
    const end = cycle.endDate ? parseBrDate(cycle.endDate) : new Date(2026, 9, 24);
    if (!start || !end) return false;
    return target >= start && target <= end;
  });
}

export default function CycleHomeScreen({
  navigation,
  currentUser,
  onEnterEmergency,
  onLogout,
}) {
  const userId = currentUser?.id || 1;
  const [user, setUser] = useState(
    currentUser || { id: 1, name: "Selena", email: "selena@gmail.com", pin: "1800" }
  );
  const [userCycles, setUserCycles] = useState([]);
  const [apiError, setApiError] = useState("");
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinError, setPinError] = useState("");
  const [pinInput, setPinInput] = useState("");

  const [accountModalVisible, setAccountModalVisible] = useState(false);
  const [editNameInput, setEditNameInput] = useState("");
  const [deletePinInput, setDeletePinInput] = useState("");
  const [accountError, setAccountError] = useState("");

  const [calendarModalVisible, setCalendarModalVisible] = useState(false);
  const [calendarYear, setCalendarYear] = useState(2026);
  const [calendarMonth, setCalendarMonth] = useState(9);

  const carregarDados = useCallback(async () => {
    try {
      setApiError("");
      const [usuariaApi, ciclosApi] = await Promise.all([
        buscarPorId("users", userId),
        listar("cycles", userId),
      ]);
      if (usuariaApi) {
        setUser(usuariaApi);
        setEditNameInput(usuariaApi.name || "");
      }
      setUserCycles(Array.isArray(ciclosApi) ? ciclosApi : []);
    } catch (erro) {
      setApiError("Não foi possível carregar os dados da API (http://localhost:3333).");
    }
  }, [userId]);

  useEffect(() => {
    carregarDados();
    if (!navigation?.addListener) return;
    const unsubscribe = navigation.addListener("focus", () => {
      carregarDados();
    });
    return unsubscribe;
  }, [navigation, carregarDados]);

  const summary = summarizeCycles(userCycles);
  const hasOpenCycle = Boolean(summary.openCycle);

  const firstWeekdayOfMonth = new Date(calendarYear, calendarMonth, 1).getDay();
  const totalDaysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  const emptySlots = Array.from({ length: firstWeekdayOfMonth }, (_, i) => i);
  const monthDays = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  function handlePrevMonth() {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear((prev) => prev - 1);
    } else {
      setCalendarMonth((prev) => prev - 1);
    }
  }

  function handleNextMonth() {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear((prev) => prev + 1);
    } else {
      setCalendarMonth((prev) => prev + 1);
    }
  }

  function handleConfirmPin() {
    const pinEsperado = String(user?.pin || "1800");
    if (pinInput !== pinEsperado) {
      setPinError(`PIN incorreto. Digite o PIN de 4 dígitos da conta.`);
      return;
    }
    setPinError("");
    setPinModalVisible(false);
    setPinInput("");
    if (onEnterEmergency) {
      onEnterEmergency();
    }
  }

  async function handleClosePeriod() {
    if (!summary.openCycle) return;
    try {
      await atualizar("cycles", summary.openCycle.id, {
        endDate: "22/10/2026",
      });
      await carregarDados();
    } catch (erro) {
      setApiError(erro.message || "Falha ao encerrar o ciclo na API.");
    }
  }

  async function handleUpdateUserName() {
    const nomeLimpo = String(editNameInput || "").trim();
    if (!nomeLimpo) {
      setAccountError("Informe um nome válido para atualizar seu perfil.");
      return;
    }
    try {
      setAccountError("");
      const atualizada = await atualizar("users", user.id, { name: nomeLimpo });
      setUser(atualizada);
      setAccountModalVisible(false);
    } catch (erro) {
      setAccountError(erro.message || "Falha ao atualizar perfil na API.");
    }
  }

  async function handleDeleteAccountWithPin() {
    const pinEsperado = String(user?.pin || "1800");
    if (deletePinInput !== pinEsperado) {
      setAccountError("PIN incorreto. Digite seu PIN de 4 dígitos para apagar a conta.");
      return;
    }
    try {
      setAccountError("");
      await remover("users", user.id);
      setAccountModalVisible(false);
      setDeletePinInput("");
      if (onLogout) {
        onLogout();
      }
    } catch (erro) {
      setAccountError(erro.message || "Falha ao excluir a conta na API.");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.profileGreetingRow}
            onPress={() => {
              setAccountError("");
              setDeletePinInput("");
              setEditNameInput(user.name || "");
              setAccountModalVisible(true);
            }}
            activeOpacity={0.75}
          >
            <Text style={styles.greeting}>Olá, {user.name}</Text>
            <Ionicons name="settings-outline" size={16} color="#EC5F7B" style={styles.settingsIcon} />
          </TouchableOpacity>

          <View style={styles.topActions}>
            <TouchableOpacity
              style={styles.monthRow}
              onPress={() => setCalendarModalVisible(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="calendar-outline" size={18} color="#EC5F7B" />
              <Text style={styles.monthText}>{MONTH_NAMES[calendarMonth]}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.logoutButton}
              onPress={onLogout}
              activeOpacity={0.8}
            >
              <Ionicons name="log-out-outline" size={18} color="#EC5F7B" />
              <Text style={styles.logoutText}>Sair</Text>
            </TouchableOpacity>
          </View>
        </View>

        {Boolean(apiError) && (
          <View style={styles.warningBanner}>
            <Ionicons name="warning" size={18} color="#B26A00" />
            <Text style={styles.warningText}>{apiError}</Text>
          </View>
        )}

        <View style={styles.weekStrip}>
          {WEEK_DAYS.map((item) => (
            <View key={item.id} style={styles.dayColumn}>
              <Text style={styles.dayLetter}>{item.label}</Text>
              <View style={[styles.dayBubble, item.active && styles.dayBubbleActive]}>
                <Text
                  style={[
                    styles.dayNumber,
                    item.period && styles.dayNumberPeriod,
                    item.active && styles.dayNumberActive,
                  ]}
                >
                  {item.day}
                </Text>
              </View>
              {item.active && <View style={styles.activeDot} />}
            </View>
          ))}
        </View>

        <View style={styles.circleWrapper}>
          <View style={styles.mainCircle}>
            <Text style={styles.circlePhase}>
              {hasOpenCycle ? "Ciclo atual" : "Fase regular"}
            </Text>
            <Text style={styles.circleDay}>
              {hasOpenCycle ? `Dia ${summary.activeDayNumber}` : "Sem Fluxo"}
            </Text>

            {hasOpenCycle ? (
              <TouchableOpacity
                style={styles.editDatesButton}
                onPress={handleClosePeriod}
                activeOpacity={0.85}
              >
                <Text style={styles.editDatesText}>Encerrar Ciclo</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.editDatesButton}
                onPress={() => navigation?.navigate("NewCycle")}
                activeOpacity={0.85}
              >
                <Text style={styles.editDatesText}>Iniciar Ciclo</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={styles.infoCardsRow}>
          <View style={styles.statusCardLight}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.iconCircleSoft}>
                <Ionicons name="water" size={18} color="#EC5F7B" />
              </View>
              <Text style={styles.cardTagLight}>
                {hasOpenCycle ? "Ciclo Atual" : "Último Ciclo"}
              </Text>
            </View>

            <View>
              <Text style={styles.statusMainLabel}>Fluxo {summary.currentCycle.flow}</Text>
              <Text style={styles.statusSubLabel}>
                Humor: {summary.currentCycle.mood}
              </Text>
            </View>
          </View>

          <View style={styles.statusCardLight}>
            <View style={styles.cardHeaderRow}>
              <View style={styles.iconCircleSoft}>
                <Ionicons name="heart" size={18} color="#EC5F7B" />
              </View>
              <Text style={styles.cardTagLight}>Humor Frequente</Text>
            </View>

            <View>
              <Text style={styles.statusMainLabel}>{summary.predominantMood}</Text>
              <Text style={styles.statusSubLabel}>
                Em {summary.totalCyclesRecorded} ciclos registrados
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.secretLogoButton}
        delayLongPress={5000}
        onLongPress={() => {
          setPinError("");
          setPinInput("");
          setPinModalVisible(true);
        }}
        activeOpacity={0.9}
      >
        <Ionicons name="moon" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      <Modal
        visible={calendarModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setCalendarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.calendarSheet}>
            <View style={styles.sheetHandle} />

            <View style={styles.calendarNavRow}>
              <TouchableOpacity
                style={styles.monthNavButton}
                onPress={handlePrevMonth}
                activeOpacity={0.75}
              >
                <Ionicons name="chevron-back" size={20} color="#EC5F7B" />
              </TouchableOpacity>

              <View style={styles.calendarTitleRow}>
                <Ionicons name="calendar" size={18} color="#EC5F7B" />
                <Text style={styles.calendarTitle}>
                  {MONTH_NAMES[calendarMonth]} {calendarYear}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.monthNavButton}
                onPress={handleNextMonth}
                activeOpacity={0.75}
              >
                <Ionicons name="chevron-forward" size={20} color="#EC5F7B" />
              </TouchableOpacity>
            </View>

            <View style={styles.calendarWeekRow}>
              {CALENDAR_HEADERS.map((letter, idx) => (
                <Text key={idx} style={styles.calendarWeekLetter}>
                  {letter}
                </Text>
              ))}
            </View>

            <View style={styles.calendarGrid}>
              {emptySlots.map((slot) => (
                <View key={`empty-${slot}`} style={styles.calendarCell} />
              ))}

              {monthDays.map((day) => {
                const inCycle = isDateInCycle(calendarYear, calendarMonth, day, userCycles);
                const isToday = calendarYear === 2026 && calendarMonth === 9 && day === 22;

                return (
                  <View key={day} style={styles.calendarCell}>
                    <View
                      style={[
                        styles.calendarDayCircle,
                        inCycle ? styles.calendarDayCycle : styles.calendarDayNeutral,
                        isToday && styles.calendarDayToday,
                      ]}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          inCycle && styles.calendarDayTextCycle,
                        ]}
                      >
                        {day}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View style={styles.legendRow}>
              <View style={styles.legendItem}>
                <View style={styles.legendDotCycle} />
                <Text style={styles.legendLabel}>Dias de ciclo</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.legendDotNeutral} />
                <Text style={styles.legendLabel}>Fase regular</Text>
              </View>
            </View>

            <TouchableOpacity
              style={styles.closeCalendarButton}
              onPress={() => setCalendarModalVisible(false)}
              activeOpacity={0.85}
            >
              <Text style={styles.closeCalendarText}>Fechar Calendário</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={accountModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAccountModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Minha Conta</Text>
            <Text style={styles.sheetSubtitle}>{user.email}</Text>

            {Boolean(accountError) && (
              <Text style={styles.pinErrorText}>{accountError}</Text>
            )}

            <View style={styles.accountSection}>
              <Text style={styles.accountLabel}>Nome de exibição</Text>
              <View style={styles.accountRow}>
                <TextInput
                  style={styles.accountInput}
                  value={editNameInput}
                  onChangeText={setEditNameInput}
                  placeholder="Seu nome"
                  placeholderTextColor="#B08A95"
                />
                <TouchableOpacity
                  style={styles.saveNameButton}
                  onPress={handleUpdateUserName}
                  activeOpacity={0.85}
                >
                  <Text style={styles.saveNameButtonText}>Salvar</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.dangerZoneBox}>
              <Text style={styles.dangerTitle}>Apagar Conta com Segurança</Text>
              <Text style={styles.dangerDesc}>
                Digite seu PIN de 4 dígitos para remover sua conta e todo o histórico do aplicativo.
              </Text>
              <TextInput
                style={styles.pinInputSmall}
                value={deletePinInput}
                onChangeText={(text) => {
                  setAccountError("");
                  setDeletePinInput(text.replace(/\D/g, "").slice(0, 4));
                }}
                placeholder="PIN (4 dígitos)"
                placeholderTextColor="#B08A95"
                keyboardType="number-pad"
                maxLength={4}
                secureTextEntry
              />
              <TouchableOpacity
                style={styles.deleteAccountButton}
                onPress={handleDeleteAccountWithPin}
                activeOpacity={0.85}
              >
                <Ionicons name="trash-outline" size={16} color="#FFFFFF" />
                <Text style={styles.deleteAccountButtonText}>
                  Confirmar Exclusão da Conta
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.closeAccountModalButton}
              onPress={() => setAccountModalVisible(false)}
            >
              <Text style={styles.cancelButtonText}>Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={pinModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setPinModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.bottomSheet}>
            <View style={styles.sheetHandle} />
            <Text style={styles.sheetTitle}>Acesso Protegido</Text>
            <Text style={styles.sheetSubtitle}>Digite seu PIN de 4 dígitos</Text>

            {Boolean(pinError) && (
              <Text style={styles.pinErrorText}>{pinError}</Text>
            )}

            <TextInput
              style={styles.pinInput}
              value={pinInput}
              onChangeText={(text) => {
                setPinError("");
                setPinInput(text.replace(/\D/g, "").slice(0, 4));
              }}
              placeholder="••••"
              placeholderTextColor="#B08A95"
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />

            <View style={styles.sheetButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setPinModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmPin}
              >
                <Text style={styles.confirmButtonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  profileGreetingRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A1D2C",
  },
  settingsIcon: {
    marginLeft: 6,
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  monthRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FAD2DC",
    marginRight: 8,
  },
  monthText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A1D2C",
    marginLeft: 6,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#FAD2DC",
  },
  logoutText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#EC5F7B",
    marginLeft: 4,
  },
  warningBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    borderWidth: 1,
    borderColor: "#FFB300",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
  },
  warningText: {
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
    color: "#8D5300",
    marginLeft: 8,
  },
  weekStrip: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  dayColumn: {
    alignItems: "center",
    width: 42,
  },
  dayLetter: {
    fontSize: 12,
    color: "#8E5B6B",
    marginBottom: 6,
  },
  dayBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  dayBubbleActive: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#EC5F7B",
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4A1D2C",
  },
  dayNumberPeriod: {
    color: "#EC5F7B",
  },
  dayNumberActive: {
    color: "#EC5F7B",
    fontWeight: "bold",
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#EC5F7B",
    marginTop: 4,
  },
  circleWrapper: {
    alignItems: "center",
    marginVertical: 14,
  },
  mainCircle: {
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#EC5F7B",
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    shadowColor: "#EC5F7B",
    shadowOpacity: 0.35,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  circlePhase: {
    fontSize: 16,
    color: "#FFEBF0",
    fontWeight: "500",
  },
  circleDay: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginTop: 6,
    marginBottom: 22,
    textAlign: "center",
  },
  editDatesButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 11,
    borderRadius: 24,
  },
  editDatesText: {
    color: "#EC5F7B",
    fontWeight: "bold",
    fontSize: 14,
  },
  infoCardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 24,
  },
  statusCardLight: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: "#F48FB1",
    justifyContent: "space-between",
    minHeight: 130,
  },
  cardHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconCircleSoft: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF0F4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  cardTagLight: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#EC5F7B",
  },
  statusMainLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A1D2C",
  },
  statusSubLabel: {
    fontSize: 13,
    color: "#8E5B6B",
    marginTop: 4,
  },
  secretLogoButton: {
    position: "absolute",
    right: 22,
    bottom: 22,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EC5F7B",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#4A1D2C",
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(74, 29, 44, 0.45)",
    justifyContent: "flex-end",
  },
  calendarSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    alignItems: "center",
  },
  calendarNavRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  monthNavButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFF0F4",
    borderWidth: 1,
    borderColor: "#FAD2DC",
    alignItems: "center",
    justifyContent: "center",
  },
  calendarTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A1D2C",
    marginLeft: 8,
  },
  calendarWeekRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  calendarWeekLetter: {
    width: "14.28%",
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#8E5B6B",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    width: "100%",
  },
  calendarCell: {
    width: "14.28%",
    alignItems: "center",
    marginVertical: 4,
  },
  calendarDayCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarDayNeutral: {
    backgroundColor: "#FFF5F7",
  },
  calendarDayCycle: {
    backgroundColor: "#EC5F7B",
  },
  calendarDayToday: {
    borderWidth: 2,
    borderColor: "#4A1D2C",
  },
  calendarDayText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A1D2C",
  },
  calendarDayTextCycle: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  legendRow: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    marginTop: 14,
    marginBottom: 18,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 14,
  },
  legendDotCycle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#EC5F7B",
    marginRight: 6,
  },
  legendDotNeutral: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFF5F7",
    borderWidth: 1,
    borderColor: "#FAD2DC",
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 12,
    color: "#8E5B6B",
    fontWeight: "500",
  },
  closeCalendarButton: {
    width: "100%",
    backgroundColor: "#EC5F7B",
    paddingVertical: 14,
    borderRadius: 22,
    alignItems: "center",
  },
  closeCalendarText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 24,
    alignItems: "center",
  },
  sheetHandle: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E0C8D0",
    marginBottom: 16,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A1D2C",
  },
  sheetSubtitle: {
    fontSize: 13,
    color: "#8E5B6B",
    marginTop: 4,
    marginBottom: 12,
  },
  accountSection: {
    width: "100%",
    marginBottom: 16,
  },
  accountLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4A1D2C",
    marginBottom: 6,
  },
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  accountInput: {
    flex: 1,
    backgroundColor: "#FFF8FA",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 14,
    color: "#4A1D2C",
    borderWidth: 1,
    borderColor: "#F5C2D0",
    marginRight: 8,
  },
  saveNameButton: {
    backgroundColor: "#EC5F7B",
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 14,
  },
  saveNameButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
  },
  dangerZoneBox: {
    width: "100%",
    backgroundColor: "#FFF5F5",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F5B7B1",
    marginBottom: 16,
  },
  dangerTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#C0392B",
    marginBottom: 4,
  },
  dangerDesc: {
    fontSize: 11,
    color: "#8E5B6B",
    lineHeight: 16,
    marginBottom: 10,
  },
  pinInputSmall: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    paddingVertical: 10,
    fontSize: 16,
    letterSpacing: 6,
    textAlign: "center",
    color: "#4A1D2C",
    borderWidth: 1,
    borderColor: "#F5B7B1",
    marginBottom: 10,
  },
  deleteAccountButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#C0392B",
    paddingVertical: 12,
    borderRadius: 14,
  },
  deleteAccountButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 6,
  },
  closeAccountModalButton: {
    width: "100%",
    paddingVertical: 12,
    borderRadius: 18,
    backgroundColor: "#F8E8EE",
    alignItems: "center",
  },
  pinErrorText: {
    fontSize: 12,
    color: "#C0392B",
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },
  pinInput: {
    width: "100%",
    backgroundColor: "#FFF5F7",
    borderRadius: 16,
    paddingVertical: 14,
    fontSize: 22,
    letterSpacing: 10,
    textAlign: "center",
    color: "#4A1D2C",
    borderWidth: 1,
    borderColor: "#F48FB1",
    marginBottom: 20,
  },
  sheetButtons: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: "#F8E8EE",
    alignItems: "center",
    marginRight: 8,
  },
  cancelButtonText: {
    color: "#8E5B6B",
    fontWeight: "bold",
  },
  confirmButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: "#EC5F7B",
    alignItems: "center",
    marginLeft: 8,
  },
  confirmButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
  },
});
