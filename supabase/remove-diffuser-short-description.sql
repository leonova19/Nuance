-- Remove this outdated short description anywhere it remains in the stored catalog.
update public.store_products
set product = product - 'description',
    updated_at = now()
where product ->> 'description' = 'Масляный аромат для дома в элегантном флаконе с палочками из спрессованного волокна.';
