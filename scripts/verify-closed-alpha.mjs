import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(new URL('../package.json', import.meta.url)));
const sourceRoot = join(root, 'src');
const failures = [];

const removedSignupFiles = [
  'src/app/components/SignUpForm.tsx',
  'src/app/components/InviteCodeInput.tsx',
  'src/app/lib/inviteCodes.ts',
  'src/app/lib/firebase.ts',
];

for (const filePath of removedSignupFiles) {
  if (existsSync(join(root, filePath))) {
    failures.push(`${filePath} still exists`);
  }
}

const textExtensions = new Set(['.cjs', '.css', '.html', '.js', '.jsx', '.json', '.mjs', '.ts', '.tsx']);

function extensionOf(filePath) {
  const match = filePath.match(/\.[^.]+$/);
  return match?.[0] ?? '';
}

function walkTextFiles(dir) {
  return readdirSync(dir)
    .flatMap((name) => {
      const filePath = join(dir, name);
      const stats = statSync(filePath);

      if (stats.isDirectory()) return walkTextFiles(filePath);
      if (!stats.isFile() || !textExtensions.has(extensionOf(filePath))) return [];

      return [filePath];
    });
}

const forbiddenSourcePatterns = [
  {
    pattern: /firebase\/(?:app|firestore)/,
    message: 'imports Firebase client code',
  },
  {
    pattern: /\baddDoc\s*\(/,
    message: 'can create a Firestore document',
  },
  {
    pattern: /\bcollection\s*\([^)]*['"]signups['"]/,
    message: 'targets the Firestore signups collection',
  },
  {
    pattern: /['"`]signups['"`]/,
    message: 'contains the signups collection literal',
  },
  {
    pattern: /\b(?:INVITE_CODES|VALID_INVITE_CODES)\b/,
    message: 'contains client invite-code constants',
  },
  {
    pattern: /VITE_FIREBASE_[A-Z_]+/,
    message: 'contains Firebase web environment variables',
  },
];

for (const filePath of walkTextFiles(sourceRoot)) {
  const source = readFileSync(filePath, 'utf8');
  const displayPath = relative(root, filePath);

  for (const { pattern, message } of forbiddenSourcePatterns) {
    if (pattern.test(source)) {
      failures.push(`${displayPath} ${message}`);
    }
  }
}

const invitationPath = join(sourceRoot, 'app/components/InvitationContent.tsx');
const invitationSource = readFileSync(invitationPath, 'utf8');
const applyStart = invitationSource.indexOf('export function ApplyNowSectionContent');
const closedAlphaStart = invitationSource.indexOf('function ClosedAlphaIntakeState');

if (applyStart === -1 || closedAlphaStart === -1 || closedAlphaStart <= applyStart) {
  failures.push('ApplyNowSectionContent no longer renders the closed alpha state in the expected structure');
} else {
  const applyNowSection = invitationSource.slice(applyStart, closedAlphaStart);

  if (!applyNowSection.includes('<ClosedAlphaIntakeState />')) {
    failures.push('ApplyNowSectionContent does not render ClosedAlphaIntakeState');
  }

  for (const pattern of [/<form\b/i, /\bonSubmit=/i, /type=["']submit["']/i]) {
    if (pattern.test(applyNowSection)) {
      failures.push('ApplyNowSectionContent contains a form submission path');
      break;
    }
  }
}

if (failures.length > 0) {
  console.error('Closed alpha verification failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Closed alpha verification passed.');
