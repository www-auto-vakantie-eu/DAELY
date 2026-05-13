import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useThemeColor } from '@/hooks/use-theme-color';
import { LinearGradient } from 'expo-linear-gradient';

interface DashboardCardProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  value?: string;
  valueLabel?: string;
  onPress?: () => void;
  gradient?: boolean;
  colorScheme?: 'primary' | 'secondary' | 'accent' | 'success';
}

export function DashboardCard({
  title,
  subtitle,
  icon,
  value,
  valueLabel,
  onPress,
  gradient = true,
  colorScheme = 'primary'
}: DashboardCardProps) {
  const colorSchemeMap = {
    primary: ['#2563EB', '#1E40AF'] as const,
    secondary: ['#1E40AF', '#1E3A8A'] as const,
    accent: ['#0EA5E9', '#0284C7'] as const,
    success: ['#10B981', '#059669'] as const,
  };

  const colors = useThemeColor({}, 'text');
  const bgColor = useThemeColor({}, 'background');

  const content = (
    <View style={[styles.card, { backgroundColor: gradient ? 'transparent' : bgColor }]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      
      <View style={styles.content}>
        <Text style={[styles.title, { color: gradient ? '#FFFFFF' : colors }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: gradient ? 'rgba(255,255,255,0.8)' : '#94A3B8' }]}>
            {subtitle}
          </Text>
        )}
        {value && (
          <View style={styles.valueContainer}>
            <Text style={[styles.value, { color: gradient ? '#FFFFFF' : '#2563EB' }]}>
              {value}
            </Text>
            {valueLabel && (
              <Text style={[styles.valueLabel, { color: gradient ? 'rgba(255,255,255,0.7)' : '#64748B' }]}>
                {valueLabel}
              </Text>
            )}
          </View>
        )}
      </View>
    </View>
  );

  if (gradient) {
    return (
      <Pressable onPress={onPress} style={styles.pressable}>
        <LinearGradient
          colors={colorSchemeMap[colorScheme]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {content}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={styles.pressable}>
      {content}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    marginBottom: 12,
  },
  gradient: {
    borderRadius: 16,
    padding: 16,
    overflow: 'hidden',
  },
  card: {
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 13,
  },
  valueContainer: {
    marginTop: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: '700',
  },
  valueLabel: {
    fontSize: 12,
    marginTop: 2,
  },
});