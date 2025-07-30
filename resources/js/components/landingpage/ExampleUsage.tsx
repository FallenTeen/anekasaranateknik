import React from 'react';
import { MainNavbar, LikeButton } from './index';

const ExampleUsage: React.FC = () => {
  return (
    <div>
      {/* Include the navbar at the top of your page */}
      <MainNavbar />
      
      {/* Your page content */}
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Example Page</h1>
        
        {/* Example product card with like button */}
        <div className="max-w-sm rounded-lg shadow-lg bg-white p-6">
          <img 
            src="/storage/product-image.jpg" 
            alt="Product" 
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
          <h3 className="text-xl font-semibold mb-2">Product Name</h3>
          <p className="text-gray-600 mb-4">Product description goes here...</p>
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold text-blue-600">Rp 1,500,000</span>
            <LikeButton 
              productId={1} 
              initialLiked={false}
              onLikeChange={(isLiked) => {
                console.log('Product liked:', isLiked);
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExampleUsage; 