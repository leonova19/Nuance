-- Update the microfiber cloth product details in the existing catalog.
do $$
begin
  if not exists (select 1 from public.store_products where id = 'car-cloth') then
    raise exception 'car-cloth was not found. Import the catalog first.';
  end if;
end $$;

update public.store_products
set product = product || jsonb_build_object(
  'name', 'Микрофибровая тряпка',
  'description', 'Высококачественная микрофибровая салфетка — надёжный выбор для тех, кто ценит безупречную чистоту и лёгкий уход.',
  'fullDescription', 'Изготовлена из ультраплотной микрофибры премиум-класса, она эффективно удаляет пыль, грязь и отпечатки пальцев, не оставляя разводов и ворсинок. Идеально подходит как для сухой, так и для влажной уборки — от стекла, зеркал и экранов до поверхностей автомобиля и элементов интерьера. Мягкая, но очень впитывающая текстура обеспечивает безупречную чистоту и отсутствие царапин всего за несколько секунд.',
  'fullDescriptionSections', jsonb_build_array(
    jsonb_build_object('text', 'Идеально подходит как для профессионального, так и для ежедневного использования — когда допустим только идеальный результат.', 'emphasis', true)
  ),
  'productSpecifications', jsonb_build_array(
    jsonb_build_object('label', 'Размер', 'value', '40 x 40 cm'),
    jsonb_build_object('label', 'Материал', 'value', '80% Полиэстер, 20% Полиамид')
  ),
  'usage', 'Салфетка подходит для сухой и влажной очистки салона автомобиля и домашних поверхностей. Используй её отдельно или вместе с подходящими чистящими средствами для достижения лучшего результата. После использования промой и дай полностью высохнуть.'
),
updated_at = now()
where id = 'car-cloth';
