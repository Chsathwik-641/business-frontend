"use client";
import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    router.push("/login");
  };

  if (pathname.includes("/login") || pathname.includes("/register") || !user) {
    return null;
  }

  return (
    <nav
      className={`${
        isScrolled ? "bg-gray-700 p-2" : "bg-gray-800 p-4"
      } fixed top-0 left-0 w-full z-50 transition-all duration-300`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          <div
            className={`${
              isScrolled ? "text-xl" : "text-2xl"
            } flex-shrink-0 text-white font-semibold tracking-wide transition-all duration-300`}
          >
            Project management
          </div>

          <div className="hidden sm:flex sm:items-center sm:space-x-6">
            <Link
              href="/dashboard"
              className="text-gray-300 hover:text-white hover:underline underline-offset-4 text-sm font-medium transition duration-150"
            >
              Dashboard
            </Link>
            {user.role === "admin" && (
              <Link
                href="/clients"
                className="text-gray-300 hover:text-white hover:underline underline-offset-4 text-sm font-medium transition duration-150"
              >
                Clients
              </Link>
            )}
            <Link
              href="/team"
              className="text-gray-300 hover:text-white hover:underline underline-offset-4 text-sm font-medium transition duration-150"
            >
              Team
            </Link>
            <Link
              href="/projects"
              className="text-gray-300 hover:text-white hover:underline underline-offset-4 text-sm font-medium transition duration-150"
            >
              Projects
            </Link>
            {user.role === "admin" && (
              <Link
                href="/invoices"
                className="text-gray-300 hover:text-white hover:underline underline-offset-4 text-sm font-medium transition duration-150"
              >
                Invoices
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="text-red-400 hover:text-red-600 text-sm font-medium transition duration-150"
            >
              Logout
            </button>
          </div>

          <div className="sm:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white"
            >
              Menu
            </button>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden bg-gray-800 text-white">
          <div className="space-y-4 p-4">
            <Link
              href="/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Dashboard
            </Link>
            {user.role === "admin" && (
              <Link
                href="/clients"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Clients
              </Link>
            )}
            <Link
              href="/team"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Team
            </Link>
            <Link
              href="/projects"
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Projects
            </Link>
            {user.role === "admin" && (
              <Link
                href="/invoices"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Invoices
              </Link>
            )}
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                handleLogout();
              }}
              className="block text-gray-300 hover:bg-gray-700 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
