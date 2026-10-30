ALTER TABLE public.pages ADD COLUMN IF NOT EXISTS video_format text NOT NULL DEFAULT 'horizontal';
ALTER TABLE public.pages DROP CONSTRAINT IF EXISTS pages_video_format_check;
ALTER TABLE public.pages ADD CONSTRAINT pages_video_format_check CHECK (video_format IN ('horizontal','vertical'));