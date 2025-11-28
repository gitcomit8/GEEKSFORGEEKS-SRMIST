"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from 'contentful';
import GlassyNavbar from '../../components/GlassyNavbar';
import DotGrid from '../../components/DotGrid';

// Initialize Contentful Client
// Note: In a real app, use environment variables.
const client = createClient({
    space: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || 'your_space_id',
    accessToken: process.env.NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN || 'your_access_token',
});

export default function TeamPage() {
    const [selectedYear, setSelectedYear] = useState(2025);
    const [leads, setLeads] = useState([]);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    const years = [2025, 2024, 2023];

    useEffect(() => {
        const fetchTeam = async () => {
            setLoading(true);
            try {
                const response = await client.getEntries({
                    content_type: 'memberProfile',
                    'fields.year': selectedYear,
                });

                const allMembers = response.items.map(item => ({
                    name: item.fields.name,
                    role: item.fields.role,
                    // Add other fields if needed, e.g., image
                }));

                // Sort/Group Logic
                const leadsData = [];
                const membersData = [];

                allMembers.forEach(member => {
                    const role = member.role.toLowerCase();
                    if (role.includes('president') || role.includes('vice president')) {
                        leadsData.push(member);
                    } else {
                        membersData.push(member);
                    }
                });

                // Sort Leads: President first
                leadsData.sort((a, b) => {
                    if (a.role.toLowerCase().includes('president') && !a.role.toLowerCase().includes('vice')) return -1;
                    if (b.role.toLowerCase().includes('president') && !b.role.toLowerCase().includes('vice')) return 1;
                    return 0;
                });

                setLeads(leadsData);
                setMembers(membersData);
            } catch (error) {
                console.error("Error fetching team:", error);
                // Fallback for demo if fetch fails
                setLeads([]);
                setMembers([]);
            } finally {
                setLoading(false);
            }
        };

        fetchTeam();
    }, [selectedYear]);

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

                {/* Cabinet Toggle */}
                <div style={{
                    display: 'flex',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    borderRadius: '50px',
                    padding: '5px',
                    marginBottom: '40px',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                }}>
                    {years.map(year => (
                        <button
                            key={year}
                            onClick={() => setSelectedYear(year)}
                            style={{
                                background: selectedYear === year ? '#46b94e' : 'transparent',
                                color: 'white',
                                border: 'none',
                                padding: '10px 20px',
                                borderRadius: '40px',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: selectedYear === year ? 'bold' : 'normal',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            {year === 2025 ? 'Current' : year}
                        </button>
                    ))}
                </div>

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

                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <>
                        {/* Section 1: Leads */}
                        {leads.length > 0 && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '30px',
                                maxWidth: '800px', // Slightly narrower for leads to center them
                                width: '100%',
                                marginBottom: '40px',
                                justifyContent: 'center'
                            }}>
                                {leads.map((member, index) => (
                                    <MemberCard key={`lead-${index}`} member={member} />
                                ))}
                            </div>
                        )}

                        {/* Section 2: Members */}
                        {members.length > 0 && (
                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                gap: '30px',
                                maxWidth: '1200px',
                                width: '100%'
                            }}>
                                {members.map((member, index) => (
                                    <MemberCard key={`member-${index}`} member={member} />
                                ))}
                            </div>
                        )}

                        {leads.length === 0 && members.length === 0 && (
                            <p>No team members found for this year.</p>
                        )}
                    </>
                )}
            </div></div>
        </div>
    );
}

// Helper Component for Card to reuse styles
function MemberCard({ member }) {
    return (
        <div style={{
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
    );
}
