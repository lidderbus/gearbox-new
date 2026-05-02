#!/usr/bin/env node
/**
 * scripts/generate-auth-hash.js
 * 用法: node scripts/generate-auth-hash.js <username> <password> [salt]
 *
 * 生成 AuthContext.js v2 兼容的 PBKDF2-SHA256 哈希 (10万轮 + 用户名复合 salt)
 * 与 src/contexts/AuthContext.js#hashPassword 完全等价
 *
 * 不传 salt 时自动生成 32 字节 hex, 同时打印 REACT_APP_AUTH_SALT
 */
const crypto = require('crypto');

const PBKDF2_ITERATIONS = 100000;
const PBKDF2_KEY_BYTES = 32; // 256-bit

function usage(code) {
  console.error('用法: node scripts/generate-auth-hash.js <username> <password> [salt]');
  process.exit(code);
}

const [, , username, password, providedSalt] = process.argv;
if (!username || !password) usage(1);

const baseSalt = providedSalt || crypto.randomBytes(32).toString('hex');
const compositeSalt = `${baseSalt}:${username.trim().toLowerCase()}`;
const hash = crypto.pbkdf2Sync(password, compositeSalt, PBKDF2_ITERATIONS, PBKDF2_KEY_BYTES, 'sha256').toString('hex');

if (!providedSalt) {
  console.log(`# 首次生成: 把以下行写入 .env.local 或 .env.production`);
  console.log(`REACT_APP_AUTH_SALT=${baseSalt}`);
}
const envKey = username.toUpperCase() === 'ADMIN' ? 'REACT_APP_ADMIN_HASH'
             : username.toUpperCase() === 'USER'  ? 'REACT_APP_USER_HASH'
             : `REACT_APP_${username.toUpperCase()}_HASH`;
console.log(`${envKey}=${hash}`);
console.log(`# 生成参数: PBKDF2-SHA256 / iterations=${PBKDF2_ITERATIONS} / 用户名='${username}' (混入 salt)`);
