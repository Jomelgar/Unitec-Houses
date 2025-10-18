import { Form, Input, Typography, Row, Col, Space, Button } from "antd";
import { HomeOutlined } from "@ant-design/icons";

const { Text, Title } = Typography;

function HouseForm({ houses, onAssign }) {

  const handleFinish = (values) => {
    const data = houses.map((h) => ({
      id: h.id,
      points: Number(values[h.id]),
    }));

    onAssign(data);
};

  return (
    <Form layout="vertical" className="!font-[Poppins] w-full" style={{ padding: "1rem" }} onFinish={(values)=>handleFinish(values)}>
      <Title level={4} className="text-center text-blue-900 mb-8">
        Asignar puntos a las casas
      </Title>

      <Row gutter={[24, 24]} justify="center">
        {houses.map((h) => (
          <Col xs={12} sm={8} md={6} lg={4} key={h.name}>
            <Space direction="vertical" align="center" className="w-full">
              {/* Imagen circular */}
              <img
                className="w-20 h-20 rounded-full"
                src={h.photoURL}
                alt={h.name}
                style={{
                  objectFit: "cover",
                  border: "2px solid #3b82f6",
                }}
              />

              {/* Nombre */}
              <HomeOutlined className="text-lg flex text-blue-900 block "/>
              <Text strong className="flex-col flex text-blue-900 text-lg block text-center">
                {h.name}
              </Text>

              {/* Input de puntos */}
              <Form.Item name={[h.id]} className="w-full mb-0" rules={[{ required: true, message: "Por favor, ingresa sus puntos." }]}>
                <Input
                  type="number"
                  min={0}
                  placeholder="Ej: 10"
                  className="text-center"
                />
              </Form.Item>
            </Space>
          </Col>
        ))}
        <Button type="primary" htmlType="submit" className="w-full bg-blue-500 hover:bg-blue-400">
                Asignar Puntos
        </Button>
      </Row>
    </Form>
  );
}

export default HouseForm;
