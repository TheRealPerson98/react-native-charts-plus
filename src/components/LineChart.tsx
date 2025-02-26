import React from 'react';
import { View, Animated, Dimensions, TouchableOpacity } from 'react-native';
import Svg, {
  Path,
  Circle,
  Line,
  Text as SvgText,
  LinearGradient,
  Defs,
  Stop,
} from 'react-native-svg';
import type { LineChartProps, LineChartDataPoint } from '../types';
import type { TextProps } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedCircle = Animated.createAnimatedComponent(Circle);

// Default text styles to avoid black text
const defaultLabelStyle: TextProps = {
  fill: '#4A5568',
  fontSize: '12',
  fontWeight: '500',
};

const defaultValueStyle: TextProps = {
  fill: '#718096',
  fontSize: '11',
  fontWeight: '400',
};

const defaultYAxisLabelStyle: TextProps = {
  fill: '#718096',
  fontSize: '10',
  fontWeight: '400',
};

const defaultXAxisLabelStyle: TextProps = {
  fill: '#718096',
  fontSize: '10',
  fontWeight: '400',
};

export const LineChart: React.FC<LineChartProps> = ({
  data,
  width = Dimensions.get('window').width,
  height = 300,
  showArea = false,
  areaOpacity = 0.2,
  lineWidth = 2,
  showDots = true,
  dotSize = 4,
  showLabels = true,
  showValues = true,
  showGrid = false,
  gridColor = '#E0E0E0',
  gridOpacity = 0.5,
  valueFormatter = (value: number) => value.toString(),
  style,
  labelStyle,
  valueStyle,
  animated = true,
  animationDuration = 1000,
  onPointPress,
  curveType = 'linear',
  showGradient = false,
  gradientColors = ['rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 0)'],
  yAxisRange,
  showYAxis = true,
  showXAxis = true,
  yAxisLabelStyle,
  xAxisLabelStyle,
  yAxisWidth = 50,
  xAxisHeight = 30,
  horizontalLines = 5,
  verticalLines = 5,
}) => {
  const chartWidth = width - (showYAxis ? yAxisWidth : 0) - 20;
  const chartHeight = height - (showXAxis ? xAxisHeight : 0) - 20;
  const paddingHorizontal = 10;

  // Merge default styles with user-provided styles
  const mergedLabelStyle = { ...defaultLabelStyle, ...(labelStyle as object) };
  const mergedValueStyle = { ...defaultValueStyle, ...(valueStyle as object) };
  const mergedYAxisLabelStyle = {
    ...defaultYAxisLabelStyle,
    ...(yAxisLabelStyle as object),
  };
  const mergedXAxisLabelStyle = {
    ...defaultXAxisLabelStyle,
    ...(xAxisLabelStyle as object),
  };

  // Calculate min and max values
  const minValue = yAxisRange?.min ?? Math.min(...data.map((d) => d.value));
  const maxValue = yAxisRange?.max ?? Math.max(...data.map((d) => d.value));
  const valueRange = maxValue - minValue;

  // Animation value
  const animationProgress = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    if (animated) {
      animationProgress.setValue(0);
      Animated.timing(animationProgress, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    } else {
      animationProgress.setValue(1);
    }
  }, [data, animated, animationDuration, animationProgress]);

  // Generate points
  const points = data.map((point, index) => {
    const x = (chartWidth / (data.length - 1)) * index + paddingHorizontal;
    const y =
      chartHeight - ((point.value - minValue) / valueRange) * chartHeight;
    return { x, y, ...point };
  });

  // Generate path
  const generatePath = () => {
    let path = '';
    points.forEach((point, index) => {
      if (index === 0) {
        path += `M ${point.x} ${point.y}`;
      } else if (curveType === 'natural') {
        if (index > 0) {
          const prev = points[index - 1];
          if (prev) {
            const cp1x = prev.x + (point.x - prev.x) / 2;
            const cp1y = prev.y;
            const cp2x = prev.x + (point.x - prev.x) / 2;
            const cp2y = point.y;
            path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${point.x} ${point.y}`;
          } else {
            path += ` L ${point.x} ${point.y}`;
          }
        }
      } else {
        path += ` L ${point.x} ${point.y}`;
      }
    });
    return path;
  };

  // Generate area path
  const generateAreaPath = () => {
    const path = generatePath();
    if (points.length > 0) {
      const lastPoint = points[points.length - 1];
      const firstPoint = points[0];
      if (lastPoint && firstPoint) {
        return `${path} L ${lastPoint.x} ${chartHeight} L ${firstPoint.x} ${chartHeight} Z`;
      }
    }
    return path;
  };

  const linePath = generatePath();
  const areaPath = generateAreaPath();

  // Handle point press
  const handlePointPress = (point: LineChartDataPoint, index: number) => {
    if (onPointPress) {
      onPointPress(point, index);
    }
  };

  return (
    <View style={[{ width, height }, style]}>
      <Svg width={width} height={height}>
        {showGradient && (
          <Defs>
            <LinearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              {gradientColors.map((color, index) => (
                <Stop
                  key={index}
                  offset={index === 0 ? '0' : '1'}
                  stopColor={color}
                  stopOpacity="1"
                />
              ))}
            </LinearGradient>
          </Defs>
        )}

        {/* Grid */}
        {showGrid && (
          <>
            {/* Horizontal lines */}
            {Array.from({ length: horizontalLines }).map((_, i) => {
              const y = (chartHeight / (horizontalLines - 1)) * i;
              return (
                <Line
                  key={`h-${i}`}
                  x1={paddingHorizontal}
                  y1={y}
                  x2={chartWidth + paddingHorizontal}
                  y2={y}
                  stroke={gridColor}
                  strokeOpacity={gridOpacity}
                />
              );
            })}
            {/* Vertical lines */}
            {Array.from({ length: verticalLines }).map((_, i) => {
              const x =
                (chartWidth / (verticalLines - 1)) * i + paddingHorizontal;
              return (
                <Line
                  key={`v-${i}`}
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={chartHeight}
                  stroke={gridColor}
                  strokeOpacity={gridOpacity}
                />
              );
            })}
          </>
        )}

        {/* Area */}
        {showArea && (
          <AnimatedPath
            d={areaPath}
            fill={
              showGradient ? 'url(#areaGradient)' : points[0]?.color || '#000'
            }
            fillOpacity={areaOpacity}
          />
        )}

        {/* Line */}
        <AnimatedPath
          d={linePath}
          stroke={points[0]?.color || '#000'}
          strokeWidth={lineWidth}
          fill="none"
        />

        {/* Dots and Labels/Values */}
        {points.map((point, index) => (
          <React.Fragment key={index}>
            {/* Dots */}
            {showDots && (
              <TouchableOpacity
                onPress={() => handlePointPress(point, index)}
                activeOpacity={onPointPress ? 0.7 : 1}
              >
                <AnimatedCircle
                  cx={point.x}
                  cy={point.y}
                  r={dotSize}
                  fill={point.dotColor || point.color || '#000'}
                />
              </TouchableOpacity>
            )}

            {/* Data point labels */}
            {showLabels && (
              <SvgText
                x={point.x}
                y={point.y - 15}
                textAnchor="middle"
                {...mergedLabelStyle}
              >
                {point.label}
              </SvgText>
            )}

            {/* Data point values */}
            {showValues && (
              <SvgText
                x={point.x}
                y={point.y - (showLabels ? 30 : 15)}
                textAnchor="middle"
                {...mergedValueStyle}
              >
                {valueFormatter(point.value)}
              </SvgText>
            )}
          </React.Fragment>
        ))}

        {/* Y-axis */}
        {showYAxis &&
          Array.from({ length: horizontalLines }).map((_, i) => {
            const value = maxValue - (valueRange / (horizontalLines - 1)) * i;
            const y = (chartHeight / (horizontalLines - 1)) * i;
            return (
              <SvgText
                key={`y-${i}`}
                x={paddingHorizontal - 5}
                y={y + 4}
                textAnchor="end"
                {...mergedYAxisLabelStyle}
              >
                {valueFormatter(value)}
              </SvgText>
            );
          })}

        {/* X-axis */}
        {showXAxis &&
          points.map((point, index) => (
            <SvgText
              key={`x-${index}`}
              x={point.x}
              y={chartHeight + 20}
              textAnchor="middle"
              {...mergedXAxisLabelStyle}
            >
              {point.label}
            </SvgText>
          ))}
      </Svg>
    </View>
  );
};
