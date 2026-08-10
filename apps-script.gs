/**
 * VARELLO — Backend de métricas (Google Apps Script)
 * ----------------------------------------------------
 * Este script recibe eventos desde index.html (page_view, click_yes, click_no,
 * exit_no_interaction, envio_nombre, clic_canjear) y los guarda en una hoja de
 * cálculo de Google. admin.html lee estos datos ya agregados vía doGet().
 *
 * CÓMO INSTALAR (una sola vez):
 * 1. Crea una hoja de cálculo nueva en Google Sheets (sheets.new).
 * 2. Extensiones > Apps Script.
 * 3. Borra el contenido de Code.gs y pega todo este archivo.
 * 4. Haz clic en "Implementar" > "Nueva implementación".
 *    - Tipo: "Aplicación web"
 *    - Ejecutar como: "Yo"
 *    - Quién tiene acceso: "Cualquier usuario"
 * 5. Copia la URL que termina en /exec.
 * 6. Pega esa URL en:
 *    - index.html      → variable APPS_SCRIPT_URL
 *    - admin.html       → variable APPS_SCRIPT_URL
 */

var SHEET_NAME = 'eventos';
var EVENTOS_VALIDOS = ['page_view', 'click_yes', 'click_no', 'exit_no_interaction', 'envio_nombre', 'clic_canjear'];

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['timestamp', 'evento', 'nombre', 'pagina']);
  }
  return sheet;
}

function doPost(e) {
  var sheet = getSheet_();
  var data = {};
  try {
    data = JSON.parse(e.postData.contents);
  } catch (err) {
    data = { evento: 'error_parse', nombre: '', pagina: '' };
  }
  var evento = EVENTOS_VALIDOS.indexOf(data.evento) > -1 ? data.evento : 'otro';
  sheet.appendRow([new Date(), evento, data.nombre || '', data.pagina || '']);
  return ContentService.createTextOutput(JSON.stringify({ ok: true }))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var sheet = getSheet_();
  var rows = sheet.getDataRange().getValues();

  var counts = {
    page_view: 0,
    click_yes: 0,
    click_no: 0,
    exit_no_interaction: 0,
    envio_nombre: 0,
    clic_canjear: 0
  };

  for (var i = 1; i < rows.length; i++) {
    var evento = rows[i][1];
    if (counts.hasOwnProperty(evento)) counts[evento]++;
  }

  var totalDecisiones = counts.click_yes + counts.click_no;

  var resumen = {
    page_view: counts.page_view,
    click_yes: counts.click_yes,
    click_no: counts.click_no,
    exit_no_interaction: counts.exit_no_interaction,
    envio_nombre: counts.envio_nombre,
    clic_canjear: counts.clic_canjear,
    tasa_si: totalDecisiones > 0 ? (counts.click_yes / totalDecisiones) : 0,
    tasa_no: totalDecisiones > 0 ? (counts.click_no / totalDecisiones) : 0,
    tasa_salida: counts.page_view > 0 ? (counts.exit_no_interaction / counts.page_view) : 0,
    tasa_conversion_final: counts.page_view > 0 ? (counts.clic_canjear / counts.page_view) : 0,
    actualizado: new Date().toISOString()
  };

  return ContentService.createTextOutput(JSON.stringify(resumen))
    .setMimeType(ContentService.MimeType.JSON);
}
