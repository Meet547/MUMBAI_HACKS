import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronDown, ArrowRight, CheckCircle, Menu, X, MessageCircle } from 'lucide-react';
import Footer from '../components/Footer';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('user_email') : null;
    if (token && storedEmail) {
      setIsLoggedIn(true);
      setEmail(storedEmail);
    }
  }, []);

  // IntersectionObserver to update active nav item
  useEffect(() => {
    const ids = ['products', 'customers', 'pricing'];
    const els = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!els.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            setCurrentSection(id);
          }
        });
      },
      { root: null, rootMargin: '0px 0px -40% 0px', threshold: 0.15 }
    );

    els.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleStartTrial = () => {
    if (isLoggedIn) {
      router.push('/chat');
    } else {
      router.push('/signup');
    }
  };

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
      } border-b border-gray-200`}>
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <div className="text-xl lg:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                Draftzi
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center justify-center flex-1 space-x-8">
              <button
                onClick={() => {
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`text-sm font-medium flex items-center transition-colors group ${currentSection === 'products' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Products 
                <ChevronDown className="ml-1 w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`text-sm font-medium flex items-center transition-colors group ${currentSection === 'products' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Solutions 
                <ChevronDown className="ml-1 w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
              <button
                onClick={() => {
                  const el = document.getElementById('customers');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`text-sm font-medium transition-colors ${currentSection === 'customers' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Customers
              </button>
              {/* Resources removed per request */}
              <button
                onClick={() => {
                  const el = document.getElementById('pricing');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`text-sm font-medium transition-colors ${currentSection === 'pricing' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Pricing
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4 flex-shrink-0">
              {isLoggedIn ? (
                <div className="flex items-center space-x-4">
                  {/* User Profile Display */}
                  <div className="flex items-center space-x-3 px-4 py-2 bg-slate-50 rounded-lg border border-slate-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {email.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-700">{email}</span>
                  </div>
                  {/* Logout Button */}
                  <button
                    onClick={() => {
                      localStorage.removeItem('auth_token');
                      localStorage.removeItem('user_email');
                      setIsLoggedIn(false);
                      setEmail('');
                      // reload to reset state across components
                      window.location.reload();
                    }}
                    className="px-5 py-2 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 font-medium text-sm"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleStartTrial}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center group shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    {isLoggedIn ? 'Start AI Chat' : 'Start free trial'}
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </button>
                  <button
                    onClick={() => router.push('/login')}
                    className="px-5 py-2.5 border-2 border-gray-300 rounded-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    View demo
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}>
          <div className="px-4 pt-2 pb-6 space-y-3 bg-white border-t border-gray-200">
            <button
              onClick={() => {
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between"
            >
              Products <ChevronDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                setIsMenuOpen(false);
              }}
              className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors flex items-center justify-between"
            >
              Solutions <ChevronDown className="w-4 h-4" />
            </button>
            <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Customers
            </a>
            {/* Resources removed per request */}
            <a href="#" className="block px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
              Pricing
            </a>
            <div className="pt-4 space-y-2">
              {isLoggedIn ? (
                <>
                  <button
                    onClick={() => {
                      localStorage.removeItem('auth_token');
                      localStorage.removeItem('user_email');
                      setIsLoggedIn(false);
                      setEmail('');
                      setIsMenuOpen(false);
                      window.location.reload();
                    }}
                    className="w-full px-5 py-3 border-2 border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { handleStartTrial(); setIsMenuOpen(false); }}
                    className="w-full px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    Start free trial <ArrowRight className="ml-2 w-4 h-4" />
                  </button>
                  <button
                    onClick={() => { router.push('/login'); setIsMenuOpen(false); }}
                    className="w-full px-5 py-3 border-2 border-gray-300 rounded-lg hover:border-blue-600 transition-colors"
                  >
                    View demo
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-16 lg:h-20"></div>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Trust Badge */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <div className="inline-flex items-center px-4 py-2 bg-blue-600/10 border border-blue-500/20 rounded-full text-sm text-blue-300 backdrop-blur-sm">
              <CheckCircle className="w-4 h-4 mr-2" />
              <span className="font-medium">Trusted by 500+ Law Firms & CA Practices</span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 animate-fade-in leading-tight tracking-tight">
            Legal Document Automation<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">Built for Compliance Professionals</span>
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-slate-300 mb-10 sm:mb-12 max-w-3xl mx-auto animate-fade-in-delay px-4 leading-relaxed">
            Transform weeks of documentation into minutes. Generate contracts, compliance letters, and reports with AI—maintaining accuracy and regulatory standards.
          </p>
          
          {/* CTA Section */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 animate-fade-in-delay-2">
            <button
              onClick={handleStartTrial}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300 inline-flex items-center shadow-lg hover:shadow-xl hover:scale-105"
            >
              {isLoggedIn ? 'Access Dashboard' : 'Start Free 14-Day Trial'}
              <ArrowRight className="w-5 h-5 ml-2" />
            </button>
            <button
              onClick={() => router.push('/login')}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white px-8 py-4 rounded-lg text-base font-semibold transition-all duration-300"
            >
              View Live Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400 mb-12 animate-fade-in-delay-2">
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              <span>SOC 2 Type II Compliant</span>
            </div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
              <span>GDPR Ready</span>
            </div>
          </div>
          
          {/* Product Screenshot */}
          <div className="bg-white/5 backdrop-blur-sm rounded-xl shadow-2xl p-2 sm:p-4 max-w-5xl mx-auto border border-white/10 animate-fade-in-delay-2">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg aspect-video flex items-center justify-center text-slate-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent"></div>
              <div className="text-center p-4 relative z-10">
                <div className="text-sm font-medium text-slate-300 mb-2">Enterprise Dashboard</div>
                <div className="text-xs text-slate-500">Client Vault • Compliance Calendar • AI Document Generation</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customers section anchor */}
      <div id="customers"></div>

      {/* Technologies Used */}
      <section className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-center text-xs sm:text-sm font-semibold tracking-wider mb-6 sm:mb-8 animate-fade-in">
          TECHNOLOGIES USED
          </p>
          <div className="flex justify-center items-center gap-8 sm:gap-12 lg:gap-16 flex-wrap">
            {[
              { name: 'React', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
              { name: 'Next.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
              { name: 'Node.js', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
              { name: 'Supabase', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg' },
              { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
              { name: 'TailwindCSS', logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
            ].map((tech, i) => (
              <div 
                key={tech.name} 
                className="flex flex-col items-center gap-2 group cursor-pointer animate-fade-in"
                style={{animationDelay: `${i * 0.1}s`}}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 flex items-center justify-center p-2 bg-white/10 rounded-lg group-hover:bg-white/20 transition-all duration-300">
                  <img 
                    src={tech.logo} 
                    alt={tech.name}
                    className="w-full h-full object-contain filter brightness-0 invert opacity-70 group-hover:opacity-100 transition-opacity"
                  />
                </div>
                <span className="text-gray-400 text-xs sm:text-sm font-medium group-hover:text-white transition-colors">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Automation Section */}
      <section id="products" className="bg-gradient-to-b from-white via-blue-50/50 to-white px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16 sm:mb-20">
            <span className="bg-blue-100 text-blue-700 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide animate-fade-in uppercase">
              AI-Powered Automation
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-6 sm:mt-8 mb-5 sm:mb-6 animate-fade-in-delay leading-tight px-4 text-slate-900">
              Draftzi turns weeks of documentation into minutes —<br className="hidden lg:block" />
              from contracts to compliance letters to reports.
            </h2>
            <p className="text-lg sm:text-xl text-slate-600 mb-8 sm:mb-10 animate-fade-in-delay-2 px-4 max-w-3xl mx-auto leading-relaxed">
              Trusted by modern law firms, CA practices, and fast-growing businesses
            </p>
            <button
              onClick={() => router.push('/compliance')}
              className="text-blue-600 font-semibold inline-flex items-center justify-center hover:text-blue-700 group animate-fade-in-delay-3 text-base"
            >
              Explore Compliance Calendar
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          {/* Bot Interface Placeholder */}
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-8 max-w-2xl mx-auto mb-16 sm:mb-20 border border-slate-200 animate-fade-in-up hover:shadow-2xl transition-shadow">
            <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 rounded-xl aspect-square flex items-center justify-center text-slate-500 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent"></div>
              <div className="text-center p-4 relative z-10">
                <div className="text-sm font-semibold text-slate-700 mb-1">AI Assistant Chat Interface</div>
                <div className="text-xs text-slate-500">Real-time Document Generation</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20 px-4">
            {[
              "Unlock the best AI-powered customer service tools in minutes",
              "Lower your costs with more efficient support teams",
              "Scale support without sacrificing customer experience"
            ].map((text, i) => (
              <div 
                key={i}
                className="flex items-start space-x-4 animate-fade-in-up"
                style={{animationDelay: `${i * 0.2}s`}}
              >
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-base sm:text-lg text-slate-900 leading-relaxed">{text}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Product Features */}
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10">
            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200 animate-fade-in-up">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900">Fin</h3>
              <p className="text-slate-600 mb-8 text-base sm:text-lg leading-relaxed">
                Our AI-powered bot automatically and accurately answers support questions with zero training required.
              </p>
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-xl aspect-video flex items-center justify-center text-slate-500 border border-slate-200">
                <div className="text-center">
                  <div className="text-sm font-semibold text-slate-700">Fin Bot Demo</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900">Workflows</h3>
              <p className="text-slate-600 mb-8 text-base sm:text-lg leading-relaxed">
                Easily build powerful no-code automations with bots, triggers, conditions, and rules—all in one place.
              </p>
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-xl aspect-video flex items-center justify-center text-slate-500 border border-slate-200">
                <div className="text-center">
                  <div className="text-sm font-semibold text-slate-700">Workflow Builder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-16 sm:mb-20">
            {[
              { title: "AI-powered inbox", desc: "Instantly generate replies, revise conversations for tone, agents, and more", gradient: "from-blue-50 to-indigo-50" },
              { title: "Article suggestions", desc: "Immediately recommend helpful content and articles learning—directly to your customers", gradient: "from-purple-50 to-pink-50" },
              { title: "Conversation topics", desc: "Better understand your customers with AI-powered analysis of support conversations", gradient: "from-blue-50 to-cyan-50" }
            ].map((feature, i) => (
              <div 
                key={i}
                className={`bg-gradient-to-br ${feature.gradient} rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-slate-200 animate-fade-in-up`}
                style={{animationDelay: `${i * 0.15}s`}}
              >
                <CheckCircle className="w-6 h-6 text-blue-600 mb-4" />
                <h4 className="font-bold mb-3 text-base sm:text-lg text-slate-900">{feature.title}</h4>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-10 sm:p-16 text-center border border-slate-200 hover:shadow-xl transition-all duration-500 animate-fade-in-up">
            <div className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900">zilch</div>
            <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-slate-700 leading-relaxed">
              "Our bot deflection rate with our previous customer service solution was 5–10%. With Intercom, we achieved <strong>65% bot deflection within just one week</strong> of going live."
            </p>
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full mr-3 animate-pulse"></div>
              <div className="text-center">
                <div className="font-semibold text-base sm:text-lg text-slate-900">Stuart Sykes</div>
                <div className="text-sm text-slate-600">VP of Service Operations, Zilch</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inbox Section */}
      <section id="pricing" className="bg-gradient-to-b from-white via-blue-50/50 to-white px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-28">
        <div className="max-w-6xl mx-auto text-center">
          <span className="bg-blue-100 text-blue-700 px-5 py-2.5 rounded-full text-sm font-semibold tracking-wide animate-fade-in uppercase">
            Client Management
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mt-6 sm:mt-8 mb-5 sm:mb-6 animate-fade-in-delay leading-tight px-4 text-slate-900">
            Maximize team productivity<br className="hidden sm:block" />
            with the world's fastest shared<br className="hidden sm:block" />
            Client Vault
          </h2>
          <p className="text-lg sm:text-xl text-slate-600 mb-8 sm:mb-10 max-w-3xl mx-auto animate-fade-in-delay-2 px-4 leading-relaxed">
            Our AI-enhanced Inbox is lightning fast, easy-to-use, and optimized for efficiency—with everything a modern support team needs.
          </p>
          <button
            onClick={() => router.push('/clients')}
            className="text-blue-600 font-semibold inline-flex items-center justify-center hover:text-blue-700 mb-10 sm:mb-12 group animate-fade-in-delay-3 text-base"
          >
            Explore Client Vault
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-2 transition-transform" />
          </button>

          {/* Inbox Screenshot Placeholder */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-2xl shadow-2xl p-4 sm:p-8 mb-10 sm:mb-16 border border-slate-700 animate-fade-in-up hover:shadow-3xl transition-all">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900 rounded-xl aspect-video flex items-center justify-center text-slate-400 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 to-transparent"></div>
              <div className="text-center p-4 relative z-10">
                <div className="text-sm font-semibold text-slate-300 mb-1">Client Vault Interface</div>
                <div className="text-xs text-slate-500">Team Collaboration View</div>
              </div>
            </div>
          </div>

          {/* Bottom Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {[
              "Faster customer resolutions",
              "Prevent team burnout",
              "Lower your costs"
            ].map((text, i) => (
              <div 
                key={i}
                className="flex items-start space-x-4 animate-fade-in-up"
                style={{animationDelay: `${i * 0.15}s`}}
              >
                <CheckCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-left">
                  <h4 className="font-semibold text-base sm:text-lg text-slate-900">{text}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Final Feature Cards */}
          <div className="grid md:grid-cols-2 gap-8 sm:gap-10 mb-8">
            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm text-left border border-slate-200 hover:shadow-2xl transition-all duration-500 animate-fade-in-up">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900">Ticketing</h3>
              <p className="text-slate-600 mb-6 text-base sm:text-lg leading-relaxed">
                Easily collaborate with colleagues to quickly solve complex problems, as well as offer customers to track progress in real-time.
              </p>
              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 rounded-xl aspect-video flex items-center justify-center text-slate-500 border border-orange-100">
                <div className="text-sm font-semibold text-slate-700">Ticketing Interface</div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-sm text-left border border-slate-200 hover:shadow-2xl transition-all duration-500 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <h3 className="text-2xl sm:text-3xl font-bold mb-4 text-slate-900">Configurable</h3>
              <p className="text-slate-600 mb-6 text-base sm:text-lg leading-relaxed">
                Make it your own. Set it and forget it. Set it and move custom rules, and more.
              </p>
              <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 rounded-xl aspect-video flex items-center justify-center text-slate-500 border border-pink-100">
                <div className="text-sm font-semibold text-slate-700">Configuration Panel</div>
              </div>
            </div>
          </div>

          {/* Additional Features Row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mt-12">
            {[
              { title: "Multiplayer", desc: "Collaborate easily with teammates to solve problems faster by working together, adding notes, and reminders." },
              { title: "Lightning fast", desc: "Work 3x faster with keyboard shortcuts, quick actions, and search that puts you right to what you're looking for." },
              { title: "Team management", desc: "Understand how your team is performing with comprehensive reporting, performance management tools, and more." }
            ].map((feature, i) => (
              <div 
                key={i}
                className="text-left p-8 rounded-2xl hover:bg-blue-50 transition-all duration-300 border border-transparent hover:border-blue-200 animate-fade-in-up"
                style={{animationDelay: `${i * 0.15}s`}}
              >
                <h4 className="font-bold mb-3 text-base sm:text-lg text-slate-900">{feature.title}</h4>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(40px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.8s ease-out forwards;
        }

        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease-out 0.2s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease-out 0.4s forwards;
          opacity: 0;
        }

        .animate-fade-in-delay-3 {
          animation: fadeIn 0.8s ease-out 0.6s forwards;
          opacity: 0;
        }

        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
      `}</style>
      <Footer />
    </div>
  );
}
