export type SourceType = 'in' | 'out';

export interface Source {
  id: string;
  name: string;
  type: SourceType;
  description?: string;
  createdAt: string;
  updatedAt: string;
  isFixed?: boolean;
}

export interface SourceFormData {
  name: string;
  type: SourceType;
  description?: string;
}

export interface SourceState {
  sources: Source[];
  loading: boolean;
  error: string | null;
} 