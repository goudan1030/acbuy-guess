export interface Product {
  id: string;
  name: string;
  original_price: number | null;
  current_price: number;
  image_url: string | null;
  purchase_link: string;
  inquiry_link: string;
  created_at: string;
  is_recommended: boolean; // 新增字段
}