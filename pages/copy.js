import styled from 'styled-components'
import {
  useViewportScroll,
  motion,
  useTransform,
  useMotionValue,
} from "framer-motion";
import { Grid, Row, Col } from "react-styled-flexboxgrid";
import TextSplitting from '../components/TextSplitting';
import Content from '../components/Content';
import { useInView } from "react-intersection-observer";

const fadeVariant = {
  fading: { opacity: 0 },
  faded: {
    opacity: 1,
    transition: { delay: 1.3, duration: 1.2, ease: "easeOut" },
  },
};

const bgVariant = {
  expanded: { scaleY: 1 },
  shrunk: {
    scaleY: 0,
    transition: {
      duration: 1.8,
      ease: [1, 0.05, 0.48, 0.92],
    },
  },
};

const imgVariant = {
  zoomed: { scale: 1.5 },
  normal: {
    scale: 1,
    transition: {
      duration: 1.8,
      ease: [1, 0.05, 0.48, 0.92],
    },
  },
};

const container = {
  hidden: { opacity: 1 },
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
      duration: 1,
    },
  },
};

export default function Home() {

  const [refInView, inView] = useInView({
    threshold: 0.5,
    // triggerOnce: true
  });

  //  const { scrollY } = useViewportScroll();
  //  const y1 = useTransform(scrollY, [0, 300], [0, 200]);
  //  const y2 = useTransform(scrollY, [0, 1000], [0, -500]);

  return (
    <Grid>
      {/* <motion.div
        style={{
          y: y1,
          x: -50,
          width: 150,
          height: 150,
          borderRadius: 24,
          backgroundColor: "#f9f07e",
        }}
      />

      <motion.div
        style={{
          y: y2,
          x: 50,
          width: 150,
          height: 150,
          borderRadius: 24,
          backgroundColor: "salmon",
        }}
      /> */}
      <Row>
        <Col xs={12} md={6} lg={4}>
          <StyledImageContainer>
            <StyledContainer
              variants={bgVariant}
              initial="expanded"
              animate="shrunk"
            />
            <StyledImage
              variants={imgVariant}
              initial="zoomed"
              animate="normal"
              src="https://images.pexels.com/photos/1679004/pexels-photo-1679004.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
              alt="statue"
            />
          </StyledImageContainer>
        </Col>


        <motion.section
          initial={false}
          animate={{ color: inView ? "#FF0088" : "#0055FF" }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <motion.h2
            animate={{ scale: inView ? 1.2 : 0.5 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >{`Section inside viewport ${inView}.`}</motion.h2>
        </motion.section>


      </Row>
    </Grid>
  );
}

const StyledBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const StyledTitle = styled.h1`
  font-size: ${({ theme }) => theme.fontSizes.hero};
  color: ${({ theme }) => theme.colors.black};
`;


const StyledImageContainer = styled.div`
    position: relative;
    overflow: hidden;
`;

const StyledContainer = styled(motion.div)`
    z-index: 999;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    transform-origin: top;
    background-color: white;
`;

const StyledImage = styled(motion.img)`
    height: 100%;
    width: 100%;
    object-fit: cover;
    object-position: top;
`;


