import { Component, Input, OnInit } from '@angular/core';
import { IonicModule, ModalController , ToastController} from '@ionic/angular';
import { VagaOcupada } from 'src/app/commons/models/vaga-ocupacao.type';
import { VagasOcupadasService } from '../services/vagas-ocupadas.service';
import { Vaga } from 'src/app/vagas/models/vaga.type';
import { CommonModule } from '@angular/common';
import { VagasService } from 'src/app/vagas/services/vagas.service';

@Component({
    selector: 'app-saida-modal',
    templateUrl: './saida-modal.component.html',
    styleUrls: ['./saida-modal.component.scss'],
    imports: [IonicModule, CommonModule],
})
export class SaidaModalComponent implements OnInit {
    @Input() vagasOcupadas: VagaOcupada[] = [];
    errorMsg: string = '';
    sucessMsg: string = '';

    constructor(
        private modalController: ModalController,
        private readonly vagasOcupadasService: VagasOcupadasService,
        private readonly toastController: ToastController,
        private readonly vagasService: VagasService
    ) {}

    dismiss() {
        this.modalController.dismiss();
    }

    selecionar(vaga: VagaOcupada) {
        this.modalController.dismiss(vaga);
    }

    finalizarVaga(vagaOcupada: VagaOcupada) {
        vagaOcupada.horaFim = new Date();
        vagaOcupada.finalizada = true;

        if (vagaOcupada.id) {
            this.vagasOcupadasService.update(vagaOcupada).subscribe({
                next: async (resp) => {
                    // Atualiza faturamento e porcentagem
                    if (vagaOcupada.precoFixo > 0) {
                        this.vagasOcupadasService.totalFaturado +=
                            vagaOcupada.precoFixo;
                    } else {
                        this.vagasOcupadasService.totalFaturado +=
                            this.calculaTotal(vagaOcupada);
                    }
                    this.vagasService.calculaPorcentagemVagas();

                    // Agora remove do banco
                    this.vagasOcupadasService
                        .delete(vagaOcupada.id!)
                        .subscribe({
                            next: async () => {
                                await this.presentSuccessToast(
                                    'Vaga liberada e removida com sucesso!'
                                );
                                this.dismiss();
                            },
                            error: async (error) => {
                                await this.presentErrorToast(
                                    'Erro ao remover vaga!'
                                );
                                console.error(error);
                            },
                        });
                },
                error: async (error) => {
                    await this.presentErrorToast('Erro ao liberar vaga!');
                    console.error(error);
                },
            });
        } else {
            this.presentErrorToast('Vaga id é undefined');
            console.error('Vaga id é undefined');
        }
    }
    async presentSuccessToast(message: string) {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            color: 'success',
            position: 'top',
        });
        await toast.present();
    }

    async presentErrorToast(message: string) {
        const toast = await this.toastController.create({
            message,
            duration: 2500,
            color: 'danger',
            position: 'top',
        });
        await toast.present();
    }

    ngOnInit() {}

    calculaTotal(vagaOcupada: VagaOcupada) {
        if (vagaOcupada.precoFixo > 0) {
            return vagaOcupada.precoFixo;
        }
        return (
            this.vagasOcupadasService.calcularHorasInteiras(vagaOcupada) *
            vagaOcupada.precoHora
        );
    }
}
