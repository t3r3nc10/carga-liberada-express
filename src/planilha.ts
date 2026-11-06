const URL_PLANILHA =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vTV5Pv2oA9j2-JAphuLqj1ZMzRJoTBE8ysRcu8RGJ6dUBrsUt_9E21RXVboITangFiXvt2jEkxNdXyi/pub?output=csv";

function lerCSV(texto: string): string[][] {
  const linhas: string[][] = [];
  let linha: string[] = [], campo = "", aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === ",") { linha.push(campo); campo = ""; }
    else if (c === "\n") { linha.push(campo); linhas.push(linha); linha = []; campo = ""; }
    else if (c !== "\r") campo += c;
  }
  if (campo || linha.length) { linha.push(campo); linhas.push(linha); }
  return linhas;
}

export async function carregarItens(): Promise<Record<string, string>[]> {
  const resp = await fetch(URL_PLANILHA + "&t=" + Date.now());
  const [cab, ...dados] = lerCSV(await resp.text());
  return dados
    .filter((l) => l.some((v) => v.trim() !== ""))
    .map((l) => Object.fromEntries(cab.map((nome, i) => [nome.trim(), (l[i] ?? "").trim()])));
}
