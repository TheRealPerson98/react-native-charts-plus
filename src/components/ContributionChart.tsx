import { useEffect, useRef, useState } from 'react';
import type { FC } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Dimensions,
  ScrollView,
} from 'react-native';
import type { ContributionChartProps, ContributionDataPoint } from '../types';

const DEFAULT_WIDTH = Dimensions.get('window').width - 40;
const DEFAULT_HEIGHT = 200;
const DEFAULT_CELL_SIZE = 14;
const DEFAULT_CELL_SPACING = 2;
const DEFAULT_ANIMATION_DURATION = 800;
const DEFAULT_WEEKS_TO_SHOW = 52; // One year by default
const DEFAULT_EMPTY_COLOR = '#ebedf0';
const DEFAULT_COLOR_SCALE = ['#9be9a8', '#40c463', '#30a14e', '#216e39'];
const DEFAULT_THRESHOLDS = [1, 5, 10]; // 0, 1-4, 5-9, 10+

const DAYS_OF_WEEK = ['', 'Mon', 'Wed', 'Fri'];
const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const ContributionChart: FC<ContributionChartProps> = ({
  data,
  width = DEFAULT_WIDTH,
  height = DEFAULT_HEIGHT,
  cellSize = DEFAULT_CELL_SIZE,
  cellSpacing = DEFAULT_CELL_SPACING,
  cellBorderRadius = 2,
  showLabels = true,
  showTooltip = true,
  tooltipFormatter = (value, date) => `${value} contributions on ${date}`,
  style,
  labelStyle,
  tooltipStyle,
  emptyColor = DEFAULT_EMPTY_COLOR,
  colorScale = DEFAULT_COLOR_SCALE,
  thresholds = DEFAULT_THRESHOLDS,
  animated = true,
  animationDuration = DEFAULT_ANIMATION_DURATION,
  onCellPress,
  monthLabelStyle,
  dayLabelStyle,
  showMonthLabels = true,
  showDayLabels = true,
  weeksToShow = DEFAULT_WEEKS_TO_SHOW,
}) => {
  const [selectedCell, setSelectedCell] =
    useState<ContributionDataPoint | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Create animated values for each cell
  const animatedValues = useRef<Animated.Value[]>(
    data.map(() => new Animated.Value(0))
  ).current;

  useEffect(() => {
    if (animated) {
      // Animate all cells with a staggered effect
      const animations = animatedValues.map((animatedValue, index) =>
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: animationDuration,
          delay: index * (animationDuration / data.length / 10), // Staggered effect
          useNativeDriver: false,
        })
      );
      Animated.stagger(10, animations).start();
    } else {
      // Set all cells to full opacity immediately
      animatedValues.forEach((animatedValue) => {
        animatedValue.setValue(1);
      });
    }
  }, [animated, animatedValues, animationDuration, data]);

  // Organize data by week and day
  const organizedData = organizeDataByWeekAndDay(data, weeksToShow);

  // Get color for a specific value
  const getColorForValue = (value: number): string => {
    if (value === 0) return emptyColor;

    const safeThresholds = thresholds || DEFAULT_THRESHOLDS;

    for (let i = 0; i < safeThresholds.length; i++) {
      if (value < safeThresholds[i]!) {
        return colorScale[i] || emptyColor;
      }
    }

    return colorScale[colorScale.length - 1] || emptyColor;
  };

  // Handle cell press
  const handleCellPress = (
    item: ContributionDataPoint,
    index: number,
    x: number,
    y: number
  ) => {
    setSelectedCell(item);
    setTooltipPosition({ x, y: y - 40 }); // Position tooltip above the cell

    if (onCellPress) {
      onCellPress(item, index);
    }
  };

  // Get month labels
  const monthLabels = getMonthLabels(organizedData);

  return (
    <View style={[styles.container, { width, height }, style]}>
      {showDayLabels && (
        <View style={styles.dayLabelsContainer}>
          {DAYS_OF_WEEK.map((day, index) => (
            <Text key={index} style={[styles.dayLabel, dayLabelStyle]}>
              {day}
            </Text>
          ))}
        </View>
      )}

      <View style={styles.chartContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View>
            {showMonthLabels && (
              <View style={styles.monthLabelsContainer}>
                {monthLabels.map((month, index) => (
                  <Text
                    key={index}
                    style={[
                      styles.monthLabel,
                      { left: month.position },
                      monthLabelStyle,
                    ]}
                  >
                    {month.label}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.gridContainer}>
              {organizedData.map((week, weekIndex) => (
                <View key={weekIndex} style={styles.weekContainer}>
                  {week.map((day, dayIndex) => {
                    const dataIndex = weekIndex * 7 + dayIndex;
                    const isValidData = day && day.value !== undefined;

                    // Create cell style
                    const cellStyle = {
                      ...styles.cell,
                      width: cellSize,
                      height: cellSize,
                      margin: cellSpacing / 2,
                      borderRadius: cellBorderRadius,
                      backgroundColor: isValidData
                        ? getColorForValue(day.value)
                        : 'transparent',
                    };

                    // Create animation style
                    const animationStyle = {
                      opacity: isValidData ? animatedValues[dataIndex] : 0,
                    };

                    return (
                      <TouchableOpacity
                        key={dayIndex}
                        activeOpacity={isValidData ? 0.7 : 1}
                        disabled={!isValidData}
                        onPress={() => {
                          if (isValidData) {
                            handleCellPress(
                              day,
                              dataIndex,
                              weekIndex * (cellSize + cellSpacing),
                              dayIndex * (cellSize + cellSpacing)
                            );
                          }
                        }}
                      >
                        <Animated.View style={[cellStyle, animationStyle]} />
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>

      {showTooltip && selectedCell && (
        <View
          style={[
            styles.tooltip,
            {
              left: tooltipPosition.x,
              top: tooltipPosition.y,
            },
            tooltipStyle,
          ]}
        >
          <Text style={styles.tooltipText}>
            {tooltipFormatter(selectedCell.value, selectedCell.date)}
          </Text>
        </View>
      )}

      {showLabels && (
        <View style={styles.legendContainer}>
          <Text style={[styles.legendLabel, labelStyle]}>Less</Text>
          {[emptyColor, ...colorScale].map((color, index) => (
            <View
              key={index}
              style={[
                styles.legendItem,
                {
                  backgroundColor: color,
                  width: cellSize,
                  height: cellSize,
                  borderRadius: cellBorderRadius,
                },
              ]}
            />
          ))}
          <Text style={[styles.legendLabel, labelStyle]}>More</Text>
        </View>
      )}
    </View>
  );
};

// Helper function to organize data by week and day
const organizeDataByWeekAndDay = (
  data: ContributionDataPoint[],
  weeksToShow: number
): (ContributionDataPoint | null)[][] => {
  // Create a map of date to data point for quick lookup
  const dateMap = new Map<string, ContributionDataPoint>();
  data.forEach((item) => {
    dateMap.set(item.date, item);
  });

  // Get the current date
  const today = new Date();

  // Calculate the start date (weeksToShow weeks ago)
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - weeksToShow * 7);

  // Initialize the organized data structure
  const organizedData: (ContributionDataPoint | null)[][] = [];

  // Fill the data structure with null or actual data points
  let currentDate = new Date(startDate);

  // Adjust to start from the beginning of the week (Sunday)
  const dayOfWeek = currentDate.getDay();
  currentDate.setDate(currentDate.getDate() - dayOfWeek);

  // Create weeks
  for (let week = 0; week < weeksToShow; week++) {
    const weekData: (ContributionDataPoint | null)[] = [];

    // Create days in the week
    for (let day = 0; day < 7; day++) {
      const dateString = formatDate(currentDate);
      const dataPoint = dateMap.get(dateString) || null;

      // Only include dates up to today
      if (currentDate <= today) {
        weekData.push(dataPoint || { value: 0, date: dateString });
      } else {
        weekData.push(null);
      }

      // Move to the next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    organizedData.push(weekData);
  }

  return organizedData;
};

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper function to get month labels with their positions
const getMonthLabels = (
  organizedData: (ContributionDataPoint | null)[][]
): { label: string; position: number }[] => {
  const monthLabels: { label: string; position: number }[] = [];
  const cellWidth = DEFAULT_CELL_SIZE + DEFAULT_CELL_SPACING;

  // Check each week for month changes
  let currentMonth = -1;

  organizedData.forEach((week, weekIndex) => {
    if (week[0]) {
      const date = new Date(week[0].date);
      const month = date.getMonth();

      if (month !== currentMonth) {
        currentMonth = month;
        monthLabels.push({
          label: MONTHS[month] || '',
          position: weekIndex * cellWidth,
        });
      }
    }
  });

  return monthLabels;
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  chartContainer: {
    flexDirection: 'row',
  },
  gridContainer: {
    flexDirection: 'row',
  },
  weekContainer: {
    flexDirection: 'column',
  },
  cell: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  dayLabelsContainer: {
    flexDirection: 'column',
    marginRight: 4,
    marginTop: 20, // Space for month labels
    height: 7 * (DEFAULT_CELL_SIZE + DEFAULT_CELL_SPACING),
    justifyContent: 'space-between',
  },
  dayLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'right',
    width: 30,
  },
  monthLabelsContainer: {
    height: 20,
    flexDirection: 'row',
    position: 'relative',
  },
  monthLabel: {
    fontSize: 10,
    color: '#666',
    position: 'absolute',
  },
  tooltip: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 8,
    borderRadius: 4,
    zIndex: 1000,
  },
  tooltipText: {
    color: 'white',
    fontSize: 12,
  },
  legendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    marginHorizontal: 2,
  },
  legendLabel: {
    fontSize: 10,
    color: '#666',
    marginHorizontal: 4,
  },
});
