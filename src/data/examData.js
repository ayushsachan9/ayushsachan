/**
 * Sem 5 Exam Checklist Data - Updated with Daily Revision Matrix
 * Sourced directly from Google Sheets:
 * https://docs.google.com/spreadsheets/d/1CU7k947OSUN48a_vnTSlqZCUDrAgrfWbkDGSTD1dBoQ/edit?usp=sharing
 * Semester 5 Exams begin: 4 Dec 2026
 */

export const examMeta = {
  title: "Sem 5 Exam Checklist & Revision Tracker",
  examStartDate: "2026-12-04T09:00:00+05:30",
  sheetUrl: "https://docs.google.com/spreadsheets/d/1CU7k947OSUN48a_vnTSlqZCUDrAgrfWbkDGSTD1dBoQ/edit?usp=sharing",
  degree: "B.Tech Electronics & Communication Engineering (ECE)",
  semester: "Semester 5 (AKTU)",
  totalUnits: 30,
  totalSubjects: 6,
};

export const milestoneColumns = [
  { key: 'complete', label: 'Complete / Revised', shortLabel: 'Done', color: 'emerald', bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { key: 'studied', label: 'Studied (1st Pass)', shortLabel: 'Studied', color: 'blue', bg: 'bg-sky-500/10 text-sky-400 border-sky-500/30' },
  { key: 'rev1', label: 'Revision 1 (Rev 1)', shortLabel: 'Rev 1', color: 'amber', bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { key: 'rev2', label: 'Revision 2 (Rev 2)', shortLabel: 'Rev 2', color: 'purple', bg: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
];

export const dateColumns = [
  { key: '23/11', label: '23 Nov', isToday: true },
  { key: '24/11', label: '24 Nov', isToday: false },
  { key: '25/11', label: '25 Nov', isToday: false },
  { key: '26/11', label: '26 Nov', isToday: false },
  { key: '27/11', label: '27 Nov', isToday: false },
  { key: '28/11', label: '28 Nov', isToday: false },
  { key: '29/11', label: '29 Nov', isToday: false },
  { key: '30/11', label: '30 Nov', isToday: false },
  { key: '1/11', label: '1 Dec', raw: '1/11', isToday: false },
  { key: '2/11', label: '2 Dec', raw: '2/11', isToday: false },
];

export const subjectsData = [
  {
    id: "bec501",
    code: "BEC501",
    title: "Integrated Circuits",
    fullName: "BEC501 Integrated Circuits",
    color: "indigo",
    badgeBg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/30",
    accentColor: "#6366f1",
    units: [
      {
        id: "bec501-u1",
        unit: "Unit 1",
        topics: "The 741 IC Op-Amp: stages, DC/AC analysis, frequency response, slew rate",
        tags: ["741 Op-Amp", "DC/AC Analysis", "Frequency Response", "Slew Rate"]
      },
      {
        id: "bec501-u2",
        unit: "Unit 2",
        topics: "Linear applications: V-I/I-V converters, instrumentation amp, GIC, active filters (Sallen Key, Butterworth, KHN)",
        tags: ["V-I / I-V Converters", "Instrumentation Amp", "GIC", "Sallen Key", "Butterworth", "KHN Filters"]
      },
      {
        id: "bec501-u3",
        unit: "Unit 3",
        topics: "Frequency compensation & nonlinearity; non-linear applications (log/antilog, peak detector, S/H, comparator, multivibrators, multipliers)",
        tags: ["Log/Antilog", "Peak Detector", "Sample & Hold", "Multivibrators", "Multipliers"]
      },
      {
        id: "bec501-u4",
        unit: "Unit 4",
        topics: "Digital IC design: CMOS gates, latches, SR/JK/D flip-flops",
        tags: ["CMOS Gates", "Latches", "SR Flip-Flop", "JK Flip-Flop", "D Flip-Flop"]
      },
      {
        id: "bec501-u5",
        unit: "Unit 5",
        topics: "555 timer, VCO 566, PLL",
        tags: ["555 Timer", "VCO 566", "Phase Locked Loop (PLL)"]
      }
    ]
  },
  {
    id: "bec502",
    code: "BEC502",
    title: "Microprocessor & Microcontroller",
    fullName: "BEC502 Microprocessor & Microcontroller",
    color: "emerald",
    badgeBg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    accentColor: "#10b981",
    units: [
      {
        id: "bec502-u1",
        unit: "Unit 1",
        topics: "8085 architecture, pins, timing diagrams, memory & I/O interfacing",
        tags: ["8085 Architecture", "Pin Diagram", "Timing Diagrams", "Memory & I/O Interfacing"]
      },
      {
        id: "bec502-u2",
        unit: "Unit 2",
        topics: "8085 programming, looping/counting, delays, interrupts",
        tags: ["8085 Assembly", "Counters & Time Delays", "Hardware/Software Interrupts"]
      },
      {
        id: "bec502-u3",
        unit: "Unit 3",
        topics: "8086 architecture, segmentation, addressing modes; 8237, 8255, 8253/54, 8259, 8251",
        tags: ["8086 Architecture", "Memory Segmentation", "8255 PPI", "8253 Timer", "8259 PIC", "8237 DMA"]
      },
      {
        id: "bec502-u4",
        unit: "Unit 4",
        topics: "8051 basics: block diagram, PSW, registers, memory, SFRs, pins, addressing modes",
        tags: ["8051 Architecture", "PSW", "Special Function Registers (SFRs)", "Addressing Modes"]
      },
      {
        id: "bec502-u5",
        unit: "Unit 5",
        topics: "8051 assembly: instructions, timers, serial, interrupts, LCD/keyboard/ADC/DAC/stepper interfacing",
        tags: ["8051 Assembly", "Timers & Serial Comm", "LCD Interfacing", "ADC/DAC", "Stepper Motor"]
      }
    ]
  },
  {
    id: "bec503",
    code: "BEC503",
    title: "Digital Signal Processing",
    fullName: "BEC503 Digital Signal Processing",
    color: "purple",
    badgeBg: "bg-purple-500/10 text-purple-400 border-purple-500/30",
    accentColor: "#a855f7",
    units: [
      {
        id: "bec503-u1",
        unit: "Unit 1",
        topics: "DSP intro, realization structures, IIR & FIR realization",
        tags: ["DSP Introduction", "Direct Form I & II", "Cascade & Parallel Realization"]
      },
      {
        id: "bec503-u2",
        unit: "Unit 2",
        topics: "IIR design: impulse invariant, bilinear, Butterworth & Chebyshev",
        tags: ["Impulse Invariance", "Bilinear Transformation", "Butterworth Filter", "Chebyshev Filter"]
      },
      {
        id: "bec503-u3",
        unit: "Unit 3",
        topics: "FIR design: windows, Gibbs phenomenon, finite word length effects",
        tags: ["Windowing Techniques", "Rectangular/Hamming/Hanning", "Gibbs Phenomenon", "Finite Word Length"]
      },
      {
        id: "bec503-u4",
        unit: "Unit 4",
        topics: "DFT & FFT: properties, circular/linear convolution, DIT, DIF",
        tags: ["DFT Properties", "Circular Convolution", "DIT-FFT", "DIF-FFT Radix-2"]
      },
      {
        id: "bec503-u5",
        unit: "Unit 5",
        topics: "Multirate DSP: decimation, interpolation, sampling rate conversion, QMF",
        tags: ["Decimation", "Interpolation", "Sampling Rate Conversion", "QMF Banks"]
      }
    ]
  },
  {
    id: "bec054",
    code: "BEC054",
    title: "VLSI Technology",
    fullName: "BEC054 VLSI Technology",
    color: "amber",
    badgeBg: "bg-amber-500/10 text-amber-400 border-amber-500/30",
    accentColor: "#f59e0b",
    units: [
      {
        id: "bec054-u1",
        unit: "Unit 1",
        topics: "IC technology intro, crystal growth (Czochralski), wafer prep & cleaning",
        tags: ["Crystal Growth", "Czochralski (CZ)", "Wafer Preparation", "RCA Cleaning"]
      },
      {
        id: "bec054-u2",
        unit: "Unit 2",
        topics: "Epitaxy, SOI, oxidation",
        tags: ["Vapor/Liquid Phase Epitaxy", "Silicon-on-Insulator (SOI)", "Thermal Oxidation", "Deal-Grove Model"]
      },
      {
        id: "bec054-u3",
        unit: "Unit 3",
        topics: "Lithography, etching, polysilicon/SiO2/Si3N4 deposition",
        tags: ["Photolithography", "Dry/Wet Etching", "CVD / PECVD", "Polysilicon Deposition"]
      },
      {
        id: "bec054-u4",
        unit: "Unit 4",
        topics: "Diffusion (Fick's law, profiles), ion implantation",
        tags: ["Fick's First & Second Laws", "Diffusion Profiles", "Ion Implantation", "Annealing"]
      },
      {
        id: "bec054-u5",
        unit: "Unit 5",
        topics: "Metallization, PVD, sputtering, packaging, CMOS fabrication steps",
        tags: ["Metallization", "PVD & Sputtering", "Packaging", "CMOS Twin-Tub Process"]
      }
    ]
  },
  {
    id: "bec057",
    code: "BEC057",
    title: "Optical Communication",
    fullName: "BEC057 Optical Communication",
    color: "sky",
    badgeBg: "bg-sky-500/10 text-sky-400 border-sky-500/30",
    accentColor: "#0ea5e9",
    units: [
      {
        id: "bec057-u1",
        unit: "Unit 1",
        topics: "Intro, fiber waveguides: ray theory, NA, modes, step vs graded index, single mode fibers",
        tags: ["Numerical Aperture (NA)", "Ray Theory", "Step vs Graded Index", "Single Mode Fibers (SMF)"]
      },
      {
        id: "bec057-u2",
        unit: "Unit 2",
        topics: "Signal loss (absorption, scattering, bending) and dispersion",
        tags: ["Attenuation & Absorption", "Rayleigh Scattering", "Bending Loss", "Intermodal & Chromatic Dispersion"]
      },
      {
        id: "bec057-u3",
        unit: "Unit 3",
        topics: "Optical sources: LEDs, laser diodes, rate equations",
        tags: ["LEDs", "Laser Diodes", "Population Inversion", "Rate Equations"]
      },
      {
        id: "bec057-u4",
        unit: "Unit 4",
        topics: "Power launching & coupling; photodetectors (PIN, APD), noise, SNR",
        tags: ["Power Launching", "PIN Photodiode", "Avalanche Photodiode (APD)", "Quantum Efficiency", "SNR"]
      },
      {
        id: "bec057-u5",
        unit: "Unit 5",
        topics: "Digital receiver: BER, sensitivity, eye diagram, coherent detection, links, multiplexing, FSO",
        tags: ["Bit Error Rate (BER)", "Eye Pattern", "Receiver Sensitivity", "WDM Multiplexing", "Free Space Optics"]
      }
    ]
  },
  {
    id: "bnc502",
    code: "BNC502",
    title: "Essence of Indian Traditional Knowledge",
    fullName: "BNC502 Essence of Indian Traditional Knowledge",
    color: "rose",
    badgeBg: "bg-rose-500/10 text-rose-400 border-rose-500/30",
    accentColor: "#f43f5e",
    units: [
      {
        id: "bnc502-u1",
        unit: "Unit 1",
        topics: "Society, state and polity in ancient India",
        tags: ["Ancient Indian Society", "Vedic Polity", "Rajadharma", "Governance & Statecraft"]
      },
      {
        id: "bnc502-u2",
        unit: "Unit 2",
        topics: "Indian literature, culture, scripts and languages",
        tags: ["Vedic Literature", "Epics & Puranas", "Brahmi & Kharosthi Scripts", "Sanskrit & Regional Traditions"]
      },
      {
        id: "bnc502-u3",
        unit: "Unit 3",
        topics: "Indian religion, philosophy, Bhakti & Sufi movements",
        tags: ["Darshanas & Philosophy", "Upanishadic Thought", "Bhakti Movement", "Sufi Traditions"]
      },
      {
        id: "bnc502-u4",
        unit: "Unit 4",
        topics: "Science, management and Indian knowledge systems",
        tags: ["Ancient Indian Mathematics & Astronomy", "Ayurveda & Medicine", "Metallurgy", "Kautilya Arthashastra"]
      },
      {
        id: "bnc502-u5",
        unit: "Unit 5",
        topics: "Cultural heritage and performing arts",
        tags: ["Architecture & Sculptures", "Classical Dance Forms", "Music & Natyashastra", "Crafts & Traditions"]
      }
    ]
  }
];

// Flat list of all 30 units
export const flatUnitsList = subjectsData.flatMap(subj =>
  subj.units.map(unit => ({
    ...unit,
    subjectId: subj.id,
    subjectCode: subj.code,
    subjectTitle: subj.title,
    subjectFullName: subj.fullName,
    color: subj.color,
    badgeBg: subj.badgeBg,
    accentColor: subj.accentColor
  }))
);
