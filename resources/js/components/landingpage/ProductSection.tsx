import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Star, ShoppingCart, Heart, Eye } from 'lucide-react';
import { usePage, router } from '@inertiajs/react';
import { useShop } from '@/context/ShopContext';

interface Product {
  id: number;
  nama_barang: string;
  harga_jual: number;
  harga_setelah_diskon: number;
  diskon: number;
  gambar: string;
  deskripsi?: string;
  stok: number;
  kategori: string;
  average_rating?: number;
  feedbacks_count?: number;
  status_rekomendasi?: boolean;
}

interface PageProps {
  recommendedProducts?: Product[];
  categoriesWithProducts?: any[];
  [key: string]: any;
}

const ProductsSection = () => {
  const { recommendedProducts = [], categoriesWithProducts = [] } = usePage<PageProps>().props;
  const [currentSlide, setCurrentSlide] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isFavorite, toggleFavorite, addToCart } = useShop();
  const popularProducts = recommendedProducts.slice(0, 3);

  // Remove the addProductsToCache call since it's no longer available
  useEffect(() => {
    // This effect is no longer needed since we removed the caching system
  }, [recommendedProducts, categoriesWithProducts]);

  const carouselData = [
    {
      title: "Produk Rekomendasi",
      subtitle: "Produk terbaik yang kami rekomendasikan",
      products: recommendedProducts
    },
    ...categoriesWithProducts.map((categoryData: any) => ({
      title: categoryData.category.nama_kategori,
      subtitle: categoryData.category.deskripsi,
      products: categoryData.topItems
    }))
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const animatedElements = entry.target.querySelectorAll('.animate-on-scroll');
            animatedElements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add('opacity-100', 'translate-y-0');
              }, index * 150);
            });
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    return () => observer.disconnect();
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselData.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselData.length) % carouselData.length);
  };

  const getGridClass = (itemCount: number) => {
    if (itemCount === 1) return 'grid-cols-1 max-w-sm mx-auto';
    if (itemCount === 2) return 'grid-cols-2 sm:grid-cols-2 max-w-4xl mx-auto';
    if (itemCount === 3) return 'grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto';
    return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4';
  };

  const ProductCard = ({ product, size = "default" }: { product: Product; size?: string }) => {
    const { isFavorite: isFav, toggleFavorite: toggleFav, addToCart } = useShop();
    const getCardClass = () => {
      switch(size) {
        case "large":
          return "w-full max-w-lg";
        case "medium":
          return "w-full max-w-sm";
        case "small":
          return "w-full max-w-80";
        case "extra-large":
          return "min-w-sm max-w-md";
        default:
          return "w-full max-w-96";
      }
    };

    return (
      <div className={`${getCardClass()} bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group`}>
        <div className="relative overflow-hidden">
          <img
            src={product.gambar ? `/assets/images/${product.gambar}` : "/api/placeholder/300/220"}
            alt={product.nama_barang}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            onClick={() => router.visit(`/public/products/${product.id}`)}
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.status_rekomendasi && (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                ⭐ Rekomendasi
              </div>
            )}
            {product.diskon > 0 && (
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                -{product.diskon}%
              </div>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleFav(product.id);
            }}
            className="absolute top-3 right-3 p-2 bg-white bg-opacity-90 hover:bg-opacity-100 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                isFav(product.id) ? 'text-red-500 fill-current' : 'text-gray-400 hover:text-red-500'
              }`}
            />
          </button>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-bold text-gray-800 mb-3 line-clamp-2 leading-tight cursor-pointer hover:text-blue-600"
            onClick={() => router.visit(`/public/products/${product.id}`)}>
            {product.nama_barang}
          </h3>
          <div className="flex items-center mb-3">
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="ml-1 text-sm font-semibold text-yellow-700">{product.average_rating?.toFixed(1) || '0.0'}</span>
            </div>
            <span className="ml-2 text-sm text-gray-500">({product.feedbacks_count || 0} ulasan)</span>
          </div>
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl font-bold text-blue-600">
                Rp {product.harga_setelah_diskon.toLocaleString('id-ID')}
              </span>
            </div>
            {product.diskon > 0 && (
              <span className="text-sm text-gray-400 line-through">
                Rp {product.harga_jual.toLocaleString('id-ID')}
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                router.visit(`/public/products/${product.id}`);
              }}
              className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4" />
              Lihat
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                addToCart(product, 1);
              }}
              className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-xs text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" />
              Keranjang
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="products" className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen" ref={sectionRef}>
      <div className="min-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-xl p-8 lg:p-12 mb-16 border border-gray-200">
          <div className="text-center mb-12">
            <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000">
              <span className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
                BESTSELLER
              </span>
            </div>
            <h1 className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 font-bold text-4xl lg:text-5xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Produk Terpopuler
            </h1>
            <p className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 text-xl text-gray-600 min-w-full mx-auto">
              Dapatkan produk AC terbaik dengan kualitas premium dan harga terjangkau
            </p>
          </div>
          <div className={`animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 grid ${getGridClass(popularProducts.length)} mb-10`}>
            {popularProducts.map((product) => (
              <div key={product.id} className="flex justify-center">
                <ProductCard product={product} size="extra-large" />
              </div>
            ))}
          </div>
          <div className="flex justify-center mb-8">
            <a href="/public/products" className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-900 hover:to-black text-white text-lg font-bold py-4 px-10 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-xl">
              Lihat Semua Produk →
            </a>
          </div>
        </div>
        {carouselData.length > 0 && (
          <div className="animate-on-scroll opacity-0 translate-y-10 transition-all duration-1000 relative overflow-hidden rounded-2xl shadow-xl">
            <div
              className="flex transition-transform min-w-full duration-700 ease-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {carouselData.map((category, index) => (
                <div key={index} className="min-w-full bg-white">
                  <div className="p-8 lg:p-12">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-10 gap-4">
                      <div>
                        <h1 className="font-bold text-4xl lg:text-5xl text-gray-900 mb-2">
                          {category.title}
                        </h1>
                        <p className="text-xl text-gray-600">{category.subtitle}</p>
                      </div>
                      <a href={`/public/products/category/${encodeURIComponent(category.title)}`} className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg font-semibold py-3 px-8 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg whitespace-nowrap">
                        Telusuri Selengkapnya →
                      </a>
                    </div>
                    <div className={`grid ${getGridClass(category.products.length)} gap-6`}>
                      {category.products.map((product: Product) => (
                        <div key={product.id} className="flex justify-center">
                          <ProductCard product={product} size="default" />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 shadow-xl p-4 rounded-full transition-all duration-300 hover:scale-110 border border-gray-200"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 shadow-xl p-4 rounded-full transition-all duration-300 hover:scale-110 border border-gray-200"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3">
              {carouselData.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-300 shadow-lg ${
                    currentSlide === index
                      ? 'bg-gradient-to-r from-blue-600 to-blue-700 scale-125'
                      : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default ProductsSection;
