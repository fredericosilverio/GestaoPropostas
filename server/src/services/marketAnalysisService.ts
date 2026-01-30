import moment from 'moment';

export class MarketAnalysisService {
    calculateStatistics(precos: any[]) {
        // Filter out completely invalid or inactive prices before calc if needed
        // For now, we assume 'precos' passed here are candidates for calculation (e.g. active=true)

        if (!precos || precos.length === 0) return { media: 0, mediana: 0, desvioPadrao: 0, precosValidos: [] };

        // Convert decimals to numbers and sort
        const values = precos.map(p => Number(p.valor_unitario)).sort((a, b) => a - b);

        // 1. Calculate Mean
        const total = values.reduce((sum, val) => sum + val, 0);
        const media = total / values.length;

        // 2. Calculate Standard Deviation
        const squareDiffs = values.map(value => Math.pow(value - media, 2));
        const avgSquareDiff = squareDiffs.reduce((sum, val) => sum + val, 0) / values.length;
        const desvioPadrao = Math.sqrt(avgSquareDiff);

        // 3. Calculate Median
        let mediana = 0;
        const mid = Math.floor(values.length / 2);
        if (values.length % 2 !== 0) {
            mediana = values[mid];
        } else {
            mediana = (values[mid - 1] + values[mid]) / 2;
        }

        // 4. Coefficient of Variation
        const cv = (media > 0) ? (desvioPadrao / media) * 100 : 0;

        return {
            media,
            mediana,
            desvioPadrao,
            cv,
            min: values[0],
            max: values[values.length - 1],
            count: values.length,
            // Include reference limits
            limiteInferior: mediana * 0.75,
            limiteSuperior: mediana * 1.25
        };
    }

    classifyPrices(precos: any[], mediana: number) {
        return precos.map(p => {
            const valor = Number(p.valor_unitario);
            const dataColeta = moment(p.data_coleta);
            const now = moment();

            // Rule 1: Date Validity (> 12 months = INVALID)
            if (now.diff(dataColeta, 'months') > 12) {
                return { ...p, classificacao: 'INVALIDO_DATA', motivo_desclassificacao: 'Preço com mais de 12 meses' };
            }

            // Rule 2: 25% Variation from Median
            const limiteInferior = mediana * 0.75;
            const limiteSuperior = mediana * 1.25;

            if (mediana > 0) {
                if (valor < limiteInferior) {
                    return {
                        ...p,
                        classificacao: 'ABAIXO_DO_LIMITE',
                        percentual_variacao: ((valor - mediana) / mediana) * 100
                    };
                }
                if (valor > limiteSuperior) {
                    return {
                        ...p,
                        classificacao: 'ACIMA_DO_LIMITE',
                        percentual_variacao: ((valor - mediana) / mediana) * 100
                    };
                }
            }

            // Rule 3: Accepted
            return {
                ...p,
                classificacao: 'ACEITO',
                percentual_variacao: (mediana > 0) ? ((valor - mediana) / mediana) * 100 : 0
            };
        });
    }
}
