# Configuration of current application node

Current application using `nconf` package for manipulate configurations covered by `Config` service

You can call next code for receiving configuration 

```typescript
import * as ConfigService from '../../services/config'
import {Provider} from 'nconf'
const config: Provider = ConfigService.init()
console.log(config.get('server:url')) // will display server.url property from configuration object
```

### Configuration Hierarchy 

Configuration service can overload options based on Hierarchy of properties sources. Currently availabe next sources:

* `defaults` - available as object in configurations service. If that variables will not be set from other sources, default values vill be use
* `config.json` file - can be placed in the root of project directory in the same place with `package.json` file. Values from `config.json` file having are more higher priority instead of `defaults`
* `environment variables` - you can set any ENV variabales with `__` delimiter between sections. For example, for overloading `server:url` property, you need to set `SERVER__URL` environment variable. This section having are more higher priority instead of `config.json` file
* `argv` - it is an arguments passed to starting a node.js project. For example, you can override `server:port` property setting additional argument like `--server:port=8080` on starting node.js process. It is have a higer priority in hierarchy of values overloading

### Value types

All values will be try to be parsed in his own types. For example, ENV variable `SERVER__PORT=8080` will be parsed into number type, instead of `SERVER__URL=http://megaapp.com` that will be parsed into string 
