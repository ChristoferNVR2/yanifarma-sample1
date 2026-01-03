"""
Proveedor (Supplier) and related models
"""

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Cargo(Base):
    """Job positions for supplier contacts"""
    __tablename__ = "cargo"

    id_cargo = Column(Integer, primary_key=True, autoincrement=True)
    descripcion = Column(String(100), nullable=False, unique=True)

    # Relationships
    contactos = relationship("ContactoProveedor", back_populates="cargo")

    def __repr__(self):
        return f"<Cargo(id={self.id_cargo}, descripcion='{self.descripcion}')>"


class Proveedor(Base):
    """Suppliers table"""
    __tablename__ = "proveedor"

    id_proveedor = Column(Integer, primary_key=True, autoincrement=True)
    ruc = Column(String(11), unique=True, nullable=False, index=True)
    razon_social = Column(String(255), nullable=False)
    direccion_empresa = Column(String(255))
    telefono_empresa = Column(String(20))
    correo_empresa = Column(String(255))

    # Relationships
    contactos = relationship("ContactoProveedor", back_populates="proveedor", cascade="all, delete-orphan")
    pedidos = relationship("Pedido", back_populates="proveedor")

    def __repr__(self):
        return f"<Proveedor(id={self.id_proveedor}, ruc='{self.ruc}', razon_social='{self.razon_social}')>"


class ContactoProveedor(Base):
    """Supplier contact persons"""
    __tablename__ = "contacto_proveedor"

    id_contacto = Column(Integer, primary_key=True, autoincrement=True)
    id_proveedor = Column(Integer, ForeignKey("proveedor.id_proveedor"), nullable=False)
    id_cargo = Column(Integer, ForeignKey("cargo.id_cargo"), nullable=False)
    nombres = Column(String(100), nullable=False)
    apellido_paterno = Column(String(100), nullable=False)
    apellido_materno = Column(String(100))
    telefono_contacto = Column(String(20))

    # Relationships
    proveedor = relationship("Proveedor", back_populates="contactos")
    cargo = relationship("Cargo", back_populates="contactos")

    def __repr__(self):
        return f"<ContactoProveedor(id={self.id_contacto}, nombre='{self.nombres} {self.apellido_paterno}')>"
