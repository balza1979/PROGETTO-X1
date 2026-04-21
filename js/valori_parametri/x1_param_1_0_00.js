// -----------------------------
// VALORI PARAMETRO 1.0.00
// -----------------------------
const x1_param_1_0_00_raw = [
  "\"\"\"00\"\" UPR cab/piano.\"",
  "\"\"\"01\"\" UPR cab/APBpi.\"",
  "\"\"\"02\"\" APB cab/piano.\"",
  "\"\"\"03\"\" APB/SX cabina.\"",
  "\"\"\"04\"\" SX discesa.\"",
  "\"\"\"05\"\" SX sal./dis.\""
];

const x1_param_1_0_00 = x1_param_1_0_00_raw.map(v => v);


// -----------------------------
// FILE ASSOCIATI (8 per ogni valore)
// -----------------------------
x1_file_parametri["1.0.00"] = {
    "00 UPR cab/piano.": ["1.JPG","2.JPG","3.JPG","4.JPG","5.JPG","6.JPG","7.JPG","8.JPG"],
    "01 UPR cab/APBpi.": ["1.JPG","2.JPG","3.JPG","4.JPG","5.JPG","6.JPG","7.JPG","8.JPG"],
    "02 APB cab/piano.": ["1.JPG","2.JPG","3.JPG","4.JPG","5.JPG","6.JPG","7.JPG","8.JPG"],
    "03 APB/SX cabina.": ["1.JPG","2.JPG","3.JPG","4.JPG","5.JPG","6.JPG","7.JPG","8.JPG"],
    "04 SX discesa.": ["1.JPG","2.JPG","3.JPG","4.JPG","5.JPG","6.JPG","7.JPG","8.JPG"],
    "05 SX sal./dis.": ["1.JPG","2.JPG","3.JPG","4.JPG","5.JPG","6.JPG","7.JPG","8.JPG"]
};
