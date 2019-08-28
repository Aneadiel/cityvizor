import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { DataService } from 'app/services/data.service';
import { ToastService } from "app/services/toast.service";

import { environment } from "environments/environment";
import { Profile } from 'app/schema';

type ProfileWithSearchString = (Profile & { searchString?: string });

@Component({
	selector: 'profile-search',
	templateUrl: 'profile-search.component.html',
	styleUrls: ['profile-search.component.scss']
})
export class ProfileSearchComponent implements OnInit {

	profiles: ProfileWithSearchString[] = [];
	hoverProfile: Profile | null;
	search: RegExp;

	czechRepublicGPSBounds = { "lat": { "min": 48.5525, "max": 51.0556 }, "lng": { "min": 12.0914, "max": 18.8589 } };

	loading: boolean = false;

	constructor(private dataService: DataService, private toastService: ToastService, private router: Router) { }

	ngOnInit() {
		this.loadProfiles();
	}

	async loadProfiles() {

		this.loading = true;

		const profiles: ProfileWithSearchString[] = await this.dataService.getProfiles()

		this.loading = false;

		profiles.forEach(profile => {
			profile.searchString = this.cleanString(profile.name);
		});

		profiles.sort((a, b) => {
			if (a.status === "pending" && b.status !== "pending") return 1;
			if (a.status !== "pending" && b.status === "pending") return -1;
			return a.searchString!.localeCompare(b.searchString!); // cant be null, added searchString few lines before
		});
		this.profiles = profiles;

	}

	gps2css(gps_x, gps_y) {
		let bounds = this.czechRepublicGPSBounds;
		return {
			bottom: (gps_y - bounds.lat.min) / (bounds.lat.max - bounds.lat.min) * 100 + "%",
			left: (gps_x - bounds.lng.min) / (bounds.lng.max - bounds.lng.min) * 100 + "%"
		};
	}

	gps2string(gpsX, gpsY): string {
		if (!gpsX || !gpsY) return "";
		let gps = [gpsX, gpsY];
		let dg = gps.map(n => Math.round(n)); // get degrees
		let mn = gps.map(n => Math.round((n % 1) * 60 * 1000) / 1000); // get minutes
		let st = [0, 1].map(i => dg[i] + "° " + mn[i] + "'"); // get string
		return "N " + st[1] + ", E " + st[0]; // concatenate
	}

	cleanString(value: string): string {

		if (!value) return "";

		var sdiak = "áäčďéěíĺľňóôőöŕšťúůűüýřžÁÄČĎÉĚÍĹĽŇÓÔŐÖŔŠŤÚŮŰÜÝŘŽ";
		var bdiak = "aacdeeillnoooorstuuuuyrzAACDEEILLNOOOORSTUUUUYRZ";

		var searchString = "";

		for (var p = 0; p < value.length; p++) {
			if (sdiak.indexOf(value.charAt(p)) !== -1) searchString += bdiak.charAt(sdiak.indexOf(value.charAt(p)));
			else searchString += value.charAt(p);
		}

		searchString = searchString.toLowerCase();

		return searchString;

	}

	makeSearchString(value: string): RegExp {

		return new RegExp("(?:^| )" + this.cleanString(value));

	}

	openProfile(profile) {
		this.router.navigate(['/' + profile.url]);
	}

	openPending(profile, event: MouseEvent) {
		if (event.shiftKey) this.router.navigate(["/" + profile.url]);
		event.preventDefault();
	}

	getProfileAvatarUrl(profile) {
		return `url(${environment.api_root}/profiles/${profile.id}/avatar)`;
	}

}
