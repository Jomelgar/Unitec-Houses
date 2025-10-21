import { useState } from "react";
import { Card, Typography, Button, Input, Form } from "antd";
import supabase from "../utils/supabase";
import Cookies from "js-cookie";
import { MailOutlined, LockOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    const { data, error: Error } = await supabase.auth.signInWithPassword(values);
    if (Error) {
      setLoading(false);
      return;
    }

    const { data: dataU } = await supabase.from("users").select().eq("id", data.user.id).single();
    if(!dataU) {await supabase.auth.signOut(); setLoading(false);return;}

    const id = data.user.id;
    Cookies.set("user", id,{expires: 1/24});

    const { error: rowError } = await supabase.from("users").select().eq("id", id).single();
    if (rowError) {
      await supabase.from("users").insert([{ id: id, email: values.email }]);
    }

    setTimeout(() => setLoading(false), 1500);
    navigate("/");
  };

  return (
    <div className="relative flex justify-center items-center w-screen h-screen overflow-hidden !font-[Poppins]">
      <style>
      {`
        @keyframes float {
          0% { transform: translateY(0px); opacity: 0.6; }
          50% { transform: translateY(-40px); opacity: 1; }
          100% { transform: translateY(0px); opacity: 0.6; }
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

      `}
    </style>
      {/* 🌫️ Niebla ligera animada */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-800 to-blue-500 animate-pulse"></div>
      {/* ✨ Partículas flotantes */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 bg-white rounded-full animate-float"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      {/* 🌫 Efecto de niebla suave */}
      <motion.div
        className="absolute w-[200%] h-[200%] bg-gradient-radial from-white/10 via-transparent to-transparent blur-3xl"
        animate={{
          x: ["0%", "-30%", "0%"],
          y: ["0%", "20%", "0%"],
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* 💎 Tarjeta de Login */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10"
      >
        <Card
          className="shadow-2xl backdrop-blur-lg"
          style={{
            width: 400,
            backgroundColor: "rgba(255,255,255,0.3)",
            border: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
            borderRadius: 16,
          }}
        >
          <Title className=" flex flex-col justify-center items-center !font-[Poppins]"level={2} style={{ color: "white", marginBottom: 10, fontFamily: "Poppins" }}>
            <img className="h-12 mb-4 cursor-pointer" alt="" src="/UT2.png" onClick={() => navigate("/")}/> Inicia Sesión
          </Title>
          <Text style={{ color: "#ffffffff" }}>
            Bienvenido de nuevo a <b>Unitec Houses</b>
          </Text>

          <Form
            name="login"
            layout="vertical"
            onFinish={onFinish}
            className="mt-6"
            requiredMark={false}
          >
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Por favor ingresa tu correo!" },
                { type: "email", message: "Ingresa un correo válido!" },
              ]}
            >
              <Input
                prefix={<MailOutlined  className="text-white"/>}
                placeholder="Correo electrónico"
                size="large"
                className="text-white !font-[Poppins] "
                style={{
                  borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: "Por favor ingresa tu contraseña!" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-white"/>}
                placeholder="Contraseña"
                size="large"
                className="text-white !font-[Poppins]"
                style={{
                  borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                }}
                iconRender={(visible) =>
                  visible ? (
                      <EyeOutlined style={{ color: "white" }} />
                    ) : (
                      <EyeInvisibleOutlined style={{ color: "white" }} />
                    )
                }
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="!font-[Poppins] !text-gray-200 !border-gray-400"
                block
                ghost
                loading={loading}
                style={{
                  borderRadius: 8,
                  letterSpacing: 0.5,
                  fontWeight: 600,
                }}
              >
                Entrar
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </motion.div>
    </div>
  );
}

export default Login;
