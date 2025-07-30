import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import axios from 'axios';

interface CartItem {
  id: number;
  jumlah: number;
  barang: {
    id: number;
    nama_barang: string;
    gambar: string;
    harga_jual: number;
  };
}

interface CartDropdownProps {
  cartCount?: number;
}

const CartDropdown: React.FC<CartDropdownProps> = ({ cartCount = 0 }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [currentCartCount, setCurrentCartCount] = useState(cartCount);

  useEffect(() => {
    updateCart();
  }, []);

  const updateCart = async () => {
    try {
      const response = await axios.get('/public/cart/count');
      setCurrentCartCount(response.data.count || 0);
      
      if (response.data.count > 0) {
        const cartResponse = await axios.get('/public/cart');
        setCartItems(cartResponse.data.items || []);
      }
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete('/public/cart/clear');
      setCartItems([]);
      setCurrentCartCount(0);
      setShowDropdown(false);
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID').format(price);
  };

  return (
    <div className="relative">
      <button 
        id="cartDropdownButton" 
        type="button"
        onClick={() => setShowDropdown(!showDropdown)}
        className="inline-flex items-center rounded-lg justify-center p-2 hover:duration-300 hover:scale-105 hover:bg-blue-900 dark:hover:bg-maincolordark text-sm font-medium leading-none text-white dark:text-gray-100"
      >
        <span className="sr-only">Cart</span>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
        </svg>
        <span className="sm:flex px-2">Keranjang</span>
        {currentCartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {currentCartCount}
          </span>
        )}
        <svg className="hidden sm:flex w-4 h-4 text-white dark:text-gray-100 ms-1" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
        </svg>
      </button>

      <div className={`${showDropdown ? '' : 'hidden'} absolute z-30 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 top-20 right-0 w-80`}>
        <div className="flex justify-between items-center px-2">
          <div className="grid">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Keranjang Belanja</h2>
            <h3 className="text-sm text-gray-900 dark:text-gray-100">Total: {currentCartCount} item</h3>
          </div>
          <button 
            id="closeCartButton"
            onClick={() => setShowDropdown(false)}
            className="text-gray-600 dark:text-gray-100 hover:text-gray-900 dark:hover:text-gray-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {currentCartCount > 0 ? (
          <>
            <div className="mt-4 max-h-64 overflow-y-auto">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-2 border-b border-gray-200 dark:border-gray-600">
                  <img 
                    src={`/storage/${item.barang.gambar}`} 
                    alt={item.barang.nama_barang} 
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {item.barang.nama_barang}
                    </h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Qty: {item.jumlah} x Rp {formatPrice(item.barang.harga_jual)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <Link 
                href="/public/cart" 
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
              >
                Lihat Keranjang
              </Link>
              <button 
                onClick={clearCart} 
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm"
              >
                Kosongkan
              </button>
            </div>
          </>
        ) : (
          <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
            <p>Keranjang belanja kosong</p>
            <p className="text-xs">Tambahkan produk ke keranjang</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDropdown; 