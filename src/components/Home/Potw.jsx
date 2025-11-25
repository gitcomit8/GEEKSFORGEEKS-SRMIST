import React from "react";
import styles from "styles/Home/Potw.module.css";
import { PotwCard } from "./Card";
import TiltedCard from '../Elements/TiltedCard';
import { useEffect, useState } from "react";
import { getPotwData } from "../../utils/contentful";
import Squares from '../Elements/Squares';


const Potw = () => {
  const [potwData, setPotwData] = useState({
    name: "",
    position: "",
    img: "",
  });

  useEffect(() => {
    getPotwData().then(setPotwData);
  }, []);

  return (
    <section
      id="Potw"
      className={`${styles.potwSection} relative overflow-hidden`}
    >
      {/* Sparkles Background */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Squares
          speed={0.5}
          squareSize={40}
          direction='diagonal' // up, down, left, right, diagonal
          borderColor='#fff'
          hoverFillColor='#222'
        />

      </div>



      {/* Content */}
      <div className={`relative z-10 ${styles.contentWrapper}`}>
        <h2 className="section-title text-white">Performer of the Week</h2>
        <div className={styles.container}>
          <div className={styles.cardWrapper}>
            <div className={styles.cardBorder}>

              <TiltedCard
                imageSrc={potwData.img}
                altText={potwData.name}
                captionText={`${potwData.name} (${potwData.position})`}
                containerHeight="300px"
                containerWidth="100%"
                imageHeight="300px"
                imageWidth="300px"
                scaleOnHover={1.1}
                rotateAmplitude={14}
                showMobileWarning={true}
                showTooltip={true}
                overlayContent={null}
                displayOverlayContent={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Potw;
