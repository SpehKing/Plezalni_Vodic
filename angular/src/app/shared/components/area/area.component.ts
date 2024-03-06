import { Component, OnInit, Input} from '@angular/core';
import { AreaDataService } from "../../services/area-data.service";
import { Area } from "../../classes/area";
import { Comment } from "../../classes/comment";
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-area',
  templateUrl: "area.component.html",
  styles: [
  ]
})
export class AreaComponent implements OnInit {
    area: Area;
    picturePath: string = "";
    @Input() comments: Comment[] = [];
    @Input() areaID: string = "";

    constructor(
        private areaDataService: AreaDataService,
        private route: ActivatedRoute
    ) {
        this.area = new Area();
    }

    ngOnInit() {
      this.route.params.subscribe(params => {
        let id = params['areaID']; // Extract the id
        this.areaID = id;
        console.log(this.areaID);
      });
        this.areaDataService.getAreas(this.areaID).subscribe((data) => {
          this.area = data;
          this.picturePath = "assets/public/images/climbing_sites/"+this.area.name;
          console.log("picture path: ", this.picturePath);
          this.comments = this.area.comments ? this.area.comments : [];
        });
    }
}