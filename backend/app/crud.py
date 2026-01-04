from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from datetime import datetime, date
from decimal import Decimal

from . import schemas
from .models import (
    Usuario, Rol, UsuarioRol,
    Cliente, ClienteTelefono,
    Proveedor, ContactoProveedor, Cargo,
    Producto, Categoria, Presentacion, Componente,
    ProductoCategoria, ProductoPresentacion, ProductoComponente,
    Inventario, Lote, UbicacionEstante,
    Pedido, DetallePedido, EstadoPedido, MotivoPedido,
    Compra,
    Venta, DetalleVenta,
    Pago, MetodoPago, Comprobante
)


# ==================== USUARIO ====================
def get_usuarios(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Usuario).offset(skip).limit(limit).all()

def get_usuario(db: Session, usuario_id: int):
    return db.query(Usuario).filter(Usuario.id_usuario == usuario_id).first()

def get_usuario_by_username(db: Session, username: str):
    return db.query(Usuario).filter(Usuario.username == username).first()

def create_usuario(db: Session, usuario: schemas.UsuarioCreate):
    db_usuario = Usuario(
        username=usuario.username,
        password=usuario.password,  # TODO: Hash password
        nombres=usuario.nombres,
        apellido_paterno=usuario.apellido_paterno,
        apellido_materno=usuario.apellido_materno
    )
    db.add(db_usuario)
    db.flush()
    
    # Assign roles
    for rol_id in usuario.roles:
        usuario_rol = UsuarioRol(id_usuario=db_usuario.id_usuario, id_rol=rol_id)
        db.add(usuario_rol)
    
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

def update_usuario(db: Session, usuario_id: int, usuario: schemas.UsuarioUpdate):
    db_usuario = get_usuario(db, usuario_id)
    if not db_usuario:
        return None
    
    update_data = usuario.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_usuario, key, value)
    
    db.commit()
    db.refresh(db_usuario)
    return db_usuario

def delete_usuario(db: Session, usuario_id: int):
    db_usuario = get_usuario(db, usuario_id)
    if db_usuario:
        db.delete(db_usuario)
        db.commit()
    return db_usuario


# ==================== ROL ====================
def get_roles(db: Session):
    return db.query(Rol).all()

def get_rol(db: Session, rol_id: int):
    return db.query(Rol).filter(Rol.id_rol == rol_id).first()

def create_rol(db: Session, rol: schemas.RolCreate):
    db_rol = Rol(**rol.model_dump())
    db.add(db_rol)
    db.commit()
    db.refresh(db_rol)
    return db_rol


# ==================== CLIENTE ====================
def get_clientes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Cliente).offset(skip).limit(limit).all()

def get_cliente(db: Session, cliente_id: int):
    return db.query(Cliente).filter(Cliente.id_cliente == cliente_id).first()

def get_cliente_by_doc(db: Session, nro_doc: str):
    return db.query(Cliente).filter(Cliente.nro_doc == nro_doc).first()

def create_cliente(db: Session, cliente: schemas.ClienteCreate):
    db_cliente = Cliente(
        nro_doc=cliente.nro_doc,
        tipo_doc=cliente.tipo_doc,
        nombres=cliente.nombres,
        apellido_paterno=cliente.apellido_paterno,
        apellido_materno=cliente.apellido_materno,
        correo=cliente.correo,
        direccion=cliente.direccion
    )
    db.add(db_cliente)
    db.flush()
    
    # Add phones
    for telefono in cliente.telefonos:
        cliente_tel = ClienteTelefono(id_cliente=db_cliente.id_cliente, telefono=telefono)
        db.add(cliente_tel)
    
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

def update_cliente(db: Session, cliente_id: int, cliente: schemas.ClienteUpdate):
    db_cliente = get_cliente(db, cliente_id)
    if not db_cliente:
        return None
    
    update_data = cliente.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_cliente, key, value)
    
    db.commit()
    db.refresh(db_cliente)
    return db_cliente

def delete_cliente(db: Session, cliente_id: int):
    db_cliente = get_cliente(db, cliente_id)
    if db_cliente:
        db.delete(db_cliente)
        db.commit()
    return db_cliente


# ==================== PROVEEDOR ====================
def get_proveedores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Proveedor).offset(skip).limit(limit).all()

def get_proveedor(db: Session, proveedor_id: int):
    return db.query(Proveedor).filter(Proveedor.id_proveedor == proveedor_id).first()

def create_proveedor(db: Session, proveedor: schemas.ProveedorCreate):
    db_proveedor = Proveedor(**proveedor.model_dump())
    db.add(db_proveedor)
    db.commit()
    db.refresh(db_proveedor)
    return db_proveedor

