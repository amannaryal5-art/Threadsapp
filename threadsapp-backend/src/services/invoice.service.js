const fs = require('fs');
const os = require('os');
const path = require('path');
const PDFDocument = require('pdfkit');
const cloudinary = require('../config/cloudinary');

const uploadBuffer = (buffer, publicId) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'threadsapp/invoices', public_id: publicId, resource_type: 'raw' },
      (error, result) => {
        if (error) return reject(error);
        return resolve(result);
      },
    );
    stream.end(buffer);
  });

exports.generateInvoice = async (order) => {
  const tempPath = path.join(os.tmpdir(), `${order.orderNumber}.pdf`);
  const doc = new PDFDocument({ margin: 40 });
  const output = fs.createWriteStream(tempPath);
  doc.pipe(output);

  doc.fontSize(22).text(process.env.PLATFORM_NAME || 'ThreadsApp');
  doc.moveDown().fontSize(12).text(`Invoice for order ${order.orderNumber}`);
  doc.text(`Customer: ${order.User.name}`);
  doc.text(`Address: ${order.Address.fullName}, ${order.Address.city}, ${order.Address.state} - ${order.Address.pincode}`);
  doc.moveDown();

  doc.text('Items:', { underline: true });
  order.items.forEach((item) => {
    doc.text(`${item.productName} (${item.variantDetails.size}/${item.variantDetails.color}) x ${item.quantity} - Rs. ${item.totalPrice}`);
  });

  doc.moveDown();
  doc.text(`Subtotal: Rs. ${order.subtotal}`);
  doc.text(`Discount: Rs. ${order.discountAmount}`);
  doc.text(`Shipping: Rs. ${order.shippingCharge}`);
  doc.text(`GST: Rs. ${order.taxAmount}`);
  doc.text(`Total: Rs. ${order.totalAmount}`);
  doc.end();

  await new Promise((resolve) => output.on('finish', resolve));
  const buffer = fs.readFileSync(tempPath);
  const upload = await uploadBuffer(buffer, order.orderNumber);
  fs.unlinkSync(tempPath);

  return upload.secure_url;
};
