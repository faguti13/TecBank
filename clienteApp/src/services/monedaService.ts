export type TipoMoneda = 'CRC' | 'USD' | 'EUR';

interface TasaCambio {
  from: TipoMoneda;
  to: TipoMoneda;
  rate: number;
}

const tasasCambio: TasaCambio[] = [
  { from: 'USD', to: 'CRC', rate: 500 },
  { from: 'EUR', to: 'CRC', rate: 500 },
  { from: 'USD', to: 'EUR', rate: 1 },
  { from: 'EUR', to: 'USD', rate: 1 },
  { from: 'CRC', to: 'USD', rate: 1/500 },
  { from: 'CRC', to: 'EUR', rate: 1/500 }
];

export const convertirMonto = (monto: number, from: TipoMoneda, to: TipoMoneda): number => {
  if (from === to) return monto;

  const tasaCambio = tasasCambio.find(tasa => tasa.from === from && tasa.to === to);
  if (!tasaCambio) {
    throw new Error(`No se encontró tasa de cambio para ${from} a ${to}`);
  }

  return monto * tasaCambio.rate;
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