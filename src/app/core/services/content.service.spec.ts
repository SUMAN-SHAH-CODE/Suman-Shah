import { TestBed } from '@angular/core/testing';
import { ContentService } from './content.service';

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [ContentService]
    });
    service = TestBed.inject(ContentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return default initial blogs and stats', () => {
    const blogs = service.getBlogs();
    expect(blogs.length).toBeGreaterThan(0);

    const stats = service.getStats();
    expect(stats.blogsCount).toBe(blogs.length);
    expect(stats.projectsCount).toBeGreaterThan(0);
  });

  it('should mark blog as read and persist read status', () => {
    const blogs = service.getBlogs();
    const targetBlog = blogs[0];

    expect(service.isBlogRead(targetBlog.id)).toBeFalse();

    service.markBlogAsRead(targetBlog.id);

    expect(service.isBlogRead(targetBlog.id)).toBeTrue();
  });

  it('should create, update, and delete a blog post', () => {
    const initialCount = service.getBlogs().length;

    const newBlog = service.addBlog({
      title: 'Test Unit Blog',
      slug: 'test-unit-blog',
      summary: 'Test summary',
      content: 'Test content',
      tags: ['Test'],
      readTimeMinutes: 3,
      publishedAt: new Date().toISOString(),
      authorName: 'Tester'
    });

    expect(service.getBlogs().length).toBe(initialCount + 1);

    service.updateBlog(newBlog.id, { title: 'Updated Unit Blog' });
    const updated = service.getBlogById(newBlog.id);
    expect(updated?.title).toBe('Updated Unit Blog');

    service.deleteBlog(newBlog.id);
    expect(service.getBlogs().length).toBe(initialCount);
  });
});
