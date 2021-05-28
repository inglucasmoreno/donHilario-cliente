import { Component, OnInit } from '@angular/core';

import { DataService } from 'src/app/services/data.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-statebar',
  templateUrl: './statebar.component.html',
  styles: [
  ]
})
export class StatebarComponent implements OnInit {

  constructor(public dataService: DataService) { }

  ngOnInit(): void {}

}
