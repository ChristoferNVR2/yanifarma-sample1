from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from . import crud, schemas
from .database import SessionLocal, engine
from .models import Base

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Yanifarma API", version="1.0.0")

# CORS
origins = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ==================== ROOT ====================
@app.get("/")
def root():
    return {"message": "Yanifarma API - Sistema de Gestión de Farmacia"}


# ==================== USUARIOS ====================
@app.get("/api/usuarios/", response_model=List[schemas.Usuario])
def get_usuarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_usuarios(db, skip=skip, limit=limit)


@app.get("/api/usuarios/{usuario_id}", response_model=schemas.Usuario)
def get_usuario(usuario_id: int, db: Session = Depends(get_db)):
    db_usuario = crud.get_usuario(db, usuario_id)
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_usuario


@app.post("/api/usuarios/", response_model=schemas.Usuario, status_code=201)
def create_usuario(usuario: schemas.UsuarioCreate, db: Session = Depends(get_db)):
    db_usuario = crud.get_usuario_by_username(db, usuario.username)
    if db_usuario:
        raise HTTPException(status_code=400, detail="Username ya existe")
    return crud.create_usuario(db, usuario)


@app.put("/api/usuarios/{usuario_id}", response_model=schemas.Usuario)
def update_usuario(usuario_id: int, usuario: schemas.UsuarioUpdate, db: Session = Depends(get_db)):
    db_usuario = crud.update_usuario(db, usuario_id, usuario)
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return db_usuario


@app.delete("/api/usuarios/{usuario_id}")
def delete_usuario(usuario_id: int, db: Session = Depends(get_db)):
    db_usuario = crud.delete_usuario(db, usuario_id)
    if not db_usuario:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    return {"message": "Usuario eliminado"}


# ==================== ROLES ====================
@app.get("/api/roles/", response_model=List[schemas.Rol])
def get_roles(db: Session = Depends(get_db)):
    return crud.get_roles(db)


@app.post("/api/roles/", response_model=schemas.Rol, status_code=201)
def create_rol(rol: schemas.RolCreate, db: Session = Depends(get_db)):
    return crud.create_rol(db, rol)


# ==================== CLIENTES ====================
@app.get("/api/clientes/", response_model=List[schemas.Cliente])
def get_clientes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_clientes(db, skip=skip, limit=limit)


