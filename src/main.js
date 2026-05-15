import './styles/styles.css';
import '/node_modules/bootstrap-icons';
import '/node_modules/bootstrap';
import { navbar } from './components/navbar.js';
import { footer } from './components/footer.js';
import { initRouter, router } from './router/router.js';

navbar();
footer();
initRouter();
