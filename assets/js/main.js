/**
 * Keerti Vishwkarma - Futuristic 3D Developer Portfolio JS
 * Features: Cyber Preloader, Custom Canvas Particle Background, 3D Tilt Hover, 
 * Cursor Glow, Custom Typing Animation, Intersection Counter Ticker, Project Filters & Modal
 */

document.addEventListener('DOMContentLoaded', () => {
    // ---------------------------------------------
    // 1. PRELOADER / SYSTEM INITIALIZER
    // ---------------------------------------------
    const preloader = document.getElementById('preloader');
    const loadingText = document.getElementById('loading-text');
    const progressBar = document.getElementById('loader-progress');
    
    if (preloader && loadingText && progressBar) {
        const bootSequences = [
            'INITIALIZING QUANTUM CORE...',
            'ESTABLISHING RESUME DATABASES...',
            'CONNECTING MOSH E-COM SERVERS...',
            'BOOTING IBM CLOUD NODES...',
            'INJECTING GLASSMORPHIC INTERFACES...',
            'PORTFOLIO SYSTEM ONLINE!'
        ];
        
        let seqIndex = 0;
        let progress = 0;
        
        const bootInterval = setInterval(() => {
            if (progress >= 100) {
                clearInterval(bootInterval);
                loadingText.innerText = bootSequences[bootSequences.length - 1];
                progressBar.style.width = '100%';
                
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    preloader.style.visibility = 'hidden';
                    // Re-init AOS once preloader is gone
                    if (typeof AOS !== 'undefined') {
                        AOS.init({
                            duration: 1000,
                            once: true,
                            mirror: false
                        });
                    }
                }, 600);
            } else {
                progress += Math.floor(Math.random() * 15) + 5;
                if (progress > 100) progress = 100;
                progressBar.style.width = `${progress}%`;
                
                if (progress > (seqIndex + 1) * 16 && seqIndex < bootSequences.length - 2) {
                    seqIndex++;
                }
                loadingText.innerText = bootSequences[seqIndex];
            }
        }, 100);
    } else {
        // Fallback AOS init if preloader elements are missing
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 1000,
                once: true
            });
        }
    }

    // ---------------------------------------------
    // 2. INTERACTIVE CYBER CANVAS PARTICLES
    // ---------------------------------------------
    const canvas = document.getElementById('cyber-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const maxParticles = 65;
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        let mouse = { x: null, y: null, radius: 150 };
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.6;
                this.speedY = (Math.random() - 0.5) * 0.6;
                this.color = Math.random() > 0.5 ? 'rgba(0, 242, 254, 0.6)' : 'rgba(157, 78, 221, 0.6)';
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
                
                if (mouse.x !== null && mouse.y !== null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = dx / distance;
                        let directionY = dy / distance;
                        this.x -= directionX * force * 1.5;
                        this.y -= directionY * force * 1.5;
                    }
                }
            }
            
            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.shadowBlur = 8;
                ctx.shadowColor = this.color;
                ctx.fill();
                ctx.shadowBlur = 0;
            }
        }
        
        const initParticles = () => {
            particles = [];
            for (let i = 0; i < maxParticles; i++) {
                particles.push(new Particle());
            }
        };
        initParticles();
        
        const connectParticles = () => {
            let opacity = 1;
            for (let a = 0; a < particles.length; a++) {
                for (let b = a; b < particles.length; b++) {
                    let dx = particles[a].x - particles[b].x;
                    let dy = particles[a].y - particles[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        opacity = 1 - (distance / 120);
                        ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.15})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(particles[a].x, particles[a].y);
                        ctx.lineTo(particles[b].x, particles[b].y);
                        ctx.stroke();
                    }
                }
            }
        };
        
        const animateParticles = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
            ctx.lineWidth = 1;
            const gridSpacing = 60;
            for (let x = 0; x < canvas.width; x += gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, canvas.height);
                ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += gridSpacing) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(canvas.width, y);
                ctx.stroke();
            }
            
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            connectParticles();
            requestAnimationFrame(animateParticles);
        };
        animateParticles();
    }

    // ---------------------------------------------
    // 3. CURSOR GLOW EFFECT
    // ---------------------------------------------
    const cursorGlow = document.getElementById('cursor-glow');
    if (cursorGlow) {
        window.addEventListener('mousemove', (e) => {
            cursorGlow.style.left = `${e.clientX}px`;
            cursorGlow.style.top = `${e.clientY}px`;
        });
    }

    // ---------------------------------------------
    // 4. 3D TILT HOVER EFFECT
    // ---------------------------------------------
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((centerY - y) / centerY) * 10; // max tilt 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
            
            const glow = card.querySelector('.card-reflection');
            if (glow) {
                glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0) 60%)`;
            }
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            const glow = card.querySelector('.card-reflection');
            if (glow) {
                glow.style.background = 'transparent';
            }
        });
    });

    // ---------------------------------------------
    // 5. CUSTOM TYPING ANIMATION (HERO)
    // ---------------------------------------------
    const typeTarget = document.getElementById('typing-text');
    if (typeTarget) {
        const words = JSON.parse(typeTarget.getAttribute('data-words') || '["Laravel Developer", "Full Stack Developer", "Backend Engineer", "React & PHP Specialist"]');
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;
        
        const typeEffect = () => {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typeTarget.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typeTarget.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 120;
            }
            
            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typingSpeed = 2000; // Pause at full word
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typingSpeed = 400; // Pause before typing next word
            }
            
            setTimeout(typeEffect, typingSpeed);
        };
        
        setTimeout(typeEffect, 1000);
    }

    // ---------------------------------------------
    // 6. SCROLL PROGRESS INDICATOR
    // ---------------------------------------------
    const progressBarIndicator = document.getElementById('scroll-progress');
    if (progressBarIndicator) {
        window.addEventListener('scroll', () => {
            const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (window.pageYOffset / totalHeight) * 100;
            progressBarIndicator.style.width = `${progress}%`;
        });
    }

    // ---------------------------------------------
    // 7. COUNTER TICKER (ABOUT ME)
    // ---------------------------------------------
    const counterElements = document.querySelectorAll('.counter-val');
    if (counterElements.length > 0) {
        const animateCounters = (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const target = entry.target;
                    const countTo = parseInt(target.getAttribute('data-count'), 10) || 0;
                    let current = 0;
                    const duration = 2000;
                    const steps = 50;
                    const stepValue = countTo / steps;
                    const stepTime = duration / steps;
                    
                    const counterInterval = setInterval(() => {
                        current += stepValue;
                        if (current >= countTo) {
                            target.textContent = countTo;
                            clearInterval(counterInterval);
                        } else {
                            target.textContent = Math.floor(current);
                        }
                    }, stepTime);
                    
                    observer.unobserve(target);
                }
            });
        };
        
        const counterObserver = new IntersectionObserver(animateCounters, {
            threshold: 0.5
        });
        
        counterElements.forEach(el => counterObserver.observe(el));
    }

    // ---------------------------------------------
    // 8. STICKY NAVBAR SCROLL GLOW
    // ---------------------------------------------
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('nav-scrolled');
            } else {
                navbar.classList.remove('nav-scrolled');
            }
        });
    }

    // ---------------------------------------------
    // 9. PORTFOLIO FILTER & MODAL INJECTION
    // ---------------------------------------------
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-item-col');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const category = btn.getAttribute('data-filter');
            
            projectCards.forEach(col => {
                const colCategory = col.getAttribute('data-category');
                
                if (category === 'all' || colCategory.includes(category)) {
                    col.style.display = 'block';
                    setTimeout(() => {
                        col.style.opacity = '1';
                        col.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    col.style.opacity = '0';
                    col.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        col.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Integrated Resume + Custom Projects Data
    const projectDetails = {
        'restaurant': {
            title: 'Responsive Restaurant Website',
            desc: 'A gorgeous modern landing page template designed specifically for high-end dining hubs and restaurants. Built using semantic HTML5, custom CSS3 animation properties, and smooth vanilla JavaScript for processing reservation flows, visual elements, and responsive layout grids.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Grid'],
            demo: 'https://keerti1924.github.io/Responsive-Restaurant-Website/',
            github: 'https://github.com/keerti1924/Responsive-Restaurant-Website'
        },
        'construction': {
            title: 'Construction Website Landing Page',
            desc: 'A premium corporate landing page website created for architectural firms and construction corporations. It leverages the Bootstrap 5 design grid, styling classes, and interactive scroll triggers to display visual project statistics, service categories, and responsive quote forms.',
            tech: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript'],
            demo: 'https://keerti1924.github.io/Construction-Website-Landing-Page/',
            github: 'https://github.com/keerti1924/Construction-Website-Landing-Page'
        },
        'netflix': {
            title: 'Netflix Landing Page Clone',
            desc: 'A beautiful pixel-perfect replica of the Netflix streaming platform welcome dashboard. It includes completely custom collapsible FAQ query sections designed using accordion transitions, responsive fluid scaling, and high-fidelity layout alignments.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'Responsive Layout'],
            demo: 'https://keerti1924.github.io/Netflix-Landing-Page/',
            github: 'https://github.com/keerti1924/Netflix-Landing-Page'
        },
        'elearning-frontend': {
            title: 'E-Learning Website Portal',
            desc: 'An interactive frontend template designed for online courses and e-learning catalogs. Developed with Bootstrap 5, featuring highly responsive landing sections, visual dashboard layouts, smooth custom search lists, and beautiful visual grid patterns.',
            tech: ['HTML5', 'CSS3', 'Bootstrap 5', 'JavaScript'],
            demo: 'https://keerti1924.github.io/E-Learning-Website-HTML-CSS/',
            github: 'https://github.com/keerti1924/E-Learning-Website-HTML-CSS'
        },
        'travel-tour': {
            title: 'Travel & Tour Agency Website',
            desc: 'A responsive travel booking template displaying destinations, promotional packages, and user reviews. Built with custom CSS flex grids, keyframe styling, and responsive media handlers to offer visual stability on any mobile or desktop device.',
            tech: ['HTML5', 'CSS3', 'Responsive Design', 'Flexbox'],
            demo: 'https://keerti1924.github.io/Travel-Tour-Website/',
            github: 'https://github.com/keerti1924/Travel-Tour-Website'
        },
        'flask-crud': {
            title: 'Python Flask CRUD Database Application',
            desc: 'A full-stack database-driven app powered by Python and the Flask framework. Implements SQLite as the back-end storage engine, handling user record creations, structured data reads, details updates, and direct entries deletions with secure form validations.',
            tech: ['Python', 'Flask', 'SQLite', 'CRUD Operations'],
            demo: 'https://github.com/keerti1924/Python-Flask-CRUD-App',
            github: 'https://github.com/keerti1924/Python-Flask-CRUD-App'
        },
        'bookstore': {
            title: 'Online Book Store Management System',
            desc: 'A comprehensive web catalog designed to sell and organize literary items online. Developed with server-side PHP scripts and structured MySQL tables to handle purchase procedures, book categories, inventory statuses, and shopping cart listings.',
            tech: ['PHP', 'MySQL', 'HTML5', 'CSS3', 'Backend Engine'],
            demo: 'https://php-online-book-store.000webhostapp.com/',
            github: 'https://github.com/keerti1924'
        },
        'calculator': {
            title: 'Scientific Calculator Web Application',
            desc: 'A feature-rich online calculations terminal providing a complete array of mathematical operations. Uses JavaScript Core engine to process complex algebraic, logarithmic, and trigonometric equations within a beautiful, futuristic glass interface.',
            tech: ['HTML5', 'CSS3', 'JavaScript', 'DOM APIs'],
            demo: 'https://keerti1924.github.io/Scientific-Calculator/',
            github: 'https://github.com/keerti1924/Scientific-Calculator'
        },
        'django-blog': {
            title: 'Django Blog & CMS Platform',
            desc: 'A full-featured blogging system running on the Python/Django framework. Includes complete account registration portals, user authentication checks, custom publishing dashboards to add, edit, or delete posts with visual images, and secure admin control ledgers.',
            tech: ['Django', 'Python', 'SQLite', 'Authentication Gates', 'Render'],
            demo: 'https://blogs-n2mq.onrender.com/',
            github: 'https://github.com/keerti1924'
        },
        'django-elearning': {
            title: 'E-Learning Online Course Platform',
            desc: 'A robust web application engineered on Python/Django. Facilitates the creation, publishing, management, and consumption of learning materials, offering custom student dashboards, interactive course modules, and full deployment structures on PythonAnywhere.',
            tech: ['Django', 'Python', 'SQLite', 'PythonAnywhere Deploy'],
            demo: 'https://keerti1924.pythonanywhere.com/',
            github: 'https://github.com/keerti1924'
        },
        'keerti-prompts': {
            title: 'Keerti Prompts - AI Prompt Engineering Platform',
            desc: 'A premium, full-stack prompt engineering directory and resource sharing hub built using Laravel and PHP. Integrated with a robust MySQL database layer to curate, index, and organize optimal prompts for generative AI systems and large language models. Rendered beautifully using a modern custom Bootstrap 5 interface, CSS styling tokens, and interactive front-end JavaScript elements.',
            tech: ['Laravel', 'PHP', 'MySQL', 'Bootstrap 5', 'HTML5', 'CSS3', 'JavaScript'],
            demo: 'https://keertiprompts.com/',
            github: 'https://keertiprompts.com/'
        }
    };

    // Modal triggering and injecting content
    const projectModals = document.querySelectorAll('[data-bs-target="#projectModal"]');
    projectModals.forEach(trigger => {
        trigger.addEventListener('click', () => {
            const projectKey = trigger.getAttribute('data-project-key');
            const details = projectDetails[projectKey];
            
            if (details) {
                document.getElementById('modalProjectTitle').innerText = details.title;
                document.getElementById('modalProjectDesc').innerText = details.desc;
                
                // Set images
                const cardImg = trigger.closest('.card-custom').querySelector('.card-custom-image img').getAttribute('src');
                document.getElementById('modalProjectImg').setAttribute('src', cardImg);
                
                // Badges container
                const badgesContainer = document.getElementById('modalProjectBadges');
                badgesContainer.innerHTML = '';
                details.tech.forEach(t => {
                    const badge = document.createElement('span');
                    badge.className = 'tech-badge';
                    badge.innerText = t;
                    badgesContainer.appendChild(badge);
                });
                
                // Links
                document.getElementById('modalDemoLink').setAttribute('href', details.demo);
                document.getElementById('modalRepoLink').setAttribute('href', details.github);
            }
        });
    });

    // ---------------------------------------------
    // 10. CONTACT FORM SUBMISSION GLOW & ACTIONS
    // ---------------------------------------------
    const contactForm = document.querySelector('.contact-futuristic-form-el');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            // Local file protocol ('file:') has strict browser security/CORS blocks on AJAX (Fetch).
            // If running locally as a file, let it submit naturally so the browser redirects smoothly to FormSubmit.
            if (window.location.protocol === 'file:') {
                const btn = contactForm.querySelector('button[type="submit"]');
                btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> CORE ROUTING...';
                return; // Let the form submit naturally!
            }

            e.preventDefault(); // Otherwise, perform high-end zero-reload AJAX on localhost or live domain!

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> CORE TRANSMITTING...';
            btn.disabled = true;
            
            // Dispatch dynamic payload via asynchronous Fetch
            fetch(contactForm.action, {
                method: "POST",
                body: new FormData(contactForm),
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    btn.innerHTML = '✔ MESSAGE SECURELY SENT!';
                    btn.classList.add('btn-success');
                    btn.style.boxShadow = '0 0 20px #198754';
                    contactForm.reset();
                } else {
                    btn.innerHTML = '❌ TRANSMISSION FAILURE';
                    btn.classList.add('btn-danger');
                    btn.style.boxShadow = '0 0 20px #dc3545';
                }
            })
            .catch(error => {
                btn.innerHTML = '❌ OFFLINE ERROR';
                btn.classList.add('btn-danger');
                btn.style.boxShadow = '0 0 20px #dc3545';
            })
            .finally(() => {
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.classList.remove('btn-success', 'btn-danger');
                    btn.style.boxShadow = '';
                }, 2500);
            });
        });
    }

    // ---------------------------------------------
    // 11. DYNAMIC IDE CODE SANDBOX SWAPPER
    // ---------------------------------------------
    const ideTabs = document.querySelectorAll('.ide-tab');
    const codePanes = document.querySelectorAll('.ide-code-pane');

    ideTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active classes
            ideTabs.forEach(t => t.classList.remove('active'));
            codePanes.forEach(p => p.classList.remove('active'));

            // Set current active
            tab.classList.add('active');
            const fileKey = tab.getAttribute('data-file-key');
            const activePane = document.getElementById(`code-${fileKey}`);
            if (activePane) {
                activePane.classList.add('active');
            }
        });
    });
});