import { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Typography,
  Modal,
  Form,
  Input,
  message,
} from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Particles from "../components/particles-floating";
import Cookies from "js-cookie";
import supabase, { createUser } from "../utils/supabase";
import DeleteUserModal from "../modals/DeleteUser";

const { Title, Text } = Typography;

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [form] = Form.useForm();
  const [creating, setCreating] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // 🔹 Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Cargar usuarios
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .neq("id", Cookies.get("user"));
    if (error) {
      message.error("Error al cargar usuarios");
      console.error(error);
    } else {
      setUsers(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Cambiar permisos de admin
  const handleEdit = async (userId, admin) => {
    const { error } = await supabase
      .from("users")
      .update({ admin: !admin })
      .eq("id", userId);
    if (!error) {
      message.success("Permisos actualizados");
      fetchUsers();
    }
  };

  // 🔹 Crear nuevo usuario
  const handleCreateUser = async (values) => {
  setCreating(true);
  try {
    // 1️⃣ Crear usuario en Supabase Auth (o reutilizar existente)
    const result = await createUser(values.email, values.password);
    const userId = result.id;

    // 2️⃣ Intentar insertar en la tabla "users" solo si no existe
    const { data: existing, error: selectError } = await supabase
      .from("users")
      .select("id")
      .eq("id", userId)
      .single();

    if (selectError && selectError.code !== "PGRST116") {
      // PGRST116 = "No rows found" (normal si el usuario no existe)
      throw selectError;
    }

    if (!existing) {
      const { error: insertError } = await supabase.from("users").insert([
        {
          id: userId,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
        },
      ]);
      if (insertError) throw insertError;
    }

    // 3️⃣ Enviar correo (solo si es un usuario nuevo)
    if (!result.alreadyExists) {
      const url = `${window.location.origin}/login`;
      await fetch(import.meta.env.VITE_SEND_EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
          url,
        }),
      });
    }

    // 4️⃣ Limpieza de formulario y feedback
    form.resetFields();
    setModalVisible(false);
    fetchUsers();

    message.success(
      result.alreadyExists
        ? "El usuario ya existía, se reutilizó el registro"
        : "Usuario creado con éxito"
    );
  } catch (err) {
    console.error(err);
    message.error("Error al crear usuario");
  } finally {
    setCreating(false);
  }
};


  // 🔹 Columnas para vista escritorio
  const columns = [
    { title: "Nombre", dataIndex: "first_name", key: "first_name" },
    { title: "Apellido", dataIndex: "last_name", key: "last_name" },
    { title: "Correo", dataIndex: "email", key: "email" },
    {
      title: "Acciones",
      render: (record) => (
        <div className="gap-2 flex items-center">
          <Button
            type="link"
            icon={<EditOutlined />}
            className="bg-blue-500 !text-white hover:!text-blue-500 hover:scale-105"
            onClick={() => handleEdit(record.id, record.admin)}
          >
            {record.admin ? "Quitar permisos" : "Dar permisos"}
          </Button>
          <Button
            type="link"
            onClick={() => {
              setSelectedUserId(record.id);
              setDeleteModal(true);
            }}
            icon={<DeleteOutlined />}
            className="bg-red-500 !text-white hover:!text-red-500 hover:scale-105 hover:!border-red-400"
          >
            Eliminar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-t from-blue-200 to-blue-100 py-8 flex flex-col items-center relative overflow-y-auto">
      <Particles />

      <Card
        style={{ width: "90%", maxWidth: 900 }}
        className="shadow-lg rounded-lg bg-white bg-opacity-80"
        title={
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Title
              level={3}
              className="!font-[Poppins] !text-xl sm:!text-2xl m-0 text-center sm:text-left"
            >
              Gestión de Usuarios
            </Title>

            {/* 🔹 Botones responsive */}
            <div className="flex flex-wrap justify-center sm:justify-end gap-2">
              <Button
                icon={<PlusOutlined />}
                type="primary"
                className="!font-[Poppins] text-white bg-blue-500 hover:!bg-blue-400 hover:!text-white"
                onClick={() => setModalVisible(true)}
              >
                Añadir Usuario
              </Button>
              <Button
                icon={<ReloadOutlined />}
                className="!font-[Poppins]"
                onClick={fetchUsers}
                loading={loading}
              >
                Actualizar
              </Button>
            </div>
          </div>
        }
      >
        {/* Vista móvil: tarjetas */}
        {isMobile ? (
          <div className="flex flex-col gap-4">
            {users.map((user) => (
              <Card
                key={user.id}
                className="!rounded-xl shadow-md border border-gray-200"
              >
                <div className="flex flex-col gap-2">
                  <Text>
                    <b>Nombre:</b> {user.first_name} {user.last_name}
                  </Text>
                  <Text>
                    <b>Correo:</b> {user.email}
                  </Text>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="primary"
                      block
                      onClick={() => handleEdit(user.id, user.admin)}
                      icon={<EditOutlined />}
                    >
                      {user.admin ? "Quitar permisos" : "Dar permisos"}
                    </Button>
                    <Button
                      danger
                      block
                      onClick={() => {
                        setSelectedUserId(user.id);
                        setDeleteModal(true);
                      }}
                      icon={<DeleteOutlined />}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          // 💻 Vista escritorio: tabla
          <Table
            columns={columns}
            dataSource={users.map((u) => ({ ...u, key: u.id }))}
            loading={loading}
            pagination={{ pageSize: 5, position: ["bottomCenter"] }}
          />
        )}
      </Card>

      {/* Modal de crear usuario */}
      <Modal
        title="Crear Usuario"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateUser}>
          <Form.Item
            name="first_name"
            label="Nombre"
            rules={[{ required: true, message: "Ingresa el nombre" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Nombre" />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Apellido"
            rules={[{ required: true, message: "Ingresa el apellido" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Apellido" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Correo"
            rules={[
              { required: true, message: "Ingresa el correo" },
              { type: "email", message: "Correo inválido" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Correo" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Contraseña"
            rules={[{ required: true, message: "Ingresa la contraseña" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Contraseña"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={creating}>
              Crear usuario
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal eliminar */}
      <DeleteUserModal
        open={deleteModal}
        onClose={() => setDeleteModal(false)}
        userId={selectedUserId}
        refreshList={fetchUsers}
      />
    </div>
  );
}

export default Users;
