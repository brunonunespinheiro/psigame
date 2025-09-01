/**
 * PsiGame - JavaScript Principal
 * Sistema completo de interações e chatbot inteligente
 */

// ===========================
// VARIÁVEIS GLOBAIS
// ===========================

let scroll;
let isLoading = true;

// ===========================
// PRELOADER
// ===========================

class Preloader {
    constructor() {
        this.element = document.querySelector('.preloader');
        this.progressBar = document.querySelector('.preloader-progress-bar');
        this.counter = document.querySelector('.preloader-counter');
        this.progress = 0;
        this.init();
    }

    init() {
        // Verificar se todos os recursos estão carregados
        window.addEventListener('load', () => {
            this.startLoading();
        });
    }

    startLoading() {
        const duration = 1500; // 1.5 segundos
        const interval = 20;
        const increment = 100 / (duration / interval);

        const timer = setInterval(() => {
            this.progress += increment;
            
            if (this.progress >= 100) {
                this.progress = 100;
                clearInterval(timer);
                this.complete();
            }

            this.updateProgress();
        }, interval);
    }

    updateProgress() {
        const roundedProgress = Math.round(this.progress);
        this.progressBar.style.width = `${roundedProgress}%`;
        this.counter.textContent = `${roundedProgress}%`;
    }

    complete() {
        setTimeout(() => {
            this.element.classList.add('loaded');
            isLoading = false;
            initAnimations();
            
            // Remover preloader do DOM
            setTimeout(() => {
                if (this.element) {
                    this.element.remove();
                }
            }, 600);
        }, 300);
    }
}

// ===========================
// SMOOTH SCROLL (LOCOMOTIVE)
// ===========================

function initSmoothScroll() {
    const scrollContainer = document.querySelector('[data-scroll-container]');
    
    // Verificar se estamos em dispositivo móvel
    const isMobile = window.innerWidth <= 768;
    
    if (scrollContainer && !isMobile) {
        scroll = new LocomotiveScroll({
            el: scrollContainer,
            smooth: true,
            multiplier: 1,
            lerp: 0.08,
            smartphone: {
                smooth: false
            },
            tablet: {
                smooth: true
            }
        });

        // Atualizar locomotive no resize
        window.addEventListener('resize', () => {
            scroll.update();
        });

        // Scroll para o topo ao carregar
        scroll.scrollTo(0, { duration: 0 });
    }
}

// ===========================
// NAVEGAÇÃO
// ===========================

class Navigation {
    constructor() {
        this.navbar = document.getElementById('mainNav');
        this.toggler = document.querySelector('.navbar-toggler');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        // Efeito de scroll na navbar
        if (scroll) {
            scroll.on('scroll', (args) => {
                if (args.scroll.y > 50) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
            });
        } else {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    this.navbar.classList.add('scrolled');
                } else {
                    this.navbar.classList.remove('scrolled');
                }
            });
        }

        // Menu mobile
        if (this.toggler) {
            this.toggler.addEventListener('click', () => {
                this.toggler.classList.toggle('active');
            });
        }

        // Smooth scroll para links de navegação
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = link.getAttribute('href');
                
                if (target.startsWith('#')) {
                    const element = document.querySelector(target);
                    
                    if (element) {
                        if (scroll) {
                            scroll.scrollTo(element);
                        } else {
                            element.scrollIntoView({ behavior: 'smooth' });
                        }
                    }
                }
                
                // Fechar menu mobile
                const navCollapse = document.querySelector('.navbar-collapse');
                if (navCollapse && navCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navCollapse);
                    bsCollapse.hide();
                }
            });
        });
    }
}

// ===========================
// ANIMAÇÕES GSAP
// ===========================

function initAnimations() {
    // Registrar ScrollTrigger
    gsap.registerPlugin(ScrollTrigger);

    // Se usando Locomotive Scroll
    if (scroll) {
        scroll.on('scroll', ScrollTrigger.update);

        ScrollTrigger.scrollerProxy('[data-scroll-container]', {
            scrollTop(value) {
                return arguments.length ? scroll.scrollTo(value, 0, 0) : scroll.scroll.instance.scroll.y;
            },
            getBoundingClientRect() {
                return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
            },
            pinType: document.querySelector('[data-scroll-container]').style.transform ? 'transform' : 'fixed'
        });
    }

    // Animações do Hero
    animateHero();
    
    // Animações das seções
    animateSections();
    
    // Refresh ScrollTrigger
    ScrollTrigger.refresh();
}

