import type { ViewStyle, TextStyle } from 'react-native';

export interface DataPoint {
  value: number;
  label: string;
  color?: string;
  outlineColor?: string;
  outlineWidth?: number;
  labelBackgroundColor?: string;
}

export interface RingDataPoint {
  value: number;
  total: number;
  label: string;
  fullColor?: string;
  emptyColor?: string;
}

export interface BarChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  barWidth?: number;
  spacing?: number;
  showValues?: boolean;
  showLabels?: boolean;
  valueFormatter?: (value: number) => string;
  style?: ViewStyle;
  barStyle?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  animated?: boolean;
  animationDuration?: number;
  onBarPress?: (item: DataPoint, index: number) => void;
}

export interface PercentageBarChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  valueFormatter?: (value: number) => string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  animated?: boolean;
  animationDuration?: number;
  onSlicePress?: (item: DataPoint, index: number) => void;
}

export interface PieChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
  radius?: number;
  showLabels?: boolean;
  showValues?: boolean;
  valueFormatter?: (value: number) => string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  animated?: boolean;
  animationDuration?: number;
  donut?: boolean;
  donutRadius?: number;
  onSlicePress?: (item: DataPoint, index: number) => void;
  centerLabel?: string;
  centerLabelStyle?: TextStyle;
  outlineColor?: string;
  outlineWidth?: number;
  showLabelBackground?: boolean;
  labelBackgroundColor?: string;
  labelBackgroundOpacity?: number;
  labelBackgroundBorderRadius?: number;
  labelBackgroundBorderWidth?: number;
  labelBackgroundBorderColor?: string;
  labelBackgroundPadding?: number;
  showValueBackground?: boolean;
  valueBackgroundColor?: string;
  valueBackgroundOpacity?: number;
  valueBackgroundBorderRadius?: number;
  valueBackgroundBorderWidth?: number;
  valueBackgroundBorderColor?: string;
  valueBackgroundPadding?: number;
  externalLabelDistance?: number;
  externalLabelMinAngle?: number;
  connectingLineColor?: string;
  connectingLineWidth?: number;
  connectingLineStyle?: 'straight' | 'curved';
  showLegend?: boolean;
  legendPosition?: 'bottom' | 'right' | 'left' | 'top';
  legendStyle?: ViewStyle;
  legendItemStyle?: ViewStyle;
  legendLabelStyle?: TextStyle;
  legendItemBackgroundColor?: string;
  legendItemBorderRadius?: number;
  centerLabelBackgroundColor?: string;
  centerLabelBorderWidth?: number;
  centerLabelBorderColor?: string;
  centerLabelBorderRadius?: number;
}

export interface RingChartProps {
  data: RingDataPoint[];
  width?: number;
  height?: number;
  ringThickness?: number;
  ringSpacing?: number;
  showLabels?: boolean;
  showValues?: boolean;
  valueFormatter?: (value: number, total: number) => string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  animated?: boolean;
  animationDuration?: number;
  onRingPress?: (item: RingDataPoint, index: number) => void;
  labelPosition?: 'top' | 'bottom' | 'left' | 'right';
  valuePosition?: 'top' | 'bottom' | 'left' | 'right' | 'with-label';
  labelBackgroundColor?: string;
  labelBackgroundOpacity?: number;
  labelBackgroundBorderRadius?: number;
  labelBackgroundBorderWidth?: number;
  labelBackgroundBorderColor?: string;
  labelBackgroundPadding?: number;
  valueBackgroundColor?: string;
  valueBackgroundOpacity?: number;
  valueBackgroundBorderRadius?: number;
  valueBackgroundBorderWidth?: number;
  valueBackgroundBorderColor?: string;
  valueBackgroundPadding?: number;
  showConnectingLines?: boolean;
  connectingLineColor?: string;
  connectingLineWidth?: number;
  connectingLineStyle?: 'straight' | 'dashed';
  showLegend?: boolean;
  legendPosition?: 'bottom' | 'right' | 'left' | 'top';
  legendStyle?: ViewStyle;
  legendItemStyle?: ViewStyle;
  legendLabelStyle?: TextStyle;
  legendItemBackgroundColor?: string;
  legendItemBorderRadius?: number;
}

export interface LineChartDataPoint {
  value: number;
  label: string;
  color?: string;
  dotColor?: string;
  dotSize?: number;
  showDot?: boolean;
  customDotComponent?: React.ReactNode;
}

export interface RadarChartDataPoint {
  value: number;
  label: string;
  color?: string;
  fillColor?: string;
  fillOpacity?: number;
  strokeWidth?: number;
  dotColor?: string;
  dotSize?: number;
  showDot?: boolean;
}

