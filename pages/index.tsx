import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { ChevronDown, ArrowRight, CheckCircle, Menu, X } from 'lucide-react';

export default function Home() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('demo_token') : null;
    const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('demo_email') : null;
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

  return (
    <div className="bg-white">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-md shadow-md' : 'bg-white'
      } border-b border-gray-200`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <div className="flex items-center">
              <div className="text-xl lg:text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer">
                Draftzi
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <button
                onClick={() => {
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`flex items-center transition-colors group ${currentSection === 'products' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Products 
                <ChevronDown className="ml-1 w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
                <button
                  onClick={() => {
                    const el = document.getElementById('products');
                    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }}
                  className={`flex items-center transition-colors group ${currentSection === 'products' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
                >
                  Solutions 
                  <ChevronDown className="ml-1 w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
                </button>
              <button
                onClick={() => {
                  const el = document.getElementById('customers');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`text-sm transition-colors ${currentSection === 'customers' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Customers
              </button>
              {/* Resources removed per request */}
              <button
                onClick={() => {
                  const el = document.getElementById('pricing');
                  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }}
                className={`text-sm transition-colors ${currentSection === 'pricing' ? 'text-blue-600 font-semibold' : 'text-gray-700 hover:text-blue-600'}`}
              >
                Pricing
              </button>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <span className="text-sm text-gray-700">{email}</span>
                  <button
                    onClick={() => {
                      localStorage.removeItem('demo_token');
                      localStorage.removeItem('demo_email');
                      setIsLoggedIn(false);
                      setEmail('');
                      // reload to reset state across components
                      window.location.reload();
                    }}
                    className="px-4 py-2 border rounded"
                  >
                    Log out
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/signup')}
                    className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-300 flex items-center group shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Start free trial 
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
              <button
                onClick={() => { router.push('/signup'); setIsMenuOpen(false); }}
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
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer for fixed nav */}
      <div className="h-16 lg:h-20"></div>

      {/* Hero Section */}
      <section className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800"></div>
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-blue-500/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-purple-500/5 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-4 sm:mb-6 animate-fade-in leading-tight">
            The <span className="text-yellow-400 animate-pulse">only</span> AI automation<br className="hidden sm:block" />
            workspace lawyers and<br className="hidden sm:block" />
            businesses need
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-8 sm:mb-12 max-w-3xl mx-auto animate-fade-in-delay px-4">
            Resolve tasks faster, increase accuracy, and scale your productivity —<br className="hidden sm:block" />
            with the only smart automation system built for legal & business professionals.
          </p>
          
          {/* Product Screenshot Placeholder */}
          <div className="bg-white rounded-lg shadow-2xl p-2 sm:p-4 max-w-5xl mx-auto transform hover:scale-105 transition-transform duration-500 animate-fade-in-delay-2">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded aspect-video flex items-center justify-center text-gray-500">
              <div className="text-center p-4">
                <div className="text-xs sm:text-sm font-medium">Product Interface Screenshot</div>
                <div className="text-xs">Dashboard & Chat Interface</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Customers section anchor */}
      <div id="customers"></div>

      {/* Trust Bar */}
      <section className="bg-slate-900 text-white px-4 sm:px-6 lg:px-8 py-8 sm:py-12 border-t border-slate-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900"></div>
        <div className="max-w-6xl mx-auto relative z-10">
          <p className="text-center text-xs sm:text-sm font-semibold tracking-wider mb-6 sm:mb-8 animate-fade-in">
          {/* mark this section as customers for nav */}
          TRUSTED BY +25,000 BUSINESSES
          </p>
          <div className="flex justify-center items-center gap-6 sm:gap-8 lg:gap-12 flex-wrap">
            {['Coda', 'Inter', 'Atlassian', 'ClickTravel', 'Notion', 'eToro', 'H&R Block', 'Cognizant'].map((company, i) => (
              <div 
                key={company} 
                className="text-gray-400 font-semibold text-sm sm:text-base lg:text-lg hover:text-white transition-colors cursor-pointer animate-fade-in"
                style={{animationDelay: `${i * 0.1}s`}}
              >
                {company}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Automation Section */}
      <section id="products" className="bg-gradient-to-b from-white via-blue-50 to-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold animate-fade-in">
              AUTOMATION
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mt-4 sm:mt-6 mb-4 sm:mb-6 animate-fade-in-delay leading-tight px-4">
              Draftzi turns weeks of documentation into minutes —<br className="hidden lg:block" />
              from contracts to compliance letters to reports.
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-6 sm:mb-8 animate-fade-in-delay-2 px-4">
              Trusted by modern law firms, CA practices, and fast-growing businesses
            </p>
            <a href="#" className="text-blue-600 font-semibold inline-flex items-center justify-center hover:underline group animate-fade-in-delay-3">
              Learn more about automation 
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
            </a>
          </div>

          {/* Bot Interface Placeholder */}
          <div className="bg-white rounded-lg shadow-xl p-4 sm:p-8 max-w-2xl mx-auto mb-12 sm:mb-16 transform hover:scale-105 transition-all duration-500 animate-fade-in-up">
            <div className="bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 rounded-lg aspect-square flex items-center justify-center text-gray-500">
              <div className="text-center p-4">
                <div className="text-xs sm:text-sm font-medium">AI Bot Chat Interface</div>
                <div className="text-xs">Fin Bot Conversation</div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-12 sm:mb-16 px-4">
            {[
              "Unlock the best AI-powered customer service tools in minutes",
              "Lower your costs with more efficient support teams",
              "Scale support without sacrificing customer experience"
            ].map((text, i) => (
              <div 
                key={i}
                className="flex items-start space-x-3 animate-fade-in-up"
                style={{animationDelay: `${i * 0.2}s`}}
              >
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-base sm:text-lg mb-1">{text}</h3>
                </div>
              </div>
            ))}
          </div>

          {/* Product Features */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up">
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Fin</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Our AI-powered bot automatically and accurately answers support questions with zero training required.
              </p>
              <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-blue-50 rounded-lg aspect-video flex items-center justify-center text-gray-500 hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-sm font-medium">Fin Bot Demo</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <h3 className="text-xl sm:text-2xl font-bold mb-4">Workflows</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Easily build powerful no-code automations with bots, triggers, conditions, and rules—all in one place.
              </p>
              <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-50 rounded-lg aspect-video flex items-center justify-center text-gray-500 hover:scale-105 transition-transform duration-300">
                <div className="text-center">
                  <div className="text-sm font-medium">Workflow Builder</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Additional Features */}
      <section className="bg-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
            {[
              { title: "AI-powered inbox", desc: "Instantly generate replies, revise conversations for tone, agents, and more", gradient: "from-blue-50 to-indigo-50" },
              { title: "Article suggestions", desc: "Immediately recommend helpful content and articles learning—directly to your customers", gradient: "from-purple-50 to-pink-50" },
              { title: "Conversation topics", desc: "Better understand your customers with AI-powered analysis of support conversations", gradient: "from-blue-50 to-cyan-50" }
            ].map((feature, i) => (
              <div 
                key={i}
                className={`bg-gradient-to-br ${feature.gradient} rounded-lg p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2 animate-fade-in-up`}
                style={{animationDelay: `${i * 0.15}s`}}
              >
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 mb-4" />
                <h4 className="font-bold mb-2 text-sm sm:text-base">{feature.title}</h4>
                <p className="text-xs sm:text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="bg-gray-50 rounded-lg p-8 sm:p-12 text-center hover:shadow-xl transition-all duration-500 animate-fade-in-up">
            <div className="text-xl sm:text-2xl font-bold mb-2">zilch</div>
            <p className="text-lg sm:text-xl mb-6 max-w-3xl mx-auto">
              "Our bot deflection rate with our previous customer service solution was 5–10%. With Intercom, we achieved <strong>65% bot deflection within just one week</strong> of going live."
            </p>
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-300 rounded-full mr-3 animate-pulse"></div>
              <div className="text-left">
                <div className="font-semibold text-sm sm:text-base">Stuart Sykes</div>
                <div className="text-xs sm:text-sm text-gray-600">VP of Service Operations, Zilch</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inbox Section */}
      <section id="pricing" className="bg-gradient-to-b from-white via-blue-50 to-white px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="max-w-6xl mx-auto text-center">
          <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-xs sm:text-sm font-semibold animate-fade-in">
            INBOX
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif mt-4 sm:mt-6 mb-4 sm:mb-6 animate-fade-in-delay leading-tight px-4">
            Maximize team productivity<br className="hidden sm:block" />
            with the world's fastest shared<br className="hidden sm:block" />
            Client Vault
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto animate-fade-in-delay-2 px-4">
            Our AI-enhanced Inbox is lightning fast, easy-to-use, and optimized for efficiency—with everything a modern support team needs.
          </p>
          <a href="#" className="text-blue-600 font-semibold inline-flex items-center justify-center hover:underline mb-8 sm:mb-12 group animate-fade-in-delay-3">
            Learn more about our Inbox 
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
          </a>

          {/* Inbox Screenshot Placeholder */}
          <div className="bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800 rounded-lg shadow-2xl p-4 sm:p-8 mb-8 sm:mb-12 transform hover:scale-105 transition-all duration-500 animate-fade-in-up">
            <div className="bg-gradient-to-br from-gray-800 via-gray-900 to-slate-900 rounded aspect-video flex items-center justify-center text-gray-400">
              <div className="text-center p-4">
                <div className="text-xs sm:text-sm font-medium">VIP Inbox Interface</div>
                <div className="text-xs">Team Collaboration View</div>
              </div>
            </div>
          </div>

          {/* Bottom Features */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            {[
              "Faster customer resolutions",
              "Prevent team burnout",
              "Lower your costs"
            ].map((text, i) => (
              <div 
                key={i}
                className="flex items-start space-x-3 animate-fade-in-up"
                style={{animationDelay: `${i * 0.15}s`}}
              >
                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 flex-shrink-0 mt-1" />
                <div className="text-left">
                  <h4 className="font-semibold mb-1 text-sm sm:text-base">{text}</h4>
                </div>
              </div>
            ))}
          </div>

          {/* Final Feature Cards */}
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 mb-8">
            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm text-left hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Ticketing</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Easily collaborate with colleagues to quickly solve complex problems, as well as offer customers to track progress in real-time.
              </p>
              <div className="bg-gradient-to-br from-orange-50 via-amber-50 to-orange-50 rounded aspect-video flex items-center justify-center text-gray-500 hover:scale-105 transition-transform duration-300">
                <div className="text-sm">Ticketing Interface</div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 sm:p-8 shadow-sm text-left hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <h3 className="text-lg sm:text-xl font-bold mb-4">Configurable</h3>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Make it your own. Set it and forget it. Set it and move custom rules, and more.
              </p>
              <div className="bg-gradient-to-br from-pink-50 via-rose-50 to-pink-50 rounded aspect-video flex items-center justify-center text-gray-500 hover:scale-105 transition-transform duration-300">
                <div className="text-sm">Configuration Panel</div>
              </div>
            </div>
          </div>

          {/* Additional Features Row */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mt-8">
            {[
              { title: "Multiplayer", desc: "Collaborate easily with teammates to solve problems faster by working together, adding notes, and reminders." },
              { title: "Lightning fast", desc: "Work 3x faster with keyboard shortcuts, quick actions, and search that puts you right to what you're looking for." },
              { title: "Team management", desc: "Understand how your team is performing with comprehensive reporting, performance management tools, and more." }
            ].map((feature, i) => (
              <div 
                key={i}
                className="text-left p-6 rounded-lg hover:bg-blue-50 transition-all duration-300 animate-fade-in-up"
                style={{animationDelay: `${i * 0.15}s`}}
              >
                <h4 className="font-bold mb-2 text-sm sm:text-base">{feature.title}</h4>
                <p className="text-xs sm:text-sm text-gray-600">{feature.desc}</p>
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
    </div>
  );
}
