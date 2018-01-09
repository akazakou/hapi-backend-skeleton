import * as Hapi from 'hapi'

export interface IPluginOptions {
}

export interface IPlugin {
  register (server: Hapi.Server, options?: IPluginOptions): Promise<any>

  info (): IPluginInfo
}

export interface IPluginInfo {
  name: string
  version: string
}
