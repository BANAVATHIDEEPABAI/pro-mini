import { User, MessageCircle, Users, Settings, Menu } from 'lucide-react';
import { User as UserType } from '../utils/storage';
import { getAvatarColor, getInitials } from '../utils/helpers';

interface SidebarProps {
  user: UserType;
  activeView: 'chats' | 'profile' | 'contacts';
  onViewChange: (view: 'chats' | 'profile' | 'contacts') => void;
  onMenuToggle: () => void;
  isMobileMenuOpen: boolean;
}

export default function Sidebar({ user, activeView, onViewChange, onMenuToggle, isMobileMenuOpen }: SidebarProps) {
  return (
    <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 fixed md:relative z-50 w-16 bg-[#202c33] h-full flex flex-col items-center py-4 transition-transform duration-300`}>
      <button
        onClick={onMenuToggle}
        className="md:hidden absolute -right-12 top-4 bg-[#202c33] p-2 rounded-r-lg"
      >
        <Menu className="w-6 h-6 text-[#aebac1]" />
      </button>

      <div className="flex flex-col gap-6 flex-1">
        <button
          onClick={() => onViewChange('chats')}
          className={`p-3 rounded-lg transition-colors ${
            activeView === 'chats'
              ? 'bg-[#2a3942] text-[#00a884]'
              : 'text-[#aebac1] hover:bg-[#2a3942]'
          }`}
          title="Chats"
        >
          <MessageCircle className="w-6 h-6" />
        </button>

        <button
          onClick={() => onViewChange('contacts')}
          className={`p-3 rounded-lg transition-colors ${
            activeView === 'contacts'
              ? 'bg-[#2a3942] text-[#00a884]'
              : 'text-[#aebac1] hover:bg-[#2a3942]'
          }`}
          title="Contacts"
        >
          <Users className="w-6 h-6" />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => onViewChange('profile')}
          className="p-3 rounded-lg text-[#aebac1] hover:bg-[#2a3942] transition-colors"
          title="Settings"
        >
          <Settings className="w-6 h-6" />
        </button>

        <button
          onClick={() => onViewChange('profile')}
          className="relative"
          title="Profile"
        >
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white font-medium"
              style={{ backgroundColor: getAvatarColor(user.username) }}
            >
              {getInitials(user.username)}
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
