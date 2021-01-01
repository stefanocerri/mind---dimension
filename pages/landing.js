import {useState, useRef,useEffect} from "react";
import styled from 'styled-components'
import {
  useViewportScroll,
  motion,
  useTransform,
  useSpring,
  useMotionValue,
  motionValue,
  useElementScroll,
} from "framer-motion";
import { Grid, Row, Col } from "react-styled-flexboxgrid";
import Image from '../components/Image';
import TextSplitting from '../components/TextSplitting';
import TextPathAnimation from '../components/TextPathAnimation';
import { useInView} from "react-intersection-observer";


const transition = {
  duration: 4,
  ease: "easeInOut",
  yoyo: Infinity,
};



const letter = "stneserP xaW lanrutcoN"

export default function Landing() {


   const { scrollY } = useViewportScroll();
   const [position, setPosition] = useState(0);

   const [isComplete, setIsComplete] = useState(false);
   const { scrollYProgress } = useViewportScroll();
   const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);
   const yRange = useTransform(scrollYProgress, [0, 1], [0, 1]);
   const pathLength = useSpring(yRange, { stiffness: 400, damping: 90 });


    useEffect(() => yRange.onChange((v) => setIsComplete(v >= 1)), [yRange]);

  return (
    // <ScrollContainer>
    <Grid>
      <Row>
        <Col md={12}>
          <TextSplitting style={{ marginTop: 72, marginBottom: 400 }}>
            Donec nibh ante, vehicula vitae lacus quis, fringilla bibendum orci.
            In eu semper orci, et gravida quam. Pellentesque placerat mi eu nunc
            ultrices molestie. Donec nibh ante
          </TextSplitting>
        </Col>

        <Col md={12}>
          <TextPathAnimation>Donec nibh ante, vehicula vit</TextPathAnimation>
          <svg
            data-filter-type="distortion"
            width="100%"
            viewBox="0 0 1000 200"
          >
            <motion.path
              id="text-curve2"
              d="M 0 50 Q 100 0 200 100 Q 300 200 650 50 C 750 0 750 150 1000 50"
              fill="none"
              stroke="red"
              style={{
                pathLength,
              }}
            />
            <text>
              <textPath href="#text-curve2" startOffset={position/2}>
                Dwell on the beauty of life. Watch the stars.
              </textPath>
            </text>
          </svg>
        </Col>

        {/*
        <motion.div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "25vh",
            height: "25vh",
            fontSize: 32,
            backgroundColor: "coral",
          }}
        >
          ciao
        </motion.div> */}

        <Col md={6}>
          <Image />
        </Col>

        <Col md={6}>
          <Image style={{ marginTop: 372 }} />
        </Col>

        <Col xs={12}>
          <TextSplitting style={{ marginBottom: 200 }}>
            Donec nibh ante, vehicula vitae lacus quis, fringilla bibendum orci.
            In eu semper orci, et gravida quam. Pellentesque placerat mi eu nunc
            ultrices molestie. Donec nibh ante, vehicula vitae lacus quis,
            fringilla bibendum orci. In eu semper orci, et gravida quam.
            Pellentesque placerat mi eu nunc ultrices molestie. Donec nibh ante,
            vehicula vitae lacus quis, fringilla bibendum orci. In eu semper
            orci,
          </TextSplitting>
        </Col>

        <Col xs={12}>
          <TextSplitting style={{ marginBottom: 244 }}>
            Donec nibh ante, vehicula vitae lacus quis, fringilla bibendum orci.
            In eu semper orci, et gravida quam. Pellentesque placerat mi eu nunc
            ultrices molestie. Donec nibh ante, vehicula vitae lacus quis,
            fringilla bibendum orci. In eu semper orci, et gravida quam.
            Pellentesque placerat mi eu nunc ultrices molestie. Donec nibh ante,
            vehicula vitae lacus quis, fringilla bibendum orci. In eu semper
            orci,
          </TextSplitting>
        </Col>
      </Row>
    </Grid>
    // </ScrollContainer>
  );
}

const StyledTextSplitting = styled(TextSplitting)`
  margin-top: 72;
  margin-bottom: 172;
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



