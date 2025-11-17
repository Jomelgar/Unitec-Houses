import React, { useEffect, useState, useRef } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function HorizontalBarChart({ labels, images, datapoints, title }) {
  const [ready, setReady] = useState(false);
  const [loadedImages, setLoadedImages] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const chartRef = useRef(null);

  // Preload imágenes
  useEffect(() => {
    if (!images || images.length === 0) {
      setReady(true);
      setLoadedImages([]);
      return;
    }

    const imgs = [];
    let loadedCount = 0;

    images.forEach((src, i) => {
      const img = new Image();
      img.src = src;

      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          setLoadedImages(imgs);
          setReady(true);
        }
      };

      imgs[i] = img;
    });
  }, [images]);

  // ⛔ FORZAR RE-RENDER DEL GRÁFICO CUANDO LAS IMÁGENES YA ESTÁN LISTAS
  useEffect(() => {
    if (ready && chartRef.current) {
      chartRef.current.update();
    }
  }, [ready, loadedImages]);

  // Resize detection
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!ready) return <p>Cargando gráfico...</p>;

  const data = {
    labels,
    datasets: [
      {
        label: "Puntos obtenidos",
        data: datapoints,
        backgroundColor: "rgba(37, 99, 235, 0.7)",
        borderColor: "rgba(37, 99, 235, 1)",
        borderWidth: 1,
        borderRadius: 8,
      },
    ],
  };

  // Plugin que dibuja imágenes
  const imagePlugin = {
    id: "imagePlugin",
    afterDraw: (chart) => {
      if (!loadedImages.length) return;

      const { ctx } = chart;

      chart.getDatasetMeta(0).data.forEach((bar, index) => {
        const img = loadedImages[index];
        if (!img) return;
        if (datapoints[index] === 0) return;

        const imgSize = windowWidth < 768 ? 25 : 40;
        const x = bar.x - imgSize - 10;
        const y = bar.y - imgSize / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(x + imgSize / 2, y + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
        ctx.clip();
        ctx.drawImage(img, x, y, imgSize, imgSize);
        ctx.restore();
      });
    },
  };

  const options = {
    indexAxis: "y",
    maintainAspectRatio: false,
    responsive: true,
    animation: { duration: 800 },
    plugins: {
      legend: { display: false },
      title: { display: true, text: title },
    },
  };

  return (
    <div
      className="w-full mx-auto p-2"
      style={{ height: `${labels.length * 70}px` }}
    >
      <Bar
        ref={chartRef}
        data={data}
        options={options}
        plugins={[imagePlugin]}
      />
    </div>
  );
}

export default HorizontalBarChart;
