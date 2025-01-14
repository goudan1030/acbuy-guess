import { Product } from '../types/Product';
import { supabase } from '../lib/supabaseClient';

// 接口定义
export interface ApiService {
  getProducts(): Promise<Product[]>; // 获取全部商品
  getProductsByCategory(category: string): Promise<Product[]>; // 根据分类获取商品
  getRecommendProducts(): Promise<Product[]>; // 获取推荐商品
  getAppDownloadLinks(): Promise<AppDownloads | null>; // 获取应用下载链接
}

interface AppDownloads {
  ios_app_store: string | null;
  android_google_play: string | null;
  android_direct_download: string | null;
  huawei_app_gallery: string | null;
  xiaomi_app_store: string | null;
  oppo_app_store: string | null;
  vivo_app_store: string | null;
  samsung_galaxy_store: string | null;
}

export const apiService = {
  async getProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('products') // 使用products表
      .select('*');

    if (error) throw error;
    return data;
  },

  async getRecommendProducts(): Promise<Product[]> {
    const { data, error } = await supabase
      .from('campaign_products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('获取推荐商品失败:', error);
      throw error;
    }

    if (!data) {
      return [];
    }

    // 打印获取到的数据，用于调试
    console.log('获取到的推荐商品数据:', data);

    return data;
  },

  async getAppDownloadLinks(): Promise<AppDownloads | null> {
    const { data, error } = await supabase
      .from('app_downloads')
      .select('*')
      .single();

    if (error) {
      console.error('获取应用下载链接失败:', error);
      return null;
    }

    return data;
  }
};