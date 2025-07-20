import { Component } from '@angular/core';
import { ViewWillEnter } from '@ionic/angular';
import { Vaga } from './models/vaga.type';
import { VagasService } from './services/vagas.service';

@Component({
    selector: 'vagas',
    templateUrl: 'vagas.page.html',
    styleUrls: ['vagas.page.scss'],
    standalone: false,
})
export class VagasPage implements ViewWillEnter {
    vagas: Vaga[] = [];
    pageName: string = 'Vagas';

    constructor(private readonly vagasService: VagasService) { }
    
    deleteVaga(vagaId: string) {
        this.vagasService.remove(vagaId).subscribe({
            next: (resp) => {
                alert('Vaga removida com sucesso!');
                this.ionViewWillEnter();
            }
            , error: (error) => {
                alert('Erro ao remover vaga!');
                console.error(error);
            }
        });
    }

    ionViewWillEnter(): void {
        this.vagasService.getAll().subscribe({
            next: (resp) => {
                this.vagas = resp;
            }
            , error: (error) => {
                alert('Erro ao buscar vagas!');
                console.error(error);
            }
        }); 
    }
}
