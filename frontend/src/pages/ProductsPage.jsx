// ProductsPage.js
import React, { useEffect, useState } from "react";
import api from "../services/api";
import ProductsTable from "../components/ProductsTable";
import Modal from "../components/Modal";
import AddProduct from "../components/AddProduct";
import styled from "styled-components";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editProduct, setEditProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (editId) => {
    console.log("edit", editId);
    setShowAdd(true);
    const productToEdit = products.find((p) => p._id === editId);
    if (productToEdit) {
      setEditProduct(productToEdit);
    }
    // alert("Open edit form for: " + product.name);
  };

  const handleSuccess = () => {
    setShowAdd(false);
    fetchProducts();
    setEditProduct(null);
    setCurrentPage(1);
  };

  const handleDelete = async (productId) => {
    try {
      await api.delete(`/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
      setDeleteId(null); // close modal
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <HeaderRow>
        <ResponsiveHeading>Products</ResponsiveHeading>
        <Button38 onClick={() => setShowAdd(true)}>+ Add Product</Button38>
      </HeaderRow>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <ProductsTable
            products={products.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )}
            onEdit={handleEdit}
            onDelete={(id) => setDeleteId(id)}
          />
          <Pagination>
            <PageButton
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </PageButton>
            <PageInfo>
              Page {currentPage} of{" "}
              {Math.ceil(products.length / itemsPerPage) || 1}
            </PageInfo>
            <PageButton
              disabled={
                currentPage >= Math.ceil(products.length / itemsPerPage)
              }
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </PageButton>
          </Pagination>
        </>
      )}

      {/* Add Product Modal */}
      <Modal
        isOpen={showAdd}
        onClose={() => {
          setShowAdd(false);
          setEditProduct(null);
        }}
        title={!editProduct ? "Add Product" : "Edit Product"}
      >
        <AddProduct
          editProduct={editProduct}
          onSuccess={handleSuccess}
          products={products}
        />
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirm Delete"
      >
        <p>Are you sure you want to delete this product?</p>
        <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          <button
            style={{
              background: "#ef4444",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: "6px",
            }}
            onClick={() => handleDelete(deleteId)}
          >
            Yes, Delete
          </button>
          <button
            style={{
              background: "#e2e8f0",
              padding: "8px 12px",
              borderRadius: "6px",
            }}
            onClick={() => setDeleteId(null)}
          >
            Cancel
          </button>
        </div>
      </Modal>
    </div>
  );
}

const Button38 = styled.button`
  background-color: #ffffff;
  border: 0;
  border-radius: 0.5rem;
  box-sizing: border-box;
  color: #111827;
  font-family: "Inter var", ui-sans-serif, system-ui, -apple-system, system-ui,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
    "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  font-size: 0.875rem;
  font-weight: 600;
  line-height: 1.25rem;
  padding: 0.75rem 1rem;
  text-align: center;
  text-decoration: none #d1d5db solid;
  text-decoration-thickness: auto;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  cursor: pointer;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
  transition: background 0.2s, box-shadow 0.2s;
  position: relative;
  overflow: hidden;
  &:hover {
    background-color: rgb(249, 250, 251);
  }
  &:focus {
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  &:focus-visible {
    box-shadow: none;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 20px;
`;

const PageButton = styled.button`
  padding: 8px 12px;
  background: #6366f1;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  &:disabled {
    background: #e2e8f0;
    cursor: not-allowed;
  }
`;

const PageInfo = styled.span`
  font-size: 14px;
  color: #334155;
`;

const ResponsiveHeading = styled.h2`
  color: #3730a3; /* deep indigo, visually appealing */
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
  @media (max-width: 600px) {
    font-size: 1.4rem;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;
