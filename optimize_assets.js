const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = 'C:\\Users\\User\\.openclaw\\workspace\\andresmerino.com';
const assetsDir = path.join(rootDir, 'assets', 'img', 'projects');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach( f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
    });
}

const htmlFiles = [
    path.join(rootDir, 'index.html'),
    path.join(rootDir, 'project-personal.html'),
    path.join(rootDir, 'project-kayara.html'),
    path.join(rootDir, 'project-tales.html'),
    path.join(rootDir, 'project-avatar.html'),
    path.join(rootDir, 'project-dads-house.html'),
    path.join(rootDir, 'nda-portfolio.html')
];

function updateHtmlRefs(oldRelPath, newRelPath) {
    htmlFiles.forEach(htmlPath => {
        if (!fs.existsSync(htmlPath)) return;
        let content = fs.readFileSync(htmlPath, 'utf8');
        // Simple global replace for the relative path
        const updated = content.split(oldRelPath).join(newRelPath);
        if (content !== updated) {
            fs.writeFileSync(htmlPath, updated);
            console.log(`  [HTML] Updated refs in ${path.basename(htmlPath)}: ${oldRelPath} -> ${newRelPath}`);
        }
    });
}

console.log('Starting Asset Optimization (High Fidelity)...');

walk(assetsDir, (filePath) => {
    const ext = path.extname(filePath).toLowerCase();
    const dirname = path.dirname(filePath);
    const basename = path.basename(filePath, ext);
    const relPath = path.relative(rootDir, filePath).replace(/\\/g, '/');

    // 1. OPTIMIZE IMAGES (PNG/JPG -> WEBP 90% Quality)
    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
        const targetPath = path.join(dirname, basename + '.webp');
        const targetRelPath = path.relative(rootDir, targetPath).replace(/\\/g, '/');
        
        console.log(`Optimizing Image: ${basename}${ext}`);
        try {
            // Quality 90 is visually lossless for backgrounds
            execSync(`ffmpeg -i "${filePath}" -q:v 90 "${targetPath}" -y`, { stdio: 'ignore' });
            
            // Update HTML references
            updateHtmlRefs(relPath, targetRelPath);
            
            // Delete original to save space
            fs.unlinkSync(filePath);
        } catch (e) {
            console.error(`  Error optimizing ${basename}: ${e.message}`);
        }
    }

    // 2. OPTIMIZE VIDEOS (MOV/MP4 -> MP4 H.264 Web Optimized)
    if (ext === '.mov' || (ext === '.mp4' && filePath.includes('Recording'))) {
        const targetPath = path.join(dirname, basename + '_opt.mp4');
        const targetRelPath = path.relative(rootDir, targetPath).replace(/\\/g, '/');

        console.log(`Optimizing Video: ${basename}${ext}`);
        try {
            // crf 20 is high quality, faststart for web streaming
            execSync(`ffmpeg -i "${filePath}" -vcodec libx264 -crf 20 -pix_fmt yuv420p -movflags +faststart -an "${targetPath}" -y`, { stdio: 'ignore' });
            
            // Update HTML references
            updateHtmlRefs(relPath, targetRelPath);
            
            // Delete original
            fs.unlinkSync(filePath);
        } catch (e) {
            console.error(`  Error optimizing video ${basename}: ${e.message}`);
        }
    }
});

console.log('Asset Optimization Complete.');
