import { Component, Input, OnInit, TemplateRef, ChangeDetectorRef, SimpleChanges, OnChanges } from "@angular/core";
import { BsModalService, BsModalRef } from "ngx-bootstrap/modal";
import { UserDataService } from "../../services/user-data.service";
import { AreaDataService } from "../../services/area-data.service";
import { AuthService } from "../../services/auth.service";
import { ChartService } from "../../services/chart.service";
import { AreaService } from '../../services/plezalisce.service';
import { Climb } from "../../classes/climb";
import { Route } from "../../classes/route";
import { ClimbingLocation } from "../../classes/climbing-location";

/*DISCLAIMER!
  This component is very poorly writen due to and need to mostly be rewriten 
  mostly due to the climb.area being stored as string and not as an object.
*/

@Component({
  selector: "app-user-climbs",
  templateUrl: "./user-climbs.component.html",
  styles: [],
})
export class UserClimbsComponent implements OnInit {
  
  climbingAreas: ClimbingLocation[] | undefined = [];

  modalRef?: BsModalRef;
  @Input() userId!: string;
  climbs: Climb[] = [];

  protected formData: any = {
    climbName: "",
    areaName: "",
    routeName: "",
    date: "",
  };

  errorMessage: string | null = null;
  selectedRouteId: string = "";

  routes: Route[] = [];
  isDataLoaded: boolean = false;

  constructor(
    private userDataService: UserDataService,
    private areaDataService: AreaDataService,
    private AreaService: AreaService,
    private modalService: BsModalService,
    private authService: AuthService,
    private chartService: ChartService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngOnInit() {
    console.log("Received userId in init:", this.userId);
    this.loadUserClimbs();
    this.setDefaultDate();
    try {
      this.climbingAreas = await this.AreaService.getAllAreas();
    } catch (error) {
      console.error('Error fetching climbing spots:', error);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detect changes in userId and reload data and recreate the chart
    if (changes["userId"]) {
      this.loadUserClimbs();
    }
  }


  protected openModal(form: TemplateRef<any>) {
    this.modalRef = this.modalService.show(form, {
      class: "modal-dialog-centered",
    });
  }

  getAreaId(areaName: string): string {
    if (!this.climbingAreas) {
      console.error('getAreaId error: climbingAreas is not defined or empty');
      return "";
    }
    const foundArea = this.climbingAreas.find((a) => a.name === areaName);
    if (!foundArea) {
      console.error(`getAreaId error: Area with name ${areaName} not found in climbingAreas`);
    }
    return foundArea ? foundArea._id : "";
  }

  trackByClimbId(index: number, climb: Climb): string {
    return climb._id;
  }

  //Will be only possiblee for the user who created the climb
  deleteClimb(climbId: string) {
    console.log("Deleting climb::::", climbId);
    this.userDataService.deleteClimb(this.userId, climbId).subscribe({
      next: (response: any) => {
        console.log("Climb deleted successfully:", response);
        // Remove the deleted climb from the climbs array
        this.climbs = this.climbs.filter((climb) => climb._id !== climbId);
        // Sort the climbs array after deletion
        this.climbs.sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
        this.chartService.triggerChartRefresh();
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error("Error deleting climb:", error);
      },
    });
  }

  loadUserClimbs() {
    this.userDataService.getUserClimb(this.userId).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.climbs) {
          this.climbs = response.climbs;
          this.climbs.forEach((climb) => {
            this.areaDataService
              .getAreaName(climb.area)
              .subscribe((areaName) => {
                climb.areaName = areaName;
              });
          });
          this.climbs.sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
          );
        } else {
          this.climbs = []; // Ensure that climbs is always an array
        }
        this.isDataLoaded = true;
      },
      error: (error) => {
        console.log("This user has no climbs yet:", error);
        this.climbs = []; // Ensure that climbs is always an array in case of an error
        this.isDataLoaded = true;
      },
    });
  }

  loadRoutesForArea() {
    if (!this.climbingAreas) {
      console.error('getAreaId error: climbingAreas is not defined or empty');
      return "";
    }
    const selectedArea = this.climbingAreas.find(
      (area) => area.name === this.formData.areaName
    );

    if (selectedArea && "_id" in selectedArea) {
      const selectedAreaId = selectedArea._id as string;
      console.log("Selected Area ID:", selectedAreaId);

      // Now you can use selectedAreaId to fetch routes or perform other actions
      this.areaDataService
        .getRoutesForArea(selectedAreaId)
        .subscribe((areaData) => {
          this.routes = areaData.routes;
          console.log("Routes:", this.routes);
        });
    } else {
      console.error(
        "Selected area not found or has no _id:",
        this.formData.areaName
      );
      // You might want to handle the case when the selected area is not found or has no _id
    }

    return ""; // Add this line to ensure that a value is always returned
  }

  private setDefaultDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = ("0" + (today.getMonth() + 1)).slice(-2); // Months are zero-based
    const day = ("0" + today.getDate()).slice(-2);

    this.formData.date = `${year}-${month}-${day}`;
  }

  //Logged user only
  addClimb() {
    //console.log(this.formData);

    if (
      !this.formData.climbName ||
      !/^[a-z0-9 ]+$/i.test(this.formData.climbName)
    ) {
      this.errorMessage =
        "Climb name is required and should only contain alphanumeric characters and spaces";
      return;
    }

    //Limit to only the past
    const today = new Date();
    const selectedDate = new Date(this.formData.date);
    if (selectedDate > today) {
      this.errorMessage = "Date cannot be in the future";
      return;
    }
    if (!this.climbingAreas) {
      console.error('getAreaId error: climbingAreas is not defined or empty');
      return "";
    }
    const selectedArea = this.climbingAreas.find(
      (area) => area.name === this.formData.areaName
    )!;
    //Need to generate this.selectedArea from this.formData.areaName first
    const selectedRoute = this.routes.find(
      (route) => route.name === this.formData.routeName
    )!;

    const newClimb: Climb = {
      _id: "",
      name: this.formData.climbName,
      grade: selectedRoute.grade,
      description: "default desciption, unused variable",
      date: this.formData.date,
      area: selectedArea._id, // Use the areaName instead of area
      areaName: selectedArea.name,
      numberOrder: selectedRoute.numberOrder,
    };

    this.userDataService.addUserClimb(this.userId, newClimb).subscribe({
      next: (response: any) => {
        console.log("Climb added successfully:", response);
        this.loadUserClimbs();
        this.chartService.triggerChartRefresh();
      },
      error: (error) => {
        console.error("Error adding climb:", error);
      },
    });
    console.log(newClimb);
    this.modalRef?.hide();

    return "";
  }

  isCurrentUser(): boolean {
    return this.authService.isCurrentUser(this.userId);
  }
}
