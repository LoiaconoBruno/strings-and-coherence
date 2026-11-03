# Cuerdas y coherencia: paper de uso y guía de la idea

## Resumen

Este documento acompaña a **Strings and Coherence**, una página interactiva que toma una imagen intuitiva (dos partículas en el mismo punto, unidas por cuerdas que vibran) y la convierte en dos preguntas que la mecánica cuántica responde con fórmulas exactas. La primera: si una partícula en superposición está atada a cuerdas que vibran, ¿cuánto tarda la vibración en destruir la superposición? La segunda: si dos partículas comparten una cuerda, ¿la vibración compartida puede entrelazarlas?

La primera parte del documento es un paper de uso: controles, ejemplo resuelto con los números de la herramienta, interpretación y límites. La segunda es una guía de la idea: la superposición según Schrödinger y Dirac, el entrelazamiento de Einstein, Podolsky, Rosen y Bell, la teoría de la decoherencia de Zeh y Zurek, el modelo spin-bosón de Caldeira y Leggett, los experimentos de Haroche con fotones en cavidades, y las compuertas de iones atrapados de Cirac y Zoller y de Mølmer y Sørensen. La tesis es doble: la vibración es la principal enemiga de la superposición, pero una sola vibración bien controlada es reversible y puede servir para entrelazar. La decoherencia aparece cuando hay muchas.

## Parte I. Paper de uso

### 1. Qué es la herramienta

