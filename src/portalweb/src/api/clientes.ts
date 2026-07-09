import type { Cliente } from '../types/cliente';

const BASE = '/api/cliente';

async function checkResponse(res: Response): Promise<void> {
  if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
}

export async function getClientes(): Promise<Cliente[]> {
  const res = await fetch(BASE);
  await checkResponse(res);
  return res.json();
}

export async function getCliente(id: number): Promise<Cliente> {
  const res = await fetch(`${BASE}/${id}`);
  await checkResponse(res);
  return res.json();
}

export async function createCliente(data: Omit<Cliente, 'id'>): Promise<Cliente> {
  const res = await fetch(BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await checkResponse(res);
  return res.json();
}

export async function updateCliente(id: number, data: Cliente): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  await checkResponse(res);
}

export async function deleteCliente(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, { method: 'DELETE' });
  await checkResponse(res);
}
