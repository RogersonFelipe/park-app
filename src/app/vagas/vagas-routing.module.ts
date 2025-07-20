import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VagasPage } from './vagas.page';
import { VagaFormComponent } from './vaga-form/vaga-form.component';

const routes: Routes = [
    {
        path: '',
        component: VagasPage,
    },
    {
        path: 'new',
        component: VagaFormComponent
    },
    {
        path:'edit/:id',
        component: VagaFormComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class VagasPageRoutingModule {}
