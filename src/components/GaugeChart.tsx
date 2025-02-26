import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import Svg, {
  Path,
  Circle,
  G,
  Text as SvgText,
  Line,
  Rect,
} from 'react-native-svg';
import type { GaugeChartProps } from '../types';
import type { TextProps } from 'react-native-svg';

const AnimatedPath = Animated.createAnimatedComponent(Path);
const AnimatedG = Animated.createAnimatedComponent(G);

// Default text styles to avoid black text
const defaultLabelStyle: TextProps = {
  fill: '#4A5568',
  fontSize: '16',
  fontWeight: '600',
  textAnchor: 'middle',
};

const defaultValueStyle: TextProps = {
  fill: '#718096',
  fontSize: '24',
  fontWeight: '700',
  textAnchor: 'middle',
};

const defaultMinMaxStyle: TextProps = {
  fill: '#A0AEC0',
  fontSize: '12',
  fontWeight: '400',
};

const defaultTickLabelStyle: TextProps = {
  fill: '#A0AEC0',
  fontSize: '10',
  fontWeight: '400',
  textAnchor: 'middle',
};

const DEFAULT_WIDTH = Dimensions.get('window').width;
const DEFAULT_HEIGHT = 300;
const DEFAULT_RADIUS = 120;
const DEFAULT_START_ANGLE = 135;
const DEFAULT_END_ANGLE = 405;
const DEFAULT_ANIMATION_DURATION = 1000;
const DEFAULT_THICKNESS = 20;
const DEFAULT_NEEDLE_COLOR = '#E53E3E';
const DEFAULT_NEEDLE_BASE_COLOR = '#718096';
const DEFAULT_NEEDLE_BASE_SIZE = 10;
const DEFAULT_TICK_COUNT = 5;
const DEFAULT_TICK_COLOR = '#CBD5E0';
const DEFAULT_TICK_SIZE = 10;

