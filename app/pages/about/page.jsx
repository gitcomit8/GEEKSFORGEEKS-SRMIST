"use client";
import Link from 'next/link';
import GlassyNavbar from '../../components/GlassyNavbar';

export default function HomePage() {
    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
            position: 'relative'
        }}>
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
    );
}
