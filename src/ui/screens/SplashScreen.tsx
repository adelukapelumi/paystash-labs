/**
 * SplashScreen.tsx
 *
 * Animated splash screen for PayStash.
 * Animation sequence:
 *  1. Black bg — center green dot appears
 *  2. Orbit dots expand outward (staggered)
 *  3. Background fades from black → PayStash green
 *  4. Dots fade out, "PayStash" text fades in
 *  5. Calls onFinish() to hand off to root navigator
 */

import React, { useEffect, useRef } from 'react';
import { Animated, View, Text, StyleSheet, Easing } from 'react-native';

const CENTER_DOT_SIZE = 8;
const OUTER_DOT_SIZE = 6;
const BRAND_GREEN = '#4A9B6F';
const ORBIT_RADIUS = 80; 
const NUM_ORBIT_DOTS = 8;

interface Props {
  onFinish: () => void;
}

const orbitAngles = Array.from({ length: NUM_ORBIT_DOTS }, (_, i) =>
  (i / NUM_ORBIT_DOTS) * 2 * Math.PI
);

export default function SplashScreen({ onFinish }: Props) {
  // ─── Animated Values ───────────────────────────────────────────────────
  const centerOpacity = useRef(new Animated.Value(0)).current;   // Center dot opacity
  const radiusScale = useRef(new Animated.Value(0)).current;     // Master scale for ring & 8 dots
  const bgAnim = useRef(new Animated.Value(0)).current;          // 0=black → 1=green
  const brandOpacity = useRef(new Animated.Value(0)).current;    // "PayStash" text

  // ─── Easing Functions ──────────────────────────────────────────────────
  // Custom cubic-bezier(0.34, 1.56, 0.64, 1) — slight overshoot bounce
  const easeOutBack = Easing.bezier(0.34, 1.56, 0.64, 1);
  const easeIn = Easing.in(Easing.ease);
  const easeOut = Easing.out(Easing.ease);
  const easeInOut = Easing.inOut(Easing.ease);

  useEffect(() => {
    // ─── Master Timeline ───
    
    // Step 1: (0–200ms) One filled green dot fades in
    Animated.timing(centerOpacity, {
      toValue: 1,
      duration: 200,
      easing: easeOut,
      useNativeDriver: true,
    }).start();

    // Step 2 & 3: (200–1200ms) The Large Circle expands and retracts
    setTimeout(() => {
      Animated.sequence([
        // Step 2 (200-700ms): Expand with cubic-bezier bounce
        Animated.timing(radiusScale, {
          toValue: 1,
          duration: 500,
          easing: easeOutBack,
          useNativeDriver: true,
        }),
        // Step 3 (700-1200ms): Contract with ease-in snap back
        Animated.timing(radiusScale, {
          toValue: 0,
          duration: 500,
          easing: easeIn,
          useNativeDriver: true,
        })
      ]).start();
    }, 200);

    // Step 4: (1200–1500ms) Center dot holds 150ms (1200-1350), fades out 150ms (1350-1500)
    setTimeout(() => {
      Animated.timing(centerOpacity, {
        toValue: 0,
        duration: 150,
        delay: 150, // wait 150ms after starting phase
        easing: easeOut,
        useNativeDriver: true,
      }).start();
    }, 1200);

    // Step 5: (1500–2000ms) Background transitions 300ms, Text fades in 200ms
    setTimeout(() => {
      Animated.parallel([
        Animated.timing(bgAnim, {
          toValue: 1,
          duration: 300,
          easing: easeInOut,
          useNativeDriver: false,
        }),
        Animated.timing(brandOpacity, {
          toValue: 1,
          duration: 200,
          easing: easeOut,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Hold on final frame momentarily before handing off
        setTimeout(onFinish, 200);
      });
    }, 1500);

  }, []);

  const bgColor = bgAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#000000', BRAND_GREEN],
  });

  return (
    <Animated.View 
      style={[styles.splashContainer, { backgroundColor: bgColor }]}
    >
      {/* Animation wrapper centered perfectly */}
      <View style={styles.animationCenterWrapper}>
        
        {/* The Large Wireframe Expanding Circle */}
        <Animated.View
          style={[
            styles.largeRing,
            { transform: [{ scale: radiusScale }] }
          ]}
        />

        {/* The Center Dot */}
        <Animated.View
          style={[styles.centerDot, { opacity: centerOpacity }]}
        />

        {/* The 8 Small Edge Dots */}
        {orbitAngles.map((angle, i) => {
          // Absolute coordinates of the outer radius edges
          const endPositionX = Math.cos(angle) * ORBIT_RADIUS;
          const endPositionY = Math.sin(angle) * ORBIT_RADIUS;

          // As radiusScale grows (0 -> 1), the dot pushes out to its exact circumference spot
          const translateX = radiusScale.interpolate({
            inputRange: [0, 1],
            outputRange: [0, endPositionX],
            // Use extrapolate='extend' implicitly to allow the bezier overshoot
          });
          const translateY = radiusScale.interpolate({
            inputRange: [0, 1],
            outputRange: [0, endPositionY],
          });
          
          // "fade out over ~80ms on arrival" during the 500ms contraction.
          // 80ms/500ms = 0.16. So opacity maps 0 between [0, 0.16] scale.
          const opacity = radiusScale.interpolate({
            inputRange: [0, 0.16, 0.5],
            outputRange: [0, 1, 1],
            extrapolate: 'clamp'
          });

          return (
            <Animated.View
              key={i}
              style={[
                styles.outerDot,
                {
                  opacity,
                  transform: [
                    { translateX },
                    { translateY }
                  ],
                }
              ]}
            />
          );
        })}
      </View>

      {/* Brand text */}
      <Animated.View
        style={[
          styles.splashBrandWrapper,
          {
            opacity: brandOpacity,
          }
        ]}
      >
        <Text style={styles.splashBrandText}>PayStash</Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#000000', // start black
  },
  animationCenterWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerDot: {
    width: CENTER_DOT_SIZE,
    height: CENTER_DOT_SIZE,
    borderRadius: CENTER_DOT_SIZE / 2,
    backgroundColor: BRAND_GREEN,
    position: 'absolute',
  },
  largeRing: {
    width: ORBIT_RADIUS * 2,
    height: ORBIT_RADIUS * 2,
    borderRadius: ORBIT_RADIUS,
    borderWidth: 1.5,
    borderColor: BRAND_GREEN,
    position: 'absolute',
    opacity: 0.5, // requested opacity 0.5
  },
  outerDot: {
    width: OUTER_DOT_SIZE,
    height: OUTER_DOT_SIZE,
    borderRadius: OUTER_DOT_SIZE / 2,
    backgroundColor: BRAND_GREEN,
    position: 'absolute',
  },
  splashBrandWrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashBrandText: {
    fontSize: 30, // Specified ~30px
    fontFamily: 'sans-serif', // Clean sans-serif
    fontWeight: '500', // Medium-weight
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});
