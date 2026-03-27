import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  ActivityIndicator,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { MockAPI } from '../../api/mockApi';
import { useApp } from '../../context/AppContext';
import { getDb } from '../../database/DatabaseService';
import { deductOnlineFunds } from '../../database/VaultDAO';

const { width } = Dimensions.get('window');

const BANKS = [
  { code: '058', name: 'GTBank' },
  { code: '044', name: 'Access Bank' },
  { code: '011', name: 'First Bank' },
  { code: '033', name: 'UBA' },
  { code: '057', name: 'Zenith Bank' },
];

interface WithdrawScreenProps {
  onBack: () => void;
}

export default function WithdrawScreen({ onBack }: WithdrawScreenProps) {
  const { refreshBalances } = useApp();
  
  const [amount, setAmount] = useState('');
  const [account, setAccount] = useState('');
  const [selectedBank, setSelectedBank] = useState(BANKS[0]);
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const confirmValidation = () => {
    setErrorMsg('');
    const numAmount = parseFloat(amount.replace(/,/g, ''));

    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }
    if (account.length !== 10) {
      setErrorMsg('Account number must be 10 digits.');
      return;
    }

    setIsConfirmModalVisible(true);
  };

  const handleWithdraw = async () => {
    setIsConfirmModalVisible(false);
    setIsLoading(true);
    const numAmount = parseFloat(amount.replace(/,/g, ''));

    try {
      // 1. Mock Network Details
      const response = await MockAPI.wallet.withdraw({
        amount: numAmount,
        account,
        bank: selectedBank.code
      });

      if (response.success) {
        // 2. Local encryption logic deductions
        const db = await getDb();
        await deductOnlineFunds(db, numAmount);
        
        // 3. React Sync
        await refreshBalances();

        // 4. Alert user & Back
        Alert.alert('Success', response.message, [
          { text: 'OK', onPress: onBack }
        ]);
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Transfer failed, check details');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Header */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color={COLORS.darkText} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Send Money</Text>
          <Text style={styles.subtitle}>Withdraw funds to a bank account</Text>
        </View>

        {/* User Input Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount (₦)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 2000"
              placeholderTextColor={COLORS.darkTextSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Account Number</Text>
            <TextInput
              style={styles.input}
              placeholder="0123456789"
              placeholderTextColor={COLORS.darkTextSecondary}
              value={account}
              onChangeText={setAccount}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Select Bank</Text>
            <TouchableOpacity
              style={[styles.input, styles.dropdownToggle]}
              onPress={() => setIsDropdownOpen(true)}
            >
              <Text style={{ color: COLORS.darkText }}>{selectedBank.name}</Text>
              <Ionicons name="chevron-down" size={20} color={COLORS.darkTextSecondary} />
            </TouchableOpacity>
          </View>

          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : null}
        </View>

        {/* Submitting Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, isLoading && styles.nextButtonDisabled]}
            onPress={confirmValidation}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.darkBackground} />
            ) : (
              <Text style={styles.nextButtonText}>Send Money</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Pseudo-Dropdown Selection Modal */}
      {isDropdownOpen && (
        <Modal transparent animationType="fade" visible={isDropdownOpen}>
          <TouchableOpacity 
            style={styles.modalOverlay} 
            activeOpacity={1} 
            onPress={() => setIsDropdownOpen(false)}
          >
            <View style={styles.dropdownMenu}>
              <Text style={styles.dropdownHeader}>Select Bank</Text>
              <FlatList
                data={BANKS}
                keyExtractor={(item) => item.code}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSelectedBank(item);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <Text style={styles.dropdownItemText}>{item.name}</Text>
                    {selectedBank.code === item.code && (
                      <Ionicons name="checkmark" size={20} color="#4CAF50" />
                    )}
                  </TouchableOpacity>
                )}
              />
            </View>
          </TouchableOpacity>
        </Modal>
      )}

      {/* Confirmation Modal */}
      {isConfirmModalVisible && (
        <Modal transparent animationType="fade" visible={isConfirmModalVisible}>
          <View style={styles.modalOverlay}>
            <View style={styles.confirmBox}>
              <Text style={styles.confirmTitle}>Confirm Transfer</Text>
              <Text style={styles.confirmText}>
                Send ₦{parseFloat(amount.replace(/,/g, '')).toLocaleString()} to an account ending in {account.slice(-4)}?
              </Text>
              <View style={styles.confirmActions}>
                <TouchableOpacity style={styles.cancelBtn} onPress={() => setIsConfirmModalVisible(false)}>
                  <Text style={styles.cancelText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmBtn} onPress={handleWithdraw}>
                  <Text style={styles.confirmBtnText}>Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBackground,
  },
  content: {
    width: Platform.OS === 'web' ? Math.min(width, 400) : '100%',
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: 40,
    alignSelf: 'center',
  },
  backButton: {
    marginBottom: SPACING.lg,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.darkText,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: SPACING.xs,
  },
  subtitle: {
    color: COLORS.darkTextSecondary,
    fontSize: 16,
  },
  form: {
    marginBottom: SPACING.xl,
  },
  inputGroup: {
    marginBottom: SPACING.md,
  },
  inputLabel: {
    color: COLORS.darkTextSecondary,
    fontSize: 14,
    marginBottom: SPACING.xs,
  },
  input: {
    backgroundColor: COLORS.darkInputBg,
    color: COLORS.darkText,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.md,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  dropdownToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: SPACING.sm,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
  },
  nextButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
    height: 54,
    justifyContent: 'center',
  },
  nextButtonDisabled: {
    opacity: 0.7,
  },
  nextButtonText: {
    color: COLORS.darkBackground,
    fontSize: 18,
    fontWeight: '700',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropdownMenu: {
    backgroundColor: '#111',
    width: Math.min(width * 0.9, 360),
    maxHeight: 400,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  dropdownHeader: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 15,
  },
  dropdownItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  dropdownItemText: {
    color: '#FFF',
    fontSize: 16,
  },
  // Confirmation Modal Box
  confirmBox: {
    backgroundColor: '#111',
    width: Math.min(width * 0.85, 340),
    borderRadius: 24,
    padding: 24,
    borderWidth: 1,
    borderColor: '#222',
  },
  confirmTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  confirmText: {
    color: '#CCC',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 25,
    lineHeight: 22,
  },
  confirmActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#222',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  cancelText: {
    color: '#FFF',
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#4CAF50',
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtnText: {
    color: '#000',
    fontWeight: '700',
  },
});
