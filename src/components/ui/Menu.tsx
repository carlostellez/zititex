'use client';

import { useState } from 'react';

interface MenuItem {
  label: string;
  href: string;
  external?: boolean;
}

interface MenuProps {
  items: MenuItem[];
  className?: string;
  isMobile?: boolean;
  onItemClick?: () => void;
}

export function Menu({ items, className = '', isMobile = false, onItemClick }: MenuProps) {
  const [activeItem, setActiveItem] = useState<string>('');

  const handleItemClick = (href: string, external = false) => {
    setActiveItem(href);
    
    if (external) {
      window.open(href, '_blank');
    } else if (href.startsWith('#')) {
      const element = document.querySelector(href);
      element?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = href;
    }
    
    // Llamar callback si existe (útil para cerrar menú móvil)
    onItemClick?.();
  };

  if (isMobile) {
    return (
      <nav className={`flex flex-col space-y-2 ${className}`}>
        {items.map((item) => (
          <button
            key={item.href}
            onClick={() => handleItemClick(item.href, item.external)}
            className={`
              w-full text-left px-4 py-3 rounded-lg transition-all duration-200
              responsive-text-base font-medium
              ${activeItem === item.href 
                ? 'bg-blue-600 text-white' 
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              }
            `}
          >
            {item.label}
          </button>
        ))}
      </nav>
    );
  }

  // Detectar si se está usando el menú blanco (sobre hero)
  const isWhiteMenu = className.includes('text-white');

  return (
    <nav className={`flex items-center space-x-1 md:space-x-2`}>
      {items.map((item) => (
        <button
          key={item.href}
          onClick={() => handleItemClick(item.href, item.external)}
          className={`
            px-3 py-2 rounded-md transition-all duration-200
            responsive-text-sm font-medium
            ${activeItem === item.href 
              ? 'bg-blue-600 text-white' 
              : isWhiteMenu
                ? 'text-white/90 hover:text-white hover:bg-white/10'
                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
            }
          `}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
