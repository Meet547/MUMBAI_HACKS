const fs = require('fs');

const API_URL = "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}";

// Fix login.tsx
let login = fs.readFileSync('pages/login.tsx', 'utf8');
login = login.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| '\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:3000'\}'\}\/api\/auth\/login/g, `${API_URL}/api/auth/login`);
fs.writeFileSync('pages/login.tsx', login);

// Fix signup.tsx
let signup = fs.readFileSync('pages/signup.tsx', 'utf8');
signup = signup.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| '\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:3000'\}'\}\/api\/auth\/register/g, `${API_URL}/api/auth/register`);
fs.writeFileSync('pages/signup.tsx', signup);

// Fix chat.tsx - more complex with multiple occurrences
let chat = fs.readFileSync('pages/chat.tsx', 'utf8');
chat = chat.replace(/'\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| '\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:3000'\}'\}\/api\/chat\/sessions'/g, `'${API_URL}/api/chat/sessions'`);
chat = chat.replace(/`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| '\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:3000'\}'\}\/api\/chat\/sessions\/\$\{sessionId\}\/messages`/g, '`${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:3000\'}/api/chat/sessions/${sessionId}/messages`');
chat = chat.replace(/`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| '\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:3000'\}'\}\/api\/chat\/messages`/g, '`${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:3000\'}/api/chat/messages`');
chat = chat.replace(/`\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| '\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:3000'\}'\}\/api\/chat\/sessions\/\$\{sessionId\}`/g, '`${process.env.NEXT_PUBLIC_API_URL || \'http://localhost:3000\'}/api/chat/sessions/${sessionId}`');
fs.writeFileSync('pages/chat.tsx', chat);

console.log('✅ Fixed all API URLs!');