function animateHero() {
    // Animação do título
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        gsap.fromTo(heroTitle,
            {
                y: 50,
                opacity: 0
            },
            {
                y: 0,
                opacity: 1,
                duration: 1,
                delay: 0.5,
                ease: 'power3.out'
            }
        );
    }

    // Elementos flutuantes
    const floatingElements = document.querySelectorAll('.floating-element');
    floatingElements.forEach((element, index) => {
        gsap.to(element, {
            y: -50 * (index + 1),
            scrollTrigger: {
                trigger: '.hero-section',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            }
        });
    });
}

function animateSections() {
    // Fade in nas seções
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const elements = section.querySelectorAll('[data-scroll]');
        
        elements.forEach(element => {
            gsap.fromTo(element,
                {
                    y: 30,
                    opacity: 0
                },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: element,
                        start: 'top 85%',
                        end: 'bottom 15%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );
        });
    });
}

// ===========================
// FORMULÁRIO DE CONTATO
// ===========================

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    handleSubmit() {
        const submitBtn = this.form.querySelector('.btn-submit');
        const btnText = submitBtn.querySelector('.btn-text');
        const btnLoading = submitBtn.querySelector('.btn-loading');
        
        // Estado de loading
        submitBtn.classList.add('loading');
        btnText.style.opacity = '0';
        btnLoading.style.display = 'block';
        
        // Simular envio (aqui você integraria com seu backend)
        setTimeout(() => {
            // Remover loading
            submitBtn.classList.remove('loading');
            btnText.style.opacity = '1';
            btnLoading.style.display = 'none';
            
            // Mostrar mensagem de sucesso
            this.showSuccessMessage();
            
            // Resetar formulário
            this.form.reset();
        }, 2000);
    }

    showSuccessMessage() {
        const alert = document.createElement('div');
        alert.className = 'alert alert-success alert-dismissible fade show';
        alert.innerHTML = `
            <strong>Obrigado!</strong> Em breve entraremos em contato para agendar seu diagnóstico.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        this.form.insertBefore(alert, this.form.firstChild);
        
        // Remover alerta após 5 segundos
        setTimeout(() => {
            alert.remove();
        }, 5000);
    }
}

// ===========================
// BACK TO TOP
// ===========================

class BackToTop {
    constructor() {
        this.button = document.getElementById('backToTop');
        if (this.button) {
            this.init();
        }
    }

    init() {
        // Mostrar/esconder botão
        if (scroll) {
            scroll.on('scroll', (args) => {
                if (args.scroll.y > 500) {
                    this.button.classList.add('visible');
                } else {
                    this.button.classList.remove('visible');
                }
            });
        } else {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 500) {
                    this.button.classList.add('visible');
                } else {
                    this.button.classList.remove('visible');
                }
            });
        }

        // Scroll para o topo ao clicar
        this.button.addEventListener('click', () => {
            if (scroll) {
                scroll.scrollTo(0);
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    }
}

// ===========================
// CHATBOT INTELIGENTE
// ===========================

class PsiGameChatbot {
    constructor() {
        this.button = document.getElementById('chatbotButton');
        this.window = document.getElementById('chatbotWindow');
        this.closeBtn = document.getElementById('chatbotClose');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('chatSend');
        this.messagesContainer = document.getElementById('chatbotMessages');
        
        this.isOpen = false;
        this.knowledge = this.initializeKnowledge();
        
        if (this.button) {
            this.init();
        }
    }

    init() {
        // Abrir/fechar chatbot
        this.button.addEventListener('click', () => this.toggle());
        this.closeBtn.addEventListener('click', () => this.close());
        
        // Enviar mensagem
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
        
        // Remover badge após abrir
        this.button.addEventListener('click', () => {
            const badge = this.button.querySelector('.chatbot-badge');
            if (badge) {
                badge.style.display = 'none';
            }
        });
    }

    toggle() {
        this.isOpen = !this.isOpen;
        if (this.isOpen) {
            this.window.classList.add('active');
            this.input.focus();
        } else {
            this.window.classList.remove('active');
        }
    }

    close() {
        this.isOpen = false;
        this.window.classList.remove('active');
    }

    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;
        
        // Adicionar mensagem do usuário
        this.addMessage(message, 'user');
        
        // Limpar input
        this.input.value = '';
        
        // Processar resposta
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response, 'bot');
        }, 1000);
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        
        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    generateResponse(message) {
        const lowerMessage = message.toLowerCase();
        
        // Respostas específicas baseadas em palavras-chave
        if (lowerMessage.includes('preço') || lowerMessage.includes('valor') || lowerMessage.includes('quanto custa')) {
            return 'Os valores do PsiGame são personalizados conforme o tamanho da equipe e duração do programa. Oferecemos desde sprints de 4 semanas até jornadas completas de 12 semanas. Para receber uma proposta personalizada, clique em "Agendar diagnóstico" ou fale conosco pelo WhatsApp: (98) 98136-8232.';
        }
        
        if (lowerMessage.includes('como funciona') || lowerMessage.includes('metodologia')) {
            return 'O PsiGame funciona em 3 etapas: 1) Diagnóstico inicial para entender sua realidade, 2) Jornada personalizada com encontros, cartas e desafios semanais, 3) Medição de resultados com relatório executivo. Tudo é adaptado à cultura da sua empresa!';
        }
        
        if (lowerMessage.includes('online') || lowerMessage.includes('remoto') || lowerMessage.includes('presencial')) {
            return 'O PsiGame funciona em todos os formatos: presencial, online ou híbrido! Adaptamos a metodologia para sua realidade, garantindo a mesma qualidade e engajamento independente do formato escolhido.';
        }
        
        if (lowerMessage.includes('resultado') || lowerMessage.includes('benefício') || lowerMessage.includes('impacto')) {
            return 'Com o PsiGame você verá melhorias em: clima organizacional, comunicação entre equipes, redução de conflitos, desenvolvimento de soft skills, e aumento do bem-estar emocional. Fornecemos métricas claras antes e depois!';
        }
        
        if (lowerMessage.includes('duração') || lowerMessage.includes('tempo') || lowerMessage.includes('quanto tempo')) {
            return 'Temos diferentes formatos: Sprint de 4 semanas para resultados rápidos, Jornada de Liderança de 8-12 semanas para desenvolvimento profundo, ou Imersão de 1 dia para eventos especiais. Qual se encaixa melhor na sua necessidade?';
        }
        
        if (lowerMessage.includes('licenciamento') || lowerMessage.includes('facilitador') || lowerMessage.includes('certificação')) {
            return 'Sim! Oferecemos formação e licenciamento para profissionais que querem aplicar a metodologia PsiGame. Você recebe certificação, materiais, acesso à marca e suporte contínuo. Quer saber mais sobre como se tornar um facilitador?';
        }
        
        if (lowerMessage.includes('empresa') || lowerMessage.includes('cliente') || lowerMessage.includes('case')) {
            return 'O PsiGame já transformou equipes em empresas de diversos setores, além de instituições públicas de saúde e educação. Cada jornada é única e personalizada. Posso agendar uma conversa para entender melhor suas necessidades?';
        }
        
        if (lowerMessage.includes('terapia') || lowerMessage.includes('psicológico') || lowerMessage.includes('tratamento')) {
            return 'O PsiGame NÃO é terapia. É uma experiência de educação socioemocional segura para ambientes corporativos. Usamos elementos lúdicos e práticas integrativas para desenvolver soft skills e promover bem-estar no trabalho.';
        }
        
        if (lowerMessage.includes('equipe') || lowerMessage.includes('grupo') || lowerMessage.includes('pessoas')) {
            return 'Recomendamos grupos de 12 a 25 pessoas para melhor aproveitamento, mas podemos adaptar para sua realidade. Para empresas maiores, fazemos múltiplas turmas ou programas em cascata. Quantas pessoas você tem em mente?';
        }
        
        if (lowerMessage.includes('agendar') || lowerMessage.includes('contato') || lowerMessage.includes('falar')) {
            return 'Ótimo! Você pode: 1) Preencher o formulário nesta página para um diagnóstico gratuito, 2) Nos chamar no WhatsApp (98) 98136-8232, ou 3) Enviar um email para venisia@gmail.com. Como prefere?';
        }
        
        if (lowerMessage.includes('oi') || lowerMessage.includes('olá') || lowerMessage.includes('bom dia') || lowerMessage.includes('boa tarde') || lowerMessage.includes('boa noite')) {
            return 'Olá! Que bom ter você aqui! 😊 Eu sou o assistente virtual da PsiGame. Posso te ajudar a entender como transformamos o bem-estar emocional nas empresas. O que gostaria de saber?';
        }
        
        if (lowerMessage.includes('obrigad') || lowerMessage.includes('valeu') || lowerMessage.includes('gratidão')) {
            return 'Por nada! Foi um prazer ajudar! Se tiver mais dúvidas ou quiser agendar um diagnóstico gratuito, estarei aqui. Lembre-se: cuidar das emoções no trabalho é investir em resultados! 💜';
        }
        
        // Resposta padrão para perguntas não mapeadas
        return 'Interessante sua pergunta! O PsiGame é uma solução completa para desenvolver soft skills e bem-estar emocional no trabalho. Posso te contar sobre nossos formatos (sprint, jornada, imersão), resultados mensuráveis, ou agendar um diagnóstico gratuito. O que te interessa mais?';
    }

    initializeKnowledge() {
        return {
            empresa: 'PsiGame',
            slogan: 'Jogo sério sobre emoções no trabalho',
            missao: 'Transformar o bem-estar emocional nas organizações através de jornadas lúdicas e mensuráveis',
            contatos: {
                email: 'venisia@gmail.com',
                whatsapp: '(98) 98136-8232',
                localizacao: 'São Luís, Maranhão'
            },
            formatos: [
                'Sprint Emocional (4 semanas)',
                'Jornada de Liderança Humanizada (8-12 semanas)',
                'Imersão Lúdica (1 dia)',
                'Assinatura Corporativa (mensal)',
                'Formação & Licenciamento'
            ],
            diferenciais: [
                'Metodologia lúdica e gamificada',
                'Resultados mensuráveis',
                'Personalização para cada cultura',
                'Presencial, online ou híbrido',
                'Relatórios executivos com métricas'
            ]
        };
    }
}

// ===========================
// FAQ ACCORDION
// ===========================

class FAQAccordion {
    constructor() {
        this.questions = document.querySelectorAll('.faq-question');
        if (this.questions.length > 0) {
            this.init();
        }
    }

    init() {
        // Bootstrap já cuida do accordion, mas podemos adicionar animações extras
        this.questions.forEach(question => {
            question.addEventListener('click', () => {
                const icon = question.querySelector('i');
                if (icon) {
                    // Animação do ícone já é controlada pelo CSS
                }
            });
        });
    }
}

// ===========================
// INTERSECTION OBSERVER
// ===========================

function initIntersectionObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -10% 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                
                // Não observar novamente
                if (entry.target.dataset.observeOnce !== 'false') {
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observar elementos
    const observeElements = document.querySelectorAll('[data-observe]');
    observeElements.forEach(el => observer.observe(el));
}

// ===========================
// UTILS
// ===========================

function debounce(func, wait = 20) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ===========================
// INICIALIZAÇÃO
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Preloader
    new Preloader();
    
    // Inicializar Smooth Scroll
    initSmoothScroll();
    
    // Inicializar componentes
    new Navigation();
    new ContactForm();
    new BackToTop();
    new PsiGameChatbot();
    new FAQAccordion();
    
    // Inicializar observers
    initIntersectionObserver();
    
    // Handle resize
    let resizeTimer;
    window.addEventListener('resize', debounce(() => {
        // Atualizar ScrollTrigger se existir
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
        
        // Atualizar Locomotive se existir
        if (scroll) {
            scroll.update();
        }
    }, 250));
});

// ===========================
// PERFORMANCE MONITORING
// ===========================

window.addEventListener('load', () => {
    // Log de performance (apenas em desenvolvimento)
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ PsiGame - Tempo de carregamento: ${pageLoadTime}ms`);
        
        // Verificar recursos carregados
        const resources = performance.getEntriesByType('resource');
        console.log(`📦 Total de recursos: ${resources.length}`);
    }
});

// ===========================
// ERROR HANDLING
// ===========================

window.addEventListener('error', (e) => {
    console.error('Erro no PsiGame:', e.message);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Promise rejeitada:', e.reason);
});