/**
 * Graphic utility.
 */
import ICoordinate from '~/interfaces/ICoordinate';
import IRect from '~/interfaces/IRect';
import IDimensions from '~/interfaces/IDimensions';
import Color from '~/Color';

export default class {

  /**
   * Returns the intrinsic dimensions of the media element
   *
   * @param  {HTMLImageElement|HTMLVideoElement|ImageData} media
   * @return {{ width: number, height: number }}
   */
  public static getMediaDimensions(media: HTMLImageElement|HTMLVideoElement|ImageData): IDimensions {
    if (media instanceof HTMLImageElement) {
      return {
        width: media.naturalWidth,
        height: media.naturalHeight
      };
    } else if (media instanceof HTMLVideoElement) {
      return {
        width: media.videoWidth,
        height: media.videoHeight
      };
    } else {
      return {
        width: media.width,
        height: media.height
      };
    }
  }

  /**
   * Returns TRUE if the media element is loading a resource
   * 
   * @param  {HTMLImageElement|HTMLVideoElement} media
   * @return {boolean}
   */
  public static isMediaLoaded(media: HTMLImageElement|HTMLVideoElement): boolean {
    if (!(media instanceof HTMLImageElement) && !(media instanceof HTMLVideoElement)) throw new Error('Invalid argument element');
    return media instanceof HTMLImageElement ? media.complete : media.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA;
  }

  /**
   * Returns dimensions without borders and padding
   *
   * @param  {HTMLImageElement|HTMLVideoElement} media
   * @return {{ width: number, height: number }}
   */
  public static getInnerDimensions(media: HTMLImageElement|HTMLVideoElement): IDimensions {
    const style = getComputedStyle(media);
    const width = media.clientWidth - ( parseFloat(style.getPropertyValue('padding-left')) + parseFloat(style.getPropertyValue('padding-right')));
    const height = media.clientHeight - ( parseFloat(style.getPropertyValue('padding-top')) + parseFloat(style.getPropertyValue('padding-bottom')));
    return { width, height }
  }

  /**
   * Wait for media element resource to load
   * 
   * @param  {HTMLImageElement|HTMLVideoElement} media
   * @return {Promise<Event>}
   */
  public static awaitMediaLoaded(media: HTMLImageElement|HTMLVideoElement): Promise<Event> {
    return new Promise((resolve, reject) => {
      media.addEventListener('load', (event: Event) => {
        if (!event.currentTarget) return;
        resolve(event)
      }, { once: true });
      media.addEventListener('error', (event: Event) => {
        if (!event.currentTarget) return
        reject(event)
      }, { once: true });
    })
  }

  /**
   * Returns the coordinates of the rotated rectangle
   * 
   * @param  {number} x
   * @param  {number} y
   * @param  {number} width
   * @param  {number} height
   * @param  {number} degree
   * @return {ICoordinate[]}
   */
  public static getRotatedRectCoordinates(x: number, y: number, width: number, height: number, degree: number = 0): ICoordinate[] {
    let topLeft;
    let topRight;
    let bottomRight;
    let bottomLeft;
    if (degree !== 0) {
      const x2 = x + width / 2;
      const y2 = y + height / 2;
      topLeft = this.getRotationCoordinate(x, y, x2, y2, degree);
      topRight = this.getRotationCoordinate(x + width, y, x2, y2, degree);
      bottomRight = this.getRotationCoordinate(x + width, y + height, x2, y2, degree);
      bottomLeft = this.getRotationCoordinate(x, y + height, x2, y2, degree);
    } else {
      topLeft = { x, y };
      topRight = { x: x + width, y };
      bottomRight = { x: x + width, y: y + height };
      bottomLeft = { x, y: y + height };
    }
    return [
      topLeft,
      topRight,
      bottomRight,
      bottomLeft
    ];
  }

  /**
   * Returns rotated coordinates
   * 
   * @param  {number} x1
   * @param  {number} y2
   * @param  {number} x2
   * @param  {number} y2
   * @param  {number} degree
   * @return {ICoordinate} coordinate Coordinate after rotation
   */
  private static getRotationCoordinate(x1: number, y1: number, x2: number, y2: number, degree: number): ICoordinate {
    const radian = degree * (Math.PI / 180);
    const sin = Math.sin(radian); 
    const cos = Math.cos(radian);
    return {
      x: cos * (x1 - x2) - sin * (y1 - y2) + x2,
      y: sin * (x1 - x2) + cos * (y1 - y2) + y2
    };
  }

