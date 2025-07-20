import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EstacionamentoPageRoutingModule } from './estacionamento-routing.module';
import { EstacionamentoPage } from './estacionamento.page';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EstacionamentoPageRoutingModule,
        EstacionamentoPage
    ],
    declarations: []
})
export class EstacionamentoPageModule {}
