# Image Optimization Guide - Zititex

## 🚨 Current Issues

The current website has **critical performance issues** with image sizes:

| Image | Current Size | Target Size | Issue |
|-------|-------------|-------------|-------|
| `hero-1.jpg` | **4.4 MB** | < 200 KB | 🔴 TOO LARGE |
| `hero-2.jpg` | **4.3 MB** | < 200 KB | 🔴 TOO LARGE |
| `hero-3.jpg` | **3.8 MB** | < 200 KB | 🔴 TOO LARGE |
| `sintetico.png` | **2.7 MB** | < 100 KB | 🔴 TOO LARGE |
| `etiqueta.png` | **2.4 MB** | < 100 KB | 🔴 TOO LARGE |

**Impact**:
- Slow page load (15+ seconds on 3G)
- Poor Lighthouse performance score
- High bounce rate
- Wasted bandwidth
- Poor SEO rankings

---

## 📊 Optimization Targets

| Image Type | Max Size | Format | Dimensions |
|------------|----------|--------|------------|
| Hero Images | 200 KB | WebP/JPEG | 1920x1080 |
| Product Images | 100 KB | WebP/JPEG | 800x800 |
| Logo | 50 KB | PNG/SVG | 400x400 |
| Icons | 10 KB | SVG/PNG | 64x64 |

---

## 🛠️ Optimization Methods

### Method 1: Online Tools (Easiest)

#### TinyPNG / TinyJPG
**Best for**: Quick optimization without installing anything

1. Visit: https://tinypng.com/
2. Upload your images (max 5 MB)
3. Download optimized versions
4. Replace original files

**Expected Results**:
- 60-80% size reduction
- Minimal quality loss
- Supports PNG and JPEG

#### Squoosh
**Best for**: Advanced control, WebP conversion

1. Visit: https://squoosh.app/
2. Upload image
3. Select format (WebP recommended)
4. Adjust quality (75-85% recommended)
5. Download

**Settings for Hero Images**:
```
Format: WebP
Quality: 80
Resize: 1920x1080
Effort: 4
```

**Settings for Product Images**:
```
Format: WebP
Quality: 85
Resize: 800x800
Effort: 4
```

### Method 2: Command Line Tools

#### ImageMagick (Recommended for Batch)

**Install**:
```bash
# macOS
brew install imagemagick

# Ubuntu/Debian
sudo apt-get install imagemagick

# Windows
# Download from: https://imagemagick.org/script/download.php
```

**Optimize Hero Images**:
```bash
# Navigate to hero directory
cd public/static/hero/

# Optimize all JPG images
for file in *.jpg; do
  convert "$file" \
    -resize 1920x1080 \
    -quality 85 \
    -strip \
    "${file%.jpg}-optimized.jpg"
done

# Convert to WebP
for file in *.jpg; do
  convert "$file" \
    -resize 1920x1080 \
    -quality 80 \
    -define webp:method=6 \
    "${file%.jpg}.webp"
done
```

**Optimize Product Images**:
```bash
# Navigate to products directory
cd public/static/products/

# Optimize all images recursively
find . -name "*.jpg" -o -name "*.jpeg" -o -name "*.png" | while read file; do
  # Get directory and filename
  dir=$(dirname "$file")
  filename=$(basename "$file")
  
  # Convert to WebP
  convert "$file" \
    -resize 800x800 \
    -quality 85 \
    -strip \
    "$dir/${filename%.*}.webp"
done
```

#### cwebp (Google's WebP Encoder)

**Install**:
```bash
# macOS
brew install webp

# Ubuntu/Debian
sudo apt-get install webp
```

**Usage**:
```bash
# Single image
cwebp -q 80 input.jpg -o output.webp

# Batch conversion
for file in *.jpg; do
  cwebp -q 80 "$file" -o "${file%.jpg}.webp"
done
```

### Method 3: Node.js Script (Automated)

Create `scripts/optimize-images.js`:

