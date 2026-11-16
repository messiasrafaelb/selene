import { useState, useEffect, useCallback } from "react";
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
  listar,
  atualizar,
  remover,
  buscarPainel,
  avaliarRiscoApi,
  formatPhone,
  AVISO_ACADEMICO,
} from "../../services/api";

const INTERVALO_ATUALIZACAO_MS = 15000;
const PRIORIDADES = ["Principal", "Apoio rápido", "Orientação"];

const COR_RISCO = {
  Baixo: "#1F8A5C",
  Médio: "#C9A227",
  Alto: "#C0392B",
};

const PERFIS_SIMULACAO = [
  {
    rotulo: "Baixo (10%)",
    vinculoAutor: "Conhecido",
    tipoViolencia: "Moral",
    localOcorrencia: "Ambiente virtual",
    diasAteNotificacao: 3,
  },
  {
    rotulo: "Médio (49%)",
    vinculoAutor: "Ex-parceiro",
    tipoViolencia: "Psicológica",
    localOcorrencia: "Residência",
    diasAteNotificacao: 15,
  },
  {
    rotulo: "Alto (85%)",
    vinculoAutor: "Parceiro atual",
    tipoViolencia: "Física",
    localOcorrencia: "Residência",
    diasAteNotificacao: 38,
  },
];

