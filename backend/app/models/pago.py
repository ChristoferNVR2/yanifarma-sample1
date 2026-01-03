"""
Pago (Payment) and related models
"""

from sqlalchemy import Column, Integer, String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class MetodoPago(Base):
    """Payment methods (Efectivo, Yape, Tarjeta, etc.)"""
    __tablename__ = "metodo_pago"

    id_metodo_pago = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(String(50), nullable=False, unique=True)

    # Relationships
    pagos = relationship("Pago", back_populates="metodo")

    def __repr__(self):
        return f"<MetodoPago(id={self.id_metodo_pago}, desc='{self.descripcion}')>"


class Pago(Base):
    """Payments for sales"""
    __tablename__ = "pago"

    id_pago = Column(Integer, primary_key=True, autoincrement=True)
    id_venta = Column(Integer, ForeignKey("venta.id_venta"), nullable=False, unique=True)
    id_metodo_pago = Column(Integer, ForeignKey("metodo_pago.id_metodo_pago"), nullable=False)
    fecha_hora = Column(DateTime, nullable=False)
    monto = Column(Numeric(10, 2), nullable=False)

    # Relationships
    venta = relationship("Venta", back_populates="pago")
    metodo = relationship("MetodoPago", back_populates="pagos")

    def __repr__(self):
        return f"<Pago(id={self.id_pago}, venta_id={self.id_venta}, monto={self.monto})>"


class Comprobante(Base):
    """Receipt/Invoice information (separated from Pago as per 3NF)"""
    __tablename__ = "comprobante"

    id_comprobante = Column(Integer, primary_key=True, autoincrement=True)
    id_venta = Column(Integer, ForeignKey("venta.id_venta"), nullable=False, unique=True)
    tipo_comprobante = Column(String(20), nullable=False)  # Boleta, Factura
    nro_comprobante = Column(String(50), nullable=False, unique=True)

    # Relationships
    venta = relationship("Venta", back_populates="comprobante")

    def __repr__(self):
        return f"<Comprobante(id={self.id_comprobante}, tipo='{self.tipo_comprobante}', nro='{self.nro_comprobante}')>"
