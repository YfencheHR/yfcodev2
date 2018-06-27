import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  public items: any = [
    {
      name: 'AA',
      id: 1
    },
    {
      name: 'BB',
      id: 2
    },
  ];
  public item: any =  {
    name: 'AA',
    id: 1
  };
  constructor() { }

  ngOnInit() {
  }
  changeSelect(event) {
    console.log(event);
  }

}
