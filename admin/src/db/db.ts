import Dexie, { Table } from 'dexie';
import { Page, Navigation, Image, BlogPost, Announcement } from './schemas/cmsSchema';
import { User, Balance, AuditLog, VerificationRequest } from './schemas/userSchema';

export class BinanceDB extends Dexie {
  users!: Table<User>;
  balances!: Table<Balance>;
  auditLogs!: Table<AuditLog>;
  verificationRequests!: Table<VerificationRequest>;
  pages!: Table<Page>;
  navigation!: Table<Navigation>;
  images!: Table<Image>;
  blogPosts!: Table<BlogPost>;
  announcements!: Table<Announcement>;

  constructor() {
    super('binanceDB');
    this.version(6).stores({
      users: '++id, email, role',
      balances: '++id, userId, asset',
      auditLogs: '++id, userId, timestamp',
      verificationRequests: '++id, userId, status',
      pages: '++id, slug, category, status, createdAt',
      navigation: '++id, path, parentId, category',
      images: '++id, pageId, createdAt',
      blogPosts: '++id, slug, status, createdAt, tags',
      announcements: '++id, slug, status, priority, expiresAt'
    });
  }

  async getPageBySlug(slug: string): Promise<Page | undefined> {
    return await this.pages.where('slug').equals(slug).first();
  }

  async getNavigationTree(): Promise<Navigation[]> {
    const items = await this.navigation.orderBy('order').toArray();
    return this.buildNavigationTree(items);
  }

  private buildNavigationTree(items: Navigation[], parentId?: number): Navigation[] {
    return items
      .filter(item => item.parentId === parentId)
      .map(item => ({
        ...item,
        children: this.buildNavigationTree(items, item.id)
      }));
  }

  async updatePageContent(id: number, content: string, userId: number): Promise<void> {
    await this.transaction('rw', this.pages, this.auditLogs, async () => {
      await this.pages.update(id, {
        content,
        updatedAt: new Date()
      });

      await this.auditLogs.add({
        userId,
        action: 'page_update',
        details: `Updated page content (ID: ${id})`,
        timestamp: new Date()
      });
    });
  }
}

export const db = new BinanceDB();