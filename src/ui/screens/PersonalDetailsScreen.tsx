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
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';

const { width } = Dimensions.get('window');

interface PersonalDetailsScreenProps {
  onNext: (details: any) => void;
  onBack: () => void;
}

export default function PersonalDetailsScreen({ onNext, onBack }: PersonalDetailsScreenProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Top Header - Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Ionicons name="chevron-back" size={24} color={COLORS.darkText} />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.signUpLabel}>Sign up-03</Text>
            <Text style={styles.title}>Let's get you started</Text>
          </View>

          {/* Progress Indicator - Step 3 of 4 */}
          <View style={styles.progressContainer}>
            <View style={[styles.progressSegment, styles.activeSegment]} />
            <View style={[styles.progressSegment, styles.activeSegment]} />
            <View style={[styles.progressSegment, styles.activeSegment]} />
            <View style={styles.progressSegment} />
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>First name</Text>
              <TextInput
                style={styles.input}
                placeholder="John"
                placeholderTextColor={COLORS.darkTextSecondary}
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Last name</Text>
              <TextInput
                style={styles.input}
                placeholder="Doe"
                placeholderTextColor={COLORS.darkTextSecondary}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                placeholder="234 123 456 7890"
                placeholderTextColor={COLORS.darkTextSecondary}
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.darkTextSecondary}
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={COLORS.darkTextSecondary}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry
              />
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.nextButton}
              onPress={() => onNext({ firstName, lastName, phone, password })}
            >
              <Text style={styles.nextButtonText}>Next</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBackground,
  },
  scrollContent: {
    flexGrow: 1,
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
