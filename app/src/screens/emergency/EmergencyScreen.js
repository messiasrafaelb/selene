import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  StyleSheet,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  emergencyChannels,
  findContactsByUserId,
  formatPhone,
} from "../../data/mockData";

export default function EmergencyScreen({ navigation, onExitEmergency }) {
  const userContacts = findContactsByUserId(1);

  function handleCallNumber(phone, label) {
    const cleanPhone = String(phone).replace(/\D/g, "");
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert("Ligação de Emergência", `Discando para ${label}: ${formatPhone(phone) || phone}`);
    });
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={userContacts}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={
          <View>
            <View style={styles.topBanner}>
              <View style={styles.bannerInfo}>
                <Text style={styles.bannerTitle}>Rede de Proteção e Socorro</Text>
                <Text style={styles.bannerSubtitle}>
                  Toque em qualquer canal ou contato para ligar imediatamente
                </Text>
              </View>
              <TouchableOpacity
                style={styles.quickExitButton}
                onPress={onExitEmergency}
                activeOpacity={0.85}
              >
                <Ionicons name="exit-outline" size={18} color="#EC5F7B" />
                <Text style={styles.quickExitText}>Sair</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Canais Nacionais de Emergência</Text>

            {emergencyChannels.map((channel) => (
              <TouchableOpacity
                key={channel.id}
                style={styles.channelCard}
                onPress={() => handleCallNumber(channel.phone, channel.name)}
                activeOpacity={0.85}
              >
                <View style={styles.channelBadge}>
                  <Ionicons name="call" size={20} color="#FFFFFF" />
                </View>
                <View style={styles.channelInfo}>
                  <Text style={styles.channelName}>{channel.name}</Text>
                  <Text style={styles.channelDesc}>{channel.description}</Text>
                </View>
                <Text style={styles.channelNumber}>{channel.phone}</Text>
              </TouchableOpacity>
            ))}

            <View style={styles.contactsHeaderRow}>
              <Text style={styles.sectionTitle}>Contatos de Segurança</Text>
              <TouchableOpacity onPress={() => navigation.navigate("NewContact")}>
                <Text style={styles.addLinkText}>+ Cadastrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.contactCard}
            onPress={() => handleCallNumber(item.phone, item.name)}
            activeOpacity={0.85}
          >
            <View style={styles.contactIcon}>
              <Ionicons name="shield-checkmark" size={20} color="#EC5F7B" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>{formatPhone(item.phone)}</Text>
            </View>
            <View style={styles.callTag}>
              <Ionicons name="call-outline" size={16} color="#FFFFFF" />
              <Text style={styles.callTagText}>Ligar</Text>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <Text style={styles.academicDisclaimer}>
            Protótipo acadêmico — Em emergência real, ligue 190 ou 180.
          </Text>
        }
      />

      <TouchableOpacity
        style={styles.newContactButton}
        onPress={() => navigation.navigate("NewContact")}
        activeOpacity={0.85}
      >
        <Text style={styles.newContactButtonText}>+ Novo Contato de Segurança</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F7",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  topBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#EC5F7B",
    borderRadius: 22,
    padding: 18,
    marginBottom: 20,
  },
  bannerInfo: {
    flex: 1,
    marginRight: 12,
  },
  bannerTitle: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  bannerSubtitle: {
    color: "#FFEBF0",
    fontSize: 12,
    marginTop: 4,
  },
  quickExitButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
  },
  quickExitText: {
    color: "#EC5F7B",
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4A1D2C",
    marginBottom: 12,
  },
  channelCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.5,
    borderColor: "#F48FB1",
  },
  channelBadge: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#EC5F7B",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#4A1D2C",
  },
  channelDesc: {
    fontSize: 12,
    color: "#8E5B6B",
    marginTop: 2,
  },
  channelNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#EC5F7B",
    marginLeft: 8,
  },
  contactsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  addLinkText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#EC5F7B",
    marginBottom: 12,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#FAD2DC",
  },
  contactIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#FFF0F4",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 15,
    fontWeight: "600",
    color: "#4A1D2C",
  },
  contactPhone: {
    fontSize: 13,
    color: "#8E5B6B",
    marginTop: 2,
  },
  callTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EC5F7B",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  callTagText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
    marginLeft: 4,
  },
  academicDisclaimer: {
    textAlign: "center",
    fontSize: 11,
    color: "#8E5B6B",
    marginTop: 18,
  },
  newContactButton: {
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: "#EC5F7B",
    borderRadius: 24,
    paddingVertical: 15,
    alignItems: "center",
  },
  newContactButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});