Strings and Coherence es una página estática sin dependencias, que se abre desde la [demo en vivo](https://loiaconobruno.github.io/strings-and-coherence/) o con doble clic en `index.html`. Tiene tres tarjetas:

1. **A. Una partícula en superposición, atada a cuerdas que vibran.** Calcula y grafica la coherencia de la superposición en el tiempo.
2. **B. Dos partículas que comparten una cuerda.** Calcula el entrelazamiento que queda después de una "compuerta" de uno o varios períodos de vibración.
3. **¿Y dos partículas en el mismo punto?** Un texto que explica por qué la imagen literal de la idea (dos esferas en el mismo lugar) es otra pregunta, la del principio de exclusión de Pauli y los bosones.

Toda la física está en `src/cuantica.js`, sin acceso al DOM. `src/grafico.js` dibuja y `src/app.js` conecta los controles. Los tests se corren con `npm test` (Node 18 o más nuevo).

### 2. Instalación

```bash
git clone https://github.com/LoiaconoBruno/strings-and-coherence.git
cd strings-and-coherence
npm test
```

Después se abre `index.html` con doble clic.

### 3. Las unidades

La página usa unidades naturales: ħ = 1 y k_B = 1, y la frecuencia típica de las cuerdas es ω = 1. Eso significa que:

- el tiempo se mide en unidades de 1/ω (un período de vibración dura 2π ≈ 6,28);
- la temperatura se mide en unidades de ħω/k_B: T = 1 quiere decir que la energía térmica es igual a la energía de un cuanto de vibración;
- el acoplamiento se da como g/ω, un número sin unidades que compara la fuerza de la interacción con la frecuencia de la cuerda.

Para un ion atrapado con una frecuencia de 1 MHz, T = 1 corresponde a unos 48 µK. Para un fonón de un cristal a 1 THz, a unos 48 K.

### 4. Tarjeta A, control por control

| Control | Rango | Qué representa |
|---|---|---|
| Cantidad de cuerdas | 1 a 100 | Número de modos de vibración acoplados a la partícula |
| Acoplamiento total g/ω | 0 a 0,8 | Fuerza total de la interacción; se reparte entre las cuerdas como g/√n cada una |
| Temperatura | 0 a 10 | Temperatura de las cuerdas en unidades de ħω/k |
| Dispersión de frecuencias | 0 a 1 | Cuánto difieren las frecuencias de las cuerdas: van de ω(1 − d/2) a ω(1 + d/2) |

Resultados:

- **Coherencia mínima:** el valor más bajo que alcanza |ρ₀₁(t)|/|ρ₀₁(0)| en la ventana graficada (t de 0 a 60).
- **¿Vuelve entera?:** si la coherencia regresa a 1 dentro de la ventana.
- **Nivel al que tiende:** la meseta exp(−Σ 4 (gₖ/ωₖ)² coth(ωₖ/2T)), el valor alrededor del cual oscila la coherencia cuando las vueltas de las distintas cuerdas se desfasan.

### 5. Tarjeta B, control por control

| Control | Rango | Qué representa |
|---|---|---|
| Acoplamiento g/ω | 0 a 0,5 | Fuerza con la que cada partícula empuja la cuerda compartida |
| Períodos de la compuerta | 1 a 4 | Cuántas vueltas completas da la cuerda antes de terminar |
| Temperatura de la cuerda | 0 a 10 | Cuán caliente está la cuerda al empezar |

Resultados:

- **Entrelazamiento al terminar:** la concurrencia de Wootters, de 0 % (nada) a 100 % (máximo).
- **g/ω para el máximo:** el menor acoplamiento que da entrelazamiento máximo con esa cantidad de períodos, 1/(4√n).

El gráfico de la derecha muestra, durante la compuerta, cuánto están enredadas las partículas con la cuerda: la curva baja (más cuanto más caliente) y vuelve a 1 al final de cada período.

### 6. Ejemplo resuelto

**Versión A, una cuerda.** Con 1 cuerda, g/ω = 0,3 y T = 1:

1. El factor térmico es coth(ω/2T) = coth(0,5) ≈ 2,164.
2. El mínimo ocurre a mitad de período (ωt = π), donde 1 − cos ωt = 2. El exponente es 4 · 0,09 · 2 · 2,164 ≈ 1,558.
3. La coherencia mínima es e^(−1,558) ≈ **21 %**.
4. En t = 2π, 1 − cos ωt = 0 y la coherencia **vuelve entera**. La página responde "Sí".

**Versión A, cincuenta cuerdas.** Se sube la cantidad a 50, con dispersión 0,6: las frecuencias van de 0,7 a 1,3 y cada cuerda tiene acoplamiento 0,3/√50 ≈ 0,042. La coherencia mínima es **18 %**, ya **no vuelve** dentro de la ventana y tiende a un nivel de **39 %**. La suma de g² es la misma que con una cuerda; lo que cambió es que las cuerdas vibran a frecuencias distintas y sus vueltas no coinciden.

**Versión A, más calor.** Con las mismas 50 cuerdas y T = 5, la coherencia cae a **0 %** y la meseta es **1 %**: coth(0,1) ≈ 10, así que el exponente es unas diez veces más grande que a temperatura cero.

**Versión B.** Con g/ω = 0,25, 1 período y cualquier temperatura, el entrelazamiento al terminar es **100 %**: 8π · 1 · 0,0625 = π/2 y |sen(π/2)| = 1. Con 2 períodos y el mismo acoplamiento, la fase se duplica a π y el entrelazamiento vuelve a **0 %**. El óptimo para 2 períodos es g/ω = 1/(4√2) ≈ **0,177**.

### 7. Cómo leer los resultados

- **Coherencia** es la medida de cuánto "sigue siendo cuántica" la superposición. Un 100 % es una superposición perfecta; un 0 % es una mezcla clásica, como una moneda que está en cara o en cruz pero no sabemos cuál.
- Que la coherencia **vuelva** con una cuerda significa que la información "se fue" a la cuerda y regresó. No se perdió. Es una pérdida aparente, reversible.
- Que **no vuelva** con muchas cuerdas significa que la información se repartió en tantos modos con tantas frecuencias distintas que, en la práctica, no regresa nunca. Eso es la decoherencia.
- El **entrelazamiento** de la versión B no depende de la temperatura porque, al final de cada período, la cuerda vuelve exactamente a su estado inicial, sea cual sea. Las partículas quedan correlacionadas entre sí y desacopladas de la cuerda.

#### 7.1 Preguntas frecuentes

**¿Por qué la coherencia mínima con 50 cuerdas (18 %) es más baja que la meseta (39 %)?** Porque al principio todas las cuerdas están casi en fase y alcanzan juntas su máximo desplazamiento cerca de ωt ≈ π. Después se desfasan y el valor queda oscilando alrededor de la meseta. El mínimo es un efecto transitorio.

**¿Volvería alguna vez la coherencia con 50 cuerdas?** Sí, en principio. Con frecuencias equiespaciadas a distancia Δω, hay una recurrencia a un tiempo del orden de 2π/Δω. Con 50 cuerdas entre 0,7 y 1,3, Δω ≈ 0,012 y la recurrencia ocurre cerca de t ≈ 500, muy fuera de la ventana graficada. Con un baño real (un continuo de frecuencias), el tiempo de recurrencia es infinito en la práctica.

**¿Por qué el acoplamiento se reparte como g/√n?** Para comparar situaciones con la misma "fuerza total". Lo que entra en la meseta es la suma de (gₖ/ωₖ)², y con gₖ = g/√n esa suma es la misma que con una cuerda (si las frecuencias fueran todas iguales). Así, la diferencia entre 1 y 50 cuerdas se debe solo al desfase, no a que haya más acoplamiento.

**¿Qué pasa a temperatura cero?** coth(∞) = 1 y queda solo el efecto de las fluctuaciones cuánticas de la cuerda (su energía de punto cero). La coherencia igual baja: incluso una cuerda en su estado fundamental "registra" en qué estado está la partícula.

**¿La versión B es realista?** Es la versión idealizada de una compuerta que se hace en laboratorios de iones atrapados. Los experimentos reales usan láseres para generar la fuerza dependiente del espín y tienen errores por calentamiento, ruido de los láseres y modos espectadores. La herramienta no modela esos errores.

#### 7.2 Recorrido guiado de 20 minutos

Este recorrido sirve para una clase o para explorar la herramienta por primera vez. Cada paso tiene una pregunta para responder antes de mover el control.

1. **Sin acoplamiento.** Tarjeta A con g/ω = 0. *¿Qué esperás que pase con la coherencia?* Queda en 100 % para siempre: si la partícula no empuja a la cuerda, la cuerda no se entera de nada.
2. **Acoplamiento chico.** g/ω = 0,1, una cuerda, T = 0. *¿Cuánto baja?* Apenas: exp(−8 · 0,01) ≈ 92 %. Las dos huellas casi se superponen.
3. **Acoplamiento fuerte.** g/ω = 0,6. *¿Y ahora?* El mínimo cae a exp(−8 · 0,36) ≈ 6 %, pero la coherencia vuelve entera cada período. Este es el momento de insistir en que "baja mucho" no es lo mismo que "se pierde".
4. **Calor.** Con g/ω = 0,3, subí T de 0 a 10 y mirá cómo se ahonda el mínimo. *¿La coherencia sigue volviendo?* Sí: con una cuerda, ninguna temperatura impide el regreso.
5. **Muchas cuerdas, sin dispersión.** Poné 50 cuerdas y dispersión 0. *¿Vuelve?* Sí, porque todas tienen la misma frecuencia y se comportan como una sola.
6. **Muchas cuerdas, con dispersión.** Subí la dispersión a 0,6. *¿Vuelve?* Ya no. Este es el paso clave: la irreversibilidad aparece por la variedad de frecuencias, no por la cantidad de acoplamiento.
7. **La compuerta.** Pasá a la tarjeta B con g/ω = 0,25 y un período. Subí la temperatura de 0 a 10. *¿Cambia el entrelazamiento final?* No: queda en 100 %. Mirá el gráfico de la derecha: durante la compuerta la curva baja más cuanto más caliente, pero siempre vuelve a 1 al final.
8. **El error de tiempo.** Con 2 períodos, buscá a mano el acoplamiento que da 100 %. Comparalo con el valor que informa la página (0,177).

Al final del recorrido conviene volver a la pregunta original: ¿la vibración destruye o crea correlaciones cuánticas? La respuesta que deja la herramienta es "las dos cosas, según cuántas vibraciones haya y quién las controle".

### 8. Limitaciones

- Modelo idealizado: acoplamiento lineal, cuerdas armónicas, sin pérdidas de energía. La partícula tiene solo dos estados.
- La meseta de la versión A es exacta solo para tiempos largos frente al desfase y cortos frente a la recurrencia.
- La compuerta de la versión B está idealizada: en los experimentos las fases dependen de cómo se aplican los láseres y hay errores.
- No simula "dos partículas en el mismo punto"; la página explica por qué esa es otra pregunta.

## Parte II. Guía de la idea

### 9. De la imagen a la pregunta

La idea original era una imagen: dos partículas en el mismo lugar, unidas por cuerdas que vibran, como si la vibración las mantuviera en un estado especial. Es una imagen sugerente pero mezcla conceptos. En mecánica cuántica, "superposición" no es dos cosas en el mismo lugar; es **una** cosa en una combinación de estados. Y "dos partículas en el mismo punto" es un tema distinto, el de la estadística cuántica (fermiones y bosones).

Lo que la intuición capta bien es otra cosa: que **la vibración y la superposición están íntimamente relacionadas**. Una superposición acoplada a algo que vibra puede perderse (decoherencia) y dos superposiciones acopladas a la misma vibración pueden correlacionarse (entrelazamiento). Esas son las dos preguntas que la herramienta responde con fórmulas exactas. Lo que sigue es la historia y la física de esas dos preguntas.

### 10. La superposición

#### 10.1 Schrödinger, Dirac y la regla de la suma

En la mecánica cuántica, el estado de un sistema se describe con un vector en un espacio abstracto. Si |0⟩ y |1⟩ son dos estados posibles (por ejemplo, un átomo en el nivel fundamental o excitado, o un espín apuntando hacia arriba o hacia abajo), cualquier combinación

$$ |ψ⟩ = α |0⟩ + β |1⟩,   |α|² + |β|² = 1 $$

también es un estado posible. Paul Dirac llamó a esto el **principio de superposición** y lo puso en el centro de *The Principles of Quantum Mechanics* (1930). Erwin Schrödinger había formulado en 1926 la ecuación que gobierna cómo evoluciona ese vector en el tiempo, y su linealidad es la que garantiza que las superposiciones se mantengan.

Una superposición no es ignorancia. Si el átomo estuviera "en realidad" en |0⟩ o en |1⟩ y nosotros no supiéramos cuál, las probabilidades se sumarían. En una superposición, las **amplitudes** se suman y pueden interferir: es lo que produce las franjas en el experimento de la doble rendija.

#### 10.2 La matriz densidad y la coherencia

Para distinguir una superposición de una mezcla clásica se usa la **matriz densidad** ρ, introducida por John von Neumann en *Mathematische Grundlagen der Quantenmechanik* (1932). Para el estado de arriba:

$$ ρ = [[|α|², α β*], [α* β, |β|²]] $$

Los elementos de la diagonal son las probabilidades de encontrar 0 o 1. Los de fuera de la diagonal, ρ₀₁ = αβ*, son las **coherencias**: miden la capacidad de interferir. Una mezcla clásica tiene la misma diagonal pero ρ₀₁ = 0. La herramienta grafica exactamente |ρ₀₁(t)|/|ρ₀₁(0)|: cuánto de la coherencia inicial sobrevive.

#### 10.3 El gato de Schrödinger

En 1935, Schrödinger publicó en *Die Naturwissenschaften* un largo artículo, *Die gegenwärtige Situation in der Quantenmechanik*, donde aparece su famoso gato: si un átomo radiactivo en superposición de "decayó" y "no decayó" está conectado a un mecanismo que mata a un gato, la teoría parecería decir que el gato queda en superposición de vivo y muerto. Schrödinger lo planteó como una reducción al absurdo: algo falta en la teoría si predice gatos superpuestos que nadie ve.

La pregunta de por qué no vemos superposiciones a escala macroscópica es exactamente la que la decoherencia responde, y la herramienta muestra el mecanismo en su versión más simple.

### 11. El entrelazamiento

#### 11.1 Einstein, Podolsky y Rosen

En mayo de 1935, Albert Einstein, Boris Podolsky y Nathan Rosen publicaron *Can quantum-mechanical description of physical reality be considered complete?* (*Physical Review*, 47, 777–780). Mostraron que la mecánica cuántica permite estados de dos partículas en los que medir una determina instantáneamente el resultado de medir la otra, aunque estén lejos. Concluyeron que la teoría debía estar incompleta.

Schrödinger respondió el mismo año con el artículo del gato y con otro en los *Proceedings of the Cambridge Philosophical Society* (31, 555–563), donde acuñó la palabra **entrelazamiento** (*Verschränkung*) y dijo que no era "un" rasgo característico de la mecánica cuántica sino "el" rasgo característico.

#### 11.2 Bell y los experimentos

En 1964, John Stewart Bell demostró (*Physics*, 1, 195–200) que ninguna teoría con variables ocultas locales puede reproducir todas las predicciones de la mecánica cuántica para estados entrelazados: hay desigualdades que las teorías locales cumplen y la mecánica cuántica viola. John Clauser y Stuart Freedman hicieron las primeras pruebas en 1972; Alain Aspect, Philippe Grangier y Gérard Roger las hicieron concluyentes en 1982 (*Physical Review Letters*, 49, 91–94), y Anton Zeilinger y su grupo extendieron estas pruebas a distancias y escenarios cada vez más exigentes. Aspect, Clauser y Zeilinger recibieron el Premio Nobel de Física en 2022.

#### 11.3 Cómo se mide: la concurrencia

Para dos sistemas de dos niveles (dos qubits) hay una medida estándar del entrelazamiento: la **concurrencia**, definida por William Wootters en 1998 (*Physical Review Letters*, 80, 2245–2248). Para un estado puro a|00⟩ + b|01⟩ + c|10⟩ + d|11⟩ vale

$$ C = 2 |a d − b c| $$

Va de 0 (estado producto, sin entrelazamiento) a 1 (entrelazamiento máximo, como un estado de Bell). La versión B de la herramienta informa la concurrencia en porcentaje.

### 12. La decoherencia: por qué no vemos gatos superpuestos

#### 12.1 Zeh, 1970

Durante décadas, la transición de lo cuántico a lo clásico se trató como un postulado: al medir, la función de onda "colapsa". En 1970, el físico alemán H. Dieter Zeh publicó *On the interpretation of measurement in quantum theory* (*Foundations of Physics*, 1, 69–76), donde señaló algo que se había pasado por alto: ningún sistema macroscópico está aislado. Interactúa constantemente con su entorno (moléculas de aire, fotones, vibraciones), y esa interacción entrelaza al sistema con el entorno. Si después miramos solo el sistema, sin seguir el entorno, las coherencias desaparecen.

#### 12.2 Zurek y la einselección

Wojciech Zurek desarrolló la idea en los años ochenta, primero en *Pointer basis of quantum apparatus: Into what mixture does the wave packet collapse?* (*Physical Review D*, 24, 1516, 1981) y después en una revisión muy citada, *Decoherence, einselection, and the quantum origins of the classical* (*Reviews of Modern Physics*, 75, 715–775, 2003). Zurek mostró que el entorno no destruye cualquier superposición por igual: "elige" ciertos estados (los **estados puntero**) que son robustos a la interacción, y destruye rápidamente las superposiciones entre ellos. A eso lo llamó *einselection* (selección inducida por el entorno). Erich Joos y Zeh calcularon en 1985 (*Zeitschrift für Physik B*, 59, 223–243) cuán rápido ocurre: una partícula de polvo en el aire pierde su superposición de posiciones en tiempos absurdamente cortos, del orden de 10⁻³¹ segundos.

Maximilian Schlosshauer resumió el campo en *Decoherence and the Quantum-to-Classical Transition* (Springer, 2007), el libro de referencia sobre el tema.

#### 12.3 El mecanismo, en una oración

La decoherencia ocurre porque **el entorno registra información sobre el sistema**. Si cada estado de la partícula deja una "huella" distinta en las cuerdas, y esas huellas son distinguibles, la superposición de la partícula se convierte, desde el punto de vista de la partícula sola, en una mezcla. La coherencia que queda es exactamente el **solapamiento** entre las dos huellas.

Eso es lo que calcula la versión A de la herramienta.

### 13. El modelo: una partícula y sus cuerdas

#### 13.1 El hamiltoniano

La partícula tiene dos estados, que se describen con el operador σz (vale +1 en |0⟩ y −1 en |1⟩). Cada cuerda es un oscilador armónico cuántico de frecuencia ωₖ, con operadores de creación y destrucción aₖ† y aₖ. El hamiltoniano es

$$ H = Σₖ ωₖ aₖ† aₖ + σz Σₖ gₖ (aₖ + aₖ†) $$

El segundo término dice que la partícula empuja a cada cuerda con una fuerza proporcional a gₖ, en un sentido si está en |0⟩ y en el opuesto si está en |1⟩. No hay término que cambie el estado de la partícula: las probabilidades de 0 y 1 se conservan. Solo la coherencia puede cambiar. Por eso este modelo se llama de **desfasaje puro** (*pure dephasing*).

Es un caso particular del **modelo spin-bosón**, uno de los modelos más estudiados de la física de sistemas cuánticos abiertos. Amir Caldeira y Anthony Leggett estudiaron en 1983 (*Physica A*, 121, 587–616) el movimiento browniano cuántico con un baño de osciladores, y Leggett y colaboradores publicaron en 1987 la revisión clásica *Dynamics of the dissipative two-state system* (*Reviews of Modern Physics*, 59, 1–85). El caso de desfasaje puro tiene solución exacta, que G. Massimo Palma, Kalle-Antti Suominen y Artur Ekert analizaron en 1996 para estimar cómo la decoherencia afecta a una computadora cuántica (*Proceedings of the Royal Society A*, 452, 567–584). Heinz-Peter Breuer y Francesco Petruccione lo desarrollan en *The Theory of Open Quantum Systems* (Oxford, 2002).

#### 13.2 Las dos huellas

Si la partícula está en |0⟩, cada cuerda se comporta como un oscilador empujado por una fuerza constante: su posición de equilibrio se corre y la cuerda oscila alrededor de la nueva posición. Si está en |1⟩, se corre al revés. En el lenguaje de los estados coherentes de Roy Glauber (*Physical Review*, 131, 2766, 1963), el estado de la cuerda en cada rama es un estado coherente desplazado por

$$ α±(t) = ± (gₖ/ωₖ) (e^(−iωₖt) − 1) $$

La distancia entre las dos huellas en el espacio de fases es |α₊ − α₋|² = 8 (gₖ/ωₖ)² (1 − cos ωₖt). Al principio es cero (las dos ramas empiezan con la cuerda en el mismo lugar), crece hasta un máximo a mitad de período y vuelve a cero después de un período completo.

#### 13.3 El solapamiento y la temperatura

El solapamiento entre dos estados coherentes separados por una distancia |Δα| es e^(−|Δα|²/2). Si la cuerda empieza en equilibrio térmico a temperatura T en vez de en su estado fundamental, las fluctuaciones térmicas multiplican ese exponente por coth(ω/2T), que vale 1 a temperatura cero y crece como 2T/ω a temperatura alta. Juntando todo, la coherencia que queda es

$$ |ρ₀₁(t)| / |ρ₀₁(0)| = Πₖ exp(−4 (gₖ/ωₖ)² (1 − cos ωₖt) · coth(ωₖ / 2T)) $$

Esta es la fórmula exacta que implementa la función `coherencia` de `src/cuantica.js`, a través de `exponenteModo` y `factorTermico`. No hay aproximación: para este modelo, es la respuesta completa.

#### 13.4 Una cuerda: pérdida reversible

Con una sola cuerda, el factor (1 − cos ωt) vuelve a cero cada período 2π/ω. La coherencia cae, llega a un mínimo de exp(−8 (g/ω)² coth(ω/2T)) a mitad de período, y vuelve **entera**. La información sobre el estado de la partícula estuvo un rato en la cuerda y regresó. No hubo decoherencia en sentido estricto: hubo un entrelazamiento transitorio con la cuerda que se deshizo solo.

Esto tiene una versión experimental célebre. En 1996, el grupo de Serge Haroche en la École Normale Supérieure preparó un átomo en superposición, lo hizo interactuar con un campo de microondas en una cavidad superconductora (una "cuerda" de luz) y midió cómo la superposición del campo se iba volviendo una mezcla (Brune et al., *Physical Review Letters*, 77, 4887–4890). Fue la primera observación directa de la decoherencia progresiva de un "medidor". Haroche y David Wineland, que hizo experimentos análogos con iones, recibieron el Premio Nobel de Física en 2012 "por métodos experimentales innovadores que permiten medir y manipular sistemas cuánticos individuales".

#### 13.5 Muchas cuerdas: pérdida irreversible

Con muchas cuerdas de frecuencias distintas, cada una vuelve a cero en un tiempo distinto. Después de un rato, los factores (1 − cos ωₖt) están desfasados y su suma oscila alrededor de un valor promedio: como el promedio de cos ωₖt es cero, el exponente tiende a

$$ Σₖ 4 (gₖ/ωₖ)² coth(ωₖ / 2T) $$

y la coherencia, a la **meseta** que la herramienta muestra como "nivel al que tiende". Con un continuo de frecuencias (un baño real) ya no hay recurrencias: la información sobre la partícula se repartió en infinitos modos y no vuelve. Eso es la decoherencia irreversible.

La herramienta lo muestra con un número: con la misma fuerza total de acoplamiento, una cuerda devuelve el 100 % de la coherencia cada período y cincuenta cuerdas la dejan en 39 %. La diferencia no es la fuerza sino el **número de lugares** donde se esconde la información.

Este es el punto central de la idea: **una sola vibración no destruye la superposición; muchas sí**. La irreversibilidad de la decoherencia, como la de la termodinámica, es un efecto de muchos grados de libertad.

#### 13.6 Por qué el calor empeora todo

El factor coth(ω/2T) crece linealmente con la temperatura cuando T ≫ ω. Una cuerda caliente no está en un solo estado sino en una mezcla de muchos estados de vibración, y cada uno de ellos se desplaza distinto según el estado de la partícula. Las huellas de las dos ramas se distinguen entonces en muchos más detalles que con la cuerda fría: una cuerda caliente tiene más formas de "anotar" en qué estado está la partícula. Con T = 5, el exponente es unas diez veces mayor que a T = 0, y la coherencia cae prácticamente a cero.

Por eso los experimentos de computación cuántica se hacen a temperaturas extremadamente bajas: los qubits superconductores a unos 10 mK, en refrigeradores de dilución, y los iones atrapados enfriados con láser hasta casi su estado fundamental de vibración.

#### 13.7 De la fórmula a una tasa: el baño continuo

En un material real, la partícula no está atada a 50 cuerdas sino a un continuo de modos de vibración: los fonones de un cristal, los modos electromagnéticos del entorno. En ese caso la suma sobre k se reemplaza por una integral con una **densidad espectral** J(ω), que dice cuánto acoplamiento hay en cada frecuencia:

$$ Γ(t) = ∫ dω · J(ω)/ω² · (1 − cos ωt) · coth(ω/2T) $$

y la coherencia es e^(−Γ(t)). Leggett y colaboradores clasificaron los baños según cómo crece J(ω) a frecuencias bajas. El caso más común es el **óhmico**, J(ω) ∝ ω, que corresponde a un rozamiento proporcional a la velocidad en la física clásica. Para un baño óhmico a temperatura alta y tiempos largos, la integral crece linealmente con el tiempo, Γ(t) ≈ t/T₂, y la coherencia decae como una exponencial simple:

$$ |ρ₀₁(t)| ≈ |ρ₀₁(0)| · e^(−t/T₂) $$

El tiempo T₂ es el **tiempo de desfasaje** que los experimentales miden en resonancia magnética nuclear desde los años cincuenta (Felix Bloch introdujo la notación T₁ y T₂ en 1946), y que hoy se informa para cada qubit de una computadora cuántica. En los qubits superconductores típicos, T₂ es del orden de cien microsegundos; en los iones atrapados puede llegar a segundos o minutos.

La herramienta no llega a ese límite continuo, pero muestra su origen: con 50 cuerdas de frecuencias distintas, la curva ya no vuelve y se parece cada vez más a un decaimiento. Si se pudiera subir el número de cuerdas a infinito y repartir sus frecuencias según J(ω), la meseta se convertiría en el decaimiento exponencial de un T₂.

### 14. Superposiciones grandes y su fragilidad

Si la decoherencia crece con el tamaño del objeto, ¿hasta dónde se puede llegar? Markus Arndt, Anton Zeilinger y colaboradores mostraron en 1999 interferencia con moléculas de fullereno C₆₀, de 60 átomos de carbono (*Nature*, 401, 680–682). En 2003, Klaus Hornberger y colaboradores midieron cómo esa interferencia se destruye a medida que se agrega gas al aparato: cada colisión con una molécula de gas es una "cuerda" que registra por dónde pasó el fullereno (*Physical Review Letters*, 90, 160401). Fue una medición cuantitativa de la decoherencia colisional, en acuerdo con la teoría.

Desde entonces se lograron superposiciones con moléculas de miles de átomos, y en 2019 con moléculas de más de 25 000 unidades de masa atómica (Fein et al., *Nature Physics*, 15, 1242–1245). En el otro extremo, los experimentos de optomecánica llevaron osciladores mecánicos visibles al microscopio (membranas, tambores de micrómetros) a su estado fundamental cuántico, y se los entrelazó con luz o con otros osciladores. El límite entre lo cuántico y lo clásico no es una frontera fija: es una cuestión de cuán bien se aísla un sistema de sus "cuerdas".

### 15. La otra cara: una cuerda que entrelaza

#### 15.1 El modelo de la versión B

Si dos partículas empujan la **misma** cuerda, el hamiltoniano es

$$ H = ω a† a + g (σz₁ + σz₂)(a + a†) $$

La suma σz₁ + σz₂ vale +2 si las dos están en |0⟩, −2 si están en |1⟩ y 0 si están en estados opuestos. La cuerda siente una fuerza que depende del estado **conjunto**. Si las partículas están opuestas, la cuerda no se mueve; si están alineadas, se mueve el doble que con una sola.

#### 15.2 La fase geométrica

Un oscilador empujado con una fuerza constante describe, en el espacio de fases, un círculo: se aleja de su punto de partida y vuelve después de un período. Al cerrar el círculo, el estado de la cuerda es exactamente el inicial, pero el estado conjunto adquiere una **fase** proporcional al área encerrada. Michael Berry mostró en 1984 (*Proceedings of the Royal Society A*, 392, 45–57) que las fases de este tipo son geométricas: dependen del camino recorrido, no de los detalles de la velocidad.

Para la fuerza 2g, después de n períodos, la fase de las ramas alineadas respecto de las opuestas es

$$ φ = 8 π n (g/ω)² $$

y, partiendo de las dos partículas en la superposición (|0⟩ + |1⟩)/√2, el estado final tiene concurrencia

$$ C = |sen(8 π n (g/ω)²)| $$

que es la función `concurrencia` de la herramienta. Para n = 1 es máxima con g/ω = 1/4; en general, con g/ω = 1/(4√n), la función `gOptimo`.

#### 15.3 Por qué no importa la temperatura

La propiedad más notable de esta compuerta es que el resultado no depende del estado inicial de la cuerda. Al final de cada período el desplazamiento de la cuerda vuelve exactamente a cero, sea cual sea su estado de partida, y la fase acumulada depende solo del área del círculo, que no depende del estado. Por eso la herramienta da 100 % a cualquier temperatura. El gráfico de la derecha muestra el costo: **durante** la compuerta las partículas están entrelazadas con la cuerda (más cuanto más caliente), y solo al final se desenganchan.

Klaus Mølmer y Anders Sørensen descubrieron esta propiedad en 1999 en el contexto de iones atrapados (*Physical Review Letters*, 82, 1835–1838 y 82, 1971–1974). Su compuerta funciona con iones "calientes", algo que la propuesta original de Ignacio Cirac y Peter Zoller (*PRL*, 74, 4091–4094, 1995) no permitía: Cirac y Zoller necesitaban la vibración en su estado fundamental. En 2003, Dietrich Leibfried y colaboradores del NIST demostraron una compuerta de fase geométrica de alta fidelidad con dos iones de berilio, exactamente con el acoplamiento σz de la versión B (*Nature*, 422, 412–415).

#### 15.4 Las cuerdas de verdad: iones en una trampa

En una trampa de iones, varios átomos cargados se alinean en una cadena y se repelen eléctricamente. Ese conjunto tiene modos de vibración colectivos: por ejemplo, el modo "centro de masa", en el que todos se mueven juntos. Ese modo es la cuerda compartida. Con láseres se aplica una fuerza que depende del estado interno de cada ion (el qubit), y la cuerda se desplaza según el estado conjunto. Es casi literalmente la imagen de la idea original: partículas unidas por una vibración compartida.

Hoy, las computadoras cuánticas de iones atrapados (de empresas como Quantinuum o IonQ y de varios laboratorios académicos) usan variantes de la compuerta de Mølmer-Sørensen como su operación de dos qubits principal, con fidelidades que superan el 99,9 %.

### 16. Las dos caras juntas: la vibración como enemiga y como herramienta

Las versiones A y B son el mismo fenómeno visto desde lados opuestos. En ambas, el estado de las partículas se imprime en la vibración. En la A, esa impresión es indeseada: la vibración "sabe" demasiado y la superposición se pierde. En la B, la impresión es controlada: la vibración sabe lo justo durante el tiempo justo, y al devolver la información deja una correlación entre las partículas.

La diferencia está en tres cosas:

1. **Cuántas cuerdas.** Una sola cuerda devuelve la información; muchas la dispersan.
2. **Cuándo se mira.** En la B se termina la compuerta justo al final de un período, cuando la cuerda se desenganchó. Mirar a mitad de camino daría partículas entrelazadas con la cuerda.
3. **Quién controla.** En la A, las cuerdas son el entorno, que nadie controla. En la B, la cuerda es una parte diseñada del aparato.

Esa es la tensión central de toda la ingeniería cuántica: necesitamos que los qubits interactúen fuertemente entre sí (para operar) y débilmente con todo lo demás (para no perder coherencia). John Preskill la resumió al acuñar el término "era NISQ" (*Quantum*, 2, 79, 2018): hoy tenemos dispositivos cuánticos ruidosos de escala intermedia, cuyo límite es exactamente la decoherencia que muestra la versión A.

Hay una tercera estrategia, además de aislar mejor y de controlar las vibraciones: **corregir los errores**. En 1995, Peter Shor mostró que es posible proteger un qubit lógico repartiéndolo entre nueve qubits físicos, de modo que la decoherencia de cualquiera de ellos se pueda detectar y deshacer sin medir (y destruir) la información cuántica (*Physical Review A*, 52, R2493–R2496). La idea es, en cierto sentido, la versión A al revés: si la información se va a dispersar en muchos lugares, conviene que esos lugares sean qubits que controlamos y no cuerdas del entorno. En 2023 y 2024 varios grupos mostraron por primera vez qubits lógicos que, al agrandar el código, pierden coherencia más lentamente que los qubits físicos que los forman: la decoherencia no se vence, pero se puede administrar.

### 17. Qué resuelve la decoherencia y qué no

La decoherencia a veces se presenta como la solución del problema de la medición. No lo es del todo, y vale la pena ser preciso.

**Lo que explica.** Por qué no vemos interferencia entre estados macroscópicamente distintos: el entorno los vuelve indistinguibles de una mezcla en tiempos ridículamente cortos. Por qué ciertos estados (posiciones bien definidas para objetos grandes, por ejemplo) son los que vemos y no sus superposiciones: son los estados puntero que el entorno selecciona. Y por qué la transición parece irreversible: la información se dispersa en muchos grados de libertad, como en la versión A con muchas cuerdas.

**Lo que no explica.** Por qué, en cada medición individual, vemos **un** resultado y no el otro. Después de la decoherencia, el estado total (sistema más entorno) sigue siendo una superposición; lo que desapareció es la posibilidad práctica de ver interferencia. Para pasar de "una mezcla de dos resultados" a "este resultado" hace falta una interpretación. Niels Bohr y la escuela de Copenhague postulaban un corte entre el sistema cuántico y el aparato clásico. Hugh Everett III propuso en 1957 (*Reviews of Modern Physics*, 29, 454–462) que todas las ramas siguen existiendo y que el observador queda entrelazado con cada una (la interpretación de los "muchos mundos"). Otras propuestas modifican la ecuación de Schrödinger para que el colapso sea un proceso físico, como el modelo de Ghirardi, Rimini y Weber (1986).

Maximilian Schlosshauer analizó este debate en *Decoherence, the measurement problem, and interpretations of quantum mechanics* (*Reviews of Modern Physics*, 76, 1267–1305, 2004). Su conclusión es que la decoherencia es compatible con todas las interpretaciones principales y es un ingrediente necesario de cualquiera de ellas, pero no elige entre ellas.

Para la herramienta, esto significa algo concreto: la "coherencia" que grafica es la de la partícula **sola**. El estado conjunto de la partícula y las cuerdas sigue siendo puro todo el tiempo. Si se pudiera controlar cada una de las cincuenta cuerdas y deshacer su movimiento, la coherencia volvería. Eso es exactamente lo que ocurre con una sola cuerda al completar un período, y lo que se aprovecha en la versión B.

### 18. ¿Y dos partículas en el mismo punto?

La imagen original pedía dos partículas en el mismo lugar. La mecánica cuántica tiene una respuesta, pero no es la de las cuerdas.

Las partículas idénticas se dividen en dos familias. Los **fermiones** (electrones, protones, neutrones) obedecen el principio de exclusión que Wolfgang Pauli formuló en 1925 (*Zeitschrift für Physik*, 31, 765–783): dos fermiones idénticos no pueden ocupar el mismo estado cuántico. Es la razón por la que los átomos tienen capas de electrones y la materia ocupa espacio. Los **bosones** (fotones, ciertos átomos como el rubidio 87) pueden ocupar el mismo estado, e incluso "prefieren" hacerlo. Satyendra Nath Bose y Einstein predijeron en 1924–1925 que un gas de bosones, a temperatura suficientemente baja, se acumularía en masa en el estado de menor energía. Ese **condensado de Bose-Einstein** se logró en 1995: Eric Cornell y Carl Wieman con rubidio (Anderson et al., *Science*, 269, 198–201) y Wolfgang Ketterle con sodio (Davis et al., *PRL*, 75, 3969–3973). Los tres recibieron el Premio Nobel en 2001.

Así que "dos partículas en el mismo punto" es posible para bosones y prohibido para fermiones, y no necesita cuerdas. La herramienta lo explica en su tercera tarjeta y se concentra en la parte de la idea que sí habla de vibraciones.

### 19. Del modelo al código

| Concepto | Función en `src/cuantica.js` | Qué produce en la página |
|---|---|---|
| Factor térmico coth(ω/2T) | `factorTermico(omega, T)` | Cómo la temperatura agranda la pérdida |
| Exponente de un modo | `exponenteModo(t, {omega, g, T})` | El término 4(g/ω)²(1 − cos ωt) coth(ω/2T) |
| Frecuencias y acoplamientos de las cuerdas | `modos({n, omega0, dispersion, g})` | n cuerdas entre ω(1 − d/2) y ω(1 + d/2), con g/√n cada una |
| Coherencia exacta | `coherencia(t, p)` | La curva de la tarjeta A |
| Meseta | `meseta(p)` | "Nivel al que tiende" |
| Concurrencia de la compuerta | `concurrencia(g, n)` | "Entrelazamiento al terminar" |
| Acoplamiento óptimo | `gOptimo(n)` | "g/ω para el máximo" |
| Enredo con la cuerda durante la compuerta | `coherenciaDuranteCompuerta(t, …)` | El gráfico de la tarjeta B |

Los tests (`test/cuantica.test.js`) verifican: que con una cuerda la coherencia vuelve entera cada período; que el mínimo es exp(−8(g/ω)² coth(ω/2T)) a mitad de período; que a temperatura cero solo quedan las fluctuaciones cuánticas; que más temperatura da más pérdida; que con muchas cuerdas la coherencia se queda en la meseta; que el reparto de acoplamiento conserva la suma de g²; que con g/ω = 1/4 y un período el entrelazamiento es máximo, y que al final de cada período las partículas se desenganchan de la cuerda a cualquier temperatura.

Uso desde Node:

```js
const Q = require("./src/cuantica.js");
Q.meseta({ n: 50, g: 0.3, T: 1, dispersion: 0.6 });   // ≈ 0,39
Q.concurrencia(0.25, 1);                               // 1
Q.gOptimo(2);                                          // ≈ 0,177
```

### 20. Ejercicios

1. Con una cuerda y T = 0, ¿qué g/ω hace que la coherencia mínima sea 50 %? Despejá de exp(−8(g/ω)²) = 0,5 y comprobalo con el deslizador.
2. Mostrá que, para T ≫ ω, coth(ω/2T) ≈ 2T/ω. ¿Cómo depende entonces la meseta de la temperatura?
3. Con 100 cuerdas y dispersión 0, ¿la coherencia vuelve? ¿Por qué? Explicalo con la fórmula.
4. En la versión B, ¿qué pasa si la compuerta se detiene a mitad de período? Calculá la coherencia entre las ramas alineadas y opuestas en ωt = π.
5. Escribí el estado final de la versión B para g/ω = 1/4 y verificá con la fórmula de Wootters que la concurrencia es 1.
6. Un ion de calcio en una trampa tiene un modo de 1 MHz. ¿A qué temperatura en kelvin corresponde T = 1 en la herramienta? (ħω/k_B.)
7. Leé el artículo de Mølmer y Sørensen de 1999 y explicá con tus palabras por qué la compuerta no depende de la temperatura.

### 21. Glosario

- **Superposición:** estado cuántico que es combinación lineal de otros estados, con amplitudes que pueden interferir.
- **Coherencia:** elemento fuera de la diagonal de la matriz densidad; mide la capacidad de interferir.
- **Decoherencia:** pérdida de coherencia por entrelazamiento con un entorno que no se observa.
- **Entrelazamiento:** correlación cuántica entre sistemas que no puede describirse como producto de estados individuales.
- **Concurrencia:** medida del entrelazamiento de dos qubits, entre 0 y 1.
- **Estado coherente:** estado de un oscilador cuántico que se comporta lo más parecido posible a una oscilación clásica.
- **Modelo spin-bosón:** un sistema de dos niveles acoplado a un baño de osciladores armónicos.
- **Fase geométrica:** fase que adquiere un estado al recorrer un camino cerrado, proporcional al área encerrada.
- **Compuerta de Mølmer-Sørensen:** operación de dos qubits en iones atrapados basada en una vibración compartida, insensible a la temperatura del modo.

### 22. Conclusión

La imagen de partículas unidas por cuerdas que vibran no describe literalmente ningún sistema, pero apunta a dos fenómenos reales y centrales de la física cuántica. Una vibración que registra el estado de una partícula le roba coherencia: si es una sola, se la devuelve; si son muchas, se la quita para siempre. Esa es la decoherencia que Zeh y Zurek explicaron y que Haroche midió. Una vibración compartida y controlada, en cambio, puede dejar a dos partículas entrelazadas sin quedar enredada con ellas: es la compuerta de Mølmer y Sørensen que hoy usan las computadoras cuánticas de iones. La herramienta pone números exactos a las dos caras y muestra la lección más importante: lo que separa lo cuántico de lo clásico no es el tamaño ni la fuerza, sino **cuántos lugares** hay para que la información se pierda.

Los próximos pasos naturales son agregar amortiguamiento a la cuerda (para ver cuándo la compuerta deja de ser perfecta) y comparar las fórmulas exactas con una simulación numérica en QuTiP, la biblioteca de Python para sistemas cuánticos abiertos de Johansson, Nation y Nori.

## Referencias

- Anderson, M. H., Ensher, J. R., Matthews, M. R., Wieman, C. E., & Cornell, E. A. (1995). Observation of Bose-Einstein condensation in a dilute atomic vapor. *Science*, 269(5221), 198–201. https://doi.org/10.1126/science.269.5221.198
- Arndt, M., Nairz, O., Vos-Andreae, J., Keller, C., van der Zouw, G., & Zeilinger, A. (1999). Wave–particle duality of C₆₀ molecules. *Nature*, 401, 680–682. https://doi.org/10.1038/44348
- Aspect, A., Grangier, P., & Roger, G. (1982). Experimental realization of Einstein-Podolsky-Rosen-Bohm Gedankenexperiment: A new violation of Bell's inequalities. *Physical Review Letters*, 49(2), 91–94. https://doi.org/10.1103/PhysRevLett.49.91
- Bell, J. S. (1964). On the Einstein Podolsky Rosen paradox. *Physics Physique Fizika*, 1(3), 195–200. https://doi.org/10.1103/PhysicsPhysiqueFizika.1.195
- Berry, M. V. (1984). Quantal phase factors accompanying adiabatic changes. *Proceedings of the Royal Society A*, 392(1802), 45–57. https://doi.org/10.1098/rspa.1984.0023
- Bloch, F. (1946). Nuclear induction. *Physical Review*, 70(7–8), 460–474. https://doi.org/10.1103/PhysRev.70.460
- Breuer, H.-P., & Petruccione, F. (2002). *The Theory of Open Quantum Systems*. Oxford University Press. ISBN 978-0-19-852063-4.
- Brune, M., Hagley, E., Dreyer, J., Maître, X., Maali, A., Wunderlich, C., Raimond, J. M., & Haroche, S. (1996). Observing the progressive decoherence of the "meter" in a quantum measurement. *Physical Review Letters*, 77(24), 4887–4890. https://doi.org/10.1103/PhysRevLett.77.4887
- Caldeira, A. O., & Leggett, A. J. (1983). Path integral approach to quantum Brownian motion. *Physica A*, 121(3), 587–616. https://doi.org/10.1016/0378-4371(83)90013-4
- Cirac, J. I., & Zoller, P. (1995). Quantum computations with cold trapped ions. *Physical Review Letters*, 74(20), 4091–4094. https://doi.org/10.1103/PhysRevLett.74.4091
- Davis, K. B., Mewes, M.-O., Andrews, M. R., van Druten, N. J., Durfee, D. S., Kurn, D. M., & Ketterle, W. (1995). Bose-Einstein condensation in a gas of sodium atoms. *Physical Review Letters*, 75(22), 3969–3973. https://doi.org/10.1103/PhysRevLett.75.3969
- Dirac, P. A. M. (1930). *The Principles of Quantum Mechanics*. Oxford: Clarendon Press.
- Einstein, A., Podolsky, B., & Rosen, N. (1935). Can quantum-mechanical description of physical reality be considered complete? *Physical Review*, 47(10), 777–780. https://doi.org/10.1103/PhysRev.47.777
- Everett, H. (1957). "Relative state" formulation of quantum mechanics. *Reviews of Modern Physics*, 29(3), 454–462. https://doi.org/10.1103/RevModPhys.29.454
- Fein, Y. Y., Geyer, P., Zwick, P., Kiałka, F., Pedalino, S., Mayor, M., Gerlich, S., & Arndt, M. (2019). Quantum superposition of molecules beyond 25 kDa. *Nature Physics*, 15, 1242–1245. https://doi.org/10.1038/s41567-019-0663-9
- Ghirardi, G. C., Rimini, A., & Weber, T. (1986). Unified dynamics for microscopic and macroscopic systems. *Physical Review D*, 34(2), 470–491. https://doi.org/10.1103/PhysRevD.34.470
- Glauber, R. J. (1963). Coherent and incoherent states of the radiation field. *Physical Review*, 131(6), 2766–2788. https://doi.org/10.1103/PhysRev.131.2766
- Hornberger, K., Uttenthaler, S., Brezger, B., Hackermüller, L., Arndt, M., & Zeilinger, A. (2003). Collisional decoherence observed in matter wave interferometry. *Physical Review Letters*, 90(16), 160401. https://doi.org/10.1103/PhysRevLett.90.160401
- Johansson, J. R., Nation, P. D., & Nori, F. (2012). QuTiP: An open-source Python framework for the dynamics of open quantum systems. *Computer Physics Communications*, 183(8), 1760–1772. https://doi.org/10.1016/j.cpc.2012.02.021
- Joos, E., & Zeh, H. D. (1985). The emergence of classical properties through interaction with the environment. *Zeitschrift für Physik B*, 59(2), 223–243. https://doi.org/10.1007/BF01725541
- Leggett, A. J., Chakravarty, S., Dorsey, A. T., Fisher, M. P. A., Garg, A., & Zwerger, W. (1987). Dynamics of the dissipative two-state system. *Reviews of Modern Physics*, 59(1), 1–85. https://doi.org/10.1103/RevModPhys.59.1
- Leibfried, D., DeMarco, B., Meyer, V., Lucas, D., Barrett, M., Britton, J., Itano, W. M., Jelenković, B., Langer, C., Rosenband, T., & Wineland, D. J. (2003). Experimental demonstration of a robust, high-fidelity geometric two ion-qubit phase gate. *Nature*, 422, 412–415. https://doi.org/10.1038/nature01492
- Mølmer, K., & Sørensen, A. (1999). Multiparticle entanglement of hot trapped ions. *Physical Review Letters*, 82(9), 1835–1838. https://doi.org/10.1103/PhysRevLett.82.1835
- von Neumann, J. (1932). *Mathematische Grundlagen der Quantenmechanik*. Berlín: Springer.
- Palma, G. M., Suominen, K.-A., & Ekert, A. K. (1996). Quantum computers and dissipation. *Proceedings of the Royal Society A*, 452(1946), 567–584. https://doi.org/10.1098/rspa.1996.0029
- Pauli, W. (1925). Über den Zusammenhang des Abschlusses der Elektronengruppen im Atom mit der Komplexstruktur der Spektren. *Zeitschrift für Physik*, 31, 765–783. https://doi.org/10.1007/BF02980631
- Preskill, J. (2018). Quantum computing in the NISQ era and beyond. *Quantum*, 2, 79. https://doi.org/10.22331/q-2018-08-06-79
- Schlosshauer, M. (2004). Decoherence, the measurement problem, and interpretations of quantum mechanics. *Reviews of Modern Physics*, 76(4), 1267–1305. https://doi.org/10.1103/RevModPhys.76.1267
- Schlosshauer, M. (2007). *Decoherence and the Quantum-to-Classical Transition*. Springer. ISBN 978-3-540-35773-5.
- Schrödinger, E. (1935). Die gegenwärtige Situation in der Quantenmechanik. *Die Naturwissenschaften*, 23, 807–812, 823–828, 844–849. https://doi.org/10.1007/BF01491891
- Schrödinger, E. (1935). Discussion of probability relations between separated systems. *Mathematical Proceedings of the Cambridge Philosophical Society*, 31(4), 555–563. https://doi.org/10.1017/S0305004100013554
- Shor, P. W. (1995). Scheme for reducing decoherence in quantum computer memory. *Physical Review A*, 52(4), R2493–R2496. https://doi.org/10.1103/PhysRevA.52.R2493
- Sørensen, A., & Mølmer, K. (1999). Quantum computation with ions in thermal motion. *Physical Review Letters*, 82(9), 1971–1974. https://doi.org/10.1103/PhysRevLett.82.1971
- Wootters, W. K. (1998). Entanglement of formation of an arbitrary state of two qubits. *Physical Review Letters*, 80(10), 2245–2248. https://doi.org/10.1103/PhysRevLett.80.2245
- Zeh, H. D. (1970). On the interpretation of measurement in quantum theory. *Foundations of Physics*, 1(1), 69–76. https://doi.org/10.1007/BF00708656
- Zurek, W. H. (1981). Pointer basis of quantum apparatus: Into what mixture does the wave packet collapse? *Physical Review D*, 24(6), 1516–1525. https://doi.org/10.1103/PhysRevD.24.1516
- Zurek, W. H. (2003). Decoherence, einselection, and the quantum origins of the classical. *Reviews of Modern Physics*, 75(3), 715–775. https://doi.org/10.1103/RevModPhys.75.715
