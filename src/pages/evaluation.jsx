import { useState, useEffect } from "react";
import { Card, Table, Button, Typography, message, Tag, Divider, Empty } from "antd";
import { EyeOutlined, ReloadOutlined, ClockCircleOutlined, CheckCircleOutlined } from "@ant-design/icons";
import Particles from "../components/particles-floating";
import supabase from "../utils/supabase";
import Calification from "../modals/Calification";

const { Title, Text } = Typography;

function Evaluation() {
  const [weeks, setWeeks] = useState([]);
  const [otherWeeks, setOtherWeeks] = useState([]);
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

      const { data: oldData, error: oldError } = await supabase
        .from("weeks")
        .select("id, id_section(id, code, id_user(email)), week, status")
        .neq("status", "En Proceso");

      if (oldError) throw oldError;
      setOtherWeeks(oldData || []);
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
      render: (week) => <Tag color="blue">Semana {week}</Tag>,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) =>
        status === "En Proceso" ? (
          <Tag icon={<ClockCircleOutlined />} color="orange">
            En Proceso
          </Tag>
        ) : (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Finalizado
          </Tag>
        ),
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

   const otherColumns = [
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
      render: (week) => <Tag color="blue">Semana {week}</Tag>,
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (status) =>
        status === "En Proceso" ? (
          <Tag icon={<ClockCircleOutlined />} color="orange">
            En Proceso
          </Tag>
        ) : (
          <Tag icon={<CheckCircleOutlined />} color="green">
            Finalizado
          </Tag>
        ),
    },
  ];

  const renderCardList = (list) => {
    if (list.length === 0) return <Empty description="No hay semanas disponibles" />;
    return (
      <div className="flex flex-col gap-4">
        {list.map((week) => (
          <Card
            key={week.id}
            className="!rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all"
          >
            <div className="flex flex-col gap-1">
              <Text><b>Usuario:</b> {week.id_section?.id_user?.email || "—"}</Text>
              <Text><b>Sección:</b> {week.id_section?.code || "—"}</Text>
              <Text><b>Semana:</b> {week.week}</Text>
              <Tag
                className="self-start mt-1"
                color={week.status === "En Proceso" ? "orange" : "green"}
              >
                {week.status}
              </Tag>
              {week.status ===  "En Proceso" && 
                <Button
                type="primary"
                block
                className="mt-3"
                icon={<EyeOutlined />}
                onClick={() => handleView(week)}
              >
                Ver Detalles
              </Button>
              }
            </div>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-t from-blue-200 to-blue-100 py-10 flex flex-col items-center relative overflow-y-auto">
      <Particles />

      {/* SECCIÓN: En proceso */}
      <Card className="w-11/12 md:w-3/4 shadow-2xl rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm mb-10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <Title level={3} className="!m-0 text-center sm:text-left">
            Semanas en Proceso
          </Title>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchWeeks}
            loading={loading}
            type="default"
            className="border-blue-400 text-blue-500 hover:!bg-blue-100"
          >
            Actualizar
          </Button>
        </div>

        {isMobile ? renderCardList(weeks) : (
          <Table
            columns={columns}
            dataSource={weeks.map((w) => ({ ...w, key: w.id }))}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 6, position: ["bottomCenter"] }}
          />
        )}
      </Card>

      {/* SECCIÓN: Finalizadas */}
      <Card className="w-11/12 md:w-3/4 shadow-2xl rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mb-4">
          <Title level={3} className="!m-0 text-center sm:text-left text-green-600">
            Semanas Evaluadas
          </Title>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchWeeks}
            loading={loading}
            type="default"
            className="border-green-400 text-green-600 hover:!bg-green-100"
          >
            Actualizar
          </Button>
        </div>

        {isMobile ? renderCardList(otherWeeks) : (
          <Table
            columns={otherColumns}
            dataSource={otherWeeks.map((w) => ({ ...w, key: w.id }))}
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
