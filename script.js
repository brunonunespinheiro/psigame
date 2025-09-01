/**
 * PsiGame - JavaScript Principal
 * Versão simplificada e otimizada
 */

// ===========================
// PRELOADER - REMOVIDO
// ===========================

// Remover qualquer referência ao preloader quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.style.display = 'none';
    }
});

// ===========================
// NAVEGAÇÃO
// ===========================

class Navigation {
    constructor() {
        this.navbar = document.getElementById('mainNav');
        this.init();
    }

    init() {
        // Efeito de scroll na navbar
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                this.navbar?.classList.add('scrolled');
            } else {
                this.navbar?.classList.remove('scrolled');
            }
        });

        // Smooth scroll para links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#') return;
                
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offset = 80; // altura da navbar
                    const targetPosition = target.offsetTop - offset;
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Fechar menu mobile se estiver aberto
                    const navCollapse = document.querySelector('.navbar-collapse.show');
                    if (navCollapse) {
                        const bsCollapse = bootstrap.Collapse.getInstance(navCollapse);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        }
                    }
                }
            });
        });
    }
}

// ===========================
// FORMULÁRIO DE CONTATO (WhatsApp)
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
            this.sendToWhatsApp();
        });
    }

    sendToWhatsApp() {
        // Coletar dados do formulário
        const formData = {
            nome: document.getElementById('name')?.value || '',
            empresa: document.getElementById('company')?.value || '',
            cargo: document.getElementById('role')?.value || '',
            email: document.getElementById('email')?.value || '',
            tamanho: document.getElementById('teamSize')?.value || '',
            objetivo: document.getElementById('objective')?.value || '',
            formato: document.getElementById('format')?.value || '',
            mensagem: document.getElementById('message')?.value || ''
        };

        // Montar mensagem para WhatsApp
        let message = `*🎮 NOVO CONTATO PSIGAME*\n\n`;
        message += `*Nome:* ${formData.nome}\n`;
        message += `*Empresa:* ${formData.empresa}\n`;
        message += `*Cargo:* ${formData.cargo}\n`;
        message += `*Email:* ${formData.email}\n`;
        message += `*Tamanho da equipe:* ${formData.tamanho}\n`;
        message += `*Objetivo:* ${formData.objetivo}\n`;
        message += `*Formato preferido:* ${formData.formato}\n`;
        if (formData.mensagem) {
            message += `*Mensagem:* ${formData.mensagem}\n`;
        }
        message += `\n_Enviado pelo site PsiGame_`;

        // Número do WhatsApp (formato internacional)
        const phoneNumber = '5598981368232';
        
        // Codificar mensagem para URL
        const encodedMessage = encodeURIComponent(message);
        
        // Abrir WhatsApp
        const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
        window.open(whatsappURL, '_blank');
        
        // Mostrar mensagem de sucesso
        this.showSuccessMessage();
        
        // Limpar formulário
        this.form.reset();
    }

    showSuccessMessage() {
        const alertDiv = document.createElement('div');
        alertDiv.className = 'alert alert-success alert-dismissible fade show';
        alertDiv.innerHTML = `
            <strong>✅ Formulário enviado!</strong> Você será redirecionado para o WhatsApp.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        this.form.insertBefore(alertDiv, this.form.firstChild);
        
        setTimeout(() => {
            alertDiv.remove();
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
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                this.button.classList.add('visible');
            } else {
                this.button.classList.remove('visible');
            }
        });

        // Voltar ao topo
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// ===========================
// CHATBOT PSIGAME
// ===========================

class PsiGameChatbot {
    constructor() {
        this.button = document.getElementById('chatbotButton');
        this.window = document.getElementById('chatbotWindow');
        this.closeBtn = document.getElementById('chatbotClose');
        this.input = document.getElementById('chatInput');
        this.sendBtn = document.getElementById('chatSend');
        this.messagesContainer = document.getElementById('chatbotMessages');
        this.suggestionsContainer = document.getElementById('chatSuggestions');
        
        if (this.button && this.window) {
            this.init();
        }
    }

    init() {
        // Abrir chatbot
        this.button.addEventListener('click', () => {
            this.window.classList.add('active');
            this.input?.focus();
            // Remover badge
            const badge = this.button.querySelector('.chatbot-badge');
            if (badge) badge.style.display = 'none';
        });

        // Fechar chatbot
        this.closeBtn?.addEventListener('click', () => {
            this.window.classList.remove('active');
        });

        // Enviar mensagem
        this.sendBtn?.addEventListener('click', () => this.sendMessage());
        this.input?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Botões de sugestão
        const suggestionBtns = document.querySelectorAll('.suggestion-btn');
        suggestionBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const question = btn.getAttribute('data-question');
                this.input.value = question;
                this.sendMessage();
            });
        });
    }

    sendMessage() {
        const message = this.input?.value.trim();
        if (!message) return;

        // Adicionar mensagem do usuário
        this.addMessage(message, 'user');
        
        // Limpar input
        this.input.value = '';
        
        // Esconder sugestões após primeira pergunta
        if (this.suggestionsContainer) {
            this.suggestionsContainer.classList.add('hidden');
        }
        
        // Gerar resposta após delay
        setTimeout(() => {
            const response = this.generateResponse(message);
            this.addMessage(response.text, 'bot');
            
            // Se a resposta tem sugestões de follow-up
            if (response.showSuggestions) {
                this.showFollowUpSuggestions();
            }
        }, 800);
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        messageDiv.innerHTML = `<p>${text}</p>`;
        
        this.messagesContainer?.appendChild(messageDiv);
        if (this.messagesContainer) {
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }
    }

    generateResponse(message) {
        const msg = message.toLowerCase();
        
        // Respostas específicas e detalhadas
        if (msg.includes('cust') || msg.includes('preç') || msg.includes('valor') || msg.includes('investimento')) {
            return {
                text: '💰 <b>Sobre valores:</b><br><br>O investimento no PsiGame varia conforme:<br>• Tamanho da equipe<br>• Duração do programa<br>• Modalidade (presencial/online)<br><br>Temos opções desde <b>R$ 2.500</b> (Sprint 4 semanas) até programas completos de <b>R$ 12.000</b> (Jornada 12 semanas).<br><br>📊 Oferecemos diagnóstico gratuito para criar uma proposta personalizada!<br><br>📞 Quer receber valores detalhados? <a href="#contato">Clique aqui</a>',
                showSuggestions: false
            };
        }

        if (msg.includes('funciona') || msg.includes('metodologia') || msg.includes('como é') || msg.includes('processo')) {
            return {
                text: '🎮 <b>Como funciona o PsiGame:</b><br><br><b>1. Diagnóstico (Gratuito)</b><br>Análise da cultura emocional da empresa através de questionários e entrevistas.<br><br><b>2. Jornada Personalizada</b><br>• Encontros semanais (1h30)<br>• Cartas com reflexões<br>• Microdesafios práticos<br>• Dinâmicas em grupo<br><br><b>3. Medição de Resultados</b><br>• Avaliação antes e depois<br>• Relatório executivo<br>• Métricas de evolução<br><br>Tudo adaptado à realidade da sua empresa! 🎯',
                showSuggestions: true
            };
        }

        if (msg.includes('online') || msg.includes('remot') || msg.includes('presencial') || msg.includes('híbrid')) {
            return {
                text: '💻 <b>Modalidades disponíveis:</b><br><br><b>✅ Presencial:</b> Experiência completa com dinâmicas físicas e conexão direta<br><br><b>✅ Online:</b> Via Zoom/Teams com ferramentas digitais interativas<br><br><b>✅ Híbrido:</b> Combina encontros presenciais e online<br><br>A metodologia é <b>100% adaptável</b> mantendo a mesma qualidade e engajamento!<br><br>📍 Atendemos todo o Brasil e países de língua portuguesa.',
                showSuggestions: false
            };
        }

        if (msg.includes('dura') || msg.includes('tempo') || msg.includes('prazo') || msg.includes('semana')) {
            return {
                text: '⏰ <b>Formatos e durações:</b><br><br>🚀 <b>Sprint Emocional</b><br>4 semanas | 4 encontros<br>Ideal para equipes piloto<br><br>🎯 <b>Jornada de Liderança</b><br>8-12 semanas | 8-12 encontros<br>Desenvolvimento profundo<br><br>⚡ <b>Imersão Lúdica</b><br>1 dia | 8 horas<br>Para eventos e kickoffs<br><br>♾️ <b>Assinatura Mensal</b><br>Contínuo | Encontros mensais<br>Acompanhamento permanente<br><br>Qual formato faz mais sentido para vocês?',
                showSuggestions: true
            };
        }

        if (msg.includes('resultado') || msg.includes('benefício') || msg.includes('impacto') || msg.includes('métrica')) {
            return {
                text: '📊 <b>Resultados comprovados:</b><br><br>✨ <b>Clima Organizacional</b><br>↑ 35% em índices de satisfação<br><br>💬 <b>Comunicação</b><br>↓ 60% em conflitos interpessoais<br><br>🤝 <b>Engajamento</b><br>↑ 40% em participação ativa<br><br>❤️ <b>Bem-estar</b><br>↑ 45% no NPS emocional<br><br>📈 <b>Produtividade</b><br>↑ 25% em indicadores de performance<br><br>Você recebe relatório executivo com todas as métricas!',
                showSuggestions: false
            };
        }

        if (msg.includes('licen') || msg.includes('facilita') || msg.includes('certifica') || msg.includes('formação')) {
            return {
                text: '🎓 <b>Programa de Licenciamento:</b><br><br><b>Para quem é:</b><br>• Psicólogos e terapeutas<br>• Consultores de RH<br>• Coaches e facilitadores<br><br><b>O que inclui:</b><br>✅ Formação completa (40h)<br>✅ Materiais e metodologia<br>✅ Uso da marca PsiGame<br>✅ Suporte contínuo<br>✅ Comunidade exclusiva<br>✅ Atualizações<br><br><b>Investimento:</b> R$ 4.800<br>Parcele em até 12x<br><br>📋 <a href="#formacao">Saiba mais sobre licenciamento</a>',
                showSuggestions: false
            };
        }

        if (msg.includes('terap') || msg.includes('psico') || msg.includes('clínic') || msg.includes('tratamento')) {
            return {
                text: '❓ <b>PsiGame NÃO é terapia!</b><br><br>É uma metodologia de <b>educação socioemocional</b> para ambientes corporativos.<br><br>✅ <b>O que fazemos:</b><br>• Desenvolvimento de soft skills<br>• Jogos e dinâmicas em grupo<br>• Práticas de bem-estar coletivo<br>• Educação emocional<br><br>❌ <b>O que NÃO fazemos:</b><br>• Atendimento individual clínico<br>• Diagnósticos psicológicos<br>• Tratamento de transtornos<br><br>É seguro, leve e profissional! 😊',
                showSuggestions: false
            };
        }

        if (msg.includes('empresa') || msg.includes('cliente') || msg.includes('case') || msg.includes('quem usa')) {
            return {
                text: '🏢 <b>Quem usa PsiGame:</b><br><br>• Empresas de tecnologia<br>• Indústrias e fábricas<br>• Hospitais e clínicas<br>• Escolas e universidades<br>• Órgãos públicos<br>• Startups<br><br><b>Casos de sucesso:</b><br>✅ Redução de 70% no turnover<br>✅ Aumento de 40% em satisfação<br>✅ Melhoria de 50% na comunicação<br><br>Atendemos desde equipes de 10 até 500+ pessoas!<br><br>Quer ver cases detalhados? Entre em contato!',
                showSuggestions: true
            };
        }

        if (msg.includes('equipe') || msg.includes('grupo') || msg.includes('quantas pessoas') || msg.includes('tamanho')) {
            return {
                text: '👥 <b>Tamanho dos grupos:</b><br><br><b>Ideal:</b> 12 a 25 pessoas<br>Para melhor interação e dinâmica<br><br><b>Mínimo:</b> 8 pessoas<br>Para viabilizar as atividades<br><br><b>Máximo:</b> 30 pessoas<br>Com facilitador auxiliar<br><br>🏢 <b>Empresas grandes:</b><br>Fazemos múltiplas turmas simultâneas ou em cascata<br><br>Quantas pessoas você tem em mente?',
                showSuggestions: false
            };
        }

        if (msg.includes('contato') || msg.includes('falar') || msg.includes('agendar') || msg.includes('diagnóstico')) {
            return {
                text: '📞 <b>Vamos conversar!</b><br><br>Escolha a melhor forma:<br><br>📝 <b><a href="#contato">Formulário</a></b><br>Resposta em até 24h<br><br>📱 <b><a href="https://wa.me/5598981368232">WhatsApp</a></b><br>(98) 98136-8232<br><br>📧 <b>E-mail</b><br>venisia@gmail.com<br><br>🎁 Lembre-se: o diagnóstico inicial é <b>GRATUITO!</b>',
                showSuggestions: false
            };
        }

        if (msg.includes('oi') || msg.includes('olá') || msg.includes('bom dia') || msg.includes('boa tarde') || msg.includes('boa noite') || msg.includes('tudo bem')) {
            return {
                text: 'Olá! Que bom ter você aqui! 😊<br><br>Sou o assistente virtual da PsiGame e posso te ajudar com:<br><br>• Informações sobre nossos programas<br>• Valores e formatos<br>• Resultados esperados<br>• Agendamento de diagnóstico gratuito<br><br>Use os botões acima ou digite sua pergunta!',
                showSuggestions: false
            };
        }

        if (msg.includes('obrigad') || msg.includes('valeu') || msg.includes('gratidão') || msg.includes('tchau')) {
            return {
                text: 'Foi um prazer ajudar! 💜<br><br>Lembre-se: cuidar das emoções no trabalho é investir em resultados sustentáveis.<br><br>Quando quiser dar o próximo passo, estarei aqui!<br><br>Até logo! 👋',
                showSuggestions: false
            };
        }

        // Resposta padrão mais inteligente
        return {
            text: 'Hmm, não entendi completamente sua pergunta... 🤔<br><br>Posso te ajudar com informações sobre:<br><br>• <b>Valores e investimento</b><br>• <b>Como funciona o programa</b><br>• <b>Formatos e durações</b><br>• <b>Resultados esperados</b><br>• <b>Licenciamento para facilitadores</b><br>• <b>Agendar diagnóstico gratuito</b><br><br>O que você gostaria de saber?',
            showSuggestions: true
        };
    }

    showFollowUpSuggestions() {
        // Criar novos botões de sugestão contextual
        setTimeout(() => {
            const followUp = document.createElement('div');
            followUp.className = 'chat-suggestions follow-up';
            followUp.innerHTML = `
                <button class="suggestion-btn" onclick="document.getElementById('chatInput').value='Quero agendar um diagnóstico'; document.getElementById('chatSend').click()">📞 Agendar diagnóstico</button>
                <button class="suggestion-btn" onclick="document.getElementById('chatInput').value='Qual o melhor formato para mim?'; document.getElementById('chatSend').click()">🎯 Melhor formato</button>
                <button class="suggestion-btn" onclick="document.getElementById('chatInput').value='Quais os valores?'; document.getElementById('chatSend').click()">💰 Ver valores</button>
            `;
            this.messagesContainer?.appendChild(followUp);
            this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
        }, 300);
    }
}

// ===========================
// ANIMAÇÕES SIMPLES
// ===========================

class SimpleAnimations {
    constructor() {
        this.init();
    }

    init() {
        // Animação de fade in ao scroll
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Aplicar observer aos elementos
        document.querySelectorAll('[data-scroll]').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
            observer.observe(el);
        });
    }
}

// ===========================
// FAQ
// ===========================

class FAQ {
    constructor() {
        this.init();
    }

    init() {
        // Bootstrap Collapse já cuida do accordion
        // Adicionar apenas animações extras se necessário
        const questions = document.querySelectorAll('.faq-question');
        questions.forEach(q => {
            q.addEventListener('click', function() {
                const icon = this.querySelector('i');
                if (icon) {
                    // Rotação do ícone controlada pelo CSS
                }
            });
        });
    }
}

// ===========================
// INICIALIZAÇÃO
// ===========================

document.addEventListener('DOMContentLoaded', () => {
    // Verificar se elementos existem antes de inicializar
    console.log('PsiGame: Iniciando aplicação...');
    
    // Inicializar componentes
    new Navigation();
    new ContactForm();
    new BackToTop();
    new PsiGameChatbot();
    new SimpleAnimations();
    new FAQ();
    
    console.log('PsiGame: Aplicação carregada com sucesso!');
});

// ===========================
// TRATAMENTO DE ERROS
// ===========================

window.addEventListener('error', (e) => {
    console.error('PsiGame - Erro:', e.message);
    // Não deixar erros quebrarem a aplicação
    return true;
});

// ===========================
// PERFORMANCE
// ===========================

window.addEventListener('load', () => {
    // Log de performance apenas em desenvolvimento
    if (window.location.hostname === 'localhost') {
        const loadTime = performance.now();
        console.log(`PsiGame: Página carregada em ${Math.round(loadTime)}ms`);
    }
});