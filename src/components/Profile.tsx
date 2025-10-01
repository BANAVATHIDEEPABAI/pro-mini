import { ArrowLeft, Camera, Check, X } from 'lucide-react';
import { User } from '../utils/storage';
import { getAvatarColor, getInitials } from '../utils/helpers';
import { useState } from 'react';

interface ProfileProps {
  user: User;
  onBack: () => void;
  onUpdateProfile: (updates: Partial<User>) => void;
}

export default function Profile({ user, onBack, onUpdateProfile }: ProfileProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [editedName, setEditedName] = useState(user.username);
  const [editedStatus, setEditedStatus] = useState(user.status);

  const handleSaveName = () => {
    if (editedName.trim() && editedName !== user.username) {
      onUpdateProfile({ username: editedName.trim() });
    }
    setIsEditingName(false);
  };

  const handleSaveStatus = () => {
    if (editedStatus !== user.status) {
      onUpdateProfile({ status: editedStatus });
    }
    setIsEditingStatus(false);
  };

  const handleCancelName = () => {
    setEditedName(user.username);
    setIsEditingName(false);
  };

  const handleCancelStatus = () => {
    setEditedStatus(user.status);
    setIsEditingStatus(false);
  };

  return (
    <div className="w-full md:w-96 bg-[#111b21] flex flex-col h-full">
      <div className="bg-[#202c33] px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={onBack}
            className="p-2 -ml-2 rounded-full hover:bg-[#2a3942] text-[#aebac1]"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-medium text-white">Profile</h1>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="flex flex-col items-center py-8 bg-[#202c33]">
          <div className="relative group">
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.username}
                className="w-32 h-32 rounded-full object-cover"
              />
            ) : (
              <div
                className="w-32 h-32 rounded-full flex items-center justify-center text-white text-3xl font-medium"
                style={{ backgroundColor: getAvatarColor(user.username) }}
              >
                {getInitials(user.username)}
              </div>
            )}
            <button className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>

        <div className="px-6 py-4 space-y-6">
          <div>
            <label className="text-sm text-[#00a884] block mb-2">Your name</label>
            {isEditingName ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="flex-1 bg-transparent text-white border-b-2 border-[#00a884] pb-1 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 text-[#00a884] hover:bg-[#2a3942] rounded"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancelName}
                  className="p-1 text-[#aebac1] hover:bg-[#2a3942] rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingName(true)}
                className="text-white cursor-pointer hover:bg-[#2a3942] -mx-2 px-2 py-1 rounded transition-colors"
              >
                {user.username}
              </div>
            )}
          </div>

          <div>
            <label className="text-sm text-[#667781] block mb-2">
              This is not your username or pin. This name will be visible to your WhatsApp contacts.
            </label>
          </div>

          <div>
            <label className="text-sm text-[#00a884] block mb-2">About</label>
            {isEditingStatus ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editedStatus}
                  onChange={(e) => setEditedStatus(e.target.value)}
                  className="flex-1 bg-transparent text-white border-b-2 border-[#00a884] pb-1 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveStatus}
                  className="p-1 text-[#00a884] hover:bg-[#2a3942] rounded"
                >
                  <Check className="w-5 h-5" />
                </button>
                <button
                  onClick={handleCancelStatus}
                  className="p-1 text-[#aebac1] hover:bg-[#2a3942] rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingStatus(true)}
                className="text-white cursor-pointer hover:bg-[#2a3942] -mx-2 px-2 py-1 rounded transition-colors"
              >
                {user.status}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
