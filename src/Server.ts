import fastify, { FastifyInstance } from "fastify";
import fastifyNext from "fastify-nextjs";
import { PORT } from './constants';

export default class {
  private app: FastifyInstance

  constructor() {
    require('dotenv').config()
    this.app = fastify({
      logger: true,
      pluginTimeout: 1200000
    })
    this.setup()
    this.app.listen(PORT, '0.0.0.0', () => {
      this.app.log.info("server started...")
    })
  }

  setup() {
    let app = this.app
    app.register(fastifyNext, {
      dev: true,
      logLevel: 'debug',
      noServeAssets: false
    }).after((err) => {
      if (err) {
        console.error(err);
        process.exit(1);
      }
      app.next('/')
      app.next('/main')
    })
    app.register
  }
}
