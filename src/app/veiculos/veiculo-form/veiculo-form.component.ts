import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { VeiculosService } from '../services/veiculos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MARCAS_VEICULO_LIST } from '../models/marca-veiculo.interface';
import { TIPOS_VEICULO_LIST } from '../models/tipo-veiculo.interface';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-veiculo-form',
    templateUrl: './veiculo-form.component.html',
    styleUrls: ['./veiculo-form.component.scss'],
    imports: [IonicModule, ReactiveFormsModule, CommonModule],
})
export class VeiculoFormComponent implements OnInit {
    marcas = MARCAS_VEICULO_LIST;
    tipos = TIPOS_VEICULO_LIST;
    veiculoId!: string;
    errorMsg: string = '';
    sucessMsg: string = '';

    veiculoForm: FormGroup = new FormGroup({
        modelo: new FormControl('', Validators.required),
        marca: new FormControl('', Validators.required),
        tipo: new FormControl('', Validators.required),
        placa: new FormControl('', [
            Validators.required,
            Validators.maxLength(7),
        ]),
        cor: new FormControl('', Validators.required),
        nomeProprietario: new FormControl('', Validators.required),
        contatoProprietario: new FormControl('', Validators.required),
    });

    constructor(
        private readonly veiculosService: VeiculosService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly toastController: ToastController
    ) {}
    ngOnInit() {
        this.veiculoId = this.activatedRoute.snapshot.params['id'];
        if (this.veiculoId) {
            this.veiculosService.getById(this.veiculoId).subscribe({
                next: (resp) => {
                    const marcaObj =
                        this.marcas.find(
                            (marca) => marca.id === resp.marca?.id
                        ) || null;
                    const tipoObj =
                        this.tipos.find((tipo) => tipo.id === resp.tipo?.id) ||
                        null;
                    this.veiculoForm.patchValue({
                        ...resp,
                        marca: marcaObj,
                        tipo: tipoObj,
                    });
                },
                error: (error) => {
                    alert('Erro ao buscar veículo!');
                    console.error(error);
                },
            });
        }
    }
    compareById = (o1: any, o2: any) => o1 && o2 && o1.id === o2.id;
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

    formatarTelefone(event: any) {
        let valor = event.target.value.replace(/\D/g, '');
        if (valor.length > 2) {
            valor = valor.replace(/^(\d{2})(\d)/g, '($1) $2');
        }
        if (valor.length > 10) {
            valor = valor.replace(/(\d{5})(\d{4})$/, '$1-$2');
        } else if (valor.length > 9) {
            valor = valor.replace(/(\d{4})(\d{4})$/, '$1-$2');
        }
        this.veiculoForm
            .get('contatoProprietario')
            ?.setValue(valor, { emitEvent: false });
    }

    onSubmit() {
        this.errorMsg = '';
        this.sucessMsg = '';

        const formValue = { ...this.veiculoForm.value };
        formValue.placa = formValue.placa.toUpperCase().replace(/\s/g, '');

        const payload = {
            ...formValue,
            marcaId: Number(formValue.marca?.id) || 0,
            marcaNome: formValue.marca?.nome || '',
            tipoId: Number(formValue.tipo?.id) || 0,
            tipoNome: formValue.tipo?.nome || '',
        };
        delete payload.marca;
        delete payload.tipo;

        if (payload.marcaId <= 0) {
            this.errorMsg = 'Selecione uma marca válida.';
            return;
        }
        if (payload.tipoId <= 0) {
            this.errorMsg = 'Selecione um tipo válido.';
            return;
        }

        // Se for edição, chama update, senão, save
        const request$ = this.veiculoId
            ? this.veiculosService.update(this.veiculoId, payload)
            : this.veiculosService.save(payload);

        request$.subscribe({
            next: async (resp) => {
                await this.presentSuccessToast(
                    this.veiculoId
                        ? 'Veículo atualizado com sucesso!'
                        : 'Veículo cadastrado com sucesso!'
                );
                setTimeout(() => {
                    this.router.navigate(['/tabs/carros']);
                }, 2000);
                this.veiculoForm.reset();
            },
            error: async (error) => {
                const msg =
                    error?.error?.message ||
                    (this.veiculoId
                        ? 'Erro ao atualizar veículo!'
                        : 'Erro ao cadastrar veículo!');
                await this.presentErrorToast(msg);
                this.errorMsg = msg;
                console.error(error);
            },
        });
    }

    remove() {
        this.veiculosService.remove(this.veiculoId).subscribe({
            next: async (resp) => {
                await this.presentSuccessToast('Veículo Removido com sucesso!');
                setTimeout(() => {
                    this.router.navigate(['/tabs/carros']);
                }, 2000);
                this.veiculoForm.reset();
            },
            error: async (error) => {
                const msg = error?.error?.message || 'erro ao remover veículo!';
                await this.presentErrorToast(msg);
                this.errorMsg = msg;
                console.error(error);
            },
        });
    }
}