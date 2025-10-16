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
import Register from "./pages/register";
import Ranking from "./pages/ranking";
import Header from "./components/header";
import NotFound from "./pages/NotFound";
import Weeks from "./pages/weeks";
import Login from "./pages/login";

const { Title, Text } = Typography;

// --- ProtectedRoute ---
function ProtectedRoute({ requireAdmin = false }) {
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

function Admin() {
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-gradient-to-b from-[#1a2a4a] to-[#001529] text-center">
      <Card
        className="shadow-lg"
        style={{
          width: 500,
          backgroundColor: "rgba(255,255,255,0.1)",
          border: "1px solid #2b3f66",
        }}
      >
        <Title level={2} style={{ color: "white" }}>
          🏰 Panel de Administración
        </Title>
        <Text style={{ color: "#b0c4de" }}>
          Solo accesible para administradores
        </Text>
      </Card>
    </div>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Layout con Header */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Ranking />} />
          <Route path='/weeks' element={<Weeks/>}/>
          {/* Ruta protegida (solo admins) */}
          <Route element={<ProtectedRoute requireAdmin={true} />}>
            <Route path = "/classes" element={<Classes/>}/>
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
