-- Migration: add typography and popup columns to app_content
-- Run this in Supabase SQL editor or via psql for your project

ALTER TABLE public.app_content
  ADD COLUMN IF NOT EXISTS popup_title_color text,
  ADD COLUMN IF NOT EXISTS popup_title_size text,
  ADD COLUMN IF NOT EXISTS popup_title_font_family text,
  ADD COLUMN IF NOT EXISTS popup_title_font_weight text,
  ADD COLUMN IF NOT EXISTS popup_text_color text,
  ADD COLUMN IF NOT EXISTS popup_text_size text,
  ADD COLUMN IF NOT EXISTS popup_text_font_family text,
  ADD COLUMN IF NOT EXISTS popup_text_font_weight text,
  ADD COLUMN IF NOT EXISTS text_font_family text,
  ADD COLUMN IF NOT EXISTS text_font_weight text,
  ADD COLUMN IF NOT EXISTS start_page_font_family text,
  ADD COLUMN IF NOT EXISTS start_page_font_weight text,
  ADD COLUMN IF NOT EXISTS grab_page_font_family text,
  ADD COLUMN IF NOT EXISTS grab_page_font_weight text,
  ADD COLUMN IF NOT EXISTS auth_title_font_family text,
  ADD COLUMN IF NOT EXISTS auth_title_font_weight text;

-- If your additional_content or slides columns are not jsonb, you may want to alter them as needed.
-- Example to ensure additional_content is jsonb:
-- ALTER TABLE public.app_content ALTER COLUMN additional_content TYPE jsonb USING additional_content::jsonb;
-- ALTER TABLE public.app_content ALTER COLUMN slides TYPE jsonb USING slides::jsonb;
