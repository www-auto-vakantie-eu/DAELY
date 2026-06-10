import AsyncStorage from '@react-native-async-storage/async-storage';

const MESSAGES_THREADS_KEY = 'daely.messages.threads.v1';

export type MessageThreadType = 'support' | 'coach' | 'community' | 'forwarded' | 'group';

export type LinkedItemType = 'workout' | 'program' | 'recipe' | 'post' | 'activity' | null;

export type GroupType = 'community' | 'coach' | 'challenge' | 'support' | 'discipline';

export type OwnerType = 'daely' | 'coach' | 'community' | 'user';

export interface Message {
  id: string;
  senderType: 'user' | 'coach' | 'support' | 'system' | 'community';
  senderName: string;
  text: string;
  createdAt: string;
}

export interface MessageThread {
  id: string;
  type: MessageThreadType;
  title: string;
  participantName: string;
  participantRole?: string;
  lastMessage: string;
  updatedAt: string;
  unreadCount?: number;
  linkedItemType?: LinkedItemType;
  linkedItemId?: string;
  linkedItemTitle?: string;
  messages: Message[];
  // Group fields
  isGroup?: boolean;
  groupType?: GroupType;
  memberCount?: number;
  joined?: boolean;
  groupDescription?: string;
  disciplineSlug?: string;
  ownerType?: OwnerType;
}

