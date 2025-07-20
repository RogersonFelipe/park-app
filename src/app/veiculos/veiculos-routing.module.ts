import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VeiculosPage } from './veiculos.page';
import { VeiculoFormComponent } from './veiculo-form/veiculo-form.component';

const routes: Routes = [
    {
        path: '',
        component: VeiculosPage,
    },
    {
        path: 'new',
        component: VeiculoFormComponent
    },
    {
        path: 'edit/:id',
        component: VeiculoFormComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VeiculosPageRoutingModule { }
