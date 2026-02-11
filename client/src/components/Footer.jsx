import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = ()=>{
    return (
        <footer className="bg-[#6A0DAD] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Organization Info */}
                    <div className="lg:col-span-2">
                        <div className="flex items-center space-x-3 mb-6">
                            <img
                                src="logo.svg"
                                alt="Logo"
                                className="h-20 w-auto "
                                loading="lazy"
                                decoding="async"
                                width={220}
                                height={80}
                            />
                        </div>
                        <p className="text-sm opacity-90 leading-relaxed mb-6 max-w-md">
                            Be the first to hear powerful stories, updates from the field,
                            and ways you can help empower women and girls—straight to your inbox.
                        </p>

                        {/* News Letter Sign Up*/}
                        <div className="space-y-3">
                            <h4 className="font-semibold">Stay Connected</h4>
                            <div className="flex space-x-2 max-w-sm">
                                <label htmlFor="email-address" className="sr-only">
                                    Email address
                                </label>
                                <input
                                    id="email-address"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    autoComplete="email"
                                    className="min-w-0 flex-auto rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:white sm:text-sm/6"
                                />
                                <button
                                    type="submit"
                                    className="flex-none rounded-md bg-yellow-400 px-3.5 py-2.5 text-sm font-semibold text-black shadow-xs hover:bg-yellow-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-yellow-700"
                                >
                                    Subscribe
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li className="opacity-90 hover:opacity-100 transition-smooth">About Us</li>
                            <li className="opacity-90 hover:opacity-100 transition-smooth">Our Work</li>
                            <li className="opacity-90 hover:opacity-100 transition-smooth">Success Stories</li>
                            <li className="opacity-90 hover:opacity-100 transition-smooth">Get Involved</li>
                            <li className="opacity-90 hover:opacity-100 transition-smooth">Donate</li>
                            <li className="opacity-90 hover:opacity-100 transition-smooth">Contact</li>
                        </ul>
                    </div>
                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold mb-4">Contact Us</h4>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center space-x-2">
                                <Mail className="h-4 w-4 opacity-75"/>
                                <span className="opacity-90">amosprosper214@gmail.com</span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Phone className="h-4 w-4 opacity-75"/>
                                <span className="opacity-90">+254 700 123 456</span>
                            </div>
                            <div className="flex items-start space-x-2">
                                <MapPin className="h-4 w-4 opacity-75 mt-0.5"/>
                                <span className="opacity-90">Nairobi, Kenya<br/>East Africa</span>
                            </div>
                        </div>

                        {/* Social Links */}
                        <div className="mt-6">
                            <h4 className="font-semibold mb-3">Follow Us</h4>
                            <div className="flex space-x-3">
                                <a href="#"
                                   className="p-2 bg-primary-foreground/10 rounded-lg hover:bg-primary-foreground/20 transition-smooth">
                                    <Facebook className="h-4 w-4"/>
                                </a>
                                <a href="#"
                                   className="p-2 bg-primary-foreground/10 rounded-lg hover:bg-primary-foreground/20 transition-smooth">
                                    <Twitter className="h-4 w-4"/>
                                </a>
                                <a href="#"
                                   className="p-2 bg-primary-foreground/10 rounded-lg hover:bg-primary-foreground/20 transition-smooth">
                                    <Instagram className="h-4 w-4"/>
                                </a>
                                <a href="#"
                                   className="p-2 bg-primary-foreground/10 rounded-lg hover:bg-primary-foreground/20 transition-smooth">
                                    <Linkedin className="h-4 w-4"/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-8 border-t border-primary-foreground/20 text-center text-sm opacity-75">
                    <p>&copy; 2024 Giving Her E.V.E. All rights reserved. Built with love for empowerment.</p>
                </div>
            </div>
        </footer>
    )
}
export default Footer;
