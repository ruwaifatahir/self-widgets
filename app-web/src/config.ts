import configProduction from './config.production';
import configLocal from './config.local';

let config = import.meta.env.VITE_APP_ENV === 'production' ? configProduction : configLocal;

export default config;
