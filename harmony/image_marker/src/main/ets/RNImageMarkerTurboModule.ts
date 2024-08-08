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

import { RNOHLogger, TurboModule, TurboModuleContext } from '@rnoh/react-native-openharmony/ts';
import { TM } from '@rnoh/react-native-openharmony/generated/ts';
import { RNNativeImageMarker } from '@rnoh/react-native-openharmony/generated/turboModules/RNNativeImageMarker'
import window from '@ohos.window';
import resourceManager from '@ohos.resourceManager';
import { Context } from '@ohos.abilityAccessCtrl';
import fileUri from "@ohos.file.fileuri";
import { drawing } from '@kit.ArkGraphics2D';
import { image } from '@kit.ImageKit';
import fs from '@ohos.file.fs';
import font from '@ohos.font';
import { DefaultConstants } from "./common/DefaultConstants"
import { MarkImageOptions } from './common/MarkImageOptions'
import { TextOptions } from './common/TextOptions'
import { getPixelMap, getResource, SaveFormat } from './common/Utils'
import { ImageOptions } from './common/ImageOptions';
import { util } from '@kit.ArkTS';

const TAG = 'ImageMarker';
let fd: number | null = null

export class RNImageMarkerTurboModule extends TurboModule implements TM.RNNativeImageMarker.Spec {
  windowClass: window.Window | undefined = undefined;
  isKeepScreenOn: boolean = true;
  unisKeepScreenOn: boolean = false;
  private context: Context; // ApplicationContext
  private resourceManager: resourceManager.ResourceManager;
  public logger: RNOHLogger;
  imageWidth: number = 0
  imageHeight: number = 0
  fonts: font.FontOptions[] = Array<font.FontOptions>()

  constructor(ctx: TurboModuleContext) {
    super(ctx)
    this.context = this.ctx.uiAbilityContext;
    this.resourceManager = this.context.resourceManager;
    this.logger = this.ctx.logger.clone(TAG)
    // register fonts
    this.registerFonts()
  }

  registerFonts() {
    let fontUrl = "assets/assets/fonts"
    let fontsUrl = this.resourceManager.getRawFileListSync(fontUrl);
    let fileDir = this.context.filesDir
    for (let index = 0; index < fontsUrl.length; index++) {
      const element = fontsUrl[index];
      if (element.indexOf(".") > 0) {
        const familyName = element.substring(0, element.indexOf("."))
        // write font files to system
        this.resourceManager.getRawFileContent(fontUrl + "/" + element, (err, value) => {
          if(err){
            this.logger.error(TAG,err.message,err.stack)
            return
          }
          let systemFileUrl = fileDir + "/" + element
          let file = fs.openSync(systemFileUrl, fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE);
          fs.writeSync(file.fd, value.buffer);
          fs.closeSync(file);
          font.registerFont(
            { familyName: familyName, familySrc: systemFileUrl }
          )
          this.fonts.push({ familyName: familyName, familySrc: systemFileUrl })
        })
      }
    }
  }

  async markWithText(options: RNNativeImageMarker.TextMarkOptions): Promise<string> {
    this.logger.info(TAG, "markWithText params: ", JSON.stringify(options))
    try {
      let backgroundImage = new ImageOptions(options.backgroundImage)
      this.imageWidth = backgroundImage.src.width * backgroundImage.scale
      this.imageHeight = backgroundImage.src.height * backgroundImage.scale
      let backgroundImageResource = await getResource(backgroundImage.src.uri, this.resourceManager);
      let backgroundPixelMap = await getPixelMap(backgroundImageResource, backgroundImage, true)
      let canvas = new drawing.Canvas(backgroundPixelMap);
      let watermarkTexts = options.watermarkTexts;
      for (let index = 0; index < watermarkTexts.length; index++) {
        canvas.save()
        let watermarkText = watermarkTexts[index]
        let textOptions = new TextOptions(watermarkText, this.imageWidth, this.imageHeight)
        let positionEnum = watermarkText.positionOptions?.position
        if (!positionEnum) {
          positionEnum = watermarkText.position?.position
        }
        // font name
        let typeFace: drawing.Typeface
        if (textOptions.getStyle() && textOptions.getStyle().getFontName() != null) {
          let fontName: font.FontOptions | undefined =
            this.fonts.find(data => data.familyName === textOptions.getStyle().getFontName())
          if (fontName) {
            typeFace = drawing.Typeface.makeFromFile(fontName.familySrc.toString());
          }
        }
        textOptions.applyStyle(canvas, DefaultConstants.DEFAULT_MARGIN, positionEnum, textOptions.getX(),
          textOptions.getY(), textOptions.getStyle(), this.imageWidth, this.imageHeight, typeFace)
        canvas.restore()
      }
      if (backgroundImage.rotate != 0) {
        await backgroundPixelMap.rotate(backgroundImage.rotate)
      }
      let url = await this.saveImage(backgroundPixelMap, options.filename, options.saveFormat, options.quality);
      return new Promise((resolve, reject) => {
        resolve(url);
      })
    } catch (e) {
      this.logger.error(TAG + "_error", e.message, e.stack)
      return new Promise((resolve, reject) => {
        reject(e.stack);
      })
    } finally {
      if (fd) {
        fs.closeSync(fd);
      }
    }
  }

