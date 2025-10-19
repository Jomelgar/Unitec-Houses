import { useState, useEffect } from "react";
import Particles from "../components/particles-floating";
import { Button, Card, Table, Typography, Row, Col, message } from "antd";
import { DeleteOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import supabase from "../utils/supabase";
import AddHouse from "../modals/AddHouse";

const { Title, Text } = Typography;

function Houses() {
  const [addHouse, setAddHouse] = useState(false);
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Detectar tamaño de pantalla dinámicamente
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchHouses = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("house")
      .select("id, name, photoURL, points");
    if (error) console.error(error);
    else setHouses(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleDelete = async (houseId) => {
    setLoading(true);
    const { error } = await supabase.from("house").delete().eq("id", houseId);
    if (!error) {
      message.success("Casa eliminada correctamente");
      fetchHouses();
    } else {
      console.error(error);
      message.error("Error al eliminar la casa");
    }
  };

  const handleReset = async (houseId) => {
    setLoading(true);
    const { error } = await supabase.from("house").update({ points: 0 }).eq("id", houseId);
    if (!error) {  fetchHouses();}
  };
  // Columnas para la tabla (modo desktop)
  const columns = [
    {
      title: "Escudo",
      dataIndex: "photoURL",
      key: "photoURL",
      render: (url) => (
        <img
          className="w-12 h-12 rounded-full object-cover"
          src={url}
          alt="Foto de la Casa"
        />
      ),
    },
    { title: "Nombre de la Casa", dataIndex: "name", key: "name" },
    { title: "Puntaje", dataIndex: "points", key: "points" },
    {
      title: "Acciones",
      key: "actions",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            onClick={() => handleDelete(record?.id)}
            icon={<DeleteOutlined />}
            className="!font-[Poppins] hover:scale-105 text-white bg-red-400 hover:!bg-red-600 hover:!text-white hover:!border-red-800"
          >
            Eliminar
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => handleReset(house.id)}
          >
            Reiniciar
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-t from-blue-200 to-blue-100 py-8 flex flex-col items-center relative overflow-y-auto">
      <Particles />
      <Card
        className="w-11/12 max-w-5xl shadow-lg rounded-lg bg-white bg-opacity-80"
        title={
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <Title level={3} className="!font-[Poppins] m-0">
              Gestión de Casas
            </Title>
            <div className="flex flex-wrap gap-2">
              <Button
                icon={<PlusOutlined />}
                type="primary"
                className="!font-[Poppins]"
                onClick={() => setAddHouse(true)}
              >
                Agregar Casa
              </Button>
              <Button
                icon={<ReloadOutlined />}
                className="!font-[Poppins]"
                onClick={fetchHouses}
              >
                Actualizar
              </Button>
            </div>
          </div>
        }
      >
        {/* Desktop: tabla normal */}
        {!isMobile ? (
          <Table
            className="!font-[Poppins]"
            loading={loading}
            columns={columns}
            dataSource={houses}
            pagination={{ pageSize: 5, position: ["bottomCenter"] }}
            rowKey="id"
          />
        ) : (
          // Móvil: cada casa como Card
          <Row gutter={[16, 16]}>
            {houses.map((house) => (
              <Col xs={24} key={house.id}>
                <Card
                  className="!font-[Poppins] shadow-md"
                  cover={
                    <img
                      alt="Casa"
                      src={house.photoURL}
                      className="h-40 object-cover rounded-t-lg"
                    />
                  }
                  actions={[
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDelete(house.id)}
                    >
                      Eliminar
                    </Button>,
                    <Button
                      icon={<ReloadOutlined />}
                      onClick={() => handleReset(house.id)}
                    >
                      Reiniciar
                    </Button>
                  ]}
                >
                  <Text strong>Nombre:</Text> {house.name} <br />
                  <Text strong>Puntaje:</Text> {house.points}
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </Card>

      <AddHouse open={addHouse} close={() => setAddHouse(false)} refresh={fetchHouses} />
    </div>
  );
}

export default Houses;
