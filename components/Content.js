import styled, { css } from "styled-components";
import { useContext, useRef, useState, useEffect } from "react";
import { motion, useElementScroll, useTransform } from "framer-motion";



const Content = (props) => {


// const ref = useRef(null);
// const [progress, setProgress] = useState(0);
// const { scrollYProgress } = useElementScroll(ref);
// const scale = useTransform(
//   scrollYProgress,
//   [0.5, 0.66, 1],
//   [0.25 , 0.5, 1]
// );
// const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
// scrollYProgress.onChange(setProgress);

return (
  <StyledContent
  //ref={ref}
  >
    {props.children}

    {/* <motion.div
      style={{
        display: "flex",
        position: "fixed",
        top: 200,
        left: "50%",
        zIndex: 5,
        alignItems: "center",
        justifyContent: "center",
        width: "25vh",
        height: "25vh",
        fontSize: 32,
        backgroundColor: "hotpink",
        scale,
        rotate,
      }}
    >
      {progress.toFixed(2)}
    </motion.div> */}


  </StyledContent>
);
};

export default Content;

const StyledContent = styled.div`
  position: fixed;
  top: 40px;
  left: 16vw;
  bottom: 10vh;
  width: 84vw;
  overflow-y: scroll;
  overflow-x: hidden;
  padding-bottom: 0;
  background: blue;
`;
