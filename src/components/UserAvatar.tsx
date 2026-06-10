import React from 'react';
import { AVATARS } from '../constants/avatars';

interface UserAvatarProps {
  avatarId: string | null;
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallbackName?: string;
}

const sizeClasses = {
  xs: 'w-6 h-6',
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

export default function UserAvatar({ avatarId, className = '', size = 'md', fallbackName }: UserAvatarProps) {
  const avatar = AVATARS.find(a => a.id === avatarId);
  
  if (!avatar) {
    const initials = fallbackName 
      ? fallbackName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
      : '?';

    return (
      <div className={`bg-gray-200 text-gray-500 flex items-center justify-center rounded-full font-bold ${sizeClasses[size]} ${className}`}>
        {initials}
      </div>
    );
  }

  return (
    <div className={`flex items-center justify-center rounded-full bg-gray-50 shadow-sm border border-gray-100 overflow-hidden ${sizeClasses[size]} ${className}`}>
      <img 
        src={avatar.url} 
        alt={avatar.name} 
        className="w-full h-full object-cover"
        referrerPolicy="no-referrer"
      />
    </div>
  );
}
