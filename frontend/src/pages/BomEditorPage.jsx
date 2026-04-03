import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import BomTree from "../components/BomTree";
import {
  createBomItem,
  deleteBomItem,
  fetchBomItemsByBom,
  fetchComponents,
  fetchListingsByComponent,
} from "../services/api";
import { buildBomTree } from "../utils/bomTree";

function BomEditorPage() {
  const { bomId } = useParams();
  const [items, setItems] = useState([]);
  const [components, setComponents] = useState([]);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [listings, setListings] = useState([]);
  const [listingsLoading, setListingsLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    Comp_ID: "",
    parent_BOM_ItemID: "",
    Quantity_Required: 1,
    Status: "Pending",
  });

  const treeData = useMemo(() => buildBomTree(items), [items]);

  const preferredListing = useMemo(() => {
    if (!listings.length) return null;
    const inStock = listings.filter((listing) => Number(listing.Stock_Qty) > 0);
    const pool = inStock.length ? inStock : listings;
    return pool.reduce((best, current) =>
      Number(current.Price_INR) < Number(best.Price_INR) ? current : best,
    );
  }, [listings]);

  const orderedListings = useMemo(() => {
    if (!preferredListing) return listings;
    return [
      preferredListing,
      ...listings.filter(
        (listing) => listing.Listing_ID !== preferredListing.Listing_ID,
      ),
    ];
  }, [listings, preferredListing]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [itemData, componentData] = await Promise.all([
        fetchBomItemsByBom(bomId),
        fetchComponents(),
      ]);
      setItems(itemData);
      setComponents(componentData);
      setSelectedItemId(
        (prev) => prev ?? (itemData.length ? itemData[0].BOM_ItemID : null),
      );
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

  useEffect(() => {
    const loadListings = async () => {
      const selected = items.find((item) => item.BOM_ItemID === selectedItemId);
      if (!selected) {
        setListings([]);
        return;
      }
      try {
        setListingsLoading(true);
        const data = await fetchListingsByComponent(selected.Comp_ID);
        setListings(data);
      } catch (err) {
        setError(
          err?.response?.data?.error || "Failed to load vendor listings",
        );
      } finally {
        setListingsLoading(false);
      }
    };

    loadListings();
  }, [items, selectedItemId]);

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

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <div>
          {loading ? (
            <p>Loading BOM items...</p>
          ) : (
            <BomTree
              nodes={treeData}
              onDelete={handleDelete}
              onSelect={setSelectedItemId}
              selectedId={selectedItemId}
            />
          )}
        </div>
        <aside className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
          <h2 className="text-lg font-semibold text-white">Vendor Intel</h2>
          <p className="text-xs text-slate-400">
            Pricing, stock, and distributor links for the selected BOM item.
          </p>

          <div className="mt-4 space-y-3">
            {!selectedItemId && (
              <p className="text-sm text-slate-400">
                Select a BOM item to see vendor information.
              </p>
            )}

            {selectedItemId && listingsLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-500 border-t-transparent"></div>
                Loading vendor listings...
              </div>
            )}

            {selectedItemId && !listingsLoading && listings.length === 0 && (
              <p className="text-sm text-slate-400">
                No vendor listings found for this component.
              </p>
            )}

            {!listingsLoading && preferredListing && (
              <div className="rounded-md border border-cyan-500/30 bg-cyan-500/10 p-3 text-xs text-cyan-200">
                <p className="font-semibold">Preferred vendor</p>
                <p className="mt-1 text-slate-200">
                  {preferredListing.Vendor_Name} • ₹
                  {Number(preferredListing.Price_INR).toFixed(2)} • Stock{" "}
                  {Number(preferredListing.Stock_Qty).toLocaleString()}
                </p>
                <p className="mt-1 text-[11px] text-cyan-300">
                  Auto-picked by lowest price with available stock.
                </p>
              </div>
            )}

            {!listingsLoading &&
              orderedListings.map((listing) => (
                <div
                  key={listing.Listing_ID}
                  className="rounded-md border border-slate-800/70 bg-slate-950/40 p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-slate-200">
                          {listing.Vendor_Name}
                        </p>
                        {preferredListing?.Listing_ID ===
                          listing.Listing_ID && (
                          <span className="rounded-full bg-cyan-500/20 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 ring-1 ring-inset ring-cyan-500/30">
                            Preferred
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500">
                        {listing.Location_City || "Online"}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-cyan-300">
                      ₹{Number(listing.Price_INR).toFixed(2)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                    <span>
                      Stock: {Number(listing.Stock_Qty).toLocaleString()}
                    </span>
                    <a
                      href={listing.Purchase_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-cyan-400 hover:text-cyan-300"
                    >
                      Buy Link
                    </a>
                  </div>
                </div>
              ))}
          </div>
        </aside>
      </div>
    </section>
  );
}

export default BomEditorPage;
