import { useEffect, useState } from "react";
import api from "../services/api";
import styled from "styled-components";
import { toast } from "react-hot-toast";
import { Pencil, Trash2 } from "lucide-react";
import Modal from "./Modal";

/* Component */
export default function AddProduct({ editProduct }) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [cats, setCats] = useState([]);
  const [selected, setSelected] = useState([]);
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [newCat, setNewCat] = useState("");
  const [catMsg, setCatMsg] = useState("");
  const [catBusyId, setCatBusyId] = useState(null);
  const [confirmDeleteCat, setConfirmDeleteCat] = useState(null);
  const [editingCat, setEditingCat] = useState(null);

  useEffect(() => {
    api
      .get("/categories")
      .then((res) => setCats(res.data))
      .catch(() => setCats([]));
  }, []);

  useEffect(() => {
    if (editProduct) {
      setName(editProduct.name || "");
      setPrice(editProduct.price?.toString() || "");
      setSelected(editProduct.categories || []);
    }
  }, [editProduct]);

  const addCategory = async (e) => {
    e.preventDefault();
    const trimmed = newCat.trim();
    if (!trimmed) {
      toast.error("Please enter a category name");
      return;
    }

    // case-insensitive, trimmed duplicate check
    const exists = cats.some((c) => {
      const same =
        (c.name || "").trim().toLowerCase() === trimmed.toLowerCase();
      return editingCat ? c._id !== editingCat._id && same : same;
    });
    if (exists) {
      toast.error("Category already exists");
      return;
    }

    try {
      if (editingCat) {
        setCatBusyId(editingCat._id);
        const res = await api.put(`/categories/${editingCat._id}`, {
          name: trimmed,
        });
        toast.success("Category updated");
        setEditingCat(null);
      } else {
        const res = await api.post("/categories", { name: trimmed });
        toast.success("Category added: " + res.data.name);
      }
      setNewCat("");
      const catsRes = await api.get("/categories");
      setCats(catsRes.data);
    } catch (err) {
      toast.error(
        err.response?.data?.error ||
          (editingCat
            ? "❌ Error updating category"
            : "❌ Error adding category")
      );
    } finally {
      setCatBusyId(null);
    }
  };

  const editCategory = (cat) => {
    setEditingCat(cat);
    setNewCat(cat.name || "");
  };

  const toggle = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const deleteCategory = async (cat) => {
    try {
      setCatBusyId(cat._id);
      await api.delete(`/categories/${cat._id}`);
      toast.success("Category deleted");
      setSelected((prev) => prev.filter((id) => id !== cat._id));
      const catsRes = await api.get("/categories");
      setCats(catsRes.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Error deleting category");
    } finally {
      setCatBusyId(null);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    // Frontend validations with toasts
    if (!name.trim()) {
      toast.error("Please enter product name");
      return;
    }
    const priceNum = Number(price);
    if (price === "" || Number.isNaN(priceNum)) {
      toast.error("Please enter a valid price");
      return;
    }
    if (priceNum <= 0) {
      toast.error("Price must be greater than 0");
      return;
    }
    if (priceNum > 1000000000) {
      toast.error("Maximum price is 1 billion");
      return;
    }

    try {
      let res;
      if (editProduct) {
        // 🔹 Edit case
        res = await api.put(`/products/${editProduct._id}`, {
          name,
          price: priceNum,
          categories: selected,
        });
        toast.success("Product updated: " + res.data.name);
      } else {
        // 🔹 Create case
        res = await api.post("/products", {
          name,
          price: priceNum,
          categories: selected,
        });
        toast.success("Product created: " + res.data.name);
      }

      // Reset form
      setName("");
      setPrice("");
      setSelected([]);
    } catch (err) {
      toast.error(err.response?.data?.error || "❌ Error");
    }
  };

  return (
    <Form onSubmit={submit}>
      <FieldRow>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value.trimStart())}
          maxLength={50}
          placeholder="Product name"
          required
        />
        <Input
          value={price}
          onChange={(e) => {
            const val = Number(e.target.value);
            if (val < 0) {
              toast.error("Price cannot be negative");
              return;
            }
            if (val <= 1000000000) {
              setPrice(e.target.value);
            } else {
              toast.error("Maximum price is 1 billion");
            }
          }}
          placeholder="Price"
          type="number"
          min="0"
          step="0.01"
          required
        />
      </FieldRow>

      <CheckboxGroup>
        <p style={{ fontWeight: 600, margin: "4px 0" }}>Select Categories:</p>
        {cats.map((c) => (
          <CategoryItem key={c._id}>
            <Label
              htmlFor={`cat-${c._id}`}
              style={{ flex: 1, textTransform: "capitalize" }}
            >
              <input
                id={`cat-${c._id}`}
                type="checkbox"
                checked={selected.includes(c._id)}
                onChange={() => toggle(c._id)}
              />
              {c.name}
            </Label>
            <CatActions>
              <ActionBtn
                type="button"
                onClick={() => editCategory(c)}
                disabled={catBusyId === c._id}
                aria-label={`Edit ${c.name}`}
              >
                <Pencil size={18} />
              </ActionBtn>
              <ActionBtn
                type="button"
                $variant="danger"
                onClick={() => setConfirmDeleteCat(c)}
                disabled={catBusyId === c._id}
                aria-label={`Delete ${c.name}`}
              >
                <Trash2 size={18} />
              </ActionBtn>
            </CatActions>
          </CategoryItem>
        ))}
        <CategoryRow>
          <Input
            value={newCat}
            onChange={(e) => setNewCat(e.target.value)}
            placeholder={editingCat ? "Edit category name" : "Add new category"}
          />
          <Button
            type="button"
            onClick={addCategory}
            disabled={editingCat ? catBusyId === editingCat._id : false}
          >
            {editingCat ? "Save" : "Add"}
          </Button>
          {editingCat && (
            <CancelButton
              type="button"
              onClick={() => {
                setEditingCat(null);
                setNewCat("");
              }}
              disabled={catBusyId === editingCat?._id}
            >
              Cancel
            </CancelButton>
          )}
        </CategoryRow>
        {catMsg && <Message style={{ marginTop: "4px" }}>{catMsg}</Message>}
      </CheckboxGroup>

      <Button type="submit">
        {!editProduct ? "Create Product" : "Update Product"}
      </Button>
      {msg && <Message error={isError}>{msg}</Message>}

      {/* Confirm Delete Modal */}
      <Modal
        isOpen={!!confirmDeleteCat}
        onClose={() => setConfirmDeleteCat(null)}
        title="Confirm Delete"
      >
        <p>
          Are you sure you want to delete category{" "}
          <strong>{confirmDeleteCat?.name}</strong>?
        </p>
        <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
          <button
            style={{
              background: "#ef4444",
              color: "#fff",
              padding: "8px 12px",
              borderRadius: 6,
            }}
            onClick={async () => {
              if (!confirmDeleteCat) return;
              await deleteCategory(confirmDeleteCat);
              setConfirmDeleteCat(null);
            }}
            disabled={
              !!(confirmDeleteCat && catBusyId === confirmDeleteCat._id)
            }
          >
            Yes, Delete
          </button>
          <button
            style={{
              background: "#e2e8f0",
              padding: "8px 12px",
              borderRadius: 6,
            }}
            onClick={() => setConfirmDeleteCat(null)}
            disabled={
              !!(confirmDeleteCat && catBusyId === confirmDeleteCat._id)
            }
          >
            Cancel
          </button>
        </div>
      </Modal>
    </Form>
  );
}

