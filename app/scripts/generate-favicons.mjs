import sharp from 'sharp';
import toIco from 'to-ico';
import { mkdir, writeFile, readFile, readdir, unlink } from 'fs/promises';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { createReadStream, createWriteStream } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = join(__dirname, '../');
const publicDir = join(rootDir, 'public');
const iconsDir = join(publicDir, 'assets/icons');
const outputDir = join(publicDir, 'favicon');

// Tamanhos de ícone comuns
const sizes = [16, 32, 48, 64, 96, 128, 192, 256, 384, 512];

// Cores personalizadas (opcional)
const backgroundColor = '#ffffff';
const foregroundColor = '#10b981'; // Cor verde para o ícone

async function generateFavicons() {
  try {
    // Criar diretório de saída
    await mkdir(outputDir, { recursive: true });
    
    // Carregar o ícone SVG
    const inputSvg = join(iconsDir, 'money-icon.svg');
    
    // Gerar favicons em diferentes tamanhos
    await Promise.all(
      sizes.map(async (size) => {
        const outputPng = join(outputDir, `favicon-${size}x${size}.png`);
        await sharp(inputSvg)
          .resize(size, size)
          .flatten({ background: backgroundColor })
          .toFile(outputPng);
        console.log(`Generated: ${outputPng}`);
      })
    );

    // Gerar favicon.ico (tamanhos múltiplos em um único arquivo)
    const icoSizes = [16, 32, 48, 64];
    const icoBuffers = await Promise.all(
      icoSizes.map(async (size) => {
        const buffer = await sharp(inputSvg)
          .resize(size, size)
          .flatten({ background: backgroundColor })
          .toBuffer();
        return buffer;
      })
    );
    
    const icoFile = join(outputDir, 'favicon.ico');
    const icoData = await toIco(icoBuffers, { sizes: icoSizes });
    await writeFile(icoFile, icoData);
    console.log('Generated: favicon.ico');

    // Gerar apple-touch-icon.png (180x180)
    await sharp(inputSvg)
      .resize(180, 180)
      .flatten({ background: backgroundColor })
      .toFile(join(outputDir, 'apple-touch-icon.png'));
    console.log('Generated: apple-touch-icon.png');

    // Gerar site.webmanifest
    const manifest = {
      name: 'EmpréstiFácil',
      short_name: 'EmpréstiFácil',
      description: 'Encontre o melhor empréstimo para você',
      start_url: '/',
      display: 'standalone',
      background_color: backgroundColor,
      theme_color: foregroundColor,
      icons: [
        {
          src: '/favicon/favicon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable',
        },
        {
          src: '/favicon/favicon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable',
        },
      ],
    };

    await writeFile(
      join(publicDir, 'site.webmanifest'),
      JSON.stringify(manifest, null, 2)
    );
    console.log('Generated: site.webmanifest');

    // Atualizar o arquivo index.html
    const indexHtmlPath = join(rootDir, 'index.html');
    let indexHtml = await readFile(indexHtmlPath, 'utf8');
    
    const faviconLinks = `
    <!-- Favicons -->
    <link rel="icon" type="image/x-icon" href="/favicon/favicon.ico" />
    <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon-32x32.png" />
    <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon-16x16.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/favicon/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="theme-color" content="${foregroundColor}" />
    `;

    // Inserir os links de favicon antes do fechamento do head
    indexHtml = indexHtml.replace(
      '</head>',
      `${faviconLinks}
    </head>`
    );

    await writeFile(indexHtmlPath, indexHtml);
    console.log('Updated: index.html with favicon links');

    console.log('\n✅ Favicons gerados com sucesso!');
  } catch (error) {
    console.error('❌ Erro ao gerar favicons:', error);
    process.exit(1);
  }
}

generateFavicons();
