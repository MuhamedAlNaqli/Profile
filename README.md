# Muhamed Al Naqli — Portfolio Website

Personal portfolio for **Muhamed Al Naqli**, a freelance .NET Software Developer based in Sarajevo, Bosnia and Herzegovina.

Built with [Astro](https://astro.build) + [Tailwind CSS v3](https://tailwindcss.com) + TypeScript.

---

## Tech Stack

| Tool | Purpose |
|---|---|
| Astro 4 | Static site framework |
| Tailwind CSS v3 | Utility-first styling |
| TypeScript | Type safety |
| EmailJS | Contact form email delivery |
| Nginx (Hetzner VPS) | Production hosting |

---

## Local Development

### Prerequisites

- Node.js >= 18

### Setup

```bash
# Clone the repository
git clone https://github.com/MuhamedAlNaqli/portfolio.git
cd portfolio

# Install dependencies
npm install

# Start local dev server (http://localhost:4321)
npm run dev
```

### Build

```bash
# Build static output to ./dist/
npm run build

# Preview the production build locally
npm run preview
```

---

## EmailJS Configuration

The contact form uses [EmailJS](https://www.emailjs.com/) (free tier, Gmail backend) to send messages without a backend server.

### Steps to configure

1. **Create a free account** at [emailjs.com](https://www.emailjs.com/)

2. **Add a Gmail service**
   - Go to **Email Services** → **Add New Service** → choose **Gmail**
   - Authenticate with your Gmail account
   - Note your **Service ID** (e.g. `service_abc123`)

3. **Create an email template**
   - Go to **Email Templates** → **Create New Template**
   - Design a template using these variables:
     ```
     From:    {{from_name}} <{{from_email}}>
     Subject: {{subject}}
     Body:    {{message}}
     Reply-To: {{reply_to}}
     ```
   - Note your **Template ID** (e.g. `template_xyz789`)

4. **Get your Public Key**
   - Go to **Account** → **API Keys**
   - Copy your **Public Key**

5. **Update the credentials in `src/components/Contact.astro`**

   Find these lines and replace the placeholder values:

   ```javascript
   const EMAILJS_SERVICE_ID  = 'YOUR_SERVICE_ID';   // ← replace
   const EMAILJS_TEMPLATE_ID = 'YOUR_TEMPLATE_ID';  // ← replace
   const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY';   // ← replace
   ```

6. **Rebuild**
   ```bash
   npm run build
   ```

---

## Deployment to Hetzner VPS (nginx)

### 1. Build locally

```bash
npm run build
# Output is in ./dist/
```

### 2. Upload to VPS

```bash
# Using rsync (recommended)
rsync -avz --delete dist/ user@your-vps-ip:/var/www/portfolio/

# Or using scp
scp -r dist/* user@your-vps-ip:/var/www/portfolio/
```

### 3. nginx configuration

Create `/etc/nginx/sites-available/portfolio`:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name alnaqli.dev www.alnaqli.dev;

    # Redirect HTTP to HTTPS
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name alnaqli.dev www.alnaqli.dev;

    root /var/www/portfolio;
    index index.html;

    # SSL — managed by Certbot
    ssl_certificate     /etc/letsencrypt/live/alnaqli.dev/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/alnaqli.dev/privkey.pem;
    include             /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam         /etc/letsencrypt/ssl-dhparams.pem;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css text/javascript application/javascript application/json image/svg+xml;
    gzip_min_length 1024;

    # Static asset caching
    location ~* \.(js|css|png|jpg|jpeg|gif|svg|ico|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback — not strictly needed for fully static, but good to have
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

### 4. Enable the site and reload nginx

```bash
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 5. SSL with Let's Encrypt (Certbot)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d alnaqli.dev -d www.alnaqli.dev
```

---

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── Nav.astro         # Sticky navigation + mobile hamburger
│   │   ├── Hero.astro        # Hero section with animated background
│   │   ├── Services.astro    # Services / What I Do (3-col grid)
│   │   ├── Experience.astro  # Work history timeline
│   │   ├── Projects.astro    # Selected projects grid
│   │   ├── TechStack.astro   # Technologies icon grid
│   │   ├── Contact.astro     # Contact form (EmailJS) + info
│   │   └── Footer.astro      # Footer with social links
│   ├── layouts/
│   │   └── Layout.astro      # HTML shell, SEO meta, fonts
│   ├── pages/
│   │   └── index.astro       # Single-page entry point
│   └── styles/
│       └── global.css        # Tailwind directives + custom utilities
├── public/
│   ├── favicon.svg
│   └── robots.txt
├── astro.config.mjs
├── tailwind.config.mjs
└── package.json
```

---

## Customization

| What | Where |
|---|---|
| Personal info / copy | Edit the relevant `src/components/*.astro` files |
| Accent color | `tailwind.config.mjs` → `theme.extend.colors.accent` |
| EmailJS credentials | `src/components/Contact.astro` → top of `<script>` |
| Domain / canonical URL | `src/layouts/Layout.astro` → `canonicalURL` constant |
| OG image | Replace `public/og-image.png` (recommended: 1200×630px) |
