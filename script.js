// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light"
    this.init()
  }

  init() {
    this.applyTheme()
    this.setupToggle()
  }

  applyTheme() {
    document.documentElement.setAttribute("data-theme", this.theme)
    const themeIcon = document.getElementById("theme-icon")
    if (themeIcon) {
      themeIcon.className = this.theme === "dark" ? "fas fa-sun" : "fas fa-moon"
    }
  }

  toggle() {
    this.theme = this.theme === "light" ? "dark" : "light"
    localStorage.setItem("theme", this.theme)
    this.applyTheme()
  }

  setupToggle() {
    const themeToggle = document.getElementById("theme-toggle")
    if (themeToggle) {
      themeToggle.addEventListener("click", () => this.toggle())
    }
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.navbar = document.getElementById("navbar")
    this.navToggle = document.getElementById("nav-toggle")
    this.navMenu = document.getElementById("nav-menu")
    this.navLinks = document.querySelectorAll(".nav-link")
    this.init()
  }

  init() {
    this.setupScrollEffect()
    this.setupMobileMenu()
    this.setupSmoothScrolling()
  }

  setupScrollEffect() {
    let lastScrollY = window.scrollY

    window.addEventListener("scroll", () => {
      const currentScrollY = window.scrollY

      // Add scrolled class for styling
      if (currentScrollY > 50) {
        this.navbar.classList.add("scrolled")
      } else {
        this.navbar.classList.remove("scrolled")
      }

      lastScrollY = currentScrollY
    })
  }

  setupMobileMenu() {
    if (this.navToggle && this.navMenu) {
      this.navToggle.addEventListener("click", () => {
        this.navToggle.classList.toggle("active")
        this.navMenu.classList.toggle("active")
      })

      // Close mobile menu when clicking on a link
      this.navLinks.forEach((link) => {
        link.addEventListener("click", () => {
          this.navToggle.classList.remove("active")
          this.navMenu.classList.remove("active")
        })
      })

      // Close mobile menu when clicking outside
      document.addEventListener("click", (e) => {
        if (!this.navbar.contains(e.target)) {
          this.navToggle.classList.remove("active")
          this.navMenu.classList.remove("active")
        }
      })
    }
  }

  setupSmoothScrolling() {
    this.navLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()
        const targetId = link.getAttribute("href")
        const targetSection = document.querySelector(targetId)

        if (targetSection) {
          const offsetTop = targetSection.offsetTop - 70 // Account for fixed navbar
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          })
        }
      })
    })
  }
}

// Scroll Animation Manager
class ScrollAnimationManager {
  constructor() {
    this.animatedElements = []
    this.init()
  }

  init() {
    this.setupIntersectionObserver()
    // Delay adding animation classes to ensure DOM is ready
    setTimeout(() => {
      this.addAnimationClasses()
    }, 100)
  }

  addAnimationClasses() {
    // Add animation classes to elements that should animate on scroll
    const elementsToAnimate = [
      ".section-header",
      ".about-text",
      ".about-image",
      ".stat-card",
      ".service-item",
      ".contact-card",
      ".contact-form",
      ".gallery-item",
      ".testimonial-item",
    ]

    elementsToAnimate.forEach((selector) => {
      const elements = document.querySelectorAll(selector)
      elements.forEach((element, index) => {
        element.classList.add("animate-on-scroll")
        // Add staggered animation delays
        element.style.animationDelay = `${index * 0.1}s`
        this.animatedElements.push(element)
      })
    })
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animated")

          // Special handling for stat counters
          if (entry.target.classList.contains("stat-card")) {
            const counter = entry.target.querySelector(".stat-number")
            if (counter && !counter.classList.contains("counted")) {
              this.animateCounter(counter)
              counter.classList.add("counted")
            }
          }

          observer.unobserve(entry.target)
        }
      })
    }, options)

    // Observe elements when they're added to the DOM
    const observeElements = () => {
      this.animatedElements.forEach((element) => {
        if (!element.classList.contains("animated")) {
          observer.observe(element)
        }
      })
    }

    // Initial observation
    setTimeout(observeElements, 200)

    // Re-observe when new elements are added (for dynamically generated content)
    const mutationObserver = new MutationObserver(() => {
      setTimeout(observeElements, 100)
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })
  }

  animateCounter(element) {
    const target = Number.parseInt(element.getAttribute("data-target"))
    const duration = 2000 // 2 seconds
    const increment = target / (duration / 16) // 60fps
    let current = 0

    const updateCounter = () => {
      current += increment
      if (current < target) {
        element.textContent = Math.floor(current)
        requestAnimationFrame(updateCounter)
      } else {
        element.textContent = target
      }
    }

    updateCounter()
  }
}

// Counter Animation Manager
class CounterAnimationManager {
  constructor() {
    this.counters = document.querySelectorAll(".stat-number")
    this.init()
  }

