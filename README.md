# AspireMultirepo.Portal

Frontend web de gestión de **Clientes** y **Pedidos**, implementado como prueba de concepto para validar la orquestación de **.NET Aspire en modo multirepo**. Forma parte de una solución compuesta por cuatro repositorios independientes: este portal, [AspireMultirepo.Clientes](https://github.com/RublenX/AspireMultirepo.Clientes), [AspireMultirepo.Pedidos](https://github.com/RublenX/AspireMultirepo.Pedidos) y [AspireMultirepo.Orchestrator](https://github.com/RublenX/AspireMultirepo.Orchestrator) (AppHost de Aspire).

> Este repositorio puede arrancarse de forma aislada con `npm run dev` apuntando manualmente las URLs de los microservicios, pero el flujo habitual es lanzarlo desde el AppHost de Aspire del repo `Orchestrator`, que lo inicia automáticamente y le inyecta las URLs de ClientesApi y PedidosApi.

## Stack técnico

- **React 19** + **TypeScript**
- **Vite** (servidor de desarrollo con proxy inverso configurable)
- **react-router-dom v7** (SPA con rutas del lado del cliente)
- Puerto fijo `54577`

## Estructura del repositorio

```
src/portalweb/
├── src/
│   ├── api/            Funciones fetch contra ClientesApi y PedidosApi
│   ├── components/     Navbar compartida
│   ├── pages/
│   │   ├── clientes/   Lista + formulario de alta/edición de clientes
│   │   └── pedidos/    Lista + formulario de alta/edición de pedidos
│   └── types/          Interfaces TypeScript (Cliente, Pedido, PedidoRequest)
├── vite.config.ts      Proxy inverso hacia los microservicios
└── portalweb.esproj    Referencia para el AppHost de Aspire
```

## Funcionalidades

- **Clientes**: listado con búsqueda por nombre, alta, edición y eliminación. Badge VIP/Regular.
- **Pedidos**: listado con búsqueda por nombre de cliente, alta, edición y eliminación. Formato de fecha `dd/mm/aaaa` y total en EUR. El portal solo envía `idCliente` al crear/editar — el microservicio de Pedidos resuelve el nombre internamente.

## Proxy y variables de entorno

`vite.config.ts` redirige:
- `/api/cliente` → `services__clientesapi__https__0` (o `https://localhost:7000` como fallback)
- `/api/pedidos` → `services__pedidosapi__https__0` (o `https://localhost:7001` como fallback)

Cuando se lanza desde el AppHost de Aspire, este inyecta las variables `services__clientesapi__*` y `services__pedidosapi__*` en el proceso Node.js, que Vite lee al arrancar.

## Cómo ejecutar de forma aislada

```bash
cd src/portalweb
npm install       # solo la primera vez
npm run dev       # arranca en http://localhost:54577
```

Se necesita que ClientesApi y PedidosApi estén en ejecución en los puertos de fallback (`7000` y `7001`) o modificar `vite.config.ts` para apuntar a las URLs correctas.
