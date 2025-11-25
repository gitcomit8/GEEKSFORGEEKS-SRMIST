import { currentMembers } from "api/MemberAPI";
import styles from "styles/Home/Team.module.css";
import CircularGallery from "../Elements/CircularGallery";
import React, { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Team = () => {
  const sectionRef = useRef(null);
  const galleryRef = useRef(null);

  const allMembers = [
    ...currentMembers.chapterLead,
    ...currentMembers.leadList
  ].slice(0, 8);

  const galleryItems = allMembers.map(member => ({
    image: `/images/Team/${member.img}`,
    text: member.name
  }));

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const gallery = galleryRef.current;

    if (!section || !gallery) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "+=150%", // Faster scroll (less distance to scroll)
      pin: true,
      scrub: 0, // Instant response (no lag)
      onUpdate: (self) => {
        if (gallery.setScrollProgress) {
          gallery.setScrollProgress(self.progress);
        }
      }
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} id="Team" style={{ height: '100vh', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <h2 className="section-title" style={{ position: 'absolute', top: '2%', width: '100%', textAlign: 'center', zIndex: 10 }}>Our Team</h2>
      <div style={{ width: '100%', height: '65%', marginTop: '5%' }}>
        <CircularGallery
          ref={galleryRef}
          items={galleryItems}
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          enableGestures={false}
        />
      </div>
      <div className={styles.container} style={{ position: 'absolute', bottom: '5%', width: '100%', justifyContent: 'center', display: 'flex', zIndex: 10 }}>
        <Link href="/Core-Team-22" style={{ textDecoration: "none" }}>
          <button className={styles.container1}>Previous Members</button>
        </Link>
      </div>
    </section>
  );
};

export default Team;
