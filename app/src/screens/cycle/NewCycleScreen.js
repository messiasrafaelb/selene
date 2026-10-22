import { useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  flowOptions,
  moodOptions,
  formatDateInput,
  canOpenNewCycle,
  openNewCycle,
} from "../../data/mockData";

export default function NewCycleScreen({ navigation }) {
  const [startDate, setStartDate] = useState("22/10/2026");
  const [selectedFlow, setSelectedFlow] = useState(flowOptions[1].code);
  const [selectedMood, setSelectedMood] = useState(moodOptions[0].code);
  const [warningMessage, setWarningMessage] = useState("");

  function handleSave() {
    if (!canOpenNewCycle(1)) {
      setWarningMessage("Você não pode iniciar um novo ciclo enquanto houver um ciclo em aberto.");
      return;
    }

    openNewCycle({
      userId: 1,
      startDate,
      flowCode: selectedFlow,
      moodCode: selectedMood,
    });

    navigation.goBack();
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {Boolean(warningMessage) && (
        <View style={styles.warningBanner}>
          <Ionicons name="warning" size={20} color="#B26A00" />
          <Text style={styles.warningText}>{warningMessage}</Text>
        </View>
      )}

      <View style={styles.field}>
        <Text style={styles.label}>Data de início</Text>
        <TextInput
          style={styles.input}
          value={startDate}
          onChangeText={(text) => setStartDate(formatDateInput(text))}
          placeholder="DD/MM/AAAA"
          placeholderTextColor="#B08A95"
          keyboardType="number-pad"
          maxLength={10}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Intensidade do fluxo</Text>
        <View style={styles.optionsRow}>
          {flowOptions.map((option) => {
            const active = selectedFlow === option.code;
            return (
              <TouchableOpacity
                key={option.code}
                style={[styles.optionChip, active && styles.optionChipActive]}
                onPress={() => setSelectedFlow(option.code)}
                activeOpacity={0.85}
              >
                <Text style={[styles.optionChipText, active && styles.optionChipTextActive]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Humor</Text>
        <View style={styles.optionsGrid}>
          {moodOptions.map((option) => {
            const active = selectedMood === option.code;
            return (
              <TouchableOpacity
                key={option.code}
                style={[styles.moodChip, active && styles.optionChipActive]}
                onPress={() => setSelectedMood(option.code)}
                activeOpacity={0.85}
              >
                <Text style={[styles.optionChipText, active && styles.optionChipTextActive]}>
                  {option.description}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View style={styles.noticeBox}>
        <Ionicons name="information-circle-outline" size={20} color="#EC5F7B" />
        <Text style={styles.noticeText}>
          Caso o seu ciclo não seja encerrado manualmente, ele será fechado
          automaticamente com 7 dias de período menstrual.
        </Text>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} activeOpacity={0.85}>
        <Text style={styles.saveButtonText}>Iniciar Ciclo</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
  },
  content: {
    padding: 20,
    paddingBottom: 60,
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
    marginBottom: 18,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#8D5300",
    marginLeft: 10,
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A1D2C",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 15,
    color: "#4A1D2C",
    borderWidth: 1,
    borderColor: "#F5C2D0",
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  optionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  optionChip: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 12,
    marginHorizontal: 4,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5C2D0",
  },
  moodChip: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    paddingVertical: 12,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5C2D0",
  },
  optionChipActive: {
    backgroundColor: "#EC5F7B",
    borderColor: "#EC5F7B",
  },
  optionChipText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E5B6B",
  },
  optionChipTextActive: {
    color: "#FFFFFF",
  },
  noticeBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F4",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#F48FB1",
    marginBottom: 20,
  },
  noticeText: {
    flex: 1,
    fontSize: 12,
    color: "#4A1D2C",
    marginLeft: 10,
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: "#EC5F7B",
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: "center",
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
});
