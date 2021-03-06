import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { APP_ROUTING } from './app-routing.module';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatDividerModule,
    MatListModule,
    MatNativeDateModule,
    MatToolbarModule
} from '@angular/material';
import { IndexComponent } from './pages/index/index.component';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import {FormSelectModule} from './components/form-select/form-select.module';
@NgModule({
    declarations: [
        AppComponent,
        MainMenuComponent,
        HeaderComponent,
        FooterComponent,
        SideNavComponent,
        IndexComponent
    ],
    imports: [
        BrowserModule,
        NgbModule.forRoot(),
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        MatNativeDateModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatSidenavModule,
        MatToolbarModule,
        MatDividerModule,
        MatListModule,
        FormSelectModule,
        APP_ROUTING
    ],
    exports: [MatButtonModule, MatCheckboxModule],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
