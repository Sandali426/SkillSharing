import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./Learning-Plan/Dashboard";
import CreatePlan from "./Learning-Plan/CreatePlan";
import ViewPlan from "./Learning-Plan/ViewPlan";
import EditPlan from "./Learning-Plan/EditPlans";
import Header from "./components/Header";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/plan/create" element={<CreatePlan />} />
        <Route path="/plans/:id" element={<ViewPlan />} />
        <Route path="/plan/edit/:id" element={<EditPlan />} />
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
