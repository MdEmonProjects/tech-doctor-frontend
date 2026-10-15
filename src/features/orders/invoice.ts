import { money } from '../products/productsApi';
import { orderStatusLabels, type ProductOrder } from './ordersApi';

const width = 1240;
const height = 1754;
const itemsPerPage = 5;
const encoder = new TextEncoder();

function lines(context: CanvasRenderingContext2D, value: string, maxWidth: number) {
  const result: string[] = [];
  let line = '';
  for (const word of value.split(/\s+/)) {
    if (context.measureText(word).width > maxWidth) {
      if (line) { result.push(line); line = ''; }
      for (const character of word) {
        if (context.measureText(line + character).width > maxWidth && line) { result.push(line); line = character; }
        else line += character;
      }
      continue;
    }
    const next = line ? `${line} ${word}` : word;
    if (context.measureText(next).width > maxWidth && line) { result.push(line); line = word; }
    else line = next;
  }
  if (line) result.push(line);
  return result;
}

function drawPage(order: ProductOrder, page: number, pages: number): Uint8Array {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Could not create the invoice.');
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.fillStyle = '#111827';
  context.font = 'bold 44px Arial, sans-serif';
  context.fillText('TECH DOCTOR', 76, 103);
  context.font = 'bold 38px Arial, sans-serif';
  context.textAlign = 'right';
  context.fillText('INVOICE', width - 76, 103);
  context.textAlign = 'left';
  context.fillStyle = '#475569';
  context.font = '24px Arial, sans-serif';
  context.fillText(order.orderNumber, 76, 148);
  context.textAlign = 'right';
  context.fillText(`Page ${page + 1} of ${pages}`, width - 76, 148);
  context.textAlign = 'left';
  context.fillStyle = '#e2e8f0';
  context.fillRect(76, 180, width - 152, 2);

  context.fillStyle = '#64748b';
  context.font = 'bold 22px Arial, sans-serif';
  context.fillText('BILL TO', 76, 240);
  context.fillText('ORDER DETAILS', 650, 240);
  context.fillStyle = '#111827';
  context.font = 'bold 28px Arial, sans-serif';
  context.fillText(order.customerName, 76, 283);
  context.font = '24px Arial, sans-serif';
  context.fillText(order.email, 76, 323);
  if (order.phone) context.fillText(order.phone, 76, 363);
  lines(context, `${order.address}, ${order.city} ${order.postalCode}`, 490).slice(0, 2).forEach((line, index) => context.fillText(line, 76, 403 + index * 32));
  context.fillText(`Placed: ${new Date(order.createdAt).toLocaleString()}`, 650, 283);
  context.fillText(`Status: ${orderStatusLabels[order.status]}`, 650, 323);
  context.fillText('Currency: USD', 650, 363);

  context.fillStyle = '#f1f5f9';
  context.fillRect(76, 478, width - 152, 62);
  context.fillStyle = '#334155';
  context.font = 'bold 23px Arial, sans-serif';
  context.fillText('PRODUCT', 96, 518);
  context.textAlign = 'right';
  context.fillText('QTY', 827, 518);
  context.fillText('UNIT', 999, 518);
  context.fillText('AMOUNT', 1144, 518);
  context.textAlign = 'left';

  const start = page * itemsPerPage;
  order.items.slice(start, start + itemsPerPage).forEach((item, index) => {
    const top = 555 + index * 168;
    context.fillStyle = '#e2e8f0';
    context.fillRect(76, top + 154, width - 152, 1);
    context.fillStyle = '#111827';
    context.font = 'bold 19px Arial, sans-serif';
    const nameLines = lines(context, item.name, 620);
    nameLines.slice(0, 6).forEach((line, lineIndex) => context.fillText(line, 96, top + 28 + lineIndex * 22));
    if (item.sku) {
      context.fillStyle = '#64748b';
      context.font = '18px Arial, sans-serif';
      context.fillText(`Code: ${item.sku}`, 96, top + 148);
    }
    context.fillStyle = '#111827';
    context.font = '23px Arial, sans-serif';
    context.textAlign = 'right';
    context.fillText(String(item.quantity), 827, top + 44);
    context.fillText(money(item.unitPrice), 999, top + 44);
    context.fillText(money(item.unitPrice * item.quantity), 1144, top + 44);
    context.textAlign = 'left';
  });

  if (page === pages - 1) {
    const totals = [['Subtotal', order.subtotal], ['Shipping', order.shipping], ['Tax', order.tax], ['Total', order.total]] as const;
    totals.forEach(([label, value], index) => {
      const y = 1474 + index * 47;
      context.fillStyle = index === totals.length - 1 ? '#111827' : '#475569';
      context.font = `${index === totals.length - 1 ? 'bold ' : ''}25px Arial, sans-serif`;
      context.fillText(label, 780, y);
      context.textAlign = 'right';
      context.fillText(money(value), 1144, y);
      context.textAlign = 'left';
    });
  }
  context.fillStyle = '#64748b';
  context.font = '21px Arial, sans-serif';
  context.fillText('Payment is arranged separately. This invoice does not confirm payment.', 76, 1710);
  const binary = atob(canvas.toDataURL('image/jpeg', 0.9).split(',')[1]);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

export function buildOrderInvoicePdf(order: ProductOrder): Uint8Array {
  const pages = Math.max(1, Math.ceil(order.items.length / itemsPerPage));
  const chunks: Uint8Array[] = [];
  const offsets = [0];
  let length = 0;
  const append = (part: string | Uint8Array) => {
    const bytes = typeof part === 'string' ? encoder.encode(part) : part;
    chunks.push(bytes);
    length += bytes.length;
  };
  const object = (id: number, value: string | Uint8Array, ending = '\nendobj\n') => {
    offsets[id] = length;
    append(`${id} 0 obj\n`);
    append(value);
    append(ending);
  };
  append('%PDF-1.4\n');
  object(1, '<< /Type /Catalog /Pages 2 0 R >>');
  object(2, `<< /Type /Pages /Kids [${Array.from({ length: pages }, (_, index) => `${3 + index * 3} 0 R`).join(' ')}] /Count ${pages} >>`);
  for (let index = 0; index < pages; index++) {
    const pageId = 3 + index * 3;
    const contentId = pageId + 1;
    const imageId = pageId + 2;
    const image = drawPage(order, index, pages);
    const commands = `q\n595 0 0 842 0 0 cm\n/Im0 Do\nQ\n`;
    object(pageId, `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im0 ${imageId} 0 R >> >> /Contents ${contentId} 0 R >>`);
    object(contentId, `<< /Length ${encoder.encode(commands).length} >>\nstream\n${commands}endstream`);
    offsets[imageId] = length;
    append(`${imageId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.length} >>\nstream\n`);
    append(image);
    append('\nendstream\nendobj\n');
  }
  const xref = length;
  append(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`);
  for (const offset of offsets.slice(1)) append(`${String(offset).padStart(10, '0')} 00000 n \n`);
  append(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`);
  const result = new Uint8Array(length);
  let position = 0;
  for (const chunk of chunks) { result.set(chunk, position); position += chunk.length; }
  return result;
}

export function downloadOrderInvoice(order: ProductOrder) {
  const pdf = buildOrderInvoicePdf(order);
  const blob = new Blob([pdf], { type: 'application/pdf' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${order.orderNumber}-invoice.pdf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}
