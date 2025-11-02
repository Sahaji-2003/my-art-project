
import React from 'react';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import LandingPage from './pages/LandingPage';

import LoginPage from './pages/LoginPage';

import SignupPage from './pages/SignupPage';

import ArtistProfilePage from './pages/ArtistProfilePage';

import DashboardPage from './pages/DashboardPage';

import UploadPage from './pages/UploadPage';
import SearchPage from './pages/SearchPage';
import PurchasePage from './pages/PurchasePage';
import CommunityPage from './pages/CommunityPage';
import InventoryPage from './pages/InventoryPage';
import MyPurchasesPage from './pages/MyPurchasesPage';
import PasswordPage from './pages/PasswordPage';
import SettingsPage from './pages/SettingsPage';
import ViewArtistProfilePage from './pages/ViewArtistProfilePage';

import Header from './components/Header';

import Footer from './components/Footer';

import { isAuthenticated, getUser } from './services/api.service';

import './styles/App.css';


 

// Protected Route Component

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {

 return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;

};


 

// Public Route Component (redirect if logged in)

const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  if (!isAuthenticated()) {
    return <>{children}</>;
  }

  // Check if user is an artist to redirect accordingly
  const user = getUser();
  const redirectTo = user?.isArtist ? '/dashboard' : '/profile';
  
  return <Navigate to={redirectTo} />;
};


 

// Layout wrapper for authenticated pages

const AuthenticatedLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {

 return (

   <>

     <Header />

     {children}

     <Footer />

   </>

 );

};


 

function App() {

 return (

   <Router>

     <Routes>

       {/* Public Routes */}

       <Route path="/" element={<LandingPage />} />

       <Route 

         path="/login" 

         element={

           <PublicRoute>

             <LoginPage />

           </PublicRoute>

         } 

       />

       <Route 

         path="/signup" 

         element={

           <PublicRoute>

             <SignupPage />

           </PublicRoute>

         } 

       />


 

       {/* Protected Routes */}

       <Route 

         path="/dashboard" 

         element={

           <ProtectedRoute>

             <AuthenticatedLayout>

               <DashboardPage />

             </AuthenticatedLayout>

           </ProtectedRoute>

         } 

       />

       <Route 

         path="/upload" 

         element={

           <ProtectedRoute>

             <AuthenticatedLayout>

               <UploadPage />

             </AuthenticatedLayout>

           </ProtectedRoute>

         } 

       />

       <Route 

         path="/search" 

         element={

           <ProtectedRoute>

             <AuthenticatedLayout>

               <SearchPage />

             </AuthenticatedLayout>

           </ProtectedRoute>

         } 

       />

       <Route 

         path="/purchase/:artworkId" 

         element={

           <ProtectedRoute>

             <AuthenticatedLayout>

               <PurchasePage />

             </AuthenticatedLayout>

           </ProtectedRoute>

         } 

       />

       <Route 

         path="/community" 

         element={

           <ProtectedRoute>

             <AuthenticatedLayout>

               <CommunityPage />

             </AuthenticatedLayout>

           </ProtectedRoute>

         } 

       />

       <Route 

         path="/inventory" 

         element={

           <ProtectedRoute>

             <AuthenticatedLayout>

               <InventoryPage />

             </AuthenticatedLayout>

           </ProtectedRoute>

         } 

       />

       

       <Route 

         path="/profile" 

         element={

           <ProtectedRoute>

             <AuthenticatedLayout>

               <ArtistProfilePage />

             </AuthenticatedLayout>

           </ProtectedRoute>

         } 

       />

       <Route 

         path="/my-purchases" 

         element={

           <ProtectedRoute>

             <AuthenticatedLayout>

               <MyPurchasesPage />

             </AuthenticatedLayout>

           </ProtectedRoute>

         } 

       />

       <Route 

         path="/password" 

         element={

           <ProtectedRoute>

             <AuthenticatedLayout>

               <PasswordPage />

             </AuthenticatedLayout>

           </ProtectedRoute>

         } 

       />

      <Route 

        path="/settings" 

        element={

          <ProtectedRoute>

            <AuthenticatedLayout>

              <SettingsPage />

            </AuthenticatedLayout>

          </ProtectedRoute>

        } 

      />

      <Route 

        path="/artist/:userId" 

        element={

          <ProtectedRoute>

            <AuthenticatedLayout>

              <ViewArtistProfilePage />

            </AuthenticatedLayout>

          </ProtectedRoute>

        } 

      />


 

      {/* 404 Route */}

      <Route path="*" element={<Navigate to="/" />} />

     </Routes>

   </Router>

 );

}


 

export default App;