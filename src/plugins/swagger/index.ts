import { IPlugin } from '../interfaces'
import * as Hapi from 'hapi'

export default (): IPlugin => {
  return {
    register: (server: Hapi.Server): Promise<any> => {
      const packageInfo = require(`${global.__basedir}/package.json`)

      return server.register([
        require('inert'),
        require('vision'),
        {
          plugin: require('hapi-swagger'),
          options: {
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
            documentationPath: '/'
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
