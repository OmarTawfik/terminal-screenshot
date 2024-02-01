# terminal-screenshot

Render terminal ANSI output into images!

Under the hood, it uses [XTerm.js](https://www.npmjs.com/package/xterm) to render the terminal output to HTML, and [Puppeteer](https://www.npmjs.com/package/puppeteer) to capture a screenshot of the page.

## Usage (API)

```ts
import {renderScreenshot} from "terminal-screenshot";

const image = await renderScreenshot({
  data: "[[DATA]]", // Data to be render to the terminal.
  margin: 0, // Margin to leave around the terminal area in pixels. (default: 0)
  fontFamily: "Monaco", // Font family to use in terminal output. (default: Monaco)
  backgroundColor: "black", // Background color of the terminal. (default: black)
  type: "png", // Type of the screenshot to be generated. (default: png)
  colorScheme: "Tomorrow_Night", // colorScheme from https://github.com/ysk2014/xterm-theme/
});

await fs.writeFile(destination, image);
```

## Usage (CLI)

```bash
# Render command output
$(command) | terminal-screenshot --output screenshot.png

# Render ANSI string
terminal-screenshot --output screenshot.png --data "[[DATA]]"

# Print help options
terminal-screenshot --help
```

## CLI Options

```text
-d --data [string]                Data to be render to the terminal.
-m --margin [number]              Margin to leave around the terminal area in pixels. (default: 0)
-f --font-family [string]         Font family to use in terminal output. (default: Monaco)
-b --background-color [css-color] Background color of the terminal. (default: black)
-t --type [png|jpeg]              Type of the screenshot to be generated. (default: png)
-c --color-scheme [string]        Color scheme of the terminal, i.e. theme. (default: Tomorrow_Night)
-o --output [path]                Output path to save the screenshot to.
-h --help                         Display usage help.
```

## Examples

```bash
npx cfonts $'   terminal\nscreenshot' -g red,blue | terminal-screenshot --output foo.png
```

![foo](https://user-images.githubusercontent.com/15987992/118482566-c1245e80-b6c9-11eb-8c01-1e524dd0d7a3.png)

```bash
node ./plot-graph.js | terminal-screenshot --output foo.png
```

![foo](https://user-images.githubusercontent.com/15987992/118481223-15c6da00-b6c8-11eb-88f6-26ea878a09d4.png)

## Testing

You can also combine this library with the [jest-image-snapshot](https://www.npmjs.com/package/jest-image-snapshot) library to assert screenshots as snapshots in your Jest tests:

```ts
it("can render screenshots", async () => {
  const image = await renderScreenshot({data});
  expect(image).toMatchImageSnapshot();
});
```

## Support

Please use [GitHub Issues](https://github.com/OmarTawfik/terminal-screenshot/issues) to report any issues, or ask questions.
