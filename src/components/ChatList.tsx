import { Search, Plus } from 'lucide-react';
import { Chat, Contact, Message } from '../utils/storage';
import { formatTime, getAvatarColor, getInitials } from '../utils/helpers';

interface ChatListProps {
  chats: Chat[];
  contacts: Contact[];
  currentUserId: string;
  selectedChatId: string | null;
  onChatSelect: (chatId: string) => void;
  onNewChat: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export default function ChatList({
  chats,
  contacts,
  currentUserId,
  selectedChatId,
  onChatSelect,
  onNewChat,
  searchQuery,
  onSearchChange,
}: ChatListProps) {
  const getChatName = (chat: Chat): string => {
    if (chat.isGroup) return chat.name;
    const otherParticipantId = chat.participants.find(p => p !== currentUserId);
    const contact = contacts.find(c => c.id === otherParticipantId);
    return contact?.nickname || 'Unknown User';
  };

  const getChatAvatar = (chat: Chat) => {
    const name = getChatName(chat);
    return {
      name,
      color: getAvatarColor(name),
      initials: getInitials(name),
    };
  };

  const getUnreadCount = (chat: Chat): number => {
    return 0;
  };

  const filteredChats = chats.filter(chat => {
    const name = getChatName(chat).toLowerCase();
    return name.includes(searchQuery.toLowerCase());
  });

  const sortedChats = [...filteredChats].sort(
    (a, b) => b.updatedAt.getTime() - a.updatedAt.getTime()
  );

  return (
    <div className="w-full md:w-96 bg-[#111b21] border-r border-[#2a3942] flex flex-col h-full">
      <div className="bg-[#202c33] p-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-white">Chats</h1>
          <button
            onClick={onNewChat}
            className="p-2 rounded-full hover:bg-[#2a3942] text-[#aebac1] transition-colors"
            title="New Chat"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667781]" />
          <input
            type="text"
            placeholder="Search or start new chat"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-[#202c33] text-white pl-12 pr-4 py-2 rounded-lg focus:outline-none focus:bg-[#2a3942] transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {sortedChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-[#667781] p-8 text-center">
            <MessageCircle className="w-16 h-16 mb-4 opacity-50" />
            <p className="text-lg">No chats yet</p>
            <p className="text-sm mt-2">Start a new conversation</p>
          </div>
        ) : (
          sortedChats.map(chat => {
            const avatar = getChatAvatar(chat);
            const unreadCount = getUnreadCount(chat);
            const isSelected = chat.id === selectedChatId;

            return (
              <button
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`w-full p-4 flex items-center gap-4 hover:bg-[#2a3942] transition-colors border-b border-[#2a3942] ${
                  isSelected ? 'bg-[#2a3942]' : ''
                }`}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
                  style={{ backgroundColor: avatar.color }}
                >
                  {avatar.initials}
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-white truncate">
                      {avatar.name}
                    </h3>
                    <span className="text-xs text-[#667781] ml-2">
                      {formatTime(chat.updatedAt)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-[#667781] truncate">
                      {chat.lastMessage?.content || 'No messages yet'}
                    </p>
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-[#00a884] text-white text-xs font-medium px-2 py-0.5 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function MessageCircle({ className }: { className: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
  );
}