  init() {
    this.setupCounterObserver()
  }

  setupCounterObserver() {
    const options = {
      threshold: 0.5,
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target)
          observer.unobserve(entry.target)
        }
      })
    }, options)

    this.counters.forEach((counter) => {
      observer.observe(counter)
    })
  }

  animateCounter(element) {
    const target = Number.parseInt(element.getAttribute("data-target"))
    const duration = 2000 // 2 seconds
    const increment = target / (duration / 16) // 60fps
    let current = 0

    const updateCounter = () => {
      current += increment
      if (current < target) {
        element.textContent = Math.floor(current)
        requestAnimationFrame(updateCounter)
      } else {
        element.textContent = target
      }
    }

    updateCounter()
  }
}

// Hero Slider Management
class HeroSliderManager {
  constructor() {
    this.slider = document.getElementById("hero-slider")
    this.slides = document.querySelectorAll(".slide")
    this.indicators = document.querySelectorAll(".indicator")
    this.prevBtn = document.getElementById("prev-slide")
    this.nextBtn = document.getElementById("next-slide")
    this.playPauseBtn = document.getElementById("play-pause")
    this.playPauseIcon = this.playPauseBtn?.querySelector("i")

    this.currentSlide = 0
    this.isPlaying = true
    this.autoplayInterval = null
    this.autoplayDelay = 5000 // 5 seconds

    this.init()
  }

  init() {
    this.setupBackgroundImages()
    this.setupControls()
    this.setupIndicators()
    this.startAutoplay()
    this.setupKeyboardNavigation()
    this.setupHoverPause()
    this.setupVisibilityChange()
  }

  setupBackgroundImages() {
    this.slides.forEach((slide) => {
      const bgImage = slide.getAttribute("data-bg")
      if (bgImage) {
        slide.style.backgroundImage = `url(${bgImage})`
      }
    })
  }

  setupControls() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => this.previousSlide())
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => this.nextSlide())
    }

    if (this.playPauseBtn) {
      this.playPauseBtn.addEventListener("click", () => this.toggleAutoplay())
    }
  }

  setupIndicators() {
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => this.goToSlide(index))
    })
  }

  setupKeyboardNavigation() {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        this.previousSlide()
      } else if (e.key === "ArrowRight") {
        this.nextSlide()
      } else if (e.key === " ") {
        e.preventDefault()
        this.toggleAutoplay()
      }
    })
  }

  goToSlide(index) {
    // Remove active class from current slide and indicator
    this.slides[this.currentSlide].classList.remove("active")
    this.indicators[this.currentSlide].classList.remove("active")

    // Update current slide index
    this.currentSlide = index

    // Add active class to new slide and indicator
    this.slides[this.currentSlide].classList.add("active")
    this.indicators[this.currentSlide].classList.add("active")

    // Restart autoplay if it's enabled
    if (this.isPlaying) {
      this.restartAutoplay()
    }
  }

  nextSlide() {
    const nextIndex = (this.currentSlide + 1) % this.slides.length
    this.goToSlide(nextIndex)
  }

  previousSlide() {
    const prevIndex = (this.currentSlide - 1 + this.slides.length) % this.slides.length
    this.goToSlide(prevIndex)
  }

  startAutoplay() {
    if (this.isPlaying) {
      this.autoplayInterval = setInterval(() => {
        this.nextSlide()
      }, this.autoplayDelay)
    }
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval)
      this.autoplayInterval = null
    }
  }

  restartAutoplay() {
    this.stopAutoplay()
    this.startAutoplay()
  }

  toggleAutoplay() {
    this.isPlaying = !this.isPlaying

    if (this.isPlaying) {
      this.startAutoplay()
      if (this.playPauseIcon) {
        this.playPauseIcon.className = "fas fa-pause"
      }
    } else {
      this.stopAutoplay()
      if (this.playPauseIcon) {
        this.playPauseIcon.className = "fas fa-play"
      }
    }
  }

  // Pause autoplay when user hovers over slider
  setupHoverPause() {
    if (this.slider) {
      this.slider.addEventListener("mouseenter", () => {
        if (this.isPlaying) {
          this.stopAutoplay()
        }
      })

      this.slider.addEventListener("mouseleave", () => {
        if (this.isPlaying) {
          this.startAutoplay()
        }
      })
    }
  }

  // Handle visibility change (pause when tab is not active)
  setupVisibilityChange() {
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) {
        this.stopAutoplay()
      } else if (this.isPlaying) {
        this.startAutoplay()
      }
    })
  }
}

