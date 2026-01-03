"""
Inventario (Inventory) and related models
"""

from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class UbicacionEstante(Base):
    """Shelf/storage locations"""
    __tablename__ = "ubicacion_estante"

    id_ubicacion_estante = Column(Integer, primary_key=True, autoincrement=True)
    estante = Column(String(50), nullable=False)
    nivel = Column(String(50), nullable=False)

    # Relationships
    inventarios = relationship("Inventario", back_populates="ubicacion")

    def __repr__(self):
        return f"<UbicacionEstante(id={self.id_ubicacion_estante}, estante='{self.estante}', nivel='{self.nivel}')>"


class Lote(Base):
    """Product batches/lots"""
    __tablename__ = "lote"

    id_lote = Column(Integer, primary_key=True, autoincrement=True)
    id_producto = Column(Integer, ForeignKey("producto.id_producto"), nullable=False)
    codigo_lote = Column(String(50), unique=True, nullable=False, index=True)
    fecha_vencimiento = Column(Date, nullable=False)
    cantidad_recibida = Column(Integer, nullable=False)
    costo_unitario_compra = Column(Numeric(10, 2), nullable=False)

    # Relationships
    producto = relationship("Producto", back_populates="lotes")
    inventarios = relationship("Inventario", back_populates="lote")

    def __repr__(self):
        return f"<Lote(id={self.id_lote}, codigo='{self.codigo_lote}', producto_id={self.id_producto})>"


class Inventario(Base):
    """Inventory table - tracks current stock"""
    __tablename__ = "inventario"

    id_inventario = Column(Integer, primary_key=True, autoincrement=True)
    id_lote = Column(Integer, ForeignKey("lote.id_lote"), nullable=False, unique=True)
    id_ubicacion_estante = Column(Integer, ForeignKey("ubicacion_estante.id_ubicacion_estante"), nullable=False)
    stock_actual = Column(Integer, nullable=False, default=0)

    # Relationships
    lote = relationship("Lote", back_populates="inventarios")
    ubicacion = relationship("UbicacionEstante", back_populates="inventarios")

    def __repr__(self):
        return f"<Inventario(id={self.id_inventario}, lote_id={self.id_lote}, stock={self.stock_actual})>"
