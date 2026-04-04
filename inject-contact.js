const fs = require('fs');
const path = require('path');

const files = [
    'project-personal.html',
    'project-kayara.html',
    'project-dads-house.html',
    'project-avatar.html'
];

const cssToInject = `
        /* ── FLOATING CONTACT ── */
        .floating-contact {
            position: fixed;
            bottom: 2.5rem;
            right: 2.5rem;
            z-index: 500;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
        }
        .floating-contact.visible {
            opacity: 1;
            transform: translateY(0);
            pointer-events: all;
        }
        .float-btn {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            font-family: 'Inter', sans-serif;
            font-size: 0.55rem;
            font-weight: 500;
            letter-spacing: 0.15em;
            text-transform: uppercase;
            text-decoration: none;
            color: #fff;
            background: rgba(12,12,12,0.85);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border: 1px solid rgba(255,255,255,0.1);
            padding: 0.9rem 1.6rem;
            border-radius: 4px;
            transition: all 0.4s ease;
        }
        .float-btn:hover {
            background: #fff;
            color: #000;
            border-color: #fff;
        }
`;

const htmlToInject = `
<!-- Floating Contact -->
<div class="floating-contact" id="floating-contact">
    <a href="mailto:andresgonzalezmerino@gmail.com" class="float-btn">
        Contact
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
    </a>
</div>
`;

const jsToInject = `
    const floatContact = document.getElementById('floating-contact');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 400) {
            floatContact.classList.add('visible');
        } else {
            floatContact.classList.remove('visible');
        }
    });
`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Inject CSS
    content = content.replace('</style>', cssToInject + '</style>');
    
    // Inject HTML (before body ends)
    content = content.replace('</body>', htmlToInject + '</body>');
    
    // Inject JS (at end of script block)
    content = content.replace('</script>', jsToInject + '</script>');
    
    fs.writeFileSync(file, content);
});

console.log('Floating contact injected to all pages.');