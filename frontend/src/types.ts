// ==================== USUARIO ====================
export interface Rol {
	id_rol: number;
	nombre_rol: string;
}

export interface Usuario {
	id_usuario: number;
	username: string;
	nombres: string;
	apellido_paterno: string;
	apellido_materno?: string;
}

export interface UsuarioCreate {
	username: string;
	password: string;
	nombres: string;
	apellido_paterno: string;
	apellido_materno?: string;
	roles: number[];
}

// ==================== CLIENTE ====================
export interface Cliente {
	id_cliente: number;
	nro_doc: string;
	tipo_doc: string;
	nombres: string;
	apellido_paterno: string;
	apellido_materno?: string;
	correo?: string;
	direccion?: string;
}

export interface ClienteCreate {
	nro_doc: string;
	tipo_doc: string;
	nombres: string;
	apellido_paterno: string;
	apellido_materno?: string;
	correo?: string;
	direccion?: string;
	telefonos: string[];
}

// ==================== PROVEEDOR ====================
export interface Cargo {
	id_cargo: number;
	descripcion: string;
}

export interface Proveedor {
	id_proveedor: number;
	ruc: string;
	razon_social: string;
	direccion_empresa?: string;
	telefono_empresa?: string;
	correo_empresa?: string;
}

export interface ProveedorCreate {
	ruc: string;
	razon_social: string;
	direccion_empresa?: string;
	telefono_empresa?: string;
	correo_empresa?: string;
}

export interface ContactoProveedor {
	id_contacto: number;
	id_proveedor: number;
	id_cargo: number;
	nombres: string;
	apellido_paterno: string;
	apellido_materno?: string;
	telefono_contacto?: string;
}

// ==================== PRODUCTO ====================
export interface Categoria {
	id_categoria: number;
	nombre_categoria: string;
}

export interface Presentacion {
	id_presentacion: number;
	desc_presentacion: string;
}

export interface Componente {
	id_componente: number;
	nombre_componente: string;
}

export interface Producto {
	id_producto: number;
	codigo_interno: string;
	nombre_comercial: string;
	precio_venta: number;
	afecta_igv: boolean;
	requiere_receta: boolean;
}

export interface ProductoCreate {
	codigo_interno: string;
	nombre_comercial: string;
	precio_venta: number;
	afecta_igv: boolean;
	requiere_receta: boolean;
	categorias: number[];
	presentaciones: number[];
	componentes: number[];
}

export interface ProductoUpdate {
	codigo_interno?: string;
	nombre_comercial?: string;
	precio_venta?: number;
	afecta_igv?: boolean;
	requiere_receta?: boolean;
}

// ==================== INVENTARIO ====================
export interface UbicacionEstante {
	id_ubicacion_estante: number;
	estante: string;
	nivel: string;
}

export interface Lote {
	id_lote: number;
	id_producto: number;
	codigo_lote: string;
	fecha_vencimiento: string;
	cantidad_recibida: number;
	costo_unitario_compra: number;
}

export interface Inventario {
	id_inventario: number;
	id_lote: number;
	id_ubicacion_estante: number;
	stock_actual: number;
}

export interface InventarioCreate {
	id_lote: number;
	id_ubicacion_estante: number;
	stock_actual: number;
}

// ==================== PEDIDO ====================
export interface EstadoPedido {
	id_estado_pedido: number;
	descripcion: string;
}

export interface MotivoPedido {
	id_motivo_pedido: number;
	descripcion: string;
}

export interface DetallePedidoItem {
	id_producto: number;
	cantidad_solicitada: number;
}

export interface Pedido {
	id_pedido: number;
	id_proveedor: number;
	id_usuario: number;
	id_estado_pedido: number;
	id_motivo_pedido: number;
	fecha_solicitud: string;
	fecha_entrega_estimada?: string;
	motivo?: string;
}

export interface PedidoCreate {
	id_proveedor: number;
	id_estado_pedido: number;
	id_motivo_pedido: number;
	fecha_solicitud: string;
	fecha_entrega_estimada?: string;
	motivo?: string;
	detalles: DetallePedidoItem[];
}

// ==================== COMPRA ====================
export interface Compra {
	id_compra: number;
	id_pedido: number;
	fecha_recepcion: string;
	nro_guia?: string;
	tipo_comprobante?: string;
	nro_comprobante?: string;
	monto_total: number;
	estado: string;
	fecha_pago?: string;
}

export interface CompraCreate {
	id_pedido: number;
	fecha_recepcion: string;
	nro_guia?: string;
	tipo_comprobante?: string;
	nro_comprobante?: string;
	monto_total: number;
	estado: string;
	fecha_pago?: string;
}

// ==================== VENTA ====================
export interface MetodoPago {
	id_metodo_pago: number;
	descripcion: string;
}

export interface DetalleVentaItem {
	id_producto: number;
	cantidad: number;
	precio_unitario_venta: number;
}

export interface Venta {
	id_venta: number;
	id_cliente: number;
	id_usuario: number;
	fecha_venta: string;
	hora_venta: string;
	monto_total: number;
}

export interface VentaCreate {
	id_cliente: number;
	detalles: DetalleVentaItem[];
	id_metodo_pago: number;
	tipo_comprobante: string;
	nro_comprobante: string;
}

export interface Comprobante {
	id_comprobante: number;
	id_venta: number;
	tipo_comprobante: string;
	nro_comprobante: string;
}

// ==================== UTILITY TYPES ====================

// For pagination
export interface PaginationParams {
	skip?: number;
	limit?: number;
}

// For API responses
export interface ApiResponse<T> {
	data: T;
	message?: string;
}

// For form errors
export interface FormErrors {
	[key: string]: string;
}

// Stock level indicator
export type StockLevel = 'low' | 'medium' | 'high';

// Document types
export type TipoDocumento = 'DNI' | 'RUC' | 'Pasaporte' | 'CE';

// Comprobante types
export type TipoComprobante = 'Boleta' | 'Factura' | 'Ticket';
