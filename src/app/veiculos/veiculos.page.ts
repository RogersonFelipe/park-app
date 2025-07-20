import { Component } from '@angular/core';
import { VeiculosService } from './services/veiculos.service';
import { Veiculo } from './models/veiculo.type';
import { ViewWillEnter } from '@ionic/angular';

@Component({
    selector: 'veiculos',
    templateUrl: 'veiculos.page.html',
    styleUrls: ['veiculos.page.scss'],
    standalone: false,
})
export class VeiculosPage implements ViewWillEnter {
    pageName: string = 'Veículos';
    veiculos: Veiculo[] = [];

    constructor(private readonly veiculosService: VeiculosService) { }

    deleteVeiculo(veiculoId: string) {
        this.veiculosService.remove(veiculoId).subscribe({
            next: (resp) => {
                alert('Veículo removido com sucesso!');
                this.ionViewWillEnter();
            },
            error: (error) => {
                alert('Erro ao remover veículo!');
                console.error(error);
            }
        });

    }

    ionViewWillEnter(): void {
        console.log('caiu aqui');
        this.veiculosService.getAll().subscribe({
            next: (resp) => {
                console.log(resp);
                this.veiculos = resp;
            },
            error: (error) => {
                alert('Erro ao buscar veículos!');
                console.error(error);
            }
        });
    }
}
