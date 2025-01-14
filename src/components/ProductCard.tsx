import React from 'react';
import { Product } from '../types/Product';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  // 格式化价格函数
  const formatPrice = (price: number | null | undefined) => {
    if (!price || typeof price !== 'number') {
      return "0.00";
    }
    return price.toFixed(2);
  };

  // 确保价格是数字类型
  const price = typeof product.price === 'number' ? product.price : 0;
  const originalPrice = typeof product.original_price === 'number' ? product.original_price : 0;

  // 计算折扣的函数
  const calculateDiscount = (originalPrice: number, price: number) => {
    if (!originalPrice || originalPrice <= price) return null;
    const discount = ((originalPrice - price) / originalPrice) * 100;
    return Math.round(discount);
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden">
      {/* 图片部分 */}
      <div className="aspect-square relative">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* 内容部分 - 移除内边距 */}
      <div>
        <h3 className="text-sm font-medium line-clamp-2 mb-2">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-red-500 font-bold">
            ${formatPrice(price)}
          </span>
          {originalPrice > price && (
            <>
              <span className="text-gray-400 text-sm line-through">
                ${formatPrice(originalPrice)}
              </span>
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                {calculateDiscount(originalPrice, price)}% OFF
              </span>
            </>
          )}
        </div>

        {/* 按钮部分 */}
        <div className="grid grid-cols-2 gap-2">
          <a
            href={product.purchase_link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-red-600 text-white py-2 px-4 rounded-md text-center text-sm font-bold hover:bg-red-700 transition-colors"
          >
            BUY NOW
          </a>
          <a
            href={product.inquiry_link || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-100 text-gray-800 py-2 px-4 rounded-md text-center text-sm font-bold hover:bg-gray-200 transition-colors"
          >
            INQUIRY
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;