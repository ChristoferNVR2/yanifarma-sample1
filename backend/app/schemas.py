from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import date, time, datetime
from decimal import Decimal


# ==================== USUARIO ====================
class RolBase(BaseModel):
    nombre_rol: str

class RolCreate(RolBase):
    pass

class Rol(RolBase):
    id_rol: int
    model_config = ConfigDict(from_attributes=True)


class UsuarioBase(BaseModel):
    username: str
    nombres: str
    apellido_paterno: str
    apellido_materno: Optional[str] = None

class UsuarioCreate(UsuarioBase):
    password: str
    roles: List[int] = []  # List of role IDs

class UsuarioUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    nombres: Optional[str] = None
    apellido_paterno: Optional[str] = None
    apellido_materno: Optional[str] = None

class Usuario(UsuarioBase):
    id_usuario: int
    model_config = ConfigDict(from_attributes=True)


# ==================== CLIENTE ====================
class ClienteBase(BaseModel):
    nro_doc: str
    tipo_doc: str
    nombres: str
    apellido_paterno: str
    apellido_materno: Optional[str] = None
    correo: Optional[str] = None
    direccion: Optional[str] = None

class ClienteCreate(ClienteBase):
    telefonos: List[str] = []

class ClienteUpdate(BaseModel):
    nro_doc: Optional[str] = None
    tipo_doc: Optional[str] = None
    nombres: Optional[str] = None
    apellido_paterno: Optional[str] = None
    apellido_materno: Optional[str] = None
    correo: Optional[str] = None
    direccion: Optional[str] = None

class Cliente(ClienteBase):
    id_cliente: int
    model_config = ConfigDict(from_attributes=True)


# ==================== PROVEEDOR ====================
class CargoBase(BaseModel):
    descripcion: str

class CargoCreate(CargoBase):
    pass

class Cargo(CargoBase):
    id_cargo: int
    model_config = ConfigDict(from_attributes=True)


class ProveedorBase(BaseModel):
    ruc: str
    razon_social: str
    direccion_empresa: Optional[str] = None
    telefono_empresa: Optional[str] = None
    correo_empresa: Optional[str] = None

class ProveedorCreate(ProveedorBase):
    pass

class ProveedorUpdate(BaseModel):
    ruc: Optional[str] = None
    razon_social: Optional[str] = None
    direccion_empresa: Optional[str] = None
    telefono_empresa: Optional[str] = None
    correo_empresa: Optional[str] = None

class Proveedor(ProveedorBase):
    id_proveedor: int
    model_config = ConfigDict(from_attributes=True)


class ContactoProveedorBase(BaseModel):
    nombres: str
    apellido_paterno: str
    apellido_materno: Optional[str] = None
    telefono_contacto: Optional[str] = None
    id_cargo: int

class ContactoProveedorCreate(ContactoProveedorBase):
    id_proveedor: int

class ContactoProveedor(ContactoProveedorBase):
    id_contacto: int
    id_proveedor: int
    model_config = ConfigDict(from_attributes=True)


# ==================== PRODUCTO ====================
class CategoriaBase(BaseModel):
    nombre_categoria: str

class CategoriaCreate(CategoriaBase):
    pass

class Categoria(CategoriaBase):
    id_categoria: int
    model_config = ConfigDict(from_attributes=True)


class PresentacionBase(BaseModel):
    desc_presentacion: str

class PresentacionCreate(PresentacionBase):
    pass

class Presentacion(PresentacionBase):
    id_presentacion: int
    model_config = ConfigDict(from_attributes=True)


class ComponenteBase(BaseModel):
    nombre_componente: str

class ComponenteCreate(ComponenteBase):
    pass

class Componente(ComponenteBase):
    id_componente: int
    model_config = ConfigDict(from_attributes=True)


class ProductoBase(BaseModel):
    codigo_interno: str
    nombre_comercial: str
    precio_venta: Decimal
    afecta_igv: bool = True
    requiere_receta: bool = False

class ProductoCreate(ProductoBase):
    categorias: List[int] = []
    presentaciones: List[int] = []
    componentes: List[int] = []

class ProductoUpdate(BaseModel):
    codigo_interno: Optional[str] = None
    nombre_comercial: Optional[str] = None
    precio_venta: Optional[Decimal] = None
    afecta_igv: Optional[bool] = None
    requiere_receta: Optional[bool] = None

