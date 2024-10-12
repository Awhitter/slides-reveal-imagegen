import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { ModuleProvider } from './contexts/ModuleContext';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import LoadingSpinner from './components/LoadingSpinner';

const HomePage = lazy(() => import('./pages/HomePage'));
const AuthorPage = lazy(() => import('./pages/AuthorPage'));
const ModulePage = lazy(() => import('./pages/ModulePage'));

const AppContent: React.FC = () => {
  const location = useLocation();
  const isModulePage = location.pathname.startsWith('/module/');

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {!isModulePage && <Header />}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/author" element={<AuthorPage />} />
            <Route path="/module/:id" element={<ModulePage />} />
          </Routes>
        </Suspense>
      </main>
      {!isModulePage && <Footer />}
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
