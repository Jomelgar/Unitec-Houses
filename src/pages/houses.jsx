import { useState, useEffect } from "react";
import Particles from "../components/particles-floating";
import { Button, Card, Table, Typography } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import supabase from "../utils/supabase";
import AddHouse from "../modals/AddHouse";


const {Title,Text} = Typography;

function Houses(){
    const [addHouse,setAddHouse] = useState(false);
    const [houses,setHouses] = useState([]);
    const [loading,setLoading] = useState(true);

    const fetchHouses = async () => {
        setLoading(true);
        const { data, error } = await supabase
          .from("house")
          .select("id,name, photoURL, points");

        if (error) console.error(error);
        else setHouses(data);
        setLoading(false);
    };

  useEffect(() => {
    fetchHouses();
  }, []);

  const handleDelete = async (house) => {
    setLoading(true);
    const { error } = await supabase
      .from("house")
      .delete()
      .eq("id", house);
    if(!error) fetchHouses();
    else console.error(error); 
  };

    return(
    <div className="w-full h-full bg-gradient-to-t from-blue-200 to-blue-100 py-8 flex flex-col items-center relative overflow-y-auto">
        <Particles/>
        <Card 
            className="w-11/12 max-w-4xl shadow-lg rounded-lg bg-white bg-opacity-80"
            title={
                <Title level={3} className="!font-[Poppins] mt-4">Gestión de Casas</Title>
            }
            extra={<Button type="primary" icon={<PlusOutlined/>} onClick={()=>setAddHouse(true)}className="!font-[Poppins] mr-4">Agregar Casa</Button>}
        >
            <Table
                className="!font-[Poppins]"
                loading={loading}
                columns={[
                    {title: 'Escudo', dataIndex:'photoURL', key:'photoURL', render: (url) => 
                        (<img className="w-12 h-12 rounded rounded-full"src={url} alt="Foto de la Casa"/>)},
                    {title: 'Nombre de la Casa', dataIndex:'name', key:'name'},
                    {title: 'Puntaje', dataIndex:'points', key:'points'},
                    {title: 'Acciones', key:'actions', render: (_,record) => 
                        (<Button 
                            onClick={()=> handleDelete(record?.id)}
                            icon={<DeleteOutlined/>} 
                            className="!font-[Poppins] hover:scale-105 text-white bg-red-400 hover:!bg-red-600 hover:!text-white hover:!border-red-800"
                        >
                            Eliminar
                        </Button>)}
                ]}
                dataSource={houses}
                pagination={{pageSize: 5, position: ['bottomCenter']}}
            />
        </Card>
        <AddHouse
            open={addHouse}
            close={() => setAddHouse(false)}
            refresh={fetchHouses}
        />
    </div>);
};

export default Houses;