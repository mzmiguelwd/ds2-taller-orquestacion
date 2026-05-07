import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Table, Card } from "react-bootstrap";

export const Products = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productUnitMeasurement, setProductUnitMeasurement] = useState("");
  const [productCategory, setProductCategory] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);

  const fetchCategories = () => {
    fetch("http://localhost:4000/categories/")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  const fetchProducts = () => {
    fetch("http://localhost:4000/products/")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  };

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const resetProductForm = () => {
    setProductName("");
    setProductDescription("");
    setProductQuantity("");
    setProductUnitMeasurement("");
    setProductCategory("");
    setEditingProductId(null);
  };

  const handleProductSubmit = (event) => {
    event.preventDefault();

    const productPayload = {
      name: productName,
      description: productDescription,
      quantity: parseInt(productQuantity),
      unit_measurement: productUnitMeasurement,
      category: parseInt(productCategory),
    };

    const method = editingProductId ? "PUT" : "POST";
    const url = editingProductId
      ? `http://localhost:4000/products/${editingProductId}/`
      : "http://localhost:4000/products/";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(productPayload),
    })
      .then((response) => response.json())
      .then(() => {
        fetchProducts();
        resetProductForm();
      });
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setProductName(product.name);
    setProductDescription(product.description);
    setProductQuantity(product.quantity);
    setProductUnitMeasurement(product.unit_measurement);
    setProductCategory(product.category?.id || "");
  };

  const handleDeleteProduct = (productId) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      fetch(`http://localhost:4000/products/${productId}/`, {
        method: "DELETE",
      })
        .then(() => {
          fetchProducts();
          if (editingProductId === productId) resetProductForm();
        })
        .catch((error) => console.error("Error deleting product:", error));
    }
  };

  return (
    <Row className="custom-row">
      <Col md={4} className="form-column">
        <Card>
          <h4>{editingProductId ? "Editar Producto" : "Nuevo Producto"}</h4>
          <Form onSubmit={handleProductSubmit}>
            <Form.Group className="form-group" controlId="formProdName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={productName}
                onChange={(event) => setProductName(event.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="form-group" controlId="formProdDesc">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                type="text"
                maxLength={140}
                value={productDescription}
                onChange={(event) => setProductDescription(event.target.value)}
                required
              />
            </Form.Group>

            <Row>
              <Col>
                <Form.Group className="form-group" controlId="formProdQuantity">
                  <Form.Label>Cantidad</Form.Label>
                  <Form.Control
                    type="number"
                    value={productQuantity}
                    onChange={(event) => setProductQuantity(event.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group className="form-group" controlId="formProdUnit">
                  <Form.Label>Unidad</Form.Label>
                  <Form.Select
                    value={productUnitMeasurement}
                    onChange={(event) =>
                      setProductUnitMeasurement(event.target.value)
                    }
                    required
                  >
                    <option value="">Elegir...</option>
                    <option value="Units">Unidades</option>
                    <option value="Liters">Litros</option>
                    <option value="Grams">Gramos</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="form-group" controlId="formProdCategory">
              <Form.Label>Categoría</Form.Label>
              <Form.Select
                value={productCategory}
                onChange={(event) => setProductCategory(event.target.value)}
                required
              >
                <option value="">Seleccione una categoría...</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                type="submit"
                className="btn-custom flex-grow-1"
              >
                {editingProductId ? "Actualizar" : "Agregar"}
              </Button>
              {editingProductId && (
                <Button
                  variant="secondary"
                  className="btn-custom"
                  style={{ backgroundColor: "#64748b" }}
                  onClick={resetProductForm}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </Form>
        </Card>
      </Col>

      <Col md={8}>
        <Card>
          <h4>Lista de Productos</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Desc.</th>
                <th>Cant.</th>
                <th>Unidad</th>
                <th>Categoría</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>{product.name}</td>
                    <td>{product.description}</td>
                    <td>{product.quantity}</td>
                    <td>{product.unit_measurement}</td>
                    <td>{product.category?.name || "Sin categoría"}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteProduct(product.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="empty-table-msg">
                    No hay productos registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card>
      </Col>
    </Row>
  );
};