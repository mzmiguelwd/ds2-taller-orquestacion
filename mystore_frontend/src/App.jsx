import { Container, Tabs, Tab } from "react-bootstrap";
import { Categories } from "./components/Categories";
import { Products } from "./components/Products";
import "./App.css";

export const App = () => {
  return (
    <Container className="admin-panel">
      <h1>MyStore Admin Panel - Grupo 1</h1>

      <Tabs defaultActiveKey="categories" className="custom-tabs" unmountOnExit>
        <Tab eventKey="categories" title="Categorías">
          <Categories />
        </Tab>
        
        <Tab eventKey="products" title="Productos">
          <Products />
        </Tab>
      </Tabs>
    </Container>
  );
};
