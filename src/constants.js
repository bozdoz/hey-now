const DEFAULT_CHROMIUM_ARGS = [
  '--disable-gpu',
  '--renderer',
  '--no-sandbox',
  '--no-service-autorun',
  '--no-experiments',
  '--no-default-browser-check',
  '--disable-webgl',
  '--disable-threaded-animation',
  '--disable-threaded-scrolling',
  '--disable-in-process-stack-traces',
  '--disable-histogram-customizer',
  '--disable-gl-extensions',
  '--disable-extensions',
  '--disable-composited-antialiasing',
  '--disable-canvas-aa',
  '--disable-3d-apis',
  '--disable-accelerated-2d-canvas',
  '--disable-accelerated-jpeg-decoding',
  '--disable-accelerated-mjpeg-decode',
  '--disable-app-list-dismiss-on-blur',
  '--disable-accelerated-video-decode',
  '--num-raster-threads=1',
];

// eslint-disable-next-line import/prefer-default-export
module.exports.DEFAULT_CHROMIUM_ARGS = DEFAULT_CHROMIUM_ARGS;
