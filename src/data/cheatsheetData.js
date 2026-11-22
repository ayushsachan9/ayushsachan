/**
 * High-Yield AKTU Cheatsheet & High-Frequency Exam Topics
 * Curated for Semester 5 Electronics & Communication Engineering (AKTU)
 */

export const cheatsheetData = {
  bec501: {
    subjectCode: "BEC501",
    title: "Integrated Circuits",
    color: "indigo",
    badgeBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    keyFormulas: [
      { name: "Op-Amp Slew Rate", formula: "SR = |dVo/dt|_max = 2π * f_max * Vm", note: "Typically 0.5 V/μs for 741 IC" },
      { name: "3-OpAmp Instrumentation Gain", formula: "Vo = (1 + 2R1/Rg) * (R3/R2) * (V2 - V1)", note: "Ultra-high CMRR, high input impedance" },
      { name: "555 Timer Astable Frequency", formula: "f = 1.44 / ((RA + 2RB) * C)", note: "Duty Cycle D = (RA + RB) / (RA + 2RB)" },
      { name: "555 Monostable Pulse Width", formula: "W = 1.1 * RA * C", note: "Output stays HIGH for W duration" },
      { name: "PLL Free Running Frequency", formula: "f_out ≈ 1.2 / (4 * R1 * C1)", note: "VCO 566 frequency control formula" }
    ],
    topAKTUQuestions: [
      {
        unit: "Unit 1",
        q: "Draw the internal block diagram of 741 IC Op-Amp and explain all 4 stages with DC/AC equivalent circuits."
      },
      {
        unit: "Unit 1",
        q: "Derive the expression for slew rate of an operational amplifier. Explain how frequency compensation prevents oscillations."
      },
      {
        unit: "Unit 2",
        q: "Derive the closed-loop voltage gain expression for a 3-Op-Amp Instrumentation Amplifier. List its advantages over a standard differential amplifier."
      },
      {
        unit: "Unit 2",
        q: "Design a 2nd-order Sallen-Key Low Pass Butterworth filter for a given cutoff frequency. State the transfer function."
      },
      {
        unit: "Unit 3",
        q: "Explain logarithmic and antilogarithmic amplifiers using Op-Amps and transistors. How is temperature compensation achieved?"
      },
      {
        unit: "Unit 3",
        q: "Draw the circuit of a Schmitt Trigger (inverting & non-inverting). Derive expressions for Upper and Lower Threshold Voltages (V_UTP, V_LTP) and hysteresis."
      },
      {
        unit: "Unit 4",
        q: "Plot the Voltage Transfer Characteristics (VTC) of a CMOS Inverter. Mark and define V_IL, V_IH, V_OL, V_OH, and noise margins NM_L, NM_H."
      },
      {
        unit: "Unit 5",
        q: "Explain the internal block diagram of 555 Timer IC. Draw the pin diagram and explain Astable Multivibrator operation with waveforms."
      },
      {
        unit: "Unit 5",
        q: "What is Phase Locked Loop (PLL)? Explain Lock Range, Capture Range, and Pull-in Time with block diagram of NE565."
      }
    ]
  },
  bec502: {
    subjectCode: "BEC502",
    title: "Microprocessor & Microcontroller",
    color: "emerald",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    keyFormulas: [
      { name: "8086 Physical Address", formula: "Physical Address = (Segment Register * 16) + Offset", note: "20-bit address bus from 16-bit registers" },
      { name: "8085 T-States to Time", formula: "Time = (Number of T-states) / Clock Frequency", note: "e.g., 3 MHz clock -> 1 T-state = 0.333 μs" },
      { name: "8051 Machine Cycle", formula: "1 Machine Cycle = 12 Oscillator Clock Periods", note: "At 11.0592 MHz, 1 MC = 1.085 μs" }
    ],
    topAKTUQuestions: [
      {
        unit: "Unit 1",
        q: "Draw the functional architecture of 8085 microprocessor. Explain the role of ALU, Timing & Control Unit, and Flag register."
      },
      {
        unit: "Unit 1",
        q: "Draw and explain the bus timing diagram for Opcode Fetch and Memory Read machine cycles of 8085."
      },
      {
        unit: "Unit 2",
        q: "Explain the interrupt structure of 8085 (TRAP, RST 7.5, RST 6.5, RST 5.5, INTR). Compare vectored vs non-vectored interrupts."
      },
      {
        unit: "Unit 2",
        q: "Write an 8085 assembly language program to sort an array of N numbers in ascending/descending order."
      },
      {
        unit: "Unit 3",
        q: "Draw the architectural block diagram of 8086 microprocessor. Differentiate between BIU (Bus Interface Unit) and EU (Execution Unit)."
      },
      {
        unit: "Unit 3",
        q: "Explain memory segmentation in 8086. What are its advantages? Calculate physical address if CS=2000H and IP=145AH."
      },
      {
        unit: "Unit 3",
        q: "Explain the architecture and operating modes of 8255 PPI (Mode 0, Mode 1, Mode 2, and BSR Mode). Draw its Control Word format."
      },
      {
        unit: "Unit 4",
        q: "Draw the architectural block diagram of 8051 microcontroller. Explain internal RAM organization and Special Function Registers (SFRs)."
      },
      {
        unit: "Unit 5",
        q: "Explain Timer/Counter modes of 8051 (Mode 0, 1, 2, 3) and TMOD register bit definitions. Write an assembly code to generate a square wave."
      },
      {
        unit: "Unit 5",
        q: "Draw the interfacing diagram of 8051 with Stepper Motor / LCD / DAC0808 and write the required assembly program."
      }
    ]
  },
  bec503: {
    subjectCode: "BEC503",
    title: "Digital Signal Processing",
    color: "purple",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    keyFormulas: [
      { name: "Bilinear Transformation", formula: "s = (2 / T) * (1 - z^-1) / (1 + z^-1)", note: "Frequency warping: Ω = (2 / T) * tan(ω / 2)" },
      { name: "Radix-2 FFT Complexity", formula: "O((N/2) * log2(N)) vs DFT O(N^2)", note: "For N=1024, FFT is ~200x faster than DFT" },
      { name: "Circular Convolution", formula: "x1(n) ⊛ x2(n) = IDFT[ X1(k) * X2(k) ]", note: "Length N must be >= L1 + L2 - 1 for linear equiv" },
      { name: "Decimation by M", formula: "y(m) = x(m * M)", note: "Requires anti-aliasing low pass filter at π/M" }
    ],
    topAKTUQuestions: [
      {
        unit: "Unit 1",
        q: "Draw Direct Form I, Direct Form II, Cascade, and Parallel realization structures for a given 2nd-order IIR system transfer function."
      },
      {
        unit: "Unit 2",
        q: "Design a digital Butterworth IIR low pass filter using Bilinear Transformation Method. Explain frequency warping and pre-warping."
      },
      {
        unit: "Unit 2",
        q: "Explain Impulse Invariance Method for IIR filter design. What is the cause of aliasing and how can it be avoided?"
      },
      {
        unit: "Unit 3",
        q: "Design a linear phase FIR filter using Rectangular/Hamming/Hanning window. What is the Gibbs phenomenon and how do windows reduce it?"
      },
      {
        unit: "Unit 4",
        q: "Derive and draw the Radix-2 Decimation in Time (DIT-FFT) butterfly signal flow graph for N = 8."
      },
      {
        unit: "Unit 4",
        q: "State and prove the circular convolution property of DFT. Compute circular convolution of two given 4-point sequences."
      },
      {
        unit: "Unit 5",
        q: "What is multirate digital signal processing? Explain Decimation and Interpolation with spectrum sketches and anti-aliasing/anti-imaging filters."
      },
      {
        unit: "Unit 5",
        q: "Explain Quadrature Mirror Filter (QMF) banks. Derive the condition for alias-free reconstruction."
      }
    ]
  },
  bec054: {
    subjectCode: "BEC054",
    title: "VLSI Technology",
    color: "amber",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    keyFormulas: [
      { name: "Deal-Grove Oxidation Model", formula: "x_o^2 + A * x_o = B * (t + τ)", note: "Linear regime (short time) x_o ≈ (B/A)(t+τ); Parabolic x_o^2 ≈ B*t" },
      { name: "Fick's First Law", formula: "J = -D * (dC / dx)", note: "Flux proportional to concentration gradient" },
      { name: "Gaussian Profile (Limited Source)", formula: "C(x,t) = [S / sqrt(π*D*t)] * exp(-x^2 / (4*D*t))", note: "Drive-in step in thermal diffusion" },
      { name: "Projected Range in Ion Implantation", formula: "C(x) = (Q / (sqrt(2π) * ΔRp)) * exp(-(x - Rp)^2 / (2 * ΔRp^2))", note: "Rp: projected range, ΔRp: straggle" }
    ],
    topAKTUQuestions: [
      {
        unit: "Unit 1",
        q: "Describe the Czochralski (CZ) crystal pulling method for silicon ingot growth with a neat sketch. Compare CZ with Float Zone (FZ)."
      },
      {
        unit: "Unit 1",
        q: "Explain the wafer preparation steps and RCA cleaning procedure (RCA-1 and RCA-2) for semiconductor wafers."
      },
      {
        unit: "Unit 2",
        q: "Derive the Deal-Grove model of thermal oxidation. Explain why thin oxides grow faster in dry O2 vs wet oxidation."
      },
      {
        unit: "Unit 2",
        q: "Explain Silicon on Insulator (SOI) technology. Discuss its advantages over bulk silicon for high-speed CMOS devices."
      },
      {
        unit: "Unit 3",
        q: "Explain the photolithography process flow step by step. Differentiate between positive and negative photoresists."
      },
      {
        unit: "Unit 3",
        q: "Compare Reactive Ion Etching (RIE / Dry etching) with Wet chemical etching. Define etching anisotropy and selectivity."
      },
      {
        unit: "Unit 4",
        q: "Explain constant-source (pre-deposition) and limited-source (drive-in) diffusion with boundary conditions and mathematical profiles."
      },
      {
        unit: "Unit 4",
        q: "Explain the principle, equipment, and advantages of Ion Implantation over thermal diffusion. What is ion channeling and annealing?"
      },
      {
        unit: "Unit 5",
        q: "Draw and explain the complete step-by-step fabrication sequence for a CMOS Inverter using the Twin-Tub process."
      }
    ]
  },
  bec057: {
    subjectCode: "BEC057",
    title: "Optical Communication",
    color: "sky",
    badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    keyFormulas: [
      { name: "Numerical Aperture (NA)", formula: "NA = sin(θ_a) = sqrt(n1^2 - n2^2) ≈ n1 * sqrt(2Δ)", note: "Δ = (n1 - n2) / n1 is relative refractive index diff" },
      { name: "V-Number (Normalized Frequency)", formula: "V = (2π * a / λ) * NA", note: "For SMF cut-off: V < 2.405" },
      { name: "Rayleigh Scattering Loss", formula: "α_scat ∝ 1 / λ^4", note: "Strongest loss at shorter wavelengths" },
      { name: "Photodetector Responsivity", formula: "R = (η * q) / (h * ν) = (η * λ_μm) / 1.24", note: "Units: Amperes per Watt (A/W)" }
    ],
    topAKTUQuestions: [
      {
        unit: "Unit 1",
        q: "Derive expressions for Acceptance Angle, Numerical Aperture (NA), and critical angle in a step-index optical fiber."
      },
      {
        unit: "Unit 1",
        q: "Define normalized frequency (V-number). Derive the condition for single-mode operation in step-index optical fibers."
      },
      {
        unit: "Unit 2",
        q: "Explain different attenuation mechanisms in optical fibers (material absorption, Rayleigh scattering, and micro/macro bending losses)."
      },
      {
        unit: "Unit 2",
        q: "Explain chromatic dispersion (material and waveguide dispersion) and intermodal dispersion in multimode fibers. How does graded index minimize it?"
      },
      {
        unit: "Unit 3",
        q: "Explain the construction and working principle of Laser Diode. Derive the condition for population inversion and threshold gain."
      },
      {
        unit: "Unit 3",
        q: "Differentiate between surface emitting (Burrus type) and edge-emitting LEDs. Compare LED with Laser diode for optical transmission."
      },
      {
        unit: "Unit 4",
        q: "Explain the working principle and energy band diagram of PIN and Avalanche Photodiode (APD). Define quantum efficiency and responsivity."
      },
      {
        unit: "Unit 5",
        q: "What is an Eye Diagram? How is it generated and what system performance parameters (noise margin, timing jitter, ISI) can be deduced from it?"
      },
      {
        unit: "Unit 5",
        q: "Explain the principle and architecture of Wavelength Division Multiplexing (WDM). What is Free Space Optics (FSO)?"
      }
    ]
  },
  bnc502: {
    subjectCode: "BNC502",
    title: "Essence of Indian Traditional Knowledge",
    color: "rose",
    badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    keyFormulas: [
      { name: "Four Purusharthas", formula: "Dharma (Righteousness), Artha (Prosperity), Kama (Pleasure), Moksha (Liberation)", note: "Core Vedic life objectives" },
      { name: "Six Shad-Darshanas", formula: "Nyaya, Vaisheshika, Samkhya, Yoga, Mimamsa, Vedanta", note: "Classical schools of Indian philosophy" }
    ],
    topAKTUQuestions: [
      {
        unit: "Unit 1",
        q: "Discuss the social structure of ancient India with reference to Varna and Ashrama systems. Explain the concept of Rajadharma."
      },
      {
        unit: "Unit 1",
        q: "Explain the democratic elements in Vedic polity with emphasis on Sabha and Samiti."
      },
      {
        unit: "Unit 2",
        q: "Provide an overview of Vedic literature (Samhitas, Brahmanas, Aranyakas, Upanishads) and Vedangas."
      },
      {
        unit: "Unit 2",
        q: "Discuss the evolution of ancient Indian scripts (Brahmi, Kharosthi) and Panini's contribution to Sanskrit linguistics."
      },
      {
        unit: "Unit 3",
        q: "Explain the key philosophies of the Shad-Darshanas (Nyaya, Vaisheshika, Samkhya, Yoga, Mimamsa, Vedanta)."
      },
      {
        unit: "Unit 3",
        q: "Describe the origin, philosophy, and socio-cultural impact of the Bhakti and Sufi movements in medieval India."
      },
      {
        unit: "Unit 4",
        q: "Highlight ancient Indian contributions to Mathematics (Aryabhata, Brahmagupta, decimal place value) and Astronomy."
      },
      {
        unit: "Unit 4",
        q: "Discuss ancient Indian metallurgy (Iron Pillar of Delhi, Wootz steel) and ancient medicine (Ayurveda: Charaka & Sushruta Samhitas)."
      },
      {
        unit: "Unit 4",
        q: "Explain Kautilya's Arthashastra with respect to statecraft, revenue administration, and strategic resource management."
      },
      {
        unit: "Unit 5",
        q: "Differentiate between Nagara, Dravida, and Vesara temple architectural styles in India with suitable examples."
      }
    ]
  }
};
