// Conditions d'objet (criterions DofusDB), partagées par outils/optimiseur_stuff.mjs et outils/pilote_voies.mjs.
// Grammaire : expr := terme ('|' terme)* ; terme := facteur ('&' facteur)* ; facteur := '(' expr ')' | atome.
// Atome : deux lettres, un opérateur (< > = ! ~), une valeur. Exemple : CS>299&(CI>299|CC>299).
export function parseCond(str) {
  let i = 0;
  const expr = () => { const t = [terme()]; while (str[i] === '|') { i++; t.push(terme()); } return t.length > 1 ? { ou: t } : t[0]; };
  const terme = () => { const f = [facteur()]; while (str[i] === '&') { i++; f.push(facteur()); } return f.length > 1 ? { et: f } : f[0]; };
  const facteur = () => {
    if (str[i] === '(') { i++; const e = expr(); i++; return e; }
    const m = /^([A-Za-z]{2})([<>=!~])([^&|()]*)/.exec(str.slice(i));
    if (!m) throw new Error(`Condition illisible : ${str}`);
    i += m[0].length;
    return { cle: m[1], op: m[2], val: m[3] };
  };
  return str ? expr() : null;
}
export const atomes = (a) => (!a ? [] : a.ou ? a.ou.flatMap(atomes) : a.et ? a.et.flatMap(atomes) : [a]);
export function evalCond(a, atome) {
  if (!a) return true;
  if (a.ou) return a.ou.some((x) => evalCond(x, atome));
  if (a.et) return a.et.every((x) => evalCond(x, atome));
  return atome(a);
}
export const comparer = (v, op, x) => (op === '<' ? v < x : op === '>' ? v > x : op === '=' ? v === x : op === '!' ? v !== x : true);

// Règle 9 de CLAUDE.md : un objet dont la condition empêche d'avoir 12 PA et le minimum de PM du stuff est exclu.
// pmMin = 6 (règle d'avant le 24/11/2026, inchangée) : tout objet avec une condition « CP< » ou « CM< » est exclu.
// pmMin = 5 (stuffs à 5 PM, ✅ décision du joueur du 24/11/2026) : l'objet reste candidat si sa condition peut être
// remplie avec 12 PA et un nombre de PM entre pmMin et min(pmMax, 6), les autres atomes étant supposés remplis (ils
// sont vérifiés stuff par stuff, comme la condition elle-même, sur les PA et PM totaux). Exemple : « CP<12|CM<6 »
// est possible à 5 PM, « CP<12 » ou « CM<5 » ne le sont pas.
export function empecheLesPAPM(criterions, pmMin = 6, pmMax = Infinity) {
  const c = criterions || '';
  if (!/C[PM]</.test(c)) return false;
  if (pmMin >= 6) return true;
  const arbre = parseCond(c);
  for (let pm = pmMin; pm <= Math.min(pmMax, 6); pm++) {
    if (evalCond(arbre, (a) => (a.cle === 'CP' ? comparer(12, a.op, +a.val) : a.cle === 'CM' ? comparer(pm, a.op, +a.val) : true))) return false;
  }
  return true;
}
