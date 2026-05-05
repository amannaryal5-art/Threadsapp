const { apiRequest, getShiprocketToken } = require('../config/shiprocket');

const withToken = async (method, path, body) => {
  const token = await getShiprocketToken();
  if (!token) return null;
  return apiRequest(method, path, body, token);
};

exports.createOrder = async (order) =>
  withToken('POST', '/v1/external/orders/create/adhoc', {
    order_id: order.orderNumber,
    order_date: new Date().toISOString(),
    pickup_location: 'Primary',
    billing_customer_name: order.Address.fullName,
    billing_last_name: '',
    billing_address: `${order.Address.flatNo || ''} ${order.Address.building || ''}`.trim(),
    billing_city: order.Address.city,
    billing_pincode: order.Address.pincode,
    billing_state: order.Address.state,
    billing_country: order.Address.country,
    billing_email: order.User.email || 'na@threadsapp.in',
    billing_phone: order.Address.phone,
    shipping_is_billing: true,
    order_items: order.items.map((item) => ({
      name: item.productName,
      sku: item.variantDetails.sku,
      units: item.quantity,
      selling_price: item.sellingPrice,
    })),
    payment_method: order.paymentStatus === 'paid' ? 'Prepaid' : 'COD',
    sub_total: order.totalAmount,
  });

exports.assignCourier = async (shipmentId) =>
  withToken('POST', '/v1/external/courier/assign/awb', { shipment_id: shipmentId, courier_id: '' });

exports.getTracking = async (shipmentId) =>
  withToken('GET', `/v1/external/courier/track/shipment/${shipmentId}`);

exports.schedulePickup = async (shipmentId) =>
  withToken('POST', '/v1/external/courier/generate/pickup', { shipment_id: [shipmentId] });
