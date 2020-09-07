import {useState, useRef,useEffect} from "react";
import styled from 'styled-components'
import {
  useViewportScroll,
  motion,
  useTransform,
  useMotionValue,
  motionValue,
  useElementScroll,
} from "framer-motion";
import { Grid, Row, Col } from "react-styled-flexboxgrid";
import Image from '../components/Image';
import TextSplitting from '../components/TextSplitting';
// import ScrollContainer from '../components/ScrollContainer';
import { useInView } from "react-intersection-observer";


const variants = {
  visible: { opacity: 1, scale: 1, y: 0 },
  hidden: {
    opacity: 0,
    scale: 0.65,
    y: 50,
  },
};

export default function Landing() {


  return (
    // <ScrollContainer>
    <Grid>
      <Row>
        <Col md={12}>
          <TextSplitting style={{ marginTop: 72, marginBottom: 400 }}>
            Donec nibh ante, vehicula vitae lacus quis, fringilla bibendum orci.
            In eu semper orci, et gravida quam. Pellentesque placerat mi eu nunc
            ultrices molestie. Donec nibh ante, vehicula vitae lacus quis,
            fringilla bibendum orci. In eu semper orci, et gravida quam.
            Pellentesque placerat mi eu nunc ultrices molestie. Donec nibh ante,
            vehicula vitae lacus quis, fringilla bibendum orci. In eu semper
            orci, et gravida quam. Pellentesque placerat mi eu nunc ultrices
            molestie. Donec nibh ante, vehicula vitae lacus quis, fringilla
            bibendum orci. In eu semper orci, et gravida quam. Pellentesque
            placerat mi eu nunc ultrices molestie. Donec nibh ante, vehicula
            vitae lacus quis, fringilla bibendum orci. In eu semper orci, et
            gravida quam. Pellentesque placerat mi eu nunc ultrices molestie.
            Donec nibh ante, vehicula vitae lacus quis, fringilla bibendum orci.
            In eu semper orci, et gravida quam. Pellentesque placerat mi eu nunc
            ultrices molestie. Donec nibh ante, vehicula vitae lacus quis,
            fringilla bibendum orci. In eu semper orci, et gravida quam.
            Pellentesque placerat mi eu nunc ultrices molestie. fringilla
            bibendum orci. In eu semper orci, et
          </TextSplitting>
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


