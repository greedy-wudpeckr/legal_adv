'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabaseClient';
import { useSearchParams } from 'next/navigation';

const EmailForm: React.FC<{ email?: string }> = ({ email: initialEmail }) => {
    const searchParams = useSearchParams();
    const email = searchParams.get('email') || '';
    const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleResend = async () => {
        if (!email) {
            setMessage('Email not found. Please go back and sign up again.');
            setStatus('error');
            return;
        }

        setStatus('sending');
        const { error } = await supabase.auth.resend({
            type: 'signup',
            email,
        });

        if (error) {
            setMessage(error.message);
            setStatus('error');
        } else {
            setMessage('Verification email resent!');
            setStatus('sent');
        }
    };

    return (
        <div className="flex justify-center items-center bg-black h-screen">
            <div className="z-50 bg-white p-8 border rounded-md w-96 h-[515px]">
                <div className="flex justify-center items-center">
                    <Image src="https://i.imgur.com/2OJ5KPK.png" alt="EmailSentIcon" width={100} height={100} />
                </div>
                <div className="mt-8">
                    <p className="mb-3 font-semibold text-black text-2xl text-center">Check your email</p>
                    <p className="mb-6 text-gray-500 text-sm text-center">
                        We have sent a confirmation link to <span className="font-semibold">{email}</span>
                    </p>
                </div>
                <button
                    type="submit"
                    className="bg-gray-800 hover:bg-gray-900 py-2 rounded-md focus:outline-none w-full text-white"
                    style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)' }}
                    onClick={() => window.location.href = 'mailto:'}
                >
                    <span className="font-medium">Open email app</span>
                </button>

                <div className="flex justify-center items-center gap-1 mt-10">
                    <span className="text-gray-500 text-sm">Didn't receive the email?</span>
                    <span
                        onClick={handleResend}
                        className="text-black text-sm hover:underline cursor-pointer"
                    >
                        {status === 'sending' ? 'Resending...' : 'Resend'}
                    </span>
                </div>

                {message && (
                    <p
                        className={`mt-3 text-sm text-center ${status === 'error' ? 'text-red-500' : 'text-green-400'
                            }`}
                    >
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
};

export default EmailForm;