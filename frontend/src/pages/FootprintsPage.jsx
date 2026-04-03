import { useEffect, useState } from "react";
import { fetchFootprints } from "../services/api";

function FootprintsPage() {
  const [footprints, setFootprints] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchFootprints();
        setFootprints(data);
      } catch (err) {
        setError(err?.response?.data?.error || "Failed to load footprints");
      }
    };

    load();
  }, []);

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-cyan-300">Footprints</h1>
      {error && <p className="text-rose-400">{error}</p>}

      <div className="grid gap-3 md:grid-cols-2">
        {footprints.map((fp) => (
          <article
            key={fp.FP_ID}
            className="rounded-lg border border-slate-800 bg-slate-900 p-4"
          >
            <h2 className="font-semibold text-cyan-200">{fp.Footprint_Name}</h2>
            <p className="text-sm text-slate-300">Component: {fp.MPN}</p>
            <p className="text-xs text-slate-400">
              Package: {fp.Package_Type || "N/A"}
            </p>
            <div className="mt-3 space-x-4 text-sm">
              {fp.CAD_Link && (
                <a
                  href={fp.CAD_Link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-300 underline"
                >
                  CAD Link
                </a>
              )}
              {fp.Model_3D_Link && (
                <a
                  href={fp.Model_3D_Link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-cyan-300 underline"
                >
                  3D Model
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default FootprintsPage;
