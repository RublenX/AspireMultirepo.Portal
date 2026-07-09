export interface Pedido {
  id: number;
  idCliente: number;
  cliente: string;
  fecha: string;
  total: number;
}

export interface PedidoRequest {
  idCliente: number;
  fecha: string;
  total: number;
}
