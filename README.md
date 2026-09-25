# Lucia 个人作品集

静态网站，保留视频、文案、关于与联系内容，新增《片场失控》游戏 Demo。

## 本地运行

在仓库根目录执行：

```bash
python3 -m http.server 8000
```

浏览器访问 http://localhost:8000/ ，首页「游戏 Demo」导航可跳转到项目介绍，再点击「体验 2D 小游戏」。也可直接访问 http://localhost:8000/games/filmset-chaos/index.html 。无需安装前端依赖或构建。

## 文件结构

- `index.html`、`style.css`：作品集首页与样式。
- `assets/`：现有视频、图片与文案资源。
- `games/filmset-chaos/`：独立游戏页面、样式、脚本及玩法说明。

Demo 使用相对路径，可随整个仓库部署在静态站点的根目录或子目录。发布时请保留目录结构；无需单独部署游戏。

## 2D 游戏原型

新增 `games/filmset-chaos-2d/index.html`：第一场「重逢」，含导演移动、五个事件、片场视觉反馈、拍摄演出与单场结算。启动本地服务后访问 `/games/filmset-chaos-2d/`。完整操作与验证说明见该目录的 `README.md`。

首页主要入口指向 2D 原型，同时保留三场文字版。网站由 GitHub Pages 从 main 分支根目录自动发布。

作品集：https://2lucia33.github.io/lucia-portfolio/

2D Demo：https://2lucia33.github.io/lucia-portfolio/games/filmset-chaos-2d/
