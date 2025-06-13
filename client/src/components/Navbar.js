import { MenuIcon, XIcon, SearchIcon } from 'lucide-react';

export default function Navbar({ sidebarOpen, setSidebarOpen }) {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
      <div className="flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100"
          >
            {sidebarOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
          {/* Removed the title from here */}
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100">
            <SearchIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </nav>
  );
}