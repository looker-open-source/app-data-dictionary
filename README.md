# Data Dictionary Extension

## Usage

- Install dependencies with Yarn: `yarn install`
- To run a development server: `yarn start`

  In manifest for a LookML project on your Looker instance:

  ```
  application: data-dictionary-dev {
    label: "Data Dictionary (dev)"
    uri: "http://localhost:8080/bundle.js"
    entitlements: {
      local_storage: yes
      navigation: yes
      new_window: yes
      core_api_methods: ["run_inline_query", "lookml_model_explore", "all_lookml_models", "all_users", "me", "search_groups"]
    }
  }
  ```

  And you will also need to add a dummy model to the project.

  ```
    connection: "thelook"
  ```

- To do a build: `yarn build` (You should commit the built file.)

# Looker Data Dictionary Extension

It uses [React](https://reactjs.org/) and [TypeScript](https://www.typescriptlang.org/) for writing your extension, the [React Extension SDK](https://github.com/looker-open-source/extension-sdk-react) for interacting with Looker, and [Webpack](https://webpack.js.org/) for building your code.

## Getting Started for Development

1. Clone or download a copy of this repo to your development machine
2. Navigate (`cd`) to the template directory on your system
3. Install the dependencies with [Yarn](https://yarnpkg.com/).

   ```
   yarn install
   ```

   > You may need to update your Node version or use a [Node version manager](https://github.com/nvm-sh/nvm) to change your Node version.

4. Start the development server

   ```
   yarn develop
   ```

   The extension is now running and serving the JavaScript at http://localhost:8080/bundle.js.

5. Now log in to Looker and create a new project.

   This is found under **Develop** => **Manage LookML Projects** => **New LookML Project**.

   You'll want to select "Blank Project" as your "Starting Point". You'll now have a new project with no files.

6. In your copy of the extension tablet you have `manifest.lkml` file.

   You can either drag & upload this file into your Looker project, or create a `manifest.lkml` with the same content. Change the `id`, `label`, or `url` as needed.

   ```
   application: data-dictionary {
     label: "Data Dictionary"
     url: "http://localhost:8080/bundle.js"
     entitlements: {
       local_storage: yes
       navigation: yes
       new_window: yes
       core_api_methods: ["run_inline_query", "lookml_model_explore", "all_lookml_models", "all_users", "me", "search_groups"]
     }
   }
   ```

7. Create a `model` LookML file in your project. Use the name of the project as the model name (this is a convention).

   - Add a connection in this model. It can be any connection, it doesn't matter which.
   - [Configure the model you created](https://docs.looker.com/data-modeling/getting-started/create-projects#configuring_a_model) so that it has access to some connection.

8. Connect your new project to Git.

9. Commit your changes and deploy your them to production through the Project UI.

10. Reload the page and click the `Browse` dropdown menu. You should see your extension in the list.
    - The extension will load the JavaScript from the `url` you provided in the `application` definition/
    - Reloading the extension page will bring in any new code changes from the extension template. (Webpack's hot reloading is not currently supported.)

## Deployment

The process above requires your local development server to be running to load the extension code. To allow other people to use the extension, we can build the JavaScript file and include it in the project directly.

1. In your extension project directory on your development machine you can build the extension with `yarn build`.
2. Drag and drop the generated `dist/bundle.js` file into the Looker project interface
3. Modify your `manifest.lkml` to use `file` instead of `url`:
   ```
   application: data-dictionary {
    label: "Data Dictionary"
    uri: "http://localhost:8080/bundle.js"
    entitlements: {
      local_storage: yes
      navigation: yes
      new_window: yes
      core_api_methods: ["run_inline_query", "lookml_model_explore", "all_lookml_models", "all_users", "me", "search_groups"]
    }
   }
   ```
