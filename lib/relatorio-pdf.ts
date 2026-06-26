import { jsPDF } from "jspdf"
import { autoTable } from "jspdf-autotable"
import type { Banca, Aposta, ApostaMultipla } from "./api"

export type BancaHistorico = Banca & {
  resultado_final: string
  apostas_ganhas: number
  apostas_perdidas: number
  apostas: Aposta[]
  multiplas: ApostaMultipla[]
}

type RGB = [number, number, number]

const TEAL: RGB = [36, 140, 116]
const CINZA: RGB = [110, 110, 110]
const CINZA_CLARO: RGB = [235, 238, 237]
const VERDE: RGB = [21, 128, 68]
const VERMELHO: RGB = [188, 46, 46]
const PRETO: RGB = [30, 30, 30]

const MARGEM = 14

function brl(v: number): string {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function dataBr(iso: string | null): string {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("pt-BR")
}

const RESULTADO_LABEL: Record<string, string> = {
  PENDENTE: "Em andamento",
  GANHA: "Green",
  PERDIDA: "Red",
  CANCELADA: "Cancelada",
}

function corResultado(r: string): RGB {
  if (r === "GANHA") return VERDE
  if (r === "PERDIDA") return VERMELHO
  return CINZA
}

function finalY(doc: jsPDF): number {
  return (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY
}

function garantirEspaco(doc: jsPDF, y: number, necessario: number): number {
  const alturaPagina = doc.internal.pageSize.getHeight()
  if (y + necessario > alturaPagina - 18) {
    doc.addPage()
    return MARGEM
  }
  return y
}

export function gerarRelatorioMensalPdf(opts: {
  usuarioNome: string
  periodoLabel: string
  bancas: BancaHistorico[]
}): void {
  const { usuarioNome, periodoLabel, bancas } = opts
  const doc = new jsPDF({ unit: "mm", format: "a4" })
  const largura = doc.internal.pageSize.getWidth()

  doc.setFillColor(...TEAL)
  doc.rect(0, 0, largura, 26, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFont("helvetica", "bold")
  doc.setFontSize(17)
  doc.text("Dono do Jogo", MARGEM, 12)
  doc.setFont("helvetica", "normal")
  doc.setFontSize(10.5)
  doc.text("Relatório mensal da banca", MARGEM, 19)
  doc.setFontSize(9)
  doc.text(periodoLabel, largura - MARGEM, 12, { align: "right" })
  doc.text(`Gerado em ${new Date().toLocaleString("pt-BR")}`, largura - MARGEM, 19, { align: "right" })

  let y = 34
  doc.setTextColor(...PRETO)
  doc.setFontSize(10)
  doc.text(`Apostador: ${usuarioNome}`, MARGEM, y)
  y += 8

  const totalBancas = bancas.length
  const saldoInicialTotal = bancas.reduce((s, b) => s + Number(b.saldo_inicial), 0)
  const saldoFinalTotal = bancas.reduce((s, b) => s + Number(b.saldo_atual), 0)
  const resultadoPeriodo = saldoFinalTotal - saldoInicialTotal
  const ganhas = bancas.reduce((s, b) => s + b.apostas_ganhas, 0)
  const perdidas = bancas.reduce((s, b) => s + b.apostas_perdidas, 0)
  const taxaAcerto = ganhas + perdidas > 0 ? (ganhas / (ganhas + perdidas)) * 100 : 0
  const totalApostado = bancas.reduce((s, b) => {
    const simples = b.apostas.reduce((acc, a) => acc + (a.valor ?? 0), 0)
    const multiplas = b.multiplas.reduce((acc, m) => acc + Number(m.valor), 0)
    return s + simples + multiplas
  }, 0)

  doc.setFont("helvetica", "bold")
  doc.setFontSize(12.5)
  doc.setTextColor(...TEAL)
  doc.text("Resumo geral", MARGEM, y)
  y += 3

  autoTable(doc, {
    startY: y,
    theme: "plain",
    margin: { left: MARGEM, right: MARGEM },
    styles: { fontSize: 9.5, cellPadding: { top: 1.6, bottom: 1.6, left: 0, right: 2 }, textColor: PRETO },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 55 },
      2: { fontStyle: "bold", cellWidth: 55 },
    },
    body: [
      ["Bancas no período", String(totalBancas), "Total apostado", brl(totalApostado)],
      ["Saldo inicial total", brl(saldoInicialTotal), "Apostas Green / Red", `${ganhas} / ${perdidas}`],
      ["Saldo final total", brl(saldoFinalTotal), "Taxa de acerto", `${taxaAcerto.toFixed(1)}%`],
      ["Resultado do período", brl(resultadoPeriodo), "", ""],
    ],
    didParseCell: (data) => {
      if (data.row.index === 3 && data.column.index === 1) {
        data.cell.styles.textColor = resultadoPeriodo >= 0 ? VERDE : VERMELHO
        data.cell.styles.fontStyle = "bold"
      }
    },
  })

  y = finalY(doc) + 10

  const bancasOrdenadas = [...bancas].sort((a, b) => {
    const da = a.data_fechamento ?? a.data_criacao ?? ""
    const db = b.data_fechamento ?? b.data_criacao ?? ""
    return db.localeCompare(da)
  })

  for (const banca of bancasOrdenadas) {
    y = garantirEspaco(doc, y, 26)

    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.setTextColor(...TEAL)
    doc.text(`Banca fechada em ${dataBr(banca.data_fechamento ?? banca.data_criacao)}`, MARGEM, y)

    doc.setFontSize(9.5)
    doc.setTextColor(...corResultado(banca.resultado_final === "Green" ? "GANHA" : banca.resultado_final === "Red" ? "PERDIDA" : ""))
    doc.setFont("helvetica", "bold")
    doc.text(banca.resultado_final, doc.internal.pageSize.getWidth() - MARGEM, y, { align: "right" })
    y += 5

    autoTable(doc, {
      startY: y,
      theme: "grid",
      margin: { left: MARGEM, right: MARGEM },
      styles: { fontSize: 8.5, cellPadding: 1.4, textColor: PRETO },
      headStyles: { fillColor: CINZA_CLARO, textColor: PRETO, fontStyle: "bold" },
      head: [["Saldo inicial", "Saldo final", "Meta", "Stop loss"]],
      body: [[
        brl(Number(banca.saldo_inicial)),
        brl(Number(banca.saldo_atual)),
        banca.meta_diaria != null ? brl(Number(banca.meta_diaria)) : "-",
        banca.stop_loss != null ? brl(Number(banca.stop_loss)) : "-",
      ]],
    })
    y = finalY(doc) + 3

    if (banca.apostas.length > 0) {
      autoTable(doc, {
        startY: y,
        theme: "striped",
        margin: { left: MARGEM, right: MARGEM },
        styles: { fontSize: 8.5, cellPadding: 1.4, textColor: PRETO },
        headStyles: { fillColor: TEAL, textColor: [255, 255, 255], fontStyle: "bold" },
        head: [["Aposta simples", "Odd", "Valor", "Lucro/Prejuízo", "Resultado"]],
        body: banca.apostas.map((a) => [
          a.tipo_aposta,
          a.odd != null ? a.odd.toFixed(2) : "-",
          a.valor != null ? brl(a.valor) : "-",
          a.lucro_prejuizo != null ? brl(a.lucro_prejuizo) : "-",
          RESULTADO_LABEL[a.resultado] ?? a.resultado,
        ]),
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index === 4) {
            data.cell.styles.textColor = corResultado(banca.apostas[data.row.index].resultado)
            data.cell.styles.fontStyle = "bold"
          }
          if (data.section === "body" && data.column.index === 3) {
            const lp = banca.apostas[data.row.index].lucro_prejuizo
            if (lp != null) data.cell.styles.textColor = lp >= 0 ? VERDE : VERMELHO
          }
        },
      })
      y = finalY(doc) + 3
    }

    for (const multipla of banca.multiplas) {
      y = garantirEspaco(doc, y, 20)
      autoTable(doc, {
        startY: y,
        theme: "striped",
        margin: { left: MARGEM, right: MARGEM },
        styles: { fontSize: 8.5, cellPadding: 1.4, textColor: PRETO },
        headStyles: { fillColor: TEAL, textColor: [255, 255, 255], fontStyle: "bold" },
        head: [[
          `Múltipla — odd total ${Number(multipla.odd_total).toFixed(2)} — valor ${brl(Number(multipla.valor))}`,
          "Odd",
          RESULTADO_LABEL[multipla.resultado] ?? multipla.resultado,
        ]],
        body: multipla.itens.map((item) => [
          item.tipo_aposta,
          item.odd.toFixed(2),
          RESULTADO_LABEL[item.resultado] ?? item.resultado,
        ]),
        didParseCell: (data) => {
          if (data.section === "body" && data.column.index === 2) {
            data.cell.styles.textColor = corResultado(multipla.itens[data.row.index].resultado)
            data.cell.styles.fontStyle = "bold"
          }
        },
      })
      y = finalY(doc) + 3
    }

    if (banca.apostas.length === 0 && banca.multiplas.length === 0) {
      doc.setFont("helvetica", "normal")
      doc.setFontSize(9)
      doc.setTextColor(...CINZA)
      doc.text("Nenhuma aposta registrada nesta banca.", MARGEM, y + 2)
      y += 6
    }

    y += 6
  }

  const totalPaginas = doc.getNumberOfPages()
  for (let i = 1; i <= totalPaginas; i++) {
    doc.setPage(i)
    const alturaPagina = doc.internal.pageSize.getHeight()
    doc.setFont("helvetica", "normal")
    doc.setFontSize(8)
    doc.setTextColor(...CINZA)
    doc.text("Dono do Jogo — relatório gerado automaticamente", MARGEM, alturaPagina - 10)
    doc.text(`Página ${i} de ${totalPaginas}`, largura - MARGEM, alturaPagina - 10, { align: "right" })
  }

  const nomeArquivo = `relatorio-banca-${periodoLabel.toLowerCase().replace(/\s+/g, "-")}.pdf`
  doc.save(nomeArquivo)
}
