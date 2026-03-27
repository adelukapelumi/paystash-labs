import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  TextInput,
  Platform,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

// Blank black status bar area
const CustomStatusBar = () => (
  <View style={styles.statusBar} />
);

interface GenerateScreenProps {
  onBack: () => void;
  onGenerate: (data: { amount: string; recipientId: string }) => void;
}

export default function GenerateScreen({ onBack, onGenerate }: GenerateScreenProps) {
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [activeField, setActiveField] = useState<'amount' | 'recipient'>('amount');
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleKeyPress = (key: string) => {
    if (activeField === 'amount') {
      if (key === '⌫') {
        setAmount(prev => prev.slice(0, -1));
      } else {
        setAmount(prev => prev + key);
      }
    } else {
      if (key === '⌫') {
        setRecipientId(prev => prev.slice(0, -1));
      } else {
        setRecipientId(prev => prev + key);
      }
    }
  };

  const Key = ({ value, sub }: { value: string; sub?: string }) => (
    <TouchableOpacity 
      style={styles.key} 
      onPress={() => handleKeyPress(value)}
      activeOpacity={0.7}
    >
      <Text style={styles.keyText}>{value}</Text>
      {sub && <Text style={styles.subText}>{sub}</Text>}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <CustomStatusBar />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={28} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Generate</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          bounces={false}
          showsVerticalScrollIndicator={false}
        >
          {/* Inputs Section */}
          <View style={styles.inputSection}>
            <TouchableOpacity 
              style={[styles.inputContainer, activeField === 'amount' && styles.activeInput]}
              onPress={() => setActiveField('amount')}
              activeOpacity={1}
            >
              <Text style={[styles.inputValue, !amount && styles.placeholder]}>
                {amount || 'Enter Amount'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.inputContainer, activeField === 'recipient' && styles.activeInput]}
              onPress={() => setActiveField('recipient')}
              activeOpacity={1}
            >
              <Text style={[styles.inputValue, !recipientId && styles.placeholder]}>
                {recipientId || 'Recipient ID'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.generateBtn}
              onPress={() => {
                if (!amount || !recipientId) {
                  Alert.alert('Missing Field', 'Please enter both Amount and Recipient ID.');
                  return;
                }
                setShowConfirmModal(true);
              }}
            >
              <Text style={styles.generateBtnText}>Generate 📱</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Numeric Keypad Panel (Fixed at bottom) */}
        <View style={styles.keypadPanel}>
          {/* Hint labels */}
          <View style={styles.hintsRow}>
             <Text style={styles.hintText}>I</Text>
             <Text style={styles.hintText}>The</Text>
             <Text style={styles.hintText}>Go</Text>
          </View>

          {/* Keypad */}
          <View style={styles.keypad}>
            <View style={styles.keyRow}>
              <Key value="1" />
              <Key value="2" sub="ABC" />
              <Key value="3" sub="DEF" />
            </View>
            <View style={styles.keyRow}>
              <Key value="4" sub="GHI" />
              <Key value="5" sub="JKL" />
              <Key value="6" sub="MNO" />
            </View>
            <View style={styles.keyRow}>
              <Key value="7" sub="PQRS" />
              <Key value="8" sub="TUV" />
              <Key value="9" sub="WXYZ" />
            </View>
            <View style={styles.keyRow}>
              <Key value="." />
              <Key value="0" />
              <TouchableOpacity style={styles.key} onPress={() => handleKeyPress('⌫')}>
                 <Ionicons name="backspace-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.homeIndicator} />
        </View>
      </SafeAreaView>

      {/* Glassmorphism Confirmation Modal (Absolute Positioned for Web Compat) */}
      {showConfirmModal && (
        <View style={[StyleSheet.absoluteFill, { zIndex: 1000, elevation: 1000 }]}>
          <View style={styles.modalOverlay}>
            <View style={styles.glassCard}>
              <Text style={styles.modalTitle}>Confirm Stash</Text>
              <Text style={styles.modalText}>
                Are you sure you want to stash <Text style={{ color: '#4CAF50', fontWeight: 'bold' }}>₦{amount}</Text> for Recipient <Text style={{ color: 'white', fontWeight: 'bold' }}>{recipientId}</Text>?
              </Text>
              <View style={styles.modalActions}>
                <TouchableOpacity 
                  style={styles.modalCancelBtn} 
                  onPress={() => setShowConfirmModal(false)}
                >
                  <Text style={styles.modalCancelBtnText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalConfirmBtn} 
                  onPress={() => {
                    setShowConfirmModal(false);
                    onGenerate({ amount, recipientId });
                  }}
                >
                  <Text style={styles.modalConfirmBtnText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Very black
  },
  safeArea: {
    flex: 1,
  },
  statusBar: {
    height: 44,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  inputSection: {
    paddingHorizontal: 25,
    paddingTop: 10,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#0A0A0A',
    height: 55,
    borderRadius: 15,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#1A1A1A',
  },
  activeInput: {
    borderColor: '#4CAF50',
  },
  inputValue: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    color: '#666',
  },
  generateBtn: {
    backgroundColor: '#4CAF50',
    width: '85%',
    height: 55,
    borderRadius: 22,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  generateBtnText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  keypadPanel: {
    backgroundColor: '#BCC0C4',
    width: '100%',
    paddingTop: 10,
    paddingBottom: Platform.OS === 'ios' ? 0 : 20,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  hintsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    marginBottom: 10,
  },
  hintText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
  },
  keypad: {
    paddingHorizontal: 10,
  },
  keyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  key: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    height: 52,
    marginHorizontal: 4,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 2,
  },
  keyText: {
    color: 'black',
    fontSize: 28,
    fontWeight: '600',
  },
  subText: {
    color: 'black',
    fontSize: 10,
    fontWeight: '700',
    marginTop: -2,
  },
  homeIndicator: {
    width: 140,
    height: 5,
    backgroundColor: '#999',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 20,
    marginBottom: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  glassCard: {
    width: '85%',
    backgroundColor: 'rgba(30, 30, 30, 0.85)', // Semi-transparent dark
    borderRadius: 24,
    padding: 25,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    alignItems: 'center',
    // @ts-ignore
    backdropFilter: 'blur(10px)', 
  },
  modalTitle: {
    color: 'white',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 10,
  },
  modalText: {
    color: '#CCCCCC',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalCancelBtn: {
    flex: 1,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  modalCancelBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalConfirmBtn: {
    flex: 1,
    height: 50,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3,
  },
  modalConfirmBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '700',
  },
});
