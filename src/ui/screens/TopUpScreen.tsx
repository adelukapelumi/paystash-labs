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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { MockAPI } from '../../api/mockApi';
import { useApp } from '../../context/AppContext';
import { getDb } from '../../database/DatabaseService';
import { addOnlineFunds } from '../../database/VaultDAO';

const { width } = Dimensions.get('window');

interface TopUpScreenProps {
  onBack: () => void;
}

export default function TopUpScreen({ onBack }: TopUpScreenProps) {
  const { refreshBalances } = useApp();
  
  const [amount, setAmount] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Auto-format expiry to MM/YY
  const handleExpiryChange = (text: string) => {
    let formatted = text.replace(/[^0-9]/g, '');
    if (formatted.length >= 2) {
      formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
    }
    setExpiry(formatted);
  };

  const handleTopUp = async () => {
    setErrorMsg('');
    const numAmount = parseFloat(amount.replace(/,/g, ''));

    if (isNaN(numAmount) || numAmount <= 0) {
      setErrorMsg('Please enter a valid amount.');
      return;
    }

    setIsLoading(true);
    try {
      // 1. Mock Network API Call
      const response = await MockAPI.wallet.topup({
        amount: numAmount,
        card_number: cardNumber,
        expiry,
        cvv
      });

      if (response.success) {
        // 2. Safely add to local encrypted database
        const db = await getDb();
        await addOnlineFunds(db, numAmount);
        
        // 3. Refresh context state
        await refreshBalances();

        // 4. Notify & Navigate
        Alert.alert('Success', response.message, [
          { text: 'OK', onPress: onBack }
        ]);
      }
    } catch (error: any) {
      setErrorMsg(error.message || 'Transaction failed, try again');
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
        {/* Top Header - Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="chevron-back" size={24} color={COLORS.darkText} />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Top Up Wallet</Text>
          <Text style={styles.subtitle}>Add funds via debit card</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Amount (₦)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. 5000"
              placeholderTextColor={COLORS.darkTextSecondary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Card Number</Text>
            <TextInput
              style={styles.input}
              placeholder="**** **** **** ****"
              placeholderTextColor={COLORS.darkTextSecondary}
              value={cardNumber}
              onChangeText={setCardNumber}
              keyboardType="numeric"
              maxLength={19}
              secureTextEntry // Mask card number
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: SPACING.md }]}>
              <Text style={styles.inputLabel}>Expiry (MM/YY)</Text>
              <TextInput
                style={styles.input}
                placeholder="09/26"
                placeholderTextColor={COLORS.darkTextSecondary}
                value={expiry}
                onChangeText={handleExpiryChange}
                keyboardType="numeric"
                maxLength={5}
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>CVV</Text>
              <TextInput
                style={styles.input}
                placeholder="***"
                placeholderTextColor={COLORS.darkTextSecondary}
                value={cvv}
                onChangeText={setCvv}
                keyboardType="numeric"
                maxLength={3}
                secureTextEntry
              />
            </View>
          </View>

          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : null}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, isLoading && styles.nextButtonDisabled]}
            onPress={handleTopUp}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.darkBackground} />
            ) : (
              <Text style={styles.nextButtonText}>Add Funds</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
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
  row: {
    flexDirection: 'row',
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
  errorText: {
    color: '#F44336', // Red inline error
    fontSize: 14,
    marginTop: SPACING.sm,
    fontWeight: '500',
    textAlign: 'center',
  },
  footer: {
    marginTop: 'auto',
  },
  nextButton: {
    backgroundColor: '#4CAF50', // Green success
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
});
