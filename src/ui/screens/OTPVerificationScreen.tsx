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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';

const { width } = Dimensions.get('window');

interface OTPVerificationScreenProps {
  email: string;
  onNext: (otp: string) => void;
  onBack: () => void;
}

export default function OTPVerificationScreen({ email, onNext, onBack }: OTPVerificationScreenProps) {
  const [otp, setOtp] = useState('');

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
          <Text style={styles.signUpLabel}>Sign up-02</Text>
          <Text style={styles.title}>Let's get you started</Text>
        </View>

        {/* Progress Indicator - Step 2 of 4 */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressSegment, styles.activeSegment]} />
          <View style={[styles.progressSegment, styles.activeSegment]} />
          <View style={styles.progressSegment} />
          <View style={styles.progressSegment} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.inputLabel}>Confirm the OTP XXX-XXX sent to your e-mail</Text>
          <TextInput
            style={styles.input}
            placeholder="XXX-XXX"
            placeholderTextColor={COLORS.darkTextSecondary}
            value={otp}
            onChangeText={setOtp}
            keyboardType="number-pad"
            autoCapitalize="none"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => onNext(otp)}
          >
            <Text style={styles.nextButtonText}>Next</Text>
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
  signUpLabel: {
    color: '#607D8B', // Muted blue-grey as per visual
    fontSize: 16,
    fontWeight: '600',
    marginBottom: SPACING.xs,
  },
  title: {
    color: COLORS.darkText,
    fontSize: 28,
    fontWeight: '700',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.xxl,
  },
  progressSegment: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    marginHorizontal: 2,
    borderRadius: 2,
  },
  activeSegment: {
    backgroundColor: COLORS.darkAccent,
  },
  form: {
    flex: 1,
  },
  inputLabel: {
    color: COLORS.darkTextSecondary,
    fontSize: 14,
    marginBottom: SPACING.sm,
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
  footer: {
    marginTop: 'auto',
  },
  nextButton: {
    backgroundColor: COLORS.darkAccent,
    paddingVertical: SPACING.md,
    borderRadius: BORDER_RADIUS.full,
    alignItems: 'center',
  },
  nextButtonText: {
    color: COLORS.darkBackground,
    fontSize: 18,
    fontWeight: '700',
  },
});
