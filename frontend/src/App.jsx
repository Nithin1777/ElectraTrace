import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import BomEditorPage from "./pages/BomEditorPage";
import ComponentsCatalogPage from "./pages/ComponentsCatalogPage";
import DashboardPage from "./pages/DashboardPage";
import FootprintsPage from "./pages/FootprintsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";
import VendorListingsPage from "./pages/VendorListingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
          <Route path="/boms/:bomId/editor" element={<BomEditorPage />} />
          <Route path="/components" element={<ComponentsCatalogPage />} />
          <Route path="/vendors" element={<VendorListingsPage />} />
          <Route path="/footprints" element={<FootprintsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
