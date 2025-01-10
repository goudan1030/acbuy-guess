import React, { useState, useEffect } from 'react';
import { Product } from '../types/Product';
import ProductCard from './ProductCard';
import { apiService } from '../services/apiService';

interface FeatureProductSectionProps {
  recommendProducts?: Product[];
}

const FeatureProductSection: React.FC<FeatureProductSectionProps> = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [campaignProducts, setCampaignProducts] = useState<Product[]>([]);
  const [otherProducts, setOtherProducts] = useState<Product[]>([]);
  const [visibleProducts, setVisibleProducts] = useState(12);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // 骨架屏组件
  const SkeletonLoader = () => (
    <div className="animate-pulse space-y-2">
      <div className="bg-gray-200 rounded-lg aspect-square"></div>
      <div className="h-4 bg-gray-200 rounded"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
    </div>
  );

  // 焦点商品骨架屏
  const FocusProductSkeleton = () => (
    <section className="relative p-4 bg-white rounded-lg shadow-md overflow-hidden mx-2">
      <div className="absolute top-0 left-0 w-full flex justify-center items-center"
        style={{
          height: '40px',
          background: 'linear-gradient(180deg, #F97D6B 0%, rgba(249, 125, 107, 0.1) 100%)',
          padding: '0 1rem',
          zIndex: 10,
        }}
      >
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      </div>

      <div className="pt-8 flex flex-col">
        <div className="flex flex-row items-start gap-4 w-full">
          <div className="w-1/2">
            <div className="bg-gray-200 rounded-lg aspect-square"></div>
          </div>
          <div className="w-1/2 space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
        <div className="mt-4 mb-4 h-[63px] bg-gray-200 rounded-full"></div>
      </div>
    </section>
  );

  // 获取商品数据
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await apiService.getProducts();
        const recommendedProducts = await apiService.getRecommendProducts();
        
        const otherProducts = allProducts.filter(
          product => !recommendedProducts.some(rp => rp.id === product.id)
        );

        setCampaignProducts(recommendedProducts);
        setOtherProducts(otherProducts);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const loadMoreProducts = async () => {
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setVisibleProducts(prev => prev + 4);
    setIsLoadingMore(false);
  };

  const currentProduct = campaignProducts[currentIndex];
  const discountedPrice = currentProduct?.current_price || 0;
  const originalPrice = currentProduct?.original_price || discountedPrice;

  if (isLoading) {
    return (
      <>
        <FocusProductSkeleton />
        <section className="mt-8 mx-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="w-full flex justify-center items-center"
              style={{
                height: '40px',
                background: 'linear-gradient(180deg, #F97D6B 0%, rgba(249, 125, 107, 0.1) 100%)',
              }}
            >
              <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                {Array.from({ length: 12 }).map((_, index) => (
                  <SkeletonLoader key={index} />
                ))}
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* 焦点商品部分 */}
      <section className="relative p-4 bg-white rounded-lg shadow-md overflow-hidden mx-2">
        {/* 标题区域 */}
        <div className="absolute top-0 left-0 w-full flex justify-center items-center"
          style={{
            height: '40px',
            background: 'linear-gradient(180deg, #F97D6B 0%, rgba(249, 125, 107, 0.1) 100%)',
            padding: '0 1rem',
            zIndex: 10,
          }}
        >
          <h2 className="font-bold uppercase"
            style={{ 
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontSize: '14px',
              fontVariationSettings: '"opsz" auto',
              color: '#000000',
              textShadow: `
                -1px -1px 0 #FFFFFF,
                1px -1px 0 #FFFFFF,
                -1px 1px 0 #FFFFFF,
                1px 1px 0 #FFFFFF
              `
            }}
          >
            WELLCOME ACBUY
          </h2>
        </div>

        {/* 焦点商品内容 */}
        <div className="pt-8 flex flex-col">
          <div className="flex flex-row items-start gap-4 w-full">
            {/* 左侧图片 */}
            <div className="w-1/2">
              <img
                src={currentProduct?.image_url || '/placeholder-product.png'}
                alt={currentProduct?.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>

            {/* 右侧内容 */}
            <div className="w-1/2 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Here's a pair of shoes that acbuy got for me for 10% off
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-500 font-bold text-xl">¥{discountedPrice}</span>
                  {originalPrice > discountedPrice && (
                    <span className="text-gray-500 line-through text-sm">¥{originalPrice}</span>
                  )}
                </div>

                <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm inline-block">
                  APP New User Exclusive
                </div>
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <button
            className="mt-4 mb-4 w-full text-white font-bold uppercase transition-colors"
            style={{
              height: '63px',
              borderRadius: '227px',
              background: '#FF0000',
              boxShadow: `
                0px 5px 15px 0px rgba(255, 0, 0, 0.35),
                inset 0px -4px 10px 0px rgba(255, 255, 255, 0.6),
                inset 0px 4px 10px 0px rgba(255, 255, 255, 0.6)
              `,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '20px',
              fontWeight: '900',
              letterSpacing: '1px'
            }}
          >
            GET IT IN THE APP
          </button>
        </div>
      </section>

      {/* 猜你喜欢部分 */}
      <section className="mt-8 mx-2">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="w-full flex justify-center items-center"
            style={{
              height: '40px',
              background: 'linear-gradient(180deg, #F97D6B 0%, rgba(249, 125, 107, 0.1) 100%)',
            }}
          >
            <h2 className="font-bold uppercase"
              style={{ 
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontSize: '14px',
                fontVariationSettings: '"opsz" auto',
                color: '#000000',
                textShadow: `
                  -1px -1px 0 #FFFFFF,
                  1px -1px 0 #FFFFFF,
                  -1px 1px 0 #FFFFFF,
                  1px 1px 0 #FFFFFF
                `
              }}
            >
              GUESS YOU LIKE IT
            </h2>
          </div>

          <div className="p-4">
            {/* 移动端：2列，PC端：4列 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {otherProducts.slice(0, visibleProducts).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {visibleProducts < otherProducts.length && (
              <div className="mt-6 text-center">
                <button
                  onClick={loadMoreProducts}
                  disabled={isLoadingMore}
                  className="w-full py-3 bg-gray-100 text-gray-800 font-bold uppercase rounded-md hover:bg-gray-200 transition-colors"
                >
                  {isLoadingMore ? 'Loading...' : 'SHOW MORE PRODUCTS'}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default FeatureProductSection;