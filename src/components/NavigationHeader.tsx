import HeaderProfileBtn from "@/app/(root)/_components/HeaderProfileBtn";
// import { SignedOut } from "@clerk/nextjs";
import { Blocks, Code2, Menu, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

function NavigationHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative z-10">
    <div
      className="flex items-center justify-between 
      bg-[#0a0a0f]/80 backdrop-blur-xl p-3 sm:p-4 lg:p-6 mb-4 rounded-lg"
    >
      {/* Logo - visible on all screens */}
      <Link href="/" className="flex items-center gap-2 sm:gap-3 group relative">
        {/* Logo hover effect */}
        <div
          className="absolute -inset-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg opacity-0 
            group-hover:opacity-100 transition-all duration-500 blur-xl"
        />

        {/* Logo */}
        <div
          className="relative bg-gradient-to-br from-[#1a1a2e] to-[#0a0a0f] p-1.5 sm:p-2 rounded-xl ring-1
          ring-white/10 group-hover:ring-white/20 transition-all"
        >
          <Blocks className="size-5 sm:size-6 text-blue-400 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500" />
        </div>

        <div className="flex flex-col">
          <span className="block text-base sm:text-lg font-semibold bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 text-transparent bg-clip-text">
            CollabCode
          </span>
          <span className="hidden sm:block text-xs text-blue-400/60 font-medium">
            Interactive Code Editor
          </span>
        </div>
      </Link>

      {/* Desktop Navigation - hidden on mobile */}
      <nav className="hidden lg:flex items-center space-x-1">
        <Link
          href="/snippets"
          className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 
            hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 
            to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
          <span
            className="text-sm font-medium relative z-10 group-hover:text-white
             transition-colors"
          >
            Snippets
          </span>
        </Link>
        <Link
          href="/community"
          className="relative group flex items-center gap-2 px-4 py-1.5 rounded-lg text-gray-300 bg-gray-800/50 
            hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 shadow-lg overflow-hidden"
        >
          <div
            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 
            to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
          />
          <Code2 className="w-4 h-4 relative z-10 group-hover:rotate-3 transition-transform" />
          <span
            className="text-sm font-medium relative z-10 group-hover:text-white
             transition-colors"
          >
            Community
          </span>
        </Link>
      </nav>


        {/* Pro link commented out for now */}
        {/* {!convexUser?.proSince && (
          <Link
            href="/pricing"
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-lg border border-amber-500/20 hover:border-amber-500/40 bg-gradient-to-r from-amber-500/10 
              to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 
              transition-all duration-300"
          >
            <Sparkles className="w-4 h-4 text-amber-400 hover:text-amber-300" />
            <span className="text-sm font-medium text-amber-400/90 hover:text-amber-300">
              Pro
            </span>
          </Link>
        )} */}

        {/* Run Button - visible on all screen sizes */}

        {/* Profile Button - visible on all screen sizes */}
        <div className="hidden sm:block pl-2 sm:pl-3 border-l border-gray-800">
          <HeaderProfileBtn />
        </div>

        {/* Mobile menu button */}
        <button
            className="lg:hidden p-2 rounded-lg bg-gray-800/50 hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="size-5 text-gray-300" />
            ) : (
              <Menu className="size-5 text-gray-300" />
            )}
          </button>
        </div>
      

      
      {mobileMenuOpen && (
        <div className="lg:hidden absolute inset-x-0 top-full mt-2 p-4 bg-[#0a0a0f]/95 backdrop-blur-xl rounded-lg border border-white/5 shadow-xl z-20 flex flex-col gap-4 animate-fadeIn">
          {/* Mobile navigation */}
          <div className="flex flex-col gap-2">
            <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">Navigation</h3>
            <Link
              href="/snippets"
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-300 bg-gray-800/50 
              hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Code2 className="w-4 h-4" />
              <span className="text-sm font-medium">Snippets</span>
            </Link>
            <Link
              href="/community"
              className="flex items-center gap-2 px-4 py-3 rounded-lg text-gray-300 bg-gray-800/50 
              hover:bg-blue-500/10 border border-gray-800 hover:border-blue-500/50 transition-all"
              onClick={() => setMobileMenuOpen(false)}
            >
              <Code2 className="w-4 h-4" />
              <span className="text-sm font-medium">Community</span>
            </Link>
          </div>

          {/* Mobile profile section */}
          <div className="mt-2 sm:hidden">
            <h3 className="text-xs uppercase text-gray-500 font-medium mb-1">Account</h3>
            <div className="p-3 bg-gray-800/50 rounded-lg border border-gray-800">
              <HeaderProfileBtn />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavigationHeader;

