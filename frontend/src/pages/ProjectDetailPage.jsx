import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchBomsByProject, fetchProjectById } from "../services/api";

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

  if (loading) return <p>Loading project...</p>;
  if (error) return <p className="text-rose-400">{error}</p>;
  if (!project) return <p>Project not found.</p>;

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-cyan-300">
        {project.Project_Name}
      </h1>
      <p className="text-slate-300">
        {project.Description || "No description available."}
      </p>

      <h2 className="pt-2 text-xl font-semibold">BOMs</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {boms.map((bom) => (
          <div
            key={bom.BOM_ID}
            className="rounded-lg border border-slate-800 bg-slate-900 p-4"
          >
            <p className="font-medium">{bom.BOM_Name}</p>
            <Link
              to={`/boms/${bom.BOM_ID}/editor`}
              className="mt-3 inline-block rounded-md bg-indigo-600 px-3 py-2 text-sm font-medium hover:bg-indigo-500"
            >
              Open BOM Editor
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ProjectDetailPage;
