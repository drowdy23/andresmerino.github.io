const fs = require('fs');

const files = [
    'project-personal.html',
    'project-kayara.html',
    'project-dads-house.html',
    'project-avatar.html'
];

const css = `
        /* ── SOPHISTICATED CONTACT BADGE ── */
        .side-contact {
            position: fixed;
            right: 0;
            top: 50%;
            transform: translateY(-50%);
            z-index: 9999;
            opacity: 0;
            pointer-events: none;
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .side-contact.visible {
            opacity: 1;
            pointer-events: all;
            transform: translateY(-50%) translateX(-1rem);
        }

        .side-btn {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: rgba(12, 12, 12, 0.8);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            color: #fff;
            padding: 1.5rem 1rem 2.2rem;
            text-decoration: none;
            border-radius: 100px;
            border: 1px solid rgba(255, 255, 255, 0.1);
            box-shadow: 0 15px 45px rgba(0,0,0,0.6);
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .mail-circle {
            width: 42px;
            height: 42px;
            background: #fff;
            color: #000;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 1.5rem;
            box-shadow: 0 0 20px rgba(255,255,255,0.3);
            transition: transform 0.4s ease, background 0.4s ease;
        }

        .side-btn span {
            writing-mode: vertical-rl;
            transform: rotate(180deg);
            font-family: 'Inter', sans-serif;
            font-size: 0.65rem;
            font-weight: 500;
            letter-spacing: 0.35em;
            text-transform: uppercase;
            white-space: nowrap;
            opacity: 0.7;
            transition: opacity 0.4s ease;
        }

        .side-btn:hover {
            background: #fff;
            color: #000;
            border-color: #fff;
            transform: translateY(-8px);
        }

        .side-btn:hover .mail-circle {
            background: #000;
            color: #fff;
            transform: scale(1.1);
        }

        .side-btn:hover span {
            opacity: 1;
        }

        @media (max-width: 900px) {
            .side-contact { display: none; }
        }
`;

const html = `
<!-- Contact Beacon -->
<div class="side-contact" id="side-contact">
    <a href="mailto:andresgonzalezmerino@gmail.com" class="side-btn">
        <div class="mail-circle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
        </div>
        <span>Get in Touch</span>
    </a>
</div>
`;

const js = `
    const sideContact = document.getElementById('side-contact');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 200) {
            sideContact.classList.add('visible');
        } else {
            sideContact.classList.remove('visible');
        }
    });
`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Safety cleanup of all previous contact code variants
    content = content.replace(/\/\* ── FLOATING CONTACT ── \*\/[\s\S]*?\/\* ── FOOTER ── \*\//, '/* ── FOOTER ── */');
    content = content.replace(/\/\* ── SOPHISTICATED CONTACT BEACON ── \*\/[\s\S]*?\/\* ── FOOTER ── \*\//, '/* ── FOOTER ── */');
    content = content.replace(/\/\* ── HIGH VISIBILITY CONTACT BEACON ── \*\/[\s\S]*?\/\* ── FOOTER ── \*\//, '/* ── FOOTER ── */');
    content = content.replace(/\/\* ── VERTICAL SIDE CONTACT ── \*\/[\s\S]*?\/\* ── FOOTER ── \*\//, '/* ── FOOTER ── */');
    content = content.replace(/\/\* ── SOPHISTICATED CONTACT BADGE ── \*\/[\s\S]*?\/\* ── FOOTER ── \*\//, '/* ── FOOTER ── */');
    
    content = content.replace(/<!-- Floating Contact -->[\s\S]*?<\/div>/, '');
    content = content.replace(/<!-- Side Contact Anchor -->[\s\S]*?<\/div>/, '');
    content = content.replace(/<!-- Contact Beacon -->[\s\S]*?<\/div>/, '');

    content = content.replace(/const floatContact[\s\S]*?\}\);/g, '');
    content = content.replace(/const sideContact[\s\S]*?\}\);/g, '');

    // Pure injection
    content = content.replace('</style>', css + '</style>');
    content = content.replace('</body>', html + '</body>');
    content = content.replace('</script>', js + '</script>');
    
    fs.writeFileSync(file, content);
});

console.log('Final Contact Badge applied to all pages.');