import { Component, OnInit, ViewChild } from '@angular/core';
import { AreaDataService } from "../../services/area-data.service";

import { Area } from "../../classes/area";
import { Route } from "../../classes/route";
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { AddClimbModalComponent } from '../add-climb-modal/add-climb-modal.component';
import { BsModalService } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styles: [
  ]
})
export class TableComponent implements OnInit{
  constructor(private areaDataService: AreaDataService, private modalService: BsModalService) {
    this.area = new Area();     //initializing area object      //initializing routes array
  }

  area: Area;
  page?: number;              //initializing page number
  pageSize: number = 10;         //initializing page size
  numOfRoutes: number = 0;       //initializing number of routes
  routes_to_display: Route[] = [];      //initializing routes array;
  modalRef: any;              //initializing modal reference


  
  openAddClimbModal(route: Route): void {
    console.log("openAddClimbModal() called", this.area, route);
  
    // Use the modal service to open the AddClimbModalComponent
    const initialState = {
      area: this.area,
      route: route
    };
  
    this.modalRef = this.modalService.show(AddClimbModalComponent, {
      initialState,
      class: 'modal-lg'
    });

    this.modalRef.content.modalRef = this.modalRef;
  }

  closeModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }


  pageChanged(event: PageChangedEvent): void {
    this.page = event.page;
    
    // Reset the routes_to_display array
    this.routes_to_display = [];

    // Calculate the starting index 
    let startIndex = (this.page - 1) * this.pageSize;
    let endIndex = Math.min(startIndex + this.pageSize, this.numOfRoutes);

    // Populate routes_to_display for the current page
    for (let i = startIndex; i < endIndex; i++) {
        this.routes_to_display.push(this.area.routes[i]);
    }
}


  ngOnInit() {
    this.areaDataService.getCurrentArea().subscribe(area => {
      if(area && area.routes) {
        this.area = area;   //writing the value of area to be used later in table.component.html
        this.numOfRoutes = this.area.routes.length;    //writing the number of routes to be used later in table.component.html
        this.routes_to_display = this.area.routes.slice(0, 10);    //initializing routes array
      }
    });
  }
}
