import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VagasPage } from './vagas.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { VagasPageRoutingModule } from './vagas-routing.module';

@NgModule({
    imports: [
        IonicModule,
        CommonModule,
        FormsModule,
        ExploreContainerComponentModule,
        VagasPageRoutingModule
    ],
    declarations: [VagasPage]
})
export class VagasPageModule { }