export interface RadarChartProps {
  data: RadarChartDataPoint[][];
  width?: number;
  height?: number;
  radius?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showAxis?: boolean;
  showPolygons?: boolean;
  showGrid?: boolean;
  gridLevels?: number;
  valueFormatter?: (value: number) => string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  axisStyle?: {
    strokeWidth?: number;
    stroke?: string;
    strokeOpacity?: number;
    strokeDasharray?: string;
  };
  gridStyle?: {
    strokeWidth?: number;
    stroke?: string;
    strokeOpacity?: number;
    strokeDasharray?: string;
  };
  polygonStyle?: {
    strokeWidth?: number;
    stroke?: string;
    strokeOpacity?: number;
    fill?: string;
    fillOpacity?: number;
  };
  dotStyle?: {
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  };
  backgroundStyle?: {
    fill?: string;
    fillOpacity?: number;
  };
  animated?: boolean;
  animationDuration?: number;
  onPointPress?: (
    item: RadarChartDataPoint,
    seriesIndex: number,
    pointIndex: number
  ) => void;
  showLegend?: boolean;
  legendPosition?: 'bottom' | 'right' | 'left' | 'top';
  legendStyle?: ViewStyle;
  legendItemStyle?: ViewStyle;
  legendLabelStyle?: TextStyle;
  legendItemBackgroundColor?: string;
  legendItemBorderRadius?: number;
  maxValue?: number;
  minValue?: number;
}

export interface LineChartProps {
  data: LineChartDataPoint[];
  width?: number;
  height?: number;
  showArea?: boolean;
  areaOpacity?: number;
  lineWidth?: number;
  showDots?: boolean;
  dotSize?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showGrid?: boolean;
  gridColor?: string;
  gridOpacity?: number;
  valueFormatter?: (value: number) => string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  animated?: boolean;
  animationDuration?: number;
  onPointPress?: (item: LineChartDataPoint, index: number) => void;
  curveType?: 'linear' | 'natural' | 'step';
  showGradient?: boolean;
  gradientColors?: string[];
  yAxisRange?: { min?: number; max?: number };
  showYAxis?: boolean;
  showXAxis?: boolean;
  yAxisLabelStyle?: TextStyle;
  xAxisLabelStyle?: TextStyle;
  yAxisWidth?: number;
  xAxisHeight?: number;
  horizontalLines?: number;
  verticalLines?: number;
}

export interface GaugeChartDataPoint {
  value: number;
  minValue?: number;
  maxValue?: number;
  label: string;
  color?: string;
  backgroundColor?: string;
  valueColor?: string;
}

export interface BubbleChartDataPoint {
  x: number;
  y: number;
  size: number;
  label: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
}

export interface BubbleChartProps {
  data: BubbleChartDataPoint[];
  width?: number;
  height?: number;
  showLabels?: boolean;
  showValues?: boolean;
  xAxisTitle?: string;
  yAxisTitle?: string;
  valueFormatter?: (x: number, y: number, size: number) => string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  xAxisLabelStyle?: TextStyle;
  yAxisLabelStyle?: TextStyle;
  bubbleStyle?: ViewStyle;
  animated?: boolean;
  animationDuration?: number;
  showGrid?: boolean;
  gridColor?: string;
  gridOpacity?: number;
  xAxisRange?: { min?: number; max?: number };
  yAxisRange?: { min?: number; max?: number };
  sizeRange?: { min?: number; max?: number };
  showXAxis?: boolean;
  showYAxis?: boolean;
  horizontalLines?: number;
  verticalLines?: number;
  onBubblePress?: (item: BubbleChartDataPoint, index: number) => void;
}

export interface GaugeChartProps {
  data: GaugeChartDataPoint;
  width?: number;
  height?: number;
  radius?: number;
  startAngle?: number;
  endAngle?: number;
  showLabels?: boolean;
  showValues?: boolean;
  showMinMax?: boolean;
  valueFormatter?: (value: number) => string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  valueStyle?: TextStyle;
  minMaxStyle?: TextStyle;
  animated?: boolean;
  animationDuration?: number;
  thickness?: number;
  needleColor?: string;
  needleBaseColor?: string;
  needleBaseSize?: number;
  showSections?: boolean;
  sections?: Array<{
    value: number;
    color: string;
    label?: string;
  }>;
  showTicks?: boolean;
  tickCount?: number;
  tickColor?: string;
  tickSize?: number;
  tickLabelStyle?: TextStyle;
  showTickLabels?: boolean;
  centerLabel?: string;
  centerLabelStyle?: TextStyle;
  centerLabelBackgroundColor?: string;
  centerLabelBorderRadius?: number;
  onPress?: (item: GaugeChartDataPoint) => void;
}

export interface ContributionDataPoint {
  value: number;
  date: string;
  color?: string;
}

export interface ContributionChartProps {
  data: ContributionDataPoint[];
  width?: number;
  height?: number;
  cellSize?: number;
  cellSpacing?: number;
  cellBorderRadius?: number;
  showLabels?: boolean;
  showTooltip?: boolean;
  tooltipFormatter?: (value: number, date: string) => string;
  style?: ViewStyle;
  labelStyle?: TextStyle;
  tooltipStyle?: TextStyle;
  emptyColor?: string;
  colorScale?: string[];
  thresholds?: number[];
  animated?: boolean;
  animationDuration?: number;
  onCellPress?: (item: ContributionDataPoint, index: number) => void;
  monthLabelStyle?: TextStyle;
  dayLabelStyle?: TextStyle;
  showMonthLabels?: boolean;
  showDayLabels?: boolean;
  weeksToShow?: number;
}
