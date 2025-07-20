import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { VagaOcupada } from '../commons/models/vaga-ocupacao.type';
import { VagasOcupadasService } from './services/vagas-ocupadas.service';

@Component({
    selector: 'app-estacionamento',
    templateUrl: './estacionamento.page.html',
    styleUrls: ['./estacionamento.page.scss'],
    imports: [
        IonicModule
    ]
})
export class EstacionamentoPage implements OnInit {
    pageTitle: string = 'Estacionamento';
    vagasOcupadas: VagaOcupada[] = [];

    constructor(private readonly vagasOcupadasService: VagasOcupadasService) { }

    ngOnInit() {
        this.vagasOcupadasService.getAll()
            .subscribe({
                next: (resp) => {
                    this.vagasOcupadas = resp;
                },
                error: (error) => {
                    alert('Erro ao buscar as vagas ocupadas');
                }
            })
    }

    atualizarVagas() {
                this.vagasOcupadasService.getAll()
            .subscribe({
                next: (resp) => {
                    this.vagasOcupadas = resp;
                },
                error: (error) => {
                    alert('Erro ao buscar as vagas ocupadas');
                }
            })
    }
}
