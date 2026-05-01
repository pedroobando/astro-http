import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { execSync } from 'node:child_process';

const DRIZZLE_DIR = resolve('./drizzle');
const DATABASE_NAME = 'clients';

function main() {
  const files = readdirSync(DRIZZLE_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('No se encontraron archivos .sql en ./drizzle');
    process.exit(0);
  }

  console.log(`🚀 Aplicando ${files.length} migración(es) a D1 remota (${DATABASE_NAME})...\n`);

  for (const file of files) {
    const filePath = join(DRIZZLE_DIR, file);
    console.log(`▶️  Ejecutando ${file}...`);

    try {
      execSync(
        `wrangler d1 execute ${DATABASE_NAME} --remote --file="${filePath}"`,
        { stdio: 'inherit' }
      );
      console.log(`✅ ${file} aplicado.\n`);
    } catch (error) {
      console.error(`❌ Falló la migración ${file}. Abortando.`);
      process.exit(1);
    }
  }

  console.log('🎉 Migraciones remotas aplicadas correctamente.');
}

main();
