#!/usr/bin/env python3
"""
Comprehensive API test script
Tests all main endpoints to ensure they're working correctly
"""

import requests
import json
from datetime import datetime
from decimal import Decimal


BASE_URL = "http://localhost:8000"
VERBOSE = False  # Set to True to see response data


class Colors:
    GREEN = '\033[92m'
    RED = '\033[91m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    END = '\033[0m'


def print_section(title):
    """Print section header"""
    print(f"\n{Colors.BLUE}{'=' * 70}{Colors.END}")
    print(f"{Colors.BLUE}{title:^70}{Colors.END}")
    print(f"{Colors.BLUE}{'=' * 70}{Colors.END}\n")


def test_endpoint(method, endpoint, data=None, expected_status=200, description=""):
    """Test an API endpoint"""
    url = f"{BASE_URL}{endpoint}"
    
    try:
        if method == "GET":
            response = requests.get(url, timeout=5)
        elif method == "POST":
            response = requests.post(url, json=data, timeout=5)
        elif method == "PUT":
            response = requests.put(url, json=data, timeout=5)
        elif method == "PATCH":
            response = requests.patch(url, json=data, timeout=5)
        elif method == "DELETE":
            response = requests.delete(url, timeout=5)
        
        success = response.status_code == expected_status
        status_icon = f"{Colors.GREEN}✓{Colors.END}" if success else f"{Colors.RED}✗{Colors.END}"
        
        desc_str = f" - {description}" if description else ""
        print(f"{status_icon} {method:6s} {endpoint:45s} [{response.status_code}]{desc_str}")
        
        if VERBOSE and success and response.status_code == 200:
            try:
                data = response.json()
                if isinstance(data, list):
                    print(f"     → Returned {len(data)} items")
                elif isinstance(data, dict):
                    print(f"     → {json.dumps(data, indent=2, default=str)[:100]}...")
            except:
                pass
        
        if not success:
            print(f"     {Colors.RED}Expected: {expected_status}, Got: {response.status_code}{Colors.END}")
            try:
                error = response.json()
                print(f"     {Colors.RED}Error: {error.get('detail', 'Unknown')}{Colors.END}")
            except:
                print(f"     {Colors.RED}Response: {response.text[:200]}{Colors.END}")
        
        return response, success
    
    except requests.exceptions.ConnectionError:
        print(f"{Colors.RED}✗{Colors.END} {method:6s} {endpoint:45s} [CONNECTION ERROR]")
        print(f"     {Colors.RED}Cannot connect to {BASE_URL}{Colors.END}")
        return None, False
    except Exception as e:
        print(f"{Colors.RED}✗{Colors.END} {method:6s} {endpoint:45s} [ERROR: {e}]")
        return None, False


def run_tests():
    """Run all API tests"""
    results = {"passed": 0, "failed": 0}
    
    print(f"\n{Colors.BLUE}{'╔' + '=' * 68 + '╗'}{Colors.END}")
    print(f"{Colors.BLUE}║{' ' * 15}YANIFARMA API - COMPREHENSIVE TESTS{' ' * 18}║{Colors.END}")
    print(f"{Colors.BLUE}{'╚' + '=' * 68 + '╝'}{Colors.END}")
    print(f"\nTesting API at: {Colors.YELLOW}{BASE_URL}{Colors.END}\n")
    
    # Test connection
    print_section("0. CONNECTION TEST")
    resp, success = test_endpoint("GET", "/", description="API root")
    if not success:
        print(f"\n{Colors.RED}❌ Cannot connect to API!{Colors.END}")
        print(f"{Colors.YELLOW}Make sure the server is running:{Colors.END}")
        print(f"  • uvicorn app.app:app --reload")
        print(f"  • OR docker-compose up")
        return
    results["passed" if success else "failed"] += 1
    
    # Test lookup tables
    print_section("1. LOOKUP TABLES (GET)")
    endpoints = [
        ("/api/roles/", "Roles"),
        ("/api/categorias/", "Categories"),
        ("/api/presentaciones/", "Presentations"),
        ("/api/componentes/", "Components"),
        ("/api/cargos/", "Job positions"),
        ("/api/estados-pedido/", "Order statuses"),
        ("/api/motivos-pedido/", "Order reasons"),
        ("/api/metodos-pago/", "Payment methods"),
        ("/api/ubicaciones/", "Shelf locations"),
    ]
    
    for endpoint, desc in endpoints:
        _, success = test_endpoint("GET", endpoint, description=desc)
        results["passed" if success else "failed"] += 1
    
    # Test main entities - LIST
    print_section("2. MAIN ENTITIES - LIST (GET)")
    endpoints = [
        ("/api/usuarios/", "Users"),
        ("/api/clientes/", "Customers"),
        ("/api/proveedores/", "Suppliers"),
        ("/api/productos/", "Products"),
        ("/api/inventario/", "Inventory"),
        ("/api/lotes/", "Batches"),
        ("/api/pedidos/", "Orders"),
        ("/api/compras/", "Purchases"),
        ("/api/ventas/", "Sales"),
    ]
    
    for endpoint, desc in endpoints:
        _, success = test_endpoint("GET", endpoint, description=desc)
        results["passed" if success else "failed"] += 1
    
    # Test specific records - GET BY ID
    print_section("3. SPECIFIC RECORDS (GET BY ID)")
    endpoints = [
        ("/api/usuarios/1005", "User #1005"),
        ("/api/clientes/10009", "Customer #10009"),
        ("/api/proveedores/2001", "Supplier #2001"),
        ("/api/productos/4001", "Product #4001"),
        ("/api/inventario/1", "Inventory #1"),
        ("/api/pedidos/6001", "Order #6001"),
        ("/api/ventas/8001", "Sale #8001"),
    ]
    
    for endpoint, desc in endpoints:
        _, success = test_endpoint("GET", endpoint, description=desc)
        results["passed" if success else "failed"] += 1
    
    # Test search functionality
    print_section("4. SEARCH FUNCTIONALITY")
    _, success = test_endpoint("GET", "/api/productos/search/?q=Paracetamol", 
                               description="Search products")
    results["passed" if success else "failed"] += 1
    
    # Test supplier contacts
    _, success = test_endpoint("GET", "/api/proveedores/2001/contactos/", 
                               description="Supplier contacts")
    results["passed" if success else "failed"] += 1
    
    # Test inventory by product
    _, success = test_endpoint("GET", "/api/inventario/producto/4001", 
                               description="Inventory by product")
    results["passed" if success else "failed"] += 1
    
    # Test CREATE operations
    print_section("5. CREATE OPERATIONS (POST)")
    
    # Create role
    new_role = {"nombre_rol": f"test_role_{datetime.now().timestamp()}"}
    _, success = test_endpoint("POST", "/api/roles/", new_role, 201, "Create role")
    results["passed" if success else "failed"] += 1
    
    # Create categoria
    new_cat = {"nombre_categoria": f"Test Cat {datetime.now().timestamp()}"}
    _, success = test_endpoint("POST", "/api/categorias/", new_cat, 201, "Create category")
    results["passed" if success else "failed"] += 1
    
    # Create cargo
    new_cargo = {"descripcion": f"Test Position {datetime.now().timestamp()}"}
    _, success = test_endpoint("POST", "/api/cargos/", new_cargo, 201, "Create job position")
    results["passed" if success else "failed"] += 1
    
    # Create presentacion
    new_pres = {"desc_presentacion": f"Test Pres {datetime.now().timestamp()}"}
    _, success = test_endpoint("POST", "/api/presentaciones/", new_pres, 201, "Create presentation")
    results["passed" if success else "failed"] += 1
    
    # Create componente
    new_comp = {"nombre_componente": f"Test Comp {datetime.now().timestamp()}"}
    _, success = test_endpoint("POST", "/api/componentes/", new_comp, 201, "Create component")
    results["passed" if success else "failed"] += 1
    
    # Create ubicacion
    ts = str(int(datetime.now().timestamp()))[-4:]
    new_ubic = {"estante": f"Z{ts}", "nivel": "Test"}
    _, success = test_endpoint("POST", "/api/ubicaciones/", new_ubic, 201, "Create location")
    results["passed" if success else "failed"] += 1
    
    # Create estado pedido
    new_estado = {"descripcion": f"Test Status {datetime.now().timestamp()}"}
    _, success = test_endpoint("POST", "/api/estados-pedido/", new_estado, 201, "Create order status")
    results["passed" if success else "failed"] += 1
    
    # Create motivo pedido
    new_motivo = {"descripcion": f"Test Reason {datetime.now().timestamp()}"}
    _, success = test_endpoint("POST", "/api/motivos-pedido/", new_motivo, 201, "Create order reason")
    results["passed" if success else "failed"] += 1
    
    # Create metodo pago
    new_metodo = {"descripcion": f"Test Payment {datetime.now().timestamp()}"}
    _, success = test_endpoint("POST", "/api/metodos-pago/", new_metodo, 201, "Create payment method")
    results["passed" if success else "failed"] += 1
    
    # Create cliente
    ts = str(int(datetime.now().timestamp()))[-8:]
    new_cliente = {
        "nro_doc": ts,
        "tipo_doc": "DNI",
        "nombres": "Test",
        "apellido_paterno": "Cliente",
        "telefonos": ["999888777"]
    }
    resp, success = test_endpoint("POST", "/api/clientes/", new_cliente, 201, "Create customer")
    results["passed" if success else "failed"] += 1
    
    # Test complex operations
    print_section("6. COMPLEX OPERATIONS")
    
    # Create a product with relationships
    ts = str(int(datetime.now().timestamp()))[-6:]
    new_producto = {
        "codigo_interno": f"P-TEST-{ts}",
        "nombre_comercial": f"Test Product {ts}",
        "precio_venta": 10.50,
        "afecta_igv": True,
        "requiere_receta": False,
        "categorias": [40001],  # Analgésico
        "presentaciones": [400001],  # Caja x 10 tabletas
        "componentes": [4000001]  # Paracetamol 500 mg
    }
    resp, success = test_endpoint("POST", "/api/productos/", new_producto, 201, 
                                 "Create product with relationships")
    results["passed" if success else "failed"] += 1
    
    # Print results
    print_section("RESULTS SUMMARY")
    
    total = results["passed"] + results["failed"]
    passed_pct = (results["passed"] / total * 100) if total > 0 else 0
    
    print(f"Total tests:  {total}")
    print(f"{Colors.GREEN}Passed:       {results['passed']} ({passed_pct:.1f}%){Colors.END}")
    
    if results["failed"] > 0:
        print(f"{Colors.RED}Failed:       {results['failed']}{Colors.END}")
    else:
        print(f"{Colors.GREEN}Failed:       0{Colors.END}")
    
    print()
    
    if results["failed"] == 0:
        print(f"{Colors.GREEN}{'=' * 70}{Colors.END}")
        print(f"{Colors.GREEN}✅ ALL TESTS PASSED! Your API is working perfectly!{Colors.END}")
        print(f"{Colors.GREEN}{'=' * 70}{Colors.END}")
    else:
        print(f"{Colors.YELLOW}{'=' * 70}{Colors.END}")
        print(f"{Colors.YELLOW}⚠️  Some tests failed. Check the errors above.{Colors.END}")
        print(f"{Colors.YELLOW}{'=' * 70}{Colors.END}")
    
    print()
    print("Next steps:")
    print(f"  • View API docs: {Colors.BLUE}http://localhost:8000/docs{Colors.END}")
    print(f"  • Test manually: {Colors.BLUE}curl http://localhost:8000/api/usuarios/{Colors.END}")
    print(f"  • View backend logs: {Colors.BLUE}docker logs backend -f{Colors.END}")
    print()


if __name__ == "__main__":
    try:
        run_tests()
    except KeyboardInterrupt:
        print(f"\n\n{Colors.YELLOW}Tests interrupted by user{Colors.END}\n")
    except Exception as e:
        print(f"\n{Colors.RED}Error running tests: {e}{Colors.END}\n")
        import traceback
        traceback.print_exc()
