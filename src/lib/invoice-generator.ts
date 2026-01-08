import jsPDF from 'jspdf';

interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

interface InvoiceData {
  invoiceNumber: string;
  date: Date;
  dueDate?: Date;
  customer: {
    name: string;
    email?: string;
    phone?: string;
    address?: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  notes?: string;
  companyName?: string;
  companyAddress?: string;
}

export function generateInvoicePDF(data: InvoiceData): jsPDF {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Colors
  const primaryColor = '#6366f1';
  const textColor = '#1f2937';
  const mutedColor = '#6b7280';

  // Header
  doc.setFontSize(24);
  doc.setTextColor(primaryColor);
  doc.text(data.companyName || 'TioraS Studio', 20, 30);

  doc.setFontSize(10);
  doc.setTextColor(mutedColor);
  doc.text(data.companyAddress || 'Premium Fashion House', 20, 38);

  // Invoice Title
  doc.setFontSize(32);
  doc.setTextColor(textColor);
  doc.text('INVOICE', pageWidth - 20, 30, { align: 'right' });

  doc.setFontSize(10);
  doc.setTextColor(mutedColor);
  doc.text(`#${data.invoiceNumber}`, pageWidth - 20, 38, { align: 'right' });

  // Line separator
  doc.setDrawColor(primaryColor);
  doc.setLineWidth(0.5);
  doc.line(20, 50, pageWidth - 20, 50);

  // Bill To Section
  let yPos = 65;
  doc.setFontSize(12);
  doc.setTextColor(mutedColor);
  doc.text('Bill To:', 20, yPos);

  doc.setFontSize(14);
  doc.setTextColor(textColor);
  doc.text(data.customer.name, 20, yPos + 8);

  doc.setFontSize(10);
  doc.setTextColor(mutedColor);
  if (data.customer.email) {
    doc.text(data.customer.email, 20, yPos + 16);
  }
  if (data.customer.phone) {
    doc.text(data.customer.phone, 20, yPos + 24);
  }
  if (data.customer.address) {
    doc.text(data.customer.address, 20, yPos + 32);
  }

  // Invoice Details (Right side)
  doc.setFontSize(10);
  doc.setTextColor(mutedColor);
  doc.text('Invoice Date:', pageWidth - 70, yPos);
  doc.text('Due Date:', pageWidth - 70, yPos + 10);

  doc.setTextColor(textColor);
  doc.text(data.date.toLocaleDateString(), pageWidth - 20, yPos, { align: 'right' });
  doc.text(data.dueDate?.toLocaleDateString() || 'On Receipt', pageWidth - 20, yPos + 10, { align: 'right' });

  // Items Table
  yPos = 110;
  
  // Table Header
  doc.setFillColor(primaryColor);
  doc.rect(20, yPos, pageWidth - 40, 10, 'F');
  
  doc.setFontSize(10);
  doc.setTextColor('#ffffff');
  doc.text('Item', 25, yPos + 7);
  doc.text('Qty', 110, yPos + 7);
  doc.text('Price', 135, yPos + 7);
  doc.text('Total', pageWidth - 25, yPos + 7, { align: 'right' });

  // Table Rows
  yPos += 15;
  doc.setTextColor(textColor);

  data.items.forEach((item, index) => {
    const rowY = yPos + (index * 12);
    
    if (index % 2 === 0) {
      doc.setFillColor('#f9fafb');
      doc.rect(20, rowY - 5, pageWidth - 40, 12, 'F');
    }

    doc.text(item.name.substring(0, 40), 25, rowY + 3);
    doc.text(item.quantity.toString(), 110, rowY + 3);
    doc.text(`₹${item.price.toFixed(2)}`, 135, rowY + 3);
    doc.text(`₹${item.total.toFixed(2)}`, pageWidth - 25, rowY + 3, { align: 'right' });
  });

  // Totals
  yPos = yPos + (data.items.length * 12) + 15;

  doc.setDrawColor('#e5e7eb');
  doc.line(pageWidth - 80, yPos, pageWidth - 20, yPos);

  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(mutedColor);
  doc.text('Subtotal:', pageWidth - 80, yPos);
  doc.setTextColor(textColor);
  doc.text(`₹${data.subtotal.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' });

  yPos += 10;
  doc.setTextColor(mutedColor);
  doc.text(`Tax (${data.taxRate}%):`, pageWidth - 80, yPos);
  doc.setTextColor(textColor);
  doc.text(`₹${data.tax.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' });

  yPos += 5;
  doc.setDrawColor(primaryColor);
  doc.line(pageWidth - 80, yPos, pageWidth - 20, yPos);

  yPos += 12;
  doc.setFontSize(14);
  doc.setTextColor(primaryColor);
  doc.text('Total:', pageWidth - 80, yPos);
  doc.text(`₹${data.total.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' });

  // Notes
  if (data.notes) {
    yPos += 30;
    doc.setFontSize(10);
    doc.setTextColor(mutedColor);
    doc.text('Notes:', 20, yPos);
    doc.setTextColor(textColor);
    doc.text(data.notes, 20, yPos + 8);
  }

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(mutedColor);
  doc.text('Thank you for your business!', pageWidth / 2, 280, { align: 'center' });

  return doc;
}

export function downloadInvoice(data: InvoiceData) {
  const doc = generateInvoicePDF(data);
  doc.save(`invoice-${data.invoiceNumber}.pdf`);
}

export function previewInvoice(data: InvoiceData): string {
  const doc = generateInvoicePDF(data);
  return doc.output('datauristring');
}
