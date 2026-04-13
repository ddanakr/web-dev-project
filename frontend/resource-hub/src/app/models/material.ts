export interface Material {
  id: number;
  title: string;
  rating: number;
  subjectId: number;
  downloads?: number;
  url?: string;
  fileName?: string;
  isFavorite?: boolean;
}
