import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBomsByProject, fetchProjectById } from "../services/api";
import {
  FolderGit2,
  Settings,
  Trash2,
  Plus,
  FileSpreadsheet,
  Clock,
  User,
  Tags,
  AlertCircle,
  FileJson,
  Download,
  Share2,
  MoreVertical,
  Activity,
  CheckCircle2,
  Calendar,
  BoxSelect,
} from "lucide-react";

function ProjectDetailPage() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [boms, setBoms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [projectData, bomData] = await Promise.all([
          fetchProjectById(projectId),
          fetchBomsByProject(projectId),
        ]);
        setProject(projectData);
        setBoms(bomData);
      } catch (err) {
        setError(
          err?.response?.data?.error || "Failed to load project details",
        );
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [projectId]);

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
          <p className="text-sm font-medium text-slate-400">
            Loading project data...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 text-center shadow-sm">
        <AlertCircle className="mx-auto h-8 w-8 text-rose-400 mb-3" />
        <p className="text-lg font-medium text-rose-400">{error}</p>
        <Link
          to="/"
          className="mt-4 inline-block text-sm text-slate-400 hover:text-white underline underline-offset-4"
        >
          Return to Dashboard
        </Link>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Project Header */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-800/60 bg-gradient-to-br from-slate-900 to-[#0A0F1C] p-8 shadow-lg">
        {/* Background Decorative Pattern */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-[0.03] pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 100 100">
            <path
              d="M10 10h80v80H10z"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M30 10v80M50 10v80M70 10v80M10 30h80M10 50h80M10 70h80"
              stroke="currentColor"
              strokeWidth="1"
            />
            <circle
              cx="50"
              cy="50"
              r="30"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="flex gap-6">
            <div className="hidden sm:flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 ring-1 ring-inset ring-cyan-500/20 shadow-inner">
              <FolderGit2 className="h-8 w-8" />
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-3xl font-bold tracking-tight text-white">
                  {project.Project_Name}
                </h1>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  {project.Status || "Active"}
                </span>
                {project.Version_Tag && (
                  <span className="inline-flex items-center rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-400 ring-1 ring-inset ring-blue-500/20">
                    {project.Version_Tag}
                  </span>
                )}
              </div>

              <p className="mt-4 max-w-3xl text-base text-slate-300 leading-relaxed border-l-2 border-slate-700 pl-4">
                {project.Description ||
                  "No project description provided. Add one to help your team understand the scope and requirements of this PCB design."}
              </p>

              <div className="mt-6 flex flex-wrap gap-6 text-sm text-slate-400">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-slate-500" />
                  <span>
                    Lead:{" "}
                    <span className="text-slate-200 font-medium">
                      {project.Lead_Name || "Unassigned"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-slate-500" />
                  <span>
                    Due:{" "}
                    <span className="text-slate-200 font-medium">
                      {project.Due_Date
                        ? new Date(project.Due_Date).toLocaleDateString()
                        : "Not set"}
                    </span>
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Tags className="h-4 w-4 text-slate-500" />
                  <span>
                    Budget:{" "}
                    <span className="text-emerald-400 font-medium font-mono tracking-tight">
                      ₹
                      {Number(project.Total_Est_Budget || 0).toLocaleString(
                        "en-IN",
                      )}
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <button className="flex h-10 items-center gap-2 rounded-lg bg-slate-800 px-4 font-medium text-white hover:bg-slate-700 transition-colors border border-slate-700 shadow-sm">
              <Share2 className="h-4 w-4" />
              Share
            </button>
            <button className="flex h-10 items-center justify-center rounded-lg bg-slate-800 px-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700 shadow-sm">
              <Settings className="h-5 w-5" />
            </button>
            <button className="flex h-10 items-center justify-center rounded-lg bg-rose-500/10 px-3 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-colors border border-rose-500/20">
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Two Column Layout for Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content - BOMs (Takes up 2 columns) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-white">
              <FileSpreadsheet className="h-5 w-5 text-cyan-400" />
              Bill of Materials ({boms.length})
            </h2>
            <button className="inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 transition-colors shadow-sm focus:ring-2 focus:ring-cyan-500/50">
              <Plus className="h-4 w-4" />
              Create BOM
            </button>
          </div>

          {boms.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 mb-4">
                <FileJson className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-lg font-medium text-white">No BOMs found</h3>
              <p className="mt-2 max-w-sm text-sm text-slate-400">
                Get started by creating your first Bill of Materials for this
                project. You can import from EDA tools or start fresh.
              </p>
              <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition">
                <BoxSelect className="h-4 w-4" />
                Import from Altium/KiCad
              </button>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {boms.map((bom, idx) => (
                <div
                  key={bom.BOM_ID}
                  className="group relative flex flex-col rounded-xl border border-slate-800 bg-slate-900/60 p-5 shadow-sm transition-all hover:border-cyan-500/30 hover:bg-slate-900 overflow-hidden"
                >
                  <div className="absolute right-0 top-0 h-24 w-24 -translate-y-8 translate-x-8 rounded-full bg-indigo-500/5 blur-2xl transition-all group-hover:bg-indigo-500/10"></div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
                        <FileSpreadsheet className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white group-hover:text-indigo-300 transition-colors">
                          {bom.BOM_Name}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Rev 1.{idx}
                        </p>
                      </div>
                    </div>
                    <button className="text-slate-500 hover:text-slate-300">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4 text-sm relative z-10 border-t border-slate-800/60 pt-4">
                    <div>
                      <p className="text-slate-500 text-xs">Total Parts</p>
                      <p className="font-medium text-slate-200 mt-0.5">
                        {42 + idx * 17} items
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Sourcing Status</p>
                      <p className="font-medium flex items-center gap-1.5 text-emerald-400 mt-0.5">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Ready
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex gap-2 relative z-10">
                    <Link
                      to={`/boms/${bom.BOM_ID}/editor`}
                      className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm"
                    >
                      Open Editor
                    </Link>
                    <button className="flex items-center justify-center rounded-lg bg-slate-800 px-3 py-2 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors border border-slate-700">
                      <Download className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar - Project Analytics & Activity */}
        <div className="space-y-6">
          {/* Completion Status */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800/50 pb-2">
              Project Progress
            </h3>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Schematic Design</span>
                  <span className="font-medium text-emerald-400">100%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full w-full"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">PCB Layout</span>
                  <span className="font-medium text-cyan-400">85%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-cyan-500 rounded-full w-[85%]"></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">BOM Sourcing</span>
                  <span className="font-medium text-amber-400">40%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full w-[40%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-slate-800/50 pb-2 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Recent Activity
            </h3>

            <div className="space-y-4">
              {[
                {
                  action: "BOM exported to CSV",
                  user: "Alex Chen",
                  time: "2 hours ago",
                  color: "text-blue-400",
                  pointCode: "bg-blue-500",
                },
                {
                  action: "Added 14 new components",
                  user: "Sarah V.",
                  time: "yesterday",
                  color: "text-cyan-400",
                  pointCode: "bg-cyan-500",
                },
                {
                  action: "Updated budget estimate",
                  user: "Mike R.",
                  time: "3 days ago",
                  color: "text-emerald-400",
                  pointCode: "bg-emerald-500",
                },
                {
                  action: "Project created",
                  user: "Alex Chen",
                  time: "1 week ago",
                  color: "text-slate-400",
                  pointCode: "bg-slate-500",
                },
              ].map((activity, i) => (
                <div key={i} className="flex gap-3 relative">
                  {i !== 3 && (
                    <div className="absolute left-[5px] top-6 h-full w-[2px] bg-slate-800/60"></div>
                  )}
                  <div
                    className={`mt-1.5 h-3 w-3 shrink-0 rounded-full ${activity.pointCode} ring-4 ring-[#0A0F1C]`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-slate-200">
                      {activity.action}
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      by {activity.user} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button className="mt-6 w-full rounded-lg bg-slate-800/50 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
              View All Activity
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProjectDetailPage;
