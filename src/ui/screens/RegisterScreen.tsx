/**
 * RegisterScreen.tsx
 * 
 * Secure registration flow for PayStash.
 * Collects name, phone, and sets up a secure PIN.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { COLORS, SPACING } from '../theme';
import { PayStashButton } from '../components/PayStashButton';
import { PayStashInput } from '../components/PayStashInput';

export default function RegisterScreen() {
  const { register } = useApp();
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !phoneNumber || !pin || !confirmPin) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (pin.length !== 4) {
      Alert.alert('Error', 'PIN must be 4 digits.');
      return;
    }

    if (pin !== confirmPin) {
      Alert.alert('Error', 'PINs do not match.');
      return;
    }

    setLoading(true);
    try {
      await register(fullName, phoneNumber, pin);
      // AppContext handles the navigation switch via isAuthenticated
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.emoji}>💎</Text>
          <Text style={styles.title}>Create Your Vault</Text>
          <Text style={styles.subtitle}>
            Secure your funds today.
          </Text>
        </View>

        <View style={styles.form}>
          <PayStashInput
            label="Full Name"
            placeholder="John Doe"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <PayStashInput
            label="Phone Number"
            placeholder="+234..."
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />

          <View style={styles.pinRow}>
            <View style={{ flex: 1, marginRight: SPACING.md }}>
              <PayStashInput
                label="Create PIN"
                placeholder="****"
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                value={pin}
                onChangeText={setPin}
              />
            </View>
            <View style={{ flex: 1 }}>
              <PayStashInput
                label="Confirm PIN"
                placeholder="****"
                keyboardType="numeric"
                secureTextEntry
                maxLength={4}
                value={confirmPin}
                onChangeText={setConfirmPin}
              />
            </View>
          </View>

          <PayStashButton
            title="Create Vault"
            onPress={handleRegister}
            isLoading={loading}
            style={{ marginTop: SPACING.lg }}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emoji: {
    fontSize: 48,
    marginBottom: SPACING.md,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
    marginBottom: SPACING.xs,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  pinRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
