import { useEffect, useRef, useMemo } from 'react';
import type { FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import type { PercentageBarChartProps } from '../types';

const DEFAULT_WIDTH = Dimensions.get('window').width - 40;
const DEFAULT_HEIGHT = 300;
const DEFAULT_ANIMATION_DURATION = 500;

export const PercentageBarChart: FC<PercentageBarChartProps> = ({
  data,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  showLabels = true,
  showValues = true,
  valueFormatter = (value: number) => `${value}`,
  style,
  labelStyle,
  valueStyle,
  animated = true,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  onSlicePress,
}) => {
  // Calculate total for percentage calculations and memoize the result
  const total = useMemo(
    () => data.reduce((sum, item) => sum + item.value, 0),
    [data]
  );

  // Create animated values for each bar
  const animatedValues = useRef(data.map(() => new Animated.Value(0))).current;

  // Prepare items with percentage and default color data
  const items = useMemo(
    () =>
      data.map((item, index) => {
        const percentage = item.value / total;
        return {
          item,
          index,
          percentage,
          color: item.color || getDefaultColor(index),
        };
      }),
    [data, total]
  );

  useEffect(() => {
    if (animated) {
      Animated.parallel(
        animatedValues.map((animatedValue) =>
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: animationDuration,
            useNativeDriver: false,
          })
        )
      ).start();
    } else {
      animatedValues.forEach((animatedValue) => animatedValue.setValue(1));
    }
  }, [animated, animatedValues, animationDuration, data]);

  return (
    <View style={[styles.container, { width, height }, style]}>
      <View style={styles.chartContainer}>
        <View style={styles.barsContainer}>
          {items.map((dataItem, index) => {
            if (!animatedValues[index]) {
              return null;
            }

            const animatedWidth = animatedValues[index].interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', `${dataItem.percentage * 100}%`],
            });

            return (
              <View
                key={`${dataItem.item.label}-${index}`}
                style={styles.barItem}
              >
                <TouchableOpacity
                  activeOpacity={onSlicePress ? 0.7 : 1}
                  onPress={() =>
                    onSlicePress && onSlicePress(dataItem.item, index)
                  }
                >
                  <View style={styles.barRow}>
                    <View
                      style={[
                        styles.colorBox,
                        { backgroundColor: dataItem.color },
                      ]}
                    />
                    <View style={styles.textContainer}>
                      {showLabels && (
                        <Text style={[styles.label, labelStyle]}>
                          {dataItem.item.label}
                        </Text>
                      )}
                      {showValues && (
                        <Text style={[styles.value, valueStyle]}>
                          {valueFormatter(dataItem.item.value)} (
                          {Math.round(dataItem.percentage * 100)}%)
                        </Text>
                      )}
                    </View>
                    <Animated.View
                      style={[
                        styles.percentageBar,
                        {
                          backgroundColor: dataItem.color,
                          width: animatedWidth,
                        },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

// Helper function to generate default colors
const getDefaultColor = (index: number): string => {
  const colors = [
    '#FF5733', // Red-Orange
    '#33FF57', // Green
    '#3357FF', // Blue
    '#F3FF33', // Yellow
    '#FF33F3', // Pink
    '#33FFF3', // Cyan
    '#FF9933', // Orange
    '#9933FF', // Purple
    '#33FF99', // Mint
    '#FF3366', // Rose
  ];
  return colors[index % colors.length] || '#CCCCCC';
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartContainer: {
    flex: 1,
  },
  barsContainer: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
  },
  barItem: {
    marginBottom: 10,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    height: 40,
    paddingHorizontal: 10,
    borderRadius: 5,
    overflow: 'hidden',
    backgroundColor: '#f5f5f5',
  },
  colorBox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    zIndex: 1,
  },
  percentageBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    opacity: 0.2,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  value: {
    fontSize: 12,
    color: '#666',
  },
});
