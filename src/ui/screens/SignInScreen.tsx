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
  SafeAreaView,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { useApp } from '../../context/AppContext';

const { width, height } = Dimensions.get('window');

// Custom Green corresponding to the prompt
const ACCENT_GREEN = '#4CAF50'; 

interface SignInScreenProps {
  onSignInSuccess: () => void;
  onSignUpPress: () => void;
}

export default function SignInScreen({ onSignInSuccess, onSignUpPress }: SignInScreenProps) {
  const { login } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);

  const handleAdminSignIn = async () => {
    const success = await login(email, password);
    if (success) {
      onSignInSuccess();
    } else {
      Alert.alert('Error', 'Invalid credentials or service unavailable.');
    }
  };

  const handleQuickAdminPass = async () => {
    const success = await login('admin@app.com', 'admin1234');
    if (success) {
      onSignInSuccess();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Hero Section with Large Arc */}
      <View style={styles.heroSection}>
        <View style={styles.arcContainer}>
            <View style={styles.arcLine} />
        </View>
      </View>

      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.keyboardView}
          >
            <View style={styles.card}>
              <TouchableOpacity onLongPress={() => setShowAdmin(!showAdmin)} activeOpacity={1}>
                <Text style={styles.title}>Sign in</Text>
              </TouchableOpacity>

              {/* Social Buttons */}
              <TouchableOpacity style={styles.socialBtn}>
                <Ionicons name="logo-apple" size={24} color="white" style={styles.socialIcon} />
                <Text style={styles.socialBtnText}>Sign in with apple</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialBtn}>
                <View style={styles.googleIconContainer}>
                   <FontAwesome name="google" size={18} color="white" />
                </View>
                <Text style={styles.socialBtnText}>Sign in with google</Text>
              </TouchableOpacity>

              {/* Quick Admin Pass Button */}
              <TouchableOpacity style={styles.adminPassBtn} onPress={handleQuickAdminPass}>
                <Ionicons name="key-outline" size={20} color={ACCENT_GREEN} style={styles.socialIcon} />
                <Text style={[styles.socialBtnText, { color: ACCENT_GREEN }]}>ADMIN PASS</Text>
              </TouchableOpacity>

              {/* Admin Bypass Fields (Hidden until title long-pressed) */}
              {showAdmin && (
                <View style={styles.adminFields}>
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password"
                    placeholderTextColor="rgba(255,255,255,0.4)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                  />
                  <TouchableOpacity style={styles.signInBtn} onPress={handleAdminSignIn}>
                      <Text style={styles.signInBtnText}>SIGN IN</Text>
                  </TouchableOpacity>
                </View>
              )}

              <TouchableOpacity onPress={onSignUpPress} style={styles.signUpLink}>
                <Text style={styles.footerTextPrimary}>
                  Don't have an account? <Text style={styles.signUpText}>Sign up</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* Terms Footer */}
            <View style={styles.footer}>
              <Text style={styles.legalText}>
                By using this app you agree to all of our{' '}
                <Text style={styles.legalHighlight}>Terms and Conditions</Text>
              </Text>
            </View>
          </KeyboardAvoidingView>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Deep black
  },
  heroSection: {
    position: 'absolute',
    top: 0,
    width: width,
    height: height,
    overflow: 'hidden',
  },
  arcContainer: {
    position: 'absolute',
    top: -height * 0.3,
    right: -width * 0.7,
    width: width * 2,
    height: width * 2,
  },
  arcLine: {
    width: '100%',
    height: '100%',
    borderRadius: width,
    borderWidth: 4,
    borderColor: '#4EA8DE', // Match the blue-green arc color from image
    opacity: 0.6,
  },
  safeArea: {
    flex: 1,
  },
  keyboardView: {
    width: '100%',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#1B2E1B', // Dark green tint gradient start
    borderRadius: 35,
    padding: 30,
    width: Platform.OS === 'web' ? Math.min(width * 0.9, 400) : '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 10,
    // Gradient simulation
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  title: {
    color: 'white',
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 35,
    letterSpacing: 0.5,
  },
  socialBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4E6C4E', // Muted green-grey for buttons
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  socialIcon: {
    marginRight: 15,
  },
  googleIconContainer: {
    width: 24,
    height: 24,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  socialBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
  adminPassBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.05)', // Very faint green
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 25,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.3)', // Subtle green border
    justifyContent: 'center',
  },
  adminFields: {
    marginTop: 10,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  input: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    color: 'white',
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  signInBtn: {
    backgroundColor: ACCENT_GREEN,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  signInBtnText: {
    color: 'white',
    fontWeight: '700',
  },
  signUpLink: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerTextPrimary: {
    color: '#CCCCCC',
    fontSize: 14,
  },
  signUpText: {
    color: ACCENT_GREEN, // Green as seen in the mockup
    fontWeight: '700',
  },
  footer: {
    marginTop: 50,
    paddingHorizontal: 40,
  },
  legalText: {
    color: '#999',
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 18,
  },
  legalHighlight: {
    color: ACCENT_GREEN, // Green as seen in the mockup
  },
});
