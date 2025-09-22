import AddCategory from "./components/AddCategory";
import AddProduct from "./components/AddProduct";
import ProductsPage from "./pages/ProductsPage";
import styled from "styled-components";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Container>
      <Title>Shopping 🛍️</Title>
      <Grid>
        <Section>
          <ProductsPage />
        </Section>
      </Grid>

      <Toaster position="top-right" />
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  text-align: center;
`;

const Grid = styled.div`
  display: grid;
  place-items: center;
  grid-template-columns: 1fr;
  gap: 20px;
`;

const Section = styled.div``;