// Services Section Manager
class ServicesManager {
  constructor() {
    this.servicesGrid = document.querySelector(".services-grid")
    this.services = [
      {
        title: "Personal Security",
        description:
          "Elite bodyguard services for VIPs, executives, and high-profile individuals with discretion and expertise.",
        image: "public/professional-bodyguard-in-suit-protecting-vip-clie.jpg",
        features: [
          "Trained Security Professionals",
          "Discrete Protection Services",
          "Risk Assessment & Planning",
          "24/7 Personal Protection",
          "Emergency Response Team",
        ],
      },
      {
        title: "Escort Services",
        description:
          "Professional security escorts for events, travel, and daily protection needs with trained personnel.",
        image: "public/professional-security-guard-in-suit-protecting-vip.jpg",
        features: [
          "Event Security Coverage",
          "Travel Protection Services",
          "Crowd Management",
          "VIP Transportation",
          "Threat Assessment",
        ],
      },
      {
        title: "Home Security",
        description:
          "Advanced security systems with 24/7 monitoring, smart technology, and rapid response capabilities.",
        image: "public/modern-home-security-system-with-cameras-and-senso.jpg",
        features: [
          "Smart Security Systems",
          "24/7 Monitoring Service",
          "Mobile App Control",
          "Rapid Response Team",
          "Professional Installation",
        ],
      },
      {
        title: "Convoy Protection",
        description: "Armored vehicle escorts and convoy protection for high-value transport and personnel movement.",
        image: "public/armored-security-convoy-vehicles-on-road.jpg",
        features: [
          "Armored Vehicle Fleet",
          "Route Planning & Security",
          "Communication Systems",
          "Emergency Protocols",
          "Trained Security Drivers",
        ],
      },
      {
        title: "Corporate Security",
        description:
          "Comprehensive security solutions for businesses including access control and surveillance systems.",
        image: "public/corporate-office-building-with-security-personnel-.jpg",
        features: [
          "Access Control Systems",
          "Surveillance Technology",
          "Security Personnel",
          "Emergency Planning",
          "Risk Management",
        ],
      },
      {
        title: "Security Equipment",
        description: "State-of-the-art security equipment and technology solutions for comprehensive protection.",
        image: "public/advanced-security-surveillance-equipment-and-monit.jpg",
        features: [
          "Advanced Surveillance",
          "Communication Equipment",
          "Detection Systems",
          "Monitoring Technology",
          "Custom Solutions",
        ],
      },
    ]
    this.init()
  }

  init() {
    this.renderServices()
  }

  renderServices() {
    if (!this.servicesGrid) return

    this.servicesGrid.innerHTML = this.services
      .map(
        (service, index) => `
      <div class="service-item animate-on-scroll" style="animation-delay: ${index * 0.1}s">
        <div class="service-content">
          <h3>${service.title}</h3>
          <p>${service.description}</p>
          <ul class="service-features">
            ${service.features
              .map(
                (feature) => `
              <li><i class="fas fa-check"></i> ${feature}</li>
            `,
              )
              .join("")}
          </ul>
          <button class="cta-button">Learn More</button>
        </div>
        <div class="service-image">
          <img src="${service.image}" alt="${service.title}" loading="lazy">
        </div>
      </div>
    `,
      )
      .join("")
  }
}

// Parallax Effect Manager
class ParallaxManager {
  constructor() {
    this.parallaxElements = []
    this.init()
  }

  init() {
    this.setupParallaxElements()
    this.setupScrollListener()
  }

  setupParallaxElements() {
    // Add parallax effect to hero section
    const heroSection = document.querySelector(".hero")
    if (heroSection) {
      this.parallaxElements.push({
        element: heroSection,
        speed: 0.5,
      })
    }

    // Add parallax to section backgrounds
    const sections = document.querySelectorAll(".section")
    sections.forEach((section) => {
      if (section.classList.contains("about") || section.classList.contains("gallery")) {
        this.parallaxElements.push({
          element: section,
          speed: 0.3,
        })
      }
    })
  }

  setupScrollListener() {
    let ticking = false

    const updateParallax = () => {
      const scrollTop = window.pageYOffset

      this.parallaxElements.forEach(({ element, speed }) => {
        const rect = element.getBoundingClientRect()
        const elementTop = rect.top + scrollTop
        const elementHeight = rect.height
        const windowHeight = window.innerHeight

        // Only apply parallax if element is in viewport
        if (scrollTop + windowHeight > elementTop && scrollTop < elementTop + elementHeight) {
          const yPos = -(scrollTop - elementTop) * speed
          element.style.transform = `translateY(${yPos}px)`
        }
      })

      ticking = false
    }

    window.addEventListener("scroll", () => {
      if (!ticking) {
        requestAnimationFrame(updateParallax)
        ticking = true
      }
    })
  }
}

