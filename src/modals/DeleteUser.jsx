import { Modal, Button, Typography, message } from "antd";
import { useState } from "react";
import supabase,{ deleteUser } from "../utils/supabase"; // tu función para borrar usuario

const { Text } = Typography;

function DeleteUserModal({ open, onClose, userId, refreshList }) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    const {error} = await supabase.from("users").delete().eq("id", userId);
    if(error) return;
    setLoading(false);

    if (error) {
      message.success(`Usuario eliminado correctamente`);
      refreshList(); // si quieres refrescar la lista  de usuarios
      onClose();
    } else {
      message.error("Error al eliminar el usuario");
    }
  };

  return (
    <Modal
      title="Confirmar eliminación"
      open={open}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancelar
        </Button>,
        <Button
          key="delete"
          type="primary"
          danger
          loading={loading}
          onClick={handleDelete}
        >
          Eliminar
        </Button>,
      ]}
    >
      <Text>¿Estás seguro de que quieres eliminar al usuario?</Text>
    </Modal>
  );
}

export default DeleteUserModal;
