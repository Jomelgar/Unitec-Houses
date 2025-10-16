function Particles(){
    return(
    <>
        <style>
        {`
          @keyframes float {
            0% { transform: translateY(0px); opacity: 0.6; }
            50% { transform: translateY(-30px); opacity: 1; }
            100% { transform: translateY(0px); opacity: 0.6; }
          }
          .animate-float {
            animation: float 4s ease-in-out infinite;
          }
        `}
      </style>
        {/* ✨ Partículas flotantes */}
      <div className="absolute inset-0">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="absolute w-5 h-5 bg-blue-700 rounded-full animate-float"
            style={{
              top: `${Math.random() * 90}%`,
              left: `${Math.random() * 100}%`,
              animationDuration: `${3 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    </>
    );
}
export default Particles;