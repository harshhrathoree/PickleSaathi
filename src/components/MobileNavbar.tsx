"use client";

import {
  BellIcon,
  HomeIcon,
  LogOutIcon,
  MenuIcon,
  MoonIcon,
  SunIcon,
  UserIcon,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { useAuth, SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import { useTheme } from "next-themes";
import Link from "next/link";

function MobileNavbar() {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex md:hidden items-center space-x-2">
      {/* Dark/Light Toggle */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="mr-2"
      >
        <SunIcon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
        <MoonIcon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        <span className="sr-only">Toggle theme</span>
      </Button>

      {/* Mobile Drawer */}
      <Sheet open={showMobileMenu} onOpenChange={setShowMobileMenu}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent 
          side="right" 
          className="w-[300px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-l border-gray-200 dark:border-gray-700"
        >
          <SheetHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
            <SheetTitle className="text-gray-900 dark:text-gray-100">Menu</SheetTitle>
          </SheetHeader>

          <div className="mt-6 space-y-6">
            {/* Location Selector */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-100/80 dark:bg-gray-800/80 border border-gray-300 dark:border-gray-600 shadow-sm">
              <MapPin className="w-4 h-4 text-gray-500 dark:text-gray-400" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Ahmedabad</span>
              <span className="text-xs text-gray-400 dark:text-gray-500 italic">(More soon)</span>
            </div>

            {/* Nav Links */}
            <nav className="flex flex-col space-y-4">
              <Button 
                variant="ghost" 
                className="flex items-center gap-3 justify-start hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" 
                asChild
              >
                <Link href="/">
                  <HomeIcon className="w-4 h-4" />
                  Home
                </Link>
              </Button>

              {isSignedIn ? (
                <>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-3 justify-start hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" 
                    asChild
                  >
                    <Link href="/notifications">
                      <BellIcon className="w-4 h-4" />
                      Notifications
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="flex items-center gap-3 justify-start hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300" 
                    asChild
                  >
                    <Link
                      href={`/profile/${
                        user?.username ?? user?.emailAddresses[0].emailAddress.split("@")[0]
                      }`}
                    >
                      <UserIcon className="w-4 h-4" />
                      Profile
                    </Link>
                  </Button>
                  <SignOutButton>
                    <Button
                      variant="ghost"
                      className="flex items-center gap-3 justify-start w-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                    >
                      <LogOutIcon className="w-4 h-4" />
                      Logout
                    </Button>
                  </SignOutButton>
                </>
              ) : (
                <SignInButton mode="modal">
                  <Button variant="default" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                    Sign In
                  </Button>
                </SignInButton>
              )}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

export default MobileNavbar;