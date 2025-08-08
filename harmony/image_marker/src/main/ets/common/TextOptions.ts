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

import { drawing, common2D } from '@kit.ArkGraphics2D';
import { parseSpreadValue, PathPotions, divideAndRound } from './Utils'
import { PositionEnum } from './PositionEnum';
import { Position } from './Position';
import { TextStyle } from './TextStyle';
import { MarkerError } from './MarkerError'
import { DefaultConstants } from './DefaultConstants'
import { ErrorCode } from './ErrorCode'
import { handleDynamicToString, convertHexToArgb } from './Utils'
import { RNNativeImageMarker } from '@rnoh/react-native-openharmony/generated/turboModules/RNNativeImageMarker'
import { MarkerInsets } from './MarkerInsets';
import { TextAlign } from './TextAlign';
import resourceManager from '@ohos.resourceManager';
import { window } from '@kit.ArkUI';

export class TextOptions {
  private text: string | null;
  private metrics?: drawing.FontMetrics;

  public setText(value: string | null) {
    this.text = value;
  }

  public getText(): string | null {
    return this.text;
  }

  private x: string | null;

  public setX(value: string | null) {
    this.x = value;
  }

  public getX(): string | null {
    return this.x;
  }

  private y: string | null;

  public setY(value: string | null) {
    this.y = value;
  }

  public getY(): string | null {
    return this.y;
  }

  private position: Position | null;

  public setPosition(value: Position | null) {
    this.position = value;
  }

  public getPosition(): Position | null {
    return this.position;
  }

  private style: TextStyle;

  public setStyle(value: TextStyle) {
    this.style = value;
  }

  public getStyle(): TextStyle {
    return this.style;
  }

  private maxWidth: number;

  public setMaxWidth(value: number) {
    this.maxWidth = value;
  }

  public getMaxWidth(): number {
    return this.maxWidth;
  }

  private maxHeight: number;

  public setMaxHeight(value: number) {
    this.maxHeight = value;
  }

  public getMaxHeight(): number {
    return this.maxHeight;
  }

  private lines: string[] = [];
  private textHeight: number;
  private fontHeight: number;
  private textWidth: number;
  private positionEnum: PositionEnum | null;
  ;


  constructor(options: RNNativeImageMarker.TextOptions) {
    this.text = options.text;
    if (!this.text) {
      throw new MarkerError(ErrorCode.PARAMS_REQUIRED, "mark text is required");
    }
    const positionOptions = options.position || null;
    this.x = positionOptions?.X ? handleDynamicToString(positionOptions?.X) : null;
    this.y = positionOptions?.Y ? handleDynamicToString(positionOptions.Y) : null;
    this.positionEnum = positionOptions?.position ? PositionEnum.getPosition(positionOptions?.position) : null;
    this.style = new TextStyle(options.style)
  }

