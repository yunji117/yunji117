update public.site_content
set
  contact_title = 'LET’S WORK TOGETHER',
  contact_items = coalesce(
    (
      select jsonb_agg(item)
      from jsonb_array_elements(contact_items) as item
      where coalesce(item->>'value', '') <> ''
    ),
    '[]'::jsonb
  ),
  thank_you_text = 'Thank you for visiting.',
  updated_at = now()
where id = 'main';