// Gallery Manager
class GalleryManager {
  constructor() {
    this.galleryGrid = document.getElementById("gallery-grid")
    this.filterButtons = document.querySelectorAll(".filter-btn")
    this.modal = document.getElementById("gallery-modal")
    this.modalImage = document.getElementById("modal-image")
    this.modalCaption = document.getElementById("modal-caption")
    this.modalClose = document.getElementById("modal-close")

    this.currentFilter = "all"
    this.galleryItems = [
      {
        id: 1,
        category: "personal",
        image: "public/professional-bodyguard-in-suit-protecting-vip-clie.jpg",
        caption: "Professional bodyguard providing VIP protection services",
      },
      {
        id: 2,
        category: "convoy",
        image: "public/armored-security-convoy-vehicles-on-road.jpg",
        caption: "Armored convoy protection for high-value transport",
      },
      {
        id: 3,
        category: "home",
        image: "public/modern-home-security-system-with-cameras-and-senso.jpg",
        caption: "Advanced home security system with smart monitoring",
      },
      {
        id: 4,
        category: "equipment",
        image: "public/advanced-security-surveillance-equipment-and-monit.jpg",
        caption: "State-of-the-art surveillance and monitoring equipment",
      },
      {
        id: 5,
        category: "personal",
        image: "public/professional-security-guard-in-suit-protecting-vip.jpg",
        caption: "Elite personal security detail in action",
      },
      {
        id: 6,
        category: "convoy",
        image: "public/security-convoy-protecting-valuable-transport.jpg",
        caption: "Security convoy ensuring safe valuable transport",
      },
      {
        id: 7,
        category: "home",
        image: "public/corporate-office-building-with-security-personnel-.jpg",
        caption: "Corporate security personnel monitoring premises",
      },
      {
        id: 8,
        category: "equipment",
        image: "public/professional-security-team-meeting-in-modern-offic.jpg",
        caption: "Security team coordination and planning session",
      },
      {
        id: 9,
        category: "personal",
        image: "public/professional-bodyguard-in-suit-protecting-vip-clie.jpg",
        caption: "Discrete personal protection for high-profile clients",
      },
    ]

    this.init()
  }

  init() {
    this.renderGallery()
    this.setupFilters()
    this.setupModal()
  }

  renderGallery() {
    if (!this.galleryGrid) return

    const filteredItems =
      this.currentFilter === "all"
        ? this.galleryItems
        : this.galleryItems.filter((item) => item.category === this.currentFilter)

    this.galleryGrid.innerHTML = filteredItems
      .map(
        (item, index) => `
      <div class="gallery-item animate-on-scroll" data-category="${item.category}" style="animation-delay: ${index * 0.1}s">
        <img src="${item.image}" alt="${item.caption}" loading="lazy">
        <div class="gallery-overlay">
          <i class="fas fa-search-plus"></i>
        </div>
      </div>
    `,
      )
      .join("")

    // Add click listeners to gallery items
    this.galleryGrid.querySelectorAll(".gallery-item").forEach((item, index) => {
      item.addEventListener("click", () => {
        const galleryItem = filteredItems[index]
        this.openModal(galleryItem.image, galleryItem.caption)
      })
    })

    // Re-trigger scroll animations for new items
    setTimeout(() => {
      const newItems = this.galleryGrid.querySelectorAll(".animate-on-scroll")
      newItems.forEach((item) => {
        if (!item.classList.contains("animated")) {
          item.classList.add("animated")
        }
      })
    }, 100)
  }

  setupFilters() {
    this.filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        // Remove active class from all buttons
        this.filterButtons.forEach((btn) => btn.classList.remove("active"))

        // Add active class to clicked button
        button.classList.add("active")

        // Update current filter
        this.currentFilter = button.getAttribute("data-filter")

        // Re-render gallery
        this.renderGallery()
      })
    })
  }

  setupModal() {
    if (!this.modal) return

    // Close modal when clicking close button
    if (this.modalClose) {
      this.modalClose.addEventListener("click", () => this.closeModal())
    }

    // Close modal when clicking outside the image
    this.modal.addEventListener("click", (e) => {
      if (e.target === this.modal) {
        this.closeModal()
      }
    })

    // Close modal with Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.modal.style.display === "flex") {
        this.closeModal()
      }
    })
  }

  openModal(imageSrc, caption) {
    if (!this.modal) return

    this.modalImage.src = imageSrc
    this.modalCaption.textContent = caption
    this.modal.style.display = "flex"
    document.body.style.overflow = "hidden" // Prevent background scrolling
  }

  closeModal() {
    if (!this.modal) return

    this.modal.style.display = "none"
    document.body.style.overflow = "" // Restore scrolling
  }
}

