import express, { Express, type Router } from 'express';
import { Options, OptionsText, OptionsJson, OptionsUrlencoded } from 'body-parser';
import cors, { CorsOptions } from 'cors';

interface CreateAppOptions {
  raw?: Options;
  text?: OptionsText;
  json?: OptionsJson;
  urlencoded?: OptionsUrlencoded;
  cors?: CorsOptions;
}

const createApp = ( router: Router, options: CreateAppOptions={}): Express => {
  const app = express();

  app.use( express.raw( options.raw ) );
  app.use( express.text( options.text ) );
  app.use( express.urlencoded( options.urlencoded ) );
  app.use( express.raw( options.raw ) );
  app.use( cors( options.cors ) );
  app.use( router );

  return app;
};

export default createApp;