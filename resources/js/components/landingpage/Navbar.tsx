import React, { useState, useEffect, useRef } from 'react';
import {
  User,
  ChevronDown,
  Heart,
  Search,
  Instagram,
  Twitter,
  Smartphone,
  X,
  Settings,
  LogOut,
  LayoutDashboard
} from 'lucide-react';
import { usePage } from '@inertiajs/react';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface PageProps {
  auth: {
    user: User | null;
  };
  recommendedProducts?: any[];
  categoriesWithProducts?: any[];
  [key: string]: any;
}

const NavigationComponent = () => {
  const { auth, recommendedProducts = [], categoriesWithProducts = [] } = usePage<PageProps>().props;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentDateTime, setCurrentDateTime] = useState('');

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [likedItemsModalOpen, setLikedItemsModalOpen] = useState(false);
  const [categoriesHoverOpen, setCategoriesHoverOpen] = useState(false);
  const [recommendationsHoverOpen, setRecommendationsHoverOpen] = useState(false);
  const [qrCodeOpen, setQrCodeOpen] = useState(false);

  const [likedItems] = useState([
    { id: 1, nama_barang: 'Laptop Gaming', harga: 15000000 },
    { id: 2, nama_barang: 'Mouse Wireless', harga: 250000 },
    { id: 3, nama_barang: 'Keyboard Mechanical', harga: 800000 }
  ]);

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const likedItemsRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const recommendationsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      };
      setCurrentDateTime(now.toLocaleString('id-ID', options));
    };

    updateDateTime();
    const interval = setInterval(updateDateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY === 0) {
        setIsVisible(true);
      } else if (currentScrollY < lastScrollY && currentScrollY > 0) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
        setUserDropdownOpen(false);
        setLikedItemsModalOpen(false);
        setCategoriesHoverOpen(false);
        setRecommendationsHoverOpen(false);
        setQrCodeOpen(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (likedItemsRef.current && !likedItemsRef.current.contains(event.target as Node)) {
        setLikedItemsModalOpen(false);
      }
      if (qrCodeRef.current && !qrCodeRef.current.contains(event.target as Node)) {
        setQrCodeOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      window.location.href = `/public/products/search?q=${encodeURIComponent(searchTerm)}`;
    }
  };

  const handleLogout = () => {
    window.location.href = '/logout';
  };

  const getCategoriesDropdownWidth = () => {
    const totalItems = categoriesWithProducts.reduce((total, categoryData) => {
      return total + categoryData.topItems.length;
    }, 0);

    if (totalItems <= 3) return 'w-80';
    if (totalItems <= 6) return 'w-96';
    return 'w-[48rem]';
  };

  const getRecommendationsDropdownWidth = () => {
    const itemCount = recommendedProducts.length;
    if (itemCount <= 3) return 'w-[48rem]';
    if (itemCount <= 6) return 'w-[56rem]';
    return 'w-[72rem]';
  };

  return (
    <>
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <nav className="bg-blue-600 text-white">
          <div className="w-11/12 mx-auto pt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <div
                  className="flex items-center cursor-pointer relative"
                  onClick={() => setQrCodeOpen(!qrCodeOpen)}
                  ref={qrCodeRef}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="font-medium">Download Aplikasi Mobile</span>

                  {qrCodeOpen && (
                    <div className="absolute top-10 left-0 bg-white text-black p-6 rounded-xl shadow-lg w-60 z-50">
                      <div className="text-center">
                        <p className="mb-4">Download E-Katalog Untuk Mobile</p>
                        <div className="w-40 h-40 bg-gray-200 mx-auto rounded flex items-center justify-center">
                          <span className="text-sm text-gray-500">QR Code</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>|</div>

                <div className="flex items-center space-x-2">
                  <span>Ikuti Kami Di</span>
                  <div className="flex space-x-2">
                    <Instagram className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform" />
                    <Twitter className="w-6 h-6 cursor-pointer hover:scale-105 transition-transform" />
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span>{currentDateTime}</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="bg-blue-600 text-white">
          <div className="w-11/12 mx-auto py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-8">
                <div className="flex items-center">
                  <h1 className="text-xl font-bold">PT. Aneka Sarana Teknik</h1>
                </div>
                <div
                  className="relative"
                  ref={categoriesRef}
                  onMouseEnter={() => setCategoriesHoverOpen(true)}
                  onMouseLeave={() => setCategoriesHoverOpen(false)}
                >
                  <button className="px-4 py-2 hover:bg-white hover:text-gray-800 transition-colors rounded">
                    Kategori
                  </button>

                  {categoriesHoverOpen && (
                    <div className={`absolute top-full left-0 mt-4 bg-white text-gray-800 p-6 rounded-b-lg shadow-xl ${getCategoriesDropdownWidth()} z-50`}>
                      {categoriesWithProducts.map((categoryData, index) => (
                        <div key={index} className="mb-6 last:mb-0">
                          <h3 className="text-lg font-bold text-blue-600 mb-2">
                            {categoryData.category.nama_kategori}
                          </h3>
                          <p className="text-sm text-gray-600 mb-4">
                            {categoryData.category.deskripsi}
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {categoryData.topItems.map((item: any) => (
                              <div key={item.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded">
                                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                                  {item.gambar ? (
                                    <img src={`/storage/${item.gambar}`} alt={item.nama_barang} className="w-full h-full object-cover rounded" />
                                  ) : (
                                    <span className="text-xs">IMG</span>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="font-medium truncate">{item.nama_barang}</div>
                                  <div className="text-blue-600 text-sm">
                                    Rp {item.harga_setelah_diskon.toLocaleString('id-ID')}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div
                  className="relative"
                  ref={recommendationsRef}
                  onMouseEnter={() => setRecommendationsHoverOpen(true)}
                  onMouseLeave={() => setRecommendationsHoverOpen(false)}
                >
                  <button className="px-4 py-2 hover:bg-white hover:text-gray-800 transition-colors rounded">
                    Rekomendasi
                  </button>

                  {recommendationsHoverOpen && (
                    <div className={`absolute top-full left-0 mt-4 bg-white text-gray-800 p-6 rounded-b-lg shadow-xl ${getRecommendationsDropdownWidth()} z-50`}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {recommendedProducts.map((item) => (
                          <div key={item.id} className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded">
                            <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                              {item.gambar ? (
                                <img src={`/storage/${item.gambar}`} alt={item.nama_barang} className="w-full h-full object-cover rounded" />
                              ) : (
                                <span className="text-xs">IMG</span>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-medium truncate">{item.nama_barang}</div>
                              <div className="text-sm text-gray-600 truncate">{item.deskripsi}</div>
                              <div className="text-blue-600 text-sm font-bold">
                                Rp {item.harga_setelah_diskon.toLocaleString('id-ID')}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 max-w-md mx-8">
                <div className="relative">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Cari apa yang kamu butuhkan"
                    className="w-full bg-transparent border border-white/30 rounded-md py-2 px-4 text-white placeholder-white/70 focus:outline-none focus:border-white"
                  />
                  <button
                    onClick={handleSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 hover:bg-blue-700 rounded"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative" ref={likedItemsRef}>
                  <button
                    onClick={() => setLikedItemsModalOpen(!likedItemsModalOpen)}
                    className="flex items-center space-x-2 p-2 hover:bg-blue-700 rounded transition-colors"
                  >
                    <Heart className="w-5 h-5" />
                    <span>Item Disukai</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>

                  {likedItemsModalOpen && (
                    <div className="absolute top-full right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg p-4 w-80 z-50">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h2 className="text-lg font-semibold">Item Disukai</h2>
                          <p className="text-sm text-gray-600">Klik item untuk melihat detail</p>
                        </div>
                        <button
                          onClick={() => setLikedItemsModalOpen(false)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-2">
                        {likedItems.length > 0 ? (
                          likedItems.map((item) => (
                            <div key={item.id} className="flex justify-between items-center py-2 px-3 hover:bg-gray-100 rounded">
                              <span>{item.nama_barang}</span>
                              <span className="text-blue-600 font-medium">
                                Rp {item.harga.toLocaleString('id-ID')}
                              </span>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-500 text-center py-4">
                            <p>Tidak ada barang disukai</p>
                            <p className="text-sm">Barang yang anda sukai akan muncul disini</p>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex justify-end">
                        <button
                          onClick={() => setLikedItemsModalOpen(false)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          Tutup
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="relative" ref={userDropdownRef}>
                  {auth.user ? (
                    <>
                      <button
                        onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                        className="flex items-center space-x-2 p-2 hover:bg-blue-700 rounded transition-colors"
                      >
                        <User className="w-5 h-5" />
                        <span>{auth.user.email}</span>
                        <ChevronDown className="w-4 h-4" />
                      </button>

                      {userDropdownOpen && (
                        <div className="absolute top-full right-0 mt-2 bg-white text-gray-800 rounded-lg shadow-lg p-4 w-44 z-50">
                          <div className="space-y-2">
                            {auth.user.role === 'admin' && (
                              <a href="/admin/dashboard" className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-100 rounded">
                                <LayoutDashboard className="w-4 h-4" />
                                <span>Dashboard</span>
                              </a>
                            )}
                            <a href="/settings/profile" className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-100 rounded">
                              <Settings className="w-4 h-4" />
                              <span>Settings Profile</span>
                            </a>
                          </div>
                          <hr className="my-2" />
                          <button
                            onClick={handleLogout}
                            className="flex items-center space-x-2 w-full text-left p-2 hover:bg-gray-100 rounded text-red-600"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <a
                      href="/login"
                      className="flex items-center space-x-2 p-2 hover:bg-blue-700 rounded transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>Anda Belum Login</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavigationComponent;
