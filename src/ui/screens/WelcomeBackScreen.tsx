import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Image,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { COLORS, SPACING, BORDER_RADIUS } from '../theme';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

interface WelcomeBackScreenProps {
  onSignIn: () => void;
  onReset: () => void;
}

export default function WelcomeBackScreen({ onSignIn, onReset }: WelcomeBackScreenProps) {
  const { user } = useApp();

  return (
    <View style={styles.container}>
      {/* Background Watermark Pattern */}
      <View style={styles.watermarkTop}>
        <View style={styles.diamondLarge} />
        <View style={styles.diamondSmall} />
      </View>
      <View style={styles.watermarkBottom}>
        <View style={styles.diamondLarge} />
        <View style={styles.diamondSmall} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <View style={styles.logoSection}>
              <Ionicons name="diamond" size={28} color={COLORS.darkAccent} style={styles.logoIcon} />
              <Text style={styles.appName}>access</Text>
            </View>
            <View style={styles.topRightIcons}>
              <TouchableOpacity style={styles.iconBtn}>
                <Ionicons name="notifications-outline" size={24} color="white" />
                <View style={styles.notificationBadge} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.countrySelector}>
                <Image 
                  source={{ uri: 'https://flagcdn.com/w40/ng.png' }} 
                  style={styles.flag} 
                />
                <Ionicons name="chevron-down" size={14} color="white" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Greeting */}
          <View style={styles.greetingSection}>
            <Text style={styles.welcomeText}>
              Welcome back, <Text style={styles.userName}>{user?.full_name || 'Great'}</Text>
            </Text>
          </View>

          {/* Login Form */}
          <View style={styles.formSection}>
            <View style={styles.inputContainer}>
              <Ionicons name="lock-closed-outline" size={22} color={COLORS.darkTextSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor={COLORS.darkTextSecondary}
                secureTextEntry
              />
            </View>
            
            <TouchableOpacity style={styles.forgotBtn} onPress={onReset}>
              <Text style={styles.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.biometricBtn} onPress={onSignIn}>
              <Text style={styles.biometricBtnText}>SIGN IN WITH BIOMETRICS</Text>
            </TouchableOpacity>

            <View style={styles.switchAccountSection}>
              <Text style={styles.switchText}>
                Not {user?.full_name || 'Great'}?{' '}
                <TouchableOpacity onPress={onReset}>
                    <Text style={styles.unlockText}>Unlock device</Text>
                </TouchableOpacity>
              </Text>
            </View>
          </View>

          {/* Links and Shortcuts */}
          <View style={styles.lowerSection}>
            <View style={styles.linksRow}>
              <TouchableOpacity style={styles.inlineLink}>
                <Text style={styles.linkText}>Internet Banking</Text>
                <MaterialCommunityIcons name="open-in-new" size={14} color={COLORS.darkAccent} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.inlineLink}>
                <Text style={styles.linkText}>Privacy Policy</Text>
                <MaterialCommunityIcons name="open-in-new" size={14} color={COLORS.darkAccent} />
              </TouchableOpacity>
            </View>

            <View style={styles.shortcutsRow}>
              <TouchableOpacity style={styles.shortcutCard}>
                <Text style={styles.shortcutTitle}>1-Tap Payment</Text>
                <Ionicons name="star-outline" size={18} color={COLORS.darkAccent} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.shortcutCard}>
                <Text style={styles.shortcutTitle}>BreezePay</Text>
                <MaterialCommunityIcons name="atm" size={18} color={COLORS.darkAccent} />
              </TouchableOpacity>
            </View>

            <Text style={styles.copyrightText}>
              © Access Bank PLC. (Licensed by the Central Bank of Nigeria)
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Tab Bar */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="lock-closed" size={24} color={COLORS.darkAccent} />
          <Text style={[styles.navText, { color: COLORS.darkAccent }]}>Login</Text>
          <View style={styles.activeTabIndicator} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="card-outline" size={24} color={COLORS.darkTextSecondary} />
          <Text style={styles.navText}>Quick Services</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <View style={styles.scanBtnContainer}>
            <Ionicons name="qr-code-outline" size={24} color={COLORS.darkTextSecondary} />
          </View>
          <Text style={styles.navText}>Scan</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="headset-outline" size={24} color={COLORS.darkTextSecondary} />
          <Text style={styles.navText}>Support</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.navItem}>
          <Ionicons name="settings-outline" size={24} color={COLORS.darkTextSecondary} />
          <Text style={styles.navText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.darkBackground,
  },
  watermarkTop: {
    position: 'absolute',
    top: -40,
    right: -40,
    opacity: 0.1,
  },
  watermarkBottom: {
    position: 'absolute',
    bottom: 120,
    left: -40,
    opacity: 0.1,
    transform: [{ rotate: '180deg' }],
  },
  diamondLarge: {
    width: 240,
    height: 240,
    borderWidth: 30,
    borderColor: '#333',
    transform: [{ rotate: '45deg' }],
  },
  diamondSmall: {
    width: 120,
    height: 120,
    borderWidth: 15,
    borderColor: '#333',
    position: 'absolute',
    top: 60,
    left: 60,
    transform: [{ rotate: '45deg' }],
  },
  scrollContent: {
    paddingHorizontal: SPACING.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 120,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 80,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    marginRight: 4,
    transform: [{ rotate: '45deg' }],
  },
  appName: {
    color: 'white',
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -1.5,
  },
  topRightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    marginRight: SPACING.md,
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF3B30',
    borderWidth: 1,
    borderColor: COLORS.darkBackground,
  },
  countrySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: BORDER_RADIUS.full,
  },
  flag: {
    width: 24,
    height: 16,
    marginRight: 4,
    borderRadius: 2,
  },
  greetingSection: {
    alignItems: 'center',
    marginBottom: 60,
  },
  welcomeText: {
    color: COLORS.darkTextSecondary,
    fontSize: 24,
    fontWeight: '300',
    textAlign: 'center',
  },
  userName: {
    color: 'white',
    fontWeight: '700',
  },
  formSection: {
    width: '100%',
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    height: 64,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  input: {
    flex: 1,
    color: 'white',
    marginLeft: SPACING.sm,
    fontSize: 18,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: SPACING.sm,
    marginBottom: 32,
  },
  forgotText: {
    color: COLORS.darkAccent,
    fontSize: 14,
    fontWeight: '600',
  },
  biometricBtn: {
    backgroundColor: COLORS.darkAccent,
    height: 64,
    borderRadius: BORDER_RADIUS.md,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.darkAccent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
  },
  biometricBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  switchAccountSection: {
    alignItems: 'center',
    marginTop: 32,
  },
  switchText: {
    color: COLORS.darkTextSecondary,
    fontSize: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  unlockText: {
    color: COLORS.darkAccent,
    fontWeight: '700',
  },
  lowerSection: {
    marginTop: 20,
  },
  linksRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 40,
    marginBottom: 32,
  },
  inlineLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  linkText: {
    color: COLORS.darkAccent,
    fontSize: 14,
    fontWeight: '600',
  },
  shortcutsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  shortcutCard: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    width: '48%',
    height: 64,
    borderRadius: BORDER_RADIUS.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: '#222',
  },
  shortcutTitle: {
    color: COLORS.darkAccent,
    fontSize: 14,
    fontWeight: '700',
  },
  copyrightText: {
    color: COLORS.darkTextSecondary,
    fontSize: 11,
    textAlign: 'center',
    opacity: 0.5,
    fontStyle: 'italic',
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 85,
    backgroundColor: '#0A0A0A',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 25,
    borderTopWidth: 1,
    borderTopColor: '#1A1A1A',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    position: 'relative',
  },
  activeTabIndicator: {
    position: 'absolute',
    top: -10,
    width: 20,
    height: 3,
    backgroundColor: COLORS.darkAccent,
    borderRadius: 2,
  },
  navText: {
    color: COLORS.darkTextSecondary,
    fontSize: 10,
    marginTop: 6,
    fontWeight: '600',
  },
  scanBtnContainer: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
