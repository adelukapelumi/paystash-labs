import React, { useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../theme';

const { width } = Dimensions.get('window');

interface SignUpSuccessScreenProps {
  onContinue: () => void;
}

export default function SignUpSuccessScreen({ onContinue }: SignUpSuccessScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, 2500);
    return () => clearTimeout(timer);
  }, [onContinue]);
  return (
    <View style={styles.container}>
      <Text style={styles.successLabel}>Sign-up complete</Text>
      
      <View style={styles.centerContent}>
        <View style={styles.circle}>
          <Ionicons name="checkmark" size={64} color="white" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBackground,
    paddingHorizontal: SPACING.lg,
    paddingTop: 60,
  },
  successLabel: {
    color: '#9CA3AF', // Light grey
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#4CAF50', // Success green
    justifyContent: 'center',
    alignItems: 'center',
    // Optional shadow for depth
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
});
