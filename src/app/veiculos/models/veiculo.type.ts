import { MarcaVeiculo } from "./marca-veiculo.interface"
import { TipoVeiculo } from "./tipo-veiculo.interface"

export type Veiculo = {
    id?: number,
    modelo: string,
    marca: MarcaVeiculo,
    tipo: TipoVeiculo,
    placa: string,
    cor: string,
    nomeProprietario: string,
    contatoProprietario: string
}