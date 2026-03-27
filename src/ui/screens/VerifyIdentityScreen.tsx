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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { MockAPI } from '../../api/mockApi';

const { width } = Dimensions.get('window');

interface VerifyIdentityScreenProps {
  onNext: () => void;
  onBack: () => void;
}

export default function VerifyIdentityScreen({ onNext, onBack }: VerifyIdentityScreenProps) {
  const [bvn, setBvn] = useState('');
  const [nin, setNin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleVerify = async () => {
    setErrorMsg('');
    setIsLoading(true);

    try {
      const response = await MockAPI.identity.verify({ bvn, nin });
      if (response.success) {
        onNext();
      }
    } catch (error: any) {
      setErrorMsg(error.message);
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
          <Text style={styles.signUpLabel}>Sign up-04</Text>
          <Text style={styles.title}>Verify Your Identity</Text>
        </View>

        {/* Progress Indicator - Step 4 of 4 */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressSegment, styles.activeSegment]} />
          <View style={[styles.progressSegment, styles.activeSegment]} />
          <View style={[styles.progressSegment, styles.activeSegment]} />
          <View style={[styles.progressSegment, styles.activeSegment]} />
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>BVN (11 digits)</Text>
            <TextInput
              style={styles.input}
              placeholder="00000000000"
              placeholderTextColor={COLORS.darkTextSecondary}
              value={bvn}
              onChangeText={setBvn}
              keyboardType="numeric"
              maxLength={11}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>NIN (11 digits)</Text>
            <TextInput
              style={styles.input}
              placeholder="11111111111"
              placeholderTextColor={COLORS.darkTextSecondary}
              value={nin}
              onChangeText={setNin}
              keyboardType="numeric"
              maxLength={11}
            />
          </View>

          {errorMsg ? (
            <Text style={styles.errorText}>{errorMsg}</Text>
          ) : null}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.nextButton, isLoading && styles.nextButtonDisabled]}
            onPress={handleVerify}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={COLORS.darkBackground} />
            ) : (
              <Text style={styles.nextButtonText}>Verify Identity</Text>
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
  signUpLabel: {
    color: '#607D8B', // Muted blue-grey
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
    marginBottom: SPACING.xl,
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
  errorText: {
    color: '#F44336', // Red inline error
    fontSize: 14,
    marginTop: SPACING.sm,
    fontWeight: '500',
  },
  footer: {
    marginTop: 'auto',
  },
  nextButton: {
    backgroundColor: COLORS.darkAccent,
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
