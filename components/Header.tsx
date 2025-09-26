import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';

const Header: React.FC = () => {
  const { wishlist, cart, toggleAuthModal } = useAppContext();
  const linkClass = "text-gray-300 hover:text-white transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium";
  const activeLinkClass = "text-white bg-yellow-600 bg-opacity-20";
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="py-4">
      <nav className="flex items-center justify-between">
        <NavLink to="/" className="text-2xl font-bold text-yellow-500 tracking-wider">
          ONLYPETS
        </NavLink>
        <div className="hidden md:flex items-center space-x-2">
          <NavLink to="/" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Home</NavLink>
          <NavLink to="/adoption" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Adoption</NavLink>
          <NavLink to="/services" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Services</NavLink>
          <NavLink to="/products" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Products</NavLink>
          <NavLink to="/contact" className={({ isActive }) => isActive ? `${linkClass} ${activeLinkClass}` : linkClass}>Contact</NavLink>
        </div>
        <div className="flex items-center space-x-4">
          <NavLink to="/wishlist" className="relative text-gray-300 hover:text-white transition-colors duration-300 p-2">
             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-black">{wishlist.length}</span>
            )}
          </NavLink>
           <NavLink to="/cart" className="relative text-gray-300 hover:text-white transition-colors duration-300 p-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {totalCartItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-yellow-500 text-xs font-bold text-black">{totalCartItems}</span>
            )}
          </NavLink>
          <button 
            onClick={() => toggleAuthModal(true)}
            className="border border-yellow-500 text-yellow-500 px-4 py-2 rounded-full text-sm font-semibold hover:bg-yellow-500 hover:text-black transition-all duration-300 whitespace-nowrap"
          >
            Sign In / Sign Up
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Header;