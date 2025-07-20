import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
    {
        path: 'tabs',
        component: TabsPage,
        children: [
            {
                path: 'home',
                loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
            },
            {
                path: 'vagas',
                loadChildren: () => import('../vagas/vagas.module').then(m => m.VagasPageModule)
            },
            {
                path: 'carros',
                loadChildren: () => import('../veiculos/carros.module').then(m => m.VeiculosPageModule)
            },
            {
                path: 'estacionamento',
                loadChildren: () => import('../estacionamento/estacionamento.module').then(m => m.EstacionamentoPageModule) 
            },
            {
                path: '',
                redirectTo: '/tabs/home',
                pathMatch: 'full'
            }
        ]
    },
    {
        path: '',
        redirectTo: '/tabs/home',
        pathMatch: 'full'
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
})
export class TabsPageRoutingModule { }