```javascript
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  hero: {
    input: 'public/static/hero',
    output: 'public/static/hero/optimized',
    width: 1920,
    height: 1080,
    quality: 80,
  },
  products: {
    input: 'public/static/products',
    output: 'public/static/products/optimized',
    width: 800,
    height: 800,
    quality: 85,
  }
};

async function optimizeImage(inputPath, outputPath, options) {
  try {
    await sharp(inputPath)
      .resize(options.width, options.height, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: options.quality, effort: 6 })
      .toFile(outputPath);
    
    const inputSize = fs.statSync(inputPath).size;
    const outputSize = fs.statSync(outputPath).size;
    const savings = ((1 - outputSize / inputSize) * 100).toFixed(1);
    
    console.log(`✅ ${path.basename(inputPath)}`);
    console.log(`   ${(inputSize / 1024 / 1024).toFixed(2)} MB → ${(outputSize / 1024).toFixed(0)} KB (-${savings}%)`);
  } catch (error) {
    console.error(`❌ Error processing ${inputPath}:`, error.message);
  }
}

async function optimizeDirectory(dir, outputDir, options) {
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const inputPath = path.join(dir, file);
    const stat = fs.statSync(inputPath);
    
    if (stat.isDirectory()) {
      continue;
    }
    
    if (/\.(jpg|jpeg|png)$/i.test(file)) {
      const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
      await optimizeImage(inputPath, outputPath, options);
    }
  }
}

async function main() {
  console.log('🖼️  Image Optimization Started\n');
  
  console.log('📸 Optimizing Hero Images...');
  await optimizeDirectory(config.hero.input, config.hero.output, config.hero);
  
  console.log('\n🏷️  Optimizing Product Images...');
  await optimizeDirectory(config.products.input, config.products.output, config.products);
  
  console.log('\n✅ Optimization Complete!');
}

main();
```

**Install Sharp**:
```bash
npm install --save-dev sharp
```

**Run**:
```bash
node scripts/optimize-images.js
```

---

## 📝 Step-by-Step Optimization Process

### For Hero Images (hero-1.jpg, hero-2.jpg, hero-3.jpg)

#### Option A: Squoosh (Easiest)

1. Go to https://squoosh.app/
2. Upload `hero-1.jpg`
3. Settings:
   - Format: **WebP**
   - Quality: **80**
   - Resize: **1920 x 1080**
   - Effort: **4**
4. Download as `hero-1.webp`
5. Repeat for other hero images
6. Replace original files or update code to use WebP

#### Option B: ImageMagick

```bash
cd public/static/hero/

# Optimize hero-1.jpg
convert hero-1.jpg \
  -resize 1920x1080 \
  -quality 80 \
  -sampling-factor 4:2:0 \
  -strip \
  -interlace Plane \
  hero-1.webp

# Repeat for others
convert hero-2.jpg -resize 1920x1080 -quality 80 -strip hero-2.webp
convert hero-3.jpg -resize 1920x1080 -quality 80 -strip hero-3.webp
```

**Expected Results**:
- hero-1.jpg: 4.4 MB → **~150 KB** (97% reduction)
- hero-2.jpg: 4.3 MB → **~145 KB** (97% reduction)
- hero-3.jpg: 3.8 MB → **~135 KB** (96% reduction)

### For Product Images

```bash
cd public/static/products/garra_pantalon/

# Optimize sintetico.png (2.7 MB)
convert sintetico.png \
  -resize 800x800 \
  -quality 85 \
  -strip \
  sintetico.webp

# Optimize etiqueta.png (2.4 MB)
cd ../etiquetas/
convert etiqueta.png \
  -resize 800x800 \
  -quality 85 \
  -strip \
  etiqueta.webp
```

---

## 🔄 Update Image References

After optimizing, update your code to use the optimized images:

### Option 1: Replace Original Files

```bash
# Backup originals
mv hero-1.jpg hero-1-original.jpg

# Rename optimized
mv hero-1.webp hero-1.jpg

# Or keep WebP extension and update code
```

### Option 2: Use `<picture>` Tag for Fallbacks

```tsx
<picture>
  <source srcSet="/static/hero/hero-1.webp" type="image/webp" />
  <source srcSet="/static/hero/hero-1.jpg" type="image/jpeg" />
  <img src="/static/hero/hero-1.jpg" alt="Hero" />
</picture>
```

### Option 3: Use OptimizedImage Component

```tsx
import { OptimizedImage } from '@/components/ui/OptimizedImage';

<OptimizedImage
  src="/static/hero/hero-1.webp"
  fallbackSrc="/static/hero/hero-1.jpg"
  alt="Hero Image"
  width={1920}
  height={1080}
  priority={true}
/>
```

---

## ⚡ Additional Performance Optimizations

### 1. Lazy Loading

For images below the fold:

```html
<img 
  src="/image.jpg" 
  alt="..." 
  loading="lazy" 
  decoding="async"
/>
```

### 2. Priority Hints

For critical images (hero, above-the-fold):

```html
<img 
  src="/image.jpg" 
  alt="..." 
  fetchpriority="high"
  loading="eager"
/>
```

### 3. Responsive Images

Use `srcset` for different screen sizes:

