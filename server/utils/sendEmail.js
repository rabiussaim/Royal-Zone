const nodemailer = require('nodemailer');

// Initialize transporter using SMTP variables from env
const getTransporter = () => {
  const host = process.env.EMAIL_HOST;
  const port = process.env.EMAIL_PORT || 587;
  const user = process.env.EMAIL_USER;
  const pass = process.env.EMAIL_PASS;

  const isConfigured = host && user && pass && !user.includes('PLACEHOLDER');

  if (isConfigured) {
    return nodemailer.createTransport({
      host,
      port: parseInt(port, 10),
      secure: parseInt(port, 10) === 465, // true for 465, false for other ports
      auth: { user, pass }
    });
  }
  return null;
};

/**
 * Sends a notification email to the owner when a new order is placed
 * @param {Object} order - Order details from Mongoose
 */
const sendOrderNotification = async (order) => {
  const ownerEmail = 'saimlinkedin0000@gmail.com';
  const transporter = getTransporter();

  // Format order items into HTML rows
  const itemsHtml = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #eee;">
        <strong>${item.title}</strong>
        ${item.size ? `<br><small style="color: #666;">Size: ${item.size}</small>` : ''}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">PKR ${item.price.toLocaleString()}</td>
      <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">PKR ${(item.price * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  // Email subject and body
  const subject = `👑 New Order Received: ${order.orderNumber}`;
  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
      <div style="background-color: #0A0F1E; padding: 25px; text-align: center; color: white; border-bottom: 3px solid #C9A96E;">
        <h1 style="margin: 0; font-family: 'Playfair Display', Georgia, serif; letter-spacing: 2px;">ROYAL ZONE</h1>
        <p style="margin: 5px 0 0 0; color: #C9A96E; font-size: 14px; font-weight: bold; text-transform: uppercase;">New Order Notification</p>
      </div>
      
      <div style="padding: 25px; background-color: #fff; color: #333;">
        <h2 style="margin-top: 0; color: #0A0F1E; border-bottom: 1px solid #eee; padding-bottom: 10px;">Order Details</h2>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
          <tr>
            <td style="padding: 5px 0; color: #666;">Order Number:</td>
            <td style="padding: 5px 0; font-weight: bold; text-align: right; color: #C9A96E;">${order.orderNumber}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666;">Payment Method:</td>
            <td style="padding: 5px 0; font-weight: bold; text-align: right; text-transform: uppercase;">${order.paymentMethod}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666;">Payment Status:</td>
            <td style="padding: 5px 0; font-weight: bold; text-align: right; text-transform: uppercase; color: ${order.paymentStatus === 'paid' ? '#2e7d32' : '#e65100'};">${order.paymentStatus}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666;">Date:</td>
            <td style="padding: 5px 0; text-align: right;">${new Date(order.createdAt).toLocaleString()}</td>
          </tr>
        </table>

        <h3 style="color: #0A0F1E; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 25px;">Shipping Address</h3>
        <p style="margin: 5px 0; line-height: 1.5;">
          <strong>Name:</strong> ${order.shippingAddress.name}<br>
          <strong>Street:</strong> ${order.shippingAddress.street}<br>
          <strong>City:</strong> ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
          <strong>Phone:</strong> ${order.shippingAddress.phone}
        </p>

        <h3 style="color: #0A0F1E; border-bottom: 1px solid #eee; padding-bottom: 8px; margin-top: 25px;">Items Summary</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px;">
          <thead>
            <tr style="background-color: #f9f9f9;">
              <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: left;">Product</th>
              <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: center;">Qty</th>
              <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: right;">Price</th>
              <th style="padding: 8px; border-bottom: 2px solid #ddd; text-align: right;">Total</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <table style="width: 100%; margin-top: 15px; font-size: 15px; border-top: 2px solid #ddd; padding-top: 10px;">
          <tr>
            <td style="padding: 5px 0; color: #666;">Subtotal:</td>
            <td style="padding: 5px 0; text-align: right;">PKR ${order.subtotal.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666;">Shipping Cost:</td>
            <td style="padding: 5px 0; text-align: right;">PKR ${order.shippingCost.toLocaleString()}</td>
          </tr>
          <tr>
            <td style="padding: 5px 0; color: #666;">Tax (17% GST):</td>
            <td style="padding: 5px 0; text-align: right;">PKR ${order.tax.toLocaleString()}</td>
          </tr>
          <tr style="font-size: 18px; font-weight: bold; color: #C9A96E;">
            <td style="padding: 10px 0 5px 0;">Grand Total:</td>
            <td style="padding: 10px 0 5px 0; text-align: right;">PKR ${order.total.toLocaleString()}</td>
          </tr>
        </table>
        
        ${order.notes ? `
          <div style="margin-top: 20px; padding: 10px; background-color: #fff9c4; border-left: 4px solid #fbc02d; border-radius: 4px; font-size: 13px;">
            <strong>Order Notes:</strong> ${order.notes}
          </div>
        ` : ''}
      </div>

      <div style="background-color: #f5f5f5; padding: 15px; text-align: center; font-size: 12px; color: #888; border-top: 1px solid #eee;">
        This is an automated notification from your Royal Zone dashboard.
      </div>
    </div>
  `;

  if (transporter) {
    try {
      const mailOptions = {
        from: `"${process.env.EMAIL_FROM || 'Royal Zone Notifications'}" <${process.env.EMAIL_USER}>`,
        to: ownerEmail,
        subject,
        html: htmlContent
      };
      await transporter.sendMail(mailOptions);
      console.log(`✉️ Order notification email sent successfully to ${ownerEmail}`);
    } catch (err) {
      console.error('❌ Failed to send order notification email:', err.message);
    }
  } else {
    // Falls back to logging to console in development/no credentials mode
    console.log('\n============================================================');
    console.log('✉️  SIMULATED EMAIL NOTIFICATION (No SMTP Configured in server/.env)');
    console.log(`To: ${ownerEmail}`);
    console.log(`Subject: ${subject}`);
    console.log(`Customer: ${order.shippingAddress.name} (${order.shippingAddress.phone})`);
    console.log(`Items: ${order.items.length} product(s)`);
    console.log(`Grand Total: PKR ${order.total.toLocaleString()}`);
    console.log('============================================================\n');
  }
};

module.exports = {
  sendOrderNotification
};
