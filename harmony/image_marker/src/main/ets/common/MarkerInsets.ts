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

export class  MarkerInsets {
  private top: number;

  public setTop(value: number) {
    this.top = value;
  }

  public getTop(): number {
    return this.top;
  }

  private left: number;

  public setLeft(value: number) {
    this.left = value;
  }

  public getLeft(): number {
    return this.left;
  }

  private bottom: number;

  public setBottom(value: number) {
    this.bottom = value;
  }

  public getBottom(): number {
    return this.bottom;
  }

  private right: number;

  public setRight(value: number) {
    this.right = value;
  }

  public getRight(): number {
    return this.right;
  }

  constructor(top,left,bottom,right) {
    this.top =top
    this.left =left
    this.bottom =bottom
    this.right =right
  }

}
