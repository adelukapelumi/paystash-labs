import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Crypto from 'expo-crypto';

interface GeneratedQRScreenProps {
  amount: string;
  recipientId: string;
  onBack: () => void;
  onGenerateNew: () => void;
}

export default function GeneratedQRScreen({ amount, recipientId, onBack, onGenerateNew }: GeneratedQRScreenProps) {
  const [qrPayload, setQrPayload] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const isExpired = timeLeft === 0;

  useEffect(() => {
    const generateOfflinePayload = async () => {
      try {
        const timestamp = new Date().toISOString();
        const expiresAt = new Date(Date.now() + 5 * 60000).toISOString();
        const nonce = Crypto.randomUUID();
        const txn_id = Crypto.randomUUID();
        
        const baseData = {
          txn_id,
          sender_id: "usr_active_9281",
          recipient_id: recipientId,
          amount: Number(amount) || 0,
          currency: "NGN",
          nonce,
          timestamp,
          expires_at: expiresAt,
          device_id: "dev_mob_8472",
          type: "offline_payment",
          version: "1.0",
        };

        const secret = "paystash_offline_secret_v1";
        const dataString = JSON.stringify(baseData) + secret;
        const checksum = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          dataString
        );

        const finalPayload = {
          ...baseData,
          checksum,
        };

        setQrPayload(JSON.stringify(finalPayload));
      } catch (error) {
        console.error('Failed to generate payload', error);
      }
    };

    generateOfflinePayload();
  }, [amount, recipientId]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Generated</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* QR Section */}
        <View style={styles.content}>
          <Text style={styles.subtext}>QR code for the transfer of</Text>
          <Text style={styles.amountText}>₦{Number(amount).toLocaleString()}</Text>

          <View style={styles.qrWrapper}>
            {qrPayload ? (
              <View style={styles.qrContainer}>
                <View style={isExpired ? { opacity: 0.1 } : { opacity: 1 }}>
                  <QRCode
                    value={qrPayload}
                    size={220}
                    color="#4CAF50"
                    backgroundColor="#000000"
                    logoBackgroundColor="transparent"
                  />
                </View>

                {isExpired && (
                  <View style={styles.expiredOverlay}>
                    <Ionicons name="warning" size={40} color="#FF3B30" />
                    <Text style={styles.expiredTitle}>QR Expired</Text>
                    <Text style={styles.expiredSubtext}>This code is no longer valid.</Text>
                    <TouchableOpacity style={styles.newCodeBtn} onPress={onGenerateNew}>
                      <Text style={styles.newCodeBtnText}>Generate New</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            ) : (
              <View style={[styles.qrPlaceholder, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color="#4CAF50" />
              </View>
            )}
          </View>

          {/* Countdown Display */}
          <View style={styles.timerContainer}>
            <Ionicons name="time-outline" size={20} color={isExpired ? "#FF3B30" : "#4CAF50"} />
            <Text style={[styles.timerText, isExpired && { color: "#FF3B30" }]}>
              {isExpired ? "00:00" : formatTime(timeLeft)}
            </Text>
          </View>
        </View>
      </SafeAreaView>
         {/* Custom Home Indicator */}
      <View style={styles.homeIndicator} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Deep black for seamless matrix aesthetic
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight || 20 : 0,
    paddingVertical: 15,
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  subtext: {
    color: '#888888',
    fontSize: 14,
    marginBottom: 5,
  },
  amountText: {
    color: 'white',
    fontSize: 22,
    fontWeight: '800',
    marginBottom: 60,
  },
  qrWrapper: {
    padding: 0,
    backgroundColor: '#000000',
  },
  qrPlaceholder: {
    width: 220,
    height: 220,
  },
  homeIndicator: {
    width: 140,
    height: 5,
    backgroundColor: '#333',
    alignSelf: 'center',
    borderRadius: 10,
    marginBottom: 10,
  },
  qrContainer: {
    width: 220,
    height: 220,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expiredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  expiredTitle: {
    color: '#FF3B30',
    fontSize: 20,
    fontWeight: '800',
    marginTop: 10,
  },
  expiredSubtext: {
    color: '#CCC',
    fontSize: 12,
    marginTop: 5,
    marginBottom: 20,
  },
  newCodeBtn: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  newCodeBtnText: {
    color: '#000',
    fontWeight: '700',
    fontSize: 14,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 40,
    backgroundColor: '#111',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  timerText: {
    color: '#4CAF50',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
    fontVariant: ['tabular-nums'],
  },
});
