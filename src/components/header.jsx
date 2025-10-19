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
  MenuFoldOutlined,
  MenuOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Layout, Menu, Avatar, Dropdown,Drawer } from "antd";

const { Header } = Layout;

function AppHeader() {
  const [options, setOptions] = useState([
    { key: "1", label: "Ranking", icon: <TrophyFilled />,  onClick: () => navigate("/"), },
  ]);

  const [userExists, setUserExists] = useState(false);
  const [drawer,setDrawer] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const id = Cookies.get("user");
    if(id){
      const optionsNormal= { key: "2", label: "Calificar", icon: <MoneyCollectFilled />, onClick: () => navigate("/weeks"), };
      setOptions((prev) => [...prev,optionsNormal])
    }

    setUserExists(id);

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
        label: "Gestión",
        icon: <SettingFilled />,
        children: [
          { key: "4", label: "Calificaciones", icon: <FormOutlined />,  onClick: () => navigate("/califications"), },
          { key: "5", label: "Usuarios", icon: <UserOutlined />,  onClick: () => navigate("/register"), },
          { key: "6", label: "Casa", icon: <FireFilled /> ,  onClick: () => navigate("/houses"),},
          { key: "7", label: "Clase", icon: <BookOutlined />,  onClick: () => navigate("/classes"), },
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
          }
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
        <span className="font-bold w-auto text-white !font-[Poppins]">MATH HOUSES</span>
      </div>

      <div className="hidden md:flex w-full ">
        {/* Menú principal */}
        <Menu
          mode="horizontal"
          theme="dark"
          selectedKeys={[]}
          items={options}
          className="flex-1 justify-center bg-transparent border-none text-gray-100 text-base !font-[Poppins] font-medium z-10"
        />
      </div>

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

      <div className="md:hidden flex ">
        <MenuOutlined className="text-white text-2xl" onClick={() => setDrawer(true)}/>
      </div>

      {/* DRAWER MOVIL */}
      <Drawer
        placement="right"
        open={drawer}
        closable={false}
        onClose={() => setDrawer(false)}
        bodyStyle={{
          padding: 0,
          background: "linear-gradient(to bottom right, #0f1f3c, #001529)",
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Partículas en el Drawer */}
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
         <div className="flex justify-between items-center px-6 py-4 bg-gradient-to-r from-[#0f1f3c] to-[#001529] border-b border-blue-500/20 relative z-10">
          <div className="flex items-center text-white text-lg font-[Poppins] font-semibold">
            <img src="/UT2.png" alt="Logo" className="w-7 h-7 mr-2" />
            MATH HOUSES
          </div>
          <MenuOutlined
            className="text-white text-xl cursor-pointer hover:scale-110 transition-transform"
            onClick={() => setDrawer(false)}
          />
        </div>
        {/* Menú dentro del Drawer */}
        <Menu
          mode="inline"
          closable={false}
          items={options}
          onClick={() => setDrawer(false)}
          className="border-none bg-transparent text-white !font-[Poppins] font-medium relative z-10"
          theme="dark"
        />
      </Drawer>
    </Header>
  );
}

export default AppHeader;
