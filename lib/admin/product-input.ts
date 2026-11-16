import type { Product } from '@/app/shop/products';

const categories = new Set<Product['category']>(['home', 'car', 'fragrance', 'gifts', 'care']);
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

type EditableFields = Pick<Product, 'id' | 'category' | 'label' | 'name' | 'price' | 'image' | 'description' | 'fullDescription' | 'volume' | 'aroma' | 'composition' | 'usage'>;

export type ProductMutation = {
  product?: Partial<EditableFields>;
  isAvailable?: boolean;
  sortOrder?: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function stringValue(value: unknown, fallback: string | undefined, name: string, maxLength: number, required = false) {
  const next = value === undefined ? fallback : value;
  if (next === undefined && !required) return undefined;
  if (typeof next !== 'string' || next.length > maxLength || (required && !next.trim())) {
    throw new Error(`Некорректное поле «${name}».`);
  }
  return next;
}

function validImage(value: string) {
  if (value.startsWith('/') && !value.startsWith('//')) return true;
  try {
    return new URL(value).protocol === 'https:';
  } catch {
    return false;
  }
}

export function parseProductMutation(value: unknown, existing?: Product): ProductMutation {
  if (!isRecord(value)) throw new Error('Некорректные данные товара.');
  const rawProduct = value.product === undefined ? undefined : value.product;
  if (rawProduct !== undefined && !isRecord(rawProduct)) throw new Error('Некорректные данные товара.');

  const raw = (rawProduct ?? {}) as Record<string, unknown>;
  const id = stringValue(raw.id, existing?.id, 'адрес товара', 80, !existing) ?? '';
  if (!slugPattern.test(id)) throw new Error('Адрес товара: используйте латинские буквы, цифры и дефисы.');

  const categoryValue = raw.category === undefined ? existing?.category : raw.category;
  if (typeof categoryValue !== 'string' || !categories.has(categoryValue as Product['category'])) {
    throw new Error('Выберите категорию товара.');
  }

  const label = stringValue(raw.label, existing?.label, 'категория на карточке', 80, true) ?? '';
  const name = stringValue(raw.name, existing?.name, 'название', 160, true) ?? '';
  const image = stringValue(raw.image, existing?.image, 'изображение', 1000, true) ?? '';
  if (!validImage(image)) throw new Error('Изображение должно быть путем вида /image.png или ссылкой HTTPS.');

  const priceValue = raw.price === undefined ? existing?.price : raw.price;
  if (priceValue !== null && (typeof priceValue !== 'number' || !Number.isFinite(priceValue) || priceValue < 0 || priceValue > 100000)) {
    throw new Error('Цена должна быть числом от 0 до 100 000 или пустой.');
  }

  const usage = stringValue(raw.usage, existing?.usage, 'инструкция по использованию', 4000) ?? '';
  const product: Product = {
    ...(existing ?? { imageClass: 'shop-product-image--tall shop-product-image--blend-background' }),
    id,
    category: categoryValue as Product['category'],
    label,
    name,
    price: priceValue as number | null,
    image,
    usage,
  };

  const optionalFields = [
    ['description', 'описание', 3000],
    ['fullDescription', 'полное описание', 10000],
    ['volume', 'объём', 100],
    ['aroma', 'аромат', 100],
    ['composition', 'состав', 3000],
  ] as const;
  for (const [key, labelName, limit] of optionalFields) {
    const next = stringValue(raw[key], existing?.[key], labelName, limit);
    if (next !== undefined) product[key] = next;
  }

  const isAvailable = value.isAvailable === undefined ? undefined : value.isAvailable;
  if (isAvailable !== undefined && typeof isAvailable !== 'boolean') throw new Error('Некорректный статус наличия товара.');
  const sortOrder = value.sortOrder === undefined ? undefined : value.sortOrder;
  if (sortOrder !== undefined && (!Number.isInteger(sortOrder) || (sortOrder as number) < 0 || (sortOrder as number) > 100000)) {
    throw new Error('Некорректный порядок товара.');
  }

  return { product, isAvailable: isAvailable as boolean | undefined, sortOrder: sortOrder as number | undefined };
}

