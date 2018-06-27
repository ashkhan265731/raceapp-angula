import { Router, ActivatedRoute, Params } from '@angular/router';
import { OnInit, Component, EventEmitter, Input, Output,ViewChild, ElementRef  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';
import { FileUpload } from 'ng2-fileupload';
import { FileUploader, FileSelectDirective } from 'ng2-file-upload';
import { PostFormDataService } from './../../services/post-form-data.service';
import { environment } from './../../../environments/environment';
import { Location } from '@angular/common';
import { DataService } from '../../services/data.service';


@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.css']
})
export class ProfileEditComponent implements OnInit {
  //@Input()  name: string;
  //@Output() profileUpdated = new EventEmitter<boolean>();

  uploader: FileUploader;
  attachmentList: any = [];
  userId: String = '';
  userData: any = {};
  ph1:any='';
  ph2:any='';
  ph3:any='';
  validatePhoneumber: any = false;
  //states: any = [];
  modelData: any = {};
  //new variables
  isLinear = false;

  serviceUrl: any = environment.serviceUrl
  errorLog: any = false;
  alertMessage: any = null;

  states = [
    'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado', 'connecticut', 'delaware',
    'florida', 'georgia', 'hawaii', 'idaho', 'illinois', 'indiana', 'iowa', 'kansas', 'kentucky',
    'louisiana', 'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota', 'mississippi',
    'missouri', 'montana', 'nebraska', 'nevada', 'new hampshire', 'new jersey', 'new mexico',
    'new york', 'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon', 'pennsylvania',
    'rhode Island', 'south carolina', 'south dakota', 'tennessee', 'texas', 'utah', 'vermont',
    'virginia', 'washington', 'west virginia', 'wisconsin', 'wyoming'
  ];
  selected = "minnesota";
  @ViewChild('phone1') phone1: ElementRef;
  @ViewChild('phone2') phone2: ElementRef;
  @ViewChild('phone3') phone3: ElementRef;
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private pfService: PostFormDataService,
    private _location: Location,
    private dataService: DataService,
    private router: Router,


  ) {
    this.userId = this.route.snapshot.params['id'];
    this.uploader = new FileUploader({ url: this.serviceUrl + "/updateproducerpicture/profilepicture/" + this.userId });

    this.uploader.onCompleteItem = (item: any, response: any, status: any, header: any) => {
      response = JSON.parse(response);
      this.attachmentList.push(response);
      this.userData.user_picture = response['uploadname'];
      this.uploader.clearQueue();

      var user = JSON.parse(sessionStorage.getItem("user"));
      user.user_picture = response.uploadname;
      sessionStorage.removeItem('user');
      sessionStorage.setItem('user', JSON.stringify(user));

      this.dataService.updateProfilePic(response.uploadname);
      this.router.navigate(['producer']);
    }

  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file: any) => { file.withCredentials = false; };
    // get param
    this.userId = this.route.snapshot.params['id'];
    this.getUserDetails();
    this.userData.user_picture = this.userId + ".jpg";
  }

  onUploadFiles(evt: any) {
    if (evt.error) {
      throw evt.error;
    }
    const files = evt.files;
  }

  getUserDetails() {
    var current = this;
    this.http.get(this.serviceUrl + "/getuserdetails/" + this.userId)
      .subscribe(function (response) {
        current.userData = response;
        current.ph1 = current.userData.phone.substring(0, 3);
        current.ph2 = current.userData.phone.substring(3, 6);
        current.ph3 = current.userData.phone.substring(6, 10);
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
  validatePhone() {
    if (this.ph1) {
      if (this.ph1 && this.ph1.toString().length > 2) {
        this.phone2.nativeElement.focus();

        if (this.ph2) {
          if (this.ph2 && this.ph2.toString().length > 2) {
            this.phone3.nativeElement.focus();

            if (this.ph3) {
              if (this.ph1.toString().length > 2 && this.ph2.toString().length > 2 && this.ph3.toString().length > 3) {
                this.phone3.nativeElement.blur();
              }
            }

          }
        }

      }
    }
    if (this.ph1 && this.ph2 && this.ph3) {
      var validatePhone = parseInt(this.ph1.length) + parseInt(this.ph2.length) + parseInt(this.ph3.length);
      console.log(validatePhone);
      if (validatePhone == 10) {
        this.validatePhoneumber = false;
      } else {
        this.validatePhoneumber = true;
      }
    }
  }
  update(model: any) {
    var current = this;
    this.modelData = Object.assign({}, this.userData);
    this.modelData.id = this.userId;
    this.modelData.phone = current.ph1+current.ph2+current.ph3;

    this.http.post(this.serviceUrl + "/updateuser", this.modelData)
      .subscribe(function (response) {
        current.errorLog = false;
        current.alertMessage = {
          type: 'success',
          title: 'Successfully updated user profile',
          data: ''
        };
        var user = JSON.parse(sessionStorage.getItem('user'));
        user.first_name = response['first_name'];
        user.last_name = response['last_name'];
        user.city = response['city'];
        sessionStorage.removeItem('user');
        sessionStorage.setItem('user', JSON.stringify(user));
        current.dataService.updateProfileInfo(user.first_name);
        current.router.navigate(['producer']);
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
  navigateBack() {
    this._location.back();
  }
}