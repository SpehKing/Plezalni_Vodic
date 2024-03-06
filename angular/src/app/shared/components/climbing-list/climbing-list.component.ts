import { Component, OnInit } from '@angular/core';
import { AreaService } from '../../services/plezalisce.service';
import { ClimbingLocation } from '../../classes/climbing-location';
import { NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-climbing-list',
  template: `
    <!-- climbing-list.component.html -->
    <div *ngFor="let spot of climbingSpots" class="spot-container">
      <ngb-accordion #acc="ngbAccordion">
        <ngb-panel>
          <ng-template ngbPanelTitle>
            <h2 class="title" (click)="toggleInfo(spot)">{{ spot.name }}</h2>
          </ng-template>
          <ng-template ngbPanelContent>
            <p class="description">{{ spot.description | firstSentence }}.</p>
            <button class="btn btn-success" (click)="handleButtonClick(spot._id)">Več</button>
          </ng-template>
        </ngb-panel>
      </ngb-accordion>
    </div>
  `,
  styles: [`
    .spot-container {
      margin: 10px;
    }

    .title {
      cursor: pointer;
      font-size: 18px;
      color: #333;
      margin-bottom: 5px;
    }

    .description {
      margin-bottom: 10px;
      font-size: 14px;
      color: #555;
    }

    .btn {
      font-size: 14px;
    }
  `],
})
export class ClimbingListComponent implements OnInit {
  climbingSpots: ClimbingLocation[] | undefined = [];

  constructor(private areaService: AreaService, config: NgbAccordionConfig, private router: Router) {
    // customize default values of accordions used by this component tree
    config.closeOthers = true;
    config.type = 'info';
  }

  async ngOnInit(): Promise<void> {
    try {
      this.climbingSpots = await this.areaService.getAllAreas();
    } catch (error) {
      console.error('Error fetching climbing spots:', error);
    }
  }

  toggleInfo(spot: ClimbingLocation) {
    //console.log('Toggling info for spot:', spot);
    this.climbingSpots!.forEach((s) => {
      s.showInfo = s === spot ? !s.showInfo : false;
    });
  }

  handleButtonClick(id: string) {
    this.router.navigate(['/plezalisce', id]);
  }
}
