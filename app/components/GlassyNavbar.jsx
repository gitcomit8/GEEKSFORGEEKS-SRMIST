"use client";
import { Logo } from "../logo/logo";
import Link from "next/link";
import { useState } from "react";
import DecryptedText from "./DecryptedText";

export default function GlassyNavbar() {
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const navItems = [
        { label: 'About', href: '/pages/about' },
        { label: 'Events', href: '/pages/events' },
        { label: 'Team', href: '/pages/team' },
        { label: 'Challenges', href: '/pages/challenges' }
    ];

    return (
        <nav style={{
            position: 'fixed',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '85%',
            maxWidth: '1100px',
            height: '70px',
            background: 'rgba(255, 255, 255, 0.03)',
            backdropFilter: 'blur(25px) saturate(180%)',
            WebkitBackdropFilter: 'blur(25px) saturate(180%)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '40px',
            boxShadow: `
        0 20px 40px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
        inset 0 0 20px rgba(255, 255, 255, 0.02)
      `,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 40px',
            zIndex: 1000
        }}>
            {/* Left side - Logo */}
            <div style={{
                display: 'flex',
                alignItems: 'center',
                flex: '0 0 auto',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
            }}>
                <Logo />
            </div>

            {/* Center - Navigation Links */}
            <div style={{
                display: 'flex',
                gap: '12px',
                alignItems: 'center',
                justifyContent: 'center',
                flex: '1'
            }}>
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        href={item.href}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '10px 28px',
                            fontSize: '18px',
                            fontFamily: 'var(--font-roboto-slab), serif',
                            fontWeight: '500',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '30px',
                            transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
                            background: hoveredIndex === index
                                ? '#2f8d46'
                                : 'transparent',
                            backdropFilter: hoveredIndex === index ? 'blur(10px)' : 'none',
                            border: hoveredIndex === index
                                ? '1px solid #2f8d46'
                                : '1px solid transparent',
                            transform: hoveredIndex === index ? 'scale(1.05)' : 'scale(1)',
                            boxShadow: hoveredIndex === index
                                ? '0 8px 20px rgba(0, 0, 0, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
                                : 'none',
                            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                        }}
                    >
                        <DecryptedText
                            text={item.label}
                            animate={hoveredIndex === index}
                            animateOn="hover"
                            revealDirection="center"
                            speed={40}
                            maxIterations={15}
                            characters="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+"
                            className="revealed"
                            parentClassName="all-letters"
                            encryptedClassName="encrypted"
                        />
                    </Link>
                ))}
            </div>

            {/* Right side - Empty for balance */}
            <div style={{
                flex: '0 0 auto',
                width: '60px'
            }} />
        </nav >
    );
}
