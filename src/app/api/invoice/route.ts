import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

interface InvoiceItem {
  sNo: number;
  itemName: string;
  packSize: string;
  quantity: number;
  price: number;
}

interface InvoiceData {
  invoiceNo: string;
  date: string;
  paymentMode: string;
  customerName: string;
  addressLine1: string;
  addressLine2: string;
  cityStatePin: string;
  mobile: string;
  items: InvoiceItem[];
  subtotal: number;
  deliveryCharges: string;
  totalPayable: number;
  amountInWords: string;
}

export async function POST(req: NextRequest) {
  try {
    const data: InvoiceData = await req.json();

    // Loops through separate rows so mixed weights (100g, 250g, etc.) display cleanly
    const tableRows = data.items
      .map(
        (item) => `
        <tr>
          <td style="text-align: center;">${item.sNo}</td>
          <td><span style="font-weight: bold; color: #222222;">${item.itemName}</span></td>
          <td style="text-align: center;">${item.packSize}</td>
          <td style="text-align: center;">${item.quantity} </td>
          <td style="text-align: right;">${item.price.toFixed(2)}</td>
        </tr>
      `
      )
      .join('');

    // Exact Snakzee HTML blueprint with custom layout rules applied
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <style>
              *, *::before, *::after { box-sizing: border-box; }
              @page {
                  size: A4;
                  margin: 15mm 12mm 20mm 12mm;
                  @bottom-right {
                      content: "Page 1 of 1";
                      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                      font-size: 8.5pt;
                      color: #777777;
                  }
              }
              body {
                  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
                  color: #333333;
                  margin: 0; padding: 0;
                  font-size: 10pt; line-height: 1.4;
                  background-color: #ffffff;
              }
              .invoice-container { width: 100%; max-width: 100%; }
              .invoice-header { border-bottom: 3px solid #E63A12; padding-bottom: 18px; margin-bottom: 20px; }
              .header-table { width: 100%; border-collapse: collapse; }
              .header-table td { vertical-align: top; padding: 0; }
              .brand-title { font-size: 28pt; font-weight: bold; color: #E63A12; margin: 0; line-height: 0.95; }
              .brand-tagline { font-size: 8.5pt; font-weight: bold; color: #4A1204; margin-top: 4px; margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
              .invoice-title-block { text-align: right; }
              .invoice-title { font-size: 22pt; font-weight: bold; color: #E63A12; margin: 0; text-transform: uppercase; letter-spacing: 0.5px; }
              .invoice-meta { margin-top: 8px; font-size: 9.5pt; color: #444444; line-height: 1.5; }
              .addresses-table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
              .addresses-table td { width: 50%; vertical-align: top; padding: 12px; border: 1px solid #FFE4DE; border-radius: 4px; }
              .addresses-table td.from-box { background-color: #FFFDFD; border-right: none; border-top-right-radius: 0; border-bottom-right-radius: 0; }
              .addresses-table td.ship-box { background-color: #FFFAF9; border-top-left-radius: 0; border-bottom-left-radius: 0; }
              .section-heading { font-size: 9.5pt; font-weight: bold; color: #E63A12; text-transform: uppercase; border-bottom: 1px solid #FFE4DE; padding-bottom: 5px; margin-bottom: 8px; letter-spacing: 0.5px; }
              
              /* Prevents Country/Pincode from wrapping to next line */
              .address-box { font-size: 9.5pt; color: #555555; line-height: 1.5; white-space: nowrap; }
              
              .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; margin-top: 10px; }
              .items-table th { background-color: #E63A12; color: #ffffff; font-weight: bold; font-size: 9.5pt; text-align: left; padding: 10px 12px; text-transform: uppercase; }
              .items-table td { padding: 11px 12px; border-bottom: 1px solid #F6EFEF; font-size: 9.5pt; vertical-align: middle; }
              .items-table tr:nth-child(even) td { background-color: #FFFAF9; }
              .totals-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
              .totals-table td { padding: 0; vertical-align: top; }
              .terms-cell { width: 55%; padding-right: 25px; }
              .summary-cell { width: 45%; }
              .inner-summary-table { width: 100%; border-collapse: collapse; }
              .inner-summary-table td { padding: 8px 12px; font-size: 10pt; border-bottom: 1px solid #F6EFEF; }
              .inner-summary-table td.label { text-align: right; color: #555555; }
              .inner-summary-table td.value { text-align: right; font-weight: bold; width: 120px; }
              .inner-summary-table tr.grand-total td { background-color: #FFEBE7; border-top: 2px solid #E63A12; border-bottom: 2px double #E63A12; font-weight: bold; color: #E63A12; font-size: 12pt; }
              .terms-title { font-size: 9pt; font-weight: bold; color: #4A1204; margin-bottom: 6px; text-transform: uppercase; letter-spacing: 0.3px; }
              
              /* Shrunken, compact terms font layout formatting */
              .terms-list { margin: 0; padding-left: 14px; font-size: 8pt; color: #555555; line-height: 1.5; }
              .terms-list li { margin-bottom: 4px; }
              
              .amount-words { margin-top: 12px; font-size: 8.5pt; font-style: italic; color: #444444; background-color: #FFFAF9; padding: 7px 11px; border-left: 3px solid #E63A12; border-radius: 2px; }
              .footer-note { margin-top: 45px; text-align: center; font-size: 9pt; color: #777777; border-top: 1px solid #F6EFEF; padding-top: 15px; }
              .thank-you { font-family: Georgia, serif; font-size: 15pt; color: #E63A12; font-style: italic; margin-top: 4px; font-weight: bold; }
              .logo-svg-container { display: inline-block; margin-right: 12px; vertical-align: top; }
          </style>
      </head>
      <body>
      <div class="invoice-container">
          <div class="invoice-header">
              <table class="header-table">
                  <tr>
                      <td>
                          <div class="logo-svg-container">
                              <svg width="60" height="45" viewBox="0 0 100 75" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M85,30 C95,20 98,5 85,2 C72,-1 65,15 62,25 C55,20 45,22 40,28 C32,25 20,30 18,38 C15,45 22,55 35,58 C45,60 55,55 60,48 C65,58 78,60 85,52 C95,42 90,35 85,30 Z" fill="#E63A12"/>
                                  <circle cx="48" cy="32" r="3" fill="#ffffff"/>
                                  <circle cx="72" cy="35" r="4" fill="#E63A12"/>
                                  <circle cx="78" cy="28" r="3" fill="#E63A12"/>
                              </svg>
                          </div>
                          <div class="logo-text-group">
                              <div class="brand-title">Snakzee</div>
                              <div class="brand-tagline">Art of Authentic Snacking</div>
                          </div>
                          <div style="font-size: 9pt; color: #555555; margin-top: 8px; line-height: 1.5;">
                              <strong>Snakzee Foods India Pvt Ltd</strong><br>
                              FSSAI Lic. No.: 20126191000174<br>
                              Phone: +91 95055 50051 | Email: support@snakzee.com<br>
                              Website: www.snakzee.com
                          </div>
                      </td>
                      <td class="invoice-title-block">
                          <div class="invoice-title">Order Invoice</div>
                          <div class="invoice-meta">
                              <strong>Invoice No:</strong> ${data.invoiceNo}<br>
                              <strong>Date:</strong> ${data.date}<br>
                              <strong>Payment Mode:</strong> ${data.paymentMode}
                          </div>
                      </td>
                  </tr>
              </table>
          </div>

          <table class="addresses-table">
              <tr>
                  <td class="from-box">
                      <div class="section-heading">From Address</div>
                      <div class="address-box">
                          <strong>Snakzee Foods India Pvt Ltd</strong><br>
                          57/14-A Sri Raghavendra Swamy Temple,<br>
                          Kurnool, Andhra Pradesh – 518001, India<br>
                          <strong>Phone:</strong> +91 95055 50051
                      </div>
                  </td>
                  <td class="ship-box">
                      <div class="section-heading">Shipping Address</div>
                      <div class="address-box">
                          <strong>${data.customerName}</strong><br>
                          ${data.addressLine1},<br>
                          ${data.addressLine2}<br>
                          ${data.cityStatePin}, India<br>
                          <strong>Mobile:</strong> ${data.mobile}
                      </div>
                  </td>
              </tr>
          </table>

          <table class="items-table">
              <thead>
                  <tr>
                      <th style="width: 8%; text-align: center;">S.No.</th>
                      <th style="width: 44%;">Item Name</th>
                      <th style="width: 18%; text-align: center;">Pack Size</th>
                      <th style="width: 12%; text-align: center;">Quantity</th>
                      <th style="width: 18%; text-align: right;">Price (₹)</th>
                  </tr>
              </thead>
              <tbody>
                  ${tableRows}
              </tbody>
          </table>

          <table class="totals-table">
              <tr>
                  <td class="terms-cell">
                      <div class="terms-title">Terms & Conditions</div>
                      <ul class="terms-list">
                          <li>Once we receive the order, we will start preparing it.</li>
                          <li>It will take 3-4 days to prepare the order based on the order size.</li>
                          <li>Your order will be dispatched the next day once it is packed safely.</li>
                          <li>We will share the tracking details through WhatsApp once we ship the order.</li>
                          <li>Estimated delivery time will depend on your shipping location and courier availability.</li>
                      </ul>
                      <div class="amount-words">
                          <strong>Total Amount in Words:</strong> ${data.amountInWords}
                      </div>
                  </td>
                  <td class="summary-cell">
                      <table class="inner-summary-table">
                          <tr><td class="label">Subtotal</td><td class="value">${data.subtotal.toFixed(2)}</td></tr>
                          <tr><td class="label">Delivery Charges</td><td class="value" style="color: green;">${data.deliveryCharges}</td></tr>
                          <tr class="grand-total"><td class="label">TOTAL PAYABLE:</td><td class="value">₹${data.totalPayable.toFixed(2)}</td></tr>
                      </table>
                  </td>
              </tr>
          </table>

          <div class="footer-note">
              This is an electronically generated invoice and requires no physical signature.<br>
              <div class="thank-you">Thank you!!</div>
          </div>
      </div>
      </body>
      </html>
    `;

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setContent(htmlTemplate, { waitUntil: 'load' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true
    });

    await browser.close();

    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename=invoice_${data.invoiceNo}.pdf`,
      },
    });

  } catch (error) {
    console.error('PDF Error:', error);
    return NextResponse.json({ success: false, error: 'Failed rendering invoice' }, { status: 500 });
  }
}