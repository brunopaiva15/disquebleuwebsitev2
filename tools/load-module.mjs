/* Charge un module du site depuis Node.

   Le dépôt n'a pas de `package.json` : Node lirait `assets/js/*.js` comme du
   CommonJS et refuserait les `import`. On passe donc par une URL `data:`, ce
   qui interdit en retour les spécificateurs relatifs. Ils sont réécrits en
   URL absolues avant le chargement, si bien qu'un module qui en importe un
   autre se charge comme dans le navigateur. */

import { readFile } from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url);

export async function loadSiteModule(path) {
  const url = new URL(path, ROOT);
  const source = (await readFile(url, 'utf8')).replace(
    /(\bfrom\s+)'(\.\.?\/[^']+)'/g,
    (_, prefix, specifier) => `${prefix}'${new URL(specifier, url).href}'`,
  );
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
}

export { ROOT };
