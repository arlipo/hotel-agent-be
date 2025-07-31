#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { swaggerSpec } from '../src/docs/swagger.ts';

// ES module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the output path
const outputPath = path.join(__dirname, '..', 'swagger.json');

try {
  // Generate the swagger.json file
  const swaggerJson = JSON.stringify(swaggerSpec, null, 2);
  
  // Write to file
  fs.writeFileSync(outputPath, swaggerJson, 'utf8');
  
  console.log(`✅ Swagger JSON file generated successfully at: ${outputPath}`);
  console.log(`📝 File size: ${(swaggerJson.length / 1024).toFixed(2)} KB`);
  
} catch (error) {
  console.error('❌ Error generating swagger.json:', error.message);
  process.exit(1);
}
