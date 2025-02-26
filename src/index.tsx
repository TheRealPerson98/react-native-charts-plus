export function multiply(a: number, b: number): number {
  return a * b;
}

export { LineChart } from './components/LineChart';
export { BarChart } from './components/BarChart';
export { PercentageBarChart } from './components/PercentageBarChart';
export { PieChart } from './components/PieChart';
export { RingChart } from './components/RingChart';
export { RadarChart } from './components/RadarChart';
export { GaugeChart } from './components/GaugeChart';
export { BubbleChart } from './components/BubbleChart';
export type {
  BarChartProps,
  DataPoint,
  PercentageBarChartProps,
  PieChartProps,
  RingChartProps,
  RingDataPoint,
  LineChartDataPoint,
  LineChartProps,
  RadarChartDataPoint,
  RadarChartProps,
  GaugeChartDataPoint,
  GaugeChartProps,
  BubbleChartDataPoint,
  BubbleChartProps,
} from './types';

// Example usage
export const BarChartExample = () => {
  const data = [
    { value: 50, label: 'Jan', color: '#FF5733' },
    { value: 80, label: 'Feb', color: '#33FF57' },
    { value: 65, label: 'Mar', color: '#3357FF' },
    { value: 100, label: 'Apr', color: '#F3FF33' },
    { value: 45, label: 'May', color: '#FF33F3' },
  ];

  return {
    component: 'BarChart',
    props: {
      data,
      height: 300,
      barWidth: 40,
      spacing: 20,
      showValues: true,
      showLabels: true,
      valueFormatter: (value: number) => `$${value}`,
      animated: true,
      animationDuration: 1000,
      onBarPress: (_item: any, _index: number) => {
        // Log bar press event
      },
    },
  };
};

// Example usage for PercentageBarChart
export const PercentageBarChartExample = () => {
  const data = [
    { value: 30, label: 'Category A', color: '#FF5733' },
    { value: 25, label: 'Category B', color: '#33FF57' },
    { value: 15, label: 'Category C', color: '#3357FF' },
    { value: 20, label: 'Category D', color: '#F3FF33' },
    { value: 10, label: 'Category E', color: '#FF33F3' },
  ];

  return {
    component: 'PercentageBarChart',
    props: {
      data,
      radius: 120,
      showLabels: true,
      showValues: true,
      valueFormatter: (value: number) => `${value}%`,
      animated: true,
      animationDuration: 1000,
      donut: true,
      donutRadius: 50,
      onSlicePress: (_item: any, _index: number) => {
        // Log slice press event
      },
    },
  };
};

// Example usage for PieChart
export const PieChartExample = () => {
  const data = [
    { value: 30, label: 'Category A', color: '#FF5733' },
    { value: 25, label: 'Category B', color: '#33FF57' },
    { value: 15, label: 'Category C', color: '#3357FF' },
    { value: 20, label: 'Category D', color: '#F3FF33' },
    { value: 10, label: 'Category E', color: '#FF33F3' },
  ];

  return {
    component: 'PieChart',
    props: {
      data,
      radius: 120,
      showLabels: true,
      showValues: true,
      valueFormatter: (value: number) => `${value}%`,
      animated: true,
      animationDuration: 1000,
      donut: true,
      donutRadius: 50,
      centerLabel: 'Total',
      onSlicePress: (_item: any, _index: number) => {
        // Log slice press event
      },
    },
  };
};

// Example usage for RingChart
export const RingChartExample = () => {
  const data = [
    {
      value: 75,
      total: 100,
      label: 'Progress A',
      fullColor: '#3366CC',
      emptyColor: '#E0E0E0',
    },
    {
      value: 45,
      total: 100,
      label: 'Progress B',
      fullColor: '#DC3912',
      emptyColor: '#E0E0E0',
    },
    {
      value: 90,
      total: 100,
      label: 'Progress C',
      fullColor: '#FF9900',
      emptyColor: '#E0E0E0',
    },
    {
      value: 60,
      total: 100,
      label: 'Progress D',
      fullColor: '#109618',
      emptyColor: '#E0E0E0',
    },
  ];

  return {
    component: 'RingChart',
    props: {
      data,
      ringThickness: 20,
      ringSpacing: 10,
      showLabels: true,
      showValues: true,
      valueFormatter: (value: number, total: number) =>
        `${Math.round((value / total) * 100)}%`,
      animated: true,
      animationDuration: 1000,
      labelPosition: 'right',
      valuePosition: 'with-label',
      showConnectingLines: true,
      onRingPress: (_item: any, _index: number) => {
        // Log ring press event
      },
    },
  };
};

// Example usage for LineChart
export const LineChartExample = () => {
  const data = [
    { value: 30, label: 'Jan', color: '#4CAF50', dotColor: '#2E7D32' },
    { value: 45, label: 'Feb', color: '#4CAF50', dotColor: '#2E7D32' },
    { value: 28, label: 'Mar', color: '#4CAF50', dotColor: '#2E7D32' },
    { value: 65, label: 'Apr', color: '#4CAF50', dotColor: '#2E7D32' },
    { value: 52, label: 'May', color: '#4CAF50', dotColor: '#2E7D32' },
    { value: 75, label: 'Jun', color: '#4CAF50', dotColor: '#2E7D32' },
  ];

  return {
    component: 'LineChart',
    props: {
      data,
      height: 300,
      showArea: true,
      areaOpacity: 0.2,
      lineWidth: 3,
      showDots: true,
      dotSize: 6,
      showLabels: true,
      showValues: true,
      showGrid: true,
      gridColor: '#E0E0E0',
      gridOpacity: 0.5,
      valueFormatter: (value: number) => `${value}%`,
      animated: true,
      animationDuration: 1500,
      curveType: 'natural',
      showGradient: true,
      gradientColors: ['rgba(76, 175, 80, 0.8)', 'rgba(76, 175, 80, 0)'],
      showYAxis: true,
      showXAxis: true,
      horizontalLines: 5,
      verticalLines: 6,
      onPointPress: (_item: any, _index: number) => {
        // Log point press event
      },
    },
  };
};

