import TeamRegistrationForm from '@/app/components/TeamRegistrationForm';
import Squares from '@/app/components/Squares';
import { Suspense } from 'react';

function RegistrationFormWrapper() {
    return <TeamRegistrationForm />;
}

export default function TeamRegisterPage() {
    return (
        <div className="min-h-screen pt-24 pb-10 px-4 bg-black relative">
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
                <Squares
                    speed={0.5}
                    squareSize={40}
                    direction='diagonal'
                    borderColor='#333'
                    hoverFillColor='#222'
                />
            </div>
            <div className="relative z-10">
                <Suspense fallback={
                    <div className="flex justify-center items-center min-h-screen">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#46b94e]"></div>
                    </div>
                }>
                    <RegistrationFormWrapper />
                </Suspense>
            </div>
        </div>
    );
}
