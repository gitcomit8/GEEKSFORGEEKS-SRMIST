"use client";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { contentfulClient } from '@/lib/contentful';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function EventGalleryPage() {
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

    const { title, galleryImages } = event.fields;

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-6">
                <Link href={`/pages/events/${slug}`} className="inline-flex items-center gap-2 text-gray-400 hover:text-[#46b94e] mb-8 transition-colors">
                    <ArrowLeft size={20} /> Back to Event Details
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-[#46b94e] to-emerald-400">
                    {title} Gallery
                </h1>

                {galleryImages && galleryImages.length > 0 ? (
                    <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                        {galleryImages.map((image, index) => (
                            <div key={image.sys.id} className="break-inside-avoid relative group rounded-2xl overflow-hidden bg-white/5 border border-white/10">
                                <img
                                    src={`https:${image.fields.file.url}`}
                                    alt={image.fields.title || `Gallery Image ${index + 1}`}
                                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-500 bg-white/5 rounded-2xl border border-white/10">
                        No images available for this event.
                    </div>
                )}
            </div>
        </div>
    );
}