// Example usage for RadarChart
export const RadarChartExample = () => {
  const data = [
    // First series (Current Year)
    [
      { value: 80, label: 'Sales', color: '#4C51BF', fillColor: '#4C51BF' },
      { value: 90, label: 'Marketing', color: '#4C51BF', fillColor: '#4C51BF' },
      {
        value: 70,
        label: 'Development',
        color: '#4C51BF',
        fillColor: '#4C51BF',
      },
      {
        value: 85,
        label: 'Customer Support',
        color: '#4C51BF',
        fillColor: '#4C51BF',
      },
      { value: 75, label: 'Finance', color: '#4C51BF', fillColor: '#4C51BF' },
      { value: 65, label: 'Product', color: '#4C51BF', fillColor: '#4C51BF' },
    ],
    // Second series (Previous Year)
    [
      { value: 65, label: 'Sales', color: '#ED8936', fillColor: '#ED8936' },
      { value: 75, label: 'Marketing', color: '#ED8936', fillColor: '#ED8936' },
      {
        value: 55,
        label: 'Development',
        color: '#ED8936',
        fillColor: '#ED8936',
      },
      {
        value: 70,
        label: 'Customer Support',
        color: '#ED8936',
        fillColor: '#ED8936',
      },
      { value: 60, label: 'Finance', color: '#ED8936', fillColor: '#ED8936' },
      { value: 50, label: 'Product', color: '#ED8936', fillColor: '#ED8936' },
    ],
  ];

  return {
    component: 'RadarChart',
    props: {
      data,
      height: 400,
      width: 400,
      showLabels: true,
      showValues: false,
      showAxis: true,
      showPolygons: true,
      showGrid: true,
      gridLevels: 5,
      valueFormatter: (value: number) => `${value}%`,
      animated: true,
      animationDuration: 1500,
      polygonStyle: {
        strokeWidth: 2,
        strokeOpacity: 1,
        fillOpacity: 0.3,
      },
      labelStyle: {
        fill: '#4A5568',
        fontSize: '12',
        fontWeight: '500',
      },
      axisStyle: {
        stroke: '#CBD5E0',
        strokeWidth: 1,
        strokeOpacity: 0.7,
      },
      gridStyle: {
        stroke: '#E2E8F0',
        strokeWidth: 1,
        strokeOpacity: 0.5,
        strokeDasharray: '4,4',
      },
      showLegend: true,
      legendPosition: 'bottom',
      onPointPress: (_item: any, _seriesIndex: number, _pointIndex: number) => {
        // Log point press event
      },
    },
  };
};

// Example usage for GaugeChart
export const GaugeChartExample = () => {
  const data = {
    value: 72,
    minValue: 0,
    maxValue: 100,
    label: 'Performance',
    color: '#4C51BF',
    backgroundColor: '#E2E8F0',
    valueColor: '#2D3748',
  };

  const sections = [
    { value: 30, color: '#F56565', label: 'Low' },
    { value: 70, color: '#F6AD55', label: 'Medium' },
    { value: 100, color: '#68D391', label: 'High' },
  ];

  return {
    component: 'GaugeChart',
    props: {
      data,
      width: 350,
      height: 300,
      radius: 120,
      startAngle: 135,
      endAngle: 405,
      showLabels: true,
      showValues: true,
      showMinMax: true,
      valueFormatter: (value: number) => `${value}%`,
      animated: true,
      animationDuration: 1500,
      thickness: 25,
      needleColor: '#E53E3E',
      needleBaseColor: '#718096',
      needleBaseSize: 15,
      showSections: true,
      sections,
      showTicks: true,
      tickCount: 5,
      tickColor: '#CBD5E0',
      tickSize: 10,
      showTickLabels: true,
      centerLabel: 'Score',
      centerLabelBackgroundColor: '#FFFFFF',
      centerLabelBorderRadius: 20,
      onPress: (_item: any) => {
        // Log press event
      },
    },
  };
};

// Example usage for BubbleChart
export const BubbleChartExample = () => {
  const data = [
    { x: 10, y: 20, size: 15, label: 'Point A', color: '#FF5733' },
    { x: 30, y: 40, size: 25, label: 'Point B', color: '#33FF57' },
    { x: 50, y: 10, size: 35, label: 'Point C', color: '#3357FF' },
    { x: 70, y: 30, size: 20, label: 'Point D', color: '#F3FF33' },
    { x: 90, y: 50, size: 30, label: 'Point E', color: '#FF33F3' },
  ];

  return {
    component: 'BubbleChart',
    props: {
      data,
      width: 400,
      height: 300,
      showLabels: true,
      showValues: true,
      xAxisTitle: 'X Axis',
      yAxisTitle: 'Y Axis',
      valueFormatter: (x: number, y: number, size: number) =>
        `(${x}, ${y}, ${size})`,
      animated: true,
      animationDuration: 1000,
      showGrid: true,
      gridColor: '#E0E0E0',
      gridOpacity: 0.5,
      showXAxis: true,
      showYAxis: true,
      horizontalLines: 5,
      verticalLines: 5,
      onBubblePress: (_item: any, _index: number) => {
        // Log bubble press event
      },
    },
  };
};
