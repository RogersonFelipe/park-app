import { Injectable } from "@angular/core";
import { Vaga } from "../models/vaga.type";
import { HttpClient } from "@angular/common/http";
import { BASE_API_URL } from "src/app/commons/constants/app.constats";
import { VagasOcupadasService } from "src/app/estacionamento/services/vagas-ocupadas.service";
import { firstValueFrom } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class VagasService {
    public vagasOcupadasPorcentagem: number = 0;
    private readonly API_URL = BASE_API_URL + "/vagas";

    constructor(private readonly httpClient: HttpClient,
        private readonly vagasOcupadasService: VagasOcupadasService) {
            this.calculaPorcentagemVagas();
         }

    getById(vagaId: string) {
        return this.httpClient.get<Vaga>(`${this.API_URL}/${vagaId}`);
    }

    getAll() {
        return this.httpClient.get<Vaga[]>(this.API_URL);
    }

    save(vaga: Vaga) {
        return this.httpClient.post<Vaga>(this.API_URL, vaga);
    }

    remove(vagaId: string) {
        console.log('caiu aqui!!');
        return this.httpClient.delete(`${this.API_URL}/${vagaId}`);
    }

    async getVagasLivres() {
        let vagas = await firstValueFrom(this.getAll());
        console.log(vagas);
        let vagasOcupadas = await firstValueFrom(this.vagasOcupadasService.getAll());
        console.log(vagasOcupadas);

        const vagasLivres = vagas.filter(vaga =>
            !vagasOcupadas.some(ocupada => !ocupada.finalizada && ocupada.vaga.id == vaga.id)
        );

        return vagasLivres;
    }


    calculaPorcentagemVagas(): void {
        console.log('caiu aqui');
        this.getAll().subscribe((vagas) => {
            let vagasTotais = vagas.length;
            this.vagasOcupadasService.getAll().subscribe((ocupadas) => {
                let vagasOcupadas = ocupadas.length;
                this.vagasOcupadasPorcentagem = vagasTotais > 0
                    ? Math.round((vagasOcupadas / vagasTotais) * 100)
                    : 0;
            });
        });
    }
}
