import React from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function LoginScreen({ navigation, onLogin }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.logoBadge}>
          <Ionicons name="moon" size={34} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Selene</Text>
        <Text style={styles.subtitle}>Seu calendário menstrual e bem-estar</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.field}>
          <Text style={styles.label}>E-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="selena@gmail.com"
            placeholderTextColor="#B08A95"
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View style={styles.field}>
          <View style={styles.passwordLabelRow}>
            <Text style={styles.label}>Senha</Text>
            <TouchableOpacity
              onPress={() => navigation?.navigate("ForgotPassword")}
              activeOpacity={0.75}
            >
              <Text style={styles.forgotLinkText}>Esqueci minha senha</Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="#B08A95"
            secureTextEntry
          />
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={onLogin} activeOpacity={0.85}>
          <Text style={styles.loginButtonText}>Entrar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.registerButton}
          onPress={() => navigation?.navigate("Register")}
          activeOpacity={0.8}
        >
          <Text style={styles.registerButtonText}>Não tem uma conta? Criar Conta</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footer}>Selene Saúde Feminina</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoBadge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#EC5F7B",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 14,
    shadowColor: "#EC5F7B",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#4A1D2C",
  },
  subtitle: {
    fontSize: 14,
    color: "#8E5B6B",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: "#FAD2DC",
  },
  field: {
    marginBottom: 18,
  },
  passwordLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#4A1D2C",
    marginBottom: 6,
  },
  forgotLinkText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#EC5F7B",
  },
  input: {
    backgroundColor: "#FFF8FA",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 13,
    fontSize: 14,
    color: "#4A1D2C",
    borderWidth: 1,
    borderColor: "#F5C2D0",
  },
  loginButton: {
    backgroundColor: "#EC5F7B",
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 8,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerButton: {
    marginTop: 16,
    alignItems: "center",
    paddingVertical: 6,
  },
  registerButtonText: {
    color: "#EC5F7B",
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    textAlign: "center",
    color: "#B08A95",
    fontSize: 12,
    marginTop: 32,
  },
});
