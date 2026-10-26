# Membrane Potential Simulator

Interactive teaching simulator for the resting membrane potential and the action potential: the Na⁺/K⁺ pump (3-2-1 NOKIA: 3 Na⁺ out, 2 K⁺ in, 1 ATP), K⁺ and Na⁺ leaks, plasma electrolytes, and nerve vs skeletal/cardiac muscle in hypokalemia.

## Two versions in this repository

- **`standalone/index.html`**: the current simulator. A single self-contained web page; open it in any browser, no install or server needed.
- **The Replit app** (`client/`, `server/`): the original React/Express version. To run it locally:
  ```
  npm install
  npm run dev
  ```
  then open http://localhost:5000. Works on Windows, macOS and Linux.

## What the standalone simulator models

- **Resting potential:** Goldman–Hodgkin–Katz equation with the pump's 3:2 ratio (Mullins–Noda form). Permeability ratio P_K : P_Na : P_Cl = 1 : 0.04 : 0.45 (Hodgkin & Katz, 1949). Cl⁻ redistributes passively, so it buffers sudden changes but leaves the steady state unchanged.
- **Pump off:** an immediate small electrogenic loss, then slow rundown of the gradients to Gibbs–Donnan equilibrium (not equal concentrations), with cell swelling. Time is compressed.
- **Action potential:** Hodgkin–Huxley Na⁺ and K⁺ channels, with gating anchored to the cell's resting potential. Threshold is computed from the model, not fixed.
- **Electrolytes:** clinical presets for hypo/hyperkalemia and hypo/hypernatremia, plus Hodgkin–Katz laboratory low-Na⁺ conditions.
- **Tissue switch:** in skeletal and cardiac muscle, resting K⁺ conductance falls with plasma K⁺ (inward rectifier, approximated as P_K ∝ [K⁺]o), so severe hypokalemia can depolarize instead of hyperpolarize.

## Limitations

The model is nerve-focused: squid-axon kinetics and a single compartment, with no Ca²⁺ currents. It does not reproduce the cardiac action potential, conduction, the ECG or brain water. Values are for teaching mechanisms, not for clinical decisions.

## License

© 2024–2026 Ian V. J. Murray. Licensed under [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)](https://creativecommons.org/licenses/by-nc-sa/4.0/). See `LICENSE`.
