export interface Work {
  id: string;
  entitle?: string;
  createDate?: string;
  createSpan?: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  outline: string;
  title: string;
  eyecatch: Eyecatch;
  category?: Category;
  link?: string;
  github?: string;
  tags?: Tag[];
  galleries?: Gallery[];
  isPublished: boolean;
  points: Point[];
}

export interface Eyecatch {
  url: string;
  width: number;
  height: number;
}

export interface Category {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
}

export interface Tag {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
}

export interface Gallery {
  fieldId: string;
  images: GalleryImage[];
  columnCount: string;
}

export interface GalleryImage {
  url: string;
  width: number;
  height: number;
}

export interface Point {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  headline: string;
  content: string;
}