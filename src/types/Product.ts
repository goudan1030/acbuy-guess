export interface Product {
  id: string;
  name: string;
  price: number;
  original_price?: number;
  image_url: string;
  purchase_link?: string;
  inquiry_link?: string;
}