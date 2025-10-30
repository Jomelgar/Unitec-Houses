import { Modal, InputNumber, Button, Typography, Space, message, Avatar } from "antd";
import { useState, useEffect } from "react";
import supabase from "../utils/supabase";

const { Text, Title } = Typography;

function EditPoints({ open, onClose, fetchHouses }) {
  const [points, setPoints] = useState(0);
  const [house, setHouse] = useState();
  const [loading, setLoading] = useState(false);

  const fetchHouse = async() => {
    if(open === null) return;
    const {data,error} = await supabase.from("house").select().eq("id",open).single();
    if(error) console.log(error);
    setHouse(data);
  };

  useEffect(()=> {fetchHouse()},[open]);
  useEffect(() => {
    if (house) setPoints(house.points || 0);
    
  }, [house]);

  const updateHouse = async () => {
    if (!house) return;
    if (points < 0) {
      message.warning("Los puntos no pueden ser negativos.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from("house")
        .update({ points })
        .eq("id", house.id);

      if (error) throw error;

      message.success("Puntos actualizados correctamente 🎉");
      await fetchHouses();
      onClose();
    } catch (err) {
      console.error(err);
      message.error("Error al actualizar los puntos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={<Title level={4} className="!m-0 text-center">Editar Puntos</Title>}
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      destroyOnClose
    >
      {house ? (
        <div className="flex flex-col items-center gap-4 py-4">
          {/* Imagen de la casa */}
          <Avatar
            src={house.photoURL}
            size={100}
            className="border border-gray-300 shadow-md"
          />

          {/* Nombre */}
          <Text strong className="text-lg">{house.name}</Text>

          {/* Puntos actuales */}
          <Text type="secondary">Puntos actuales: {house.points}</Text>

          {/* Campo para editar puntos */}
          <Space direction="vertical" align="center" className="mt-3 w-full">
            <Text>Nuevo valor de puntos:</Text>
            <InputNumber
              min={0}
              max={99999}
              value={points}
              onChange={(value) => setPoints(value)}
              className="w-1/2 text-center"
            />
          </Space>

          {/* Botones */}
          <div className="flex justify-center gap-3 mt-5">
            <Button onClick={onClose}>Cancelar</Button>
            <Button
              type="primary"
              loading={loading}
              onClick={updateHouse}
            >
              Guardar Cambios
            </Button>
          </div>
        </div>
      ) : (
        <Text type="secondary">No hay información de la casa seleccionada.</Text>
      )}
    </Modal>
  );
}

export default EditPoints;
