import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
} from "react-router-dom";
import Cookies from "js-cookie";
import { Spin, Card, Typography, Button,Divider } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import Classes from "./pages/classes";
import supabase from "./utils/supabase";
import Register from "./pages/Register";
import Ranking from "./pages/ranking";
import Header from "./components/header";
import NotFound from "./pages/NotFound";
import Weeks from "./pages/weeks";
import Login from "./pages/login";
import Houses from "./pages/houses";
import Evaluation from "./pages/evaluation";

const { Title, Text } = Typography;

// --- ProtectedRoute ---
function ProtectedRoute({ isLog= false,requireAdmin = false }) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const userId = Cookies.get("user");
      if (!userId) {
        setAuthorized(false);
        setLoading(false);
        return;
      }
      if(!isLog) {
        setAuthorized(true);
        setLoading(false);
        return;
      }; 
      if (requireAdmin) {
        const { data ,error} = await supabase
        .from("users")
        .select()
        .eq("id", userId)
        .eq("admin", true)
        .single();
        setAuthorized(!!data);
      } else {
        setAuthorized(true);
      }

      setLoading(false);
    };

    checkUser();
  }, [requireAdmin]);

  if (loading)
    return (
      <div className="!font-[Poppins] flex justify-center items-center h-screen w-screen bg-[#001529] text-white text-xl">
        <Spin
          indicator={<LoadingOutlined style={{ fontSize: 40, color: "white" }} spin />}
        />
        <span className="!font-[Poppins] ml-3 text-lg">Cargando...</span>
      </div>
    );

  if (!authorized) return <Navigate to="/login" replace />;

  return <Outlet />;
}

// --- Layout con Header ---
function MainLayout() {
  return (
    <div className="!font-[Poppins] flex flex-col bg-gray-50 w-screen h-screen overflow-hidden">
      {/* Header fijo */}
      <div className="fixed top-0 left-0 z-50 w-full shadow-xl">
        <Header />
      </div>

      {/* Contenido dinámico */}
      <div className="flex-1 mt-[64px] overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />

        {/* Layout con Header */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Ranking />} />
          <Route element={<ProtectedRoute isLog={false} requireAdmin={false}/>}>
            <Route path='/weeks' element={<Weeks/>}/>
          </Route>
          {/* Ruta protegida (solo admins) */}
          <Route element={<ProtectedRoute isLog={true} requireAdmin={true} />}>
            <Route path = "/classes" element={<Classes/>}/>
            <Route path="/houses" element={<Houses/>} />
            <Route path="/register" element={<Register />} />
            <Route path="/califications" element={<Evaluation />} /> 
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
