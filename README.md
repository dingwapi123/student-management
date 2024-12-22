## 学生管理系统

## 开发环境
要启动开发服务器，请运行命令 `pnpm dev`。这将会启动开发服务器，你可以在浏览器中访问 `http://localhost:5173` 查看项目。

## 生产环境
如果你想将项目部署到生产环境，需要先构建项目，运行命令 `pnpm build`。这将会生成一个 `dist` 目录，你可以将这个目录的内容部署到你的服务器上。

## 代码规范
为了保持代码风格的一致性，我们使用了 ESLint 和 Prettier 来规范代码。你可以运行命令 `pnpm lint` 来检查和格式化代码。

## 项目结构
- **src**: 包含项目的主要源码。
- **services**: 包含 API 调用相关的服务文件。
- **data**: 包含 JSON 数据文件。
- **utils**: 包含工具函数文件。
- **features**: 包含功能组件。
- **router**: 包含路由配置文件。
- **views**: 包含主要视图组件。
- **stores**: 包含 Pinia 状态管理文件。
- **ui**: 包含自定义 UI 组件。
- **root directory**: 包含配置文件，如 `README.md`、`index.html`、`package.json`、`vite.config.js` 等。

## 依赖说明
- **Vue 3**: 项目的核心框架。
- **Vite**: 项目构建工具。
- **Supabase**: 后端即服务，用于数据库和用户认证。
- **Pinia**: Vue 的状态管理库。
- **DaisyUI**: 基于 TailwindCSS 的 UI 组件库。
- **ESLint & Prettier**: 代码检查和格式化工具。

