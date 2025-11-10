import { useEffect, useState } from "react";
import { Modal, List, Avatar, Button, Typography, message, Spin } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import supabase from "../utils/supabase";

const { Text, Title } = Typography;

function Calification({ weekId, open, onClose, refreshList, onlyView}) {
  const [weekData, setWeekData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchCalification = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("califications")
        .select("id, points, id_house(photoURL, name)")
        .eq("id_week", weekId).eq('approved','En Proceso');

      if (error) throw error;
      setWeekData(data || []);
    } catch (err) {
      console.error(err);
      message.error("Error al cargar calificaciones.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && weekId) {
      fetchCalification();
    }
  }, [open, weekId]);

  const handleDecisionAll = async (decision) => {
    try {
      setProcessing(true);
      const status = decision === "aceptar" ? "Aceptada" : "Rechazada";

      const { error } = await supabase
        .from("califications")
        .update({ approved: status })
        .eq("id_week", weekId);

      if (error) throw error;

      const {error: weekError} = await supabase.from("weeks").update({status: status}).eq("id", weekId);
        if (weekError) throw weekError;
      

      await refreshList();
      onClose();

    } catch (err) {
      console.error(err);
      message.error("Error al actualizar las calificaciones.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Modal
      title={<Title level={4}>Calificaciones de la Semana</Title>}
      open={open}
      onCancel={onClose}
      footer={[
        <Button
          key="reject"
          danger
          icon={<CloseOutlined />}
          loading={processing}
          onClick={() => handleDecisionAll("rechazar")}
        >
          Rechazar todas
        </Button>,
        <Button
          key="accept"
          type="primary"
          icon={<CheckOutlined />}
          loading={processing}
          onClick={() => handleDecisionAll("aceptar")}
        >
          Aceptar todas
        </Button>,
      ]}
      width={600}
    >
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={weekData}
          locale={{ emptyText: "No hay calificaciones registradas." }}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={item.id_house?.photoURL}
                    size={56}
                    shape="square"
                    style={{ border: "2px solid #1890ff" }}
                  />
                }
                title={<Text strong>{item.id_house?.name}</Text>}
                description={<Text>Puntos propuestos: {item.points}</Text>}
              />
            </List.Item>
          )}
        />
      )}
    </Modal>
  );
}

export default Calification;
