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
import { resetPasswordWithPin } from "../data/mockData";

export default function ForgotPasswordScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [warningMessage, setWarningMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleResetPassword() {
    const result = resetPasswordWithPin({ email, pin, newPassword });
    if (!result.success) {
      setSuccessMessage("");
      setWarningMessage(result.message);
      return;
    }

    setWarningMessage("");
    setSuccessMessage("Senha redefinida com sucesso! Você já pode entrar.");
    setPin("");
    setNewPassword("");
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.logoBadge}>
            <Ionicons name="key" size={28} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>Recuperar Senha</Text>
          <Text style={styles.subtitle}>
            Confirme seu e-mail e seu PIN para definir uma nova senha
          </Text>
        </View>

        {Boolean(warningMessage) && (
          <View style={styles.warningBanner}>
            <Ionicons name="warning" size={20} color="#B26A00" />
            <Text style={styles.warningText}>{warningMessage}</Text>
          </View>
        )}

        {Boolean(successMessage) && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={20} color="#EC5F7B" />
            <Text style={styles.successText}>{successMessage}</Text>
          </View>
        )}

        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>E-mail da conta</Text>
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
            <Text style={styles.label}>PIN (4 dígitos)</Text>
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

          <View style={styles.field}>
            <Text style={styles.label}>Nova Senha</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="Digite sua nova senha"
              placeholderTextColor="#B08A95"
              secureTextEntry
            />
          </View>

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleResetPassword}
            activeOpacity={0.85}
          >
            <Text style={styles.submitButtonText}>Redefinir Senha</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.backLink}
          onPress={() => navigation.navigate("Login")}
          activeOpacity={0.75}
        >
          <Text style={styles.backLinkText}>Voltar para o Login</Text>
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
    textAlign: "center",
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
  successBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F4",
    borderWidth: 1,
    borderColor: "#F48FB1",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 16,
  },
  successText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#4A1D2C",
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
