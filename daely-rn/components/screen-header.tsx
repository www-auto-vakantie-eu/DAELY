import { View, Text, StyleSheet, Pressable } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  action?: {
    label: string;
    onPress: () => void;
    icon?: React.ReactNode;
  };
  gradient?: boolean;
}

export function ScreenHeader({
  title,
  subtitle,
  action,
  gradient = true
}: ScreenHeaderProps) {
  const content = (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: gradient ? '#FFFFFF' : '#2563EB' }]}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: gradient ? 'rgba(255,255,255,0.8)' : '#64748B' }]}>
            {subtitle}
          </Text>
        )}
      </View>
      {action && (
        <Pressable style={styles.actionButton} onPress={action.onPress}>
          {action.icon && action.icon}
          <Text style={[styles.actionText, { color: gradient ? '#FFFFFF' : '#2563EB' }]}>
            {action.label}
          </Text>
        </Pressable>
      )}
    </View>
  );

  if (gradient) {
    return (
      <LinearGradient
        colors={['#2563EB', '#1E40AF']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {content}
      </LinearGradient>
    );
  }

  return <View style={styles.simpleHeader}>{content}</View>;
}

const styles = StyleSheet.create({
  gradient: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  simpleHeader: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
});