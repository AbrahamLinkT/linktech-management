"use client";
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';

export function ClerkAuthButtons() {
  return (
    <div className="flex items-center gap-4">
      <SignedOut>
        <SignInButton mode="modal" afterSignInUrl="/dashboard">
          <button className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition">
            Iniciar Sesión
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
    </div>
  );
}
