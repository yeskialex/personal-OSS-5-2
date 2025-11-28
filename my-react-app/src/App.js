import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ListPage from './components/Pages/ListPage';
import DetailPage from './components/Pages/DetailPage';
import CreatePage from './components/Pages/CreatePage';
import UpdatePage from './components/Pages/UpdatePage';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* List page accessible at both / and /list */}
        <Route path="/" element={<ListPage />} />
        <Route path="/list" element={<ListPage />} />

        {/* Detail page with ID parameter */}
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/detail" element={<Navigate to="/list" />} />

        {/* Update page with ID parameter */}
        <Route path="/update/:id" element={<UpdatePage />} />
        <Route path="/update" element={<Navigate to="/list" />} />

        {/* Create page for adding new games */}
        <Route path="/create" element={<CreatePage />} />

        {/* Catch all - redirect to list */}
        <Route path="*" element={<Navigate to="/list" />} />
      </Routes>
    </Router>
  );
}

export default App;
