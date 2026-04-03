import { Link, NavLink, Outlet } from "react-router-dom";

const navClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium transition ${
    isActive
      ? "bg-cyan-500/20 text-cyan-300"
      : "text-slate-300 hover:bg-slate-800 hover:text-white"
  }`;

function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link
            to="/"
            className="text-lg font-semibold tracking-wide text-cyan-300"
          >
            Electra Trace
          </Link>
          <nav className="flex flex-wrap gap-2">
            <NavLink to="/" end className={navClass}>
              Dashboard
            </NavLink>
            <NavLink to="/components" className={navClass}>
              Components
            </NavLink>
            <NavLink to="/vendors" className={navClass}>
              Vendor Listings
            </NavLink>
            <NavLink to="/footprints" className={navClass}>
              Footprints
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;
