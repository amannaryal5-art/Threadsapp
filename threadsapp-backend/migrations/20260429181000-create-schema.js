'use strict';

const enumTypes = [
  "CREATE TYPE \"enum_Users_gender\" AS ENUM ('male','female','other','prefer_not_to_say');",
  "CREATE TYPE \"enum_Users_role\" AS ENUM ('user','admin');",
  "CREATE TYPE \"enum_Addresses_type\" AS ENUM ('home','work','other');",
  "CREATE TYPE \"enum_Payments_status\" AS ENUM ('pending','paid','failed','refunded');",
  "CREATE TYPE \"enum_Orders_status\" AS ENUM ('pending_payment','confirmed','processing','shipped','out_for_delivery','delivered','cancelled','return_requested','return_picked','refunded');",
  "CREATE TYPE \"enum_Orders_paymentStatus\" AS ENUM ('pending','paid','failed','refunded');",
  "CREATE TYPE \"enum_Coupons_type\" AS ENUM ('percent','flat');",
  "CREATE TYPE \"enum_Reviews_fit\" AS ENUM ('runs_small','true_to_size','runs_large');",
  "CREATE TYPE \"enum_Notifications_type\" AS ENUM ('order','payment','offer','system');",
  "CREATE TYPE \"enum_Returns_reason\" AS ENUM ('wrong_size','wrong_item','damaged','not_as_described','changed_mind');",
  "CREATE TYPE \"enum_Returns_status\" AS ENUM ('requested','approved','rejected','pickup_scheduled','picked','refund_initiated','refunded');",
  "CREATE TYPE \"enum_Banners_targetType\" AS ENUM ('category','product','url','none');",
];

