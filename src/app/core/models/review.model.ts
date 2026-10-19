export interface Review {
  id: string;
  authorName: string;
  authorRole: string;
  avatarUrl?: string;
  rating: number;
  date: string;
  comment: string;
  productName: string;
  verifiedPurchase: boolean;
}
