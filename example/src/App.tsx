import { View, StyleSheet, ScrollView, Text, SafeAreaView } from 'react-native';
import { RingChart, PieChart, LineChart, RadarChart } from 'react-native-charts-plus';
import type { LineChartDataPoint, RadarChartDataPoint } from 'react-native-charts-plus';

export default function App() {

  // Ring chart data - Clean left labels
  const cleanLeftLabelsData = [
    { value: 90, total: 100, label: 'Design', fullColor: '#8E44AD', emptyColor: '#D2B4DE' },
    { value: 58, total: 100, label: 'Development', fullColor: '#2980B9', emptyColor: '#AED6F1' },
    { value: 90, total: 100, label: 'Testing', fullColor: '#16A085', emptyColor: '#A3E4D7' },
    { value: 89, total: 100, label: 'Deployment', fullColor: '#F39C12', emptyColor: '#FAD7A0' },
  ];

  // Pie chart data with modern gradient-like colors
  const pieChartData = [
    { value: 35, label: 'Mobile', color: '#FF6B6B' },
    { value: 25, label: 'Desktop', color: '#4ECDC4' },
    { value: 20, label: 'Tablet', color: '#45B7D1' },
    { value: 15, label: 'TV', color: '#96CEB4' },
    { value: 5, label: 'Others', color: '#FFEEAD' }
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
      { value: 70, label: 'Development', color: '#4C51BF', fillColor: '#4C51BF' },
      { value: 85, label: 'Support', color: '#4C51BF', fillColor: '#4C51BF' },
      { value: 75, label: 'Finance', color: '#4C51BF', fillColor: '#4C51BF' },
      { value: 65, label: 'Product', color: '#4C51BF', fillColor: '#4C51BF' },
    ],
    // Previous Year
    [
      { value: 65, label: 'Sales', color: '#ED8936', fillColor: '#ED8936' },
      { value: 75, label: 'Marketing', color: '#ED8936', fillColor: '#ED8936' },
      { value: 55, label: 'Development', color: '#ED8936', fillColor: '#ED8936' },
      { value: 70, label: 'Support', color: '#ED8936', fillColor: '#ED8936' },
      { value: 60, label: 'Finance', color: '#ED8936', fillColor: '#ED8936' },
      { value: 50, label: 'Product', color: '#ED8936', fillColor: '#ED8936' },
    ]
  ];

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
              legendStyle={{
                backgroundColor: 'transparent'
              }}
              legendItemStyle={{
                backgroundColor: 'transparent',
                marginBottom: 15
              }}
              legendLabelStyle={{
                fontSize: 14,
                color: '#555555',
                fontWeight: '500'
              }}
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
              labelStyle={{
                fontSize: 14,
                fontWeight: '600',
                color: '#4A5568'
              }}
              valueStyle={{
                fontSize: 12,
                fontWeight: '500',
                color: '#718096'
              }}
              centerLabel="Device\nUsage"
              centerLabelStyle={{
                fontSize: 18,
                fontWeight: 'bold',
                color: '#4A5568',
                textAlign: 'center'
              }}
              centerLabelBackgroundColor="#ffffff"
              centerLabelBorderRadius={40}
              showLegend={true}
              legendPosition="right"
              legendStyle={{
                backgroundColor: 'transparent'
              }}
              legendItemStyle={{
                backgroundColor: 'transparent',
                marginBottom: 12
              }}
              legendLabelStyle={{
                fontSize: 13,
                color: '#4A5568',
                fontWeight: '500'
              }}
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
              gradientColors={['rgba(108, 92, 231, 0.8)', 'rgba(108, 92, 231, 0)']}
              showYAxis={true}
              showXAxis={true}
              horizontalLines={5}
              verticalLines={6}
              yAxisLabelStyle={{
                fontSize: 12,
                color: '#718096',
              }}
              xAxisLabelStyle={{
                fontSize: 12,
                color: '#718096',
              }}
              labelStyle={{
                fontSize: 12,
                color: '#4A5568',
                fontWeight: '500'
              }}
              valueStyle={{
                fontSize: 11,
                color: '#718096',
                fontWeight: '400'
              }}
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
              polygonStyle={{
                strokeWidth: 2,
                strokeOpacity: 1,
                fillOpacity: 0.3,
              }}
              labelStyle={{
                fontWeight: '500',
              }}
              axisStyle={{
                stroke: '#CBD5E0',
                strokeWidth: 1,
                strokeOpacity: 0.7,
              }}
              gridStyle={{
                stroke: '#E2E8F0',
                strokeWidth: 1,
                strokeOpacity: 0.5,
                strokeDasharray: '4,4',
              }}
              backgroundStyle={{
                fill: '#F7FAFC',
                fillOpacity: 0.3,
              }}
              dotStyle={{
                fill: '#FFFFFF',
                strokeWidth: 1.5,
              }}
              onPointPress={(item: RadarChartDataPoint, seriesIndex: number, pointIndex: number) => {
                console.log(`Point ${pointIndex} in series ${seriesIndex} pressed with value ${item.value}`);
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
});
