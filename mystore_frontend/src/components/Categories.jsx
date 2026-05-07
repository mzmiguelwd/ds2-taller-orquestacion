import { useState, useEffect } from "react";
import { Form, Button, Row, Col, Table, Card } from "react-bootstrap";

export const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");
  const [categoryDescription, setCategoryDescription] = useState("");
  const [editingCategoryId, setEditingCategoryId] = useState(null);

  const fetchCategories = () => {
    fetch("http://localhost:4000/categories/")
      .then((response) => response.json())
      .then((data) => setCategories(data))
      .catch((error) => console.error("Error fetching categories:", error));
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const resetCategoryForm = () => {
    setCategoryName("");
    setCategoryDescription("");
    setEditingCategoryId(null);
  };

  const handleCategorySubmit = (event) => {
    event.preventDefault();

    const method = editingCategoryId ? "PUT" : "POST";
    const url = editingCategoryId
      ? `http://localhost:4000/categories/${editingCategoryId}/`
      : "http://localhost:4000/categories/";

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: categoryName,
        description: categoryDescription,
      }),
    })
      .then((response) => response.json())
      .then(() => {
        fetchCategories();
        resetCategoryForm();
      });
  };

  const handleEditCategory = (category) => {
    setEditingCategoryId(category.id);
    setCategoryName(category.name);
    setCategoryDescription(category.description);
  };

  const handleDeleteCategory = (categoryId) => {
    if (window.confirm("¿Estás seguro de eliminar esta categoría?")) {
      fetch(`http://localhost:4000/categories/${categoryId}/`, {
        method: "DELETE",
      })
        .then(() => {
          fetchCategories();
          if (editingCategoryId === categoryId) {
            resetCategoryForm();
          }
        })
        .catch((error) => console.error("Error deleting category:", error));
    }
  };

  return (
    <Row className="custom-row">
      <Col md={4} className="form-column">
        <Card>
          <h4>{editingCategoryId ? "Editar Categoría" : "Nueva Categoría"}</h4>
          <Form onSubmit={handleCategorySubmit}>
            <Form.Group className="form-group" controlId="formCatName">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="form-group" controlId="formCatDesc">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                maxLength={140}
                value={categoryDescription}
                onChange={(event) => setCategoryDescription(event.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button
                variant="primary"
                type="submit"
                className="btn-custom flex-grow-1"
              >
                {editingCategoryId ? "Actualizar" : "Agregar"}
              </Button>
              {editingCategoryId && (
                <Button
                  variant="secondary"
                  className="btn-custom"
                  style={{ backgroundColor: "#64748b" }}
                  onClick={resetCategoryForm}
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
          <h4>Lista de Categorías</h4>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((category) => (
                  <tr key={category.id}>
                    <td>{category.id}</td>
                    <td>{category.name}</td>
                    <td>{category.description}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditCategory(category)}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          Eliminar
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="empty-table-msg">
                    No hay categorías registradas.
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
