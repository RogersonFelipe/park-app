import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EstacionamentoPage } from './estacionamento.page';
import { EstacionarFormComponent } from './estacionar-form/estacionar-form.component';

const routes: Routes = [
    {
        path: '',
        component: EstacionamentoPage
    },
    {
        path: 'new',
        component: EstacionarFormComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class EstacionamentoPageRoutingModule { }
