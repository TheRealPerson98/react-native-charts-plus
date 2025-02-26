import React from 'react';
import {
  View,
  Animated,
  Dimensions,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Svg, { Circle, Line, Text as SvgText, Polygon } from 'react-native-svg';
import type { RadarChartProps, RadarChartDataPoint } from '../types';
import type { TextProps, TextAnchor } from 'react-native-svg';

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);
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

const defaultAxisStyle = {
  stroke: '#CBD5E0',
  strokeWidth: 1,
  strokeOpacity: 0.7,
};

const defaultGridStyle = {
  stroke: '#E2E8F0',
  strokeWidth: 1,
  strokeOpacity: 0.5,
  strokeDasharray: '4,4',
};

const defaultPolygonStyle = {
  strokeWidth: 2,
  strokeOpacity: 0.8,
  fillOpacity: 0.2,
};

const defaultDotStyle = {
  fill: '#FFFFFF',
  stroke: '#4A5568',
  strokeWidth: 1.5,
};

const defaultBackgroundStyle = {
  fill: '#F7FAFC',
  fillOpacity: 0.3,
};

const styles = StyleSheet.create({
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
    padding: 6,
  },
  legendColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  legendText: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '500',
  },
  legendContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  legendContainerBottom: {
    marginTop: 16,
  },
  legendContainerTop: {
    marginBottom: 16,
  },
});

