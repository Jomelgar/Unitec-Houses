import { useState, useEffect } from "react";
import { Card, Table, Button, Typography, Divider, Row, Col } from "antd";
import Particles from "../components/particles-floating";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import supabase from "../utils/supabase";
import AddClass from "../modals/AddClass";
import AddSection from "../modals/AddSection";
import { title } from "framer-motion/client";

const { Text } = Typography;

function Classes() {
  const [classes, setClasses] = useState([]);
  const[sections,setSections] = useState([]);
  const [addClass, setAddClass] = useState(false);
  const [loadingClass, setLoadingClass] = useState(false);
  const [addSection, setAddSection] = useState(false);
  const [loadingSection, setLoadingSection] = useState(false);

  const handleDeleteClass = async(id)=>{
    const {error} = await supabase.from('classes').update({active: false}).eq('id',id);
    if(!error) fetchClasses();
  };

  const handleDeleteSection = async(id)=>{
    const {error} = await supabase.from('sections').update({active: false}).eq('id',id);
    if(!error) fetchSections();
  };

  const fetchSections = async() =>{
    setLoadingSection(true);
    const {data} = await supabase.from('sections').select('id,classes(name),users(email),code,trimester').eq('active',true);
    setSections(data);
    setLoadingSection(false);
  }
  const fetchClasses = async()=>{
    setLoadingClass(true);
    const {data} = await supabase.from('classes').select().eq('active',true);
    setClasses(data);
    setLoadingClass(false);
  }

  useEffect(() => {fetchClasses(); fetchSections()}, []);

  const addingClass = async (values) => {
    const {error} = await supabase.from('classes').insert([values]);
    if(!error)fetchClasses();
  };

  const addingSection = async(values)=>{
    const {error} = await supabase.from('sections').insert([values]);
    if(!error)fetchSections();
    else console.log(error);
  }

  const colClass = [
    { title: "Clase", dataIndex: "name", key: "name" },
    {
      title: "Acción",
      key: "action",
      render: (_,record) => (
        <Button danger icon={<DeleteOutlined />} className="!font-[Poppins]" onClick={()=> handleDeleteClass(record.id)}>
          Eliminar
        </Button>
      ),
    },
  ];

  const colSection = [
    {
      title: "Clase",
      key: "class",
      render: (record) => record.classes?.name || "—",
    },
    {
      title: "Usuario",
      key: "user",
      render: (record) => record.users?.email || "—",
    },
    { title: "Sección", dataIndex: "code", key: "code" },
    {title: "Trimestre", dataIndex: "trimester", key: "trimester"},
    {
      title: "Acción",
      key: "action",
      render: (record) => (
        <Button danger icon={<DeleteOutlined />} className="!font-[Poppins]" onClick={() => handleDeleteSection(record.id)}>
          Eliminar
        </Button>
      ),
    },
  ];

  return (
    <div className="w-full h-full bg-gradient-to-t from-blue-200 to-blue-100 py-8 flex flex-col items-center relative overflow-y-auto">
      <Particles />

      {/* Layout principal con Row y Col */}
      <Row
        gutter={[32, 32]}
        className="w-[90%] min-h-[90%] flex justify-center items-start mt-4"
      >
        {/* Card de Clases */}
        <Col xs={24} lg={12} className="h-full flex flex-col">
          <Card
            className="shadow-lg flex flex-col h-full"
            title={
              <div className="flex items-center justify-center gap-8 md:gap-40 min-h-12">
                <Text className="!font-[Poppins] font-bold text-2xl">Clases</Text>
                <Button
                  icon={<PlusOutlined />}
                  className="!font-[Poppins] text-white bg-blue-500 hover:!bg-blue-400 hover:!text-white hover:scale-105"
                  onClick={() => setAddClass(true)}
                >
                  Añadir
                </Button>
              </div>
            }
          >
            {/* Contenedor scrollable */}
            <div className="flex-1 overflow-auto">
              <Table
                className="!font-[Poppins]"
                columns={colClass}
                dataSource={classes}
                loading={loadingClass}
                pagination={{pageSize: 10, position: ['bottomCenter']}}
                bordered
              />
            </div>
          </Card>
        </Col>

        {/* Card de Secciones */}
        <Col xs={24} lg={12} className="h-full flex flex-col">
          <Card
            className="shadow-lg flex flex-col h-full"
            title={
              <div className="flex gap-4 items-center justify-center gap-8 md:gap-40 min-h-12">
                <Text className="!font-[Poppins] font-bold text-2xl">Secciones</Text>
                <Button
                  icon={<PlusOutlined />}
                  className="!font-[Poppins] text-white bg-blue-500 hover:!bg-blue-400 hover:!text-white hover:scale-105"
                  onClick={() => setAddSection(true)}
                >
                  Añadir
                </Button>
              </div>
            }
          >
            <div className="flex-1 overflow-auto">
              <Table
                className="!font-[Poppins]"
                dataSource={sections}
                columns={colSection}
                pagination={{pageSize: 10, position: ['bottomCenter']}}
                loading={loadingSection}
                bordered
              />
            </div>
          </Card>
        </Col>
      </Row>

      {/* Modal para añadir clase */}
      <AddClass open={addClass} close={() => setAddClass(false)} onAdd={addingClass} />
      <AddSection open={addSection} close={()=> setAddSection(false)} classes={classes} onAdd={addingSection} />
    </div>
  );
}

export default Classes;
