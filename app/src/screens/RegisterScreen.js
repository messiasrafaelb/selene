import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { registerUser } from "../data/mockData";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [showPinInfo, setShowPinInfo] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  function handleRegister() {
    const result = registerUser({ name, email, password, pin });
    if (!result.success) {
      setWarningMessage(result.message);
      return;
    }

    setWarningMessage("");
    navigation.navigate("Login");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Ionicons name="person-add" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Criar Conta</Text>
          <Text style={styles.subtitle}>Cadastre seus dados para acompanhar seu ciclo</Text>
        </View>

        {Boolean(warningMessage) && (
          <View style={styles.warningBanner}>
            <Ionicons name="warning" size={20} color="#B26A00" />
            <Text style={styles.warningText}>{warningMessage}</Text>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Nome</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Ex.: Selena"
              placeholderTextColor="#B08A95"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="selena@gmail.com"
              placeholderTextColor="#B08A95"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="••••••••"
              placeholderTextColor="#B08A95"
              secureTextEntry
            />
          </View>

          <View style={styles.field}>
            <View style={styles.pinLabelRow}>
              <Text style={styles.labelInline}>PIN de Segurança (4 dígitos)</Text>
              <TouchableOpacity
                onPress={() => setShowPinInfo((prev) => !prev)}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                activeOpacity={0.7}
              >
                <Ionicons
                  name="information-circle-outline"
                  size={18}
                  color="#EC5F7B"
                />
              </TouchableOpacity>
            </View>

            {showPinInfo && (
              <View style={styles.pinTooltip}>
                <Text style={styles.pinTooltipText}>
                  Código numérico usado para recuperar sua senha e acessar recursos privados do app (segure o ícone da lua por 5s na tela inicial).
                </Text>
              </View>
            )}

            <TextInput
              style={styles.input}
              value={pin}
              onChangeText={(text) => setPin(text.replace(/\D/g, "").slice(0, 4))}
              placeholder="••••"
              placeholderTextColor="#B08A95"
              keyboardType="number-pad"
              maxLength={4}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.submitButton} onPress={handleRegister} activeOpacity={0.85}>
            <Text style={styles.submitButtonText}>Cadastrar Conta</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.75}
        >
          <Text style={styles.backLinkText}>Já possui conta? Voltar ao Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 28,
  },
  header: {
    alignItems: "center",
    marginBottom: 22,
  },
  logoBadge: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#EC5F7B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4A1D2C",
  },
  subtitle: {
    fontSize: 13,
    color: "#8E5B6B",
    marginTop: 4,
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
    marginBottom: 16,
  },
  warningText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#8D5300",
    marginLeft: 10,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
    borderWidth: 1,
    borderColor: "#FAD2DC",
  },
  field: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A1D2C",
    marginBottom: 6,
  },
  pinLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  labelInline: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A1D2C",
    marginRight: 6,
  },
  pinTooltip: {
    backgroundColor: "#FFF0F4",
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: "#F48FB1",
    marginBottom: 8,
  },
  pinTooltipText: {
    fontSize: 11,
    color: "#4A1D2C",
    lineHeight: 16,
  },
  input: {
    backgroundColor: "#FFF8FA",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 14,
    color: "#4A1D2C",
    borderWidth: 1,
    borderColor: "#F5C2D0",
  },
  submitButton: {
    backgroundColor: "#EC5F7B",
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 4,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "bold",
  },
  backLink: {
    alignItems: "center",
    marginTop: 20,
  },
  backLinkText: {
    color: "#EC5F7B",
    fontSize: 14,
    fontWeight: "bold",
  },
});
