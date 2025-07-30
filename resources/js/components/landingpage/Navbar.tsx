import { usePage } from '@inertiajs/react';
import { ChevronDown, Heart, Instagram, LayoutDashboard, LogOut, Search, Settings, ShoppingCart, Smartphone, Twitter, User, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useShop } from '../../context/ShopContext';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface Product {
    id: number;
    nama_barang: string;
    harga_jual: number;
    harga_setelah_diskon: number;
    diskon: number;
    gambar: string | null;
    deskripsi: string | null;
    average_rating: number;
    feedbacks_count: number;
    status_rekomendasi: boolean;
}

interface PageProps {
    auth: {
        user: User | null;
    };
    recommendedProducts?: Product[];
    categoriesWithProducts?: any[];
    [key: string]: any;
}

const NavigationComponent = () => {
    const { auth, recommendedProducts = [], categoriesWithProducts = [] } = usePage<PageProps>().props;
    const { favorites, isFavorite, favoritesCount, cartCount } = useShop();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentDateTime, setCurrentDateTime] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [userDropdownOpen, setUserDropdownOpen] = useState(false);
    const [likedItemsModalOpen, setLikedItemsModalOpen] = useState(false);
    const [categoriesHoverOpen, setCategoriesHoverOpen] = useState(false);
    const [recommendationsHoverOpen, setRecommendationsHoverOpen] = useState(false);
    const [qrCodeOpen, setQrCodeOpen] = useState(false);
    const userDropdownRef = useRef<HTMLDivElement>(null);
    const likedItemsRef = useRef<HTMLDivElement>(null);
    const qrCodeRef = useRef<HTMLDivElement>(null);
    const categoriesRef = useRef<HTMLDivElement>(null);
    const recommendationsRef = useRef<HTMLDivElement>(null);

    const getLikedProducts = () => {
        const allProducts = [...recommendedProducts, ...categoriesWithProducts.flatMap((categoryData: any) => categoryData.topItems)];

        return allProducts.filter((product) => {
            if (favorites && typeof favorites.has === 'function') {
                return favorites.has(product.id);
            }
            if (Array.isArray(favorites)) {
                return favorites.includes(product.id);
            }
            return false;
        });
    };

    const likedProducts = getLikedProducts();

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
                hour12: true,
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
                className={`fixed top-0 right-0 left-0 z-50 transition-transform duration-300 ease-in-out ${
                    isVisible ? 'translate-y-0' : '-translate-y-full'
                }`}
            >
                <nav className="bg-blue-600 text-white">
                    <div className="mx-auto w-11/12 pt-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                                <div className="relative flex cursor-pointer items-center" onClick={() => setQrCodeOpen(!qrCodeOpen)} ref={qrCodeRef}>
                                    <Smartphone className="h-6 w-6" />
                                    <span className="font-medium">Download Aplikasi Mobile</span>
                                    {qrCodeOpen && (
                                        <div className="absolute top-10 left-0 z-50 w-60 rounded-xl bg-white p-6 text-black shadow-lg">
                                            <div className="text-center">
                                                <p className="mb-4">Download E-Katalog Untuk Mobile</p>
                                                <div className="mx-auto flex h-40 w-40 items-center justify-center rounded bg-gray-200">
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
                                        <Instagram className="h-6 w-6 cursor-pointer transition-transform hover:scale-105" />
                                        <Twitter className="h-6 w-6 cursor-pointer transition-transform hover:scale-105" />
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
                    <div className="mx-auto w-11/12 py-4">
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
                                    <button className="rounded px-4 py-2 transition-colors hover:bg-white hover:text-gray-800">Kategori</button>
                                    {categoriesHoverOpen && (
                                        <div
                                            className={`absolute top-full left-0 mt-4 rounded-b-lg bg-white p-6 text-gray-800 shadow-xl ${getCategoriesDropdownWidth()} z-50`}
                                        >
                                            {categoriesWithProducts.map((categoryData, index) => (
                                                <div key={index} className="mb-6 last:mb-0">
                                                    <h3 className="mb-2 text-lg font-bold text-blue-600">{categoryData.category.nama_kategori}</h3>
                                                    <p className="mb-4 text-sm text-gray-600">{categoryData.category.deskripsi}</p>
                                                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                                                        {categoryData.topItems.map((item) => (
                                                            <div key={item.id} className="flex items-center space-x-3 rounded p-2 hover:bg-gray-50">
                                                                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded bg-gray-100">
                                                                    {item.gambar ? (
                                                                        <img
                                                                            src={`/storage/${item.gambar}`}
                                                                            alt={item.nama_barang}
                                                                            className="h-full w-full rounded object-cover"
                                                                        />
                                                                    ) : (
                                                                        <span className="text-xs">IMG</span>
                                                                    )}
                                                                </div>
                                                                <div className="min-w-0 flex-1">
                                                                    <div className="truncate font-medium">{item.nama_barang}</div>
                                                                    <div className="text-sm text-blue-600">
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
                                    <button className="rounded px-4 py-2 transition-colors hover:bg-white hover:text-gray-800">Rekomendasi</button>
                                    {recommendationsHoverOpen && (
                                        <div
                                            className={`absolute top-full left-0 mt-4 rounded-b-lg bg-white p-6 text-gray-800 shadow-xl ${getRecommendationsDropdownWidth()} z-50`}
                                        >
                                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                                {recommendedProducts.map((item) => (
                                                    <div key={item.id} className="flex items-center space-x-3 rounded p-3 hover:bg-gray-50">
                                                        <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded bg-gray-100">
                                                            {item.gambar ? (
                                                                <img
                                                                    src={`/storage/${item.gambar}`}
                                                                    alt={item.nama_barang}
                                                                    className="h-full w-full rounded object-cover"
                                                                />
                                                            ) : (
                                                                <span className="text-xs">IMG</span>
                                                            )}
                                                        </div>
                                                        <div className="min-w-0 flex-1">
                                                            <div className="truncate font-medium">{item.nama_barang}</div>
                                                            <div className="truncate text-sm text-gray-600">{item.deskripsi}</div>
                                                            <div className="text-sm font-bold text-blue-600">
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
                            <div className="mx-8 max-w-md flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                        placeholder="Cari apa yang kamu butuhkan"
                                        className="w-full rounded-md border border-white/30 bg-transparent px-4 py-2 text-white placeholder-white/70 focus:border-white focus:outline-none"
                                    />
                                    <button
                                        onClick={handleSearch}
                                        className="absolute top-1/2 right-2 -translate-y-1/2 transform rounded p-1 hover:bg-blue-700"
                                    >
                                        <Search className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="flex items-center space-x-4">
                                <div className="relative" ref={likedItemsRef}>
                                    <button
                                        onClick={() => setLikedItemsModalOpen(!likedItemsModalOpen)}
                                        className="flex items-center space-x-2 rounded p-2 transition-colors hover:bg-blue-700"
                                    >
                                        <div className="relative">
                                            <Heart className="h-5 w-5" />
                                            {favoritesCount > 0 && (
                                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                                    {favoritesCount}
                                                </span>
                                            )}
                                        </div>
                                        <span>Item Disukai</span>
                                        <ChevronDown className="h-4 w-4" />
                                    </button>
                                    {likedItemsModalOpen && (
                                        <div className="absolute top-full right-0 z-50 mt-2 w-80 rounded-lg bg-white p-4 text-gray-800 shadow-lg">
                                            <div className="mb-4 flex items-center justify-between">
                                                <div>
                                                    <h2 className="text-lg font-semibold">Item Disukai</h2>
                                                    <p className="text-sm text-gray-600">Klik item untuk melihat detail</p>
                                                </div>
                                                <button onClick={() => setLikedItemsModalOpen(false)} className="text-gray-600 hover:text-gray-800">
                                                    <X className="h-5 w-5" />
                                                </button>
                                            </div>
                                            <div className="max-h-96 space-y-2 overflow-y-auto">
                                                {likedProducts.length > 0 ? (
                                                    likedProducts.map((item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex cursor-pointer items-center justify-between rounded px-3 py-2 hover:bg-gray-100"
                                                            onClick={() => (window.location.href = `/public/products/${item.id}`)}
                                                        >
                                                            <span className="truncate">{item.nama_barang}</span>
                                                            <span className="ml-2 font-medium whitespace-nowrap text-blue-600">
                                                                Rp {item.harga_setelah_diskon.toLocaleString('id-ID')}
                                                            </span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="py-4 text-center text-gray-500">
                                                        <p>Tidak ada barang disukai</p>
                                                        <p className="text-sm">Barang yang anda sukai akan muncul disini</p>
                                                    </div>
                                                )}
                                            </div>
                                            {likedProducts.length > 0 && (
                                                <div className="mt-6 flex justify-end">
                                                    <button
                                                        onClick={() => {
                                                            setLikedItemsModalOpen(false);
                                                            window.location.href = '/public/wishlist';
                                                        }}
                                                        className="rounded bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
                                                    >
                                                        Lihat Semua
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <a href="/public/cart" className="flex items-center space-x-2 rounded p-2 transition-colors hover:bg-blue-700">
                                        <div className="relative">
                                            <ShoppingCart className="h-5 w-5" />
                                            {cartCount > 0 && (
                                                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                                    {cartCount}
                                                </span>
                                            )}
                                        </div>
                                        <span>Keranjang</span>
                                    </a>
                                </div>

                                <div className="relative" ref={userDropdownRef}>
                                    {auth.user ? (
                                        <>
                                            <button
                                                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                                                className="flex items-center space-x-2 rounded p-2 transition-colors hover:bg-blue-700"
                                            >
                                                <User className="h-5 w-5" />
                                                <span>{auth.user.email}</span>
                                                <ChevronDown className="h-4 w-4" />
                                            </button>
                                            {userDropdownOpen && (
                                                <div className="absolute top-full right-0 z-50 mt-2 w-44 rounded-lg bg-white p-4 text-gray-800 shadow-lg">
                                                    <div className="space-y-2">
                                                        {auth.user.role === 'admin' && (
                                                            <a
                                                                href="/admin/dashboard"
                                                                className="flex w-full items-center space-x-2 rounded p-2 text-left hover:bg-gray-100"
                                                            >
                                                                <LayoutDashboard className="h-4 w-4" />
                                                                <span>Dashboard</span>
                                                            </a>
                                                        )}
                                                        <a
                                                            href="/settings/profile"
                                                            className="flex w-full items-center space-x-2 rounded p-2 text-left hover:bg-gray-100"
                                                        >
                                                            <Settings className="h-4 w-4" />
                                                            <span>Settings Profile</span>
                                                        </a>
                                                    </div>
                                                    <hr className="my-2" />
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex w-full items-center space-x-2 rounded p-2 text-left text-red-600 hover:bg-gray-100"
                                                    >
                                                        <LogOut className="h-4 w-4" />
                                                        <span>Sign Out</span>
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <a href="/login" className="flex items-center space-x-2 rounded p-2 transition-colors hover:bg-blue-700">
                                            <User className="h-5 w-5" />
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