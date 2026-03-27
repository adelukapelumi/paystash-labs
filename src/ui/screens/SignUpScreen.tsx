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
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';

const { width } = Dimensions.get('window');

export default function SignUpScreen({ onNext, onSignIn }: { onNext: (email: string) => void, onSignIn: () => void }) {
  const [email, setEmail] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        {/* Top Header */}
        <View style={styles.header}>
          <Text style={styles.signUpLabel}>Sign up</Text>
          <Text style={styles.title}>Let's get you started</Text>
        </View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressSegment, styles.activeSegment]} />
          <View style={styles.progressSegment} />
          <View style={styles.progressSegment} />
          <View style={styles.progressSegment} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <Text style={styles.inputLabel}>Enter e-mail address</Text>
          <TextInput
            style={styles.input}
            placeholder="johndoe@gmail.com"
            placeholderTextColor={COLORS.darkTextSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity onPress={onSignIn} style={styles.signInContainer}>
            <Text style={styles.footerText}>
              Already have an account? <Text style={styles.signInText}>Sign in</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.nextButton}
            onPress={() => onNext(email)}
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: Platform.OS === 'web' ? Math.min(width, 400) : '100%',
    flex: 1,
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    marginBottom: SPACING.xl,
  },
  signUpLabel: {
    color: COLORS.darkAccent,
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
  signInContainer: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  footerText: {
    color: COLORS.darkTextSecondary,
    fontSize: 14,
  },
  signInText: {
    color: COLORS.darkAccent,
    fontWeight: '600',
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
