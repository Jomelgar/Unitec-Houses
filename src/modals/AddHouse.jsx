import { useState } from "react";
import { Modal, Form, Input, Button, Upload, Radio, Typography, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import supabase from "../utils/supabase";

const { Title } = Typography;

function AddHouse({ open, close, refresh }) {
  const [form] = Form.useForm();
  const [uploadType, setUploadType] = useState("url");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return null;
    try {
      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          const base64String = reader.result.split(",")[1];
          resolve(base64String);
        };
        reader.onerror = (error) => reject(error);
      });

      // Enviar al flujo de Power Automate
      const resp = await fetch(import.meta.env.VITE_SEND_PHOTO, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          fileContent: base64,
        }),
      });

      const data = await resp.json();

      if (!data.shareUrl) throw new Error("No se recibió URL del flujo");
      return data.shareUrl + "?download=1";
    } catch (err) {
      console.error("Error al subir la imagen:", err);
      message.error("Error al subir la imagen 😕");
      return null;
    }
  };


  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      let photoURL = values.photoURL;
      if (uploadType === "file") {
        photoURL = await handleUpload();
        if (!photoURL) throw new Error("No se pudo subir la imagen");
      }

      const { error } = await supabase.from("house").insert([
        {
          name: values.name,
          photoURL,
          points: 0,
        },
      ]);

      if (error) throw error;

      message.success("Casa creada correctamente 🎉");
      form.resetFields();
      setFile(null);
      close();
      refresh();
    } catch (error) {
      console.error(error);
      message.error("Error al crear la casa");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onCancel={close}
      title={<Title level={3} className="!font-[Poppins]">Agregar Casa</Title>}
      footer={[
        <Button key="cancel" onClick={close}>Cancelar</Button>,
        <Button
          key="submit"
          type="primary"
          loading={loading}
          onClick={handleSubmit}
        >
          Guardar
        </Button>,
      ]}
    >
      <Form layout="vertical" form={form} className="!font-[Poppins]">
        <Form.Item
          label="Nombre de la Casa"
          name="name"
          rules={[{ required: true, message: "Por favor ingresa el nombre" }]}
        >
          <Input placeholder="Ej. Gryffindor" />
        </Form.Item>

        <Form.Item label="Tipo de Imagen" name="type">
          <Radio.Group
            onChange={(e) => setUploadType(e.target.value)}
            value={uploadType}
          >
            <Radio value="url">Usar URL</Radio>
            <Radio value="file">Subir Imagen</Radio>
          </Radio.Group>
        </Form.Item>

        {uploadType === "url" ? (
          <Form.Item
            label="URL de la Imagen"
            name="photoURL"
            rules={[{ required: true, message: "Por favor ingresa la URL" }]}
          >
            <Input placeholder="https://..." />
          </Form.Item>
        ) : (
          <Form.Item
            label="Subir Imagen"
            name="file"
            rules={[{ required: true, message: "Por favor sube una imagen" }]}
          >
            <Upload
              beforeUpload={(file) => {
                const isImage = file.type.startsWith("image/");
                const isValidExtension = /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name);

                if (!isImage || !isValidExtension) {
                  message.error("Solo se permiten imágenes (JPG, PNG, GIF, WEBP)");
                  return Upload.LIST_IGNORE; // evita que se agregue al listado
                }

                setFile(file);
                return false; // evita subida automática
              }}
              fileList={file ? [file] : []}
              onRemove={() => setFile(null)}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Seleccionar Imagen</Button>
            </Upload>
          </Form.Item>
        )}
      </Form>
    </Modal>
  );
}

export default AddHouse;
