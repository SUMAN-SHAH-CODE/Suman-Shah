export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  coverImage?: string;
  tags: string[];
  readTimeMinutes: number;
  publishedAt: string; // ISO date string
  authorName: string;
  authorPhoto?: string;
  viewsCount?: number;
  featured?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  organization: string;
  date: string;
  description: string;
  badgeUrl?: string;
  category: 'Award' | 'Hackathon' | 'Recognition' | 'Milestone' | string;
  featured?: boolean;
}

export interface Project {
  id: string;
  title: string;
  tagline: string;
  description: string;
  technologies: string[];
  imageUrl?: string;
  demoUrl?: string;
  githubUrl?: string;
  featured?: boolean;
  category: string;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
  badgeUrl?: string;
  skillsCovered: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Cloud/DevOps' | 'Tools' | string;
  proficiency: number; // 0 - 100
  icon?: string;
  featured?: boolean;
}

export interface PortfolioStats {
  projectsCount: number;
  blogsCount: number;
  achievementsCount: number;
  certificatesCount: number;
  skillsCount: number;
}
