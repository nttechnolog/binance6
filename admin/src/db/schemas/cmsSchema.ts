import { Table } from 'dexie';

export interface Page {
  id?: number;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  images: string[];
  category: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
  authorId: number;
  order?: number;
}

export interface Navigation {
  id?: number;
  title: string;
  path: string;
  parentId?: number;
  order: number;
  isVisible: boolean;
  category: string;
}

export interface Image {
  id?: number;
  url: string;
  alt: string;
  title?: string;
  pageId?: number;
  createdAt: Date;
}

export interface BlogPost extends Page {
  excerpt: string;
  tags: string[];
  readTime: number;
}

export interface Announcement extends Page {
  priority: 'low' | 'medium' | 'high';
  expiresAt?: Date;
}