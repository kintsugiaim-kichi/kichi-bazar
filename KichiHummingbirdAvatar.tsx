import React from 'react';
import { STORE_LINKS } from '../data/catalog';

interface KichiHummingbirdAvatarProps {
  sizeClass?: string;
  alt?: string;
}

export const KichiHummingbirdAvatar: React.FC<KichiHummingbirdAvatarProps> = ({
  sizeClass = 'w-14 h-14',
  alt = 'Colibrí de KichiBot',
}) => {
  return (
    <div
      className={`${sizeClass} relative rounded-full overflow-hidden shrink-0 bg-[#FCE4E7] shadow-[0_8px_22px_-6px_rgba(166,95,88,0.42)]`}
    >
      <img
        src={STORE_LINKS.kichiBotAvatar}
        alt={alt}
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover rounded-full block scale-[1.02] pointer-events-none select-none"
      />
    </div>
  );
};
