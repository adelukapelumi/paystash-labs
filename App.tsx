import React, { useState } from 'react';
import { ActivityIndicator, View, Text, Button, ScrollView, Alert, StyleSheet, TextInput, TouchableOpacity, Modal, FlatList, Linking } from 'react-native';
import './global.css';

import { AppProvider, useApp } from './src/context/AppContext';
import SplashScreen from './src/ui/screens/SplashScreen';
import RegisterScreen from './src/ui/screens/RegisterScreen';
import SignUpScreen from './src/ui/screens/SignUpScreen';
import LoginScreen from './src/ui/screens/LoginScreen';
import DashboardScreen from './src/ui/screens/DashboardScreen';
import GenerateScreen from './src/ui/screens/GenerateScreen';
import GeneratedQRScreen from './src/ui/screens/GeneratedQRScreen';
import TopUpScreen from './src/ui/screens/TopUpScreen';
import WithdrawScreen from './src/ui/screens/WithdrawScreen';

import { getDb } from './src/database/DatabaseService';
import { stashFunds, debug_injectOnlineBalance } from './src/database/VaultDAO';
import { getHistory, Transaction, clearHistory } from './src/engine/LedgerService';
import { syncWithBackend, SyncResult } from './src/engine/SyncManager';
import { initializeCharge } from './src/services/KorapayService';

/**
 * JS-Only Navigator (Fallback for missing Native Linkage)
 * Replaces React Navigation's Stack to prevent TurboModule crashes during dev.
 */
const NavigationContainer = ({ children }: any) => <View style={{ flex: 1 }}>{children}</View>;

const Stack = {
  Navigator: ({ children }: any) => {
    // Finds the first truthy child (handles ternary operator conditional rendering)
    const activeRoute = React.Children.toArray(children).find(child => !!child);
    if (!activeRoute) return null;
    const Component = (activeRoute as any).props.component;
    return <Component />;
  },
  Screen: (props: any) => null, // Just a definition placeholder
};
import OTPVerificationScreen from './src/ui/screens/OTPVerificationScreen';
import PersonalDetailsScreen from './src/ui/screens/PersonalDetailsScreen';
import SignUpSuccessScreen from './src/ui/screens/SignUpSuccessScreen';
import WelcomeBackScreen from './src/ui/screens/WelcomeBackScreen';
import SignInScreen from './src/ui/screens/SignInScreen';
import VerifyIdentityScreen from './src/ui/screens/VerifyIdentityScreen';

type UnauthRoutes = 'SignIn' | 'SignUpEmail' | 'SignUpOTP' | 'SignUpPersonal' | 'SignUpVerifyIdentity' | 'SignUpSuccess';

