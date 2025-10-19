import { useState, useEffect } from "react";
import { Card, Table, Button, Typography, Modal, Form, Input, message } from "antd";
import Particles from "../components/particles-floating";
import Cookies from "js-cookie";
import supabase,{createUser} from "../utils/supabase";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import DeleteUserModal from "../modals/DeleteUser";

const { Title } = Typography;

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [selectedUserId,setSelectedUserId] = useState(null);
  const [form] = Form.useForm();
  const [creating, setCreating] = useState(false);

  // 🔹 Cargar usuarios desde Supabase
  const fetchUsers = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("users").select("*").neq("id", Cookies.get("user"));
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

  const handleEdit = async (userId,admin) => {
    const {error} = await supabase.from("users").update({admin: !admin}).eq("id",userId);
    if(!error) {
      fetchUsers();
    }
  }
  const handleCreateUser = async (values) => {
    setCreating(true);
    try {
      const user = await createUser(values.email, values.password);
      const { error } = await supabase.from("users").insert([
        {
          id: user.data.user.id,
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
        },
      ]);
      if (error) throw error;
      
      const url = window.location.origin + "/login";
      await fetch(import.meta.env.VITE_SEND_EMAIL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: values.first_name,
          last_name: values.last_name,
          email: values.email,
          password: values.password,
          url: url
        }),
      });

      form.resetFields();
      setModalVisible(false);
      fetchUsers();
    } catch (err) {
      console.error(err);
      message.error("Error al crear usuario");
    } finally {
      setCreating(false);
    }
  };

  // 🔹 Columnas de la tabla
  const columns = [
    {
      title: "Nombre",
      dataIndex: "first_name",
      key: "first_name",
    },
    {
      title: "Apellido",
      dataIndex: "last_name",
      key: "last_name",
    },
    {
      title: "Correo",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Acciones",
      render: (record) => (
        <div className="gap-2 flex items-center">
          <Button
            type="link" 
            icon={<EditOutlined/>}
            className="bg-blue-500 !text-white hover:!text-blue-500 hover:scale-105"
            onClick={()=>{ 
              handleEdit(record.id, record.admin);
            }}
          >
            {record.admin ? "Quitar permisos": "Dar permisos"}
          </Button>
          <Button
            type="link" 
            onClick={() => {
              const userId = record.id;
              setSelectedUserId(userId); 
              setDeleteModal(true);
            }}
            icon={<DeleteOutlined/>}
            className="bg-red-500 !text-white hover:!text-red-500 hover:scale-105 hover:!border-red-400"
          >
            Eliminar
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="w-full h-full bg-gradient-to-t from-blue-200 to-blue-100 py-8 flex flex-col items-center relative overflow-y-auto">
      <Particles/>
      <Card
        title={<Title level={3}>Usuarios</Title>}
        style={{ width: "90%", maxWidth: 900 }}
        className="shadow-2xl"
        extra={
          <Button icon={<PlusOutlined/> } className="!font-[Poppins]" type="primary" onClick={() => setModalVisible(true)}>
            Añadir usuario
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={users.map((u) => ({ ...u, key: u.id }))}
          loading={loading}
          pagination={{ pageSize: 5,position: ["bottomCenter"] }}
        />
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

      <DeleteUserModal open={deleteModal} onClose={() => setDeleteModal(false)} userId={selectedUserId} refreshList={fetchUsers}/>
    </div>
  );
}

export default Users;
