import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { UserserviceService } from '../userservice.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  signinForm!: FormGroup;
  ckDep: boolean = false;
  showPassword: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private service: UserserviceService
  ) {}

  ngOnInit(): void {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$')]],
      password: ['', [Validators.required, Validators.pattern(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*#?&^_-]).{8,}/)]]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  login(): void {
    if (this.signinForm.invalid) {
      this.ckDep = true;
      return;
    }

    console.log("login", this.signinForm.value);
    this.service.login(this.signinForm.value).subscribe(
      (res: any) => {
        Swal.fire({
          icon: 'success',
          title: 'Login successfully!',
          text: 'Welcome to User',
          confirmButtonText: 'OK'
        });
        this.signinForm.reset();
        localStorage.setItem('token', res.token);
        localStorage.setItem('userId', res.userId);
        this.router.navigate(['/home']);
      },
      (err: any) => {
        if (err.status === 404) { 
          Swal.fire({
            icon: 'error',
            title: 'Login Failed!',
            text: 'User does not exist',
            confirmButtonText: 'OK'
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Login Failed!',
            text: 'Something went wrong. Please try again later.',
            confirmButtonText: 'OK'
          });
        }
        console.error('Error:', err);
      }
    );
  }
}
