export interface TipoVeiculo {
    id: number;
    nome: string;
}
    
export const TIPOS_VEICULO_LIST: TipoVeiculo[] = [
    { id: 1, nome: 'Hatch' },
    { id: 2, nome: 'Sedan' },
    { id: 3, nome: 'Moto' },
    { id: 4, nome: 'SUV' },
    { id: 5, nome: 'Camionete' },
    { id: 6, nome: 'Outro' },
];