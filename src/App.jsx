import { useState, useMemo } from "react";

const fmt = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const fmtUSD = (n) => "$" + Math.round(n).toLocaleString("en-IN");
const pct = (n) => n.toFixed(1) + "%";

const STAGE_COLORS = {
  0: { bg: "#1a2744", accent: "#4f8ef7", label: "STAGE 1 — OEM PITCH" },
  1: { bg: "#1a2d1a", accent: "#4ecb71", label: "STAGE 2 — LEASING MODEL" },
  2: { bg: "#2d1a2d", accent: "#c87de8", label: "STAGE 2 — OEM MODEL" },
};

function InputBox({ label, value, onChange, prefix = "₹", step = 100 }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={{ fontSize: 10, color: "#8899aa", textTransform: "uppercase", letterSpacing: 1, fontFamily: "IBM Plex Mono, monospace" }}>
        {label}
      </label>
      <div style={{ display: "flex", alignItems: "center", background: "#0d1117", border: "1px solid #2a3548", borderRadius: 6, overflow: "hidden" }}>
        <span style={{ padding: "4px 8px", color: "#4f8ef7", fontSize: 12, fontFamily: "IBM Plex Mono, monospace", background: "#111827" }}>
          {prefix}
        </span>
        <input
          type="number"
          value={value}
          onChange={onChange}
          step={step}
          style={{
            background: "transparent", border: "none", outline: "none",
            color: "#e2e8f0", fontSize: 13, fontFamily: "IBM Plex Mono, monospace",
            padding: "4px 8px", width: "100%"
          }}
        />
      </div>
    </div>
  );
}

function Row({ label, value, type = "cost", note = "", indent = false }) {
  const colors = {
    cost: "#94a3b8",
    sf: "#f59e0b",
    sub: "#e2e8f0",
    total: "#4ecb71",
    header: "#64748b",
    dim: "#475569",
    alert: "#f87171",
  };
  const isSF = type === "sf";
  return (
    <div style={{
      display: "flex", justifyContent: "space-between", alignItems: "center",
      padding: "7px 12px",
      background: isSF ? "rgba(245,158,11,0.08)" : type === "total" ? "rgba(78,203,113,0.08)" : "transparent",
      borderLeft: isSF ? "3px solid #f59e0b" : type === "total" ? "3px solid #4ecb71" : "3px solid transparent",
      borderRadius: 4,
      marginLeft: indent ? 16 : 0,
    }}>
      <span style={{ fontSize: 12, color: colors[type] || "#94a3b8", fontFamily: "IBM Plex Mono, monospace", display: "flex", alignItems: "center", gap: 6 }}>
        {isSF && <span style={{ fontSize: 9, background: "#f59e0b", color: "#000", padding: "1px 4px", borderRadius: 2, fontWeight: 700 }}>SF</span>}
        {label}
        {note && <span style={{ fontSize: 10, color: "#475569", marginLeft: 6 }}>{note}</span>}
      </span>
      <span style={{ fontSize: 13, fontFamily: "IBM Plex Mono, monospace", color: colors[type] || "#94a3b8", fontWeight: type === "total" || type === "sf" ? 700 : 400 }}>
        {value}
      </span>
    </div>
  );
}

function Divider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "8px 0" }}>
      <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
      {label && <span style={{ fontSize: 9, color: "#334155", textTransform: "uppercase", letterSpacing: 2, fontFamily: "IBM Plex Mono, monospace" }}>{label}</span>}
      <div style={{ flex: 1, height: 1, background: "#1e293b" }} />
    </div>
  );
}

function SFSummaryCard({ items, total }) {
  return (
    <div style={{
      background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(245,158,11,0.05))",
      border: "1px solid rgba(245,158,11,0.3)",
      borderRadius: 10, padding: "16px 20px", marginTop: 12
    }}>
      <div style={{ fontSize: 10, color: "#f59e0b", letterSpacing: 2, textTransform: "uppercase", fontFamily: "IBM Plex Mono, monospace", marginBottom: 10 }}>
        ◆ Seven Fincorp Revenue Summary
      </div>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "4px 0", borderBottom: i < items.length - 1 ? "1px solid rgba(245,158,11,0.1)" : "none" }}>
          <span style={{ fontSize: 11, color: "#d4a853", fontFamily: "IBM Plex Mono, monospace" }}>{item.label}</span>
          <span style={{ fontSize: 12, color: "#f59e0b", fontFamily: "IBM Plex Mono, monospace", fontWeight: 600 }}>{item.value}</span>
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(245,158,11,0.3)" }}>
        <span style={{ fontSize: 12, color: "#f59e0b", fontFamily: "IBM Plex Mono, monospace", fontWeight: 700 }}>TOTAL SF MARGIN / VEHICLE</span>
        <span style={{ fontSize: 16, color: "#f59e0b", fontFamily: "IBM Plex Mono, monospace", fontWeight: 700 }}>{total}</span>
      </div>
    </div>
  );
}

