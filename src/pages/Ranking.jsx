import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, Table, Typography, Divider, Skeleton } from "antd";
import supabase from "../utils/supabase";
import { CrownFilled, TrophyFilled, FireFilled } from "@ant-design/icons";

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

  const podium = houses.slice(0, 3);
  const others = houses.slice(3);

  return (
    <div className=" w-full h-full bg-gradient-to-b from-blue-100 to-blue-200 p-8 flex flex-col items-center relative overflow-y-auto">
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
            className="!font-[SF Pro Display] !text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-800 via-blue-600 to-blue-400 tracking-tight drop-shadow-[0_0_20px_rgba(173,216,230,0.3)]"
          >
            Blasones
          </Title>
          <Text className="block mt-3 text-blue-900/80 text-lg italic tracking-wide">
            Honor, Gloria y Fuego — donde cada casa forja su legado.
          </Text>
        </div>
      </motion.div>

      {/* 🏰 Podio */}
      <div className="flex justify-center items-end gap-8 mb-20 w-full max-w-4xl relative z-10">
        {loading ? (
          <Skeleton active paragraph={{ rows: 0 }} avatar />
        ) : (
          podium.map((house, index) => {
            const heights = [160, 240, 130];
            const order = [1, 0, 2];
            const colors = [
              "border-silver/80 shadow-[0_0_25px_#a0c4ff]",
              "border-yellow-400 shadow-[0_0_25px_#ffd700]",
              "border-amber-800 shadow-[0_0_25px_#8b7355]",
            ];

            return (
              <motion.div
                key={house.name}
                className="flex flex-col items-center relative"
                style={{ order: order[index] }}
                initial={{ y: 80, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 * index, type: "spring" }}
              >
                <div
                  className={`w-28 h-28 rounded-full border-4 mb-3 bg-[#0b1222] flex items-center justify-center ${colors[index]}`}
                >
                  <img
                    src={house.photoURL || "/castle.png"}
                    alt={house.name}
                    className="w-24 h-24 rounded-full object-cover border-2 border-[#00000088]"
                  />
                </div>

                <span className="font-extrabold text-xl text-yellow-200 mb-2 tracking-wider">
                  {house.name}
                </span>

                <div
                  className={`w-32 flex flex-col items-center justify-center font-bold text-lg rounded-t-lg relative overflow-hidden ${
                    index === 1
                      ? "bg-gradient-to-t from-yellow-500 to-yellow-300 text-black"
                      : index === 0
                      ? "bg-gradient-to-t from-gray-400 to-gray-200 text-black"
                      : "bg-gradient-to-t from-amber-900 to-amber-600 text-yellow-100"
                  }`}
                  style={{ height: `${heights[index]}px` }}
                >
                  <div className="absolute -top-6">
                    {index === 1 ? (
                      <CrownFilled className="text-yellow-400 text-4xl" />
                    ) : (
                      <TrophyFilled className="text-amber-400 text-3xl" />
                    )}
                  </div>
                  {index === 1 ? "🥇" : index === 0 ? "🥈" : "🥉"}
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
          className="bg-[#e6f0ff]/60 rounded-3xl border-4 border-blue-200 shadow-[0_0_40px_#9dc9ff60] backdrop-blur-lg"
          title={
            <div className="flex items-center gap-3">
              <FireFilled className="text-blue-500 text-2xl" />
              <span className="!font-[Poppins] text-blue-800 text-xl font-semibold">
                Tabla de Honor
              </span>
            </div>
          }
          headStyle={{
            borderBottom: "1px solid rgba(173, 216, 230, 0.4)",
          }}
        >
          <Table
            dataSource={others.map((h, i) => ({
              key: i,
              rank: i + 4,
              name: h.name,
              points: h.points,
              photo: h.photoURL,
            }))}
            loading={loading}
            pagination={false}
            rowClassName="!font-[Poppins] hover:bg-[#d9ecff]/70 transition-all "
            columns={[
              {
                title: "#",
                dataIndex: "rank",
                key: "rank",
                render: (rank) => (
                  <span className="!font-[Poppins] text-blue-700 font-bold">{rank}</span>
                ),
                onHeaderCell: () => ({
                  style: { backgroundColor: "#008feeff", color: "#ffffff", fontWeight: "bold" },
                }),
              },
              {
                title: "Casa",
                dataIndex: "name",
                key: "name",
                render: (text, record) => (
                  <div className="!font-[Poppins] flex items-center gap-3">
                    <span className="!font-[Poppins] text-blue-900 font-medium">{text}</span>
                  </div>
                ),
                onHeaderCell: () => ({
                  style: { backgroundColor: "#008feeff", color: "#ffffff", fontWeight: "bold" },
                }),
              },
              {
                title: "Puntos",
                dataIndex: "points",
                key: "points",
                align: "right",
                render: (points) => (
                  <span className="!font-[Poppins] text-blue-700 font-semibold">
                    {points ?? 0}
                  </span>
                ),
                onHeaderCell: () => ({
                  style: { backgroundColor: "#008feeff", color: "#ffffff", fontWeight: "bold" },
                }),
              },
            ]}
          />
        </Card>
      </motion.div>

      <Divider className="mt-16 border-blue-400/30" />
      <Text className="!font-[Poppins] text-blue-800 italic text-sm relative z-10">
        ⚜️ "Solo los dignos forjarán su nombre en la historia..." ⚜️
      </Text>
    </div>
  );
}

export default Ranking;
