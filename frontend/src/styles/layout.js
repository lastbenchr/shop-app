import styled from "styled-components";

export const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto;
  padding: 16px;
  max-width: 900px; /* 👈 max-width fix */
  margin: 0 auto; /* 👈 center align */
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 6px 18px rgba(16, 24, 40, 0.06);
`;
