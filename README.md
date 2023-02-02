# ProxyChecker

A lightweight, customizable and user-friendly proxy checker built with [Tauri](https://tauri.app/) + [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/). And just as importantly, you'll find an anime girl in the background, which adds a touch of personality to the app and makes your work less boring.

## Features

- Supports any proxy patterns with any separators (e.g. `ip:port`, `ip:port@login:password`, etc.)
- Customizable settings for proxy pattern (described above), default protocol, request url and timeout
- Beautiful logs, saving settings to a file, themes, and more (actually, that's all for now)

## Usage

1. Select a file containing your proxies
2. Utilize the settings to change the pattern, default protocol, request url and timeout
3. Check your proxies with ease!

## Release

You can download the latest version of the application on Windows, MacOS, or Ubuntu 20.04 in the [**releases**](https://github.com/quertc/ProxyChecker/releases) section of this repository.

## TODO

- Improve error handling on the frontend
- Handle errors when unwrapping mutexes
- Improve performance and optimize the app
- Add a selection of different delimiters in the file (not just \n)
- Add the ability to drag and drop a file
- Refactor small things (comments)

## Recommended IDE Setup for development

- [VS Code](https://code.visualstudio.com/) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
