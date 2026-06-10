import AsyncStorage from '@react-native-async-storage/async-storage';

const MESSAGES_THREADS_KEY = 'daely.messages.threads.v1';

export type MessageThreadType = 'support' | 'coach' | 'community' | 'forwarded';

export type LinkedItemType = 'workout' | 'program' | 'recipe' | 'post' | 'activity' | null;

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