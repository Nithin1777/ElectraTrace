import { Link, NavLink, Outlet } from "react-router-dom";
import {
  CircuitBoard,
  Home,
  Database,
  Store,
  Settings,
  Bell,
  Search,
  Cpu,
} from "lucide-react";

const navClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
    isActive
      ? "bg-cyan-500/10 text-cyan-400 shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] ring-1 ring-inset ring-cyan-500/20"
      : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
  }`;

function Layout() {
  return (
    <div className="flex min-h-screen flex-col bg-[#0A0F1C] font-sans text-slate-200 selection:bg-cyan-500/30">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 border-b border-slate-800/60 bg-[#0A0F1C]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0A0F1C]/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="group flex items-center gap-2.5 transition-transform hover:scale-105"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 shadow-lg shadow-cyan-500/20">
                <CircuitBoard className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Electra<span className="text-cyan-400">Trace</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden items-center gap-1.5 ml-8 md:flex">
              <NavLink to="/" end className={navClass}>
                <Home className="h-4 w-4" />
                Dashboard
              </NavLink>
              <NavLink to="/components" className={navClass}>
                <Cpu className="h-4 w-4" />
                Components
              </NavLink>
              <NavLink to="/vendors" className={navClass}>
                <Store className="h-4 w-4" />
                Vendors
              </NavLink>
              <NavLink to="/footprints" className={navClass}>
                <Database className="h-4 w-4" />
                Footprints
              </NavLink>
            </nav>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search components..."
                className="h-9 w-64 rounded-full border border-slate-800 bg-slate-900/50 py-1 pl-10 pr-4 text-sm text-slate-200 placeholder:text-slate-500 transition-all focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500"
              />
            </div>

            <button className="relative flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-500 ring-2 ring-[#0A0F1C]"></span>
            </button>

            <button className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
              <Settings className="h-5 w-5" />
            </button>

            <div className="ml-2 h-8 w-8 cursor-pointer rounded-full border-2 border-[#0A0F1C] bg-gradient-to-tr from-cyan-500 to-blue-500 shadow-sm"></div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/60 bg-[#0A0F1C] py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 text-sm text-slate-500 sm:px-6 md:flex-row lg:px-8">
          <p>© 2026 ElectraTrace. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="transition-colors hover:text-cyan-400">
              Documentation
            </a>
            <a href="#" className="transition-colors hover:text-cyan-400">
              Support
            </a>
            <a href="#" className="transition-colors hover:text-cyan-400">
              API
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
