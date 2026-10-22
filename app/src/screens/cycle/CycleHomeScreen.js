import { useState, useEffect } from "react";
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
  findUserById,
  findCycleSummaryByUserId,
  closeCurrentCycle,
} from "../../data/mockData";

const WEEK_DAYS = [
  { id: "1", label: "S", day: "19", active: false, period: false },
  { id: "2", label: "T", day: "20", active: false, period: true },
  { id: "3", label: "Q", day: "21", active: false, period: true },
  { id: "4", label: "Q", day: "22", active: true, period: true },
  { id: "5", label: "S", day: "23", active: false, period: true },
  { id: "6", label: "S", day: "24", active: false, period: true },
  { id: "7", label: "D", day: "25", active: false, period: false },
];

export default function CycleHomeScreen({ navigation, onEnterEmergency, onLogout }) {
  const [pinModalVisible, setPinModalVisible] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [, setRefreshTick] = useState(0);

  useEffect(() => {
    if (!navigation?.addListener) return;
    const unsubscribe = navigation.addListener("focus", () => {
      setRefreshTick((prev) => prev + 1);
    });
    return unsubscribe;
  }, [navigation]);

  const user = findUserById(1);
  const summary = findCycleSummaryByUserId(1);
  const hasOpenCycle = Boolean(summary.openCycle);

  function handleConfirmPin() {
    setPinModalVisible(false);
    setPinInput("");
    if (onEnterEmergency) {
      onEnterEmergency();
    }
  }

  function handleClosePeriod() {
    closeCurrentCycle(1);
    setRefreshTick((prev) => prev + 1);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Text style={styles.greeting}>Olá, {user.name}</Text>

          <View style={styles.topActions}>
            <View style={styles.monthRow}>
              <Ionicons name="calendar-outline" size={18} color="#EC5F7B" />
              <Text style={styles.monthText}>Outubro</Text>
            </View>

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
        onLongPress={() => setPinModalVisible(true)}
        activeOpacity={0.9}
      >
        <Ionicons name="moon" size={24} color="#FFFFFF" />
      </TouchableOpacity>

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

            <TextInput
              style={styles.pinInput}
              value={pinInput}
              onChangeText={(text) => setPinInput(text.replace(/\D/g, "").slice(0, 4))}
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
  greeting: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#4A1D2C",
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
  statusCardCoral: {
    width: "48%",
    backgroundColor: "#EC5F7B",
    borderRadius: 22,
    padding: 16,
    justifyContent: "space-between",
    minHeight: 130,
  },
  iconCircleWhite: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  cardTagCoral: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFEBF0",
  },
  coralMainValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  coralSubLabel: {
    fontSize: 12,
    color: "#FFEBF0",
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
    marginBottom: 18,
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
