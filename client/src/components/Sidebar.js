import { NavLink } from 'react-router-dom';
import { Home, FilePlus } from 'lucide-react';

export default function Sidebar({ sidebarOpen, setSidebarOpen }) {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-white shadow-md transform transition-transform duration-200 ease-in-out z-20 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } md:translate-x-0 w-64`}
    >
      <div className="pt-16 h-full flex flex-col">
        <div className="px-4 py-6">
          <h2 className="text-xl font-semibold text-gray-800">Navigation</h2>
        </div>
        
        <nav className="flex-1 px-2 space-y-1">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 font-medium' : ''
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <Home className="h-5 w-5 mr-3" />
            Search Issues
          </NavLink>
          
          <NavLink
            to="/report"
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-md text-gray-700 hover:bg-gray-100 ${
                isActive ? 'bg-gray-100 font-medium' : ''
              }`
            }
            onClick={() => setSidebarOpen(false)}
          >
            <FilePlus className="h-5 w-5 mr-3" />
            Report Issue
          </NavLink>
        </nav>
      </div>
    </div>
  );
}