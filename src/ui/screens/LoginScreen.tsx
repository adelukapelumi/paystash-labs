/**
 * LoginScreen.tsx
 * 
 * Secure login screen for returning PayStash users.
 * Features a numeric entry for the secure vault PIN.
 */

import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  KeyboardAvoidingView,
  Platform,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useApp } from '../../context/AppContext';
import { COLORS, SPACING } from '../theme';
import { PayStashButton } from '../components/PayStashButton';
import { PayStashInput } from '../components/PayStashInput';

export default function LoginScreen() {
  const { user, login, resetVault } = useApp();
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleReset = () => {
    Alert.alert(
      '⚠️ Reset Vault',
      'This will permanently delete your account and all data. You will need to register again. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            await resetVault();
          },
        },
      ]
    );
  };

  const handleLogin = async () => {
    if (pin.length !== 4) {
      Alert.alert('Error', 'Please enter your 4-digit PIN.');
      return;
    }

    setLoading(true);
    // Slight artificial delay for UX (to show loading state)
    // In a real app, hash checking is instant, but this feels more "secure"
    setTimeout(async () => {
      const success = await login(pin);
      if (!success) {
        Alert.alert('Invalid PIN', 'Access Denied.');
        setPin('');
      }
      setLoading(false);
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.emoji}>🔐</Text>
          <Text style={styles.welcome}>Welcome Back,</Text>
          <Text style={styles.userName}>{user?.full_name || 'User'}</Text>
        </View>

        <View style={styles.card}>
          <PayStashInput
            label="Enter Vault PIN"
            placeholder="****"
            keyboardType="numeric"
            secureTextEntry
            maxLength={4}
            value={pin}
            onChangeText={setPin}
            autoFocus
            style={styles.pinInput}
          />

          <PayStashButton
            title="Unlock Vault"
            onPress={handleLogin}
            isLoading={loading}
            style={{ marginTop: SPACING.md }}
          />
        </View>

        <View style={styles.footer}>
          <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
            <Text style={styles.resetText}>🗑️ Forgot PIN? Reset Vault</Text>
          </TouchableOpacity>
          <Text style={styles.footerText}>
            Secured by PayStash Vault Technology
          </Text>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  content: {
    flex: 1,
    padding: SPACING.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: SPACING.xl,
  },
  emoji: {
    fontSize: 64,
    marginBottom: SPACING.md,
  },
  welcome: {
    fontSize: 18,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: 32,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: SPACING.xs,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: COLORS.surface,
    padding: SPACING.xl,
    borderRadius: SPACING.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  pinInput: {
    fontSize: 32,
    textAlign: 'center',
    letterSpacing: 12,
    paddingVertical: SPACING.lg,
  },
  footer: {
    marginTop: SPACING.xxl,
    position: 'absolute',
    bottom: SPACING.xl,
  },
  resetButton: {
    marginBottom: 12,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  resetText: {
    fontSize: 13,
    color: COLORS.textSecondary,
    textDecorationLine: 'underline',
    opacity: 0.8,
  },
  footerText: {
    fontSize: 12,
    color: COLORS.textSecondary,
    opacity: 0.7,
  },
});
