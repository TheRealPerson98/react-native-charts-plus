import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  Easing,
  TouchableOpacity,
} from 'react-native';
import Svg, { G, Circle, Text as SvgText, Line, Rect } from 'react-native-svg';
import type { RingChartProps } from '../types';

const DEFAULT_WIDTH = Dimensions.get('window').width - 40;
const DEFAULT_HEIGHT = 300;
const DEFAULT_ANIMATION_DURATION = 800;
const DEFAULT_RING_THICKNESS = 20;
const DEFAULT_RING_SPACING = 10;

export const RingChart: FC<RingChartProps> = ({
  data,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  ringThickness = DEFAULT_RING_THICKNESS,
  ringSpacing = DEFAULT_RING_SPACING,
  showLabels = true,
  showValues = true,
  valueFormatter = (value: number, total: number) => `${Math.round((value / total) * 100)}%`,
  style,
  labelStyle,
  valueStyle,
  animated = true,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  onRingPress,
  // Label position options
  labelPosition = 'right',
  valuePosition = 'right',
  // Label styling
  labelBackgroundColor = 'rgba(255,255,255,0.9)',
  labelBackgroundOpacity = 0.9,
  labelBackgroundBorderRadius = 4,
  labelBackgroundBorderWidth = 0,
  labelBackgroundBorderColor = '#DDDDDD',
  labelBackgroundPadding = 6,
  // Value styling
  valueBackgroundColor = 'rgba(255,255,255,0.9)',
  valueBackgroundOpacity = 0.9,
  valueBackgroundBorderRadius = 4,
  valueBackgroundBorderWidth = 0,
  valueBackgroundBorderColor = '#DDDDDD',
  valueBackgroundPadding = 6,
  // Connecting line options
  showConnectingLines = true,
  connectingLineColor = '#888888',
  connectingLineWidth = 1,
  connectingLineStyle = 'straight',
  // Legend options
  showLegend = true,
  legendPosition = 'bottom',
  legendStyle,
  legendItemStyle,
  legendLabelStyle,
  legendItemBackgroundColor = 'rgba(255,255,255,0.9)',
  legendItemBorderRadius = 6,
}) => {
  // Ensure data is valid
  const validData = Array.isArray(data) && data.length > 0 
    ? data 
    : [{ value: 50, total: 100, label: 'No Data', fullColor: '#CCCCCC', emptyColor: '#EEEEEE' }];
  
  // Animation progress value (0 to 1)
  const animationProgress = useRef(new Animated.Value(0)).current;
  
  // State to track if animation is complete
  const [animationComplete, setAnimationComplete] = useState(!animated);

  // Use interpolated value for animation
  const [progressValue, setProgressValue] = useState(animated ? 0 : 1);

  useEffect(() => {
    if (animated) {
      // Reset animation value
      animationProgress.setValue(0);
      setAnimationComplete(false);
      
      // Start animation
      Animated.timing(animationProgress, {
        toValue: 1,
        duration: animationDuration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(({ finished }) => {
        if (finished) {
          setAnimationComplete(true);
        }
      });
    } else {
      // Set to completed state immediately
      animationProgress.setValue(1);
      setAnimationComplete(true);
    }
  }, [animated, animationProgress, animationDuration, validData]);

  useEffect(() => {
    // Set up listener for animation progress
    const listener = animationProgress.addListener(({ value }) => {
      setProgressValue(value);
    });
    
    // Clean up listener
    return () => {
      animationProgress.removeListener(listener);
    };
  }, [animationProgress]);

  // Calculate the chart dimensions
  const chartWidth = legendPosition === 'left' || legendPosition === 'right' 
    ? width - 130 
    : width;
  const chartHeight = legendPosition === 'top' || legendPosition === 'bottom' 
    ? height - 80 
    : height;
  
  // Calculate the maximum radius based on available space and number of rings
  const availableSize = Math.min(chartWidth, chartHeight);
  const centerX = chartWidth / 2;
  const centerY = chartHeight / 2;
  const maxRadius = Math.min(availableSize / 2 - 40, 
    (validData.length * ringThickness) + ((validData.length - 1) * ringSpacing));
  
  // Calculate the radius for each ring
  const calculateRingRadius = (index: number) => {
    const ringCount = validData.length;
    const ringIndex = ringCount - index - 1; // Reverse order so largest ring is outermost
    return maxRadius - (ringIndex * (ringThickness + ringSpacing));
  };
  
  // Render the rings
  const renderRings = () => {
    return validData.map((item, index) => {
      const radius = calculateRingRadius(index);
      const circumference = 2 * Math.PI * radius;
      const fillPercentage = item.value / item.total;
      const animatedFillPercentage = animated && !animationComplete
        ? fillPercentage * progressValue
        : fillPercentage;
      
      // Calculate the stroke-dasharray and stroke-dashoffset for the progress arc
      const strokeDasharray = `${circumference} ${circumference}`;
      const strokeDashoffset = circumference * (1 - animatedFillPercentage);
      
      return (
        <G key={`ring-${index}`}>
          {/* Background (empty) circle */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="transparent"
            stroke={item.emptyColor || '#EEEEEE'}
            strokeWidth={ringThickness}
          />
          
          {/* Foreground (filled) circle with stroke-dasharray for progress */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={radius}
            fill="transparent"
            stroke={item.fullColor || getDefaultColor(index)}
            strokeWidth={ringThickness}
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90, ${centerX}, ${centerY})`}
            onPress={() => onRingPress && onRingPress(item, index)}
          />
        </G>
      );
    });
  };
  
  // Render the labels
  const renderLabels = () => {
    if (!showLabels && !showValues) return null;
    
    return validData.map((item, index) => {
      const radius = calculateRingRadius(index);
      const fontSize = (labelStyle as any)?.fontSize || 12;
      const valueFontSize = (valueStyle as any)?.fontSize || 10;
      
      // Calculate positions based on labelPosition
      let labelX = centerX;
      let labelY = centerY;
      let valueX = centerX;
      let valueY = centerY;
      let labelAnchor = 'middle';
      let valueAnchor = 'middle';
      let connectingLinePoints = { x1: 0, y1: 0, x2: 0, y2: 0 };
      
      // Position for the label
      switch (labelPosition) {
        case 'top':
          labelY = centerY - radius - 20;
          connectingLinePoints = { 
            x1: centerX, 
            y1: centerY - radius, 
            x2: labelX, 
            y2: labelY + fontSize 
          };
          break;
        case 'bottom':
          labelY = centerY + radius + 20;
          connectingLinePoints = { 
            x1: centerX, 
            y1: centerY + radius, 
            x2: labelX, 
            y2: labelY - fontSize 
          };
          break;
        case 'left':
          labelX = centerX - radius - 20;
          labelAnchor = 'end';
          connectingLinePoints = { 
            x1: centerX - radius, 
            y1: centerY, 
            x2: labelX + 5, 
            y2: labelY 
          };
          break;
        case 'right':
        default:
          labelX = centerX + radius + 20;
          labelAnchor = 'start';
          connectingLinePoints = { 
            x1: centerX + radius, 
            y1: centerY, 
            x2: labelX - 5, 
            y2: labelY 
          };
          break;
      }
      
      // Position for the value
      switch (valuePosition) {
        case 'top':
          valueY = labelPosition === 'top' ? labelY - valueFontSize - 5 : centerY - radius - 20;
          connectingLinePoints = labelPosition === 'top' 
            ? connectingLinePoints 
            : { x1: centerX, y1: centerY - radius, x2: valueX, y2: valueY + valueFontSize };
          break;
        case 'bottom':
          valueY = labelPosition === 'bottom' ? labelY + valueFontSize + 5 : centerY + radius + 20;
          connectingLinePoints = labelPosition === 'bottom' 
            ? connectingLinePoints 
            : { x1: centerX, y1: centerY + radius, x2: valueX, y2: valueY - valueFontSize };
          break;
        case 'left':
          valueX = labelPosition === 'left' ? labelX - 10 : centerX - radius - 20;
          valueAnchor = 'end';
          connectingLinePoints = labelPosition === 'left' 
            ? connectingLinePoints 
            : { x1: centerX - radius, y1: centerY, x2: valueX + 5, y2: valueY };
          break;
        case 'right':
        default:
          valueX = labelPosition === 'right' ? labelX + 10 : centerX + radius + 20;
          valueAnchor = 'start';
          connectingLinePoints = labelPosition === 'right' 
            ? connectingLinePoints 
            : { x1: centerX + radius, y1: centerY, x2: valueX - 5, y2: valueY };
          break;
        case 'with-label':
          valueX = labelX;
          valueY = labelY + fontSize + 5;
          valueAnchor = labelAnchor;
          // Use the same connecting line as the label
          break;
      }
      
      return (
        <G key={`label-${index}`}>
          {/* Connecting line */}
          {showConnectingLines && (
            <Line
              x1={connectingLinePoints.x1}
              y1={connectingLinePoints.y1}
              x2={connectingLinePoints.x2}
              y2={connectingLinePoints.y2}
              stroke={connectingLineColor}
              strokeWidth={connectingLineWidth}
              strokeDasharray={connectingLineStyle === 'dashed' ? '5,5' : undefined}
            />
          )}
          
          {/* Label */}
          {showLabels && (
            <G>
              {/* Label background */}
              {labelBackgroundColor && (
                <Rect
                  x={labelX - (item.label.length * fontSize * 0.3) - labelBackgroundPadding}
                  y={labelY - (fontSize / 2) - labelBackgroundPadding}
                  width={(item.label.length * fontSize * 0.6) + (labelBackgroundPadding * 2)}
                  height={fontSize + (labelBackgroundPadding * 2)}
                  fill={labelBackgroundColor}
                  opacity={labelBackgroundOpacity}
                  rx={labelBackgroundBorderRadius}
                  ry={labelBackgroundBorderRadius}
                  stroke={labelBackgroundBorderColor}
                  strokeWidth={labelBackgroundBorderWidth}
                />
              )}
              <SvgText
                x={labelX}
                y={labelY}
                fill={(labelStyle as any)?.color || "#333333"}
                fontSize={fontSize}
                fontWeight={(labelStyle as any)?.fontWeight || "bold"}
                textAnchor={labelAnchor as any}
                alignmentBaseline="middle"
              >
                {item.label}
              </SvgText>
            </G>
          )}
          
          {/* Value */}
          {showValues && (
            <G>
              {/* Value background */}
              {valueBackgroundColor && (
                <Rect
                  x={valuePosition === 'with-label' 
                    ? labelX - (valueFormatter(item.value, item.total).length * valueFontSize * 0.3) - valueBackgroundPadding
                    : valueX - (valueFormatter(item.value, item.total).length * valueFontSize * 0.3) - valueBackgroundPadding
                  }
                  y={valuePosition === 'with-label' 
                    ? labelY + fontSize + 5 - (valueFontSize / 2) - valueBackgroundPadding
                    : valueY - (valueFontSize / 2) - valueBackgroundPadding
                  }
                  width={(valueFormatter(item.value, item.total).length * valueFontSize * 0.6) + (valueBackgroundPadding * 2)}
                  height={valueFontSize + (valueBackgroundPadding * 2)}
                  fill={valueBackgroundColor}
                  opacity={valueBackgroundOpacity}
                  rx={valueBackgroundBorderRadius}
                  ry={valueBackgroundBorderRadius}
                  stroke={valueBackgroundBorderColor}
                  strokeWidth={valueBackgroundBorderWidth}
                />
              )}
              <SvgText
                x={valuePosition === 'with-label' ? labelX : valueX}
                y={valuePosition === 'with-label' ? labelY + fontSize + 5 : valueY}
                fill={(valueStyle as any)?.color || "#555555"}
                fontSize={valueFontSize}
                textAnchor={(valuePosition === 'with-label' ? labelAnchor : valueAnchor) as any}
                alignmentBaseline="middle"
              >
                {valueFormatter(item.value, item.total)}
              </SvgText>
            </G>
          )}
        </G>
      );
    });
  };
  
  // Render the legend
  const renderLegend = () => {
    if (!showLegend) return null;
    
    const legendItems = validData.map((item, index) => {
      const percentage = (item.value / item.total) * 100;
      
      return (
        <TouchableOpacity 
          key={`legend-${index}`} 
          style={[
            styles.legendItem,
            {
              backgroundColor: legendItemBackgroundColor,
              borderRadius: legendItemBorderRadius,
              marginHorizontal: 4,
            },
            legendItemStyle
          ]}
          onPress={() => onRingPress && onRingPress(item, index)}
        >
          <View style={styles.legendColorContainer}>
            <View 
              style={[
                styles.legendColor, 
                { backgroundColor: item.fullColor || getDefaultColor(index) }
              ]} 
            />
            <View 
              style={[
                styles.legendEmptyColor, 
                { backgroundColor: item.emptyColor || '#EEEEEE' }
              ]} 
            />
          </View>
          <Text style={[styles.legendText, legendLabelStyle]}>
            {item.label} ({percentage.toFixed(1)}%)
          </Text>
        </TouchableOpacity>
      );
    });
    
    // Return the legend with appropriate styling based on position
    return (
      <View 
        style={[
          styles.legendContainer,
          legendPosition === 'right' && { 
            position: 'absolute', 
            right: -100,
            top: '50%', 
            transform: [{ translateY: '-50%' }],
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: 150,
            maxHeight: '100%',
            paddingRight: 10
          },
          legendPosition === 'left' && { 
            position: 'absolute', 
            left: -100,
            top: '50%', 
            transform: [{ translateY: '-50%' }],
            flexDirection: 'column',
            alignItems: 'flex-start',
            width: 150,
            maxHeight: '100%',
            paddingLeft: 10
          },
          legendPosition === 'top' && { 
            marginTop: 0,
            marginBottom: 10,
            flexDirection: 'row',
            flexWrap: 'wrap'
          },
          legendPosition === 'bottom' && {
            marginTop: 10,
            flexDirection: 'row',
            flexWrap: 'wrap'
          },
          legendStyle
        ]}
      >
        {legendItems}
      </View>
    );
  };
  
  return (
    <View style={[styles.container, { width, height }, style]}>
      {legendPosition === 'top' && renderLegend()}
      
      <View style={styles.chartContainer}>
        <Svg width={chartWidth} height={chartHeight}>
          {renderRings()}
          {renderLabels()}
        </Svg>
      </View>
      
      {legendPosition === 'bottom' && renderLegend()}
      {(legendPosition === 'left' || legendPosition === 'right') && renderLegend()}
    </View>
  );
};

// Helper function to generate default colors - modern palette
const getDefaultColor = (index: number): string => {
  const colors = [
    '#3366CC', // Blue
    '#DC3912', // Red
    '#FF9900', // Orange
    '#109618', // Green
    '#990099', // Purple
    '#0099C6', // Teal
    '#DD4477', // Pink
    '#66AA00', // Lime
    '#B82E2E', // Dark Red
    '#316395', // Dark Blue
    '#994499', // Dark Purple
    '#22AA99', // Sea Green
    '#AAAA11', // Olive
    '#6633CC', // Indigo
    '#E67300', // Burnt Orange
    '#329262', // Forest Green
  ];
  
  return colors[index % colors.length] || '#CCCCCC';
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  chartContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    marginTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    maxWidth: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  legendColorContainer: {
    flexDirection: 'row',
    marginRight: 8,
    width: 32,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  legendEmptyColor: {
    width: 16,
    height: 16,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
    flex: 1,
  },
}); 