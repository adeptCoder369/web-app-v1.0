'use client'
import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Users,
  DollarSign,
  BarChart3,
  MessageSquare,
  BookOpen,
  Shield,
  CheckCircle,
  Menu,
  X,
  ArrowRight,
  Star,
  Calendar,
  TrendingUp
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SchoolERPLanding() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    {
      icon: <Users className="w-6 h-6" />,
      title: "Student Management",
      description: "Complete student profiles, attendance tracking, academic records, and progress monitoring",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: <DollarSign className="w-6 h-6" />,
      title: "Financial Management",
      description: "Fee collection, payment tracking, financial reporting, and automated billing systems",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Analytics & Reports",
      description: "Comprehensive dashboards, performance analytics, and automated report generation",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Communication Hub",
      description: "Parent-teacher messaging, announcements, notifications, and event management",
      color: "bg-orange-100 text-orange-600"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Academic Planning",
      description: "Curriculum management, lesson planning, examination scheduling, and grade books",
      color: "bg-red-100 text-red-600"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Security & Compliance",
      description: "Data encryption, role-based access control, audit trails, and compliance management",
      color: "bg-indigo-100 text-indigo-600"
    }
  ];

  const benefits = [
    { title: "Save 10+ Hours Weekly", description: "Automate administrative tasks and focus on education" },
    { title: "Reduce Costs by 40%", description: "Eliminate paperwork, reduce errors, streamline operations" },
    { title: "Improve Parent Satisfaction", description: "Real-time updates, transparent communication, easy access" }
  ];

  const stats = [
    { number: "500+", label: "Schools Trust Us", icon: <GraduationCap className="w-8 h-8" /> },
    { number: "1M+", label: "Students Managed", icon: <Users className="w-8 h-8" /> },
    { number: "99.9%", label: "Uptime Guarantee", icon: <TrendingUp className="w-8 h-8" /> }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
        }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <h1 className="text-4xl font-extrabold tracking-tight text-[color:var(--color-blue-text)]">
                info<span className="text-[color:var(--color-navy-blue)]">EIGHT</span>
              </h1>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex space-x-8">
              {['Features', 'Benefits', 'Pricing', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200"
                >
                  {item}
                </a>
              ))}
            </div>

            <div className="flex items-center space-x-4">

              <button
                onClick={() => {
                  router.push('/login')
                }}
                className="cursor-pointer px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-800 border border-black ring-5 text-white font-medium rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200">

                Login
              </button>

              {/* Mobile menu button */}
              <button
                className="md:hidden"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden bg-white border-t border-gray-200 py-4">
              {['Features', 'Benefits', 'Pricing', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="block px-4 py-2 text-gray-700 hover:text-blue-600 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(59,130,246,0.1)_1px,transparent_0)] bg-[length:40px_40px]"></div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-200/30 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-green-200/30 rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16">
          <div className="animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Revolutionize Your
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                School Management
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Complete ERP solution designed for modern educational institutions.
              Streamline operations, enhance communication, and empower educators with our cutting-edge platform.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <button className="group px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
                <span>Start Free Trial</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300">
                Schedule Demo
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mt-16">
            {stats.map((stat, index) => (
              <div key={index} className="bg-white/80 backdrop-blur rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                <div className="flex items-center justify-center mb-4">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl text-white">
                    {stat.icon}
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your school efficiently in one integrated platform
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              >
                <div className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold mb-4 text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Why Choose InfoEight?
              </h2>
              <div className="space-y-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2 text-gray-900">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Mockup */}
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl p-8 text-white transform rotate-3 shadow-2xl hover:rotate-2 transition-transform duration-300">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Live Dashboard</h4>
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl font-bold">1,247</div>
                      <div className="text-xs opacity-80">Active Students</div>
                    </div>
                    <div className="bg-white/20 rounded-lg p-4">
                      <div className="text-2xl font-bold">96%</div>
                      <div className="text-xs opacity-80">Attendance Rate</div>
                    </div>
                  </div>

                  <div className="bg-white/20 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-sm">Fee Collection Progress</span>
                      <span className="text-sm font-semibold">₹2,45,000</span>
                    </div>
                    <div className="bg-white/30 rounded-full h-2 overflow-hidden">
                      <div className="bg-green-400 rounded-full h-2 w-3/4 animate-pulse"></div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Next: Parent-Teacher Meeting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-10 right-10 w-24 h-24 bg-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your School?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Join thousands of schools already using InfoEight to streamline their operations and enhance education quality.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <button className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2">
              <Star className="w-5 h-5" />
              <span>Start 30-Day Free Trial</span>
            </button>
            <button className="px-8 py-4 border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300">
              Book a Demo
            </button>
          </div>

          <p className="text-sm opacity-75">No credit card required • Setup in under 5 minutes</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <h1 className="text-4xl font-extrabold tracking-tight text-[color:var(--color-blue-text)]">
                info<span className="text-[color:var(--color-navy-blue)]">EIGHT</span>
              </h1>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Empowering educational institutions with cutting-edge technology and seamless management solutions.
              </p>
            </div>

            {[
              { title: 'Product', links: ['Features', 'Pricing', 'Security', 'Integrations'] },
              { title: 'Company', links: ['About Us', 'Careers', 'Blog', 'Contact'] },
              { title: 'Support', links: ['Help Center', 'Documentation', 'API Reference', 'Status Page'] }
            ].map((section, index) => (
              <div key={index}>
                <h4 className="font-semibold mb-4">{section.title}</h4>
                <div className="space-y-2">
                  {section.links.map((link) => (
                    <a key={link} href="#" className="block text-sm text-gray-400 hover:text-white transition-colors">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
            <p>&copy; 2024 InfoEight. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                <a key={link} href="#" className="hover:text-white transition-colors">{link}</a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}