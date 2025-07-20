import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VeiculosPage } from './veiculos.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { VeiculosPageRoutingModule } from './veiculos-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    VeiculosPageRoutingModule
  ],
  declarations: [VeiculosPage]
})
export class VeiculosPageModule {}
