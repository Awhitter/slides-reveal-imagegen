import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ModuleProvider } from './contexts/ModuleContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ModulePage from './pages/ModulePage';
import AuthorPage from './pages/AuthorPage';

const AppContent: React.FC = () => {
  const location = useLocation();
  const isModulePage = location.pathname.startsWith('/module/');

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Debug: App is rendering</h1>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/author" element={<AuthorPage />} />
          <Route path="/module/:id" element={<ModulePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ModuleProvider>
        <Router>
          <AppContent />
        </Router>
      </ModuleProvider>
    </ErrorBoundary>
  );
};

export default App;