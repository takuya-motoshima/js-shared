# Changelog

## [1.0.4] - 2020-12-21

- Added a module to operate the clipboard.

    ```js
    import { Clipboard } from 'js-shared';

    // Save the string to the clipboard.
    await Clipboard.save('Hello, World!');
    ````

## [1.0.3] - 2020-09-04

- Add fill option to rectangle drawing method of Graphics module

    ![system-color.png](https://raw.githubusercontent.com/takuya-motoshima/js-shared/master/screencap/draw-rectangle.png)

    ```js
    // <canvas id="myCanvas" width=300 height=200 style="border: 1px solid #d3d3d3;"></canvas>

    import { Graphics } from 'js-shared';

    const canvas = document.querySelector('#myCanvas');

    const x = 50;
    const y = 80;
    const width = 100;
    const height 20;

    // Draw only rectangular lines。
    Graphics.drawRectangle(canvas, x, y, width, height, {
      lineColor: 'blue'
    });

    // Fill the rectangle.
    Graphics.drawRectangle(canvas, x, y, width, height, {
      fill: 'gold',
      degree: 45,
      lineWidth: 0
    });
    ```

## [1.0.2] - 2020-07-20

- Added cookie utility.

## [1.0.1] - 2020-07-20

- Added CHANGELOG.md.
- Fixed README typo.

## [1.0.0] - 2020-07-20

Released.
