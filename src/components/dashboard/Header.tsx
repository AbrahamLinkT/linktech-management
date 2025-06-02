'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/LinkLOGO.png" alt="Linktech Logo" width={150} height={50} />
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="relative flex items-center gap-2 bg-gray-100 p-2 rounded-lg hover:bg-gray-200"
            >
              <span className="font-medium">Admin</span>
              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg py-2">
                  <button
                    className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    onClick={() => {/* Implement logout */}}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}