  /**
   * Returns the center coordinates
   * 
   * @param  {ICoordinate[]} coordinates
   * @return {ICoordinate} coordinate Center coordinates
   */
  public static getCenterCoordinate(...coordinates: ICoordinate[]): ICoordinate {
    const coordinate = coordinates.reduce((coordinate, { x, y }) => {
      coordinate.x += x;
      coordinate.y += y;
      return coordinate;
    }, {x: 0, y: 0});
    coordinate.x /= coordinates.length;
    coordinate.y /= coordinates.length;
    return coordinate;
  }

  /**
   * Returns the angle between two coordinates
   * 
   * @param  {number} x1
   * @param  {number} y1
   * @param  {number} x2
   * @param  {number} y2
   * @return {number}
   */
  public static getAngleBetweenCoordinates(x1: number, y1: number, x2: number, y2: number): number {
    const radian = Math.atan2(y2 - y1, x2 - x1);
    const degree = radian * 180 / Math.PI;
    // const radian = Math.atan2(x2 - x1, y2 - y1);
    // let  degree = radian * 360 / (2 * Math.PI);
    // if (degree < 0) degree += 360;
    return degree;
  }

  /**
   * Returns the distance between two coordinates
   * 
   * @param  {number} x1
   * @param  {number} y1
   * @param  {number} x2
   * @param  {number} y2
   * @return {number}
   */
  public static getDistance(x1: number, y1: number, x2: number, y2: number): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  /**
   * Returns a bounding box that covers the container considering the "object-fit" css property
   * 
   * @param  {HTMLElement}                       container
   * @param  {HTMLImageElement|HTMLVideoElement} media
   * @return {IRect}
   */
  public static getOverlayRect(container: HTMLElement, media: HTMLImageElement|HTMLVideoElement): IRect {
    const { width: rawWidth, height: rawHeight } = this.getMediaDimensions(media);
    const fit = getComputedStyle(media).getPropertyValue('object-fit');
    const style = getComputedStyle(container);
    const visibleWidth =
      parseFloat(style.getPropertyValue('width')) -
      parseFloat(style.getPropertyValue('padding-right')) -
      parseFloat(style.getPropertyValue('border-right-width')) -
      parseFloat(style.getPropertyValue('padding-left')) -
      parseFloat(style.getPropertyValue('border-left-width'));
    const visibleHeight =
      parseFloat(style.getPropertyValue('height')) -
      parseFloat(style.getPropertyValue('padding-top')) -
      parseFloat(style.getPropertyValue('border-top-width')) -
      parseFloat(style.getPropertyValue('padding-bottom')) -
      parseFloat(style.getPropertyValue('border-bottom-width'));
    const visibleY =
      parseFloat(style.getPropertyValue('padding-top')) +
      parseFloat(style.getPropertyValue('border-top-width')) +
      parseFloat(style.getPropertyValue('margin-top'));
    const visibleX =
      parseFloat(style.getPropertyValue('padding-left')) +
      parseFloat(style.getPropertyValue('border-left-width')) +
      parseFloat(style.getPropertyValue('margin-left'));

    if (/^(contain|cover|scale-down)$/.test(fit)) {
      const hRatio = visibleWidth / rawWidth;
      const vRatio = visibleHeight / rawHeight;
      const ratio = /^(contain|scale-down)$/.test(fit) ? Math.min(hRatio, vRatio) : Math.max(hRatio, vRatio);
      const cx = ( visibleWidth - rawWidth * ratio ) / 2;
      const cy = ( visibleHeight - rawHeight * ratio ) / 2;
      return {
        x: visibleX + cx,
        y: visibleY + cy,
        width: rawWidth * ratio,
        height: rawHeight * ratio
      };
    } else {
      return {
        x: visibleX,
        y: visibleY,
        width: visibleWidth,
        height: visibleHeight
      };
    }
  }

