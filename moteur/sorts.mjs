// Table des sorts du moteur de combat, portée telle quelle depuis sim/simulateur.py (SP et DMG).
// Ne pas modifier sans prévenir le joueur : c'est le comportement validé du prototype.
//
// Champs : id DofusDB, paire de variantes, pa, po [min, max], los (ligne de vue), line (en ligne),
// t (lancers par tour), c (lancers par cible), cb (bonus de crit du sort, %), taken (case occupée requise).
// data/resume.mjs compare cette table aux données DofusDB figées.

export const SP = {
  Frappe:         { id: 13252, nom: 'Frappe de Xélor', p: 'P19', pa: 3, po: [1, 3], los: 1, line: 0, t: 3, c: 2, cb: 10 },
  Pendule:        { id: 13294, nom: 'Pendule', p: 'P19', pa: 4, po: [0, 4], los: 0, line: 0, t: 2, c: 1, cb: 15, taken: 1 },
  Perturbation:   { id: 13288, nom: 'Perturbation', p: 'P2', pa: 3, po: [1, 4], los: 1, line: 1, t: 3, c: 2, cb: 10 },
  Rouage:         { id: 13283, nom: 'Rouage', p: 'P2', pa: 4, po: [0, 2], los: 1, line: 0, t: 2, c: 99, cb: 15 },
  Souvenir:       { id: 13281, nom: 'Souvenir', p: 'P3', pa: 2, po: [1, 6], los: 1, line: 0, t: 4, c: 2, cb: 5 },
  Permutation:    { id: 13285, nom: 'Permutation', p: 'P3', pa: 4, po: [2, 2], los: 1, line: 0, t: 2, c: 99, cb: 15, taken: 1 },
  Aiguille:       { id: 13244, nom: 'Aiguille', p: 'P4', pa: 2, po: [1, 6], los: 1, line: 0, t: 3, c: 1, cb: 5 },
  Fletrissement:  { id: 13254, nom: 'Flétrissement', p: 'P4', pa: 3, po: [1, 6], los: 1, line: 0, t: 3, c: 2, cb: 10 },
  Refraction:     { id: 13286, nom: 'Réfraction', p: 'P6', pa: 2, po: [1, 6], los: 1, line: 0, t: 3, c: 2, cb: 5 },
  Regulateur:     { id: 13248, nom: 'Régulateur', p: 'P6', pa: 3, po: [0, 6], los: 1, line: 0, t: 1, c: 1, cb: 10 },
  Poussiere:      { id: 13257, nom: 'Poussière', p: 'P8', pa: 4, po: [0, 6], los: 1, line: 0, t: 2, c: 99, cb: 15 },
  Gelure:         { id: 13245, nom: 'Gelure', p: 'P8', pa: 2, po: [1, 6], los: 0, line: 1, t: 4, c: 2, cb: 5 },
  Sablier:        { id: 13261, nom: 'Sablier de Xélor', p: 'P9', pa: 2, po: [0, 6], los: 0, line: 1, t: 2, c: 1, cb: 5 },
  Ralentissement: { id: 13242, nom: 'Ralentissement', p: 'P9', pa: 2, po: [1, 6], los: 1, line: 0, t: 4, c: 2, cb: 5 },
  Engrenage:      { id: 13299, nom: 'Engrenage', p: 'P10', pa: 3, po: [0, 6], los: 1, line: 0, t: 2, c: 99, cb: 10 },
  CompteGoutte:   { id: 13259, nom: 'Compte-goutte', p: 'P10', pa: 3, po: [1, 6], los: 1, line: 0, t: 3, c: 2, cb: 10, taken: 1 },
  Sables:         { id: 13292, nom: 'Sables du Temps', p: 'P12', pa: 4, po: [1, 6], los: 1, line: 0, t: 1, c: 99, cb: 15, taken: 1 },
  Distorsion:     { id: 13289, nom: 'Distorsion', p: 'P12', pa: 4, po: [0, 3], los: 1, line: 0, t: 2, c: 99, cb: 15 },
  Rayon:          { id: 13253, nom: 'Rayon Obscur', p: 'P14', pa: 4, po: [1, 6], los: 1, line: 1, t: 1, c: 99, cb: 15 },
  Dessechement:   { id: 13284, nom: 'Dessèchement', p: 'P14', pa: 4, po: [1, 6], los: 1, line: 1, t: 1, c: 99, cb: 15, taken: 1 },
  Paradoxe:       { id: 13250, nom: 'Paradoxe', p: 'P15', pa: 2, po: [0, 0], los: 0, line: 0, t: 1, c: 99, cb: 0 },
  Faille:         { id: 13295, nom: 'Faille', p: 'P15', pa: 4, po: [0, 0], los: 0, line: 0, t: 1, c: 99, cb: 0 },
  Glas:           { id: 13300, nom: 'Glas', p: 'P16', pa: 3, po: [0, 3], los: 1, line: 1, t: 1, c: 99, cb: 5 },
  Petrification:  { id: 13290, nom: 'Pétrification', p: 'P17', pa: 4, po: [1, 6], los: 1, line: 0, t: 3, c: 2, cb: 15 },
  Gousset:        { id: 14651, nom: 'Gousset', p: 'P17', pa: 2, po: [0, 6], los: 1, line: 0, t: 2, c: 1, cb: 5 },
  Horloge:        { id: 13256, nom: 'Horloge', p: 'P18', pa: 4, po: [1, 6], los: 1, line: 0, t: 3, c: 2, cb: 15 },
  Clepsydre:      { id: 13298, nom: 'Clepsydre', p: 'P18', pa: 4, po: [1, 6], los: 1, line: 0, t: 3, c: 2, cb: 15 },
  Momification:   { id: 13260, nom: 'Momification', p: 'P20', pa: 2, po: [0, 0], los: 0, line: 0, t: 1, c: 99, cb: 0 },
  Astrolabe:      { id: 13282, nom: 'Astrolabe', p: 'P1', pa: 2, po: [0, 3], los: 1, line: 0, t: 9, c: 1, cb: 0 },
  Teleportation:  { id: 13249, nom: 'Téléportation', p: 'P1', pa: 2, po: [1, 5], los: 0, line: 0, t: 9, c: 1, cb: 0, taken: 1 },
  // Ajoutés le 13/11/2026 (règles décrites par le joueur, voir docs/MECANIQUES.md). Pas de dégâts directs.
  // libre : case sans entité ni piège.
  Desynchronisation: { id: 13296, nom: 'Désynchronisation', p: 'P22', pa: 2, po: [1, 6], los: 0, line: 0, t: 2, c: 99, cb: 0, libre: 1 },
  EspaceTemps:    { id: 13297, nom: 'Espace-temps', p: 'P22', pa: 2, po: [0, 6], los: 1, line: 0, t: 1, c: 99, cb: 0 },
};