def update_proveedor(db: Session, proveedor_id: int, proveedor: schemas.ProveedorUpdate):
    db_proveedor = get_proveedor(db, proveedor_id)
    if not db_proveedor:
        return None
    
    update_data = proveedor.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_proveedor, key, value)
    
    db.commit()
    db.refresh(db_proveedor)
    return db_proveedor

def delete_proveedor(db: Session, proveedor_id: int):
    db_proveedor = get_proveedor(db, proveedor_id)
    if db_proveedor:
        db.delete(db_proveedor)
        db.commit()
    return db_proveedor


# ==================== CARGO ====================
def get_cargos(db: Session):
    return db.query(Cargo).all()

def create_cargo(db: Session, cargo: schemas.CargoCreate):
    db_cargo = Cargo(**cargo.model_dump())
    db.add(db_cargo)
    db.commit()
    db.refresh(db_cargo)
    return db_cargo


# ==================== CONTACTO PROVEEDOR ====================
def get_contactos_proveedor(db: Session, proveedor_id: int):
    return db.query(ContactoProveedor).filter(
        ContactoProveedor.id_proveedor == proveedor_id
    ).all()

def create_contacto_proveedor(db: Session, contacto: schemas.ContactoProveedorCreate):
    db_contacto = ContactoProveedor(**contacto.model_dump())
    db.add(db_contacto)
    db.commit()
    db.refresh(db_contacto)
    return db_contacto


# ==================== PRODUCTO ====================
def get_productos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Producto).offset(skip).limit(limit).all()

def get_producto(db: Session, producto_id: int):
    return db.query(Producto).filter(Producto.id_producto == producto_id).first()

def get_producto_by_codigo(db: Session, codigo: str):
    return db.query(Producto).filter(Producto.codigo_interno == codigo).first()

def search_productos(db: Session, query: str):
    return db.query(Producto).filter(
        or_(
            Producto.nombre_comercial.contains(query),
            Producto.codigo_interno.contains(query)
        )
    ).all()

def create_producto(db: Session, producto: schemas.ProductoCreate):
    db_producto = Producto(
        codigo_interno=producto.codigo_interno,
        nombre_comercial=producto.nombre_comercial,
        precio_venta=producto.precio_venta,
        afecta_igv=producto.afecta_igv,
        requiere_receta=producto.requiere_receta
    )
    db.add(db_producto)
    db.flush()
    
    # Assign categories
    for cat_id in producto.categorias:
        prod_cat = ProductoCategoria(id_producto=db_producto.id_producto, id_categoria=cat_id)
        db.add(prod_cat)
    
    # Assign presentations
    for pres_id in producto.presentaciones:
        prod_pres = ProductoPresentacion(id_producto=db_producto.id_producto, id_presentacion=pres_id)
        db.add(prod_pres)
    
    # Assign components
    for comp_id in producto.componentes:
        prod_comp = ProductoComponente(id_producto=db_producto.id_producto, id_componente=comp_id)
        db.add(prod_comp)
    
    db.commit()
    db.refresh(db_producto)
    return db_producto

def update_producto(db: Session, producto_id: int, producto: schemas.ProductoUpdate):
    db_producto = get_producto(db, producto_id)
    if not db_producto:
        return None
    
    update_data = producto.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_producto, key, value)
    
    db.commit()
    db.refresh(db_producto)
    return db_producto

def delete_producto(db: Session, producto_id: int):
    db_producto = get_producto(db, producto_id)
    if db_producto:
        db.delete(db_producto)
        db.commit()
    return db_producto


# ==================== CATEGORIA ====================
def get_categorias(db: Session):
    return db.query(Categoria).all()

def get_categoria(db: Session, categoria_id: int):
    return db.query(Categoria).filter(Categoria.id_categoria == categoria_id).first()

def create_categoria(db: Session, categoria: schemas.CategoriaCreate):
    db_categoria = Categoria(**categoria.model_dump())
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def delete_categoria(db: Session, categoria_id: int):
    db_categoria = get_categoria(db, categoria_id)
    if db_categoria:
        db.delete(db_categoria)
        db.commit()
    return db_categoria


# ==================== PRESENTACION ====================
def get_presentaciones(db: Session):
    return db.query(Presentacion).all()

def get_presentacion(db: Session, presentacion_id: int):
    return db.query(Presentacion).filter(Presentacion.id_presentacion == presentacion_id).first()

def create_presentacion(db: Session, presentacion: schemas.PresentacionCreate):
    db_presentacion = Presentacion(**presentacion.model_dump())
    db.add(db_presentacion)
    db.commit()
    db.refresh(db_presentacion)
    return db_presentacion

def delete_presentacion(db: Session, presentacion_id: int):
    db_presentacion = get_presentacion(db, presentacion_id)
    if db_presentacion:
        db.delete(db_presentacion)
        db.commit()
    return db_presentacion


# ==================== COMPONENTE ====================
def get_componentes(db: Session):
    return db.query(Componente).all()

