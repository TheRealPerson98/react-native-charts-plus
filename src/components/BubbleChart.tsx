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
import type { BubbleChartProps, BubbleChartDataPoint } from '../types';

const DEFAULT_HEIGHT = 300;
const DEFAULT_WIDTH = Dimensions.get('window').width - 40;
const DEFAULT_ANIMATION_DURATION = 800;
const DEFAULT_MIN_BUBBLE_SIZE = 10;
const DEFAULT_MAX_BUBBLE_SIZE = 50;

export const BubbleChart: FC<BubbleChartProps> = ({
  data,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  showLabels = true,
  showValues = true,
  xAxisTitle,
  yAxisTitle,
  valueFormatter = (x: number, y: number, size: number) =>
    `(${x}, ${y}, ${size})`,
  style,
  labelStyle,
  valueStyle,
  xAxisLabelStyle,
  yAxisLabelStyle,
  bubbleStyle,
  animated = true,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  showGrid = true,
  gridColor = '#E0E0E0',
  gridOpacity = 0.5,
  xAxisRange,
  yAxisRange,
  sizeRange = { min: DEFAULT_MIN_BUBBLE_SIZE, max: DEFAULT_MAX_BUBBLE_SIZE },
  showXAxis = true,
  showYAxis = true,
  horizontalLines = 5,
  verticalLines = 5,
  onBubblePress,
}) => {
  // Find min and max values for x and y to scale the chart
  const xValues = data.map((item) => item.x);
  const yValues = data.map((item) => item.y);
  const sizeValues = data.map((item) => item.size);

  const minX = xAxisRange?.min ?? Math.min(...xValues);
  const maxX = xAxisRange?.max ?? Math.max(...xValues);
  const minY = yAxisRange?.min ?? Math.min(...yValues);
  const maxY = yAxisRange?.max ?? Math.max(...yValues);
  const minSize = Math.min(...sizeValues);
  const maxSize = Math.max(...sizeValues);

  // Create animated values for each bubble
  const animatedValues = useRef<Animated.Value[]>(
    data.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (animated) {
      // Animate all bubbles simultaneously
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
      // Set all bubbles to full size immediately
      animatedValues.forEach((animatedValue: Animated.Value) => {
        animatedValue.setValue(1);
      });
    }
  }, [animated, animatedValues, animationDuration, data]);

  // Calculate the chart area dimensions (excluding axes)
  const chartAreaWidth = width - (showYAxis ? 40 : 0);
  const chartAreaHeight = height - (showXAxis ? 40 : 0) - 20; // 20 for top padding

  // Function to scale a value to the chart area
  const scaleX = (x: number) => {
    return ((x - minX) / (maxX - minX)) * (chartAreaWidth - 40) + 20;
  };

  const scaleY = (y: number) => {
    return (
      chartAreaHeight -
      ((y - minY) / (maxY - minY)) * (chartAreaHeight - 40) -
      20
    );
  };

  const scaleBubbleSize = (size: number) => {
    const normalizedSize = (size - minSize) / (maxSize - minSize);
    return normalizedSize * (sizeRange.max! - sizeRange.min!) + sizeRange.min!;
  };

  // Generate grid lines
  const renderGridLines = () => {
    if (!showGrid) return null;

    const horizontalGridLines = [];
    const verticalGridLines = [];

    // Horizontal grid lines
    for (let i = 0; i <= horizontalLines; i++) {
      const y = chartAreaHeight * (i / horizontalLines);
      horizontalGridLines.push(
        <View
          key={`h-${i}`}
          style={[
            styles.gridLine,
            {
              width: chartAreaWidth,
              top: y,
              backgroundColor: gridColor,
              opacity: gridOpacity,
            },
          ]}
        />
      );
    }

    // Vertical grid lines
    for (let i = 0; i <= verticalLines; i++) {
      const x = chartAreaWidth * (i / verticalLines);
      verticalGridLines.push(
        <View
          key={`v-${i}`}
          style={[
            styles.gridLine,
            {
              height: chartAreaHeight,
              left: x,
              backgroundColor: gridColor,
              opacity: gridOpacity,
            },
            styles.verticalLine,
          ]}
        />
      );
    }

    return (
      <>
        {horizontalGridLines}
        {verticalGridLines}
      </>
    );
  };

  return (
    <View style={[styles.container, { width, height }, style]}>
      {/* Y-Axis Title */}
      {yAxisTitle && (
        <Text style={[styles.axisTitle, styles.yAxisTitle, yAxisLabelStyle]}>
          {yAxisTitle}
        </Text>
      )}

      <View style={styles.chartContainer}>
        {/* Grid Lines */}
        {renderGridLines()}

        {/* Bubbles */}
        {data.map((item: BubbleChartDataPoint, index: number) => {
          const bubbleSize = scaleBubbleSize(item.size);
          const x = scaleX(item.x);
          const y = scaleY(item.y);

          return (
            <View
              key={`${item.label}-${index}`}
              style={[
                styles.bubbleContainer,
                {
                  left: x - bubbleSize / 2,
                  top: y - bubbleSize / 2,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={onBubblePress ? 0.7 : 1}
                onPress={() => onBubblePress && onBubblePress(item, index)}
              >
                <Animated.View
                  style={[
                    styles.bubble,
                    {
                      width:
                        animatedValues[index]?.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, bubbleSize],
                        }) || 0,
                      height:
                        animatedValues[index]?.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, bubbleSize],
                        }) || 0,
                      backgroundColor: item.color || '#3498db',
                      borderColor: item.borderColor || 'transparent',
                      borderWidth: item.borderWidth || 0,
                    },
                    bubbleStyle,
                  ]}
                />
              </TouchableOpacity>

              {showLabels && (
                <Text
                  style={[styles.label, labelStyle]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.label}
                </Text>
              )}

              {showValues && (
                <Text style={[styles.value, valueStyle]}>
                  {valueFormatter(item.x, item.y, item.size)}
                </Text>
              )}
            </View>
          );
        })}

        {/* X-Axis */}
        {showXAxis && (
          <View style={[styles.xAxis, { width: chartAreaWidth }]}>
            {Array.from({ length: verticalLines + 1 }).map((_, i) => {
              const value = minX + ((maxX - minX) * i) / verticalLines;
              return (
                <Text
                  key={`x-${i}`}
                  style={[
                    styles.axisLabel,
                    { left: (chartAreaWidth * i) / verticalLines },
                    xAxisLabelStyle,
                  ]}
                >
                  {value.toFixed(1)}
                </Text>
              );
            })}
          </View>
        )}

        {/* Y-Axis */}
        {showYAxis && (
          <View style={[styles.yAxis, { height: chartAreaHeight }]}>
            {Array.from({ length: horizontalLines + 1 }).map((_, i) => {
              const value =
                minY +
                ((maxY - minY) * (horizontalLines - i)) / horizontalLines;
              return (
                <Text
                  key={`y-${i}`}
                  style={[
                    styles.axisLabel,
                    { top: (chartAreaHeight * i) / horizontalLines },
                    yAxisLabelStyle,
                  ]}
                >
                  {value.toFixed(1)}
                </Text>
              );
            })}
          </View>
        )}
      </View>

      {/* X-Axis Title */}
      {xAxisTitle && (
        <Text style={[styles.axisTitle, styles.xAxisTitle, xAxisLabelStyle]}>
          {xAxisTitle}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: 'row',
  },
  chartContainer: {
    flex: 1,
    position: 'relative',
  },
  bubbleContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bubble: {
    borderRadius: 100, // Make it a circle
  },
  label: {
    fontSize: 10,
    marginTop: 2,
    color: '#666',
    position: 'absolute',
    top: '100%',
    textAlign: 'center',
  },
  value: {
    fontSize: 9,
    color: '#333',
    position: 'absolute',
    top: '120%',
    marginTop: 12,
    textAlign: 'center',
  },
  gridLine: {
    position: 'absolute',
  },
  verticalLine: {
    width: 1,
  },
  xAxis: {
    height: 30,
    position: 'absolute',
    bottom: -30,
    left: 0,
  },
  yAxis: {
    width: 30,
    position: 'absolute',
    left: -30,
    top: 0,
  },
  axisLabel: {
    fontSize: 9,
    color: '#666',
    position: 'absolute',
    textAlign: 'center',
  },
  axisTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  xAxisTitle: {
    textAlign: 'center',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  yAxisTitle: {
    transform: [{ rotate: '-90deg' }],
    position: 'absolute',
    left: -25,
    top: '50%',
    width: 100,
    textAlign: 'center',
  },
});