/* Styled components */
const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #f8fafc;
  padding: 24px 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(15, 23, 42, 0.04);
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr; /* name and price side-by-side on desktop */
  }
`;

const Input = styled.input`
  padding: 12px 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 15px;
  background: #fff;
  outline: none;
  transition: border 0.2s, box-shadow 0.2s;
  width: 100%;
  min-height: 44px;
  box-sizing: border-box;
  &:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.13);
  }
`;

const CheckboxGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 16px;
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  border-radius: 10px;

  /* make list scrollable when it grows, with slim Tailwind-like scrollbar */
  // max-height: 300px; /* roughly max-h-72 */
  overflow-y: auto;
  overscroll-behavior: contain;

  /* Firefox */
  scrollbar-width: thin; /* similar to Tailwind slim */
  scrollbar-color: #94a3b8 transparent; /* slate-400 on transparent track */

  /* WebKit */
  &::-webkit-scrollbar {
    width: 8px; /* slim */
  }
  &::-webkit-scrollbar-track {
    background: transparent; /* clean track */
  }
  &::-webkit-scrollbar-thumb {
    background-color: #cbd5e1; /* slate-300 */
    border-radius: 9999px; /* full rounded */
    border: 2px solid transparent; /* create inner padding */
    background-clip: content-box;
  }
  &:hover::-webkit-scrollbar-thumb {
    background-color: #94a3b8; /* slate-400 on hover */
  }
`;

const CategoryItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 6px 8px;
  border-radius: 8px;
  transition: background 0.2s ease;
  &:hover {
    background: #f8fafc;
  }
`;

const CatActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ActionBtn = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  height: 32px;
  min-width: 32px;
  padding: 0 10px;
  border-radius: 6px; /* ~ rounded-md */
  border: 1px solid ${(p) => (p.$variant === "danger" ? "#fecaca" : "#e2e8f0")}; /* rose-200 | slate-200 */
  background: ${(p) =>
    p.$variant === "danger" ? "#fff1f2" : "#ffffff"}; /* rose-50 | white */
  color: ${(p) =>
    p.$variant === "danger" ? "#b91c1c" : "#334155"}; /* rose-700 | slate-700 */
  cursor: pointer;
  user-select: none;
  transition: background-color 0.15s ease, border-color 0.15s ease,
    box-shadow 0.15s ease, transform 0.05s ease;

  &:hover {
    background: ${(p) =>
      p.$variant === "danger"
        ? "#ffe4e6"
        : "#f8fafc"}; /* rose-100 | slate-50 */
    border-color: ${(p) =>
      p.$variant === "danger"
        ? "#fca5a5"
        : "#cbd5e1"}; /* rose-300 | slate-300 */
  }
  &:active {
    transform: translateY(1px);
  }
  &:focus-visible {
    outline: 2px solid
      ${(p) => (p.$variant === "danger" ? "#fecaca" : "#c7d2fe")}; /* rose-200 | indigo-200 */
    outline-offset: 2px; /* ring offset */
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  svg {
    width: 18px;
    height: 18px;
  }
`;

const CategoryRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
  margin-top: 4px;
  @media (min-width: 768px) {
    grid-template-columns: 1fr auto auto; /* input, primary button, cancel */
    align-items: stretch;
  }
`;

const CancelButton = styled.button`
  align-self: flex-start;
  background: #e2e8f0; /* slate-200 */
  color: #0f172a; /* slate-900 */
  font-weight: 600;
  padding: 12px 18px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  min-height: 44px;
  transition: background 0.15s, box-shadow 0.15s;
  &:hover {
    background: #cbd5e1; /* slate-300 */
  }
  &:active {
    transform: translateY(1px);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  cursor: pointer;
  font-weight: 500;
`;

const Button = styled.button`
  align-self: flex-start;
  background: linear-gradient(90deg, #6366f1, #4f46e5);
  color: #fff;
  font-weight: 600;
  padding: 12px 22px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  box-shadow: 0 1px 3px rgba(99, 102, 241, 0.08);
  transition: background 0.15s, box-shadow 0.15s;
  min-height: 44px; /* match input height */
  &:hover {
    background: linear-gradient(90deg, #4f46e5, #6366f1);
    box-shadow: 0 2px 8px rgba(99, 102, 241, 0.12);
  }
  &:active {
    transform: translateY(1px);
  }
`;

const Message = styled.p`
  margin-top: 10px;
  font-size: 15px;
  font-weight: 500;
  color: ${(props) => (props.error ? "#ef4444" : "#16a34a")};
  background: ${(props) => (props.error ? "#fee2e2" : "#dcfce7")};
  padding: 8px 12px;
  border-radius: 8px;
`;
