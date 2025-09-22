import ProductsPage from "./pages/ProductsPage";
import styled from "styled-components";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <Container>
      <Title>Shopping 🛍️</Title>
      <Section>
        <ProductsPage />
      </Section>

      <Toaster position="top-right" />
    </Container>
  );
}

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  width: 100%;
  padding: 24px 16px;

  @media (min-width: 600px) {
    padding: 32px 32px;
  }

  @media (min-width: 900px) {
    padding: 48px;
  }
`;

const Title = styled.h1`
  margin-bottom: 20px;
  text-align: center;
  font-size: 2rem;
  line-height: 1.1;
  word-break: break-word;
  @media (max-width: 600px) {
    font-size: 1.8rem;
    margin-bottom: 2.5rem;
  }
  @media (min-width: 900px) {
    font-size: 2.5rem;
    margin-bottom: 32px;
  }
`;

const Section = styled.div`
  margin: 0px auto;
  max-width: 900px;
`;
