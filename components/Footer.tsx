import React from 'react';

import Link from 'next/link';
import { IconBrandGithub, IconBrandInstagram } from "@tabler/icons-react"
const navigationLinks = [
    { href: "/apnawakeel", label: "Law" },
    { href: "/apnihistory", label: "History" },
    { href: "/contact", label: "Contact" },
];

const socialLinks = [
    { href: "https://www.instagram.com/pclubuiet/", icon: <IconBrandInstagram size={24} />, hoverColor: "text-pink-500 " },
    { href: "https://github.com/pclub-uiet", icon: <IconBrandGithub size={24} />, hoverColor: "text-gray-600" },
];

export const Footer = () => {
    return (
        <footer className="bg-white text-gray-900">
            <div className="px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex sm:flex-row flex-col justify-between items-center space-y-6 sm:space-y-0">
                    {/* Logo */}
                    <div className="font-bold text-xl">
                        <Link href="/" className="font-grotesk text-orange hover:text-orange-500">
                            Eduverse
                        </Link>
                    </div>
                    {/* Navigation Links */}
                    <div className="flex flex-wrap justify-center space-x-6 text-sm">
                        {navigationLinks.map((link) => (
                            <Link key={link.href} href={link.href} className="hover:text-gray-600">
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="flex sm:flex-row flex-col justify-between items-center gap-3 sm:gap-0 mt-5 py-5 border-gray-200 border-t">
                    <div className="text-gray-600 text-sm text-center">
                        <p>&copy; {new Date().getFullYear()} Eduverse. All rights reserved.</p>
                    </div>
                    {/* Social Icons */}
                    <div className="flex flex-wrap justify-center space-x-4 text-gray-700">
                        {socialLinks.map((social) => (
                            <a
                                key={social.href}
                                href={social.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`hover:${social.hoverColor || 'text-gray-600'}`}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </footer>
    );
};