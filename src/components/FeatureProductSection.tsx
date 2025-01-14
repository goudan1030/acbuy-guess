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
  const [appDownloadLink, setAppDownloadLink] = useState<string | null>(null);

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
        const recommendedProducts = await apiService.getRecommendProducts();
        console.log('获取到的推荐商品:', recommendedProducts);
        
        setCampaignProducts(recommendedProducts);
        setOtherProducts(recommendedProducts);
        setIsLoading(false);
      } catch (error) {
        console.error('获取商品失败:', error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // 获取应用下载链接
  useEffect(() => {
    const fetchAppDownloadLink = async () => {
      const links = await apiService.getAppDownloadLinks();
      if (links) {
        // 根据用户设备选择合适的下载链接
        const userAgent = navigator.userAgent.toLowerCase();
        let downloadLink = null;

        if (/iphone|ipad|ipod/.test(userAgent)) {
          downloadLink = links.ios_app_store;
        } else if (/android/.test(userAgent)) {
          if (/huawei/.test(userAgent)) {
            downloadLink = links.huawei_app_gallery;
          } else if (/xiaomi/.test(userAgent)) {
            downloadLink = links.xiaomi_app_store;
          } else if (/oppo/.test(userAgent)) {
            downloadLink = links.oppo_app_store;
          } else if (/vivo/.test(userAgent)) {
            downloadLink = links.vivo_app_store;
          } else if (/samsung/.test(userAgent)) {
            downloadLink = links.samsung_galaxy_store;
          } else {
            downloadLink = links.android_google_play || links.android_direct_download;
          }
        }

        setAppDownloadLink(downloadLink);
      }
    };

    fetchAppDownloadLink();
  }, []);

  const loadMoreProducts = async () => {
    setIsLoadingMore(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    setVisibleProducts(prev => prev + 4);
    setIsLoadingMore(false);
  };

  const currentProduct = campaignProducts[currentIndex];
  const price = typeof currentProduct?.price === 'number' ? currentProduct.price : 0;
  const originalPrice = typeof currentProduct?.original_price === 'number' ? currentProduct.original_price : 0;

  // 格式化价格函数
  const formatPrice = (price: number | null | undefined) => {
    if (!price || typeof price !== 'number') {
      return "0.00";
    }
    return price.toFixed(2);
  };

  // 计算折扣的函数
  const calculateDiscount = (originalPrice: number, price: number) => {
    if (!originalPrice || originalPrice <= price) return null;
    const discount = ((originalPrice - price) / originalPrice) * 100;
    return Math.round(discount);
  };

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
            <div className="w-2/5">
              <img
                src={currentProduct?.image_url || '/placeholder-product.png'}
                alt={currentProduct?.name}
                className="w-full h-auto object-cover rounded-lg"
              />
            </div>

            {/* 右侧内容 */}
            <div className="w-3/5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  {currentProduct?.name || "Here's a pair of shoes that acbuy got for me for 10% off"}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-red-500 font-bold text-xl">
                    ${formatPrice(price)}
                  </span>
                  {originalPrice > price && (
                    <>
                      <span className="text-gray-500 line-through text-sm">
                        ${formatPrice(originalPrice)}
                      </span>
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
                        {calculateDiscount(originalPrice, price)}% OFF
                      </span>
                    </>
                  )}
                </div>

                <div className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm inline-block">
                  APP New User Exclusive
                </div>
              </div>
            </div>
          </div>

          {/* 底部按钮区域 */}
          <div className="mt-4 mb-4">
            {/* 购买按钮 */}
            <a
              href={appDownloadLink || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full text-white font-bold uppercase transition-colors"
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
            </a>
          </div>
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
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {campaignProducts.slice(0, visibleProducts).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {visibleProducts < campaignProducts.length && (
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

      {/* Discord 区域 */}
      <section className="mt-8 mx-2 mb-24">
        <div 
          className="p-6 flex flex-col items-center"
          style={{
            borderRadius: '20px',
            background: '#FF352C',
            boxShadow: '0px 4px 10px 0px #FF2626',
            opacity: 1
          }}
        >
          {/* 标题 - 更新样式 */}
          <h2 
            className="mb-6 text-center uppercase"
            style={{
              fontFamily: 'Montserrat',
              fontSize: '24px',
              fontWeight: 900,
              lineHeight: 'normal',
              letterSpacing: '0em',
              fontVariationSettings: '"opsz" auto',
              fontFeatureSettings: '"kern" on',
              color: '#FFFFFF'
            }}
          >
            Join to discord
          </h2>

          {/* 二维码 */}
          <div className="bg-white p-4 rounded-lg mb-6">
            <img 
              src="/discord-qr.png" 
              alt="Discord QR Code" 
              className="w-48 h-48 object-contain"
            />
          </div>

          {/* 内容说明 */}
          <div className="text-white text-center">
            <p 
              style={{
                fontFamily: 'Montserrat',
                fontSize: '16px',
                fontWeight: 600,
                lineHeight: 'normal',
                letterSpacing: '0em',
                fontVariationSettings: '"opsz" auto',
                fontFeatureSettings: '"kern" on',
                color: '#FFFFFF'
              }}
            >
              Get more great recommendations from bloggers
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default FeatureProductSection;