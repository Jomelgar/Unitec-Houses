import { useState } from "react";
import { Modal, Typography, Divider, Form, Input, Button, message } from "antd";

const { Title } = Typography;

function AddClass({ open, close, onAdd }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

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
      onCancel={()=>{form.resetFields(); close();}}
      footer={null}
      centered
      className="!rounded-2xl"
      title={
        <>
          <Title level={3} className="!font-[Poppins] !mb-0">
            Añadir Clase
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
          name="name"
          label="Nombre de la Clase"
          rules={[{ required: true, message: "Por favor, ingresa un nombre." }]}
        >
          <Input placeholder="Ejemplo: Matemáticas, Programación..." />
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

export default AddClass;
