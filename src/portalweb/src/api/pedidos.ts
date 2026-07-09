import type { Pedido, PedidoRequest } from '../types/pedido';

const BASE = '/api/pedidos';

async function checkResponse(res: Response): Promise<void> {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
}

export async function getPedidos(): Promise<Pedido[]> {
  const res = await fetch(BASE);
  await checkResponse(res);
  return res.json();
}

export async function getPedido(id: number): Promise<Pedido> {
  const res = await fetch(`${BASE}/${id}`);
  await checkResponse(res);
  return res.json();
}

export async function createPedido(data: PedidoRequest): Promise<Pedido> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await checkResponse(res);
  return res.json();
}

export async function updatePedido(id: number, data: PedidoRequest): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await checkResponse(res);
}

export async function deletePedido(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  await checkResponse(res);
}
