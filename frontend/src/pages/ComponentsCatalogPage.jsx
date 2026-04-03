import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  fetchComponents,
  fetchFootprints,
  fetchListings,
} from "../services/api";
import {
  Search,
  Filter,
  Cpu,
  FileText,
  ExternalLink,
  ChevronDown,
  Layers,
  AlertCircle,
  BoxSelect,
} from "lucide-react";

function ComponentsCatalogPage() {
  const [components, setComponents] = useState([]);
  const [listings, setListings] = useState([]);
  const [footprints, setFootprints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  const load = async (params = {}) => {
    try {
      setLoading(true);
      const [componentData, listingData] = await Promise.all([
        fetchComponents(params),
        fetchListings(),
      ]);
      const footprintData = await fetchFootprints();
      setComponents(componentData);
      setListings(listingData);
      setFootprints(footprintData);
      setError("");
    } catch (err) {
      setError(err?.response?.data?.error || "Failed to load components");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const categories = [
    ...new Set(components.map((item) => item.Category).filter(Boolean)),
  ];

  const onSearch = (e) => {
    e.preventDefault();
    const params = {};
    if (query.trim()) params.q = query.trim();
    if (category) params.category = category;
    load(params);
  };

  const listingSummary = listings.reduce((acc, listing) => {
    const current = acc[listing.Comp_ID] || {
      totalStock: 0,
      minPrice: null,
      vendors: 0,
    };
    current.totalStock += Number(listing.Stock_Qty || 0);
    const price = Number(listing.Price_INR || 0);
    if (current.minPrice === null || price < current.minPrice) {
      current.minPrice = price;
    }
    current.vendors += 1;
    acc[listing.Comp_ID] = current;
    return acc;
  }, {});

  const footprintSummary = footprints.reduce((acc, fp) => {
    if (!acc[fp.Comp_ID]) {
      acc[fp.Comp_ID] = {
        count: 0,
        cadLink: fp.CAD_Link,
        modelLink: fp.Model_3D_Link,
      };
    }
    acc[fp.Comp_ID].count += 1;
    acc[fp.Comp_ID].cadLink = acc[fp.Comp_ID].cadLink || fp.CAD_Link;
    acc[fp.Comp_ID].modelLink = acc[fp.Comp_ID].modelLink || fp.Model_3D_Link;
    return acc;
  }, {});

  const filteredComponents = components.filter((component) => {
    const summary = listingSummary[component.Comp_ID];
    if (activeTab === "in-stock") return summary && summary.totalStock > 0;
    if (activeTab === "no-listings") return !summary;
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-inset ring-cyan-500/20">
              <Cpu className="h-6 w-6" />
            </div>
            Component Library
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Search, filter, and manage electronic components, footprints, and 3D
            models.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors border border-slate-700">
            <Layers className="h-4 w-4" />
            Import Library
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-400 transition-colors shadow-lg shadow-cyan-500/20">
            <BoxSelect className="h-4 w-4" />
            New Component
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col gap-4">
        {/* Navigation Tabs */}
        <div className="flex space-x-1 rounded-xl bg-slate-900/50 p-1 border border-slate-800/60 w-fit">
          {[
            { id: "all", label: "All Components" },
            { id: "in-stock", label: "In Stock" },
            { id: "no-listings", label: "No Listings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-slate-800 text-white shadow-sm ring-1 ring-inset ring-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <form
          onSubmit={onSearch}
          className="flex flex-col gap-3 rounded-xl border border-slate-800/60 bg-slate-900/50 p-2 md:flex-row backdrop-blur-sm"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by MPN, description, or keyword..."
              className="h-full w-full rounded-lg bg-slate-950/50 py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 border border-transparent focus:border-cyan-500/50 transition-all"
            />
          </div>
          <div className="h-10 w-[1px] bg-slate-800 hidden md:block"></div>
          <div className="relative md:w-64">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-full w-full appearance-none rounded-lg bg-slate-950/50 py-2.5 pl-10 pr-10 text-sm text-slate-200 focus:outline-none focus:ring-1 focus:ring-cyan-500 border border-transparent focus:border-cyan-500/50 cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 pointer-events-none" />
          </div>
          <button
            type="submit"
            className="rounded-lg bg-cyan-600 px-6 py-2.5 text-sm font-medium hover:bg-cyan-500 transition-colors shadow-md"
          >
            Search
          </button>
        </form>
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center rounded-xl border border-slate-800/60 bg-slate-900/30">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 flex items-center gap-3 text-rose-400">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && filteredComponents.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-10 text-center">
          <Cpu className="h-10 w-10 text-slate-500 mb-3" />
          <h3 className="text-lg font-semibold text-white">
            No components found
          </h3>
          <p className="mt-2 text-sm text-slate-400">
            Adjust your filters or search terms to see more results.
          </p>
        </div>
      )}

      {!loading && !error && filteredComponents.length > 0 && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredComponents.map((component) => {
            const summary = listingSummary[component.Comp_ID];
            const footprint = footprintSummary[component.Comp_ID];

            return (
              <div
                key={component.Comp_ID}
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/50 transition-all hover:border-slate-700 hover:shadow-lg hover:shadow-cyan-500/5"
              >
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-bold text-white group-hover:text-cyan-400 transition-colors">
                        {component.MPN}
                      </h2>
                      <p className="mt-1 flex items-center gap-2 text-sm font-medium text-slate-400">
                        {component.Category || "General"}
                      </p>
                    </div>
                    <span className="inline-flex items-center rounded-md border border-cyan-500/30 bg-cyan-500/10 px-2 py-1 text-xs font-medium text-cyan-300">
                      {summary ? "Listed" : "Unlisted"}
                    </span>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Footprints</p>
                      <p className="font-medium text-slate-300">
                        {footprint ? `${footprint.count} available` : "None"}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 line-clamp-2 text-sm text-slate-400 leading-relaxed min-h-[40px]">
                    {component.Description || "Standard electronic component."}
                  </p>

                  <div className="mt-5 grid grid-cols-2 gap-y-3 gap-x-4 border-t border-slate-800/60 pt-4 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Category</p>
                      <p className="font-medium text-slate-300">
                        {component.Category || "Uncategorized"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Vendors</p>
                      <p className="font-medium text-slate-300">
                        {summary ? summary.vendors : 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">In Stock</p>
                      <p className="font-medium text-slate-300">
                        {summary ? summary.totalStock.toLocaleString() : "0"}{" "}
                        units
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-1">Best Price</p>
                      <p className="font-medium text-slate-300">
                        {summary?.minPrice != null
                          ? `₹${summary.minPrice.toFixed(2)}`
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/80 bg-slate-950/50 p-4">
                  <a
                    href={component.Datasheet_URL || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs transition-colors ${
                      component.Datasheet_URL
                        ? "border-slate-800 text-slate-400 hover:text-cyan-300 hover:border-cyan-500/30"
                        : "border-slate-900 text-slate-600 pointer-events-none"
                    }`}
                  >
                    <FileText className="h-3 w-3" /> Datasheet
                  </a>
                  {footprint?.cadLink ? (
                    <a
                      href={footprint.cadLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border border-purple-500/30 bg-purple-500/10 px-2 py-1 text-xs text-purple-200 hover:bg-purple-500/20"
                    >
                      CAD
                    </a>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-md border border-slate-900 px-2 py-1 text-xs text-slate-600">
                      CAD N/A
                    </span>
                  )}
                  <Link
                    to="/vendors"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-white hover:bg-slate-700 transition-colors"
                  >
                    View Listings
                    <ExternalLink className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ComponentsCatalogPage;
