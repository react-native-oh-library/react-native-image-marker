import { RNNativeImageMarker } from '@rnoh/react-native-openharmony/generated/turboModules/RNNativeImageMarker'
import { image } from '@kit.ImageKit';
import { ImageOptions } from './ImageOptions';

const TAG = 'ImageMarker';

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

export function calculatePadding(watermarkText: RNNativeImageMarker.TextOptions) {
  let topValue
  let leftValue
  let bottomValue
  let rightValue

  if (watermarkText.style?.textBackgroundStyle) {
    let padding = watermarkText.style?.textBackgroundStyle?.padding;
    if (typeof padding === 'string') {
      let paddingValue = padding.trim();
      if (!checkSpreadValue(paddingValue, 4)) {
        // throw  Exception("padding is invalid")
      }
      let values = paddingValue.split(" ")
      switch (values.length) {
        case 1:
          topValue = values[0]
          leftValue = values[0]
          bottomValue = values[0]
          rightValue = values[0]
          break;
        case 2:
          topValue = values[0]
          leftValue = values[1]
          bottomValue = values[0]
          rightValue = values[1]
          break;
        case 3:
          topValue = values[0]
          leftValue = values[1]
          bottomValue = values[2]
          rightValue = values[1]
          break;
        case 4:
          topValue = values[0]
          leftValue = values[1]
          bottomValue = values[2]
          rightValue = values[3]
          break;
      }
    } else if (typeof padding === 'number') {
      topValue = padding.toString()
      leftValue = padding.toString()
      bottomValue = padding.toString()
      rightValue = padding.toString()
    }

    let paddingLeft = watermarkText.style?.textBackgroundStyle?.paddingLeft;
    if (paddingLeft && typeof paddingLeft === "string") {
      if (!checkSpreadValue(paddingLeft, 1)) {
        //throw Exception("padding is invalid")
      }
      leftValue = paddingLeft
    } else if (paddingLeft && typeof paddingLeft === "number") {
      leftValue = paddingLeft.toString()
    }
    let paddingRight = watermarkText.style?.textBackgroundStyle?.paddingRight;
    if (paddingRight && typeof paddingRight === "string") {
      if (!checkSpreadValue(paddingRight, 1)) {
        //throw Exception("padding is invalid")
      }
      rightValue = paddingRight
    } else if (paddingRight && typeof paddingRight === "number") {
      rightValue = paddingRight.toString()
    }
    let paddingTop = watermarkText.style?.textBackgroundStyle?.paddingTop;
    if (paddingTop && typeof paddingTop === "string") {
      if (!checkSpreadValue(paddingTop, 1)) {
        //throw Exception("padding is invalid")
      }
      topValue = paddingTop
    } else if (paddingTop && typeof paddingTop === "number") {
      topValue = paddingTop.toString()
    }
    let paddingBottom = watermarkText.style?.textBackgroundStyle?.paddingBottom;
    if (paddingBottom && typeof paddingBottom === "string") {
      if (!checkSpreadValue(paddingBottom, 1)) {
        //throw Exception("padding is invalid")
      }
      bottomValue = paddingBottom
    } else if (paddingBottom && typeof paddingBottom === "number") {
      bottomValue = paddingBottom.toString()
    }
    let paddingHorizontal = watermarkText.style?.textBackgroundStyle?.paddingHorizontal;
    if (paddingHorizontal && typeof paddingHorizontal === "string") {
      if (!checkSpreadValue(paddingHorizontal, 1)) {
        //throw Exception("padding is invalid")
      }
      rightValue = paddingHorizontal
      leftValue = paddingHorizontal
    } else if (paddingHorizontal && typeof paddingHorizontal === "number") {
      leftValue = paddingHorizontal.toString()
      rightValue = paddingHorizontal.toString()
    }

    let paddingX = watermarkText.style?.textBackgroundStyle?.paddingX;
    if (paddingX && typeof paddingX === "string") {
      if (!checkSpreadValue(paddingX, 1)) {
        //throw Exception("padding is invalid")
      }
      rightValue = paddingX
      leftValue = paddingX
    } else if (paddingX && typeof paddingX === "number") {
      leftValue = paddingX.toString()
      rightValue = paddingX.toString()
    }
    let paddingVertical = watermarkText.style?.textBackgroundStyle?.paddingVertical
    if (paddingVertical && typeof paddingVertical === "string") {
      if (!checkSpreadValue(paddingVertical, 1)) {
        //throw Exception("padding is invalid")
      }
      topValue = paddingVertical
      bottomValue = paddingVertical
    } else if (paddingVertical && typeof paddingVertical === "number") {
      topValue = paddingVertical.toString()
      bottomValue = paddingVertical.toString()
    }
    let paddingY = watermarkText.style?.textBackgroundStyle?.paddingY;
    if (paddingY && typeof paddingY === "string") {
      if (!checkSpreadValue(paddingY, 1)) {
        //throw Exception("padding is invalid")
      }
      topValue = paddingY
      bottomValue = paddingY
    } else if (paddingY && typeof paddingY === "number") {
      topValue = paddingY.toString()
      bottomValue = paddingY.toString()
    }

  }
  return {
    "topValue": topValue,
    "leftValue": leftValue,
    "bottomValue": bottomValue,
    "rightValue": rightValue
  }
}

export function convertHexToArgb(hex: string) {
  console.log(TAG + "_convertHexToArgb", hex)
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

export async function getPixelMap(resource, imageOptions: ImageOptions,isBackground:boolean) {
  let arrayBuffer = resource.buffer.slice(resource.byteOffset, resource.byteLength + resource.byteOffset)
  let sourceOptions: image.SourceOptions =
    {
      sourceDensity: 120,
      sourceSize: {
        height: imageOptions.src.height * imageOptions.scale,
        width: imageOptions.src.width * imageOptions.scale
      }
    };
  const imageSource = image.createImageSource(arrayBuffer, sourceOptions)
  let opts: image.DecodingOptions = {
    editable: true,
    desiredSize: {
      height: imageOptions.src.height * imageOptions.scale,
      width: imageOptions.src.width * imageOptions.scale
    }
  }
  let pixelMap = await imageSource.createPixelMap(opts);
  pixelMap.opacitySync(imageOptions.alpha);
  return pixelMap;
}

export async function getResource(url: string, resourceManager) {
  return await resourceManager.getRawFileContent(url);
}

export function getImageUri(src: string) {
  let srcObj = JSON.parse(JSON.stringify(src)) as ImageSrc;
  console.log(TAG + "_srcObj", JSON.stringify(srcObj))
  let uri = srcObj.uri
  let realUrl = uri.substring(uri.indexOf("//") + 2);
  let url = realUrl.substring(0, realUrl.indexOf("/")) + "/" + realUrl;
  console.log(TAG + "_realUrl", realUrl)
  console.log(TAG + "url", url)
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