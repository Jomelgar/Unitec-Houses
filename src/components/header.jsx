import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import supabase from "../utils/supabase";
import {
  TrophyFilled,
  SettingFilled,
  MoneyCollectFilled,
  BookOutlined,
  TagOutlined,
  UserOutlined,
  LogoutOutlined,
  FireFilled,
} from "@ant-design/icons";
import { Layout, Menu, Avatar, Dropdown } from "antd";

const { Header } = Layout;

function AppHeader() {
  const [options, setOptions] = useState([
    { key: "1", label: "Ranking", icon: <TrophyFilled />,  onClick: () => navigate("/"), },
    { key: "2", label: "Calificar", icon: <MoneyCollectFilled />, onClick: () => navigate("/weeks"), },
  ]);

  const [userExists, setUserExists] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id = Cookies.get("user");
    setUserExists(!!id);

    const setAdmin = async () => {
      if (!id) return;

      const { data } = await supabase
        .from("users")
        .select("*")
        .eq("id", id)
        .eq("admin", true)
        .single();

      if (!data) return;

      const optionsAdmin = {
        key: "3",
        label: "Creación",
        icon: <SettingFilled />,
        children: [
          { key: "1", label: "Casa", icon: <FireFilled /> ,  onClick: () => navigate("/houses"),},
          { key: "2", label: "Clase", icon: <BookOutlined />,  onClick: () => navigate("/classes"), },
        ],
      };
      setOptions((prev) => [...prev, optionsAdmin]);
    };

    setAdmin();
  }, []);

  // Menu del avatar
  const avatarMenu = {
    items: userExists
      ? [
          {
            key: "logout",
            label: "Cerrar sesión",
            icon: <LogoutOutlined />,
            onClick: () => {
              Cookies.remove("user");
              setUserExists(false);
              navigate("/login");
            },
          },
        ]
      : [
          {
            key: "login",
            label: "Iniciar sesión",
            onClick: () => navigate("/login"),
          },
          {
            key: "register",
            label: "Registrarse",
            onClick: () => navigate("/register"),
          },
        ],
  };

  return (
    <Header className="relative flex items-center justify-between px-8 py-4 shadow-md w-full overflow-hidden bg-gradient-to-r from-[#0f1f3c] to-[#001529]">
      
      {/* Fondo interactivo de partículas */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-70 shadow-lg"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.5, 1, 0.5],
              scale: [1, 1.3, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Logo animado */}
      <div
        className="flex items-center text-white text-xl tracking-wide select-none z-10 font-[Poppins]"
      >
        <img alt="Logo" src="/UT2.png" className="w-8 h-8 mr-3" />
        <span className="font-bold text-white !font-[Poppins]">MATH HOUSES</span>
      </div>

      {/* Menú principal */}
      <Menu
        mode="horizontal"
        theme="dark"
        selectedKeys={[]}
        items={options}
        className="flex-1 justify-center bg-transparent border-none text-gray-100 text-base !font-[Poppins] font-medium z-10"
      />

      {/* Avatar único */}
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="z-10"
      >
        <Dropdown menu={avatarMenu} placement="bottomRight" arrow>
          <Avatar
            size="large"
            icon={<UserOutlined />}
            className="!font-[Poppins] cursor-pointer bg-blue-500 hover:bg-blue-400 hover:scale-110 transition-all shadow-lg"
          />
        </Dropdown>
      </motion.div>
    </Header>
  );
}

export default AppHeader;
