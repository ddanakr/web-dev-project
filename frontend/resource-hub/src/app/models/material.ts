export interface Material {
  id: number;
  title: string;
  rating: number;
  subjectId: number;
  downloads?: number;
  file?: string;
  created_at?: string;
  owner?: number;
  url?: string | null;
  fileName?: string;
  isFavorite?: boolean;
}
