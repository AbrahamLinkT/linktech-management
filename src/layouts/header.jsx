"use client";
import { ChevronsLeft, ChevronsRight, Search } from "lucide-react";

import PropTypes from "prop-types";
import { ClerkAuthButtons } from "@/components/ClerkAuthButtons";

export const Header = ({ collapsed, setCollapsed }) => {
  return (
    <header className="relative z-10 flex h-[60px] items-center justify-between bg-white px-4 shadow-md transition-colors dark:bg-slate-900">
      <div className="flex items-center gap-x-3">
        <button
          className="btn-ghost size-10"
          onClick={() => setCollapsed(!collapsed)}
          style={{ transition: "transform 0.3s" }}
        >
          <span
            style={{
              display: "inline-block",
              transition: "transform 0.3s",
            }}
          >
            {collapsed ? (
              <ChevronsRight className="animate-chevron" />
            ) : (
              <ChevronsLeft className="animate-chevron" />
            )}
          </span>
        </button>
      </div>

      {/* Right side: auth buttons (Sign in / User menu) */}
      <div className="flex items-center gap-4">
        <ClerkAuthButtons />
      </div>
    </header>
  );
};

Header.propTypes = {
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};
