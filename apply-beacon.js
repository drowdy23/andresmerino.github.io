const fs = require('fs');

const files = [
    'project-tales.html',
    'project-personal.html',
    'project-kayara.html',
    'project-dads-house.html',
    'project-avatar.html'
];

const css = `
        /* ── HIGH VISIBILITY CONTACT BEACON ── */
        .side-contact {
            position: fixed;
            right: 0;
            top: 50%;
            transform: translateY(-50%) translateX(100%);
            z-index: 9999;
            opacity: 0;
            transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
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
            justify-content: center;
            text-decoration: none;
            background: #fff; /* High contrast */
            color: #000;      /* High contrast */
            padding: 2.5rem 1rem;
            transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
            border-radius: 4px 0 0 4px;
            box-shadow: -10px 0 30px rgba(0,0,0,0.5);
        }

        .side-btn span {
            font-family: 'Inter', sans-serif;
            font-size: 0.8rem;
            font-weight: 700;
            letter-spacing: 0.2em;
            text-transform: uppercase;
            writing-mode: vertical-rl;
            transform: rotate(180deg);
        }

        .side-btn:hover {
            padding-right: 2rem;
            padding-left: 1.5rem;
            background: #e5e5e5;
        }
`;

const html = `
<!-- Contact Beacon -->
<div class="side-contact" id="side-contact">
    <a href="mailto:andresgonzalezmerino@gmail.com" class="side-btn">
        <span>Get in Touch</span>
    </a>
</div>
`;

const js = `
    const sideContact = document.getElementById('side-contact');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            sideContact.classList.add('visible');
        } else {
            sideContact.classList.remove('visible');
        }
    });
`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Cleanup prior attempts
    content = content.replace(/\/\* ── VERTICAL SIDE CONTACT ── \*\/[\s\S]*?\/\* ── FOOTER ── \*\//, '/* ── FOOTER ── */');
    content = content.replace(/\/\* ── HIGH VISIBILITY CONTACT BEACON ── \*\/[\s\S]*?\/\* ── FOOTER ── \*\//, '/* ── FOOTER ── */');
    content = content.replace(/<!-- Side Contact Anchor -->[\s\S]*?<\/div>/, '');
    content = content.replace(/<!-- Contact Beacon -->[\s\S]*?<\/div>/, '');
    
    // Inject new
    content = content.replace('</style>', css + '</style>');
    content = content.replace('</body>', html + '</body>');
    content = content.replace('</script>', js + '</script>');
    
    fs.writeFileSync(file, content);
});

console.log('High contrast contact beacon applied.');