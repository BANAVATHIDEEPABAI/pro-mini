import { ArrowLeft, Search, UserPlus } from 'lucide-react';
import { Contact } from '../utils/storage';
import { getAvatarColor, getInitials } from '../utils/helpers';
import { useState } from 'react';

interface ContactsProps {
  contacts: Contact[];
  onBack: () => void;
  onStartChat: (contactId: string) => void;
  onAddContact: (nickname: string) => void;
}

export default function Contacts({ contacts, onBack, onStartChat, onAddContact }: ContactsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContactName, setNewContactName] = useState('');

  const filteredContacts = contacts.filter(contact =>
    contact.nickname?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddContact = () => {
    if (newContactName.trim()) {
      onAddContact(newContactName.trim());
      setNewContactName('');
      setShowAddContact(false);
    }
  };

  return (
    <div className="w-full md:w-96 bg-[#111b21] flex flex-col h-full">
      <div className="bg-[#202c33] p-4">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-[#2a3942] text-[#aebac1]"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-medium text-white flex-1">Contacts</h1>
          <button
            onClick={() => setShowAddContact(!showAddContact)}
            className="p-2 rounded-full hover:bg-[#2a3942] text-[#aebac1] transition-colors"
            title="Add Contact"
          >
            <UserPlus className="w-6 h-6" />
          </button>
        </div>

        {showAddContact && (
          <div className="mb-4 p-3 bg-[#2a3942] rounded-lg">
            <input
              type="text"
              placeholder="Enter contact name"
              value={newContactName}
              onChange={(e) => setNewContactName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAddContact()}
              className="w-full bg-[#202c33] text-white px-3 py-2 rounded-lg focus:outline-none mb-2"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddContact}
                className="flex-1 bg-[#00a884] text-white py-2 rounded-lg hover:bg-[#06cf9c] transition-colors"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowAddContact(false);
                  setNewContactName('');
                }}
                className="flex-1 bg-[#374955] text-white py-2 rounded-lg hover:bg-[#475a69] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[#667781]" />
          <input
            type="text"
            placeholder="Search contacts"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#202c33] text-white pl-12 pr-4 py-2 rounded-lg focus:outline-none focus:bg-[#2a3942] transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2 text-xs text-[#00a884] font-medium">
          {filteredContacts.length} CONTACT{filteredContacts.length !== 1 ? 'S' : ''}
        </div>

        {filteredContacts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-[#667781] px-8 text-center">
            <p className="text-lg mb-2">No contacts found</p>
            <p className="text-sm">Add contacts to start chatting</p>
          </div>
        ) : (
          filteredContacts.map(contact => {
            const avatar = {
              color: getAvatarColor(contact.nickname || 'Unknown'),
              initials: getInitials(contact.nickname || 'Unknown'),
            };

            return (
              <button
                key={contact.id}
                onClick={() => onStartChat(contact.id)}
                className="w-full p-4 flex items-center gap-4 hover:bg-[#2a3942] transition-colors border-b border-[#2a3942]"
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white font-medium flex-shrink-0"
                  style={{ backgroundColor: avatar.color }}
                >
                  {avatar.initials}
                </div>

                <div className="flex-1 text-left">
                  <h3 className="font-medium text-white">{contact.nickname}</h3>
                  <p className="text-sm text-[#667781]">
                    {contact.status || 'Hey there! I am using WhatsApp'}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
