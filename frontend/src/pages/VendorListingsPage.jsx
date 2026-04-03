import { useEffect, useState } from "react";
import { fetchComponents, fetchListingsByComponent } from "../services/api";

function VendorListingsPage() {
  const [components, setComponents] = useState([]);
  const [selectedComp, setSelectedComp] = useState("");
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadComponents = async () => {
      try {
        const data = await fetchComponents();
        setComponents(data);
        if (data.length) {
          const firstComp = String(data[0].Comp_ID);
          setSelectedComp(firstComp);
        }
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to load components");
      }
    };

    loadComponents();
  }, []);

  useEffect(() => {
    const loadListings = async () => {
      if (!selectedComp) return;
      try {
        const data = await fetchListingsByComponent(selectedComp);
        setListings(data);
      } catch (err) {
        setError(
          err?.response?.data?.error || "Failed to load vendor listings",
        );
      }
    };

    loadListings();
  }, [selectedComp]);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-cyan-300">Vendor Listings</h1>

      <select
        value={selectedComp}
        onChange={(e) => setSelectedComp(e.target.value)}
        className="rounded-md border border-slate-700 bg-slate-900 px-3 py-2"
      >
        {components.map((component) => (
          <option key={component.Comp_ID} value={component.Comp_ID}>
            {component.MPN}
          </option>
        ))}
      </select>

      {error && <p className="text-rose-400">{error}</p>}

      <div className="overflow-x-auto rounded-lg border border-slate-800">
        <table className="min-w-full divide-y divide-slate-800 bg-slate-900 text-sm">
          <thead>
            <tr className="text-left text-slate-300">
              <th className="px-3 py-2">Vendor</th>
              <th className="px-3 py-2">City</th>
              <th className="px-3 py-2">Price (INR)</th>
              <th className="px-3 py-2">Stock</th>
              <th className="px-3 py-2">Purchase</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {listings.map((item) => (
              <tr key={item.Listing_ID}>
                <td className="px-3 py-2">{item.Vendor_Name}</td>
                <td className="px-3 py-2">{item.Location_City}</td>
                <td className="px-3 py-2">
                  ₹{Number(item.Price_INR).toFixed(2)}
                </td>
                <td className="px-3 py-2">{item.Stock_Qty}</td>
                <td className="px-3 py-2">
                  <a
                    href={item.Purchase_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-300 underline"
                  >
                    Link
                  </a>
                </td>
              </tr>
            ))}
            {!listings.length && (
              <tr>
                <td
                  colSpan="5"
                  className="px-3 py-4 text-center text-slate-400"
                >
                  No listings found for this component.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default VendorListingsPage;
