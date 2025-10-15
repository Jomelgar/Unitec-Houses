import { useState } from "react";
import { Card, Typography, Button, Input, Form } from "antd";
import supabase from "../utils/supabase";
import { MailOutlined, LockOutlined, UserOutlined, EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);

    // Crear el usuario en Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email: values.email,
      password: values.password,
    });

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    // Si se creó correctamente, guardar en la tabla "users"
    if (data.user) {
      await supabase.from("users").insert([
        {
          id: data.user.id,
          email: values.email,
          first_name: values.first_name,
          last_name: values.last_name,
        },
      ]);
    }

    setTimeout(() => setLoading(false), 1500);
    navigate("/login");
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

      {/* 🌫️ Fondo y niebla */}
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

      {/* 🌫 Efecto niebla dinámica */}
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

      {/* 💎 Tarjeta de Registro */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="z-10"
      >
        <Card
          className="shadow-2xl backdrop-blur-lg"
          style={{
            width: 420,
            backgroundColor: "rgba(255,255,255,0.3)",
            border: "1px solid rgba(255,255,255,0.2)",
            textAlign: "center",
            borderRadius: 16,
          }}
        >
          <Title
            className="flex flex-col justify-center items-center"
            level={2}
            style={{ color: "white", marginBottom: 10, fontFamily: "Poppins" }}
          >
            <img className="h-12 mb-4 cursor-pointer" alt="" src="/UT2.png" onClick={() => navigate("/")}/> Regístrate
          </Title>
          <Text style={{ color: "#ffffffff" }}>
            Únete a <b>Unitec Houses</b> y vive la magia 💫
          </Text>

          <Form
            name="register"
            layout="vertical"
            onFinish={onFinish}
            className="mt-6"
            requiredMark={false}
          >
            {/* Nombre */}
            <Form.Item
              name="first_name"
              rules={[{ required: true, message: "Ingresa tu nombre" }]}
            >
              <Input
                prefix={<UserOutlined className="text-white" />}
                placeholder="Nombre"
                size="large"
                className="text-white !font-[Poppins]"
                style={{
                  borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
            </Form.Item>

            {/* Apellido */}
            <Form.Item
              name="last_name"
              rules={[{ required: true, message: "Ingresa tu apellido" }]}
            >
              <Input
                prefix={<UserOutlined className="text-white" />}
                placeholder="Apellido"
                size="large"
                className="text-white !font-[Poppins]"
                style={{
                  borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
            </Form.Item>

            {/* Email */}
            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Ingresa tu correo" },
                { type: "email", message: "Correo inválido" },
              ]}
            >
              <Input
                prefix={<MailOutlined className="text-white" />}
                placeholder="Correo electrónico"
                size="large"
                className="text-white !font-[Poppins]"
                style={{
                  borderRadius: 8,
                  backgroundColor: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
            </Form.Item>

            {/* Contraseña */}
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Ingresa tu contraseña" }]}
            >
              <Input.Password
                prefix={<LockOutlined className="text-white" />}
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

            {/* Botón */}
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
                Crear cuenta
              </Button>
            </Form.Item>
          </Form>

          <Text className="!font-[Poppins]" style={{ color: "#ffffffff" }}>
            ¿Ya tienes cuenta?{" "}
            <Button
              type="link"
              className="!font-[Poppins]"
              style={{ padding: 0, color: "#013385ff" }}
              onClick={() => navigate("/login")}
            >
              Inicia sesión
            </Button>
          </Text>
        </Card>
      </motion.div>
    </div>
  );
}

export default Register;