  async markWithImage(options: RNNativeImageMarker.ImageMarkOptions): Promise<string> {
    this.logger.info(TAG, "markWithImage params: ", JSON.stringify(options))
    try {
      let watermarkImageOptions = new MarkImageOptions(options);
      this.imageWidth =
        watermarkImageOptions.backgroundImage.src.width * watermarkImageOptions.backgroundImage.scale
      this.imageHeight =
        watermarkImageOptions.backgroundImage.src.height * watermarkImageOptions.backgroundImage.scale
      let backgroundImageResource =
        await getResource(watermarkImageOptions.backgroundImage.src.uri, this.resourceManager);
      let backgroundPixelMap =
        await getPixelMap(backgroundImageResource, watermarkImageOptions.backgroundImage, true)
      const canvas = new drawing.Canvas(backgroundPixelMap);
      canvas.save()
      await watermarkImageOptions.applyStyle(canvas, this.resourceManager, this.imageWidth,
        this.imageHeight,)
      if (watermarkImageOptions.backgroundImage.rotate != 0) {
        await backgroundPixelMap.rotate(watermarkImageOptions.backgroundImage.rotate)
      }
      let uri = await this.saveImage(backgroundPixelMap, options.filename, options.saveFormat, options.quality);
      return new Promise((resolve, reject) => {
        resolve(uri);
      })
    } catch (err) {
      this.logger.error(TAG + "_error", err.message, err.stack)
      return new Promise((resolve, reject) => {
        reject(err);
      })
    } finally {
      if (fd) {
        fs.closeSync(fd);
      }
    }
  }

  private async saveImage(backgroundPixelMap: image.PixelMap, filename: string, format: RNNativeImageMarker.ImageFormat,
    quality: number) {
    const imagePacker = image.createImagePacker();
    let opts = {
      format: 'image/jpeg',
      quality: !!quality ? quality : 100
    }
    if (format == 'png') {
      opts = {
        format: 'image/png',
        quality: !!quality ? quality : 100
      }
    }
    if (format === RNNativeImageMarker.ImageFormat.base64) {
      let buffer = await imagePacker.packing(backgroundPixelMap, opts)
      let bufferArr = new Uint8Array(buffer)
      let help = new util.Base64Helper
      var base = await help.encodeToString(bufferArr)
      return 'data:image/jpeg;base64,' + base
    } else {
      const imageBuffer = await imagePacker.packing(backgroundPixelMap, opts);
      let uri =
        this.generateCacheFilePathForMarker(filename, format);
      const mode = fs.OpenMode.READ_WRITE | fs.OpenMode.CREATE;
      fd = (await fs.open(uri, mode)).fd;
      await fs.truncate(fd);
      await fs.write(fd, imageBuffer);
      // change to real path
      let real = fileUri.getUriFromPath(uri)
      return real;
    }
  }

  private generateCacheFilePathForMarker(filename: string | null, saveFormat: string | null): string {
    const cacheDir = this.context.cacheDir;
    if (saveFormat && saveFormat !== null && saveFormat === SaveFormat.base64) {
      return SaveFormat.base64; // Assuming BASE64 is defined somewhere
    }
    let ext = ".png";
    if (saveFormat) {
      ext = (saveFormat !== null && saveFormat === SaveFormat.png) ? ".png" : ".jpg";
    }
    if (filename && filename !== null) {
      if (filename.endsWith(".jpg") || filename.endsWith(".png")) {
        return `${cacheDir}/${filename}`;
      } else {
        return `${cacheDir}/${filename}${ext}`;
      }
    } else {
      const name = `${util.generateRandomUUID()}_image_marker`;
      return `${cacheDir}/${name}${ext}`;
    }
  }
}

