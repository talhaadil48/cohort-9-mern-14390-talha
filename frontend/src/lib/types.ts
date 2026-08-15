export interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string | null;
  created_at: string;
  updated_at: string;
  last_login?: string | null;
  is_active: boolean;
}

export interface Note {
  id: number;
  user_id: number;
  title: string;
  content?: string | null;
  content_rich?: string | null;
  is_archived: boolean;
  is_pinned: boolean;
  color?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}