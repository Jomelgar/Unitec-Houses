import { useState, useEffect } from "react";
import Particles from "../components/particles-floating";
function Evaluation(){
    return(
        <div className="w-full h-full bg-gradient-to-t from-blue-200 to-blue-100 py-8 flex flex-col items-center relative overflow-y-auto">
            <Particles/>
        </div>
    );
};

export default Evaluation;