```html
<img 
  src="/image-800.jpg"
  srcset="
    /image-400.jpg 400w,
    /image-800.jpg 800w,
    /image-1200.jpg 1200w
  "
  sizes="(max-width: 768px) 100vw, 800px"
  alt="..."
/>
```

### 4. Preload Critical Images

In `<head>`:

```html
<link 
  rel="preload" 
  as="image" 
  href="/static/hero/hero-1.webp"
  fetchpriority="high"
/>
```

---

## 📊 Before/After Comparison

### Current State (BEFORE)
```
Total Page Size: ~14 MB
- hero-1.jpg: 4.4 MB
- hero-2.jpg: 4.3 MB
- hero-3.jpg: 3.8 MB
- Other: ~1.5 MB

Load Time (3G): ~15-20 seconds
Lighthouse Performance: 40-50/100
```

### After Optimization (TARGET)
```
Total Page Size: ~1 MB
- hero-1.webp: 150 KB
- hero-2.webp: 145 KB
- hero-3.webp: 135 KB
- Other: ~570 KB

Load Time (3G): ~3-4 seconds
Lighthouse Performance: 90+/100
```

**Improvement**: 
- **93% size reduction**
- **75% faster load time**
- **2x better Lighthouse score**

---

## ✅ Optimization Checklist

### Immediate Actions (Critical)
- [ ] Optimize hero-1.jpg (4.4 MB → 150 KB)
- [ ] Optimize hero-2.jpg (4.3 MB → 145 KB)
- [ ] Optimize hero-3.jpg (3.8 MB → 135 KB)
- [ ] Optimize sintetico.png (2.7 MB → 80 KB)
- [ ] Optimize etiqueta.png (2.4 MB → 70 KB)

### High Priority
- [ ] Convert all hero images to WebP
- [ ] Add lazy loading to product images
- [ ] Add priority hint to first hero image
- [ ] Implement responsive images with srcset

### Medium Priority
- [ ] Convert all product images to WebP
- [ ] Add `<picture>` fallbacks
- [ ] Implement progressive loading
- [ ] Add blur placeholders

### Low Priority
- [ ] Create multiple sizes for responsive images
- [ ] Implement AVIF format (newer, better compression)
- [ ] Add image CDN
- [ ] Implement blur hash placeholders

---

## 🔧 Tools Reference

### Online Tools
- **TinyPNG**: https://tinypng.com/
- **Squoosh**: https://squoosh.app/
- **Compressor.io**: https://compressor.io/
- **ImageOptim**: https://imageoptim.com/ (macOS)

### Command Line
- **ImageMagick**: https://imagemagick.org/
- **cwebp**: https://developers.google.com/speed/webp/
- **Sharp**: https://sharp.pixelplumbing.com/ (Node.js)

### Verification
- **PageSpeed Insights**: https://pagespeed.web.dev/
- **WebPageTest**: https://webpagetest.org/
- **Lighthouse**: Built into Chrome DevTools

---

## 📚 Best Practices

### Image Format Selection

| Use Case | Recommended Format | Alternative |
|----------|-------------------|-------------|
| Photos | WebP | JPEG |
| Graphics/Icons | SVG | PNG |
| Animations | WebP (animated) | GIF |
| Transparency needed | WebP/PNG | PNG |
| Maximum compatibility | JPEG | N/A |

### Quality Settings

| Image Type | Quality | Notes |
|-----------|---------|-------|
| Hero/Header | 75-85% | Balance size and quality |
| Product Photos | 80-90% | Higher quality for detail |
| Thumbnails | 70-80% | Lower quality acceptable |
| Backgrounds | 60-75% | Can be more aggressive |

### Dimensions

| Screen Size | Max Width | Notes |
|-------------|-----------|-------|
| Mobile | 640px | Most common |
| Tablet | 1024px | iPad, etc |
| Desktop | 1920px | Full HD |
| 4K | 2560px | Only if necessary |

---

## 🚀 Quick Start

**Fastest way to fix performance NOW**:

1. **Upload to Squoosh**:
   - hero-1.jpg, hero-2.jpg, hero-3.jpg

2. **Settings**:
   - Format: WebP
   - Quality: 80
   - Resize: 1920x1080

3. **Download** optimized files

4. **Replace** in `public/static/hero/`

5. **Test**:
   ```bash
   npm run build
   npx serve out
   # Open Chrome DevTools → Lighthouse
   ```

**Expected Result**: Performance score jumps from 40 → 85+

---

## 📞 Need Help?

- Check the main [README.md](../README.md)
- Review [Performance Guide](./performance-optimization-guide.md)
- Run: `npm run build` and check for warnings

Remember: **Every MB counts!** Users on mobile networks will thank you.

