/* ==========================================
   Software Engineer Portfolio JavaScript
   Interactive Behavior & Night Mode Toggle
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------
    // 1. Night Mode Toggle Functionality
    // ------------------------------------------
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;

    // Check saved theme from localStorage, or auto-detect browser preference via prefers-color-scheme
    const systemPrefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('portfolio-theme') || (systemPrefersDark ? 'dark' : 'light');
    htmlElement.setAttribute('data-theme', savedTheme);

    // Listen for real-time system/browser theme changes
    if (window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('portfolio-theme')) {
                const newSystemTheme = e.matches ? 'dark' : 'light';
                htmlElement.setAttribute('data-theme', newSystemTheme);
            }
        });
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = htmlElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            htmlElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('portfolio-theme', newTheme);
        });
    }

    // ------------------------------------------
    // 2. Mobile Navigation Sidebar Drawer Toggle
    // ------------------------------------------
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const verticalNavbar = document.querySelector('.vertical-navbar');
    const mobileNavBackdrop = document.getElementById('mobile-nav-backdrop');
    const verticalNavLinks = document.querySelectorAll('.vertical-nav-link');

    function closeMobileMenu() {
        if (verticalNavbar) verticalNavbar.classList.remove('open');
        if (mobileNavBackdrop) mobileNavBackdrop.classList.remove('open');
        if (mobileMenuToggle) {
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        }
    }

    if (mobileMenuToggle && verticalNavbar) {
        mobileMenuToggle.addEventListener('click', () => {
            const isOpen = verticalNavbar.classList.toggle('open');
            if (mobileNavBackdrop) mobileNavBackdrop.classList.toggle('open', isOpen);
            const icon = mobileMenuToggle.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars', !isOpen);
                icon.classList.toggle('fa-xmark', isOpen);
            }
        });

        if (mobileNavBackdrop) {
            mobileNavBackdrop.addEventListener('click', closeMobileMenu);
        }

        // Close mobile drawer when clicking any link
        verticalNavLinks.forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // ------------------------------------------
    // 3. Project Filter Buttons
    // ------------------------------------------
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || filterValue === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    // ------------------------------------------
    // 4. Active Nav Highlight on Scroll
    // ------------------------------------------
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 140;
            const sectionId = current.getAttribute('id');
            const correspondingNavLink = document.querySelector(`.vertical-nav-link[href*="${sectionId}"]`);

            if (correspondingNavLink) {
                if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    verticalNavLinks.forEach(l => l.classList.remove('active'));
                    correspondingNavLink.classList.add('active');
                }
            }
        });
    });

    // ------------------------------------------
    // 5. AI Chat – Vandhana_AI Simulation
    //    (Simulates an AI assistant that answers
    //     questions about Sai Vandhana T.
    //     See API Integration Note below.)
    // ------------------------------------------

    const chatForm       = document.getElementById('chat-form');
    const chatInput      = document.getElementById('chat-input');
    const chatMessages   = document.getElementById('chat-messages');
    const typingIndicator= document.getElementById('typing-indicator');
    const chatClearBtn   = document.getElementById('chat-clear-btn');
    const chipButtons    = document.querySelectorAll('.chip');

    // ── Set welcome message timestamp ──────────────────────────────
    const welcomeTs = document.getElementById('welcome-timestamp');
    if (welcomeTs) welcomeTs.textContent = formatTime(new Date());

    // ── Helper: format a Date as HH:MM ────────────────────────────
    function formatTime(date) {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // ── Helper: scroll chat to bottom ─────────────────────────────
    function scrollToBottom() {
        if (chatMessages) chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // ── Append a message bubble to the chat ───────────────────────
    // role: 'user' | 'bot'
    function appendMessage(role, text) {
        const wrapper = document.createElement('div');
        wrapper.className = `chat-msg ${role === 'bot' ? 'bot-msg' : 'user-msg'}`;

        if (role === 'bot') {
            wrapper.innerHTML = `
                <div class="chat-avatar bot-avatar">
                    <i class="fa-solid fa-robot"></i>
                </div>
                <div class="chat-bubble">
                    <span class="chat-sender">&lt;Vandhana_AI&gt;</span>
                    <p class="chat-text">${text}</p>
                    <span class="chat-timestamp" aria-hidden="true">${formatTime(new Date())}</span>
                </div>`;
        } else {
            wrapper.innerHTML = `
                <div class="chat-bubble user-bubble">
                    <span class="chat-sender">&lt;You&gt;</span>
                    <p class="chat-text">${escapeHTML(text)}</p>
                    <span class="chat-timestamp" aria-hidden="true">${formatTime(new Date())}</span>
                </div>
                <div class="chat-avatar user-avatar">
                    <i class="fa-solid fa-user"></i>
                </div>`;
        }

        chatMessages.appendChild(wrapper);
        scrollToBottom();
    }

    // ── Sanitize user input to prevent XSS ────────────────────────
    function escapeHTML(str) {
        return str.replace(/&/g,'&amp;')
                  .replace(/</g,'&lt;')
                  .replace(/>/g,'&gt;')
                  .replace(/"/g,'&quot;');
    }

    // ── Show / hide the typing indicator ──────────────────────────
    function showTyping() {
        if (typingIndicator) {
            typingIndicator.style.display = 'flex';
            typingIndicator.setAttribute('aria-hidden', 'false');
            scrollToBottom();
        }
    }
    function hideTyping() {
        if (typingIndicator) {
            typingIndicator.style.display = 'none';
            typingIndicator.setAttribute('aria-hidden', 'true');
        }
    }

    // ─────────────────────────────────────────────────────────────
    // AI RESPONSE ENGINE
    // ─────────────────────────────────────────────────────────────
    // This is a keyword-based simulation of an AI assistant.
    //
    // ★ API INTEGRATION NOTE ★
    // To replace this with a real LLM, remove the `generateBotReply`
    // function below and call an API instead, e.g.:
    //
    //   async function generateBotReply(userText) {
    //     const res = await fetch('https://api.openai.com/v1/chat/completions', {
    //       method: 'POST',
    //       headers: {
    //         'Content-Type': 'application/json',
    //         'Authorization': `Bearer ${YOUR_API_KEY}`
    //       },
    //       body: JSON.stringify({
    //         model: 'gpt-4o',
    //         messages: [
    //           { role: 'system', content: SYSTEM_PROMPT },
    //           { role: 'user',   content: userText }
    //         ]
    //       })
    //     });
    //     const data = await res.json();
    //     return data.choices[0].message.content;
    //   }
    //
    // Replace YOUR_API_KEY with an env-var or a backend proxy to
    // avoid exposing keys in the browser.
    // ─────────────────────────────────────────────────────────────

    // Knowledge base about Sai Vandhana T
    const KB = {
        skills: [
            { keywords: ['python','py'],         reply: '🐍 Python is Vandhana\'s primary language – she uses it for ML pipelines, data analysis with Pandas & NumPy, and backend scripting.' },
            { keywords: ['ml','machine learning'],reply: '🤖 Machine Learning is her core specialisation – she\'s worked with Scikit-learn, PyTorch, and TensorFlow on real-world classification, regression and clustering tasks.' },
            { keywords: ['deep learning','dl','neural','nn'], reply: '🧠 She\'s experienced in Deep Learning: CNNs, RNNs, Transformers, and fine-tuning pre-trained models with PyTorch & TensorFlow.' },
            { keywords: ['nlp','natural language','text'],    reply: '📝 NLP is a key area for her – tokenisation, sentiment analysis, named entity recognition, and building RAG pipelines.' },
            { keywords: ['computer vision','cv','image'],     reply: '👁️ She uses OpenCV & YOLO-based models for object detection and image classification projects.' },
            { keywords: ['genai','generative','llm','gpt'],   reply: '✨ Generative AI is her latest passion – prompt engineering, LangChain, RAG architectures, and fine-tuning open-source LLMs.' },
            { keywords: ['sql','database','db'],              reply: '🗄️ She is proficient in SQL – writing complex queries, designing schemas, and working with relational databases.' },
            { keywords: ['git','github','version'],           reply: '🔀 She uses Git & GitHub daily for version control, branching strategies, and collaborative development.' },
            { keywords: ['fastapi','api','backend'],          reply: '⚡ She builds fast, production-ready APIs with FastAPI and deploys them with Docker / cloud services.' },
            { keywords: ['skill','stack','tech','tools','language','know','languages'], reply: '🛠️ Vandhana\'s core skills: <strong>Python · C++ · SQL · Machine Learning · Deep Learning · NLP · Computer Vision · Generative AI · PyTorch · TensorFlow · Scikit-learn · Pandas · NumPy · Git · GitHub · FastAPI</strong>.' },
        ],
        education: [
            { keywords: ['10th','tenth','school','cbse','chellammal'], reply: '🏫 She completed her 10<sup>th</sup> grade at <strong>Chellammal Vidyalaya CBSE, Trichy</strong> with an outstanding <strong>89%</strong>.' },
            { keywords: ['12th','twelfth','plus two','puc'],           reply: '📚 Her 12<sup>th</sup> grade was also from <strong>Chellammal Vidyalaya CBSE, Trichy</strong> where she scored <strong>80%</strong>.' },
            { keywords: ['college','university','degree','be','b.e','ai','adichunchagiri','2025','2029'], reply: '🎓 She\'s currently pursuing a <strong>B.E. in AI & ML</strong> at <strong>Adichunchagiri Institute of Technology</strong> (2025 – 2029).' },
            { keywords: ['education','study','academic','qualification','background'], reply: '🎓 Education journey: 10<sup>th</sup> (89%) → 12<sup>th</sup> (80%) at Chellammal Vidyalaya CBSE, Trichy → Currently pursuing <strong>B.E. AI & ML</strong> at Adichunchagiri Institute of Technology (2025–2029).' },
        ],
        projects: [
            { keywords: ['project','work','built','created','portfolio'], reply: '🚀 Check out the <strong>Projects</strong> section for Vandhana\'s featured AI & ML work! She\'s built projects in Computer Vision, NLP, and Generative AI.' },
        ],
        availability: [
            { keywords: ['hire','job','available','opportunity','intern','role','position','freelance'], reply: '💼 Sai Vandhana is currently a 2<sup>nd</sup>-year student (2025–2029) and is <strong>open to internships, research collaborations, and part-time AI/ML roles</strong>!' },
        ],
        contact: [
            { keywords: ['contact','reach','email','message','connect','social'], reply: '📬 You can contact Sai Vandhana via the <strong>Contact</strong> section below, or drop her an email directly – she\'d love to hear from you!' },
        ],
        greetings: [
            { keywords: ['hello','hi','hey','hola','greetings','good morning','good evening'], reply: '👋 Hello there! Great to meet you. How can I help you learn more about Sai Vandhana today?' },
        ],
        thanks: [
            { keywords: ['thank','thanks','thx','ty','appreciate'], reply: '😊 You\'re very welcome! Feel free to ask me anything else about Sai Vandhana.' },
        ],
        name: [
            { keywords: ['name','who are you','who is','vandhana','sai'], reply: '🤖 I\'m <strong>Vandhana_AI</strong> – a simulated AI assistant for <strong>Sai Vandhana T</strong>, an AI & ML Engineering student passionate about building intelligent systems.' },
        ],
    };

    const fallbackReplies = [
        '🤔 Hmm, I\'m not sure about that. Try asking about Sai Vandhana\'s <strong>skills</strong>, <strong>education</strong>, <strong>projects</strong>, or <strong>availability</strong>!',
        '💡 I\'m still learning! You can ask me about her technical stack, her college, or how to contact her.',
        '🔍 I didn\'t quite catch that. Use one of the suggestion chips below or rephrase your question!',
    ];

    function generateBotReply(userText) {
        const lower = userText.toLowerCase();

        // Search all knowledge-base categories in priority order
        const allCategories = [
            ...KB.greetings, ...KB.thanks, ...KB.name,
            ...KB.skills, ...KB.education, ...KB.projects,
            ...KB.availability, ...KB.contact,
        ];

        for (const entry of allCategories) {
            if (entry.keywords.some(kw => lower.includes(kw))) {
                return entry.reply;
            }
        }

        // Fallback: random response
        return fallbackReplies[Math.floor(Math.random() * fallbackReplies.length)];
    }

    // ── Core send flow ─────────────────────────────────────────────
    function sendMessage(text) {
        text = text.trim();
        if (!text) return;

        // Append user bubble
        appendMessage('user', text);

        // Disable input while bot is "thinking"
        if (chatInput)    chatInput.disabled = true;
        const sendBtn = document.getElementById('chat-send-btn');
        if (sendBtn)  sendBtn.disabled = true;

        // Show typing indicator
        showTyping();

        // Simulate network/LLM latency (600–1200 ms)
        // ★ API INTEGRATION NOTE ★
        // Replace the setTimeout below with an async API call:
        //   const reply = await callOpenAI(text);
        //   hideTyping();
        //   appendMessage('bot', reply);
        const delay = 600 + Math.random() * 600;
        setTimeout(() => {
            hideTyping();
            const reply = generateBotReply(text);
            appendMessage('bot', reply);

            // Re-enable input
            if (chatInput)  { chatInput.disabled = false; chatInput.focus(); }
            if (sendBtn)    sendBtn.disabled = false;
        }, delay);
    }

    // ── Form submit (Enter key or Send button) ─────────────────────
    if (chatForm) {
        chatForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (chatInput) {
                sendMessage(chatInput.value);
                chatInput.value = '';
            }
        });
    }

    // ── Suggestion chip clicks ─────────────────────────────────────
    chipButtons.forEach(chip => {
        chip.addEventListener('click', () => {
            const question = chip.getAttribute('data-q');
            if (question) {
                if (chatInput) chatInput.value = '';
                sendMessage(question);
            }
        });
    });

    // ── Clear conversation button ──────────────────────────────────
    if (chatClearBtn && chatMessages) {
        chatClearBtn.addEventListener('click', () => {
            // Remove all messages except the welcome message
            const msgs = chatMessages.querySelectorAll('.chat-msg:not(#chat-welcome-msg)');
            msgs.forEach(m => m.remove());
            hideTyping();
            if (chatInput) { chatInput.value = ''; chatInput.focus(); }
        });
    }

    // ── Keep legacy global for any inline onsubmit references ─────
    window.sendTerminalChat = () => {
        if (chatInput) { sendMessage(chatInput.value); chatInput.value = ''; }
    };

    // ------------------------------------------
    // 6. Dynamic Footer Year
    // ------------------------------------------
    const currentYearSpan = document.getElementById('current-year');
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }

    // ------------------------------------------
    // 7. Contact Form – Validation & Submission
    // ------------------------------------------
    const contactForm      = document.getElementById('contact-form');
    const contactSubmitBtn = document.getElementById('contact-submit-btn');
    const successBanner    = document.getElementById('form-success-banner');
    const successEmail     = document.getElementById('success-email');

    // Helper: show an error under a field
    function showFieldError(id, msg) {
        const el = document.getElementById(id);
        if (el) { el.textContent = msg; el.style.display = 'block'; }
    }
    function clearFieldError(id) {
        const el = document.getElementById(id);
        if (el) { el.textContent = ''; el.style.display = 'none'; }
    }

    // Validate all fields; return true if valid
    function validateContactForm(name, email, subject, message) {
        let valid = true;
        ['err-name','err-email','err-subject','err-message'].forEach(clearFieldError);

        if (!name.trim())           { showFieldError('err-name',    'Please enter your full name.');          valid = false; }
        if (!email.trim())          { showFieldError('err-email',   'Please enter your email address.');      valid = false; }
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
                                    { showFieldError('err-email',   'Please enter a valid email address.');   valid = false; }
        if (!subject.trim())        { showFieldError('err-subject', 'Please enter a subject.');               valid = false; }
        if (!message.trim())        { showFieldError('err-message', 'Please write your message.');            valid = false; }
        else if (message.trim().length < 10)
                                    { showFieldError('err-message', 'Message must be at least 10 characters.'); valid = false; }
        return valid;
    }

    // Toggle submit button state
    function setSubmitting(isSubmitting) {
        if (!contactSubmitBtn) return;
        const btnText    = contactSubmitBtn.querySelector('.btn-text');
        const btnSpinner = contactSubmitBtn.querySelector('.btn-spinner');
        contactSubmitBtn.disabled = isSubmitting;
        if (btnText)    btnText.style.display    = isSubmitting ? 'none'         : 'flex';
        if (btnSpinner) btnSpinner.style.display = isSubmitting ? 'inline-flex'  : 'none';
    }

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name    = (document.getElementById('cf-name')?.value    || '').trim();
            const email   = (document.getElementById('cf-email')?.value   || '').trim();
            const subject = (document.getElementById('cf-subject')?.value || '').trim();
            const message = (document.getElementById('cf-message')?.value || '').trim();

            if (!validateContactForm(name, email, subject, message)) return;

            setSubmitting(true);

            // ═══════════════════════════════════════════════════════════
            // 📧 RESEND API INTEGRATION POINT
            // ═══════════════════════════════════════════════════════════
            // When ready to send real emails, replace the setTimeout
            // below with an API call like:
            //
            //   try {
            //     const res = await fetch('/api/send-email', {   // serverless proxy
            //       method: 'POST',
            //       headers: { 'Content-Type': 'application/json' },
            //       body: JSON.stringify({ name, email, subject, message })
            //     });
            //     if (!res.ok) throw new Error('Send failed');
            //     // show success …
            //   } catch (err) {
            //     showFieldError('err-message', 'Could not send message. Please try again.');
            //     setSubmitting(false);
            //   }
            //
            // Your serverless function (e.g. Vercel /api/send-email.js) calls:
            //   await resend.emails.send({
            //     from: 'Portfolio <contact@yourdomain.com>',
            //     to:   'saivandhanaxiib@gmail.com',
            //     subject: `[Portfolio] ${subject} – from ${name}`,
            //     html: `<b>${name}</b> (${email}) wrote:<br>${message}`
            //   });
            // ═══════════════════════════════════════════════════════════

            // Demo mode: simulate a 1.2-second network request
            await new Promise(resolve => setTimeout(resolve, 1200));

            setSubmitting(false);

            // Show success banner and hide the form
            if (successBanner) {
                if (successEmail) successEmail.textContent = email;
                successBanner.style.display = 'flex';
                // Smooth scroll to banner
                successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
            contactForm.style.display = 'none';
        });

        // Live-clear individual field errors as user types
        ['cf-name','cf-email','cf-subject','cf-message'].forEach((fieldId, i) => {
            const errIds = ['err-name','err-email','err-subject','err-message'];
            const field = document.getElementById(fieldId);
            if (field) field.addEventListener('input', () => clearFieldError(errIds[i]));
        });
    }
});

