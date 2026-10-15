import assert from 'node:assert/strict';
import { buildOrderInvoicePdf } from '../src/features/orders/invoice';
import type { ProductOrder } from '../src/features/orders/ordersApi';

const context = { fillRect() {}, fillText() {}, measureText(value: string) { return { width: value.length * 12 }; } };
const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xd9]).toString('base64');
globalThis.document = { createElement: () => ({ width: 0, height: 0, getContext: () => context, toDataURL: () => `data:image/jpeg;base64,${jpeg}` }) } as unknown as Document;

const order: ProductOrder = {
  id: 1, orderNumber: 'ORD-TD-123456', customerName: 'Invoice Customer', email: 'customer@example.invalid', phone: '123456789',
  address: '123 Main Street', city: 'Boston', postalCode: '02101',
  items: Array.from({ length: 6 }, (_, index) => ({ productId: index + 1, name: `Product ${index + 1}`, sku: `SKU-${index + 1}`, quantity: 1, unitPrice: 20, image: null })),
  subtotal: 120, shipping: 0, tax: 9.9, total: 129.9, status: 'PENDING', statusNote: null, history: [],
  createdAt: '2026-10-15T00:00:00.000Z', updatedAt: '2026-10-15T00:00:00.000Z',
};
const pdf = buildOrderInvoicePdf(order);
const ascii = new TextDecoder('latin1').decode(pdf);
assert.ok(ascii.startsWith('%PDF-1.4\n'));
assert.ok(ascii.includes('/Count 2'), 'Six products must span two invoice pages.');
const xrefOffset = Number(ascii.match(/startxref\n(\d+)\n/)?.[1]);
const xref = new TextDecoder().decode(pdf.subarray(xrefOffset));
assert.ok(xref.startsWith('xref\n0 9\n'), 'The cross reference table must include every PDF object.');
const entries = xref.split('\n').slice(2, 11);
for (let id = 1; id <= 8; id++) {
  const offset = Number(entries[id].slice(0, 10));
  const header = `${id} 0 obj\n`;
  assert.equal(new TextDecoder().decode(pdf.subarray(offset, offset + header.length)), header);
}
console.log('Invoice PDF structure checks passed.');
