import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
  color?: 'blue' | 'cyan' | 'green' | 'purple' | 'orange';
}

interface QuickActionGridProps {
  actions: QuickAction[];
  columns?: 2 | 3;
}

const colorMap = {
  blue: ['#2563EB', '#1E40AF'] as const,
  cyan: ['#06B6D4', '#0891B2'] as const,
  green: ['#10B981', '#059669'] as const,
  purple: ['#9333EA', '#7E22CE'] as const,
  orange: ['#F97316', '#EA580C'] as const,
};

export function QuickActionGrid({ actions, columns = 3 }: QuickActionGridProps) {
  const colWidth = columns === 2 ? '48%' : '31%';

  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <Pressable
          key={action.id}
          style={[styles.actionItem, { width: colWidth }]}
          onPress={action.onPress}
        >
          <LinearGradient
            colors={colorMap[action.color || 'blue']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.actionButton}
          >
            <View style={styles.iconContainer}>
              {action.icon}
            </View>
            <Text style={styles.label}>{action.label}</Text>
          </LinearGradient>
        </Pressable>
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
  actionItem: {
    overflow: 'hidden',
  },
  actionButton: {
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 8,
    minHeight: 100,
    justifyContent: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 4,
  },
});