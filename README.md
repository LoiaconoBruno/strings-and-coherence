# Cuerdas y coherencia

**Una vibración que destruye la superposición y otra que entrelaza.** Preprint de Bruno Loiacono, estudiante de Física (Universidad de Buenos Aires).

La imagen de partículas unidas por cuerdas que vibran apunta a dos fenómenos cuánticos reales, que el paper calcula con fórmulas exactas. Un qubit acoplado a vibraciones pierde coherencia: con una sola vibración la recupera en cada período, con muchas de frecuencias distintas la pierde en la práctica para siempre, y en el límite continuo aparece el tiempo de desfasaje T₂. Dos qubits que empujan la misma vibración quedan entrelazados por una fase geométrica, a cualquier temperatura, como en las compuertas de iones atrapados.

- 📄 **[PDF](paper/paper.pdf)**
- 🌐 **[Versión web](https://loiaconobruno.github.io/strings-and-coherence/)**

> Preprint, documento de trabajo sin revisión por pares.

## Cómo se genera

`paper/paper.tex` es la única fuente. En cada push, GitHub Actions compila el PDF con TeX Live y arma la versión web (`index.html`). Para regenerar a mano las figuras, chequear las referencias o rearmar la página:

```bash
node paper/figuras/generar.js     # figuras y todas las cifras de la sección 4
python3 paper/verificar_bib.py    # cada referencia contra Crossref, Open Library o su URL
python3 paper/web.py              # index.html a partir del .tex
```

## Cómo citarlo

```bibtex
@misc{loiacono2026cuerdas,
  author       = {Loiacono, Bruno},
  title        = {Cuerdas y coherencia: una vibración que destruye la superposición y otra que entrelaza},
  year         = {2026},
  howpublished = {Preprint, documento de trabajo sin revisión por pares},
  url          = {https://github.com/LoiaconoBruno/strings-and-coherence}
}
```

## Licencia

El texto, las figuras y el PDF están bajo [CC BY 4.0](LICENSE-CC-BY-4.0.txt). Los scripts que generan las figuras y la página están bajo MIT. El detalle está en [LICENSE](LICENSE).
