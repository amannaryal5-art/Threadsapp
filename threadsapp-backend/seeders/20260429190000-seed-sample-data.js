'use strict';

const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const slugify = require('slugify');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const passwordHash = await bcrypt.hash('Admin123', 10);

    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        name: 'ThreadsApp Admin',
        email: 'admin@threadsapp.in',
        phone: '9000000001',
        passwordHash,
        profilePhoto: null,
        gender: 'prefer_not_to_say',
        dateOfBirth: null,
        isPhoneVerified: true,
        isEmailVerified: true,
        isActive: true,
        role: 'admin',
        fcmToken: null,
        loyaltyPoints: 0,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        name: 'Sample Shopper',
        email: 'shopper@threadsapp.in',
        phone: '9000000002',
        passwordHash,
        profilePhoto: null,
        gender: 'prefer_not_to_say',
        dateOfBirth: null,
        isPhoneVerified: true,
        isEmailVerified: true,
        isActive: true,
        role: 'user',
        fcmToken: null,
        loyaltyPoints: 0,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    const categories = [
      { id: uuidv4(), name: 'Men', slug: 'men', displayOrder: 1 },
      { id: uuidv4(), name: 'Women', slug: 'women', displayOrder: 2 },
      { id: uuidv4(), name: 'Kids', slug: 'kids', displayOrder: 3 },
      { id: uuidv4(), name: 'Unisex', slug: 'unisex', displayOrder: 4 },
    ];

    const subcategories = [
      ['Men', ['T-Shirts', 'Shirts', 'Jeans', 'Trousers', 'Kurtas', 'Jackets', 'Shorts']],
      ['Women', ['Dresses', 'Kurtis', 'Tops', 'Jeans', 'Sarees', 'Lehengas', 'Co-ords']],
      ['Kids', ['Boys Clothing', 'Girls Clothing']],
    ].flatMap(([parent, children], indexGroup) =>
      children.map((name, index) => ({
        id: uuidv4(),
        name,
        slug: slugify(name, { lower: true, strict: true }),
        parentId: categories.find((item) => item.name === parent).id,
        displayOrder: indexGroup * 10 + index,
      })),
    );

    await queryInterface.bulkInsert(
      'Categories',
      [...categories, ...subcategories].map((item) => ({
        description: `${item.name} collection`,
        image: `https://res.cloudinary.com/demo/image/upload/${item.slug}.jpg`,
        isActive: true,
        createdAt: now,
        updatedAt: now,
        ...item,
      })),
    );

    const brands = ['H&M', 'Zara', 'Mango', 'Biba', 'W', 'FabIndia', "Levi's", 'Allen Solly', 'Van Heusen', 'Max'].map((name, index) => ({
      id: uuidv4(),
      name,
      slug: slugify(name, { lower: true, strict: true }),
      logo: `https://res.cloudinary.com/demo/image/upload/brands/${index + 1}.png`,
      description: `${name} official brand`,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    }));
    await queryInterface.bulkInsert('Brands', brands);

    const productTemplates = [
      ['Men', 'T-Shirts', 'Cotton Crew Tee', 'Cotton', 'Solid', 'Casual', 'Regular'],
      ['Men', 'Shirts', 'Oxford Formal Shirt', 'Cotton', 'Striped', 'Formal', 'Slim'],
      ['Men', 'Jeans', 'Classic Blue Jeans', 'Denim', 'Solid', 'Casual', 'Regular'],
      ['Men', 'Trousers', 'Stretch Chino Trousers', 'Cotton', 'Solid', 'Formal', 'Slim'],
      ['Men', 'Kurtas', 'Festive Printed Kurta', 'Cotton', 'Printed', 'Ethnic', 'Regular'],
      ['Women', 'Dresses', 'Floral Midi Dress', 'Polyester', 'Floral', 'Party', 'Regular'],
      ['Women', 'Kurtis', 'Everyday Straight Kurti', 'Cotton', 'Printed', 'Ethnic', 'Regular'],
      ['Women', 'Tops', 'Satin Party Top', 'Satin', 'Solid', 'Party', 'Slim'],
      ['Women', 'Jeans', 'High Rise Skinny Jeans', 'Denim', 'Solid', 'Casual', 'Slim'],
      ['Women', 'Sarees', 'Printed Georgette Saree', 'Georgette', 'Printed', 'Ethnic', 'Regular'],
      ['Women', 'Lehengas', 'Wedding Lehenga Set', 'Silk', 'Embroidered', 'Ethnic', 'Regular'],
      ['Women', 'Co-ords', 'Pastel Co-ord Set', 'Linen', 'Solid', 'Casual', 'Relaxed'],
      ['Kids', 'Boys Clothing', 'Boys Graphic Tee', 'Cotton', 'Printed', 'Casual', 'Regular'],
      ['Kids', 'Girls Clothing', 'Girls Party Frock', 'Net', 'Floral', 'Party', 'Regular'],
      ['Unisex', null, 'Oversized Hoodie', 'Fleece', 'Solid', 'Casual', 'Oversized'],
      ['Unisex', null, 'Athleisure Joggers', 'Polyester', 'Solid', 'Sports', 'Relaxed'],
      ['Men', 'Jackets', 'Bomber Jacket', 'Polyester', 'Solid', 'Casual', 'Regular'],
      ['Men', 'Shorts', 'Training Shorts', 'Polyester', 'Solid', 'Sports', 'Regular'],
      ['Women', 'Dresses', 'Ribbed Bodycon Dress', 'Cotton', 'Solid', 'Party', 'Slim'],
      ['Women', 'Kurtis', 'A-line Festive Kurti', 'Silk', 'Printed', 'Ethnic', 'Regular'],
    ];

    const products = [];
    const variants = [];
    const inventories = [];
    const images = [];

    productTemplates.forEach((template, index) => {
      const [parentName, subName, name, fabric, pattern, occasion, fit] = template;
      const category = subcategories.find((item) => item.name === subName) || categories.find((item) => item.name === parentName);
      const brand = brands[index % brands.length];
      const productId = uuidv4();
      const basePrice = 999 + index * 120;
      const discountPercent = [10, 15, 20, 25, 30][index % 5];
      products.push({
        id: productId,
        name,
        slug: slugify(name, { lower: true, strict: true }),
        description: `${name} designed for ${occasion.toLowerCase()} wear.`,
        categoryId: category.id,
        brandId: brand.id,
        basePrice,
        discountPercent,
        sellingPrice: (basePrice - (basePrice * discountPercent) / 100).toFixed(2),
        fabric,
        pattern,
        occasion,
        fit,
        care: 'Machine wash cold, do not bleach.',
        countryOfOrigin: 'India',
        isActive: true,
        isFeatured: index < 6,
        averageRating: 4 + (index % 10) / 10,
        totalReviews: 4 + index,
        totalSold: 10 + index * 3,
        tags: ['summer', occasion.toLowerCase(), fabric.toLowerCase()],
        createdAt: now,
        updatedAt: now,
      });

      ['S', 'M'].forEach((size, sizeIndex) => {
        const variantId = uuidv4();
        variants.push({
          id: variantId,
          productId,
          size,
          color: sizeIndex === 0 ? 'Blue' : 'Black',
          colorHex: sizeIndex === 0 ? '#1D4ED8' : '#111827',
          sku: `SKU-${index + 1}-${size}`,
          additionalPrice: sizeIndex * 50,
          createdAt: now,
          updatedAt: now,
        });
        inventories.push({
          id: uuidv4(),
          variantId,
          quantity: 10 + index + sizeIndex,
          lowStockThreshold: 5,
          createdAt: now,
          updatedAt: now,
        });
      });

      images.push({
        id: uuidv4(),
        productId,
        variantId: null,
        url: `https://res.cloudinary.com/demo/image/upload/products/${index + 1}.jpg`,
        altText: name,
        isPrimary: true,
        displayOrder: 0,
        createdAt: now,
        updatedAt: now,
      });
    });

    await queryInterface.bulkInsert('Products', products);
    await queryInterface.sequelize.query(`
      UPDATE "Products"
      SET "searchVector" =
        setweight(to_tsvector('english', COALESCE(name, '')), 'A') ||
        setweight(to_tsvector('english', COALESCE(description, '')), 'B') ||
        setweight(to_tsvector('english', array_to_string(COALESCE(tags, ARRAY[]::text[]), ' ')), 'C');
    `);
    await queryInterface.bulkInsert('ProductVariants', variants);
    await queryInterface.bulkInsert('Inventories', inventories);
    await queryInterface.bulkInsert('ProductImages', images);

    await queryInterface.bulkInsert('Coupons', [
      {
        id: uuidv4(),
        code: 'FIRST20',
        description: '20% off on first order',
        type: 'percent',
        value: 20,
        minOrderAmount: 499,
        maxDiscount: 500,
        usageLimit: 1000,
        usageCount: 0,
        perUserLimit: 1,
        isActive: true,
        expiresAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        applicableCategories: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        code: 'FLAT100',
        description: 'Flat Rs 100 off',
        type: 'flat',
        value: 100,
        minOrderAmount: 999,
        maxDiscount: null,
        usageLimit: 500,
        usageCount: 0,
        perUserLimit: 2,
        isActive: true,
        expiresAt: new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000),
        applicableCategories: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        code: 'SUMMER30',
        description: '30% summer collection sale',
        type: 'percent',
        value: 30,
        minOrderAmount: 1499,
        maxDiscount: 800,
        usageLimit: 300,
        usageCount: 0,
        perUserLimit: 1,
        isActive: true,
        expiresAt: new Date(now.getTime() + 60 * 24 * 60 * 60 * 1000),
        applicableCategories: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);

    await queryInterface.bulkInsert('Banners', [
      {
        id: uuidv4(),
        title: 'Summer Edit',
        image: 'https://res.cloudinary.com/demo/image/upload/banners/summer.jpg',
        targetType: 'category',
        targetId: categories.find((item) => item.name === 'Women').id,
        targetUrl: null,
        isActive: true,
        displayOrder: 1,
        startsAt: now,
        endsAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        title: 'Top Deals',
        image: 'https://res.cloudinary.com/demo/image/upload/banners/deals.jpg',
        targetType: 'url',
        targetId: null,
        targetUrl: 'https://threadsapp.in/deals',
        isActive: true,
        displayOrder: 2,
        startsAt: now,
        endsAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        createdAt: now,
        updatedAt: now,
      },
      {
        id: uuidv4(),
        title: 'Kids Fest',
        image: 'https://res.cloudinary.com/demo/image/upload/banners/kids.jpg',
        targetType: 'category',
        targetId: categories.find((item) => item.name === 'Kids').id,
        targetUrl: null,
        isActive: true,
        displayOrder: 3,
        startsAt: now,
        endsAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface) {
    for (const table of ['Banners', 'Coupons', 'ProductImages', 'Inventories', 'ProductVariants', 'Products', 'Brands', 'Categories', 'Users']) {
      await queryInterface.bulkDelete(table, null, {});
    }
  },
};
