-- Remove this outdated short description from the stored product catalog.
update public.store_products
set product = product - 'description',
    updated_at = now()
where id = 'car-card'
  and product ->> 'description' = 'Лёгкий ароматический акцент для салона автомобиля в компактном формате.';
