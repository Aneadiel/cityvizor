import { Injectable } from '@angular/core';

import { ProfileModule } from '../profile.module';
import { DataService } from 'app/services/data.service';
import { Profile } from 'app/schema/profile';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: ProfileModule
})
export class ProfileService {

  profile = new ReplaySubject<Profile>(null);

  constructor(private dataService: DataService) { }

  setProfile(profileId) {
    this.dataService.getProfile(profileId).then(profile => this.profile.next(profile));
  }
}
