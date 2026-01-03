"""
Pedido (Purchase Order) and related models
"""

from sqlalchemy import Column, Integer, String, Date, ForeignKey, Numeric
from sqlalchemy.orm import relationship
from .base import Base


class EstadoPedido(Base):
    """Order status (En proceso, Entregado, etc.)"""
    __tablename__ = "estado_pedido"

    id_estado_pedido = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(String(50), nullable=False, unique=True)

    # Relationships
    pedidos = relationship("Pedido", back_populates="estado")

    def __repr__(self):
        return f"<EstadoPedido(id={self.id_estado_pedido}, desc='{self.descripcion}')>"


class MotivoPedido(Base):
    """Order reasons (stock bajo, pedido urgente, etc.)"""
    __tablename__ = "motivo_pedido"

    id_motivo_pedido = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(String(100), nullable=False, unique=True)

    # Relationships
    pedidos = relationship("Pedido", back_populates="motivo_rel")

    def __repr__(self):
        return f"<MotivoPedido(id={self.id_motivo_pedido}, desc='{self.descripcion}')>"


class Pedido(Base):
    """Purchase orders to suppliers"""
    __tablename__ = "pedido"

    id_pedido = Column(Integer, primary_key=True, autoincrement=True)
    id_proveedor = Column(Integer, ForeignKey("proveedor.id_proveedor"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario"), nullable=False)
    id_estado_pedido = Column(Integer, ForeignKey("estado_pedido.id_estado_pedido"), nullable=False)
    id_motivo_pedido = Column(Integer, ForeignKey("motivo_pedido.id_motivo_pedido"), nullable=False)
    fecha_solicitud = Column(Date, nullable=False)
    fecha_entrega_estimada = Column(Date)
    motivo = Column(String(255))  # Additional details about the reason

    # Relationships
    proveedor = relationship("Proveedor", back_populates="pedidos")
    usuario = relationship("Usuario", back_populates="pedidos")
    estado = relationship("EstadoPedido", back_populates="pedidos")
    motivo_rel = relationship("MotivoPedido", back_populates="pedidos")
    detalles = relationship("DetallePedido", back_populates="pedido", cascade="all, delete-orphan")
    compra = relationship("Compra", back_populates="pedido", uselist=False)

    def __repr__(self):
        return f"<Pedido(id={self.id_pedido}, proveedor_id={self.id_proveedor}, fecha={self.fecha_solicitud})>"


class DetallePedido(Base):
    """Order line items"""
    __tablename__ = "detalle_pedido"

    id_pedido = Column(Integer, ForeignKey("pedido.id_pedido"), primary_key=True)
    id_producto = Column(Integer, ForeignKey("producto.id_producto"), primary_key=True)
    cantidad_solicitada = Column(Integer, nullable=False)

    # Relationships
    pedido = relationship("Pedido", back_populates="detalles")
    producto = relationship("Producto", back_populates="detalles_pedido")

    def __repr__(self):
        return f"<DetallePedido(pedido_id={self.id_pedido}, producto_id={self.id_producto}, cant={self.cantidad_solicitada})>"
