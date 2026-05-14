'use strict';

const enumTypes = [
  `DO $$ BEGIN
     CREATE TYPE "enum_users_gender" AS ENUM ('male','female','other','prefer_not_to_say');
   EXCEPTION
     WHEN duplicate_object THEN NULL;
   END $$;`,
  `DO $$ BEGIN
     CREATE TYPE "enum_users_role" AS ENUM ('user','admin');
   EXCEPTION
     WHEN duplicate_object THEN NULL;
   END $$;`,
  `DO $$ BEGIN
     CREATE TYPE "enum_addresses_type" AS ENUM ('home','work','other');
   EXCEPTION
     WHEN duplicate_object THEN NULL;
   END $$;`,
  `DO $$ BEGIN
     CREATE TYPE "enum_payments_status" AS ENUM ('pending','paid','failed','refunded');
   EXCEPTION
     WHEN duplicate_object THEN NULL;
   END $$;`,
  `DO $$ BEGIN
     CREATE TYPE "enum_orders_status" AS ENUM ('pending_payment','confirmed','processing','shipped','out_for_delivery','delivered','cancelled','return_requested','return_picked','refunded');
   EXCEPTION
     WHEN duplicate_object THEN NULL;
   END $$;`,
  `DO $$ BEGIN
     CREATE TYPE "enum_orders_paymentstatus" AS ENUM ('pending','paid','failed','refunded');
   EXCEPTION
     WHEN duplicate_object THEN NULL;
   END $$;`,
  `DO $$ BEGIN
     CREATE TYPE "enum_coupons_type" AS ENUM ('percent','flat');
   EXCEPTION
     WHEN duplicate_object THEN NULL;
   END $$;`,
  `DO $$ BEGIN
     CREATE TYPE "enum_reviews_fit" AS ENUM ('runs_small','true_to_size','runs_large');
   EXCEPTION
     WHEN duplicate_object THEN NULL;
   END $$;`,
  `DO $$ BEGIN
     CREATE TYPE "enum_notifications_type" AS ENUM ('order','payment','offer','system');
   EXCEPTION
     WHEN duplicate_object THEN NULL;
   END $$;`,
  `DO $$ BEGIN
     CREATE TYPE "enum_returns_reason" AS ENUM ('wrong_size','wrong_item','damaged','not_as_described','changed_mind');
   EXCEPTION
     WHEN duplicate_object THEN NULL;
   END $$;`,
  `DO $$ BEGIN
     CREATE TYPE "enum_returns_status" AS ENUM ('requested','approved','rejected','pickup_scheduled','picked','refund_initiated','refunded');
   EXCEPTION
     WHEN duplicate_object THEN NULL;
   END $$;`,
  `DO $$ BEGIN
     CREATE TYPE "enum_banners_targettype" AS ENUM ('category','product','url','none');
   EXCEPTION
     WHEN duplicate_object THEN NULL;
   END $$;`,
];

