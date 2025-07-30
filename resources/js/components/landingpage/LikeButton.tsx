import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface LikeButtonProps {
  productId: number;
  initialLiked?: boolean;
  onLikeChange?: (isLiked: boolean) => void;
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  productId, 
  initialLiked = false, 
  onLikeChange,
  className = ""
}) => {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLiked(initialLiked);
  }, [initialLiked]);

  const handleToggleLike = async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const response = await axios.post('/public/products/toggle-favorite', {
        product_id: productId
      });

      if (response.data.success) {
        const newLikedState = response.data.isLiked;
        setIsLiked(newLikedState);
        
        if (onLikeChange) {
          onLikeChange(newLikedState);
        }

        // Show success message
        const message = newLikedState ? 'Ditambahkan ke favorit' : 'Dihapus dari favorit';
        // You can add a toast notification here if you have a toast system
        console.log(message);
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      
      if (error.response?.status === 401) {
        // User not authenticated
        window.location.href = '/login';
      } else {
        // Show error message
        console.error('Terjadi kesalahan sistem');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className={`inline-flex items-center justify-center p-2 rounded-lg transition-all duration-200 ${
        isLiked 
          ? 'text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100' 
          : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
      } ${className}`}
      title={isLiked ? 'Hapus dari favorit' : 'Tambah ke favorit'}
    >
      {isLoading ? (
        <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          fill={isLiked ? "currentColor" : "none"} 
          viewBox="0 0 24 24" 
          strokeWidth="1.5" 
          stroke="currentColor" 
          className="w-5 h-5"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" 
          />
        </svg>
      )}
    </button>
  );
};

export default LikeButton; 