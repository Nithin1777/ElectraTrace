import { useEffect, useState } from "react";
import { fetchFootprints } from "../services/api";
import {
  Database,
  Map,
  Box,
  Download,
  Layers,
  Search,
  Cpu,
  Monitor,
  Eye,
  AlertCircle,
} from "lucide-react";

function FootprintsPage() {
  const [footprints, setFootprints] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchFootprints();
        setFootprints(data);
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to load footprints");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredFootprints = footprints.filter((fp) => {
    const matchesSearch =
      fp.Footprint_Name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      fp.MPN?.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeFilter === "3d") return matchesSearch && fp.Model_3D_Link;
    if (activeFilter === "smd")
      return (
        matchesSearch &&
        (fp.Package_Type?.toLowerCase().includes("qfn") ||
          fp.Package_Type?.toLowerCase().includes("soic"))
      );
    return matchesSearch;
  });

  const filterTabs = [
    { id: "all", label: "All Models" },
    { id: "3d", label: "Has 3D Model" },
    { id: "smd", label: "SMD Packages" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-inset ring-purple-500/20">
              <Database className="h-6 w-6" />
            </div>
            Footprint & 3D Models
          </h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage your PCB footprint library, schematic symbols, and 3D step
            models for ECAD programs.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition-colors border border-slate-700 shadow-sm">
            <Download className="h-4 w-4" />
            Export Library
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/30 p-2 rounded-xl border border-slate-800/60">
        <div className="flex space-x-1 p-1 w-full md:w-auto overflow-x-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-all ${
                activeFilter === tab.id
                  ? "bg-slate-800 text-white shadow-sm ring-1 ring-inset ring-slate-700"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by footprint or MPN..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-slate-700/50 bg-slate-950/50 py-2 pl-9 pr-4 text-sm text-slate-200 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500/50"
          />
        </div>
      </div>

      {loading && (
        <div className="flex h-64 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-purple-500 border-t-transparent"></div>
        </div>
      )}

      {error ? (
        <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 flex items-center gap-3 text-rose-400">
          <AlertCircle className="h-5 w-5" />
          <p className="font-medium">{error}</p>
        </div>
      ) : !loading && filteredFootprints.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-500">
          <Database className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg font-medium text-slate-300">
            No footprints found
          </p>
          <p className="text-sm mt-1">Adjust your search or filter settings</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {!loading &&
            filteredFootprints.map((fp) => (
              <div
                key={fp.FP_ID}
                className="group flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/50 shadow-sm transition-all hover:border-purple-500/30 hover:shadow-lg hover:shadow-purple-500/5"
              >
                {/* Package Preview Canvas (Placeholder) */}
                <div className="h-32 w-full bg-slate-950/80 border-b border-slate-800/80 flex items-center justify-center relative overflow-hidden group-hover:bg-slate-900 transition-colors">
                  {/* Grid Background Pattern */}
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage:
                        "radial-gradient(#334155 1px, transparent 1px)",
                      backgroundSize: "10px 10px",
                      opacity: 0.3,
                    }}
                  ></div>

                  {fp.Package_Type?.toLowerCase().includes("qfn") ? (
                    <Monitor className="h-14 w-14 text-purple-400/50 group-hover:text-purple-400 transition-all stroke-[1.5]" />
                  ) : fp.Package_Type?.toLowerCase().includes("soic") ? (
                    <Cpu className="h-14 w-14 text-blue-400/50 group-hover:text-blue-400 transition-all stroke-[1.5]" />
                  ) : (
                    <Box className="h-14 w-14 text-slate-500/50 group-hover:text-slate-400 transition-all stroke-[1.5]" />
                  )}

                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className="flex h-5 w-5 items-center justify-center rounded bg-slate-800/80 text-[10px] font-bold text-slate-300 border border-slate-700/50">
                      FP
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h2
                    className="font-bold text-white group-hover:text-purple-300 transition-colors truncate"
                    title={fp.Footprint_Name}
                  >
                    {fp.Footprint_Name}
                  </h2>

                  <div className="mt-3 space-y-2">
                    <div className="flex items-center gap-2">
                      <Layers className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="text-xs font-medium text-slate-300">
                        Package:
                      </span>
                      <span className="text-xs text-slate-400 truncate">
                        {fp.Package_Type || "Custom"}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Cpu className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                      <span className="text-xs font-medium text-slate-300">
                        MPN:
                      </span>
                      <span className="text-xs text-purple-400 font-mono tracking-tight truncate">
                        {fp.MPN}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t border-slate-800/60 bg-slate-900/80 p-3">
                  <a
                    href={fp.CAD_Link || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold ring-1 ring-inset transition-colors ${
                      fp.CAD_Link
                        ? "bg-slate-800/50 text-slate-200 ring-slate-700 hover:bg-slate-700"
                        : "bg-slate-900/50 text-slate-600 ring-slate-800 cursor-not-allowed pointer-events-none"
                    }`}
                  >
                    <Map className="h-3.5 w-3.5" />
                    ECAD Files
                  </a>

                  <a
                    href={fp.Model_3D_Link || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex-1 flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-semibold ring-1 ring-inset transition-colors ${
                      fp.Model_3D_Link
                        ? "bg-purple-500/10 text-purple-300 ring-purple-500/30 hover:bg-purple-500/20"
                        : "bg-slate-900/50 text-slate-600 ring-slate-800 cursor-not-allowed pointer-events-none"
                    }`}
                  >
                    <Eye className="h-3.5 w-3.5" />
                    3D Viewer
                  </a>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default FootprintsPage;
