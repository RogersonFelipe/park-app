import { Component, OnInit } from '@angular/core';
import { VagasService } from '../services/vagas.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastController,IonicModule } from '@ionic/angular';

@Component({
    selector: 'app-vaga-form',
    templateUrl: './vaga-form.component.html',
    styleUrls: ['./vaga-form.component.scss'],
    imports: [IonicModule, ReactiveFormsModule, CommonModule],
})
export class VagaFormComponent implements OnInit {
    vagaId!: string;
    errorMsg: string = '';
    sucessMsg: string = '';

    constructor(
        private readonly vagasService: VagasService,
        private readonly activatedRoute: ActivatedRoute,
        private readonly router: Router,
        private readonly toastController: ToastController
    ) {
        this.vagaId = this.activatedRoute.snapshot.params['id'];

        if (this.vagaId) {
            this.vagasService.getById(this.vagaId).subscribe({
                next: (resp) => {
                    this.vagaForm.patchValue(resp);
                },
                error: (error) => {
                    alert('Erro ao buscar vaga!');
                    console.error(error);
                },
            });
        }
    }

    vagaForm: FormGroup = new FormGroup({
        codigo: new FormControl('', Validators.required),
        coberta: new FormControl(false, Validators.required),
        comportaCamionete: new FormControl(true, Validators.required),
        isAtiva: new FormControl(true, Validators.required),
        reservada: new FormControl(false, Validators.required),
    });

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

    onSubmit() {
        this.errorMsg = '';
        this.sucessMsg = '';
        const formValue = this.vagaForm.value;
        if (this.vagaId) {
            formValue.id = this.vagaId;
        }
        this.vagasService.save(formValue).subscribe({
            next: async (resp) => {
                await this.presentSuccessToast('Vaga salva com sucesso!');
                setTimeout(() => {
                    this.router.navigate(['/tabs/vagas']);
                }, 2000);
                this.vagaForm.reset();
            },
            error: async (error) => {
                const msg = error?.error?.message || 'Erro ao cadastrar vaga!';
                await this.presentErrorToast(msg);
                this.errorMsg = msg;
                console.error(error);
            },
        });
    }

    remove() {
        this.vagasService.remove(this.vagaId).subscribe({
            next: (resp) => {
                alert('Vaga removida com sucesso!');
                this.router.navigate(['/']);
            },
            error: (error) => {
                alert('Erro ao remover a vaga');
                console.error(error);
            },
        });
    }

    ngOnInit() {
        this.vagasService.getAll().subscribe({
            next: (vagas) => {
                console.log('Vagas do backend:', vagas);
            },
            error: (error) => {
                alert('Erro ao buscar vagas!');
                console.error(error);
            },
        });
    }
}
