import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SearchIssues from './pages/SearchIssues';
import ReportIssueForm from './pages/ReportIssueForm';
import '@fontsource/inter';
import Implementation from './pages/Implementation'; // Adjust the path if needed


// Fallback BoschLogo component in case import fails
let BoschLogo;
try {
  BoschLogo = require('./components/BoschLogo').default;
} catch (e) {
  BoschLogo = () => (
    <div className="flex items-center">
      <span className="text-2xl font-bold text-[#EA0016] mr-1">BOSCH</span>
      <span className="text-xs self-start text-[#EA0016]">®</span>
    </div>
  );
  console.warn("Using fallback BoschLogo component");
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation */}
        <Navbar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Main Content */}
        <main className="pt-16 pl-0 md:pl-64">
          {/* Bosch Branded Header */}
          <div className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <BoschLogo />
                </div>
                <div className="ml-4 border-l border-gray-200 pl-4">
                  <h1 className="text-xl font-bold text-gray-900">
                    Engineering Lessons Learned
                  </h1>
                  <p className="text-sm text-[#005691]">
                    Knowledge sharing platform
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Page Content */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Routes>
              <Route path="/" element={<SearchIssues />} />
              <Route path="/report" element={<ReportIssueForm />} />
              <Route path="/implementation" element={<Implementation />} />
            </Routes>
          </div>
        </main>
      </div>
    </Router>
  );
}

export default App;