import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, Dimensions } from 'react-native';

interface Props {
  onFinish: () => void;
}

const BRAND_GREEN = '#4A9B6F';
const { height } = Dimensions.get('window');

// We use 55% of the screen height for the top image.
const IMAGE_HEIGHT = height * 0.55; 

export default function OnboardingScreen({ onFinish }: Props) {
  return (
    <Pressable style={styles.container} onPress={onFinish}>
      {/* Top Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/onboarding_hero.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />
        {/* Black overlay cut-out trick for the curve (or simply applying border radius) */}
        {/* We can achieve the swoosh by wrapping the image in a deeply rounded container */}
      </View>

      {/* Bottom Content Section */}
      <View style={styles.bottomSection}>
        
        {/* The Features Card */}
        <View style={styles.card}>
          <Text style={styles.title}>Payments without limits</Text>
          <Text style={styles.description}>
            No <Text style={styles.highlight}>INTERNET</Text> ? No hassle, with 
            PayStash's innovative offline payments, you can send money, pay bills, 
            and transfer funds securely, even in areas with poor or no connectivity.
          </Text>
        </View>

        {/* Footer */}
        <Text style={styles.footerText}>Tap anywhere on the screen to continue</Text>

        {/* Fake iOS Home Indicator space */}
        <View style={styles.homeIndicatorPlaceholder}>
          <View style={styles.homeIndicator} />
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  imageContainer: {
    height: IMAGE_HEIGHT,
    width: '100%',
    backgroundColor: '#1E1E1E', // Placeholder while image loads
    // The mockup shows a large curve pushing into the black background on the bottom right.
    // We can achieve this by clipping the image wrapper:
    borderBottomRightRadius: 100,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: '100%',
    // Fade top half gracefully if needed, but the mockup is straight image
  },
  bottomSection: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center', // Center card vertically in the remaining space
    alignItems: 'center',
    paddingTop: 10,
  },
  card: {
    width: '100%',
    backgroundColor: '#121212',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: BRAND_GREEN,
    padding: 24,
    shadowColor: BRAND_GREEN,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 5,
    marginBottom: 40,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '800',
    fontFamily: 'sans-serif',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    color: '#A0A0A0', // Light gray 
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '400',
  },
  highlight: {
    color: BRAND_GREEN,
    fontWeight: '700',
  },
  footerText: {
    color: '#888888', // Very dim white/gray
    fontSize: 11,
    letterSpacing: 0.3,
    marginBottom: 20,
  },
  homeIndicatorPlaceholder: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 10,
  },
  homeIndicator: {
    width: 134,
    height: 5,
    backgroundColor: '#FFFFFF',
    borderRadius: 3,
  }
});
