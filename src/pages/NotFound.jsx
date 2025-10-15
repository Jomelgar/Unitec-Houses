import { Button, Typography,Divider } from "antd";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-blue-100 to-blue-200 overflow-hidden flex flex-col justify-center items-center text-center">
      
      {/* 🌫️ Niebla ligera animada */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent animate-pulse"></div>

      {/* ✨ Partículas flotantes */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-blue-500 rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* Contenedor principal */}
      <div className="relative z-10 bg-white/20 backdrop-blur-lg border-4 border-blue-500 rounded-xl p-10 flex flex-col items-center shadow-lg">

        {/* 💥 Título animado */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 60, damping: 12 }}
        >
          <Title
            level={1}
            className="!font-[Poppins] !font-bold !text-9xl mb-2"
            style={{
              color: "#005eff",
            }}
          >
            404
          </Title>
        </motion.div>

        {/* Texto */}
        <Text className="!font-[Poppins] text-2xl mb-6" style={{ color: "#8491a2" }}>
          Página no encontrada
        </Text>

        {/* Botón */}
        <Button
          type="primary"
          className="!font-[Poppins] px-8 py-3 text-lg shadow-lg shadow-blue-300/40 hover:shadow-blue-500/50 transition-all"
          onClick={() => navigate("/")}
        >
          Volver al inicio
        </Button>
      </div>

      {/* Animación de partículas */}
      <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); opacity: 0.6; }
            50% { transform: translateY(-20px); opacity: 1; }
            100% { transform: translateY(0px); opacity: 0.6; }
          }
          .animate-float {
            animation-name: float;
            animation-iteration-count: infinite;
            animation-timing-function: ease-in-out;
          }
        `}
      </style>
      <Divider className="mt-16 border-blue-400/30" />
        <Text className="!font-[Poppins] text-blue-800 italic text-sm relative z-10">
            ⚜️ "Solo los dignos forjarán su nombre en la historia..." ⚜️
        </Text>
    </div>
  );
}

export default NotFound;