export default function EmergencyScreen({
  navigation,
  currentUser,
  onExitEmergency,
}) {
  const userId = currentUser?.id || 1;
  const [userContacts, setUserContacts] = useState([]);
  const [painel, setPainel] = useState(null);
  const [warningMessage, setWarningMessage] = useState("");

  const carregarRede = useCallback(async () => {
    try {
      setWarningMessage("");
      const [contatosApi, painelApi] = await Promise.all([
        listar("contacts", userId),
        buscarPainel(userId),
      ]);
      setUserContacts(Array.isArray(contatosApi) ? contatosApi : []);
      setPainel(painelApi || null);
    } catch (erro) {
      setWarningMessage("Falha ao sincronizar com a API (http://localhost:3333).");
    }
  }, [userId]);

  useEffect(() => {
    carregarRede();
    const idIntervalo = setInterval(carregarRede, INTERVALO_ATUALIZACAO_MS);
    let unsubscribe = null;
    if (navigation?.addListener) {
      unsubscribe = navigation.addListener("focus", () => {
        carregarRede();
      });
    }
    return () => {
      clearInterval(idIntervalo);
      if (unsubscribe) unsubscribe();
    };
  }, [navigation, carregarRede]);

  function handleCallNumber(phone, label) {
    const cleanPhone = String(phone).replace(/\D/g, "");
    Linking.openURL(`tel:${cleanPhone}`).catch(() => {
      Alert.alert(
        "Ligação de Emergência",
        `Discando para ${label}: ${formatPhone(phone) || phone}`
      );
    });
  }

  async function handleAlternarPrioridade(item) {
    try {
      const idxAtual = PRIORIDADES.indexOf(item.priority || "Apoio rápido");
      const novaPrioridade = PRIORIDADES[(idxAtual + 1) % PRIORIDADES.length];
      await atualizar("contacts", item.id, { priority: novaPrioridade });
      await carregarRede();
    } catch (erro) {
      setWarningMessage(erro.message || "Falha ao atualizar prioridade do contato.");
    }
  }

  async function handleRemoverContato(id) {
    try {
      await remover("contacts", id);
      await carregarRede();
    } catch (erro) {
      setWarningMessage(erro.message || "Falha ao remover contato na API.");
    }
  }

  async function handleSimularRisco(perfil) {
    try {
      await avaliarRiscoApi({
        cycleId: painel?.indicadorRecente?.cycleId || 1,
        ...perfil,
      });
      await carregarRede();
    } catch (erro) {
      setWarningMessage(erro.message || "Falha ao recalcular indicador na API.");
    }
  }

  const indicador = painel?.indicadorRecente || {
    riscoRepeticao: "Alto",
    probabilidadeRisco: 0.85,
    vinculoAutor: "Parceiro atual",
    tipoViolencia: "Física",
    localOcorrencia: "Residência",
    diasAteNotificacao: 38,
  };
  const corIndicador = COR_RISCO[indicador.riscoRepeticao] || COR_RISCO.Baixo;

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
                <Text style={styles.quickExitText}>Saída Rápida</Text>
              </TouchableOpacity>
            </View>

            {Boolean(warningMessage) && (
              <View style={styles.warningBanner}>
                <Ionicons name="warning" size={18} color="#B26A00" />
                <Text style={styles.warningText}>{warningMessage}</Text>
              </View>
            )}

            <View style={styles.dsCard}>
              <View style={styles.dsHeaderRow}>
                <View style={styles.dsTitleRow}>
                  <Ionicons name="analytics" size={18} color="#EC5F7B" />
                  <Text style={styles.dsTitle}>
                    Indicador de Risco de Repetição (Data Science)
                  </Text>
                </View>
                <View style={[styles.dsBadge, { backgroundColor: corIndicador }]}>
                  <Text style={styles.dsBadgeText}>
                    Risco {indicador.riscoRepeticao} (
                    {Math.round(Number(indicador.probabilidadeRisco || 0) * 100)}%)
                  </Text>
                </View>
              </View>

              <Text style={styles.dsContextText}>
                Perfil avaliado: {indicador.vinculoAutor} · {indicador.tipoViolencia} ·{" "}
                {indicador.localOcorrencia} ({indicador.diasAteNotificacao} dias até notificação)
              </Text>

              <View style={styles.dsSimRow}>
                {PERFIS_SIMULACAO.map((perfil) => (
                  <TouchableOpacity
                    key={perfil.rotulo}
                    style={styles.dsSimChip}
                    onPress={() => handleSimularRisco(perfil)}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.dsSimChipText}>{perfil.rotulo}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.dsDisclaimer}>
                * {painel?.avisoAcademico || AVISO_ACADEMICO}
                {painel?.atualizadoEm ? ` · Atualizado às ${painel.atualizadoEm}` : ""}
              </Text>
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
            onLongPress={() => handleRemoverContato(item.id)}
            activeOpacity={0.85}
          >
            <View style={styles.contactIcon}>
              <Ionicons name="shield-checkmark" size={20} color="#EC5F7B" />
            </View>
            <View style={styles.contactInfo}>
              <Text style={styles.contactName}>{item.name}</Text>
              <Text style={styles.contactPhone}>
                {formatPhone(item.phone)}
                {item.relationship ? ` · ${item.relationship}` : ""}
              </Text>
              <View style={styles.contactMetaRow}>
                <TouchableOpacity
                  style={styles.priorityChip}
                  onPress={() => handleAlternarPrioridade(item)}
                >
                  <Ionicons name="sync-outline" size={12} color="#EC5F7B" />
                  <Text style={styles.priorityChipText}>
                    {item.priority || "Apoio rápido"}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.editContactChip}
                  onPress={() => navigation.navigate("NewContact", { contact: item })}
                >
                  <Ionicons name="create-outline" size={13} color="#4A1D2C" />
                  <Text style={styles.editContactText}>Editar</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.deleteContactChip}
                  onPress={() => handleRemoverContato(item.id)}
                >
                  <Ionicons name="trash-outline" size={13} color="#C0392B" />
                </TouchableOpacity>
              </View>
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
    marginBottom: 16,
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
  dsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: "#F48FB1",
  },
  dsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  dsTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },
  dsTitle: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#4A1D2C",
    marginLeft: 6,
  },
  dsBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  dsBadgeText: {
    color: "#FFFFFF",
    fontSize: 11,
    fontWeight: "bold",
  },
  dsContextText: {
    fontSize: 12,
    color: "#4A1D2C",
    marginBottom: 10,
  },
  dsSimRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  dsSimChip: {
    flex: 1,
    backgroundColor: "#FFF0F4",
    borderWidth: 1,
    borderColor: "#F48FB1",
    borderRadius: 12,
    paddingVertical: 6,
    marginHorizontal: 3,
    alignItems: "center",
  },
  dsSimChipText: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#EC5F7B",
  },
  dsDisclaimer: {
    fontSize: 10,
    color: "#8E5B6B",
    fontStyle: "italic",
    lineHeight: 14,
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
  contactMetaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  priorityChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F4",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#F48FB1",
    marginRight: 6,
  },
  priorityChipText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#EC5F7B",
    marginLeft: 4,
  },
  editContactChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8E8EE",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 6,
  },
  editContactText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#4A1D2C",
    marginLeft: 3,
  },
  deleteContactChip: {
    backgroundColor: "#FDEDEC",
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: 10,
  },
  callTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EC5F7B",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginLeft: 8,
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
