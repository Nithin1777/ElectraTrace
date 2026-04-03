import { useEffect, useState } from "react";
import { fetchComponents } from "../services/api";

function ComponentsCatalogPage() {
  const [components, setComponents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");

  const load = async (params = {}) => {
    try {
      setLoading(true);
      const data = await fetchComponents(params);
      setComponents(data);
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

  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-semibold text-cyan-300">
        Components Catalog
      </h1>

      <form
        onSubmit={onSearch}
        className="flex flex-col gap-3 rounded-lg border border-slate-800 bg-slate-900 p-4 md:flex-row"
      >
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by MPN or description"
          className="flex-1 rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border border-slate-700 bg-slate-950 px-3 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <button className="rounded-md bg-cyan-600 px-4 py-2 font-medium hover:bg-cyan-500">
          Apply
        </button>
      </form>

      {loading && <p>Loading components...</p>}
      {error && <p className="text-rose-400">{error}</p>}

      <div className="grid gap-3 md:grid-cols-2">
        {components.map((component) => (
          <article
            key={component.Comp_ID}
            className="rounded-lg border border-slate-800 bg-slate-900 p-4"
          >
            <h2 className="font-semibold text-cyan-200">{component.MPN}</h2>
            <p className="mt-1 text-sm text-slate-300">
              {component.Description}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              Category: {component.Category || "N/A"}
            </p>
            {component.Datasheet_URL && (
              <a
                href={component.Datasheet_URL}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-cyan-300 underline"
              >
                Datasheet
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}

export default ComponentsCatalogPage;
