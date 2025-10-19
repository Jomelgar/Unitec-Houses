import { useState, useEffect } from "react";
import { Card, Table, Button, Typography, message } from "antd";
import { EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import Particles from "../components/particles-floating";
import supabase from "../utils/supabase";
import Calification from "../modals/Calification";

const { Title, Text } = Typography;

function Evaluation() {
  const [weeks, setWeeks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detectar tamaño de pantalla
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchWeeks = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("weeks")
        .select("id, id_section(id, code, id_user(email)), week, status")
        .eq("status", "En Proceso");
      if (error) throw error;
      setWeeks(data || []);
    } catch (err) {
      message.error("Error al cargar las semanas.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeeks();
  }, []);

  const handleView = (record) => {
    setSelectedWeek(record.id);
  };

  const columns = [
    {
      title: "Usuario",
      dataIndex: ["id_section", "id_user", "email"],
      key: "user",
      align: "center",
    },
    {
      title: "Sección",
      dataIndex: ["id_section", "code"],
      key: "section",
      align: "center",
    },
    {
      title: "Semana",
      dataIndex: "week",
      key: "week",
      align: "center",
    },
    {
      title: "Acciones",
      key: "actions",
      align: "center",
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleView(record)}
        >
          Ver
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-t from-blue-200 to-blue-100 py-8 flex flex-col items-center relative overflow-y-auto">
      <Particles />

      <Card className="w-11/12 md:w-3/4 shadow-lg rounded-2xl">
        {/* Título y botón responsive */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <Title level={3} className="!m-0 text-center sm:text-left">
            Semanas en Proceso
          </Title>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchWeeks}
            loading={loading}
            className="!self-center"
          >
            Actualizar
          </Button>
        </div>

        {isMobile ? (
          // Vista móvil: tarjetas
          <div className="flex flex-col gap-4">
            {weeks.map((week) => (
              <Card key={week.id} className="!rounded-xl shadow-md border border-gray-200 flex-col flex">
                <Text className="block mb-1">
                  <b>Usuario:</b> {week.id_section?.id_user?.email || "—"}
                </Text>
                <Text className="block mb-1">
                  <b>Sección:</b> {week.id_section?.code || "—"}
                </Text>
                <Text className="block mb-1">
                  <b>Semana:</b> {week.week}
                </Text>
                <Button
                  type="primary"
                  block
                  className="mt-2"
                  icon={<EyeOutlined />}
                  onClick={() => handleView(week)}
                >
                  Ver
                </Button>
              </Card>
            ))}
          </div>
        ) : (
          // Vista escritorio: tabla
          <Table
            columns={columns}
            dataSource={weeks.map((w) => ({ ...w, key: w.id }))}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 6, position: ["bottomCenter"] }}
          />
        )}
      </Card>

      {/* Modal de calificación */}
      <Calification
        open={selectedWeek !== null}
        weekId={selectedWeek}
        onClose={() => setSelectedWeek(null)}
        refreshList={fetchWeeks}
      />
    </div>
  );
}

export default Evaluation;
