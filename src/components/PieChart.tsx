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
import Svg, { G, Path, Text as SvgText, Circle, Rect} from 'react-native-svg';
import { arc, pie } from 'd3-shape';
import type { PieChartProps } from '../types';

const DEFAULT_WIDTH = Dimensions.get('window').width - 40;
const DEFAULT_HEIGHT = 300;
const DEFAULT_RADIUS = 120;
const DEFAULT_ANIMATION_DURATION = 800;
const DEFAULT_DONUT_RADIUS = 60;

export const PieChart: FC<PieChartProps> = ({
  data,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  radius = DEFAULT_RADIUS,
  showLabels = true,
  showValues = true,
  valueFormatter = (value: number) => `${value}`,
  style,
  labelStyle,
  valueStyle,
  animated = true,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  donut = false,
  donutRadius = DEFAULT_DONUT_RADIUS,
  onSlicePress,
  centerLabel,
  centerLabelStyle,
  outlineColor = '#FFFFFF',
  outlineWidth = 1.5,
  // Text background options
  showLabelBackground = true,
  labelBackgroundColor = 'rgba(255,255,255,0.9)',
  labelBackgroundOpacity = 0.9,
  labelBackgroundBorderRadius = 4,
  labelBackgroundBorderWidth = 0,
  labelBackgroundBorderColor,
  labelBackgroundPadding = 6,
  // Value background options
  showValueBackground = true,
  valueBackgroundColor = 'rgba(255,255,255,0.9)',
  valueBackgroundOpacity = 0.9,
  valueBackgroundBorderRadius = 4,
  valueBackgroundBorderWidth = 0,
  valueBackgroundBorderColor,
  valueBackgroundPadding = 6,
  // External label options
  externalLabelDistance = 1.2,
  externalLabelMinAngle = 0.5,
  // Connecting line options
  connectingLineColor,
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
  // Center label options
  centerLabelBackgroundColor = 'white',
  centerLabelBorderWidth = 0,
  centerLabelBorderColor,
  centerLabelBorderRadius = 0,
}) => {
  // Ensure data is valid
  const validData = Array.isArray(data) && data.length > 0 ? data : [{ value: 100, label: 'No Data', color: '#CCCCCC' }];
  
  // Calculate total value for percentage calculations
  const total = validData.reduce((sum, item) => sum + (item.value || 0), 0);
  
  // Animation progress value (0 to 1)
  const animationProgress = useRef(new Animated.Value(0)).current;
  
  // State to track if animation is complete
  const [animationComplete, setAnimationComplete] = useState(!animated);

  // Use interpolated value for animation
  const [progressValue, setProgressValue] = useState(animated ? 0 : 1);

  // Set default border colors if not provided
  const effectiveLabelBackgroundBorderColor = labelBackgroundBorderColor || outlineColor;
  const effectiveValueBackgroundBorderColor = valueBackgroundBorderColor || outlineColor;
  const effectiveConnectingLineColor = connectingLineColor || '#888888';
  const effectiveCenterLabelBorderColor = centerLabelBorderColor || outlineColor;

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

  // Calculate the actual radius based on available space
  const chartWidth = legendPosition === 'left' || legendPosition === 'right' 
    ? width - 130 
    : width;
  const chartHeight = legendPosition === 'top' || legendPosition === 'bottom' 
    ? height - 80 
    : height;
  const availableSize = Math.min(chartWidth, chartHeight);
  const actualRadius = Math.min(availableSize / 2 - 40, radius);
  
  // Create the pie layout with improved padding
  const pieLayout = pie<any>()
    .value((d) => d.value || 0)
    .sort(null)
    .padAngle(0.02);
  
  // Process the data for the pie layout
  const pieData = pieLayout(validData);
  
  // Render the slices first, then the labels to ensure proper z-index
  const renderSlices = () => {
    return pieData.map((slice, index) => {
      // Get the color for this slice
      const dataItem = validData[index];
      if (!dataItem) return null;
      
      const color = dataItem.color || getDefaultColor(index);
      const sliceOutlineColor = dataItem.outlineColor || outlineColor;
      const sliceOutlineWidth = dataItem.outlineWidth || outlineWidth;
      
      // For animation, we'll scale the radius
      const animatedRadius = animated && !animationComplete
        ? actualRadius * progressValue
        : actualRadius;
      
      // Create a custom arc generator for this slice with animated radius
      const sliceArcGenerator = arc<any>()
        .innerRadius(donut ? donutRadius : 0)
        .outerRadius(animatedRadius)
        .cornerRadius(3);
      
      // Calculate the path
      const pathData = sliceArcGenerator(slice);
      
      return (
        <Path
          key={`slice-${index}`}
          d={pathData || ''}
          fill={color}
          stroke={sliceOutlineColor}
          strokeWidth={sliceOutlineWidth}
          onPress={() => onSlicePress && onSlicePress(dataItem, index)}
        />
      );
    });
  };
  
  // Render the labels separately to ensure they're on top
  const renderLabels = () => {
    return pieData.map((slice, index) => {
      const dataItem = validData[index];
      if (!dataItem || !showLabels) return null;
      
      // For animation, we'll scale the radius
      const animatedRadius = animated && !animationComplete
        ? actualRadius * progressValue
        : actualRadius;
      
      // Calculate the position for the label
      const midAngle = slice.startAngle + (slice.endAngle - slice.startAngle) / 2;
      
      // Determine if slice is large enough for internal label
      const isLargeSlice = slice.endAngle - slice.startAngle > externalLabelMinAngle;
      
      // Get item-specific background color if provided
      const itemLabelBackgroundColor = dataItem.labelBackgroundColor || labelBackgroundColor;
      
      if (isLargeSlice) {
        // Internal labels for large slices
        const labelRadius = animatedRadius * 0.65;
        const labelX = Math.cos(midAngle) * labelRadius;
        const labelY = Math.sin(midAngle) * labelRadius;
        
        // Calculate text dimensions for background
        const fontSize = (labelStyle as any)?.fontSize || 12;
        const valueFontSize = (valueStyle as any)?.fontSize || 10;
        const labelWidth = dataItem.label.length * fontSize * 0.6;
        const labelHeight = fontSize * 1.2;
        const valueWidth = valueFormatter(dataItem.value).length * valueFontSize * 0.6;
        const valueHeight = valueFontSize * 1.2;
        
        return (
          <G key={`label-${index}`}>
            {/* Add a background rectangle for better visibility */}
            {showLabelBackground && (
              <Rect
                x={labelX - (labelWidth / 2) - labelBackgroundPadding}
                y={labelY - labelHeight - labelBackgroundPadding}
                width={labelWidth + (labelBackgroundPadding * 2)}
                height={labelHeight + (labelBackgroundPadding * 2)}
                fill={itemLabelBackgroundColor}
                opacity={labelBackgroundOpacity}
                rx={labelBackgroundBorderRadius}
                ry={labelBackgroundBorderRadius}
                stroke={effectiveLabelBackgroundBorderColor}
                strokeWidth={labelBackgroundBorderWidth}
              />
            )}
            
            <SvgText
              x={labelX}
              y={labelY - 6}
              fill={(labelStyle as any)?.color || "#333333"}
              fontSize={fontSize}
              fontWeight={(labelStyle as any)?.fontWeight || "bold"}
              textAnchor="middle"
            >
              {dataItem.label}
            </SvgText>
            
            {showValues && (
              <>
                {showValueBackground && (
                  <Rect
                    x={labelX - (valueWidth / 2) - valueBackgroundPadding}
                    y={labelY + 2}
                    width={valueWidth + (valueBackgroundPadding * 2)}
                    height={valueHeight + (valueBackgroundPadding * 2)}
                    fill={valueBackgroundColor}
                    opacity={valueBackgroundOpacity}
                    rx={valueBackgroundBorderRadius}
                    ry={valueBackgroundBorderRadius}
                    stroke={effectiveValueBackgroundBorderColor}
                    strokeWidth={valueBackgroundBorderWidth}
                  />
                )}
                <SvgText
                  x={labelX}
                  y={labelY + valueHeight}
                  fill={(valueStyle as any)?.color || "#555555"}
                  fontSize={valueFontSize}
                  textAnchor="middle"
                >
                  {valueFormatter(dataItem.value)}
                </SvgText>
              </>
            )}
          </G>
        );
      } else {
        // External labels for small slices with better positioning
        const labelRadius = animatedRadius * 0.95;
        const externalLabelRadius = animatedRadius * externalLabelDistance;
        
        const labelX = Math.cos(midAngle) * labelRadius;
        const labelY = Math.sin(midAngle) * labelRadius;
        
        const externalLabelX = Math.cos(midAngle) * externalLabelRadius;
        const externalLabelY = Math.sin(midAngle) * externalLabelRadius;
        
        // Determine text anchor based on position
        const isRightSide = Math.cos(midAngle) > 0;
        const textAnchor = isRightSide ? "start" : "end";
        const xOffset = isRightSide ? 8 : -8;
        
        // Calculate text dimensions for background
        const fontSize = (labelStyle as any)?.fontSize || 11;
        const valueFontSize = (valueStyle as any)?.fontSize || 10;
        const labelWidth = dataItem.label.length * fontSize * 0.6;
        const labelHeight = fontSize * 1.2;
        const valueHeight = valueFontSize * 1.2;
        
        // Create connecting line path
        let connectingLinePath;
        if (connectingLineStyle === 'curved') {
          // Create a curved path
          const controlPointX = (labelX + externalLabelX) / 2;
          const controlPointY = (labelY + externalLabelY) / 2 - 15;
          connectingLinePath = `M${labelX},${labelY} Q${controlPointX},${controlPointY} ${externalLabelX - (isRightSide ? 5 : -5)},${externalLabelY}`;
        } else {
          // Create a straight path with a bend
          const bendX = externalLabelX * 0.9;
          const bendY = externalLabelY * 0.9;
          connectingLinePath = `M${labelX},${labelY} L${bendX},${bendY} L${externalLabelX - (isRightSide ? 5 : -5)},${externalLabelY}`;
        }
        
        return (
          <G key={`label-${index}`}>
            {/* Connecting line */}
            <Path
              d={connectingLinePath}
              stroke={effectiveConnectingLineColor}
              strokeWidth={connectingLineWidth}
              fill="none"
            />
            
            {/* Label background and text */}
            {showLabelBackground && (
              <Rect
                x={isRightSide ? externalLabelX + 4 : externalLabelX - labelWidth - 4 - labelBackgroundPadding * 2}
                y={externalLabelY - labelHeight / 2 - 8}
                width={labelWidth + 8 + labelBackgroundPadding * 2}
                height={(showValues ? labelHeight + valueHeight + 4 : labelHeight) + labelBackgroundPadding * 2}
                fill={itemLabelBackgroundColor}
                opacity={labelBackgroundOpacity}
                rx={labelBackgroundBorderRadius}
                ry={labelBackgroundBorderRadius}
                stroke={effectiveLabelBackgroundBorderColor}
                strokeWidth={labelBackgroundBorderWidth}
              />
            )}
            
            <SvgText
              x={externalLabelX + xOffset}
              y={externalLabelY - (showValues ? 8 : 0)}
              fill={(labelStyle as any)?.color || "#333333"}
              fontSize={fontSize}
              fontWeight={(labelStyle as any)?.fontWeight || "bold"}
              textAnchor={textAnchor}
            >
              {dataItem.label}
            </SvgText>
            
            {/* Value text */}
            {showValues && (
              <SvgText
                x={externalLabelX + xOffset}
                y={externalLabelY + valueHeight - 2}
                fill={(valueStyle as any)?.color || "#555555"}
                fontSize={valueFontSize}
                textAnchor={textAnchor}
              >
                {valueFormatter(dataItem.value)}
              </SvgText>
            )}
          </G>
        );
      }
    });
  };
  
  // Render the legend based on position
  const renderLegend = () => {
    if (!showLegend) return null;
    
    const legendItems = validData.map((item, index) => {
      const percentage = total > 0 ? (item.value / total) * 100 : 0;
      const itemOutlineColor = item.outlineColor || outlineColor;
      const itemOutlineWidth = item.outlineWidth || outlineWidth;
      
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
          onPress={() => onSlicePress && onSlicePress(item, index)}
        >
          <View 
            style={[
              styles.legendColor, 
              { 
                backgroundColor: item.color || getDefaultColor(index),
                borderColor: itemOutlineColor,
                borderWidth: itemOutlineWidth * 0.5,
              }
            ]} 
          />
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
            right: 10, 
            top: '50%', 
            transform: [{ translateY: -100 }],
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: 120
          },
          legendPosition === 'left' && { 
            position: 'absolute', 
            left: 10, 
            top: '50%', 
            transform: [{ translateY: -100 }],
            flexDirection: 'column',
            alignItems: 'flex-start',
            maxWidth: 120
          },
          legendPosition === 'top' && { 
            marginTop: 0,
            marginBottom: 10
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
          <G x={chartWidth / 2} y={chartHeight / 2}>
            {/* Render slices first */}
            {renderSlices()}
            
            {/* Render labels on top */}
            {renderLabels()}
            
            {donut && centerLabel && (
              <G>
                {/* Background for center label */}
                {centerLabelBorderRadius > 0 ? (
                  // Use a rounded rectangle when border radius is specified
                  <Rect
                    x={-donutRadius + 5}
                    y={-donutRadius + 5}
                    width={(donutRadius - 5) * 2}
                    height={(donutRadius - 5) * 2}
                    fill={centerLabelBackgroundColor}
                    stroke={effectiveCenterLabelBorderColor}
                    strokeWidth={centerLabelBorderWidth}
                    rx={centerLabelBorderRadius}
                    ry={centerLabelBorderRadius}
                  />
                ) : (
                  // Use a circle when no border radius is specified
                  <Circle
                    cx={0}
                    cy={0}
                    r={donutRadius - 5}
                    fill={centerLabelBackgroundColor}
                    stroke={effectiveCenterLabelBorderColor}
                    strokeWidth={centerLabelBorderWidth}
                  />
                )}
                <SvgText
                  x={0}
                  y={0}
                  fill={(centerLabelStyle as any)?.color || "#333333"}
                  fontSize={(centerLabelStyle as any)?.fontSize || 16}
                  fontWeight={(centerLabelStyle as any)?.fontWeight || "bold"}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {centerLabel}
                </SvgText>
              </G>
            )}
          </G>
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
    marginRight: 8,
    marginBottom: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 1,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#333',
    fontWeight: '500',
  },
}); 