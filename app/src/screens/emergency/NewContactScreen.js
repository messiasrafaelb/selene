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
import { formatPhone, criar, atualizar } from "../../services/api";

export default function NewContactScreen({ navigation, route, currentUser }) {
  const contatoExistente = route?.params?.contact || null;
  const userId = currentUser?.id || contatoExistente?.userId || 1;

  const [name, setName] = useState(contatoExistente?.name || "");
  const [relationship, setRelationship] = useState(
    contatoExistente?.relationship || "Rede de Apoio"
  );
  const [phone, setPhone] = useState(
    contatoExistente?.phone ? formatPhone(contatoExistente.phone) : ""
  );
  const [priority, setPriority] = useState(
    contatoExistente?.priority || "Apoio rápido"
  );
  const [warningMessage, setWarningMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    try {
      setLoading(true);
      setWarningMessage("");
      if (contatoExistente?.id) {
        await atualizar("contacts", contatoExistente.id, {
          userId,
          name,
          relationship,
          phone,
          priority,
        });
      } else {
        await criar("contacts", {
          userId,
          name,
          relationship,
          phone,
          priority,
        });
      }
      navigation.goBack();
    } catch (erro) {
      setWarningMessage(erro.message || "Falha ao salvar contato na API.");
    } finally {
      setLoading(false);
    }
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
        <Text style={styles.label}>Nome do contato</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Ex.: Mariana (Irmã)"
          placeholderTextColor="#B08A95"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Vínculo / Parentesco</Text>
        <TextInput
          style={styles.input}
          value={relationship}
          onChangeText={setRelationship}
          placeholder="Ex.: Irmã, Mãe, Amiga, Advogada"
          placeholderTextColor="#B08A95"
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Telefone com DDD</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={(text) => setPhone(formatPhone(text))}
          placeholder="(43) 99912-3456"
          placeholderTextColor="#B08A95"
          keyboardType="number-pad"
          maxLength={15}
        />
      </View>

      <View style={styles.field}>
        <Text style={styles.label}>Prioridade de Acionamento</Text>
        <View style={styles.priorityRow}>
          {["Principal", "Apoio rápido", "Orientação"].map((opcao) => {
            const ativo = priority === opcao;
            return (
              <TouchableOpacity
                key={opcao}
                style={[styles.priorityOption, ativo && styles.priorityOptionActive]}
                onPress={() => setPriority(opcao)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.priorityOptionText,
                    ativo && styles.priorityOptionTextActive,
                  ]}
                >
                  {opcao}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={handleSave}
        disabled={loading}
        activeOpacity={0.85}
      >
        <Text style={styles.saveButtonText}>
          {loading
            ? "Salvando..."
            : contatoExistente
            ? "Atualizar Contato"
            : "Salvar Contato"}
        </Text>
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
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A1D2C",
    marginBottom: 6,
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
  priorityRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  priorityOption: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 11,
    marginHorizontal: 3,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F5C2D0",
  },
  priorityOptionActive: {
    backgroundColor: "#EC5F7B",
    borderColor: "#EC5F7B",
  },
  priorityOptionText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#8E5B6B",
  },
  priorityOptionTextActive: {
    color: "#FFFFFF",
  },
  saveButton: {
    backgroundColor: "#EC5F7B",
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
});
