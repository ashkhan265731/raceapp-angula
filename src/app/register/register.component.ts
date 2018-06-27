import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs/Rx";
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService } from './../services/alert.service';
import { environment } from './../../environments/environment.prod';
import { Location } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  serviceUrl = environment.serviceUrl;
  user: any = {
    user_type: 'select',
    state: 'select'
  };
  filesToUpload: Array<File> = [];
  selectedTab = 0;
  verifyEmail: any = false;
  validatePhoneumber: any = false;
  filename: any = '';

  states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
  ];
  @ViewChild('phone1') phone1: ElementRef;
  @ViewChild('phone2') phone2: ElementRef;
  @ViewChild('phone3') phone3: ElementRef;
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertService,
    private location: Location
  ) { }

  ngOnInit() {
  }

  validatePhone() {
    if (this.user.phone1) {

      if (this.user.phone1 && this.user.phone1.toString().length > 2) {
        this.phone2.nativeElement.focus();

        if (this.user.phone2) {
          if (this.user.phone2 && this.user.phone2.toString().length > 2) {
            this.phone3.nativeElement.focus();

            if (this.user.phone3) {
              if (this.user.phone1.toString().length > 2 && this.user.phone2.toString().length > 2 && this.user.phone3.toString().length > 3) {
                this.phone3.nativeElement.blur();
              }
            }

          }
        }

      }
      if (this.user.phone1 && this.user.phone2 && this.user.phone3) {
        var validatePhone = parseInt(this.user.phone1.length) + parseInt(this.user.phone2.length) + parseInt(this.user.phone3.length);
        console.log(validatePhone);
        if (validatePhone == 10) {
          this.validatePhoneumber = false;
        } else {
          this.validatePhoneumber = true;
        }
      }
    }


    console.log();

  }

  checkEmailDuplication(email) {
    var _this = this;
    var data = email.model;
    // console.log(email.model);
    var response = this.http.post(this.serviceUrl + "/checkduplicates", { "data": data })
      .subscribe(function (res) {
        if (res) {
          _this.verifyEmail = true;
        } else {
          _this.verifyEmail = false;
        }
      });

  }

  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
    this.filename = this.filesToUpload[0].name;
  }

  register() {
    this.user.phone = this.user.phone1 + "" + this.user.phone2 + "" + this.user.phone3;
    this.user = JSON.stringify(this.user);
    console.log(this.user);
    const formData: any = new FormData();
    const files: Array<File> = this.filesToUpload;
    if (files.length > 0) {
      formData.append("uploads[]", files[0], files[0]['name']);
    }
    else {

    }

    //formData.append("uploads[]", files[0], files[0]['name']);
    formData.append("user", this.user)
    var response = this.http.post(this.serviceUrl + "/registeruser", formData)
      .subscribe( (res)=> {
        console.log(response);
        //return res;
        this.alertService.success('Registered successfully ', true);
        setTimeout(() => {
          this.router.navigate(["login"]);
        }, 5000);
      }, function (err) {
        console.log(err);
        this.alertService.error('Something went wrong, Please Contact the administrator !!', true);
      });

    if (response) {
      //this.user = {};
      this.router.navigate(["reg-confirmation"]);
      //location.reload();
      //alert("Registerd successfully");

    }
    else {

    }
  }
}
