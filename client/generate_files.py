import os

base_dir = r'C:\Users\Muhammad Ali Raza\.gemini\antigravity\scratch\Royal-Zone\client'

directories = [
    'src/components/common',
    'src/components/product',
    'src/components/cart',
    'src/components/forms',
    'src/context',
    'src/hooks',
    'src/services',
    'src/pages',
    'src/layouts'
]

for d in directories:
    os.makedirs(os.path.join(base_dir, d), exist_ok=True)

def write_file(path, content):
    with open(os.path.join(base_dir, path), 'w', encoding='utf-8') as f:
        f.write(content)

write_file('src/context/ThemeContext.jsx', """import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
""")

write_file('src/context/AuthContext.jsx', """import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  
  const login = (data) => setUser(data);
  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
""")

write_file('src/pages/PerfumesPage.jsx', """import React from 'react';
const PerfumesPage = () => <div className="pt-24 min-h-screen text-center"><h1 className="section-title">Perfumes Collection</h1></div>;
export default PerfumesPage;
""")

write_file('src/pages/BedsheetsPage.jsx', """import React from 'react';
const BedsheetsPage = () => <div className="pt-24 min-h-screen text-center"><h1 className="section-title">Bedsheets Collection</h1></div>;
export default BedsheetsPage;
""")

write_file('src/pages/ProductDetailPage.jsx', """import React from 'react';
const ProductDetailPage = () => <div className="pt-24 min-h-screen text-center"><h1 className="section-title">Product Detail</h1></div>;
export default ProductDetailPage;
""")

write_file('src/pages/CartPage.jsx', """import React from 'react';
const CartPage = () => <div className="pt-24 min-h-screen text-center"><h1 className="section-title">Your Cart</h1></div>;
export default CartPage;
""")

write_file('src/pages/LoginPage.jsx', """import React from 'react';
const LoginPage = () => <div className="pt-24 min-h-screen text-center"><h1 className="section-title">Login</h1></div>;
export default LoginPage;
""")

write_file('src/pages/RegisterPage.jsx', """import React from 'react';
const RegisterPage = () => <div className="pt-24 min-h-screen text-center"><h1 className="section-title">Register</h1></div>;
export default RegisterPage;
""")

write_file('src/App.jsx', """import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

const HomePage = React.lazy(() => import('./pages/HomePage'));
const PerfumesPage = React.lazy(() => import('./pages/PerfumesPage'));
const BedsheetsPage = React.lazy(() => import('./pages/BedsheetsPage'));
const ProductDetailPage = React.lazy(() => import('./pages/ProductDetailPage'));
const CartPage = React.lazy(() => import('./pages/CartPage'));
const LoginPage = React.lazy(() => import('./pages/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/RegisterPage'));

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<div className="flex h-screen items-center justify-center text-gold-500">Loading...</div>}>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<HomePage />} />
                <Route path="perfumes" element={<PerfumesPage />} />
                <Route path="bedsheets" element={<BedsheetsPage />} />
                <Route path="product/:id" element={<ProductDetailPage />} />
                <Route path="cart" element={<CartPage />} />
              </Route>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
export default App;
""")
