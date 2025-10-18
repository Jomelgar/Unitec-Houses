import React, { useEffect, useState } from "react";
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
import { image } from "framer-motion/client";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function HorizontalBarChart({ labels, images, datapoints, title }) {
  const [ready, setReady] = useState(false);
  const [loadedImages, setLoadedImages] = useState([]);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Pre-cargar imágenes
  useEffect(() => {
    if (!images || images.length === 0) return;

    const imgs = [];
    let loadedCount = 0;

    images.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) setReady(true);
      };
      imgs[i] = img;
    });

    setLoadedImages(imgs);
  }, [images]);

  // Detectar cambios de tamaño de ventana
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
        barPercentage: windowWidth < 768 ? 1 : 0.5,
        maxBarThickness: windowWidth < 768 ? 30 : 40,
      },
    ],
  };

const imagePlugin = {
  id: "imagePlugin",
  afterDatasetsDraw: (chart) => {
    const { ctx } = chart;
    chart.getDatasetMeta(0).data.forEach((bar, index) => {
      const img = loadedImages[index];
      if (!img) return;

      // Si el valor del datapoint es 0, no dibujamos la imagen
      if (datapoints[index] === 0) return;

      const imgSize = windowWidth < 768 ? 25 : 40;
      const x = bar.x - imgSize;
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
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1500, easing: "easeOutBounce" },
    plugins: {
      legend: { position: windowWidth < 768 ? "bottom" : "top" },
      title: {
        display: true,
        text: title || "Puntos por asignatura",
        font: { size: windowWidth < 768 ? 14 : 20 },
      },
      tooltip: { enabled: true },
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { stepSize: 10, font: { size: windowWidth < 768 ? 10 : 14 } },
      },
      y: {
        ticks: { font: { size: windowWidth < 768 ? 10 : 14 } },
      },
    },
  };

  return (
    <div
      className="w-full max-w-full mx-auto p-2"
      style={{ height: `${labels.length * (windowWidth < 768 ? 20*images.length : 20*images.length)}px` }}
    >
      <Bar data={data} options={options} plugins={[imagePlugin]} />
    </div>
  );
}

export default HorizontalBarChart;