// Testimonials Manager
class TestimonialsManager {
  constructor() {
    this.slider = document.getElementById("testimonials-slider")
    this.prevBtn = document.getElementById("testimonial-prev")
    this.nextBtn = document.getElementById("testimonial-next")

    this.currentTestimonial = 0
    this.isAutoPlaying = true
    this.autoplayInterval = null
    this.autoplayDelay = 6000 // 6 seconds

    this.testimonials = [
      {
        id: 1,
        text: "SecureGuard Pro provided exceptional personal security for our executive team. Their professionalism and attention to detail gave us complete peace of mind during high-risk situations.",
        author: "Sarah Johnson",
        position: "CEO, TechCorp Industries",
        avatar: "public/professional-business-woman-ceo.jpg",
        rating: 5,
      },
      {
        id: 2,
        text: "The convoy protection service was flawless. Every detail was meticulously planned and executed. I felt completely secure throughout the entire journey.",
        author: "Michael Chen",
        position: "Government Official",
        avatar: "public/professional-businessman-client.jpg",
        rating: 5,
      },
      {
        id: 3,
        text: "Their home security system is state-of-the-art. The 24/7 monitoring and rapid response capabilities are exactly what we needed for our family's safety.",
        author: "Emily Rodriguez",
        position: "Private Client",
        avatar: "public/professional-business-woman-ceo.jpg",
        rating: 5,
      },
      {
        id: 4,
        text: "Outstanding escort services for our corporate events. The security team was discrete, professional, and highly effective. Highly recommended!",
        author: "David Thompson",
        position: "Event Coordinator",
        avatar: "public/professional-businessman-client.jpg",
        rating: 5,
      },
      {
        id: 5,
        text: "SecureGuard Pro's security equipment and technology solutions transformed our facility's protection capabilities. Their expertise is unmatched.",
        author: "Lisa Wang",
        position: "Facility Manager",
        avatar: "public/professional-business-woman-ceo.jpg",
        rating: 5,
      },
    ]

    this.init()
  }

  init() {
    this.renderTestimonials()
    this.setupControls()
    this.startAutoplay()
    this.setupHoverPause()
  }

  renderTestimonials() {
    if (!this.slider) return

    this.slider.innerHTML = this.testimonials
      .map(
        (testimonial, index) => `
      <div class="testimonial-item ${index === 0 ? "active" : ""}" data-index="${index}">
        <div class="testimonial-rating">
          ${Array(testimonial.rating).fill('<i class="fas fa-star"></i>').join("")}
        </div>
        <p class="testimonial-text">"${testimonial.text}"</p>
        <div class="testimonial-author">
          <img src="${testimonial.avatar}" alt="${testimonial.author}" class="author-avatar">
          <div class="author-info">
            <h4>${testimonial.author}</h4>
            <p>${testimonial.position}</p>
          </div>
        </div>
      </div>
    `,
      )
      .join("")
  }

  setupControls() {
    if (this.prevBtn) {
      this.prevBtn.addEventListener("click", () => {
        this.previousTestimonial()
        this.restartAutoplay()
      })
    }

    if (this.nextBtn) {
      this.nextBtn.addEventListener("click", () => {
        this.nextTestimonial()
        this.restartAutoplay()
      })
    }

    // Keyboard navigation
    document.addEventListener("keydown", (e) => {
      if (this.slider && this.isInViewport(this.slider)) {
        if (e.key === "ArrowLeft") {
          this.previousTestimonial()
          this.restartAutoplay()
        } else if (e.key === "ArrowRight") {
          this.nextTestimonial()
          this.restartAutoplay()
        }
      }
    })
  }

  goToTestimonial(index) {
    const testimonials = this.slider.querySelectorAll(".testimonial-item")

    // Remove active class from current testimonial
    testimonials[this.currentTestimonial].classList.remove("active")

    // Update current testimonial index
    this.currentTestimonial = index

    // Add active class to new testimonial
    testimonials[this.currentTestimonial].classList.add("active")
  }

  nextTestimonial() {
    const nextIndex = (this.currentTestimonial + 1) % this.testimonials.length
    this.goToTestimonial(nextIndex)
  }

  previousTestimonial() {
    const prevIndex = (this.currentTestimonial - 1 + this.testimonials.length) % this.testimonials.length
    this.goToTestimonial(prevIndex)
  }

  startAutoplay() {
    if (this.isAutoPlaying) {
      this.autoplayInterval = setInterval(() => {
        this.nextTestimonial()
      }, this.autoplayDelay)
    }
  }

  stopAutoplay() {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval)
      this.autoplayInterval = null
    }
  }

  restartAutoplay() {
    this.stopAutoplay()
    this.startAutoplay()
  }

  setupHoverPause() {
    if (this.slider) {
      this.slider.addEventListener("mouseenter", () => {
        this.stopAutoplay()
      })

      this.slider.addEventListener("mouseleave", () => {
        if (this.isAutoPlaying) {
          this.startAutoplay()
        }
      })
    }
  }

  isInViewport(element) {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }
}

