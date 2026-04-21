// -----------------------------
// VALORI PARAMETRO
// -----------------------------
const valori_raw = [
  "00 UPR cab/piano.",
  "01 UPR cab/APBpi.",
  "02 APB cab/piano.",
  "03 APB/SX cabina.",
  "04 SX discesa.",
  "05 SX sal./dis."
];

const valori = valori_raw.map(v => v);

// -----------------------------
// FILE ASSOCIATI (8 per ogni ID)
// -----------------------------
const file_parametro = {
  "00": ["1.JPG","2.JPG","3.JPG","4.JPG","5.JPG","6.JPG","7.JPG","8.JPG"],
  "01": ["1.JPG","2.JPG","3.JPG","4.JPG","5.JPG","6.JPG","7.JPG","8.JPG"],
  "02": ["1.JPG","2.JPG","3.JPG","4.JPG","5.JPG","6.JPG","7.JPG","8.JPG"],
  "03": ["1.JPG","2.JPG","3.JPG","4.JPG","5.JPG","6.JPG","7.JPG","8.JPG"],
  "04": ["1.JPG","2.JPG","3.JPG","4.JPG","5.JPG","6.JPG","7.JPG","8.JPG"],
  "05": ["1.JPG","2.JPG","3.JPG","4.JPG","5.JPG","6.JPG","7.JPG","8.JPG"]
};