def get_componente(db: Session, componente_id: int):
    return db.query(Componente).filter(Componente.id_componente == componente_id).first()

def create_componente(db: Session, componente: schemas.ComponenteCreate):
    db_componente = Componente(**componente.model_dump())
    db.add(db_componente)
    db.commit()
    db.refresh(db_componente)
    return db_componente

def delete_componente(db: Session, componente_id: int):
    db_componente = get_componente(db, componente_id)
    if db_componente:
        db.delete(db_componente)
        db.commit()
    return db_componente


# ==================== INVENTARIO ====================
def get_inventarios(db: Session, skip: int = 0, limit: int = 100):
    inventarios = db.query(Inventario).offset(skip).limit(limit).all()

    # Build enhanced response
    result = []
    for inv in inventarios:
        lote = db.query(Lote).filter(Lote.id_lote == inv.id_lote).first()
        ubicacion = db.query(UbicacionEstante).filter(
            UbicacionEstante.id_ubicacion_estante == inv.id_ubicacion_estante
        ).first()

        if lote and ubicacion:
            result.append({
                "id_inventario": inv.id_inventario,
                "stock_actual": inv.stock_actual,
                "codigo_lote": lote.codigo_lote,
                "fecha_vencimiento": lote.fecha_vencimiento,
                "precio_compra_unitario": lote.costo_unitario_compra,
                "ubicacion_estante": f"{ubicacion.estante}-{ubicacion.nivel}"
            })

    return result


def get_inventario(db: Session, inventario_id: int):
    inv = db.query(Inventario).filter(Inventario.id_inventario == inventario_id).first()
    if not inv:
        return None

    lote = db.query(Lote).filter(Lote.id_lote == inv.id_lote).first()
    ubicacion = db.query(UbicacionEstante).filter(
        UbicacionEstante.id_ubicacion_estante == inv.id_ubicacion_estante
    ).first()

    if lote and ubicacion:
        return {
            "id_inventario": inv.id_inventario,
            "stock_actual": inv.stock_actual,
            "codigo_lote": lote.codigo_lote,
            "fecha_vencimiento": lote.fecha_vencimiento,
            "precio_compra_unitario": lote.costo_unitario_compra,
            "ubicacion_estante": f"{ubicacion.estante}-{ubicacion.nivel}"
        }
    return None


def get_inventario_by_producto(db: Session, producto_id: int):
    inventarios = db.query(Inventario).join(Lote).filter(Lote.id_producto == producto_id).all()

    result = []
    for inv in inventarios:
        lote = db.query(Lote).filter(Lote.id_lote == inv.id_lote).first()
        ubicacion = db.query(UbicacionEstante).filter(
            UbicacionEstante.id_ubicacion_estante == inv.id_ubicacion_estante
        ).first()

        if lote and ubicacion:
            result.append({
                "id_inventario": inv.id_inventario,
                "stock_actual": inv.stock_actual,
                "codigo_lote": lote.codigo_lote,
                "fecha_vencimiento": lote.fecha_vencimiento,
                "precio_compra_unitario": lote.costo_unitario_compra,
                "ubicacion_estante": f"{ubicacion.estante}-{ubicacion.nivel}"
            })

    return result

def create_inventario(db: Session, inventario: schemas.InventarioCreate):
    db_inventario = Inventario(**inventario.model_dump())
    db.add(db_inventario)
    db.commit()
    db.refresh(db_inventario)
    return db_inventario

def update_inventario_stock(db: Session, inventario_id: int, stock_actual: int):
    db_inventario = get_inventario(db, inventario_id)
    if not db_inventario:
        return None
    
    db_inventario.stock_actual = stock_actual
    db.commit()
    db.refresh(db_inventario)
    return db_inventario


# ==================== LOTE ====================
def get_lotes(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Lote).offset(skip).limit(limit).all()

def get_lote(db: Session, lote_id: int):
    return db.query(Lote).filter(Lote.id_lote == lote_id).first()

def create_lote(db: Session, lote: schemas.LoteCreate):
    db_lote = Lote(**lote.model_dump())
    db.add(db_lote)
    db.commit()
    db.refresh(db_lote)
    return db_lote


# ==================== UBICACION ESTANTE ====================
def get_ubicaciones(db: Session):
    return db.query(UbicacionEstante).all()

def create_ubicacion(db: Session, ubicacion: schemas.UbicacionEstanteCreate):
    db_ubicacion = UbicacionEstante(**ubicacion.model_dump())
    db.add(db_ubicacion)
    db.commit()
    db.refresh(db_ubicacion)
    return db_ubicacion


# ==================== PEDIDO ====================
def get_pedidos(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Pedido).offset(skip).limit(limit).all()

def get_pedido(db: Session, pedido_id: int):
    return db.query(Pedido).filter(Pedido.id_pedido == pedido_id).first()

