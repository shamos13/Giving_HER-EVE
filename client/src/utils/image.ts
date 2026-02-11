export type ResponsiveImageConfig = {
  widths?: number[]
  sizes?: string
  aspectRatio?: number
  height?: number
  crop?: "fill" | "fit" | "scale" | "thumb" | "pad"
  gravity?: string
  quality?: string
  format?: string
}

export function isCloudinaryUrl(url: string | null | undefined): boolean {
  return Boolean(url && url.includes("res.cloudinary.com") && url.includes("/upload/"))
}

export function transformCloudinaryUrl(url: string | null | undefined, transform: string): string {
  if (!url) return ""
  if (!isCloudinaryUrl(url)) return url
  return url.replace("/upload/", `/upload/${transform}/`)
}

export function getResponsiveImage(
  url: string | null | undefined,
  config: ResponsiveImageConfig = {},
): { src: string; srcSet?: string; sizes?: string } {
  if (!url) return { src: "" }
  if (!isCloudinaryUrl(url)) return { src: url }

  const widths = (config.widths && config.widths.length > 0 ? config.widths : [320, 640, 960, 1280])
    .map((value) => Math.max(16, Math.round(value)))
    .filter((value, index, values) => values.indexOf(value) === index)
    .sort((a, b) => a - b)

  const crop = config.crop ?? "fill"
  const gravity = config.gravity ?? "auto"
  const quality = config.quality ?? "auto"
  const format = config.format ?? "auto"

  const buildTransform = (width: number): string => {
    const derivedHeight =
      config.height ??
      (config.aspectRatio && config.aspectRatio > 0 ? Math.max(16, Math.round(width / config.aspectRatio)) : undefined)

    const parts = [`f_${format}`, `q_${quality}`, `w_${width}`]
    if (derivedHeight) parts.push(`h_${derivedHeight}`)
    parts.push(`c_${crop}`, `g_${gravity}`)
    return parts.join(",")
  }

  const src = transformCloudinaryUrl(url, buildTransform(widths[widths.length - 1]))
  const srcSet = widths
    .map((width) => `${transformCloudinaryUrl(url, buildTransform(width))} ${width}w`)
    .join(", ")

  return {
    src,
    srcSet,
    sizes: config.sizes ?? "100vw",
  }
}