// Contact Form Manager
class ContactFormManager {
  constructor() {
    this.form = document.getElementById("contact-form")
    this.submitBtn = this.form?.querySelector(".submit-btn")
    this.btnText = this.submitBtn?.querySelector(".btn-text")
    this.btnLoading = this.submitBtn?.querySelector(".btn-loading")
    this.successMessage = document.getElementById("form-success")

    this.validationRules = {
      name: {
        required: true,
        minLength: 2,
        pattern: /^[a-zA-Z\s]+$/,
        message: "Please enter a valid name (letters and spaces only)",
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Please enter a valid email address",
      },
      phone: {
        required: false,
        pattern: /^[+]?[1-9][\d]{0,15}$/,
        message: "Please enter a valid phone number",
      },
      message: {
        required: true,
        minLength: 10,
        maxLength: 1000,
        message: "Message must be between 10 and 1000 characters",
      },
    }

    this.init()
  }

  init() {
    if (!this.form) return

    this.setupFormValidation()
    this.setupFormSubmission()
    this.setupRealTimeValidation()
  }

  setupFormValidation() {
    // Add input event listeners for real-time validation
    const inputs = this.form.querySelectorAll("input, textarea, select")
    inputs.forEach((input) => {
      input.addEventListener("blur", () => this.validateField(input))
      input.addEventListener("input", () => this.clearFieldError(input))
    })
  }

