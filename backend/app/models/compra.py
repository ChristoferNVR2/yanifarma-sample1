"""
Compra (Purchase) model
"""

from sqlalchemy import Column, Integer, String, Date, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Compra(Base):
    """Purchases - confirmed receipt of orders"""
    __tablename__ = "compra"

    id_compra = Column(Integer, primary_key=True, autoincrement=True)
    id_pedido = Column(Integer, ForeignKey("pedido.id_pedido"), nullable=False, unique=True)
    fecha_recepcion = Column(Date, nullable=False)
    nro_guia = Column(String(50), unique=True)
    tipo_comprobante = Column(String(20))  # Factura, Boleta
    nro_comprobante = Column(String(50), unique=True)
    monto_total = Column(Numeric(10, 2), nullable=False)
    estado = Column(String(20), nullable=False)  # Pagado, Pendiente
    fecha_pago = Column(Date)

    # Relationships
    pedido = relationship("Pedido", back_populates="compra")

    def __repr__(self):
        return f"<Compra(id={self.id_compra}, pedido_id={self.id_pedido}, monto={self.monto_total})>"
