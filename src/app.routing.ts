import { Routes, RouterModule } from '@angular/router';

import { FrontPageComponent } from './views/front-page/front-page.component';
import { PageViewComponent } from './views/page-view/page-view.component';
import { ProfileAdminComponent } from './views/profile-admin/profile-admin.component';
import { ProfileViewComponent } from './views/profile-view/profile-view.component';

const appRoutes: Routes = [
  {path: '',component: FrontPageComponent},
	
	{path: 'stranka/:id',component: PageViewComponent},

	{path: 'profil/:profile/admin/:module',component: ProfileAdminComponent},
	{path: 'profil/:profile/admin', redirectTo: 'profil/:profile/admin/uvod'},
	
	{path: 'profil/:profile/:module',component: ProfileViewComponent},
	{path: 'profil/:profile', redirectTo: 'profil/:profile/prehled'}
];

export const routing = RouterModule.forRoot(appRoutes);