"""
Producto (Product) and related models
"""

from sqlalchemy import Column, Integer, String, Numeric, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Categoria(Base):
    """Product categories (Analgésico, Antibiótico, etc.)"""
    __tablename__ = "categoria"

    id_categoria = Column(Integer, primary_key=True, autoincrement=True)
    nombre_categoria = Column(String(100), nullable=False, unique=True)

    # Relationships
    productos = relationship("ProductoCategoria", back_populates="categoria")

    def __repr__(self):
        return f"<Categoria(id={self.id_categoria}, nombre='{self.nombre_categoria}')>"


class Presentacion(Base):
    """Product presentations (Caja x 10 tabletas, etc.)"""
    __tablename__ = "presentacion"

    id_presentacion = Column(Integer, primary_key=True, autoincrement=True)
    desc_presentacion = Column(String(255), nullable=False, unique=True)

    # Relationships
    productos = relationship("ProductoPresentacion", back_populates="presentacion")

    def __repr__(self):
        return f"<Presentacion(id={self.id_presentacion}, desc='{self.desc_presentacion}')>"


class Componente(Base):
    """Product components/active ingredients"""
    __tablename__ = "componente"

    id_componente = Column(Integer, primary_key=True, autoincrement=True)
    nombre_componente = Column(String(255), nullable=False, unique=True)

    # Relationships
    productos = relationship("ProductoComponente", back_populates="componente")

    def __repr__(self):
        return f"<Componente(id={self.id_componente}, nombre='{self.nombre_componente}')>"


class Producto(Base):
    """Products table - medicines and pharmaceutical products"""
    __tablename__ = "producto"

    id_producto = Column(Integer, primary_key=True, autoincrement=True)
    codigo_interno = Column(String(50), unique=True, nullable=False, index=True)
    nombre_comercial = Column(String(255), nullable=False)
    precio_venta = Column(Numeric(10, 2), nullable=False)
    afecta_igv = Column(Boolean, default=True, nullable=False)
    requiere_receta = Column(Boolean, default=False, nullable=False)

    # Relationships
    categorias = relationship("ProductoCategoria", back_populates="producto", cascade="all, delete-orphan")
    presentaciones = relationship("ProductoPresentacion", back_populates="producto", cascade="all, delete-orphan")
    componentes = relationship("ProductoComponente", back_populates="producto", cascade="all, delete-orphan")
    lotes = relationship("Lote", back_populates="producto")
    detalles_pedido = relationship("DetallePedido", back_populates="producto")
    detalles_venta = relationship("DetalleVenta", back_populates="producto")

    def __repr__(self):
        return f"<Producto(id={self.id_producto}, codigo='{self.codigo_interno}', nombre='{self.nombre_comercial}')>"


class ProductoCategoria(Base):
    """Many-to-many: Product - Category"""
    __tablename__ = "producto_categoria"

    id_producto = Column(Integer, ForeignKey("producto.id_producto"), primary_key=True)
    id_categoria = Column(Integer, ForeignKey("categoria.id_categoria"), primary_key=True)

    # Relationships
    producto = relationship("Producto", back_populates="categorias")
    categoria = relationship("Categoria", back_populates="productos")


class ProductoPresentacion(Base):
    """Many-to-many: Product - Presentation"""
    __tablename__ = "producto_presentacion"

    id_producto = Column(Integer, ForeignKey("producto.id_producto"), primary_key=True)
    id_presentacion = Column(Integer, ForeignKey("presentacion.id_presentacion"), primary_key=True)

    # Relationships
    producto = relationship("Producto", back_populates="presentaciones")
    presentacion = relationship("Presentacion", back_populates="productos")


class ProductoComponente(Base):
    """Many-to-many: Product - Component"""
    __tablename__ = "producto_componente"

    id_producto = Column(Integer, ForeignKey("producto.id_producto"), primary_key=True)
    id_componente = Column(Integer, ForeignKey("componente.id_componente"), primary_key=True)

    # Relationships
    producto = relationship("Producto", back_populates="componentes")
    componente = relationship("Componente", back_populates="productos")
