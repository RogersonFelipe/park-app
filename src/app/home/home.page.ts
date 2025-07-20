import { Component, OnInit } from '@angular/core';
import { ModalController, ViewDidEnter, ViewWillEnter } from '@ionic/angular';
import { SaidaModalComponent } from '../estacionamento/saida-modal/saida-modal.component';
import { VagasOcupadasService } from '../estacionamento/services/vagas-ocupadas.service';
import { firstValueFrom } from 'rxjs';
import { VagasService } from '../vagas/services/vagas.service';

@Component({
    selector: 'home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    standalone: false,
})
export class HomePage implements OnInit {
    vagasOcupadas: number = 0;
    vagasTotais: number = 0;
    vagasOcupadasPercentage: number = 0;

    constructor(private readonly modalController: ModalController,
        private readonly vagasOcupadasService: VagasOcupadasService,
        private readonly vagasService: VagasService) {
        // this.vagasService.getAll()
        //     .subscribe((resp) => {
        //         this.vagasTotais = resp.length;
        //     });
        // this.vagasOcupadasService.getAll()
        //     .subscribe((resp) => {
        //         this.vagasOcupadas = resp.length;
        //     })
    }
    ngOnInit(): void {
        this.vagasService.getAll().subscribe((vagas) => {
            this.vagasTotais = vagas.length;
            this.vagasOcupadasService.getAll().subscribe((ocupadas) => {
                this.vagasOcupadas = ocupadas.length;
                this.vagasOcupadasPercentage = this.vagasTotais > 0
                    ? Math.round((this.vagasOcupadas / this.vagasTotais) * 100)
                    : 0;
            });
        });
    }

    async abrirSaidaModal() {
        const vagasOcupadas = await firstValueFrom(this.vagasOcupadasService.getAll());
        const modal = await this.modalController.create({
            component: SaidaModalComponent,
            componentProps: { vagasOcupadas }
        });
        modal.present();

        const { data } = await modal.onWillDismiss();
        if (data) {
            // this.vagasOcupadasService.delete(data.id);
        }
    }

    getTotalFaturadoHoje() {
        return this.vagasOcupadasService.totalFaturado;
    }

    getPorcentagemOcupada() {
        return this.vagasService.vagasOcupadasPorcentagem;
    }
    
}
