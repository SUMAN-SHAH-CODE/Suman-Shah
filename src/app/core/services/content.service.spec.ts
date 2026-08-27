import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ContentService } from './content.service';

describe('ContentService', () => {
  let service: ContentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    localStorage.clear();
    TestBed.configureTestingModule({
      providers: [
        ContentService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(ContentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created and perform initial GET requests to Neon API', () => {
    expect(service).toBeTruthy();

    const blogReq = httpMock.expectOne('http://localhost:3000/api/blogs');
    expect(blogReq.request.method).toBe('GET');
    blogReq.flush([]);

    const projReq = httpMock.expectOne('http://localhost:3000/api/projects');
    expect(projReq.request.method).toBe('GET');
    projReq.flush([]);

    const achReq = httpMock.expectOne('http://localhost:3000/api/achievements');
    expect(achReq.request.method).toBe('GET');
    achReq.flush([]);

    const certReq = httpMock.expectOne('http://localhost:3000/api/certificates');
    expect(certReq.request.method).toBe('GET');
    certReq.flush([]);

    const skillReq = httpMock.expectOne('http://localhost:3000/api/skills');
    expect(skillReq.request.method).toBe('GET');
    skillReq.flush([]);
  });

  it('should mark blog as read and trigger PUT to Neon API', () => {
    const blogs = service.getBlogs();
    const targetBlog = blogs[0];

    // Flush initial GETs
    httpMock.expectOne('http://localhost:3000/api/blogs').flush([]);
    httpMock.expectOne('http://localhost:3000/api/projects').flush([]);
    httpMock.expectOne('http://localhost:3000/api/achievements').flush([]);
    httpMock.expectOne('http://localhost:3000/api/certificates').flush([]);
    httpMock.expectOne('http://localhost:3000/api/skills').flush([]);

    service.markBlogAsRead(targetBlog.id);
    expect(service.isBlogRead(targetBlog.id)).toBeTrue();

    const putReq = httpMock.expectOne(`http://localhost:3000/api/blogs/${targetBlog.id}`);
    expect(putReq.request.method).toBe('PUT');
    putReq.flush({ status: 'success' });
  });

  it('should create, update, and delete a blog post via Neon API', () => {
    // Flush initial GETs
    httpMock.expectOne('http://localhost:3000/api/blogs').flush([]);
    httpMock.expectOne('http://localhost:3000/api/projects').flush([]);
    httpMock.expectOne('http://localhost:3000/api/achievements').flush([]);
    httpMock.expectOne('http://localhost:3000/api/certificates').flush([]);
    httpMock.expectOne('http://localhost:3000/api/skills').flush([]);

    const newBlog = service.addBlog({
      title: 'Test Neon Blog',
      slug: 'test-neon-blog',
      summary: 'Test summary',
      content: 'Test content',
      tags: ['Neon', 'Relational'],
      readTimeMinutes: 3,
      publishedAt: new Date().toISOString(),
      authorName: 'Tester'
    });

    const postReq = httpMock.expectOne('http://localhost:3000/api/blogs');
    expect(postReq.request.method).toBe('POST');
    postReq.flush(newBlog);

    service.updateBlog(newBlog.id, { title: 'Updated Neon Blog' });
    const putReq = httpMock.expectOne(`http://localhost:3000/api/blogs/${newBlog.id}`);
    expect(putReq.request.method).toBe('PUT');
    putReq.flush({ status: 'success' });

    service.deleteBlog(newBlog.id);
    const delReq = httpMock.expectOne(`http://localhost:3000/api/blogs/${newBlog.id}`);
    expect(delReq.request.method).toBe('DELETE');
    delReq.flush({ status: 'success' });
  });
});
