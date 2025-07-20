import { Injectable } from "@angular/core";
import { Veiculo } from "../models/veiculo.type";
import { HttpClient } from "@angular/common/http";
import { BASE_API_URL } from "src/app/commons/constants/app.constats";

@Injectable({
    providedIn: 'root',
})
export class VeiculosService {
    private readonly API_URL = BASE_API_URL + '/veiculos';

    constructor(private readonly httpClient: HttpClient) {}

    getById(veiculoId: string) {
        return this.httpClient.get<Veiculo>(`${this.API_URL}/${veiculoId}`);
    }

    getAll() {
        return this.httpClient.get<Veiculo[]>(this.API_URL);
    }

    save(veiculo: Veiculo) {
        return this.httpClient.post<Veiculo>(this.API_URL, veiculo);
    }
    
    update(veiculoId: string, veiculo: Veiculo) {
        return this.httpClient.put<Veiculo>(
            `${this.API_URL}/${veiculoId}`,
            veiculo
        );
    }

    remove(veiculoId: string) {
        return this.httpClient.delete(`${this.API_URL}/${veiculoId}`);
    }
}