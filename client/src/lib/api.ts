const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
}

function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

async function apiFetch(path: string, options: FetchOptions = {}) {
  const url = `${API_URL}${path}`;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getAuthToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error((error as any).message || `HTTP ${response.status}`);
  }

  return response.json();
}

// Auth
export async function login(username: string, password: string) {
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });
  localStorage.setItem('auth_token', data.accessToken);
  return data;
}

export function logout() {
  localStorage.removeItem('auth_token');
}

export function isAuthenticated(): boolean {
  return !!getAuthToken();
}

// Posts
export async function getPosts(page: number = 1, tag?: string) {
  const params = new URLSearchParams();
  params.append('page', page.toString());
  if (tag) params.append('tag', tag);
  return apiFetch(`/posts?${params.toString()}`);
}

export async function getPostBySlug(slug: string) {
  return apiFetch(`/posts/${slug}`);
}

export async function createPost(data: any) {
  return apiFetch('/posts', { method: 'POST', body: JSON.stringify(data) });
}

export async function updatePost(slug: string, data: any) {
  return apiFetch(`/posts/${slug}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function deletePost(slug: string) {
  return apiFetch(`/posts/${slug}`, { method: 'DELETE' });
}

// Comments
export async function getComments(slug: string) {
  return apiFetch(`/posts/${slug}/comments`);
}

export async function createComment(
  slug: string,
  data: { authorName: string; authorEmail: string; body: string },
) {
  return apiFetch(`/posts/${slug}/comments`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function deleteComment(commentId: number) {
  return apiFetch(`/comments/${commentId}`, { method: 'DELETE' });
}

// Likes
export async function getLikes(slug: string) {
  return apiFetch(`/posts/${slug}/likes`);
}

export async function toggleLike(slug: string) {
  return apiFetch(`/posts/${slug}/likes`, { method: 'POST' });
}
