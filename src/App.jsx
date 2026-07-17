import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import SearchPage from './pages/SearchPage';
import ProfilePage from './pages/ProfilePage';
import RepoDetailPage from './pages/RepoDetailPage';
import FavouritesPage from './pages/FavouritesPage';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/user/:username" element={<ProfilePage />} />
        <Route path="/user/:username/repo/:reponame" element={<RepoDetailPage />} />
        <Route path="/favourites" element={<FavouritesPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
