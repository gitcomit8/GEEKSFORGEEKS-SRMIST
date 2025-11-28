"use client";
import Link from 'next/link';
import GlassyNavbar from '../../components/GlassyNavbar';
import DotGrid from '../../components/DotGrid';

export default function HomePage() {
    return (
        <div style={{ width: '100%', minHeight: '100vh', position: 'relative' }}>
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <DotGrid
                    dotSize={3}
                    gap={15}
                    baseColor="#073b0d"
                    activeColor="#128224"
                    proximity={120}
                    shockRadius={250}
                    shockStrength={5}
                    resistance={750}
                    returnDuration={1.5}
                />
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <GlassyNavbar />

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '40px',
                    color: 'white'
                }}>
                    <h1 style={{
                        fontSize: '4rem',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        textAlign: 'center'
                    }}>
                        Welcome to GeeksForGeeks
                    </h1>

                    <h2 style={{
                        fontSize: '2rem',
                        marginBottom: '40px',
                        textAlign: 'center',
                        color: '#46b94e'
                    }}>
                        SRMIST NCR CHAPTER
                    </h2>

                    <p style={{
                        fontSize: '1.2rem',
                        maxWidth: '800px',
                        textAlign: 'center',
                        lineHeight: '1.8',
                        marginBottom: '40px'
                    }}>
                        Explore our community, learn together, and grow your coding skills with GeeksForGeeks SRMIST NCR Chapter.
                    </p>
                </div>
            </div>
        </div>
    );
}
