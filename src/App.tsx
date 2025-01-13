import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import FeatureProductSection from './components/FeatureProductSection';
import { Product } from './types/Product';
import { apiService } from './services/apiService';

function App() {
  const [recommendProducts, setRecommendProducts] = useState<Product[]>([]);

  // 获取推荐商品
  useEffect(() => {
    const fetchRecommendProducts = async () => {
      try {
        const data = await apiService.getRecommendProducts();
        setRecommendProducts(data);
      } catch (error) {
        console.error('获取推荐商品失败:', error);
      }
    };

    fetchRecommendProducts();
  }, []);

  return (
    <div className="min-h-screen bg-transparent">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Header />
                <div 
                  className="mx-auto container-gradient mt-4" 
                  style={{ 
                    maxWidth: '1200px', 
                    padding: '0 0px',
                    marginTop: '20px'
                  }}
                >
                  <FeatureProductSection />
                </div>
                <div className="py-8"></div>
              </>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;