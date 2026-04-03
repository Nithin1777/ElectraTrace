import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FolderGit2,
  Plus,
  Clock,
  IndianRupee,
  Activity,
  Users,
  CheckCircle2,
  ArrowUpRight,
} from "lucide-react";
import { createProject, fetchProjects } from "../services/api";

function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    Project_Name: "",
    Description: "",
    Total_Est_Budget: "",
  });

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchProjects();
        setProjects(data);
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  // Quick stats calculations
  const totalBudget = projects.reduce(
    (sum, p) => sum + Number(p.Total_Est_Budget || 0),
    0,
  );
  const activeProjectsCount = projects.length; // Simplified for now

  const handleCreateChange = (field) => (event) => {
    setFormValues((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleCreateProject = async (event) => {
    event.preventDefault();
    setCreateError("");

    if (!formValues.Project_Name.trim()) {
      setCreateError("Project name is required.");
      return;
    }

    try {
      setCreateLoading(true);
      const payload = {
        Project_Name: formValues.Project_Name.trim(),
        Description: formValues.Description.trim(),
        Total_Est_Budget: formValues.Total_Est_Budget
          ? Number(formValues.Total_Est_Budget)
          : null,
      };
      const created = await createProject(payload);
      setProjects((prev) => [created, ...prev]);
      setFormValues({
        Project_Name: "",
        Description: "",
        Total_Est_Budget: "",
      });
      setShowCreateModal(false);
    } catch (err) {
      setCreateError(err?.response?.data?.error || "Failed to create project");
    } finally {
      setCreateLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">
            Projects Dashboard
          </h1>
          <p className="mt-1 text-slate-400">
            Manage and track your PCB electronic designs effectively.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-cyan-400 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 shadow-lg shadow-cyan-500/20 active:scale-95"
        >
          <Plus className="h-5 w-5" />
          New Project
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Active Projects",
            value: activeProjectsCount,
            icon: FolderGit2,
            trend: "+2 this month",
            color: "text-blue-400",
            bg: "bg-blue-500/10",
          },
          {
            title: "Total Estimated Budget",
            value: `₹${totalBudget.toLocaleString("en-IN")}`,
            icon: IndianRupee,
            trend: "Across all projects",
            color: "text-emerald-400",
            bg: "bg-emerald-500/10",
          },
          {
            title: "Team Members",
            value: "12",
            icon: Users,
            trend: "3 active now",
            color: "text-purple-400",
            bg: "bg-purple-500/10",
          },
          {
            title: "Completed BOMs",
            value: "84%",
            icon: CheckCircle2,
            trend: "+4% from last week",
            color: "text-cyan-400",
            bg: "bg-cyan-500/10",
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="rounded-xl border border-slate-800/60 bg-slate-900/50 p-6 shadow-sm backdrop-blur-sm transition-all hover:border-slate-700/80"
          >
            <div className="flex items-center gap-4">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.bg}`}
              >
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-400">
                  {stat.title}
                </p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-white">
                    {stat.value}
                  </h3>
                </div>
              </div>
            </div>
            <p className="mt-4 flex items-center gap-1.5 text-xs font-medium text-slate-500">
              <Activity className="h-3.5 w-3.5" />
              {stat.trend}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
          <h2 className="text-lg font-semibold text-white">Recent Projects</h2>
          <div className="flex items-center gap-2">
            <select className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm text-slate-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Completed</option>
            </select>
            <select className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-sm text-slate-300 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500">
              <option>Newest First</option>
              <option>Oldest First</option>
              <option>Highest Budget</option>
            </select>
          </div>
        </div>

        {loading && (
          <div className="flex h-40 items-center justify-center rounded-xl border border-slate-800/60 bg-slate-900/30">
            <div className="flex flex-col items-center gap-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-cyan-500 border-t-transparent"></div>
              <p className="text-sm font-medium text-slate-400">
                Loading projects...
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 p-6 text-center">
            <p className="text-rose-400 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700 transition"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && projects.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/30 p-10 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-800 mb-4">
              <FolderGit2 className="h-6 w-6 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-white">
              No projects yet
            </h3>
            <p className="mt-2 text-sm text-slate-400">
              Create your first project to start tracking BOMs and vendor data.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 transition"
            >
              <Plus className="h-4 w-4" />
              New Project
            </button>
          </div>
        )}

        {!loading && !error && projects.length > 0 && (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <Link
                key={project.Proj_ID}
                to={`/projects/${project.Proj_ID}`}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-slate-800/60 bg-gradient-to-b from-slate-900/80 to-slate-900/40 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/10"
              >
                <div className="relative z-10">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800/50 text-cyan-400 ring-1 ring-inset ring-slate-700/50 group-hover:bg-cyan-500/10 group-hover:text-cyan-300 transition-colors">
                      <FolderGit2 className="h-5 w-5" />
                    </div>
                    <span className="inline-flex items-center rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 ring-1 ring-inset ring-emerald-500/20">
                      Active
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors decoration-2 underline-offset-4 group-hover:underline">
                      {project.Project_Name}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm text-slate-400 leading-relaxed">
                      {project.Description ||
                        "No detailed description provided for this project."}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 mt-6 border-t border-slate-800/60 pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <Clock className="h-4 w-4" />
                      <span>Updated 2d ago</span>
                    </div>
                    <div className="flex items-center gap-1.5 font-medium text-slate-200">
                      <IndianRupee className="h-4 w-4 text-emerald-400" />
                      {Number(project.Total_Est_Budget || 0).toLocaleString(
                        "en-IN",
                      )}
                    </div>
                  </div>

                  <div className="absolute bottom-0 right-0 translate-x-4 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
                    <ArrowUpRight className="h-5 w-5 text-cyan-400" />
                  </div>
                </div>

                {/* Decorative background glow on hover */}
                <div className="absolute -right-20 -top-20 z-0 h-40 w-40 rounded-full bg-cyan-500/10 blur-[50px] transition-all duration-500 group-hover:bg-cyan-500/20"></div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-800/80 bg-slate-900/95 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800/60 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Create new project
                </h2>
                <p className="text-xs text-slate-400">
                  Kick off a new hardware design workspace.
                </p>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-full border border-slate-700/70 px-2.5 py-1 text-xs text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
              >
                Close
              </button>
            </div>

            <form className="space-y-4 pt-4" onSubmit={handleCreateProject}>
              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Project name
                </label>
                <input
                  value={formValues.Project_Name}
                  onChange={handleCreateChange("Project_Name")}
                  placeholder="e.g. Autonomous rover controller"
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Description
                </label>
                <textarea
                  value={formValues.Description}
                  onChange={handleCreateChange("Description")}
                  placeholder="Short summary of the board goals"
                  rows="3"
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300">
                  Estimated budget (₹)
                </label>
                <input
                  value={formValues.Total_Est_Budget}
                  onChange={handleCreateChange("Total_Est_Budget")}
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="12000"
                  className="mt-2 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-200 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
                />
              </div>

              {createError && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">
                  {createError}
                </div>
              )}

              <div className="flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="rounded-lg border border-slate-700/70 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createLoading}
                  className="rounded-lg bg-cyan-500 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-cyan-500/30 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {createLoading ? "Creating..." : "Create Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;
