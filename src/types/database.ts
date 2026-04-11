// Supabase DB 타입 정의
// generate: npx supabase gen types typescript --project-id uobbgxwuukwptqtywxxj

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          subscription_tier: string
          subscription_expires_at: string | null
          storage_used_bytes: number
          is_2fa_enabled: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          subscription_tier?: string
          subscription_expires_at?: string | null
          storage_used_bytes?: number
          is_2fa_enabled?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          subscription_tier?: string
          subscription_expires_at?: string | null
          storage_used_bytes?: number
          is_2fa_enabled?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      entries: {
        Row: {
          id: string
          user_id: string
          journal_type: string
          title: string | null
          content: Json | null
          content_text: string | null
          mood: string | null
          is_favorite: boolean
          is_encrypted: boolean
          recipient_id: string | null
          location_lat: number | null
          location_lng: number | null
          location_name: string | null
          weather: string | null
          temperature: number | null
          created_at: string
          updated_at: string
          published_at: string | null
          scheduled_send_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          journal_type?: string
          title?: string | null
          content?: Json | null
          content_text?: string | null
          mood?: string | null
          is_favorite?: boolean
          is_encrypted?: boolean
          recipient_id?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          weather?: string | null
          temperature?: number | null
          created_at?: string
          updated_at?: string
          published_at?: string | null
          scheduled_send_at?: string | null
        }
        Update: {
          journal_type?: string
          title?: string | null
          content?: Json | null
          content_text?: string | null
          mood?: string | null
          is_favorite?: boolean
          is_encrypted?: boolean
          recipient_id?: string | null
          location_lat?: number | null
          location_lng?: number | null
          location_name?: string | null
          weather?: string | null
          temperature?: number | null
          scheduled_send_at?: string | null
          updated_at?: string
          published_at?: string | null
        }
        Relationships: []
      }
      media: {
        Row: {
          id: string
          entry_id: string
          user_id: string
          media_type: string
          storage_path: string
          thumbnail_path: string | null
          file_size: number | null
          duration_seconds: number | null
          width: number | null
          height: number | null
          created_at: string
        }
        Insert: {
          id?: string
          entry_id: string
          user_id: string
          media_type: string
          storage_path: string
          thumbnail_path?: string | null
          file_size?: number | null
          duration_seconds?: number | null
          width?: number | null
          height?: number | null
          created_at?: string
        }
        Update: {
          thumbnail_path?: string | null
          file_size?: number | null
        }
        Relationships: []
      }
      secret_codes: {
        Row: {
          id: string
          user_id: string
          category: string
          title: string
          importance: string
          encrypted_content: string
          encrypted_credentials: Json | null
          sort_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          category: string
          title: string
          importance?: string
          encrypted_content: string
          encrypted_credentials?: Json | null
          sort_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          category?: string
          title?: string
          importance?: string
          encrypted_content?: string
          encrypted_credentials?: Json | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      family_members: {
        Row: {
          id: string
          owner_id: string
          linked_user_id: string | null
          role: string
          name: string
          phone: string | null
          email: string | null
          is_verified: boolean
          verification_token: string | null
          badge_color: string | null
          sss_share: string | null
          access_permissions: Json
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          linked_user_id?: string | null
          role: string
          name: string
          phone?: string | null
          email?: string | null
          is_verified?: boolean
          verification_token?: string | null
          badge_color?: string | null
          sss_share?: string | null
          access_permissions?: Json
          created_at?: string
        }
        Update: {
          linked_user_id?: string | null
          role?: string
          name?: string
          phone?: string | null
          email?: string | null
          is_verified?: boolean
          verification_token?: string | null
          badge_color?: string | null
          sss_share?: string | null
          access_permissions?: Json
        }
        Relationships: []
      }
      legacy_settings: {
        Row: {
          id: string
          user_id: string
          scheduled_date: string | null
          is_active: boolean
          activated_at: string | null
          activation_document_url: string | null
          sss_threshold: number
          sss_total: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          scheduled_date?: string | null
          is_active?: boolean
          activated_at?: string | null
          activation_document_url?: string | null
          sss_threshold?: number
          sss_total?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          scheduled_date?: string | null
          is_active?: boolean
          activated_at?: string | null
          activation_document_url?: string | null
          sss_threshold?: number
          sss_total?: number
          updated_at?: string
        }
        Relationships: []
      }
      legacy_requests: {
        Row: {
          id: string
          owner_id: string
          requester_family_id: string
          status: string
          document_url: string | null
          admin_note: string | null
          reviewed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          requester_family_id: string
          status?: string
          document_url?: string | null
          admin_note?: string | null
          reviewed_at?: string | null
          created_at?: string
        }
        Update: {
          status?: string
          document_url?: string | null
          admin_note?: string | null
          reviewed_at?: string | null
        }
        Relationships: []
      }
      publish_orders: {
        Row: {
          id: string
          user_id: string
          publish_type: string
          status: string
          page_count: number | null
          preview_data: Json | null
          payment_id: string | null
          amount: number | null
          shipping_address: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          publish_type: string
          status?: string
          page_count?: number | null
          preview_data?: Json | null
          payment_id?: string | null
          amount?: number | null
          shipping_address?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          publish_type?: string
          status?: string
          page_count?: number | null
          preview_data?: Json | null
          payment_id?: string | null
          amount?: number | null
          shipping_address?: Json | null
          updated_at?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          id: string
          user_id: string
          name: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
        }
        Update: {
          name?: string
        }
        Relationships: []
      }
      entry_tags: {
        Row: {
          entry_id: string
          tag_id: string
        }
        Insert: {
          entry_id: string
          tag_id: string
        }
        Update: Record<string, never>
        Relationships: []
      }
      album_photos: {
        Row: {
          id: string
          user_id: string
          storage_path: string
          caption: string | null
          taken_at: string | null
          file_size: number | null
          width: number | null
          height: number | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          storage_path: string
          caption?: string | null
          taken_at?: string | null
          file_size?: number | null
          width?: number | null
          height?: number | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          caption?: string | null
          taken_at?: string | null
          sort_order?: number
        }
        Relationships: []
      }
      // Phase 6 — DB 마이그레이션 적용 후 gen types로 동기화 권장
      mystory_sessions: {
        Row: {
          id: string
          user_id: string
          topic_id: string
          topic_category: string
          status: string
          messages: Json
          generated_text: string | null
          word_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          topic_id: string
          topic_category: string
          status?: string
          messages?: Json
          generated_text?: string | null
          word_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          topic_id?: string
          topic_category?: string
          status?: string
          messages?: Json
          generated_text?: string | null
          word_count?: number
          updated_at?: string
        }
        Relationships: []
      }
      memorial_pages: {
        Row: {
          id: string
          owner_id: string
          slug: string
          title: string
          bio: string | null
          cover_image: string | null
          is_public: boolean
          birth_date: string | null
          death_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          slug: string
          title?: string
          bio?: string | null
          cover_image?: string | null
          is_public?: boolean
          birth_date?: string | null
          death_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          slug?: string
          title?: string
          bio?: string | null
          cover_image?: string | null
          is_public?: boolean
          birth_date?: string | null
          death_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      memorial_messages: {
        Row: {
          id: string
          memorial_id: string
          author_name: string
          content: string
          relation: string | null
          is_approved: boolean
          created_at: string
        }
        Insert: {
          id?: string
          memorial_id: string
          author_name: string
          content: string
          relation?: string | null
          is_approved?: boolean
          created_at?: string
        }
        Update: {
          author_name?: string
          content?: string
          relation?: string | null
          is_approved?: boolean
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

// 편의 타입 별칭
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Entry = Database['public']['Tables']['entries']['Row']
export type Media = Database['public']['Tables']['media']['Row']
export type SecretCode = Database['public']['Tables']['secret_codes']['Row']
export type FamilyMember = Database['public']['Tables']['family_members']['Row']
export type LegacySettings = Database['public']['Tables']['legacy_settings']['Row']
export type LegacyRequest = Database['public']['Tables']['legacy_requests']['Row']
export type PublishOrder = Database['public']['Tables']['publish_orders']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type AlbumPhoto = Database['public']['Tables']['album_photos']['Row']

// Phase 6 타입 (DB 외부 정의 — Supabase 타입 자동생성 전 임시)
export interface MystorySession {
  id: string
  user_id: string
  topic_id: string
  topic_category: string
  status: 'in_progress' | 'completed' | 'published'
  messages: MystoryMessage[]
  generated_text: string | null
  word_count: number
  share_token: string | null
  created_at: string
  updated_at: string
}

export interface MystoryMessage {
  role: 'assistant' | 'user'
  content: string
  ts: string
  photo_url?: string // 사진 첨부 URL (optional)
}

export interface MemorialPage {
  id: string
  owner_id: string
  slug: string
  title: string
  bio: string | null
  cover_image: string | null
  is_public: boolean
  birth_date: string | null
  death_date: string | null
  created_at: string
  updated_at: string
}

export interface MemorialMessage {
  id: string
  memorial_id: string
  author_name: string
  content: string
  relation: string | null
  is_approved: boolean
  created_at: string
}

// Insert 타입
export type ProfileInsert = Database['public']['Tables']['profiles']['Insert']
export type EntryInsert = Database['public']['Tables']['entries']['Insert']
export type SecretCodeInsert = Database['public']['Tables']['secret_codes']['Insert']
export type FamilyMemberInsert = Database['public']['Tables']['family_members']['Insert']

// Update 타입
export type EntryUpdate = Database['public']['Tables']['entries']['Update']
export type SecretCodeUpdate = Database['public']['Tables']['secret_codes']['Update']
export type FamilyMemberUpdate = Database['public']['Tables']['family_members']['Update']

// 도메인 타입
export type JournalType = 'diary' | 'dear' | 'secret_note'
export type FamilyRole = 'spouse' | 'son' | 'daughter' | 'parent' | 'lawyer' | 'other'
export type SecretCategory = 'finance' | 'real_estate' | 'legal' | 'crypto' | 'business' | 'other'
export type Importance = 'important' | 'reference'
export type SubscriptionTier = 'free' | 'premium'
