import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useTheme } from '@/hooks/use-theme';
import { useAppContext } from '@/contexts/AppContext';
import { ACTIVITY_TYPE_LABELS, type WorkoutActivity } from '@/constants/workout-activities';

type CalendarDay = {
  key: string;
  date: Date | null;
  iso: string | null;
  inCurrentMonth: boolean;
};

const WEEKDAY_LABELS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo'];

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function formatMonthTitle(date: Date) {
  return date.toLocaleDateString('nl-NL', {
    month: 'long',
    year: 'numeric',
  });
}

function buildCalendarDays(monthDate: Date): CalendarDay[] {
  const monthStart = startOfMonth(monthDate);
  const firstWeekday = (monthStart.getDay() + 6) % 7;
  const daysInMonth = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0).getDate();
  const daysInPrevMonth = new Date(monthDate.getFullYear(), monthDate.getMonth(), 0).getDate();
  const result: CalendarDay[] = [];

  for (let index = 0; index < 42; index += 1) {
    const dayOffset = index - firstWeekday + 1;
    let cellDate: Date;
    let inCurrentMonth = true;

    if (dayOffset <= 0) {
      cellDate = new Date(monthDate.getFullYear(), monthDate.getMonth() - 1, daysInPrevMonth + dayOffset);
      inCurrentMonth = false;
    } else if (dayOffset > daysInMonth) {
      cellDate = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, dayOffset - daysInMonth);
      inCurrentMonth = false;
    } else {
      cellDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), dayOffset);
    }

    result.push({
      key: `${index}-${toIsoDate(cellDate)}`,
      date: cellDate,
      iso: toIsoDate(cellDate),
      inCurrentMonth,
    });
  }

  return result;
}

