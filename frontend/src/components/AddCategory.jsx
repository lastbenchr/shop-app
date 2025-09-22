import React, { useState } from "react";
import api from "../services/api";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/categories", { name });
      setMsg("Category created: " + res.data.name);
      setName("");
    } catch (err) {
      setMsg(err.response?.data?.error || "Error creating");
    }
  };

  return (
    <div>
      <h3>Add Category</h3>
      <form onSubmit={submit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Category name"
        />
        <button type="submit">Create</button>
      </form>
      {msg && <p>{msg}</p>}
    </div>
  );
}
