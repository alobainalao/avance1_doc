import React from 'react';
import { BlockMath } from 'react-katex';
import { SlideLayout, EqCard } from '../layouts-v2/slide-components.jsx';

const eq1 = String.raw`S_s \frac{\partial h}{\partial t} - \nabla \cdot (\mathbf{K}\nabla h) = f`;

const eq2 = String.raw`\frac{\partial(\phi CR)}{\partial t}
  - \nabla\!\cdot\!(\mathbf{D}\nabla C)
  + (\mathbf{K}\nabla h)\cdot\nabla C
  + \lambda\phi CR = W`;

const eq3 = String.raw`(\mathbf{K} \nabla h)\cdot \mathbf{n} = -U_k`;
const eq4 = String.raw`(\mathbf{K}\nabla h) \cdot \mathbf{n}= 0`;
const eq5 = String.raw`(\mathbf{D} \nabla C)\cdot \mathbf{n} = 0`;

const eq6 = String.raw`f(x,z) = \tfrac{Q}{2\pi\epsilon^2}
  \exp\!\left(-\tfrac{(x-x_s)^2+(z-z_s)^2}{2\epsilon^2}\right)`;

const eq7 = String.raw`W_{-}(x,z) = \tfrac{C_0}{2\pi\epsilon^2}
  \exp\!\left(-\tfrac{(x-x_p)^2+(z-z_p)^2}{2\epsilon^2}\right)`;

const eq8 = String.raw`W_{+}(x,z,t) =
  \frac{a_1 t\,e^{-8t/T}+a_2(1-e^{-8t/T})}
  {2\pi\epsilon_x\epsilon_z}
  \exp\!\left(-\frac{(x-x_s)^2}{2\epsilon_x^2}-\frac{(z-z_s)^2}{2\epsilon_z^2}\right)`;

const Slide04 = ({ theme = 'dark' }) => (
    <SlideLayout title="Modelo Matemático" theme={theme}>

        <div style={{ display: 'flex', gap: '1.5%', width: '100%' }}>
            <EqCard title="Flujo" num={1} style={{ flex: '0 0 32%' }}>
                <BlockMath math={eq1} />
            </EqCard>
            <EqCard title="Transporte" num={2} className="sl-math-sm" style={{ flex: 1 }}>
                <BlockMath math={eq2} />
            </EqCard>
        </div>

        <EqCard title="Condiciones de frontera" num="3 – 5">
            <div style={{ display: 'flex', gap: '1%' }}>
                <div className="sl-math-sm" style={{ flex: 1 }}><BlockMath math={eq3} /></div>
                <div className="sl-math-sm" style={{ flex: 1 }}><BlockMath math={eq4} /></div>
                <div className="sl-math-sm" style={{ flex: 1 }}><BlockMath math={eq5} /></div>
            </div>
        </EqCard>

        <div style={{ display: 'flex', gap: '2%', width: '100%', alignItems: 'flex-start' }}>
            <div style={{ flex: '0 0 55%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <EqCard title="Fuente de flujo" num={6} className="sl-math-sm">
                    <BlockMath math={eq6} />
                </EqCard>
                <EqCard title="Sumidero de contaminante" num={7} className="sl-math-sm">
                    <BlockMath math={eq7} />
                </EqCard>
            </div>
            <div style={{
                flex: 1,
                border: '1px solid var(--sl-accent)',
                borderRadius: '6px',
                overflow: 'hidden',
            }}>
                <img
                    src={`${process.env.PUBLIC_URL}/fuente.png`}
                    alt="Evolución de la entrada de contaminante"
                    style={{ width: '100%', height: 'auto', display: 'block' }}
                />
            </div>
        </div>

        <EqCard title="Fuente variable en el tiempo" num={8} className="sl-math-sm">
            <BlockMath math={eq8} />
        </EqCard>

    </SlideLayout>
);

export default Slide04;
