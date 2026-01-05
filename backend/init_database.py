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
            },
            {
                "id_cliente": 10010,
                "nro_doc": "36925814",
                "tipo_doc": "DNI",
                "nombres": "Ana Maria",
                "apellido_paterno": "Lopez",
                "apellido_materno": "Gomez",
                "correo": "anamarialg@unitru.edu.pe",
                "direccion": "Calle Los Laureles 234, Trujillo"
            },
            {
                "id_cliente": 10011,
                "nro_doc": "52847196",
                "tipo_doc": "DNI",
                "nombres": "Carlos",
                "apellido_paterno": "Mendoza",
                "apellido_materno": "Rios",
                "correo": "cmendoza@unitru.edu.pe",
                "direccion": "Av. Larco 567, Trujillo"
            },
            {
                "id_cliente": 10012,
                "nro_doc": "61938475",
                "tipo_doc": "DNI",
                "nombres": "Sofia",
                "apellido_paterno": "Vargas",
                "apellido_materno": "Castillo",
                "correo": "svargas@unitru.edu.pe",
                "direccion": "Jr. Bolivar 890, Trujillo"
            },
            {
                "id_cliente": 10013,
                "nro_doc": "73825946",
                "tipo_doc": "DNI",
                "nombres": "Miguel",
                "apellido_paterno": "Torres",
                "apellido_materno": "Sanchez",
                "correo": "mtorres@unitru.edu.pe",
                "direccion": "Calle San Martin 345, Trujillo"
            },
            {
                "id_cliente": 10014,
                "nro_doc": "48562719",
                "tipo_doc": "DNI",
                "nombres": "Laura",
                "apellido_paterno": "Ramirez",
                "apellido_materno": "Flores",
                "correo": "lramirez@unitru.edu.pe",
                "direccion": "Av. Grau 678, Trujillo"
            },
            {
                "id_cliente": 10015,
                "nro_doc": "59374682",
                "tipo_doc": "DNI",
                "nombres": "Diego",
                "apellido_paterno": "Paredes",
                "apellido_materno": "Luna",
                "correo": "dparedes@unitru.edu.pe",
                "direccion": "Jr. Ayacucho 901, Trujillo"
            },
            {
                "id_cliente": 10016,
                "nro_doc": "62938471",
                "tipo_doc": "DNI",
                "nombres": "Valentina",
                "apellido_paterno": "Gutierrez",
                "apellido_materno": "Morales",
                "correo": "vgutierrez@unitru.edu.pe",
                "direccion": "Calle Junin 234, Trujillo"
            },
            {
                "id_cliente": 10017,
                "nro_doc": "71849256",
                "tipo_doc": "DNI",
                "nombres": "Andres",
                "apellido_paterno": "Jimenez",
                "apellido_materno": "Vega",
                "correo": "ajimenez@unitru.edu.pe",
                "direccion": "Av. Victor Larco 456, Trujillo"
            },
            {
                "id_cliente": 10018,
                "nro_doc": "53719482",
                "tipo_doc": "DNI",
                "nombres": "Isabella",
                "apellido_paterno": "Rojas",
                "apellido_materno": "Diaz",
                "correo": "irojas@unitru.edu.pe",
                "direccion": "Jr. Independencia 789, Trujillo"
            },
            {
                "id_cliente": 10019,
                "nro_doc": "64827195",
                "tipo_doc": "DNI",
                "nombres": "Sebastian",
                "apellido_paterno": "Navarro",
                "apellido_materno": "Herrera",
                "correo": "snavarro@unitru.edu.pe",
                "direccion": "Calle Orbegoso 012, Trujillo"
            },
            {
                "id_cliente": 10020,
                "nro_doc": "45938271",
                "tipo_doc": "DNI",
                "nombres": "Camila",
                "apellido_paterno": "Castro",
                "apellido_materno": "Silva",
                "correo": "ccastro@unitru.edu.pe",
                "direccion": "Av. Mansiche 345, Trujillo"
            },
            {
                "id_cliente": 10021,
                "nro_doc": "58274639",
                "tipo_doc": "DNI",
                "nombres": "Mateo",
                "apellido_paterno": "Reyes",
                "apellido_materno": "Perez",
                "correo": "mreyes@unitru.edu.pe",
                "direccion": "Jr. Almagro 678, Trujillo"
            },
            {
                "id_cliente": 10022,
                "nro_doc": "69183745",
                "tipo_doc": "DNI",
                "nombres": "Lucia",
                "apellido_paterno": "Ortiz",
                "apellido_materno": "Medina",
                "correo": "lortiz@unitru.edu.pe",
                "direccion": "Calle Colon 901, Trujillo"
            },
            {
                "id_cliente": 10023,
                "nro_doc": "72946381",
                "tipo_doc": "DNI",
                "nombres": "Gabriel",
                "apellido_paterno": "Fernandez",
                "apellido_materno": "Ruiz",
                "correo": "gfernandez@unitru.edu.pe",
                "direccion": "Av. El Golf 234, Trujillo"
            },
            {
                "id_cliente": 10024,
                "nro_doc": "51827496",
                "tipo_doc": "DNI",
                "nombres": "Martina",
                "apellido_paterno": "Soto",
                "apellido_materno": "Aguilar",
                "correo": "msoto@unitru.edu.pe",
                "direccion": "Jr. Zepita 567, Trujillo"
            },
            {
                "id_cliente": 10025,
                "nro_doc": "63749182",
                "tipo_doc": "DNI",
                "nombres": "Nicolas",
                "apellido_paterno": "Ramos",
                "apellido_materno": "Campos",
                "correo": "nramos@unitru.edu.pe",
                "direccion": "Calle Gamarra 890, Trujillo"
            },
            {
                "id_cliente": 10026,
                "nro_doc": "47392816",
                "tipo_doc": "DNI",
                "nombres": "Emma",
                "apellido_paterno": "Quispe",
                "apellido_materno": "Palacios",
                "correo": "equispe@unitru.edu.pe",
                "direccion": "Av. Universitaria 123, Trujillo"
            },
            {
                "id_cliente": 10027,
                "nro_doc": "59182746",
                "tipo_doc": "DNI",
                "nombres": "Benjamin",
                "apellido_paterno": "Huaman",
                "apellido_materno": "Caceres",
                "correo": "bhuaman@unitru.edu.pe",
                "direccion": "Jr. Tacna 456, Trujillo"
            },
            {
                "id_cliente": 10028,
                "nro_doc": "68274951",
                "tipo_doc": "DNI",
                "nombres": "Olivia",
                "apellido_paterno": "Salazar",
                "apellido_materno": "Romero",
                "correo": "osalazar@unitru.edu.pe",
                "direccion": "Calle Miraflores 789, Trujillo"
            },
            {
                "id_cliente": 10029,
                "nro_doc": "54718296",
                "tipo_doc": "DNI",
                "nombres": "Santiago",
                "apellido_paterno": "Alarcon",
                "apellido_materno": "Bravo",
                "correo": "salarcon@unitru.edu.pe",
                "direccion": "Av. La Marina 012, Trujillo"
            },
            {
                "id_cliente": 10030,
                "nro_doc": "61938274",
                "tipo_doc": "DNI",
                "nombres": "Mia",
                "apellido_paterno": "Villanueva",
                "apellido_materno": "Coronel",
                "correo": "mvillanueva@unitru.edu.pe",
                "direccion": "Jr. Cahuide 345, Trujillo"
            },
            {
                "id_cliente": 10031,
                "nro_doc": "73829461",
                "tipo_doc": "DNI",
                "nombres": "Lucas",
                "apellido_paterno": "Paz",
                "apellido_materno": "Montenegro",
                "correo": "lpaz@unitru.edu.pe",
                "direccion": "Calle Los Pinos 678, Trujillo"
            },
            {
                "id_cliente": 10032,
                "nro_doc": "48571926",
                "tipo_doc": "DNI",
                "nombres": "Victoria",
                "apellido_paterno": "Espinoza",
                "apellido_materno": "Carrasco",
                "correo": "vespinoza@unitru.edu.pe",
                "direccion": "Av. Los Incas 901, Trujillo"
            },
            {
                "id_cliente": 10033,
                "nro_doc": "52948176",
                "tipo_doc": "DNI",
                "nombres": "Daniel",
                "apellido_paterno": "Cordova",
                "apellido_materno": "Maldonado",
                "correo": "dcordova@unitru.edu.pe",
                "direccion": "Jr. Tarapaca 234, Trujillo"
            },
            {
                "id_cliente": 10034,
                "nro_doc": "67182945",
                "tipo_doc": "DNI",
                "nombres": "Elena",
                "apellido_paterno": "Benavides",
                "apellido_materno": "Valverde",
                "correo": "ebenavides@unitru.edu.pe",
                "direccion": "Calle San Andres 567, Trujillo"
            },
            {
                "id_cliente": 10035,
                "nro_doc": "59273841",
                "tipo_doc": "DNI",
                "nombres": "Fernando",
                "apellido_paterno": "Calderon",
                "apellido_materno": "Marquez",
                "correo": "fcalderon@unitru.edu.pe",
                "direccion": "Av. Cesar Vallejo 890, Trujillo"
            },
            {
                "id_cliente": 10036,
                "nro_doc": "71849526",
                "tipo_doc": "DNI",
                "nombres": "Catalina",
                "apellido_paterno": "Prado",
                "apellido_materno": "Velasquez",
                "correo": "cprado@unitru.edu.pe",
                "direccion": "Jr. Libertad 123, Trujillo"
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
            {"id_cliente": 10009, "telefono": "987654321"},
            {"id_cliente": 10010, "telefono": "945123678"},
            {"id_cliente": 10011, "telefono": "923456789"},
            {"id_cliente": 10012, "telefono": "934567890"},
            {"id_cliente": 10013, "telefono": "912345678"},
            {"id_cliente": 10014, "telefono": "998765432"},
            {"id_cliente": 10015, "telefono": "956789012"},
            {"id_cliente": 10016, "telefono": "967890123"},
            {"id_cliente": 10017, "telefono": "978901234"},
            {"id_cliente": 10018, "telefono": "989012345"},
            {"id_cliente": 10019, "telefono": "990123456"},
            {"id_cliente": 10020, "telefono": "901234567"},
            {"id_cliente": 10021, "telefono": "912345670"},
            {"id_cliente": 10022, "telefono": "923456781"},
            {"id_cliente": 10023, "telefono": "934567892"},
            {"id_cliente": 10024, "telefono": "945678903"},
            {"id_cliente": 10025, "telefono": "956789014"},
            {"id_cliente": 10026, "telefono": "967890125"},
            {"id_cliente": 10027, "telefono": "978901236"},
            {"id_cliente": 10028, "telefono": "989012347"},
            {"id_cliente": 10029, "telefono": "990123458"},
            {"id_cliente": 10030, "telefono": "901234569"},
            {"id_cliente": 10031, "telefono": "912345681"},
            {"id_cliente": 10032, "telefono": "923456792"},
            {"id_cliente": 10033, "telefono": "934567803"},
            {"id_cliente": 10034, "telefono": "945678914"},
            {"id_cliente": 10035, "telefono": "956789025"},
            {"id_cliente": 10036, "telefono": "967890136"}
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
                "ruc": "20131312955",
                "razon_social": "Distribuidora Médica del Norte S.A.C.",
                "direccion_empresa": "Av. España 2456, Trujillo",
                "telefono_empresa": "044481235",
                "correo_empresa": "ventas@medicalnnorte.com.pe"
            },
            {
                "id_proveedor": 2002,
                "ruc": "20445523189",
                "razon_social": "Farmacéutica La Libertad E.I.R.L.",
                "direccion_empresa": "Jr. Pizarro 875, Trujillo",
                "telefono_empresa": "044254878",
                "correo_empresa": "contacto@farmalibertad.pe"
            },
            {
                "id_proveedor": 2003,
                "ruc": "20487654321",
                "razon_social": "Droguería Farmacentro S.R.L.",
                "direccion_empresa": "Av. América Sur 3120, Trujillo",
                "telefono_empresa": "044482567",
                "correo_empresa": "pedidos@farmacentro.com.pe"
            },
            {
                "id_proveedor": 2004,
                "ruc": "20536789234",
                "razon_social": "Representaciones Médicas Mochica S.A.",
                "direccion_empresa": "Av. Larco 1234, Trujillo",
                "telefono_empresa": "044293845",
                "correo_empresa": "ventas@mochicamed.pe"
            },
            {
                "id_proveedor": 2005,
                "ruc": "20398765432",
                "razon_social": "Importadora Farma Norte S.A.C.",
                "direccion_empresa": "Calle San Martín 658, Trujillo",
                "telefono_empresa": "044471892",
                "correo_empresa": "info@farmanorte.com"
            },
            {
                "id_proveedor": 2006,
                "ruc": "20612345789",
                "razon_social": "Distribuciones Salud Total E.I.R.L.",
                "direccion_empresa": "Av. Húsares de Junín 890, Trujillo",
                "telefono_empresa": "044328956",
                "correo_empresa": "atencion@saludtotal.pe"
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
            },
            {
                "id_contacto": 3003,
                "id_proveedor": 2003,
                "id_cargo": 1,
                "nombres": "Carlos Eduardo",
                "apellido_paterno": "Mendoza",
                "apellido_materno": "Castro",
                "telefono_contacto": "932145678"
            },
            {
                "id_contacto": 3004,
                "id_proveedor": 2004,
                "id_cargo": 3,
                "nombres": "Patricia Isabel",
                "apellido_paterno": "Rojas",
                "apellido_materno": "Fernandez",
                "telefono_contacto": "965432189"
            },
            {
                "id_contacto": 3005,
                "id_proveedor": 2005,
                "id_cargo": 2,
                "nombres": "Roberto Miguel",
                "apellido_paterno": "Gomez",
                "apellido_materno": "Vargas",
                "telefono_contacto": "978123456"
            },
            {
                "id_contacto": 3006,
                "id_proveedor": 2006,
                "id_cargo": 1,
                "nombres": "Ana Lucia",
                "apellido_paterno": "Diaz",
                "apellido_materno": "Soto",
                "telefono_contacto": "945678901"
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
            {"id_categoria": 40004, "nombre_categoria": "Antialérgico"},
            {"id_categoria": 40005, "nombre_categoria": "Vitaminas"},
            {"id_categoria": 40006, "nombre_categoria": "Digestivo"},
            {"id_categoria": 40007, "nombre_categoria": "Antitusivo"},
            {"id_categoria": 40008, "nombre_categoria": "Antihistamínico"},
            {"id_categoria": 40009, "nombre_categoria": "Cardiovascular"},
            {"id_categoria": 40010, "nombre_categoria": "Dermatológico"},
            {"id_categoria": 40011, "nombre_categoria": "Oftalmológico"},
            {"id_categoria": 40012, "nombre_categoria": "Antidiabético"},
            {"id_categoria": 40013, "nombre_categoria": "Suplemento Nutricional"},
            {"id_categoria": 40014, "nombre_categoria": "Antiparasitario"},
            {"id_categoria": 40015, "nombre_categoria": "Respiratorio"}
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
            {"id_presentacion": 400003, "desc_presentacion": "Frasco x 120 ml"},
            {"id_presentacion": 400004, "desc_presentacion": "Caja x 20 tabletas"},
            {"id_presentacion": 400005, "desc_presentacion": "Blister x 30 cápsulas"},
            {"id_presentacion": 400006, "desc_presentacion": "Caja x 30 tabletas"},
            {"id_presentacion": 400007, "desc_presentacion": "Frasco x 60 ml"},
            {"id_presentacion": 400008, "desc_presentacion": "Tubo x 30 g"},
            {"id_presentacion": 400009, "desc_presentacion": "Ampolla x 2 ml"},
            {"id_presentacion": 400010, "desc_presentacion": "Sobre x 10 g"},
            {"id_presentacion": 400011, "desc_presentacion": "Caja x 60 tabletas"},
            {"id_presentacion": 400012, "desc_presentacion": "Frasco x 100 ml"},
            {"id_presentacion": 400013, "desc_presentacion": "Blister x 14 cápsulas"},
            {"id_presentacion": 400014, "desc_presentacion": "Frasco gotero x 15 ml"},
            {"id_presentacion": 400015, "desc_presentacion": "Crema x 50 g"},
            {"id_presentacion": 400016, "desc_presentacion": "Jarabe x 200 ml"},
            {"id_presentacion": 400017, "desc_presentacion": "Caja x 28 comprimidos"},
            {"id_presentacion": 400018, "desc_presentacion": "Spray nasal x 15 ml"},
            {"id_presentacion": 400019, "desc_presentacion": "Parche transdérmico x 5"},
            {"id_presentacion": 400020, "desc_presentacion": "Supositorio x 10"}
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
            {"id_componente": 4000004, "nombre_componente": "Loratadina 10 mg"},
            {"id_componente": 4000005, "nombre_componente": "Vitamina C 1000 mg"},
            {"id_componente": 4000006, "nombre_componente": "Omeprazol 20 mg"},
            {"id_componente": 4000007, "nombre_componente": "Diclofenaco sódico 50 mg"},
            {"id_componente": 4000008, "nombre_componente": "Cetirizina diclorhidrato 10 mg"},
            {"id_componente": 4000009, "nombre_componente": "Atorvastatina cálcica 20 mg"},
            {"id_componente": 4000010, "nombre_componente": "Metformina clorhidrato 850 mg"},
            {"id_componente": 4000011, "nombre_componente": "Losartán potásico 50 mg"},
            {"id_componente": 4000012, "nombre_componente": "Dextrometorfano bromhidrato 15 mg"},
            {"id_componente": 4000013, "nombre_componente": "Clotrimazol 1%"},
            {"id_componente": 4000014, "nombre_componente": "Complejo B (B1, B6, B12)"},
            {"id_componente": 4000015, "nombre_componente": "Bromhexina clorhidrato 8 mg"},
            {"id_componente": 4000016, "nombre_componente": "Ranitidina clorhidrato 150 mg"},
            {"id_componente": 4000017, "nombre_componente": "Ciprofloxacino 500 mg"},
            {"id_componente": 4000018, "nombre_componente": "Salbutamol sulfato 100 mcg"},
            {"id_componente": 4000019, "nombre_componente": "Ácido acetilsalicílico 100 mg"},
            {"id_componente": 4000020, "nombre_componente": "Albendazol 400 mg"}
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
            },
            {
                "id_producto": 4005,
                "codigo_interno": "P-005",
                "nombre_comercial": "Vitamina C 1000 mg",
                "precio_venta": Decimal("15.00"),
                "afecta_igv": True,
                "requiere_receta": False
            },
            {
                "id_producto": 4006,
                "codigo_interno": "P-006",
                "nombre_comercial": "Omeprazol 20 mg",
                "precio_venta": Decimal("8.50"),
                "afecta_igv": True,
                "requiere_receta": True
            },
            {
                "id_producto": 4007,
                "codigo_interno": "P-007",
                "nombre_comercial": "Diclofenaco 50 mg",
                "precio_venta": Decimal("7.20"),
                "afecta_igv": True,
                "requiere_receta": True
            },
            {
                "id_producto": 4008,
                "codigo_interno": "P-008",
                "nombre_comercial": "Cetirizina 10 mg",
                "precio_venta": Decimal("5.50"),
                "afecta_igv": True,
                "requiere_receta": False
            },
            {
                "id_producto": 4009,
                "codigo_interno": "P-009",
                "nombre_comercial": "Atorvastatina 20 mg",
                "precio_venta": Decimal("18.00"),
                "afecta_igv": True,
                "requiere_receta": True
            },
            {
                "id_producto": 4010,
                "codigo_interno": "P-010",
                "nombre_comercial": "Metformina 850 mg",
                "precio_venta": Decimal("12.50"),
                "afecta_igv": True,
                "requiere_receta": True
            },
            {
                "id_producto": 4011,
                "codigo_interno": "P-011",
                "nombre_comercial": "Losartán 50 mg",
                "precio_venta": Decimal("14.00"),
                "afecta_igv": True,
                "requiere_receta": True
            },
            {
                "id_producto": 4012,
                "codigo_interno": "P-012",
                "nombre_comercial": "Dextrometorfano Jarabe",
                "precio_venta": Decimal("9.80"),
                "afecta_igv": True,
                "requiere_receta": False
            },
            {
                "id_producto": 4013,
                "codigo_interno": "P-013",
                "nombre_comercial": "Clotrimazol Crema",
                "precio_venta": Decimal("11.50"),
                "afecta_igv": True,
                "requiere_receta": False
            },
            {
                "id_producto": 4014,
                "codigo_interno": "P-014",
                "nombre_comercial": "Complejo B",
                "precio_venta": Decimal("16.00"),
                "afecta_igv": True,
                "requiere_receta": False
            },
            {
                "id_producto": 4015,
                "codigo_interno": "P-015",
                "nombre_comercial": "Bromhexina 8 mg",
                "precio_venta": Decimal("7.50"),
                "afecta_igv": True,
                "requiere_receta": False
            },
            {
                "id_producto": 4016,
                "codigo_interno": "P-016",
                "nombre_comercial": "Ranitidina 150 mg",
                "precio_venta": Decimal("6.80"),
                "afecta_igv": True,
                "requiere_receta": False
            },
            {
                "id_producto": 4017,
                "codigo_interno": "P-017",
                "nombre_comercial": "Ciprofloxacino 500 mg",
                "precio_venta": Decimal("15.00"),
                "afecta_igv": True,
                "requiere_receta": True
            },
            {
                "id_producto": 4018,
                "codigo_interno": "P-018",
                "nombre_comercial": "Salbutamol Inhalador",
                "precio_venta": Decimal("22.00"),
                "afecta_igv": True,
                "requiere_receta": True
            },
            {
                "id_producto": 4019,
                "codigo_interno": "P-019",
                "nombre_comercial": "Aspirina 100 mg",
                "precio_venta": Decimal("4.50"),
                "afecta_igv": True,
                "requiere_receta": False
            },
            {
                "id_producto": 4020,
                "codigo_interno": "P-020",
                "nombre_comercial": "Albendazol 400 mg",
                "precio_venta": Decimal("8.00"),
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
            {"id_producto": 4001, "id_categoria": 40001},  # Paracetamol -> Analgésico
            {"id_producto": 4002, "id_categoria": 40002},  # Amoxicilina -> Antibiótico
            {"id_producto": 4003, "id_categoria": 40003},  # Ibuprofeno -> Antiinflamatorio
            {"id_producto": 4004, "id_categoria": 40004},  # Loratadina -> Antialérgico
            {"id_producto": 4005, "id_categoria": 40005},  # Vitamina C -> Vitaminas
            {"id_producto": 4006, "id_categoria": 40006},  # Omeprazol -> Digestivo
            {"id_producto": 4007, "id_categoria": 40003},  # Diclofenaco -> Antiinflamatorio
            {"id_producto": 4008, "id_categoria": 40008},  # Cetirizina -> Antihistamínico
            {"id_producto": 4009, "id_categoria": 40009},  # Atorvastatina -> Cardiovascular
            {"id_producto": 4010, "id_categoria": 40012},  # Metformina -> Antidiabético
            {"id_producto": 4011, "id_categoria": 40009},  # Losartán -> Cardiovascular
            {"id_producto": 4012, "id_categoria": 40007},  # Dextrometorfano -> Antitusivo
            {"id_producto": 4013, "id_categoria": 40010},  # Clotrimazol -> Dermatológico
            {"id_producto": 4014, "id_categoria": 40005},  # Complejo B -> Vitaminas
            {"id_producto": 4015, "id_categoria": 40015},  # Bromhexina -> Respiratorio
            {"id_producto": 4016, "id_categoria": 40006},  # Ranitidina -> Digestivo
            {"id_producto": 4017, "id_categoria": 40002},  # Ciprofloxacino -> Antibiótico
            {"id_producto": 4018, "id_categoria": 40015},  # Salbutamol -> Respiratorio
            {"id_producto": 4019, "id_categoria": 40009},  # Aspirina -> Cardiovascular
            {"id_producto": 4020, "id_categoria": 40014},  # Albendazol -> Antiparasitario
        ]

        for data in prod_cat_data:
            if not db.query(ProductoCategoria).filter_by(**data).first():
                db.add(ProductoCategoria(**data))
        db.commit()
        print(f"   ✓ {len(prod_cat_data)} category assignments created")

        # 14. PRODUCTO-PRESENTACION
        print("14. Assigning presentations to products...")
        prod_pres_data = [
            {"id_producto": 4001, "id_presentacion": 400001},  # Paracetamol -> Caja x 10 tabletas
            {"id_producto": 4002, "id_presentacion": 400002},  # Amoxicilina -> Caja x 12 cápsulas
            {"id_producto": 4003, "id_presentacion": 400004},  # Ibuprofeno -> Caja x 20 tabletas
            {"id_producto": 4004, "id_presentacion": 400004},  # Loratadina -> Caja x 20 tabletas
            {"id_producto": 4005, "id_presentacion": 400005},  # Vitamina C -> Blister x 30 cápsulas
            {"id_producto": 4006, "id_presentacion": 400006},  # Omeprazol -> Caja x 30 tabletas
            {"id_producto": 4007, "id_presentacion": 400004},  # Diclofenaco -> Caja x 20 tabletas
            {"id_producto": 4008, "id_presentacion": 400001},  # Cetirizina -> Caja x 10 tabletas
            {"id_producto": 4009, "id_presentacion": 400006},  # Atorvastatina -> Caja x 30 tabletas
            {"id_producto": 4010, "id_presentacion": 400011},  # Metformina -> Caja x 60 tabletas
            {"id_producto": 4011, "id_presentacion": 400006},  # Losartán -> Caja x 30 tabletas
            {"id_producto": 4012, "id_presentacion": 400016},  # Dextrometorfano -> Jarabe x 200 ml
            {"id_producto": 4013, "id_presentacion": 400015},  # Clotrimazol -> Crema x 50 g
            {"id_producto": 4014, "id_presentacion": 400005},  # Complejo B -> Blister x 30 cápsulas
            {"id_producto": 4015, "id_presentacion": 400004},  # Bromhexina -> Caja x 20 tabletas
            {"id_producto": 4016, "id_presentacion": 400006},  # Ranitidina -> Caja x 30 tabletas
            {"id_producto": 4017, "id_presentacion": 400013},  # Ciprofloxacino -> Blister x 14 cápsulas
            {"id_producto": 4018, "id_presentacion": 400018},  # Salbutamol -> Spray nasal x 15 ml
            {"id_producto": 4019, "id_presentacion": 400017},  # Aspirina -> Caja x 28 comprimidos
            {"id_producto": 4020, "id_presentacion": 400004}  # Albendazol -> Caja x 20 tabletas
        ]

        for data in prod_pres_data:
            if not db.query(ProductoPresentacion).filter_by(**data).first():
                db.add(ProductoPresentacion(**data))
        db.commit()
        print(f"   ✓ {len(prod_pres_data)} presentation assignments created")

        # 15. PRODUCTO-COMPONENTE
        print("15. Assigning components to products...")
        prod_comp_data = [
            {"id_producto": 4001, "id_componente": 4000001},  # Paracetamol 500 mg
            {"id_producto": 4002, "id_componente": 4000002},  # Amoxicilina 500 mg
            {"id_producto": 4003, "id_componente": 4000003},  # Ibuprofeno 400 mg
            {"id_producto": 4004, "id_componente": 4000004},  # Loratadina 10 mg
            {"id_producto": 4005, "id_componente": 4000005},  # Vitamina C 1000 mg
            {"id_producto": 4006, "id_componente": 4000006},  # Omeprazol 20 mg
            {"id_producto": 4007, "id_componente": 4000007},  # Diclofenaco 50 mg
            {"id_producto": 4008, "id_componente": 4000008},  # Cetirizina 10 mg
            {"id_producto": 4009, "id_componente": 4000009},  # Atorvastatina 20 mg
            {"id_producto": 4010, "id_componente": 4000010},  # Metformina 850 mg
            {"id_producto": 4011, "id_componente": 4000011},  # Losartán 50 mg
            {"id_producto": 4012, "id_componente": 4000012},  # Dextrometorfano Jarabe
            {"id_producto": 4013, "id_componente": 4000013},  # Clotrimazol Crema
            {"id_producto": 4014, "id_componente": 4000014},  # Complejo B
            {"id_producto": 4015, "id_componente": 4000015},  # Bromhexina 8 mg
            {"id_producto": 4016, "id_componente": 4000016},  # Ranitidina 150 mg
            {"id_producto": 4017, "id_componente": 4000017},  # Ciprofloxacino 500 mg
            {"id_producto": 4018, "id_componente": 4000018},  # Salbutamol Inhalador
            {"id_producto": 4019, "id_componente": 4000019},  # Aspirina 100 mg
            {"id_producto": 4020, "id_componente": 4000020}  # Albendazol 400 mg
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
            {"id_ubicacion_estante": 50003, "estante": "A3", "nivel": "Nivel 1"},
            {"id_ubicacion_estante": 50004, "estante": "B1", "nivel": "Nivel 3"},
            {"id_ubicacion_estante": 50005, "estante": "B2", "nivel": "Nivel 1"},
            {"id_ubicacion_estante": 50006, "estante": "C1", "nivel": "Nivel 2"}
        ]
        for data in ubicaciones_data:
            if not db.query(UbicacionEstante).filter_by(id_ubicacion_estante=data["id_ubicacion_estante"]).first():
                db.add(UbicacionEstante(**data))
        db.commit()
        print(f"   ✓ {len(ubicaciones_data)} locations created")

        # 17. LOTES (with varied expiration dates and stock levels)
        print("17. Creating product batches...")
        from datetime import date
        lotes_data = [
            # Paracetamol - High stock, good expiration
            {
                "id_lote": 5001,
                "id_producto": 4001,
                "codigo_lote": "L-2025-01-PAR",
                "fecha_vencimiento": date(2026, 6, 15),
                "cantidad_recibida": 200,
                "costo_unitario_compra": Decimal("2.10")
            },
            # Amoxicilina - Low stock, near expiration (WARNING!)
            {
                "id_lote": 5002,
                "id_producto": 4002,
                "codigo_lote": "L-2024-11-AMO",
                "fecha_vencimiento": date(2025, 3, 30),
                "cantidad_recibida": 100,
                "costo_unitario_compra": Decimal("9.00")
            },
            # Ibuprofeno - Medium stock
            {
                "id_lote": 5003,
                "id_producto": 4003,
                "codigo_lote": "L-2025-02-IBU",
                "fecha_vencimiento": date(2026, 8, 10),
                "cantidad_recibida": 150,
                "costo_unitario_compra": Decimal("3.90")
            },
            # Loratadina - Low stock (needs reorder)
            {
                "id_lote": 5004,
                "id_producto": 4004,
                "codigo_lote": "L-2025-01-LOR",
                "fecha_vencimiento": date(2026, 12, 20),
                "cantidad_recibida": 80,
                "costo_unitario_compra": Decimal("4.50")
            },
            # Vitamina C - High stock
            {
                "id_lote": 5005,
                "id_producto": 4005,
                "codigo_lote": "L-2025-03-VIT",
                "fecha_vencimiento": date(2027, 1, 15),
                "cantidad_recibida": 300,
                "costo_unitario_compra": Decimal("10.00")
            },
            # Omeprazol - EXPIRED (for testing)
            {
                "id_lote": 5006,
                "id_producto": 4006,
                "codigo_lote": "L-2024-05-OME",
                "fecha_vencimiento": date(2024, 12, 31),
                "cantidad_recibida": 50,
                "costo_unitario_compra": Decimal("6.00")
            }
        ]
        for data in lotes_data:
            if not db.query(Lote).filter_by(id_lote=data["id_lote"]).first():
                db.add(Lote(**data))
        db.commit()
        print(f"   ✓ {len(lotes_data)} batches created")

        # 18. INVENTARIO (with varied stock levels for testing filters)
        print("18. Creating inventory records...")
        inventario_data = [
            # High stock
            {"id_inventario": 1, "id_lote": 5001, "id_ubicacion_estante": 50001, "stock_actual": 180},
            # Paracetamol - HIGH
            # Low stock - near expiration
            {"id_inventario": 2, "id_lote": 5002, "id_ubicacion_estante": 50002, "stock_actual": 15},
            # Amoxicilina - LOW + NEAR EXPIRATION
            # Medium stock
            {"id_inventario": 3, "id_lote": 5003, "id_ubicacion_estante": 50003, "stock_actual": 45},
            # Ibuprofeno - MEDIUM
            # Low stock
            {"id_inventario": 4, "id_lote": 5004, "id_ubicacion_estante": 50004, "stock_actual": 18},
            # Loratadina - LOW
            # High stock
            {"id_inventario": 5, "id_lote": 5005, "id_ubicacion_estante": 50005, "stock_actual": 250},
            # Vitamina C - HIGH
            # Expired product
            {"id_inventario": 6, "id_lote": 5006, "id_ubicacion_estante": 50006, "stock_actual": 35},
            # Omeprazol - EXPIRED
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
            if not db.query(DetallePedido).filter_by(id_pedido=data["id_pedido"],
                                                     id_producto=data["id_producto"]).first():
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
                "id_usuario": 1005,
                "fecha_venta": date(2025, 10, 30),
                "hora_venta": time(11, 20, 0),
                "monto_total": Decimal("65.00")
            },
            {
                "id_venta": 8003,
                "id_cliente": 10007,
                "id_usuario": 1005,
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
            {"id_venta": 8001, "id_producto": 4001, "cantidad": 2, "precio_unitario_venta": Decimal("3.50"),
             "subtotal": Decimal("7.00")},
            {"id_venta": 8001, "id_producto": 4003, "cantidad": 3, "precio_unitario_venta": Decimal("5.80"),
             "subtotal": Decimal("17.40")},
            {"id_venta": 8002, "id_producto": 4002, "cantidad": 3, "precio_unitario_venta": Decimal("12.00"),
             "subtotal": Decimal("36.00")},
            {"id_venta": 8002, "id_producto": 4004, "cantidad": 2, "precio_unitario_venta": Decimal("6.00"),
             "subtotal": Decimal("12.00")},
            {"id_venta": 8003, "id_producto": 4003, "cantidad": 2, "precio_unitario_venta": Decimal("5.80"),
             "subtotal": Decimal("11.60")}
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
            {"id_pago": 80001, "id_venta": 8001, "id_metodo_pago": 800001, "fecha_hora": datetime(2025, 10, 30, 9, 45),
             "monto": Decimal("28.50")},
            {"id_pago": 80002, "id_venta": 8002, "id_metodo_pago": 800002, "fecha_hora": datetime(2025, 10, 30, 11, 20),
             "monto": Decimal("65.00")},
            {"id_pago": 80003, "id_venta": 8003, "id_metodo_pago": 800002, "fecha_hora": datetime(2025, 10, 31, 18, 10),
             "monto": Decimal("15.70")}
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
            {"id_comprobante": 90002, "id_venta": 8002, "tipo_comprobante": "Factura",
             "nro_comprobante": "F001-001235"},
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
        print()
        print("📊 INVENTORY SUMMARY:")
        print("   • Paracetamol: 180 units (HIGH) - Good expiration")
        print("   • Amoxicilina: 15 units (LOW) - ⚠️  Near expiration!")
        print("   • Ibuprofeno: 45 units (MEDIUM)")
        print("   • Loratadina: 18 units (LOW)")
        print("   • Vitamina C: 250 units (HIGH)")
        print("   • Omeprazol: 35 units - ❌ EXPIRED!")
        print()

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
            "Lotes": db.query(Lote).count(),
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
