export interface User {
  id: string;
  username: string;
  avatarUrl: string;
  status: string;
  lastSeen: Date;
}

export interface Contact {
  //[x: string]: string;
  id: string;
  userId: string;
  nickname?: string;
  status?: string;
}

export interface Chat {
  id: string;
  name: string;
  isGroup: boolean;
  participants: string[];
  lastMessage?: Message;
  updatedAt: Date;
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

const STORAGE_KEYS = {
  USER: 'whatsapp_user',
  CONTACTS: 'whatsapp_contacts',
  CHATS: 'whatsapp_chats',
  MESSAGES: 'whatsapp_messages',
};

export const storage = {
  getUser(): User | null {
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    return data ? JSON.parse(data) : null;
  },

  setUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  },

  getContacts(): Contact[] {
    const data = localStorage.getItem(STORAGE_KEYS.CONTACTS);
    return data ? JSON.parse(data) : [];
  },

  setContacts(contacts: Contact[]): void {
    localStorage.setItem(STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  },

  addContact(contact: Contact): void {
    const contacts = this.getContacts();
    contacts.push(contact);
    this.setContacts(contacts);
  },

  getChats(): Chat[] {
    const data = localStorage.getItem(STORAGE_KEYS.CHATS);
    if (!data) return [];
    const chats = JSON.parse(data);
    return chats.map((chat: any) => ({
      ...chat,
      updatedAt: new Date(chat.updatedAt),
    }));
  },

  setChats(chats: Chat[]): void {
    localStorage.setItem(STORAGE_KEYS.CHATS, JSON.stringify(chats));
  },

  addChat(chat: Chat): void {
    const chats = this.getChats();
    chats.push(chat);
    this.setChats(chats);
  },

  updateChat(chatId: string, updates: Partial<Chat>): void {
    const chats = this.getChats();
    const index = chats.findIndex(c => c.id === chatId);
    if (index !== -1) {
      chats[index] = { ...chats[index], ...updates };
      this.setChats(chats);
    }
  },

  getMessages(): Message[] {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!data) return [];
    const messages = JSON.parse(data);
    return messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp),
    }));
  },

  setMessages(messages: Message[]): void {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  },

  addMessage(message: Message): void {
    const messages = this.getMessages();
    messages.push(message);
    this.setMessages(messages);
  },

  getChatMessages(chatId: string): Message[] {
    return this.getMessages()
      .filter(m => m.chatId === chatId)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
  },

  markMessagesAsRead(chatId: string, userId: string): void {
    const messages = this.getMessages();
    const updated = messages.map(msg => {
      if (msg.chatId === chatId && msg.senderId !== userId) {
        return { ...msg, read: true };
      }
      return msg;
    });
    this.setMessages(updated);
  },

  initializeDemoData(): void {
    const existingUser = this.getUser();
    if (existingUser) return;

    const currentUser: User = {
      id: 'user-1',
      username: 'Bhanu Deepa',
      avatarUrl: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=200',
      status: 'Available',
      lastSeen: new Date(),
    };
    this.setUser(currentUser);

    const demoContacts: Contact[] = [
      { id: 'user-2', userId: 'user-1', nickname: 'Alice Johnson' },
      { id: 'user-3', userId: 'user-1', nickname: 'Bob Smith' },
      { id: 'user-4', userId: 'user-1', nickname: 'Carol White' },
      { id: 'user-5', userId: 'user-1', nickname: 'David Brown' },
      { id: 'user-6', userId: 'user-1', nickname: 'Emma Wilson' },
    ];
    this.setContacts(demoContacts);

    const demoChats: Chat[] = [
      {
        id: 'chat-1',
        name: '',
        isGroup: false,
        participants: ['user-1', 'user-2'],
        updatedAt: new Date(Date.now() - 3600000),
      },
      {
        id: 'chat-2',
        name: '',
        isGroup: false,
        participants: ['user-1', 'user-3'],
        updatedAt: new Date(Date.now() - 7200000),
      },
      {
        id: 'chat-3',
        name: 'Team Project',
        isGroup: true,
        participants: ['user-1', 'user-2', 'user-3', 'user-4'],
        updatedAt: new Date(Date.now() - 10800000),
      },
    ];
    this.setChats(demoChats);

    const demoMessages: Message[] = [
      {
        id: 'msg-1',
        chatId: 'chat-1',
        senderId: 'user-2',
        content: 'Hey! How are you doing?',
        timestamp: new Date(Date.now() - 3600000),
        read: true,
      },
      {
        id: 'msg-2',
        chatId: 'chat-1',
        senderId: 'user-1',
        content: 'I am doing great! Thanks for asking.',
        timestamp: new Date(Date.now() - 3500000),
        read: true,
      },
      {
        id: 'msg-3',
        chatId: 'chat-2',
        senderId: 'user-3',
        content: 'Did you complete the assignment?',
        timestamp: new Date(Date.now() - 7200000),
        read: false,
      },
      {
        id: 'msg-4',
        chatId: 'chat-3',
        senderId: 'user-2',
        content: 'Welcome to the team project group!',
        timestamp: new Date(Date.now() - 10800000),
        read: true,
      },
    ];
    this.setMessages(demoMessages);
  },
};
