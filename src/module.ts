import { join } from "path";
import { Module } from "@nuxt/types";
import Vue from "vue";

import { name, version } from "../package.json";
import WebSocketManager from "./templates/WebSocketManager";

export interface ModuleOptions {
  uri: string;
}

const CONFIG_KEY = "websocket";

const websocketModule: Module<ModuleOptions> = function (moduleOptions) {
  const options = Object.assign(this.options[CONFIG_KEY] || {}, moduleOptions);

  const templatePath = join("src", "templates");

  this.addTemplate({
    src: join(templatePath, "WebSocketManager.ts"),
    fileName: join("nuxt-websocket", "WebSocketManager.ts"),
    options,
  });

  // Register plugin
  this.addPlugin({
    src: join(templatePath, "plugin.ts"),
    fileName: join("nuxt-websocket", "websocket.client.ts"),
    options,
  });
};

(websocketModule as any).meta = { name, version };

declare module "@nuxt/types" {
  interface NuxtConfig {
    $socket: Vue;
    $socketManager: WebSocketManager;
  } // Nuxt 2.14+
  interface Configuration {
    $socket: Vue;
    $socketManager: WebSocketManager;
  } // Nuxt 2.9 - 2.13
}

declare module "vue/types/vue" {
  interface Vue {
    $socket: Vue;
    $socketManager: WebSocketManager;
  }
}

export default websocketModule;
