import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';

const skills = ['Hairdresser', 'Web Developer', 'Project Manager', 'Mobile Developer', 'CEO', 'CTO'];
// tslint:disable-next-line:max-line-length
const cities = ['Sydney', 'Melbourne', 'Perth', 'Brisbane', 'Adelaide', 'Canberra', 'Hobart', 'Darwin', 'Gold Coast', 'Cairns', 'Wollongong', 'Newcastle', 'Townsville', 'Alice Springs', 'Bendigo', 'Launceston', 'Geelong', 'Albury', 'Ballarat', 'Mackay'];

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  recommendationForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.recommendationForm = new FormGroup({
      skill: new FormControl('', Validators.required),
      location: new FormControl({
        value: 'Any City',
        disabled: true
      }),
      isLocation: new FormControl(true)
    });

    this.isLocation.valueChanges.subscribe(value => this.changeInput(value));
  }

  autoSearch(name: string, text$: Observable<string>) {
    return text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      map(term => {
        if (term.length < 2) {
          return [];
        } else {
          const array = name === 'searchSkill' ? skills : cities;
          return array.filter(v => v.toLowerCase().indexOf(term.toLowerCase()) > -1).slice(0, 10);
        }
      })
    );
  }

  searchSkill = (text$: Observable<string>) => {
    return this.autoSearch('searchSkill', text$);
  }

  searchLocation = (text$: Observable<string>) => {
    return this.autoSearch('searchLocation', text$);
  }

  submitForm() {
    console.log(this.recommendationForm.value);
  }

  changeInput(val: boolean) {
    const { controls: { location } } = this.recommendationForm;
    if (val) {
      this.recommendationForm.patchValue({location: 'Any City'});
      location.disable();
    } else {
      this.recommendationForm.patchValue({location: ''});
      location.enable();
    }
  }

  get isLocation() {
    return this.recommendationForm.get('isLocation');
  }
}
