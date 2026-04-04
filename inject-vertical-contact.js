const fs = require('fs');

const files = [
    'project-tales.html',
    'project-personal.html',
    'project-kayara.html',
    'project-dads-house.html',
    'project-avatar.html'
];

const css = `
        /* ── VERTICAL SIDE CONTACT ── */
        .side-contact {
            position: fixed;
            right: 0;
            top: 50%;
            transform: translateY(-50%) translateX(100%);
            z-index: 9999;
            opacity: 0;
            transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
            pointer-events: none;
        }

        .side-contact.visible {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
            pointer-events: all;
        }

        .side-btn {
            display: flex;
            align-items: center;
            gap: 1.5rem;
            text-decoration: none;
            color: #666;
            padding: 2rem 1rem;
            transition: all 0.4s ease;
        }

        .side-btn span {
            font-family: 'Space Mono', monospace;
            font-size: 0.6rem;
            letter-spacing: 0.4em;
            text-transform: uppercase;
            writing-mode: vertical-rl;
            transform: rotate(180deg);
            transition: color 0.4s ease, transform 0.4s ease;
        }

        .side-line {
            width: 1px;
            height: 60px;
            background: rgba(255,255,255,0.1);
            transition: height 0.4s ease, background 0.4s ease;
        }

        .side-btn:hover {
            color: #fff;
            transform: translateX(-10px);
        }

        .side-btn:hover .side-line {
            height: 100px;
            background: #fff;
        }
`;

const html = `
<!-- Side Contact Anchor -->
<div class="side-contact" id="side-contact">
    <a href="mailto:andresgonzalezmerino@gmail.com" class="side-btn">
        <div class="side-line"></div>
        <span>Contact</span>
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
    
    // Clean up any old floating contact stuff first if it exists
    content = content.replace(/\/\* ── FLOATING CONTACT ── \*\/[\s\S]*?\/\* ── FOOTER ── \*\//, '/* ── FOOTER ── */');
    content = content.replace(/<!-- Floating Contact -->[\s\S]*?<\/div>/, '');
    content = content.replace(/const floatContact[\s\S]*?\}\);/, '');

    // Inject new CSS
    content = content.replace('</style>', css + '</style>');
    // Inject new HTML
    content = content.replace('</body>', html + '</body>');
    // Inject new JS
    content = content.replace('</script>', js + '</script>');
    
    fs.writeFileSync(file, content);
});

console.log('Vertical side contact injected.');