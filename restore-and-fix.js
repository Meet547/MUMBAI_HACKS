const fs = require('fs');

// Restore original files from git and then apply correct fix
const { execSync } = require('child_process');

// Restore files
execSync('git checkout pages/login.tsx pages/signup.tsx pages/chat.tsx');
console.log('✅ Restored original files');

// Now apply correct fixes
const files = [
  { path: 'pages/login.tsx', pattern: /'http:\/\/localhost:3000\/api\/auth\/login'/g, replacement: "'${API_URL}/api/auth/login'" },
  { path: 'pages/signup.tsx', pattern: /'http:\/\/localhost:3000\/api\/auth\/register'/g, replacement: "'${API_URL}/api/auth/register'" },
];

files.forEach(({ path, pattern, replacement }) => {
  let content = fs.readFileSync(path, 'utf8');
  
  // Add import at the top if not present
  if (!content.includes("import { API_URL }")) {
    content = "import { API_URL } from './api-config';\n" + content;
  }
  
  content = content.replace(pattern, replacement);
  fs.writeFileSync(path, content);
  console.log(`✅ Fixed ${path}`);
});

// Fix chat.tsx specially
let chat = fs.readFileSync('pages/chat.tsx', 'utf8');
if (!chat.includes("import { API_URL }")) {
  chat = "import { API_URL } from './api-config';\n" + chat;
}
chat = chat.replace(/'http:\/\/localhost:3000\/api\/chat\/sessions'/g, "`${API_URL}/api/chat/sessions`");
chat = chat.replace(/`http:\/\/localhost:3000\/api\/chat\/sessions\/\$\{sessionId\}\/messages`/g, "`${API_URL}/api/chat/sessions/${sessionId}/messages`");
chat = chat.replace(/`http:\/\/localhost:3000\/api\/chat\/messages`/g, "`${API_URL}/api/chat/messages`");
chat = chat.replace(/`http:\/\/localhost:3000\/api\/chat\/sessions\/\$\{sessionId\}`/g, "`${API_URL}/api/chat/sessions/${sessionId}`");
fs.writeFileSync('pages/chat.tsx', chat);
console.log('✅ Fixed pages/chat.tsx');
