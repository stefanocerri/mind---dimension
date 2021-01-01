import styled from "styled-components";
import { motion , useViewportScroll } from "framer-motion";
import { InView } from "react-intersection-observer";

const transition = {
  duration: 4,
  ease: "easeInOut",
  yoyo: Infinity,
  time: [0.8,1]
};

const TextPathAnimation = (props) => {

  const { scrollYProgress } = useViewportScroll();

  function reverseString(str) {
    let splitString = str.split("");
    let reverseArray = splitString.reverse();
    let stringReversed = reverseArray.join("");

    return stringReversed;
  }


  return (
    <InView
      as="div"
      triggerOnce={true}
      //rootMargin= '-48px'
      //onChange={(inView, entry) => console.log("Inview:", entry)}
    >
      {({ inView, ref, entry }) => (
        <StyledContainer ref={ref} style={props ? props.style : null}>

          {reverseString(props.children)
            .split("", reverseString(props.children).length)
            .map((currElement, i) => (
              <StyledTextPathAnimation
                key={i}
                //initial={{ opacity: 0, offsetDistance: "0%" }}
                initial={{ opacity: 0, offsetDistance: `${0 - i * 1.9}%` }}
                //animate={{ opacity: 1, offsetDistance: "100%" }}
                animate={{ opacity: 1, offsetDistance: `${100 - i * 1.9}%` }}
                transition={transition}
              >
                {currElement}
              </StyledTextPathAnimation>
            ))}
        </StyledContainer>
      )}
    </InView>
  );
};

export default TextPathAnimation;


const StyledContainer = styled(motion.div)`
  display: block;
  position: relative;
  height:500px;
  width:100px;
`;

const StyledTextPathAnimation = styled(motion.h1)`
  display: inline-block;
  position: absolute;
  color: red;
  top: 0;
  left: 0;
  opacity: 0;
  offset-path: path(
    "M 0 50 Q 100 0 200 100 Q 300 200 650 50 C 750 0 750 150 1000 50"
  );
`;
