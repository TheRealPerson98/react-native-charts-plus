import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import type { BarChartProps, DataPoint } from '../types';

const DEFAULT_HEIGHT = 200;
const DEFAULT_WIDTH = Dimensions.get('window').width - 40;
const DEFAULT_BAR_WIDTH = 30;
const DEFAULT_SPACING = 10;
const DEFAULT_ANIMATION_DURATION = 500;

export const BarChart: FC<BarChartProps> = ({
  data,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  barWidth = DEFAULT_BAR_WIDTH,
  spacing = DEFAULT_SPACING,
  showValues = true,
  showLabels = true,
  valueFormatter = (value: number) => `${value}`,
  style,
  barStyle,
  labelStyle,
  valueStyle,
  animated = true,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  onBarPress,
}) => {
  // Find the maximum value to scale the bars
  const maxValue = Math.max(...data.map((item: DataPoint) => item.value));

  // Create animated values for each bar
  const animatedValues = useRef<Animated.Value[]>(
    data.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (animated) {
      // Animate all bars simultaneously
      Animated.parallel(
        animatedValues.map((animatedValue: Animated.Value) =>
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: false,
          })
        )
      ).start();
    } else {
      // Set all bars to full height immediately
      animatedValues.forEach((animatedValue: Animated.Value) => {
        animatedValue.setValue(1);
      });
    }
  }, [animated, animatedValues, animationDuration, data]);

  return (
    <View style={[styles.container, { width, height }, style]}>
      <View style={styles.chartContainer}>
        {data.map((item: DataPoint, index: number) => {
          const barHeight = (item.value / maxValue) * height * 0.8;

          return (
            <View key={`${item.label}-${index}`} style={styles.barContainer}>
              <TouchableOpacity
                activeOpacity={onBarPress ? 0.7 : 1}
                onPress={() => onBarPress && onBarPress(item, index)}
              >
                <Animated.View
                  style={[
                    styles.bar,
                    {
                      width: barWidth,
                      height:
                        animatedValues[index]?.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, barHeight],
                        }) || 0,
                      backgroundColor: item.color || '#3498db',
                      marginHorizontal: spacing / 2,
                    },
                    barStyle,
                  ]}
                />
              </TouchableOpacity>

              {showValues && (
                <Text style={[styles.value, valueStyle]}>
                  {valueFormatter(item.value)}
                </Text>
              )}

              {showLabels && (
                <Text
                  style={[styles.label, labelStyle]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.label}
                </Text>
              )}
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    flex: 1,
  },
  barContainer: {
    alignItems: 'center',
  },
  bar: {
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  value: {
    fontSize: 12,
    marginTop: 5,
    color: '#333',
  },
  label: {
    fontSize: 10,
    marginTop: 5,
    maxWidth: DEFAULT_BAR_WIDTH * 1.5,
    textAlign: 'center',
    color: '#666',
  },
});
