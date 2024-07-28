# Admin Manager

Admin Manager is a comprehensive administrative management tool designed to streamline the process of managing invoices, revenues, tasks, and more. This project uses Tauri and React for building the application.

## Features

- **Invoice Management**: Create, update, delete, and track invoices.
- **Revenue Tracking**: Keep track of revenues with detailed records.
- **Task Management**: Manage tasks with a calendar view and detailed task list.
- **Administrative Document Handling**: Store and manage administrative documents.

## Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/)
- [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode)
- [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)

## Prerequisites

Ensure you have the following installed on your system:

- [Node.js](https://nodejs.org/) (>=14.x)
- [Yarn](https://yarnpkg.com/)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI](https://tauri.app/v1/guides/getting-started/prerequisites)

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/admin-manager.git
cd admin-manager
yarn install
```

## Project Structure

- `src/`: React components and application logic.
- `src-tauri/`: Tauri configuration and Rust backend.
- `public/`: Static assets.
- `dist/`: Production build output.

## Scripts

- `yarn dev`: Start the development server.
- `yarn build`: Build the React application.
- `yarn tauri dev`: Run the Tauri application in development mode.
- `yarn tauri build`: Build the Tauri application for production.

## Contributing

Feel free to contribute to this project by opening issues or submitting pull requests.

## License

This project is licensed under the MIT License.