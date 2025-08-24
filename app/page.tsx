'use client';

import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState('home');
  const [isServicesExpanded, setIsServicesExpanded] = useState(false);
  const [isWhyAnimated, setIsWhyAnimated] = useState(false);
  const [isDriversAnimated, setIsDriversAnimated] = useState(false);
  const [isDriversBackgroundExpanded, setIsDriversBackgroundExpanded] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(1);
  const [windowWidth, setWindowWidth] = useState(1200);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Carousel navigation functions (commented out since navigation buttons are disabled)
  // const nextTestimonial = () => {
  //   setCurrentTestimonial((prev) => (prev + 1) % 3);
  // };

  // const prevTestimonial = () => {
  //   setCurrentTestimonial((prev) => (prev - 1 + 3) % 3);
  // };

  // Calculate carousel transform
  const getCarouselTransform = () => {
    const isMobile = windowWidth <= 768;
    const isSmallMobile = windowWidth <= 480;
    
    let cardWidth, gap;
    
    if (isSmallMobile) {
      cardWidth = 300;
      gap = 8;
    } else if (isMobile) {
      cardWidth = 350;
      gap = 16;
    } else if (windowWidth <= 1200) {
      cardWidth = 420;
      gap = 24;
    } else {
      cardWidth = 450;
      gap = 32;
    }
    
    const totalCardWidth = cardWidth + gap;
    const containerWidth = isMobile ? windowWidth : 1200; // Container width
    const centerOffset = (containerWidth - cardWidth) / 2;
    return -currentTestimonial * totalCardWidth + centerOffset;
  };

  // Define scroll handlers outside useEffect
  const handleScroll = () => {
    const header = document.querySelector('.header') as HTMLElement;
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (header) {
      if (scrollTop > 100) {
        header.style.background = 'rgba(69, 104, 126, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
      } else {
        header.style.background = '#45687E';
        header.style.backdropFilter = 'none';
      }
    }
  };

  const handleSectionScroll = () => {
    const sections = document.querySelectorAll('section, main');
    let current = '';
    const scrollPosition = window.pageYOffset + 100;
    
    sections.forEach(section => {
      const sectionTop = (section as HTMLElement).offsetTop;
      const sectionHeight = (section as HTMLElement).offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        current = section.getAttribute('id') || '';
      }
    });
    
    setActiveSection(current);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
      link.addEventListener('click', function(e: Event) {
        e.preventDefault();
        
        const targetId = (e.target as HTMLAnchorElement).getAttribute('href');
        const targetSection = document.querySelector(targetId || '');
        
        if (targetSection) {
          targetSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
        
        // Close mobile menu when link is clicked
        closeMobileMenu();
      });
    });

    // Button interactions
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e: Event) {
        e.preventDefault();
        
        // Simulate action based on button text
        const buttonText = (e.target as HTMLButtonElement).textContent?.trim();
        
        if (buttonText === 'BOOK NOW') {
          setActiveSection("form");
        } else if (buttonText === 'QUICK CALL') {
          setActiveSection("contact");
        }
      });
    });

    // Header scroll effect
    const header = document.querySelector('.header') as HTMLElement;
    window.addEventListener('scroll', handleScroll);

    // Active navigation link highlighting
    window.addEventListener('scroll', handleSectionScroll);

    // Services section scroll animation
    const servicesSection = document.querySelector('.services');
    
    if (servicesSection) {
      const handleServicesScroll = () => {
        const rect = servicesSection.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        
        if (rect.top < windowHeight * 0.5) {
          setIsServicesExpanded(true);
        } else {
          setIsServicesExpanded(false);
        }
      };
      
      window.addEventListener('scroll', handleServicesScroll);
      handleServicesScroll();
    }

    // Why Dropico section animations
    const whySection = document.querySelector('.why-dropico');
    
    if (whySection) {
      const whyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsWhyAnimated(true);
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      });
      
      whyObserver.observe(whySection);
    }

    // For Drivers section animations
    const driversSection = document.querySelector('.for-drivers');
    const driversBackground = document.querySelector('.drivers-background');
    
    if (driversSection) {
      const driversObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Expand background on first scroll into view
            if (driversBackground && !isDriversBackgroundExpanded) {
              driversBackground.classList.add('expanded');
              setIsDriversBackgroundExpanded(true);
              console.log('Drivers background expanded on first scroll');
            }
            
            setIsDriversAnimated(true);
          }
        });
      }, {
        threshold: 0.2,
        rootMargin: '0px 0px -100px 0px'
      });
      
      driversObserver.observe(driversSection);
    }

    // Logo hover effects
    const logo = document.querySelector('.logo') as HTMLElement;
    if (logo) {
      logo.addEventListener('mouseenter', function(this: HTMLElement) {
        this.style.transform = 'scale(1.05)';
        this.style.transition = 'transform 0.3s ease';
      });
      
      logo.addEventListener('mouseleave', function(this: HTMLElement) {
        this.style.transform = 'scale(1)';
      });
    }

    // Auto-rotate testimonials carousel
    const testimonialInterval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % 3);
    }, 5000);

    // Window resize handler
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    setWindowWidth(window.innerWidth);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('scroll', handleSectionScroll);
      window.removeEventListener('resize', handleResize);
      clearInterval(testimonialInterval);
    };
  }, [isDriversBackgroundExpanded]);

  return (
    <>
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="logo">
            <img src="/navbar-logo.png" alt="Dropico Logo Background" />
          </div>
          <nav className={`nav ${isMobileMenuOpen ? 'nav-open' : ''}`}>
            <ul className="nav-list">
              <li><a href="#home" className={`nav-link ${activeSection === 'home' ? 'active' : ''}`}>Home</a></li>
              <li><a href="#services" className={`nav-link ${activeSection === 'services' ? 'active' : ''}`}>Services</a></li>
              <li><a href="#why-us" className={`nav-link ${activeSection === 'why-us' ? 'active' : ''}`}>Why Us</a></li>
              <li><a href="#dropster" className={`nav-link ${activeSection === 'dropster' ? 'active' : ''}`}>Dropster</a></li>
              <li><a href="#contact" className={`nav-link ${activeSection === 'contact' ? 'active' : ''}`}>Contact</a></li>
            </ul>
          </nav>
          <button 
            className={`hamburger-menu ${isMobileMenuOpen ? 'active' : ''}`}
            onClick={toggleMobileMenu}
            aria-label="Toggle mobile menu"
          >
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
            <span className="hamburger-line"></span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="hero" id="home">
        <div className="hero-background">
          <Image src="/hero-image.png" alt="Man leaning against modern sedan car" className="hero-bg-img" fill style={{objectFit: 'cover', objectPosition: 'center'}} />
        </div>
        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <div className="hero-logo">
                <Image src="/dropico-logo-3.png" alt="Dropico Logo" width={2000} height={800} className="dropico-logo" />
              </div>
              <h2 className="hero-title">Ride Easy, Arrive Happy</h2>
              <div className="hero-actions">
                <button className="btn btn-primary">BOOK NOW</button>
                <span className="or-divider">OR</span>
                <button className="btn btn-secondary">QUICK CALL</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Booking Form Section */}
      <section className="booking-form-section" id="form">
        <div className="booking-card">
          <div className="form-group">
            <input type="text" placeholder="Schedule Pickup" className="form-input" />
            <span className="calendar-icon">📅</span>
          </div>
          <div className="form-group">
            <input type="text" placeholder="Full Name" className="form-input" />
          </div>
          <div className="form-group">
            <input type="tel" placeholder="Phone Number" className="form-input" />
          </div>
          <div className="radio-group">
            <label className="radio-option">
              <input type="radio" name="trip-type" value="one-way" defaultChecked />
              <span className="radio-custom"></span>
              One Way
            </label>
            <label className="radio-option">
              <input type="radio" name="trip-type" value="round-trip" />
              <span className="radio-custom"></span>
              Round Trip
            </label>
            <label className="radio-option">
              <input type="radio" name="trip-type" value="outstation" />
              <span className="radio-custom"></span>
              Outstation
            </label>
          </div>
          <div className="form-group">
            <input type="text" placeholder="Pickup Location" className="form-input" />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Drop Location" className="form-input" />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Date" className="form-input" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} />
          </div>
          <div className="form-group">
            <input type="text" placeholder="Time" className="form-input" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => e.target.type = 'text'} />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className={`services ${isServicesExpanded ? 'expanded' : ''}`} id="services">
        <div className="container">
          <div className="services-header">
            <h3 className="services-subtitle">OUR SERVICES</h3>
            <h2 className="services-title">Experience seamless travel with our reliable rides.</h2>
          </div>
          
          <div className="services-grid">
            <div className="service-card">
              <div className="service-card-bg">
                <Image src="/one-way-card-bg.png" alt="Highway with ONE WAY sign" className="service-bg-img" fill style={{objectFit: 'cover', objectPosition: 'center'}} />
              </div>
              <div className="service-card-overlay">
                <div className="service-content">
                  <div className="service-price">
                    <span className="price-label">STARTING AT</span>
                    <span className="price-amount">299<sup>*</sup></span>
                  </div>
                  <p className="service-description">Just need to get there? We&apos;ll make it a ride worth remembering.</p>
                  <button className="service-btn">BOOK NOW <span className="arrow"></span></button>
                </div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-card-bg">
                <Image src="/round-trip-card-bg.png" alt="Highway with ROUND TRIP sign" className="service-bg-img" fill style={{objectFit: 'cover', objectPosition: 'center'}} />
              </div>
              <div className="service-card-overlay">
                <div className="service-content">
                  <div className="service-price">
                    <span className="price-label">STARTING AT</span>
                    <span className="price-amount">299<sup>*</sup></span>
                  </div>
                  <p className="service-description">One booking covers your entire journey, no extra calls or planning.</p>
                  <button className="service-btn">BOOK NOW <span className="arrow"></span></button>
                </div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-card-bg">
                <Image src="/outstation-card-bg.png" alt="Highway with OUTSTATION sign" className="service-bg-img" fill style={{objectFit: 'cover', objectPosition: 'center'}} />
              </div>
              <div className="service-card-overlay">
                <div className="service-content">
                  <div className="service-price">
                    <span className="price-label">STARTING AT</span>
                    <span className="price-amount">299<sup>*</sup></span>
                  </div>
                  <p className="service-description">Outstation Rides You Can Trust. Safe, comfortable trips beyond the city.</p>
                  <button className="service-btn">BOOK NOW <span className="arrow"></span></button>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="services-pagination">
            <div className="pagination-dot active"></div>
            <div className="pagination-dot"></div>
            <div className="pagination-dot"></div>
          </div> */}
        </div>
      </section>

      {/* Why Dropico Section */}
      <section className="why-dropico" id="why-us">
        <div className="container">
          <h2 className={`why-title ${isWhyAnimated ? 'animate' : ''}`}>Why Dropico?</h2>
          <div className="why-content">
            <div className={`why-image ${isWhyAnimated ? 'animate' : ''}`}>
              <img src="/dropico-driver.png" alt="Dropico driver giving thumbs up" className="driver-img" />
            </div>
            <div className="why-features">
              <div className="features-grid">
                <div className={`feature-block ${isWhyAnimated ? 'animate' : ''}`}>
                  <div className="feature-icon">
                    <Image src="/safety-security-icon.png" alt="Safety & Security" className="feature-img" width={60} height={60} />
                  </div>
                  <h3 className="feature-title">Safety & Security</h3>
                  <p className="feature-description">Your safety is our top priority. Our dropsters are thoroughly vetted, and every journey is tracked in real-time. Travel with complete peace of mind.</p>
                </div>

                <div className={`feature-block ${isWhyAnimated ? 'animate' : ''}`}>
                  <div className="feature-icon">
                    <Image src="/transparent-pricing-icon.png" alt="Transparent Pricing" className="feature-img" width={60} height={60} />
                  </div>
                  <h3 className="feature-title">Transparent Pricing</h3>
                  <p className="feature-description">Enjoy clear, upfront pricing with no hidden fees. The price you see is the final price you pay, ensuring a worry-free experience.</p>
                </div>

                <div className={`feature-block ${isWhyAnimated ? 'animate' : ''}`}>
                  <div className="feature-icon">
                    <Image src="/reliability-punctuality-icon.png" alt="Reliability & Punctuality" className="feature-img" width={60} height={60} />
                  </div>
                  <h3 className="feature-title">Reliability & Punctuality</h3>
                  <p className="feature-description">We respect your time. Our dropsters are committed to being on-time for every pickup, so you never have to worry about delays.</p>
                </div>

                <div className={`feature-block ${isWhyAnimated ? 'animate' : ''}`}>
                  <div className="feature-icon">
                    <Image src="/instant-booking-icon.png" alt="Instant Booking" className="feature-img" width={60} height={60} />
                  </div>
                  <h3 className="feature-title">Instant Booking</h3>
                  <p className="feature-description">Sudden plans? No problem. Book your ride instantly with a simple call or WhatsApp message. Your ride is just moments away.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* For Drivers Section */}
      <section className="for-drivers" id="dropster">
        <div className="drivers-background">
          <Image src="/driver-interior.png" alt="Driver in car interior" className="drivers-bg-img" fill style={{objectFit: 'cover', objectPosition: 'center'}} />
        </div>
        <div className="drivers-overlay">
          <div className="container">
            <div className={`drivers-content ${isDriversAnimated ? 'animate' : ''}`}>
              <h3 className={`drivers-subtitle ${isDriversAnimated ? 'animate' : ''}`}>FOR DRIVERS</h3>
              <h2 className={`drivers-title ${isDriversAnimated ? 'animate' : ''}`}>Earn with Us?</h2>
              <p className={`drivers-description ${isDriversAnimated ? 'animate' : ''}`}>Are you a skilled driver committed to giving outstanding service? Become a part of our dedicated driving team. We&apos;re looking for pros like you!</p>
              <button className={`btn btn-primary ${isDriversAnimated ? 'animate' : ''}`}>
                Join as a DROPSTER !
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials">
        <div className="container">
          <div className="testimonials-header">
            <h3 className="testimonials-subtitle">HEAR FROM OUR CLIENTS</h3>
            <h2 className="testimonials-title">Don&apos;t Take Our Word For It - Here&apos;s What Clients Say!</h2>
          </div>
          
          <div className="testimonials-carousel-container">
            <div 
              className="testimonials-carousel"
              style={{ transform: `translateX(${getCarouselTransform()}px)` }}
            >
              <div className={`testimonial-card ${currentTestimonial === 0 ? 'active' : ''}`}>
                <div className="testimonial-avatar">
                  <div className="avatar-icon">
                    <img src="/dropico-driver.png" alt="Customer Avatar" />
                  </div>
                </div>
                <h4 className="testimonial-role">The Party Savior</h4>
                <p className="testimonial-quote">&quot;I was stranded at 2 AM after my Uber canceled. Called these guys - their driver arrived in 10 mins, got me AND my car home safely&quot;</p>
                <p className="testimonial-author">- Rohan K. (Weekend Warrior)</p>
                <div className="testimonial-divider"></div>
                <div className="testimonial-rating">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
              </div>

              <div className={`testimonial-card ${currentTestimonial === 1 ? 'active' : ''}`}>
                <div className="testimonial-avatar">
                  <div className="avatar-icon">
                    <img src="/dropico-driver.png" alt="Customer Avatar" />
                  </div>
                </div>
                <h4 className="testimonial-role">Business Traveler</h4>
                <p className="testimonial-quote">&quot;Reliable service every time. Perfect for my business trips. Clean cars and professional drivers.&quot;</p>
                <p className="testimonial-author">- Priya M. (Corporate Executive)</p>
                <div className="testimonial-divider"></div>
                <div className="testimonial-rating">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
              </div>

              <div className={`testimonial-card ${currentTestimonial === 2 ? 'active' : ''}`}>
                <div className="testimonial-avatar">
                  <div className="avatar-icon">
                    <img src="/dropico-driver.png" alt="Customer Avatar" />
                  </div>
                </div>
                <h4 className="testimonial-role">Family Traveler</h4>
                <p className="testimonial-quote">&quot;Safe and comfortable rides for my family. The drivers are always courteous and the cars are spotless.&quot;</p>
                <p className="testimonial-author">- Amit S. (Family Man)</p>
                <div className="testimonial-divider"></div>
                <div className="testimonial-rating">
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                  <span className="star">★</span>
                </div>
              </div>
            </div>

            {/* <div className="carousel-nav">
              <button 
                className="carousel-btn" 
                onClick={prevTestimonial}
                disabled={currentTestimonial === 0}
              >
                ‹
              </button>
              <button 
                className="carousel-btn" 
                onClick={nextTestimonial}
                disabled={currentTestimonial === 2}
              >
                ›
              </button>
            </div> */}
          </div>

          <div className="testimonials-pagination">
            <div 
              className={`pagination-dot ${currentTestimonial === 0 ? 'active' : ''}`}
              onClick={() => setCurrentTestimonial(0)}
            ></div>
            <div 
              className={`pagination-dot ${currentTestimonial === 1 ? 'active' : ''}`}
              onClick={() => setCurrentTestimonial(1)}
            ></div>
            <div 
              className={`pagination-dot ${currentTestimonial === 2 ? 'active' : ''}`}
              onClick={() => setCurrentTestimonial(2)}
            ></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer" id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <div className="footer-logo">
                <img src="/dropico-logo-1.png" alt="Dropico Logo" className="footer-logo-img" />
              </div>
              <div className="footer-location">
                <p className="location-label">Our Location</p>
                <p className="location-text">CHENNAI</p>
              </div>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">QUICK LINKS</h3>
              <ul className="footer-links">
                <li><a href="#" className="footer-link">Terms & Conditions</a></li>
                <li><a href="#" className="footer-link">Privacy Policy</a></li>
                <li><a href="#" className="footer-link">FAQ</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3 className="footer-title">CONTACT US</h3>
              <div className="contact-info">
                <div className="contact-item">
                  <img src="/location.png" alt="Location" className="contact-icon" />
                  <div className="contact-details">
                    <p className="contact-label">Corporate Office</p>
                    <p className="contact-text">A4, Chandrasekaran avenue,</p>
                    <p className="contact-text">1st Main Rd, Thoraipakkam,</p>
                    <p className="contact-text">Tamil Nadu, Chennai 600097</p>
                  </div>
                </div>
                <div className="contact-item">
                  <img src="/call.png" alt="Phone" className="contact-icon" />
                  <div className="contact-details">
                    <p className="contact-text">+91 96777 434 03</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-copyright">
          <div className="container">
            <p>© 2025 All rights reserved</p>
          </div>
        </div>
      </footer>
    </>
  );
}
