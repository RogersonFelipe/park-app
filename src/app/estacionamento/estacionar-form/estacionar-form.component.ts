import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastController,IonicModule } from '@ionic/angular';
import { Vaga } from 'src/app/vagas/models/vaga.type';
import { VagasService } from 'src/app/vagas/services/vagas.service';
import { Veiculo } from 'src/app/veiculos/models/veiculo.type';
import { VeiculosService } from 'src/app/veiculos/services/veiculos.service';
import { VagasOcupadasService } from '../services/vagas-ocupadas.service';
import { Router } from '@angular/router';
import { PrecoVagaValidator } from 'src/app/commons/validators/preco-vaga.validator';

@Component({
    selector: 'app-estacionar-form',
    templateUrl: './estacionar-form.component.html',
    styleUrls: ['./estacionar-form.component.scss'],
    imports: [IonicModule, ReactiveFormsModule, CommonModule],
})
export class EstacionarFormComponent implements OnInit {
    veiculos: Veiculo[] = [];
    vagas: Vaga[] = [];
    veiculosDisponiveis: Veiculo[] = [];
    errorMsg: string = '';
    sucessMsg: string = '';

    constructor(
        private readonly veiculosService: VeiculosService,
        private readonly vagasService: VagasService,
        private readonly vagasOcupadasService: VagasOcupadasService,
        private readonly router: Router,
        private readonly toastController: ToastController
    ) {}

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

    ngOnInit() {
        this.veiculosService.getAll().subscribe({
            next: (resp) => {
                this.veiculos = resp;
            },
            error: (error) => {
                alert('Erro ao buscar veículos!');
                console.error(error);
            },
        });

        // 1. Buscar vagas ocupadas (não finalizadas)
        this.vagasOcupadasService.getAll().subscribe({
            next: (vagasOcupadas) => {
                const veiculosOcupadosIds = vagasOcupadas.map((v) =>
                    String(v.veiculoId)
                );
                const vagasOcupadasIds = vagasOcupadas.map((v) =>
                    String(v.vagaId)
                );

                // Buscar todos os veículos e filtrar os disponíveis
                this.veiculosService.getAll().subscribe({
                    next: (veiculos) => {
                        this.veiculos = veiculos;
                        this.veiculosDisponiveis = veiculos.filter(
                            (v) => !veiculosOcupadosIds.includes(String(v.id))
                        );
                    },
                    error: (error) => {
                        alert('Erro ao buscar veículos!');
                        console.error(error);
                    },
                });

                // Buscar todas as vagas e filtrar as disponíveis
                this.vagasService.getAll().subscribe({
                    next: (vagas) => {
                        this.vagas = vagas.filter(
                            (vaga) =>
                                !vagasOcupadasIds.includes(String(vaga.id))
                        );
                    },
                    error: (error) => {
                        alert('Erro ao buscar vagas!');
                        console.error(error);
                    },
                });
            },
            error: (error) => {
                alert('Erro ao buscar vagas ocupadas!');
                console.error(error);
            },
        });

        // Buscar vagas normalmente
        this.vagasService.getAll().subscribe({
            next: (resp) => {
                this.vagas = resp;
            },
            error: (error) => {
                alert('Erro ao buscar vagas!');
                console.error(error);
            },
        });

        this.estacionarForm
            .get('precoHora')
            ?.valueChanges.subscribe((valor) => {
                if (valor && Number(valor) > 0) {
                    this.estacionarForm
                        .get('precoFixo')
                        ?.disable({ emitEvent: false });
                } else {
                    this.estacionarForm
                        .get('precoFixo')
                        ?.enable({ emitEvent: false });
                }
            });

        this.estacionarForm
            .get('precoFixo')
            ?.valueChanges.subscribe((valor) => {
                if (valor && Number(valor) > 0) {
                    this.estacionarForm
                        .get('precoHora')
                        ?.disable({ emitEvent: false });
                } else {
                    this.estacionarForm
                        .get('precoHora')
                        ?.enable({ emitEvent: false });
                }
            });
    }

    estacionarForm: FormGroup = new FormGroup(
        {
            veiculo: new FormControl('', Validators.required),
            vaga: new FormControl('', Validators.required),
            horaInicio: new FormControl('', Validators.required),
            precoHora: new FormControl(''),
            precoFixo: new FormControl(''),
        },
        {
            validators: PrecoVagaValidator.peloMenosUmPreco(),
        }
    );

    onSubmit() {
        this.errorMsg = '';
        this.sucessMsg = '';
        if (this.estacionarForm.errors?.['peloMenosUmPreco']) {
            this.presentErrorToast(
                'Preencha pelo menos um dos campos: Preço por hora ou Preço fixo.'
            );
            return;
        }
        const formValue = this.estacionarForm.value;

        const payload: any = {
            vagaId: formValue.vaga.id,
            vagaCodigo: formValue.vaga.codigo, // <-- Corrige aqui
            veiculoId: formValue.veiculo.id,
            placaVeiculo: formValue.veiculo.placa,
            horaInicio: formValue.horaInicio,
            precoHora: formValue.precoHora
                ? Number(formValue.precoHora)
                : undefined,
            precoFixo: formValue.precoFixo
                ? Number(formValue.precoFixo)
                : undefined,
            precoTotal: 0,
            finalizada: false,
        };

        this.vagasOcupadasService.save(payload).subscribe({
            next: async (resp) => {
                await this.presentSuccessToast(
                    'Carro estacionado com sucesso!'
                );
                this.estacionarForm.reset();
                this.vagasService.calculaPorcentagemVagas();
                setTimeout(() => {
                    this.router.navigate(['/tabs/home']);
                }, 2000);
            },
            error: async (error) => {
                const msg =
                    error?.error?.message || 'Erro ao estacionar veículo!';
                await this.presentErrorToast(msg);
                this.errorMsg = msg;
                console.error(error);
            },
        });
    }
}