// ─── Root Navigator ──────────────────────────────────────────────────────────
function RootNavigator() {
  const { isLoading, isDbReady, isAuthenticated, isRegistered, refreshBalances } = useApp();
  const [currentAuthScreen, setCurrentAuthScreen] = useState<'Dashboard' | 'Generate' | 'GeneratedQR' | 'TopUp' | 'Withdraw'>('Dashboard');
  const [currentUnauthScreen, setCurrentUnauthScreen] = useState<UnauthRoutes>('SignIn');
  const [qrData, setQrData] = useState<{ amount: string; recipientId: string } | null>(null);
  
  // Registration data state
  const [regEmail, setRegEmail] = useState('');

  React.useEffect(() => {
    if (__DEV__ && isDbReady) {
      const injectDebugFunds = async () => {
        try {
          const db = await getDb();
          await debug_injectOnlineBalance(db, 50000);
          await refreshBalances();
        } catch (error) {
          console.error('Failed to inject debug funds:', error);
        }
      };
      injectDebugFunds();
    }
  }, [isDbReady, refreshBalances]);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          // Authenticated state: Show Dashboard or Generate
          currentAuthScreen === 'Dashboard' ? (
            <Stack.Screen 
              name="Dashboard" 
              component={() => (
                <DashboardScreen 
                  onGeneratePress={() => setCurrentAuthScreen('Generate')} 
                  onDepositPress={() => setCurrentAuthScreen('TopUp')}
                  onWithdrawPress={() => setCurrentAuthScreen('Withdraw')}
                />
              )} 
            />
          ) : currentAuthScreen === 'Generate' ? (
            <Stack.Screen 
              name="Generate" 
              component={() => (
                <GenerateScreen 
                  onBack={() => setCurrentAuthScreen('Dashboard')} 
                  onGenerate={(data) => {
                    setQrData(data);
                    setCurrentAuthScreen('GeneratedQR');
                  }} 
                />
              )} 
            />
          ) : currentAuthScreen === 'GeneratedQR' && qrData ? (
            <Stack.Screen 
              name="GeneratedQR" 
              component={() => (
                <GeneratedQRScreen 
                  amount={qrData.amount} 
                  recipientId={qrData.recipientId} 
                  onBack={() => setCurrentAuthScreen('Dashboard')} 
                  onGenerateNew={() => setCurrentAuthScreen('Generate')}
                />
              )} 
            />
          ) : currentAuthScreen === 'TopUp' ? (
            <Stack.Screen 
              name="TopUp" 
              component={() => (
                <TopUpScreen 
                  onBack={() => setCurrentAuthScreen('Dashboard')} 
                />
              )} 
            />
          ) : currentAuthScreen === 'Withdraw' ? (
            <Stack.Screen 
              name="Withdraw" 
              component={() => (
                <WithdrawScreen 
                  onBack={() => setCurrentAuthScreen('Dashboard')} 
                />
              )} 
            />
          ) : null
        ) : (
          // Not Authenticated: Show SignIn or Multistep Sign Up
          currentUnauthScreen === 'SignIn' ? (
            <Stack.Screen 
              name="SignIn" 
              component={() => (
                <SignInScreen 
                  onSignInSuccess={() => {
                    console.log('Login successful (handled by AppContext state switch)');
                  }} 
                  onSignUpPress={() => {
                    setCurrentUnauthScreen('SignUpEmail');
                  }} 
                />
              )} 
            />
          ) : currentUnauthScreen === 'SignUpEmail' ? (
            <Stack.Screen 
              name="SignUpEmail" 
              component={() => (
                <SignUpScreen 
                  onNext={(email) => {
                    setRegEmail(email);
                    setCurrentUnauthScreen('SignUpOTP');
                  }} 
                  onSignIn={() => setCurrentUnauthScreen('SignIn')} 
                />
              )} 
            />
          ) : currentUnauthScreen === 'SignUpOTP' ? (
            <Stack.Screen 
              name="SignUpOTP" 
              component={() => (
                <OTPVerificationScreen 
                  email={regEmail}
                  onNext={() => setCurrentUnauthScreen('SignUpPersonal')} 
                  onBack={() => setCurrentUnauthScreen('SignUpEmail')} 
                />
              )} 
            />
          ) : currentUnauthScreen === 'SignUpPersonal' ? (
            <Stack.Screen 
              name="SignUpPersonal" 
              component={() => (
                <PersonalDetailsScreen 
                  onNext={(details) => setCurrentUnauthScreen('SignUpVerifyIdentity')} 
                  onBack={() => setCurrentUnauthScreen('SignUpOTP')} 
                />
              )} 
            />
          ) : currentUnauthScreen === 'SignUpVerifyIdentity' ? (
            <Stack.Screen 
              name="SignUpVerifyIdentity" 
              component={() => (
                <VerifyIdentityScreen 
                  onNext={() => setCurrentUnauthScreen('SignUpSuccess')} 
                  onBack={() => setCurrentUnauthScreen('SignUpPersonal')} 
                />
              )} 
            />
          ) : currentUnauthScreen === 'SignUpSuccess' ? (
            <Stack.Screen 
              name="SignUpSuccess" 
              component={() => (
                <SignUpSuccessScreen 
                  onContinue={() => setCurrentUnauthScreen('SignIn')} 
                />
              )} 
            />
          ) : null
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

import OnboardingScreen from './src/ui/screens/OnboardingScreen';

// ─── Main Entry Point ────────────────────────────────────────────────────────
export default function App() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const [isOnboardingVisible, setIsOnboardingVisible] = useState(true);

  if (isSplashVisible) {
    return <SplashScreen onFinish={() => setIsSplashVisible(false)} />;
  }

  if (isOnboardingVisible) {
    return <OnboardingScreen onFinish={() => setIsOnboardingVisible(false)} />;
  }

  return (
    <AppProvider>
      <RootNavigator />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
