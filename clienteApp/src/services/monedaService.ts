export type TipoMoneda = 'CRC' | 'USD' | 'EUR';

interface TasaCambio {
  from: TipoMoneda;
  to: TipoMoneda;
  rate: number;
}

const tasasCambio: TasaCambio[] = [
  { from: 'USD', to: 'CRC', rate: 500 },
  { from: 'EUR', to: 'CRC', rate: 600 },
  { from: 'USD', to: 'EUR', rate: 0.85 },
  { from: 'EUR', to: 'USD', rate: 1.18 },
  { from: 'CRC', to: 'USD', rate: 1/500 },
  { from: 'CRC', to: 'EUR', rate: 1/600 }
];

export const convertirMonto = (monto: number, from: TipoMoneda, to: TipoMoneda): number => {
  console.log('convertirMonto input:', { monto, from, to });
  
  if (from === to) return monto;

  const tasaCambio = tasasCambio.find(tasa => tasa.from === from && tasa.to === to);
  if (!tasaCambio) {
    console.error(`No se encontró tasa de cambio directa para ${from} a ${to}, intentando conversión indirecta`);
    
    // Intentar conversión a través de CRC como moneda intermedia
    if (from !== 'CRC' && to !== 'CRC') {
      const tasaACRC = tasasCambio.find(tasa => tasa.from === from && tasa.to === 'CRC');
      const tasaDesdeCRC = tasasCambio.find(tasa => tasa.from === 'CRC' && tasa.to === to);
      
      if (tasaACRC && tasaDesdeCRC) {
        const montoEnCRC = monto * tasaACRC.rate;
        const montoFinal = montoEnCRC * tasaDesdeCRC.rate;
        console.log('Conversión indirecta:', { montoOriginal: monto, montoEnCRC, montoFinal });
        return montoFinal;
      }
    }
    
    throw new Error(`No se encontró tasa de cambio para ${from} a ${to}`);
  }

  const resultado = monto * tasaCambio.rate;
  console.log('Resultado de conversión:', { montoOriginal: monto, tasaCambio: tasaCambio.rate, resultado });
  return resultado;
};

export const formatearMonto = (monto: number, moneda: TipoMoneda): string => {
  return monto.toLocaleString('es-CR', { 
    minimumFractionDigits: 2,
    maximumFractionDigits: 2 
  });
};

export const getMonedaSymbol = (moneda: TipoMoneda): string => {
  switch (moneda) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'CRC':
      return '₡';
  }
}; 