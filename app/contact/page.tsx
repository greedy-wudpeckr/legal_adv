'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Footer } from '@/components/Footer';
import { Navbar } from '@/components/ui/resizable-navbar';
import { ShimmerButton } from '@/components/ui/shimmer-button';
import { zodResolver } from '@hookform/resolvers/zod';

const ContactFormSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    message: z.string().min(1, 'Message is required'),
});

type ContactFormType = z.infer<typeof ContactFormSchema>;

export default function Contact() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormType>({
        resolver: zodResolver(ContactFormSchema),
    });

    const onSubmit = async (data: ContactFormType) => {
        try {
            router.push('/');
            reset();
        } catch (error) {
            console.error('Submission error:', error);
        }
    };

    return (
        <>
            <Navbar />
            <div className="flex justify-center items-center px-4 py-20 min-h-screen font-inter">
                <div className="relative bg-white shadow-lg rounded-2xl w-full max-w-lg">
                    {/* Background layer */}
                    <div className="hidden sm:block z-0 absolute inset-0 bg-black rounded-2xl rotate-6 transform"></div>
                    <div className="z-20 relative bg-white sm:p-10 px-4 py-10 rounded-2xl">
                        <h2 className="z-10 relative flex flex-col font-semibold text-gray-800 text-xl">
                            <span className="font-grotesk font-bold text-orange text-2xl text-center">Contact Us</span>
                            <span className="w-full text-sm text-center">Fill in your message & contact info.</span>
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)} className="z-10 relative space-y-5 mt-6">
                            <div>
                                <label htmlFor="name" className="block font-medium text-gray-700 text-sm">
                                    Name
                                </label>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="Type your name"
                                    className="bg-gray-100 mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 w-full text-black sm:text-sm"
                                    {...register('name')}
                                />
                                {errors.name && <p className="mt-1 text-red-500 text-sm">{errors.name.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="email" className="block font-medium text-gray-700 text-sm">
                                    Email
                                </label>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="Type your email"
                                    className="bg-gray-100 mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 w-full text-black sm:text-sm"
                                    {...register('email')}
                                />
                                {errors.email && <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>}
                            </div>

                            <div>
                                <label htmlFor="message" className="block font-medium text-gray-700 text-sm">
                                    Your Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    placeholder="Type your message"
                                    className="bg-gray-100 mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-slate-500 w-full text-black sm:text-sm resize-none"
                                    {...register('message')}
                                ></textarea>
                                {errors.message && <p className="mt-1 text-red-500 text-sm">{errors.message.message}</p>}
                            </div>

                            <button type="submit" className="w-full" disabled={isSubmitting}>
                                <ShimmerButton>{isSubmitting ? 'Sending...' : 'Send Message'}</ShimmerButton>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
}