def create_pedido(db: Session, pedido: schemas.PedidoCreate, usuario_id: int):
    db_pedido = Pedido(
        id_proveedor=pedido.id_proveedor,
        id_usuario=usuario_id,
        id_estado_pedido=pedido.id_estado_pedido,
        id_motivo_pedido=pedido.id_motivo_pedido,
        fecha_solicitud=pedido.fecha_solicitud,
        fecha_entrega_estimada=pedido.fecha_entrega_estimada,
        motivo=pedido.motivo
    )
    db.add(db_pedido)
    db.flush()
    
    # Add details
    for detalle in pedido.detalles:
        db_detalle = DetallePedido(
            id_pedido=db_pedido.id_pedido,
            id_producto=detalle.id_producto,
            cantidad_solicitada=detalle.cantidad_solicitada
        )
        db.add(db_detalle)
    
    db.commit()
    db.refresh(db_pedido)
    return db_pedido

def update_pedido_estado(db: Session, pedido_id: int, estado_id: int):
    db_pedido = get_pedido(db, pedido_id)
    if not db_pedido:
        return None
    
    db_pedido.id_estado_pedido = estado_id
    db.commit()
    db.refresh(db_pedido)
    return db_pedido


# ==================== ESTADO PEDIDO ====================
def get_estados_pedido(db: Session):
    return db.query(EstadoPedido).all()

def create_estado_pedido(db: Session, estado: schemas.EstadoPedidoCreate):
    db_estado = EstadoPedido(**estado.model_dump())
    db.add(db_estado)
    db.commit()
    db.refresh(db_estado)
    return db_estado


# ==================== MOTIVO PEDIDO ====================
def get_motivos_pedido(db: Session):
    return db.query(MotivoPedido).all()

def create_motivo_pedido(db: Session, motivo: schemas.MotivoPedidoCreate):
    db_motivo = MotivoPedido(**motivo.model_dump())
    db.add(db_motivo)
    db.commit()
    db.refresh(db_motivo)
    return db_motivo


# ==================== COMPRA ====================
def get_compras(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Compra).offset(skip).limit(limit).all()

def get_compra(db: Session, compra_id: int):
    return db.query(Compra).filter(Compra.id_compra == compra_id).first()

def create_compra(db: Session, compra: schemas.CompraCreate):
    db_compra = Compra(**compra.model_dump())
    db.add(db_compra)
    db.commit()
    db.refresh(db_compra)
    return db_compra

def update_compra(db: Session, compra_id: int, compra: schemas.CompraUpdate):
    db_compra = get_compra(db, compra_id)
    if not db_compra:
        return None
    
    update_data = compra.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_compra, key, value)
    
    db.commit()
    db.refresh(db_compra)
    return db_compra


# ==================== VENTA ====================
def get_ventas(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Venta).offset(skip).limit(limit).all()

def get_venta(db: Session, venta_id: int):
    return db.query(Venta).filter(Venta.id_venta == venta_id).first()

def create_venta(db: Session, venta: schemas.VentaCreate, usuario_id: int):
    # Calculate total
    monto_total = sum(
        detalle.cantidad * detalle.precio_unitario_venta 
        for detalle in venta.detalles
    )
    
    now = datetime.now()
    db_venta = Venta(
        id_cliente=venta.id_cliente,
        id_usuario=usuario_id,
        fecha_venta=now.date(),
        hora_venta=now.time(),
        monto_total=monto_total
    )
    db.add(db_venta)
    db.flush()
    
    # Add details
    for detalle in venta.detalles:
        subtotal = detalle.cantidad * detalle.precio_unitario_venta
        db_detalle = DetalleVenta(
            id_venta=db_venta.id_venta,
            id_producto=detalle.id_producto,
            cantidad=detalle.cantidad,
            precio_unitario_venta=detalle.precio_unitario_venta,
            subtotal=subtotal
        )
        db.add(db_detalle)
    
    # Add payment
    db_pago = Pago(
        id_venta=db_venta.id_venta,
        id_metodo_pago=venta.id_metodo_pago,
        fecha_hora=now,
        monto=monto_total
    )
    db.add(db_pago)
    
    # Add receipt
    db_comprobante = Comprobante(
        id_venta=db_venta.id_venta,
        tipo_comprobante=venta.tipo_comprobante,
        nro_comprobante=venta.nro_comprobante
    )
    db.add(db_comprobante)
    
    db.commit()
    db.refresh(db_venta)
    return db_venta


# ==================== METODO PAGO ====================
def get_metodos_pago(db: Session):
    return db.query(MetodoPago).all()

def create_metodo_pago(db: Session, metodo: schemas.MetodoPagoCreate):
    db_metodo = MetodoPago(**metodo.model_dump())
    db.add(db_metodo)
    db.commit()
    db.refresh(db_metodo)
    return db_metodo