export default function WorkoutCalendarScreen() {
  const router = useRouter();
  const theme = useTheme();
  const today = new Date();
  const todayIso = toIsoDate(today);
  const { workoutActivities, isAppHydrated } = useAppContext();
  const [visibleMonth, setVisibleMonth] = useState(startOfMonth(today));
  const [selectedIso, setSelectedIso] = useState(todayIso);

  const activitiesByDay = useMemo(() => {
    return workoutActivities.reduce<Record<string, WorkoutActivity[]>>((accumulator, activity) => {
      const iso = activity.dateIso.slice(0, 10);
      const current = accumulator[iso] ?? [];
      current.push(activity);
      accumulator[iso] = current;
      return accumulator;
    }, {});
  }, [workoutActivities]);

  const calendarDays = useMemo(() => buildCalendarDays(visibleMonth), [visibleMonth]);
  const selectedActivities = activitiesByDay[selectedIso] ?? [];

  return (
    <View style={[styles.screen, { backgroundColor: theme.background }]}> 
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.topRow}>
          <Pressable
            style={[styles.backButton, { backgroundColor: theme.card, borderColor: theme.border }]}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons name="chevron-left" size={20} color={theme.titleColor} />
            <Text style={[styles.backLabel, { color: theme.titleColor }]}>Terug</Text>
          </Pressable>
        </View>

        <Text style={[styles.title, { color: theme.titleColor }]}>Kalender.</Text>
        <Text style={[styles.subtitle, { color: theme.subtitleColor }]}>Je volledige maandplanning en trainingen.</Text>

        <View style={[styles.calendarCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <View style={styles.calendarHeader}>
            <Pressable style={styles.monthSwitch} onPress={() => setVisibleMonth((current) => addMonths(current, -1))}>
              <MaterialCommunityIcons name="chevron-left" size={22} color={theme.titleColor} />
            </Pressable>
            <Text style={[styles.monthTitle, { color: theme.titleColor }]}>{formatMonthTitle(visibleMonth)}</Text>
            <Pressable style={styles.monthSwitch} onPress={() => setVisibleMonth((current) => addMonths(current, 1))}>
              <MaterialCommunityIcons name="chevron-right" size={22} color={theme.titleColor} />
            </Pressable>
          </View>

          <View style={styles.weekdayRow}>
            {WEEKDAY_LABELS.map((label) => (
              <Text key={label} style={[styles.weekdayLabel, { color: theme.subtitleColor }]}>{label}</Text>
            ))}
          </View>

          <View style={styles.grid}>
            {calendarDays.map((day) => {
              const isSelected = day.iso === selectedIso;
              const isToday = day.iso === todayIso;
              const activityCount = day.iso ? (activitiesByDay[day.iso]?.length ?? 0) : 0;

              return (
                <Pressable
                  key={day.key}
                  style={[
                    styles.dayCell,
                    { borderColor: theme.border, backgroundColor: theme.background },
                    isSelected ? styles.dayCellSelected : null,
                    isToday ? styles.dayCellToday : null,
                  ]}
                  onPress={() => {
                    if (day.iso) setSelectedIso(day.iso);
                  }}
                >
                  <Text
                    style={[
                      styles.dayNumber,
                      { color: day.inCurrentMonth ? theme.titleColor : theme.subtitleColor },
                      isSelected ? styles.dayNumberSelected : null,
                    ]}
                  >
                    {day.date?.getDate()}
                  </Text>
                  {activityCount > 0 ? (
                    <View style={styles.dayMarkersRow}>
                      {Array.from({ length: Math.min(activityCount, 3) }).map((_, index) => (
                        <View key={`${day.key}-marker-${index}`} style={styles.dayMarker} />
                      ))}
                    </View>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        </View>

        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#2563EB' }]} />
            <Text style={[styles.legendLabel, { color: theme.subtitleColor }]}>Geselecteerde dag</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#0F172A' }]} />
            <Text style={[styles.legendLabel, { color: theme.subtitleColor }]}>Training gepland</Text>
          </View>
        </View>

        <View style={[styles.scheduleCard, { backgroundColor: theme.card, borderColor: theme.border }]}> 
          <View style={styles.scheduleHeaderRow}>
            <Text style={[styles.scheduleTitle, { color: theme.titleColor }]}>Planning voor {selectedIso}</Text>
            <Pressable
              style={styles.scheduleAddButton}
              onPress={() => router.push('/workouts/add')}
            >
              <MaterialCommunityIcons name="plus" size={18} color="#2563EB" />
            </Pressable>
          </View>

          {!isAppHydrated ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="progress-clock" size={28} color={theme.subtitleColor} />
              <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>Trainingen laden...</Text>
            </View>
          ) : selectedActivities.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialCommunityIcons name="calendar-blank-outline" size={28} color={theme.subtitleColor} />
              <Text style={[styles.emptyStateText, { color: theme.subtitleColor }]}>Geen trainingen op deze dag.</Text>
            </View>
          ) : (
            selectedActivities.map((activity) => (
              <Pressable
                key={activity.id}
                onPress={() => router.push(`/workouts/${activity.id}` as any)}
                style={[styles.activityRow, { borderColor: theme.border }]}
              >
                <View style={[styles.activityIconWrap, { backgroundColor: `${activity.accentColor}18` }]}>
                  <MaterialCommunityIcons name={activity.icon as any} size={18} color={activity.accentColor} />
                </View>
                <View style={styles.activityTextWrap}>
                  <Text style={[styles.activityType, { color: activity.accentColor }]}>{ACTIVITY_TYPE_LABELS[activity.type]}</Text>
                  <Text style={[styles.activityTitle, { color: theme.titleColor }]}>{activity.title}</Text>
                  <Text style={[styles.activityMeta, { color: theme.subtitleColor }]}>{activity.date}</Text>
                </View>
                <MaterialCommunityIcons name="chevron-right" size={20} color={theme.subtitleColor} />
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 96,
  },
  topRow: {
    marginBottom: 16,
  },
  backButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  backLabel: {
    fontSize: 14,
    fontWeight: '700',
  },
  title: {
    fontSize: 54,
    lineHeight: 58,
    fontWeight: '900',
    letterSpacing: -1.8,
  },
  subtitle: {
    marginTop: 4,
    marginBottom: 14,
    fontSize: 14,
    fontWeight: '600',
  },
  calendarCard: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 14,
  },
  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  monthSwitch: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  monthTitle: {
    fontSize: 20,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  weekdayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  weekdayLabel: {
    width: '14.2%',
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  dayCell: {
    width: '13.2%',
    aspectRatio: 0.84,
    borderWidth: 1,
    borderRadius: 12,
    paddingTop: 8,
    alignItems: 'center',
  },
  dayCellSelected: {
    backgroundColor: '#DBEAFE',
    borderColor: '#2563EB',
  },
  dayCellToday: {
    borderColor: '#0F172A',
  },
  dayNumber: {
    fontSize: 13,
    fontWeight: '700',
  },
  dayNumberSelected: {
    color: '#1D4ED8',
  },
  dayMarkersRow: {
    position: 'absolute',
    bottom: 8,
    flexDirection: 'row',
    gap: 3,
  },
  dayMarker: {
    width: 5,
    height: 5,
    borderRadius: 999,
    backgroundColor: '#0F172A',
  },
  legendRow: {
    marginTop: 12,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 14,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 999,
  },
  legendLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  scheduleCard: {
    borderWidth: 1,
    borderRadius: 18,
    padding: 14,
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  scheduleHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  scheduleAddButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#DBEAFE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    minHeight: 100,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontWeight: '600',
  },
  activityRow: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10,
  },
  activityIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityTextWrap: {
    flex: 1,
  },
  activityType: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  activityTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  activityMeta: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: '500',
  },
});