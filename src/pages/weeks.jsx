import { useState, useEffect } from "react";
import { Divider,Typography } from "antd";
import Particles from "../components/particles-floating";

const {Text} = Typography

function Weeks(){
    return(
    <div className="relative w-full h-full bg-gradient-to-b from-blue-100 to-blue-200 overflow-hidden flex flex-col justify-center items-center text-center">
        <Particles/>
        <Divider className="mt-16 border-blue-400/30" />
        <Text className="!font-[Poppins] text-blue-800 italic text-sm relative z-10">
            ⚜️ "Solo los dignos forjarán su nombre en la historia..." ⚜️
        </Text>
    </div>
    );
};

export default Weeks;