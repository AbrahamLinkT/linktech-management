
import { UserButton, SignedIn, SignedOut } from "@clerk/nextjs";

import PropTypes from "prop-types";
import { ChevronsLeft, ChevronsRight } from "lucide-react";

export const Header = ({collapsed, setCollapsed}) => {
  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost size-10"
          onClick={() => setCollapsed(!collapsed)}
          style={{ transition: 'transform 0.3s' }}
        >
          <span style={{ display: 'inline-block', transition: 'transform 0.3s' }}>
            {collapsed ? <ChevronsRight className="animate-chevron" /> : <ChevronsLeft className="animate-chevron" />}
          </span>
        </button>
      </div>
      <div className="flex-1 flex justify-end items-center">
        <SignedIn>
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/" appearance={{
              elements: {
                avatarBox: "ring-2 ring-blue-500",
              },
            }} />
            <span className="hidden md:inline text-sm font-medium text-gray-700 dark:text-gray-200 ml-2">Perfil</span>
          </div>
        </SignedIn>
        <SignedOut>
          {/* Aquí podrías poner un botón de login si lo deseas */}
        </SignedOut>
      </div>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
