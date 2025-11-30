"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { contentfulClient } from '@/lib/contentful';
import Link from 'next/link';
import { Calendar, MapPin, Clock, ArrowLeft, Image as ImageIcon, Ticket } from 'lucide-react';
import moment from 'moment';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

export default function EventDetailsPage() {
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

    const { title, date, venue, coverImage, description, galleryImages, isRegistrationOpen } = event.fields;

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="max-w-5xl mx-auto px-6">
                <Link href="/pages/events" className="inline-flex items-center gap-2 text-gray-400 hover:text-[#46b94e] mb-8 transition-colors">
                    <ArrowLeft size={20} /> Back to Events
                </Link>

                {/* Hero Section */}
                <div className="relative rounded-3xl overflow-hidden aspect-[21/9] mb-12 group">
                    <img
                        src={coverImage?.fields?.file?.url ? `https:${coverImage.fields.file.url}` : '/placeholder.jpg'}
                        alt={title}
                        className="object-cover w-full h-full"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">{title}</h1>
                        <div className="flex flex-wrap gap-6 text-lg text-gray-200">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                                <Calendar size={20} className="text-[#46b94e]" />
                                {moment(date).format('MMMM D, YYYY')}
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                                <Clock size={20} className="text-[#46b94e]" />
                                {moment(date).format('h:mm A')}
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md">
                                <MapPin size={20} className="text-[#46b94e]" />
                                {venue}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
                            <h2 className="text-2xl font-bold mb-6 text-[#46b94e]">About Event</h2>
                            <div className="prose prose-invert prose-lg max-w-none text-gray-300">
                                {documentToReactComponents(description)}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Actions */}
                    <div className="space-y-6">
                        {isRegistrationOpen && (
                            <div className="bg-gradient-to-br from-[#46b94e]/20 to-emerald-900/20 border border-[#46b94e]/30 rounded-2xl p-6 backdrop-blur-sm">
                                <h3 className="text-xl font-bold mb-2">Registration Open!</h3>
                                <p className="text-gray-400 mb-6 text-sm">Secure your spot for this event now.</p>
                                <Link
                                    href={`/pages/events/${slug}/register`}
                                    className="w-full flex items-center justify-center gap-2 bg-[#46b94e] text-black font-bold py-4 rounded-xl hover:bg-[#3da544] transition-all hover:scale-[1.02] shadow-lg shadow-green-500/20"
                                >
                                    <Ticket size={20} />
                                    Register Now
                                </Link>
                            </div>
                        )}

                        {galleryImages && galleryImages.length > 0 && (
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">
                                <h3 className="text-xl font-bold mb-2">Event Gallery</h3>
                                <p className="text-gray-400 mb-6 text-sm">Check out photos from this event.</p>
                                <Link
                                    href={`/pages/events/${slug}/gallery`}
                                    className="w-full flex items-center justify-center gap-2 bg-white/10 text-white font-bold py-4 rounded-xl hover:bg-white/20 transition-all border border-white/10"
                                >
                                    <ImageIcon size={20} />
                                    View Gallery
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