  /**
   * Returns the display dimensions and position of the media element
   * 
   * @param  {HTMLImageElement|HTMLVideoElement} media
   * @return {IRect} rect Display size and position of media element
   *          x                 : The horizontal position of the left-top point where the sourceFrame should be cut,
   *          y                 : The vertical position of the left-top point where the sourceFrame should be cut,
   *          width             : How much horizontal space of the sourceFrame should be cut,
   *          height            : How much vertical space of the sourceFrame should be cut,
   *          destinationX      : The percentage of the horizontal position of the left-top point on the printFrame where the image will be printed, relative to the printFrame width,
   *          destinationY      : The percentage of the vertical position of the left-top point on the printFrame where the image will be printed, relative to the printFrame height,
   *          destinationWidth  : The percentage of the printFrame width on which the image will be printed, relative to the printFrame width,
   *          destinationHeight : The percentage of the printFrame height on which the image will be printed, relative to the printFrame height.
   */
  public static getRenderedRect(media: HTMLImageElement|HTMLVideoElement): IRect {
    const fit = getComputedStyle(media).getPropertyValue('object-fit');
    const position = getComputedStyle(media).getPropertyValue('object-position').split(' ');
    const { width: rawWidth, height: rawHeight } = this.getMediaDimensions(media);
    const rawRatio = rawWidth / rawHeight;
    const visibleWidth = media.clientWidth;
    const visibleHeight = media.clientHeight;
    const visibleRatio = visibleWidth / visibleHeight;
    const hPercentage = parseInt(position[0]) / 100;
    const vPercentage = parseInt(position[1]) / 100;
    let width = 0;
    let height = 0;
    let x = 0;
    let y = 0;
    let destinationWidth = 1;
    let destinationHeight = 1;
    let destinationX = 0;
    let destinationY = 0;
    if (fit === 'none') {
      width = visibleWidth;
      height = visibleHeight;
      x = (rawWidth - visibleWidth) * hPercentage;
      y = (rawHeight - visibleHeight) * vPercentage;
    } else if (fit === 'contain' || fit === 'scale-down') {
      // TODO: handle the 'scale-down' appropriately, once its meaning will be clear
      width = rawWidth;
      height = rawHeight;
      if (rawRatio > visibleRatio) {
        destinationHeight = (rawHeight / visibleHeight) / (rawWidth / visibleWidth);
        destinationY = (1 - destinationHeight) * vPercentage;
      } else {
        destinationWidth = (rawWidth / visibleWidth) / (rawHeight / visibleHeight);
        destinationX = (1 - destinationWidth) * hPercentage;
      }
    } else if (fit === 'cover') {
      if (rawRatio > visibleRatio) {
        width = rawHeight * visibleRatio;
        height = rawHeight;
        x = (rawWidth - width) * hPercentage;
      } else {
        width = rawWidth;
        height = rawWidth / visibleRatio;
        y = (rawHeight - height) * vPercentage;
      }
    } else if (fit === 'fill') {
      width = rawWidth;
      height = rawHeight;
    } else {
      console.error(`Unexpected object-fit attribute with value ${fit} relative to`);
    }
    return {
      x,
      y,
      width,
      height,
      destinationX,
      destinationY,
      destinationWidth,
      destinationHeight
    };
  }

  /**
   * Draw points
   * 
   * @param  {HTMLCanvasElement} canvas
   * @param  {number} x
   * @param  {number} y
   * @param  {number} options.radius
   * @param  {string} options.color
   * @return {void}
   */
  public static drawPoint(canvas: HTMLCanvasElement, x: number, y: number, { radius = 3, color = Color.accessibleBlue }: { radius?: number, color?: string } = {}): void {
    const ctx = canvas.getContext('2d')!;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = color;
    ctx.fill();
  }

  /**
   * Draw center point
   * 
   * @param  {HTMLCanvasElement} canvas
   * @param  {ICoordinate[]} coordinates
   * @param  {number} options.radius
   * @param  {string} options.color
   * @return {void}
   */
  public static drawCenterPoint(canvas: HTMLCanvasElement, coordinates: ICoordinate[], { radius = 3, color = Color.accessibleBlue }: { radius?: number, color?: string } = {}): void {
    const { x, y } = this.getCenterCoordinate(...coordinates);
    this.drawPoint(canvas, x, y, { radius, color });
  }

