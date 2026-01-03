#!/usr/bin/env python3
"""
Database initialization and setup script
Creates all tables and populates them with sample data
"""

import sys
from pathlib import Path

# Add backend directory to path
backend_dir = Path(__file__).parent
sys.path.insert(0, str(backend_dir))

from app.database import engine, SessionLocal
from app.models import Base
from app.models import *


def create_tables():
    """Create all database tables"""
    print("=" * 60)
    print("CREATING DATABASE TABLES")
    print("=" * 60)
    print()
    
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("✓ All tables created successfully!")
    
    print("\nCreated tables:")
    for table_name in sorted(Base.metadata.tables.keys()):
        print(f"  • {table_name}")
    print()


def populate_sample_data():
    """Populate database with sample data"""
    print("=" * 60)
    print("POPULATING SAMPLE DATA")
    print("=" * 60)
    print()
    
    db = SessionLocal()
    
    try:
        # 1. ROLES
        print("1. Creating roles...")
        roles_data = [
            {"id_rol": 1, "nombre_rol": "admin"},
            {"id_rol": 2, "nombre_rol": "empleado"}
        ]
        for data in roles_data:
            if not db.query(Rol).filter_by(id_rol=data["id_rol"]).first():
                db.add(Rol(**data))
        db.commit()
        print(f"   ✓ {len(roles_data)} roles created")
        
        # 2. USUARIOS
        print("2. Creating users...")
        usuarios_data = [
            {
                "id_usuario": 1005,
                "username": "jackyfarma",
                "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5HHIJ6lPQp0A2",
                "nombres": "Yanina Jackelina",
                "apellido_paterno": "Castro",
                "apellido_materno": "Ventura"
            },
            {
                "id_usuario": 1008,
                "username": "malca",
                "password": "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5HHIJ6lPQp0A2",
                "nombres": "Luis Felipe",
                "apellido_paterno": "Malca",
                "apellido_materno": "Cotrina"
            }
        ]
        for data in usuarios_data:
            if not db.query(Usuario).filter_by(id_usuario=data["id_usuario"]).first():
                db.add(Usuario(**data))
        db.commit()
        print(f"   ✓ {len(usuarios_data)} users created")
        
        # 3. USUARIO-ROL
        print("3. Assigning roles to users...")
        roles_assignment = [
            {"id_usuario": 1005, "id_rol": 1},
            {"id_usuario": 1008, "id_rol": 2}
        ]
        for data in roles_assignment:
            if not db.query(UsuarioRol).filter_by(**data).first():
                db.add(UsuarioRol(**data))
        db.commit()
        print(f"   ✓ {len(roles_assignment)} role assignments created")
        
        # 4. CLIENTES
        print("4. Creating customers...")
        clientes_data = [
            {
                "id_cliente": 10007,
                "nro_doc": "25184946",
                "tipo_doc": "DNI",
                "nombres": "Rolando",
                "apellido_paterno": "Cruz",
                "apellido_materno": "Silvester",
                "correo": "jppazme@unitru.edu.pe",
                "direccion": "Av. América 123, Trujillo"
            },
            {
                "id_cliente": 10008,
                "nro_doc": "74859625",
                "tipo_doc": "DNI",
                "nombres": "Joaquin",
                "apellido_paterno": "Sarabia",
                "apellido_materno": "Condorcanqui",
                "correo": "flmalcaco@unitru.edu.pe",
                "direccion": "Jr. Pizarro 456, Trujillo"
            },
            {
                "id_cliente": 10009,
                "nro_doc": "47845962",
                "tipo_doc": "DNI",
                "nombres": "Ryan",
                "apellido_paterno": "Chavez",
                "apellido_materno": "Lizarraga",
                "correo": "arninaca@unitru.edu.pe",
                "direccion": "Av. España 789, Trujillo"
            }
        ]
        for data in clientes_data:
            if not db.query(Cliente).filter_by(id_cliente=data["id_cliente"]).first():
                db.add(Cliente(**data))
        db.commit()
        print(f"   ✓ {len(clientes_data)} customers created")
        
        # 5. TELEFONOS CLIENTE
        print("5. Adding customer phones...")
        telefonos_data = [
            {"id_cliente": 10007, "telefono": "916544875"},
            {"id_cliente": 10008, "telefono": "976431852"},
            {"id_cliente": 10009, "telefono": "987654321"}
        ]
        for data in telefonos_data:
            if not db.query(ClienteTelefono).filter_by(**data).first():
                db.add(ClienteTelefono(**data))
        db.commit()
        print(f"   ✓ {len(telefonos_data)} phone numbers added")
        
        # 6. CARGOS
        print("6. Creating job positions...")
        cargos_data = [
            {"id_cargo": 1, "descripcion": "Ejecutivo Comercial"},
            {"id_cargo": 2, "descripcion": "Representante Ventas"},
            {"id_cargo": 3, "descripcion": "Gerente de Ventas"}
        ]
        for data in cargos_data:
            if not db.query(Cargo).filter_by(id_cargo=data["id_cargo"]).first():
                db.add(Cargo(**data))
        db.commit()
        print(f"   ✓ {len(cargos_data)} positions created")
        
        # 7. PROVEEDORES
        print("7. Creating suppliers...")
        proveedores_data = [
            {
                "id_proveedor": 2001,
                "ruc": "20331066703",
                "razon_social": "Drogería A S.A.C.",
                "direccion_empresa": "Av. Javier Prado Este 1234, Trujillo",
                "telefono_empresa": "044564895",
                "correo_empresa": "contacto@drogeriaa.com"
            },
            {
                "id_proveedor": 2002,
                "ruc": "20445577889",
                "razon_social": "Drogería B S.R.L.",
                "direccion_empresa": "Calle Los Pinos 456, Lima",
                "telefono_empresa": "044254878",
                "correo_empresa": "ventas@drogeriab.com"
            }
        ]
        for data in proveedores_data:
            if not db.query(Proveedor).filter_by(id_proveedor=data["id_proveedor"]).first():
                db.add(Proveedor(**data))
        db.commit()
        print(f"   ✓ {len(proveedores_data)} suppliers created")
        
        # 8. CONTACTOS PROVEEDOR
        print("8. Adding supplier contacts...")
        contactos_data = [
            {
                "id_contacto": 3001,
                "id_proveedor": 2001,
                "id_cargo": 1,
                "nombres": "Luis Alberto",
                "apellido_paterno": "Paredes",
                "apellido_materno": "Ramos",
                "telefono_contacto": "987654321"
            },
            {
                "id_contacto": 3002,
                "id_proveedor": 2002,
                "id_cargo": 2,
                "nombres": "María Elena",
                "apellido_paterno": "Salazar",
                "apellido_materno": "Torres",
                "telefono_contacto": "944221876"
            }
        ]
        for data in contactos_data:
            if not db.query(ContactoProveedor).filter_by(id_contacto=data["id_contacto"]).first():
                db.add(ContactoProveedor(**data))
        db.commit()
        print(f"   ✓ {len(contactos_data)} contacts added")
        
        # 9. CATEGORIAS
        print("9. Creating product categories...")
        categorias_data = [
            {"id_categoria": 40001, "nombre_categoria": "Analgésico"},
            {"id_categoria": 40002, "nombre_categoria": "Antibiótico"},
            {"id_categoria": 40003, "nombre_categoria": "Antiinflamatorio"},
            {"id_categoria": 40004, "nombre_categoria": "Antialérgico"}
        ]
        for data in categorias_data:
            if not db.query(Categoria).filter_by(id_categoria=data["id_categoria"]).first():
                db.add(Categoria(**data))
        db.commit()
        print(f"   ✓ {len(categorias_data)} categories created")
        
        # 10. PRESENTACIONES
        print("10. Creating product presentations...")
        presentaciones_data = [
            {"id_presentacion": 400001, "desc_presentacion": "Caja x 10 tabletas"},
            {"id_presentacion": 400002, "desc_presentacion": "Caja x 12 cápsulas"},
            {"id_presentacion": 400003, "desc_presentacion": "Frasco x 120 ml"}
        ]
        for data in presentaciones_data:
            if not db.query(Presentacion).filter_by(id_presentacion=data["id_presentacion"]).first():
                db.add(Presentacion(**data))
        db.commit()
        print(f"   ✓ {len(presentaciones_data)} presentations created")
        
        # 11. COMPONENTES
        print("11. Creating product components...")
        componentes_data = [
            {"id_componente": 4000001, "nombre_componente": "Paracetamol 500 mg"},
            {"id_componente": 4000002, "nombre_componente": "Amoxicilina trihidratada 500 mg"},
            {"id_componente": 4000003, "nombre_componente": "Ibuprofeno 400 mg"},
            {"id_componente": 4000004, "nombre_componente": "Loratadina 10 mg"}
        ]
        for data in componentes_data:
            if not db.query(Componente).filter_by(id_componente=data["id_componente"]).first():
                db.add(Componente(**data))
        db.commit()
        print(f"   ✓ {len(componentes_data)} components created")
        
        # 12. PRODUCTOS
        print("12. Creating products...")
        from decimal import Decimal
        productos_data = [
            {
                "id_producto": 4001,
                "codigo_interno": "P-001",
                "nombre_comercial": "Paracetamol 500 mg",
                "precio_venta": Decimal("3.50"),
                "afecta_igv": True,
                "requiere_receta": False
            },
            {
                "id_producto": 4002,
                "codigo_interno": "P-002",
                "nombre_comercial": "Amoxicilina 500 mg",
                "precio_venta": Decimal("12.00"),
                "afecta_igv": True,
                "requiere_receta": True
            },
            {
                "id_producto": 4003,
                "codigo_interno": "P-003",
                "nombre_comercial": "Ibuprofeno 400 mg",
                "precio_venta": Decimal("5.80"),
                "afecta_igv": True,
                "requiere_receta": False
            },
            {
                "id_producto": 4004,
                "codigo_interno": "P-004",
                "nombre_comercial": "Loratadina 10 mg",
                "precio_venta": Decimal("6.00"),
                "afecta_igv": True,
                "requiere_receta": False
            }
        ]
        for data in productos_data:
            if not db.query(Producto).filter_by(id_producto=data["id_producto"]).first():
                db.add(Producto(**data))
        db.commit()
        print(f"   ✓ {len(productos_data)} products created")
        
        # 13. PRODUCTO-CATEGORIA
        print("13. Assigning categories to products...")
        prod_cat_data = [
            {"id_producto": 4001, "id_categoria": 40001},
            {"id_producto": 4002, "id_categoria": 40002},
            {"id_producto": 4003, "id_categoria": 40003},
            {"id_producto": 4004, "id_categoria": 40004}
        ]
        for data in prod_cat_data:
            if not db.query(ProductoCategoria).filter_by(**data).first():
                db.add(ProductoCategoria(**data))
        db.commit()
        print(f"   ✓ {len(prod_cat_data)} category assignments created")
        
        # 14. PRODUCTO-PRESENTACION
        print("14. Assigning presentations to products...")
        prod_pres_data = [
            {"id_producto": 4001, "id_presentacion": 400001},
            {"id_producto": 4002, "id_presentacion": 400002},
            {"id_producto": 4003, "id_presentacion": 400001},
            {"id_producto": 4004, "id_presentacion": 400001}
        ]
        for data in prod_pres_data:
            if not db.query(ProductoPresentacion).filter_by(**data).first():
                db.add(ProductoPresentacion(**data))
        db.commit()
        print(f"   ✓ {len(prod_pres_data)} presentation assignments created")
        
        # 15. PRODUCTO-COMPONENTE
        print("15. Assigning components to products...")
        prod_comp_data = [
            {"id_producto": 4001, "id_componente": 4000001},
            {"id_producto": 4002, "id_componente": 4000002},
            {"id_producto": 4003, "id_componente": 4000003},
            {"id_producto": 4004, "id_componente": 4000004}
        ]
        for data in prod_comp_data:
            if not db.query(ProductoComponente).filter_by(**data).first():
                db.add(ProductoComponente(**data))
        db.commit()
        print(f"   ✓ {len(prod_comp_data)} component assignments created")
        
        # 16. UBICACIONES
        print("16. Creating shelf locations...")
        ubicaciones_data = [
            {"id_ubicacion_estante": 50001, "estante": "A1", "nivel": "Nivel 1"},
            {"id_ubicacion_estante": 50002, "estante": "A2", "nivel": "Nivel 2"},
            {"id_ubicacion_estante": 50003, "estante": "B1", "nivel": "Nivel 3"},
            {"id_ubicacion_estante": 50004, "estante": "B2", "nivel": "Nivel 1"}
        ]
        for data in ubicaciones_data:
            if not db.query(UbicacionEstante).filter_by(id_ubicacion_estante=data["id_ubicacion_estante"]).first():
                db.add(UbicacionEstante(**data))
        db.commit()
        print(f"   ✓ {len(ubicaciones_data)} locations created")
        
        # 17. LOTES
        print("17. Creating product batches...")
        from datetime import date
        lotes_data = [
            {
                "id_lote": 5001,
                "id_producto": 4001,
                "codigo_lote": "L-2025-01",
                "fecha_vencimiento": date(2026, 2, 15),
                "cantidad_recibida": 120,
                "costo_unitario_compra": Decimal("2.10")
            },
            {
                "id_lote": 5002,
                "id_producto": 4002,
                "codigo_lote": "L-2025-02",
                "fecha_vencimiento": date(2025, 12, 30),
                "cantidad_recibida": 80,
                "costo_unitario_compra": Decimal("9.00")
            },
            {
                "id_lote": 5003,
                "id_producto": 4003,
                "codigo_lote": "L-2025-03",
                "fecha_vencimiento": date(2026, 4, 10),
                "cantidad_recibida": 100,
                "costo_unitario_compra": Decimal("3.90")
            },
            {
                "id_lote": 5004,
                "id_producto": 4004,
                "codigo_lote": "L-2025-04",
                "fecha_vencimiento": date(2026, 8, 20),
                "cantidad_recibida": 60,
                "costo_unitario_compra": Decimal("4.50")
            }
        ]
        for data in lotes_data:
            if not db.query(Lote).filter_by(id_lote=data["id_lote"]).first():
                db.add(Lote(**data))
        db.commit()
        print(f"   ✓ {len(lotes_data)} batches created")
        
        # 18. INVENTARIO
        print("18. Creating inventory records...")
        inventario_data = [
            {"id_inventario": 1, "id_lote": 5001, "id_ubicacion_estante": 50001, "stock_actual": 120},
            {"id_inventario": 2, "id_lote": 5002, "id_ubicacion_estante": 50002, "stock_actual": 80},
            {"id_inventario": 3, "id_lote": 5003, "id_ubicacion_estante": 50003, "stock_actual": 100},
            {"id_inventario": 4, "id_lote": 5004, "id_ubicacion_estante": 50004, "stock_actual": 60}
        ]
        for data in inventario_data:
            if not db.query(Inventario).filter_by(id_inventario=data["id_inventario"]).first():
                db.add(Inventario(**data))
        db.commit()
        print(f"   ✓ {len(inventario_data)} inventory records created")
        
        # 19. ESTADOS PEDIDO
        print("19. Creating order statuses...")
        estados_data = [
            {"id_estado_pedido": 60001, "descripcion": "Entregado"},
            {"id_estado_pedido": 60002, "descripcion": "En proceso"},
            {"id_estado_pedido": 60003, "descripcion": "Cancelado"}
        ]
        for data in estados_data:
            if not db.query(EstadoPedido).filter_by(id_estado_pedido=data["id_estado_pedido"]).first():
                db.add(EstadoPedido(**data))
        db.commit()
        print(f"   ✓ {len(estados_data)} order statuses created")
        
        # 20. MOTIVOS PEDIDO
        print("20. Creating order reasons...")
        motivos_data = [
            {"id_motivo_pedido": 600001, "descripcion": "stock bajo"},
            {"id_motivo_pedido": 600002, "descripcion": "pedido urgente"},
            {"id_motivo_pedido": 600003, "descripcion": "reposición programada"}
        ]
        for data in motivos_data:
            if not db.query(MotivoPedido).filter_by(id_motivo_pedido=data["id_motivo_pedido"]).first():
                db.add(MotivoPedido(**data))
        db.commit()
        print(f"   ✓ {len(motivos_data)} order reasons created")
        
        # 21. METODOS PAGO
        print("21. Creating payment methods...")
        metodos_data = [
            {"id_metodo_pago": 800001, "descripcion": "Efectivo"},
            {"id_metodo_pago": 800002, "descripcion": "Yape"},
            {"id_metodo_pago": 800003, "descripcion": "Tarjeta"},
            {"id_metodo_pago": 800004, "descripcion": "Transferencia"}
        ]
        for data in metodos_data:
            if not db.query(MetodoPago).filter_by(id_metodo_pago=data["id_metodo_pago"]).first():
                db.add(MetodoPago(**data))
        db.commit()
        print(f"   ✓ {len(metodos_data)} payment methods created")
        
        # 22. PEDIDOS
        print("22. Creating purchase orders...")
        pedidos_data = [
            {
                "id_pedido": 6001,
                "id_proveedor": 2001,
                "id_usuario": 1005,
                "id_estado_pedido": 60001,
                "id_motivo_pedido": 600001,
                "fecha_solicitud": date(2025, 10, 15),
                "fecha_entrega_estimada": date(2025, 10, 20)
            },
            {
                "id_pedido": 6002,
                "id_proveedor": 2002,
                "id_usuario": 1005,
                "id_estado_pedido": 60002,
                "id_motivo_pedido": 600002,
                "fecha_solicitud": date(2025, 10, 28),
                "fecha_entrega_estimada": date(2025, 11, 2)
            }
        ]
        for data in pedidos_data:
            if not db.query(Pedido).filter_by(id_pedido=data["id_pedido"]).first():
                db.add(Pedido(**data))
        db.commit()
        print(f"   ✓ {len(pedidos_data)} orders created")
        
        # 23. DETALLE PEDIDO
        print("23. Adding order details...")
        detalle_pedido_data = [
            {"id_pedido": 6001, "id_producto": 4001, "cantidad_solicitada": 50},
            {"id_pedido": 6001, "id_producto": 4003, "cantidad_solicitada": 100},
            {"id_pedido": 6002, "id_producto": 4002, "cantidad_solicitada": 50}
        ]
        for data in detalle_pedido_data:
            if not db.query(DetallePedido).filter_by(id_pedido=data["id_pedido"], id_producto=data["id_producto"]).first():
                db.add(DetallePedido(**data))
        db.commit()
        print(f"   ✓ {len(detalle_pedido_data)} order details added")
        
        # 24. COMPRAS
        print("24. Creating purchases...")
        compras_data = [
            {
                "id_compra": 7001,
                "id_pedido": 6001,
                "fecha_recepcion": date(2025, 10, 20),
                "nro_guia": "G000452",
                "tipo_comprobante": "Factura",
                "nro_comprobante": "F001-002356",
                "monto_total": Decimal("1250.00"),
                "estado": "Pagado",
                "fecha_pago": date(2025, 10, 22)
            }
        ]
        for data in compras_data:
            if not db.query(Compra).filter_by(id_compra=data["id_compra"]).first():
                db.add(Compra(**data))
        db.commit()
        print(f"   ✓ {len(compras_data)} purchases created")
        
        # 25. VENTAS
        print("25. Creating sales...")
        from datetime import time
        ventas_data = [
            {
                "id_venta": 8001,
                "id_cliente": 10009,
                "id_usuario": 1005,
                "fecha_venta": date(2025, 10, 30),
                "hora_venta": time(9, 45, 0),
                "monto_total": Decimal("28.50")
            },
            {
                "id_venta": 8002,
                "id_cliente": 10008,
                "id_usuario": 1008,
                "fecha_venta": date(2025, 10, 30),
                "hora_venta": time(11, 20, 0),
                "monto_total": Decimal("65.00")
            },
            {
                "id_venta": 8003,
                "id_cliente": 10007,
                "id_usuario": 1008,
                "fecha_venta": date(2025, 10, 31),
                "hora_venta": time(18, 10, 0),
                "monto_total": Decimal("15.70")
            }
        ]
        for data in ventas_data:
            if not db.query(Venta).filter_by(id_venta=data["id_venta"]).first():
                db.add(Venta(**data))
        db.commit()
        print(f"   ✓ {len(ventas_data)} sales created")
        
        # 26. DETALLE VENTA
        print("26. Adding sale details...")
        detalle_venta_data = [
            {"id_venta": 8001, "id_producto": 4001, "cantidad": 2, "precio_unitario_venta": Decimal("3.50"), "subtotal": Decimal("7.00")},
            {"id_venta": 8001, "id_producto": 4003, "cantidad": 3, "precio_unitario_venta": Decimal("5.80"), "subtotal": Decimal("17.40")},
            {"id_venta": 8002, "id_producto": 4002, "cantidad": 3, "precio_unitario_venta": Decimal("12.00"), "subtotal": Decimal("36.00")},
            {"id_venta": 8002, "id_producto": 4004, "cantidad": 2, "precio_unitario_venta": Decimal("6.00"), "subtotal": Decimal("12.00")},
            {"id_venta": 8003, "id_producto": 4003, "cantidad": 2, "precio_unitario_venta": Decimal("5.80"), "subtotal": Decimal("11.60")}
        ]
        for data in detalle_venta_data:
            if not db.query(DetalleVenta).filter_by(id_venta=data["id_venta"], id_producto=data["id_producto"]).first():
                db.add(DetalleVenta(**data))
        db.commit()
        print(f"   ✓ {len(detalle_venta_data)} sale details added")
        
        # 27. PAGOS
        print("27. Creating payments...")
        from datetime import datetime
        pagos_data = [
            {"id_pago": 80001, "id_venta": 8001, "id_metodo_pago": 800001, "fecha_hora": datetime(2025, 10, 30, 9, 45), "monto": Decimal("28.50")},
            {"id_pago": 80002, "id_venta": 8002, "id_metodo_pago": 800002, "fecha_hora": datetime(2025, 10, 30, 11, 20), "monto": Decimal("65.00")},
            {"id_pago": 80003, "id_venta": 8003, "id_metodo_pago": 800002, "fecha_hora": datetime(2025, 10, 31, 18, 10), "monto": Decimal("15.70")}
        ]
        for data in pagos_data:
            if not db.query(Pago).filter_by(id_pago=data["id_pago"]).first():
                db.add(Pago(**data))
        db.commit()
        print(f"   ✓ {len(pagos_data)} payments created")
        
        # 28. COMPROBANTES
        print("28. Creating receipts...")
        comprobantes_data = [
            {"id_comprobante": 90001, "id_venta": 8001, "tipo_comprobante": "Boleta", "nro_comprobante": "B001-001234"},
            {"id_comprobante": 90002, "id_venta": 8002, "tipo_comprobante": "Factura", "nro_comprobante": "F001-001235"},
            {"id_comprobante": 90003, "id_venta": 8003, "tipo_comprobante": "Boleta", "nro_comprobante": "B001-001236"}
        ]
        for data in comprobantes_data:
            if not db.query(Comprobante).filter_by(id_comprobante=data["id_comprobante"]).first():
                db.add(Comprobante(**data))
        db.commit()
        print(f"   ✓ {len(comprobantes_data)} receipts created")
        
        print()
        print("=" * 60)
        print("✅ SAMPLE DATA POPULATED SUCCESSFULLY!")
        print("=" * 60)
        
    except Exception as e:
        db.rollback()
        print(f"\n❌ Error populating data: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    finally:
        db.close()
    
    return True


def verify_data():
    """Verify that data was loaded correctly"""
    print()
    print("=" * 60)
    print("VERIFYING DATA")
    print("=" * 60)
    print()
    
    db = SessionLocal()
    
    try:
        counts = {
            "Roles": db.query(Rol).count(),
            "Usuarios": db.query(Usuario).count(),
            "Clientes": db.query(Cliente).count(),
            "Proveedores": db.query(Proveedor).count(),
            "Productos": db.query(Producto).count(),
            "Categorías": db.query(Categoria).count(),
            "Inventario": db.query(Inventario).count(),
            "Pedidos": db.query(Pedido).count(),
            "Ventas": db.query(Venta).count(),
            "Pagos": db.query(Pago).count(),
        }
        
        print("Record counts:")
        for table, count in counts.items():
            status = "✓" if count > 0 else "✗"
            print(f"  {status} {table:20s} {count:>5d} records")
        
        all_ok = all(count > 0 for count in counts.values())
        
        if all_ok:
            print()
            print("✅ All tables have data!")
        else:
            print()
            print("⚠️  Some tables are empty")
        
        return all_ok
        
    finally:
        db.close()


def main():
    """Main setup function"""
    print()
    print("╔" + "=" * 58 + "╗")
    print("║" + " " * 10 + "YANIFARMA DATABASE SETUP" + " " * 24 + "║")
    print("╚" + "=" * 58 + "╝")
    print()
    
    try:
        # Step 1: Create tables
        create_tables()
        
        # Step 2: Populate data
        success = populate_sample_data()
        
        if not success:
            print("\n❌ Setup failed!")
            sys.exit(1)
        
        # Step 3: Verify
        verify_data()
        
        # Final message
        print()
        print("=" * 60)
        print("🎉 SETUP COMPLETE!")
        print("=" * 60)
        print()
        print("Your database is ready to use!")
        print()
        print("Next steps:")
        print("  • Start the API: uvicorn app.app:app --reload")
        print("  • Or with Docker: docker-compose up")
        print("  • Test endpoints: python test_api.py")
        print("  • View API docs: http://localhost:8000/docs")
        print()
        
    except Exception as e:
        print(f"\n❌ Setup failed: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == "__main__":
    main()
