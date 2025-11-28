import { GridScan } from './components/GridScan';
import { Logo2 } from "./logo/logo2";
import FuzzyText from "./components/FuzzyText";
import GlassyNavbar from "./components/GlassyNavbar";
import LogoLoop from './components/LogoLoop';
import { SiInstagram, SiGithub, SiLinkedin, SiDiscord } from 'react-icons/si';

import DecryptedText from './components/DecryptedText';


export default function Home() {
  const socialLogos = [
    { node: <SiInstagram color="#ffffff" />, title: "Instagram", href: "https://www.instagram.com/gfg_srmist_ncr" },
    { node: <SiGithub color="#ffffff" />, title: "GitHub", href: "https://github.com/GEEKSFORGEEKS-SRMIST-NCR" },
    { node: <SiLinkedin color="#ffffff" />, title: "LinkedIn", href: "https://www.linkedin.com/company/gfgsrmist/" },
    { node: <SiDiscord color="#ffffff" />, title: "Discord", href: "https://discord.com/invite/jSCXs8tV" },
    { node: <SiInstagram color="#ffffff" />, title: "Instagram", href: "https://www.instagram.com/gfg_srmist_ncr" },
    { node: <SiGithub color="#ffffff" />, title: "GitHub", href: "https://github.com/GEEKSFORGEEKS-SRMIST-NCR" },
    { node: <SiLinkedin color="#ffffff" />, title: "LinkedIn", href: "https://www.linkedin.com/company/gfgsrmist/" },
    { node: <SiDiscord color="#ffffff" />, title: "Discord", href: "https://discord.com/invite/jSCXs8tV" },
  ];

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Glassy Navbar */}
      <GlassyNavbar />

      {/* GridScan Background */}
      <GridScan
        className="w-full h-full"
        style={{ width: '100%', height: '100vh', position: 'absolute', top: 0, left: 0 }}
        sensitivity={0.55}
        lineThickness={1}
        linesColor="#ffffff"
        gridScale={0.1}
        scanColor="#157415"
        scanOpacity={0.4}
        enablePost
        bloomIntensity={0.6}
        chromaticAberration={0.000}
        noiseIntensity={0.01}
      />

      {/* Center Content */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '40px'
      }}>
        {/* GeeksForGeeks Logo - positioned higher */}
        <div style={{
          width: '700px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: '-80px'
        }}>
          <Logo2 />
        </div>

        {/* SRMIST Text - below the logo */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <FuzzyText
            fontSize="3rem"
            baseIntensity={0.1}
            hoverIntensity={0.2}
            enableHover={true}
            color="#ffffff"
          >
            SRMIST NCR CHAPTER
          </FuzzyText>

        </div>
      </div>

      {/* Social Media Logo Loop - Bottom */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: '0',
        width: '100%',
        zIndex: 20
      }}>
        <LogoLoop
          logos={socialLogos}
          speed={50}
          direction="left"
          logoHeight={32}
          gap={60}
          hoverSpeed={0}
          scaleOnHover
          fadeOut={true}
          fadeOutColor="rgba(0,0,0,0)"
          ariaLabel="Social Media Links"
        />
      </div>

      {/* Copyright Footer */}
      <div style={{
        position: 'absolute',
        bottom: '10px',
        width: '100%',
        textAlign: 'center',
        zIndex: 20,
        color: 'rgba(255, 255, 255, 0.6)',
        fontSize: '12px',
        fontFamily: 'var(--font-geist-sans), sans-serif'
      }}>
        <p>&#9426; Copyrights 2026 by GFG SRMIST DELHI NCR. All Rights Reserved.</p>
      </div>
    </div>
  );
}
