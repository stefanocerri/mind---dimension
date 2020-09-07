import { useEffect } from "react";
import styled from "styled-components";
import {
  motion,
  useAnimation,
  useViewportScroll,
  useMotionValue,
  useTransform
} from "framer-motion";
import { InView } from "react-intersection-observer";

const transition = { duration: 1.5, ease: [0.6, 0.05, -0.01, 0.9] };

const zoomVariant = {
  zoomStart: { scale: 2 },
  zoomEnd: {
    scale: 1,
    transition: {
      ...transition
    },
  },
};

const fadeInVariant = {
  fadeInStart: { opacity: 0, y: 72 },
  fadeInEnd: {
    opacity: 1,
    y: 0,
    transition: {
      ...transition,
    },
  },
};

const Image = (props) => {


  return (
    <InView
      as="div"
      triggerOnce={true}
      //rootMargin= '-48px'
      //onChange={(inView, entry) => console.log("Image inView:", inView)}
    >
      {({ inView, ref, entry }) => (
        <StyledContainer
          ref={ref}
          variants={fadeInVariant}
          initial="fadeInStart"
          animate={inView ? "fadeInEnd" : "fadeInStart"}
          style={props ? props.style : null}
        >
          <StyledImage
            variants={zoomVariant}
            initial="zoomStart"
            animate={inView ? "zoomEnd" : "zoomStart"}
            src="https://images.pexels.com/photos/4348270/pexels-photo-4348270.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
            alt="Woman"
          />
        </StyledContainer>
      )}
    </InView>
  );
};

export default Image;


const StyledContainer = styled(motion.div)`
  position: relative;
  overflow: hidden;
`;

const StyledImage = styled(motion.img)`
  height: 100%;
  width: 100%;
  object-fit: cover;
  object-position: center center;
`;






