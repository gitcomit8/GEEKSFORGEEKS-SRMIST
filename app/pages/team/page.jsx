"use client";
import GlassyNavbar from '../../components/GlassyNavbar';

export default function TeamPage() {
    const teamMembers = [
        { name: 'Team Lead', role: 'President' },
        { name: 'Tech Lead', role: 'Vice President' },
        { name: 'Event Manager', role: 'Events Head' },
        { name: 'Content Creator', role: 'Content Head' }
    ];

    return (
        <div style={{
            width: '100%',
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 50%, #2c3e50 100%)',
            position: 'relative'
        }}>
            <GlassyNavbar />

            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                padding: '140px 40px 40px 40px',
                color: 'white'
            }}>
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: 'bold',
                    marginBottom: '20px',
                    textAlign: 'center',
                    color: '#46b94e'
                }}>
                    Our Team
                </h1>

                <p style={{
                    fontSize: '1.3rem',
                    maxWidth: '900px',
                    textAlign: 'center',
                    lineHeight: '1.8',
                    marginBottom: '60px',
                    opacity: 0.9
                }}>
                    Meet the passionate individuals driving GeeksForGeeks SRMIST NCR Chapter forward.
                </p>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '30px',
                    maxWidth: '1200px',
                    width: '100%'
                }}>
                    {teamMembers.map((member, index) => (
                        <div key={index} style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.18)',
                            borderRadius: '20px',
                            padding: '40px 30px',
                            textAlign: 'center',
                            transition: 'transform 0.3s ease'
                        }}>
                            <div style={{
                                width: '100px',
                                height: '100px',
                                borderRadius: '50%',
                                background: 'linear-gradient(135deg, #46b94e 0%, #36a234 100%)',
                                margin: '0 auto 20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                fontWeight: 'bold'
                            }}>
                                {member.name.charAt(0)}
                            </div>
                            <h3 style={{ fontSize: '1.3rem', marginBottom: '10px' }}>{member.name}</h3>
                            <p style={{ opacity: 0.7, color: '#46b94e' }}>{member.role}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
