import { Component, Input, OnInit, SimpleChanges, OnChanges } from '@angular/core';
import { UserDataService } from "../../services/user-data.service";
import { Climb } from "../../classes/climb";
import { Chart } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { CategoryScale, LinearScale, LineController, LineElement, PointElement, Title, Tooltip } from 'chart.js';
import { ChartService } from '../../services/chart.service';
import { ActivatedRoute } from '@angular/router';

// Register the necessary modules and scales
Chart.register(
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
  Tooltip
);

@Component({
  selector: 'app-user-chart',
  template: `
    <div>
      <canvas id="userChart"></canvas>
    </div>
  `
})
export class UserChartComponent implements OnInit {
  @Input() userId!: string;
  climbs: Climb[] = [];
  isDataLoaded: boolean = false;
  private chart: Chart | null = null;

  constructor(
    private userDataService: UserDataService,
    private chartService: ChartService,
    private route: ActivatedRoute
    ) {}

  ngOnInit() {
    console.log("Received userId in init:", this.userId);
    this.route.params.subscribe(params => {
      // Fetch new data based on the updated parameters
      this.loadUserClimbs();
      
    });
    this.chartService.refreshChart$.subscribe(() => {
      this.loadUserClimbs();
    });
  }

    ngOnChanges(changes: SimpleChanges): void {
        // Detect changes in userId and reload data and recreate the chart
        if (changes['userId']) {
                this.loadUserClimbs();
        }
    }

  loadUserClimbs() {
    this.userDataService.getUserClimb(this.userId).subscribe({
      next: (response: any) => {
        if (response.status === 200 && response.climbs) {
          this.climbs = response.climbs;
          console.log("Climbs Data::::", this.climbs);
          this.climbs.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        } else {
          this.climbs = [];
        }
        this.isDataLoaded = true;
        this.createChart();
      },
      error: (error) => {
        //Destroy the chart to prevent the users without the
        this.chart?.destroy();
        console.log("This user has no climbs yet:", error);
        this.climbs = [];
        this.isDataLoaded = true;
      },
    });
  }

  
createChart() {
  if (this.chart) {
    this.chart.destroy();
  }
  const canvas = document.getElementById('userChart') as HTMLCanvasElement;
  if (canvas) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: this.climbs.map(climb => new Date(climb.date).getTime()), // Use timestamp values instead of date strings
          datasets: [{
            label: 'Climbing Grade',
            data: this.climbs.map(climb => this.adjustedGradeToNumber(climb.grade)),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
          }]
        },
        options: {
          scales: {
            x: {
              type: 'linear',
              ticks: {
                callback: (value: number | string) => new Date(Number(value)).toLocaleDateString(), // Convert timestamp back to date string
              },
            },
            y: {
              min: 1,
              max: 15,
              ticks: {
                stepSize: 1,
                callback: (value: string | number) => this.numberToGrade(Number(value)),
              },
            },
          },
        },  
      });
    } else {
      console.error('Cannot get 2d context from canvas');
    }
  } else {
    console.error('Cannot find element with id userChart');
  }
}

  adjustedGradeToNumber(grade: string): number {
    const gradeMap: { [key: string]: number } = {
      '4a': 1, '4b': 2, '4c': 3, '5a': 4, '5b': 5, '5c': 6,
      '6a': 7, '6b': 8, '6c': 9, '7a': 10, '7b': 11, '7c': 12,
      '8a': 13, '8b': 14, '8c': 15, '9a': 16, '9b': 17, '9c': 18
    };

    // If the grade ends with '+', add 0.5 to the value
    const adjustedValue = grade.endsWith('+') ? gradeMap[grade.slice(0, -1)] + 0.5 : gradeMap[grade];
    return adjustedValue;
  }

  numberToGrade(value: number): string {
    const gradeMap: { [key: number]: string } = {
      1: '4a', 2: '4b', 3: '4c', 4: '5a', 5: '5b', 6: '5c',
      7: '6a', 8: '6b', 9: '6c', 10: '7a', 11: '7b', 12: '7c',
      13: '8a', 14: '8b', 15: '8c', 16: '9a', 17: '9b', 18: '9c'
    };

    // If the value is a whole number, return the corresponding grade; otherwise, add '+'
    return Number.isInteger(value) ? gradeMap[value] : gradeMap[Math.floor(value)] + '+';
  }
}