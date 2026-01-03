"""
Venta (Sale) and related models
"""

from sqlalchemy import Column, Integer, Date, Time, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Venta(Base):
    """Sales transactions"""
    __tablename__ = "venta"

    id_venta = Column(Integer, primary_key=True, autoincrement=True)
    id_cliente = Column(Integer, ForeignKey("cliente.id_cliente"), nullable=False)
    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario"), nullable=False)
    fecha_venta = Column(Date, nullable=False)
    hora_venta = Column(Time, nullable=False)
    monto_total = Column(Numeric(10, 2), nullable=False)

    # Relationships
    cliente = relationship("Cliente", back_populates="ventas")
    usuario = relationship("Usuario", back_populates="ventas")
    detalles = relationship("DetalleVenta", back_populates="venta", cascade="all, delete-orphan")
    pago = relationship("Pago", back_populates="venta", uselist=False)
    comprobante = relationship("Comprobante", back_populates="venta", uselist=False)

    def __repr__(self):
        return f"<Venta(id={self.id_venta}, cliente_id={self.id_cliente}, monto={self.monto_total})>"


class DetalleVenta(Base):
    """Sale line items"""
    __tablename__ = "detalle_venta"

    id_venta = Column(Integer, ForeignKey("venta.id_venta"), primary_key=True)
    id_producto = Column(Integer, ForeignKey("producto.id_producto"), primary_key=True)
    cantidad = Column(Integer, nullable=False)
    precio_unitario_venta = Column(Numeric(10, 2), nullable=False)
    subtotal = Column(Numeric(10, 2), nullable=False)

    # Relationships
    venta = relationship("Venta", back_populates="detalles")
    producto = relationship("Producto", back_populates="detalles_venta")

    def __repr__(self):
        return f"<DetalleVenta(venta_id={self.id_venta}, producto_id={self.id_producto}, cant={self.cantidad})>"