module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = async (tableName) => {
      const [rows] = await queryInterface.sequelize.query(
        `SELECT EXISTS (
          SELECT 1
          FROM information_schema.tables
          WHERE table_schema = 'public' AND table_name = :tableName
        ) AS "exists";`,
        {
          replacements: { tableName },
        },
      );
      return Boolean(rows?.[0]?.exists);
    };

    const createTableIfMissing = async (tableName, schema) => {
      if (await tableExists(tableName)) {
        return;
      }
      await queryInterface.createTable(tableName, schema);
    };

    for (const sql of enumTypes) {
      await queryInterface.sequelize.query(sql);
    }

    const common = {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), primaryKey: true, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    };

    await createTableIfMissing('Users', {
      ...common,
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true },
      phone: { type: Sequelize.STRING, allowNull: false, unique: true },
      passwordHash: { type: Sequelize.STRING },
      profilePhoto: { type: Sequelize.STRING },
      gender: { type: 'enum_users_gender', defaultValue: 'prefer_not_to_say' },
      dateOfBirth: { type: Sequelize.DATEONLY },
      isPhoneVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
      isEmailVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      role: { type: 'enum_users_role', defaultValue: 'user' },
      fcmToken: { type: Sequelize.STRING },
      loyaltyPoints: { type: Sequelize.INTEGER, defaultValue: 0 },
    });

    await createTableIfMissing('Categories', {
      ...common,
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      image: { type: Sequelize.STRING },
      parentId: { type: Sequelize.UUID, references: { model: 'Categories', key: 'id' }, onDelete: 'SET NULL' },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      displayOrder: { type: Sequelize.INTEGER, defaultValue: 0 },
    });

    await createTableIfMissing('Brands', {
      ...common,
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      logo: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
    });

    await createTableIfMissing('Addresses', {
      ...common,
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      fullName: { type: Sequelize.STRING, allowNull: false },
      phone: { type: Sequelize.STRING, allowNull: false },
      flatNo: { type: Sequelize.STRING },
      building: { type: Sequelize.STRING },
      street: { type: Sequelize.STRING },
      area: { type: Sequelize.STRING },
      city: { type: Sequelize.STRING, allowNull: false },
      state: { type: Sequelize.STRING, allowNull: false },
      pincode: { type: Sequelize.STRING, allowNull: false },
      country: { type: Sequelize.STRING, defaultValue: 'India' },
      type: { type: 'enum_addresses_type', defaultValue: 'home' },
      isDefault: { type: Sequelize.BOOLEAN, defaultValue: false },
      lat: { type: Sequelize.FLOAT },
      lng: { type: Sequelize.FLOAT },
    });

    await createTableIfMissing('Products', {
      ...common,
      name: { type: Sequelize.STRING, allowNull: false },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      categoryId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Categories', key: 'id' } },
      brandId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Brands', key: 'id' } },
      basePrice: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      discountPercent: { type: Sequelize.INTEGER, defaultValue: 0 },
      sellingPrice: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      fabric: { type: Sequelize.STRING },
      pattern: { type: Sequelize.STRING },
      occasion: { type: Sequelize.STRING },
      fit: { type: Sequelize.STRING },
      care: { type: Sequelize.TEXT },
      countryOfOrigin: { type: Sequelize.STRING, defaultValue: 'India' },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      isFeatured: { type: Sequelize.BOOLEAN, defaultValue: false },
      averageRating: { type: Sequelize.FLOAT, defaultValue: 0 },
      totalReviews: { type: Sequelize.INTEGER, defaultValue: 0 },
      totalSold: { type: Sequelize.INTEGER, defaultValue: 0 },
      tags: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      searchVector: { type: 'TSVECTOR' },
    });

    await createTableIfMissing('ProductVariants', {
      ...common,
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
      size: { type: Sequelize.STRING, allowNull: false },
      color: { type: Sequelize.STRING, allowNull: false },
      colorHex: { type: Sequelize.STRING },
      sku: { type: Sequelize.STRING, allowNull: false, unique: true },
      additionalPrice: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
    });

    await createTableIfMissing('ProductImages', {
      ...common,
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
      variantId: { type: Sequelize.UUID, references: { model: 'ProductVariants', key: 'id' }, onDelete: 'SET NULL' },
      url: { type: Sequelize.STRING, allowNull: false },
      altText: { type: Sequelize.STRING },
      isPrimary: { type: Sequelize.BOOLEAN, defaultValue: false },
      displayOrder: { type: Sequelize.INTEGER, defaultValue: 0 },
    });

    await createTableIfMissing('Inventories', {
      ...common,
      variantId: { type: Sequelize.UUID, allowNull: false, unique: true, references: { model: 'ProductVariants', key: 'id' }, onDelete: 'CASCADE' },
      quantity: { type: Sequelize.INTEGER, defaultValue: 0 },
      lowStockThreshold: { type: Sequelize.INTEGER, defaultValue: 5 },
    });

    await createTableIfMissing('Carts', {
      ...common,
      userId: { type: Sequelize.UUID, allowNull: false, unique: true, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
    });

    await createTableIfMissing('CartItems', {
      ...common,
      cartId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Carts', key: 'id' }, onDelete: 'CASCADE' },
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Products', key: 'id' } },
      variantId: { type: Sequelize.UUID, allowNull: false, references: { model: 'ProductVariants', key: 'id' } },
      quantity: { type: Sequelize.INTEGER, defaultValue: 1 },
      priceAtAdd: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    });

    await createTableIfMissing('Wishlists', {
      ...common,
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
    });
    try {
      await queryInterface.addConstraint('Wishlists', { fields: ['userId', 'productId'], type: 'unique', name: 'wishlists_user_product_unique' });
    } catch (error) {
      if (!String(error.message).includes('already exists')) throw error;
    }

    await createTableIfMissing('Orders', {
      ...common,
      orderNumber: { type: Sequelize.STRING, allowNull: false, unique: true },
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
      addressId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Addresses', key: 'id' } },
      status: { type: 'enum_orders_status', defaultValue: 'pending_payment' },
      paymentStatus: { type: 'enum_orders_paymentstatus', defaultValue: 'pending' },
      subtotal: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      discountAmount: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      couponCode: { type: Sequelize.STRING },
      couponDiscount: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      shippingCharge: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      taxAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      totalAmount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      shiprocketOrderId: { type: Sequelize.STRING },
      shiprocketShipmentId: { type: Sequelize.STRING },
      trackingNumber: { type: Sequelize.STRING },
      courierName: { type: Sequelize.STRING },
      trackingUrl: { type: Sequelize.STRING },
      estimatedDelivery: { type: Sequelize.DATEONLY },
      deliveredAt: { type: Sequelize.DATE },
      notes: { type: Sequelize.TEXT },
      invoiceUrl: { type: Sequelize.STRING },
    });

    await createTableIfMissing('OrderItems', {
      ...common,
      orderId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Orders', key: 'id' }, onDelete: 'CASCADE' },
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Products', key: 'id' } },
      variantId: { type: Sequelize.UUID, allowNull: false, references: { model: 'ProductVariants', key: 'id' } },
      productName: { type: Sequelize.STRING, allowNull: false },
      variantDetails: { type: Sequelize.JSONB, allowNull: false },
      productImage: { type: Sequelize.STRING },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      mrp: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      sellingPrice: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      discountPercent: { type: Sequelize.INTEGER, defaultValue: 0 },
      totalPrice: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    });

    await createTableIfMissing('Payments', {
      ...common,
      orderId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Orders', key: 'id' }, onDelete: 'CASCADE' },
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
      razorpayOrderId: { type: Sequelize.STRING },
      razorpayPaymentId: { type: Sequelize.STRING },
      razorpaySignature: { type: Sequelize.STRING },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      currency: { type: Sequelize.STRING, defaultValue: 'INR' },
      status: { type: 'enum_payments_status', defaultValue: 'pending' },
      method: { type: Sequelize.STRING },
      refundId: { type: Sequelize.STRING },
      refundAmount: { type: Sequelize.DECIMAL(10, 2) },
    });

    await createTableIfMissing('Coupons', {
      ...common,
      code: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.STRING },
      type: { type: 'enum_coupons_type', allowNull: false },
      value: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      minOrderAmount: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
      maxDiscount: { type: Sequelize.DECIMAL(10, 2) },
      usageLimit: { type: Sequelize.INTEGER },
      usageCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      perUserLimit: { type: Sequelize.INTEGER, defaultValue: 1 },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      expiresAt: { type: Sequelize.DATE },
      applicableCategories: { type: Sequelize.ARRAY(Sequelize.UUID), defaultValue: null },
    });

    await createTableIfMissing('CouponUsages', {
      ...common,
      couponId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Coupons', key: 'id' } },
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
      orderId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Orders', key: 'id' } },
      discountApplied: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    });

    await createTableIfMissing('Reviews', {
      ...common,
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
      orderItemId: { type: Sequelize.UUID, allowNull: false, references: { model: 'OrderItems', key: 'id' } },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      title: { type: Sequelize.STRING },
      comment: { type: Sequelize.TEXT },
      photos: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      fit: { type: 'enum_reviews_fit' },
      isVerifiedPurchase: { type: Sequelize.BOOLEAN, defaultValue: true },
      helpfulCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      isApproved: { type: Sequelize.BOOLEAN, defaultValue: true },
    });

    await createTableIfMissing('Notifications', {
      ...common,
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      title: { type: Sequelize.STRING, allowNull: false },
      body: { type: Sequelize.STRING, allowNull: false },
      type: { type: 'enum_notifications_type', defaultValue: 'system' },
      data: { type: Sequelize.JSONB, defaultValue: {} },
      isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
    });

    await createTableIfMissing('Returns', {
      ...common,
      orderId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Orders', key: 'id' } },
      orderItemId: { type: Sequelize.UUID, allowNull: false, references: { model: 'OrderItems', key: 'id' } },
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
      reason: { type: 'enum_returns_reason', allowNull: false },
      description: { type: Sequelize.TEXT },
      photos: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      status: { type: 'enum_returns_status', defaultValue: 'requested' },
      refundAmount: { type: Sequelize.DECIMAL(10, 2) },
      adminNotes: { type: Sequelize.TEXT },
    });

    await createTableIfMissing('Banners', {
      ...common,
      title: { type: Sequelize.STRING, allowNull: false },
      image: { type: Sequelize.STRING, allowNull: false },
      targetType: { type: 'enum_banners_targettype', defaultValue: 'none' },
      targetId: { type: Sequelize.UUID },
      targetUrl: { type: Sequelize.STRING },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      displayOrder: { type: Sequelize.INTEGER, defaultValue: 0 },
      startsAt: { type: Sequelize.DATE },
      endsAt: { type: Sequelize.DATE },
    });

    await queryInterface.sequelize.query('ALTER TABLE "Products" ADD COLUMN IF NOT EXISTS "searchVector" TSVECTOR;');

    try { await queryInterface.addIndex('Products', ['categoryId']); } catch (error) { if (!String(error.message).includes('already exists')) throw error; }
    try { await queryInterface.addIndex('Products', ['brandId']); } catch (error) { if (!String(error.message).includes('already exists')) throw error; }
    try { await queryInterface.addIndex('Products', ['isActive']); } catch (error) { if (!String(error.message).includes('already exists')) throw error; }
    try { await queryInterface.addIndex('Products', ['sellingPrice']); } catch (error) { if (!String(error.message).includes('already exists')) throw error; }
    try { await queryInterface.addIndex('Products', ['averageRating']); } catch (error) { if (!String(error.message).includes('already exists')) throw error; }
    await queryInterface.sequelize.query('CREATE INDEX IF NOT EXISTS products_search_vector_gin ON "Products" USING GIN ("searchVector");');
    await queryInterface.sequelize.query('CREATE INDEX IF NOT EXISTS products_tags_gin ON "Products" USING GIN ("tags");');

    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION threadsapp_products_search_vector_update() RETURNS trigger AS $$
      BEGIN
        NEW."searchVector" :=
          setweight(to_tsvector('english', COALESCE(NEW.name, '')), 'A') ||
          setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
          setweight(to_tsvector('english', array_to_string(COALESCE(NEW.tags, ARRAY[]::text[]), ' ')), 'C');
        RETURN NEW;
      END
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER threadsapp_products_search_vector_before
      BEFORE INSERT OR UPDATE ON "Products"
      FOR EACH ROW EXECUTE PROCEDURE threadsapp_products_search_vector_update();
    `);
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query('DROP TRIGGER IF EXISTS threadsapp_products_search_vector_before ON "Products";');
    await queryInterface.sequelize.query('DROP FUNCTION IF EXISTS threadsapp_products_search_vector_update;');
    for (const table of ['Banners', 'Returns', 'Notifications', 'Reviews', 'CouponUsages', 'Coupons', 'Payments', 'OrderItems', 'Orders', 'Wishlists', 'CartItems', 'Carts', 'Inventories', 'ProductImages', 'ProductVariants', 'Products', 'Addresses', 'Brands', 'Categories', 'Users']) {
      await queryInterface.dropTable(table);
    }
    for (const type of ['"enum_banners_targettype"', '"enum_returns_status"', '"enum_returns_reason"', '"enum_notifications_type"', '"enum_reviews_fit"', '"enum_coupons_type"', '"enum_orders_paymentstatus"', '"enum_orders_status"', '"enum_payments_status"', '"enum_addresses_type"', '"enum_users_role"', '"enum_users_gender"']) {
      await queryInterface.sequelize.query(`DROP TYPE IF EXISTS ${type};`);
    }
  },
};
