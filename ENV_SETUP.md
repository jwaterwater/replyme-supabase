# 环境变量配置说明

## 概述

由于系统限制无法直接创建 `.env` 文件，我已经创建了 `env-template.txt` 作为模板文件。

## 使用步骤

1. **复制模板文件**：
   ```bash
   cp env-template.txt .env
   ```

2. **编辑 .env 文件**，更新以下关键配置：

### PostgreSQL 数据库配置
```bash
POSTGRES_HOST=your-postgres-host.com        # 您的 PostgreSQL 服务器地址
POSTGRES_PORT=5432                          # PostgreSQL 端口
POSTGRES_DB=postgres                        # 数据库名称
POSTGRES_DB_NAME=supabase_admin             # 数据库用户名
POSTGRES_PASSWORD=your-postgres-password    # 数据库密码
```

### 安全密钥配置
```bash
# 使用以下命令生成密钥
npx supabase gen keys

# 然后将生成的密钥填入以下变量：
ANON_KEY=your-anon-key-here
SERVICE_ROLE_KEY=your-service-role-key-here
JWT_SECRET=your-jwt-secret-here
PG_META_CRYPTO_KEY=your-pg-meta-crypto-key-here
SECRET_KEY_BASE=your-secret-key-base-here
VAULT_ENC_KEY=your-vault-enc-key-here
```

### API 配置
```bash
API_EXTERNAL_URL=http://localhost:8000      # 外部访问地址
SUPABASE_PUBLIC_URL=http://localhost:8000   # 公共访问地址
KONG_HTTP_PORT=8000                         # HTTP 端口
KONG_HTTPS_PORT=8443                        # HTTPS 端口
```

## 重要说明

1. **PostgreSQL 配置**：确保您的远程 PostgreSQL 服务器已正确配置并可以访问
2. **密钥安全**：所有密钥都应该使用强密码，不要使用默认值
3. **网络配置**：根据您的部署环境调整 URL 和端口配置
4. **SMTP 配置**：如果需要邮件功能，请配置 SMTP 相关参数

## 验证配置

配置完成后，可以使用以下命令验证：
```bash
docker compose config
```

这将检查所有环境变量是否正确配置。