// Bases de dégâts : [élément, [normal min, max], [critique min, max]].
// SablierBoom = explosion du Sablier (bonus de crit 5 %, comme dans le prototype).
export const DMG = {
  Frappe: ['T', [22, 25], [26, 30]], Pendule: ['A', [33, 36], [40, 43]], Perturbation: ['F', [23, 26], [28, 31]],
  Rouage: ['T', [20, 22], [24, 26]], Souvenir: ['A', [10, 12], [13, 15]], Permutation: ['E', [21, 24], [25, 29]],
  Aiguille: ['T', [9, 12], [13, 16]], Fletrissement: ['A', [25, 28], [30, 34]], Refraction: ['F', [16, 18], [19, 22]],
  Regulateur: ['T', [25, 28], [30, 34]], Poussiere: ['F', [29, 32], [35, 38]], Gelure: ['E', [10, 12], [13, 15]],
  Sablier: ['F', [10, 12], [13, 15]], SablierBoom: ['F', [23, 25], [28, 30]], Ralentissement: ['E', [15, 17], [18, 20]],
  Engrenage: ['T', [22, 24], [26, 29]], CompteGoutte: ['E', [18, 21], [22, 25]], Sables: ['F', [33, 36], [40, 43]],
  Distorsion: ['A', [29, 32], [35, 38]], Rayon: ['F', [31, 34], [37, 41]], Dessechement: ['A', [31, 34], [37, 41]],
  Petrification: ['E', [27, 30], [32, 36]], Gousset: ['A', [12, 14], [15, 17]], Horloge: ['T', [23, 25], [28, 30]],
  Clepsydre: ['E', [33, 37], [40, 44]],
};

// Sorts sans dégâts directs, utiles au set-up ou plus tard (Synchro : étape 2).
export const AUTRES_SORTS = {
  Rembobinage: 13243, Remanence: 13255, Complice: 13287, Cadran: 13258, Flou: 13246, Conservation: 13291,
  Fuite: 13251, Premonition: 13293, Synchro: 13247, VingtCinquieme: 14650, Raulebaque: 13262, Instabilite: 13301,
};

// Choix de variantes T2 Terre-Feu (docs/RESULTATS_REFERENCE.md) : sorts retirés de la recherche.
export const BANNIS_T2_TERRE_FEU = ['Glas', 'Perturbation', 'Permutation', 'Regulateur', 'Gelure', 'Ralentissement',
  'CompteGoutte', 'Distorsion', 'Dessechement', 'Clepsydre'];
