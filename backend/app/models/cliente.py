"""
Cliente (Customer) and related models
"""

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Cliente(Base):
    """Customers table"""
    __tablename__ = "cliente"

    id_cliente = Column(Integer, primary_key=True, autoincrement=True)
    nro_doc = Column(String(20), unique=True, nullable=False, index=True)
    tipo_doc = Column(String(20), nullable=False)  # DNI, RUC, Passport, etc.
    nombres = Column(String(100), nullable=False)
    apellido_paterno = Column(String(100), nullable=False)
    apellido_materno = Column(String(100))
    correo = Column(String(255))
    direccion = Column(String(255))

    # Relationships
    telefonos = relationship("ClienteTelefono", back_populates="cliente", cascade="all, delete-orphan")
    ventas = relationship("Venta", back_populates="cliente")

    def __repr__(self):
        return f"<Cliente(id={self.id_cliente}, doc='{self.nro_doc}', nombre='{self.nombres}')>"


class ClienteTelefono(Base):
    """Customer phone numbers - allows multiple phones per customer"""
    __tablename__ = "cliente_telefono"

    id_cliente = Column(Integer, ForeignKey("cliente.id_cliente"), primary_key=True)
    telefono = Column(String(20), primary_key=True)

    # Relationships
    cliente = relationship("Cliente", back_populates="telefonos")

    def __repr__(self):
        return f"<ClienteTelefono(cliente_id={self.id_cliente}, telefono='{self.telefono}')>"
