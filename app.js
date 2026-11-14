(function () {
  "use strict";

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const cfg = window.APP_CONFIG || {
    sources: {},
    territorio: { departamento: "La Guajira", capital: "Riohacha" }
  };

  /* ------------------------------------------------------------------
     Datos de respaldo: permiten que la página muestre las series
     principales incluso si el navegador bloquea la carga de JSON.
     Al cargar los JSON oficiales, estos valores se reemplazan.
     ------------------------------------------------------------------ */
  const FALLBACK_PIB = [
    { year: 2016, pib_dep: 9.4423, pib_col: 863.782, crecimiento_dep: 2.60, crecimiento_col: 2.09, participacion: 1.09 },
    { year: 2017, pib_dep: 10.7846, pib_col: 920.471, crecimiento_dep: 1.18, crecimiento_col: 1.36, participacion: 1.17 },
    { year: 2018, pib_dep: 11.8819, pib_col: 987.791, crecimiento_dep: -0.21, crecimiento_col: 2.56, participacion: 1.20 },
    { year: 2019, pib_dep: 11.2251, pib_col: 1060.068, crecimiento_dep: -0.24, crecimiento_col: 3.19, participacion: 1.06 },
    { year: 2020, pib_dep: 8.7088, pib_col: 998.471, crecimiento_dep: -23.57, crecimiento_col: -7.19, participacion: 0.87 },
    { year: 2021, pib_dep: 14.4725, pib_col: 1192.634, crecimiento_dep: 28.08, crecimiento_col: 10.80, participacion: 1.21 },
    { year: 2022, pib_dep: 22.8801, pib_col: 1471.079, crecimiento_dep: -2.86, crecimiento_col: 7.33, participacion: 1.56 },
    { year: 2023, pib_dep: 20.4833, pib_col: 1587.200, crecimiento_dep: 1.38, crecimiento_col: 0.84, participacion: 1.29 },
    { year: 2024, pib_dep: 18.2582, pib_col: 1713.316, crecimiento_dep: -1.20, crecimiento_col: 1.49, participacion: 1.07 },
    { year: 2025, pib_dep: 17.7564, pib_col: 1852.670, crecimiento_dep: -1.59, crecimiento_col: 2.57, participacion: 0.96 }
  ];

  const FALLBACK_INFORMALIDAD = [
    { year: 2016, riohacha: 62.46, ciudades23: 48.67, brecha: 13.79 },
    { year: 2017, riohacha: 63.52, ciudades23: 48.30, brecha: 15.22 },
    { year: 2018, riohacha: 62.11, ciudades23: 48.16, brecha: 13.95 },
    { year: 2019, riohacha: 61.71, ciudades23: 47.61, brecha: 14.10 },
    { year: 2020, riohacha: 59.23, ciudades23: 48.97, brecha: 10.26 },
    { year: 2021, riohacha: 68.26, ciudades23: 45.71, brecha: 22.55 },
    { year: 2022, riohacha: 67.94, ciudades23: 44.26, brecha: 23.68 },
    { year: 2023, riohacha: 61.01, ciudades23: 42.97, brecha: 18.04 },
    { year: 2024, riohacha: 61.79, ciudades23: 43.76, brecha: 18.03 },
    { year: 2025, riohacha: 61.37, ciudades23: 43.61, brecha: 17.76 }
  ];

  const FALLBACK_EMPLEO = {
    years: ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"],
    indicators: {
      "Tasa de Desocupación (TD)": [8.2, 5.4, 3.2, 5.0, 9.1, 5.2, 8.9, 14.5, 11.6, 12.3]
    },
    nacional: {
      indicators: {
        "Tasa de Desocupación (TD)": [9.5, 9.7, 10.0, 10.9, 16.5, 13.8, 11.2, 10.2, 10.2, 8.9]
      }
    }
  };

  const FALLBACK_IPC = {
    data: [
      { year: 2017, scope: "Riohacha", year_to_date: 1.28 },
      { year: 2017, scope: "Colombia", year_to_date: 4.09 },
      { year: 2018, scope: "Riohacha", year_to_date: 2.84 },
      { year: 2018, scope: "Colombia", year_to_date: 3.18 },
      { year: 2019, scope: "Riohacha", year_to_date: 4.79 },
      { year: 2019, scope: "Colombia", year_to_date: 3.80 },
      { year: 2020, scope: "Riohacha", year_to_date: 2.30 },
      { year: 2020, scope: "Colombia", year_to_date: 1.61 },
      { year: 2021, scope: "Riohacha", year_to_date: 5.92 },
      { year: 2021, scope: "Colombia", year_to_date: 5.62 },
      { year: 2022, scope: "Riohacha", year_to_date: 15.52 },
      { year: 2022, scope: "Colombia", year_to_date: 13.12 },
      { year: 2023, scope: "Riohacha", year_to_date: 9.38 },
      { year: 2023, scope: "Colombia", year_to_date: 9.28 },
      { year: 2024, scope: "Riohacha", year_to_date: 4.06 },
      { year: 2024, scope: "Colombia", year_to_date: 5.20 },
      { year: 2025, scope: "Riohacha", year_to_date: 4.06 },
      { year: 2025, scope: "Colombia", year_to_date: 5.10 },
      { year: 2026, scope: "Riohacha", year_to_date: 4.06 },
      { year: 2026, scope: "Colombia", year_to_date: 5.74 }
    ]
  };

  const FALLBACK_RAMAS = {
    years: ["2025"],
    data: {
      "Total ocupados": ["388"],
      "No informa": ["0"],
      "Agricultura, ganadería, caza, silvicultura y pesca": ["60"],
      "Explotación de minas y canteras": ["7"],
      "Industrias manufactureras": ["72"],
      "Suministro de electricidad, gas, agua y gestión de desechos": ["6"],
      "Construcción": ["28"],
      "Comercio y reparación de vehículos": ["46"],
      "Alojamiento y servicios de comida": ["23"],
      "Transporte y almacenamiento": ["49"],
      "Información y comunicaciones": ["1"],
      "Actividades financieras y de seguros": ["2"],
      "Actividades inmobiliarias": ["0"],
      "Actividades profesionales, científicas, técnicas y de servicios administrativos": ["13"],
      "Administración pública y defensa, educación y atención de la salud humana": ["45"],
      "Actividades artísticas, entretenimiento, recreación y otras actividades de servicios": ["36"]
    }
  };

  const FALLBACK_MERCADO_SEXO = {
    year: 2025,
    source: "DANE - GEIH, mercado laboral por departamentos 2025",
    note: "Cifras en miles de personas, excepto las tasas (%). La población corresponde a la expansión de la GEIH y no a la proyección de población de la Tabla 1.",
    rows: [
      { indicador: "Población total", tipo: "nivel", total: 1041, hombres: 509, mujeres: 532 },
      { indicador: "Población en edad de trabajar (PET)", tipo: "nivel", total: 713, hombres: 343, mujeres: 370 },
      { indicador: "Fuerza de trabajo", tipo: "nivel", total: 442, hombres: 252, mujeres: 190 },
      { indicador: "Población ocupada", tipo: "nivel", total: 388, hombres: 228, mujeres: 160 },
      { indicador: "Población desocupada", tipo: "nivel", total: 54, hombres: 24, mujeres: 30 },
      { indicador: "Población fuera de la fuerza de trabajo", tipo: "nivel", total: 270, hombres: 90, mujeres: 180 },
      { indicador: "Población subocupada", tipo: "nivel", total: 42, hombres: 25, mujeres: 17 },
      { indicador: "Tasa global de participación", tipo: "tasa", total: 62.1, hombres: 73.6, mujeres: 51.3 },
      { indicador: "Tasa de ocupación", tipo: "tasa", total: 54.4, hombres: 66.5, mujeres: 43.2 },
      { indicador: "Tasa de desocupación", tipo: "tasa", total: 12.3, hombres: 9.7, mujeres: 15.8, brecha: 6.2 },
      { indicador: "Tasa de subocupación", tipo: "tasa", total: 9.5, hombres: 10.0, mujeres: 8.9 }
    ]
  };

  const FALLBACK_DESEMPLEO_EDAD_SEXO = {
    year: 2025,
    source: "DANE - GEIH 2025, microdatos mensuales; cálculos propios",
    note: "Estimaciones por edad y sexo con muestras limitadas; pueden diferir de la serie oficial.",
    oficial: { total: 12.3, hombres: 9.7, mujeres: 15.8, brecha: 6.2 },
    data: [
      { age: "15–24", total: 16.6, hombres: 15.7, mujeres: 17.6 },
      { age: "25–34", total: 15.0, hombres: 12.0, mujeres: 18.9 },
      { age: "35–44", total: 11.2, hombres: 6.6, mujeres: 16.4 },
      { age: "45–54", total: 9.4, hombres: 7.6, mujeres: 11.9 },
      { age: "55–64", total: 5.2, hombres: 5.6, mujeres: 4.6 },
      { age: "65+", total: 2.0, hombres: 2.6, mujeres: 1.1, muestra_baja: true }
    ]
  };

  const state = {
    bundle: null,
    ipc: FALLBACK_IPC,
    empleo: FALLBACK_EMPLEO
  };

  const IPC_YEARS = [2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025, 2026];
  const EMP_YEARS = [2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];

  /* ------------------------------ Utilidades ------------------------------ */
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;"
    }[c]));
  }

  function num(v) {
    if (v == null || v === "") return null;
    const n = Number(String(v).replace(/,/g, "."));
    return Number.isFinite(n) ? n : null;
  }

  function fmt(v, d = 2) {
    if (v == null || v === "" || Number.isNaN(+v)) return "—";
    return (+v)
      .toLocaleString("es-CO", { minimumFractionDigits: d, maximumFractionDigits: d })
      .replace(/-/g, "−");
  }

  function fmt0(v) {
    if (v == null || Number.isNaN(+v)) return "—";
    return (+v)
      .toLocaleString("es-CO", { maximumFractionDigits: 0 })
      .replace(/-/g, "−");
  }

  function signed(v, d = 2) {
    if (v == null || Number.isNaN(+v)) return "—";
    return (v > 0 ? "+" : "") + fmt(v, d);
  }

  async function fetchJson(path) {
    const res = await fetch(path, { cache: "no-store" });
    if (!res.ok) throw new Error(res.status + " " + res.statusText + " (" + path + ")");
    return res.json();
  }

  /* ------------------------------ Series ------------------------------ */
  function getIpcAnnual(year) {
    const data = state.ipc && Array.isArray(state.ipc.data) ? state.ipc.data : [];
    const rio = data.find((d) => Number(d.year) === Number(year) && /riohacha/i.test(String(d.scope)));
    const col = data.find((d) => Number(d.year) === Number(year) && /colombia|total/i.test(String(d.scope)));
    return {
      rio: rio ? num(rio.year_to_date) : null,
      col: col ? num(col.year_to_date) : null
    };
  }

  function getEmpSeries(key) {
    const ind = (state.empleo && state.empleo.indicators) || {};
    const natInd =
      (state.empleo && state.empleo.nacional && state.empleo.nacional.indicators) ||
      FALLBACK_EMPLEO.nacional.indicators;
    const years = ((state.empleo && state.empleo.years) || []).map((y) => +y);
    const find = (obj, frag) => {
      const k = Object.keys(obj).find((x) => x.toLowerCase().includes(String(frag).toLowerCase()));
      return k ? obj[k] : null;
    };
    const a = find(ind, key);
    const b = find(natInd, key);
    return years.map((y, i) => ({
      year: y,
      dep: a ? num(a[i]) : null,
      col: b ? num(b[i]) : null
    }));
  }

  function getPibData() {
    const d = state.bundle && state.bundle.pib && state.bundle.pib.data;
    return Array.isArray(d) && d.length ? d : FALLBACK_PIB;
  }

  function getInformalidadData() {
    const d = state.bundle && state.bundle.informalidad && state.bundle.informalidad.data;
    return Array.isArray(d) && d.length ? d : FALLBACK_INFORMALIDAD;
  }

  function getRamasData() {
    const d = state.bundle && state.bundle.ramas;
    if (d && d.data && d.years && d.years.length) return d;
    return FALLBACK_RAMAS;
  }

  function getMercadoSexoData() {
    const d = state.bundle && state.bundle.mercado_laboral_sexo;
    return d && Array.isArray(d.rows) && d.rows.length ? d : FALLBACK_MERCADO_SEXO;
  }

  function getDesempleoEdadSexoData() {
    const d = state.bundle && state.bundle.desempleo_edad_sexo;
    return d && Array.isArray(d.data) && d.data.length ? d : FALLBACK_DESEMPLEO_EDAD_SEXO;
  }

  /* ------------------------------ Carga ------------------------------ */
  async function loadAll() {
    const status = $("#load-status");
    const pathValue = (sel, fallback) => {
      const el = $(sel);
      return (el && el.value.trim()) || fallback;
    };

    const paths = {
      bundle: pathValue("#path-bundle", cfg.sources.bundle || "data_guajira.json"),
      ipc: pathValue("#path-ipc", cfg.sources.ipcData || "ipc_riohacha.json"),
      emp: pathValue("#path-emp", cfg.sources.empleoData || "empleo_guajira.json")
    };

    /* Al abrir con file:// los navegadores bloquean fetch por seguridad.
       Se usan los datos de respaldo y se evita un error innecesario en consola. */
    if (window.location.protocol === "file:") {
      if (status) {
        status.classList.remove("error");
        status.textContent =
          "Página abierta como archivo local: se muestran los datos de respaldo. Para cargar los JSON automáticamente, use un servidor local o “Cargar archivo local”.";
      }
      return;
    }

    try {
      if (status) {
        status.classList.remove("error");
        status.textContent = "Cargando datos desde las rutas configuradas…";
      }

      state.bundle = await fetchJson(paths.bundle);
      state.ipc = state.bundle.ipc || (await fetchJson(paths.ipc));
      state.empleo = state.bundle.empleo || (await fetchJson(paths.emp));

      const pibRows = getPibData().length;
      const infRows = getInformalidadData().length;
      const ipcYears =
        state.ipc && Array.isArray(state.ipc.data)
          ? new Set(state.ipc.data.map((d) => String(d.year))).size
          : 0;
      if (status) {
        status.textContent =
          "Datos cargados correctamente: IPC " +
          ipcYears +
          " años, empleo " +
          ((state.empleo && state.empleo.years && state.empleo.years.length) || 0) +
          " años, PIB " +
          pibRows +
          " años e informalidad " +
          infRows +
          " años. Fuente: DANE.";
      }
      renderAll();
    } catch (e) {
      console.error(e);
      if (status) {
        status.classList.add("error");
        status.textContent =
          "No se pudo cargar automáticamente (" +
          e.message +
          "). Se muestran los datos de respaldo. Abra la página con un servidor local o use “Cargar archivo local” en la sección de datos.";
      }
      renderAll();
    }
  }

  function localLoader(input, kind) {
    if (!input) return;
    input.addEventListener("change", async (ev) => {
      const f = ev.target.files && ev.target.files[0];
      if (!f) return;
      const status = $("#load-status");
      try {
        const txt = await f.text();
        const obj = JSON.parse(txt);
        if (kind === "bundle") {
          state.bundle = obj;
          if (obj.ipc) state.ipc = obj.ipc;
          if (obj.empleo) state.empleo = obj.empleo;
        } else if (kind === "ipc") {
          state.ipc = obj;
        } else {
          state.empleo = obj;
        }
        if (status) {
          status.classList.remove("error");
          status.textContent = "Archivo local cargado: " + f.name + ". Datos actualizados.";
        }
        renderAll();
      } catch (e) {
        if (status) {
          status.classList.add("error");
          status.textContent = "Error leyendo " + f.name + ": " + e.message;
        }
      }
    });
  }

  /* ------------------------------ KPI ------------------------------ */
  function renderKpis() {
    const emp = getEmpSeries("Desocup");
    const lastEmp = emp.filter((x) => x.dep != null).slice(-1)[0] || {
      year: 2025,
      dep: 12.3,
      col: 8.9
    };
    const pib = getPibData().slice(-1)[0] || FALLBACK_PIB[FALLBACK_PIB.length - 1];
    const inf = getInformalidadData().slice(-1)[0] || FALLBACK_INFORMALIDAD[FALLBACK_INFORMALIDAD.length - 1];
    const pibTag = Number(pib.year) === 2025 ? "pr" : Number(pib.year) === 2024 ? "p" : "";
    const k = $("#kpis");
    if (!k) return;

    k.innerHTML =
      '<div class="kpi kpi-danger">' +
        '<div class="k">Pobreza monetaria</div>' +
        '<div class="v">60,2%</div>' +
        '<div class="meta">La Guajira · 2025 · Colombia 28,0%</div>' +
      "</div>" +
      '<div class="kpi kpi-warn">' +
        '<div class="k">Desempleo</div>' +
        '<div class="v">' + fmt(lastEmp.dep, 1) + "%</div>" +
        '<div class="meta">La Guajira · ' + lastEmp.year + " · Colombia " + fmt(lastEmp.col, 1) + "%</div>" +
      "</div>" +
      '<div class="kpi kpi-brand">' +
        '<div class="k">PIB departamental</div>' +
        '<div class="v">' + fmt(pib.pib_dep, 2) + "</div>" +
        '<div class="meta">Billones de $ · ' + pib.year + (pibTag ? pibTag : "") + " · " + fmt(pib.participacion, 2) + "% nacional</div>" +
      "</div>" +
      '<div class="kpi kpi-sky">' +
        '<div class="k">Informalidad</div>' +
        '<div class="v">' + fmt(inf.riohacha, 2) + "%</div>" +
        '<div class="meta">Riohacha · Q4 ' + inf.year + " · 23 ciudades " + fmt(inf.ciudades23, 2) + "%</div>" +
      "</div>";
  }

  /* ------------------------------ Tablas ------------------------------ */
  function renderIpcTable() {
    const tb = $("#tabla-ipc");
    if (!tb) return;
    if (!state.ipc || !Array.isArray(state.ipc.data)) {
      tb.innerHTML = '<tr><td colspan="4" class="chart-empty">Sin datos de IPC. Cargue <code>ipc_riohacha.json</code>.</td></tr>';
      return;
    }
    tb.innerHTML = IPC_YEARS.map((y) => {
      const r = getIpcAnnual(y);
      const diff = r.rio != null && r.col != null ? r.rio - r.col : null;
      const cls = diff == null ? "neutral" : diff > 0 ? "bad" : diff < 0 ? "good" : "neutral";
      const tag = y === 2026 ? ' <span class="year-tag">ene–sep</span>' : "";
      return (
        "<tr>" +
          "<td>" + y + tag + "</td>" +
          '<td class="num">' + fmt(r.rio, 2) + "</td>" +
          '<td class="num">' + fmt(r.col, 2) + "</td>" +
          '<td class="num delta ' + cls + '">' + signed(diff, 2) + "</td>" +
        "</tr>"
      );
    }).join("");
  }

  function renderEmpTable() {
    const tb = $("#tabla-desempleo");
    if (!tb) return;
    const series = getEmpSeries("Desocup").filter((x) => x.year >= 2016);
    if (!series.length) {
      tb.innerHTML = '<tr><td colspan="4" class="chart-empty">Sin datos de empleo. Cargue <code>empleo_guajira.json</code>.</td></tr>';
      return;
    }
    tb.innerHTML = series.map((r) => {
      const diff = r.dep != null && r.col != null ? r.dep - r.col : null;
      const cls = diff == null ? "neutral" : diff > 0 ? "bad" : diff < 0 ? "good" : "neutral";
      return (
        "<tr>" +
          "<td>" + r.year + "</td>" +
          '<td class="num">' + fmt(r.dep, 1) + "</td>" +
          '<td class="num">' + fmt(r.col, 1) + "</td>" +
          '<td class="num delta ' + cls + '">' + signed(diff, 1) + "</td>" +
        "</tr>"
      );
    }).join("");
  }

  function renderMercadoSexoTable() {
    const tb = $("#tabla-sexo");
    if (!tb) return;
    const d = getMercadoSexoData();
    if (!d || !Array.isArray(d.rows) || !d.rows.length) {
      tb.innerHTML = '<tr><td colspan="5" class="chart-empty">Sin datos de mercado laboral por sexo. Cargue <code>data_guajira.json</code>.</td></tr>';
      return;
    }
    tb.innerHTML = d.rows.map((r) => {
      const isRate = r.tipo === "tasa";
      const diff = r.brecha != null ? Number(r.brecha) : Number(r.mujeres) - Number(r.hombres);
      const diffText = isRate ? signed(diff, 1) + " pp" : signed(diff, 0);
      const cls = isRate && /desocupación/i.test(r.indicador)
        ? diff > 0 ? "bad" : diff < 0 ? "good" : "neutral"
        : "neutral";
      const formatValue = isRate ? (v) => fmt(v, 1) : (v) => fmt0(v);
      return (
        "<tr>" +
          "<td>" + esc(r.indicador) + "</td>" +
          '<td class="num">' + formatValue(r.total) + "</td>" +
          '<td class="num">' + formatValue(r.hombres) + "</td>" +
          '<td class="num">' + formatValue(r.mujeres) + "</td>" +
          '<td class="num delta ' + cls + '">' + diffText + "</td>" +
        "</tr>"
      );
    }).join("");
  }

  function renderDesempleoEdadSexoTable() {
    const tb = $("#tabla-edad-sexo");
    if (!tb) return;
    const d = getDesempleoEdadSexoData();
    if (!d || !Array.isArray(d.data) || !d.data.length) {
      tb.innerHTML = '<tr><td colspan="5" class="chart-empty">Sin datos de desocupación por edad y sexo. Cargue <code>data_guajira.json</code>.</td></tr>';
      return;
    }
    const rows = d.data.map((r) => {
      const diff = Number(r.mujeres) - Number(r.hombres);
      const cls = diff > 0 ? "bad" : diff < 0 ? "good" : "neutral";
      const flag = r.muestra_baja
        ? ' <sup class="sample-flag" title="Muestra anual muy pequeña; estimación no robusta">a</sup>'
        : "";
      return (
        "<tr>" +
          "<td>" + esc(r.age) + flag + "</td>" +
          '<td class="num">' + fmt(r.total, 1) + "</td>" +
          '<td class="num">' + fmt(r.hombres, 1) + "</td>" +
          '<td class="num">' + fmt(r.mujeres, 1) + "</td>" +
          '<td class="num delta ' + cls + '">' + signed(diff, 1) + "</td>" +
        "</tr>"
      );
    });
    const o = d.oficial || {};
    if (o.total != null) {
      rows.push(
        '<tr class="total-row">' +
          '<td>Total oficial 2025 <span class="table-sub">referencia Tabla 6</span></td>' +
          '<td class="num">' + fmt(o.total, 1) + "</td>" +
          '<td class="num">' + fmt(o.hombres, 1) + "</td>" +
          '<td class="num">' + fmt(o.mujeres, 1) + "</td>" +
          '<td class="num delta bad">' + signed(o.brecha != null ? o.brecha : o.mujeres - o.hombres, 1) + "</td>" +
        "</tr>"
      );
    }
    tb.innerHTML = rows.join("");
  }

  function renderPibTable() {
    const tb = $("#tabla-pib");
    if (!tb) return;
    const data = getPibData();
    if (!data.length) {
      tb.innerHTML = '<tr><td colspan="6" class="chart-empty">Sin datos de PIB. Cargue <code>data_guajira.json</code>.</td></tr>';
      return;
    }
    tb.innerHTML = data.map((p) => {
      const tag =
        Number(p.year) === 2024
          ? ' <span class="year-tag">p</span>'
          : Number(p.year) === 2025
            ? ' <span class="year-tag">pr</span>'
            : "";
      const highlight = Number(p.year) === 2020 || Number(p.year) === 2022 ? ' class="highlight-row"' : "";
      const dep = +p.crecimiento_dep;
      const col = +p.crecimiento_col;
      const depCls = dep > 0 ? "good" : dep < 0 ? "bad" : "neutral";
      const colCls = col > 0 ? "good" : col < 0 ? "bad" : "neutral";
      return (
        "<tr" + highlight + ">" +
          "<td>" + p.year + tag + "</td>" +
          '<td class="num">' + fmt(p.pib_dep, 2) + "</td>" +
          '<td class="num">' + fmt(p.pib_col, 2) + "</td>" +
          '<td class="num delta ' + depCls + '">' + signed(dep, 2) + "</td>" +
          '<td class="num delta ' + colCls + '">' + signed(col, 2) + "</td>" +
          '<td class="num">' + fmt(p.participacion, 2) + "</td>" +
        "</tr>"
      );
    }).join("");
  }

  function renderInformalidadTable() {
    const tb = $("#tabla-informalidad");
    if (!tb) return;
    const data = getInformalidadData();
    if (!data.length) {
      tb.innerHTML = '<tr><td colspan="4" class="chart-empty">Sin datos de informalidad. Cargue <code>data_guajira.json</code>.</td></tr>';
      return;
    }
    tb.innerHTML = data.map((r) => {
      const brecha =
        r.brecha != null
          ? r.brecha
          : r.riohacha != null && r.ciudades23 != null
            ? r.riohacha - r.ciudades23
            : null;
      const highlight = Number(r.year) === 2021 || Number(r.year) === 2022 ? ' class="highlight-row"' : "";
      return (
        "<tr" + highlight + ">" +
          "<td>" + r.year + "</td>" +
          '<td class="num">' + fmt(r.riohacha, 2) + "</td>" +
          '<td class="num">' + fmt(r.ciudades23, 2) + "</td>" +
          '<td class="num delta bad">' + signed(brecha, 2) + "</td>" +
        "</tr>"
      );
    }).join("");
  }

  function renderRamas() {
    const t = $("#tabla-ramas");
    const nota = $("#nota-ramas");
    const ramas = getRamasData();
    if (!t) return;
    if (!ramas || !ramas.data || !ramas.years || !ramas.years.length) {
      t.innerHTML = '<tr><td colspan="3" class="chart-empty">Sin datos de ramas de actividad. Cargue <code>data_guajira.json</code>.</td></tr>';
      return;
    }

    const years = ramas.years || [];
    const last = years[years.length - 1];
    const li = years.length - 1;
    const rows = Object.entries(ramas.data).filter(
      ([k]) => k && k !== "Total ocupados" && k !== "No informa"
    );
    const parsed = rows
      .map(([k, v]) => ({ k, v: num((v || [])[li]) }))
      .filter((r) => r.v != null)
      .sort((a, b) => b.v - a.v);
    const total = num((ramas.data["Total ocupados"] || [])[li]) || parsed.reduce((s, r) => s + r.v, 0);

    t.innerHTML =
      parsed
        .map(
          (r) =>
            "<tr>" +
              "<td>" + esc(r.k) + "</td>" +
              '<td class="num">' + fmt0(r.v) + "</td>" +
              '<td class="num">' + fmt(total ? (r.v / total) * 100 : null, 1) + "</td>" +
            "</tr>"
        )
        .join("") +
      '<tr><th>Total (' + (last || "último año") + ')</th><th class="num">' + fmt0(total) + '</th><th class="num">100,0</th></tr>';

    if (nota) {
      nota.innerHTML =
        "<strong>Fuente:</strong> DANE, GEIH – Ocupados según ramas CIIU 4 A.C., departamentos " +
        "(archivo <code>Empleo departamentos.xls</code>). Año mostrado: <strong>" +
        (last || "N/D") +
        "</strong>. Cifras en miles de personas. La participación se calcula sobre el total de ocupados del mismo año.";
    }
  }

  /* ------------------------------ Gráficas ------------------------------ */
  function svgBars(series, aKey, bKey, aName, bName, opts) {
    opts = opts || {};
    const w = 880;
    const h = 320;
    const padL = 56;
    const padR = 20;
    const padT = 46;
    const padB = 42;
    const innerW = w - padL - padR;
    const innerH = h - padT - padB;
    const labelKey = opts.labelKey || "year";
    const labelOf = (d) => (d[labelKey] == null ? "" : d[labelKey]);

    const vals = series
      .flatMap((d) => [d[aKey], d[bKey]])
      .filter((v) => v != null && v !== "" && Number.isFinite(+v))
      .map(Number);

    if (!vals.length) {
      return '<p class="chart-empty">Sin datos disponibles para esta gráfica.</p>';
    }

    let min = Math.min(0, ...vals);
    let max = Math.max(0, ...vals);
    if (max === min) max = min + 1;
    const pad = (max - min) * 0.12;
    max += pad;
    if (min < 0) min -= pad;
    const range = max - min;

    const gw = innerW / series.length;
    const bw = Math.min(30, gw * 0.32);
    const y = (v) => padT + innerH - ((v - min) / range) * innerH;
    const y0 = y(0);

    let out =
      '<svg class="chart" viewBox="0 0 ' + w + " " + h + '" role="img" aria-label="' +
      esc(opts.aria || "Gráfica comparativa") +
      '" preserveAspectRatio="xMidYMid meet">';

    // Cuadrícula y eje Y
    const ticks = 5;
    for (let i = 0; i <= ticks; i++) {
      const gv = min + (range * i) / ticks;
      const yy = y(gv);
      const label = fmt(gv, Math.abs(max - min) < 10 ? 1 : 0);
      out +=
        '<line class="grid" x1="' + padL + '" y1="' + yy + '" x2="' + (w - padR) + '" y2="' + yy + '"/>' +
        '<text class="axis-label" x="' + (padL - 9) + '" y="' + (yy + 4) + '" text-anchor="end">' + label + "</text>";
    }

    // Línea cero si hay valores negativos
    if (min < 0 && max > 0) {
      out += '<line class="zero" x1="' + padL + '" y1="' + y0 + '" x2="' + (w - padR) + '" y2="' + y0 + '"/>';
    }

    // Barras
    series.forEach((d, i) => {
      const cx = padL + i * gw + gw / 2;
      const a = d[aKey];
      const b = d[bKey];
      const unit = opts.unit || "%";

      if (a != null && Number.isFinite(+a)) {
        const ya = y(+a);
        const top = Math.min(ya, y0);
        const height = Math.max(1, Math.abs(ya - y0));
        out +=
          '<rect class="bar-a" x="' + (cx - bw - 2) + '" y="' + top + '" width="' + bw + '" height="' + height + '" rx="5">' +
          "<title>" + esc(labelOf(d)) + " " + esc(aName) + ": " + fmt(a, 2) + unit + "</title></rect>";
      }
      if (b != null && Number.isFinite(+b)) {
        const yb = y(+b);
        const top = Math.min(yb, y0);
        const height = Math.max(1, Math.abs(yb - y0));
        out +=
          '<rect class="bar-b" x="' + (cx + 2) + '" y="' + top + '" width="' + bw + '" height="' + height + '" rx="5">' +
          "<title>" + esc(labelOf(d)) + " " + esc(bName) + ": " + fmt(b, 2) + unit + "</title></rect>";
      }
      out += '<text class="year-label" x="' + cx + '" y="' + (h - 16) + '" text-anchor="middle">' + esc(labelOf(d)) + "</text>";
    });

    // Leyenda
    out +=
      '<g transform="translate(' + padL + ',18)">' +
        '<rect class="bar-a" x="0" y="-9" width="11" height="11" rx="3"/>' +
        '<text class="legend-text" x="16" y="1">' + esc(aName) + "</text>" +
        '<rect class="bar-b" x="160" y="-9" width="11" height="11" rx="3"/>' +
        '<text class="legend-text" x="176" y="1">' + esc(bName) + "</text>" +
      "</g>";

    out += "</svg>";
    return out;
  }

  function renderCharts() {
    const ipc = IPC_YEARS.map((y) => {
      const r = getIpcAnnual(y);
      return { year: y, dep: r.rio, col: r.col };
    });
    const emp = getEmpSeries("Desocup").filter((x) => EMP_YEARS.includes(x.year));

    const c1 = $("#chart-ipc");
    if (c1) {
      c1.innerHTML = svgBars(ipc, "dep", "col", "Riohacha", "Colombia", {
        unit: "%",
        aria: "Inflación año corrido en Riohacha y Colombia, 2017 a 2026; 2026 parcial a septiembre"
      });
    }

    const c2 = $("#chart-desempleo");
    if (c2) {
      c2.innerHTML = svgBars(emp, "dep", "col", "La Guajira", "Colombia", {
        unit: "%",
        aria: "Tasa de desocupación en La Guajira y Colombia, 2016 a 2025"
      });
    }
  }

  function renderPibChart() {
    const c = $("#chart-pib");
    if (!c) return;
    c.innerHTML = svgBars(getPibData(), "crecimiento_dep", "crecimiento_col", "La Guajira", "Colombia", {
      unit: "%",
      aria: "Crecimiento real anual del PIB de La Guajira y Colombia, 2016 a 2025"
    });
  }

  function renderInformalidadChart() {
    const c = $("#chart-informalidad");
    if (!c) return;
    c.innerHTML = svgBars(
      getInformalidadData(),
      "riohacha",
      "ciudades23",
      "Riohacha",
      "23 ciudades y A.M.",
      {
        unit: "%",
        aria: "Tasa de informalidad laboral en Riohacha y las 23 ciudades, cuarto trimestre 2016 a 2025"
      }
    );
  }

  function renderDesempleoEdadSexoChart() {
    const c = $("#chart-edad-sexo");
    if (!c) return;
    const d = getDesempleoEdadSexoData();
    c.innerHTML = svgBars(d.data, "hombres", "mujeres", "Hombres", "Mujeres", {
      unit: "%",
      labelKey: "age",
      aria: "Tasa de desocupación por grupo de edad y sexo en La Guajira, 2025"
    });
  }

  /* ------------------------------ Tema claro / oscuro ------------------------------ */
  const THEME_KEY = "guajira-theme";
  const themeMedia =
    window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function currentTheme() {
    return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
  }

  function applyTheme(theme, persist) {
    const next = theme === "dark" ? "dark" : "light";
    const dark = next === "dark";
    document.documentElement.setAttribute("data-theme", next);

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", dark ? "#0b1220" : "#0b1f3a");

    const btn = $("#theme-toggle");
    if (btn) {
      const label = dark ? "Activar modo claro" : "Activar modo oscuro";
      btn.setAttribute("aria-pressed", dark ? "true" : "false");
      btn.setAttribute("aria-label", label);
      btn.setAttribute("title", label);
      const icon = $(".theme-toggle-icon", btn);
      const text = $(".theme-toggle-text", btn);
      if (icon) icon.textContent = dark ? "☀️" : "🌙";
      if (text) text.textContent = dark ? "Modo claro" : "Modo oscuro";
    }

    if (persist) {
      try {
        localStorage.setItem(THEME_KEY, next);
      } catch (e) {
        /* El tema sigue funcionando aunque el navegador bloquee localStorage. */
      }
    }
  }

  function setupTheme() {
    const btn = $("#theme-toggle");
    if (!btn) return;

    applyTheme(currentTheme(), false);

    btn.addEventListener("click", () => {
      applyTheme(currentTheme() === "dark" ? "light" : "dark", true);
    });

    if (themeMedia) {
      const onChange = (ev) => {
        let saved = null;
        try {
          saved = localStorage.getItem(THEME_KEY);
        } catch (e) {
          saved = null;
        }
        if (!saved) applyTheme(ev.matches ? "dark" : "light", false);
      };
      if (typeof themeMedia.addEventListener === "function") {
        themeMedia.addEventListener("change", onChange);
      } else if (typeof themeMedia.addListener === "function") {
        themeMedia.addListener(onChange);
      }
    }
  }

  /* ------------------------------ Mapa interactivo ------------------------------ */
  const MAP_LABELS = {
    "44001": { u: 0.297, v: 0.390, anchor: "middle", lines: ["Riohacha"] },
    "44035": { u: 0.505, v: 0.588, anchor: "start", lines: ["Albania"], size: "small" },
    "44078": { u: 0.405, v: 0.715, anchor: "start", lines: ["Barrancas"], size: "small" },
    "44090": { u: 0.105, v: 0.665, anchor: "start", lines: ["Dibulla"], size: "small" },
    "44098": { u: 0.300, v: 0.750, anchor: "start", lines: ["Distracción"], size: "small" },
    "44110": { u: 0.390, v: 0.865, anchor: "start", lines: ["El Molino"], size: "small", leader: true },
    "44279": { u: 0.370, v: 0.795, anchor: "start", lines: ["Fonseca"], size: "small" },
    "44378": { u: 0.400, v: 0.665, anchor: "start", lines: ["Hatonuevo"], size: "small" },
    "44420": { u: 0.190, v: 0.955, anchor: "middle", lines: ["La Jagua", "del Pilar"], size: "small", leader: true },
    "44430": { u: 0.560, v: 0.515, anchor: "start", lines: ["Maicao"] },
    "44560": { u: 0.429, v: 0.412, anchor: "middle", lines: ["Manaure"] },
    "44650": { u: 0.120, v: 0.805, anchor: "end", lines: ["San Juan", "del Cesar"], size: "small", leader: true },
    "44847": { u: 0.753, v: 0.223, anchor: "middle", lines: ["Uribia"] },
    "44855": { u: 0.400, v: 0.965, anchor: "start", lines: ["Urumita"], size: "small", leader: true },
    "44874": { u: 0.400, v: 0.915, anchor: "start", lines: ["Villanueva"], size: "small", leader: true }
  };

  function mapName(value) {
    const raw = String(value || "");
    const fixed = raw.toUpperCase() === "DISTRACCION" ? "Distracción" : null;
    if (fixed) return fixed;

    const minor = new Set(["de", "del", "la", "las", "los", "y"]);
    return raw
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean)
      .map((word, index) => {
        if (index > 0 && minor.has(word)) return word;
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  }

  function eachGeoCoord(geometry, fn) {
    const walk = (value) => {
      if (!Array.isArray(value)) return;
      if (typeof value[0] === "number") {
        fn(value[0], value[1]);
        return;
      }
      value.forEach(walk);
    };
    if (geometry && geometry.coordinates) walk(geometry.coordinates);
  }

  function makeMapProjection(features, box) {
    let minLon = Infinity;
    let maxLon = -Infinity;
    let minLat = Infinity;
    let maxLat = -Infinity;

    features.forEach((feature) => {
      eachGeoCoord(feature.geometry, (lon, lat) => {
        if (lon < minLon) minLon = lon;
        if (lon > maxLon) maxLon = lon;
        if (lat < minLat) minLat = lat;
        if (lat > maxLat) maxLat = lat;
      });
    });

    const midLat = (minLat + maxLat) / 2;
    const k = Math.cos((midLat * Math.PI) / 180);
    const rawW = (maxLon - minLon) * k;
    const rawH = maxLat - minLat;
    const scale = Math.min(box.w / rawW, box.h / rawH);
    const drawW = rawW * scale;
    const drawH = rawH * scale;
    const x0 = box.x + (box.w - drawW) / 2;
    const y0 = box.y + (box.h - drawH) / 2;

    return {
      minLon,
      maxLon,
      minLat,
      maxLat,
      k,
      scale,
      x0,
      y0,
      drawW,
      drawH,
      project(lon, lat) {
        return [x0 + (lon - minLon) * k * scale, y0 + (maxLat - lat) * scale];
      },
      pointAt(u, v) {
        return [x0 + u * drawW, y0 + v * drawH];
      }
    };
  }

  function mapGeometryPath(geometry, projection) {
    const ringPath = (ring) => {
      let d = "";
      ring.forEach((point, index) => {
        const p = projection.project(point[0], point[1]);
        d += (index === 0 ? "M" : "L") + p[0].toFixed(1) + " " + p[1].toFixed(1);
      });
      return d + "Z";
    };

    if (!geometry) return "";
    if (geometry.type === "Polygon") return geometry.coordinates.map(ringPath).join("");
    if (geometry.type === "MultiPolygon") {
      return geometry.coordinates.map((polygon) => polygon.map(ringPath).join("")).join("");
    }
    return "";
  }

  function mapCentroid(feature, projection) {
    const geometry = feature.geometry;
    const ring =
      geometry.type === "Polygon"
        ? geometry.coordinates[0]
        : geometry.coordinates[0] && geometry.coordinates[0][0];
    if (!ring) return [0, 0];

    let area = 0;
    let cx = 0;
    let cy = 0;
    for (let i = 0; i < ring.length - 1; i++) {
      const p0 = projection.project(ring[i][0], ring[i][1]);
      const p1 = projection.project(ring[i + 1][0], ring[i + 1][1]);
      const cross = p0[0] * p1[1] - p1[0] * p0[1];
      area += cross;
      cx += (p0[0] + p1[0]) * cross;
      cy += (p0[1] + p1[1]) * cross;
    }
    area *= 0.5;
    if (Math.abs(area) < 1e-9) return projection.project(ring[0][0], ring[0][1]);
    return [cx / (6 * area), cy / (6 * area)];
  }

  function mapStarPath(cx, cy, radius) {
    let d = "";
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? radius : radius * 0.45;
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      const x = cx + Math.cos(angle) * r;
      const y = cy + Math.sin(angle) * r;
      d += (i === 0 ? "M" : "L") + x.toFixed(1) + " " + y.toFixed(1);
    }
    return d + "Z";
  }

  function renderMap() {
    const host = $("#map-guajira");
    if (!host) return;

    const data = window.GUAJIRA_MAP_DATA;
    if (!data || !data.municipalities || !data.municipalities.features) {
      host.innerHTML =
        '<p class="chart-empty">No se pudo cargar la geometría del mapa. Verifique que <code>map_guajira.js</code> esté junto a esta página.</p>';
      return;
    }

    const munis = data.municipalities.features
      .slice()
      .sort((a, b) => a.properties.name.localeCompare(b.properties.name, "es"));
    const capitalCode = data.meta && data.meta.capital ? data.meta.capital.code : "44001";
    const projection = makeMapProjection(data.municipalities.features, {
      x: 114,
      y: 76,
      w: 806,
      h: 648
    });

    const parts = [];
    parts.push(
      '<svg class="map-svg" viewBox="0 0 1000 800" role="group" aria-labelledby="map-svg-title map-svg-desc" preserveAspectRatio="xMidYMid meet">'
    );
    parts.push('<title id="map-svg-title">Mapa de los 15 municipios de La Guajira</title>');
    parts.push(
      '<desc id="map-svg-desc">Mapa esquemático con límites municipales de referencia del DANE, división político-administrativa de 2012. Incluye un detalle de Colombia para ubicar el departamento.</desc>'
    );

    /* Retícula de referencia: se dibuja debajo de los municipios. */
    parts.push('<g aria-hidden="true">');
    [11, 12].forEach((lat) => {
      const y = projection.project(projection.minLon, lat)[1];
      parts.push(
        `<line class="graticule" x1="${projection.x0.toFixed(1)}" x2="${(projection.x0 + projection.drawW).toFixed(1)}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}"></line>`
      );
    });
    [-73, -72].forEach((lon) => {
      const x = projection.project(lon, projection.minLat)[0];
      parts.push(
        `<line class="graticule" x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${projection.y0.toFixed(1)}" y2="${(projection.y0 + projection.drawH).toFixed(1)}"></line>`
      );
    });
    parts.push("</g>");

    /* Municipios. */
    parts.push('<g class="municipalities" role="group" aria-label="Municipios de La Guajira">');
    munis.forEach((feature) => {
      const props = feature.properties;
      const isCapital = props.code === capitalCode;
      const name = mapName(props.name);
      const label = `${name}${isCapital ? ", capital departamental" : ""}. Código DANE ${props.code}.`;
      parts.push(
        `<g class="municipality${isCapital ? " is-capital" : ""}" data-code="${esc(props.code)}" data-name="${esc(name)}" role="button" tabindex="0" aria-label="${esc(label)}">`
      );
      parts.push(`<title>${esc(label)}</title>`);
      parts.push(
        `<path d="${mapGeometryPath(feature.geometry, projection)}" fill-rule="evenodd"></path>`
      );
      parts.push("</g>");
    });
    parts.push("</g>");

    /* Límite departamental oficial, dibujado encima de los municipios. */
    if (data.department && data.department.features) {
      data.department.features.forEach((feature) => {
        parts.push(
          `<path class="department-outline" d="${mapGeometryPath(feature.geometry, projection)}"></path>`
        );
      });
    }

    /* Marcador de la capital. */
    const capital = data.meta && data.meta.capital ? data.meta.capital : null;
    if (capital) {
      const c = projection.project(capital.lon, capital.lat);
      parts.push('<g class="capital-marker" aria-hidden="true">');
      parts.push(
        `<circle class="capital-halo" cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="11"></circle>`
      );
      parts.push(
        `<path class="capital-star" d="${mapStarPath(c[0], c[1], 8)}" stroke="var(--map-capital)" stroke-width="1.4"></path>`
      );
      parts.push("</g>");
    }

    /* Etiquetas municipales y líneas guía. */
    parts.push('<g aria-hidden="true">');
    munis.forEach((feature) => {
      const cfg = MAP_LABELS[feature.properties.code];
      if (!cfg) return;

      const [lx, ly] = projection.pointAt(cfg.u, cfg.v);
      const className = [
        "map-label",
        cfg.size === "small" ? "small" : "",
        feature.properties.code === capitalCode ? "capital" : ""
      ]
        .filter(Boolean)
        .join(" ");
      const lineHeight = cfg.lines.length > 1 ? 11.5 : 0;
      const startY = ly - ((cfg.lines.length - 1) * lineHeight) / 2;

      if (cfg.leader) {
        const centroid = mapCentroid(feature, projection);
        parts.push(
          `<line class="leader" x1="${centroid[0].toFixed(1)}" y1="${centroid[1].toFixed(1)}" x2="${lx.toFixed(1)}" y2="${(startY + lineHeight / 2).toFixed(1)}"></line>`
        );
        parts.push(
          `<circle class="leader-dot" cx="${centroid[0].toFixed(1)}" cy="${centroid[1].toFixed(1)}" r="1.6"></circle>`
        );
      }

      parts.push(
        `<text class="${className}" x="${lx.toFixed(1)}" y="${startY.toFixed(1)}" text-anchor="${cfg.anchor}">`
      );
      cfg.lines.forEach((line, index) => {
        parts.push(
          `<tspan x="${lx.toFixed(1)}" dy="${index === 0 ? 0 : lineHeight}">${esc(line)}</tspan>`
        );
      });
      parts.push("</text>");
    });
    parts.push("</g>");

    /* Etiquetas de contexto geográfico. */
    parts.push('<g aria-hidden="true">');
    parts.push('<text class="neighbor" x="560" y="116" text-anchor="middle">MAR CARIBE</text>');
    parts.push(
      '<text class="neighbor" x="968" y="470" text-anchor="middle" transform="rotate(90 968 470)">VENEZUELA</text>'
    );
    parts.push('<text class="neighbor small" x="350" y="780" text-anchor="middle">CESAR</text>');
    parts.push(
      '<text class="neighbor small" x="52" y="610" text-anchor="middle" transform="rotate(-90 52 610)">MAGDALENA</text>'
    );
    parts.push("</g>");

    /* Etiquetas de la retícula. */
    parts.push('<g aria-hidden="true">');
    [11, 12].forEach((lat) => {
      const y = projection.project(projection.maxLon, lat)[1];
      parts.push(
        `<text class="graticule-label" x="${(projection.x0 + projection.drawW + 9).toFixed(1)}" y="${(y + 3).toFixed(1)}">${lat}°N</text>`
      );
    });
    [-73, -72].forEach((lon) => {
      const x = projection.project(lon, projection.minLat)[0];
      parts.push(
        `<text class="graticule-label" x="${x.toFixed(1)}" y="${(projection.y0 + projection.drawH + 20).toFixed(1)}" text-anchor="middle">${Math.abs(lon)}°O</text>`
      );
    });
    parts.push("</g>");

    /* Escala gráfica aproximada: 50 km. */
    const scalePx = (50 * projection.scale) / 111.32;
    const sx = 600;
    const sy = 770;
    parts.push('<g aria-hidden="true">');
    parts.push(`<line class="scale-line" x1="${sx}" y1="${sy}" x2="${(sx + scalePx).toFixed(1)}" y2="${sy}"></line>`);
    parts.push(`<line class="scale-line" x1="${sx}" y1="${sy - 4}" x2="${sx}" y2="${sy + 4}"></line>`);
    parts.push(
      `<line class="scale-line" x1="${(sx + scalePx).toFixed(1)}" y1="${sy - 4}" x2="${(sx + scalePx).toFixed(1)}" y2="${sy + 4}"></line>`
    );
    parts.push(
      `<text class="scale-label" x="${(sx + scalePx / 2).toFixed(1)}" y="${sy - 7}" text-anchor="middle">50 km aprox.</text>`
    );
    parts.push("</g>");

    /* Rosa de los vientos. */
    parts.push('<g aria-hidden="true">');
    parts.push('<path class="north-arrow" d="M952 103 L960 126 L952 120 L944 126 Z"></path>');
    parts.push('<text class="north-label" x="952" y="94" text-anchor="middle">N</text>');
    parts.push("</g>");

    /* Inset de Colombia. */
    if (data.colombia && data.colombia.features) {
      const insetBox = { x: 124, y: 112, w: 168, h: 181 };
      const colProjection = makeMapProjection(data.colombia.features, insetBox);
      parts.push('<g class="map-inset" aria-hidden="true">');
      parts.push('<rect class="inset-bg" x="116" y="86" width="184" height="232" rx="12"></rect>');
      parts.push('<text class="inset-title" x="128" y="104">COLOMBIA</text>');
      data.colombia.features.forEach((feature) => {
        const guajira = feature.properties.code === "44";
        parts.push(
          `<path class="inset-dept${guajira ? " is-guajira" : ""}" d="${mapGeometryPath(feature.geometry, colProjection)}"></path>`
        );
      });
      parts.push('<rect class="inset-swatch" x="128" y="300" width="9" height="9" rx="2"></rect>');
      parts.push('<text class="inset-label" x="143" y="308">La Guajira</text>');
      parts.push("</g>");
    }

    parts.push("</svg>");
    host.innerHTML = parts.join("");

    /* Lista de municipios. */
    const list = $("#map-list");
    if (list) {
      list.innerHTML = munis
        .map((feature) => {
          const props = feature.properties;
          const name = mapName(props.name);
          const capitalMark = props.code === capitalCode ? " ★" : "";
          return `<button class="map-chip" type="button" data-code="${esc(props.code)}" aria-pressed="false" title="${esc(name)}">${esc(name)}${capitalMark}</button>`;
        })
        .join("");
    }

    setupMapInteractions(munis, data);
  }

  function setupMapInteractions(munis, data) {
    const host = $("#map-guajira");
    if (!host) return;
    const svg = host.querySelector(".map-svg");
    if (!svg) return;

    const status = $("#map-status");
    const kicker = $("#map-status .map-info-kicker");
    const title = $("#map-info-title");
    const codeEl = $("#map-info-code");
    const note = $("#map-info-note");
    const reset = $("#map-reset");
    const chips = $$(".map-chip", $("#map-list") || document);
    const capitalCode = data.meta && data.meta.capital ? data.meta.capital.code : "44001";
    const byCode = new Map(munis.map((feature) => [feature.properties.code, feature]));
    let selected = null;

    const showInfo = (code) => {
      if (!code || !byCode.has(code)) {
        if (kicker) kicker.textContent = "Departamento";
        if (title) title.textContent = "La Guajira";
        if (codeEl) codeEl.textContent = "15 municipios · DANE 2012";
        if (note) {
          note.textContent =
            "Pasa el cursor, toca un municipio o usa la lista para identificarlo en el mapa.";
        }
        if (status) status.classList.remove("is-capital");
        return;
      }

      const feature = byCode.get(code);
      const isCapital = code === capitalCode;
      if (kicker) kicker.textContent = isCapital ? "Capital departamental" : "Municipio";
      if (title) title.textContent = mapName(feature.properties.name);
      if (codeEl) codeEl.textContent = `Código DANE ${code} · La Guajira`;
      if (note) {
        note.textContent = isCapital
          ? "Sede de la capital departamental. La ubicación del marcador es aproximada."
          : "Municipio de La Guajira. Seleccione otro municipio en el mapa o en la lista.";
      }
      if (status) status.classList.toggle("is-capital", isCapital);
    };

    const syncSelection = () => {
      $$(".municipality", svg).forEach((group) => {
        group.classList.toggle("is-active", group.dataset.code === selected);
      });
      chips.forEach((chip) => {
        const on = chip.dataset.code === selected;
        chip.classList.toggle("is-active", on);
        chip.setAttribute("aria-pressed", on ? "true" : "false");
      });
      if (reset) reset.disabled = !selected;
    };

    const select = (code) => {
      selected = code || null;
      syncSelection();
      showInfo(selected);
    };

    const groupFor = (code) =>
      $$(".municipality", svg).find((group) => group.dataset.code === code);

    svg.addEventListener("click", (event) => {
      const group = event.target.closest(".municipality");
      select(group ? group.dataset.code : null);
    });

    svg.addEventListener("pointerover", (event) => {
      const group = event.target.closest(".municipality");
      if (group) showInfo(group.dataset.code);
    });

    svg.addEventListener("pointerout", (event) => {
      const group = event.target.closest(".municipality");
      if (!group) return;
      if (event.relatedTarget && group.contains(event.relatedTarget)) return;
      showInfo(selected);
    });

    svg.addEventListener("focusin", (event) => {
      const group = event.target.closest(".municipality");
      if (group) showInfo(group.dataset.code);
    });

    svg.addEventListener("focusout", (event) => {
      const group = event.target.closest(".municipality");
      if (!group) return;
      showInfo(selected);
    });

    svg.addEventListener("keydown", (event) => {
      const group = event.target.closest(".municipality");
      if (!group) return;
      if (event.key === "Enter" || event.key === " " || event.key === "Spacebar") {
        event.preventDefault();
        select(group.dataset.code);
      } else if (event.key === "Escape") {
        select(null);
      }
    });

    chips.forEach((chip) => {
      chip.addEventListener("click", () => select(chip.dataset.code));
      chip.addEventListener("pointerenter", () => showInfo(chip.dataset.code));
      chip.addEventListener("pointerleave", () => showInfo(selected));
    });

    if (reset) {
      reset.addEventListener("click", () => {
        const current = groupFor(selected);
        select(null);
        if (current) current.blur();
      });
    }

    syncSelection();
    showInfo(null);
  }

  /* ------------------------------ Dinámica de interfaz ------------------------------ */
  function setupNav() {
    const links = $$(".nav a[href^='#']");
    if (!links.length) return;
    const sections = links
      .map((a) => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    const activate = (id) => {
      links.forEach((l) => {
        const on = l.getAttribute("href") === "#" + id;
        l.classList.toggle("is-active", on);
        if (on) l.setAttribute("aria-current", "location");
        else l.removeAttribute("aria-current");
      });
    };

    if ("IntersectionObserver" in window) {
      const obs = new IntersectionObserver(
        (entries) => {
          entries.forEach((en) => {
            if (en.isIntersecting) activate(en.target.id);
          });
        },
        { rootMargin: "-42% 0px -52% 0px", threshold: 0 }
      );
      sections.forEach((s) => obs.observe(s));
    }

    links.forEach((l) => {
      l.addEventListener("click", () => activate(l.getAttribute("href").slice(1)));
    });
  }

  function setupProgress() {
    const bar = $("#scroll-progress");
    if (!bar) return;
    const update = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - window.innerHeight;
      const pct = total > 0 ? Math.min(100, Math.max(0, (window.scrollY / total) * 100)) : 0;
      bar.style.width = pct.toFixed(2) + "%";
    };
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

  function renderAll() {
    renderKpis();
    renderIpcTable();
    renderEmpTable();
    renderMercadoSexoTable();
    renderDesempleoEdadSexoTable();
    renderPibTable();
    renderInformalidadTable();
    renderCharts();
    renderPibChart();
    renderInformalidadChart();
    renderDesempleoEdadSexoChart();
    renderRamas();
  }

  /* ------------------------------ Inicio ------------------------------ */
  window.addEventListener("DOMContentLoaded", () => {
    const b = $("#path-bundle");
    const i = $("#path-ipc");
    const e = $("#path-emp");
    if (b) b.value = cfg.sources.bundle || "data_guajira.json";
    if (i) i.value = cfg.sources.ipcData || "ipc_riohacha.json";
    if (e) e.value = cfg.sources.empleoData || "empleo_guajira.json";

    const btn = $("#btn-load");
    if (btn) btn.addEventListener("click", loadAll);

    localLoader($("#file-bundle"), "bundle");
    localLoader($("#file-ipc"), "ipc");
    localLoader($("#file-emp"), "emp");

    setupTheme();
    setupNav();
    setupProgress();
    renderMap();
    renderAll();
    loadAll();
  });
})();
