import './styles/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap';
import { navbar } from './components/navbar.js';
import { footer } from './components/footer.js';
import { initRouter, router } from './router/router.js';

navbar();
footer();
initRouter();
