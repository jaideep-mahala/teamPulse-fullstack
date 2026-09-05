
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import './landing.css';

// Type Definitions
interface Feature {
  icon: string;
  title: string;
  description: string;
}

interface Testimonial {
  text: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
}

interface SectionHeaderProps {
  badge: string;
  title: string;
  subtitle: string;
}

interface FeatureCardProps {
  feature: Feature;
  index: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
  index: number;
}

interface MousePosition {
  x: number;
  y: number;
}

const LandingPage: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const [mousePosition, setMousePosition] = useState<MousePosition>({ x: 0, y: 0 });

  useEffect(() => {
    const handleScroll = (): void => {
      setIsScrolled(window.scrollY > 50);
    };

    const handleMouseMove = (e: MouseEvent): void => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="welcome-container">
      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="nav-content">
          <div className="logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">TeamPulse</span>
          </div>
          <div className="nav-links">
            <a href="#home" className="nav-link">Home</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#analytics" className="nav-link">Analytics</a>
            <a href="#workflow" className="nav-link">Workflow</a>
            <a href="#collaboration" className="nav-link">Collaboration</a>
            <a href="#testimonials" className="nav-link">Testimonials</a>
          </div>
          <div className="auth-buttons">
            <button className="btn-login">Login</button>
            <button className="btn-signup">Sign Up</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-section">
        <div className="hero-background">
          <div className="gradient-orb orb1"></div>
          <div className="gradient-orb orb2"></div>
          <div className="grid-pattern"></div>
        </div>
        <div className="hero-content">
          <motion.div 
            className="hero-text"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="hero-badge">
              <span className="badge-dot"></span>
              Team Collaboration Platform
            </div>
            <h1 className="hero-title">
              Transform Your Team's
              <span className="gradient-text"> Productivity</span>
            </h1>
            <p className="hero-description">
              TeamPulse is the all-in-one platform that helps teams collaborate, 
              track progress, and achieve their goals with real-time insights 
              and intelligent automation.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary">
                Get Started Free
                <span className="btn-arrow">→</span>
              </button>
              <button className="btn-secondary">
                <span className="play-icon">▶</span>
                Watch Demo
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">10K+</span>
                <span className="stat-label">Teams</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">1M+</span>
                <span className="stat-label">Projects</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">99.9%</span>
                <span className="stat-label">Uptime</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <div className="dashboard-mockup">
              <div className="mockup-header">
                <div className="mockup-dots">
                  <span className="dot red"></span>
                  <span className="dot yellow"></span>
                  <span className="dot green"></span>
                </div>
                <div className="mockup-title">TeamPulse Dashboard</div>
              </div>
              <div className="mockup-content">
                <div className="mockup-chart">
                  <div className="chart-bar bar1"></div>
                  <div className="chart-bar bar2"></div>
                  <div className="chart-bar bar3"></div>
                  <div className="chart-bar bar4"></div>
                  <div className="chart-bar bar5"></div>
                  <div className="chart-bar bar6"></div>
                  <div className="chart-bar bar7"></div>
                </div>
                <div className="mockup-cards">
                  <div className="mockup-card">
                    <div className="card-icon">📊</div>
                    <div className="card-info">
                      <div className="card-label">Total Tasks</div>
                      <div className="card-value">245</div>
                    </div>
                  </div>
                  <div className="mockup-card">
                    <div className="card-icon">👥</div>
                    <div className="card-info">
                      <div className="card-label">Team Members</div>
                      <div className="card-value">28</div>
                    </div>
                  </div>
                  <div className="mockup-card">
                    <div className="card-icon">✅</div>
                    <div className="card-info">
                      <div className="card-label">Completed</div>
                      <div className="card-value">189</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <SectionHeader 
          badge="Features" 
          title="Everything You Need to Succeed"
          subtitle="Powerful tools designed to streamline your workflow and boost team productivity"
        />
        <div className="features-grid">
          {features.map((feature: Feature, index: number) => (
            <FeatureCard key={index} feature={feature} index={index} />
          ))}
        </div>
      </section>

      {/* Analytics Section */}
      <section id="analytics" className="analytics-section">
        <div className="analytics-content">
          <motion.div 
            className="analytics-visual"
            initial={{ opacity: 0, x: -100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="analytics-chart">
              <div className="line-chart">
                <svg viewBox="0 0 400 200">
                  <path d="M0,150 Q50,100 100,120 T200,80 T300,50 T400,20" 
                        fill="none" 
                        stroke="url(#gradient)" 
                        strokeWidth="3" />
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#667eea" />
                      <stop offset="100%" stopColor="#764ba2" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>
              <div className="analytics-stats">
                <div className="stat-card">
                  <span className="stat-value">+47%</span>
                  <span className="stat-label">Productivity</span>
                </div>
                <div className="stat-card">
                  <span className="stat-value">-32%</span>
                  <span className="stat-label">Time Saved</span>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="analytics-text"
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="section-badge">Analytics</div>
            <h2>Real-Time Insights & Analytics</h2>
            <p>Make data-driven decisions with powerful analytics and reporting tools.</p>
            <ul className="analytics-list">
              <li>📈 Performance tracking</li>
              <li>📊 Custom dashboards</li>
              <li>🎯 Goal monitoring</li>
              <li>📉 Trend analysis</li>
            </ul>
            <button className="btn-primary">Explore Analytics</button>
          </motion.div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="workflow-section">
        <SectionHeader 
          badge="Workflow" 
          title="Streamlined Workflow Management"
          subtitle="Automate your processes and keep everyone in sync"
        />
        <div className="workflow-grid">
          <div className="workflow-steps">
            <div className="workflow-step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Plan</h3>
                <p>Create tasks, set priorities, and assign responsibilities</p>
              </div>
            </div>
            <div className="workflow-step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>Execute</h3>
                <p>Track progress and collaborate in real-time</p>
              </div>
            </div>
            <div className="workflow-step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Review</h3>
                <p>Analyze results and optimize performance</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Collaboration Section */}
      <section id="collaboration" className="collaboration-section">
        <div className="collaboration-content">
          <motion.div 
            className="collaboration-text"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="section-badge">Collaboration</div>
            <h2>Work Together Seamlessly</h2>
            <p>Bring your team together with powerful collaboration tools</p>
            <div className="collaboration-features">
              <div className="collab-feature">
                <span className="feature-icon">💬</span>
                <span>Real-time chat</span>
              </div>
              <div className="collab-feature">
                <span className="feature-icon">📝</span>
                <span>Shared documents</span>
              </div>
              <div className="collab-feature">
                <span className="feature-icon">🔄</span>
                <span>Version control</span>
              </div>
            </div>
          </motion.div>
          <motion.div 
            className="collaboration-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="collab-avatars">
              <div className="avatar avatar1">JD</div>
              <div className="avatar avatar2">AS</div>
              <div className="avatar avatar3">MK</div>
              <div className="avatar avatar4">+5</div>
            </div>
            <div className="collab-message">
              <div className="message-bubble">Great work team! 🎉</div>
              <div className="message-bubble">Project completed on time!</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section">
        <SectionHeader 
          badge="Testimonials" 
          title="What Our Users Say"
          subtitle="Join thousands of satisfied teams"
        />
        <div className="testimonials-grid">
          {testimonials.map((testimonial: Testimonial, index: number) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2>Ready to Boost Your Team's Productivity?</h2>
          <p>Start your free trial today. No credit card required.</p>
          <button className="btn-primary btn-large">Get Started Now</button>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">TeamPulse</span>
          </div>
          <div className="footer-links">
            <a href="#features">Features</a>
            <a href="#analytics">Analytics</a>
            <a href="#workflow">Workflow</a>
            <a href="#collaboration">Collaboration</a>
          </div>
          <div className="footer-social">
            <a href="#" className="social-icon">𝕏</a>
            <a href="#" className="social-icon">in</a>
            <a href="#" className="social-icon">f</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 TeamPulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Section Header Component
const SectionHeader: React.FC<SectionHeaderProps> = ({ badge, title, subtitle }) => (
  <motion.div 
    className="section-header"
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.6 }}
  >
    <div className="section-badge">{badge}</div>
    <h2 className="section-title">{title}</h2>
    <p className="section-subtitle">{subtitle}</p>
  </motion.div>
);

// Feature Card Component
const FeatureCard: React.FC<FeatureCardProps> = ({ feature, index }) => (
  <motion.div 
    className="feature-card"
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
  >
    <div className="feature-icon-wrapper">
      <span className="feature-icon">{feature.icon}</span>
    </div>
    <h3 className="feature-title">{feature.title}</h3>
    <p className="feature-description">{feature.description}</p>
    <div className="feature-hover-effect"></div>
  </motion.div>
);

// Testimonial Card Component
const TestimonialCard: React.FC<TestimonialCardProps> = ({ testimonial, index }) => (
  <motion.div 
    className="testimonial-card"
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, delay: index * 0.1 }}
    whileHover={{ y: -10 }}
  >
    <div className="testimonial-quote">"</div>
    <p className="testimonial-text">{testimonial.text}</p>
    <div className="testimonial-author">
      <div className="author-avatar">{testimonial.avatar}</div>
      <div className="author-info">
        <div className="author-name">{testimonial.name}</div>
        <div className="author-role">{testimonial.role}</div>
      </div>
    </div>
    <div className="testimonial-rating">
      {'★'.repeat(testimonial.rating)}
    </div>
  </motion.div>
);

// Data with Type Annotations
const features: Feature[] = [
  {
    icon: '📊',
    title: 'Project Management',
    description: 'Organize tasks, track progress, and manage projects efficiently'
  },
  {
    icon: '👥',
    title: 'Team Collaboration',
    description: 'Real-time communication and seamless file sharing'
  },
  {
    icon: '📈',
    title: 'Analytics Dashboard',
    description: 'Comprehensive insights and performance metrics'
  },
  {
    icon: '🔄',
    title: 'Workflow Automation',
    description: 'Automate repetitive tasks and streamline processes'
  },
  {
    icon: '📱',
    title: 'Mobile Ready',
    description: 'Access your workspace from anywhere, anytime'
  },
  {
    icon: '🔒',
    title: 'Enterprise Security',
    description: 'Bank-grade security and data protection'
  }
];

const testimonials: Testimonial[] = [
  {
    text: 'TeamPulse has completely transformed how our team works together. The analytics alone are worth it!',
    name: 'Sarah Johnson',
    role: 'Product Manager',
    avatar: 'SJ',
    rating: 5
  },
  {
    text: 'The best project management tool we have used. Intuitive, powerful, and beautifully designed.',
    name: 'Michael Chen',
    role: 'Tech Lead',
    avatar: 'MC',
    rating: 5
  },
  {
    text: 'Our productivity increased by 45% within the first month. TeamPulse is a game-changer.',
    name: 'Emily Rodriguez',
    role: 'Operations Director',
    avatar: 'ER',
    rating: 5
  }
];

export default LandingPage;