// Mock data for MVP
const MOCK_THREADS: MessageThread[] = [
  {
    id: '1',
    type: 'support',
    title: 'DAELY Support',
    participantName: 'DAELY Support',
    participantRole: 'Support Team',
    lastMessage: 'Hoe kan ik je helpen?',
    updatedAt: new Date().toISOString(),
    unreadCount: 1,
    messages: [
      {
        id: '1-1',
        senderType: 'system',
        senderName: 'DAELY',
        text: 'Welkom bij DAELY Support. Hoe kunnen we je helpen?',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: '1-2',
        senderType: 'support',
        senderName: 'DAELY Support',
        text: 'Hoe kan ik je helpen?',
        createdAt: new Date().toISOString(),
      },
    ],
  },
  {
    id: '2',
    type: 'coach',
    title: 'Coach Mark',
    participantName: 'Coach Mark',
    participantRole: 'Personal Coach',
    lastMessage: 'Geweldige workout gisteren!',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 2,
    messages: [
      {
        id: '2-1',
        senderType: 'coach',
        senderName: 'Coach Mark',
        text: 'Geweldige workout gisteren!',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  },
  {
    id: '3',
    type: 'community',
    title: 'Sarah',
    participantName: 'Sarah',
    participantRole: 'Sporter',
    lastMessage: 'Bedankt voor het delen!',
    updatedAt: new Date(Date.now() - 172800000).toISOString(),
    messages: [
      {
        id: '3-1',
        senderType: 'user',
        senderName: 'Ik',
        text: 'Hee, heb je mijn workout gezien?',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
      {
        id: '3-2',
        senderType: 'community',
        senderName: 'Sarah',
        text: 'Bedankt voor het delen!',
        createdAt: new Date(Date.now() - 172800000).toISOString(),
      },
    ],
  },
  {
    id: '4',
    type: 'forwarded',
    title: 'Workout gedeeld',
    participantName: 'John',
    participantRole: 'Sporter',
    lastMessage: 'Heb deze workout voor je gedeeld',
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    linkedItemType: 'workout',
    linkedItemId: 'workout-123',
    linkedItemTitle: 'Full Body Workout',
    messages: [
      {
        id: '4-1',
        senderType: 'community',
        senderName: 'John',
        text: 'Heb deze workout voor je gedeeld',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
      },
    ],
  },
  // Mock groups
  {
    id: 'group-1',
    type: 'group',
    title: 'Hardlopen Community',
    participantName: 'Hardlopen Community',
    participantRole: '247 leden',
    lastMessage: 'Lisa: Wie doet er mee aan de loop van zaterdag?',
    updatedAt: new Date(Date.now() - 3600000).toISOString(),
    unreadCount: 3,
    isGroup: true,
    groupType: 'community',
    memberCount: 247,
    joined: true,
    groupDescription: 'Groep voor hardlopers van alle niveaus. Deel je routes, tips en motivatie.',
    ownerType: 'daely',
    messages: [
      {
        id: 'group-1-1',
        senderType: 'community',
        senderName: 'Lisa',
        text: 'Wie doet er mee aan de loop van zaterdag?',
        createdAt: new Date(Date.now() - 3600000).toISOString(),
      },
      {
        id: 'group-1-2',
        senderType: 'community',
        senderName: 'Mark',
        text: 'Ik doe mee! Waar starten we?',
        createdAt: new Date(Date.now() - 1800000).toISOString(),
      },
      {
        id: 'group-1-3',
        senderType: 'community',
        senderName: 'Emma',
        text: 'Ik ook! 🏃‍♀️',
        createdAt: new Date(Date.now() - 900000).toISOString(),
      },
    ],
  },
  {
    id: 'group-2',
    type: 'group',
    title: 'Fitness Starters',
    participantName: 'Fitness Starters',
    participantRole: '156 leden',
    lastMessage: 'Coach Tom: Nieuwe beginners schema gepost!',
    updatedAt: new Date(Date.now() - 7200000).toISOString(),
    unreadCount: 1,
    isGroup: true,
    groupType: 'coach',
    memberCount: 156,
    joined: true,
    groupDescription: 'Beginner-friendly workouts en tips voor iedereen die net begint met fitness.',
    ownerType: 'coach',
    messages: [
      {
        id: 'group-2-1',
        senderType: 'coach',
        senderName: 'Coach Tom',
        text: 'Nieuwe beginners schema gepost!',
        createdAt: new Date(Date.now() - 7200000).toISOString(),
      },
    ],
  },
  {
    id: 'group-3',
    type: 'group',
    title: 'Meditatie & Ademhaling',
    participantName: 'Meditatie & Ademhaling',
    participantRole: '89 leden',
    lastMessage: 'Yoga Sarah: Morgenochtend sessie om 7 uur?',
    updatedAt: new Date(Date.now() - 10800000).toISOString(),
    unreadCount: 0,
    isGroup: true,
    groupType: 'discipline',
    disciplineSlug: 'mind',
    memberCount: 89,
    joined: true,
    groupDescription: 'Dagelijkse meditatie en ademhalingsoefening voor meer rust en focus.',
    ownerType: 'daely',
    messages: [
      {
        id: 'group-3-1',
        senderType: 'community',
        senderName: 'Yoga Sarah',
        text: 'Morgenochtend sessie om 7 uur?',
        createdAt: new Date(Date.now() - 10800000).toISOString(),
      },
    ],
  },
  {
    id: 'group-4',
    type: 'group',
    title: 'DAELY Support Groep',
    participantName: 'DAELY Support Groep',
    participantRole: '412 leden',
    lastMessage: 'Support: Nieuwe features live!',
    updatedAt: new Date(Date.now() - 18000000).toISOString(),
    unreadCount: 5,
    isGroup: true,
    groupType: 'support',
    memberCount: 412,
    joined: true,
    groupDescription: 'Algemene support groep voor vragen, tips en DAELY updates.',
    ownerType: 'daely',
    messages: [
      {
        id: 'group-4-1',
        senderType: 'support',
        senderName: 'Support',
        text: 'Nieuwe features live!',
        createdAt: new Date(Date.now() - 18000000).toISOString(),
      },
    ],
  },
  {
    id: 'group-5',
    type: 'group',
    title: 'Coachgroep: Krachttraining',
    participantName: 'Coachgroep: Krachttraining',
    participantRole: '67 leden',
    lastMessage: 'Coach Mark: Schema voor volgende week staat klaar',
    updatedAt: new Date(Date.now() - 259200000).toISOString(),
    unreadCount: 2,
    isGroup: true,
    groupType: 'coach',
    memberCount: 67,
    joined: true,
    groupDescription: 'Personal coaching groep voor krachttraining met Coach Mark.',
    ownerType: 'coach',
    messages: [
      {
        id: 'group-5-1',
        senderType: 'coach',
        senderName: 'Coach Mark',
        text: 'Schema voor volgende week staat klaar',
        createdAt: new Date(Date.now() - 259200000).toISOString(),
      },
    ],
  },
  {
    id: 'group-6',
    type: 'group',
    title: '30-Day Challenge',
    participantName: '30-Day Challenge',
    participantRole: '234 leden',
    lastMessage: 'Team: Dag 15 al! Keep going! 💪',
    updatedAt: new Date(Date.now() - 86400000).toISOString(),
    unreadCount: 0,
    isGroup: true,
    groupType: 'challenge',
    memberCount: 234,
    joined: false,
    groupDescription: '30-daagse fitness challenge met dagelijkse doelen en community support.',
    ownerType: 'daely',
    messages: [
      {
        id: 'group-6-1',
        senderType: 'system',
        senderName: 'Team',
        text: 'Dag 15 al! Keep going! 💪',
        createdAt: new Date(Date.now() - 86400000).toISOString(),
      },
    ],
  },
];

export async function getMessageThreads(): Promise<MessageThread[]> {
  try {
    const stored = await AsyncStorage.getItem(MESSAGES_THREADS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Initialize with mock data
    await AsyncStorage.setItem(MESSAGES_THREADS_KEY, JSON.stringify(MOCK_THREADS));
    return MOCK_THREADS;
  } catch (error) {
    console.error('Error loading message threads:', error);
    return MOCK_THREADS;
  }
}

export async function getMessageThreadById(id: string): Promise<MessageThread | null> {
  try {
    const threads = await getMessageThreads();
    return threads.find((t) => t.id === id) || null;
  } catch (error) {
    console.error('Error loading message thread:', error);
    return null;
  }
}

export async function addMessage(threadId: string, text: string, senderName: string = 'Ik'): Promise<MessageThread | null> {
  try {
    const threads = await getMessageThreads();
    const threadIndex = threads.findIndex((t) => t.id === threadId);
    
    if (threadIndex === -1) {
      return null;
    }

    const newMessage: Message = {
      id: `${threadId}-${Date.now()}`,
      senderType: 'user',
      senderName,
      text,
      createdAt: new Date().toISOString(),
    };

    const updatedThread = {
      ...threads[threadIndex],
      messages: [...threads[threadIndex].messages, newMessage],
      lastMessage: text,
      updatedAt: new Date().toISOString(),
    };

    threads[threadIndex] = updatedThread;
    await AsyncStorage.setItem(MESSAGES_THREADS_KEY, JSON.stringify(threads));
    
    return updatedThread;
  } catch (error) {
    console.error('Error adding message:', error);
    return null;
  }
}

export async function getUnreadMessageCount(): Promise<number> {
  try {
    const threads = await getMessageThreads();
    return threads.reduce((total, thread) => total + (thread.unreadCount || 0), 0);
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

export async function markThreadAsRead(threadId: string): Promise<void> {
  try {
    const threads = await getMessageThreads();
    const threadIndex = threads.findIndex((t) => t.id === threadId);
    
    if (threadIndex === -1) {
      return;
    }

    const updatedThread = {
      ...threads[threadIndex],
      unreadCount: 0,
    };

    threads[threadIndex] = updatedThread;
    await AsyncStorage.setItem(MESSAGES_THREADS_KEY, JSON.stringify(threads));
  } catch (error) {
    console.error('Error marking thread as read:', error);
  }
}

export async function createGroup(
  name: string,
  groupType: GroupType,
  description?: string,
  disciplineSlug?: string,
  ownerName: string = 'Ik'
): Promise<MessageThread | null> {
  try {
    const threads = await getMessageThreads();
    
    const newGroup: MessageThread = {
      id: `group-${Date.now()}`,
      type: 'group',
      title: name,
      participantName: name,
      participantRole: '1 lid',
      lastMessage: '',
      updatedAt: new Date().toISOString(),
      unreadCount: 0,
      isGroup: true,
      groupType,
      memberCount: 1,
      joined: true,
      groupDescription: description,
      disciplineSlug,
      ownerType: 'user',
      messages: [
        {
          id: `group-${Date.now()}-1`,
          senderType: 'system' as const,
          senderName: 'DAELY',
          text: `${ownerName} heeft deze groep aangemaakt.`,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    threads.unshift(newGroup);
    await AsyncStorage.setItem(MESSAGES_THREADS_KEY, JSON.stringify(threads));
    
    return newGroup;
  } catch (error) {
    console.error('Error creating group:', error);
    return null;
  }
}

export async function joinGroup(groupId: string): Promise<MessageThread | null> {
  try {
    const threads = await getMessageThreads();
    const threadIndex = threads.findIndex((t) => t.id === groupId);
    
    if (threadIndex === -1) {
      return null;
    }

    const updatedThread = {
      ...threads[threadIndex],
      joined: true,
      memberCount: (threads[threadIndex].memberCount || 0) + 1,
      messages: [
        ...threads[threadIndex].messages,
        {
          id: `${groupId}-${Date.now()}`,
          senderType: 'system' as const,
          senderName: 'DAELY',
          text: `Je bent lid geworden van de groep.`,
          createdAt: new Date().toISOString(),
        },
      ],
    };

    threads[threadIndex] = updatedThread;
    await AsyncStorage.setItem(MESSAGES_THREADS_KEY, JSON.stringify(threads));
    
    return updatedThread;
  } catch (error) {
    console.error('Error joining group:', error);
    return null;
  }
}

export async function leaveGroup(groupId: string): Promise<void> {
  try {
    const threads = await getMessageThreads();
    const threadIndex = threads.findIndex((t) => t.id === groupId);
    
    if (threadIndex === -1) {
      return;
    }

    const updatedThread = {
      ...threads[threadIndex],
      joined: false,
      memberCount: Math.max(0, (threads[threadIndex].memberCount || 0) - 1),
    };

    threads[threadIndex] = updatedThread;
    await AsyncStorage.setItem(MESSAGES_THREADS_KEY, JSON.stringify(threads));
  } catch (error) {
    console.error('Error leaving group:', error);
  }
}