export default function EVDealModeller() {
  const [tab, setTab] = useState(0);
  const [p, setP] = useState({
    usdInr: 92,
    fob: 130,
    logistics: 40,
    cha: 70,
    transportFactory: 1200,
    indianComponents: 3200,
    consumables: 1450,
    assembly: 2800,
    mmRate: 6,
    advanceFromImporter: 50000,
    transportDealer: 2500,
    dealerMargin: 7000,
    mfgMargin: 1000,
    actualInsuranceRTO: 5500,
    sundock: 2000,
    deposit: 2500,
    monthlyRentCustomer: 2750,
    monthlyRentLeasingCo: 2500,
    tenure: 24,
    importerMargin10pct: 10,
  });

  const set = (key) => (e) => setP((prev) => ({ ...prev, [key]: parseFloat(e.target.value) || 0 }));

  const c = useMemo(() => {
    const landedPortUSD = p.fob + p.logistics + p.cha;
    const landedPortINR = landedPortUSD * p.usdInr;
    const factoryLanding = landedPortINR + p.transportFactory + p.indianComponents + p.consumables + p.assembly;

    // ── CURRENT MATH ──────────────────────────────────────
    const mmInterest = landedPortINR * (p.mmRate / 100);
    const cpToFactory = factoryLanding + mmInterest;
    const gst1 = cpToFactory * 0.05;
    const salePrice1 = cpToFactory + gst1 + p.transportDealer + p.dealerMargin;

    // ── LEASING MODEL ──────────────────────────────────────
    // Production
    const sfFee_2pct = factoryLanding * 0.02;
    const sfFee_10pct = p.advanceFromImporter * 0.10;
    const totalProductionSF = sfFee_2pct + sfFee_10pct;
    const salePriceToLeasingCo = factoryLanding + p.mfgMargin;

    // Distribution
    const gst2 = salePriceToLeasingCo * 0.05;
    const sfDistributionFee = 1000;
    const totalInsuranceRTO = p.actualInsuranceRTO + sfDistributionFee; // = 6500
    const onRoad = salePriceToLeasingCo + p.transportDealer + gst2 + totalInsuranceRTO;
    const totalAssetCost = onRoad + p.sundock;

    // Revenue
    const sfPerMonth = p.monthlyRentCustomer - p.monthlyRentLeasingCo;
    const sfRentalRevenue = sfPerMonth * p.tenure;
    const totalCustomerRevenue = p.monthlyRentCustomer * p.tenure;
    const leasingCoRevenue = p.monthlyRentLeasingCo * p.tenure;
    const leasingCoMargin = leasingCoRevenue - totalAssetCost;
    const leasingCoROI = (leasingCoMargin / 2) / totalAssetCost;
    const totalSFRevenue = totalProductionSF + sfDistributionFee + sfRentalRevenue;

    // ── OEM MODEL ─────────────────────────────────────────
    const importerMarginAmt = landedPortINR * (p.importerMargin10pct / 100);
    const salePriceToOEM = factoryLanding + importerMarginAmt;

    return {
      landedPortUSD, landedPortINR, factoryLanding,
      mmInterest, cpToFactory, gst1, salePrice1,
      sfFee_2pct, sfFee_10pct, totalProductionSF,
      salePriceToLeasingCo, gst2, sfDistributionFee, totalInsuranceRTO,
      onRoad, totalAssetCost,
      sfPerMonth, sfRentalRevenue, totalCustomerRevenue,
      leasingCoRevenue, leasingCoMargin, leasingCoROI, totalSFRevenue,
      importerMarginAmt, salePriceToOEM,
    };
  }, [p]);

  const tabs = [
    { label: "Current Math", sublabel: "Money Multiplier" },
    { label: "Leasing Model", sublabel: "3-Phase Revenue" },
    { label: "OEM Sale", sublabel: "Direct B2B" },
  ];

  const stages = ["Stage 1", "Stage 2", "Stage 2"];

  return (
    <div style={{
      minHeight: "100vh",
      background: "#080d18",
      fontFamily: "'Syne', sans-serif",
      color: "#e2e8f0",
      padding: "0 0 40px 0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;600;700&family=Syne:wght@400;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ background: "linear-gradient(180deg, #0f1829 0%, #080d18 100%)", borderBottom: "1px solid #1e293b", padding: "16px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 11, color: "#4f8ef7", letterSpacing: 3, textTransform: "uppercase", fontFamily: "IBM Plex Mono, monospace", marginBottom: 2 }}>Seven Fincorp</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", letterSpacing: -0.5 }}>EV Import Deal Modeller</div>
        </div>
        <div style={{
          background: tab === 0 ? "rgba(79,142,247,0.15)" : "rgba(78,203,113,0.15)",
          border: `1px solid ${tab === 0 ? "#4f8ef7" : "#4ecb71"}`,
          borderRadius: 20, padding: "5px 14px",
          fontSize: 11, fontFamily: "IBM Plex Mono, monospace",
          color: tab === 0 ? "#4f8ef7" : "#4ecb71",
          letterSpacing: 1,
        }}>
          {stages[tab]}
        </div>
      </div>

      {/* Base Inputs */}
      <div style={{ background: "#0d1117", borderBottom: "1px solid #1e293b", padding: "14px 28px" }}>
        <div style={{ fontSize: 9, color: "#334155", letterSpacing: 3, textTransform: "uppercase", fontFamily: "IBM Plex Mono, monospace", marginBottom: 10 }}>Base Cost Parameters — Edit to Confirm with OEM</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
          <InputBox label="USD / INR" value={p.usdInr} onChange={set("usdInr")} prefix="₹" step={0.5} />
          <InputBox label="Vehicle FOB" value={p.fob} onChange={set("fob")} prefix="$" step={5} />
          <InputBox label="Logistics" value={p.logistics} onChange={set("logistics")} prefix="$" step={5} />
          <InputBox label="CHA + CR" value={p.cha} onChange={set("cha")} prefix="$" step={5} />
          <InputBox label="Transport to Factory" value={p.transportFactory} onChange={set("transportFactory")} prefix="₹" step={100} />
          <InputBox label="Indian Components" value={p.indianComponents} onChange={set("indianComponents")} prefix="₹" step={100} />
          <InputBox label="Consumables" value={p.consumables} onChange={set("consumables")} prefix="₹" step={100} />
          <InputBox label="Assembly Cost" value={p.assembly} onChange={set("assembly")} prefix="₹" step={100} />
        </div>
        {/* Factory Landing display */}
        <div style={{ marginTop: 10, padding: "8px 12px", background: "#111827", borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: "#64748b", fontFamily: "IBM Plex Mono, monospace" }}>
            Landed Port (USD) = {fmtUSD(c.landedPortUSD)} → INR {fmt(c.landedPortINR)}
            <span style={{ marginLeft: 20 }}>Factory Landing Cost =</span>
          </span>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", fontFamily: "IBM Plex Mono, monospace" }}>{fmt(c.factoryLanding)}</span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", padding: "0 28px", borderBottom: "1px solid #1e293b", background: "#0a0f1e" }}>
        {tabs.map((t, i) => (
          <button key={i} onClick={() => setTab(i)} style={{
            padding: "14px 24px",
            background: "transparent",
            border: "none",
            borderBottom: tab === i ? `2px solid ${i === 0 ? "#4f8ef7" : i === 1 ? "#4ecb71" : "#c87de8"}` : "2px solid transparent",
            cursor: "pointer",
            color: tab === i ? (i === 0 ? "#4f8ef7" : i === 1 ? "#4ecb71" : "#c87de8") : "#475569",
            fontFamily: "Syne, sans-serif",
            fontWeight: tab === i ? 700 : 400,
          }}>
            <div style={{ fontSize: 13 }}>{t.label}</div>
            <div style={{ fontSize: 10, fontFamily: "IBM Plex Mono, monospace", marginTop: 2, opacity: 0.7 }}>{t.sublabel}</div>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={{ padding: "20px 28px", maxWidth: 900, margin: "0 auto" }}>

        {/* ──────── TAB 0: CURRENT MATH ──────── */}
        {tab === 0 && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              {/* Cost Waterfall */}
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", fontFamily: "IBM Plex Mono, monospace", marginBottom: 12 }}>Cost Waterfall</div>
                <div style={{ background: "#0d1117", borderRadius: 10, padding: 12, border: "1px solid #1e293b" }}>
                  <Row label="Vehicle FOB" value={fmtUSD(p.fob)} type="dim" />
                  <Row label="Logistics" value={fmtUSD(p.logistics)} type="dim" />
                  <Row label="CHA + Currency Risk" value={fmtUSD(p.cha)} type="dim" />
                  <Row label="Landed Port (USD)" value={fmtUSD(c.landedPortUSD)} type="sub" />
                  <Row label={`Landed Port @ ₹${p.usdInr}/USD`} value={fmt(c.landedPortINR)} type="sub" />
                  <Divider label="India processing" />
                  <Row label="Transport to Factory" value={fmt(p.transportFactory)} type="dim" indent />
                  <Row label="Indian Components" value={fmt(p.indianComponents)} type="dim" indent />
                  <Row label="Consumables" value={fmt(p.consumables)} type="dim" indent />
                  <Row label="Assembly Cost" value={fmt(p.assembly)} type="dim" indent />
                  <Row label="Factory Landing" value={fmt(c.factoryLanding)} type="total" />
                </div>
              </div>

              {/* Money Multiplier + Sale */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", fontFamily: "IBM Plex Mono, monospace" }}>Money Multiplier + Sale Chain</span>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ fontSize: 10, color: "#f59e0b", fontFamily: "IBM Plex Mono, monospace" }}>MM Rate</span>
                    <input type="number" value={p.mmRate} onChange={set("mmRate")} step={0.5} style={{
                      width: 50, background: "#111827", border: "1px solid #f59e0b44",
                      borderRadius: 4, color: "#f59e0b", fontSize: 13, fontFamily: "IBM Plex Mono, monospace",
                      padding: "3px 6px", outline: "none", textAlign: "center"
                    }} />
                    <span style={{ fontSize: 10, color: "#f59e0b", fontFamily: "IBM Plex Mono, monospace" }}>%</span>
                  </div>
                </div>
                <div style={{ background: "#0d1117", borderRadius: 10, padding: 12, border: "1px solid #1e293b" }}>
                  <Row label="Factory Landing" value={fmt(c.factoryLanding)} type="sub" />
                  <Row
                    label={`Interest @ ${p.mmRate}% on Landed Port`}
                    value={fmt(c.mmInterest)}
                    type="sf"
                    note="45 days"
                  />
                  <Row label="CP to OEM" value={fmt(c.cpToFactory)} type="sub" />
                  <Divider label="Dealer chain" />
                  <Row label="GST @ 5%" value={fmt(c.gst1)} type="dim" indent />
                  <Row label="Transport to Dealer" value={fmt(p.transportDealer)} type="dim" indent />
                  <Row label="Dealer Margin" value={fmt(p.dealerMargin)} type="dim" indent />
                  <Row label="Final Sale Price" value={fmt(c.salePrice1)} type="total" />
                </div>

                {/* Editable dealer fields */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 10 }}>
                  <InputBox label="Transport to Dealer" value={p.transportDealer} onChange={set("transportDealer")} prefix="₹" step={100} />
                  <InputBox label="Dealer Margin" value={p.dealerMargin} onChange={set("dealerMargin")} prefix="₹" step={500} />
                </div>
              </div>
            </div>

            <SFSummaryCard
              items={[
                { label: `Interest on Landed Port @ ${p.mmRate}%`, value: fmt(c.mmInterest) },
              ]}
              total={fmt(c.mmInterest)}
            />

            <div style={{ marginTop: 14, padding: "10px 16px", background: "rgba(79,142,247,0.06)", border: "1px solid rgba(79,142,247,0.2)", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#4f8ef7", fontFamily: "IBM Plex Mono, monospace" }}>
                ◎ Pitch note for tomorrow — OEM uses Seven Fincorp's Money Multiplier for working capital to purchase CKD kits from the importer. SF earns the interest margin. Confirm FOB, logistics & CHA numbers directly with OEM.
              </div>
            </div>
          </div>
        )}

        {/* ──────── TAB 1: LEASING MODEL ──────── */}
        {tab === 1 && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

              {/* PRODUCTION PHASE */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4ecb71", letterSpacing: 3, textTransform: "uppercase", fontFamily: "IBM Plex Mono, monospace", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ background: "#4ecb71", color: "#000", borderRadius: 3, padding: "1px 6px", fontSize: 9 }}>01</span>
                  Production Phase
                </div>
                <div style={{ background: "#0d1117", borderRadius: 10, padding: 12, border: "1px solid #1e293b" }}>
                  <Row label="Factory Landing (OEM cost)" value={fmt(c.factoryLanding)} type="sub" />
                  <Row label="2% Fee on Vehicle Purchase" value={fmt(c.sfFee_2pct)} type="sf" note="charged to OEM" />
                  <Row label="10% of Importer Advance" value={fmt(c.sfFee_10pct)} type="sf" note="via OEM" />
                  <Divider />
                  <Row label="Margin to MFG" value={fmt(p.mfgMargin)} type="dim" />
                  <Row label="Sale Price → Leasing Co" value={fmt(c.salePriceToLeasingCo)} type="sub" />
                </div>
                <div style={{ marginTop: 8 }}>
                  <InputBox label="Advance Billed by OEM to Importer" value={p.advanceFromImporter} onChange={set("advanceFromImporter")} prefix="₹" step={5000} />
                </div>
                <div style={{ marginTop: 6 }}>
                  <InputBox label="MFG Margin per Vehicle" value={p.mfgMargin} onChange={set("mfgMargin")} prefix="₹" step={100} />
                </div>
              </div>

              {/* DISTRIBUTION PHASE */}
              <div>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#4ecb71", letterSpacing: 3, textTransform: "uppercase", fontFamily: "IBM Plex Mono, monospace", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ background: "#4ecb71", color: "#000", borderRadius: 3, padding: "1px 6px", fontSize: 9 }}>02</span>
                  Distribution Phase
                </div>
                <div style={{ background: "#0d1117", borderRadius: 10, padding: 12, border: "1px solid #1e293b" }}>
                  <Row label="Sale Price to Leasing Co" value={fmt(c.salePriceToLeasingCo)} type="sub" />
                  <Row label="GST @ 5%" value={fmt(c.gst2)} type="dim" />
                  <Row label="Transport" value={fmt(p.transportDealer)} type="dim" />
                  <Row label="Actual Insurance + RTO" value={fmt(p.actualInsuranceRTO)} type="dim" />
                  <Row label="SF: Reg + RTO Service Fee" value={fmt(c.sfDistributionFee)} type="sf" note="billed to leasing co" />
                  <Row label="Total Ins/RTO (incl SF fee)" value={fmt(c.totalInsuranceRTO)} type="sub" />
                  <Row label="On-Road Price" value={fmt(c.onRoad)} type="sub" />
                  <Row label="Sun Dock" value={fmt(p.sundock)} type="dim" />
                  <Row label="Total Asset Cost (Leasing Co)" value={fmt(c.totalAssetCost)} type="total" />
                </div>
                <div style={{ marginTop: 8 }}>
                  <InputBox label="Actual Insurance + RTO (excl SF)" value={p.actualInsuranceRTO} onChange={set("actualInsuranceRTO")} prefix="₹" step={100} />
                </div>
              </div>
            </div>

            {/* REVENUE PHASE */}
            <div style={{ marginTop: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#4ecb71", letterSpacing: 3, textTransform: "uppercase", fontFamily: "IBM Plex Mono, monospace", marginBottom: 10, display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ background: "#4ecb71", color: "#000", borderRadius: 3, padding: "1px 6px", fontSize: 9 }}>03</span>
                Revenue Phase — Rental Economics
              </div>
              <div style={{ background: "#0d1117", borderRadius: 10, padding: 12, border: "1px solid #1e293b", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0 }}>
                <div>
                  <Row label="Deposit from Customer" value={fmt(p.deposit)} type="dim" />
                  <Row label="SF Bills Customer / Month" value={fmt(p.monthlyRentCustomer)} type="sf" />
                  <Row label="SF Pays Leasing Co / Month" value={fmt(p.monthlyRentLeasingCo)} type="dim" />
                  <Row label={`SF Net / Month`} value={fmt(c.sfPerMonth)} type="sf" note={`× ${p.tenure} mo`} />
                  <Row label={`SF Rental Revenue (${p.tenure} mo)`} value={fmt(c.sfRentalRevenue)} type="sf" />
                </div>
                <div>
                  <Row label="Tenure" value={`${p.tenure} months`} type="dim" />
                  <Row label="Total Customer Revenue" value={fmt(c.totalCustomerRevenue)} type="sub" />
                  <Row label="Leasing Co Receives" value={fmt(c.leasingCoRevenue)} type="dim" />
                  <Row label="Leasing Co Margin" value={fmt(c.leasingCoMargin)} type={c.leasingCoMargin > 0 ? "total" : "alert"} />
                  <Row label="Leasing Co ROI" value={pct(c.leasingCoROI * 100)} type={c.leasingCoROI > 0 ? "total" : "alert"} />
                </div>
              </div>
              {/* Editable rent inputs */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginTop: 10 }}>
                <InputBox label="SF Bills Customer" value={p.monthlyRentCustomer} onChange={set("monthlyRentCustomer")} prefix="₹" step={50} />
                <InputBox label="SF Pays Leasing Co" value={p.monthlyRentLeasingCo} onChange={set("monthlyRentLeasingCo")} prefix="₹" step={50} />
                <InputBox label="Tenure (months)" value={p.tenure} onChange={set("tenure")} prefix="mo" step={1} />
                <InputBox label="Deposit" value={p.deposit} onChange={set("deposit")} prefix="₹" step={100} />
              </div>
            </div>

            <SFSummaryCard
              items={[
                { label: "Production: 2% on vehicle purchase", value: fmt(c.sfFee_2pct) },
                { label: "Production: 10% of importer advance", value: fmt(c.sfFee_10pct) },
                { label: "Distribution: Reg + RTO service fee", value: fmt(c.sfDistributionFee) },
                { label: `Revenue: ₹${Math.round(c.sfPerMonth)}/mo × ${p.tenure}mo`, value: fmt(c.sfRentalRevenue) },
              ]}
              total={fmt(c.totalSFRevenue)}
            />
          </div>
        )}

        {/* ──────── TAB 2: OEM MODEL ──────── */}
        {tab === 2 && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", fontFamily: "IBM Plex Mono, monospace", marginBottom: 12 }}>Cost Structure</div>
                <div style={{ background: "#0d1117", borderRadius: 10, padding: 12, border: "1px solid #1e293b" }}>
                  <Row label="Landed Port (INR)" value={fmt(c.landedPortINR)} type="sub" />
                  <Row label="Transport to Factory" value={fmt(p.transportFactory)} type="dim" indent />
                  <Row label="Indian Components" value={fmt(p.indianComponents)} type="dim" indent />
                  <Row label="Consumables" value={fmt(p.consumables)} type="dim" indent />
                  <Row label="Assembly Cost" value={fmt(p.assembly)} type="dim" indent />
                  <Row label="Factory Landing" value={fmt(c.factoryLanding)} type="sub" />
                  <Divider />
                  <Row label={`Importer Margin @ ${p.importerMargin10pct}%`} value={fmt(c.importerMarginAmt)} type="dim" note="on landed port" />
                  <Row label="Sale Price to OEM" value={fmt(c.salePriceToOEM)} type="total" />
                </div>
                <div style={{ marginTop: 8 }}>
                  <InputBox label="Importer Margin %" value={p.importerMargin10pct} onChange={set("importerMargin10pct")} prefix="%" step={1} />
                </div>
              </div>

              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#64748b", letterSpacing: 2, textTransform: "uppercase", fontFamily: "IBM Plex Mono, monospace", marginBottom: 12 }}>SF Revenue Model</div>
                <div style={{ background: "#0d1117", borderRadius: 10, padding: 20, border: "1px solid #2a1f40", display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ fontSize: 11, color: "#c87de8", fontFamily: "IBM Plex Mono, monospace", letterSpacing: 1 }}>
                    Distribution & revenue handled by manufacturer
                  </div>
                  <div style={{ fontSize: 12, color: "#475569", fontFamily: "IBM Plex Mono, monospace", lineHeight: 1.8 }}>
                    Revenue model to be structured in Stage 2 discussions after OEM meeting outcome.
                    <br /><br />
                    Possible angles:<br />
                    — Invoice discounting on OEM's receivables<br />
                    — Distributor credit line via MM<br />
                    — Volume-based arrangement fee
                  </div>
                </div>
                <div style={{ marginTop: 10, padding: "10px 14px", background: "rgba(200,125,232,0.06)", border: "1px solid rgba(200,125,232,0.2)", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, color: "#c87de8", fontFamily: "IBM Plex Mono, monospace" }}>
                    ◎ Finalise this model after OEM feedback on Stage 1 and Stage 2 pitches.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
