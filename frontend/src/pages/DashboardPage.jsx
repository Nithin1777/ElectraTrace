import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchProjects } from "../services/api";

function DashboardPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-cyan-300">
        Projects Dashboard
      </h1>
      {loading && <p className="text-slate-300">Loading projects...</p>}
      {error && <p className="text-rose-400">{error}</p>}

      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.Proj_ID}
            className="rounded-lg border border-slate-800 bg-slate-900 p-4"
          >
            <h2 className="text-lg font-semibold">{project.Project_Name}</h2>
            <p className="mt-2 text-sm text-slate-400">
              {project.Description || "No description"}
            </p>
            <p className="mt-3 text-sm text-emerald-300">
              Budget: ₹
              {Number(project.Total_Est_Budget || 0).toLocaleString("en-IN")}
            </p>
            <Link
              to={`/projects/${project.Proj_ID}`}
              className="mt-4 inline-block rounded-md bg-cyan-600 px-3 py-2 text-sm font-medium hover:bg-cyan-500"
            >
              Open Project
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}

export default DashboardPage;
