import type { NextConfig } from "next";
import ezdocConfig from "./ezdoc.config";

const basePath = process.env.EZDOC_BASE_PATH ?? ezdocConfig.deploy.basePath;

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath || "",
  },
};

export default nextConfig;
