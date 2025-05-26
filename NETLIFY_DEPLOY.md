# Netlify 部署指南

## 重新部署步骤

### 方法1：通过 Git 推送（推荐）
1. 将所有文件提交到你的 Git 仓库
2. 推送到 GitHub/GitLab
3. Netlify 会自动检测到更改并重新部署

### 方法2：手动拖拽部署
1. 将整个项目文件夹压缩成 ZIP 文件
2. 登录 Netlify Dashboard
3. 找到你的网站
4. 点击 "Deploys" 标签
5. 将 ZIP 文件拖拽到部署区域

### 方法3：使用 Netlify CLI
```bash
# 安装 Netlify CLI
npm install -g netlify-cli

# 登录
netlify login

# 部署
netlify deploy --prod
```

## 重要配置

### 环境变量设置
1. 登录 Netlify Dashboard
2. 进入你的网站设置
3. 点击 "Site settings" → "Environment variables"
4. 添加环境变量：
   - Key: `DEEPSEEK_API_KEY`
   - Value: `sk-128b3e99bbb04b50a234050b10d8837d`

### 文件结构
确保你的项目包含以下文件：
```
quarrel-master/
├── index.html
├── netlify/
│   └── functions/
│       └── deepseek.js
├── netlify.toml
├── package.json
└── README.md
```

## 故障排除

### 如果部署后仍然显示"无法生成回应"：
1. 检查 Netlify Functions 日志：
   - 在 Netlify Dashboard 中点击 "Functions"
   - 查看 `deepseek` 函数的日志
2. 确认环境变量已正确设置
3. 检查 API Key 是否有效

### 查看部署日志：
1. 在 Netlify Dashboard 中点击 "Deploys"
2. 点击最新的部署
3. 查看构建日志

## 测试
部署完成后，访问你的网站并测试：
1. 输入一些文字
2. 调整语气强度
3. 点击"开始吵架"
4. 检查是否能正常生成回应 