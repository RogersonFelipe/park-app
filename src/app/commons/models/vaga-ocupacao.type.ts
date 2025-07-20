import { Vaga } from "src/app/vagas/models/vaga.type"
import { Veiculo } from "src/app/veiculos/models/veiculo.type"

export type VagaOcupada = {
    id?: string,
    vagaId: string,
    vagaCodigo: string
    veiculo: Veiculo,
    vaga: Vaga,
    veiculoId: string,
    placaVeiculo: string,
    horaInicio: Date,
    horaFim?: Date,
    precoHora: number,
    precoTotal: number,
    finalizada: boolean,
    precoFixo: number
}