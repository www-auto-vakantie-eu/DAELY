import { View, Text, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';

interface StatItem {
  label: string;
  value: string;
  unit?: string;
  color?: string;
}

interface StatsGridProps {
  stats: StatItem[];
  columns?: 2 | 3;
}

export function StatsGrid({ stats, columns = 3 }: StatsGridProps) {
  const bgColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E2E8F0', dark: '#334155' }, 'border');

  const colWidth = columns === 2 ? '48%' : '31%';

  return (
    <View style={[styles.container]}>
      {stats.map((stat, index) => (
        <View
          key={index}
          style={[
            styles.statCard,
            { 
              width: colWidth,
              backgroundColor: bgColor,
              borderColor,
            }
          ]}
        >
          <Text style={[styles.label, { color: '#94A3B8' }]}>
            {stat.label}
          </Text>
          <View style={styles.valueRow}>
            <Text style={[styles.value, { color: stat.color || '#2563EB' }]}>
              {stat.value}
            </Text>
            {stat.unit && (
              <Text style={[styles.unit, { color: textColor }]}>
                {stat.unit}
              </Text>
            )}
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  statCard: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '700',
  },
  unit: {
    fontSize: 11,
    fontWeight: '500',
  },
});