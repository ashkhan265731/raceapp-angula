import { Component, OnInit,Input } from '@angular/core';
import { PostFormDataService } from './../../services/post-form-data.service';
import { environment } from './../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-myevents',
  templateUrl: './myevents.component.html',
  styleUrls: ['./myevents.component.css']
})
export class MyeventsComponent implements OnInit {
  errorLog = false;
  serviceUrl = environment.serviceUrl;
  myEventsData:any;
  eventsListData:any;
  listData:any;
  user_id:any;
  currentDate: any;
  length: any = 100;
  filter_from: any = Date.parse("1900-01-01T06:00:00.000Z");
  filter_to: any = Date.parse("2040-01-01T06:00:00.000Z");
  alertMessage: any = null;
  ongoingEvents: any = [];
  upcomingEvents: any = [];
  expiredEvents: any = []; 


  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private pfService : PostFormDataService,
    private dataService:DataService
  ) {
    this.dataService.changeMessage("my_event");
    this.getEventListCount(this.filter_from, this.filter_to);

    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();
    this.currentDate = Date.parse(new Date().toString());
   }

  ngOnInit() {
    var sessionvar =  JSON.parse(sessionStorage.getItem('user'));
    this.user_id=sessionvar['_id'];
    this.getMyEvents(this.user_id);
  }
  getMyEvents(user_id) {
    var current = this;
    //this.http.get("http://localhost:3000/getsingleevent/" + id)
    this.pfService.getFormData(current.serviceUrl+ "/getusermyevents/" + user_id)
      .subscribe(function (response) {
        current.errorLog = false;
        current.myEventsData = response;
        console.log(current.myEventsData);
        

        current.myEventsData.forEach(el => {
          console.log(current.currentDate)
          if (el.event_id.from_date < current.currentDate && el.event_id.to_date > current.currentDate) {
            console.log("on going events");
            current.ongoingEvents.push(el);
          }
          else if (el.event_id.from_date < current.currentDate && el.event_id.to_date < current.currentDate) {
            console.log("expired events");
            current.expiredEvents.push(el);
          } else if (el.event_id.from_date > current.currentDate) {
            console.log("upcoming events");
            current.upcomingEvents.push(el);
          } else {
            console.log("empty")
          }
        });

    },
    function (err) {
      current.errorLog = true;
      current.alertMessage = {
        type: 'danger',
        title: 'Something Went wrong. Please Contact Administartor',
        data: err
      };
    });
  }
  // getEventsList(){
  //   var current = this;
  //   //this.http.get("http://localhost:3000/geteventslists")
  //   var response = this.pfService.getFormData(this.serviceUrl +'/geteventslists/');
  //   response.subscribe(function(response){
  //     current.eventsListData = response;
  //   });
  // }

  getEventListCount(filter_from, filter_to) {
    var current = this;
    //this.http.get("http://localhost:3000/geteventslistCount/"+filter_from+"/"+filter_to)
    var response = this.pfService.getFormData(this.serviceUrl + "/geteventslistCount/" + filter_from + "/" + filter_to);

    response.subscribe(function (response) {
      current.errorLog = false;
      current.length = response;
    },
      function (err) {
        current.errorLog = true;
        current.alertMessage = {
          type: 'danger',
          title: 'Something Went wrong. Please Contact Administartor',
          data: err
        };
      });
  }
  
}