  setupRealTimeValidation() {
    const nameInput = this.form.querySelector("#name")
    const emailInput = this.form.querySelector("#email")
    const phoneInput = this.form.querySelector("#phone")
    const messageInput = this.form.querySelector("#message")

    // Name validation - only letters and spaces
    if (nameInput) {
      nameInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^a-zA-Z\s]/g, "")
      })
    }

    // Phone validation - only numbers, +, and basic formatting
    if (phoneInput) {
      phoneInput.addEventListener("input", (e) => {
        e.target.value = e.target.value.replace(/[^\d+\-$$$$\s]/g, "")
      })
    }

    // Message character counter
    if (messageInput) {
      const maxLength = 1000
      messageInput.addEventListener("input", (e) => {
        const remaining = maxLength - e.target.value.length
        let counter = messageInput.parentNode.querySelector(".char-counter")

        if (!counter) {
          counter = document.createElement("div")
          counter.className = "char-counter"
          messageInput.parentNode.appendChild(counter)
        }

        counter.textContent = `${remaining} characters remaining`
        counter.style.color = remaining < 50 ? "var(--destructive)" : "var(--muted-foreground)"
      })
    }
  }

  validateField(field) {
    const fieldName = field.name
    const fieldValue = field.value.trim()
    const rules = this.validationRules[fieldName]
    const errorElement = document.getElementById(`${fieldName}-error`)

    if (!rules) return true

    // Clear previous errors
    this.clearFieldError(field)

    // Required field validation
    if (rules.required && !fieldValue) {
      this.showFieldError(field, `${this.capitalizeFirst(fieldName)} is required`)
      return false
    }

    // Skip other validations if field is empty and not required
    if (!fieldValue && !rules.required) return true

    // Minimum length validation
    if (rules.minLength && fieldValue.length < rules.minLength) {
      this.showFieldError(field, `${this.capitalizeFirst(fieldName)} must be at least ${rules.minLength} characters`)
      return false
    }

    // Maximum length validation
    if (rules.maxLength && fieldValue.length > rules.maxLength) {
      this.showFieldError(field, `${this.capitalizeFirst(fieldName)} must be less than ${rules.maxLength} characters`)
      return false
    }

    // Pattern validation
    if (rules.pattern && !rules.pattern.test(fieldValue)) {
      this.showFieldError(field, rules.message)
      return false
    }

    return true
  }

  showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.name}-error`)
    if (errorElement) {
      errorElement.textContent = message
      errorElement.style.display = "block"
    }
    field.style.borderColor = "var(--destructive)"
  }

  clearFieldError(field) {
    const errorElement = document.getElementById(`${field.name}-error`)
    if (errorElement) {
      errorElement.textContent = ""
      errorElement.style.display = "none"
    }
    field.style.borderColor = "var(--border)"
  }

  validateForm() {
    const inputs = this.form.querySelectorAll("input[required], textarea[required]")
    let isValid = true

    inputs.forEach((input) => {
      if (!this.validateField(input)) {
        isValid = false
      }
    })

    // Validate optional fields that have content
    const optionalInputs = this.form.querySelectorAll("input:not([required]), textarea:not([required])")
    optionalInputs.forEach((input) => {
      if (input.value.trim()) {
        if (!this.validateField(input)) {
          isValid = false
        }
      }
    })

    return isValid
  }

  setupFormSubmission() {
    this.form.addEventListener("submit", async (e) => {
      e.preventDefault()

      if (!this.validateForm()) {
        this.showFormError("Please correct the errors above")
        return
      }

      await this.submitForm()
    })
  }

  async submitForm() {
    this.setLoadingState(true)

    try {
      // Simulate form submission delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // In a real application, you would send the data to your server
      const formData = new FormData(this.form)
      const data = Object.fromEntries(formData.entries())

      console.log("[v0] Form submission data:", data)

      // Show success message
      this.showSuccessMessage()
      this.form.reset()

      // Clear any character counters
      const charCounters = this.form.querySelectorAll(".char-counter")
      charCounters.forEach((counter) => counter.remove())
    } catch (error) {
      console.error("[v0] Form submission error:", error)
      this.showFormError("There was an error sending your message. Please try again.")
    } finally {
      this.setLoadingState(false)
    }
  }

  setLoadingState(isLoading) {
    if (!this.submitBtn || !this.btnText || !this.btnLoading) return

    this.submitBtn.disabled = isLoading

    if (isLoading) {
      this.btnText.style.display = "none"
      this.btnLoading.style.display = "inline-flex"
    } else {
      this.btnText.style.display = "inline"
      this.btnLoading.style.display = "none"
    }
  }

  showSuccessMessage() {
    if (this.successMessage) {
      this.successMessage.style.display = "block"

      // Hide success message after 5 seconds
      setTimeout(() => {
        this.successMessage.style.display = "none"
      }, 5000)
    }
  }

  showFormError(message) {
    // Create or update error message element
    let errorElement = this.form.querySelector(".form-error")

    if (!errorElement) {
      errorElement = document.createElement("div")
      errorElement.className = "form-error"
      errorElement.style.cssText = `
        background: var(--destructive);
        color: white;
        padding: 1rem;
        border-radius: var(--radius);
        margin-top: 1rem;
        text-align: center;
      `
      this.form.appendChild(errorElement)
    }

    errorElement.textContent = message
    errorElement.style.display = "block"

    // Hide error message after 5 seconds
    setTimeout(() => {
      errorElement.style.display = "none"
    }, 5000)
  }

  capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}

// Footer Interactions Manager
class FooterManager {
  constructor() {
    this.footer = document.querySelector(".footer")
    this.socialLinks = document.querySelectorAll(".social-links a")
    this.footerLinks = document.querySelectorAll(".footer-section a")
    this.emergencyBanner = document.querySelector(".emergency-banner")

    this.init()
  }

  init() {
    this.setupSocialLinks()
    this.setupFooterLinks()
    this.setupEmergencyBanner()
    this.setupScrollToTop()
  }

  setupSocialLinks() {
    this.socialLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault()

        // Get the social platform from the icon class
        const icon = link.querySelector("i")
        const platform = this.getSocialPlatform(icon.className)

        // In a real application, these would be actual social media URLs
        console.log(`[v0] Opening ${platform} social media page`)

        // Add visual feedback
        link.style.transform = "scale(1.2)"
        setTimeout(() => {
          link.style.transform = "scale(1)"
        }, 200)
      })
    })
  }

  setupFooterLinks() {
    this.footerLinks.forEach((link) => {
      // Skip social links and external links
      if (link.closest(".social-links") || link.href.startsWith("tel:")) return

      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href")

        // Handle internal navigation links
        if (href && href.startsWith("#")) {
          e.preventDefault()
          const targetSection = document.querySelector(href)

          if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70
            window.scrollTo({
              top: offsetTop,
              behavior: "smooth",
            })
          }
        }
      })
    })
  }

  setupEmergencyBanner() {
    if (this.emergencyBanner) {
      // Add pulsing animation to emergency banner
      this.emergencyBanner.style.animation = "pulse 2s infinite"

      // Add CSS for pulse animation if not already present
      if (!document.querySelector("#emergency-pulse-style")) {
        const style = document.createElement("style")
        style.id = "emergency-pulse-style"
        style.textContent = `
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.8; }
            100% { opacity: 1; }
          }
        `
        document.head.appendChild(style)
      }
    }
  }

  setupScrollToTop() {
    // Create scroll to top button
    const scrollToTopBtn = document.createElement("button")
    scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>'
    scrollToTopBtn.className = "scroll-to-top"
    scrollToTopBtn.setAttribute("aria-label", "Scroll to top")

    // Style the button
    scrollToTopBtn.style.cssText = `
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 50px;
      height: 50px;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      z-index: 1000;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.2rem;
    `

    document.body.appendChild(scrollToTopBtn)

    // Show/hide button based on scroll position
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = "1"
        scrollToTopBtn.style.visibility = "visible"
      } else {
        scrollToTopBtn.style.opacity = "0"
        scrollToTopBtn.style.visibility = "hidden"
      }
    })

    // Scroll to top functionality
    scrollToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })

    // Hover effects
    scrollToTopBtn.addEventListener("mouseenter", () => {
      scrollToTopBtn.style.background = "var(--primary-dark)"
      scrollToTopBtn.style.transform = "scale(1.1)"
    })

    scrollToTopBtn.addEventListener("mouseleave", () => {
      scrollToTopBtn.style.background = "var(--primary)"
      scrollToTopBtn.style.transform = "scale(1)"
    })
  }

  getSocialPlatform(iconClass) {
    if (iconClass.includes("facebook")) return "Facebook"
    if (iconClass.includes("twitter")) return "Twitter"
    if (iconClass.includes("linkedin")) return "LinkedIn"
    if (iconClass.includes("instagram")) return "Instagram"
    return "Social Media"
  }
}

// Performance and Accessibility Manager
class PerformanceManager {
  constructor() {
    this.init()
  }

  init() {
    this.setupLazyLoading()
    this.setupPreloadCriticalImages()
    this.setupReducedMotion()
    this.setupFocusManagement()
  }

  setupLazyLoading() {
    // Enhanced lazy loading for images
    const images = document.querySelectorAll('img[loading="lazy"]')

    if ("IntersectionObserver" in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target

            // Add loading class for smooth transition
            img.classList.add("loading")

            img.addEventListener("load", () => {
              img.classList.remove("loading")
              img.classList.add("loaded")
            })

            imageObserver.unobserve(img)
          }
        })
      })

      images.forEach((img) => imageObserver.observe(img))
    }
  }

  setupPreloadCriticalImages() {
    // Preload hero images for better performance
    const heroSlides = document.querySelectorAll(".slide[data-bg]")
    heroSlides.forEach((slide) => {
      const bgImage = slide.getAttribute("data-bg")
      if (bgImage) {
        const link = document.createElement("link")
        link.rel = "preload"
        link.as = "image"
        link.href = bgImage
        document.head.appendChild(link)
      }
    })
  }

  setupReducedMotion() {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)")

    if (prefersReducedMotion.matches) {
      document.documentElement.style.setProperty("--animation-duration", "0.01ms")

      // Disable autoplay for sliders
      const heroSlider = document.querySelector(".hero-slider")
      const testimonialsSlider = document.querySelector(".testimonials-slider")

      if (heroSlider) {
        heroSlider.style.animationPlayState = "paused"
      }

      if (testimonialsSlider) {
        testimonialsSlider.style.animationPlayState = "paused"
      }
    }
  }

  setupFocusManagement() {
    // Improve keyboard navigation
    const focusableElements = document.querySelectorAll(
      'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])',
    )

    focusableElements.forEach((element) => {
      element.addEventListener("focus", () => {
        element.style.outline = "2px solid var(--primary)"
        element.style.outlineOffset = "2px"
      })

      element.addEventListener("blur", () => {
        element.style.outline = ""
        element.style.outlineOffset = ""
      })
    })

    // Skip to main content link
    const skipLink = document.createElement("a")
    skipLink.href = "#home"
    skipLink.textContent = "Skip to main content"
    skipLink.className = "skip-link"
    skipLink.style.cssText = `
      position: absolute;
      top: -40px;
      left: 6px;
      background: var(--primary);
      color: white;
      padding: 8px;
      text-decoration: none;
      border-radius: 4px;
      z-index: 1001;
      transition: top 0.3s;
    `

    skipLink.addEventListener("focus", () => {
      skipLink.style.top = "6px"
    })

    skipLink.addEventListener("blur", () => {
      skipLink.style.top = "-40px"
    })

    document.body.insertBefore(skipLink, document.body.firstChild)
  }
}

// Initialize all managers when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  const loadingScreen = document.getElementById("loading-screen")
  if (loadingScreen) {
    // Add a small delay to ensure smooth transition
    setTimeout(() => {
      loadingScreen.style.opacity = "0"
      setTimeout(() => {
        loadingScreen.style.display = "none"
      }, 500) // Wait for fade out animation
    }, 1000) // Show loading for 1 second minimum
  }

  // Initialize core functionality
  new ThemeManager()
  new NavigationManager()
  new ScrollAnimationManager()
  new CounterAnimationManager()

  // Initialize hero slider
  new HeroSliderManager()

  // Initialize services section
  new ServicesManager()

  // Initialize parallax effects
  new ParallaxManager()

  // Initialize gallery and testimonials
  new GalleryManager()
  new TestimonialsManager()

  // Initialize contact form and footer
  new ContactFormManager()
  new FooterManager()

  // Initialize performance and accessibility features
  new PerformanceManager()

  const navLogo = document.querySelector(".nav-logo")
  if (navLogo) {
    navLogo.style.cursor = "pointer"
    navLogo.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  const heroButtons = document.querySelectorAll(".hero-cta")
  heroButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-target")
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70 // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  console.log("[v0] All functionality initialized - website ready!")
})
