import { useEffect, useState } from "react";
import { fetchComponents, fetchListingsByComponent } from "../services/api";
import {
  Store,
  MapPin,
  ShieldCheck,
  ExternalLink,
  Search,
  ShoppingCart,
  AlertCircle,
  Truck,
  Box,
  Filter,
} from "lucide-react";

function VendorListingsPage() {
  const [components, setComponents] = useState([]);
  const [selectedComp, setSelectedComp] = useState("");
  const [listings, setListings] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

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
        setLoading(true);
        const data = await fetchListingsByComponent(selectedComp);

        // Sorting mock logic to show best prices first
        const sorted = data.sort(
          (a, b) => Number(a.Price_INR) - Number(b.Price_INR),
        );
        setListings(sorted);
      } catch (err) {
        setError(
          err?.response?.data?.error || "Failed to load vendor listings",
        );
      } finally {
        setLoading(false);
      }
    };

    loadListings();
  }, [selectedComp]);

  const selectedComponentDetails = components.find(
    (c) => String(c.Comp_ID) === selectedComp,
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
              <Store className="h-6 w-6" />
            </div>
            Sourcing & Vendors
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Compare prices, check stock availability, and source components from
            authorized distributors.
          </p>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 flex items-center gap-3 text-rose-400">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar - Component Selection & Details */}
        <div className="space-y-6 lg:col-span-1">
          <div className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-5 backdrop-blur-sm shadow-sm">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-cyan-400" />
              Find Component
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Select Part (MPN)
                </label>
                <div className="relative">
                  <select
                    value={selectedComp}
                    onChange={(e) => setSelectedComp(e.target.value)}
                    className="w-full appearance-none rounded-lg border border-slate-700 bg-slate-950 py-2.5 pl-3 pr-10 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 shadow-sm"
                  >
                    {components.map((component) => (
                      <option key={component.Comp_ID} value={component.Comp_ID}>
                        {component.MPN}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
                    <svg
                      className="h-4 w-4 text-slate-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {selectedComponentDetails && (
                <div className="rounded-lg bg-slate-950/50 p-4 border border-slate-800/50 mt-4">
                  <h3 className="font-semibold text-white mb-2">
                    {selectedComponentDetails.MPN}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-3 mb-3 leading-relaxed">
                    {selectedComponentDetails.Description}
                  </p>

                  <div className="space-y-2 text-xs border-t border-slate-800/60 pt-3">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Category:</span>
                      <span className="font-medium text-slate-300">
                        {selectedComponentDetails.Category || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Life Cycle:</span>
                      <span className="font-medium text-emerald-400">
                        Active
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Total Listings:</span>
                      <span className="font-medium text-cyan-400">
                        {listings.length} sellers
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions / Helpers */}
          <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/20 text-indigo-400 mb-3">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <h3 className="font-medium text-white">Need a Quote?</h3>
            <p className="mt-2 text-xs text-slate-400">
              Export these listings to CSV or send an automated RFQ directly to
              distributors.
            </p>
            <button className="mt-4 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-500/20">
              Export to BOM
            </button>
          </div>
        </div>

        {/* Right Content - Vendor Table */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              Available Distributors
              <span className="flex h-5 items-center justify-center rounded-full bg-slate-800 px-2 text-[10px] font-bold text-slate-400 border border-slate-700">
                {listings.length}
              </span>
            </h2>

            <div className="flex gap-2">
              <button className="text-xs text-slate-400 hover:text-white flex items-center gap-1 bg-slate-800/50 px-3 py-1.5 rounded-lg transition-colors border border-slate-800">
                <Filter className="h-3 w-3" /> Filter
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/50 shadow-sm backdrop-blur-sm">
            {loading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
              </div>
            ) : (
              <table className="min-w-full divide-y divide-slate-800/60 text-sm">
                <thead>
                  <tr className="bg-slate-950/40 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    <th className="px-5 py-4">Distributor</th>
                    <th className="px-5 py-4">Location</th>
                    <th className="px-5 py-4">Stock Avail.</th>
                    <th className="px-5 py-4">Unit Price</th>
                    <th className="px-5 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {listings.map((item, index) => {
                    const isBestPrice = index === 0 && listings.length > 1;
                    const lowStock = item.Stock_Qty < 100;

                    return (
                      <tr
                        key={item.Listing_ID}
                        className="group transition-colors hover:bg-slate-800/30"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-slate-800 text-slate-300 ring-1 ring-inset ring-slate-700">
                              <Store className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-200 group-hover:text-cyan-400 transition-colors">
                                {item.Vendor_Name}
                              </p>
                              <span className="flex items-center gap-1 text-[10px] text-emerald-500 mt-0.5">
                                <ShieldCheck className="h-3 w-3" />
                                Authorized
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-slate-400 whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-slate-500" />
                            {item.Location_City || "Global"}
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex flex-col">
                            <span
                              className={`font-medium ${
                                lowStock ? "text-amber-400" : "text-slate-200"
                              }`}
                            >
                              {Number(item.Stock_Qty).toLocaleString()} units
                            </span>
                            <span className="flex flex-col"></span>
                            <span className="flex items-center gap-1 text-[10px] text-slate-500 mt-0.5">
                              <Truck className="h-3 w-3" />
                              Ships in 2-3 days
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-white tracking-tight">
                              ₹{Number(item.Price_INR).toFixed(2)}
                            </span>
                            {isBestPrice && (
                              <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-bold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                                Best Price
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <a
                            href={item.Purchase_URL}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-white hover:bg-slate-700 hover:text-cyan-400 transition-colors ring-1 ring-inset ring-slate-700"
                          >
                            Buy Now
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                  {!listings.length && (
                    <tr>
                      <td colSpan="5" className="px-5 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <Box className="h-8 w-8 mb-3 opacity-50" />
                          <p className="text-sm font-medium text-slate-400">
                            No active listings found for{" "}
                            {selectedComponentDetails?.MPN || "this component"}
                          </p>
                          <p className="text-xs mt-1">
                            Try selecting a different component or expanding
                            your search.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default VendorListingsPage;
