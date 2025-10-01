import { ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Paperclip } from 'lucide-react';
import { Chat, Contact, Message } from '../utils/storage';
import { formatTime, getAvatarColor, getInitials } from '../utils/helpers';
import { useState } from 'react';

interface ChatWindowProps {
  chat: Chat | null;
  contacts: Contact[];
  messages: Message[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
  onBack: () => void;
}

export default function ChatWindow({
  chat,
  contacts,
  messages,
  currentUserId,
  onSendMessage,
  onBack,
}: ChatWindowProps) {
  const [messageText, setMessageText] = useState('');

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[#0b141a] text-[#667781]">
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 opacity-20">
            <svg viewBox="0 0 303 172" fill="currentColor">
              <path d="M82.4 166.2c-4.5-3.7-7.4-9.2-7.4-15.3V111c0-8.5 5.4-15.8 13-18.5v-8c0-39.7 32.3-72 72-72s72 32.3 72 72v8c7.6 2.7 13 10 13 18.5v39.9c0 11-9 19.9-19.9 19.9H186v5.9c0 11-9 19.9-19.9 19.9h-39.8c-11 0-19.9-9-19.9-19.9v-5.9h-24zm24-60.1v58.5h39.8V106.1h-39.8z"/>
            </svg>
          </div>
          <h2 className="text-2xl font-light mb-2">WhatsApp Web</h2>
          <p className="text-sm">Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  const getChatName = (): string => {
    if (chat.isGroup) return chat.name;
    const otherParticipantId = chat.participants.find(p => p !== currentUserId);
    const contact = contacts.find(c => c.id === otherParticipantId);
    return contact?.nickname || 'Unknown User';
  };

  const chatName = getChatName();
  const avatar = {
    color: getAvatarColor(chatName),
    initials: getInitials(chatName),
  };

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText.trim());
      setMessageText('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-[#0b141a] h-full">
      <div className="bg-[#202c33] px-4 py-3 flex items-center gap-4 border-b border-[#2a3942]">
        <button
          onClick={onBack}
          className="md:hidden p-2 -ml-2 rounded-full hover:bg-[#2a3942] text-[#aebac1]"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
          style={{ backgroundColor: avatar.color }}
        >
          {avatar.initials}
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="font-medium text-white truncate">{chatName}</h2>
          <p className="text-xs text-[#667781]">online</p>
        </div>

        <div className="flex items-center gap-6">
          <button className="text-[#aebac1] hover:text-white transition-colors">
            <Video className="w-6 h-6" />
          </button>
          <button className="text-[#aebac1] hover:text-white transition-colors">
            <Phone className="w-6 h-6" />
          </button>
          <button className="text-[#aebac1] hover:text-white transition-colors">
            <MoreVertical className="w-6 h-6" />
          </button>
        </div>
      </div>

      <div
        className="flex-1 overflow-y-auto p-4"
        style={{
          backgroundImage: 'url(https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png)',
          backgroundColor: '#0b141a',
        }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="bg-[#202c33] rounded-lg px-6 py-3 text-[#667781] text-sm">
              <p className="text-center">Start a conversation</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {messages.map((message) => {
              const isOwn = message.senderId === currentUserId;
              return (
                <div
                  key={message.id}
                  className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-3 py-2 ${
                      isOwn
                        ? 'bg-[#005c4b] text-white'
                        : 'bg-[#202c33] text-white'
                    }`}
                  >
                    <p className="text-sm break-words whitespace-pre-wrap">{message.content}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-xs opacity-70">
                        {formatTime(message.timestamp)}
                      </span>
                      {isOwn && (
                        <svg
                          className="w-4 h-4 opacity-70"
                          viewBox="0 0 16 15"
                          fill="none"
                        >
                          <path
                            d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.88a.32.32 0 0 1-.484.032l-.358-.325a.319.319 0 0 0-.484.032l-.378.48a.418.418 0 0 0 .036.54l1.32 1.267a.32.32 0 0 0 .484-.034l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.88a.32.32 0 0 1-.484.032L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"
                            fill="currentColor"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-[#202c33] px-4 py-3 flex items-center gap-3">
        <button className="text-[#aebac1] hover:text-white transition-colors">
          <Smile className="w-6 h-6" />
        </button>
        <button className="text-[#aebac1] hover:text-white transition-colors">
          <Paperclip className="w-6 h-6" />
        </button>

        <input
          type="text"
          placeholder="Type a message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 bg-[#2a3942] text-white px-4 py-2 rounded-lg focus:outline-none"
        />

        <button
          onClick={handleSend}
          disabled={!messageText.trim()}
          className="text-[#aebac1] hover:text-[#00a884] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
