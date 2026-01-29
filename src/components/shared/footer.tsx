import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Car } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-100 border-t border-gray-200 pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center gap-2">
                            <Car className="h-6 w-6" />
                            <span className="text-xl font-bold tracking-tight">Ride</span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed">
                            Experience the freedom of the road with the best car sharing platform in Sri Lanka. Reliable, affordable, and easy.
                        </p>
                        <div className="flex space-x-6">
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Facebook">
                                <Facebook size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Twitter">
                                <Twitter size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="Instagram">
                                <Instagram size={20} />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-primary transition-colors" aria-label="LinkedIn">
                                <Linkedin size={20} />
                            </a>
                        </div>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-gray-900">Company</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
                            <li><Link href="/press" className="hover:text-primary transition-colors">Press</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-gray-900">Support</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/help" className="hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/trust" className="hover:text-primary transition-colors">Trust & Safety</Link></li>
                        </ul>
                    </div>

                    {/* Hosting Links */}
                    <div>
                        <h4 className="font-semibold mb-4 text-gray-900">Hosting</h4>
                        <ul className="space-y-2 text-sm text-gray-500">
                            <li><Link href="/host" className="hover:text-primary transition-colors">Become a Host</Link></li>
                            <li><Link href="/host/insurance" className="hover:text-primary transition-colors">Insurance</Link></li>
                            <li><Link href="/host/resources" className="hover:text-primary transition-colors">Host Resources</Link></li>
                            <li><Link href="/host/community" className="hover:text-primary transition-colors">Community</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-gray-200 pt-8 flex flex-col md:flex-row justify-center items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} Ride Inc. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}
