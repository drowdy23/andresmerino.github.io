const fs = require('fs');
const path = require('path');

const sourceDir = path.join(process.cwd(), 'assets/img/projects');
const targetDir = path.join(process.cwd(), 'assets/img/categorized');

const dirs = [
    'Background work/Background Paint',
    'Background work/Layout-Line',
    'Color Key',
    'Concept Art',
    'Illustration'
];

dirs.forEach(d => fs.mkdirSync(path.join(targetDir, d), { recursive: true }));

function walk(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if(!file.endsWith('.html') && !file.endsWith('.css') && !file.endsWith('.js')) {
                results.push(file);
            }
        }
    });
    return results;
}

const allFiles = walk(sourceDir);
let counters = { 'Tales': 1, 'Sirah': 1, 'Kayara': 1, 'DadsHouse': 1, 'Avatar': 1, 'Personal': 1 };

const pencilSketches = ['211217089', '211242668', '211308198', '211332508', '211456536'];

allFiles.forEach(file => {
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const normPath = file.replace(/\\/g, '/');
    
    if (name.toLowerCase() === 'cover' || name.toLowerCase() === 'logo') return;

    let proj = 'Unknown';
    if (normPath.includes('/Tales From Outer suburbia/')) proj = 'Tales';
    else if (normPath.includes('/Sirah/')) proj = 'Sirah';
    else if (normPath.includes('/Kayara/')) proj = 'Kayara';
    else if (normPath.includes('/Dads House/')) proj = 'DadsHouse';
    else if (normPath.includes('/Avatar the last airbender/')) proj = 'Avatar';
    else if (normPath.includes('/Personal Work/')) proj = 'Personal';

    if (proj === 'Unknown') return;

    let cats = [];
    let labels = [];

    if (proj === 'Kayara') {
        cats.push('Color Key');
        labels.push('ColorKey');
    } else if (proj === 'DadsHouse') {
        if (normPath.includes('/Color/')) {
            cats.push('Background work/Background Paint');
            labels.push('BackgroundPaint');
        } else {
            cats.push('Background work/Layout-Line');
            labels.push('LayoutLine');
        }
    } else if (proj === 'Tales') {
        cats.push('Background work/Background Paint');
        labels.push('BackgroundPaint');
        cats.push('Illustration');
        labels.push('Illustration');
    } else if (proj === 'Sirah') {
        cats.push('Concept Art');
        labels.push('ConceptArt');
    } else if (proj === 'Avatar') {
        cats.push('Background work/Background Paint');
        labels.push('BackgroundPaint');
        if (name.includes('TREE WORK') || name.includes('DETAIL')) {
            cats.push('Concept Art');
            labels.push('ConceptArt');
        }
    } else if (proj === 'Personal') {
        if (normPath.includes('/Illustration/')) {
            cats.push('Illustration');
            labels.push('Illustration');
            if (name.toLowerCase().includes('plein') || name.toLowerCase().includes('bosk')) {
                cats.push('Background work/Background Paint');
                labels.push('BackgroundPaint');
            }
        } else if (normPath.includes('/Other/')) {
            let isPencil = pencilSketches.some(p => name.includes(p));
            if (isPencil) {
                cats.push('Background work/Layout-Line');
                labels.push('LayoutLine');
                cats.push('Concept Art');
                labels.push('ConceptArt');
            } else {
                cats.push('Concept Art');
                labels.push('ConceptArt');
                cats.push('Illustration');
                labels.push('Illustration');
            }
        }
    }

    if (cats.length === 0) return;

    const num = String(counters[proj]++).padStart(3, '0');
    const finalLabel = [...new Set(labels)].join('-');
    const newName = `${proj}_${num}_${finalLabel}${ext}`;

    cats.forEach(c => {
        const dest = path.join(targetDir, c, newName);
        fs.copyFileSync(file, dest);
    });
});

console.log('Classification complete.');