import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, Table, Typography, Divider, Skeleton } from "antd";
import supabase from "../utils/supabase";
import { CrownFilled, TrophyFilled, FireFilled } from "@ant-design/icons";
import Particles from "../components/particles-floating";
import GraphicRank from "../components/GraphicRank";

const { Title, Text } = Typography;

function Ranking() {
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHouses = async () => {
    const { data, error } = await supabase
      .from("house")
      .select("name, photoURL, points")
      .order("points", { ascending: false });

    if (error) console.error(error);
    else setHouses(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchHouses();
  }, []);

  const podium = houses.slice(0, 5);
  const others = houses;

  return (
    <div className=" w-full h-full bg-gradient-to-b from-blue-100 to-blue-200 p-8 flex flex-col items-center relative overflow-y-auto">
      <Particles/>
      {/* ✨ Header refinado estilo Apple */}
      <motion.div
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 60 }}
        className="!font-[Poppins] text-center mb-20 relative z-10"
      >
        <div className="inline-block bg-gradient-to-b from-blue/60 to-blue/10 backdrop-blur-sm px-10 py-6 rounded-2xl shadow-lg">
          <Title
            level={1}
            className="!font-[SF Pro Display] !text-2xl md:!text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 tracking-tight drop-shadow-[0_0_20px_rgba(173,216,230,0.3)]"
          >
            Casas Academícas
          </Title>
          <Text className="block mt-3 text-blue-900/80 text-sm md:text-lg italic tracking-wide">
            Honor, Gloria y Fuego — donde cada casa forja su legado.
          </Text>
        </div>
      </motion.div>

      {/* 🏰 Podio de 5 casas */}
      <div className="flex justify-center items-end gap-6 mb-20 w-full max-w-screen relative z-10">
        {loading ? (
          <Skeleton active paragraph={{ rows: 0 }} avatar />
        ) : (
          podium.slice(0, 5).map((house, index) => {
            const heights = [240, 200, 180, 160, 140]; // Alturas de cada barra
            const order = [2, 0, 1, 3, 4]; // Ajusta el orden visual del podio
            const colors = [
              "border-yellow-400 shadow-[0_0_25px_#ffd700]", // 1er lugar
              "border-gray-400 shadow-[0_0_25px_#e3e4e5]", // 2do lugar
              "border-amber-800 shadow-[0_0_25px_#8b7355]", // 3er lugar
              "border-blue-400 shadow-[0_0_15px_#a0c4ff]", // 4to lugar
              "border-green-400 shadow-[0_0_15px_#7ed957]", // 5to lugar
            ];

            return (
              <motion.div
                key={house.name}
                className="flex flex-col items-center relative"
                style={{ order: order[index] }}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 * index, type: "spring" }}
              >
                <div
                  className={`w-12 h-10 md:w-28 md:h-28 rounded-full border-4 mb-3 bg-[#0b1222] flex items-center justify-center ${colors[index]}`}
                >
                  <img
                    src={house.photoURL}
                    alt={house.name}
                    className="w-12 h-10 md:w-24 md:h-24 bg-white rounded-full object-cover border-2 border-[#00000088]"
                  />
                </div>

                <span className="!font-[Roboto] font-extrabold text-sm md:text-xl text-yellow-800 mb-2 tracking-wider">
                  {house.name}
                </span>

                <div
                  className={`w-12 md:w-32 flex flex-col items-center justify-end font-bold text-lg rounded-t-lg relative overflow-hidden ${
                    index === 0
                      ? "bg-gradient-to-t from-yellow-500 to-yellow-300 text-black"
                      : index === 1
                      ? "bg-gradient-to-t from-gray-400 to-gray-200 text-black"
                      : index === 2
                      ? "bg-gradient-to-t from-amber-900 to-amber-600 text-yellow-100"
                      : "bg-gradient-to-t from-blue-400/50 to-green-200/50 text-black"
                  }`}
                  style={{ height: `${heights[index]}px` }}
                >
                  <div className="absolute top-2">
                    {index === 0 && <CrownFilled className="text-yellow-600 text-3xl mt-2" />}
                    {index === 1 && <TrophyFilled className="text-gray-500 text-3xl mt-2" />}
                    {index === 2 && <TrophyFilled className="text-amber-500 text-3xl mt-2" />}
                  </div>
                  <p className="text-4xl mb-8">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""}
                  </p>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      
      {/* 🛡️ Tabla de los demás */}
      <motion.div
        className="w-full max-w-4xl relative z-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <Card
          bordered={false}
          className="w-full bg-white/60 rounded-3xl border-4 border-blue-200 shadow-[0_0_40px_#9dc9ff60] backdrop-blur-lg"
          title={
            <div className="flex items-center gap-3">
              <FireFilled className="text-blue-500 text-2xl" />
              <span className="!font-[Poppins] text-blue-800 text-xl font-semibold">
                Distribución de Casas
              </span>
            </div>
          }
          headStyle={{
            borderBottom: "1px solid rgba(173, 216, 230, 0.4)",
          }}
        >
          <GraphicRank 
            title={"Casas de Matemáticas"}
            subtitle="Ranking de casas"
            labels={houses.map((h)=> h?.name)}
            datapoints={houses.map((h)=>h?.points)}
            images={houses.map((h)=>h?.photoURL)}
          />
        </Card>
      </motion.div>
      <Divider className="mt-16 border-blue-400 w-full" />
      <Text className="!font-[Poppins] !text-center text-blue-800 italic text-sm relative z-10">
        ⚜️ "Solo los dignos forjarán su nombre en la historia..." ⚜️
      </Text>
    </div>
  );
}

export default Ranking;