export const RadarChart: React.FC<RadarChartProps> = ({
  data,
  width = Dimensions.get('window').width,
  height = 300,
  radius,
  showLabels = true,
  showValues = false,
  showAxis = true,
  showPolygons = true,
  showGrid = true,
  gridLevels = 5,
  valueFormatter = (value: number) => value.toString(),
  style,
  labelStyle,
  valueStyle,
  axisStyle,
  gridStyle,
  polygonStyle,
  dotStyle,
  backgroundStyle,
  animated = true,
  animationDuration = 1000,
  onPointPress,
  showLegend = false,
  legendPosition = 'bottom',
  legendStyle,
  legendItemStyle,
  legendLabelStyle,
  legendItemBackgroundColor = '#F7FAFC',
  legendItemBorderRadius = 4,
  maxValue,
  minValue = 0,
}) => {
  // Calculate chart dimensions
  const chartSize = Math.min(width, height);
  const chartRadius = radius || chartSize * 0.4;
  const centerX = width / 2;
  const centerY = height / 2;

  // Merge default styles with user-provided styles
  const mergedLabelStyle = { ...defaultLabelStyle, ...(labelStyle as object) };
  const mergedValueStyle = { ...defaultValueStyle, ...(valueStyle as object) };
  const mergedAxisStyle = { ...defaultAxisStyle, ...axisStyle };
  const mergedGridStyle = { ...defaultGridStyle, ...gridStyle };
  const mergedBackgroundStyle = {
    ...defaultBackgroundStyle,
    ...backgroundStyle,
  };

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

  // Calculate max value if not provided
  const calculatedMaxValue =
    maxValue ||
    Math.max(...data.flatMap((series) => series.map((point) => point.value)));

  // Calculate angles for each axis
  const categories = data[0]?.map((point) => point.label) || [];
  const angleStep = (Math.PI * 2) / categories.length;

  // Generate coordinates for points
  const generatePoints = (
    series: RadarChartDataPoint[],
    seriesIndex: number
  ) => {
    return series.map((point, i) => {
      const angle = -Math.PI / 2 + i * angleStep;
      const normalizedValue =
        (point.value - minValue) / (calculatedMaxValue - minValue);
      const distance = normalizedValue * chartRadius;
      const x = centerX + distance * Math.cos(angle);
      const y = centerY + distance * Math.sin(angle);
      // Use seriesIndex to potentially customize points based on series
      const seriesColor =
        point.color || `hsl(${(seriesIndex * 137) % 360}, 70%, 50%)`;
      return { ...point, x, y, angle, seriesColor };
    });
  };

  // Generate polygon points string
  const generatePolygonPoints = (
    points: (RadarChartDataPoint & { x: number; y: number })[]
  ) => {
    return points.map((point) => `${point.x},${point.y}`).join(' ');
  };

  // Handle point press
  const handlePointPress = (
    point: RadarChartDataPoint,
    seriesIndex: number,
    pointIndex: number
  ) => {
    if (onPointPress) {
      onPointPress(point, seriesIndex, pointIndex);
    }
  };

  // Generate series data with coordinates
  const seriesWithCoordinates = data.map(generatePoints);

  // Render the legend based on position
  const renderLegend = () => {
    if (!showLegend) return null;

    const legendItems = data.map((series, seriesIndex) => {
      // Use the first point's color as the series color, or generate one
      const seriesColor =
        series[0]?.color || `hsl(${(seriesIndex * 137) % 360}, 70%, 50%)`;
      const seriesName = `Series ${seriesIndex + 1}`;

      return (
        <View
          key={`legend-${seriesIndex}`}
          style={[
            styles.legendItem,
            {
              backgroundColor: legendItemBackgroundColor,
              borderRadius: legendItemBorderRadius,
            },
            legendItemStyle,
          ]}
        >
          <View
            style={[
              styles.legendColorDot,
              {
                backgroundColor: seriesColor,
              },
            ]}
          />
          <Text style={[styles.legendText, legendLabelStyle]}>
            {seriesName}
          </Text>
        </View>
      );
    });

    return (
      <View
        style={[
          styles.legendContainer,
          legendPosition === 'bottom' && styles.legendContainerBottom,
          legendPosition === 'top' && styles.legendContainerTop,
          legendStyle,
        ]}
      >
        {legendItems}
      </View>
    );
  };

  return (
    <View style={[{ width, height }, style]}>
      {legendPosition === 'top' && renderLegend()}
      <Svg width={width} height={height}>
        {/* Background polygon */}
        {showGrid && (
          <Polygon
            points={Array.from({ length: categories.length })
              .map((_, i) => {
                const angle = -Math.PI / 2 + i * angleStep;
                return `${centerX + chartRadius * Math.cos(angle)},${centerY + chartRadius * Math.sin(angle)}`;
              })
              .join(' ')}
            {...mergedBackgroundStyle}
          />
        )}

        {/* Grid circles */}
        {showGrid &&
          Array.from({ length: gridLevels }).map((_, i) => {
            const levelRadius = (chartRadius / gridLevels) * (i + 1);
            return (
              <Circle
                key={`grid-${i}`}
                cx={centerX}
                cy={centerY}
                r={levelRadius}
                fill="none"
                {...mergedGridStyle}
              />
            );
          })}

        {/* Axis lines */}
        {showAxis &&
          categories.map((_, i) => {
            const angle = -Math.PI / 2 + i * angleStep;
            return (
              <Line
                key={`axis-${i}`}
                x1={centerX}
                y1={centerY}
                x2={centerX + chartRadius * Math.cos(angle)}
                y2={centerY + chartRadius * Math.sin(angle)}
                {...mergedAxisStyle}
              />
            );
          })}

        {/* Data polygons */}
        {showPolygons &&
          seriesWithCoordinates.map((points, seriesIndex) => {
            const seriesColor =
              points[0]?.color || `hsl(${(seriesIndex * 137) % 360}, 70%, 50%)`;
            const mergedSeriesPolygonStyle = {
              ...defaultPolygonStyle,
              ...polygonStyle,
              stroke: seriesColor,
              fill: points[0]?.fillColor || seriesColor,
            };

            return (
              <AnimatedPolygon
                key={`polygon-${seriesIndex}`}
                points={generatePolygonPoints(points)}
                {...mergedSeriesPolygonStyle}
              />
            );
          })}

        {/* Data points */}
        {seriesWithCoordinates.map((points, seriesIndex) => (
          <React.Fragment key={`series-${seriesIndex}`}>
            {points.map((point, pointIndex) => {
              const pointColor =
                point.dotColor ||
                point.color ||
                `hsl(${(seriesIndex * 137) % 360}, 70%, 50%)`;
              const mergedSeriesDotStyle = {
                ...defaultDotStyle,
                ...dotStyle,
                stroke: pointColor,
              };

              const showThisDot =
                point.showDot !== undefined ? point.showDot : true;

              return (
                <React.Fragment key={`point-${seriesIndex}-${pointIndex}`}>
                  {showThisDot && (
                    <TouchableOpacity
                      onPress={() =>
                        handlePointPress(point, seriesIndex, pointIndex)
                      }
                      activeOpacity={onPointPress ? 0.7 : 1}
                    >
                      <AnimatedCircle
                        cx={point.x}
                        cy={point.y}
                        r={point.dotSize || 4}
                        {...mergedSeriesDotStyle}
                      />
                    </TouchableOpacity>
                  )}

                  {/* Data point values */}
                  {showValues && (
                    <SvgText
                      x={point.x}
                      y={point.y - 15}
                      textAnchor="middle"
                      {...mergedValueStyle}
                    >
                      {valueFormatter(point.value)}
                    </SvgText>
                  )}
                </React.Fragment>
              );
            })}
          </React.Fragment>
        ))}

        {/* Category labels */}
        {showLabels &&
          categories.map((label, i) => {
            const angle = -Math.PI / 2 + i * angleStep;
            const labelDistance = chartRadius * 1.15;
            const x = centerX + labelDistance * Math.cos(angle);
            const y = centerY + labelDistance * Math.sin(angle);

            // Adjust text anchor based on position
            let textAnchor: TextAnchor = 'middle';
            if (Math.abs(Math.cos(angle)) > 0.7) {
              textAnchor = Math.cos(angle) > 0 ? 'start' : 'end';
            }

            return (
              <SvgText
                key={`label-${i}`}
                x={x}
                y={y}
                textAnchor={textAnchor}
                alignmentBaseline="central"
                {...mergedLabelStyle}
              >
                {label}
              </SvgText>
            );
          })}
      </Svg>
      {legendPosition === 'bottom' && renderLegend()}
    </View>
  );
};