  private wrapText(text: string, containerWidth: number, font: drawing.Font) {
    const words = text.split('');
    let line = '';
    const lines = [];
    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i];
      let testWidth = font.measureText(testLine, drawing.TextEncoding.TEXT_ENCODING_UTF8);
      if (testWidth > containerWidth) {
        lines.push(line);
        line = words[i];
      } else {
        line = testLine;
      }
    }
    lines.push(line);
    return lines;
  }

  applyStyle(
    canvas: drawing.Canvas,
    maxWidth: number,
    maxHeight: number,
    typeFace: drawing.Typeface | undefined
  ) {
    this.maxWidth = maxWidth;
    this.maxHeight = maxHeight;
    let font = new drawing.Font();
    if (typeFace) {
      font.setTypeface(typeFace)
    }
    const textSize = this.style.getFontSize();
    font.setSize(textSize);
    let metrics = font.getMetrics();
    this.metrics = metrics;
    let textTop = Math.abs(metrics.top);
    this.fontHeight = metrics.descent - metrics.ascent;
    let maxTextWidth = maxWidth - 2 * DefaultConstants.DEFAULT_MARGIN;
    let texts = this.text.split("\n");
    for (let index = 0; index < texts.length; index++) {
      const text = texts[index];
      let width = font.measureText(text, drawing.TextEncoding.TEXT_ENCODING_UTF8);
      if (width > maxTextWidth) {
        this.textWidth = maxTextWidth;
        this.lines = this.lines.concat(this.wrapText(text, maxTextWidth, font));
      } else {
        this.textWidth = this.textWidth > width ? this.textWidth : width;
        this.lines.push(text);
      }
    }
    this.textHeight = this.fontHeight * this.lines.length;
    this.position = new Position(DefaultConstants.DEFAULT_MARGIN, DefaultConstants.DEFAULT_MARGIN);
    if (this.positionEnum) {
      this.position =
        Position.getTextPosition(this.positionEnum, this.maxWidth, this.maxHeight, this.textWidth, this.textHeight);
    }else {
      if (this.x !== null) {
        this.position.x = parseSpreadValue(this.x, maxWidth);
      }
      if (this.y !== null) {
        this.position.y = parseSpreadValue(this.y, maxHeight);
      }
    }
    if (this.style.getTextBackgroundStyle()) {
        this.drawBackground(canvas);
    }
    this.drawTextWithStyle(canvas, font, textTop);
  }

  private drawTextWithStyle(canvas: drawing.Canvas, font: drawing.Font, textTop: number) {
    let fontBrush = new drawing.Brush();
    let fontPen = new drawing.Pen();
    if (this.style.getShadowLayerStyle()) {
      const shadow = this.style.getShadowLayerStyle();
      const shadowLayer = drawing.ShadowLayer.create(shadow?.radius, shadow?.dx, shadow?.dy, shadow?.color);
      fontBrush.setShadowLayer(shadowLayer);
      fontPen.setShadowLayer(shadowLayer);
    }
    let strokeWidth = 2;
    if (this.style.getBold()) {
      strokeWidth = 4;
    }
    canvas.save()
    let bgRect: common2D.Rect = {
      left: this.position?.x,
      top: this.position?.y,
      right: this.position?.x + this.textWidth,
      bottom: this.position?.y + this.textHeight,
    };
    if (this.style.getRotate() != 0) {
      canvas.rotate(this.style.getRotate(), (bgRect.left + bgRect.right) / 2, (bgRect.top + bgRect.bottom) / 2);
    }
    fontPen.setStrokeWidth(strokeWidth);
    if (this.style.getColor()) {
      let fontColor = convertHexToArgb(this.style.getColor());
      fontBrush.setColor(fontColor);
      fontPen.setColor(fontColor);
    }
    canvas.attachPen(fontPen);
    canvas.attachBrush(fontBrush);
    for (let index = 0; index < this.lines.length; index++) {
      this.drawText(font, this.lines[index], textTop, canvas, index);
    }
    canvas.detachPen();
    canvas.detachBrush();
    canvas.restore();
  }

  private drawBackground(canvas: drawing.Canvas) {
    let bgInsets = this.style.getTextBackgroundStyle().toEdgeInsets(this.maxWidth, this.maxHeight);
    let bgRect = this.calculateBackgroundTypeReact(bgInsets);
    let backgroundBrush = new drawing.Brush();
    if (this.style.getTextBackgroundStyle() && this.style.getTextBackgroundStyle()?.color) {
      backgroundBrush.setColor(this.style.getTextBackgroundStyle()?.color);
    }
    canvas.save()
    if (this.style.getRotate() != 0) {
      canvas.rotate(this.style.getRotate(), (bgRect.left + bgRect.right) / 2, (bgRect.top + bgRect.bottom) / 2);
    }

    if (this.style.getTextBackgroundStyle().cornerRadius) {
      let paths: PathPotions[] = this.style.getTextBackgroundStyle().cornerRadius?.radii(bgRect);
      let path = this.getDrawPath(bgRect, paths);
      canvas.attachBrush(backgroundBrush);
      canvas.drawPath(path);
      canvas.detachBrush();
    } else {
      canvas.attachBrush(backgroundBrush);
      canvas.drawRect(bgRect);
      canvas.detachBrush();
    }
    canvas.restore();
  }

  private calculateBackgroundTypeReact(bgInsets: MarkerInsets) {
    let bgRect: common2D.Rect  = {
      left: this.position?.x - bgInsets.getLeft(),
      top: this.position?.y - bgInsets.getTop(),
      right: this.position?.x + this.textWidth + bgInsets.getRight(),
      bottom: this.position?.y + this.textHeight + bgInsets.getBottom() + DefaultConstants.DEFAULT_BACKGROUP_BOTTOM_PADDING
    };
    switch (this.style.getTextBackgroundStyle()?.type) {
      case 'stretchX':
        bgRect = {
          left: 0,
          top: this.position?.y - bgInsets.getTop(),
          right: this.maxWidth,
          bottom: this.position?.y + this.textHeight  + bgInsets.getBottom() + DefaultConstants.DEFAULT_BACKGROUP_BOTTOM_PADDING,
        }
        break;
      case 'stretchY':
        bgRect = {
          left: this.position?.x - bgInsets.getLeft(),
          top: 0,
          right: this.position?.x + this.textWidth + bgInsets.getRight(),
          bottom: this.maxHeight + DefaultConstants.DEFAULT_BACKGROUP_BOTTOM_PADDING,
        }
        break;
    }
    return bgRect;
  }

  private drawText(font: drawing.Font, text: string, textTop: number, canvas: drawing.Canvas, index: number) {
    let textWidths = font.measureText(text, drawing.TextEncoding.TEXT_ENCODING_UTF8);
    let textAlign = this.style.getTextAlign();
    let x = this.position?.x;
    if (textAlign == TextAlign.CENTER) {
      x = x + this.textWidth / 2 - textWidths / 2
    } else if (textAlign == TextAlign.RIGHT) {
      x = x + this.textWidth - textWidths
    }
    let y = this.position?.y + this.fontHeight * index + this.fontHeight - this.metrics.descent ?? 0;
    let skewX = 0;
    if (this.style.getItalic() || this.style.getSkewX()) {
      skewX = DefaultConstants.DEFAULT_ITALIC;
      if (this.style.getSkewX()) {
        skewX = -this.style.getSkewX();
      }
      font.setSkewX(skewX)
    }
    const textblob = drawing.TextBlob.makeFromString(text, font, drawing.TextEncoding.TEXT_ENCODING_UTF8);
    canvas.drawTextBlob(textblob, x, y);
    if (this.style.getUnderline()) {
      this.drawUnderline(x, y, textWidths, textTop, canvas);
    }
    if (this.style.getStrikeThrough()) {
      this.drawStrikeThrough(x, y, textWidths, canvas);
    }
  }

  private drawUnderline(x: number, y: number, textWidths: number, textTop: number, canvas: drawing.Canvas) {
    let x0 = x;
    let y0 = y - textTop + this.fontHeight + DefaultConstants.DEFAULT_UNDERLINE_DIATANCE;
    let x1 = x0 + textWidths;
    let y1 = y - textTop + this.fontHeight + DefaultConstants.DEFAULT_UNDERLINE_DIATANCE;
    canvas.drawLine(x0, y0, x1, y1);
  }

  private drawStrikeThrough(x: number, y: number, textWidths: number, canvas: drawing.Canvas) {
    let x0 = x
    let y0 = y - this.fontHeight / 4
    let x1 = x0 + textWidths
    let y1 = y - this.fontHeight / 4
    canvas.drawLine(x0, y0, x1, y1)
  }

  getDrawPath(rect: common2D.Rect, paths: PathPotions[]): drawing.Path {
    let path = new drawing.Path();
    // topLeftPath
    let topLeftPath = paths[0]
    if (topLeftPath) {
      path.moveTo(topLeftPath.startX, topLeftPath.startY);
      path.quadTo(topLeftPath.ctrX, topLeftPath.ctrY, topLeftPath.endX, topLeftPath.endY)
    } else {
      path.moveTo(rect.left, rect.top)
    }
    let topRightPath = paths[1]

    if (topRightPath) {
      path.lineTo(topRightPath.startX, topRightPath.startY)
      path.quadTo(topRightPath.ctrX, topRightPath.ctrY, topRightPath.endX, topRightPath.endY)
    } else {
      path.lineTo(rect.right, rect.top)
    }
    let bottomRightPath = paths[2]
    if (bottomRightPath) {
      path.lineTo(bottomRightPath.startX, bottomRightPath.startY)
      path.quadTo(bottomRightPath.ctrX, bottomRightPath.ctrY, bottomRightPath.endX, bottomRightPath.endY)
    } else {
      path.lineTo(rect.right, rect.bottom)
    }
    let bottomLeftPath = paths[3]
    if (bottomLeftPath) {
      path.lineTo(bottomLeftPath.startX, bottomLeftPath.startY)
      path.quadTo(bottomLeftPath.ctrX, bottomLeftPath.ctrY, bottomLeftPath.endX, bottomLeftPath.endY)
    } else {
      path.lineTo(rect.left, rect.bottom)
    }
    path.close()
    return path;
  }
}

