import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BomTree from "../components/BomTree";
import {
  createBomItem,
  deleteBomItem,
  fetchBomItemsByBom,
  fetchComponents,
} from "../services/api";
import { buildBomTree } from "../utils/bomTree";

function BomEditorPage() {
  const { bomId } = useParams();
  const [items, setItems] = useState([]);
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    Comp_ID: "",
    parent_BOM_ItemID: "",
    Quantity_Required: 1,
    Status: "Pending",
  });

  const treeData = useMemo(() => buildBomTree(items), [items]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [itemData, componentData] = await Promise.all([
        fetchBomItemsByBom(bomId),
        fetchComponents(),
      ]);
      setItems(itemData);
      setComponents(componentData);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load BOM editor data");
    } finally {
      setLoading(false);
    }
  }, [bomId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createBomItem({
        BOM_ID: Number(bomId),
        Comp_ID: Number(form.Comp_ID),
        parent_BOM_ItemID: form.parent_BOM_ItemID
          ? Number(form.parent_BOM_ItemID)
          : null,
        Quantity_Required: Number(form.Quantity_Required),
        Status: form.Status,
      });
      setForm({
        Comp_ID: "",
        parent_BOM_ItemID: "",
        Quantity_Required: 1,
        Status: "Pending",
      });
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to add BOM item");
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await deleteBomItem(itemId);
      await loadData();
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to remove BOM item");
    }
  };

  return (
    <section className="space-y-6">
      <h1 className="text-2xl font-semibold text-cyan-300">
        BOM Editor (BOM #{bomId})
      </h1>
      {error && <p className="text-rose-400">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="grid gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 md:grid-cols-4"
      >
        <select
          required
          value={form.Comp_ID}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, Comp_ID: e.target.value }))
          }
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        >
          <option value="">Select Component</option>
          {components.map((c) => (
            <option key={c.Comp_ID} value={c.Comp_ID}>
              {c.MPN}
            </option>
          ))}
        </select>

        <select
          value={form.parent_BOM_ItemID}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, parent_BOM_ItemID: e.target.value }))
          }
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        >
          <option value="">No Parent (Root Item)</option>
          {items.map((item) => (
            <option key={item.BOM_ItemID} value={item.BOM_ItemID}>
              {item.MPN} (#{item.BOM_ItemID})
            </option>
          ))}
        </select>

        <input
          type="number"
          min="1"
          value={form.Quantity_Required}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, Quantity_Required: e.target.value }))
          }
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />

        <button className="rounded-md bg-cyan-600 px-4 py-2 font-medium hover:bg-cyan-500">
          Add Item
        </button>
      </form>

      {loading ? (
        <p>Loading BOM items...</p>
      ) : (
        <BomTree nodes={treeData} onDelete={handleDelete} />
      )}
    </section>
  );
}

export default BomEditorPage;