@app.get("/api/clientes/{cliente_id}", response_model=schemas.Cliente)
def get_cliente(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente = crud.get_cliente(db, cliente_id)
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return db_cliente


@app.post("/api/clientes/", response_model=schemas.Cliente, status_code=201)
def create_cliente(cliente: schemas.ClienteCreate, db: Session = Depends(get_db)):
    db_cliente = crud.get_cliente_by_doc(db, cliente.nro_doc)
    if db_cliente:
        raise HTTPException(status_code=400, detail="Cliente con ese documento ya existe")
    return crud.create_cliente(db, cliente)


@app.put("/api/clientes/{cliente_id}", response_model=schemas.Cliente)
def update_cliente(cliente_id: int, cliente: schemas.ClienteUpdate, db: Session = Depends(get_db)):
    db_cliente = crud.update_cliente(db, cliente_id, cliente)
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return db_cliente


@app.delete("/api/clientes/{cliente_id}")
def delete_cliente(cliente_id: int, db: Session = Depends(get_db)):
    db_cliente = crud.delete_cliente(db, cliente_id)
    if not db_cliente:
        raise HTTPException(status_code=404, detail="Cliente no encontrado")
    return {"message": "Cliente eliminado"}


# ==================== PROVEEDORES ====================
@app.get("/api/proveedores/", response_model=List[schemas.Proveedor])
def get_proveedores(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_proveedores(db, skip=skip, limit=limit)


@app.get("/api/proveedores/{proveedor_id}", response_model=schemas.Proveedor)
def get_proveedor(proveedor_id: int, db: Session = Depends(get_db)):
    db_proveedor = crud.get_proveedor(db, proveedor_id)
    if not db_proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return db_proveedor


@app.post("/api/proveedores/", response_model=schemas.Proveedor, status_code=201)
def create_proveedor(proveedor: schemas.ProveedorCreate, db: Session = Depends(get_db)):
    return crud.create_proveedor(db, proveedor)


@app.put("/api/proveedores/{proveedor_id}", response_model=schemas.Proveedor)
def update_proveedor(proveedor_id: int, proveedor: schemas.ProveedorUpdate, db: Session = Depends(get_db)):
    db_proveedor = crud.update_proveedor(db, proveedor_id, proveedor)
    if not db_proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return db_proveedor


@app.delete("/api/proveedores/{proveedor_id}")
def delete_proveedor(proveedor_id: int, db: Session = Depends(get_db)):
    db_proveedor = crud.delete_proveedor(db, proveedor_id)
    if not db_proveedor:
        raise HTTPException(status_code=404, detail="Proveedor no encontrado")
    return {"message": "Proveedor eliminado"}


# ==================== CARGOS ====================
@app.get("/api/cargos/", response_model=List[schemas.Cargo])
def get_cargos(db: Session = Depends(get_db)):
    return crud.get_cargos(db)


@app.post("/api/cargos/", response_model=schemas.Cargo, status_code=201)
def create_cargo(cargo: schemas.CargoCreate, db: Session = Depends(get_db)):
    return crud.create_cargo(db, cargo)


# ==================== CONTACTOS PROVEEDOR ====================
@app.get("/api/proveedores/{proveedor_id}/contactos/", response_model=List[schemas.ContactoProveedor])
def get_contactos_proveedor(proveedor_id: int, db: Session = Depends(get_db)):
    return crud.get_contactos_proveedor(db, proveedor_id)


@app.post("/api/contactos-proveedor/", response_model=schemas.ContactoProveedor, status_code=201)
def create_contacto_proveedor(contacto: schemas.ContactoProveedorCreate, db: Session = Depends(get_db)):
    return crud.create_contacto_proveedor(db, contacto)


# ==================== PRODUCTOS ====================
@app.get("/api/productos/", response_model=List[schemas.Producto])
def get_productos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_productos(db, skip=skip, limit=limit)


@app.get("/api/productos/search/")
def search_productos(q: str, db: Session = Depends(get_db)):
    return crud.search_productos(db, q)


@app.get("/api/productos/{producto_id}", response_model=schemas.Producto)
def get_producto(producto_id: int, db: Session = Depends(get_db)):
    db_producto = crud.get_producto(db, producto_id)
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto


@app.post("/api/productos/", response_model=schemas.Producto, status_code=201)
def create_producto(producto: schemas.ProductoCreate, db: Session = Depends(get_db)):
    db_producto = crud.get_producto_by_codigo(db, producto.codigo_interno)
    if db_producto:
        raise HTTPException(status_code=400, detail="Producto con ese código ya existe")
    return crud.create_producto(db, producto)


@app.put("/api/productos/{producto_id}", response_model=schemas.Producto)
def update_producto(producto_id: int, producto: schemas.ProductoUpdate, db: Session = Depends(get_db)):
    db_producto = crud.update_producto(db, producto_id, producto)
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return db_producto


@app.delete("/api/productos/{producto_id}")
def delete_producto(producto_id: int, db: Session = Depends(get_db)):
    db_producto = crud.delete_producto(db, producto_id)
    if not db_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    return {"message": "Producto eliminado"}


# ==================== CATEGORIAS ====================
@app.get("/api/categorias/", response_model=List[schemas.Categoria])
def get_categorias(db: Session = Depends(get_db)):
    return crud.get_categorias(db)


@app.post("/api/categorias/", response_model=schemas.Categoria, status_code=201)
def create_categoria(categoria: schemas.CategoriaCreate, db: Session = Depends(get_db)):
    return crud.create_categoria(db, categoria)


@app.delete("/api/categorias/{categoria_id}")
def delete_categoria(categoria_id: int, db: Session = Depends(get_db)):
    db_categoria = crud.delete_categoria(db, categoria_id)
    if not db_categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    return {"message": "Categoría eliminada"}


# ==================== PRESENTACIONES ====================
@app.get("/api/presentaciones/", response_model=List[schemas.Presentacion])
def get_presentaciones(db: Session = Depends(get_db)):
    return crud.get_presentaciones(db)


@app.post("/api/presentaciones/", response_model=schemas.Presentacion, status_code=201)
def create_presentacion(presentacion: schemas.PresentacionCreate, db: Session = Depends(get_db)):
    return crud.create_presentacion(db, presentacion)


@app.delete("/api/presentaciones/{presentacion_id}")
def delete_presentacion(presentacion_id: int, db: Session = Depends(get_db)):
    db_presentacion = crud.delete_presentacion(db, presentacion_id)
    if not db_presentacion:
        raise HTTPException(status_code=404, detail="Presentación no encontrada")
    return {"message": "Presentación eliminada"}


# ==================== COMPONENTES ====================
@app.get("/api/componentes/", response_model=List[schemas.Componente])
def get_componentes(db: Session = Depends(get_db)):
    return crud.get_componentes(db)


@app.post("/api/componentes/", response_model=schemas.Componente, status_code=201)
def create_componente(componente: schemas.ComponenteCreate, db: Session = Depends(get_db)):
    return crud.create_componente(db, componente)


@app.delete("/api/componentes/{componente_id}")
def delete_componente(componente_id: int, db: Session = Depends(get_db)):
    db_componente = crud.delete_componente(db, componente_id)
    if not db_componente:
        raise HTTPException(status_code=404, detail="Componente no encontrado")
    return {"message": "Componente eliminado"}


# ==================== INVENTARIO ====================
@app.get("/api/inventario/", response_model=List[schemas.Inventario])
def get_inventarios(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_inventarios(db, skip=skip, limit=limit)


@app.get("/api/inventario/{inventario_id}", response_model=schemas.Inventario)
def get_inventario(inventario_id: int, db: Session = Depends(get_db)):
    db_inventario = crud.get_inventario(db, inventario_id)
    if not db_inventario:
        raise HTTPException(status_code=404, detail="Inventario no encontrado")
    return db_inventario


@app.get("/api/inventario/producto/{producto_id}", response_model=List[schemas.Inventario])
def get_inventario_by_producto(producto_id: int, db: Session = Depends(get_db)):
    return crud.get_inventario_by_producto(db, producto_id)


@app.post("/api/inventario/", response_model=schemas.Inventario, status_code=201)
def create_inventario(inventario: schemas.InventarioCreate, db: Session = Depends(get_db)):
    return crud.create_inventario(db, inventario)


@app.patch("/api/inventario/{inventario_id}/stock")
def update_stock(inventario_id: int, update: schemas.InventarioUpdate, db: Session = Depends(get_db)):
    db_inventario = crud.update_inventario_stock(db, inventario_id, update.stock_actual)
    if not db_inventario:
        raise HTTPException(status_code=404, detail="Inventario no encontrado")
    return db_inventario


# ==================== LOTES ====================
@app.get("/api/lotes/", response_model=List[schemas.Lote])
def get_lotes(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_lotes(db, skip=skip, limit=limit)


@app.post("/api/lotes/", response_model=schemas.Lote, status_code=201)
def create_lote(lote: schemas.LoteCreate, db: Session = Depends(get_db)):
    return crud.create_lote(db, lote)


# ==================== UBICACIONES ====================
@app.get("/api/ubicaciones/", response_model=List[schemas.UbicacionEstante])
def get_ubicaciones(db: Session = Depends(get_db)):
    return crud.get_ubicaciones(db)


@app.post("/api/ubicaciones/", response_model=schemas.UbicacionEstante, status_code=201)
def create_ubicacion(ubicacion: schemas.UbicacionEstanteCreate, db: Session = Depends(get_db)):
    return crud.create_ubicacion(db, ubicacion)


# ==================== PEDIDOS ====================
@app.get("/api/pedidos/", response_model=List[schemas.Pedido])
def get_pedidos(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_pedidos(db, skip=skip, limit=limit)


@app.get("/api/pedidos/{pedido_id}", response_model=schemas.PedidoDetalle)
def get_pedido(pedido_id: int, db: Session = Depends(get_db)):
    db_pedido = crud.get_pedido(db, pedido_id)
    if not db_pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return db_pedido


@app.post("/api/pedidos/", response_model=schemas.Pedido, status_code=201)
def create_pedido(pedido: schemas.PedidoCreate, db: Session = Depends(get_db)):
    # TODO: Get usuario_id from auth token
    usuario_id = 1005  # Hardcoded for now
    return crud.create_pedido(db, pedido, usuario_id)


@app.patch("/api/pedidos/{pedido_id}/estado")
def update_pedido_estado(pedido_id: int, update: schemas.PedidoUpdate, db: Session = Depends(get_db)):
    if update.id_estado_pedido is None:
        raise HTTPException(status_code=400, detail="id_estado_pedido es requerido")
    db_pedido = crud.update_pedido_estado(db, pedido_id, update.id_estado_pedido)
    if not db_pedido:
        raise HTTPException(status_code=404, detail="Pedido no encontrado")
    return db_pedido


# ==================== ESTADOS PEDIDO ====================
@app.get("/api/estados-pedido/", response_model=List[schemas.EstadoPedido])
def get_estados_pedido(db: Session = Depends(get_db)):
    return crud.get_estados_pedido(db)


@app.post("/api/estados-pedido/", response_model=schemas.EstadoPedido, status_code=201)
def create_estado_pedido(estado: schemas.EstadoPedidoCreate, db: Session = Depends(get_db)):
    return crud.create_estado_pedido(db, estado)


# ==================== MOTIVOS PEDIDO ====================
@app.get("/api/motivos-pedido/", response_model=List[schemas.MotivoPedido])
def get_motivos_pedido(db: Session = Depends(get_db)):
    return crud.get_motivos_pedido(db)


@app.post("/api/motivos-pedido/", response_model=schemas.MotivoPedido, status_code=201)
def create_motivo_pedido(motivo: schemas.MotivoPedidoCreate, db: Session = Depends(get_db)):
    return crud.create_motivo_pedido(db, motivo)


# ==================== COMPRAS ====================
@app.get("/api/compras/", response_model=List[schemas.Compra])
def get_compras(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_compras(db, skip=skip, limit=limit)


@app.get("/api/compras/{compra_id}", response_model=schemas.Compra)
def get_compra(compra_id: int, db: Session = Depends(get_db)):
    db_compra = crud.get_compra(db, compra_id)
    if not db_compra:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    return db_compra


@app.post("/api/compras/", response_model=schemas.Compra, status_code=201)
def create_compra(compra: schemas.CompraCreate, db: Session = Depends(get_db)):
    return crud.create_compra(db, compra)


@app.patch("/api/compras/{compra_id}", response_model=schemas.Compra)
def update_compra(compra_id: int, compra: schemas.CompraUpdate, db: Session = Depends(get_db)):
    db_compra = crud.update_compra(db, compra_id, compra)
    if not db_compra:
        raise HTTPException(status_code=404, detail="Compra no encontrada")
    return db_compra


# ==================== VENTAS ====================
@app.get("/api/ventas/", response_model=List[schemas.Venta])
def get_ventas(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_ventas(db, skip=skip, limit=limit)


@app.get("/api/ventas/{venta_id}", response_model=schemas.Venta)
def get_venta(venta_id: int, db: Session = Depends(get_db)):
    db_venta = crud.get_venta(db, venta_id)
    if not db_venta:
        raise HTTPException(status_code=404, detail="Venta no encontrada")
    return db_venta


@app.post("/api/ventas/", response_model=schemas.Venta, status_code=201)
def create_venta(venta: schemas.VentaCreate, db: Session = Depends(get_db)):
    # TODO: Get usuario_id from auth token
    usuario_id = 1005  # Hardcoded for now
    return crud.create_venta(db, venta, usuario_id)


# ==================== METODOS PAGO ====================
@app.get("/api/metodos-pago/", response_model=List[schemas.MetodoPago])
def get_metodos_pago(db: Session = Depends(get_db)):
    return crud.get_metodos_pago(db)


@app.post("/api/metodos-pago/", response_model=schemas.MetodoPago, status_code=201)
def create_metodo_pago(metodo: schemas.MetodoPagoCreate, db: Session = Depends(get_db)):
    return crud.create_metodo_pago(db, metodo)
