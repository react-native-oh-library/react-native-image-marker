/**
 * MIT License
 *
 * Copyright (C) 2024 Huawei Device Co., Ltd.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { image } from '@kit.ImageKit';
import { ImageOptions } from './ImageOptions';
import { fileIo } from '@kit.CoreFileKit';
import { util } from '@kit.ArkTS';
import { http } from '@kit.NetworkKit'
import { MarkerError } from './MarkerError';
import { ErrorCode } from './ErrorCode';

export interface position {
  x: number,
  y: number
}

export function checkSpreadValue(str: string, maxLength: number) {
  if (str == null) {
    return false
  }
  let pattern = new RegExp(`^((\\d+|\\d+%\\s?){1,${maxLength}})$`)
  return pattern.test(str);
}

export function parseSpreadValue(v: string | null, relativeTo: number): number {
  if (v === null) {
    return 0;
  }
  if (v.endsWith("%")) {
    const percent = parseFloat(v.slice(0, -1)) / 100 || 0;
    return relativeTo * percent;
  } else {
    return parseFloat(v) || 0;
  }
}

export function handleDynamicToString(d): string {
  if (!d) {
    return "0";
  }
  switch (typeof d) {
    case "string":
      return d.toString();
    case "number":
      return d.toString();
    default:
      return "0";
  }
}

export enum Align {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right"
}

export function convertHexToArgb(hex: string) {
  hex = hex.replace(/^#/, '');
  if (hex.length === 6) {
    hex = 'FF' + hex;
  }
  const alpha = parseInt(hex.slice(0, 2), 16);
  const red = parseInt(hex.slice(2, 4), 16);
  const green = parseInt(hex.slice(4, 6), 16);
  const blue = parseInt(hex.slice(6, 8), 16);
  return {
    "alpha": alpha,
    "red": red,
    "green": green,
    "blue": blue
  };
}

export enum SaveFormat {
  png = 'png',
  jpg = 'jpg',
  base64 = 'base64',
}

export interface ImageSrc {
  scale: number,
  height: number,
  uri: string,
  width: number,
  __packager_asset: boolean
}

export function isCoilImg(uri: string | null): boolean {
  if (!uri) {
    return false;
  }
  return uri.startsWith("http://") ||
  uri.startsWith("https://") ||
  uri.startsWith("file://") ||
    (uri.startsWith("data:") && uri.includes("base64") &&
      (uri.includes("img") || uri.includes("image")));
}

export async function downloadImage(src: string): Promise<object> {
  // write the image to system
  let dir = globalThis.context.cacheDir
  let filePath =
    dir + "/" + util.generateRandomUUID(true).toString() + src.substring(src.lastIndexOf("/") + 1, src.length)
  let resp = await http.createHttp().request(src, { readTimeout: 0,connectTimeout:0, usingCache: true })
  if (resp.responseCode === http.ResponseCode.OK) {
    let imageSource = await image.createImageSource(resp.result as ArrayBuffer);
    let file = await fileIo.open(filePath, fileIo.OpenMode.READ_WRITE | fileIo.OpenMode.CREATE)
    // 写入文件
    Object
    await fileIo.write(file.fd, resp.result as ArrayBuffer);
    // 关闭文件
    await fileIo.close(file.fd);
    let imageInfo = await imageSource.getImageInfo(0);

    return {
      'uri': filePath,
      'height': imageInfo.size.height,
      'width': imageInfo.size.width,
      'scale': 1
    }
  } else {
    throw new MarkerError(ErrorCode.LOAD_IMAGE_FAILED, "image url is INVALID")
  }
}

export async function getPixelMap(resourceManager, imageOptions: ImageOptions, isBackground: boolean) {
  let imageSource:image.ImageSource
  let sourceOptions: image.SourceOptions =
    {
      sourceDensity: 120,
      sourceSize: {
        height: imageOptions.src.height,
        width: imageOptions.src.width
      }
    };
  if (imageOptions.uri?.startsWith("assets")) {
    let resource = await getResource(imageOptions.src.uri, resourceManager);
    let arrayBuffer = resource.buffer.slice(resource.byteOffset, resource.byteLength + resource.byteOffset)
    imageSource =await image.createImageSource(arrayBuffer, sourceOptions)
  } else {
    imageSource =await image.createImageSource(imageOptions.src.uri)
  }

  let opts: image.InitializationOptions = {
    editable: true,
    size: {
      height: imageOptions.src.height ,
      width: imageOptions.src.width
    }
  }
  let pixelMap = await imageSource.createPixelMap(opts);
  pixelMap.opacitySync(imageOptions.alpha);
  pixelMap.scaleSync(imageOptions.scale,imageOptions.scale)
  return pixelMap;
}

export function findFontResource(resourceManager, fontName: string, path: string): string {
  let targetFile = fontName + ".ttf"
  let files: string[] = resourceManager.getRawFileListSync(path)
  for (let index = 0; index < files.length; index++) {
    const file = files[index];
    const tempUrl = path + "/" + file;
    if (file.endsWith(targetFile)) {
      return tempUrl
    } else {
      if (file.indexOf(".") > 0) {
        continue

      } else {
        findFontResource(resourceManager, fontName, tempUrl);
      }
    }
  }
  return undefined
}

export async function getResource(url: string, resourceManager) {
  return await resourceManager.getRawFileContent(url);
}

export function getImageUri(src: string) {
  let srcObj = JSON.parse(JSON.stringify(src)) as ImageSrc;
  let uri = srcObj.uri
  let realUrl = uri.substring(uri.indexOf("//") + 2);
  let url = realUrl.substring(0, realUrl.indexOf("/")) + "/" + realUrl;
  return {
    url: url,
    height: srcObj.height,
    width: srcObj.width,
    scale: srcObj.scale,
    __packager_asset: srcObj.__packager_asset
  };
}

export function getFormat(format: string | null): SaveFormat {
  let result;
  switch (format) {
    case 'png':
      result = SaveFormat.png
      break;
    case 'jpg':
      result = SaveFormat.jpg
      break;
    case 'base64':
      result = SaveFormat.base64
      break;
    default:
      result = SaveFormat.png
      break;
  }
  return result;
}

export interface PathPotions {
  startX: number
  startY: number
  endX: number
  endY: number
  ctrX: number
  ctrY: number
}

export function divideAndRound(num1: number, num2: number, decimalPlaces: number): number {
  if (num2 === 0) {
    throw new Error("The divisor cannot be zero");
  }
  const result = num1 / num2;
  const rounded = Math.round(result * Math.pow(10, decimalPlaces)) / Math.pow(10, decimalPlaces);
  return rounded;
}