import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  const productsData = [
    {
      name: 'Tioras Signature Tee',
      description:
        'The quintessential T-shirt. Crafted from ultra-soft pima cotton for a luxury feel and a classic fit. Your canvas for expression.',
      price: 2499,
      category: 'T-Shirt',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['#000000', '#FFFFFF', '#1E3A8A']),
      image: 'https://picsum.photos/seed/1/600/800',
      isNew: true,
    },
    {
      name: 'Aether Hoodie',
      description:
        'A mid-weight hoodie made with our custom fleece-back jersey. Incredibly soft, with a structured drape that holds its shape.',
      price: 6999,
      category: 'Hoodie',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['#111827', '#4B5563', '#9CA3AF']),
      image: 'https://picsum.photos/seed/2/600/800',
      isNew: true,
    },
    {
      name: 'Nova Bomber Jacket',
      description:
        'A modern take on the classic bomber. Water-resistant nylon shell with a lightweight insulation for versatile, all-weather wear.',
      price: 12999,
      category: 'Jacket',
      sizes: JSON.stringify(['M', 'L', 'XL']),
      colors: JSON.stringify(['#000000', '#374151']),
      image: 'https://picsum.photos/seed/3/600/800',
      isNew: false,
    },
    {
      name: 'Zenith Performance Cap',
      description:
        'Lightweight, breathable, and water-repellent. The Zenith cap is designed for motion, with a sleek profile and adjustable strap.',
      price: 1999,
      category: 'Cap',
      sizes: JSON.stringify(['One Size']),
      colors: JSON.stringify(['#FFFFFF', '#000000']),
      image: 'https://picsum.photos/seed/4/600/800',
      isNew: true,
    },
    {
      name: 'Apex Utility Jacket',
      description:
        'Built for the urban explorer. A durable, multi-pocket jacket with a relaxed fit and a weather-resistant finish.',
      price: 9999,
      category: 'Jacket',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL']),
      colors: JSON.stringify(['#1F2937', '#4B5563']),
      image: 'https://picsum.photos/seed/5/600/800',
      isNew: false,
    },
    {
      name: 'Origin Long Sleeve',
      description:
        'A versatile layering piece. Made from a breathable, moisture-wicking waffle knit that provides warmth without weight.',
      price: 3499,
      category: 'T-Shirt',
      sizes: JSON.stringify(['S', 'M', 'L', 'XL', 'XXL']),
      colors: JSON.stringify(['#FFFFFF', '#111827', '#6B7280']),
      image: 'https://picsum.photos/seed/6/600/800',
      isNew: false,
    },
    {
      name: 'Element Tech Hoodie',
      description:
        'Engineered for performance. This hoodie features a four-way stretch fabric that is both insulating and breathable.',
      price: 8999,
      category: 'Hoodie',
      sizes: JSON.stringify(['S', 'M', 'L']),
      colors: JSON.stringify(['#1F2937', '#9CA3AF']),
      image: 'https://picsum.photos/seed/7/600/800',
      isNew: true,
    },
    {
      name: 'Classic Logo Cap',
      description:
        'An everyday essential. The classic six-panel cap made from durable cotton twill, featuring an embroidered Tioras logo.',
      price: 1799,
      category: 'Cap',
      sizes: JSON.stringify(['One Size']),
      colors: JSON.stringify(['#000000', '#F3F4F6', '#BE123C']),
      image: 'https://picsum.photos/seed/8/600/800',
      isNew: false,
    },
  ];

  for (const p of productsData) {
    const product = await prisma.product.upsert({
      where: { name: p.name },
      update: {},
      create: p,
    });
    console.log(`Created product with id: ${product.id}`);
  }

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
