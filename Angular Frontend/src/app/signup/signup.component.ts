import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; // Import SweetAlert2
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserserviceService } from '../userservice.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  registrationForm!: FormGroup;
  ckDep: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  constructor(private fb: FormBuilder,private router: Router,private service: UserserviceService) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['', [Validators.required, Validators.pattern(
        /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/
      )]],
      });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
  signup(): void {
    if (this.registrationForm.invalid) {
      this.ckDep = true;
      return;
    }
  
    const formData = this.registrationForm.value;
    console.log("formData", formData);
    this.service.signup(this.registrationForm.value).subscribe(
      (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Registration successful!',
          text: 'User data added successfully',
          confirmButtonText: 'OK'
        });
        this.registrationForm.reset();
        this.router.navigate(["/loginform"]);
        console.log(res);
      },
      (err: any) => {
        if (err.status === 400) {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed!',
            text: 'User already exists',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Registration Failed!',
            text: 'Something went wrong. Please try again later.',
            confirmButtonText: 'OK'
          });
        }
        console.error('Error:', err);
      }
    );
  }
}  

