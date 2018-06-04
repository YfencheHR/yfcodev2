import { RouterModule, Routes} from '@angular/router';
import { IndexComponent } from './pages/index/index.component';


/* rutas en archivo usuario routes */
const APP_ROUTES: Routes = [
    { path: '', component: IndexComponent },
    { path: '**', pathMatch: 'full', redirectTo: '' }
];

export const APP_ROUTING = RouterModule.forRoot(APP_ROUTES, {useHash: true});
