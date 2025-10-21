import { useEffect, useState } from "react";
import {
  Card,
  Collapse,
  Typography,
  Divider,
  Button,
  Radio,
  Space,
  message,
  Select,
  Form,
  Input,
} from "antd";
import { motion } from "framer-motion";
import Particles from "../components/particles-floating";
import Cookies from "js-cookie";
import supabase from "../utils/supabase";
import { HomeOutlined } from "@ant-design/icons";
import HouseForm from "../components/HouseForm";
import { s } from "framer-motion/client";

const { Text, Title } = Typography;
const { Panel } = Collapse;

function Weeks() {
  const [selected, setSelected] = useState(null);
  const [sections, setSections] = useState([]); 
  const [weeks, setWeeks] = useState([]); 
  const [houses, setHouses] = useState([]);
  const [selectedSection, setSelectedSection] = useState(null); 
  const [loading, setLoading] = useState(false); 

  const fetchHouses = async() =>{
    const {data} = await supabase.from('house').select();
    setHouses(data || []);
  }


  const fetchSections = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("sections")
      .select("id, classes(name), code")
      .eq("active", true)
      .eq("id_user", Cookies.get("user"));

    if (error) {
      console.error("Error al obtener secciones:", error);
      return;
    }

    setSections(data || []);
    setLoading(false);
    if (data && data.length > 0) {
      setSelectedSection(data[0].id);
    }
  };

  // 🔹 Cargar semanas de la sección seleccionada
  const fetchWeeks = async () => {
    if (!selectedSection) return;
    setLoading(true);
    const { data, error } = await supabase
      .from("weeks")
      .select("*")
      .eq("id_section", selectedSection);

    if (error) {
      setLoading(false);
      console.error("Error al obtener semanas:", error);
      return;
    }
    setLoading(false);
    setWeeks(data || []);
  };

  // 🔹 Manejar respuesta de encuesta
  const handleAnswer = async(value) => {
    for (const entry of value) {
      setLoading(true);
      const { data, error } = await supabase
        .from("califications")
        .insert([
          {
            id_house: entry.id,
            id_week: selected,
            points: entry.points,
          },
        ]);
    };
    const {error} = await supabase
      .from("weeks")
      .update({ status: "En Proceso" })
      .eq("id", selected);
    if(!error) await fetchWeeks();
    setSelected(null);
    setLoading(false);
  }

  // 🔹 Cargar secciones al inicio
  useEffect(() => {
    fetchSections();
    fetchHouses();
  }, []);

  // 🔹 Cargar semanas al cambiar de sección
  useEffect(() => {
    fetchWeeks();
  }, [selectedSection]);


  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-blue-100 to-blue-200 overflow-hidden flex flex-col items-center py-16">
      <Particles />

      <div className="z-10 w-11/12 max-w-3xl flex flex-col gap-4">
        <Title level={2} className="text-blue-900 text-center !font-bold mb-6">
          Semanas del curso
        </Title>

        {/* 🔸 Selector de sección */}
        <Select
          value={selectedSection}
          loading={loading}
          placeholder="Selecciona una sección"
          className="font-[Poppins]"
          onChange={(value) => setSelectedSection(value)}
        >
          {sections.map((s) => (
            <Select.Option key={s.id} value={s.id} className="font-[Poppins]">
              {s.classes?.name}, {s.code}
            </Select.Option>
          ))}
        </Select>

        {/* 🔸 Lista de semanas */}
        <Collapse
          accordion
          activeKey={selected}
          loading={loading}
          onChange={(key) => setSelected(key[0])}
          expandIconPosition="end"
          className="rounded-2xl shadow-lg bg-white/70 backdrop-blur-sm"
        >
          {weeks.length > 0 && !loading? (
            weeks.map((semana) => (
              <Panel
                key={semana.id}
                disabled={semana.status !== "Rechazada"}
                header={
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex justify-between items-center w-full"
                  >
                    <span className="text-blue-800 font-semibold text-lg">
                      Semana {semana.week}
                    </span>
                    <span className="text-sm text-blue-600 italic">
                      {semana?.status === "Aceptada"
                        ? "✔️ Respondida"
                        : semana?.status === "En Proceso" ? "⚙️ En Proceso" : "📝 Sin responder"}
                    </span>
                  </motion.div>
                }
              >
                <Card
                  className="bg-blue-50/70 border border-blue-200 rounded-xl"
                  bordered={false}
                >
                    <HouseForm houses={houses} onAssign={handleAnswer}/>
                </Card>
              </Panel>
            ))
          ) : (
            <Text className="text-blue-800 italic text-center block py-8">
              No hay semanas registradas para esta sección.
            </Text>
          )}
        </Collapse>
      </div>

      <Divider className="mt-16 border-blue-400/30" />
      <Text className="!font-[Poppins] text-blue-800 italic text-sm relative z-10">
        ⚜️ "Solo los dignos forjarán su nombre en la historia..." ⚜️
      </Text>
    </div>
  );
}

export default Weeks;
