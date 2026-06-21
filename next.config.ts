import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export", // 强制导出为静态 HTML 文件
  images: {
    unoptimized: true, // 关闭默认的图片优化，否则在 GitHub Pages 上图片会加载失败
  },
};

export default nextConfig;