import { IPlugin } from '../interfaces'
import * as Config from '../../services/config'
import * as Hapi from 'hapi'
import * as Url from 'url'

const config = Config.init()

export default (): IPlugin => {
  return {
    register: (server: Hapi.Server): Promise<any> => {
      const packageInfo = require(`${process.cwd()}/package.json`)

      return server.register([
        require('inert'),
        require('vision'),
        {
          plugin: require('hapi-swagger'),
          options: {
            debug: true,
            info: {
              title: packageInfo.title,
              description: packageInfo.description,
              version: packageInfo.version
            },
            grouping: 'tags',
            tags: [
              {
                name: 'auth',
                description: 'Api interface for manipulate User Authorization'
              },
              {
                name: 'user',
                description: 'Api interface for manipulate User Entity'
              },
              {
                name: 'profile',
                description: 'Api interface for manipulate User Profile Entity'
              }
            ],
            documentationPath: '/',
            host: Url.parse(config.get('server:url')).host,
          }
        }
      ])
    },
    info: () => {
      return {
        name: 'Swagger Documentation',
        version: '0.0.1'
      }
    }
  }
}
