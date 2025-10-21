/**
 * 密码哈希生成工具
 * 用于生成 SHA256 密码哈希值
 *
 * 使用方法:
 * node scripts/generate-password-hash.js "your-password"
 */

const crypto = require('crypto');

function generatePasswordHash(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function generateEncryptionKey() {
  return crypto.randomBytes(32).toString('hex');
}

// 从命令行参数获取密码
const password = process.argv[2];

if (!password) {
  console.log('密码哈希生成工具\n');
  console.log('使用方法:');
  console.log('  node scripts/generate-password-hash.js "your-password"\n');
  console.log('或生成随机加密密钥:');
  console.log('  node scripts/generate-password-hash.js --key\n');
  console.log('示例:');
  console.log('  node scripts/generate-password-hash.js "Gbox@2024!"\n');
  process.exit(1);
}

if (password === '--key' || password === '-k') {
  console.log('生成的加密密钥:');
  console.log(generateEncryptionKey());
  console.log('\n请将此密钥添加到 .env 文件中的 REACT_APP_ENCRYPTION_KEY');
} else {
  const hash = generatePasswordHash(password);
  console.log('密码:', password);
  console.log('SHA256哈希:', hash);
  console.log('\n请将此哈希值添加到 .env 文件中');
}
