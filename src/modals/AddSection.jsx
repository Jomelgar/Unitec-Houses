import { useEffect, useState } from "react";
import { Modal, Typography, Divider, Form, Input, Button, message, Select } from "antd";
import supabase from "../utils/supabase";

const { Title } = Typography;
const trimester = ['Q1','Q2','Q3','Q4'];

function AddSection({ open, close, onAdd,classes }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const[users,setUsers] = useState([]);

  const fetchUsers = async()=>{
    const {data} = await supabase.from("users").select();
    setUsers(data);
  }

  useEffect(()=> {fetchUsers()},[]);
  const handleFinish = async (values) => {
    setLoading(true);
    try {
      onAdd(values);

      message.success("Clase añadida correctamente 🎉");
      form.resetFields();
      close();
    } catch (error) {
      message.error("Error al añadir la clase");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={()=>{ form.resetFields(); close();}}
      footer={null}
      centered
      className="!rounded-2xl"
      title={
        <>
          <Title level={3} className="!font-[Poppins] !mb-0">
            Añadir Sección
          </Title>
          <Divider className="!mt-2 !mb-3" />
        </>
      }
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        autoComplete="off"
      >
        <Form.Item
          name="code"
          label="Código de Sección"
          rules={[{ required: true, message: "Por favor, ingresa el código." }]}
        >
          <Input type="number" placeholder="Ejemplo: 111,1222s..." />
        </Form.Item>
        <Form.Item
          name='id_class'
          label='Clase'
          rules={[{ required: true, message: "Por favor, ingresa la clase." }]}
        >
          <Select placeholder="Clase">
            {classes.map((item)=>(
              <Select.Option key={item.id}>
                {item.name}
              </Select.Option>
            ))} 
          </Select>
        </Form.Item>
        <Form.Item
          name='id_user'
          label='Usuario'
          rules={[{ required: true, message: "Por favor, ingresa el usuario." }]}
        >
          <Select placeholder="Usuario">
            {users.map((item)=>(
              <Select.Option key={item.id}>
                {item.email}
              </Select.Option>
            ))} 
          </Select>
        </Form.Item>
        <Form.Item
          name='trimester'
          label='Trimestre'
          rules={[{ required: true, message: "Por favor, ingresa el trimestre." }]}
        >
          <Select placeholder="Ej Q1, Q2, Q3...">
            {trimester.map((i)=>(
              <Select.Option key={i}>
                {i}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <div className="flex justify-end gap-3 mt-4">
          <Button onClick={close}>Cancelar</Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            className="bg-blue-500 hover:!bg-blue-400"
          >
            Guardar
          </Button>
        </div>
      </Form>
    </Modal>
  );
}

export default AddSection;
