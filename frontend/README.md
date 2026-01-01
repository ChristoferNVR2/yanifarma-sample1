# Setting Up ESLint and Prettier in WebStorm for a TypeScript Project

## Prerequisites

Before configuring ESLint and Prettier in WebStorm, ensure you have the following installed:

- **Node.js** (Download from [nodejs.org](https://nodejs.org/))
- **WebStorm** (Latest version recommended)
- **npm** or **yarn** (Comes with Node.js)
- **Git** (For version control and GitHub integration)

## 1. Clone the Repository

```sh
git clone https://github.com/ChristoferNVR2/vite-react-ts-configs.git
cd vite-react-ts-configs
```

## 2. Install Dependencies

Run the following command in the project root:

```sh
npm install  # or yarn install
```

## 3. Install ESLint and Prettier (If Not Installed)

If you haven't installed ESLint and Prettier globally in the project, install them with:

```sh
npm install --save-dev eslint prettier @eslint/js typescript typescript-eslint eslint-plugin-react eslint-config-prettier eslint-plugin-react-x eslint-plugin-react-dom
```

## 4. Configure ESLint in WebStorm

1. Open **WebStorm** and load the project.
2. Go to **File** > **Settings** (or **Preferences** on macOS).
3. Navigate to **Languages & Frameworks** > **JavaScript** > **Code Quality Tools** > **ESLint**.
4. Check **Enable**.
5. Choose **Manual ESLint Configuration**.
6. Set **ESLint package** to: `node_modules/eslint`.
7. Set **Configuration file** to `eslint.config.js`.
8. In the Extra eslint options field, type `--flag unstable_ts_config`.
9. Enable **Run eslint --fix on save**.
10. Click **Apply** and **OK**.

## 5. Configure Prettier in WebStorm

1. Go to **File** > **Settings** > **Languages & Frameworks** > **Prettier**.
2. Check **Enable Prettier**.
3. Choose **Manual Prettier Configuration**.
4. Set **Prettier package** to `node_modules/prettier`.
5. Set **Path to .prettierignore** to `.prettierignore`.
6. Enable **Run 'Reformat Code' action** (Ctrl + Alt + L).
7. Enable **Run on save** to automatically format files.
8. Click **Apply** and **OK**.

## 6. Run ESLint and Prettier Manually

To check for linting errors, run:

```sh
npx eslint .
```

To auto-fix issues, use:

```sh
npx eslint . --fix
```

To format code with Prettier, run:

```sh
npx prettier --write .
```

## 7. Add ESLint and Prettier Scripts to package.json

Add the following scripts to your `package.json`:

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write ."
  }
}
```

You can add other scripts as needed.\
This allows you to run linting and formatting commands easily.

## 8. Resources & Documentation

For further details on configuring ESLint and Prettier in WebStorm, check out the official documentation:

- [Prettier Configuration in WebStorm](https://prettier.io/docs/webstorm) – Official guide for setting up Prettier in WebStorm.
- [ESLint Configuration in WebStorm](https://www.jetbrains.com/help/webstorm/linting-typescript.html) – Official guide for enabling and configuring ESLint in WebStorm.
- [ESLint Official Documentation](https://eslint.org/docs/latest/user-guide/getting-started) – Learn more about ESLint's features and best practices.
- [Prettier Official Documentation](https://prettier.io/docs/en/index.html) – Complete guide to Prettier and its configuration options.


## Done!

Your WebStorm project is now configured with ESLint and Prettier.