export const GaugeChart: React.FC<GaugeChartProps> = ({
  data,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  radius = DEFAULT_RADIUS,
  startAngle = DEFAULT_START_ANGLE,
  endAngle = DEFAULT_END_ANGLE,
  showLabels = true,
  showValues = true,
  showMinMax = true,
  valueFormatter = (value: number) => value.toString(),
  style,
  labelStyle,
  valueStyle,
  minMaxStyle,
  animated = true,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  thickness = DEFAULT_THICKNESS,
  needleColor = DEFAULT_NEEDLE_COLOR,
  needleBaseColor = DEFAULT_NEEDLE_BASE_COLOR,
  needleBaseSize = DEFAULT_NEEDLE_BASE_SIZE,
  showSections = false,
  sections = [],
  showTicks = true,
  tickCount = DEFAULT_TICK_COUNT,
  tickColor = DEFAULT_TICK_COLOR,
  tickSize = DEFAULT_TICK_SIZE,
  tickLabelStyle,
  showTickLabels = true,
  centerLabel,
  centerLabelStyle,
  centerLabelBackgroundColor = '#FFFFFF',
  centerLabelBorderRadius = 20,
  onPress,
}) => {
  // Merge default styles with user-provided styles
  const mergedLabelStyle = { ...defaultLabelStyle, ...(labelStyle as object) };
  const mergedValueStyle = { ...defaultValueStyle, ...(valueStyle as object) };
  const mergedMinMaxStyle = {
    ...defaultMinMaxStyle,
    ...(minMaxStyle as object),
  };
  const mergedTickLabelStyle = {
    ...defaultTickLabelStyle,
    ...(tickLabelStyle as object),
  };

  // Set default min and max values if not provided
  const minValue = data.minValue ?? 0;
  const maxValue = data.maxValue ?? 100;

  // Ensure value is within min and max range
  const clampedValue = Math.min(Math.max(data.value, minValue), maxValue);

  // Calculate the angle for the needle based on the value
  const valueAngle =
    startAngle +
    ((clampedValue - minValue) / (maxValue - minValue)) *
      (endAngle - startAngle);

  // Animation value
  const animationProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (animated) {
      Animated.timing(animationProgress, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    } else {
      animationProgress.setValue(1);
    }
  }, [animated, animationProgress, animationDuration, data.value]);

  // Calculate the center of the gauge
  const centerX = width / 2;
  const centerY = height / 2;

  // Calculate the path for the gauge background
  const createArc = (
    startAngleRad: number,
    endAngleRad: number,
    radiusValue: number,
    thicknessValue: number
  ) => {
    const innerRadius = radiusValue - thicknessValue;
    const outerRadius = radiusValue;

    const startX = centerX + Math.cos(startAngleRad) * outerRadius;
    const startY = centerY + Math.sin(startAngleRad) * outerRadius;
    const endX = centerX + Math.cos(endAngleRad) * outerRadius;
    const endY = centerY + Math.sin(endAngleRad) * outerRadius;

    const innerStartX = centerX + Math.cos(startAngleRad) * innerRadius;
    const innerStartY = centerY + Math.sin(startAngleRad) * innerRadius;
    const innerEndX = centerX + Math.cos(endAngleRad) * innerRadius;
    const innerEndY = centerY + Math.sin(endAngleRad) * innerRadius;

    const largeArcFlag = endAngleRad - startAngleRad <= Math.PI ? '0' : '1';

    return `
      M ${startX} ${startY}
      A ${outerRadius} ${outerRadius} 0 ${largeArcFlag} 1 ${endX} ${endY}
      L ${innerEndX} ${innerEndY}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY}
      Z
    `;
  };

  // Convert degrees to radians
  const degToRad = (deg: number) => (deg * Math.PI) / 180;

  // Background arc
  const backgroundStartAngleRad = degToRad(startAngle);
  const backgroundEndAngleRad = degToRad(endAngle);
  const backgroundArc = createArc(
    backgroundStartAngleRad,
    backgroundEndAngleRad,
    radius,
    thickness
  );

  // Value arc
  const valueEndAngleRad = degToRad(valueAngle);
  const valueArc = createArc(
    backgroundStartAngleRad,
    valueEndAngleRad,
    radius,
    thickness
  );

  // Create section arcs if sections are provided
  const sectionArcs =
    showSections && sections.length > 0
      ? sections.map((section, index) => {
          const sectionValue = Math.min(
            Math.max(section.value, minValue),
            maxValue
          );
          const sectionAngle =
            startAngle +
            ((sectionValue - minValue) / (maxValue - minValue)) *
              (endAngle - startAngle);
          const prevSectionAngle =
            index === 0
              ? startAngle
              : startAngle +
                (((sections[index - 1]?.value ?? minValue) - minValue) /
                  (maxValue - minValue)) *
                  (endAngle - startAngle);

          const sectionStartAngleRad = degToRad(prevSectionAngle);
          const sectionEndAngleRad = degToRad(sectionAngle);

          return {
            path: createArc(
              sectionStartAngleRad,
              sectionEndAngleRad,
              radius,
              thickness
            ),
            color: section.color,
            label: section.label,
          };
        })
      : [];

  // Create ticks
  const ticks = [];
  if (showTicks) {
    const tickStep = (endAngle - startAngle) / (tickCount - 1);
    const valueStep = (maxValue - minValue) / (tickCount - 1);

    for (let i = 0; i < tickCount; i++) {
      const tickAngle = startAngle + i * tickStep;
      const tickAngleRad = degToRad(tickAngle);
      const tickValue = minValue + i * valueStep;

      const innerX = centerX + Math.cos(tickAngleRad) * (radius - thickness);
      const innerY = centerY + Math.sin(tickAngleRad) * (radius - thickness);
      const outerX =
        centerX + Math.cos(tickAngleRad) * (radius - thickness + tickSize);
      const outerY =
        centerY + Math.sin(tickAngleRad) * (radius - thickness + tickSize);

      const labelX =
        centerX + Math.cos(tickAngleRad) * (radius - thickness + tickSize + 15);
      const labelY =
        centerY + Math.sin(tickAngleRad) * (radius - thickness + tickSize + 15);

      ticks.push({
        line: { x1: innerX, y1: innerY, x2: outerX, y2: outerY },
        label: { x: labelX, y: labelY, value: tickValue },
      });
    }
  }

  // Calculate needle points
  const needleLength = radius - thickness / 2;
  const needleWidth = 5;

  const createNeedle = (angle: number) => {
    const angleRad = degToRad(angle);
    const tipX = centerX + Math.cos(angleRad) * needleLength;
    const tipY = centerY + Math.sin(angleRad) * needleLength;

    const leftAngleRad = degToRad(angle + 90);
    const rightAngleRad = degToRad(angle - 90);

    const leftX = centerX + Math.cos(leftAngleRad) * needleWidth;
    const leftY = centerY + Math.sin(leftAngleRad) * needleWidth;

    const rightX = centerX + Math.cos(rightAngleRad) * needleWidth;
    const rightY = centerY + Math.sin(rightAngleRad) * needleWidth;

    return `M ${tipX} ${tipY} L ${leftX} ${leftY} L ${rightX} ${rightY} Z`;
  };

  // Animated needle rotation
  const needleAngle = animationProgress.interpolate({
    inputRange: [0, 1],
    outputRange: [startAngle, valueAngle],
  });

  return (
    <View style={[styles.container, { width, height }, style]}>
      <TouchableOpacity
        activeOpacity={onPress ? 0.7 : 1}
        onPress={() => onPress && onPress(data)}
        style={styles.touchable}
      >
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          {/* Background Arc */}
          <Path d={backgroundArc} fill={data.backgroundColor || '#E2E8F0'} />

          {/* Section Arcs */}
          {showSections &&
            sectionArcs.map((section, index) => (
              <Path
                key={`section-${index}`}
                d={section.path}
                fill={section.color}
              />
            ))}

          {/* Value Arc */}
          {!showSections && (
            <AnimatedPath
              d={valueArc}
              fill={data.color || '#4299E1'}
              fillOpacity={1}
            />
          )}

          {/* Ticks */}
          {showTicks &&
            ticks.map((tick, index) => (
              <React.Fragment key={`tick-${index}`}>
                <Line
                  x1={tick.line.x1}
                  y1={tick.line.y1}
                  x2={tick.line.x2}
                  y2={tick.line.y2}
                  stroke={tickColor}
                  strokeWidth={2}
                />
                {showTickLabels && (
                  <SvgText
                    x={tick.label.x}
                    y={tick.label.y}
                    {...mergedTickLabelStyle}
                  >
                    {valueFormatter(tick.label.value)}
                  </SvgText>
                )}
              </React.Fragment>
            ))}

          {/* Needle */}
          <AnimatedG rotation={needleAngle} origin={`${centerX}, ${centerY}`}>
            <Path d={createNeedle(0)} fill={needleColor} />
          </AnimatedG>

          {/* Needle Base */}
          <Circle
            cx={centerX}
            cy={centerY}
            r={needleBaseSize}
            fill={needleBaseColor}
          />

          {/* Center Label Background */}
          {centerLabel && (
            <Rect
              x={centerX - radius / 3}
              y={centerY - radius / 3}
              width={(radius * 2) / 3}
              height={(radius * 2) / 3}
              fill={centerLabelBackgroundColor}
              rx={centerLabelBorderRadius}
              ry={centerLabelBorderRadius}
            />
          )}

          {/* Min Value */}
          {showMinMax && (
            <SvgText
              x={centerX - radius + thickness / 2}
              y={centerY + radius / 2}
              {...mergedMinMaxStyle}
            >
              {valueFormatter(minValue)}
            </SvgText>
          )}

          {/* Max Value */}
          {showMinMax && (
            <SvgText
              x={centerX + radius - thickness / 2}
              y={centerY + radius / 2}
              {...mergedMinMaxStyle}
              textAnchor="end"
            >
              {valueFormatter(maxValue)}
            </SvgText>
          )}

          {/* Value */}
          {showValues && (
            <SvgText
              x={centerX}
              y={centerY + (centerLabel ? -10 : 0)}
              {...mergedValueStyle}
              fill={data.valueColor || mergedValueStyle.fill}
            >
              {valueFormatter(data.value)}
            </SvgText>
          )}

          {/* Label */}
          {showLabels && (
            <SvgText
              x={centerX}
              y={centerY + (showValues ? 25 : 0)}
              {...mergedLabelStyle}
            >
              {data.label}
            </SvgText>
          )}

          {/* Center Label */}
          {centerLabel && (
            <SvgText
              x={centerX}
              y={centerY + (showValues ? 0 : -10)}
              {...{
                ...mergedLabelStyle,
                ...(centerLabelStyle as object),
              }}
            >
              {centerLabel}
            </SvgText>
          )}
        </Svg>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  touchable: {
    width: '100%',
    height: '100%',
  },
});
