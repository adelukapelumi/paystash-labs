import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar as RNStatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useApp } from '../../context/AppContext';

const { width } = Dimensions.get('window');

// Blank black status bar area
const CustomStatusBar = () => (
  <View style={styles.statusBar} />
);

export interface DashboardScreenProps {
  onGeneratePress: () => void;
  onDepositPress: () => void;
  onWithdrawPress: () => void;
}

export default function DashboardScreen({ onGeneratePress, onDepositPress, onWithdrawPress }: DashboardScreenProps) {
  const { user, logout } = useApp();
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  // Mocked transactions strictly matching the image
  const transactions = [
    { id: '1', type: 'debit', title: 'Sent to Aina Olabisi', date: '22-07-26', amount: '5000.00' },
    { id: '2', type: 'credit', title: 'Received from Uche', date: '22-07-26', amount: '10000.00' },
    { id: '3', type: 'debit', title: 'Sent to michael obi', date: '22-07-26', amount: '25000.00' },
  ];

  return (
    <View style={styles.container}>
      <RNStatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <CustomStatusBar />
        <ScrollView 
          style={styles.scrollContainer} 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerArea}>
            <Text style={styles.greetingText}>Good Morning, TJ</Text>
          </View>

          {/* Wallet Card */}
          <View style={styles.walletCard}>
            <Text style={styles.walletLabel}>Online wallet</Text>
            <View style={styles.walletContent}>
              <Text style={styles.balanceText}>
                {isBalanceHidden ? "₦ *****.**" : "₦50000.00"}
              </Text>
              <TouchableOpacity onPress={() => setIsBalanceHidden(!isBalanceHidden)} style={styles.toggleBtn}>
                <Ionicons 
                  name={isBalanceHidden ? "eye-off-outline" : "eye-outline"} 
                  size={24} 
                  color="#4CAF50" 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Actions */}
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionsContainer}>
            <View style={styles.actionsRow}>
              <View style={styles.actionItem}>
                <TouchableOpacity style={styles.actionBtn} onPress={onGeneratePress}>
                  <MaterialCommunityIcons name="qrcode-scan" size={26} color="#4CAF50" />
                </TouchableOpacity>
                <Text style={styles.actionLabel}>Generate</Text>
              </View>
              <View style={styles.actionItem}>
                <TouchableOpacity style={styles.actionBtn} onPress={onWithdrawPress}>
                  <MaterialCommunityIcons name="cash-fast" size={26} color="#4CAF50" />
                </TouchableOpacity>
                <Text style={styles.actionLabel}>Withdraw</Text>
              </View>
              <View style={styles.actionItem}>
                <TouchableOpacity style={styles.actionBtn} onPress={onDepositPress}>
                  <MaterialCommunityIcons name="bank-transfer" size={26} color="#4CAF50" />
                </TouchableOpacity>
                <Text style={styles.actionLabel}>Deposit</Text>
              </View>
            </View>
          </View>

          {/* Transaction History */}
          <View style={styles.historyHeader}>
            <Text style={styles.sectionTitle}>Transaction History</Text>
            <TouchableOpacity>
              <Text style={styles.seeMore}>See more</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.historyList}>
            {transactions.map((tx) => (
              <View key={tx.id} style={styles.txItem}>
                <View style={styles.txIconContainer}>
                  <Ionicons 
                    name={tx.type === 'debit' ? "arrow-up-outline" : "arrow-down-outline"} 
                    size={20} 
                    color={tx.type === 'debit' ? '#FF3B30' : '#4CAF50'} 
                  />
                </View>
                <View style={styles.txBody}>
                  <Text style={styles.txTitle}>{tx.title}</Text>
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>
                <Text style={[styles.txAmount, tx.type === 'debit' ? styles.negative : styles.positive]}>
                  {tx.type === 'debit' ? '-' : '+'}₦{tx.amount}
                </Text>
              </View>
            ))}
          </View>

          {/* Featured */}
          <Text style={styles.sectionTitle}>Featured</Text>
          <View style={styles.featuredBox} />

        </ScrollView>
      </SafeAreaView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="home-outline" size={26} color="#4CAF50" />
          <Text style={[styles.tabLabel, { color: '#4CAF50' }]}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="analytics-outline" size={26} color="#666" />
          <Text style={styles.tabLabel}>Analytics</Text>
        </TouchableOpacity>
        
        <View style={styles.fabWrapper}>
          <TouchableOpacity style={styles.fab}>
            <Ionicons name="scan-outline" size={30} color="black" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.tabItem}>
          <Ionicons name="time-outline" size={26} color="#666" />
          <Text style={styles.tabLabel}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={logout}>
          <Ionicons name="person-outline" size={26} color="#666" />
          <Text style={styles.tabLabel}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  safeArea: {
    flex: 1,
  },
  statusBar: {
    height: 44,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#000',
  },
  statusBarTime: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
  },
  headerIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIcon: {
    marginLeft: 8,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 25,
    paddingTop: 20,
    paddingBottom: 120, // Tab bar space
  },
  headerArea: {
    marginTop: 10,
    marginBottom: 25,
  },
  greetingText: {
    color: '#FFF',
    fontSize: 24,
    fontWeight: '700',
  },
  walletCard: {
    backgroundColor: '#0A0E0A', // Deep green-black
    borderRadius: 35,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.15)',
    marginBottom: 30,
  },
  walletLabel: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  walletContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  balanceText: {
    color: '#4CAF50',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  toggleBtn: {
    marginBottom: 6,
  },
  sectionTitle: {
    color: '#FFF',
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 15,
  },
  actionsContainer: {
    backgroundColor: '#111',
    borderRadius: 35,
    padding: 24,
    marginBottom: 30,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionItem: {
    alignItems: 'center',
    width: (width - 100) / 3,
  },
  actionBtn: {
    backgroundColor: '#000',
    width: 68,
    height: 68,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#222',
  },
  actionLabel: {
    color: '#4CAF50',
    fontSize: 13, // Slightly bigger and bolder
    fontWeight: '700',
    opacity: 0.9,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  seeMore: {
    color: '#666',
    fontSize: 13,
    fontWeight: '600',
    marginRight: 5,
  },
  historyList: {
    marginBottom: 30,
  },
  txItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0C0C0C',
    padding: 16,
    borderRadius: 28,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.03)',
  },
  txIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: '#111',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  txBody: {
    flex: 1,
  },
  txTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 3,
  },
  txDate: {
    color: '#444',
    fontSize: 12,
    fontWeight: '600',
  },
  txAmount: {
    fontSize: 15,
    fontWeight: '700',
  },
  negative: {
    color: '#FF3B30',
  },
  positive: {
    color: '#4CAF50',
  },
  featuredBox: {
    backgroundColor: '#111',
    height: 120,
    borderRadius: 35,
    marginTop: 5,
  },
  tabBar: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 25 : 15,
    left: 20,
    right: 20,
    height: 85,
    backgroundColor: '#121212',
    borderRadius: 42,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.7,
    shadowRadius: 15,
    elevation: 10,
    paddingHorizontal: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  tabLabel: {
    color: '#666',
    fontSize: 11,
    marginTop: 6,
    fontWeight: '700',
  },
  fabWrapper: {
    marginTop: -40,
  },
  fab: {
    backgroundColor: '#4CAF50',
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: '#000',
  },
});
