import { NextResponse } from 'next/server';
import fs from 'fs-extra';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST(request: Request) {
  try {
    const { name } = await request.json();
    
    if (!name) {
      return NextResponse.json({ error: 'Nome do site é obrigatório' }, { status: 400 });
    }

    const safeName = name.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    const rootDir = path.resolve(process.cwd(), '..');
    const templateDir = path.join(rootDir, '_templates', 'minimal-site');
    const targetDir = path.join(rootDir, '_sites', safeName);

    if (fs.existsSync(targetDir)) {
      return NextResponse.json({ error: 'Um site com este nome já existe' }, { status: 400 });
    }

    // 1. Copiar Template
    await fs.copy(templateDir, targetDir);

    // 2. Atualizar metadata.json com porta dinâmica e nome real
    const metadataPath = path.join(targetDir, 'metadata.json');
    const existingSites = await fs.readdir(path.join(rootDir, '_sites'));
    const nextPort = 3100 + existingSites.length;
    
    const metadata = {
      name: name,
      port: nextPort,
      framework: "Next.js",
      prodUrl: `https://vweb-${safeName}.vercel.app`
    };
    
    await fs.writeJson(metadataPath, metadata, { spaces: 2 });

    // 3. Atualizar package.json do site com o nome correto
    const pkgPath = path.join(targetDir, 'package.json');
    const pkg = await fs.readJson(pkgPath);
    pkg.name = `vweb-${safeName}`;
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });

    // 4. Disparar Deploy Automático (Async)
    const scriptPath = path.join(rootDir, 'scripts', 'deploy-site.ps1');
    const command = `powershell.exe -ExecutionPolicy Bypass -File "${scriptPath}" -SiteId "${safeName}"`;
    
    // Não esperamos o deploy terminar (leva tempo), mas disparamos
    exec(command, (error, stdout, stderr) => {
      if (error) console.error(`Erro no deploy de ${safeName}:`, error);
      console.log(`Deploy Output for ${safeName}:`, stdout);
    });

    return NextResponse.json({ 
      success: true, 
      id: safeName,
      message: 'Site criado! O deploy no Vercel foi iniciado em segundo plano.',
      metadata 
    });

  } catch (error: any) {
    console.error('Erro ao criar site:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
