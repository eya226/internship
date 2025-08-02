// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';

// Components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { SecureModule } from './secure/secure.module';

// Services
import { AuthService } from './auth/auth.service';
import { JourneyCardComponent } from './journey-card/journey-card.component';
import { StationMapComponent } from './station-map/station-map.component';
import { TimelineComponent } from './timeline/timeline.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    JourneyCardComponent,
    StationMapComponent,
    TimelineComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    SecureModule
  ],
  providers: [
    AuthService,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}