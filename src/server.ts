import App from '@/app';
import AuthRoute from '@routes/auth.route';
import IndexRoute from '@routes/index.route';
import validateEnv from '@utils/validateEnv';
import InterestRoute from '@routes/interest.route';
import ModuleRoute from '@routes/module.route';

validateEnv();

const app = new App([new IndexRoute(), new AuthRoute(), new InterestRoute(), new ModuleRoute()]);

app.listen();
