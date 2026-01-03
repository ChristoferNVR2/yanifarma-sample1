"""
Usuario (User) and related models
"""

from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from .base import Base


class Rol(Base):
    """Roles table - defines user types (admin, empleado)"""
    __tablename__ = "rol"

    id_rol = Column(Integer, primary_key=True, autoincrement=True)
    nombre_rol = Column(String(50), nullable=False, unique=True)

    # Relationships
    usuarios = relationship("UsuarioRol", back_populates="rol")

    def __repr__(self):
        return f"<Rol(id={self.id_rol}, nombre='{self.nombre_rol}')>"


class Usuario(Base):
    """Users table - stores system users"""
    __tablename__ = "usuario"

    id_usuario = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    nombres = Column(String(100), nullable=False)
    apellido_paterno = Column(String(100), nullable=False)
    apellido_materno = Column(String(100))

    # Relationships
    roles = relationship("UsuarioRol", back_populates="usuario")
    pedidos = relationship("Pedido", back_populates="usuario")
    ventas = relationship("Venta", back_populates="usuario")

    def __repr__(self):
        return f"<Usuario(id={self.id_usuario}, username='{self.username}')>"


class UsuarioRol(Base):
    """Many-to-many relationship between Usuario and Rol"""
    __tablename__ = "usuario_rol"

    id_usuario = Column(Integer, ForeignKey("usuario.id_usuario"), primary_key=True)
    id_rol = Column(Integer, ForeignKey("rol.id_rol"), primary_key=True)

    # Relationships
    usuario = relationship("Usuario", back_populates="roles")
    rol = relationship("Rol", back_populates="usuarios")

    def __repr__(self):
        return f"<UsuarioRol(usuario_id={self.id_usuario}, rol_id={self.id_rol})>"
