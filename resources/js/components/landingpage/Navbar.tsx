import { Link, router } from '@inertiajs/react';
import axios from 'axios';
import { ShoppingCart } from 'lucide-react';
import React, { useEffect, useState, useRef } from 'react';

interface Barang {
    id: number;
    nama_barang: string;
    gambar: string;
    harga_jual: number;
    deskripsi: string;
}

interface CategoryData {
    category: {
        nama_kategori: string;
        deskripsi: string;
    };
    topItems: Barang[];
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

interface NavbarProps {
    likedItems?: Barang[];
    cartCount?: number;
}

const Navbar: React.FC<NavbarProps> = ({ likedItems = [], cartCount = 0 }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [recommendedItems, setRecommendedItems] = useState<Barang[]>([]);
    const [categoriesWithTopItems, setCategoriesWithTopItems] = useState<CategoryData[]>([]);
    const [likedItemsState, setLikedItemsState] = useState<Barang[]>(likedItems);
    const [showLikesDropdown, setShowLikesDropdown] = useState(false);
    const [showCategoriesDropdown, setShowCategoriesDropdown] = useState(false);
    const [showRecommendationsDropdown, setShowRecommendationsDropdown] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [showUserDropdown, setShowUserDropdown] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);

    const categoriesTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const recommendationsTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const likesButtonRef = useRef<HTMLButtonElement>(null);
    const userButtonRef = useRef<HTMLButtonElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY < lastScrollY || currentScrollY < 10) {
                setIsVisible(true);
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                setIsVisible(false);
                setShowLikesDropdown(false);
                setShowCategoriesDropdown(false);
                setShowRecommendationsDropdown(false);
                setShowUserDropdown(false);
            }

            setLastScrollY(currentScrollY);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        updateDateTime();
        const interval = setInterval(updateDateTime, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        fetchNavbarData();
        fetchLikedProducts();
        checkAuth();
    }, []);

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
        const formattedDateTime = now.toLocaleString('id-ID', options);
        const element = document.getElementById('current-date-time');
        if (element) {
            element.textContent = formattedDateTime;
        }
    };

    const fetchNavbarData = async () => {
        try {
            const response = await axios.get('/public/products/navbar');
            if (response.data.recommended) {
                setRecommendedItems(response.data.recommended);
            }
            if (response.data.categories) {
                setCategoriesWithTopItems(response.data.categories);
            }
        } catch (error) {
            console.error('Error fetching navbar data:', error);
            setRecommendedItems([]);
            setCategoriesWithTopItems([]);
        }
    };

    const fetchLikedProducts = async () => {
        try {
            const response = await axios.get('/public/products/liked');
            if (response.data.likedItems) {
                setLikedItemsState(response.data.likedItems);
            }
        } catch (error) {
            console.error('Failed to fetch liked products:', error);
            setLikedItemsState([]);
        }
    };

    const checkAuth = async () => {
        try {
            const response = await axios.get('/user');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        }
    };

    const handleCategoriesMouseEnter = () => {
        if (categoriesTimeoutRef.current) {
            clearTimeout(categoriesTimeoutRef.current);
        }
        setShowCategoriesDropdown(true);
    };

    const handleCategoriesMouseLeave = () => {
        categoriesTimeoutRef.current = setTimeout(() => {
            setShowCategoriesDropdown(false);
        }, 150);
    };

    const handleRecommendationsMouseEnter = () => {
        if (recommendationsTimeoutRef.current) {
            clearTimeout(recommendationsTimeoutRef.current);
        }
        setShowRecommendationsDropdown(true);
    };

    const handleRecommendationsMouseLeave = () => {
        recommendationsTimeoutRef.current = setTimeout(() => {
            setShowRecommendationsDropdown(false);
        }, 150);
    };

    const handleAddToCartAndRedirect = async (item: Barang) => {
        try {
            const response = await axios.post(
                '/public/cart/add',
                {
                    product_id: item.id,
                    quantity: 1,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                },
            );

            if (response.data.success) {
                router.visit('/public/cart');
            } else {
                alert(response.data.error || 'Failed to add to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            alert('An error occurred while adding to cart');
        } finally {
            setShowLikesDropdown(false);
        }
    };

    const handleViewProduct = (item: Barang) => {
        router.visit(`/public/products/${item.id}`);
        setShowLikesDropdown(false);
    };

    const handleSearch = () => {
        if (searchTerm.trim()) {
            router.visit(`/public/products/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    const handleLogout = async () => {
        try {
            await axios.post('/logout');
            router.visit('/');
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    const formatPrice = (price: number) => {
        if (!price || isNaN(price)) return '0';
        return new Intl.NumberFormat('id-ID').format(price);
    };

    const getImageSrc = (gambar: string | null | undefined) => {
        if (!gambar) return '/images/no-image.png';

        if (gambar.startsWith('http://') || gambar.startsWith('https://')) {
            return gambar;
        }

        return `/assets/images/${gambar}`;
    };

    return (
        <div className={`fixed top-0 left-0 z-50 w-full transition-transform duration-300 ${
            isVisible ? 'translate-y-0' : '-translate-y-full'
        }`}>
            <nav id="topper" className="bg-blue-600 antialiased">
                <div id="nav-main" className="relative mx-auto max-w-screen-xl px-4 pt-2 2xl:px-0">
                    <div className="flex justify-between">
                        <div className="flex items-center justify-start space-x-4 text-white">
                            <div id="sosmed" className="font-poppins">
                                Ikuti Kami Di
                            </div>
                            <ul className="flex -translate-y-[2.5px] items-center gap-4">
                                <li>
                                    <a>
                                        <img
                                            src="https://img.icons8.com/?size=100&id=59813&format=png&color=FFFFFF"
                                            alt="Instagram"
                                            className="w-[30px] cursor-pointer duration-150 hover:scale-105"
                                        />
                                    </a>
                                </li>
                                <li>
                                    <a>
                                        <img
                                            src="https://img.icons8.com/?size=100&id=60014&format=png&color=FFFFFF"
                                            alt="Twitter"
                                            className="w-[30px] cursor-pointer duration-150 hover:scale-105"
                                        />
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="items-right cursor-pointer text-white hover:underline">
                            <a className="font-poppins flex items-center gap-2">
                                <div className="translate-y-0.5">
                                    <span id="current-date-time"></span>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </nav>

            <div id="main" className="bg-blue-600 text-white">
                <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
                    <div className="grid grid-cols-12 gap-4 items-center py-4">
                        <div className="col-span-3">
                            <Link href="/" className="flex items-center">
                                <span className="font-poppins text-xl font-bold text-gray-200 duration-200 ease-in hover:scale-105 hover:text-white">
                                    PT. Aneka Sarana Teknik
                                </span>
                            </Link>
                        </div>

                        <div className="col-span-3 flex">
                            <div
                                className="font-poppins relative flex h-12 cursor-pointer items-center px-4 font-semibold hover:bg-white hover:text-gray-800 rounded transition-colors"
                                onMouseEnter={handleCategoriesMouseEnter}
                                onMouseLeave={handleCategoriesMouseLeave}
                            >
                                Kategori
                            </div>

                            <div
                                className="font-poppins relative flex h-12 cursor-pointer items-center px-4 font-semibold hover:bg-white hover:text-gray-800 rounded transition-colors"
                                onMouseEnter={handleRecommendationsMouseEnter}
                                onMouseLeave={handleRecommendationsMouseLeave}
                            >
                                Rekomendasi
                            </div>
                        </div>

                        <div className="col-span-4">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="w-full rounded-md border border-slate-200 bg-transparent py-2 px-3 text-sm text-white shadow-sm transition duration-300 placeholder:text-slate-400 hover:border-slate-300 focus:border-slate-400 focus:shadow focus:outline-none"
                                    placeholder="Cari apa yang kamu butuhkan"
                                />
                                <button
                                    onClick={handleSearch}
                                    className="absolute top-1 right-1 flex items-center rounded border border-transparent px-2.5 py-1 text-center text-sm text-white shadow-sm transition-all hover:bg-blue-700 hover:cursor-pointer active:bg-blue-800"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="mr-1.5 h-4 w-4">
                                        <path
                                            fillRule="evenodd"
                                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Cari
                                </button>
                            </div>
                        </div>

                        <div className="col-span-2 flex items-center justify-end space-x-2">
                            <div className="relative">
                                <button
                                    ref={likesButtonRef}
                                    onClick={() => setShowLikesDropdown(!showLikesDropdown)}
                                    className="relative inline-flex items-center justify-center rounded-lg p-2 text-sm leading-none font-medium text-white hover:scale-105 hover:bg-blue-900 transition-all"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="h-6 w-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                                        />
                                    </svg>
                                    {likedItemsState.length > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                            {likedItemsState.length}
                                        </span>
                                    )}
                                </button>
                            </div>

                            <Link href="/public/cart" className="relative flex items-center space-x-1">
                                {cartCount > 0 && (
                                    <span className="text-white font-semibold">{cartCount}</span>
                                )}
                                <div className="flex items-center justify-center rounded-lg p-2 text-white hover:scale-105 hover:bg-blue-900 transition-all">
                                    <ShoppingCart className="h-6 w-6" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                                            {cartCount}
                                        </span>
                                    )}
                                </div>
                            </Link>

                            <div className="relative">
                                {user ? (
                                    <>
                                        <button
                                            ref={userButtonRef}
                                            onClick={() => setShowUserDropdown(!showUserDropdown)}
                                            className="inline-flex items-center justify-center rounded-lg p-2 text-sm leading-none font-medium text-white hover:scale-105 hover:bg-blue-900 transition-all"
                                        >
                                            <svg
                                                className="me-1 h-5 w-5"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                                />
                                            </svg>
                                            <span className="hidden sm:inline">{user.name}</span>
                                            <svg
                                                className="ms-1 h-4 w-4"
                                                aria-hidden="true"
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="24"
                                                height="24"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                                            </svg>
                                        </button>
                                    </>
                                ) : (
                                    <Link
                                        href="/login"
                                        className="inline-flex items-center justify-center rounded-lg p-2 text-sm leading-none font-medium text-white hover:scale-105 hover:bg-blue-900 transition-all"
                                    >
                                        <svg
                                            className="me-1 h-5 w-5"
                                            aria-hidden="true"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="24"
                                            height="24"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                d="M7 17v1a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1a3 3 0 0 0-3-3h-4a3 3 0 0 0-3 3Zm8-9a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                                            />
                                        </svg>
                                        <span className="hidden sm:inline">Login</span>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Likes Dropdown */}
            {showLikesDropdown && (
                <div className="fixed inset-0 z-40" onClick={() => setShowLikesDropdown(false)}>
                    <div
                        className="absolute z-50 w-96 rounded-lg bg-white shadow-xl border"
                        style={{
                            top: likesButtonRef.current ?
                                likesButtonRef.current.getBoundingClientRect().bottom + window.scrollY + 8 :
                                '100%',
                            right: '1rem'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-4">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h2 className="text-lg font-semibold text-gray-900">Item Disukai</h2>
                                    <p className="text-sm text-gray-600">Klik item untuk melihat detail</p>
                                </div>
                                <button
                                    onClick={() => setShowLikesDropdown(false)}
                                    className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="h-5 w-5"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="max-h-80 overflow-y-auto">
                                {likedItemsState.length > 0 ? (
                                    <div className="space-y-3">
                                        {likedItemsState.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-100">
                                                <div className="w-16 h-16 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden">
                                                    <img
                                                        src={getImageSrc(item.gambar)}
                                                        alt={item.nama_barang}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            const target = e.target as HTMLImageElement;
                                                            target.src = '/images/no-image.png';
                                                        }}
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                                        {item.nama_barang}
                                                    </h3>
                                                    <p className="text-sm text-blue-600 font-semibold">
                                                        Rp. {formatPrice(item.harga_jual)}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col gap-1">
                                                    <button
                                                        onClick={() => handleViewProduct(item)}
                                                        className="px-3 py-1.5 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors whitespace-nowrap"
                                                    >
                                                        Lihat
                                                    </button>
                                                    <button
                                                        onClick={() => handleAddToCartAndRedirect(item)}
                                                        className="px-3 py-1.5 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors whitespace-nowrap"
                                                    >
                                                        + Keranjang
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12 text-gray-500">
                                        <svg
                                            className="mx-auto h-16 w-16 text-gray-300 mb-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                            />
                                        </svg>
                                        <p className="font-medium">Tidak ada barang disukai</p>
                                        <p className="text-sm mt-1">Barang yang anda sukai akan muncul disini</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showUserDropdown && user && (
                <div className="fixed inset-0 z-40" onClick={() => setShowUserDropdown(false)}>
                    <div
                        className="absolute z-50 w-56 rounded-lg bg-white shadow-xl border"
                        style={{
                            top: userButtonRef.current ?
                                userButtonRef.current.getBoundingClientRect().bottom + window.scrollY + 8 :
                                '100%',
                            right: '1rem'
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="p-1">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
                                <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                <span className="inline-block px-2 py-1 mt-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                                    {user.role}
                                </span>
                            </div>

                            <div className="py-1">
                                {user.role === 'admin' && (
                                    <Link
                                        href="/dashboard"
                                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                    >
                                        <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                        </svg>
                                        Dashboard
                                    </Link>
                                )}

                                <Link
                                    href={user.role === 'admin' ? '/profile' : '/profileUser'}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Settings Profile
                                </Link>
                            </div>

                            <div className="pt-1 border-t border-gray-100">
                                <button
                                    onClick={handleLogout}
                                    className="flex w-full items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <svg className="mr-3 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Categories Dropdown */}
            <div
                className={`${showCategoriesDropdown ? 'block' : 'hidden'} absolute top-full left-0 right-0 z-30 bg-white shadow-xl border-t`}
                onMouseEnter={handleCategoriesMouseEnter}
                onMouseLeave={handleCategoriesMouseLeave}
            >
                <div className="mx-auto max-w-screen-xl px-6 py-8">
                    {categoriesWithTopItems.map(
                        (categoryData, index) =>
                            categoryData.topItems &&
                            categoryData.topItems.length > 0 && (
                                <div key={index} className="mb-10 last:mb-0">
                                    <div className="flex gap-8">
                                        <div className="w-1/4 flex justify-center items-center">
                                            <div className="text-center">
                                                <h3 className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-2xl font-bold text-transparent mb-3">
                                                    {categoryData.category.nama_kategori}
                                                </h3>
                                                <p className="text-sm text-gray-600 max-w-[220px] leading-relaxed">
                                                    {categoryData.category.deskripsi}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="w-3/4 grid grid-cols-3 gap-4">
                                            {categoryData.topItems.map((barang) => (
                                                <Link
                                                    key={barang.id}
                                                    href={`/public/products/${barang.id}`}
                                                    className="group rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-gray-100"
                                                >
                                                    <div className="flex gap-4 p-4">
                                                        <div className="w-20 h-20 flex-shrink-0 rounded-lg bg-gray-50 overflow-hidden">
                                                            <img
                                                                src={getImageSrc(barang.gambar)}
                                                                alt={barang.nama_barang}
                                                                loading="lazy"
                                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                                                onError={(e) => {
                                                                    const target = e.target as HTMLImageElement;
                                                                    target.src = '/images/no-image.png';
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-tight">
                                                                {barang.nama_barang}
                                                            </h4>
                                                            <p className="text-sm font-bold text-blue-600">
                                                                Rp {formatPrice(barang.harga_jual)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ),
                    )}
                </div>
            </div>

            <div
                className={`${showRecommendationsDropdown ? 'block' : 'hidden'} absolute top-full left-0 right-0 z-30 bg-white shadow-xl border-t`}
                onMouseEnter={handleRecommendationsMouseEnter}
                onMouseLeave={handleRecommendationsMouseLeave}
            >
                <div className="mx-auto max-w-screen-xl px-6 py-8">
                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Produk Rekomendasi</h2>
                        <p className="text-gray-600">Produk pilihan terbaik untuk kebutuhan Anda</p>
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {recommendedItems.map((barang) => (
                            <Link
                                key={barang.id}
                                href={`/public/products/${barang.id}`}
                                className="group rounded-xl bg-white shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-gray-100"
                            >
                                <div className="p-4">
                                    <div className="w-full h-32 rounded-lg bg-gray-50 overflow-hidden mb-3">
                                        <img
                                            src={getImageSrc(barang.gambar)}
                                            alt={barang.nama_barang}
                                            loading="lazy"
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                target.src = '/images/no-image.png';
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 leading-tight min-h-[2.5rem]">
                                            {barang.nama_barang}
                                        </h4>
                                        <p className="text-xs text-gray-600 line-clamp-2 mb-2 leading-relaxed">
                                            {barang.deskripsi}
                                        </p>
                                        <p className="text-sm font-bold text-blue-600">
                                            Rp {formatPrice(barang.harga_jual)}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
