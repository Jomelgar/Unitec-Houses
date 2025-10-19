import { useState, useEffect } from "react";
import { Card, Table, Button, Typography, Row, Col, Spin } from "antd";
import Particles from "../components/particles-floating";
import { DeleteOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons";
import supabase from "../utils/supabase";
import AddClass from "../modals/AddClass";
import AddSection from "../modals/AddSection";

const { Text } = Typography;

function Classes() {
  const [classes, setClasses] = useState([]);
  const [sections, setSections] = useState([]);
  const [addClass, setAddClass] = useState(false);
  const [addSection, setAddSection] = useState(false);
  const [loadingClass, setLoadingClass] = useState(false);
  const [loadingSection, setLoadingSection] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDeleteClass = async (id) => {
    const { error } = await supabase.from("classes").update({ active: false }).eq("id", id);
    if (!error) fetchClasses();
  };

  const handleDeleteSection = async (id) => {
    const { error } = await supabase.from("sections").update({ active: false }).eq("id", id);
    if (!error) fetchSections();
  };

  const fetchClasses = async () => {
    setLoadingClass(true);
    const { data } = await supabase.from("classes").select().eq("active", true);
    setClasses(data || []);
    setLoadingClass(false);
  };

  const fetchSections = async () => {
    setLoadingSection(true);
    const { data } = await supabase
      .from("sections")
      .select("id,classes(name),users(email),code,trimester")
      .eq("active", true);
    setSections(data || []);
    setLoadingSection(false);
  };

  useEffect(() => {
    fetchClasses();
    fetchSections();
  }, []);

  const addingClass = async (values) => {
    const { error } = await supabase.from("classes").insert([values]);
    if (!error) fetchClasses();
  };

  const addingSection = async (values) => {
    const { error } = await supabase.from("sections").insert([values]);
    if (!error) fetchSections();
  };

  const colClass = [
    { title: "Clase", dataIndex: "name", key: "name" },
    {
      title: "Acción",
      key: "action",
      render: (_, record) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteClass(record.id)}>
          Eliminar
        </Button>
      ),
    },
  ];

  const colSection = [
    { title: "Clase", key: "class", render: (record) => record.classes?.name || "—" },
    { title: "Usuario", key: "user", render: (record) => record.users?.email || "—" },
    { title: "Sección", dataIndex: "code", key: "code" },
    { title: "Trimestre", dataIndex: "trimester", key: "trimester" },
    {
      title: "Acción",
      key: "action",
      render: (record) => (
        <Button danger icon={<DeleteOutlined />} onClick={() => handleDeleteSection(record.id)}>
          Eliminar
        </Button>
      ),
    },
  ];

  const CardHeader = ({ title, onAdd, onReload }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <Text className="font-[Poppins] font-bold text-2xl">{title}</Text>
      <div className="flex gap-2 justify-end flex-wrap">
        <Button
          icon={<PlusOutlined />}
          className="bg-blue-500 text-white hover:!bg-blue-400"
          onClick={onAdd}
        >
          Añadir
        </Button>
        <Button icon={<ReloadOutlined />} onClick={onReload}>
          Actualizar
        </Button>
      </div>
    </div>
  );

  return (
    <div className="w-full h-full bg-gradient-to-t from-blue-200 to-blue-100 py-8 flex flex-col items-center relative overflow-y-auto">
      <Particles />

      <Row gutter={[32, 32]} className="w-[90%] min-h-[90%] mt-4">
        {/* Clases */}
        <Col xs={24} lg={12}>
          <Card
            className="shadow-lg bg-opacity-80 bg-white md:min-h-[75vh]"
            title={<CardHeader title="Clases" onAdd={() => setAddClass(true)} onReload={fetchClasses} />}
          >
            {loadingClass ? (
              <div className="flex justify-center py-6">
                <Spin />
              </div>
            ) : isMobile ? (
              <div className="flex flex-col gap-3">
                {classes.map((cls) => (
                  <Card
                    key={cls.id}
                    size="small"
                    className="border border-gray-200 shadow-sm rounded-xl "
                  >
                    <div className="flex flex-col">
                      <Text className="font-semibold text-lg">{cls.name}</Text>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        className="mt-2"
                        onClick={() => handleDeleteClass(cls.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Table
                columns={colClass}
                dataSource={classes.map((c) => ({ ...c, key: c.id }))}
                pagination={{ pageSize: 8, position: ["bottomCenter"] }}
                bordered
              />
            )}
          </Card>
        </Col>

        {/* Secciones */}
        <Col xs={24} lg={12}>
          <Card
            className="shadow-lg bg-opacity-80 bg-white md:min-h-[75vh]"
            title={
              <CardHeader
                title="Secciones"
                onAdd={() => setAddSection(true)}
                onReload={fetchSections}
              />
            }
          >
            {loadingSection ? (
              <div className="flex justify-center py-6">
                <Spin />
              </div>
            ) : isMobile ? (
              <div className="flex flex-col gap-3">
                {sections.map((sec) => (
                  <Card
                    key={sec.id}
                    size="small"
                    className="border border-gray-200 shadow-sm rounded-xl"
                  >
                    <div className="flex flex-col gap-1">
                      <Text>
                        <b>Clase:</b> {sec.classes?.name || "—"}
                      </Text>
                      <Text>
                        <b>Usuario:</b> {sec.users?.email || "—"}
                      </Text>
                      <Text>
                        <b>Sección:</b> {sec.code}
                      </Text>
                      <Text>
                        <b>Trimestre:</b> {sec.trimester}
                      </Text>
                      <Button
                        danger
                        icon={<DeleteOutlined />}
                        className="mt-2"
                        onClick={() => handleDeleteSection(sec.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Table
                columns={colSection}
                dataSource={sections.map((s) => ({ ...s, key: s.id }))}
                pagination={{ pageSize: 8, position: ["bottomCenter"] }}
                bordered
              />
            )}
          </Card>
        </Col>
      </Row>

      {/* Modales */}
      <AddClass open={addClass} close={() => setAddClass(false)} onAdd={addingClass} />
      <AddSection
        open={addSection}
        close={() => setAddSection(false)}
        classes={classes}
        onAdd={addingSection}
      />
    </div>
  );
}

export default Classes;
