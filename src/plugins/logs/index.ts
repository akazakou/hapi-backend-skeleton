import { IPlugin } from '../interfaces'
import * as Hapi from 'hapi'
import * as Log from '../../services/logs'

const good = require('good')

export default (): IPlugin => {
  return {
    register: (server: Hapi.Server): Promise<any> => {
      return server.register({
        plugin: good,
        options: {
          ops: false,
          reporters: {
            winston: [{
              module: 'good-winston',
              args: [{
                log: '*',
                response: '*',
                winston: Log.init()
              }]
            }]
          }
        }
      })
    },
    info: () => {
      return {
        name: 'Winston Logger',
        version: '1.0.0'
      }
    }
  }
}
