import { View, StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native';
import {
  RingChart,
  PieChart,
  LineChart,
  RadarChart,
  GaugeChart,
  BubbleChart,
  ContributionChart,
} from 'react-native-charts-plus';
import type {
  LineChartDataPoint,
  RadarChartDataPoint,
  BubbleChartDataPoint,
  ContributionDataPoint,
} from 'react-native-charts-plus';

export default function App() {
  // Ring chart data - Clean left labels
  const cleanLeftLabelsData = [
    {
      value: 90,
      total: 100,
      label: 'Design',
      fullColor: '#8E44AD',
      emptyColor: '#D2B4DE',
    },
    {
      value: 58,
      total: 100,
      label: 'Development',
      fullColor: '#2980B9',
      emptyColor: '#AED6F1',
    },
    {
      value: 90,
      total: 100,
      label: 'Testing',
      fullColor: '#16A085',
      emptyColor: '#A3E4D7',
    },
    {
      value: 89,
      total: 100,
      label: 'Deployment',
      fullColor: '#F39C12',
      emptyColor: '#FAD7A0',
    },
  ];

  // Pie chart data with modern gradient-like colors
  const pieChartData = [
    { value: 35, label: 'Mobile', color: '#FF6B6B' },
    { value: 25, label: 'Desktop', color: '#4ECDC4' },
    { value: 20, label: 'Tablet', color: '#45B7D1' },
    { value: 15, label: 'TV', color: '#96CEB4' },
    { value: 5, label: 'Others', color: '#FFEEAD' },
  ];

  // Line chart data with monthly performance metrics
  const lineChartData = [
    { value: 65, label: 'Jan', color: '#6C5CE7', dotColor: '#4834D4' },
    { value: 72, label: 'Feb', color: '#6C5CE7', dotColor: '#4834D4' },
    { value: 68, label: 'Mar', color: '#6C5CE7', dotColor: '#4834D4' },
    { value: 85, label: 'Apr', color: '#6C5CE7', dotColor: '#4834D4' },
    { value: 78, label: 'May', color: '#6C5CE7', dotColor: '#4834D4' },
    { value: 92, label: 'Jun', color: '#6C5CE7', dotColor: '#4834D4' },
  ];

  // Radar chart data - Performance comparison
  const radarChartData = [
    // Current Year
    [
      { value: 80, label: 'Sales', color: '#4C51BF', fillColor: '#4C51BF' },
      { value: 90, label: 'Marketing', color: '#4C51BF', fillColor: '#4C51BF' },
      {
        value: 70,
        label: 'Development',
        color: '#4C51BF',
        fillColor: '#4C51BF',
      },
      { value: 85, label: 'Support', color: '#4C51BF', fillColor: '#4C51BF' },
      { value: 75, label: 'Finance', color: '#4C51BF', fillColor: '#4C51BF' },
      { value: 65, label: 'Product', color: '#4C51BF', fillColor: '#4C51BF' },
    ],
    // Previous Year
    [
      { value: 65, label: 'Sales', color: '#ED8936', fillColor: '#ED8936' },
      { value: 75, label: 'Marketing', color: '#ED8936', fillColor: '#ED8936' },
      {
        value: 55,
        label: 'Development',
        color: '#ED8936',
        fillColor: '#ED8936',
      },
      { value: 70, label: 'Support', color: '#ED8936', fillColor: '#ED8936' },
      { value: 60, label: 'Finance', color: '#ED8936', fillColor: '#ED8936' },
      { value: 50, label: 'Product', color: '#ED8936', fillColor: '#ED8936' },
    ],
  ];

  // Gauge chart data - Performance metrics
  const gaugeChartData = {
    value: 72,
    minValue: 0,
    maxValue: 100,
    label: 'Performance',
    color: '#4C51BF',
    backgroundColor: '#E2E8F0',
    valueColor: '#2D3748',
  };

  const gaugeSections = [
    { value: 30, color: '#F56565', label: 'Low' },
    { value: 70, color: '#F6AD55', label: 'Medium' },
    { value: 100, color: '#68D391', label: 'High' },
  ];

  // SVG-specific styles (not compatible with StyleSheet)
  const svgStyles = {
    polygonStyle: {
      strokeWidth: 2,
      strokeOpacity: 1,
      fillOpacity: 0.3,
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
    backgroundStyle: {
      fill: '#F7FAFC',
      fillOpacity: 0.3,
    },
    dotStyle: {
      fill: '#FFFFFF',
      strokeWidth: 1.5,
    },
  };

  // Bubble chart data - Product comparison
  const bubbleChartData = [
    {
      x: 10,
      y: 30,
      size: 40,
      label: 'Product A',
      color: '#FF6384',
      borderColor: '#FF4365',
      borderWidth: 2,
    },
    {
      x: 25,
      y: 60,
      size: 25,
      label: 'Product B',
      color: '#36A2EB',
      borderColor: '#2187D1',
      borderWidth: 2,
    },
    {
      x: 40,
      y: 20,
      size: 35,
      label: 'Product C',
      color: '#FFCE56',
      borderColor: '#E6B73C',
      borderWidth: 2,
    },
    {
      x: 55,
      y: 45,
      size: 20,
      label: 'Product D',
      color: '#4BC0C0',
      borderColor: '#31A6A6',
      borderWidth: 2,
    },
    {
      x: 70,
      y: 75,
      size: 30,
      label: 'Product E',
      color: '#9966FF',
      borderColor: '#7F4CE5',
      borderWidth: 2,
    },
  ];

  // Generate sample data for the past year for the ContributionChart
  const generateContributionData = () => {
    const data: ContributionDataPoint[] = [];
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

  const contributionData = generateContributionData();

  // Generate a pattern-based contribution data for the custom chart
  const generatePatternContributionData = () => {
    const data: ContributionDataPoint[] = [];
    const today = new Date();
    const sixMonthsAgo = new Date(today);
    sixMonthsAgo.setMonth(today.getMonth() - 6);
    
    // Loop through each day in the past 6 months
    for (let d = new Date(sixMonthsAgo); d <= today; d.setDate(d.getDate() + 1)) {
      // Generate values based on patterns
      let value = 0;
      
      // Higher values on weekends
      const dayOfWeek = d.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        value = Math.floor(Math.random() * 10) + 5; // 5-15 on weekends
      } 
      // Medium values on Wednesdays
      else if (dayOfWeek === 3) {
        value = Math.floor(Math.random() * 7) + 2; // 2-9 on Wednesdays
      }
      // Lower values on other days
      else {
        // 70% chance of activity on other days
        if (Math.random() > 0.3) {
          value = Math.floor(Math.random() * 5) + 1; // 1-5 on other days
        }
      }
      
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

  const patternContributionData = generatePatternContributionData();

  return (
    <SafeAreaView style={styles.scrollView}>
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.title}>Clean Left Labels (No Backgrounds)</Text>
          <View style={styles.ringContainer}>
            <RingChart
              data={cleanLeftLabelsData}
              ringThickness={20}
              ringSpacing={5}
              showLabels={false}
              showValues={false}
              animated={true}
              animationDuration={1500}
              showLegend={true}
              legendPosition="left"
              showConnectingLines={false}
              legendStyle={styles.transparentLegend}
              legendItemStyle={styles.transparentLegendItem}
              legendLabelStyle={styles.legendLabel}
              onRingPress={(item, index) => {
                console.log(`Ring ${index} pressed with value ${item.value}`);
              }}
            />
          </View>

          <Text style={styles.title}>Device Usage Distribution</Text>
          <View style={styles.pieContainer}>
            <PieChart
              data={pieChartData}
              donut={true}
              donutRadius={80}
              radius={140}
              showLabels={true}
              showValues={true}
              animated={true}
              animationDuration={1200}
              valueFormatter={(value) => `${value}%`}
              outlineColor="#ffffff"
              outlineWidth={2}
              showLabelBackground={true}
              labelBackgroundColor="rgba(255,255,255,0.95)"
              labelBackgroundOpacity={0.95}
              labelBackgroundBorderRadius={6}
              labelStyle={styles.pieLabel}
              valueStyle={styles.pieValue}
              centerLabel="Device\nUsage"
              centerLabelStyle={styles.centerLabel}
              centerLabelBackgroundColor="#ffffff"
              centerLabelBorderRadius={40}
              showLegend={true}
              legendPosition="right"
              legendStyle={styles.transparentLegend}
              legendItemStyle={styles.pieLegendItem}
              legendLabelStyle={styles.pieLegendLabel}
              onSlicePress={(item, index) => {
                console.log(`Slice ${index} pressed with value ${item.value}`);
              }}
            />
          </View>

          <Text style={styles.title}>Monthly Performance Metrics</Text>
          <View style={styles.chartContainer}>
            <LineChart
              data={lineChartData}
              height={280}
              showArea={true}
              areaOpacity={0.15}
              lineWidth={3}
              showDots={true}
              dotSize={6}
              showLabels={true}
              showValues={true}
              showGrid={true}
              gridColor="#E0E0E0"
              gridOpacity={0.5}
              valueFormatter={(value: number) => `${value}%`}
              animated={true}
              animationDuration={1500}
              curveType="natural"
              showGradient={true}
              gradientColors={[
                'rgba(108, 92, 231, 0.8)',
                'rgba(108, 92, 231, 0)',
              ]}
              showYAxis={true}
              showXAxis={true}
              horizontalLines={5}
              verticalLines={6}
              yAxisLabelStyle={styles.yAxisLabel}
              xAxisLabelStyle={styles.xAxisLabel}
              labelStyle={styles.lineLabel}
              valueStyle={styles.lineValue}
              onPointPress={(item: LineChartDataPoint, index: number) => {
                console.log(`Point ${index} pressed with value ${item.value}`);
              }}
            />
          </View>

          <Text style={styles.title}>Performance Comparison</Text>
          <View style={styles.radarContainer}>
            <RadarChart
              data={radarChartData}
              height={400}
              width={400}
              showLabels={true}
              showValues={false}
              showAxis={true}
              showPolygons={true}
              showGrid={true}
              gridLevels={5}
              valueFormatter={(value: number) => `${value}%`}
              animated={true}
              animationDuration={1500}
              polygonStyle={svgStyles.polygonStyle}
              labelStyle={styles.radarLabel}
              axisStyle={svgStyles.axisStyle}
              gridStyle={svgStyles.gridStyle}
              backgroundStyle={svgStyles.backgroundStyle}
              dotStyle={svgStyles.dotStyle}
              onPointPress={(
                item: RadarChartDataPoint,
                seriesIndex: number,
                pointIndex: number
              ) => {
                console.log(
                  `Point ${pointIndex} in series ${seriesIndex} pressed with value ${item.value}`
                );
              }}
            />
          </View>

          <Text style={styles.title}>Performance Gauge</Text>
          <View style={styles.gaugeContainer}>
            <GaugeChart
              data={gaugeChartData}
              width={350}
              height={300}
              radius={120}
              startAngle={135}
              endAngle={405}
              showLabels={false}
              showValues={false}
              showMinMax={true}
              valueFormatter={(value) => `${value}%`}
              animated={true}
              animationDuration={1500}
              thickness={25}
              needleColor="#E53E3E"
              needleBaseColor="#718096"
              needleBaseSize={15}
              showSections={true}
              sections={gaugeSections}
              showTicks={true}
              tickCount={5}
              tickColor="#CBD5E0"
              tickSize={10}
              showTickLabels={true}
              centerLabel=""
              centerLabelStyle={styles.centerLabel}
              centerLabelBackgroundColor="#FFFFFF"
              centerLabelBorderRadius={20}
              onPress={(item) => {
                console.log(`Gauge pressed with value ${item.value}`);
              }}
            />
          </View>

          <Text style={styles.title}>Product Comparison</Text>
          <View style={styles.bubbleContainer}>
            <BubbleChart
              data={bubbleChartData}
              width={350}
              height={350}
              showLabels={true}
              showValues={false}
              xAxisTitle="Price ($)"
              yAxisTitle="Quality Score"
              valueFormatter={(x, y, size) =>
                `Price: $${x}, Quality: ${y}, Market: ${size}%`
              }
              animated={true}
              animationDuration={1500}
              showGrid={true}
              gridColor="#E0E0E0"
              gridOpacity={0.5}
              showXAxis={true}
              showYAxis={true}
              horizontalLines={5}
              verticalLines={5}
              xAxisRange={{ min: 0, max: 80 }}
              yAxisRange={{ min: 0, max: 100 }}
              sizeRange={{ min: 15, max: 50 }}
              onBubblePress={(item: BubbleChartDataPoint, index: number) => {
                console.log(
                  `Bubble ${index} pressed with values (${item.x}, ${item.y}, ${item.size})`
                );
              }}
            />
          </View>

          <Text style={styles.title}>GitHub-style Contribution Chart</Text>
          <View style={styles.contributionContainer}>
            <ContributionChart
              data={contributionData}
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
          </View>

          <Text style={styles.title}>Custom Contribution Chart (Purple Theme)</Text>
          <View style={styles.contributionContainer}>
            <ContributionChart
              data={patternContributionData}
              height={200}
              cellSize={12}
              cellSpacing={3}
              cellBorderRadius={6}
              showLabels={true}
              showTooltip={true}
              tooltipFormatter={(value, date) => `${value} activities on ${date}`}
              emptyColor="#f0ebfd"
              colorScale={['#d4bffc', '#b794f6', '#9061f9', '#6d28d9']}
              thresholds={[1, 5, 10]}
              animated={true}
              animationDuration={1800}
              showMonthLabels={true}
              showDayLabels={true}
              weeksToShow={26}
              onCellPress={(item, index) => {
                console.log(`Activity cell ${index} pressed with value ${item.value} on ${item.date}`);
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 20,
  },
  chartContainer: {
    height: 300,
    marginVertical: 20,
  },
  pieContainer: {
    height: 400,
    marginVertical: 20,
    paddingHorizontal: 20,
  },
  ringContainer: {
    height: 400,
    marginVertical: 20,
    paddingLeft: 100,
  },
  radarContainer: {
    height: 400,
    marginVertical: 20,
    alignItems: 'center',
  },
  gaugeContainer: {
    height: 350,
    marginVertical: 20,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 40,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2D3748',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 30,
    marginBottom: 10,
    textAlign: 'center',
    color: '#2D3748',
  },
  transparentLegend: {
    backgroundColor: 'transparent',
  },
  transparentLegendItem: {
    backgroundColor: 'transparent',
    marginBottom: 15,
  },
  legendLabel: {
    fontSize: 14,
    color: '#555555',
    fontWeight: '500',
  },
  pieLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4A5568',
  },
  pieValue: {
    fontSize: 12,
    fontWeight: '500',
    color: '#718096',
  },
  centerLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4A5568',
    textAlign: 'center',
  },
  pieLegendItem: {
    backgroundColor: 'transparent',
    marginBottom: 12,
  },
  pieLegendLabel: {
    fontSize: 13,
    color: '#4A5568',
    fontWeight: '500',
  },
  yAxisLabel: {
    fontSize: 12,
    color: '#718096',
  },
  xAxisLabel: {
    fontSize: 12,
    color: '#718096',
  },
  lineLabel: {
    fontSize: 12,
    color: '#4A5568',
    fontWeight: '500',
  },
  lineValue: {
    fontSize: 11,
    color: '#718096',
    fontWeight: '400',
  },
  radarLabel: {
    fontWeight: '500',
  },
  bubbleContainer: {
    height: 400,
    marginVertical: 20,
    alignItems: 'center',
  },
  contributionContainer: {
    height: 250,
    marginVertical: 20,
  },
});