module.exports = {
  async up(queryInterface, Sequelize) {
    for (const sql of enumTypes) {
      await queryInterface.sequelize.query(sql);
    }

    const common = {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.literal('gen_random_uuid()'), primaryKey: true, allowNull: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    };

    await queryInterface.createTable('Users', {
      ...common,
      name: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, unique: true },
      phone: { type: Sequelize.STRING, allowNull: false, unique: true },
      passwordHash: { type: Sequelize.STRING },
      profilePhoto: { type: Sequelize.STRING },
      gender: { type: 'enum_Users_gender', defaultValue: 'prefer_not_to_say' },
      dateOfBirth: { type: Sequelize.DATEONLY },
      isPhoneVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
      isEmailVerified: { type: Sequelize.BOOLEAN, defaultValue: false },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      role: { type: 'enum_Users_role', defaultValue: 'user' },
      fcmToken: { type: Sequelize.STRING },
      loyaltyPoints: { type: Sequelize.INTEGER, defaultValue: 0 },
    });

    await queryInterface.createTable('Categories', {
      ...common,
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.TEXT },
      image: { type: Sequelize.STRING },
      parentId: { type: Sequelize.UUID, references: { model: 'Categories', key: 'id' }, onDelete: 'SET NULL' },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      displayOrder: { type: Sequelize.INTEGER, defaultValue: 0 },
    });

    await queryInterface.createTable('Brands', {
      ...common,
      name: { type: Sequelize.STRING, allowNull: false, unique: true },
      slug: { type: Sequelize.STRING, allowNull: false, unique: true },
      logo: { type: Sequelize.STRING },
      description: { type: Sequelize.TEXT },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
    });

    await queryInterface.createTable('Addresses', {
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
      type: { type: 'enum_Addresses_type', defaultValue: 'home' },
      isDefault: { type: Sequelize.BOOLEAN, defaultValue: false },
      lat: { type: Sequelize.FLOAT },
      lng: { type: Sequelize.FLOAT },
    });

    await queryInterface.createTable('Products', {
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

    await queryInterface.createTable('ProductVariants', {
      ...common,
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
      size: { type: Sequelize.STRING, allowNull: false },
      color: { type: Sequelize.STRING, allowNull: false },
      colorHex: { type: Sequelize.STRING },
      sku: { type: Sequelize.STRING, allowNull: false, unique: true },
      additionalPrice: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0 },
    });

    await queryInterface.createTable('ProductImages', {
      ...common,
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
      variantId: { type: Sequelize.UUID, references: { model: 'ProductVariants', key: 'id' }, onDelete: 'SET NULL' },
      url: { type: Sequelize.STRING, allowNull: false },
      altText: { type: Sequelize.STRING },
      isPrimary: { type: Sequelize.BOOLEAN, defaultValue: false },
      displayOrder: { type: Sequelize.INTEGER, defaultValue: 0 },
    });

    await queryInterface.createTable('Inventories', {
      ...common,
      variantId: { type: Sequelize.UUID, allowNull: false, unique: true, references: { model: 'ProductVariants', key: 'id' }, onDelete: 'CASCADE' },
      quantity: { type: Sequelize.INTEGER, defaultValue: 0 },
      lowStockThreshold: { type: Sequelize.INTEGER, defaultValue: 5 },
    });

    await queryInterface.createTable('Carts', {
      ...common,
      userId: { type: Sequelize.UUID, allowNull: false, unique: true, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
    });

    await queryInterface.createTable('CartItems', {
      ...common,
      cartId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Carts', key: 'id' }, onDelete: 'CASCADE' },
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Products', key: 'id' } },
      variantId: { type: Sequelize.UUID, allowNull: false, references: { model: 'ProductVariants', key: 'id' } },
      quantity: { type: Sequelize.INTEGER, defaultValue: 1 },
      priceAtAdd: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    });

    await queryInterface.createTable('Wishlists', {
      ...common,
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
    });
    await queryInterface.addConstraint('Wishlists', { fields: ['userId', 'productId'], type: 'unique', name: 'wishlists_user_product_unique' });

    await queryInterface.createTable('Orders', {
      ...common,
      orderNumber: { type: Sequelize.STRING, allowNull: false, unique: true },
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
      addressId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Addresses', key: 'id' } },
      status: { type: 'enum_Orders_status', defaultValue: 'pending_payment' },
      paymentStatus: { type: 'enum_Orders_paymentStatus', defaultValue: 'pending' },
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

    await queryInterface.createTable('OrderItems', {
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

    await queryInterface.createTable('Payments', {
      ...common,
      orderId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Orders', key: 'id' }, onDelete: 'CASCADE' },
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
      razorpayOrderId: { type: Sequelize.STRING },
      razorpayPaymentId: { type: Sequelize.STRING },
      razorpaySignature: { type: Sequelize.STRING },
      amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      currency: { type: Sequelize.STRING, defaultValue: 'INR' },
      status: { type: 'enum_Payments_status', defaultValue: 'pending' },
      method: { type: Sequelize.STRING },
      refundId: { type: Sequelize.STRING },
      refundAmount: { type: Sequelize.DECIMAL(10, 2) },
    });

    await queryInterface.createTable('Coupons', {
      ...common,
      code: { type: Sequelize.STRING, allowNull: false, unique: true },
      description: { type: Sequelize.STRING },
      type: { type: 'enum_Coupons_type', allowNull: false },
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

    await queryInterface.createTable('CouponUsages', {
      ...common,
      couponId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Coupons', key: 'id' } },
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
      orderId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Orders', key: 'id' } },
      discountApplied: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
    });

    await queryInterface.createTable('Reviews', {
      ...common,
      productId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Products', key: 'id' }, onDelete: 'CASCADE' },
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
      orderItemId: { type: Sequelize.UUID, allowNull: false, references: { model: 'OrderItems', key: 'id' } },
      rating: { type: Sequelize.INTEGER, allowNull: false },
      title: { type: Sequelize.STRING },
      comment: { type: Sequelize.TEXT },
      photos: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      fit: { type: 'enum_Reviews_fit' },
      isVerifiedPurchase: { type: Sequelize.BOOLEAN, defaultValue: true },
      helpfulCount: { type: Sequelize.INTEGER, defaultValue: 0 },
      isApproved: { type: Sequelize.BOOLEAN, defaultValue: true },
    });

    await queryInterface.createTable('Notifications', {
      ...common,
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' }, onDelete: 'CASCADE' },
      title: { type: Sequelize.STRING, allowNull: false },
      body: { type: Sequelize.STRING, allowNull: false },
      type: { type: 'enum_Notifications_type', defaultValue: 'system' },
      data: { type: Sequelize.JSONB, defaultValue: {} },
      isRead: { type: Sequelize.BOOLEAN, defaultValue: false },
    });

    await queryInterface.createTable('Returns', {
      ...common,
      orderId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Orders', key: 'id' } },
      orderItemId: { type: Sequelize.UUID, allowNull: false, references: { model: 'OrderItems', key: 'id' } },
      userId: { type: Sequelize.UUID, allowNull: false, references: { model: 'Users', key: 'id' } },
      reason: { type: 'enum_Returns_reason', allowNull: false },
      description: { type: Sequelize.TEXT },
      photos: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      status: { type: 'enum_Returns_status', defaultValue: 'requested' },
      refundAmount: { type: Sequelize.DECIMAL(10, 2) },
      adminNotes: { type: Sequelize.TEXT },
    });

    await queryInterface.createTable('Banners', {
      ...common,
      title: { type: Sequelize.STRING, allowNull: false },
      image: { type: Sequelize.STRING, allowNull: false },
      targetType: { type: 'enum_Banners_targetType', defaultValue: 'none' },
      targetId: { type: Sequelize.UUID },
      targetUrl: { type: Sequelize.STRING },
      isActive: { type: Sequelize.BOOLEAN, defaultValue: true },
      displayOrder: { type: Sequelize.INTEGER, defaultValue: 0 },
      startsAt: { type: Sequelize.DATE },
      endsAt: { type: Sequelize.DATE },
    });

    await queryInterface.addIndex('Products', ['categoryId']);
    await queryInterface.addIndex('Products', ['brandId']);
    await queryInterface.addIndex('Products', ['isActive']);
    await queryInterface.addIndex('Products', ['sellingPrice']);
    await queryInterface.addIndex('Products', ['averageRating']);
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
    for (const type of ['"enum_Banners_targetType"', '"enum_Returns_status"', '"enum_Returns_reason"', '"enum_Notifications_type"', '"enum_Reviews_fit"', '"enum_Coupons_type"', '"enum_Orders_paymentStatus"', '"enum_Orders_status"', '"enum_Payments_status"', '"enum_Addresses_type"', '"enum_Users_role"', '"enum_Users_gender"']) {
      await queryInterface.sequelize.query(`DROP TYPE IF EXISTS ${type};`);
    }
  },
};
