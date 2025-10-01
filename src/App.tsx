import { useEffect, useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import Profile from './components/Profile';
import Contacts from './components/Contacts';
import { storage, User, Chat, Contact, Message } from './utils/storage';
import { generateId } from './utils/helpers';

type View = 'chats' | 'profile' | 'contacts';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [chats, setChats] = useState<Chat[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<View>('chats');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showChatOnMobile, setShowChatOnMobile] = useState(false);

  useEffect(() => {
    storage.initializeDemoData();
    loadData();
  }, []);

  const loadData = () => {
    const loadedUser = storage.getUser();
    const loadedContacts = storage.getContacts();
    const loadedChats = storage.getChats();
    const loadedMessages = storage.getMessages();

    if (loadedUser) setUser(loadedUser);
    setContacts(loadedContacts);
    setChats(loadedChats);
    setMessages(loadedMessages);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setShowChatOnMobile(true);

    if (user) {
      storage.markMessagesAsRead(chatId, user.id);
      loadData();
    }
  };

  const handleSendMessage = (content: string) => {
    if (!selectedChatId || !user) return;

    const newMessage: Message = {
      id: generateId(),
      chatId: selectedChatId,
      senderId: user.id,
      content,
      timestamp: new Date(),
      read: false,
    };

    storage.addMessage(newMessage);

    const selectedChat = chats.find(c => c.id === selectedChatId);
    if (selectedChat) {
      storage.updateChat(selectedChatId, {
        lastMessage: newMessage,
        updatedAt: new Date(),
      });
    }

    loadData();
  };

  const handleNewChat = () => {
    setActiveView('contacts');
  };

  const handleStartChat = (contactId: string) => {
    if (!user) return;

    const existingChat = chats.find(
      chat => !chat.isGroup &&
      chat.participants.includes(user.id) &&
      chat.participants.includes(contactId)
    );

    if (existingChat) {
      setSelectedChatId(existingChat.id);
      setActiveView('chats');
      setShowChatOnMobile(true);
      return;
    }

    const newChat: Chat = {
      id: generateId(),
      name: '',
      isGroup: false,
      participants: [user.id, contactId],
      updatedAt: new Date(),
    };

    storage.addChat(newChat);
    loadData();
    setSelectedChatId(newChat.id);
    setActiveView('chats');
    setShowChatOnMobile(true);
  };

  const handleAddContact = (nickname: string) => {
    if (!user) return;

    const newContact: Contact = {
      id: generateId(),
      userId: user.id,
      nickname,
    };

    storage.addContact(newContact);
    loadData();
  };

  const handleUpdateProfile = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    storage.setUser(updatedUser);
    setUser(updatedUser);
  };

  const handleViewChange = (view: View) => {
    setActiveView(view);
    setShowChatOnMobile(false);
    setIsMobileMenuOpen(false);
  };

  const handleBackToList = () => {
    setShowChatOnMobile(false);
    setSelectedChatId(null);
  };

  const selectedChat = chats.find(c => c.id === selectedChatId) || null;
  const selectedChatMessages = selectedChatId
    ? storage.getChatMessages(selectedChatId)
    : [];

  if (!user) {
    return (
      <div className="min-h-screen bg-[#111b21] flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#111b21] flex overflow-hidden">
      <Sidebar
        user={user}
        activeView={activeView}
        onViewChange={handleViewChange}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      <div className={`flex-1 flex ${showChatOnMobile ? 'md:flex' : ''} overflow-hidden`}>
        <div className={`${showChatOnMobile ? 'hidden md:flex' : 'flex'} flex-col flex-shrink-0`}>
          {activeView === 'chats' && (
            <ChatList
              chats={chats}
              contacts={contacts}
              currentUserId={user.id}
              selectedChatId={selectedChatId}
              onChatSelect={handleChatSelect}
              onNewChat={handleNewChat}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          )}

          {activeView === 'profile' && (
            <Profile
              user={user}
              onBack={() => handleViewChange('chats')}
              onUpdateProfile={handleUpdateProfile}
            />
          )}

          {activeView === 'contacts' && (
            <Contacts
              contacts={contacts}
              onBack={() => handleViewChange('chats')}
              onStartChat={handleStartChat}
              onAddContact={handleAddContact}
            />
          )}
        </div>

        <div className={`${showChatOnMobile || !selectedChatId ? 'flex' : 'hidden md:flex'} flex-1`}>
          {activeView === 'chats' && (
            <ChatWindow
              chat={selectedChat}
              contacts={contacts}
              messages={selectedChatMessages}
              currentUserId={user.id}
              onSendMessage={handleSendMessage}
              onBack={handleBackToList}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
