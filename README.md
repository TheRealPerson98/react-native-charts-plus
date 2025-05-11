# React Native Charts Plus

[![npm version](https://img.shields.io/npm/v/react-native-charts-plus.svg)](https://www.npmjs.com/package/react-native-charts-plus)
[![npm downloads](https://img.shields.io/npm/dm/react-native-charts-plus.svg)](https://www.npmjs.com/package/react-native-charts-plus)
[![license](https://img.shields.io/github/license/thejacedev/react-native-charts-plus.svg)](https://github.com/thejacedev/react-native-charts-plus/blob/main/LICENSE)
[![platform](https://img.shields.io/badge/platform-ios%20%7C%20android-blue.svg)](https://github.com/thejacedev/react-native-charts-plus)
A beautiful, easy-to-use chart library for React Native applications.

Created by Jace Sleeman | Person98 LLC

## Installation

```bash
npm install react-native-charts-plus
# or
yarn add react-native-charts-plus
```

## Features

- 📊 Beautiful, customizable charts
- 🚀 Smooth animations
- 📱 Fully responsive
- 🔧 Highly customizable
- 📲 Touch interaction support
- 🎨 Customizable styles and colors
- 📝 Comprehensive TypeScript definitions

## Chart Types

- **Bar Chart**: Vertical bar charts for comparing values
- **Percentage Bar Chart**: Horizontal percentage bars for visualizing proportions
- **Pie Chart**: Circular charts with customizable slices and donut option
- **Ring Chart**: Multiple concentric rings showing progress or completion
- **Line Chart**: Line graphs with customizable curves and gradient fills
- **Radar Chart**: Spider/radar charts for multi-variable data visualization
- **Bubble Chart**: X-Y coordinate bubbles with size as third dimension
- **Gauge Chart**: Semi-circular gauge/dial for displaying a single value
- **Contribution Chart**: GitHub-style contribution grid for visualizing activity over time

## Components

### BarChart

A customizable bar chart component.

```jsx
import { BarChart } from 'react-native-charts-plus';

// Example usage
const MyBarChart = () => {
  const data = [
    { value: 50, label: 'Jan', color: '#FF5733' },
    { value: 80, label: 'Feb', color: '#33FF57' },
    { value: 65, label: 'Mar', color: '#3357FF' },
    { value: 100, label: 'Apr', color: '#F3FF33' },
    { value: 45, label: 'May', color: '#FF33F3' },
  ];

  return (
    <BarChart
      data={data}
      height={300}
      barWidth={40}
      spacing={20}
      showValues={true}
      showLabels={true}
      valueFormatter={(value) => `$${value}`}
      animated={true}
      animationDuration={1000}
      onBarPress={(item, index) => {
        console.log(`Bar ${index} pressed with value ${item.value}`);
      }}
    />
  );
};
```

### PercentageBarChart

A component that displays data as horizontal percentage bars, making it easy to visualize proportions.

```jsx
import { PercentageBarChart } from 'react-native-charts-plus';

// Example usage
const MyPercentageBarChart = () => {
  const data = [
    { value: 30, label: 'Category A', color: '#FF5733' },
    { value: 25, label: 'Category B', color: '#33FF57' },
    { value: 15, label: 'Category C', color: '#3357FF' },
    { value: 20, label: 'Category D', color: '#F3FF33' },
    { value: 10, label: 'Category E', color: '#FF33F3' },
  ];

  return (
    <PercentageBarChart
      data={data}
      showLabels={true}
      showValues={true}
      valueFormatter={(value) => `${value}%`}
      animated={true}
      animationDuration={1000}
      onSlicePress={(item, index) => {
        console.log(`Item ${index} pressed with value ${item.value}`);
      }}
    />
  );
};
```

### PieChart

A component that displays data as a circular pie chart with customizable slices.

```jsx
import { PieChart } from 'react-native-charts-plus';

// Example usage
const MyPieChart = () => {
  const data = [
    { value: 30, label: 'Category A', color: '#FF5733' },
    { value: 25, label: 'Category B', color: '#33FF57' },
    { value: 15, label: 'Category C', color: '#3357FF' },
    { value: 20, label: 'Category D', color: '#F3FF33' },
    { value: 10, label: 'Category E', color: '#FF33F3' },
  ];

  return (
    <PieChart
      data={data}
      radius={120}
      showLabels={true}
      showValues={true}
      valueFormatter={(value) => `${value}%`}
      animated={true}
      animationDuration={1000}
      donut={true}
      donutRadius={60}
      centerLabel="Total"
      showLegend={true}
      legendPosition="bottom"
      onSlicePress={(item, index) => {
        console.log(`Slice ${index} pressed with value ${item.value}`);
      }}
    />
  );
};
```

### RingChart

A component that displays data as concentric rings showing progress or completion.

```jsx
import { RingChart } from 'react-native-charts-plus';

// Example usage
const MyRingChart = () => {
  const data = [
    {
      value: 75,
      total: 100,
      label: 'Project A',
      fullColor: '#FF5733',
      emptyColor: '#FFD6CC',
    },
    {
      value: 45,
      total: 100,
      label: 'Project B',
      fullColor: '#33FF57',
      emptyColor: '#CCFFDB',
    },
    {
      value: 90,
      total: 100,
      label: 'Project C',
      fullColor: '#3357FF',
      emptyColor: '#CCD6FF',
    },
  ];

  return (
    <RingChart
      data={data}
      ringThickness={20}
      ringSpacing={10}
      showLabels={true}
      showValues={true}
      valueFormatter={(value, total) => `${value}/${total}`}
      animated={true}
      animationDuration={1000}
      showLegend={true}
      legendPosition="bottom"
      onRingPress={(item, index) => {
        console.log(
          `Ring ${index} pressed with value ${item.value}/${item.total}`
        );
      }}
    />
  );
};
```

### LineChart

A component that displays data as a line graph with customizable curves and gradient fills.

```jsx
import { LineChart } from 'react-native-charts-plus';

// Example usage
const MyLineChart = () => {
  const data = [
    { value: 50, label: 'Jan' },
    { value: 80, label: 'Feb' },
    { value: 65, label: 'Mar' },
    { value: 100, label: 'Apr' },
    { value: 45, label: 'May' },
  ];

  return (
    <LineChart
      data={data}
      height={300}
      showArea={true}
      areaOpacity={0.2}
      lineWidth={3}
      showDots={true}
      dotSize={6}
      showLabels={true}
      showValues={true}
      showGrid={true}
      curveType="natural"
      showGradient={true}
      gradientColors={['#FF5733', '#33FF57']}
      animated={true}
      animationDuration={1000}
      onPointPress={(item, index) => {
        console.log(`Point ${index} pressed with value ${item.value}`);
      }}
    />
  );
};
```

### RadarChart

A component that displays multi-variable data as a spider/radar chart.

```jsx
import { RadarChart } from 'react-native-charts-plus';

// Example usage
const MyRadarChart = () => {
  const data = [
    [
      { value: 80, label: 'Speed' },
      { value: 70, label: 'Power' },
      { value: 90, label: 'Range' },
      { value: 60, label: 'Agility' },
      { value: 75, label: 'Durability' },
    ],
    [
      { value: 70, label: 'Speed' },
      { value: 85, label: 'Power' },
      { value: 65, label: 'Range' },
      { value: 80, label: 'Agility' },
      { value: 90, label: 'Durability' },
    ],
  ];

  return (
    <RadarChart
      data={data}
      radius={150}
      showLabels={true}
      showValues={true}
      showAxis={true}
      showPolygons={true}
      showGrid={true}
      gridLevels={5}
      animated={true}
      animationDuration={1000}
      showLegend={true}
      legendPosition="bottom"
      onPointPress={(item, seriesIndex, pointIndex) => {
        console.log(
          `Point at series ${seriesIndex}, index ${pointIndex} pressed with value ${item.value}`
        );
      }}
    />
  );
};
```

### BubbleChart

A component that displays data as bubbles on an X-Y coordinate system, with the size of each bubble representing a third dimension of data.

```jsx
import { BubbleChart } from 'react-native-charts-plus';

// Example usage
const MyBubbleChart = () => {
  const data = [
    { x: 10, y: 20, size: 30, label: 'Item A', color: '#FF5733' },
    { x: 30, y: 40, size: 20, label: 'Item B', color: '#33FF57' },
    { x: 50, y: 30, size: 40, label: 'Item C', color: '#3357FF' },
    { x: 70, y: 50, size: 25, label: 'Item D', color: '#F3FF33' },
    { x: 90, y: 10, size: 35, label: 'Item E', color: '#FF33F3' },
  ];

  return (
    <BubbleChart
      data={data}
      width={350}
      height={300}
      showLabels={true}
      showValues={true}
      xAxisTitle="X Axis"
      yAxisTitle="Y Axis"
      valueFormatter={(x, y, size) => `(${x}, ${y}) - Size: ${size}`}
      showGrid={true}
      animated={true}
      animationDuration={1000}
      onBubblePress={(item, index) => {
        console.log(`Bubble ${index} pressed with values (${item.x}, ${item.y}, ${item.size})`);
      }}
    />
  );
};
```

### GaugeChart

A component that displays a single value on a semi-circular gauge, similar to a speedometer or dial.

```jsx
import { GaugeChart } from 'react-native-charts-plus';

// Example usage
const MyGaugeChart = () => {
  const data = {
    value: 75,
    minValue: 0,
    maxValue: 100,
    label: 'Progress',
    color: '#3357FF',
    backgroundColor: '#E0E0E0',
    valueColor: '#333333',
  };

  return (
    <GaugeChart
      data={data}
      width={300}
      height={200}
      radius={120}
      thickness={20}
      showLabels={true}
      showValues={true}
      showMinMax={true}
      valueFormatter={(value) => `${value}%`}
      animated={true}
      animationDuration={1000}
      needleColor="#FF5733"
      needleBaseColor="#333333"
      needleBaseSize={15}
      showSections={true}
      sections={[
        { value: 25, color: '#FF5733', label: 'Low' },
        { value: 50, color: '#F3FF33', label: 'Medium' },
        { value: 75, color: '#33FF57', label: 'Good' },
        { value: 100, color: '#3357FF', label: 'Excellent' },
      ]}
      showTicks={true}
      tickCount={5}
      centerLabel="75%"
      onPress={(item) => {
        console.log(`Gauge pressed with value ${item.value}`);
      }}
    />
  );
};
```

### ContributionChart

A component that displays a GitHub-style contribution grid, showing activity patterns over time.

```jsx
import { ContributionChart } from 'react-native-charts-plus';

// Example usage
const MyContributionChart = () => {
  // Generate sample data for the past year
  const generateSampleData = () => {
    const data = [];
    const today = new Date();
    const oneYearAgo = new Date(today);
    oneYearAgo.setFullYear(today.getFullYear() - 1);

    // Loop through each day in the past year
    for (let d = new Date(oneYearAgo); d <= today; d.setDate(d.getDate() + 1)) {
      // Generate a random value (0-15) with higher probability of lower values
      const rand = Math.random();
      let value = 0;

      if (rand > 0.6) value = Math.floor(Math.random() * 5) + 1; // 1-5 (40% chance)
      if (rand > 0.85) value = Math.floor(Math.random() * 5) + 5; // 5-10 (15% chance)
      if (rand > 0.95) value = Math.floor(Math.random() * 5) + 10; // 10-15 (5% chance)

      // Format the date as YYYY-MM-DD
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      const dateString = `${year}-${month}-${day}`;

      data.push({
        value,
        date: dateString,
      });
    }

    return data;
  };

  const data = generateSampleData();

  return (
    <ContributionChart
      data={data}
      height={200}
      cellSize={14}
      cellSpacing={2}
      cellBorderRadius={2}
      showLabels={true}
      showTooltip={true}
      tooltipFormatter={(value, date) => `${value} contributions on ${date}`}
      emptyColor="#ebedf0"
      colorScale={['#9be9a8', '#40c463', '#30a14e', '#216e39']}
      thresholds={[1, 5, 10]}
      animated={true}
      animationDuration={1500}
      showMonthLabels={true}
      showDayLabels={true}
      weeksToShow={52}
      onCellPress={(item, index) => {
        console.log(`Cell ${index} pressed with value ${item.value} on ${item.date}`);
      }}
    />
  );
};
```

## Props

Each chart component accepts a variety of props to customize its appearance and behavior. Please refer to the TypeScript definitions for a complete list of available props.

## Types

```typescript
interface DataPoint {
  value: number;
  label: string;
  color?: string;
  outlineColor?: string;
  outlineWidth?: number;
  labelBackgroundColor?: string;
}

interface RingDataPoint {
  value: number;
  total: number;
  label: string;
  fullColor?: string;
  emptyColor?: string;
}

interface LineChartDataPoint {
  value: number;
  label: string;
  color?: string;
  dotColor?: string;
  dotSize?: number;
  showDot?: boolean;
  customDotComponent?: React.ReactNode;
}

interface RadarChartDataPoint {
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

interface BubbleChartDataPoint {
  x: number;
  y: number;
  size: number;
  label: string;
  color?: string;
  borderColor?: string;
  borderWidth?: number;
}

interface GaugeChartDataPoint {
  value: number;
  minValue?: number;
  maxValue?: number;
  label: string;
  color?: string;
  backgroundColor?: string;
  valueColor?: string;
}

interface ContributionDataPoint {
  value: number;
  date: string;
  color?: string;
}

// Props interfaces are also available for each chart type:
// BarChartProps, PercentageBarChartProps, PieChartProps, RingChartProps,
// LineChartProps, RadarChartProps, BubbleChartProps, GaugeChartProps, ContributionChartProps
```

## License

MIT © 2025 Person98 LLC (Jace Sleeman)

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
