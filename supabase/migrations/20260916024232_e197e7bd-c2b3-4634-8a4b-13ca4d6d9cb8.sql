ALTER TABLE public.pages
ADD COLUMN comments jsonb NOT NULL DEFAULT '[]'::jsonb;

COMMENT ON COLUMN public.pages.comments IS 'Optional ordered list of donor comments with image_url, time, name, and text.';