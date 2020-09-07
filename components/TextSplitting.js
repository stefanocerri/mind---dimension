import { useEffect } from "react";
import styled from "styled-components";
import { motion, useAnimation } from "framer-motion";
import { InView } from "react-intersection-observer";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.02,
    },
  },
};

const item = {
  hidden: { y: "100%" },
  visible: {
    y: "0%",
    transition: {
      ease: "anticipate",
      duration: .5,
    },
  },
};


const TextSplitting = (props) => {

  return (
    <InView
      as="div"
      triggerOnce= {true}
      //rootMargin= '-48px'
      //onChange={(inView, entry) => console.log("Inview:", entry)}
    >
      {({ inView, ref, entry }) => (
        <StyledContainer
          ref={ref}
          variants={container}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
          style={props ? props.style : null}
        >
          {props.children.split(" ").map((currElement, i) => (
            <StyledTextContainer key={i}>
              <StyledText
                key={i}
                variants={item}
              >
                {currElement}&nbsp;
              </StyledText>
            </StyledTextContainer>
          ))}
        </StyledContainer>
      )}
    </InView>
  );
};

export default TextSplitting;


const StyledContainer = styled(motion.div)`
  display: inline-block;
`;

const StyledTextContainer = styled.span`
  display: inline-block;
  overflow: hidden;
  line-height: 1.2;
  margin-bottom: 0.5em;
`;

const StyledText = styled(motion.span)`
  display: block;
  font-size: 2em;
`;