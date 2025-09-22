import React from "react";
import styled from "styled-components";
import { TableWrapper } from "../styles/layout";

/* Component */
export default function ProductsTable({
  products = [],
  onEdit = () => {},
  onDelete = () => {},
}) {
  if (!products || products.length === 0) {
    return (
      <TableWrapper>
        <EmptyWrapper>
          <Empty>No products yet. Add some products to see them here.</Empty>
          <EmptyImage src="/empty.webp" alt="no data" />
        </EmptyWrapper>
      </TableWrapper>
    );
  }

  return (
    <TableWrapper>
      <Table>
        <Thead>
          <tr>
            <Th>Name</Th>
            <Th>Price</Th>
            <Th>Categories</Th>
            <Th style={{ width: 160, textAlign: "center" }}>Action</Th>
          </tr>
        </Thead>

        <Tbody>
          {products.map((p) => (
            <Tr key={p._id}>
              <Td>
                <NameCell>{p.name}</NameCell>
                <div style={{ fontSize: 12, color: "#475569" }}>
                  ID: {p._id.slice(-6)}
                </div>
              </Td>

              <Td>
                <Price>₹{Number(p.price).toLocaleString("en-IN")}</Price>
              </Td>

              <Td>
                <CategoriesWrap>
                  {p.categories && p.categories.length ? (
                    p.categories.map((c) => (
                      <CatBadge key={c._id || c.name}>{c.name}</CatBadge>
                    ))
                  ) : (
                    <span style={{ color: "#64748b", fontSize: 13 }}>
                      — none —
                    </span>
                  )}
                </CategoriesWrap>
              </Td>

              <Td style={{ textAlign: "center" }}>
                <ActionGroup>
                  <EditButton
                    onClick={() => onEdit(p._id)}
                    aria-label={`Edit ${p.name}`}
                  >
                    Edit
                  </EditButton>

                  <DeleteButton
                    onClick={() => onDelete(p._id)}
                    aria-label={`Delete ${p.name}`}
                  >
                    Delete
                  </DeleteButton>
                </ActionGroup>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </TableWrapper>
  );
}

/* Styled components */

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 720px; /* makes table scroll horizontally on very small screens */
`;

const Thead = styled.thead`
  background: linear-gradient(90deg, #f8fafc, #f1f5f9);
`;

const Th = styled.th`
  text-align: left;
  font-size: 14px;
  padding: 12px 16px;
  color: #0f172a;
  font-weight: 600;
  border-bottom: 1px solid rgba(15, 23, 42, 0.06);
`;

const Tbody = styled.tbody``;

const Tr = styled.tr`
  &:hover {
    background: rgba(15, 23, 42, 0.02);
  }
`;

const Td = styled.td`
  padding: 12px 16px;
  font-size: 14px;
  color: #0b1220;
  vertical-align: middle;
  border-bottom: 1px solid rgba(15, 23, 42, 0.04);
`;

/* small styling helpers */
const NameCell = styled.div`
  font-weight: 600;
  margin-bottom: 4px;
`;

const Price = styled.span`
  font-weight: 700;
`;

const CategoriesWrap = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const CatBadge = styled.span`
  background: rgba(99, 102, 241, 0.08);
  color: #4f46e5;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
`;

/* action buttons */
const ActionGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ActionButton = styled.button`
  border: none;
  padding: 8px 10px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 13px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.08s ease, box-shadow 0.08s ease;
  &:active {
    transform: translateY(1px);
  }
`;

const EditButton = styled(ActionButton)`
  background: rgba(16, 185, 129, 0.1);
  color: #059669;
`;

const DeleteButton = styled(ActionButton)`
  background: rgba(239, 68, 68, 0.08);
  color: #ef4444;
`;

/* Empty / placeholder */
const Empty = styled.div`
  padding: 28px;
  text-align: center;
  color: #64748b;
`;

const EmptyImage = styled.img`
  width: 300px;
  height: auto;
`;

const EmptyWrapper = styled.div`
  display: grid;
  place-items: center;
`;
