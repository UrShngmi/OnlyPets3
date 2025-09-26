import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Pet, Service, WishlistItem, Toast, ToastType, Product, CartItem, Booking } from '../types';
import { generatePetsData } from '../services/geminiService';
import { getPetImages, getServiceImage } from '../utils/imageUtils';

interface AppContextType {
  pets: Pet[];
  services: Service[];
  wishlist: WishlistItem[];
  cart: CartItem[];
  bookings: Booking[];
  isAuthModalOpen: boolean;
  toasts: Toast[];
  loading: boolean;
  error: string | null;
  toggleWishlist: (item: WishlistItem) => void;
  toggleAuthModal: (isOpen: boolean) => void;
  addToast: (message: string, type?: ToastType) => void;
  removeToast: (id: number) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, newQuantity: number) => void;
  clearCart: () => void;
  addBooking: (booking: Booking) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isAuthModalOpen, setAuthModalOpen] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const petsData = await generatePetsData();

        if (petsData.length === 0) {
            setError('Could not fetch pet data. Please check if your API key is configured correctly.');
        }

        const petsWithImages: Pet[] = petsData.map(p => ({
            ...p,
            imageUrls: getPetImages(p),
        }));
        setPets(petsWithImages);
        
        // Fix: Refactored service data initialization to be type-safe.
        // First, define the service data without the imageUrl.
        const servicesData: Omit<Service, 'imageUrl'>[] = [
          {
            id: 'service_01',
            name: 'Full Grooming Package',
            description: 'A complete pampering session for your pet. Includes a bath, haircut, nail trim, and ear cleaning to keep them looking and feeling their best.',
            price: 1500.00,
            duration: 120,
            activities: ['Warm bath with premium shampoo', 'Professional haircut and styling', 'Nail trimming and filing', 'Gentle ear cleaning', 'Teeth brushing', 'Anal gland expression'],
            notes: 'Please inform us of any skin conditions or allergies beforehand.'
          },
          {
            id: 'service_02',
            name: 'Annual Health Checkup',
            description: 'A comprehensive veterinary examination to monitor your pet\'s health. Includes vaccinations, parasite check, and a full physical.',
            price: 2500.00,
            duration: 45,
            activities: ['Full physical examination', 'Core vaccinations update', 'Heartworm and parasite testing', 'Nutritional consultation', 'Blood work panel'],
            notes: 'Please bring any previous medical records if this is your first visit.'
          },
          {
            id: 'service_03',
            name: 'Basic Obedience Training',
            description: 'A 4-week group course covering essential commands like sit, stay, come, and leash manners. Perfect for new puppies or adopted dogs.',
            price: 8000.00,
            duration: 60,
            activities: ['Positive reinforcement techniques', 'Basic command training (sit, stay, come)', 'Leash walking skills', 'Socialization with other dogs', 'Handler coaching session'],
            notes: 'This is a 4-week course, meeting once per week. The price covers the full course.'
          },
          {
            id: 'service_04',
            name: 'Pet Sitting (Per Day)',
            description: 'Peace of mind while you\'re away. We provide a safe, fun, and comfortable environment for your pet at our facility.',
            price: 1000.00,
            duration: 1440,
            activities: ['Two long walks per day', 'Supervised group playtime', 'Regular feeding schedule', 'Cozy overnight accommodation', 'Daily photo updates'],
            notes: 'Food is provided, but you are welcome to bring your pet\'s own food.'
          },
          {
            id: 'service_05',
            name: 'Dog Walking (30 min)',
            description: 'A refreshing 30-minute walk for your dog to get exercise and a potty break during the day. Perfect for busy owners.',
            price: 500.00,
            duration: 30,
            activities: ['Brisk 30-minute walk', 'Water break', 'Post-walk paw wipe-down', 'A photo update sent to you', 'Basic leash manners reinforcement'],
            notes: 'Available within a 5-mile radius of our facility.'
          }
        ];

        // Then, map over the data to create the full Service objects with imageUrls.
        // This ensures the correct object type is passed to getServiceImage.
        const detailedServices: Service[] = servicesData.map(service => ({
            ...service,
            imageUrl: getServiceImage(service),
        }));

        setServices(detailedServices);
        
        // Simulate some pre-existing bookings for conflict detection
        const today = new Date();
        const conflictDate = new Date(today.setDate(today.getDate() + 5)).toISOString().split('T')[0];
        setBookings([{ serviceId: 'service_01', date: conflictDate, timeSlot: 'morning' }]);

      } catch (err) {
        setError('An error occurred while fetching initial data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const toggleWishlist = (item: WishlistItem) => {
    setWishlist(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) {
        return prev.filter(i => i.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const toggleAuthModal = (isOpen: boolean) => {
    setAuthModalOpen(isOpen);
  };
  
  const addToast = (message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
  };

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const addToCart = (product: Product) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(prevCart =>
        prevCart.map(item =>
          item.id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };
  
  const clearCart = () => {
    setCart([]);
  };

  const addBooking = (newBooking: Booking) => {
    setBookings(prev => [...prev, newBooking]);
    // Toast is now shown on the confirmation page, so this is redundant
    // addToast('Booking confirmed successfully!', 'success');
  };

  return (
    <AppContext.Provider value={{
      pets,
      services,
      wishlist,
      cart,
      bookings,
      isAuthModalOpen,
      toasts,
      loading,
      error,
      toggleWishlist,
      toggleAuthModal,
      addToast,
      removeToast,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      addBooking,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};