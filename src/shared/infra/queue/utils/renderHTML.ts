import ejs from "ejs";

export function renderHTML(filePath: string, data: any): string | undefined {
  let html;

  ejs.renderFile(filePath, data, (err, res) => {
    if (!err) html = res;
  });

  return html;
}
