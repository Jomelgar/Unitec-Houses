import { useEffect, useRef } from "react";

function Mist() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let w, h;
    let fogLayers = [];

    const resize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      fogLayers = Array.from({ length: 3 }, (_, i) => ({
        y: Math.random() * h,
        speed: 0.05 + Math.random() * 0.05,
        opacity: 0.15 + Math.random() * 0.1,
        gradient: ctx.createLinearGradient(0, 0, w, 0),
      }));
      fogLayers.forEach((layer) => {
        layer.gradient.addColorStop(0, "rgba(173, 216, 230, 0)");
        layer.gradient.addColorStop(0.5, "rgba(173, 216, 230, 0.4)");
        layer.gradient.addColorStop(1, "rgba(173, 216, 230, 0)");
      });
    };

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      fogLayers.forEach((layer, i) => {
        ctx.globalAlpha = layer.opacity;
        ctx.fillStyle = layer.gradient;
        ctx.fillRect(
          ((Date.now() / 40) * layer.speed) % w - w,
          layer.y,
          w * 2,
          200
        );
      });
      requestAnimationFrame(draw);
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10"
      style={{ mixBlendMode: "screen" }}
    />
  );
}

export default Mist;