class Producto(ProductoBase):
    id_producto: int
    model_config = ConfigDict(from_attributes=True)


# ==================== INVENTARIO ====================
class UbicacionEstanteBase(BaseModel):
    estante: str
    nivel: str

class UbicacionEstanteCreate(UbicacionEstanteBase):
    pass

class UbicacionEstante(UbicacionEstanteBase):
    id_ubicacion_estante: int
    model_config = ConfigDict(from_attributes=True)


class LoteBase(BaseModel):
    id_producto: int
    codigo_lote: str
    fecha_vencimiento: date
    cantidad_recibida: int
    costo_unitario_compra: Decimal

class LoteCreate(LoteBase):
    pass

class Lote(LoteBase):
    id_lote: int
    model_config = ConfigDict(from_attributes=True)


class InventarioBase(BaseModel):
    id_lote: int
    id_ubicacion_estante: int
    stock_actual: int

class InventarioCreate(InventarioBase):
    pass

class InventarioUpdate(BaseModel):
    stock_actual: int

class Inventario(InventarioBase):
    id_inventario: int
    model_config = ConfigDict(from_attributes=True)


# ==================== PEDIDO ====================
class EstadoPedidoBase(BaseModel):
    descripcion: str

class EstadoPedidoCreate(EstadoPedidoBase):
    pass

class EstadoPedido(EstadoPedidoBase):
    id_estado_pedido: int
    model_config = ConfigDict(from_attributes=True)


class MotivoPedidoBase(BaseModel):
    descripcion: str

class MotivoPedidoCreate(MotivoPedidoBase):
    pass

class MotivoPedido(MotivoPedidoBase):
    id_motivo_pedido: int
    model_config = ConfigDict(from_attributes=True)


class DetallePedidoItem(BaseModel):
    id_producto: int
    cantidad_solicitada: int

class PedidoBase(BaseModel):
    id_proveedor: int
    id_estado_pedido: int
    id_motivo_pedido: int
    fecha_solicitud: date
    fecha_entrega_estimada: Optional[date] = None
    motivo: Optional[str] = None

class PedidoCreate(PedidoBase):
    detalles: List[DetallePedidoItem]

class PedidoUpdate(BaseModel):
    id_estado_pedido: Optional[int] = None
    fecha_entrega_estimada: Optional[date] = None

class Pedido(PedidoBase):
    id_pedido: int
    id_usuario: int
    model_config = ConfigDict(from_attributes=True)


# ==================== COMPRA ====================
class CompraBase(BaseModel):
    id_pedido: int
    fecha_recepcion: date
    nro_guia: Optional[str] = None
    tipo_comprobante: Optional[str] = None
    nro_comprobante: Optional[str] = None
    monto_total: Decimal
    estado: str
    fecha_pago: Optional[date] = None

class CompraCreate(CompraBase):
    pass

class CompraUpdate(BaseModel):
    estado: Optional[str] = None
    fecha_pago: Optional[date] = None

class Compra(CompraBase):
    id_compra: int
    model_config = ConfigDict(from_attributes=True)


# ==================== VENTA ====================
class MetodoPagoBase(BaseModel):
    descripcion: str

class MetodoPagoCreate(MetodoPagoBase):
    pass

class MetodoPago(MetodoPagoBase):
    id_metodo_pago: int
    model_config = ConfigDict(from_attributes=True)


class DetalleVentaItem(BaseModel):
    id_producto: int
    cantidad: int
    precio_unitario_venta: Decimal

class VentaBase(BaseModel):
    id_cliente: int

class VentaCreate(VentaBase):
    detalles: List[DetalleVentaItem]
    id_metodo_pago: int
    tipo_comprobante: str
    nro_comprobante: str

class Venta(VentaBase):
    id_venta: int
    id_usuario: int
    fecha_venta: date
    hora_venta: time
    monto_total: Decimal
    model_config = ConfigDict(from_attributes=True)


class ComprobanteBase(BaseModel):
    tipo_comprobante: str
    nro_comprobante: str

class Comprobante(ComprobanteBase):
    id_comprobante: int
    id_venta: int
    model_config = ConfigDict(from_attributes=True)