  /**
   * Draw rectangle
   * 
   * @param  {HTMLCanvasElement} canvas
   * @param  {number} x
   * @param  {number} y
   * @param  {number} width
   * @param  {number} height
   * @param  {number} options.degree
   * @param  {number} options.lineWidth
   * @param  {string} options.lineColor
   * @param  {number} options.shadowBlur
   * @param  {string} options.shadowColor
   * @return {void}
   */
  public static drawRectangle(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    width: number,
    height: number,
    {
      degree = 0,
      lineWidth = 2,
      lineColor = Color.accessibleBlue,
      shadowBlur = 0,
      shadowColor = Color.accessibleBlue,
      fill = undefined
    }: {
      degree?: number,
      lineWidth?: number,
      lineColor?: string,
      shadowBlur?: number,
      shadowColor?: string,
      fill?: string
    } = {}
  ): void {
    const corners = this.getRotatedRectCoordinates(x, y, width, height, degree);
    const ctx = canvas.getContext('2d')!;
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = lineWidth ? lineColor : 'transparent';
    if (shadowBlur) {
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowColor = shadowColor;
    }
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    ctx.lineTo(corners[1].x, corners[1].y);
    ctx.lineTo(corners[2].x, corners[2].y);
    ctx.lineTo(corners[3].x, corners[3].y);
    ctx.closePath();
    ctx.stroke();
    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }
  }

  /**
   * Draw rectangle corners
   * 
   * @param  {HTMLCanvasElement} canvas
   * @param  {number} x
   * @param  {number} y
   * @param  {number} width
   * @param  {number} height
   * @param  {number} options.lineWidth
   * @param  {string} options.lineColor
   * @param  {number} options.shadowBlur
   * @param  {string} options.shadowColor
   * @return {void}
   */
  public static drawRectangleCorners(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    width: number,
    height: number,
    {
      lineWidth = 2,
      lineColor = Color.accessibleBlue,
      shadowBlur = 0,
      shadowColor = Color.accessibleBlue
    }: {
      lineWidth?: number,
      lineColor?: string,
      shadowBlur?: number,
      shadowColor?: string
    } = {}
  ): void {
    const ctx = canvas.getContext('2d')!;
    if (lineWidth) {
      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineWidth;
    }
    if (shadowBlur) {
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
      ctx.shadowBlur = shadowBlur;
      ctx.shadowColor = shadowColor;
    }
    const corner = Math.min(width, height) / 4;
    ctx.beginPath();
    ctx.moveTo(x, y + corner);
    ctx.lineTo(x, y);
    ctx.lineTo(x + corner, y);
    ctx.moveTo(x + width - corner, y);
    ctx.lineTo(x + width, y);
    ctx.lineTo(x + width , y + corner);
    ctx.moveTo(x, y + height - corner);
    ctx.lineTo(x, y + height);
    ctx.lineTo(x + corner, y + height);
    ctx.moveTo(x + width - corner, y + height);
    ctx.lineTo(x + width, y + height);
    ctx.lineTo(x + width, y + height - corner);
    ctx.stroke();
  }

  /**
   * Clear canvas
   * 
   * @return {void}
   */
  public static clearCanvas(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d')!;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  /**
   * Flip horizontally
   * 
   * @param {HTMLCanvasElement} canvas
   * @return {void}
   */
  public static flipHorizontal(canvas: HTMLCanvasElement): void {
    const ctx = canvas.getContext('2d')!;
    const data = ctx.getImageData(0,0, canvas.width, canvas.height);
    // Traverse every row and flip the pixels
    for (let i=0; i<data.height; i++) {
     // We only need to do half of every row since we're flipping the halves
      for (let j=0; j<data.width/2; j++) {
        const index = (i * 4) * data.width + (j * 4);
        const mirrorIndex = ((i + 1) * 4) * data.width - ((j + 1) * 4);
        for (let k=0; k<4; k++) {
          let temp = data.data[index + k];
          data.data[index + k] = data.data[mirrorIndex + k];
          data.data[mirrorIndex + k] = temp;
        }
      }
    }
    ctx.putImageData(data, 0, 0, 0, 0, data.width, data.height);
  }
}