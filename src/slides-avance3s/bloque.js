import { OPT } from '../slides-avance3/optimoNitrato.js';

// Utilidades de la versión simplificada. Tanque S_{n+1} = S_n + V_s Q_n Δt − d_n con S_0 = 500 m³ y la demanda por paso
// de la configuración (OPT.demanda, la misma de todas las corridas de la serie 33): reproduce el S exportado por
// codigo/scripts/exportar_optimizacion_presentacion.py (diferencia < 0.6 m³ por el redondeo de la exportación).
export const S0 = OPT.S0[0];
export function tanque(Q) {
    const S = [S0];
    Q.forEach((q, n) => S.push(S[n] + OPT.V_s * q * OPT.dt - OPT.demanda[n]));
    return S;
}
