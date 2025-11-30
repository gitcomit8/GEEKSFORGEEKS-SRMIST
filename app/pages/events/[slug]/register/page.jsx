"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { contentfulClient } from '@/lib/contentful';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import EventRegistrationForm from '@/app/components/EventRegistrationForm';

export default function EventRegistrationPage() {
    const { slug } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const response = await contentfulClient.getEntries({
                    content_type: 'event',
                    'fields.slug': slug,
                    limit: 1,
                });
                if (response.items.length > 0) {
                    setEvent(response.items[0]);
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchEvent();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-black flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#46b94e]"></div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-black flex flex-col justify-center items-center text-white">
                <h1 className="text-3xl font-bold mb-4">Event Not Found</h1>
                <Link href="/pages/events" className="text-[#46b94e] hover:underline">Back to Events</Link>
            </div>
        );
    }

    const { title } = event.fields;

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="max-w-3xl mx-auto px-6">
                <Link href={`/pages/events/${slug}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#46b94e] mb-8 transition-colors">
                    <ArrowLeft size={20} /> Back to Event Details
                </Link>

                <div className="mb-8 text-center">
                    <h1 className="text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#46b94e] to-emerald-400">
                        Register for {title}
                    </h1>
                    <p className="text-gray-400">Fill out the form below to secure your spot.</p>
                </div>

                <EventRegistrationForm eventName={title} />
            </div>
        </div>
    );
}
