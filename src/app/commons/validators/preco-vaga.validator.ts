import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PrecoVagaValidator {
    static peloMenosUmPreco(): ValidatorFn {
        return (group: AbstractControl): ValidationErrors | null => {
            const precoHora = group.get('precoHora')?.value;
            const precoFixo = group.get('precoFixo')?.value;
            if (!precoHora && !precoFixo) {
                return { peloMenosUmPreco: true };
            }
            return null;
        };
    }
}